// Luke 14 — the cast and cut-outs of this chapter. New here: the house of a ruler of the Pharisees on a sabbath noon —
// an open court under a vine pergola, a row of columns on the garden, a long table with the places of honour
// (gold bolsters) beside the host's couch at its head — the lawyers and Pharisees who watch Him, and the man swollen
// with dropsy. The parables are painted flats: the wedding hall with its places from the gold couch beside the
// bridal canopy down to the straw mat by the door; the host's own courtyard where his friends and rich neighbours
// hand the invitations back and the poor come in; the great supper of "a certain man" in his house in the city,
// the field, the five yoke of oxen and the new bride, the streets and lanes, the highways and hedges; the tower
// that was never finished; the two kings counting their thousands; the salt that is fit neither for the soil nor
// for the manure heap. Borrowed pieces are noted where they are imported.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, town, house, sun, moon, cloud, stars, grass, olive, cypress, bush, flowers, rock, palm } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg, clamp } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
import { folk } from '../john6/lib.js';
import { loaf, cup, bowl, jug, grapes, garland, canopy, wreath, lantern as paperLantern, coin, coinStack, addToHead, addToBody, sabbathTag } from '../mark2/lib.js';
import { invitation, storyFrame, roastPlatter as roastPlatterM, wineJar as wineJarM } from '../matthew22/lib.js';
import { cushion } from '../john12/lib.js';
import { ox } from '../john2/lib.js';
import { childPerson } from '../matthew2/lib.js';
import { walledTown as walledTownM } from '../luke8/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, coin, coinStack, loaf, cup, bowl, jug, grapes, garland, canopy, wreath, addToHead, addToBody, sabbathTag, rope, scrap, dust, scrollOpen, scrollRolled, candle } from '../mark2/lib.js';
export { bubble, cry, purse as purse5 } from '../mark5/lib.js';
export { nameTag, question, tapeX, stoneHeart, sparkle as sparkle3, pharisee, TWELVE } from '../mark3/lib.js';
export { voiceRings, sparkle, hang2 } from '../mark1/lib.js';
export { invitation, heldInvite, crutchHeld, stickHeld, babyHeld, ROADFOLK, roastPlatter, wineJar, signpost, storyFrame, popBubble, moneyBagHeld, hoeHeld } from '../matthew22/lib.js';
export { BLIND, LAME, BEGGAR, eyeGlyph, earGlyph, blindBand } from '../matthew11/lib.js';
export { LAWYER, SIMON, crossMark, kiss, iou, figure, manO, womanO } from '../luke7/lib.js';
export { ox, walkOx, moneyBag } from '../john2/lib.js';
export { well } from '../john4/lib.js';
export { saltBowl, saltGrains } from '../mark9/lib.js';
export { smallCross, balance } from '../mark8/lib.js';
export { yoke } from '../matthew11/lib.js';
export { troop } from '../matthew22/lib.js';
export { roadSet, knot, still, walledTown } from '../luke8/lib.js';
export { cushion, outLegs } from '../john12/lib.js';
export { childPerson } from '../matthew2/lib.js';
export { sling, wrap } from '../matthew15/lib.js';
export { pose3, bakeArms, tiltHead, folk, tr, es, ease, bump, seg, clamp, sheet, shade, mix, makeCutter };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const NOON = ['#bfdad6', '#e9eedb', '#f6edd2'];            // the sabbath noon over the ruler's court
export const FEAST = ['#e6c7b4', '#f3dcc0', '#f8ead0'];           // the wedding hall's warm light
export const GARDEN = ['#c6ddd6', '#ecebd5', '#f7ead0'];          // the host's courtyard
export const DAWN = ['#e9b98f', '#f5d59d', '#fbeac2'];            // the resurrection of the just
export const EVE = [mix(C.duskViolet, C.dusk, 0.3), mix(C.dusk, C.peach, 0.5), mix(C.peach, C.dawn, 0.55)]; // supper time
export const EVE2 = [mix(C.night, C.indigo, 0.5), mix(C.indigo, C.duskViolet, 0.5), mix(C.duskViolet, C.dusk, 0.55)];
export const DAY = ['#c2dcd8', '#e8ecd9', '#f5ebd1'];
export const WAR = ['#d8cdb4', '#ecdcbc', '#f4e6c8'];

/* ================================================================== the cast */
/** the ruler of the Pharisees, the host: fine linen, a deep wine-rose mantle, a white head-cloth with a gold band */
export const RULER = { robe: C.linen, mantle: mix(C.curtain2, C.plumRobe, 0.45), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: mix(C.curtain2, C.plumRobe, 0.45), beard: 'full', beardColor: mix(C.greyHair, C.linen, 0.25), skin: C.skin2, belt: C.sun };
/** the Pharisees and lawyers at his table */
export const PHAR = [
  { robe: C.stone, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  { robe: C.parchment, mantle: shade(C.plumRobe, -0.18), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin, belt: C.ochre }, // a lawyer (Luke 7's)
  { robe: C.linen2, mantle: C.tealRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.teal2, beard: 'wild', beardColor: C.hair3, skin: C.skin3, belt: C.leather },
  { robe: C.wheatRobe, mantle: mix(C.plumRobe, C.stone2, 0.3), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather }, // a lawyer
  { robe: C.stone2, mantle: C.skyVeil, hair: C.hair, hairStyle: 'wrap', veil: C.linen, veil2: C.indigo, beard: 'short', skin: C.skin, belt: C.leather },
  { robe: C.linen2, mantle: C.lavender, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, veil2: C.lavender, beard: 'full', skin: C.skin3, belt: C.ochre },
];
/** two late-comers who hurry for the places of honour */
export const LATE = [
  { robe: C.linen, mantle: C.ochre, hair: C.hair3, hairStyle: 'wrap', veil: C.clayMantle, veil2: C.terracotta, beard: 'full', skin: C.skin3, belt: C.sun, mantleArm: true },
  { robe: C.stone, mantle: mix(C.teal2, C.tealRobe, 0.4), hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.teal2, beard: 'short', skin: C.skin2, belt: C.leather },
];
/** the man with dropsy: a worn robe; swollen, then healed */
export const DROPSY = { robe: mix(C.stone2, C.sand2, 0.35), hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.rope };
/** the parable: the proud guest (a bright festive mantle), the more honoured guest, the humble guest, the host */
export const PROUD = { robe: C.linen, mantle: mix(C.ochre, C.sun, 0.4), hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin, belt: C.terracotta, mantleArm: true };
export const NOBLE = { robe: C.linen, mantle: mix(C.plumRobe, C.indigo, 0.25), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: mix(C.plumRobe, C.indigo, 0.25), beard: 'full', beardColor: mix(C.greyHair, C.linen, 0.4), skin: C.skin2, belt: C.sun };
export const HUMBLE = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope };
export const HOST = { robe: C.cream, mantle: C.teal2, hair: C.hair3, hairStyle: 'wrap', veil: C.skyVeil, veil2: C.teal2, beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: C.sun };
export const GROOM = { robe: C.linen, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.terracotta };
export const BRIDE = { robe: C.linen, mantle: null, hairStyle: 'veil', veil: C.blushVeil, veil2: C.roseRobe, hair: C.hair3, skin: C.skin, beard: 'none', belt: C.sun };
/** the great supper: "a certain man" and his servant */
export const MASTER = { robe: C.linen2, mantle: mix(C.clayMantle, C.terracotta, 0.35), hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.sun, mantleArm: true };
export const SERVANT = { robe: mix(C.skyVeil, C.dustyBlue, 0.45), hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin4, belt: C.ochre };
/** those who were invited: the man who bought a field, the man with the five yoke of oxen, the newly married man */
export const FIELDMAN = { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.stone2, veil2: C.clay, beard: 'full', skin: C.skin3, belt: C.leather };
export const OXMAN = { robe: mix(C.sageRobe, C.olive, 0.3), mantle: null, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.leather };
export const NEWLY = { robe: C.linen, mantle: C.roseRobe, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin, belt: C.sun };
export const WIFE = { robe: C.cream, mantle: null, hairStyle: 'veil', veil: C.blushVeil, veil2: C.sun, hair: C.hair3, skin: C.skin2, beard: 'none', belt: C.roseRobe };
/** the poor, the maimed, the blind, the lame (as Matthew 22's people of the roads, and Matthew 11's sick) */
export const POOR = { robe: mix(C.stone2, C.rock2, 0.45), hair: C.greyHair, hairStyle: 'short', beard: 'wild', beardColor: C.greyHair, skin: C.skin2, belt: C.rope };
export const MAIMED = { robe: mix(C.clay, C.stone2, 0.5), hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3, belt: C.rope };
export const BLINDM = { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather, eyes: 'closed' };
export const LAMEM = { robe: mix(C.sageRobe, C.stone2, 0.3), hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.leather };
export const POORW = { robe: mix(C.roseRobe, C.stone2, 0.4), hairStyle: 'veil', veil: C.stone, hair: C.greyHair, skin: C.skin3, beard: 'none' };
/** the would-be disciple on the road */
export const DISC = { robe: C.tealRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
/** the builder of the tower, the two kings, the envoy, the farmer and his wife with the salt */
export const BUILDER = { robe: C.ochreRobe, mantle: C.dustyBlue, hair: C.hair3, hairStyle: 'wrap', veil: C.dustyBlue, veil2: shade(C.dustyBlue, -0.2), beard: 'full', skin: C.skin3, belt: C.leather };
export const KING1 = { robe: C.linen2, mantle: mix(C.teal2, C.indigo, 0.3), hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun, mantleArm: true };
export const KING2 = { robe: mix(C.curtain2, C.soil, 0.2), mantle: mix(C.sunDeep, C.terracotta, 0.5), hair: C.hair3, hairStyle: 'short', beard: 'wild', skin: C.skin4, belt: C.sun, mantleArm: true };
export const ENVOY = { robe: C.linen, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.sage, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.ochre };
export const FARMER = { robe: mix(C.wheatRobe, C.clay, 0.25), hair: C.hair, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3, belt: C.rope };
export const FARMWIFE = { robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.linen2, veil2: C.ochreRobe, hair: C.hair2, skin: C.skin2, beard: 'none', belt: C.ochre };

/* ================================================================== small helpers */
/** place a hung thing: k 0 → up in the flies, 1 → at (x, y); swings a little */
export function flyTo(el, k, x, y, time = 0, i = 0, amp = 0.8) {
  pose(el, { x, y: lerp(-1500, y, k), r: time ? Math.sin(time * 0.7 + i * 1.7) * amp * k : 0, oy: 0, o: k > 0.002 ? 1 : 0 });
}
/** pop a piece in with a little overshoot during [a, a+d], and out during [b-d, b] (b omitted: stays) */
export function popAt(el, t, a, b, x, y, { d = 0.12, s = 1, r = 0 } = {}) {
  const k = es(t, a, a + d, ease.back) * (b === undefined ? 1 : 1 - es(t, b - d * 0.7, b));
  pose(el, { x, y, s: Math.max(0, k) * s, r, o: k > 0.02 ? 1 : 0 });
  return k;
}
/** a small still figure baked into markup (flat coords) */
export const fig = (c, o, { x = 0, y = 0, s = 0.5, flip = false, armF = 0, armB = 0, head = 0 } = {}) =>
  `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})">${bakeArms(tiltHead(person(c, { holdF: '', holdB: '', ...o }), head), armF, armB)}</g>`;
/** a cream label with italic writing (origin centre) */
export function label(c, text, { size = 18, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.4, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a label tag on a string, to hang over someone (origin at the knot; the tag hangs below) */
export function tagOnString(c, text, { size = 17, len = 1400 } = {}) {
  const ww = text.length * size * 0.5 + size * 1.4;
  return `<path d="M0 ${-len}V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g transform="translate(0 ${size * 0.9})">${label(c, text, { size, w: ww })}</g>`;
}
/** blush of shame: two big rosy cheeks (head coords), to put on a head with addToHead */
export function shameCheeks(c) {
  return `<path d="${c.poly(c.circ(1, 6, 5.4, 12))}${c.poly(c.circ(15, 6, 3.8, 10))}" fill="${C.curtain}" opacity=".75"/>`;
}
/** an angry red flush and knitted brows (head coords) */
export function angryFace(c) {
  return `<path d="${c.poly(c.circ(1, 5, 6, 12))}${c.poly(c.circ(15, 5, 4.2, 10))}" fill="${C.terracotta}" opacity=".55"/><path d="${c.ribbon([[0, -9], [7, -6]], 2.2)}${c.ribbon([[10, -6], [16, -9]], 2)}" fill="${C.inkSoft}"/>`;
}
/** a puff of anger / steam (origin centre) */
export function puff(c, r = 16, col = mix(C.curtain, C.terracotta, 0.4)) {
  return sheet().p(c.cut(c.star(0, 0, r, r * 0.55, 7, c.rr(0, 1)), 0.6, 4), col).out();
}
/** three dots of silence in a small bubble */
export function hush(c, { dir = 1 } = {}) {
  const s = sheet();
  s.p(c.cut([...c.blob(0, -22, 26, 17, 12, 0.05), [dir * 6, -6], [dir * 2, 2], [dir * -4, -7]], 0.4, 4), C.cream);
  s.x(c.poly(c.circ(-10, -22, 2.8, 8)) + c.poly(c.circ(0, -22, 2.8, 8)) + c.poly(c.circ(10, -22, 2.8, 8)), C.inkSoft);
  return s.out();
}
/** little drops of sweat / tears of embarrassment (origin centre) */
export function drops(c, col = mix(C.skyVeil, C.lake, 0.4)) {
  return sheet().x(c.poly([[0, -8], [4, 0], [2.4, 4], [-2.4, 4], [-4, 0]]) + c.poly(c.tr([[0, -8], [4, 0], [2.4, 4], [-2.4, 4], [-4, 0]], 12, 6, 0.8)), col).out();
}

/* ================================================================== the man with dropsy */
/** his swollen body (body coords of a standing person): a bloated belly and puffy legs, a heavy jowl */
export function swollen(c, o) {
  const s = sheet();
  const rs = shade(o.robe, -0.1);
  s.p(c.cut([[-28, -124], [-6, -134], [26, -130], [50, -112], [62, -84], [58, -50], [42, -30], [10, -22], [-24, -28], [-44, -50], [-46, -84], [-38, -110]], 0.6, 6), o.robe);
  s.x(c.ribbon(c.arc(12, -78, 44, 48, -0.9, 1.1, 10), 2.6), rs, 'opacity=".6"');
  s.x(c.ribbon(c.arc(-8, -70, 30, 40, 1.9, 3.6, 10), 2.2), rs, 'opacity=".45"');
  s.p(c.cut([[-40, -100], [40, -104], [52, -96], [-44, -92]], 0.4, 6), o.belt || C.rope);
  // swollen ankles over the feet
  s.p(c.cut(c.ell(-9, -8, 15, 9, 12), 0.4, 4) + c.cut(c.ell(10, -8, 16, 9, 12), 0.4, 4), shade(o.skin, -0.05));
  return s.out();
}
export function swollenFace(c, o) {
  return sheet().p(c.cut(c.ell(7, 11, 20, 11, 14), 0.3, 4), o.skin).x(c.poly(c.circ(1, 8, 4, 10)), C.blush, 'opacity=".4"').x(c.ribbon(c.arc(12, 11, 4, 2, 0.3, PI - 0.3, 5), 1.1), shade(o.skin, -0.45)).out();
}
/** the sick man as markup: swollen, a stick in his hand */
export function dropsyMan(c, extra = {}) {
  const o = { ...DROPSY, ...extra };
  let m = person(c, { ...o, holdF: `<g transform="rotate(-8)">${sheet().p(c.ribbon([[0, -10], [4, 92]], 3.4), C.wood2).out()}</g>` });
  m = addToBody(m, swollen(c, o));
  m = addToHead(m, swollenFace(c, o));
  return m;
}

/* ================================================================== props */
/** a festive bolster (the back of a place at table), graded by honour: rank 0 gold, 1 rose, 2 teal; origin: bottom centre */
export function bolster(c, rank = 0, w = 64, h = 22) {
  const col = [mix(C.sun, C.ochre, 0.3), C.roseRobe, C.teal2][rank] || C.stone2;
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 2, -h], ...c.arc(0, -h, w / 2 - 2, 12, PI, 2 * PI, 10), [w / 2, 0]], 0.4, 5), col);
  s.x(c.ribbon([[-w / 2 + 6, -h * 0.55], [w / 2 - 6, -h * 0.55]], 2.4), shade(col, rank ? -0.2 : 0.35), 'opacity=".8"');
  if (rank === 0) s.x(c.poly(c.star(0, -h - 2, 7, 3, 5, 0)), C.cream);
  if (rank === 0) {
    let tas = '';
    for (let x = -w / 2 + 8; x < w / 2; x += 12) tas += c.cut([[x - 2, 0], [x + 2, 0], [x + 1, 8], [x - 1, 8]], 0.1, 2);
    s.p(tas, C.sun);
  }
  return s.out();
}
/** the host's couch at the head of the table: a raised couch with a gold-fringed cushion (origin: floor, centre) */
export function headCouch(c, w = 150, col = mix(C.curtain2, C.plumRobe, 0.3)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -22], [w / 2, -22], [w / 2, 0]], 0.4, 8), C.wood2);
  s.p(c.cut(c.rect(-w / 2 + 6, -4, 10, 6), 0.2, 3) + c.cut(c.rect(w / 2 - 16, -4, 10, 6), 0.2, 3), shade(C.wood2, -0.25));
  s.p(c.cut([[-w / 2 - 4, -22], [-w / 2 + 2, -40], [w / 2 - 2, -42], [w / 2 + 4, -22]], 0.5, 6), col);
  s.p(c.cut(c.ell(w / 2 - 14, -46, 18, 13, 12), 0.4, 4), shade(col, -0.12));
  let fr = '';
  for (let x = -w / 2; x < w / 2; x += 10) fr += c.cut([[x, -24], [x + 4, -24], [x + 3, -16], [x + 1, -16]], 0.1, 2);
  s.p(fr, C.sun);
  return s.out();
}
/** a straw mat (the lowest place); origin: floor centre */
export function strawMat(c, w = 110) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 6, -8], [w / 2 - 6, -8], [w / 2, 0]], 0.5, 6), mix(C.wheat, C.sand2, 0.4));
  let st = '';
  for (let x = -w / 2 + 8; x < w / 2 - 4; x += 8) st += c.ribbon([[x, -7], [x - 2, -1]], 1);
  s.x(st, C.wheat2, 'opacity=".7"');
  return s.out();
}
/** a long low table with a linen cloth (origin: floor at its left end, x0 → x0 + w); top at -h */
export function longTable(c, w = 600, h = 50, { cloth = C.linen, band: bandCol = C.indigo, wood = C.wood, full = true } = {}) {
  const s = sheet();
  let legs = '';
  for (let x = 24; x <= w - 24; x += (w - 48) / 3) legs += c.cut(c.rect(x - 7, -h + 10, 14, h - 10), 0.3, 5);
  s.p(legs, shade(wood, -0.15));
  s.p(c.cut([[-6, -h], [w + 6, -h - 1], [w + 6, -h + 8], [-6, -h + 9]], 0.4, 10), wood);
  if (full) {
    s.p(c.cut([[-10, -h - 4], [w + 10, -h - 5], [w + 16, -1], [-16, 0]], 0.6, 10), cloth);
    s.x(c.ribbon([[-8, -h + 16], [w + 8, -h + 15]], 5) + c.ribbon([[-14, -10], [w + 14, -11]], 7), bandCol, 'opacity=".55"');
    let fold = '';
    for (let x = 40; x < w; x += 70) fold += c.ribbon([[x, -h + 24], [x + c.rr(-4, 4), -14]], 1.4);
    s.x(fold, shade(cloth, -0.1), 'opacity=".6"');
  } else {
    s.p(c.cut([[-10, -h - 4], [w + 10, -h - 5], [w + 14, -h + 26], [w - 30, -h + 34], [w * 0.5, -h + 30], [30, -h + 35], [-14, -h + 27]], 0.6, 10), cloth);
    s.x(c.ribbon([[-8, -h + 20], [w + 8, -h + 19]], 5), bandCol, 'opacity=".55"');
  }
  return s.out();
}
/** a vine pergola seen from below: beams, leaves and hanging grapes (origin world; y0 = beam line) */
export function pergola(c, { x0 = -900, x1 = 2500, y0 = 150 } = {}) {
  const s = sheet();
  s.p(c.cut([[x0, y0 - 1600], [x1, y0 - 1600], [x1, y0 - 16], [x0, y0 - 14]], 0.6, 30), mix(C.wood3, C.plaster2, 0.3));
  let beams = '';
  for (let x = x0 + 40; x < x1; x += 150) beams += c.cut([[x, y0 - 30], [x + 22, y0 - 30], [x + 22, y0 + 6], [x, y0 + 6]], 0.3, 5);
  s.p(beams, C.wood2);
  s.p(c.cut([[x0, y0 - 16], [x1, y0 - 18], [x1, y0 - 2], [x0, y0]], 0.4, 20), C.wood);
  let lv = '', lv2 = '', gr = '';
  for (let x = x0; x < x1; x += 34) {
    const y = y0 + c.rr(-10, 14);
    lv += c.cut(c.blob(x, y, c.rr(18, 26), c.rr(10, 16), 8, 0.25), 0.8, 4);
    if (c.chance(0.55)) lv2 += c.cut(c.blob(x + 16, y + c.rr(8, 20), c.rr(12, 18), c.rr(8, 12), 8, 0.25), 0.8, 4);
  }
  s.p(lv, C.moss).p(lv2, C.leaf);
  for (let x = x0 + 60; x < x1; x += c.rr(110, 190)) {
    const gy = y0 + c.rr(22, 40);
    for (let k = 0; k < 9; k++) { const r = Math.floor(k / 3), cc = k % 3; gr += c.poly(c.circ(x + (cc - 1) * 7 + r * 1.5, gy + r * 7, 4.2, 8)); }
    gr += c.poly(c.circ(x + 2, gy + 22, 4.2, 8));
  }
  s.p(gr, mix(C.plumRobe, C.indigo, 0.35));
  return s.out();
}

/* ================================================================== the house of the ruler of the Pharisees */
export const RH = { FL: 736, SEAT: 662, TOP: 612, TX0: 500, TX1: 1110, JX: 800, SEATS: [560, 640, 720, 880, 960, 1040], HX: 1176, HY: 718, GATE: [236, 372], HONOUR: [960, 1040] };
/**
 * The court of the ruler's house at noon on the sabbath: sky and a far garden with the town; a row of columns and a
 * low parapet (the gateway to the street on the left); the vine pergola overhead; a stone floor; the long table with
 * the dishes; the host's couch at its head (right). Layers between for the scene's people:
 * backL (seated behind the table), tableL, frontL (standing in front), fx.
 */
export function rulerHouse(S, { skyCols = NOON, honour = true } = {}) {
  const c = makeCutter('lk14-ruler-house');
  const { FL, SEAT, TOP, TX0, TX1, GATE } = RH;
  const sk = sky(S, skyCols);
  const view = S.layer({ par: 0.1, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [14, 6, 3], lens: [900, 330, 120], color: mix(C.hillMid, C.hillFar, 0.3), trees: 20, treeColor: C.sage, treeH: 20 });
  view.add(h1.markup + town(c, { x: 520, y: h1.fn(520) + 12, n: 7, spread: 320, sc: 0.5 }) + town(c, { x: 1250, y: h1.fn(1250) + 12, n: 5, spread: 240, sc: 0.46 }));
  let gtrees = '';
  for (let x = -300; x < 1900; x += c.rr(120, 200)) gtrees += c.chance(0.5) ? cypress(c, x, 540, c.rr(120, 170)) : olive(c, x, 546, c.rr(0.5, 0.7));
  view.add(band(c, { y: 530, amps: [5, 2], lens: [600, 200], color: mix(C.hillNear, C.sage, 0.3) }).markup + gtrees);
  // the columns, the parapet, the gateway
  const colL = S.layer({ par: 0.3, sh: 4 });
  const wcol = mix(C.plaster, C.peach, 0.14);
  const w = sheet();
  w.p(c.cut([[-900, 528], [2500, 528], [2500, 612], [-900, 612]], 0.6, 20), wcol);
  w.p(c.cut([[-900, 520], [2500, 520], [2500, 532], [-900, 532]], 0.4, 20), shade(wcol, -0.1));
  let tiles = '';
  for (let x = -880; x < 2500; x += 46) tiles += c.cut(c.rect(x, 556, 30, 30), 0.3, 5);
  w.x(tiles, shade(wcol, -0.06), 'opacity=".7"');
  // the gateway (a tall wall with a doorway, on the left)
  w.p(c.cut([[-900, 200], [GATE[1] + 20, 200], [GATE[1] + 20, 612], [-900, 612]], 0.6, 16) + c.hole([[GATE[0], 612], [GATE[0], 400], ...c.arc((GATE[0] + GATE[1]) / 2, 400, (GATE[1] - GATE[0]) / 2, 50, PI, 2 * PI, 10), [GATE[1], 400], [GATE[1], 612]], 0.4, 6), mix(wcol, C.clay, 0.1));
  w.p(c.ribbon([[GATE[0], 612], [GATE[0], 400], ...c.arc((GATE[0] + GATE[1]) / 2, 400, (GATE[1] - GATE[0]) / 2, 50, PI, 2 * PI, 10), [GATE[1], 400], [GATE[1], 612]], 10), C.wood2);
  let cols = '', caps = '';
  [470, 650, 950, 1130, 1310, 1490].forEach((x) => { cols += c.cut([[x - 15, 612], [x - 13, 250], [x + 13, 250], [x + 15, 612]], 0.3, 10); caps += c.cut(c.rect(x - 22, 240, 44, 16), 0.3, 5) + c.cut(c.rect(x - 22, 600, 44, 14), 0.3, 5); });
  w.p(cols, mix(C.stone, C.cream, 0.4));
  w.p(caps, mix(C.stone2, C.sand2, 0.3));
  w.x(cols.length ? [470, 650, 950, 1130, 1310, 1490].map((x) => c.ribbon([[x + 6, 600], [x + 6, 260]], 3)).join('') : '', shade(C.stone, -0.1), 'opacity=".45"');
  colL.add(w.out());
  // the street through the gateway
  colL.add(sheet().p(c.cut(c.rect(GATE[0] - 4, 380, GATE[1] - GATE[0] + 8, 232), 0.3, 6), mix(C.sand, C.dawn, 0.4)).p(c.cut([[GATE[0], 520], [GATE[0] + 40, 470], [GATE[0] + 90, 480], [GATE[1], 440], [GATE[1], 612], [GATE[0], 612]], 0.4, 6), mix(C.plaster2, C.skyBlue, 0.25)).out());
  // the pergola
  const vineL = S.layer({ par: 0.34, sh: 5 });
  vineL.add(pergola(c, { y0: 236 }));
  // the floor
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  const fc = mix(C.stone, C.sand, 0.35);
  f.p(c.cut([[-900, 606], [2500, 606], [2500, 1700], [-900, 1700]], 0.6, 20), fc);
  let tl = '';
  [626, 652, 686, 730, 790, 870].forEach((y) => { tl += c.ribbon([[-900, y], [2500, y + c.rr(-1, 1)]], 1.2); });
  for (let k = -20; k <= 20; k++) { const xb = 800 + k * 90; tl += c.ribbon([[800 + (xb - 800) * 0.6, 606], [800 + (xb - 800) * 2.2, 1300]], 1.1); }
  f.x(tl, shade(fc, -0.14), 'opacity=".45"');
  f.p(c.cut([[430, 690], [1180, 690], [1260, 800], [360, 800]], 0.6, 12), mix(C.curtain, C.clay, 0.3));
  let dia = '';
  for (let x = 400; x < 1230; x += 44) dia += c.poly([[x, 745], [x + 9, 734], [x + 18, 745], [x + 9, 756]]);
  f.x(dia, C.cream, 'opacity=".6"');
  floorL.add(f.out());
  // bolsters of the places (visible where no one sits)
  const bolL = S.layer({ par: 0.43, sh: 3 });
  const bolsters = RH.SEATS.map((x, i) => { const hon = RH.HONOUR.includes(x) && honour; return { x, i, el: bolL.add(`<g transform="translate(${x} ${TOP - 4})">${hon ? bolster(c, 0, 104, 62) : bolster(c, i % 2 ? 1 : 2, 70, 44)}</g>`) }; });
  const backL = S.layer({ par: 0.44, sh: 4 });
  const tableL = S.layer({ par: 0.46, sh: 5 });
  tableL.add(`<g transform="translate(${TX0} ${SEAT + 2})">${longTable(c, TX1 - TX0, SEAT + 2 - TOP)}</g>`);
  const dishes = [[540, bowl(c, { food: 'bread', color: C.stone2 })], [598, cup(c)], [676, loaf(c, 14)], [742, bowl(c, { food: 'fruit', color: C.skyVeil })], [830, cup(c, C.clay)], [868, loaf(c, 12)], [930, `<g transform="scale(.8)">${grapes(c)}</g>`], [1000, bowl(c, { food: 'bread', color: C.stone2 })], [1070, `<g transform="scale(.5)">${jug(c)}</g>`]];
  tableL.add(dishes.map(([x, m]) => `<g transform="translate(${x} ${TOP - 2})">${m}</g>`).join(''));
  const couchL = S.layer({ par: 0.48, sh: 4 });
  couchL.add(`<g transform="translate(${RH.HX} ${RH.HY + 2})">${headCouch(c, 150)}</g>`);
  const frontL = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 3 });
  // the sabbath tag hanging from the pergola (right)
  const sabL = S.layer({ par: 0.36, sh: 4 });
  const sab = hanging(sabL, sabbathTag(c, tr("szabat", "Sabbath")), { x: 1080, y: 300, len: 900 });
  return {
    c, sk, view, colL, vineL, floorL, bolL, bolsters, backL, tableL, couchL, frontL, fx, sab,
    update(T) {
      swing(sab, 1080, 300, T, 1.2, 0.7, 1);
    },
  };
}
/** the everyday cast at the ruler's table: guests (seated puppets behind the table) and the host on his couch */
export function rulerTable(S, R, { seats = [0, 1, 2, 3], hostPose = 'sit' } = {}) {
  const c = S.c;
  const guests = seats.map((si, i) => ({ i, si, x: RH.SEATS[si], p: S.puppet(R.backL.add(person(c, { ...PHAR[i % PHAR.length], pose: 'sit' }))), seed: c.rr(0, 9) }));
  const host = S.puppet(R.frontL.add(person(c, { ...RULER, pose: hostPose })));
  return {
    guests, host,
    /** a still table: look = +1 all look at Jesus (centre), 0 straight; per-guest overrides by index */
    set(t, T, { look = 1, arms = {}, heads = {}, hostArmF = 30, hostArmB = 10, hostHead = 4, hostLean = 0 } = {}) {
      guests.forEach((g) => {
        const toJ = g.x < RH.JX ? 1 : -1; // facing Jesus
        g.p.set({ x: g.x, y: RH.SEAT, s: 0.98, flip: toJ < 0, armF: (arms[g.i] ?? [20])[0], armB: (arms[g.i] ?? [20, 10])[1] ?? 10, head: heads[g.i] ?? -2 + look * 4, blink: blinkAt(T, g.seed) });
      });
      host.set({ x: RH.HX, y: RH.HY, s: 1.02, flip: true, armF: hostArmF, armB: hostArmB, head: hostHead, lean: hostLean, blink: blinkAt(T, 3) });
    },
  };
}

/* ================================================================== the well and the pit (Łk 14,5) */
/** a stone well split in two: back (posts, beam, pulley, dark mouth) and front (the drum), so someone can rise out of it;
 *  origin: foot centre; the mouth at y -h, the pulley at (0, -h - 108) */
export function wellParts(c, { r = 70, h = 52 } = {}) {
  const b = sheet();
  b.p(c.cut(c.rect(-r + 6, -h - 122, 10, 124), 0.3, 6) + c.cut(c.rect(r - 16, -h - 122, 10, 124), 0.3, 6), C.wood2);
  b.p(c.cut(c.rect(-r - 6, -h - 130, 2 * r + 12, 12), 0.4, 6), C.wood);
  b.p(c.cut(c.circ(0, -h - 108, 12, 14), 0.3, 4), C.wood3);
  b.x(c.poly(c.circ(0, -h - 108, 3.4, 8)), C.wood2);
  b.p(c.cut(c.ell(0, -h, r, 16, 26), 0.4, 5), shade(C.stone, -0.25));
  b.p(c.cut(c.ell(0, -h + 2, r - 9, 11, 24), 0.3, 5), mix(C.soilDark, C.lakeDeep, 0.35));
  const f = sheet();
  f.p(c.cut([[-r, -h], ...c.arc(0, -h, r, 16, PI, 0, 14).reverse(), [r, -h], [r, 0], ...c.arc(0, 0, r, 12, 0, PI, 14), [-r, 0]], 0.6, 6), C.stone);
  let st = '';
  for (let row = 0; row < 3; row++) {
    const y = -h + 13 + row * 14;
    st += c.ribbon(c.arc(0, y, r, 12, 0.05, PI - 0.05, 14), 1.3);
    for (let k = 0; k < 6; k++) { const a = 0.35 + k * 0.45 + (row % 2) * 0.22; if (a > PI - 0.2) continue; const x = Math.cos(a) * r; st += c.ribbon([[x, y + Math.sin(a) * 12], [x, y + Math.sin(a) * 12 + 13]], 1.2); }
  }
  f.x(st, shade(C.stone, -0.2), 'opacity=".55"');
  f.p(c.ribbon(c.arc(0, -h, r + 2, 17, 0, PI, 16), 7), shade(C.stone, 0.12));
  f.x(c.cut(c.blob(-r * 0.55, -h + 24, 12, 6, 7, 0.2), 0.3, 3), C.moss, 'opacity=".6"');
  return { back: b.out(), front: f.out() };
}
/** a pit / cistern in the field: the dark hole and the earth lip in front (origin: centre of the hole at ground level) */
export function pitParts(c, w = 170) {
  const hole = sheet().p(c.cut(c.ell(0, 0, w / 2, 22, 24), 0.8, 5), shade(C.soil, -0.1)).p(c.cut(c.ell(0, 4, w / 2 - 10, 14, 22), 0.6, 5), C.soilDark).out();
  const lp = [[-w / 2 - 70, 30], [-w / 2 - 30, 6], [-w / 2 - 6, -4], ...c.arc(0, 2, w / 2 + 2, 20, PI, 0, 16).reverse().slice(1, -1), [w / 2 + 6, -4], [w / 2 + 30, 6], [w / 2 + 70, 30], [w / 2 + 60, 190], [-w / 2 - 60, 190]];
  const lip = sheet().p(c.cut(lp, 0.9, 6), mix(C.soil, C.sand2, 0.5))
    .x(c.cut(c.blob(-w * 0.3, 18, 14, 6, 8, 0.2), 0.4, 3) + c.cut(c.blob(w * 0.25, 22, 11, 5, 8, 0.2), 0.4, 3) + c.cut(c.blob(w * 0.02, 34, 9, 4, 8, 0.2), 0.4, 3), C.rock2, 'opacity=".8"')
    .x(c.ribbon(c.arc(0, 4, w / 2 - 4, 16, 0.25, PI - 0.25, 12), 3), shade(C.soil, -0.2), 'opacity=".5"').out();
  return { hole, lip };
}
/** a straight rope from (0,0) to (100,0): stretch it with ropeBetween */
export const ropeUnit = (c, w = 3, col = C.rope) => `<path d="M0 ${-w / 2}L100 ${-w / 2}L100 ${w / 2}L0 ${w / 2}Z" fill="${col}"/>`;
/** stretch a unit rope between two points */
export function ropeBetween(el, [x0, y0], [x1, y1], o = 1) {
  const L = Math.hypot(x1 - x0, y1 - y0), a = (Math.atan2(y1 - y0, x1 - x0) * 180) / PI;
  pose(el, { x: x0, y: y0, sx: Math.max(0.01, L / 100), sy: 1, r: a, o });
}

/* ================================================================== the wedding hall (the parable of the places) */
export const WH = { FL: 742, SEAT: 668, TOP: 616, TX0: 500, TX1: 1060, SEATS: [548, 626, 704, 782, 860, 938, 1016], COUPLE: [782, 860], FIRST: [1128, 724], LAST: [446, 742], DOOR: [262, 392] };
/** the wedding guests at the table (not the couple): seat indices */
export const WG = [0, 1, 2, 5, 6];
export function weddingLook(c, i) {
  const o = folk(c, i % 2 === 0);
  const mantles = [C.roseRobe, C.skyVeil, C.wheatRobe, C.sageRobe, C.blushVeil, C.mauve, C.tealRobe];
  return { ...o, robe: i % 2 ? C.linen : C.cream, mantle: mantles[i % mantles.length], belt: i % 2 ? C.sun : C.ochre, veil: o.hairStyle === 'veil' ? [C.blushVeil, C.skyVeil, C.linen2][i % 3] : o.veil };
}
/**
 * The wedding hall as a painted flat: the garden through three arched windows, a warm rose wall with a frieze, the
 * doorway on the left (from the street), paper lanterns and garlands, the long table with a rose band, the bridal canopy
 * over the couple at its middle, the gold couch of the first place at its right end and the straw mat of the last place
 * at its left end by the door. Layers for the scene: seatL (behind the table), tableL, frontL (in front), fx.
 */
export function weddingHall(S) {
  const c = makeCutter('lk14-wedding-hall');
  const { FL, SEAT, TOP, TX0, TX1, DOOR } = WH;
  sky(S, FEAST);
  const far = S.layer({ par: 0.12, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [14, 6, 3], lens: [900, 330, 120], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 20 });
  let tr_ = '';
  for (let x = 380; x < 1300; x += 90) tr_ += cypress(c, x + c.rr(-14, 14), 540, c.rr(110, 160));
  far.add(h1.markup + band(c, { y: 520, amps: [6, 3], lens: [600, 200], color: mix(C.hillNear, C.sage, 0.3) }).markup + tr_ + olive(c, 700, 548, 0.6));
  const wallL = S.layer({ par: 0.3, sh: 5 });
  const plaster = mix(C.plaster, C.roseRobe, 0.22), plaster2 = mix(C.plaster2, C.curtain, 0.14);
  const s = sheet();
  const arch = (x, w, y0, ys) => [[x - w / 2, y0], [x - w / 2, ys], ...c.arc(x, ys, w / 2, w * 0.5, PI, 2 * PI, 12), [x + w / 2, ys], [x + w / 2, y0]];
  const WINS = [600, 800, 1000, 1200];
  let holes = WINS.map((x) => c.hole(arch(x, 116, 560, 380), 0.3, 6)).join('');
  holes += c.hole([[DOOR[0], FL - 130], [DOOR[0], 450], ...c.arc((DOOR[0] + DOOR[1]) / 2, 450, (DOOR[1] - DOOR[0]) / 2, 56, PI, 2 * PI, 12), [DOOR[1], 450], [DOOR[1], FL - 130]], 0.3, 6);
  s.p(c.cut([[-900, -1400], [2500, -1400], [2500, FL - 126], [-900, FL - 126]], 0.6, 20) + holes, plaster);
  s.p(c.cut([[-900, 560], [2500, 560], [2500, FL - 126], [-900, FL - 126]], 0.5, 16) + c.hole([[DOOR[0], FL - 120], [DOOR[0], 556], [DOOR[1], 556], [DOOR[1], FL - 120]], 0.3, 6), plaster2);
  let rims = WINS.map((x) => c.ribbon(arch(x, 116, 560, 380).slice(1, -1), 7)).join('');
  rims += c.ribbon([[DOOR[0], 612], [DOOR[0], 450], ...c.arc((DOOR[0] + DOOR[1]) / 2, 450, (DOOR[1] - DOOR[0]) / 2, 56, PI, 2 * PI, 12), [DOOR[1], 450], [DOOR[1], 612]], 10);
  s.p(rims, C.sun);
  s.p(c.cut([[-900, 262], [2500, 262], [2500, 292], [-900, 292]], 0.4, 14), mix(C.teal2, C.tealRobe, 0.3));
  s.x(c.ribbon([[-900, 265], [2500, 265]], 3) + c.ribbon([[-900, 289], [2500, 289]], 3), C.sun);
  let vine = '';
  for (let x = -880; x < 2500; x += 40) vine += c.cut(c.ell(x, 277 + (Math.floor(x / 40) % 2 ? -3 : 3), 8, 4, 8, 0.5), 0.2, 3);
  s.x(vine, C.cream, 'opacity=".8"');
  s.p(c.cut([[-900, -1400], [2500, -1400], [2500, 200], [-900, 200]], 0.5, 20), mix(C.wood3, C.plaster2, 0.4));
  let beams = '';
  for (let x = -880; x < 2500; x += 130) beams += c.cut(c.rect(x, 188, 30, 26), 0.3, 5);
  s.p(beams, C.wood);
  wallL.add(s.out());
  // the street seen through the doorway
  wallL.add(sheet().p(c.cut(c.rect(DOOR[0] - 4, 420, DOOR[1] - DOOR[0] + 8, FL - 540), 0.3, 6), mix(C.dawn, C.sand, 0.4)).p(c.cut([[DOOR[0], 560], [DOOR[0] + 50, 520], [DOOR[0] + 80, 540], [DOOR[1], 510], [DOOR[1], FL - 120], [DOOR[0], FL - 120]], 0.4, 6), mix(C.plaster2, C.skyBlue, 0.3)).out());
  // floor
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  const fc = mix(C.stone, C.sand, 0.4);
  f.p(c.cut([[-900, FL - 128], [2500, FL - 128], [2500, 1700], [-900, 1700]], 0.6, 20), fc);
  let tl = '';
  [634, 660, 694, 740, 800, 880].forEach((y) => { tl += c.ribbon([[-900, y], [2500, y + c.rr(-1, 1)]], 1.2); });
  for (let k = -20; k <= 20; k++) { const xb = 800 + k * 84; tl += c.ribbon([[800 + (xb - 800) * 0.6, FL - 126], [800 + (xb - 800) * 2.3, 1300]], 1.1); }
  f.x(tl, shade(fc, -0.14), 'opacity=".45"');
  floorL.add(f.out());
  // the bridal canopy on two poles over the couple
  const canL = S.layer({ par: 0.42, sh: 4 });
  const cm = (WH.COUPLE[0] + WH.COUPLE[1]) / 2;
  canL.add(sheet().p(c.ribbon([[cm - 110, SEAT - 10], [cm - 110, 406]], 6) + c.ribbon([[cm + 110, SEAT - 10], [cm + 110, 406]], 6), C.wood2).out() + `<g transform="translate(${cm} 400)">${canopy(c, 250, 40)}</g>`);
  const seatL = S.layer({ par: 0.44, sh: 4 });
  const tableL = S.layer({ par: 0.46, sh: 5 });
  tableL.add(`<g transform="translate(${TX0} ${SEAT + 2})">${longTable(c, TX1 - TX0, SEAT + 2 - TOP, { band: C.curtain })}</g>`);
  const dishes = [[530, loaf(c, 13)], [580, cup(c, C.sun)], [650, bowl(c, { food: 'fruit', color: C.skyVeil })], [720, cup(c)], [800, `<g transform="scale(.9)">${grapes(c)}</g>`], [850, loaf(c, 15)], [910, cup(c, C.clay)], [960, bowl(c, { food: 'bread', color: C.stone2 })], [1030, `<g transform="scale(.5)">${jug(c)}</g>`]];
  tableL.add(dishes.map(([x, m]) => `<g transform="translate(${x} ${TOP - 2})">${m}</g>`).join(''));
  // the first place and the last
  const placeL = S.layer({ par: 0.48, sh: 4 });
  placeL.add(`<g transform="translate(${WH.FIRST[0]} ${WH.FIRST[1] + 4})">${headCouch(c, 130, mix(C.sun, C.ochre, 0.3))}</g>`);
  placeL.add(`<g transform="translate(${WH.FIRST[0] + 8} ${WH.FIRST[1] - 60})">${sheet().p(c.cut(c.star(0, 0, 12, 5, 5), 0.3, 3), C.sun).out()}</g>`);
  placeL.add(`<g transform="translate(${WH.LAST[0]} ${WH.LAST[1] + 2})">${strawMat(c, 96)}</g>`);
  const frontL = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 3 });
  // lanterns and garlands on the flies
  const flyL = S.layer({ par: 0.36, sh: 5 });
  const garl = [[380, 200], [590, 210], [810, 200], [1020, 210]].map(([x, w], i) => ({ x, i, el: flyL.add(`<g><path d="M0 -1600V0M${w} -1600V0" stroke="rgba(74,54,34,.45)" stroke-width="1.1" fill="none"/>${garland(c, w, 26)}</g>`) }));
  const lamps = [500, 700, 900, 1100].map((x, i) => ({ x, i, el: hanging(flyL, paperLantern(c, { col: [C.apricot, C.roseRobe, C.wheat, C.skyVeil][i] }), { x, y: 300, len: 900 }) }));
  storyFrame(S);
  return {
    c, far, wallL, floorL, canL, seatL, tableL, placeL, frontL, fx, flyL,
    update(t, T) {
      garl.forEach((g) => pose(g.el, { x: g.x, y: 216, r: T ? Math.sin(T * 0.6 + g.i) * 0.4 : 0 }));
      lamps.forEach((l) => pose(l.el, { x: l.x, y: 316 + (l.i % 2) * 20, r: T ? Math.sin(T * 1.1 + l.i) * 2 : 0 }));
    },
  };
}
/** the seated wedding guests and the couple as one still sprite; mood: 'mid' (at ease), 'left' (all turn to the door end),
 *  'right' (to the first place), 'toast' (cups raised to the first place) */
export function weddingTable(c, mood = 'mid') {
  const mem = [];
  WG.forEach((si, k) => {
    const x = WH.SEATS[si] - 780;
    const toFirst = mood === 'right' || mood === 'toast';
    const flip = mood === 'left' ? true : toFirst ? false : x > 0;
    const o = { ...weddingLook(c, k), pose: 'sit' };
    if (mood === 'toast') o.holdF = `<g transform="rotate(100)">${cup(c, [C.sun, C.clay, C.pot][k % 3])}</g>`;
    mem.push({ x, y: 0, s: 0.96, flip, head: mood === 'left' ? 8 : mood === 'mid' ? c.rr(-4, 4) : -6, armF: mood === 'toast' ? 100 : 24 + k * 4, armB: mood === 'toast' ? 20 : 10, o });
  });
  const cc = makeCutter('lk14-couple');
  mem.push({ x: WH.COUPLE[0] - 780, y: 0, s: 0.96, flip: false, head: mood === 'left' ? -4 : 0, armF: mood === 'toast' ? 100 : 30, armB: 10, o: { ...GROOM, pose: 'sit', holdF: mood === 'toast' ? `<g transform="rotate(100)">${cup(cc, C.sun)}</g>` : '' } });
  mem.push({ x: WH.COUPLE[1] - 780, y: 0, s: 0.94, flip: mood !== 'toast' && mood !== 'right', head: 4, armF: 30, armB: 10, o: { ...BRIDE, pose: 'sit' } });
  return pose3(c, mem) + addCrowns(cc);
}
function addCrowns(c) {
  // flower wreaths on the couple's heads (drawn over the sprite at their head spots)
  const gx = WH.COUPLE[0] - 780, bx = WH.COUPLE[1] - 780, hy = -105 * 0.96;
  return `<g transform="translate(${gx + 2} ${hy}) scale(.96)">${wreath(c)}</g><g transform="translate(${bx - 2} ${hy}) scale(-.94 .94)">${wreath(c)}</g>`;
}

/* ================================================================== the emblem of the proud and the humble (Łk 14,11) */
export const EMB = { W: 400, H: 312, GROUND: 222, PED: 74, LX: -92, RX: 92 };
/** a painted board hung on two strings: back (sky, frame; origin at its top centre), strip (the ground band and the
 *  lower frame, drawn in front of the pedestals), pedestal (origin: its top centre), plus a little dark slot. */
export function emblemParts(S) {
  const c = makeCutter('lk14-emblem');
  const { W, H, GROUND, PED } = EMB;
  const id = S.id('embsky');
  S.defs(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(C.skyBlue, C.cream, 0.3)}"/><stop offset="1" stop-color="${mix(C.dawn, C.cream, 0.4)}"/></linearGradient>`);
  const fr = mix(C.wood3, C.ochre, 0.4);
  const b = sheet();
  b.p(c.cut(c.rect(-W / 2 - 10, -10, W + 20, H + 20), 0.6, 9), fr);
  b.p(c.cut(c.rect(-W / 2 - 4, -4, W + 8, H + 8), 0.4, 9), C.haloRim);
  const strings = `<path d="M${-W * 0.34} -1800V-10M${W * 0.34} -1800V-10" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  const back = strings + b.out() + `<rect x="${-W / 2}" y="0" width="${W}" height="${H}" fill="url(#${id})"/>` + sheet().p(c.ridge(c.wave(GROUND - 30, [6, 3], [200, 70]), -W / 2, W / 2 - 12, GROUND, 10, 0.6), mix(C.hillMid, C.sage2, 0.3)).out();
  const s = sheet();
  s.p(c.cut([[-W / 2 - 10, GROUND], [W / 2 + 10, GROUND], [W / 2 + 10, H + 10], [-W / 2 - 10, H + 10]], 0.4, 9), fr);
  s.p(c.cut([[-W / 2, GROUND], [W / 2, GROUND], [W / 2, H], [-W / 2, H]], 0.5, 9), mix(C.hillNear, C.sand, 0.3));
  s.x(c.ribbon([[-W / 2 + 10, GROUND + 16], [W / 2 - 10, GROUND + 15]], 1.4), shade(C.hillNear, -0.2), 'opacity=".4"');
  const strip = s.out();
  const pedestal = (col) => sheet().p(c.cut([[-36, 0], [36, 0], [32, 10], [32, PED + 10], [-32, PED + 10], [-32, 10]], 0.4, 6), col)
    .p(c.cut(c.rect(-40, -6, 80, 10), 0.3, 5), shade(col, 0.15)).x(c.ribbon([[-14, 14], [-14, PED + 6]], 2) + c.ribbon([[12, 14], [12, PED + 6]], 2), shade(col, -0.15), 'opacity=".5"').out();
  return { back, strip, pedL: pedestal(mix(C.stone2, C.sand2, 0.3)), pedR: pedestal(mix(C.sun, C.stone, 0.5)) };
}

/* ================================================================== the host's own courtyard (Łk 14,12–14) */
export const CF = { FL: 742, SEAT: 668, TOP: 616, TX0: 530, TX1: 1060, SEATS: [586, 690, 796, 902, 1006], HX: 1136, GATE: [300, 430] };
/** friends, brothers, relatives, rich neighbours */
export const KIN = [
  { robe: C.dustyBlue, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather },           // a friend
  { robe: C.linen2, mantle: mix(C.curtain2, C.plumRobe, 0.3), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.curtain2, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.sun }, // a brother (the host's colours)
  { robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.linen2, veil2: C.roseRobe, hair: C.hair3, skin: C.skin2, beard: 'none', belt: C.ochre },  // a kinswoman
  { robe: C.linen, mantle: mix(C.plumRobe, C.indigo, 0.2), hair: C.hair3, hairStyle: 'wrap', veil: C.lavender, veil2: C.plumRobe, beard: 'full', skin: C.skin3, belt: C.sun, mantleArm: true }, // a rich neighbour
];
/**
 * The ruler's own courtyard as a painted flat: a garden sky (a dawn sky can fade in over it, with a rising sun behind
 * the hills), the far hills, a low wall with a gate on the left and a fig tree on the right, a vine arbour, the table.
 */
export function courtFlat(S) {
  const c = makeCutter('lk14-court-flat');
  const { FL, SEAT, TOP, TX0, TX1, GATE } = CF;
  sky(S, GARDEN);
  const dawnL = sky(S, DAWN, { name: 'dawn', rise: 0 }).layer;
  dawnL.fade(0);
  const sunL = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
  const sunUp = sunL.add(`<g><circle r="260" fill="url(#warm-glow)"/><path d="${rayPath(c)}" fill="${C.halo}" opacity=".55"/><circle r="64" fill="${C.sun}"/><circle r="50" fill="${mix(C.sun, C.halo, 0.5)}"/></g>`);
  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = hillsWith(c, { y: 480, amps: [18, 7, 3], lens: [1000, 360, 120], color: mix(C.hillMid, C.hillFar, 0.25), trees: 16, treeColor: C.sage, treeH: 18 });
  far.add(h1.markup);
  const risenL = S.layer({ par: 0.1, sh: 2 });
  const wallL = S.layer({ par: 0.3, sh: 4 });
  const wc = mix(C.plaster, C.ochre, 0.18);
  const w = sheet();
  w.p(c.cut([[-900, 520], [GATE[0], 520], [GATE[0], FL - 124], [-900, FL - 124]], 0.6, 12) + c.cut([[GATE[1], 520], [2500, 520], [2500, FL - 124], [GATE[1], FL - 124]], 0.6, 16), wc);
  w.p(c.cut([[-900, 512], [GATE[0] + 4, 512], [GATE[0] + 4, 524], [-900, 524]], 0.3, 10) + c.cut([[GATE[1] - 4, 512], [2500, 512], [2500, 524], [GATE[1] - 4, 524]], 0.3, 10), shade(wc, -0.12));
  w.p(c.cut(c.rect(GATE[0] - 14, 440, 18, FL - 564), 0.3, 5) + c.cut(c.rect(GATE[1] - 4, 440, 18, FL - 564), 0.3, 5) + c.cut(c.rect(GATE[0] - 22, 428, GATE[1] - GATE[0] + 44, 16), 0.3, 6), C.wood2);
  wallL.add(w.out() + olive(c, 1250, 540, 0.9, { leaf: C.moss, leaf2: C.leaf }));
  // the fig tree / arbour over the table
  const arbL = S.layer({ par: 0.34, sh: 5 });
  const a = sheet();
  a.p(c.ribbon([[490, FL - 120], [496, 330]], 8) + c.ribbon([[1100, FL - 120], [1094, 330]], 8), C.wood2);
  a.p(c.ribbon([[440, 330], [1150, 326]], 10), C.wood);
  let lv = '', lv2 = '';
  for (let x = 420; x < 1180; x += 30) { lv += c.cut(c.blob(x, 326 + c.rr(-8, 8), c.rr(18, 24), c.rr(10, 14), 8, 0.25), 0.8, 4); if (c.chance(0.6)) lv2 += c.cut(c.blob(x + 12, 344 + c.rr(0, 16), c.rr(10, 16), c.rr(7, 11), 8, 0.25), 0.8, 4); }
  a.p(lv, C.moss).p(lv2, C.leaf);
  let gr = '';
  for (let x = 470; x < 1150; x += c.rr(90, 150)) for (let k = 0; k < 7; k++) gr += c.poly(c.circ(x + (k % 3 - 1) * 6, 352 + Math.floor(k / 3) * 6, 3.8, 8));
  a.p(gr, mix(C.plumRobe, C.indigo, 0.35));
  arbL.add(a.out());
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  const fc = mix(C.sand, C.stone, 0.4);
  f.p(c.cut([[-900, FL - 126], [2500, FL - 126], [2500, 1700], [-900, 1700]], 0.6, 20), fc);
  let st = '';
  for (let k = 0; k < 60; k++) st += c.cut(c.blob(c.rr(-600, 2200), c.rr(FL - 110, 980), c.rr(10, 22), c.rr(4, 8), 8, 0.2), 0.4, 4);
  f.x(st, shade(fc, -0.1), 'opacity=".6"');
  floorL.add(f.out());
  const seatL = S.layer({ par: 0.44, sh: 4 });
  const tableL = S.layer({ par: 0.46, sh: 5 });
  tableL.add(`<g transform="translate(${TX0} ${SEAT + 2})">${longTable(c, TX1 - TX0, SEAT + 2 - TOP, { band: C.teal2 })}</g>`);
  tableL.add([[570, loaf(c, 13)], [640, cup(c)], [740, bowl(c, { food: 'fruit', color: C.skyVeil })], [846, cup(c, C.clay)], [950, loaf(c, 14)], [1030, `<g transform="scale(.5)">${jug(c)}</g>`]].map(([x, m]) => `<g transform="translate(${x} ${TOP - 2})">${m}</g>`).join(''));
  const frontL = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 3 });
  const tagL = S.layer({ par: 0.4, sh: 5 });
  storyFrame(S);
  return { c, dawnL, sunL, sunUp, far, risenL, wallL, arbL, floorL, seatL, tableL, frontL, fx, tagL };
}
function rayPath(c) {
  let d = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; d += c.poly([[Math.cos(a - 0.05) * 70, Math.sin(a - 0.05) * 70], [Math.cos(a) * 420, Math.sin(a) * 420], [Math.cos(a + 0.05) * 70, Math.sin(a + 0.05) * 70]]); }
  return d;
}
/** a seated row for the courtyard table as a sprite: looks at seat positions; arms: 'rest' | 'invite' (a scroll raised) | 'open' (empty hands) */
export function courtRow(c, looks, { arms = 'rest', seats = CF.SEATS } = {}) {
  const mem = looks.map((o, k) => {
    const x = seats[k] - 800;
    const hold = arms === 'invite' ? `<g transform="rotate(90)">${invitation(c, 30)}</g>` : '';
    return { x, y: 0, s: 0.96, flip: false, head: arms === 'open' ? -8 : -4, armF: arms === 'invite' ? 110 : arms === 'open' ? 70 : 26, armB: arms === 'open' ? 60 : 10, o: { ...o, pose: 'sit', holdF: hold } };
  });
  return pose3(c, mem);
}

/* ================================================================== the kingdom feast (Łk 14,15) */
/** a golden medallion of the banquet of the kingdom: a table in light under a crown (origin: its centre) */
export function kingdomFeast(c, r = 70) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 40), 0.4, 5), C.haloRim);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.4, 5), mix(C.halo, C.cream, 0.4));
  let rays = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; rays += c.poly([[Math.cos(a - 0.08) * 12, -10 + Math.sin(a - 0.08) * 12], [Math.cos(a) * (r - 6), -10 + Math.sin(a) * (r - 6)], [Math.cos(a + 0.08) * 12, -10 + Math.sin(a + 0.08) * 12]]); }
  s.x(rays, C.sun, 'opacity=".35"');
  s.p(c.cut([[-r * 0.62, r * 0.18], [r * 0.62, r * 0.18], [r * 0.56, r * 0.3], [-r * 0.56, r * 0.3]], 0.3, 5), C.linen);
  s.p(c.cut(c.rect(-r * 0.52, r * 0.3, 6, r * 0.34), 0.2, 3) + c.cut(c.rect(r * 0.46, r * 0.3, 6, r * 0.34), 0.2, 3), C.wood2);
  s.p(c.cut([[-r * 0.3, r * 0.18], ...c.arc(-r * 0.2, r * 0.18, r * 0.12, r * 0.09, PI, 2 * PI, 6), [-r * 0.08, r * 0.18]], 0.2, 3) + c.cut([[r * 0.1, r * 0.18], ...c.arc(r * 0.2, r * 0.18, r * 0.11, r * 0.08, PI, 2 * PI, 6), [r * 0.31, r * 0.18]], 0.2, 3), C.wheat2);
  s.p(c.cut([[-6, r * 0.18], [-8, r * 0.02], [8, r * 0.02], [6, r * 0.18]], 0.2, 3), C.clay);
  s.p(c.cut([[-r * 0.28, -r * 0.3], [-r * 0.28, -r * 0.56], [-r * 0.14, -r * 0.42], [0, -r * 0.62], [r * 0.14, -r * 0.42], [r * 0.28, -r * 0.56], [r * 0.28, -r * 0.3]], 0.3, 4), C.sun);
  return `<circle r="${r * 2}" fill="url(#warm-glow)" opacity=".7"/>` + s.out();
}

/* ================================================================== the great supper (Łk 14,16–24) */
export const SU = { FL: 742, SEAT: 668, TOP: 616, TX0: 520, TX1: 1034, SEATS: [566, 640, 714, 788, 862, 936, 1004], MX: 462, DOOR: [1076, 1212], WINS: [640, 820, 1000] };
/**
 * The house of "a certain man" in the city, as a painted flat: an ochre room with three arched windows onto the town on
 * the hill (where the invitations fly), paper lamps that light at supper time (a dusk sky fades in behind), a wide
 * doorway on the right onto a street and its lanes, the long table heaped with food and its empty places.
 */
export function supperHall(S) {
  const c = makeCutter('lk14-supper-hall');
  const { FL, SEAT, TOP, TX0, TX1, DOOR, WINS } = SU;
  sky(S, EVE);
  const nightL = sky(S, EVE2, { name: 'eve2', rise: 0 }).layer;
  nightL.fade(0);
  const far = S.layer({ par: 0.12, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [900, 330, 120], color: mix(C.hillMid, C.duskViolet, 0.25), trees: 10, treeColor: mix(C.sage, C.duskViolet, 0.2), treeH: 18 });
  let hs = '';
  const HOUSES = [];
  for (let i = 0; i < 14; i++) { const x = 520 + i * 46 + c.rr(-8, 8), y = h1.fn(x) + 14 + c.rr(0, 30); HOUSES.push([x + 20, y - 20]); hs += house(c, x, y, c.rr(34, 50), c.rr(28, 40), { stairs: c.chance(0.4), wall: mix(C.plaster, C.dusk, 0.2), shadow: mix(C.plaster2, C.duskViolet, 0.3) }); }
  far.add(h1.markup + hs);
  const winLit = far.add(`<g opacity="0">${HOUSES.map(([x, y]) => `<path d="${c.poly(c.rect(x - 4, y - 2, 8, 9))}" fill="${C.lampFlame}"/>`).join('')}</g>`);
  // the street beyond the doorway
  const streetL = S.layer({ par: 0.2, sh: 3 });
  const st = sheet();
  st.p(c.cut([[DOOR[0] - 20, FL - 124], [DOOR[1] + 400, FL - 124], [DOOR[1] + 400, 900], [DOOR[0] - 20, 900]], 0.4, 8), mix(C.sand, C.dusk, 0.25));
  st.p(c.cut([[DOOR[0] - 10, FL - 124], [DOOR[0] - 10, 440], [DOOR[0] + 40, 430], [DOOR[0] + 44, FL - 150]], 0.4, 6), mix(C.plaster2, C.duskViolet, 0.3));
  st.p(c.cut([[DOOR[0] + 90, FL - 150], [DOOR[0] + 96, 450], [DOOR[1] + 20, 440], [DOOR[1] + 30, FL - 124]], 0.4, 6), mix(C.plaster, C.dusk, 0.25));
  st.p(c.cut(c.rect(DOOR[0] + 104, 520, 18, 26), 0.2, 3) + c.cut(c.rect(DOOR[0] + 12, 480, 14, 22), 0.2, 3), C.soilDark);
  st.p(c.cut([[DOOR[0] + 44, FL - 150], [DOOR[0] + 90, FL - 150], [DOOR[0] + 80, 470], [DOOR[0] + 56, 470]], 0.3, 5), mix(C.sand, C.dusk, 0.45));
  streetL.add(st.out());
  const wallL = S.layer({ par: 0.3, sh: 5 });
  const wc = mix(C.plaster, C.ochre, 0.3), wc2 = mix(C.plaster2, C.clay, 0.2);
  const s = sheet();
  const arch = (x, w, y0, ys) => [[x - w / 2, y0], [x - w / 2, ys], ...c.arc(x, ys, w / 2, w * 0.5, PI, 2 * PI, 12), [x + w / 2, ys], [x + w / 2, y0]];
  let holes = WINS.map((x) => c.hole(arch(x, 104, 540, 400), 0.3, 6)).join('');
  holes += c.hole([[DOOR[0], FL - 120], [DOOR[0], 450], ...c.arc((DOOR[0] + DOOR[1]) / 2, 450, (DOOR[1] - DOOR[0]) / 2, 60, PI, 2 * PI, 12), [DOOR[1], 450], [DOOR[1], FL - 120]], 0.3, 6);
  s.p(c.cut([[-900, -1400], [2500, -1400], [2500, FL - 118], [-900, FL - 118]], 0.6, 20) + holes, wc);
  s.p(c.cut([[-900, 560], [2500, 560], [2500, FL - 118], [-900, FL - 118]], 0.5, 16) + c.hole([[DOOR[0], FL - 116], [DOOR[0], 556], [DOOR[1], 556], [DOOR[1], FL - 116]], 0.3, 6), wc2);
  let rims = WINS.map((x) => c.ribbon(arch(x, 104, 540, 400).slice(1, -1), 7)).join('');
  rims += c.ribbon([[DOOR[0], FL - 120], [DOOR[0], 450], ...c.arc((DOOR[0] + DOOR[1]) / 2, 450, (DOOR[1] - DOOR[0]) / 2, 60, PI, 2 * PI, 12), [DOOR[1], 450], [DOOR[1], FL - 120]], 12);
  s.p(rims, C.wood2);
  s.p(c.cut([[-900, 300], [2500, 300], [2500, 326], [-900, 326]], 0.4, 14), mix(C.terracotta, C.clay, 0.4));
  let mz = '';
  for (let x = -880; x < 2500; x += 34) mz += c.poly([[x, 306], [x + 17, 306], [x + 17, 318], [x + 8, 318], [x + 8, 312], [x, 312]]);
  s.x(mz, C.cream, 'opacity=".75"');
  s.p(c.cut([[-900, -1400], [2500, -1400], [2500, 240], [-900, 240]], 0.5, 20), mix(C.wood3, C.plaster2, 0.3));
  let beams = '';
  for (let x = -880; x < 2500; x += 120) beams += c.cut(c.rect(x, 228, 28, 26), 0.3, 5);
  s.p(beams, C.wood);
  wallL.add(s.out());
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  const fc = mix(C.stone, C.clay, 0.2);
  f.p(c.cut([[-900, FL - 120], [2500, FL - 120], [2500, 1700], [-900, 1700]], 0.6, 20), fc);
  let tl = '';
  [640, 668, 700, 744, 804, 880].forEach((y) => { tl += c.ribbon([[-900, y], [2500, y + c.rr(-1, 1)]], 1.2); });
  for (let k = -20; k <= 20; k++) { const xb = 800 + k * 90; tl += c.ribbon([[800 + (xb - 800) * 0.6, FL - 118], [800 + (xb - 800) * 2.3, 1300]], 1.1); }
  f.x(tl, shade(fc, -0.14), 'opacity=".45"');
  floorL.add(f.out());
  // the empty places: bolsters behind the table
  const bolL = S.layer({ par: 0.43, sh: 3 });
  const bols = SU.SEATS.map((x, i) => bolL.add(`<g transform="translate(${x} ${TOP - 4})">${bolster(c, i % 2 ? 1 : 2, 64, 44)}</g>`));
  const seatL = S.layer({ par: 0.44, sh: 4 });
  const tableL = S.layer({ par: 0.46, sh: 5 });
  tableL.add(`<g transform="translate(${TX0} ${SEAT + 2})">${longTable(c, TX1 - TX0, SEAT + 2 - TOP, { band: C.terracotta })}</g>`);
  const food = [[556, roastPlatterL(c, 60)], [630, cup(c, C.sun)], [690, loaf(c, 15)], [760, `<g transform="scale(.9)">${grapes(c)}</g>`], [820, roastPlatterL(c, 70)], [900, wineJarL(c, 44)], [950, loaf(c, 13)], [1010, cup(c, C.clay)]];
  const foodEl = tableL.add(`<g>${food.map(([x, m]) => `<g transform="translate(${x} ${TOP - 2})">${m}</g>`).join('')}</g>`);
  const frontL = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 3 });
  const flyL = S.layer({ par: 0.36, sh: 5 });
  const lamps = [560, 780, 1000].map((x, i) => ({ x, i, el: hanging(flyL, paperLantern(c, { col: [C.apricot, C.wheat, C.roseRobe][i] }), { x, y: 330, len: 900 }) }));
  lamps.forEach((l) => { l.glow = l.el.querySelector('.glow'); });
  storyFrame(S);
  return {
    c, nightL, far, winLit, HOUSES, streetL, wallL, floorL, bolL, bols, seatL, tableL, foodEl, frontL, fx, flyL,
    update(t, T, { lit = 1, night = 0 } = {}) {
      nightL.fade(night);
      lamps.forEach((l) => { pose(l.el, { x: l.x, y: 344 + (l.i % 2) * 18, r: T ? Math.sin(T * 1.1 + l.i) * 2 : 0 }); pose(l.glow, { o: lit * (0.85 + (T ? Math.sin(T * 3 + l.i) * 0.08 : 0)) }); });
    },
  };
}
function roastPlatterL(c, w) { return roastPlatterM(c, w); }
function wineJarL(c, h) { return wineJarM(c, h); }
/** a row of seated guests at the supper table (the poor, the maimed, the blind, the lame and the people of the roads) */
export function supperRow(c, looks, seats, { arms = 'rest', flip = false } = {}) {
  return pose3(c, looks.map((o, k) => ({ x: seats[k] - 800, y: 0, s: 0.94, flip, head: -4, armF: arms === 'eat' ? 60 : 24, armB: 10, o: { ...o, pose: 'sit' } })));
}

/* ================================================================== the three who made excuses (Łk 14,18–20) */
export const EX = { FL: 742, FIELD: 250, YARD: 800, HOUSE: 1390, DOOR: [1350, 1430] };
/** a pair of oxen under one yoke, side by side (origin: hooves of the near one) */
export function oxPair(c) {
  const far = ox(c, { col: mix(C.wood3, C.clay, 0.2) }).replace('<g>', '<g>');
  const near = ox(c);
  const yk = sheet().p(c.ribbon([[30, -104], [96, -118]], 9), C.wood2).p(c.ribbon([[52, -110], [50, -86]], 3) + c.ribbon([[78, -116], [76, -94]], 3), shade(C.wood2, -0.2)).out();
  return `<g transform="translate(18 -14) scale(.94)">${far}</g>${near}${yk}`;
}
/** five yoke of oxen in a yard, as markup (origin: the middle of the front row's hooves) */
export function fiveYoke(c, s = 0.42) {
  const spots = [[-150, -26], [-20, -30], [110, -24], [-90, 0], [40, 4]];
  return spots.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(${s})">${oxPair(c)}</g>`).join('');
}
/** a deed of sale: a small parchment with a red seal (origin centre) */
export function deed(c, w = 50, h = 36) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 5), C.parchment);
  let ln = '';
  for (let y = -h / 2 + 7; y < h / 2 - 8; y += 6) ln += c.ribbon([[-w / 2 + 6, y], [w / 2 - 6 - c.rr(0, 10), y]], 1.2);
  s.x(ln, C.ink, 'opacity=".45"');
  s.p(c.cut(c.circ(w / 2 - 10, h / 2 - 8, 6, 10), 0.3, 3), C.terracotta);
  return s.out();
}
/** a goad (a long stick for driving oxen), held in the front hand */
export const goad = (c) => sheet().p(c.ribbon([[0, -20], [10, 110]], 3.2), C.wood2).out();
/**
 * The edge of the town at dusk, as a painted flat: the hills and the town behind; on the left a newly bought field with
 * its boundary stones and a stake; in the middle a fenced yard (the five yoke of oxen go in it); on the right a house
 * with a wedding garland over its door (the door is its own piece and can close). A road runs in front.
 */
export function excuseFlat(S) {
  const c = makeCutter('lk14-excuse-flat');
  const { FL, FIELD, YARD, HOUSE, DOOR } = EX;
  sky(S, EVE);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 36, { disc: C.sunDeep, inner: C.sun }), { x: 1180, y: 300, len: 900 });
  const far = S.layer({ par: 0.14, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [900, 330, 120], color: mix(C.hillMid, C.duskViolet, 0.2), trees: 14, treeColor: mix(C.sage, C.duskViolet, 0.15), treeH: 18 });
  far.add(h1.markup + town(c, { x: 820, y: h1.fn(1150) + 14, n: 8, spread: 360, sc: 0.5, wall: mix(C.plaster, C.dusk, 0.2) }));
  const mid = S.layer({ par: 0.3, sh: 3 });
  mid.add(band(c, { y: 560, amps: [8, 3], lens: [700, 220], color: mix(C.hillNear, C.sand, 0.2), x0: -2000, x1: 3600 }).markup + olive(c, -60, 566, 0.7) + cypress(c, 1000, 560, 110) + olive(c, 1100, 566, 0.6) + cypress(c, 1700, 560, 120));
  // the field: brown furrows with green shoots, boundary stones, a stake with a tag
  const G = S.layer({ par: 0.6, sh: 3 });
  const fs = sheet();
  fs.p(c.cut([[FIELD - 190, 610], [FIELD + 130, 604], [FIELD + 170, 660], [FIELD - 230, 666]], 0.8, 10), mix(C.soil, C.sand2, 0.4));
  let fur = '';
  for (let i = 0; i < 6; i++) { const y = 614 + i * 9; fur += c.ribbon([[FIELD - 190 - i * 7, y], [FIELD + 130 + i * 7, y - 2]], 2); }
  fs.x(fur, shade(C.soil, -0.2), 'opacity=".55"');
  let shoots = '';
  for (let k = 0; k < 40; k++) { const x = c.rr(FIELD - 200, FIELD + 150), y = c.rr(612, 660); shoots += c.poly([[x, y], [x - 2, y - 6], [x + 2, y - 6]]); }
  fs.x(shoots, C.leaf);
  fs.p(c.cut(c.blob(FIELD - 206, 664, 14, 9, 8, 0.2), 0.4, 3) + c.cut(c.blob(FIELD + 166, 658, 12, 8, 8, 0.2), 0.4, 3), C.rock2);
  fs.p(c.ribbon([[FIELD + 110, 640], [FIELD + 112, 560]], 4), C.wood2);
  G.add(fs.out());
  // the yard with its fence
  const ys = sheet();
  ys.p(c.cut([[YARD - 150, 640], [YARD + 150, 640], [YARD + 160, 700], [YARD - 160, 700]], 0.6, 10), mix(C.sand2, C.soil, 0.2));
  let fence = '';
  for (let x = YARD - 150; x <= YARD + 150; x += 30) fence += c.cut(c.rect(x - 3, 574, 6, 70), 0.3, 4);
  ys.p(fence, C.wood);
  ys.p(c.ribbon([[YARD - 154, 592], [YARD + 154, 590]], 5) + c.ribbon([[YARD - 154, 620], [YARD + 154, 619]], 5), C.wood3);
  G.add(ys.out());
  // the house with the wedding garland
  const hs = sheet();
  const hw = mix(C.plaster, C.roseRobe, 0.12);
  hs.p(c.cut([[HOUSE - 120, FL - 104], [HOUSE - 120, 480], [HOUSE + 150, 480], [HOUSE + 150, FL - 104]], 0.5, 10) + c.hole([[DOOR[0], FL - 104], [DOOR[0], 560], ...c.arc((DOOR[0] + DOOR[1]) / 2, 560, (DOOR[1] - DOOR[0]) / 2, 30, PI, 2 * PI, 10), [DOOR[1], 560], [DOOR[1], FL - 104]], 0.3, 5), hw);
  hs.p(c.cut(c.rect(HOUSE - 130, 470, 290, 14), 0.4, 6) + c.cut(c.rect(HOUSE + 60, 520, 40, 40), 0.3, 5), shade(hw, -0.12));
  hs.p(c.cut(c.rect(HOUSE + 66, 526, 28, 28), 0.3, 4), C.soilDark);
  hs.p(c.ribbon([[HOUSE - 124, 486], [HOUSE + 154, 486]], 4), shade(hw, -0.2));
  G.add(hs.out());
  const doorDark = G.add(sheet().p(c.cut([[DOOR[0], FL - 104], [DOOR[0], 560], ...c.arc((DOOR[0] + DOOR[1]) / 2, 560, (DOOR[1] - DOOR[0]) / 2, 30, PI, 2 * PI, 10), [DOOR[1], 560], [DOOR[1], FL - 104]], 0.3, 5), mix(C.lampFlame, C.clay, 0.3)).out());
  G.add(`<g transform="translate(${DOOR[0] - 40} 536)">${garland(c, DOOR[1] - DOOR[0] + 80, 22)}</g>`);
  // the ground and the road in front
  const road = S.layer({ par: 0.6, sh: 3 });
  road.add(sheet().p(c.cut([[-2000, FL - 102], [3600, FL - 104], [3600, 1700], [-2000, 1700]], 0.6, 20), mix(C.sand, C.hillNear, 0.25)).p(c.ribbon([[-2000, FL + 10], [3600, FL + 6]], 60, 2), mix(C.sand, C.cream, 0.3)).out() + grass(c, { x0: -1500, x1: 3200, y: FL - 100, n: 50, h: 10, color: C.olive }));
  const yardL = S.layer({ par: 0.6, sh: 4 });
  const doorL = S.layer({ par: 0.6, sh: 4 });
  const frontL = S.layer({ par: 0.62, sh: 5 });
  const fx = S.layer({ par: 0.64, sh: 3 });
  storyFrame(S);
  return { c, sunEl, far, G, doorDark, yardL, doorL, road, frontL, fx, update(T) { swing(sunEl, 1180, 300, T, 0.8, 0.5); } };
}

/** little pictures for the servant's report: a field, an ox's head, a bride's veil (origin centre, ~40 wide each) */
export function reportIcons(c) {
  const f = sheet().p(c.cut([[-18, 6], [18, 4], [22, 16], [-22, 18]], 0.4, 4), mix(C.soil, C.sand2, 0.4)).x(c.ribbon([[-16, 10], [16, 9]], 1.4) + c.ribbon([[-18, 14], [18, 13]], 1.4), shade(C.soil, -0.2)).p(c.ribbon([[12, 8], [13, -14]], 2.4), C.wood2).out();
  const oxh = `<g transform="translate(-6 18) scale(.34)">${ox(c)}</g>`;
  const b = sheet().p(c.cut([...c.arc(0, 0, 13, 13, PI * 0.8, PI * 2.2, 12), [14, 16], [-14, 16]], 0.4, 4), C.blushVeil).p(c.cut(c.circ(1, 1, 8.5, 12), 0.2, 3), C.skin).x(c.poly(c.star(0, -12, 5, 2, 5, 0)), C.cream).out();
  return `<g transform="translate(-58 -4)">${f}</g><g transform="translate(0 -2)">${oxh}</g><g transform="translate(58 -4)">${b}</g>`;
}

/* ================================================================== the highways and hedges (Łk 14,23–24) */
export const HG = { ROAD: [[250, 790], [480, 742], [660, 700], [820, 650], [940, 606], [1030, 566]], HOUSE: [1090, 560], DOOR: [1062, 1110] };
/** a point on a polyline at u (0..1) */
export function along(pts, u) {
  const L = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let r = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < L.length; i++) { if (r <= L[i] || i === L.length - 1) { const k = L[i] ? Math.min(1, r / L[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } r -= L[i]; }
  return pts[pts.length - 1];
}
/** a hedgerow of round dark-green bushes along a line (markup) */
export function hedge(c, x0, y0, x1, y1, h = 40) {
  const s = sheet();
  let d = '', d2 = '';
  const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 26));
  for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(x0, x1, u), y = lerp(y0, y1, u); d += c.cut(c.blob(x, y - h * 0.5, h * 0.62, h * 0.55, 10, 0.2), 0.8, 4); if (i % 2) d2 += c.cut(c.blob(x + 6, y - h * 0.7, h * 0.3, h * 0.24, 8, 0.2), 0.6, 3); }
  s.p(d, C.moss2).p(d2, C.moss);
  let fl = '';
  for (let i = 0; i < n; i += 2) { const u = (i + 0.5) / n; fl += c.poly(c.star(lerp(x0, x1, u), lerp(y0, y1, u) - h * 0.6, 3.4, 1.4, 5, i)); }
  s.x(fl, C.cream);
  return s.out();
}
/**
 * The country outside the city at dusk, as a painted flat: the master's house high on the hill to the right (its
 * windows can fill with light and guests), a road winding up to it from the lower left between green hedgerows, a
 * crossroads with travellers, the city wall far off on the left.
 */
export function hedgeFlat(S) {
  const c = makeCutter('lk14-hedge-flat');
  const { ROAD, HOUSE, DOOR } = HG;
  sky(S, EVE);
  const nightL = sky(S, EVE2, { name: 'eve2', rise: 0 }).layer;
  nightL.add(stars(c, { x0: -900, x1: 2500, y0: -600, y1: 380, n: 60 }));
  nightL.fade(0);
  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [14, 6, 3], lens: [900, 330, 120], color: mix(C.hillMid, C.duskViolet, 0.25), trees: 10, treeColor: mix(C.sage, C.duskViolet, 0.2), treeH: 18 });
  far.add(h1.markup + walledTownM(c, 330, h1.fn(330) + 10, 0.7));
  const hillL = S.layer({ par: 0.26, sh: 3 });
  const hfn = (x) => 560 + Math.max(0, 1100 - x) * 0.2 + Math.sin(x / 70) * 4 - Math.max(0, x - 1100) * 0.05;
  hillL.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage, 0.3)).out());
  // the house on the hill
  const hs = sheet();
  const [hx, hy] = HOUSE;
  const wall = mix(C.plaster, C.ochre, 0.25);
  hs.p(c.cut([[hx - 130, hy], [hx - 130, hy - 150], [hx + 150, hy - 150], [hx + 150, hy]], 0.5, 10), wall);
  hs.p(c.cut(c.rect(hx - 140, hy - 162, 300, 16), 0.3, 6), shade(wall, -0.15));
  hs.p(c.cut([[hx + 60, hy - 150], [hx + 60, hy - 200], [hx + 150, hy - 200], [hx + 150, hy - 150]], 0.5, 8), wall);
  hs.p(c.cut(c.rect(hx + 54, hy - 210, 102, 12), 0.3, 6), shade(wall, -0.15));
  const WIN = [[hx - 96, hy - 110], [hx - 36, hy - 110], [hx + 96, hy - 110], [hx + 96, hy - 180], [hx + 24, hy - 110]];
  WIN.forEach(([x, y]) => hs.p(c.cut([[x - 14, y + 26], [x - 14, y], ...c.arc(x, y, 14, 12, PI, 2 * PI, 6), [x + 14, y], [x + 14, y + 26]], 0.3, 4), mix(C.soilDark, C.plumRobe, 0.3)));
  hs.p(c.cut([[DOOR[0], hy], [DOOR[0], hy - 60], ...c.arc((DOOR[0] + DOOR[1]) / 2, hy - 60, (DOOR[1] - DOOR[0]) / 2, 18, PI, 2 * PI, 8), [DOOR[1], hy - 60], [DOOR[1], hy]], 0.3, 4), C.lampFlame);
  hillL.add(hs.out());
  const lit = hillL.add(`<g opacity="0"><circle cx="${hx}" cy="${hy - 110}" r="220" fill="url(#warm-glow)" opacity=".75"/>${WIN.map(([x, y]) => `<path d="${c.poly([[x - 13, y + 25], [x - 13, y], ...c.arc(x, y, 13, 11, PI, 2 * PI, 6), [x + 13, y], [x + 13, y + 25]])}" fill="${C.lampFlame}"/><path d="${c.poly(c.circ(x - 4, y + 8, 4, 8))}${c.poly([[x - 10, y + 25], [x - 9, y + 14], [x + 1, y + 14], [x + 2, y + 25]])}${c.poly(c.circ(x + 6, y + 10, 3.6, 8))}${c.poly([[x + 1, y + 25], [x + 2, y + 16], [x + 10, y + 16], [x + 11, y + 25]])}" fill="${mix(C.wood2, C.soilDark, 0.4)}" opacity=".85"/>`).join('')}</g>`);
  const doorLeaf = hillL.add(`<g>${sheet().p(c.cut([[0, 0], [0, -76], [DOOR[1] - DOOR[0], -76], [DOOR[1] - DOOR[0], 0]], 0.3, 4), C.wood).out()}</g>`);
  // the road and the hedges
  const roadL = S.layer({ par: 0.34, sh: 3 });
  const rs = sheet();
  rs.p(c.cut([[-900, 790], [2500, 780], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.hillNear, C.sand, 0.25));
  rs.p(c.ribbon(ROAD.concat([[DOOR[0] + 24, HOUSE[1] - 2]]), (u) => 80 - u * 50, 2), mix(C.sand, C.cream, 0.25));
  rs.p(c.ribbon([[-900, 800], [250, 790], [2500, 806]], 70, 2), mix(C.sand, C.cream, 0.2));
  roadL.add(rs.out());
  roadL.add(hedge(c, 200, 752, 600, 690, 40) + hedge(c, 700, 646, 900, 590, 34) + hedge(c, 600, 800, 900, 736, 46) + hedge(c, 980, 690, 1180, 640, 40) + hedge(c, -200, 770, 150, 760, 44) + hedge(c, 1200, 790, 1600, 780, 46));
  roadL.add(olive(c, 1300, 700, 0.8) + cypress(c, 160, 750, 140));
  const walkL = S.layer({ par: 0.36, sh: 4 });
  const frontL = S.layer({ par: 0.42, sh: 5 });
  const fx = S.layer({ par: 0.44, sh: 3 });
  storyFrame(S);
  return { c, nightL, far, hillL, lit, doorLeaf, roadL, walkL, frontL, fx };
}

/* ================================================================== the tower never finished (Łk 14,28–30) */
export const TW = { GY: 706, X: 830, W: 190, COURSE: 34, N: 5, FULL: 12 };
/** one course of the tower's stones (origin: its bottom centre) */
export function towerCourse(c, i, w = TW.W, h = TW.COURSE) {
  const s = sheet();
  const col = mix(C.stone2, C.sand2, 0.35 + (i % 2) * 0.1);
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 0.5, 8), col);
  let joints = '';
  const off = (i % 2) * 24;
  for (let x = -w / 2 + 20 + off; x < w / 2 - 6; x += 48) joints += c.ribbon([[x, -h + 3], [x, -3]], 1.4);
  joints += c.ribbon([[-w / 2 + 3, -h + 1], [w / 2 - 3, -h + 1]], 1.4);
  s.x(joints, shade(col, -0.22), 'opacity=".6"');
  if (i === 2) s.p(c.cut([[-12, -h + 4], [-12, -8], [12, -8], [12, -h + 4]], 0.2, 3), mix(C.soilDark, C.plumRobe, 0.2));
  return s.out();
}
/** the plan of the whole tower as an ink outline on the air (origin: the foot centre) */
export function towerPlan(c) {
  const { W, COURSE, FULL } = TW;
  const H = COURSE * FULL;
  let d = `M${-W / 2} 0V${-H}`;
  for (let x = -W / 2; x < W / 2; x += 38) d += `H${x + 19}V${-H - 22}H${x + 38}V${-H}`;
  d += `V0`;
  let inner = '';
  for (let k = 1; k < FULL; k++) inner += `M${-W / 2} ${-k * COURSE}H${W / 2}`;
  inner += `M-14 ${-H * 0.62}v-40h28v40M-14 ${-H * 0.3}v-34h28v34`;
  return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-dasharray="10 7" opacity=".55"/><path d="${inner}" fill="none" stroke="${C.ink}" stroke-width="1.2" stroke-dasharray="6 8" opacity=".3"/>`;
}
/** a builder's scaffold of poles and a ladder against the half-built tower (origin: foot centre of the tower) */
export function scaffold(c) {
  const { W } = TW;
  const s = sheet();
  s.p(c.ribbon([[-W / 2 - 26, 4], [-W / 2 - 22, -230]], 6) + c.ribbon([[W / 2 + 24, 4], [W / 2 + 20, -230]], 6), C.wood3);
  s.p(c.ribbon([[-W / 2 - 30, -150], [W / 2 + 30, -150]], 5) + c.ribbon([[-W / 2 - 30, -200], [-W / 2 + 10, -200]], 5), C.wood);
  s.p(c.ribbon([[W / 2 + 60, 4], [W / 2 + 16, -186]], 5) + c.ribbon([[W / 2 + 84, 4], [W / 2 + 40, -186]], 5), C.wood2);
  let rungs = '';
  for (let k = 1; k < 8; k++) { const u = k / 8; rungs += c.ribbon([[W / 2 + 60 - u * 44, 4 - u * 190], [W / 2 + 84 - u * 44, 4 - u * 190]], 3); }
  s.p(rungs, C.wood2);
  return s.out();
}
/** a moth (from an empty purse); origin centre */
export const moth = (c) => sheet().p(c.cut([[0, 0], [-10, -8], [-14, 2], [-4, 4]], 0.2, 2) + c.cut([[0, 0], [10, -8], [14, 2], [4, 4]], 0.2, 2), mix(C.stone2, C.rock2, 0.4)).p(c.cut(c.ell(0, 1, 2.2, 6, 8), 0.1, 2), C.rock3).out();
/** a crow standing (origin: its feet) */
export function crowStand(c) {
  const s = sheet();
  s.p(c.cut([[-16, -10], [-6, -22], [8, -24], [14, -30], [22, -28], [26, -24], [18, -22], [16, -12], [6, -4], [-10, -4], [-24, -2]], 0.4, 4), C.crow);
  s.x(c.ribbon([[0, -4], [-2, 2]], 1.4) + c.ribbon([[6, -4], [6, 2]], 1.4), C.ochre);
  s.x(c.poly(c.circ(19, -27, 1.4, 6)), C.cream);
  return s.out();
}

/* ================================================================== the two kings (Łk 14,31–32) */
/** an olive branch (origin: its stem end) */
export function oliveBranch(c, len = 60) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [len * 0.4, -len * 0.2], [len, -len * 0.1], 10), 2.4), C.wood2);
  let lv = '';
  for (let i = 1; i < 8; i++) { const u = i / 8, x = len * u, y = -len * 0.18 * Math.sin(u * PI) - len * 0.04 * u; lv += c.cut(c.ell(x, y + (i % 2 ? -7 : 7), 9, 3.4, 8, i % 2 ? -0.5 : 0.5), 0.2, 3); }
  s.p(lv, C.olive);
  s.x(c.poly(c.circ(len * 0.5, -len * 0.05, 3, 6)) + c.poly(c.circ(len * 0.75, -len * 0.08, 3, 6)), C.moss2);
  return s.out();
}
/** a camp table with a campaign map: the two armies as tokens (origin: table top centre); .mine / .theirs are the token groups */
export function warMap(c, w = 150) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 6, 10], [-w / 2 + 6, 10]], 0.3, 6), C.wood);
  s.p(c.cut(c.rect(-w / 2 + 10, 10, 8, 50), 0.3, 4) + c.cut(c.rect(w / 2 - 18, 10, 8, 50), 0.3, 4), C.wood2);
  s.p(c.cut([[-w / 2 + 8, -4], [w / 2 - 8, -6], [w / 2 - 4, 2], [-w / 2 + 4, 3]], 0.3, 6), C.parchment);
  s.x(c.ribbon([[-w / 2 + 20, -2], [w / 2 - 20, -3]], 1.2), C.ink, 'opacity=".3"');
  return s.out();
}
export const token = (c, col) => sheet().p(c.cut([[-8, 0], [-8, -14], [8, -14], [8, 0]], 0.3, 3), col).p(c.cut([[-2, -14], [-2, -26], [10, -22], [-2, -18]], 0.2, 3), shade(col, 0.2)).out();

/* ================================================================== the salt (Łk 14,34–35) */
export const SF = { GY: 716, TABLE: 520, FIELD: 800, HEAP: 1080, ROADY: 780 };
/** a manure heap with straw (origin: its foot centre) */
export function manureHeap(c, w = 150) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.36, -34], [-w * 0.12, -56], [w * 0.1, -60], [w * 0.34, -40], [w / 2, 0]], 1.2, 6), mix(C.soil, C.soilDark, 0.3));
  s.p(c.cut([[-w * 0.3, -20], [-w * 0.1, -40], [w * 0.14, -42], [w * 0.28, -22], [0, -14]], 1, 5), mix(C.soil, C.wood3, 0.3));
  let st = '';
  for (let i = 0; i < 16; i++) { const x = c.rr(-w * 0.4, w * 0.4), y = c.rr(-50, -8); st += c.ribbon([[x, y], [x + c.rr(-10, 10), y - c.rr(4, 10)]], 1.4); }
  s.x(st, C.wheat2, 'opacity=".85"');
  s.p(c.ribbon([[w * 0.3, -10], [w * 0.36, -96]], 4) + c.ribbon([[w * 0.36, -96], [w * 0.28, -110]], 2) + c.ribbon([[w * 0.36, -96], [w * 0.36, -112]], 2) + c.ribbon([[w * 0.36, -96], [w * 0.44, -110]], 2), C.wood2);
  return s.out();
}
