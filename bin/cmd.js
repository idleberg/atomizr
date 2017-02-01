#!/usr/bin/env node

const meta = require('../package.json');
const Atomizr = require('../index.js');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
    .version(meta.version)
    .arguments('<file>')
    .usage('<file> [options]')
    .option('-s, --source [source]', 'specify conversion source')
    .option('-t, --target [target]', 'specify conversion target', 'atom')
    .option('-g, --grammar [scope]', 'specify grammar scope for Visual Studio Code source')
    .option('-I, --ignoretab', 'ignore tab-stop separator')
    .action(function(file) {
        readFile(file, program);
    })
 .parse(process.argv);

if (program.args.length === 0) program.help();

function readFile(input, opts) {
    fs.readFile(input, (error, data) => {
        if (error) throw error;

        let inputFile = data.toString();
        let fileExt = path.extname(input);

        let isSnippet;
        if (fileExt === '.sublime-completions') {
            isSnippet = false;
        } else if (fileExt === '.sublime-snippet' || input.startsWith('<?xml')) {
            isSnippet = true;
        }

        let output, scope;
        if ((fileExt === '.cson' || fileExt === '.json') && opts.source !== 'vscode') {
            scope = opts.grammar ? opts.grammar : null;

            if (opts.target === 'sublime') {
                output = Atomizr.atom2textmate(inputFile, {scope: scope});
            } else if (opts.target === 'vscode') {
                output = Atomizr.atom2vscode(inputFile, {scope: scope});
            } else {
                output = Atomizr.atom2sublime(inputFile, {scope: scope});
            }
        } else if (fileExt === '.sublime-completions' || fileExt === '.sublime-snippet' || opts.source === 'sublime') {
            scope = opts.grammar ? opts.grammar : null;
            let ignore_separator = opts.ignoretab ? true : false;
            
            if (opts.target === 'textmate') {
                output = Atomizr.sublime2textmate(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
            } else if (opts.target === 'vscode') {
                output = Atomizr.sublime2vscode(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
            } else {
                output = Atomizr.sublime2atom(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
            }
        } else if (fileExt === '.tmSnippet' || opts.source === 'textmate') {
            scope = opts.grammar ? opts.grammar : null;

            if (opts.target === 'sublime') {
                output = Atomizr.textmate2sublime(inputFile, {scope: scope});
            } else if (opts.target === 'vscode') {
                output = Atomizr.textmate2vscode(inputFile, {scope: scope});
            } else {
                output = Atomizr.textmate2atom(inputFile, {scope: scope});
            }
        } else if (fileExt === '.json' || opts.source === 'vscode') {
            scope = opts.grammar ? opts.grammar : '.source';
            
            if (opts.target === 'sublime') {
                output = Atomizr.vscode2sublime(inputFile, {scope: scope});
            } else if (opts.target === 'textmate') {
                output = Atomizr.vscode2textmate(inputFile, {scope: scope});
            } else {
                output = Atomizr.vscode2atom(inputFile, {scope: scope});
            }
        } else {
            return console.error('Error: Unsupported file-type');
        }

        console.log(output);
    });
}
