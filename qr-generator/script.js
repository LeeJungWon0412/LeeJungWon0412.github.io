document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('qrTextInput');
    const qrCanvas = document.getElementById('qrCanvas');
    const qrError = document.getElementById('qrError');
    const downloadLink = document.getElementById('downloadLink');
    const ctx = qrCanvas.getContext('2d');
    
    const MAX_LENGTH = 1000;
    let debounceTimer;

    function generateQRCode() {
        const text = textInput.value.trim();

        if (!text) {
            qrCanvas.style.display = 'none';
            qrError.style.display = 'none';
            downloadLink.style.display = 'none';
            return;
        }

        if (text.length > MAX_LENGTH) {
            qrCanvas.style.display = 'none';
            downloadLink.style.display = 'none';
            qrError.textContent = `입력 내용이 너무 김 (최대 ${MAX_LENGTH}자).`;
            qrError.style.display = 'block';
            return;
        }

        try {
            const qr = new QRious({
                value: text,
                // size를 직접 지정하지 않으면, 라이브러리가 데이터 양에 맞춰 최적의 크기를 결정함
                level: 'H',
                background: '#FFFFFF',
                foreground: '#000000'
            });

            qr.image.onload = () => {
                // --- ▼▼▼ 핵심 변경점 ▼▼▼ ---
                // 라이브러리가 생성한 이미지 크기에 맞춰 캔버스 크기를 동적으로 조절
                const generatedSize = qr.image.naturalWidth;
                const padding = 20; // 여백을 넉넉하게 20px로 설정
                qrCanvas.width = generatedSize + padding * 2;
                qrCanvas.height = generatedSize + padding * 2;
                // --- ▲▲▲ 핵심 변경점 ▲▲▲ ---

                ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);

                ctx.imageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;
                
                ctx.drawImage(qr.image, padding, padding);

                qrCanvas.style.display = 'block';
                qrError.style.display = 'none';
                downloadLink.style.display = 'block';
                downloadLink.href = qrCanvas.toDataURL('image/png');
                downloadLink.download = 'qrcode.png';
            };

        } catch (error) {
            console.error(error);
            qrCanvas.style.display = 'none';
            downloadLink.style.display = 'none';
            qrError.textContent = 'QR코드 생성 중 오류가 발생했삼';
            qrError.style.display = 'block';
        }
    }

    textInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(generateQRCode, 400);
    });
});