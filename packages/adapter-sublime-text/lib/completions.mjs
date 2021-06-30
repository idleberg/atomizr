import JSON from 'json5';

export default {
    parse(input) {
        const parsedInput = JSON.parse(input);

        const { scope, completions } = parsedInput;

        const snippets = completions.map(completion => {
            const { contents, trigger } = completion;

            if (!contents?.length || !trigger?.length) return;

            const fragments = contents.split('\\t');
            const body = fragments[0];
            const description = fragments.length > 2
                ? fragments.shift().join('\n')
                : fragments[1];

            return body?.length && trigger?.length
                ? {
                    body,
                    description,
                    prefix: trigger
                } : undefined;
        }).filter(item => item);

        return {
            scope,
            snippets
        }
    },

    stringify(input, userOptions = {}) {
        const options = {
            space: 4,
            ...userOptions
        };
        const completions = {};

        input.snippets.map(snippet => {
            completions[snippet.prefix] = {
                body: snippet.body,
                description: snippet.description,
                prefix: snippet.prefix
            };
        });

        return JSON.stringify({
            scope: userOptions.scope || input.scope,
            completions: input.snippets.map(snippet => {
                return {
                    trigger: snippet.prefix,
                    contents: snippet.description
                        ? `${snippet.body}\t${snippet.description}`
                        : snippet.body
                }
            })
        }, null, options.space);
    }
}