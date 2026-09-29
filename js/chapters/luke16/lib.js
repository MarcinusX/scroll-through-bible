// Luke 16 — the cast and cut-outs of this chapter. New here: the rich man's estate (the courtyard with its gate and
// garden bed, the portico and the master's chair on the dais, the lands beyond the wall) where the manager is called
// to account and rewrites the bills; the palace of the rich man in purple — the street and the gate where Lazarus
// lies on the left, the open banquet court on the right; and the world beyond death: the bright land of Abraham's
// side high on the left, the dim, parched land of Hades low on the right, and the great chasm fixed between them.
// The teaching scenes use Luke 11's village square in the gold of the afternoon.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, house, sun, cloud, grass, olive, cypress, bush, flowers, rock } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { es, ease, bump, seg, fade, attr } from '../../core/anim.js';
import { addToHead as addToHeadM, addToBody as addToBodyM } from '../mark2/lib.js';
import { hangLamp as hangLampJ } from '../john12/lib.js';
import { ABRAHAM as ABRAHAM8 } from '../john8/lib.js';

export {
  villageSet, VQ, phOpts, scribeOpts, manOf, womanOf, headP, DY, pop, label, panel, panelSky, panelGround,
  glow, kf, moving, say, speech, thought, heart, hand, sparkle, rayBurst, goldWord, hungWord, fatherLight,
  kingdomGate, gateDoor, iou, figure, fig, flat, flatSky, flatHills, flatText, dropK, flyTo, purse, basket, loaf, cup, bowl,
  JOHN_B, AFTER, NOON, EVENING, NIGHT, HEAVEN, GLOOM, qMark, stoneHeart, tick, crossX, jar, sack, zzz, smallLamp, clayLamp,
  roundel, hangAt, crowdMarkup, pose3, bakeArms, tiltHead, addToHead, addToBody, strip, question, coin as coinJ, tagText,
} from '../luke11/lib.js';
export { coin, coinStack, ledger } from '../mark2/lib.js';
export { crumb } from '../mark6/lib.js';
export { angel, glory, soulLight, balance as bigBalance } from '../mark8/lib.js';
export { streetDog } from '../matthew7/lib.js';
export { fox, dove } from '../mark1/lib.js';
export { bigKey, ring, lightArc } from '../mark12/lib.js';
export { lawTablets, beggarBowl } from '../mark10/lib.js';
export { tombRock, tombStone, platter } from '../mark6/lib.js';
export { tombIcon } from '../mark16/lib.js';
export { scalesParts, poseScales } from '../john8/lib.js';
export { lying } from '../luke10/lib.js';
export { scrollParts } from '../mark1/lib.js';
export { es, ease, bump, seg, fade, attr, tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
const k_ = (k) => (k ? ` data-k="${k}"` : '');
const DYP = { stand: 0, kneel: 46, sit: 62 };
const dyOf = (p) => (typeof p === 'string' ? DYP[p] : p || 0);
/** a puppet's head centre (p: 'stand' | 'kneel' | 'sit' or a number) */
export const headAt = (x, y, s, flip = false, p = 0) => [x + (flip ? -2 : 2) * s, y + (-167 + dyOf(p)) * s];
/** a puppet's front hand for arm angle a (p as above) */
export function handAt(x, y, s, flip, a, p = 0) {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + dyOf(p) - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s];
}

/* ================================================================== skies */
export const ESTATE = ['#c8ddd8', '#efe8cf', '#f8eacf'];
export const ESTATE_EVE = ['#b3a3c0', '#ecc0a0', '#f5d9b4'];
export const FEAST = ['#9d8fb4', '#e6ae94', '#f3cda4'];
export const FEAST_NIGHT = ['#1c2248', '#34366a', '#5b5680'];
export const HADES = ['#241f2e', '#3b2c35', '#5a3a36'];
export const GOLDSKY = ['#efd29a', '#f7e1b3', '#fbeed2'];

/* ================================================================== the cast */
/** the rich man of the first parable, and his manager */
export const MASTER = { robe: C.linen, mantle: mix(C.terracotta, C.clayMantle, 0.55), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.sun, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.sun };
export const STEWARD = { robe: C.tealRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.ochre };
/** the master's debtors: the olive grower, the farmer, and more in the queue */
export const DEBTOR_OIL = { robe: mix(C.olive, C.sageRobe, 0.55), hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.olive, beard: 'full', skin: C.skin4, belt: C.rope };
export const DEBTOR_WHEAT = { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.leather };
export const DEBTORS = [
  { robe: C.dustyBlue, hair: C.greyHair, hairStyle: 'bald', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  { robe: C.mauve, mantle: C.stone, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin, belt: C.rope },
];
/** the rich man in purple and fine linen, and the same man in the land of the dead */
export const PURPLE = shade(mix(C.plumRobe, C.curtain2, 0.35), -0.06);
export const RICHMAN = { robe: C.linen, mantle: PURPLE, mantleArm: true, hair: C.hair3, hairStyle: 'short', beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: C.sun };
export const RICH_DEAD = { robe: mix(C.stone2, C.rock2, 0.35), mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: null };
/** his five brothers */
export const BROTHERS = [
  { robe: C.linen, mantle: PURPLE, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun },
  { robe: mix(C.plumRobe, C.linen, 0.3), mantle: C.sun, hair: C.hair2, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.sun },
  { robe: C.linen2, mantle: shade(PURPLE, 0.15), hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.sun, beard: 'full', skin: C.skin2, belt: C.ochre },
  { robe: PURPLE, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.sun },
  { robe: C.linen, mantle: mix(PURPLE, C.indigo, 0.3), hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.sun },
];
/** Lazarus the beggar (not Lazarus of Bethany): patched sackcloth, dark wild hair, sores; and Lazarus comforted */
export const LAZARUS = { robe: mix(C.sand2, C.stone2, 0.45), mantle: null, hair: C.hair3, hairStyle: 'wild', beard: 'short', beardColor: C.hair3, skin: C.skin3, belt: C.rope };
export const LAZ_BLEST = { robe: C.linen, mantle: mix(C.halo, C.wheatRobe, 0.3), hair: C.hair3, hairStyle: 'curly', beard: 'short', beardColor: C.hair3, skin: C.skin3, belt: C.haloRim };
export const ABRAHAM = ABRAHAM8;
/** sores on the face (head coords) and patches on the robe (body coords) — kept small and quiet */
function sores(c) {
  const col = mix(C.blush, C.clay, 0.55);
  return `<g>${[[-8, -9, 2.2], [9, 10, 1.8], [-12, 6, 1.9], [14, -8, 1.5]].map(([x, y, r]) => `<path d="${c.poly(c.circ(x, y, r, 8))}" fill="${col}" opacity=".85"/>`).join('')}</g>`;
}
function rags(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-24, -64, 16, 14), 0.6, 4) + c.cut(c.rect(8, -34, 18, 14), 0.6, 4), mix(C.wood3, C.stone2, 0.5));
  s.x(c.ribbon([[-22, -58], [-10, -56]], 1) + c.ribbon([[10, -28], [24, -26]], 1), C.inkSoft, 'opacity=".35"');
  s.x([[-14, -110, 2.4], [18, -80, 2.2], [-20, -24, 2.6], [22, -120, 2]].map(([x, y, r]) => c.poly(c.circ(x, y, r, 8))).join(''), mix(C.blush, C.clay, 0.55), 'opacity=".8"');
  return s.out();
}
export function lazarus(c, extra = {}) {
  return addToBodyM(addToHeadM(person(c, { ...LAZARUS, ...extra }), sores(c)), extra.pose && extra.pose !== 'stand' ? '' : rags(c));
}

/* ================================================================== small things */
/** a tall clay jar of olive oil with a drip of gold (origin: its foot) */
export function oilJar(c, h = 46, col = mix(C.pot, C.clay, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-7, -h], [7, -h], [6, -h + 5], [13, -h + 14], [15, -h * 0.45], [9, -4], [4, 0], [-4, 0], [-9, -4], [-15, -h * 0.45], [-13, -h + 14], [-6, -h + 5]], 0.4, 4), col);
  s.p(c.ribbon(c.arc(-13, -h + 16, 5, 7, PI * 0.5, PI * 1.5, 6), 2.4) + c.ribbon(c.arc(13, -h + 16, 5, 7, -PI * 0.5, PI * 0.5, 6), 2.4), shade(col, -0.12));
  s.x(c.ribbon([[-13, -h * 0.55], [13, -h * 0.55]], 1.4), shade(col, -0.22), 'opacity=".6"');
  s.p(c.cut([[-3, -h + 4], [3, -h + 4], [2.4, -h * 0.6], [0, -h * 0.55], [-2.4, -h * 0.6]], 0.2, 3), C.sun);
  return s.out();
}
/** a sack of wheat with ears sticking out (origin: its foot) */
export function wheatSack(c, w = 34, h = 40) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 - 3, -h * 0.5], [-w / 2 + 3, -h * 0.85], [-6, -h], [6, -h], [w / 2 - 3, -h * 0.85], [w / 2 + 3, -h * 0.5], [w / 2, 0]], 0.5, 5), mix(C.linen2, C.sand2, 0.45));
  s.x(c.ribbon([[-w / 2 + 2, -h * 0.42], [w / 2 - 2, -h * 0.42]], 4), C.terracotta, 'opacity=".75"');
  let ears = '';
  for (let i = -2; i <= 2; i++) ears += c.cut(c.ell(i * 4, -h - 7, 2.6, 6, 8, i * 0.25), 0.2, 2);
  s.p(ears, C.wheat2);
  s.x(c.ribbon([[-7, -h + 2], [7, -h + 2]], 2.4), C.rope);
  return s.out();
}
/** a mattock (origin: where the blade meets the ground; the handle leans up to the left) */
export function mattock(c) {
  return sheet().p(c.ribbon([[0, -8], [-40, -118]], 5), C.wood3).p(c.cut([[-8, -4], [22, -2], [26, 4], [-10, 2]], 0.3, 3), mix(C.stone2, C.rock3, 0.45)).out();
}
/** the steward's desk: a trestle table with a tablet and a pot of ink (origin: floor, centre) */
export function desk(c, w = 170, h = 66) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 12, -h + 10, 10, h - 10), 0.3, 4) + c.cut(c.rect(w / 2 - 22, -h + 10, 10, h - 10), 0.3, 4), C.wood2);
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2 - 4, -h + 12], [-w / 2 + 4, -h + 12]], 0.4, 6), C.wood);
  s.p(c.cut(c.rect(w / 2 - 34, -h - 14, 14, 14), 0.3, 3), C.pot);
  s.x(c.ribbon([[w / 2 - 28, -h - 14], [w / 2 - 20, -h - 34]], 1.6), C.ink);
  return s.out();
}
/** a stool (origin: floor) */
export function stool(c, w = 44, h = 30) {
  return sheet().p(c.cut(c.rect(-w / 2, -h, w, 8), 0.3, 4), C.wood).p(c.cut(c.rect(-w / 2 + 4, -h + 8, 6, h - 8), 0.2, 3) + c.cut(c.rect(w / 2 - 10, -h + 8, 6, h - 8), 0.2, 3), C.wood2).out();
}
/** a stylus / reed pen held in the hand (origin: the grip) */
export function pen(c) { return sheet().p(c.ribbon([[0, 6], [2, -26]], 2.4), C.wood2).p(c.cut([[1, 6], [3, 6], [2, 12]], 0.1, 2), C.ink).out(); }
/** a big paper bill (a debt note) with a sum; kept separate so a new sum can replace the old one */
export function bill(c, text, { w = 92, h = 62, size = 30, cross = false } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10), 0.4, 6), C.wood3);
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), mix(C.wheat, C.cream, 0.45));
  s.x(c.ribbon([[-w / 2 + 8, h / 2 - 10], [w / 2 - 20, h / 2 - 10]], 1.2) + c.ribbon([[-w / 2 + 8, h / 2 - 17], [w / 2 - 30, h / 2 - 17]], 1.2), C.ink, 'opacity=".35"');
  const x = cross ? `<path d="${c.ribbon([[-w * 0.36, -6], [w * 0.36, -10]], 3.2)}" fill="${C.terracotta}"/>` : '';
  return `${s.out()}<text x="0" y="${(size * 0.1).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="600" fill="${C.ink}">${text}</text>${x}`;
}
/** a hanging tally card for the debt (origin: its centre; hangs on two strings) */
export function tallyCard(c, w = 190, h = 150) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12), 0.5, 8), mix(C.wood3, C.ochre, 0.3));
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 8), mix(C.parchment, C.cream, 0.4));
  s.p(c.cut(c.rect(-w / 2 + 6, h / 2 - 20, w - 12, 6), 0.3, 6), mix(C.wood3, C.sand2, 0.4));
  return `<path d="M${-w * 0.32} -1600V${-h / 2 - 6}M${w * 0.32} -1600V${-h / 2 - 6}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}`;
}
/** where item i of a 10-item pyramid (4-3-2-1) sits on a tally card (card origin) */
export function tallySpot(i, dx = 38, dy = 34, base = 50) {
  const rows = [4, 3, 2, 1];
  let r = 0, k = i;
  while (k >= rows[r]) { k -= rows[r]; r++; }
  return [(k - (rows[r] - 1) / 2) * dx, base - r * dy];
}
/** a little paper flame for the land of torment (origin: its foot) — muted rust and ember, not bright */
export function emberFlame(c, h = 40) {
  const s = sheet();
  s.p(c.cut([[0, 0], [-h * 0.34, -h * 0.3], [-h * 0.2, -h * 0.66], [-h * 0.05, -h * 0.5], [0, -h], [h * 0.14, -h * 0.58], [h * 0.3, -h * 0.72], [h * 0.34, -h * 0.28]], 0.5, 4), mix(C.terracotta, C.sunRay, 0.4));
  s.p(c.cut([[0, 0], [-h * 0.16, -h * 0.22], [-h * 0.06, -h * 0.5], [h * 0.08, -h * 0.4], [h * 0.16, -h * 0.2]], 0.3, 3), mix(C.sun, C.sunDeep, 0.4));
  return s.out();
}
/** a finger with a drop of water on its tip (origin: the drop) */
export function fingerDrop(c, skin = C.skin3) {
  const s = sheet();
  s.p(c.cut([[-8, -44], [8, -44], [7, -12], [4, -5], [-4, -5], [-7, -12]], 0.3, 4), skin);
  s.x(c.poly(c.ell(0, -12, 3.6, 3, 8)), shade(skin, 0.3), 'opacity=".7"');
  s.p(c.cut([[0, -2], [5, 6], [4.5, 10], [0, 12.5], [-4.5, 10], [-5, 6]], 0.2, 2), C.lake2);
  s.x(c.poly(c.circ(-1.5, 7, 1.4, 6)), '#fff', 'opacity=".8"');
  return s.out();
}
/** a parched tongue-and-mouth sign: an open, dry mouth with a heat wave (origin centre) */
export function thirstSign(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, 18, 11, 16), 0.4, 3), shade(C.skin3, -0.35));
  s.p(c.cut(c.ell(0, 5, 10, 5, 12), 0.3, 3), mix(C.blush, C.clay, 0.4));
  let wv = '';
  for (let i = 0; i < 3; i++) wv += c.ribbon(c.qbez([-14 + i * 14, -18], [-18 + i * 14, -28], [-12 + i * 14, -38], 6), 2);
  s.x(wv, C.terracotta, 'opacity=".75"');
  return s.out();
}
/** a board plank (for the chasm; origin: its left end) */
export function plank(c, len = 170) {
  return sheet().p(c.cut([[0, -6], [len, -8], [len + 2, 6], [0, 7]], 0.5, 8), C.wood3).x(c.ribbon([[6, -1], [len - 6, -2]], 1.2), shade(C.wood3, -0.25), 'opacity=".6"').out();
}
/** a bell on a cord (origin: the top of the cord) */
export function handBell(c) {
  return sheet().p(c.ribbon([[0, 0], [0, 14]], 2), C.rope).p(c.cut([[-4, 14], [4, 14], [10, 30], [-10, 30]], 0.3, 3), C.sun).p(c.cut(c.circ(0, 32, 3, 6), 0.1, 2), C.ochre).out();
}
/** a tray with a cup and a jug (origin: its centre) */
export function tray(c, { coins = false } = {}) {
  const s = sheet();
  s.p(c.cut([[-34, 0], [34, 0], [30, 6], [-30, 6]], 0.3, 4), coins ? C.sun : C.wood3);
  if (!coins) {
    s.p(c.cut([[-18, 0], [-24, -14], [-20, -26], [-12, -30], [-10, -34], [2, -34], [0, -28], [6, -22], [4, -8], [-2, 0]], 0.4, 3), C.pot);
    s.p(c.cut([[10, 0], [8, -6], [12, -14], [22, -14], [26, -6], [22, 0]], 0.3, 3), C.clay);
  } else {
    let d = '';
    for (let i = 0; i < 8; i++) d += c.cut(c.circ(-24 + (i % 4) * 16 + (i > 3 ? 8 : 0), -5 - (i > 3 ? 7 : 0), 7, 10), 0.2, 2);
    s.p(d, shade(C.sun, 0.1));
  }
  return s.out();
}
/** a golden cord between two hands (unit length 100 along +x; pose it with r and sx) */
export function cord(c, col = C.sun) { return `<path d="${c.ribbon([[0, 0], [100, 0]], 3.4)}" fill="${col}"/>`; }

/* ================================================================== the rich man's estate */
export const ES = { GY: 712, DAIS: 684, CHAIR: 1110, GATE: [440, 540], BED: [590, 760], COL: [1000, 1250, 1520], DOOR: [1340, 1420], STEP: 960 };
/**
 * The rich man's estate: a walled courtyard. Over the wall, his lands — olive groves on the hills, fields of wheat,
 * a storehouse; in the wall on the left a gateway to the road; a dug garden bed with a fig tree; on the right the house
 * with a portico on a dais, his chair between the first columns and the dark doorway behind. Free layers: fly (hung
 * things over the court), back (behind the people), act (people), front (in front of them), W (words).
 */
export function estateSet(S, { skyCols = ESTATE, sky2 = null, sunAt = [1270, 150], chair = true } = {}) {
  const c = S.c;
  const q = makeCutter('lk16-estate');
  const { GY, DAIS } = ES;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(q, 40), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[560, 190, 170], [990, 140, 130]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(q, w), { x, y, len: 800 }) }));
  /* his lands: the far hills with olive rows, the wheat fields, a storehouse */
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(q, { y: 420, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.1) }).markup);
  const mid = S.layer({ par: 0.15, sh: 3 });
  const mh = hillsWith(q, { y: 478, amps: [12, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sand, 0.15) });
  let rows = '', fields = '';
  for (let r = 0; r < 3; r++) for (let x = -700 + r * 20; x < 2400; x += 44) { if ((x > 520 && x < 900) || (x > 1500 && x < 1800)) continue; rows += q.cut(q.blob(x, mh.fn(x) + 12 + r * 16, 13, 9, 9, 0.2), 0.6, 4); }
  [[560, 880], [1520, 1790], [-300, -60]].forEach(([x0, x1]) => { fields += q.cut([[x0, mh.fn(x0) + 8], [x1, mh.fn(x1) + 6], [x1 + 20, mh.fn(x1) + 50], [x0 - 20, mh.fn(x0) + 52]], 0.8, 10); });
  mid.add(mh.markup + sheet().p(fields, mix(C.wheat, C.sand, 0.25)).x(q.ribbon([[570, mh.fn(570) + 24], [870, mh.fn(870) + 22]], 1.4) + q.ribbon([[560, mh.fn(560) + 38], [880, mh.fn(880) + 36]], 1.4), C.wheat2, 'opacity=".6"').p(rows, mix(C.olive, C.sage, 0.35)).out()
    + house(q, 1060, mh.fn(1100) + 14, 90, 60, { stairs: false }) + house(q, 1150, mh.fn(1180) + 16, 60, 44, { stairs: false }) + cypress(q, 1036, mh.fn(1036) + 16, 80));
  /* the courtyard wall with the gateway on the left, the road showing through it */
  const wallL = S.layer({ par: 0.3, sh: 3 });
  const [G0, G1] = ES.GATE;
  const road = sheet();
  road.p(q.cut(q.rect(G0 - 10, 520, G1 - G0 + 20, GY - 510), 0.3, 6), mix(C.skyBlue, C.cream, 0.4));
  road.p(q.cut([[G0 - 10, 620], [G0 + 40, 600], [G1 - 20, 612], [G1 + 10, 606], [G1 + 10, GY], [G0 - 10, GY]], 0.5, 6), mix(C.hillMid, C.sand, 0.2));
  road.p(q.cut([[G0 + 30, GY], [G0 + 48, 640], [G1 - 44, 640], [G1 - 10, GY]], 0.4, 6), mix(C.sand, C.dune, 0.2));
  wallL.add(road.out());
  const wcol = mix(C.plaster, C.sand, 0.35);
  const w = sheet();
  const gate = [[G0, GY + 6], [G0, 580], ...q.arc((G0 + G1) / 2, 580, (G1 - G0) / 2, 46, PI, 2 * PI, 12), [G1, GY + 6]];
  w.p(q.cut([[-900, 560], [2500, 560], [2500, GY + 6], [-900, GY + 6]], 0.8, 24) + q.hole(gate, 0.5, 6), wcol);
  w.p(q.cut([[-900, 548], [2500, 548], [2500, 564], [-900, 564]], 0.5, 20), shade(wcol, -0.1));
  let blot = '';
  for (let i = 0; i < 12; i++) blot += q.cut(q.blob(q.rr(-400, 2000), q.rr(590, 690), q.rr(20, 50), q.rr(8, 16), 10, 0.2), 0.8, 6);
  w.x(blot, shade(wcol, -0.07), 'opacity=".55"');
  w.p(q.ribbon(gate.slice(1, -1), 12), C.wood2);
  wallL.add(w.out());
  /* the fig tree over the garden bed */
  const fig = sheet();
  fig.p(q.ribbon([[640, GY - 20], [636, 600], [610, 520], [580, 480]], (u) => 16 - u * 8) + q.ribbon([[632, 580], [690, 520], [720, 500]], 8), C.wood2);
  let lv = '';
  for (let i = 0; i < 10; i++) lv += q.cut(q.blob(q.rr(540, 760), q.rr(440, 540), q.rr(30, 50), q.rr(20, 32), 11, 0.2), 0.8, 5);
  fig.p(lv, mix(C.moss, C.olive, 0.3));
  let lv2 = '';
  for (let i = 0; i < 7; i++) lv2 += q.cut(q.blob(q.rr(560, 740), q.rr(450, 520), q.rr(22, 34), q.rr(14, 22), 10, 0.2), 0.8, 5);
  fig.p(lv2, C.leaf);
  wallL.add(fig.out());
  /* the house: its wall, the dark doorway, the portico on the dais */
  const houseL = S.layer({ par: 0.42, sh: 4 });
  const hcol = mix(C.plaster, C.cream, 0.3);
  const h = sheet();
  h.p(q.cut([[ES.STEP + 20, 300], [2500, 300], [2500, DAIS + 2], [ES.STEP + 20, DAIS + 2]], 0.6, 20), mix(hcol, C.sand, 0.15));
  h.p(q.cut([[ES.DOOR[0], DAIS], [ES.DOOR[0], 520], ...q.arc((ES.DOOR[0] + ES.DOOR[1]) / 2, 520, (ES.DOOR[1] - ES.DOOR[0]) / 2, 34, PI, 2 * PI, 10), [ES.DOOR[1], 520], [ES.DOOR[1], DAIS]], 0.4, 6), mix(C.soilRich, C.plumRobe, 0.2));
  const CX = ES.CHAIR;
  h.p(q.cut([[CX - 40, 420], [CX + 40, 420], [CX + 40, 480], [CX - 40, 480]], 0.3, 5), mix(C.soilRich, C.plumRobe, 0.25));
  h.x(q.ribbon([[CX, 420], [CX, 480]], 3), mix(C.wood2, C.plaster2, 0.3));
  // a woven hanging behind the chair
  h.p(q.cut([[CX - 62, 510], [CX + 62, 510], [CX + 58, 640], [CX - 58, 640]], 0.5, 6), mix(C.teal2, C.sage, 0.35));
  h.x(q.ribbon([[CX - 58, 530], [CX + 58, 530]], 4) + q.ribbon([[CX - 58, 620], [CX + 58, 620]], 4), C.sun, 'opacity=".75"');
  // the dais and its steps
  h.p(q.cut([[ES.STEP + 20, DAIS], [2500, DAIS], [2500, GY + 4], [ES.STEP, GY + 4]], 0.5, 12), mix(C.stone, C.sand, 0.3));
  h.p(q.cut([[ES.STEP + 20, DAIS - 4], [2500, DAIS - 4], [2500, DAIS + 4], [ES.STEP + 20, DAIS + 4]], 0.3, 12), shade(C.stone, 0.15));
  // the roof beam and the columns
  h.p(q.cut([[ES.STEP + 10, 300], [2500, 300], [2500, 336], [ES.STEP + 10, 336]], 0.5, 16), mix(C.wood3, C.ochre, 0.2));
  h.p(q.cut([[ES.STEP, 284], [2500, 284], [2500, 304], [ES.STEP, 304]], 0.4, 16), mix(hcol, C.sand, 0.3));
  ES.COL.forEach((x) => {
    h.p(q.cut([[x - 16, DAIS], [x - 13, 350], [x + 13, 350], [x + 16, DAIS]], 0.4, 8), mix(C.stone, C.cream, 0.4));
    h.p(q.cut(q.rect(x - 24, 334, 48, 18), 0.3, 5) + q.cut(q.rect(x - 22, DAIS - 14, 44, 14), 0.3, 5), shade(C.stone, 0.05));
    h.x(q.ribbon([[x - 5, DAIS - 16], [x - 4, 354]], 2) + q.ribbon([[x + 6, DAIS - 16], [x + 5, 354]], 2), shade(C.stone, -0.12), 'opacity=".55"');
  });
  // a vine up the first column and along the beam; big storage jars by the door
  const vn = sheet();
  const vx = ES.COL[0];
  vn.p(q.ribbon([[vx - 18, DAIS], [vx - 14, 560], [vx + 10, 480], [vx - 12, 400], [vx + 4, 330], [vx + 120, 318], [vx + 260, 324]], 3.4), C.wood2);
  let vl = '';
  for (let i = 0; i < 22; i++) { const u = i / 21; const x = u < 0.6 ? vx + q.rr(-26, 22) : vx + (u - 0.6) * 650; const y = u < 0.6 ? DAIS - 30 - u * 600 : 322 + q.rr(-8, 10); vl += q.cut(q.blob(x, y, q.rr(10, 15), q.rr(8, 12), 8, 0.25), 0.4, 4); }
  vn.p(vl, mix(C.moss, C.leaf, 0.5));
  let gr = '';
  for (let i = 0; i < 4; i++) { const x = vx + 60 + i * 50; for (let k = 0; k < 6; k++) gr += q.cut(q.circ(x + (k % 3) * 5 - 5, 336 + Math.floor(k / 3) * 6 + (k % 3 === 1 ? 3 : 0), 3.4, 7), 0.1, 2); }
  vn.p(gr, shade(C.plumRobe, -0.1));
  houseL.add(h.out() + vn.out());
  [[1450, 1.9], [1492, 1.6], [1530, 1.8]].forEach(([x, sc]) => houseL.add(`<g transform="translate(${x} ${DAIS}) scale(${sc})">${oilJar(q, 46, mix(C.pot, C.clay, 0.25 + (x % 3) * 0.1))}</g>`));
  if (chair) houseL.add(`<g transform="translate(${ES.CHAIR} ${DAIS})">${sheet().p(q.cut([[-30, 0], [-30, -48], [-24, -54], [24, -54], [30, -48], [30, 0], [24, 0], [22, -34], [-22, -34], [-24, 0]], 0.4, 5), C.wood).p(q.cut([[16, -54], [20, -104], [30, -100], [30, -50]], 0.3, 4), C.wood2).p(q.cut([[-28, -44], [30, -44], [30, -34], [-28, -34]], 0.3, 4), mix(C.teal2, C.sage, 0.3)).out()}</g>`);
  /* the courtyard floor and the garden bed */
  const G = S.layer({ par: 0.44, sh: 3 });
  const gp = sheet().p(q.cut([[-1400, GY - 6], [3000, GY - 6], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.5));
  let flag = '';
  for (let i = 0; i < 60; i++) flag += q.cut(q.blob(q.rr(-500, 2100), q.rr(GY + 14, 1000), q.rr(16, 30), q.rr(6, 10), 8, 0.2), 0.3, 4);
  gp.x(flag, C.stone2, 'opacity=".5"');
  const [B0, B1] = ES.BED;
  gp.p(q.cut([[B0, GY - 8], [B0 + 10, GY - 20], [B1 - 10, GY - 22], [B1, GY - 8], [B1, GY + 14], [B0, GY + 14]], 0.8, 8), mix(C.soil, C.wood2, 0.3));
  gp.x(q.ribbon([[B0 + 14, GY - 8], [B1 - 14, GY - 10]], 2) + q.ribbon([[B0 + 12, GY + 2], [B1 - 12, GY]], 2), C.soilDark, 'opacity=".6"');
  let sprouts = '';
  for (let x = B0 + 20; x < B1 - 10; x += 22) sprouts += q.cut(q.blob(x, GY - 22, 6, 5, 7, 0.3), 0.4, 3);
  gp.p(sprouts, C.leaf);
  G.add(gp.out());
  const fly = S.layer({ par: 0.36, sh: 6, rise: 0 });
  const back = S.layer({ par: 0.46, sh: 0, flat: true });
  const act = S.layer({ par: 0.48, sh: 5 });
  const front = S.layer({ par: 0.5, sh: 5 });
  const W = S.layer({ par: 0.52, sh: 3 });
  const fore = S.layer({ par: 0.8, sh: 6 });
  fore.add(`<g transform="translate(60 990)">${sheet().p(q.cut(q.blob(0, 0, 220, 120, 14, 0.2), 1.4, 8), mix(C.moss, C.olive, 0.4)).out()}</g><g transform="translate(1560 1000)">${sheet().p(q.cut(q.blob(0, 0, 230, 120, 14, 0.2), 1.4, 8), mix(C.moss, C.olive, 0.4)).out()}</g>`);
  return {
    c, q, sk, sk2, hangL, sunEl, far, mid, wallL, houseL, G, fly, back, act, front, W, fore,
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.1, 0.6, cl.i));
    },
  };
}

/* ================================================================== the rich man's palace */
export const PAL = { GY: 712, FLOOR: 704, GATE: [640, 730], CUT: 760, TABLE: [930, 1250], TOP: 670, RICH: 860, LAZ: 600 };
/**
 * The palace of the rich man: on the left the street along its high outer wall and the great gate (x 640–730), where
 * Lazarus lies; from x 760 the wall is cut away and the banquet court shows: purple hangings between columns, lamps on
 * chains, a long table laden for the feast. Free layers: skyFx (things in the sky), backFx (flat glow behind the feast),
 * hall (in the court, behind the table), table (the table itself), act (people in front), street (the street's people),
 * W (words), trap (a flat that rises from below in front).
 */
export function palaceSet(S, { skyCols = FEAST, sky2 = FEAST_NIGHT } = {}) {
  const c = S.c;
  const q = makeCutter('lk16-palace');
  const { GY, FLOOR, TOP } = PAL;
  const [G0, G1] = PAL.GATE;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'night', rise: 0 }) : null;
  if (sk2) sk2.layer.fade(0);
  const skyFx = S.layer({ par: 0.04, sh: 4, rise: 0 });
  /* the town beyond */
  const view = S.layer({ par: 0.12, sh: 2 });
  let hs = '';
  for (let i = 0; i < 16; i++) { const x = -400 + i * 150 + q.rr(-20, 20); hs += house(q, x, 470 + q.rr(-6, 12), q.rr(70, 120), q.rr(50, 90), { stairs: false, wall: mix(C.plaster, C.dusk, 0.25), shadow: mix(C.plaster2, C.duskViolet, 0.3) }); }
  view.add(band(q, { y: 440, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup + hs + cypress(q, 420, 470, 110, mix(C.moss2, C.duskViolet, 0.3)));
  /* the court behind the cut: back wall with columns and purple hangings, ceiling */
  const courtL = S.layer({ par: 0.3, sh: 3 });
  const cw = mix(C.plaster, C.sand, 0.25);
  const ct = sheet();
  ct.p(q.cut([[PAL.CUT - 20, 250], [2500, 250], [2500, FLOOR + 4], [PAL.CUT - 20, FLOOR + 4]], 0.6, 20), cw);
  for (let x = 820; x < 2400; x += 170) {
    ct.p(q.cut([[x, 290], [x + 110, 290], [x + 104, 360], [x + 90, 560], [x + 96, 620], [x + 14, 620], [x + 20, 560], [x + 6, 360]], 0.6, 8), PURPLE);
    ct.x(q.ribbon([[x + 30, 300], [x + 36, 610]], 3) + q.ribbon([[x + 74, 300], [x + 70, 610]], 3), shade(PURPLE, -0.2), 'opacity=".55"');
    ct.p(q.cut(q.rect(x - 4, 284, 118, 12), 0.3, 6), C.sun);
    ct.p(q.cut([[x + 140, FLOOR], [x + 143, 270], [x + 163, 270], [x + 166, FLOOR]], 0.4, 8), mix(C.stone, C.cream, 0.35));
  }
  ct.p(q.cut([[PAL.CUT - 20, 180], [2500, 180], [2500, 254], [PAL.CUT - 20, 254]], 0.5, 20), mix(C.wood3, C.plaster2, 0.4));
  ct.p(q.cut(q.rect(PAL.CUT - 20, 238, 2600, 16), 0.3, 20), shade(C.indigo, 0.3));
  let mz = '';
  for (let x = PAL.CUT - 10; x < 2500; x += 34) mz += q.poly([[x, 243], [x + 17, 243], [x + 17, 251], [x + 8, 251], [x + 8, 247], [x, 247]]);
  ct.x(mz, C.sun, 'opacity=".8"');
  courtL.add(ct.out());
  const glowL = S.layer({ par: 0.3, sh: 0, flat: true });
  const feastGlow = glowL.add(`<g><ellipse cx="1080" cy="520" rx="520" ry="300" fill="url(#warm-glow)" opacity=".7"/></g>`);
  /* lamps on chains in the court */
  const lampL = S.layer({ par: 0.32, sh: 3 });
  const lamps = [[900, 320], [1120, 300], [1340, 320]].map(([x, y], i) => {
    const gl = lampL.add(`<g><circle cy="30" r="110" fill="url(#warm-glow)" opacity=".8"/></g>`);
    hanging(lampL, `<g transform="translate(-20 0)">${hangLampJ(q)}</g>`, { x, y, len: 120 });
    const fl = lampL.add(`<g><path d="M0 0C-6 -4 -5 -12 0 -20C5 -12 6 -4 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2 -5 -2 -9 0 -12C2 -9 2 -5 0 -2Z" fill="#fff4d2"/></g>`);
    return { x, y, i, fl, gl };
  });
  /* the floor of the court with a rich carpet */
  const floorL = S.layer({ par: 0.34, sh: 3 });
  const fl = sheet();
  fl.p(q.cut([[PAL.CUT - 20, FLOOR - 4], [2500, FLOOR - 4], [2500, 1700], [PAL.CUT - 20, 1700]], 0.8, 20), mix(C.stone, C.sand2, 0.3));
  fl.p(q.cut([[820, FLOOR + 6], [1420, FLOOR + 6], [1480, FLOOR + 100], [790, FLOOR + 100]], 0.8, 12), mix(PURPLE, C.indigo, 0.3));
  let dia = '';
  for (let x = 840; x < 1420; x += 38) dia += q.poly([[x, FLOOR + 54], [x + 9, FLOOR + 43], [x + 18, FLOOR + 54], [x + 9, FLOOR + 65]]);
  fl.x(dia, C.sun, 'opacity=".75"');
  floorL.add(fl.out());
  const hall = S.layer({ par: 0.36, sh: 4 });
  const table = S.layer({ par: 0.38, sh: 5 });
  const tb = sheet();
  const [T0, T1] = PAL.TABLE;
  tb.p(q.cut([[T0 - 10, TOP], [T1 + 10, TOP - 2], [T1 + 4, TOP + 16], [T0 - 4, TOP + 18]], 0.5, 8), C.wood);
  tb.p(q.cut([[T0 - 16, TOP - 6], [T1 + 16, TOP - 8], [T1 + 22, TOP + 34], [T1 - 30, TOP + 44], [T0 + 30, TOP + 46], [T0 - 22, TOP + 36]], 0.7, 8), C.linen);
  tb.x(q.ribbon([[T0 - 10, TOP + 28], [T1 + 10, TOP + 26]], 6), PURPLE, 'opacity=".8"');
  tb.x(q.ribbon([[T0 - 10, TOP + 20], [T1 + 10, TOP + 18]], 2), C.sun, 'opacity=".8"');
  tb.p(q.cut(q.rect(T0 + 10, TOP + 34, 16, FLOOR - TOP - 34), 0.3, 5) + q.cut(q.rect(T1 - 26, TOP + 34, 16, FLOOR - TOP - 34), 0.3, 5), C.wood2);
  table.add(tb.out());
  /* the outer wall, cut at x 760, with the great gate; the street in front of it */
  const wallL = S.layer({ par: 0.4, sh: 4 });
  const ow = mix(C.plaster2, C.sand2, 0.35);
  const wl = sheet();
  const gateArch = [[G0, GY + 4], [G0, 500], ...q.arc((G0 + G1) / 2, 500, (G1 - G0) / 2, 40, PI, 2 * PI, 10), [G1, 500], [G1, GY + 4]];
  // the gate's dark passage (the inside shows only as warm light)
  wl.p(q.cut(gateArch, 0.4, 6), mix(C.soilRich, C.plumRobe, 0.3));
  const cutEdge = [];
  for (let y = 360; y <= GY + 4; y += 26) cutEdge.push([PAL.CUT + (Math.floor(y / 26) % 2 ? 8 : -6) + q.rr(-4, 4), y]);
  wl.p(q.cut([[-900, 360], ...cutEdge, [-900, GY + 4]], 0.8, 16) + q.hole(gateArch, 0.4, 6), ow);
  wl.p(q.cut([[-900, 340], [PAL.CUT + 10, 340], [PAL.CUT + 4, 362], [-900, 362]], 0.5, 16), shade(ow, -0.1));
  let blocks = '';
  for (let r = 0; r < 12; r++) { const y = 380 + r * 28; for (let x = -900 + (r % 2) * 40; x < PAL.CUT - 20; x += 80) blocks += q.ribbon([[x, y], [x + 70, y]], 1.2) + q.ribbon([[x, y], [x, y + 24]], 1.2); }
  wl.x(blocks, shade(ow, -0.15), 'opacity=".45"');
  wl.p(q.ribbon(gateArch.slice(1, -1), 14), mix(C.wood2, C.ochre, 0.2));
  let studs = '';
  gateArch.slice(2, -2).forEach(([x, y], i) => { if (i % 2) studs += q.poly(q.circ(x, y, 3, 6)); });
  wl.x(studs, C.sun);
  wallL.add(wl.out());
  const leaf = wallL.add(`<g>${sheet().p(q.cut(q.rect(0, -(GY - 500) + 10, 38, GY - 510), 0.4, 6), mix(C.wood2, C.plumRobe, 0.15)).x(q.ribbon([[6, -150], [32, -150]], 3) + q.ribbon([[6, -60], [32, -60]], 3), C.sun, 'opacity=".8"').out()}</g>`);
  /* the street and its dust */
  const street = S.layer({ par: 0.42, sh: 3 });
  const sp = sheet().p(q.cut([[-1400, GY - 4], [PAL.CUT + 12, GY - 4], [PAL.CUT + 16, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone2, 0.45));
  let pebbles = '';
  for (let i = 0; i < 40; i++) pebbles += q.cut(q.blob(q.rr(-600, PAL.CUT - 20), q.rr(GY + 12, 980), q.rr(8, 18), q.rr(4, 7), 8, 0.2), 0.3, 4);
  sp.x(pebbles, C.stone2, 'opacity=".6"');
  street.add(sp.out());
  const act = S.layer({ par: 0.42, sh: 5 });
  const W = S.layer({ par: 0.44, sh: 3 });
  const trap = S.layer({ par: 0.46, sh: 6, rise: 0 });
  const front = S.layer({ par: 0.8, sh: 6 });
  front.add(`<g transform="translate(1600 1000)">${sheet().p(q.cut(q.blob(0, 0, 240, 120, 14, 0.2), 1.4, 8), mix(C.moss, C.olive, 0.4)).out()}</g>`);
  return {
    c, q, sk, sk2, skyFx, view, courtL, glowL, feastGlow, lampL, floorL, hall, table, wallL, leaf, street, act, W, trap, front,
    update(t, time, { lit = 1, open = 0.3 } = {}) {
      lamps.forEach((l) => {
        const k = 1 + (time ? Math.sin(time * 9 + l.i * 2) * 0.08 : 0);
        pose(l.fl, { x: l.x + 20, y: l.y + 36, sx: 1 / k, sy: k * Math.max(0.05, lit), o: lit });
        pose(l.gl, { x: l.x - 20, y: l.y, s: 0.6 + lit * 0.4, o: lit * 0.85 });
      });
      pose(feastGlow, { o: lit });
      pose(leaf, { x: G1 - 38, y: GY, sx: 1 - open * 0.8 });
    },
  };
}

/* ================================================================== beyond death */
export const AF = { EDGE: 720, TOP: 420, HX: 900, HY: 664, AX: 570, LX: 590, POOL: 460, RX: 1020 };
/**
 * The world beyond death. High on the left the land of Abraham's side in light — a green height, a spring and its pool,
 * an olive of life, Abraham seated with Lazarus at his breast; its cliff drops at x ≈ 700. Low on the right the dim,
 * parched land of Hades, cracked and rust-brown, where small flames lick along the ground; its cliff rises at x ≈ 890.
 * Between them the chasm, dark and deep. Layers: sk (dim sky), light (the flat gold light of the height, behind all),
 * height (its land), abr (Abraham and Lazarus), chasm, hades (land), fire (little flames), heat (flat ember glow
 * behind the rich man), act (the rich man), fly (hung pictures), W (words). update(t, T) flickers the flames.
 */
export function afterSet(S, { skyCols = HADES } = {}) {
  const c = S.c;
  const q = makeCutter('lk16-after');
  const { EDGE, TOP, HX, HY } = AF;
  const sk = sky(S, skyCols);
  const gid = S.id('chasm'), hid = S.id('heat');
  S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2d34"/><stop offset=".45" stop-color="#1e1820"/><stop offset="1" stop-color="#0f0c12"/></linearGradient>`
    + `<radialGradient id="${hid}"><stop offset="0" stop-color="#e0764a" stop-opacity=".55"/><stop offset=".55" stop-color="#b8543a" stop-opacity=".22"/><stop offset="1" stop-color="#8a3a2e" stop-opacity="0"/></radialGradient>`);
  /* the light of the height: a gold wash over the left of the sky (flat, behind everything) */
  const light = S.layer({ par: 0.04, sh: 0, flat: true, rise: 0, pad: 60 });
  light.add(`<ellipse cx="480" cy="260" rx="900" ry="620" fill="url(#halo-glow)" opacity=".95"/><ellipse cx="480" cy="300" rx="560" ry="380" fill="url(#halo-glow)"/>`);
  const rays = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
  rays.add(`<g transform="translate(${AF.AX} 260)">${rayBurstA(q, { n: 18, r0: 80, r1: 420, spread: 0.03, color: '#fff3cf', o: 0.16 })}</g>`);
  /* far: the hills of the height (lit) and the dim ridges of Hades */
  const far = S.layer({ par: 0.1, sh: 2 });
  far.add(sheet().p(q.ridge(q.wave(360, [14, 6], [700, 220]), -900, EDGE - 60, 1700, 12, 1), mix(C.hillFar, C.halo, 0.35)).p(q.ridge(q.wave(560, [30, 10], [500, 170]), EDGE + 180, 2500, 1700, 12, 1), mix(C.soilDark, C.plumRobe, 0.3)).out());
  /* the chasm (behind both lands) */
  const chasm = S.layer({ par: 0.2, sh: 2 });
  chasm.add(`<path d="${q.cut([[EDGE - 60, 520], [HX + 60, 600], [HX + 40, 1800], [EDGE - 40, 1800]], 1, 10)}" fill="url(#${gid})"/>`);
  const mist = S.layer({ par: 0.22, sh: 0, flat: true });
  let wisps = '';
  for (let i = 0; i < 6; i++) wisps += `<path d="${q.cut(q.blob(EDGE + 90 + q.rr(-50, 50), 820 + i * 60, q.rr(60, 90), q.rr(10, 16), 10, 0.3), 0.8, 6)}" fill="#6a5a62" opacity="${(0.35 - i * 0.04).toFixed(2)}"/>`;
  mist.add(wisps);
  /* the height: land, the spring and its pool, the tree */
  const height = S.layer({ par: 0.3, sh: 4, pad: 60 });
  const hfn = (x) => TOP + Math.sin(x * 0.006) * 8 - Math.max(0, (x - 200) / 500) * 6;
  const hp = [];
  for (let x = -900; x <= EDGE; x += 14) hp.push([x, hfn(x) + q.rr(-1, 1)]);
  hp.push([EDGE + 18, TOP + 30], [EDGE + 6, TOP + 110], [EDGE + 30, TOP + 200], [EDGE + 10, TOP + 320], [EDGE + 36, TOP + 460], [EDGE + 20, 1800], [-900, 1800]);
  const hs = sheet();
  // the height is a crust of green land borne on golden cloud
  const crust = [];
  for (let x = -900; x <= EDGE; x += 14) crust.push([x, hfn(x) + q.rr(-1, 1)]);
  crust.push([EDGE + 18, TOP + 30], [EDGE + 4, TOP + 70]);
  for (let x = EDGE - 10; x >= -900; x -= 40) crust.push([x, TOP + 64 + Math.sin(x * 0.03) * 10 + q.rr(-4, 4)]);
  // the cloud mass: a soft base with billows along its right edge and its face
  const base = [[-900, TOP + 40]];
  for (let y = TOP + 40; y <= 1700; y += 60) base.push([EDGE - 30 + Math.sin(y * 0.02) * 26 - (y - TOP) * 0.04, y]);
  base.push([-900, 1700]);
  hs.p(q.cut(base, 1, 10), mix(C.cream, C.halo, 0.5));
  let puffs = '';
  for (let y = TOP + 70; y < 1300; y += 70) puffs += q.cut(q.blob(EDGE - 40 - (y - TOP) * 0.04 + q.rr(-10, 10), y, q.rr(50, 70), q.rr(34, 44), 18, 0.08), 0.5, 6);
  for (let i = 0; i < 14; i++) puffs += q.cut(q.blob(q.rr(-700, EDGE - 120), q.rr(TOP + 120, TOP + 600), q.rr(70, 120), q.rr(30, 46), 18, 0.08), 0.5, 6);
  hs.p(puffs, mix(C.linen, C.halo, 0.3));
  let shadeP = '';
  for (let i = 0; i < 10; i++) shadeP += q.cut(q.blob(q.rr(-700, EDGE - 100), q.rr(TOP + 160, TOP + 640), q.rr(60, 100), q.rr(14, 22), 16, 0.1), 0.5, 6);
  hs.x(shadeP, mix(C.halo, C.haloRim, 0.4), 'opacity=".5"');
  hs.p(q.poly(crust), mix(C.sage2, C.halo, 0.3));
  hs.p(q.cut(q.ell(AF.POOL, TOP + 12, 70, 10, 20), 0.4, 5), mix(C.lake, C.skyBlue, 0.3));
  hs.x(q.ribbon([[AF.POOL - 40, TOP + 10], [AF.POOL + 30, TOP + 12]], 1.6), '#fff', 'opacity=".7"');
  hs.p(q.cut([[AF.POOL - 110, TOP + 2], [AF.POOL - 96, TOP - 30], [AF.POOL - 70, TOP - 40], [AF.POOL - 50, TOP - 20], [AF.POOL - 60, TOP + 4]], 0.8, 6), mix(C.rock, C.halo, 0.3));
  hs.p(q.ribbon([[AF.POOL - 72, TOP - 26], [AF.POOL - 58, TOP - 10], [AF.POOL - 40, TOP + 6]], 5), C.lake2);
  height.add(hs.out() + olive(q, 250, hfn(250) + 18, 0.9, { leaf: mix(C.olive, C.halo, 0.25), leaf2: mix(C.sage, C.halo, 0.3) }) + olive(q, -60, hfn(-60) + 18, 0.8, { leaf: mix(C.olive, C.halo, 0.25), leaf2: mix(C.sage, C.halo, 0.3) })
    + flowers(q, { x0: 150, x1: 680, y: TOP + 8, fn: hfn, n: 20, colors: [C.cream, C.halo, C.jesusMantle, C.lavender] }));
  const abr = S.layer({ par: 0.3, sh: 5, pad: 60 });
  /* Hades: cracked, rust-brown land, rocks */
  const hades = S.layer({ par: 0.34, sh: 4, pad: 60 });
  const dfn = (x) => HY - 4 + Math.sin(x * 0.012) * 4 + Math.max(0, x - 1300) * 0.02;
  const dp = [[HX - 10, 1800], [HX + 12, HY + 300], [HX - 8, HY + 160], [HX + 10, HY + 60], [HX - 4, HY + 4]];
  for (let x = HX; x <= 2500; x += 14) dp.push([x, dfn(x) + q.rr(-1.5, 1.5)]);
  dp.push([2500, 1800]);
  const ds = sheet();
  ds.p(q.poly(dp), mix(C.soil, C.plumRobe, 0.2));
  let cracks = '';
  for (let i = 0; i < 16; i++) { const x = q.rr(HX + 40, 1800), y = q.rr(HY + 16, 980); cracks += q.ribbon([[x, y], [x + q.rr(-30, 30), y + q.rr(8, 20)], [x + q.rr(-40, 40), y + q.rr(20, 34)]], 1.6); }
  ds.x(cracks, C.soilDark, 'opacity=".7"');
  ds.p(q.cut([[HX - 4, HY + 4], [HX + 30, HY], [HX + 20, HY + 120], [HX + 4, HY + 300], [HX - 10, 1800], [HX - 14, HY + 160]], 1, 8), mix(C.soilDark, C.plumRobe, 0.25));
  hades.add(ds.out() + rock(q, 1260, dfn(1260) + 8, 90, 40, mix(C.rock3, C.soilDark, 0.45)) + rock(q, 1480, dfn(1480) + 6, 60, 26, mix(C.rock3, C.soilDark, 0.45)));
  const heat = S.layer({ par: 0.34, sh: 0, flat: true, pad: 60 });
  const glowR = heat.add(`<g><ellipse rx="340" ry="170" fill="url(#${hid})"/></g>`);
  const fire = S.layer({ par: 0.36, sh: 2, pad: 60 });
  const FL = [[HX + 50, 0.9], [1120, 0.7], [1200, 1.0], [1330, 0.8], [1420, 0.7], [960, 0.6], [1560, 0.9]].map(([x, s], i) => ({ i, x, s, y: dfn(x) + 6, el: fire.add(`<g>${emberFlame(q, 44)}</g>`) }));
  const act = S.layer({ par: 0.36, sh: 5, pad: 60 });
  const fly = S.layer({ par: 0.2, sh: 6, rise: 0 });
  const W = S.layer({ par: 0.4, sh: 3 });
  return {
    c, q, sk, light, rays, far, chasm, mist, height, abr, hades, heat, glowR, fire, act, fly, W, hfn, dfn, FL,
    update(t, T, { fl = 1, heatX = AF.RX, heatO = 1 } = {}) {
      FL.forEach((f) => {
        const k = T ? 1 + Math.sin(T * 5 + f.i * 1.9) * 0.1 : 1;
        pose(f.el, { x: f.x, y: f.y, sx: f.s / k, sy: f.s * k * fl, o: fl > 0.02 ? 1 : 0 });
      });
      pose(glowR, { x: heatX, y: HY - 40, o: heatO });
    },
  };
}
import { rayBurst as rayBurstA } from '../john1/lib.js';

/** Mammon: a squat gilded idol of money-bags with coin eyes and a crown (origin: its plinth's foot) — after Matthew 6 */
export function mammon(c) {
  const g = mix(C.sun, C.ochre, 0.35), g2 = shade(g, -0.18);
  const s = sheet();
  s.p(c.cut(c.rect(-90, -50, 180, 50), 0.4, 6), mix(C.rock2, C.plumRobe, 0.2));
  s.p(c.cut([[-24, -50], [-80, -80], [-96, -140], [-70, -210], [-30, -236], [30, -236], [70, -210], [96, -140], [80, -80], [24, -50]], 0.8, 6), g);
  s.p(c.ribbon([[-40, -232], [40, -232]], 12), g2);
  s.p(c.cut(c.ell(0, -276, 44, 40, 20), 0.5, 5), g);
  s.p(c.cut([[-34, -306], [-38, -338], [-22, -318], [-10, -344], [0, -320], [10, -344], [22, -318], [38, -338], [34, -306]], 0.4, 4), shade(C.sun, 0.1));
  s.x(c.poly(c.circ(-16, -280, 9, 12)) + c.poly(c.circ(16, -280, 9, 12)), C.sun);
  s.x(c.poly(c.circ(-16, -280, 4, 8)) + c.poly(c.circ(16, -280, 4, 8)), g2);
  s.x(c.ribbon([[-14, -258], [14, -258]], 2.6), g2);
  let coins = '';
  for (let i = 0; i < 14; i++) coins += c.cut(c.circ(c.rr(-70, 70), c.rr(-200, -70), c.rr(6, 10), 10), 0.2, 3);
  s.x(coins, shade(C.sun, 0.2), 'opacity=".8"');
  s.x(c.ribbon([[-60, -120], [60, -118]], 3) + c.ribbon([[-70, -170], [70, -168]], 3), g2, 'opacity=".6"');
  return s.out();
}
/** a little purse hung at a belt (origin: its tie) */
export function beltPurse(c, col = C.leather) {
  return sheet().p(c.cut([[-4, 0], [4, 0], [8, 6], [14, 14], [14, 24], [8, 30], [-8, 30], [-14, 24], [-14, 14], [-8, 6]], 0.4, 3), col).p(c.ribbon([[-6, 3], [6, 3]], 2.6), C.sun).x(c.poly(c.circ(4, 18, 2.4, 6)), C.sun).out();
}
/** laughter marks: short curved strokes (origin centre) */
export function laughMarks(c, col = C.terracotta) {
  return sheet().p(c.ribbon(c.arc(0, 0, 12, 12, -0.9, 0.2, 6), 2.6) + c.ribbon(c.arc(0, 0, 20, 20, -0.8, 0.1, 6), 2.6), col).out();
}
