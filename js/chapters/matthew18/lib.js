// Matthew 18 — the cast and cut-outs of this chapter. The house at Capernaum and the child in the middle, the
// paper crowns, the millstone and the snipped cards come from Mark 9; sheep, the shepherd and the pasture from John 10;
// the angels from Mark 8 and the Father's light (never a figure) from John 17; the brothers from Matthew 7, the street
// from Matthew 11, the prison from Matthew 5. Our own: the king's counting hall, the debt that is a mountain of gold
// talents and the debt that is a handful of silver, the bill that is torn, the tally that never ends.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, waterBand, palm, olive, rock, cloud, sun, hillsWith, town } from '../../assets/nature.js';
import { prisonHouse as prisonHouse5, doorLeaf as doorLeaf5 } from '../matthew5/lib.js';
import { boat } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';
import { houseSection, withFace as withFace3, faceBits as faceBits3 } from '../mark3/lib.js';
import { crown as crown6 } from '../mark6/lib.js';
import { fade as fade_ } from '../../core/anim.js';
import { LOOK as L9 } from '../mark9/lib.js';
import { childPerson } from '../matthew2/lib.js';
import { throne as throne6 } from '../mark6/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, coin, coinStack, ledger, addToHead, addToBody, wordSlip, candle, bowl, loaf, cup } from '../mark2/lib.js';
export { paperCrown, measureRod, millstone, scissors, paperHand, paperFoot, paperEye, stumbleCard, lifeGate, firePit, eyePatch, labelOnString, darkScrap, crownOfLight, reachingHand, basinTowel } from '../mark9/lib.js';
export { TWELVE, houseSection, withFace, faceBits, along, bubble, strip, question, tornPair, shadowPerson, sparkle, crutch, man, woman, nameTag } from '../mark3/lib.js';
export { ewe, sheepRig, shoulderLamb, onShoulders, pastureSet, SHEPHERD, WOOLS } from '../john10/lib.js';
export { angel, lightCrown } from '../mark8/lib.js';
export { fatherLight, joyHeart, fillHeart } from '../john17/lib.js';
export { throne, crown, noble, staff, helmet } from '../mark6/lib.js';
export { prisonHouse, doorLeaf, bigKey } from '../matthew5/lib.js';
export { bonds, ropeLine } from '../mark15/lib.js';
export { knotHalf } from '../mark7/lib.js';
export { lightKnot } from '../mark10/lib.js';
export { folk, group } from '../john6/lib.js';
export { kid, kidHead, KID_LOOKS, townSet, hillsSet, stumbleStone } from '../matthew11/lib.js';
export { BRO_A, BRO_B } from '../matthew7/lib.js';
export { TAXMEN, heartGlow } from '../matthew9/lib.js';
export { qMark, bang, tick, crossX, glow, shout, plate } from '../matthew12/lib.js';
export { burst, moodPuppet, purse } from '../mark12/lib.js';
export { greek } from '../john12/lib.js';
export { taxBooth, lowTable, scrollOpen } from '../mark2/lib.js';
export { tr, childPerson, hanging };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ================================================================== skies */
export const DAY = ['#c6dcda', '#ebe6d0', '#f4e6cc'];
export const WARM = ['#d9d2c0', '#f0e2c6', '#f6e3c4'];
export const DUSK = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
export const EVENING = ['#b7a2bd', '#eeb993', '#f6d6aa'];
export const NIGHT = ['#1d2349', '#2b3262', '#4a4876'];
export const GOLDEN_SKY = ['#e6c9a0', '#f2d3a2', '#f7e2bd'];

/* ================================================================== the cast */
/** the child Jesus sets in the middle (Mark 9's child, with Matthew's big-headed children) */
export const CHILD = L9.child;
export const child = (c, extra = {}) => childPerson(c, { ...CHILD, ...extra });
/** the king of the parable: a kind, grey-bearded face under the crown */
export const KING = { robe: C.plumRobe, mantle: C.ochre, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.sun, mantleArm: true };
/** the servant who owed ten thousand talents: a steward's good clothes */
export const DEBTOR = { robe: C.tealRobe, mantle: C.clayMantle, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.ochre };
/** his wife */
export const WIFE = { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair2, beard: 'none', skin: C.skin };
/** the fellow servant who owed a hundred denarii: patched, poor */
export const FELLOW = { robe: mix(C.stone2, C.sand2, 0.45), hair: C.hair2, hairStyle: 'curly', beard: 'full', skin: C.skin4, belt: C.rope };
/** the other servants of the house (they see, they grieve, they tell) */
export const SERVANTS = [
  { robe: C.sageRobe, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin2, belt: C.leather },
  { robe: C.wheatRobe, hair: C.greyHair, hairStyle: 'bald', beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope },
  { robe: C.dustyBlue, hairStyle: 'veil', veil: C.linen, hair: C.hair3, beard: 'none', skin: C.skin4 },
  { robe: C.mauve, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.leather },
];
/** the king's steward with the accounts */
export const STEWARD = { robe: C.linen2, mantle: C.dustyBlue, hair: C.hair, hairStyle: 'wrap', veil: C.stone, veil2: C.dustyBlue, beard: 'full', skin: C.skin2, belt: C.leather };
/** the jailers (dark and plain, faces kept kind of blank) */
export const JAILER = { robe: mix(C.storm2, C.wood2, 0.45), hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.leather };

/* ================================================================== the house at Capernaum */
export const HX0 = 470, HX1 = 1130, FLOOR = 650, CEIL = 300;
/**
 * Capernaum, the house by the lake (Mark 9's): sky, sun and a cloud on strings, the lake with boats, the shore, and a
 * house cut open (layer `houseL`, par P). Call front() after adding the people. Returns handles and update(T).
 */
export function capHouse(S, { skyCols = DAY, P = 0.4, sunAt = [1250, 140] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cl = hanging(hangL, cloud(c, 170), { x: 400, y: 150, len: 700 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 2], lens: [1000, 340, 120], color: C.hillFar }).markup);
  const lakeL = S.layer({ par: 0.16, sh: 2 });
  lakeL.add(waterBand(c, { y: 470, color: C.lake, foamN: 20 }).markup);
  const b = boat(c, { mast: true });
  lakeL.add(`<g transform="translate(230 500) scale(.3)">${b.back}${b.front}</g><g transform="translate(1370 492) scale(.24)">${b.back}${b.front}</g>`);
  const shoreL = S.layer({ par: 0.3, sh: 3 });
  shoreL.add(sheet().p(c.cut([[-900, 548], [2500, 548], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.3)).out());
  shoreL.add(palm(c, 240, 560, 190) + palm(c, 1350, 562, 170) + olive(c, 1480, 566, 0.8) + rock(c, 360, 600, 50, 20));
  const H = houseSection(c, { x0: HX0, x1: HX1, floor: FLOOR, ceil: CEIL, doorX: 50 });
  const houseL = S.layer({ par: P, sh: 4 });
  houseL.add(H.back);
  return {
    c, sk, hangL, H, houseL, P,
    door: (H.door[0] + H.door[1]) / 2,
    front() { const f = S.layer({ par: P, sh: 5 }); f.add(H.front + H.stairs); return f; },
    update(T) {
      pose(sunEl, { x: sunAt[0], y: sunAt[1], r: Math.sin(T * 0.6) });
      pose(cl, { x: 400 + Math.sin(T * 0.1) * 20, y: 150, r: Math.sin(T * 0.6 + 1) * 1.3 });
    },
  };
}
/** where the disciples sit along the room's walls: [x, s] (five on each side of the middle) */
export const SEATS = [[540, 0.76], [580, 0.78], [620, 0.8], [660, 0.8], [700, 0.82], [900, 0.82], [940, 0.8], [980, 0.8], [1020, 0.78], [1060, 0.76]];

/* ================================================================== the king's counting hall */
export const KH = { FLOOR: 690, DAIS: 628, TX: 800 };
/**
 * The king's hall: warm sky through tall arches, a wall with a painted frieze, columns, a stepped dais with the
 * throne, lamps, and a table of accounts on the left. update(T, { lamps }) flickers the lamps.
 */
export function kingHall(S, { skyCols = WARM, P = 0.45 } = {}) {
  const c = S.c;
  sky(S, skyCols);
  const view = S.layer({ par: 0.12, sh: 1 });
  view.add(sheet().p(c.ridge(c.wave(450, [14, 5], [260, 90]), -900, 2500, 1700, 12, 1), mix(C.hillMid, C.sand2, 0.35)).out());
  const wall = S.layer({ par: 0.22, sh: 3 });
  const W = sheet();
  const arches = [440, 1160].map((x) => [[x - 64, 500], [x - 64, 300], ...c.arc(x, 300, 64, 64, PI, 2 * PI, 12), [x + 64, 500]]);
  W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 660], [-1200, 660]], 1, 30) + arches.map((a) => c.hole(a, 0.5, 6)).join(''), mix(C.stone, C.sand, 0.35));
  let blocks = '';
  for (let y = -200; y < 640; y += 52) for (let x = -1200 + (Math.round(y / 52) % 2 ? 70 : 0); x < 2800; x += 140) blocks += c.cut(c.rect(x + c.rr(0, 6), y, c.rr(110, 128), 44), 0.6, 10);
  W.x(blocks, shade(C.stone, -0.05), 'opacity=".35"');
  let fr = '';
  for (let x = -600; x < 2400; x += 44) fr += c.cut(c.star(x, 100, 9, 4, 4, 0), 0.2, 3);
  W.p(c.cut([[-1200, 84], [2800, 84], [2800, 116], [-1200, 116]], 0.4, 20), C.tealRobe).p(fr, C.sun);
  // a hanging drape behind the throne
  W.p(c.cut([[700, 118], [900, 118], [910, 560], [690, 560]], 0.6, 10), C.plumRobe);
  W.x(c.ribbon([[740, 120], [736, 556]], 6) + c.ribbon([[800, 120], [800, 556]], 6) + c.ribbon([[860, 120], [864, 556]], 6), shade(C.plumRobe, -0.15), 'opacity=".5"');
  W.p(c.cut([[690, 118], [910, 118], [910, 140], [690, 140]], 0.3, 8), C.sun);
  wall.add(W.out());
  const col = (x, h = 560, w = 50) => {
    const s = sheet();
    s.p(c.cut(c.rect(x - w / 2, 660 - h, w, h), 0.5, 10), C.stone);
    s.x(c.ribbon([[x - w * 0.2, 660 - h + 20], [x - w * 0.2, 644]], 3) + c.ribbon([[x + w * 0.15, 660 - h + 20], [x + w * 0.15, 644]], 3), shade(C.stone, -0.12), 'opacity=".6"');
    s.p(c.cut(c.rect(x - w / 2 - 10, 660 - h - 14, w + 20, 16), 0.4, 6) + c.cut(c.rect(x - w / 2 - 8, 646, w + 16, 16), 0.4, 6), shade(C.stone, -0.08));
    return s.out();
  };
  wall.add(col(300) + col(580) + col(1020) + col(1300));
  const floor = S.layer({ par: P, sh: 3 });
  const F = sheet();
  const Y = KH.FLOOR;
  F.p(c.cut([[-1200, 650], [2800, 650], [2800, 1700], [-1200, 1700]], 0.6, 30), mix(C.stone, C.sand, 0.4));
  let chk = '';
  for (let y = 668; y < 1100; y += 44) for (let x = -600 + (Math.round(y / 44) % 2) * 50; x < 2200; x += 100) chk += c.poly([[x, y], [x + 50, y], [x + 50, y + 22], [x, y + 22]]);
  F.x(chk, mix(C.tealRobe, C.stone, 0.6), 'opacity=".3"');
  // the dais: two steps up to the throne
  F.p(c.cut([[650, KH.DAIS], [950, KH.DAIS], [972, KH.DAIS + 30], [628, KH.DAIS + 30]], 0.5, 8), shade(C.stone2, -0.04));
  F.p(c.cut([[610, KH.DAIS + 30], [990, KH.DAIS + 30], [1002, Y - 16], [598, Y - 16]], 0.5, 8), C.stone2);
  F.p(c.cut([[586, Y - 16], [1014, Y - 16], [1024, Y - 4], [576, Y - 4]], 0.4, 8), C.plumRobe);
  floor.add(F.out());
  floor.add(`<g transform="translate(${KH.TX + 4} ${KH.DAIS}) scale(1.1)">${throne6(c)}</g>`);
  const LAMPS = [630, 970];
  const flames = LAMPS.map((x) => {
    floor.add(`<g transform="translate(${x} ${KH.DAIS})">${sheet().p(c.cut([[-16, 0], [-6, -10], [-4, -110], [4, -110], [6, -10], [16, 0]], 0.3, 5), C.sun).out()}</g>`);
    return floor.add(`<g transform="translate(${x} ${KH.DAIS - 138})"><circle r="56" fill="url(#warm-glow)"/><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/></g>`);
  });
  return {
    c, floor, wall, flames,
    update(T) { flames.forEach((f, i) => { const k = 1 + Math.sin(T * 9 + i * 2) * 0.08; pose(f, { x: LAMPS[i], y: KH.DAIS - 138, sx: 1 / k, sy: k }); }); },
  };
}

/* ================================================================== money and debts */
/** a gold talent: a heavy flat ingot; origin bottom centre */
function ingot(c, x, y, w = 34) {
  return c.cut([[x - w / 2, y], [x - w / 2 + 5, y - w * 0.32], [x + w / 2 - 5, y - w * 0.32], [x + w / 2, y]], 0.2, 4);
}
/**
 * Ten thousand talents: a mountain of gold ingots, coin heaps and sacks (one cut-out; grow it with sy from the
 * bottom). origin: bottom centre, ~ w wide and h tall.
 */
export function talentHeap(c, { w = 420, h = 300 } = {}) {
  const s = sheet();
  const outline = [[-w / 2, 0], ...c.arc(0, 0, w / 2, h, PI, 2 * PI, 22).map(([x, y]) => [x + c.rr(-6, 6), y + c.rr(-6, 6)]), [w / 2, 0]];
  s.p(c.cut(outline, 1.2, 8), C.sunDeep);
  let ing = '', ing2 = '';
  for (let row = 0; row < 11; row++) {
    const y = -row * (h / 11) - 6, half = (w / 2) * Math.sqrt(Math.max(0, 1 - Math.pow((row * (h / 11) + 12) / h, 2))) - 16;
    for (let x = -half; x < half - 10; x += 38) {
      const d = ingot(c, x + c.rr(-4, 4) + 18, y, 32);
      if ((row + Math.round(x / 38)) % 2) ing += d; else ing2 += d;
    }
  }
  s.p(ing2, C.sun).p(ing, mix(C.sun, C.ochre, 0.4));
  let coins = '';
  for (let i = 0; i < 26; i++) { const a = c.rr(PI * 1.05, PI * 1.95), r = c.rr(0.3, 0.98); coins += c.cut(c.circ(Math.cos(a) * w / 2 * r, Math.sin(a) * h * r, c.rr(6, 9), 10), 0.2, 3); }
  s.p(coins, mix(C.sun, C.star, 0.35));
  let glint = '';
  for (let i = 0; i < 12; i++) { const a = c.rr(PI * 1.1, PI * 1.9), r = c.rr(0.2, 0.9); glint += c.poly(c.star(Math.cos(a) * w / 2 * r, Math.sin(a) * h * r, 7, 2, 4, 0)); }
  s.x(glint, C.star, 'opacity=".9"');
  return s.out();
}
/** a hundred denarii: a small heap of silver coins; origin bottom centre */
export function denarHeap(c, w = 50) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], ...c.arc(0, 0, w / 2, w * 0.36, PI, 2 * PI, 12), [w / 2, 0]], 0.4, 4), mix(C.stone2, C.rock, 0.3));
  let d = '';
  for (let i = 0; i < 14; i++) { const a = c.rr(PI * 1.08, PI * 1.92), r = c.rr(0.2, 0.9); d += c.cut(c.circ(Math.cos(a) * w / 2 * r, Math.sin(a) * w * 0.36 * r, 4.4, 8), 0.1, 2); }
  s.p(d, '#e9ebe6');
  return s.out();
}
/** one silver denarius; origin centre */
export function silverCoin(c, r = 7) {
  return sheet().p(c.cut(c.circ(0, 0, r, 12), 0.2, 3), '#e3e5e0').p(c.cut(c.circ(0, 0, r * 0.6, 10), 0.1, 2), '#c9ccc6').out();
}
/**
 * A long bill of debt unrolled from a rod: lines of writing and the sum at the bottom (drawn in both torn halves).
 * origin: top centre (hang it). returns markup of the whole bill (w × h).
 */
export function debtBill(c, sum, { w = 150, h = 210, size = 22 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 8, w, h), 0.5, 8), C.parchment);
  let ln = '';
  for (let i = 0; i < 8; i++) ln += c.ribbon([[-w / 2 + 16, 30 + i * 16], [w / 2 - 16 - c.rr(0, 30), 30 + i * 16]], 1.6);
  s.x(ln, C.ink, 'opacity=".45"');
  s.x(c.ribbon([[-w / 2 + 14, h - 38], [w / 2 - 14, h - 38]], 1.8), C.terracotta, 'opacity=".8"');
  s.p(c.cut(c.rect(-w / 2 - 10, 0, w + 20, 12), 0.3, 6) + c.cut(c.rect(-w / 2 - 8, h + 4, w + 16, 12), 0.3, 6), C.wood2);
  const txt = `<text x="0" y="${h - 12}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.terracotta}">${sum}</text>`;
  return s.out() + txt;
}
/** a rope around a group (possessions tied up for sale); origin centre, w wide */
export function saleTag(c, text, { size = 18 } = {}) {
  const ww = text.length * size * 0.5 + size * 1.6, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2 + 12, 0], [ww / 2, 0], [ww / 2, hh], [-ww / 2 + 12, hh], [-ww / 2, hh / 2]], 0.4, 5), C.cream);
  s.x(c.poly(c.circ(-ww / 2 + 12, hh / 2, 3, 8)), C.wood2);
  return `${s.out()}<text x="${6}" y="${(hh / 2 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.terracotta}">${text}</text>`;
}
/** household goods to be sold: a chest, jars, a rolled rug, a loom frame; origin bottom centre (~180 wide) */
export function goods(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-90, -50, 70, 50), 0.4, 6), C.wood);
  s.p(c.cut(c.rect(-94, -58, 78, 12), 0.3, 6), C.wood2);
  s.x(c.ribbon([[-90, -30], [-20, -30]], 3), C.ochre, 'opacity=".8"');
  s.p(c.cut([[-8, 0], [-14, -30], [-6, -50], [8, -50], [16, -30], [10, 0]], 0.3, 5) + c.cut([[22, 0], [18, -22], [26, -38], [38, -38], [44, -22], [40, 0]], 0.3, 5), C.pot);
  s.p(c.cut(c.ell(70, -12, 26, 12, 16), 0.4, 5), C.terracotta);
  s.x(c.ribbon([[48, -12], [92, -12]], 2), C.cream, 'opacity=".6"');
  return s.out();
}

/* ================================================================== small props */
/** a paper tally board: n short strokes in groups of five (the rest hidden); origin top-left. strokes: .tk[data-i] */
export function tallyMarks(c, n, { step = 12, h = 30, gap = 14, col = C.ink, w = 3.4 } = {}) {
  let out = '', x = 0;
  for (let i = 0; i < n; i++) {
    const g = i % 5;
    if (g === 4) {
      const x0 = x - 4 * step - 4;
      out += `<path class="tk" data-i="${i}" d="${c.ribbon([[x0, h * 0.8], [x - step + 6, h * 0.2]], w)}" fill="${col}" opacity="0"/>`;
      x += gap;
    } else {
      out += `<path class="tk" data-i="${i}" d="${c.ribbon([[x + c.rr(-1, 1), 0], [x + c.rr(-1, 1), h]], w)}" fill="${col}" opacity="0"/>`;
      x += step;
    }
  }
  return out;
}
/** a little clay lamp with a flame and glow (the flame .fl can be posed); origin: its foot */
export function smallLamp(c) {
  const s = sheet().p(c.cut([[-16, 0], [-19, -6], [-10, -11], [8, -11], [16, -8], [22, -11], [24, -8], [16, -1], [8, 1], [-10, 1]], 0.3, 4), C.pot);
  return `<circle cx="22" cy="-24" r="70" fill="url(#warm-glow)" opacity=".8"/>${s.out()}<g class="fl" transform="translate(22 -11)"><path d="M0 0C-5 -4 -4 -11 0 -20C4 -11 5 -4 0 0Z" fill="${C.lampFlame}"/></g>`;
}
/** a hand-cut numeral / words on a hanging card with its own string; origin: the string's end (top) */
export function hungWords(c, text, { size = 30, w, fill = C.cream, ink = C.ink } = {}) {
  const ww = w || text.length * size * 0.52 + size * 1.2, hh = size * 1.6;
  const s = sheet().p(c.cut([[-ww / 2, 0], [ww / 2, -2], [ww / 2 + 2, hh], [-ww / 2 - 1, hh + 1]], 0.5, 8), fill);
  return `${s.out()}<text x="0" y="${(hh / 2 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a soft floor of clouds (heaven's stage), a strip w wide; origin: its top centre */
export function cloudFloor(c, w = 2600, col = C.cream, under = '#eadcc0') {
  const s = sheet();
  const pts = [[-w / 2, 40]];
  for (let x = -w / 2; x <= w / 2; x += 70) pts.push(...c.arc(x + 35, 10, 42, 26 + c.rr(-6, 8), PI, 2 * PI, 6));
  pts.push([w / 2, 40], [w / 2, 90], [-w / 2, 90]);
  s.p(c.cut([[-w / 2, 40], [w / 2, 40], [w / 2, 96], [-w / 2, 96]], 0.8, 20), under);
  s.p(c.cut(pts, 0.8, 8), col);
  return s.out();
}
/** tr for a number written in either language */
export const num = (pl, en) => tr(pl, en);
export { lerp };

/* ================================================================== the king and his servants as puppets */
/** a puppet with face bits: p.mood({ angry, sad, tear }) */
export function moody(S, L, o, extra = '') {
  const c = S.c;
  const el = L.add(withFace3(person(c, o), faceBits3(c) + extra));
  const p = S.puppet(el);
  const parts = { angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]') };
  p.mood = ({ angry = 0, sad = 0, tear = 0 } = {}) => { fade_(parts.angry, angry); fade_(parts.sad, sad); fade_(parts.tear, tear); };
  return p;
}
/** the king seated and standing (crowned, with face bits) */
export function kingPuppets(S, L) {
  const cr = crown6(S.c);
  return { sit: moody(S, L, { ...KING, pose: 'sit' }, cr), stand: moody(S, L, KING, cr) };
}

/* ================================================================== the street between the palace and the prison */
export const PS = { FY: 704, GATE: 470, GW: 116, GH: 190, BAL: 452, PX: 1090, PW: 220, PH: 200 };
/**
 * Outside the king's house: sky, hills with a far town, the palace front on the left (an arched gateway with a
 * balcony over it), the prison on the right (its door leaf `door`, hinge on the left; the dark window at `win`),
 * and the paved street. Returns { door, doorX, win, update(T) }.
 */
export function palaceStreet(S, { skyCols = DAY, P = 0.45 } = {}) {
  const c = S.c;
  sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 130, len: 800 });
  const cl = hanging(hangL, cloud(c, 170), { x: 820, y: 150, len: 700 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [16, 7, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup);
  const hl = S.layer({ par: 0.18, sh: 3 });
  const hw = hillsWith(c, { y: 520, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
  hl.add(hw.markup + town(c, { x: 820, y: hw.fn(820) + 10, n: 6, spread: 260, sc: 0.5 }));
  const G = S.layer({ par: P, sh: 3 });
  const gs = sheet().p(c.ridge(c.wave(PS.FY - 30, [3, 1.5], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.3));
  let stones = '';
  for (let k = 0; k < 70; k++) { const px = c.rr(-700, 2300), py = c.rr(PS.FY - 10, 1000); stones += c.cut(c.blob(px, py, c.rr(8, 18), c.rr(4, 8), 8, 0.2), 0.4, 4); }
  gs.x(stones, C.sand2, 'opacity=".7"');
  G.add(gs.out());
  // the palace front with its gate and balcony
  const pal = sheet();
  const { GATE: gx, GW: gw, GH: gh, BAL: by } = PS, fy = PS.FY - 20;
  const hole = [[gx - gw / 2, fy + 4], [gx - gw / 2, fy - gh + gw / 2], ...c.arc(gx, fy - gh + gw / 2, gw / 2, gw / 2, PI, 2 * PI, 12), [gx + gw / 2, fy + 4]];
  pal.p(c.cut([[-900, 250], [640, 250], [640, fy + 6], [-900, fy + 6]], 0.8, 14) + c.hole(hole, 0.4, 6), mix(C.stone, C.sand, 0.35));
  let bl = '';
  for (let y = 270; y < fy - 10; y += 46) for (let x = -880 + (Math.round(y / 46) % 2 ? 60 : 0); x < 630; x += 120) bl += c.cut(c.rect(x, y, 108, 40), 0.5, 8);
  pal.x(bl, shade(C.stone, -0.06), 'opacity=".4"');
  pal.p(c.cut([[-900, 236], [652, 236], [652, 256], [-900, 256]], 0.4, 12), C.tealRobe);
  let fr = '';
  for (let x = -860; x < 640; x += 40) fr += c.cut(c.star(x, 246, 7, 3, 4, 0), 0.2, 3);
  pal.p(fr, C.sun);
  pal.p(c.ribbon([...c.arc(gx, fy - gh + gw / 2, gw / 2 + 8, gw / 2 + 8, PI, 2 * PI, 12)], 12), C.ochre);
  pal.p(c.cut(c.rect(gx - gw / 2 - 20, fy - gh + gw / 2, 16, gh - gw / 2 + 6), 0.3, 6) + c.cut(c.rect(gx + gw / 2 + 4, fy - gh + gw / 2, 16, gh - gw / 2 + 6), 0.3, 6), shade(C.stone, -0.1));
  // the balcony: a door behind, a ledge and a balustrade (the king stands behind it)
  pal.p(c.cut([[gx - 50, by], [gx - 50, by - 110], ...c.arc(gx, by - 110, 50, 40, PI, 2 * PI, 10), [gx + 50, by]], 0.4, 6), mix(C.soilDark, C.plumRobe, 0.3));
  // pilasters and a little window either side
  pal.p(c.cut(c.rect(330, 256, 24, fy - 250), 0.4, 8) + c.cut(c.rect(598, 256, 24, fy - 250), 0.4, 8) + c.cut(c.rect(90, 256, 24, fy - 250), 0.4, 8), shade(C.stone, 0.08));
  pal.p(c.cut(c.rect(318, 256, 48, 14), 0.3, 6) + c.cut(c.rect(586, 256, 48, 14), 0.3, 6) + c.cut(c.rect(78, 256, 48, 14), 0.3, 6), shade(C.stone, -0.1));
  const winA = (x, y) => [[x - 20, y + 40], [x - 20, y], ...c.arc(x, y, 20, 18, PI, 2 * PI, 8), [x + 20, y + 40]];
  pal.p(c.cut(winA(220, 330), 0.3, 5) + c.cut(winA(220, 480), 0.3, 5), mix(C.soilDark, C.plumRobe, 0.3));
  G.add(pal.out());
  const pots = sheet();
  [gx - gw / 2 - 44, gx + gw / 2 + 44].forEach((x) => {
    pots.p(c.cut([[x - 18, fy], [x - 22, fy - 34], [x + 22, fy - 34], [x + 18, fy]], 0.3, 5), C.pot);
    pots.p(c.cut(c.blob(x, fy - 56, 30, 26, 10, 0.2), 0.8, 5), C.moss);
    pots.p(c.cut(c.blob(x - 10, fy - 66, 16, 12, 9, 0.2), 0.6, 4), C.leaf);
  });
  G.add(pots.out());
  const bal = sheet();
  bal.p(c.cut([[gx - 110, by], [gx + 110, by], [gx + 116, by + 14], [gx - 116, by + 14]], 0.4, 8), C.stone2);
  let posts = '';
  for (let x = gx - 100; x <= gx + 100; x += 20) posts += c.cut(c.rect(x - 4, by - 44, 8, 44), 0.2, 4);
  bal.p(posts + c.cut(c.rect(gx - 108, by - 52, 216, 10), 0.3, 6), C.stone);
  bal.p(c.cut([[gx - 70, by + 14], [gx + 70, by + 14], [gx + 50, by + 60], [gx, by + 80], [gx - 50, by + 60]], 0.5, 6), C.plumRobe);
  // the prison
  const { PX: px, PW: pw, PH: ph } = PS;
  G.add(`<g transform="translate(${px} ${PS.FY - 18})">${prisonHouse5(c, pw, ph)}</g>`);
  const doorX = px - pw * 0.36;
  const door = G.add(`<g transform="translate(${doorX} ${PS.FY - 18})">${doorLeaf5(c, pw * 0.28, ph * 0.5 + 6)}</g>`);
  return {
    c, G, door, doorX, balFront: bal.out(),
    win: [px + pw * 0.26, PS.FY - 18 - ph * 0.59],
    update(T) {
      pose(sunEl, { x: 1250, y: 130, r: Math.sin(T * 0.6) });
      pose(cl, { x: 820 + Math.sin(T * 0.1) * 20, y: 150, r: Math.sin(T * 0.6 + 1) * 1.3 });
    },
  };
}
/** bars over the prison window (to lay over a face behind it); origin: the window's centre */
export function windowBars(c, w = 62, h = 52) {
  let b = '';
  for (let i = 0; i < 4; i++) b += c.cut(c.rect(-w / 2 + 4 + i * (w - 8) / 3 - 2, -h / 2, 4, h), 0.1, 4);
  return `<path d="${b}" fill="#4c4452"/>`;
}
/** a puppet seen only through a window: clipped to the world rect [x0, y0, x1, y1]; returns a puppet with .mood */
export function behindWindow(S, L, o, [x0, y0, x1, y1], name = 'win') {
  const c = S.c;
  const id = S.id(name);
  S.defs(`<clipPath id="${id}" clipPathUnits="userSpaceOnUse"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>`);
  const el = L.add(`<g clip-path="url(#${id})">${withFace3(person(c, o), faceBits3(c))}</g>`);
  const p = S.puppet(el.firstElementChild);
  const parts = { angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]') };
  p.mood = ({ angry = 0, sad = 0, tear = 0 } = {}) => { fade_(parts.angry, angry); fade_(parts.sad, sad); fade_(parts.tear, tear); };
  return p;
}
