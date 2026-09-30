// The paper theatre: turns scroll position into scene time, stacks paper layers,
// swaps sets between scenes and keeps the caption / tag / progress thread in sync.

import { makeCutter, makeGrain, clamp, shadowCss, setShadowMode } from './paper.js';
import { ease, hooks, rollback } from './anim.js';
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
  const tagEl = $('tag'), tagTitle = $('tag-title'), tagRef = $('tag-ref');
  const railEl = $('rail');
  const coverEl = $('cover');
  const hintEl = $('hint');
  const endEl = $('end');
  const turnEl = $('turn');
  const langEl = $('lang');

  const SHADOW = document.documentElement.dataset.shadow || 'soft';
  let reduced = reduceMQ.matches;
  reduceMQ.addEventListener?.('change', (e) => (reduced = e.matches));

  setShadowMode(SHADOW);
  const shStyle = document.createElement('style');
  shStyle.textContent = shadowCss();
  document.head.appendChild(shStyle);

  /* ---------- paper grain ---------- */
  try { $('grain-img').setAttribute('href', makeGrain()); } catch (e) { /* grain is decoration */ }

  /* ---------- verses, sections ---------- */
  const chap = book.chapters[chapter - 1];
  // a chapter can open mid-way through a part begun in an earlier chapter (e.g. Mk 3)
  let carryPart = '', carrySec = '';
  book.chapters.slice(0, chapter - 1).forEach((c) => c.headings.forEach((h) => { if (h.kind === 'part') carryPart = h.title; else carrySec = h.title; }));
  const verseText = (v) => chap.verses[v - 1];
  // a part that opens before its first section (Mt 5,1–2) names those verses itself, in ordinary case
  const partAsSec = (t) => {
    const s = t.toLowerCase();
    return book.translation === 'Biblia Tysiąclecia' ? s[0].toUpperCase() + s.slice(1)
      : s.replace(/\S+/g, (w, i) => (i === 0 || w.length > 3 ? w[0].toUpperCase() + w.slice(1) : w));
  };
  const sectionOf = (v) => {
    let part = carryPart, sec = carrySec, start = 1;
    for (const h of chap.headings) if (h.before <= v) { if (h.kind === 'part') { part = h.title; sec = partAsSec(h.title); start = h.before; } else { sec = h.title; start = h.before; } }
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
  // where the play proper begins: the first sentence after the title card
  const opening = timeline.flatMap((e) => e.beats).find((b) => !b.cover) || timeline[0].beats[0];

  // scene-local time from global position g
  function localT(e, g) {
    const n = e.beats.length;
    if (g < e.start) return -PAD * clamp((e.start - g) / (GAP / 2), 0, 2);
    if (g >= e.end) return n + PAD * clamp((g - e.end) / (GAP / 2), 0, 2);
    for (let i = 0; i < n; i++) { const b = e.beats[i]; if (g < b.start + b.len) return i + (g - b.start) / b.len; }
    return n;
  }

  /* ---------- geometry ---------- */
  // Phone browsers resize the window whenever their toolbar slides in or out. That mustn't rescale
  // the theatre or move the reader, so sizes and scroll length follow the tall ("large") viewport
  // HL, and the live height H only centres the layers.
  let W = 0, H = 0, HL = 0, K = 1, portrait = false, unitPx = 800;
  const lvh = document.createElement('div');
  lvh.style.cssText = 'position:fixed;left:0;top:0;width:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none';
  document.body.appendChild(lvh);
  const tallH = () => Math.max(innerHeight, lvh.offsetHeight || 0);
  function measure() {
    W = innerWidth; H = innerHeight; HL = tallH();
    portrait = HL > W * 1.05;
    const safe = portrait ? { w: 760, h: 860 } : { w: 1020, h: 760 };
    K = Math.min(W / safe.w, HL / safe.h);
    unitPx = Math.max(520, HL * 0.85);
    spaceEl.style.height = Math.round(total * unitPx + HL) + 'px';
  }

  /* ---------- per-piece paper shadows ----------
     Each cut-out casts its own shadow onto whatever lies behind it. By default ("soft") that is a
     set of silhouette copies drawn under it (see sheet() in paper.js and shadowCss()): plain fills,
     cheap to paint in every browser. ?shadow=blur brings back the old SVG drop-shadow filter on
     still pieces, which WebKit re-runs on the CPU at every repaint — seconds per scene on a phone. */
  const shadows = new Set();
  function shadowFilter(sh) {
    const k = Math.max(1, Math.min(14, Math.round(sh)));
    const id = 'paper-sh-' + k;
    if (!shadows.has(id)) {
      shadows.add(id);
      const f = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      f.id = id;
      ['x', 'y', 'width', 'height'].forEach((a, i) => f.setAttribute(a, ['-12%', '-12%', '124%', '130%'][i]));
      f.setAttribute('color-interpolation-filters', 'sRGB');
      const dy = k * 0.8;
      f.innerHTML = `<feDropShadow dx="0" dy="-0.8" stdDeviation="0" flood-color="#fffaec" flood-opacity=".5"/><feDropShadow dx="0" dy="${dy.toFixed(1)}" stdDeviation="${(k * 0.62).toFixed(2)}" flood-color="#3a2612" flood-opacity=".32"/>`;
      defsEl.appendChild(f);
    }
    return id;
  }

  /* ---------- live pieces ----------
     A piece that changes in two different frames is "live": it is lifted into its own <svg>
     (its own compositor layer, same stacking order), so re-drawing it never re-rasterises
     the big still sheets around it. Scenes are walked through off-stage before they enter (see
     ready()), so nearly every piece that will ever move is lifted before the reader gets there. */
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
    if (p.__grain !== undefined) grainDirty.add(p);
    if (p.__f !== frameNo) { p.__f = frameNo; p.__frames = (p.__frames || 0) + 1; }
    if (p.__frames >= 2) { p.__live = true; promote.push(p); }
  };
  // (free: a carried sheet is placed by the compositor, so it covers its piece wherever that is, not only inside the layer)
  function fitSheet(sv, bb, grow = 0, free = false) {
    const L = sv.__L;
    const [X0, Y0, X1, Y1] = L.box;
    let x = bb.x - FIT - grow, y = bb.y - FIT - grow, x2 = bb.x + bb.width + FIT + grow, y2 = bb.y + bb.height + FIT + grow;
    if (!free) { x = Math.max(x, X0); y = Math.max(y, Y0); x2 = Math.min(x2, X1); y2 = Math.min(y2, Y1); }
    if (!(x2 > x && y2 > y) || !isFinite(x + y + x2 + y2)) { x = X0; y = Y0; x2 = X0 + 1; y2 = Y0 + 1; }
    sv.__fit = { x, y, x2, y2 };
    sv.setAttribute('viewBox', `${x.toFixed(1)} ${y.toFixed(1)} ${(x2 - x).toFixed(1)} ${(y2 - y).toFixed(1)}`);
    sv.setAttribute('width', ((x2 - x) * K).toFixed(1));
    sv.setAttribute('height', ((y2 - y) * K).toFixed(1));
    if (sv.__sprite) { sv.__sprite.key = ''; placeSprite(sv); } else sheetTransform(sv);
  }
  // a sprite's sheet is fitted around it at its home spot (bx, by); moving it is a CSS transform
  function placeSprite(sv) {
    const sp = sv.__sprite, f = sv.__fit;
    if (!f) return;
    const [X0, Y0] = sv.__L.box;
    const tx = ((f.x - X0) + (sp.x - sp.bx)) * K, ty = ((f.y - Y0) + (sp.y - sp.by)) * K;
    const tr = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${sp.s.toFixed(4)})`;
    const o = sp.o.toFixed(3);
    const key = tr + o;
    if (key === sp.key) return;
    sp.key = key;
    sv.style.transformOrigin = `${((sp.bx - f.x) * K).toFixed(1)}px ${((sp.by - f.y) * K).toFixed(1)}px`;
    sv.style.transform = tr;
    sv.style.opacity = o;
    sv.style.visibility = sp.o > 0.001 ? '' : 'hidden';
  }
  const bboxOf = (node) => { try { return node.getBBox(); } catch (err) { return null; } };

  /* ---------- whole-piece motion on the compositor ----------
     Most motion moves a cut-out as a whole: it slides, rises, turns, grows or fades. When that is
     all that changes, a live piece is drawn once and carried by its own <svg>'s CSS transform and
     opacity, so it doesn't repaint (or rebuild its grain) while it travels; only a change inside it
     (an arm, a step, a blink) repaints it. Its outer element is drawn at a raster transform R, and
     the sheet adds D = T·R⁻¹ on the compositor for the element's current transform T. */
  const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  const inv = (m) => { const q = m[0] * m[3] - m[1] * m[2]; return [m[3] / q, -m[1] / q, -m[2] / q, m[0] / q, (m[2] * m[5] - m[3] * m[4]) / q, (m[1] * m[4] - m[0] * m[5]) / q]; };
  // the most any direction is stretched by m (its largest singular value)
  const stretch = (m) => { const p = (m[0] * m[0] + m[1] * m[1] + m[2] * m[2] + m[3] * m[3]) / 2, q = m[0] * m[3] - m[1] * m[2]; return Math.sqrt(p + Math.sqrt(Math.max(0, p * p - q * q))); };
  const TF = /(\w+)\s*\(([^)]*)\)/g;
  // an SVG transform list as a matrix [a b c d e f], or null for anything unexpected
  function parseT(v) {
    let m = [1, 0, 0, 1, 0, 0], r;
    TF.lastIndex = 0;
    while ((r = TF.exec(v))) {
      const a = r[2].trim().split(/[\s,]+/).map(Number);
      const rad = (a[0] * Math.PI) / 180;
      let t;
      if (r[1] === 'translate') t = [1, 0, 0, 1, a[0], a.length > 1 ? a[1] : 0];
      else if (r[1] === 'scale') t = [a[0], 0, 0, a.length > 1 ? a[1] : a[0], 0, 0];
      else if (r[1] === 'rotate') {
        t = [Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0];
        if (a.length > 2) t = mul(mul([1, 0, 0, 1, a[1], a[2]], t), [1, 0, 0, 1, -a[1], -a[2]]);
      } else if (r[1] === 'matrix') t = a;
      else if (r[1] === 'skewX') t = [1, 0, Math.tan(rad), 1, 0, 0];
      else if (r[1] === 'skewY') t = [1, Math.tan(rad), 0, 1, 0, 0];
      else return null;
      if (t.length !== 6 || !t.every(isFinite)) return null;
      m = mul(m, t);
    }
    return v.replace(TF, '').trim() ? null : m;
  }
  function sheetTransform(sv) {
    const f = sv.__fit, [X0, Y0] = sv.__L.box;
    if (!f) return; // not fitted yet: fitSheet() places it
    const sx = (f.x - X0) * K, sy = (f.y - Y0) * K;
    const c = sv.__carrier && sv.__carrier.__carried;
    if (!c) { sv.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`; return; }
    // a drawn point u (sheet px) lands at A·(u + s) + K·(A·O + t − O) in the layer, for D = [A | t] and O the layer's world origin
    const [a, b, cc, d, tx, ty] = mul(c.T, c.Ri);
    const e = a * sx + cc * sy + K * (a * X0 + cc * Y0 + tx - X0), f2 = b * sx + d * sy + K * (b * X0 + d * Y0 + ty - Y0);
    sv.style.transform = `matrix(${a.toFixed(5)},${b.toFixed(5)},${cc.toFixed(5)},${d.toFixed(5)},${e.toFixed(2)},${f2.toFixed(2)})`;
  }
  // draw the carried element at a transform close to T, but never squashed: an axis shrunk towards
  // nothing (a piece growing from 0, a crack unrolling from sy 0.01) is drawn at full length; placed by fitLive()
  function rasterAt(el, T) {
    const c = el.__carried;
    let [a, b, cc, d] = T, l1 = Math.hypot(a, b), l2 = Math.hypot(cc, d);
    if (l1 < 1e-6 && l2 < 1e-6) { a = 1; b = 0; cc = 0; d = 1; l1 = l2 = 1; }
    else if (l1 < 1e-6) { a = d / l2; b = -cc / l2; l1 = 1; }
    else if (l2 < 1e-6) { cc = -b / l1; d = a / l1; l2 = 1; }
    const k1 = l1 < 0.2 ? 1 / l1 : 1, k2 = l2 < 0.2 ? 1 / l2 : 1;
    c.R = [a * k1, b * k1, cc * k2, d * k2, T[4], T[5]];
    c.Ri = inv(c.R);
    el.setAttribute('transform', `matrix(${c.R.map((x) => +x.toFixed(5)).join(' ')})`);
  }
  function carryPiece(sv, p) {
    const el = p.childElementCount === 1 ? p.firstElementChild : null;
    const v = el && (el.getAttribute('transform') || ''), T = el && parseT(v);
    if (!T) return;
    const o = el.getAttribute('opacity'), hidden = el.getAttribute('visibility') === 'hidden';
    el.__carried = { sv, T, v, o: o === null ? 1 : +o, hidden };
    sv.__carrier = el;
    el.removeAttribute('opacity'); el.removeAttribute('visibility');
    sv.style.opacity = el.__carried.o; sv.style.visibility = hidden ? 'hidden' : '';
    rasterAt(el, T);
  }
  // hand a carried element back to its svg: it moves by repainting again
  function uncarry(el) {
    const c = el.__carried, sv = c.sv;
    el.__carried = null; sv.__carrier = null;
    el.setAttribute('transform', c.v);
    if (c.o !== 1) el.setAttribute('opacity', c.o);
    if (c.hidden) el.setAttribute('visibility', 'hidden');
    sv.style.opacity = ''; sv.style.visibility = '';
    liveGrain(sv.firstElementChild);
  }
  // A carried piece is drawn whole, wherever it is parked (the compositor may bring any part of it
  // into view). One much bigger than its layer (a full-width ground band) goes back to repainting,
  // rather than taking a huge texture.
  const tooBig = (sv, b) => {
    const [X0, Y0, X1, Y1] = sv.__L.box, m = FIT + 40, w = b.width + 2 * m, h = b.height + 2 * m, lw = X1 - X0, lh = Y1 - Y0;
    return w > 2 * lw || h > 2 * lh || w * h > 1.2 * lw * lh;
  };
  function fitLive(sv) {
    const p = sv.firstElementChild;
    let b = bboxOf(p);
    if (b && sv.__carrier && tooBig(sv, b)) { uncarry(sv.__carrier); b = bboxOf(p); }
    if (b) fitSheet(sv, b, 30, !!sv.__carrier);
  }
  const refit = new Set();
  hooks.carry = (el, attr, v) => {
    const c = el.__carried, sv = c.sv;
    if (attr === 'opacity') { c.o = +v; sv.style.opacity = v; return true; }
    if (attr === 'visibility') { c.hidden = v === 'hidden'; sv.style.visibility = c.hidden ? 'hidden' : ''; return true; }
    if (attr !== 'transform') return false;
    const T = parseT(v);
    // something we can't read: hand the element back (the write goes on to set it)
    if (!T) { uncarry(el); refit.add(sv); return false; }
    c.T = T; c.v = v;
    // grown well past the scale it was drawn at: draw it again, a little larger, so it stays crisp
    if (stretch(mul(T, c.Ri)) > 1.15) { rasterAt(el, mul(T, [1.25, 0, 0, 1.25, 0, 0])); refit.add(sv); }
    else sheetTransform(sv);
    return true;
  };
  function fitAll(e) {
    e.built.layers.forEach((L) => L.sheets().forEach((sv) => {
      if (sv.classList.contains('live')) fitLive(sv);
      else { const b = bboxOf(sv); if (b) fitSheet(sv, b); for (const p of sv.children) if (p !== sv.__gall) pieceGrain(p); mergeSheet(sv); }
    }));
    e.built.fitted = true;
  }

  /* ---------- merged grain ----------
     WebKit gives every pattern-filled element its own tile buffer, rebuilt whenever the element or
     anything around it moves, so hundreds of per-part grain paths cost more to paint than all the
     paper they sit on. So a still sheet lays one grain path over everything it holds, and a moving
     piece one over itself: each part's outline, carried into the sheet's coordinates (same
     texture, same place). The parts' own grain paths stay in the DOM, hidden (.gm). */
  const grainDirty = new Set(), sheetDirty = new Set();
  // a part whose grain can't be lifted out: under a clip / mask / filter, or not drawn at all
  const KEEP = new Set(['defs', 'clipPath', 'mask', 'pattern', 'symbol', 'marker', 'svg', 'use', 'foreignObject']);
  // a part's outline as flat [x, y, …] arrays per subpath, parsed once; null unless it is plain M/L/Z polylines
  function outline(g) {
    const d = g.getAttribute('d') || '';
    if (g.__od === d) return g.__op;
    g.__od = d; g.__op = null;
    const tk = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?|[a-z]/gi);
    if (!tk || tk[0] !== 'M') return null;
    const subs = [];
    let cur = null;
    for (const t of tk) {
      const c = t.charCodeAt(0);
      if (c === 77) subs.push((cur = []));
      else if (c === 76 || c === 90) continue;
      else if (c > 64) return null;
      else cur.push(+t);
    }
    return (g.__op = subs.every((p) => p.length % 2 === 0) ? subs : null);
  }
  // an element's own transform attribute as a matrix (identity if none, null if unreadable), cached per value
  function ownT(n) {
    const v = n.getAttribute('transform');
    if (!v) return I;
    if (n.__tv !== v) { n.__tv = v; n.__tm = parseT(v); }
    return n.__tm;
  }
  const I = [1, 0, 0, 1, 0, 0];
  // the grain outlines of piece p, in its own coordinates or (inSheet) its sheet's — a sprite's group is
  // placed with a transform; parts it can't take (half-faded, clipped, unreadable) keep their own grain
  function grainOf(p, inSheet = false) {
    const tp = inSheet ? ownT(p) : I;
    let d = '';
    for (const g of p.getElementsByClassName('grain')) {
      if (g === p.__lg) continue;
      let own = g.tagName !== 'path' || g.hasAttribute('opacity'), o = 1, m = ownT(g);
      for (let n = g.parentNode; !own && n !== p; n = n.parentNode) {
        const a = n.getAttribute('opacity');
        if (a !== null) o *= +a;
        if (n.getAttribute('visibility') === 'hidden' || n.getAttribute('display') === 'none') o = 0;
        if (n.hasAttribute('clip-path') || n.hasAttribute('mask') || n.hasAttribute('filter') || KEEP.has(n.tagName)) own = true;
        const t = ownT(n);
        if (!t || !m) own = true; else if (t !== I) m = mul(t, m);
      }
      if (!tp || !m) own = true; else if (tp !== I) m = mul(tp, m);
      const pts = !own && o > 0.999 && outline(g);
      if (pts) {
        const flip = m[0] * m[3] - m[1] * m[2] < 0, r = (v) => Math.round(v * 10) / 10;
        for (const q of pts) {
          const n = q.length >> 1;
          for (let i = 0; i < n; i++) { const j = 2 * (flip ? n - 1 - i : i), x = q[j], y = q[j + 1]; d += (i ? 'L' : 'M') + r(m[0] * x + m[2] * y + m[4]) + ' ' + r(m[1] * x + m[3] * y + m[5]); }
          d += 'Z';
        }
      } else if (!own && o > 0.999) own = true; // not a plain outline
      else if (o >= 0.001) own = true; // half-faded: its grain has to fade with it
      g.classList.toggle('gm', !own);
    }
    return d;
  }
  function pieceGrain(p) {
    p.__grain = grainOf(p, true);
    grainDirty.delete(p);
    sheetDirty.add(p.parentNode);
  }
  // a moving piece's single grain path, the last thing in its group (whole-piece motion on the
  // compositor leaves it be; a change inside the piece redraws it)
  function liveGrain(p) {
    const d = grainOf(p);
    let lg = p.__lg;
    if (!d) { if (lg) { lg.remove(); p.__lg = null; } return; }
    if (!lg) { lg = p.__lg = document.createElementNS('http://www.w3.org/2000/svg', 'path'); lg.setAttribute('class', 'grain'); }
    if (lg.__d !== d) { lg.setAttribute('d', d); lg.__d = d; }
    if (p.lastChild !== lg) p.appendChild(lg);
  }
  function mergeSheet(sv) {
    sheetDirty.delete(sv);
    sv.__merged = true;
    let d = '';
    for (const p of sv.children) if (p.__grain) d += p.__grain;
    let gall = sv.__gall;
    if (!d) { if (gall) { gall.remove(); sv.__gall = null; } return; }
    if (!gall) { gall = sv.__gall = document.createElementNS('http://www.w3.org/2000/svg', 'path'); gall.setAttribute('class', 'grain'); }
    if (gall.__d !== d) { gall.setAttribute('d', d); gall.__d = d; }
    if (sv.lastChild !== gall) sv.appendChild(gall);
  }
  function flushGrain() {
    grainDirty.forEach((p) => { if (p.isConnected && !p.__live) pieceGrain(p); else grainDirty.delete(p); });
    sheetDirty.forEach((sv) => { if (sv.isConnected && !sv.classList.contains('live')) mergeSheet(sv); else sheetDirty.delete(sv); });
  }
  function liftLive(batch = false) {
    while (promote.length) {
      const p = promote.pop();
      const sv = p.parentNode;
      if (!sv || !sv.parentNode || sv.classList.contains('live') || sv.__sprite) continue;
      const div = sv.parentNode;
      const mk = () => { const n = sv.cloneNode(false); n.__L = sv.__L; return n; };
      const live = mk();
      live.classList.add('live');
      // moving pieces drop the (costly to redraw) blur filter and show their geometric shadows instead
      if (p.hasAttribute('filter')) { p.removeAttribute('filter'); p.classList.add('gs'); }
      // …and take their own grain out of the sheet's merged grain
      p.__grain = undefined;
      grainDirty.delete(p);
      if (sv.__gall) { sv.__gall.remove(); sv.__gall = null; }
      const rest = mk();
      while (p.nextSibling) rest.appendChild(p.nextSibling);
      live.appendChild(p);
      div.insertBefore(live, sv.nextSibling);
      if (rest.childNodes.length) div.insertBefore(rest, live.nextSibling);
      if (!sv.childNodes.length) sv.remove();
      carryPiece(live, p);
      liveGrain(p);
      if (batch) continue; // a scene being made ready off-stage is fitted as a whole afterwards
      if (rest.parentNode) { const b = bboxOf(rest); if (b) fitSheet(rest, b); mergeSheet(rest); }
      if (sv.parentNode) { const b = bboxOf(sv); if (b) fitSheet(sv, b); mergeSheet(sv); }
      fitLive(live);
    }
    if (batch) { dirty.clear(); refit.clear(); return; }
    // Moving pieces: grow the sheet when a piece moves past its edge. Grow-only (the new fit
    // covers the old one), so a swaying / rocking / spinning piece settles into a sheet that holds
    // its whole range and is never resized again — every resize means a re-raster, which can blip.
    dirty.forEach((p) => {
      const sv = p.parentNode, f = sv && sv.__fit;
      if (!f || !sv.isConnected) return;
      liveGrain(p);
      const b = bboxOf(p);
      if (!b) return;
      if (sv.__carrier) {
        // a carried sheet covers all of its piece: grow it (anywhere) when a part moves out
        if (b.x >= f.x && b.y >= f.y && b.x + b.width <= f.x2 && b.y + b.height <= f.y2) return;
        const x = Math.min(b.x, f.x + FIT), y = Math.min(b.y, f.y + FIT), x2 = Math.max(b.x + b.width, f.x2 - FIT), y2 = Math.max(b.y + b.height, f.y2 - FIT);
        const u = { x, y, width: x2 - x, height: y2 - y };
        if (tooBig(sv, u)) { uncarry(sv.__carrier); fitLive(sv); } else fitSheet(sv, u, 40, true);
        return;
      }
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
    refit.forEach((sv) => { if (sv.isConnected) { liveGrain(sv.firstElementChild); fitLive(sv); } });
    refit.clear();
    flushGrain();
  }

  /* ---------- building scenes ---------- */
  function build(e) {
    const sc = e.sc;
    const el = document.createElement('div');
    el.className = 'scene';
    el.dataset.id = sc.id;
    // hidden but laid out, so it can be made ready off-stage and shown without rebuilding its
    // renderers; shown (and positioned) by the frame loop once it's on stage
    el.style.visibility = 'hidden';
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
        // blur: a soft-focus sheet (world units of blur), done on the compositor rather than as an svg filter
        const L = { par: o.par ?? 0.5, sh: o.sh ?? 4, sky: !!o.sky, rise: o.rise ?? 1, pad: o.pad ?? 0, blur: o.blur ?? 0, sx: 0, sy: 0 };
        L.el = document.createElement('div');
        L.el.className = 'layer' + (L.sky ? ' sky' : o.flat ? ' flat' : ' cut');
        L.el.style.setProperty('--k', Math.max(1, Math.min(14, Math.round(L.sh))));
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
          if (filt && SHADOW === 'blur') g.setAttribute('filter', `url(#${shadowFilter(L.sh)})`);
          g.innerHTML = markup;
          let host = L.el.lastElementChild;
          if (host.classList.contains('live') || host.__sprite) { host = host.cloneNode(false); host.removeAttribute('class'); host.removeAttribute('style'); host.__L = L; L.el.appendChild(host); }
          host.appendChild(g);
          if (host.__merged) grainDirty.add(g);
          return g.firstElementChild;
        };
        // A sprite: a heavy cut-out (a whole crowd) that only moves, scales and fades. It is drawn once
        // into its own <svg> at (x, y) and set({x, y, s, o}) moves it on the compositor, so it is never
        // repainted. Draw it at the largest size it is shown: s ≤ 1 keeps it sharp.
        L.sprite = (markup, x = 800, y = 500) => {
          const sv = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          sv.setAttribute('preserveAspectRatio', 'none');
          sv.setAttribute('class', 'sprite');
          sv.__L = L;
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', 'piece');
          if (filt && SHADOW === 'blur') g.setAttribute('filter', `url(#${shadowFilter(L.sh)})`);
          g.setAttribute('transform', `translate(${x} ${y})`);
          g.innerHTML = markup;
          sv.appendChild(g);
          L.el.appendChild(sv);
          const sp = { bx: x, by: y, x, y, s: 1, o: 1, sv, key: '' };
          sp.set = ({ x = sp.bx, y = sp.by, s = 1, o = 1 } = {}) => {
            Object.assign(sp, { x, y, s, o: clamp(o) });
            placeSprite(sv);
          };
          sv.__sprite = sp;
          return sp;
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
      view: () => ({ x0: 800 - W / 2 / K, x1: 800 + W / 2 / K, y0: CY - HL / 2 / K, y1: CY + HL / 2 / K }),
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
      const hw = W / 2 / (K * zmin) + m, hh = HL / 2 / (K * zmin) + m;
      const x0 = 800 + p * camR.x[0] - hw, x1 = 800 + p * camR.x[1] + hw;
      const y0 = CY + p * camR.y[0] - hh, y1 = CY + p * camR.y[1] + hh + (L.sky ? 0 : 120 / K);
      L.box = [x0, y0, x1, y1];
      const w = (x1 - x0) * K, h = (y1 - y0) * K;
      L.el.style.width = w + 'px';
      L.el.style.height = h + 'px';
      if (L.blur) L.el.style.filter = `blur(${(L.blur * K).toFixed(2)}px)`;
      L.lastT = '';
    }
    e.built.fitted = false;
  }

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
      const tx = W / 2 - (cx - x0 - Ly.sx) * K * zl;
      const ty = H / 2 - (cy - y0 - Ly.sy) * K * zl + dy;
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
      // editorial brackets are dimmed: [added words] and <textual variants> (Mk 9,29 «<i postem>»).
      // They can span several words, so remember whether a word starts inside one.
      // a bracket may also close a variant that opened in the previous verse (J 5,3–4 «<…»)
      const firstClose = s.text.search(/[\]>]/), firstOpen = s.text.search(/[\[<]/);
      let closer = firstClose >= 0 && (firstOpen < 0 || firstClose < firstOpen) ? s.text[firstClose] : '';
      s.text.split(/\s+/).forEach((w) => {
        let out = closer ? '<span class="br">' : '';
        for (const ch of w) {
          const esc = ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch;
          if (!closer && (ch === '[' || ch === '<')) { closer = ch === '[' ? ']' : '>'; out += '<span class="br">' + esc; }
          else if (closer && ch === closer) { closer = ''; out += esc + '</span>'; }
          else out += esc;
        }
        if (closer) out += '</span>';
        html.push(`<span class="w">${out}</span> `);
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
    const time = reduced ? 0 : now / 1000;

    let capE = null, capB = -1, capP = 0;
    timeline.forEach((e, i) => {
      const t = localT(e, g);
      const n = e.beats.length;
      const active = t > -PAD && (t < n + PAD || i === timeline.length - 1); // the last set stays up behind the closing card
      const vis = active || (i === 0 && t <= 0);
      // normally prebuild() has the scene ready long before; build it here only if the reader outran it
      if (vis) { if (!e.built) build(e); } else if (e.built && (g < e.start - 14 || g > e.end + 14)) destroy(e);
      if (!e.built) return;
      if (vis !== e.built.shown) { e.built.el.style.visibility = vis ? '' : 'hidden'; e.built.shown = vis; }
      if (!vis) return;
      e.built.update(clamp(t, -PAD, n + PAD), time);
      if (!e.built.fitted) ready(e);
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
    tagEl.classList.toggle('gone', g < Math.max(0.3, opening.start - 0.1)); // …and the hanging tag only once the play is on
    endEl.classList.toggle('on', g > total - 0.9);
    liftLive();
  }

  /* ---------- getting scenes ready off-stage ----------
     The scenes around the reader are built, posed at their entrance, fitted and their grain
     merged while nothing else is going on, one step per slot, so crossing into a scene costs no
     more than its first paint. Safari has no requestIdleCallback: there a step waits for a pause
     in scrolling, unless the scene is about to come on stage. */
  let lastScroll = -1e9;
  addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
  const idle = window.requestIdleCallback
    ? (fn) => requestIdleCallback(fn, { timeout: 1000 })
    : (fn) => setTimeout(() => fn({ timeRemaining: () => (performance.now() - lastScroll > 200 ? 12 : 0), didTimeout: false }), 70);
  // Walk the scene through its beats (and a little idle time) off-stage, so every piece that will move
  // is marked to be lifted into its own layer in one batch, instead of splitting a sheet on stage
  // mid-scroll. Everything the walk writes is then undone: the scene starts exactly as it would have.
  function walk(e) {
    const B = e.built, n = e.beats.length, now = reduced ? 0 : performance.now() / 1000;
    const journal = (hooks.journal = []), cam = { ...B.cam }, lay = B.layers.map((L) => [L.sx, L.sy, L.alpha]);
    const sprites = [...B.el.querySelectorAll('svg.sprite')].map((sv) => [sv, { ...sv.__sprite }]);
    try { for (let t = -PAD; t <= n + PAD + 1e-6; t += 0.25) { B.update(t, reduced ? 0 : now + (t + PAD) * 0.37); frameNo++; } }
    finally { hooks.journal = null; }
    rollback(journal);
    Object.assign(B.cam, cam);
    B.layers.forEach((L, i) => { [L.sx, L.sy, L.alpha] = lay[i]; });
    sprites.forEach(([sv, sp]) => { Object.assign(sv.__sprite, sp, { key: '' }); placeSprite(sv); });
    B.walked = true;
  }
  // pose it where it enters, lift what moves, fit every sheet and merge the grain
  function ready(e) {
    const B = e.built;
    if (!B.walked) walk(e);
    B.update(clamp(localT(e, g), -PAD, e.beats.length + PAD), reduced ? 0 : performance.now() / 1000); frameNo++;
    liftLive(true);
    fitAll(e);
  }
  function prebuild(deadline) {
    // nearest first, looking ahead more than behind
    const next = timeline.filter((e) => !(e.built && e.built.fitted) && e.start < g + 12 && e.end > g - 6)
      .sort((a, b) => Math.abs(a.start - g - 1) - Math.abs(b.start - g - 1))[0];
    if (next) {
      const soon = next.start - g < 2.5 && next.end > g - 1.5;
      // one step per slot: build, walk, then ready
      if (soon || deadline.didTimeout || deadline.timeRemaining() > 4) { if (!next.built) build(next); else if (!next.built.walked) walk(next); else ready(next); }
    }
    idle(prebuild);
  }
  idle(prebuild);

  measure();
  buildRail();
  let rT = 0;
  addEventListener('resize', () => {
    H = innerHeight; // re-centre straight away (compositor only)
    clearTimeout(rT);
    rT = setTimeout(() => {
      if (innerWidth === W && tallH() === HL) return; // only a toolbar moved: nothing to rebuild, and no scroll jump
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
  // straight into the play: stand at the first sentence, then let its words come in
  // put the reader at t at once (no glide through everything in between)
  function seek(t) { scrollTo(0, t * unitPx); g = t; step(); step(); }
  function enter() {
    seek(opening.start);
    setTimeout(() => scrollTo({ top: (opening.start + Math.min(0.55, opening.len * 0.5)) * unitPx, behavior: reduced ? 'auto' : 'smooth' }), 650);
  }
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

  return { timeline, get g() { return g; }, unitPx: () => unitPx, go, step, verse, nextBeat, turnTo, enter, seek };
}
