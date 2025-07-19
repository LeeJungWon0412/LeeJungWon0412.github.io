document.addEventListener('DOMContentLoaded', () => {
    const rotateXSlider = document.getElementById('rotateX');
    const rotateYSlider = document.getElementById('rotateY');
    const cube = document.getElementById('cube');
    const resultCode = document.getElementById('result-code');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copyMessage');

    function updateCube() {
        const rotateX = rotateXSlider.value;
        const rotateY = rotateYSlider.value;

        const transformValue = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // 1. 미리보기 큐브에 스타일 적용
        cube.style.transform = transformValue;

        // 2. 결과 코드 생성
        const cssCode =
`.scene {
    perspective: 600px;
}
.cube {
    transform-style: preserve-3d;
    transition: transform 0.5s;
    transform: ${transformValue};
}
.cube:hover {
    /* 마우스를 올렸을 때의 효과를 여기에 추가할 수 있습니다. */
    transform: rotateX(0deg) rotateY(0deg);
}`;
        
        resultCode.textContent = cssCode;
    }

    rotateXSlider.addEventListener('input', updateCube);
    rotateYSlider.addEventListener('input', updateCube);

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultCode.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    });

    // 페이지 로드 시 초기값으로 한 번 실행
    updateCube();
});