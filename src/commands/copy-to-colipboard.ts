import * as vscode from 'vscode';


export const getWebviewContent = (content: string | undefined) => {
    // 对内容进行安全处理  
    if (!content) {  
        content = '';  
    }  
    
    // 转义特殊字符  
    content = content  
    //     .replace(/`/g, '\\`')           // 转义反引号  
    //     .replace(/\${/g, '\\${')        // 转义模板字符串插值语法  
        .replace(/</g, '&lt;')          // 转义HTML标签  
        .replace(/>/g, '&gt;');  

    // return content;
	return '<!DOCTYPE html>\n'+
'<html lang="en">\n'+
'<head>\n'+
    '<meta charset="UTF-8">\n'+
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'+
    '<title>Code Card</title>\n'+
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">\n'+
    '<style>\n'+
        '* {\n'+
            'box-sizing: border-box;\n'+
            'margin: 0;\n'+
            'padding: 0;\n'+
        '}\n'+

        '@keyframes rotation {\n'+
            '0% { transform: rotate(0deg); }\n'+
            '100% { transform: rotate(360deg); }\n'+
        '}\n'+    

        'body {\n'+
            'margin: 0;\n'+
            'padding: 40px 20px;\n'+
            'min-height: 100vh;\n'+
            'display: flex;\n'+
            'align-items: center;\n'+
            'justify-content: center;\n'+
            'background-color: #f3f4f6;\n'+
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n'+
        '}\n'+

        '.container {\n'+
            'display: flex;\n'+
            'flex-direction: column;\n'+
            'align-items: center;\n'+
            'gap: 16px;\n'+
            'margin: 20px;\n'+
        '}\n'+

        '.button-container {\n'+
            'display: flex;\n'+
            'gap: 12px;\n'+
            'justify-content: center;\n'+
            'margin-top: 8px;\n'+
        '}\n'+

        '.main {\n'+
            'padding: 1rem;\n'+
        '}\n'+

        '.window {\n'+
            'display: inline-block;\n'+
            'min-width: 200px;\n'+
            'background-color: white;\n'+
            'border-radius: 12px;\n'+
            'box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.08), 0 4px 4px rgba(0,0,0,0.06), 0 8px 8px rgba(0,0,0,0.04), 0 16px 16px rgba(0,0,0,0.02);\n'+
            'transition: transform 0.2s ease, box-shadow 0.2s ease;\n'+
        '}\n'+

        '.window:hover {\n'+
            'transform: translateY(-2px);\n'+
            'box-shadow: 0 2px 2px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.1), 0 8px 8px rgba(0,0,0,0.08), 0 16px 16px rgba(0,0,0,0.06), 0 32px 32px rgba(0,0,0,0.04);\n'+
        '}\n'+

        '.window-titlebar {\n'+
            'background-color: #e5e7eb;\n'+
            'padding: 12px 20px;\n'+
            'border-top-left-radius: 12px;\n'+
            'border-top-right-radius: 12px;\n'+
            'border-bottom: 1px solid rgba(209, 213, 219, 0.5);\n'+
            'display: flex;\n'+
            'justify-content: space-between;\n'+
            'align-items: center;\n'+
            'position: relative;\n'+
        '}\n'+

        '.window-controls {\n'+
            'display: flex;\n'+
            'gap: 8px;\n'+
        '}\n'+

        '.window-button {\n'+
            'width: 12px;\n'+
            'height: 12px;\n'+
            'border-radius: 50%;\n'+
            'transition: transform 0.2s ease;\n'+
            'position: relative;\n'+
        '}\n'+

        '.window-button:hover {\n'+
            'transform: scale(1.1);\n'+
        '}\n'+

        '.window-button::after {\n'+
            'content: "";\n'+
            'position: absolute;\n'+
            'top: 0;\n'+
            'left: 0;\n'+
            'right: 0;\n'+
            'bottom: 0;\n'+
            'border-radius: 50%;\n'+
            'box-shadow: inset 0 1px 1px rgba(255,255,255,0.15);\n'+
        '}\n'+

        '.button-close {\n'+
            'background-color: #ff5f57;\n'+
        '}\n'+

        '.button-minimize {\n'+
            'background-color: #ffbd2e;\n'+
        '}\n'+

        '.button-expand {\n'+
            'background-color: #28c840;\n'+
        '}\n'+

        '.window-title {\n'+
            'font-size: 12px;\n'+
            'color: #6b7280;\n'+
            'position: absolute;\n'+
            'left: 50%;\n'+
            'transform: translateX(-50%);\n'+
            'white-space: nowrap;\n'+
        '}\n'+

        '.window-content {\n'+
            'padding: 24px;\n'+
            'background-color: white;\n'+
            'border-bottom-left-radius: 12px;\n'+
            'border-bottom-right-radius: 12px;\n'+
            'overflow: hidden;\n'+
        '}\n'+

        'pre {\n'+
            'margin: 0;\n'+
            'white-space: pre-wrap;\n'+       // 修改这里
    'word-wrap: break-word;\n'+       // 添加这行
    'overflow-x: auto;\n'+          
        '}\n'+

        'code {\n'+
            'font-family: "Fira Code", "Menlo", "Monaco", "Courier New", monospace;\n'+
            'font-size: 14px;\n'+
            'line-height: 1.6;\n'+
            'background: transparent;\n'+
            'word-break: break-all;\n'+       // 添加这行
    'white-space: pre-wrap;\n'+       // 添加这行
        '}\n'+

        '.hljs {\n'+
            'padding: 0;\n'+
            'background: transparent;\n'+
        '}\n'+

        '.action-button {\n'+
            'padding: 10px 20px;\n'+
            'font-size: 13px;\n'+
            'color: #ffffff;\n'+
            'background-color: #0ea5e9;\n'+
            'border: none;\n'+
            'border-radius: 8px;\n'+
            'cursor: pointer;\n'+
            'transition: all 0.2s ease;\n'+
            'font-weight: 500;\n'+
            'box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2), 0 4px 6px rgba(14, 165, 233, 0.1);\n'+
            'display: inline-flex;\n'+
            'align-items: center;\n'+
            'gap: 8px;\n'+
        '}\n'+

        '.action-button:hover {\n'+
            'background-color: #0284c7;\n'+
            'transform: translateY(-1px);\n'+
            'box-shadow: 0 4px 6px rgba(14, 165, 233, 0.25), 0 6px 8px rgba(14, 165, 233, 0.15);\n'+
        '}\n'+

        '.action-button:active {\n'+
            'transform: translateY(0);\n'+
            'box-shadow: 0 1px 2px rgba(14, 165, 233, 0.2);\n'+
        '}\n'+

        '.action-button:disabled {\n'+
            'background-color: #9ca3af;\n'+
            'cursor: not-allowed;\n'+
            'transform: none;\n'+
            'box-shadow: none;\n'+
        '}\n'+

        '.spinner {\n'+
            'width: 16px;\n'+
            'height: 16px;\n'+
            'border: 2px solid #ffffff;\n'+
            'border-bottom-color: transparent;\n'+
            'border-radius: 50%;\n'+
            'display: none;\n'+
            'animation: rotation 1s linear infinite;\n'+
        '}\n'+

        '.spinner.active {\n'+
            'display: inline-block;\n'+
        '}\n'+

        '#toast {\n'+
            'position: fixed;\n'+
            'top: 20px;\n'+
            'right: 20px;\n'+
            'padding: 12px 24px;\n'+
            'background-color: #10b981;\n'+
            'color: white;\n'+
            'border-radius: 8px;\n'+
            'font-size: 14px;\n'+
            'transform: translateY(-100px);\n'+
            'transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n'+
            'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);\n'+
        '}\n'+

        '#toast.show {\n'+
            'transform: translateY(0);\n'+
        '}\n'+

        '@media (max-width: 640px) {\n'+
            'body {\n'+
                'padding: 20px 10px;\n'+
            '}\n'+

            '.container {\n'+
                'margin: 10px;\n'+
            '}\n'+

            '.window {\n'+
                'margin: 5px;\n'+
            '}\n'+

            '.window-content {\n'+
                'padding: 16px;\n'+
            '}\n'+

            '.button-container {\n'+
                'flex-direction: column;\n'+
                'width: 100%;\n'+
            '}\n'+

            '.action-button {\n'+
                'width: 100%;\n'+
                'justify-content: center;\n'+
            '}\n'+
        '}\n'+
    '</style>\n'+
'</head>\n'+
'<body>\n'+
    '<div class="container">\n'+
        '<div class="main">\n'+
            '<div class="window">\n'+
                '<div class="window-titlebar">\n'+
                    '<div class="window-controls">\n'+
                        '<div class="window-button button-close"></div>\n'+
                        '<div class="window-button button-minimize"></div>\n'+
                        '<div class="window-button button-expand"></div>\n'+
                    '</div>\n'+
                    '<div class="window-title">Code Card</div>\n'+
                '</div>\n'+
                '<div class="window-content">\n'+
                    '<pre><code id="codeBlock">'+content+'</code></pre>\n'+
                '</div>\n'+
            '</div>\n'+
        '</div>\n'+
        '<div class="button-container">\n'+
            '<button class="action-button" id="copyButton">\n'+
                '<span class="spinner" id="copySpinner"></span>\n'+
                '<span class="button-text">Copy as jpg</span>\n'+
            '</button>\n'+
            '<button class="action-button" id="saveButton">\n'+
                '<span class="spinner" id="saveSpinner"></span>\n'+
                '<span class="button-text">Save Image</span>\n'+
            '</button>\n'+
        '</div>\n'+
    '</div>\n'+
    '<div id="toast">Copied to clipboard!</div>\n'+
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>\n'+
    '<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>\n'+
    '<script>\n'+
        'hljs.highlightAll();\n'+
        'const copyButton = document.getElementById("copyButton");\n'+
        'const saveButton = document.getElementById("saveButton");\n'+
        'const copySpinner = document.getElementById("copySpinner");\n'+
        'const saveSpinner = document.getElementById("saveSpinner");\n'+
        'const toast = document.getElementById("toast");\n'+

        'function setLoading(button, spinner, isLoading, text) {\n'+
            'button.disabled = isLoading;\n'+
            'spinner.classList.toggle("active", isLoading);\n'+
            'button.querySelector(".button-text").textContent = isLoading ? "Processing..." : text;\n'+
        '}\n'+

        'function showToast(message, isError = false) {\n'+
            'toast.textContent = message;\n'+
            'toast.style.backgroundColor = isError ? "#ef4444" : "#10b981";\n'+
            'toast.classList.add("show");\n'+
            'setTimeout(() => {\n'+
                'toast.classList.remove("show");\n'+
            '}, 3000);\n'+
        '}\n'+

        'async function fallbackCopy(dataUrl) {\n'+
            'try {\n'+
                'const img = new Image();\n'+
                'img.src = dataUrl;\n'+
                'img.style.position = "fixed";\n'+
                'img.style.left = "-9999px";\n'+
                'document.body.appendChild(img);\n'+

                'const tempCanvas = document.createElement("canvas");\n'+
                'await new Promise(resolve => {\n'+
                    'img.onload = () => {\n'+
                        'tempCanvas.width = img.width;\n'+
                        'tempCanvas.height = img.height;\n'+
                        'const ctx = tempCanvas.getContext("2d");\n'+
                        'ctx.drawImage(img, 0, 0);\n'+
                        'document.body.removeChild(img);\n'+
                        'resolve();\n'+
                    '};\n'+
                '});\n'+

                'tempCanvas.toBlob(async (blob) => {\n'+
                    'try {\n'+
                        'const clipboardItem = new ClipboardItem({ "image/png": blob });\n'+
                        'await navigator.clipboard.write([clipboardItem]);\n'+
                        'showToast("Copied to clipboard!");\n'+
                    '} catch (e) {\n'+
                        'console.error("Fallback copy failed:", e);\n'+
                        'const link = document.createElement("a");\n'+
                        'link.download = "code-snapshot.jpg";\n'+
                        'link.href = dataUrl;\n'+
                        'link.click();\n'+
                        'showToast("Image downloaded (copy not supported in your browser)", true);\n'+
                    '}\n'+
                '}, "image/png");\n'+
            '} catch (error) {\n'+
                'console.error("Fallback error:", error);\n'+
                'showToast("Failed to copy/download image", true);\n'+
            '}\n'+
        '}\n'+

        'async function captureToCanvas() {\n'+
            'const element = document.querySelector(".main");\n'+
            'return html2canvas(element, {\n'+
                'backgroundColor: null,\n'+
                'scale: 2,\n'+
                'logging: false,\n'+
                'useCORS: true\n'+
            '});\n'+
        '}\n'+

        'async function captureAndCopyToClipboard() {\n'+
            'try {\n'+
                'setLoading(copyButton, copySpinner, true, "Copy as jpg");\n'+
                'const canvas = await captureToCanvas();\n'+
                'const dataUrl = canvas.toDataURL("image/jpeg", 0.95);\n'+

                'try {\n'+
                    'const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));\n'+
                    'const clipboardItem = new ClipboardItem({ "image/png": blob });\n'+
                    'await navigator.clipboard.write([clipboardItem]);\n'+
                    'showToast("Copied to clipboard!");\n'+
                '} catch (clipboardError) {\n'+
                    'console.warn("Primary clipboard method failed, trying fallback:", clipboardError);\n'+
                    'await fallbackCopy(dataUrl);\n'+
                '}\n'+
            '} catch (error) {\n'+
                'console.error("Capture error:", error);\n'+
                'showToast("Capture error!", true);\n'+
            '} finally {\n'+
                'setLoading(copyButton, copySpinner, false, "Copy as jpg");\n'+
            '}\n'+
        '}\n'+

        'async function saveImage() {\n'+
            'try {\n'+
                'setLoading(saveButton, saveSpinner, true, "Save Image");\n'+
                'const canvas = await captureToCanvas();\n'+
                'const dataUrl = canvas.toDataURL("image/jpeg", 0.95);\n'+

                'const link = document.createElement("a");\n'+
                'const timestamp = new Date().toISOString().replace(/[:]/g, "-").split(".")[0];\n'+
                'link.download = `code-snapshot-${timestamp}.jpg`;\n'+
                'link.href = dataUrl;\n'+
                'link.click();\n'+
                
                'showToast("Image saved successfully!");\n'+
            '} catch (error) {\n'+
                'console.error("Save error:", error);\n'+
                'showToast("Failed to save image!", true);\n'+
            '} finally {\n'+
                'setLoading(saveButton, saveSpinner, false, "Save Image");\n'+
            '}\n'+
        '}\n'+

        'copyButton.addEventListener("click", async () => {\n'+
            'if (!navigator.clipboard) {\n'+
                'showToast("Clipboard API not supported - trying alternative method", true);\n'+
            '}\n'+
            'await captureAndCopyToClipboard();\n'+
        '});\n'+

        'saveButton.addEventListener("click", saveImage);\n'+
    '</script>\n'+
'</body>\n'+
'</html>';
}