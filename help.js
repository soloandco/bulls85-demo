/* 사람 찾기: 한 명부에서 이름·회사·고민 검색과 분야 필터를 함께 적용한다. */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const q = document.getElementById('q');
    const count = document.getElementById('count');
    const none = document.getElementById('noresult');
    const filters = document.getElementById('finder-filters');
    if (!q) return;

    const rows = [...document.querySelectorAll('#list .row')];
    let category = 'all';

    function draw() {
      const s = q.value.trim().toLowerCase();
      let n = 0;
      rows.forEach((r) => {
        const matchesSearch = !s || (r.dataset.q || r.textContent).toLowerCase().includes(s);
        const matchesCategory = category === 'all' ||
          (category === 'new' ? r.dataset.new === '1' : r.dataset.cat === category);
        const visible = matchesSearch && matchesCategory;
        r.hidden = !visible;
        if (visible) n++;
      });
      if (count) count.textContent = n ? `${n}명` : '';
      if (none) none.hidden = n > 0;
    }
    q.addEventListener('input', draw);
    if (filters) filters.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-c]');
      if (!button) return;
      category = button.dataset.c;
      filters.querySelectorAll('button').forEach((item) => item.classList.toggle('on', item === button));
      draw();
    });
    draw();
  });
})();
