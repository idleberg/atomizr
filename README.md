# node-atomizr

[![npm](https://img.shields.io/npm/l/node-atomizr.svg?style=flat-square)](https://www.npmjs.org/package/node-atomizr)
[![npm](https://img.shields.io/npm/v/node-atomizr.svg?style=flat-square)](https://www.npmjs.org/package/node-atomizr)
[![Travis](https://img.shields.io/travis/idleberg/node-atomizr.svg?style=flat-square)](https://travis-ci.org/idleberg/node-atomizr)
[![David](https://img.shields.io/david/idleberg/node-atomizr.svg?style=flat-square)](https://david-dm.org/idleberg/node-atomizr)
[![David](https://img.shields.io/david/dev/idleberg/node-atomizr.svg?style=flat-square)](https://david-dm.org/idleberg/node-atomizr?type=dev)

Converts snippets for Atom, Sublime Text, TextMate, and Visual Studio Code. Based on the [Atom package](https://github.com/idleberg/atom-atomizr) of the same name.

## Installation

`npm install -g node-atomizr`

## Usage

### CLI

See `atomizr -h` for a list of all options

```bash
# Convert Sublime Text completions into Atom snippets
$ atomizr example.sublime-completions --target atom

# Convert Atom snippets into TextMate snippets (use quotes with wildcards!)
$ atomizr "*.cson" --target textmate
```

Specifying `--source` is optional. However, since both, Atom and Visual Studio Code, work with `.json` snippets, it's usually necessary to specify it explicitly. When converting an existing Visual Studio Code snippet, the target scope for the target should be supplied (e.g. `--scope .source.haskell`) – otherwise `.source` will be used.

### Node

```js
const Atomizr = require('node-atomizr');
const fs = require('fs');

fs.readFile('./example.sublime-completions', (error, data) => {
    if (error) throw error;

    let output = Atomizr.atom2sublime(data);
    console.log(output);
});
```

#### Methods

* **Atom**
    * `atom2sublime(data, [options Object])`
    * `atom2textmate(data, [options Object])`
    * `atom2vscode(data, [options Object])`
* **Sublime Text**
    * `sublime2atom(data, [options Object])`
    * `sublime2textmate(data, [options Object])`
    * `sublime2vscode(data, [options Object])`
* **TextMate**
    * `textmate2atom(data, [options Object])`
    * `textmate2sublime(data, [options Object])`
    * `textmate2vscode(data), [options Object]`
* **Visual Studio Code**
    * `vscode2atom(data, [options Object])`
    * `vscode2sublime(data, [options Object])`
    * `vscode2textmate(data, [options Object])`

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-atomizr) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`