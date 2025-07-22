import * as vscode from "vscode";
import { generateCommitMessage, generateReadmeFromFiles } from "./ai";
import { confirmCommitMessage } from "./ui";
import { ensureRepoInitialized, getDiff, stageAll, commit, push } from "./git";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "git-ai.smartPush",
    async () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showErrorMessage(
          "❌ Please open a folder before using Git AI Commit."
        );
        return;
      }

      try {
        vscode.window.showInformationMessage(
          "🔧 Git AI Commit: Starting automation..."
        );

        await ensureRepoInitialized();
        await stageAll();

        const diff = await getDiff();

        if (!diff || diff.trim() === "") {
          vscode.window.showWarningMessage("⚠️ No changes to commit.");
          return;
        }

        const aiMessage = await generateCommitMessage(diff);
        const userMessage = await confirmCommitMessage(aiMessage);

        if (!userMessage) {
          vscode.window.showWarningMessage("🛑 Commit canceled.");
          return;
        }

        await commit(userMessage);
        await push();

        vscode.window.showInformationMessage(
          `✅ Code pushed with commit: "${userMessage}"`
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `❌ Git AI Commit failed: ${error.message || error}`
        );
      }
    }
  );
  let readmeCommand = vscode.commands.registerCommand(
    "git-ai.smartReadme",
    async () => {
      const folders = vscode.workspace.workspaceFolders;
      if (!folders || folders.length === 0) {
        vscode.window.showErrorMessage("❌ Please open a folder first.");
        return;
      }

      const workspacePath = folders[0].uri.fsPath;
      const readmePath = vscode.Uri.joinPath(folders[0].uri, "README.md");

      try {
        // Check if README.md already exists
        await vscode.workspace.fs.stat(readmePath);
        vscode.window.showInformationMessage("ℹ️ README.md already exists.");
        return;
      } catch {
        // README doesn't exist — continue
      }

      vscode.window.showInformationMessage(
        "🧠 Generating README.md with AI..."
      );

      // Collect content from project files
      const files = await vscode.workspace.findFiles(
        "**/*.{ts,js,jsx,tsx,py,go,rs}",
        "**/node_modules/**",
        10
      );
      const fileContents: string[] = [];

      for (const file of files) {
        const content = (await vscode.workspace.fs.readFile(file)).toString();
        fileContents.push(`// ${file.fsPath}\n${content}\n`);
      }

      // Call your Gemini AI function here
      const readmeText = await generateReadmeFromFiles(fileContents);

      if (!readmeText || readmeText.trim() === "") {
        vscode.window.showWarningMessage(
          "⚠️ AI did not return valid README content."
        );
        return;
      }

      await vscode.workspace.fs.writeFile(
        readmePath,
        new TextEncoder().encode(readmeText)
      );

      vscode.window.showInformationMessage(
        "✅ README.md generated with Gemini AI!"
      );
    }
  );

  context.subscriptions.push(readmeCommand);

  context.subscriptions.push(disposable);
}

export function deactivate() {}
