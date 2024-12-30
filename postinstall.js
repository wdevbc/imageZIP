const path = require('path');
const { execSync } = require('child_process');

// 경로 설정
const unpackedExePath = path.resolve(__dirname, 'dist', 'win-unpacked', 'imageZIP.exe');
const iconPath = path.resolve(__dirname, 'resources', 'icons', 'icon.ico');

// rcedit 실행 경로
const rceditPath = path.resolve(process.env.NVM_SYMLINK || '', 'node_modules', 'rcedit', 'bin', 'rcedit.exe');

// 아이콘 업데이트 함수
function updateIcon(exePath) {
    try {
        console.log(`Updating icon for ${exePath}...`);
        execSync(`"${rceditPath}" "${exePath}" --set-icon "${iconPath}"`, { stdio: 'inherit' });
        console.log(`Icon updated for ${exePath}`);
    } catch (error) {
        console.error(`Failed to update icon for ${exePath}:`, error);
    }
}

// 실행 파일 아이콘 변경
updateIcon(unpackedExePath);
