#!/usr/bin/env node

const meta = require('../package.json');

// Dependencies
const program = require('commander');
const glob = require('wildglob');

// Modules
const { convert } = require('../lib/convert');
const { setOutDir } = require('../lib/util');

program
    .version(meta.version)
    .arguments('<file>')
    .usage('<file> [options]')
    .option('-s, --source [source]', 'specify conversion source')
    .option('-t, --target [target]', 'specify conversion target', 'atom')
    .option('-o, --outdir [directory]', 'specify default output directory')
    .option('-g, --grammar [scope]', 'specify grammar scope for Visual Studio Code source')
    .option('-I, --ignore-tab', 'ignore tab-stop separator')
    .option('-S, --force-snippet', 'force Sublime Text snippets')
    .action( (pattern) => {

        let opts = {
            nodir: true,
            statCache: true,
            cache:true
        };

        glob(pattern, opts, (error, files) => {
            if (error) throw error;

            files.forEach( filePath => {
                convert(filePath, setOutDir(program.outdir), program);
            });
        });

    })
    .parse(process.argv);

if (program.args.length === 0) program.help();
