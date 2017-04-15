#!/usr/bin/env node

const meta = require('../package.json');
const Atomizr = require('../index.js');
const program = require('commander');
const fs = require('fs');
const glob = require('wildglob');
const path = require('path');
const updateNotifier = require('update-notifier');

// Checks for available update and returns an instance
const notifier = updateNotifier({pkg: meta});

// Notify using the built-in convenience method
if (notifier.update) {
    console.log(`\nUpdate available: ${notifier.update.latest}`);
}

program
    .version(meta.version)
    .arguments('<file>')
    .usage('<file> [options]')
    .option('-s, --source [source]', 'specify conversion source')
    .option('-t, --target [target]', 'specify conversion target', 'atom')
    .option('-o, --outdir [directory]', 'specify default output directory')
    .option('-g, --grammar [scope]', 'specify grammar scope for Visual Studio Code source')
    .option('-I, --ignoretab', 'ignore tab-stop separator')
    .action(function(pattern) {

        let opts = {
            nodir: true,
            statCache: true,
            cache:true
        };

        glob(pattern, opts, function (error, files) {
            if (error) throw error;

            files.forEach(function(filePath) {
                readFile(filePath, outputDir(program.outdir), program);
            });
        });

    })
    .parse(process.argv);

if (program.args.length === 0) program.help();

function readFile(input, targetDir, opts) {
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

            if (opts.target === 'textmate' || opts.target === 'mate') {
                output = Atomizr.atom2textmate(inputFile, {scope: scope});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                output = Atomizr.atom2vscode(inputFile, {scope: scope});
                targetFile = `${baseName}.json`;
            } else if (opts.target === 'atom') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = Atomizr.atom2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            }
        } else if (fileExt === '.sublime-completions' || fileExt === '.sublime-snippet' || opts.source === 'sublime') {
            scope = opts.grammar ? opts.grammar : null;
            let ignore_separator = opts.ignoretab ? true : false;
            
            if (opts.target === 'textmate' || opts.target === 'mate') {
                output = Atomizr.sublime2textmate(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                output = Atomizr.sublime2vscode(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.json`;
            } else if (opts.target === 'sublime' || opts.target === 'subl') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = Atomizr.sublime2atom(inputFile, {is_snippet: isSnippet, scope: scope, ignore_separator: ignore_separator});
                targetFile = `${baseName}.cson`;
            }
        } else if (fileExt === '.tmSnippet' || opts.source === 'textmate') {
            scope = opts.grammar ? opts.grammar : null;

            if (opts.target === 'sublime' || opts.target === 'subl') {
                output = Atomizr.textmate2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                output = Atomizr.textmate2vscode(inputFile, {scope: scope});
                targetFile = `${baseName}.json`;
            } else if (opts.target === 'textmate' || opts.target === 'mate') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = Atomizr.textmate2atom(inputFile, {scope: scope});
                targetFile = `${baseName}.cson`;
            }
        } else if (fileExt === '.json' || opts.source === 'vscode') {
            scope = opts.grammar ? opts.grammar : '.source';
            
            if (opts.target === 'sublime' || opts.target === 'subl') {
                output = Atomizr.vscode2sublime(inputFile, {scope: scope});
                targetFile = `${baseName}.sublime-completions`;
            } else if (opts.target === 'textmate' || opts.target === 'mate') {
                output = Atomizr.vscode2textmate(inputFile, {scope: scope});
                targetFile = `${baseName}.tmSnippet`;
            } else if (opts.target === 'vscode' || opts.target === 'code') {
                return console.log(`Skipping "${input}"`);
            } else {
                output = Atomizr.vscode2atom(inputFile, {scope: scope});
                targetFile = `${baseName}.cson`;
            }
        } else {
            return console.error('Error: Unsupported file-type');
        }

        let targetPath = path.join(targetDir, targetFile);

        console.log(`Writing "${targetFile}"`);
        try {
            fs.writeFileSync(targetPath, output);
        } catch(e) {
            console.log(e);
        }
    });
}

function outputDir(outputDir) {
    if (typeof outputDir === 'undefined' || outputDir === true) {
        return process.cwd();
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    return outputDir;
}
