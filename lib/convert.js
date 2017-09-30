"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
var Atom = require("./converter/atom");
var SublimeText = require("./converter/sublime");
var TextMate = require("./converter/textmate");
var Vscode = require("./converter/vscode");
var Yasnippet = require("./converter/yasnippet");
var atom2sublime = function (input, options) {
    var data, output;
    try {
        data = Atom.read(input, options);
        output = SublimeText.writeJson(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.atom2sublime = atom2sublime;
var atom2textmate = function (input, options) {
    var data, output;
    try {
        data = Atom.read(input, options);
        output = TextMate.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.atom2textmate = atom2textmate;
var atom2vscode = function (input, options) {
    var data, output;
    try {
        data = Atom.read(input, options);
        output = Vscode.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.atom2vscode = atom2vscode;
var atom2yasnippet = function (input, options) {
    var data, output;
    try {
        data = Atom.read(input, options);
        output = Yasnippet.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.atom2yasnippet = atom2yasnippet;
// Sublime Text to anything
var sublime2atom = function (input, options) {
    var data, output;
    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        }
        else {
            data = SublimeText.readJson(input, options);
        }
        output = Atom.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.sublime2atom = sublime2atom;
var sublime2textmate = function (input, options) {
    var data, output;
    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        }
        else {
            data = SublimeText.readJson(input, options);
        }
        output = TextMate.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.sublime2textmate = sublime2textmate;
var sublime2vscode = function (input, options) {
    var data, output;
    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        }
        else {
            data = SublimeText.readJson(input, options);
        }
        output = Vscode.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.sublime2vscode = sublime2vscode;
var sublime2yasnippet = function (input, options) {
    var data, output;
    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        }
        else {
            data = SublimeText.readJson(input, options);
        }
        output = Yasnippet.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.sublime2yasnippet = sublime2yasnippet;
// TextMate to anything
var textmate2atom = function (input, options) {
    var data, output;
    try {
        data = TextMate.read(input, options);
        output = Atom.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.textmate2atom = textmate2atom;
var textmate2sublime = function (input, options) {
    var data, output;
    try {
        data = TextMate.read(input, options);
        output = SublimeText.writeJson(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.textmate2sublime = textmate2sublime;
var textmate2vscode = function (input, options) {
    var data, output;
    try {
        data = TextMate.read(input, options);
        output = Vscode.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.textmate2vscode = textmate2vscode;
var textmate2yasnippet = function (input, options) {
    var data, output;
    try {
        data = TextMate.read(input, options);
        output = Yasnippet.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.textmate2yasnippet = textmate2yasnippet;
// Visual Studio Code to anything
var vscode2atom = function (input, options) {
    var data, output;
    try {
        data = Vscode.read(input, options);
        output = Atom.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.vscode2atom = vscode2atom;
var vscode2sublime = function (input, options) {
    var data, output;
    try {
        data = Vscode.read(input, options);
        output = SublimeText.writeJson(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.vscode2sublime = vscode2sublime;
var vscode2textmate = function (input, options) {
    var data, output;
    try {
        data = Vscode.read(input, options);
        output = TextMate.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.vscode2textmate = vscode2textmate;
var vscode2yasnippet = function (input, options) {
    var data, output;
    try {
        data = Vscode.read(input, options);
        output = Yasnippet.write(data);
    }
    catch (error) {
        throw error;
    }
    return output;
};
exports.vscode2yasnippet = vscode2yasnippet;
var convert = function (input, targetDir, opts) {
    fs.readFile(input, function (error, data) {
        if (error)
            throw error;
        var inputFile = data.toString();
        var fileExt = path_1.extname(input);
        var baseName = path_1.basename(input, fileExt);
        var isSnippet;
        if (fileExt === '.sublime-completions') {
            isSnippet = false;
        }
        else if (fileExt === '.sublime-snippet' || input.startsWith('<?xml')) {
            isSnippet = true;
        }
        var output, scope, targetFile;
        if ((fileExt === '.cson' || fileExt === '.json') && opts.source !== 'vscode') {
            scope = opts.grammar ? opts.grammar : null;
            if (opts.target === 'textmate' || opts.target === 'mate') {
                output = _this.atom2textmate(inputFile, { scope: scope });
                targetFile = baseName + ".tmSnippet";
            }
            else if (opts.target === 'vscode' || opts.target === 'code') {
                output = _this.atom2vscode(inputFile, { scope: scope });
                targetFile = baseName + ".json";
            }
            else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = _this.atom2yasnippet(inputFile, { scope: scope });
                targetFile = baseName;
            }
            else if (opts.target === 'atom') {
                return console.log("Skipping \"" + input + "\"");
            }
            else {
                output = _this.atom2sublime(inputFile, { scope: scope });
                targetFile = baseName + ".sublime-completions";
            }
        }
        else if (fileExt === '.sublime-completions' || fileExt === '.sublime-snippet' || opts.source === 'sublime') {
            scope = opts.grammar ? opts.grammar : null;
            var ignore_separator = opts.ignoretab ? true : false;
            if (opts.target === 'textmate' || opts.target === 'mate') {
                output = _this.sublime2textmate(inputFile, { is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator });
                targetFile = baseName + ".tmSnippet";
            }
            else if (opts.target === 'vscode' || opts.target === 'code') {
                output = _this.sublime2vscode(inputFile, { is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator });
                targetFile = baseName + ".json";
            }
            else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = _this.sublime2yasnippet(inputFile, { is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator });
                targetFile = baseName;
            }
            else if (opts.target === 'sublime' || opts.target === 'subl') {
                return console.log("Skipping \"" + input + "\"");
            }
            else {
                output = _this.sublime2atom(inputFile, { is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator });
                targetFile = baseName + ".cson";
            }
        }
        else if (fileExt === '.tmSnippet' || opts.source === 'textmate') {
            scope = opts.grammar ? opts.grammar : null;
            if (opts.target === 'sublime' || opts.target === 'subl') {
                output = _this.textmate2sublime(inputFile, { scope: scope });
                targetFile = baseName + ".sublime-completions";
            }
            else if (opts.target === 'vscode' || opts.target === 'code') {
                output = _this.textmate2vscode(inputFile, { scope: scope });
                targetFile = baseName + ".json";
            }
            else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = _this.textmate2yasnippet(inputFile, { scope: scope });
                targetFile = baseName;
            }
            else if (opts.target === 'textmate' || opts.target === 'mate') {
                return console.log("Skipping \"" + input + "\"");
            }
            else {
                output = _this.textmate2atom(inputFile, { scope: scope });
                targetFile = baseName + ".cson";
            }
        }
        else if (fileExt === '.json' || opts.source === 'vscode') {
            scope = opts.grammar ? opts.grammar : '.source';
            if (opts.target === 'sublime' || opts.target === 'subl') {
                output = _this.vscode2sublime(inputFile, { scope: scope });
                targetFile = baseName + ".sublime-completions";
            }
            else if (opts.target === 'textmate' || opts.target === 'mate') {
                output = _this.vscode2textmate(inputFile, { scope: scope });
                targetFile = baseName + ".tmSnippet";
            }
            else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = _this.vscode2yasnippet(inputFile, { scope: scope });
                targetFile = baseName;
            }
            else if (opts.target === 'vscode' || opts.target === 'code') {
                return console.log("Skipping \"" + input + "\"");
            }
            else {
                output = _this.vscode2atom(inputFile, { scope: scope });
                targetFile = baseName + ".cson";
            }
        }
        else {
            return console.error('Error: Unsupported file-type');
        }
        var targetPath = path_1.join(targetDir, targetFile);
        console.log("Writing \"" + targetFile + "\"");
        try {
            fs.writeFileSync(targetPath, output);
        }
        catch (e) {
            console.log(e);
        }
    });
};
exports.convert = convert;
