document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const countWithSpaces = document.getElementById('countWithSpaces');
    const countWithoutSpaces = document.getElementById('countWithoutSpaces');
    const wordCount = document.getElementById('wordCount');
    const lineCount = document.getElementById('lineCount');
    const clearButton = document.getElementById('clearButton');

    function updateCounts() {
        const text = textInput.value;

        // 1. 공백 포함 글자 수
        countWithSpaces.textContent = text.length;

        // 2. 공백 제외 글자 수
        countWithoutSpaces.textContent = text.replace(/\s/g, '').length;

        // 3. 단어 수 (공백으로 구분)
        const words = text.trim().split(/\s+/).filter(word => word !== '');
        wordCount.textContent = words.length === 1 && words[0] === '' ? 0 : words.length;
        
        // 4. 줄 수
        const lines = text.split('\n');
        lineCount.textContent = text ? lines.length : 0;
    }

    // 텍스트를 입력할 때마다 함수 실행
    textInput.addEventListener('input', updateCounts);

    // '모두 지우기' 버튼 클릭 이벤트
    clearButton.addEventListener('click', () => {
        textInput.value = '';
        updateCounts(); // 카운트 초기화
    });
});

// 설명 펼치기/접기 기능
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionContent = document.getElementById('descriptionContent');

if (toggleBtn && descriptionContent) {
    toggleBtn.addEventListener('click', () => {
        const isHidden = descriptionContent.classList.toggle('hidden');
        
        if (isHidden) {
            toggleBtn.innerHTML = '📖 글자 수 세기 설명 및 정보 보기 ▼';
        } else {
            toggleBtn.innerHTML = '📖 글자 수 세기 설명 및 정보 숨기기 ▲';
        }
    });
}