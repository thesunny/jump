// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode")
const nodePath = require("path")
const fs = require("fs")
const fse = require("fs-extra")

function jump(createIfMissing = false) {
  // Display a message box to the user
  // vscode.window.showInformationMessage("Hello World!")
  if (!vscode.workspace.name) {
    return
  }

  const activeFile = vscode.window.activeTextEditor
  if (!activeFile) {
    return
  }

  const path = activeFile.document.fileName
  const rootPath = vscode.workspace.workspaceFolders[0].uri.path
  console.log(1)
  const relativePath = nodePath.relative(rootPath, path)
  console.log(2)

  let jumpRelativePath
  console.log(jumpRelativePath)
  if (relativePath.startsWith("api/")) {
    jumpRelativePath = relativePath.slice(4)
  } else {
    jumpRelativePath = `api/${relativePath}`
  }
  console.log(4)
  const jumpPath = nodePath.resolve(rootPath, jumpRelativePath)
  if (fs.existsSync(jumpPath)) {
    vscode.workspace
      .openTextDocument(vscode.Uri.file(jumpPath))
      .then(vscode.window.showTextDocument)
  } else {
    if (createIfMissing) {
      try {
        fse.ensureFileSync(jumpPath)
        vscode.workspace
          .openTextDocument(vscode.Uri.file(jumpPath))
          .then(vscode.window.showTextDocument)
      } catch (e) {
        console.error(e)
      }
    } else {
      vscode.window.setStatusBarMessage(
        `Jump to related file ${jumpRelativePath} not found`,
        3000
      )
    }
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "jump" is now active!')

  // // The command has been defined in the package.json file
  // // Now provide the implementation of the command with  registerCommand
  // // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand(
  //   "extension.helloWorld",
  //   function() {
  //     // The code you place here will be executed every time your command is executed

  //     // Display a message box to the user
  //     vscode.window.showInformationMessage("Hello World!")
  //   }
  // )

  // context.subscriptions.push(disposable)

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable1 = vscode.commands.registerCommand(
    "extension.jumprelated",
    () => {
      jump(false)
    }
  )

  let disposable2 = vscode.commands.registerCommand(
    "extension.jumprelatedandcreate",
    () => {
      jump(true)
    }
  )

  context.subscriptions.push(disposable1)
  context.subscriptions.push(disposable2)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
