document.addEventListener('DOMContentLoaded', () => {
    const blurSlider = document.getElementById('blur');
    const transparencySlider = document.getElementById('transparency');
    const colorInput = document.getElementById('color');
    const glassCard = document.getElementById('glass-card');
    const resultCode = document.getElementById('result-code');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copyMessage');
    
    function updateCardStyle() {
        const blurValue = blurSlider.value;
        const transparencyValue = transparencySlider.value;
        const colorValue = colorInput.value;
        
        const r = parseInt(colorValue.slice(1, 3), 16);
        const g = parseInt(colorValue.slice(3, 5), 16);
        const b = parseInt(colorValue.slice(5, 7), 16);

        const backgroundColor = `rgba(${r}, ${g}, ${b}, ${transparencyValue})`;
        const backdropFilter = `blur(${blurValue}px)`;

        glassCard.style.backgroundColor = backgroundColor;
        glassCard.style.backdropFilter = backdropFilter;
        glassCard.style.webkitBackdropFilter = backdropFilter;

        const cssCode = `background: ${backgroundColor};
backdrop-filter: ${backdropFilter};
-webkit-backdrop-filter: ${backdropFilter};
border-radius: 15px;
border: 1px solid rgba(255, 255, 255, 0.3);`;
        
        resultCode.textContent = cssCode;
    }

    blurSlider.addEventListener('input', updateCardStyle);
    transparencySlider.addEventListener('input', updateCardStyle);
    colorInput.addEventListener('input', updateCardStyle);

    copyBtn.addEventListener('click', () => {
        // pre 태그 안의 텍스트를 복사하기 위해 resultCode.textContent 사용
        navigator.clipboard.writeText(resultCode.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    });

    updateCardStyle();
});