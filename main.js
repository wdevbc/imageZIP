const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 550,
        height: 550,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: false,
            nodeIntegration: true,
        },
    });

    Menu.setApplicationMenu(null);
    mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('select-folder', async () => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
        });
        return result.canceled ? null : result.filePaths[0];
    } catch (error) {
        console.error('Error selecting folder:', error);
        throw new Error('폴더 선택 중 오류가 발생했습니다.');
    }
});

ipcMain.handle('run-compression', async (event, source, destination, quality, openFolder) => {
    if (path.resolve(source) === path.resolve(destination)) {
        return '원본 폴더와 대상 폴더는 같을 수 없습니다. 다른 폴더를 선택해주세요.';
    }

    try {
        const files = fs.readdirSync(source);

        for (const file of files) {
            const filePath = path.join(source, file);
            const outputFilePath = path.join(destination, file);

            if (fs.lstatSync(filePath).isFile()) {
                const ext = path.extname(file).toLowerCase();

                if (['.jpg', '.jpeg'].includes(ext)) {
                    // JPEG 최적화
                    await sharp(filePath)
                        .jpeg({
                            quality: parseInt(quality, 10), // JPEG 품질
                            progressive: true,
                            mozjpeg: true,
                        })
                        .toFile(outputFilePath);
                } else if (ext === '.png') {
                    // PNG 최적화
                    await sharp(filePath)
                        .png({
                            compressionLevel: 9,
                            palette: true,
                        })
                        .toFile(outputFilePath);
                } else if (ext === '.webp') {
                    // WebP 최적화
                    await sharp(filePath)
                        .webp({
                            quality: parseInt(quality, 10),
                        })
                        .toFile(outputFilePath);
                } else {
                    console.log(`Unsupported file format: ${file}`);
                }
            }
        }

        if (openFolder) {
            shell.openPath(destination);
        }

        return '최적화 완료!';
    } catch (error) {
        console.error('Optimization error:', error);
        throw new Error('이미지 최적화 중 오류가 발생했습니다.');
    }
});
