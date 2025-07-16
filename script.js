document.addEventListener('DOMContentLoaded', function () {
    // 현재 연도를 footer에 자동 삽입
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 앞으로 공통 기능들이 추가될 수 있으므로 구조 잡기
    // 예: 다크모드, 전역 설정 등
});