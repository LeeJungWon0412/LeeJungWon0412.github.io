document.addEventListener('DOMContentLoaded', () => {
    const principalInput = document.getElementById('principal');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    const calculateBtn = document.getElementById('calculateBtn');

    const monthlyPaymentEl = document.getElementById('monthlyPayment');
    const totalInterestEl = document.getElementById('totalInterest');
    const totalPaymentEl = document.getElementById('totalPayment');

    function calculateLoan() {
        const principal = parseFloat(principalInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const loanTermYears = parseInt(loanTermInput.value);

        if (isNaN(principal) || isNaN(annualRate) || isNaN(loanTermYears) || principal <= 0 || annualRate <= 0 || loanTermYears <= 0) {
            alert('모든 값을 올바르게 입력해주삼');
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = loanTermYears * 12;

        // 원리금 균등분할상환 월 상환금 계산 공식
        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;

        // 숫자를 원화 형식으로 변환
        const formatter = new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        monthlyPaymentEl.textContent = formatter.format(monthlyPayment);
        totalInterestEl.textContent = formatter.format(totalInterest);
        totalPaymentEl.textContent = formatter.format(totalPayment);
    }

    calculateBtn.addEventListener('click', calculateLoan);

    // 페이지 로드 시 기본값으로 한 번 계산
    calculateLoan();
});