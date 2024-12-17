// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebviewContent } from './commands/copy-to-colipboard';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const generateCard = vscode.commands.registerCommand('code-card.generateCard', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('No text selected');
			return;
		}

		const selection = editor.selection;
		let selectedText = editor.document.getText(selection);
		
		// 格式化代码
		const lines = selectedText.split('\n');
		
		// 1. 收集所有非空行的缩进量
		const indents = lines
			.filter(line => line.trim().length > 0)
			.map(line => line.match(/^\s*/)[0].length)
			.sort((a, b) => a - b);

		// 2. 找到倒数第二小的缩进量
		const secondSmallestIndent = indents[1] || 0;
		
		// 3. 处理每一行
		selectedText = lines
			.map(line => {
				if (line.trim().length === 0) return '';
				
				const currentIndent = line.match(/^\s*/)[0].length;
				// 如果当前缩进大于倒数第二小的缩进，则减去该值
				const newIndent = currentIndent > secondSmallestIndent 
					? currentIndent - secondSmallestIndent 
					: 0;
				
				return ' '.repeat(newIndent) + line.trim();
			})
			.join('\n');

		// 创建预览窗口
		const panel = vscode.window.createWebviewPanel(
			'codeCard',
			'Code Card',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.joinPath(context.extensionUri, 'src', 'images')
				]
			}
		);

		// 生成预览
		const html = getWebviewContent(selectedText, panel.webview, context.extensionUri);
		panel.webview.html = html;
	});

	context.subscriptions.push(generateCard);
}

// This method is called when your extension is deactivated
export function deactivate() {}
