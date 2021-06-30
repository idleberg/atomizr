import Plist from 'plist';
import { v4 as uuidV4 } from 'uuid';

export default {
    parse(input) {
        const parsedInput = Plist.parse(input);

        const {
            scope,
            content: body,
            name: description,
            tabTrigger: prefix
        } = parsedInput;

        return scope && body?.length && prefix?.length
            ? {
                scope,
                snippets: [
                    {
                        body,
                        description,
                        prefix
                    }
                ]
            } : undefined;
    },

    stringify(input, userOptions = {}) {
        const options = {
            space: 4,
            ...userOptions
        };

        return Plist.build({
            content: input.snippets[0].body,
            tabTrigger: input.snippets[0].prefix,
            name: input.snippets[0].description,
            scope: userOptions.scope || input.scope,
            uuid: uuidV4()
        }, {
            pretty: options.space > 0,
            indent: ' '.repeat(options.space)
        });
    }
}