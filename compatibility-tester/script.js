document.addEventListener('DOMContentLoaded', () => {
    // --- 탭 기능 (변경 없음) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // --- 데이터 및 UI 생성 (변경 없음) ---
    const data = {
        mbti: ["INFP", "ENFP", "INFJ", "ENFJ", "INTJ", "ENTJ", "INTP", "ENTP", "ISFP", "ESFP", "ISTP", "ESTP", "ISFJ", "ESFJ", "ISTJ", "ESTJ"],
        zodiac: ["양자리", "황소자리", "쌍둥이자리", "게자리", "사자자리", "처녀자리", "천칭자리", "전갈자리", "사수자리", "염소자리", "물병자리", "물고기자리"],
        blood: ["A형", "B형", "O형", "AB형"]
    };

    function createUI(type, labels = ['선택 1', '선택 2']) {
        const container = document.getElementById(type);
        container.innerHTML = `
            <div class="input-area">
                <label for="${type}1">${labels[0]}</label>
                <select id="${type}1"></select>
                <label for="${type}2">${labels[1]}</label>
                <select id="${type}2"></select>
            </div>
            <button class="calculate-btn" data-type="${type}">궁합 보기</button>
            <div id="${type}Result" class="result-box"></div>
        `;
        const select1 = document.getElementById(`${type}1`);
        const select2 = document.getElementById(`${type}2`);
        data[type].forEach(item => {
            select1.add(new Option(item, item.replace('형', '')));
            select2.add(new Option(item, item.replace('형', '')));
        });
    }
    createUI('mbti', ['MBTI', 'MBTI']);
    createUI('zodiac', ['별자리', '별자리']);
    createUI('blood', ['남자 혈액형', '여자 혈액형']);
    
    // --- 계산 버튼 이벤트 리스너 (변경 없음) ---
    document.querySelectorAll('.calculate-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const resultDiv = document.getElementById(`${type}Result`);
            
            if (type === 'name') {
                const name1 = document.getElementById('name1').value;
                const name2 = document.getElementById('name2').value;
                resultDiv.textContent = calculateNameCompatibility(name1, name2);
            } else {
                const val1 = document.getElementById(`${type}1`).value;
                const val2 = document.getElementById(`${type}2`).value;
                if(type === 'mbti') resultDiv.textContent = calculateMbtiCompatibility(val1, val2);
                if(type === 'zodiac') resultDiv.textContent = calculateZodiacCompatibility(val1, val2);
                if(type === 'blood') resultDiv.textContent = calculateBloodCompatibility(val1, val2);
            }
        });
    });

    // --- 이름 궁합 계산 로직 (변경 없음) ---
    const chosungStroke = [2, 4, 2, 3, 5, 1, 3, 4, 6, 2, 4, 2, 3, 5, 4, 4, 4, 3, 4];
    const jungsungStroke = [2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5, 2, 3, 3, 4, 3, 4, 4, 3, 4];
    const jongsungStroke = [0, 2, 4, 4, 2, 5, 5, 3, 5, 7, 8, 7, 7, 9, 9, 8, 3, 4, 6, 2, 4, 2, 3, 4, 4, 4, 3, 4];
    function getStrokes(char) {
        const charCode = char.charCodeAt(0);
        if (charCode < 0xAC00 || charCode > 0xD7A3) return 0;
        const unicode = charCode - 0xAC00;
        const chosungIndex = Math.floor(unicode / (21 * 28));
        const jungsungIndex = Math.floor((unicode % (21 * 28)) / 28);
        const jongsungIndex = unicode % 28;
        return chosungStroke[chosungIndex] + jungsungStroke[jungsungIndex] + jongsungStroke[jongsungIndex];
    }
    function calculateNameCompatibility(name1, name2) {
        if (!name1.trim() || !name2.trim()) return "두 사람의 이름을 모두 한글로 입력해주삼.";
        let combinedName = "";
        const maxLength = Math.max(name1.length, name2.length);
        for (let i = 0; i < maxLength; i++) {
            if (name1[i]) combinedName += name1[i];
            if (name2[i]) combinedName += name2[i];
        }
        let strokes = combinedName.split('').map(char => getStrokes(char));
        while(strokes.length > 2) {
            const nextStrokes = [];
            for(let i = 0; i < strokes.length - 1; i++) {
                nextStrokes.push((strokes[i] + strokes[i+1]) % 10);
            }
            strokes = nextStrokes;
        }
        const score = parseInt(strokes.join('')) || 0;
        if (isNaN(score) && combinedName.length > 0) return "한글 이름만 입력해주삼.";
        if(score > 80) return `궁합 점수: ${score}점! 천생연분이삼!`;
        if(score > 60) return `궁합 점수: ${score}점! 아주 좋은 관계삼.`;
        if(score > 40) return `궁합 점수: ${score}점. 친구처럼 편안한 관계삼.`;
        return `궁합 점수: ${score}점. 조금 더 노력이 필요하삼!`;
    }

    // --- ▼▼▼ MBTI, 별자리, 혈액형 궁합 데이터 및 로직 수정 ▼▼▼ ---

    // 4. MBTI 궁합표 데이터 (전체 256개 케이스 모두 포함)
    const mbtiMatrix = {
        INFP: {INFP:"좋은관계", ENFP:"천생연분", INFJ:"좋은관계", ENFJ:"천생연분", INTJ:"좋은관계", ENTJ:"좋은관계", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"최악", ESFP:"최악", ISTP:"최악", ESTP:"최악", ISFJ:"최악", ESFJ:"최악", ISTJ:"최악", ESTJ:"최악"},
        ENFP: {INFP:"천생연분", ENFP:"좋은관계", INFJ:"천생연분", ENFJ:"좋은관계", INTJ:"좋은관계", ENTJ:"좋은관계", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"최악", ESFP:"최악", ISTP:"최악", ESTP:"최악", ISFJ:"최악", ESFJ:"최악", ISTJ:"최악", ESTJ:"최악"},
        INFJ: {INFP:"좋은관계", ENFP:"천생연분", INFJ:"좋은관계", ENFJ:"천생연분", INTJ:"좋은관계", ENTJ:"좋은관계", INTP:"좋은관계", ENTP:"천생연분", ISFP:"최악", ESFP:"최악", ISTP:"최악", ESTP:"최악", ISFJ:"최악", ESFJ:"최악", ISTJ:"최악", ESTJ:"최악"},
        ENFJ: {INFP:"천생연분", ENFP:"좋은관계", INFJ:"천생연분", ENFJ:"좋은관계", INTJ:"반반", ENTJ:"반반", INTP:"반반", ENTP:"반반", ISFP:"천생연분", ESFP:"좋은관계", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"좋은관계", ESFJ:"좋은관계", ISTJ:"최악", ESTJ:"최악"},
        INTJ: {INFP:"좋은관계", ENFP:"좋은관계", INFJ:"좋은관계", ENFJ:"반반", INTJ:"좋은관계", ENTJ:"좋은관계", INTP:"천생연분", ENTP:"천생연분", ISFP:"생각해봐요", ESFP:"생각해봐요", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"생각해봐요", ESFJ:"생각해봐요", ISTJ:"반반", ESTJ:"반반"},
        ENTJ: {INFP:"좋은관계", ENFP:"좋은관계", INFJ:"좋은관계", ENFJ:"반반", INTJ:"좋은관계", ENTJ:"좋은관계", INTP:"천생연분", ENTP:"좋은관계", ISFP:"생각해봐요", ESFP:"생각해봐요", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"생각해봐요", ESFJ:"생각해봐요", ISTJ:"반반", ESTJ:"반반"},
        INTP: {INFP:"좋은관계", ENFP:"좋은관계", INFJ:"좋은관계", ENFJ:"반반", INTJ:"천생연분", ENTJ:"천생연분", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"좋은관계", ISTP:"천생연분", ESTP:"천생연분", ISFJ:"좋은관계", ESFJ:"좋은관계", ISTJ:"천생연분", ESTJ:"천생연분"},
        ENTP: {INFP:"좋은관계", ENFP:"좋은관계", INFJ:"천생연분", ENFJ:"반반", INTJ:"천생연분", ENTJ:"좋은관계", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"좋은관계", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"좋은관계", ESFJ:"좋은관계", ISTJ:"좋은관계", ESTJ:"좋은관계"},
        ISFP: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"천생연분", INTJ:"생각해봐요", ENTJ:"생각해봐요", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"좋은관계", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"좋은관계", ESFJ:"천생연분", ISTJ:"좋은관계", ESTJ:"천생연분"},
        ESFP: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"좋은관계", INTJ:"생각해봐요", ENTJ:"생각해봐요", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"좋은관계", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"천생연분", ESFJ:"좋은관계", ISTJ:"천생연분", ESTJ:"좋은관계"},
        ISTP: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"좋은관계", INTJ:"좋은관계", ENTJ:"좋은관계", INTP:"천생연분", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"좋은관계", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"좋은관계", ESFJ:"천생연분", ISTJ:"좋은관계", ESTJ:"천생연분"},
        ESTP: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"좋은관계", INTJ:"좋은관계", ENTJ:"좋О은관계", INTP:"천생연분", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"좋은관계", ISTP:"좋은관계", ESTP:"좋은관계", ISFJ:"천생연분", ESFJ:"좋은관계", ISTJ:"천생연분", ESTJ:"좋은관계"},
        ISFJ: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"좋은관계", INTJ:"생각해봐요", ENTJ:"생각해봐요", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"천생연분", ISTP:"좋은관계", ESTP:"천생연분", ISFJ:"좋은관계", ESFJ:"좋은관계", ISTJ:"좋은관계", ESTJ:"좋은관계"},
        ESFJ: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"좋은관계", INTJ:"생각해봐요", ENTJ:"생각해봐요", INTP:"좋은관계", ENTP:"좋은관계", ISFP:"천생연분", ESFP:"좋은관계", ISTP:"천생연분", ESTP:"좋은관계", ISFJ:"좋은관계", ESFJ:"좋은관계", ISTJ:"좋은관계", ESTJ:"좋은관계"},
        ISTJ: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"최악", INTJ:"반반", ENTJ:"반반", INTP:"천생연분", ENTP:"좋은관계", ISFP:"좋은관계", ESFP:"천생연분", ISTP:"좋은관계", ESTP:"천생연분", ISFJ:"좋은관계", ESFJ:"좋은관계", ISTJ:"좋은관계", ESTJ:"좋은관계"},
        ESTJ: {INFP:"최악", ENFP:"최악", INFJ:"최악", ENFJ:"최악", INTJ:"반반", ENTJ:"반반", INTP:"천생연분", ENTP:"좋은관계", ISFP:"천생연분", ESFP:"좋은관계", ISTP:"천생연분", ESTP:"좋은관계", ISFJ:"좋은관계", ESFJ:"좋은관계", ISTJ:"좋은관계", ESTJ:"좋은관계"}
    };
    function calculateMbtiCompatibility(mbti1, mbti2) {
        const relation = mbtiMatrix[mbti1]?.[mbti2];
        if (!relation) {
            // 만약을 위해 반대 경우도 조회 (데이터가 완벽하다면 필요없음)
            const reverseRelation = mbtiMatrix[mbti2]?.[mbti1];
            if (!reverseRelation) return "결과를 찾을 수 없삼.";
            return getMbtiResultText(reverseRelation);
        }
        return getMbtiResultText(relation);
    }
    function getMbtiResultText(relation) {
        if(relation === "천생연분") return "우린 천생연분! 최고의 궁합이삼.";
        if(relation === "좋은관계") return "좋은 관계로 발전할 가능성이 높으삼.";
        if(relation === "반반") return "안 맞는 듯 맞는 듯, 반반의 궁합이삼!";
        if(relation === "생각해봐요") return "우리 관계... 다시 생각해보삼.";
        if(relation === "최악") return "최악은 아니지만... 좋지도 않으삼.";
        return "결과를 분석 중임.";
    }

    // 5. 별자리 궁합 데이터 (변경 없음)
    const zodiacGrid = [
        ["B","G","D","C","B","F","D","H","A","C","E","G"],["C","B","H","E","F","B","G","G","H","A","H","D"],["E","H","B","H","E","G","A","F","D","C","A","H"],
        ["G","E","C","B","G","E","F","A","H","D","H","A"],["B","G","D","H","A","F","D","F","B","C","G","H"],["E","A","C","D","F","B","F","E","G","A","H","D"],
        ["E","F","A","G","E","C","A","G","D","C","B","F"],["G","D","F","B","C","D","C","B","H","D","F","A"],["B","C","D","H","A","F","D","H","B","C","E","G"],
        ["F","A","G","D","E","A","G","E","C","B","F","D"],["E","C","A","H","E","F","B","C","D","G","A","H"],["C","E","C","A","E","G","F","B","F","E","H","B"]
    ];
    const zodiacMap = {"양자리":0, "황소자리":1, "쌍둥이자리":2, "게자리":3, "사자자리":4, "처녀자리":5, "천칭자리":6, "전갈자리":7, "사수자리":8, "염소자리":9, "물병자리":10, "물고기자리":11};
    const zodiacResultMap = {
        A: "최고의 궁합! 함께 있으면 항상 즐거우삼.", B: "아주 잘 맞음. 서로를 잘 이해하는 관계삼.", C: "좋은 친구가 될 수 있는 좋은 궁합이삼.",
        D: "서로 노력하면 좋은 관계로 발전할 수 있삼.", E: "잘 맞을 때도, 안 맞을 때도 있삼.", F: "서로 다른 점을 존중해주는 것이 필요하삼.",
        G: "약간의 노력이 필요한 관계삼.", H: "서로에게 상처주기 쉬운, 조금은 안 맞는 궁합이삼."
    };
    function calculateZodiacCompatibility(zodiac1, zodiac2) {
        const index1 = zodiacMap[zodiac1];
        const index2 = zodiacMap[zodiac2];
        if (index1 === undefined || index2 === undefined) return "별자리를 모두 선택해주삼.";
        const letter = zodiacGrid[index1][index2];
        return zodiacResultMap[letter];
    }

    // 6. 혈액형 궁합 데이터 (변경 없음)
    const bloodMatrix = {
        A: {A:"70점! 안정적 애정", B:"25점! 싸우는 상황 많음", O:"90점! 시간이 지날수록 더 행복한 커플", AB:"50점! 친구와 연인 사이"},
        B: {A:"20점! 고생할 수 있음", B:"65점! 서로 마이웨이", O:"80점! 흥부자 커플", AB:"85점! 상호 보완 커플. 트러블 주의"},
        O: {A:"95점! 이상적인 커플", B:"75점! 호흡이 척척", O:"40점! 서로 배려가 필요함", AB:"35점! 양극의 성격(잘 맞으면 완벽)"},
        AB: {A:"65점! 남자가 리드", B:"80점! 남자 Cool~ 여자 Hot~", O:"30점! 환상의 커플 or 환장의 커플", AB:"90점! 베프같은 소울메이트"}
    };
    function calculateBloodCompatibility(blood1, blood2) { // blood1: 남자, blood2: 여자
        return bloodMatrix[blood1]?.[blood2] || "궁합 정보 없음";
    }
});