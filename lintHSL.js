function lintHSLCode(text) {
    const diagnostics = [];
    const lines = text.split(/\r?\n/);

    lines.forEach((line, i) => {
        if (!line.trim().endsWith(";")) {
            diagnostics.push({
                line: i,
                message: "Missing semicolon at the end of the line.",
                severity: "warning" // "error" for critical issues
            });
        }
    });

    return diagnostics;
}

module.exports = lintHSLCode;
