document.addEventListener('DOMContentLoaded', () => {
    const color1 = document.getElementById('color1');
    const color2 = document.getElementById('color2');
    const angle = document.getElementById('angle');
    const angleValue = document.getElementById('angle-value');
    const gradientTypeRadios = document.querySelectorAll('input[name="gradient-type"]');
    const preview = document.getElementById('preview');
    const resultCode = document.getElementById('result-code');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copyMessage');

    function updateGradient() {
        const c1 = color1.value;
        const c2 = color2.value;
        const ang = angle.value;
        const type = document.querySelector('input[name="gradient-type"]:checked').value;

        angleValue.textContent = `${ang}deg`;
        
        let gradientValue;
        if (type === 'linear') {
            gradientValue = `linear-gradient(${ang}deg, ${c1}, ${c2})`;
        } else {
            gradientValue = `radial-gradient(circle, ${c1}, ${c2})`;
        }

        preview.style.background = gradientValue;
        resultCode.textContent = `background: ${gradientValue};`;
    }

    // 모든 컨트롤에 이벤트 리스너 추가
    color1.addEventListener('input', updateGradient);
    color2.addEventListener('input', updateGradient);
    angle.addEventListener('input', updateGradient);
    gradientTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateGradient);
    });

    // 코드 복사 버튼 기능
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultCode.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    });

    // 페이지 로드 시 초기값으로 한 번 실행
    updateGradient();
});