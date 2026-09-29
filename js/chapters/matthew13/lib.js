// Matthew 13 — the parables by the sea. The cast and cut-outs of this chapter:
// the Capernaum shore with Jesus seated in the boat and the crowd on the beach (Mark 4's lake), the sower's field
// cut open at the front so we see under the soil (Mark 4's field, sprouts, thorns, wheat, birds), listeners whose
// hearts open like little windows onto a soil (Mark 4's explanation), the householder's farm with wheat and darnel,
// the barn and the reapers, the mustard garden, the kneading trough, the treasure field, the pearl merchant's stall,
// the dragnet and its fish, the storeroom of new and old things, and the synagogue of Nazareth.
// Everything returns SVG markup cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, town, house, palm, olive, cypress, bush, reeds, rock, grass, flowers, sun, moon, cloud, stars } from '../../assets/nature.js';
import { boat, bird, sprout, wheatStalk, thornBush, seedPath, paperLabel, rays, sheaf, sickle, fish } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { pose3 } from '../matthew4/lib.js';
import { folk } from '../john6/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, wordSlip, scrollOpen, coin, coinStack, bowl, loaf, jug } from '../mark2/lib.js';
export { voiceRings, sparkle, flame } from '../mark1/lib.js';
export { stoneHeart, question } from '../mark3/lib.js';
export { angel, doughBowl, bubbleDot, basket, shadowPerson, globe, soulLight } from '../mark8/lib.js';
export { firePit, paperEye } from '../mark9/lib.js';
export { radiance, rayBurst, glowDisc, hungWord, goldWord, MOSES } from '../john1/lib.js';
export { TEMPTER, tempterAura, ANGEL, pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { ISAIAH, ABRAHAM, DAVID } from '../matthew1/lib.js';
export { pearl, pouch } from '../matthew7/lib.js';
export { group, folk } from '../john6/lib.js';
export { prophetCameo } from '../matthew5/lib.js';
export { plate, roundel, hourglass, tint } from '../mark13/lib.js';
export { LOOK as L6, man, woman, carpenterPlate, disc, labelTag, storyFrame, sabbathTag } from '../mark6/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const MORNING = ['#cadfdb', '#eee5cc', '#f7ead3'];
export const DAY = ['#d8e6df', '#f4ead2', '#f9efdc'];
export const NOON = ['#f0cf9f', '#f7dcb0', '#f9e9cc'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const HARVEST = ['#e7c9a2', '#f2d7a6', '#f8e5c0'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const KINGDOM = ['#f2cd86', '#f8dca6', '#fbeac6'];
export const SEPIA = ['#cdb892', '#e3d2ad', '#efe2c4'];

/* ================================================================== the cast */
/** the sower of Mark 4 (the same man sows in Matthew) */
export const SOWER = { robe: C.ochreRobe, mantle: null, belt: C.leather, hairStyle: 'wrap', veil: C.linen2, hair: C.hair2, beard: 'short', skin: C.skin2 };
/** the householder of the parable of the weeds, and his servants */
export const MASTER = { robe: C.wheatRobe, mantle: C.tealRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.tealRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.ochre };
export const SERVANTS = [
  { robe: C.linen2, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope },
  { robe: C.sageRobe, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin4, belt: C.rope },
  { robe: C.dustyBlue, mantle: null, hair: C.hair, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin2, belt: C.leather },
];
/** the enemy who sows at night: a hooded man in the dusk colours of the tempter (Mt 4) */
export const ENEMY = { robe: '#3d3650', mantle: '#2b2640', hairStyle: 'wrap', veil: '#2b2640', veil2: '#211c33', hair: '#211c33', beard: 'short', beardColor: '#211c33', skin: '#a99a92', belt: null };
/** the reapers */
export const REAPERS = [
  { robe: C.linen2, mantle: null, hair: C.hair2, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin3, belt: C.rope },
  { robe: C.clayMantle, mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.leather },
  { robe: C.wheatRobe, mantle: null, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.rope },
];
/** the man who finds the treasure, the pearl merchant, the woman with the leaven, the fishermen */
export const DIGGER = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope };
export const MERCHANT = { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.terracotta, beard: 'full', skin: C.skin2, belt: C.sun, mantleArm: true };
export const BAKER = { robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.linen2, veil2: shade(C.linen2, -0.1), beard: 'none', skin: C.skin, hair: C.hair2, belt: C.ochre };
export const FISHERS = [
  { robe: C.dustyBlue, mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope },
  { robe: C.ochreRobe, mantle: null, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin4, belt: C.leather },
  { robe: C.tealRobe, mantle: null, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.rope },
];
/** the listeners of the explanation (the same four as in Mark 4) */
export const LISTEN = {
  path: { robe: C.dustyBlue, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather },
  rock: { robe: C.roseRobe, hair: C.hair2, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin },
  thorn: { robe: C.plumRobe, mantle: C.ochreRobe, hairStyle: 'wrap', veil: C.stone, beard: 'full', hair: C.hair, skin: C.skin2, belt: C.sun },
  good: { robe: C.tealRobe, hair: C.hair, hairStyle: 'veil', veil: C.linen2, skin: C.skin4 },
};
export const DIS = ['peter', 'andrew', 'james', 'john', 'matthew', 'thomas'];

/* ================================================================== small helpers */
/** eased keyframe track through [[t, v], …] */
export function track(t, keys, fn) {
  const io = fn || ((x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2));
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i];
      const u = io((t - a) / (b - a));
      return va + (vb - va) * u;
    }
  }
  return keys[keys.length - 1][1];
}
/** a point on a thrown arc */
export function arcAt(p, [x0, y0], [x1, y1], h) {
  return [lerp(x0, x1, p), lerp(y0, y1, p) - Math.sin(p * PI) * h];
}
/** swing a hanging thing, hidden while it is pulled up into the flies */
export function hangAt(el, x, y, time, amp = 1.2, speed = 0.7, seed = 0) {
  pose(el, { x, y, r: Math.sin(time * speed + seed) * amp, oy: 0, o: y < -150 ? 0 : 1 });
}
/** a man / woman of the crowd (men are never veiled) */
export function manOf(c, extra = {}) { const o = crowdPerson(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }
export function womanOf(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }
/**
 * a still group of people as one piece of markup (feet at y 0 around x 0), for L.sprite(): n people in `rows`,
 * facing right unless flip; arms and heads baked in.
 */
export function throng(seed, n, { s = 0.5, spread = 30, rows = 1, flip = false, P = 'stand', arms = [0, 30], armB = [0, 10], head = [-6, 4], dy = 12, eyes = 'open', mix: mx = null } = {}) {
  const c = makeCutter(seed);
  const per = Math.ceil(n / rows);
  const mem = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), k = i % per;
    const o = folk(c, null, { pose: P, eyes });
    if (mx) Object.keys(mx).forEach((key) => { if (o[key]) o[key] = mix(o[key], mx[key][0], mx[key][1]); });
    mem.push({ x: (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + c.rr(-5, 5), y: r * dy + c.rr(-2, 2), s: s * c.rr(0.93, 1.06), flip, head: c.rr(head[0], head[1]), armF: c.rr(arms[0], arms[1]), armB: c.rr(armB[0], armB[1]), o });
  }
  return pose3(c, mem);
}

/* ================================================================== the shore of the lake */
/**
 * Mark 4's lake: the far shore, the hills with their towns, the sandy beach where the crowd stands, the water,
 * a layer for the boat (boatL), rolling waves in front (sliding on the compositor) and reeds and rocks at the front.
 * Returns handles and update(time).
 */
export const BEACH = 506, WATER = 560;
export function shoreSet(S, { skyCols = MORNING, sky2 = null, sunAt = [1190, 170], moonAt = null, starsN = 0, house: withHouse = false, haze = false } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  let sk2 = null, starL = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2' }); sk2.layer.fade(0); }
  if (starsN) { starL = S.layer({ par: 0.02, sh: 1, flat: true }); starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 360, n: starsN })); starL.fade(0); }
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 50), { x: sunAt[0], y: sunAt[1], len: 700 });
  const moonEl = moonAt ? hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 32)}`, { x: moonAt[0], y: moonAt[1], len: 700 }) : null;
  const cls = [[520, 150, 210], [960, 240, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 600 + i * 100 }) }));
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 395, amps: [18, 8, 3], lens: [1100, 420, 150], color: C.hillFar }).markup);
  const hills = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 440, amps: [22, 9, 3], lens: [900, 300, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 24 });
  hills.add(h2.markup);
  hills.add(town(c, { x: 330, y: h2.fn(330) + 10, n: 8, spread: 300, sc: 0.55 }) + town(c, { x: 1330, y: h2.fn(1330) + 12, n: 5, spread: 200, sc: 0.5 }));
  const beach = S.layer({ par: 0.3, sh: 3 });
  const bfn = c.wave(BEACH, [5, 2], [700, 160]);
  beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
  beach.add(olive(c, 120, 506, 0.9) + olive(c, 1500, 508, 0.8) + palm(c, 250, 510, 200) + palm(c, 1390, 512, 170));
  beach.add(rock(c, 560, 520, 50, 20) + rock(c, 1080, 522, 40, 16, C.rock2) + grass(c, { x0: -400, x1: 2000, y: 505, fn: bfn, n: 40, h: 12, color: C.olive }));
  // Peter's house at the edge of the beach (Mt 13,1: "Jesus went out of the house")
  let houseDoor = null;
  if (withHouse) {
    const hx = 330, hy = 512;
    beach.add(house(c, hx, hy, 150, 108, { stairs: false }) + bush(c, hx - 100, hy + 4, 60, C.sage, C.moss));
    houseDoor = [hx + 43, hy];
  }
  const crowdL = S.layer({ par: 0.34, sh: 3 });
  const hazeL = haze ? S.layer({ par: 0.36, sh: 1, flat: true, blur: 10 }) : null;
  const lake = S.layer({ par: 0.42, sh: 2 });
  lake.add(waterBand(c, { y: WATER, color: C.lake, foamN: 30 }).markup);
  lake.add(reeds(c, 90, 572, 10, 70) + reeds(c, 1540, 574, 8, 60));
  const boatL = S.layer({ par: 0.6, sh: 5 });
  const w1 = S.layer({ par: 0.72, sh: 4, pad: 160 });
  w1.add(waveStrip(c, { y: 770, len: 150, amp: 11, color: C.lake2 }));
  const w2 = S.layer({ par: 0.8, sh: 4, pad: 200 });
  w2.add(waveStrip(c, { y: 845, len: 190, amp: 14, color: C.lake3 }));
  const fg = S.layer({ par: 1, sh: 6 });
  fg.add(reeds(c, 200, 930, 14, 230, C.moss) + reeds(c, 1420, 940, 12, 200, C.moss) + rock(c, 1330, 950, 200, 80, C.rock2) + rock(c, 260, 955, 150, 60, C.rock));
  return {
    c, sk, sk2, starL, hangL, sunEl, moonEl, cls, beach, bfn, crowdL, hazeL, lake, boatL, w1, w2, fg, houseDoor,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], moonY = moonAt ? moonAt[1] : 0 } = {}) {
      swing(sunEl, sunX, sunY, time, 1.2, 0.7);
      if (moonEl) swing(moonEl, moonAt[0], moonY, time, 1, 0.6, 2);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i * 2) * 30, cl.y, time, 1.5, 0.6 + cl.i * 0.2, cl.i + 1));
      w1.shift((time * 22) % 150 - 75);
      w2.shift(95 - ((time * 16) % 190));
    },
  };
}
/**
 * the crowd on the beach as sprites: rows [{y, s, n, x0, x1}] cut into groups of `per`; each group faces the boat.
 * Returns [{sp, x, y, s, side, i, d}] — move a group with sp.set({x, y, o}).
 */
export function beachCrowd(S, L, rows, { per = 4, seed = 'mt13-crowd', gap = 70, arms = [0, 30], head = [-6, 4], eyes = 'open' } = {}) {
  const out = [];
  rows.forEach((row, ri) => {
    const span = row.x1 - row.x0;
    const ng = Math.max(1, Math.round(row.n / per));
    for (let g = 0; g < ng; g++) {
      const x = row.x0 + (span * (g + 0.5)) / ng;
      if (Math.abs(x - 800) < gap && ri > 0) continue;
      const flip = x > 800;
      const m = throng(`${seed}-${ri}-${g}`, per, { s: 1, spread: 34, flip, arms, head, eyes });
      const sp = L.sprite(`<g transform="scale(${row.s})">${m}</g>`, x, row.y);
      out.push({ sp, x, y: row.y, s: row.s, side: flip ? 1 : -1, i: out.length, ri, d: ((g * 37 + ri * 13) % 17) / 17 });
    }
  });
  return out;
}
/**
 * the boat of Mark 4, split so people can sit inside: back of the hull, whatever fill() adds, then the front.
 * Returns { back, front, inside } (origin: hull centre).
 */
export function boatIn(L, c, fill = () => null, { cushion = false } = {}) {
  const b = boat(c, { cushion });
  const back = L.add(`<g>${b.back}</g>`);
  const inside = fill();
  const front = L.add(`<g>${b.front}</g>`);
  return { back, front, inside };
}
/** place a boat (both halves) */
export function placeBoat(B, x, y, s, r = 0) {
  pose(B.back, { x, y, s, r });
  pose(B.front, { x, y, s, r });
}

/* ================================================================== the sower's field (Mark 4) */
/** a seedling that can wilt (paper theatre: swap to the dry cut-out) */
export function sproutRig(c, h, green = C.leaf, dry = C.wood3) {
  const L = h / 30;
  const fresh = sheet()
    .p(c.ribbon(c.qbez([0, 0], [2, -h * 0.5], [0, -h], 8), (u) => 3.6 - u * 1.4), green)
    .p(c.cut([[0, -h + 6 * L], [-9 * L, -h - 2 * L], [-19 * L, -h - 1 * L], [-10 * L, -h + 5 * L]], 0.3, 4) + c.cut([[0, -h + 3 * L], [9 * L, -h - 6 * L], [20 * L, -h - 5 * L], [11 * L, -h + 2 * L]], 0.3, 4), green).out();
  const tip = [h * 0.45, -h * 0.42];
  const wilt = sheet()
    .p(c.ribbon(c.qbez([0, 0], [4, -h * 0.8], tip, 10), (u) => 3.4 - u * 1.6), dry)
    .p(c.cut([tip, [tip[0] - 4 * L, tip[1] + 10 * L], [tip[0] - 2 * L, tip[1] + 18 * L], [tip[0] + 2 * L, tip[1] + 8 * L]], 0.3, 4)
      + c.cut([tip, [tip[0] + 8 * L, tip[1] + 6 * L], [tip[0] + 10 * L, tip[1] + 15 * L], [tip[0] + 4 * L, tip[1] + 6 * L]], 0.3, 4), shade(dry, -0.1)).out();
  return `<g><g class="fresh">${fresh}</g><g class="wilt" opacity="0">${wilt}</g></g>`;
}
/** the WORD: a tiny scroll with two ink lines and a warm glow (Mark 4) */
export function wordSeed(c, { glow = 26 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-7, -5, 14, 10), 0.3, 3), C.parchment);
  s.p(c.cut(c.ell(-7.5, 0, 2.8, 5.8, 10), 0.2, 2) + c.cut(c.ell(7.5, 0, 2.8, 5.8, 10), 0.2, 2), C.haloRim);
  s.x(c.ribbon([[-4, -2], [4, -2.3]], 1.1) + c.ribbon([[-4, 1.4], [2.5, 1.2]], 1.1), C.inkSoft, 'opacity=".75"');
  return `<g class="wseed">${glow ? `<circle class="glow" r="${glow}" fill="url(#warm-glow)"/>` : ''}<g class="tok">${s.out()}</g></g>`;
}
/** the crow of Mark 4: a dark, jagged cut-out, more shadow than monster (wings .wingF / .wingB) */
export function crow(c) {
  const s = sheet();
  s.p(c.cut([[-40, -2], [-20, -12], [6, -15], [22, -10], [24, 2], [8, 9], [-16, 8], [-44, 14], [-58, 13], [-50, 7], [-60, 3], [-50, -1]], 0.5, 4), C.crow);
  s.p(c.cut(c.circ(26, -13, 11, 14), 0.3, 3), C.crow);
  s.p(c.cut([[34, -17], [52, -11], [35, -7]], 0.2, 3), C.rock3);
  s.x(c.poly(c.circ(29, -16, 2.3, 8)), C.cream);
  const wing = (col) => `<path d="${c.cut([[0, 0], [-6, -18], [-16, -34], [-30, -54], [-33, -45], [-42, -50], [-39, -39], [-49, -39], [-39, -27], [-46, -22], [-29, -10], [-14, -2]], 0.4, 4)}" fill="${col}"/>`;
  return `<g class="crow"><g class="wingB">${wing(shade(C.crow, -0.2))}</g>${s.out()}<g class="wingF">${wing(shade(C.crow, 0.16))}</g></g>`;
}
function heartPts(w, t0 = 0, t1 = 2 * PI, n = 30) {
  const k = w / 34, p = [];
  for (let i = 0; i <= n; i++) {
    const a = t0 + ((t1 - t0) * i) / n;
    p.push([16 * Math.sin(a) ** 3 * k, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * k - 2.5 * k]);
  }
  return p;
}
/** a sewn heart-patch on the chest that opens like two little doors onto a soil (Mark 4) */
const HW = 25, HK = HW / 34;
function heartWindow(c, kind, robe) {
  const full = heartPts(HW, 0, 2 * PI, 32).slice(0, -1);
  const fill = { path: C.sand2, rock: C.rock2, thorn: C.soil, good: C.soilRich }[kind];
  const s = sheet();
  s.p(c.cut(full, 0.2, 3), fill);
  if (kind === 'path') {
    s.p(c.cut(c.circ(-5, 5, 2.4, 7), 0.2, 2) + c.cut(c.circ(4, 8, 2, 7), 0.2, 2) + c.cut(c.circ(6, -4, 2.2, 7), 0.2, 2), C.stone2);
    s.x(c.ribbon([[-9, 1], [9, 0]], 0.9) + c.ribbon([[-6, -3], [7, -4]], 0.9), shade(C.sand2, -0.25));
  }
  if (kind === 'rock') {
    s.p(c.cut([[-9, -6], [9, -6.5], [8, -3], [-8, -2.5]], 0.3, 3), C.clay);
    s.x(c.ribbon([[-5, 2], [-1, 5], [-3, 10]], 0.9), C.rock3);
  }
  if (kind === 'good') s.x(c.ribbon([[-9, 1], [9, 0.5]], 1.3) + c.ribbon([[-7, 6], [7, 5.5]], 1.3), shade(C.soilRich, 0.22));
  let extra = '';
  if (kind === 'rock') extra = `<g class="hcrack" opacity="0"><path d="${c.ribbon([[1, -7], [-2, -2], [3, 2], [-1, 7], [1, 12]], 1.6)}" fill="${C.ink}"/></g>`;
  if (kind === 'thorn') {
    let d = '';
    [[-8, 9, -6], [0, 12, 2], [8, 9, 7]].forEach(([x, y, l]) => {
      d += c.ribbon(c.qbez([x, y], [x + l * 0.3, y - 8], [x + l, y - 16], 6), (u) => 2.2 - u * 1.4);
      d += c.poly([[x + l * 0.35 - 1, y - 7], [x + l * 0.35 + 5, y - 10], [x + l * 0.35 + 1, y - 6]]);
    });
    extra = `<g class="hthorn" transform="scale(0)">${sheet().p(d, C.thorn2).out(false)}</g>`;
  }
  if (kind === 'good') {
    extra = `<g class="hsprout" transform="scale(0)">${sheet().p(c.ribbon([[0, 0], [0, -9]], 1.4) + c.cut([[0, -7], [-5, -11], [-8, -10], [-4, -7]], 0.2, 2) + c.cut([[0, -8], [5, -12], [8, -11], [4, -8]], 0.2, 2), C.leaf).out(false)}</g>`;
  }
  const door = (a0, a1) => c.cut(heartPts(HW, a0, a1, 16), 0.2, 3);
  const doors = `<g class="doorL"><path d="${door(PI, 2 * PI)}" fill="${shade(robe, -0.07)}"/><path d="${c.poly(c.circ(-3, 3, 1.2, 6))}" fill="${C.haloRim}"/></g>`
    + `<g class="doorR"><path d="${door(0, PI)}" fill="${shade(robe, -0.02)}"/><path d="${c.poly(c.circ(3, 3, 1.2, 6))}" fill="${C.haloRim}"/></g>`;
  const rim = c.ribbon([...full, full[0], full[1]], 1.9);
  return `<g class="heart" transform="translate(-7 -110)"><circle class="hglow" r="46" fill="url(#warm-glow)" opacity="0"/>${s.out()}${extra}<g class="hseed" opacity="0">${wordSeed(c, { glow: 0 })}</g>${doors}<path d="${rim}" fill="${shade(robe, -0.3)}"/></g>`;
}
/** add a heart window to a puppet's body; returns a setter ({open, seed, glow, crack, thorn, sprout, pulse}) */
export function addHeart(pup, c, kind, robe) {
  const armF = pup.el.querySelector('.body > .armF');
  armF.insertAdjacentHTML('beforebegin', heartWindow(c, kind, robe));
  const h = armF.previousElementSibling;
  const q = (s) => h.querySelector(s);
  const P = { dL: q('.doorL'), dR: q('.doorR'), seed: q('.hseed'), glow: q('.hglow'), crack: q('.hcrack'), thorn: q('.hthorn'), sprout: q('.hsprout') };
  const edge = 16 * HK;
  return ({ open = 0, seed = 0, glow = 0, crack = 0, thorn = 0, sprout = 0, pulse = 0 }) => {
    pose(P.dL, { x: -edge, sx: Math.max(0.06, 1 - open * 0.94), ox: -edge });
    pose(P.dR, { x: edge, sx: Math.max(0.06, 1 - open * 0.94), ox: edge });
    pose(P.seed, { x: 0, y: -1, s: 0.6 * (0.5 + 0.5 * seed), o: seed * open });
    pose(P.glow, { s: 0.7 + glow * 0.35 + pulse * 0.08, o: glow * open });
    if (P.crack) pose(P.crack, { o: crack });
    if (P.thorn) pose(P.thorn, { s: thorn });
    if (P.sprout) pose(P.sprout, { y: 9, s: sprout });
  };
}
/** a thorn tendril growing from (0,0); returns { d, tip } (Mark 4) */
export function tendril(c, len, lean) {
  const sw = c.rr(0.5, 0.9) * (lean >= 0 ? -1 : 1) * Math.max(40, Math.abs(lean));
  const pts = c.cbez([0, 0], [sw * 0.9, -len * 0.3], [lean + sw * -0.8, -len * 0.62], [lean, -len], 22);
  let d = c.ribbon(pts, (u) => 10 - u * 7), sp = '';
  pts.forEach(([px, py], j) => {
    if (j < 2 || j > pts.length - 3) return;
    const a = pts[j - 1], b = pts[j + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L, sd = j % 2 ? 1 : -1, k = 15 - (j / pts.length) * 7;
    sp += c.poly([[px - dx / L * 3, py - dy / L * 3], [px + nx * sd * k + dx / L * 5, py + ny * sd * k + dy / L * 5], [px + dx / L * 3, py + dy / L * 3]]);
  });
  [0.35, 0.6].forEach((f, i) => {
    const st = pts[Math.floor(f * (pts.length - 1))], dir = i ? 1 : -1;
    const sh = c.qbez(st, [st[0] + dir * 30, st[1] - 24], [st[0] + dir * 40, st[1] - 4], 8);
    d += c.ribbon(sh, (u) => 5 - u * 3.8);
    sh.forEach(([px, py], j) => { if (j % 3 === 1) sp += c.poly([[px - 2, py], [px + dir * 3, py - 11], [px + 2, py - 1]]); });
  });
  return { d: d + sp, tip: pts[pts.length - 1] };
}
const glint = (c, x, y, r = 6) => `<path class="glint" transform="translate(${x} ${y})" d="${c.poly(c.star(0, 0, r, r * 0.25, 4, 0))}" fill="${C.star}"/>`;
/* the cares of the age and the deceit of riches that ride on the thorns (Mark 4; all hang from (0,0)) */
export function hourglassT(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-14, 2, 28, 5), 0.3, 4) + c.cut(c.rect(-14, 43, 28, 5), 0.3, 4), C.wood2);
  s.p(c.cut([[-10, 7], [10, 7], [2, 25], [10, 43], [-10, 43], [-2, 25]], 0.3, 4), C.skyVeil);
  s.p(c.cut([[-6, 13], [6, 13], [1, 24], [-1, 24]], 0.2, 3) + c.cut([[-8, 43], [8, 43], [0, 34]], 0.2, 3), C.ochre);
  s.p(c.ribbon([[-12, 6], [-12, 44]], 2.6) + c.ribbon([[12, 6], [12, 44]], 2.6), C.wood);
  return s.out();
}
export function worryCloud(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 20, 26, 15, 12, 0.24), 0.8, 4), C.storm);
  s.p(c.cut(c.blob(-12, 26, 12, 8, 9, 0.2), 0.6, 4), C.storm2);
  s.x(c.ribbon([[-13, 18], [-6, 12], [0, 24], [5, 12], [11, 21], [-4, 26], [8, 16], [2, 20]], 1.7), C.cream);
  return s.out();
}
export function coinsT(c) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [-6, 8]], 1.2) + c.ribbon([[0, 0], [8, 10]], 1.2), C.rope);
  [[-7, 16, 10], [8, 19, 10], [0, 30, 11.5]].forEach(([x, y, r]) => {
    s.p(c.cut(c.circ(x, y, r, 18), 0.25, 3), C.sun);
    s.p(c.cut(c.circ(x, y, r * 0.64, 14), 0.2, 3), shade(C.sun, -0.16));
    s.x(c.poly(c.rect(x - 1.2, y - r * 0.4, 2.4, r * 0.8)), shade(C.sun, 0.3));
  });
  return s.out() + glint(c, -10, 11) + glint(c, 6, 32, 5);
}
export function moneyBag(c) {
  const s = sheet();
  s.p(c.cut([[-5, 6], [5, 6], [9, 12], [19, 22], [23, 36], [17, 48], [0, 52], [-17, 48], [-23, 36], [-19, 22], [-9, 12]], 0.5, 4), C.basket);
  s.p(c.cut([[-9, 0], [9, 0], [11, 7], [-11, 7]], 0.3, 3), shade(C.basket, -0.12));
  s.p(c.ribbon([[-10, 9], [10, 9]], 3.4), C.terracotta);
  s.p(c.cut(c.circ(0, 33, 9, 14), 0.2, 3), C.sun);
  s.x(c.cut(c.circ(0, 33, 5.5, 10), 0.2, 3), shade(C.sun, -0.18));
  return s.out() + glint(c, 8, 28, 5);
}
export function gem(c) {
  const s = sheet();
  s.x(c.ribbon([[-11, -2], [0, 13]], 1.3) + c.ribbon([[11, -2], [0, 13]], 1.3), C.haloRim);
  s.p(c.cut([[0, 13], [13, 24], [0, 46], [-13, 24]], 0.3, 4), C.lavender);
  s.p(c.cut([[0, 13], [13, 24], [0, 27], [-13, 24]], 0.2, 3), shade(C.lavender, 0.4));
  s.p(c.cut([[0, 27], [13, 24], [0, 46]], 0.2, 3), shade(C.lavender, -0.14));
  s.p(c.cut(c.circ(0, 13, 3.4, 8), 0.2, 2), C.sun);
  return s.out() + glint(c, 6, 22, 7);
}
/** growing roots: a polyline cut into short pieces that appear one by one (class .rs, data-o = when) */
export function rootPieces(c, lines, w = 3, color = C.cream) {
  let out = '';
  lines.forEach(({ pts, o0 = 0, o1 = 1 }) => {
    const n = pts.length - 1;
    for (let i = 0; i < n; i++) {
      const ww = w * (1 - (i / n) * 0.6);
      out += `<path class="rs" data-o="${(o0 + ((o1 - o0) * i) / n).toFixed(3)}" d="${c.ribbon([pts[i], pts[i + 1]], ww)}" fill="${color}" opacity="0"/>`;
    }
  });
  return out;
}
export function rootLines(c, x0, y0, depth, spread, branches = 3) {
  const main = [[x0, y0]];
  let x = x0;
  for (let y = y0 + 10; y <= y0 + depth; y += 12) { x += c.rr(-4, 4); main.push([x, y]); }
  const lines = [{ pts: main, o0: 0, o1: 0.8 }];
  for (let b = 0; b < branches; b++) {
    const k = 0.2 + (b / branches) * 0.6, st = main[Math.floor(k * (main.length - 1))];
    const dir = b % 2 ? 1 : -1, pts = [st];
    for (let i = 1; i <= 4; i++) pts.push([st[0] + dir * spread * (i / 4) + c.rr(-3, 3), st[1] + i * 8 + c.rr(-2, 2)]);
    lines.push({ pts, o0: k * 0.8 + 0.05, o1: Math.min(1, k * 0.8 + 0.4) });
  }
  return lines;
}

/**
 * The field of the explanation: two patches of soil (kinds among path · rock · thorn · good) left and right of a
 * green knoll where Jesus stands, all cut open at the front edge so the soil shows in cross-section; each patch has
 * a lift-up flap over its section. Adds sky ornaments, hills, the back field, the ground (layer `ground`), a plants
 * layer, a people layer, an fx layer and the foreground bank. Returns handles.
 */
export const XP = { L: 470, R: 1130, J: 800 };
export const FTOP = 560, FFACE = 624, FLAPB = 756, FEET = 604;
export function soilStage(S, { left, right, skyCols = ['#cfe2df', '#e6ece0', '#f3e8d2'], sky2 = null } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2L = sky2 ? sky(S, sky2, { name: 'sky2' }).layer : null;
  if (sk2L) sk2L.fade(0);
  const skyL = S.layer({ par: 0.05, sh: 4 });
  const SUN = [1180, 160];
  const sunEl = hanging(skyL, sun(c, 46), { x: SUN[0], y: SUN[1], len: 620 });
  const clouds = [[400, 150, 190], [820, 105, 130]].map(([x, y, w], i) => ({ x, y, i, el: hanging(skyL, cloud(c, w), { x, y, len: 500 + i * 60 }) }));
  S.layer({ par: 0.12, sh: 2 }).add(hillsWith(c, { y: 408, amps: [20, 8, 3], lens: [1000, 380, 140], color: C.hillFar, trees: 20, treeColor: C.sage2, treeH: 22 }).markup);
  const mid = S.layer({ par: 0.25, sh: 3 });
  const m2 = hillsWith(c, { y: 458, amps: [18, 8, 3], lens: [800, 300, 110], color: C.hillMid, trees: 28, treeColor: C.sage, treeH: 26 });
  mid.add(m2.markup + town(c, { x: 260, y: m2.fn(260) + 10, n: 6, spread: 220, sc: 0.5 }) + town(c, { x: 1400, y: m2.fn(1400) + 10, n: 5, spread: 200, sc: 0.48 }));
  const backL = S.layer({ par: 0.42, sh: 3 });
  const bf = c.wave(512, [6, 2], [650, 180]);
  backL.add(sheet().p(c.ridge(bf, -900, 2500, 1700, 12, 1), C.sage2).out());
  let hedge = '';
  for (let x = -900; x < 2500; x += c.rr(60, 140)) hedge += c.cut(c.blob(x, bf(x) - 8, c.rr(24, 44), c.rr(10, 16), 10, 0.2), 0.8, 6);
  backL.add(sheet().p(hedge, C.sage).out() + olive(c, 180, 514, 0.7) + cypress(c, 1420, 514, 110) + olive(c, 1560, 514, 0.6));

  const ground = S.layer({ par: 0.6, sh: 4 });
  const topFn = c.wave(FTOP, [5, 2], [700, 170]);
  const faceFn = c.wave(FFACE, [2, 1], [500, 130]);
  const G = sheet();
  G.p(c.ridge(topFn, -900, 2500, 1700, 12, 1), C.hillNear);
  const W = 190;
  const patchCol = { path: C.sand, rock: C.clay, thorn: C.soil, good: C.soilRich };
  const patch = (cx, kind) => {
    const x0 = cx - W, x1 = cx + W, pts = [];
    for (let x = x0; x <= x1; x += 20) pts.push([x, 569 + c.rr(-3, 3) + (x === x0 || x > x1 - 20 ? 7 : 0)]);
    pts.push([x1 + 10, FFACE + 14], [x0 - 10, FFACE + 14]);
    G.p(c.cut(pts, 0.8, 10), patchCol[kind]);
    if (kind === 'path') {
      G.x(c.ribbon(c.qbez([x0, 584], [cx, 578], [x1, 586], 16), 5) + c.ribbon(c.qbez([x0, 608], [cx, 602], [x1, 610], 16), 5), C.sand2);
      let fp = '';
      for (let i = 0; i < 9; i++) { const x = x0 + 20 + i * 40 + c.rr(-4, 4), y = 594 + (i % 2) * 8; fp += c.cut(c.ell(x, y, 6, 2.6, 8), 0.2, 3); }
      G.x(fp, shade(C.sand, -0.14));
      let peb = '';
      for (let i = 0; i < 18; i++) peb += c.cut(c.blob(c.rr(x0 + 10, x1 - 10), c.rr(574, 618), c.rr(2.5, 5), c.rr(2, 3.5), 7, 0.2), 0.3, 3);
      G.p(peb, C.stone2);
    }
    if (kind === 'rock') {
      let slabs = '';
      for (let i = 0; i < 9; i++) slabs += c.cut(c.blob(c.rr(x0 + 20, x1 - 20), c.rr(576, 614), c.rr(16, 32), c.rr(4, 7), 9, 0.2), 0.5, 5);
      G.p(slabs, C.rock);
    }
    if (kind === 'thorn') {
      let dry = '';
      for (let i = 0; i < 22; i++) { const x = c.rr(x0 + 10, x1 - 10), y = c.rr(576, 618); dry += c.ribbon([[x, y], [x + c.rr(-8, 8), y - c.rr(6, 14)]], 1.4); }
      G.p(dry, C.thorn2);
    }
    if (kind === 'good') {
      let fur = '';
      [580, 594, 608].forEach((y) => { fur += c.ribbon(c.qbez([x0 + 14, y + 2], [cx, y - 3], [x1 - 14, y + 2], 18), 4.4, 0.8); });
      G.p(fur, C.soil);
    }
  };
  patch(XP.L, left);
  patch(XP.R, right);
  // Jesus' knoll between the two patches
  G.p(c.cut(c.blob(XP.J, 596, 150, 26, 16, 0.08), 1, 8), shade(C.hillNear, 0.1));
  // the cut front face and the sections under each patch
  G.p(c.ridge(faceFn, -900, 2500, 1700, 12, 0.6), C.soil);
  G.p(c.ridge(c.wave(780, [6, 3], [300, 90]), -900, 2500, 1700, 12, 1), shade(C.soil, -0.18));
  const block = (x0, x1, y0, y1, col, j = 2) => {
    const pts = [];
    for (let x = x0; x <= x1; x += 24) pts.push([x, y0 + c.rr(-j, j)]);
    for (let x = x1; x >= x0; x -= 24) pts.push([x, y1 + c.rr(-j, j)]);
    G.p(c.cut(pts, 0.6, 8), col);
  };
  const section = (cx, kind) => {
    const x0 = cx - W, x1 = cx + W;
    if (kind === 'path') {
      block(x0, x1, FFACE + 2, 710, shade(C.sand2, -0.1));
      [636, 656, 678].forEach((y, i) => block(x0 + 4, x1 - 4, y, y + 8, i % 2 ? C.sand2 : shade(C.sand2, -0.22), 1));
    }
    if (kind === 'rock') {
      block(x0, x1, FFACE + 2, 644, C.clay);
      block(x0, x1, 642, 758, C.rock2, 4);
      let cracks = '';
      for (let i = 0; i < 6; i++) { const x = c.rr(x0 + 20, x1 - 20); cracks += c.ribbon([[x, 650], [x + c.rr(-10, 10), 678], [x + c.rr(-14, 14), 710]], 1.8); }
      G.x(cracks, C.rock3);
    }
    if (kind === 'thorn') {
      let troots = '';
      for (let i = 0; i < 9; i++) { const x = c.rr(x0 + 10, x1 - 10); troots += c.ribbon(c.cbez([x, FFACE + 2], [x + c.rr(-40, 40), 650], [x + c.rr(-50, 50), 680], [x + c.rr(-30, 30), 710], 12), 2.2); }
      G.p(troots, C.thorn2);
    }
    if (kind === 'good') {
      block(x0, x1, FFACE + 2, 770, C.soilRich, 3);
      let specks = '';
      for (let i = 0; i < 36; i++) specks += c.poly(c.circ(c.rr(x0 + 10, x1 - 10), c.rr(632, 760), c.rr(1.2, 2.6), 6));
      G.x(specks, shade(C.soilRich, 0.25), 'opacity=".8"');
      G.p(c.ribbon(c.qbez([x0 + 60, 722], [x0 + 80, 710], [x0 + 110, 726], 10), 4), C.roseRobe);
    }
  };
  section(XP.L, left);
  section(XP.R, right);
  const edgePts = [];
  for (let x = -900; x <= 2500; x += 20) edgePts.push([x, faceFn(x)]);
  G.x(c.ribbon(edgePts, 2.4), C.cream, 'opacity=".45"');
  let fringe = '';
  for (let x = -900; x < 2500; x += c.rr(7, 14)) {
    if (Math.abs(x - XP.L) < W + 10 || Math.abs(x - XP.R) < W + 10) continue;
    const y = faceFn(x) - 1, hh = c.rr(6, 14);
    fringe += c.poly([[x - 2.2, y], [x + c.rr(-3, 3), y + hh], [x + 2.2, y]]);
  }
  G.p(fringe, C.moss);
  ground.add(G.out());
  // lift-up flaps hiding the sections
  const flap = (cx) => {
    const x0 = cx - W - 6, x1 = cx + W + 6;
    const s = sheet();
    const pts = [];
    for (let x = x0; x <= x1; x += 24) pts.push([x, FFACE + 1 + c.rr(-1, 1)]);
    pts.push([x1, FLAPB], [x0, FLAPB]);
    s.p(c.cut(pts, 0.5, 8), shade(C.soil, -0.05));
    s.p(c.cut([[x0 + 7, FFACE + 7], [x1 - 7, FFACE + 7], [x1 - 7, FLAPB - 6], [x0 + 7, FLAPB - 6]], 0.8, 10), shade(C.soil, 0.05));
    let sp = '';
    for (let i = 0; i < 24; i++) sp += c.poly(c.circ(c.rr(x0 + 12, x1 - 12), c.rr(FFACE + 12, FLAPB - 10), c.rr(1.2, 2.6), 6));
    s.x(sp, shade(C.soil, -0.2), 'opacity=".7"');
    s.p(c.cut([[cx - 22, FFACE + 3], [cx + 22, FFACE + 3], ...c.arc(cx, FFACE + 3, 22, 16, 0, PI, 8).slice(1, -1)], 0.3, 4), C.cream);
    return s.out();
  };
  const plants = S.layer({ par: 0.6, sh: 3 });
  plants.add(olive(c, 660, 580, 0.95) + cypress(c, 950, 584, 150) + bush(c, 700, 610, 60, C.sage, C.moss) + bush(c, 910, 608, 52, C.sage2, C.sage));
  plants.add(flowers(c, { x0: 660, x1: 950, y: 600, n: 20, fn: (x) => 590 + Math.abs(x - 800) * 0.06 + c.rr(0, 14) }));
  plants.add(grass(c, { x0: -900, x1: 2500, y: 566, n: 60, h: 14, color: C.moss, fn: (x) => (Math.abs(x - XP.L) < W || Math.abs(x - XP.R) < W ? 562 : 570) }));
  const people = S.layer({ par: 0.6, sh: 5 });
  const fx = S.layer({ par: 0.6, sh: 5 });
  const fg = S.layer({ par: 0.85, sh: 6 });
  const bankFn = c.wave(830, [8, 4], [520, 170]);
  fg.add(sheet().p(c.ridge(bankFn, -1200, 2800, 1800, 14, 1.2), C.sage).p(c.ridge(c.wave(880, [6, 3], [400, 130]), -1200, 2800, 1800, 14, 1), shade(C.sage, -0.08)).out());
  fg.add(grass(c, { x0: -1200, x1: 2800, y: 830, fn: bankFn, n: 90, h: 30, color: C.moss }) + flowers(c, { x0: -1200, x1: 2800, y: 830, fn: bankFn, n: 30, h: 34 }));
  return {
    c, sk, sk2L, skyL, sunEl, SUN, clouds, ground, plants, people, fx, fg, flap, W,
    update(time, { hot = 0 } = {}) {
      swing(sunEl, SUN[0], SUN[1] + hot * 40, time, 1.1, 0.7);
      clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y - hot * 420, time, 1.4, 0.6, cl.i));
    },
  };
}

/* ================================================================== the mysteries of the Kingdom */
function raysPath(c, n, r0, r1, color) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + c.rr(-0.05, 0.05), w = 0.06 * c.rr(0.6, 1.3);
    d += c.poly([[Math.cos(a) * r0, Math.sin(a) * r0], [Math.cos(a - w) * r1, Math.sin(a - w) * r1], [Math.cos(a + w) * r1, Math.sin(a + w) * r1]]);
  }
  return `<path d="${d}" fill="${color}" opacity=".55"/>`;
}
/** Mark 4's little casket of the mystery with a crown on it: .lid hinges at its left end, .glow and .rays inside */
export function casket(c) {
  const b = sheet();
  b.p(c.cut(c.rect(-36, -38, 72, 38), 0.5, 7), C.wood3);
  b.p(c.cut(c.rect(-36, -38, 72, 6), 0.3, 7), shade(C.wood3, -0.2));
  b.p(c.cut(c.rect(-26, -38, 7, 38), 0.3, 6) + c.cut(c.rect(19, -38, 7, 38), 0.3, 6), C.ochre);
  b.p(c.cut([[-12, -12], [-12, -26], [-6, -19], [0, -29], [6, -19], [12, -26], [12, -12]], 0.3, 3), C.sun);
  b.x(c.poly(c.circ(0, -7, 2.4, 8)) + c.poly([[-1.6, -6], [1.6, -6], [2.4, -1.5], [-2.4, -1.5]]), C.soilDark);
  const lid = sheet();
  lid.p(c.cut([[0, 0], ...c.arc(37, 0, 38, 17, PI, 2 * PI, 12), [74, 0], [74, 4], [0, 4]], 0.4, 6), C.wood);
  lid.p(c.cut(c.rect(10, -14, 7, 18), 0.3, 5) + c.cut(c.rect(57, -14, 7, 18), 0.3, 5), C.ochre);
  const inner = `<path d="${c.cut(c.ell(0, -38, 32, 7, 16), 0.3, 5)}" fill="${C.lampGlow}"/>`;
  const cord = sheet().p(c.ribbon([[-40, -30], [40, -24]], 5) + c.ribbon([[-4, -58], [4, 2]], 5), C.rope).out();
  const wax = sheet().p(c.cut(c.blob(0, 0, 13, 12, 12, 0.14), 0.8, 4), C.terracotta).x(c.poly(c.star(0, 0, 6, 3, 5)), shade(C.terracotta, 0.25)).out();
  return `<g class="glow" opacity="0"><circle cx="0" cy="-40" r="150" fill="url(#warm-glow)"/></g>` +
    `<g class="rays" opacity="0" transform="translate(0 -40)">${raysPath(c, 14, 44, 125, C.lampGlow)}</g>` +
    `${inner}${b.out()}<g class="lid" transform="translate(-37 -38)">${lid.out()}</g>` +
    `<g class="cord" opacity="0">${cord}</g><g class="seal" opacity="0" transform="translate(0 -26)">${wax}</g>`;
}
/** the sower parable as a small round plate (Mark 4) */
export function sowerPlate(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 52, 32), 0.6, 5), C.cream);
  s.p(c.cut([[-44, 22], ...c.arc(0, 18, 46, 9, PI, 2 * PI, 10), [44, 22], ...c.arc(0, 22, 44, 26, 0, PI, 10)], 0.4, 5), C.soil);
  let seeds = '';
  for (let i = 0; i < 9; i++) seeds += seedPath(c, c.rr(-2, 34), c.rr(-14, 16), 2.2, c.rr(0, 3));
  s.x(seeds, C.wheat2);
  const sower = person(c, { ...SOWER });
  return `${s.out()}<g transform="translate(-12 25) scale(.27)">${sower.replace('class="armFr"', 'class="armFr" transform="rotate(-110)"')}</g>`;
}
/**
 * a card that turns over: the parable's picture on the front (.front), its meaning on the back (.back) with a label
 * under it. Both faces w×h, origin centre. flipCard(el, k): k 0 → 1 turns it.
 */
export function keyCard(c, id, front, back, label = '', { w = 170, h = 150 } = {}) {
  const face = (col, rim) => sheet().p(c.cut(c.rect(-w / 2 - 7, -h / 2 - 7, w + 14, h + 14), 0.5, 8), rim).p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 8), col).out();
  const clip = `<clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath>`;
  const lab = label ? `<g class="lab" transform="translate(0 ${h / 2 + 24})">${sheet().p(c.cut([[-label.length * 5.4 - 14, -13], [label.length * 5.4 + 14, -14], [label.length * 5.4 + 15, 13], [-label.length * 5.4 - 15, 14]], 0.3, 5), C.cream).out()}<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="18" font-style="italic" fill="${C.ink}">${label}</text></g>` : '';
  return `${clip}<g class="front">${face(C.parchment, C.wood3)}<g clip-path="url(#${id})">${front}</g></g><g class="back">${face(mix(C.cream, C.halo, 0.3), C.haloRim)}<g clip-path="url(#${id})">${back}</g>${lab}</g>`;
}
export function flipCard(el, k) {
  const f = el.querySelector('.front'), b = el.querySelector('.back');
  const cs = Math.cos(Math.min(1, Math.max(0, k)) * PI);
  pose(f, { sx: Math.max(0.02, cs), o: cs > 0 ? 1 : 0 });
  pose(b, { sx: Math.max(0.02, -cs), o: cs < 0 ? 1 : 0 });
}
/** a gauze veil on a rod, fringed at the bottom (origin: top centre) */
export function gauze(c, w = 400, h = 120, col = C.lavender, op = 0.78) {
  const pts = [[-w / 2, 0], [w / 2, 0]];
  const n = Math.round(w / 14);
  for (let i = 0; i <= n; i++) { const x = w / 2 - (w * i) / n; pts.push([x, h + (i % 2 ? 6 : 0) + Math.sin(i * 0.7) * 3]); }
  const s = sheet();
  s.p(c.cut(pts, 0.6, 8), col, `opacity="${op}"`);
  let folds = '';
  for (let x = -w / 2 + 14; x < w / 2; x += c.rr(16, 26)) folds += c.ribbon([[x, 4], [x + c.rr(-3, 3), h]], 2);
  s.x(folds, shade(col, -0.15), 'opacity=".5"');
  s.p(c.cut(c.rect(-w / 2 - 8, -6, w + 16, 8), 0.3, 8), C.wood2);
  return `<path d="M${-w * 0.35} -1600V-4M${w * 0.35} -1600V-4" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>` + s.out();
}
/** a round hanging picture plate (cream disc with rim) holding `inner`; origin: centre */
export function discPlate(c, inner, { r = 70, rim = C.haloRim, face = C.parchment } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 7, 40), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 40), 0.5, 5), C.cream).p(c.cut(c.circ(0, 0, r - 7, 36), 0.4, 5), face);
  return `${s.out()}<g>${inner}</g>`;
}

/* ================================================================== Peter's house in the evening */
/**
 * The room of Mt 13,36–52: a warm plastered wall with a window onto the dusk, a shelf of jars, a niche with a lamp,
 * a doorway on the left (its door leaf .door swings), a red rug on the floor. Returns { wall, floor, niche, pool, door, doorLight }.
 */
export function roomSet(S, { skyCols = ['#6f6c98', '#c79a9a', '#e8b996'] } = {}) {
  const c = S.c;
  sky(S, skyCols);
  const winL = S.layer({ par: 0.2, sh: 1, flat: true });
  winL.add(stars(c, { x0: 1000, x1: 1260, y0: 260, y1: 420, n: 12 }) + `<g transform="translate(1200 300)">${moon(c, 18)}</g>`);
  // what shows through the doorway: the dusk path outside (behind the wall)
  const outside = S.layer({ par: 0.22, sh: 1, flat: true });
  outside.add(`<path d="${c.poly([[180, 420], [460, 420], [460, 700], [180, 700]])}" fill="${mix(C.dusk, C.duskViolet, 0.4)}"/><path d="${c.poly([[180, 560], [460, 548], [460, 700], [180, 700]])}" fill="${mix(C.hillNear, C.duskViolet, 0.35)}"/>`);
  const WALLC = mix(C.plaster2, C.clay, 0.28);
  const wall = S.layer({ par: 0.3, sh: 3 });
  const W = sheet();
  const win = [[1020, 440], [1020, 330], ...c.arc(1110, 330, 90, 70, PI, 2 * PI, 12), [1200, 440]];
  const door = [[250, 646], [250, 440], ...c.arc(320, 440, 70, 56, PI, 2 * PI, 10), [390, 646]];
  W.p(c.cut([[-900, -900], [2500, -900], [2500, 1700], [-900, 1700]], 0.6, 40) + c.hole(win, 0.4, 6) + c.hole(door, 0.4, 6), WALLC);
  let bl = '';
  for (let y = 120; y < 640; y += 44) for (let x = -900 + ((y / 44) % 2 ? 60 : 0); x < 2500; x += 120) bl += c.ribbon([[x, y], [x + 104, y + c.rr(-1, 1)]], 1.3);
  W.x(bl, shade(WALLC, -0.1), 'opacity=".5"');
  W.p(c.ribbon([[1016, 442], [1204, 442]], 8), C.wood2);
  W.p(c.ribbon(door.slice(1, -1), 8), C.wood2);
  let beams = '';
  for (let x = -600; x < 2300; x += 160) beams += c.cut(c.rect(x, 60, 24, 36), 0.3, 5);
  W.p(c.cut([[-900, 40], [2500, 40], [2500, 66], [-900, 66]], 0.5, 20) + beams, C.wood2);
  W.p(c.cut(c.rect(470, 400, 200, 12), 0.3, 6), C.wood);
  W.p(c.cut([[740, 470], [740, 400], ...c.arc(780, 400, 40, 30, PI, 2 * PI, 8), [820, 470]], 0.3, 5), shade(WALLC, -0.25));
  wall.add(W.out());
  wall.add(`<g transform="translate(500 400)">${storeJar(c, 54)}</g><g transform="translate(560 400)">${storeJar(c, 44, C.clay)}</g><g transform="translate(630 400)">${storeJar(c, 50, C.pot)}</g>`);
  const niche = wall.add(`<g transform="translate(780 468)"><circle r="70" fill="url(#warm-glow)"/><path d="M-10 0C-12 -8 -6 -16 0 -26C6 -16 12 -8 10 0Z" fill="${C.lampFlame}"/></g>`);
  const doorLeaf = wall.add(`<g transform="translate(250 646)">${sheet().p(c.cut([[0, 0], [0, -206], [70, -262], [140, -206], [140, 0]], 0.4, 6), C.wood).x(c.ribbon([[8, -180], [132, -180]], 3) + c.ribbon([[8, -30], [132, -30]], 3) + c.ribbon([[70, -240], [70, 0]], 2), C.wood2).out()}</g>`);
  const floor = S.layer({ par: 0.42, sh: 3 });
  floor.add(sheet().p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 0.6, 30), mix(C.sand2, C.clay, 0.25)).p(c.cut(c.ell(800, 760, 420, 60, 30), 0.8, 10), mix(C.terracotta, C.roseRobe, 0.5)).out());
  const pool = floor.add(`<ellipse cx="800" cy="700" rx="560" ry="220" fill="url(#warm-glow)" opacity=".45"/>`);
  return { c, wall, floor, niche, pool, doorLeaf, outside };
}

/* ================================================================== the householder's farm: wheat and darnel */
/** one darnel stalk: a thinner, darker stem with a flat, spaced ear of dark seeds (origin: foot) */
export function darnelStalk(c, { h = 110, color = mix(C.moss2, C.olive, 0.4), seedCol = mix(C.soilDark, C.plumRobe, 0.3), ripe = true } = {}) {
  const lean = c.rr(-12, 12);
  const top = [lean, -h];
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [lean * 0.3, -h * 0.5], top, 8), (t) => 2.6 - t * 1.4), color);
  s.p(c.ribbon(c.qbez([0, -h * 0.3], [-18, -h * 0.42], [-26, -h * 0.34], 6), (t) => Math.sin(t * PI) * 4.5 + 0.5), color);
  let ear = '';
  for (let i = 0; i < 6; i++) {
    const y = -h - i * 8, side = i % 2 ? 1 : -1;
    ear += c.cut(c.ell(lean + side * 4, y, 2.6, 5.6, 8, side * 0.5), 0.2, 3);
  }
  s.p(ear, ripe ? seedCol : color);
  s.x(c.ribbon([[lean, -h], [lean + 1, -h - 48]], 1.1), color);
  return s.out();
}
/**
 * a row of stalks as one cut-out (origin: ground at x0). kind 'wheat' | 'darnel' | 'blade' (young green blades).
 * Returns markup.
 */
export function stalkRow(seed, { x0 = -600, x1 = 2200, n = 60, h = 110, kind = 'wheat', gold = false, dy = 6 } = {}) {
  const c = makeCutter(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + c.rr(0.1, 0.9)) / n), y = c.rr(-dy, dy);
    const hh = h * c.rr(0.85, 1.12);
    let m;
    if (kind === 'wheat') m = wheatStalk(c, { h: hh, color: gold ? C.wheat2 : C.wheatGreen, ear: gold ? C.wheat : mix(C.wheat, C.wheatGreen, 0.4) });
    else if (kind === 'darnel') m = darnelStalk(c, { h: hh * 0.95, color: gold ? mix(C.dune, C.olive, 0.5) : mix(C.moss2, C.olive, 0.4) });
    else m = sheet().p(c.ribbon(c.qbez([0, 0], [c.rr(-4, 4), -hh * 0.5], [c.rr(-10, 10), -hh], 6), (t) => 3 - t * 2.2) + c.ribbon(c.qbez([0, -2], [c.rr(-12, -4), -hh * 0.4], [c.rr(-20, -12), -hh * 0.7], 6), (t) => 2.4 - t * 1.8), C.leaf).out();
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${m}</g>`;
  }
  return out;
}
/**
 * The householder's farm (Mt 13,24–30): his house on the left, the barn on the right, the field between with a cut
 * front edge (so roots can show) and the footpath in front where people walk. Adds sky (+ a night sky and stars that
 * fade in), hanging sun and moon, hills, the buildings (layer `bld`), the field (layer `field`), a layer for the rows
 * (`rowsL`), the path (`pathL`) and a front layer for people (`ppl`). rows(kind, {gold}) adds three rows of stalks
 * to rowsL (returns their elements, back to front). Returns handles and update(time).
 */
export const FARM = { TOP: 560, FACE: 664, PATH: 724, X0: 240, X1: 1360, HOUSE: 470, BARN: 1150, BY: 566, BS: 0.78, ROOF: 566 - 142 * 0.78, WHEAT: [578, 606, 634], DARNEL: [590, 620, 648] };
export function farmSet(S, { skyCols = MORNING, sky2 = null, night = false, sunAt = [1180, 160], moonAt = [760, 170] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2L = sky2 ? sky(S, sky2, { name: 'sky2' }).layer : null;
  if (sk2L) sk2L.fade(0);
  const nightL = night ? sky(S, NIGHT, { name: 'night' }).layer : null;
  let starL = null;
  if (night) { nightL.fade(0); starL = S.layer({ par: 0.02, sh: 1, flat: true }); starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 420, n: 140 })); starL.fade(0); }
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const moonEl = night ? hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 34)}`, { x: moonAt[0], y: moonAt[1], len: 800 }) : null;
  const cls = [[420, 140, 180], [960, 200, 140]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) }));
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 500, amps: [16, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 22 });
  mid.add(h2.markup + olive(c, 620, h2.fn(620) + 8, 0.6) + cypress(c, 1030, h2.fn(1030) + 8, 90));
  const back = S.layer({ par: 0.34, sh: 3 });
  const bfn = c.wave(566, [4, 2], [700, 170]);
  back.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sage2).out());
  let hedge = '';
  for (let x = -900; x < 2500; x += c.rr(60, 120)) hedge += c.cut(c.blob(x, bfn(x) - 6, c.rr(22, 40), c.rr(9, 15), 10, 0.2), 0.8, 6);
  back.add(sheet().p(hedge, C.sage).out());
  // the buildings
  const bld = S.layer({ par: 0.36, sh: 4 });
  const H = farmHouse(c);
  const at = (x) => `translate(${x} ${FARM.BY}) scale(${FARM.BS})`;
  bld.add(olive(c, FARM.HOUSE - 150, FARM.BY + 2, 0.7) + cypress(c, FARM.BARN + 150, FARM.BY + 2, 120) + bush(c, FARM.BARN - 150, FARM.BY + 4, 60, C.sage, C.moss));
  const houseG = bld.add(`<g transform="${at(FARM.HOUSE)}">${H.body}</g>`);
  const lit = bld.add(`<g transform="${at(FARM.HOUSE)}">${H.lit}</g>`);
  const Bn = barn(c);
  bld.add(`<g transform="${at(FARM.BARN)}">${Bn.body}</g>`);
  const barnIn = bld.add(`<g transform="${at(FARM.BARN)}">${Bn.inside}</g>`);
  const barnDoor = bld.add(`<g transform="translate(${FARM.BARN - 36} ${FARM.BY}) scale(${FARM.BS * 2} ${FARM.BS})">${Bn.door}</g>`);
  // the field and its cut front edge
  const field = S.layer({ par: 0.45, sh: 4 });
  const top = c.wave(FARM.TOP, [3, 1.5], [600, 170]);
  const face = c.wave(FARM.FACE, [3, 1.5], [500, 140]);
  const fs = sheet();
  fs.p(c.ridge(top, -900, 2500, 1700, 12, 1), mix(C.soil, C.clay, 0.5));
  let fur = '';
  for (let i = 0; i < 8; i++) { const y = FARM.TOP + 12 + i * 15; fur += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.8 + i * 0.3); }
  fs.x(fur, shade(mix(C.soil, C.clay, 0.5), -0.14), 'opacity=".55"');
  fs.p(c.ridge(face, -900, 2500, 1700, 12, 0.8), C.soil);
  fs.p(c.ridge(c.wave(FARM.FACE + 60, [4, 2], [400, 120]), -900, 2500, 1700, 12, 1), shade(C.soil, -0.18));
  let peb = '';
  for (let i = 0; i < 40; i++) peb += c.cut(c.blob(c.rr(-600, 2200), c.rr(FARM.FACE + 10, FARM.FACE + 180), c.rr(3, 7), c.rr(2, 4), 7, 0.2), 0.3, 3);
  fs.x(peb, shade(C.soil, 0.2), 'opacity=".5"');
  const ep = [];
  for (let x = -900; x <= 2500; x += 20) ep.push([x, face(x)]);
  fs.x(c.ribbon(ep, 2.2), C.cream, 'opacity=".4"');
  field.add(fs.out());
  const rowsL = S.layer({ par: 0.45, sh: 3 });
  // the footpath in front
  const pathL = S.layer({ par: 0.55, sh: 4 });
  const pfn = c.wave(FARM.PATH - 30, [4, 2], [600, 160]);
  pathL.add(sheet().p(c.ridge(pfn, -1100, 2700, 1800, 12, 1), mix(C.sand, C.sage2, 0.35)).x(c.ribbon([[-1100, FARM.PATH + 6], [2700, FARM.PATH + 2]], 30), mix(C.sand, C.cream, 0.3), 'opacity=".8"').out());
  pathL.add(grass(c, { x0: -1000, x1: 2600, y: FARM.PATH - 30, fn: pfn, n: 50, h: 14, color: C.moss }));
  const ppl = S.layer({ par: 0.55, sh: 5 });
  const rows = (kind, { gold = false, seed = 'mt13-row' } = {}) => {
    const ys = kind === 'darnel' || kind === 'dblade' ? FARM.DARNEL : FARM.WHEAT;
    return ys.map((y, i) => {
      const h = kind === 'blade' || kind === 'dblade' ? 30 + i * 3 : kind === 'darnel' ? 104 + i * 8 : 100 + i * 8;
      const m = stalkRow(`${seed}-${kind}-${i}`, { x0: FARM.X0 + (i % 2) * 18, x1: FARM.X1 + (i % 2) * 18, n: kind === 'darnel' || kind === 'dblade' ? 16 + i * 2 : 24 + i * 3, h, kind: kind === 'dblade' ? 'blade' : kind, gold, dy: 5 });
      return { i, y, el: rowsL.add(`<g transform="translate(0 ${y})"><g>${m}</g></g>`) };
    });
  };
  return {
    c, sk, sk2L, nightL, starL, hangL, sunEl, moonEl, cls, bld, lit, barnIn, barnDoor, field, rowsL, pathL, ppl, rows, houseG,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], moonY = moonAt[1], moonX = moonAt[0] } = {}) {
      swing(sunEl, sunX, sunY, time, 1.1, 0.6);
      if (moonEl) swing(moonEl, moonX, moonY, time, 1, 0.5, 2);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.3, 0.6, cl.i + 1));
    },
  };
}
/** grow a row element from the ground: k 0 → 1 */
export function growRow(r, k, o = 1) {
  pose(r.el, { x: 0, y: r.y, sy: Math.max(0.001, k), o: k > 0.005 ? o : 0 });
}
/** a tied bundle of darnel (dark, for burning) — origin: bottom centre */
export function darnelBundle(c, h = 90) {
  const s = sheet();
  let d = '';
  for (let i = 0; i < 12; i++) { const a = (i - 6) * 0.05; d += c.ribbon([[Math.sin(a) * 8, 0], [Math.sin(a) * 34, -h]], 2.4); }
  s.p(d, mix(C.dune, C.olive, 0.45));
  let ears = '';
  for (let i = 0; i < 8; i++) { const a = (i - 4) * 0.1; ears += c.cut(c.ell(Math.sin(a) * h * 0.4, -h - 8, 3.6, 12, 8, a), 0.3, 4); }
  s.p(ears, mix(C.soilDark, C.plumRobe, 0.3));
  s.p(c.ribbon([[-12, -h * 0.4], [12, -h * 0.4]], 6), C.rope);
  return s.out();
}
/** the barn / granary: a stone store with a big door; the door leaf (.door) opens. Origin: bottom centre */
export function barn(c, { w = 230, h = 170 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [-w / 2 - 14, -h], [0, -h - 70], [w / 2 + 14, -h], [w / 2, -h], [w / 2, 0]], 0.6, 8), mix(C.stone, C.sand, 0.4));
  let blocks = '';
  for (let y = -h + 20; y < -6; y += 26) for (let x = -w / 2 + ((y / 26) % 2 ? 20 : 0); x < w / 2 - 20; x += 44) blocks += c.ribbon([[x, y], [x + 38, y + c.rr(-1, 1)]], 1.2);
  s.x(blocks, C.stone2, 'opacity=".7"');
  s.p(c.cut([[-w / 2 - 20, -h + 4], [0, -h - 76], [w / 2 + 20, -h + 4], [w / 2 + 8, -h + 10], [0, -h - 60], [-w / 2 - 8, -h + 10]], 0.5, 6), C.roof);
  s.p(c.cut([[-46, 0], [-46, -104], ...c.arc(0, -104, 46, 30, PI, 2 * PI, 10), [46, 0]], 0.4, 6), C.soilDark);
  s.p(c.cut(c.rect(-w / 2 + 20, -h + 30, 26, 20), 0.3, 4), C.soilDark);
  const inside = sheet().p(c.cut(c.blob(0, -24, 38, 26, 12, 0.1), 0.6, 5), C.wheat).x(c.ribbon([[-26, -30], [22, -34]], 2) + c.ribbon([[-18, -18], [26, -20]], 2), C.wheat2).out();
  const door = sheet().p(c.cut(c.rect(0, -130, 46, 130), 0.4, 6), C.wood).x(c.ribbon([[6, -120], [40, -120]], 3) + c.ribbon([[6, -20], [40, -20]], 3) + c.ribbon([[8, -118], [38, -22]], 3), C.wood2).out();
  return { body: s.out(), inside, door };
}
/** a farm house with a flat roof and a lit window (origin bottom centre); returns { body, lit } */
export function farmHouse(c, { w = 190, h = 130 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.5, 8), C.plaster);
  s.p(c.cut(c.rect(-w / 2 - 8, -h - 12, w + 16, 14), 0.4, 6), C.roof);
  s.p(c.cut(c.rect(-w / 2, -26, w, 26), 0.4, 6), C.plaster2);
  s.p(c.cut([[w / 2 - 70, 0], [w / 2 - 70, -76], ...c.arc(w / 2 - 46, -76, 24, 20, PI, 2 * PI, 8), [w / 2 - 22, 0]], 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w / 2 + 30, -h + 36, 34, 30), 0.3, 4), C.soilDark);
  s.x(c.ribbon([[-w / 2 + 30, -h + 51], [-w / 2 + 64, -h + 51]], 2) + c.ribbon([[-w / 2 + 47, -h + 36], [-w / 2 + 47, -h + 66]], 2), C.wood2);
  const lit = `<circle cx="${-w / 2 + 47}" cy="${-h + 51}" r="60" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(-w / 2 + 31, -h + 37, 32, 28))}" fill="${C.lampGlow}"/>`;
  return { body: s.out(), lit };
}
/** a small fire of burning bundles (flames .fl can flicker); origin: ground centre */
export function bonfire(c, w = 120) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, w * 0.55, 10, 16), 0.5, 5), mix(C.soilDark, C.storm2, 0.3));
  let logs = '';
  for (let i = 0; i < 5; i++) { const x = (i - 2) * w * 0.14; logs += c.ribbon([[x - w * 0.18, -2], [x + w * 0.18, -14 - (i % 2) * 6]], 7); }
  s.p(logs, mix(C.dune, C.olive, 0.5));
  const fl = (h, col) => `<path d="M${-w * 0.36} 0C${-w * 0.4} ${-h * 0.4} ${-w * 0.2} ${-h * 0.5} ${-w * 0.16} ${-h}C${-w * 0.08} ${-h * 0.6} 0 ${-h * 0.9} ${w * 0.06} ${-h * 1.1}C${w * 0.12} ${-h * 0.7} ${w * 0.26} ${-h * 0.8} ${w * 0.22} ${-h * 0.4}C${w * 0.38} ${-h * 0.5} ${w * 0.4} ${-h * 0.2} ${w * 0.36} 0Z" fill="${col}"/>`;
  return `<circle cy="-30" r="${w * 1.4}" fill="url(#warm-glow)" opacity=".7"/>${s.out()}<g class="fl">${fl(w * 0.8, C.sunDeep)}${fl(w * 0.55, C.lampFlame)}${fl(w * 0.3, '#fff4d2')}</g>`;
}
/** a dark knot of evil (for "all that causes stumbling"); origin centre */
export function darkKnot(c, r = 16, col = '#3f3647') {
  const s = sheet();
  let d = '';
  for (let i = 0; i < 4; i++) d += c.ribbon(c.arc(c.rr(-3, 3), c.rr(-3, 3), r * c.rr(0.5, 0.9), r * c.rr(0.4, 0.8), c.rr(0, PI), c.rr(PI * 1.4, PI * 2.4), 10), 3.2);
  s.p(c.cut(c.blob(0, 0, r * 0.7, r * 0.6, 9, 0.3), 0.6, 3) + d, col);
  s.x(c.poly([[-r * 0.3, -r * 0.1], [-r * 0.1, -r * 0.3], [0, 0]]) + c.poly([[r * 0.3, -r * 0.1], [r * 0.1, -r * 0.3], [0, 0]]), shade(col, 0.3), 'opacity=".6"');
  return s.out();
}

/* ================================================================== the mustard garden */
/** Mark 4's garden vegetables */
export function cabbage(c, x, y, r) {
  const s = sheet();
  s.p(c.cut(c.blob(x, y - r * 0.55, r * 1.25, r * 0.6, 12, 0.2), 0.7, 5), C.moss);
  s.p(c.cut(c.blob(x, y - r * 0.8, r * 0.9, r * 0.75, 12, 0.12), 0.5, 5), C.sage);
  s.p(c.cut(c.blob(x + r * 0.1, y - r * 0.95, r * 0.55, r * 0.5, 10, 0.1), 0.4, 4), C.sage3);
  s.x(c.ribbon([[x - r * 0.5, y - r * 0.5], [x - r * 0.1, y - r * 1.1]], 1.4) + c.ribbon([[x + r * 0.6, y - r * 0.5], [x + r * 0.25, y - r * 1.05]], 1.4), shade(C.sage, 0.3), 'opacity=".8"');
  return s.out();
}
export function leek(c, x, y, h) {
  const s = sheet();
  let lv = '';
  for (let i = 0; i < 4; i++) {
    const a = (i - 1.5) * 0.35, L = h * c.rr(0.55, 0.8);
    lv += c.ribbon(c.qbez([x, y - h * 0.35], [x + Math.sin(a) * L * 0.5, y - h * 0.35 - L * 0.7], [x + Math.sin(a) * L * 1.1, y - h * 0.35 - L * 0.9 + Math.abs(a) * 30], 8), (t) => 7 - t * 5);
  }
  s.p(lv, C.moss2);
  s.p(c.cut(c.rect(x - 6, y - h * 0.4, 12, h * 0.4 + 2), 0.3, 5), C.linen);
  s.x(c.poly(c.rect(x - 6, y - h * 0.42, 12, 6)), C.sage2);
  return s.out();
}
export function onion(c, x, y, s0 = 1) {
  const s = sheet();
  let st = '';
  for (let i = 0; i < 3; i++) st += c.ribbon(c.qbez([x, y - 18 * s0], [x + (i - 1) * 6, y - 40 * s0], [x + (i - 1) * 14, y - 58 * s0], 6), (t) => 3.2 - t * 2.2);
  s.p(st, C.leaf);
  s.p(c.cut([[x - 14 * s0, y], ...c.arc(x, y - 6 * s0, 14 * s0, 14 * s0, PI, 2 * PI, 10), [x + 14 * s0, y], [x, y + 2]], 0.3, 4), C.plumRobe);
  s.x(c.ribbon([[x - 4 * s0, y - 16 * s0], [x - 6 * s0, y - 2 * s0]], 1.2), shade(C.plumRobe, 0.35), 'opacity=".7"');
  return s.out();
}
export function nest(c) {
  const s = sheet();
  s.p(c.cut([[-26, -4], [26, -4], [20, 10], [0, 15], [-20, 10]], 1.2, 4), C.wood3);
  let tw = '';
  for (let i = 0; i < 7; i++) tw += c.ribbon([[-24 + i * 7, -3 + c.rr(-2, 2)], [-16 + i * 7, 9 + c.rr(-2, 2)]], 1.3);
  s.x(tw + c.ribbon(c.arc(0, 0, 25, 6, 0.1, PI - 0.1, 8), 1.4), C.wood2, 'opacity=".8"');
  return s.out();
}
/**
 * the mustard tree of Mark 4 (things.js mustardTree), drawn here so it also tells where its branches end:
 * returns { markup, ends: [[x, y]…] } — .trunk, .branch[data-i] > .grow (scale from the fork), .crown > .grow.
 */
export function mustardTree2(c, { h = 380 } = {}) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-10, -h * 0.35], [-4, -h * 0.55], [6, -h * 0.55], [12, -h * 0.35], [18, 0]], 0.8, 8), C.wood2);
  const branches = [], ends = [];
  const spec = [[-0.35, -0.9, 0.55], [0.4, 0.8, 0.5], [-0.5, -1.4, 0.62], [0.52, 1.35, 0.6], [-0.62, -0.55, 0.7], [0.66, 0.5, 0.7], [-0.8, -0.2, 0.9], [0.82, 0.15, 0.92], [-0.1, -0.2, 0.95], [0.12, 0.3, 0.98]];
  spec.forEach(([, dir, f], i) => {
    const by = -h * (0.32 + f * 0.25), len = h * c.rr(0.34, 0.46);
    const end = [dir * len * 0.9, by - len * c.rr(0.5, 0.8)];
    const pts = c.qbez([0, by], [end[0] * 0.3, by - len * 0.5], end, 10);
    ends.push({ x: pts[6][0], y: pts[6][1], by });
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
  return { markup: `<g class="trunk">${s.out()}</g>${branches.join('')}<g class="crown" transform="translate(0 ${-h * 0.8})"><g class="grow"><g transform="translate(0 ${h * 0.8})">${crown}</g></g></g>`, ends };
}
/** the mustard seed, drawn at true relative size (Mark 4) */
export function mustardSeed(c) {
  return sheet().x(c.poly(c.circ(0, 0, 2.4, 22)), mix(C.sunDeep, C.wood2, 0.3)).x(c.poly(c.circ(0.9, 0.7, 1.2, 14)), C.sunDeep).x(c.poly(c.circ(-0.3, 1.5, 0.35, 8)), C.soilDark).out();
}
/** a magnifying glass (Mark 4): a wooden handle, an ochre rim, a pale lens with `inner` */
export function magnifier(c, inner) {
  const s = sheet();
  s.p(c.ribbon([[44, 44], [92, 92]], 13), C.wood2);
  s.p(c.cut(c.circ(0, 0, 66, 40), 0.3, 5), C.ochre);
  s.x(c.poly(c.circ(0, 0, 57, 40)), C.skyVeil, 'opacity=".92"');
  return s.out() + `<g>${inner}</g><path d="${c.ribbon(c.arc(0, 0, 44, 44, PI * 1.1, PI * 1.45, 8), 6)}" fill="${C.cream}" opacity=".75"/>`;
}

/* ================================================================== the leaven */
/** a sack of flour (origin: bottom centre) */
export function flourSack(c, w = 70, h = 80, col = C.linen2) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 - 4, -h * 0.5], [-w * 0.4, -h * 0.9], [-w * 0.2, -h], [-w * 0.26, -h - 14], [w * 0.26, -h - 14], [w * 0.2, -h], [w * 0.4, -h * 0.9], [w / 2 + 4, -h * 0.5], [w / 2, 0]], 0.6, 6), col);
  s.p(c.ribbon([[-w * 0.22, -h], [w * 0.22, -h]], 4), C.rope);
  s.x(c.ribbon([[-w * 0.3, -h * 0.4], [-w * 0.1, -h * 0.7]], 1.4) + c.ribbon([[w * 0.2, -h * 0.3], [w * 0.3, -h * 0.6]], 1.4), shade(col, -0.15), 'opacity=".7"');
  return s.out();
}
/** a great kneading trough whose dough (.dough, origin its bottom centre) can swell upward; origin bottom centre */
export function trough(c, w = 330, h = 70) {
  const dough = sheet();
  const pts = [[-w * 0.45, 0], ...c.arc(0, 0, w * 0.45, h * 0.9, PI, 2 * PI, 22).map(([x, y]) => [x + c.rr(-2, 2), y + c.rr(-2, 1)]), [w * 0.45, 0]];
  dough.p(c.cut(pts, 0.8, 5), '#f4dcae');
  dough.p(c.cut(pts.map(([x, y]) => [x * 0.82, y * 0.72]), 0.6, 5), '#f9e9c8');
  let bub = '';
  for (let i = 0; i < 16; i++) bub += c.cut(c.circ(c.rr(-w * 0.34, w * 0.34), -c.rr(6, h * 0.6), c.rr(2.5, 6), 8), 0.2, 2);
  dough.x(bub, '#e2c690');
  const s = sheet();
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2 - 26, 0], [-w / 2 + 26, 0]], 0.5, 8), C.wood);
  s.x(c.ribbon([[-w / 2 + 8, -h + 12], [w / 2 - 8, -h + 12]], 3) + c.ribbon([[-w / 2 + 18, -h * 0.4], [w / 2 - 18, -h * 0.4]], 2), shade(C.wood, -0.2), 'opacity=".6"');
  s.p(c.cut(c.rect(-w / 2 + 30, -4, 20, 14), 0.3, 4) + c.cut(c.rect(w / 2 - 50, -4, 20, 14), 0.3, 4), C.wood2);
  return { dough: dough.out(), box: s.out(), rimY: -h };
}
/** a little lump of leaven (origin centre) */
export function leaven(c, r = 12) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.8, 10, 0.2), 0.5, 3), mix('#e2cda6', C.clay, 0.25)).x(c.poly(c.circ(-r * 0.3, -r * 0.2, r * 0.18, 6)) + c.poly(c.circ(r * 0.3, r * 0.1, r * 0.14, 6)), shade(C.clay, -0.1)).out();
}
/** a clay oven (tannur) with a glowing mouth (origin: bottom centre) */
export function oven(c, w = 110, h = 90) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.42, -h * 0.7], [-w * 0.24, -h], [w * 0.24, -h], [w * 0.42, -h * 0.7], [w / 2, 0]], 0.6, 6), C.clay);
  s.p(c.cut([[-w * 0.18, 0], [-w * 0.18, -h * 0.28], ...c.arc(0, -h * 0.28, w * 0.18, h * 0.16, PI, 2 * PI, 8), [w * 0.18, 0]], 0.3, 4), C.sunDeep);
  s.x(c.poly(c.ell(0, -h * 0.12, w * 0.1, h * 0.08, 8)), C.lampFlame);
  return `<circle cy="${-h * 0.2}" r="${w * 0.8}" fill="url(#warm-glow)" opacity=".5"/>` + s.out();
}

/* ================================================================== treasure, pearls, the net */
/** a treasure chest; the lid (.lid) hinges at its back-left corner; .glow inside. Origin: bottom centre */
export function chest(c, { w = 90, h = 50 } = {}) {
  const b = sheet();
  b.p(c.cut(c.rect(-w / 2, -h, w, h), 0.5, 6), C.wood3);
  b.p(c.cut(c.rect(-w / 2, -h, w, 6), 0.3, 6), shade(C.wood3, -0.2));
  b.p(c.cut(c.rect(-w * 0.36, -h, 8, h), 0.3, 5) + c.cut(c.rect(w * 0.36 - 8, -h, 8, h), 0.3, 5), C.ochre);
  b.p(c.cut(c.rect(-7, -h * 0.62, 14, 14), 0.2, 3), C.sun);
  const lid = sheet();
  lid.p(c.cut([[0, 0], ...c.arc(w / 2, 0, w / 2 + 1, h * 0.42, PI, 2 * PI, 12), [w + 2, 0], [w + 2, 4], [0, 4]], 0.4, 6), C.wood);
  lid.p(c.cut(c.rect(w * 0.14, -h * 0.34, 8, h * 0.36), 0.3, 4) + c.cut(c.rect(w * 0.86 - 8, -h * 0.34, 8, h * 0.36), 0.3, 4), C.ochre);
  const coins = sheet();
  let d = '';
  for (let i = 0; i < 14; i++) d += c.cut(c.circ(c.rr(-w * 0.38, w * 0.38), -h - c.rr(0, 12), c.rr(5, 8), 10), 0.2, 3);
  coins.p(d, C.sun);
  coins.p(c.cut([[-8, -h - 8], [0, -h - 22], [8, -h - 8], [0, -h - 2]], 0.2, 3), C.lavender);
  return `<g class="glow" opacity="0"><circle cy="${-h}" r="${w * 1.5}" fill="url(#warm-glow)"/></g>${coins.out()}${b.out()}<g class="lid" transform="translate(${-w / 2 - 1} ${-h})">${lid.out()}</g>`;
}
/** a market stall with an awning (origin: bottom centre); tray of pearls on its counter */
export function stall(c, { w = 260, h = 200, awn = C.terracotta } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, 10, h), 0.3, 6) + c.cut(c.rect(w / 2 - 10, -h, 10, h), 0.3, 6), C.wood2);
  s.p(c.cut(c.rect(-w / 2, -74, w, 74), 0.5, 8), C.wood);
  s.p(c.cut(c.rect(-w / 2 - 6, -80, w + 12, 10), 0.3, 6), C.wood3);
  const aw = [[-w / 2 - 20, -h + 30], [w / 2 + 20, -h + 30], [w / 2 + 10, -h - 10], [-w / 2 - 10, -h - 10]];
  s.p(c.cut(aw, 0.5, 8), awn);
  let str = '';
  for (let x = -w / 2; x < w / 2; x += 40) str += c.cut([[x, -h + 30], [x + 20, -h + 30], [x + 16, -h - 10], [x + 4, -h - 10]], 0.2, 4);
  s.x(str, C.cream, 'opacity=".7"');
  let sc = '';
  for (let x = -w / 2 - 20; x < w / 2 + 20; x += 28) sc += c.cut([...c.arc(x + 14, -h + 30, 14, 12, 0, PI, 6)], 0.2, 4);
  s.p(sc, shade(awn, -0.15));
  return s.out();
}
/** a flat tray of little pearls (origin: centre of its rim) */
export function pearlTray(c, w = 80, n = 9) {
  const s = sheet().p(c.cut([[-w / 2, -4], [w / 2, -4], [w / 2 - 8, 6], [-w / 2 + 8, 6]], 0.3, 4), C.wood3).out();
  let p = '';
  for (let i = 0; i < n; i++) p += `<circle cx="${(-w / 2 + 10 + (i / (n - 1)) * (w - 20)).toFixed(1)}" cy="${(-7 - (i % 2) * 3).toFixed(1)}" r="4" fill="#f4eee2" stroke="${C.stone2}" stroke-width=".7"/>`;
  return s + p;
}
/** a dragnet: a curved mesh sheet with floats on top and sinkers below (origin: top centre) */
export function dragnet(c, w = 640, h = 170, col = C.rope) {
  let d = '';
  const n = 16, m = 6;
  const top = (u) => [-w / 2 + u * w, Math.sin(u * PI) * 16];
  const bot = (u) => [-w / 2 + 40 + u * (w - 80), h + Math.sin(u * PI) * 60];
  for (let i = 0; i <= n; i++) { const u = i / n; d += c.ribbon([top(u), bot(u)], 1.6); }
  for (let j = 0; j <= m; j++) { const k = j / m, pts = []; for (let i = 0; i <= n; i++) { const u = i / n, a = top(u), b = bot(u); pts.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]); } d += c.ribbon(pts, 1.4); }
  let floats = '', sinks = '';
  for (let i = 0; i <= n; i += 2) { const [x, y] = top(i / n); floats += c.cut(c.ell(x, y, 8, 5, 8), 0.2, 3); const [bx, by] = bot(i / n); sinks += c.cut(c.circ(bx, by, 4, 8), 0.2, 3); }
  return `<path d="${d}" fill="${col}" opacity=".9"/><path d="${floats}" fill="${C.wood3}"/><path d="${sinks}" fill="${C.rock3}"/>`;
}
/** a bad, spoiled catch: a grey spiny fish (origin centre) */
export function badFish(c, col = mix(C.storm, C.rock3, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-22, 0], [-8, -8], [8, -9], [22, -2], [10, 7], [-6, 8], [-22, 0], [-30, -8], [-28, 0], [-30, 8]], 0.6, 4), col);
  s.p(c.cut([[-8, -8], [-4, -16], [0, -9], [4, -15], [8, -9]], 0.3, 3), shade(col, -0.2));
  s.x(c.poly(c.circ(13, -3, 1.6, 6)), C.cream);
  return s.out();
}
/** a clay storage jar (origin: bottom centre) */
export function storeJar(c, h = 60, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-h * 0.2, 0], [-h * 0.34, -h * 0.4], [-h * 0.24, -h * 0.82], [-h * 0.14, -h * 0.88], [-h * 0.16, -h], [h * 0.16, -h], [h * 0.14, -h * 0.88], [h * 0.24, -h * 0.82], [h * 0.34, -h * 0.4], [h * 0.2, 0]], 0.4, 5), col);
  s.x(c.ribbon([[-h * 0.3, -h * 0.5], [h * 0.3, -h * 0.5]], 2), shade(col, -0.22), 'opacity=".7"');
  return s.out();
}

/* ================================================================== the storeroom: things new and old */
/** an old scroll tied with a cord (origin centre) */
export function oldScroll(c, w = 70) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -12, w, 24), 0.4, 5), mix(C.parchment, C.dune, 0.4));
  s.p(c.cut(c.ell(-w / 2, 0, 6, 12, 10), 0.3, 3) + c.cut(c.ell(w / 2, 0, 6, 12, 10), 0.3, 3), shade(mix(C.parchment, C.dune, 0.4), -0.15));
  s.p(c.ribbon([[-4, -13], [-4, 13]], 3.2), C.terracotta);
  return s.out();
}
/** a new cup of wine / a fresh loaf / a fresh bunch of grapes — small still things (origin centre) */
export function grapes(c, r = 7, col = C.plumRobe) {
  const s = sheet();
  let d = '';
  [[0, 0], [-r, -r * 0.3], [r, -r * 0.3], [-r * 0.5, r * 1.1], [r * 0.5, r * 1.1], [0, r * 2.1], [-r * 1.6, -r * 1.2], [0, -r * 1.3], [r * 1.6, -r * 1.2]].forEach(([x, y]) => { d += c.cut(c.circ(x, y, r * 0.78, 10), 0.2, 3); });
  s.p(d, col);
  s.p(c.cut([[0, -r * 2.2], [-r * 1.8, -r * 3], [-r * 0.4, -r * 1.8]], 0.3, 3), C.leaf);
  s.x(c.ribbon([[0, -r * 2], [r * 0.4, -r * 3.2]], 1.6), C.wood2);
  return s.out();
}
