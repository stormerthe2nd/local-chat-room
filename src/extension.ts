// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Host } from './host';
import { Client } from './client';

const HOST_SECRET_KEY: string = "&2f-*&BJYEG&%C^EWVJHVQHETF#@DI &@^I&V^&"
const CLIENT_SECRET_KEY: string = "98&@&*(HD**IU^%&YGCi7wyge87UY68"
const PORT: number = 4693

var hostInstance: Host | undefined = undefined
var clientInstance: Client | undefined = undefined


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {
	// The code you place here will be executed every time your command is executed
	// Display a message box to the user
	vscode.window.showInformationMessage('Hello World from local-chat-room!');
	// });

	const disposables: vscode.Disposable[] = [
		vscode.commands.registerCommand('lcr.host', () => {
			try {

				hostInstance = new Host(PORT, HOST_SECRET_KEY, CLIENT_SECRET_KEY)

			} catch (error) {
				// console.log("error in host")
			}
		}),
		vscode.commands.registerCommand('lcr.connect', () => {
			try {

				clientInstance = new Client("", PORT, HOST_SECRET_KEY, CLIENT_SECRET_KEY)

			} catch (error) {
				// console.log("error in connect")
			}
		})
	]

	context.subscriptions.push(...disposables);
}

// This method is called when your extension is deactivated
export function deactivate() {
	hostInstance?.stopServer()
	clientInstance?.closeConnection()
}
