# Git AI Commit - VS Code Extension

## Project Description

The Git AI Commit VS Code extension automates the process of creating commit messages and generating README files using AI. It leverages the Gemini AI model to analyze your Git diffs and suggest meaningful commit messages, or to analyze code files and generate a professional README.md file. This extension aims to streamline your development workflow by reducing the overhead of writing commit messages and documentation.

## Features

- **Smart Commit Messages:** Automatically generates commit messages based on the staged changes in your Git repository. It analyzes the diff and provides a single-line conventional commit message.
- **Editable Commit Messages:** Allows you to review and edit the AI-generated commit message before committing, ensuring accuracy and relevance.
- **Smart README Generation:** Generates a comprehensive README.md file for your project based on the code in your workspace.
- **Git Repository Initialization:** If a git repository is not already initialized, it will initialize one and create the first commit.
- **GitHub Remote Setup:** Allows the user to add a remote to a GitHub repo and push to it.

## Installation

1.  Open Visual Studio Code.
2.  Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3.  Search for "Git AI Commit".
4.  Click "Install".

## Prerequisites

- Visual Studio Code
- Git
- A Gemini API key (Get one from Google Cloud AI Platform). You'll need to set this as an environment variable named `GEMINI_API_KEY`.

## Configuration

1.  Set the `GEMINI_API_KEY`in ai.ts.

## Usage

### Smart Push (Commit & Push with AI-Generated Message)

1.  Open your project in VS Code.
2.  Stage the changes you want to commit.
3.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
4.  Type and select "Git AI: Smart Push".
5.  The extension will:
    - Initialize a git repo if one does not exist
    - Pull the latest changes from the remote (if the repo exists)
    - Stage all changes.
    - Analyze your staged changes and generate a commit message.
    - Display the generated commit message in an input box, allowing you to edit it.
    - Commit with the (potentially edited) message.
    - Push the changes to your remote repository.

### Smart README Generation

1.  Open your project in VS Code.
2.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3.  Type and select "Git AI: Smart Readme".
4.  The extension will:
    - Check if a `README.md` file already exists. If so, it will inform you and stop.
    - Collect the content of all Typescript, Javascript, Python, Go, and Rust files in your workspace (excluding `node_modules`).
    - Send the collected content to the Gemini AI model to generate a `README.md` file.
    - Create a new `README.md` file in your workspace with the generated content.

## Troubleshooting

- **"No workspace folder is open"**: Make sure you have opened a project folder in VS Code before using the extension.
- **"Gemini API key not set"**: Ensure you have set the `GEMINI_API_KEY` environment variable with your valid Gemini API key.
- **"No changes to commit"**: Verify that you have staged the changes you want to commit before running the "Smart Push" command.
- **API Errors:** Check the VS Code Output panel for any error messages from the Gemini API.
