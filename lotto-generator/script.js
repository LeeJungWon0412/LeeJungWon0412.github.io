document.addEventListener('DOMContentLoaded', () => {
   const generateBtn = document.getElementById('generateBtn');
   const winningNumbersContainer = document.getElementById('winning-numbers');
   const bonusNumberContainer = document.getElementById('bonus-number-container');

   function generateLottoNumbers() {
       const winningNumbers = new Set();
       while (winningNumbers.size < 6) {
           winningNumbers.add(Math.floor(Math.random() * 45) + 1);
       }
       const sortedWinningNumbers = Array.from(winningNumbers).sort((a, b) => a - b);

       let bonusNumber;
       do {
           bonusNumber = Math.floor(Math.random() * 45) + 1;
       } while (winningNumbers.has(bonusNumber));

       displayNumbers(sortedWinningNumbers, winningNumbersContainer, '당첨번호');
       displayNumbers([bonusNumber], bonusNumberContainer, '보너스');
   }

   function displayNumbers(numbers, container, labelText) {
       container.innerHTML = `<span class="label">${labelText}</span>`;
       numbers.forEach(number => {
           const ball = document.createElement('div');
           ball.classList.add('lotto-ball');
           ball.classList.add(getBallColorClass(number));
           ball.textContent = number;
           container.appendChild(ball);
       });
   }

   function getBallColorClass(number) {
       if (number <= 10) return 'yellow';
       if (number <= 20) return 'blue';
       if (number <= 30) return 'red';
       if (number <= 40) return 'gray';
       return 'green';
   }

   generateBtn.addEventListener('click', generateLottoNumbers);

   // 페이지 로드 시 바로 한 번 생성
   generateLottoNumbers();
});