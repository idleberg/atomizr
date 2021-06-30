import { js2xml, xml2js } from 'xml-js';

export default {
    parse(input) {
        const parsedInput = xml2js(input, { compact: true });
        const {
            scope,
            content: body,
            description,
            tabTrigger: prefix
        } = parsedInput.snippet;

        return scope?._text && body?._cdata && prefix?._text
            ? {
                scope: scope._text,
                snippets: [
                    {
                        body: body._cdata,
                        description: description._text,
                        prefix: prefix._text
                    }
                ]
            } : undefined;
    },

    stringify(input, userOptions = {}) {
        const options = {
            space: 4,
            ...userOptions
        };

        return js2xml({
            snippet: {
                content: {
                    _cdata: input.snippets[0].body
                },
                tabTrigger: {
                    _text: input.snippets[0].prefix
                },
                scope: {
                    _text: userOptions.scope || input.scope
                }
            }
        }, {
            compact: true,
            spaces: options.space
        });
    }
}
