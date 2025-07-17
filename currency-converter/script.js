document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initializeConverter, 100);
});

async function initializeConverter() {
    const $amountInput = $('#amount');
    const $fromCurrencySelect = $('#fromCurrency');
    const $toCurrencySelect = $('#toCurrency');
    const $resultDiv = $('#result');
    const $rateInfoDiv = $('#rateInfo');
    const $swapButton = $('.swap-icon');

    const API_URL = 'https://api.frankfurter.app';
    let debounceTimer;

    const currencyKoreanNames = {
        'KRW': '대한민국 원', 'USD': '미국 달러', 'JPY': '일본 엔', 'EUR': '유로', 'CNY': '중국 위안', 
        'GBP': '영국 파운드', 'AUD': '호주 달러', 'CAD': '캐나다 달러', 'CHF': '스위스 프랑', 'HKD': '홍콩 달러', 
        'SGD': '싱가포르 달러', 'THB': '태국 바트', 'VND': '베트남 동', 'TWD': '대만 달러', 'PHP': '필리핀 페소', 
        'ZAR': '남아프리카 공화국 랜드', 'TRY': '터키 리라', 'SEK': '스웨덴 크로나', 'RON': '루마니아 레우', 'PLN': '폴란드 즈워티', 
        'NZD': '뉴질랜드 달러', 'NOK': '노르웨이 크로네', 'MYR': '말레이시아 링깃', 'MXN': '멕시코 페소', 
        'ISK': '아이슬란드 크로나', 'INR': '인도 루피', 'ILS': '이스라엘 셰켈', 'IDR': '인도네시아 루피아', 
        'HUF': '헝가리 포린트', 'DKK': '덴마크 크로네', 'CZK': '체코 코루나', 'BRL': '브라질 헤알', 'BGN': '불가리아 레프'
    };

    function customMatcher(params, data) {
        if ($.trim(params.term) === '') return data;
        if (data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1) return data;
        return null;
    }

    // 기존 convertCurrency 함수를 아래 코드로 전체 교체하세요.
    async function convertCurrency() {
        const amount = parseFloat($amountInput.val());
        const from = $fromCurrencySelect.val();
        const to = $toCurrencySelect.val();

        if (!from || !to) return;
        if (isNaN(amount) || amount === 0) {
            $resultDiv.text('유효한 금액을 입력하삼');
            return;
        }
    
        $resultDiv.text('계산 중...');
        try {
            if (from === to) {
                const formattedSameAmount = new Intl.NumberFormat('en-US').format(amount);
                $resultDiv.text(`${to} ${formattedSameAmount}`);
                $rateInfoDiv.text('동일한 통화임');
                return;
            }

            const response = await fetch(`${API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
            const data = await response.json();
            const convertedAmount = data.rates[to];
        
            // --- ▼▼▼ 핵심 변경점: 숫자 서식을 직접 제어 ▼▼▼ ---
        
            // 소수점을 사용하지 않는 통화 목록
            const noDecimalCurrencies = ['KRW', 'JPY', 'ISK'];
        
            let formattedNumber;
            // 한국 원, 일본 엔 등은 정수로 표현
            if (noDecimalCurrencies.includes(to)) {
                formattedNumber = new Intl.NumberFormat('en-US').format(Math.round(convertedAmount));
            } else {
            // 그 외 통화는 소수점 두 자리까지 표현
                formattedNumber = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(convertedAmount);
            }

            // '[통화 코드] [숫자]' 형식으로 통일
            const finalResult = `${to} ${formattedNumber}`;
            $resultDiv.text(finalResult);

            // --- ▲▲▲ ---

            const rate = (convertedAmount / amount).toFixed(4);
            $rateInfoDiv.text(`기준일: ${data.date} | 1 ${from} = ${rate} ${to}`);

        } catch (error) {
            $resultDiv.text('환율 정보를 가져오는 데 실패했삼');
        }
    }
    
    // --- ▼▼▼ 핵심 변경점: 이벤트 리스너를 먼저 설정 ▼▼▼ ---
    $amountInput.on('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(convertCurrency, 500);
    });

    $('#fromCurrency, #toCurrency').on('change', convertCurrency);

    $swapButton.on('click', () => {
        const fromVal = $fromCurrencySelect.val();
        const toVal = $toCurrencySelect.val();
        $fromCurrencySelect.val(toVal).trigger('change');
        $toCurrencySelect.val(fromVal).trigger('change');
    });
    // --- ▲▲▲ ---

    try {
        const response = await fetch(`${API_URL}/currencies`);
        const currencies = await response.json();
        
        for (const code in currencies) {
            const displayName = currencyKoreanNames[code] || currencies[code];
            const textContent = `${code} - ${displayName}`;
            const option = new Option(textContent, code);
            $fromCurrencySelect.append($(option).clone());
            $toCurrencySelect.append(option);
        }
        
        $fromCurrencySelect.select2({ matcher: customMatcher });
        $toCurrencySelect.select2({ matcher: customMatcher });
        
        // 기본값 설정. 여기서 .trigger('change')를 하면 위에서 설정한 리스너가 작동함.
        $fromCurrencySelect.val('USD').trigger('change');
        $toCurrencySelect.val('KRW').trigger('change');
        
    } catch (error) {
        $resultDiv.text('통화 목록을 불러오는 데 실패했삼');
    }
}