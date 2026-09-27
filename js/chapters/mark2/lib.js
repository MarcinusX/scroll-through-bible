// Mark 2 — local cut-outs and little helpers shared by this chapter's scenes.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().

import { C, sheet, shade, mix, person, crowdPerson } from '../kit.js';
import { ease } from '../../core/anim.js';

const PI = Math.PI;
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- choreography ---------- */

/** keyframes: kf(t, [[t0, v0], [t1, v1], …]) → eased value between the surrounding keys (numbers or [x, y]) */
export function kf(t, keys, fn = ease.io) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i];
      const u = fn(b > a ? (t - a) / (b - a) : 1);
      return Array.isArray(va) ? va.map((v, j) => v + (vb[j] - v) * u) : va + (vb - va) * u;
    }
  }
  return keys[keys.length - 1][1];
}
/** is a keyframed number changing around t? (drives the walk cycle) */
export const moving = (t, keys, eps = 0.4) => Math.abs(kf(t + 0.012, keys) - kf(t - 0.012, keys)) > eps * 0.024;

/** approximate position of a puppet's front hand (a: armF degrees) */
export function hand(x, y, s, flip, a, lean = 0, dy = 0) {
  const r = (a * PI) / 180, l = (lean * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dy - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  const rx = hx * Math.cos(l) - hy * Math.sin(l), ry = hx * Math.sin(l) + hy * Math.cos(l);
  return [x + (flip ? -1 : 1) * rx * s, y + ry * s];
}
/** head centre of a puppet (pose: stand 0, kneel 46, sit 62) */
export const headAt = (x, y, s, flip, dy = 0) => [x + (flip ? -2 : 2) * s, y + (-167 + dy) * s];
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ---------- people ---------- */

/** put extra pieces on a puppet's head (turban, wreath, phylactery…); head coords: face r≈18 at 0,0, looking +x */
export function addToHead(markup, extra) {
  return markup.replace('</g></g><g class="armF"', `${extra}</g></g><g class="armF"`);
}
function phylactery(c) {
  return sheet().p(c.ribbon(c.arc(0, 0, 19, 19, PI * 1.05, PI * 1.9, 10), 3), C.ink)
    .p(c.cut([[1, -27], [11, -26], [11, -17], [1, -18]], 0.2, 3), C.ink).out();
}
const SCRIBES = [
  { robe: C.stone, mantle: C.teal2, veil: C.linen, hair: C.greyHair, beard: 'full', skin: C.skin2 },
  { robe: C.linen2, mantle: shade(C.dustyBlue, -0.25), veil: C.stone, hair: C.hair3, beard: 'full', skin: C.skin3 },
  { robe: C.parchment, mantle: shade(C.plumRobe, -0.2), veil: C.linen2, hair: C.greyHair, beard: 'short', skin: C.skin },
  { robe: C.stone2, mantle: shade(C.teal2, 0.1), veil: C.linen, hair: C.hair2, beard: 'full', skin: C.skin4 },
];
/** a scribe / Pharisee: pale robe, dark prayer mantle, head wrap, phylactery on the forehead */
export function scribe(c, i = 0, extra = {}) {
  const o = SCRIBES[i % SCRIBES.length];
  return addToHead(person(c, { ...o, hairStyle: 'wrap', belt: null, ...extra }), phylactery(c));
}
/** one of John's disciples: rough camel-hair robe */
export function johnsOpts(c) {
  return { robe: c.pick([C.dune, mix(C.dune, C.sand2, 0.5), C.sand2]), fur: true, hair: c.pick([C.hair, C.hair3, C.hair2]), hairStyle: c.pick(['wild', 'short']), beard: c.pick(['wild', 'full']), skin: c.pick([C.skin2, C.skin3, C.skin4]), belt: C.leather };
}
export function johnsDisciple(c, extra = {}) {
  return person(c, { ...johnsOpts(c), ...extra });
}
/** a guest / townsperson (never veiled if man:true) */
export function townsfolk(c, extra = {}) {
  const o = crowdPerson(c);
  if (extra.man && o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; }
  delete extra.man;
  return { ...o, ...extra };
}

/* ---------- speech & thought ---------- */

function glyphQ(c, col = C.terracotta) {
  const hook = c.arc(0, -7, 7, 7, PI * 1.02, PI * 2.5, 12);
  hook.push([0, 5]);
  return sheet().x(c.ribbon(hook, 4.2), col).x(c.cut(c.circ(0, 12, 2.9, 8), 0.2, 2), col).out();
}
function glyphBang(c, col = C.terracotta) {
  return sheet().x(c.cut([[-3.4, -17], [3.4, -17], [1.6, 6], [-1.6, 6]], 0.3, 4), col).x(c.cut(c.circ(0, 13, 3, 8), 0.2, 2), col).out();
}
function glyphFrown(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 15, 20), 0.3, 4), C.skin2);
  s.x(c.ribbon([[-9, -8], [-2, -4]], 2.2) + c.ribbon([[9, -8], [2, -4]], 2.2), C.ink);
  s.x(c.poly(c.circ(-5, -1, 1.8, 6)) + c.poly(c.circ(5, -1, 1.8, 6)), C.ink);
  s.x(c.ribbon(c.arc(0, 10, 6, 4, PI * 1.15, PI * 1.85, 6), 1.8), C.ink);
  return s.out();
}
function glyphStorm(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(-7, -2, 9, 8, PI, 2 * PI, 6), ...c.arc(5, -5, 10, 10, PI, 2 * PI, 6), [16, 4], [-17, 4]], 0.4, 4), C.storm);
  s.x(c.poly([[1, 3], [-4, 11], [0, 11], [-3, 19], [5, 9], [1, 9], [4, 3]]), C.sun);
  return s.out();
}
function glyphStar(c) {
  const s = sheet();
  s.x(c.poly(c.star(-6, 0, 12, 5, 8, 0.2)), C.sun);
  s.x(c.poly(c.circ(-6, 0, 4.5, 8)), C.star);
  return s.out() + `<g transform="translate(12 0) scale(.8)">${glyphQ(c)}</g>`;
}
export const GLYPH = { q: glyphQ, bang: glyphBang, frown: glyphFrown, storm: glyphStorm, star: glyphStar };

/** a thought bubble; origin just above the head, the cloud floats up-right. inner: glyph markup */
export function thought(c, inner, { w = 64, h = 50, fill = C.cream } = {}) {
  const s = sheet();
  const cx = 16, cy = -58;
  const pts = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2, a2 = ((i + 1) / n) * PI * 2;
    const x1 = cx + Math.cos(a) * w / 2, y1 = cy + Math.sin(a) * h / 2, x2 = cx + Math.cos(a2) * w / 2, y2 = cy + Math.sin(a2) * h / 2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(my - cy, mx - cx);
    pts.push(...c.qbez([x1, y1], [mx + Math.cos(ang) * 12, my + Math.sin(ang) * 12], [x2, y2], 5).slice(0, -1));
  }
  s.p(c.cut(pts, 0.4, 5), fill);
  s.p(c.cut(c.circ(2, -16, 5, 10), 0.2, 3) + c.cut(c.circ(-3, -4, 3, 8), 0.2, 2), fill);
  return `${s.out()}<g transform="translate(${cx} ${cy})">${inner}</g>`;
}
/** a speech bubble; origin at the tip of its tail (tail points down-left by default) */
export function speech(c, inner, { w = 70, h = 50, fill = C.cream, flip = false } = {}) {
  const d = flip ? -1 : 1;
  const s = sheet();
  const cx = d * (w / 2 - 6), cy = -h / 2 - 16;
  s.p(c.cut([...c.blob(cx, cy, w / 2, h / 2, 14, 0.05), [d * 12, -12], [0, 0], [d * 4, -16]], 0.5, 5), fill);
  return `${s.out()}<g transform="translate(${cx} ${cy})">${inner}</g>`;
}
/** a slip of paper with a scribbled line on it — words flying out as He teaches */
export function wordSlip(c, w = 34) {
  return `<g>${wordSlipInner(c, w)}</g>`;
}
function wordSlipInner(c, w) {
  const s = sheet().p(c.cut([[-w / 2, -7], [w / 2, -8], [w / 2 + 1, 7], [-w / 2 - 1, 8]], 0.4, 6), C.cream);
  let d = '';
  let x = -w / 2 + 5;
  while (x < w / 2 - 6) { const l = c.rr(4, 10); d += c.ribbon([[x, c.rr(-1, 1)], [Math.min(x + l, w / 2 - 5), c.rr(-1, 1)]], 1.6); x += l + 3; }
  s.x(d, C.ink, 'opacity=".55"');
  return s.out();
}
/** a small warm spark / glint */
export function spark(c, r = 11, col = C.halo) {
  const s = sheet().p(c.cut(c.star(0, 0, r, r * 0.36, 4, 0), 0.2, 3), col).x(c.poly(c.circ(0, 0, r * 0.27, 8)), C.star);
  return `<circle r="${r * 3}" fill="url(#warm-glow)" opacity=".7"/>${s.out()}`;
}
/** a little paper heart (faith, love) */
export function heart(c, r = 14, col = C.jesusMantle) {
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * PI * 2;
    pts.push([16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16]);
  }
  return `<circle r="${r * 2.6}" fill="url(#warm-glow)" opacity=".8"/>` + sheet().p(c.cut(pts, 0.3, 4), col).x(c.poly(c.ell(-r * 0.4, -r * 0.35, r * 0.22, r * 0.14, 8, -0.6)), shade(col, 0.4)).out();
}
/** a dark scrap of paper (a sin, peeled off and dissolving into light) */
export function scrap(c, r = 14) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * c.rr(0.55, 0.85), 7, 0.4), 1.4, 4), c.pick([C.storm2, C.soilDark, shade(C.storm, -0.2), C.thorn2])).out();
}
/** a puff of dust (roof coming apart, grain rubbed) */
export function dust(c, r = 26, col = C.sand) {
  let d = '';
  for (let i = 0; i < 5; i++) d += c.cut(c.blob(c.rr(-r, r) * 0.7, c.rr(-r, r) * 0.4, r * c.rr(0.35, 0.6), r * c.rr(0.3, 0.5), 9, 0.25), 0.6, 4);
  return `<path d="${d}" fill="${col}" opacity=".75"/>`;
}

/* ---------- the paralytic's mat ---------- */

/** a reed mat on a light frame, seen from the side; origin at the middle of its top surface */
export function pallet(c, w = 190) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 2, 9], [-w / 2 + 2, 9]], 0.4, 8), C.basket);
  let weave = '';
  for (let x = -w / 2 + 8; x < w / 2 - 4; x += 12) weave += c.ribbon([[x, 1], [x + 3, 8]], 2.4);
  s.x(weave, shade(C.basket, -0.22), 'opacity=".7"');
  s.p(c.cut([[-w / 2 - 6, 8], [w / 2 + 6, 8], [w / 2 + 6, 14], [-w / 2 - 6, 14]], 0.3, 8), C.wood2);
  let fringe = '';
  for (let i = 0; i < 5; i++) fringe += c.ribbon([[-w / 2 - 6, 2 + i * 2.4], [-w / 2 - 14, 3 + i * 2.8]], 1.2) + c.ribbon([[w / 2 + 6, 2 + i * 2.4], [w / 2 + 14, 3 + i * 2.8]], 1.2);
  s.x(fringe, C.wheat2);
  // pillow at the head end (left)
  s.p(c.cut(c.blob(-w / 2 + 24, -8, 24, 9, 10, 0.1), 0.4, 5), C.skyVeil);
  return s.out();
}
/** the blanket over the paralytic's legs (origin: mat top-centre; fits matWithMan) */
export function blanket(c) {
  const s = sheet();
  const pts = [[-10, -50], [8, -58], [40, -64], [70, -62], [84, -46], [89, -16], [92, 6]];
  for (let x = 92; x > -8; x -= 17) pts.push(...c.arc(x - 8.5, 6, 8.5, 4, 0, PI, 3));
  pts.push([-12, -24]);
  s.p(c.cut(pts, 0.6, 7), C.dustyBlue);
  let pat = '';
  for (let x = 4; x < 86; x += 20) pat += c.cut(c.star(x, -22, 5, 2.2, 4, 0), 0.2, 3);
  s.x(pat, C.cream, 'opacity=".75"');
  s.x(c.ribbon([[-8, -8], [90, -6]], 3), C.cream, 'opacity=".5"');
  return s.out();
}
/** the mat rolled up (with the blanket inside); origin at its centre */
export function rolledMat(c, w = 120) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -10], [w / 2, -10], [w / 2, 10], [-w / 2, 10]], 0.4, 8), C.basket);
  let weave = '';
  for (let x = -w / 2 + 6; x < w / 2; x += 11) weave += c.ribbon([[x, -9], [x + 2, 9]], 2);
  s.x(weave, shade(C.basket, -0.22), 'opacity=".6"');
  s.p(c.cut(c.ell(w / 2, 0, 6, 11, 14), 0.3, 4), shade(C.basket, 0.12));
  s.x(c.ribbon(c.arc(w / 2, 0, 4, 7, 0, PI * 3, 14), 1.2), C.wood2);
  s.p(c.ribbon([[-w * 0.3, -11], [-w * 0.3 + 2, 11]], 4) + c.ribbon([[w * 0.25, -11], [w * 0.25 + 2, 11]], 4), C.rope);
  s.p(c.cut([[-w / 2 - 2, -6], [-w / 2 + 8, -8], [-w / 2 + 8, 8], [-w / 2 - 2, 6]], 0.3, 4), C.dustyBlue);
  return s.out();
}
/** a rope hanging straight up from its origin, 1 unit per unit of length — scale sy to stretch */
export function rope(c, len = 100, w = 2.4) {
  return `<path d="${c.ribbon([[0, 0], [0.6, -len * 0.5], [0, -len]], w)}" fill="${C.rope}"/>`;
}

/* ---------- money & the tax office ---------- */
export function coin(c, r = 8) {
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.3, 3), C.sun).p(c.cut(c.circ(0, 0, r * 0.62, 10), 0.2, 3), shade(C.sun, -0.18))
    .x(c.poly(c.circ(-r * 0.3, -r * 0.3, r * 0.2, 6)), C.star).out();
}
export function coinStack(c, n = 5, r = 9) {
  const s = sheet();
  let d = '', e = '';
  for (let i = 0; i < n; i++) {
    const y = -i * 4.2, x = c.rr(-1.2, 1.2);
    d += c.cut([[x - r, y], [x - r, y - 4], [x + r, y - 4], [x + r, y]], 0.2, 4);
    e += c.ribbon([[x - r + 1, y - 2], [x + r - 1, y - 2]], 0.8);
  }
  s.p(d, C.sun).x(e, shade(C.sun, -0.3), 'opacity=".6"');
  s.p(c.cut(c.ell(0, -n * 4.2 - 1, r, 2.6, 12), 0.2, 3), shade(C.sun, 0.18));
  return s.out();
}
/** an open ledger scroll lying on a counter; origin: bottom centre */
export function ledger(c, w = 70) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -2], [w / 2, -2], [w / 2 - 4, -16], [-w / 2 + 4, -16]], 0.3, 6), C.parchment);
  let lines = '';
  for (let i = 0; i < 3; i++) lines += c.ribbon([[-w / 2 + 10 + i * 2, -12 + i * 3.5], [w / 2 - 12 + c.rr(-8, 0), -12 + i * 3.5]], 1.2);
  s.x(lines, C.ink, 'opacity=".5"');
  s.p(c.cut(c.ell(-w / 2 - 1, -7, 5, 8, 10), 0.2, 3) + c.cut(c.ell(w / 2 + 1, -7, 5, 8, 10), 0.2, 3), C.wood2);
  return s.out();
}
/** a small hand-balance for weighing coins; origin: base centre */
export function coinScale(c) {
  const s = sheet();
  s.p(c.cut([[-12, 0], [12, 0], [4, -6], [2, -46], [-2, -46], [-4, -6]], 0.3, 5), C.ochre);
  s.p(c.ribbon([[-30, -44], [30, -44]], 3), C.ochre);
  s.x(c.ribbon([[-28, -44], [-36, -22]], 0.8) + c.ribbon([[-28, -44], [-20, -22]], 0.8) + c.ribbon([[28, -44], [20, -22]], 0.8) + c.ribbon([[28, -44], [36, -22]], 0.8), C.ink, 'opacity=".5"');
  s.p(c.cut(c.arc(-28, -22, 11, 6, 0, PI, 8), 0.2, 3) + c.cut(c.arc(28, -22, 11, 6, 0, PI, 8), 0.2, 3), shade(C.ochre, -0.12));
  return s.out();
}
/** the tax booth: {back, front}; origin at the ground centre. The seated clerk goes between them. */
export function taxBooth(c, w = 250, h = 250) {
  const b = sheet();
  // posts & back wall
  b.p(c.cut(c.rect(-w / 2 + 6, -h, 12, h), 0.4, 8) + c.cut(c.rect(w / 2 - 18, -h, 12, h), 0.4, 8), C.wood2);
  b.p(c.cut(c.rect(-w / 2 + 18, -h + 30, w - 36, h - 30), 0.6, 10), mix(C.plaster, C.sand, 0.35));
  let planks = '';
  for (let x = -w / 2 + 40; x < w / 2 - 20; x += 26) planks += c.ribbon([[x, -h + 34], [x + c.rr(-2, 2), -4]], 1.4);
  b.x(planks, shade(C.sand, -0.15), 'opacity=".5"');
  // shelf with jars & a strongbox
  b.p(c.cut(c.rect(-w / 2 + 30, -h + 96, w * 0.5, 7), 0.3, 6), C.wood);
  b.p(c.cut([[-w / 2 + 44, -h + 96], [-w / 2 + 40, -h + 76], [-w / 2 + 50, -h + 64], [-w / 2 + 60, -h + 76], [-w / 2 + 56, -h + 96]], 0.4, 4), C.pot);
  b.p(c.cut(c.rect(-w / 2 + 76, -h + 72, 40, 24), 0.4, 5), C.wood2);
  b.p(c.cut(c.rect(-w / 2 + 92, -h + 80, 8, 8), 0.2, 3), C.ochre);
  // striped awning
  const aw = sheet();
  const ay = -h;
  const pts = [[-w / 2 - 20, ay + 6], [-w / 2 + 6, ay - 34], [w / 2 - 6, ay - 34], [w / 2 + 20, ay + 6]];
  for (let x = w / 2 + 20; x > -w / 2 - 20; x -= 30) pts.push(...c.arc(x - 15, ay + 6, 15, 10, 0, PI, 5));
  aw.p(c.cut(pts, 0.5, 8), C.cream);
  let stripes = '';
  for (let x = -w / 2 - 6; x < w / 2 + 20; x += 60) stripes += c.cut([[x, ay + 12], [x + 8, ay - 32], [x + 34, ay - 32], [x + 30, ay + 14]], 0.4, 6);
  aw.x(stripes, C.terracotta, 'opacity=".85"');
  const f = sheet();
  // the counter
  f.p(c.cut([[-w / 2 - 4, -96], [w / 2 + 4, -96], [w / 2 + 4, -84], [-w / 2 - 4, -84]], 0.4, 8), C.wood);
  f.p(c.cut(c.rect(-w / 2 + 2, -84, w - 4, 84), 0.6, 10), C.wood3);
  let boards = '';
  for (let y = -70; y < 0; y += 20) boards += c.ribbon([[-w / 2 + 4, y], [w / 2 - 4, y + c.rr(-1.5, 1.5)]], 1.4);
  f.x(boards, shade(C.wood3, -0.2), 'opacity=".6"');
  // a coin sign on the front
  f.p(c.cut(c.circ(0, -46, 20, 18), 0.4, 4), C.sun).p(c.cut(c.circ(0, -46, 13, 14), 0.3, 3), shade(C.sun, -0.15));
  f.x(c.poly(c.rect(-3, -54, 6, 16)), shade(C.sun, -0.4));
  return { back: b.out() + aw.out(), front: f.out() };
}

/* ---------- the table ---------- */
/** a long low table with a cloth; origin: floor centre */
export function lowTable(c, w = 520, h = 44) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 16, -h + 6, 10, h - 6), 0.3, 6) + c.cut(c.rect(w / 2 - 26, -h + 6, 10, h - 6), 0.3, 6), C.wood2);
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2, -h + 8], [-w / 2, -h + 8]], 0.4, 10), C.wood);
  // cloth hanging over the front
  const pts = [[-w / 2 + 4, -h + 2], [w / 2 - 4, -h + 2], [w / 2 - 8, -h + 22]];
  for (let x = w / 2 - 8; x > -w / 2 + 8; x -= 26) pts.push(...c.arc(x - 13, -h + 22, 13, 6, 0, PI, 4));
  s.p(c.cut(pts, 0.5, 8), C.cream);
  let pat = '';
  for (let x = -w / 2 + 20; x < w / 2 - 10; x += 26) pat += c.cut(c.star(x, -h + 14, 4, 1.8, 4, 0), 0.2, 3);
  s.x(pat, C.terracotta, 'opacity=".55"');
  return s.out();
}
/** a bowl, side view; origin: bottom centre. food: 'stew' | 'bread' | 'fruit' | null */
export function bowl(c, { w = 34, color = C.pot, food = 'stew' } = {}) {
  const s = sheet();
  if (food === 'stew') s.p(c.cut(c.arc(0, -w * 0.34, w * 0.44, w * 0.16, PI, 2 * PI, 8), 0.3, 3), C.ochre);
  if (food === 'fruit') s.p(c.cut(c.circ(-w * 0.18, -w * 0.4, w * 0.16, 8), 0.2, 3) + c.cut(c.circ(w * 0.14, -w * 0.42, w * 0.15, 8), 0.2, 3), C.plumRobe).p(c.cut(c.circ(0, -w * 0.5, w * 0.16, 8), 0.2, 3), C.olive);
  if (food === 'bread') s.p(c.cut(c.ell(0, -w * 0.4, w * 0.34, w * 0.16, 12), 0.3, 3), C.wheat2);
  s.p(c.cut([[-w / 2, -w * 0.36], [w / 2, -w * 0.36], [w * 0.3, -2], [w * 0.14, 0], [-w * 0.14, 0], [-w * 0.3, -2]], 0.4, 5), color);
  s.x(c.ribbon([[-w * 0.42, -w * 0.28], [w * 0.42, -w * 0.28]], 1.6), shade(color, -0.2), 'opacity=".6"');
  return s.out();
}
/** a flat round loaf; origin: bottom centre */
export function loaf(c, r = 18, col = C.wheat2) {
  const s = sheet().p(c.cut([[-r, 0], ...c.arc(0, 0, r, r * 0.52, PI, 2 * PI, 10), [r, 0]], 0.4, 4), col);
  s.x(c.ribbon(c.arc(0, -r * 0.1, r * 0.55, r * 0.22, PI * 1.2, PI * 1.8, 5), 1.4) + c.ribbon(c.arc(0, -r * 0.05, r * 0.3, r * 0.12, PI * 1.25, PI * 1.75, 4), 1.2), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}
export function cup(c, col = C.pot) {
  return sheet().p(c.cut([[-9, -20], [9, -20], [6, -8], [2, -6], [3, 0], [-3, 0], [-2, -6], [-6, -8]], 0.3, 4), col)
    .x(c.cut(c.ell(0, -19, 8, 2, 8), 0.2, 3), shade(C.plumRobe, -0.4)).out();
}
export function grapes(c, r = 5) {
  let d = '';
  const rows = [[0, 4], [1, 3], [2, 2], [3, 1]];
  rows.forEach(([row, n]) => { for (let i = 0; i < n; i++) d += c.cut(c.circ((i - (n - 1) / 2) * r * 1.7, -r * 4 * 1.0 + row * r * 1.5 - 0, r, 8), 0.2, 3); });
  return sheet().p(d, C.plumRobe).x(c.ribbon([[0, -r * 4.8], [2, -r * 6.2]], 1.6), C.moss).out();
}
export function fishDish(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -4, 34, 5, 16), 0.3, 4), C.stone2);
  s.p(c.cut([[-24, -8], [-8, -16], [10, -15], [22, -9], [10, -4], [-8, -4], [-24, -8], [-32, -15], [-30, -8], [-32, -2]], 0.3, 4), C.lake3);
  s.x(c.poly(c.circ(12, -11, 1.4, 6)), C.ink);
  return s.out();
}

/* ---------- festive things ---------- */
/** a paper lantern; origin at its hook. .glow can be faded */
export function lantern(c, { col = C.apricot, k } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-7, 0, 14, 6), 0.2, 4), C.wood2);
  s.p(c.cut(c.ell(0, 26, 17, 21, 20), 0.4, 5), col);
  let ribs = '';
  for (let i = -1; i <= 1; i++) ribs += c.ribbon(c.qbez([i * 4, 7], [i * 15, 26], [i * 4, 45], 8), 1.2);
  s.x(ribs, shade(col, -0.2), 'opacity=".7"');
  s.p(c.cut(c.rect(-7, 44, 14, 5), 0.2, 4), C.wood2);
  s.x(c.ribbon([[0, 49], [0, 60]], 1.6) + c.cut(c.ell(0, 62, 3, 4, 8), 0.2, 3), C.terracotta);
  return `<g${k_(k)}><circle class="glow" cx="0" cy="26" r="70" fill="url(#warm-glow)"/>${s.out()}</g>`;
}
/** a swag of leaves and flowers from (0,0) to (w,0); origin at its left end */
export function garland(c, w = 300, sag = 50) {
  const pts = c.qbez([0, 0], [w / 2, sag * 2], [w, 0], 22);
  const s = sheet();
  s.p(c.ribbon(pts, 3), C.moss2);
  let lv = '', lv2 = '', fl = '', fl2 = '';
  pts.forEach(([x, y], i) => {
    const a = c.rr(0, PI * 2);
    const leaf = c.cut(c.ell(x + Math.cos(a) * 6, y + Math.sin(a) * 4 + 4, 9, 4, 8, a), 0.3, 3);
    if (i % 2) lv += leaf; else lv2 += leaf;
    if (i % 3 === 1) fl += c.cut(c.star(x, y + 6, 7, 3.4, 5, c.rr(0, 6)), 0.2, 3);
    if (i % 5 === 3) fl2 += c.cut(c.star(x + 4, y + 2, 6, 3, 5, c.rr(0, 6)), 0.2, 3);
  });
  s.p(lv2, C.moss).p(lv, C.leaf).p(fl, C.cream).p(fl2, C.jesusMantle);
  return s.out();
}
/** a wedding canopy (cloth with a scalloped fringe); origin: top-centre of the cloth */
export function canopy(c, w = 420, h = 44) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0], [w / 2, h]];
  for (let x = w / 2; x > -w / 2; x -= 30) pts.push(...c.arc(x - 15, h, 15, 12, 0, PI, 5));
  s.p(c.cut(pts, 0.5, 8), C.cream);
  let pat = '';
  for (let x = -w / 2 + 15; x < w / 2; x += 30) pat += c.cut(c.star(x, h * 0.45, 6, 2.6, 4, 0), 0.2, 3);
  s.x(pat, C.terracotta, 'opacity=".7"');
  s.p(c.ribbon([[-w / 2, 3], [w / 2, 3]], 6), C.ochre);
  let tassels = '';
  for (let x = -w / 2 + 15; x < w / 2; x += 30) tassels += c.cut(c.circ(x, h + 16, 3.4, 6), 0.2, 2);
  s.x(tassels, C.ochre);
  return s.out();
}
/** a wreath of flowers for a head (use with addToHead) */
export function wreath(c) {
  let d = '', fl = '';
  for (let i = 0; i < 9; i++) {
    const a = PI * (1.02 + i * 0.1);
    d += c.cut(c.ell(Math.cos(a) * 19, Math.sin(a) * 19 - 2, 6, 3.4, 8, a + PI / 2), 0.2, 3);
    if (i % 2 === 0) fl += c.cut(c.star(Math.cos(a) * 20, Math.sin(a) * 20 - 3, 5, 2.4, 5, i), 0.2, 2);
  }
  return sheet().p(d, C.leaf).p(fl, C.cream).out();
}
export function tambourine(c) {
  const s = sheet().p(c.cut(c.circ(0, 0, 16, 18), 0.3, 4), C.wood3).p(c.cut(c.circ(0, 0, 12, 16), 0.2, 3), C.parchment);
  let j = '';
  for (let i = 0; i < 5; i++) { const a = (i / 5) * PI * 2; j += c.cut(c.circ(Math.cos(a) * 14, Math.sin(a) * 14, 3, 6), 0.1, 2); }
  return s.x(j, C.sun).out();
}

/* ---------- cloth ---------- */
const HOLE = [24, 92];
/** an old cloak hanging on a line, with a worn hole; origin: middle of the hanging line. big: the torn hole */
export function cloak(c, { big = false, col = mix(C.dustyBlue, C.stone, 0.5) } = {}) {
  const s = sheet();
  const [hx, hy] = HOLE;
  const hole = big
    ? c.hole([[hx - 34, hy + 2], [hx - 22, hy - 26], [hx - 4, hy - 34], [hx + 16, hy - 30], [hx + 36, hy - 8], [hx + 32, hy + 22], [hx + 12, hy + 38], [hx - 10, hy + 34], [hx - 28, hy + 22]], 3, 5)
    : c.hole(c.blob(hx, hy, 12, 9, 9, 0.3), 1.4, 4);
  const body = [[-70, 0], [-26, 0], [-18, 8], [0, 12], [18, 8], [26, 0], [70, 0], [96, 30], [84, 58], [58, 40], [58, 170], [30, 176], [0, 172], [-30, 176], [-58, 170], [-58, 40], [-84, 58], [-96, 30]];
  s.p(c.cut(body, 1.2, 9) + hole, col);
  // fading and worn spots
  let worn = '';
  for (let i = 0; i < 7; i++) worn += c.cut(c.blob(c.rr(-50, 50), c.rr(40, 160), c.rr(8, 16), c.rr(5, 10), 8, 0.3), 0.6, 4);
  s.x(worn, shade(col, 0.22), 'opacity=".55"');
  s.x(c.ribbon([[-58, 150], [58, 150]], 5) + c.ribbon([[-58, 160], [58, 160]], 2.4), shade(col, -0.18), 'opacity=".6"');
  if (big) {
    // frayed threads around the torn hole
    let fr = '';
    for (let i = 0; i < 14; i++) { const a = (i / 14) * PI * 2; fr += c.ribbon([[hx + Math.cos(a) * 30, hy + Math.sin(a) * 28], [hx + Math.cos(a + 0.1) * 24, hy + Math.sin(a + 0.1) * 22]], 1); }
    s.x(fr, shade(col, -0.3));
  }
  return s.out();
}
export const CLOAK_HOLE = HOLE;
/** the new patch (bright unshrunk cloth) with stitches; origin: its centre */
export function patch(c, { flap = false } = {}) {
  const s = sheet();
  if (flap) s.p(c.cut([[-22, -16], [-30, -26], [-10, -32], [12, -30], [26, -18], [30, 4], [18, 24], [-10, 28], [-28, 18], [-34, -2]], 2.4, 4), mix(C.dustyBlue, C.stone, 0.5));
  s.p(c.cut(c.rect(-20, -18, 40, 36), 0.6, 6), C.terracotta);
  s.x(c.ribbon([[-20, -6], [20, -6]], 3) + c.ribbon([[-20, 6], [20, 6]], 3), shade(C.terracotta, 0.3), 'opacity=".6"');
  let st = '';
  for (let i = 0; i < 6; i++) { const x = -16 + i * 6.4; st += c.ribbon([[x, -21], [x + 2, -15]], 1.1) + c.ribbon([[x, 15], [x + 2, 21]], 1.1); }
  for (let i = 0; i < 5; i++) { const y = -13 + i * 6.4; st += c.ribbon([[-23, y], [-17, y + 2]], 1.1) + c.ribbon([[17, y], [23, y + 2]], 1.1); }
  s.x(st, C.cream);
  return s.out();
}
export function needle(c) {
  return sheet().p(c.ribbon([[0, 0], [30, -10]], 2.2), C.stone2).x(c.poly(c.ell(26, -8.6, 2.2, 0.8, 6, -0.32)), C.ink)
    .x(c.ribbon(c.cbez([27, -9], [40, -20], [30, -40], [48, -54], 14), 1.1), C.cream).out();
}

/* ---------- wine ---------- */
export const WINE = shade(C.plumRobe, -0.3);
/** a wineskin hanging by its neck from origin (0,0). old: cracked, dark and patched */
export function wineskin(c, { old = false, w = 62, h = 96 } = {}) {
  const col = old ? mix(C.leather, C.soilDark, 0.35) : mix(C.clay, C.wood3, 0.4);
  const s = sheet();
  s.p(c.cut([[-7, 0], [7, 0], [9, 16], [w * 0.5, 30], [w * 0.62, 58], [w * 0.52, h * 0.86], [w * 0.2, h], [-w * 0.2, h], [-w * 0.5, h * 0.86], [-w * 0.62, 58], [-w * 0.5, 30], [-9, 16]], old ? 1.2 : 0.6, 6), col);
  // leg stubs
  s.p(c.cut([[w * 0.44, 36], [w * 0.7, 30], [w * 0.72, 38], [w * 0.5, 46]], 0.4, 4) + c.cut([[-w * 0.44, 36], [-w * 0.7, 30], [-w * 0.72, 38], [-w * 0.5, 46]], 0.4, 4), shade(col, -0.1));
  s.p(c.ribbon([[-9, 10], [9, 10]], 4), C.rope);
  if (old) {
    let cr = '';
    for (let i = 0; i < 6; i++) { const x = c.rr(-w * 0.4, w * 0.4), y = c.rr(34, h * 0.9); cr += c.ribbon([[x, y], [x + c.rr(-8, 8), y + c.rr(6, 14)], [x + c.rr(-10, 10), y + c.rr(14, 22)]], 1.2); }
    s.x(cr, C.soilRich, 'opacity=".8"');
    s.p(c.cut(c.rect(w * 0.08, h * 0.56, 18, 14), 0.4, 4), shade(C.leather, 0.25));
  } else {
    s.x(c.cut(c.ell(-w * 0.2, 50, 8, 20, 12, 0.3), 0.3, 4), shade(col, 0.35), 'opacity=".55"');
  }
  return s.out();
}
/** one torn half of a burst old wineskin (side -1 left / 1 right); origin as the whole skin */
export function skinHalf(c, side = -1, w = 62, h = 96) {
  const col = mix(C.leather, C.soilDark, 0.35);
  const pts = side < 0
    ? [[-7, 0], [2, 0], [0, 20], [6, 34], [-4, 50], [8, 66], [-2, 80], [4, h], [-w * 0.2, h], [-w * 0.5, h * 0.86], [-w * 0.62, 58], [-w * 0.5, 30], [-9, 16]]
    : [[2, 0], [7, 0], [9, 16], [w * 0.5, 30], [w * 0.62, 58], [w * 0.52, h * 0.86], [w * 0.2, h], [4, h], [-2, 80], [8, 66], [-4, 50], [6, 34], [0, 20]];
  return sheet().p(c.cut(pts, 1.4, 5), col).out();
}
/** a jug for pouring; origin at the base; the spout is at about (30, -70) */
export function jug(c, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-28, -24], [-24, -50], [-12, -62], [-10, -72], [16, -76], [30, -72], [14, -64], [18, -50], [26, -24], [18, 0]], 0.5, 5), col);
  s.p(c.ribbon(c.qbez([-20, -62], [-44, -52], [-24, -30], 8), 5), shade(col, -0.12));
  s.x(c.ribbon([[-26, -30], [24, -30]], 3), C.cream, 'opacity=".5"');
  return s.out();
}
/** a splash of wine drops (origin: centre) */
export function splash(c, r = 30) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a = c.rr(PI * 1.05, PI * 1.95); d += c.cut(c.ell(Math.cos(a) * r * c.rr(0.5, 1), Math.sin(a) * r * c.rr(0.5, 1), c.rr(3, 6), c.rr(4, 9), 8, a), 0.2, 3); }
  return `<path d="${d}" fill="${WINE}"/>`;
}

/* ---------- writing & worship ---------- */
/** an open scroll; origin centre */
export function scrollOpen(c, w = 90, h = 60) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), C.parchment);
  let lines = '';
  for (let y = -h / 2 + 10; y < h / 2 - 6; y += 8) lines += c.ribbon([[-w / 2 + 10, y], [w / 2 - 10 - c.rr(0, 16), y + c.rr(-0.6, 0.6)]], 1.5);
  s.x(lines, C.ink, 'opacity=".45"');
  s.p(c.cut(c.rect(-w / 2 - 9, -h / 2 - 6, 10, h + 12), 0.3, 5) + c.cut(c.rect(w / 2 - 1, -h / 2 - 6, 10, h + 12), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 12, 4, 6), 0.2, 3) + c.cut(c.rect(w / 2 + 2, -h / 2 - 12, 4, 6), 0.2, 3) + c.cut(c.rect(-w / 2 - 6, h / 2 + 6, 4, 6), 0.2, 3) + c.cut(c.rect(w / 2 + 2, h / 2 + 6, 4, 6), 0.2, 3), C.ochre);
  return s.out();
}
/** a rolled scroll held upright; origin centre */
export function scrollRolled(c, h = 46) {
  return sheet().p(c.cut(c.rect(-8, -h / 2, 16, h), 0.3, 5), C.parchment).p(c.cut(c.rect(-3, -h / 2 - 7, 6, 7), 0.2, 3) + c.cut(c.rect(-3, h / 2, 6, 7), 0.2, 3), C.wood2)
    .x(c.ribbon([[-7, -4], [7, -4]], 3), C.terracotta).out();
}
/** a candle in a small holder; origin: base. .flame / .glow are animatable */
export function candle(c, h = 50) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-12, -6], [-5, -8], [-4, -16], [4, -16], [5, -8], [12, -6], [16, 0]], 0.3, 4), C.sun);
  s.p(c.cut(c.rect(-6, -16 - h, 12, h), 0.3, 6), C.cream);
  s.x(c.ribbon([[0, -16 - h], [0, -22 - h]], 1.4), C.ink);
  return `<circle class="glow" cx="0" cy="${-30 - h}" r="80" fill="url(#warm-glow)"/>${s.out()}<g class="flame" transform="translate(0 ${-20 - h})"><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2.6 -5 -2.6 -10 0 -15C2.6 -10 2.6 -5 0 -2Z" fill="#fff4d2"/></g>`;
}
/** a seven-branched lampstand; origin: base */
export function menorah(c, h = 120) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-18, -10], [-4, -14], [-4, -h], [4, -h], [4, -14], [18, -10], [26, 0]], 0.4, 6), C.sun);
  let arms = '';
  [1, 2, 3].forEach((i) => {
    const r = i * 18;
    arms += c.ribbon(c.arc(0, -h + 6, r, r * 1.05, 0, PI, 12).map(([x, y]) => [x, y]), 5);
  });
  s.p(arms, C.sun);
  let cups = '', fl = '';
  [-54, -36, -18, 0, 18, 36, 54].forEach((x) => {
    const y = x === 0 ? -h : -h + 6;
    cups += c.cut([[x - 6, y - 6], [x + 6, y - 6], [x + 3, y], [x - 3, y]], 0.2, 3);
    fl += `M${x} ${y - 6}C${x - 4} ${y - 10} ${x - 3} ${y - 16} ${x} ${y - 22}C${x + 3} ${y - 16} ${x + 4} ${y - 10} ${x} ${y - 6}Z`;
  });
  s.p(cups, shade(C.sun, -0.15));
  return `<circle cx="0" cy="${-h - 10}" r="110" fill="url(#warm-glow)" opacity=".7"/>${s.out()}<path class="flames" d="${fl}" fill="${C.lampFlame}"/>`;
}
/** a round hanging plate with a rim; origin centre */
export function plateDisc(c, r = 60, fill = C.cream, rim = C.ochre) {
  return sheet().p(c.cut(c.circ(0, 0, r + 5, 40), 0.5, 6), rim).p(c.cut(c.circ(0, 0, r, 40), 0.5, 6), fill).out();
}
/** a physician's things: a jar of balm, a roll of bandage and a sprig of herbs; origin: base centre */
export function physicianKit(c) {
  const s = sheet();
  s.p(c.cut([[-30, 0], [-34, -30], [-26, -44], [-26, -52], [-6, -52], [-6, -44], [2, -30], [-2, 0]], 0.4, 5), C.skyVeil);
  s.p(c.cut(c.rect(-29, -60, 26, 9), 0.3, 4), C.wood2);
  s.x(c.ribbon([[-32, -26], [0, -26]], 3), C.teal2, 'opacity=".6"');
  s.p(c.cut(c.ell(22, -12, 16, 12, 16), 0.3, 4), C.linen);
  s.x(c.ribbon(c.arc(22, -12, 10, 7, 0, PI * 3, 16), 1.4), C.linen2);
  s.p(c.cut([[38, -12], [62, -10], [62, -2], [38, -4]], 0.3, 4), C.linen);
  let leaves = '';
  for (let i = 0; i < 5; i++) leaves += c.cut(c.ell(-10 + i * 4, -64 - i * 7, 7, 3, 8, -0.6 + (i % 2) * 1.2), 0.2, 3);
  s.p(c.ribbon([[-8, -52], [8, -94]], 1.6) + leaves, C.leaf);
  return s.out();
}

/* ---------- the Sabbath field ---------- */
/** a band of ripe wheat as one still sheet: stalks + ears; origin world coords */
export function wheatField(c, { x0 = -900, x1 = 2500, y, h = 110, n = 260, color = C.wheat2, ear = C.wheat, back } = {}) {
  let st = '', ea = '', aw = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), yy = y + c.rr(-6, 10), hh = h * c.rr(0.75, 1.15), lean = c.rr(-12, 12);
    st += c.ribbon([[x, yy], [x + lean * 0.4, yy - hh * 0.5], [x + lean, yy - hh]], 2.4);
    const tx = x + lean, ty = yy - hh;
    ea += c.cut(c.ell(tx, ty - 10, 4.2, 12, 8, lean * 0.02), 0.3, 4);
    aw += c.ribbon([[tx, ty - 18], [tx + lean * 0.3 - 5, ty - 34]], 0.7) + c.ribbon([[tx, ty - 16], [tx + lean * 0.3 + 6, ty - 32]], 0.7);
  }
  const s = sheet();
  if (back) s.p(c.ridge(c.wave(y - h * 0.55, [5, 2], [300, 90]), x0 - 40, x1 + 40, y + 40, 10, 1.5), back);
  s.p(st, color).p(ea, ear).x(aw, shade(ear, -0.2), 'opacity=".7"');
  return s.out();
}
/** the Sabbath: a paper tag with two lit candles, to hang from the flies; origin at the string */
export function sabbathTag(c, text) {
  const w = 22 * (0.62 * text.length + 0.8) + 20;
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, -2], [w / 2 + 2, 34], [-w / 2 - 1, 35]], 0.5, 6), C.cream);
  s.p(c.cut(c.circ(0, 7, 3.2, 8), 0.2, 2), C.stone2);
  const cand = (x) => `<g transform="translate(${x} 44) scale(.55)">${candle(c, 40)}</g>`;
  return `${s.out()}<text x="0" y="26" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="22" font-style="italic" fill="${C.ink}">${text}</text>${cand(-w / 2 - 14)}${cand(w / 2 + 14)}`;
}

/** put extra pieces on a puppet's body (in body coords: chest ≈ (6, -112) standing) */
export function addToBody(markup, extra) {
  return markup.replace('<g class="head"', `${extra}<g class="head"`);
}
/** the high priest's breastplate with twelve stones (body coords) */
export function breastplate(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-6, -128, 24, 28), 0.3, 4), C.ochre);
  const gems = [C.terracotta, C.teal2, C.plumRobe, C.sun];
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) s.x(c.poly(c.circ(-1 + k * 7, -123 + r * 6.6, 2.3, 6)), gems[(r + k) % 4]);
  return s.out();
}
/** a white priestly turban with a gold plate (head coords) */
export function turban(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, -4, 21, 20, PI * 0.95, PI * 2.05, 14), [21, -2], [-21, -2]], 0.5, 4), C.linen);
  s.x(c.ribbon(c.arc(0, -4, 19, 12, PI * 1.05, PI * 1.95, 10), 1.4) + c.ribbon(c.arc(0, -6, 19, 7, PI * 1.05, PI * 1.95, 10), 1.4), C.linen2);
  s.p(c.cut(c.rect(8, -10, 11, 6), 0.2, 3), C.sun);
  return s.out();
}
/** a slim gold circlet (head coords) */
export function circlet(c) {
  return sheet().p(c.ribbon(c.arc(0, 0, 19, 19, PI * 1.08, PI * 1.9, 10), 3.2), C.sun).p(c.cut(c.star(4, -21, 5, 2.4, 3, -PI / 2), 0.2, 2), C.sun).out();
}
