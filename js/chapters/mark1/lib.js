// Mark 1 — local cut-outs and helpers shared by this chapter's scenes.
// Everything is drawn with the seeded cutter + sheet(), like js/assets/*.
import { C, sheet, shade, mix, pose, CAST, crowd, person } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { paperLabel } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';

const PI = Math.PI;
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- cast ---------- */
export const JOHN_B = { robe: '#b98f63', fur: true, belt: C.leather, hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin3 };
export const ZEBEDEE = { robe: C.tealRobe, mantle: C.stone, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };
export const MIL = { robe: C.roseRobe, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.greyHair, skin: C.skin2, belt: null }; // Simon's mother-in-law
export const LEPER = { robe: '#b7b2a6', mantle: '#9c978c', hair: C.greyHair, hairStyle: 'wrap', veil: '#a8a397', beard: 'short', beardColor: '#8f8a80', skin: '#c9bfae', belt: null };
export const SCRIBE = { robe: C.plumRobe, mantle: C.stone2, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin2 };

/** approximate position of a puppet's front hand (arm raised `a` degrees) */
export function hand(x, y, s, flip, a, lean = 0, dy = 0) {
  const r = (a * PI) / 180, l = (lean * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dy - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  const rx = hx * Math.cos(l) - hy * Math.sin(l), ry = hx * Math.sin(l) + hy * Math.cos(l);
  return [x + (flip ? -1 : 1) * rx * s, y + ry * s];
}
/** head centre of a standing puppet */
export const headAt = (x, y, s, flip = false, dy = 0) => [x + (flip ? -2 : 2) * s, y + (-167 + dy) * s];

/** object on two strings (a banner, a scroll, a map) */
export function hang2(inner, half, len = 400, color = 'rgba(74,54,34,.55)') {
  return `<g class="hang"><path d="M${-half} ${-len - 1400}V0M${half} ${-len - 1400}V0" stroke="${color}" stroke-width="1.2" fill="none"/><g class="obj">${inner}</g></g>`;
}

/* ---------- voice: arcs that ripple out from a mouth ---------- */
export function voiceRings(L, c, { n = 3, color = shade(C.ochre, 0.25), r = 40, w = 5, both = true } = {}) {
  const els = [];
  for (let i = 0; i < n; i++) {
    els.push({ el: L.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, r, r, -0.55, 0.55, 10), w)}" fill="${color}"/></g>`), side: 1, i });
    if (both) els.push({ el: L.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, r, r, PI - 0.55, PI + 0.55, 10), w)}" fill="${color}"/></g>`), side: -1, i });
  }
  return (x, y, on, time, { spread = 2.4, speed = 0.45, s0 = 0.8, off = 6, dir = 0 } = {}) => {
    els.forEach(({ el, side, i }) => {
      if (on <= 0.001) { pose(el, { x, y, o: 0 }); return; }
      if (dir && side !== dir) { pose(el, { x, y, o: 0 }); return; }
      const k = time ? (time * speed + i / n) % 1 : (i + 1) / (n + 0.5);
      pose(el, { x: x + side * off, y, s: s0 + k * spread, o: on * (1 - k) * 0.95 });
    });
  };
}

/* ---------- Isaiah's scroll: parchment that unrolls between two rods ---------- */
export function scrollParts(c, { w = 360, h = 190, title = '', lines = 7 } = {}) {
  const rod = (ww) => sheet()
    .p(c.cut([[-ww / 2, -9], [ww / 2, -9], [ww / 2, 9], [-ww / 2, 9]], 0.3, 6), C.parchment)
    .p(c.cut([[-ww / 2 - 2, -5], [-ww / 2 - 26, -5], [-ww / 2 - 26, 5], [-ww / 2 - 2, 5]], 0.2, 5) + c.cut([[ww / 2 + 2, -5], [ww / 2 + 26, -5], [ww / 2 + 26, 5], [ww / 2 + 2, 5]], 0.2, 5), C.wood2)
    .p(c.cut(c.ell(-ww / 2 - 30, 0, 6, 11, 10), 0.2, 3) + c.cut(c.ell(ww / 2 + 30, 0, 6, 11, 10), 0.2, 3), C.wood)
    .x(c.ribbon([[-ww / 2, 3], [ww / 2, 3]], 2), shade(C.parchment, -0.18)).out();
  const s = sheet();
  s.p(c.cut([[-w / 2 + 4, 0], [w / 2 - 4, 0], [w / 2 - 6, h], [-w / 2 + 6, h]], 0.5, 8), C.parchment);
  let ln = '';
  const y0 = title ? 62 : 22;
  for (let i = 0; i < lines; i++) {
    const y = y0 + i * ((h - y0 - 14) / lines);
    let x = -w / 2 + 26;
    const end = w / 2 - 26 - (i === lines - 1 ? w * 0.35 : c.rr(0, 30));
    while (x < end) { const l = Math.min(end - x, c.rr(18, 54)); ln += c.ribbon([[x, y + c.rr(-0.6, 0.6)], [x + l, y + c.rr(-0.6, 0.6)]], 2.2); x += l + c.rr(7, 11); }
  }
  s.x(ln, C.ink, 'opacity=".5"');
  s.x(c.ribbon([[-w / 2 + 14, 8], [-w / 2 + 14, h - 8]], 1.2) + c.ribbon([[w / 2 - 14, 8], [w / 2 - 14, h - 8]], 1.2), C.terracotta, 'opacity=".35"');
  const t = title ? `<text x="0" y="42" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">${title}</text>` : '';
  return { rod: rod(w), sheet: s.out() + t };
}

/* ---------- birds of the Spirit ---------- */
/** a white dove seen from the side with two flapping wings (.wingF / .wingB), facing right */
export function dove(c, { k, color = '#fbf7ee', shadow = '#e3dccd' } = {}) {
  const s = sheet();
  s.p(c.cut([[-40, -2], [-30, -6], [-14, -10], [4, -12], [16, -10], [22, -4], [16, 4], [2, 8], [-14, 8], [-28, 4]], 0.3, 4), color);
  s.p(c.cut([[-38, -2], [-58, -12], [-60, -2], [-58, 8], [-36, 4]], 0.3, 4), shadow); // tail
  s.p(c.cut(c.circ(22, -12, 9, 14), 0.2, 3), color);
  s.x(c.poly([[30, -13], [38, -10], [30, -8]]), C.ochre);
  s.x(c.poly(c.circ(24, -14, 1.6, 6)), C.ink);
  s.x(c.poly(c.circ(24, -8, 3, 8)), C.blush, 'opacity=".35"');
  const wing = (col) => `<path d="${c.cut([[0, 0], [-8, -26], [-22, -46], [-40, -54], [-34, -38], [-30, -20], [-14, -4]], 0.4, 4)}" fill="${col}"/><path d="${c.ribbon([[-10, -12], [-30, -44]], 1.2)}" fill="${shadow}"/>`;
  return `<g${k_(k)} class="bird"><g class="wingB" transform="translate(-4 -8)">${wing(shadow)}</g>${s.out()}<g class="wingF" transform="translate(-4 -6)">${wing(color)}</g></g>`;
}
export function flapWings(el, time, amp = 34, speed = 7, base = 0) {
  const f = Math.sin(time * speed) * amp + base;
  pose(el.querySelector('.wingF'), { x: -4, y: -6, r: f });
  pose(el.querySelector('.wingB'), { x: -4, y: -8, r: f * 0.8 + 8 });
}

/* ---------- desert things ---------- */
export function acacia(c, x, y, sc = 1, { trunk = C.wood2, leaf = C.olive } = {}) {
  const s = sheet();
  s.p(c.cut([[x - 6 * sc, y], [x - 4 * sc, y - 50 * sc], [x - 40 * sc, y - 88 * sc], [x - 34 * sc, y - 92 * sc], [x, y - 62 * sc], [x + 30 * sc, y - 96 * sc], [x + 36 * sc, y - 92 * sc], [x + 6 * sc, y - 50 * sc], [x + 7 * sc, y]], 0.6, 6), trunk);
  s.p(c.cut([...c.arc(x, y - 96 * sc, 92 * sc, 26 * sc, PI, 2 * PI, 12), [x + 86 * sc, y - 90 * sc], [x - 86 * sc, y - 90 * sc]], 1.4, 6), leaf);
  s.x(c.ribbon([[x - 80 * sc, y - 92 * sc], [x + 80 * sc, y - 93 * sc]], 3 * sc), shade(leaf, -0.2), 'opacity=".6"');
  return s.out();
}
export function scrub(c, x, y, w = 40, color = C.olive) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i + 0.5) / 9 * PI, l = w * c.rr(0.5, 0.8); d += c.ribbon([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l * 0.8]], 2.4); }
  d += c.cut(c.blob(x, y - w * 0.25, w * 0.45, w * 0.22, 10, 0.25), 0.6, 5);
  return sheet().p(d, color).out();
}
/** a walled city on a hill (Jerusalem): returns markup */
export function walledCity(c, x, y, sc = 1, { wall = C.stone, wall2 = C.stone2, temple = C.cream } = {}) {
  const s = sheet();
  const W = 190 * sc, H = 44 * sc;
  // the temple rises above the walls
  s.p(c.cut(c.rect(x - 34 * sc, y - H - 64 * sc, 68 * sc, 64 * sc), 0.4, 6), temple);
  s.p(c.cut(c.rect(x - 40 * sc, y - H - 70 * sc, 80 * sc, 8 * sc), 0.3, 6), C.sun);
  let cols = '';
  for (let i = 0; i < 5; i++) cols += c.cut(c.rect(x - 28 * sc + i * 13 * sc, y - H - 56 * sc, 4 * sc, 40 * sc), 0.2, 4);
  s.x(cols, shade(temple, -0.15));
  // houses peeking over the wall
  let hs = '';
  for (let i = 0; i < 7; i++) { const hx = x - W / 2 + 10 * sc + i * 26 * sc, hh = c.rr(16, 34) * sc; if (Math.abs(hx - x) < 40 * sc) continue; hs += c.cut(c.rect(hx, y - H - hh, 22 * sc, hh + 4), 0.3, 5); }
  s.p(hs, C.plaster);
  // wall with crenellations and towers
  const pts = [[x - W / 2, y], [x - W / 2, y - H]];
  for (let xx = x - W / 2; xx < x + W / 2 - 8 * sc; xx += 16 * sc) pts.push([xx, y - H], [xx, y - H - 7 * sc], [xx + 8 * sc, y - H - 7 * sc], [xx + 8 * sc, y - H]);
  pts.push([x + W / 2, y - H], [x + W / 2, y]);
  s.p(c.cut(pts, 0.3, 6), wall);
  s.p(c.cut(c.rect(x - W / 2 - 12 * sc, y - H - 22 * sc, 26 * sc, H + 22 * sc), 0.3, 5) + c.cut(c.rect(x + W / 2 - 14 * sc, y - H - 22 * sc, 26 * sc, H + 22 * sc), 0.3, 5), wall2);
  s.x(c.cut([[x - 12 * sc, y], [x - 12 * sc, y - 22 * sc], ...c.arc(x, y - 22 * sc, 12 * sc, 12 * sc, PI, 2 * PI, 6), [x + 12 * sc, y]], 0.2, 4), C.soilDark);
  return s.out();
}

/* ---------- words ---------- */
/** a paper speech bubble with a word or two; tail points down-left (or right with flip) */
export function bubble(text, { size = 26, fill = C.cream, ink = C.ink, w, k, flip = false, jag = false, c } = {}) {
  const ww = w || size * (0.56 * String(text).length + 1.3), hh = size * 1.7;
  let d;
  if (jag && c) {
    const p = [];
    const n = Math.max(20, Math.round(ww / 14) * 2);
    for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2, r = i % 2 ? 1 : 1.1; p.push([Math.cos(a) * (ww * 0.55 + 10) * r, Math.sin(a) * hh * 0.62 * (i % 2 ? 1 : 1.22)]); }
    d = c.poly(p);
  } else {
    const p = [];
    for (let i = 0; i < 24; i++) { const a = (i / 24) * PI * 2; p.push([Math.cos(a) * ww / 2, Math.sin(a) * hh / 2]); }
    d = 'M' + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
  }
  const sx = flip ? -1 : 1;
  const tail = `M${sx * -ww * 0.18} ${hh * 0.34}L${sx * -ww * 0.36} ${hh * 0.86}L${sx * -ww * 0.02} ${hh * 0.42}Z`;
  return `<g${k_(k)} class="label"><path d="${tail}" fill="${fill}"/><path d="${d}" fill="${fill}"/><path class="grain" d="${d}"/><text x="0" y="${size * 0.34}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${ink}">${text}</text></g>`;
}
export { paperLabel };

/** little sparkle star */
export function sparkle(c, r = 18, color = C.star) {
  return `<path d="${c.poly(c.star(0, 0, r, r * 0.22, 4, 0))}" fill="${color}"/><path d="${c.poly(c.star(r * 0.9, -r * 0.8, r * 0.4, r * 0.1, 4, 0.4))}" fill="${color}"/>`;
}

/* ---------- John's world: camel, honey, locusts, shell, sins ---------- */
const CAMEL = '#c79d68';
/** a camel facing right; .legF / .legB groups swing for walking */
export function camel(c, { k, color = CAMEL } = {}) {
  const dk = shade(color, -0.18);
  const leg = (x, col) => `<path d="${c.cut([[x - 6, -112], [x + 7, -112], [x + 5, -60], [x + 6, -4], [x + 12, 0], [x - 4, 0], [x - 5, -60]], 0.4, 6)}" fill="${col}"/>`;
  const s = sheet();
  s.p(c.cut([...c.arc(-4, -122, 74, 34, PI * 0.95, PI * 2.05, 16), ...c.arc(-4, -122, 70, 16, 0.1, PI - 0.1, 8)], 0.8, 6), color);
  s.p(c.cut([...c.arc(-12, -140, 44, 46, PI * 1.05, PI * 1.95, 12)], 0.8, 6), color);
  s.p(c.ribbon(c.cbez([56, -128], [82, -128], [86, -168], [98, -190], 10), (t) => 26 - t * 10), color);
  s.p(c.cut([[88, -200], [106, -206], [128, -198], [134, -188], [124, -182], [100, -180], [88, -186]], 0.5, 5), color);
  s.p(c.cut([[92, -204], [96, -214], [100, -204]], 0.2, 3), dk);
  s.x(c.poly(c.circ(112, -198, 2, 6)), C.ink);
  s.x(c.ribbon([[-76, -128], [-84, -96]], 4), dk);
  s.x(c.ribbon(c.arc(-4, -126, 60, 20, 0.3, PI - 0.3, 10), 3), dk, 'opacity=".5"');
  // saddle blanket
  s.p(c.cut([[-40, -150], [20, -154], [26, -112], [-44, -110]], 0.5, 6), C.terracotta);
  s.x(c.ribbon([[-42, -122], [24, -124]], 4), C.wheat);
  return `<g${k_(k)}><g class="legB">${leg(-44, dk)}${leg(40, dk)}</g>${s.out()}<g class="legF">${leg(-30, color)}${leg(54, color)}</g></g>`;
}
export function walkCamel(el, ph, amt = 1) {
  const a = Math.sin(ph) * 14 * amt;
  pose(el.querySelector('.legF'), { r: a, ox: 0, oy: -112, y: -112 });
  pose(el.querySelector('.legB'), { r: -a, ox: 0, oy: -112, y: -112 });
}
export function honeycomb(c, w = 60, h = 46) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, 0, w / 2, h * 0.5, PI, 2 * PI, 12), [w / 2, 4], [w * 0.3, h * 0.5], [w * 0.1, h * 0.72], [-w * 0.06, h * 0.55], [-w * 0.3, h * 0.46], [-w / 2, 4]], 0.5, 5), C.sun);
  let hex = '';
  for (let y = -h * 0.35; y < h * 0.4; y += 9) for (let x = -w * 0.4; x < w * 0.4; x += 10) {
    const xx = x + ((Math.round(y / 9) % 2) ? 5 : 0);
    if ((xx * xx) / (w * w * 0.2) + (y * y) / (h * h * 0.2) > 1) continue;
    hex += c.poly(Array.from({ length: 6 }, (_, i) => [xx + Math.cos(i * PI / 3 + PI / 6) * 3.6, y + Math.sin(i * PI / 3 + PI / 6) * 3.6]));
  }
  s.x(hex, shade(C.sun, -0.2), 'opacity=".8"');
  s.x(c.cut(c.ell(w * 0.1, h * 0.8, 3, 5, 8), 0.2, 3), C.sun);
  return s.out();
}
export function bee(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, 7, 4.6, 12), 0.2, 2), C.sun);
  s.x(c.ribbon([[-1.5, -4.5], [-1.5, 4.5]], 2) + c.ribbon([[3, -4], [3, 4]], 1.8), C.ink);
  s.x(c.poly(c.ell(-1, -7, 4, 3, 8, -0.4)) + c.poly(c.ell(2, -7.5, 3.4, 2.6, 8, 0.4)), '#fbf7ee', 'opacity=".85"');
  return s.out();
}
export function locust(c, { color = C.olive } = {}) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-18, -6], [4, -8], [14, -6], [18, 0], [10, 4], [-14, 4]], 0.3, 4), color);
  s.p(c.cut([[-24, -3], [-2, -11], [14, -9], [-4, -4]], 0.3, 4), shade(color, -0.2));
  s.p(c.cut(c.ell(18, -2, 6, 5, 10), 0.2, 3), color);
  s.x(c.poly(c.circ(20, -3.5, 1.4, 6)), C.ink);
  s.p(c.ribbon([[0, -2], [-12, -16], [-22, 4]], 3), shade(color, -0.1));
  s.x(c.ribbon([[6, 3], [8, 10]], 1.4) + c.ribbon([[12, 3], [15, 10]], 1.4) + c.ribbon([[20, -6], [34, -20]], 0.8), shade(color, -0.3));
  return s.out();
}
export function shell(c, r = 16, color = C.blushVeil) {
  const s = sheet();
  s.p(c.cut([[0, r * 0.35], ...c.arc(0, 0, r, r * 0.9, PI * 1.08, PI * 1.92, 12)], 0.3, 3), color);
  let ribs = '';
  for (let i = 0; i < 7; i++) { const a = PI * (1.14 + i * 0.12); ribs += c.ribbon([[0, r * 0.3], [Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.8]], 1.3); }
  s.x(ribs, shade(color, -0.2));
  s.p(c.cut([[-5, r * 0.25], [5, r * 0.25], [3, r * 0.45], [-3, r * 0.45]], 0.2, 3), shade(color, -0.1));
  return s.out();
}
/** a dark crumpled scrap of paper — a sin, confessed and carried away */
export function scrap(c, r = 16, color = '#4a3a33') {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.75, 8, 0.35), 1.2, 4), color);
  s.x(c.ribbon([[-r * 0.5, -r * 0.2], [0, r * 0.1], [r * 0.4, -r * 0.3]], 1.2), shade(color, 0.25), 'opacity=".6"');
  return s.out();
}
export function drops(c, n = 5, color = C.lake) {
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut([[0, -6], [3.2, 1], [0, 4], [-3.2, 1]].map(([x, y]) => [x + (i - n / 2) * 5, y + (i % 2) * 7]), 0.1, 3);
  return `<path d="${d}" fill="${color}"/>`;
}
/** a little hanging museum tag: word on paper + a thin pointer line */
export function tagOnString(text, { size = 22, len = 500, dx = 0, dy = 40 } = {}) {
  const pointer = dx || dy ? `<path d="M0 ${size * 0.7}L${dx} ${dy}" stroke="${C.inkSoft}" stroke-width="1.3" stroke-dasharray="3 3" fill="none" opacity=".7"/><circle cx="${dx}" cy="${dy}" r="3" fill="${C.inkSoft}" opacity=".7"/>` : '';
  return `<g class="hang"><path d="M0 ${-len - 1400}V${-size * 0.6}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${pointer}${paperLabel(text, { size })}</g></g>`;
}

/* ---------- the sandal of the one who is mightier ---------- */
/** a big sandal seen from above, standing upright like a painted flat (toe up, heel at y=0);
 *  its untied thong hangs from the left edge as .thong (pivot at the knot) */
export function sandalBig(c, h = 380) {
  const w = h * 0.4, s = sheet();
  const soleOf = (k) => [
    ...c.arc(0, -w * 0.42, w * 0.4 * k, w * 0.42 * k, 0.05, PI - 0.05, 10),
    [-w * 0.42 * k, -h * 0.4], [-w * 0.5 * k, -h * 0.62], [-w * 0.52 * k, -h * 0.76],
    ...c.arc(-w * 0.04, -h * 0.82, w * 0.48 * k, h * 0.17 * k, PI, 2 * PI, 12),
    [w * 0.44 * k, -h * 0.72], [w * 0.36 * k, -h * 0.55], [w * 0.34 * k, -h * 0.4], [w * 0.4 * k, -w * 0.42],
  ];
  s.p(c.cut(soleOf(1), 0.7, 8), C.leather);
  s.p(c.cut(soleOf(0.86).map(([x, y]) => [x, y * 0.97 - h * 0.012]), 0.5, 8), C.wood3);
  let stitch = '';
  soleOf(0.93).forEach(([x, y], i) => { if (i % 2) stitch += c.poly(c.circ(x, y * 0.985 - h * 0.006, 1.8, 5)); });
  s.x(stitch, shade(C.leather, -0.2), 'opacity=".7"');
  // a toe loop, two straps crossing over the instep, a heel strap
  const st = c.ribbon(c.arc(-w * 0.18, -h * 0.8, w * 0.13, h * 0.05, 0, PI * 2, 14), 7)
    + c.ribbon([[-w * 0.5, -h * 0.64], [0, -h * 0.52], [w * 0.4, -h * 0.4]], 16, 0.8)
    + c.ribbon([[w * 0.42, -h * 0.66], [0, -h * 0.53], [-w * 0.44, -h * 0.38]], 16, 0.8)
    + c.ribbon([[-w * 0.44, -h * 0.2], [0, -h * 0.17], [w * 0.4, -h * 0.2]], 15, 0.8);
  s.p(st, shade(C.leather, -0.18));
  s.p(c.cut(c.circ(0, -h * 0.525, 9, 12), 0.3, 3) + c.cut(c.circ(-w * 0.46, -h * 0.4, 7, 10), 0.3, 3), C.sandal);
  const thong = sheet().p(c.ribbon(c.cbez([0, 0], [-26, 30], [4, 70], [-18, 116], 12), 6, 0.4), shade(C.leather, -0.05))
    .p(c.ribbon(c.cbez([0, 0], [16, 34], [-12, 76], [8, 128], 12), 6, 0.4), shade(C.leather, -0.2))
    .p(c.cut(c.blob(0, 2, 8, 6, 8, 0.2), 0.3, 3), shade(C.leather, -0.1)).out();
  return `${s.out()}<g class="thong" transform="translate(${-w * 0.46} ${-h * 0.4})">${thong}</g>`;
}
export function footprint(c, left = true) {
  const sx = left ? 1 : -1;
  return `<path d="${c.cut([[-18, -3 * sx], [-6, -8 * sx], [10, -7 * sx], [20, -3 * sx], [18, 4 * sx], [4, 6 * sx], [-14, 5 * sx]], 0.3, 4)}" fill="${shade(C.sand2, -0.3)}"/>`;
}
/** a tongue of fire */
export function flame(c, h = 34, color = C.lampFlame, inner = '#fff4d2') {
  return `<path d="M0 0C${-h * 0.3} ${-h * 0.2} ${-h * 0.26} ${-h * 0.6} 0 ${-h}C${h * 0.26} ${-h * 0.6} ${h * 0.3} ${-h * 0.2} 0 0Z" fill="${color}"/><path d="M0 ${-h * 0.08}C${-h * 0.12} ${-h * 0.22} ${-h * 0.12} ${-h * 0.4} 0 ${-h * 0.58}C${h * 0.12} ${-h * 0.4} ${h * 0.12} ${-h * 0.22} 0 ${-h * 0.08}Z" fill="${inner}"/>`;
}
/** a round hanging plate with an icon */
export function plate(c, icon, { r = 54, fill = C.cream, rim = C.haloRim } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), fill).out() + icon;
}

/** a wooden signpost with a name board (the name goes through paperLabel-style text) */
export function signpost(c, text, { size = 20, dir = 1 } = {}) {
  const w = size * (0.56 * String(text).length + 1.6), h = size * 1.5;
  const s = sheet();
  s.p(c.cut(c.rect(-4, -110, 8, 112), 0.3, 6), C.wood2);
  const pts = dir > 0 ? [[-w / 2, -104], [w / 2, -104], [w / 2 + 14, -104 + h / 2], [w / 2, -104 + h], [-w / 2, -104 + h]] : [[w / 2, -104], [-w / 2, -104], [-w / 2 - 14, -104 + h / 2], [-w / 2, -104 + h], [w / 2, -104 + h]];
  s.p(c.cut(pts, 0.4, 6), C.wood3);
  return s.out() + `<text x="${dir * 4}" y="${-104 + h * 0.5 + size * 0.34}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** jagged tear line (x offsets around 0) sampled from y0 to y1 */
export function tearLine(c, y0, y1, { step = 16, jag = 9, amp = 34 } = {}) {
  const w = c.wave(0, [amp, amp * 0.4], [900, 260]);
  const pts = [];
  for (let y = y0; y <= y1; y += step) pts.push([w(y) + c.rr(-jag, jag), y]);
  return pts;
}

/* ---------- wild animals, resting peacefully (all face right, feet at y=0) ---------- */
export function lion(c) {
  const fur = C.ochre, mane = shade(C.clay, -0.05), s = sheet();
  s.p(c.ribbon(c.cbez([-70, -30], [-110, -30], [-110, -4], [-128, -8], 10), 6), fur);
  s.p(c.cut(c.blob(-128, -9, 9, 7, 8, 0.2), 0.4, 3), mane);
  s.p(c.cut([[-80, 0], [-84, -30], [-60, -46], [20, -48], [50, -40], [60, -12], [56, 0]], 0.7, 6), fur);
  s.p(c.cut([[20, 0], [70, -2], [84, 2], [80, 6], [20, 6]], 0.4, 4) + c.cut([[-40, 0], [4, -2], [16, 2], [10, 6], [-40, 6]], 0.4, 4), shade(fur, -0.1));
  s.p(c.cut(c.star(62, -52, 38, 28, 14, 0.2), 1.2, 4), mane);
  s.p(c.cut(c.ell(70, -50, 22, 20, 16), 0.4, 4), fur);
  s.p(c.cut(c.ell(84, -42, 11, 8, 12), 0.3, 3), C.sand);
  s.x(c.poly([[88, -46], [94, -44], [90, -40]]), C.ink);
  s.x(c.ribbon(c.arc(72, -56, 4, 3, PI + 0.3, 2 * PI - 0.3, 5), 1.6) + c.ribbon(c.arc(86, -58, 3.4, 3, PI + 0.3, 2 * PI - 0.3, 5), 1.6), C.inkSoft);
  s.p(c.cut(c.circ(56, -70, 7, 10), 0.3, 3), fur);
  return s.out();
}
export function ibex(c) {
  const col = C.dune, dk = shade(col, -0.2), s = sheet();
  s.p(c.ribbon(c.cbez([52, -80], [44, -118], [8, -124], [4, -96], 14), (u) => 7 - u * 4.5), shade(C.soil, 0.15));
  s.p(c.ribbon(c.cbez([56, -80], [52, -112], [22, -120], [16, -100], 12), (u) => 5 - u * 3), shade(C.soil, 0.3));
  s.p(c.cut(c.blob(-4, -24, 54, 26, 16, 0.06).map(([x, y]) => [x, Math.min(y, 0)]), 0.6, 5), col);
  s.p(c.ribbon([[30, -30], [46, -58], [56, -70]], 18), col);
  s.p(c.cut(c.ell(64, -74, 15, 9, 12, 0.35), 0.4, 4), col);
  s.p(c.cut([[50, -80], [40, -92], [54, -84]], 0.2, 3), dk);
  s.x(c.poly(c.circ(64, -77, 2, 6)), C.ink);
  s.p(c.ribbon([[26, -6], [52, -4], [58, 0]], 6) + c.ribbon([[-44, -4], [-20, -2], [-12, 1]], 6), dk);
  s.x(c.ribbon([[-40, -8], [30, -8]], 7), C.cream, 'opacity=".55"');
  s.p(c.cut([[-56, -24], [-66, -30], [-60, -18]], 0.2, 3), dk);
  return s.out();
}
export function fox(c) {
  const col = C.clay, s = sheet();
  s.p(c.ribbon(c.cbez([-20, -8], [-60, -4], [-70, -30], [-56, -44], 12), (u) => 8 + Math.sin(u * PI) * 8), col);
  s.p(c.cut(c.ell(-60, -44, 6, 8, 8), 0.2, 3), C.cream);
  s.p(c.cut([[-26, 0], [-30, -30], [-10, -62], [10, -66], [18, -40], [16, 0]], 0.6, 5), col);
  s.p(c.cut([[0, -60], [4, -86], [14, -70], [22, -88], [26, -66], [40, -56], [22, -50], [4, -52]], 0.4, 4), col);
  s.p(c.cut([[4, -58], [24, -56], [38, -56], [20, -46]], 0.3, 3), C.cream);
  s.x(c.poly(c.circ(38, -57, 2.2, 6)), C.ink);
  s.x(c.ribbon(c.arc(20, -64, 3, 2, PI + 0.3, 2 * PI - 0.3, 5), 1.5), C.inkSoft);
  s.p(c.cut([[-8, -40], [8, -44], [14, -4], [-4, -2]], 0.3, 4), C.cream);
  return s.out();
}
export function hare(c) {
  const col = C.sand2, s = sheet();
  s.p(c.cut(c.blob(-8, -20, 26, 20, 12, 0.08).map(([x, y]) => [x, Math.min(y, 0)]), 0.5, 4), col);
  s.p(c.cut(c.ell(20, -34, 13, 11, 12), 0.3, 3), col);
  s.p(c.cut(c.ell(12, -60, 5, 18, 10, -0.3), 0.3, 3) + c.cut(c.ell(20, -60, 5, 18, 10, 0.1), 0.3, 3), col);
  s.x(c.poly(c.ell(13, -60, 2, 12, 8, -0.3)), C.blush, 'opacity=".6"');
  s.p(c.cut(c.circ(-34, -18, 7, 8), 0.3, 3), C.cream);
  s.x(c.poly(c.circ(26, -36, 1.8, 6)), C.ink);
  return s.out();
}
export function snake(c) {
  const col = C.olive, s = sheet();
  s.p(c.ribbon(c.arc(0, -6, 30, 10, 0, PI * 2, 20), 9), col);
  s.p(c.ribbon(c.arc(0, -16, 20, 7, 0, PI * 2, 16), 8), shade(col, 0.1));
  s.p(c.ribbon(c.qbez([12, -20], [30, -36], [22, -50], 8), (u) => 8 - u * 2), col);
  s.p(c.cut(c.ell(26, -52, 9, 6, 10, 0.4), 0.3, 3), col);
  s.x(c.poly(c.circ(29, -54, 1.6, 6)), C.ink);
  s.x(c.ribbon([[-24, -8], [-10, -4]], 2) + c.ribbon([[10, -4], [24, -8]], 2), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}
/** a pair of feathered wings (behind a puppet's shoulders, which sit at y≈-140 in person coordinates) */
export function wings(c, { color = '#fbf7ee', shadow = '#e5ddd0' } = {}) {
  const w = (dir, col) => {
    const pts = [[0, 0], [-dir * 20, -30], [-dir * 50, -66], [-dir * 86, -78], [-dir * 76, -54], [-dir * 90, -44], [-dir * 70, -26], [-dir * 80, -12], [-dir * 50, 0], [-dir * 56, 16], [-dir * 20, 12]];
    let feathers = '';
    for (let i = 0; i < 4; i++) feathers += c.ribbon([[-dir * (20 + i * 14), -8 - i * 10], [-dir * (46 + i * 12), -30 - i * 12]], 1.2);
    return `<path d="${c.cut(pts, 0.6, 5)}" fill="${col}"/><path d="${feathers}" fill="${shadow}"/>`;
  };
  return `<g class="wingBk" transform="translate(-6 -128)">${w(-1, shadow)}</g><g class="wingFr" transform="translate(-8 -126)">${w(1, color)}</g>`;
}
export function breadBasket(c) {
  const s = sheet();
  s.p(c.cut(c.blob(-6, -12, 12, 8, 9, 0.1), 0.3, 3) + c.cut(c.blob(8, -14, 11, 8, 9, 0.1), 0.3, 3), C.wheat2);
  s.p(c.cut([[-20, -10], [20, -10], [15, 12], [-15, 12]], 0.3, 4), C.basket);
  s.x(c.ribbon([[-18, -2], [18, -2]], 2) + c.ribbon([[-16, 6], [16, 6]], 2), shade(C.basket, -0.25));
  return s.out();
}
export function jug(c, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-6, -34], [6, -34], [6, -28], [14, -20], [16, -6], [10, 4], [-10, 4], [-16, -6], [-14, -20], [-6, -28]], 0.4, 4), col);
  s.p(c.ribbon(c.qbez([12, -26], [24, -24], [14, -10], 6), 3), shade(col, -0.15));
  s.x(c.ribbon([[-14, -12], [14, -12]], 2), C.cream, 'opacity=".5"');
  return s.out();
}
/** tally marks on a flat stone, 8 groups of five; each mark is a path with data-i */
export function tallyStone(c, w = 190, h = 70) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -h * 0.5, w / 2, h / 2, 12, 0.08).map(([x, y]) => [x, Math.min(y, 0)]), 0.8, 6), C.rock);
  s.x(c.cut([[-w * 0.4, -h * 0.7], [w * 0.1, -h * 0.9], [w * 0.3, -h * 0.72], [-w * 0.2, -h * 0.62]], 0.5, 5), shade(C.rock, 0.3), 'opacity=".6"');
  let marks = '';
  let i = 0;
  for (let g = 0; g < 8; g++) {
    const gx = -w * 0.4 + (g % 4) * (w * 0.2), gy = g < 4 ? -h * 0.62 : -h * 0.28;
    for (let k = 0; k < 4; k++) marks += `<path class="tally" data-i="${i++}" d="${c.ribbon([[gx + k * 6, gy - 11], [gx + k * 6 + c.rr(-1, 1), gy + 11]], 2.4)}" fill="${C.soilDark}" opacity="0"/>`;
    marks += `<path class="tally" data-i="${i++}" d="${c.ribbon([[gx - 4, gy + 8], [gx + 24, gy - 8]], 2.4)}" fill="${C.soilDark}" opacity="0"/>`;
  }
  return s.out() + marks;
}

/* ---------- prison and time ---------- */
/** a stone wall flat with a window hole (window: {x,y,w,h} centred at 0,0 of the flat) */
export function prisonWall(c, { w = 720, h = 560, win = { x: 0, y: -60, w: 190, h: 170 } } = {}) {
  const s = sheet();
  const wx0 = win.x - win.w / 2, wy0 = win.y - win.h / 2;
  const hole = [[wx0, wy0 + win.h], [wx0, wy0 + 30], ...c.arc(win.x, wy0 + 30, win.w / 2, 30, PI, 2 * PI, 10), [wx0 + win.w, wy0 + win.h]];
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 1.2, 16) + c.hole(hole, 0.6, 6), C.stone2);
  let blocks = '';
  for (let y = -h / 2 + 8; y < h / 2 - 20; y += 44) {
    const off = (Math.round((y + h) / 44) % 2) * 40;
    for (let x = -w / 2 + 6 - off; x < w / 2 - 20; x += 80) {
      const x0 = Math.max(x, -w / 2 + 6), x1 = Math.min(x + 74, w / 2 - 6);
      if (x1 - x0 < 20) continue;
      if (x1 > wx0 - 6 && x0 < wx0 + win.w + 6 && y + 38 > wy0 - 6 && y < wy0 + win.h + 6) continue;
      blocks += c.cut([[x0, y], [x1, y], [x1, y + 38], [x0, y + 38]], 0.8, 8);
    }
  }
  s.p(blocks, C.stone);
  s.p(c.cut(c.rect(wx0 - 16, wy0 + win.h, win.w + 32, 16), 0.5, 6), shade(C.stone2, -0.15));
  return s.out();
}
export function bars(c, w = 190, h = 200, n = 5) {
  const s = sheet();
  let d = '';
  for (let i = 0; i < n; i++) { const x = -w / 2 + 18 + i * ((w - 36) / (n - 1)); d += c.cut(c.rect(x - 5, -h, 10, h), 0.3, 8); }
  d += c.cut(c.rect(-w / 2, -h * 0.55, w, 10), 0.3, 8);
  s.p(d, '#4c4452');
  s.x(c.ribbon([[-w / 2 + 16, -h + 4], [-w / 2 + 16, -8]], 2), '#8f879a', 'opacity=".6"');
  return s.out();
}
/** an hourglass: frame + glass markup, and the two sand heaps to scale (top: pivot at the neck; bottom: pivot at the floor) */
export function hourglassParts(c, h = 130) {
  const w = h * 0.52, s = sheet();
  const glass = [[-w * 0.4, -h / 2 + 8], [w * 0.4, -h / 2 + 8], [4, -2], [w * 0.4, h / 2 - 8], [-w * 0.4, h / 2 - 8], [-4, -2]];
  s.x(c.poly(glass), '#eef3ee', 'opacity=".75"');
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, 10), 0.3, 6) + c.cut(c.rect(-w / 2, h / 2 - 10, w, 10), 0.3, 6), C.wood2);
  s.p(c.cut(c.rect(-w / 2 + 3, -h / 2 + 8, 5, h - 16), 0.2, 6) + c.cut(c.rect(w / 2 - 8, -h / 2 + 8, 5, h - 16), 0.2, 6), C.wood);
  const top = `<path d="${c.poly([[-w * 0.36, -h / 2 + 12], [w * 0.36, -h / 2 + 12], [2, -4], [-2, -4]])}" fill="${C.wheat}"/>`;
  const bottom = `<path d="${c.poly([[-w * 0.38, 0], [w * 0.38, 0], [w * 0.12, -h * 0.34], [-w * 0.12, -h * 0.34]])}" fill="${C.wheat}"/>`;
  const stream = `<path d="M-1 -4H1V${h / 2 - 12}H-1Z" fill="${C.wheat2}"/>`;
  return { frame: s.out(), top, bottom, stream, h, w };
}

/* ---------- nets ---------- */
/** a round cast-net seen from above (radius r); scale sy to lay it on the water */
export function castNet(c, r = 90, color = C.cream) {
  let d = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; d += c.ribbon([[0, 0], [Math.cos(a) * r, Math.sin(a) * r]], 1.3); }
  [0.35, 0.62, 0.86].forEach((k) => { d += c.ribbon(c.arc(0, 0, r * k, r * k, 0, PI * 2, 28), 1.2); });
  d += c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 32), 2.6);
  let w = '';
  for (let i = 0; i < 16; i++) { const a = ((i + 0.5) / 16) * PI * 2; w += c.poly(c.circ(Math.cos(a) * r, Math.sin(a) * r, 3.2, 6)); }
  return `<path d="${c.poly(c.circ(0, 0, r, 32))}" fill="${color}" opacity=".12"/><path d="${d}" fill="${color}" opacity=".9"/><path d="${w}" fill="${C.stone2}"/>`;
}
/** a net draped in a sagging curtain (w wide, h deep), mesh diamonds */
export function netDrape(c, w = 160, h = 60, color = C.rope) {
  let d = '';
  const sag = (x) => h * (1 - Math.pow((2 * x) / w, 2)) * 0.35;
  for (let x = -w / 2; x <= w / 2; x += 12) d += c.ribbon([[x, 0], [x + 18, h * 0.5 + sag(x)], [x + 6, h + sag(x) * 0.6]], 1.2);
  for (let x = -w / 2; x <= w / 2; x += 12) d += c.ribbon([[x + 12, 0], [x - 6, h * 0.5 + sag(x)], [x + 4, h + sag(x) * 0.6]], 1.2);
  d += c.ribbon(Array.from({ length: 11 }, (_, i) => { const x = -w / 2 + (w * i) / 10; return [x, h + sag(x) * 0.6]; }), 2.2);
  let fl = '';
  for (let x = -w / 2 + 8; x < w / 2; x += 30) fl += c.cut(c.ell(x, 2, 5, 3.4, 8), 0.2, 3);
  return `<path d="${d}" fill="${color}"/><path d="${fl}" fill="${C.terracotta}"/>`;
}

/* ---------- the synagogue in Capernaum ---------- */
function arch(c, x, y, w, h) { return [[x - w / 2, y + h], [x - w / 2, y + w / 2], ...c.arc(x, y + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x + w / 2, y + h]]; }
export function column(c, x, y, h, w = 44, col = C.stone) {
  const s = sheet();
  s.p(c.cut(c.rect(x - w / 2, y - h, w, h), 0.5, 10), col);
  s.x(c.ribbon([[x - w * 0.2, y - h + 20], [x - w * 0.2, y - 16]], 3) + c.ribbon([[x + w * 0.15, y - h + 20], [x + w * 0.15, y - 16]], 3), shade(col, -0.1), 'opacity=".7"');
  s.p(c.cut([[x - w * 0.8, y - h - 14], [x + w * 0.8, y - h - 14], [x + w * 0.6, y - h + 6], [x - w * 0.6, y - h + 6]], 0.4, 6) + c.cut(c.rect(x - w * 0.75, y - 14, w * 1.5, 16), 0.4, 6), shade(col, -0.08));
  return s.out();
}
/** builds the interior of the synagogue as layers (sky through windows, back wall with the ark, lamps,
 *  floor and benches). Returns { P, FLOOR, flames[], benchY: [back, front], addColumns() } */
export function synagogueInterior(S, { P = 0.45, sky = ['#bcd6d6', '#e2ecdf', '#f3ead3'] } = {}) {
  const c = makeCutter('m1-synagogue-set');   // same cut in every scene that uses this set
  const gid = S.id('synsky');
  S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset=".6" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[2]}"/></linearGradient>`);
  const skyL = S.layer({ par: 0, sky: true });
  skyL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${gid})"/>`);
  const wall = S.layer({ par: 0.2, sh: 3 });
  const W = sheet();
  const wins = [420, 800, 1180].map((x) => arch(c, x, 150, 110, 160));
  W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 640], [-1200, 640]], 1, 30) + wins.map((w) => c.hole(w, 0.5, 6)).join(''), C.plaster);
  let blocks = '';
  for (let y = -300; y < 620; y += 46) for (let x = -1200 + ((y / 46) % 2 ? 60 : 0); x < 2800; x += 120) blocks += c.cut(c.rect(x + c.rr(0, 6), y + c.rr(0, 4), c.rr(90, 110), 38), 0.6, 10);
  W.x(blocks, C.plaster2, 'opacity=".45"');
  W.p(c.cut([[-1200, 560], [2800, 560], [2800, 640], [-1200, 640]], 0.8, 14), C.plaster2);
  W.p([420, 800, 1180].map((x) => c.ribbon([[x - 60, 312], [x + 60, 312]], 10) + c.ribbon([[x, 150], [x, 310]], 5)).join(''), C.wood2);
  // the ark of the scrolls behind the reading desk
  W.p(c.cut([[690, 600], [690, 440], ...c.arc(800, 440, 110, 70, PI, 2 * PI, 14), [910, 600]], 0.6, 8), C.wood);
  W.p(c.cut([[712, 596], [712, 450], ...c.arc(800, 450, 88, 54, PI, 2 * PI, 12), [888, 596]], 0.5, 8), C.dustyBlue);
  let pleat = '';
  for (let x = 724; x < 884; x += 16) pleat += c.ribbon([[x, 470], [x + c.rr(-2, 2), 594]], 3);
  W.x(pleat, shade(C.dustyBlue, -0.18), 'opacity=".6"');
  W.p(c.cut(c.star(800, 408, 16, 7, 6, 0), 0.3, 3), C.sun);
  W.p(c.ribbon([[706, 470], [894, 470]], 6), C.sun);
  wall.add(W.out());
  [230, 610, 990, 1370].forEach((x) => wall.add(column(c, x, 600, 470, 46)));
  // hanging lamps on chains
  const lampsL = S.layer({ par: 0.26, sh: 4 });
  const flames = [];
  [330, 600, 1000, 1270].forEach((x, i) => {
    const y = 250 + (i % 2) * 40;
    const s = sheet().p(c.cut([[-26, 0], [26, 0], [16, 12], [-16, 12]], 0.4, 4), C.sun).p(c.cut(c.ell(0, 0, 28, 6, 14), 0.3, 4), shade(C.sun, -0.2));
    lampsL.add(`<g transform="translate(${x} ${y})"><path d="M0 -1400V0M-20 0L0 -40L20 0" stroke="${C.inkSoft}" stroke-width="1.4" fill="none" opacity=".6"/><circle cy="-10" r="60" fill="url(#warm-glow)" opacity=".6"/>${s.out()}</g>`);
    [-14, 0, 14].forEach((dx) => { const el = lampsL.add(`<g transform="translate(${x + dx} ${y - 2})"><path d="M0 0C-5 -5 -4 -12 0 -20C4 -12 5 -5 0 0Z" fill="${C.lampFlame}"/></g>`); flames.push({ el, x: x + dx, y: y - 2, i: flames.length }); });
  });
  // mosaic floor and the stepped stone benches
  const floor = S.layer({ par: P, sh: 3 });
  const F = sheet();
  F.p(c.cut([[-1200, 600], [2800, 600], [2800, 1700], [-1200, 1700]], 0.8, 30), mix(C.stone, C.sand, 0.4));
  let tiles = '';
  for (let y = 640; y < 1100; y += 40) for (let x = -600 + ((y / 40) % 2) * 40; x < 2200; x += 80) tiles += c.poly([[x, y - 12], [x + 14, y], [x, y + 12], [x - 14, y]]);
  F.x(tiles, shade(C.stone2, -0.06), 'opacity=".5"');
  F.p(c.cut(c.ell(800, 780, 260, 50, 30), 0.6, 10), mix(C.terracotta, C.sand, 0.45));
  F.x(c.ribbon(c.arc(800, 780, 230, 40, 0, PI * 2, 30), 4), C.cream, 'opacity=".6"');
  floor.add(F.out());
  const B = sheet();
  const BACK = 628, FRONT = 690;
  [[-900, 610], [990, 2600]].forEach(([x0, x1]) => {
    B.p(c.cut([[x0, BACK - 8], [x1, BACK - 8], [x1, BACK + 60], [x0, BACK + 60]], 0.6, 12), C.stone2);
    B.p(c.cut([[x0, BACK - 14], [x1, BACK - 14], [x1, BACK - 4], [x0, BACK - 4]], 0.4, 12), shade(C.stone2, 0.18));
  });
  floor.add(B.out());
  return {
    P, FLOOR: 740, benchY: [BACK - 8, FRONT], flames,
    /** the congregation on the benches — the same people in every scene */
    congregation(L) {
      const S2 = { ...S, c: makeCutter('m1-synagogue-people') };
      const back = crowd(S2, L, [{ y: BACK - 8, s: 0.78, n: 5, x0: 250, x1: 620, pose: 'sit' }, { y: BACK - 8, s: 0.78, n: 4, x0: 1000, x1: 1330, pose: 'sit' }]);
      this.front(L);
      return back;
    },
    front(Lr) {
      const s = sheet();
      [[-900, 600], [1000, 2600]].forEach(([x0, x1]) => {
        s.p(c.cut([[x0, FRONT - 6], [x1, FRONT - 6], [x1, FRONT + 64], [x0, FRONT + 64]], 0.6, 12), C.stone);
        s.p(c.cut([[x0, FRONT - 12], [x1, FRONT - 12], [x1, FRONT - 2], [x0, FRONT - 2]], 0.4, 12), shade(C.stone, 0.2));
      });
      Lr.add(s.out());
    },
    flicker(time) { flames.forEach((f) => { const k = 1 + Math.sin(time * 11 + f.i * 1.7) * 0.1; pose(f.el, { x: f.x, y: f.y, sx: 1 / k, sy: k, r: Math.sin(time * 4 + f.i) * 5 }); }); },
    addColumns() {
      const fg = S.layer({ par: 0.9, sh: 8 });
      fg.add(column(c, 60, 1100, 1400, 150, C.stone2) + column(c, 1540, 1100, 1400, 150, C.stone2));
      const up = S.portrait ? 260 : 0;    // phone: the beam sits higher, so it does not fill the top of the tall screen
      const beam = sheet().p(c.cut([[-1200, -1400], [2800, -1400], [2800, 70 - up], [-1200, 84 - up]], 0.8, 16), C.wood2).x(c.ribbon([[-1200, 64 - up], [2800, 60 - up]], 3), shade(C.wood2, -0.25), 'opacity=".6"');
      fg.add(beam.out());
      return fg;
    },
  };
}
/** the synagogue seen from the street — a whole painted drop (sky, street, houses, the building) */
export function synagogueFacade(S, { signText = 'Kafarnaum' } = {}) {
  const c = S.c;
  const gid = S.id('facsky');
  S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="-600" x2="0" y2="560"><stop offset="0" stop-color="#b8d4d4"/><stop offset=".7" stop-color="#e6ecdb"/><stop offset="1" stop-color="#f4ead2"/></linearGradient>`);
  const s = sheet();
  s.raw(`<rect x="-1400" y="-3000" width="4400" height="3600" fill="url(#${gid})"/>`);
  s.p(c.ridge(c.wave(470, [10, 4], [800, 200]), -1400, 3000, 700, 14, 0.8), C.hillFar);
  s.p(c.ridge(c.wave(520, [2, 1], [400, 100]), -1400, 3000, 700, 14, 0.4), C.lake);
  s.p(c.cut([[-1400, 560], [3000, 560], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.4));
  let cobbles = '';
  for (let i = 0; i < 90; i++) cobbles += c.cut(c.blob(c.rr(-600, 2200), c.rr(600, 1000), c.rr(10, 22), c.rr(5, 9), 8, 0.2), 0.3, 4);
  s.x(cobbles, C.stone2, 'opacity=".6"');
  // the synagogue: podium, walls, three doors, columns, gable
  const x0 = 520, x1 = 1080, top = 300, base = 640;
  s.p(c.cut(c.rect(x0 - 40, base - 10, x1 - x0 + 80, 26), 0.4, 8) + c.cut(c.rect(x0 - 60, base + 14, x1 - x0 + 120, 22), 0.4, 8), C.stone2);
  s.p(c.cut(c.rect(x0, top, x1 - x0, base - top), 0.6, 10), C.cream);
  let bl = '';
  for (let y = top + 10; y < base - 30; y += 34) for (let x = x0 + ((y / 34) % 2 ? 30 : 0); x < x1 - 40; x += 70) bl += c.cut(c.rect(x + 4, y, 60, 28), 0.4, 8);
  s.x(bl, C.plaster2, 'opacity=".5"');
  s.p(c.cut([[x0 - 30, top + 4], [800, top - 120], [x1 + 30, top + 4]], 0.6, 10), C.plaster);
  s.p(c.cut([[x0 - 16, top - 4], [800, top - 104], [x1 + 16, top - 4]], 0.4, 10), shade(C.plaster, -0.05));
  s.p(c.cut(c.star(800, top - 44, 18, 8, 6, 0), 0.3, 3), C.sun);
  [[800, 90, 150], [640, 60, 110], [960, 60, 110]].forEach(([x, w, h]) => s.p(c.cut(arch(c, x, base - h - 10, w, h), 0.4, 6), C.soilDark));
  [575, 720, 880, 1025].forEach((x) => { s.p(c.cut(c.rect(x - 14, top + 6, 28, base - top - 16), 0.4, 8), C.stone); s.p(c.cut(c.rect(x - 20, top + 2, 40, 12), 0.3, 6), C.stone2); });
  // houses and palms along the street
  [[80, 90, 60], [240, 110, 80], [1180, 100, 70], [1360, 120, 90], [-120, 110, 70], [1560, 100, 60]].forEach(([x, w, h]) => {
    s.p(c.cut(c.rect(x, base - h, w, h + 6), 0.5, 8), C.plaster);
    s.p(c.cut(c.rect(x - 4, base - h - 6, w + 8, 8), 0.3, 6), C.roof);
    s.p(c.cut(arch(c, x + w * 0.3, base - 50, 24, 44), 0.3, 5), C.wood2);
    s.x(c.poly(c.rect(x + w * 0.6, base - h + 16, 14, 12)), C.soilDark);
  });
  const sign = `<g transform="translate(420 700)">${signpost(c, signText)}</g>`;
  return s.out() + sign;
}

/* ---------- a paper map of Galilee ---------- */
export function galileeMap(c, { w = 760, h = 540 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2.2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 18, -h / 2 + 18], [w / 2 - 18, -h / 2 + 18], [w / 2 - 18, h / 2 - 18], [-w / 2 + 18, h / 2 - 18], [-w / 2 + 18, -h / 2 + 20]], 2), C.clay, 'opacity=".5"');
  // hills
  let hills = '';
  [[-300, -170], [-250, -120], [-320, 40], [-160, 120], [-110, -200], [230, -190], [260, 40], [300, 170], [-40, 200]].forEach(([x, y]) => { hills += c.cut([[x - 26, y + 10], [x, y - 20], [x + 26, y + 10]], 0.6, 6); });
  s.x(hills, shade(C.parchment, -0.14));
  // the Jordan and the lake
  s.p(c.ribbon([[70, -h / 2 + 20], [60, -230], [80, -200], [55, -170], [40, -150]], 5), C.lake2);
  s.p(c.ribbon([[45, 110], [60, 150], [40, 190], [70, 230], [60, h / 2 - 20]], 5), C.lake2);
  const lake = [[20, -150], [70, -142], [110, -104], [124, -40], [104, 30], [74, 90], [44, 112], [12, 102], [-18, 64], [-38, 4], [-46, -58], [-28, -120]];
  s.p(c.cut(lake, 1, 6), C.lake);
  s.x(c.ribbon([[0, -40], [50, -46]], 2) + c.ribbon([[10, 20], [60, 14]], 2), C.foam, 'opacity=".7"');
  s.x(c.poly(c.star(w / 2 - 70, h / 2 - 70, 26, 6, 4, 0)), C.clay, 'opacity=".6"');
  const towns = [
    { k: 'kaf', x: 64, y: -160, pl: 'Kafarnaum', en: 'Capernaum', dx: 18, dy: -6 },
    { k: 'kor', x: 40, y: -232, pl: 'Korozain', en: 'Chorazin', dx: 16, dy: -4 },
    { k: 'bet', x: 140, y: -140, pl: 'Betsaida', en: 'Bethsaida', dx: 14, dy: 16 },
    { k: 'mag', x: -60, y: -60, pl: 'Magdala', en: 'Magdala', dx: -12, dy: -12, left: true },
    { k: 'tyb', x: -40, y: 58, pl: 'Tyberiada', en: 'Tiberias', dx: -14, dy: 6, left: true },
    { k: 'kan', x: -236, y: -40, pl: 'Kana', en: 'Cana', dx: 14, dy: -10 },
    { k: 'naz', x: -250, y: 130, pl: 'Nazaret', en: 'Nazareth', dx: 14, dy: -10 },
    { k: 'nai', x: -150, y: 200, pl: 'Nain', en: 'Nain', dx: 14, dy: 4 },
    { k: 'gad', x: 200, y: 150, pl: 'Gadara', en: 'Gadara', dx: 14, dy: 4 },
  ];
  let dots = '', labels = '';
  towns.forEach((t) => {
    dots += c.cut(c.rect(t.x - 7, t.y - 6, 14, 10), 0.3, 4) + c.cut([[t.x - 9, t.y - 6], [t.x, t.y - 14], [t.x + 9, t.y - 6]], 0.3, 4);
    const name = tr(t.pl, t.en);
    labels += `<text x="${t.x + t.dx}" y="${t.y + t.dy}" text-anchor="${t.left ? 'end' : 'start'}" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.inkSoft}">${name}</text>`;
  });
  s.p(dots, C.clay);
  const seaName = tr('Jezioro Galilejskie', 'Sea of Galilee');
  const title = tr('Galilea', 'Galilee');
  labels += `<text x="40" y="-10" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="14" font-style="italic" fill="${shade(C.lakeDeep, -0.1)}" transform="rotate(-70 40 -10)">${seaName}</text>`;
  labels += `<text x="${w / 2 - 44}" y="${-h / 2 + 62}" text-anchor="end" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">${title}</text>`;
  return { markup: s.out() + labels, towns };
}

/* ---------- an unclean spirit: a jagged dark shadow cut into wedges that can tear away ---------- */
export function shadowShards(c, { n = 9, r = 120, color = '#2a2238' } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * PI * 2, a1 = ((i + 1) / n) * PI * 2, am = (a0 + a1) / 2;
    const rr = r * c.rr(0.85, 1.25);
    const pts = [[0, 0], [Math.cos(a0) * r * 0.62, Math.sin(a0) * r * 0.62], [Math.cos(am - 0.12) * rr * 0.8, Math.sin(am - 0.12) * rr * 0.8], [Math.cos(am) * rr * 1.25, Math.sin(am) * rr * 1.25], [Math.cos(am + 0.12) * rr * 0.8, Math.sin(am + 0.12) * rr * 0.8], [Math.cos(a1) * r * 0.62, Math.sin(a1) * r * 0.62]];
    out.push({ m: `<path d="${c.cut(pts, 1.6, 7)}" fill="${color}"/>`, a: am, i });
  }
  return out;
}
export const POSSESSED = { robe: C.stone2, mantle: null, hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin2, belt: C.leather };

/* ---------- Simon and Andrew's house ---------- */
/** the street drop: a flat-roofed house with a courtyard door, outside stairs and a fig tree */
export function houseFacade(S, { lit = false, withSky = true } = {}) {
  const c = S.c;
  const s = sheet();
  if (withSky) {
    const gid = S.id('hsky');
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="-600" x2="0" y2="560"><stop offset="0" stop-color="#bcd6d6"/><stop offset=".7" stop-color="#e8ecd9"/><stop offset="1" stop-color="#f5ebd1"/></linearGradient>`);
    s.raw(`<rect x="-1400" y="-3000" width="4400" height="3600" fill="url(#${gid})"/>`);
    s.p(c.ridge(c.wave(480, [10, 4], [800, 200]), -1400, 3000, 700, 14, 0.8), C.hillFar);
    s.p(c.ridge(c.wave(522, [2, 1], [400, 100]), -1400, 3000, 700, 14, 0.4), C.lake);
  }
  s.p(c.cut([[-1400, 590], [3000, 590], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.35));
  let cob = '';
  for (let i = 0; i < 70; i++) cob += c.cut(c.blob(c.rr(-600, 2200), c.rr(620, 1000), c.rr(10, 22), c.rr(5, 9), 8, 0.2), 0.3, 4);
  s.x(cob, C.stone2, 'opacity=".55"');
  // the house
  const x0 = 700, x1 = 1180, top = 330, base = 660;
  s.p(c.cut(c.rect(x0, top, x1 - x0, base - top), 0.6, 10), C.plaster);
  s.p(c.cut([[x1, top + 6], [x1 + 70, top + 26], [x1 + 70, base], [x1, base]], 0.5, 8), C.plaster2);
  s.p(c.cut(c.rect(x0 - 10, top - 14, x1 - x0 + 20, 16), 0.4, 8), C.roof);
  let beams = '';
  for (let x = x0 + 14; x < x1; x += 46) beams += c.cut(c.rect(x, top + 2, 10, 10), 0.2, 4);
  s.p(beams, C.wood2);
  s.p(c.cut([[900, base], [900, 500], ...c.arc(950, 500, 50, 44, PI, 2 * PI, 10), [1000, base]], 0.4, 6), C.wood);
  s.x(c.ribbon([[950, 470], [950, base]], 2) + c.ribbon([[912, 560], [988, 560]], 2), shade(C.wood, -0.25), 'opacity=".6"');
  s.x(c.poly(c.circ(986, 590, 3, 6)), C.ochre);
  s.x(c.poly(c.rect(760, 420, 60, 46)), lit ? C.lampFlame : C.soilDark, 'class="win"');
  s.p(c.ribbon([[756, 468], [824, 468]], 6), C.wood2);
  // a fig tree and a neighbour's wall
  s.p(c.cut(c.rect(250, 470, 330, 190), 0.6, 10), C.plaster);
  s.p(c.cut(c.rect(244, 460, 342, 14), 0.4, 8), C.roof);
  s.p(c.cut([[1330, base], [1336, 520], [1310, 470], [1320, 466], [1346, 500], [1360, 450], [1370, 452], [1356, 520], [1352, base]], 0.6, 6), C.wood2);
  s.p(c.cut(c.blob(1340, 440, 90, 60, 14, 0.2), 1.2, 7), C.moss).p(c.cut(c.blob(1300, 470, 60, 40, 12, 0.2), 1, 6) + c.cut(c.blob(1390, 468, 56, 38, 12, 0.2), 1, 6), C.leaf);
  return s.out();
}
export function lowTable(c, w = 170) {
  return sheet().p(c.cut([[-w / 2, -34], [w / 2, -34], [w / 2 - 4, -24], [-w / 2 + 4, -24]], 0.4, 6), C.wood)
    .p(c.cut(c.rect(-w / 2 + 10, -26, 10, 26), 0.3, 4) + c.cut(c.rect(w / 2 - 20, -26, 10, 26), 0.3, 4), C.wood2)
    .p(c.cut(c.blob(-40, -42, 18, 8, 10, 0.1), 0.3, 3) + c.cut(c.blob(-8, -44, 16, 8, 10, 0.1), 0.3, 3), C.wheat2)
    .p(c.cut([[20, -34], [28, -58], [36, -62], [44, -58], [52, -34]], 0.3, 4), C.pot).out();
}
export function tray(c) {
  return sheet().p(c.cut(c.ell(0, 0, 30, 6, 16), 0.3, 4), C.wood3)
    .p(c.cut(c.blob(-10, -7, 11, 7, 9, 0.1), 0.3, 3) + c.cut(c.blob(10, -8, 10, 7, 9, 0.1), 0.3, 3), C.wheat2)
    .p(c.cut([[16, -4], [18, -22], [24, -26], [30, -22], [30, -4]], 0.2, 3), C.pot).out();
}
/** wavy heat ribbons for a fever */
export function heatWave(c, h = 70, color = '#e0664f') {
  return `<path d="${c.ribbon(c.cbez([0, 0], [14, -h * 0.33], [-14, -h * 0.66], [0, -h], 16), (u) => 4 - u * 2.6)}" fill="${color}"/>`;
}

/* ---------- the sick and the healed ---------- */
export function crutch(c) {
  return sheet().p(c.ribbon([[0, -8], [2, 150]], 5), C.wood).p(c.cut([[-16, -14], [16, -14], [14, -4], [-14, -4]], 0.3, 4), C.wood2).out();
}
/** a sleeping-mat stretcher (w long), carried by its ends */
export function mat(c, w = 200) {
  return sheet().p(c.cut([[-w / 2, -8], [w / 2, -8], [w / 2 + 4, 4], [-w / 2 - 4, 4]], 0.5, 8), C.basket)
    .x(c.ribbon([[-w / 2 + 6, -2], [w / 2 - 6, -2]], 2) + c.ribbon([[-w / 2 + 20, -8], [-w / 2 + 20, 4]], 1.5) + c.ribbon([[w / 2 - 20, -8], [w / 2 - 20, 4]], 1.5), shade(C.basket, -0.25)).out();
}
export function handLamp(c) {
  return `<circle cy="-14" r="46" fill="url(#warm-glow)" opacity=".8"/>` + sheet().p(c.cut([[-12, 0], [-14, -5], [-8, -9], [6, -9], [14, -6], [18, -8], [14, -2], [6, 1], [-8, 1]], 0.3, 3), C.pot).out() + `<path d="M17 -8C14 -11 14 -15 17 -21C20 -15 20 -11 17 -8Z" fill="${C.lampFlame}"/>`;
}

/* ---------- the leper ---------- */
export function bell(c) {
  return `<path d="M0 -6V4" stroke="${C.inkSoft}" stroke-width="1.4"/>` + sheet().p(c.cut([[-9, 18], [-7, 8], [-5, 3], [0, 1], [5, 3], [7, 8], [9, 18]], 0.3, 3), C.ochre).p(c.cut(c.circ(0, 19, 2.6, 6), 0.1, 2), shade(C.ochre, -0.35)).out();
}
/** grey-rose blotches laid over a puppet (standing or kneeling), in puppet coordinates */
export function leperSpots(c, kneel = false) {
  const dy = kneel ? 46 : 0;
  const spots = [[4, -176], [-8, -160], [14, -158], [-14, -120], [10, -128], [-2, -100], [18, -96], [-20, -70], [6, -64], [-8, -40], [22, -46], [12, -20]].map(([x, y]) => [x, y + (y < -40 || !kneel ? dy : 0)]);
  return spots.map(([x, y], i) => ({ x, y, m: `<path d="${c.cut(c.blob(0, 0, c.rr(3.5, 6.5), c.rr(3, 5.5), 8, 0.3), 0.4, 3)}" fill="${i % 2 ? '#a88f8c' : '#8f8a8e'}"/>` }));
}
/** a round inset plate: the priest at the Temple receiving the offering Moses commanded */
export function priestPlate(c) {
  const r = 120;
  const s = sheet().p(c.cut(c.circ(0, 0, r + 8, 48), 0.6, 6), C.haloRim).p(c.cut(c.circ(0, 0, r, 46), 0.6, 6), '#f1e6cf');
  const temple = sheet().p(c.cut(c.rect(-30, -70, 90, 70), 0.4, 6), C.cream).p(c.cut([[-40, -70], [15, -100], [70, -70]], 0.4, 6), C.plaster)
    .p(c.cut(c.rect(-36, -76, 102, 8), 0.3, 5), C.sun)
    .x([-20, 0, 20, 40].map((x) => c.poly(c.rect(x, -64, 6, 58))).join(''), shade(C.cream, -0.12))
    .x(c.poly([[5, 0], [5, -30], [15, -40], [25, -30], [25, 0]]), C.soilDark).out();
  const priest = person(c, { robe: C.linen, mantle: C.dustyBlue, hairStyle: 'wrap', veil: C.linen, veil2: C.sun, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin2, belt: C.sun });
  const man = person(c, { ...LEPER_HEALED, pose: 'kneel' });
  const birds = sheet().p(c.cut([[-14, 0], [-10, -8], [2, -10], [8, -6], [4, 2]], 0.3, 3) + c.cut([[4, -4], [8, -12], [18, -14], [22, -8], [16, -2]], 0.3, 3), '#fbf7ee').x(c.poly(c.circ(8, -8, 1.2, 5)) + c.poly(c.circ(20, -11, 1.2, 5)), C.ink).out();
  return `${s.out()}<g transform="translate(-10 60)">${temple}</g><g transform="translate(-40 70) scale(.42)"><g transform="scale(-1 1)">${priest}</g></g><g transform="translate(-92 72) scale(.42)">${man}</g><g transform="translate(-58 22)">${birds}</g>`;
}
export const LEPER_HEALED = { robe: C.linen2, mantle: C.sageRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, beard: 'short', skin: C.skin2, belt: C.leather };
