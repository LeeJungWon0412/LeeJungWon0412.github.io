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