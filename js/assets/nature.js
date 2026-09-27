// Landscape pieces: land bands, water, plants, sky ornaments. All return SVG markup strings.

import { sheet, shade } from '../core/paper.js';
import { C } from './palette.js';

const PI = Math.PI;

/* ---------- land & water bands ---------- */
export function band(c, { y, amps = [14, 6, 2.5], lens = [900, 330, 120], x0 = -900, x1 = 2500, bottom = 1700, color, step = 12, j = 1.1, grain = true }) {
  const fn = c.wave(y, amps, lens);
  return { fn, markup: sheet().p(c.ridge(fn, x0, x1, bottom, step, j), color).out(grain) };
}

/** a hill band with little trees & houses sitting on its crest */
export function hillsWith(c, { y, color, amps, lens, x0 = -900, x1 = 2500, trees = 0, treeColor, treeH = 26, houses = 0, houseColor }) {
  const { fn, markup } = band(c, { y, color, amps, lens, x0, x1 });
  const s = sheet();
  for (let i = 0; i < trees; i++) {
    const x = c.rr(x0 + 100, x1 - 100), by = fn(x) + 3, h = treeH * c.rr(0.7, 1.3);
    if (c.chance(0.5)) s.p(c.cut(c.blob(x, by - h * 0.55, h * 0.4, h * 0.5, 9, 0.12), 0.5, 5), treeColor);
    else s.p(c.cut([[x, by - h * 1.2], [x + h * 0.22, by - h * 0.3], [x + h * 0.12, by], [x - h * 0.12, by], [x - h * 0.22, by - h * 0.3]], 0.4, 5), treeColor);
  }
  for (let i = 0; i < houses; i++) {
    const x = c.rr(x0 + 200, x1 - 200), by = fn(x) + 4, w = c.rr(16, 28), h = c.rr(12, 18);
    s.p(c.cut(c.rect(x, by - h, w, h + 4), 0.3, 5), houseColor);
  }
  return { fn, markup: markup + s.out() };
}

export function waterBand(c, { y, color, x0 = -900, x1 = 2500, bottom = 1700, amp = 3, len = 140, foam = C.foam, foamN = 14, glints = true }) {
  const s = sheet();
  const fn = c.wave(y, [amp, amp * 0.4], [len, len * 0.37]);
  s.p(c.ridge(fn, x0, x1, bottom, 10, 0.6), color);
  let f = '';
  for (let i = 0; i < foamN; i++) {
    const x = c.rr(x0, x1), yy = c.rr(y + 18, Math.min(bottom, y + 260)), w = c.rr(18, 70);
    f += c.cut([[x, yy], [x + w * 0.5, yy - 2.2], [x + w, yy], [x + w * 0.5, yy + 1.2]], 0.2, 8);
  }
  if (glints && f) s.x(f, foam, 'opacity=".6"');
  return { fn, markup: s.out() };
}

/** a strip of rolling waves you can slide sideways (period = len) for a looping sea */
export function waveStrip(c, { y, len = 120, amp = 12, x0 = -1000, x1 = 2600, bottom = 1700, color, crest = C.foam, crests = true }) {
  const s = sheet();
  const pts = [];
  for (let x = x0; x <= x1; x += len) {
    pts.push(...c.arc(x + len / 2, y, len / 2, amp, PI, 2 * PI, 8).map(([px, py]) => [px, py + c.rr(-0.6, 0.6)]));
  }
  pts.push([x1 + len, bottom], [x0, bottom]);
  s.p(c.poly(pts), color);
  if (crests) {
    let d = '';
    for (let x = x0; x <= x1; x += len) d += c.cut([[x + len * 0.25, y - amp * 0.72], [x + len * 0.5, y - amp - 1.5], [x + len * 0.78, y - amp * 0.6], [x + len * 0.5, y - amp + 3]], 0.3, 6);
    s.x(d, crest, 'opacity=".75"');
  }
  return s.out();
}

/* ---------- plants ---------- */
export function tuft(c, x, y, h = 18, color = C.moss, n = 5) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const lean = c.rr(-0.5, 0.5) * h, bx = x + (i - n / 2) * 2.4, hh = h * c.rr(0.6, 1.1);
    d += c.poly([[bx - 1.6, y], [bx + lean, y - hh], [bx + 1.6, y]]);
  }
  return d;
}
export function grass(c, { x0, x1, y, n = 30, h = 18, color = C.moss, fn }) {
  let d = '';
  for (let i = 0; i < n; i++) { const x = c.rr(x0, x1); d += tuft(c, x, (fn ? fn(x) : y) + 2, h * c.rr(0.6, 1.3), color, c.ri(3, 6)); }
  return sheet().p(d, color).out();
}

export function palm(c, x, y, h = 220, { trunk = C.wood3, frond = C.moss, frond2 = C.leaf } = {}) {
  const s = sheet();
  const lean = c.rr(-0.25, 0.25) * h;
  const top = [x + lean, y - h];
  const spine = c.qbez([x, y], [x + lean * 0.1, y - h * 0.6], top, 14);
  s.p(c.ribbon(spine, (t) => 14 - t * 6, 0.8), trunk);
  let rings = '';
  spine.forEach(([px, py], i) => { if (i % 2 && i < spine.length - 1) rings += c.poly([[px - 7, py], [px + 7, py - 2], [px + 6, py + 1], [px - 6, py + 3]]); });
  s.x(rings, shade(trunk, -0.18), 'opacity=".7"');
  const fronds = [[-2.6, 1], [-2.1, 0.9], [-1.5, 0.95], [-0.9, 1], [-0.35, 0.8], [0.2, 0.9]];
  let d1 = '', d2 = '';
  fronds.forEach(([a, k], i) => {
    const L = h * 0.5 * k * c.rr(0.85, 1.1);
    const end = [top[0] + Math.cos(a) * L, top[1] + Math.sin(a) * L + L * 0.35];
    const mid = [top[0] + Math.cos(a) * L * 0.5, top[1] + Math.sin(a) * L * 0.5 - L * 0.12];
    const pts = c.qbez(top, mid, end, 10);
    const leaf = c.ribbon(pts, (t) => Math.sin(t * PI) * 22 + 2, 0.5);
    if (i % 2) d1 += leaf; else d2 += leaf;
  });
  s.p(d2, frond2).p(d1, frond);
  s.p(c.cut(c.circ(top[0], top[1] + 4, 7, 9), 0.4, 4), C.wood2);
  return s.out();
}

export function olive(c, x, y, sc = 1, { trunk = C.wood2, leaf = C.olive, leaf2 = C.sage } = {}) {
  const s = sheet();
  s.p(c.cut([[x - 8 * sc, y], [x - 12 * sc, y - 40 * sc], [x - 26 * sc, y - 70 * sc], [x - 14 * sc, y - 72 * sc], [x - 2 * sc, y - 52 * sc], [x + 10 * sc, y - 78 * sc], [x + 22 * sc, y - 74 * sc], [x + 8 * sc, y - 40 * sc], [x + 10 * sc, y]], 0.8, 6), trunk);
  let d = '', d2 = '';
  for (let i = 0; i < 7; i++) {
    const bx = x + c.rr(-60, 60) * sc, by = y - c.rr(80, 135) * sc;
    const lb = c.cut(c.blob(bx, by, c.rr(34, 50) * sc, c.rr(22, 32) * sc, 12, 0.18), 1, 6);
    if (i % 2) d += lb; else d2 += lb;
  }
  s.p(d2, leaf2).p(d, leaf);
  return s.out();
}

export function cypress(c, x, y, h = 160, color = C.moss2) {
  return sheet().p(c.cut([[x, y - h], [x + h * 0.13, y - h * 0.55], [x + h * 0.11, y - h * 0.1], [x + 3, y], [x - 3, y], [x - h * 0.11, y - h * 0.1], [x - h * 0.13, y - h * 0.55]], 1.2, 7), color).out();
}

export function bush(c, x, y, w = 60, color = C.sage, color2) {
  const s = sheet();
  if (color2) s.p(c.cut(c.blob(x - w * 0.25, y - w * 0.28, w * 0.42, w * 0.3, 11, 0.2), 0.8, 6), color2);
  s.p(c.cut(c.blob(x, y - w * 0.22, w * 0.5, w * 0.3, 12, 0.2), 0.8, 6), color);
  return s.out();
}

export function reeds(c, x, y, n = 9, h = 90, color = C.olive, head = C.wood3) {
  let d = '', hd = '';
  for (let i = 0; i < n; i++) {
    const bx = x + c.rr(-n * 3, n * 3), hh = h * c.rr(0.6, 1.15), lean = c.rr(-14, 14);
    d += c.ribbon(c.qbez([bx, y], [bx + lean * 0.2, y - hh * 0.6], [bx + lean, y - hh], 8), (t) => 3.2 - t * 2.4);
    if (c.chance(0.55)) hd += c.cut(c.ell(bx + lean, y - hh - 8, 3.4, 11, 10, lean * 0.01), 0.2, 4);
  }
  return sheet().p(d, color).p(hd, head).out();
}

export function rock(c, x, y, w, h, color = C.rock) {
  const s = sheet();
  const pts = c.blob(x, y - h * 0.45, w / 2, h / 2, 9, 0.18).map(([px, py]) => [px, Math.min(py, y)]);
  s.p(c.cut(pts, 1, 7), color);
  s.x(c.cut([[x - w * 0.3, y - h * 0.55], [x - w * 0.05, y - h * 0.85], [x + w * 0.2, y - h * 0.6], [x - w * 0.05, y - h * 0.5]], 0.5, 6), shade(color, 0.3), 'opacity=".7"');
  return s.out();
}

export function flowers(c, { x0, x1, y, n = 12, fn, colors = [C.jesusMantle, C.lavender, C.cream, C.wheat], h = 22 }) {
  let stems = '';
  const petals = colors.map(() => '');
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), by = (fn ? fn(x) : y) + 2, hh = h * c.rr(0.6, 1.3), ci = c.ri(0, colors.length - 1);
    stems += c.ribbon([[x, by], [x + c.rr(-3, 3), by - hh]], 1.4);
    petals[ci] += c.cut(c.star(x, by - hh, 6, 3, 5, c.rr(0, 6)), 0.2, 3);
  }
  const s = sheet().p(stems, C.moss);
  colors.forEach((col, i) => petals[i] && s.p(petals[i], col));
  return s.out();
}

/* ---------- sky ornaments (hang them from strings) ---------- */
export function sun(c, r = 60, { rays = C.sunRay, disc = C.sun, inner = '#efc57d' } = {}) {
  return sheet()
    .p(c.cut(c.star(0, 0, r * 1.32, r * 1.05, 18, 0), 0.5, 5), rays)
    .p(c.cut(c.circ(0, 0, r, 40), 0.5, 5), disc)
    .p(c.cut(c.circ(-r * 0.1, -r * 0.12, r * 0.68, 30), 0.4, 5), inner).out();
}
export function moon(c, r = 44) {
  return sheet()
    .p(c.cut(c.circ(0, 0, r, 40), 0.5, 5), C.moon)
    .p(c.cut(c.circ(-r * 0.3, -r * 0.22, r * 0.2, 12), 0.3, 3) + c.cut(c.circ(r * 0.28, r * 0.2, r * 0.13, 10), 0.3, 3) + c.cut(c.circ(-r * 0.12, r * 0.42, r * 0.1, 9), 0.3, 3), '#e3d4b3').out();
}
export function cloud(c, w = 200, color = C.cream, under = '#eadcc0') {
  const h = w * 0.34, s = sheet();
  const pts = [[-w / 2, 0]];
  const bumps = 4 + c.ri(0, 2);
  for (let i = 0; i <= bumps; i++) {
    const cx = -w / 2 + (w * (i + 0.5)) / (bumps + 1), rr = (w / (bumps + 1)) * c.rr(0.65, 0.95) * (i === 0 || i === bumps ? 0.8 : 1.15);
    pts.push(...c.arc(cx, -h * 0.25, rr, rr * 0.95, PI, 2 * PI, 8).map(([x, y]) => [x, Math.min(y, 0)]));
  }
  pts.push([w / 2, 0]);
  s.p(c.cut([[-w / 2 + 4, -2], [w / 2 - 4, -2], [w / 2 - 10, 10], [-w / 2 + 10, 10]], 0.5, 8), under);
  s.p(c.cut(pts, 0.6, 7), color);
  return s.out();
}
/** hang(markup, len): puts an object on a string from the top of the box, like a fly system */
export function hang(inner, len = 300, color = 'rgba(74,54,34,.55)') {
  return `<g class="hang"><path d="M0 ${-len - 1200}V0" stroke="${color}" stroke-width="1.2" fill="none"/><g class="obj">${inner}</g></g>`;
}
export function stars(c, { x0, x1, y0, y1, n = 60, color = C.star }) {
  let d = '', d2 = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), y = c.rr(y0, y1), r = c.rr(1.2, 3.2);
    if (r > 2.6) d2 += c.poly(c.star(x, y, r * 2, r * 0.6, 4, 0)); else d += c.poly(c.circ(x, y, r, 6));
  }
  return `<path d="${d}" fill="${color}"/><path d="${d2}" fill="${color}"/>`;
}

/* ---------- towns ---------- */
export function house(c, x, y, w = 60, h = 44, { wall = C.plaster, shadow = C.plaster2, door = C.wood2, win = C.soilDark, roofEdge = C.roof, stairs = true, lit = false } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(x, y - h, w, h + 3), 0.5, 7), wall);
  s.p(c.cut([[x + w, y - h], [x + w + w * 0.22, y - h + 8], [x + w + w * 0.22, y + 3], [x + w, y + 3]], 0.4, 6), shadow);
  s.p(c.cut([[x - 3, y - h - 5], [x + w + 3, y - h - 5], [x + w + 3, y - h + 1], [x - 3, y - h + 1]], 0.3, 6), roofEdge);
  s.p(c.cut([[x + w * 0.2, y + 2], [x + w * 0.2, y - h * 0.42], ...c.arc(x + w * 0.29, y - h * 0.42, w * 0.09, w * 0.09, PI, 2 * PI, 6), [x + w * 0.38, y + 2]], 0.3, 5), door);
  s.x(c.poly(c.rect(x + w * 0.6, y - h * 0.72, w * 0.16, h * 0.18)), lit ? C.lampFlame : win, 'class="win"');
  if (stairs) {
    let d = '';
    for (let i = 0; i < 4; i++) d += c.poly(c.rect(x + w + w * 0.02 + i * 5, y - (i + 1) * (h / 5), 7, 3));
    s.p(d, shadow);
  }
  return s.out();
}

export function town(c, { x, y, n = 6, spread = 300, sc = 0.6, wall = C.plaster, shadow = C.plaster2, lit = false }) {
  let out = '';
  const xs = Array.from({ length: n }, () => c.rr(x - spread / 2, x + spread / 2)).sort((a, b) => a - b);
  xs.forEach((hx, i) => {
    const w = c.rr(40, 70) * sc, h = c.rr(30, 50) * sc, yy = y - c.rr(0, 30) * sc - (i % 2) * 8 * sc;
    out += house(c, hx, yy, w, h, { wall, shadow, stairs: c.chance(0.5), lit: lit && c.chance(0.6) });
  });
  return out;
}
