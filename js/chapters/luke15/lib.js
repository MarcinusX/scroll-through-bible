// Luke 15 — the cast and cut-outs of this chapter. New here: a village courtyard under a fig tree where the tax
// collectors and sinners sit round Jesus and the Pharisees mutter over the wall; the wilderness ravines where the
// shepherd looks for his sheep by lantern light, and his village at night; the woman's one-room house with its
// lamp, broom and ten drachmas; the father's farmstead with its long road over the hills; the far country (the
// gaudy feast, the famine, the pig field). The parables are painted sets that fly in; the father is drawn warmly
// as a man (it is a parable), never as a picture of God.
// Parallel drawings are reused from Matthew 18 / John 10 (sheep, shepherd), Mark 5 (pigs), Mark 2 (feast things),
// Luke 2 (the choir of angels), Matthew 25 (a goat), John 4 (a calf), Mark 12 (ring, purse), Mark 6 (sandals).
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, town, house, sun, moon, stars, cloud, grass, olive, cypress, bush, flowers, rock, palm } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { es, ease, bump, seg, fade, attr, clamp } from '../../core/anim.js';
import { heart as heartM, scribe as scribeM, lowTable as lowTableM, loaf as loafM, bowl as bowlM, cup as cupM, lantern as lanternM } from '../mark2/lib.js';
import { withFace as withFaceM, faceBits as faceBitsM } from '../mark3/lib.js';
import { pose3 as pose3M } from '../matthew4/lib.js';
import { TAXMEN as TAXMEN9, SINNERS as SINNERS9 } from '../matthew9/lib.js';
import { cow as cowJ } from '../john4/lib.js';
import { camel as camelM } from '../mark1/lib.js';
import { roundel as roundelJ } from '../john3/lib.js';
import { purse as purseM } from '../mark12/lib.js';

export { kf, moving, speech, thought, heart, loaf, cup, bowl, lowTable, lantern, tambourine, addToHead, scribe, jug, garland, spark, coinStack } from '../mark2/lib.js';
export { withFace, faceBits, bubble, strip, question, handAt, along, shadowPerson, silhouette } from '../mark3/lib.js';
export { ewe, sheepRig, shoulderLamb, onShoulders, pastureSet, SHEPHERD, WOOLS, lanternHeld, clayLamp, flowerClump } from '../john10/lib.js';
export { pig, herd, flute } from '../mark5/lib.js';
export { goat } from '../matthew25/lib.js';
export { trough, ghost } from '../john4/lib.js';
export { choirAngel } from '../luke2/lib.js';
export { broom } from '../mark13/lib.js';
export { ring, purse, harp } from '../mark12/lib.js';
export { sandals, staff } from '../mark6/lib.js';
export { fatherLight } from '../john17/lib.js';
export { rayBurst, glowDisc, radiance, goldWord, hungWord } from '../john1/lib.js';
export { murmur } from '../john6/lib.js';
export { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { figure } from '../luke7/lib.js';
export { say } from '../mark10/lib.js';
export { sparkle, voiceRings, flame, camel, walkCamel } from '../mark1/lib.js';
export { roundel, hangAt } from '../john3/lib.js';
export { hungWords, tallyMarks } from '../matthew18/lib.js';
export { crossX } from '../mark6/lib.js';
export { tr, es, ease, bump, seg, fade, attr, clamp };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const AFTER = ['#cadfd9', '#f1e6c8', '#f8e9cc'];
export const EVE = ['#a293b6', '#e9b398', '#f5d4ab'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const DUSK = ['#6d6a9c', '#d69e90', '#f0c29d'];
export const NIGHT = ['#141a3d', '#27306a', '#4d578f'];
export const DAWN = ['#8f93b9', '#e6b9a6', '#f5d6b0'];
export const MORNING = ['#c8dfdb', '#efe8cf', '#f8ead0'];
export const DUST = ['#cfae86', '#e6c396', '#efd3a8'];
export const HEAVEN = ['#f1d49a', '#f8e2b4', '#fbeed2'];

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
/** the tax collectors and sinners (Matthew 9's looks) */
export const TAXMEN = TAXMEN9;
export const SINNERS = SINNERS9;
/** the tax collector who turns back (scene 1's first guest, again in the "joy in heaven" scenes) */
export const PENITENT = TAXMEN9[0];
/** the father of the two sons: an old man, white-bearded, in a deep plum mantle */
export const FATHER = { robe: C.linen2, mantle: mix(C.plumRobe, C.indigo, 0.18), hair: '#ece6da', hairStyle: 'wrap', veil: C.linen, veil2: C.ochre, beard: 'full', beardColor: '#ece6da', skin: C.skin2, belt: C.ochre };
/** the younger son at home; in the far country (gaudy, a wreath on his head); in rags; in the best robe */
export const YOUNGER = { robe: C.skyVeil, mantle: null, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.terracotta };
export const YOUNGER_RICH = { robe: C.roseRobe, mantle: C.sun, mantleArm: true, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.sun };
export const YOUNGER_RAGS = { robe: mix(C.stone2, C.rock3, 0.3), mantle: null, hair: C.hair2, hairStyle: 'wild', beard: 'short', skin: C.skin3, belt: C.rope, fur: true };
export const YOUNGER_ROBED = { robe: C.linen, mantle: mix(C.sun, C.ochre, 0.35), mantleArm: true, hair: C.hair2, hairStyle: 'wild', beard: 'short', skin: C.skin3, belt: C.sun };
/** the elder son, a worker of the fields */
export const ELDER = { robe: C.sageRobe, mantle: mix(C.clay, C.wood3, 0.5), hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather };
export const ELDER_W = { ...ELDER, mantle: null };
/** the father's servants */
export const SERVANTS = [
  { robe: C.wheatRobe, mantle: null, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.clay, beard: 'short', skin: C.skin4, belt: C.leather },
  { robe: C.tealRobe, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.rope },
  { robe: C.roseRobe, mantle: null, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.hair3, beard: 'none', skin: C.skin2, belt: C.ochre },
  { robe: C.ochreRobe, mantle: null, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.leather },
];
/** a servant boy (the one the elder son asks) */
export const BOY = { robe: C.dustyBlue, mantle: null, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.rope };
/** the woman with ten drachmas: the coins of her dowry on a band across her brow */
export const WOMAN = { robe: C.tealRobe, mantle: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair3, skin: C.skin2, beard: 'none', belt: C.ochre };
/** the rich citizen of the far country */
export const CITIZEN = { robe: mix(C.plumRobe, C.indigo, 0.35), mantle: C.sun, hair: C.hair3, hairStyle: 'bald', beard: 'full', skin: C.skin4, belt: C.sun };
/** the revellers of the far country */
export const REVELLERS = [
  { robe: C.plumRobe, mantle: C.sun, hairStyle: 'veil', veil: C.roseRobe, veil2: C.sun, hair: C.hair3, skin: C.skin2, beard: 'none', belt: C.sun },
  { robe: C.tealRobe, mantle: C.terracotta, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.sun },
  { robe: C.roseRobe, mantle: C.lavender, hairStyle: 'veil', veil: C.wheat, veil2: C.ochre, hair: C.hair2, skin: C.skin, beard: 'none', belt: C.plumRobe },
  { robe: C.ochreRobe, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.terracotta },
];

/* ================================================================== little helpers */
export const DY = { stand: 0, kneel: 46, sit: 62 };
/** where a puppet's head is (pose-aware) */
export const headP = (x, y, s, flip = false, p = 'stand') => [x + (flip ? -2 : 2) * s, y + (-167 + DY[p]) * s];
/** a puppet's front hand at arm angle a (degrees raised forward) */
export function handP(x, y, s, flip, a, p = 'stand') {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + DY[p] - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s];
}
/** show a piece that pops in (k 0..1) */
export function pop(el, k, x, y, { s = 1, r = 0 } = {}) { pose(el, { x, y, s: Math.max(0.001, k) * s, r, o: k > 0.01 ? 1 : 0 }); }
/** in during [a, a+d], out during [b-d, b] */
export const inOut = (t, a, b, d = 0.12) => es(t, a, a + d) * (1 - es(t, b - d, b));
/** a flown piece: k 0 → far up in the flies, 1 → at (x, y) on its string */
export function flyAt(el, k, x, y, time = 0, i = 0, amp = 1.2) {
  pose(el, { x, y: lerp(-1500, y, k), r: time ? Math.sin(time * 0.8 + i * 1.7) * amp * k : 0, oy: 0, o: k > 0.002 ? 1 : 0 });
}
/** a person with its arms / head baked in (a still cut-out) */
export function still(c, o, { armF = 0, armB = 0, head = 0 } = {}) {
  return pose3M(c, [{ x: 0, y: 0, s: 1, flip: false, armF, armB, head, o }]);
}
/** a soft light disc */
export const glow = (r = 120, o = 1, id = 'warm-glow') => `<circle r="${r}" fill="url(#${id})" opacity="${o}"/>`;
/** a Pharisee / scribe with angry brows ready (data-part="angry") */
export const pharisee = (c, i) => withFaceM(scribeM(c, i), faceBitsM(c));

/* ================================================================== small things */
/** a silver drachma (origin centre): a cut disc with a stamped head */
export function drachma(c, r = 9) {
  const ag = mix(C.stone, C.linen, 0.4);
  return sheet().p(c.cut(c.circ(0, 0, r, 16), 0.2, 3), ag)
    .x(c.ribbon(c.arc(0, 0, r * 0.72, r * 0.72, 0, PI * 2, 14), 1.1), shade(ag, -0.28), 'opacity=".7"')
    .x(c.cut(c.blob(r * 0.05, -r * 0.05, r * 0.3, r * 0.36, 8, 0.15), 0.2, 2), shade(ag, -0.22), 'opacity=".75"').out();
}
/** a coin-band across a woman's brow (head coords): n drachmas on a cord; data-i on each coin */
export function coinBand(c, n = 10) {
  let s = `<path d="${c.ribbon(c.arc(1, -1, 20, 18, PI * 1.02, PI * 1.98, 12), 2)}" fill="${C.ochre}"/>`;
  for (let i = 0; i < n; i++) {
    const a = PI * (1.06 + (i / (n - 1)) * 0.86), x = 1 + Math.cos(a) * 20, y = -1 + Math.sin(a) * 18 + 3;
    s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">${drachma(c, 3)}</g>`;
  }
  return s;
}
/** a clay oil lamp (origin: its base); .flame hidden until lit; glow drawn separately */
export function lamp(c, { lit = true } = {}) {
  const s = sheet();
  s.p(c.cut([[-22, 0], [-26, -7], [-15, -13], [9, -13], [20, -10], [29, -13], [32, -10], [22, -2], [12, 1], [-15, 1]], 0.4, 5), C.pot);
  s.p(c.cut(c.circ(-4, -12, 6, 10), 0.2, 3), shade(C.pot, -0.3));
  s.p(c.cut([[-25, -7], [-34, -12], [-34, -7], [-27, -3]], 0.2, 4), shade(C.pot, -0.1));
  const fl = `<g class="flame" transform="translate(30 -13)"${lit ? '' : ' opacity="0"'}><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2.6 -5 -2.6 -10 0 -15C2.6 -10 2.6 -5 0 -2Z" fill="#fff4d2"/></g>`;
  return s.out() + fl;
}
/** a flat carob pod (origin centre) */
export function pod(c, l = 30, rot = 0) {
  return c.cut(c.ell(0, 0, l / 2, l * 0.12, 12, rot), 0.3, 3);
}
/** a heap of carob pods (origin: bottom centre) */
export function podHeap(c, w = 80, n = 16) {
  let d = '';
  for (let i = 0; i < n; i++) { const x = c.rr(-w / 2, w / 2), y = -c.rr(2, 16) * (1 - Math.abs(x) / w); d += c.cut(c.tr(c.ell(0, 0, c.rr(12, 17), c.rr(2.6, 3.4), 10, c.rr(-0.6, 0.6)), x, y), 0.2, 3); }
  return sheet().p(d, mix(C.wood2, C.soil, 0.3)).out();
}
/** a music note (origin centre) */
export function note(c, col = C.terracotta, r = 1) {
  const s = sheet();
  s.p(c.cut(c.ell(-4 * r, 8 * r, 6 * r, 4.4 * r, 10, -0.4), 0.2, 2), col);
  s.p(c.ribbon([[1.4 * r, 7 * r], [1.4 * r, -16 * r]], 2.2 * r), col);
  s.p(c.ribbon([[1.4 * r, -16 * r], [10 * r, -11 * r], [11 * r, -5 * r]], 2.6 * r), col);
  return s.out();
}
/** a coin in the air, drawn from the side (gold) */
export function goldCoin(c, r = 8) {
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.2, 3), C.sun).x(c.ribbon(c.arc(0, 0, r * 0.62, r * 0.62, 0, PI * 2, 12), 1.1), shade(C.sun, -0.25), 'opacity=".7"').out();
}
/** a small heap of gold coins (origin: bottom centre) */
export function coinHeap(c, w = 70, h = 26) {
  let d = '', d2 = '';
  for (let i = 0; i < 26; i++) {
    const x = c.rr(-w / 2, w / 2) * 0.95, y = -c.rr(3, h) * (1 - Math.pow(Math.abs(x) / (w / 2), 2) * 0.85);
    const e = c.cut(c.ell(x, y, 7, 3.4, 10), 0.2, 2);
    if (i % 3) d += e; else d2 += e;
  }
  return sheet().p(d, C.sun).p(d2, shade(C.sun, -0.12)).out();
}
/** the best robe held up between two hands (origin: its collar) */
export function bestRobe(c) {
  const g = mix(C.sun, C.ochre, 0.35);
  const s = sheet();
  s.p(c.cut([[-18, 0], [18, 0], [34, 12], [44, 70], [50, 128], [-50, 128], [-44, 70], [-34, 12]], 0.6, 7), C.linen);
  s.p(c.cut([[-18, 0], [-6, 0], [-14, 60], [-24, 126], [-50, 128], [-44, 70], [-34, 12]], 0.5, 7), g);
  s.x(c.ribbon([[-46, 110], [46, 110]], 6) + c.ribbon([[-40, 20], [-26, 18]], 3), C.terracotta, 'opacity=".8"');
  let d = '';
  for (let x = -40; x < 44; x += 14) d += c.poly(c.star(x, 110, 3.6, 1.4, 4, 0));
  s.x(d, C.sun);
  return s.out();
}
/** a steaming platter (origin: bottom centre) */
export function platter(c, w = 110) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -6, w / 2, 9, 18), 0.3, 4), C.stone2);
  s.p(c.cut([...c.arc(0, -10, w * 0.36, 24, PI, 2 * PI, 12), [w * 0.36, -8], [-w * 0.36, -8]], 0.5, 5), mix(C.clay, C.wood2, 0.4));
  s.x(c.ribbon(c.arc(0, -12, w * 0.24, 14, PI * 1.1, PI * 1.9, 8), 2.4), shade(C.clay, 0.3), 'opacity=".7"');
  s.p(c.cut(c.blob(-w * 0.28, -12, 7, 5, 8, 0.2), 0.2, 2) + c.cut(c.blob(w * 0.3, -12, 7, 5, 8, 0.2), 0.2, 2), C.leaf);
  return s.out();
}
/** three wisps of steam (origin: their foot) */
export function steam(c, col = C.cream) {
  let d = '';
  [-14, 0, 14].forEach((x, i) => { d += c.ribbon(c.cbez([x, 0], [x - 8, -14], [x + 8, -26], [x - 2, -44 - i * 4], 12), (u) => 3.4 - u * 2.6); });
  return `<path d="${d}" fill="${col}" opacity=".75"/>`;
}
/** a fattened calf, pale and round, with a garland (the John 4 calf, plumper) */
export function calf(c, { garlandOn = true } = {}) {
  let m = cowJ(c, { col: mix(C.wood3, C.cream, 0.45) });
  if (garlandOn) {
    const g = sheet();
    let fl = '';
    for (let i = 0; i < 7; i++) { const a = PI * (0.1 + i * 0.13); fl += c.cut(c.star(34 + Math.cos(a) * 12, -48 + Math.sin(a) * 14, 5, 2.4, 5, i), 0.2, 2); }
    g.p(c.ribbon(c.arc(34, -48, 12, 14, PI * 0.08, PI * 0.92, 8), 3.4), C.leaf).p(fl, C.roseRobe);
    m = m.replace(/<\/g>$/, `${g.out()}</g>`);
  }
  return m;
}
/** a bundle tied on a stick over the shoulder (hold coords, arm back ~150) */
export function bundleStick(c) {
  return sheet().p(c.ribbon([[0, 0], [0, -70]], 3.4), C.wood2).p(c.cut(c.blob(0, -78, 17, 13, 10, 0.15), 0.5, 4), C.ochreRobe).x(c.ribbon([[-6, -68], [6, -69]], 2.4), C.rope).out();
}
/** tally strokes for years (origin: left middle); n strokes, every fifth across */
export function yearMarks(c, n, { step = 11, h = 26, col = C.ink } = {}) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5), k = i % 5, x = g * (step * 5 + 8) + k * step;
    if (k === 4) d += c.ribbon([[x - step * 4 - 3, h * 0.3], [x - 2, -h * 0.3]], 2.4);
    else d += c.ribbon([[x, -h / 2], [x + 1, h / 2]], 2.4);
  }
  return `<path d="${d}" fill="${col}"/>`;
}

/* ================================================================== the courtyard under the fig tree (Łk 15,1–3; 7; 10) */
export const CT = { GY: 706, JX: 800, WALL: 1044, BENCH: 668 };
/** where the guests sit round Him: x, flip, look */
export const GUEST_SEATS = [
  { x: 530, flip: false, o: SINNERS9[1] },
  { x: 606, flip: false, o: TAXMEN9[1] },
  { x: 682, flip: false, o: SINNERS9[0] },
  { x: 920, flip: true, o: PENITENT },
  { x: 996, flip: true, o: TAXMEN9[2] },
];
/**
 * A village courtyard in the afternoon: the sky and sun, far hills, the flat roofs of the village, the courtyard's
 * back wall with a doorway, a great fig tree over the bench where Jesus sits, a low table with bread in front of Him,
 * and on the right a low wall with the street beyond (where the Pharisees and scribes stand).
 * Returns { sk, hangL, back, tree, people, front, wallL, fx, update(T) }.
 */
export function courtSet(S, { skyCols = AFTER, sunAt = [1250, 150], lit = 0, table = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunG = hangL.add(`<g>${glow(200)}</g>`);
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cl = hanging(hangL, cloud(c, 170), { x: 470, y: 140, len: 800 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [22, 9, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.18), x0: -1400, x1: 3000 }).markup);
  const midL = S.layer({ par: 0.16, sh: 3 });
  midL.add(hillsWith(c, { y: 500, amps: [16, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sand2, 0.25), trees: 18, treeColor: mix(C.olive, C.moss, 0.3), treeH: 18, x0: -1400, x1: 3000 }).markup);
  midL.add(town(c, { x: 330, y: 540, n: 7, spread: 520, sc: 0.8 }) + town(c, { x: 1320, y: 540, n: 7, spread: 560, sc: 0.8 }));
  /* the courtyard: back wall with a doorway, floor */
  const back = S.layer({ par: 0.3, sh: 3 });
  const bw = sheet();
  bw.p(c.cut([[-1400, 548], [3000, 548], [3000, 700], [-1400, 700]], 0.6, 14), mix(C.plaster, C.sand, 0.2));
  bw.p(c.cut([[-1400, 540], [3000, 540], [3000, 552], [-1400, 552]], 0.4, 14), C.plaster2);
  let stones = '';
  for (let i = 0; i < 26; i++) stones += c.cut(c.blob(c.rr(-900, 2500), c.rr(570, 680), c.rr(16, 30), c.rr(7, 11), 9, 0.2), 0.4, 5);
  bw.x(stones, C.plaster2, 'opacity=".55"');
  // the doorway into the house on the left
  bw.p(c.cut([[300, 700], [300, 600], ...c.arc(340, 600, 40, 36, PI, 2 * PI, 10), [380, 700]], 0.4, 6), mix(C.wood2, C.soilDark, 0.35));
  back.add(bw.out());
  back.add(sheet().p(c.cut([[-1400, 690], [3000, 690], [3000, 1800], [-1400, 1800]], 0.6, 16), mix(C.sand, C.sand2, 0.4))
    .x(c.cut(c.ell(800, 760, 420, 40, 30), 0.8, 12), shade(C.sand, 0.12), 'opacity=".6"').out());
  /* the fig tree over the bench (trunk behind, leaves spread above) */
  const tree = S.layer({ par: 0.34, sh: 4 });
  const tr_ = sheet();
  tr_.p(c.cut([[626, 700], [640, 600], [616, 520], [584, 470], [600, 462], [640, 500], [660, 440], [680, 446], [676, 520], [712, 470], [728, 480], [690, 560], [678, 700]], 0.8, 6), C.wood2);
  let lv = '', lv2 = '';
  for (let i = 0; i < 16; i++) {
    const x = c.rr(470, 870), y = c.rr(330, 470) + Math.abs(x - 660) * 0.2;
    const l = c.cut(c.blob(x, y, c.rr(44, 66), c.rr(28, 40), 12, 0.2), 1, 6);
    if (i % 2) lv += l; else lv2 += l;
  }
  tr_.p(lv2, C.moss).p(lv, C.leaf);
  let figs = '';
  for (let i = 0; i < 9; i++) figs += c.cut(c.circ(c.rr(500, 840), c.rr(380, 470), 5, 8), 0.2, 2);
  tr_.p(figs, C.plumRobe);
  tree.add(tr_.out());
  const people = S.layer({ par: 0.4, sh: 5 });
  // the bench under the tree
  people.add(sheet().p(c.cut([[CT.JX - 54, CT.BENCH - 4], [CT.JX + 54, CT.BENCH - 4], [CT.JX + 50, CT.GY], [CT.JX - 50, CT.GY]], 0.6, 6), C.stone2).x(c.ribbon([[CT.JX - 50, CT.BENCH + 2], [CT.JX + 50, CT.BENCH + 2]], 2), shade(C.stone2, -0.2), 'opacity=".5"').out());
  /* the low wall on the right, the street beyond it */
  const street = S.layer({ par: 0.4, sh: 4 });
  const wallL = S.layer({ par: 0.42, sh: 5 });
  const w = sheet();
  w.p(c.cut([[CT.WALL, 632], [CT.WALL + 30, 626], [2900, 626], [2900, 720], [CT.WALL, 720]], 0.6, 10), mix(C.stone, C.plaster2, 0.4));
  let ws = '';
  for (let i = 0; i < 14; i++) ws += c.cut(c.blob(c.rr(CT.WALL + 20, 1900), c.rr(642, 700), c.rr(14, 24), c.rr(6, 10), 8, 0.2), 0.4, 4);
  w.x(ws, C.stone2, 'opacity=".6"');
  w.p(c.cut([[CT.WALL - 6, 620], [2900, 620], [2900, 634], [CT.WALL - 6, 636]], 0.4, 10), C.stone2);
  wallL.add(w.out());
  const front = S.layer({ par: 0.46, sh: 5 });
  let tableEl = null;
  if (table) {
    tableEl = front.add(`<g transform="translate(${CT.JX} ${CT.GY + 26})">${lowTableM(c, 300, 40)}<g transform="translate(-96 -40)">${bowlM(c, { food: 'fruit' })}</g><g transform="translate(-40 -42)">${loafM(c, 15)}</g><g transform="translate(40 -40)">${cupM(c)}</g><g transform="translate(96 -42)">${loafM(c, 13)}</g></g>`);
  }
  const fx = S.layer({ par: 0.48, sh: 6 });
  return {
    c, sk, hangL, back, tree, people, street, wallL, front, fx, tableEl,
    update(T, { glowO = 0.5 } = {}) {
      pose(sunEl, { x: sunAt[0], y: sunAt[1], r: Math.sin(T * 0.6) * 1 });
      pose(sunG, { x: sunAt[0], y: sunAt[1], o: glowO });
      pose(cl, { x: 470 + Math.sin(T * 0.1) * 20, y: 140, r: Math.sin(T * 0.6 + 1) * 1.2 });
    },
  };
}
/** the seated guests as still cut-outs (one per L.add) */
export function seatGuests(S, L, seats = GUEST_SEATS, { s = 0.94 } = {}) {
  const c = S.c;
  return seats.map((g, i) => ({ ...g, i, el: L.add(`<g>${pose3M(c, [{ x: 0, y: 0, s, flip: g.flip, armF: 24 + (i % 2) * 20, armB: 10, head: g.flip ? 4 : -4, o: { ...g.o, pose: 'sit' } }])}</g>`) }));
}

/* ================================================================== staging helpers */
/** hang a piece on a string, parked up in the flies until it is brought in by t */
export const hangOff = (L, markup, len = 900) => hanging(L, markup, { x: 0, y: -1500, len });
/** a second sky (a plain gradient sheet) placed right above `after`'s sheet, cross-faded with L.fade */
export function skyFade(S, [top, mid, bottom], after, name = 'sky2') {
  const id = S.id(name);
  S.defs(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${Math.min(0, S.view().y0).toFixed(0)}" x2="0" y2="760"><stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`);
  const L = S.layer({ par: 0, sky: true, rise: 0 });
  L.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${id})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
  after.el.parentNode.insertBefore(L.el, after.el.nextSibling);
  L.fade(0);
  return L;
}

/* ================================================================== a village street at night (Łk 15,6; 9) */
export const VS = { GY: 704 };
export const VS_HOUSES = [
  { x0: 236, w: 236, h: 252, door: 404, col: C.plaster },
  { x0: 500, w: 272, h: 290, door: 606, col: mix(C.plaster, C.sand, 0.3) },
  { x0: 858, w: 222, h: 240, door: 944, col: mix(C.plaster, C.clay, 0.12) },
  { x0: 1106, w: 250, h: 268, door: 1184, col: C.plaster },
];
const DOOR_W = 66, DOOR_H = 146;
const doorPts = (c, x) => [[x - DOOR_W / 2, VS.GY], [x - DOOR_W / 2, VS.GY - DOOR_H + 30], ...c.arc(x, VS.GY - DOOR_H + 30, DOOR_W / 2, 30, PI, 2 * PI, 8), [x + DOOR_W / 2, VS.GY]];
/**
 * A village street at night: sky, stars, the moon, dark hills, far roofs, and a row of houses with arched doors
 * and little windows. Each house has a lit doorway and a lit window (hidden) and a door glow in a layer behind the
 * people. Returns { sk, hangL, moonEl, houses: [{...spec, lit, win, glow}], glowL, people, fx, front, update(T) }.
 */
export function villageStreet(S, { skyCols = NIGHT, moonAt = [1180, 150], houses = VS_HOUSES, tint = 0.34 } = {}) {
  const c = S.c;
  const N = (col, k = tint) => mix(col, C.night, k);
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 0, flat: true });
  starL.add(stars(c, { x0: -800, x1: 2400, y0: -700, y1: 420, n: 120 }));
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const moonG = hangL.add(`<g>${glow(160, 0.35, 'halo-glow')}</g>`);
  const moonEl = hanging(hangL, moon(c, 38), { x: moonAt[0], y: moonAt[1], len: 900 });
  S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [20, 8, 3], lens: [1000, 340, 120], color: N(C.hillFar, 0.55), x0: -1400, x1: 3000 }).markup);
  const farL = S.layer({ par: 0.2, sh: 3 });
  farL.add(town(c, { x: 800, y: 520, n: 16, spread: 2200, sc: 1, wall: N(C.plaster, 0.5), shadow: N(C.plaster2, 0.55), lit: true }));
  const houseL = S.layer({ par: 0.36, sh: 4 });
  const hs = houses.map((h, i) => {
    const s = sheet();
    const top = VS.GY - h.h;
    s.p(c.cut([[h.x0, top], [h.x0 + h.w, top], [h.x0 + h.w, VS.GY + 6], [h.x0, VS.GY + 6]], 0.6, 10), N(h.col));
    s.p(c.cut([[h.x0 - 8, top - 16], [h.x0 + h.w + 8, top - 16], [h.x0 + h.w + 8, top + 4], [h.x0 - 8, top + 4]], 0.4, 10), N(C.plaster2));
    s.p(c.cut([[h.x0 + h.w, top], [h.x0 + h.w + 26, top + 10], [h.x0 + h.w + 26, VS.GY + 6], [h.x0 + h.w, VS.GY + 6]], 0.4, 8), N(C.plaster2, tint + 0.1));
    let pat = '';
    for (let k = 0; k < 5; k++) pat += c.cut(c.blob(c.rr(h.x0 + 20, h.x0 + h.w - 20), c.rr(top + 30, VS.GY - 40), c.rr(16, 30), c.rr(7, 12), 9, 0.2), 0.4, 5);
    s.x(pat, N(C.plaster2), 'opacity=".5"');
    s.p(c.cut(doorPts(c, h.door), 0.4, 6), N(C.wood2, 0.45));
    const wx = h.door + (h.door - h.x0 > h.w / 2 ? -110 : 96), wy = top + 70;
    s.p(c.cut(c.rect(wx - 18, wy - 16, 36, 32), 0.3, 5), N(C.soilDark, 0.2));
    houseL.add(s.out());
    return { ...h, i, wx, wy };
  });
  // the lit doorways and windows (hidden)
  const litL = S.layer({ par: 0.36, sh: 0, flat: true });
  hs.forEach((h) => {
    h.lit = litL.add(`<g opacity="0"><path d="${c.poly(doorPts(c, h.door))}" fill="${mix(C.lampGlow, C.lampFlame, 0.35)}"/><path d="${c.poly(c.rect(h.door - DOOR_W / 2 + 8, VS.GY - 40, DOOR_W - 16, 40))}" fill="${mix(C.lampFlame, C.sunDeep, 0.25)}" opacity=".35"/></g>`);
    h.win = litL.add(`<g opacity="0"><path d="${c.poly(c.rect(h.wx - 16, h.wy - 14, 32, 28))}" fill="${C.lampFlame}"/></g>`);
  });
  const glowL = S.layer({ par: 0.38, sh: 0, flat: true });
  hs.forEach((h) => { h.glow = glowL.add(`<g opacity="0" transform="translate(${h.door} ${VS.GY - 60})">${glow(170, 0.8)}</g>`); });
  const street = S.layer({ par: 0.38, sh: 3 });
  street.add(sheet().p(c.cut([[-1400, VS.GY - 8], [3000, VS.GY - 8], [3000, 1800], [-1400, 1800]], 0.6, 16), N(C.sand2, 0.4)).out());
  const people = S.layer({ par: 0.4, sh: 5 });
  const fx = S.layer({ par: 0.44, sh: 5 });
  return {
    c, sk, starL, hangL, moonEl, houses: hs, houseL, litL, glowL, street, people, fx,
    update(T, { moonO = 1 } = {}) {
      pose(moonEl, { x: moonAt[0], y: moonAt[1], r: Math.sin(T * 0.5) * 1, o: moonO });
      pose(moonG, { x: moonAt[0], y: moonAt[1], o: moonO });
    },
    /** light house i: 0..1 */
    light(i, k) { const h = hs[i]; fade(h.lit, k); fade(h.win, Math.min(1, k * 1.4)); fade(h.glow, k); },
  };
}
/** a person carrying a small lit lamp in the front hand (the lamp's glow is drawn separately, behind) */
export const lampHold = (c) => `<g transform="translate(-6 4) scale(.62)">${lamp(c)}</g>`;

/* ================================================================== the father's farmstead (Łk 15,11–32) */
export const FM = { GY: 708, P: 0.36, HX0: 300, HX1: 700, TOP: 424, DOOR: 580, DW: 80, DH: 166, GATE: 842, GW: 92 };
/** the road from the gate over the hills (near → far) */
export const ROAD = [[FM.GATE, 712], [960, 694], [1060, 662], [1122, 622], [1086, 584], [1116, 548], [1146, 516], [1120, 488]];
/** the scale of a figure standing at road height y */
export const roadS = (y) => lerp(0.3, 1.0, clamp((y - 480) / (712 - 480)));
/**
 * The farmstead: sky, hanging sun (or moon), far hills, the land rising on the right with fields, olive trees and
 * the road winding up and away, the two-storey house on the left with its door and windows, the stone gateway at
 * the head of the road. Night / dusk: tint mixes the land toward night; lit lights the door and windows.
 * Returns { sk, hangL, sunEl, land, house, gateL, people, front, fx, lights: { door, wins }, update(T) }.
 */
export function farmSet(S, { skyCols = MORNING, sunAt = [1250, 160], moonAt = null, starsN = 0, tint = 0, tintCol = C.night, lit = 0, lanterns = false, sunR = 44 } = {}) {
  const c = S.c;
  const N = (col, k = tint) => (k ? mix(col, tintCol, k) : col);
  const sk = sky(S, skyCols);
  let starL = null;
  if (starsN) { starL = S.layer({ par: 0.02, sh: 0, flat: true }); starL.add(stars(c, { x0: -800, x1: 2400, y0: -800, y1: 420, n: starsN })); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunG = hangL.add(`<g>${glow(210)}</g>`);
  const sunEl = moonAt ? null : hanging(hangL, sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 900 });
  const moonEl = moonAt ? hanging(hangL, moon(c, 38), { x: moonAt[0], y: moonAt[1], len: 900 }) : null;
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [24, 10, 3], lens: [1100, 380, 130], color: N(mix(C.hillFar, C.duskViolet, 0.2), tint * 1.1), x0: -1400, x1: 3000 }).markup);
  const midL = S.layer({ par: 0.16, sh: 3 });
  midL.add(hillsWith(c, { y: 462, amps: [18, 7, 2], lens: [900, 300, 110], color: N(mix(C.hillMid, C.sand2, 0.2)), trees: 22, treeColor: N(mix(C.olive, C.moss, 0.3)), treeH: 16, houses: 3, houseColor: N(C.plaster2), x0: -1400, x1: 3000 }).markup);
  /* the land: the courtyard flat on the left, the hill rising on the right with fields and the road */
  const land = S.layer({ par: FM.P, sh: 3 });
  const l = sheet();
  l.p(c.cut([[-1400, 690], [760, 690], [900, 672], [1040, 626], [1120, 580], [1200, 530], [1300, 494], [1420, 474], [1700, 468], [2200, 478], [3000, 500], [3000, 1800], [-1400, 1800]], 1, 12), N(mix(C.hillNear, C.sand2, 0.35)));
  // field strips on the hill
  let wheat = '', green = '';
  [[1180, 560, 1500, 520, 30], [1260, 520, 1600, 494, 22], [1340, 492, 1800, 480, 16], [1000, 650, 1300, 590, 34]].forEach(([x0, y0, x1, y1, h], i) => {
    const d = c.cut([[x0, y0], [x1, y1], [x1 + 20, y1 + h], [x0 + 20, y0 + h]], 0.8, 10);
    if (i % 2) green += d; else wheat += d;
  });
  l.p(wheat, N(mix(C.wheat, C.sand2, 0.35))).p(green, N(mix(C.wheatGreen, C.hillNear, 0.4)));
  // the courtyard's beaten earth
  l.x(c.cut(c.ell(560, 720, 420, 26, 30), 0.8, 12), N(shade(C.sand, 0.12)), 'opacity=".6"');
  // the road
  l.p(c.ribbon(ROAD.map(([x, y]) => [x, y + 2]), (u) => 44 - u * 38, 1.5), N(mix(C.sand, C.dune, 0.3)));
  land.add(l.out());
  land.add(`<g>${olive(c, 1300, 486, 0.5, { trunk: N(C.wood2), leaf: N(C.olive), leaf2: N(C.sage) })}${olive(c, 1010, 630, 0.8, { trunk: N(C.wood2), leaf: N(C.olive), leaf2: N(C.sage) })}${olive(c, 180, 700, 1.4, { trunk: N(C.wood2), leaf: N(C.olive), leaf2: N(C.sage) })}</g>`);
  land.add(grass(c, { x0: -1200, x1: 2800, y: 692, n: 40, h: 12, color: N(C.moss) }));
  /* the house */
  const house = S.layer({ par: FM.P, sh: 4 });
  const h = sheet();
  const { HX0, HX1, TOP, DOOR, DW, DH } = FM;
  const wallC = N(mix(C.plaster, C.peach, 0.14));
  // the roof room with its own little door, then the main block
  const RX0 = HX0 + 30, RX1 = HX0 + 214, RT = TOP - 104;
  h.p(c.cut([[RX0, RT], [RX1, RT], [RX1, TOP], [RX0, TOP]], 0.5, 8), N(mix(C.plaster, C.clay, 0.12)));
  h.p(c.cut([[RX0 - 8, RT - 16], [RX1 + 8, RT - 16], [RX1 + 8, RT + 2], [RX0 - 8, RT + 2]], 0.4, 8), N(C.plaster2));
  h.p(c.cut([[RX1 - 70, TOP], [RX1 - 70, RT + 44], ...c.arc(RX1 - 48, RT + 44, 22, 20, PI, 2 * PI, 8), [RX1 - 26, TOP]], 0.3, 5), N(mix(C.wood2, C.soilDark, 0.3)));
  h.p(c.cut([[HX0, TOP], [HX1, TOP], [HX1, FM.GY + 4], [HX0, FM.GY + 4]], 0.6, 10), wallC);
  h.p(c.cut([[HX1, TOP], [HX1 + 34, TOP + 12], [HX1 + 34, FM.GY + 4], [HX1, FM.GY + 4]], 0.5, 8), N(C.plaster2, tint + 0.08));
  // the parapet round the roof
  h.p(c.cut([[HX0 - 10, TOP - 22], [HX1 + 12, TOP - 22], [HX1 + 12, TOP + 4], [HX0 - 10, TOP + 4]], 0.4, 10), N(C.plaster2));
  let merl = '';
  for (let x = RX1 + 30; x < HX1; x += 34) merl += c.cut(c.rect(x, TOP - 34, 18, 14), 0.2, 3);
  h.p(merl, N(C.plaster2));
  let beams = '';
  for (let x = HX0 + 20; x < HX1; x += 46) beams += c.cut(c.rect(x, TOP + 8, 12, 10), 0.2, 3);
  h.p(beams, N(C.wood2));
  let pat = '';
  for (let k = 0; k < 8; k++) pat += c.cut(c.blob(c.rr(HX0 + 30, HX1 - 30), c.rr(TOP + 40, FM.GY - 40), c.rr(18, 34), c.rr(8, 13), 9, 0.2), 0.4, 5);
  h.x(pat, N(C.plaster2), 'opacity=".5"');
  // a stone base course
  h.p(c.cut([[HX0 - 4, FM.GY - 26], [HX1 + 36, FM.GY - 26], [HX1 + 36, FM.GY + 4], [HX0 - 4, FM.GY + 4]], 0.5, 8), N(mix(C.stone2, C.rock, 0.3)));
  const doorPath = [[DOOR - DW / 2, FM.GY], [DOOR - DW / 2, FM.GY - DH + DW / 2], ...c.arc(DOOR, FM.GY - DH + DW / 2, DW / 2, DW / 2, PI, 2 * PI, 10), [DOOR + DW / 2, FM.GY]];
  h.p(c.cut(doorPath, 0.4, 6), N(mix(C.wood2, C.soilDark, 0.3), tint * 0.6));
  h.p(c.cut([[DOOR - DW / 2 - 8, FM.GY - DH - 6], ...c.arc(DOOR, FM.GY - DH + DW / 2, DW / 2 + 10, DW / 2 + 10, PI, 2 * PI, 10), [DOOR + DW / 2 + 8, FM.GY - DH - 6]].concat(c.arc(DOOR, FM.GY - DH + DW / 2, DW / 2, DW / 2, 2 * PI, PI, 10)), 0.3, 5), N(C.stone2));
  const WINS = [[376, 500], [676 - 36, 500], [376, 614]];
  WINS.forEach(([x, y]) => {
    h.p(c.cut(c.rect(x - 22, y - 20, 44, 40), 0.3, 5), N(C.soilDark, tint * 0.4));
    h.p(c.cut(c.rect(x - 38, y - 22, 14, 44), 0.3, 4) + c.cut(c.rect(x + 24, y - 22, 14, 44), 0.3, 4), N(mix(C.tealRobe, C.teal2, 0.3)));
    h.p(c.cut(c.rect(x - 28, y + 20, 56, 7), 0.2, 4), N(C.stone2));
  });
  // a vine climbing the wall by the door, and an awning over it
  const vine = c.cbez([DOOR - 64, FM.GY], [DOOR - 50, FM.GY - 130], [DOOR - 110, FM.GY - 200], [DOOR - 190, FM.GY - 250], 16);
  h.p(c.ribbon(vine, (u) => 6 - u * 3.4), N(C.wood2));
  let lv = '';
  vine.forEach(([x, y], i) => { if (i % 2 && i > 2) lv += c.cut(c.blob(x + c.rr(-10, 10), y + c.rr(-8, 4), c.rr(9, 14), c.rr(7, 10), 8, 0.2), 0.4, 4); });
  h.p(lv, N(C.leaf));
  let grapes = '';
  [[DOOR - 84, FM.GY - 184], [DOOR - 150, FM.GY - 226]].forEach(([x, y]) => { for (let k = 0; k < 6; k++) grapes += c.cut(c.circ(x + (k % 3 - 1) * 5, y + Math.floor(k / 3) * 6 + (k % 3 === 1 ? 2 : 0), 3.4, 7), 0.1, 2); });
  h.x(grapes, N(C.plumRobe));
  // two big jars by the wall
  [[HX0 + 150, 1], [HX0 + 188, 0.8]].forEach(([x, k]) => h.p(c.cut([[x - 18 * k, FM.GY], [x - 24 * k, FM.GY - 34 * k], [x - 14 * k, FM.GY - 60 * k], [x - 9 * k, FM.GY - 70 * k], [x + 9 * k, FM.GY - 70 * k], [x + 14 * k, FM.GY - 60 * k], [x + 24 * k, FM.GY - 34 * k], [x + 18 * k, FM.GY]], 0.4, 5), N(C.pot)));
  house.add(h.out());
  const lightL = S.layer({ par: FM.P, sh: 0, flat: true });
  const doorLit = lightL.add(`<g opacity="${lit}"><path d="${c.poly(doorPath)}" fill="${mix(C.lampGlow, C.lampFlame, 0.3)}"/></g>`);
  const winLit = lightL.add(`<g opacity="${lit}">${WINS.map(([x, y]) => `<path d="${c.poly(c.rect(x - 17, y - 15, 34, 30))}" fill="${C.lampFlame}"/>`).join('')}</g>`);
  /* the gateway at the head of the road */
  const gateL = S.layer({ par: FM.P, sh: 5 });
  const g = sheet();
  const gx0 = FM.GATE - FM.GW / 2, gx1 = FM.GATE + FM.GW / 2;
  const post = (x) => c.cut([[x - 16, FM.GY + 4], [x - 15, FM.GY - 200], [x + 15, FM.GY - 200], [x + 16, FM.GY + 4]], 0.6, 6);
  g.p(post(gx0 - 14) + post(gx1 + 14), N(mix(C.stone, C.rock, 0.3)));
  g.p(c.cut([[gx0 - 38, FM.GY - 200], [gx1 + 38, FM.GY - 200], [gx1 + 30, FM.GY - 226], [gx0 - 30, FM.GY - 226]], 0.5, 8), N(C.stone2));
  let gs = '';
  for (let k = 0; k < 6; k++) gs += c.cut(c.blob((k % 2 ? gx1 + 14 : gx0 - 14) + c.rr(-6, 6), FM.GY - 30 - k * 30, 11, 6, 8, 0.2), 0.3, 4);
  g.x(gs, N(C.rock2), 'opacity=".6"');
  // a low courtyard wall from the house to the gate
  g.p(c.cut([[HX1 + 34, FM.GY - 66], [gx0 - 30, FM.GY - 70], [gx0 - 30, FM.GY + 4], [HX1 + 34, FM.GY + 4]], 0.5, 8), N(mix(C.stone, C.plaster2, 0.4)));
  gateL.add(g.out());
  const lampL = S.layer({ par: FM.P, sh: 5 });
  let lamps = [];
  if (lanterns) {
    const pts = c.qbez([HX1 + 10, TOP - 10], [(HX1 + FM.GATE) / 2, TOP + 90], [gx0 - 20, FM.GY - 222], 10);
    const pts2 = c.qbez([HX0 + 10, TOP - 10], [(HX0 + HX1) / 2, TOP + 70], [HX1 - 10, TOP - 10], 12);
    lampL.add(`<path d="${c.line(pts)}${c.line(pts2)}" stroke="${STRING}" stroke-width="1.4" fill="none"/>`);
    const at = [pts2[2], pts2[5], pts2[8], pts2[11]];
    lamps = at.map(([x, y], i) => ({ i, x, y, el: lampL.add(`<g transform="translate(${x} ${y})">${lanternM(c, { col: [C.apricot, C.roseRobe, C.halo][i % 3] }).replace(/<circle class="glow"[^>]*\/>/, '')}</g>`) }));
  }
  const glowL = S.layer({ par: FM.P, sh: 0, flat: true });
  const lampGlows = lamps.map((lp) => glowL.add(`<g transform="translate(${lp.x} ${lp.y + 24})">${glow(50, 0.7)}</g>`));
  const people = S.layer({ par: FM.P, sh: 5 });
  const front = S.layer({ par: FM.P + 0.02, sh: 5 });
  const fx = S.layer({ par: FM.P + 0.04, sh: 5 });
  return {
    c, sk, starL, hangL, sunEl, moonEl, land, house, lightL, gateL, lampL, glowL, people, front, fx, lamps, lampGlows,
    doorLit, winLit, N,
    update(T, { sunX = sunAt[0], sunY = sunAt[1], glowO = 0.5, sway = true } = {}) {
      if (sunEl) { pose(sunEl, { x: sunX, y: sunY, r: Math.sin(T * 0.6) }); pose(sunG, { x: sunX, y: sunY, o: glowO }); }
      if (moonEl) { pose(moonEl, { x: moonAt[0], y: moonAt[1], r: Math.sin(T * 0.5) }); pose(sunG, { x: moonAt[0], y: moonAt[1], o: 0.25 }); }
      lamps.forEach((lp) => pose(lp.el, { x: lp.x, y: lp.y, r: T && sway ? Math.sin(T * 0.8 + lp.i) * 2 : 0 }));
    },
  };
}
/** walk along the road: u 0 (gate) → 1 (far) → [x, y, s, dir] */
export function onRoad(u) {
  const [x, y, d] = alongPts(ROAD, u);
  return [x, y, roadS(y), d];
}
function alongPts(pts, u) {
  let total = 0;
  const segs = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); total += l; }
  let d = clamp(u) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const k = segs[i] ? Math.min(1, d / segs[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k, pts[i + 1][0] >= pts[i][0] ? 1 : -1];
    }
    d -= segs[i];
  }
  const n = pts.length - 1;
  return [pts[n][0], pts[n][1], 1];
}

/** a riding camel with saddle bags and a rider sitting on its hump (facing right; origin between its feet) */
export function riderCamel(c, look) {
  const bags = sheet().p(c.cut(c.blob(-46, -120, 22, 26, 10, 0.15), 0.5, 4) + c.cut(c.blob(30, -118, 20, 24, 10, 0.15), 0.5, 4), C.ochreRobe).x(c.ribbon([[-58, -132], [-34, -134]], 3) + c.ribbon([[20, -130], [40, -132]], 3), C.terracotta).out();
  const rider = `<g transform="translate(-20 -150) scale(.9)">${person(c, { ...look, pose: 'sit', holdB: `<g transform="translate(0 -4)">${purseM(c, {})}</g>` })}</g>`;
  return camelM(c).replace('<g class="legF">', `${bags}${rider}<g class="legF">`);
}

/* ================================================================== the far country */
export { laurel } from '../luke2/lib.js';
/** a bare, dead tree (origin: its foot) */
export function deadTree(c, h = 220, col = C.wood2) {
  const s = sheet();
  const trunk = c.qbez([0, 0], [c.rr(-10, 10), -h * 0.5], [c.rr(-20, 20), -h], 10);
  s.p(c.ribbon(trunk, (u) => 16 - u * 11), col);
  let br = '';
  [[0.45, -1], [0.6, 1], [0.75, -1], [0.85, 1]].forEach(([f, d]) => {
    const p = trunk[Math.round(f * 10)];
    const e = [p[0] + d * h * c.rr(0.22, 0.34), p[1] - h * c.rr(0.12, 0.22)];
    br += c.ribbon(c.qbez(p, [p[0] + d * h * 0.1, p[1] - h * 0.05], e, 6), (u) => 7 - u * 5.5);
    br += c.ribbon([[e[0] - d * 10, e[1] + 6], [e[0] + d * 12, e[1] - 16]], 2);
  });
  s.p(br, col);
  return s.out();
}
/** a domed city skyline (origin: its base line at y 0), from x0 to x1 */
export function domeCity(c, x0, x1, { wall = C.plaster, dome = C.sun, win = C.soilDark, lit = false, h = 150 } = {}) {
  const s = sheet();
  let blocks = '', domes = '', wins = '';
  for (let x = x0; x < x1;) {
    const w = c.rr(50, 110), hh = c.rr(0.4, 1) * h;
    blocks += c.cut(c.rect(x, -hh, w, hh + 4), 0.4, 6);
    if (c.chance(0.45)) domes += c.cut([[x + w * 0.15, -hh], ...c.arc(x + w / 2, -hh, w * 0.35, w * 0.42, PI, 2 * PI, 10), [x + w * 0.85, -hh]], 0.3, 5) + c.cut(c.rect(x + w / 2 - 1.5, -hh - w * 0.42 - 14, 3, 14), 0.1, 3);
    else if (c.chance(0.4)) blocks += c.cut(c.rect(x + w * 0.35, -hh - 60, w * 0.3, 64), 0.3, 4);
    for (let k = 0; k < 2; k++) if (c.chance(0.6)) wins += c.poly(c.rect(x + c.rr(8, w - 18), -c.rr(20, hh - 16), 8, 12));
    x += w + c.rr(-10, 16);
  }
  s.p(blocks, wall).p(domes, dome);
  s.x(wins, lit ? C.lampFlame : win);
  return s.out();
}
/** cracks over dry ground (a flat sheet of dark lines), across x0..x1 around y */
export function cracks(c, x0, x1, y0, y1, n = 40, col = C.soil) {
  let d = '';
  for (let i = 0; i < n; i++) {
    let x = c.rr(x0, x1), y = c.rr(y0, y1);
    const pts = [[x, y]];
    for (let k = 0; k < 4; k++) { x += c.rr(-30, 30); y += c.rr(-4, 8); pts.push([x, y]); }
    d += c.ribbon(pts, (u) => 2.4 - u * 1.8);
  }
  return `<path d="${d}" fill="${col}" opacity=".55"/>`;
}

/* ================================================================== the embrace */
/**
 * The father falling on his son's neck: one still cut-out (origin between their feet). The son faces right, the
 * father faces left, heads together, the father's arm over the son's back; son: look of the son.
 */
export function embrace(c, sonLook, { fatherLook = FATHER, gap = 34, bare = true } = {}) {
  let son = pose3M(c, [{ x: -gap / 2, y: 0, s: 1, flip: false, armF: 70, armB: 60, head: 12, o: sonLook }]);
  if (bare) son = barefoot(son, sonLook.skin);
  let fa = person(c, { ...fatherLook });
  fa = fa.replace('<g class="armFr">', '<g class="armFr" transform="rotate(-112)">').replace('<g class="armBr">', '<g class="armBr" transform="rotate(-70)">').replace('<g class="headr">', '<g class="headr" transform="rotate(16)">').replace('<g class="body">', '<g class="body" transform="rotate(4)">');
  return `${son}<g transform="translate(${gap / 2} 0) scale(-1 1)">${fa}</g>`;
}
/** a person's markup with bare feet (the sandal pieces recoloured to the skin) */
export function barefoot(markup, skin = C.skin3) {
  return markup.split(`fill="${C.sandal}"`).join(`fill="${shade(skin, -0.06)}"`).split(`fill="${shade(C.sandal, 0.08)}"`).join(`fill="${skin}"`);
}
/** the ragged younger son as a puppet markup (barefoot) */
export const ragsMarkup = (c, extra = {}) => barefoot(person(c, { ...YOUNGER_RAGS, ...extra }), YOUNGER_RAGS.skin);

/* ================================================================== the feast going on in the courtyard (Łk 15,25–32) */
/**
 * The household still at table in the lit courtyard and the dancers and players in front of the house (seen from
 * the gateway): a still group as one sprite, three dancers that move whole, and music notes rising.
 * Returns { update(t, time, on) }.
 */
export function partyBack(S, F, { x0 = 380, notesAt = [480, 700], withSon = true } = {}) {
  const c = S.c;
  const L = F.people;
  const TB = 540;
  const oc = makeCutter(S.id('party'));
  const members = [
    { x: 420 - TB, y: 0, s: 0.9, flip: false, armF: 60, armB: 20, o: { ...SERVANTS[3], pose: 'sit' } },
    { x: 480 - TB, y: 0, s: 0.9, flip: false, armF: 90, armB: 30, o: { ...SERVANTS[2], pose: 'sit' } },
    { x: 540 - TB, y: 0, s: 0.94, flip: false, armF: 110, armB: 120, o: withSon ? { ...YOUNGER_ROBED, pose: 'sit' } : { ...SERVANTS[1], pose: 'sit' } },
    { x: 600 - TB, y: 0, s: 0.9, flip: true, armF: 60, armB: 20, o: { ...SERVANTS[0], pose: 'sit' } },
  ];
  const table = `<g transform="translate(0 22)">${lowTableM(oc, 360, 44)}<g transform="translate(-120 -48)">${loafM(oc, 14)}</g><g transform="translate(-20 -46)">${cupM(oc, C.ochre)}</g><g transform="translate(84 -46)">${platter(oc, 100)}</g></g>`;
  const group = L.sprite(`<g>${pose3M(oc, members)}${table}</g>`, TB, FM.GY);
  const dancers = [[660, SERVANTS[1], false], [720, SERVANTS[2], true], [790, SERVANTS[3], false]].map(([x, o, flip], i) => ({ i, x, flip, el: L.add(`<g>${pose3M(oc, [{ x: 0, y: 0, s: 0.9, flip, armF: 150, armB: 160, head: -8, o }])}</g>`) }));
  const notes = Array.from({ length: 7 }, (_, i) => ({ i, el: F.fx.add(`<g opacity="0">${note(oc, [C.terracotta, C.plumRobe, C.teal2][i % 3])}</g>`) }));
  return {
    group, dancers,
    update(t, time, on = 1, loud = 1) {
      group.set({ x: TB, y: FM.GY, o: on });
      dancers.forEach((d) => {
        const ph = (time || t * 3) * 3 + d.i * 1.7;
        pose(d.el, { x: d.x + Math.sin(ph * 0.5) * 16, y: FM.GY - Math.abs(Math.sin(ph)) * 10, sx: Math.sin(ph * 0.5 + d.i) > 0 ? 1 : -1, o: on });
      });
      notes.forEach((n) => {
        const k = (((time || t * 2) * 0.35) + n.i / 7) % 1;
        pose(n.el, { x: lerp(notesAt[0], notesAt[1], (n.i % 4) / 3) + Math.sin(k * 6 + n.i) * 18, y: 520 - k * 240, s: 0.9 + k * 0.4, r: Math.sin(k * 5 + n.i) * 14, o: on * loud * Math.sin(k * PI) });
      });
    },
  };
}
/** a cut-out turned into a dashed outline (something that was never there) */
export function dashed(markup, col = C.inkSoft) {
  return markup.replace(/<path class="(gsh|grain)[^"]*"[^>]*\/>/g, '').replace(/fill="[^"]*"/g, `fill="${mix(C.cream, C.parchment, 0.5)}" fill-opacity=".35" stroke="${col}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"`);
}
/** a round picture on a string, parked in the flies (origin: the picture's centre) */
export function hungPlate(S, L, c, inner, { r = 70, name = 'plate', extra = '' } = {}) {
  return L.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V${-r - 6}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${roundelJ(c, inner, { r, id: S.id(name) })}${extra}</g>`);
}
/** a paper heart without its glow (for hearts that pass over people) */
export const heartFlat = (c, r = 12, col) => heartM(c, r, col).replace(/<circle[^>]*\/>/, '');
