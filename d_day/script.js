document.addEventListener('DOMContentLoaded', () => {
    // D-Day 계산기 요소
    const ddayDateInput = document.getElementById('ddayDate');
    const ddayResult = document.getElementById('ddayResult');

    // 날짜 차이 계산기 요소
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const diffResult = document.getElementById('diffResult');

    // 시간대 오차를 없애기 위해 날짜를 UTC 자정 기준으로 변환하는 함수
    const toUTC = (date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    // D-Day 계산 함수
    function calculateDday() {
        if (!ddayDateInput.value) {
            ddayResult.innerHTML = '목표 날짜를 선택하삼';
            return;
        }

        const today = toUTC(new Date());
        const targetDate = toUTC(new Date(ddayDateInput.value));
        
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            ddayResult.innerHTML = '오늘은 <span class="dday-emphasis">D-Day</span> 임';
        } else if (diffDays > 0) {
            ddayResult.innerHTML = `<span class="dday-emphasis">D-${diffDays}</span> 일 남았삼`;
        } else {
            ddayResult.innerHTML = `<span class="dday-emphasis">D+${Math.abs(diffDays)}</span> 일 지났삼`;
        }
    }

    // 날짜 차이 계산 함수
    function calculateDateDifference() {
        if (!startDateInput.value || !endDateInput.value) {
            diffResult.innerHTML = '시작 날짜와 종료 날짜를 모두 선택하삼';
            return;
        }

        const startDate = toUTC(new Date(startDateInput.value));
        const endDate = toUTC(new Date(endDateInput.value));

        if (startDate > endDate) {
            diffResult.textContent = '시작 날짜는 종료 날짜보다 이전이어야 하삼';
            return;
        }

        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        diffResult.innerHTML = `두 날짜의 차이는 <span class="dday-emphasis">${diffDays}</span>일 임`;
    }

    // 오늘 날짜로 기본값 설정
    const todayString = new Date().toISOString().split('T')[0];
    ddayDateInput.value = todayString;
    startDateInput.value = todayString;
    endDateInput.value = todayString;


    // 이벤트 리스너 연결
    ddayDateInput.addEventListener('change', calculateDday);
    startDateInput.addEventListener('change', calculateDateDifference);
    endDateInput.addEventListener('change', calculateDateDifference);

    // 초기 실행
    calculateDday();
    calculateDateDifference();
});

// 설명 펼치기/접기 기능
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionContent = document.getElementById('descriptionContent');

if (toggleBtn && descriptionContent) {
    toggleBtn.addEventListener('click', () => {
        const isHidden = descriptionContent.classList.toggle('hidden');
        
        if (isHidden) {
            toggleBtn.innerHTML = '📖 날짜 계산기 설명 및 정보 보기 ▼';
        } else {
            toggleBtn.innerHTML = '📖 날짜 계산기 설명 및 정보 숨기기 ▲';
        }
    });
}