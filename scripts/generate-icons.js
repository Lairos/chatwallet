const fs = require('fs');
const path = require('path');

// 基本的藍色圖示的 Base64 編碼
const iconBase64 = `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`;

// 確保目錄存在
const iconDir = path.join(__dirname, '../assets/icons');
if (!fs.existsSync(iconDir)){
    fs.mkdirSync(iconDir, { recursive: true });
}

// 將 Base64 轉換為圖片檔案
const iconData = Buffer.from(iconBase64, 'base64');
fs.writeFileSync(path.join(iconDir, 'icon-16.png'), iconData);
fs.writeFileSync(path.join(iconDir, 'icon-48.png'), iconData);
fs.writeFileSync(path.join(iconDir, 'icon-128.png'), iconData);

console.log('圖示檔案已生成！'); 