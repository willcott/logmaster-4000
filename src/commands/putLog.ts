import { Position, window } from "vscode";

export const putLog = () => {
  window.showInformationMessage("Putting log!");
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const cursorPosition = editor.selection.active;

  const insertPosition = new Position(cursorPosition.line, 0);

  editor.edit((editBuilder) => {
    editBuilder.insert(
      insertPosition,
      `console.log('🪵 [Line: ${cursorPosition.line + 1}]');\n`
    );
  });
};
