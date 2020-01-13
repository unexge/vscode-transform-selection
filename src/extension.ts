import * as vscode from "vscode";

async function command() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showWarningMessage("Could not find active text editor.");
    return;
  }

  const expression = await vscode.window.showInputBox({
    placeHolder: "x.toLowerCase()",
    prompt: "Variables -> x: String `selection`, lineno: Number"
  });
  if (!expression) {
    return;
  }

  const selectionsWithTexts: [
    vscode.Selection,
    string
  ][] = activeEditor.selections.map(selection => [
    selection,
    activeEditor.document.getText(selection)
  ]);

  const fn = new Function("x", "lineno", `return ${expression}`);

  activeEditor.edit(editBuilder => {
    selectionsWithTexts.forEach(([selection, text]) => {
      editBuilder.replace(
        selection,
        fn(text, selection.start.line + 1).toString()
      );
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("transformSelection.transform", command)
  );
}

export function deactivate() {}
