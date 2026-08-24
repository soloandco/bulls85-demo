/* 홈 스크롤 영상. 클립 6편을 스크롤 위치에 맞춰 한 편처럼 재생한다. */
(function () {
  const V = 'assets/vid/';
  const A = '#C8A05A';
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('world');
    if (!el || typeof mountScrollWorld !== 'function') return;
    mountScrollWorld(el, {
      hint: '스크롤해서 들어가기',
      nav: false, atmosphere: false,
      diveScroll: 1.0, connScroll: 0.9,
      sections: [
        { id: 's1', label: '1985', still: V + 'clip1-still.webp', clip: V + 'clip1.mp4', accent: A, scroll: 1.3, linger: 0.35,
          eyebrow: 'SINCE 1985', title: '같은 해에 태어나\n각자의 길을 걸어온 사람들',
          body: '1985년생. 서로를 모른 채 각자의 분야에서 전문가가 됐다.', tags: [] },
        { id: 's2', label: '멤버', still: V + 'clip2-still.webp', clip: V + 'clip2.mp4', accent: A,
          eyebrow: 'MEMBER', title: '열 개 분야,\n서른다섯 명의 전문가',
          body: '한복 공방, 한의원, 특허 사무소, 스터디카페. 서로 다른 자리에서 전문성을 쌓았다.', tags: [] },
        { id: 's3', label: '연결', still: V + 'clip3-still.webp', clip: V + 'clip3.mp4', accent: A,
          eyebrow: 'NETWORK', title: '물어볼 사람이\n모임 안에 있다',
          body: '누가 무엇을 잘하는지 알면, 고민 하나에 답할 사람이 보인다.', tags: [] },
        { id: 's4', label: '서로 돕기', still: V + 'clip4-still.webp', clip: V + 'clip4.mp4', accent: A,
          eyebrow: 'HELP', title: '묻는 사람과\n답하는 사람',
          body: '특허가 필요한 쪽과 변리사가, 홍보가 급한 쪽과 PR 전문가가 한 테이블에 앉는다.', tags: [] },
        { id: 's5', label: '활동', still: V + 'clip5-still.webp', clip: V + 'clip5.mp4', accent: A,
          eyebrow: 'ACTIVITY', title: '1년에 다섯 번,\n같은 자리에',
          body: '강연으로 배우고 술자리에서 친해진다. 일은 대개 그 사이에서 오간다.', tags: [] },
        { id: 's6', label: '가입', still: V + 'clip6-still.webp', clip: V + 'clip6.mp4', accent: A, scroll: 1.4, linger: 0.45,
          eyebrow: 'JOIN', title: '비어 있는 자리가\n하나 있습니다',
          body: '1985년생과 빠른 86년생이라면, 다음 모임에서 뵙겠습니다.', tags: [],
          cta: { primary: { label: '가입 문의', href: 'about.html#join' }, secondary: { label: '사람 찾기', href: 'help.html' } } },
      ],
      connectors: [null, null, null, null, null],
    });

    // 영상 구간을 지나면 엔진이 화면에 고정해 둔 자막·경로·진행바를 감춘다.
    // (그냥 두면 아래 내용 위에 유령처럼 겹쳐 보인다)
    let ticking = false;
    const update = () => {
      ticking = false;
      const end = el.offsetTop + el.offsetHeight - window.innerHeight;
      el.classList.toggle('past', window.scrollY > end);
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    addEventListener('resize', update);
    update();
  });
})();
