// Mark 9 — local cut-outs and helpers shared by this chapter's scenes.
// Everything returns SVG markup cut with the seeded scissors + sheet(); origins are noted per piece.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging } from '../kit.js';
import { band, hillsWith, rock, grass, olive, town, cloud, sun } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, speech, thought, GLYPH, spark, dust, cup, bowl, loaf, candle, scrollOpen, addToBody, addToHead, scribe } from '../mark2/lib.js';
export { voiceRings, hang2, dove, flapWings, JOHN_B, shadowShards, plate, flame } from '../mark1/lib.js';
export { TWELVE, houseSection, withFace, faceBits, along, headAt, handAt, bubble, strip, nameTag, question, stoneHeart, heart, wisp, shadowPerson, silhouette, man, woman, sparkle } from '../mark3/lib.js';

const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- the cast of this chapter ---------- */
export const LOOK = {
  // Moses: white-haired lawgiver in earthen robes
  moses: { robe: C.ochreRobe, mantle: C.terracotta, hair: C.greyHair, hairStyle: 'long', beard: 'wild', beardColor: C.greyHair, skin: C.skin3, belt: C.leather },
  // Elijah: the prophet's hairy mantle, wild grey hair
  elijah: { robe: mix(C.dune, C.stone, 0.35), fur: true, mantle: shade(C.clay, -0.08), hair: mix(C.greyHair, C.hair3, 0.4), hairStyle: 'wild', beard: 'wild', beardColor: mix(C.greyHair, C.hair3, 0.4), skin: C.skin2, belt: C.leather },
  // the boy's father
  father: { robe: C.tealRobe, mantle: C.stone, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3, belt: C.leather },
  // the boy (a puppet at ~0.6 scale)
  boy: { robe: C.linen2, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.terracotta },
  // the little child Jesus sets in the middle (Capernaum)
  child: { robe: C.skyVeil, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, belt: C.ochre },
  // the stranger who drove out demons in Jesus' name
  stranger: { robe: C.roseRobe, mantle: C.sageRobe, hair: C.hair, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin4, belt: C.leather },
};
/** Jesus transfigured: garments whiter than any fuller could make them */
export const JESUS_WHITE = { ...CAST.jesus, robe: '#fffdf6', mantle: '#fbf6ea', skin: mix(C.skin, '#fff6e6', 0.3), hair: mix(C.hairJesus, C.ochre, 0.25) };

/** two stone tablets side by side (held at the bottom edge); origin: bottom centre */
export function tablets(c, { w = 22, h = 34, col = mix(C.stone, C.rock, 0.5) } = {}) {
  const s = sheet();
  const one = (x) => c.cut([[x - w / 2, 0], [x - w / 2, -h + w / 2], ...c.arc(x, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 8), [x + w / 2, 0]], 0.3, 4);
  s.p(one(-w / 2 - 1) + one(w / 2 + 1), col);
  let ln = '';
  [-w / 2 - 1, w / 2 + 1].forEach((x) => { for (let i = 0; i < 4; i++) ln += c.ribbon([[x - w * 0.3, -h + w * 0.6 + i * 6], [x + w * 0.3, -h + w * 0.6 + i * 6]], 1.1); });
  s.x(ln, shade(col, -0.35), 'opacity=".7"');
  return s.out();
}
/** a wheel of fire (the hint of Elijah's chariot); origin: hub */
export function fireWheel(c, r = 46) {
  const s = sheet();
  let fl = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; fl += c.cut([[Math.cos(a - 0.2) * r * 0.9, Math.sin(a - 0.2) * r * 0.9], [Math.cos(a + 0.05) * r * 1.45, Math.sin(a + 0.05) * r * 1.45], [Math.cos(a + 0.22) * r * 0.9, Math.sin(a + 0.22) * r * 0.9]], 0.3, 4); }
  s.p(fl, C.sunDeep);
  s.p(c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 30), 8), C.sun);
  let spokes = '';
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI; spokes += c.ribbon([[Math.cos(a) * r, Math.sin(a) * r], [-Math.cos(a) * r, -Math.sin(a) * r]], 4); }
  s.p(spokes, C.lampFlame);
  s.p(c.cut(c.circ(0, 0, 8, 12), 0.2, 3), C.sunRay);
  return `<circle r="${r * 2.2}" fill="url(#warm-glow)" opacity=".7"/>${s.out()}`;
}
/** a small paper tent (pops up by scaling sy from the base); origin: base centre */
export function tent(c, { w = 96, h = 86, col = C.wheatRobe, stripe = C.terracotta } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 6, 0], [0, -h], [w / 2 + 6, 0]], 0.5, 6), shade(col, -0.15));
  s.p(c.cut([[-w / 2, 0], [-2, -h + 4], [w * 0.18, 0]], 0.5, 6), col);
  s.p(c.cut([[w * 0.18, 0], [-2, -h + 4], [w / 2, 0]], 0.5, 6), shade(col, 0.12));
  s.p(c.cut([[-4, 0], [-1, -h * 0.55], [8, 0]], 0.3, 4), shade(col, -0.45));
  s.x(c.ribbon([[-w / 2 + 8, -8], [-3, -h + 12]], 3) + c.ribbon([[w / 2 - 8, -8], [1, -h + 12]], 3), stripe, 'opacity=".75"');
  s.p(c.ribbon([[-1, -h + 2], [-1, -h - 12]], 3), C.wood2);
  s.x(c.cut([[0, -h - 12], [14, -h - 8], [0, -h - 4]], 0.2, 3), stripe);
  s.x(c.ribbon([[-w / 2 - 6, 0], [-w / 2 - 22, 4]], 1.2) + c.ribbon([[w / 2 + 6, 0], [w / 2 + 22, 4]], 1.2), C.rope);
  return s.out();
}
/** a fuller at his tub, with a line of washing that is never quite white; origin: plate centre */
export function fullerPlate(c, r = 74) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 6, 40), 0.5, 6), C.haloRim);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.5, 6), C.parchment);
  // clothes line with two greyish cloths
  s.x(c.ribbon(c.qbez([-r * 0.8, -r * 0.45], [0, -r * 0.3], [r * 0.8, -r * 0.45], 10), 1.2), C.wood2);
  s.p(c.cut([[-r * 0.62, -r * 0.4], [-r * 0.2, -r * 0.35], [-r * 0.24, -r * 0.02], [-r * 0.58, -r * 0.05]], 0.4, 4), mix(C.linen2, C.stone2, 0.5));
  s.p(c.cut([[r * 0.18, -r * 0.35], [r * 0.6, -r * 0.4], [r * 0.56, -r * 0.08], [r * 0.22, -r * 0.04]], 0.4, 4), mix(C.linen2, C.sand2, 0.4));
  // tub with water, a little fuller treading the cloth
  const fig = sheet();
  fig.p(c.cut([[-7, -34], [7, -34], [11, -10], [-11, -10]], 0.3, 3), C.dustyBlue);
  fig.p(c.cut(c.circ(0, -41, 7, 10), 0.2, 3), C.skin3);
  fig.p(c.cut([...c.arc(0, -42, 7.5, 7.5, PI, 2 * PI, 6), [7, -41], [-7, -41]], 0.2, 3), C.hair3);
  fig.p(c.ribbon([[-5, -30], [-14, -46]], 3.4) + c.ribbon([[5, -30], [14, -46]], 3.4), C.dustyBlue);
  s.raw(`<g transform="translate(0 ${r * 0.44})">${fig.out()}</g>`);
  s.p(c.cut([[-r * 0.42, r * 0.28], [r * 0.42, r * 0.28], [r * 0.34, r * 0.62], [-r * 0.34, r * 0.62]], 0.4, 5), C.wood);
  s.x(c.ribbon([[-r * 0.4, r * 0.38], [r * 0.4, r * 0.38]], 2) + c.ribbon([[-r * 0.37, r * 0.52], [r * 0.37, r * 0.52]], 2), C.wood2);
  s.p(c.cut([[-r * 0.44, r * 0.3], [-r * 0.2, r * 0.22], [0, r * 0.28], [r * 0.22, r * 0.21], [r * 0.44, r * 0.3], [r * 0.4, r * 0.34], [-r * 0.4, r * 0.34]], 0.3, 4), C.lake);
  s.p(c.cut([[-r * 0.2, r * 0.26], [r * 0.05, r * 0.2], [r * 0.12, r * 0.3], [-r * 0.1, r * 0.34]], 0.3, 3), mix(C.linen2, C.stone2, 0.5));
  return s.out();
}
/** a paper crown (who is the greatest?); origin: bottom centre */
export function paperCrown(c, w = 30, col = C.sun) {
  const h = w * 0.62;
  const pts = [[-w / 2, 0], [-w / 2, -h * 0.55], [-w / 2 + w * 0.12, -h], [-w * 0.2, -h * 0.5], [0, -h * 1.05], [w * 0.2, -h * 0.5], [w / 2 - w * 0.12, -h], [w / 2, -h * 0.55], [w / 2, 0]];
  return sheet().p(c.cut(pts, 0.3, 3), col).x(c.poly(c.circ(0, -h * 0.3, w * 0.07, 6)) + c.poly(c.circ(-w * 0.28, -h * 0.28, w * 0.05, 6)) + c.poly(c.circ(w * 0.28, -h * 0.28, w * 0.05, 6)), C.terracotta).x(c.ribbon([[-w / 2, -h * 0.12], [w / 2, -h * 0.12]], 1.4), shade(col, -0.2)).out();
}
/** a measuring rod with notches, standing; origin: foot */
export function measureRod(c, h = 230) {
  const s = sheet().p(c.cut(c.rect(-7, -h, 14, h), 0.4, 8), C.wood3);
  let n = '';
  for (let y = -12; y > -h + 6; y -= 12) n += c.ribbon([[-7, y], [(Math.round(-y / 12) % 5 === 0 ? 5 : 0), y]], 1.4);
  s.x(n, C.wood2);
  return s.out();
}
/** a clay basin with water and a towel draped over it; origin: base centre */
export function basinTowel(c, w = 70) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -w * 0.36], [w / 2, -w * 0.36], [w * 0.36, -3], [w * 0.2, 0], [-w * 0.2, 0], [-w * 0.36, -3]], 0.4, 5), C.pot);
  s.p(c.cut(c.ell(0, -w * 0.36, w / 2 - 3, 4, 14), 0.2, 4), C.lake);
  s.p(c.cut([[w * 0.1, -w * 0.4], [w * 0.36, -w * 0.4], [w * 0.4, -w * 0.08], [w * 0.28, 0], [w * 0.18, -w * 0.18]], 0.4, 4), C.linen);
  s.x(c.ribbon([[w * 0.2, -w * 0.3], [w * 0.34, -w * 0.3]], 1.4), C.terracotta, 'opacity=".6"');
  return s.out();
}
/** a millstone seen face-on, with its hole and rope; origin: centre */
export function millstone(c, r = 58) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 34), 0.8, 6) + c.hole(c.circ(0, 0, r * 0.2, 12), 0.3, 3), C.rock2);
  s.p(c.cut(c.circ(0, 0, r * 0.82, 30), 0.6, 6) + c.hole(c.circ(0, 0, r * 0.26, 12), 0.3, 3), mix(C.rock2, C.rock, 0.5));
  let g = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * PI * 2; g += c.ribbon([[Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3], [Math.cos(a + 0.35) * r * 0.78, Math.sin(a + 0.35) * r * 0.78]], 1.6); }
  s.x(g, C.rock3, 'opacity=".75"');
  s.p(c.ribbon([[0, -r * 0.2], ...c.arc(0, -r * 0.2 - 22, 16, 22, PI * 0.5, PI * 2.4, 10)], 3), C.rope);
  return s.out();
}
/** a pair of paper scissors; blades are .bA / .bB (rotate about the pivot at 0,0); points right */
export function scissors(c, len = 70) {
  const blade = (sgn) => sheet().p(c.cut([[-4, -3 * sgn], [len, -1 * sgn], [len * 0.9, 3 * sgn], [4, 4 * sgn]], 0.2, 5), C.stone2)
    .p(c.cut(c.ell(-len * 0.34, 9 * sgn, 11, 8, 12), 0.3, 4) + c.hole(c.ell(-len * 0.34, 9 * sgn, 6, 4, 10), 0.2, 3), C.terracotta)
    .p(c.ribbon([[-len * 0.2, 6 * sgn], [2, 1 * sgn]], 5), C.terracotta).out();
  return `<g class="bA">${blade(1)}</g><g class="bB">${blade(-1)}</g><path d="${c.poly(c.circ(0, 0, 3, 8))}" fill="${C.ink}"/>`;
}
/** a simple open paper hand (palm facing us, fingers up); origin: wrist */
export function paperHand(c, col = C.skin2, sc = 1) {
  const s = sheet();
  s.p(c.cut([[-9, 0], [-11, -18], [11, -18], [9, 0]].map(([x, y]) => [x * sc, y * sc]), 0.3, 4), col);
  let f = '';
  [[-9, -16, -12, -34], [-4, -18, -5, -40], [2, -18, 2, -41], [7, -17, 9, -36], [10, -8, 18, -20]].forEach(([x0, y0, x1, y1]) => { f += c.ribbon([[x0 * sc, y0 * sc], [x1 * sc, y1 * sc]], 5 * sc); });
  s.p(f, col);
  return s.out();
}
/** a foot, side view (toes right); origin: heel bottom */
export function paperFoot(c, col = C.skin2) {
  return sheet().p(c.cut([[-4, -26], [6, -26], [8, -12], [22, -8], [34, -6], [36, 0], [-8, 0], [-8, -10]], 0.4, 4), col)
    .p(c.cut(c.ell(-2, -1, 12, 3, 8), 0.2, 3) + c.cut(c.ell(20, -1, 16, 3, 8), 0.2, 3), C.sandal).out();
}
/** an eye; origin: centre */
export function paperEye(c, w = 30) {
  return sheet().p(c.cut([...c.arc(0, w * 0.2, w / 2, w * 0.5, PI * 1.15, PI * 1.85, 10), ...c.arc(0, -w * 0.2, w / 2, w * 0.5, PI * 0.15, PI * 0.85, 10)], 0.3, 4), C.linen)
    .p(c.cut(c.circ(0, 0, w * 0.2, 12), 0.2, 3), C.teal2).x(c.poly(c.circ(0, 0, w * 0.09, 8)), C.ink).x(c.poly(c.circ(w * 0.06, -w * 0.06, w * 0.04, 6)), C.star).out();
}
/** a hanging card holding an icon, with a dark stone tied under it; origin: the string's end (top) */
export function stumbleCard(c, icon, { w = 96, h = 110 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), C.cream);
  s.p(c.cut(c.rect(-w / 2 + 7, 7, w - 14, h - 14), 0.4, 8), C.parchment);
  s.x(c.poly(c.circ(0, 7, 3.2, 8)), C.wood2);
  const st = sheet().p(c.cut(c.blob(0, 0, 13, 10, 9, 0.3), 1, 4), mix(C.storm2, C.soilDark, 0.5)).out();
  return `${s.out()}<g transform="translate(0 ${h * 0.56})">${icon}</g><path d="M${w * 0.3} ${h}V${h + 16}" stroke="${C.rope}" stroke-width="1.6"/><g transform="translate(${w * 0.3} ${h + 26})">${st}</g>`;
}
/** a stone arch with a golden light inside (the way into life); origin: base centre */
export function lifeGate(c, { w = 150, h = 210 } = {}) {
  const s = sheet();
  const inner = [[-w * 0.3, 0], [-w * 0.3, -h * 0.62], ...c.arc(0, -h * 0.62, w * 0.3, w * 0.3, PI, 2 * PI, 12), [w * 0.3, 0]];
  s.p(c.cut([[-w / 2, 4], [-w / 2, -h * 0.66], ...c.arc(0, -h * 0.66, w / 2, w / 2, PI, 2 * PI, 14), [w / 2, 4]], 0.6, 7) + c.hole(inner, 0.4, 6), C.stone);
  let bl = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i + 0.5) / 9 * PI; bl += c.ribbon([[Math.cos(a) * w * 0.31, -h * 0.62 + Math.sin(a) * w * 0.31], [Math.cos(a) * w * 0.49, -h * 0.66 + Math.sin(a) * w * 0.49]], 1.4); }
  for (let y = -h * 0.12; y > -h * 0.6; y -= h * 0.12) bl += c.ribbon([[-w / 2, y], [-w * 0.3, y]], 1.4) + c.ribbon([[w * 0.3, y], [w / 2, y]], 1.4);
  s.x(bl, C.stone2);
  const light = sheet().p(c.cut(inner, 0.3, 6), C.halo).x(c.cut([[-w * 0.18, 0], [-w * 0.08, -h * 0.7], [w * 0.08, -h * 0.7], [w * 0.18, 0]], 0.3, 6), C.star, 'opacity=".7"').out(false);
  return { light: `<circle cx="0" cy="${-h * 0.45}" r="${h * 0.9}" fill="url(#halo-glow)"/>${light}`, arch: s.out() };
}
/** a distant ravine of unquenchable fire; origin: rim centre. returns { pit, flames:[markup…] } */
export function firePit(c, w = 300) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.3, 30], [-w * 0.1, 48], [w * 0.1, 50], [w * 0.32, 32], [w / 2, 0], [w / 2 + 20, 60], [-w / 2 - 20, 60]], 1.2, 8), mix(C.soilDark, C.storm2, 0.3));
  s.x(c.cut(c.ell(0, 26, w * 0.36, 14, 16), 0.8, 6), C.sunRay, 'opacity=".55"');
  const flames = [];
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * w * 0.1 + c.rr(-6, 6), h = c.rr(26, 50);
    flames.push({ x, y: 24 + Math.abs(i - 3) * 3, m: `<path d="M0 0C${-h * 0.32} ${-h * 0.2} ${-h * 0.2} ${-h * 0.62} 0 ${-h}C${h * 0.24} ${-h * 0.6} ${h * 0.34} ${-h * 0.2} 0 0Z" fill="${i % 2 ? C.sunDeep : C.sunRay}"/><path d="M0 -3C${-h * 0.12} ${-h * 0.2} ${-h * 0.1} ${-h * 0.4} 0 ${-h * 0.55}C${h * 0.1} ${-h * 0.4} ${h * 0.12} ${-h * 0.2} 0 -3Z" fill="${C.lampFlame}"/>` });
  }
  return { pit: `<ellipse cx="0" cy="10" rx="${w * 0.7}" ry="80" fill="url(#warm-glow)" opacity=".55"/>${s.out()}`, flames };
}
/** a bowl heaped with salt; origin: base centre. .shine can be faded */
export function saltBowl(c, w = 90, { dull = false } = {}) {
  const s = sheet();
  const salt = dull ? mix(C.stone2, C.rock2, 0.5) : '#fdfbf5';
  s.p(c.cut([[-w * 0.42, -w * 0.3], ...c.arc(0, -w * 0.3, w * 0.42, w * 0.2, PI, 2 * PI, 12), [w * 0.42, -w * 0.3]], 0.6, 4), salt);
  let cr = '';
  for (let i = 0; i < 12; i++) { const x = c.rr(-w * 0.34, w * 0.34), y = -w * 0.32 - c.rr(0, w * 0.12) * (1 - Math.abs(x) / (w * 0.4)); cr += c.poly(c.rect(x, y, 3.2, 3.2)); }
  s.x(cr, dull ? C.rock3 : C.stone2, 'opacity=".7"');
  s.p(c.cut([[-w / 2, -w * 0.32], [w / 2, -w * 0.32], [w * 0.34, -3], [w * 0.18, 0], [-w * 0.18, 0], [-w * 0.34, -3]], 0.4, 5), C.teal2);
  s.x(c.ribbon([[-w * 0.44, -w * 0.24], [w * 0.44, -w * 0.24]], 2), C.cream, 'opacity=".5"');
  return s.out();
}
/** a scatter of salt crystals / sparks falling; origin: centre */
export function saltGrains(c, n = 18, spread = 60, col = '#fdfbf5') {
  let d = '';
  for (let i = 0; i < n; i++) { const x = c.rr(-spread, spread), y = c.rr(-spread * 0.6, spread * 0.6), r = c.rr(1.6, 3.2); d += c.poly(c.tr([[-r, -r], [r, -r * 0.8], [r * 0.9, r], [-r * 0.8, r * 0.9]], x, y)); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** a rolled scroll tied with a red seal (what they saw is sealed until…); origin: centre */
export function sealedScroll(c, w = 70) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -12, w, 24), 0.4, 6), C.parchment);
  s.p(c.cut(c.ell(-w / 2, 0, 5, 13, 12), 0.3, 3) + c.cut(c.ell(w / 2, 0, 5, 13, 12), 0.3, 3), shade(C.parchment, -0.12));
  s.p(c.ribbon([[-4, -13], [-3, 13]], 5), C.terracotta);
  s.p(c.cut(c.blob(-3, 4, 10, 9, 10, 0.2), 0.4, 3), shade(C.terracotta, -0.12));
  s.x(c.poly(c.star(-3, 4, 5, 2.4, 5, 0)), shade(C.terracotta, 0.3));
  return s.out();
}
/** a rock-cut tomb with a round stone, on a small hill; origin: base centre. .stone moves */
export function tombHill(c, w = 150) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], ...c.arc(0, 0, w / 2, w * 0.42, PI, 2 * PI, 14), [w / 2, 0]], 0.8, 6), C.rock2);
  s.p(c.cut([[-w * 0.14, 0], [-w * 0.14, -w * 0.18], ...c.arc(0, -w * 0.18, w * 0.14, w * 0.12, PI, 2 * PI, 8), [w * 0.14, 0]], 0.3, 4), C.soilDark);
  const st = sheet().p(c.cut(c.circ(0, 0, w * 0.17, 20), 0.5, 4), C.rock).x(c.ribbon(c.arc(0, 0, w * 0.1, w * 0.1, 0.5, 2.4, 6), 1.4), C.rock3).out();
  return { hill: s.out(), stone: st, stoneR: w * 0.17 };
}
/** an upturned empty bowl (fasting); origin: base centre */
export function emptyBowl(c, w = 40) {
  return sheet().p(c.cut([[-w / 2, 0], ...c.arc(0, 0, w / 2, w * 0.42, PI, 2 * PI, 12), [w / 2, 0]], 0.4, 4), C.pot).p(c.cut(c.rect(-w * 0.2, -w * 0.46, w * 0.4, 5), 0.2, 3), shade(C.pot, -0.15)).out();
}
/** a dark flurry of the spirit: jagged shadow scraps; origin: centre */
export function darkScrap(c, r = 14) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * c.rr(0.5, 0.8), 7, 0.45), 1.6, 4), c.pick(['#3b3148', '#2f2a3a', '#463a52'])).out();
}
/** a cradle with a sleeping baby (from childhood); origin: base centre */
export function cradle(c, w = 64) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -w * 0.34], [w / 2, -w * 0.34], [w * 0.4, -4], [-w * 0.4, -4]], 0.4, 5), C.basket);
  s.x(c.ribbon([[-w * 0.44, -w * 0.22], [w * 0.44, -w * 0.22]], 1.5) + c.ribbon([[-w * 0.42, -w * 0.12], [w * 0.42, -w * 0.12]], 1.5), shade(C.basket, -0.2));
  s.p(c.ribbon(c.arc(0, 2, w * 0.5, 8, 0.1, PI - 0.1, 10), 3), C.wood2);
  s.p(c.cut(c.circ(-w * 0.2, -w * 0.42, 8, 12), 0.2, 3), C.skin);
  s.p(c.cut(c.ell(w * 0.06, -w * 0.38, w * 0.26, 8, 12), 0.3, 4), C.skyVeil);
  s.x(c.ribbon(c.arc(-w * 0.19, -w * 0.43, 2.2, 1.4, 0.2, PI - 0.2, 4), 0.9), C.inkSoft);
  return s.out();
}
/** little white flecks (foam), kept small and restrained; origin: centre */
export function flecks(c, n = 6, col = C.foam) {
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut(c.circ(c.rr(-7, 7), c.rr(-5, 5), c.rr(1.2, 2.4), 6), 0.1, 2);
  return `<path d="${d}" fill="${col}" opacity=".9"/>`;
}
/** a clay drinking cup; origin: base centre */
export function clayCup(c, h = 26) {
  return sheet().p(c.cut([[-h * 0.42, -h], [h * 0.42, -h], [h * 0.32, -h * 0.2], [h * 0.22, 0], [-h * 0.22, 0], [-h * 0.32, -h * 0.2]], 0.3, 4), C.pot)
    .p(c.ribbon(c.arc(h * 0.44, -h * 0.58, h * 0.2, h * 0.24, -PI * 0.5, PI * 0.5, 8), 3), shade(C.pot, -0.1))
    .x(c.cut(c.ell(0, -h, h * 0.4, 3, 10), 0.2, 3), C.lake)
    .x(c.ribbon([[-h * 0.36, -h * 0.72], [h * 0.36, -h * 0.72]], 1.4), C.cream, 'opacity=".45"').out();
}
/** an open paper hand reaching up from below (the "hands of men"); origin: wrist, pointing up */
export function reachingHand(c, col) {
  return `<g>${sheet().p(c.cut([[-8, 0], [-9, 50], [9, 50], [8, 0]], 0.3, 4), shade(col, -0.2)).out()}<g transform="translate(0 2) scale(1.1)">${paperHand(c, col)}</g></g>`;
}
/** a small shining crown of light (the Kingdom coming with power); origin: centre */
export function crownOfLight(c, r = 60) {
  const s = sheet();
  const pts = [[-r, r * 0.3], [-r, -r * 0.15]];
  for (let i = 0; i < 5; i++) { const x0 = -r + (i * 2 * r) / 5; pts.push([x0 + r * 0.2, -r * (i % 2 ? 0.7 : 0.9)], [x0 + (2 * r) / 5, -r * 0.15]); }
  pts.push([r, r * 0.3]);
  s.p(c.cut(pts, 0.4, 5), C.sun);
  s.p(c.cut(c.rect(-r, r * 0.08, 2 * r, r * 0.22), 0.3, 5), C.haloRim);
  let gems = '';
  for (let i = 0; i < 5; i++) gems += c.cut(c.circ(-r * 0.8 + i * r * 0.4, r * 0.19, r * 0.06, 8), 0.1, 3);
  s.x(gems, C.terracotta);
  let tips = '';
  for (let i = 0; i < 5; i++) tips += c.poly(c.star(-r + r * 0.2 + (i * 2 * r) / 5, -r * (i % 2 ? 0.7 : 0.9) - 6, 7, 2.4, 4, 0));
  s.x(tips, C.star);
  return `<circle r="${r * 1.6}" fill="url(#warm-glow)" opacity=".8"/>${s.out()}`;
}

/* ---------- shared sets ---------- */
/**
 * The plain at the foot of the mountain (Mk 9,14–27): the mountain behind, a village, a trodden ground.
 * Returns { sk, hangL, clouds, ground }.
 */
export function plainSet(S, { sky: cols = ['#cfe0dc', '#efe6cf', '#f6e8d0'], cloudsOn = true } = {}) {
  const c = S.c;
  const sk = sky(S, cols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const clouds = cloudsOn ? [[480, 150, 190], [1150, 110, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) })) : [];
  const mtL = S.layer({ par: 0.08, sh: 2 });
  const mt = sheet();
  mt.p(c.cut([[-900, 520], [240, 480], [440, 390], [570, 290], [640, 240], [700, 226], [760, 250], [900, 340], [1100, 420], [1400, 480], [2500, 500], [2500, 1700], [-900, 1700]], 1.4, 12), mix(C.hillFar, C.lavender, 0.22));
  mt.p(c.cut([[570, 290], [640, 240], [700, 226], [760, 250], [800, 278], [740, 270], [700, 288], [660, 270], [612, 294]], 0.8, 8), C.cream, 'opacity=".85"');
  mtL.add(mt.out());
  const far = S.layer({ par: 0.16, sh: 3 });
  const fh = hillsWith(c, { y: 500, amps: [18, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 20 });
  far.add(fh.markup);
  far.add(town(c, { x: 1270, y: fh.fn(1270) + 10, n: 6, spread: 240, sc: 0.55 }));
  const ground = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(560, [5, 2], [700, 160]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sage2, 0.35)).out());
  ground.add(olive(c, 260, 566, 0.95) + olive(c, 1400, 568, 0.85) + rock(c, 1180, 580, 60, 22, C.rock2) + rock(c, 380, 590, 44, 16));
  ground.add(grass(c, { x0: -400, x1: 2000, y: 560, fn: gfn, n: 34, h: 12, color: C.olive }));
  return { sk, hangL, clouds, ground, gfn };
}

/** rings of sound/light spreading in one direction (angle a, radians; PI/2 = downwards) */
export function arcRings(L, c, { n = 3, r = 50, w = 6, color = C.haloRim, a = PI / 2, span = 0.6 } = {}) {
  const els = [];
  for (let i = 0; i < n; i++) els.push(L.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, r, r, a - span, a + span, 12), w)}" fill="${color}"/></g>`));
  return (x, y, on, time, { spread = 2.4, speed = 0.45, s0 = 0.7 } = {}) => {
    els.forEach((el, i) => {
      if (on <= 0.001) { pose(el, { x, y, o: 0 }); return; }
      const k = time ? (time * speed + i / n) % 1 : (i + 1) / (n + 0.5);
      pose(el, { x, y, s: s0 + k * spread, o: on * (1 - k) * 0.95 });
    });
  };
}
export { bubble as shout } from '../mark1/lib.js';

/** the crowd for the plain scenes (Mk 9,14–27): rows behind the action */
export const PLAIN_ROWS = [
  { y: 588, s: 0.42, n: 16, x0: 300, x1: 1500 },
  { y: 612, s: 0.5, n: 13, x0: 260, x1: 1540 },
];
/** a plate with a tiny scene: the boy thrown down, the dark spirit around him. parts: .boyfig .shards */
export function seizurePlate(c, r = 80) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 6, 40), 0.5, 6), C.stone2);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.5, 6), mix(C.parchment, C.stone, 0.4));
  s.p(c.cut([[-r * 0.9, r * 0.38], [r * 0.9, r * 0.38], [r * 0.7, r * 0.72], [-r * 0.7, r * 0.72]], 0.4, 6), mix(C.sand2, C.stone2, 0.5));
  let sh = '';
  for (let i = 0; i < 7; i++) { const a = (i / 7) * PI * 2; sh += `<g transform="translate(${(Math.cos(a) * 34).toFixed(1)} ${(Math.sin(a) * 22 - 10).toFixed(1)}) rotate(${(a * 57).toFixed(0)})"><path d="${c.cut(c.blob(0, 0, 9, 5, 7, 0.4), 1.2, 3)}" fill="#3b3148"/></g>`; }
  return { back: s.out(), shards: sh };
}
/** a small round plate with fire or water; origin: centre */
export function dangerPlate(c, kind, r = 52) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 5, 34), 0.5, 5), C.stone2);
  s.p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), C.parchment);
  if (kind === 'fire') {
    s.p(c.cut([[-r * 0.6, r * 0.5], [r * 0.6, r * 0.5], [r * 0.5, r * 0.62], [-r * 0.5, r * 0.62]], 0.3, 4), C.wood2);
    s.p(`M${-r * 0.5} ${r * 0.5}C${-r * 0.7} ${r * 0.1} ${-r * 0.3} ${-r * 0.2} ${-r * 0.1} ${-r * 0.7}C${r * 0.1} ${-r * 0.3} ${r * 0.3} ${-r * 0.4} ${r * 0.35} ${-r * 0.2}C${r * 0.7} ${r * 0.1} ${r * 0.5} ${r * 0.4} ${r * 0.5} ${r * 0.5}Z`, C.sunDeep);
    s.x(`M${-r * 0.25} ${r * 0.5}C${-r * 0.35} ${r * 0.2} ${-r * 0.1} ${0} 0 ${-r * 0.3}C${r * 0.1} 0 ${r * 0.3} ${r * 0.2} ${r * 0.25} ${r * 0.5}Z`, C.lampFlame);
  } else {
    let w = '';
    for (let i = 0; i < 3; i++) { const y = -r * 0.25 + i * r * 0.3; const pts = []; for (let x = -r * 0.8; x <= r * 0.8; x += 6) pts.push([x, y + Math.sin(x / 9 + i) * 5]); w += c.ribbon(pts, 7); }
    s.p(w, C.lake3);
  }
  return s.out();
}
export { crutch } from '../mark3/lib.js';
/** an eye patch with its strap (head coords, covers the near eye) */
export function eyePatch(c) {
  return `<path d="${c.ribbon([[-17, -8], [6, -10], [18, -6]], 2)}" fill="${C.ink}"/><path d="${c.cut(c.ell(12.5, -2.5, 4.6, 4, 10), 0.2, 2)}" fill="${C.ink}"/>`;
}
/** a paper label (string end at 0,0, label hangs below) */
export function labelOnString(text, { size = 20 } = {}) {
  const w = size * (0.52 * String(text).length + 1.4), h = size * 1.5;
  return `<path d="M${-w / 2} 0L${w / 2} -1L${w / 2 + 1} ${h}L${-w / 2 - 1} ${h + 1}Z" fill="${C.cream}"/><path class="grain" d="M${-w / 2} 0L${w / 2} -1L${w / 2 + 1} ${h}L${-w / 2 - 1} ${h + 1}Z"/><text x="0" y="${h * 0.66}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
