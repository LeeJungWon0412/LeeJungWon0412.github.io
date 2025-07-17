// 모든 페이지에 공통으로 적용될 스크립트
document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Footer에 현재 연도 자동 삽입
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. '맨 위로 가기' 버튼 기능
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        // 스크롤 위치에 따라 버튼 보이기/숨기기
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        // 클릭 시 맨 위로 부드럽게 스크롤
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 추후 추가될 다른 공통 기능들...
});

// --- 실시간 도구 검색 기능 ---
const toolSearchInput = document.getElementById('toolSearchInput');

// 메인 페이지에 검색창이 존재할 경우에만 아래 코드 실행
if (toolSearchInput) {
    const toolItems = document.querySelectorAll('.tool-list li');

    toolSearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();

        toolItems.forEach(item => {
            const toolLink = item.querySelector('a');
            if (toolLink) {
                const toolName = toolLink.textContent.toLowerCase();
                
                // 검색어가 도구 이름에 포함되어 있으면 보이고, 아니면 숨김
                if (toolName.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
}