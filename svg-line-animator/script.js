document.addEventListener('DOMContentLoaded', () => {
    const svgInput = document.getElementById('svg-input');
    const generateBtn = document.getElementById('generate-btn');
    const previewBox = document.getElementById('preview-box');
    const cssResult = document.getElementById('css-result');
    const copyBtn = document.getElementById('copy-btn');
    const copyMessage = document.getElementById('copyMessage');
    const styleTagId = 'svg-animation-style';

    generateBtn.addEventListener('click', () => {
        const svgCode = svgInput.value.trim();
        if (!svgCode.startsWith('<svg')) {
            alert('올바른 SVG 코드를 입력해주삼');
            return;
        }

        previewBox.innerHTML = svgCode;
        const svgElement = previewBox.querySelector('svg');
        if (!svgElement) return;
        
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        
        const elementsToAnimate = svgElement.querySelectorAll('path, line, polyline, rect, circle, ellipse');
        if (elementsToAnimate.length === 0) {
            cssResult.textContent = "애니메이션을 적용할 선(path 등)이 없삼";
            return;
        }
        
        let dynamicCss = '';
        elementsToAnimate.forEach((element, index) => {
            let totalLength = 0;
            if (typeof element.getTotalLength === 'function') {
                totalLength = Math.ceil(element.getTotalLength());
            } else {
                const bbox = element.getBBox();
                totalLength = Math.ceil((bbox.width + bbox.height) * 2);
            }

            if (totalLength > 0) {
                const className = `animated-path-${index}`;
                element.classList.add(className);
                
                dynamicCss += `.${className} {\n`;
                dynamicCss += `    stroke-dasharray: ${totalLength};\n`;
                dynamicCss += `    stroke-dashoffset: ${totalLength};\n`;
                dynamicCss += `    animation-delay: ${index * 0.15}s;\n`;
                dynamicCss += `}\n\n`;
            }
        });
        
        const baseStyle = `#preview-box.animate svg * {\n    animation: draw 2s ease-in-out forwards;\n}\n\n`;
        const keyframes = `@keyframes draw {\n    to {\n        stroke-dashoffset: 0;\n    }\n}`;
        const finalCss = `/* SVG 태그에 class="animated-svg" 를 추가해주삼 */\n\n${baseStyle}${dynamicCss}${keyframes}`;
        cssResult.textContent = finalCss;
        
        let styleTag = document.getElementById(styleTagId);
        if (styleTag) styleTag.remove();
        
        styleTag = document.createElement('style');
        styleTag.id = styleTagId;
        styleTag.innerHTML = baseStyle + dynamicCss + keyframes;
        document.head.appendChild(styleTag);
        
        previewBox.classList.remove('animate');
        void previewBox.offsetWidth;
        previewBox.classList.add('animate');
    });

    // ▼▼▼ 핵심 변경점 ▼▼▼
    copyBtn.addEventListener('click', () => {
        // 코드 내용이 비어있지만 않으면 복사되도록 조건 수정
        if (!cssResult.textContent || cssResult.textContent === '/* 생성된 코드가 여기에 표시되삼 */') {
            return;
        }
        navigator.clipboard.writeText(cssResult.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    });
    // ▲▲▲ 핵심 변경점 ▲▲▲
});