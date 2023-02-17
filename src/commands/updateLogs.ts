import { Selection, window } from "vscode";

export const updateLogs = () => {
  window.showInformationMessage("Updating logs!");
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const text = editor.document.getText();

  let matches = [...text.matchAll(/(\[Line: ([0-9]+)\])/g)];

  if (matches.length === 0) {
    return;
  }

  const selections: Selection[] = [];

  matches.forEach((match, index) => {
    if (!match) {
      return;
    }

    let startPos = editor.document.positionAt((match.index as number) + 7);
    let endPos = editor.document.positionAt(
      (match.index as number) + match[0].length
    );
    selections.push(new Selection(startPos, endPos));
  });

  editor.edit((editBulder) => {
    selections.forEach((selection) => {
      editBulder.replace(selection, `${selection.start.line + 1}]`);
    });
  });
};
