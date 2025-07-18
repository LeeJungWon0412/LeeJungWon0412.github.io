document.addEventListener('DOMContentLoaded', () => {
    // HTML 요소 가져오기
    const uploadLabel = document.querySelector('.upload-label'); // 드래그 영역
    const imageInput = document.getElementById('imageInput');
    const controlsAndResult = document.getElementById('controlsAndResult');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValueDisplay = document.getElementById('qualityValue');
    const previewOriginal = document.getElementById('previewOriginal');
    const previewCompressed = document.getElementById('previewCompressed');
    const processingCanvas = document.getElementById('processingCanvas');
    const ctx = processingCanvas.getContext('2d');
    const sizeBeforeDisplay = document.getElementById('sizeBefore');
    const sizeAfterDisplay = document.getElementById('sizeAfter');
    const downloadLink = document.getElementById('downloadLink');

    let currentFile = null;
    let originalImage = new Image();

    // 압축 및 표시 함수 (변경 없음)
    function compressAndDisplay() {
        if (!originalImage.src || !currentFile) return;
        processingCanvas.width = originalImage.naturalWidth;
        processingCanvas.height = originalImage.naturalHeight;
        ctx.drawImage(originalImage, 0, 0);
        const quality = parseFloat(qualitySlider.value);
        const outputFormat = currentFile.type === 'image/png' ? 'image/jpeg' : currentFile.type;
        const compressedDataURL = processingCanvas.toDataURL(outputFormat, quality);
        previewCompressed.src = compressedDataURL;
        fetch(compressedDataURL)
            .then(res => res.blob())
            .then(blob => {
                const compressedSizeKB = (blob.size / 1024).toFixed(2);
                sizeAfterDisplay.textContent = `압축 후: ${compressedSizeKB} KB`;
            });
        downloadLink.href = compressedDataURL;
        const extension = outputFormat === 'image/jpeg' ? 'jpg' : currentFile.name.split('.').pop();
        downloadLink.download = `compressed_${currentFile.name.split('.').slice(0, -1).join('.')}.${extension}`;
    }

    // 파일 처리 로직을 별도 함수로 분리
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('이미지 파일만 선택해주삼');
            return;
        }
        currentFile = file;

        const objectURL = URL.createObjectURL(file);
        originalImage.src = objectURL;
        previewOriginal.src = objectURL;

        const originalSizeKB = (file.size / 1024).toFixed(2);
        sizeBeforeDisplay.textContent = `원본: ${originalSizeKB} KB`;
        
        controlsAndResult.style.display = 'block';

        originalImage.onload = () => {
            compressAndDisplay();
            URL.revokeObjectURL(objectURL);
        };
    }

    // --- 이벤트 리스너 설정 ---

    // 슬라이더 이벤트
    qualitySlider.addEventListener('input', () => {
        qualityValueDisplay.textContent = qualitySlider.value;
        compressAndDisplay();
    });

    // 클릭해서 파일 선택
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files && event.target.files[0];
        handleFile(file);
    });

    // --- 드래그 앤 드롭 이벤트 리스너 추가 ---
    
    // 기본 동작 방지
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    // 드래그 중일 때 시각적 효과 추가
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, () => {
            uploadLabel.classList.add('dragover');
        }, false);
    });

    // 드래그가 영역을 벗어났을 때 시각적 효과 제거
    ['dragleave', 'drop'].forEach(eventName => {
        uploadLabel.addEventListener(eventName, () => {
            uploadLabel.classList.remove('dragover');
        }, false);
    });

    // 파일 드롭 시 처리
    uploadLabel.addEventListener('drop', (e) => {
        const file = e.dataTransfer && e.dataTransfer.files[0];
        handleFile(file);
    }, false);
});

// 설명 펼치기/접기 기능
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionContent = document.getElementById('descriptionContent');

if (toggleBtn && descriptionContent) {
    toggleBtn.addEventListener('click', () => {
        const isHidden = descriptionContent.classList.toggle('hidden');
        
        if (isHidden) {
            toggleBtn.innerHTML = '📖 사진 압축기 설명 및 정보 보기 ▼';
        } else {
            toggleBtn.innerHTML = '📖 사진 압축기 설명 및 정보 숨기기 ▲';
        }
    });
}