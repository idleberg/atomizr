#!/usr/bin/env node

const meta = require('../package.json');
const Atomizr = require('../index.js');
const program = require('commander');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

program
    .version(meta.version)
    .arguments('<file>')
    .usage('<file> [options]')
    .option('-s, --source [source]', 'specify conversion source')
    .option('-t, --target [target]', 'specify conversion target', 'atom')
    .option('-g, --grammar [scope]', 'specify grammar scope for Visual Studio Code source')
    .option('-I, --ignoretab', 'ignore tab-stop separator')
    .action(function(pattern) {
        glob(pattern, function (error, files) {
            if (error) throw error;

            files.forEach(function(filePath) {
                readFile(filePath, program);
            });
        });
    })
 .parse(process.argv);

if (program.args.length === 0) program.help();

function readFile(input, opts) {
    fs.readFile(input, (error, data) => {
        if (error) throw error;

        let inputFile = data.toString();
        let fileExt = path.extname(input);
        let baseName = path.basename(input, fileExt);

        let isSnippet;
        if (fileExt === '.sublime-completions') {
            isSnippet = false;
        } else if (fileExt === '.sublime-snippet' || input.startsWith('<?xml')) {
            isSnippet = true;
        }

        let output, scope, targetFile;
        if ((fileExt === '.cson' || fileExt === '.json') && opts.source !== 'vscode') {
            scope = opts.grammar ? opts.grammar : null;

            if (opts.target === 'textmate') {
                output = Atomizr.atom2textmate(inputFile, {scope: scope});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'vscode') {
                output = Atomizr.atom2vscode(inputFile, {scope: scope});
                targetFile = `${baseName}.json`;
            } else {
                output = Atomizr.atom2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            }
        } else if (fileExt === '.sublime-completions' || fileExt === '.sublime-snippet' || opts.source === 'sublime') {
            scope = opts.grammar ? opts.grammar : null;
            let ignore_separator = opts.ignoretab ? true : false;
            
            if (opts.target === 'textmate') {
                output = Atomizr.sublime2textmate(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'vscode') {
                output = Atomizr.sublime2vscode(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.json`;
            } else {
                output = Atomizr.sublime2atom(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.cson`;
            }
        } else if (fileExt === '.tmSnippet' || opts.source === 'textmate') {
            scope = opts.grammar ? opts.grammar : null;

            if (opts.target === 'sublime') {
                output = Atomizr.textmate2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            } else if (opts.target === 'vscode') {
                output = Atomizr.textmate2vscode(inputFile, {scope: scope});
                targetFile = `${baseName}.json`;
            } else {
                output = Atomizr.textmate2atom(inputFile, {scope: scope});
                targetFile = `${baseName}.cson`;
            }
        } else if (fileExt === '.json' || opts.source === 'vscode') {
            scope = opts.grammar ? opts.grammar : '.source';
            
            if (opts.target === 'sublime') {
                output = Atomizr.vscode2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            } else if (opts.target === 'textmate') {
                output = Atomizr.vscode2textmate(inputFile, {scope: scope});
                targetFile = `${baseName}.tmSnippet`;
            } else {
                output = Atomizr.vscode2atom(inputFile, {scope: scope});
                targetFile = `${baseName}.cson`;
            }
        } else {
            return console.error('Error: Unsupported file-type');
        }

        fs.writeFile(targetFile, output, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`Writing "${targetFile}"`);
        });
    });
}
