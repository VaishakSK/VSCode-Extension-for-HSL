const vscode = require('vscode');
const path = require('path');
const cp = require('child_process');


// function activate(context) {
//     const diagnosticCollection = vscode.languages.createDiagnosticCollection("hsl");

//     vscode.workspace.onDidChangeTextDocument((event) => {
//         if (event.document.languageId !== "hsl") return;

//         const diagnostics = [];
//         const text = event.document.getText();
//         const lintResults = lintHSLCode(text);

//         lintResults.forEach(({ line, message, severity }) => {
//             const diagnosticSeverity =
//                 severity === "error"
//                     ? vscode.DiagnosticSeverity.Error
//                     : vscode.DiagnosticSeverity.Warning;

//             const range = new vscode.Range(
//                 new vscode.Position(line, 0),
//                 new vscode.Position(line, text.split(/\r?\n/)[line].length)
//             );

//             diagnostics.push(new vscode.Diagnostic(range, message, diagnosticSeverity));
//         });

//         diagnosticCollection.set(event.document.uri, diagnostics);
//     });

//     vscode.workspace.onDidOpenTextDocument((document) => {
//         if (document.languageId !== "hsl") return;

//         const diagnostics = [];
//         const text = document.getText();
//         const lintResults = lintHSLCode(text);

//         lintResults.forEach(({ line, message, severity }) => {
//             const diagnosticSeverity =
//                 severity === "error"
//                     ? vscode.DiagnosticSeverity.Error
//                     : vscode.DiagnosticSeverity.Warning;

//             const range = new vscode.Range(
//                 new vscode.Position(line, 0),
//                 new vscode.Position(line, text.split(/\r?\n/)[line].length)
//             );

//             diagnostics.push(new vscode.Diagnostic(range, message, diagnosticSeverity));
//         });

//         diagnosticCollection.set(document.uri, diagnostics);
//     });

//     context.subscriptions.push(diagnosticCollection);
// }

// function lintHSLCode(text) {
//     // Mock implementation of linting logic
//     return [
//         { line: 0, message: "Example error", severity: "error" },
//         { line: 1, message: "Example warning", severity: "warning" },
//     ];
// }

// function deactivate() {}

// module.exports = { activate, deactivate };


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let runCommand = vscode.commands.registerCommand('hsl.runCompiler', function () {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No file is open!');
            return;
        }

        const filePath = editor.document.fileName;

        // Ensure the file is an HSL file
        if (!filePath.endsWith('.hsl')) {
            vscode.window.showErrorMessage('Please open an HSL file to run.');
            return;
        }

        // Path to the compiler
        const compilerPath = path.join(context.extensionPath, 'bin', 'compiler');

        // Execute the compiler
        const terminal = vscode.window.createTerminal('HSL Compiler');
        terminal.show();
        terminal.sendText(`${compilerPath} ${filePath}`);
    });

    context.subscriptions.push(runCommand);

    context.subscriptions.push(runCommand);
	vscode.debug.registerDebugConfigurationProvider('hsl', {
		provideDebugConfigurations(folder, token) {
			return [
				{
					type: 'hsl',
					request: 'launch',
					name: 'Run HSL Compiler',
					program: '${file}'
				}
			];
		},
		resolveDebugConfiguration(folder, config, token) {
			const programPath = config.program || vscode.window.activeTextEditor.document.fileName;
	
			const compilerPath = path.join(context.extensionPath, 'bin', 'compiler.exe');
			cp.execFile(compilerPath, [programPath], (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Error: ${error.message}`);
					return;
				}
	
				if (stderr) {
					vscode.window.showErrorMessage(`Compiler Error: ${stderr}`);
					return;
				}
	
				vscode.window.showInformationMessage(`Output: ${stdout}`);
			});
	
			return null; // No active debugging
		}
	});
	
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
