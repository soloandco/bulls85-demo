/* 회원 관계 지도. 큰 화면에서는 그래프, 휴대폰에서는 HTML 목록만 남는다. */
(function () {
  const COLORS = {
    '패션/라이프스타일': '#B2506F', '법률/IP': '#A8823C', '경영/컨설팅': '#3F7A5E', 'IT/플랫폼': '#3C6E9E',
    '마케팅/PR': '#6E5A9E', '공간/유통': '#B26A34', '문화/예술/콘텐츠': '#2E8189', '의료/헬스': '#A24338',
    '교육/연구': '#6E8A38', '세무/회계': '#7C6BA8',
  };
  const COLLABS = [[18, 20]];

  let drawn = false;
  async function draw() {
    const box = document.getElementById('g');
    if (drawn || !box || !window.d3 || box.clientWidth === 0) return;
    drawn = true;
    const d = await (await fetch('data/members.json')).json();
    const M = d.members;
    const cats = Object.keys(d.categories);

    const links = [];
    for (let i = 0; i < M.length; i++) {
      for (let j = i + 1; j < M.length; j++) {
        const s = M[i].keywords.filter((k) => M[j].keywords.includes(k));
        if (s.length) links.push({ source: M[i].id, target: M[j].id, kw: s, w: s.length });
      }
    }
    COLLABS.forEach(([a, b]) => {
      const l = links.find((x) => (x.source === a && x.target === b) || (x.source === b && x.target === a));
      if (l) l.collab = true; else links.push({ source: a, target: b, kw: [], w: 2, collab: true });
    });
    const deg = {};
    links.forEach((l) => { deg[l.source] = (deg[l.source] || 0) + 1; deg[l.target] = (deg[l.target] || 0) + 1; });

    document.getElementById('legend').innerHTML = cats
      .map((c) => `<span><i style="background:${COLORS[c] || '#8A8A8A'}"></i>${c}</span>`).join('');

    const W = box.clientWidth, H = box.clientHeight;
    const svg = d3.select('#g svg').attr('viewBox', [0, 0, W, H]);
    const nodes = M.map((m) => ({ ...m }));
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links.map((l) => ({ ...l }))).id((n) => n.id)
        .distance((l) => (l.collab ? 70 : 110 - l.w * 10)).strength((l) => (l.collab ? 1 : 0.25)))
      .force('charge', d3.forceManyBody().strength(-210))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collide', d3.forceCollide(34));

    const link = svg.append('g').selectAll('line').data(sim.force('link').links()).join('line')
      .attr('class', (l) => 'link' + (l.collab ? ' collab' : ''))
      .attr('stroke-width', (l) => (l.collab ? 3 : 0.6 + l.w * 0.6));

    const tip = document.getElementById('tip');
    const node = svg.append('g').selectAll('g').data(nodes).join('g').attr('class', 'node')
      .on('click', (e, n) => { location.href = `member/${encodeURIComponent(n.name)}.html`; })
      .on('mousemove', (e, n) => {
        tip.style.opacity = 1;
        tip.style.left = (e.offsetX + 14) + 'px';
        tip.style.top = (e.offsetY + 14) + 'px';
        tip.innerHTML = `<b>${n.name}</b> · ${n.company}<br><span class="muted">${n.category} · 이어진 ${deg[n.id] || 0}명</span><br>${n.keywords.slice(0, 5).join(' · ')}`;
      })
      .on('mouseleave', () => { tip.style.opacity = 0; })
      .call(d3.drag()
        .on('start', (e, n) => { if (!e.active) sim.alphaTarget(0.3).restart(); n.fx = n.x; n.fy = n.y; })
        .on('drag', (e, n) => { n.fx = e.x; n.fy = e.y; })
        .on('end', (e, n) => { if (!e.active) sim.alphaTarget(0); n.fx = n.fy = null; }));

    node.append('circle')
      .attr('r', (n) => 9 + Math.min(12, (deg[n.id] || 0) * 1.2))
      .attr('fill', (n) => COLORS[n.category] || '#8A8A8A')
      .attr('stroke', '#EFEAE0').attr('stroke-width', 2);
    node.append('text').attr('dy', (n) => 24 + Math.min(12, (deg[n.id] || 0) * 1.2)).text((n) => n.name);

    sim.on('tick', () => {
      link.attr('x1', (l) => l.source.x).attr('y1', (l) => l.source.y)
        .attr('x2', (l) => l.target.x).attr('y2', (l) => l.target.y);
      node.attr('transform', (n) => `translate(${Math.max(36, Math.min(W - 36, n.x))},${Math.max(34, Math.min(H - 44, n.y))})`);
    });

    const F = document.getElementById('filters');
    F.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      F.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      const c = b.dataset.c;
      node.classed('dim', (n) => c !== 'all' && n.category !== c);
      link.classed('dim', (l) => c !== 'all' && l.source.category !== c && l.target.category !== c);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const box = document.getElementById('mapbox');
    if (!box) return;
    // 주소에 #map 이 붙어 들어오면 펼친 채로 시작한다
    if (location.hash === '#map') box.open = true;
    box.addEventListener('toggle', () => { if (box.open) draw(); });
    if (box.open) draw();
  });
})();
