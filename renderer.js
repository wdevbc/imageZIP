const { ipcRenderer } = require('electron');

let sourceFolder = '';
let destinationFolder = '';
let quality = 75;

// 원본 폴더 선택
document.getElementById('select-source').addEventListener('click', async () => {
    try {
        const folder = await ipcRenderer.invoke('select-folder');
        if (folder) {
            sourceFolder = folder;
            document.getElementById('source-folder').textContent = folder;
        } else {
            document.getElementById('status').textContent = '원본 폴더 선택이 취소되었습니다.';
        }
    } catch (error) {
        console.error('Error selecting source folder:', error);
        document.getElementById('status').textContent = '원본 폴더를 선택하는 중 오류가 발생했습니다.';
    }
});

// 압축된 폴더 선택
document.getElementById('select-destination').addEventListener('click', async () => {
    try {
        const folder = await ipcRenderer.invoke('select-folder');
        if (folder) {
            destinationFolder = folder;
            document.getElementById('destination-folder').textContent = folder;
        } else {
            document.getElementById('status').textContent = '압축 폴더 선택이 취소되었습니다.';
        }
    } catch (error) {
        console.error('Error selecting destination folder:', error);
        document.getElementById('status').textContent = '압축 폴더를 선택하는 중 오류가 발생했습니다.';
    }
});

// 품질 슬라이더 이벤트
document.getElementById('quality-slider').addEventListener('input', (event) => {
    quality = parseInt(event.target.value, 10); // Ensure quality is an integer
    document.getElementById('quality-value').textContent = `${quality}%`;
});

// 압축 실행 버튼
document.getElementById('compress').addEventListener('click', async () => {
    if (!sourceFolder || !destinationFolder) {
        document.getElementById('status').textContent = '원본 폴더와 압축 폴더를 모두 선택해주세요.';
        return;
    }

    document.getElementById('status').textContent = '압축중...';

    try {
        const result = await ipcRenderer.invoke('run-compression', sourceFolder, destinationFolder, quality);
        document.getElementById('status').textContent = '압축 완료!';
        console.log('Compression result:', result);
    } catch (error) {
        console.error('Compression error:', error);
        document.getElementById('status').textContent = `압축 중 오류 발생: ${error.message || '알 수 없는 오류'}`;
    }
});
