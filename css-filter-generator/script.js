document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.filter-slider');
    const previewImage = document.getElementById('preview-image');
    const resultCode = document.getElementById('result-code');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyMessage = document.getElementById('copyMessage');

    const defaultValues = {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        sepia: 0,
        'hue-rotate': 0,
        blur: 0
    };

    function updateFilters() {
        const filterValues = Array.from(sliders).map(slider => {
            const value = slider.value;
            const unit = slider.dataset.unit;
            // 기본값과 다를 경우에만 필터 문자열 생성
            if (value != defaultValues[slider.id]) {
                return `${slider.id}(${value}${unit})`;
            }
            return '';
        }).filter(Boolean); // 빈 문자열 제거

        const filterString = filterValues.join(' ');
        
        previewImage.style.filter = filterString;
        resultCode.textContent = `filter: ${filterString || 'none'};`;
    }

    sliders.forEach(slider => {
        slider.addEventListener('input', updateFilters);
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultCode.textContent).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    });

    resetBtn.addEventListener('click', () => {
        sliders.forEach(slider => {
            slider.value = defaultValues[slider.id];
        });
        updateFilters();
    });

    updateFilters();
});