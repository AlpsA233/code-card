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
		
		// 1. 找出最小缩进量（忽略空行）
		const minIndent = lines
			.filter(line => line.trim().length > 0)
			.reduce((min, line) => {
				const indent = line.match(/^\s*/)[0].length;
				return Math.min(min, indent);
			}, Infinity);

		console.log('minIndent:', minIndent);
		console.log(' \t\thaha\t\t  ');
		console.log(' \t\thaha\t\t  '.trim());
		
			

		// 2. 处理每一行，保持相对缩进
		selectedText = lines
			.map(line => {
				if (line.trim().length === 0) {
					return '';  // 空行处理
				}
				const currentIndent = line.match(/^\s*/)[0].length;
				const relativeIndent = currentIndent - minIndent;
				// 使用两个空格作为缩进单位
				return '  '.repeat(relativeIndent / 2) + line.trim();
			})
			.join('\n');
			console.log(lines
			.map(line => {
				if (line.trim().length === 0) {
					return '';  // 空行处理
				}
				const currentIndent = line.match(/^\s*/)[0].length;
				const relativeIndent = currentIndent - minIndent;
				console.log('relativeIndent:', relativeIndent);
				console.log('currentIndent:', currentIndent);
				
				
				// 使用两个空格作为缩进单位
				return '  '.repeat(relativeIndent / 2) + line.trim();
			}));
			

		// 创建预览窗口
		const panel = vscode.window.createWebviewPanel(
			'codeCard',
			'Code Card',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);
		console.log('selectedText:', selectedText);
		

		// 生成预览
		const html = getWebviewContent(selectedText);
		panel.webview.html = html;
	});

	context.subscriptions.push(generateCard);
}

// This method is called when your extension is deactivated
export function deactivate() {}
