// Luke 7 — the cast and cut-outs of this chapter. Capernaum's street and the centurion's red-roofed house are
// Matthew 8's (the same house: its front wall lifts away); John's two disciples, the prison of Machaerus, the sick,
// the courtiers and the children of the market are Matthew 11's. New here: the elders of Capernaum and the
// centurion's friends; Nain on the slope of the hill with its town gate, the carried bier and the widow; the
// house of Simon the Pharisee — a courtyard dining room with its gateway on the evening street — Simon, his
// guests and the woman of the city with her alabaster flask; the moneylender's two debtors.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { band, hillsWith, waterBand, town, house, sun, cloud, grass, olive, cypress, bush, flowers, rock, palm } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { longHair, outLegs as outLegsJ, cushion as cushionJ } from '../john12/lib.js';
import { alabaster as alabasterM } from '../mark14/lib.js';
import { loaf as loafM, cup as cupM, bowl as bowlM, jug as jugM } from '../mark2/lib.js';
import { addToHead, addToBody } from '../mark2/lib.js';
import { pose3 } from '../matthew4/lib.js';
import { hillsSet as hillsSetM, DAY as DAYM } from '../matthew11/lib.js';
import { voiceRings as voiceRingsM, hang2 as hang2M } from '../mark1/lib.js';
import { cameo as cameoM } from '../luke2/lib.js';

export { bedCut, SERVANT, HOUSEBOY, mob, painMarks, thoughtCloud, along, centurion, soldier } from '../matthew8/lib.js';
import { bedCut } from '../matthew8/lib.js';
export {
  JD, JOHN_B, WIDOW, YOUTH, BLIND, LAME, DEAF, BEGGAR, COURTIERS, HEROD, LEPER, LEPER_HEALED, ISAIAH, ABRAHAM, MOSES, DAVID, L9, KID_LOOKS,
  DAY, MORNING, GOLDEN, DUSK, NIGHT, DESERT, PRISON, HEAVEN, EVENING, KINGDOM,
  prisonWall, bars, bier, shroud, reedClump, stumbleStone, earGlyph, eyeGlyph, note, tear, plinth, throng, popIn, kid, kidHead,
  manOf, womanOf, hillsSet, townSet, wildSet, riverSet, crown, throne, crutch, leperSpots, blindBand, lyingPerson, bubble, cry, tag, flute,
  tambourine, question, nameTag, pharisee, heart, coin, coinStack, loaf, cup, bowl, jug, lowTable, scrollOpen, scrollRolled, sparkle, spark,
  voiceRings, headAt, hand, kf, moving, goldSlip, hungWord, goldWord, rayBurst, glowDisc, radiance, kingdomGate, gateDoor, lawTablets, harp,
  wordSlip, pose3, bakeArms, tiltHead, fatherLight, emptyBowl, hangAt, scrub, acacia, lantern, thought, speech, GLYPH, storyFrame, SEPIA,
  handLamp, cityIcon, bigJar, awning, strip, labelTag, childPerson, hang2,
} from '../matthew11/lib.js';
export { outLegs, cushion, nardJar, curl, hangLamp, platter, denar, moneybag, longHair } from '../john12/lib.js';
export { alabaster, nardMist, vis } from '../mark14/lib.js';
export { tick } from '../mark6/lib.js';
export { scrap } from '../mark2/lib.js';
export { POSSESSED, mat } from '../mark1/lib.js';
export { spirit, sickGirlIcon, streetSet, purse } from '../mark5/lib.js';
export { caesar, cameo, laurel } from '../luke2/lib.js';
export { flat, flatSky, flatHills, fig, flatText, dropK, flyTo, ELIZABETH, babyJohn, johnInArms, JOHN_BOY } from '../luke1/lib.js';
export { addToHead, addToBody, tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const NOON = ['#c3dcd8', '#eeebd4', '#f6e8cc'];
export const WARM = ['#c4dad6', '#eee6cb', '#f7e5c2'];          // a warm afternoon at Nain
export const SUPPER = ['#8c7fa8', '#dca58f', '#f0c9a0'];        // evening over Simon's courtyard
export const SUPPER2 = ['#4f4f84', '#9b7f9f', '#d9a08c'];       // later, the lamps lit

/* ================================================================== the cast */
/** the elders of the Jews of Capernaum, sent by the centurion (heads of the synagogue) */
export const ELDERS = [
  { robe: C.linen2, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  { robe: C.stone, mantle: mix(C.tealRobe, C.stone2, 0.2), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.teal2, beard: 'wild', beardColor: '#d8d2c6', skin: C.skin3, belt: C.ochre },
  { robe: C.wheatRobe, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin, belt: C.leather },
];
/** the centurion's friends (men of his house: short Roman tunics, a coloured cloak) */
export const FRIENDS = [
  { robe: C.linen, mantle: C.terracotta, mantleArm: true, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.ochre },
  { robe: mix(C.skyVeil, C.linen, 0.4), mantle: C.clayMantle, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.leather },
];
/** the bearers of the bier at Nain */
export const BEARERS = [
  { robe: C.stone2, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope },
  { robe: mix(C.dune, C.stone2, 0.4), hair: C.hair, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin2, belt: C.rope },
  { robe: mix(C.stone2, C.dustyBlue, 0.25), hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.rope },
  { robe: mix(C.sand2, C.stone2, 0.5), hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.rope },
];
/** Simon the Pharisee, the host: fine linen, a deep-blue prayer mantle, a white wrap with blue */
export const SIMON = { robe: C.linen, mantle: shade(C.indigo, 0.28), hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: shade(C.indigo, 0.3), beard: 'full', beardColor: C.hair3, skin: C.skin2, belt: C.sun };
/** his guests at the table */
export const GUESTS = [
  { robe: C.stone, mantle: C.tealRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.teal2, beard: 'wild', beardColor: C.greyHair, skin: C.skin3, belt: C.leather },
  { robe: C.wheatRobe, mantle: C.dustyBlue, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin, belt: C.leather },
  { robe: C.linen2, mantle: C.plumRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.ochre },
];
/** the woman of the city, a sinner: a rose robe, a saffron veil; unveiled, her dark hair falls loose */
export const SINNER = { robe: mix(C.roseRobe, C.curtain, 0.25), mantle: null, hairStyle: 'veil', veil: C.wheat, veil2: C.ochre, hair: C.hair3, beard: 'none', skin: C.skin, belt: C.plumRobe };
export const SINNER_BARE = { ...SINNER, hairStyle: 'long', hair: C.hair3 };
/** the woman kneeling with her hair let down (the fall hangs from the head; counter-rotate .lhair) */
export function sinnerHair(c, pose = 'kneel', extra = {}) {
  return person(c, { ...SINNER_BARE, pose, ...extra }).replace('<g class="headr">', `<g class="headr">${longHair(c, C.hair3)}`);
}
/** a tax collector (as Levi's companions): a striped robe and a purse */
export const TAXMAN = { robe: C.ochreRobe, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.ochre, beard: 'short', skin: C.skin3, belt: C.leather };
/** a lawyer (a teacher of the Law): scroll-case and a dark mantle */
export const LAWYER = { robe: C.parchment, mantle: shade(C.plumRobe, -0.18), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin, belt: C.ochre };

/* ================================================================== small helpers */
/** a man / a woman of the crowd (men never veiled) */
export function manO(c, extra = {}) { const o = crowdPerson(c); if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); } return { ...o, ...extra }; }
export function womanO(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }
/** a person's markup with arms / head baked in, placed at (x, y) with scale s (for still groups) */
export function figure(c, o, { x = 0, y = 0, s = 1, flip = false, armF = 0, armB = 0, head = 0, lean = 0 } = {}) {
  let m = person(c, o);
  if (armF) m = m.replace('<g class="armFr">', `<g class="armFr" transform="rotate(${-armF})">`);
  if (armB) m = m.replace('<g class="armBr">', `<g class="armBr" transform="rotate(${-armB})">`);
  if (head) m = m.replace('<g class="headr">', `<g class="headr" transform="rotate(${head})">`);
  if (lean) m = m.replace('<g class="body">', `<g class="body" transform="rotate(${lean})">`);
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})">${m}</g>`;
}
/** hide a piece while it is up in the flies */
export function showAt(el, x, y, { s = 1, r = 0, o = 1 } = {}) { pose(el, { x, y, s, r, o: o > 0.004 ? o : 0 }); }

/* ================================================================== props */
/** the bier as it is carried: two long poles and the board, a linen cloth hanging over it (origin: centre of the
 *  board's top, where the body lies; the poles run from -w/2-60 to w/2+60 at y +6) */
export function carriedBier(c, w = 200) {
  const s = sheet();
  s.p(c.ribbon([[-w / 2 - 64, 7], [w / 2 + 64, 5]], 7), C.wood2);
  s.p(c.cut([[-w / 2, -2], [w / 2, -4], [w / 2 + 2, 10], [-w / 2 - 2, 12]], 0.4, 8), C.wood);
  s.p(c.cut([[-w / 2 + 6, -6], [w / 2 - 6, -8], [w / 2 - 2, 26], [w / 2 - 20, 22], [w * 0.2, 28], [-w * 0.1, 22], [-w * 0.34, 28], [-w / 2 + 2, 24]], 0.8, 7), C.linen2);
  s.x(c.ribbon([[-w / 2 + 12, 14], [w / 2 - 14, 12]], 2), C.stone2, 'opacity=".7"');
  return s.out();
}
/** a young man wrapped in his burial linen, lying on his back, head to the left (origin: middle of the bier top) */
export function wrapped(c, look, w = 170) {
  const s = sheet();
  // the linen body wrap
  s.p(c.cut([[-w / 2 + 30, -2], [-w / 2 + 34, -24], [-w * 0.1, -30], [w * 0.2, -28], [w / 2 - 20, -20], [w / 2, -12], [w / 2 + 2, -2]], 0.6, 6), C.linen);
  let bands = '';
  for (let i = 0; i < 6; i++) { const x = -w / 2 + 50 + i * (w - 60) / 6; bands += c.ribbon([[x, -2], [x + 8, -28 + Math.abs(i - 2) * 2]], 2.2); }
  s.x(bands, C.stone2, 'opacity=".8"');
  // head on a small cushion, face to the sky
  s.p(c.cut(c.blob(-w / 2 + 14, -6, 20, 8, 10, 0.1), 0.4, 4), C.skyVeil);
  const face = sheet();
  face.p(c.cut(c.circ(-w / 2 + 18, -20, 15, 20), 0.3, 4), mix(look.skin, C.stone2, 0.35));
  face.p(c.cut([...c.arc(-w / 2 + 18, -20, 16.5, 16.5, PI * 0.55, PI * 1.35, 10), [-w / 2 + 12, -12]], 0.4, 4), look.hair);
  face.x(c.ribbon(c.arc(-w / 2 + 24, -24, 3, 2, 0.2, PI - 0.2, 5), 1.1) + c.ribbon(c.arc(-w / 2 + 24, -15, 3, 2, 0.2, PI - 0.2, 5), 1.1), C.inkSoft);
  // a linen band round the head
  face.p(c.ribbon(c.arc(-w / 2 + 18, -20, 16, 16, PI * 1.25, PI * 1.75, 8), 4), C.linen);
  return s.out() + face.out();
}
/** a round painted medallion on a cord (origin: the knot where the cord is tied; the disc hangs below) */
export function roundel(c, inner, { r = 44, face = C.parchment, rim = C.haloRim } = {}) {
  const s = sheet();
  s.p(c.cut(c.circ(0, r + 12, r + 5, 36), 0.4, 5), rim);
  s.p(c.cut(c.circ(0, r + 12, r, 36), 0.4, 5), face);
  const id = 'rnd' + Math.floor(c.r() * 1e9);
  return `<path d="M0 -1600V12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<clipPath id="${id}"><circle cx="0" cy="${r + 12}" r="${r - 1}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(0 ${r + 12})">${inner}</g></g>`;
}
/** a wax tablet / IOU with a sum written on it (origin centre); w wide */
export function iou(c, text, { w = 120, h = 80, face = mix(C.wheat, C.cream, 0.4), wood = C.wood3, ink = C.ink, size = 34 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12), 0.4, 6), wood);
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), face);
  let ln = '';
  for (let i = 0; i < 2; i++) ln += c.ribbon([[-w / 2 + 10, h / 2 - 12 - i * 8], [w / 2 - 10 - i * 20, h / 2 - 12 - i * 8]], 1.4);
  s.x(ln, C.ink, 'opacity=".35"');
  return s.out() + `<text x="0" y="${(size * 0.18).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="600" fill="${ink}">${text}</text>`;
}
/** half of a torn IOU (dir -1 left half, 1 right half); origin: the tear line's middle */
export function iouHalf(c, text, dir, { w = 120, h = 80, face = mix(C.wheat, C.cream, 0.4), wood = C.wood3, size = 34 } = {}) {
  const s = sheet();
  const tearPts = [];
  for (let i = 0; i <= 8; i++) tearPts.push([(i % 2 ? 5 : -5) * c.rr(0.4, 1), -h / 2 - 6 + (i * (h + 12)) / 8]);
  const outer = dir < 0 ? [[-w / 2 - 6, h / 2 + 6], [-w / 2 - 6, -h / 2 - 6]] : [[w / 2 + 6, -h / 2 - 6], [w / 2 + 6, h / 2 + 6]];
  const pts = dir < 0 ? [...tearPts, ...outer] : [...tearPts.slice().reverse(), ...outer];
  s.p(c.cut(pts, 0.4, 6), wood);
  const inner = dir < 0 ? [[0, -h / 2], [-w / 2, -h / 2], [-w / 2, h / 2], [0, h / 2]] : [[0, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [0, h / 2]];
  s.p(c.cut(inner, 0.4, 6), face);
  const id = 'ih' + Math.floor(c.r() * 1e9);
  const clip = dir < 0 ? `<rect x="${-w}" y="${-h}" width="${w}" height="${2 * h}"/>` : `<rect x="0" y="${-h}" width="${w}" height="${2 * h}"/>`;
  return s.out() + `<clipPath id="${id}">${clip}</clipPath><g clip-path="url(#${id})"><text x="0" y="${(size * 0.18).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="600" fill="${C.ink}">${text}</text></g>`;
}
/** a Roman standard: a pole with a gilded eagle and a red banner (origin: the foot of the pole) */
export function standard(c, h = 280) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0, -h]], 6), C.wood2);
  s.p(c.cut([[-40, -h + 70], [40, -h + 72], [38, -h + 150], [0, -h + 136], [-38, -h + 150]], 0.5, 6), C.curtain2);
  s.x(c.ribbon([[-34, -h + 84], [34, -h + 85]], 3) + c.ribbon([[-32, -h + 128], [32, -h + 129]], 3), C.sun, 'opacity=".9"');
  s.p(c.cut([[-46, -h + 64], [46, -h + 64], [46, -h + 72], [-46, -h + 72]], 0.3, 6), C.sun);
  // the eagle with spread wings on a little wreath
  s.p(c.cut([[-40, -h - 20], [-30, -h - 34], [-14, -h - 30], [-6, -h - 22], [0, -h - 30], [6, -h - 22], [14, -h - 30], [30, -h - 34], [40, -h - 20], [18, -h - 18], [8, -h - 8], [-8, -h - 8], [-18, -h - 18]], 0.4, 4), C.sun);
  s.p(c.cut(c.circ(0, -h - 30, 6, 10), 0.2, 3), shade(C.sun, 0.1));
  s.p(c.cut(c.ell(0, -h + 2, 16, 8, 14), 0.3, 4), C.leaf);
  return s.out();
}
/** a small copper basin and a folded towel (the water for the feet); origin: bottom centre */
export function basin(c, { water = false } = {}) {
  const s = sheet();
  s.p(c.cut([[-30, -16], [30, -16], [22, 0], [-22, 0]], 0.3, 5), mix(C.pot, C.sun, 0.35));
  s.p(c.cut(c.ell(0, -16, 30, 6, 16), 0.3, 4), water ? C.lake : shade(mix(C.pot, C.sun, 0.35), -0.3));
  s.p(c.cut([[36, 0], [38, -10], [76, -10], [74, 0]], 0.3, 5), C.linen);
  s.x(c.ribbon([[40, -5], [72, -5]], 1.2), C.stone2);
  return s.out();
}
/** a horn of oil for anointing a guest's head (origin: its base) */
export function oilHorn(c) {
  return sheet().p(c.cut([[-12, 0], [-14, -14], [-8, -30], [4, -44], [12, -50], [14, -46], [8, -36], [8, -14], [10, 0]], 0.3, 4), mix(C.wheat, C.wood3, 0.4))
    .p(c.cut(c.rect(8, -54, 8, 6), 0.2, 3), C.wood2).x(c.ribbon([[-12, -12], [8, -12]], 1.6), shade(C.wood3, -0.2)).out();
}
/** a kiss: a tiny rose heart (origin centre) */
export function kiss(c, r = 9, col = C.jesusMantle) {
  const pts = [];
  for (let i = 0; i < 20; i++) { const a = (i / 20) * PI * 2; pts.push([16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16]); }
  return `<path d="${c.cut(pts, 0.2, 3)}" fill="${col}"/>`;
}
/** a × mark cut from paper (what was not given) */
export function crossMark(c, r = 20, col = shade(C.stone2, -0.25)) {
  return `<path d="${c.ribbon([[-r, -r], [r, r]], r * 0.3) + c.ribbon([[r, -r], [-r, r]], r * 0.3)}" fill="${col}"/>`;
}

/* ================================================================== Capernaum: the street and the centurion's house */
/* Matthew 8's street and red-roofed house (the same house, cut the same way), moved in towards the middle of the stage
   so that a phone held upright sees both Jesus in the street and the room inside. */
export const HOUSE = { X0: 850, X1: 1160, TOP: 440, BASE: 652, DOOR: 1085, BEDX: 955, FEET: 742 };
export function centurionHouse(c) {
  const { X0, X1, TOP, BASE, DOOR, BEDX } = HOUSE;
  const room = sheet();
  room.p(c.cut(c.rect(X0 + 6, TOP, X1 - X0 - 12, BASE - TOP), 0.5, 10), shade(C.plaster2, -0.12));
  room.p(c.cut(c.rect(X0 + 6, BASE - 26, X1 - X0 - 12, 26), 0.4, 8), shade(C.sand2, -0.1));
  room.p(c.cut([[X0 + 40, TOP + 60], [X0 + 40, TOP + 30], ...c.arc(X0 + 60, TOP + 30, 20, 16, PI, 2 * PI, 8), [X0 + 80, TOP + 60]], 0.3, 5), shade(C.plaster2, -0.3));
  room.p(c.cut(c.rect(X1 - 70, TOP + 40, 40, 70), 0.3, 5), C.lake2);
  const inside = room.out() + `<g transform="translate(${BEDX} ${BASE})">${bedCut(c, 200)}</g>`;
  const f = sheet();
  const door = [[DOOR - 30, BASE], [DOOR - 30, BASE - 96], ...c.arc(DOOR, BASE - 96, 30, 28, PI, 2 * PI, 10), [DOOR + 30, BASE]];
  const win = [[X0 + 90, TOP + 120], [X0 + 90, TOP + 76], ...c.arc(X0 + 114, TOP + 76, 24, 20, PI, 2 * PI, 8), [X0 + 138, TOP + 120]];
  f.p(c.cut(c.rect(X0, TOP, X1 - X0, BASE - TOP + 4), 0.5, 10) + c.hole(door, 0.3, 6) + c.hole(win, 0.3, 5), C.plaster);
  f.p(c.cut(c.rect(X0 - 6, BASE - 16, X1 - X0 + 12, 20), 0.4, 8), C.stone2);
  f.p(c.cut(c.rect(DOOR - 46, BASE - 150, 12, 150), 0.3, 6) + c.cut(c.rect(DOOR + 34, BASE - 150, 12, 150), 0.3, 6) + c.cut(c.rect(DOOR - 52, BASE - 160, 104, 12), 0.3, 6), C.stone);
  f.p(c.ribbon([[X0, TOP + 14], [X1, TOP + 14]], 10), C.terracotta);
  f.x(c.ribbon([[X0 + 92, TOP + 120], [X0 + 136, TOP + 120]], 4), C.wood2);
  f.p(c.cut(c.ell(X0 + 166, BASE - 112, 17, 25, 16), 0.3, 4), C.curtain2);
  f.x(c.poly(c.star(X0 + 166, BASE - 112, 9, 3.6, 4, 0)), C.sun);
  const roof = sheet();
  roof.p(c.cut([[X0 - 24, TOP + 4], [X0 + 30, TOP - 56], [X1 - 30, TOP - 56], [X1 + 24, TOP + 4]], 0.5, 8), C.terracotta);
  let tiles = '';
  for (let x = X0 + 10; x < X1 - 10; x += 22) tiles += c.ribbon([[x + 14, TOP - 54], [x - 8, TOP + 2]], 3);
  roof.x(tiles, shade(C.terracotta, -0.2), 'opacity=".55"');
  roof.p(c.ribbon([[X0 - 24, TOP + 4], [X1 + 24, TOP + 4]], 6), shade(C.terracotta, -0.15));
  // the room's dark doorway, seen when the front is closed (so no one inside shows through the door)
  const dark = sheet().p(c.cut([[DOOR - 31, BASE + 1], [DOOR - 31, BASE - 96], ...c.arc(DOOR, BASE - 96, 31, 29, PI, 2 * PI, 10), [DOOR + 31, BASE + 1]], 0.3, 6), shade(C.plaster2, -0.45)).out();
  return { inside, front: f.out(), roof: roof.out(), dark };
}
/**
 * A street in Capernaum (as Matthew 8): sky, sun and clouds on strings, the far shore and the lake, hills, a row of
 * flat-roofed houses, the centurion's house (its front wall lifts away) and the street. Call addFront() after adding
 * what lives inside the house.
 */
export function capStreet(S, { skyCols = NOON, sunAt = [560, 120] } = {}) {
  const c = makeCutter('lk7-cap-street');
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[860, 130, 180], [1320, 170, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 400, amps: [14, 6, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup + waterBand(c, { y: 432, color: mix(C.lake, C.skyBlue, 0.2), foamN: 16, bottom: 900 }).markup);
  const hl = S.layer({ par: 0.16, sh: 3 });
  hl.add(hillsWith(c, { y: 500, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 }).markup);
  const row = S.layer({ par: 0.3, sh: 4 });
  const base = 624;
  let hs = '';
  [[-760, 150, 110], [-540, 130, 96], [-350, 160, 124], [-130, 130, 100], [60, 150, 118], [270, 140, 96], [470, 170, 128], [1330, 150, 112], [1530, 140, 100], [1730, 160, 120]].forEach(([x, w, h], i) => {
    hs += house(c, x, base + (i % 2) * 4, w, h, { wall: i % 3 === 1 ? C.plaster2 : C.plaster, shadow: shade(C.plaster2, -0.06), stairs: i % 2 === 0 });
  });
  row.add(hs + palm(c, 220, base + 4, 170) + olive(c, 720, base + 6, 0.7) + palm(c, 1460, base + 4, 150));
  const houseL = S.layer({ par: 0.36, sh: 4 });
  const H = centurionHouse(c);
  houseL.add(`<g>${H.inside}</g>`);
  const G = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(650, [3, 1.5], [700, 180]);
  const gs = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand);
  let stones = '';
  for (let k = 0; k < 70; k++) { const px = c.rr(-600, 2200), py = c.rr(680, 980); stones += c.cut(c.blob(px, py, c.rr(8, 18), c.rr(4, 8), 8, 0.2), 0.4, 4); }
  gs.x(stones, C.sand2, 'opacity=".7"');
  G.add(gs.out());
  G.add(grass(c, { x0: -600, x1: 780, y: 652, fn: gfn, n: 16, h: 12, color: C.olive }));
  return {
    c, sk, hangL, sunEl, houseL, G, gfn,
    /** the front wall and roof (after the people inside); returns { front, roof, glow, dark } — pose(dark, {o}) hides the room's doorway */
    addFront(mid) {
      const glow = houseL.add(`<g opacity="0"><path d="${c.poly([[HOUSE.X0 - 40, HOUSE.TOP + 12], [HOUSE.X0 + 24, HOUSE.TOP - 76], [HOUSE.X1 - 24, HOUSE.TOP - 76], [HOUSE.X1 + 40, HOUSE.TOP + 12]])}" fill="${C.halo}" opacity=".7"/></g>`);
      const dark = houseL.add(`<g>${H.dark}</g>`);
      const between = mid ? mid(houseL) : null;
      const front = houseL.add(`<g>${H.front}</g>`);
      const roof = houseL.add(`<g>${H.roof}</g>`);
      return { front, roof, glow, dark, between };
    },
    update(time) {
      swing(sunEl, sunAt[0], sunAt[1], time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}

/* ================================================================== Nain */
export const NAIN = { FEET: 742, GATE: 1120, GW: 150, GH: 240, WALLTOP: 470 };
/**
 * Nain on the slope of the hill of Moreh: sky and sun on strings; Mount Tabor far off on the left; the long slope
 * of the hill rising to the right with the town's houses climbing it; the town wall with its gate (the gate is
 * split: the left jamb and the dark passage behind the people, the lintel and the wall to the right in front, so
 * the procession comes out of the archway); the road. Returns layers and update(time).
 */
export function nainSet(S, { skyCols = WARM, sunAt = [1270, 150] } = {}) {
  const c = makeCutter('lk7-nain-set');
  const { FEET, GATE, GW, GH } = NAIN;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cls = [[520, 150, 180], [900, 110, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 900 }) }));
  const far = S.layer({ par: 0.07, sh: 2 });
  // Mount Tabor: a round dome far away on the left
  const tb = sheet();
  tb.p(c.cut([[-900, 520], [-100, 500], [80, 470], [180, 360], [260, 300], [340, 290], [420, 320], [500, 400], [600, 470], [820, 500], [2500, 510], [2500, 900], [-900, 900]], 1.2, 12), mix(C.hillFar, C.duskViolet, 0.18));
  far.add(tb.out());
  far.add(band(c, { y: 520, amps: [8, 4, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.sage2, 0.35) }).markup);
  // the hill of Moreh rising to the right, the town climbing it
  const slope = S.layer({ par: 0.16, sh: 3 });
  const sfn = (x) => 540 - Math.max(0, x - 760) * 0.26 + Math.sin(x / 90) * 4;
  const ss = sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1.2), mix(C.hillMid, C.sand2, 0.2));
  slope.add(ss.out());
  let hs = '';
  for (let i = 0; i < 16; i++) {
    const x = 900 + i * 62 + c.rr(-14, 14), y = sfn(x) + 10 + c.rr(0, 16);
    hs += house(c, x, y, c.rr(40, 60), c.rr(30, 44), { stairs: c.chance(0.4), wall: i % 3 ? C.plaster : C.plaster2, shadow: shade(C.plaster2, -0.08) });
  }
  slope.add(hs + olive(c, 760, sfn(760) + 30, 0.6) + cypress(c, 900, sfn(900) + 40, 90) + olive(c, 380, sfn(380) + 40, 0.5));
  // the town wall rising behind the gate, and the dark passage of the gate
  const wallBack = S.layer({ par: 0.4, sh: 4 });
  const wcol = mix(C.stone2, C.sand2, 0.35);
  const wb = sheet();
  const x0 = GATE - GW / 2, x1 = GATE + GW / 2;
  wb.p(c.cut([[x0 - 6, FEET - GH - 6], [x1 + 6, FEET - GH - 6], [x1 + 6, FEET - 30], [x0 - 6, FEET - 30]], 0.4, 8), mix(C.soilDark, C.plumRobe, 0.25));
  wb.p(c.cut([[x0 + 34, FEET - 34], [x0 + 34, FEET - GH + 90], ...c.arc(GATE, FEET - GH + 90, GW / 2 - 34, 30, PI, 2 * PI, 10), [x1 - 34, FEET - 34]], 0.3, 6), mix(C.plaster, C.sand2, 0.4));
  wb.p(c.cut([[x0 + 34, FEET - 34], [x1 - 34, FEET - 34], [x1 - 34, FEET - 70], [x0 + 34, FEET - 64]], 0.3, 6), mix(C.sand, C.stone, 0.3));
  // the left tower (in front of nothing: the procession walks out in front of it)
  const tw = [[x0 - 150, FEET - 8], [x0 - 150, FEET - GH - 110], [x0 - 6, FEET - GH - 110], [x0 - 6, FEET - 8]];
  wb.p(c.cut(tw, 0.6, 10), wcol);
  let crn = '';
  for (let x = x0 - 150; x < x0 - 6; x += 36) crn += c.cut(c.rect(x, FEET - GH - 136, 22, 30), 0.4, 5);
  wb.p(crn, wcol);
  let blk = '';
  for (let y = FEET - GH - 100; y < FEET - 20; y += 34) for (let x = x0 - 146 + (Math.round(y / 34) % 2) * 24; x < x0 - 20; x += 50) blk += c.cut(c.rect(x, y, 42, 26), 0.4, 6);
  wb.x(blk, shade(wcol, 0.12), 'opacity=".7"');
  wb.p(c.cut([[x0 - 110, FEET - GH - 40], [x0 - 110, FEET - GH - 70], ...c.arc(x0 - 96, FEET - GH - 70, 14, 12, PI, 2 * PI, 6), [x0 - 82, FEET - GH - 40]], 0.3, 4), C.soilDark);
  wallBack.add(wb.out());
  // the ground and the road that runs down from the gate
  const G = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(FEET - 50, [4, 2], [700, 180]);
  const gs = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3));
  gs.p(c.ribbon([[-900, 790], [300, 780], [800, 770], [1100, 752], [1400, 744], [2500, 740]], 72, 2), mix(C.sand, C.cream, 0.3));
  let st = '';
  for (let k = 0; k < 50; k++) { const px = c.rr(-600, 2200), py = c.rr(FEET + 10, 980); st += c.cut(c.blob(px, py, c.rr(6, 14), c.rr(3, 6), 8, 0.2), 0.4, 4); }
  gs.x(st, C.sand2, 'opacity=".7"');
  G.add(gs.out());
  G.add(grass(c, { x0: -800, x1: 900, y: FEET - 50, fn: gfn, n: 26, h: 13, color: C.moss }) + flowers(c, { x0: 100, x1: 700, y: FEET - 40, fn: (x) => gfn(x) + 20, n: 10 }) + bush(c, 170, FEET - 30, 80, C.sage, C.moss) + rock(c, 330, FEET - 20, 60, 22, C.rock2));
  return {
    c, sk, hangL, sunEl, far, slope, wallBack, G, gfn,
    /** the wall to the right of the gate and the lintel over it — call after adding the people who walk out */
    addFront() {
      const L = S.layer({ par: 0.4, sh: 5 });
      const wf = sheet();
      const pts = [[x0 - 6, FEET - GH - 10], [x0 - 6, FEET - GH + 50], ...c.arc(GATE, FEET - GH + 50, GW / 2, 54, PI, 2 * PI, 14), [x1, FEET - 8], [2600, FEET - 8], [2600, FEET - GH + 20], [x1 + 6, FEET - GH - 10]];
      wf.p(c.cut(pts, 0.6, 10), wcol);
      let cr = '';
      for (let x = x1 + 10; x < 2600; x += 40) cr += c.cut(c.rect(x, FEET - GH - 36 + (x - x1) * 0.02, 24, 32), 0.4, 5);
      wf.p(cr, wcol);
      let bl = '';
      for (let y = FEET - GH - 40; y < FEET - 20; y += 34) for (let x = x1 + 16 + (Math.round(y / 34) % 2) * 24; x < 2500; x += 52) if (y > FEET - GH + (x - x1) * 0.02) bl += c.cut(c.rect(x, y, 44, 26), 0.4, 6);
      wf.x(bl, shade(wcol, 0.12), 'opacity=".7"');
      wf.p(c.ribbon(c.arc(GATE, FEET - GH + 50, GW / 2 + 8, 62, PI, 2 * PI, 14), 14), shade(wcol, -0.1));
      wf.p(c.cut(c.rect(x0 - 16, FEET - GH - 22, GW + 32, 18), 0.4, 6), shade(wcol, -0.06));
      L.add(wf.out());
      return L;
    },
    update(time) {
      pose(sunEl, { x: sunAt[0], y: sunAt[1], r: time ? Math.sin(time * 0.6) : 0 });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + (time ? Math.sin(time * 0.1 + cl.i) * 20 : 0), y: cl.y, r: time ? Math.sin(time * 0.6 + cl.i) * 1.2 : 0 }));
    },
  };
}

/* ================================================================== the two crowds at the gate of Nain */
export const NP = { JX: 640, BX: 860, BY: 606, BW: 180, WX: 1085, DIS: [548, 462, 380] };
export const MOURN = [
  { robe: mix(C.storm, C.stone2, 0.55), hairStyle: 'veil', veil: mix(C.storm2, C.stone2, 0.4), veil2: mix(C.storm2, C.stone2, 0.2), skin: C.skin3, hair: C.hair3, beard: 'none' },
  { robe: mix(C.plumRobe, C.stone2, 0.5), hairStyle: 'veil', veil: mix(C.storm, C.stone2, 0.5), skin: C.skin2, hair: C.hair, beard: 'none' },
  { robe: mix(C.stone2, C.soil, 0.25), hairStyle: 'wrap', veil: C.stone2, skin: C.skin4, hair: C.hair3, beard: 'full' },
  { robe: mix(C.dustyBlue, C.stone2, 0.5), hairStyle: 'short', skin: C.skin2, hair: C.hair2, beard: 'short' },
];
/** a still group of mourners for a sprite: wailing women with raised arms, a man with a flute (centred on 0, 0) */
export function mournerGroup(c, n, { s = 0.86, seed = 0, pose: P = 'stand', arms = 'wail' } = {}) {
  const mem = [];
  for (let i = 0; i < n; i++) {
    const o = { ...MOURN[(i + seed) % MOURN.length] };
    const r = i % 2;
    const piper = arms === 'wail' && (i + seed) % 4 === 3;
    const aF = arms === 'wail' ? (piper ? 70 : 150) : arms === 'fear' ? 148 : arms === 'praise' ? 30 : 20;
    const aB = arms === 'wail' ? (piper ? 60 : 30) : arms === 'fear' ? 40 : arms === 'praise' ? 165 : 10;
    const hd = arms === 'wail' ? 14 : arms === 'fear' ? 24 : arms === 'praise' ? -18 : 0;
    mem.push({ x: -120 + i * 46 + (r ? 18 : 0) + c.rr(-5, 5), y: r * 20, s: s * c.rr(0.94, 1.04), flip: true, head: hd, armF: aF, armB: aB, o: { ...o, pose: P, holdF: piper ? `<g transform="rotate(-70)">${fluteM(c)}</g>` : '' } });
  }
  return pose3(c, mem);
}
function fluteM(c) { return sheet().p(c.ribbon([[-6, 0], [30, 18]], 3.2) + c.ribbon([[-6, 2], [28, 26]], 3), C.wood3).out(); }
/** a still group of townsfolk facing right or left (centred on 0, 0); arms: 'walk' | 'fear' | 'praise' */
export function folkGroup(c, n, { s = 0.86, flip = false, pose: P = 'stand', arms = 'walk' } = {}) {
  const mem = [];
  for (let i = 0; i < n; i++) {
    const o = crowdPerson(c);
    const r = i % 2;
    const aF = arms === 'fear' ? 148 : arms === 'praise' ? 30 : c.rr(0, 24);
    const aB = arms === 'fear' ? 40 : arms === 'praise' ? 160 + c.rr(-10, 8) : 10;
    const hd = arms === 'fear' ? 24 : arms === 'praise' ? -18 : c.rr(-4, 4);
    mem.push({ x: -130 + i * 44 + (r ? 18 : 0) + c.rr(-4, 4), y: r * 20, s: s * c.rr(0.94, 1.05), flip, head: hd, armF: aF, armB: aB, o: { ...o, pose: P } });
  }
  return pose3(c, mem);
}

/* ================================================================== the teaching slope, with flats */
export const TS = { GY: 742, JX: 800, FX: 800, FY: 330, FW: 400, FH: 240, K: 1.25 };
/**
 * Jesus teaching the crowds on the green slope by the lake (Matthew 11's hills). People sit and stand on both
 * sides (sprites); painted flats come down above His head (layer FL, with `bits` for the pieces that move on them).
 * Returns { H, c, FL, bits, crowdL, P, W, jesus, voice, left, right, update(t, T) }.
 */
export function teachSet(S, { skyCols = DAYM, crowds = true, johnCameo = false } = {}) {
  const H = hillsSetM(S, { gy: 700, skyCols, sunAt: [1330, 110] });
  const c = S.c;
  const FL = S.layer({ par: 0.3, sh: 6 });
  const bits = S.layer({ par: 0.3, sh: 5 });
  const crowdL = S.layer({ par: 0.5, sh: 4 });
  let left = null, right = null;
  if (crowds) {
    left = crowdL.sprite(folkGroup(makeCutter('lk7-ts-l'), 7, { s: 0.84 }), 420, TS.GY - 4);
    right = crowdL.sprite(folkGroup(makeCutter('lk7-ts-r'), 7, { s: 0.84, flip: true }), 1180, TS.GY - 4);
  }
  const P = S.layer({ par: 0.5, sh: 5 });
  const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
  const voice = voiceRingsM(P, c, { n: 3, color: C.sun, r: 34, w: 5 });
  const W = S.layer({ par: 0.52, sh: 3 });
  let jc = null;
  if (johnCameo) {
    const jcut = makeCutter('lk7-john-cameo');
    const id = S.id('jcam');
    const bust = `<g transform="translate(-2 80) scale(.56)">${person(jcut, { robe: '#b98f63', fur: true, belt: C.leather, hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin3 })}</g>`;
    jc = S.layer({ par: 0.2, sh: 6 }).add(`<g opacity="0">${hang2M(`${cameoM(jcut, `<clipPath id="${id}"><circle r="46"/></clipPath><g clip-path="url(#${id})">${bust}</g>`, { r: 48 })}<g transform="translate(0 70)"><path d="M-50 -12L50 -13L51 13L-50 14Z" fill="${C.cream}"/><text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${tr('Jan Chrzciciel', 'John the Baptist')}</text></g>`, 0.01, 300)}</g>`);
  }
  return {
    H, c, FL, bits, crowdL, P, W, jesus, voice, left, right, jc,
    update(t, T, { crowdY = 0 } = {}) {
      H.update(T);
      if (left) left.set({ x: 420, y: TS.GY - 4 + crowdY });
      if (right) right.set({ x: 1180, y: TS.GY - 4 + crowdY });
    },
  };
}
/** where a flat hangs: k 0 → up in the flies, 1 → in place; returns its y (use Y(dy) for pieces on it) */
export function flatY(k) { return lerp(-1500, TS.FY, k); }

/* ================================================================== the house of Simon the Pharisee */
export const SH = { FLOOR: 700, CEIL: 200, JX: 780, TOP: 628, SEAT: 652, TX0: 860, TX1: 1130, SX: 1168, GUESTS: [912, 994, 1076], FEETX: 628, WX: 560, GATE: [300, 450, 400] };
/**
 * Simon's house: an open dining court. Behind, a colonnade on the evening sky; on the left the gateway to the street
 * (the woman comes in there); lamps on chains; a stone floor with a rug; the low table with the dishes on the right.
 * Layers returned so a scene can put people between them: { sk, sk2, backL, tableL, frontL, fx, glowL }.
 * update(t, T, { lit }) flickers the lamps.
 */
export function simonHouse(S, { skyCols = SUPPER, sky2 = SUPPER2 } = {}) {
  const c = makeCutter('lk7-simon-house');
  const { FLOOR, CEIL, TOP } = SH;
  const [G0, G1, GT] = SH.GATE;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2', rise: 0 }).layer : null;
  if (sk2) sk2.fade(0);
  // the town roofs over the colonnade
  const view = S.layer({ par: 0.12, sh: 2 });
  let hs = '';
  for (let i = 0; i < 16; i++) { const x = -300 + i * 130 + c.rr(-20, 20); hs += house(c, x, 470 + c.rr(-6, 10), c.rr(60, 110), c.rr(50, 90), { stairs: false, wall: mix(C.plaster, C.dusk, 0.25), shadow: mix(C.plaster2, C.duskViolet, 0.3) }); }
  view.add(hs + cypress(c, 700, 470, 120, mix(C.moss2, C.duskViolet, 0.3)) + cypress(c, 1330, 470, 100, mix(C.moss2, C.duskViolet, 0.3)));
  // the back wall with its arcade
  const wallL = S.layer({ par: 0.3, sh: 3 });
  const wcol = mix(C.plaster, C.sand, 0.2);
  const w = sheet();
  const arches = [];
  for (let x = 470; x < 1400; x += 190) arches.push([[x, 470], [x, 330], ...c.arc(x + 65, 330, 65, 56, PI, 2 * PI, 12), [x + 130, 470]]);
  // the gateway on the left (to the street): a hole in the wall, the evening street showing through it
  const gate = [[G0, FLOOR + 6], [G0, GT], ...c.arc((G0 + G1) / 2, GT, (G1 - G0) / 2, 60, PI, 2 * PI, 12), [G1, FLOOR + 6]];
  const street = sheet();
  street.p(c.cut(c.rect(G0 - 10, GT - 70, G1 - G0 + 20, FLOOR - GT + 80), 0.3, 6), mix(C.dusk, C.plaster, 0.45));
  street.p(c.cut([[G0 - 10, FLOOR - 60], [G0 + 30, FLOOR - 150], [G0 + 90, FLOOR - 130], [G1 - 10, FLOOR - 170], [G1 + 10, FLOOR - 160], [G1 + 10, FLOOR + 6], [G0 - 10, FLOOR + 6]], 0.5, 6), mix(C.plaster2, C.duskViolet, 0.35));
  street.p(c.cut(c.rect(G0 - 10, FLOOR - 36, G1 - G0 + 20, 42), 0.4, 6), mix(C.sand, C.dusk, 0.3));
  wallL.add(street.out());
  w.p(c.cut([[-900, CEIL - 20], [2500, CEIL - 20], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + arches.map((a) => c.hole(a, 0.5, 6)).join('') + c.hole(gate, 0.5, 6), wcol);
  let blot = '';
  for (let i = 0; i < 10; i++) blot += c.cut(c.blob(c.rr(-200, 1800), c.rr(CEIL + 40, FLOOR - 60), c.rr(24, 60), c.rr(10, 22), 10, 0.2), 0.8, 6);
  w.x(blot, shade(wcol, -0.06), 'opacity=".5"');
  w.p(arches.map((a) => c.ribbon(a.slice(1, -1), 9)).join(''), shade(wcol, -0.12));
  w.p(c.ribbon(gate.slice(1, -1), 14), C.wood2);
  w.p(c.cut(c.rect(G1 + 7, 470, 2500 - G1, 16), 0.5, 20) + c.cut(c.rect(-900, 470, G0 - 907, 16), 0.5, 10), shade(wcol, -0.1));
  // a painted band with a meander under the ceiling
  w.p(c.cut(c.rect(-900, CEIL - 20, 3400, 34), 0.5, 20), shade(C.indigo, 0.3));
  let mz = '';
  for (let x = -880; x < 2500; x += 36) mz += c.poly([[x, CEIL - 6], [x + 18, CEIL - 6], [x + 18, CEIL + 4], [x + 8, CEIL + 4], [x + 8, CEIL], [x, CEIL]]);
  w.x(mz, C.sun, 'opacity=".8"');
  w.p(c.cut([[-900, -1400], [2500, -1400], [2500, CEIL - 20], [-900, CEIL - 20]], 0.8, 30), mix(C.wood3, C.plaster2, 0.45));
  let beams = '';
  for (let x = -300; x < 1900; x += 120) beams += c.cut(c.rect(x, CEIL - 30, 26, 24), 0.3, 5);
  w.p(beams, mix(C.wood, C.wood3, 0.3));
  let planks = '';
  for (let y = CEIL - 60; y > -1400; y -= 46) planks += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 2);
  w.x(planks, mix(C.wood2, C.wood3, 0.5), 'opacity=".45"');
  // a niche with jars on the right
  w.p(c.cut([[1420, 640], [1420, 560], ...c.arc(1460, 560, 40, 30, PI, 2 * PI, 8), [1500, 640]], 0.4, 5), shade(wcol, -0.14));
  wallL.add(w.out());
  // lamps on chains (the lamp hangs still; its glow and its flame are separate small pieces)
  const lampL = S.layer({ par: 0.34, sh: 3 });
  const lamps = [[640, 290], [1000, 270], [1300, 290]].map(([x, y], i) => {
    const gl = lampL.add(`<g><circle cy="30" r="130" fill="url(#warm-glow)" opacity=".8"/></g>`);
    hanging(lampL, `<g transform="translate(-20 0)">${hangLampM(c)}</g>`, { x, y, len: 120 });
    const fl = lampL.add(`<g><path d="M0 0C-6 -4 -5 -12 0 -20C5 -12 6 -4 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2 -5 -2 -9 0 -12C2 -9 2 -5 0 -2Z" fill="#fff4d2"/></g>`);
    return { x, y, i, fl, gl };
  });
  // the floor and a rug
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR - 4], [2500, FLOOR - 4], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone, C.sand2, 0.35));
  let tiles = '';
  for (let r = 0; r < 7; r++) { const y = FLOOR + 10 + r * r * 8 + r * 14; tiles += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.3); }
  for (let x = -900; x < 2500; x += 90) tiles += c.ribbon([[x, FLOOR], [x + (x - 800) * 0.5, 1100]], 1.2);
  fl.x(tiles, shade(C.stone2, -0.15), 'opacity=".4"');
  fl.p(c.cut([[820, FLOOR + 8], [1340, FLOOR + 8], [1420, FLOOR + 110], [760, FLOOR + 110]], 0.8, 12), mix(C.teal2, C.indigo, 0.3));
  let dia = '';
  for (let x = 840; x < 1360; x += 40) dia += c.poly([[x, FLOOR + 60], [x + 9, FLOOR + 49], [x + 18, FLOOR + 60], [x + 9, FLOOR + 71]]);
  fl.x(dia, C.sun, 'opacity=".75"');
  floorL.add(fl.out());
  const glowL = S.layer({ par: 0.42, sh: 0, flat: true });
  glowL.add(`<ellipse cx="900" cy="520" rx="640" ry="340" fill="url(#warm-glow)" opacity=".55"/>`);
  const backL = S.layer({ par: 0.46, sh: 4 });
  const tableL = S.layer({ par: 0.48, sh: 5 });
  const t = sheet();
  t.p(c.cut([[SH.TX0 - 10, TOP], [SH.TX1 + 10, TOP - 2], [SH.TX1 + 4, TOP + 16], [SH.TX0 - 4, TOP + 18]], 0.5, 8), C.wood);
  t.p(c.cut([[SH.TX0 - 16, TOP - 6], [SH.TX1 + 16, TOP - 8], [SH.TX1 + 22, TOP + 30], [SH.TX1 - 30, TOP + 40], [SH.TX0 + 30, TOP + 42], [SH.TX0 - 22, TOP + 32]], 0.7, 8), C.linen);
  t.x(c.ribbon([[SH.TX0 - 10, TOP + 26], [SH.TX1 + 10, TOP + 24]], 5), C.indigo, 'opacity=".6"');
  t.p(c.cut(c.rect(SH.TX0 + 10, TOP + 30, 16, FLOOR - TOP - 30), 0.3, 5) + c.cut(c.rect(SH.TX1 - 26, TOP + 30, 16, FLOOR - TOP - 30), 0.3, 5), C.wood2);
  tableL.add(t.out());
  const frontL = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.5, sh: 3 });
  return {
    c, sk, sk2, view, wallL, lampL, floorL, glowL, backL, tableL, frontL, fx,
    update(t, time, { lit = 1 } = {}) {
      lamps.forEach((l) => {
        const k = 1 + (time ? Math.sin(time * 9 + l.i * 2) * 0.08 : 0);
        pose(l.fl, { x: l.x + 20, y: l.y + 36, sx: 1 / k, sy: k * Math.max(0.05, lit), o: lit });
        pose(l.gl, { x: l.x - 20, y: l.y, s: 0.6 + lit * 0.4, o: lit * 0.85 });
      });
    },
  };
}
/** the low dining couch Jesus reclines on: a wooden platform with a pale pad (origin: floor, right end at x 0) */
export function couch(c, w = 260) {
  const s = sheet();
  s.p(c.cut([[-w, 12], [-w, -2], [6, -2], [6, 12]], 0.4, 8), C.wood2);
  s.p(c.cut(c.rect(-w + 6, 12, 10, 8), 0.3, 4) + c.cut(c.rect(-8, 12, 10, 8), 0.3, 4), shade(C.wood2, -0.2));
  s.p(c.cut([[-w - 4, -2], [-w + 2, -10], [8, -10], [10, -2]], 0.4, 8), mix(C.linen2, C.sand, 0.35));
  s.x(c.ribbon([[-w + 4, -6], [4, -6]], 1.4), C.ochre, 'opacity=".7"');
  return s.out();
}

/**
 * Simon's dining court with everyone in place: the guests behind the table, Simon on his cushion at the far end,
 * Jesus reclining on the couch at the near end (sitting, His legs stretched back along the couch towards the
 * gateway), and the woman in three cut-outs (standing with the flask; kneeling veiled; kneeling with her hair let
 * down) plus the flask itself. Returns handles; the scene positions them (SIMON_AT, FEET_AT…).
 */
export const SR7 = { SX: 1172, FEETX: SH.JX - 142, FEETY: SH.FLOOR - 12, WX: 560 };
export function simonRoom(S, opts = {}) {
  const c = S.c;
  const R = simonHouse(S, opts);
  const { FLOOR, JX, SEAT, TOP } = SH;
  const guests = GUESTS.map((o, i) => ({ i, x: SH.GUESTS[i], p: S.puppet(R.backL.add(person(c, { ...o, pose: 'sit' }))), seed: c.rr(0, 9) }));
  [[884, bowlM(c, { food: 'bread', color: C.stone2 })], [930, cupM(c)], [968, loafM(c, 15)], [1016, bowlM(c, { food: 'fruit', color: C.skyVeil })], [1056, cupM(c, C.clay)], [1090, loafM(c, 12)], [1118, `<g transform="scale(.5)">${jugM(c)}</g>`]]
    .forEach(([x, m]) => R.tableL.add(`<g transform="translate(${x} ${TOP - 4})">${m}</g>`));
  R.frontL.add(`<g transform="translate(${JX + 44} ${FLOOR + 2})">${couch(c, 270)}</g>`);
  R.frontL.add(`<g transform="translate(${SR7.SX} ${FLOOR + 2})">${cushionJ(c, 130, C.teal2)}</g>`);
  const legs = R.frontL.add(`<g>${outLegsJ(c, { robe: C.linen, skin: C.skin })}</g>`);
  const sheen = legs.querySelector('.sheen');
  const jesus = S.puppet(R.frontL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
  const simon = S.puppet(R.frontL.add(person(c, { ...SIMON, pose: 'sit' })));
  const AB = alabasterM(c, 40);
  const flaskM = `${AB.body}<g transform="translate(0 ${-AB.h})">${AB.neck}</g>`;
  const wStand = S.puppet(R.frontL.add(person(c, SINNER)));
  const wKneel = S.puppet(R.frontL.add(person(c, { ...SINNER, pose: 'kneel' })));
  const wHair = S.puppet(R.frontL.add(sinnerHair(c, 'kneel')));
  const hairEl = wHair.el.querySelector('.lhair');
  const flask = R.frontL.add(`<g>${flaskM}</g>`);
  return {
    R, c, guests, jesus, legs, sheen, simon, wStand, wKneel, wHair, hairEl, flask, AB,
    /** the everyday pose of the table (guests and Simon) */
    table(t, T, { look = 0, simonArmF = 30, simonArmB = 10, simonHead = 4, simonLean = 0 } = {}) {
      guests.forEach((g) => g.p.set({ x: g.x, y: SEAT, s: 0.9, flip: true, armF: 20, armB: 10, head: -4 + look * (g.i === 1 ? -8 : 6), blink: blinkAt(T, g.seed) }));
      simon.set({ x: SR7.SX, y: FLOOR, s: 0.96, flip: true, armF: simonArmF, armB: simonArmB, head: simonHead, lean: simonLean, blink: blinkAt(T, 3) });
    },
  };
}

/** Simon's house from the street, as one drop (sky, town, the wall with its fine gateway, the street) that flies up
 *  to show the courtyard; origin world. The gateway is at x 700–880. */
export function simonFacade(S, { skyCols = SUPPER } = {}) {
  const c = makeCutter('lk7-simon-front');
  const s = sheet();
  const gid = S.id('sfsky');
  S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="-600" x2="0" y2="560"><stop offset="0" stop-color="${skyCols[0]}"/><stop offset=".6" stop-color="${skyCols[1]}"/><stop offset="1" stop-color="${skyCols[2]}"/></linearGradient>`);
  s.raw(`<rect x="-1400" y="-3000" width="4400" height="3600" fill="url(#${gid})"/>`);
  let hs = '';
  for (let i = 0; i < 14; i++) { const x = -500 + i * 190 + c.rr(-20, 20); hs += house(c, x, 470 + c.rr(-10, 10), c.rr(80, 130), c.rr(60, 100), { stairs: false, wall: mix(C.plaster, C.dusk, 0.3), shadow: mix(C.plaster2, C.duskViolet, 0.35) }); }
  s.raw(hs);
  s.p(c.cut([[-1400, 600], [3000, 600], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.35));
  let cob = '';
  for (let i = 0; i < 70; i++) cob += c.cut(c.blob(c.rr(-600, 2200), c.rr(630, 1000), c.rr(10, 22), c.rr(5, 9), 8, 0.2), 0.3, 4);
  s.x(cob, C.stone2, 'opacity=".55"');
  // the long wall of the house, with a cornice and a painted band
  const x0 = 380, x1 = 1320, top = 350, base = 660;
  s.p(c.cut(c.rect(x0, top, x1 - x0, base - top), 0.6, 10), mix(C.plaster, C.sand, 0.2));
  s.p(c.cut(c.rect(x0 - 14, top - 18, x1 - x0 + 28, 20), 0.4, 8), shade(C.indigo, 0.3));
  let mz = '';
  for (let x = x0; x < x1; x += 36) mz += c.poly([[x, top - 12], [x + 18, top - 12], [x + 18, top - 2], [x + 8, top - 2], [x + 8, top - 6], [x, top - 6]]);
  s.x(mz, C.sun, 'opacity=".8"');
  // the gateway: pilasters, an arch, a closed-looking dark passage (with a lamp)
  const gate = [[720, base], [720, 500], ...c.arc(790, 500, 70, 60, PI, 2 * PI, 12), [860, base]];
  s.p(c.cut(gate, 0.4, 6), mix(C.soilDark, C.plumRobe, 0.2));
  s.p(c.ribbon(gate.slice(1, -1), 14) + c.cut(c.rect(690, 420, 22, base - 420), 0.3, 6) + c.cut(c.rect(868, 420, 22, base - 420), 0.3, 6), C.stone);
  s.p(c.cut(c.rect(680, 400, 220, 22), 0.4, 6), shade(C.stone, 0.1));
  // windows with grilles, a potted palm by the gate
  [470, 560, 1030, 1120, 1220].forEach((x) => { s.p(c.cut(c.rect(x, 430, 44, 56), 0.3, 5), C.soilDark); s.x(c.ribbon([[x + 22, 432], [x + 22, 484]], 3) + c.ribbon([[x + 2, 458], [x + 42, 458]], 3), C.wood2); });
  s.p(c.cut([[932, base], [926, base - 40], [966, base - 40], [960, base]], 0.3, 4), C.pot);
  s.p(c.cut(c.blob(946, base - 70, 30, 30, 10, 0.3), 0.8, 5), C.moss);
  return s.out() + `<circle cx="790" cy="470" r="60" fill="url(#warm-glow)" opacity=".7"/>` + sheet().p(c.cut([[782, 480], [798, 480], [794, 492], [786, 492]], 0.2, 3), C.sun).out();
}

/** a hanging lamp whose glow can be dimmed (.lglow) */
function hangLampM(c) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [-22, 30]], 1.2) + c.ribbon([[0, 0], [22, 30]], 1.2), shade(C.wood2, -0.2));
  s.p(c.cut([[-34, 32], [34, 32], [44, 38], [30, 48], [-24, 50], [-44, 42]], 0.4, 5), mix(C.sun, C.pot, 0.4));
  s.x(c.ribbon([[-30, 40], [30, 40]], 1.6), shade(C.sun, 0.3), 'opacity=".6"');
  return s.out();
}

/* ================================================================== the teaching slope */
/**
 * Jesus teaching the crowds on a green slope above the lake (Matthew 11's hills), with people sitting and standing
 * on both sides as sprites. Painted flats come down above His head. Returns the hills handles + jesus puppet layer.
 */
export function crowdSprites(S, L, { y = 742, left = 'lk7-cl', right = 'lk7-cr', n = 7, s = 0.86 } = {}) {
  const a = L.sprite(pose3(makeCutter(left), Array.from({ length: n }, (_, i) => {
    const cc = makeCutter(left + i);
    const r = i % 2;
    return { x: -200 + i * 52 + (r ? 20 : 0), y: r * 24, s: s * (1 + r * 0.05), flip: false, head: -4, armF: cc.rr(0, 20), o: { ...crowdPerson(cc), pose: i % 3 === 2 ? 'sit' : 'stand' } };
  })), 380, y);
  const b = L.sprite(pose3(makeCutter(right), Array.from({ length: n }, (_, i) => {
    const cc = makeCutter(right + i);
    const r = i % 2;
    return { x: -200 + i * 52 + (r ? 20 : 0), y: r * 24, s: s * (1 + r * 0.05), flip: true, head: -4, armF: cc.rr(0, 20), o: { ...crowdPerson(cc), pose: i % 3 === 1 ? 'sit' : 'stand' } };
  })), 1220, y);
  return [a, b];
}
