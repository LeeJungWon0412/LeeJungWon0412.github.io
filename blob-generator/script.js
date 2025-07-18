document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.radius-slider');
    const blobPreview = document.getElementById('blob-preview');
    const resultCode = document.getElementById('result-code');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copyMessage');
    const colorInput1 = document.getElementById('color1'); // 색상 input 요소 추가
    const colorInput2 = document.getElementById('color2'); // 색상 input 요소 추가

    function updateBlob() {
        const slider1 = document.getElementById('slider1').value;
        const slider2 = document.getElementById('slider2').value;
        const slider3 = document.getElementById('slider3').value;
        const slider4 = document.getElementById('slider4').value;
        const color1 = colorInput1.value; // 선택된 색상 값 가져오기
        const color2 = colorInput2.value; // 선택된 색상 값 가져오기

        const borderRadiusValue = `${slider1}% ${100-slider1}% ${slider3}% ${100-slider3}% / ${100-slider4}% ${slider2}% ${100-slider2}% ${slider4}%`;

        blobPreview.style.borderRadius = borderRadiusValue;
        blobPreview.style.backgroundImage = `linear-gradient(90deg, ${color1}, ${color2})`; // 배경색 변경
        resultCode.textContent = `background-image: linear-gradient(90deg, ${color1}, ${color2});\nborder-radius: ${borderRadiusValue};`;
    }

    sliders.forEach(slider => {
        slider.addEventListener('input', updateBlob);
    });

    colorInput1.addEventListener('input', updateBlob); // 색상 input 이벤트 리스너 추가
    colorInput2.addEventListener('input', updateBlob); // 색상 input 이벤트 리스너 추가

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultCode.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    });

    updateBlob();
});