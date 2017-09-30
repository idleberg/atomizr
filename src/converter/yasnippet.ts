const write = (input) => {
    let name, output;

    if (input.completions[0].description) {
        name = input.completions[0].description;
    } else {
        name = input.completions[0].trigger;
    }

    // No scope?
    if (input.scope === null) {
        input.scope = 'source';
    // Remove leading dot
    } else if (input.scope[0] === '.') {
        input.scope = input.scope.substr(1);
    }

    output  = `# -*- mode: snippet -*-\n`;
    output += `# # name: ${name}\n`;
    output += `# # key: ${input.completions[0].trigger}\n`;
    output += `# --\n`;
    output += input.completions[0].contents;

    return output;
};

export { write };
