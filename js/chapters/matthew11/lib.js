// Matthew 11 — the cast and cut-outs of this chapter: the green hills of Galilee with their towns, a lakeside street
// and a market square, John's prison, the Jordan and its reeds, the wilderness, Herod's palace over its dungeon, the
// golden gate of the Kingdom, the chariot of fire, Tyre and Sidon by the sea, Capernaum raised up and brought down,
// the balance of the day of judgment, the light of the Father (never a figure), the yoke and the burdens.
// John, his disciples, the sick and the scribes are the earlier chapters' cut-outs, so everyone looks the same
// throughout the Gospels. Everything returns SVG markup cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, town, house, sun, cloud, grass, olive, cypress, bush, flowers, palm, rock, reeds } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { es } from '../../core/anim.js';
import { scrub, acacia } from '../mark1/lib.js';
import { pose3 } from '../matthew4/lib.js';
import { childPerson } from '../matthew2/lib.js';
import { awning } from '../mark6/lib.js';
import { DAY } from '../matthew8/lib.js';

export { JOHN_B, LEPER, LEPER_HEALED, leperSpots, crutch, voiceRings, hang2, sparkle, prisonWall, bars, signpost, handLamp, scrub, acacia } from '../mark1/lib.js';
export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, wordSlip, spark, heart, coin, coinStack, loaf, cup, bowl, jug, lowTable, johnsOpts, tambourine, scribe, scrollRolled, scrollOpen } from '../mark2/lib.js';
export { bubble, cry, tag, flute, lyingPerson } from '../mark5/lib.js';
export { pharisee, strip, question, nameTag, TWELVE } from '../mark3/lib.js';
export { LOOK as L6, crown, throne, awning, sheep, storyFrame, SEPIA, labelTag } from '../mark6/lib.js';
export { LOOK as L9 } from '../mark9/lib.js';
export { lawTablets } from '../mark10/lib.js';
export { kingdomGate, gateDoor, harp } from '../mark12/lib.js';
export { glory, globe, soulLight, emptyBowl } from '../mark8/lib.js';
export { MOSES, rayBurst, glowDisc, radiance, hungWord, goldWord } from '../john1/lib.js';
export { blindBand } from '../john5/lib.js';
export { folk, group } from '../john6/lib.js';
export { scalesParts, poseScales } from '../john8/lib.js';
export { fatherLight } from '../john17/lib.js';
export { ISAIAH, ABRAHAM, DAVID } from '../matthew1/lib.js';
export { childPerson } from '../matthew2/lib.js';
export { child as childOpts, riverSet, locust, honeycomb } from '../matthew3/lib.js';
export { pose3, bakeArms, tiltHead, folk4, addScroll, setScroll, goldSlip, lightShaft } from '../matthew4/lib.js';
export { BEGGAR, secretShaft, plateBoard } from '../matthew6/lib.js';
export { hangAt, along, mob, DAY, MORNING, GOLDEN, DUSK, NIGHT, KINGDOM } from '../matthew8/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const DESERT = ['#cfdcd4', '#f1dfbf', '#f7e3c2'];
export const PRISON = ['#6f6a8f', '#c79a8e', '#ecc29c'];       // dusk over Machaerus
export const SEA = ['#bcd8d8', '#e6ecdc', '#f5ead0'];          // the bright Phoenician coast
export const GLOOM = ['#4b4660', '#7b6f80', '#a8928c'];        // woe
export const HEAVEN = ['#f2cf8e', '#f8e0b0', '#fbeed2'];
export const EVENING = ['#b49cb4', '#ecb898', '#f6d7ae'];      // the finale's golden evening

/* ================================================================== the cast */
/** John's two disciples (Mark 2's rough camel-hair robes), fixed so they look the same in every scene */
export const JD = [
  { robe: mix(C.dune, C.sand2, 0.5), fur: true, hair: C.hair3, hairStyle: 'wild', beard: 'full', skin: C.skin3, belt: C.leather },
  { robe: C.dune, fur: true, mantle: mix(C.wood3, C.dune, 0.5), hair: C.hair, hairStyle: 'short', beard: 'wild', skin: C.skin2, belt: C.leather },
];
/** a courtier in soft clothing */
export const COURTIER = { robe: mix(C.roseRobe, C.cream, 0.35), mantle: C.lavender, belt: C.sun, skin: C.skin, hair: C.hair3, hairStyle: 'curly', beard: 'short', mantleArm: true };
export const COURTIERS = [
  COURTIER,
  { robe: mix(C.skyVeil, C.cream, 0.3), mantle: mix(C.plumRobe, C.roseRobe, 0.4), belt: C.sun, skin: C.skin2, hair: C.hair2, hairStyle: 'short', beard: 'none' },
  { robe: mix(C.peach, C.cream, 0.3), mantle: C.teal2, belt: C.ochre, skin: C.skin3, hair: C.hair3, hairStyle: 'wrap', veil: C.sun, veil2: C.ochre, beard: 'full' },
  { robe: C.blushVeil, mantle: C.plumRobe, belt: C.sun, skin: C.skin, hairStyle: 'veil', veil: mix(C.lavender, C.cream, 0.3), beard: 'none' },
];
export const HEROD = { robe: C.plumRobe, mantle: C.terracotta, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full', beardColor: C.hair3 };
/** the sick of v5 and their healed selves */
export const BLIND = { robe: mix(C.stone2, C.dustyBlue, 0.3), mantle: null, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.rope };
export const LAME = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather };
export const DEAF = { robe: C.ochreRobe, mantle: C.clayMantle, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin4, belt: null };
export const YOUTH = { robe: C.linen, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin };
export const WIDOW = { robe: mix(C.stone2, C.plumRobe, 0.3), hairStyle: 'veil', veil: mix(C.storm, C.stone2, 0.5), veil2: mix(C.storm2, C.stone2, 0.4), skin: C.skin2, hair: C.hair, beard: 'none' };
/** people in sackcloth */
export const SACK = mix(C.soil, C.sand2, 0.45);
export function penitent(c, i = 0) {
  const woman = i % 3 === 1;
  return {
    robe: i % 2 ? SACK : shade(SACK, 0.08), mantle: null, belt: C.rope, skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4], hair: [C.hair, C.hair3, C.greyHair][i % 3],
    hairStyle: woman ? 'veil' : ['short', 'curly', 'wrap'][i % 3], veil: shade(SACK, -0.1), veil2: shade(SACK, -0.2), beard: woman ? 'none' : ['full', 'short'][i % 2],
  };
}
/** a man / a woman of the crowd */
export function manOf(c, extra = {}) { const o = crowdPerson(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }
export function womanOf(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }
/** a child (big-headed cut-out of Matthew 2) with one of Matthew 3's looks; use s ≈ 0.5 */
export const KID_LOOKS = [
  { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin, hair: C.hair2, beard: 'none' },
  { robe: C.skyVeil, hairStyle: 'curly', skin: C.skin3, hair: C.hair3, beard: 'none', belt: C.ochre },
  { robe: C.wheatRobe, hairStyle: 'short', skin: C.skin2, hair: C.hair, beard: 'none' },
  { robe: C.sageRobe, hairStyle: 'veil', veil: C.linen2, skin: C.skin4, hair: C.hair3, beard: 'none', belt: C.ochre },
  { robe: C.mauve, hairStyle: 'curly', skin: C.skin, hair: C.hair2, beard: 'none' },
  { robe: C.tealRobe, hairStyle: 'short', skin: C.skin3, hair: C.hair3, beard: 'none', belt: C.leather },
  { robe: C.ochreRobe, hairStyle: 'veil', veil: C.skyVeil, skin: C.skin2, hair: C.hair, beard: 'none' },
  { robe: C.clayMantle, hairStyle: 'short', skin: C.skin4, hair: C.hair3, beard: 'none', belt: C.ochre },
];
export const kid = (c, i, extra = {}) => childPerson(c, { ...KID_LOOKS[i % KID_LOOKS.length], ...extra });

/* ================================================================== small helpers */
/** head centre of a child cut-out (childPerson) at scale s */
export const kidHead = (x, y, s, flip = false, dy = 0) => [x + (flip ? -2 : 2) * s, y + (-158 + dy - 6) * s];
/** pop-in: eased 0 → 1 (overshooting) at a, back to 0 at b */
export const popIn = (t, a, b, d = 0.18) => es(t, a, a + d, (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2)) * (1 - es(t, b - 0.1, b));

/* ================================================================== sets */
/**
 * Green Galilee: sky (and an optional second sky above it, faded out), the sun and clouds on strings, far hills and
 * the lake, mid hills with villages, the near meadow (par `par`). Returns handles and update(time).
 */
export function hillsSet(S, { skyCols = DAY, sky2 = null, sunAt = [1230, 150], lake = true, gy = 700, par = 0.5, midY = 520, villages = true, clouds = true, meadow = mix(C.sage2, C.hillNear, 0.5) } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }).layer : null;
  if (sk2) sk2.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = clouds ? [[640, 215, 190], [1020, 175, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) })) : [];
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: midY - 110, amps: [14, 6, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup);
  if (lake) far.add(waterBand(c, { y: midY - 84, color: mix(C.lake, C.skyBlue, 0.25), foamN: 18, bottom: 900 }).markup);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const mh = hillsWith(c, { y: midY, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
  mid.add(mh.markup + (villages ? town(c, { x: 330, y: mh.fn(330) + 10, n: 6, spread: 220, sc: 0.5 }) + town(c, { x: 1290, y: mh.fn(1290) + 10, n: 7, spread: 260, sc: 0.55 }) : ''));
  const G = S.layer({ par, sh: 3 });
  const gfn = c.wave(gy, [5, 2], [700, 180]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), meadow).out());
  G.add(grass(c, { x0: -900, x1: 2500, y: gy, fn: gfn, n: 56, h: 14, color: C.moss }) + flowers(c, { x0: 200, x1: 1400, y: gy, fn: (x) => gfn(x) + 26, n: 16 }));
  return {
    c, sk, sk2, hangL, sunEl, far, mid, mfn: mh.fn, G, gfn,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: time ? Math.sin(time * 0.6) : 0, o });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + (time ? Math.sin(time * 0.1 + cl.i) * 20 : 0), y: cl.y, r: time ? Math.sin(time * 0.6 + cl.i) * 1.2 : 0, o }));
    },
  };
}

/**
 * A lakeside street of a Galilean town: sky, the lake and far shore, hills, a row of flat-roofed houses (par .3)
 * with a gap in the middle (for the view of the lake), the paved street (par `par`, top at gy). market: awnings.
 */
export function townSet(S, { skyCols = DAY, sunAt = [1230, 140], gy = 660, par = 0.45, market = false, gap = [560, 1040] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[520, 130, 170], [940, 96, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 400, amps: [14, 6, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup + waterBand(c, { y: 432, color: mix(C.lake, C.skyBlue, 0.2), foamN: 16, bottom: 900 }).markup);
  const hl = S.layer({ par: 0.16, sh: 3 });
  const hw = hillsWith(c, { y: 506, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
  hl.add(hw.markup);
  const row = S.layer({ par: 0.3, sh: 4 });
  const base = gy - 36;
  let hs = '';
  const spots = [[-700, 150, 112], [-500, 130, 96], [-300, 160, 126], [-80, 130, 100], [110, 150, 118], [300, 140, 104], [470, 120, 92], [1070, 150, 120], [1250, 130, 100], [1420, 160, 124], [1620, 140, 104], [1810, 150, 116], [2000, 130, 98]];
  spots.forEach(([x, w, h], i) => {
    if (x + w > gap[0] && x < gap[1]) return;
    hs += house(c, x, base + (i % 2) * 4, w, h, { wall: i % 3 === 1 ? C.plaster2 : C.plaster, shadow: shade(C.plaster2, -0.06), stairs: i % 2 === 0 });
  });
  row.add(hs + palm(c, 600, base + 4, 190) + olive(c, 1010, base + 8, 0.72));
  if (market) row.add(`<g transform="translate(360 ${base + 6})">${awning(c, 190, 130, C.terracotta)}</g><g transform="translate(1210 ${base + 6})">${awning(c, 200, 136, C.teal2)}</g>`);
  const G = S.layer({ par, sh: 3 });
  const gfn = c.wave(gy, [3, 1.5], [700, 180]);
  const gs = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.3));
  let stones = '';
  for (let k = 0; k < 80; k++) { const px = c.rr(-700, 2300), py = c.rr(gy + 20, 1000); stones += c.cut(c.blob(px, py, c.rr(8, 18), c.rr(4, 8), 8, 0.2), 0.4, 4); }
  gs.x(stones, C.sand2, 'opacity=".7"');
  G.add(gs.out());
  return {
    c, sk, hangL, sunEl, far, row, G, gfn,
    update(time) {
      pose(sunEl, { x: sunAt[0], y: sunAt[1], r: time ? Math.sin(time * 0.6) : 0 });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + (time ? Math.sin(time * 0.1 + cl.i) * 20 : 0), y: cl.y, r: time ? Math.sin(time * 0.6 + cl.i) * 1.2 : 0 }));
    },
  };
}

/** the Judean wilderness: pale sky, violet mountains, dunes, rocks and scrub; the floor (par `par`) at gy */
export function wildSet(S, { skyCols = DESERT, sunAt = [1240, 150], gy = 700, par = 0.45 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cl = hanging(hangL, cloud(c, 150), { x: 720, y: 200, len: 900 });
  S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 440, amps: [24, 9, 3], lens: [900, 330, 120], color: mix(C.duskViolet, C.dune, 0.45) }).markup);
  const mid = S.layer({ par: 0.18, sh: 3 });
  mid.add(band(c, { y: 530, amps: [16, 7, 3], lens: [800, 300, 110], color: mix(C.dune, C.sand2, 0.4) }).markup + scrub(c, 300, 540, 22) + scrub(c, 1260, 548, 26) + acacia(c, 1100, 560, 0.7));
  const G = S.layer({ par, sh: 3 });
  const gfn = c.wave(gy, [6, 3], [700, 200]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.5)).out());
  G.add(rock(c, 240, gy + 30, 110, 40, C.rock2) + rock(c, 1420, gy + 20, 90, 34, C.rock) + scrub(c, 520, gy + 6, 30) + scrub(c, 1150, gy + 10, 26));
  return {
    c, sk, hangL, sunEl, mid, G, gfn,
    update(time) {
      pose(sunEl, { x: sunAt[0], y: sunAt[1], r: time ? Math.sin(time * 0.6) : 0 });
      pose(cl, { x: 720 + (time ? Math.sin(time * 0.1) * 20 : 0), y: 200, r: time ? Math.sin(time * 0.6 + 1) * 1.2 : 0 });
    },
  };
}

/* ================================================================== drawings */
/** a clump of reeds with plumes (origin: its foot) — pose() rotates it about the root */
export function reedClump(c, { n = 8, h = 200, col = C.olive, head = C.wood3 } = {}) {
  return reeds(c, 0, 0, n, h, col, head);
}
/** a stumbling-stone (origin: where it rests) */
export function stumbleStone(c, w = 46) {
  return sheet().p(c.cut(c.blob(0, -w * 0.3, w / 2, w * 0.32, 11, 0.16), 0.9, 5), C.rock2).x(c.ribbon(c.arc(-4, -w * 0.34, w * 0.3, w * 0.18, 3.6, 5.2, 8), 2.4), shade(C.rock2, 0.3), 'opacity=".6"').out();
}
/** a bier: a flat litter on two poles (origin: floor centre; the mattress top is at -34) */
export function bier(c, w = 210) {
  const s = sheet();
  s.p(c.cut([[-w / 2 + 16, 0], [-w / 2 + 22, -30], [-w / 2 + 30, -30], [-w / 2 + 26, 0]], 0.3, 4) + c.cut([[w / 2 - 26, 0], [w / 2 - 30, -30], [w / 2 - 22, -30], [w / 2 - 16, 0]], 0.3, 4), C.wood2);
  s.p(c.cut([[-w / 2 - 20, -30], [w / 2 + 20, -30], [w / 2 + 20, -38], [-w / 2 - 20, -38]], 0.3, 8), C.wood);
  s.p(c.cut([[-w / 2, -36], [w / 2, -36], [w / 2 - 4, -44], [-w / 2 + 4, -44]], 0.4, 8), C.linen2);
  return s.out();
}
/** a linen shroud laid over a lying body (origin: middle of the mattress top) */
export function shroud(c, w = 170) {
  return sheet().p(c.cut([[-w / 2, 0], [-w / 2 + 10, -18], [-w * 0.1, -24], [w * 0.3, -20], [w / 2 - 20, -14], [w / 2 - 6, 0]], 0.6, 6), C.linen).x(c.ribbon([[-w * 0.3, -14], [w * 0.2, -12]], 1.6), C.linen2).out();
}
/** a big ear glyph (origin centre) */
export function earGlyph(c, r = 22, col = C.skin) {
  const s = sheet();
  s.p(c.cut([[0, -r], [r * 0.7, -r * 0.8], [r * 0.95, -r * 0.2], [r * 0.7, r * 0.4], [r * 0.3, r * 0.75], [0, r], [-r * 0.3, r * 0.8], [-r * 0.1, r * 0.4], [-r * 0.4, 0], [-r * 0.45, -r * 0.6]], 0.3, 4), col);
  s.x(c.ribbon(c.qbez([-r * 0.15, -r * 0.5], [r * 0.6, -r * 0.6], [r * 0.3, 0], 8), r * 0.16), shade(col, -0.25));
  return s.out();
}
/** an open eye glyph (origin centre) */
export function eyeGlyph(c, r = 22, { iris = C.teal2 } = {}) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, r * 0.5, r * 1.1, r * 0.95, PI * 1.18, PI * 1.82, 10), ...c.arc(0, -r * 0.5, r * 1.1, r * 0.95, PI * 0.18, PI * 0.82, 10)], 0.3, 4), C.linen);
  s.p(c.cut(c.circ(0, 0, r * 0.42, 14), 0.2, 3), iris);
  s.x(c.poly(c.circ(0, 0, r * 0.2, 10)), C.ink);
  s.x(c.poly(c.circ(r * 0.12, -r * 0.12, r * 0.08, 6)), '#fff');
  return s.out();
}
/** a music note (origin centre) */
export function note(c, r = 9, col = C.teal2) {
  return sheet().p(c.cut(c.ell(0, 0, r, r * 0.72, 10, -0.4), 0.2, 3), col).p(c.ribbon([[r * 0.85, -1], [r * 0.9, -r * 3.4]], r * 0.28), col).p(c.cut([[r * 0.9, -r * 3.4], [r * 2, -r * 2.8], [r * 2, -r * 2.2], [r * 0.95, -r * 2.7]], 0.2, 3), col).out();
}
/** a tear drop (origin centre) */
export function tear(c, r = 5) {
  return `<path d="${c.cut([[0, -r * 1.8], [r, 0], [r * 0.6, r * 0.8], [-r * 0.6, r * 0.8], [-r, 0]], 0.1, 2)}" fill="#bfe0ee"/>`;
}
/** a stone plinth / step (origin: its top centre) */
export function plinth(c, w = 150, h = 60, col = C.stone) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), col);
  s.p(c.cut(c.rect(-w / 2 - 8, -6, w + 16, 12), 0.4, 8), shade(col, 0.1));
  s.p(c.cut([[w / 2, 6], [w / 2 + 16, 14], [w / 2 + 16, h + 4], [w / 2, h]], 0.4, 6), shade(col, -0.12));
  return s.out();
}
/** a wooden double yoke seen from the front: the beam and two bows (origin: centre of the beam) */
export function yoke(c, w = 300, { col = C.wood3, bow = C.wood2 } = {}) {
  const s = sheet();
  const beam = [];
  for (let i = 0; i <= 20; i++) { const u = i / 20, x = -w / 2 + u * w; beam.push([x, -Math.sin(u * PI) * 10 + (Math.abs(u - 0.25) < 0.1 || Math.abs(u - 0.75) < 0.1 ? 3 : 0)]); }
  s.p(c.ribbon(beam, 16), col);
  s.p(c.ribbon(c.arc(-w * 0.25, 4, 26, 34, 0.1, PI - 0.1, 12), 5) + c.ribbon(c.arc(w * 0.25, 4, 26, 34, 0.1, PI - 0.1, 12), 5), bow);
  s.p(c.cut(c.circ(-w * 0.25 - 26, 6, 4, 8), 0.2, 3) + c.cut(c.circ(-w * 0.25 + 26, 6, 4, 8), 0.2, 3) + c.cut(c.circ(w * 0.25 - 26, 6, 4, 8), 0.2, 3) + c.cut(c.circ(w * 0.25 + 26, 6, 4, 8), 0.2, 3), shade(col, -0.25));
  s.x(c.ribbon([[-w / 2 + 10, -2], [w / 2 - 10, -2]], 1.4), shade(col, -0.2), 'opacity=".5"');
  return s.out();
}
/** a load of firewood sticks tied with rope (origin: its centre) */
export function woodLoad(c, w = 110) {
  const s = sheet();
  let d = '';
  for (let i = 0; i < 7; i++) { const y = -14 + i * 4.5 + c.rr(-1, 1); d += c.ribbon([[-w / 2 + c.rr(-6, 6), y], [w / 2 + c.rr(-6, 6), y + c.rr(-3, 3)]], 6); }
  s.p(d, C.wood);
  s.x(c.ribbon([[-w * 0.25, -20], [-w * 0.22, 20]], 3) + c.ribbon([[w * 0.25, -20], [w * 0.22, 20]], 3), C.rope);
  return s.out();
}
/** a heavy grey bundle (origin: its bottom centre) */
export function greyBundle(c, r = 34, col = mix(C.stone2, C.storm, 0.3)) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -r * 0.8, r, r * 0.8, 14, 0.14), 0.8, 5), col);
  s.p(c.cut([[-8, -r * 1.55], [8, -r * 1.55], [4, -r * 1.3], [-4, -r * 1.3]], 0.3, 3), shade(col, -0.15));
  s.x(c.ribbon([[-r * 0.9, -r * 0.7], [r * 0.9, -r * 0.9]], 2.6) + c.ribbon([[-r * 0.1, -r * 1.5], [r * 0.2, -r * 0.1]], 2.4), mix(C.rope, C.stone2, 0.3));
  return s.out();
}
/** a basket full of stones (origin: bottom centre) */
export function stoneBasket(c, w = 70) {
  const s = sheet();
  let st = '';
  for (let i = 0; i < 6; i++) st += c.cut(c.blob(c.rr(-w * 0.32, w * 0.32), -w * 0.52 - c.rr(0, 12), c.rr(9, 14), c.rr(7, 10), 9, 0.2), 0.5, 4);
  s.p(st, C.rock2);
  s.p(c.cut([[-w / 2, -w * 0.5], [w / 2, -w * 0.5], [w * 0.38, 0], [-w * 0.38, 0]], 0.5, 6), C.basket);
  let weave = '';
  for (let y = -w * 0.5 + 8; y < -2; y += 8) weave += c.ribbon([[-w / 2 + 6, y], [w / 2 - 6, y]], 1.6);
  s.x(weave, shade(C.basket, -0.28), 'opacity=".6"');
  return s.out();
}
/** a big water jar (origin: bottom centre) */
export function bigJar(c, h = 70, col = C.pot) {
  const w = h * 0.62;
  const s = sheet();
  s.p(c.cut([[-w * 0.3, 0], [-w / 2, -h * 0.35], [-w * 0.44, -h * 0.72], [-w * 0.2, -h * 0.86], [-w * 0.2, -h], [w * 0.2, -h], [w * 0.2, -h * 0.86], [w * 0.44, -h * 0.72], [w / 2, -h * 0.35], [w * 0.3, 0]], 0.5, 5), col);
  s.x(c.ribbon([[-w * 0.44, -h * 0.5], [w * 0.44, -h * 0.5]], 2.4), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}
/** a paper lantern that floats (origin centre) */
export function lantern(c, r = 20, col = C.apricot) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, r * 0.8, r, 16), 0.4, 4), col);
  s.p(c.cut(c.rect(-r * 0.4, -r - 5, r * 0.8, 6), 0.2, 3) + c.cut(c.rect(-r * 0.4, r - 1, r * 0.8, 6), 0.2, 3), shade(col, -0.3));
  s.x(c.poly(c.ell(0, 2, r * 0.32, r * 0.55, 10)), C.lampGlow, 'opacity=".9"');
  return `<circle r="${r * 2.8}" fill="url(#warm-glow)" opacity=".9"/>${s.out()}`;
}
/** a small city seen from afar (for maps, pans and plates): walls, roofs, a tower; origin: base centre */
export function cityIcon(c, w = 90, { wall = C.plaster, wall2 = C.plaster2, roof = C.roof, tower = true, dome = false } = {}) {
  const s = sheet();
  const h = w * 0.34;
  let hs = '';
  for (let i = 0; i < 5; i++) { const x = -w / 2 + 6 + i * (w - 12) / 5, hh = h * c.rr(0.7, 1.3); hs += c.cut(c.rect(x, -h - hh * 0.6, (w - 12) / 5 - 3, hh * 0.6 + 4), 0.3, 4); }
  s.p(hs, wall);
  if (tower) s.p(c.cut(c.rect(w * 0.12, -h * 2.3, w * 0.16, h * 2.3), 0.3, 4), wall2);
  if (dome) s.p(c.cut(c.arc(-w * 0.14, -h * 1.1, w * 0.14, w * 0.14, PI, 2 * PI, 10), 0.3, 4), C.sun);
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.4, 6), wall2);
  let cren = '';
  for (let x = -w / 2; x < w / 2 - 4; x += 10) cren += c.cut(c.rect(x, -h - 6, 6, 7), 0.2, 3);
  s.p(cren, wall2);
  s.x(c.poly([[-5, 0], [-5, -h * 0.5], [0, -h * 0.66], [5, -h * 0.5], [5, 0]]), shade(wall2, -0.45));
  return s.out();
}
/** a Phoenician merchant ship with a purple square sail (origin: waterline centre) */
export function ship(c, w = 200, { sail = mix(C.plumRobe, C.roseRobe, 0.3), hull = C.wood2 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-3, -w * 0.9, 6, w * 0.9), 0.3, 8), C.wood2);
  s.p(c.cut([[-w * 0.34, -w * 0.82], [w * 0.34, -w * 0.84], [w * 0.3, -w * 0.3], [-w * 0.3, -w * 0.28]], 0.6, 7), sail);
  s.x(c.ribbon([[-w * 0.32, -w * 0.62], [w * 0.32, -w * 0.64]], 3) + c.ribbon([[-w * 0.31, -w * 0.46], [w * 0.31, -w * 0.47]], 3), C.cream, 'opacity=".6"');
  s.p(c.cut([[-w / 2, -w * 0.2], [-w * 0.42, -w * 0.1], [-w * 0.3, 0], [w * 0.3, 0], [w * 0.44, -w * 0.1], [w * 0.56, -w * 0.3], [w * 0.5, -w * 0.3], [w * 0.4, -w * 0.2]], 0.6, 7), hull);
  s.x(c.ribbon([[-w * 0.44, -w * 0.13], [w * 0.44, -w * 0.13]], 3), C.terracotta);
  return s.out();
}
/** a grey flake of ash (origin centre) */
export function ashFlake(c, r = 5) {
  return `<path d="${c.poly([[-r, 0], [-r * 0.2, -r * 0.5], [r, -r * 0.2], [r * 0.3, r * 0.5]])}" fill="${mix(C.stone2, C.storm, 0.35)}"/>`;
}
/** a pile of ash (origin: bottom centre) */
export function ashPile(c, w = 120) {
  return sheet().p(c.cut([[-w / 2, 0], [-w * 0.3, -w * 0.1], [0, -w * 0.16], [w * 0.3, -w * 0.1], [w / 2, 0]], 0.8, 6), mix(C.stone2, C.storm, 0.3)).x(c.ribbon([[-w * 0.3, -w * 0.06], [w * 0.2, -w * 0.08]], 2), mix(C.stone, C.storm, 0.1), 'opacity=".6"').out();
}

/** a crowd of n still people as one sprite markup, facing right (flip: left); centred on (0, 0) */
export function throng(c, n, { s = 0.8, flip = false, spread = 44, rows = 2, P = 'stand', arms = 20, men = null, kids = 0 } = {}) {
  const per = Math.ceil(n / rows);
  return pose3(c, Array.from({ length: n }, (_, i) => {
    const r = Math.floor(i / per), k = i % per;
    const o = men === true ? manOf(c) : men === false ? womanOf(c) : crowdPerson(c);
    return { x: (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + c.rr(-6, 6), y: r * 22 + c.rr(-3, 3), s: s * c.rr(0.92, 1.05) * (1 + r * 0.04), flip, head: c.rr(-6, 4), armF: c.rr(0, arms), o: { ...o, pose: P } };
  }));
}
