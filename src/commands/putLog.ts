import { basename } from "path";
import { Position, Range, TextEditorEdit, window } from "vscode";

const allowedFileTypes = ["js", "ts", "jsx", "tsx"];

export const putLog = () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const filePath = editor.document.fileName;
  const fileName = basename(filePath);

  if (!allowedFileTypes.includes(fileName.split(".").pop() || "")) {
    window.showInformationMessage(
      "LOGMASTER-ERR: File not of type js, ts, jsx or tsx."
    );
    return;
  }

  const sortedSelections = [...editor.selections].sort((a, b) =>
    a.start.compareTo(b.start)
  );

  if (sortedSelections.length > 0) {
    const edits: ((editBuilder: TextEditorEdit) => void)[] = [];

    editor.selections.forEach((selection) => {
      if (selection.isEmpty) {
        const insertPosition = new Position(selection.start.line, 0);

        const editString = `console.log('[🪵 🤖][${fileName}][Line: ${
          insertPosition.line + 1 + edits.length
        }]');\n`;

        edits.push((editBuilder: TextEditorEdit) => {
          editBuilder.insert(insertPosition, editString);
        });
        return;
      }

      const selectionRange = new Range(selection.start, selection.end);
      const selctedWord = editor.document.getText(selectionRange);

      const insertPosition = new Position(selection.start.line + 1, 0);

      const isLastLine = editor.document.lineCount === selection.start.line + 1;

      const editString = `${
        isLastLine ? "\n" : ""
      }console.log(\`[🪵 🤖][${fileName}][Line: ${
        insertPosition.line + 1 + edits.length
      }] - ${selctedWord} = \$\{${selctedWord}\}\`);\n`;

      edits.push((editBuilder: TextEditorEdit) =>
        editBuilder.insert(insertPosition, editString)
      );
    });

    editor.edit((editBuilder) => {
      edits.forEach((edit) => {
        edit(editBuilder);
      });
    });

    return;
  }
};
