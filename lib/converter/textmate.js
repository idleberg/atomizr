"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plist_1 = require("plist");
var uuid_1 = require("uuid");
var read = function (input, options) {
    var data, output;
    try {
        data = plist_1.parse(input);
    }
    catch (error) {
        throw error;
    }
    var scope = options.scope ? options.scope : data.scope;
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
exports.read = read;
var write = function (input) {
    var data, name, output;
    if (input.completions[0].description) {
        name = input.completions[0].description;
    }
    else {
        name = input.completions[0].trigger;
    }
    // No scope?
    if (input.scope === null) {
        input.scope = 'source';
        // Remove leading dot
    }
    else if (input.scope[0] === '.') {
        input.scope = input.scope.substr(1);
    }
    data = {
        content: input.completions[0].contents,
        tabTrigger: input.completions[0].trigger,
        name: name,
        scope: input.scope,
        uuid: uuid_1.v4()
    };
    output = plist_1.build(data);
    return output;
};
exports.write = write;
