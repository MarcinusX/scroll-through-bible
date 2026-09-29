// Matthew 21 — the cast and cut-outs of this chapter. Most of it is Mark 11's and Mark 12's, so the entry into
// Jerusalem, the Temple and the vineyard look the same in both Gospels: the colt and its cloaks, Jerusalem across the
// valley, the Temple courts, the market tables and dove cages, the fig tree, the mountain on strings, the chief
// priests, scribes and elders, the vineyard of the parable with its tenants, servants and the son, the builders'
// arch and its keystone. Matthew's own: the she-donkey who comes with her colt, the prophet's picture of the humble
// King riding to the Daughter of Zion, the children of the Temple crying Hosanna, the two sons and the vineyard gate,
// the road of righteousness and the gate of the Kingdom, the stone that breaks and scatters.
import { C, CAST, person, sheet, shade, mix, pose, lerp } from '../kit.js';
import { tr } from '../../core/i18n.js';
import { colt } from '../mark11/lib.js';

export {
  colt, coltRig, saddleCloaks, riderLeg, jerusalem, cityWall, sanctuary, templeCourt, courtFront, portico, frond, oliveBranch, roadBranch,
  roadCloak, flyingCloak, pennant, clothBanner, grove, figTree, figs, mountain, changerTable, balance, cage, smallDove, flapDove, bench,
  jarProp, basketProp, lamb, heavenIcon, peopleIcon, priest, scribe, elder, TWO, TWELVE_O, FONT,
  kf, moving, hand, headAt, addToHead, thought, GLYPH, spark, heart, coin, coinStack, dust, townsfolk, scrollOpen, scrollRolled, lantern, wordSlip,
  dove, voiceRings, hang2, tagOnString, sparkle, plate, signpost, TWELVE, card, bubble, strip, withFace, faceBits, question, man, woman, nameTag,
} from '../mark11/lib.js';
export {
  vineyardSet, VY, VINE_DAY, VINE_DUSK, VINE_NIGHT, LOOK as L12, tenant, servant, newTenant, hoe, bigKey, basketCut, burst, moodPuppet, drapeCloth,
  stoneBlock, headBandage, keystone, archStones, glory, grapeBunch, towerParts, kingdomGate, gateDoor, bigQuestion, shadowPerson, pharisee, vineStock,
} from '../mark12/lib.js';
export { crutch, JOHN_B } from '../mark1/lib.js';
export { blindBand } from '../john5/lib.js';
export { kid, KID_LOOKS, kidHead, BLIND, LAME, popIn } from '../matthew11/lib.js';
export { TAXMEN, SINNERS } from '../matthew9/lib.js';
export { hangAt } from '../matthew8/lib.js';
export { say, tag } from '../mark8/lib.js';
export { pose3, folk4 } from '../matthew4/lib.js';
export { hungPlate, hungWord, glowDisc, rayBurst } from '../john1/lib.js';
export { tr };

export const PI = Math.PI;

/* ================================================================== skies */
export const DAY = ['#d0e2dd', '#f1e6c9', '#f8ebd3'];
export const MORNING = ['#cfd6e0', '#f3dfc6', '#f8e9d2'];
export const DAWN = ['#c9c6d8', '#f1d6bf', '#f7e3cb'];
export const DUSK = ['#6f6a9a', '#d99a86', '#f0b88e'];
export const NIGHT = ['#1d2349', '#2f3768', '#6a5f84'];
export const HIGH = ['#e6eee2', '#fbf0d2', '#fcf2dc'];      // "in the highest": the sky opens to gold
export const PROPHET = ['#e3d6bd', '#f1e2c4', '#f7ead3'];   // the old painted flat of the prophecy

/* ================================================================== the she-donkey and her colt */
/** the mother donkey: a greyer, bigger cut of the colt (same rig: coltRig) */
export const JENNY = mix(C.rock2, C.stone2, 0.25);
export function jenny(c, o = {}) { return colt(c, { col: JENNY, ...o }); }

/* ================================================================== the prophecy */
/** a little crown whose gold can turn gentle: origin centre (w ≈ 70) */
export function kingCrown(c, r = 30) {
  const s = sheet();
  const cr = [[-r, r * 0.2], [-r * 1.1, -r * 0.7], [-r * 0.55, -r * 0.25], [-r * 0.35, -r], [0, -r * 0.4], [r * 0.35, -r], [r * 0.55, -r * 0.25], [r * 1.1, -r * 0.7], [r, r * 0.2]];
  s.p(c.cut(cr, 0.4, 4), C.sun);
  s.x(c.poly(c.circ(-r * 0.35, -r, r * 0.12, 8)) + c.poly(c.circ(r * 0.35, -r, r * 0.12, 8)) + c.poly(c.circ(-r * 1.1, -r * 0.7, r * 0.1, 8)) + c.poly(c.circ(r * 1.1, -r * 0.7, r * 0.1, 8)), C.terracotta);
  s.x(c.ribbon([[-r * 0.92, 0], [r * 0.92, 0]], r * 0.08), shade(C.sun, -0.25));
  s.x(c.poly(c.circ(0, -r * 0.05, r * 0.12, 8)), C.teal2);
  return s.out();
}
/** the Daughter of Zion: a young woman in white and blue, a circlet of towers on her veil (she is Jerusalem) */
export const ZION = { robe: C.linen, mantle: C.skyVeil, hairStyle: 'veil', veil: mix(C.skyVeil, C.cream, 0.4), veil2: C.dustyBlue, hair: C.hair2, skin: C.skin, beard: 'none', belt: C.ochre };
export function towerCirclet(c) {
  const s = sheet();
  let d = '';
  for (let i = -2; i <= 2; i++) { const x = i * 7.5; d += c.cut([[x - 3.4, -18], [x - 3.4, -26 - (i % 2 ? 0 : 3)], [x - 1, -26 - (i % 2 ? 0 : 3)], [x - 1, -24], [x + 1, -24], [x + 1, -26 - (i % 2 ? 0 : 3)], [x + 3.4, -26 - (i % 2 ? 0 : 3)], [x + 3.4, -18]], 0.2, 3); }
  s.p(c.cut(c.rect(-19, -20, 38, 5), 0.2, 4) + d, C.sun);
  return s.out();
}

/* ================================================================== children and praise */
/** a little praise note of light rising from a child's mouth (origin centre) */
export function praiseNote(c, r = 9, col = C.sun) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, r, r * 0.74, 10, -0.4), 0.2, 3), col);
  s.p(c.ribbon([[r * 0.8, -r * 0.2], [r * 0.9, -r * 3]], r * 0.3), col);
  s.p(c.cut([[r * 0.75, -r * 3], [r * 2, -r * 2.4], [r * 1.9, -r * 1.8], [r * 0.9, -r * 2.3]], 0.2, 3), col);
  return `<circle r="${r * 2.4}" fill="url(#warm-glow)" opacity=".7"/>${s.out()}`;
}
/** a psalm scroll open between rods with written lines (origin: top centre) */
export function psalmScroll(c, text, { w = 330, size = 20 } = {}) {
  const lines = text.split('|');
  const h = 30 + lines.length * (size * 1.2) + 26;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 8), C.parchment);
  let ln = '';
  { let x = -w / 2 + 24; const y = h - 16; while (x < w / 2 - 30) { const l = c.rr(14, 40); ln += c.ribbon([[x, y], [Math.min(x + l, w / 2 - 24), y]], 1.8); x += l + 8; } }
  s.x(ln, C.ink, 'opacity=".3"');
  s.p(c.cut(c.rect(-w / 2 - 12, -8, 12, h + 16), 0.3, 5) + c.cut(c.rect(w / 2, -8, 12, h + 16), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w / 2 - 9, -18, 6, 10), 0.2, 3) + c.cut(c.rect(w / 2 + 3, -18, 6, 10), 0.2, 3) + c.cut(c.rect(-w / 2 - 9, h + 8, 6, 10), 0.2, 3) + c.cut(c.rect(w / 2 + 3, h + 8, 6, 10), 0.2, 3), C.ochre);
  return s.out() + lines.map((l, i) => `<text x="0" y="${28 + i * size * 1.2}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${C.ink}">${l}</text>`).join('');
}

/* ================================================================== the vineyard of the two sons */
/** a vineyard gate in a low stone wall, with a vine over the arch (origin: foot of the gate, centre) */
export function vineGate(c, w = 120, h = 170) {
  const s = sheet();
  const stone = mix(C.rock, C.stone2, 0.4);
  // the low walls either side, the two gate pillars and the arch over them
  s.p(c.cut([[-w / 2 - 280, 0], [-w / 2 - 280, -62], [-w / 2, -68], [-w / 2, 0]], 0.6, 8) + c.cut([[w / 2, 0], [w / 2, -68], [w / 2 + 280, -62], [w / 2 + 280, 0]], 0.6, 8), stone);
  s.p(c.cut(c.rect(-w / 2 - 6, -h + 30, 24, h - 30), 0.4, 6) + c.cut(c.rect(w / 2 - 18, -h + 30, 24, h - 30), 0.4, 6), shade(stone, 0.06));
  s.p(c.ribbon(c.arc(0, -h + 32, w / 2 - 6, w * 0.34, PI, 2 * PI, 12), 16), shade(stone, 0.06));
  let courses = '';
  for (let y = -12; y > -64; y -= 13) courses += c.ribbon([[-w / 2 - 276, y], [-w / 2 - 4, y]], 1) + c.ribbon([[w / 2 + 4, y], [w / 2 + 276, y]], 1);
  s.x(courses, shade(stone, -0.18), 'opacity=".55"');
  // the vine over the arch
  let lv = '', lv2 = '';
  const vp = c.qbez([-w / 2 - 20, -80], [0, -h - 70], [w / 2 + 20, -80], 14);
  s.p(c.ribbon(vp, 3.4), C.wood2);
  vp.forEach(([x, y], i) => { const l = c.cut(c.blob(x + c.rr(-8, 8), y + c.rr(-6, 8), c.rr(10, 15), c.rr(8, 11), 8, 0.25), 0.4, 4); if (i % 2) lv += l; else lv2 += l; });
  s.p(lv, C.leaf).p(lv2, C.moss);
  let grapes = '';
  [[-w * 0.3, -h + 6], [w * 0.28, -h + 10]].forEach(([x, y]) => { for (let k = 0; k < 7; k++) grapes += c.cut(c.circ(x + (k % 3) * 6 - 6, y + Math.floor(k / 3) * 6, 3.6, 7), 0.2, 3); });
  s.p(grapes, shade(C.plumRobe, -0.1));
  return s.out();
}
/** the father of the two sons (an old farmer) and his sons */
export const FATHER = { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.clay, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };
export const SONS = [
  { robe: C.tealRobe, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.rope },
  { robe: C.roseRobe, mantle: C.ochreRobe, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: C.leather },
];

/* ================================================================== the way of righteousness */
/** a straight road of light seen in perspective (origin: its far end) */
export function lightRoad(c, len = 360, w0 = 26, w1 = 260) {
  const s = sheet();
  s.p(c.cut([[-w0 / 2, 0], [w0 / 2, 0], [w1 / 2, len], [-w1 / 2, len]], 0.6, 8), mix(C.sand, C.cream, 0.4));
  s.x(c.ribbon([[0, 6], [0, len * 0.3]], 2) + c.ribbon([[0, len * 0.42], [0, len * 0.72]], 3.4) + c.ribbon([[0, len * 0.84], [0, len - 4]], 4.4), C.sun, 'opacity=".7"');
  return s.out();
}

/* ================================================================== the stone */
/** a clay jar that shatters (two halves + shards are separate pieces in scenes); origin: base centre */
export function potHalf(c, side = -1, col = C.pot) {
  const pts = side < 0
    ? [[0, 0], [-14, 0], [-22, -18], [-24, -40], [-16, -58], [-9, -64], [-9, -74], [0, -74], [4, -60], [-4, -44], [5, -28], [-3, -12]]
    : [[0, 0], [14, 0], [22, -18], [24, -40], [16, -58], [9, -64], [9, -74], [0, -74], [4, -60], [-4, -44], [5, -28], [-3, -12]];
  return sheet().p(c.cut(pts, 0.4, 4), col).x(c.ribbon([[side * 2, -36], [side * 22, -36]], 2.4), C.cream, 'opacity=".45"').out();
}
/** a sheaf of chaff scattered like dust (origin centre) */
export function chaffPuff(c, r = 30, col = mix(C.wheat2, C.sand, 0.4)) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a = c.rr(0, PI * 2), rr = c.rr(0, r); const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.6; d += c.poly([[x - 5, y], [x - 1, y - 2.4], [x + 6, y - 0.6], [x + 1, y + 2]]); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** the builders' rejected stone, cornerstone-sized, with a mason's mark (origin centre) */
export function cornerStone(c, w = 64, h = 56, col = mix(C.stone, C.sand, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2 + 4], [-w / 2 + 6, -h / 2], [w / 2 - 4, -h / 2 + 2], [w / 2, -h / 2 + 8], [w / 2 - 2, h / 2 - 4], [w / 2 - 8, h / 2], [-w / 2 + 4, h / 2 - 2], [-w / 2, h / 2 - 8]], 0.6, 6), col);
  s.x(c.ribbon([[-w / 2 + 6, -h / 2 + 8], [w / 2 - 8, -h / 2 + 10]], 2) + c.ribbon([[w / 2 - 10, -h / 2 + 10], [w / 2 - 12, h / 2 - 8]], 2), shade(col, 0.25), 'opacity=".7"');
  s.x(c.ribbon([[-8, -6], [8, 6]], 2.2) + c.ribbon([[-8, 6], [8, -6]], 2.2), shade(col, -0.3), 'opacity=".6"');
  return s.out();
}
export { C, CAST, person, sheet, shade, mix, pose, lerp };
