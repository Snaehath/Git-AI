import simpleGit from "simple-git";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

let git = simpleGit();

export async function ensureRepoInitialized(): Promise<void> {
  const folder = getWorkspacePath();
  git = simpleGit(folder);

  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    await git.init();
    vscode.window.showInformationMessage("📁 Git repo initialized.");

    await stageAll();

    const diff = await getDiff();
    if (!diff || diff.trim() === "") {
      throw new Error(
        "⚠️ No files to commit. Please add a file before initializing the repo."
      );
    }

    await commit("first commit");
    vscode.window.showInformationMessage("✅ First commit created.");

    await git.raw(["branch", "-M", "main"]);

    const repoName = await vscode.window.showInputBox({
      placeHolder: "Enter GitHub repo name (e.g. my-app)",
      prompt: "Will add remote: https://github.com/Snaehath/<repo-name>.git",
      validateInput: (input) =>
        !input || input.trim() === ""
          ? "Repository name cannot be empty."
          : null,
    });

    if (!repoName) {
      throw new Error("❌ GitHub repo name was not provided.");
    }

    const remoteUrl = `https://github.com/Snaehath/${repoName}.git`;

    await git.addRemote("origin", remoteUrl);
    await git.push(["-u", "origin", "main"]);

    vscode.window.showInformationMessage(`🚀 Repo pushed to ${remoteUrl}`);
  }
}

export async function getDiff(): Promise<string> {
  return await git.diff(["--cached"]);
}

export async function stageAll(): Promise<void> {
  await git.add("./*");
}

export async function commit(message: string): Promise<void> {
  await git.commit(message);
}

export async function push(): Promise<void> {
  await git.push();
}

function getWorkspacePath(): string {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    throw new Error(
      "❌ No workspace folder is open. Please open a folder before using Git AI Commit."
    );
  }
  return folders[0].uri.fsPath;
}
