// Mark 14 — the cast and cut-outs of the Passion: the chief priests and the high priest, the woman of
// Bethany and her alabaster jar, the upper room, the olive garden at night, the high priest's palace
// (hall above, courtyard below), torches, swords, a rooster, a cup of light, and a few more.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, lerp } from '../kit.js';
import { band, hillsWith, olive, cypress, rock, moon, stars, grass, bush } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { addToHead, addToBody, turban, breastplate, lowTable, bowl, loaf, cup, grapes } from '../mark2/lib.js';
import { LOOK as LOOK3, TWELVE as T12, withFace, faceBits } from '../mark3/lib.js';
import { LEPER_HEALED, walledCity } from '../mark1/lib.js';

export {
  kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, coin, coinStack, lowTable, bowl, loaf, cup,
  candle, scrollOpen, scrollRolled, wordSlip, plateDisc, grapes, dust,
} from '../mark2/lib.js';
export { withFace, faceBits, tornPair, nameTag, bubble, strip, question, shadowPerson, silhouette } from '../mark3/lib.js';
export { loafHalves, say, tag, heavenPanel, glory, globe, soulLight, bigQuestion } from '../mark8/lib.js';
export { hourglassParts, voiceRings, hang2, sparkle, flame, signpost } from '../mark1/lib.js';
export { sheep, storyFrame, SEPIA } from '../mark6/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== the cast */

/** the Twelve as in chapter 3 (same looks), keyed by name */
export const LOOK = {
  ...LOOK3,
  simon: LEPER_HEALED,                                                     // Simon "the leper", healed — the host at Bethany
  woman: { robe: C.roseRobe, mantle: C.lavender, hairStyle: 'veil', veil: C.lavender, veil2: shade(C.lavender, -0.12), skin: C.skin, hair: C.hair2, beard: 'none' },
  maid: { robe: C.ochreRobe, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, skin: C.skin2, hair: C.hair3, beard: 'none', belt: C.terracotta },
  youth: { robe: C.linen, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2 },
  waterman: { robe: C.sageRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3, belt: C.rope },
  host: { robe: C.wheatRobe, mantle: C.tealRobe, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather },
  servant: { robe: C.stone2, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather }, // the high priest's servant
};
/** the Twelve's options in Mark's order (Peter, James, John, Andrew, Philip, Bartholomew, Matthew, Thomas, James A., Thaddaeus, Simon Z., Judas) */
export const TW = Object.fromEntries(T12.map((m) => [m.k, m.o]));
export const JESUS = CAST.jesus;

/* chief priests: linen robe, a coloured mantle, gold sash, white turban; the high priest wears the breastplate */
const PR_MANTLE = [shade(C.indigo, 0.25), C.plumRobe, shade(C.teal2, 0.1), C.mauve, shade(C.plumRobe, -0.2)];
export function priestOpts(i = 0, extra = {}) {
  return {
    robe: C.linen, mantle: PR_MANTLE[i % PR_MANTLE.length], belt: C.sun, skin: [C.skin2, C.skin, C.skin3][i % 3], hair: C.greyHair, hairStyle: 'short',
    beard: i % 2 ? 'wild' : 'full', beardColor: [C.greyHair, C.hair3, C.hair2][i % 3], ...extra,
  };
}
export function priest(c, i = 0, extra = {}) { return addToHead(person(c, priestOpts(i, extra)), turban(c)); }
/** the high priest (Caiaphas): dark blue mantle over linen, breastplate, white turban */
export const HP = { robe: C.linen, mantle: shade(C.indigo, 0.12), belt: C.sun, skin: C.skin2, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair };
export function highPriest(c, extra = {}) {
  return addToHead(addToBody(person(c, { ...HP, ...extra }), breastplate(c)), turban(c));
}
/** a scribe / elder: pale robe, dark prayer mantle, head wrap */
const SCR = [
  { robe: C.stone, mantle: C.teal2, veil: C.linen, hair: C.greyHair, beard: 'full', skin: C.skin2 },
  { robe: C.linen2, mantle: shade(C.dustyBlue, -0.25), veil: C.stone, hair: C.hair3, beard: 'full', skin: C.skin3 },
  { robe: C.parchment, mantle: shade(C.plumRobe, -0.2), veil: C.linen2, hair: C.greyHair, beard: 'wild', beardColor: C.greyHair, skin: C.skin },
  { robe: C.stone2, mantle: C.wood3, veil: C.linen, hair: C.greyHair, beard: 'wild', beardColor: C.greyHair, skin: C.skin4 },
];
export function scribeOpts(i = 0, extra = {}) { return { ...SCR[i % SCR.length], hairStyle: 'wrap', belt: null, ...extra }; }
export function scribe(c, i = 0, extra = {}) { return person(c, scribeOpts(i, extra)); }
/** a temple guard / a man of the mob: plain tunic, leather belt, head cloth */
export function guardOpts(c, extra = {}) {
  return {
    robe: c.pick([mix(C.storm, C.stone2, 0.4), mix(C.wood3, C.storm, 0.35), mix(C.clay, C.storm, 0.3), mix(C.sageRobe, C.storm, 0.4)]), mantle: c.chance(0.4) ? shade(C.leather, 0.15) : null,
    hair: c.pick([C.hair, C.hair3]), hairStyle: c.pick(['wrap', 'short', 'curly']), veil: c.pick([C.stone2, mix(C.clay, C.stone, 0.5)]), beard: c.pick(['short', 'full']),
    skin: c.pick([C.skin2, C.skin3, C.skin4]), belt: C.leather, ...extra,
  };
}
/** a man from the crowd (never veiled) */
export function man(c, extra = {}) {
  const o = crowdPerson(c, extra);
  if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = c.pick(['short', 'full']); }
  return o;
}

/* ================================================================== small props */

/** the alabaster flask of nard: { body, neck } — body origin at its base; neck origin at the break line (y=0 of the neck = top of the body) */
export function alabaster(c, h = 46) {
  const k = h / 46;
  const white = mix(C.cream, C.linen, 0.5), vein = shade(C.stone2, -0.05);
  const b = sheet();
  b.p(c.cut([[-7 * k, 0], [-13 * k, -8 * k], [-15 * k, -22 * k], [-11 * k, -34 * k], [-5 * k, -38 * k], [5 * k, -38 * k], [11 * k, -34 * k], [15 * k, -22 * k], [13 * k, -8 * k], [7 * k, 0]], 0.3, 4), white);
  b.x(c.ribbon(c.qbez([-9 * k, -8 * k], [-2 * k, -20 * k], [-8 * k, -32 * k], 8), 1.1) + c.ribbon(c.qbez([6 * k, -6 * k], [10 * k, -16 * k], [4 * k, -28 * k], 8), 0.9), vein, 'opacity=".7"');
  b.x(c.poly(c.ell(-6 * k, -24 * k, 2.4 * k, 7 * k, 8)), '#fff', 'opacity=".6"');
  const n = sheet();
  n.p(c.cut([[-5 * k, 0], [-4 * k, -9 * k], [-7 * k, -11 * k], [-7 * k, -14 * k], [7 * k, -14 * k], [7 * k, -11 * k], [4 * k, -9 * k], [5 * k, 0]], 0.25, 3), white);
  n.p(c.cut(c.rect(-4 * k, -19 * k, 8 * k, 5 * k), 0.2, 3), C.wood3);
  return { body: b.out(), neck: n.out(), h: 38 * k };
}
/** the scent of nard: a soft golden glow with wavy wisps rising from it (origin at the base of the wisps; ~ r wide, 1.5 r tall) */
export function nardMist(c, r = 60, { glow = true, n = 5 } = {}) {
  let d = '', d2 = '', dots = '';
  for (let i = 0; i < n; i++) {
    const x0 = (i - (n - 1) / 2) * r * 0.32 + c.rr(-4, 4), h = r * c.rr(1.1, 1.6), ph = c.rr(0, 6);
    const pts = [];
    for (let j = 0; j <= 14; j++) { const u = j / 14; pts.push([x0 + Math.sin(u * 7 + ph) * r * 0.1 * (0.4 + u), -u * h]); }
    const rib = c.ribbon(pts, (u) => 0.8 + Math.sin(u * PI) * r * 0.07);
    if (i % 2) d += rib; else d2 += rib;
    dots += c.poly(c.circ(x0 + c.rr(-10, 10), -h - c.rr(4, 14), c.rr(1.6, 3), 6));
  }
  return (glow ? `<circle cy="${-r * 0.5}" r="${r * 1.3}" fill="url(#warm-glow)" opacity=".7"/>` : '') + `<path d="${d2}" fill="#f5d99a" opacity=".85"/><path d="${d}" fill="#fff3d4" opacity=".9"/><path d="${dots}" fill="#fff3d4" opacity=".9"/>`;
}
/** a soft vignette over the whole stage: warm light around (cx, cy), darker edges (add to a flat layer) */
export function vignette(S, { cx = 800, cy = 520, r = 760, col = '#2a1c30', o = 0.45 } = {}) {
  const id = S.id('vig');
  S.defs(`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".55" stop-color="${col}" stop-opacity="${(o * 0.35).toFixed(2)}"/><stop offset="1" stop-color="${col}" stop-opacity="${o}"/></radialGradient>`);
  return `<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${id})"/>`;
}
/** a flat unleavened loaf (matzah), seen side-on (origin: bottom centre) */
export function matzah(c, r = 22) {
  const s = sheet();
  s.p(c.cut([[-r, 0], [-r + 2, -6], [r - 2, -7], [r, 0]], 0.5, 4), C.wheat);
  let dots = '';
  for (let x = -r + 6; x < r - 4; x += 7) dots += c.poly(c.circ(x, -3.2, 1.1, 5));
  s.x(dots, shade(C.wheat2, -0.25), 'opacity=".8"');
  return s.out();
}
/** a round matzah seen from the front (origin centre) */
export function matzahRound(c, r = 26) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 26), 0.8, 4), C.wheat);
  let dots = '';
  for (let i = 0; i < 18; i++) { const a = c.rr(0, PI * 2), rr = c.rr(0, r * 0.8); dots += c.poly(c.circ(Math.cos(a) * rr, Math.sin(a) * rr, 1.3, 5)); }
  s.x(dots, shade(C.wheat2, -0.3), 'opacity=".75"');
  s.x(c.poly(c.ell(-r * 0.3, -r * 0.3, r * 0.3, r * 0.14, 10, -0.6)), shade(C.sun, -0.2), 'opacity=".35"');
  return s.out();
}
/** a golden cup; origin at its foot; `dark` wine surface (or a light surface) */
export function chalice(c, h = 60, { dark = true } = {}) {
  const k = h / 70;
  const s = sheet();
  s.p(c.cut([[-22 * k, 0], [-14 * k, -8 * k], [-4 * k, -10 * k], [-4 * k, -34 * k], [-24 * k, -46 * k], [-28 * k, -70 * k], [28 * k, -70 * k], [24 * k, -46 * k], [4 * k, -34 * k], [4 * k, -10 * k], [14 * k, -8 * k], [22 * k, 0]], 0.4, 5), C.sun);
  s.x(c.cut(c.ell(0, -69 * k, 26 * k, 5 * k, 14), 0.2, 3), dark ? mix(C.plumRobe, C.terracotta, 0.35) : C.star);
  s.x(c.ribbon([[-18 * k, -60 * k], [-14 * k, -46 * k]], 3 * k), '#fff8e0', 'opacity=".7"');
  s.x(c.ribbon([[-26 * k, -58 * k], [26 * k, -58 * k]], 2.2 * k), shade(C.sun, -0.25), 'opacity=".5"');
  return s.out();
}
/** a cup made of light (Gethsemane): soft glow, rays and a gold cup (origin: centre of the cup) */
export function cupOfLight(c, r = 70) {
  let d = '';
  for (let i = 0; i < 14; i++) { const a = (i / 14) * PI * 2, w = 0.06; d += c.poly([[Math.cos(a - w) * 30, Math.sin(a - w) * 30], [Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7], [Math.cos(a + w) * 30, Math.sin(a + w) * 30]]); }
  return `<circle class="glow" r="${r * 1.9}" fill="url(#halo-glow)"/><path class="rays" d="${d}" fill="#fff4d0" opacity=".55"/><g transform="translate(0 32)">${chalice(c, 64, { dark: false })}</g>`;
}
/** coin purse (origin: the neck; hangs down) */
export function purse(c, { col = C.leather } = {}) {
  const s = sheet();
  s.p(c.cut([[-6, 0], [6, 0], [10, 8], [22, 18], [26, 34], [18, 46], [-18, 46], [-26, 34], [-22, 18], [-10, 8]], 0.5, 4), col);
  s.p(c.ribbon([[-8, 5], [8, 5]], 3.4), C.rope);
  s.x(c.ribbon(c.arc(0, 30, 14, 8, 0.4, PI - 0.4, 6), 1.2), shade(col, 0.3), 'opacity=".6"');
  s.x(c.ribbon(c.qbez([4, 2], [14, -10], [8, -16], 6), 1.6), C.rope);
  return s.out();
}
/** a burning torch held upright: origin at the grip; .flame and .glow animatable */
export function torch(c, len = 70) {
  const s = sheet();
  s.p(c.cut([[-3, 20], [3, 20], [4, -len], [-4, -len]], 0.3, 6), C.wood2);
  s.p(c.cut([[-7, -len], [7, -len], [6, -len - 12], [-6, -len - 12]], 0.3, 4), mix(C.rope, C.soilDark, 0.4));
  return `<circle class="glow" cx="0" cy="${-len - 30}" r="120" fill="url(#warm-glow)" opacity=".9"/>${s.out()}<g class="flame" transform="translate(0 ${-len - 10})"><path d="M0 0C-12 -8 -10 -26 0 -44C4 -30 14 -26 10 -10C8 -4 4 0 0 0Z" fill="${C.sunDeep}"/><path d="M0 -2C-7 -8 -6 -20 0 -32C5 -20 7 -8 0 -2Z" fill="${C.lampFlame}"/><path d="M0 -4C-3 -8 -3 -14 0 -20C3 -14 3 -8 0 -4Z" fill="#fff4d2"/></g>`;
}
/** a short sword held in the hand (origin at the grip, blade up) */
export function sword(c, len = 60) {
  const s = sheet();
  s.p(c.cut([[-3, -8], [3, -8], [2.4, -len], [0, -len - 8], [-2.4, -len]], 0.2, 5), mix(C.stone, C.skyBlue2, 0.4));
  s.x(c.ribbon([[0, -12], [0, -len + 4]], 0.8), '#fff', 'opacity=".6"');
  s.p(c.cut(c.rect(-10, -10, 20, 4), 0.2, 3), C.wood2);
  s.p(c.cut(c.rect(-2.5, -6, 5, 14), 0.2, 3), C.leather);
  return s.out();
}
/** a club (origin at the grip, head up) */
export function club(c, len = 64) {
  return sheet().p(c.cut([[-3, 12], [3, 12], [6, -len * 0.7], [9, -len], [-9, -len], [-6, -len * 0.7]], 0.6, 5), C.wood2)
    .x(c.ribbon([[-4, -len * 0.8], [5, -len * 0.75]], 1.2), shade(C.wood2, -0.3), 'opacity=".6"').out();
}
/** a cord binding the wrists (worn as holdF — at the hand) */
export function cord(c) {
  return sheet().p(c.ribbon(c.arc(0, 0, 8, 5, 0, PI * 2, 14), 2.6), C.rope).p(c.ribbon(c.qbez([4, 4], [16, 26], [30, 40], 10), 2.4), C.rope).out();
}
/** three paper Zs (sleep), origin at the first Z */
export function zzz(c, col = C.cream) {
  const Z = (x, y, s) => c.poly([[x - 6 * s, y - 7 * s], [x + 6 * s, y - 7 * s], [x + 6 * s, y - 4 * s], [x - 1.5 * s, y + 4 * s], [x + 6 * s, y + 4 * s], [x + 6 * s, y + 7 * s], [x - 6 * s, y + 7 * s], [x - 6 * s, y + 4 * s], [x + 1.5 * s, y - 4 * s], [x - 6 * s, y - 4 * s]]);
  return `<path class="z0" d="${Z(0, 0, 1)}" fill="${col}"/><path class="z1" d="${Z(14, -16, 1.3)}" fill="${col}"/><path class="z2" d="${Z(32, -36, 1.6)}" fill="${col}"/>`;
}
/** a rooster, facing right; feet at (0,0). Parts: .rhead (turn it with pose(el, {x: 16, y: -58, r, ox: 16, oy: -58})), .beakL (the lower beak, pivot (33,-79)) */
export function rooster(c, { body = C.terracotta, tail = C.teal, comb = '#d9534a', dark = false } = {}) {
  const D = (col) => (dark ? '#2a2233' : col);
  const s = sheet();
  // legs
  s.p(c.ribbon([[-4, -22], [-6, 0]], 3) + c.ribbon([[6, -22], [8, 0]], 3) + c.ribbon([[-6, 0], [4, 0]], 2) + c.ribbon([[8, 0], [18, 0]], 2), D(C.ochre));
  // tail feathers
  let tl = '';
  for (let i = 0; i < 5; i++) tl += c.ribbon(c.qbez([-20, -44], [-50 - i * 4, -80 + i * 8], [-44 - i * 6, -20 + i * 5], 12), (u) => 7 - u * 5);
  s.p(tl, D(tail));
  // body
  s.p(c.cut([[-26, -44], [-10, -58], [8, -60], [22, -52], [26, -34], [16, -20], [0, -16], [-18, -22], [-28, -34]], 0.6, 5), D(body));
  s.p(c.cut([[-12, -46], [8, -48], [14, -36], [0, -28], [-14, -32]], 0.4, 4), D(shade(body, -0.15)));
  const h = sheet();
  // neck + head (pivot 16,-58)
  h.p(c.cut([[6, -54], [12, -74], [18, -86], [28, -88], [34, -80], [30, -66], [24, -52]], 0.4, 4), D(C.sun));
  h.p(c.cut([[16, -88], [18, -98], [22, -92], [25, -100], [28, -92], [32, -96], [32, -86]], 0.3, 3), D(comb));
  h.p(c.cut([[28, -76], [32, -70], [28, -66], [26, -72]], 0.2, 3), D(comb));
  if (!dark) h.x(c.poly(c.circ(27, -82, 1.6, 6)), C.ink);
  const beakU = `<path class="beakU" d="${c.poly([[33, -84], [42, -81], [33, -79]])}" fill="${D(C.ochre)}"/>`;
  const beakL = `<path class="beakL" d="${c.poly([[33, -79], [40, -78], [33, -76]])}" fill="${D(shade(C.ochre, -0.15))}"/>`;
  return `${s.out()}<g class="rhead">${h.out()}${beakU}${beakL}</g>`;
}
/** tally marks (n short strokes), origin at the left end */
export function tally(c, n = 3, col = C.ink, h = 26) {
  let d = '';
  for (let i = 0; i < n; i++) d += c.ribbon([[i * 12, 0], [i * 12 + 2, -h]], 4);
  return `<path d="${d}" fill="${col}"/>`;
}
/** a music note (hymn), origin at the note head */
export function note(c, col = C.cream) {
  return sheet().p(c.cut(c.ell(0, 0, 7, 5, 10, -0.4), 0.2, 3), col).p(c.ribbon([[6, -2], [6, -30]], 2.4) + c.ribbon(c.qbez([6, -30], [16, -24], [14, -12], 6), 2.4), col).out();
}
/** a hanging oil lamp on three chains; origin at the ring on top; .flame (its glow is a separate piece: lampGlow) */
export function hangingLamp(c, { col = C.sun } = {}) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [-16, 40]], 1.2) + c.ribbon([[0, 0], [16, 40]], 1.2) + c.ribbon([[0, 0], [0, 38]], 1.2), shade(col, -0.35));
  s.p(c.cut([[-24, 40], [24, 40], [18, 52], [4, 56], [-4, 56], [-18, 52]], 0.3, 4), col);
  s.p(c.cut([[22, 40], [34, 36], [34, 40], [24, 46]], 0.2, 3), shade(col, -0.1));
  s.p(c.cut(c.circ(0, 0, 3.4, 8), 0.2, 2), shade(col, -0.35));
  return `${s.out()}<g class="flame" transform="translate(32 36)"><path d="M0 0C-6 -5 -5 -14 0 -24C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2.6 -5 -2.6 -9 0 -14C2.6 -9 2.6 -5 0 -2Z" fill="#fff4d2"/></g>`;
}
/** the glow of a hanging lamp hung at (x, y) — a separate, still piece so the flickering lamp stays small */
export function lampGlow(x, y, r = 170) { return `<circle class="glow" cx="${x + 26}" cy="${y + 36}" r="${r}" fill="url(#warm-glow)"/>`; }
/** an oil lamp standing on something (origin: base); .flame / .glow */
export function oilLamp(c, { r = 150 } = {}) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-30, -8], [-18, -16], [10, -16], [24, -12], [34, -16], [38, -12], [26, -2], [14, 2], [-18, 2]], 0.4, 5), C.pot);
  s.p(c.cut(c.circ(-4, -14, 7, 10), 0.2, 3), shade(C.pot, -0.3));
  return `<circle class="glow" cx="34" cy="-30" r="${r}" fill="url(#warm-glow)"/>${s.out()}<g class="flame" transform="translate(35 -16)"><path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/></g>`;
}
/** a jar carried on the shoulder (origin centre) */
export function waterJar(c, col = C.pot) {
  return sheet().p(c.cut([[-12, 22], [-18, 4], [-16, -12], [-8, -20], [-7, -28], [7, -28], [8, -20], [16, -12], [18, 4], [12, 22]], 0.4, 5), col)
    .x(c.ribbon([[-17, -2], [17, -2]], 2.4), C.cream, 'opacity=".5"').x(c.cut(c.ell(0, -28, 7, 2, 8), 0.2, 2), C.lake2).out();
}
/** a drop of water (origin centre) */
export function drop(c, r = 4, col = C.lake) { return `<path d="${c.cut([[0, -r * 2], [r, 0], [0, r], [-r, 0]], 0.2, 2)}" fill="${col}"/>`; }
/** the fire in the courtyard: logs + stones (static) — origin: ground centre */
export function firePit(c, w = 110) {
  const s = sheet();
  let st = '';
  for (let i = 0; i < 7; i++) { const x = -w / 2 + (w * (i + 0.5)) / 7; st += c.cut(c.blob(x, -6, 10, 8, 8, 0.2), 0.4, 3); }
  s.p(st, C.rock3);
  s.p(c.ribbon([[-w * 0.4, -8], [w * 0.3, -26]], 9) + c.ribbon([[w * 0.4, -8], [-w * 0.3, -24]], 9), C.wood2);
  s.p(c.ribbon([[-w * 0.1, -6], [w * 0.05, -34]], 8), shade(C.wood2, -0.15));
  return s.out();
}
/** flames for the fire; origin at the ground centre, each tongue is a .tongue (animate sy) */
export function fireFlames(c, w = 110) {
  const tongues = [[-30, 50, C.sunDeep], [22, 56, C.sunDeep], [-8, 80, C.sun], [14, 62, C.lampFlame], [-22, 48, C.lampFlame], [2, 44, '#fff4d2']];
  return tongues.map(([x, h, col], i) => `<g class="tongue" data-i="${i}" transform="translate(${x} -16)"><path d="M0 0C${-h * 0.32} ${-h * 0.2} ${-h * 0.24} ${-h * 0.6} 0 ${-h}C${h * 0.26} ${-h * 0.6} ${h * 0.32} ${-h * 0.2} 0 0Z" fill="${col}"/></g>`).join('');
}
/** a cloth (the young man's linen sheet / a blindfold band) — a draped rectangle; origin top centre */
export function linenCloth(c, w = 70, h = 90, col = C.linen) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0], [w / 2 + 6, h * 0.5], [w / 2 - 2, h]];
  for (let x = w / 2 - 2; x > -w / 2; x -= 14) pts.push([x - 7, h + c.rr(2, 8)], [x - 14, h]);
  pts.push([-w / 2 - 6, h * 0.5]);
  s.p(c.cut(pts, 0.6, 6), col);
  s.x(c.ribbon([[-w * 0.2, 4], [-w * 0.25, h - 6]], 2) + c.ribbon([[w * 0.15, 4], [w * 0.2, h - 4]], 2), shade(col, -0.1), 'opacity=".7"');
  return s.out();
}
/** a blindfold band around the eyes (head coords, to addToHead) with a class so it can be shown */
export function blindfold(c) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([-20, -6], [0, -9], [21, -5], 10), 9), C.linen2);
  s.p(c.ribbon(c.qbez([-18, -4], [-30, 2], [-34, 14], 8), 5) + c.ribbon(c.qbez([-18, -2], [-26, 10], [-24, 22], 8), 4), C.linen2);
  return `<g class="blind" opacity="0">${s.out()}</g>`;
}
/** a small sanctuary of the Temple (origin: base centre, ~ 100 wide, 90 high at sc 1) */
export function templeMini(c, sc = 1, { col = mix(C.cream, C.linen, 0.5), gold = C.sun } = {}) {
  const s = sheet();
  const W = 50 * sc, H = 90 * sc, sh = 55 * sc, SW = 30 * sc;
  s.p(c.cut([[-W, 0], [-W, -sh], [W, -sh], [W, 0]], 0.4, 6), shade(col, -0.06));
  s.p(c.cut([[-SW, 0], [-SW, -H], [SW, -H], [SW, 0]], 0.4, 6), col);
  s.p(c.cut(c.rect(-SW - 3 * sc, -H - 3 * sc, SW * 2 + 6 * sc, 6 * sc), 0.2, 4), gold);
  s.p(c.cut([[-10 * sc, 0], [-10 * sc, -46 * sc], [10 * sc, -46 * sc], [10 * sc, 0]], 0.2, 4), C.plumRobe);
  let sp = '';
  for (let x = -SW + 4 * sc; x <= SW - 3 * sc; x += 8 * sc) sp += c.poly([[x - 1.6 * sc, -H - 3 * sc], [x, -H - 11 * sc], [x + 1.6 * sc, -H - 3 * sc]]);
  s.x(sp, gold);
  return s.out();
}
/** a jigsaw piece of testimony (origin centre); kind 0..3 changes the knobs so that none of them fit */
export function puzzle(c, kind = 0, col = C.cream, r = 20) {
  const K = [[1, -1, 1, 0], [-1, 1, 0, 1], [1, 1, -1, -1], [0, -1, -1, 1]][kind % 4];
  const corners = [[-r, -r], [r, -r], [r, r], [-r, r]];
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const a = corners[i], b = corners[(i + 1) % 4], k = K[i];
    const dx = (b[0] - a[0]) / (2 * r), dy = (b[1] - a[1]) / (2 * r);
    const nx = dy, ny = -dx;                 // outward normal
    pts.push(a);
    if (k) {
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, kr = r * 0.3;
      pts.push([mx - dx * kr * 0.8, my - dy * kr * 0.8]);
      const cx = mx + nx * kr * 0.9 * k, cy = my + ny * kr * 0.9 * k;
      const a0 = Math.atan2(-dy, -dx);
      for (let j = 0; j <= 8; j++) { const t = a0 - k * (j / 8) * PI * 1.6 - k * PI * 0.2; pts.push([cx + Math.cos(t) * kr, cy + Math.sin(t) * kr]); }
      pts.push([mx + dx * kr * 0.8, my + dy * kr * 0.8]);
    }
  }
  return sheet().p(c.cut(pts, 0.4, 4), col).out();
}
/** a scroll of accusations (origin centre) — the lines are scribbled crooked */
export function crookedScroll(c, w = 70, h = 46) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), C.parchment);
  let l = '';
  for (let y = -h / 2 + 9; y < h / 2 - 5; y += 7) l += c.ribbon([[-w / 2 + 8, y + c.rr(-2, 2)], [w / 2 - 8 - c.rr(0, 12), y + c.rr(-3, 3)]], 1.4);
  s.x(l, C.ink, 'opacity=".5"');
  s.p(c.cut(c.rect(-w / 2 - 7, -h / 2 - 4, 8, h + 8), 0.3, 4) + c.cut(c.rect(w / 2 - 1, -h / 2 - 4, 8, h + 8), 0.3, 4), C.wood2);
  return s.out();
}
/** a hand-lettered word on a tag hung from its hole; origin at the hole */
export function wordTag(c, text, { size = 20, fill = C.cream, ink = C.ink, w, dark = false } = {}) {
  const ww = w || Math.max(64, String(text).length * size * 0.5 + size * 1.4);
  const hh = size * 1.7;
  const s = sheet();
  s.p(c.cut([[-ww / 2 + 10, 0], [ww / 2 - 10, 0], [ww / 2, 10], [ww / 2, hh], [-ww / 2, hh], [-ww / 2, 10]], 0.5, 6), dark ? mix(C.storm2, C.ink, 0.3) : fill);
  s.x(c.poly(c.circ(0, 6, 3, 8)), C.wood2);
  return `${s.out()}<text x="0" y="${(hh * 0.5 + size * 0.5).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${dark ? C.cream : ink}">${text}</text>`;
}
/** a round paper plate with an icon, hung on a string (origin at the plate centre) */
export function discPlate(c, icon, { r = 50, fill = C.cream, rim = C.ochre } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 5, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), fill).out() + icon;
}
/** the woman pouring her jar — a tiny cameo (origin centre, ~ 70 tall), for the memorial plates */
export function womanCameo(c) {
  const s = sheet();
  const ink = mix(C.plumRobe, C.ink, 0.35);
  s.p(c.cut([[-16, 30], [-12, 4], [-8, -8], [-10, -18], [-4, -26], [6, -24], [8, -14], [4, -6], [14, 0], [16, 30]], 0.4, 4), ink);
  s.p(c.cut(c.circ(0, -18, 7.5, 12), 0.2, 3), ink);
  s.p(c.cut([[6, -6], [18, -14], [22, -12], [10, -2]], 0.3, 3), ink);
  s.p(c.cut([[18, -20], [24, -22], [28, -14], [22, -10]], 0.2, 3), C.cream);
  s.x(c.ribbon(c.qbez([27, -12], [30, -2], [26, 8], 6), 2), C.sun);
  return `<circle cx="22" cy="-6" r="22" fill="url(#warm-glow)" opacity=".8"/>${s.out()}`;
}
/** a simple parchment map of the known world (origin centre); returns markup; w×h */
export function worldMap(c, w = 440, h = 250) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.8, 10), C.parchment);
  s.p(c.cut(c.rect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20), 0.5, 10), mix(C.lake, C.parchment, 0.45));
  const land = [
    c.blob(-w * 0.28, -h * 0.18, w * 0.2, h * 0.2, 12, 0.3), c.blob(-w * 0.05, -h * 0.22, w * 0.16, h * 0.14, 11, 0.3), c.blob(w * 0.22, -h * 0.12, w * 0.2, h * 0.22, 12, 0.3),
    c.blob(-w * 0.02, h * 0.2, w * 0.2, h * 0.2, 12, 0.3), c.blob(w * 0.3, h * 0.24, w * 0.1, h * 0.1, 9, 0.3), c.blob(-w * 0.34, h * 0.24, w * 0.08, h * 0.08, 9, 0.3),
  ].map((p) => c.cut(p, 1, 6)).join('');
  s.p(land, mix(C.sage2, C.sand, 0.4));
  s.x(c.ribbon(c.qbez([-w * 0.4, 0], [0, -h * 0.04], [w * 0.4, 0.02 * h], 16), 1), C.wood3, 'opacity=".5"');
  s.p(c.cut(c.rect(-w / 2 - 8, -h / 2 - 6, 12, h + 12), 0.3, 6) + c.cut(c.rect(w / 2 - 4, -h / 2 - 6, 12, h + 12), 0.3, 6), C.wood2);
  return s.out();
}
/** where the memorial plates pop up on the world map (map coords) */
export const MAP_SPOTS = [[0, -4], [-120, -40], [96, -52], [-40, 60], [140, 30], [-150, 40], [40, -70], [-70, -60], [110, 70], [-10, 30]];
/** a stone seal / verdict stamp (origin centre) */
export function seal(c, r = 26, col = shade(C.terracotta, -0.2)) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.92, 14, 0.08), 0.8, 4), col);
  s.x(c.ribbon(c.arc(0, 0, r * 0.62, r * 0.6, 0, PI * 2, 18), 2), shade(col, -0.3), 'opacity=".6"');
  s.x(c.poly([[-r * 0.3, -r * 0.3], [r * 0.3, r * 0.3], [r * 0.24, r * 0.36], [-r * 0.36, -r * 0.24]]) + c.poly([[r * 0.3, -r * 0.3], [-r * 0.3, r * 0.3], [-r * 0.36, r * 0.24], [r * 0.24, -r * 0.36]]), shade(col, -0.35), 'opacity=".7"');
  return s.out();
}
/** a lamb (origin: feet, facing right) */
export function lamb(c, { k } = {}) {
  const s = sheet();
  const wool = C.linen, face = mix(C.inkSoft, C.stone2, 0.4);
  s.p(c.cut(c.rect(-22, -22, 6, 22), 0.2, 4) + c.cut(c.rect(14, -22, 6, 22), 0.2, 4), face);
  s.p(c.cut(c.blob(0, -34, 34, 18, 14, 0.18), 1.6, 4), wool);
  s.p(c.cut(c.ell(34, -42, 10, 8, 12, 0.3), 0.3, 3), face);
  s.p(c.cut(c.ell(28, -48, 7, 3, 8, -0.6), 0.2, 3), face);
  s.x(c.poly(c.circ(37, -44, 1.3, 6)), C.ink);
  return `<g${k_(k)}>${s.out()}</g>`;
}
/** a snare / net lowered on a string; origin top centre */
export function snare(c, w = 150, h = 100, col = C.rope) {
  let d = '';
  for (let i = 0; i <= 6; i++) { const x = -w / 2 + (w * i) / 6; d += c.ribbon(c.qbez([x * 0.5, 0], [x * 1.05, h * 0.5], [x, h], 8), 1.6); }
  for (let j = 1; j <= 4; j++) { const y = (h * j) / 4, ww = lerp(w * 0.25, w / 2, j / 4); d += c.ribbon(c.qbez([-ww, y], [0, y + 10], [ww, y], 10), 1.6); }
  let knots = '';
  for (let i = 0; i < 7; i++) knots += c.poly(c.circ(-w / 2 + (w * i) / 6, h, 3.4, 6));
  return `<path d="M0 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><path d="${d}" fill="${col}"/><path d="${knots}" fill="${C.wood2}"/>`;
}
/** a tiny paper pawn of Jesus (for the plotters' table): cream figure with a little gold halo; origin: base */
export function pawn(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, -30, 11, 16), 0.2, 3), C.halo);
  s.p(c.cut([[-9, 0], [-7, -16], [-4, -22], [4, -22], [7, -16], [9, 0]], 0.3, 3), C.linen);
  s.p(c.cut(c.circ(0, -28, 6, 10), 0.2, 3), C.skin);
  s.p(c.cut([[-6, -18], [5, -21], [-3, 0], [-8, 0]], 0.2, 3), C.jesusMantle);
  return s.out();
}
/** the dark shape of a reaching hand, fingers up (origin at the wrist) */
export function shadowHand(c, col = '#2a2233', sc = 1) {
  const s = sheet();
  const P = (x, y) => [x * sc, y * sc];
  s.p(c.cut([P(-14, 0), P(-16, -30), P(-24, -44), P(-20, -48), P(-10, -36), P(-10, -60), P(-5, -62), P(-2, -40), P(0, -66), P(5, -66), P(6, -40), P(10, -62), P(15, -60), P(13, -36), P(20, -52), P(24, -48), P(16, -26), P(14, 0)], 0.5, 5), col);
  return s.out();
}

/* ================================================================== skies */
export const NIGHT = ['#1c2148', '#2e3566', '#4d4f7c'];
export const NIGHT2 = ['#171b3c', '#262c58', '#3e416e'];
export const DUSK = ['#5b5a8c', '#b58a9b', '#e7ae93'];
export const DAWN = ['#6d6f9c', '#c49aa6', '#f0c3a0'];

/* ================================================================== sets */

/**
 * The chief priests' chamber at dusk: a big arched window onto Jerusalem (the Temple, the pilgrims),
 * a door on the right, the table in the middle with a hanging lamp above. The priests' shadows fall on the wall.
 * Returns { sky, crowd (layer inside the window), shadows (layer on the wall), lamp, FLOOR, TOP (table top), DOOR }.
 */
export function chamber(S, { skyCols = DUSK } = {}) {
  const c = S.c;
  const FLOOR = 700, CEIL = 230;
  const W0 = 620, W1 = 980, WT = 300, WB = 560;       // the window
  const DOOR = { x0: 1210, x1: 1320, top: 470 };
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.03, sh: 1, flat: true });
  starL.add(stars(c, { x0: 500, x1: 1100, y0: 150, y1: 420, n: 26 }));
  // the city in the window
  const city = S.layer({ par: 0.12, sh: 2 });
  const h1 = band(c, { y: 500, amps: [10, 5, 2], lens: [700, 260, 90], color: mix(C.hillFar, C.duskViolet, 0.45) });
  city.add(h1.markup);
  city.add(walledCity(c, 800, 540, 1.0, { wall: mix(C.stone, C.duskViolet, 0.3), wall2: mix(C.stone2, C.duskViolet, 0.35), temple: mix(C.cream, C.dusk, 0.15) }));
  let lit = '';
  for (let i = 0; i < 16; i++) lit += c.poly(c.rect(c.rr(650, 950), c.rr(470, 520), 3, 4));
  city.add(`<path d="${lit}" fill="${C.lampFlame}"/>`);
  // pilgrims in the streets (faded in when needed)
  const crowdL = S.layer({ par: 0.16, sh: 1 });
  let heads = '', bodies = '', lamps = '';
  const cols = [C.dustyBlue, C.roseRobe, C.wheatRobe, C.sageRobe, C.mauve, C.ochreRobe].map((k) => mix(k, C.indigo, 0.35));
  const bods = cols.map(() => '');
  for (let row = 0; row < 3; row++) for (let i = 0; i < 26; i++) {
    const x = 610 + (i + c.rr(0, 0.8)) * 15 + row * 5, y = 548 + row * 8, s = 1.3 + row * 0.25;
    bods[(i + row) % cols.length] += c.cut([[x - 5 * s, y], [x - 4 * s, y - 14 * s], [x + 4 * s, y - 14 * s], [x + 5 * s, y]], 0.3, 3);
    heads += c.poly(c.circ(x, y - 17.5 * s, 3.4 * s, 7));
    if (i % 5 === row) lamps += c.poly(c.circ(x + 6 * s, y - 20 * s, 2.6 * s, 6));
  }
  crowdL.add(`<g><path d="${c.poly([[600, 540], [1000, 540], [1000, 600], [600, 600]])}" fill="${mix(C.sand2, C.indigo, 0.4)}"/>${bods.map((d, i) => `<path d="${d}" fill="${cols[i]}"/>`).join('')}<path d="${heads}" fill="${mix(C.skin3, C.indigo, 0.35)}"/><circle cx="800" cy="560" r="170" fill="url(#warm-glow)" opacity=".35"/><path d="${lamps}" fill="${C.lampFlame}"/></g>`);
  // the wall
  const wallL = S.layer({ par: 0.3, sh: 3 });
  const wcol = mix(C.plaster, C.ochre, 0.2);
  const win = [[W0, WB], [W0, WT + 90], ...c.arc((W0 + W1) / 2, WT + 90, (W1 - W0) / 2, 90, PI, 2 * PI, 16), [W1, WB]];
  const door = [[DOOR.x0, FLOOR + 6], [DOOR.x0, DOOR.top], ...c.arc((DOOR.x0 + DOOR.x1) / 2, DOOR.top, (DOOR.x1 - DOOR.x0) / 2, 44, PI, 2 * PI, 10), [DOOR.x1, FLOOR + 6]];
  const w = sheet();
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), wcol);
  let blot = '';
  for (let i = 0; i < 14; i++) blot += c.cut(c.blob(c.rr(-200, 1800), c.rr(CEIL + 40, FLOOR - 60), c.rr(24, 60), c.rr(10, 22), 10, 0.2), 0.8, 6);
  w.x(blot, shade(wcol, -0.06), 'opacity=".55"');
  // on a tall screen the ceiling is only a beam across the wall, so the wood does not fill the top of the picture
  const CTOP = S.portrait ? CEIL - 150 : -1200;
  w.p(c.cut([[-900, CTOP], [2500, CTOP], [2500, CEIL], [-900, CEIL]], 0.8, 30), shade(C.wood2, -0.25));
  let beams = '';
  for (let x = -300; x < 1900; x += 110) beams += c.cut(c.rect(x, CEIL - 6, 22, 26), 0.3, 5);
  w.p(beams, shade(C.wood, -0.1));
  // window frame, sill, lattice; door frame
  w.p(c.ribbon(win.slice(0, -1), 12), C.wood2);
  w.p(c.cut(c.rect(W0 - 20, WB - 4, W1 - W0 + 40, 14), 0.3, 8), C.wood);
  w.p(c.ribbon([[DOOR.x0 - 5, FLOOR + 4], [DOOR.x0 - 5, DOOR.top]], 10) + c.ribbon([[DOOR.x1 + 5, FLOOR + 4], [DOOR.x1 + 5, DOOR.top]], 10) + c.ribbon(c.arc((DOOR.x0 + DOOR.x1) / 2, DOOR.top, (DOOR.x1 - DOOR.x0) / 2 + 5, 49, PI, 2 * PI, 12), 10), C.wood2);
  // a curtain tied at the window's side, a shelf of scrolls
  w.p(c.cut([[W0 - 60, WT - 10], [W0 + 10, WT - 10], [W0 - 4, WT + 120], [W0 - 30, WB], [W0 - 64, WB]], 0.6, 8), shade(C.plumRobe, -0.1));
  w.p(c.ribbon([[W0 - 60, WT + 150], [W0 - 16, WT + 160]], 5), C.sun);
  w.p(c.cut(c.rect(250, 420, 220, 9), 0.3, 6) + c.cut(c.rect(250, 500, 220, 9), 0.3, 6), C.wood2);
  let scrolls = '';
  for (let i = 0; i < 7; i++) scrolls += c.cut(c.ell(270 + i * 30, 406, 12, 13, 10), 0.3, 3);
  for (let i = 0; i < 6; i++) scrolls += c.cut(c.ell(280 + i * 32, 486, 12, 13, 10), 0.3, 3);
  w.p(scrolls, C.parchment);
  wallL.add(`<rect x="${DOOR.x0}" y="${DOOR.top - 50}" width="${DOOR.x1 - DOOR.x0}" height="${FLOOR - DOOR.top + 60}" fill="${mix(C.night, C.plumRobe, 0.3)}"/>` + w.out());
  // the priests' shadows on the wall (just in front of the wall)
  const shadowsL = S.layer({ par: 0.32, sh: 0, flat: true });
  // floor
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.clay, 0.25));
  let tiles = '';
  for (let r = 0; r < 6; r++) tiles += c.ribbon([[-900, FLOOR + 14 + r * r * 9 + r * 14], [2500, FLOOR + 14 + r * r * 9 + r * 14 + c.rr(-2, 2)]], 1.4);
  fl.x(tiles, shade(C.stone2, -0.2), 'opacity=".5"');
  floorL.add(fl.out());
  // dusk dims the room; the lamp lights it
  const dimL = S.layer({ par: 0.4, sh: 1, flat: true });
  dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".12"/><ellipse cx="800" cy="480" rx="560" ry="360" fill="url(#warm-glow)" opacity=".55"/>`);
  // the shadows are clipped to the wall (never on the window or the doorway)
  const clipId = S.id('wallclip');
  S.defs(`<clipPath id="${clipId}"><path clip-rule="evenodd" d="${c.poly([[-900, -1200], [2500, -1200], [2500, FLOOR], [-900, FLOOR]])}${c.poly(win)}${c.poly(door)}"/></clipPath>`);
  return { clipId, sky: sk, stars: starL, crowd: crowdL, shadows: shadowsL, dim: dimL, FLOOR, CEIL, DOOR, WIN: { x0: W0, x1: W1, top: WT, bottom: WB } };
}
/** the priests' table: a solid wooden table (origin floor centre), top at -h */
export function table(c, w = 300, h = 100) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 14, -h + 10, 16, h - 10), 0.3, 6) + c.cut(c.rect(w / 2 - 30, -h + 10, 16, h - 10), 0.3, 6), C.wood2);
  s.p(c.cut(c.rect(-w / 2, -h, w, 14), 0.4, 10), C.wood);
  s.p(c.cut([[-w / 2 + 6, -h + 12], [w / 2 - 6, -h + 12], [w / 2 - 10, -h + 34], [-w / 2 + 10, -h + 34]], 0.4, 10), mix(C.plumRobe, C.indigo, 0.3));
  let fr = '';
  for (let x = -w / 2 + 14; x < w / 2 - 10; x += 12) fr += c.ribbon([[x, -h + 33], [x + 1, -h + 40]], 1.4);
  s.x(fr, C.sun);
  return s.out();
}

/**
 * The upper room: a long room lit by hanging lamps, two arched windows (evening → night outside),
 * the long low table with the Passover supper, cushions. Returns { sky, FLOOR, TOP, lamps, winGlow, SEAT }.
 * (The table itself is added by the scene, in front of the people.)
 */
export function upperRoom(S, { skyCols = DUSK } = {}) {
  const c = S.c;
  const FLOOR = 712, CEIL = 200;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.03, sh: 1, flat: true });
  starL.add(stars(c, { x0: 300, x1: 1300, y0: 200, y1: 460, n: 40 }));
  // roofs of the city through the windows
  const roofs = S.layer({ par: 0.12, sh: 2 });
  const rs = sheet();
  let rd = '', rl = '';
  for (let i = 0; i < 30; i++) { const x = c.rr(250, 1350), w = c.rr(30, 60), top = c.rr(468, 505); rd += c.cut(c.rect(x, top, w, 200), 0.4, 6); if (c.chance(0.5)) rl += c.poly(c.rect(x + w * 0.4, top + 8, 4, 5)); }
  rs.p(rd, mix(C.plaster2, C.indigo, 0.55));
  roofs.add(`<g transform="translate(1085 500)">${templeMini(c, 0.8, { col: mix(C.cream, C.duskViolet, 0.4), gold: mix(C.sun, C.duskViolet, 0.3) })}</g>` + rs.out() + `<path d="${rl}" fill="${C.lampFlame}"/><g transform="translate(520 380)"><circle r="40" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 16)}</g>`);
  // back wall with two arched windows
  const wallL = S.layer({ par: 0.3, sh: 3 });
  const wcol = mix(C.plaster, C.apricot, 0.22);
  const archWin = (x0, x1, top, bot) => [[x0, bot], [x0, top + (x1 - x0) / 2], ...c.arc((x0 + x1) / 2, top + (x1 - x0) / 2, (x1 - x0) / 2, (x1 - x0) / 2, PI, 2 * PI, 14), [x1, bot]];
  const winA = archWin(470, 590, 330, 520), winB = archWin(1010, 1130, 330, 520);
  const w = sheet();
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(winA, 0.5, 6) + c.hole(winB, 0.5, 6), wcol);
  let blot = '';
  for (let i = 0; i < 14; i++) blot += c.cut(c.blob(c.rr(-200, 1800), c.rr(CEIL + 60, FLOOR - 60), c.rr(24, 60), c.rr(10, 22), 10, 0.2), 0.8, 6);
  w.x(blot, shade(wcol, -0.05), 'opacity=".55"');
  w.p(c.ribbon(winA.slice(0, -1), 10) + c.ribbon(winB.slice(0, -1), 10), C.wood2);
  w.p(c.cut(c.rect(456, 516, 148, 10), 0.3, 6) + c.cut(c.rect(996, 516, 148, 10), 0.3, 6), C.wood);
  // ceiling & beams (on a tall screen only a beam across the wall, so the wood does not fill the top of the picture)
  const CTOP = S.portrait ? CEIL - 150 : -1200;
  w.p(c.cut([[-900, CTOP], [2500, CTOP], [2500, CEIL], [-900, CEIL]], 0.8, 30), shade(C.wood2, -0.15));
  let beams = '';
  for (let x = -300; x < 1900; x += 100) beams += c.cut(c.rect(x, CEIL - 6, 22, 28), 0.3, 5);
  w.p(beams, C.wood);
  // a woven hanging on the wall behind the centre
  const hg = sheet();
  hg.p(c.cut(c.rect(690, 300, 220, 170), 0.5, 8), mix(C.terracotta, C.clay, 0.5));
  let pat = '';
  for (let y = 320; y < 460; y += 30) for (let x = 710; x < 900; x += 30) pat += c.cut(c.star(x + ((y / 30) % 2) * 15, y, 7, 3, 4, 0), 0.2, 3);
  hg.x(pat, C.cream, 'opacity=".65"');
  hg.p(c.ribbon([[682, 300], [918, 300]], 7), C.wood2);
  let fr = '';
  for (let x = 694; x < 910; x += 9) fr += c.ribbon([[x, 470], [x + 1, 482]], 1.6);
  hg.x(fr, C.wheat2);
  wallL.add(w.out() + hg.out());
  // floor with a rug
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR - 40], [2500, FLOOR - 40], [2500, 1700], [-900, 1700]], 1, 30), mix(C.clay, C.sand2, 0.5));
  let lines = '';
  for (let i = 0; i < 6; i++) { const y = FLOOR - 26 + i * i * 10 + i * 12; lines += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.5); }
  fl.x(lines, shade(C.sand2, -0.2), 'opacity=".45"');
  floorL.add(fl.out());
  // evening dims the room around the lamps
  const dimL = S.layer({ par: 0.4, sh: 1, flat: true });
  dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.3)}" opacity=".2"/><ellipse cx="800" cy="560" rx="620" ry="340" fill="url(#warm-glow)" opacity=".5"/>`);
  // hanging lamps
  const lampL = S.layer({ par: 0.45, sh: 3 });
  const lamps = [560, 1040].map((x, i) => {
    const gl = lampL.add(lampGlow(x, 290));
    const el = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x, y: 290, len: 120 });
    return { el, x, y: 290, fl: el.querySelector('.flame'), gl, i };
  });
  return { sky: sk, stars: starL, dim: dimL, lamps, FLOOR, CEIL, TOP: FLOOR - 50, SEAT: FLOOR - 16 };
}
/** the table of the Last Supper with its dishes; origin floor centre; returns markup */
export function supperTable(c, w = 860) {
  let m = lowTable(c, w, 50);
  const items = [
    [-380, cup(c, C.clay)], [-330, loaf(c, 15)], [-270, bowl(c, { food: 'fruit', color: C.skyVeil })], [-200, matzah(c, 20)], [-150, cup(c)],
    [-94, bowl(c, { food: 'bread', color: C.stone2 })], [150, cup(c, C.clay)], [204, loaf(c, 16)], [260, grapes(c, 4.4)], [320, matzah(c, 18)], [370, cup(c)],
  ];
  items.forEach(([x, it]) => { m += `<g transform="translate(${x} -50)">${it}</g>`; });
  // the lamb platter in the middle-left, bitter herbs
  const pl = sheet();
  pl.p(c.cut(c.ell(-40, -52, 30, 5, 16), 0.3, 4), C.stone2);
  pl.p(c.cut(c.blob(-40, -60, 20, 9, 10, 0.2), 0.4, 4), mix(C.clay, C.wood3, 0.5));
  pl.p(c.cut(c.blob(-280 + 520, -58, 12, 6, 8, 0.3), 0.3, 3), C.leaf);
  m += pl.out();
  return m;
}

/**
 * The olive garden at night (Gethsemane / the Mount of Olives). Hanging moon, stars, the city across the
 * valley on the left, olive trees at three depths, the praying rock at `rockX`. Returns { sky, moon, stars, gy, fn, rockX, near, far }.
 */
export function garden(S, { skyCols = NIGHT, moonAt = [1150, 180], rockX = 1040, city = true, wall = false } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 90 }));
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const moonEl = hanging(hangL, `<circle r="130" fill="url(#halo-glow)" opacity=".55"/>${moon(c, 46)}`, { x: moonAt[0], y: moonAt[1], len: 600 });
  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.indigo, 0.55) });
  far.add(h1.markup);
  if (city) {
    far.add(walledCity(c, 330, h1.fn(330) + 14, 1.1, { wall: mix(C.stone, C.indigo, 0.5), wall2: mix(C.stone2, C.indigo, 0.55), temple: mix(C.cream, C.indigo, 0.4) }));
    let lit = '';
    for (let i = 0; i < 12; i++) lit += c.poly(c.rect(c.rr(240, 430), c.rr(h1.fn(330) - 40, h1.fn(330) - 4), 3, 4));
    far.add(`<path d="${lit}" fill="${C.lampFlame}" opacity=".9"/>`);
  }
  const mid = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 520, amps: [12, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.indigo, 0.5), trees: 18, treeColor: mix(C.moss, C.indigo, 0.5), treeH: 26 });
  mid.add(h2.markup);
  const OL = { trunk: mix(C.wood2, C.indigo, 0.35), leaf: mix(C.olive, C.indigo, 0.35), leaf2: mix(C.sage, C.indigo, 0.35) };
  mid.add(olive(c, 120, h2.fn(120) + 20, 0.8, OL) + olive(c, 1520, h2.fn(1520) + 20, 0.9, OL) + olive(c, 640, h2.fn(640) + 16, 0.6, OL));
  const groundL = S.layer({ par: 0.34, sh: 3 });
  const gy = 640;
  const fn = c.wave(gy - 40, [5, 2], [700, 160]);
  groundL.add(sheet().p(c.ridge(fn, -900, 2500, 1700, 12, 1), mix(C.sage, C.indigo, 0.45)).out());
  groundL.add(grass(c, { x0: -600, x1: 2200, y: gy - 40, fn, n: 40, h: 12, color: mix(C.moss, C.indigo, 0.4) }));
  const OL2 = { trunk: mix(C.wood2, C.indigo, 0.25), leaf: mix(C.olive, C.indigo, 0.25), leaf2: mix(C.sage, C.indigo, 0.25) };
  groundL.add(olive(c, 260, fn(260) + 30, 1.25, OL2) + olive(c, 1380, fn(1380) + 34, 1.35, OL2));
  if (wall) {
    const ws = sheet();
    ws.p(c.cut([[-900, gy - 64], [300, gy - 70], [300, gy + 20], [-900, gy + 20]], 1, 10), mix(C.rock2, C.indigo, 0.35));
    ws.p(c.cut([[380, gy - 70], [520, gy - 64], [520, gy + 20], [380, gy + 20]], 1, 10), mix(C.rock2, C.indigo, 0.35));
    let st = '';
    for (let x = -880; x < 520; x += c.rr(30, 50)) if (x < 300 || x > 380) st += c.ribbon([[x, gy - 60], [x + c.rr(-2, 2), gy + 16]], 1.2);
    ws.x(st, mix(C.rock3, C.indigo, 0.4), 'opacity=".7"');
    ws.p(c.cut(c.rect(290, gy - 110, 16, 130), 0.4, 6) + c.cut(c.rect(374, gy - 110, 16, 130), 0.4, 6), mix(C.wood2, C.indigo, 0.3));
    groundL.add(ws.out());
  }
  groundL.add(rock(c, rockX, gy + 20, 150, 56, mix(C.rock2, C.indigo, 0.3)));
  return { sky: sk, moon: moonEl, stars: starL, hang: hangL, gy, fn, rockX, OL2 };
}

/**
 * The high priest's palace, cut away (everything on one parallax plane, par 0.5, so the camera can travel
 * between the floors): the council hall upstairs on the right (floor HALL), the courtyard below (floor YARD) with
 * a fire pit at FIRE, the gate and porch on the left (GATE), a stair on the far right, a wall-top for the rooster.
 * Returns { sky, stars, moon, hang, hallLamps, P (= 0.5), HALL, YARD, HX0, HX1, HTOP, GATE, FIRE, SEATX, yard(), porch() }.
 */
export function palace(S, { skyCols = NIGHT } = {}) {
  const c = S.c;
  const P = 0.5;
  const HALL = 380, YARD = 760, HX0 = 650, HX1 = 1430, HTOP = 110, GATE = 190, FIRE = 520, SEATX = 1200;
  const sk = sky(S, skyCols, { bottom: 900 });
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -900, x1: 2400, y0: -500, y1: 470, n: 90 }));
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const moonEl = hanging(hangL, moon(c, 34), { x: 380, y: 150, len: 600 });
  const far = S.layer({ par: 0.16, sh: 2 });
  let hs = '';
  for (let i = 0; i < 22; i++) { const x = c.rr(-700, 2300), wv = c.rr(50, 110), top = c.rr(400, 480); hs += c.cut(c.rect(x, top, wv, 500), 0.4, 6); }
  far.add(sheet().p(hs, mix(C.plaster2, C.indigo, 0.62)).out());

  const wall = mix(C.plaster, C.indigo, 0.3), wall2 = mix(C.plaster2, C.indigo, 0.38), stone = mix(C.stone, C.indigo, 0.3);
  const bld = S.layer({ par: P, sh: 3 });
  const b = sheet();
  // the courtyard's back wall, with a coping on top (where the rooster will stand)
  b.p(c.cut([[-900, 470], [2500, 470], [2500, YARD + 4], [-900, YARD + 4]], 1, 14), wall2);
  let crs = '';
  for (let y = 494; y < YARD; y += 26) { crs += c.ribbon([[-900, y], [2500, y + c.rr(-1, 1)]], 1.2); }
  b.x(crs, shade(wall2, -0.12), 'opacity=".55"');
  b.p(c.cut([[-900, 458], [2500, 458], [2500, 474], [-900, 474]], 0.6, 12), shade(wall2, -0.14));
  // the upper storey (the hall), carried on a colonnade
  b.p(c.cut([[HX0 - 20, 404], [HX0 - 20, HTOP - 24], [HX1 + 20, HTOP - 24], [HX1 + 20, 404]], 0.8, 12), wall);
  b.p(c.cut([[HX0 - 36, HTOP - 40], [HX1 + 36, HTOP - 40], [HX1 + 36, HTOP - 20], [HX0 - 36, HTOP - 20]], 0.5, 10), shade(wall, -0.2));
  let arches = '';
  for (let x = HX0; x < HX1 - 40; x += 195) arches += c.cut([[x + 20, YARD], [x + 20, 520], ...c.arc(x + 97, 520, 77, 70, PI, 2 * PI, 12), [x + 174, YARD]], 0.4, 6);
  b.p(c.cut([[HX0 - 20, 404], [HX1 + 20, 404], [HX1 + 20, YARD], [HX0 - 20, YARD]], 0.6, 10), wall);
  b.p(arches, mix(C.night, C.plumRobe, 0.3));
  b.p(c.cut([[HX0 - 30, HALL], [HX1 + 30, HALL], [HX1 + 30, HALL + 26], [HX0 - 30, HALL + 26]], 0.5, 10), shade(C.stone2, -0.28));
  bld.add(b.out());
  // the hall, lit from inside
  const hi = sheet();
  hi.p(c.cut([[HX0, HALL], [HX0, HTOP], [HX1, HTOP], [HX1, HALL]], 0.8, 14), mix(C.plaster, C.apricot, 0.25));
  let panels = '';
  for (let x = HX0 + 40; x < HX1 - 100; x += 170) if (Math.abs(x + 50 - SEATX) > 120) panels += c.cut([[x, HALL - 26], [x, HTOP + 100], ...c.arc(x + 50, HTOP + 100, 50, 44, PI, 2 * PI, 10), [x + 100, HALL - 26]], 0.4, 6);
  hi.p(panels, mix(C.plaster2, C.clay, 0.22));
  hi.p(c.cut([[HX0, HALL - 16], [HX1, HALL - 16], [HX1, HALL], [HX0, HALL]], 0.4, 10), mix(C.stone2, C.clay, 0.3));
  hi.p(c.cut([[SEATX - 110, HTOP + 16], [SEATX + 110, HTOP + 16], [SEATX + 100, HALL - 24], [SEATX - 100, HALL - 24]], 0.6, 8), shade(C.indigo, 0.2));
  let fold = '';
  for (let x = SEATX - 90; x < SEATX + 100; x += 30) fold += c.ribbon([[x, HTOP + 18], [x + c.rr(-3, 3), HALL - 26]], 5);
  hi.x(fold, shade(C.indigo, 0.05), 'opacity=".6"');
  hi.p(c.ribbon([[SEATX - 120, HTOP + 16], [SEATX + 120, HTOP + 16]], 8), C.sun);
  // the high priest's seat
  hi.p(c.cut([[SEATX - 40, HALL - 16], [SEATX - 40, HALL - 150], [SEATX + 40, HALL - 150], [SEATX + 40, HALL - 16]], 0.4, 6), C.wood);
  hi.p(c.cut(c.rect(SEATX - 46, HALL - 158, 92, 12), 0.3, 6), C.sun);
  hi.p(c.cut(c.rect(SEATX - 52, HALL - 66, 104, 16), 0.3, 6), mix(C.wood, C.plumRobe, 0.3));
  bld.add(`<rect x="${HX0}" y="${HTOP}" width="${HX1 - HX0}" height="${HALL - HTOP}" fill="${C.lampGlow}" opacity=".3"/>` + hi.out());
  const lampL = S.layer({ par: P, sh: 3 });
  const hallLamps = [840, 1320].map((x) => {
    const gl = lampL.add(lampGlow(x, HTOP + 24));
    const el = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x, y: HTOP + 24, len: 40 });
    return { el, x, y: HTOP + 24, fl: el.querySelector('.flame'), gl };
  });
  return {
    sky: sk, stars: starL, moon: moonEl, hang: hangL, hallLamps, P, HALL, YARD, HX0, HX1, HTOP, GATE, FIRE, SEATX,
    /** add the courtyard (floor, stair, fire, porch) — call after the hall people so it sits in front of them */
    yard() {
      const yardL = S.layer({ par: P, sh: 3 });
      const yf = sheet();
      yf.p(c.cut([[-900, YARD], [2500, YARD], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.indigo, 0.34));
      let tl = '';
      for (let r = 0; r < 6; r++) tl += c.ribbon([[-900, YARD + 14 + r * r * 9 + r * 14], [2500, YARD + 14 + r * r * 9 + r * 14 + c.rr(-2, 2)]], 1.4);
      yf.x(tl, shade(C.stone2, -0.4), 'opacity=".5"');
      yardL.add(yf.out());
      // the stair up to the hall, on the far right
      const st = sheet();
      const n = 14, sx0 = HX1 + 170, sx1 = HX1 + 10;
      let steps = '';
      for (let i = 0; i < n; i++) { const u = (i + 1) / n, x = lerp(sx0, sx1, u), y = lerp(YARD, HALL, u); steps += c.cut(c.rect(x - 4, y, 40, YARD - y), 0.3, 6); }
      st.p(steps, stone);
      yardL.add(st.out());
      // the fire pit
      yardL.add(`<g transform="translate(${FIRE} ${YARD + 30})">${firePit(c, 120)}</g>`);
      const glowL = S.layer({ par: P, sh: 0, flat: true });
      glowL.add(`<g><circle cx="${FIRE}" cy="${YARD - 40}" r="380" fill="url(#warm-glow)"/></g>`);
      const fireL = S.layer({ par: P, sh: 2 });
      const fireFl = fireL.add(`<g transform="translate(${FIRE} ${YARD + 30})">${fireFlames(c, 120)}</g>`);
      return { yardL, fireL, glowL, fireFl, tongues: Array.from(fireFl.querySelectorAll('.tongue')) };
    },
    /** the gate and porch in front, on the left */
    porch() {
      const porchL = S.layer({ par: P, sh: 5 });
      const ps = sheet();
      const arch = [[GATE - 54, YARD + 2], [GATE - 54, 600], ...c.arc(GATE, 600, 54, 54, PI, 2 * PI, 10), [GATE + 54, YARD + 2]];
      ps.p(c.cut([[GATE - 100, YARD + 40], [GATE - 100, 440], [GATE + 100, 440], [GATE + 100, YARD + 40]], 0.6, 8) + c.hole(arch, 0.4, 6), stone);
      ps.p(c.cut([[GATE - 116, 440], [GATE + 116, 440], [GATE + 106, 420], [GATE - 106, 420]], 0.4, 8), shade(stone, -0.15));
      porchL.add(ps.out());
      return porchL;
    },
  };
}

/* ================================================================== the Last Supper seating */
/** seats at the long table, left → right (Jesus in the middle, Judas at His right hand, next to the dish) */
export const SEATS = [
  ['simonZ', 428], ['thaddaeus', 490], ['philip', 552], ['andrew', 614], ['peter', 676], ['john', 738],
  ['jesus', 800], ['judas', 862], ['james', 924], ['thomas', 986], ['matthew', 1048], ['bartholomew', 1110], ['jamesA', 1172],
];
/**
 * Put the thirteen at table (seated puppets, with sad brows / tears ready). Returns [{k, x, p, sad, tear, flip, s, seed}].
 * Everyone faces the middle.
 */
export function seatAll(S, L, { withStand = false } = {}) {
  const c = S.c;
  return SEATS.map(([k, x], i) => {
    const o = k === 'jesus' ? CAST.jesus : TW[k];
    const el = L.add(withFace(person(c, { ...o, pose: 'sit' }), faceBits(c)));
    const m = { k, x, i, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]'), angry: el.querySelector('[data-part="angry"]'), flip: x > 800, s: k === 'jesus' ? 1.04 : 0.88, seed: c.rr(0, 9) };
    return m;
  });
}

/**
 * pose() for things that come and go: while hidden (o ≈ 0) the piece is frozen where it was last seen, so an
 * invisible, idly-swaying ornament never makes the compositor redraw anything.
 */
export function vis(el, p) {
  if (!el) return;
  if ((p.o ?? 1) <= 0.005) {
    if (el.__vx === undefined) { el.__vx = p.x ?? 0; el.__vy = p.y ?? 0; el.__vs = p.s ?? 1; }
    pose(el, { x: el.__vx, y: el.__vy, s: el.__vs, o: 0 });
    return;
  }
  el.__vx = p.x; el.__vy = p.y; el.__vs = p.s ?? 1;
  pose(el, p);
}
