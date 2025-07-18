$(document).ready(async function () {
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

    // --- 이벤트 리스너 설정 ---
    $amountInput.on('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(convertCurrency, 500);
    });

    $fromCurrencySelect.on('change', convertCurrency);
    $toCurrencySelect.on('change', convertCurrency);

    $swapButton.on('click', () => {
        const fromVal = $fromCurrencySelect.val();
        const toVal = $toCurrencySelect.val();

        // 1. 두 드롭다운의 값을 먼저 모두 바꾼다.
        $fromCurrencySelect.val(toVal);
        $toCurrencySelect.val(fromVal);

        // 2. 두 드롭다운의 값이 모두 바뀐 후, 'change' 이벤트를 발생시켜
        //    Select2 UI를 업데이트하고 convertCurrency 함수를 호출한다.
        $fromCurrencySelect.trigger('change');
        $toCurrencySelect.trigger('change');
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
        
        // ▼▼▼ 핵심 변경점 ▼▼▼
        // 기본값을 설정하고, 이벤트(trigger)를 발생시키는 대신,
        // 변환 함수를 마지막에 한 번만 직접 호출합니다.
        $fromCurrencySelect.val('USD');
        $toCurrencySelect.val('KRW');
        
        // Select2가 화면에 바뀐 값을 표시하도록 업데이트
        $fromCurrencySelect.trigger('change.select2');
        $toCurrencySelect.trigger('change.select2');
        
        // 첫 계산을 직접 실행
        convertCurrency();
        
    } catch (error) {
        $resultDiv.text('통화 목록을 불러오는 데 실패했삼');
    }
});

// 설명 펼치기/접기 기능
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionContent = document.getElementById('descriptionContent');

// 해당 요소들이 페이지에 존재할 때만 이벤트 리스너를 추가
if (toggleBtn && descriptionContent) {
    toggleBtn.addEventListener('click', () => {
        // 'hidden' 클래스를 넣었다 뺐다 하면서 내용을 보이거나 숨김
        const isHidden = descriptionContent.classList.toggle('hidden');
        
        // 버튼의 텍스트와 화살표 방향을 바꿈
        if (isHidden) {
            toggleBtn.innerHTML = '📖 환율 계산기 설명 및 정보 보기 ▼';
        } else {
            toggleBtn.innerHTML = '📖 환율 계산기 설명 및 정보 숨기기 ▲';
        }
    });
}