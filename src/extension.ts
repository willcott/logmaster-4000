import * as vscode from "vscode";
import { putLog } from "./commands/putLog";
import { updateLogs } from "./commands/updateLogs";

export function activate(context: vscode.ExtensionContext) {
  let putDisposable = vscode.commands.registerCommand(
    "log-extension.putLog",
    putLog
  );

  let updateDisposable = vscode.commands.registerCommand(
    "log-extension.updateLogs",
    updateLogs
  );

  context.subscriptions.push(putDisposable);
  context.subscriptions.push(updateDisposable);
}

export function deactivate() {}
