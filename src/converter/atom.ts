import * as parseCson from 'cson-parser';
import { addTrailingTabstops, exceptions, removeTrailingTabstops } from '../util';

const read = (input, options) => {
    let data, output;

    // Validate CSON
    try {
        data = parseCson.parse(input);
    } catch (error) {
        throw error;
    }

    output = {
        scope: null,
        completions: []
    };

    for (let k in data) {
        let v = data[k];

        if (options.scope !== null) {
            output.scope = options.scope;
        } else {
            // Get scope, convert if necessary
            let ref = exceptions;
            for (let scopeSubl in ref) {
                let scopeAtom = ref[scopeSubl];
                if (k === scopeAtom) {
                    output.scope = scopeSubl;
                } else if (k[0] === '.') {
                    output.scope = k.substring(1);
                } else {
                    output.scope = k;
                }
            }
        }

        for (let i in v) {
            let j = v[i];
            if (j.prefix !== null && j.prefix.length > 0) {
                let completions = {};
                // Create tab-separated description
                if (i !== j.description) {
                    completions.trigger = j.prefix;
                    completions.description = i;
                } else {
                    completions.trigger = j.prefix;
                }
                completions.contents = removeTrailingTabstops(j.body);
                output.completions.push(completions);
            }
        }
    }

    // Minimum requirements
    if (output.completions.length === 0) {
        throw 'Error: This doesn\'t seem to be a valid Atom snippet file';
    }
    return output;
};

const write = (input) => {
    let snippet, ref, output, scope, description, body;

    snippet = {};
    ref = exceptions;

    for (let scopeSubl in ref) {
        let scopeAtom = ref[scopeSubl];
        if (input.scope === scopeSubl) {
            scope = scopeAtom;
            break;
        } else {
            if (input.scope[0] !== '.') {
                scope = '.' + input.scope;
            } else {
                scope = input.scope;
            }
        }
    }
    let ref1 = input.completions;
    for (let l = 0, len = ref1.length; l < len; l++) {
        let i = ref1[l];
        if (i.description) {
            description = i.description;
        } else {
            description = i.trigger;
        }
        body = addTrailingTabstops(i.contents);
        snippet[description] = {
            prefix: i.trigger,
            body: body
        };
    }
    output = {};
    output[scope] = snippet;

    output =  parseCson.stringify(output, null, 2);

    return output;
};

export {read, write };
