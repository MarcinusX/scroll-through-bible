// Luke 12 — the cast and cut-outs of this chapter. Most of it is Jesus speaking to "many thousands" and to His
// disciples, so the chapter keeps coming back to Luke 8's level plain (the same plain, the same crowd knots) and in
// between lets small painted flats and sets fly in for the sayings. New here: the brothers who quarrel over the
// inheritance, the rich farmer with his little barns and the great new ones, the ravens that have neither cellar nor
// barn, the little flock, the servants with their belts tied and their lamps lit, the house of five divided, the
// cloud from the west and the south wind. Everything else is borrowed from the same places in Mark and Matthew
// (the master's house of Mark 13, the market of Matthew 10, the lilies of Matthew 6, the road to the judge of Matthew 5).
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, house, palm as palmTree, olive, cypress, bush, rock, grass, flowers, sun, cloud } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { plainSet as plain8, plainCrowd as crowd8, RISE, SPOTS, plainS } from '../luke8/lib.js';
import { pose3 } from '../matthew4/lib.js';
import { folk } from '../john6/lib.js';
import { tint } from '../mark13/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, wordSlip, coin, loaf, cup, jug, dust, bowl, cloak } from '../mark2/lib.js';
export { voiceRings, sparkle, dove, flapWings, flame } from '../mark1/lib.js';
export { TWELVE as T12, LOOK as L3, nameTag, question, stoneHeart, handAt, withFace, faceBits, bubble, tapeX } from '../mark3/lib.js';
export { pharisee, angel, doughBowl, bubbleDot, soulLight, glory, globe, heavenPanel, lightCrown, bigQuestion, emptyBowl, staff } from '../mark8/lib.js';
export { mask, hourglass, handLamp, shadowScreen, tornPieces, roundel, oven, zzz, rooster, keyProp, well, word, houseSet, HOUSE, MASTER, SERVANTS, DOORKEEPER, tint, SKIES, plate as plate13 } from '../mark13/lib.js';
export { sparrow, balance as balance10, village, openHouse, hallSet, HALL, plateCard, hungStrip, drop } from '../matthew10/lib.js';
export { watchPlate, mattock, cudgel, wineJar, coinChest, silh, beamDown, crowdStrip, shadowGroup, lightMote, slipWord } from '../matthew24/lib.js';
export { weatherPlate, cloudBand, knot as ropeKnot } from '../matthew16/lib.js';
export { judgeSeat, prisonHouse, doorLeaf, beam, paintedLand, medallion, tagWord, wordCard } from '../matthew5/lib.js';
export { barn, moneyBag, coinsT, worryCloud, hourglassT, chest, flourSack, discPlate, gauze } from '../matthew13/lib.js';
export { lampBody, lampFire, smoke, WICK } from '../matthew25/lib.js';
export { kingdomDisc, knot, knotUp, still, alongPts, ROADS, RISE, SPOTS, plainS, tag, crossX, tick, hangAt, thoughtCloud, storyFrame, SEPIA } from '../luke8/lib.js';
export { figure, bake, manO, womanO } from '../luke4/lib.js';
export { flat, flatSky, flyTo, fig, flatHills, flatText, dropK } from '../luke1/lib.js';
export { pose3, folk, tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const DAY = ['#c6ddd9', '#ecebd6', '#f6ead0'];
export const MORNING = ['#cadfdb', '#eee5cc', '#f7ead3'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const EVENING = ['#a69abf', '#eab99c', '#f5d6b0'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const DEEP = ['#11163a', '#1f2757', '#39427a'];
export const GREY = ['#8f95a8', '#c3c1bd', '#dcd3c4'];
export const HEAT = ['#e9cf9c', '#f4dcae', '#f8e8c8'];
export const RAIN = ['#7f8aa0', '#a8adb4', '#cfc9bf'];

/* ================================================================== the cast */
/** the disciples who stand beside Him on the rise (always the same four) */
export const NEAR = [
  { k: 'peter', o: CAST.peter, dx: -170, dy: 18 },
  { k: 'andrew', o: CAST.andrew, dx: -92, dy: 10 },
  { k: 'john', o: CAST.john, dx: 92, dy: 10 },
  { k: 'james', o: CAST.james, dx: 170, dy: 18 },
];
/** the man in the crowd who wants his share, and his elder brother who holds the inheritance */
export const BRO_A = { robe: C.tealRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
export const BRO_B = { robe: C.plumRobe, mantle: C.ochreRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.ochre, beard: 'full', skin: C.skin3, belt: C.sun };
/** the rich farmer of the parable: a fine plum robe, a gold-banded turban, a gold belt */
export const RICH = { robe: C.wheatRobe, mantle: mix(C.plumRobe, C.terracotta, 0.2), mantleArm: true, hair: C.hair3, hairStyle: 'wrap', veil: mix(C.plumRobe, C.linen, 0.45), veil2: C.plumRobe, beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: C.sun };
/** his farm hands */
export const HANDS = [
  { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope },
  { robe: C.sageRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin4, belt: C.rope },
  { robe: C.dustyBlue, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.leather },
];
/** a poor neighbour (the one who is rich toward God) */
export const POOR = { robe: mix(C.stone2, C.sand2, 0.35), mantle: null, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
/** the steward of the master's household (the same man as in Matthew 24) */
export { STEWARD } from '../matthew24/lib.js';
/** the house of five: father, mother (the mother-in-law), son, daughter, son's wife (the daughter-in-law) */
export const FIVE = {
  father: { robe: C.dustyBlue, mantle: C.wood3, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  mother: { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.greyHair, skin: C.skin2, beard: 'none', belt: C.clay },
  son: { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  daughter: { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.14), hair: C.hair2, skin: C.skin, beard: 'none', belt: C.ochre },
  bride: { robe: C.tealRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14), hair: C.hair3, skin: C.skin3, beard: 'none', belt: C.sun },
};

/* ================================================================== small helpers */
/** a soft glow disc (flat, goes behind figures) */
export const halo = (r = 120, o = 1) => `<circle r="${r}" fill="url(#halo-glow)" opacity="${o}"/>`;
export const warm = (r = 120, o = 1) => `<circle r="${r}" fill="url(#warm-glow)" opacity="${o}"/>`;
/** a hung thing: a string from the flies down to its top (dy above its origin) */
export const onString = (inner, dy = 0, len = 2400) => `<g><path d="M0 ${-len}V${-dy}" stroke="${STRING}" stroke-width="1.3" fill="none"/>${inner}</g>`;
/** a still group of people (for L.sprite / one cut-out): members [{x, y, s, flip, o, armF, armB, head}] */
export const group = (c, members) => pose3(c, members);
/** a label on a round paper tag with a picture above the word (origin centre) */
export function iconTag(c, inner, text, { r = 44, size = 17, fill = C.cream } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 32), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 32), 0.4, 5), fill).out();
  return `${s}${inner}${text ? `<text x="0" y="${(r * 0.62).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>` : ''}`;
}
/** a dark knot of scribbled paper (a hard word, greed); origin centre */
export function darkKnot(c, r = 16, col = '#3e3448') {
  let d = c.cut(c.blob(0, 0, r, r * 0.8, 11, 0.3), 0.8, 4);
  for (let i = 0; i < 3; i++) d += c.ribbon(c.arc(c.rr(-4, 4), c.rr(-3, 3), r * c.rr(0.5, 0.9), r * c.rr(0.4, 0.7), c.rr(0, 3), c.rr(3.5, 6), 10), 2.2);
  return `<path d="${d}" fill="${col}"/>`;
}
/** a little puff of dust (trampling feet); origin centre */
export function dustPuff(c, r = 16) {
  let d = '';
  for (let i = 0; i < 5; i++) d += c.cut(c.circ(c.rr(-r, r), c.rr(-r * 0.4, r * 0.2), r * c.rr(0.35, 0.6), 9), 0.4, 3);
  return `<path d="${d}" fill="${mix(C.sand, C.cream, 0.4)}" opacity=".85"/>`;
}

/* ================================================================== the level plain (Luke 8's) */
/**
 * Luke 8's level plain (always cut with the same scissors, so it is the same place in every scene): the towns on the
 * hills, the roads, the low green rise where Jesus stands (x 800, feet RISE), the crowd knots as sprites
 * ('stand' | 'up' | 'sit' | false), the four disciples beside Him (puppets, optional), Jesus (puppet).
 * Returns the plain's handles plus { crowd, near:[{p, x, y, flip, seed}], jesus, J: {x, y, s} }.
 */
export function plainSet(S, { skyCols = DAY, sky2 = null, sunAt = [1220, 150], crowd = 'stand', twins = false, near = true, jesus = true } = {}) {
  const S2 = Object.create(S);
  S2.c = makeCutter('lk12-plain');
  const P = plain8(S2, { skyCols, sky2, sunAt });
  const pc = makeCutter('lk12-plain-people');
  const cr = crowd ? crowd8(P.crowdL, { variant: crowd, seed: 'lk12-plain' }) : [];
  if (twins && crowd) cr.forEach((g) => {
    g.alt = P.crowdL.sprite(`<g transform="scale(${g.s.toFixed(3)})">${knotUp(`lk12-plain-${g.i}`, g.n, { s: 1, spread: 38, rows: 1, flip: g.flip })}</g>`, g.x, g.y);
    g.alt.set({ x: g.x, y: g.y, o: 0 });
  });
  const J = { x: 800, y: RISE, s: 1.02 };
  const NR = near ? NEAR.map((d, i) => ({ ...d, i, x: J.x + d.dx, y: RISE + d.dy, flip: d.dx > 0, seed: pc.rr(0, 9), p: S.puppet(P.act.add(person(pc, d.o))) })) : [];
  const jp = jesus ? S.puppet(P.act.add(person(pc, { ...CAST.jesus }))) : null;
  return { ...P, pc, crowd: cr, near: NR, jesus: jp, J };
}
import { knotUp } from '../luke8/lib.js';
import { blinkAt } from '../../assets/people.js';
/** stand the four beside Him, turned towards Him (extra(d) → pose overrides) */
export function standNear(P, time, extra = () => ({})) {
  P.near.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.94, flip: d.flip, armF: 14, armB: 6, head: -2, blink: blinkAt(time, d.seed), ...extra(d) }));
}

/* ================================================================== a town house, cut open (scenes 2 and 20) */
/**
 * A flat-roofed town house cut open like a doll's house: the back wall with a lamp niche and a small window, the
 * floor, the roof slab with its parapet (people can stand on it at y ROOF), the outside stair on the right. Its front
 * wall (a door, a shuttered window) is a separate cut-out that lifts away into the flies. Always cut with the same
 * scissors. Returns { back, roofEl, front, glow, layer } — back/roof/stairs in `layer` (par .45), front in `frontL`.
 */
export const HS = { X0: 380, X1: 900, FLOOR: 690, ROOF: 404, STAIR: [[1030, 700], [990, 620], [950, 530], [915, 440], [900, 406]] };
export function cutHouse(S, { tintCol = C.night, tintK = 0, inside = null } = {}) {
  const c = makeCutter('lk12-house');
  const TT = (m) => (tintK ? tint(m, tintCol, tintK) : m);
  const { X0, X1, FLOOR, ROOF } = HS;
  const layer = S.layer({ par: 0.45, sh: 4 });
  const b = sheet();
  const wall = mix(C.plaster, C.dune, 0.18);
  b.p(c.cut([[X0, ROOF], [X1, ROOF], [X1, FLOOR + 4], [X0, FLOOR + 4]], 0.8, 12), wall);
  let patch = '';
  for (let i = 0; i < 9; i++) patch += c.cut(c.blob(c.rr(X0 + 30, X1 - 30), c.rr(ROOF + 40, FLOOR - 60), c.rr(20, 44), c.rr(10, 20), 10, 0.2), 0.6, 6);
  b.x(patch, C.plaster2, 'opacity=".6"');
  // a lamp niche, a small high window, a shelf with jars, a beam
  b.p(c.cut([[590, 560], [590, 500], ...c.arc(620, 500, 30, 26, PI, 2 * PI, 8), [650, 560]], 0.4, 5), shade(wall, -0.3));
  b.p(c.cut([[760, 500], [760, 450], ...c.arc(786, 450, 26, 22, PI, 2 * PI, 8), [812, 500]], 0.4, 5), mix(C.soilDark, C.night, 0.3));
  b.p(c.cut(c.rect(420, 520, 120, 8), 0.3, 5), C.wood2);
  b.p(c.cut([[430, 520], [428, 494], [440, 486], [452, 494], [450, 520]], 0.3, 4) + c.cut([[470, 520], [466, 500], [478, 490], [496, 500], [492, 520]], 0.3, 4) + c.cut([[510, 520], [508, 504], [522, 498], [532, 506], [530, 520]], 0.3, 4), C.pot);
  b.p(c.cut(c.rect(X0, ROOF + 22, X1 - X0, 12), 0.4, 10), C.wood2);
  // the floor, a red rug
  b.p(c.cut([[X0 - 10, FLOOR - 8], [X1 + 10, FLOOR - 8], [X1 + 26, FLOOR + 40], [X0 - 26, FLOOR + 40]], 0.6, 10), mix(C.clay, C.sand2, 0.5));
  b.p(c.cut([[560, FLOOR + 2], [840, FLOOR + 2], [856, FLOOR + 26], [546, FLOOR + 26]], 0.4, 8), shade(C.terracotta, 0.2));
  layer.add(TT(b.out()));
  // the roof slab, parapet, beam ends; the cut side walls
  const f = sheet();
  f.p(c.cut([[X0 - 30, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 20, ROOF + 6], [X0 - 30, ROOF + 6]], 0.8, 10), mix(C.clay, C.sand2, 0.4));
  let ends = '';
  for (let x = X0 - 12; x < X1 + 10; x += 36) ends += c.cut(c.circ(x, ROOF - 10, 6, 10), 0.3, 3);
  f.p(ends, C.wood3);
  f.p(c.cut([[X0 - 30, ROOF - 52], [X0 + 60, ROOF - 52], [X0 + 60, ROOF - 30], [X0 - 30, ROOF - 30]], 0.4, 6), C.plaster2);
  f.p(c.cut([[X0 - 26, ROOF - 30], [X0, ROOF - 30], [X0, FLOOR + 40], [X0 - 32, FLOOR + 40]], 0.6, 10) + c.cut([[X1, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 26, FLOOR + 40], [X1, FLOOR + 40]], 0.6, 10), C.stone);
  // the outside stair, up the right side to the roof
  let st = '';
  const S0 = HS.STAIR;
  for (let i = 0; i < 12; i++) {
    const u = i / 11, x = lerp(S0[0][0], S0[4][0], u), y = lerp(S0[0][1], S0[4][1], u);
    st += c.cut(c.rect(x - 6, y - 6, 40, 12), 0.3, 4);
  }
  f.p(c.cut([[X1 + 20, FLOOR + 40], [X1 + 20, ROOF + 6], [1060, FLOOR + 40]], 0.6, 10), shade(C.plaster2, -0.06));
  f.p(st, shade(C.stone2, -0.05));
  const roofEl = layer.add(TT(f.out()));
  const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
  const glow = glowL.add(`<g opacity="0"><ellipse cx="660" cy="580" rx="300" ry="190" fill="url(#warm-glow)"/></g>`);
  const ins = inside ? inside(S) : null;
  // the front wall: a door, a shuttered window (lifts away)
  const frontL = S.layer({ par: 0.47, sh: 6 });
  const w = sheet();
  const dx0 = 790, dx1 = 852;
  w.p(c.cut([[X0 - 30, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 20, FLOOR + 40], [X0 - 30, FLOOR + 40]], 0.8, 12) + c.hole([[dx0, FLOOR + 38], [dx0, 580], ...c.arc((dx0 + dx1) / 2, 580, 31, 28, PI, 2 * PI, 8), [dx1, FLOOR + 38]], 0.4, 6), mix(C.plaster, C.sand, 0.2));
  let fp = '';
  for (let i = 0; i < 10; i++) fp += c.cut(c.blob(c.rr(X0, X1), c.rr(ROOF + 20, FLOOR), c.rr(18, 44), c.rr(8, 18), 10, 0.2), 0.6, 6);
  w.x(fp, C.plaster2, 'opacity=".55"');
  w.p(c.cut(c.rect(dx0 - 6, 576, 6, FLOOR - 540), 0.3, 4) + c.cut(c.rect(dx1, 576, 6, FLOOR - 540), 0.3, 4), C.wood2);
  w.p(c.cut(c.rect(470, 500, 70, 60), 0.4, 5), C.wood);
  w.x(c.ribbon([[505, 502], [505, 558]], 2) + c.ribbon([[472, 530], [538, 530]], 2), shade(C.wood, -0.3), 'opacity=".7"');
  w.p(c.cut([[X0 - 30, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 20, ROOF - 18], [X0 - 30, ROOF - 18]], 0.4, 10), C.roof);
  const doorD = c.poly([[dx0, FLOOR + 38], [dx0, 580], ...c.arc((dx0 + dx1) / 2, 580, 31, 28, PI, 2 * PI, 8), [dx1, FLOOR + 38]]);
  const front = frontL.add(TT(`<g><path d="${doorD}" fill="${C.wood2}"/>${w.out()}<g class="chinks"><path d="${c.poly(c.rect(474, 504, 28, 24))}" fill="${C.lampFlame}" opacity=".0"/></g><path d="M${X0} -2400V${ROOF - 30}M${X1} -2400V${ROOF - 30}" stroke="${STRING}" stroke-width="1.3" fill="none"/></g>`));
  return { c, layer, roofEl, glow, glowL, front, frontL, ins };
}

/* ================================================================== goods, greed and life */
import { coinChest as cchest, wineJar as wjar } from '../matthew24/lib.js';
import { flourSack as fsack } from '../matthew13/lib.js';
/** an inheritance laid out on a cloth: a money chest, a wine jar, a sack, a rolled deed (origin: cloth centre) */
export function goodsHeap(c, { w = 150 } = {}) {
  const cl = sheet().p(c.cut([[-w / 2, 0], [-w / 2 + 10, -10], [w / 2 - 8, -12], [w / 2, 0], [w / 2 - 6, 8], [-w / 2 + 6, 8]], 0.5, 6), C.linen2).x(c.ribbon([[-w / 2 + 12, 2], [w / 2 - 12, 0]], 2), C.terracotta, 'opacity=".5"').out();
  const deed = sheet().p(c.cut(c.rect(-24, -9, 48, 18), 0.3, 4), C.parchment).p(c.cut(c.ell(-24, 0, 5, 9, 10), 0.2, 3) + c.cut(c.ell(24, 0, 5, 9, 10), 0.2, 3), C.wood3).p(c.ribbon([[-3, -9], [-3, 9]], 3), C.terracotta).out();
  return `${cl}<g transform="translate(${-w * 0.3} -6) scale(.9)">${fsack(c, 50, 58)}</g><g transform="translate(${w * 0.28} -6)">${wjar(c, 62)}</g><g transform="translate(0 -4)">${cchest(c, 64)}</g><g transform="translate(${-w * 0.08} -2) rotate(-6)">${deed}</g>`;
}
/** "≠" — a paper equals sign struck through (origin centre) */
export function notEq(c, w = 34, col = C.ochre) {
  return sheet().p(c.ribbon([[-w / 2, -7], [w / 2, -7]], 6) + c.ribbon([[-w / 2, 7], [w / 2, 7]], 6), col).p(c.ribbon([[-w * 0.3, 18], [w * 0.3, -18]], 5), C.terracotta).out();
}
/** "=" (origin centre) */
export function eqSign(c, w = 34, col = C.ochre) {
  return sheet().p(c.ribbon([[-w / 2, -7], [w / 2, -7]], 6) + c.ribbon([[-w / 2, 7], [w / 2, 7]], 6), col).out();
}

/* ================================================================== the rich man's farm (scenes 8 and 9) */
import { barn as barn13 } from '../matthew13/lib.js';
import { stars as starsN, moon as moonN } from '../../assets/nature.js';
export const FARM = { GY: 706, SB: [[880, 150, 110], [1050, 140, 104]], BIG: [990, 360, 250], MX: 700 };
/** one row of ripe wheat as a strip of soil with stalks on it (origin world, base y) */
export function wheatRow(c, y, { x0 = -900, x1 = 700, h = 60, col = C.wheat, col2 = C.wheat2, soil = mix(C.soil, C.sand2, 0.4) } = {}) {
  const s = sheet();
  s.p(c.cut([[x0, y - 6], [x1, y - 6], [x1 + 30, y + 160], [x0, y + 160]], 0.6, 12), soil);
  let st = '', ea = '';
  for (let x = x0; x < x1; x += c.rr(7, 11)) {
    const hh = h * c.rr(0.8, 1.1), lean = c.rr(-6, 6);
    st += c.ribbon([[x, y], [x + lean, y - hh]], 2);
    ea += c.cut(c.ell(x + lean, y - hh - 6, 3.2, 9, 8, lean * 0.03), 0.2, 3);
  }
  s.p(st, col2).p(ea, col);
  return s.out();
}
/**
 * The rich farmer's land in the golden afternoon (or at night): hills, a wide wheat field on the left in three rows that
 * can grow (rows[i]), his two small barns on the right (small[i] = { body, door }), the great new barn (big, big.door)
 * that rises out of the ground, and the yard and path in front. Always cut with the same scissors.
 */
export const HARVEST = ['#cddfd6', '#f2e3c0', '#f8e7c6'];
export function farmSet(S, { skyCols = HARVEST, night = false, beforeAct = null } = {}) {
  const c = makeCutter('lk12-farm');
  const sk = sky(S, skyCols);
  const nightSky = night ? sky(S, NIGHT, { name: 'night', rise: 0 }) : null;
  if (nightSky) nightSky.layer.fade(0);
  const starL = night ? S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 }) : null;
  if (starL) { starL.add(starsN(c, { x0: -800, x1: 2400, y0: -600, y1: 420, n: 120 })); starL.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: 1230, y: 150, len: 800 });
  const moonEl = night ? hanging(hangL, `${halo(100, 0.5)}${moonN(c, 30)}`, { x: 1200, y: -900, len: 900 }) : null;
  const cls = [[480, 150, 190]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup);
  const hills = S.layer({ par: 0.16, sh: 3 });
  const hw = hillsWith(c, { y: 500, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
  hills.add(hw.markup + town(c, { x: 1300, y: hw.fn(1300) + 12, n: 5, spread: 240, sc: 0.5 }));
  const land = S.layer({ par: 0.28, sh: 3 });
  const lfn = c.wave(596, [4, 2], [700, 200]);
  land.add(sheet().p(c.ridge(lfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.wheat, 0.25)).out() + olive(c, 1380, 610, 0.8) + cypress(c, 1480, 606, 120));
  const fieldL = S.layer({ par: 0.3, sh: 3 });
  const rows = [626, 656, 688].map((y, i) => fieldL.add(`<g>${wheatRow(c, y, { h: 56 + i * 6 })}</g>`));
  const barnL = S.layer({ par: 0.32, sh: 4 });
  const B = barn13(c, { w: FARM.BIG[1], h: FARM.BIG[2] });
  const big = barnL.add(`<g>${B.body}<g class="door" transform="translate(-46 0)">${B.door}</g></g>`);
  const small = FARM.SB.map(([x, w, h], i) => {
    const b = barn13(c, { w, h });
    return { i, x, el: barnL.add(`<g>${b.body}</g>`), door: barnL.add(`<g>${sheet().p(c.cut(c.rect(0, -104, 46, 104), 0.4, 6), C.wood).x(c.ribbon([[6, -96], [40, -96]], 3) + c.ribbon([[6, -16], [40, -16]], 3), C.wood2).out()}</g>`) };
  });
  const yard = S.layer({ par: 0.32, sh: 2 });
  yard.add(sheet().p(c.cut([[700, FARM.GY - 4], [2600, FARM.GY - 4], [2600, 1800], [700, 1800]], 0.6, 12), mix(C.sand, C.stone, 0.3)).out());
  const pre = beforeAct ? beforeAct(S) : null;
  const act = S.layer({ par: 0.45, sh: 5 });
  const fx = S.layer({ par: 0.45, sh: 6 });
  const front = S.layer({ par: 0.6, sh: 5 });
  const pfn = c.wave(752, [4, 2], [600, 180]);
  front.add(sheet().p(c.ridge(pfn, -900, 2500, 1800, 12, 1), mix(C.sand, C.hillNear, 0.35)).out() + grass(c, { x0: -800, x1: 2400, y: 752, fn: pfn, n: 40, h: 14, color: C.olive }) + flowers(c, { x0: -600, x1: 2200, y: 752, fn: pfn, n: 16, h: 16 }));
  return {
    c, sk, nightSky, starL, hangL, sunEl, moonEl, pre, fieldL, rows, barnL, big, bigDoor: big.querySelector('.door'), small, yard, act, fx, front,
    update(time, { night: nk = 0, sunY = 150 } = {}) {
      if (nightSky) { nightSky.layer.fade(nk); starL.fade(nk); pose(moonEl, { x: 1200, y: lerp(-900, 170, nk), r: Math.sin(time * 0.5) * 0.8, oy: 0, o: nk > 0.01 ? 1 : 0 }); }
      pose(sunEl, { x: 1230, y: sunY + nk * 800, r: Math.sin(time * 0.6), oy: 0 });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1) * 20, cl.y - nk * 900, time, 1.2, 0.6, cl.i));
    },
  };
}

/* ================================================================== the disciples seated before Him (scenes 10, 13) */
export const SEAT12 = [
  { k: 'thomas', o: CAST.thomas, x: 540, y: 700 }, { k: 'andrew', o: CAST.andrew, x: 616, y: 712 }, { k: 'peter', o: CAST.peter, x: 694, y: 706 },
  { k: 'john', o: CAST.john, x: 906, y: 706 }, { k: 'james', o: CAST.james, x: 984, y: 712 }, { k: 'matthew', o: CAST.matthew, x: 1060, y: 700 },
];
/** six disciples seated on the grass in front of the rise, turned towards Him (puppets in P.act) */
export function seatDisciples(S, P) {
  const pc = makeCutter('lk12-seated');
  return SEAT12.map((d, i) => ({ ...d, i, flip: d.x > 800, seed: pc.rr(0, 9), p: S.puppet(P.act.add(person(pc, { ...d.o, pose: 'sit' }))) }));
}
export function poseSeated(ds, time, extra = () => ({})) {
  ds.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.92, flip: d.flip, armF: 22, armB: 10, head: -6, blink: blinkAt(time, d.seed), ...extra(d) }));
}
/** a grey worry-cloud with a care painted on it (origin centre) */
export function careCloud(c, icon, w = 90) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, w / 2, w * 0.32, 14, 0.2), 0.8, 5), mix(C.storm, C.stone2, 0.35));
  s.p(c.cut(c.blob(-w * 0.2, w * 0.1, w * 0.26, w * 0.16, 10, 0.2), 0.6, 4), mix(C.storm2, C.stone2, 0.3));
  return `${s.out()}<g transform="translate(0 4)">${icon}</g>`;
}

/* ================================================================== lilies, spindle, a new mantle (adapted from Matthew 6) */
export { dayDisc, SOLOMON } from '../matthew6/lib.js';
/** a lily of the field (origin: foot of the stem); h tall; col petals */
export function lily(c, h = 70, col = C.roseRobe, { big = false } = {}) {
  const s = sheet();
  const lean = c.rr(-6, 6);
  s.p(c.ribbon(c.qbez([0, 0], [lean * 0.3, -h * 0.5], [lean, -h], 8), (u) => (big ? 5 : 2.8) - u * (big ? 2 : 1.2)), C.moss);
  const lw = big ? 60 : h;
  s.p(c.cut([[0, -h * 0.3], [-lw * 0.22, -h * 0.3 - lw * 0.2], [-lw * 0.3, -h * 0.3 - lw * 0.14], [-lw * 0.04, -h * 0.3 + lw * 0.04]], 0.3, 4) + c.cut([[0, -h * 0.45], [lw * 0.24, -h * 0.45 - lw * 0.19], [lw * 0.3, -h * 0.45 - lw * 0.13], [lw * 0.04, -h * 0.45 + lw * 0.05]], 0.3, 4), C.leaf);
  const r = big ? 30 : h * 0.2;
  const bx = lean, by = -h;
  let pet = '';
  for (let i = 0; i < 6; i++) {
    const a = -PI / 2 + ((i - 2.5) / 5) * PI * 1.15;
    pet += c.cut([[bx, by], [bx + Math.cos(a - 0.22) * r * 0.7, by + Math.sin(a - 0.22) * r * 0.7], [bx + Math.cos(a) * r, by + Math.sin(a) * r], [bx + Math.cos(a + 0.22) * r * 0.7, by + Math.sin(a + 0.22) * r * 0.7]], 0.2, 3);
  }
  s.p(pet, col);
  s.p(c.cut(c.circ(bx, by - r * 0.1, r * 0.2, 8), 0.2, 2), C.sun);
  return s.out();
}
/** a spindle with its whorl and a distaff with a tuft of wool, lying idle (origin centre) */
export function spindle(c) {
  const s = sheet();
  s.p(c.ribbon([[-40, 0], [40, -4]], 3), C.wood3);
  s.p(c.cut(c.ell(-6, -2, 12, 9, 12), 0.3, 3), C.linen2);
  s.p(c.cut(c.ell(34, -4, 5, 7, 8), 0.2, 3), C.wood2);
  s.p(c.ribbon([[50, 2], [120, -6]], 3), C.wood2);
  s.p(c.cut(c.blob(126, -8, 16, 11, 10, 0.3), 0.8, 4), C.linen);
  return s.out();
}
/** a new mantle (origin: its neck) */
export function newMantle(c, col = mix(C.jesusMantle, C.dustyBlue, 0.55)) {
  return sheet().p(c.cut([[-26, 0], [26, 0], [44, 30], [50, 140], [-50, 140], [-44, 30]], 0.8, 7), col).x(c.ribbon([[-30, 20], [-36, 130]], 3) + c.ribbon([[20, 20], [30, 130]], 3), shade(col, -0.18), 'opacity=".5"').p(c.ribbon([[-46, 128], [46, 128]], 6), C.sun).out();
}
/** move layer L in the stack so that it sits just behind layer ref (glows and light shafts go behind figures) */
export function behindOf(L, ref) { ref.el.parentNode.insertBefore(L.el, ref.el); return L; }
/** the palm under a puppet's front hand (armF degrees; pose dy 0/46/62) */
export function palm(x, y, s, flip, a, dy = 0) {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dy - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s + 5 * s];
}
/** a written sheet of orders (the master's will), unrolled between two little rods (origin centre) */
export function orders(c, w = 70, h = 44) {
  const s = sheet().p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 5), C.parchment);
  let d = '';
  for (let y = -h / 2 + 9; y < h / 2 - 5; y += 8) { let x = -w / 2 + 7; while (x < w / 2 - 8) { const l = c.rr(6, 14); d += c.ribbon([[x, y], [Math.min(x + l, w / 2 - 7), y]], 1.6); x += l + 4; } }
  s.x(d, C.ink, 'opacity=".6"');
  s.p(c.cut(c.rect(-w / 2 - 5, -h / 2 - 4, 6, h + 8), 0.2, 3) + c.cut(c.rect(w / 2 - 1, -h / 2 - 4, 6, h + 8), 0.2, 3), C.wood3);
  return s.out();
}
