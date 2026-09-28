// Matthew 8 — the cast and cut-outs of this chapter: the green mountain over the lake with its winding path,
// Capernaum's street with the centurion's red-roofed house, Peter's house, the heavenly table, the fox's den and
// the birds' nest, the storm on the lake, the shore of the Gadarenes with its tombs, pigs and town.
// Parallel drawings are reused from Mark 1 (leper, Peter's house), Mark 4 (storm), Mark 5 (tombs, pigs), Mark 15
// (the centurion and his soldiers). Everything returns SVG markup cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, town, house, sun, moon, cloud, stars, rock, grass, olive, cypress, bush, flowers, palm } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { waveStrip as waveStripM } from '../../assets/nature.js';
import { boat as boatM, stormCloud, lightning as lightningM, rain as rainM, rays as raysM, paperLabel as paperLabelM } from '../../assets/things.js';
import { pose3 } from '../matthew4/lib.js';

export { LEPER, LEPER_HEALED, MIL, SCRIBE, bell, leperSpots, priestPlate, heatWave, tray, crutch, mat, handLamp, shadowShards, POSSESSED, hand, headAt, voiceRings, hang2, sparkle, fox, flame } from '../mark1/lib.js';
export { LOOK as L5, herd, pig, spirit, tomb, slope, boulders, cry, bubble, tag, chain, fetter, dust, staff, shoreSet, glyphTag, thinkBubble, bedFrame, lyingPerson, shadowCloak, scratches } from '../mark5/lib.js';
export { centurion, soldier } from '../mark15/lib.js';
export { LOOK as L12 } from '../mark12/lib.js';
export { ISAIAH } from '../matthew1/lib.js';
export { pose3, folk4, bakeArms, tiltHead, addScroll, setScroll, goldSlip, lightShaft } from '../matthew4/lib.js';
export { hull, capShore, folk, group } from '../john6/lib.js';
export { kf, moving, wordSlip, bowl, loaf, cup, jug } from '../mark2/lib.js';
export { hungWord, rayBurst, glowDisc, radiance, goldWord, sundial } from '../john1/lib.js';
export { hourglass } from '../mark13/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const DAY = ['#c6ddd8', '#eeebd4', '#f7ead0'];
export const MORNING = ['#cfe2dd', '#f1e9cf', '#f8e9cc'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const KINGDOM = ['#f2cd86', '#f8dca6', '#fbeac6'];
export const STORM = ['#2f3653', '#4a5373', '#6b7390'];

/* ================================================================== the cast */
export const SERVANT = { robe: C.linen2, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.rope };
export const HOUSEBOY = { robe: C.sageRobe, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin4, belt: C.rope };
/** "the sons of the kingdom": well-dressed men, sure of their place */
export const SONS = [
  { robe: C.linen, mantle: C.teal2, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.ochre, beard: 'full', skin: C.skin2, belt: C.ochre },
  { robe: C.stone, mantle: shade(C.dustyBlue, -0.2), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin, belt: C.sun },
  { robe: C.wheatRobe, mantle: C.plumRobe, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.ochre },
];
/** the young disciple whose father has died, and the scribe who offers to follow */
export const MOURNER = { robe: mix(C.stone2, C.dustyBlue, 0.3), mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
export const SCRIBE8 = { robe: C.plumRobe, mantle: C.stone2, hairStyle: 'wrap', veil: C.linen, veil2: C.stone2, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin2, belt: C.ochre };
/** the second man from the tombs (the first is Mark 5's) */
const RAGS2 = mix(C.rock2, C.soil, 0.3);
export const WILD2 = { robe: RAGS2, fur: true, hair: C.hair, hairStyle: 'wild', beard: 'short', skin: C.skin4, belt: null };
export const HEALED2 = { robe: C.linen2, mantle: C.dustyBlue, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin4, belt: C.leather };

/* ================================================================== small helpers */
/** swing a hanging thing at (x, y), hidden while it is pulled up into the flies (portrait screens see high up) */
export function hangAt(el, x, y, time, amp = 1.2, speed = 0.7, seed = 0) {
  pose(el, { x, y, r: Math.sin(time * speed + seed) * amp, oy: 0, o: y < -120 ? 0 : 1 });
}
/** a point at u (0..1) along a polyline */
export function along(pts, u) {
  const lens = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) { const k = Math.min(1, d / (lens[i] || 1)); return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), Math.sign(pts[i + 1][0] - pts[i][0])]; }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}
/** a still group of n people as one sprite markup (walking to the right unless flip) */
export function mob(c, n, { s = 0.8, flip = false, spread = 46, rows = 2, pose: P = 'stand', men = null, arms = 30 } = {}) {
  const per = Math.ceil(n / rows);
  return pose3(c, Array.from({ length: n }, (_, i) => {
    const r = Math.floor(i / per), k = i % per;
    const o = crowdPerson(c);
    if (men === true || (men === null && o.hairStyle !== 'veil' && c.chance(0.5))) { if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; } }
    return { x: (k - (per - 1) / 2) * spread + r * spread * 0.5 + c.rr(-8, 8), y: r * 18 + c.rr(-3, 3), s: s * c.rr(0.92, 1.05) * (1 - r * 0.05), flip, head: c.rr(-6, 4), armF: c.rr(0, arms), o: { ...o, pose: P } };
  }));
}

/* ================================================================== the mountain over the lake */
/**
 * The green mountain of the Sermon, on the left, with a path winding down its face to the road in front;
 * the lake and far shore behind, Capernaum small on the right. Layers: sky, hangs, far (lake), mid, the
 * mountain (par MP), the ground and road (par MP). Returns handles and update(time).
 */
export const MP = 0.4;
export const PATH = [[560, 404], [690, 476], [548, 530], [700, 590], [612, 648], [700, 700], [742, 752]];
export function mountSet(S, { skyCols = DAY, sunAt = [1240, 150] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[930, 140, 190], [300, 110, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 400, amps: [14, 6, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup + town(c, { x: 1250, y: fb.fn(1250) + 12, n: 6, spread: 220, sc: 0.4 }));
  far.add(waterBand(c, { y: 428, color: mix(C.lake, C.skyBlue, 0.25), foamN: 22, bottom: 900 }).markup);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const mh = hillsWith(c, { y: 530, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
  mid.add(mh.markup + town(c, { x: 1180, y: mh.fn(1180) + 10, n: 7, spread: 300, sc: 0.55 }));
  // the mountain: a broad green shoulder on the left
  const mountL = S.layer({ par: MP, sh: 4 });
  const mfn = (x) => 680 - 300 * Math.exp(-Math.pow((x - 520) / 330, 2)) + Math.sin(x / 70) * 4 + Math.sin(x / 23) * 1.5;
  const ms = sheet();
  ms.p(c.ridge(mfn, -900, 2500, 1700, 12, 1.2), mix(C.hillNear, C.sage2, 0.35));
  // a lighter flank and some rocks on its face
  ms.p(c.cut([[140, 700], [260, 560], [420, 470], [520, 430], [470, 520], [360, 620], [300, 700]], 1.4, 10), mix(C.hillNear, C.sand, 0.2));
  // the path: a pale ribbon zig-zagging down
  ms.p(c.ribbon(PATH, (u) => 12 + u * 30, 1.2), mix(C.sand, C.cream, 0.35));
  mountL.add(ms.out());
  mountL.add(grass(c, { x0: 60, x1: 1000, y: 600, fn: mfn, n: 34, h: 12, color: C.moss }) + olive(c, 330, 632, 0.7) + olive(c, 880, 646, 0.62) + cypress(c, 980, 650, 110) + rock(c, 470, 560, 60, 22, C.rock2) + rock(c, 790, 560, 44, 18, C.rock) + flowers(c, { x0: 380, x1: 900, y: 600, fn: (x) => Math.max(mfn(x), 480) + 30, n: 14 }));
  // the ground and the road in front
  const G = S.layer({ par: MP, sh: 3 });
  const gfn = c.wave(708, [4, 2], [700, 180]);
  const gs = sheet().p(c.ridge((x) => Math.max(gfn(x), 700 - Math.max(0, 560 - x) * 0.0), -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5));
  gs.p(c.ribbon([[-900, 776], [300, 766], [742, 762], [1200, 760], [2500, 768]], 64, 2), mix(C.sand, C.cream, 0.3));
  G.add(gs.out());
  G.add(grass(c, { x0: -800, x1: 2400, y: 708, fn: gfn, n: 44, h: 13, color: C.moss }) + bush(c, 1260, 720, 90, C.sage, C.moss) + rock(c, 1110, 724, 70, 24, C.rock2) + flowers(c, { x0: 820, x1: 1400, y: 712, fn: gfn, n: 10 }));
  return {
    c, sk, hangL, sunEl, mountL, G, mfn, gfn,
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}
/** scale of a figure standing on the mountain path at height y */
export const pathS = (y) => lerp(0.42, 1.02, Math.max(0, Math.min(1, (y - PATH[0][1]) / (PATH[PATH.length - 1][1] - PATH[0][1]))));

/* ================================================================== Capernaum: the street and the centurion's house */
export const HOUSE = { X0: 960, X1: 1290, TOP: 440, BASE: 652, DOOR: 1210, BEDX: 1070, FEET: 742 };
/** a thought cloud (no words) of w×h; origin at the smallest bubble; the cloud floats up and to the side dir */
export function thoughtCloud(c, w = 200, h = 130, { dir = -1, fill = C.cream } = {}) {
  const cx = dir * (w / 2 - 10), cy = -h / 2 - 40;
  const pts = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2, a2 = ((i + 1) / n) * PI * 2;
    const x1 = cx + Math.cos(a) * w / 2, y1 = cy + Math.sin(a) * h / 2, x2 = cx + Math.cos(a2) * w / 2, y2 = cy + Math.sin(a2) * h / 2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(my - cy, mx - cx);
    pts.push(...c.qbez([x1, y1], [mx + Math.cos(ang) * 16, my + Math.sin(ang) * 16], [x2, y2], 5).slice(0, -1));
  }
  const s = sheet();
  s.p(c.cut(pts, 0.4, 5), fill);
  s.p(c.cut(c.circ(0, 0, 5, 10), 0.2, 3) + c.cut(c.circ(dir * 9, -18, 9, 12), 0.2, 3), fill);
  return { m: s.out(), cx, cy };
}
/** grey jagged lines of pain (origin centre) */
export function painMarks(c, r = 40, col = mix(C.storm, C.stone2, 0.3)) {
  let d = '';
  for (let i = 0; i < 5; i++) {
    const a = -PI * 0.9 + (i / 4) * PI * 0.8, x0 = Math.cos(a) * r * 0.5, y0 = Math.sin(a) * r * 0.5;
    const pts = [];
    for (let k = 0; k < 5; k++) { const f = k / 4; pts.push([x0 + Math.cos(a) * r * f * 0.8 + (k % 2 ? 1 : -1) * 4, y0 + Math.sin(a) * r * f * 0.8 + (k % 2 ? -1 : 1) * 3]); }
    d += c.ribbon(pts, 2.6);
  }
  return `<path d="${d}" fill="${col}"/>`;
}
/**
 * The centurion's house, in pieces: the room inside (back wall, lamp niche, bed), the front wall that can be
 * lifted away like a flat to show the room (origin world), and the red-tiled Roman roof.
 */
export function centurionHouse(c) {
  const { X0, X1, TOP, BASE, DOOR, BEDX } = HOUSE;
  const room = sheet();
  room.p(c.cut(c.rect(X0 + 6, TOP, X1 - X0 - 12, BASE - TOP), 0.5, 10), shade(C.plaster2, -0.12));
  room.p(c.cut(c.rect(X0 + 6, BASE - 26, X1 - X0 - 12, 26), 0.4, 8), shade(C.sand2, -0.1));
  room.p(c.cut([[X0 + 40, TOP + 60], [X0 + 40, TOP + 30], ...c.arc(X0 + 60, TOP + 30, 20, 16, PI, 2 * PI, 8), [X0 + 80, TOP + 60]], 0.3, 5), shade(C.plaster2, -0.3));
  room.p(c.cut(c.rect(X1 - 70, TOP + 40, 40, 70), 0.3, 5), C.lake2);
  const inside = room.out() + `<g transform="translate(${BEDX} ${BASE})">${bedCut(c, 210)}</g>`;
  const f = sheet();
  const door = [[DOOR - 30, BASE], [DOOR - 30, BASE - 96], ...c.arc(DOOR, BASE - 96, 30, 28, PI, 2 * PI, 10), [DOOR + 30, BASE]];
  const win = [[X0 + 90, TOP + 120], [X0 + 90, TOP + 76], ...c.arc(X0 + 114, TOP + 76, 24, 20, PI, 2 * PI, 8), [X0 + 138, TOP + 120]];
  f.p(c.cut(c.rect(X0, TOP, X1 - X0, BASE - TOP + 4), 0.5, 10) + c.hole(door, 0.3, 6) + c.hole(win, 0.3, 5), C.plaster);
  f.p(c.cut(c.rect(X0 - 6, BASE - 16, X1 - X0 + 12, 20), 0.4, 8), C.stone2);
  // two pilasters and a lintel round the door, a red band under the eaves
  f.p(c.cut(c.rect(DOOR - 46, BASE - 150, 12, 150), 0.3, 6) + c.cut(c.rect(DOOR + 34, BASE - 150, 12, 150), 0.3, 6) + c.cut(c.rect(DOOR - 52, BASE - 160, 104, 12), 0.3, 6), C.stone);
  f.p(c.ribbon([[X0, TOP + 14], [X1, TOP + 14]], 10), C.terracotta);
  f.x(c.ribbon([[X0 + 92, TOP + 120], [X0 + 136, TOP + 120]], 4), C.wood2);
  // a shield with the eagle by the door: a soldier lives here
  f.p(c.cut(c.ell(DOOR - 110, BASE - 110, 22, 30, 16), 0.3, 4), C.curtain2);
  f.x(c.poly(c.star(DOOR - 110, BASE - 110, 10, 4, 4, 0)), C.sun);
  const roof = sheet();
  roof.p(c.cut([[X0 - 24, TOP + 4], [X0 + 30, TOP - 56], [X1 - 30, TOP - 56], [X1 + 24, TOP + 4]], 0.5, 8), C.terracotta);
  let tiles = '';
  for (let x = X0 + 10; x < X1 - 10; x += 22) tiles += c.ribbon([[x + 14, TOP - 54], [x - 8, TOP + 2]], 3);
  roof.x(tiles, shade(C.terracotta, -0.2), 'opacity=".55"');
  roof.p(c.ribbon([[X0 - 24, TOP + 4], [X1 + 24, TOP + 4]], 6), shade(C.terracotta, -0.15));
  return { inside, front: f.out(), roof: roof.out() };
}
/** a plain bed (origin: floor centre; the mattress top is at y -46) */
export function bedCut(c, w = 210) {
  return sheet()
    .p(c.cut([[-w / 2, -34], [w / 2, -34], [w / 2, -24], [-w / 2, -24]], 0.4, 8), C.wood)
    .p(c.cut([[-w / 2 + 6, -24], [-w / 2 + 14, -24], [-w / 2 + 12, 0], [-w / 2 + 8, 0]], 0.3, 6) + c.cut([[w / 2 - 14, -24], [w / 2 - 6, -24], [w / 2 - 8, 0], [w / 2 - 12, 0]], 0.3, 6), C.wood2)
    .p(c.cut([[-w / 2 - 4, -46], [w / 2 + 2, -46], [w / 2 - 4, -34], [-w / 2, -34]], 0.6, 8), C.linen2)
    .p(c.cut(c.blob(-w / 2 + 26, -52, 26, 10, 10, 0.1), 0.4, 5), C.skyVeil).out();
}
/**
 * A street in Capernaum: sky, sun and clouds on strings, the far shore and the lake, hills, a row of
 * flat-roofed houses, the centurion's house on the right (its front wall lifts away, see centurionHouse),
 * and the street. Call addFront() after adding what lives inside the house. Returns handles.
 */
export function capStreet(S, { skyCols = DAY, sunAt = [700, 120] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[860, 130, 180], [1320, 170, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 400, amps: [14, 6, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup + waterBand(c, { y: 432, color: mix(C.lake, C.skyBlue, 0.2), foamN: 16, bottom: 900 }).markup);
  const hl = S.layer({ par: 0.16, sh: 3 });
  const hw = hillsWith(c, { y: 500, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
  hl.add(hw.markup);
  // a row of houses along the back of the street
  const row = S.layer({ par: 0.3, sh: 4 });
  const base = 624;
  let hs = '';
  [[-640, 150, 110], [-420, 130, 96], [-230, 160, 124], [-10, 130, 100], [180, 150, 118], [390, 140, 96], [600, 170, 128], [1420, 150, 112], [1620, 140, 100], [1820, 160, 120]].forEach(([x, w, h], i) => {
    hs += house(c, x, base + (i % 2) * 4, w, h, { wall: i % 3 === 1 ? C.plaster2 : C.plaster, shadow: shade(C.plaster2, -0.06), stairs: i % 2 === 0 });
  });
  row.add(hs + palm(c, 330, base + 4, 170) + olive(c, 860, base + 6, 0.7) + palm(c, 1560, base + 4, 150));
  // the centurion's house
  const houseL = S.layer({ par: 0.36, sh: 4 });
  const H = centurionHouse(c);
  houseL.add(`<g>${H.inside}</g>`);
  // the street
  const G = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(650, [3, 1.5], [700, 180]);
  const gs = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand);
  let stones = '';
  for (let k = 0; k < 70; k++) { const px = c.rr(-600, 2200), py = c.rr(680, 980); stones += c.cut(c.blob(px, py, c.rr(8, 18), c.rr(4, 8), 8, 0.2), 0.4, 4); }
  gs.x(stones, C.sand2, 'opacity=".7"');
  G.add(gs.out());
  G.add(grass(c, { x0: -600, x1: 900, y: 652, fn: gfn, n: 16, h: 12, color: C.olive }));
  return {
    c, sk, hangL, sunEl, houseL, G, gfn,
    /** add the front wall and the roof (after the people inside); returns { front, roof, glow } */
    addFront() {
      const glow = houseL.add(`<g opacity="0"><path d="${c.poly([[HOUSE.X0 - 40, HOUSE.TOP + 12], [HOUSE.X0 + 24, HOUSE.TOP - 76], [HOUSE.X1 - 24, HOUSE.TOP - 76], [HOUSE.X1 + 40, HOUSE.TOP + 12]])}" fill="${C.halo}" opacity=".7"/></g>`);
      const front = houseL.add(`<g>${H.front}</g>`);
      const roof = houseL.add(`<g>${H.roof}</g>`);
      return { front, roof, glow };
    },
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}

/* ================================================================== the storm on the lake */
/** tall, peaked storm waves with curling foam caps; one period = len (as in Mark 4) */
export function stormWaves(c, { y, len = 220, amp = 70, x0 = -1400, x1 = 3000, color, cap = C.foam }) {
  const s = sheet();
  const pts = [[x0, y + 400]];
  let caps = '';
  for (let x = x0; x <= x1; x += len) {
    const h = amp * c.rr(0.8, 1.15);
    pts.push([x, y], [x + len * 0.35, y - h * 0.55], [x + len * 0.52, y - h], [x + len * 0.6, y - h * 0.82], [x + len * 0.72, y - h * 0.35], [x + len, y]);
    caps += c.ribbon([[x + len * 0.3, y - h * 0.46], [x + len * 0.42, y - h * 0.8], [x + len * 0.52, y - h + 2], [x + len * 0.6, y - h * 0.84], [x + len * 0.64, y - h * 0.62], [x + len * 0.6, y - h * 0.5]], (u) => 2 + Math.sin(u * PI) * 7);
  }
  pts.push([x1 + len, y + 400], [x1 + len, 1900], [x0, 1900]);
  s.p(c.cut(pts, 1.2, 14), color);
  s.x(caps, cap, 'opacity=".85"');
  return s.out();
}
const stormCloudM = (c, w, i) => stormCloud(c, w, i % 2 ? '#7a82a2' : '#687092', i % 2 ? '#5f6789' : '#555d7e');
function bucket(c) {
  return sheet().p(c.cut([[-11, -2], [11, -2], [8, 18], [-8, 18]], 0.3, 4), C.wood3).x(c.ribbon(c.arc(0, -2, 11, 9, PI, 2 * PI, 8), 1.4), C.wood2).out();
}
/**
 * The lake in a storm, as whole sheets that slide and fade on the compositor (after Mark 4): a day sky, a storm sky
 * and a washed-clean sky; storm clouds on strings; lightning; calm and storm waves behind and in front of the boat;
 * rain; darkness; a flash. The boat is in pieces (back hull, the people, the water inside, front hull) so each person
 * is their own cut-out; place(p, lx, ly, …) puts a puppet at boat coordinates.
 * update(t, T, { storm, clear, travel, fill }) runs the weather and returns the boat's pose.
 */
export function stormSet(S, { shoreAt = 0 } = {}) {
  const c = S.c;
  sky(S, ['#c4dad6', '#eee8cf', '#f6e6c6'], { name: 'day' });
  const stormSky = sky(S, STORM, { name: 'storm' }).layer;
  const clearSky = sky(S, ['#b7d6da', '#e8eee0', '#f8f0d8'], { name: 'clear' }).layer;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: 1220, y: 160, len: 900 });
  const cloudL = S.layer({ par: 0.08, sh: 7 });
  const clouds = [[250, 90, 520], [700, 40, 620], [1150, 110, 560], [1550, 60, 520], [-150, 70, 480], [950, 190, 380]].map(([x, y, w], i) => ({ el: hanging(cloudL, stormCloudM(c, w, i), { x, y, len: 1200 }), x, y, i }));
  const boltEl = cloudL.add(`<g>${lightningM(c, 330)}</g>`);
  const far = S.layer({ par: 0.12, sh: 2 });
  far.add(band(c, { y: 440, amps: [14, 7, 3], lens: [1100, 380, 140], color: mix(C.hillFar, C.duskViolet, 0.2), x0: -1400, x1: 3000 }).markup);
  const water = S.layer({ par: 0.34, sh: 2 });
  water.add(band(c, { y: 505, amps: [3, 1.5], lens: [300, 90], color: C.lake2, x0: -1400, x1: 3200, step: 10, j: 0.6 }).markup);
  // the shore they leave, on the left
  const shoreL = S.layer({ par: 0.3, sh: 3 });
  const sfn = (x) => 520 + Math.max(0, x - 260) * 0.5;
  const shorePts = [];
  for (let x = -1400; x <= 480; x += 14) shorePts.push([x, Math.min(640, sfn(x)) + c.rr(-1.5, 1.5)]);
  shorePts.push([480, 1900], [-1400, 1900]);
  shoreL.add(sheet().p(c.poly(shorePts), C.sand).out() + palm(c, 60, 522, 190) + palm(c, -180, 520, 170) + town(c, { x: -60, y: 530, n: 5, spread: 260, sc: 0.5 }));
  const tintBack = S.layer({ par: 0.35, sh: 1, flat: true });
  tintBack.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2250"/>`);
  const wBackCalm = S.layer({ par: 0.5, sh: 3, pad: 200 });
  wBackCalm.add(waveStripM(c, { y: 640, len: 170, amp: 10, color: C.lake3 }));
  const wBackStorm = S.layer({ par: 0.5, sh: 5, pad: 260 });
  wBackStorm.add(stormWaves(c, { y: 660, len: 240, amp: 90, color: C.waveStorm }));

  /* the boat, in pieces */
  const boatL = S.layer({ par: 0.6, sh: 5 });
  const burst = boatL.add(`<g opacity="0">${raysM(c, { n: 18, r0: 40, r1: 620, spread: 0.05, color: '#fff3cf' })}<circle r="150" fill="url(#halo-glow)"/></g>`);
  const B = boatM(c, { cushion: true, mast: true });
  const back = boatL.add(`<g>${B.back}</g>`);
  const P = {
    lie: S.puppet(boatL.add(person(c, { ...CAST.jesus, eyes: 'closed' }))),
    sit: S.puppet(boatL.add(person(c, { ...CAST.jesus, pose: 'sit' }))),
    stand: S.puppet(boatL.add(person(c, { ...CAST.jesus }))),
  };
  const DIS = [
    { k: 'john', x: -38, cast: CAST.john },
    { k: 'james', x: 25, cast: CAST.james, bail: true },
    { k: 'peter', x: 78, cast: CAST.peter },
    { k: 'andrew', x: 128, cast: CAST.andrew, bail: true },
  ].map((d, i) => ({ ...d, i, seed: c.rr(0, 6), p: S.puppet(boatL.add(person(c, { ...d.cast, holdF: d.bail ? `<g transform="translate(0 4)">${bucket(c)}</g>` : '' }))) }));
  const waterIn = boatL.add(`<g>${sheet().p(c.cut([[-165, -8], ...Array.from({ length: 12 }, (_, i) => [-160 + i * 29, -14 + Math.sin(i * 1.3) * 4]), [172, -8], [150, 6], [-150, 6]], 0.6, 8), C.waveStorm).x(c.ribbon(Array.from({ length: 13 }, (_, i) => [-170 + i * 29, -15 + Math.sin(i * 1.3) * 4]), 3), C.foam, 'opacity=".8"').out()}</g>`);
  const front = boatL.add(`<g>${B.front}</g>`);
  const zs = ['z', 'z', 'Z'].map((z, i) => boatL.add(`<g opacity="0">${paperLabelM(z, { size: 18 + i * 5 })}</g>`));
  const spray = Array.from({ length: 6 }, (_, i) => boatL.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, c.rr(10, 18), c.rr(6, 10), 9, 0.3), 0.6, 3)}" fill="${C.foam}"/></g>`));

  const wFrontCalm = S.layer({ par: 0.75, sh: 4, pad: 200 });
  wFrontCalm.add(waveStripM(c, { y: 770, len: 160, amp: 11, color: C.lake2 }));
  const wFrontStorm = S.layer({ par: 0.8, sh: 6, pad: 300 });
  wFrontStorm.add(stormWaves(c, { y: 790, len: 280, amp: 120, color: C.waveStorm2 }));
  const wFrontStorm2 = S.layer({ par: 0.95, sh: 7, pad: 320 });
  wFrontStorm2.add(stormWaves(c, { y: 910, len: 320, amp: 130, color: shade(C.waveStorm2, -0.15) }));
  const rainL = S.layer({ par: 0.9, sh: 1, flat: true, pad: 420 });
  rainL.add(rainM(c, { x0: -1400, x1: 3000, y0: -900, y1: 1500, n: 420, slant: -46 }));
  const tintFront = S.layer({ par: 0, sh: 1, flat: true });
  tintFront.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);
  const flashL = S.layer({ par: 0, sh: 1, flat: true });
  flashL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#f4f1ff"/>`);

  const BS = 1.15, BY = 700;
  let pose0 = { bx: 800, by: BY, br: 0, bs: BS };
  return {
    c, P, DIS, zs, burst, boatL,
    /** put a puppet at boat coordinates (lx, ly) */
    place(p, lx, ly, o = {}) {
      const { bx, by, br, bs } = pose0;
      const r = (br * PI) / 180, cs = Math.cos(r), sn = Math.sin(r);
      p.set({ ...o, x: bx + bs * (lx * cs - ly * sn), y: by + bs * (lx * sn + ly * cs), s: bs * (o.s ?? 1), r: br + (o.r ?? 0) });
    },
    at(lx, ly) { const { bx, by, br, bs } = pose0; const r = (br * PI) / 180; return [bx + bs * (lx * Math.cos(r) - ly * Math.sin(r)), by + bs * (lx * Math.sin(r) + ly * Math.cos(r))]; },
    update(t, T, { storm = 0, clear = 0, travel = 0, fill = 0, flash = 0 } = {}) {
      stormSky.fade(storm);
      clearSky.fade(clear * (1 - storm));
      tintBack.fade(Math.min(0.62, 0.05 + storm * 0.45));
      tintFront.fade(storm * 0.26);
      const flicker = T ? Math.pow(Math.max(0, Math.sin(T * 1.9) * Math.sin(T * 0.7)), 30) : 0;
      const fl = Math.max(flash, flicker * storm * 0.8);
      flashL.fade(fl * 0.5);
      pose(boltEl, { x: 620 + (Math.round(t * 3) % 3) * 180, y: 140, o: fl > 0.25 ? 1 : 0 });
      pose(sunEl, { x: 1220, y: 160 + storm * 700, r: T ? Math.sin(T * 0.6) : 0, o: storm > 0.9 ? 0 : 1 });
      clouds.forEach((cl) => { const y = cl.y - (1 - storm) * 900 + cl.i * 5; pose(cl.el, { x: cl.x + (T ? Math.sin(T * 0.3 + cl.i) * 30 * storm : 0), y, r: T ? Math.sin(T * 0.9 + cl.i) * (2.5 * storm + 0.3) : 0, o: y < -200 ? 0 : 1 }); });
      shoreL.shift(-travel * 0.3, 0);
      const rise = storm;
      wBackCalm.shift(T ? ((T * 20) % 170) - 85 : 0, rise * 60);
      wBackStorm.shift(T ? ((T * 90 * (0.3 + storm)) % 240) - 120 : 0, (1 - rise) * 260 - (T ? Math.sin(T * 1.5) * 12 * rise : 0));
      wFrontCalm.shift(T ? 85 - ((T * 16) % 160) : 0, rise * 80);
      wFrontStorm.shift(T ? 140 - ((T * 120 * (0.3 + storm)) % 280) : 0, (1 - rise) * 320 - (T ? Math.sin(T * 1.8 + 1) * 18 * rise : 0));
      wFrontStorm2.shift(T ? ((T * 150 * (0.3 + storm)) % 320) - 160 : 0, (1 - Math.min(1, storm * 1.4)) * 360 - (T ? Math.sin(T * 2.1) * 20 * rise : 0));
      const wv = Math.min(1, rise * 4);
      wBackStorm.fade(wv); wFrontStorm.fade(wv); wFrontStorm2.fade(wv);
      rainL.shift(T ? -((T * 260) % 400) * 0.8 + 200 : 0, T ? ((T * 900) % 400) - 200 : 0);
      rainL.fade(Math.max(0, storm * 1.3 - 0.3));
      // the boat
      const bx = 650 + travel * 150, by = BY;
      const rock_ = T ? storm * (Math.sin(T * 1.7) * 7 + Math.sin(T * 0.9) * 4) + (1 - storm) * Math.sin(T * 1.1) * 0.8 : storm * 5;
      const heave = T ? storm * Math.sin(T * 1.3) * 16 + Math.sin(T * 1.4) * 2 : 0;
      pose0 = { bx, by: by + heave, br: rock_ + storm * 3, bs: BS };
      const tf = { x: bx, y: by + heave, s: BS, r: pose0.br };
      pose(back, tf); pose(front, tf);
      const [wx, wy] = this.at(0, 30 - fill * 62 + (T ? Math.sin(T * 3) * 2 * storm : 0));
      pose(waterIn, { x: wx, y: wy, s: BS, r: pose0.br, o: fill > 0.02 ? 1 : 0 });
      spray.forEach((sp, i) => {
        const k = T ? ((T * 0.8 + i / 6) % 1) : 0.5;
        const [sx, sy] = this.at(-160 + i * 64, -60);
        pose(sp, { x: sx + k * 40, y: sy - Math.sin(k * PI) * 90, s: 0.6 + k, o: storm > 0.3 ? fill * (1 - k) * 0.9 : 0 });
      });
      return pose0;
    },
  };
}
