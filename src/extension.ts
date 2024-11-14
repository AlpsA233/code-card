// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
}

// This method is called when your extension is deactivated
export function deactivate() {}


const getWebviewContent = (content: string | undefined) => {
    // content = `<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
    //             <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
    //               <div className="flex gap-5 items-center font-semibold">
    //                 <Link href={"/"}>Next.js Supabase Starter</Link>
    //                 <div className="flex items-center gap-2">
    //                   <DeployButton />
    //                 </div>
    //               </div>
    //               {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
    //             </div>
    //           </nav>`
    content = String.raw`${content}`;
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Card</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        body {
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            width: fit-content;
            max-width: 100%;
        }

        .main {
            padding: 1rem;
            width: fit-content;
            max-width: 100vw;
        }

        .window {
            background: white;
            border-radius: 10px;
            box-shadow: 
                0 2px 4px rgba(0,0,0,0.05),
                0 4px 8px rgba(0,0,0,0.05),
                0 8px 16px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            overflow: hidden;
            width: fit-content;
            min-width: 300px;
            max-width: 100%;
        }

        .window:hover {
            box-shadow: 
                0 4px 8px rgba(0,0,0,0.1),
                0 8px 16px rgba(0,0,0,0.1),
                0 16px 32px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }

        .window-titlebar {
            background: #e9ecef;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dee2e6;
            position: relative;
            -webkit-app-region: drag;
            user-select: none;
        }

        .window-controls {
            display: flex;
            gap: 8px;
            position: relative;
            z-index: 1;
            -webkit-app-region: no-drag;
        }

        .window-button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            position: relative;
            transition: all 0.1s ease;
        }

        .button-close { 
            background: #ff5f57;
            border: 1px solid #e0443e;
        }
        
        .button-minimize { 
            background: #ffbd2e;
            border: 1px solid #dea123;
        }
        
        .button-expand { 
            background: #28c940;
            border: 1px solid #1dad2b;
        }

        .window-button:hover::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            background: rgba(0, 0, 0, 0.25);
            border-radius: 50%;
        }

        .window-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            color: #4a5568;
            font-size: 13px;
            font-weight: 500;
        }

        .window-content {
            padding: 20px;
            overflow-x: auto;
            background: white;
        }

        pre {
            margin: 0;
            background: transparent !important;
        }

        code {
            font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            tab-size: 2;
            white-space: pre !important;
        }

        .button-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 16px;
        }

        .action-button {
            padding: 10px 20px;
            font-size: 13px;
            color: white;
            background: #0ea5e9;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .action-button:hover {
            background: #0284c7;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .action-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .spinner {
            width: 14px;
            height: 14px;
            border: 2px solid white;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: none;
            animation: rotation 1s linear infinite;
        }

        .spinner.active {
            display: block;
        }

        #toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #10b981;
            color: white;
            border-radius: 8px;
            font-size: 14px;
            transform: translateY(-100px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
        }

        #toast.show {
            transform: translateY(0);
        }

        @media (max-width: 768px) {
            body {
                padding: 16px;
            }

            .window {
                min-width: unset;
            }

            .window-content {
                padding: 16px;
            }

            code {
                font-size: 12px;
            }

            .action-button {
                padding: 8px 16px;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main">
            <div class="window">
                <div class="window-titlebar">
                    <div class="window-controls">
                        <div class="window-button button-close"></div>
                        <div class="window-button button-minimize"></div>
                        <div class="window-button button-expand"></div>
                    </div>
                    <span class="window-title">button.tsx</span>
                </div>
                <div class="window-content">
                    <pre><code id="codeBlock"></code></pre>
                </div>
            </div>
        </div>
        <div class="button-container">
            <button class="action-button" id="copyButton">
                <span class="spinner" id="copySpinner"></span>
                <span class="button-text">Copy as jpg</span>
            </button>
            <button class="action-button" id="saveButton">
                <span class="spinner" id="saveSpinner"></span>
                <span class="button-text">Save Image</span>
            </button>
        </div>
    </div>
    <div id="toast">Copied to clipboard!</div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', (event) => {
            const copyButton = document.getElementById('copyButton');
            const saveButton = document.getElementById('saveButton');
            const copySpinner = document.getElementById('copySpinner');
            const saveSpinner = document.getElementById('saveSpinner');
            const toast = document.getElementById('toast');
            const codeBlock = document.getElementById('codeBlock');

            function setLoading(button, spinner, isLoading, text) {
                button.disabled = isLoading;
                spinner.classList.toggle('active', isLoading);
                button.querySelector('.button-text').textContent = isLoading ? 'Processing...' : text;
            }

            function showToast(message, isError = false) {
                toast.textContent = message;
                toast.style.backgroundColor = isError ? '#ef4444' : '#10b981';
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }

            async function fallbackCopy(dataUrl) {
                try {
                    const img = new Image();
                    img.src = dataUrl;
                    img.style.position = 'fixed';
                    img.style.left = '-9999px';
                    document.body.appendChild(img);

                    const tempCanvas = document.createElement('canvas');
                    await new Promise(resolve => {
                        img.onload = () => {
                            tempCanvas.width = img.width;
                            tempCanvas.height = img.height;
                            const ctx = tempCanvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            document.body.removeChild(img);
                            resolve();
                        };
                    });

                    tempCanvas.toBlob(async (blob) => {
                        try {
                            const clipboardItem = new ClipboardItem({ 'image/png': blob });
                            await navigator.clipboard.write([clipboardItem]);
                            showToast('Copied to clipboard!');
                        } catch (e) {
                            console.error('Fallback copy failed:', e);
                            const link = document.createElement('a');
                            link.download = 'code-snapshot.jpg';
                            link.href = dataUrl;
                            link.click();
                            showToast('Image downloaded (copy not supported in your browser)', true);
                        }
                    }, 'image/png');
                } catch (error) {
                    console.error('Fallback error:', error);
                    showToast('Failed to copy/download image', true);
                }
            }

            async function captureToCanvas() {
                const element = document.querySelector('.main');
                return html2canvas(element, {
                    backgroundColor: null,
                    scale: window.devicePixelRatio || 1,
                    logging: false,
                    useCORS: true,
                });
            }

            async function captureAndCopyToClipboard() {
                try {
                    setLoading(copyButton, copySpinner, true, 'Copy as jpg');
                    const canvas = await captureToCanvas();
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

                    try {
                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                        const clipboardItem = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([clipboardItem]);
                        showToast('Copied to clipboard!');
                    } catch (clipboardError) {
                        console.warn('Primary clipboard method failed, trying fallback:', clipboardError);
                        await fallbackCopy(dataUrl);
                    }
                } catch (error) {
                    console.error('Capture error:', error);
                    showToast('Capture error!', true);
                } finally {
                    setLoading(copyButton, copySpinner, false, 'Copy as jpg');
                }
            }

            async function saveImage() {
                try {
                    setLoading(saveButton, saveSpinner, true, 'Save Image');
                    const canvas = await captureToCanvas();
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

                    const link = document.createElement('a');
                    const timestamp = new Date().toISOString().replace(/[:]/g, '-').split('.')[0];
                    link.download = \`code-snapshot-\${timestamp}.jpg\`;
                    link.href = dataUrl;
                    link.click();
                    
                    showToast('Image saved successfully!');
                } catch (error) {
                    console.error('Save error:', error);
                    showToast('Failed to save image!', true);
                } finally {
                    setLoading(saveButton, saveSpinner, false, 'Save Image');
                }
            }

            copyButton.addEventListener('click', captureAndCopyToClipboard);
            saveButton.addEventListener('click', saveImage);

            // Set the code content
            const codeContent = \`${content.replace(/`/g, '\\`')  
                .replace(/\$\{/g, '\\${')}\`;

            // Set code and apply highlighting
            codeBlock.textContent = codeContent;
            hljs.highlightElement(codeBlock);
        });
    </script>
</body>
</html>`;
}