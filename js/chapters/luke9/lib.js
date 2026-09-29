// Luke 9 — the cast and cut-outs of this chapter. The hillside over the lake at Bethsaida is John 6's (the same
// place looks the same); Herod's hall, the portraits of John, Elijah and a prophet, the travel kit are Mark 6's;
// the plain at the foot of the mountain is Mark 9's. New here: the Galilean meadow with its villages and the roads
// the Twelve are sent along; the mountain of prayer at nightfall, where the glory comes while He prays and the
// three are heavy with sleep; the long road that runs from Galilee to Jerusalem on its far hill, the Samaritan
// village on the way, the roadside bank with the fox's hole and the bird's nest, and the field with the plough.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, house, sun, moon, cloud, stars, rock, grass, flowers, olive, cypress, bush } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { folk } from '../john6/lib.js';
import { figure, bake } from '../luke4/lib.js';
import { stillGroup, halo } from '../luke6/lib.js';
import { portrait, labelTag } from '../mark6/lib.js';
import { ELIJAH } from '../luke4/lib.js';
import { LOOK as L6 } from '../mark6/lib.js';
import { jerusalem } from '../mark11/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, dust, coin, coinStack, loaf, wordSlip, scrap, addToHead, candle, scrollRolled, scrollOpen } from '../mark2/lib.js';
export { TWELVE, bubble, strip, nameTag, question, withFace, faceBits, shadowPerson, silhouette, along, handAt, sparkle, card, stoneHeart } from '../mark3/lib.js';
export { LOOK as L6, staff, bag, purse, tunic, sandals, crossX, tick, disc, labelTag, portrait, throne, crown, noble, platter, basket, crumb, fishCut, storyFrame, SEPIA } from '../mark6/lib.js';
export { hillSet, meadowRows, folk, group, barleyLoaf, SPRING, GOLDEN, DUSK, NIGHT, DAWN, MORNING, NOON, TW } from '../john6/lib.js';
export { LOOK as L9, JESUS_WHITE, tent, fireWheel, tablets, arcRings, seizurePlate, reachingHand, paperCrown, measureRod, flecks, darkScrap, sealedScroll, plainSet, crownOfLight } from '../mark9/lib.js';
export { glory, lightCrown, globe, soulLight, angel, heavenPanel, oilHorn, smallCross, balance } from '../mark8/lib.js';
export { MOSES, hungWord, radiance, rayBurst, glowDisc, goldWord } from '../john1/lib.js';
export { ELIJAH, figure, bake, manO, womanO } from '../luke4/lib.js';
export { LK12, stillGroup, halo, kfl } from '../luke6/lib.js';
export { flat, flatSky, flyTo, fig, flatHills, flatText, dropK } from '../luke1/lib.js';
export { shadowScreen, hourglass } from '../mark13/lib.js';
export { carryCross, openHouse } from '../matthew10/lib.js';
export { jerusalem, lamb } from '../mark11/lib.js';
export { fox, voiceRings, hang2, flame, dove, flapWings, crutch, mat, handLamp } from '../mark1/lib.js';
export { spirit, lyingPerson } from '../mark5/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';

/* ================================================================== skies */
export const MORNING9 = ['#c8dfdb', '#eee9d2', '#f8ead0'];
export const DAY9 = ['#c3dcd9', '#ecedd6', '#f7ebcf'];
export const GOLD9 = ['#d6c0b3', '#f0cc9e', '#f7ddb2'];
export const DUSK9 = ['#6d6a9c', '#d59e8f', '#f1c29b'];
export const NIGHT9 = ['#131a3c', '#232d63', '#46508a'];
export const DAWN9 = ['#8e92b8', '#e6b7a4', '#f5d4ae'];
export const COURT9 = ['#b89fb8', '#e8b597', '#f3d0a4'];

/* ================================================================== the cast */
/** the Twelve, in Luke's order, keyed by name */
import { LK12 as _LK12 } from '../luke6/lib.js';
export const TW9 = Object.fromEntries(_LK12.map((m) => [m.k, m.o]));
/** Herod the tetrarch (Mark 6's Herod) */
export const HEROD = L6.herod;
/** the three portraits of what people say of Him: John risen, Elijah, one of the old prophets */
export const JOHN_P = L6.john;
export const PROPHET = L6.prophet || { robe: mix(C.stone, C.sand2, 0.3), mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone2, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
/** a Samaritan villager */
export const SAMARITAN = (i = 0) => ({ robe: [C.ochreRobe, C.tealRobe, C.roseRobe][i % 3], mantle: [C.clay, C.stone, null][i % 3], hair: [C.hair3, C.hair, C.greyHair][i % 3], hairStyle: ['wrap', 'short', 'wrap'][i % 3], veil: [C.linen2, C.stone, C.sand2][i % 3], veil2: [C.terracotta, C.dustyBlue, C.clay][i % 3], beard: ['full', 'short', 'full'][i % 3], skin: [C.skin3, C.skin2, C.skin4][i % 3], belt: C.leather });
/** the three who would follow (9,57–62) */
export const EAGER = { robe: C.roseRobe, mantle: C.linen2, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin, belt: C.leather };
export const MOURNER = { robe: mix(C.stone2, C.dustyBlue, 0.3), mantle: mix(C.storm, C.stone2, 0.55), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.rope };
export const FARMER = { robe: C.wheatRobe, mantle: null, hair: C.hair, hairStyle: 'wrap', veil: C.sand2, veil2: C.clay, beard: 'full', skin: C.skin3, belt: C.leather };

/* ================================================================== small helpers */
/** a still person (arms baked) as markup at (x, y) */
export const still = (c, o, x, y, s = 1, flip = false, armF = 0, armB = 0, head = 0) => figure(c, o, { x, y, s, flip, armF, armB, head });
/** hanging portrait of John / Elijah / a prophet (Mark 6's), with a question-tag under it; origin: string end */
export function whoPortrait(S, i, { w = 104, h = 124 } = {}) {
  const c = S.c;
  const P = [
    [JOHN_P, tr('Jan?', 'John?'), mix(C.parchment, C.sand, 0.3)],
    [ELIJAH, tr('Eliasz?', 'Elijah?'), mix(C.parchment, C.apricot, 0.3)],
    [PROPHET, tr('prorok?', 'a prophet?'), mix(C.parchment, C.skyVeil, 0.4)],
  ][i];
  return portrait(c, S.id('who' + i), P[0], { w, h, bg: P[2], label: P[1] });
}
/**
 * Crowd sprites: rows of still groups drawn once and moved on the compositor.
 * rows: [{ y, s, xs:[…], n = 4, pose }]. Returns [{ sp, x, y, side, row, i }].
 */
export function crowdRows(L, pc, rows, { cx = 800, seat = false, twin = null } = {}) {
  const out = [];
  rows.forEach((row, r) => row.xs.forEach((x, i) => {
    const side = x < cx ? -1 : 1;
    const n = row.n || 4;
    const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * (row.gap || 32) + pc.rr(-5, 5), y: pc.rr(-5, 5), s: 1, flip: side > 0, o: { ...folk(pc), pose: row.pose || 'stand' }, head: pc.rr(-6, 2), armF: pc.rr(0, 24), armB: pc.rr(0, 12) }));
    const draw = (ms) => `<g transform="scale(${row.s})">${stillGroup(pc, ms)}</g>`;
    const sp = L.sprite(draw(mem), x, row.y);
    const alt = twin ? L.sprite(draw(mem.map((m, k) => ({ ...m, ...twin(m, k) }))), x, row.y) : null;
    if (alt) alt.set({ x, y: row.y, s: 1, o: 0 });
    out.push({ sp, alt, x, y: row.y, side, row: r, i: out.length, s: row.s });
  }));
  return out;
}

/* ================================================================== the Galilean meadow and its villages */
/**
 * A meadow in Galilee: the sun and clouds on strings, far hills, and a ridge with four villages; from the middle of
 * the meadow (800, 720) roads fan out up to each village. Always cut with the same scissors.
 * Returns { sk, gfn, VIL:[{x, y}], ROAD:[pts…], spiritL, update(time) }.
 */
export const VIL9 = [[330, 486], [590, 470], [1010, 470], [1270, 486]];
export function galSet(S, { skyCols = MORNING9, sunAt = [1240, 150], rise = 1 } = {}) {
  const c = makeCutter('lk9-gal');
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5, rise });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[520, 140, 190], [960, 108, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 800 }), x, y, i }));
  const far = S.layer({ par: 0.08, sh: 2, rise });
  far.add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.1) }).markup);
  // the village ridge, and the meadow in front of it on the same sheet (so the roads run unbroken up to the villages)
  const ridge = S.layer({ par: 0.18, sh: 3, rise });
  const rfn = (x) => 484 + Math.sin(x * 0.0052 + 1.2) * 12 + Math.sin(x * 0.017) * 4;
  const gfn = c.wave(606, [5, 2], [800, 200]);
  const rs = sheet();
  rs.p(c.ridge(rfn, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.hillNear, 0.3));
  rs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4));
  // the roads from the middle of the meadow up to each village, fanning in perspective
  const ROAD = VIL9.map(([vx, vy]) => c.qbez([800 + (vx - 800) * 0.1, 780], [800 + (vx - 800) * 0.72, 640], [vx, vy + 22], 16));
  let rd = '';
  ROAD.forEach((pts) => { rd += c.ribbon(pts, (u) => 46 - u * 40); });
  rs.p(rd + c.cut(c.blob(800, 800, 150, 46, 18, 0.08), 0.8, 8), mix(C.sand, C.cream, 0.3));
  ridge.add(rs.out());
  VIL9.forEach(([x, y]) => ridge.add(town(c, { x, y: y + 8, n: 5, spread: 150, sc: 0.5 })));
  ridge.add(cypress(c, 460, rfn(460) + 4, 70) + cypress(c, 1150, rfn(1150) + 4, 76) + olive(c, 180, rfn(180) + 10, 0.45) + olive(c, 1420, rfn(1420) + 10, 0.5) + olive(c, 800, rfn(800) + 6, 0.4));
  ridge.add(grass(c, { x0: -800, x1: 2400, y: 610, fn: gfn, n: 44, h: 12, color: C.moss }) + flowers(c, { x0: 250, x1: 1400, y: 700, fn: (x) => gfn(x) + 60 + Math.sin(x) * 30, n: 16, h: 12 }));
  const spiritL = S.layer({ par: 0.18, sh: 3 });
  const G = ridge;
  return {
    c, sk, hangL, far, ridge, spiritL, G, gfn, ROAD, rfn,
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 22, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}
/** where someone walking a village road is at u (0 = meadow, 1 = village): [x, y, scale] */
export function roadAt(ROAD, i, u, s0 = 0.9) {
  const pts = ROAD[i];
  const k = Math.max(0, Math.min(1, u)) * (pts.length - 1);
  const a = Math.floor(k), b = Math.min(pts.length - 1, a + 1), f = k - a;
  const x = lerp(pts[a][0], pts[b][0], f), y = lerp(pts[a][1], pts[b][1], f);
  return [x, y, s0 * lerp(1, 0.34, Math.pow(Math.max(0, Math.min(1, u)), 0.8))];
}

/* ================================================================== the hillside by Bethsaida */
/**
 * John 6's green hillside over the lake (the same sky, far shore, lake and hills), with the town of Bethsaida on the
 * slope to the right, a crowd layer on the meadow slope (crowdL, par 0.3) and the near ground (G, par 0.5) where Jesus
 * stands. A second sky (evening) can be cross-faded with eve.fade(). Always cut with the same scissors.
 * pads: world units each moving layer may be shifted (for scenery that slides past walkers).
 * Returns { sk, eve, hangL, sunEl, far, lake, mid, slopeL, sfn, crowdL, G, gfn, townEl, update(time, {sunX, sunY}) }.
 */
import { waterBand } from '../../assets/nature.js';
export const BETH = { TX: 1180 };
export function bethSet(S, { skyCols = SPRING9, eveCols = null, sunAt = [1180, 150], pads = [0, 0, 0], townAt = BETH.TX } = {}) {
  const c = makeCutter('lk9-beth');
  const sk = sky(S, skyCols);
  const eve = eveCols ? sky(S, eveCols, { name: 'eve', rise: 0 }).layer : null;
  if (eve) eve.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[470, 150, 200], [1000, 118, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 800 }), x, y, i }));
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 392, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup);
  far.add(town(c, { x: 330, y: fb.fn(330) + 14, n: 7, spread: 240, sc: 0.42 }));
  const lake = S.layer({ par: 0.1, sh: 1 });
  lake.add(waterBand(c, { y: 418, color: mix(C.lake, C.skyBlue, 0.25), foamN: 18, bottom: 900 }).markup);
  const mid = S.layer({ par: 0.16, sh: 3, pad: pads[0] });
  const mh = hillsWith(c, { y: 486, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
  mid.add(mh.markup);
  const townEl = mid.add(`<g transform="translate(${townAt} 0)">${town(c, { x: 0, y: mh.fn(townAt) + 16, n: 7, spread: 230, sc: 0.62 })}</g>`);
  const slopeL = S.layer({ par: 0.3, sh: 3, pad: pads[1] });
  const sfn = c.wave(560, [9, 4], [760, 240]);
  slopeL.add(sheet().p(c.ridge(sfn, -1400, 3000, 1700, 12, 1), mix(C.hillNear, C.sand, 0.22)).out());
  slopeL.add(olive(c, 170, 590, 0.8) + olive(c, 1460, 600, 0.85) + cypress(c, 1320, 580, 110) + olive(c, -300, 600, 0.8) + cypress(c, 2000, 590, 100) + olive(c, 2300, 596, 0.8));
  const crowdL = S.layer({ par: 0.3, sh: 4 });
  const G = S.layer({ par: 0.5, sh: 3, pad: pads[2] });
  const gfn = c.wave(700, [5, 2], [700, 180]);
  G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1700, 10, 1), mix(C.sage2, C.hillNear, 0.5)).out());
  G.add(rock(c, 380, gfn(380) + 18, 120, 36, C.rock2) + rock(c, 1260, gfn(1260) + 16, 80, 26, C.rock) + rock(c, 1700, gfn(1700) + 18, 110, 34, C.rock2) + rock(c, -200, gfn(-200) + 18, 90, 30, C.rock));
  G.add(grass(c, { x0: -1300, x1: 2900, y: 700, fn: gfn, n: 70, h: 14, color: C.moss }) + flowers(c, { x0: -600, x1: 2200, y: 700, fn: gfn, n: 24 }));
  return {
    c, sk, eve, hangL, sunEl, far, lake, mid, slopeL, sfn, crowdL, G, gfn, townEl, mfn: mh.fn,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.i) * 24, y: cl.y, r: Math.sin(time * 0.6 + cl.i) * 1.2 }));
    },
  };
}
export const SPRING9 = ['#c9e0da', '#eef0d8', '#f8ecd0'];
export const EVE9 = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
/** the crowd on the slope by Bethsaida (always the same people): standing still groups as sprites */
export const BETH_ROWS = [
  { y: 592, s: 0.42, xs: [220, 340, 460, 580, 1300, 1420] },
  { y: 620, s: 0.48, xs: [150, 280, 410, 540, 660, 1360] },
  { y: 652, s: 0.56, xs: [200, 350, 500] },
];
export function bethCrowd(B, rows = BETH_ROWS, opts = {}) {
  return crowdRows(B.crowdL, makeCutter('lk9-beth-crowd'), rows, opts);
}
/** a round company of people sitting on the grass, facing its middle (still markup, origin: the middle of the ring) */
export function ringGroup(c, n = 9, { rx = 70, ry = 16, food = null } = {}) {
  const mem = [];
  for (let k = 0; k < n; k++) {
    const a = (k / n) * PI * 2 + c.rr(-0.12, 0.12);
    const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    mem.push({ x, y, s: 1 + y / ry * 0.06, flip: x > 0, o: { ...folk(c), pose: 'sit' }, armF: c.rr(10, 40), armB: c.rr(0, 20), head: c.rr(-4, 4) });
  }
  const food_ = food ? `<g transform="translate(0 4)">${food}</g>` : '';
  const back = mem.filter((m) => m.y < 0), front = mem.filter((m) => m.y >= 0);
  return stillGroup(c, back) + food_ + stillGroup(c, front);
}
/** where the companies of about fifty sit on the slope (x, y, scale) — the same in the sitting and the feeding */
export const RINGS = [
  [180, 598, 0.4], [360, 596, 0.4], [540, 598, 0.4], [720, 594, 0.4], [880, 596, 0.4], [1060, 598, 0.4], [1240, 596, 0.4], [1420, 600, 0.4],
  [100, 636, 0.47], [300, 634, 0.47], [490, 638, 0.47], [1110, 636, 0.47], [1300, 634, 0.47], [1500, 638, 0.47],
  [220, 680, 0.54], [440, 684, 0.54], [1160, 682, 0.54], [1380, 680, 0.54],
];
/** the seated companies as sprites (always cut the same); food: markup placed in the middle of each ring */
export function ringSprites(B, food = null) {
  const pc = makeCutter('lk9-rings');
  return RINGS.map(([x, y, s], i) => ({ i, x, y, s, sp: B.crowdL.sprite(`<g transform="scale(${s})">${ringGroup(pc, 9, { food: food ? food(pc, i) : null })}</g>`, x, y) }));
}
/** more of the multitude (about five thousand): extra rows of standing sprites, besides bethCrowd */
export const MORE_ROWS = [
  { y: 572, s: 0.36, xs: [140, 250, 360, 470, 580, 1020, 1130, 1240, 1350, 1460] },
  { y: 652, s: 0.56, xs: [1150, 1300, 1450] },
  { y: 684, s: 0.62, xs: [120, 280, 1400] },
];
export function moreCrowd(S, B) {
  const pc = makeCutter('lk9-more-crowd');
  const back = S.layer({ par: 0.3, sh: 4 });
  B.crowdL.el.parentNode.insertBefore(back.el, B.crowdL.el);
  return [...crowdRows(back, pc, MORE_ROWS.slice(0, 1)), ...crowdRows(B.crowdL, pc, MORE_ROWS.slice(1))];
}

/* ================================================================== the quiet place where He prays (9,18–27) */
/**
 * A hillside apart: sky and sun on strings, far hills, an old olive tree over a flat rock where He prays; bushes.
 * night: optional second sky (cross-fade with .night.fade). Always cut with the same scissors.
 */
export function restSet(S, { skyCols = MORNING9, nightCols = null, sunAt = [1230, 170] } = {}) {
  const c = makeCutter('lk9-rest');
  const sk = sky(S, skyCols);
  const night = nightCols ? sky(S, nightCols, { name: 'night', rise: 0 }).layer : null;
  if (night) night.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 40), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cl = hanging(hangL, cloud(c, 170), { x: 480, y: 150, len: 800 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [22, 9, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.lavender, 0.18) }).markup);
  const mid = S.layer({ par: 0.18, sh: 3 });
  mid.add(hillsWith(c, { y: 520, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 18 }).markup);
  const G = S.layer({ par: 0.45, sh: 3 });
  const gfn = c.wave(650, [6, 3], [800, 200]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.25)).out());
  G.add(olive(c, 960, 660, 1.35) + rock(c, 820, 712, 240, 44, C.rock2) + rock(c, 700, 718, 90, 28, C.rock) + bush(c, 300, 690, 120, C.sage, C.moss) + bush(c, 1330, 684, 140, C.moss, C.sage));
  G.add(grass(c, { x0: -800, x1: 2400, y: 660, fn: gfn, n: 44, h: 13, color: C.moss }) + flowers(c, { x0: 260, x1: 1400, y: 700, fn: (x) => gfn(x) + 50, n: 16, h: 12 }));
  return {
    c, sk, night, hangL, mid, G, gfn, sunEl,
    update(time, { sunX = sunAt[0], sunY = sunAt[1] } = {}) {
      swing(sunEl, sunX, sunY, time, 1, 0.6);
      swing(cl, 480 + Math.sin(time * 0.1) * 20, 150, time, 1.2, 0.6, 1);
    },
  };
}
/** where the disciples sit round Him in the quiet place */
export const REST_SIT = [
  { k: 'andrew', x: 470, y: 736 }, { k: 'peter', x: 590, y: 730 }, { k: 'thomas', x: 520, y: 690 },
  { k: 'john', x: 1010, y: 730 }, { k: 'james', x: 1130, y: 736 }, { k: 'matthew', x: 1080, y: 690 },
];

/* ================================================================== the mountain of prayer at nightfall (9,28–36) */
export const SUM = { TOP: 626, SIDE: 640, LEDGE: 742, JX: 800, MX: 590, EX: 1010 };
export const SUMMIT_DUSK = ['#8d86b0', '#e0a792', '#f2c79e'];
export const SUMMIT_NIGHT = ['#10163a', '#222b61', '#3f4a86'];
export const SUMMIT_GLORY = ['#6f6aa0', '#dcc39c', '#f7e6bd'];
/**
 * The top of the mountain where He goes up to pray: a dusk sky with a night sky over it (night.fade) and a glory sky
 * (glory.fade), stars, the moon on its string, the far ranges and the valley below in the last light, the summit's
 * rocky top with a path coming up on the left. Always cut with the same scissors.
 */
export function summitSet(S, { moonAt = [1180, 170] } = {}) {
  const c = makeCutter('lk9-summit');
  sky(S, SUMMIT_DUSK);
  const night = sky(S, SUMMIT_NIGHT, { name: 'night', rise: 0 }).layer;
  const glory = sky(S, SUMMIT_GLORY, { name: 'glory', rise: 0 }).layer;
  night.fade(0); glory.fade(0);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -500, y1: 430, n: 90 }));
  starL.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const moonEl = hanging(hangL, `<circle r="60" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 30)}`, { x: 0, y: -1500, len: 900 });
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 612, amps: [34, 14, 4], lens: [800, 260, 110], color: mix(C.hillFar, C.lavender, 0.4) }).markup);
  const valley = S.layer({ par: 0.12, sh: 2 });
  valley.add(band(c, { y: 676, amps: [14, 6, 3], lens: [700, 240, 100], color: mix(C.hillMid, C.duskViolet, 0.35) }).markup + town(c, { x: 180, y: 690, n: 5, spread: 160, sc: 0.3, lit: true }) + town(c, { x: 1460, y: 688, n: 4, spread: 140, sc: 0.28, lit: true }));
  const dim = S.layer({ par: 0.12, sh: 1, flat: true });
  dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2150"/>`);
  dim.fade(0);
  // the summit
  const ground = S.layer({ par: 0.4, sh: 4 });
  const g = sheet();
  g.p(c.cut([[-900, 1700], [-900, 760], [200, 720], [420, 670], [560, 648], [700, 632], [900, 630], [1060, 642], [1220, 664], [1400, 700], [2500, 740], [2500, 1700]], 1.4, 12), mix(C.rock, C.hillNear, 0.35));
  g.p(c.cut([[690, 632], [712, 612], [760, 604], [850, 606], [900, 616], [916, 634]], 0.8, 8), C.rock2);
  g.p(c.cut([[-900, 780], [300, 740], [520, 730], [760, 740], [1100, 732], [1400, 750], [2500, 780], [2500, 1700], [-900, 1700]], 1.2, 12), mix(C.rock2, C.hillNear, 0.3));
  // the path coming up from the left
  g.p(c.ribbon(c.cbez([-200, 900], [100, 820], [300, 760], [560, 700], 20), (u) => 50 - u * 30), mix(C.sand, C.rock, 0.45));
  ground.add(g.out());
  ground.add(rock(c, 330, 734, 90, 34, C.rock) + rock(c, 1270, 716, 110, 40, C.rock2) + rock(c, 1150, 736, 50, 18) + grass(c, { x0: 200, x1: 1500, y: 720, n: 30, h: 10, color: C.olive, fn: (x) => 660 + Math.abs(x - 800) * 0.09 }));
  const gdim = S.layer({ par: 0.4, sh: 1, flat: true });
  gdim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2150"/>`);
  gdim.fade(0);
  return {
    c, night, glory, starL, moonEl, dim, gdim, ground,
    /** the near rocks in front (call after the people are added) */
    front() { S.layer({ par: 0.9, sh: 6 }).add(rock(c, 120, 980, 300, 120, C.rock2) + rock(c, 1480, 990, 260, 100, C.rock)); },
    /** k: 0 dusk → 1 night; g: glory 0..1 */
    set(time, { k = 0, g = 0, moonK = 0 } = {}) {
      night.fade(k * (1 - g * 0.6));
      glory.fade(g);
      starL.fade(k * (1 - g * 0.7));
      dim.fade(k * 0.45 * (1 - g));
      gdim.fade(k * 0.28 * (1 - g * 0.8));
      pose(moonEl, { x: moonAt[0], y: lerp(-1500, moonAt[1], moonK), r: Math.sin(time * 0.5) * 1.2, oy: 0, o: moonK > 0.002 ? 1 : 0 });
    },
  };
}

/* ================================================================== the plain at the foot of the mountain (9,37–45) */
/**
 * Mark 9's plain at the foot of the mountain (the same place): the mountain behind, a village on the hills, a trodden
 * ground; plus a crowd of still sprites on it (crowd: rows). Always cut with the same scissors.
 */
export const FOOT_ROWS = [
  { y: 588, s: 0.42, xs: [930, 1030, 1130, 1230, 1330, 1430] },
  { y: 612, s: 0.5, xs: [880, 990, 1100, 1210, 1320, 1440] },
  { y: 640, s: 0.58, xs: [1000, 1130, 1260, 1390] },
];
export function footSet(S, { skyCols = ['#cfe0dc', '#efe6cf', '#f6e8d0'], rows = FOOT_ROWS, twin = null } = {}) {
  const c = makeCutter('lk9-foot');
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const clouds = [[480, 150, 190], [1150, 110, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) }));
  const mtL = S.layer({ par: 0.08, sh: 2 });
  const mt = sheet();
  mt.p(c.cut([[-900, 520], [240, 480], [440, 390], [570, 290], [640, 240], [700, 226], [760, 250], [900, 340], [1100, 420], [1400, 480], [2500, 500], [2500, 1700], [-900, 1700]], 1.4, 12), mix(C.hillFar, C.lavender, 0.22));
  mt.p(c.cut([[570, 290], [640, 240], [700, 226], [760, 250], [800, 278], [740, 270], [700, 288], [660, 270], [612, 294]], 0.8, 8), C.cream, 'opacity=".85"');
  mtL.add(mt.out());
  const far = S.layer({ par: 0.16, sh: 3 });
  const fh = hillsWith(c, { y: 500, amps: [18, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 20 });
  far.add(fh.markup + town(c, { x: 1270, y: fh.fn(1270) + 10, n: 6, spread: 240, sc: 0.55 }));
  const ground = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(560, [5, 2], [700, 160]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sage2, 0.35)).out());
  ground.add(olive(c, 260, 566, 0.95) + olive(c, 1400, 568, 0.85) + rock(c, 1180, 580, 60, 22, C.rock2) + rock(c, 380, 590, 44, 16));
  ground.add(grass(c, { x0: -400, x1: 2000, y: 560, fn: gfn, n: 34, h: 12, color: C.olive }));
  const crowdL = S.layer({ par: 0.32, sh: 4 });
  const crowd = crowdRows(crowdL, makeCutter('lk9-foot-crowd'), rows, { twin });
  return {
    c, sk, hangL, ground, gfn, crowdL, crowd,
    update(time) { clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 22, cl.y, time, 1.2, 0.6, cl.i)); },
  };
}
/** the boy's father and the boy (Mark 9's) */
import { LOOK as _L9 } from '../mark9/lib.js';
export const FATHER = _L9.father;
export const BOY = _L9.boy;

/* ================================================================== a village courtyard at evening (9,46–50) */
export const CHILD = _L9.child;
export const STRANGER = _L9.stranger;
export const YARD = ['#b9aecb', '#efc3a2', '#f6dcb8'];
/**
 * The courtyard of a village house where they stop for the evening: sky, far hills, the house wall with its door and
 * a lit window, a fig tree over the low wall, a stone floor. Always cut with the same scissors.
 */
import { figTree } from '../mark11/lib.js';
export function yardSet(S, { skyCols = YARD } = {}) {
  const c = makeCutter('lk9-yard');
  sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 36, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 1250, y: 250, len: 900 });
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [20, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup);
  const back = S.layer({ par: 0.25, sh: 3 });
  // the house wall on the left, the low courtyard wall across, the fig tree on the right
  const w = sheet();
  const doorPts = [[330, 620], [330, 500], ...c.arc(370, 500, 40, 40, PI, 2 * PI, 10), [410, 620]];
  const winPts = c.rect(500, 440, 50, 44);
  w.p(c.cut([[-900, 640], [-900, 330], [640, 330], [640, 640]], 0.8, 12) + c.hole(doorPts, 0.4, 6) + c.hole(winPts, 0.3, 5), C.plaster);
  w.p(c.cut([[-900, 330], [660, 330], [660, 316], [-900, 316]], 0.4, 10), C.roof);
  w.p(c.cut([[640, 640], [640, 330], [690, 350], [690, 640]], 0.5, 8), C.plaster2);
  w.p(c.ribbon([[326, 620], [326, 500]], 6) + c.ribbon([[414, 620], [414, 500]], 6) + c.ribbon(c.arc(370, 500, 44, 44, PI, 2 * PI, 10), 6), C.wood2);
  let beams = '';
  for (let x = -880; x < 640; x += 34) beams += c.cut(c.circ(x, 322, 4, 8), 0.2, 3);
  w.p(beams, C.wood3);
  back.add(`<path d="${c.poly(doorPts)}" fill="${mix(C.soilDark, C.night, 0.3)}"/><path d="${c.poly(winPts)}" fill="${C.lampGlow}"/><circle cx="525" cy="462" r="80" fill="url(#warm-glow)"/>` + w.out());
  const fig = figTree(c, 1.1);
  back.add(`<g transform="translate(1260 640)">${fig.trunk}${fig.leaves}</g>`);
  back.add(sheet().p(c.cut([[690, 640], [690, 570], [2500, 570], [2500, 640]], 0.8, 12), mix(C.stone, C.sand, 0.3)).x(Array.from({ length: 40 }, (_, i) => c.cut(c.rect(700 + i * 46 + (i % 2) * 8, 578 + (i % 3) * 18, 38, 14), 0.3, 5)).join(''), shade(C.stone, -0.08), 'opacity=".5"').out());
  const floor = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-900, 636], [2500, 636], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.stone, C.sand2, 0.3));
  let fl = '';
  for (let y = 660; y < 1000; y += 38) for (let x = -700 + (Math.round(y / 38) % 2) * 44; x < 2300; x += 88) fl += c.cut(c.rect(x, y, 80, 32), 0.4, 6);
  f.x(fl, shade(mix(C.stone, C.sand2, 0.3), -0.06), 'opacity=".55"');
  floor.add(f.out());
  floor.add(`<g transform="translate(560 640)">${sheet().p(c.cut([[-24, 0], [-18, -46], [18, -46], [24, 0]], 0.4, 5), C.pot).p(c.cut(c.ell(0, -46, 20, 6, 12), 0.3, 4), shade(C.pot, -0.2)).out()}</g>`);
  return {
    c, update(time) { swing(sunEl, 1250, 250, time, 1, 0.6); },
  };
}

/* ================================================================== the road to Jerusalem (9,51–62) */
export const ROAD9 = { CITY: [1000, 404], JX: 760, JY: 716, GATE: [1044, 640], DEN: [1080, 702], NEST: [1166, 500] };
export const ROADDAY = ['#c3d9d8', '#ede7cf', '#f7e6c6'];
export const ROADEVE = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const ROADNIGHT = ['#1c2350', '#3a3f7a', '#8a6f8e'];
/** the whole road (world coords): near part from the bottom-left to the village, then on up to the city */
export const ROAD_NEAR = [[180, 960], [420, 830], [620, 750], [800, 712], [940, 672], [1044, 642]];
export const ROAD_FAR = [[1044, 642], [1140, 606], [1180, 566], [1110, 526], [1030, 492], [1006, 452], [1000, 420]];
/**
 * A long road through the hills of Samaria to Jerusalem, far off on its height. Options: village (the Samaritan
 * village the road passes, with a gate that can shut), bank (a roadside bank at the front right with a fox's hole and
 * a small tree with a nest), field (a field on the left with furrows, a farmer's house). Always cut the same.
 * Returns { eve, night, starL, cityGlow, rays, gateL, gateR, update(time, {eveK, nightK}) … }.
 */
export function roadSet(S, { skyCols = ROADDAY, village = true, bank = false, field = false, eve = true } = {}) {
  const c = makeCutter('lk9-road');
  sky(S, skyCols);
  const eveL = eve ? sky(S, ROADEVE, { name: 'eve', rise: 0 }).layer : null;
  const nightL = eve ? sky(S, ROADNIGHT, { name: 'night', rise: 0 }).layer : null;
  if (eveL) { eveL.fade(0); nightL.fade(0); }
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -500, y1: 380, n: 70 }));
  starL.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 380, y: 170, len: 900 });
  const moonEl = hanging(hangL, `<circle r="50" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 24)}`, { x: 0, y: -1500, len: 900 });
  // far off: Jerusalem on its hill, and the light over it
  const far = S.layer({ par: 0.07, sh: 2 });
  const [cx, cy] = ROAD9.CITY;
  const cityGlow = far.add(`<g opacity="0"><circle r="170" fill="url(#halo-glow)"/></g>`);
  const rays = far.add(`<g opacity="0">${rayBursts(c)}</g>`);
  far.add(band(c, { y: 452, amps: [18, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.lavender, 0.25) }).markup);
  far.add(sheet().p(c.cut([[cx - 260, 470], [cx - 140, 432], [cx - 60, cy + 4], [cx + 80, cy], [cx + 170, 430], [cx + 300, 470]], 1, 10), mix(C.hillFar, C.sand, 0.3)).out());
  far.add(`<g transform="translate(${cx} ${cy + 2})">${jerusalem(c, 0.19, { tglow: false })}</g>`);
  // the hills of the middle distance, the far part of the road
  const mid = S.layer({ par: 0.2, sh: 3 });
  const mh = hillsWith(c, { y: 540, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.sand, 0.15), trees: 18, treeColor: C.sage, treeH: 18 });
  mid.add(mh.markup);
  mid.add(sheet().p(c.ribbon(ROAD_FAR, (u) => 26 - u * 20), mix(C.sand, C.cream, 0.35)).out());
  // the near land and the near road
  const G = S.layer({ par: 0.4, sh: 3 });
  const gfn = (x) => 626 + Math.sin(x * 0.006 + 0.8) * 10 + Math.max(0, 400 - x) * 0.08;
  const gs = sheet();
  gs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.3));
  gs.p(c.ribbon(ROAD_NEAR, (u) => 150 - u * 116, 2), mix(C.sand, C.cream, 0.35));
  G.add(gs.out());
  G.add(grass(c, { x0: -800, x1: 2400, y: 640, fn: gfn, n: 40, h: 12, color: C.moss }) + cypress(c, 1400, gfn(1400) + 4, 120) + olive(c, 180, gfn(180) + 14, 0.8));
  const out = { c, starL, eveL, nightL, sunEl, moonEl, cityGlow, rays, far, mid, G, gfn };
  if (field) {
    // the farmer's field on the right below the road, ploughed in strips; his house on the slope behind it
    out.houseAt = [1146, gfn(1146) + 4];
    G.add(`<g>${house(c, 1110, gfn(1110) + 6, 86, 60, { stairs: true })}</g>`);
    out.fieldL = S.layer({ par: 0.45, sh: 3 });
    const fp = [[250, 1700], [300, 1100], [380, 960], [520, 890], [700, 800], [830, 730], [950, 690], [1200, 678], [1800, 674], [1800, 1700]];
    const fs = sheet().p(c.cut(fp, 1, 12), mix(C.soil, C.dune, 0.45));
    let st = '';
    for (let k = 0; k < 14; k++) st += c.ribbon([[860 - k * 40, 730 + k * 30], [1800, 706 + k * 30]], 3);
    fs.x(st, shade(mix(C.soil, C.dune, 0.45), -0.18), 'opacity=".5"');
    out.fieldL.add(fs.out());
  }
  if (village) {
    // the Samaritan village beside the road: a wall with a gate, houses behind it
    const V = S.layer({ par: 0.3, sh: 4 });
    const [gx, gy] = ROAD9.GATE;
    V.add(town(c, { x: gx + 120, y: gy - 58, n: 7, spread: 230, sc: 0.7 }));
    const vw = sheet();
    const gate = [[gx - 30, gy + 2], [gx - 30, gy - 44], ...c.arc(gx, gy - 44, 30, 24, PI, 2 * PI, 10), [gx + 30, gy + 2]];
    vw.p(c.cut([[gx - 60, gy + 4], [gx - 60, gy - 60], [gx + 260, gy - 70], [gx + 260, gy + 4]], 0.6, 10) + c.hole(gate, 0.3, 6), mix(C.stone, C.sand, 0.35));
    vw.p(c.cut([[gx - 44, gy - 60], [gx - 40, gy - 96], [gx + 40, gy - 96], [gx + 44, gy - 60]], 0.4, 6), mix(C.stone2, C.sand, 0.2));
    V.add(`<path d="${c.poly(gate)}" fill="${mix(C.soilDark, C.night, 0.2)}"/>` + vw.out());
    out.villageL = V;
    out.gateL = V.add(`<g>${sheet().p(c.cut(c.rect(0, -64, 30, 64), 0.3, 4), C.wood2).out()}</g>`);
    out.gateR = V.add(`<g>${sheet().p(c.cut(c.rect(-30, -64, 30, 64), 0.3, 4), C.wood2).out()}</g>`);
  }
  if (bank) {
    // a roadside bank at the front right: the fox's hole in it, a small tree above with a nest
    const [dx, dy] = ROAD9.DEN, [nx, ny] = ROAD9.NEST;
    const denL = S.layer({ par: 0.5, sh: 1, flat: true });
    denL.add(`<g><ellipse cx="${dx}" cy="${dy}" rx="40" ry="28" fill="${mix(C.soilDark, C.night, 0.3)}"/></g>`);
    out.denGlow = denL.add(`<g opacity="0"><circle r="54" fill="url(#warm-glow)"/></g>`);
    const B = S.layer({ par: 0.5, sh: 4 });
    const o = dx - 1150;
    const bp = [[980, 1700], [1000, 720], [1060, 670], [1180, 652], [1320, 656], [1500, 690], [1700, 710], [1700, 1700]].map(([x, y]) => [x + o, y]);
    const hole = c.ell(dx, dy - 2, 34, 22, 18);
    B.add(sheet().p(c.cut(bp, 1, 10) + c.hole(hole, 0.4, 5), mix(C.hillNear, C.sand, 0.35)).out() + grass(c, { x0: 950 + o, x1: 1700, y: 660, n: 16, h: 12, color: C.moss, fn: (x) => x < 1060 + o ? 700 - (x - 990 - o) * 0.5 : x < 1320 + o ? 650 : 660 }));
    out.bankL = B;
    const tree = sheet();
    const T0 = nx + 64;
    tree.p(c.ribbon(c.qbez([T0, 650], [T0 - 10, 560], [T0 + 20, 480], 10), (u) => 16 - u * 10), C.wood2);
    tree.p(c.ribbon(c.qbez([T0 + 10, 540], [T0 - 40, 510], [T0 - 70, 470], 8), 6), C.wood2);
    tree.p(c.cut(c.blob(T0 + 20, 450, 70, 46, 14, 0.15), 0.8, 6) + c.cut(c.blob(T0 - 60, 470, 46, 32, 12, 0.15), 0.8, 6), C.olive);
    B.add(tree.out());
    out.nest = B.add(`<g>${sheet().p(c.cut([[-24, 0], [-20, -12], [20, -12], [24, 0], [14, 8], [-14, 8]], 1.2, 4), C.wood3).x(c.ribbon([[-20, -4], [20, -6]], 1.4) + c.ribbon([[-18, 2], [18, 0]], 1.4), C.wood2, 'opacity=".6"').out()}</g>`);
    pose(out.nest, { x: nx, y: ny });
  }
  out.update = (time, { eveK = 0, nightK = 0, sunK = 0, moonK = 0 } = {}) => {
    if (eveL) { eveL.fade(eveK); nightL.fade(nightK); }
    starL.fade(nightK * 0.9);
    swing(sunEl, 380 + sunK * 60, 170 + sunK * 360, time, 1, 0.6);
    pose(moonEl, { x: 1240, y: lerp(-1500, 160, moonK), r: Math.sin(time * 0.5) * 1.2, oy: 0, o: moonK > 0.002 ? 1 : 0 });
  };
  return out;
}
function rayBursts(c) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a = -PI / 2 + (i - 4) * 0.13, w = 0.025, L = 300 + (i % 2) * 60; d += c.poly([[Math.cos(a - w) * 30, Math.sin(a - w) * 30], [Math.cos(a - w * 2) * L, Math.sin(a - w * 2) * L], [Math.cos(a + w * 2) * L, Math.sin(a + w * 2) * L], [Math.cos(a + w) * 30, Math.sin(a + w) * 30]]); }
  return `<path d="${d}" fill="#fff3cf" opacity=".4"/>`;
}
