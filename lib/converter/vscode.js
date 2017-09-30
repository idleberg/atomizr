"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseJson = require("parse-json");
var util_1 = require("../util");
var read = function (input, options) {
    var data, output;
    // Validate CSON
    try {
        data = parseJson(input);
    }
    catch (error) {
        throw error;
    }
    // Conversion
    output = {
        scope: options.scope,
        completions: []
    };
    for (var key in data) {
        var val = data[key];
        if (val.prefix != null) {
            var body = void 0, trigger = void 0, description = void 0;
            // Create tab-separated description
            body = util_1.removeTrailingTabstops(val.body);
            trigger = val.prefix;
            if (key !== val.prefix) {
                description = key;
            }
            else {
                description = null;
            }
            if (description != null) {
                output.completions.push({
                    trigger: trigger,
                    contents: body,
                    description: description
                });
            }
            else {
                output.completions.push({
                    trigger: trigger,
                    contents: body
                });
            }
        }
    }
    // Minimum requirements
    if (output.completions.length === 0) {
        return console.error('This doesn\'t seem to be a valid Visual Studio Code snippet file. Aborting.');
    }
    return output;
};
exports.read = read;
var write = function (input) {
    var data, ref, output;
    data = {};
    ref = input.completions;
    for (var j = 0, len = ref.length; j < len; j++) {
        var body = void 0, description = void 0;
        var i = ref[j];
        if (i.description) {
            description = i.description;
        }
        else {
            description = i.trigger;
        }
        body = util_1.addTrailingTabstops(i.contents);
        data[description] = {
            prefix: i.trigger,
            body: body
        };
    }
    try {
        output = JSON.stringify(data, null, 4);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.write = write;
