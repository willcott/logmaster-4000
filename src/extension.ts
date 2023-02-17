// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "log-extension" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let putDisposable = vscode.commands.registerCommand(
    "log-extension.putLog",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Putting log!");
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const cursorPosition = editor.selection.active;

      const insertPosition = new vscode.Position(cursorPosition.line, 0);

      editor.edit((editBuilder) => {
        editBuilder.insert(
          insertPosition,
          `console.log('🪵 [Line: ${cursorPosition.line + 1}]');\n`
        );
      });
    }
  );

  let updateDisposable = vscode.commands.registerCommand(
    "log-extension.updateLogs",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Updating logs!");
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const text = editor.document.getText();

      let matches = [...text.matchAll(/(\[Line: ([0-9]+)\])/g)];

      if (matches.length === 0) {
        return;
      }

      const selections: vscode.Selection[] = [];

      matches.forEach((match, index) => {
        if (!match) {
          return;
        }

        let startPos = editor.document.positionAt((match.index as number) + 7);
        let endPos = editor.document.positionAt(
          (match.index as number) + match[0].length
        );
        selections.push(new vscode.Selection(startPos, endPos));
      });

      editor.edit((editBulder) => {
        selections.forEach((selection) => {
          editBulder.replace(selection, `${selection.start.line + 1}]`);
        });
      });
    }
  );

  context.subscriptions.push(putDisposable);
  context.subscriptions.push(updateDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
