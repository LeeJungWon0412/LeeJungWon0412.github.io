document.addEventListener('DOMContentLoaded', () => {
    const controls = document.querySelectorAll('.controls-container input');
    const previewBox = document.getElementById('preview-box');
    const resultCode = document.getElementById('result-code');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copyMessage');

    function updateShadow() {
        const offsetX = document.getElementById('offset-x').value;
        const offsetY = document.getElementById('offset-y').value;
        const blurRadius = document.getElementById('blur-radius').value;
        const spreadRadius = document.getElementById('spread-radius').value;
        const shadowColor = document.getElementById('shadow-color').value;
        const shadowOpacity = document.getElementById('shadow-opacity').value;
        const inset = document.getElementById('inset-shadow').checked ? 'inset' : '';

        const r = parseInt(shadowColor.slice(1, 3), 16);
        const g = parseInt(shadowColor.slice(3, 5), 16);
        const b = parseInt(shadowColor.slice(5, 7), 16);
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;

        const boxShadowValue = `${inset} ${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`.trim();

        previewBox.style.boxShadow = boxShadowValue;
        resultCode.textContent = `box-shadow: ${boxShadowValue};`;
        
        document.querySelector('label[for="offset-x"] + input + .value-display').textContent = `${offsetX}px`;
        document.querySelector('label[for="offset-y"] + input + .value-display').textContent = `${offsetY}px`;
        document.querySelector('label[for="blur-radius"] + input + .value-display').textContent = `${blurRadius}px`;
        document.querySelector('label[for="spread-radius"] + input + .value-display').textContent = `${spreadRadius}px`;
        document.querySelector('label[for="shadow-color"] + input + .value-display').textContent = shadowColor;
        document.querySelector('label[for="shadow-opacity"] + input + .value-display').textContent = shadowOpacity;
    }

    controls.forEach(control => {
        control.addEventListener('input', updateShadow);
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultCode.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    });

    updateShadow();
});