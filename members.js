/* 회원 명부: 검색과 분야 필터.
   목록 자체는 HTML 에 이미 들어 있고, 여기서는 보이고 감추기만 한다. */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const rows = [...document.querySelectorAll('#list .row')];
    const q = document.getElementById('q');
    const F = document.getElementById('filters');
    const count = document.getElementById('count');
    let cat = 'all';

    function draw() {
      const s = q.value.trim().toLowerCase();
      let n = 0;
      rows.forEach((r) => {
        const okCat = cat === 'all' || r.dataset.cat === cat;
        const okQ = !s || r.dataset.q.toLowerCase().includes(s);
        const show = okCat && okQ;
        r.hidden = !show;
        if (show) { n++; r.querySelector('.no').textContent = String(n).padStart(2, '0'); }
      });
      count.textContent = n ? `${n}명` : '해당하는 회원이 없습니다.';
    }
    q.addEventListener('input', draw);
    F.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      cat = b.dataset.c;
      F.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      draw();
    });
  });
})();
