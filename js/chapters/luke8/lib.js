// Luke 8 — the cast and cut-outs of this chapter. New here: the women who went with Him and served from their
// means (Joanna, the wife of Herod's steward, and Susanna, beside Mary Magdalene of Mark 16), the level plain where
// the crowds come in from every town, Luke's sower (the seed trodden under foot, the rock with no moisture, the
// thorns that grow up with it, the hundredfold), the lamp seen by those who come in, the abyss the spirits dread,
// Joanna's little cameo of Herod's court. Everything else is borrowed from the same places in Mark and Matthew:
// Mark 5's Gerasene shore, tombs, pigs and spirits, Jairus and his house, Matthew 8's storm, Matthew 9's room of
// the ruler's daughter, Matthew 13's explanation stage with the hearts that open like little doors.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, house, palm, olive, cypress, bush, rock, grass, flowers, sun, cloud } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { LOOK as L5 } from '../mark5/lib.js';
import { pose3 } from '../matthew4/lib.js';
import { folk } from '../john6/lib.js';
import { crown as crownM } from '../mark6/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, wordSlip, coin, loaf, cup, jug, physicianKit, dust, addToHead, addToBody } from '../mark2/lib.js';
export { voiceRings, sparkle, dove, flapWings, handLamp } from '../mark1/lib.js';
export {
  LOOK as L5, pig, herd, spirit, shadowCloak, tomb, slope, boulders, link, chain, fetter, bubble, cry, tag, glyphTag, purse, jar, staff,
  sorrowCloud, thinkBubble, streetSet, mouthO, worry, onBody, onFace, sickGirlIcon, shoreSet as gerasaShore, mapSheet,
} from '../mark5/lib.js';
export { MAGD, WOMEN, medallion, miniHead } from '../mark16/lib.js';
export { TWELVE, nameTag, tapeCross, tapeX, question, stoneHeart } from '../mark3/lib.js';
export { MARY } from '../matthew1/lib.js';
export { TEMPTER, tempterAura, pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { stormSet, mob, hangAt, thoughtCloud } from '../matthew8/lib.js';
export { roomSet, girlOnBed, blanketOnBed, mourners, RM, RULER, jesusWithFringe } from '../matthew9/lib.js';
export {
  soilStage, XP, FTOP, FFACE, FLAPB, FEET, addHeart, wordSeed, crow, sproutRig, rootPieces, rootLines, tendril, hourglassT, worryCloud,
  coinsT, moneyBag, gem, casket, gauze, discPlate, sowerPlate, throng, arcAt, track, SOWER, grapes, LISTEN, chest,
} from '../matthew13/lib.js';
export { group, folk, capShore, eyeIcon } from '../john6/lib.js';
export { storyFrame, SEPIA, crossX, tick, disc, labelTag, basket } from '../mark6/lib.js';
export { figure, bake, manO, womanO, village, smallSynagogue, PI, FONT, DY } from '../luke4/lib.js';
export { flat, flatSky, flyTo, fig, flatHills, flatText, dropK } from '../luke1/lib.js';
export { tr };

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== the cast */
/** Joanna, the wife of Chuza, Herod's steward: a lady of the court — a deep plum mantle, a pale gold veil, a gold belt */
export const JOANNA = { robe: C.linen, mantle: shade(C.plumRobe, -0.1), mantleArm: true, hairStyle: 'veil', veil: mix(C.halo, C.cream, 0.35), veil2: C.haloRim, hair: C.hair2, skin: C.skin, belt: C.sun };
/** Susanna: a teal robe and a blush-pink veil, an ochre sash */
export const SUSANNA = { robe: C.tealRobe, mantle: null, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.14), hair: C.hair3, skin: C.skin3, belt: C.ochre };
/** Chuza, Herod's steward (only in Joanna's little cameo): a turban with a gold band, keys at his belt */
export const CHUZA = { robe: C.wheatRobe, mantle: mix(C.plumRobe, C.ochre, 0.35), hairStyle: 'wrap', veil: C.cream, veil2: C.sun, beard: 'short', hair: C.hair3, skin: C.skin2, belt: C.sun };
/** the "many others" who went with them */
export const OTHERS = [
  { robe: C.ochreRobe, hairStyle: 'veil', veil: C.linen2, veil2: shade(C.linen2, -0.12), hair: C.hair, skin: C.skin2, belt: C.clay },
  { robe: C.mauve, hairStyle: 'veil', veil: C.cream, veil2: shade(C.cream, -0.12), hair: C.greyHair, skin: C.skin4, belt: null },
  { robe: C.dustyBlue, mantle: C.stone, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.hair2, skin: C.skin, belt: null },
];
/** the brothers of Jesus (the same three men in every scene they stand in) */
export const BROTHERS = [
  { robe: C.tealRobe, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2, belt: C.leather },
  { robe: C.ochreRobe, mantle: C.sageRobe, hairStyle: 'curly', hair: C.hair3, beard: 'none', skin: C.skin2 },
  { robe: C.clayMantle, hairStyle: 'wrap', veil: C.linen2, hair: C.hair, beard: 'full', skin: C.skin3 },
];
/** the man sent from the ruler's house */
export const MESSENGER = L5.messenger;
/** the Gerasene: wild in rags; clothed, sitting, in his right mind */
export const WILD = L5.wild, HEALED = L5.healed;
/** a traveller who treads the seed on the path (the parable) */
export const TRAVELLER = { robe: C.stone2, mantle: C.clayMantle, hairStyle: 'wrap', veil: C.sand2, beard: 'full', hair: C.hair3, skin: C.skin3, belt: C.leather };

/* ================================================================== skies */
export const MORNING = ['#cadfdb', '#eee5cc', '#f7ead3'];
export const DAY = ['#c6ddd9', '#ecebd6', '#f6ead0'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const EVENING = ['#a69abf', '#eab99c', '#f5d6b0'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const GREY = ['#8f95a8', '#c3c1bd', '#dcd3c4'];

/* ================================================================== small helpers */
/** a still group of people as one markup (for L.sprite): members [{x, y, s, flip, o, armF, armB, head}] */
export const still = (c, members) => pose3(c, members);
/** n people of the crowd in a loose knot, facing right unless flip (for L.sprite) */
export function knot(seed, n, { s = 0.8, spread = 40, rows = 2, flip = false, pose: P = 'stand', arms = [0, 30], armB = [0, 10], head = [-6, 4], women = null } = {}) {
  const c = makeCutter(seed);
  const per = Math.ceil(n / rows);
  const mem = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), k = i % per;
    const man = women === null ? null : !women;
    mem.push({ x: (k - (per - 1) / 2) * spread + (r % 2) * spread * 0.5 + c.rr(-5, 5), y: r * 14 + c.rr(-2, 2), s: s * c.rr(0.93, 1.05) * (1 - r * 0.04), flip, head: c.rr(head[0], head[1]), armF: c.rr(arms[0], arms[1]), armB: c.rr(armB[0], armB[1]), o: { ...folk(c, man), pose: P } });
  }
  return pose3(c, mem);
}
/** the same knot with every arm raised (cross-fade the two sprites) */
export const knotUp = (seed, n, o = {}) => knot(seed, n, { ...o, arms: [110, 150], armB: [120, 160], head: [-12, -6] });

/** a golden crown on a round tag: "the kingdom of God" (origin centre) */
export function kingdomDisc(c, r = 40) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 34), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), mix(C.halo, C.cream, 0.5));
  return `<circle r="${r * 2.2}" fill="url(#warm-glow)"/>${s.out()}<g transform="translate(0 ${r * 0.5}) scale(${r / 26})">${crownM(c)}</g>`;
}
/** a word of good news on a slip with a tiny crown on it (origin centre) */
export function newsSlip(c, w = 40) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -w * 0.32], [w / 2, -w * 0.35], [w / 2 + 2, w * 0.32], [-w / 2 - 1, w * 0.34]], 0.3, 4), C.cream);
  s.x(c.ribbon([[-w * 0.3, -w * 0.08], [w * 0.36, -w * 0.1]], 1.4) + c.ribbon([[-w * 0.3, w * 0.12], [w * 0.2, w * 0.1]], 1.4), C.inkSoft, 'opacity=".6"');
  return `${s.out()}<g transform="translate(${-w * 0.36} ${w * 0.04}) scale(.36)">${crownM(c)}</g>`;
}

/* ================================================================== the road through the towns and villages */
/**
 * Galilean hills in three sheets that slide sideways while the procession walks "in place" on the road in front
 * (a panorama rolled past on the compositor): a walled town and villages on the hills. Returns { update(time, travel) }.
 * travel: world units the land has rolled by (0 → …); far sheets move less.
 */
export function roadSet(S, { skyCols = MORNING, sunAt = [1210, 150] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[430, 140, 180], [960, 100, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2, pad: 900 });
  far.add(band(c, { y: 400, amps: [20, 8, 3], lens: [1100, 400, 130], color: mix(C.hillFar, C.duskViolet, 0.12), x0: -2600, x1: 4200 }).markup);
  const mid = S.layer({ par: 0.16, sh: 3, pad: 1400 });
  const mh = hillsWith(c, { y: 462, amps: [22, 9, 3], lens: [900, 320, 110], color: C.hillMid, trees: 50, treeColor: C.sage, treeH: 22, x0: -2600, x1: 4200 });
  mid.add(mh.markup);
  // towns and villages along the hills, far to the right too (they roll past)
  const spots = [[-700, 'town'], [-150, 'vil'], [330, 'vil'], [760, 'town'], [1250, 'vil'], [1700, 'vil'], [2200, 'town'], [2750, 'vil'], [3300, 'vil'], [3800, 'town']];
  spots.forEach(([x, kind]) => {
    const y = mh.fn(x) + 10;
    mid.add(kind === 'town' ? walledTown(c, x, y, 0.62) : town(c, { x, y, n: 5, spread: 170, sc: 0.46 }));
  });
  const near = S.layer({ par: 0.3, sh: 3, pad: 2600 });
  const nfn = c.wave(560, [10, 4], [800, 220]);
  near.add(sheet().p(c.ridge(nfn, -3200, 5200, 1700, 14, 1), mix(C.hillNear, C.sand, 0.2)).out());
  let trees = '';
  for (let x = -3000; x < 5000; x += c.rr(260, 520)) trees += c.chance(0.5) ? olive(c, x, nfn(x) + 8, c.rr(0.5, 0.75)) : cypress(c, x, nfn(x) + 6, c.rr(80, 130));
  near.add(trees + grass(c, { x0: -3000, x1: 5000, y: 560, fn: nfn, n: 90, h: 12, color: C.olive }));
  const ground = S.layer({ par: 0.5, sh: 3 });
  const gfn = c.wave(690, [4, 2], [700, 180]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.35)).out());
  const road = [], road2 = [];
  for (let x = -900; x <= 2500; x += 20) road.push([x, 718 + Math.sin(x * 0.004) * 4 - 26]);
  for (let x = 2500; x >= -900; x -= 20) road2.push([x, 718 + Math.sin(x * 0.004) * 4 + 30]);
  ground.add(sheet().p(c.cut([...road, ...road2], 1, 10), C.sand).out());
  // stones on the road roll by (a strip that slides)
  const pebL = S.layer({ par: 0.5, sh: 1, pad: 700 });
  let peb = '';
  for (let i = 0; i < 90; i++) { const x = c.rr(-1600, 3200); peb += c.cut(c.blob(x, 718 + c.rr(-16, 26), c.rr(3, 8), c.rr(2, 4), 7, 0.2), 0.3, 3); }
  pebL.add(sheet().p(peb, C.sand2).out());
  return {
    c, sk, hangL, far, mid, near, ground, pebL, gfn,
    update(time, travel = 0) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
      far.shift(-travel * 0.12, 0);
      mid.shift(-travel * 0.3, 0);
      near.shift(-travel * 0.6, 0);
      pebL.shift(-((travel * 1.0) % 800), 0);
    },
  };
}
/** a small walled town on a hill: a ring of wall with a gate and houses inside (origin: ground centre, world coords) */
export function walledTown(c, x, y, sc = 0.6) {
  const s = sheet();
  const w = 260 * sc, h = 40 * sc;
  s.p(c.cut([[x - w / 2, y], [x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y]], 0.5, 8), C.stone2);
  let cren = '';
  for (let k = x - w / 2; k < x + w / 2 - 6; k += 16 * sc) cren += c.cut(c.rect(k, y - h - 7 * sc, 9 * sc, 8 * sc), 0.2, 3);
  s.p(cren, C.stone2);
  s.p(c.cut(c.rect(x - w / 2 - 10 * sc, y - h - 26 * sc, 26 * sc, h + 26 * sc), 0.3, 5) + c.cut(c.rect(x + w / 2 - 16 * sc, y - h - 26 * sc, 26 * sc, h + 26 * sc), 0.3, 5), shade(C.stone2, -0.06));
  s.p(c.cut([[x - 10 * sc, y], [x - 10 * sc, y - 18 * sc], ...c.arc(x, y - 18 * sc, 10 * sc, 10 * sc, PI, 2 * PI, 6), [x + 10 * sc, y]], 0.2, 3), C.soilDark);
  let hs = '';
  for (let i = 0; i < 6; i++) hs += house(c, x - w * 0.4 + (i * w * 0.8) / 5 + c.rr(-6, 6), y - h + 2 - c.rr(0, 12) * sc, c.rr(40, 60) * sc, c.rr(34, 50) * sc, { stairs: false });
  return hs + s.out();
}

/* ================================================================== the level place where the crowds gather */
/**
 * A wide plain under Galilean hills: three towns on the hills with roads winding down from each to a low green
 * rise in the middle where Jesus stands (x 800, feet RISE). Layers: sky, hangs, far, towns (par .18), the plain
 * (par .4) with its roads, a crowd layer (par .4) and a foreground bank. Returns handles and update(time).
 */
export const RISE = 628;
export const ROADS = [
  [[-240, 470], [60, 520], [300, 580], [520, 640], [640, 690]],
  [[800, 476], [760, 510], [820, 548], [780, 584]],
  [[1840, 470], [1540, 520], [1300, 580], [1080, 640], [960, 690]],
];
export function plainSet(S, { skyCols = DAY, sunAt = [1220, 150], sky2 = null } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  let sk2 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2' }); sk2.layer.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[420, 150, 190], [980, 110, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 390, amps: [20, 8, 3], lens: [1100, 400, 130], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup);
  const hills = S.layer({ par: 0.18, sh: 3 });
  const hw = hillsWith(c, { y: 450, amps: [18, 8, 3], lens: [900, 320, 110], color: C.hillMid, trees: 24, treeColor: C.sage, treeH: 22 });
  hills.add(hw.markup);
  hills.add(walledTown(c, 140, hw.fn(140) + 12, 0.7) + town(c, { x: 800, y: hw.fn(800) + 12, n: 6, spread: 220, sc: 0.5 }) + walledTown(c, 1480, hw.fn(1480) + 12, 0.66));
  const plain = S.layer({ par: 0.4, sh: 3 });
  const pfn = c.wave(470, [5, 2], [800, 200]);
  const P = sheet();
  P.p(c.ridge(pfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.28));
  // the roads down from the towns
  ROADS.forEach((pts) => { P.p(c.ribbon(pts, (u) => 8 + u * 30, 1), mix(C.sand, C.stone, 0.3)); });
  // the low rise in the middle (Jesus stands on it)
  P.p(c.cut(c.blob(800, RISE + 14, 170, 30, 16, 0.08), 1, 8), shade(C.hillNear, 0.12));
  P.x(grass(c, { x0: 650, x1: 950, y: RISE - 6, n: 16, h: 10, color: C.moss }), C.moss);
  plain.add(P.out());
  plain.add(olive(c, 380, 520, 0.6) + olive(c, 1240, 522, 0.55) + bush(c, 170, 610, 70, C.sage, C.moss) + bush(c, 1450, 606, 60, C.sage2, C.sage) + flowers(c, { x0: 660, x1: 940, y: RISE, n: 14, fn: (x) => RISE - 4 + Math.abs(x - 800) * 0.08 }));
  const crowdL = S.layer({ par: 0.4, sh: 4 });
  const act = S.layer({ par: 0.4, sh: 5 });
  const fx = S.layer({ par: 0.4, sh: 6 });
  const fg = S.layer({ par: 0.9, sh: 6 });
  const bank = c.wave(900, [10, 4], [520, 170]);
  fg.add(sheet().p(c.ridge(bank, -1200, 2800, 1800, 14, 1.2), C.sage).out() + grass(c, { x0: -1200, x1: 2800, y: 900, fn: bank, n: 70, h: 26, color: C.moss }) + flowers(c, { x0: -1200, x1: 2800, y: 900, fn: bank, n: 26, h: 30 }));
  return {
    c, sk, sk2, hangL, sunEl, hills, plain, crowdL, act, fx, fg, hfn: hw.fn,
    update(time, { sunY = sunAt[1] } = {}) {
      swing(sunEl, sunAt[0], sunY, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}
/** a point u ∈ [0,1] along a polyline */
export function alongPts(pts, u) {
  const lens = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); tot += l; }
  let d = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) { const k = Math.min(1, d / lens[i]); return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

/* ================================================================== things */
/** Herod's court in a round cameo: a palace front with a golden roof, Chuza the steward with his keys and ledger (origin centre) */
export function stewardCameo(c, id, r = 64) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 40), 0.5, 5), C.haloRim);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.5, 5), mix(C.parchment, C.lavender, 0.25));
  // the palace
  const pal = sheet();
  pal.p(c.cut(c.rect(-50, -30, 100, 56), 0.4, 6), C.cream);
  pal.p(c.cut([[-58, -28], [0, -54], [58, -28]], 0.3, 5), C.sun);
  let cols = '';
  for (let k = -40; k <= 40; k += 16) cols += c.cut(c.rect(k - 3, -24, 6, 48), 0.2, 4);
  pal.p(cols, C.stone2);
  pal.p(c.cut(c.rect(-58, 24, 116, 8), 0.3, 5), C.stone2);
  const chuza = `<g transform="translate(18 ${r * 0.62}) scale(.36)">${person(c, { ...CHUZA, holdF: `<g transform="rotate(-20)">${keyRing(c)}</g>` }).replace('class="armFr"', 'class="armFr" transform="rotate(-60)"')}</g>`;
  const ledger = sheet().p(c.cut(c.rect(-9, -12, 18, 24), 0.2, 3), C.parchment).x(c.ribbon([[-5, -6], [5, -6]], 1) + c.ribbon([[-5, -1], [5, -1]], 1) + c.ribbon([[-5, 4], [3, 4]], 1), C.inkSoft).p(c.cut(c.rect(-10, -13, 3, 26), 0.2, 3), C.clay).out();
  return `<circle r="${r * 1.7}" fill="url(#warm-glow)" opacity=".6"/>${s.out()}<clipPath id="${id}"><circle r="${r - 1}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(-10 -6) scale(.8)">${pal.out()}</g>${chuza}<g transform="translate(-30 ${r * 0.38})">${ledger}</g></g>`;
}
/** a ring of three iron keys (origin: the ring) */
export function keyRing(c) {
  const s = sheet();
  s.x(c.ribbon(c.arc(0, 4, 6, 6, 0, PI * 2, 12), 1.6), C.rock3);
  [[-5, 1], [0, 0], [5, -1]].forEach(([dx, r]) => {
    s.p(c.ribbon([[dx, 9], [dx + r * 2, 30]], 2.2) + c.cut(c.rect(dx + r * 2 - 1, 26, 6, 3), 0.1, 2), C.rock3);
  });
  return s.out();
}
/** a flat bread basket held on the arm (origin: the handle) */
export function breadBasketHeld(c) {
  const s = sheet();
  s.p(c.cut([[-18, 4], [18, 4], [14, 18], [-14, 18]], 0.3, 4), C.basket);
  s.p(c.ribbon([[-17, 9], [17, 9]], 1.6), shade(C.basket, -0.3));
  s.p(c.cut(c.ell(-6, 2, 8, 5, 10), 0.2, 3) + c.cut(c.ell(7, 1, 8, 5, 10), 0.2, 3), C.wheat2);
  s.x(c.ribbon(c.arc(0, 4, 16, 14, PI, 2 * PI, 8), 1.6), shade(C.basket, -0.2));
  return s.out();
}
/** a water jar carried on the arm (origin: the hand) */
export function waterJar(c, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-8, 0], [-12, 12], [-9, 26], [9, 26], [12, 12], [8, 0], [5, -5], [-5, -5]], 0.3, 4), col);
  s.x(c.ribbon([[-11, 12], [11, 12]], 1.6), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}
/** the abyss: a jagged dark pit opening in the ground, with a cold glimmer at the bottom (origin: its centre) */
export function abyss(c, w = 300, h = 70) {
  const s = sheet();
  const pts = [];
  const n = 30;
  for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2; const r = 1 + (i % 2 ? 0.06 : -0.05) + c.rr(-0.04, 0.04); pts.push([Math.cos(a) * w / 2 * r, Math.sin(a) * h / 2 * r]); }
  s.p(c.cut(pts, 1.2, 5), mix(C.soil, C.rock3, 0.4));
  s.p(c.cut(pts.map(([x, y]) => [x * 0.9, y * 0.8 + 4]), 1, 5), '#221c2c');
  let swirl = '';
  for (let k = 0; k < 3; k++) swirl += c.ribbon(c.arc(0, 8, w * (0.12 + k * 0.1), h * (0.08 + k * 0.07), PI * (0.1 + k * 0.3), PI * (1.3 + k * 0.3), 12), 2.2);
  s.x(swirl, '#4b4260', 'opacity=".8"');
  return s.out();
}
/** a tiny paper ear on a stalk-less tag (origin centre) — "who has ears to hear" */
export function earTag(c, r = 26) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 4, 26), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, r, 26), 0.4, 4), C.cream);
  const e = sheet()
    .p(c.cut([[0, -16], [8, -14], [12, -8], [11, 0], [7, 6], [4, 13], [-1, 16], [-4, 13], [-2, 9], [-4, 2], [-7, -5], [-6, -12]], 0.3, 3), C.skin2)
    .x(c.ribbon(c.qbez([-2, -10], [7, -12], [5, -2], 8), 2), shade(C.skin2, -0.25)).out();
  return s.out() + e;
}
/** a little oil lamp on a lampstand, lit (origin: the stand's foot) — the lamp alone: things.oilLamp */
export const FLAME = (c) => `<path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/>`;
/** a large clay pot turned upside down (the "jar" that covers the lamp); origin: its rim, centre */
export function coverPot(c, w = 90, h = 80) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 - 8, -h * 0.4], [-w * 0.32, -h * 0.86], [-w * 0.12, -h], [w * 0.12, -h], [w * 0.32, -h * 0.86], [w / 2 + 8, -h * 0.4], [w / 2, 0]], 0.5, 6), C.pot);
  s.x(c.ribbon([[-w / 2 - 4, -h * 0.42], [w / 2 + 4, -h * 0.42]], 3), shade(C.pot, -0.25), 'opacity=".6"');
  s.p(c.cut(c.rect(-w / 2 - 3, -6, w + 6, 8), 0.3, 5), shade(C.pot, -0.12));
  return s.out();
}
/** a word of "Legion" on a dark standard, like a legion's banner (origin: the pole's foot) */
export function legionStandard(c, text) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0, -190]], 5), C.wood2);
  s.p(c.cut([[-58, -176], [58, -176], [58, -104], [0, -86], [-58, -104]], 0.5, 6), '#3d3346');
  s.p(c.cut([[-50, -168], [50, -168], [50, -110], [0, -94], [-50, -110]], 0.4, 6), '#4d4056');
  s.p(c.cut(c.star(0, -198, 12, 5, 5, -PI / 2), 0.3, 3), C.rock3);
  s.p(c.cut(c.rect(-66, -182, 132, 7), 0.3, 5), C.wood2);
  return `${s.out()}<text x="0" y="-127" text-anchor="middle" font-family="${FONT}" font-size="25" font-style="italic" fill="${C.cream}">${text}</text>`;
}

/* ================================================================== the crowd on the plain */
/** where the knots of people settle round the rise: [x, y, n, road] (road: which road they came down) */
export const SPOTS = [
  [440, 704, 5, 0], [575, 676, 4, 0], [330, 652, 4, 0], [490, 626, 4, 0], [640, 598, 3, 0],
  [1160, 704, 5, 2], [1030, 676, 4, 2], [1270, 652, 4, 2], [1110, 626, 4, 2], [960, 598, 3, 2],
  [640, 552, 4, 1], [965, 552, 4, 1], [520, 536, 3, 1], [1090, 538, 3, 1],
];
/** depth scale on the plain */
export const plainS = (y) => lerp(0.34, 0.98, (y - 470) / (720 - 470));
/** the crowd knots as sprites (drawn at full size, scaled by depth). variant: 'stand' | 'up' (arms raised) | 'sit' */
export function plainCrowd(L, { variant = 'stand', seed = 'lk8-plain' } = {}) {
  return SPOTS.map(([x, y, n, road], i) => {
    const flip = x > 800;
    const o = { s: 1, spread: 38, rows: 1, flip, women: null };
    const m = variant === 'up' ? knotUp(`${seed}-${i}`, n, o) : variant === 'sit' ? knot(`${seed}-${i}`, n, { ...o, pose: 'sit' }) : knot(`${seed}-${i}`, n, o);
    const s = plainS(y);
    return { i, x, y, n, road, flip, s, sp: L.sprite(`<g transform="scale(${s.toFixed(3)})">${m}</g>`, x, y) };
  });
}

/* ================================================================== the street where the woman touches His cloak */
export const ST = { FEET: 722, JX: 800 };
/**
 * Capernaum's street (Mark 5's), the crowd walking along with Jesus as still sprites behind and in front, and the
 * people of the story: Jesus with the tassels on His cloak, Peter, John, Jairus, the woman (grey and ill, kneeling,
 * warm and well). Returns handles; the scene poses them.
 */
export function fringeStreet(S, { skyCols = DAY } = {}) {
  const set = streetSetM(S, { skyCols, sunAt: [1250, 130] });
  const c = S.c;
  const backL = S.layer({ par: 0.5, sh: 4 });
  const backs = [[330, -30, 'a', 4], [560, -40, 'e', 3], [1000, -36, 'b', 4], [1230, -26, 'c', 4]].map(([x, dy, k, n], i) => ({ i, x, y: ST.FEET + dy, sp: backL.sprite(knot('lk8-str-' + k, n, { s: 0.86, spread: 40, rows: 1, flip: false, arms: [10, 30] }), x, ST.FEET + dy) }));
  const L = S.layer({ par: 0.5, sh: 5 });
  const P = {
    jair: S.puppet(L.add(person(c, RULER_M))),
    peter: S.puppet(L.add(person(c, { ...CAST.peter }))),
    jesus: S.puppet(L.add(jesusWithFringeM(c))),
    john: S.puppet(L.add(person(c, { ...CAST.john }))),
    wWalk: S.puppet(L.add(person(c, L5.ill))),
    wKneel: S.puppet(L.add(person(c, { ...L5.ill, pose: 'kneel' }))),
    wKneelWell: S.puppet(L.add(person(c, { ...L5.well, pose: 'kneel' }))),
    wWell: S.puppet(L.add(person(c, L5.well))),
  };
  const frontL = S.layer({ par: 0.56, sh: 5 });
  const fronts = [[430, 40, 'f', 3], [1170, 44, 'g', 3]].map(([x, dy, k, n], i) => ({ i, x, y: ST.FEET + dy, sp: frontL.sprite(knot('lk8-str-' + k, n, { s: 0.98, spread: 42, rows: 1, flip: x > 800, arms: [10, 40] }), x, ST.FEET + dy) }));
  return { set, c, backs, fronts, L, P, backL, frontL };
}
import { streetSet as streetSetM } from '../mark5/lib.js';
import { RULER as RULER_M, jesusWithFringe as jesusWithFringeM } from '../matthew9/lib.js';
