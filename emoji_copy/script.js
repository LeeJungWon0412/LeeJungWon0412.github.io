document.addEventListener('DOMContentLoaded', function () {
    // HTML 요소 가져오기
    const emojiGrid = document.getElementById('emojiGrid');
    const emojiSearch = document.getElementById('emojiSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const copyMessage = document.getElementById('copyMessage');

    let allEmojis = []; // 불러온 모든 이모지를 저장할 배열

    // 이모지 데이터를 불러오는 함수
    async function loadEmojis() {
        try {
            const response = await fetch('emoji.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allEmojis = await response.json();
            applyFilters(); // 데이터 로딩 후 필터링 및 렌더링 실행
        } catch (error) {
            console.error('이모지 로딩에 실패했삼:', error);
            emojiGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">데이터를 불러오는 데 실패했삼. 파일을 확인해주삼</p>';
        }
    }

    // 화면에 이모지를 그리는 함수
    function renderEmojis(filteredEmojis) {
        emojiGrid.innerHTML = ''; // '가져오는 중...' 메시지 지우기
        if (filteredEmojis.length === 0) {
            emojiGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888;">검색 결과가 없삼</p>';
            return;
        }

        filteredEmojis.forEach(emoji => {
            const div = document.createElement('div');
            div.classList.add('emoji-item');
            div.textContent = emoji.char;
            div.title = emoji.name;
            div.dataset.char = emoji.char;
            emojiGrid.appendChild(div);
        });
    }

    // 텍스트를 클립보드에 복사하는 함수
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('복사 실패:', err);
            alert('복사에 실패했삼');
        });
    }

    // 현재 필터와 검색어에 맞게 이모지를 필터링하는 함수
    function applyFilters() {
        const searchTerm = emojiSearch.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filtered = allEmojis.filter(emoji => {
            const matchesCategory = selectedCategory === 'all' || emoji.category === selectedCategory;
            const matchesSearch = emoji.name.toLowerCase().includes(searchTerm) || emoji.char.includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        renderEmojis(filtered);
    }

    // --- 이벤트 리스너 설정 ---

    // 이모지 아이템 클릭 시 복사
    emojiGrid.addEventListener('click', function (event) {
        if (event.target.classList.contains('emoji-item')) {
            copyToClipboard(event.target.dataset.char);
        }
    });

    // 검색창 입력 시 필터링
    emojiSearch.addEventListener('input', applyFilters);
    // 카테고리 변경 시 필터링
    categoryFilter.addEventListener('change', applyFilters);

    // --- 초기 실행 ---
    loadEmojis(); // 페이지가 로드되면 이모지 데이터 불러오기 시작
});

// 설명 펼치기/접기 기능
const toggleBtn = document.getElementById('toggleDescriptionBtn');
const descriptionContent = document.getElementById('descriptionContent');

if (toggleBtn && descriptionContent) {
    toggleBtn.addEventListener('click', () => {
        const isHidden = descriptionContent.classList.toggle('hidden');
        
        if (isHidden) {
            toggleBtn.innerHTML = '📖 이모지/특수문자 복사 도구 설명 및 정보 보기 ▼';
        } else {
            toggleBtn.innerHTML = '📖 이모지/특수문자 복사 도구 설명 및 정보 숨기기 ▲';
        }
    });
}