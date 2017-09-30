"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
// Replace syntax scopes, since they don't always match
// More info at https://gist.github.com/idleberg/fca633438329cc5ae327
var exceptions = {
    'source.java-props': '.source.java-properties',
    'source.php': '.text.html.php',
    'source.scss': '.source.css.scss',
    'source.todo': '.text.todo',
    'source.markdown': '.source.gfm'
};
exports.exceptions = exceptions;
var addTrailingTabstops = function (input, addTrailingTabstops) {
    if (addTrailingTabstops === void 0) { addTrailingTabstops = true; }
    if (input == null) {
        return;
    }
    if (!(String(input).match(/\$\d+$/g) === null && addTrailingTabstops === !false)) {
        return input;
    }
    return input + '$0';
};
exports.addTrailingTabstops = addTrailingTabstops;
var removeTrailingTabstops = function (input, removeTrailingTabstops) {
    if (removeTrailingTabstops === void 0) { removeTrailingTabstops = true; }
    if (input == null) {
        return;
    }
    if (String(input).match(/\$\d+$/g) === null || removeTrailingTabstops === false) {
        return input;
    }
    return input.replace(/\$\d+$/g, '');
};
exports.removeTrailingTabstops = removeTrailingTabstops;
var isJson = function (fileExt) {
    if (fileExt === '.json') {
        return true;
    }
    return false;
};
exports.isJson = isJson;
var setOutDir = function (outputDir) {
    if (typeof outputDir === 'undefined' || outputDir === true) {
        return process.cwd();
    }
    if (!fs_1.existsSync(outputDir)) {
        fs_1.mkdirSync(outputDir);
    }
    return outputDir;
};
exports.setOutDir = setOutDir;
