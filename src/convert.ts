import fs = require('fs');
import { basename, extname, join } from 'path';

import * as Atom from './converter/atom';
import * as SublimeText from './converter/sublime';
import * as TextMate from './converter/textmate';
import * as Vscode from './converter/vscode';
import * as Yasnippet from './converter/yasnippet';

const atom2sublime = (input, options) => {
    let data, output;

    try {
        data = Atom.read(input, options);
        output = SublimeText.writeJson(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const atom2textmate = (input, options) => {
    let data, output;

    try {
        data = Atom.read(input, options);
        output = TextMate.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const atom2vscode = (input, options) => {
    let data, output;

    try {
        data = Atom.read(input, options);
        output = Vscode.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const atom2yasnippet = (input, options) => {
    let data, output;

    try {
        data = Atom.read(input, options);
        output = Yasnippet.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

// Sublime Text to anything

const sublime2atom = (input, options) => {
    let data, output;

    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        } else {
            data = SublimeText.readJson(input, options);
        }
        output = Atom.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const sublime2textmate = (input, options) => {
    let data, output;

    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        } else {
            data = SublimeText.readJson(input, options);
        }
        output = TextMate.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const sublime2vscode = (input, options) => {
    let data, output;

    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        } else {
            data = SublimeText.readJson(input, options);
        }
        output = Vscode.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const sublime2yasnippet = (input, options) => {
    let data, output;

    try {
        if (options.is_snippet === true) {
            data = SublimeText.readXml(input, options);
        } else {
            data = SublimeText.readJson(input, options);
        }
        output = Yasnippet.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

// TextMate to anything

const textmate2atom = (input, options) => {
    let data, output;

    try {
        data = TextMate.read(input, options);
        output = Atom.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const textmate2sublime = (input, options) => {
    let data, output;

    try {
        data = TextMate.read(input, options);
        output = SublimeText.writeJson(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const textmate2vscode = (input, options) => {
    let data, output;

    try {
        data = TextMate.read(input, options);
        output = Vscode.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const textmate2yasnippet = (input, options) => {
    let data, output;

    try {
        data = TextMate.read(input, options);
        output = Yasnippet.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

// Visual Studio Code to anything

const vscode2atom = (input, options) => {
    let data, output;

    try {
        data = Vscode.read(input, options);
        output = Atom.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const vscode2sublime = (input, options) => {
    let data, output;

    try {
        data = Vscode.read(input, options);
        output = SublimeText.writeJson(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const vscode2textmate = (input, options) => {
    let data, output;

    try {
        data = Vscode.read(input, options);
        output = TextMate.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const vscode2yasnippet = (input, options) => {
    let data, output;

    try {
        data = Vscode.read(input, options);
        output = Yasnippet.write(data);
    } catch (error) {
        throw error;
    }

    return output;
};

const convert = (input, targetDir, opts) => {
    fs.readFile(input, (error, data) => {
        if (error) throw error;

        let inputFile = data.toString();
        let fileExt = extname(input);
        let baseName = basename(input, fileExt);

        let isSnippet;
        if (fileExt === '.sublime-completions') {
            isSnippet = false;
        } else if (fileExt === '.sublime-snippet' || input.startsWith('<?xml')) {
            isSnippet = true;
        }

        let output, scope, targetFile;
        if ((fileExt === '.cson' || fileExt === '.json') && opts.source !== 'vscode') {
            scope = opts.grammar ? opts.grammar : null;

            if (opts.target === 'textmate' || opts.target === 'mate') {
                output = this.atom2textmate(inputFile, {scope: scope});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                output = this.atom2vscode(inputFile, {scope: scope});
                targetFile = `${baseName}.json`;
            } else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = this.atom2yasnippet(inputFile, {scope: scope});
                targetFile = baseName;
            } else if (opts.target === 'atom') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = this.atom2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            }
        } else if (fileExt === '.sublime-completions' || fileExt === '.sublime-snippet' || opts.source === 'sublime') {
            scope = opts.grammar ? opts.grammar : null;
            let ignore_separator = opts.ignoretab ? true : false;

            if (opts.target === 'textmate' || opts.target === 'mate') {
                output = this.sublime2textmate(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                output = this.sublime2vscode(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.json`;
            } else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = this.sublime2yasnippet(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = baseName;
            } else if (opts.target === 'sublime' || opts.target === 'subl') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = this.sublime2atom(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.cson`;
            }
        } else if (fileExt === '.tmSnippet' || opts.source === 'textmate') {
            scope = opts.grammar ? opts.grammar : null;

            if (opts.target === 'sublime' || opts.target === 'subl') {
                output = this.textmate2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                output = this.textmate2vscode(inputFile, {scope: scope});
                targetFile = `${baseName}.json`;
            } else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = this.textmate2yasnippet(inputFile, {scope: scope});
                targetFile = baseName;
            } else if (opts.target === 'textmate' || opts.target === 'mate') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = this.textmate2atom(inputFile, {scope: scope});
                targetFile = `${baseName}.cson`;
            }
        } else if (fileExt === '.json' || opts.source === 'vscode') {
            scope = opts.grammar ? opts.grammar : '.source';

            if (opts.target === 'sublime' || opts.target === 'subl') {
                output = this.vscode2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            } else if (opts.target === 'textmate' || opts.target === 'mate') {
                output = this.vscode2textmate(inputFile, {scope: scope});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'yasnippet' || opts.target === 'yas') {
                output = this.vscode2yasnippet(inputFile, {scope: scope});
                targetFile = baseName;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = this.vscode2atom(inputFile, {scope: scope});
                targetFile = `${baseName}.cson`;
            }
        } else {
            return console.error('Error: Unsupported file-type');
        }

        let targetPath = join(targetDir, targetFile);

        console.log(`Writing "${targetFile}"`);
        try {
            fs.writeFileSync(targetPath, output);
        } catch (e) {
            console.log(e);
        }
    });
};

export {
    atom2sublime,
    atom2textmate,
    atom2vscode,
    sublime2atom,
    sublime2textmate,
    sublime2vscode,
    sublime2yasnippet,
    textmate2atom,
    textmate2sublime,
    textmate2vscode,
    textmate2yasnippet,
    vscode2atom,
    vscode2sublime,
    vscode2textmate,
    vscode2yasnippet,
    atom2yasnippet,
    convert
};
