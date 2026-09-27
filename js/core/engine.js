// The paper theatre: turns scroll position into scene time, stacks paper layers,
// swaps sets between scenes and keeps the caption / tag / progress thread in sync.

import { makeCutter, makeGrain, clamp } from './paper.js';
import { ease, hooks } from './anim.js';
import { Puppet } from '../assets/people.js';

const CY = 470;                       // world y that sits at the centre of the screen
const PAD = 0.5;                      // beats of set-change before/after each scene
const GAP = 0.9;                      // scroll units between two scenes
const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');

export function startTheatre({ book, chapter, scenes, ui, beatText = () => undefined, root = document }) {
  const $ = (id) => root.getElementById(id);
  const stageEl = $('scenes');
  const spaceEl = $('scroll-space');
  const defsEl = $('defs');
  const capEl = $('caption'), capText = $('cap-text'), capRef = $('cap-ref');
  const tagEl = $('tag'), tagKicker = $('tag-kicker'), tagTitle = $('tag-title'), tagRef = $('tag-ref');
  const railEl = $('rail');
  const coverEl = $('cover');
  const hintEl = $('hint');
  const endEl = $('end');
  const turnEl = $('turn');
  const langEl = $('lang');

  let reduced = reduceMQ.matches;
  reduceMQ.addEventListener?.('change', (e) => (reduced = e.matches));

  /* ---------- paper grain ---------- */
  try { $('grain-img').setAttribute('href', makeGrain()); } catch (e) { /* grain is decoration */ }

  /* ---------- verses, sections ---------- */
  const chap = book.chapters[chapter - 1];
  // a chapter can open mid-way through a part begun in an earlier chapter (e.g. Mk 3)
  let carryPart = '', carrySec = '';
  book.chapters.slice(0, chapter - 1).forEach((c) => c.headings.forEach((h) => { if (h.kind === 'part') carryPart = h.title; else carrySec = h.title; }));
  const verseText = (v) => chap.verses[v - 1];
  const sectionOf = (v) => {
    let part = carryPart, sec = carrySec, start = 1;
    for (const h of chap.headings) if (h.before <= v) { if (h.kind === 'part') part = h.title; else { sec = h.title; start = h.before; } }
    const next = chap.headings.find((h) => h.kind === 'section' && h.before > v);
    const end = next ? next.before - 1 : chap.verses.length;
    return { part, sec, start, end };
  };

  /* ---------- timeline ---------- */
  const wordsOf = (s) => s.trim().split(/\s+/).length;
  const timeline = [];
  let g0 = 0;
  scenes.forEach((sc, si) => {
    const beats = sc.beats.map((b, bi) => {
      const vs = Array.isArray(b.v) ? b.v : b.v ? [b.v] : [];
      const text = b.text ? beatText(sc.id, bi) ?? b.text : null;
      const segs = b.cover ? [] : text ? [{ v: vs[0], text, first: !b.cont }] : vs.map((v) => ({ v, text: verseText(v), first: true }));
      const words = segs.reduce((n, s) => n + wordsOf(s.text), 0);
      return { ...b, segs, vs, len: b.cover ? 1.25 : clamp(0.85 + words / 24, 1, 2.3) };
    });
    const entry = { sc, si, beats, start: 0, end: 0, built: null };
    if (si > 0) g0 += GAP;
    entry.start = g0;
    beats.forEach((b) => { b.start = g0; g0 += b.len; });
    entry.end = g0;
    timeline.push(entry);
  });
  const total = g0 + 0.6;

  // scene-local time from global position g
  function localT(e, g) {
    const n = e.beats.length;
    if (g < e.start) return -PAD * clamp((e.start - g) / (GAP / 2), 0, 2);
    if (g >= e.end) return n + PAD * clamp((g - e.end) / (GAP / 2), 0, 2);
    for (let i = 0; i < n; i++) { const b = e.beats[i]; if (g < b.start + b.len) return i + (g - b.start) / b.len; }
    return n;
  }

  /* ---------- geometry ---------- */
  let W = 0, H = 0, K = 1, portrait = false, unitPx = 800;
  function measure() {
    W = innerWidth; H = innerHeight;
    portrait = H > W * 1.05;
    const safe = portrait ? { w: 760, h: 860 } : { w: 1020, h: 760 };
    K = Math.min(W / safe.w, H / safe.h);
    unitPx = Math.max(520, H * 0.85);
    spaceEl.style.height = Math.round(total * unitPx + H) + 'px';
  }

  /* ---------- per-piece paper shadows ---------- */
  const shadows = new Set();
  // Still pieces get a true soft (blurred) shadow — rendered once and cached.
  // Moving pieces get a "stepped" shadow: three offset silhouettes, no blur, so redrawing them
  // every frame stays cheap while reading the same at paper scale.
  function shadowFilter(sh, live = false) {
    const k = Math.max(1, Math.min(14, Math.round(sh)));
    const id = (live ? 'paper-shl-' : 'paper-sh-') + k;
    if (!shadows.has(id)) {
      shadows.add(id);
      const f = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      f.id = id;
      ['x', 'y', 'width', 'height'].forEach((a, i) => f.setAttribute(a, ['-12%', '-12%', '124%', '130%'][i]));
      f.setAttribute('color-interpolation-filters', 'sRGB');
      const dy = k * 0.8;
      f.innerHTML = live
        ? `<feDropShadow dx="0" dy="-0.8" stdDeviation="0" flood-color="#fffaec" flood-opacity=".5"/>` +
          `<feDropShadow dx="0" dy="${(dy * 0.5).toFixed(1)}" stdDeviation="0" flood-color="#3a2612" flood-opacity=".17"/>` +
          `<feDropShadow dx="0" dy="${(dy * 0.8).toFixed(1)}" stdDeviation="0" flood-color="#3a2612" flood-opacity=".12"/>`
        : `<feDropShadow dx="0" dy="-0.8" stdDeviation="0" flood-color="#fffaec" flood-opacity=".5"/><feDropShadow dx="0" dy="${dy.toFixed(1)}" stdDeviation="${(k * 0.62).toFixed(2)}" flood-color="#3a2612" flood-opacity=".32"/>`;
      defsEl.appendChild(f);
    }
    return id;
  }

  /* ---------- live pieces ----------
     A piece that changes in two different frames is "live": it is lifted into its own <svg>
     (its own compositor layer, same stacking order), so re-drawing it never re-rasterises
     the big still sheets around it. */
  // Every <svg> sheet is fitted tightly around what it holds, so no layer is a screen-sized
  // mostly-transparent texture; live pieces refit themselves as they move.
  let frameNo = 0;
  const promote = [];
  const dirty = new Set();
  const FIT = 26;
  hooks.write = (node) => {
    let p = node.__piece;
    if (p === undefined) { p = node.closest('g.piece'); node.__piece = p || null; }
    if (!p) return;
    if (p.__live) { dirty.add(p); return; }
    if (p.__f !== frameNo) { p.__f = frameNo; p.__frames = (p.__frames || 0) + 1; }
    if (p.__frames >= 2) { p.__live = true; promote.push(p); }
  };
  function fitSheet(sv, bb, grow = 0) {
    const L = sv.__L;
    const [X0, Y0, X1, Y1] = L.box;
    let x = bb.x - FIT - grow, y = bb.y - FIT - grow, x2 = bb.x + bb.width + FIT + grow, y2 = bb.y + bb.height + FIT + grow;
    x = Math.max(x, X0); y = Math.max(y, Y0); x2 = Math.min(x2, X1); y2 = Math.min(y2, Y1);
    if (!(x2 > x && y2 > y) || !isFinite(x + y + x2 + y2)) { x = X0; y = Y0; x2 = X0 + 1; y2 = Y0 + 1; }
    sv.__fit = { x, y, x2, y2 };
    sv.setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${(x2 - x).toFixed(1)} ${(y2 - y).toFixed(1)}`);
    sv.setAttribute('width', ((x2 - x) * K).toFixed(1));
    sv.setAttribute('height', ((y2 - y) * K).toFixed(1));
    sv.style.transform = `translate(${((x - X0) * K).toFixed(1)}px,${((y - Y0) * K).toFixed(1)}px)`;
  }
  const bboxOf = (node) => { try { return node.getBBox(); } catch (err) { return null; } };
  function fitAll(e) {
    e.built.layers.forEach((L) => L.sheets().forEach((sv) => {
      if (sv.classList.contains('live')) { const b = bboxOf(sv.firstElementChild); if (b) fitSheet(sv, b, 30); }
      else { const b = bboxOf(sv); if (b) fitSheet(sv, b); }
    }));
    e.built.fitted = true;
  }
  function liftLive() {
    while (promote.length) {
      const p = promote.pop();
      const sv = p.parentNode;
      if (!sv || !sv.parentNode || sv.classList.contains('live')) continue;
      const div = sv.parentNode;
      const mk = () => { const n = sv.cloneNode(false); n.__L = sv.__L; return n; };
      const live = mk();
      live.classList.add('live');
      // moving pieces drop the (costly to redraw) blur filter and show their geometric shadows instead
      if (p.hasAttribute('filter')) { p.removeAttribute('filter'); p.classList.add('gs'); }
      const rest = mk();
      while (p.nextSibling) rest.appendChild(p.nextSibling);
      live.appendChild(p);
      div.insertBefore(live, sv.nextSibling);
      if (rest.childNodes.length) { div.insertBefore(rest, live.nextSibling); const b = bboxOf(rest); if (b) fitSheet(rest, b); }
      if (!sv.childNodes.length) sv.remove(); else { const b = bboxOf(sv); if (b) fitSheet(sv, b); }
      const b = bboxOf(p); if (b) fitSheet(live, b, 30);
    }
    // Moving pieces: grow the sheet when a piece moves past its edge. Grow-only (the new fit
    // covers the old one), so a swaying / rocking / spinning piece settles into a sheet that holds
    // its whole range and is never resized again — every resize means a re-raster, which can blip.
    dirty.forEach((p) => {
      const sv = p.parentNode, f = sv && sv.__fit;
      if (!f || !sv.isConnected) return;
      const b = bboxOf(p);
      if (!b) return;
      const [X0, Y0, X1, Y1] = sv.__L.box;
      // only the part that can be on screen counts (big rays or a sun glow reach past the layer)
      const bx = Math.max(b.x, X0), by = Math.max(b.y, Y0), bx2 = Math.min(b.x + b.width, X1), by2 = Math.min(b.y + b.height, Y1);
      if (bx2 <= bx || by2 <= by) return;
      // an edge already at the layer's own boundary can't grow further, so it never counts as "out"
      const out = (bx < f.x + 2 && f.x > X0 + 1) || (by < f.y + 2 && f.y > Y0 + 1) || (bx2 > f.x2 - 2 && f.x2 < X1 - 1) || (by2 > f.y2 - 2 && f.y2 < Y1 - 1);
      if (!out) return;
      const x = Math.min(bx, f.x + FIT), y = Math.min(by, f.y + FIT), x2 = Math.max(bx2, f.x2 - FIT), y2 = Math.max(by2, f.y2 - FIT);
      fitSheet(sv, { x, y, width: x2 - x, height: y2 - y }, 40 + Math.min(160, Math.max(bx2 - bx, by2 - by) * 0.3));
    });
    dirty.clear();
  }

  /* ---------- building scenes ---------- */
  function build(e) {
    const sc = e.sc;
    const el = document.createElement('div');
    el.className = 'scene';
    el.dataset.id = sc.id;
    el.style.display = 'none'; // shown (and positioned) by the frame loop once it's on stage
    const layers = [];
    const defs = [];
    const cam = { x: 0, y: 0, z: 1 };
    const camR = { x: [0, 0], y: [0, 0], z: [1, 1], ...(sc.cam || {}) };
    const S = {
      c: makeCutter(sc.id),
      cam, portrait, get reduced() { return reduced; },
      id: (n) => `${sc.id}-${n}`,
      defs(markup) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.innerHTML = markup; defsEl.appendChild(g); defs.push(g);
      },
      layer(o = {}) {
        const L = { par: o.par ?? 0.5, sh: o.sh ?? 4, sky: !!o.sky, rise: o.rise ?? 1, pad: o.pad ?? 0, sx: 0, sy: 0 };
        L.el = document.createElement('div');
        L.el.className = 'layer' + (L.sky ? ' sky' : ' cut');
        L.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        L.svg.setAttribute('preserveAspectRatio', 'none');
        L.svg.__L = L;
        L.el.appendChild(L.svg);
        el.appendChild(L.el);
        L.sheets = () => L.el.querySelectorAll(':scope > svg');
        // Each cut-out carries its own shadow (an SVG filter on a small wrapper), so a moving
        // puppet only re-renders itself and still sheets stay cached as rasterised tiles.
        const filt = !(L.sky || o.flat);
        L.add = (markup) => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', 'piece');
          if (filt) g.setAttribute('filter', `url(#${shadowFilter(L.sh)})`);
          g.innerHTML = markup;
          let host = L.el.lastElementChild;
          if (host.classList.contains('live')) { host = host.cloneNode(false); host.classList.remove('live'); host.__L = L; L.el.appendChild(host); }
          host.appendChild(g);
          return g.firstElementChild;
        };
        // slide the whole sheet on the compositor (world units) — for waves, drifting clouds, shakes
        L.shift = (x = 0, y = 0) => { L.sx = x; L.sy = y; };
        // fade the whole sheet on the compositor (skies crossfading, flashes) — no repainting
        L.alpha = 1;
        L.fade = (a) => { L.alpha = a; };
        layers.push(L);
        return L;
      },
      $: (k) => el.querySelector(`[data-k="${k}"]`),
      $$: (k) => Array.from(el.querySelectorAll(`[data-k="${k}"]`)),
      puppet: (node) => new Puppet(node),
      // visible world rect of a par-0 layer (at camera rest)
      view: () => ({ x0: 800 - W / 2 / K, x1: 800 + W / 2 / K, y0: CY - H / 2 / K, y1: CY + H / 2 / K }),
    };
    const update = sc.build(S) || (() => {});
    stageEl.appendChild(el);
    e.built = { el, layers, defs, update, S, cam, camR, shown: false };
    size(e);
  }
  function destroy(e) {
    if (!e.built) return;
    e.built.el.remove();
    e.built.defs.forEach((d) => d.remove());
    e.built = null;
  }
  // each layer covers the world rectangle it can ever show, so camera moves are pure compositing
  function size(e) {
    const { layers, camR } = e.built;
    const zmin = Math.min(1, camR.z[0]);
    for (const L of layers) {
      const p = L.par, m = 90 / K + L.pad;
      const hw = W / 2 / (K * zmin) + m, hh = H / 2 / (K * zmin) + m;
      const x0 = 800 + p * camR.x[0] - hw, x1 = 800 + p * camR.x[1] + hw;
      const y0 = CY + p * camR.y[0] - hh, y1 = CY + p * camR.y[1] + hh + (L.sky ? 0 : 120 / K);
      L.box = [x0, y0, x1, y1];
      const w = (x1 - x0) * K, h = (y1 - y0) * K;
      L.el.style.width = w + 'px';
      L.el.style.height = h + 'px';
      L.lastT = '';
    }
    e.built.fitted = false;
  }

  /* ---------- pointer parallax ---------- */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (ev) => {
    if (ev.pointerType === 'touch') return;
    ptr.tx = (ev.clientX / W - 0.5) * 2; ptr.ty = (ev.clientY / H - 0.5) * 2;
  }, { passive: true });

  function place(e, t, time) {
    const { layers, cam, sc } = { ...e.built, sc: e.sc };
    const n = e.beats.length, L = layers.length;
    const enter = e.si === 0 ? 1 : clamp((t + PAD) / PAD);
    const exit = e.si === timeline.length - 1 ? 0 : clamp((t - n) / PAD);
    const fly = sc.enter === 'fly';
    layers.forEach((Ly, i) => {
      let o = 1, dy = 0;
      if (enter < 1) {
        const k = clamp((enter - (i / L) * 0.45) / 0.55), eK = ease.out(k);
        o = Ly.sky ? k : clamp(k * 1.6);
        if (!Ly.sky) dy += (fly ? -1 : 1) * (1 - eK) * (0.14 * H + i * 10) * Ly.rise;
      }
      if (exit > 0) {
        const j = L - 1 - i, k = clamp((exit - (j / L) * 0.45) / 0.55), eK = ease.in(k);
        o *= Ly.sky ? 1 - k * 0.999 : 1 - clamp(k * 1.4);
        if (!Ly.sky) dy += eK * (0.12 * H + j * 8) * Ly.rise;
      }
      const p = Ly.par, zl = 1 + (cam.z - 1) * p;
      const cx = 800 + cam.x * p, cy = CY + cam.y * p;
      const [x0, y0] = Ly.box;
      const tx = W / 2 - (cx - x0 - Ly.sx) * K * zl - ptr.x * p * 14;
      const ty = H / 2 - (cy - y0 - Ly.sy) * K * zl - ptr.y * p * 8 + dy;
      const s = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${zl.toFixed(4)})`;
      if (s !== Ly.lastT) { Ly.el.style.transform = s; Ly.lastT = s; }
      const os = (o * Ly.alpha).toFixed(3);
      if (os !== Ly.lastO) { Ly.el.style.opacity = os; Ly.lastO = os; }
    });
  }

  /* ---------- caption ---------- */
  let capKey = '';
  let capWords = [];
  function setCaption(e, bi) {
    const key = e ? e.si + ':' + bi : '';
    if (key === capKey) return;
    capKey = key;
    const b = e && e.beats[bi];
    if (!b || b.cover) { capEl.classList.add('off'); capWords = []; return; }
    capEl.classList.remove('off');
    const html = [];
    b.segs.forEach((s) => {
      if (s.first) html.push(`<sup class="vn">${s.v}</sup>`);
      s.text.split(/\s+/).forEach((w) => {
        const t = w.replace(/\[([^\]]+)\]/g, '<span class="br">[$1]</span>');
        html.push(`<span class="w">${t}</span> `);
      });
    });
    capText.innerHTML = html.join('');
    capWords = Array.from(capText.querySelectorAll('.w'));
    const vs = b.vs;
    capRef.textContent = ui.ref(chapter, vs[0], vs[vs.length - 1]);
    capEl.classList.remove('flip'); void capEl.offsetWidth; capEl.classList.add('flip');
  }
  function revealCaption(p) {
    const n = capWords.length;
    if (!n) return;
    const shown = reduced ? n : p * n;
    for (let i = 0; i < n; i++) {
      const o = clamp(shown - i + 0.6).toFixed(2);
      if (capWords[i]._o !== o) { capWords[i]._o = o; capWords[i].style.opacity = o; capWords[i].style.transform = `translateY(${((1 - o) * 6).toFixed(1)}px)`; }
    }
  }

  /* ---------- hanging tag ---------- */
  let tagKey = '';
  function setTag(v, parable) {
    const s = sectionOf(v);
    const key = s.sec + parable;
    if (key === tagKey) return;
    tagKey = key;
    tagKicker.textContent = `${ui.chapter} ${chapter} · ${s.part.toLowerCase()}`;
    tagTitle.textContent = s.sec;
    tagRef.textContent = ui.ref(chapter, s.start, s.end);
    tagEl.classList.toggle('parable', !!parable);
    tagEl.classList.remove('swing'); void tagEl.offsetWidth; tagEl.classList.add('swing');
  }

  /* ---------- progress thread ---------- */
  const knots = [];
  function buildRail() {
    const secs = chap.headings.filter((h) => h.kind === 'section');
    railEl.innerHTML = '<span class="thread"><span class="fill" id="rail-fill"></span></span>';
    secs.forEach((h) => {
      // first beat that starts this section
      let target = null;
      for (const e of timeline) for (const b of e.beats) if (!target && b.vs[0] >= h.before) target = b;
      if (!target) return;
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'knot';
      btn.style.top = (target.start / total) * 100 + '%';
      btn.innerHTML = `<span class="lbl">${h.title}</span>`;
      btn.setAttribute('aria-label', `${h.title} (${ui.ref(chapter, h.before)})`);
      // jump straight to the section with a paper page-turn — no scrolling through everything in between
      btn.addEventListener('click', (ev) => { ev.stopPropagation(); turnTo(target.start + Math.min(0.55, target.len * 0.5)); });
      railEl.appendChild(btn);
      knots.push({ btn, at: target.start });
    });
  }

  /* ---------- deep links: #w12 jumps to verse 12 ---------- */
  function jumpToHash() {
    const m = location.hash.match(/^#w(\d+)/);
    if (!m) return false;
    const v = +m[1];
    for (const e of timeline) for (const b of e.beats) if (b.vs.includes(v)) { scrollTo(0, (b.start + 0.55) * unitPx); g = b.start + 0.55; return true; }
    return false;
  }

  /* ---------- the loop ---------- */
  let g = 0, lastNow = performance.now();
  function frame(now) { step(now); requestAnimationFrame(frame); }
  function step(now = performance.now()) {
    frameNo++;
    const dt = Math.min(0.1, (now - lastNow) / 1000); lastNow = now;
    const target = scrollY / unitPx;
    g = reduced ? target : g + (target - g) * (1 - Math.exp(-dt * 6.5));
    if (Math.abs(target - g) < 0.0005) g = target;
    ptr.x += (ptr.tx - ptr.x) * (1 - Math.exp(-dt * 3));
    ptr.y += (ptr.ty - ptr.y) * (1 - Math.exp(-dt * 3));
    const time = reduced ? 0 : now / 1000;

    let capE = null, capB = -1, capP = 0;
    timeline.forEach((e, i) => {
      const t = localT(e, g);
      const n = e.beats.length;
      const active = t > -PAD && (t < n + PAD || i === timeline.length - 1); // the last set stays up behind the closing card
      const near = g > e.start - GAP * 3 && g < e.end + GAP * 3;
      if (active || near) { if (!e.built) build(e); } else if (e.built && (g < e.start - 14 || g > e.end + 14)) destroy(e);
      if (!e.built) return;
      const vis = active || (i === 0 && t <= 0);
      if (vis !== e.built.shown) { e.built.el.style.display = vis ? '' : 'none'; e.built.shown = vis; }
      if (!vis) return;
      e.built.update(clamp(t, -PAD, n + PAD), time);
      if (!e.built.fitted) fitAll(e);
      place(e, t, time);
      if (t >= 0 && t < n) { capE = e; capB = Math.floor(t); capP = (t - capB) / 0.5; }
    });
    // keep the last caption visible through the set change
    if (!capE) {
      const prev = [...timeline].reverse().find((e) => g >= e.end);
      const next = timeline.find((e) => g < e.start);
      if (prev && (!next || g - prev.end < next.start - g)) { capE = prev; capB = prev.beats.length - 1; capP = 1; }
      else if (next) { capE = null; }
    }
    setCaption(capE, capB);
    revealCaption(clamp(capP));
    capEl.classList.toggle('dim', !timeline.some((e) => g >= e.start && g < e.end));

    const cur = capE && capE.beats[capB];
    const tagE = capE || timeline.find((e) => g < e.start) || timeline[timeline.length - 1];
    const v = cur && cur.vs.length ? cur.vs[0] : (tagE.beats.find((b) => b.vs.length)?.vs[0] ?? 1);
    setTag(v, tagE.sc.parable);

    const fill = $('rail-fill');
    if (fill) fill.style.transform = `scaleY(${clamp(g / (total - 0.6)).toFixed(4)})`;
    knots.forEach((k) => k.btn.classList.toggle('on', g >= k.at - 0.01));

    const c = clamp(1 - g / 0.7);
    coverEl.style.opacity = c.toFixed(3);
    coverEl.style.visibility = c > 0.01 ? 'visible' : 'hidden';
    coverEl.style.transform = `translateY(${(-(1 - c) * 40).toFixed(1)}px)`;
    hintEl.classList.toggle('gone', g > 0.25);
    langEl?.classList.toggle('gone', g > 0.3); // the language picker lives on the home page only
    endEl.classList.toggle('on', g > total - 0.9);
    liftLive();
  }

  // build the next scenes while the reader is idle, so crossing into them never stalls a frame
  const idle = window.requestIdleCallback || ((fn) => setTimeout(() => fn({ timeRemaining: () => 8 }), 60));
  function prebuild(deadline) {
    const next = timeline.find((e) => !e.built && e.start < g + 12 && e.end > g - 6);
    if (next && deadline.timeRemaining() > 4) build(next);
    idle(prebuild, { timeout: 800 });
  }
  idle(prebuild, { timeout: 800 });

  measure();
  buildRail();
  let rT = 0;
  addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      const wasPortrait = portrait;
      const keep = g;
      measure();
      timeline.forEach((e) => { if (e.built) { if (wasPortrait !== portrait) destroy(e); else size(e); } });
      scrollTo(0, keep * unitPx);
    }, 120);
  });
  if (!jumpToHash()) g = scrollY / unitPx;
  addEventListener('hashchange', jumpToHash);
  requestAnimationFrame(frame);

  // debug / deep-link helper: go('storm', 3.5) jumps straight to a scene time
  function go(id, t = 0) {
    const e = timeline.find((x) => x.sc.id === id) || timeline[id];
    if (!e) return null;
    const i = Math.max(0, Math.min(e.beats.length - 1, Math.floor(t)));
    const b = e.beats[i];
    const target = t < 0 ? e.start + t * GAP : t >= e.beats.length ? e.end + (t - e.beats.length) * GAP : b.start + (t - i) * b.len;
    scrollTo(0, target * unitPx);
    g = target;
    step(); step();
    return target;
  }
  /* ---------- page turns & tap-to-turn ---------- */
  let turning = false;
  function turnTo(target, label) {
    if (turning) return;
    if (reduced || !turnEl) { scrollTo(0, target * unitPx); g = target; return; }
    turning = true;
    const tb = beats.find((b) => b.start <= target && target < b.start + b.len) || beats[0];
    const sec = sectionOf(tb.vs[0] || 1);
    turnEl.querySelector('.turn-title').textContent = label ? label.title : sec.sec;
    turnEl.querySelector('.turn-ref').textContent = label ? label.ref : ui.ref(chapter, sec.start, sec.end);
    document.body.classList.add('turning');
    turnEl.classList.add('on'); // a sheet of paper slides in from the right…
    setTimeout(() => {
      scrollTo(0, target * unitPx);
      g = target;
      step(); step();
      turnEl.classList.replace('on', 'out'); // …and slides away to the left, revealing the new set
      setTimeout(() => {
        turnEl.classList.add('reset'); turnEl.classList.remove('out');
        void turnEl.offsetWidth; turnEl.classList.remove('reset');
        turning = false;
        document.body.classList.remove('turning');
      }, 520);
    }, 420);
  }
  const beats = timeline.flatMap((e) => e.beats);
  // move to the next / previous sentence (lands where its words have all appeared)
  function nextBeat(dir) {
    const cur = scrollY / unitPx;
    const rest = (b) => b.start + Math.min(0.55, b.len * 0.5);
    const list = dir > 0 ? beats.filter((b) => rest(b) > cur + 0.05) : beats.filter((b) => rest(b) < cur - 0.05).reverse();
    const b = list[0];
    if (b) scrollTo({ top: rest(b) * unitPx, behavior: reduced ? 'auto' : 'smooth' });
  }
  // tap the right third of the stage for the next sentence, the left third for the previous one
  $('stage').addEventListener('click', (ev) => {
    const x = ev.clientX / W;
    if (x > 0.66) nextBeat(1); else if (x < 0.34) nextBeat(-1);
  });
  addEventListener('keydown', (ev) => {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); nextBeat(1); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); nextBeat(-1); }
  });
  // the verse the reader is on (used to keep the place when switching language)
  function verse() {
    let v = 1;
    for (const b of beats) { if (b.start <= g + 0.01 && b.vs.length) v = b.vs[0]; }
    return v;
  }

  return { timeline, get g() { return g; }, unitPx: () => unitPx, go, step, verse, nextBeat, turnTo };
}
