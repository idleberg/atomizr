import { build, parse } from 'plist';
import { v4 } from 'uuid';

const read = (input, options) => {
    let data, output;

    try {
        data = parse(input);
    } catch (error) {
        throw error;
    }

    let scope = options.scope ? options.scope : data.scope;

    if (!((data.content != null) && (data.tabTrigger != null) && (scope != null))) {
        return console.warn('This doesn\'t seem to be a valid TextMate snippet file. Aborting.');
    }

    output = {
        scope: scope,
        completions: [
            {
                contents: data.content,
                trigger: data.tabTrigger
            }
        ]
    };

    return output;
};

const write = (input) => {
    let data, name, output;

    if (input.completions[0].description) {
        name = input.completions[0].description;
    } else {
        name = input.completions[0].trigger;
    }

    // No scope?
    if (input.scope === null) {
        input.scope = 'source';
    // Remove leading dot
    } else if (input.scope[0] === '.') {
        input.scope = input.scope.substr(1);
    }

    data = {
        content: input.completions[0].contents,
        tabTrigger: input.completions[0].trigger,
        name: name,
        scope: input.scope,
        uuid: v4()
    };

    output = build(data);
    return output;
};

export { read, write };
