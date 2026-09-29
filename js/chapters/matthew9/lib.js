// Matthew 9 — the cast and cut-outs of this chapter: the lake crossed back to Capernaum, the courtyard where the
// paralysed man is laid before Jesus, Matthew's tax booth, the supper in Matthew's courtyard under the vine, the
// wedding, the patch and the wineskins, the ruler's house, the two blind men, the mute man, the roads of Galilee,
// the scattered flock and the great harvest.
// Parallel drawings are reused from Mark 2 (the paralytic, Levi, the supper, fasting, patch and wine) and Mark 5
// (Jairus, the woman, the mourners), plus a few pieces from Mark 1/6/8/10, John 1/6 and Matthew 4/8.
// Everything returns SVG markup cut with the seeded scissors + sheet(); origins are noted per piece.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, waterBand, town, house, sun, moon, stars, cloud, rock, grass, olive, cypress, bush, palm, flowers } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { pallet, blanket as matBlanket, addToHead, scribe as scribeM, bowl as bowlM, loaf as loafM, cup as cupM, grapes as grapesM, fishDish as fishDishM, lowTable as lowTableM } from '../mark2/lib.js';
import { mob } from '../matthew8/lib.js';
import { bedFrame as bedFrameM, lyingPerson as lyingPersonM, blanket as bedBlanketM } from '../mark5/lib.js';
import { makeCutter } from '../../core/paper.js';

export { kf, moving, hand, headAt, addToHead, addToBody, townsfolk, scribe, johnsDisciple, johnsOpts, speech, thought, GLYPH, spark, heart, scrap, dust, pallet, rolledMat, coin, coinStack, ledger, coinScale, taxBooth, lowTable, bowl, loaf, cup, grapes, fishDish, lantern, garland, canopy, wreath, tambourine, cloak, CLOAK_HOLE, patch, needle, wineskin, skinHalf, jug, splash, WINE, wordSlip, physicianKit, candle, scrollOpen } from '../mark2/lib.js';
export { LOOK as L5, bubble, tag, glyphTag, note, flute, bedFrame, blanket as bedBlanket, lyingPerson, sorrowCloud, thinkBubble, streetSet, sickGirlIcon, spirit, onBody, onFace, mouthO, purse, jar, cry, card } from '../mark5/lib.js';
export { sheep, tassels, jesusWithFringe, oilFlask } from '../mark6/lib.js';
export { balance, shadowPerson } from '../mark8/lib.js';
export { mob, along, hangAt, thoughtCloud, painMarks } from '../matthew8/lib.js';
export { pose3, folk4, bakeArms, tiltHead, lightShaft } from '../matthew4/lib.js';
import { pose3 } from '../matthew4/lib.js';
export { POSSESSED, voiceRings, crutch, sparkle, hang2 } from '../mark1/lib.js';
export { LOOK as L10, beggarBowl } from '../mark10/lib.js';
export { rayBurst, glowDisc, radiance, hungWord, goldWord, GOLD_LIGHT } from '../john1/lib.js';
export { hull } from '../john6/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== skies */
export const DAY = ['#c6ddd8', '#eeebd4', '#f7ead0'];
export const MORNING = ['#cfe2dd', '#f1e9cf', '#f8e9cc'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const EVENING = ['#a69abf', '#eab99c', '#f5d6b0'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const GREY = ['#8f95a8', '#c3c1bd', '#dcd3c4'];
export const KINGDOM = ['#f2cd86', '#f8dca6', '#fbeac6'];

/* ================================================================== the cast */
export const PARALYTIC = { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3 };
export const HEALED = { ...PARALYTIC, mantle: C.sageRobe, belt: C.leather };
export const FRIENDS = [
  { robe: C.tealRobe, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  { robe: C.clayMantle, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin4 },
  { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin },
  { robe: C.roseRobe, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3, belt: C.leather },
];
/** tax collectors (bright mantles, a purse at the belt) and sinners (plain, worn) at Matthew's table */
export const TAXMEN = [
  { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin2, belt: C.ochre },
  { robe: mix(C.indigo, C.plumRobe, 0.5), mantle: C.ochre, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.sun },
  { robe: C.tealRobe, mantle: C.terracotta, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.ochre },
];
export const SINNERS = [
  { robe: C.roseRobe, mantle: C.mauve, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair3, skin: C.skin2 },
  { robe: mix(C.stone2, C.rock2, 0.4), hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin4, belt: C.rope },
  { robe: C.dustyBlue, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope },
  { robe: C.wheatRobe, mantle: C.clayMantle, hairStyle: 'veil', veil: C.ochreRobe, hair: C.hair2, skin: C.skin3 },
];
export const RULER = { robe: C.stone, mantle: shade(C.dustyBlue, -0.22), hairStyle: 'wrap', veil: C.linen, hair: C.hair3, beard: 'full', skin: C.skin2, belt: C.ochre };
export const BLIND = [
  { robe: mix(C.stone2, C.rock2, 0.5), mantle: mix(C.tealRobe, C.rock2, 0.45), belt: C.rope, skin: C.skin3, hair: C.hair3, hairStyle: 'wrap', veil: C.stone2, veil2: shade(C.stone2, -0.12), beard: 'full' },
  { robe: mix(C.wheatRobe, C.rock2, 0.45), mantle: null, belt: C.rope, skin: C.skin2, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair },
];
export const MUTE = { robe: C.stone2, mantle: null, hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin2, belt: C.leather };
export const DIS4 = ['peter', 'andrew', 'james', 'john'];

/* ================================================================== small pieces */
/** the paralysed man lying on his bed, blanket over his legs; origin: middle of the bed's top (as Mark 2) */
export function matWithMan(c, { w = 190, eyes = 'open' } = {}) {
  const s = 0.72;
  const man = person(c, { ...PARALYTIC, eyes });
  return `${pallet(c, w)}<g transform="translate(${w / 2 - 34} ${-40 * s}) rotate(-90) scale(${s})">${man}</g>${matBlanket(c)}`;
}
/** a bed on four short legs for the paralytic (a pallet raised off the ground); origin: floor centre, top at -30 */
export function bedLegs(c, w = 190) {
  return sheet().p(c.cut(c.rect(-w / 2 + 8, -24, 9, 24), 0.3, 5) + c.cut(c.rect(w / 2 - 17, -24, 9, 24), 0.3, 5), C.wood2).out();
}
/** a word on a slip of paper hung on a thread; origin at the slip's centre */
export function slip(c, text, { size = 22, fill = C.cream, ink = C.ink, w, italic = true } = {}) {
  const ww = w || text.length * size * 0.48 + size * 1.4, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}"${italic ? ' font-style="italic"' : ''} fill="${ink}">${text}</text>`;
}
/** a dark knot of thought (a little storm with a jagged edge); origin centre */
export function darkKnot(c, r = 22) {
  const pts = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2, k = i % 2 ? 0.72 : 1.05; pts.push([Math.cos(a) * r * k, Math.sin(a) * r * k * 0.85]); }
  return sheet().p(c.cut(pts, 1, 4), mix(C.storm2, C.night2, 0.3)).x(c.ribbon(c.cbez([-r * 0.5, 0], [-r * 0.1, -r * 0.5], [r * 0.2, r * 0.5], [r * 0.5, -r * 0.1], 10), 2), C.storm, 'opacity=".8"').out();
}
/** a warm heart-shaped light at the chest (compassion); origin centre */
export function heartGlow(c, r = 16) {
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * PI * 2;
    pts.push([16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16]);
  }
  return `<circle r="${r * 4}" fill="url(#warm-glow)"/>` + sheet().p(c.cut(pts, 0.3, 4), mix(C.jesusMantle, C.terracotta, 0.2)).x(c.poly(c.ell(-r * 0.4, -r * 0.35, r * 0.22, r * 0.14, 8, -0.6)), C.blushVeil).out();
}
/** a cloth seal tied over the mouth (the mute man); face coords, add with onFace */
export function gag(c) {
  return sheet().p(c.cut([[-6, 2], [20, 1], [22, 13], [-5, 14]], 0.5, 4), mix(C.storm2, C.soilDark, 0.4)).p(c.cut([[-20, 4], [-6, 3], [-6, 11], [-18, 12]], 0.5, 4), mix(C.storm2, C.soilDark, 0.25)).out();
}
/** a dark cloth band over closed eyes (blindness); face coords */
export function eyeShade(c) {
  return sheet().x(c.ribbon([[-4, -3], [22, -3]], 7), mix(C.stone2, C.storm, 0.4), 'opacity=".55"').out();
}
/** a blind man's walking stick held in the front hand; origin at the hand */
export function stick(c, len = 150) {
  return sheet().p(c.ribbon([[0, -14], [26, len - 6]], 4), C.wood3).out();
}
/** the golden book: an open codex with gilt edges ("the Gospel according to Matthew"); origin centre */
export function goldBook(c, { w = 150, h = 100, title = '', sub = '' } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 8, -h / 2 + 4], [0, -h / 2 + 12], [w / 2 + 8, -h / 2 + 4], [w / 2 + 8, h / 2 + 8], [0, h / 2 + 14], [-w / 2 - 8, h / 2 + 8]], 0.5, 8), C.terracotta);
  s.p(c.cut([[-w / 2, -h / 2], [-2, -h / 2 + 8], [-2, h / 2 + 8], [-w / 2, h / 2]], 0.4, 8), C.parchment);
  s.p(c.cut([[w / 2, -h / 2], [2, -h / 2 + 8], [2, h / 2 + 8], [w / 2, h / 2]], 0.4, 8), shade(C.parchment, 0.12));
  let lines = '';
  for (let i = 0; i < 6; i++) {
    const y = -h / 2 + 18 + i * (h - 26) / 6;
    lines += c.ribbon([[-w / 2 + 12, y + 1], [-12, y + 7]], 1.3) + c.ribbon([[12, y + 7], [w / 2 - 12, y + 1]], 1.3);
  }
  s.x(lines, C.ink, 'opacity=".35"');
  s.x(c.ribbon([[-w / 2 + 12, -h / 2 + 12], [-12, -h / 2 + 18]], 3) + c.ribbon([[12, -h / 2 + 18], [w / 2 - 12, -h / 2 + 12]], 3), C.haloRim);
  s.p(c.ribbon([[0, h / 2 + 10], [4, h / 2 + 40], [-2, h / 2 + 44]], 5), C.curtain2);
  const t = title ? `<text x="${-w / 4}" y="${-h / 2 + 50}" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${shade(C.sunRay, -0.15)}" transform="rotate(4 ${-w / 4} ${-h / 2 + 50})">${title}</text>` : '';
  const u = sub ? `<text x="${w / 4}" y="${-h / 2 + 50}" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${shade(C.sunRay, -0.15)}" transform="rotate(-4 ${w / 4} ${-h / 2 + 50})">${sub}</text>` : '';
  return `<circle r="${w}" fill="url(#warm-glow)" opacity=".75"/>${s.out()}${t}${u}`;
}
/** a winged-man emblem (Matthew's sign) cut in gold paper; origin centre */
export function wingedMan(c, r = 26) {
  const s = sheet();
  const wing = (d) => c.cut([[0, -2], [d * r * 0.4, -r * 0.9], [d * r * 1.1, -r * 1.05], [d * r * 0.9, -r * 0.55], [d * r * 1.05, -r * 0.35], [d * r * 0.7, -r * 0.05], [d * r * 0.8, r * 0.2], [d * r * 0.3, r * 0.2]], 0.3, 4);
  s.p(wing(-1) + wing(1), C.halo);
  s.p(c.cut([[-r * 0.3, r * 0.9], [-r * 0.22, -r * 0.1], [r * 0.22, -r * 0.1], [r * 0.3, r * 0.9]], 0.3, 4), C.cream);
  s.p(c.cut(c.circ(0, -r * 0.34, r * 0.2, 12), 0.2, 3), C.skin);
  s.p(c.cut(c.circ(0, -r * 0.34, r * 0.33, 14), 0.2, 3), C.haloRim, 'opacity=".9"');
  return s.out();
}

/* ================================================================== Capernaum: the courtyard */
/**
 * A courtyard in Capernaum: sky, sun and clouds on strings, the far shore across the lake, the town's roofs,
 * a white courtyard wall with the house door on the right, the outside stair, a fig tree, a stone bench on
 * the left for the scribes, and the beaten-earth yard. Layers: sky, hangs, far, town, wall (par WP), yard.
 */
export const WP = 0.45;
export const CT = { FEET: 716, BENCH: 540, GATE: 1250, DOOR: 1120, WALLTOP: 468, WALLBASE: 662 };
export function courtSet(S, { skyCols = DAY, sunAt = [1260, 140], evening = false, sky2 = null } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2' }) : null;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[520, 150, 190], [960, 118, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 392, amps: [14, 6, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup + waterBand(c, { y: 420, color: mix(C.lake, C.skyBlue, 0.25), foamN: 14, bottom: 900 }).markup);
  // the roofs of the town beyond the wall
  const townL = S.layer({ par: 0.2, sh: 3 });
  const hw = hillsWith(c, { y: 470, amps: [8, 4, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 20 });
  let hs = '';
  [[-500, 120, 70], [-340, 100, 90], [-180, 140, 64], [0, 110, 84], [170, 130, 70], [340, 100, 92], [520, 150, 66], [720, 110, 80], [900, 140, 70], [1100, 120, 88], [1300, 150, 64], [1500, 110, 86], [1680, 130, 70], [1860, 120, 80]].forEach(([x, w, h], i) => {
    hs += house(c, x, 500 + (i % 3) * 6, w * 0.8, h * 0.7, { wall: i % 3 === 1 ? C.plaster2 : C.plaster, shadow: shade(C.plaster2, -0.06), stairs: i % 2 === 0, lit: evening && i % 3 === 0 });
  });
  townL.add(hw.markup + hs + palm(c, 260, 512, 150) + palm(c, 1560, 514, 140) + cypress(c, 1180, 512, 90));
  // the courtyard wall, the house on the right, the stair and the fig tree
  const wallL = S.layer({ par: WP, sh: 4 });
  const { WALLTOP: WT, WALLBASE: WB, DOOR, GATE } = CT;
  const w = sheet();
  w.p(c.cut([[-900, WT + 20], [990, WT + 20], [990, WB], [-900, WB]], 0.8, 12), C.plaster);
  // coping stones along the top of the wall
  let cop = '';
  for (let x = -900; x < 990; x += 34) cop += c.cut(c.rect(x, WT + 12, 32, 10), 0.3, 5);
  w.p(cop, C.stone2);
  let spots = '';
  for (let i = 0; i < 14; i++) spots += c.cut(c.blob(c.rr(-600, 960), c.rr(WT + 50, WB - 30), c.rr(10, 26), c.rr(5, 11), 8, 0.2), 0.5, 4);
  w.x(spots, C.plaster2, 'opacity=".6"');
  // the house: a taller block with the door and a window
  w.p(c.cut([[990, WT - 110], [1500, WT - 110], [1500, WB], [990, WB]], 0.6, 10), mix(C.plaster, C.sand, 0.18));
  w.p(c.cut([[980, WT - 118], [1510, WT - 118], [1510, WT - 106], [980, WT - 106]], 0.4, 10), C.roof);
  let beams = '';
  for (let x = 1004; x < 1500; x += 44) beams += c.cut(c.circ(x, WT - 98, 5, 10), 0.3, 3);
  w.p(beams, C.wood2);
  w.p(c.cut([[DOOR - 34, WB], [DOOR - 34, WB - 110], ...c.arc(DOOR, WB - 110, 34, 30, PI, 2 * PI, 10), [DOOR + 34, WB]], 0.4, 6), C.soilDark);
  w.p(c.ribbon([[DOOR - 40, WB], [DOOR - 40, WB - 108]], 7) + c.ribbon([[DOOR + 40, WB], [DOOR + 40, WB - 108]], 7) + c.ribbon(c.arc(DOOR, WB - 110, 40, 36, PI, 2 * PI, 12), 7), C.wood2);
  w.p(c.cut([[1300, WT - 30], [1300, WT - 66], ...c.arc(1324, WT - 66, 24, 20, PI, 2 * PI, 8), [1348, WT - 30]], 0.3, 5), C.soilDark);
  w.p(c.ribbon([[1296, WT - 28], [1352, WT - 28]], 5), C.wood2);
  // the outside stair to the roof, along the house wall
  let st = '';
  for (let i = 0; i < 9; i++) st += c.cut(c.rect(1380 + i * 13, WB - (i + 1) * 20, 120 - i * 13, 20), 0.3, 5);
  w.p(st, C.stone2);
  // a niche with a water jar by the door
  w.p(c.cut([[1206, WB], [1210, WB - 40], [1222, WB - 58], [1236, WB - 40], [1240, WB]], 0.4, 5), C.pot);
  wallL.add(w.out());
  // the fig tree over the wall on the left
  const fig = sheet();
  fig.p(c.ribbon(c.cbez([300, WB + 2], [290, WB - 80], [330, WB - 150], [300, WT - 110], 10), (u) => 22 - u * 12), C.wood2);
  fig.p(c.ribbon(c.qbez([304, WT - 40], [240, WT - 90], [210, WT - 120], 8), 7) + c.ribbon(c.qbez([310, WT - 70], [380, WT - 110], [420, WT - 140], 8), 7), C.wood2);
  let lv = '', lv2 = '';
  for (let i = 0; i < 26; i++) {
    const x = c.rr(170, 450), y = c.rr(WT - 210, WT - 60), r = c.rr(16, 26);
    const leaf = [];
    for (let k = 0; k < 10; k++) { const a = (k / 10) * PI * 2, kk = k % 2 ? 0.78 : 1; leaf.push([x + Math.cos(a) * r * kk, y + Math.sin(a) * r * kk * 0.9]); }
    if (i % 2) lv += c.cut(leaf, 0.5, 4); else lv2 += c.cut(leaf, 0.5, 4);
  }
  fig.p(lv2, C.moss).p(lv, C.leaf);
  wallL.add(fig.out());
  // the stone bench for the scribes
  const bench = sheet();
  bench.p(c.cut(c.rect(CT.BENCH - 140, CT.FEET - 64, 280, 14), 0.4, 8), C.stone);
  bench.p(c.cut(c.rect(CT.BENCH - 128, CT.FEET - 50, 24, 50), 0.3, 6) + c.cut(c.rect(CT.BENCH + 104, CT.FEET - 50, 24, 50), 0.3, 6), C.stone2);
  // the yard
  const yard = S.layer({ par: WP, sh: 3 });
  const gfn = c.wave(WB + 2, [2, 1], [700, 180]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 0.8), mix(C.sand, C.stone, 0.35));
  let flags = '';
  for (let i = 0; i < 70; i++) { const x = c.rr(-700, 2300), y = c.rr(WB + 26, WB + 320); flags += c.cut(c.blob(x, y, c.rr(18, 34), c.rr(5, 9), 8, 0.2), 0.4, 4); }
  g.x(flags, shade(C.stone2, -0.04), 'opacity=".6"');
  yard.add(g.out());
  yard.add(grass(c, { x0: -700, x1: 420, y: WB + 2, fn: gfn, n: 16, h: 12, color: C.olive }) + bush(c, 880, WB + 6, 70, C.sage, C.moss));
  const benchL = S.layer({ par: WP, sh: 4 });
  benchL.add(bench.out());
  return {
    c, sk, sk2, hangL, sunEl, far, townL, wallL, yard, benchL, gfn,
    update(time, { sunY = sunAt[1] } = {}) {
      swing(sunEl, sunAt[0], sunY, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}

/* ================================================================== Matthew's courtyard: the supper under the vine */
/**
 * Matthew's courtyard at the end of the day: a pergola with a vine and hanging lanterns, the house wall with a
 * lit doorway, a low courtyard wall with the gate on the left (where the Pharisees stand), and the yard.
 * The long low table is added by the scene in front of the seated guests. Returns handles.
 */
export const FP = 0.5;
export const FT = { FLOOR: 704, SEAT: 700, GATE: 440, TX: 845, TW: 660 };
export function feastSet(S, { skyCols = EVENING, sunAt = [1240, 230], sky2 = null, outside = null, night = false } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2' }) : null;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  if (night) hangL.add(stars(c, { x0: -600, x1: 2200, y0: -300, y1: 400, n: 80 }));
  const sunEl = hanging(hangL, night ? `<circle r="110" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 36)}` : sun(c, 42, { disc: C.sunDeep, inner: C.sun }), { x: sunAt[0], y: sunAt[1], len: 800 });
  const far = S.layer({ par: 0.1, sh: 2 });
  far.add(band(c, { y: 440, amps: [14, 6, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup + town(c, { x: 150, y: 470, n: 7, spread: 380, sc: 0.5, lit: true }) + town(c, { x: 1600, y: 470, n: 6, spread: 360, sc: 0.5, lit: true }));
  // the street outside the gate
  const street = S.layer({ par: FP, sh: 3 });
  street.add(house(c, -300, 690, 170, 150, { stairs: true, lit: true }) + house(c, 20, 700, 140, 120, { stairs: false }) + palm(c, 200, 704, 190));
  // the house wall behind the table
  const houseL = S.layer({ par: FP, sh: 3 });
  const h = sheet();
  h.p(c.cut([[500, 380], [2400, 380], [2400, 704], [500, 704]], 0.6, 12), mix(C.plaster, C.dawn, 0.2));
  h.p(c.cut([[490, 370], [2400, 370], [2400, 384], [490, 384]], 0.4, 10), C.roof);
  let sp = '';
  for (let i = 0; i < 12; i++) sp += c.cut(c.blob(c.rr(540, 1500), c.rr(420, 620), c.rr(12, 28), c.rr(5, 11), 8, 0.2), 0.5, 4);
  h.x(sp, C.plaster2, 'opacity=".55"');
  h.p(c.cut([[1290, 704], [1290, 570], ...c.arc(1330, 570, 40, 36, PI, 2 * PI, 10), [1370, 704]], 0.4, 6), mix(C.lampGlow, C.apricot, 0.3));
  h.p(c.ribbon([[1284, 704], [1284, 568]], 7) + c.ribbon([[1376, 704], [1376, 568]], 7) + c.ribbon(c.arc(1330, 570, 46, 42, PI, 2 * PI, 12), 7), C.wood2);
  h.p(c.cut(c.rect(640, 450, 44, 52), 0.3, 5) + c.cut(c.rect(1030, 450, 44, 52), 0.3, 5), mix(C.lampGlow, C.apricot, 0.45));
  h.p(c.ribbon([[634, 504], [690, 504]], 5) + c.ribbon([[1024, 504], [1080, 504]], 5), C.wood2);
  houseL.add(h.out());
  const out = outside ? outside(S) : null;
  // the low courtyard wall on the left, with the gate
  const wallL = S.layer({ par: FP, sh: 4 });
  const w = sheet();
  w.p(c.cut([[-900, 560], [FT.GATE - 60, 560], [FT.GATE - 60, 706], [-900, 706]], 0.6, 10), C.plaster2);
  w.p(c.cut([[-900, 552], [FT.GATE - 54, 552], [FT.GATE - 54, 564], [-900, 564]], 0.4, 8), C.stone2);
  w.p(c.cut(c.rect(FT.GATE - 72, 520, 24, 186), 0.3, 6) + c.cut(c.rect(FT.GATE + 44, 520, 24, 186), 0.3, 6), C.stone2);
  w.p(c.cut(c.rect(FT.GATE - 76, 510, 32, 12), 0.3, 5) + c.cut(c.rect(FT.GATE + 40, 510, 32, 12), 0.3, 5), C.stone);
  wallL.add(w.out());
  // the pergola with the vine
  const pergL = S.layer({ par: FP, sh: 5 });
  const p = sheet();
  [520, 1000, 1480].forEach((x) => { p.p(c.cut(c.rect(x - 8, 330, 16, 374), 0.3, 8), C.wood2); });
  p.p(c.cut([[480, 322], [1560, 322], [1560, 336], [480, 336]], 0.4, 10), C.wood);
  let vine = '', lv = '', gr = '';
  for (let i = 0; i < 48; i++) {
    const x = c.rr(490, 1550), y = c.rr(308, 350);
    const leaf = [];
    for (let k = 0; k < 10; k++) { const a = (k / 10) * PI * 2, kk = k % 2 ? 0.7 : 1, r = c.rr(12, 18); leaf.push([x + Math.cos(a) * r * kk, y + Math.sin(a) * r * kk * 0.85]); }
    if (i % 2) lv += c.cut(leaf, 0.4, 4); else vine += c.cut(leaf, 0.4, 4);
  }
  for (let i = 0; i < 6; i++) { const x = 600 + i * 170 + c.rr(-30, 30); for (let k = 0; k < 7; k++) gr += c.cut(c.circ(x + (k % 3 - 1) * 7, 356 + Math.floor(k / 3) * 9, 5, 8), 0.2, 3); }
  p.p(vine, C.moss).p(lv, C.leaf).p(gr, C.plumRobe);
  pergL.add(p.out());
  const yard = S.layer({ par: FP, sh: 3 });
  const gfn = c.wave(704, [2, 1], [700, 180]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 0.8), mix(C.sand, C.dune, 0.3));
  let flags = '';
  for (let i = 0; i < 60; i++) { const x = c.rr(-700, 2300), y = c.rr(730, 1000); flags += c.cut(c.blob(x, y, c.rr(18, 34), c.rr(5, 9), 8, 0.2), 0.4, 4); }
  g.x(flags, shade(C.sand2, -0.04), 'opacity=".6"');
  yard.add(g.out());
  return {
    c, sk, sk2, hangL, sunEl, far, houseL, wallL, pergL, yard, gfn, out,
    update(time, { sunY = sunAt[1] } = {}) { swing(sunEl, sunAt[0], sunY, time, 1, 0.6); },
  };
}
/** the places at Matthew's table, left to right: [x, who] ('guest' seats are filled in Mt 9,10) */
export const SEATS = [
  [557, 'andrew'], [629, 'T0'], [701, 'S0'], [773, 'matthew'], [845, 'jesus'], [917, 'peter'], [989, 'john'], [1061, 'T1'], [1133, 'S1'],
];
export const lookOf = (who) => (CAST[who] ? CAST[who] : who[0] === 'T' ? TAXMEN[+who[1]] : SINNERS[+who[1]]);
/** the long table with the supper on it (origin: floor centre) */
export function supperTable(c, w = FT.TW) {
  let food = '';
  for (let i = 0; i < 9; i++) {
    const x = -w / 2 + 50 + (i * (w - 100)) / 8;
    const k = i % 4;
    food += `<g transform="translate(${x.toFixed(1)} -44)">${k === 0 ? bowlM(c, { food: 'fruit' }) : k === 1 ? loafM(c, 16) : k === 2 ? cupM(c) : bowlM(c, { food: 'stew' })}</g>`;
  }
  food += `<g transform="translate(-20 -44)">${fishDishM(c)}</g><g transform="translate(120 -44)">${grapesM(c)}</g>`;
  return food + lowTableM(c, w);
}
/* ================================================================== a road through Galilee */
/** rolling green hills with villages; returns { fn } for the road band */
export function galileeHills(S, { skyCols = MORNING, sunAt = [1200, 150] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[420, 150, 170], [980, 110, 150], [1500, 170, 190]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 380, amps: [22, 9, 3], lens: [1100, 400, 130], color: mix(C.hillFar, C.duskViolet, 0.15), x0: -1400, x1: 3200 }).markup);
  const midL = S.layer({ par: 0.18, sh: 3 });
  const mh = hillsWith(c, { y: 440, amps: [20, 8, 3], lens: [900, 320, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3200 });
  midL.add(mh.markup);
  return { c, sk, hangL, sunEl, cls, far, midL, mfn: mh.fn, update(time) { swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6); cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i)); } };
}

/** a small synagogue front (columns, pediment, a star of David); origin: ground centre */
export function synagogueFront(c, sc = 1) {
  const s = sheet();
  const W = 150 * sc, H = 100 * sc;
  s.p(c.cut(c.rect(-W / 2, -H, W, H), 0.5, 8), C.cream);
  s.p(c.cut([[-W / 2 - 12, -H + 2], [0, -H - 44 * sc], [W / 2 + 12, -H + 2]], 0.5, 8), C.plaster2);
  [-0.36, -0.12, 0.12, 0.36].forEach((k) => s.p(c.cut(c.rect(k * W - 5 * sc, -H + 6, 10 * sc, H - 8), 0.3, 6), C.stone));
  s.p(c.cut([[-12 * sc, 0], [-12 * sc, -34 * sc], ...c.arc(0, -34 * sc, 12 * sc, 12 * sc, PI, 2 * PI, 8), [12 * sc, 0]], 0.3, 5), C.soilDark);
  s.p(c.cut(c.star(0, -H - 18 * sc, 8 * sc, 4 * sc, 6, 0), 0.2, 3), C.sun);
  s.p(c.cut(c.rect(-W / 2 - 8, -8, W + 16, 10), 0.3, 6), C.stone2);
  return s.out();
}
/** a village: a few flat-roofed houses (origin: ground centre) */
export function village(c, { n = 5, w = 260, sc = 0.7, lit = false } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (w * i) / n + c.rr(-10, 10), ww = c.rr(46, 70) * sc, hh = c.rr(34, 52) * sc;
    out += house(c, x, -c.rr(0, 16) * sc - (i % 2) * 8 * sc, ww, hh, { stairs: c.chance(0.5), lit: lit && c.chance(0.5) });
  }
  return out;
}
/** a band of ripe wheat as one still sheet, ears catching the sun; origin world coords */
export function wheatBand(c, { x0 = -900, x1 = 2500, fn, h = 60, n = 300, color = C.wheat2, ear = C.wheat } = {}) {
  let st = '', ea = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), y = fn(x) + c.rr(0, 16), hh = h * c.rr(0.7, 1.2), lean = c.rr(-8, 8);
    st += c.ribbon([[x, y], [x + lean * 0.5, y - hh * 0.5], [x + lean, y - hh]], 2.2);
    ea += c.cut(c.ell(x + lean, y - hh - 7, 3.6, 9, 8, lean * 0.02), 0.3, 3);
  }
  return sheet().p(st, color).p(ea, ear).out();
}
/** a reaper with a sickle (a small figure for the far field); returns person options */
export const REAPER = { robe: C.linen2, mantle: null, hair: C.hair, hairStyle: 'wrap', veil: C.wheatRobe, beard: 'short', skin: C.skin3, belt: C.rope };
/** a sickle to hold in the front hand; origin at the hand */
export function sickleHeld(c) {
  return sheet().p(c.ribbon([[0, -6], [0, 18]], 4), C.wood2).p(c.ribbon(c.arc(12, 18, 14, 16, PI, PI * 2.05, 10), 3.4), C.stone2).out();
}

/**
 * The people in the courtyard (Mt 9,2–8): four scribes seated on the bench, the four disciples by the house
 * door, the crowd as still sprites behind (a calm one and an amazed one, cross-faded), and Jesus.
 * Returns { scribes, dis, crowd: [{calm, awe, x, y}], jesus, set(t, T, o) } — the scene poses the rest.
 */
export function courtCast(S, set, { crowdLayer, castLayer, awe = true } = {}) {
  const c = S.c;
  const cL = crowdLayer || S.layer({ par: WP, sh: 4 });
  const crowd = [[520, -56, 5, 'a'], [1420, -44, 5, 'c']].map(([x, dy, n, k], i) => {
    const calmM = mob(makeCutter('mt9-court-' + k), n, { s: 0.8, spread: 42, rows: 2, flip: x > 800, arms: 14 });
    const aweM = mob(makeCutter('mt9-court-' + k), n, { s: 0.8, spread: 42, rows: 2, flip: x > 800, arms: 0 }).replace(/<g class="armFr"[^>]*>/g, '<g class="armFr" transform="rotate(-150)">').replace(/<g class="armBr"[^>]*>/g, '<g class="armBr" transform="rotate(-130)">');
    return { i, x, y: CT.FEET + dy, calm: cL.sprite(calmM, x, CT.FEET + dy), awe: awe ? cL.sprite(aweM, x, CT.FEET + dy) : null };
  });
  const L = castLayer || S.layer({ par: WP, sh: 5 });
  const dis = DIS4.map((k, i) => ({ k, i, x: 1150 + i * 50, y: CT.FEET - 20 + (i % 2) * 6, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...CAST[k] }))) }));
  const scribes = [0, 1, 2, 3].map((i) => ({ i, x: CT.BENCH - 110 + i * 64, y: CT.FEET - 52, seed: c.rr(0, 9), p: S.puppet(L.add(scribeM(c, i, { pose: 'sit' }))) }));
  const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
  return { L, cL, crowd, dis, scribes, jesus };
}

/* ================================================================== the ruler's house: the girl's room */
export const RM = { FLOOR: 716, DOOR: 400, BED: 1120, WIN: 1000, BS: 1.1 };
/**
 * Inside the ruler's house: a warm plastered room with ceiling beams, the open door on the left (daylight
 * outside), a window with light, a lamp niche, and the girl's bed on the right. The girl is added by the scene.
 * Layers: room (still), bed. Returns handles.
 */
export function roomSet(S, { bed = true, wall = mix(C.plaster, C.dune, 0.22) } = {}) {
  const c = S.c;
  const room = S.layer({ par: 0.5, sh: 2, rise: 0 });
  const r = sheet();
  r.p(c.cut([[-1400, -900], [3000, -900], [3000, 1800], [-1400, 1800]], 1, 40), wall);
  let sp = '';
  for (let i = 0; i < 26; i++) sp += c.cut(c.blob(c.rr(-400, 2000), c.rr(160, 640), c.rr(14, 34), c.rr(6, 12), 8, 0.2), 0.5, 4);
  r.x(sp, C.plaster2, 'opacity=".55"');
  // the doorway with the bright street beyond
  const D = RM.DOOR;
  r.p(c.cut([[D - 60, RM.FLOOR], [D - 60, 460], ...c.arc(D, 460, 60, 56, PI, 2 * PI, 12), [D + 60, RM.FLOOR]], 0.4, 6), mix(C.skyBlue, C.cream, 0.45));
  r.p(c.cut([[D - 60, RM.FLOOR], [D - 60, 620], [D + 60, 612], [D + 60, RM.FLOOR]], 0.4, 6), mix(C.sand, C.cream, 0.3));
  r.p(c.cut(c.rect(D - 40, 560, 40, 60), 0.3, 5), C.plaster);
  r.p(c.ribbon([[D - 68, RM.FLOOR], [D - 68, 458]], 10) + c.ribbon([[D + 68, RM.FLOOR], [D + 68, 458]], 10) + c.ribbon(c.arc(D, 460, 68, 64, PI, 2 * PI, 12), 10), C.wood2);
  // the window
  const W = RM.WIN;
  r.p(c.cut([[W - 50, 420], [W - 50, 330], ...c.arc(W, 330, 50, 46, PI, 2 * PI, 10), [W + 50, 420]], 0.4, 6), mix(C.skyBlue, C.cream, 0.3));
  r.p(c.ribbon([[W - 56, 424], [W + 56, 424]], 7) + c.ribbon([[W, 286], [W, 420]], 4), C.wood2);
  // lamp niche and a shelf
  r.p(c.cut([[700, 470], [700, 430], ...c.arc(722, 430, 22, 20, PI, 2 * PI, 8), [744, 470]], 0.3, 5), shade(C.plaster2, -0.2));
  r.p(c.cut([[708, 470], [712, 462], [728, 462], [734, 466], [730, 470]], 0.2, 3), C.pot);
  r.p(c.cut(c.rect(1250, 400, 170, 9), 0.3, 6), C.wood2);
  r.p(c.cut([[1270, 400], [1266, 378], [1278, 366], [1290, 378], [1286, 400]], 0.3, 4) + c.cut(c.arc(1340, 400, 16, 14, PI, 2 * PI, 8), 0.3, 4), C.pot);
  // the ceiling beams
  r.p(c.cut(c.rect(-900, 150, 3400, 22), 0.4, 10), C.wood2);
  let beams = '';
  for (let x = -860; x < 2500; x += 96) beams += c.cut(c.circ(x, 182, 8, 10), 0.3, 3);
  r.p(beams, C.wood);
  // the floor
  r.p(c.cut([[-1400, RM.FLOOR - 4], [3000, RM.FLOOR - 4], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.clay, C.sand2, 0.5));
  let mat = '';
  for (let x = 560; x < 1060; x += 22) mat += c.ribbon([[x, RM.FLOOR + 30], [x + 8, RM.FLOOR + 70]], 3);
  r.p(c.cut([[540, RM.FLOOR + 24], [1080, RM.FLOOR + 24], [1100, RM.FLOOR + 76], [520, RM.FLOOR + 76]], 0.5, 8), mix(C.terracotta, C.roseRobe, 0.5));
  r.x(mat, shade(C.terracotta, -0.15), 'opacity=".4"');
  room.add(r.out());
  const winLight = room.add(`<g opacity="0"><path d="${c.poly([[W - 44, 330], [W + 44, 330], [W - 40, RM.FLOOR + 60], [W - 260, RM.FLOOR + 60]])}" fill="#fff3cf" opacity=".45"/><circle cx="${W}" cy="360" r="140" fill="url(#warm-glow)"/></g>`);
  const bedL = S.layer({ par: 0.5, sh: 4 });
  if (bed) bedL.add(`<g transform="translate(${RM.BED} ${RM.FLOOR}) scale(${-RM.BS} ${RM.BS})">${bedFrameM(c)}</g>`);
  return { c, room, winLight, bedL };
}
/** the girl lying on the bed (for bedL, after roomSet): origin as the mattress top */
export function girlOnBed(c, o) {
  return `<g transform="translate(${RM.BED} ${RM.FLOOR - 54 * RM.BS}) scale(${-RM.BS} ${RM.BS})">${lyingPersonM(c, o, 0.62)}</g>`;
}
export function blanketOnBed(c) {
  return `<g transform="translate(${RM.BED} ${RM.FLOOR}) scale(${-RM.BS} ${RM.BS})">${bedBlanketM(c)}</g>`;
}

/** the mourners of the ruler's house as still groups: state 'wail' (hands up), 'laugh' (heads thrown back) or 'go' */
const MOURN = [
  { robe: mix(C.storm, C.stone2, 0.55), hairStyle: 'veil', veil: mix(C.storm2, C.stone2, 0.45), hair: C.hair3, skin: C.skin3 },
  { robe: mix(C.plumRobe, C.stone2, 0.5), hairStyle: 'veil', veil: mix(C.night, C.stone2, 0.6), hair: C.hair, skin: C.skin2 },
  { robe: mix(C.dustyBlue, C.storm, 0.35), hair: C.hair3, hairStyle: 'wrap', veil: C.stone2, beard: 'full', skin: C.skin4 },
  { robe: mix(C.stone2, C.dune, 0.4), hairStyle: 'veil', veil: mix(C.storm, C.stone, 0.5), hair: C.greyHair, skin: C.skin2 },
];
export function mourners(c, idx, state) {
  const P = { wail: [150, 160, -10], laugh: [40, 20, -24], go: [20, 10, 6] }[state];
  return pose3(c, idx.map((k, j) => ({ x: j * 58 - (idx.length - 1) * 29, y: (j % 2) * 10, s: 0.96, flip: state === 'go' || (state === 'laugh' && j % 2 === 1), armF: P[0] - j * 8, armB: P[1] - j * 6, head: P[2], o: MOURN[k % MOURN.length] })));
}
