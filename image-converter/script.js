document.addEventListener('DOMContentLoaded', () => {
    const uploadLabel = document.querySelector('.upload-label');
    const imageInput = document.getElementById('imageInput');
    const controlsAndResult = document.getElementById('controlsAndResult');
    const previewImage = document.getElementById('previewImage');
    const formatSelect = document.getElementById('formatSelect');
    const downloadLink = document.getElementById('downloadLink');
    const processingCanvas = document.getElementById('processingCanvas');
    const ctx = processingCanvas.getContext('2d');

    let originalFile = null;
    let originalImage = new Image();

    // 다운로드 링크를 업데이트하는 함수를 분리
    function updateDownloadLink() {
        if (!originalImage.src) return;

        processingCanvas.width = originalImage.naturalWidth;
        processingCanvas.height = originalImage.naturalHeight;
        ctx.drawImage(originalImage, 0, 0);

        const format = formatSelect.value;
        const dataURL = processingCanvas.toDataURL(`image/${format}`);

        let extension;
        if (format === 'jpeg') {
            extension = 'jpg';
        } else if (format === 'bmp') {
            extension = 'bmp';
        } else {
            extension = format;
        }
        
        const originalFileName = originalFile.name.split('.').slice(0, -1).join('.');
        
        downloadLink.href = dataURL;
        downloadLink.download = `${originalFileName}.${extension}`;
    }

    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('이미지 파일만 선택해주삼');
            return;
        }
        originalFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            originalImage.src = e.target.result;
            controlsAndResult.style.display = 'block';

            // 이미지가 로드된 후 첫 다운로드 링크 생성
            originalImage.onload = () => {
                updateDownloadLink();
            };
        };
        reader.readAsDataURL(file);
    }

    // --- 이벤트 리스너 ---
    imageInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    
    // 드래그 앤 드롭 이벤트
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, () => uploadLabel.classList.add('dragover'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, () => uploadLabel.classList.remove('dragover'), false);
    });
    uploadLabel.addEventListener('drop', (e) => handleFile(e.dataTransfer.files[0]), false);

    // ▼▼▼ 핵심 변경점 ▼▼▼
    // 형식을 변경할 때마다 다운로드 링크를 미리 업데이트
    formatSelect.addEventListener('change', updateDownloadLink);
});