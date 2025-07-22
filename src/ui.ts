import * as vscode from "vscode";

export async function confirmCommitMessage(
  message: string
): Promise<string | undefined> {
  const userMessage = await vscode.window.showInputBox({
    prompt: "AI-generated commit message (edit if needed)",
    value: message,
    ignoreFocusOut: true,
  });

  return userMessage?.trim();
}
