import JSON5 from 'json5';

export default {
    parse(input) {
        const parsedInput = JSON5.parse(input);

        const snippets = Object.keys(parsedInput).map(snippet => {
            const { body, description, prefix } = parsedInput[snippet];
            
            return body?.length && prefix?.length
                ? {
                    body,
                    description,
                    prefix
                } : undefined;
        });

        return {
            scope: undefined,
            snippets
        };
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

        return JSON.stringify(snippets, null, options.space);
    }
}