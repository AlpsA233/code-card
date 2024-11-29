// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebviewContent } from './commands/copy-to-colipboard';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const generateCard = vscode.commands.registerCommand('code-card.generateCard', () => {
		const document = vscode.window.activeTextEditor?.document;
		// 获取当前选中的文本
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No text selected');
			return;
		}
		const selection = document?.getText(editor.selection);
		
		// 创建一个tab作为预览窗口
		const panel = vscode.window.createWebviewPanel(
			'codeCard',
			'Code Card',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		// 预览窗口中嵌入一个html代码
		const html = getWebviewContent(selection);
		panel.webview.html = html;
	});
    context.subscriptions.push(generateCard)
}

// This method is called when your extension is deactivated
export function deactivate() {}
