/* 공통 동작: 회원 비밀번호 게이트
   헤더·푸터·본문은 build.mjs 가 HTML 로 찍어 두므로 여기서 그리지 않는다.
   (그래야 자바스크립트를 실행하지 않는 검색엔진과 AI도 내용을 읽는다) */
(function () {
  // 데모 비밀번호 "bulls1985" 의 SHA-256. 정식 오픈 시 바꾼다.
  const PW_HASH = 'f4ea74683128e237b17850a54896c526414f2f014df4365530c59946d1910a9a';
  const KEY = 'bulls85_demo_auth';
  const up = location.pathname.includes('/member/') ? '../' : '';

  const isAuthed = () => sessionStorage.getItem(KEY) === 'ok';
  const gate = () => document.getElementById('pw');

  async function sha256(s) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
  }

  function openGate() {
    const dialog = gate();
    if (!dialog) return;
    dialog.classList.add('on');
    setTimeout(() => document.getElementById('pw-in').focus(), 50);
  }

  async function tryPw() {
    const inp = document.getElementById('pw-in');
    const err = document.getElementById('pw-err');
    if ((await sha256(inp.value.trim())) === PW_HASH) {
      sessionStorage.setItem(KEY, 'ok');
      gate().classList.remove('on');
      inp.value = ''; err.textContent = '';
      sync();
    } else {
      err.textContent = '비밀번호가 맞지 않습니다.';
      inp.value = '';
    }
  }

  let needsLoaded = false;
  async function loadNeeds() {
    if (needsLoaded || !isAuthed()) return;
    const spots = document.querySelectorAll('[data-need]');
    const board = document.getElementById('need');
    if (!spots.length && !board) return;
    try {
      const needs = await (await fetch(up + 'data/needs.json')).json();
      spots.forEach((el) => { el.textContent = needs[el.dataset.need] || '아직 적지 않았습니다.'; });
      if (board) {
        const d = await (await fetch(up + 'data/members.json')).json();
        board.innerHTML = d.members.map((m) => `<a class="hrow" href="member/${encodeURIComponent(m.name)}.html" data-q="${m.name} ${m.company} ${needs[m.id] || ''}">
          <span class="hn">${m.name}<span class="hc">${m.company}</span></span>
          <span class="ht">${needs[m.id] || ''}</span></a>`).join('');
      }
      needsLoaded = true;
    } catch (e) {
      if (board) board.innerHTML = '<p class="muted">회원 데이터를 불러오지 못했습니다.</p>';
    }
  }

  function sync() {
    const btn = document.getElementById('lockbtn');
    if (btn) btn.textContent = isAuthed() ? '회원 · 열림' : '회원 · 잠김';
    document.querySelectorAll('.locked').forEach((l) => l.classList.toggle('open', isAuthed()));
    if (isAuthed()) loadNeeds();
  }
  window.syncLock = sync;

  // 맨 위로 버튼. 한 화면 넘게 내려가면 나타난다.
  function mountToTop() {
    const b = document.createElement('button');
    b.id = 'totop'; b.type = 'button'; b.textContent = '↑';
    b.setAttribute('aria-label', '맨 위로');
    b.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(b);
    let ticking = false;
    const update = () => { ticking = false; b.classList.toggle('on', scrollY > innerHeight * 0.8); };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    mountToTop();
    const btn = document.getElementById('lockbtn');
    if (btn) btn.onclick = () => {
      if (isAuthed()) { sessionStorage.removeItem(KEY); sync(); } else openGate();
    };
    const closeButton = document.getElementById('pw-no');
    const openButton = document.getElementById('pw-ok');
    const passwordInput = document.getElementById('pw-in');
    if (closeButton) closeButton.onclick = () => gate().classList.remove('on');
    if (openButton) openButton.onclick = tryPw;
    if (passwordInput) passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryPw(); });
    document.addEventListener('click', (e) => {
      if (e.target.closest('.locked:not(.open) .veil')) openGate();
    });
    sync();
  });
})();
