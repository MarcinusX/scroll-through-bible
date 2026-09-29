// Luke 17 — the cast and cut-outs of this chapter. Most of it happens on Luke 9's long road to Jerusalem (the same
// road through the hills, the same Samaritan village with its gate, the city far off on its height): the sayings to the
// disciples, the ten lepers and the one who came back, the Pharisees' question, the day of the Son of Man. Between them
// small painted sets fly in for the sayings: the sea and the millstone, a courtyard where one brother wrongs another
// seven times in a day, the lakeside mulberry that is told to go and plant itself in the sea, the farm where a servant
// comes in from the plough to serve his master's supper, the days of Noah, Sodom in the days of Lot, a flat-roofed
// house and a field on the day the Son of Man is revealed, and the bed and the mill in that night. Borrowed: the road,
// its village and the plough (Luke 9), the brothers (Luke 12), the house cut open (Luke 12), the leper's bell and the
// priest's plate (Mark 1), the millstone (Mark 9), the mustard seed under glass (Matthew 17), Noah, the ark, the hand-
// mill and the vulture (Matthew 24), the ox (John 2), the sheep (Mark 6).
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, house, sun, moon, cloud, stars, rock, grass, flowers, olive, cypress, bush, palm, waterBand, waveStrip, reeds } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { es, ease, bump, seg, clamp } from '../../core/anim.js';
import { figure, bake } from '../luke4/lib.js';

export { roadSet, ROAD9, TW9, ROAD_NEAR, ROAD_FAR, ROADDAY, ROADEVE, ROADNIGHT, folk, crowdRows, figure, bake, manO, womanO } from '../luke9/lib.js';
export { kf, moving, hand, headAt, speech, thought, heart, spark, dust, coin, loaf, cup, bowl, jug, wordSlip, addToHead, addToBody, scrap, candle } from '../mark2/lib.js';
export { bubble, nameTag, question, shadowPerson, silhouette, tapeX } from '../mark3/lib.js';
export { voiceRings, sparkle, flame, signpost, bell, priestPlate, LEPER, LEPER_HEALED, flapWings } from '../mark1/lib.js';
export { millstone } from '../mark9/lib.js';
export { child, tallyMarks } from '../matthew18/lib.js';
export { mustardGlass, seedDot } from '../matthew17/lib.js';
export { NOAH, ark, ramp, beast, quern, vulture, fieldPatch, lightMote, silh, tearDrop } from '../matthew24/lib.js';
export { halo, warm, onString, iconTag, darkKnot, dustPuff, behindOf, palm as palmAt, orders, cutHouse, HS, BRO_A, BRO_B, pharisee, eqSign } from '../luke12/lib.js';
export { hangAt } from '../john3/lib.js';
export { jerusalem } from '../mark11/lib.js';
export { ox } from '../john2/lib.js';
export { sheep } from '../mark6/lib.js';
export { crossX, tick } from '../mark6/lib.js';
export { hourglass } from '../mark13/lib.js';
export { tr, es, ease, bump, seg, clamp };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const STRING = 'rgba(74,54,34,.55)';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const DAY = ['#c6ddd9', '#ecebd6', '#f6ead0'];
export const MORNING = ['#cadfdb', '#eee5cc', '#f7ead3'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const EVENING = ['#a69abf', '#eab99c', '#f5d6b0'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const NIGHT = ['#161c42', '#29316a', '#4b5590'];
export const SEA = ['#c4dcdc', '#e9efe0', '#f5ecd4'];
export const STORM = ['#58607c', '#8a91a4', '#b3b3b2'];
export const FIRE = ['#4a2c3c', '#a2503e', '#d98a56'];
export const ASH = ['#8d8790', '#b9aea4', '#d6c7b3'];
export const REVEAL = ['#f1d49a', '#f8e2b4', '#fbeed2'];

/* ================================================================== the cast */
/** the four who walk beside Him on the road (Luke 9's) */
export const FOUR = ['peter', 'andrew', 'john', 'james'];
/** the ten lepers: grey rags, grey skin (Mark 1's look), each a little different; and the same men made clean */
const GREYS = ['#b7b2a6', '#aaa59a', '#bdb6a8', '#a39f97', '#b3ada0', '#aca79d', '#b9b3a5', '#a6a298', '#b0ab9f', '#b5aea2'];
const CLEAN = [C.dustyBlue, C.sageRobe, C.wheatRobe, C.roseRobe, C.linen2, C.tealRobe, C.ochreRobe, C.mauve, C.stone, C.clayMantle];
const HAIRS = [C.hair, C.hair2, C.hair3, C.greyHair];
const SKINS = [C.skin, C.skin2, C.skin3, C.skin4];
/** leper i (0–9), grey or clean; the Samaritan is number 9 */
export function leper(i, clean = false) {
  const style = ['wrap', 'short', 'wrap', 'curly', 'wrap', 'short', 'wrap', 'wrap', 'curly', 'wrap'][i];
  if (i === 9) return clean ? SAMARITAN : SAMARITAN_GREY;
  return clean
    ? { robe: CLEAN[i], mantle: i % 3 === 0 ? C.linen2 : null, hair: HAIRS[i % 4], hairStyle: style, veil: [C.linen2, C.stone, C.ochreRobe][i % 3], beard: i % 2 ? 'short' : 'full', skin: SKINS[i % 4], belt: i % 2 ? C.leather : C.rope }
    : { robe: GREYS[i], mantle: i % 3 === 0 ? shade(GREYS[i], -0.1) : null, hair: C.greyHair, hairStyle: style, veil: shade(GREYS[i], -0.06), beard: i % 2 ? 'short' : 'full', beardColor: '#8f8a80', skin: '#c9bfae', belt: null };
}
/** the one who came back: a Samaritan (a teal-and-ochre striped head-cloth, like the Samaritans of Luke 9 and 10) */
export const SAMARITAN = { robe: mix(C.clay, C.wheatRobe, 0.35), mantle: C.teal2, hair: C.hair3, hairStyle: 'wrap', veil: C.ochre, veil2: C.teal2, beard: 'full', beardColor: C.hair3, skin: C.skin3, belt: C.leather };
export const SAMARITAN_GREY = { robe: '#b4ada1', mantle: '#8f9590', hair: C.greyHair, hairStyle: 'wrap', veil: '#a8a397', veil2: '#8f9590', beard: 'full', beardColor: '#8f8a80', skin: '#c9bfae', belt: null };
/** the servant of the parable and his master */
export const SERVANT = { robe: mix(C.linen2, C.sand2, 0.35), mantle: null, hair: C.hair2, hairStyle: 'wrap', veil: C.stone, veil2: C.clay, beard: 'short', skin: C.skin4, belt: C.rope };
export const SERVANT_GIRT = { ...SERVANT, belt: C.terracotta };
export const MASTER = { robe: C.linen, mantle: mix(C.plumRobe, C.clay, 0.3), mantleArm: true, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.sun };
/** Lot, his wife, their two daughters */
export const LOT = { robe: C.linen2, mantle: mix(C.tealRobe, C.stone, 0.3), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, veil2: C.teal2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };
export const LOTWIFE = { robe: mix(C.plumRobe, C.roseRobe, 0.4), hairStyle: 'veil', veil: C.ochreRobe, veil2: shade(C.ochreRobe, -0.14), hair: C.hair3, skin: C.skin3, beard: 'none', belt: C.sun };
export const DAUGHTERS = [
  { robe: C.skyVeil, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.hair2, skin: C.skin2, beard: 'none', belt: C.ochre },
  { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair3, skin: C.skin2, beard: 'none', belt: C.clay },
];
/** the salt colours (Lot's wife) */
export const SALT = '#f1ede4', SALT2 = '#ddd7cb';

/* ================================================================== small helpers */
/** a string from the flies to a hung piece (dy above its origin) */
export const strung = (inner, dy = 0, len = 2400, dx = [0]) => `<g>${dx.map((x) => `<path d="M${x} ${-len}V${-dy}" stroke="${STRING}" stroke-width="1.3" fill="none"/>`).join('')}${inner}</g>`;
/** place a hung piece: k 0 → in the flies, 1 → at (x, y), with a gentle swing */
export function flyIn(el, k, x, y, time = 0, i = 0, amp = 0.8) {
  pose(el, { x, y: lerp(-1500, y, k), r: Math.sin(time * 0.7 + i * 1.7) * amp * k, oy: 0, o: k > 0.002 ? 1 : 0 });
}
/** pop a piece in with a scale (k 0 → hidden) */
export function pop(el, k, x, y, { s = 1, r = 0 } = {}) { pose(el, { x, y, s: Math.max(0.001, k) * s, r, o: k > 0.01 ? 1 : 0 }); }
/** a still person as its own cut-out markup (arms baked) — for figures that only move as a whole */
export const still = (c, o, { flip = false, armF = 0, armB = 0, head = 0 } = {}) => `<g>${figure(c, o, { x: 0, y: 0, s: 1, flip, armF, armB, head })}</g>`;
/** a jagged dark stone of stumbling; origin: its foot */
export function stumbleStone(c, r = 16) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -r * 0.7, r, r * 0.72, 9, 0.32).map(([x, y]) => [x, Math.min(y, 0)]), 1.2, 4), mix(C.storm2, C.soilDark, 0.5));
  s.x(c.cut([[-r * 0.5, -r * 0.9], [-r * 0.1, -r * 1.25], [r * 0.3, -r * 1.0], [-r * 0.1, -r * 0.8]], 0.4, 4), mix(C.storm, C.stone2, 0.3), 'opacity=".6"');
  return s.out();
}
/** a basket of figs (origin: base centre) and a loose fig */
export function figBasket(c, w = 56) {
  const s = sheet();
  let f = '';
  for (let i = 0; i < 7; i++) f += c.cut(c.circ(-w * 0.34 + (i % 4) * w * 0.22 + (i > 3 ? w * 0.1 : 0), -w * 0.5 - (i > 3 ? 8 : 0), 7, 10), 0.3, 3);
  s.p(f, mix(C.plumRobe, C.soilDark, 0.25));
  s.p(c.cut([[-w / 2, -w * 0.5], [w / 2, -w * 0.5], [w * 0.38, 0], [-w * 0.38, 0]], 0.5, 5), C.basket);
  s.x(c.ribbon([[-w * 0.45, -w * 0.32], [w * 0.45, -w * 0.32]], 2.4) + c.ribbon([[-w * 0.41, -w * 0.14], [w * 0.41, -w * 0.14]], 2.4), shade(C.basket, -0.25), 'opacity=".7"');
  return s.out();
}
export function fig1(c, r = 7) {
  return sheet().p(c.cut(c.circ(0, -r, r, 10), 0.3, 3), mix(C.plumRobe, C.soilDark, 0.25)).x(c.ribbon([[0, -r * 2], [1, -r * 2.5]], 1.6), C.moss).out();
}
/** a little flame on its own (origin: its foot); with a soft warm glow behind when glow */
export function tinyFlame(c, h = 22, glow = true) {
  return `${glow ? `<circle cy="${-h * 0.45}" r="${h * 1.7}" fill="url(#warm-glow)"/>` : ''}<path d="M0 0C${-h * 0.34} ${-h * 0.22} ${-h * 0.28} ${-h * 0.62} 0 ${-h}C${h * 0.28} ${-h * 0.62} ${h * 0.34} ${-h * 0.22} 0 0Z" fill="${C.lampFlame}"/><path d="M0 ${-h * 0.1}C${-h * 0.14} ${-h * 0.24} ${-h * 0.14} ${-h * 0.46} 0 ${-h * 0.66}C${h * 0.14} ${-h * 0.46} ${h * 0.14} ${-h * 0.24} 0 ${-h * 0.1}Z" fill="#fff4d2"/>`;
}
/** a small clay lamp holding a flame (origin: the lamp's foot) */
export function clayLamp(c) {
  const s = sheet().p(c.cut([[-14, 0], [-16, -6], [-9, -11], [7, -11], [15, -8], [20, -10], [15, -3], [7, 1], [-9, 1]], 0.3, 3), C.pot);
  return `${s.out()}<g class="fl" transform="translate(19 -9)">${tinyFlame(c, 16, false)}</g>`;
}
/** a grey wisp of smoke (a flame gone out); origin: its foot */
export function smokeWisp(c, h = 40) {
  return `<path d="${c.ribbon(c.cbez([0, 0], [-10, -h * 0.3], [10, -h * 0.6], [-4, -h], 12), (u) => 4 - u * 3)}" fill="${mix(C.stone2, C.storm, 0.3)}" opacity=".8"/>`;
}
/** a day card for a string of days (grey, or golden with a tiny haloed figure); origin: top centre */
export function dayCard(c, gold = false, w = 52, h = 66) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.4, 6), gold ? C.haloRim : mix(C.stone2, C.storm, 0.2));
  s.p(c.cut(c.rect(-w / 2 + 5, 5, w - 10, h - 10), 0.3, 6), gold ? C.halo : mix(C.stone, C.stone2, 0.4));
  let inner = '';
  if (gold) inner = `<circle cx="0" cy="${h * 0.42}" r="${w * 0.55}" fill="url(#halo-glow)"/><g transform="translate(0 ${h - 10}) scale(.21)">${person(makeCutter('lk17-daycard'), { ...CAST.jesus, halo: true })}</g>`;
  else inner = `<path d="${c.cut(c.circ(0, h * 0.4, w * 0.18, 12), 0.2, 3)}" fill="${mix(C.stone2, C.storm, 0.35)}"/>`;
  return `${s.out()}${inner}`;
}
/** a pointing paper hand on a stick (a "look, here!"); origin: foot of the stick; dir 1 points right */
export function pointer(c, text, dir = 1) {
  const s = sheet();
  s.p(c.cut(c.rect(-3, -120, 6, 122), 0.3, 6), C.wood2);
  const w = 26 + text.length * 9.5;
  const pts = dir > 0 ? [[-w / 2, -126], [w / 2, -126], [w / 2 + 16, -110], [w / 2, -94], [-w / 2, -94]] : [[w / 2, -126], [-w / 2, -126], [-w / 2 - 16, -110], [-w / 2, -94], [w / 2, -94]];
  s.p(c.cut(pts, 0.4, 6), C.wood3);
  return `${s.out()}<text x="${dir * 4}" y="-104" text-anchor="middle" font-family="${FONT}" font-size="19" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** a label on a paper strip (no string); origin centre */
export function strip(c, text, { size = 22, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || size * (0.5 * text.length + 1.6), hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.4, 6), fill);
  return `${s.out()}<text x="0" y="${size * 0.34}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a falling ember of fire and sulphur (origin centre) */
export function ember(c, r = 5) {
  return `<path d="${c.poly([[0, -r * 2.6], [r * 0.9, -r * 0.4], [r * 0.7, r * 0.6], [0, r], [-r * 0.7, r * 0.6], [-r * 0.9, -r * 0.4]])}" fill="${C.sunDeep}"/><path d="${c.poly([[0, -r * 1.2], [r * 0.45, 0], [0, r * 0.55], [-r * 0.45, 0]])}" fill="${C.lampFlame}"/>`;
}

/* ================================================================== the puppets on the road */
/** Jesus and the four as puppets in layer L (Jesus last, in front) */
export function roadFour(S, L, c, who = FOUR) {
  const TW = FOURLOOK;
  const ds = who.map((k, i) => ({ k, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, TW[k]))) }));
  const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
  return { ds, jesus };
}
const FOURLOOK = { peter: CAST.peter, andrew: CAST.andrew, john: CAST.john, james: CAST.james, thomas: CAST.thomas, matthew: CAST.matthew };

/* ================================================================== the sea (the millstone) */
/**
 * A cliff of the shore on the left (grass on top, feet at SEA17.TOP), the open sea to the right: its surface at SURF and,
 * cut away below it, the water getting deeper and darker down to a sandy floor with weed. Returns { back (the water
 * behind things that sink), surf (a strip of the surface in front of them), act (on the cliff), update(time) }.
 */
export const SEA17 = { TOP: 520, EDGE: 830, SURF: 574, FLOOR: 772 };
export function seaSet(S, { skyCols = SEA } = {}) {
  const c = makeCutter('lk17-sea');
  sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 150, len: 800 });
  const cls = [[560, 130, 170], [1040, 100, 130]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const { SURF, FLOOR, EDGE, TOP } = SEA17;
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: SURF - 60, amps: [10, 4, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.lavender, 0.2), x0: 1500, x1: 2600, bottom: SURF + 20 }).markup);
  // the water, cut away: bands getting deeper down to the floor
  const back = S.layer({ par: 0.3, sh: 2 });
  const w = sheet();
  w.p(c.cut([[EDGE - 200, SURF], [2600, SURF], [2600, 1800], [EDGE - 200, 1800]], 0.4, 20), mix(C.lake, C.skyBlue, 0.3));
  w.p(c.cut([[EDGE - 200, SURF + 50], [2600, SURF + 44], [2600, 1800], [EDGE - 200, 1800]], 0.8, 16), C.lake2);
  w.p(c.cut([[EDGE - 200, SURF + 104], [2600, SURF + 112], [2600, 1800], [EDGE - 200, 1800]], 0.8, 16), C.lake3);
  w.p(c.cut([[EDGE - 200, SURF + 150], [2600, SURF + 146], [2600, 1800], [EDGE - 200, 1800]], 0.8, 16), mix(C.lakeDeep, C.night, 0.2));
  const ffn = c.wave(FLOOR, [7, 3], [300, 90]);
  w.p(c.ridge(ffn, EDGE - 200, 2600, 1800, 12, 1), mix(C.sand2, C.lakeDeep, 0.45));
  let weed = '';
  for (let i = 0; i < 18; i++) { const x = c.rr(EDGE, 2000), y = ffn(x) + 4; weed += c.ribbon(c.qbez([x, y], [x + c.rr(-18, 18), y - 24], [x + c.rr(-12, 12), y - c.rr(34, 64)], 8), (u) => 6 - u * 5); }
  w.p(weed, mix(C.moss2, C.lakeDeep, 0.35));
  let rk = '';
  for (let i = 0; i < 7; i++) { const x = c.rr(EDGE + 40, 1900); rk += c.cut(c.blob(x, ffn(x) + 2, c.rr(14, 30), c.rr(8, 14), 9, 0.25), 0.8, 5); }
  w.p(rk, mix(C.rock3, C.lakeDeep, 0.4));
  back.add(w.out());
  const deepL = S.layer({ par: 0.3, sh: 3 });
  // the surface: a strip of waves in front of what sinks
  const surf = S.layer({ par: 0.3, sh: 3, pad: 140 });
  surf.add(waveStrip(c, { y: SURF + 4, len: 110, amp: 8, x0: EDGE - 260, x1: 2700, bottom: SURF + 24, color: mix(C.lake, C.skyBlue, 0.15) }));
  // the cliff (in front of the water)
  const cliff = S.layer({ par: 0.4, sh: 4 });
  const cl = sheet();
  const cp = [[-900, TOP - 6], [300, TOP - 10], [560, TOP - 6], [720, TOP], [EDGE - 10, TOP + 6], [EDGE + 14, TOP + 40], [EDGE, TOP + 120], [EDGE + 34, TOP + 190], [EDGE + 20, TOP + 260], [EDGE + 50, 1800], [-900, 1800]];
  cl.p(c.cut(cp, 1.4, 10), mix(C.rock, C.sand2, 0.4));
  cl.p(c.cut([[-900, TOP - 6], [300, TOP - 10], [560, TOP - 6], [720, TOP], [EDGE - 10, TOP + 6], [EDGE - 24, TOP + 24], [-900, TOP + 20]], 0.8, 10), mix(C.hillNear, C.sand, 0.25));
  let st = '';
  for (let i = 0; i < 12; i++) { const y = TOP + 50 + i * 28; st += c.ribbon([[c.rr(-400, EDGE - 300), y], [EDGE + c.rr(-10, 20), y + c.rr(4, 12)]], 2); }
  cl.x(st, shade(C.rock2, -0.1), 'opacity=".4"');
  let bl = '';
  for (let i = 0; i < 6; i++) bl += c.cut(c.blob(c.rr(-300, EDGE - 80), c.rr(TOP + 80, TOP + 280), c.rr(30, 60), c.rr(16, 30), 10, 0.2), 0.8, 6);
  cl.x(bl, mix(C.rock2, C.sand2, 0.3), 'opacity=".6"');
  cliff.add(cl.out() + grass(c, { x0: -800, x1: EDGE - 30, y: TOP, n: 30, h: 13, color: C.olive }) + olive(c, 170, TOP + 4, 0.9) + bush(c, 300, TOP + 2, 60, C.sage, C.moss));
  const act = S.layer({ par: 0.4, sh: 5 });
  const fx = S.layer({ par: 0.4, sh: 5 });
  return {
    c, back, deepL, cliff, surf, act, fx, ffn,
    update(time) {
      swing(sunEl, 1260, 150, time, 1, 0.6);
      cls.forEach((k) => swing(k.el, k.x + Math.sin(time * 0.1 + k.i) * 16, k.y, time, 1.1, 0.6, k.i));
      surf.shift(time ? (time * 14) % 110 : 0, 0);
    },
  };
}

/* ================================================================== the courtyard of the two brothers */
/**
 * A village courtyard: the back wall of the house with its door on the left, a stretch of plastered wall on the right
 * (where the tally is kept, at YARD.TALLY), a fig tree, a bench, a water jar; the sky above with the sun on its string
 * (sun(k): k 0 → morning in the east (left) … 1 → evening in the west (right)).
 */
export const YARD = { GY: 712, WALL: 470, TALLY: [930, 520] };
export const YARD_EVE = ['#a69abf', '#eab99c', '#f5d6b0'];
export function yardSet(S, { skyCols = MORNING } = {}) {
  const c = makeCutter('lk17-yard');
  sky(S, skyCols);
  const eve = sky(S, YARD_EVE, { name: 'eve', rise: 0 });
  eve.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 36), { x: 300, y: 200, len: 900 });
  const far = S.layer({ par: 0.1, sh: 2 });
  const hw = hillsWith(c, { y: 430, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 10, treeColor: C.sage, treeH: 18 });
  far.add(band(c, { y: 400, amps: [16, 7, 3], lens: [1000, 380, 130], color: C.hillFar }).markup + hw.markup + town(c, { x: 1250, y: hw.fn(1250) + 14, n: 5, spread: 240, sc: 0.5 }));
  const wallL = S.layer({ par: 0.3, sh: 4 });
  const w = sheet();
  const { WALL, GY } = YARD;
  // the house on the left (door), the long wall on the right
  w.p(c.cut([[-900, WALL - 110], [560, WALL - 110], [560, GY], [-900, GY]], 0.8, 12), mix(C.plaster, C.dune, 0.2));
  w.p(c.cut([[-900, WALL - 124], [580, WALL - 124], [580, WALL - 108], [-900, WALL - 108]], 0.4, 10), C.roof);
  w.p(c.cut([[560, WALL], [2500, WALL + 8], [2500, GY], [560, GY]], 0.8, 12), mix(C.plaster, C.sand, 0.3));
  w.p(c.cut([[556, WALL - 10], [2500, WALL - 2], [2500, WALL + 10], [556, WALL + 2]], 0.4, 10), mix(C.stone2, C.sand2, 0.4));
  let patch = '';
  for (let i = 0; i < 10; i++) patch += c.cut(c.blob(c.rr(-300, 1600), c.rr(WALL + 30, GY - 60), c.rr(18, 40), c.rr(8, 18), 10, 0.2), 0.6, 6);
  w.x(patch, C.plaster2, 'opacity=".55"');
  // the door, a small window
  w.p(c.cut([[300, GY], [300, GY - 130], ...c.arc(340, GY - 130, 40, 30, PI, 2 * PI, 8), [380, GY]], 0.4, 6), mix(C.soilDark, C.wood2, 0.3));
  w.p(c.cut(c.rect(96, WALL - 70, 40, 30), 0.3, 5), mix(C.soilDark, C.night, 0.3));
  wallL.add(w.out());
  // a fig tree over the wall at the right, a bench
  const tr_ = sheet();
  tr_.p(c.ribbon(c.qbez([1320, GY], [1300, 560], [1340, 440], 10), (u) => 18 - u * 10), C.wood2);
  tr_.p(c.cut(c.blob(1330, 400, 120, 70, 16, 0.18), 0.9, 7), C.moss);
  tr_.p(c.cut(c.blob(1270, 430, 70, 44, 12, 0.18), 0.8, 6) + c.cut(c.blob(1400, 430, 64, 40, 12, 0.18), 0.8, 6), C.leaf);
  wallL.add(tr_.out());
  const floor = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, GY - 6], [2500, GY - 6], [2500, 1800], [-900, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.35));
  let flag = '';
  for (let y = GY + 12; y < 1100; y += 40) for (let x = -800 + (Math.round(y / 40) % 2) * 46; x < 2400; x += 92) flag += c.cut(c.rect(x, y, 84, 32), 0.4, 6);
  fl.x(flag, shade(mix(C.sand, C.stone, 0.35), -0.06), 'opacity=".5"');
  floor.add(fl.out());
  floor.add(`<g transform="translate(470 ${GY + 4})">${sheet().p(c.cut(c.rect(-70, -40, 140, 10), 0.3, 5), C.wood).p(c.cut(c.rect(-62, -30, 8, 30), 0.2, 4) + c.cut(c.rect(54, -30, 8, 30), 0.2, 4), C.wood2).out()}</g>`);
  const act = S.layer({ par: 0.45, sh: 5 });
  const fx = S.layer({ par: 0.45, sh: 5 });
  return {
    c, eve, wallL, floor, act, fx, sunEl,
    update(time, { sunK = 0.2, eveK = 0 } = {}) {
      eve.layer.fade(eveK);
      const a = PI * (1 - sunK);
      swing(sunEl, 800 + Math.cos(a) * 560, 330 - Math.sin(a) * 210, time, 1, 0.6);
    },
  };
}

/* ================================================================== the lakeside hill and the mulberry tree */
/**
 * A hillside above the lake: the far shore, the lake (its surface at LAKE.Y), the near bank with the road along it,
 * and a great mulberry tree by the road (the tree itself is a separate cut-out, see mulberry()). Returns handles.
 */
export const LAKE = { Y: 510, GY: 714, TREE: [560, 650], SEA: [1150, 548] };
export function lakeSet(S, { skyCols = DAY } = {}) {
  const c = makeCutter('lk17-lake');
  sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 150, len: 800 });
  const cls = [[480, 140, 180], [960, 110, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
  const far = S.layer({ par: 0.08, sh: 2 });
  const fh = hillsWith(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.lavender, 0.15), trees: 8, treeColor: mix(C.sage, C.hillFar, 0.4), treeH: 14 });
  far.add(fh.markup + town(c, { x: 1320, y: fh.fn(1320) + 10, n: 5, spread: 220, sc: 0.4 }));
  const lakeL = S.layer({ par: 0.16, sh: 2, pad: 120 });
  lakeL.add(waterBand(c, { y: LAKE.Y - 40, color: C.lake, foamN: 18 }).markup);
  const lake2 = S.layer({ par: 0.2, sh: 2, pad: 120 });
  lake2.add(waveStrip(c, { y: LAKE.Y + 30, len: 90, amp: 5, color: mix(C.lake, C.lake2, 0.5) }));
  const treeL = S.layer({ par: 0.22, sh: 4 });
  const front = S.layer({ par: 0.24, sh: 2, pad: 120 });
  front.add(waveStrip(c, { y: LAKE.Y + 70, len: 110, amp: 6, color: C.lake2, bottom: LAKE.Y + 200 }));
  const G = S.layer({ par: 0.4, sh: 3 });
  const gfn = (x) => 604 - Math.max(0, x - 700) * 0.03 + Math.sin(x * 0.006) * 8;
  const gs = sheet();
  gs.p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sand, 0.25));
  gs.p(c.ribbon([[-900, 760], [300, 736], [700, 722], [1100, 716], [2500, 700]], 70, 2), mix(C.sand, C.cream, 0.35));
  G.add(gs.out() + grass(c, { x0: -800, x1: 2400, y: 610, fn: gfn, n: 40, h: 12, color: C.moss }) + reeds(c, 1320, gfn(1320) + 10, 9, 70) + flowers(c, { x0: -600, x1: 2200, y: 610, fn: gfn, n: 14, h: 14 }));
  const pit = S.layer({ par: 0.4, sh: 1, flat: true });
  const act = S.layer({ par: 0.45, sh: 5 });
  const fx = S.layer({ par: 0.45, sh: 5 });
  return {
    c, lakeL, lake2, treeL, front, G, gfn, pit, act, fx,
    update(time) {
      swing(sunEl, 1260, 150, time, 1, 0.6);
      cls.forEach((k) => swing(k.el, k.x + Math.sin(time * 0.1 + k.i) * 16, k.y, time, 1.1, 0.6, k.i));
      if (time) { lake2.shift((time * 9) % 90, 0); front.shift(-(time * 11) % 110, 0); }
    },
  };
}
/** the mulberry tree: trunk, crown with dark berries, and (separately) its roots; origin: foot of the trunk */
export function mulberry(c, h = 250) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-12, -h * 0.4], [-30, -h * 0.62], [-20, -h * 0.66], [-4, -h * 0.5], [6, -h * 0.72], [18, -h * 0.7], [10, -h * 0.4], [16, 0]], 0.8, 7), C.wood2);
  const lv = sheet();
  lv.p(c.cut(c.blob(-10, -h * 0.82, h * 0.5, h * 0.3, 16, 0.16), 1, 7), C.moss);
  lv.p(c.cut(c.blob(-h * 0.24, -h * 0.72, h * 0.28, h * 0.18, 12, 0.18), 0.9, 6) + c.cut(c.blob(h * 0.24, -h * 0.76, h * 0.26, h * 0.18, 12, 0.18), 0.9, 6), C.leaf);
  let b = '';
  for (let i = 0; i < 22; i++) b += c.cut(c.ell(c.rr(-h * 0.5, h * 0.44), c.rr(-h * 1.0, -h * 0.6), 3.4, 4.6, 8), 0.2, 2);
  lv.x(b, mix(C.plumRobe, C.soilDark, 0.45));
  const roots = sheet();
  let r = '';
  for (let i = 0; i < 7; i++) { const a = -0.9 + i * 0.3; r += c.ribbon(c.qbez([0, -4], [Math.sin(a) * 30, 20], [Math.sin(a) * 58, 30 + c.rr(0, 30)], 8), (u) => 7 - u * 6); }
  roots.p(r, C.wood3);
  roots.p(c.cut(c.blob(0, 6, 34, 14, 10, 0.3), 0.8, 4), mix(C.soil, C.dune, 0.4));
  return { tree: s.out() + lv.out(), roots: roots.out() };
}

/* ================================================================== the farm of the parable (the servant) */
/**
 * The master's farm at the end of the day: on the left the field (furrows) with the fold and the sheep on the slope
 * behind, on the right the master's house, cut open — a room with the low table, the oven, a shelf and a lamp; its
 * front wall can lift away. Coordinates: FARM.GY ground line; the room's floor FARM.FLOOR.
 */
export const FARM = { GY: 706, X0: 700, X1: 1200, FLOOR: 700, ROOF: 420, DOOR: 736, TABLE: 960, OVEN: 1120 };
export function farmSet(S, { skyCols = GOLDEN, eveCols = DUSK } = {}) {
  const c = makeCutter('lk17-farm');
  sky(S, skyCols);
  const eve = sky(S, eveCols, { name: 'eve', rise: 0 });
  eve.layer.fade(0);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
  starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 360, n: 70 }));
  starL.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 380, y: 200, len: 900 });
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.lavender, 0.2) }).markup);
  const mid = S.layer({ par: 0.18, sh: 3 });
  const mh = hillsWith(c, { y: 520, amps: [18, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 18 });
  // the fold on the slope: a low stone wall ring
  const fold = sheet();
  fold.p(c.cut([[140, 560], [150, 540], [320, 536], [330, 556], [320, 566], [150, 568]], 0.8, 6), mix(C.stone2, C.sand2, 0.3));
  mid.add(mh.markup + fold.out() + olive(c, 520, mh.fn(520) + 12, 0.7));
  const sheepL = S.layer({ par: 0.2, sh: 2 });
  const G = S.layer({ par: 0.36, sh: 3 });
  const gfn = (x) => 610 + Math.sin(x * 0.005) * 8;
  const gs = sheet();
  gs.p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sand, 0.3));
  // the field: dark ploughed strips from the left up to the house
  const fp = [[-900, 640], [-200, 630], [400, 624], [600, 630], [650, 700], [600, 800], [-900, 820]];
  gs.p(c.cut(fp, 1, 12), mix(C.soil, C.dune, 0.5));
  let fur = '';
  for (let k = 0; k < 7; k++) fur += c.ribbon([[-900, 646 + k * 24], [610 - k * 4, 640 + k * 24]], 3);
  gs.x(fur, shade(mix(C.soil, C.dune, 0.5), -0.2), 'opacity=".55"');
  G.add(gs.out() + grass(c, { x0: 660, x1: 2400, y: 620, fn: gfn, n: 20, h: 12, color: C.moss }));
  // the house: back wall, roof, floor, oven, shelf, a niche lamp
  const H = S.layer({ par: 0.42, sh: 4 });
  const { X0, X1, FLOOR, ROOF } = FARM;
  const b = sheet();
  const wall = mix(C.plaster, C.dune, 0.2);
  b.p(c.cut([[X0, ROOF], [X1, ROOF], [X1, FLOOR + 4], [X0, FLOOR + 4]], 0.8, 12), wall);
  let patch = '';
  for (let i = 0; i < 7; i++) patch += c.cut(c.blob(c.rr(X0 + 30, X1 - 30), c.rr(ROOF + 40, FLOOR - 60), c.rr(18, 36), c.rr(8, 18), 10, 0.2), 0.6, 6);
  b.x(patch, C.plaster2, 'opacity=".6"');
  b.p(c.cut(c.rect(X0, ROOF + 20, X1 - X0, 12), 0.4, 10), C.wood2);
  b.p(c.cut([[880, 580], [880, 530], ...c.arc(906, 530, 26, 22, PI, 2 * PI, 8), [932, 580]], 0.4, 5), shade(wall, -0.3));
  b.p(c.cut(c.rect(1030, 540, 130, 8), 0.3, 5), C.wood2);
  b.p(c.cut([[1040, 540], [1038, 514], [1050, 506], [1062, 514], [1060, 540]], 0.3, 4) + c.cut([[1080, 540], [1076, 520], [1088, 510], [1106, 520], [1102, 540]], 0.3, 4), C.pot);
  b.p(c.cut([[X0 - 10, FLOOR - 8], [X1 + 10, FLOOR - 8], [X1 + 26, FLOOR + 40], [X0 - 26, FLOOR + 40]], 0.6, 10), mix(C.clay, C.sand2, 0.5));
  H.add(b.out());
  // the oven (a clay dome with a mouth)
  const ov = sheet();
  ov.p(c.cut([[-46, 0], ...c.arc(0, 0, 46, 60, PI, 2 * PI, 14), [46, 0]], 0.6, 6), C.clay);
  ov.p(c.cut([[-16, 0], ...c.arc(0, -4, 16, 22, PI, 2 * PI, 8), [16, 0]], 0.3, 4), mix(C.soilDark, C.night, 0.2));
  H.add(`<g transform="translate(${FARM.OVEN} ${FLOOR})">${ov.out()}</g>`);
  // the roof slab, side walls
  const f = sheet();
  f.p(c.cut([[X0 - 30, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 20, ROOF + 6], [X0 - 30, ROOF + 6]], 0.8, 10), mix(C.clay, C.sand2, 0.4));
  f.p(c.cut([[X0 - 26, ROOF - 30], [X0, ROOF - 30], [X0, FLOOR + 40], [X0 - 32, FLOOR + 40]], 0.6, 10) + c.cut([[X1, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 26, FLOOR + 40], [X1, FLOOR + 40]], 0.6, 10), C.stone);
  H.add(f.out());
  const glowL = S.layer({ par: 0.42, sh: 0, flat: true });
  const glow = glowL.add(`<g opacity="0"><ellipse cx="930" cy="600" rx="260" ry="170" fill="url(#warm-glow)"/></g>`);
  const inL = S.layer({ par: 0.44, sh: 5 });
  const act = S.layer({ par: 0.45, sh: 5 });
  // the front wall with the door (lifts away)
  const frontL = S.layer({ par: 0.47, sh: 6 });
  const fw = sheet();
  const dx0 = FARM.DOOR - 10, dx1 = FARM.DOOR + 56;
  fw.p(c.cut([[X0 - 30, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 20, FLOOR + 40], [X0 - 30, FLOOR + 40]], 0.8, 12) + c.hole([[dx0, FLOOR + 38], [dx0, 580], ...c.arc((dx0 + dx1) / 2, 580, 33, 28, PI, 2 * PI, 8), [dx1, FLOOR + 38]], 0.4, 6), mix(C.plaster, C.sand, 0.2));
  let fpch = '';
  for (let i = 0; i < 9; i++) fpch += c.cut(c.blob(c.rr(X0, X1), c.rr(ROOF + 20, FLOOR), c.rr(18, 40), c.rr(8, 18), 10, 0.2), 0.6, 6);
  fw.x(fpch, C.plaster2, 'opacity=".55"');
  fw.p(c.cut(c.rect(1000, 500, 70, 56), 0.4, 5), C.wood);
  fw.p(c.cut([[X0 - 30, ROOF - 30], [X1 + 20, ROOF - 30], [X1 + 20, ROOF - 18], [X0 - 30, ROOF - 18]], 0.4, 10), C.roof);
  const front = frontL.add(`<g>${fw.out()}<path d="M${X0 + 20} -2400V${ROOF - 30}M${X1 - 20} -2400V${ROOF - 30}" stroke="${STRING}" stroke-width="1.3" fill="none"/></g>`);
  const fx = S.layer({ par: 0.47, sh: 5 });
  return {
    c, eve, starL, sunEl, sheepL, G, H, glow, inL, act, frontL, front, fx,
    update(time, { eveK = 0, nightK = 0, open = 0 } = {}) {
      eve.layer.fade(eveK);
      starL.fade(nightK);
      swing(sunEl, 380 - eveK * 60, 200 + eveK * 420, time, 1, 0.6);
      pose(front, { x: 0, y: -open * 1300, o: open < 0.999 ? 1 : 0 });
    },
  };
}
/** a plough (an ard): origin at the tip of the share; the beam runs forward (+x) to the yoke (Luke 9's) */
export function plough(c) {
  const s = sheet();
  s.p(c.ribbon([[-4, -2], [60, -34], [120, -52]], 6), C.wood2);
  s.p(c.cut([[-14, -6], [8, -2], [0, 4], [-18, 2]], 0.3, 3), C.stone2);
  s.p(c.ribbon([[-6, -2], [-30, -60], [-40, -82]], 6), C.wood);
  s.p(c.ribbon([[-44, -84], [-30, -80]], 5), C.wood3);
  return s.out();
}
/** a low supper table with a dish, bread and a cup (origin: floor centre) */
export function supperTable(c, w = 150) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -40, w, 10), 0.3, 5), C.wood);
  s.p(c.cut(c.rect(-w / 2 + 8, -30, 8, 30), 0.2, 4) + c.cut(c.rect(w / 2 - 16, -30, 8, 30), 0.2, 4), C.wood2);
  return s.out();
}
/** a shepherd's crook (origin: its foot) */
export function crook(c, h = 150) {
  return sheet().p(c.ribbon([[0, 0], [2, -h], ...c.arc(12, -h, 10, 12, PI, 2 * PI, 6).slice(1)], 4), C.wood3).out();
}

/* ================================================================== Sodom */

/**
 * Sodom on the plain by the Salt Sea, cut always with the same scissors: the mountains of Moab and the salt sea shining
 * far off on the right, the walled city in the middle with its arched gate (SODOM.GATE), houses and towers behind the
 * wall; the road runs out of the gate to the left, up into the hills of Zoar. The city is drawn twice — whole, and
 * charred — so the fire can cross-fade one into the other (burn(k)). skies: warm, fire, ash (fade(fire, ash)).
 */
export const SODOM = { GY: 706, GATE: [860, 690], X0: 600, X1: 1260, ROAD: [[860, 700], [700, 716], [540, 724], [400, 712], [250, 680], [120, 640], [-40, 610]] };
export const SODOM_SKY = ['#d6d7c9', '#f1dcb2', '#f6ddb4'];
import { tint as tint13 } from '../mark13/lib.js';
export function sodomSet(S, { fire = true, ash = true, burnt = 0 } = {}) {
  const c = makeCutter('lk17-sodom');
  sky(S, SODOM_SKY);
  const fireSky = fire ? sky(S, FIRE, { name: 'fire', rise: 0 }) : null;
  const ashSky = ash ? sky(S, ASH, { name: 'ash', rise: 0 }) : null;
  if (fireSky) fireSky.layer.fade(0);
  if (ashSky) ashSky.layer.fade(0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 42), { x: 1240, y: 150, len: 800 });
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 430, amps: [26, 10, 4], lens: [700, 260, 110], color: mix(C.duskViolet, C.hillFar, 0.45) }).markup);
  const sea = sheet().p(c.cut([[980, 520], [2600, 512], [2600, 560], [980, 566]], 0.6, 16), mix(C.lake, C.cream, 0.45)).x(c.ribbon([[1100, 530], [1400, 528]], 2) + c.ribbon([[1250, 545], [1600, 542]], 2), C.cream, 'opacity=".8"');
  far.add(sea.out());
  const mid = S.layer({ par: 0.18, sh: 3 });
  const mfn = (x) => 560 + Math.sin(x * 0.004 + 1) * 14 - Math.max(0, 500 - x) * 0.16;
  mid.add(sheet().p(c.ridge(mfn, -900, 2500, 1800, 12, 1), mix(C.dune, C.sand2, 0.45)).out());
  // the city: towers and roofs behind, the wall with its gate
  const city = (burn) => {
    const s = sheet();
    const hs = [];
    for (let i = 0; i < 14; i++) { const x = SODOM.X0 + 20 + i * 44 + c.rr(-8, 8), h = c.rr(60, 130), w = c.rr(40, 60); hs.push([x, h, w]); }
    hs.forEach(([x, h, w], i) => { s.p(c.cut(c.rect(x, 600 - h, w, h + 10), 0.4, 6), i % 3 ? C.plaster : mix(C.plaster, C.sand2, 0.4)); s.p(c.cut(c.rect(x - 3, 600 - h - 6, w + 6, 7), 0.3, 5), C.roof); s.x(c.poly(c.rect(x + w * 0.4, 600 - h + 16, w * 0.2, 14)), C.soilDark); });
    s.p(c.cut([[980, 600], [980, 440], [1030, 440], [1030, 600]], 0.4, 6), mix(C.plaster2, C.sand2, 0.3));
    s.p(c.cut([[970, 440], [1005, 400], [1040, 440]], 0.4, 6), C.terracotta);
    const [gx, gy] = SODOM.GATE;
    const gate = [[gx - 36, gy + 4], [gx - 36, gy - 70], ...c.arc(gx, gy - 70, 36, 30, PI, 2 * PI, 10), [gx + 36, gy + 4]];
    s.p(c.cut([[SODOM.X0, gy + 6], [SODOM.X0, 590], [SODOM.X1, 584], [SODOM.X1, gy + 6]], 0.6, 10) + c.hole(gate, 0.3, 6), mix(C.sand2, C.stone2, 0.35));
    let cren = '';
    for (let x = SODOM.X0; x < SODOM.X1; x += 34) cren += c.cut(c.rect(x, 574, 20, 18), 0.3, 4);
    s.p(cren, mix(C.sand2, C.stone2, 0.35));
    s.p(c.cut([[gx - 50, 600], [gx - 46, 560], [gx + 46, 560], [gx + 50, 600]], 0.4, 6), mix(C.stone2, C.sand2, 0.2));
    const m = `<path d="${c.poly(gate)}" fill="${mix(C.soilDark, C.night, 0.2)}"/>` + s.out();
    return burn ? tint13(m, '#2a2030', 0.7) : m;
  };
  const cityL = S.layer({ par: 0.3, sh: 4 });
  const whole = cityL.add(`<g>${city(false)}</g>`);
  const charred = cityL.add(`<g opacity="0">${city(true)}</g>`);
  const G = S.layer({ par: 0.36, sh: 3 });
  const gs = sheet();
  gs.p(c.cut([[-900, 686], [2500, 682], [2500, 1800], [-900, 1800]], 0.8, 20), mix(C.sand, C.dune, 0.3));
  gs.p(c.ribbon(SODOM.ROAD, (u) => 44 - u * 20, 2), mix(C.sand, C.cream, 0.4));
  G.add(gs.out() + grass(c, { x0: -800, x1: 600, y: 690, n: 14, h: 10, color: C.olive }));
  const act = S.layer({ par: 0.42, sh: 5 });
  const fx = S.layer({ par: 0.42, sh: 5 });
  return {
    c, fireSky, ashSky, hangL, sunEl, far, mid, cityL, whole, charred, G, act, fx,
    update(time, { fireK = 0, ashK = 0, burn = burnt, sunY = 150 } = {}) {
      if (fireSky) fireSky.layer.fade(fireK);
      if (ashSky) ashSky.layer.fade(ashK);
      swing(sunEl, 1240, sunY + fireK * 900 + ashK * 900, time, 1, 0.6);
      pose(whole, { o: 1 - burn });
      pose(charred, { o: burn });
    },
  };
}

/* ================================================================== the night house (the bed) */
/** two sleepers under one blanket on a mat (origin: middle of the mat) — split: .mat, the two heads */
export function bedMat(c, w = 230) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 4, 12], [-w / 2 + 4, 12]], 0.4, 8), C.basket);
  s.x(c.ribbon([[-w / 2 + 6, 5], [w / 2 - 6, 5]], 1.4), shade(C.basket, -0.25), 'opacity=".7"');
  s.p(c.cut(c.blob(-w / 2 + 30, -6, 30, 9, 10, 0.1), 0.4, 4), C.skyVeil);
  return s.out();
}

/* ================================================================== reveal: the sky rolled back */
/** half of a cloud curtain that covers the sky and draws back (dir -1 the left half, 1 the right); origin: the seam */
export function cloudCurtain(c, dir = -1, { w = 1600, h = 520, col = mix(C.storm, C.stone2, 0.45) } = {}) {
  const s = sheet();
  const seam = [];
  for (let y = -h; y <= h; y += 36) seam.push([c.rr(-26, 26) + Math.sin(y * 0.02) * 20, y]);
  const pts = dir < 0 ? [[-w, -h], ...seam, [-w, h]] : [[w, -h], [w, h], ...seam.slice().reverse()];
  s.p(c.cut(pts, 1.4, 10), col);
  let puffs = '';
  for (let i = 0; i < 18; i++) puffs += c.cut(c.blob(dir * c.rr(60, w * 0.9), c.rr(-h * 0.9, h * 0.9), c.rr(40, 90), c.rr(24, 44), 10, 0.2), 0.8, 6);
  s.p(puffs, shade(col, 0.1));
  let seamPuffs = '';
  seam.forEach(([x, y], i) => { if (i % 2 === 0) seamPuffs += c.cut(c.blob(x + dir * 18, y, 34, 26, 9, 0.2), 0.6, 5); });
  s.p(seamPuffs, shade(col, 0.05));
  return s.out();
}

/* ================================================================== the ten lepers (on Luke 9's road, by the village) */
/** where the ten stand "at a distance" (back row 0–4, front row 5–8, the Samaritan 9 nearest), and the village gate */
export const LEP = {
  SPOT: [[1024, 664], [1064, 662], [1104, 666], [1144, 662], [1184, 666], [1040, 692], [1084, 694], [1128, 690], [1172, 694], [990, 696]],
  GATE: [1044, 646],
  JX: 700, JY: 718,
};
/** the scale of a figure standing at y near the village (gate 0.58 … front 0.86) */
export const lepS = (y) => lerp(0.58, 0.86, clamp((y - 646) / (696 - 646)));
/**
 * The ten as still cut-outs in layer L, facing left (towards Him): for each, grey standing, grey calling (arms up),
 * grey walking and clean walking (both facing right, towards the gate). Returns [{ i, stand, call, walk, clean }].
 */
export function tenLepers(S, L, c, { call = true, walk = true } = {}) {
  const pc = makeCutter('lk17-ten');
  return Array.from({ length: 10 }, (_, i) => {
    const g = leper(i, false), k = leper(i, true);
    return {
      i,
      seed: pc.rr(0, 9),
      stand: L.add(still(pc, g, { flip: true, armF: 20 + (i % 3) * 8, armB: 6, head: 6 })),
      call: call ? L.add(still(pc, g, { flip: true, armF: 70 + (i % 2) * 20, armB: 140 + (i % 3) * 12, head: -10 })) : null,
      walk: walk ? L.add(still(pc, g, { flip: false, armF: 10, armB: 4, head: 4 })) : null,
      clean: walk ? L.add(still(pc, k, { flip: false, armF: 14, armB: 6, head: -2 })) : null,
    };
  });
}
/** a grey flake of the leprosy (peels off and blows away); origin centre */
export function flake(c, i = 0) {
  return `<path d="${c.cut(c.blob(0, 0, c.rr(3.5, 6.5), c.rr(3, 5.5), 8, 0.3), 0.4, 3)}" fill="${i % 2 ? '#a88f8c' : '#8f8a8e'}"/>`;
}
