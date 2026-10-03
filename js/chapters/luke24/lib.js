// Luke 24 — the first day of the week, and the end of the Gospel. The garden and the great round stone are Mark 16's
// (placed as Matthew 28 placed them); the inside of the tomb with the linen lying and the two in dazzling white are
// John 20's; the women are Mark 16's Mary Magdalene and Mary the mother of James with Luke 8's Joanna and Susanna; the
// two who walk to Emmaus are the two walkers of Mark 16 (one of them is Cleopas) and the Risen One walks with them as
// Mark 16's hooded traveller, "in another form"; the upper room with its shuttered windows and barred door is John 20's;
// the fish on the coals is John 21's; the Temple court of the last beat is Luke 2's, where the Gospel began.
// Our own: the road to Emmaus from the gate of Jerusalem through the hills to the village (golden afternoon to night),
// the little house at Emmaus with its window on the sunset and the lamp over the table, the soft veil that hangs between the walkers and
// the Stranger, the burning hearts, the long scroll of Moses and the Prophets, the old map of the nations lit city by city,
// the Mount of Olives above Bethany for the parting.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt, flock } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, flowers, rock, town, house, sun, moon, stars, cloud } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { WALKERS, STRANGER as STRANGER16, MAGD as MAGD16, MARYJ as MARYJ16 } from '../mark16/lib.js';
import { JOANNA as JOANNA8, SUSANNA as SUSANNA8 } from '../luke8/lib.js';
import { walledCity } from '../mark1/lib.js';
import { hangingLamp, lampGlow } from '../mark14/lib.js';
import { TW as TW14 } from '../john14/lib.js';
import { room20 } from '../john20/lib.js';
import { lowTable } from '../mark2/lib.js';
import { withFace, faceBits, heart as heart3 } from '../mark3/lib.js';
import { flame as flame1 } from '../mark1/lib.js';
import { upright as upright16 } from '../mark16/lib.js';

export { tr, es, ease, bump, seg, fade, attr, makeCutter };
export {
  spiceJar, scent, gardenSet, GARDEN_PATH, pathS as gardenS, DOOR, STONE, skyKeys, upright, discFaces, medallion, miniHead, risenIcon,
  tombIcon, talkDots, ELEVEN, YOUTH, WALKERS, bigStone,
} from '../mark16/lib.js';
export { tombGarden, OPEN, SHUT, SR, STONE_Y, DX, DYD, PATH, pathS, emptyTomb, angelIcon, lightRoad, NIGHT, PRE, ROSE, GOLD, DAY } from '../matthew28/lib.js';
export {
  angelPerson, ANGEL_A, ANGEL_B, tombInside, IN, linenLying, faceCloth, vignette, handB, bodyAt, markLight, palm, goldWord, rayBurst,
  radiance, peaceDove, worryCloud, question, flapWings, daysString, room20, RDOOR, glowDisc, hungWord, eye,
} from '../john20/lib.js';
export { kf, moving, hand, headAt, speech, thought, GLYPH, lowTable, bowl, loaf, cup, lantern, scrollOpen, scrollRolled, addToHead, addToBody } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, sparkle, stoneHeart, along, handAt, shadowPerson, silhouette, wisp, heart, spark } from '../mark3/lib.js';
export { voiceRings, flame, dove } from '../mark1/lib.js';
export { glory, soulLight, lightCrown, loafHalves, crumb } from '../mark8/lib.js';
export { roastFish, flatLoaf, steamCurl } from '../john21/lib.js';
export { flat, flatSky, flatHills, fig, flyTo, dropK, flatText } from '../luke1/lib.js';
export { plate, iconCard, words, still, halo, warm, godLight } from '../luke18/lib.js';
export { isaiahScroll } from '../luke4/lib.js';
export { shadowHand, hangingLamp, lampGlow, oilLamp, lamb, seal } from '../mark14/lib.js';
export { soldierSil } from '../mark15/lib.js';
export { hillCross } from '../matthew20/lib.js';
export { templeSet, TFLOOR, TEMPLE_DAY } from '../luke2/lib.js';
export { lawTablets } from '../mark10/lib.js';
export { harp } from '../mark12/lib.js';
export { serpentPole } from '../john3/lib.js';
export { LOOK as L9 } from '../mark9/lib.js';
export { walledCity };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ================================================================== skies */
export const AFTERNOON = ['#c9ddd8', '#f0e5c8', '#f8e6c2'];
export const LATE = ['#d1d6c6', '#f2dcb4', '#f8e3bd'];
export const GOLDEN = ['#d8c6a6', '#f3d4a0', '#f9e2b8'];
export const SUNSET = ['#9486b0', '#e6a68b', '#f5c895'];
export const EVENING = ['#4e4c80', '#94789c', '#dca08e'];
export const NIGHTROAD = ['#141a3d', '#242c60', '#414a80'];
export const MORNING = ['#cfe2dd', '#f1e9cf', '#f8ecd2'];
export const HEAVENLY = ['#e9d3a0', '#f6e2b6', '#fbefd4'];

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
export const PETER = CAST.peter;
export const MAGD = MAGD16;
export const MARYJ = MARYJ16;
export const JOANNA = JOANNA8;
export const SUSANNA = SUSANNA8;
/** the women who came with Him from Galilee (23,55): named in 24,10 — and Susanna (8,3) for "the other women" */
export const WOMEN = [
  { k: 'magd', o: MAGD, name: () => tr(['Maria', 'Magdalena'], ['Mary', 'Magdalene']) },
  { k: 'joanna', o: JOANNA, name: () => tr('Joanna', 'Joanna') },
  { k: 'maryj', o: MARYJ, name: () => tr(['Maria,', 'matka Jakuba'], ['Mary, the mother', 'of James']) },
  { k: 'susanna', o: SUSANNA, name: null },
];
/** the colours of their spice jars (jar, lid), one per woman */
export const JARS = [[C.cream, C.clay], [C.blushVeil, C.plumRobe], [C.linen2, C.teal2], [C.sand, C.terracotta]];
/** the two on the road to Emmaus (Mark 16's walkers): Cleopas and his companion */
export const CLEOPAS = WALKERS[0];
export const FRIEND = WALKERS[1];
/** the Risen One "in another form" (Mark 16's traveller: hood and cloak; only a faint halo) */
export const STRANGER = STRANGER16;
/** the Eleven by key (the Twelve of Mark 3 / Luke 6, without Judas) */
export const TW = TW14;

/* ================================================================== small pieces */
/** a soft paper veil of haze hung on a string ("their eyes were kept from recognising Him"); origin: its foot */
export function hazeVeil(c, w = 50, h = 230) {
  const pts = [];
  for (let y = 0; y >= -h; y -= 14) pts.push([-w / 2 + Math.sin(y * 0.05) * 5, y]);
  for (let y = -h; y <= 0; y += 14) pts.push([w / 2 + Math.sin(y * 0.05 + 1.3) * 5, y]);
  let folds = '';
  for (let x = -w / 2 + 12; x < w / 2 - 6; x += 12) folds += c.ribbon([[x, -h + 8], [x + Math.sin(x) * 3, -6]], 1.4);
  const gauze = mix(C.lavender, C.linen, 0.45);
  return `<path d="M0 ${-h - 1600}V${-h - 4}" stroke="${STRING}" stroke-width="1.2" fill="none"/><path d="${c.cut(pts, 0.8, 8)}" fill="${gauze}" opacity=".78"/><path d="${folds}" fill="${shade(gauze, -0.12)}" opacity=".55"/><path d="${c.cut(c.rect(-w / 2 - 6, -h - 6, w + 12, 7), 0.3, 5)}" fill="${C.wood2}"/>`;
}
/** a heart with a little flame on it ("did not our hearts burn within us?"); origin: the heart's centre */
export function burningHeart(c, r = 16) {
  return `<g class="fl" transform="translate(0 ${(-r * 0.55).toFixed(1)})">${flame1(c, r * 1.9)}</g>${heart3(c, r, shade(C.jesusMantle, -0.05))}`;
}
/** a small cross on its hill (restrained, no figure); origin: foot of the hill */
export function crossHill(c, r = 1, col = mix(C.wood2, C.soilDark, 0.4), hill = mix(C.storm2, C.plumRobe, 0.3)) {
  const s = sheet();
  s.p(c.cut([[-60 * r, 0], [-30 * r, -14 * r], [0, -20 * r], [30 * r, -14 * r], [60 * r, 0]], 0.5, 5), hill);
  s.p(c.cut([[-3.5 * r, -18 * r], [-3.5 * r, -86 * r], [3.5 * r, -86 * r], [3.5 * r, -18 * r]], 0.3, 4) + c.cut([[-20 * r, -70 * r], [20 * r, -70 * r], [20 * r, -63 * r], [-20 * r, -63 * r]], 0.3, 4), col);
  return s.out();
}
/** a small sun rising over a hill (the third day); origin: the foot of the hill */
export function sunriseIcon(c, r = 1) {
  const s = sheet();
  let rs = '';
  for (let i = 0; i < 11; i++) { const a = PI + (i / 10) * PI, w = 0.08; rs += c.poly([[0, -12 * r], [Math.cos(a - w) * 60 * r, -12 * r + Math.sin(a - w) * 60 * r], [Math.cos(a + w) * 60 * r, -12 * r + Math.sin(a + w) * 60 * r]]); }
  s.x(rs, '#fff3cf', 'opacity=".85"');
  s.p(c.cut(c.circ(0, -12 * r, 18 * r, 20), 0.3, 3), C.sun);
  s.p(c.cut([[-60 * r, 0], [-30 * r, -12 * r], [0, -14 * r], [30 * r, -10 * r], [60 * r, 0]], 0.5, 5), C.sage);
  return s.out();
}
/** a round sun/night disc for "the third day": kind 'dark' | 'sun' ; origin centre */
export function dayDisc3(c, kind, r = 26) {
  const s = sheet();
  if (kind === 'dark') {
    s.p(c.cut(c.circ(0, 0, r + 4, 24), 0.4, 4), C.wood3).p(c.cut(c.circ(0, 0, r, 24), 0.3, 4), mix(C.night, C.plumRobe, 0.3));
    s.p(c.cut([...c.arc(0, 0, r * 0.45, r * 0.45, -PI * 0.6, PI * 0.6, 10), ...c.arc(r * 0.18, 0, r * 0.34, r * 0.4, PI * 0.5, -PI * 0.5, 8)], 0.2, 3), C.moon);
    return s.out();
  }
  let rs = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; rs += c.poly([[Math.cos(a - 0.12) * r * 0.62, Math.sin(a - 0.12) * r * 0.62], [Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95], [Math.cos(a + 0.12) * r * 0.62, Math.sin(a + 0.12) * r * 0.62]]); }
  s.p(c.cut(c.circ(0, 0, r + 4, 24), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, r, 24), 0.3, 4), mix(C.cream, C.halo, 0.5));
  s.x(rs, C.sun);
  s.p(c.cut(c.circ(0, 0, r * 0.5, 16), 0.2, 3), C.sun);
  return s.out();
}
/** a pale, wispy figure (what they thought they saw: a spirit); origin: its foot */
export function ghost(c, h = 70) {
  const s = sheet();
  const w = h * 0.34;
  const pts = [[0, -h], [w * 0.55, -h * 0.9], [w * 0.7, -h * 0.6], [w * 0.8, -h * 0.2], [w * 1.0, 0], [w * 0.4, -h * 0.08], [0, h * 0.02], [-w * 0.4, -h * 0.1], [-w * 1.05, -h * 0.02], [-w * 0.8, -h * 0.22], [-w * 0.7, -h * 0.6], [-w * 0.55, -h * 0.9]];
  s.p(c.cut(pts, 0.8, 4), mix(C.lavender, '#ffffff', 0.45), 'opacity=".8"');
  s.x(c.poly(c.circ(-w * 0.22, -h * 0.78, 2.4, 6)) + c.poly(c.circ(w * 0.22, -h * 0.78, 2.4, 6)), C.inkSoft, 'opacity=".6"');
  return s.out();
}
/** a milestone with a carved line (origin: foot); text through tr() */
export function milestone(c, text, { size = 15 } = {}) {
  const s = sheet();
  s.p(c.cut([[-22, 0], [-20, -70], ...c.arc(0, -70, 20, 12, PI, 2 * PI, 8), [20, -70], [22, 0]], 0.6, 5), mix(C.stone2, C.rock, 0.4));
  s.x(c.ribbon([[-16, -46], [16, -46]], 1.2) + c.ribbon([[-16, -24], [16, -24]], 1.2), shade(C.rock, -0.2), 'opacity=".6"');
  return s.out() + `<text x="0" y="-31" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.inkSoft}">${text}</text>`;
}
/** a wooden signpost with an arrow board pointing right; origin: foot of the post */
export function signpost24(c, text, { size = 19, w } = {}) {
  const ww = w || text.length * size * 0.52 + 40;
  const s = sheet();
  s.p(c.cut(c.rect(-5, -120, 10, 120), 0.4, 6), C.wood2);
  s.p(c.cut([[-20, -112], [ww - 18, -114], [ww, -96], [ww - 18, -78], [-20, -80]], 0.5, 6), C.wood3);
  s.x(c.ribbon([[-14, -106], [ww - 22, -107]], 1), shade(C.wood3, -0.2), 'opacity=".5"');
  return s.out() + `<text x="${((ww - 20) / 2 - 10).toFixed(1)}" y="${-90}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** a little golden star of hope on a string (origin centre) */
export function hopeStar(c, r = 22, col = C.sun) {
  const s = sheet().p(c.cut(c.star(0, 0, r, r * 0.45, 6, -PI / 2), 0.4, 3), col).x(c.poly(c.circ(0, 0, r * 0.28, 8)), shade(col, 0.5));
  return s.out();
}
/** three scrolls: the Law of Moses, the Prophets, the Psalms — a scroll with an emblem painted on it; origin centre */
export function bookScroll(c, emblem, { w = 110, h = 74 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 6), C.parchment);
  let ln = '';
  for (let y = -h / 2 + 10; y < h / 2 - 4; y += 7) { if (Math.abs(y) < h * 0.26) continue; ln += c.ribbon([[-w / 2 + 12, y], [w / 2 - 12 - c.rr(0, 12), y]], 1.3); }
  s.x(ln, C.ink, 'opacity=".4"');
  s.p(c.cut(c.rect(-w / 2 - 10, -h / 2 - 6, 11, h + 12), 0.3, 5) + c.cut(c.rect(w / 2 - 1, -h / 2 - 6, 11, h + 12), 0.3, 5), C.wood3);
  s.p(c.cut(c.rect(-w / 2 - 7, -h / 2 - 13, 5, 7), 0.2, 3) + c.cut(c.rect(w / 2 + 2, -h / 2 - 13, 5, 7), 0.2, 3) + c.cut(c.rect(-w / 2 - 7, h / 2 + 6, 5, 7), 0.2, 3) + c.cut(c.rect(w / 2 + 2, h / 2 + 6, 5, 7), 0.2, 3), C.sun);
  return s.out() + emblem;
}

/* ================================================================== the road to Emmaus */
/** the road: where the walkers' feet are */
export const RD = { GY: 716, CITY: -60, HOUSE: 1140, DOOR: 1178 };
/**
 * The road from Jerusalem to Emmaus: the city on its hill at the far left (optional), long hills with olive
 * terraces, the road winding along the valley, a milestone, olive trees and cypresses, and (house: true) the first
 * house of Emmaus at the right with its door and window that can be lit. Always cut with the same scissors.
 * skyCols: the sky; sky2/sky3: skies to cross-fade to (rise 0). tone: 0 → day colours, 1 → evening colours (build time).
 * Returns { sk2, sk3, starL, hangL, sunEl, moonEl, far, mid, ground, FL, bits, behind, act, fx, fg, tint, door, win, update(T, {sunX, sunY, moonY}) }.
 */
export function emmausSet(S, { skyCols = AFTERNOON, sky2 = null, sky3 = null, sunAt = [1240, 170], moonAt = null, city = true, cityX = RD.CITY, house: withHouse = false, tone = 0, starsOn = false, flPar = 0.3 } = {}) {
  const c = makeCutter('lk24-road');
  const T = (col) => (tone ? mix(col, mix(C.duskViolet, C.dusk, 0.25), tone * 0.45) : col);
  sky(S, skyCols);
  let sk2 = null, sk3 = null;
  if (sky2) { sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer; sk2.fade(0); }
  if (sky3) { sk3 = sky(S, sky3, { name: 'sky3', rise: 0 }).layer; sk3.fade(0); }
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 400, n: 130 }));
  starL.fade(starsOn ? 1 : 0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 46, { rays: C.sunDeep }), { x: sunAt[0], y: sunAt[1], len: 900 });
  const moonEl = moonAt ? hanging(hangL, `<circle r="80" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 30)}`, { x: moonAt[0], y: moonAt[1], len: 900 }) : null;
  const cls = [[480, 150, 170], [930, 110, 120]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w, T(C.cream), T('#eadcc0')), { x, y, len: 800 }) }));
  // far hills, Jerusalem on its hill at the left
  const far = S.layer({ par: 0.08, sh: 2 });
  const h1 = band(c, { y: 452, amps: [18, 8, 3], lens: [1100, 360, 120], color: T(mix(C.hillFar, C.duskViolet, 0.12)), x0: -1400, x1: 3000 });
  far.add(h1.markup);
  if (city) far.add(`<g>${walledCity(c, cityX, h1.fn(cityX) + 10, 1.05, { wall: T(C.stone), wall2: T(C.stone2), temple: T(C.cream) })}</g>`);
  // the middle hills: terraces and olive groves
  const mid = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 540, amps: [24, 10, 3], lens: [950, 310, 110], color: T(C.hillMid), trees: 40, treeColor: T(C.sage), treeH: 22, x0: -1400, x1: 3000 });
  let terr = '';
  for (let i = 0; i < 12; i++) { const x = c.rr(-1000, 2600), y = h2.fn(x) + c.rr(18, 60); terr += c.ribbon([[x - c.rr(60, 120), y], [x + c.rr(60, 120), y + c.rr(-3, 3)]], 2.2); }
  mid.add(h2.markup + `<path d="${terr}" fill="${T(shade(C.hillMid, -0.12))}" opacity=".6"/>` + olive(c, 260, h2.fn(260) + 8, 0.7, { leaf: T(C.olive), leaf2: T(C.sage) }) + olive(c, 1500, h2.fn(1500) + 8, 0.75, { leaf: T(C.olive), leaf2: T(C.sage) }) + cypress(c, 980, h2.fn(980) + 6, 90, T(C.moss2)));
  if (withHouse) mid.add(town(c, { x: 1520, y: h2.fn(1520) + 14, n: 6, spread: 300, sc: 0.62, wall: T(C.plaster), shadow: T(C.plaster2) }));
  // the near ground and the road
  const ground = S.layer({ par: 0.5, sh: 3 });
  const gfn = c.wave(636, [7, 3], [820, 230]);
  const gs = sheet();
  gs.p(c.ridge(gfn, -1600, 3200, 1700, 12, 1), T(mix(C.hillNear, C.sand, 0.22)));
  const road = [[-1600, 752], [-600, 740], [200, 734], [800, 732], [1400, 728], [2200, 734], [3200, 744]];
  gs.p(c.ribbon(road, 76, 3), T(C.sand));
  gs.x(c.ribbon(road.map(([x, y]) => [x, y + 16]), 22, 2), T(C.sand2), 'opacity=".5"');
  let ruts = '';
  for (let x = -1500; x < 3100; x += c.rr(50, 110)) ruts += c.ribbon([[x, 722 + c.rr(-4, 12)], [x + c.rr(14, 34), 722 + c.rr(-4, 12)]], 1.6);
  gs.x(ruts, T(shade(C.sand2, -0.1)), 'opacity=".5"');
  // low field walls
  let walls = '';
  for (const [x0, x1] of [[-900, -350], [150, 520], [1450, 1900]]) for (let x = x0; x < x1; x += 22) walls += c.cut(c.blob(x, gfn(x) + 22, 13, 8, 8, 0.2), 0.5, 3);
  gs.p(walls, T(mix(C.stone2, C.rock, 0.35)));
  ground.add(gs.out());
  ground.add(grass(c, { x0: -1500, x1: 3100, y: 636, fn: gfn, n: 90, h: 15, color: T(C.moss) }) + olive(c, 90, gfn(90) + 24, 1.15, { leaf: T(C.olive), leaf2: T(C.sage) }) + olive(c, 1420, gfn(1420) + 26, 1.05, { leaf: T(C.olive), leaf2: T(C.sage) }) + cypress(c, 1620, gfn(1620) + 24, 170, T(C.moss2)) + cypress(c, 1680, gfn(1680) + 24, 130, T(C.moss2)) + bush(c, 520, gfn(520) + 30, 70, T(C.sage), T(C.moss)) + rock(c, 700, gfn(700) + 40, 50, 20, T(C.rock2)) + flowers(c, { x0: -800, x1: 2400, y: 690, fn: (x) => gfn(x) + c.rr(26, 60), n: 30, h: 16 }));
  ground.add(`<g transform="translate(360 ${gfn(360) + 52})">${milestone(c, 'XX')}</g>`);
  let door = null, win = null;
  if (withHouse) {
    // the first house of Emmaus: its door on the road
    const hx = RD.HOUSE, hy = 700, hw = 250, hh = 220;
    const hs = sheet();
    hs.p(c.cut(c.rect(hx, hy - hh, hw, hh + 6), 0.6, 8), T(C.plaster));
    hs.p(c.cut([[hx + hw, hy - hh], [hx + hw + 50, hy - hh + 14], [hx + hw + 50, hy + 6], [hx + hw, hy + 6]], 0.5, 6), T(C.plaster2));
    hs.p(c.cut([[hx - 6, hy - hh - 8], [hx + hw + 8, hy - hh - 8], [hx + hw + 8, hy - hh + 2], [hx - 6, hy - hh + 2]], 0.4, 8), T(C.roof));
    let bl = '';
    for (let i = 0; i < 6; i++) bl += c.cut(c.blob(hx + c.rr(20, hw - 20), hy - c.rr(30, hh - 30), c.rr(14, 26), c.rr(6, 10), 8, 0.2), 0.5, 4);
    hs.x(bl, T(shade(C.plaster, -0.05)), 'opacity=".6"');
    // doorway (dark) and window
    hs.p(c.cut([[RD.DOOR - 34, hy + 4], [RD.DOOR - 34, hy - 120], ...c.arc(RD.DOOR, hy - 120, 34, 26, PI, 2 * PI, 10), [RD.DOOR + 34, hy - 120], [RD.DOOR + 34, hy + 4]], 0.4, 5), T(mix(C.soilDark, C.wood2, 0.3)));
    hs.p(c.cut(c.rect(hx + 150, hy - 170, 50, 44), 0.3, 4), T(C.soilDark));
    hs.p(c.cut(c.rect(hx + 144, hy - 128, 62, 7), 0.3, 4) + c.cut(c.rect(RD.DOOR - 40, hy - 150, 80, 9), 0.3, 4), T(C.wood));
    hs.p(c.cut([[hx + 20, hy + 6], [hx + 20, hy - 26], [hx + 60, hy - 26], [hx + 60, hy + 6]], 0.3, 4), T(C.pot));
    ground.add(hs.out() + olive(c, hx + hw + 110, 690, 0.9, { leaf: T(C.olive), leaf2: T(C.sage) }));
    // the lit window and the lit doorway (faded in)
    win = ground.add(`<g opacity="0"><circle cx="${hx + 175}" cy="${hy - 148}" r="90" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(hx + 152, hy - 168, 46, 40))}" fill="${C.lampGlow}"/></g>`);
    door = ground.add(`<g opacity="0"><path d="${c.poly([[RD.DOOR - 32, hy + 3], [RD.DOOR - 32, hy - 120], ...c.arc(RD.DOOR, hy - 120, 32, 24, PI, 2 * PI, 10), [RD.DOOR + 32, hy - 120], [RD.DOOR + 32, hy + 3]])}" fill="${mix(C.lampGlow, C.sun, 0.3)}"/></g>`);
  }
  const FL = S.layer({ par: flPar, sh: 6 });
  const bits = S.layer({ par: flPar, sh: 5 });
  const behind = S.layer({ par: 0.5, sh: 0, flat: true });
  const act = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.52, sh: 5 });
  const fg = S.layer({ par: 0.9, sh: 6 });
  const bank = c.wave(960, [10, 4], [520, 170]);
  fg.add(sheet().p(c.ridge(bank, -1400, 3000, 1800, 14, 1.2), T(mix(C.sage, C.olive, 0.25))).out() + grass(c, { x0: -1400, x1: 3000, y: 960, fn: bank, n: 60, h: 26, color: T(C.moss) }) + flowers(c, { x0: -1400, x1: 3000, y: 960, fn: bank, n: 16, h: 28 }) + bush(c, -80, 990, 230, T(C.moss), T(C.sage)) + bush(c, 1720, 990, 210, T(C.moss2), T(C.sage)));
  // night falls over the whole stage: a sheet of blue faded on the compositor
  const tint = S.layer({ par: 0, sh: 1, flat: true, rise: 0 });
  tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}"/>`);
  tint.fade(0);
  return {
    c, sk2, sk3, starL, hangL, sunEl, moonEl, far, mid, ground, gfn, FL, bits, behind, act, fx, fg, tint, door, win,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], moonY = moonAt ? moonAt[1] : 0, moonX = moonAt ? moonAt[0] : 0 } = {}) {
      swing(sunEl, sunX, sunY, time, 0.8, 0.5);
      if (moonEl) swing(moonEl, moonX, moonY, time, 1, 0.6, 1);
      cls.forEach((cl) => swing(cl.el, cl.x + (time ? Math.sin(time * 0.1 + cl.i) * 20 : 0), cl.y, time, 1.2, 0.6, cl.i));
    },
  };
}
/** walkers on the road: y and depth scale at x (they all walk on the same line) */
export const roadY = (x) => RD.GY + (x < 800 ? (800 - x) * 0.004 : 0);

/** where the three stand when they stop on the road: the companion, the Stranger in the middle, Cleopas */
export const TRIO = { FR: 680, ST: 800, CL: 920, S: 1.05 };
/**
 * The two walkers and the Stranger on the road (people layer L; fxL for their bits). stranger: add the hooded traveller.
 * Returns { fr, cl, st (puppets with .p, .el, .sad), halos, halo(k), stSet(o) }.
 */
export function roadTrio(S, L, fxL, { stranger = true, staff = true } = {}) {
  const c = S.c;
  const mk = (o, extra = {}) => { const el = L.add(withFace(person(c, { ...o, ...extra }), faceBits(c))); return { el, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') }; };
  const fr = mk(FRIEND);
  let st = null, halos = [];
  if (stranger) {
    st = mk(STRANGER, staff ? { holdF: `<path d="${c.ribbon([[0, 70], [2, -64]], 4)}" fill="${C.wood2}"/>` } : {});
    halos = Array.from(st.el.querySelectorAll('.halo, .halo-glow'));
  }
  const cl = mk(CLEOPAS);
  return {
    fr, cl, st, halos,
    /** set the Stranger (keeps his staff upright) */
    stSet(o) { st.p.set(o); if (staff) upright16(st.p, 'F', o.armF || 0); },
    /** the Stranger's halo: k 0.28 (hidden, "another form") … 1 */
    halo(k) { halos.forEach((h) => fade(h, k)); },
  };
}

/* ================================================================== the house at Emmaus */
export const EM = { FLOOR: 700, SEAT: 672, TABLE: 704, JX: 800, LX: 590, RX: 1010, WIN: [400, 560, 330, 500] };
/**
 * Inside the house at Emmaus at the end of the day: a warm plaster wall, an arched window on the left onto the
 * hills and the setting sun (cross-fades to evening), a niche with jars on the right, one lamp hanging over the low
 * table. Returns { outSun, eve (layer to fade), lamp: {el, fl, gl}, wallL, floorL, tabL, update(time, lit) }.
 */
export function emmausRoom(S, { skyCols = SUNSET, eveCols = EVENING } = {}) {
  const c = makeCutter('lk24-room');
  const { FLOOR, WIN } = EM;
  const [wx0, wx1, wy0, wy1] = WIN;
  // outside the window: the sky and the hills, the sun going down
  const sk = sky(S, skyCols, { top: 200, bottom: 520 });
  const eve = sky(S, eveCols, { name: 'eve', rise: 0, top: 200, bottom: 520 }).layer;
  eve.fade(0);
  const outL = S.layer({ par: 0.12, sh: 2 });
  const outSun = hanging(outL, sun(c, 34, { rays: C.sunDeep }), { x: 520, y: 380, len: 900 });
  outL.add(band(c, { y: 440, amps: [12, 5, 2], lens: [400, 140, 60], color: mix(C.hillMid, C.duskViolet, 0.35), x0: 200, x1: 900 }).markup);
  outL.add(hillsWith(c, { y: 466, amps: [10, 5, 2], lens: [300, 120, 50], color: mix(C.hillNear, C.duskViolet, 0.35), trees: 8, treeColor: mix(C.olive, C.duskViolet, 0.35), treeH: 16, x0: 200, x1: 900 }).markup);
  const starOut = outL.add(`<g opacity="0">${stars(c, { x0: 380, x1: 600, y0: 330, y1: 430, n: 10 })}</g>`);
  // the wall with the arched window
  const wallL = S.layer({ par: 0.3, sh: 4 });
  const wcol = mix(C.plaster, C.apricot, 0.25);
  const winPts = [[wx0, wy1], [wx0, wy0 + (wx1 - wx0) / 2], ...c.arc((wx0 + wx1) / 2, wy0 + (wx1 - wx0) / 2, (wx1 - wx0) / 2, (wx1 - wx0) / 2, PI, 2 * PI, 16), [wx1, wy1]];
  const w = sheet();
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(winPts, 0.5, 6), wcol);
  let blot = '';
  for (let i = 0; i < 16; i++) blot += c.cut(c.blob(c.rr(-300, 1900), c.rr(240, FLOOR - 50), c.rr(24, 60), c.rr(10, 22), 10, 0.2), 0.8, 6);
  w.x(blot, shade(wcol, -0.05), 'opacity=".55"');
  w.p(c.ribbon(winPts.slice(0, -1), 10), C.wood2);
  w.p(c.cut(c.rect(wx0 - 16, wy1 - 4, wx1 - wx0 + 32, 12), 0.3, 6), C.wood);
  // beams, a niche with jars and a folded cloth on the right
  // phone: the ceiling sits higher, so the tall screen is not a third wood
  const CEIL = S.portrait ? -90 : 190;
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, CEIL], [-900, CEIL]], 0.8, 30), shade(C.wood2, -0.15));
  let beams = '';
  for (let x = -300; x < 1900; x += 110) beams += c.cut(c.rect(x, CEIL - 6, 24, 26), 0.3, 5);
  w.p(beams, C.wood);
  const nx = 1180, ny = 400;
  w.p(c.cut([[nx - 70, ny + 80], [nx - 70, ny], ...c.arc(nx, ny, 70, 50, PI, 2 * PI, 12), [nx + 70, ny], [nx + 70, ny + 80]], 0.5, 6), shade(wcol, -0.16));
  w.p(c.cut([[nx - 60, ny + 44], [nx - 50, ny + 8], [nx - 30, ny + 4], [nx - 22, ny + 44]], 0.4, 4) + c.cut([[nx + 10, ny + 44], [nx + 4, ny + 20], [nx + 16, ny - 4], [nx + 34, ny - 4], [nx + 46, ny + 20], [nx + 40, ny + 44]], 0.4, 4), C.pot);
  w.p(c.cut(c.rect(nx - 80, ny + 80, 160, 10), 0.3, 5), C.wood);
  w.p(c.cut(c.rect(250, 560, 120, 8), 0.3, 5), C.wood);
  w.p(c.cut([[270, 560], [276, 528], [300, 522], [312, 560]], 0.3, 4), C.clay);
  wallL.add(w.out());
  // the floor
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR - 30], [2500, FLOOR - 30], [2500, 1700], [-900, 1700]], 1, 30), mix(C.clay, C.sand2, 0.55));
  let lines = '';
  for (let i = 0; i < 6; i++) { const y = FLOOR - 16 + i * i * 10 + i * 12; lines += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.5); }
  fl.x(lines, shade(C.sand2, -0.2), 'opacity=".45"');
  floorL.add(fl.out() + `<g transform="translate(300 ${FLOOR + 10})">${sheet().p(c.cut(c.ell(0, -6, 60, 12, 16), 0.4, 5), mix(C.terracotta, C.clay, 0.5)).out()}</g>`);
  // evening dims the room around the lamp
  const dimL = S.layer({ par: 0.4, sh: 1, flat: true, rise: 0 });
  dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.3)}" opacity=".42"/>`);
  dimL.fade(0);
  const lampL = S.layer({ par: 0.42, sh: 3 });
  const gl = lampL.add(lampGlow(EM.JX - 26, 300, 220));
  const lampEl = hanging(lampL, `<g transform="translate(-6 0) scale(1.3)">${hangingLamp(c)}</g>`, { x: EM.JX, y: 300, len: 120 });
  const lamp = { el: lampEl, fl: lampEl.querySelector('.flame'), gl };
  return {
    c, sk, eve, outL, outSun, starOut, wallL, floorL, dimL, lampL, lamp,
    update(time, { lit = 1, sunY = 380, dusk = 0 } = {}) {
      swing(outSun, 520, sunY, time, 0.6, 0.5);
      eve.fade(dusk);
      fade(starOut, dusk);
      dimL.fade(dusk * 0.9);
      swing(lamp.el, EM.JX, 300, time, 0.8, 0.7);
      pose(lamp.fl, { x: 32, y: 36, sx: lit * (1 + (time ? Math.sin(time * 7) * 0.08 : 0)), sy: lit * (1 + (time ? Math.sin(time * 5.3) * 0.12 : 0)) });
      fade(lamp.gl, 0.9 * lit);
    },
  };
}
/** the low table at Emmaus (origin: floor centre) with a jug, a bowl of olives and cups */
export function emmausTable(c, w = 440) {
  const s = sheet();
  const top = -50;
  s.p(c.cut([[-w / 2 + 70, top - 30], [-w / 2 + 64, top - 6], [-w / 2 + 96, top - 6], [-w / 2 + 92, top - 30], [-w / 2 + 98, top - 44], [-w / 2 + 88, top - 50], [-w / 2 + 72, top - 48], [-w / 2 + 64, top - 42]], 0.4, 4), C.pot);
  s.p(c.cut([[w / 2 - 110, top - 2], [w / 2 - 118, top - 14], [w / 2 - 70, top - 14], [w / 2 - 78, top - 2]], 0.3, 4), mix(C.pot, C.clay, 0.4));
  s.p(c.cut(c.circ(w / 2 - 104, top - 16, 5, 8), 0.2, 2) + c.cut(c.circ(w / 2 - 94, top - 18, 5, 8), 0.2, 2) + c.cut(c.circ(w / 2 - 84, top - 16, 5, 8), 0.2, 2), C.olive);
  return lowTable(c, w, 50) + s.out();
}

/* ================================================================== the upper room (John 20's) */
/**
 * The upper room with the Eleven (and those with them): John 20's room, windows shuttered by day, the city by night.
 * spots: the places of the disciples, back row then front row. Returns { RR (room20's handles), PL, crew[], by{} }.
 * who: list of { k, x, y, s, flip } — k is a key of TW or 'cleopas' | 'friend' | a woman's key.
 */
export const ROOMSPOTS = {
  back: [['bartholomew', 440, 702], ['jamesA', 530, 700], ['thaddaeus', 620, 704], ['simonZ', 990, 704], ['matthew', 1080, 700], ['philip', 1170, 702]],
  front: [['andrew', 420, 752], ['thomas', 520, 756], ['peter', 630, 758], ['john', 1070, 756], ['james', 1180, 752]],
};
export const LOOKS = { ...TW, cleopas: CLEOPAS, friend: FRIEND, magd: MAGD, joanna: JOANNA, maryj: MARYJ, susanna: SUSANNA };
export function roomCrew(S, L, list) {
  const c = S.c;
  return list.map(([k, x, y, s], i) => {
    const el = L.add(withFace(person(c, { ...LOOKS[k] }), faceBits(c)));
    return { k, x, y, s: s ?? (y < 720 ? 0.86 : 0.97), flip: x > 800, seed: c.rr(0, 9), i, el, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') };
  });
}
export { lowTable as lowTable2 };
/** the night gathering (24,33–49): the Eleven, the women at the back, the two from Emmaus at the front right */
export const GATHER = [
  ['bartholomew', 430, 700], ['jamesA', 520, 702], ['thaddaeus', 610, 698], ['magd', 700, 700, 0.84], ['joanna', 900, 700, 0.84], ['simonZ', 990, 702], ['matthew', 1080, 700], ['philip', 1170, 702],
  ['andrew', 400, 752], ['thomas', 510, 756], ['peter', 630, 760], ['friend', 950, 758], ['cleopas', 1050, 756], ['john', 1150, 752], ['james', 1250, 750],
];
export const MID = { x: 800, y: 744, s: 1.1 };
/**
 * The upper room at night with everyone gathered (people layer PL); the Lord (hidden, o 0) in the middle with a soft light
 * behind Him (glow: a flat layer behind the people). Returns { RR, PL, crew, by, jesus, glow }.
 */
export function gatherRoom(S, { night = true, jesus = true, skip = [] } = {}) {
  const RR = room20(S, { night });
  const gl = S.layer({ par: 0.5, sh: 0, flat: true });
  const glow = gl.add(`<g opacity="0"><ellipse cx="0" cy="-110" rx="150" ry="190" fill="url(#halo-glow)"/></g>`);
  const PL = S.layer({ par: 0.52, sh: 5 });
  // phone: the room is wider than the screen, so the gathered stand closer round the middle (none sliced by the frame or the thread)
  const list = GATHER.filter((m) => !skip.includes(m[0])).map((m) => S.portrait ? [m[0], Math.round(795 + (m[1] - 825) * 0.6), ...m.slice(2)] : m);
  const crew = roomCrew(S, PL, list.filter((m) => m[2] < 720));
  const J = jesus ? S.puppet(PL.add(person(S.c, { ...CAST.jesus }))) : null;
  roomCrew(S, PL, list.filter((m) => m[2] >= 720)).forEach((m) => crew.push({ ...m, i: crew.length }));
  crew.forEach((m, i) => { m.i = i; m.flip = m.x > MID.x; });
  const by = Object.fromEntries(crew.map((m) => [m.k, m]));
  return { RR, PL, crew, by, jesus: J, glow };
}

/* ================================================================== the Mount of Olives above Bethany */
export const OL = { TOP: [800, 690], CITY: 170, BETH: 1380 };
/**
 * Morning on the Mount of Olives: Jerusalem across the valley at the left, Bethany among its trees down on the right,
 * the hilltop in the middle with a few olives; hanging clouds (their own layer) that part and close.
 * Returns { sk2, hangL, far, land, cl: {L, R, M}, heaven (layer for the light above), PL, fx, fg, update(time) }.
 */
export function olivetSet(S, { skyCols = MORNING, sky2 = HEAVENLY } = {}) {
  const c = makeCutter('lk24-olivet');
  sky(S, skyCols);
  const sk2 = sky(S, sky2, { name: 'sky2', rise: 0 }).layer;
  sk2.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const heaven = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = band(c, { y: 520, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.1), x0: -1400, x1: 3000 });
  far.add(h1.markup + `<g>${walledCity(c, OL.CITY, h1.fn(OL.CITY) + 8, 1.2)}</g>`);
  const land = S.layer({ par: 0.4, sh: 3 });
  const h2fn = c.wave(596, [12, 5], [700, 220]);
  const mount = (x) => h2fn(x) + 60 - Math.max(0, Math.cos(Math.min(1, Math.abs(x - 800) / 460) * PI / 2)) * 130;
  const ls = sheet();
  ls.p(c.ridge(h2fn, -1400, 3000, 1700, 12, 1), C.hillMid);
  ls.p(c.ridge((x) => Math.min(h2fn(x) + 70, mount(x)), -1400, 3000, 1700, 10, 1), C.hillNear);
  // the path down towards the city
  ls.p(c.ribbon(c.qbez([760, 720], [420, 700], [120, 640], 20), (u) => 40 - u * 26, 2), C.sand);
  land.add(ls.out());
  land.add(town(c, { x: OL.BETH, y: 612, n: 6, spread: 240, sc: 0.62 }) + olive(c, OL.BETH - 150, 620, 0.7) + olive(c, OL.BETH + 160, 624, 0.65) + cypress(c, OL.BETH + 40, 606, 100));
  land.add(grass(c, { x0: -1400, x1: 3000, y: 600, fn: (x) => Math.min(h2fn(x) + 70, mount(x)), n: 80, h: 14, color: C.moss }) + olive(c, 560, 690, 0.9) + olive(c, 1070, 684, 0.95) + cypress(c, 650, 668, 110) + flowers(c, { x0: 480, x1: 1140, y: 740, fn: () => c.rr(720, 800), n: 28, h: 16 }));
  const PL = S.layer({ par: 0.4, sh: 5 });
  const fx = S.layer({ par: 0.44, sh: 5 });
  const clouds = S.layer({ par: 0.4, sh: 5 });
  const cl = {
    L: hanging(clouds, cloud(c, 380), { x: 0, y: -1500, len: 900 }),
    R: hanging(clouds, cloud(c, 360), { x: 0, y: -1500, len: 900 }),
    M: hanging(clouds, cloud(c, 300), { x: 0, y: -1500, len: 900 }),
  };
  const fg = S.layer({ par: 0.85, sh: 6 });
  const bank = c.wave(980, [10, 4], [520, 170]);
  fg.add(sheet().p(c.ridge(bank, -1400, 3000, 1800, 14, 1.2), mix(C.sage, C.olive, 0.3)).out() + grass(c, { x0: -1400, x1: 3000, y: 980, fn: bank, n: 60, h: 26, color: C.moss }) + flowers(c, { x0: -1400, x1: 3000, y: 980, fn: bank, n: 18, h: 28 }));
  return { c, sk2, hangL, heaven, far, land, PL, fx, clouds, cl, fg, mount };
}

/* ================================================================== the map of the nations */
/** the cities the Good News reached, on the old map (x, y relative to the map's centre); Jerusalem first */
export const NATIONS = [
  [236, 60], [214, 20], [262, -8], [228, -70], [150, -92], [80, -60], [30, -40], [-40, -70], [-150, -60], [-110, 20], [110, 130], [-20, 120], [300, 40], [310, -60], [190, 150],
];
/**
 * An old parchment map (origin centre, w × h): the Great Sea in the middle, the coasts round it, mountains, rivers
 * in the east; small ink dots for the cities (NATIONS). Jerusalem named. Returns markup.
 */
export function nationsMap(c, w = 760, h = 400) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 14, -h / 2 + 14], [w / 2 - 14, -h / 2 + 14], [w / 2 - 14, h / 2 - 14], [-w / 2 + 14, h / 2 - 14], [-w / 2 + 14, -h / 2 + 16]], 2), C.clay, 'opacity=".5"');
  // the Great Sea
  const sea = [[-340, -10], [-300, -40], [-250, -30], [-200, -8], [-160, -30], [-120, -10], [-80, -34], [-40, -12], [0, -30], [40, -20], [90, -38], [140, -28], [180, -40], [200, 0], [196, 60], [160, 84], [110, 90], [60, 96], [0, 88], [-60, 96], [-120, 84], [-180, 70], [-240, 60], [-300, 70], [-340, 50]];
  s.p(c.cut(sea, 1.4, 7), mix(C.lake, C.parchment, 0.35));
  // the Black Sea to the north, a bit of the Red Sea, the rivers
  s.p(c.cut(c.blob(170, -170, 90, 22, 12, 0.2), 1, 6), mix(C.lake, C.parchment, 0.35));
  s.p(c.cut([[266, 110], [282, 108], [300, 190], [290, 192]], 0.6, 5), mix(C.lake, C.parchment, 0.35));
  s.x(c.ribbon([[330, -150], [320, -80], [350, -20], [360, 60]], 3) + c.ribbon([[240, 20], [238, 60], [244, 100]], 2.2) + c.ribbon([[120, 90], [124, 140], [130, 190]], 3), mix(C.lake2, C.parchment, 0.2));
  // islands and mountains
  s.p(c.cut(c.blob(100, 30, 26, 8, 9, 0.2), 0.5, 4) + c.cut(c.blob(-60, 40, 18, 10, 9, 0.2), 0.5, 4) + c.cut(c.blob(-210, 20, 14, 18, 9, 0.2), 0.5, 4), C.parchment);
  let hills = '';
  [[-260, -120], [-150, -110], [40, -120], [120, -120], [300, -110], [-280, 140], [-120, 150], [30, 160], [320, 140]].forEach(([x, y]) => { hills += c.cut([[x - 18, y + 7], [x, y - 13], [x + 18, y + 7]], 0.4, 5); });
  s.x(hills, shade(C.parchment, -0.14));
  let dots = '';
  NATIONS.forEach(([x, y], i) => { if (i) dots += c.poly(c.circ(x, y, 4, 8)); });
  s.x(dots, C.inkSoft, 'opacity=".6"');
  const [jx, jy] = NATIONS[0];
  s.p(c.cut(c.rect(jx - 11, jy - 9, 22, 13), 0.3, 4) + c.cut([[jx - 13, jy - 9], [jx, jy - 20], [jx + 13, jy - 9]], 0.3, 4), C.clay);
  const txt = `<text x="${jx + 18}" y="${jy + 22}" text-anchor="start" font-family="${FONT}" font-size="19" font-style="italic" fill="${C.inkSoft}">${tr('Jerozolima', 'Jerusalem')}</text>`;
  return s.out() + txt;
}
/** the roads of light from Jerusalem to each city (origin: the map's centre), one path each (.road[data-i]) */
export function nationRoads(c) {
  const [jx, jy] = NATIONS[0];
  return NATIONS.slice(1).map(([x, y], i) => {
    const mx = (jx + x) / 2 + (y - jy) * 0.18, my = (jy + y) / 2 - (x - jx) * 0.12 - 14;
    return `<path class="road" data-i="${i}" d="M${jx} ${jy}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x} ${y}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="${C.sun}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
  }).join('');
}
/** a tiny lamp flame on the map (origin: its foot) */
export function mapLamp(c) {
  return `<circle cy="-6" r="22" fill="url(#warm-glow)"/>${flame1(c, 16)}`;
}

/* ================================================================== choreography helpers */
/** place a hung piece (made with hanging() or a string drawn up from it): k 0 → up in the flies, 1 → at (x, y) */
export function hangK(el, k, x, y, time = 0, i = 0) {
  pose(el, { x, y: lerp(-1500, y, k), r: time ? Math.sin(time * 0.8 + i * 1.7) * 0.9 * k : 0, oy: 0, o: k > 0.002 ? 1 : 0 });
}
/** pop a piece in with a back-ease scale (k 0..1) */
export function popK(el, k, x, y, { s = 1, r = 0 } = {}) {
  pose(el, { x, y, s: Math.max(0.001, k) * s, r, o: k > 0.01 ? 1 : 0 });
}
export { sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt, C, CAST, person, crowdPerson, house, town, cloud, flock };
