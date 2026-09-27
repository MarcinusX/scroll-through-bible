// John 17 — the high-priestly prayer. Night, on the way down to the Kidron: a quiet moonlit slope above the valley,
// olive trees, Jerusalem's walls up on the left, the Mount of Olives across. The Eleven rest on the ground around a
// flat rock with their little lanterns set low beside them; Jesus stands on the rock and lifts His eyes to heaven.
// The Father is never a figure: a radiance above, a column of light, rays, rings.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt } from '../kit.js';
import { band, hillsWith, olive, cypress, moon, stars, grass } from '../../assets/nature.js';
import { fade, attr, es, clamp } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { TWELVE, withFace, faceBits } from '../mark3/lib.js';
import { walledCity } from '../mark1/lib.js';
import { templeMini } from '../mark14/lib.js';

export { kf, hand, headAt, wordSlip, scrollOpen, scrollRolled } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, strip, heart } from '../mark3/lib.js';
export { voiceRings, hang2 } from '../mark1/lib.js';
export { globe, glory, soulLight } from '../mark8/lib.js';
export { sheep } from '../mark6/lib.js';
export { vis } from '../mark14/lib.js';
export { hourglassRig } from '../john7/lib.js';
export { radiance, rayBurst, glowDisc, eternityRing, drawRing, threads, darkSheet, goldWord, hungGold, hungWord, hungPlate, iconWord, wordFlame, VOID } from '../john1/lib.js';
export { lightPath, drawPath } from '../john8/lib.js';
export { lightHeart } from '../john13/lib.js';
export { tr, sky, hanging, swing, pose, fade, attr, sheet, shade, mix, C, CAST, person, lerp, blinkAt, clamp };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const GOLD = '#fff3cf';
const k_ = (k) => (k ? ` data-k="${k}"` : '');
/** a colour seen by moonlight */
export const nt = (col, k = 0.45) => mix(col, C.indigo, k);
/** 'M x y L x y …' from points */
export const lineD = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');

/* ================================================================== skies */
export const NIGHT = ['#232857', '#3c3f72', '#5f5a86'];
export const DEEP = ['#141733', '#1f2449', '#2d3160'];
export const HOLY = ['#2c2f66', '#56558a', '#9a86a6'];     // the night warmed by the light from above
export const COLD = ['#12152e', '#1c2242', '#2c3456'];     // the world's cold wind
export const COSMOS = ['#0e1029', '#171b3d', '#252a55'];   // the whole world seen from far away

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
export const TW = Object.fromEntries(TWELVE.filter((m) => m.k !== 'judas').map((m) => [m.k, m.o]));
export const NAME = Object.fromEntries(TWELVE.map((m) => [m.k, m.name]));
export const JX = 800;
export const JY = 612;          // Jesus' feet, on the flat rock
/** where the Eleven rest (sitting, facing the rock) */
export const SIT = [
  { k: 'andrew', x: 438, y: 668 }, { k: 'james', x: 506, y: 642 }, { k: 'thomas', x: 566, y: 676 }, { k: 'john', x: 628, y: 648 }, { k: 'peter', x: 684, y: 690 },
  { k: 'matthew', x: 914, y: 690 }, { k: 'philip', x: 970, y: 648 }, { k: 'bartholomew', x: 1028, y: 678 }, { k: 'jamesA', x: 1088, y: 644 }, { k: 'thaddaeus', x: 1142, y: 672 }, { k: 'simonZ', x: 1190, y: 640 },
];
/** the Eleven standing close around Him */
export const STAND = [
  { k: 'andrew', x: 452, y: 664 }, { k: 'james', x: 516, y: 640 }, { k: 'thomas', x: 578, y: 670 }, { k: 'john', x: 640, y: 646 }, { k: 'peter', x: 694, y: 684 },
  { k: 'matthew', x: 906, y: 684 }, { k: 'philip', x: 962, y: 646 }, { k: 'bartholomew', x: 1022, y: 672 }, { k: 'jamesA', x: 1082, y: 642 }, { k: 'thaddaeus', x: 1140, y: 668 }, { k: 'simonZ', x: 1188, y: 640 },
];
export const DYP = { stand: 0, kneel: 46, sit: 62 };

/** a small lantern standing on the ground (origin: its base). .lfl = flame, .lgl = glow */
export function lantern(c, { glowR = 70 } = {}) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, -36, 6, 7, PI, 2 * PI, 6), 1.8), C.wood2);
  s.p(c.cut([[-9, -31], [9, -31], [8, -27], [-8, -27]], 0.2, 3), C.wood2);
  s.x(c.cut([[-8, -27], [8, -27], [9.5, -5], [-9.5, -5]], 0.2, 3), mix(C.lampGlow, C.cream, 0.3), 'opacity=".9"');
  s.p(c.cut([[-11, -5], [11, -5], [10, 0], [-10, 0]], 0.2, 3), C.wood2);
  s.p(c.cut([[-10, -27], [-7, -27], [-8, -5], [-11, -5]], 0.1, 3) + c.cut([[7, -27], [10, -27], [11, -5], [8, -5]], 0.1, 3), C.wood);
  const fl = `<g class="lfl" transform="translate(0 -8)"><path d="M0 0C-4 -3 -4 -9 0 -15C4 -9 4 -3 0 0Z" fill="${C.lampFlame}"/><path d="M0 -1.5C-1.8 -4 -1.8 -6.5 0 -9C1.8 -6.5 1.8 -4 0 -1.5Z" fill="#fff4d2"/></g>`;
  return `<g><circle class="lgl" cx="0" cy="-16" r="${glowR}" fill="url(#warm-glow)"/>${s.out()}${fl}</g>`;
}

/**
 * The Eleven on one layer (+ their lanterns in front of them). pos: SIT / STAND list.
 * Returns members { k, x, y, s, flip, P, p, el, sad, lamp, fl, gl, seed, i }.
 */
export function eleven(S, L, { pos = SIT, s = 0.8, pose: P = 'sit', eyes = 'open', lamps = true, face = true } = {}) {
  const c = S.c;
  const D = pos.slice().sort((a, b) => a.y - b.y).map((d, i) => {
    const o = { ...TW[d.k], pose: P, eyes };
    const mk = person(c, o);
    const el = L.add(face ? withFace(mk, faceBits(c)) : mk);
    return { ...d, i, s, P, flip: d.x > JX, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), seed: (i * 1.37) % 5 };
  });
  if (lamps) D.forEach((m) => {
    const dir = m.flip ? -1 : 1;
    m.lx = m.x + dir * (P === 'sit' ? 52 : 36) * m.s; m.ly = m.y + 2;
    m.lamp = L.add(lantern(c));
    m.fl = m.lamp.querySelector('.lfl'); m.gl = m.lamp.querySelector('.lgl');
    pose(m.lamp, { x: m.lx, y: m.ly, s: 0.9 });
  });
  return D;
}
/** Jesus on His rock (own puppet) */
export function jesusOn(S, L, { x = JX, y = JY, s = 1.05, o = {} } = {}) {
  const c = S.c;
  const el = L.add(withFace(person(c, { ...JESUS, ...o }), faceBits(c)));
  return { k: 'jesus', x, y, s, flip: false, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), seed: 0 };
}
/** pose a member where it rests (o overrides) */
export function put(m, T, o = {}) {
  m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 14, armB: 6, blink: blinkAt(T, m.seed), ...o });
}
/** lantern brightness 0..1 (and a size boost) */
export function lampK(m, k, boost = 0, bend = 0) {
  if (!m.fl) return;
  fade(m.fl, k > 0.02 ? 1 : 0);
  fade(m.gl, Math.min(1, k));
  if (k > 0.02) pose(m.fl, { x: 0, y: -8, sx: 0.6 + k * 0.4 + boost * 0.3, sy: 0.4 + k * 0.6 + boost * 0.6, r: bend });
  if (boost) pose(m.gl, { x: 0, y: 0, s: 1 + boost * 0.8, ox: 0, oy: -16 });
}
/** head centre and chest of a member (any pose) */
export const headOf = (m) => [m.x + (m.flip ? -2 : 2) * m.s, m.y + (-167 + DYP[m.P || 'stand']) * m.s];
export const chestOf = (m) => [m.x + (m.flip ? -3 : 3) * m.s, m.y + (-118 + DYP[m.P || 'stand']) * m.s];

/* ================================================================== the moonlit slope above the Kidron */
/**
 * Returns { sky, stars, hang, moon, far, city, valley, slope, ground, GY, update(T) }.
 * opts: skyCols, moonAt, city, starsN
 */
export function slopeSet(S, { skyCols = NIGHT, moonAt = [1196, 150], city = true, starsN = 120, moonLen = 640 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -800, y1: 430, n: starsN }));
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const moonEl = hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 36)}`, { x: moonAt[0], y: moonAt[1], len: moonLen });

  // far: the city up on its hill (left), the Mount of Olives across the valley (right)
  const far = S.layer({ par: 0.1, sh: 2 });
  const hill = [[-900, 1700], [-900, 430], [-300, 404], [100, 372], [330, 356], [520, 362], [640, 400], [760, 446], [900, 470], [2500, 470], [2500, 1700]];
  far.add(sheet().p(c.cut(hill, 1.2, 14), nt(C.hillFar, 0.62)).out());
  let cityEl = null;
  if (city) {
    cityEl = far.add(`<g>${walledCity(c, 330, 364, 0.9, { wall: nt(C.stone, 0.48), wall2: nt(C.stone2, 0.55), temple: nt(C.cream, 0.36) })}<g transform="translate(450 342)">${templeMini(c, 0.55, { col: nt(C.cream, 0.34), gold: nt(C.sun, 0.25) })}</g></g>`);
  }
  const olv = hillsWith(c, { y: 482, amps: [30, 10, 3], lens: [1300, 380, 120], color: nt(C.hillMid, 0.6), trees: 60, treeColor: nt(C.olive, 0.5), treeH: 16 });
  far.add(olv.markup);
  // the Kidron: a thin silver thread down in the valley
  const valley = S.layer({ par: 0.16, sh: 1 });
  const vb = band(c, { y: 520, amps: [10, 4, 2], lens: [800, 260, 90], color: nt(mix(C.hillMid, C.hillNear, 0.5), 0.58) });
  valley.add(vb.markup);
  const river = [];
  for (let x = -300; x <= 1900; x += 16) river.push([x, 578 - (x + 300) * 0.03 + Math.sin(x / 90) * 10 + Math.sin(x / 37) * 3]);
  valley.add(`<path d="${c.ribbon(river, (u) => 1.5 + Math.sin(u * PI) * 4.5, 0.6)}" fill="${mix(C.moon, C.lake, 0.4)}" opacity=".6"/>`);

  // the slope where they rest: olives, a cypress, terraces
  const slope = S.layer({ par: 0.24, sh: 3 });
  const h3 = band(c, { y: 574, amps: [12, 5, 2], lens: [900, 300, 110], color: nt(C.hillNear, 0.5) });
  slope.add(h3.markup);
  let terr = '';
  for (let r = 0; r < 3; r++) terr += c.ribbon([[-900, 594 + r * 20], [2500, 600 + r * 20]], 2.6);
  slope.add(sheet().x(terr, nt(C.soil, 0.45), 'opacity=".12"').out());
  const OL = { trunk: nt(C.wood2, 0.4), leaf: nt(C.olive, 0.42), leaf2: nt(C.sage, 0.42) };
  slope.add(olive(c, 236, 596, 0.8, OL) + olive(c, 1370, 598, 0.85, OL) + cypress(c, 1262, 590, 120, nt(C.moss2, 0.45)) + olive(c, 560, 588, 0.5, OL) + olive(c, 1050, 590, 0.46, OL));

  // the ground, the flat rock
  const ground = S.layer({ par: 0.34, sh: 3 });
  const GY = 650;
  const fn = c.wave(GY - 42, [5, 2], [700, 160]);
  const g = sheet().p(c.ridge(fn, -900, 2500, 1700, 12, 1), nt(mix(C.sage, C.moss, 0.4), 0.5));
  let pebbles = '';
  for (let i = 0; i < 24; i++) pebbles += c.cut(c.ell(c.rr(-600, 2200), GY + c.rr(-10, 60), c.rr(3, 7), c.rr(2, 4), 8), 0.2, 3);
  g.x(pebbles, nt(C.rock2, 0.4), 'opacity=".7"');
  g.p(c.ridge(c.wave(GY + 150, [6, 2], [800, 170]), -900, 2500, 1700, 14, 1), nt(mix(C.moss, C.moss2, 0.5), 0.55));
  ground.add(g.out());
  ground.add(grass(c, { x0: -700, x1: 2300, y: GY - 42, fn, n: 44, h: 12, color: nt(C.moss, 0.42) }));
  const rk = sheet();
  rk.p(c.cut([[690, 700], [684, 640], [700, 620], [740, 610], [860, 608], [900, 618], [916, 640], [910, 700]], 1.2, 7), nt(C.rock, 0.42));
  rk.p(c.cut([[704, 618], [744, 606], [856, 604], [896, 616], [860, 620], [742, 622]], 0.8, 6), nt(mix(C.rock, C.stone, 0.5), 0.3));
  rk.x(c.ribbon([[720, 650], [760, 662], [800, 656]], 2) + c.ribbon([[850, 672], [880, 660]], 2), nt(C.rock3, 0.4), 'opacity=".6"');
  ground.add(rk.out());
  // near foreground (tall phone screens): stones and tufts
  const fg = sheet();
  let st = '', tf = '';
  for (let i = 0; i < 22; i++) { const x = c.rr(-200, 1800), y = c.rr(GY + 130, GY + 420); st += c.cut(c.blob(x, y, c.rr(10, 26), c.rr(6, 12), 10, 0.25), 0.6, 5); }
  for (let i = 0; i < 40; i++) { const x = c.rr(-300, 1900), y = c.rr(GY + 110, GY + 460); for (let j = 0; j < 4; j++) tf += c.ribbon([[x + j * 3, y], [x + j * 3 + c.rr(-6, 6), y - c.rr(8, 16)]], 1.6); }
  fg.p(st, nt(C.rock2, 0.45)).x(tf, nt(C.moss, 0.45));
  ground.add(fg.out());
  const OL2 = { trunk: nt(C.wood2, 0.3), leaf: nt(C.olive, 0.3), leaf2: nt(C.sage, 0.3) };
  ground.add(olive(c, 40, fn(40) + 60, 1.4, OL2) + olive(c, 1580, fn(1580) + 64, 1.45, OL2));
  return {
    sky: sk, stars: starL, hang: hangL, moon: moonEl, far, city: cityEl, valley, slope, ground, GY, moonAt,
    update(T) { swing(moonEl, moonAt[0], moonAt[1], T, 0.8, 0.5); },
    /** fly the whole set out (k 0..1): sheets rise into the flies and fade — the world folds away */
    fold(k) {
      [far, valley, slope, ground].forEach((L, i) => { L.shift(0, k * (100 + i * 90)); L.fade(1 - k); });
      starL.fade(1 - k); hangL.fade(1 - k);
    },
  };
}

/* ================================================================== the light from above */
/** the Father's light: glow, fine rays, a layered radiance (never a figure); origin centre */
export function fatherLight(c, r = 70, { rays = 0.72, o = 0.32 } = {}) {
  let d = '';
  const n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + c.rr(-0.04, 0.04), w = 0.045 * c.rr(0.7, 1.3), rr = r * rays * c.rr(2.4, 3.4);
    d += c.poly([[Math.cos(a - w * 0.3) * r * 0.5, Math.sin(a - w * 0.3) * r * 0.5], [Math.cos(a - w) * rr, Math.sin(a - w) * rr], [Math.cos(a + w) * rr, Math.sin(a + w) * rr], [Math.cos(a + w * 0.3) * r * 0.5, Math.sin(a + w * 0.3) * r * 0.5]]);
  }
  const s = sheet();
  s.p(c.cut(c.star(0, 0, r * 1.18, r * 0.98, 28, 0), 0.6, 6), mix(C.halo, C.haloRim, 0.35));
  s.p(c.cut(c.circ(0, 0, r, 48), 0.6, 6), C.halo);
  s.p(c.cut(c.star(0, 0, r * 0.8, r * 0.68, 20, 0.1), 0.4, 5), mix(C.halo, C.star, 0.5));
  s.p(c.cut(c.circ(0, 0, r * 0.56, 36), 0.4, 5), C.star);
  s.x(c.poly(c.circ(0, 0, r * 0.34, 28)), '#fffdf4');
  return `<circle r="${r * 3.4}" fill="url(#halo-glow)"/><path d="${d}" fill="${GOLD}" opacity="${o}"/>${s.out()}`;
}
/** a vertical beam gradient (defined once per scene); returns its id */
export function beamGrad(S, name = 'beam') {
  const id = S.id(name);
  S.defs(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".05"/><stop offset=".3" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity=".12"/></linearGradient>`);
  return id;
}
/** a column of light from (0,0) down to (0,h); origin top centre */
export const beamPath = (c, id, w0 = 40, w1 = 150, h = 460) => `<path d="${c.poly([[-w0, 0], [w0, 0], [w1, h], [-w1, h]])}" fill="url(#${id})"/>`;
/** a small travelling light (flat); origin centre */
export const spark = (r = 8, glow = 5) => `<circle r="${r * glow}" fill="url(#halo-glow)"/><circle r="${r * 0.9}" fill="#fffdf4"/><path d="M0 ${-r * 2.2}L${r * 0.4} ${-r * 0.4}L${r * 2.2} 0L${r * 0.4} ${r * 0.4}L0 ${r * 2.2}L${-r * 0.4} ${r * 0.4}L${-r * 2.2} 0L${-r * 0.4} ${-r * 0.4}Z" fill="#fff6d8" opacity=".9"/>`;
/** a little flame of light (a soul's light, knowledge kindled); origin at its base */
export function smallFlame(c, h = 22) {
  const w = h * 0.42;
  const out = c.poly([...c.arc(0, -w, w, w, 0, PI, 8), ...c.qbez([-w, -w], [-w * 0.8, -h * 0.75], [0, -h], 6).slice(1), ...c.qbez([0, -h], [w * 0.8, -h * 0.75], [w, -w], 6).slice(1, -1)]);
  const inn = c.poly([...c.arc(0, -w * 0.8, w * 0.55, w * 0.55, 0, PI, 6), ...c.qbez([-w * 0.55, -w * 0.8], [-w * 0.4, -h * 0.6], [0, -h * 0.72], 4).slice(1), ...c.qbez([0, -h * 0.72], [w * 0.4, -h * 0.6], [w * 0.55, -w * 0.8], 4).slice(1, -1)]);
  return `<circle cy="${-h * 0.45}" r="${h * 2.4}" fill="url(#warm-glow)" opacity=".8"/><path d="${out}" fill="${C.lampFlame}"/><path d="${inn}" fill="#fff6dc"/>`;
}

/* ================================================================== the seven signs (John 2–11) */
const ICONS = [
  // 1 Cana: a stone jar brimming with wine
  (c) => sheet().p(c.cut([[-12, 22], [-18, 6], [-19, -8], [-13, -18], [-8, -20], [-9, -26], [9, -26], [8, -20], [13, -18], [19, -8], [18, 6], [12, 22]], 0.3, 3), mix(C.stone, C.rock, 0.35))
    .x(c.cut([[-9, -21], [9, -21], [8, -17], [-8, -17]], 0.2, 3), '#9c3d5c').x(c.ribbon([[-15, 2], [15, 2]], 2), shade(C.rock, -0.15), 'opacity=".6"').out(),
  // 2 the official's son: a little boy sitting up in his bed, well again
  (c) => sheet().p(c.cut([[-26, 16], [26, 16], [26, 4], [-26, 4]], 0.3, 4), C.wood3).p(c.cut([[-26, 4], [-18, 4], [-18, -12], [-26, -12]], 0.3, 3), C.wood2)
    .p(c.cut([[-16, 4], [20, 4], [20, -2], [-16, -2]], 0.3, 3), C.linen).p(c.cut([[-4, 2], [8, 2], [8, -16], [-4, -16]], 0.3, 3), C.skyVeil).p(c.cut(c.circ(2, -24, 8, 12), 0.2, 3), C.skin2).out(),
  // 3 Bethesda: the mat rolled up and carried
  (c) => sheet().p(c.cut(c.ell(0, 0, 26, 10, 18, -0.25), 0.4, 4), C.basket).x(c.ribbon([[-12, -6], [-8, 8]], 2) + c.ribbon([[0, -9], [4, 7]], 2) + c.ribbon([[11, -11], [15, 4]], 2), shade(C.basket, -0.3))
    .x(c.ribbon(c.arc(0, 22, 26, 4, 0, PI, 8), 2.2), C.lake3).out(),
  // 4 the loaves and the fish
  (c) => sheet().p(c.cut(c.ell(-12, -6, 13, 9, 14), 0.3, 3) + c.cut(c.ell(10, -8, 12, 8, 14), 0.3, 3) + c.cut(c.ell(-1, -18, 11, 8, 14), 0.3, 3), C.wheat2)
    .p(c.cut([[-18, 12], [-4, 6], [10, 7], [20, 13], [10, 19], [-4, 19], [-18, 12], [-26, 5], [-25, 13], [-26, 20]], 0.3, 3), C.lake3).out(),
  // 5 on the water: waves and a little boat
  (c) => sheet().p(c.cut([[-24, 0], [24, 0], [16, 10], [-16, 10]], 0.3, 3), C.wood).p(c.cut([[1, -2], [3, -2], [3, -26], [1, -26]], 0.1, 3), C.wood2).p(c.cut([[4, -24], [18, -6], [4, -6]], 0.2, 3), C.sail)
    .x(c.ribbon(c.arc(-14, 18, 10, 4, PI, 2 * PI, 6), 2.4) + c.ribbon(c.arc(6, 18, 10, 4, PI, 2 * PI, 6), 2.4) + c.ribbon(c.arc(26, 18, 10, 4, PI, 2 * PI, 6), 2.4), C.lake3).out(),
  // 6 the man born blind: an eye opened to the light
  (c) => sheet().p(c.cut([...c.arc(0, 8, 28, 20, PI * 1.12, PI * 1.88, 10), ...c.arc(0, -8, 28, 20, PI * 0.12, PI * 0.88, 10)], 0.3, 3), C.cream).p(c.cut(c.circ(0, 0, 10, 16), 0.2, 3), C.teal2).x(c.poly(c.circ(0, 0, 4.5, 10)), C.ink).x(c.poly(c.circ(3, -3, 2, 6)), '#fff')
    .x([0, 1, 2, 3, 4].map((i) => { const a = -PI * 0.8 + i * PI * 0.15; return c.ribbon([[Math.cos(a) * 22, Math.sin(a) * 22], [Math.cos(a) * 30, Math.sin(a) * 30]], 2); }).join(''), C.sunDeep).out(),
  // 7 Lazarus: the tomb open, the stone rolled away
  (c) => sheet().p(c.cut([[-26, 18], [-24, -8], [-14, -20], [4, -22], [18, -12], [22, 18]], 0.5, 4), C.rock2).p(c.cut([[-12, 18], [-12, -2], ...c.arc(-3, -2, 9, 10, PI, 2 * PI, 6), [6, 18]], 0.3, 3), '#fff1c4')
    .p(c.cut(c.circ(20, 8, 10, 14), 0.4, 3), C.rock).out(),
];
/** a round plate for one of the seven signs (i 0..6); origin centre; .rays can be faded (class sg) */
export function signPlate(c, i, r = 40) {
  let rays = '';
  for (let j = 0; j < 16; j++) { const a = (j / 16) * PI * 2; rays += c.poly([[Math.cos(a - 0.08) * (r + 4), Math.sin(a - 0.08) * (r + 4)], [Math.cos(a) * (r + 20), Math.sin(a) * (r + 20)], [Math.cos(a + 0.08) * (r + 4), Math.sin(a + 0.08) * (r + 4)]]); }
  const s = sheet().p(c.cut(c.circ(0, 0, r + 5, 36), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 36), 0.4, 5), C.cream);
  s.x(c.ribbon(c.arc(0, 0, r - 6, r - 6, 0, PI * 2, 36), 1.2), C.ochre, 'opacity=".55"');
  const num = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i];
  return `<g class="sg"><circle r="${r * 2.1}" fill="url(#halo-glow)"/><path d="${rays}" fill="${C.sun}" opacity=".85"/></g>${s.out()}<g transform="translate(0 -4) scale(${(r / 46).toFixed(2)})">${ICONS[i](c)}</g><text x="0" y="${(r * 0.82).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${(r * 0.3).toFixed(1)}" font-style="italic" fill="${C.terracotta}">${num}</text>`;
}

/* ================================================================== the world */
/**
 * A paper globe at night with n little lights on it (believers), grouped so they can come on in waves.
 * Returns markup; lights carry class "wv" + data-w (wave 0..W-1); threads class "th" + data-w. origin centre.
 */
export function nightGlobe(c, r = 150, { n = 160, W = 6, dark = true, src = null, hub = null, star = true } = {}) {
  const s = sheet();
  const sea = dark ? mix(C.lake3, C.night, 0.45) : C.lake2, land = dark ? mix(C.sage, C.night, 0.4) : C.sage;
  s.p(c.cut(c.circ(0, 0, r, 64), 0.5, 6), sea);
  const blobs = [[-0.35, -0.3, 0.36, 0.28], [0.36, 0.08, 0.3, 0.44], [-0.4, 0.48, 0.24, 0.16], [0.05, -0.62, 0.22, 0.12], [-0.7, 0.05, 0.14, 0.26], [0.62, -0.46, 0.16, 0.14]];
  s.p(blobs.map(([x, y, a, b]) => c.cut(c.blob(x * r, y * r, a * r, b * r, 12, 0.3), 1, 5)).join(''), land);
  s.x(c.ribbon(c.arc(0, 0, r, r * 0.3, 0, PI, 20), 1.6) + c.ribbon(c.arc(0, 0, r * 0.35, r, -PI / 2, PI / 2, 20), 1.6) + c.ribbon(c.arc(0, 0, r * 0.8, r, -PI / 2, PI / 2, 20), 1.4), C.cream, 'opacity=".25"');
  s.x(c.poly(c.ell(-r * 0.42, -r * 0.5, r * 0.2, r * 0.08, 12, -0.6)), '#fff', 'opacity=".18"');
  // the lights, scattered over the globe; wave = rough distance from Jerusalem (the first light)
  const J = src || [-0.12 * r, -0.2 * r];
  const H = hub || null;
  const waves = Array.from({ length: W }, () => ({ d: '', th: '' }));
  for (let i = 0; i < n; i++) {
    const a = c.rr(0, PI * 2), rr = Math.sqrt(c.r()) * r * 0.94;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    const dist = Math.hypot(x - J[0], y - J[1]) / (r * 1.9);
    const w = Math.min(W - 1, Math.floor(dist * W + c.rr(-0.4, 0.4)));
    const q = c.rr(1.6, 3.2);
    waves[Math.max(0, w)].d += c.poly(c.star(x, y, q * 1.9, q * 0.5, 4, 0)) + c.poly(c.circ(x, y, q * 0.8, 6));
    const hx = H ? H[0] + (x - H[0]) * 0.02 : x * 0.12, hy = H ? H[1] : y * 0.12 - r * 0.02;
    waves[Math.max(0, w)].th += `M${x.toFixed(1)} ${y.toFixed(1)}Q${((x + hx) / 2).toFixed(1)} ${((y + hy) / 2 - 40).toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`;
  }
  const lights = waves.map((w, i) => `<g class="wv" data-w="${i}" opacity="0"><path d="${w.d}" fill="${C.star}"/></g>`).join('');
  const ths = waves.map((w, i) => `<g class="th" data-w="${i}" opacity="0"><path d="${w.th}" stroke="${C.halo}" stroke-width="1.1" fill="none" opacity=".7"/></g>`).join('');
  const st = star ? `<circle cx="${J[0]}" cy="${J[1]}" r="26" fill="url(#warm-glow)"/><path d="${c.poly(c.star(J[0], J[1], 10, 3.5, 4, 0))}" fill="${C.star}"/>` : '';
  return { base: `<circle r="${r * 1.35}" fill="url(#halo-glow)" opacity=".35"/>${s.out()}`, lights: `<g class="ths">${ths}</g>${lights}${st}` };
}
/** light a nightGlobe's waves: k 0..1 over all waves; th 0..1 for the joining threads */
export function globeLights(el, k, th = 0) {
  const wv = el.__wv || (el.__wv = Array.from(el.querySelectorAll('.wv')));
  const ts = el.__th || (el.__th = Array.from(el.querySelectorAll('.th')));
  const W = wv.length;
  wv.forEach((g, i) => attr(g, 'opacity', clamp(k * W - i)));
  ts.forEach((g, i) => attr(g, 'opacity', clamp(th * W - i)));
}

/* ================================================================== believers of later ages */
const BOOK = (c, col = C.terracotta) => sheet().p(c.cut([[-12, -2], [12, -2], [12, 14], [-12, 14]], 0.3, 3), col).p(c.cut([[-10, -4], [0, -1], [10, -4], [10, 11], [0, 13], [-10, 11]], 0.3, 3), C.cream).x(c.ribbon([[0, -1], [0, 13]], 0.8), C.ink, 'opacity=".4"').out();
const HANDLAMP = (c) => `<g transform="translate(4 4)">${sheet().p(c.cut([[-9, 0], [-11, -4], [-6, -7], [4, -7], [8, -5], [12, -7], [13, -5], [9, -1], [4, 1], [-6, 1]], 0.3, 3), C.pot).out()}<circle cx="12" cy="-12" r="26" fill="url(#warm-glow)"/><path d="M12 -6C9 -9 9 -13 12 -18C15 -13 15 -9 12 -6Z" fill="${C.lampFlame}"/></g>`;
const CANDLE = (c) => `<g transform="translate(2 2)">${sheet().p(c.cut([[-3, 0], [3, 0], [3, -18], [-3, -18]], 0.2, 3), C.cream).p(c.cut([[-8, 2], [8, 2], [6, -1], [-6, -1]], 0.2, 3), C.sun).out()}<circle cy="-24" r="24" fill="url(#warm-glow)"/><path d="M0 -19C-3 -22 -3 -26 0 -31C3 -26 3 -22 0 -19Z" fill="${C.lampFlame}"/></g>`;
const STAFF = (c) => `<path d="${c.ribbon([[0, -70], [2, 100]], 4)}" fill="${C.wood2}"/>`;
/** people who will believe through the apostles' word, from the first centuries to today */
export const AGES = [
  { k: 'early', o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, beard: 'none', skin: C.skin2, hair: C.hair2 }, holdF: HANDLAMP, label: ['I w.', 'Rzym', '1st c.', 'Rome'] },
  { k: 'monk', o: { robe: mix(C.wood2, C.clay, 0.3), hairStyle: 'wrap', veil: mix(C.wood2, C.clay, 0.2), veil2: shade(C.wood2, -0.1), beard: 'short', skin: C.skin3, hair: C.hair3, belt: C.rope }, holdF: BOOK, label: ['VIII w.', '', '8th c.', ''] },
  { k: 'pilgrim', o: { robe: C.tealRobe, mantle: C.stone2, hairStyle: 'short', beard: 'full', skin: C.skin4, hair: C.hair, belt: C.leather }, holdB: STAFF, label: ['XIII w.', '', '13th c.', ''] },
  { k: 'mother', o: { robe: C.skyVeil, mantle: C.plumRobe, hairStyle: 'veil', veil: C.blushVeil, beard: 'none', skin: C.skin4, hair: C.hair3 }, holdF: CANDLE, label: ['XIX w.', '', '19th c.', ''] },
  { k: 'reader', o: { robe: mix(C.dustyBlue, C.indigo, 0.25), hairStyle: 'short', beard: 'none', skin: C.skin, hair: C.hair2 }, holdF: BOOK, label: ['dziś', '', 'today', ''] },
];
export function believer(c, a, extra = {}) {
  return person(c, { ...a.o, holdF: a.holdF ? a.holdF(c) : '', holdB: a.holdB ? a.holdB(c) : '', ...extra });
}
/** a plain chair and a small reading lamp, for today's reader (origin: floor, chair centre) */
export function readerNook(c) {
  const s = sheet();
  s.p(c.cut([[-54, -10], [20, -10], [20, -2], [-54, -2]], 0.3, 4), C.wood);
  s.p(c.cut([[-60, -120], [-52, -120], [-52, 26], [-60, 26]], 0.2, 3), C.wood2);
  s.p(c.cut([[12, -2], [18, -2], [18, 26], [12, 26]], 0.2, 3), C.wood2);
  // the lamp on a little table
  s.p(c.cut([[58, 26], [62, 26], [62, -50], [58, -50]], 0.2, 3), C.wood2).p(c.cut([[42, -50], [78, -50], [78, -56], [42, -56]], 0.2, 3), C.wood);
  s.p(c.ribbon([[60, -56], [60, -86]], 2.4), C.ink);
  s.p(c.cut([[46, -84], [74, -84], [68, -106], [52, -106]], 0.3, 3), C.wheat);
  return `<circle cx="60" cy="-80" r="110" fill="url(#warm-glow)"/>${s.out()}`;
}

/* ================================================================== small helpers */
/** lower something on its string: k 0..1 → from `len` above down to (x, y) */
export function lower(el, k, x, y, { len = 700, s = 1, r = 0, o = 1 } = {}) {
  const on = k > 0.005 && o > 0.005;
  pose(el, { x, y: y - (1 - k) * len, s, r, o: on ? o : 0 });
}
/** a quadratic arc of points from a to b, bulging by `bend` (up if negative) */
export function arcPts(a, b, bend = -60, n = 18) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + bend;
  const out = [];
  for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * mx + t * t * b[0], u * u * a[1] + 2 * u * t * my + t * t * b[1]]); }
  return out;
}
/** point at u along a quadratic from a to b with a bend */
export function arcAt(a, b, bend, u) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + bend, v = 1 - u;
  return [v * v * a[0] + 2 * v * u * mx + u * u * b[0], v * v * a[1] + 2 * v * u * my + u * u * b[1]];
}
/** a set of n curved threads in one piece; set(i, a, b, bend, k, o) draws thread i from a toward b to fraction k */
export function curves(L, n, { color = C.haloRim, w = 1.8 } = {}) {
  let inner = '';
  for (let i = 0; i < n; i++) inner += `<path d="M0 0" stroke="${color}" stroke-width="${w}" fill="none" opacity="0" stroke-linecap="round"/>`;
  const g = L.add(`<g>${inner}</g>`);
  const ps = Array.from(g.querySelectorAll('path'));
  return (i, a, b, bend, k, o = 1) => {
    const p = ps[i];
    if (k <= 0.01 || o <= 0.01) { attr(p, 'opacity', 0); return; }
    const pts = arcPts(a, b, bend, 14);
    const m = Math.max(1, Math.round(14 * Math.min(1, k)));
    const end = arcAt(a, b, bend, Math.min(1, k));
    attr(p, 'd', lineD([...pts.slice(0, m), end]));
    attr(p, 'opacity', o);
  };
}
export { es };

/** a chain of paper dolls holding hands — every human being; origin: centre of the chain at the hands' line */
export function dollChain(c, n = 14, w = 60, { dim = 0, sag = 26 } = {}) {
  const robes = [C.dustyBlue, C.roseRobe, C.sageRobe, C.wheatRobe, C.plumRobe, C.tealRobe, C.clayMantle, C.mauve, C.ochreRobe, C.skyVeil];
  const skins = [C.skin, C.skin3, C.skin2, C.skin4];
  const x0 = (-(n - 1) * w) / 2;
  const Y = (i) => sag * (1 - Math.pow((2 * i) / (n - 1) - 1, 2));
  const s = sheet();
  // arms: from each shoulder down to the hands joined half-way to the neighbour
  let arms = '';
  for (let i = 0; i < n - 1; i++) {
    const xa = x0 + i * w, xb = xa + w, ya = Y(i), yb = Y(i + 1), hx = (xa + xb) / 2, hy = (ya + yb) / 2 + 14;
    arms += c.ribbon([[xa + 8, ya - 2], [hx, hy]], 6) + c.ribbon([[xb - 8, yb - 2], [hx, hy]], 6);
  }
  s.p(arms, mix(C.linen2, C.indigo, dim));
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w, y = Y(i), rb = mix(robes[i % robes.length], C.indigo, dim), sk = mix(skins[(i * 3) % 4], C.indigo, dim);
    s.p(c.cut([[x - 9, y - 8], [x + 9, y - 8], [x + 17, y + 40], [x - 17, y + 40]], 0.5, 5), rb);
    s.p(c.cut([[x - 10, y + 40], [x - 3, y + 40], [x - 4, y + 58], [x - 11, y + 58]], 0.3, 4) + c.cut([[x + 3, y + 40], [x + 10, y + 40], [x + 11, y + 58], [x + 4, y + 58]], 0.3, 4), shade(rb, -0.18));
    s.p(c.cut(c.circ(x, y - 20, 11, 14), 0.3, 4), sk);
    if (i % 3 === 1) s.p(c.cut([...c.arc(x, y - 20, 13, 13, PI * 0.95, PI * 2.05, 8), [x + 12, y - 10], [x - 12, y - 10]], 0.3, 4), mix([C.linen2, C.blushVeil, C.skyVeil][i % 3], C.indigo, dim));
    else s.p(c.cut([...c.arc(x, y - 21, 11.5, 11.5, PI, PI * 2, 8), [x + 8, y - 24], [x - 8, y - 24]], 0.3, 3), mix([C.hair, C.hair3, C.greyHair, C.hair2][i % 4], C.indigo, dim));
    s.x(c.poly(c.circ(x - 4, y - 21, 1.4, 6)) + c.poly(c.circ(x + 4, y - 21, 1.4, 6)), C.inkSoft);
  }
  return s.out();
}

/** Jesus praying with lifted eyes (puppet overrides) */
export const PRAY = { head: -28, armF: 70, armB: 104 };
/** the small flames of life above the Eleven (given in 17,2); returns set(k, T, lift) */
export function lifeFlames(S, L, D, h = 20) {
  const els = D.map(() => L.add(`<g>${smallFlame(S.c, h)}</g>`));
  return (k, T, { boost = 0 } = {}) => D.forEach((m, i) => {
    const [hx, hy] = headOf(m);
    const kk = typeof k === 'function' ? k(m, i) : k;
    pose(els[i], { x: hx, y: hy - 30 * m.s + (T ? Math.sin(T * 2 + i) * 1.5 : 0), s: kk * (1 + boost * 0.4), o: kk > 0.01 ? 1 : 0 });
  });
}
/** a little grey idol (origin: its base) — kind 0 statue, 1 calf, 2 sun-pillar */
export function idol(c, kind = 0, col = '#6f6d86') {
  const s = sheet();
  if (kind === 0) s.p(c.cut([[-16, 0], [16, 0], [14, -10], [-14, -10]], 0.3, 4) + c.cut([[-8, -10], [8, -10], [9, -44], [-9, -44]], 0.3, 4) + c.cut(c.circ(0, -52, 8, 10), 0.3, 3), col);
  if (kind === 1) s.p(c.cut([[-18, 0], [18, 0], [16, -8], [-16, -8]], 0.3, 4) + c.cut([[-14, -8], [-12, -18], [-14, -30], [8, -32], [16, -40], [22, -36], [20, -26], [14, -24], [12, -8], [8, -8], [6, -18], [-8, -18], [-8, -8]], 0.4, 4), col);
  if (kind === 2) s.p(c.cut([[-12, 0], [12, 0], [8, -50], [-8, -50]], 0.3, 4) + c.cut(c.circ(0, -60, 12, 14), 0.3, 3), col).x(c.poly(c.circ(0, -60, 6, 10)), shade(col, -0.2));
  return s.out();
}

/** an oval ring of light cut in n pieces (data-i) so drawRing() can draw it; origin centre */
export function ovalRing(c, rx = 420, ry = 80, w = 7, n = 40, col = C.halo) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * PI * 2 + PI / 2, a1 = ((i + 1.1) / n) * PI * 2 + PI / 2;
    out += `<path data-i="${i}" d="${c.ribbon(c.arc(0, 0, rx, ry, a0, a1, 4), w)}" fill="${col}"/>`;
  }
  let st = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * PI * 2 + PI / 2; st += c.poly(c.star(Math.cos(a) * rx, Math.sin(a) * ry, 9, 3, 4, 0)); }
  return `<g class="segs">${out}</g><path class="ringStars" d="${st}" fill="${C.star}"/>`;
}
/** a heart outline that fills with light (k 0..1): markup; fill it with fillHeart(el, k) */
export function joyHeart(c, r = 14) {
  const pts = [...c.arc(-r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI * 0.8, PI * 2, 10), ...c.arc(r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI, PI * 2.2, 10), [0, r * 0.95]];
  const d = c.poly(pts);
  return `<circle class="jg" r="${r * 3}" fill="url(#halo-glow)" opacity="0"/><path d="${d}" fill="${mix(C.night, C.plumRobe, 0.5)}" opacity=".55"/><g class="jf"><path d="${d}" fill="${C.halo}"/></g><path d="${d}" fill="none" stroke="${C.haloRim}" stroke-width="2"/>`;
}
export function fillHeart(el, k) {
  const f = el.__jf || (el.__jf = el.querySelector('.jf'));
  const g = el.__jg || (el.__jg = el.querySelector('.jg'));
  pose(f, { y: 13, sy: Math.max(0.01, k), oy: 13 });
  attr(g, 'opacity', Math.max(0, (k - 0.7) / 0.3));
}
export { windStroke } from '../john3/lib.js';

/** a door high in the sky: frame + the light behind it (origin: bottom centre of the doorway). Returns
 *  { back, leaf } markup — put the leaf in front; it hinges at its left edge (x = -w/2) */
export function skyDoor17(c, w = 96, h = 150) {
  const arch = (ww, hh, y0 = 0) => [[-ww / 2, y0], [-ww / 2, y0 - hh + ww / 2], ...c.arc(0, y0 - hh + ww / 2, ww / 2, ww / 2, PI, 2 * PI, 12).slice(1, -1), [ww / 2, y0 - hh + ww / 2], [ww / 2, y0]];
  const fr = sheet().p(c.cut(arch(w + 26, h + 14, 6), 0.6, 6), C.haloRim).p(c.cut(arch(w, h), 0.4, 5), '#fffaf0').out();
  const back = `<circle cy="${-h / 2}" r="${h * 1.3}" fill="url(#halo-glow)"/>${fr}<path d="${c.poly(arch(w * 0.8, h * 0.9, -4))}" fill="${GOLD}"/>`;
  const L = sheet().p(c.cut(arch(w, h).map(([x, y]) => [x + w / 2, y]), 0.4, 5), mix(C.wood2, C.indigo, 0.25));
  L.x(c.ribbon([[10, -h * 0.3], [w - 10, -h * 0.3]], 3) + c.ribbon([[10, -h * 0.7], [w - 10, -h * 0.7]], 3), shade(C.wood2, -0.3), 'opacity=".6"');
  L.p(c.cut(c.circ(w - 16, -h * 0.48, 4, 8), 0.2, 2), C.sun);
  return { back, leaf: L.out() };
}
