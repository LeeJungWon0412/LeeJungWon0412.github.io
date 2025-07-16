document.addEventListener('DOMContentLoaded', function () {
  const emojiGrid = document.getElementById('emojiGrid');
  const emojiSearch = document.getElementById('emojiSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const copyMessage = document.getElementById('copyMessage');
  const scrollBtn = document.getElementById('scrollToTop');

  let emojis = [];

  async function loadEmojis() {
    try {
      const response = await fetch('emoji.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      emojis = await response.json();
      applyFilters();
    } catch (error) {
      console.error('이모지 로딩 실패:', error);
      emojiGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">데이터를 불러오는 데 실패했습니다.</p>';
    }
  }

  function renderEmojis(filteredEmojis) {
    emojiGrid.innerHTML = '';
    if (filteredEmojis.length === 0) {
      emojiGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888;">검색 결과가 없습니다.</p>';
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

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      copyMessage.classList.add('show');
      setTimeout(() => copyMessage.classList.remove('show'), 2000);
    }).catch(err => {
      console.error('복사 실패:', err);
      alert('복사에 실패했삼');
    });
  }

  emojiGrid.addEventListener('click', function (event) {
    if (event.target.classList.contains('emoji-item')) {
      copyToClipboard(event.target.dataset.char);
    }
  });

  emojiSearch.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  function applyFilters() {
    const searchTerm = emojiSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = emojis.filter(emoji => {
      const matchesCategory = selectedCategory === 'all' || emoji.category === selectedCategory;
      const matchesSearch = emoji.name.toLowerCase().includes(searchTerm) || emoji.char.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    renderEmojis(filtered);
  }

  // 스크롤 버튼
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 연도 자동 입력
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  loadEmojis();
});