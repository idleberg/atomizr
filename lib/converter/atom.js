"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseCson = require("cson-parser");
var util_1 = require("../util");
var read = function (input, options) {
    var data, output;
    // Validate CSON
    try {
        data = parseCson.parse(input);
    }
    catch (error) {
        throw error;
    }
    output = {
        scope: null,
        completions: []
    };
    for (var k in data) {
        var v = data[k];
        if (options.scope !== null) {
            output.scope = options.scope;
        }
        else {
            // Get scope, convert if necessary
            var ref = util_1.exceptions;
            for (var scopeSubl in ref) {
                var scopeAtom = ref[scopeSubl];
                if (k === scopeAtom) {
                    output.scope = scopeSubl;
                }
                else if (k[0] === '.') {
                    output.scope = k.substring(1);
                }
                else {
                    output.scope = k;
                }
            }
        }
        for (var i in v) {
            var j = v[i];
            if (j.prefix !== null && j.prefix.length > 0) {
                var completions = {};
                // Create tab-separated description
                if (i !== j.description) {
                    completions.trigger = j.prefix;
                    completions.description = i;
                }
                else {
                    completions.trigger = j.prefix;
                }
                completions.contents = util_1.removeTrailingTabstops(j.body);
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
exports.read = read;
var write = function (input) {
    var snippet, ref, output, scope, description, body;
    snippet = {};
    ref = util_1.exceptions;
    for (var scopeSubl in ref) {
        var scopeAtom = ref[scopeSubl];
        if (input.scope === scopeSubl) {
            scope = scopeAtom;
            break;
        }
        else {
            if (input.scope[0] !== '.') {
                scope = '.' + input.scope;
            }
            else {
                scope = input.scope;
            }
        }
    }
    var ref1 = input.completions;
    for (var l = 0, len = ref1.length; l < len; l++) {
        var i = ref1[l];
        if (i.description) {
            description = i.description;
        }
        else {
            description = i.trigger;
        }
        body = util_1.addTrailingTabstops(i.contents);
        snippet[description] = {
            prefix: i.trigger,
            body: body
        };
    }
    output = {};
    output[scope] = snippet;
    output = parseCson.stringify(output, null, 2);
    return output;
};
exports.write = write;
