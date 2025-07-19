document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.getElementById('password-output');
    const generateBtn = document.getElementById('generate-btn');
    const copyMessage = document.getElementById('copyMessage');
    
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    function generatePassword() {
        const length = parseInt(lengthInput.value);
        let characters = '';
        if (uppercaseCheckbox.checked) characters += charSets.uppercase;
        if (lowercaseCheckbox.checked) characters += charSets.lowercase;
        if (numbersCheckbox.checked) characters += charSets.numbers;
        if (symbolsCheckbox.checked) characters += charSets.symbols;

        if (characters === '') {
            passwordOutput.textContent = '옵션을 선택하세요';
            return;
        }

        let password = '';
        const cryptoArray = new Uint32Array(length);
        window.crypto.getRandomValues(cryptoArray);

        for (let i = 0; i < length; i++) {
            password += characters[cryptoArray[i] % characters.length];
        }
        
        passwordOutput.textContent = password;
    }

    function copyToClipboard() {
        const password = passwordOutput.textContent;
        if (!password || password === '옵션을 선택하세요') return;

        navigator.clipboard.writeText(password).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        });
    }

    // 모든 컨트롤에 이벤트 리스너 추가하여 실시간으로 생성
    document.querySelectorAll('.options-container input').forEach(input => {
        input.addEventListener('input', generatePassword);
    });
    
    generateBtn.addEventListener('click', generatePassword);
    passwordOutput.addEventListener('click', copyToClipboard);

    // 페이지 로드 시 초기 비밀번호 생성
    generatePassword();
});