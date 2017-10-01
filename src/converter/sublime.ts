import { js2xml, xml2js } from 'xml-js';
import * as parseJson from 'parse-json';


const readJson = (input, options) => {
    let data, output;

    // Validate JSON
    try {
        data = parseJson(input);
    } catch (error) {
        throw error;
    }

    let scope = options.scope ? options.scope : data.scope;

    // Minimum requirements
    if (scope === null || typeof data.completions === 'undefined') {
        return console.warn('This doesn\'t seem to be a valid Sublime Text completions file. Aborting.');
    }

    // Conversion
    output = {};
    output.scope = scope;
    output.completions = [];

    let i = 0;
    let ref = data.completions;

    for (let k in ref) {
        let v = ref[k];

        if (v.trigger !== null) {
            let description, trigger;

            // Split tab-separated description
            if (!(v.trigger.indexOf('\t') === -1 || options.ignore_separator === true)) {
                let tabs = v.trigger.split('\t');
                if (tabs.length > 2) {
                    console.warn('Conversion aborted, trigger "' + v.trigger + '" contains multiple tabs');
                }
                trigger = tabs[0];
                description = tabs.slice(-1).pop();
            } else {
                trigger = v.trigger;
                description = null;
            }
            if (description !== null) {
                output.completions[i] = {
                    description: description,
                    trigger: trigger,
                    contents: v.contents
                };
            } else {
                output.completions[i] = {
                    trigger: trigger,
                    contents: v.contents
                };
            }
            i++;
        }
    }
    return output;
};

const readXml = (input, options)  => {
    let data, output;

    // Validate XML
    try {
        data = xml2js(input, {
            spaces: 4,
            compact: true
        });
    } catch (error) {
        throw error;
    }

    let inputScope = (typeof data.snippet.scope['_text'] !== 'undefined') ? data.snippet.scope['_text'] : null;
    let scope = options.scope ? options.scope : inputScope;

    // Minimum requirements
    if (typeof data.snippet.content._cdata === 'undefined') {
        return console.warn('This doesn\'t seem to be a valid Sublime Text snippet file. Aborting.');
    }

    // Get scope, convert if necessary
    output = {};
    if (scope !== null) {
        output.scope = scope;
    }

    let description, trigger, contents;

    if (data.snippet.description) {
        description = data.snippet.description['_text'];
    }

    trigger = data.snippet.tabTrigger['_text'];
    contents = data.snippet.content._cdata.trim();

    if (description) {
        output.completions = [
            {
                description: description,
                trigger: trigger,
                contents: contents
            }
        ];
    } else {
        output.completions = [
            {
                trigger: trigger,
                contents: contents
            }
        ];
    }

    return output;
};

const write_sublime = (input) => {
    if (input.completions.length === 1) {
        return this.writeXml(input);
    }

    return this.writeJson(input);
};

const writeJson = (input) => {
    let completions = [];
    let i = 0;
    let ref = input.completions;
    for (let j = 0, len = ref.length; j < len; j++) {
        let item = ref[j];
        let contents = item.contents;
        let trigger;
        if (item.description) {
            trigger = item.trigger + '\t' + item.description;
        } else {
            trigger = item.trigger;
        }
        completions[i] = {
            contents: contents,
            trigger: trigger
        };
        i++;
    }

    // No scope?
    if (input.scope === null) {
        input.scope = 'source';
    // Remove leading dot
    } else if (input.scope[0] === '.') {
        input.scope = input.scope.substr(1);
    }

    let data = {
        scope: input.scope,
        completions: completions
    };
    let output;
    try {
        output = JSON.stringify(data, null, 4);
    } catch (error) {
        throw error;
    }
    return output;
};

const writeXml = (input) => {
    let obj, output;

    if (input.completions[0].description) {
        obj = {
            snippet: {
                content: {
                    _cdata: input.completions[0].contents
                },
                tabTrigger: {
                    _text: input.completions[0].trigger
                },
                description: {
                    _text: input.completions[0].description
                },
                scope: {
                    _text: input.scope
                }
            }
        };
    } else {
        obj = {
            // _comment: ' ' + this.meta + ' ',
            snippet: {
                content: {
                    _cdata: input.completions[0].contents
                },
                tabTrigger: {
                    _text: input.completions[0].trigger
                },
                scope: {
                    _text: input.scope
                }
            }
        };
    }
    output = js2xml(obj, {
        compact: true,
        spaces: 4
    });
    return output;
};

export { readJson, readXml, writeJson, writeXml };
