// Luke 1 — the cast of the Luke chapters that first appears here (Zechariah, Elizabeth, the angel Gabriel,
// the child John), and the sets and cut-outs this chapter's scenes share: the Holy Place of the Temple with its
// golden altar of incense, Zechariah's house in the hill country of Judah, Mary's room in Nazareth, and the
// painted flats that come down from the flies for the angel's promises, the Magnificat and the Benedictus.
import { C, sheet, shade, mix, pose, person, crowdPerson, lerp, clamp, sky, hanging } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { band, olive, cypress, rock, bush, grass, flowers, town, stars as starsN } from '../../assets/nature.js';
import { angel } from '../mark8/lib.js';
import { tint } from '../mark13/lib.js';
import { doorHouse, glowDisc } from '../john1/lib.js';
import { addToHead, heart as heartM } from '../mark2/lib.js';

export { MARY, JOSEPH, DAVID, ABRAHAM, nazarethSet, houseLight, GY as NGY, glowStar, childInArms, medal, RIM, EVE, NIGHT, DAWN, DAY, GOLDEN, PARCH, STARRY, lectern, nameStrip, captives } from '../matthew1/lib.js';
export { glowDisc, rayBurst, radiance, hungGold, hungWord, goldWord, baby, doorHouse, eternityRing, drawRing, crossOut, bust } from '../john1/lib.js';
export { angel, glory, soulLight, LOOK as LOOK8 } from '../mark8/lib.js';
export { dove, flapWings, voiceRings, sparkle, scrollParts, JOHN_B, hand, headAt, hang2 } from '../mark1/lib.js';
export { kf, moving, thought, speech, GLYPH, heart, coin, coinStack, loaf, addToHead, turban, scrap, wordSlip, menorah } from '../mark2/lib.js';
export { templeCourt, sanctuary, priest } from '../mark11/lib.js';
export { throne, harp } from '../mark12/lib.js';
export { crown, staff } from '../mark6/lib.js';
export { tint } from '../mark13/lib.js';
export { incenseBox } from '../matthew2/lib.js';
export { lawTablets } from '../mark10/lib.js';
export { MAGD } from '../mark16/lib.js';
export { group, folk } from '../john6/lib.js';
export { fireWheel, tent } from '../mark9/lib.js';
export { tr, clamp, lerp, seg, es, ease, bump, fade, attr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== skies */
export const HOLY = ['#3b2b22', '#5b4131', '#7b5a41'];
export const HILLDAY = ['#cfe0da', '#f1e5c9', '#f7e9cf'];
export const HILLEVE = ['#a79bbd', '#ecc2a4', '#f5dcb8'];
export const HILLNIGHT = ['#1b2150', '#2b3262', '#4a4876'];
export const ROOM = ['#d7e3de', '#f2e6cc', '#f8ead0'];

/* ================================================================== the cast of Luke */
// Zechariah: an old priest of the division of Abijah — white linen, a blue prayer mantle, white beard
export const ZECHARIAH = { robe: C.linen, mantle: mix(C.dustyBlue, C.indigo, 0.2), hair: '#e6dfd4', hairStyle: 'wrap', veil: C.linen, veil2: mix(C.dustyBlue, C.indigo, 0.25), beard: 'full', beardColor: '#eee7da', skin: C.skin2, belt: C.sun };
// Elizabeth, of the daughters of Aaron: mauve and plum, a cream veil
export const ELIZABETH = { robe: C.mauve, mantle: C.plumRobe, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.greyHair, skin: C.skin, belt: null };
// the angel Gabriel: white and gold, fair hair (mark8's angel)
export const GABRIEL = { robe: C.linen, mantle: C.halo, hair: C.wheat2, hairStyle: 'long', beard: 'none', skin: C.skin };
export function gabriel(c, extra = {}) { return angel(c, { ...GABRIEL, ...extra }); }
// John as a boy, and grown (in camel hair, as Mark drew the Baptist)
export const JOHN_BOY = { robe: '#b98f63', fur: true, belt: C.leather, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3 };
// Luke the writer and the most excellent Theophilus (a Roman gentleman: white with a purple border)
export const LUKE = { robe: mix(C.skyVeil, C.linen, 0.3), mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather };
export const THEOPHILUS = { robe: C.linen, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: null };

/** the cord that binds Zechariah's tongue (head coords: a small knot just in front of the mouth) */
export function knot(c) {
  // a loop of cord across the lips, tied in a little bow with two hanging ends
  const s = sheet();
  const col = C.terracotta, dk = shade(C.terracotta, -0.35);
  const bow = c.ribbon(c.arc(18, 9, 6, 4.2, 0, PI * 2, 14), 2.8) + c.ribbon(c.arc(29, 6, 6, 4.2, 0, PI * 2, 14), 2.8);
  const ends = c.ribbon([[23, 9], [26, 18], [24, 27]], 2.4) + c.ribbon([[23, 9], [20, 19], [22, 28]], 2.4);
  s.p(bow + ends, col);
  s.x(c.poly(c.circ(23.5, 8.5, 3.2, 8)), dk);
  return s.out();
}
/** Zechariah, struck mute: the knot rides on his head */
export function zechMute(c, extra = {}) { return addToHead(person(c, { ...ZECHARIAH, ...extra }), knot(c)); }

/** a swaddled baby, no halo (John); origin bottom centre, head to the right */
export function babyJohn(c) {
  const s = sheet();
  s.p(c.cut(c.blob(-6, -12, 33, 13, 14, 0.06), 0.4, 4), C.linen2);
  s.x(c.ribbon([[-22, -22], [-19, -2]], 2.4) + c.ribbon([[-7, -24], [-4, -1]], 2.4) + c.ribbon([[8, -23], [10, -2]], 2.4), shade(C.linen2, -0.12));
  s.p(c.ribbon([[-26, -12], [16, -13]], 3.4), C.ochre);
  s.p(c.cut(c.circ(25, -15, 11, 14), 0.2, 3), C.skin2);
  s.p(c.cut([...c.arc(25, -15, 11.8, 11.8, PI * 0.95, PI * 1.95, 8), [30, -21], [20, -19]], 0.3, 3), C.hair3);
  s.x(c.ribbon(c.arc(28, -15, 2, 1.4, 0.2, PI - 0.2, 4), 0.9) + c.ribbon(c.arc(33, -15, 1.8, 1.4, 0.2, PI - 0.2, 4), 0.9), C.inkSoft);
  s.x(c.poly(c.circ(30, -9, 2.4, 8)), C.blush, 'opacity=".6"');
  return s.out();
}
/** baby John held in the arms (arm-local, for holdF with armF ≈ 70) */
export const johnInArms = (c) => `<g transform="rotate(-70) translate(-14 12) scale(.9)">${babyJohn(c)}</g>`;
/** a white lily (Gabriel's sign), held upright in a hanging hand; origin at the hand */
export function lily(c, len = 70) {
  const s = sheet();
  s.p(c.ribbon([[0, -10], [2, len * 0.5], [-1, len]], 2.4), C.moss2);
  s.p(c.cut(c.ell(-8, len * 0.45, 9, 3.4, 8, 0.7), 0.2, 3) + c.cut(c.ell(8, len * 0.62, 9, 3.4, 8, -0.7), 0.2, 3), C.leaf);
  const fl = (x, y, r) => c.cut([[x, y], [x - r, y + r * 1.3], [x - r * 0.3, y + r], [x, y + r * 1.6], [x + r * 0.3, y + r], [x + r, y + r * 1.3]], 0.2, 3);
  s.p(fl(-1, len, 9) + fl(3, len * 0.78, 7), '#fbf7ee');
  s.x(c.poly(c.circ(-1, len + 7, 2.2, 6)), C.sun);
  return `<g transform="scale(1 -1)">${s.out()}</g>`;
}
/** a walking staff for the old (hold coords) */
export function oldStaff(c, h = 190, rot = 0) {
  return `<g transform="rotate(${rot})">` + sheet().p(c.ribbon([[0, -h * 0.55], [1.5, 0], [0, h * 0.45]], 5), C.wood2).p(c.cut(c.circ(0, -h * 0.55, 5, 8), 0.2, 3), C.wood3).out() + '</g>';
}

/* ================================================================== small props */
/** a gold censer-shovel with glowing coals (hold coords: handle from the hand along +y… held forward) */
export function censer(c) {
  const s = sheet();
  s.p(c.ribbon([[0, -4], [0, 34]], 4), C.sun);
  s.p(c.cut([[-16, 34], [16, 34], [12, 48], [-12, 48]], 0.3, 3), C.sun);
  s.p(c.cut(c.blob(0, 32, 12, 5, 8, 0.2), 0.3, 2), C.sunRay);
  return `<circle cx="0" cy="30" r="30" fill="url(#warm-glow)" opacity=".8"/>${s.out()}`;
}
/** a wine cup (origin base) */
export function wineCup(c, col = C.sun) {
  const s = sheet();
  s.p(c.cut([[-18, -40], [18, -40], [12, -24], [3, -18], [3, -6], [12, 0], [-12, 0], [-3, -6], [-3, -18], [-12, -24]], 0.3, 3), col);
  s.p(c.cut(c.ell(0, -38, 16, 4, 12), 0.2, 3), C.plumRobe);
  return s.out();
}
/** a tall wine jar (origin base) */
export function wineJar(c, h = 70) {
  const s = sheet();
  s.p(c.cut([[-8, -h], [8, -h], [7, -h * 0.84], [18, -h * 0.6], [20, -h * 0.3], [10, 0], [-10, 0], [-20, -h * 0.3], [-18, -h * 0.6], [-7, -h * 0.84]], 0.4, 4), C.pot);
  s.x(c.ribbon([[-17, -h * 0.5], [17, -h * 0.5]], 2.4), shade(C.pot, -0.25), 'opacity=".7"');
  s.p(c.cut([...c.arc(-17, -h * 0.66, 10, 12, PI * 0.5, PI * 1.5, 8)], 0.3, 3), shade(C.pot, -0.1));
  return s.out();
}
/** an empty cradle with a folded cloth (origin base centre) */
export function cradle(c, w = 90) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -34], [w / 2, -34], [w / 2 - 10, 0], [-w / 2 + 10, 0]], 0.5, 5), C.wood3);
  s.p(c.cut([[-w / 2 - 6, -34], [-w / 2 + 2, -52], [-w / 2 + 10, -34]], 0.3, 4) + c.cut([[w / 2 - 10, -34], [w / 2 - 2, -52], [w / 2 + 6, -34]], 0.3, 4), C.wood2);
  s.p(c.ribbon(c.arc(0, 0, w / 2 + 4, 10, 0, PI, 12), 4), C.wood2);
  s.p(c.cut([[-w / 2 + 12, -36], [w / 2 - 14, -38], [w / 2 - 18, -30], [-w / 2 + 14, -29]], 0.4, 5), C.linen2);
  return s.out();
}
/** a paper moon disc; phase: 0 new … 1 full (a shadow disc slides over it) — origin centre */
export function moonDisc(c, r = 16, col = C.moon) {
  return sheet().p(c.cut(c.circ(0, 0, r, 22), 0.3, 3), col).x(c.poly(c.circ(-r * 0.3, -r * 0.2, r * 0.22, 8)) + c.poly(c.circ(r * 0.3, r * 0.3, r * 0.14, 8)), '#e3d4b3').out();
}
/** a lot: a small white stone (or a dark one); origin centre */
export function lotStone(c, white = true) {
  const s = sheet().p(c.cut(c.blob(0, 0, 10, 7, 9, 0.18), 0.4, 3), white ? C.linen : C.rock3);
  if (white) s.x(c.poly(c.star(0, 0, 5, 2, 4, 0)), C.sun);
  return s.out();
}
/** a wax writing tablet, big (origin centre): { frame, cover } — the cover's origin is its right edge (place it at x + w/2 - 15);
 *  shrinking it (sx 1 → 0) uncovers the words from left to right */
export function bigTablet(c, words, { w = 230, h = 150, size = 30 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 6), C.wood);
  s.p(c.cut(c.rect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28), 0.4, 6), mix(C.ochre, C.wood2, 0.45));
  s.p(c.cut(c.circ(-w / 2 + 7, -h / 2 + 7, 3, 6), 0.2, 2) + c.cut(c.circ(w / 2 - 7, -h / 2 + 7, 3, 6), 0.2, 2), C.wood2);
  const lines = Array.isArray(words) ? words : [words];
  const lh = size * 1.15, y0 = -((lines.length - 1) * lh) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="0" y="${(y0 + i * lh).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.cream}">${l}</text>`).join('');
  const cover = sheet().p(c.poly(c.rect(-(w - 30), -h / 2 + 15, w - 30, h - 30)), mix(C.ochre, C.wood2, 0.45)).out(false);
  return { frame: s.out() + txt, cover, w, h };
}

/* ================================================================== painted flats */
let FL = 0;
/** a painted flat hung on two strings: origin at its centre; inner (flat coords) is clipped to the face */
export function flat(S, inner, { w = 380, h = 240, face = C.parchment, rim = C.haloRim, frame = mix(C.wood3, C.ochre, 0.4) } = {}) {
  const c = S.c, id = S.id('flat' + FL++);
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20), 0.6, 9), frame);
  s.p(c.cut(c.rect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8), 0.4, 9), rim);
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 9), face);
  const strings = `<path d="M${(-w * 0.34).toFixed(0)} ${-h / 2 - 1800}V${-h / 2 - 10}M${(w * 0.34).toFixed(0)} ${-h / 2 - 1800}V${-h / 2 - 10}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`;
  return `<g transform="translate(800 -1600)">${strings}${s.out()}<clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g></g>`;
}
/** a flat's sky: a gradient rect (flat coords) */
export function flatSky(S, w, h, [top, bottom], name = 'fs') {
  const id = S.id(name + FL++);
  S.defs(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`);
  return `<rect x="${-w / 2 - 2}" y="${-h / 2 - 2}" width="${w + 4}" height="${h + 4}" fill="url(#${id})"/>`;
}
/** in during [a, a+d], out during [b-d, b] */
export const dropK = (t, a, b, d = 0.28) => es(t, a, a + d, ease.out) * (1 - es(t, b - d, b, ease.in));
/** place a flown piece: k 0 → up in the flies (off-screen), 1 → at (x, y) */
export function flyTo(el, k, x, y, time = 0, i = 0) {
  pose(el, { x, y: lerp(-1500, y, k), r: Math.sin(time * 0.7 + i * 1.7) * 0.7 * k, o: k > 0.002 ? 1 : 0 });
}
/** a small figure for a flat (markup at x, y, scale s; flip faces left) */
export const fig = (c, o, x, y, s = 0.45, flip = false) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${flip ? -s : s} ${s})">${person(c, { holdF: '', holdB: '', ...o })}</g>`;
/** a strip of hills for a flat (flat coords), top edge around y */
export function flatHills(c, w, y, col, amp = 10) {
  const fn = c.wave(y, [amp, amp * 0.4], [w * 0.8, w * 0.3]);
  return sheet().p(c.ridge(fn, -w / 2 - 20, w / 2 + 20, y + 400, 10, 0.8), col).out();
}
/** a label written on a flat */
export const flatText = (x, y, text, size = 22, col = C.terracotta) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${text}</text>`;

/* ================================================================== the Holy Place */
export const HY = 700;          // the sanctuary floor
export const ALTAR = [800, 588]; // top of the golden altar of incense (the coals)
/** the golden altar of incense (origin: base centre), about 112 tall */
export function incenseAltar(c) {
  const s = sheet();
  const g = C.sun, g2 = shade(C.sun, -0.14);
  s.p(c.cut([[-44, 0], [-40, -94], [40, -94], [44, 0]], 0.4, 6), g);
  s.p(c.cut(c.rect(-52, -106, 104, 14), 0.3, 5) + c.cut(c.rect(-50, -12, 100, 12), 0.3, 5), g2);
  s.p(c.cut([[-52, -106], [-50, -122], [-40, -106]], 0.2, 3) + c.cut([[40, -106], [50, -122], [52, -106]], 0.2, 3), g);
  s.x(c.ribbon([[-26, -80], [26, -80]], 2) + c.ribbon([[-26, -26], [26, -26]], 2) + c.ribbon([[-26, -80], [-26, -26]], 2) + c.ribbon([[26, -80], [26, -26]], 2), shade(C.sun, 0.35), 'opacity=".7"');
  s.x(c.poly(c.star(0, -53, 12, 5, 6, 0)), shade(C.sun, 0.4));
  // the coals
  s.p(c.cut(c.blob(0, -110, 30, 6, 10, 0.2), 0.3, 3), C.sunRay);
  s.x(c.poly(c.circ(-10, -111, 3, 6)) + c.poly(c.circ(8, -110, 3.4, 6)), C.lampFlame);
  return s.out();
}
/** the table of the bread of the Presence with its twelve loaves in two rows (origin: base centre) */
export function showbread(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-80, -84, 160, 12), 0.3, 5), C.sun);
  s.p(c.cut([[-70, -72], [-62, -72], [-64, 0], [-70, 0]], 0.2, 4) + c.cut([[62, -72], [70, -72], [70, 0], [64, 0]], 0.2, 4), shade(C.sun, -0.14));
  let lv = '';
  for (let r = 0; r < 6; r++) { lv += c.cut(c.ell(-38, -92 - r * 11, 30, 7, 12), 0.3, 3) + c.cut(c.ell(38, -92 - r * 11, 30, 7, 12), 0.3, 3); }
  s.p(lv, C.wheat2);
  s.x(c.ribbon([[-60, -96], [-20, -96]], 1) + c.ribbon([[20, -96], [60, -96]], 1), shade(C.wheat2, -0.2), 'opacity=".5"');
  return s.out();
}
/** a column of gold (origin: base centre) */
function goldPillar(c, h, w = 40) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 3, -h], [w / 2 - 3, -h], [w / 2, 0]], 0.4, 10), C.sun);
  s.p(c.cut(c.rect(-w / 2 - 8, -h - 16, w + 16, 18), 0.3, 5) + c.cut(c.rect(-w / 2 - 6, -12, w + 12, 12), 0.3, 5), shade(C.sun, -0.12));
  let fl = '';
  for (let k = -1; k <= 1; k++) fl += c.ribbon([[k * w * 0.22, -16], [k * w * 0.22, -h + 4]], 2);
  s.x(fl, shade(C.sun, -0.22), 'opacity=".5"');
  return s.out();
}
/** the veil before the Holy of Holies (origin top centre): blue, purple and scarlet, woven with golden cherubim */
export function veil(c, w = 420, h = 540) {
  const V = sheet();
  const bands = [mix(C.indigo, C.dustyBlue, 0.3), mix(C.plumRobe, C.indigo, 0.4), shade(C.curtain2, -0.1), mix(C.indigo, C.dustyBlue, 0.3)];
  const n = Math.round(w / 42);
  for (let i = 0; i < n; i++) V.p(c.cut(c.rect(-w / 2 + (i * w) / n, 0, w / n + 1, h), 0.3, 12), bands[i % 4]);
  let folds = '';
  for (let i = 0; i < n; i++) folds += c.ribbon([[-w / 2 + ((i + 0.5) * w) / n, 6], [-w / 2 + ((i + 0.5) * w) / n + c.rr(-3, 3), h - 6]], 4);
  V.x(folds, '#1a1430', 'opacity=".16"');
  let cher = '';
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
    const x = -w / 2 + 56 + k * 104 + (r % 2) * 52, y = 70 + r * 128;
    if (x > w / 2 - 30) continue;
    cher += c.poly([[x, y], [x - 26, y - 26], [x - 19, y - 5], [x - 30, y - 7], [x - 7, y + 9]]) + c.poly([[x, y], [x + 26, y - 26], [x + 19, y - 5], [x + 30, y - 7], [x + 7, y + 9]]) + c.poly(c.circ(x, y - 10, 5, 10)) + c.poly([[x - 5, y], [x + 5, y], [x + 3, y + 20], [x - 3, y + 20]]);
  }
  V.x(cher, C.sun, 'opacity=".75"');
  V.p(c.cut(c.rect(-w / 2, h - 20, w, 20), 0.3, 10), C.sun);
  return V.out();
}
/** a puff of incense smoke (origin centre) */
export function puff(c, r = 20, col = '#ece4f0') { return `<path d="${c.cut(c.blob(0, 0, r, r * 0.72, 11, 0.22), 0.6, 4)}" fill="${col}"/>`; }

/**
 * The Holy Place: the cedar-and-gold walls, the veil at the back, the lampstand on the left, the table of the bread
 * on the right and the golden altar of incense in the middle, its smoke rising. Actors go in P (glows behind them in G).
 * Returns { sk, wall, G, P, front, smoke(t, time, o, up), lampOn(k) }.
 */
export function holyPlace(S, { veilW = 420 } = {}) {
  const c = S.c;
  const sk = sky(S, HOLY);
  const wall = S.layer({ par: 0.08, sh: 3 });
  const W = sheet();
  const wc = mix(C.wood3, C.ochre, 0.3);
  W.p(c.cut([[-1000, -1400], [2600, -1400], [2600, HY + 10], [-1000, HY + 10]], 0.5, 20), wc);
  let panels = '';
  for (let x = -980; x < 2600; x += 130) if (x + 120 < 800 - veilW / 2 - 50 || x > 800 + veilW / 2 + 50) panels += c.cut(c.rect(x + 12, 170, 106, 220), 0.4, 6) + c.cut(c.rect(x + 12, 420, 106, 250), 0.4, 6);
  W.x(panels, shade(wc, -0.12), 'opacity=".55"');
  let palms = '';
  for (let x = -915; x < 2600; x += 130) if (x + 50 < 800 - veilW / 2 - 50 || x - 50 > 800 + veilW / 2 + 50) palms += c.ribbon([[x, 370], [x, 210]], 3) + c.poly([[x, 210], [x - 22, 236], [x, 224], [x + 22, 236]]) + c.poly([[x, 240], [x - 20, 266], [x, 254], [x + 20, 266]]) + c.poly([[x, 272], [x - 18, 296], [x, 286], [x + 18, 296]]);
  W.x(palms, C.sun, 'opacity=".6"');
  W.p(c.cut(c.rect(-1000, 120, 3600, 14), 0.4, 20), shade(C.sun, -0.1));
  wall.add(W.out());
  // the veil and its golden pillars, the rod above
  const VY = 150;
  wall.add(`<g transform="translate(800 ${VY})">${veil(c, veilW, HY - VY)}</g>`);
  wall.add(sheet().p(c.ribbon([[800 - veilW / 2 - 50, VY - 6], [800 + veilW / 2 + 50, VY - 6]], 10), C.sun).out() + `<g transform="translate(${800 - veilW / 2 - 24} ${HY})">${goldPillar(c, HY - VY + 20, 42)}</g><g transform="translate(${800 + veilW / 2 + 24} ${HY})">${goldPillar(c, HY - VY + 20, 42)}</g>`);
  // the floor
  const floorL = S.layer({ par: 0.3, sh: 2 });
  const fs = sheet();
  fs.p(c.cut([[-1000, HY - 4], [2600, HY - 4], [2600, 1800], [-1000, 1800]], 0.5, 20), mix(C.wood3, C.sand2, 0.45));
  let boards = '';
  for (let i = 0; i < 8; i++) boards += c.ribbon([[-1000, HY + 14 + i * i * 6 + i * 8], [2600, HY + 14 + i * i * 6 + i * 8 + c.rr(-2, 2)]], 1.2);
  fs.x(boards, shade(C.wood3, -0.2), 'opacity=".4"');
  floorL.add(fs.out());
  // the lampstand (left) and the table of the bread (right)
  const props = S.layer({ par: 0.3, sh: 5 });
  const lampEl = props.add(`<g transform="translate(410 ${HY + 8}) scale(1.5)">${(() => { const m = menorahBare(c, 130); return m; })()}</g>`);
  props.add(`<g transform="translate(1215 ${HY + 8})">${showbread(c)}</g>`);
  const lampGlow = S.layer({ par: 0.3, sh: 1, flat: true });
  lampGlow.add(`<g transform="translate(410 ${HY - 200})">${glowDisc(190, 'warm-glow', 0.8)}</g>`);
  const flames = lampGlow.add(`<g transform="translate(410 ${HY + 8}) scale(1.5)">${menorahFlames(c, 130)}</g>`);
  // the altar of incense
  const G = S.layer({ par: 0.32, sh: 1, flat: true });
  const coalGlow = G.add(`<g transform="translate(${ALTAR[0]} ${ALTAR[1]})">${glowDisc(110, 'warm-glow', 0.9)}</g>`);
  const altarL = S.layer({ par: 0.32, sh: 5 });
  altarL.add(`<g transform="translate(800 ${HY + 8})">${incenseAltar(c)}</g>`);
  // smoke: puffs rising from the coals
  const smokeL = S.layer({ par: 0.32, sh: 1 });
  const puffs = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: smokeL.add(`<g>${puff(c, 16 + i * 3, mix('#f4efe6', C.lavender, 0.12 + (i % 2) * 0.1))}</g>`), ph: c.rr(0, 1) }));
  const P = S.layer({ par: 0.34, sh: 5 });
  return {
    sk, wall, G, P, props, lampEl, coalGlow,
    /** smoke rising: o opacity, up = how high it climbs (0.3 idle … 1 up to the heavens) */
    smoke(t, time, o = 1, up = 0.3) {
      puffs.forEach((p) => {
        const k = time ? ((time * 0.12 + p.i / puffs.length + p.ph * 0.1) % 1) : (p.i + 0.5) / puffs.length;
        const h = 90 + up * 520;
        pose(p.el, { x: ALTAR[0] + Math.sin(k * 5 + p.i) * (10 + k * 26), y: ALTAR[1] - 14 - k * h, s: 0.5 + k * (0.9 + up), o: o * Math.min(1, k * 5) * (1 - k) * 0.75 });
      });
      pose(coalGlow, { x: ALTAR[0], y: ALTAR[1], s: time ? 1 + Math.sin(time * 3.1) * 0.04 : 1 });
      pose(flames, { x: 410, y: HY + 8, s: 1.5 });
    },
  };
}
/** a lampstand without its flames (so the flames can sit on a flat glow layer); origin: base */
function menorahBare(c, h = 120) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-18, -10], [-4, -14], [-4, -h], [4, -h], [4, -14], [18, -10], [26, 0]], 0.4, 6), C.sun);
  let arms = '';
  [1, 2, 3].forEach((i) => { const r = i * 18; arms += c.ribbon(c.arc(0, -h + 6, r, r * 1.05, 0, PI, 12), 5); });
  s.p(arms, C.sun);
  let cups = '';
  [-54, -36, -18, 0, 18, 36, 54].forEach((x) => { const y = x === 0 ? -h : -h + 6; cups += c.cut([[x - 6, y - 6], [x + 6, y - 6], [x + 3, y], [x - 3, y]], 0.2, 3); });
  s.p(cups, shade(C.sun, -0.15));
  return s.out();
}
function menorahFlames(c, h = 120) {
  let fl = '';
  [-54, -36, -18, 0, 18, 36, 54].forEach((x) => { const y = x === 0 ? -h : -h + 6; fl += `M${x} ${y - 6}C${x - 4} ${y - 10} ${x - 3} ${y - 16} ${x} ${y - 22}C${x + 3} ${y - 16} ${x + 4} ${y - 10} ${x} ${y - 6}Z`; });
  return `<path d="${fl}" fill="${C.lampFlame}"/>`;
}

/* ================================================================== the hill country of Judah: Zechariah's house */
export const HGY = 712;             // the courtyard
export const DOOR_X = 560;          // Zechariah's door (centre)
/**
 * Zechariah's house in the hill country: terraced hills with olives and villages, the house with its door and window
 * on the left, an olive tree on the right, the courtyard. k tints toward night (0 day … 0.5 night).
 * Returns { sk, starL, hangL, far, H: { inside, leaf, shut, doorX, winX, winY }, G, P, front, T }.
 */
export function hillHome(S, skyCols = HILLDAY, { k = 0, NC = HILLNIGHT[1], starsOn = false, cam = null } = {}) {
  const c = S.c;
  const T = (m, f = 1) => tint(m, NC, k * f);
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(starsN(c, { x0: -1000, x1: 2600, y0: -900, y1: 430, n: 160 }));
  starL.fade(starsOn ? 1 : 0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  // far terraced hills with a village
  const far = S.layer({ par: 0.07, sh: 2 });
  const ffn = c.wave(470, [26, 10, 3], [1000, 340, 120]);
  let terr = '';
  for (let i = 1; i < 5; i++) terr += c.ribbon(Array.from({ length: 60 }, (_, j) => { const x = -1200 + j * 70; return [x, ffn(x) + i * 26 + Math.sin(x * 0.01 + i) * 4]; }), 2);
  far.add(T(sheet().p(c.ridge(ffn, -1200, 2800, 1900, 12, 1), mix(C.hillFar, C.hillMid, 0.35)).x(terr, shade(C.hillMid, -0.1), 'opacity=".45"').out() + town(c, { x: 1250, y: ffn(1250) + 20, n: 8, spread: 260, sc: 0.44 }) + town(c, { x: 150, y: ffn(150) + 22, n: 5, spread: 160, sc: 0.4 }) + cypress(c, 980, ffn(980) + 10, 70) + cypress(c, 1010, ffn(1010) + 10, 56), 1.1));
  const mid = S.layer({ par: 0.14, sh: 3 });
  const mfn = c.wave(560, [14, 6], [700, 230]);
  let terr2 = '';
  for (let i = 1; i < 4; i++) terr2 += c.ribbon(Array.from({ length: 60 }, (_, j) => { const x = -1200 + j * 70; return [x, mfn(x) + i * 34 + Math.sin(x * 0.013 + i) * 5]; }), 3);
  mid.add(T(sheet().p(c.ridge(mfn, -1200, 2800, 1900, 12, 1), mix(C.hillMid, C.sand, 0.3)).x(terr2, shade(C.sand2, -0.1), 'opacity=".5"').out() + olive(c, 250, mfn(250) + 30, 0.7) + olive(c, 1380, mfn(1380) + 30, 0.8) + olive(c, 1560, mfn(1560) + 28, 0.6)));
  // the house (left) and the olive tree (right)
  const Hl = S.layer({ par: 0.3, sh: 4 });
  const HX = 380, HW = 300, HH = 200;
  const d = doorHouse(c, { w: HW, h: HH, wall: T(mix(C.plaster, C.sand, 0.2)), shadow: T(C.plaster2), roof: T(C.roof), dw: 58, dh: 104 });
  Hl.add(`<g transform="translate(${HX} ${HGY})">${d.wall}</g>`);
  // a vine on the wall and a low parapet on the roof
  Hl.add(T(sheet().p(c.cut([[HX - 4, HGY - HH - 4], [HX - 4, HGY - HH - 22], [HX + 12, HGY - HH - 24], [HX + 12, HGY - HH - 6], [HX + HW - 12, HGY - HH - 6], [HX + HW - 12, HGY - HH - 24], [HX + HW + 4, HGY - HH - 22], [HX + HW + 4, HGY - HH - 4]], 0.4, 6), shade(C.plaster, -0.05)).out()));
  const inside = Hl.add(`<g transform="translate(${HX} ${HGY})">${d.inside}</g>`);
  const leaf = Hl.add(`<g>${T(d.leaf, 0.6)}</g>`);
  const shut = Hl.add(`<g>${T(d.shutter, 0.6)}</g>`);
  Hl.add(T(olive(c, 1230, HGY + 6, 1.35) + bush(c, 1080, HGY + 8, 80, C.sage, C.moss)));
  const H = { x: HX, w: HW, h: HH, inside, leaf, shut, doorL: HX + d.door[0], doorX: HX + d.door[0] + d.door[1] / 2, winX: HX + d.win[0], winY: HGY + d.win[1] };
  const ground = S.layer({ par: 0.3, sh: 3 });
  ground.add(T(sheet().p(c.ridge(c.wave(HGY - 2, [2, 1], [500, 140]), -1200, 2800, 1900, 12, 0.8), mix(C.sand2, C.sand, 0.45)).out() + grass(c, { x0: 900, x1: 1700, y: HGY + 4, n: 16, h: 12, color: C.moss })));
  // night falling over the set (not over the actors): a dark sheet faded on the compositor
  const dim = S.layer({ par: 0.3, sh: 1, flat: true });
  dim.add(`<rect x="-1400" y="-1600" width="4400" height="3600" fill="${NC}" opacity=".42"/>`);
  dim.fade(0);
  const G = S.layer({ par: 0.3, sh: 1, flat: true });
  const P = S.layer({ par: 0.32, sh: 5 });
  return { sk, starL, hangL, far, mid, Hl, H, G, P, T, ground, dim };
}
/** open / close the house's door and light the door and window */
export function homeLight(H, { open = 0, lit = 0, shut = 0 } = {}) {
  pose(H.leaf, { x: H.doorL, y: HGY, sx: Math.max(0.1, 1 - open * 0.88), o: 1 });
  fade(H.inside, lit);
  pose(H.shut, { x: H.winX, y: H.winY, sx: Math.max(0.001, shut), o: shut > 0.01 ? 1 : 0 });
}
/** a front strip of grass and flowers (call after the actors' layers) */
export function hillFront(S, { k = 0, NC = HILLNIGHT[1] } = {}) {
  const c = S.c;
  const L = S.layer({ par: 0.8, sh: 6 });
  L.add(tint(bush(c, 60, 990, 300, C.sage, C.moss) + bush(c, 1560, 990, 300, C.moss, C.sage) + flowers(c, { x0: -200, x1: 300, y: 930, n: 14 }) + flowers(c, { x0: 1300, x1: 1800, y: 930, n: 14 }), NC, k));
  return L;
}

/* ================================================================== Nazareth: Mary's room */
export const RY = 700;           // the floor
export const WIN = [470, 300];   // the window (centre)
export const DOORW = [1090, 700]; // the doorway (bottom centre)
/**
 * Mary's room: a plastered back wall with a window on the left (hills and sky beyond) and a doorway on the right,
 * a lamp in a niche, a low table with a jar and a dry branch, a mat on the floor.
 * Returns { sk, out, wall, doorLight, G, P, front, branch }.
 */
export function maryRoom(S, skyCols = ROOM) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const out = S.layer({ par: 0.05, sh: 2 });
  out.add(band(c, { y: 360, amps: [14, 6, 2], lens: [700, 260, 100], color: mix(C.hillFar, C.hillMid, 0.4) }).markup + olive(c, 470, 390, 0.6) + cypress(c, 1060, 380, 110) + cypress(c, 1110, 390, 80));
  const glowOut = S.layer({ par: 0.08, sh: 1, flat: true });
  const doorLight = glowOut.add(`<g><path d="${c.poly([[DOORW[0] - 55, RY], [DOORW[0] - 55, 470], [DOORW[0] + 55, 470], [DOORW[0] + 55, RY]])}" fill="#fff3cf"/>${glowDisc(200, 'halo-glow', 1).replace('<circle', `<circle cx="${DOORW[0]}" cy="560"`)}</g>`);
  const wall = S.layer({ par: 0.1, sh: 3 });
  const wc = mix(C.plaster, C.peach, 0.18);
  const ws = sheet();
  const [wx, wy] = WIN;
  const doorPts = [[DOORW[0] - 58, RY + 6], [DOORW[0] - 58, 470], ...c.arc(DOORW[0], 470, 58, 50, PI, 2 * PI, 10), [DOORW[0] + 58, RY + 6]];
  ws.p(c.cut([[-1200, -1400], [2800, -1400], [2800, RY + 10], [-1200, RY + 10]], 0.8, 40) + c.hole(c.rect(wx - 80, wy - 80, 160, 160), 0.6, 10) + c.hole(doorPts, 0.6, 10), wc);
  // plaster shading, the window sill, the lamp niche
  ws.p(c.cut([[wx - 92, wy + 80], [wx + 92, wy + 80], [wx + 98, wy + 94], [wx - 98, wy + 94]], 0.4, 6), C.wood2);
  ws.x(c.ribbon([[wx, wy - 80], [wx, wy + 80]], 5) + c.ribbon([[wx - 80, wy], [wx + 80, wy]], 5), C.wood2);
  ws.p(c.cut([[760, 440], [760, 380], ...c.arc(800, 380, 40, 36, PI, 2 * PI, 8), [840, 440]], 0.4, 5), shade(wc, -0.22));
  ws.p(c.ribbon([[DOORW[0] - 64, 474], ...c.arc(DOORW[0], 470, 64, 56, PI, 2 * PI, 10), [DOORW[0] + 64, 474]], 8), shade(wc, -0.1));
  let cracks = '';
  for (let i = 0; i < 6; i++) { const x = c.rr(-600, 2200), y = c.rr(120, 640); if (Math.abs(x - wx) < 120 || Math.abs(x - DOORW[0]) < 100) continue; cracks += c.ribbon([[x, y], [x + c.rr(-20, 20), y + c.rr(10, 30)]], 1); }
  ws.x(cracks, shade(wc, -0.2), 'opacity=".4"');
  wall.add(ws.out());
  const lampL = S.layer({ par: 0.1, sh: 1, flat: true });
  const lampGlow = lampL.add(`<g transform="translate(812 420)">${glowDisc(150, 'warm-glow', 0.8)}</g>`);
  wall.add(`<g transform="translate(790 436)">${sheet().p(c.cut([[-18, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [29, -9], [20, -2], [10, 1], [-12, 1]], 0.3, 4), C.pot).out()}<path d="M27 -12C22 -18 23 -26 27 -34C31 -26 32 -18 27 -12Z" fill="${C.lampFlame}"/></g>`);
  // floor, mat, table with a jar and a dry branch
  const floor = S.layer({ par: 0.3, sh: 3 });
  floor.add(sheet().p(c.ridge(c.wave(RY, [2, 1], [500, 140]), -1200, 2800, 1900, 12, 0.6), mix(C.wood3, C.sand2, 0.5)).out());
  floor.add(sheet().p(c.cut([[560, RY + 6], [572, RY - 6], [860, RY - 8], [872, RY + 6]], 0.5, 6), mix(C.skyVeil, C.linen2, 0.3)).x(c.ribbon([[580, RY], [852, RY - 2]], 2), C.dustyBlue, 'opacity=".6"').out());
  const props = S.layer({ par: 0.3, sh: 5 });
  props.add(`<g transform="translate(330 ${RY + 4})">${lowTable(c)}</g>` + `<g transform="translate(300 ${RY - 40})">${waterJar(c)}</g>`);
  const branchL = S.layer({ par: 0.3, sh: 4 });
  const B = almondRod(c);
  branchL.add(`<g transform="translate(362 ${RY - 40})">${B.dry}</g>`);
  const blossom = branchL.add(`<g transform="translate(362 ${RY - 40})" opacity="0">${B.bloom}</g>`);
  const G = S.layer({ par: 0.32, sh: 1, flat: true });
  const P = S.layer({ par: 0.34, sh: 5 });
  return { sk, out, doorLight, wall, lampGlow, G, P, blossom, props };
}
/** a low wooden table (origin: floor centre) */
export function lowTable(c, w = 150) {
  return sheet().p(c.cut(c.rect(-w / 2, -44, w, 10), 0.3, 5), C.wood).p(c.cut(c.rect(-w / 2 + 8, -34, 8, 34), 0.2, 4) + c.cut(c.rect(w / 2 - 16, -34, 8, 34), 0.2, 4), C.wood2).out();
}
/** a water jar (origin base) */
export function waterJar(c, h = 60) {
  const s = sheet();
  s.p(c.cut([[-9, -h], [9, -h], [8, -h * 0.84], [20, -h * 0.64], [22, -h * 0.3], [12, 0], [-12, 0], [-22, -h * 0.3], [-20, -h * 0.64], [-8, -h * 0.84]], 0.4, 4), C.pot);
  s.x(c.ribbon([[-19, -h * 0.5], [19, -h * 0.5]], 2.2), C.cream, 'opacity=".5"');
  return s.out();
}
/** a dry almond rod in a narrow jar, and its blossom (origin: jar base) */
export function almondRod(c) {
  const jar = sheet().p(c.cut([[-7, -34], [7, -34], [6, -26], [12, -14], [10, 0], [-10, 0], [-12, -14], [-6, -26]], 0.3, 3), mix(C.stone, C.skyVeil, 0.3));
  const st = sheet();
  const main = c.qbez([0, -30], [6, -90], [-4, -150], 10);
  st.p(c.ribbon(main, (u) => 4 - u * 2.4) + c.ribbon(c.qbez([2, -80], [22, -100], [30, -128], 8), (u) => 2.6 - u * 1.6) + c.ribbon(c.qbez([0, -110], [-18, -122], [-26, -140], 8), (u) => 2.4 - u * 1.5), C.wood2);
  const dry = jar.out() + st.out();
  const b = sheet();
  let pet = '', lv = '';
  [[-4, -150], [30, -128], [-26, -140], [4, -120], [16, -104], [-12, -128], [6, -90], [24, -116], [-18, -134]].forEach(([x, y], i) => {
    pet += c.cut(c.star(x, y, 9, 5, 5, i), 0.2, 3);
    if (i % 3 === 0) lv += c.cut(c.ell(x + 8, y + 6, 7, 3, 8, 0.6), 0.2, 3);
  });
  b.p(lv, C.leaf).p(pet, mix(C.blushVeil, '#fffaf0', 0.4));
  let mid = '';
  [[-4, -150], [30, -128], [-26, -140], [4, -120], [16, -104], [-12, -128], [6, -90], [24, -116], [-18, -134]].forEach(([x, y]) => { mid += c.poly(c.circ(x, y, 2, 6)); });
  b.x(mid, C.sun);
  return { dry, bloom: `<circle cx="0" cy="-120" r="70" fill="url(#halo-glow)" opacity=".7"/>${b.out()}` };
}

/** a paper heart without its glow (so it never washes out the faces it passes) */
export const plainHeart = (c, r = 12, col) => heartM(c, r, col).replace(/<circle[^>]*\/>/, '');
