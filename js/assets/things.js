// Props, creatures and effects. Each returns SVG markup; animated parts carry class names or data-k.

import { sheet, shade } from '../core/paper.js';
import { C } from './palette.js';

const PI = Math.PI;
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- boat: split in two so people can stand inside ---------- */
export function boat(c, { hull = C.wood, stripe = C.terracotta, mast = false, cushion = false } = {}) {
  const back = sheet();
  back.p(c.cut([[-178, -52], [-150, -47], [-80, -44], [0, -44], [90, -45], [160, -52], [180, -64], [168, -28], [-168, -28]], 0.5, 8), shade(hull, -0.28));
  if (mast) {
    back.p(c.cut([[16, -30], [16, -330], [24, -330], [24, -30]], 0.3, 10), C.wood2);
    back.p(c.cut([[-60, -300], [104, -312], [104, -300], [-60, -288]], 0.3, 10), C.wood2);
    back.p(c.cut([[-50, -300], [96, -310], [90, -286], [-44, -278]], 0.8, 8), C.sail);
  }
  if (cushion) back.p(c.cut(c.blob(-136, -40, 26, 11, 10, 0.1), 0.4, 5), C.jesusMantle);
  const front = sheet();
  const hullPts = [[-196, -70], [-186, -52], [-150, -34], [-80, -29], [0, -29], [90, -31], [160, -40], [190, -76], [202, -74], [184, -22], [142, 6], [60, 20], [-40, 21], [-130, 11], [-178, -12]];
  front.p(c.cut(hullPts, 0.6, 9), hull);
  let planks = '';
  [[-8], [6]].forEach(([o]) => {
    planks += c.ribbon(c.qbez([-176, -30 + o], [0, 18 + o * 1.2], [180, -34 + o], 18), 1.4);
  });
  front.x(planks, shade(hull, -0.2), 'opacity=".55"');
  front.p(c.ribbon([[-190, -62], [-150, -30], [-80, -25], [0, -25], [90, -27], [160, -36], [194, -68]], 7), stripe);
  front.p(c.cut(c.circ(166, -38, 5, 8), 0.2, 3), C.cream);
  return { back: back.out(), front: front.out() };
}

/* ---------- lamp, lampstand, bushel, bed ---------- */
export function oilLamp(c, { k } = {}) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-30, -8], [-18, -16], [10, -16], [24, -12], [34, -16], [38, -12], [26, -2], [14, 2], [-18, 2]], 0.4, 5), C.pot);
  s.p(c.cut(c.circ(-4, -14, 7, 10), 0.2, 3), shade(C.pot, -0.3));
  s.p(c.cut([[-30, -8], [-40, -14], [-40, -8], [-32, -4]], 0.2, 4), shade(C.pot, -0.1));
  return `<g${k_(k)}><circle class="glow" cx="34" cy="-30" r="150" fill="url(#warm-glow)"/>${s.out()}<g class="flame" transform="translate(35 -16)"><path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/></g></g>`;
}
export function lampstand(c, h = 150) {
  return sheet()
    .p(c.cut([[-36, 0], [-24, -14], [-6, -20], [-5, -h], [-16, -h - 6], [16, -h - 6], [5, -h], [6, -20], [24, -14], [36, 0]], 0.5, 7), C.sun)
    .x(c.ribbon([[-5, -h * 0.5], [5, -h * 0.5]], 5), shade(C.sun, -0.25)).out();
}
export function bushel(c, w = 90, h = 70, { k } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2 - 6, 0], [-w / 2 + 6, 0]], 0.6, 7), C.basket);
  let bands = '';
  [0.18, 0.5, 0.82].forEach((f) => { const y = -h * f, ww = w / 2 - 6 * (1 - f); bands += c.ribbon([[-ww - 1, y], [ww + 1, y]], 5); });
  s.p(bands, shade(C.basket, -0.25));
  s.p(c.cut(c.ell(0, -h, w / 2, 7, 18), 0.3, 5), shade(C.basket, -0.4));
  return `<g${k_(k)}>${s.out()}</g>`;
}
export function bed(c, w = 220) {
  return sheet()
    .p(c.cut([[-w / 2, -34], [w / 2, -34], [w / 2, -24], [-w / 2, -24]], 0.4, 8), C.wood)
    .p(c.cut([[-w / 2 + 6, -24], [-w / 2 + 14, -24], [-w / 2 + 12, 0], [-w / 2 + 8, 0]], 0.3, 6) + c.cut([[w / 2 - 14, -24], [w / 2 - 6, -24], [w / 2 - 8, 0], [w / 2 - 12, 0]], 0.3, 6), C.wood2)
    .p(c.cut([[-w / 2 - 4, -46], [w / 2 + 2, -46], [w / 2 - 4, -34], [-w / 2, -34]], 0.6, 8), C.linen2)
    .p(c.cut(c.blob(-w / 2 + 26, -52, 26, 10, 10, 0.1), 0.4, 5), C.skyVeil).out();
}

/* ---------- grain & harvest ---------- */
export function seedPath(c, x, y, r = 3.4, rot = 0) { return c.poly(c.ell(x, y, r, r * 0.62, 8, rot)); }
export function grainPile(c, w = 90, h = 30, color = C.wheat) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], ...c.arc(0, 0, w / 2, h, PI, 2 * PI, 14)], 0.7, 5), color);
  let d = '';
  for (let i = 0; i < 26; i++) { const a = c.rr(PI * 1.08, PI * 1.92), rr = c.rr(0.2, 0.95); d += seedPath(c, Math.cos(a) * w / 2 * rr, Math.sin(a) * h * rr, 3, c.rr(0, 3)); }
  s.x(d, shade(color, -0.2), 'opacity=".7"');
  return s.out();
}
/** one wheat stalk: .stem scales from the ground, .ear swells at the top */
export function wheatStalk(c, { h = 120, k, color = C.wheatGreen, ear = C.wheat } = {}) {
  const lean = c.rr(-10, 10);
  const top = [lean, -h];
  const stem = c.qbez([0, 0], [lean * 0.2, -h * 0.5], top, 8);
  const s = sheet();
  s.p(c.ribbon(stem, (t) => 3.2 - t * 1.4), color);
  s.p(c.ribbon(c.qbez([0, -h * 0.25], [16, -h * 0.4], [26, -h * 0.3], 6), (t) => Math.sin(t * PI) * 6 + 0.6) + c.ribbon(c.qbez([0, -h * 0.45], [-14, -h * 0.58], [-22, -h * 0.5], 6), (t) => Math.sin(t * PI) * 5 + 0.6), color);
  const e = sheet();
  let grains = '';
  for (let i = 0; i < 7; i++) {
    const y = -i * 6.5;
    grains += c.cut(c.ell(-3.6, y, 3.4, 6, 8, -0.4), 0.2, 3) + c.cut(c.ell(3.6, y - 3, 3.4, 6, 8, 0.4), 0.2, 3);
  }
  grains += c.cut(c.ell(0, -46, 2.6, 6, 8), 0.2, 3);
  e.p(grains, ear);
  let awns = '';
  for (let i = 0; i < 6; i++) awns += c.ribbon([[0, -i * 6.5 - 4], [(i % 2 ? 1 : -1) * 14, -i * 6.5 - 26]], 0.8);
  e.x(awns, shade(ear, -0.15));
  return `<g${k_(k)} class="stalk"><g class="stem">${s.out()}</g><g class="ear" transform="translate(${lean} ${-h})">${e.out()}</g></g>`;
}
export function sprout(c, { k, color = C.leaf, h = 26 } = {}) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0.5, -h]], 2.4), color);
  s.p(c.cut([[0, -h * 0.8], [-8, -h * 1.1], [-16, -h * 1.05], [-9, -h * 0.82]], 0.3, 4) + c.cut([[0, -h * 0.9], [8, -h * 1.25], [17, -h * 1.2], [10, -h * 0.92]], 0.3, 4), color);
  return `<g${k_(k)} class="sprout">${s.out()}</g>`;
}
export function sickle(c) {
  return sheet()
    .p(c.cut([...c.arc(0, 0, 44, 44, PI * 1.05, PI * 1.95, 14), ...c.arc(6, 6, 34, 36, PI * 1.9, PI * 1.12, 12)], 0.3, 5), C.stone2)
    .p(c.cut([[-44, -4], [-40, 2], [-46, 44], [-54, 42]], 0.3, 5), C.wood).out();
}
export function sheaf(c, h = 110) {
  const s = sheet();
  let d = '';
  for (let i = 0; i < 14; i++) { const a = (i - 7) * 0.05; d += c.ribbon([[Math.sin(a) * 10, 0], [Math.sin(a) * 40, -h]], 3); }
  s.p(d, C.wheat2);
  let ears = '';
  for (let i = 0; i < 9; i++) { const a = (i - 4.5) * 0.09; ears += c.cut(c.ell(Math.sin(a) * h * 0.42, -h - 8, 5, 14, 8, a), 0.3, 4); }
  s.p(ears, C.wheat);
  s.p(c.ribbon([[-14, -h * 0.4], [14, -h * 0.4]], 7), C.rope);
  return s.out();
}

/* ---------- thorns ---------- */
export function thornBush(c, x, y, h = 120, color = C.thorn) {
  let d = '', sp = '';
  for (let i = 0; i < 6; i++) {
    const bx = x + c.rr(-30, 30), lean = c.rr(-60, 60), hh = h * c.rr(0.6, 1.1);
    const pts = c.cbez([bx, y], [bx + lean * 0.8, y - hh * 0.3], [bx - lean * 0.6, y - hh * 0.7], [bx + lean * 0.4, y - hh], 14);
    d += c.ribbon(pts, (t) => 5 - t * 3.5);
    pts.forEach(([px, py], j) => {
      if (j % 2 || j === 0) return;
      const sd = j % 4 ? 1 : -1;
      sp += c.poly([[px - 2, py], [px + sd * 11, py - 5], [px + 2, py - 3]]);
    });
  }
  return sheet().p(d + sp, color).out();
}

/* ---------- mustard tree, grown branch by branch ---------- */
export function mustardTree(c, { h = 420 } = {}) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-10, -h * 0.35], [-4, -h * 0.55], [6, -h * 0.55], [12, -h * 0.35], [18, 0]], 0.8, 8), C.wood2);
  const branches = [];
  const spec = [[-0.35, -0.9, 0.55], [0.4, 0.8, 0.5], [-0.5, -1.4, 0.62], [0.52, 1.35, 0.6], [-0.62, -0.55, 0.7], [0.66, 0.5, 0.7], [-0.8, -0.2, 0.9], [0.82, 0.15, 0.92], [-0.1, -0.2, 0.95], [0.12, 0.3, 0.98]];
  spec.forEach(([side, dir, f], i) => {
    const by = -h * (0.32 + f * 0.25), len = h * c.rr(0.34, 0.46);
    const end = [dir * len * 0.9, by - len * c.rr(0.5, 0.8)];
    const pts = c.qbez([0, by], [end[0] * 0.3, by - len * 0.5], end, 10);
    const b = sheet();
    b.p(c.ribbon(pts, (t) => 12 - t * 9), C.wood2);
    let lv = '', lv2 = '';
    for (let j = 0; j < 5; j++) {
      const p = pts[Math.min(pts.length - 1, 4 + j)];
      const lb = c.cut(c.blob(p[0] + c.rr(-20, 20), p[1] + c.rr(-16, 8), c.rr(26, 40), c.rr(18, 26), 10, 0.2), 0.8, 6);
      if (j % 2) lv += lb; else lv2 += lb;
    }
    b.p(lv2, C.moss).p(lv, C.leaf);
    let fl = '';
    for (let j = 0; j < 6; j++) { const p = pts[c.ri(3, pts.length - 1)]; fl += c.cut(c.circ(p[0] + c.rr(-30, 30), p[1] + c.rr(-20, 10), 3.2, 6), 0.1, 3); }
    b.x(fl, C.wheat);
    branches.push(`<g class="branch" data-i="${i}" transform="translate(0 ${by.toFixed(1)})"><g class="grow"><g transform="translate(0 ${(-by).toFixed(1)})">${b.out()}</g></g></g>`);
  });
  const crown = sheet().p(c.cut(c.blob(0, -h * 0.98, h * 0.3, h * 0.2, 14, 0.15), 1, 7), C.leaf).out();
  return `<g class="trunk">${s.out()}</g>${branches.join('')}<g class="crown" transform="translate(0 ${-h * 0.8})"><g class="grow"><g transform="translate(0 ${h * 0.8})">${crown}</g></g></g>`;
}

/* ---------- creatures ---------- */
export function bird(c, { color = C.bird, belly = C.birdLight, k } = {}) {
  const s = sheet();
  s.p(c.cut([[-18, -2], [-8, -8], [6, -8], [14, -4], [12, 3], [0, 6], [-12, 4], [-26, 6], [-30, 2]], 0.3, 4), color);
  s.p(c.cut([[-6, 2], [6, 1], [10, 4], [0, 6]], 0.2, 3), belly);
  s.p(c.cut(c.circ(14, -8, 6, 10), 0.2, 3), color);
  s.x(c.poly([[19, -9], [26, -7], [19, -6]]), C.ochre);
  s.x(c.poly(c.circ(16, -9.5, 1.3, 6)), C.ink);
  const wing = (dk) => `<path d="${c.cut([[0, 0], [-10, -22], [-20, -30], [-14, -12], [-6, -2]], 0.3, 4)}" fill="${dk}"/>`;
  return `<g${k_(k)} class="bird"><g class="wingB" transform="translate(-2 -6)">${wing(shade(color, -0.25))}</g>${s.out()}<g class="wingF" transform="translate(-2 -5)">${wing(shade(color, 0.12))}</g></g>`;
}
export function fish(c, { color = C.lake3, k } = {}) {
  return `<g${k_(k)}>${sheet().p(c.cut([[-22, 0], [-6, -9], [10, -8], [22, 0], [10, 8], [-6, 8], [-22, 0], [-32, -9], [-30, 0], [-32, 9]], 0.3, 4), color).x(c.poly(c.circ(12, -2, 1.6, 6)), C.ink).out()}</g>`;
}

/* ---------- effects ---------- */
export function rays(c, { n = 14, r0 = 60, r1 = 900, spread = 0.07, color = '#fff3cf' } = {}) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + c.rr(-0.05, 0.05), w = spread * c.rr(0.6, 1.3);
    d += c.poly([[Math.cos(a - w * 0.2) * r0, Math.sin(a - w * 0.2) * r0], [Math.cos(a - w) * r1, Math.sin(a - w) * r1], [Math.cos(a + w) * r1, Math.sin(a + w) * r1], [Math.cos(a + w * 0.2) * r0, Math.sin(a + w * 0.2) * r0]]);
  }
  return `<path d="${d}" fill="${color}"/>`;
}
export function ripples(c, n = 3, r = 40, color = C.cream) {
  let out = '';
  for (let i = 0; i < n; i++) out += `<path class="ripple" data-i="${i}" d="${c.ribbon(c.arc(0, 0, r, r, -0.7, 0.7, 10), 4)}" fill="${color}"/>`;
  return out;
}
export function lightning(c, len = 360) {
  const pts = [[0, 0]];
  let x = 0;
  for (let i = 1; i <= 7; i++) { x += c.rr(-26, 26); pts.push([x, (len * i) / 7]); }
  return `<path d="${c.ribbon(pts, (t) => 9 - t * 7)}" fill="#fff6d8"/>`;
}
export function rain(c, { x0, x1, y0, y1, n = 120, slant = -40, color = '#dfe6f0' }) {
  let d = '';
  for (let i = 0; i < n; i++) { const x = c.rr(x0, x1), y = c.rr(y0, y1), l = c.rr(24, 48); d += c.ribbon([[x, y], [x + slant * (l / 60), y + l]], 1.6); }
  return `<path d="${d}" fill="${color}" opacity=".55"/>`;
}
export function stormCloud(c, w = 420, color = C.storm, under = C.storm2) {
  const h = w * 0.3, s = sheet();
  const pts = [[-w / 2, 0]];
  for (let i = 0; i < 6; i++) {
    const cx = -w / 2 + (w * (i + 0.5)) / 6, rr = (w / 6) * c.rr(0.8, 1.25);
    pts.push(...c.arc(cx, -h * 0.2, rr, rr * 0.9, PI, 2 * PI, 8).map(([x, y]) => [x, Math.min(y, 0)]));
  }
  pts.push([w / 2, 0], [w / 2 - 20, 22], [-w / 2 + 20, 22]);
  s.p(c.cut([[-w / 2 + 10, 0], [w / 2 - 10, 0], [w / 2 - 30, 30], [-w / 2 + 30, 30]], 1, 8), under);
  s.p(c.cut(pts, 1.2, 7), color);
  return s.out();
}
/** a hand-cut numeral / glyph on a little paper tag */
export function paperLabel(text, { size = 34, fill = C.cream, ink = C.ink, w, k } = {}) {
  const ww = w || size * (0.62 * String(text).length + 0.8);
  const hh = size * 1.25;
  return `<g${k_(k)} class="label"><path d="M${-ww / 2} ${-hh / 2}L${ww / 2} ${-hh / 2 - 2}L${ww / 2 + 2} ${hh / 2}L${-ww / 2 - 1} ${hh / 2 + 1}Z" fill="${fill}"/><path class="grain" d="M${-ww / 2} ${-hh / 2}L${ww / 2} ${-hh / 2 - 2}L${ww / 2 + 2} ${hh / 2}L${-ww / 2 - 1} ${hh / 2 + 1}Z"/><text x="0" y="${size * 0.34}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${ink}">${text}</text></g>`;
}
export function ear(c, color = C.skin) {
  return sheet()
    .p(c.cut([[0, -40], [18, -36], [28, -20], [26, 0], [16, 16], [10, 34], [-2, 40], [-10, 34], [-4, 22], [-10, 6], [-16, -12], [-14, -30]], 0.4, 5), color)
    .x(c.ribbon(c.qbez([-4, -24], [16, -30], [12, -4], 10), 4), shade(color, -0.2))
    .x(c.ribbon(c.qbez([12, -4], [2, 6], [4, 22], 8), 3.4), shade(color, -0.2)).out();
}
