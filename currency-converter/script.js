document.addEventListener('DOMContentLoaded', async function () {
    // jQuery 객체로 변수 할당
    const $amountInput = $('#amount');
    const $fromCurrencySelect = $('#fromCurrency');
    const $toCurrencySelect = $('#toCurrency');
    const $resultDiv = $('#result');
    const $rateInfoDiv = $('#rateInfo');
    const $swapButton = $('.swap-icon');

    const API_URL = 'https://api.frankfurter.app';
    let debounceTimer;

    const currencyKoreanNames = {
        // 아시아
        'JPY': '일본 엔', 'CNY': '중국 위안', 'TWD': '대만 달러', 'HKD': '홍콩 달러',
        'THB': '태국 바트', 'PHP': '필리핀 페소', 'VND': '베트남 동', 'IDR': '인도네시아 루피아',
        'MYR': '말레이시아 링깃', 'SGD': '싱가포르 달러', 'BND': '브루나이 달러', 'BDT': '방글라데시 타카',
        // 중동
        'SAR': '사우디아라비아 리얄', 'AED': '아랍에미리트 디르함', 'BHD': '바레인 디나르',
        'JOD': '요르단 디나르', 'ILS': '이스라엘 셰켈', 'QAR': '카타르 리얄',
        // 유럽
        'EUR': '유로', 'GBP': '영국 파운드', 'CHF': '스위스 프랑', 'SEK': '스웨덴 크로나',
        'DKK': '덴마크 크로네', 'NOK': '노르웨이 크로네', 'CZK': '체코 코루나', 'PLN': '폴란드 즈워티',
        'HUF': '헝가리 포린트', 'RUB': '러시아 루블', 'TRY': '터키 리라', 'BGN': '불가리아 레프',
        'RON': '루마니아 레우', 'ISK': '아이슬란드 크로나',
        // 아메리카
        'USD': '미국 달러', 'CAD': '캐나다 달러', 'MXN': '멕시코 페소', 'BRL': '브라질 헤알',
        // 아프리카
        'ZAR': '남아프리카 공화국 랜드', 'EGP': '이집트 파운드',
        // 오세아니아
        'AUD': '호주 달러', 'NZD': '뉴질랜드 달러',
        // 기타 주요 통화
        'KRW': '대한민국 원', 'INR': '인도 루피'
    };

    function customMatcher(params, data) {
        if ($.trim(params.term) === '') return data;
        if (data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1) return data;
        return null;
    }

    async function convertCurrency() {
        const amount = parseFloat($amountInput.val());
        const from = $fromCurrencySelect.val();
        const to = $toCurrencySelect.val();

        if (!from || !to) return;
        if (isNaN(amount) || amount === 0) {
            $resultDiv.text('유효한 금액을 입력하삼');
            return;
        }
        if (from === to) {
            const formattedSameAmount = new Intl.NumberFormat('en-US').format(amount);
            $resultDiv.text(`${to} ${formattedSameAmount}`);
            $rateInfoDiv.text('동일한 통화임');
            return;
        }
        $resultDiv.text('계산 중');
        try {
            const response = await fetch(`${API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
            const data = await response.json();
            const convertedAmount = data.rates[to];
            const noDecimalCurrencies = ['KRW', 'JPY', 'ISK'];
            let formattedNumber;
            if (noDecimalCurrencies.includes(to)) {
                formattedNumber = new Intl.NumberFormat('en-US').format(Math.round(convertedAmount));
            } else {
                formattedNumber = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(convertedAmount);
            }
            const finalResult = `${to} ${formattedNumber}`;
            $resultDiv.text(finalResult);
            const rate = (convertedAmount / amount).toFixed(4);
            $rateInfoDiv.text(`기준일: ${data.date} | 1 ${from} = ${rate} ${to}`);
        } catch (error) {
            $resultDiv.text('환율 정보를 가져오는 데 실패했삼');
        }
    }

    // --- 이벤트 리스너를 먼저 설정 ---
    $amountInput.on('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(convertCurrency, 500);
    });

    $fromCurrencySelect.on('change', convertCurrency);
    $toCurrencySelect.on('change', convertCurrency);

    $swapButton.on('click', () => {
        const fromVal = $fromCurrencySelect.val();
        const toVal = $toCurrencySelect.val();
        $fromCurrencySelect.val(toVal).trigger('change');
        $toCurrencySelect.val(fromVal).trigger('change');
    });

    // --- 초기화 로직 ---
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
});