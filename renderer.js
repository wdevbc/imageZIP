const { ipcRenderer } = require('electron');

let sourceFolder = '';
let destinationFolder = '';
let quality = 75; // 기본 품질 75로 설정

// 원본 폴더 선택
document.getElementById('select-source').addEventListener('click', async () => {
    const folder = await ipcRenderer.invoke('select-folder');
    if (folder) {
        sourceFolder = folder;
        document.getElementById('source-folder').textContent = folder;
    }
});

// 대상 폴더 선택
document.getElementById('select-destination').addEventListener('click', async () => {
    const folder = await ipcRenderer.invoke('select-folder');
    if (folder) {
        destinationFolder = folder;
        document.getElementById('destination-folder').textContent = folder;
    }
});

// 품질 슬라이더 이벤트
document.getElementById('quality-slider').addEventListener('input', (event) => {
    quality = parseInt(event.target.value, 10);
    document.getElementById('quality-value').textContent = `${quality}%`;
});

// 압축 버튼 클릭 이벤트
document.getElementById('compress').addEventListener('click', async () => {
    if (!sourceFolder || !destinationFolder) {
        document.getElementById('status').textContent = '원본 및 대상 폴더를 선택해주세요.';
        return;
    }

    if (sourceFolder === destinationFolder) {
        document.getElementById('status').textContent = '원본 폴더와 대상 폴더는 같을 수 없습니다. 다른 폴더를 선택해주세요.';
        return;
    }

    const openFolder = document.getElementById('open-folder').checked; // 체크박스 상태 확인

    document.getElementById('status').textContent = '압축 중...';

    try {
        const result = await ipcRenderer.invoke('run-compression', sourceFolder, destinationFolder, quality, openFolder);
        document.getElementById('status').textContent = result;
    } catch (error) {
        document.getElementById('status').textContent = `오류: ${error.message}`;
    }
});
