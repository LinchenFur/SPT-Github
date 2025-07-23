// ==UserScript==
// @name         SP-Tarkov 加速下载助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 SPTarkov 页面添加加速下载功能
// @author       麟瑞Sama
// @match        https://hub.sp-tarkov.com/sc-dereferer/?target=*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .accel-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            gap: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 30px 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 99999;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0,0,0,0.1);
            min-width: 300px;
            text-align: center;
        }
        .accel-title {
            font-size: 22px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .accel-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .accel-button {
            padding: 12px 24px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            flex: 1;
            min-width: 160px;
        }
        .download-button {
            background: linear-gradient(135deg, #00b09b 0%, #96c93d 100%);
        }
        .accel-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }
        .accel-button:active {
            transform: translateY(1px);
        }
        .url-preview {
            font-size: 14px;
            color: #7f8c8d;
            word-break: break-all;
            margin-top: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            max-height: 100px;
            overflow-y: auto;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'accel-container';

    const title = document.createElement('div');
    title.className = 'accel-title';
    title.textContent = 'GitHub 加速下载';
    container.appendChild(title);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'accel-buttons';
    container.appendChild(buttonContainer);

    const copyButton = document.createElement('button');
    copyButton.className = 'accel-button';
    copyButton.textContent = '复制加速链接';
    buttonContainer.appendChild(copyButton);

    const downloadButton = document.createElement('button');
    downloadButton.className = 'accel-button download-button';
    downloadButton.textContent = '直接下载';
    buttonContainer.appendChild(downloadButton);

    const urlPreview = document.createElement('div');
    urlPreview.className = 'url-preview';
    container.appendChild(urlPreview);

    document.body.appendChild(container);

    function getAcceleratedUrl() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const targetUrl = urlParams.get('target');

            if (!targetUrl) {
                throw new Error('未找到目标链接');
            }

            const decodedUrl = decodeURIComponent(targetUrl);

            return `https://git-proxy.furrycraft.icu/${decodedUrl}`;
        } catch (error) {
            GM_notification({
                title: '错误',
                text: error.message,
                timeout: 5000
            });
            return null;
        }
    }

    function updateUrlPreview() {
        const acceleratedUrl = getAcceleratedUrl();
        if (acceleratedUrl) {
            urlPreview.textContent = acceleratedUrl;
        }
    }

    copyButton.addEventListener('click', () => {
        const acceleratedUrl = getAcceleratedUrl();
        if (acceleratedUrl) {
            GM_setClipboard(acceleratedUrl);

            copyButton.textContent = '✓ 已复制';
            copyButton.style.background = 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)';

            GM_notification({
                title: '链接已复制!',
                text: '加速地址已复制到剪贴板',
                timeout: 3000
            });

            setTimeout(() => {
                copyButton.textContent = '复制加速链接';
                copyButton.style.background = 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)';
            }, 2000);
        }
    });

    downloadButton.addEventListener('click', () => {
        const acceleratedUrl = getAcceleratedUrl();
        if (acceleratedUrl) {
            GM_openInTab(acceleratedUrl, { active: true });

            downloadButton.textContent = '↓ 下载中...';
            setTimeout(() => {
                downloadButton.textContent = '直接下载';
            }, 2000);
        }
    });

    updateUrlPreview();
})();
