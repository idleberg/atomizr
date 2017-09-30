"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var xml_js_1 = require("xml-js");
var parseJson = require("parse-json");
var readJson = function (input, options) {
    var data, output;
    // Validate JSON
    try {
        data = parseJson(input);
    }
    catch (error) {
        throw error;
    }
    var scope = options.scope ? options.scope : data.scope;
    // Minimum requirements
    if (!((scope != null) || (data.completions != null))) {
        return console.warn('This doesn\'t seem to be a valid Sublime Text completions file. Aborting.');
    }
    // Conversion
    output = {};
    output.scope = scope;
    output.completions = [];
    var i = 0;
    var ref = data.completions;
    for (var k in ref) {
        var v = ref[k];
        if (v.trigger !== null) {
            var description = void 0, trigger = void 0;
            // Split tab-separated description
            if (!(v.trigger.indexOf('\t') === -1 || options.ignore_separator === true)) {
                var tabs = v.trigger.split('\t');
                if (tabs.length > 2) {
                    console.warn('Conversion aborted, trigger "' + v.trigger + '" contains multiple tabs');
                }
                trigger = tabs[0];
                description = tabs.slice(-1).pop();
            }
            else {
                trigger = v.trigger;
                description = null;
            }
            if (description !== null) {
                output.completions[i] = {
                    description: description,
                    trigger: trigger,
                    contents: v.contents
                };
            }
            else {
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
exports.readJson = readJson;
var readXml = function (input, options) {
    var data, output;
    // Validate XML
    try {
        data = xml_js_1.xml2js(input, {
            spaces: 4,
            compact: true
        });
    }
    catch (error) {
        throw error;
    }
    var inputScope = (typeof data.snippet.scope['_text'] !== 'undefined') ? data.snippet.scope['_text'] : 'source';
    var scope = options.scope ? options.scope : inputScope;
    // Minimum requirements
    if (data.snippet.content._cdata !== null) {
        return console.warn('This doesn\'t seem to be a valid Sublime Text snippet file. Aborting.');
    }
    // Get scope, convert if necessary
    output = {};
    output.scope = scope;
    var description, trigger, contents;
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
    }
    else {
        output.completions = [
            {
                trigger: trigger,
                contents: contents
            }
        ];
    }
    return output;
};
exports.readXml = readXml;
var write_sublime = function (input) {
    if (input.completions.length === 1) {
        return _this.writeXml(input);
    }
    return _this.writeJson(input);
};
var writeJson = function (input) {
    var completions = [];
    var i = 0;
    var ref = input.completions;
    for (var j = 0, len = ref.length; j < len; j++) {
        var item = ref[j];
        var contents = item.contents;
        var trigger = void 0;
        if (item.description) {
            trigger = item.trigger + '\t' + item.description;
        }
        else {
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
    }
    else if (input.scope[0] === '.') {
        input.scope = input.scope.substr(1);
    }
    var data = {
        scope: input.scope,
        completions: completions
    };
    var output;
    try {
        output = JSON.stringify(data, null, 4);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.writeJson = writeJson;
var writeXml = function (input) {
    var obj, output;
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
    }
    else {
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
    output = xml_js_1.js2xml(obj, {
        compact: true,
        spaces: 4
    });
    return output;
};
exports.writeXml = writeXml;
