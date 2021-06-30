import JSON5 from 'json5';
import CSON from 'cson-parser';
import { isCSON } from 'is-cson';

export default {
    parse(input) {
        const parsedInput = (isCSON(input)
            ? CSON.parse(input)
            : JSON5.parse(input)
        );

        const scopes = Object.keys(parsedInput);

        return scopes.map(scope => {
            const snippets = Object.keys(parsedInput[scope]).map(snippet => {
                const { body, description, prefix } = parsedInput[scope][snippet];
                
                return body?.length && prefix?.length
                    ? {
                        body,
                        description,
                        prefix
                    } : undefined;
            });

            return {
                scope,
                snippets
            };
        }).filter(item => item)[0];
    },

    stringify(input, userOptions = {}) {
        const options = {
            space: 4,
            ...userOptions
        };
        const snippets = {};

        input.snippets.map(snippet => {
            snippets[snippet.prefix] = {
                body: snippet.body,
                description: snippet.description,
                prefix: snippet.prefix
            };
        });
        
        return JSON.stringify({
            [userOptions.scope || input.scope]: snippets
        }, null, options.space);
    }
}