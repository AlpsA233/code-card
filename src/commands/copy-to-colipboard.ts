import * as vscode from 'vscode';

const GRADIENT_PRESETS = {
    'purple-blue': 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    'warm-flame': 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    'morning-light': 'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)',
    'solid-white': '#ffffff',
    'solid-black': '#000000'
};

export const getWebviewContent = (content: string | undefined, webview: vscode.Webview, extensionUri: vscode.Uri, config: vscode.WorkspaceConfiguration) => {
    // 获取背景图片配置
    const backgroundType = config.get<string>('backgroundType') || 'image';
    const gradientPreset = config.get<string>('gradientPreset') || 'purple-blue';
    const backgroundImage = config.get<string>('backgroundImage');


    // 对内容进行安全处理  
    if (!content) {  
        content = '';  
    }  
    
    // 转义特殊字符  
    content = content  
        .replace(/</g, '&lt;')          // 转义HTML标签  
        .replace(/>/g, '&gt;');  

    // 获取图片的webview URI
    const defaultImageUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, 'src', 'images', 'image.png')
    );

    let bgImageUri;
    let backgroundStyle = '';
    if (backgroundType === 'image' && backgroundImage) {
        if (backgroundImage) {
            if (backgroundImage.startsWith('http')) {
                bgImageUri = backgroundImage;
            } else {
                try {
                    // 使用 vscode.Uri.file 创建 URI，然后转换为 webview URI
                    const fileUri = vscode.Uri.file(backgroundImage);
                    bgImageUri = webview.asWebviewUri(fileUri).toString();
                } catch (error) {
                    console.error('Error processing background image path:', error);
                    bgImageUri = defaultImageUri.toString();
                }
            }
        } else {
            bgImageUri = defaultImageUri.toString();
        }
        backgroundStyle = `url('${bgImageUri}') no-repeat center center fixed`;
    } else {
        backgroundStyle = GRADIENT_PRESETS[gradientPreset] || GRADIENT_PRESETS['purple-blue'];
    }

    

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; style-src 'unsafe-inline' https:; script-src 'unsafe-inline' https:;">
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
            background: ${backgroundStyle};
            background-size: cover;
            background-attachment: fixed;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow-x: scroll;
            min-width: fit-content;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin: 20px;
            width: fit-content;
            min-width: min-content;
            position: relative;
        }

        .main::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0; 
            background: ${backgroundStyle};
            background-size: cover;
            background-attachment: fixed;
            z-index: -1;
            transform: translateZ(0); /* 强制创建新的渲染层，避免渐变重叠 */
        }
        .main {
            padding: 3rem;
            position: relative;
            // z-index: 2;
            overflow: hidden;
        }

        .window {
            display: inline-block;
            min-width: 200px;
            border-radius: 12px;
            box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.08), 0 4px 4px rgba(0,0,0,0.06), 0 8px 8px rgba(0,0,0,0.04), 0 16px 16px rgba(0,0,0,0.02);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            background-color: #ffffff;
        }

        .window:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 2px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.1), 0 8px 8px rgba(0,0,0,0.08), 0 16px 16px rgba(0,0,0,0.06), 0 32px 32px rgba(0,0,0,0.04);
        }

        .window-titlebar {
            background-color: #e5e7eb;
            padding: 12px 20px;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            border-bottom: 1px solid rgba(209, 213, 219, 0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }

        .window-controls {
            display: flex;
            gap: 8px;
        }

        .window-button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            transition: transform 0.2s ease;
            position: relative;
        }

        .window-button:hover {
            transform: scale(1.1);
        }

        .window-button::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            box-shadow: inset 0 1px 1px rgba(255,255,255,0.15);
        }

        .button-close {
            background-color: #ff5f57;
        }

        .button-minimize {
            background-color: #ffbd2e;
        }

        .button-expand {
            background-color: #28c840;
        }

        .window-title {
            font-size: 12px;
            color: #6b7280;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
        }

        .window-content {
            position: relative;
            padding: 24px;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            overflow: hidden;
        }

        pre {
            margin: 0;
            white-space: pre;
            overflow: visible;
            width: fit-content;
            min-width: 100%;
        }

        code {
            font-family: "Fira Code", "Menlo", "Monaco", "Courier New", monospace;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre;
            display: inline-block;
            width: fit-content;
        }

        .hljs {
            padding: 0;
        }

        .button-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 8px;
        }

        .action-button {
            padding: 10px 20px;
            font-size: 13px;
            color: #ffffff;
            background-color: #0ea5e9;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2), 0 4px 6px rgba(14, 165, 233, 0.1);
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .action-button:hover {
            background-color: #0284c7;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(14, 165, 233, 0.25), 0 6px 8px rgba(14, 165, 233, 0.15);
        }

        .action-button:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(14, 165, 233, 0.2);
        }

        .action-button:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: none;
            animation: rotation 1s linear infinite;
        }

        .spinner.active {
            display: inline-block;
        }

        #toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            border-radius: 8px;
            font-size: 14px;
            transform: translateY(-100px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        #toast.show {
            transform: translateY(0);
        }

        .editor-container {
            display: none;
            width: 100%;
            height: auto;
        }

        .editor-container textarea {
            white-space: pre;
            overflow: visible;
            width: fit-content;
            min-width: 100%;
        }

        .edit-button {
            background-color: #4b5563 !important;
        }

        .edit-button:hover {
            background-color: #374151 !important;
        }

        .edit-button.active {
            background-color: #6366f1 !important;
        }

        .edit-button.active:hover {
            background-color: #4f46e5 !important;
        }

        .preview-container {
            width: fit-content;
            min-width: 100%;
        }

        @media (max-width: 1024px) {
            body {
                padding: 20px 10px;
                overflow-x: auto;
            }

            .container {
                margin: 10px;
                width: fit-content;
            }

            .window {
                margin: 5px;
            }

            .window-content {
                padding: 16px;
            }

            .button-container {
                flex-direction: column;
                width: 100%;
            }

            .action-button {
                width: 100%;
                justify-content: center;
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
                    <div class="window-title">Code Card</div>
                </div>
                <div class="window-content">
                    <div class="preview-container">
                        <pre class="hljs"><code id="codeBlock">${content}</code></pre>
                    </div>
                    <div class="editor-container">
                        <textarea id="codeEditor" spellcheck="false">${content}</textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container">
            <button class="action-button" id="copyButton">
                <span class="spinner" id="copySpinner"></span>
                <span class="button-text">🏞 Copy as jpg</span>
            </button>
            <button class="action-button" id="saveButton">
                <span class="spinner" id="saveSpinner"></span>
                <span class="button-text">💾 Save Image</span>
            </button>
            <button class="action-button edit-button" id="editModeBtn">
                <span class="button-text">✏️ Edit Code</span>
            </button>
        </div>
    </div>
    <div id="toast">Copied to clipboard!</div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script>
        hljs.highlightAll();
        const copyButton = document.getElementById("copyButton");
        const saveButton = document.getElementById("saveButton");
        const copySpinner = document.getElementById("copySpinner");
        const saveSpinner = document.getElementById("saveSpinner");
        const toast = document.getElementById("toast");
        const editModeBtn = document.getElementById("editModeBtn");
        const previewContainer = document.querySelector(".preview-container");
        const editorContainer = document.querySelector(".editor-container");
        const codeEditor = document.getElementById("codeEditor");
        const codeBlock = document.getElementById("codeBlock");

        let isEditMode = false;

        function setLoading(button, spinner, isLoading, text) {
            button.disabled = isLoading;
            spinner.classList.toggle("active", isLoading);
            button.querySelector(".button-text").textContent = isLoading ? "Processing..." : text;
        }

        function showToast(message, isError = false) {
            toast.textContent = message;
            toast.style.backgroundColor = isError ? "#ef4444" : "#10b981";
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        }

        function toggleEditMode() {
            isEditMode = !isEditMode;
            editModeBtn.classList.toggle("active", isEditMode);
            editModeBtn.querySelector(".button-text").textContent = isEditMode ? "👁 Preview Code" : "✏️ Edit Code";
            
            if (isEditMode) {
                const windowContent = document.querySelector(".window-content");
                const currentWidth = windowContent.offsetWidth;
                const previewHeight = previewContainer.offsetHeight;
                
                editorContainer.style.width = \`\${currentWidth}px\`;
                editorContainer.style.display = "block";
                previewContainer.style.display = "none";
                codeEditor.style.height = \`\${previewHeight}px\`;
                codeEditor.style.width = \`\${currentWidth}px\`;
            } else {
                editorContainer.style.display = "none";
                previewContainer.style.display = "block";
                updatePreview();
            }
        }

        function updatePreview() {
            const code = codeEditor.value;
            codeBlock.textContent = code;
            hljs.highlightElement(codeBlock);
        }

        async function fallbackCopy(dataUrl) {
            try {
                const img = new Image();
                img.src = dataUrl;
                img.style.position = "fixed";
                img.style.left = "-9999px";
                document.body.appendChild(img);

                const tempCanvas = document.createElement("canvas");
                await new Promise(resolve => {
                    img.onload = () => {
                        tempCanvas.width = img.width;
                        tempCanvas.height = img.height;
                        const ctx = tempCanvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        document.body.removeChild(img);
                        resolve();
                    };
                });

                tempCanvas.toBlob(async (blob) => {
                    try {
                        const clipboardItem = new ClipboardItem({ "image/png": blob });
                        await navigator.clipboard.write([clipboardItem]);
                        showToast("Copied to clipboard!");
                    } catch (e) {
                        console.error("Fallback copy failed:", e);
                        const link = document.createElement("a");
                        link.download = "code-snapshot.jpg";
                        link.href = dataUrl;
                        link.click();
                        showToast("Image downloaded (copy not supported in your browser)", true);
                    }
                }, "image/png");
            } catch (error) {
                console.error("Fallback error:", error);
                showToast("Failed to copy/download image", true);
            }
        }

        async function captureToCanvas() {
            const element = document.querySelector(".main");
            return html2canvas(element, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                useCORS: true
            });
        }

        async function captureAndCopyToClipboard() {
            try {
                setLoading(copyButton, copySpinner, true, "🏞 Copy as jpg");
                const canvas = await captureToCanvas();
                const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

                try {
                    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
                    const clipboardItem = new ClipboardItem({ "image/png": blob });
                    await navigator.clipboard.write([clipboardItem]);
                    showToast("Copied to clipboard!");
                } catch (clipboardError) {
                    console.warn("Primary clipboard method failed, trying fallback:", clipboardError);
                    await fallbackCopy(dataUrl);
                }
            } catch (error) {
                console.error("Capture error:", error);
                showToast("Capture error!", true);
            } finally {
                setLoading(copyButton, copySpinner, false, "🏞 Copy as jpg");
            }
        }

        async function saveImage() {
            try {
                setLoading(saveButton, saveSpinner, true, "💾 Save Image");
                const canvas = await captureToCanvas();
                const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

                const link = document.createElement("a");
                const timestamp = new Date().toISOString().replace(/[:]/g, "-").split(".")[0];
                link.download = \`code-snapshot-\${timestamp}.jpg\`;
                link.href = dataUrl;
                link.click();
                
                showToast("Image saved successfully!");
            } catch (error) {
                console.error("Save error:", error);
                showToast("Failed to save image!", true);
            } finally {
                setLoading(saveButton, saveSpinner, false, "💾 Save Image");
            }
        }

        copyButton.addEventListener("click", async () => {
            if (!navigator.clipboard) {
                showToast("Clipboard API not supported - trying alternative method", true);
            }
            await captureAndCopyToClipboard();
        });

        saveButton.addEventListener("click", saveImage);
        editModeBtn.addEventListener("click", toggleEditMode);
        codeEditor.addEventListener("input", () => {
            if (!isEditMode) return;
            autoResizeTextarea();
            updatePreview();
        });

        function autoResizeTextarea() {
            codeEditor.style.height = "auto";
            codeEditor.style.height = codeEditor.scrollHeight + "px";
        }
    </script>
</body>
</html>`;
};