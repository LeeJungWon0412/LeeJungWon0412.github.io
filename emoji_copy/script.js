document.addEventListener('DOMContentLoaded', function() {
    const emojiGrid = document.getElementById('emojiGrid');
    const emojiSearch = document.getElementById('emojiSearch');
    const copyMessage = document.getElementById('copyMessage');

    let emojis = []; // 이모지 데이터를 저장할 빈 배열을 선언합니다.

    // JSON 파일에서 이모지 데이터를 비동기적으로 로드하는 함수
    async function loadEmojis() {
        try {
            // emojis.json 파일의 경로를 지정합니다.
            const response = await fetch('emojis.json');

            // HTTP 응답이 성공적(status 200-299)인지 확인합니다.
            if (!response.ok) {
                throw new Error(`이모지 데이터를 불러오는 데 실패했습니다: HTTP 상태 ${response.status}`);
            }

            // 응답 본문을 JSON으로 파싱하여 emojis 배열에 할당합니다.
            emojis = await response.json();

            // 데이터 로드 후 이모지들을 화면에 렌더링합니다.
            renderEmojis();
        } catch (error) {
            // 데이터 로드 중 오류 발생 시 콘솔에 기록하고 사용자에게 메시지를 표시합니다.
            console.error('이모지 데이터 로드 실패:', error);
            emojiGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">이모지 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</p>';
        }
    }

    function renderEmojis(filteredEmojis = emojis) {
        emojiGrid.innerHTML = ''; // 기존 내용 지우기
        if (filteredEmojis.length === 0) {
            emojiGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888;">검색 결과가 없습니다.</p>';
            return;
        }
        filteredEmojis.forEach(emoji => {
            const div = document.createElement('div');
            div.classList.add('emoji-item');
            div.textContent = emoji.char;
            div.title = emoji.name; // 마우스 오버 시 이름 표시
            div.dataset.char = emoji.char; // 복사할 실제 문자
            emojiGrid.appendChild(div);
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            copyMessage.classList.add('show'); // 'show' 클래스 추가하여 표시
            setTimeout(() => {
                copyMessage.classList.remove('show'); // 2초 후 'show' 클래스 제거하여 숨김
            }, 2000);
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
            alert('복사에 실패했습니다. 브라우저 설정을 확인해주세요.');
        });
    }

    // 이모지 클릭 이벤트 리스너
    emojiGrid.addEventListener('click', function(event) {
        if (event.target.classList.contains('emoji-item')) {
            copyToClipboard(event.target.dataset.char);
        }
    });

    // 검색 기능
    emojiSearch.addEventListener('input', function(event) {
        const searchTerm = event.target.value.toLowerCase();
        const filteredEmojis = emojis.filter(emoji => 
            emoji.name.toLowerCase().includes(searchTerm) || emoji.char.includes(searchTerm)
        );
        renderEmojis(filteredEmojis);
    });

    // 페이지 로드 시 이모지 데이터 로드 시작
    loadEmojis();
});