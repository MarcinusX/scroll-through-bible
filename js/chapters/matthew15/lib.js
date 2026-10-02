// Matthew 15 — the cast and cut-outs of this chapter. Most of it is Mark 7's and Mark 8's: the Pharisees and scribes
// from Jerusalem, the washing things, the stone tablets and the little rule-scrolls, the paper face of Isaiah's
// saying, the paper doll with its heart, the heart-box and the dark things that come out of it, the purple coast of
// Tyre, the Canaanite woman (Mark's Syrophoenician, the same cut-out) and her little girl, the puppies under the
// table, bread, fish and baskets. The mountain by the lake is Matthew 6's (John 6's hill), and the sick are the ones
// of Matthew 9 and 11, so everyone looks the same throughout the Gospels. New here: the garden bed with the plant
// "not planted by my Father", the pit of the blind guides, the lost sheep on the hills, the arm sling of the maimed.
// Everything returns SVG markup cut with the seeded scissors + sheet().
import { C, sheet, shade, mix, pose, sky, hanging, flock, crowdPerson } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { pose3 as pose3_ } from '../matthew4/lib.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, grass, town } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, scrap, loaf, cup, jug, bowl, scrollOpen, dust, lowTable } from '../mark2/lib.js';
export {
  pharisee, LOOK as L7, woman, PURPLE, MUREX, SEA, DARK, COPPER, stoneJar, basin, copperPot, stream, drop, marketBasket, farCity,
  ruleScroll, tablets, scrollPile, profileFace, paperDoll, dollHeart, heartBox, darkThing, DARK_KINDS, murex, puppy, nameTag, strip, plate,
  hang2, bigHand, soundRings, room, feastTable, shadowPerson,
} from '../mark7/lib.js';
export { basket, crumb, loafHalves, smallFish, tray, cloth, emptyBowl, say, tag, signpost, shrub, portrait, heavenPanel, glory } from '../mark8/lib.js';
export { bubble, cry, onFace, onBody, lyingPerson as lyingPerson5 } from '../mark5/lib.js';
export { crutch, voiceRings, sparkle } from '../mark1/lib.js';
export { sheep } from '../mark6/lib.js';
export { blindBand } from '../john5/lib.js';
export { folk, group, meadowRows, TW, barleyLoaf } from '../john6/lib.js';
export { hillSet, plateBoard, secretShaft, SPRING, NOON, GOLDEN, DUSK, NIGHT, HEAVEN } from '../matthew6/lib.js';
export { BLIND, LAME, DEAF, throng, popIn, eyeGlyph, earGlyph, note, cityIcon, ship, kid, kidHead, manOf, womanOf, EVENING } from '../matthew11/lib.js';
export { MUTE, gag, stick } from '../matthew9/lib.js';
export { ISAIAH } from '../matthew1/lib.js';
export { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== skies */
export const LAKE = ['#cfe2dd', '#f0e7cf', '#f8ecd6'];          // Gennesaret, morning
export const COAST = ['#c4c2dc', '#efd8c9', '#f6e4d0'];         // the Phoenician coast, rosy
export const COAST2 = ['#b9b8da', '#ecd1c2', '#f4dfc9'];
export const DRY = ['#d6e2d8', '#f1e7cc', '#f5e2c1'];           // late summer on the mountain
export const NIGHT2 = ['#1d2349', '#2f3768', '#6a5f84'];
export const SUNSET = ['#8f7fae', '#e6a58c', '#f5cf9f'];

/* ================================================================== small helpers */
/** linear keyframes (a steady walking pace) */
export function kfLin(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return va + (vb - va) * ((t - a) / (b - a)); }
  return keys[keys.length - 1][1];
}

/* ================================================================== Korban (after Mark 7) */
/** a jagged dark speech bubble (a curse); origin at its tail */
export function jagBubble(c) {
  const s = sheet();
  const p = [];
  for (let i = 0; i < 22; i++) { const a = (i / 22) * PI * 2, r = i % 2 ? 0.72 : 1; p.push([Math.cos(a) * 46 * r, -44 + Math.sin(a) * 30 * r]); }
  s.p(c.cut(p, 0.4, 4), mix(C.night2, C.soilDark, 0.4));
  s.p(c.cut([[-8, -20], [20, 4], [6, -22]], 0.3, 3), mix(C.night2, C.soilDark, 0.4));
  s.x(c.ribbon([[-30, -44], [-22, -54], [-14, -40], [-4, -54], [6, -40], [16, -54], [26, -42]], 3), C.terracotta);
  return s.out();
}
/** a dark drape with a fringe; origin: top centre */
export function drapeCloth(c, w, h) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0], [w / 2 - 4, h]];
  for (let x = w / 2 - 4; x > -w / 2 + 4; x -= 20) pts.push(...c.arc(x - 10, h, 10, 7, 0, PI, 4));
  s.p(c.cut(pts, 0.8, 10), mix(C.night2, C.plumRobe, 0.3));
  let f = '';
  for (let x = -w / 2 + 16; x < w / 2; x += 26) f += c.ribbon([[x, 6], [x + c.rr(-4, 4), h - 8]], 2.4);
  s.x(f, shade(mix(C.night2, C.plumRobe, 0.3), 0.18), 'opacity=".6"');
  s.p(c.ribbon([[-w / 2 - 6, 2], [w / 2 + 6, 2]], 7), C.wood2);
  return s.out();
}
/** a rope strung between two posts with a red seal in the middle; origin: centre of the rope.
 *  `half`: half the distance between the posts (optional; the default keeps the original width) */
export function ropeBarrier(c, { half = 115 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-half - 5, -14, 10, 240), 0.3, 6) + c.cut(c.rect(half - 5, -14, 10, 240), 0.3, 6), C.wood2);
  s.p(c.cut(c.circ(-half, -16, 8, 10), 0.2, 3) + c.cut(c.circ(half, -16, 8, 10), 0.2, 3), C.wood3);
  s.p(c.ribbon(c.qbez([-half, -6], [0, 30], [half, -6], 18), 4), C.rope);
  s.p(c.cut(c.circ(0, 14, 16, 16), 0.4, 4), C.terracotta);
  s.p(c.cut(c.star(0, 14, 9, 4, 6), 0.2, 3), shade(C.terracotta, -0.25));
  s.p(c.cut([[-6, 28], [-12, 50], [-2, 44]], 0.3, 3) + c.cut([[6, 28], [12, 50], [2, 44]], 0.3, 3), C.terracotta);
  return s.out();
}
/** the Temple's gift chest with gold bands; origin: bottom centre */
export function giftChest(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-50, -58, 100, 58), 0.5, 7), C.wood);
  s.p(c.cut([[-54, -58], [54, -58], [48, -74], [-48, -74]], 0.4, 6), C.wood2);
  s.p(c.ribbon([[-50, -40], [50, -40]], 5) + c.ribbon([[-50, -14], [50, -14]], 5), C.sun);
  s.p(c.cut(c.rect(-8, -52, 16, 18), 0.3, 4), C.ochre);
  s.x(c.ribbon([[-14, -66], [14, -66]], 3), C.soilDark);
  return s.out();
}

/* ================================================================== the plant not planted by the Father */
/** a good garden plant (a young vine / lily); origin: ground */
export function goodPlant(c, h = 90, { flower = C.cream, leaf = C.leaf } = {}) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [c.rr(-8, 8), -h * 0.5], [c.rr(-6, 6), -h], 8), (u) => 5 - u * 3), C.moss);
  let lv = '';
  for (let i = 0; i < 5; i++) { const y = -h * (0.25 + i * 0.14), side = i % 2 ? 1 : -1; lv += c.cut(c.ell(side * 12, y, 13, 5, 10, side * 0.5), 0.3, 3); }
  s.p(lv, leaf);
  s.p(c.cut(c.star(0, -h - 4, 11, 5, 6, 0), 0.3, 3), flower);
  s.p(c.cut(c.circ(0, -h - 4, 3.6, 8), 0.2, 2), C.sun);
  return s.out();
}
/** a thorny weed with its roots (roots hang below the origin, hidden in the soil until it is pulled up) */
export function weed(c, h = 110) {
  const s = sheet();
  let roots = '';
  for (let i = 0; i < 6; i++) roots += c.ribbon(c.qbez([c.rr(-4, 4), 0], [c.rr(-22, 22), 26], [c.rr(-34, 34), c.rr(44, 70)], 8), (u) => 3.6 - u * 3);
  s.p(roots, mix(C.soil, C.wood3, 0.4));
  s.p(c.cut(c.blob(0, 2, 12, 6, 8, 0.2), 0.4, 3), C.soil);
  const stem = c.cbez([0, 0], [-10, -h * 0.4], [14, -h * 0.7], [0, -h], 12);
  s.p(c.ribbon(stem, (u) => 6 - u * 4), C.thorn);
  let th = '';
  stem.forEach(([x, y], i) => { if (i % 2 && i < 12) { const d = i % 4 === 1 ? 1 : -1; th += c.poly([[x, y - 3], [x + d * 11, y - 7], [x, y + 3]]); } });
  s.p(th, C.thorn2);
  let lv = '';
  for (let i = 0; i < 4; i++) { const [x, y] = stem[2 + i * 2], d = i % 2 ? 1 : -1; lv += c.cut([[x, y], [x + d * 16, y - 12], [x + d * 22, y - 2], [x + d * 14, y + 4]], 0.4, 3); }
  s.p(lv, mix(C.thorn, C.olive, 0.35));
  s.p(c.cut(c.star(0, -h - 6, 12, 5, 9, 0), 0.4, 3), mix(C.plumRobe, C.thorn, 0.35));
  return s.out();
}

/* ================================================================== the blind guides */
/** a pit in the road: the dark hole (back) and its near lip (front); origin centre of the mouth */
export function pitBack(c, w = 170) {
  return sheet().p(c.cut(c.blob(0, 6, w / 2, 26, 18, 0.08), 0.8, 6), mix(C.soilDark, C.night2, 0.3)).out();
}
export function pitLip(c, w = 170, col = mix(C.sand2, C.dune, 0.4)) {
  const pts = [[-w / 2 - 30, 10], ...c.arc(0, 8, w / 2 + 4, 22, PI, 0, 16).map(([x, y]) => [x, 2 * 8 - y + 10]), [w / 2 + 30, 10], [w / 2 + 40, 140], [-w / 2 - 40, 140]];
  const s = sheet().p(c.cut(pts, 0.8, 6), col);
  s.x(c.ribbon(c.arc(0, 12, w / 2 - 6, 16, 0.15, PI - 0.15, 12), 3), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}

/* ================================================================== the coast of Tyre (after Mark 7) */
export function islandCity(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 6, 190, 18, 16, 0.08), 0.8, 8), C.sand2);
  s.p(c.cut([[-170, 4], [-170, -46], [170, -46], [170, 4]], 0.6, 8), C.stone);
  let tw = '';
  for (let x = -170; x <= 170; x += 68) tw += c.cut(c.rect(x - 12, -70, 24, 74), 0.4, 5);
  s.p(tw, C.stone2);
  let cr = '';
  for (let x = -168; x < 170; x += 12) cr += c.poly(c.rect(x, -52, 6, 6));
  s.p(cr, C.stone);
  s.p(c.cut(c.rect(-60, -100, 90, 54), 0.4, 5) + c.cut(c.rect(50, -90, 60, 44), 0.4, 5), C.plaster);
  s.p(c.cut([[-66, -100], [36, -100], [-15, -128]], 0.4, 5), C.ochre);
  let fl = '';
  [-170, -102, -34, 34, 102, 170].forEach((x) => { fl += c.ribbon([[x, -70], [x, -90]], 1.6); fl += c.cut([[x, -90], [x + 16, -86], [x, -80]], 0.2, 3); });
  s.x(fl, mix(C.plumRobe, C.curtain2, 0.45));
  return s.out();
}
/** a line of purple dye-cloths drying between two posts (x0..x1, rope at top, posts down to gy) */
export function dyeLine(c, x0, x1, top, gy) {
  const s = sheet();
  const P = mix(C.plumRobe, C.indigo, 0.3), M = mix(C.plumRobe, C.curtain2, 0.45);
  s.p(c.cut(c.rect(x0 - 4, top, 8, gy - top), 0.3, 6) + c.cut(c.rect(x1 - 4, top, 8, gy - top), 0.3, 6), C.wood2);
  s.x(c.ribbon(c.qbez([x0, top + 6], [(x0 + x1) / 2, top + 26], [x1, top + 6], 16), 1.6), C.rope);
  const cols = [P, M, shade(P, 0.2), mix(M, C.cream, 0.3)];
  const n = Math.floor((x1 - x0 - 30) / 44);
  for (let i = 0; i < n; i++) {
    const u = (i + 0.7) / (n + 0.4), px = x0 + (x1 - x0) * u, py = top + 6 + Math.sin(u * PI) * 20;
    const h = c.rr(70, 110), w = c.rr(28, 38);
    const pts = [[px - w / 2, py], [px + w / 2, py], [px + w / 2 + 2, py + h]];
    for (let x = px + w / 2; x > px - w / 2; x -= 8) pts.push([x - 4, py + h + (Math.round(x) % 16 ? 5 : 0)]);
    s.p(c.cut(pts, 0.6, 6), cols[i % cols.length]);
  }
  return s.out();
}
/** a stone dye vat with purple in it; origin: ground centre */
export function vat(c, sc = 1) {
  const s = sheet();
  s.p(c.cut([[-34 * sc, -70 * sc], [34 * sc, -70 * sc], [30 * sc, 0], [-30 * sc, 0]], 0.5, 5), C.stone2);
  s.p(c.cut(c.ell(0, -70 * sc, 34 * sc, 7 * sc, 16), 0.3, 4), mix(C.plumRobe, C.indigo, 0.3));
  s.x(c.ribbon([[-33 * sc, -54 * sc], [33 * sc, -54 * sc]], 3), shade(C.stone2, -0.2), 'opacity=".6"');
  return s.out();
}
/** the unclean spirit: a small grey-violet storm of paper (no face, no horror); origin centre */
export function spiritCloud(c, { tails = true } = {}) {
  const col = mix(mix(C.night2, C.soilDark, 0.35), C.lavender, 0.25);
  const s = sheet();
  s.p(c.cut([...c.arc(-18, 0, 20, 16, PI, 2 * PI, 8), ...c.arc(6, -8, 24, 22, PI, 2 * PI, 9), ...c.arc(30, 2, 16, 14, PI * 1.1, 2 * PI, 6), [44, 12], [-36, 12]], 0.8, 5), col);
  if (tails) {
    s.x(c.ribbon(c.cbez([-20, 12], [-30, 26], [-6, 30], [-18, 46], 10), (u) => 4 - u * 3), col, 'opacity=".8"');
    s.x(c.ribbon(c.cbez([18, 12], [30, 28], [8, 34], [22, 50], 10), (u) => 4 - u * 3), col, 'opacity=".8"');
  }
  return s.out();
}
/** the girl asleep under her spirit, for a thought / inset (origin centre, ~110 wide) */
export function sickGirl(c, girl, bedFn) {
  return `<g transform="translate(-26 12) scale(.36)">${bedFn(c, 150)}</g><g transform="translate(-14 -8) rotate(-90) scale(.22)">${girl}</g>`;
}

/* ================================================================== the maimed and the healed */
/** an arm sling: a pale cloth across the chest (body coords, standing), put on with onBody */
export function sling(c, dy = 0) {
  const s = sheet();
  s.p(c.cut([[-20, -142 + dy], [-12, -148 + dy], [24, -104 + dy], [26, -86 + dy], [4, -80 + dy], [-6, -92 + dy], [12, -98 + dy]], 0.4, 4), C.linen);
  s.x(c.ribbon([[-14, -144 + dy], [18, -100 + dy]], 1.6), shade(C.linen, -0.15), 'opacity=".8"');
  return s.out();
}
/** a bandaged stump of an arm-cloth hanging from the front arm (for holdF): the maimed hand, wrapped */
export function wrap(c) {
  return sheet().p(c.cut(c.blob(0, 4, 8, 7, 8, 0.2), 0.3, 3), C.linen).x(c.ribbon([[-6, 2], [6, 6]], 1.4), shade(C.linen, -0.2)).out();
}
/** a few joyous lines rising (singing / praise); origin centre */
export function joyLines(c, r = 16, col = C.ochre) {
  let d = '';
  for (let i = 0; i < 5; i++) { const a = -PI * (0.2 + i * 0.15); d += c.ribbon([[Math.cos(a) * r, Math.sin(a) * r], [Math.cos(a) * r * 1.9, Math.sin(a) * r * 1.9]], 2.8); }
  return `<path d="${d}" fill="${col}"/>`;
}

/* ================================================================== the far hills of Israel (lost sheep) */
/** a painted board of the hills of Israel, for the lost sheep (origin top centre), w × h */
export function sheepBoard(c, w = 520, h = 250) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 10, -10, w + 20, h + 20), 0.8, 10), C.wood3);
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 10), '#e9e6d6');
  s.p(c.cut([[-w / 2, h * 0.5], [-w * 0.3, h * 0.36], [-w * 0.05, h * 0.46], [w * 0.2, h * 0.32], [w / 2, h * 0.44], [w / 2, h], [-w / 2, h]], 0.8, 8), mix(C.hillMid, C.sand, 0.3));
  s.p(c.cut([[-w / 2, h * 0.72], [-w * 0.2, h * 0.62], [w * 0.1, h * 0.7], [w * 0.36, h * 0.6], [w / 2, h * 0.66], [w / 2, h], [-w / 2, h]], 0.8, 8), mix(C.hillNear, C.sage2, 0.4));
  let rocks = '';
  for (let i = 0; i < 6; i++) rocks += c.cut(c.blob(c.rr(-w * 0.45, w * 0.45), c.rr(h * 0.55, h * 0.9), c.rr(8, 16), c.rr(5, 9), 8, 0.2), 0.4, 4);
  s.p(rocks, C.rock2);
  const str = `<path d="M${-w / 2 + 30} -10V-1600M${w / 2 - 30} -10V-1600" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  return str + s.out();
}
/** a shepherd's crook (origin: the grip) */
export function crook(c, h = 170) {
  return sheet().p(c.ribbon([[0, h * 0.5], [0, -h * 0.4], ...c.arc(12, -h * 0.4, 12, 14, PI, 2 * PI, 8).slice(1), [24, -h * 0.34]], 5), C.wood2).out();
}

/* ================================================================== a coastal road set (Tyre and Sidon) */
/**
 * The road along the Phoenician coast: rosy sky (and a second, deeper one faded in by the scene), snowy Lebanon,
 * the sea with Tyre on its island and purple-sailed ships, cypresses, the coast road (par `par`, top at gy).
 * Returns handles and update(time, t).
 */
export function coastSet(S, { gy = 700, par = 0.5, skyCols = COAST, sky2 = null, city = 1180, houses = true } = {}) {
  const c = S.c;
  sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }).layer : null;
  if (sk2) sk2.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sunDisc(c), { x: 690, y: 160, len: 800 });
  const cl = hanging(hangL, cloudPink(c), { x: 1080, y: 130, len: 800 });
  const mts = S.layer({ par: 0.06, sh: 2 });
  const mfn = c.wave(350, [60, 22, 6], [900, 330, 120]);
  mts.add(sheet().p(c.ridge(mfn, -900, 2500, 1200, 12, 1), mix(C.lavender, C.hillFar, 0.4)).out());
  let snow = '';
  for (let x = -600; x < 2200; x += 300) { const y = mfn(x); if (y < 320) snow += c.cut([[x - 26, y + 18], [x, y - 2], [x + 26, y + 18], [x + 10, y + 12], [x, y + 20], [x - 10, y + 12]], 0.6, 5); }
  mts.add(sheet().p(snow, C.cream).out());
  const seaL = S.layer({ par: 0.12, sh: 1 });
  const SEA_ = mix(C.lake, C.skyBlue2, 0.3);
  let foam = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-600, 2200), y = c.rr(446, 530), w = c.rr(20, 60); foam += c.cut([[x, y], [x + w / 2, y - 2], [x + w, y], [x + w / 2, y + 1]], 0.2, 8); }
  seaL.add(sheet().p(c.ridge(c.wave(430, [3, 1], [200, 70]), -900, 2500, 1200, 10, 0.6), SEA_).x(foam, C.foam, 'opacity=".6"').out());
  if (city != null) seaL.add(`<g transform="translate(${city} 452)">${islandCity(c)}</g>`);
  const coastL = S.layer({ par: 0.3, sh: 3 });
  const cfn = c.wave(560, [8, 3], [700, 200]);
  coastL.add(sheet().p(c.ridge(cfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.35)).out());
  let trees = '';
  [-500, -200, 180, 380, 1320, 1560, 1900].forEach((x, i) => { trees += cypressT(c, x, cfn(x) + 8, 110 + (i % 3) * 30, i % 2 ? C.moss2 : C.moss); });
  coastL.add(trees);
  const G = S.layer({ par, sh: 3 });
  const gfn = c.wave(gy, [3, 1.5], [700, 180]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.4)).out());
  let pebbles = '';
  for (let i = 0; i < 70; i++) { const x = c.rr(-700, 2300), y = c.rr(gy + 16, 1000); pebbles += c.cut(c.blob(x, y, c.rr(6, 14), c.rr(3, 6), 8, 0.2), 0.3, 4); }
  G.add(sheet().x(pebbles, C.sand2, 'opacity=".7"').out());
  return {
    c, sk2, hangL, sunEl, seaL, coastL, G, gfn,
    update(time) {
      pose(sunEl, { x: 690, y: 160, r: time ? Math.sin(time * 0.6) : 0 });
      pose(cl, { x: 1080 + (time ? Math.sin(time * 0.1) * 24 : 0), y: 130, r: time ? Math.sin(time * 0.6 + 1) * 1.2 : 0 });
    },
  };
}
function sunDisc(c) {
  const s = sheet();
  let rays = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; rays += c.poly([[Math.cos(a - 0.1) * 50, Math.sin(a - 0.1) * 50], [Math.cos(a) * 74, Math.sin(a) * 74], [Math.cos(a + 0.1) * 50, Math.sin(a + 0.1) * 50]]); }
  s.p(rays, C.dusk);
  s.p(c.cut(c.circ(0, 0, 46, 30), 0.4, 5), C.apricot);
  s.x(c.poly(c.circ(-8, -8, 26, 20)), '#f4cfa4', 'opacity=".7"');
  return s.out();
}
function cloudPink(c, w = 170) {
  const s = sheet();
  s.p(c.cut([...c.arc(-w * 0.28, 0, w * 0.22, w * 0.16, PI, 2 * PI, 8), ...c.arc(0, -w * 0.06, w * 0.26, w * 0.22, PI, 2 * PI, 9), ...c.arc(w * 0.28, 0, w * 0.2, w * 0.14, PI, 2 * PI, 8), [w * 0.48, 10], [-w * 0.5, 10]], 0.8, 6), C.blushVeil);
  s.x(c.ribbon([[-w * 0.4, 6], [w * 0.4, 6]], 5), '#e6c7c2', 'opacity=".8"');
  return s.out();
}
function cypressT(c, x, y, h = 160, color = C.moss2) {
  const s = sheet();
  s.p(c.cut([[x - 3, y], [x - h * 0.11, y - h * 0.3], [x - h * 0.09, y - h * 0.7], [x, y - h], [x + h * 0.09, y - h * 0.7], [x + h * 0.11, y - h * 0.3], [x + 3, y]], 0.8, 8), color);
  return s.out();
}
/** a house front on the Tyre road: plaster wall, a purple awning, a dark doorway; origin: ground at door centre */
export function tyreHouse(c, w = 240, h = 190) {
  const s = sheet();
  s.p(c.cut([[-w * 0.35, 0], [-w * 0.35, -h], [w * 0.65, -h], [w * 0.65, 0]], 0.6, 8), mix(C.plaster2, C.sand2, 0.3));
  s.p(c.cut([[-w * 0.35 - 12, -h], [w * 0.65 + 12, -h], [w * 0.65 + 12, -h - 16], [-w * 0.35 - 12, -h - 16]], 0.4, 8), C.roof);
  s.p(c.cut([[-34, 0], [-34, -100], ...c.arc(0, -100, 34, 30, PI, 2 * PI, 10), [34, 0]], 0.4, 6), mix(C.soilDark, mix(C.plumRobe, C.indigo, 0.3), 0.3));
  s.p(c.ribbon([[-38, 0], [-38, -100]], 7) + c.ribbon([[38, 0], [38, -100]], 7) + c.ribbon(c.arc(0, -100, 38, 34, PI, 2 * PI, 10), 7), C.wood2);
  const aw = [[-w * 0.3, -h + 30], [w * 0.6, -h + 30], [w * 0.62, -h + 58]];
  for (let x = w * 0.62; x > -w * 0.32; x -= 28) aw.push(...c.arc(x - 14, -h + 58, 14, 8, 0, PI, 5));
  s.p(c.cut(aw, 0.5, 7), C.cream);
  let st = '';
  for (let x = -w * 0.3 + 8; x < w * 0.6; x += 52) st += c.cut([[x, -h + 31], [x + 24, -h + 31], [x + 26, -h + 62], [x + 2, -h + 62]], 0.3, 5);
  s.x(st, mix(C.plumRobe, C.curtain2, 0.45), 'opacity=".85"');
  s.p(c.cut(c.rect(w * 0.28, -h + 84, 50, 40), 0.3, 5), mix(C.soilDark, C.plumRobe, 0.3));
  s.p(c.ribbon([[w * 0.28 - 4, -h + 126], [w * 0.28 + 54, -h + 126]], 5), C.wood2);
  return s.out();
}

/* ================================================================== the square above the lake */
/**
 * A village square above the lake of Galilee (Mt 15,10–14): sky, sun and a cloud on strings, birds, the far hills,
 * the lake, the village on the mid hills, the sandy square (par .45, top ≈ 600). Returns handles and update(time).
 */
export function squareSet(S, { skyCols = ['#cfe1de', '#efe6cd', '#f7ebd4'], sunAt = [1220, 130] } = {}) {
  const c = S.c;
  sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cl1 = hanging(hangL, cloud(c, 180), { x: 690, y: 110, len: 700 });
  const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 190, speed: 36, scale: 0.45 });
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
  S.layer({ par: 0.14, sh: 1 }).add(waterBand(c, { y: 440, color: C.lake, foamN: 14, bottom: 900 }).markup);
  const vill = S.layer({ par: 0.26, sh: 3 });
  const h2 = hillsWith(c, { y: 500, amps: [12, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
  vill.add(h2.markup);
  vill.add(town(c, { x: 330, y: h2.fn(330) + 16, n: 6, spread: 340, sc: 0.8 }) + town(c, { x: 1300, y: h2.fn(1300) + 16, n: 6, spread: 320, sc: 0.8 }));
  vill.add(palm(c, 520, h2.fn(520) + 18, 140) + olive(c, 1110, h2.fn(1110) + 16, 0.8));
  const sq = S.layer({ par: 0.45, sh: 3 });
  const sfn = c.wave(600, [4, 2], [700, 180]);
  sq.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.35)).out());
  sq.add(grass(c, { x0: -700, x1: 2300, y: 600, fn: sfn, n: 30, h: 12, color: C.olive }));
  return {
    c, hangL, sq, sfn,
    update(time) {
      pose(sunEl, { x: sunAt[0], y: sunAt[1], r: time ? Math.sin(time * 0.8) : 0 });
      pose(cl1, { x: 690 + (time ? Math.sin(time * 0.1) * 20 : 0), y: 110, r: time ? Math.sin(time * 0.7 + 1) * 1.2 : 0 });
      birds(time, 1);
    },
  };
}

/* ================================================================== crowds in three moods */
/**
 * A still group of n people as sprite markup, centred on (0, 0) at their feet. The same seed always gives the same
 * people, so the moods can be cross-faded: mood 0 standing quietly, 1 marvelling (hands forward, heads up), 2 praising
 * (arms raised). P: 'stand' | 'sit'. kids: how many of them are children (drawn smaller).
 */
export function crowdGroup(seed, n, { s = 0.7, flip = false, spread = 40, rows = 2, P = 'stand', mood = 0, men = null } = {}) {
  const c = makeCutter(seed);
  const per = Math.ceil(n / rows);
  const ms = Array.from({ length: n }, (_, i) => {
    const r = Math.floor(i / per), k = i % per;
    const o = crowdPerson(c);
    if (men === true && o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; }
    const j = [c.rr(-6, 6), c.rr(-3, 3), c.rr(0.92, 1.05), c.rr(-6, 4), c.rr(0, 20), c.rr(0, 1)];
    const arms = mood === 2 ? { armF: 50 + j[5] * 40, armB: 120 + j[5] * 30, head: -8 } : mood === 1 ? { armF: 70 + j[5] * 40, armB: 20 + j[5] * 60, head: -6 + j[3] * 0.5 } : { armF: j[4], armB: 0, head: j[3] };
    return { x: (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + j[0], y: r * 20 + j[1], s: s * j[2] * (1 + r * 0.04), flip, ...arms, o: { ...o, pose: P } };
  });
  return pose3_(c, ms);
}
