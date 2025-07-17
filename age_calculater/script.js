document.addEventListener('DOMContentLoaded', () => {
    const birthDateInput = document.getElementById('birthDate');
    const calculateButton = document.getElementById('calculateButton');
    const ageResult = document.getElementById('ageResult');
    const zodiacResult = document.getElementById('zodiacResult');
    const starSignResult = document.getElementById('starSignResult');

    function calculateAll() {
        const birthDateValue = birthDateInput.value;
        if (!birthDateValue) {
            alert('생년월일을 입력해주삼');
            return;
        }

        const birthDate = new Date(birthDateValue);
        const today = new Date();

        // 1. 만 나이 계산
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        ageResult.textContent = `${age}세`;

        // 2. 띠 계산 (십이간지)
        const zodiacs = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
        const birthYear = birthDate.getFullYear();
        zodiacResult.textContent = `${zodiacs[birthYear % 12]}띠`;

        // 3. 별자리 계산
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        let starSign = '';

        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) starSign = '물병자리';
        else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) starSign = '물고기자리';
        else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) starSign = '양자리';
        else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) starSign = '황소자리';
        else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) starSign = '쌍둥이자리';
        else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) starSign = '게자리';
        else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) starSign = '사자자리';
        else if ((month === 8 && day >= 23) || (month === 9 && day <= 23)) starSign = '처녀자리';
        else if ((month === 9 && day >= 24) || (month === 10 && day <= 22)) starSign = '천칭자리';
        else if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) starSign = '전갈자리';
        else if ((month === 11 && day >= 23) || (month === 12 && day <= 24)) starSign = '사수자리';
        else if ((month === 12 && day >= 25) || (month === 1 && day <= 19)) starSign = '염소자리';
        
        starSignResult.textContent = starSign;
    }

    calculateButton.addEventListener('click', calculateAll);
});