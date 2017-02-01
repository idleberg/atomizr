const Atom = require('./lib/atom');
const SublimeText = require('./lib/sublime');
const TextMate = require('./lib/textmate');
const Vscode = require('./lib/vscode');

module.exports = {

    // Atom to anything

    atom2sublime: function(input, options) {
        let data, output;

        try {
            data = Atom.read_cson(input, options);
            output = SublimeText.write_json(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    atom2textmate: function(input, options) {
        let data, output;

        try {
            data = Atom.read_cson(input, options);
            output = TextMate.write_plist(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    atom2vscode: function(input, options) {
        let data, output;

        try {
            data = Atom.read_cson(input, options);
            output = Vscode.write_json(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    // Sublime Text to anything

    sublime2atom: function(input, options) {
        let data, output;

        try {
            if (options.is_snippet === true) {
                data = SublimeText.read_xml(input, options);
            } else {
                data = SublimeText.read_json(input, options);
            }
            output = Atom.write_cson(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    sublime2textmate: function(input, options) {
        let data, output;

        try {
            if (options.is_snippet === true) {
                data = SublimeText.read_xml(input, options);
            } else {
                data = SublimeText.read_json(input, options);
            }
            output = TextMate.write_plist(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    sublime2vscode: function(input, options) {
        let data, output;

        try {
            if (options.is_snippet === true) {
                data = SublimeText.read_xml(input, options);
            } else {
                data = SublimeText.read_json(input, options);
            }
            output = Vscode.write_json(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    // TextMate to anything

    textmate2atom: function(input, options) {
        let data, output;

        try {
            data = TextMate.read_plist(input, options);
            output = Atom.write_cson(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    textmate2sublime: function(input, options) {
        let data, output;

        try {
            data = TextMate.read_plist(input, options);
            output = SublimeText.write_json(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    textmate2vscode: function(input, options) {
        let data, output;

        try {
            data = TextMate.read_plist(input, options);
            output = Vscode.write_json(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    // Visual Studio Code to anything

    vscode2atom: function(input, options) {
        let data, output;

        try {
            data = Vscode.read_json(input, options);
            output = Atom.write_cson(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    vscode2sublime: function(input, options) {
        let data, output;

        try {
            data = Vscode.read_json(input, options);
            output = SublimeText.write_json(data);
        } catch (error) {
            throw error;
        }

        return output;
    },

    vscode2textmate: function(input, options) {
        let data, output;

        try {
            data = Vscode.read_json(input, options);
            output = TextMate.write_plist(data);
        } catch (error) {
            throw error;
        }

        return output;
    }
};
