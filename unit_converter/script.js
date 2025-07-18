document.addEventListener('DOMContentLoaded', () => {
    // HTML 요소 가져오기
    const categorySelect = document.getElementById('category');
    const inputValue = document.getElementById('inputValue');
    const outputValue = document.getElementById('outputValue');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');

    // 13개 카테고리의 모든 단위와 변환 계수 데이터
    const conversionData = {
        length: {
            name: "길이 (Length)",
            baseUnit: "m",
            units: {
                mm: ["밀리미터 (mm)", 0.001], cm: ["센티미터 (cm)", 0.01], m: ["미터 (m)", 1], km: ["킬로미터 (km)", 1000],
                in: ["인치 (in)", 0.0254], ft: ["피트 (ft)", 0.3048], yd: ["야드 (yd)", 0.9144], mi: ["마일 (mi)", 1609.34],
                nmi: ["해리 (nmi)", 1852], Å: ["옹스트롬 (Å)", 1e-10]
            }
        },
        mass: {
            name: "질량 (Mass)",
            baseUnit: "g",
            units: {
                mg: ["밀리그램 (mg)", 0.001], g: ["그램 (g)", 1], kg: ["킬로그램 (kg)", 1000], t: ["톤 (t)", 1000000],
                oz: ["온스 (oz)", 28.3495], lb: ["파운드 (lb)", 453.592],
                ct: ["캐럿 (ct)", 0.2], 'don': ["돈", 3.75], 'geun': ["근", 600]
            }
        },
        volume: {
            name: "부피 (Volume)",
            baseUnit: "l",
            units: {
                ml: ["밀리리터 (ml)", 0.001], l: ["리터 (L)", 1], 'cm³': ["세제곱센티미터 (cm³)", 0.001], 'm³': ["세제곱미터 (m³)", 1000],
                gal_us: ["갤런 (US gal)", 3.78541], gal_uk: ["갤런 (UK gal)", 4.54609], qt: ["쿼트 (qt)", 0.946353], pt: ["파인트 (pt)", 0.473176],
                cup: ["컵 (cup)", 0.24], fl_oz: ["플루이드 온스 (fl oz)", 0.0295735], bbl: ["배럴 (bbl)", 158.987]
            }
        },
        temperature: {
            name: "온도 (Temperature)",
            units: { C: ["섭씨 (°C)"], F: ["화씨 (°F)"], K: ["켈빈 (K)"] }
        },
        time: {
            name: "시간 (Time)",
            baseUnit: "s",
            units: {
                ms: ["밀리초 (ms)", 0.001], s: ["초 (s)", 1], min: ["분 (min)", 60], hr: ["시 (hr)", 3600],
                day: ["일 (day)", 86400], week: ["주 (week)", 604800], month: ["월 (month, 30일 기준)", 2592000], year: ["년 (year, 365일 기준)", 31536000]
            }
        },
        speed: {
            name: "속도 (Speed)",
            baseUnit: "m/s",
            units: {
                'm/s': ["미터/초 (m/s)", 1], 'km/h': ["킬로미터/시 (km/h)", 0.277778],
                mph: ["마일/시 (mph)", 0.44704], kn: ["노트 (kn)", 0.514444], mach: ["마하 (Mach)", 343]
            }
        },
        area: {
            name: "면적 (Area)",
            baseUnit: "m²",
            units: {
                'cm²': ["제곱센티미터 (cm²)", 0.0001], 'm²': ["제곱미터 (m²)", 1], 'km²': ["제곱킬로미터 (km²)", 1000000],
                pyeong: ["평", 3.30579], acre: ["에이커 (acre)", 4046.86], ha: ["헥타르 (ha)", 10000]
            }
        },
        data: {
            name: "데이터 저장 용량 (Data Storage)",
            baseUnit: "B",
            units: {
                bit: ["비트 (bit)", 0.125], B: ["바이트 (B)", 1], KB: ["킬로바이트 (KB)", 1024], MB: ["메가바이트 (MB)", Math.pow(1024, 2)],
                GB: ["기가바이트 (GB)", Math.pow(1024, 3)], TB: ["테라바이트 (TB)", Math.pow(1024, 4)]
            }
        },
        pressure: {
            name: "압력 (Pressure)",
            baseUnit: "Pa",
            units: {
                Pa: ["파스칼 (Pa)", 1], kPa: ["킬로파스칼 (kPa)", 1000], atm: ["기압 (atm)", 101325],
                bar: ["바 (bar)", 100000], psi: ["PSI (psi)", 6894.76]
            }
        },
        energy: {
            name: "에너지 (Energy)",
            baseUnit: "J",
            units: {
                J: ["줄 (J)", 1], kJ: ["킬로줄 (kJ)", 1000], cal: ["칼로리 (cal)", 4.184],
                kcal: ["킬로칼로리 (kcal)", 4184], eV: ["전자볼트 (eV)", 1.6022e-19], kWh: ["킬로와트시 (kWh)", 3.6e6]
            }
        },
        power: {
            name: "전력 (Power)",
            baseUnit: "W",
            units: { W: ["와트 (W)", 1], kW: ["킬로와트 (kW)", 1000], hp: ["마력 (hp)", 735.5] }
        },
        frequency: {
            name: "주파수 (Frequency)",
            baseUnit: "Hz",
            units: {
                Hz: ["헤르츠 (Hz)", 1], kHz: ["킬로헤르츠 (kHz)", 1e3],
                MHz: ["메가헤르츠 (MHz)", 1e6], GHz: ["기가헤르츠 (GHz)", 1e9]
            }
        },
        angle: {
            name: "각도 (Angle)",
            baseUnit: "rad",
            units: {
                deg: ["도 (°)", Math.PI / 180], rad: ["라디안 (rad)", 1], grad: ["그라디안 (grad)", Math.PI / 200]
            }
        }
    };

    // 카테고리 선택 드롭다운 채우기
    for (const key in conversionData) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = conversionData[key].name;
        categorySelect.appendChild(option);
    }

    // 특정 카테고리의 단위 드롭다운 채우기
    function populateUnits(categoryKey) {
        const category = conversionData[categoryKey];
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        for (const unitKey in category.units) {
            const unitName = category.units[unitKey][0];
            
            const fromOption = document.createElement('option');
            fromOption.value = unitKey;
            fromOption.textContent = unitName;
            fromUnitSelect.appendChild(fromOption);

            const toOption = document.createElement('option');
            toOption.value = unitKey;
            toOption.textContent = unitName;
            toUnitSelect.appendChild(toOption);
        }
        // 기본 선택값 설정 (예: m -> cm)
        fromUnitSelect.value = Object.keys(category.units)[2] || Object.keys(category.units)[0];
        toUnitSelect.value = Object.keys(category.units)[1] || Object.keys(category.units)[1];
    }

    // 온도 변환 로직
    function convertTemperature(value, from, to) {
        if (from === to) return value;
        let celsius;
        // 1. 모든 단위를 섭씨(C)로 변환
        if (from === 'F') celsius = (value - 32) * 5 / 9;
        else if (from === 'K') celsius = value - 273.15;
        else celsius = value;
        // 2. 섭씨를 목표 단위로 변환
        if (to === 'F') return (celsius * 9 / 5) + 32;
        if (to === 'K') return celsius + 273.15;
        return celsius;
    }

    // 메인 변환 함수
    function convert() {
        const categoryKey = categorySelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const value = parseFloat(inputValue.value);

        if (isNaN(value)) {
            outputValue.value = '';
            return;
        }

        let result;
        if (categoryKey === 'temperature') {
            result = convertTemperature(value, fromUnit, toUnit);
        } else {
            const category = conversionData[categoryKey];
            const baseUnitValue = value * category.units[fromUnit][1];
            result = baseUnitValue / category.units[toUnit][1];
        }

        // 결과값이 너무 길 경우 지수 표기법으로, 아닐 경우 소수점 7자리까지 표시
        if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-5 && result !== 0) ) {
            outputValue.value = result.toExponential(5);
        } else {
            outputValue.value = Number(result.toFixed(7));
        }
    }

    // 이벤트 리스너 설정
    categorySelect.addEventListener('change', () => {
        populateUnits(categorySelect.value);
        convert();
    });
    inputValue.addEventListener('input', convert);
    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);

    // 페이지 초기화
    populateUnits(categorySelect.value);
    inputValue.value = 1; // 기본값 1 설정
    convert();
});

// 설명 펼치기/접기 기능
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionContent = document.getElementById('descriptionContent');

if (toggleBtn && descriptionContent) {
    toggleBtn.addEventListener('click', () => {
        const isHidden = descriptionContent.classList.toggle('hidden');
        
        if (isHidden) {
            toggleBtn.innerHTML = '📖 단위 변환기 설명 및 정보 보기 ▼';
        } else {
            toggleBtn.innerHTML = '📖 단위 변환기 설명 및 정보 숨기기 ▲';
        }
    });
}