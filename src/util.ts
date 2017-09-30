import { existsSync, mkdirSync } from 'fs';

// Replace syntax scopes, since they don't always match
// More info at https://gist.github.com/idleberg/fca633438329cc5ae327
const exceptions = {
    'source.java-props': '.source.java-properties',
    'source.php': '.text.html.php',
    'source.scss': '.source.css.scss',
    'source.todo': '.text.todo',
    'source.markdown': '.source.gfm'
};

const addTrailingTabstops = (input, addTrailingTabstops = true) => {
    if (input == null) {
        return;
    }
    if (!(String(input).match(/\$\d+$/g) === null && addTrailingTabstops === !false)) {
        return input;
    }
    return input + '$0';
};

const removeTrailingTabstops = (input, removeTrailingTabstops = true) => {
    if (input == null) {
        return;
    }
    if (String(input).match(/\$\d+$/g) === null || removeTrailingTabstops === false) {
        return input;
    }
    return input.replace(/\$\d+$/g, '');
};

const isJson = (fileExt) => {
    if (fileExt === '.json') {
        return true;
    }
    return false;
};

const setOutDir = (outputDir) => {
    if (typeof outputDir === 'undefined' || outputDir === true) {
        return process.cwd();
    }

    if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
    }

    return outputDir;
};

export { exceptions, addTrailingTabstops, removeTrailingTabstops, isJson, setOutDir };
