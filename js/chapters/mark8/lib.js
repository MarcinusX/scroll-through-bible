// Mark 8 — cut-outs and little helpers shared by this chapter's scenes.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging } from '../kit.js';
import { band, hillsWith, rock } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, loaf, speech, thought, GLYPH, spark, heart, dust, coin, coinStack, addToHead, addToBody, candle, turban, wordSlip } from '../mark2/lib.js';

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- the cast ---------- */
// the rest of the Twelve look as in chapter 3
export const LOOK = {
  philip: { robe: C.roseRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather },
  bartholomew: { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3 },
  jamesA: { robe: C.linen2, mantle: C.tealRobe, hair: C.hair, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin4 },
  thaddaeus: { robe: C.lavender, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin },
  simonZ: { robe: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.terracotta, beard: 'full', skin: C.skin4, belt: C.leather },
  judas: { robe: mix(C.dustyBlue, C.storm, 0.5), mantle: shade(C.wood3, -0.05), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  // John the Baptist as in chapter 1; Elijah; a prophet with a scroll
  baptist: { robe: '#b98f63', fur: true, belt: C.leather, hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin3 },
  elijah: { robe: mix(C.dune, C.wood3, 0.5), fur: true, mantle: shade(C.leather, 0.1), hair: '#e8e1d4', hairStyle: 'wild', beard: 'wild', beardColor: '#eee7da', skin: C.skin3, belt: C.leather },
  prophet: { robe: C.dustyBlue, mantle: C.linen2, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin2 },
  blind: { robe: '#c9bca6', mantle: '#aa9c86', hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.rope },
  seer: { robe: C.linen2, mantle: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
};
/** twelve disciples in a steady order (Peter first) */
export const TWELVE = [CAST.peter, CAST.andrew, CAST.james, CAST.john, LOOK.philip, LOOK.bartholomew, CAST.matthew, CAST.thomas, LOOK.jamesA, LOOK.thaddaeus, LOOK.simonZ, LOOK.judas];

/** a Pharisee (chapter 3 look): prayer-shawl head-wrap with a blue band, long beard, cream robes */
export function pharisee(i = 0) {
  const robes = [C.linen2, C.stone, C.linen, C.wheatRobe, C.stone2];
  const mantles = [C.dustyBlue, C.skyVeil, C.tealRobe, C.dustyBlue, C.lavender];
  return {
    robe: robes[i % robes.length], mantle: mantles[i % mantles.length], skin: [C.skin2, C.skin, C.skin3][i % 3],
    hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: [C.dustyBlue, C.tealRobe, C.indigo][i % 3],
    beard: i % 2 ? 'wild' : 'full', beardColor: [C.greyHair, C.hair3, C.hair][i % 3], belt: C.leather,
  };
}
/** an elder, a chief priest and a scribe (for the shadow play of the passion) */
export const LEADERS = [
  { robe: C.stone, mantle: C.plumRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'wild', beardColor: C.greyHair, skin: C.skin2 },
  { robe: C.linen, mantle: C.indigo, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, beard: 'full', skin: C.skin3, belt: C.sun },
  { robe: C.plumRobe, mantle: C.stone2, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, beard: 'full', beardColor: C.greyHair, skin: C.skin },
];
/** a man from the crowd (never veiled) */
export function man(c, extra = {}) {
  const o = crowdPerson(c, extra);
  if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = c.pick(['short', 'full']); }
  return o;
}
/** a traveller who came from far: head-wrap, staff and bundle */
export function traveller(c, extra = {}) {
  return { ...man(c), hairStyle: 'wrap', veil: c.pick([C.linen2, C.stone, C.ochreRobe]), holdF: staff(c), holdB: `<g transform="translate(-4 -8)">${bundle(c)}</g>`, ...extra };
}

/** a paper silhouette of anybody (for shadow-play) */
export function shadowPerson(c, o, col = '#3b2a22') {
  const s = { ...o, robe: col, mantle: o.mantle ? shade(col, 0.06) : null, skin: col, hair: col, veil: col, veil2: col, beardColor: col, belt: o.belt ? shade(col, 0.1) : null, halo: false, holdF: o.holdF || '', holdB: '' };
  return person(c, s).split(`fill="${C.blush}"`).join(`fill="${col}"`);
}

/** angel: a puppet with a pair of paper wings behind the shoulders (inside the body, so they flip with it) */
export function angel(c, extra = {}) {
  const o = { robe: C.linen, mantle: C.halo, hair: c.pick([C.wheat2, C.hair2, C.ochre]), hairStyle: 'long', beard: 'none', skin: c.pick([C.skin, C.skin2]), ...extra };
  const w = (dir, col, dk) => {
    const pts = [[0, 0], [-20, -30], [-50, -66], [-86, -84], [-80, -58], [-96, -48], [-74, -28], [-86, -12], [-54, 0], [-60, 18], [-22, 12]];
    let fe = '';
    for (let i = 0; i < 4; i++) fe += c.ribbon([[-(20 + i * 14), -8 - i * 10], [-(46 + i * 12), -30 - i * 12]], 1.3);
    return `<g transform="translate(${dir < 0 ? -2 : -8} -128) scale(${dir < 0 ? 0.92 : 1} 1)"><path d="${c.cut(pts, 0.6, 5)}" fill="${col}"/><path d="${fe}" fill="${dk}"/></g>`;
  };
  const wings = w(-1, '#efe7d6', '#ddd2bd') + w(1, '#fbf7ee', '#e6ddcc');
  return person(c, o).replace('<g class="body">', `<g class="body"><g class="wings">${wings}</g>`);
}

/* ---------- the land ---------- */
/** a deserted place: sandy hills, scrub, rocks. Returns { ground fn, far fn } after adding layers. */
export function desert(S, { gy = 560, farY = 420, midY = 470 } = {}) {
  const c = S.c;
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: farY, amps: [30, 12, 4], lens: [1200, 420, 150], color: mix(C.hillFar, C.dune, 0.35) }).markup);
  const mid = S.layer({ par: 0.18, sh: 3 });
  const m = hillsWith(c, { y: midY, amps: [20, 8, 3], lens: [900, 300, 110], color: mix(C.sand2, C.hillMid, 0.35), trees: 10, treeColor: C.olive, treeH: 18 });
  mid.add(m.markup);
  mid.add(rock(c, 300, m.fn(300) + 8, 70, 30, C.rock2) + rock(c, 1340, m.fn(1340) + 8, 90, 36, C.rock2));
  return { mid: m.fn };
}
/** a little desert shrub (origin: ground) */
export function shrub(c, x, y, w = 40, color = C.olive) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i + 0.5) / 9 * PI, l = w * c.rr(0.5, 0.8); d += c.ribbon([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l * 0.8]], 2.4); }
  d += c.cut(c.blob(x, y - w * 0.25, w * 0.45, w * 0.22, 10, 0.25), 0.6, 5);
  return sheet().p(d, color).out();
}

/* ---------- bread, fish, baskets ---------- */
/** a wicker basket; origin bottom centre. full: heaped with broken bread. .heap is scalable (data-k) */
export function basket(c, { w = 46, h = 34, full = false, k, heapK } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2 - 6, 0], [-w / 2 + 6, 0]], 0.5, 6), C.basket);
  let weave = '';
  for (let i = 1; i < 4; i++) { const y = -h * i / 4, ww = w / 2 - 6 * (1 - i / 4); weave += c.ribbon([[-ww, y], [ww, y + c.rr(-0.6, 0.6)]], 1.8); }
  for (let x = -w / 2 + 8; x < w / 2 - 4; x += 9) weave += c.ribbon([[x, -h + 2], [x * 0.86, -2]], 1.2);
  s.x(weave, shade(C.basket, -0.25), 'opacity=".7"');
  s.p(c.ribbon(c.arc(0, -h, w / 2, 5, 0, PI, 10), 4), shade(C.basket, -0.12));
  const heap = sheet();
  let d = '', d2 = '';
  for (let i = 0; i < 6; i++) {
    const x = c.rr(-w * 0.36, w * 0.36), y = -h - c.rr(2, 12) * (1 - Math.abs(x) / w);
    const piece = c.cut(c.blob(x, y, c.rr(6, 9), c.rr(4, 6), 8, 0.3), 0.6, 3);
    if (i % 2) d += piece; else d2 += piece;
  }
  heap.p(c.cut([[-w / 2 + 2, -h + 1], ...c.arc(0, -h + 1, w / 2 - 2, 12, PI, 2 * PI, 10)], 0.5, 4), C.wheat2).p(d2, C.wheat).p(d, shade(C.wheat2, -0.08));
  const heapM = `<g${k_(heapK)} class="heap"${full ? '' : ' opacity="0"'}>${heap.out()}</g>`;
  // the heap sits behind the rim
  return `<g${k_(k)}>${heapM}${s.out()}</g>`;
}
/** a small broken piece of bread; origin centre */
export function crumb(c, r = 8) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.7, 8, 0.3), 0.6, 3), C.wheat2).x(c.ribbon([[-r * 0.4, -r * 0.1], [r * 0.4, 0]], 1.2), shade(C.wheat2, -0.25), 'opacity=".6"').out();
}
/** a loaf broken in two halves; returns { left, right } (origin: centre of the whole loaf's bottom) */
export function loafHalves(c, r = 18, col = C.wheat2) {
  const top = c.arc(0, 0, r, r * 0.52, PI, 2 * PI, 12);
  const L = [[-r, 0], ...top.slice(0, 7), [2, -r * 0.3], [-1, -r * 0.15], [1, 0]];
  const R = [[1, 0], [-1, -r * 0.15], [2, -r * 0.3], ...top.slice(6), [r, 0]];
  const inner = shade(col, 0.35);
  return {
    left: sheet().p(c.cut(L, 0.4, 4), col).x(c.poly([[0, -r * 0.42], [3, -r * 0.3], [0, -r * 0.15], [2, 0], [-3, 0], [-3, -r * 0.4]]), inner).out(),
    right: sheet().p(c.cut(R, 0.4, 4), col).x(c.poly([[1, -r * 0.42], [4, -r * 0.3], [1, -r * 0.15], [3, 0], [-1, 0], [-1, -r * 0.4]]), inner).out(),
  };
}
/** a little fish (facing right); origin centre */
export function smallFish(c, { col = C.lake3, s = 1 } = {}) {
  const P = (pts) => pts.map(([x, y]) => [x * s, y * s]);
  return sheet().p(c.cut(P([[-18, 0], [-5, -7], [8, -6], [18, 0], [8, 6], [-5, 6], [-18, 0], [-26, -7], [-24, 0], [-26, 7]]), 0.2, 3), col)
    .x(c.ribbon(P([[-4, -5], [-2, 5]]), 1.2 * s), shade(col, -0.2)).x(c.poly(c.circ(10 * s, -1.5 * s, 1.4 * s, 6)), C.ink).out();
}
/** a flat woven tray (origin: middle of its top) */
export function tray(c, w = 110) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 8, 9], [-w / 2 + 8, 9]], 0.4, 6), C.basket);
  let weave = '';
  for (let x = -w / 2 + 6; x < w / 2 - 2; x += 8) weave += c.ribbon([[x, 1], [x + 2, 8]], 1.4);
  s.x(weave, shade(C.basket, -0.22), 'opacity=".7"');
  return s.out();
}
/** a cloth spread on the ground (origin centre) */
export function cloth(c, w = 220, h = 26, col = C.cream) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2], [w / 2 - 8, -h / 2 - 3], [w / 2, h / 2], [-w / 2 - 8, h / 2 + 2]], 0.8, 8), col);
  let pat = '';
  for (let x = -w / 2 + 14; x < w / 2 - 8; x += 22) pat += c.cut(c.star(x, h / 2 - 5, 3.4, 1.5, 4, 0), 0.2, 3);
  s.x(pat, C.terracotta, 'opacity=".6"');
  return s.out();
}
/** an empty clay bowl (origin: bottom centre) */
export function emptyBowl(c, w = 30, col = C.pot) {
  return sheet().p(c.cut([[-w / 2, -w * 0.36], [w / 2, -w * 0.36], [w * 0.3, -2], [w * 0.14, 0], [-w * 0.14, 0], [-w * 0.3, -2]], 0.4, 5), col)
    .x(c.cut(c.ell(0, -w * 0.36, w / 2 - 1, 3, 10), 0.2, 3), shade(col, -0.35)).out();
}
/** a walking staff for holdF (hand at origin) */
export function staff(c, h = 150) {
  return sheet().p(c.ribbon([[0, -h * 0.55], [1, h * 0.42]], 4), C.wood2).out();
}
/** a travelling bundle on a cord (for holdB) */
export function bundle(c) {
  return sheet().p(c.cut(c.blob(0, 14, 16, 13, 10, 0.15), 0.6, 4), C.linen2).x(c.ribbon([[-10, 6], [12, 4]], 2), C.rope).out();
}

/* ---------- leaven ---------- */
/** a kneading bowl with dough whose .dough group can be scaled upward (origin: bottom centre) */
export function doughBowl(c, { w = 120, k } = {}) {
  const bowl = sheet();
  bowl.p(c.cut([[-w / 2, -w * 0.3], [w / 2, -w * 0.3], [w * 0.34, -4], [w * 0.16, 0], [-w * 0.16, 0], [-w * 0.34, -4]], 0.5, 6), C.pot);
  bowl.x(c.ribbon([[-w * 0.44, -w * 0.22], [w * 0.44, -w * 0.22]], 2), shade(C.pot, -0.25), 'opacity=".6"');
  bowl.x(c.ribbon([[-w * 0.4, -w * 0.12], [w * 0.4, -w * 0.12]], 1.4), C.cream, 'opacity=".45"');
  const dough = sheet();
  const dPts = [[-w * 0.48, 0], ...c.arc(0, 0, w * 0.48, w * 0.32, PI, 2 * PI, 16).map(([x, y]) => [x + c.rr(-2, 2), y + c.rr(-2, 1)]), [w * 0.48, 0]];
  dough.p(c.cut(dPts, 0.8, 5), '#f3e3c3');
  let bub = '';
  for (let i = 0; i < 7; i++) bub += c.cut(c.circ(c.rr(-w * 0.3, w * 0.3), -c.rr(4, w * 0.22), c.rr(2, 4.5), 8), 0.2, 2);
  dough.x(bub, '#e2cda6');
  return `<g${k_(k)}><g class="dough" transform="translate(0 ${-w * 0.26})">${dough.out()}</g>${bowl.out()}</g>`;
}
/** a leaven bubble (rising dough bubble) */
export function bubbleDot(c, r = 6) {
  return `<path d="${c.cut(c.circ(0, 0, r, 10), 0.3, 3)}" fill="#f7ecd4" stroke="#e2cda6" stroke-width="1.2"/>`;
}
/** Herod's little crown (origin: bottom centre) */
export function crown(c, w = 40, col = C.sun) {
  const h = w * 0.55;
  const pts = [[-w / 2, 0], [-w / 2, -h * 0.6], [-w * 0.3, -h * 0.25], [-w * 0.15, -h], [0, -h * 0.35], [w * 0.15, -h], [w * 0.3, -h * 0.25], [w / 2, -h * 0.6], [w / 2, 0]];
  return sheet().p(c.cut(pts, 0.3, 4), col).x(c.poly(c.circ(-w * 0.2, -h * 0.18, w * 0.05, 6)) + c.poly(c.circ(w * 0.2, -h * 0.18, w * 0.05, 6)), C.terracotta).x(c.poly(c.circ(0, -h * 0.2, w * 0.06, 6)), C.teal2).out();
}
/** a Pharisee's phylactery on a band (origin centre) */
export function phylactery(c, s = 1) {
  return sheet().p(c.ribbon(c.arc(0, 8 * s, 19 * s, 12 * s, PI * 1.05, PI * 1.95, 10), 3 * s), C.ink).p(c.cut([[-6 * s, -12 * s], [6 * s, -12 * s], [6 * s, -1 * s], [-6 * s, -1 * s]], 0.2, 3), C.ink).out();
}

/* ---------- words ---------- */
/** a speech bubble with one or two lines of text; the tail tip is at the origin; side -1 bubble to the left */
export function say(c, lines, { size = 22, fill = C.cream, ink = C.ink, side = 1, w, bold = false } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.6;
  const hh = lines.length * size * 1.15 + size * 0.9;
  const cx = side * (ww / 2 - 14), cy = -hh / 2 - 22;
  const s = sheet();
  s.p(c.cut(c.blob(cx, cy, ww / 2, hh / 2, 18, 0.04), 0.6, 6), fill);
  s.p(c.cut([[side * 6, -26], [0, 0], [side * 22, -24]], 0.3, 4), fill);
  const t0 = cy - ((lines.length - 1) * size * 1.15) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="${cx.toFixed(1)}" y="${(t0 + i * size * 1.15).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic"${bold ? ' font-weight="600"' : ''} fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** a hanging paper tag with a word (origin at the string hole) */
export function tag(c, text, { size = 22, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || Math.max(64, String(text).length * size * 0.52 + size * 1.4);
  const h = size * 1.7;
  const s = sheet();
  s.p(c.cut([[-ww / 2 + 10, 0], [ww / 2 - 10, 0], [ww / 2, 10], [ww / 2, h], [-ww / 2, h], [-ww / 2, 10]], 0.5, 6), fill);
  s.x(c.poly(c.circ(0, 6, 3, 8)), C.wood2);
  return `${s.out()}<text x="0" y="${(h * 0.5 + size * 0.5).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a big hand-cut question mark (origin centre, ~ 2r tall) */
export function bigQuestion(c, r = 40, col = C.cream) {
  const hook = c.arc(0, -r * 0.45, r * 0.45, r * 0.45, PI * 1.02, PI * 2.5, 16);
  hook.push([0, r * 0.35]);
  return sheet().p(c.ribbon(hook, r * 0.22), col).p(c.cut(c.circ(0, r * 0.72, r * 0.14, 10), 0.3, 3), col).out();
}
/** a little puff of breath (the sigh) — origin at the mouth, drifts to the right */
export function sighPuff(c) {
  const s = sheet();
  s.p(c.cut(c.blob(18, -4, 10, 7, 9, 0.2), 0.5, 4) + c.cut(c.blob(36, -12, 13, 9, 9, 0.2), 0.5, 4) + c.cut(c.blob(58, -18, 16, 11, 10, 0.2), 0.5, 4), '#f3efe6');
  return s.out();
}

/* ---------- sky & light ---------- */
/** a hanging dark "heaven" panel (a sheet of night paper with cut stars); origin at its top centre */
export function heavenPanel(c, w = 420, h = 250) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0], [w / 2, h - 20]];
  for (let x = w / 2; x > -w / 2; x -= 40) pts.push(...c.arc(x - 20, h - 20, 20, 16, 0, PI, 5));
  s.p(c.cut(pts, 0.8, 8), C.night);
  let st = '';
  for (let i = 0; i < 22; i++) st += c.poly(c.star(c.rr(-w / 2 + 16, w / 2 - 16), c.rr(14, h - 40), c.rr(2, 4.5), 1, 4, 0));
  s.x(st, C.star, 'opacity=".75"');
  s.p(c.ribbon([[-w / 2 - 6, 3], [w / 2 + 6, 3]], 7), C.wood2);
  return s.out();
}
/** a crown of light (ring of rays + gold ring); origin centre */
export function lightCrown(c, r = 46) {
  let d = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; d += c.poly([[Math.cos(a - 0.07) * r * 0.8, Math.sin(a - 0.07) * r * 0.8 * 0.4], [Math.cos(a) * r * 1.9, Math.sin(a) * r * 1.9 * 0.4 - (Math.sin(a) < 0 ? r * 0.6 : 0)], [Math.cos(a + 0.07) * r * 0.8, Math.sin(a + 0.07) * r * 0.8 * 0.4]]); }
  const ring = sheet().p(c.ribbon(c.arc(0, 0, r, r * 0.34, 0, PI * 2, 30), 7), C.sun);
  let pts = '';
  for (let i = 0; i < 7; i++) { const a = PI * (1.1 + i * 0.13); pts += c.poly(c.star(Math.cos(a) * r, Math.sin(a) * r * 0.34 - 12, 9, 3, 4, -PI / 2)); }
  ring.x(pts, C.halo);
  return `<circle r="${r * 2.6}" fill="url(#halo-glow)"/><path d="${d}" fill="#fff3cf" opacity=".8"/>${ring.out()}`;
}
/** a little oil horn (anointing) — origin at the spout */
export function oilHorn(c) {
  const s = sheet();
  s.p(c.cut([[0, 0], [8, -6], [34, -20], [58, -44], [62, -38], [42, -12], [12, 6]], 0.4, 4), C.cream);
  s.p(c.ribbon([[20, -14], [26, -2]], 3) + c.ribbon([[36, -26], [44, -16]], 3), C.ochre);
  return s.out();
}
/** golden rays of glory with a soft disc (origin centre) */
export function glory(c, r = 400, n = 22) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + c.rr(-0.04, 0.04), w = 0.05 * c.rr(0.7, 1.3);
    d += c.poly([[Math.cos(a - w * 0.2) * 50, Math.sin(a - w * 0.2) * 50], [Math.cos(a - w) * r, Math.sin(a - w) * r], [Math.cos(a + w) * r, Math.sin(a + w) * r], [Math.cos(a + w * 0.2) * 50, Math.sin(a + w * 0.2) * 50]]);
  }
  return `<circle r="${r * 0.75}" fill="url(#halo-glow)"/><path d="${d}" fill="#fff2c8" opacity=".75"/>`;
}
/** the soul: a small glowing flame-like light (origin centre) */
export function soulLight(c, r = 22) {
  const s = sheet();
  s.p(c.cut([[0, -r * 1.35], [r * 0.62, -r * 0.3], [r * 0.7, r * 0.25], [r * 0.3, r * 0.75], [-r * 0.3, r * 0.75], [-r * 0.7, r * 0.25], [-r * 0.62, -r * 0.3]], 0.3, 4), C.halo);
  s.x(c.poly(c.ell(0, r * 0.1, r * 0.32, r * 0.45, 12)), C.star);
  return `<circle r="${r * 3.2}" fill="url(#warm-glow)" class="glow"/>${s.out()}`;
}
/** the whole world: a paper globe with land (origin centre) */
export function globe(c, r = 60) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 40), 0.4, 5), C.lake2);
  const land = c.cut(c.blob(-r * 0.3, -r * 0.3, r * 0.34, r * 0.26, 10, 0.3), 0.8, 4) + c.cut(c.blob(r * 0.34, r * 0.1, r * 0.3, r * 0.42, 10, 0.3), 0.8, 4) + c.cut(c.blob(-r * 0.36, r * 0.46, r * 0.22, r * 0.14, 9, 0.3), 0.6, 4);
  s.p(land, C.sage);
  s.x(c.cut(c.blob(r * 0.3, 0, r * 0.12, r * 0.18, 8, 0.2), 0.3, 3) + c.cut(c.blob(-r * 0.22, -r * 0.36, r * 0.12, r * 0.08, 8, 0.2), 0.3, 3), C.ochre, 'opacity=".8"');
  s.x(c.ribbon(c.arc(0, 0, r, r * 0.3, 0, PI, 16), 1.2) + c.ribbon(c.arc(0, 0, r * 0.35, r, -PI / 2, PI / 2, 16), 1.2), C.cream, 'opacity=".45"');
  s.x(c.poly(c.ell(-r * 0.4, -r * 0.5, r * 0.18, r * 0.08, 10, -0.6)), '#fff', 'opacity=".35"');
  return s.out();
}
/** a balance: { post, beam, pan } markup. Beam pivot at origin (0,0), arms ±arm; pans hang from their hooks (pan origin at the hook) */
export function balance(c, { arm = 180, h = 330, drop = 110 } = {}) {
  const post = sheet();
  post.p(c.cut([[-40, h], [40, h], [26, h - 16], [8, h - 22], [6, 6], [-6, 6], [-8, h - 22], [-26, h - 16]], 0.5, 6), C.wood2);
  post.p(c.cut(c.circ(0, 0, 11, 14), 0.3, 4), C.sun);
  const beam = sheet();
  beam.p(c.cut([[-arm - 6, -4], [arm + 6, -4], [arm + 6, 5], [-arm - 6, 5]], 0.4, 8), C.wood);
  beam.p(c.cut(c.circ(-arm, 0, 6, 10), 0.2, 3) + c.cut(c.circ(arm, 0, 6, 10), 0.2, 3) + c.cut([[0, -24], [6, -6], [-6, -6]], 0.2, 3), C.sun);
  const pan = (col) => {
    const p = sheet();
    p.x(c.ribbon([[0, 0], [-44, drop]], 1.2) + c.ribbon([[0, 0], [44, drop]], 1.2) + c.ribbon([[0, 0], [0, drop - 4]], 1), C.ink, 'opacity=".55"');
    p.p(c.cut([[-56, drop], [56, drop], [40, drop + 16], [-40, drop + 16]], 0.4, 6), col);
    p.x(c.ribbon([[-52, drop + 3], [52, drop + 3]], 2), shade(col, -0.25), 'opacity=".6"');
    return p.out();
  };
  return { post: post.out(), beam: beam.out(), pan: pan(C.sun), drop };
}
/** a small wooden cross to carry on the shoulder (origin: where it rests on the shoulder, crossing point) */
export function smallCross(c, h = 110, col = C.wood) {
  return sheet().p(c.cut([[-4, -h * 0.28], [4, -h * 0.28], [4, h * 0.72], [-4, h * 0.72]], 0.3, 6), col).p(c.cut([[-h * 0.24, -4], [h * 0.24, -4], [h * 0.24, 4], [-h * 0.24, 4]], 0.3, 6), shade(col, -0.08)).out();
}

/* ---------- hanging frames ---------- */
/** an oval hanging portrait of a person's bust, with a name ribbon; S for a unique clip id */
export function portrait(S, o, name, { w = 110, h = 140, frame = C.ochre, bg = C.parchment, extra = '' } = {}) {
  const c = S.c;
  const id = S.id('clip' + Math.round(c.rr(0, 1e6)));
  const oval = c.ell(0, 0, w / 2, h / 2, 36);
  const f = sheet().p(c.cut(c.ell(0, 0, w / 2 + 8, h / 2 + 8, 36), 0.5, 5), frame).out();
  const inner = sheet().p(c.cut(oval, 0.3, 5), bg).out();
  const bust = `<g clip-path="url(#${id})"><g transform="translate(-4 ${h * 1.02}) scale(${h / 150})">${person(c, o)}</g>${extra}</g>`;
  const rib = sheet().p(c.cut([[-w / 2 - 12, h / 2 - 8], [w / 2 + 12, h / 2 - 10], [w / 2 + 4, h / 2 + 12], [w / 2 + 14, h / 2 + 24], [-w / 2 - 14, h / 2 + 24], [-w / 2 - 4, h / 2 + 12]], 0.4, 6), C.cream).out();
  return `<defs><clipPath id="${id}"><path d="${c.poly(oval)}"/></clipPath></defs>${f}${inner}${bust}${rib}<text x="0" y="${(h / 2 + 14).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${name}</text>`;
}
/** a rectangular hanging memory card (sepia paper), origin at its top centre */
export function memoryCard(c, w = 300, h = 210, col = '#efe2c6') {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 7, -7, w + 14, h + 14), 0.6, 8), C.wood3);
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), col);
  let sp = '';
  for (let i = 0; i < 8; i++) sp += c.cut(c.blob(c.rr(-w / 2 + 20, w / 2 - 20), c.rr(20, h - 20), c.rr(10, 26), c.rr(6, 12), 8, 0.2), 0.4, 4);
  s.x(sp, shade(col, -0.05), 'opacity=".5"');
  return s.out();
}

/* ---------- places ---------- */
/** a wooden signpost with a name board */
export function signpost(c, text, { size = 20, dir = 1 } = {}) {
  const w = size * (0.56 * String(text).length + 1.6), h = size * 1.5;
  const s = sheet();
  s.p(c.cut(c.rect(-4, -110, 8, 112), 0.3, 6), C.wood2);
  const pts = dir > 0 ? [[-w / 2, -104], [w / 2, -104], [w / 2 + 14, -104 + h / 2], [w / 2, -104 + h], [-w / 2, -104 + h]] : [[w / 2, -104], [-w / 2, -104], [-w / 2 - 14, -104 + h / 2], [-w / 2, -104 + h], [w / 2, -104 + h]];
  s.p(c.cut(pts, 0.4, 6), C.wood3);
  return s.out() + `<text x="${dir * 4}" y="${-104 + h * 0.5 + size * 0.34}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** a walled city on a hill (Jerusalem) */
export function walledCity(c, x, y, sc = 1, { wall = C.stone, wall2 = C.stone2, temple = C.cream } = {}) {
  const s = sheet();
  const W = 190 * sc, H = 44 * sc;
  s.p(c.cut(c.rect(x - 34 * sc, y - H - 64 * sc, 68 * sc, 64 * sc), 0.4, 6), temple);
  s.p(c.cut(c.rect(x - 40 * sc, y - H - 70 * sc, 80 * sc, 8 * sc), 0.3, 6), C.sun);
  let cols = '';
  for (let i = 0; i < 5; i++) cols += c.cut(c.rect(x - 28 * sc + i * 13 * sc, y - H - 56 * sc, 4 * sc, 40 * sc), 0.2, 4);
  s.x(cols, shade(temple, -0.15));
  let hs = '';
  for (let i = 0; i < 7; i++) { const hx = x - W / 2 + 10 * sc + i * 26 * sc, hh = c.rr(16, 34) * sc; if (Math.abs(hx - x) < 40 * sc) continue; hs += c.cut(c.rect(hx, y - H - hh, 22 * sc, hh + 4), 0.3, 5); }
  s.p(hs, C.plaster);
  const pts = [[x - W / 2, y], [x - W / 2, y - H]];
  for (let xx = x - W / 2; xx < x + W / 2 - 8 * sc; xx += 16 * sc) pts.push([xx, y - H], [xx, y - H - 7 * sc], [xx + 8 * sc, y - H - 7 * sc], [xx + 8 * sc, y - H]);
  pts.push([x + W / 2, y - H], [x + W / 2, y]);
  s.p(c.cut(pts, 0.3, 6), wall);
  s.p(c.cut(c.rect(x - W / 2 - 12 * sc, y - H - 22 * sc, 26 * sc, H + 22 * sc), 0.3, 5) + c.cut(c.rect(x + W / 2 - 14 * sc, y - H - 22 * sc, 26 * sc, H + 22 * sc), 0.3, 5), wall2);
  s.x(c.cut([[x - 12 * sc, y], [x - 12 * sc, y - 22 * sc], ...c.arc(x, y - 22 * sc, 12 * sc, 12 * sc, PI, 2 * PI, 6), [x + 12 * sc, y]], 0.2, 4), C.soilDark);
  return s.out();
}
/** a tree that walks (what the half-healed man sees): trunk-body, leafy crown, two stumpy legs (.legF/.legB) */
export function treeWalker(c, { leaf = '#9fae8c', leaf2 = '#b7c2a2', trunk = '#9c8468', h = 200 } = {}) {
  const s = sheet();
  s.p(c.cut([[-12, -h * 0.28], [12, -h * 0.28], [16, -h * 0.62], [8, -h * 0.72], [-8, -h * 0.72], [-15, -h * 0.62]], 0.8, 6), trunk);
  s.p(c.ribbon(c.qbez([4, -h * 0.6], [24, -h * 0.68], [34, -h * 0.8], 6), 5) + c.ribbon(c.qbez([-4, -h * 0.56], [-22, -h * 0.64], [-30, -h * 0.76], 6), 5), trunk);
  s.p(c.cut(c.blob(-8, -h * 0.82, h * 0.2, h * 0.14, 12, 0.2), 1, 6), leaf2);
  s.p(c.cut(c.blob(6, -h * 0.88, h * 0.22, h * 0.16, 12, 0.2), 1, 6), leaf);
  const leg = (col) => sheet().p(c.cut([[-6, 0], [6, 0], [7, h * 0.3], [-7, h * 0.3]], 0.6, 5), col).p(c.cut(c.ell(3, h * 0.3, 10, 5, 10), 0.3, 3), shade(col, -0.2)).out();
  return `<g class="legB" transform="translate(-6 ${-h * 0.3})">${leg(shade(trunk, -0.12))}</g><g class="legF" transform="translate(6 ${-h * 0.3})">${leg(trunk)}</g>${s.out()}`;
}
/** an almond eye-shaped window: a huge dark sheet with the hole (origin centre) */
export function eyeWindow(c, w = 820, h = 520, col = '#2c2530') {
  const hole = [...c.arc(0, h * 0.62, w * 0.62, h * 1.1, PI * 1.2, PI * 1.8, 30), ...c.arc(0, -h * 0.62, w * 0.62, h * 1.1, PI * 0.2, PI * 0.8, 30)];
  return `<path d="${c.poly([[-4000, -4000], [4000, -4000], [4000, 4000], [-4000, 4000]])}${c.hole(hole, 3, 14)}" fill="${col}" fill-rule="evenodd"/>`;
}

/* ---------- places: Caesarea Philippi ---------- */
/** a rocky cliff with a grotto and a spring (origin: bottom-left of the cliff base) */
export function cliff(c, w = 520, h = 330) {
  const s = sheet();
  const pts = [[0, 0], [-10, -h * 0.3], [10, -h * 0.55], [-4, -h * 0.8], [30, -h], [w * 0.3, -h * 1.06], [w * 0.5, -h * 0.96], [w * 0.7, -h * 1.02], [w * 0.9, -h * 0.9], [w, -h * 0.7], [w + 10, -h * 0.4], [w, 0]];
  s.p(c.cut(pts, 3, 12), mix(C.rock, C.clay, 0.22));
  let strata = '';
  for (let i = 1; i < 5; i++) strata += c.ribbon([[c.rr(10, 40), -h * i / 5.2], [w * c.rr(0.4, 0.6), -h * i / 5.2 + c.rr(-8, 8)], [w - c.rr(10, 40), -h * i / 5.2 + c.rr(-6, 6)]], c.rr(2, 5));
  s.x(strata, mix(C.rock2, C.clay, 0.2), 'opacity=".6"');
  // the grotto
  const gx = w * 0.46, gw = w * 0.28, gh = h * 0.42;
  s.p(c.cut([[gx - gw / 2, 0], [gx - gw / 2, -gh * 0.6], ...c.arc(gx, -gh * 0.6, gw / 2, gh * 0.4, PI, 2 * PI, 12), [gx + gw / 2, 0]], 1.4, 6), shade(C.rock3, -0.35));
  // niches cut in the rock (shrines)
  let ni = '';
  [[w * 0.14, -h * 0.5], [w * 0.8, -h * 0.46], [w * 0.72, -h * 0.72]].forEach(([x, y]) => { ni += c.cut([[x - 14, y], [x - 14, y - 22], ...c.arc(x, y - 22, 14, 12, PI, 2 * PI, 6), [x + 14, y]], 0.4, 4); });
  s.p(ni, shade(C.rock2, -0.2));
  // greenery
  let g = '';
  for (let i = 0; i < 9; i++) g += c.cut(c.blob(c.rr(20, w - 20), -h * c.rr(0.72, 1.0), c.rr(16, 30), c.rr(8, 14), 10, 0.25), 0.8, 5);
  s.p(g, C.moss);
  return s.out();
}
/** snow-capped mount Hermon (a far band) */
export function hermon(c, x, y, w = 900, h = 260) {
  const s = sheet();
  const pts = [[x - w / 2, y], [x - w * 0.25, y - h * 0.6], [x - w * 0.08, y - h * 0.92], [x, y - h], [x + w * 0.1, y - h * 0.9], [x + w * 0.3, y - h * 0.55], [x + w / 2, y]];
  s.p(c.cut(pts, 2, 14), mix(C.lavender, C.hillFar, 0.5));
  const snow = [[x - w * 0.16, y - h * 0.8], [x - w * 0.08, y - h * 0.92], [x, y - h], [x + w * 0.1, y - h * 0.9], [x + w * 0.18, y - h * 0.76], [x + w * 0.1, y - h * 0.8], [x + w * 0.04, y - h * 0.74], [x - w * 0.04, y - h * 0.82], [x - w * 0.1, y - h * 0.74]];
  s.p(c.cut(snow, 1.2, 8), C.linen);
  return s.out();
}

/* ---------- the boat with the Twelve (well, seven of them) ---------- */
export const CREW = [
  { k: 'thomas', o: CAST.thomas, x: -132 },
  { k: 'john', o: CAST.john, x: -94 },
  { k: 'andrew', o: CAST.andrew, x: -54 },
  { k: 'matthew', o: CAST.matthew, x: 134 },
  { k: 'james', o: CAST.james, x: 94 },
  { k: 'peter', o: CAST.peter, x: 52 },
];
/** the boat with Jesus and six disciples standing in it: { g, jesus, crew[], extra } (boat coords, waterline 0) */
export function crewBoat(S, L, { holdAndrew = '' } = {}) {
  const c = S.c;
  const B = boat(c, { mast: false });
  const crew = CREW.map((d) => ({ ...d, m: `<g data-k="cb-${d.k}">${person(c, d.k === 'andrew' ? { ...d.o, holdF: holdAndrew } : d.o)}</g>` }));
  const g = L.add(`<g>${B.back}${crew.map((d) => d.m).join('')}<g data-k="cb-jesus">${person(c, { ...CAST.jesus })}</g>${B.front}</g>`);
  crew.forEach((d) => { d.p = S.puppet(S.$('cb-' + d.k).firstElementChild); d.seed = c.rr(0, 9); });
  return { g, crew, jesus: S.puppet(S.$('cb-jesus').firstElementChild) };
}

/* ---------- misc ---------- */
export const WORD = {
  seven: () => tr('Siedem', 'Seven'),
  twelve: () => tr('Dwanaście', 'Twelve'),
};
export { tr, sky, hanging, pose, band, hillsWith, rock, PI, FONT };
