// Matthew 2 — the cast and cut-outs of this chapter: the Magi in Phrygian caps and their camels, the star on
// its string, old King Herod and his hall, the chief priests with the prophet's scroll, the house in Bethlehem,
// the gifts, dream clouds, Joseph's donkey, the desert road to Egypt with its pyramids and palms, the shadow
// screen, Rachel's hill at Ramah and the little town of Nazareth.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, stars, moon, town, house, palm, olive, cypress, grass, rock, bush, reeds, waterBand, sun, cloud } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { fade } from '../../core/anim.js';
import { addToHead, addToBody } from '../mark2/lib.js';
import { LOOK as L6, crown, throne } from '../mark6/lib.js';
import { JOSEPH as MT1_JOSEPH, MARY as MT1_MARY } from '../matthew1/lib.js';
import { camel } from '../mark1/lib.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, wordSlip, scrollOpen, scrollRolled, lantern, candle, coin, turban, circlet, scribe } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, sparkle, tapeX, silhouette } from '../mark3/lib.js';
export { crown, throne, noble, labelTag, sheep, staff, storyFrame, SEPIA, workbench, sickOnMat, crossX, mapHalf, DY } from '../mark6/lib.js';
export { camel, walkCamel, voiceRings, signpost, flame, acacia, scrub, hang2 } from '../mark1/lib.js';
export { colt, coltRig, riderLeg, priest, jerusalem } from '../mark11/lib.js';
export { angel } from '../mark8/lib.js';
export { soldierSil, INK } from '../mark15/lib.js';
export { torch } from '../mark14/lib.js';
export { baby as infant, radiance, rayBurst } from '../john1/lib.js';
export { beamGrad, lightBeam, flicker, hangAt, vpose, word, cradle } from '../john3/lib.js';
export { hourglass, shadowScreen, zzz } from '../mark13/lib.js';
export { glory, say } from '../mark8/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');
const DYP = { stand: 0, kneel: 46, sit: 62 };

/* ================================================================== the cast */
export const LOOK = {
  // the same Mary and Joseph as in Matthew 1 (the John 1 / John 6 look)
  mary: MT1_MARY,
  joseph: MT1_JOSEPH,
  // Herod the Great: old, grey-bearded, in the purple and red of Mark 6's court
  herod: { ...L6.herod, hair: C.greyHair, beardColor: '#d9d2c6', skin: C.skin2 },
  // his son Archelaus: the same colours, young and hard
  archelaus: { robe: shade(C.plumRobe, -0.12), mantle: C.curtain2, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'short', beardColor: C.hair3 },
  jeremiah: { robe: C.linen2, mantle: mix(C.tealRobe, C.storm, 0.3), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: '#e3ddd2', skin: C.skin2 },
  micah: { robe: mix(C.dune, C.linen, 0.4), mantle: C.clay, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'wild', beardColor: '#ece6da', skin: C.skin3, belt: C.leather },
  rachel: { robe: mix(C.plumRobe, C.storm, 0.35), mantle: mix(C.storm2, C.plumRobe, 0.3), hairStyle: 'veil', veil: mix(C.storm, C.duskViolet, 0.3), veil2: mix(C.storm2, C.duskViolet, 0.2), skin: C.skin2, hair: C.hair3 },
  messenger: { robe: C.wheatRobe, belt: C.leather, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3 },
  // the Child: no beard, the halo, curls the colour of His hair as a man
  child: { robe: C.linen, mantle: null, hair: C.hairJesus, hairStyle: 'curly', beard: 'none', skin: C.skin, halo: true },
};
/** the three Magi: an old one, a young one, one from farther south */
export const MAGI = [
  { robe: C.linen2, mantle: mix(C.sun, C.ochre, 0.4), mantleArm: true, belt: C.terracotta, hair: C.greyHair, hairStyle: 'short', beard: 'wild', beardColor: '#eee8dc', skin: C.skin2, cap: C.terracotta, jewel: C.sun },
  { robe: C.tealRobe, mantle: C.plumRobe, belt: C.sun, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin, cap: mix(C.indigo, C.dustyBlue, 0.4), jewel: C.sun },
  { robe: C.roseRobe, mantle: mix(C.indigo, C.teal2, 0.35), belt: C.sun, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin4, cap: C.sun, jewel: C.terracotta },
];
/** a Phrygian cap with a gold band and a jewel (head coords: face r≈18 at 0,0, looking +x) */
export function magiCap(c, col, jewel = C.sun) {
  const s = sheet();
  s.p(c.cut([[-21, 4], [-21, -10], [-15, -24], [-4, -32], [10, -35], [22, -31], [27, -22], [22, -18], [15, -22], [17, -12], [20, -4], [20, 1], [8, -7], [-6, -6], [-14, 2]], 0.5, 4), col);
  s.x(c.ribbon([[-20, -8], [-4, -12], [18, -10]], 2), shade(col, -0.2), 'opacity=".6"');
  s.p(c.ribbon([[-21, -3], [-6, -8], [19, -6]], 5), C.sun);
  s.x(c.poly(c.circ(4, -8, 3.2, 8)), jewel);
  return s.out();
}
/** one of the Magi as a puppet (extra: pose, holdF, eyes…) */
export function magus(c, i, extra = {}) {
  const o = MAGI[i % 3];
  return addToHead(person(c, { ...o, ...extra }), magiCap(c, o.cap, o.jewel));
}
/** old Herod with his crown and hidden brows (data-part="angry" | "sad" | "tear") */
export function herodPuppet(c, extra = {}, look = LOOK.herod) {
  return addToHead(addToHead(person(c, { ...look, ...extra }), crown(c)), faceBitsLocal(c));
}
function faceBitsLocal(c) {
  const ink = C.inkSoft;
  const angry = c.ribbon([[-1.5, -10.5], [7.5, -6.2]], 2.8) + c.ribbon([[9.8, -6.4], [17, -10.2]], 2.6);
  const sad = c.ribbon([[-1, -6.6], [7.2, -10.4]], 2.5) + c.ribbon([[10, -10.4], [16.5, -6.8]], 2.4);
  const tear = c.cut([[13, 1], [16.2, 7], [15.4, 10.4], [12.8, 11], [11.2, 7.6], [12.2, 3]], 0.1, 2);
  return `<g data-part="angry" opacity="0"><path d="${angry}" fill="${ink}"/></g><g data-part="sad" opacity="0"><path d="${sad}" fill="${ink}"/></g><g data-part="tear" opacity="0"><path d="${tear}" fill="#bfe0ee"/></g>`;
}
/** add the hidden brows / tear to any puppet */
export const withBits = (markup, c) => addToHead(markup, faceBitsLocal(c));

/** a small child as a puppet: an adult cut-out with a big head (use s ≈ 0.42–0.5) */
export function childPerson(c, o = {}) {
  const P = o.pose || 'stand', dy = DYP[P];
  const m = person(c, { hairStyle: 'short', beard: 'none', ...o });
  return m.replace(`<g class="head" transform="translate(2 ${-167 + dy})">`, `<g class="head" transform="translate(2 ${-158 + dy}) scale(1.42)">`);
}
/** a townsman / townswoman (men never veiled) */
export function folk(c, man = null, extra = {}) {
  const o = crowdPerson(c);
  const isMan = man === null ? o.hairStyle !== 'veil' : man;
  if (isMan && o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  if (!isMan) { o.hairStyle = 'veil'; o.beard = 'none'; }
  return { ...o, ...extra };
}
/** a still group of people as one cut-out: members [{x, y, s, flip, o}] (o: person opts or markup string) */
export function group(c, members) {
  return members.slice().sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${typeof m.o === 'string' ? m.o : person(c, m.o)}</g>`).join('');
}

/* ================================================================== skies */
export const NIGHT = [C.night2, C.night, mix(C.indigo, C.duskViolet, 0.3)];
export const DEEP = [mix(C.night2, '#10132b', 0.5), C.night2, mix(C.night, C.indigo, 0.5)];
export const DUSK = [mix(C.duskViolet, C.night, 0.35), mix(C.dusk, C.duskViolet, 0.3), C.peach];
export const DAWN = [mix(C.lavender, C.skyBlue, 0.5), mix(C.dawn, C.peach, 0.3), C.cream];
export const DAY = [C.skyBlue, mix(C.cream, C.skyBlue, 0.3), mix(C.dawn, C.cream, 0.5)];
export const DESERT = [mix(C.skyBlue, C.cream, 0.2), mix(C.cream, C.sand, 0.3), mix(C.dawn, C.sand, 0.5)];
export const HALL = [mix(C.duskViolet, C.mauve, 0.5), mix(C.dusk, C.apricot, 0.4), mix(C.peach, C.dawn, 0.5)];
export const ANGER = [mix(C.curtain2, C.night, 0.5), mix(C.curtain, C.dusk, 0.5), mix(C.apricot, C.sunDeep, 0.3)];
export const MOURN = [mix(C.night2, C.storm2, 0.4), mix(C.storm2, C.duskViolet, 0.4), mix(C.duskViolet, C.dusk, 0.35)];
/** dim a colour into the night */
export const dim = (col, k = 0.42) => mix(col, C.indigo, k);

/* ================================================================== the star */
/** the star of Bethlehem: a many-pointed paper star with a glow; origin centre */
export function bigStar(c, r = 34, { glow = true } = {}) {
  const s = sheet();
  s.p(c.cut(c.star(0, 0, r * 1.9, r * 0.34, 4, -PI / 2), 0.3, 4), C.haloRim);
  s.p(c.cut(c.star(0, 0, r * 1.15, r * 0.3, 4, -PI / 4), 0.3, 4), mix(C.halo, C.haloRim, 0.4));
  s.p(c.cut(c.star(0, 0, r * 1.45, r * 0.28, 4, -PI / 2), 0.3, 4), C.halo);
  s.p(c.cut(c.circ(0, 0, r * 0.42, 16), 0.2, 3), C.star);
  s.x(c.poly(c.circ(0, 0, r * 0.22, 10)), '#fffdf4');
  return (glow ? `<circle r="${r * 4.2}" fill="url(#halo-glow)" opacity=".85"/>` : '') + s.out();
}
/** a long soft beam falling from the star (origin at its top) */
export function starBeam(id, w0 = 24, w1 = 190, h = 360) {
  return `<path d="M${-w0 / 2} 0L${w0 / 2} 0L${w1 / 2} ${h}L${-w1 / 2} ${h}Z" fill="url(#${id})"/>`;
}

/* ================================================================== things */
/** a star chart on parchment: dots, a great star, a row of moons (counting months); origin centre */
export function starChart(c, w = 150, h = 104, { k } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.6, 7), C.parchment);
  s.x(c.ribbon(c.arc(0, h * 0.1, w * 0.42, h * 0.5, PI * 1.08, PI * 1.92, 12), 1.2), C.wood3, 'opacity=".7"');
  let dots = '';
  for (let i = 0; i < 16; i++) dots += c.poly(c.circ(c.rr(-w * 0.44, w * 0.44), c.rr(-h * 0.42, h * 0.1), c.rr(1, 2.2), 6));
  s.x(dots, C.ink, 'opacity=".55"');
  s.x(c.poly(c.star(w * 0.16, -h * 0.2, 12, 3, 4, -PI / 2)), C.sunDeep);
  s.x(c.ribbon([[-w * 0.36, -h * 0.02], [-w * 0.12, -h * 0.26], [w * 0.1, -h * 0.2]], 0.8), C.ink, 'opacity=".4"');
  let moons = '';
  for (let i = 0; i < 6; i++) {
    const x = -w * 0.38 + i * w * 0.152, y = h * 0.3;
    moons += c.poly(c.circ(x, y, 6.5, 12));
  }
  s.x(moons, mix(C.wood3, C.parchment, 0.3));
  s.p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 4, 8, h + 8), 0.3, 5) + c.cut(c.rect(w / 2 - 2, -h / 2 - 4, 8, h + 8), 0.3, 5), C.wood2);
  return `<g${k_(k)}>${s.out()}</g>`;
}
/** one torn half of the star chart; side -1 left / 1 right; origin at the tear's middle */
export function chartHalf(c, side, w = 150, h = 104) {
  const tear = [];
  for (let i = 0; i <= 8; i++) tear.push([(i % 2 ? 5 : -5) + c.rr(-2, 2), -h / 2 + (i * h) / 8]);
  const s = sheet();
  const pts = side < 0 ? [[-w / 2, -h / 2], ...tear, [-w / 2, h / 2]] : [...tear, [w / 2, h / 2], [w / 2, -h / 2]];
  s.p(c.cut(pts, 0.5, 6), C.parchment);
  let dots = '';
  for (let i = 0; i < 7; i++) dots += c.poly(c.circ(side * c.rr(10, w * 0.44), c.rr(-h * 0.42, h * 0.1), c.rr(1, 2.2), 6));
  s.x(dots, C.ink, 'opacity=".55"');
  if (side > 0) s.x(c.poly(c.star(w * 0.16, -h * 0.2, 12, 3, 4, -PI / 2)), C.sunDeep);
  let moons = '';
  for (let i = 0; i < 3; i++) moons += c.poly(c.circ(side * (14 + i * w * 0.14), h * 0.3, 6.5, 12));
  s.x(moons, mix(C.wood3, C.parchment, 0.3));
  s.p(c.cut(side < 0 ? c.rect(-w / 2 - 6, -h / 2 - 4, 8, h + 8) : c.rect(w / 2 - 2, -h / 2 - 4, 8, h + 8), 0.3, 5), C.wood2);
  return s.out();
}
/** a gold casket: {base, lid}; origin: bottom centre (lid hinge at its back top: (-w/2, -h)) */
export function casket(c, { w = 40, h = 24, col = C.sun, fill = 'gold' } = {}) {
  const b = sheet();
  if (fill === 'gold') {
    let coins = '';
    for (let i = 0; i < 7; i++) coins += c.cut(c.circ(c.rr(-w * 0.38, w * 0.38), -h - c.rr(0, 7), c.rr(4, 5.5), 10), 0.2, 2);
    b.p(coins, C.sun);
    b.x(c.poly(c.star(-w * 0.1, -h - 8, 5, 1.2, 4, 0)) + c.poly(c.star(w * 0.24, -h - 4, 4, 1, 4, 0)), '#fffdf0');
  }
  b.p(c.cut(c.rect(-w / 2, -h, w, h), 0.4, 5), col);
  b.x(c.ribbon([[-w / 2 + 2, -h * 0.5], [w / 2 - 2, -h * 0.5]], 2.2), shade(col, -0.22), 'opacity=".8"');
  b.x(c.poly(c.rect(-3, -h * 0.66, 6, 7)), C.terracotta);
  const lid = sheet();
  lid.p(c.cut([[0, 0], [w, 0], [w - 2, -9], ...c.arc(w / 2, -8, w / 2 - 3, 7, 2 * PI, PI, 8), [2, -9]], 0.3, 4), shade(col, -0.08));
  lid.x(c.ribbon([[3, -5], [w - 3, -5]], 1.6), shade(col, 0.3), 'opacity=".8"');
  return { base: b.out(), lid: lid.out() };
}
/** a round censer / incense box on three feet; origin bottom centre */
export function incenseBox(c, w = 34) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -26], [w / 2, -26], [w * 0.4, -6], [-w * 0.4, -6]], 0.4, 4), mix(C.stone, C.sun, 0.35));
  s.p(c.cut([[-w * 0.38, -6], [-w * 0.3, 0], [-w * 0.2, -6]], 0.2, 3) + c.cut([[w * 0.2, -6], [w * 0.3, 0], [w * 0.38, -6]], 0.2, 3), shade(C.sun, -0.2));
  s.p(c.cut([...c.arc(0, -26, w / 2, 14, PI, 2 * PI, 10)], 0.3, 4), mix(C.stone2, C.sun, 0.3));
  let holes = '';
  for (let i = 0; i < 3; i++) holes += c.poly(c.circ(-w * 0.2 + i * w * 0.2, -33, 1.8, 6));
  s.x(holes, C.soilDark);
  s.p(c.cut(c.circ(0, -41, 3.2, 8), 0.2, 2), C.sun);
  return s.out();
}
/** a curl of incense smoke rising from (0,0); origin: its base */
export function smokeCurl(c, h = 90, col = C.lavender) {
  const pts = [];
  for (let i = 0; i <= 18; i++) { const u = i / 18; pts.push([Math.sin(u * PI * 2.6) * 9 * (0.4 + u), -u * h]); }
  return `<path d="${c.ribbon(pts, (u) => 6 - u * 3.5)}" fill="${col}" opacity=".75"/>`;
}
/** a slender jar of myrrh with a stopper; origin bottom centre */
export function myrrhJar(c, h = 50) {
  const s = sheet();
  s.p(c.cut([[-8, 0], [-13, -h * 0.3], [-11, -h * 0.62], [-5, -h * 0.76], [-5, -h * 0.9], [5, -h * 0.9], [5, -h * 0.76], [11, -h * 0.62], [13, -h * 0.3], [8, 0]], 0.4, 4), mix(C.cream, C.mauve, 0.3));
  s.x(c.ribbon([[-12, -h * 0.4], [12, -h * 0.4]], 2.4) + c.ribbon([[-10, -h * 0.55], [10, -h * 0.55]], 1.4), C.plumRobe, 'opacity=".7"');
  s.p(c.cut(c.rect(-6, -h - 4, 12, h * 0.12 + 4), 0.2, 3), C.wood2);
  s.x(c.cut(c.ell(-5, -h * 0.34, 2.2, 7, 8), 0.2, 3), '#fff', 'opacity=".55"');
  return s.out();
}
/** a big dream cloud (thought bubble) with a trail of small puffs to the lower left; origin at the tail tip,
 *  the cloud's centre sits at (dx, dy). inner is drawn centred there. */
export function dreamCloud(c, inner, { w = 300, h = 200, dx = 150, dy = -150, fill = mix(C.cream, C.skyVeil, 0.35), rim = mix(C.halo, C.skyVeil, 0.4) } = {}) {
  const s = sheet();
  const pts = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2, a2 = ((i + 1) / n) * PI * 2;
    const x1 = dx + Math.cos(a) * w / 2, y1 = dy + Math.sin(a) * h / 2, x2 = dx + Math.cos(a2) * w / 2, y2 = dy + Math.sin(a2) * h / 2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ang = Math.atan2(my - dy, mx - dx);
    pts.push(...c.qbez([x1, y1], [mx + Math.cos(ang) * 22, my + Math.sin(ang) * 22], [x2, y2], 6).slice(0, -1));
  }
  const rimPts = pts.map(([x, y]) => [dx + (x - dx) * 1.035, dy + (y - dy) * 1.05]);
  s.p(c.cut(rimPts, 0.4, 6), rim);
  s.p(c.cut(pts, 0.4, 6), fill);
  const tx = dx * 0.28, ty = dy * 0.28;
  s.p(c.cut(c.circ(tx * 0.35, ty * 0.35, 7, 12), 0.2, 3) + c.cut(c.circ(tx, ty, 11, 14), 0.2, 3) + c.cut(c.circ(tx * 1.8, ty * 1.8, 16, 16), 0.3, 3), fill);
  return `${s.out()}<g transform="translate(${dx} ${dy})">${inner}</g>`;
}
/** a pyramid; origin: base centre */
export function pyramid(c, w = 260, h = 170, col = C.dune) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [0, -h], [w / 2, 0]], 0.6, 10), col);
  s.p(c.cut([[0, -h], [w / 2, 0], [w * 0.12, 0]], 0.5, 10), shade(col, -0.14));
  let courses = '';
  for (let i = 1; i < 7; i++) { const y = -h + (h * i) / 7, hw = (w / 2) * (i / 7); courses += c.ribbon([[-hw + 2, y], [hw * 0.24, y]], 1); }
  s.x(courses, shade(col, -0.2), 'opacity=".4"');
  return s.out();
}
/** a sleeping person lying on a mat under a blanket; origin: middle of the mat top */
export function sleeper(c, look, { w = 200, flip = false, s = 0.7, markup = null, blanket = mix(C.dustyBlue, C.stone, 0.4) } = {}) {
  const mat = sheet();
  mat.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 6, 10], [-w / 2 + 6, 10]], 0.4, 7), mix(C.basket, C.wood3, 0.3));
  mat.x(c.ribbon([[-w / 2 + 8, 5], [w / 2 - 8, 5]], 1.2), shade(C.basket, -0.25), 'opacity=".6"');
  const p = markup || person(c, { ...look, eyes: 'closed', holdF: '', holdB: '' });
  const pil = sheet().p(c.cut(c.blob(-w / 2 + 26, -8, 26, 10, 10, 0.12), 0.3, 4), mix(C.linen2, C.skyVeil, 0.4)).out();
  const bl = sheet();
  bl.p(c.cut([[-w * 0.18, -2], [-w * 0.2, -26], [-w * 0.05, -34], [w * 0.2, -33], [w * 0.42, -26], [w * 0.47, -2]], 0.6, 6), blanket);
  bl.x(c.ribbon([[-w * 0.16, -24], [w * 0.4, -24]], 2), shade(blanket, -0.15), 'opacity=".6"');
  const body = `<g transform="translate(${w / 2 - 24} ${-26 * s}) rotate(-90) scale(${s})">${p}</g>`;
  return `<g transform="scale(${flip ? -1 : 1} 1)">${mat.out()}${pil}${body}${bl.out()}</g>`;
}
/** a humble bed of blankets for a sleeping woman sitting against the wall is simpler as a sit puppet; this is a
 *  straw sleeping mat alone; origin: top centre */
export function strawMat(c, w = 170) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 6, 10], [-w / 2 + 6, 10]], 0.4, 7), mix(C.basket, C.wood3, 0.3));
  return s.out();
}
/** a flat-roofed house of Bethlehem / Egypt / Nazareth; origin: ground left corner; returns markup */
export function flatHouse(c, x, y, w, h, { wall = C.plaster, wall2 = C.plaster2, roofEdge = C.roof, door = C.wood2, win = C.soilDark, lit = false, doorX = 0.2 } = {}) {
  return house(c, x, y, w, h, { wall, shadow: wall2, roofEdge, door, win, lit, stairs: false });
}
/** a walled hill town: houses climbing a mound; origin: its ground centre */
export function hillTown(c, { w = 300, h = 90, col = C.sand2, wall = C.plaster, wall2 = C.plaster2, roof = C.roof, n = 9, lit = 0, towers = false } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 40, 0], ...c.arc(0, 0, w / 2 + 40, h, PI, 2 * PI, 16), [w / 2 + 40, 0]], 1, 10), col);
  let out = s.out();
  const xs = Array.from({ length: n }, (_, i) => -w / 2 + (w * (i + 0.5)) / n + c.rr(-8, 8));
  xs.sort((a, b) => Math.abs(b) - Math.abs(a));
  xs.forEach((x) => {
    const top = -Math.sqrt(Math.max(0, 1 - (x / (w / 2 + 40)) ** 2)) * h;
    const hw = c.rr(26, 40), hh = c.rr(20, 32);
    out += house(c, x - hw / 2, top + 12, hw, hh, { wall, shadow: wall2, roofEdge: roof, door: shade(wall2, -0.4), win: C.soilDark, stairs: false, lit: lit > 0 && c.chance(lit) });
  });
  if (towers) {
    const t = sheet();
    [-w * 0.22, w * 0.18].forEach((x) => {
      const top = -Math.sqrt(Math.max(0, 1 - (x / (w / 2 + 40)) ** 2)) * h;
      t.p(c.cut(c.rect(x - 11, top - 60, 22, 70), 0.4, 6), shade(wall, -0.06));
      let cr = '';
      for (let k = 0; k < 3; k++) cr += c.poly(c.rect(x - 11 + k * 8, top - 66, 5, 6));
      t.p(cr, shade(wall, -0.06));
    });
    out += t.out();
  }
  return out;
}
/** a shepherd's crook of gold with a crown hanging on it; origin: its foot */
export function crookCrown(c, h = 200) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0, -h * 0.82]], 7), C.sun);
  s.p(c.ribbon(c.arc(14, -h * 0.82, 14, 16, PI, 2 * PI + 0.4, 10), 7), C.sun);
  return s.out() + `<g transform="translate(26 ${-h * 0.72}) scale(.9)">${crown(c, C.sun)}</g>`;
}
/** Herod's palace hall (after Mark 6): sky through two arches, Jerusalem's roofs beyond, columns, a dais and a
 *  throne between two candlesticks, drapes above. Returns handles. */
export const HY = 690;
export function palaceSet(S, { skyCols = HALL, drapes = true, cityDim = 0 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const view = S.layer({ par: 0.12, sh: 1 });
  view.add(sheet().p(c.ridge(c.wave(450, [14, 5], [260, 90]), -900, 2500, 1700, 12, 1), mix(mix(C.hillMid, C.duskViolet, 0.35), C.night, cityDim)).out());
  const cityCol = (col) => mix(col, C.night, cityDim);
  view.add(town(c, { x: 520, y: 480, n: 7, spread: 200, sc: 0.62, wall: cityCol(mix(C.plaster, C.dawn, 0.3)), shadow: cityCol(C.plaster2) }) + town(c, { x: 1080, y: 480, n: 7, spread: 200, sc: 0.62, wall: cityCol(mix(C.plaster, C.dawn, 0.3)), shadow: cityCol(C.plaster2) }));
  const wall = S.layer({ par: 0.2, sh: 3 });
  const W = sheet();
  const arches = [520, 1080].map((x) => [[x - 60, 470], [x - 60, 300], ...c.arc(x, 300, 60, 60, PI, 2 * PI, 12), [x + 60, 470]]);
  W.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 640], [-1200, 640]], 1, 30) + arches.map((a) => c.hole(a, 0.5, 6)).join(''), mix(C.stone, C.dawn, 0.3));
  let blocks = '';
  for (let y = -200; y < 620; y += 52) for (let x = -1200 + (Math.round(y / 52) % 2 ? 70 : 0); x < 2800; x += 140) blocks += c.cut(c.rect(x + c.rr(0, 6), y, c.rr(110, 128), 44), 0.6, 10);
  W.x(blocks, shade(C.stone, -0.05), 'opacity=".4"');
  let fr = '';
  for (let x = -600; x < 2400; x += 40) fr += c.cut(c.rect(x, 90, 20, 20), 0.2, 4);
  W.p(c.cut([[-1200, 82], [2800, 82], [2800, 118], [-1200, 118]], 0.4, 20), C.plumRobe).p(fr, C.sun);
  wall.add(W.out());
  const column = (x, y, h, w = 50, col = C.stone) => {
    const s = sheet();
    s.p(c.cut(c.rect(x - w / 2, y - h, w, h), 0.5, 10), col);
    s.x(c.ribbon([[x - w * 0.2, y - h + 20], [x - w * 0.2, y - 16]], 3) + c.ribbon([[x + w * 0.15, y - h + 20], [x + w * 0.15, y - 16]], 3), shade(col, -0.12), 'opacity=".6"');
    s.p(c.cut(c.rect(x - w / 2 - 10, y - h - 14, w + 20, 16), 0.4, 6) + c.cut(c.rect(x - w / 2 - 8, y - 14, w + 16, 16), 0.4, 6), shade(col, -0.08));
    return s.out();
  };
  wall.add(column(320, 640, 540) + column(550, 640, 540) + column(1050, 640, 540) + column(1280, 640, 540) + column(-80, 640, 540) + column(1680, 640, 540));
  const floor = S.layer({ par: 0.45, sh: 3 });
  const F = sheet();
  F.p(c.cut([[-1200, 630], [2800, 630], [2800, 1700], [-1200, 1700]], 0.6, 30), mix(C.stone, C.sand, 0.3));
  let chk = '';
  for (let y = 650; y < 1200; y += 44) for (let x = -700 + (Math.round(y / 44) % 2) * 50; x < 2300; x += 100) chk += c.poly([[x, y], [x + 50, y], [x + 50, y + 22], [x, y + 22]]);
  F.x(chk, mix(C.plumRobe, C.stone, 0.6), 'opacity=".35"');
  F.p(c.cut([[660, HY - 30], [940, HY - 30], [960, HY], [640, HY]], 0.5, 8), shade(C.stone2, -0.05));
  F.p(c.cut([[620, HY], [980, HY], [990, HY + 18], [610, HY + 18]], 0.5, 8), C.stone2);
  F.p(c.cut([[590, HY + 18], [1010, HY + 18], [1020, HY + 30], [580, HY + 30]], 0.4, 8), C.plumRobe);
  floor.add(F.out());
  const thr = floor.add(`<g transform="translate(804 ${HY - 30}) scale(1.1)">${throne(c)}</g>`);
  const cands = [640, 960].map((x) => {
    floor.add(`<g transform="translate(${x} ${HY - 30})">${sheet().p(c.cut([[-18, 0], [-6, -10], [-4, -120], [4, -120], [6, -10], [18, 0]], 0.3, 5), C.sun).out()}</g>`);
    return { x, el: floor.add(`<g transform="translate(${x} ${HY - 150})"><circle r="60" fill="url(#warm-glow)"/><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/></g>`) };
  });
  let fg = null;
  if (drapes) {
    fg = S.layer({ par: 0.9, sh: 8 });
    fg.add(sheet().p(c.cut([[-1200, -1400], [2800, -1400], [2800, 70], [-1200, 80]], 0.8, 16), shade(C.plumRobe, -0.2)).x(c.ribbon([[-1200, 66], [2800, 62]], 6), C.sun).out());
  }
  return {
    sk, view, wall, floor, fg, thr, cands,
    update(time, { o = 1, wild = 0 } = {}) {
      cands.forEach((f, i) => {
        const k = 1 + Math.sin(time * 9 + i * 2) * 0.08 + wild * Math.sin(time * 17 + i) * 0.12;
        pose(f.el, { x: f.x, y: HY - 150, sx: 1 / k, sy: k, r: wild * Math.sin(time * 5 + i) * 8, o });
      });
    },
  };
}

/** a starry night sky layer (stars as one still sheet) + a hung moon; returns { sk, hangL, moonEl } */
export function nightSky(S, { cols = NIGHT, moonAt = null, n = 150, y1 = 440 } = {}) {
  const c = S.c;
  const sk = sky(S, cols);
  const hangL = S.layer({ par: 0.03, sh: 4 });
  hangL.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -900, y1, n })}</g>`);
  const moonEl = moonAt ? hanging(hangL, moon(c, 36), { x: moonAt[0], y: moonAt[1], len: 800 }) : null;
  return { sk, hangL, moonEl };
}

/** the inside of the little house in Bethlehem: back wall with a window, a doorway on the right, a niche with a lamp,
 *  a bench, the floor. night: dim, a lamp lit. Returns handles. FLOOR = 690 */
export const FLOOR = 690;
export function roomSet(S, { night = false, winSky = null, doorX = 1170, bench = true } = {}) {
  const c = S.c;
  const k = night ? 0.5 : 0;
  const sk = sky(S, winSky || (night ? NIGHT : DAY));
  // what the window and the door show
  const out = S.layer({ par: 0.1, sh: 1 });
  if (night) out.add(`<g>${stars(c, { x0: 300, x1: 1400, y0: 200, y1: 460, n: 30 })}</g>`);
  out.add(sheet().p(c.ridge(c.wave(520, [14, 5], [300, 100]), -900, 2500, 1700, 12, 1), dim(C.hillMid, k)).out());
  const wallL = S.layer({ par: 0.3, sh: 3 });
  const wcol = dim(mix(C.plaster, C.dawn, 0.25), k), wcol2 = dim(C.plaster2, k);
  const Wd = sheet();
  const win = [[520, 300], [620, 300], [620, 420], [520, 420]];
  const door = [[doorX - 70, FLOOR], [doorX - 70, 420], ...c.arc(doorX, 420, 70, 60, PI, 2 * PI, 10), [doorX + 70, FLOOR]];
  Wd.p(c.cut([[-1200, -1200], [2800, -1200], [2800, FLOOR + 10], [-1200, FLOOR + 10]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), wcol);
  let stones = '';
  for (let i = 0; i < 40; i++) stones += c.cut(c.blob(c.rr(-600, 2200), c.rr(80, 640), c.rr(20, 40), c.rr(10, 18), 8, 0.2), 0.6, 6);
  Wd.x(stones, wcol2, 'opacity=".45"');
  // beams under the roof
  Wd.p(c.cut([[-1200, 150], [2800, 150], [2800, 176], [-1200, 176]], 0.5, 20), dim(C.wood2, k));
  let bm = '';
  for (let x = -1100; x < 2800; x += 180) bm += c.cut(c.rect(x, 110, 28, 40), 0.3, 6);
  Wd.p(bm, dim(C.wood, k));
  // window frame and sill, the niche for the lamp
  Wd.p(c.cut([[510, 424], [630, 424], [634, 436], [506, 436]], 0.3, 6), dim(C.wood3, k));
  Wd.p(c.cut([[300, 470], [300, 400], ...c.arc(340, 400, 40, 36, PI, 2 * PI, 8), [380, 470]], 0.4, 6), dim(C.plaster2, k + 0.1));
  wallL.add(Wd.out());
  // a shelf with jars, a rolled mat, a loom-ish hanging cloth
  const props = sheet();
  props.p(c.cut(c.rect(760, 330, 190, 10), 0.3, 6), dim(C.wood, k));
  props.p(c.cut([[780, 330], [772, 296], [790, 286], [806, 296], [798, 330]], 0.3, 4) + c.cut([[830, 330], [826, 306], [846, 302], [850, 330]], 0.3, 4), dim(C.pot, k));
  props.p(c.cut([[880, 330], [884, 300], [920, 300], [924, 330]], 0.3, 4), dim(C.basket, k));
  props.p(c.cut([[140, 180], [250, 180], [256, 380], [246, 392], [150, 392], [134, 380]], 0.6, 7), dim(C.dustyBlue, k + 0.05));
  props.x(c.ribbon([[140, 220], [250, 220]], 4) + c.ribbon([[140, 340], [250, 340]], 4), dim(C.terracotta, k), 'opacity=".7"');
  wallL.add(props.out());
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const Fl = sheet();
  Fl.p(c.cut([[-1200, FLOOR - 4], [2800, FLOOR - 4], [2800, 1700], [-1200, 1700]], 0.6, 20), dim(mix(C.sand2, C.clay, 0.2), k));
  let str = '';
  for (let i = 0; i < 60; i++) { const x = c.rr(-600, 2200), y = c.rr(FLOOR + 6, 1100); str += c.ribbon([[x, y], [x + c.rr(-16, 16), y + c.rr(-3, 3)]], 1.6); }
  Fl.x(str, dim(C.wheat, k), 'opacity=".55"');
  floorL.add(Fl.out());
  // a low bench along the wall (Mary sits on it)
  if (bench) floorL.add(sheet().p(c.cut([[640, FLOOR - 50], [960, FLOOR - 50], [960, FLOOR - 38], [640, FLOOR - 38]], 0.4, 8), dim(C.wood, k)).p(c.cut(c.rect(652, FLOOR - 38, 14, 38), 0.3, 5) + c.cut(c.rect(934, FLOOR - 38, 14, 38), 0.3, 5), dim(C.wood2, k)).p(c.cut(c.blob(800, FLOOR - 54, 110, 9, 12, 0.1), 0.4, 5), dim(C.jesusMantle, k * 0.6)).out());
  // the lamp in its niche
  const lampL = S.layer({ par: 0.3, sh: 2 });
  const lampEl = lampL.add(`<g transform="translate(330 470) scale(.7)"><circle class="glow" cx="34" cy="-30" r="190" fill="url(#warm-glow)"/>${sheet().p(c.cut([[-26, 0], [-30, -8], [-18, -16], [10, -16], [24, -12], [34, -16], [38, -12], [26, -2], [14, 2], [-18, 2]], 0.4, 5), C.pot).out()}<g class="flame" transform="translate(35 -16)"><path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/></g></g>`);
  const lamp = { glow: lampEl.querySelector('.glow'), flame: lampEl.querySelector('.flame') };
  return { sk, out, wallL, floorL, lampL, lamp, doorX };
}

/** Egypt: pyramids and palms along the Nile, a small house of mud brick on the left. Returns handles. GY ≈ 700 */
export const GY = 700;
export function egyptSet(S, { night = false, cols = null, houseX = 250 } = {}) {
  const c = S.c;
  const k = night ? 0.45 : 0;
  const sk = sky(S, cols || (night ? NIGHT : DESERT));
  const hangL = S.layer({ par: 0.03, sh: 4 });
  if (night) hangL.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -900, y1: 420, n: 140 })}</g>`);
  const far = S.layer({ par: 0.07, sh: 2 });
  far.add(band(c, { y: 470, amps: [5, 3, 1], lens: [900, 300, 110], color: dim(mix(C.sand, C.dune, 0.4), k) }).markup);
  far.add(`<g transform="translate(1160 474)">${pyramid(c, 330, 210, dim(mix(C.dune, C.sand, 0.3), k))}</g><g transform="translate(1420 476)">${pyramid(c, 230, 140, dim(mix(C.dune, C.sand, 0.45), k))}</g><g transform="translate(980 476)">${pyramid(c, 150, 90, dim(mix(C.dune, C.sand, 0.55), k))}</g>`);
  const nile = S.layer({ par: 0.12, sh: 1 });
  nile.add(waterBand(c, { y: 492, color: dim(mix(C.lake, C.skyBlue, 0.3), k), foamN: 20, bottom: 560 }).markup);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const mfn = c.wave(548, [6, 3], [700, 200]);
  mid.add(sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1), dim(mix(C.sand, C.wheatGreen, 0.25), k)).out());
  let palms = '';
  [[-80, 1], [60, 0.8], [520, 0.9], [640, 1.1], [1460, 0.9], [1620, 1.05], [1800, 0.85]].forEach(([x, s]) => { palms += palm(c, x, mfn(x) + 4, 170 * s, { trunk: dim(C.wood3, k), frond: dim(C.moss, k), frond2: dim(C.leaf, k) }); });
  mid.add(palms + reeds(c, 300, mfn(300) + 6, 10, 60, dim(C.olive, k), dim(C.wood3, k)) + reeds(c, 1320, mfn(1320) + 6, 9, 56, dim(C.olive, k), dim(C.wood3, k)));
  const G = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(GY - 20, [4, 2], [700, 180]);
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), dim(mix(C.sand, C.sand2, 0.4), k)).out());
  // the house of mud brick with a palm-frond roof
  const hs = sheet();
  const hx = houseX, hw = 250, hh = 200, hy = GY - 16;
  hs.p(c.cut([[hx - hw / 2, hy], [hx - hw / 2, hy - hh], [hx + hw / 2, hy - hh], [hx + hw / 2, hy]], 0.6, 10), dim(mix(C.clay, C.sand2, 0.5), k));
  hs.p(c.cut([[hx + hw / 2, hy - hh + 10], [hx + hw / 2 + 40, hy - hh + 22], [hx + hw / 2 + 40, hy], [hx + hw / 2, hy]], 0.4, 8), dim(mix(C.clay, C.sand2, 0.25), k));
  hs.p(c.cut([[hx - hw / 2 - 16, hy - hh + 6], [hx - hw / 2 - 6, hy - hh - 14], [hx + hw / 2 + 50, hy - hh - 10], [hx + hw / 2 + 56, hy - hh + 10]], 0.8, 6), dim(C.olive, k));
  hs.p(c.cut([[hx - 30, hy], [hx - 30, hy - 100], ...c.arc(hx, hy - 100, 30, 26, PI, 2 * PI, 8), [hx + 30, hy]], 0.4, 6), dim(C.soilDark, k * 0.6));
  hs.x(c.poly(c.rect(hx + 60, hy - 150, 30, 26)), night ? C.lampFlame : dim(C.soilDark, k), night ? 'opacity=".85"' : '');
  let bricks = '';
  for (let y = hy - hh + 20; y < hy - 6; y += 22) for (let x = hx - hw / 2 + 8 + (Math.round(y / 22) % 2) * 20; x < hx + hw / 2 - 30; x += 40) bricks += c.ribbon([[x, y], [x + 30, y + c.rr(-1, 1)]], 1.2);
  hs.x(bricks, dim(shade(C.clay, -0.2), k), 'opacity=".35"');
  G.add(hs.out());
  G.add(grass(c, { x0: -800, x1: 2400, y: GY, fn: gfn, n: 24, h: 12, color: dim(C.olive, k) }));
  return { sk, hangL, far, nile, mid, G, gfn, mfn };
}

/** a hanging title word on a string (for place names); origin: centre */
export function placeTag(c, text, size = 22) {
  const ww = Math.max(70, text.length * size * 0.5 + size * 1.4), hh = size * 1.55;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), C.cream);
  s.x(c.ribbon([[-ww / 2 + 6, -hh / 2 + 5], [ww / 2 - 6, -hh / 2 + 3]], 1.2), C.terracotta, 'opacity=".6"');
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** a golden word on a dark-rimmed plate (a prophecy spoken): lines of text; origin centre */
export function prophecyPlate(c, lines, { size = 22, w, fill = mix(C.parchment, C.halo, 0.35), rim = C.haloRim, ink = C.ink } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.48 + size * 2;
  const hh = lines.length * size * 1.2 + size * 1.1;
  const s = sheet();
  s.p(c.cut(c.rect(-ww / 2 - 6, -hh / 2 - 6, ww + 12, hh + 12), 0.5, 7), rim);
  s.p(c.cut(c.rect(-ww / 2, -hh / 2, ww, hh), 0.5, 7), fill);
  const t0 = -((lines.length - 1) * size * 1.2) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="0" y="${(t0 + i * size * 1.2).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  return `${s.out()}${txt}`;
}
/** the donkey carrying Mary with the Child in her arms; returns markup for coltRig. babyK: data-k of the infant */
export function donkeyWithMary(c, { infant: inf, child = null } = {}) {
  const maryRide = person(c, { ...LOOK.mary, pose: 'sit', holdF: '' });
  const leg = sheet();
  leg.p(c.cut([[14, -106], [40, -104], [44, -78], [42, -48], [30, -44], [22, -70]], 0.5, 6), LOOK.mary.robe);
  leg.p(c.cut(c.ell(40, -42, 11, 4.6, 12), 0.3, 4), C.sandal);
  const saddle = sheet().p(c.cut([[-50, -104], [-10, -114], [30, -110], [36, -86], [32, -64], [-46, -66], [-52, -84]], 0.7, 6), C.terracotta).x(c.ribbon([[-44, -70], [28, -72]], 3), C.wheat, 'opacity=".7"').out();
  const kid = inf ? `<g transform="translate(6 -158) rotate(-14) scale(.72)">${inf}</g>` : child ? `<g transform="translate(38 -118) scale(.42)">${child}</g>` : '';
  return { saddle, rider: `<g transform="translate(-16 -106) scale(.95)">${maryRide}</g>${leg.out()}${kid}` };
}

/** a round medallion with a clipped bust of a puppet (markup) and an optional label; origin centre. id: S.id(…) */
export function bustMedal(c, id, markup, { r = 58, face = mix(C.parchment, C.dawn, 0.3), rim = C.ochre, label = '', size = 17, dx = 0 } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 7, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 36), 0.5, 5), face).out();
  const k = r / 40;
  const lab = label ? `<g transform="translate(0 ${r + 26})">${placeTag(c, label, size)}</g>` : '';
  return `${s}<clipPath id="${id}"><circle r="${r}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${(-2 * k + dx).toFixed(1)} ${(-r * 0.12 + 167 * k).toFixed(1)}) scale(${k.toFixed(3)})">${markup}</g></g>${lab}`;
}

/** one of the Magi riding his camel (faces right; walkCamel(el, phase) moves its legs); origin: between the feet */
const CAMELS = ['#c79d68', mix('#c79d68', C.sand, 0.35), mix('#c79d68', C.wood2, 0.3)];
const BLANKETS = [C.terracotta, mix(C.indigo, C.dustyBlue, 0.4), C.plumRobe];
export function camelRider(c, i, { rider: withRider = true } = {}) {
  const o = MAGI[i % 3];
  const rider = magus(c, i, { pose: 'sit' });
  const leg = sheet();
  leg.p(c.cut([[12, -196], [30, -194], [36, -160], [36, -128], [24, -126], [20, -160]], 0.5, 6), o.robe);
  leg.p(c.cut(c.ell(33, -124, 10, 4.2, 12), 0.3, 4), C.sandal);
  const tassels = sheet();
  let d = '';
  for (let k = 0; k < 5; k++) d += c.cut(c.circ(-40 + k * 15, -106 + (k % 2) * 3, 3.4, 8), 0.2, 2);
  tassels.p(d, BLANKETS[i % 3]);
  const m = camel(c, { color: CAMELS[i % 3] }).replace(new RegExp(`fill="${C.terracotta}"`), `fill="${BLANKETS[i % 3]}"`);
  return m.replace('<g class="legF">', `${withRider ? `<g transform="translate(-26 -168) scale(.82)">${rider}</g>${leg.out()}` : ''}${tassels.out()}<g class="legF">`);
}
/** a stepped tower of the East under the stars (for a vignette); origin: base centre */
export function ziggurat(c, w = 120, col = C.dune) {
  const s = sheet();
  for (let k = 0; k < 4; k++) { const ww = w * (1 - k * 0.22), h = 22; s.p(c.cut(c.rect(-ww / 2, -(k + 1) * h, ww, h + 1), 0.4, 6), shade(col, -k * 0.05)); }
  s.p(c.cut([[-6, 0], [-4, -60], [4, -60], [6, 0]], 0.3, 4), shade(col, -0.25));
  return s.out();
}

/** a striped travellers' tent; origin: base centre */
export function tent(c, { w = 260, h = 170, col = C.wheatRobe, stripe = C.terracotta, inside = C.soilDark } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.08, -h], [w * 0.08, -h], [w / 2, 0]], 0.6, 8), col);
  s.p(c.cut([[-w * 0.16, 0], [0, -h * 0.72], [w * 0.16, 0]], 0.4, 6), inside);
  let st = '';
  for (let i = 1; i < 4; i++) { const u = i / 4; st += c.ribbon([[-w * 0.08 - (w * 0.42) * u, -h + h * u], [-w * 0.2 * u - w * 0.04, -h + h * u]], 5) + c.ribbon([[w * 0.2 * u + w * 0.04, -h + h * u], [w * 0.08 + (w * 0.42) * u, -h + h * u]], 5); }
  s.x(st, stripe, 'opacity=".7"');
  s.p(c.ribbon([[0, -h - 26], [0, -h + 4]], 5), C.wood2);
  s.x(c.cut([[0, -h - 26], [20, -h - 20], [0, -h - 14]], 0.2, 3), stripe);
  return s.out();
}
/** a two-armed signpost; texts [left, right]; origin: foot of the post */
export function forkSign(c, left, right, { size = 17 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-4, -150, 8, 152), 0.3, 6), C.wood2);
  const board = (text, dir, y) => {
    const w = size * (0.52 * String(text).length + 1.6), h = size * 1.5;
    const pts = dir > 0 ? [[4, y], [4 + w, y], [18 + w, y + h / 2], [4 + w, y + h], [4, y + h]] : [[-4, y], [-4 - w, y], [-18 - w, y + h / 2], [-4 - w, y + h], [-4, y + h]];
    s.p(c.cut(pts, 0.4, 6), C.wood3);
    return `<text x="${dir * (4 + w / 2 + 3)}" y="${(y + h * 0.5 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
  };
  const t1 = board(left, -1, -146), t2 = board(right, 1, -110);
  return s.out() + t1 + t2;
}
