// Mark 15 — the Passion. Shared cut-outs and sets for this chapter: Pilate and his hall, Roman soldiers,
// the square before the praetorium, Barabbas' cell, the road to Golgotha, the bare hill with its crosses
// (always far away, always a quiet silhouette), the hour-dial in the sky, the Temple veil, the tomb in the rock.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing as kitSwing } from '../kit.js';
import { fade as fadeA } from '../../core/anim.js';
import { band, hillsWith, olive, cypress, bush, grass, rock, sun as sunCut, cloud, stars, town } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';
import { addToHead, addToBody, turban } from '../mark2/lib.js';
import { column } from '../mark1/lib.js';
import { cityWall, sanctuary, priest as priestM } from '../mark11/lib.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, coin, dust, candle, menorah, scrollOpen } from '../mark2/lib.js';
export { priest, elder, scribe, cityWall, sanctuary } from '../mark11/lib.js';
export { tornPair, nameTag, strip, withFace, faceBits, shadowPerson, silhouette, man, woman, question, wisp, along } from '../mark3/lib.js';
export { soulLight, glory, lightCrown, tag, bigQuestion } from '../mark8/lib.js';
export { voiceRings, hang2, flame, column } from '../mark1/lib.js';
export { say, child, face, withBits, crown } from '../mark10/lib.js';
export { bubble, cry, chain, fetter } from '../mark5/lib.js';
export { tr, sky, hanging, pose, lerp, mix, shade, sheet, C, CAST, person };
/** kit's swing, but a thing pulled up into the flies (y above the box) is hidden — portrait screens see high up */
export function swing(el, x, y, time, amp, speed, seed) {
  kitSwing(el, x, y, time, amp, speed, seed);
  fadeA(el, y < -100 ? 0 : 1);
}

const PI = Math.PI;
export { PI };
export const FONT = 'EB Garamond, Georgia, serif';
export const INK = '#3b2a22';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== the cast */

export const LOOK = {
  pilate: { robe: mix(C.linen, C.stone, 0.3), mantle: '#f6efe0', skin: C.skin, hair: C.hair2, hairStyle: 'short', beard: 'none', belt: null },
  centurion: { robe: mix(C.terracotta, C.clay, 0.45), mantle: C.curtain2, belt: C.ochre, skin: C.skin3, hair: C.greyHair, hairStyle: 'short', beard: 'short', beardColor: C.greyHair },
  barabbas: { robe: mix(C.soil, C.wood3, 0.45), hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin3, belt: C.rope },
  simon: { robe: C.wheatRobe, mantle: mix(C.sageRobe, C.olive, 0.3), hair: C.hair3, hairStyle: 'wrap', veil: C.linen, veil2: C.stone2, beard: 'full', skin: C.skin4, belt: C.leather },
  joseph: { robe: mix(C.indigo, C.dustyBlue, 0.5), mantle: C.linen2, belt: C.sun, skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.stone2, beard: 'full', beardColor: C.greyHair },
  helper: { robe: C.stone2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather },
  magdalene: { robe: C.roseRobe, mantle: shade(C.jesusMantle, -0.08), hairStyle: 'veil', veil: shade(C.jesusMantle, -0.05), veil2: shade(C.jesusMantle, -0.18), skin: C.skin, hair: C.hair2 },
  maryJ: { robe: C.stone2, mantle: C.dustyBlue, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14), skin: C.skin2, hair: C.greyHair },
  salome: { robe: C.ochreRobe, mantle: C.sageRobe, hairStyle: 'veil', veil: C.linen2, veil2: shade(C.linen2, -0.12), skin: C.skin3, hair: C.hair },
};
export const SOLDIER = [
  { robe: mix(C.terracotta, C.clay, 0.5), skin: C.skin2, hair: C.hair3, beard: 'short' },
  { robe: shade(C.curtain, -0.04), skin: C.skin3, hair: C.hair, beard: 'none' },
  { robe: mix(C.terracotta, C.roseRobe, 0.35), skin: C.skin, hair: C.hair2, beard: 'none' },
  { robe: mix(C.clay, C.curtain2, 0.5), skin: C.skin4, hair: C.hair3, beard: 'short' },
];
const DY = { stand: 0, kneel: 46, sit: 62 };

/** a Roman helmet with a crest (head coords); transverse: the centurion's sideways crest */
export function romanHelmet(c, { transverse = false, col = C.rock2 } = {}) {
  const s = sheet();
  if (transverse) {
    const pts = [...c.arc(0, -18, 30, 26, PI * 1.02, PI * 1.98, 16)];
    pts.push(...c.arc(0, -18, 24, 17, PI * 1.98, PI * 1.02, 16));
    s.p(c.cut(pts, 0.5, 4), C.curtain2);
    let d = '';
    for (let i = 0; i < 9; i++) { const a = PI * (1.08 + i * 0.1); d += c.ribbon([[Math.cos(a) * 25, -18 + Math.sin(a) * 18], [Math.cos(a) * 29, -18 + Math.sin(a) * 24]], 1.2); }
    s.x(d, shade(C.curtain2, -0.25), 'opacity=".6"');
  }
  s.p(c.cut([...c.arc(0, -2, 21, 21, PI * 0.98, PI * 2.02, 14), [21, -2], [-21, -2]], 0.4, 4), col);
  s.p(c.cut([[-22, -4], [22, -4], [23, 1], [-22, 1]], 0.3, 4), shade(col, -0.2));
  s.p(c.cut([[-18, -1], [-10, -1], [-11, 12], [-17, 10]], 0.3, 3), shade(col, -0.08)); // neck guard
  s.p(c.cut([[8, -2], [15, -2], [14, 10], [9, 9]], 0.3, 3), shade(col, 0.08)); // cheek piece
  if (!transverse) s.p(c.cut([[-7, -21], [-1, -33], [9, -35], [5, -21]], 0.4, 3), C.terracotta);
  return s.out();
}
/** a leather cuirass and hanging straps (body coords, pose dy) */
function cuirass(c, dy = 0, col = C.leather) {
  const s = sheet();
  s.p(c.cut([[-26, -136 + dy], [24, -138 + dy], [29, -112 + dy], [30, -94 + dy], [-30, -94 + dy], [-29, -112 + dy]], 0.4, 5), shade(col, 0.12));
  s.x(c.ribbon([[-24, -118 + dy], [26, -118 + dy]], 1.4) + c.ribbon([[-26, -106 + dy], [28, -106 + dy]], 1.4), shade(col, -0.2), 'opacity=".6"');
  let st = '';
  for (let x = -26; x < 28; x += 9) st += c.cut([[x, -94 + dy], [x + 7, -94 + dy], [x + 7, -76 + dy], [x, -76 + dy]], 0.2, 3);
  s.p(st, col);
  return s.out();
}
/** a spear held in the hand: drawn so it stands upright when the arm is raised `a` degrees */
export function spearHeld(c, a = 34, len = 250) {
  const r = (a * PI) / 180, dx = Math.sin(r), dy = -Math.cos(r);
  const p0 = [-dx * len * 0.24, -dy * len * 0.24], p1 = [dx * len * 0.76, dy * len * 0.76];
  const tip = [p1[0] + dx * 22, p1[1] + dy * 22], nx = -dy, ny = dx;
  return `<path d="${c.ribbon([p0, p1], 3.4)}" fill="${C.wood2}"/><path d="${c.poly([[p1[0] + nx * 5, p1[1] + ny * 5], tip, [p1[0] - nx * 5, p1[1] - ny * 5]])}" fill="${C.rock3}"/>`;
}
/** a Roman soldier (puppet markup). pose: stand|kneel|sit. spear: angle the spear is held at (or false) */
export function soldier(c, i = 0, { pose: P = 'stand', spear = 34, k, transverse = false, extra = {} } = {}) {
  const o = SOLDIER[i % SOLDIER.length];
  let m = person(c, { ...o, mantle: i % 2 ? null : C.curtain2, belt: C.leather, hairStyle: 'short', pose: P, holdF: spear ? spearHeld(c, spear) : '', k, ...extra });
  m = addToBody(m, cuirass(c, DY[P]));
  return addToHead(m, romanHelmet(c, { transverse }));
}
/** the centurion; helmet: false shows him bare-headed */
export function centurion(c, { pose: P = 'stand', helmet = true, k, holdF = '' } = {}) {
  let m = person(c, { ...LOOK.centurion, pose: P, k, holdF });
  m = addToBody(m, cuirass(c, DY[P], mix(C.leather, C.ochre, 0.3)));
  return helmet ? addToHead(m, romanHelmet(c, { transverse: true })) : m;
}
/** Pilate in his toga with a thin purple band */
export function pilate(c, { pose: P = 'stand', k, holdF = '' } = {}) {
  const dy = DY[P];
  const band = c.ribbon([[25, -131 + dy], [19, -122 + dy], [2, -106 + dy], [-15, -84 + dy], [-26, -57 + dy]], 3.2);
  return addToBody(person(c, { ...LOOK.pilate, pose: P, k, holdF }), `<path d="${band}" fill="${C.plumRobe}"/>`);
}
/** a temple guard (the council's men): linen, a short cudgel */
export function guard(c, i = 0, { k } = {}) {
  const o = { robe: [C.dustyBlue, C.tealRobe][i % 2], mantle: null, belt: C.leather, skin: [C.skin3, C.skin2][i % 2], hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.stone2, beard: 'short', k };
  return person(c, o);
}

/* ================================================================== small props */

/** rope loops around the wrists (hold markup for the front hand) */
export function bonds(c) {
  return `<path d="${c.ribbon(c.arc(0, -4, 8, 3.2, 0, PI * 2, 14), 2.2) + c.ribbon(c.arc(0, 1, 8.5, 3.2, 0, PI * 2, 14), 2.2)}" fill="${C.rope}"/>`;
}
/** a straight rope from (0,0) to (100,0) with a small sag: pose it with r & sx */
export function ropeLine(c) {
  return `<path d="${c.ribbon(c.qbez([0, 0], [50, 7], [100, 0], 12), 2.4)}" fill="${C.rope}"/>`;
}
/** a thorn crown woven of two twisted stems (head coords, sits on the hair) */
export function thornWreath(c) {
  const s = sheet();
  const a = c.arc(0, -13, 21, 6.5, PI * 0.92, PI * 2.08, 22);
  const b = a.map(([x, y], i) => [x, y + Math.sin(i * 1.3) * 2.2]);
  s.p(c.ribbon(a, 3.4), C.thorn);
  s.p(c.ribbon(b, 2.4), C.thorn2);
  let th = '';
  for (let i = 1; i < a.length - 1; i += 2) { const [x, y] = a[i], sd = i % 4 === 1 ? -1 : 1; th += c.poly([[x - 1.6, y], [x + c.rr(-3, 3), y + sd * c.rr(4.5, 6.5)], [x + 1.6, y]]); }
  s.x(th, C.thorn2);
  return s.out();
}
/** a purple cloak lying loose (for dropping onto shoulders); origin: top centre */
export function purpleCloak(c, col = PURPLE) {
  const s = sheet();
  s.p(c.cut([[-40, 0], [40, -4], [58, 40], [66, 120], [40, 150], [0, 142], [-40, 150], [-64, 118], [-56, 40]], 0.9, 7), col);
  s.x(c.ribbon([[-20, 10], [-26, 138]], 2.4) + c.ribbon([[18, 8], [26, 136]], 2.4), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
export const PURPLE = mix(C.plumRobe, C.indigo, 0.35);

/** Pilate's folding judge's seat (sella curulis); origin: floor centre */
export function curuleSeat(c) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([-36, 0], [-2, -12], [32, -36], 8), 5) + c.ribbon(c.qbez([32, 0], [-2, -12], [-36, -36], 8), 5), C.sun);
  s.p(c.cut(c.rect(-44, -42, 88, 8), 0.3, 5), shade(C.sun, -0.12));
  s.p(c.cut(c.blob(0, -44, 40, 5, 10, 0.1), 0.3, 4), C.plumRobe);
  return s.out();
}
/** a stepped dais; origin: front centre of the floor */
export function dais(c, w = 300, h = 60, col = C.stone) {
  const s = sheet();
  for (let i = 0; i < 3; i++) { const ww = w - i * 36, y = -i * (h / 3); s.p(c.cut(c.rect(-ww / 2, y - h / 3, ww, h / 3 + 2), 0.4, 8), i % 2 ? shade(col, -0.06) : col); }
  s.x(c.ribbon([[-w / 2 + 6, -h / 3 + 2], [w / 2 - 6, -h / 3 + 2]], 1.4) + c.ribbon([[-w / 2 + 24, -2 * h / 3 + 2], [w / 2 - 24, -2 * h / 3 + 2]], 1.4), shade(col, -0.18), 'opacity=".6"');
  return s.out();
}
/** the eagle standard (aquila); origin: foot of the pole */
export function eagleStandard(c, h = 330) {
  const s = sheet();
  s.p(c.cut(c.rect(-3.5, -h, 7, h), 0.3, 8), C.wood2);
  // plaque, discs
  s.p(c.cut(c.rect(-22, -h + 96, 44, 22), 0.3, 4), C.curtain2);
  [0, 1].forEach((i) => s.p(c.cut(c.circ(0, -h + 136 + i * 30, 11, 16), 0.3, 3), C.sun));
  // wreath around the eagle's feet
  s.p(c.ribbon(c.arc(0, -h + 44, 20, 16, PI * 0.1, PI * 0.9, 10), 4), shade(C.sun, -0.1));
  // the eagle, wings raised
  const e = sheet();
  const y0 = -h + 30;
  e.p(c.cut([[-8, y0], [-10, y0 - 22], [-4, y0 - 34], [6, y0 - 36], [12, y0 - 30], [10, y0 - 14], [6, y0]], 0.3, 3), C.sun);
  e.p(c.cut([[-6, y0 - 26], [-26, y0 - 36], [-40, y0 - 62], [-30, y0 - 58], [-22, y0 - 66], [-16, y0 - 54], [-4, y0 - 34]], 0.4, 3), C.sun);
  e.p(c.cut([[6, y0 - 26], [26, y0 - 36], [38, y0 - 64], [30, y0 - 58], [22, y0 - 66], [16, y0 - 54], [4, y0 - 34]], 0.4, 3), shade(C.sun, -0.08));
  e.p(c.cut(c.circ(9, y0 - 40, 6.5, 10), 0.2, 3), C.sun);
  e.x(c.poly([[14, y0 - 42], [20, y0 - 38], [14, y0 - 37]]), C.ochre);
  e.x(c.poly(c.circ(10, y0 - 41, 1.2, 6)), C.ink);
  const txt = `<text x="0" y="${-h + 112}" text-anchor="middle" font-family="${FONT}" font-size="13" font-weight="600" fill="${C.sun}">SPQR</text>`;
  return s.out() + e.out() + txt;
}
/** a red banner on a crossbar (vexillum); origin: foot of the pole */
export function vexillum(c, h = 300) {
  const s = sheet();
  s.p(c.cut(c.rect(-3, -h, 6, h), 0.3, 8), C.wood2);
  s.p(c.cut(c.rect(-38, -h + 16, 76, 6), 0.3, 4), C.wood2);
  const pts = [[-34, -h + 22], [34, -h + 22], [34, -h + 100]];
  for (let x = 34; x > -34; x -= 10) pts.push([x - 5, -h + 108], [x - 10, -h + 100]);
  s.p(c.cut(pts, 0.5, 6), C.curtain);
  s.x(c.poly(c.star(0, -h + 60, 13, 5, 6, 0)), C.sun);
  return s.out();
}
/** a lampstand with a flame (flame in .flame, glow in .glow); origin: foot */
export function standLamp(c, h = 170) {
  const s = sheet();
  s.p(c.cut([[-24, 0], [-14, -8], [-4, -12], [-4, -h], [4, -h], [4, -12], [14, -8], [24, 0]], 0.4, 6), shade(C.sun, -0.1));
  s.p(c.cut([[-18, -h], [18, -h], [12, -h - 10], [-12, -h - 10]], 0.3, 4), C.sun);
  return `<circle class="glow" cx="0" cy="${-h - 24}" r="120" fill="url(#warm-glow)"/>${s.out()}<g class="flame" transform="translate(0 ${-h - 10})"><path d="M0 0C-8 -6 -7 -18 0 -34C7 -18 8 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -3C-3.4 -7 -3.4 -13 0 -20C3.4 -13 3.4 -7 0 -3Z" fill="#fff4d2"/></g>`;
}
/** a red swag of cloth hung between two columns (x0 → x1 at height y) */
export function swag(c, x0, x1, y, drop = 60, col = C.curtain) {
  const s = sheet();
  const top = c.qbez([x0, y], [(x0 + x1) / 2, y + 8], [x1, y], 10);
  const bot = c.qbez([x1, y + 10], [(x0 + x1) / 2, y + drop * 2], [x0, y + 10], 16);
  s.p(c.cut([...top, ...bot], 0.6, 8), col);
  s.x(c.ribbon(c.qbez([x0 + 20, y + 12], [(x0 + x1) / 2, y + drop * 1.4], [x1 - 20, y + 12], 14), 3), shade(col, -0.15), 'opacity=".6"');
  s.p(c.cut([[x0 - 8, y - 4], [x0 + 8, y - 4], [x0 + 6, y + 70], [x0 - 6, y + 70]], 0.4, 5) + c.cut([[x1 - 8, y - 4], [x1 + 8, y - 4], [x1 + 6, y + 70], [x1 - 6, y + 70]], 0.4, 5), shade(col, -0.1));
  return s.out();
}
/** a scroll with a red seal (a decree / a permission); origin centre */
export function sealedScroll(c, w = 54) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -12, w, 24), 0.3, 5), C.parchment);
  s.p(c.cut(c.ell(-w / 2, 0, 4, 13, 10), 0.2, 3) + c.cut(c.ell(w / 2, 0, 4, 13, 10), 0.2, 3), C.wood2);
  let d = '';
  for (let i = 0; i < 3; i++) d += c.ribbon([[-w / 2 + 8, -5 + i * 5], [w / 2 - 10 - (i === 2 ? 14 : 0), -5 + i * 5]], 1.2);
  s.x(d, C.ink, 'opacity=".45"');
  s.p(c.cut(c.blob(w / 2 - 12, 7, 7, 7, 9, 0.15), 0.3, 3), C.terracotta);
  s.x(c.ribbon([[w / 2 - 14, 12], [w / 2 - 18, 22]], 2.4) + c.ribbon([[w / 2 - 10, 12], [w / 2 - 6, 22]], 2.4), C.terracotta);
  return s.out();
}
/** an hourglass (for "how long?") ; origin centre */
export function hourglass(c, h = 34) {
  const s = sheet();
  s.p(c.cut(c.rect(-h * 0.36, -h / 2 - 3, h * 0.72, 4), 0.2, 3) + c.cut(c.rect(-h * 0.36, h / 2 - 1, h * 0.72, 4), 0.2, 3), C.wood2);
  s.p(c.cut([[-h * 0.28, -h / 2 + 1], [h * 0.28, -h / 2 + 1], [3, 0], [h * 0.28, h / 2 - 1], [-h * 0.28, h / 2 - 1], [-3, 0]], 0.2, 3), C.skyVeil);
  s.x(c.poly([[-h * 0.2, h / 2 - 2], [h * 0.2, h / 2 - 2], [0, h * 0.18]]) + c.poly([[-h * 0.1, -h * 0.14], [h * 0.1, -h * 0.14], [0, -2]]), C.sand2);
  return s.out();
}
/** a small cross with a white linen cloth over its arms (the burial asked for); origin centre */
export function shroudCross(c, h = 44) {
  const s = sheet();
  s.p(c.cut(c.rect(-2.5, -h / 2, 5, h), 0.2, 4) + c.cut(c.rect(-h * 0.3, -h * 0.26, h * 0.6, 5), 0.2, 4), C.wood2);
  s.p(c.cut([[-h * 0.3, -h * 0.25], [h * 0.3, -h * 0.25], [h * 0.24, h * 0.3], [h * 0.1, h * 0.12], [0, h * 0.02], [-h * 0.1, h * 0.12], [-h * 0.24, h * 0.3]], 0.4, 3), C.linen);
  return s.out();
}
/** two dice (one shows 3, the other 5) — each in its own group .d0/.d1; origin centre */
export function dice(c) {
  const die = (pips) => {
    const s = sheet().p(c.cut(c.rect(-8, -8, 16, 16), 0.3, 3), C.cream);
    s.x(pips.map(([x, y]) => c.poly(c.circ(x * 4.4, y * 4.4, 1.5, 6))).join(''), C.ink);
    return s.out();
  };
  return `<g class="d0">${die([[-1, -1], [0, 0], [1, 1]])}</g><g class="d1">${die([[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]])}</g>`;
}
/** Jesus' own garments, folded on the ground: the white tunic and the rose mantle (each its own group) */
export function garments(c) {
  const t = sheet().p(c.cut([[-34, -8], [30, -12], [36, 0], [-30, 4]], 0.5, 5), C.linen).x(c.ribbon([[-26, -4], [26, -6]], 1.2), C.linen2);
  const m = sheet().p(c.cut([[-30, -10], [26, -14], [34, -2], [-26, 2]], 0.5, 5), C.jesusMantle).x(c.ribbon([[-20, -6], [22, -8]], 1.2), shade(C.jesusMantle, -0.15));
  return { tunic: t.out(), mantle: m.out() };
}
/** a soldier's cup of wine mixed with myrrh (hold markup) */
export function wineCup(c) {
  return sheet().p(c.cut([[-7, -14], [7, -14], [5, -4], [1.4, -2], [1.4, 4], [5, 7], [-5, 7], [-1.4, 4], [-1.4, -2], [-5, -4]], 0.2, 3), C.sun)
    .x(c.poly(c.ell(0, -13, 6, 1.6, 10)), shade(C.plumRobe, -0.35)).out();
}
/** a hoe on the shoulder (hold markup for a hand, handle along the arm) */
export function hoe(c) {
  return sheet().p(c.ribbon([[0, 30], [0, -110]], 4), C.wood3).p(c.cut([[-3, 30], [16, 32], [18, 44], [-3, 38]], 0.3, 3), C.rock3).out();
}
/** the heavy crossbeam carried on a shoulder; origin: the middle of the beam, lying along x */
export function beam(c, w = 190, h = 16) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 1], [w / 2 + 2, h / 2], [-w / 2 - 1, h / 2 + 1]], 0.6, 8), C.wood);
  s.x(c.ribbon([[-w / 2 + 8, -2], [w / 2 - 10, -3]], 1.4) + c.ribbon([[-w / 2 + 30, 3], [w / 2 - 40, 3]], 1.1), shade(C.wood, -0.2), 'opacity=".6"');
  return s.out();
}
/** a sponge on a long reed; origin: the hand end, reed along -y */
export function spongeReed(c, len = 230) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [2, -len]], 2.6), C.wheat2);
  s.p(c.cut(c.blob(2, -len - 8, 9, 7, 9, 0.25), 0.4, 3), C.sand2);
  return s.out();
}
/** a clay jar (of sour wine); origin: base */
export function jar(c, h = 40, col = C.pot) {
  return sheet().p(c.cut([[-9, -h], [9, -h], [8, -h + 6], [15, -h + 16], [14, -8], [8, 0], [-8, 0], [-14, -8], [-15, -h + 16], [-8, -h + 6]], 0.4, 4), col)
    .x(c.ribbon([[-13, -h + 18], [13, -h + 18]], 1.4), shade(col, -0.2), 'opacity=".6"').out();
}
/** a roll of white linen; origin centre */
export function linenRoll(c, w = 60) {
  return sheet().p(c.cut(c.rect(-w / 2, -9, w, 18), 0.3, 5), C.linen).p(c.cut(c.ell(w / 2, 0, 4, 9, 10), 0.2, 3), C.linen2)
    .x(c.ribbon([[-w / 2 + 6, -3], [w / 2 - 4, -3]], 1), C.linen2).out();
}
/** the body wrapped in white linen, lying along x (length ~150); origin centre */
export function shroud(c, len = 150) {
  const s = sheet();
  const L = len / 2;
  s.p(c.cut([[-L, -6], [-L + 14, -16], [-L + 34, -18], [L - 40, -16], [L - 14, -12], [L, -4], [L - 6, 8], [L - 40, 12], [-L + 30, 13], [-L + 6, 8]], 0.6, 6), '#fbf7ee');
  let d = '';
  for (let x = -L + 26; x < L - 16; x += 22) d += c.ribbon([[x, -17], [x + 8, 12]], 1.2);
  s.x(d, C.linen2, 'opacity=".8"');
  return `<circle r="${len * 0.7}" fill="url(#halo-glow)" opacity=".35"/>${s.out()}`;
}
/** a litter (two poles and a cloth sling); origin centre */
export function litter(c, len = 190) {
  const s = sheet();
  s.p(c.ribbon([[-len / 2 - 20, 0], [len / 2 + 20, 0]], 4), C.wood2);
  s.p(c.cut([[-len / 2, -2], [len / 2, -2], [len / 2 - 8, 10], [-len / 2 + 8, 10]], 0.4, 6), C.stone2);
  return s.out();
}

/* ================================================================== paper words */

/** a grey paper taunt: a jagged mocking bubble (tail at the origin) */
export function taunt(c, lines, { size = 18, side = 1, w } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.6;
  const hh = lines.length * size * 1.15 + size * 0.9;
  const cx = side * (ww / 2 - 18), cy = -hh / 2 - 22;
  const s = sheet();
  const p = [], n = Math.max(22, Math.round(ww / 12) * 2);
  for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2, k = i % 2 ? 1 : 1.12; p.push([cx + Math.cos(a) * (ww / 2 + 6) * k, cy + Math.sin(a) * (hh / 2 + 5) * k]); }
  s.p(c.cut(p, 0.4, 5), '#a9a6ae');
  s.p(c.cut([[side * 8, -hh * 0.2 - 16], [0, 0], [side * 24, -hh * 0.2 - 14]], 0.3, 4), '#a9a6ae');
  const t0 = cy - ((lines.length - 1) * size * 1.15) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="${cx.toFixed(1)}" y="${(t0 + i * size * 1.15).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="#34313a">${l}</text>`).join('');
  return s.out() + txt;
}
/** a word on a small hanging board (the inscription); origin: top of the string */
export function board(c, lines, { size = 22, w, col = mix(C.wood3, C.parchment, 0.5), ink = C.ink } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.62 + size * 1.4;
  const hh = lines.length * size * 1.2 + size * 0.7;
  const s = sheet().p(c.cut(c.rect(-ww / 2, 0, ww, hh), 0.5, 6), col);
  s.x(c.ribbon([[-ww / 2 + 6, hh - 5], [ww / 2 - 6, hh - 5]], 1.2), shade(col, -0.2), 'opacity=".6"');
  const txt = lines.map((l, i) => `<text x="0" y="${(size * 0.95 + i * size * 1.2 + size * 0.1).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="600" letter-spacing="1" fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}

/* ================================================================== the crosses */

/**
 * A cross in silhouette with (optionally) the crucified one on it, arms along the beam.
 * origin: the foot of the cross; parts: .hd (the head, pivot at the neck), .hl (halo), .fig (the body)
 */
export function crossSil(c, { h = 240, figure = true, halo = false, col = INK, k } = {}) {
  const u = h / 240;
  const by = -h + 52 * u;
  let d = c.cut([[-6 * u, 0], [-5 * u, -h], [5 * u, -h - 1], [6 * u, 0]], 0.4, 8) + c.cut([[-62 * u, by - 5 * u], [62 * u, by - 6 * u], [62 * u, by + 5 * u], [-62 * u, by + 6 * u]], 0.4, 8);
  let fig = '', hd = '', hl = '';
  if (figure) {
    // arms, torso, loincloth, legs: one soft silhouette
    fig = c.cut([
      [-58 * u, by - 3 * u], [-12 * u, by + 1 * u], [-9 * u, by - 1 * u], [9 * u, by - 1 * u], [12 * u, by + 1 * u], [58 * u, by - 3 * u],
      [58 * u, by + 4 * u], [13 * u, by + 9 * u], [10 * u, by + 44 * u], [14 * u, by + 58 * u], [8 * u, by + 66 * u], [5 * u, by + 108 * u], [3 * u, by + 122 * u],
      [-3 * u, by + 122 * u], [-5 * u, by + 108 * u], [-8 * u, by + 66 * u], [-14 * u, by + 58 * u], [-10 * u, by + 44 * u], [-13 * u, by + 9 * u], [-58 * u, by + 4 * u],
    ], 0.3, 4);
    hd = c.cut(c.circ(0, -11 * u, 8.5 * u, 14), 0.2, 3);
    if (halo) hl = `<circle r="${34 * u}" fill="url(#halo-glow)"/><path d="${c.ribbon(c.arc(0, 0, 14 * u, 14 * u, 0, PI * 2, 28), 2.2 * u)}" fill="${C.haloRim}"/>`;
  }
  return `<g${k_(k)}><path d="${d}" fill="${col}"/>${figure ? `<g class="fig"><path d="${fig}" fill="${col}"/></g><g class="hd" transform="translate(0 ${(by - 2 * u).toFixed(1)})"><g class="hl">${hl}</g><path d="${hd}" fill="${col}"/></g>` : ''}</g>`;
}
/** where the head of a crossSil sits (relative to the foot) */
export const crossHead = (h) => [0, -h + 52 * (h / 240) - 2 * (h / 240) - 11 * (h / 240)];

/** the bare hill of Golgotha: a rounded rock with two faint hollows; origin: top centre */
export function skullHill(c, { w = 900, h = 260, col = mix(C.rock2, C.dune, 0.35) } = {}) {
  const s = sheet();
  const pts = [[-w / 2 - 300, h + 400], [-w / 2 - 300, h], [-w / 2, h * 0.78], [-w * 0.32, h * 0.42], [-w * 0.2, h * 0.14], [-w * 0.1, 2], [0, 0], [w * 0.1, 2], [w * 0.2, h * 0.14], [w * 0.32, h * 0.42], [w / 2, h * 0.78], [w / 2 + 300, h], [w / 2 + 300, h + 400]];
  s.p(c.cut(pts, 2.4, 12), col);
  s.x(c.cut(c.blob(-w * 0.12, h * 0.46, w * 0.05, h * 0.06, 10, 0.2), 1, 5) + c.cut(c.blob(w * 0.12, h * 0.46, w * 0.05, h * 0.06, 10, 0.2), 1, 5), shade(col, -0.18), 'opacity=".55"');
  s.x(c.cut(c.blob(-w * 0.26, h * 0.34, w * 0.12, h * 0.05, 10, 0.3), 1, 6) + c.cut(c.blob(w * 0.3, h * 0.5, w * 0.1, h * 0.05, 10, 0.3), 1, 6), shade(col, 0.2), 'opacity=".5"');
  return s.out();
}
/** a far-off Jerusalem: walls, roofs and the white sanctuary; origin: ground centre */
export function farCity(c, sc = 1, { col = mix(C.stone, C.rock, 0.3) } = {}) {
  const s = sheet();
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  const wall = [[-260, 0], [-260, -40], [-230, -40], [-230, -58], [-208, -58], [-208, -40], [120, -40], [120, -60], [144, -60], [144, -40], [260, -40], [260, 0]];
  let roofs = '';
  for (let i = 0; i < 16; i++) { const x = -250 + i * 32 + c.rr(-6, 6), w = c.rr(20, 34), hh = c.rr(14, 34); roofs += c.cut(P(c.rect(x, -40 - hh, w, hh + 4)), 0.3, 5); }
  s.p(roofs, shade(col, 0.08));
  s.p(c.cut(P(wall), 0.5, 8), col);
  s.p(c.cut(P([[-40, -40], [-40, -118], [-26, -118], [-26, -150], [26, -150], [26, -118], [40, -118], [40, -40]]), 0.4, 6), mix(C.cream, C.linen, 0.5));
  s.x(c.poly(P(c.rect(-8, -104, 16, 40))), mix(C.plumRobe, C.cream, 0.3));
  s.x(c.poly(P(c.rect(-28, -152, 56, 5))), C.sun);
  return s.out();
}
/**
 * The hour-dial across the sky: twelve Roman numerals on a dotted arc (the hours of the day).
 * returns { el, at(h) → [x, y] }. Hang it on a far layer.
 */
export function hourDial(S, L, { cx = 800, cy = 600, rx = 540, ry = 430 } = {}) {
  const c = S.c;
  const at = (h) => { const a = PI * (1.1 + ((h - 0.5) / 12) * 0.8); return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; };
  const NUM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  let dots = '';
  for (let i = 0; i <= 60; i++) { const [x, y] = at(0.5 + (i / 60) * 12); dots += c.poly(c.circ(x, y, 1.6, 6)); }
  let nums = '';
  NUM.forEach((n, i) => {
    const [x, y] = at(i + 1);
    nums += `<g data-k="hr${i + 1}" transform="translate(${x.toFixed(1)} ${(y - 44).toFixed(1)})"><path d="${c.cut(c.rect(-15, -12, 30, 22), 0.4, 5)}" fill="${C.cream}" opacity=".85"/><text x="0" y="4.5" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.ink}">${n}</text></g>`;
  });
  const el = L.add(`<g><path d="${dots}" fill="${C.cream}" opacity=".7"/>${nums}</g>`);
  return { el, at };
}

/** a stormy sky palette set */
export const SKIES = {
  dawn: ['#8d88ad', '#e2b0a0', '#f5d3b4'],
  morning: ['#c9d6d6', '#efe2c9', '#f6e4c6'],
  storm: ['#8e8c9e', '#c9b9a8', '#e5d2b6'],
  grey: ['#6f7187', '#a59d9f', '#cdbca6'],
  dark: ['#0d0f22', '#1a1c33', '#2a2638'],
  after: ['#565a7a', '#b69c96', '#efcf9f'],
  dusk: ['#5a5480', '#d39a8a', '#f2c296'],
  night: ['#141833', '#26294d', '#4e4768'],
};

/* ================================================================== sets */

/**
 * Pilate's hall: an open colonnade looking out over the city, red swags, a pavement floor,
 * the judge's dais with the curule seat and the eagle standard. evening: dusk sky and lit lamps.
 * returns { sk, lamps: [{flame, glow}], FLOOR, SEAT:[x,y], charL, fxL, fgL }
 */
export function hallSet(S, { evening = false } = {}) {
  const c = S.c;
  const pal = evening ? SKIES.dusk : SKIES.dawn;
  const sk = sky(S, pal);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const orb = evening
    ? hanging(hangL, `<circle r="130" fill="url(#warm-glow)" opacity=".8"/>${sunCut(c, 44, { disc: C.apricot, inner: C.peach, rays: C.sunDeep })}`, { x: 800, y: 330, len: 800 })
    : hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".8"/>${sunCut(c, 40, { disc: C.peach, inner: C.dawn, rays: C.apricot })}`, { x: 690, y: 400, len: 800 });
  const cl = hanging(hangL, cloud(c, 170, evening ? mix(C.dusk, C.cream, 0.4) : C.dawn, evening ? C.dusk : C.peach), { x: 610, y: 250, len: 700 });
  // the city beyond the colonnade
  const far = S.layer({ par: 0.12, sh: 2 });
  const hcol = evening ? mix(C.duskViolet, C.dusk, 0.4) : mix(C.hillFar, C.dawn, 0.4);
  far.add(band(c, { y: 470, amps: [16, 8, 3], lens: [900, 300, 110], color: hcol }).markup);
  far.add(town(c, { x: 640, y: 482, n: 7, spread: 260, sc: 0.6, wall: mix(C.plaster, hcol, 0.3), shadow: mix(C.plaster2, hcol, 0.4), lit: evening }));
  far.add(town(c, { x: 990, y: 486, n: 6, spread: 240, sc: 0.55, wall: mix(C.plaster, hcol, 0.3), shadow: mix(C.plaster2, hcol, 0.4), lit: evening }));
  // the colonnade
  const wall = S.layer({ par: 0.3, sh: 4 });
  const W = sheet();
  const stone = C.stone, stone2 = C.stone2;
  W.p(c.cut([[-900, -1400], [2500, -1400], [2500, 176], [-900, 176]], 0.6, 20), mix(stone, C.plaster2, 0.3));
  W.p(c.cut([[-900, 150], [2500, 150], [2500, 182], [-900, 182]], 0.5, 12), shade(stone2, -0.05));
  let dent = '';
  for (let x = -880; x < 2500; x += 34) dent += c.poly(c.rect(x, 128, 18, 14));
  W.x(dent, stone2);
  W.p(c.cut([[-900, 488], [2500, 488], [2500, 566], [-900, 566]], 0.5, 12), mix(stone, C.sand, 0.25)); // parapet
  let rail = '';
  for (let x = -880; x < 2500; x += 28) rail += c.cut(c.rect(x, 498, 12, 60), 0.3, 5);
  W.x(rail, shade(stone, -0.08), 'opacity=".6"');
  wall.add(W.out());
  const cols = [-60, 150, 360, 560, 1040, 1240, 1450, 1660];
  let colM = '';
  cols.forEach((x) => { colM += column(c, x, 566, 390, 46, stone); });
  wall.add(colM);
  let sw = '';
  for (let i = 0; i < cols.length - 1; i++) if (!(cols[i] === 560)) sw += swag(c, cols[i], cols[i + 1], 186, 44, evening ? shade(C.curtain, -0.12) : C.curtain);
  sw += swag(c, 560, 1040, 186, 30, evening ? shade(C.curtain2, -0.12) : C.curtain2);
  wall.add(sw);
  // floor
  const floorL = S.layer({ par: 0.36, sh: 2 });
  const F = sheet();
  F.p(c.cut([[-900, 566], [2500, 566], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.stone, C.sand, 0.35));
  let lines = '';
  [606, 660, 730, 820].forEach((y) => { lines += c.ribbon([[-900, y], [2500, y]], 1.3); });
  for (let i = -12; i <= 12; i++) lines += c.ribbon([[800 + i * 70, 566], [800 + i * 150, 900]], 1.2);
  F.x(lines, shade(C.stone2, -0.1), 'opacity=".45"');
  let tiles = '';
  for (let i = -6; i <= 6; i++) tiles += c.poly([[800 + i * 110 - 18, 690], [800 + i * 110, 680], [800 + i * 110 + 18, 690], [800 + i * 110, 700]]);
  F.x(tiles, C.terracotta, 'opacity=".35"');
  floorL.add(F.out());
  // the judgement seat
  const props = S.layer({ par: 0.45, sh: 5 });
  const SEAT = [1120, 600];
  props.add(`<g transform="translate(975 640)">${vexillum(c, 330)}</g>`);
  props.add(`<g transform="translate(1236 612)">${eagleStandard(c, 360)}</g>`);
  props.add(`<g transform="translate(1110 660)">${dais(c, 340, 60)}</g>`);
  props.add(`<g transform="translate(${SEAT[0]} ${SEAT[1]})">${curuleSeat(c)}</g>`);
  // lamps (lit only in the evening)
  const lamps = [];
  [[430, 612], [1330, 640]].forEach(([x, y], i) => {
    const el = props.add(`<g transform="translate(${x} ${y})">${standLamp(c, 190 - i * 10)}</g>`);
    lamps.push({ flame: el.querySelector('.flame'), glow: el.querySelector('.glow'), h: 190 - i * 10 });
  });
  const charL = S.layer({ par: 0.55, sh: 5 });
  const fxL = S.layer({ par: 0.58, sh: 4 });
  const fgL = S.layer({ par: 0.95, sh: 7 });
  fgL.add(column(c, -120, 1100, 1300, 90, shade(stone, -0.04)) + column(c, 1720, 1100, 1300, 90, shade(stone, -0.04)));
  return { sk, pal, orb, cl, lamps, SEAT, charL, fxL, fgL, props };
}
/** light / snuff a standLamp from hallSet (k: 0 out → 1 burning) */
export function lampSet(l, k, time) {
  pose(l.flame, { x: 0, y: -l.h - 10, sy: k * (1 + Math.sin(time * 9 + l.h) * 0.07), sx: k, o: k > 0.02 ? 1 : 0 });
  if (l.glow) pose(l.glow, { o: k * (0.85 + Math.sin(time * 5 + l.h) * 0.1) });
}

/**
 * The square in front of the praetorium: a raised stone platform (Gabbatha) with a colonnade behind,
 * Barabbas' barred cell in its base, the city on the hills beyond. PLAT: y of the platform top.
 * returns { sk, cellDoor, charL (on the platform), cellL, crowdL, fxL, fgL }
 */
export const PLAT = 452;
export function squareSet(S, { pal = SKIES.morning } = {}) {
  const c = S.c;
  const sk = sky(S, pal);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const sunEl = hanging(hangL, sunCut(c, 44), { x: 1230, y: 150, len: 800 });
  const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 150, len: 700 });
  const cl2 = hanging(hangL, cloud(c, 130, C.cream), { x: 1050, y: 110, len: 700 });
  const far = S.layer({ par: 0.1, sh: 2 });
  far.add(band(c, { y: 380, amps: [16, 8, 3], lens: [900, 300, 110], color: C.hillFar }).markup);
  far.add(`<g transform="translate(330 386)">${farCity(c, 0.8)}</g>`);
  far.add(town(c, { x: 1260, y: 392, n: 7, spread: 300, sc: 0.55 }));
  // the praetorium facade and the platform
  const bld = S.layer({ par: 0.3, sh: 4 });
  const B = sheet();
  B.p(c.cut([[430, PLAT - 250], [1170, PLAT - 250], [1170, PLAT], [430, PLAT]], 0.5, 12), mix(C.stone, C.plaster2, 0.3));
  B.p(c.cut([[400, PLAT - 250], [800, PLAT - 330], [1200, PLAT - 250], [1200, PLAT - 236], [400, PLAT - 236]], 0.6, 10), C.stone2);
  B.p(c.cut([[460, PLAT - 250], [800, PLAT - 316], [1140, PLAT - 250]], 0.4, 10), mix(C.stone, C.cream, 0.3));
  B.x(c.poly(c.circ(800, PLAT - 272, 13, 14)), C.sun);
  B.p(c.cut([[380, PLAT], [1220, PLAT], [1220, PLAT + 14], [380, PLAT + 14]], 0.4, 10), shade(C.stone2, -0.05));
  B.p(c.cut([[390, PLAT + 14], [1210, PLAT + 14], [1210, PLAT + 190], [390, PLAT + 190]], 0.5, 12), mix(C.stone, C.sand, 0.3));
  let courses = '';
  for (let y = PLAT + 40; y < PLAT + 190; y += 26) courses += c.ribbon([[392, y], [1208, y]], 1.2);
  B.x(courses, shade(C.stone2, -0.12), 'opacity=".5"');
  bld.add(B.out());
  let colM = '';
  [480, 610, 990, 1120].forEach((x) => { colM += column(c, x, PLAT, 236, 36, C.stone); });
  bld.add(colM);
  bld.add(swag(c, 610, 990, PLAT - 232, 26, C.curtain2));
  // steps down the front
  const steps = sheet();
  for (let i = 0; i < 4; i++) steps.p(c.cut(c.rect(660 - i * 18, PLAT + 14 + i * 44, 280 + i * 36, 46), 0.4, 8), i % 2 ? C.stone : shade(C.stone, -0.05));
  bld.add(steps.out());
  // the cell with bars, under the platform's right end
  const cellL = S.layer({ par: 0.3, sh: 2 });
  const CELL = { x: 1060, y: PLAT + 180, w: 180, h: 158 };
  cellL.add(sheet().p(c.cut(c.rect(CELL.x - CELL.w / 2, CELL.y - CELL.h, CELL.w, CELL.h), 0.4, 6), mix(C.soil, C.stone2, 0.3)).x(c.poly([[CELL.x - 40, CELL.y - CELL.h], [CELL.x - 10, CELL.y - CELL.h], [CELL.x + 30, CELL.y], [CELL.x - 20, CELL.y]]), '#ffe7b8', 'opacity=".25"').out());
  const cellIn = S.layer({ par: 0.3, sh: 2 });
  const barsL = S.layer({ par: 0.3, sh: 3 });
  const bars = sheet();
  let bd = '';
  for (let x = CELL.x - CELL.w / 2 + 12; x < CELL.x + CELL.w / 2; x += 20) bd += c.cut(c.rect(x, CELL.y - CELL.h, 6, CELL.h), 0.2, 6);
  bd += c.cut(c.rect(CELL.x - CELL.w / 2, CELL.y - CELL.h + 30, CELL.w, 6), 0.2, 6);
  bars.p(bd, C.rock3);
  const door = barsL.add(`<g>${bars.out()}</g>`);
  barsL.add(sheet().p(c.cut([[CELL.x - CELL.w / 2 - 10, CELL.y - CELL.h - 10], [CELL.x + CELL.w / 2 + 10, CELL.y - CELL.h - 10], [CELL.x + CELL.w / 2 + 10, CELL.y - CELL.h], [CELL.x - CELL.w / 2 - 10, CELL.y - CELL.h]], 0.3, 6), C.stone2).out());
  const charL = S.layer({ par: 0.32, sh: 5 });
  const ground = S.layer({ par: 0.4, sh: 2 });
  ground.add(sheet().p(c.cut([[-900, PLAT + 186], [2500, PLAT + 186], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.sand, C.stone, 0.4)).out());
  const crowdL = S.layer({ par: 0.55, sh: 4 });
  const fxL = S.layer({ par: 0.6, sh: 4 });
  const fgL = S.layer({ par: 0.95, sh: 7 });
  return { sk, sunEl, cl1, cl2, hangL, door, CELL, charL, cellIn, crowdL, fxL, fgL, ground };
}
/** the golgotha hill position (distance view) */
export const GOL = { x: 800, top: 420, H: 206, sides: [[666, 440, 166], [934, 440, 166]] };

/** a short chain dangling from a hand (hold markup) */
export function handChain(c) {
  let d = '';
  for (let i = 0; i < 5; i++) d += i % 2 ? c.cut(c.rect(-1.2, 4 + i * 7, 2.4, 8), 0.1, 3) : c.cut(c.ell(0, 8 + i * 7, 3, 5, 10), 0.1, 3) + c.hole(c.ell(0, 8 + i * 7, 1.4, 3, 8), 0.1, 3);
  return `<path d="${c.cut(c.ell(0, 0, 8, 4.4, 12), 0.2, 3)}" fill="${shade(C.rock3, -0.15)}"/><path d="${d}" fill="${C.rock3}"/>`;
}
/** the cast on the square: Pilate, Jesus and two soldiers on the platform, Barabbas and two rebels in the cell,
 *  the crowd (arriving from both sides) with two chief priests among them */
export function squareCast(S, H, { crowdIn = true } = {}) {
  const c = S.c;
  const P = H.charL;
  const sols = [0, 1].map((i) => S.puppet(P.add(soldier(c, i + 2))));
  const jes = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c) })));
  const pil = S.puppet(P.add(pilate(c)));
  const cl = H.cellIn;
  const rebels = [0, 1].map((i) => S.puppet(cl.add(person(c, { robe: [mix(C.soil, C.rock2, 0.5), mix(C.clay, C.soil, 0.5)][i], hair: C.hair3, hairStyle: i ? 'short' : 'wild', beard: 'wild', skin: [C.skin4, C.skin2][i], holdF: handChain(c) }))));
  const bar = S.puppet(cl.add(person(c, { ...LOOK.barabbas, holdF: handChain(c) })));
  const L = H.crowdL;
  const rows = [
    { y: 648, s: 0.72, n: 13, x0: 180, x1: 1420 },
    { y: 702, s: 0.86, n: 11, x0: 150, x1: 1450 },
    { y: 766, s: 1.02, n: 9, x0: 120, x1: 1480 },
  ];
  const people = [];
  const all = [];
  rows.forEach((r, ri) => {
    for (let i = 0; i < r.n; i++) {
      const x = lerp(r.x0, r.x1, (i + c.rr(0.2, 0.8)) / r.n);
      if (ri === 2 && Math.abs(x - 470) < 90) continue; // room for the priests
      all.push({ x, y: r.y + c.rr(-4, 4), s: r.s * c.rr(0.92, 1.06), ri, opts: crowdPerson(c) });
    }
  });
  all.sort((a, b) => a.y - b.y);
  all.forEach((m, i) => {
    people.push({ ...m, p: S.puppet(L.add(person(c, m.opts))), i, flip: m.x > 800, seed: c.rr(0, 9), delay: c.rr(0, 1), from: m.x < 800 ? c.rr(-600, -200) : c.rr(1800, 2200), shout: c.chance(0.7) });
  });
  const pr = [0, 1].map((i) => ({ i, p: S.puppet(L.add(priestM(c, i))), x: [420, 520][i], y: 770 - i * 6 }));
  return { sols, jes, pil, rebels, bar, people, pr };
}

/** a Roman soldier as a shadow-play silhouette (helmet, crest, spear) */
export function soldierSil(c, i = 0, { pose: P = 'stand', spear = true, col = INK } = {}) {
  const o = SOLDIER[i % SOLDIER.length];
  const helm = sheet().p(c.cut([...c.arc(0, -2, 21, 21, PI * 0.98, PI * 2.02, 14), [22, 1], [-22, 1]], 0.4, 4) + c.cut([[-7, -21], [-1, -33], [9, -35], [5, -21]], 0.4, 3) + c.cut([[-18, -1], [-10, -1], [-11, 12], [-17, 10]], 0.3, 3), col).out(false);
  const dy = DY[P];
  const sp = spear ? `<path d="${c.ribbon([[34, -4 + dy * 0.2], [34, -250]], 3)}" fill="${col}"/><path d="${c.poly([[29, -248], [34, -272], [39, -248]])}" fill="${col}"/>` : '';
  const m = person(c, { robe: col, mantle: i % 2 ? null : col, skin: col, hair: col, hairStyle: 'short', beard: o.beard, beardColor: col, belt: null, pose: P, halo: false }).split(`fill="${C.blush}"`).join(`fill="${col}"`).replace(/fill="#3a2a20"/g, `fill="${col}"`);
  return addToHead(addToBody(m, sp), helm);
}

/** the whole cross carried on a shoulder: origin at the crossing, the foot along +y (length ~ 300) */
export function carriedCross(c, { col = C.wood } = {}) {
  const s = sheet();
  s.p(c.cut([[-7, -62], [7, -63], [8, 244], [-8, 245]], 0.6, 9), col);
  s.p(c.cut([[-80, -8], [80, -9], [81, 8], [-80, 9]], 0.6, 9), shade(col, -0.06));
  s.x(c.ribbon([[-2, -50], [-1, 230]], 1.2) + c.ribbon([[-70, 1], [70, 0]], 1.1), shade(col, -0.22), 'opacity=".55"');
  return s.out();
}

/**
 * Golgotha seen from a distance: stormy sky on the fly-lines, far hills and Jerusalem, the bare hill with
 * its three crosses (each can rise from lying flat), a road across the foreground.
 * o: { pal, dial, near (0 far … 1 closer), dark (build a darkness sky + overlay) }
 * returns { sk, dark, hangL, clouds[], dial, crossC, crossL, crossR, hill, P (people layer), fx, fg, shade }
 */
export function golgothaSet(S, { pal = SKIES.storm, dial = false, dark = false, empty = false } = {}) {
  const c = S.c;
  const sk = sky(S, pal);
  const darkSky = dark ? sky(S, SKIES.dark, { name: 'dark' }) : null;
  if (darkSky) darkSky.layer.fade(0);
  const starL = dark ? S.layer({ par: 0.02, sh: 1, flat: true }) : null;
  if (starL) starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 400, n: 40 }));
  const hangL = S.layer({ par: 0.04, sh: 4 });
  // on a phone the dial is drawn narrower, so the outer hours stay inside the frame
  const D = dial ? hourDial(S, hangL, { cx: 800, cy: 530, rx: S.portrait ? 320 : 400, ry: 360 }) : null;
  const sunEl = dial ? hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".7"/>${sunCut(c, 34)}`, { x: 0, y: 0, len: 900 }) : null;
  const disc = dial ? hanging(hangL, sheet().p(c.cut(c.circ(0, 0, 52, 30), 0.6, 5), '#15142a').x(c.ribbon(c.arc(0, 0, 52, 52, 0, PI * 2, 30), 3), '#f4e2b0', 'opacity=".35"').out(), { x: 0, y: 0, len: 900 }) : null;
  const clouds = [[360, 150, 300], [1250, 130, 280], [820, 90, 220]].map(([x, y, w], i) => ({ x, y, el: hanging(hangL, stormCloud(c, w, i === 2 ? C.storm2 : C.storm, C.storm2), { x, y, len: 700 }) }));
  const farL = S.layer({ par: 0.08, sh: 2 });
  farL.add(band(c, { y: 470, amps: [14, 7, 3], lens: [900, 320, 120], color: mix(C.hillFar, C.stone2, 0.45) }).markup);
  farL.add(`<g transform="translate(330 474)">${farCity(c, 0.72)}</g>`);
  const hillL = S.layer({ par: 0.16, sh: 3 });
  hillL.add(`<g transform="translate(${GOL.x} ${GOL.top})">${skullHill(c, { w: 820, h: 260 })}</g>`);
  const crossC = hillL.add(`<g>${crossSil(c, { h: GOL.H, halo: true, figure: !empty })}</g>`);
  const crossL = hillL.add(`<g>${crossSil(c, { h: GOL.sides[0][2], figure: !empty })}</g>`);
  const crossR = hillL.add(`<g>${crossSil(c, { h: GOL.sides[1][2], figure: !empty })}</g>`);
  const onHill = S.layer({ par: 0.16, sh: 2 });
  const nearL = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(596, [8, 3], [800, 220]);
  nearL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1.2), mix(C.sand2, C.rock2, 0.4)).out());
  nearL.add(bush(c, 330, 600, 90, mix(C.olive, C.rock3, 0.3)) + rock(c, 1260, 604, 90, 30, C.rock2) + grass(c, { x0: -600, x1: 2300, y: 596, fn: gfn, n: 28, h: 12, color: mix(C.olive, C.rock3, 0.3) }));
  const roadL = S.layer({ par: 0.4, sh: 2 });
  roadL.add(sheet().p(c.cut([[-900, 640], [2500, 632], [2500, 1700], [-900, 1700]], 1, 14), mix(C.sand, C.stone2, 0.35)).x(c.ribbon([[-900, 700], [2500, 694]], 60), mix(C.sand2, C.stone2, 0.4), 'opacity=".6"').out());
  const dim = dark ? S.layer({ par: 0.4, sh: 1, flat: true }) : null;
  if (dim) { dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0c0d1f"/>`); dim.fade(0); }
  const P = S.layer({ par: 0.55, sh: 5 });
  const fx = S.layer({ par: 0.58, sh: 4 });
  const fg = S.layer({ par: 0.95, sh: 7 });
  fg.add(rock(c, 90, 960, 300, 110, C.rock2) + bush(c, 1560, 950, 220, mix(C.moss, C.rock3, 0.3)) + rock(c, 1720, 980, 260, 90, C.rock3));
  return { sk, darkSky, starL, hangL, dial: D, sunEl, disc, clouds, hillL, onHill, crossC, crossL, crossR, nearL, roadL, dim, P, fx, fg };
}
/** place the three crosses; k*: 0 lying flat → 1 upright */
export function setCrosses(G, kC = 1, kL = 1, kR = 1) {
  const R = (k) => (1 - ease3(k)) * 88;
  pose(G.crossC, { x: GOL.x, y: GOL.top + 2, r: R(kC), o: kC > 0.001 ? 1 : 0 });
  pose(G.crossL, { x: GOL.sides[0][0], y: GOL.sides[0][1], r: -R(kL), o: kL > 0.001 ? 1 : 0 });
  pose(G.crossR, { x: GOL.sides[1][0], y: GOL.sides[1][1], r: R(kR), o: kR > 0.001 ? 1 : 0 });
}
const ease3 = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** swing the clouds on their lines */
export function driftClouds(G, T, dy = 0) {
  G.clouds.forEach((cl, i) => kitSwing(cl.el, cl.x + Math.sin(T * 0.07 + i * 2) * 30, cl.y + dy, T, 0.8, 0.5, i));
}
