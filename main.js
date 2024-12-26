const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 500,
        resizable: false,
        icon: path.join(__dirname, 'resources', 'images', 'favicon', 'favicon.ico'), // 아이콘 경로 지정
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null; // 창이 닫히면 참조 해제
    });
}

app.on('ready', () => {
    // 상단 메뉴 제거
    Menu.setApplicationMenu(null);
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (!mainWindow) createWindow();
});

// 폴더 선택 핸들러
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

// 압축 실행 핸들러
ipcMain.handle('run-compression', (event, source, destination, quality) => {
    return new Promise((resolve, reject) => {
        if (!source || !destination || !quality) {
            reject(new Error('모든 매개변수 (source, destination, quality)가 필요합니다.'));
            return;
        }

        const command = `gulp --source "${source}" --destination "${destination}" --quality ${quality}`;
        console.log(`Executing Command: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Compression Error:', error);
                reject(new Error('압축 실행 중 오류가 발생했습니다.'));
            } else if (stderr) {
                console.error('Compression Stderr:', stderr);
                reject(new Error(stderr));
            } else {
                console.log('Compression Success:', stdout);
                resolve(stdout);
            }
        });
    });
});
