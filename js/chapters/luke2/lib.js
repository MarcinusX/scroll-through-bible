// Luke 2 — the cast and cut-outs of this chapter: Caesar Augustus with his laurel and the decree, the roads of
// the census, the stable in the rock under the full inn, the shepherds' night field and the multitude of paper
// angels, the Temple court where old Simeon and the prophetess Anna meet the Child, Nazareth, the Passover
// caravan and the boy of twelve among the teachers. Mary, Joseph and the Child are those of Matthew 1–2.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, hillsWith, stars, moon, sun, cloud, town, olive, cypress, palm, grass, rock, bush, flowers } from '../../assets/nature.js';
import { fade, attr, es, ease, bump, seg, clamp } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { addToHead, addToBody } from '../mark2/lib.js';
import { JOSEPH as MT_JOSEPH, MARY as MT_MARY } from '../matthew1/lib.js';
import { LOOK as MT2, hillTown } from '../matthew2/lib.js';
import { baby as babyCut } from '../john1/lib.js';
import { ewe } from '../john10/lib.js';
import { curuleSeat, dais, eagleStandard, vexillum, swag, standLamp } from '../mark15/lib.js';
import { column } from '../mark1/lib.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, scrollOpen, scrollRolled, lantern, coin, turban, scribe, bowl, loaf, cup, jug } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, sparkle, tapeX, silhouette } from '../mark3/lib.js';
export { angel, glory, soulLight, oilHorn, globe, say, tag } from '../mark8/lib.js';
export { dove, flapWings, voiceRings, hang2, scrollParts, signpost } from '../mark1/lib.js';
export { crown, staff, sheep, workbench, disc } from '../mark6/lib.js';
export { templeCourt, courtFront, sanctuary, portico, jerusalem, priest, elder, cage, smallDove, flapDove, colt, coltRig, cityWall, lamb } from '../mark11/lib.js';
export { ox, heartWindow, openWindow, verseScroll } from '../john2/lib.js';
export { manger, baby, glowDisc, rayBurst, radiance, doorHouse, goldWord, hungGold, hungWord, hungPlate, iconWord, figureIcon, smallAngel } from '../john1/lib.js';
export { ewe, sheepRig, shoulderLamb, onShoulders, SHEPHERD, WOOLS, lanternHeld, wolf } from '../john10/lib.js';
export { hillTown, flatHouse, placeTag, prophecyPlate, group, folk, bigStar, starBeam, dim, donkeyWithMary, bustMedal, childPerson, tent, roomSet, FLOOR as ROOM_FLOOR } from '../matthew2/lib.js';
export { hangAt, vpose, beamGrad, lightBeam, cradle } from '../john3/lib.js';
export { childInArms, medal, RIM, glowStar, numberCard, dreamCloud } from '../matthew1/lib.js';
export { centurion, soldier, sealedScroll, hourglass, curuleSeat, eagleStandard, vexillum, standLamp, swag, dais, board } from '../mark15/lib.js';
export { daysString } from '../john20/lib.js';
export { shadowHand, alabaster, zzz } from '../mark14/lib.js';
export { tint } from '../mark13/lib.js';
export { lyingPerson } from '../mark5/lib.js';
export { tr, es, ease, bump, seg, clamp, fade, attr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const DYP = { stand: 0, kneel: 46, sit: 62 };

/* ================================================================== skies */
export const NIGHT = [C.night2, C.night, mix(C.indigo, C.duskViolet, 0.3)];
export const DEEP = [mix(C.night2, '#10132b', 0.5), C.night2, mix(C.night, C.indigo, 0.5)];
export const GLORY = ['#6d6aa0', '#d9b98f', '#f6dfae'];          // the night lit by the glory of the Lord
export const HEAVEN = ['#e9cf95', '#f6e2b4', '#fbeed0'];         // the sky full of the host
export const DUSK = [mix(C.duskViolet, C.night, 0.35), mix(C.dusk, C.duskViolet, 0.3), C.peach];
export const DAWN = [mix(C.lavender, C.skyBlue, 0.5), mix(C.dawn, C.peach, 0.3), C.cream];
export const DAY = [C.skyBlue, mix(C.cream, C.skyBlue, 0.3), mix(C.dawn, C.cream, 0.5)];
export const TEMPLE_DAY = ['#d3dfd6', '#f2e2c4', '#f6dcbc'];
export const EVENING = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
export const ROME = ['#c9d6d6', '#efe2c9', '#f6e4c6'];

/* ================================================================== the cast */
export const MARY = MT_MARY;
export const JOSEPH = MT_JOSEPH;
/** the Child (Matthew 2's look: curls the colour of His hair as a man, the halo) */
export const CHILD = MT2.child;
/** the boy of twelve: the same curls and halo, a linen tunic and a small rose mantle */
export const BOY = { robe: C.linen, mantle: mix(C.jesusMantle, C.roseRobe, 0.5), hair: C.hairJesus, hairStyle: 'curly', beard: 'none', skin: C.skin, halo: true, belt: null };
/** Simeon: a very old man of Jerusalem, white beard, a plain grey robe and a soft blue mantle, a striped head-cloth */
export const SIMEON = { robe: mix(C.stone, C.linen2, 0.4), mantle: mix(C.dustyBlue, C.tealRobe, 0.35), hair: '#ece6da', hairStyle: 'wrap', veil: C.linen, veil2: mix(C.dustyBlue, C.indigo, 0.25), beard: 'wild', beardColor: '#f1ece2', skin: C.skin2, belt: C.leather };
/** Anna, the prophetess: very old, a deep violet veil and mantle over a cream robe */
export const ANNA = { robe: C.linen2, mantle: mix(C.plumRobe, C.lavender, 0.3), hairStyle: 'veil', veil: mix(C.plumRobe, C.duskViolet, 0.45), veil2: shade(mix(C.plumRobe, C.duskViolet, 0.45), -0.14), hair: C.greyHair, skin: C.skin3, belt: null };
/** Anna as a young bride, and her husband (for the memory of the seven years) */
export const ANNA_YOUNG = { ...ANNA, veil: C.blushVeil, veil2: shade(C.blushVeil, -0.1), mantle: C.roseRobe, hair: C.hair3 };
export const HUSBAND = { robe: C.wheatRobe, mantle: C.tealRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather };
/** the shepherds: a young herdsman, an old one in a sheepskin, a middle one, a boy */
export const SHEPHERDS = [
  { robe: C.wheatRobe, mantle: mix(C.clayMantle, C.ochre, 0.3), hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.terracotta, beard: 'short', skin: C.skin2, belt: C.leather },
  { robe: mix(C.linen2, C.wheat, 0.25), fur: true, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, veil2: C.wood3, beard: 'full', beardColor: '#e3dccf', skin: C.skin3, belt: C.leather },
  { robe: mix(C.sageRobe, C.olive, 0.25), mantle: mix(C.wood3, C.sand2, 0.4), hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.rope },
  { robe: C.ochreRobe, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.leather },
];
/** Caesar Augustus: a purple mantle over the white toga, the golden laurel */
export const CAESAR = { robe: mix(C.linen, C.stone, 0.2), mantle: mix(C.plumRobe, C.indigo, 0.25), skin: C.skin, hair: C.hair2, hairStyle: 'short', beard: 'none', belt: null };
export const CLERK = { robe: C.linen2, mantle: null, skin: C.skin3, hair: C.hair3, hairStyle: 'short', beard: 'none', belt: C.terracotta };
export const INNKEEPER = { robe: C.ochreRobe, mantle: null, skin: C.skin2, hair: C.hair3, hairStyle: 'bald', beard: 'short', belt: C.leather };
export const MESSENGER = { robe: mix(C.terracotta, C.clay, 0.45), mantle: null, belt: C.leather, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3 };

/** the golden laurel of Caesar (head coords) */
export function laurel(c) {
  let d = '', d2 = '';
  for (let i = 0; i < 11; i++) {
    const a = PI * (0.98 + i * 0.085);
    const leaf = c.cut(c.ell(Math.cos(a) * 19.5, Math.sin(a) * 19 - 1, 6.4, 2.8, 8, a + PI / 2 + (i % 2 ? 0.5 : -0.5)), 0.2, 3);
    if (i % 2) d += leaf; else d2 += leaf;
  }
  return sheet().p(d, C.sun).p(d2, shade(C.sun, -0.14)).out();
}
/** Caesar Augustus as a puppet */
export function caesar(c, extra = {}) {
  const P = extra.pose || 'stand', dy = DYP[P];
  const band = c.ribbon([[25, -131 + dy], [19, -122 + dy], [2, -106 + dy], [-15, -84 + dy], [-26, -57 + dy]], 3.2);
  return addToHead(addToBody(person(c, { ...CAESAR, ...extra }), `<path d="${band}" fill="${C.sun}"/>`), laurel(c));
}
/** Mary with child: a soft rounded front added to her robe (body coords) */
export function withChild(markup, c, col = MARY.robe, P = 'stand') {
  const dy = DYP[P];
  return addToBody(markup, `<path d="${c.cut(c.ell(26, -86 + dy, 13, 27, 16), 0.3, 4)}" fill="${col}"/>`);
}
/** a person puppet with a bigger head, for children (k: head scale) */
export function kid(c, o = {}, k = 1.42) {
  const P = o.pose || 'stand', dy = DYP[P];
  const m = person(c, { hairStyle: 'short', beard: 'none', ...o });
  return m.replace(`<g class="head" transform="translate(2 ${-167 + dy})">`, `<g class="head" transform="translate(2 ${-160 + dy + (k - 1) * 8}) scale(${k})">`);
}
/** a newborn in a loose cream cloth (the Child before He is swaddled); origin as john1 baby */
export function newborn(c) {
  const s = sheet();
  s.x(c.poly(c.circ(26, -18, 20, 20)), C.halo, 'opacity=".95"');
  s.p(c.cut(c.star(26, -18, 21, 18, 14, 0), 0.3, 3), C.haloRim);
  s.p(c.cut(c.circ(26, -18, 17, 18), 0.3, 3), C.halo);
  s.p(c.cut([[-40, -8], [-30, -26], [-6, -30], [16, -26], [18, -4], [6, 4], [-24, 4]], 0.6, 5), mix(C.linen, C.blushVeil, 0.3));
  s.p(c.cut(c.circ(26, -16, 11, 14), 0.2, 3), C.skin);
  s.p(c.cut([...c.arc(26, -16, 11.5, 11.5, PI * 0.95, PI * 1.9, 8), [30, -22], [20, -20]], 0.3, 3), C.hairJesus);
  s.x(c.ribbon(c.arc(29, -16, 2, 1.4, 0.2, PI - 0.2, 4), 0.9) + c.ribbon(c.arc(34, -16, 1.8, 1.4, 0.2, PI - 0.2, 4), 0.9), C.inkSoft);
  s.x(c.poly(c.circ(31, -10, 2.4, 8)), C.blush, 'opacity=".6"');
  s.p(c.cut(c.circ(14, -8, 4.4, 8), 0.2, 2), C.skin);
  return s.out();
}
/** a child held in the arms (arm-local, for holdF with armF ≈ 70); swaddled or newborn */
export const inArms = (c, kind = 'swaddled') => `<g transform="rotate(-70) translate(-14 12) scale(.9)">${kind === 'new' ? newborn(c) : babyCut(c)}</g>`;

/* ================================================================== small things */
/** a small campfire: stones round it; the flames are a separate piece (fireFlames); origin: ground centre */
export function fireStones(c, w = 90) {
  const s = sheet();
  let st = '';
  for (let i = 0; i < 7; i++) { const x = -w / 2 + (i + 0.5) * (w / 7); st += c.cut(c.blob(x, -6, 9, 7, 8, 0.25), 0.4, 3); }
  s.p(c.cut([[-w * 0.36, -8], [w * 0.36, -14], [w * 0.3, -4], [-w * 0.3, -2]], 0.4, 4), C.wood2);
  s.p(c.cut([[-w * 0.34, -14], [w * 0.34, -6], [w * 0.28, 0], [-w * 0.3, -6]], 0.4, 4), shade(C.wood2, -0.15));
  s.p(st, mix(C.rock2, C.indigo, 0.25));
  return s.out();
}
export function fireFlames(c, h = 60) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-20, -h * 0.5], [-10, -h * 0.3], [-4, -h], [6, -h * 0.55], [14, -h * 0.75], [22, -h * 0.25], [26, 0]], 0.6, 5), C.sunDeep);
  s.p(c.cut([[-16, 0], [-10, -h * 0.4], [-2, -h * 0.72], [8, -h * 0.4], [16, 0]], 0.5, 5), C.sun);
  s.p(c.cut([[-8, 0], [-2, -h * 0.4], [6, 0]], 0.3, 4), C.lampFlame);
  return `<circle cx="0" cy="${-h * 0.4}" r="${h * 3}" fill="url(#warm-glow)" opacity=".85"/>${s.out()}`;
}
/** a round cameo plate with a picture (origin centre) */
export function cameo(c, inner, { r = 44, rim = C.haloRim, face = C.parchment } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 5, 30), 0.4, 4), rim).p(c.cut(c.circ(0, 0, r, 30), 0.4, 4), face).out() + inner;
}
/** heart points (for a paper heart of radius r) */
export function heartPts(r) {
  const pts = [];
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * PI * 2;
    pts.push([16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16]);
  }
  return pts;
}
/** Mary's keepsake: a rose paper heart with a gold rim (origin centre) */
export function keepHeart(c, r = 30) {
  return sheet().p(c.cut(heartPts(r + 5), 0.3, 4), C.haloRim).p(c.cut(heartPts(r), 0.3, 4), mix(C.jesusMantle, C.roseRobe, 0.4))
    .x(c.poly(c.ell(-r * 0.4, -r * 0.35, r * 0.22, r * 0.14, 8, -0.6)), shade(C.roseRobe, 0.45)).out();
}
/** a thin sword of pale light (origin: the tip; the blade rises to -len) */
export function lightSword(c, len = 240) {
  const s = sheet();
  s.p(c.cut([[0, 0], [7, -18], [7, -len + 40], [-7, -len + 40], [-7, -18]], 0.3, 6), mix(C.star, C.skyVeil, 0.35));
  s.x(c.ribbon([[0, -14], [0, -len + 44]], 2.2), '#ffffff', 'opacity=".7"');
  s.p(c.cut(c.rect(-34, -len + 30, 68, 11), 0.3, 4), C.haloRim);
  s.p(c.cut(c.rect(-5, -len - 12, 10, 44), 0.3, 4), mix(C.haloRim, C.wood3, 0.4));
  s.p(c.cut(c.circ(0, -len - 16, 8, 10), 0.2, 3), C.halo);
  return s.out();
}
/** the long glow that goes with the sword (flat; put it in a layer behind) */
export const swordGlow = (len = 240) => `<ellipse cx="0" cy="${-len * 0.5}" rx="${len * 0.3}" ry="${len * 0.75}" fill="url(#halo-glow)" opacity=".8"/>`;
/** a paper banner (a ribbon with forked ends) with words on it; origin centre */
export function banner(c, text, { size = 28, w, fill = C.cream, ink = C.terracotta, rim = C.haloRim } = {}) {
  const ww = w || text.length * size * 0.48 + size * 2;
  const hh = size * 1.55;
  const s = sheet();
  const tail = (d) => c.cut([[d * (ww / 2 - 10), -hh * 0.3], [d * (ww / 2 + hh * 0.9), -hh * 0.2], [d * (ww / 2 + hh * 0.55), hh * 0.25], [d * (ww / 2 + hh * 0.95), hh * 0.7], [d * (ww / 2 - 10), hh * 0.62]], 0.5, 6);
  s.p(tail(-1) + tail(1), shade(fill, -0.12));
  const top = c.qbez([-ww / 2, -hh / 2], [0, -hh / 2 - 16], [ww / 2, -hh / 2], 14);
  const bot = c.qbez([ww / 2, hh / 2], [0, hh / 2 - 16], [-ww / 2, hh / 2], 14);
  s.p(c.cut([...top, ...bot], 0.5, 8), fill);
  s.x(c.ribbon(c.qbez([-ww / 2 + 10, -hh / 2 + 6], [0, -hh / 2 - 10], [ww / 2 - 10, -hh / 2 + 6], 14), 1.6) + c.ribbon(c.qbez([-ww / 2 + 10, hh / 2 - 6], [0, hh / 2 - 22], [ww / 2 - 10, hh / 2 - 6], 14), 1.6), rim, 'opacity=".8"');
  return `${s.out()}<text x="0" y="${(size * 0.3 - 8).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}

/* ================================================================== the heavenly host */
const A_ROBES = [C.linen, '#fbf3e0', mix(C.linen, C.skyVeil, 0.4), mix(C.linen, C.blushVeil, 0.35), mix(C.linen, C.halo, 0.3)];
const A_HAIR = [C.wheat2, C.hair2, C.ochre, C.hair, C.wheat];
const A_SKIN = [C.skin, C.skin2, C.skin3, C.skin, C.skin4];
/** a small angel of the host, facing us with spread wings; kind: 0 hands raised, 1 trumpet, 2 harp, 3 hands together.
 *  origin: the hem (it floats); ~130 tall */
export function choirAngel(c, i = 0, kind = i % 4) {
  const robe = A_ROBES[i % 5], hair = A_HAIR[(i * 3) % 5], skin = A_SKIN[(i * 2) % 5];
  const s = sheet();
  const wing = (d) => c.cut([[d * 6, -74], [d * 22, -98], [d * 46, -122], [d * 70, -128], [d * 62, -108], [d * 78, -100], [d * 58, -88], [d * 70, -76], [d * 42, -68], [d * 16, -60]], 0.5, 4);
  s.p(wing(-1) + wing(1), '#fbf7ee');
  let fe = '';
  [-1, 1].forEach((d) => { for (let k = 0; k < 3; k++) fe += c.ribbon([[d * (18 + k * 12), -76 - k * 6], [d * (44 + k * 9), -100 - k * 7]], 1.2); });
  s.x(fe, '#e3dccd');
  // halo ring behind the head
  s.p(c.cut(c.circ(0, -96, 16, 16), 0.2, 3), C.haloRim);
  s.p(c.cut(c.circ(0, -96, 13.5, 16), 0.2, 3), C.halo);
  // robe (a bell, the hem fluttering)
  s.p(c.cut([[-9, -84], [9, -84], [17, -62], [24, -24], [30, -2], [18, -6], [8, 2], [-6, -4], [-18, 0], [-30, -4], [-24, -24], [-17, -62]], 0.5, 5), robe);
  s.x(c.ribbon([[-6, -70], [-12, -8]], 1.4) + c.ribbon([[6, -70], [10, -8]], 1.4), shade(robe, -0.1), 'opacity=".7"');
  // arms
  const sleeve = (pts) => c.cut(pts, 0.3, 4);
  let arms = '', hands = '';
  if (kind === 0) {
    arms = sleeve([[-12, -80], [-6, -72], [-26, -104], [-34, -112], [-38, -106]]) + sleeve([[12, -80], [6, -72], [26, -104], [34, -112], [38, -106]]);
    hands = c.cut(c.circ(-36, -114, 4.6, 8), 0.2, 2) + c.cut(c.circ(36, -114, 4.6, 8), 0.2, 2);
  } else if (kind === 3) {
    arms = sleeve([[-13, -80], [-6, -74], [-2, -66], [-4, -58], [-12, -62]]) + sleeve([[13, -80], [6, -74], [2, -66], [4, -58], [12, -62]]);
    hands = c.cut(c.ell(0, -64, 4, 6.5, 8), 0.2, 2);
  } else {
    arms = sleeve([[-13, -80], [-6, -74], [-10, -58], [-18, -56]]) + sleeve([[13, -80], [6, -74], [18, -62], [26, -66]]);
    hands = c.cut(c.circ(-14, -56, 4.4, 8), 0.2, 2) + c.cut(c.circ(26, -66, 4.4, 8), 0.2, 2);
  }
  s.p(arms, shade(robe, -0.06));
  if (kind === 1) {
    // a long gold trumpet held up to the lips, pointing up-right
    s.p(c.cut([[4, -92], [50, -134], [54, -130], [8, -88]], 0.2, 3), C.sun);
    s.p(c.cut([[48, -140], [66, -148], [58, -124]], 0.2, 3), shade(C.sun, -0.08));
  }
  if (kind === 2) {
    // a small lyre held against the side
    s.p(c.ribbon(c.qbez([14, -52], [34, -60], [30, -96], 8), 3) + c.ribbon(c.qbez([14, -52], [2, -70], [12, -96], 8), 3), C.sun);
    s.p(c.ribbon([[10, -94], [32, -98]], 3), shade(C.sun, -0.1));
    s.x(c.ribbon([[18, -58], [18, -94]], 0.8) + c.ribbon([[22, -58], [23, -95]], 0.8) + c.ribbon([[26, -60], [27, -96]], 0.8), C.cream);
  }
  s.p(hands, skin);
  // head
  s.p(c.cut(c.circ(0, -96, 10.5, 14), 0.2, 3), skin);
  s.p(c.cut([...c.arc(0, -97, 11.5, 11.5, PI * 0.95, PI * 2.05, 10), [10, -94], [4, -103], [-4, -103], [-10, -94]], 0.3, 3), hair);
  s.x(c.ribbon(c.arc(-4, -95, 2, 1.4, 0.2, PI - 0.2, 4), 0.9) + c.ribbon(c.arc(4, -95, 2, 1.4, 0.2, PI - 0.2, 4), 0.9), C.inkSoft);
  s.x(c.poly(c.circ(0, -89.5, 2, 8)), shade(C.blush, -0.1), 'opacity=".7"');
  return s.out();
}
/** a row of the host as one still cut-out (for a sprite): n angels from x0 to x1 around y 0 */
export function hostRow(c, n, x0, x1, { s = 1, dy = 14, seed = 0 } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + 0.5) / n) + c.rr(-18, 18), y = (i % 2 ? dy : -dy) + c.rr(-8, 8), k = s * c.rr(0.88, 1.08);
    out.push(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${c.rr(-6, 6).toFixed(1)}) scale(${k.toFixed(3)})">${choirAngel(c, i + seed)}</g>`);
  }
  return `<g>${out.join('')}</g>`;
}

/* ================================================================== sets */
/**
 * The shepherds' field at night below Bethlehem: stars, a far ridge with the little town (a few lit windows),
 * the pasture with a low sheepfold wall, rocks and the campfire. Returns handles; FY = the pasture line.
 * gloryL: a flat light layer behind the people (use it for the glory of the Lord); goldSky: a second sky to fade in.
 */
export const FY = 708;
export function fieldSet(S, { goldSky = true, heaven = false, fire = true, host = false } = {}) {
  const c = S.c;
  const sk = sky(S, NIGHT, { rise: 0 });
  const gsk = goldSky ? sky(S, GLORY, { rise: 0, name: 'gsky' }) : null;
  if (gsk) gsk.layer.fade(0);
  const hsk = heaven ? sky(S, HEAVEN, { rise: 0, name: 'hsky' }) : null;
  if (hsk) hsk.layer.fade(0);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 470, n: 190 }));
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const moonEl = hanging(hangL, moon(c, 32), { x: 0, y: -1500, len: 800 });
  const skyGlow = host ? S.layer({ par: 0.03, sh: 0, flat: true, rise: 0 }) : null;
  const hostL = host ? S.layer({ par: 0.05, sh: 4, rise: 0 }) : null;
  // the ridge of Bethlehem
  const far = S.layer({ par: 0.08, sh: 2 });
  const ffn = c.wave(470, [22, 9, 3], [1000, 360, 130]);
  far.add(sheet().p(c.ridge(ffn, -1400, 3000, 1900, 12, 1), dimN(C.hillFar, 0.55)).out());
  far.add(`<g transform="translate(1130 ${ffn(1130) + 8})">${hillTown(c, { w: 300, h: 64, col: dimN(mix(C.sand2, C.hillMid, 0.3), 0.55), wall: dimN(C.plaster, 0.45), wall2: dimN(C.plaster2, 0.5), roof: dimN(C.roof, 0.45), n: 10, lit: 0.45 })}</g>`);
  far.add(cypress(c, 900, ffn(900) + 6, 70, dimN(C.moss2, 0.5)) + cypress(c, 1360, ffn(1360) + 6, 80, dimN(C.moss2, 0.5)));
  const mid = S.layer({ par: 0.16, sh: 3 });
  const mfn = c.wave(585, [14, 6], [800, 260]);
  mid.add(sheet().p(c.ridge(mfn, -1400, 3000, 1900, 12, 1), dimN(mix(C.hillMid, C.sand2, 0.3), 0.48)).out());
  mid.add(olive(c, 250, mfn(250) + 14, 0.7, { leaf: dimN(C.olive, 0.45), leaf2: dimN(C.sage, 0.45), trunk: dimN(C.wood2, 0.35) }) + olive(c, 1480, mfn(1480) + 14, 0.8, { leaf: dimN(C.olive, 0.45), leaf2: dimN(C.sage, 0.45), trunk: dimN(C.wood2, 0.35) }));
  const crowdL = S.layer({ par: 0.16, sh: 3 });      // (people rising on the far ridge)
  // the pasture
  const G = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(FY - 50, [6, 3], [700, 200]);
  G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1900, 12, 1), dimN(C.hillNear, 0.42)).out());
  // the low stone sheepfold on the left
  const fold = sheet();
  let stonesD = '';
  for (let x = -420; x < 470; x += 26) for (let r = 0; r < 3; r++) stonesD += c.cut(c.blob(x + (r % 2) * 13, FY - 64 - r * 15, 15, 9, 8, 0.2), 0.4, 3);
  fold.p(c.cut([[-440, FY - 50], [-440, FY - 100], [486, FY - 100], [486, FY - 50]], 0.8, 10), dimN(C.rock2, 0.4));
  fold.x(stonesD, dimN(C.rock, 0.42), 'opacity=".8"');
  G.add(fold.out());
  G.add(rock(c, 1260, FY - 30, 170, 60, dimN(C.rock2, 0.42)) + grass(c, { x0: -1200, x1: 2800, y: FY - 30, fn: (x) => gfn(x) + 20, n: 60, h: 13, color: dimN(C.moss, 0.4) }));
  // the light of the glory (behind the people)
  const gloryL = S.layer({ par: 0.3, sh: 0, flat: true });
  let fireEl = null, flames = null;
  const P = S.layer({ par: 0.34, sh: 5 });
  if (fire) {
    P.add(`<g transform="translate(740 ${FY + 6})">${fireStones(c, 90)}</g>`);
    flames = P.add(`<g>${fireFlames(c, 58)}</g>`);
  }
  return { sk, gsk, hsk, starL, hangL, moonEl, skyGlow, hostL, far, mid, crowdL, mfn, G, gloryL, P, flames, gfn, ffn, townX: 1130, townY: ffn(1130) - 40 };
}
/** make the campfire flicker (whole cut-out, compositor) */
export function flicker(el, time, x = 740, y = FY, k = 1) {
  if (!el) return;
  const f = time ? 1 + Math.sin(time * 8.3) * 0.06 + Math.sin(time * 13.1) * 0.04 : 1;
  pose(el, { x, y, sx: k / f, sy: k * f, o: k > 0.01 ? 1 : 0 });
}
/** dim a colour into the night */
export const dimN = (col, k = 0.42) => mix(col, C.indigo, k);

/**
 * Bethlehem at night: the cave-stable in the rock (its hollow warm with the lantern), the ox and the donkey, the
 * manger in the straw; the inn on the right, two storeys, every window lit and full. FLOOR = the straw line.
 * Returns handles: { sk, dsk (a dusk sky, fade it out), hangL, lantern, glowL (behind people), P, innDoor, innLit, ... }
 */
export const ST = { FLOOR: 704, MX: 800, CAVE0: 500, CAVE1: 1060, INN0: 1082, INN1: 1480, DOOR: 1150 };
export function stableSet(S, { dusk = false, animals = true } = {}) {
  const c = S.c;
  const sk = sky(S, NIGHT, { rise: 0 });
  const dsk = dusk ? sky(S, Array.isArray(dusk) ? dusk : DUSK, { rise: 0, name: 'dsky' }) : null;
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 420, n: 170 }));
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const far = S.layer({ par: 0.08, sh: 2 });
  const ffn = c.wave(430, [18, 7, 3], [900, 330, 120]);
  far.add(sheet().p(c.ridge(ffn, -1400, 3000, 1900, 12, 1), dimN(C.hillFar, 0.55)).out());
  far.add(town(c, { x: 300, y: ffn(300) + 20, n: 9, spread: 500, sc: 0.55, wall: dimN(C.plaster, 0.45), shadow: dimN(C.plaster2, 0.5), lit: true }));
  // the rock with the cave hollow
  const R = S.layer({ par: 0.26, sh: 4 });
  const F = ST.FLOOR;
  const rs = sheet();
  const rtop = (x) => 250 + Math.sin(x * 0.006) * 30 + Math.max(0, (x - 900) * 0.25) + Math.max(0, (400 - x) * 0.18);
  const rp = [];
  for (let x = -1400; x <= 1120; x += 40) rp.push([x, rtop(x)]);
  rp.push([1120, F + 20], [-1400, F + 20]);
  rs.p(c.cut(rp, 2.2, 14), dimN(mix(C.rock, C.sand2, 0.35), 0.4));
  let cracks = '';
  for (let i = 0; i < 22; i++) { const x = c.rr(-1300, 1100), y = c.rr(rtop(x) + 30, F - 40); if (x > ST.CAVE0 - 30 && x < ST.CAVE1 + 20) continue; cracks += c.ribbon([[x, y], [x + c.rr(-30, 30), y + c.rr(10, 40)]], 1.6); }
  rs.x(cracks, dimN(C.rock3, 0.4), 'opacity=".6"');
  let tufts = '';
  for (let i = 0; i < 16; i++) { const x = c.rr(-1300, 1100); tufts += c.cut(c.blob(x, rtop(x) + 6, c.rr(16, 34), c.rr(8, 14), 8, 0.2), 0.6, 4); }
  rs.p(tufts, dimN(C.olive, 0.45));
  // the hollow of the cave
  const hollow = [[ST.CAVE0, F + 4], [ST.CAVE0 + 6, 520], ...c.qbez([ST.CAVE0 + 10, 470], [(ST.CAVE0 + ST.CAVE1) / 2, 250], [ST.CAVE1 - 10, 470], 16), [ST.CAVE1 - 4, 540], [ST.CAVE1, F + 4]];
  rs.p(c.cut(hollow, 1.2, 8), mix(C.soilDark, C.night, 0.35));
  R.add(rs.out());
  // the warm inside (fades in when the lantern is lit)
  const warm = R.add(`<g><path d="${c.cut(hollow.map(([x, y]) => [x + (x - 780) * -0.03, y + (y < F ? 8 : 0)]), 1, 8)}" fill="${mix(C.clay, C.wood2, 0.45)}"/><circle cx="800" cy="520" r="330" fill="url(#warm-glow)" opacity=".75"/></g>`);
  // beam, straw, the stall rail
  const inner = sheet();
  inner.p(c.cut([[ST.CAVE0 + 20, 408], [ST.CAVE1 - 20, 402], [ST.CAVE1 - 22, 418], [ST.CAVE0 + 20, 424]], 0.5, 8), C.wood2);
  inner.p(c.cut([[ST.CAVE0 + 40, 424], [ST.CAVE0 + 52, 424], [ST.CAVE0 + 50, F], [ST.CAVE0 + 42, F]], 0.3, 6) + c.cut([[ST.CAVE1 - 52, 418], [ST.CAVE1 - 40, 418], [ST.CAVE1 - 42, F], [ST.CAVE1 - 50, F]], 0.3, 6), shade(C.wood2, -0.1));
  let straw = '';
  for (let i = 0; i < 70; i++) { const x = c.rr(ST.CAVE0 - 20, ST.CAVE1 + 20); straw += c.ribbon([[x, F + 4], [x + c.rr(-16, 16), F - c.rr(4, 18)]], 2); }
  inner.p(c.cut([[ST.CAVE0 - 30, F + 16], [ST.CAVE0 - 10, F - 8], [ST.CAVE1 + 10, F - 10], [ST.CAVE1 + 30, F + 16]], 0.8, 8), C.wheat2);
  inner.p(straw, C.wheat);
  R.add(inner.out());
  // the inn
  const I = S.layer({ par: 0.26, sh: 4 });
  const iw = sheet();
  const X0 = ST.INN0, X1 = ST.INN1, top = 250;
  iw.p(c.cut([[X0, F + 10], [X0, top], [X1, top], [X1, F + 10]], 0.6, 10), dimN(mix(C.plaster, C.dawn, 0.3), 0.3));
  iw.p(c.cut([[X0 - 14, top - 16], [X1 + 14, top - 16], [X1 + 14, top + 4], [X0 - 14, top + 4]], 0.4, 8), dimN(C.roof, 0.3));
  iw.p(c.cut([[X0 - 8, 470], [X1 + 8, 470], [X1 + 8, 484], [X0 - 8, 484]], 0.4, 8), dimN(C.wood2, 0.3));
  let bricks = '';
  for (let i = 0; i < 30; i++) bricks += c.cut(c.blob(c.rr(X0 + 14, X1 - 14), c.rr(top + 20, F - 10), c.rr(12, 24), c.rr(6, 10), 8, 0.2), 0.5, 5);
  iw.x(bricks, dimN(C.plaster2, 0.36), 'opacity=".5"');
  // the door
  const DX = ST.DOOR, dw = 70, dh = 150;
  const doorPts = [[DX - dw / 2, F + 6], [DX - dw / 2, F - dh + dw / 2], ...c.arc(DX, F - dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 8), [DX + dw / 2, F + 6]];
  iw.p(c.cut(doorPts, 0.3, 5), mix(C.clay, C.apricot, 0.5));
  I.add(iw.out());
  // windows: lit, a guest's head in each (the inn is full)
  const wins = [[X0 + 60, 320], [X0 + 170, 320], [X0 + 290, 320], [X0 + 170, 540], [X0 + 290, 540]];
  const winM = sheet();
  let heads = '';
  wins.forEach(([x, y], i) => {
    winM.p(c.cut(c.rect(x - 30, y - 30, 60, 56), 0.3, 5), mix(C.lampFlame, C.apricot, 0.35));
    const hx = x - 10 + (i % 2) * 18;
    heads += c.cut(c.circ(hx, y + 4, 11, 12), 0.3, 3) + c.cut([[hx - 20, y + 26], [hx - 16, y + 12], [hx + 16, y + 12], [hx + 20, y + 26]], 0.3, 3);
    if (i % 2 === 0) heads += c.cut(c.circ(hx + 26, y + 8, 10, 12), 0.3, 3) + c.cut([[hx + 8, y + 26], [hx + 12, y + 16], [hx + 38, y + 16], [hx + 42, y + 26]], 0.3, 3);
  });
  winM.x(heads, mix(C.soilDark, C.night, 0.3), 'opacity=".75"');
  winM.p(wins.map(([x, y]) => c.cut(c.rect(x - 34, y + 24, 68, 7), 0.2, 4)).join(''), dimN(C.wood2, 0.3));
  const innLit = I.add(`<g>${wins.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="70" fill="url(#warm-glow)" opacity=".7"/>`).join('')}${winM.out()}</g>`);
  const leaf = I.add(`<g>${sheet().p(c.cut(doorPts.map(([x, y]) => [x - (DX - dw / 2), y]), 0.3, 5), dimN(C.wood2, 0.2)).x(c.ribbon([[dw * 0.3, -6], [dw * 0.3, -dh + 26]], 2) + c.ribbon([[dw * 0.66, -6], [dw * 0.66, -dh + 22]], 2), shade(C.wood2, -0.3), 'opacity=".6"').out()}</g>`);
  const sign = I.add(`<g>${strip2(c, tr('gospoda', 'the inn'), 17)}</g>`);
  // animals, manger (in front of the hollow)
  const glowL = S.layer({ par: 0.3, sh: 0, flat: true });
  const A = S.layer({ par: 0.3, sh: 4 });
  const P = S.layer({ par: 0.34, sh: 5 });
  return { sk, dsk, starL, hangL, far, R, I, A, glowL, P, warm, innLit, leaf, sign, DX, dw, F };
}
/** a hanging wooden sign with a word (origin: centre) */
export function strip2(c, text, size = 18) {
  const ww = Math.max(80, text.length * size * 0.5 + size * 1.6), hh = size * 1.6;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1], [ww / 2 + 1, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), mix(C.wood3, C.parchment, 0.35));
  return `<path d="M${-ww * 0.3} ${-hh / 2}L0 ${-hh / 2 - 22}L${ww * 0.3} ${-hh / 2}" stroke="${C.wood2}" stroke-width="2" fill="none"/>${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}

/**
 * The Temple court (after Mark 11's templeCourt): sky (and an optional second sky to fade in), the sun, the Mount of
 * Olives, the sanctuary over its inner wall, porticoes, the paving and the balustrade. People stand at FLOOR.
 */
export const TFLOOR = 690;
import { portico as portico11, sanctuary as sanct11 } from '../mark11/lib.js';
export function templeSet(S, { skyCols = TEMPLE_DAY, sky2 = null, sunAt = [1220, 160], sanctX = 800, lamps = false } = {}) {
  const c = S.c;
  const floorY = TFLOOR + 40;
  const sk = sky(S, skyCols);
  const sk2 = sky2 ? sky(S, sky2, { name: 'sky2' }) : null;
  if (sk2) sk2.layer.fade(0);
  const starL = sky2 ? S.layer({ par: 0.02, sh: 1, flat: true }) : null;
  if (starL) { starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 420, n: 150 })); starL.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const moonEl = sky2 ? hanging(hangL, moon(c, 32), { x: sunAt[0], y: -1400, len: 700 }) : null;
  const cl1 = hanging(hangL, cloud(c, 190), { x: 470, y: 140, len: 700 });
  S.layer({ par: 0.08, sh: 2 }).add(hillsWith(c, { y: 420, amps: [20, 8, 3], lens: [1200, 400, 140], color: mix(C.hillMid, C.hillFar, 0.5), trees: 34, treeColor: mix(C.olive, C.hillMid, 0.3), treeH: 16, x0: -1400, x1: 3000 }).markup);
  const holyL = S.layer({ par: 0.16, sh: 1, flat: true });
  const sanctL = S.layer({ par: 0.16, sh: 4 });
  const IW = floorY - 150;
  const inner = sheet();
  inner.p(c.cut([[sanctX - 520, IW + 80], [sanctX - 500, IW], [sanctX + 500, IW], [sanctX + 520, IW + 80]], 0.6, 12), mix(C.cream, C.stone, 0.3));
  let iw = '';
  for (let x = sanctX - 480; x < sanctX + 480; x += 30) iw += c.cut(c.rect(x, IW + 6, 10, 40), 0.2, 5);
  inner.x(iw, shade(C.stone, -0.08), 'opacity=".7"');
  inner.p(c.cut(c.rect(sanctX - 520, IW - 10, 1040, 12), 0.3, 12), C.sun);
  const sanct = sanctL.add(`<g transform="translate(${sanctX} ${IW})">${sanct11(c, 1.3)}</g>`);
  sanctL.add(inner.out());
  const back = S.layer({ par: 0.3, sh: 4 });
  const PY = floorY - 70;
  back.add(portico11(c, -1300, sanctX - 330, PY, 240) + portico11(c, sanctX + 330, 2900, PY, 240));
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-1800, PY - 6], [3400, PY - 6], [3400, 1800], [-1800, 1800]], 0.8, 30), mix(C.stone, C.sand, 0.35));
  let tiles = '';
  for (let i = 0; i < 9; i++) { const y = PY + 8 + i * i * 7 + i * 10; tiles += c.ribbon([[-1800, y], [3400, y + c.rr(-2, 2)]], 1.3); }
  for (let x = -1800; x < 3400; x += 90) tiles += c.ribbon([[x, PY], [800 + (x - 800) * 2.2, 1800]], 1.2);
  f.x(tiles, shade(C.stone, -0.16), 'opacity=".45"');
  floorL.add(f.out());
  const sor = sheet();
  sor.p(c.cut(c.rect(-1800, PY - 30, 5200, 8), 0.4, 20), mix(C.cream, C.stone, 0.2));
  let posts = '';
  for (let x = -1800; x < 3400; x += 22) posts += c.poly(c.rect(x, PY - 24, 5, 24));
  sor.p(posts, mix(C.cream, C.stone, 0.35));
  floorL.add(sor.out());
  return { sk, sk2, starL, hangL, sunEl, moonEl, cl1, holyL, sanct, sanctX, IW, floorY, PY, back, floorL, FLOOR: TFLOOR };
}

/**
 * Rome: a hall of columns open onto the city, red swags, the dais with the curule seat in the middle,
 * the eagle and the red banner either side. Returns { sk, SEAT, charL, fxL, fgL, props }.
 */
export function romeSet(S, { skyCols = ROME } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  hanging(hangL, sun(c, 40, { disc: C.peach, inner: C.dawn, rays: C.apricot }), { x: 470, y: 160, len: 800 });
  hanging(hangL, cloud(c, 170, C.cream, '#eadcc0'), { x: 1130, y: 130, len: 800 });
  const far = S.layer({ par: 0.12, sh: 2 });
  const hcol = mix(C.hillFar, C.dawn, 0.3);
  far.add(band(c, { y: 470, amps: [18, 8, 3], lens: [900, 300, 110], color: hcol }).markup);
  far.add(town(c, { x: 560, y: 484, n: 8, spread: 300, sc: 0.62, wall: mix(C.plaster, C.dawn, 0.3), shadow: mix(C.plaster2, hcol, 0.4) }) + town(c, { x: 1060, y: 486, n: 8, spread: 300, sc: 0.62, wall: mix(C.plaster, C.dawn, 0.3), shadow: mix(C.plaster2, hcol, 0.4) }));
  far.add(cypress(c, 420, 480, 90) + cypress(c, 1230, 480, 110) + cypress(c, 760, 486, 70));
  const wall = S.layer({ par: 0.3, sh: 4 });
  const W = sheet();
  W.p(c.cut([[-900, -1400], [2500, -1400], [2500, 176], [-900, 176]], 0.6, 20), mix(C.stone, C.plaster2, 0.3));
  W.p(c.cut([[-900, 150], [2500, 150], [2500, 182], [-900, 182]], 0.5, 12), shade(C.stone2, -0.05));
  let dent = '';
  for (let x = -880; x < 2500; x += 34) dent += c.poly(c.rect(x, 128, 18, 14));
  W.x(dent, C.stone2);
  W.p(c.cut([[-900, 500], [2500, 500], [2500, 566], [-900, 566]], 0.5, 12), mix(C.stone, C.sand, 0.25));
  let rail = '';
  for (let x = -880; x < 2500; x += 28) rail += c.cut(c.rect(x, 508, 12, 52), 0.3, 5);
  W.x(rail, shade(C.stone, -0.08), 'opacity=".6"');
  wall.add(W.out());
  const cols = [-60, 150, 360, 580, 1020, 1240, 1450, 1660];
  wall.add(cols.map((x) => column(c, x, 566, 390, 46, C.stone)).join(''));
  let sw = '';
  for (let i = 0; i < cols.length - 1; i++) sw += swag(c, cols[i], cols[i + 1], 186, i === 3 ? 30 : 44, i === 3 ? C.curtain2 : C.curtain);
  wall.add(sw);
  const floorL = S.layer({ par: 0.36, sh: 2 });
  const Fs = sheet();
  Fs.p(c.cut([[-900, 566], [2500, 566], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.stone, C.sand, 0.35));
  let lines = '';
  [606, 660, 730, 820].forEach((y) => { lines += c.ribbon([[-900, y], [2500, y]], 1.3); });
  for (let i = -12; i <= 12; i++) lines += c.ribbon([[800 + i * 70, 566], [800 + i * 150, 900]], 1.2);
  Fs.x(lines, shade(C.stone2, -0.1), 'opacity=".45"');
  floorL.add(Fs.out());
  const props = S.layer({ par: 0.45, sh: 5 });
  const SEAT = [800, 604];
  props.add(`<g transform="translate(560 660)">${vexillum(c, 340)}</g>`);
  props.add(`<g transform="translate(1040 660)">${eagleStandard(c, 370)}</g>`);
  props.add(`<g transform="translate(800 664)">${dais(c, 360, 60)}</g>`);
  props.add(`<g transform="translate(${SEAT[0]} ${SEAT[1]})">${curuleSeat(c)}</g>`);
  const lamps = [[400, 660], [1200, 660]].map(([x, y]) => props.add(`<g transform="translate(${x} ${y})">${standLamp(c, 180)}</g>`));
  const charL = S.layer({ par: 0.5, sh: 5 });
  const fxL = S.layer({ par: 0.55, sh: 5 });
  return { sk, SEAT, charL, fxL, props, lamps, floorL };
}

/**
 * A road through the hills: sky, far hills, a mid ridge, the road at RY (y) running across. Returns handles.
 * Put towns and signs on the returned layers.
 */
export const RY = 716;
export function roadSet(S, { skyCols = DAY, sky2 = null, sunAt = [1220, 150], sunR = 42, clouds = true, tintK = 0, tintCol = C.duskViolet, sunCol = null } = {}) {
  const c = S.c;
  const T = (col) => (tintK ? mix(col, tintCol, tintK) : col);
  const sk = sky(S, skyCols);
  const skies = (sky2 || []).map((cols, i) => { const k = sky(S, cols, { name: 'rsky' + i }); k.layer.fade(0); return k; });
  const starL = sky2 ? S.layer({ par: 0.02, sh: 1, flat: true }) : null;
  if (starL) { starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 420, n: 150 })); starL.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sunCol ? sun(c, sunR, sunCol) : sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 900 });
  const moonEl = sky2 ? hanging(hangL, moon(c, 30), { x: 0, y: -1500, len: 900 }) : null;
  const cls = clouds ? [[470, 140, 180], [1000, 105, 130]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w, T(C.cream), T('#eadcc0')), { x, y, len: 800 }), x, y, i })) : [];
  const far = S.layer({ par: 0.07, sh: 2 });
  const ffn = c.wave(450, [24, 9, 3], [1000, 340, 120]);
  far.add(sheet().p(c.ridge(ffn, -1600, 3200, 1900, 12, 1), T(mix(C.hillFar, C.hillMid, 0.3))).out());
  const mid = S.layer({ par: 0.16, sh: 3 });
  const mfn = c.wave(560, [14, 6], [800, 240]);
  mid.add(sheet().p(c.ridge(mfn, -1600, 3200, 1900, 12, 1), T(C.hillMid)).out());
  const midWalk = S.layer({ par: 0.16, sh: 4 });
  const G = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(RY - 44, [5, 2], [600, 170]);
  G.add(sheet().p(c.ridge(gfn, -1600, 3200, 1900, 12, 1), T(mix(C.sage2, C.hillNear, 0.5))).p(c.ribbon([[-1600, RY + 6], [800, RY + 2], [3200, RY + 6]], 40, 2), T(mix(C.sand, C.cream, 0.35))).out());
  G.add(grass(c, { x0: -1500, x1: 3100, y: RY, fn: (x) => gfn(x) + 22, n: 60, h: 12, color: T(C.moss) }));
  return {
    sk, skies, starL, moonEl, hangL, sunEl, cls, far, mid, midWalk, G, ffn, mfn, gfn, T,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], sunO = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o: sunO });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.i) * 20, y: cl.y, r: Math.sin(time * 0.6 + cl.i) * 1.2 }));
    },
  };
}

/**
 * Nazareth: morning hills, the little town on the slope, their house with the vine over the door (a doorpost with
 * height marks), Joseph's workbench in the yard. Returns handles; NY = the yard line.
 */
export const NY = 712;
export const NAZ = { HX: 330, HW: 300, DOORX: 420, BENCH: 1180 };
export function nazSet(S, { skyCols = DAY, marks = 0 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 42), { x: 1240, y: 150, len: 800 });
  const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 130, len: 800 });
  const far = S.layer({ par: 0.07, sh: 2 });
  far.add(band(c, { y: 440, amps: [24, 9, 3], lens: [900, 330, 120], color: mix(C.hillFar, C.hillMid, 0.4), x0: -1400, x1: 3000 }).markup);
  const mid = S.layer({ par: 0.18, sh: 3 });
  const mfn = (x) => 540 - Math.max(0, 1 - Math.abs(x - 950) / 520) ** 1.3 * 110 + Math.sin(x * 0.012) * 6;
  mid.add(sheet().p(c.ridge(mfn, -1400, 3000, 1900, 12, 1), C.hillMid).out());
  mid.add(`<g transform="translate(960 ${mfn(960) + 12})">${hillTown(c, { w: 320, h: 64, col: C.hillMid, n: 11 })}</g>`);
  mid.add(olive(c, 600, mfn(600) + 10, 0.6) + cypress(c, 1380, mfn(1380) + 8, 110) + olive(c, 1520, mfn(1520) + 10, 0.55));
  const G = S.layer({ par: 0.45, sh: 3 });
  const gfn = c.wave(NY - 40, [5, 2], [600, 170]);
  G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1900, 12, 1), mix(C.sage2, C.hillNear, 0.5)).p(c.ribbon([[-1400, NY + 6], [700, NY + 4], [3000, NY + 4]], 34, 2), mix(C.sand, C.cream, 0.35)).out());
  // the house: wall, door, the vine
  const H = sheet();
  const x0 = NAZ.HX - NAZ.HW / 2, x1 = NAZ.HX + NAZ.HW / 2, top = NY - 250;
  H.p(c.cut([[x0, NY + 4], [x0, top], [x1, top], [x1, NY + 4]], 0.6, 10), mix(C.plaster, C.dawn, 0.2));
  H.p(c.cut([[x1, top + 10], [x1 + 44, top + 22], [x1 + 44, NY + 4], [x1, NY + 4]], 0.4, 8), C.plaster2);
  H.p(c.cut([[x0 - 12, top - 12], [x1 + 50, top - 12], [x1 + 50, top + 4], [x0 - 12, top + 4]], 0.4, 8), C.roof);
  const DX = NAZ.DOORX, dw = 76, dh = 160;
  H.p(c.cut([[DX - dw / 2, NY + 4], [DX - dw / 2, NY - dh + dw / 2], ...c.arc(DX, NY - dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 8), [DX + dw / 2, NY + 4]], 0.3, 5), mix(C.soilDark, C.wood2, 0.4));
  H.p(c.cut(c.rect(x0 + 40, top + 50, 44, 36), 0.3, 5), C.soilDark);
  // the doorpost with the child's height marks
  H.p(c.cut([[DX + dw / 2, NY + 4], [DX + dw / 2 + 14, NY + 4], [DX + dw / 2 + 14, NY - dh - 8], [DX + dw / 2, NY - dh - 8]], 0.3, 5), C.wood3);
  H.p(c.cut([[DX - dw / 2 - 14, NY - dh - 8], [DX + dw / 2 + 14, NY - dh - 8], [DX + dw / 2 + 14, NY - dh - 22], [DX - dw / 2 - 14, NY - dh - 22]], 0.3, 5), C.wood3);
  let bricks = '';
  for (let i = 0; i < 18; i++) { const x = c.rr(x0 + 14, x1 - 14), y = c.rr(top + 20, NY - 10); if (Math.abs(x - DX) < 60) continue; bricks += c.cut(c.blob(x, y, c.rr(12, 22), c.rr(6, 10), 8, 0.2), 0.5, 5); }
  H.x(bricks, C.plaster2, 'opacity=".5"');
  const vine = sheet();
  vine.p(c.ribbon([[x1 + 20, NY], [x1 + 26, NY - 140], [x1 - 20, top + 20], [x0 + 80, top + 10]], 5), C.wood2);
  let lv = '';
  for (let i = 0; i < 18; i++) lv += c.cut(c.blob(c.rr(x0 + 70, x1 + 40), c.rr(top - 4, top + 34), c.rr(12, 20), c.rr(8, 12), 8, 0.2), 0.5, 4);
  vine.p(lv, C.leaf);
  let gr = '';
  for (let i = 0; i < 7; i++) gr += c.cut(c.circ(c.rr(x0 + 100, x1), c.rr(top + 30, top + 44), 5, 8), 0.2, 2);
  vine.p(gr, C.plumRobe);
  G.add(H.out() + vine.out());
  G.add(grass(c, { x0: -1300, x1: 2900, y: NY, fn: (x) => gfn(x) + 22, n: 50, h: 12, color: C.moss }) + flowers(c, { x0: 600, x1: 1500, y: NY, fn: (x) => gfn(x) + 26, n: 14 }));
  const markL = S.layer({ par: 0.45, sh: 1 });
  const lightL = S.layer({ par: 0.45, sh: 0, flat: true });
  const P = S.layer({ par: 0.5, sh: 5 });
  return {
    sk, hangL, sunEl, cl, far, mid, G, markL, lightL, P, gfn, DX, postX: DX + dw / 2 + 7,
    update(time, { sunX = 1240, sunY = 150 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6) });
      pose(cl, { x: 560 + Math.sin(time * 0.1) * 20, y: 130, r: Math.sin(time * 0.6) * 1.2 });
    },
  };
}
/** a notch on the doorpost (a little cut and a tiny date strip); origin: the notch */
export function notch(c, col = C.terracotta) {
  return sheet().p(c.cut([[-12, -2], [12, -3], [12, 2], [-12, 3]], 0.2, 3), col).out();
}

/* ================================================================== crowds */
/** a still group of pilgrims walking right (for a sprite): n people with bundles, a child or two */
export function pilgrims(c, n = 5, { dx = 54, s = 0.78, flip = false, donkey = '' } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const o = crowdPerson(c);
    const child = i === 2 && n > 3;
    const m = child ? kid(c, { ...o, hairStyle: c.pick(['short', 'curly']), beard: 'none', mantle: null }) : person(c, { ...o, holdF: '', holdB: '' });
    const k = child ? s * 0.55 : s * c.rr(0.92, 1.06);
    out.push({ x: i * dx + c.rr(-6, 6), y: c.rr(-5, 5), m, k });
  }
  out.sort((a, b) => a.y - b.y);
  return `<g>${donkey}${out.map((p) => `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${flip ? -p.k : p.k} ${p.k})">${p.m}</g>`).join('')}</g>`;
}

/** Mary riding the donkey (optionally with child): { saddle, rider } for colt({ over, rider }) — after Matthew 2 */
export function donkeyRide(c, { pregnant = false, holding = '' } = {}) {
  let maryRide = person(c, { ...MARY, pose: 'sit', holdF: holding });
  if (pregnant) maryRide = withChild(maryRide, c, MARY.robe, 'sit');
  const leg = sheet();
  leg.p(c.cut([[14, -106], [40, -104], [44, -78], [42, -48], [30, -44], [22, -70]], 0.5, 6), MARY.robe);
  leg.p(c.cut(c.ell(40, -42, 11, 4.6, 12), 0.3, 4), C.sandal);
  const saddle = sheet().p(c.cut([[-50, -104], [-10, -114], [30, -110], [36, -86], [32, -64], [-46, -66], [-52, -84]], 0.7, 6), C.terracotta).x(c.ribbon([[-44, -70], [28, -72]], 3), C.wheat, 'opacity=".7"').out();
  return { saddle, rider: `<g transform="translate(-16 -106) scale(.95)">${maryRide}</g>${leg.out()}` };
}

/* ================================================================== the shepherds */
/** where the four shepherds keep watch round the fire */
export const SH_AT = [{ x: 560, flip: false }, { x: 650, flip: false }, { x: 830, flip: true }, { x: 910, flip: true }];
export const FIREX = 740;
/** the shepherds as puppets: for each a standing, a sitting and a kneeling cut-out (swap by opacity) */
export function shepherdCast(S, L, { lantern = null } = {}) {
  const c = S.c;
  return SHEPHERDS.map((o, i) => {
    const boy = i === 3;
    const holdB = i === 0 || i === 2 ? staffCrook(c) : '';
    const mk = (P, extra = {}) => S.puppet(L.add(boy ? kid(c, { ...o, pose: P, ...extra }, 1.18) : person(c, { ...o, pose: P, ...extra })));
    return { i, o, s: boy ? 0.72 : 0.94, stand: mk('stand', { holdB, holdF: i === 1 && lantern ? lantern : '' }), sit: mk('sit'), kneel: mk('kneel') };
  });
}
/** a shepherd's crook held in the back hand (upright at armB ≈ 30) */
function staffCrook(c) {
  const h = 200;
  const s = sheet().p(c.ribbon([[0, -h * 0.62], [1.5, 0], [0, h * 0.36]], 5.5), C.wood2).p(c.ribbon(c.arc(-9, -h * 0.62, 9, 11, 0, -PI, 8), 5), C.wood2);
  return `<g transform="rotate(30)">${s.out()}</g>`;
}
/** pose one shepherd: w = { stand, sit, kneel } weights (one of them 1), plus puppet options */
export function setShep(sh, w, o) {
  const base = { ...o, s: sh.s * (o.s || 1) };
  sh.stand.set({ ...base, o: (w.stand || 0) * (o.o ?? 1) });
  sh.sit.set({ ...base, armB: o.armBs ?? o.armB, o: (w.sit || 0) * (o.o ?? 1) });
  sh.kneel.set({ ...base, o: (w.kneel || 0) * (o.o ?? 1) });
}
/** a still flock of sheep as one cut-out: n ewes spread from x0 to x1 around y (origin world) */
export function flockGroup(c, n, x0, x1, y, { s = 0.8, lambs = 2, dimK = 0.12 } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, (i + c.rr(0.2, 0.8)) / n), yy = y + c.rr(-14, 14), k = s * c.rr(0.85, 1.1);
    out.push({ y: yy, m: `<g transform="translate(${x.toFixed(1)} ${yy.toFixed(1)}) scale(${(c.chance(0.5) ? -k : k).toFixed(3)} ${k.toFixed(3)})">${ewe(c, { wool: dimN(c.pick([C.linen, mix(C.cream, C.wheat, 0.25), mix(C.linen, C.stone, 0.35), C.cream]), dimK), face: dimN(mix(C.inkSoft, C.stone2, 0.35), dimK), lamb: i < lambs })}</g>` });
  }
  return `<g>${out.sort((a, b) => a.y - b.y).map((o) => o.m).join('')}</g>`;
}

/** a small wicker cage with two doves inside; origin: its base centre */
import { cage as cage11, smallDove as dove11 } from '../mark11/lib.js';
export function doveCage(c, { w = 62, h = 54, turtle = true } = {}) {
  const col = turtle ? mix(C.wheat, C.clay, 0.3) : '#fbf7ee', sh = turtle ? mix(C.clay, C.wood3, 0.4) : '#e6ddcc';
  return `<g transform="translate(-12 -6) scale(.62)">${dove11(c, { col, sh })}</g><g transform="translate(14 -8) scale(-.6 .6)">${dove11(c, { col, sh })}</g>${cage11(c, w, h)}`;
}
/** the Law's choice: a pair of turtledoves or two young pigeons, on a plate; origin centre */
export function offeringPlate(c, w = 300, h = 120) {
  const s = sheet().p(c.cut(c.rect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12), 0.5, 6), C.haloRim).p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 6), C.parchment).out();
  const tc = mix(C.wheat, C.clay, 0.3), ts = mix(C.clay, C.wood3, 0.4);
  const pair = (x, col, sh) => `<g transform="translate(${x - 26} 16) scale(.9)">${dove11(c, { col, sh })}</g><g transform="translate(${x + 26} 16) scale(-.9 .9)">${dove11(c, { col, sh })}</g>`;
  return s + pair(-86, tc, ts) + pair(86, mix(C.stone, C.dustyBlue, 0.3), mix(C.stone2, C.dustyBlue, 0.5)) +
    `<text x="0" y="8" text-anchor="middle" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.terracotta}">${tr('albo', 'or')}</text>` +
    `<text x="-86" y="${h / 2 - 12}" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.ink}">${tr('synogarlice', 'turtledoves')}</text><text x="86" y="${h / 2 - 12}" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.ink}">${tr('gołębie', 'pigeons')}</text>`;
}
import { handLamp as handLamp13 } from '../mark13/lib.js';
/** a clay oil lamp standing on something (flame lit); origin: its base */
export const handLampBig = (c) => `<g transform="scale(1.15)">${handLamp13(c, { glowR: 0 })}</g>`;
