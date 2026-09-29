// Matthew 23 — the discourse against the scribes and Pharisees, in the Temple courts of Jerusalem.
// The court itself is Mark 12's (the same sanctuary, porch and paving, cut with the same scissors), the Pharisees
// and scribes are Mark 3's and Mark 12's, the city is Mark 11's. Our own pieces: the seat of Moses, a Pharisee and
// a scribe who walk through all seven woes (with a phylactery that can swell and fringes that can grow), the dark
// woe-tags numbered I–VII, the heavy bundles, the paper-doll chain of brothers, the see-saw of the proud and the
// humble, the herbs and the three great weights of the Law, the strainer and the gnat, the cup clean outside and
// foul within, the whitewashed tombs, the monuments of the prophets, the measure of the fathers, the frieze from
// Abel to Zechariah, and the hen gathering her chicks under her wings.
// Everything returns SVG markup cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing, lerp } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, olive, cypress, rock, bush, town } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { pharisee as phLook } from '../mark3/lib.js';

export {
  templeCourt, COURT, DAY, EVENING, LOOK, voiceRings, kf, moving, headAt, bubble, nameTag, strip, sparkle, spark, coin, coinStack,
  littleHouse, longScroll, honourSeat, purse, altar, puff, kingdomGate, gateDoor, throne, footstool, maskOnStick, lepton, addToHead, addToBody,
  withFace, faceBits, sanctuary, dust, scrollOpen, wordSlip, man, woman, shadowPerson, bigKey, glory, disc, hang2, flame,
} from '../mark12/lib.js';
export { jerusalem, clothBanner, frond, lamb, cityWall, sanctuary as templeModel } from '../mark11/lib.js';
export { balance, phylactery as phylBand, globe, lightCrown } from '../mark8/lib.js';
export { handAt, silhouette } from '../mark3/lib.js';
export { camel, walkCamel } from '../mark1/lib.js';
export { lowTable, bowl, cup, jug, loaf, garland } from '../mark2/lib.js';
export { viper } from '../matthew3/lib.js';
export { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { throng, kid, manOf, womanOf } from '../matthew11/lib.js';
export { blindBand } from '../john5/lib.js';
export { stick } from '../matthew9/lib.js';
export { say, bang, face, frown, withBits, doll, basinBowl, ewer, towel } from '../mark10/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const NOON = ['#cfe0dc', '#eee6cf', '#f7ebd4'];
export const DUSK = ['#b9a3c4', '#e7a98f', '#f4cfa2'];
export const GLOOM = ['#6d6a86', '#a597a2', '#d3c1b0'];
export const NIGHTFALL = ['#39407a', '#8a7a9e', '#d9a88f'];
export const OLD = ['#d8c9a8', '#ead8b4', '#f2e2c2'];       // the sepia of the old days (the fathers)

/* ================================================================== the cast */
/** the Pharisee of the woes: cream robe, blue prayer-shawl, grey beard (Mark 3's first Pharisee) */
export const PH = phLook(null, 0);
/** the scribe beside him: plum robe, pale mantle (Mark 3's first scribe), without the scroll in hand */
export const scribes = (i) => ({
  robe: [C.plumRobe, C.tealRobe, C.mauve][i % 3], mantle: [C.linen2, C.stone, C.cream][i % 3], skin: [C.skin, C.skin2, C.skin3][i % 3],
  hair: C.hair3, hairStyle: 'wrap', veil: [C.linen2, C.stone, C.cream][i % 3], veil2: [C.plumRobe, C.teal2, C.mauve][i % 3],
  beard: 'full', beardColor: [C.greyHair, C.hair3, C.hair2][i % 3], belt: C.ochre,
});
export const SC = scribes(0);
/** more Pharisees for the court (opts) */
export const pharisees = (i) => phLook(null, i);

/**
 * the phylactery on the forehead (head coords: face r≈18 at 0,0, looking +x), in its own group so it can
 * swell: <g data-part="phyl"> pivots at the top of the forehead.
 */
export function phyl(c) {
  const band_ = sheet().p(c.ribbon(c.arc(0, 0, 19, 19, PI * 1.08, PI * 1.9, 10), 3), C.ink).out();
  const box = sheet().p(c.cut([[-5, -9], [5, -9], [5, 0], [-5, 0]], 0.2, 3), C.ink).x(c.ribbon([[-4, -4.5], [4, -4.5]], 0.9), '#6b5a4a').out();
  return `${band_}<g transform="translate(7 -17) rotate(20)"><g data-part="phyl">${box}</g></g>`;
}
/**
 * long fringes (tzitzit) on the corners of the mantle, in body coords (stand). The short tassels are always there;
 * <g data-part="fringe"> is a long trailing fringe that grows along the floor (scale it on x from 0).
 */
export function fringes(c, col = C.dustyBlue) {
  let d = '', t = '';
  [[-38, -12], [-30, -9]].forEach(([x, y]) => {
    d += c.ribbon([[x, y], [x - 1, y + 7]], 1.4);
    t += c.cut([[x - 3, y + 6], [x + 2, y + 6], [x + 2.5, y + 11], [x - 3.5, y + 11]], 0.3, 3);
  });
  const short = sheet().x(d, col).p(t, col).out();
  let L = '', knots = '';
  [0, 1, 2].forEach((i) => {
    const y0 = -1 + i * 0.8;
    L += c.ribbon([[0, y0 - 6], [-4, y0], [-60, y0 + 0.6], [-150 - i * 16, y0]], 2.4);
    for (let x = -24; x > -140 - i * 16; x -= 24) knots += c.cut(c.circ(x - i * 4, y0, 3.2, 6), 0.2, 2);
  });
  const long = sheet().x(L, col).p(knots, shade(col, -0.15)).out();
  return `${short}<g transform="translate(-34 -4)"><g data-part="fringe" transform="scale(0 1)">${long}</g></g>`;
}
/** a Pharisee / scribe puppet with phylactery (and fringes); o: look, extra: person opts */
export function vain(c, o, extra = {}) {
  let m = person(c, { ...o, ...extra });
  m = m.replace('</g></g><g class="armF"', `${phyl(c)}</g></g><g class="armF"`);
  if ((extra.pose || 'stand') === 'stand') m = m.replace('<g class="head"', `${fringes(c, o.veil2 || C.dustyBlue)}<g class="head"`);
  return m;
}
/** find the swell/grow parts of a vain() puppet */
export const parts = (el) => ({ phyl: el.querySelector('[data-part="phyl"]'), fringe: el.querySelector('[data-part="fringe"]') });

/** the man who swears (Mt 23,16–22) */
export const SWEARER = { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.leather };
/** a man or woman of the crowd (men never veiled) */
export function folk(c, isMan = null, extra = {}) {
  const o = crowdPerson(c);
  const m = isMan === null ? o.hairStyle !== 'veil' : isMan;
  if (m && o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  if (!m) { o.hairStyle = 'veil'; o.beard = 'none'; }
  return { ...o, ...extra };
}
/** a child (boy / girl) of the crowd */
export function child(c, girl = false, extra = {}) {
  return girl
    ? { robe: c.pick([C.roseRobe, C.skyVeil, C.wheatRobe]), hairStyle: 'veil', veil: c.pick([C.blushVeil, C.linen2]), skin: c.pick([C.skin, C.skin2]), hair: C.hair2, beard: 'none', ...extra }
    : { robe: c.pick([C.sageRobe, C.tealRobe, C.ochreRobe]), hairStyle: c.pick(['short', 'curly']), hair: c.pick([C.hair, C.hair2, C.hair3]), skin: c.pick([C.skin, C.skin2, C.skin3]), beard: 'none', belt: C.rope, ...extra };
}
/** the Twelve as seen in Matthew's earlier chapters (Mark 3's looks) */
export { TWELVE } from '../mark3/lib.js';

/* ================================================================== the woe-tags */
const WOE = mix(C.curtain2, C.plumRobe, 0.45);
/** a dark hanging tag "Biada!" with a Roman numeral; origin at the string hole */
export function woeTag(c, n) {
  const s = sheet();
  s.p(c.cut([[-44, 0], [44, 0], [54, 14], [54, 104], [-54, 104], [-54, 14]], 0.5, 6), WOE);
  s.p(c.cut([[-46, 10], [46, 10], [48, 18], [48, 98], [-48, 98], [-48, 18]], 0.3, 6), shade(WOE, -0.18));
  s.x(c.poly(c.circ(0, 7, 3.6, 8)), C.cream);
  s.x(c.ribbon([[-36, 62], [36, 61]], 1.4), C.sun, 'opacity=".7"');
  const w = tr('Biada', 'Woe');
  return `${s.out()}<text x="0" y="50" text-anchor="middle" font-family="${FONT}" font-size="28" font-style="italic" fill="${C.cream}">${w}</text><text x="0" y="90" text-anchor="middle" font-family="${FONT}" font-size="24" font-weight="600" fill="${C.sun}">${n}</text>`;
}
export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
/** a dark woe-tag on a string that drops in at t0 and rises away at t1; returns updater(t, time) */
export function woeDrop(L, c, n, { x = 1180, y = 150, len = 900 } = {}) {
  const el = hanging(L, woeTag(c, ROMAN[n]), { x, y: -600, len });
  return (k, time, o = 1) => pose(el, { x, y: lerp(-420, y, k), r: time ? Math.sin(time * 0.9 + n) * 2 : 0, o: k > 0.01 ? o : 0 });
}

/* ================================================================== the seat of Moses */
/** a carved stone double seat on a dais, the tablets of the Law on its high back; origin: base centre */
export function mosesSeat(c, w = 190) {
  const s = sheet();
  const st = mix(C.rock, C.clay, 0.2), st2 = mix(C.rock2, C.clay, 0.22);
  // the dais, two steps
  s.p(c.cut([[-w / 2 - 40, 0], [-w / 2 - 40, -20], [w / 2 + 40, -20], [w / 2 + 40, 0]], 0.5, 8), st2);
  s.p(c.cut([[-w / 2 - 18, -20], [-w / 2 - 18, -40], [w / 2 + 18, -40], [w / 2 + 18, -20]], 0.5, 8), shade(st2, 0.12));
  // the high back with its rounded top
  s.p(c.cut([[-w / 2, -40], [-w / 2, -210], ...c.arc(0, -210, w / 2, 46, PI, 2 * PI, 16), [w / 2, -210], [w / 2, -40]], 0.6, 8), st);
  // the two carved tablets on the back
  const tb = mix(C.stone, C.cream, 0.3);
  [[-30, -206], [30, -206]].forEach(([x, y]) => {
    s.p(c.cut([[x - 24, y + 60], [x - 24, y], ...c.arc(x, y, 24, 20, PI, 2 * PI, 8), [x + 24, y], [x + 24, y + 60]], 0.3, 5), tb);
  });
  let ln = '';
  [[-30, -206], [30, -206]].forEach(([x, y]) => { for (let i = 0; i < 5; i++) ln += c.ribbon([[x - 15, y + 4 + i * 10], [x + 15 - c.rr(0, 6), y + 4 + i * 10]], 1.4); });
  s.x(ln, shade(tb, -0.45), 'opacity=".75"');
  s.x(c.ribbon([[-w / 2, -210], ...c.arc(0, -210, w / 2, 46, PI, 2 * PI, 16), [w / 2, -210]], 3), C.sun, 'opacity=".8"');
  // arms and the seat slab
  s.p(c.cut([[-w / 2 - 14, -40], [-w / 2 - 14, -120], [-w / 2 + 16, -124], [-w / 2 + 16, -40]], 0.4, 6) + c.cut([[w / 2 - 16, -40], [w / 2 - 16, -124], [w / 2 + 14, -120], [w / 2 + 14, -40]], 0.4, 6), shade(st, -0.06));
  s.p(c.cut([[-w / 2 - 6, -94], [w / 2 + 6, -94], [w / 2 + 2, -80], [-w / 2 - 2, -80]], 0.4, 6), shade(st2, -0.05));
  s.p(c.cut([[-w / 2 + 4, -80], [w / 2 - 4, -80], [w / 2 - 8, -40], [-w / 2 + 8, -40]], 0.4, 6), shade(st, -0.12));
  // lion-paw carving and a gilt rosette
  s.x(c.poly(c.star(0, -236, 9, 4, 8, 0)), C.sun);
  s.x(c.ribbon(c.arc(0, -210, w / 2 - 8, 38, PI * 1.05, PI * 1.95, 14), 2), shade(st, -0.15), 'opacity=".7"');
  return s.out();
}
/** the seat's y where a sitter's feet go (relative to the seat's base) and the seat surface height */
export const SEAT = { FEET: -40, SIT: -40 };

/* ================================================================== burdens */
/** a heavy bundle tied with ropes, rule-scrolls poking out; origin: bottom centre */
export function bundle(c, w = 110, h = 80, col = mix(C.basket, C.wood3, 0.45)) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -h / 2, w / 2, h / 2, 14, 0.12).map(([x, y]) => [x, Math.min(y, 0)]), 0.9, 6), col);
  // scrolls poking out of the top
  let sc = '';
  for (let i = 0; i < 4; i++) { const x = -w * 0.28 + i * w * 0.18; sc += c.cut([[x - 5, -h + 10], [x - 3, -h - 16 - (i % 2) * 10], [x + 5, -h - 16 - (i % 2) * 10], [x + 5, -h + 10]], 0.2, 3); }
  s.p(sc, C.parchment);
  s.p(c.ribbon([[-w / 2 + 6, -h * 0.35], [w / 2 - 6, -h * 0.42]], 5) + c.ribbon([[-w * 0.08, -h + 4], [w * 0.05, -2]], 5) + c.ribbon([[-w / 2 + 12, -h * 0.72], [w / 2 - 14, -h * 0.66]], 4), C.rope);
  s.x(c.ribbon(c.arc(0, -h * 0.5, w * 0.36, h * 0.3, 0.2, PI - 0.2, 8), 1.6), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/** a big stone weight with an icon and a word on it; origin: bottom centre */
export function greatWeight(c, word, icon, { w = 150, h = 110, col = mix(C.rock2, C.rock3, 0.55) } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 10, -h + 18], [-w / 4, -h], [w / 4, -h], [w / 2 - 10, -h + 18], [w / 2, 0]], 1, 7), col);
  s.p(c.cut(c.ell(0, -h - 4, 18, 9, 12), 0.3, 4) + c.cut(c.ell(0, -h - 4, 10, 4, 10), 0.2, 3).replace(/^M/, 'M'), shade(col, -0.2));
  s.x(c.cut([[-w / 2 + 12, -10], [-w / 2 + 18, -h + 24], [-w / 2 + 30, -h + 22], [-w / 2 + 26, -12]], 0.4, 5), shade(col, 0.2), 'opacity=".6"');
  return `${s.out()}<g transform="translate(0 ${-h * 0.62})">${icon}</g><text x="0" y="${-h * 0.2}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.cream}">${word}</text>`;
}
/** icons for the three weights: justice (scales), mercy (open hands with a heart), faith (a flame) */
export function virtueIcon(c, kind, col = C.cream) {
  const s = sheet();
  if (kind === 'justice') {
    s.p(c.ribbon([[0, -22], [0, 14]], 3) + c.ribbon([[-20, -14], [20, -14]], 3), col);
    s.p(c.cut([[-28, 0], [-12, 0], [-14, 5], [-26, 5]], 0.2, 3) + c.cut([[12, 0], [28, 0], [26, 5], [14, 5]], 0.2, 3), col);
    s.x(c.ribbon([[-20, -14], [-26, 0]], 1) + c.ribbon([[-20, -14], [-14, 0]], 1) + c.ribbon([[20, -14], [14, 0]], 1) + c.ribbon([[20, -14], [26, 0]], 1), col);
    s.p(c.cut(c.rect(-10, 13, 20, 4), 0.2, 3), col);
  } else if (kind === 'mercy') {
    const r = 11, pts = [];
    for (let i = 0; i < 24; i++) { const a = (i / 24) * PI * 2; pts.push([16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16 - 8]); }
    s.p(c.cut(pts, 0.2, 3), C.jesusMantle);
    s.p(c.cut([[-26, 4], [-10, 14], [0, 10], [10, 14], [26, 4], [22, 14], [8, 20], [-8, 20], [-22, 14]], 0.3, 3), col);
  } else {
    s.p(`M0 14C-12 6 -12 -6 0 -24C12 -6 12 6 0 14Z`, C.lampFlame);
    s.x(`M0 10C-5 5 -5 -2 0 -10C5 -2 5 5 0 10Z`, '#fff4d2');
  }
  return s.out();
}

/* ================================================================== paper dolls: "you are all brothers" */
/** a chain of paper dolls holding hands, cut from one folded strip; origin: middle of the feet line */
export function dollChain(c, n = 6, { w = 44, h = 92, col = C.cream } = {}) {
  const one = (x) => {
    const p = [];
    p.push([x - w * 0.18, 0], [x - w * 0.2, -h * 0.38], [x - w * 0.5, -h * 0.5], [x - w * 0.5, -h * 0.58], [x - w * 0.22, -h * 0.62]);
    p.push(...c.arc(x, -h * 0.78, w * 0.19, h * 0.13, PI * 0.6, PI * 2.4, 12));
    p.push([x + w * 0.22, -h * 0.62], [x + w * 0.5, -h * 0.58], [x + w * 0.5, -h * 0.5], [x + w * 0.2, -h * 0.38], [x + w * 0.18, 0], [x + 3, 0], [x, -h * 0.28], [x - 3, 0]);
    return p;
  };
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut(one((i - (n - 1) / 2) * w), 0.3, 4);
  let folds = '';
  for (let i = 0; i < n - 1; i++) { const x = (i - (n - 1) / 2) * w + w / 2; folds += c.ribbon([[x, -h * 0.58], [x, -h * 0.5]], 0.8); }
  return sheet().p(d, col).x(folds, shade(col, -0.25), 'opacity=".6"').out();
}

/* ================================================================== the see-saw of the proud and the humble */
/** a long plank on a stone fulcrum; parts: { base, plank } (plank centred on the pivot, length len) */
export function seesaw(c, len = 520) {
  const base = sheet();
  base.p(c.cut([[-46, 0], [-12, -74], [12, -74], [46, 0]], 0.6, 6), mix(C.stone2, C.rock2, 0.3));
  base.p(c.cut(c.circ(0, -74, 11, 12), 0.3, 4), C.sun);
  const plank = sheet();
  plank.p(c.cut([[-len / 2, -6], [len / 2, -6], [len / 2, 8], [-len / 2, 8]], 0.5, 10), C.wood3);
  plank.x(c.ribbon([[-len / 2 + 6, 1], [len / 2 - 6, 1]], 1.4), shade(C.wood3, -0.25), 'opacity=".6"');
  plank.p(c.cut(c.rect(-len / 2 - 2, -14, 14, 22), 0.3, 4) + c.cut(c.rect(len / 2 - 12, -14, 14, 22), 0.3, 4), C.wood2);
  return { base: base.out(), plank: plank.out() };
}

/* ================================================================== painted street (the woes' flats) */
/** a flat painted backdrop of a Jerusalem street: houses, an arch, a market stall; origin world */
export function streetFlat(c, { gy = 640, x0 = -900, x1 = 2500, wall = mix(C.plaster2, C.sand, 0.35) } = {}) {
  const s = sheet();
  let hs = '', wins = '', roofs = '';
  for (let x = x0; x < x1; x += c.rr(90, 150)) {
    const w = c.rr(80, 140), h = c.rr(170, 290);
    hs += c.cut(c.rect(x, gy - h, w, h + 4), 0.5, 8);
    roofs += c.cut(c.rect(x - 4, gy - h - 6, w + 8, 8), 0.3, 5);
    for (let k = 0; k < 2; k++) if (c.chance(0.7)) wins += c.cut([[x + 18 + k * (w - 50), gy - h + 40], [x + 18 + k * (w - 50), gy - h + 70], [x + 34 + k * (w - 50), gy - h + 70], [x + 34 + k * (w - 50), gy - h + 40]], 0.2, 3);
  }
  s.p(hs, wall).p(roofs, shade(wall, -0.12)).x(wins, mix(C.soilDark, wall, 0.45));
  return s.out();
}

/* ================================================================== words and webs */
/** a golden slip of the Law with a glow (the good word they read out); origin centre */
export function goldSlip(c, w = 40) {
  const s = sheet().p(c.cut([[-w / 2, -8], [w / 2, -9], [w / 2 + 1, 8], [-w / 2 - 1, 9]], 0.4, 6), mix(C.halo, C.cream, 0.3));
  let d = '', x = -w / 2 + 5;
  while (x < w / 2 - 6) { const l = c.rr(4, 10); d += c.ribbon([[x, c.rr(-1, 1)], [Math.min(x + l, w / 2 - 5), c.rr(-1, 1)]], 1.6); x += l + 3; }
  s.x(d, shade(C.ochre, -0.3), 'opacity=".7"');
  return `<circle r="${w * 0.9}" fill="url(#warm-glow)" opacity=".7"/>${s.out()}`;
}
/** a cobweb spun in a corner: spokes and a spiral; origin: the hub */
export function cobweb(c, r = 46, col = '#f7f1e3') {
  let d = '';
  const n = 7, a0 = -PI * 0.1, a1 = PI * 1.1;
  for (let i = 0; i < n; i++) { const a = a0 + ((a1 - a0) * i) / (n - 1); d += c.ribbon([[0, 0], [Math.cos(a) * r, -Math.sin(a) * r]], 1); }
  for (let k = 1; k <= 4; k++) {
    const rr = (r * k) / 4.6;
    const pts = [];
    for (let i = 0; i < n; i++) { const a = a0 + ((a1 - a0) * i) / (n - 1); pts.push([Math.cos(a) * rr, -Math.sin(a) * rr]); }
    for (let i = 0; i < n - 1; i++) d += c.ribbon(c.qbez(pts[i], [(pts[i][0] + pts[i + 1][0]) * 0.42, (pts[i][1] + pts[i + 1][1]) * 0.42], pts[i + 1], 4), 0.9);
  }
  return `<path d="${d}" fill="${col}" opacity=".9"/>`;
}
/** a little spider on its thread (origin: the spider; the thread goes up) */
export function spider(c) {
  const s = sheet().p(c.cut(c.circ(0, 0, 5, 10), 0.2, 2), C.ink).p(c.cut(c.circ(0, -6, 3, 8), 0.2, 2), C.ink);
  let legs = '';
  [-1, 1].forEach((d) => { for (let i = 0; i < 4; i++) legs += c.ribbon([[0, -1 + i * 1.5], [d * 7, -5 + i * 3], [d * 10, 1 + i * 3]], 0.9); });
  return `<path d="M0 -8V-900" stroke="rgba(74,54,34,.5)" stroke-width="1"/>${s.out()}<path d="${legs}" fill="${C.ink}"/>`;
}

/* ================================================================== the places of honour */
/** the couch of honour at the head of a feast: a dais, a cushioned couch, a garland over it; origin: base centre */
export function honourCouch(c, w = 150) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 20, 0], [-w / 2 - 20, -26], [w / 2 + 20, -26], [w / 2 + 20, 0]], 0.5, 7), mix(C.wood2, C.clay, 0.3));
  s.p(c.cut([[-w / 2, -26], [-w / 2, -84], [-w / 2 + 16, -90], [-w / 2 + 16, -46], [w / 2, -46], [w / 2, -26]], 0.5, 6), C.wood);
  s.p(c.cut(c.blob(4, -52, w / 2 - 6, 11, 12, 0.08), 0.5, 5), C.curtain);
  s.p(c.cut(c.blob(-w / 2 + 26, -74, 18, 13, 10, 0.12), 0.4, 4), C.sun);
  s.x(c.ribbon([[-w / 2 + 8, -52], [w / 2 - 8, -52]], 2), C.sun, 'opacity=".8"');
  return s.out();
}
/** the ark of the scrolls in a synagogue wall: a niche with a curtain and rolled scrolls; origin: base centre */
export function arkNiche(c, w = 120, h = 190) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 14, 0], [-w / 2 - 14, -h], ...c.arc(0, -h, w / 2 + 14, 40, PI, 2 * PI, 14), [w / 2 + 14, -h], [w / 2 + 14, 0]], 0.5, 8), mix(C.stone, C.cream, 0.3));
  s.p(c.cut([[-w / 2, -10], [-w / 2, -h + 4], ...c.arc(0, -h + 4, w / 2, 30, PI, 2 * PI, 14), [w / 2, -h + 4], [w / 2, -10]], 0.4, 8), mix(C.soilDark, C.wood2, 0.4));
  let sc = '';
  for (let i = 0; i < 4; i++) sc += c.cut(c.rect(-w / 2 + 14 + i * 26, -h + 30, 16, 110), 0.3, 5);
  s.p(sc, C.parchment);
  s.p(c.cut([[-w / 2 + 2, -h - 4], [w / 2 - 2, -h - 4], [w / 2 - 6, -h + 60], [0, -h + 42], [-w / 2 + 6, -h + 60]], 0.5, 6), C.plumRobe);
  s.x(c.poly(c.star(0, -h - 10, 9, 4, 6, 0)), C.sun);
  return s.out();
}
/** the "first chairs": a raised stone bench of three seats facing the room, the first the highest; origin: base centre */
export function firstChairs(c) {
  const s = sheet();
  const st = mix(C.stone2, C.clay, 0.15);
  [[-70, 70], [0, 90], [70, 120]].forEach(([x, h]) => {
    s.p(c.cut([[x - 30, 0], [x - 30, -h], [x - 22, -h - 10], [x + 22, -h - 10], [x + 30, -h], [x + 30, 0]], 0.4, 6), st);
    s.p(c.cut(c.rect(x - 34, -52, 68, 12), 0.3, 5), shade(st, -0.12));
  });
  s.p(c.cut(c.blob(70, -56, 26, 7, 10, 0.1), 0.3, 4), C.curtain);
  s.x(c.poly(c.star(70, -110, 7, 3, 5, 0)), C.sun);
  return s.out();
}
/** an interior back wall (plaster, a dividing pillar at x = mid, a tiled floor); origin world */
export function roomFlat(c, { gy = 650, mid = 800, wall = mix(C.plaster, C.parchment, 0.4), top = -1400 } = {}) {
  const s = sheet();
  s.p(c.cut([[-900, top], [2500, top], [2500, gy + 4], [-900, gy + 4]], 0.6, 16), wall);
  let win = '';
  [300, 560, 1040, 1300].forEach((x) => { win += c.cut([[x - 22, 400], [x - 22, 320], ...c.arc(x, 320, 22, 22, PI, 2 * PI, 8), [x + 22, 400]], 0.3, 5); });
  s.x(win, mix(C.skyBlue, wall, 0.3));
  s.p(c.cut([[mid - 34, top], [mid + 34, top], [mid + 34, gy + 4], [mid - 34, gy + 4]], 0.5, 12), mix(C.stone2, wall, 0.4));
  s.p(c.cut([[-900, gy], [2500, gy], [2500, 1700], [-900, 1700]], 0.6, 16), mix(C.clay, C.sand, 0.55));
  let tl = '';
  for (let y = gy + 26; y < 1100; y += 30 + (y - gy) * 0.3) tl += c.ribbon([[-900, y], [2500, y]], 1.3);
  s.x(tl, shade(mix(C.clay, C.sand, 0.55), -0.18), 'opacity=".6"');
  return s.out();
}
/** a market stall with a striped awning and produce; origin: bottom centre */
export function stall(c, w = 170) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 6, -150, 8, 150), 0.3, 5) + c.cut(c.rect(w / 2 - 14, -150, 8, 150), 0.3, 5), C.wood2);
  const aw = [[-w / 2 - 6, -170], [w / 2 + 6, -176], [w / 2 + 8, -140]];
  for (let x = w / 2 + 8; x > -w / 2 - 6; x -= 24) aw.push(...c.arc(x - 12, -140, 12, 8, 0, PI, 4));
  s.p(c.cut(aw, 0.4, 6), C.cream);
  let st = '';
  for (let x = -w / 2; x < w / 2; x += 48) st += c.cut([[x, -140], [x + 6, -170], [x + 26, -171], [x + 22, -140]], 0.3, 4);
  s.x(st, C.terracotta, 'opacity=".8"');
  s.p(c.cut(c.rect(-w / 2, -54, w, 54), 0.4, 6), C.wood);
  s.p(c.cut(c.blob(-w / 4, -60, 28, 11, 9, 0.2), 0.3, 4) + c.cut(c.blob(w / 5, -60, 30, 12, 9, 0.2), 0.3, 4), C.wheat2);
  let fr = '';
  for (let i = 0; i < 7; i++) fr += c.cut(c.circ(-w / 4 + c.rr(-20, 20), -68 - c.rr(0, 8), 5, 8), 0.2, 3);
  s.p(fr, C.apricot);
  return s.out();
}

/* ================================================================== oaths: the gold, the gift, the cord */
/** golden Temple vessels: a tall gilt jar and a shallow bowl on a little stand; origin: base centre */
export function goldVessels(c) {
  const s = sheet();
  const g = C.sun, g2 = shade(C.sun, -0.15);
  s.p(c.cut([[-40, 0], [-36, -30], [36, -30], [40, 0]], 0.4, 5), mix(C.wood2, C.clay, 0.3));
  s.p(c.cut([[-26, -30], [-32, -58], [-24, -84], [-12, -92], [-14, -104], [2, -104], [0, -92], [10, -84], [16, -58], [10, -30]], 0.4, 5), g);
  s.x(c.ribbon([[-28, -60], [14, -60]], 2.4) + c.ribbon([[-24, -80], [8, -80]], 1.8), g2, 'opacity=".8"');
  s.p(c.cut([[12, -40], [44, -40], [38, -30], [18, -30]], 0.3, 4), g2);
  s.x(c.poly(c.star(-8, -70, 6, 2.4, 4, 0.3)), C.star);
  return `<circle cy="-60" r="70" fill="url(#warm-glow)" opacity=".7"/>${s.out()}`;
}
/** a gold cord from (0,0) to (dx,dy), sagging, with a loop at the far end (a wrist bound); reveal with sx */
export function goldCord(c, dx, dy, sag = 40) {
  const pts = c.qbez([0, 0], [dx / 2, Math.max(0, dy) / 2 + sag], [dx, dy], 20);
  const loop = c.ribbon(c.arc(dx, dy, 9, 7, 0, PI * 2, 14), 3);
  return `<path d="${c.ribbon(pts, 3)}" fill="${C.sun}"/><path d="${loop}" fill="${shade(C.sun, -0.12)}"/>`;
}

/* ================================================================== the tithe of mint, dill and cumin */
/** an herb plant: 'mint' (round leaves), 'dill' (feathery, yellow umbels), 'cumin' (little white flowers); origin: ground */
export function herb(c, kind, h = 60) {
  const s = sheet();
  const stem = C.moss;
  if (kind === 'mint') {
    let st = '', lv = '';
    for (let i = 0; i < 4; i++) {
      const x = (i - 1.5) * 10 + c.rr(-3, 3), hh = h * c.rr(0.7, 1);
      st += c.ribbon([[x, 0], [x + c.rr(-4, 4), -hh]], 2);
      for (let k = 1; k <= 4; k++) { const y = -hh * (k / 4.3); lv += c.cut(c.ell(x - 7, y, 7, 5, 8, 0.4), 0.2, 3) + c.cut(c.ell(x + 7, y - 3, 7, 5, 8, -0.4), 0.2, 3); }
    }
    s.p(st, stem).p(lv, C.leaf);
  } else if (kind === 'dill') {
    let st = '', fr = '', um = '';
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 12, hh = h * c.rr(0.9, 1.2);
      st += c.ribbon([[x, 0], [x + c.rr(-5, 5), -hh]], 1.8);
      for (let k = 0; k < 6; k++) { const y = -hh * (0.2 + k * 0.1); fr += c.ribbon([[x, y], [x + (k % 2 ? 14 : -14), y - 10]], 0.9); }
      for (let k = 0; k < 7; k++) { const a = PI * (1.1 + k * 0.13); um += c.ribbon([[x, -hh], [x + Math.cos(a) * 14, -hh + Math.sin(a) * 10]], 0.9) + c.cut(c.circ(x + Math.cos(a) * 14, -hh + Math.sin(a) * 10, 2.2, 6), 0.1, 2); }
    }
    s.p(st, stem).x(fr, C.olive).p(um, C.wheat);
  } else {
    let st = '', lv = '', fl = '';
    for (let i = 0; i < 4; i++) {
      const x = (i - 1.5) * 9, hh = h * c.rr(0.6, 0.85);
      st += c.ribbon([[x, 0], [x + c.rr(-6, 6), -hh]], 1.4);
      lv += c.ribbon([[x, -hh * 0.4], [x - 10, -hh * 0.55]], 1) + c.ribbon([[x, -hh * 0.6], [x + 10, -hh * 0.72]], 1);
      for (let k = 0; k < 4; k++) fl += c.cut(c.circ(x + c.rr(-6, 6), -hh - c.rr(0, 6), 2.6, 6), 0.1, 2);
    }
    s.p(st, stem).x(lv, C.olive).p(fl, C.linen);
  }
  return s.out();
}
/** one little sprig (a leafy twig) to count out; origin: its foot */
export function sprig(c, col = C.leaf) {
  return sheet().p(c.ribbon([[0, 0], [1, -18]], 1.4), C.moss).p(c.cut(c.ell(-4, -10, 4, 2.6, 8, 0.5), 0.1, 2) + c.cut(c.ell(4, -14, 4, 2.6, 8, -0.5), 0.1, 2) + c.cut(c.ell(0, -19, 3, 2.4, 8), 0.1, 2), col).out();
}
/** a small shallow dish for the tithe; origin: base centre */
export function titheDish(c, w = 50) {
  return sheet().p(c.cut([[-w / 2, -12], [w / 2, -12], [w * 0.32, 0], [-w * 0.32, 0]], 0.3, 4), C.pot).p(c.cut(c.ell(0, -12, w / 2 + 2, 4, 14), 0.2, 3), shade(C.pot, 0.15)).out();
}
/** a plain wooden table; origin: middle of the floor line under it */
export function table(c, w = 150, h = 70) {
  return sheet().p(c.cut(c.rect(-w / 2 + 10, -h + 8, 9, h - 8), 0.3, 5) + c.cut(c.rect(w / 2 - 19, -h + 8, 9, h - 8), 0.3, 5), C.wood2).p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2, -h + 10], [-w / 2, -h + 10]], 0.4, 7), C.wood).out();
}

/* ================================================================== the gnat and the camel */
/** a gnat: a tiny body with two glassy wings; origin centre */
export function gnat(c, r = 1) {
  const s = sheet().p(c.cut(c.ell(0, 0, 4 * r, 1.8 * r, 8), 0.1, 2), C.ink).p(c.cut(c.circ(4.5 * r, -0.5 * r, 1.6 * r, 6), 0.1, 2), C.ink);
  let legs = '';
  for (let i = 0; i < 3; i++) legs += c.ribbon([[-1 * r + i * 2 * r, 1 * r], [-3 * r + i * 3 * r, 5 * r]], 0.5 * r);
  return `<path d="${c.poly(c.ell(-1 * r, -4 * r, 4 * r, 2.2 * r, 10, -0.5))}" fill="#e6eef0" opacity=".85"/><path d="${c.poly(c.ell(1.5 * r, -4.5 * r, 3.6 * r, 2 * r, 10, 0.4))}" fill="#dfe8ea" opacity=".85"/>${s.out()}<path d="${legs}" fill="${C.ink}"/>`;
}
/** a ring to show something tiny (a magnifier-like circle with a handle); origin centre */
export function peepRing(c, r = 26) {
  return `<circle r="${r}" fill="#fffaf0" opacity=".35"/><path d="${c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 30), 3)}" fill="${C.wood2}"/><path d="${c.ribbon([[r * 0.7, r * 0.7], [r * 1.5, r * 1.5]], 5)}" fill="${C.wood2}"/>`;
}
/** a cloth stretched over a bowl, sagging (the strainer); origin: rim centre */
export function strainer(c, w = 70) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 6, -2], [w / 2 + 6, -2], [w / 2 + 2, 10], [0, 18], [-w / 2 - 2, 10]], 0.4, 5), C.linen);
  let d = '';
  for (let x = -w / 2; x < w / 2; x += 8) d += c.ribbon([[x, 0], [x * 0.6, 14]], 0.7);
  s.x(d, shade(C.linen, -0.18), 'opacity=".7"');
  s.p(c.cut([[-w / 2, 8], [w / 2, 8], [w * 0.36, 44], [-w * 0.36, 44]], 0.4, 5), C.pot);
  return s.out();
}
/** a drinking cup (bigger than mark2's) with wine; origin: base centre */
export function wineCup(c, h = 44) {
  return sheet().p(c.cut([[-18, -h], [18, -h], [12, -h * 0.45], [4, -h * 0.35], [5, -4], [12, 0], [-12, 0], [-5, -4], [-4, -h * 0.35], [-12, -h * 0.45]], 0.3, 4), C.sun).p(c.cut(c.ell(0, -h, 17, 3.4, 12), 0.2, 3), shade(C.plumRobe, -0.35)).out();
}

/* ================================================================== the cup and the dish */
const BOWL = (c, w, h) => [[-w / 2, -h], ...c.qbez([w / 2, -h], [w * 0.52, -h * 0.25], [w * 0.1, 0], 12).map(([x, y]) => [x, y]), ...c.qbez([-w * 0.1, 0], [-w * 0.52, -h * 0.25], [-w / 2, -h], 12)];
/**
 * a great goblet in parts so it can be opened: { back (the dark inside), front (the polished outside), rim, stem };
 * origin: the base of the foot; the bowl's mouth is at y = -H, the bowl's bottom at y = -S.
 */
export function goblet(c, { w = 210, bh = 150, sh = 90 } = {}) {
  const H = sh + bh, g = C.sun, g2 = shade(C.sun, -0.18);
  const bowl = BOWL(c, w, bh).map(([x, y]) => [x, y - sh]);
  const stem = sheet();
  stem.p(c.cut([[-12, -sh], [12, -sh], [8, -24], [36, -8], [40, 0], [-40, 0], [-36, -8], [-8, -24]], 0.4, 5), g2);
  stem.p(c.cut(c.ell(0, -sh + 30, 16, 6, 12), 0.3, 4), g);
  const back = sheet().p(c.cut(bowl, 0.4, 6), mix(C.soilDark, C.plumRobe, 0.3)).out();
  const front = sheet();
  front.p(c.cut(bowl, 0.4, 6), g);
  front.x(c.ribbon(c.qbez([-w * 0.36, -H + 18], [-w * 0.4, -H + bh * 0.6], [-w * 0.12, -sh - 16], 10), 6), shade(C.sun, 0.35), 'opacity=".7"');
  front.x(c.ribbon([[-w / 2 + 10, -H + 26], [w / 2 - 10, -H + 26]], 5), g2, 'opacity=".6"');
  const rim = sheet().p(c.ribbon(c.arc(0, -H, w / 2, 12, 0, PI * 2, 30), 5), shade(C.sun, 0.1)).out();
  return { back, front: front.out(), rim, stem: stem.out(), H, S: sh, W: w };
}
/** the inside of a dirty vessel: dark sludge, snatched coins, a little house swallowed up, spilled wine, gnawed bones */
export function greedHeap(c, w = 180) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, w / 2, 34, 16, 0.2), 1, 6), mix(C.soilDark, C.thorn2, 0.4));
  let coins = '';
  for (let i = 0; i < 9; i++) coins += c.cut(c.ell(c.rr(-w * 0.4, w * 0.4), c.rr(-26, 10), 8, 4, 10, c.rr(-0.4, 0.4)), 0.2, 3);
  s.p(coins, mix(C.sun, C.clay, 0.3));
  s.p(c.cut(c.blob(-w * 0.3, -18, 18, 10, 8, 0.3), 0.4, 4), C.plumRobe);
  s.p(c.ribbon(c.qbez([w * 0.1, -30], [w * 0.3, -50], [w * 0.4, -16], 8), 4) + c.cut(c.circ(w * 0.1, -30, 5, 8), 0.2, 3) + c.cut(c.circ(w * 0.4, -16, 5, 8), 0.2, 3), mix(C.linen2, C.stone, 0.4));
  return s.out();
}

/* ================================================================== the whitewashed tombs */
/**
 * a rock-cut tomb façade: the rock face, a carved pediment and pilasters, a dark doorway; origin: base centre.
 * col: the stone colour (grey rock, or white when whitewashed). door: draw the dark doorway.
 */
export function tombFacade(c, { w = 300, h = 290, col = mix(C.rock2, C.stone2, 0.4), door = true } = {}) {
  const cc = c;
  const s = sheet();
  const dp = [[-w * 0.14, 1], [-w * 0.14, -h * 0.46], [w * 0.14, -h * 0.46], [w * 0.14, 1]];
  const hl = door === 'hole' ? cc.hole(dp, 0.4, 6) : '';
  s.p(cc.cut([[-w / 2 - 40, 0], [-w / 2 - 30, -h * 0.7], [-w / 2 + 10, -h], [w / 2 - 20, -h - 10], [w / 2 + 30, -h * 0.75], [w / 2 + 44, 0]], 1.2, 10) + hl, shade(col, -0.12));
  s.p(cc.cut([[-w / 2, 0], [-w / 2, -h * 0.72], [w / 2, -h * 0.72], [w / 2, 0]], 0.5, 8) + hl, col);
  s.p(cc.cut([[-w / 2 - 14, -h * 0.72], [0, -h * 0.94], [w / 2 + 14, -h * 0.72]], 0.5, 8), shade(col, 0.06));
  s.p(cc.cut(cc.rect(-w / 2 - 16, -h * 0.74, w + 32, 12), 0.3, 6), shade(col, -0.06));
  let pil = '';
  [-w * 0.4, -w * 0.22, w * 0.22, w * 0.4].forEach((x) => { pil += cc.cut(cc.rect(x - 9, -h * 0.72 + 10, 18, h * 0.72 - 10), 0.3, 6); });
  s.p(pil, shade(col, 0.1));
  s.x(cc.poly(cc.circ(0, -h * 0.82, 10, 12)), shade(col, -0.2), 'opacity=".6"');
  if (door === true) s.p(cc.cut(dp, 0.4, 6), mix(C.soilDark, C.storm2, 0.4));
  return s.out();
}
/** the inside of the tomb behind its doorway: dark, dust, cobwebs, a few pale bones (restrained); origin: base centre */
export function tombInside(c, w = 84, h = 134) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 0.3, 6), mix(C.soilDark, C.night2, 0.35));
  s.p(c.cut([[-w / 2, 0], [-w / 2, -26], [w / 2, -30], [w / 2, 0]], 0.4, 6), mix(C.soilDark, C.rock3, 0.35));
  const bone = (x, y, l, r) => c.ribbon([[x - Math.cos(r) * l / 2, y - Math.sin(r) * l / 2], [x + Math.cos(r) * l / 2, y + Math.sin(r) * l / 2]], 3.4) + c.cut(c.circ(x - Math.cos(r) * l / 2, y - Math.sin(r) * l / 2, 3.4, 6), 0.1, 2) + c.cut(c.circ(x + Math.cos(r) * l / 2, y + Math.sin(r) * l / 2, 3.4, 6), 0.1, 2);
  s.p(bone(-14, -22, 28, 0.2) + bone(10, -18, 24, -0.4) + bone(0, -30, 20, 1.2) + bone(20, -28, 16, 0.6), '#d8d0bf');
  s.x(c.poly(c.ell(-24, -14, 10, 3, 8)) + c.poly(c.ell(22, -10, 12, 3, 8)), mix(C.rock3, C.soilDark, 0.4), 'opacity=".8"');
  return `${s.out()}<g transform="translate(${w / 2 - 4} ${-h + 4}) scale(-.6 .6)">${cobweb(c, 40, '#b9b2a4')}</g>`;
}
/** a whitewash brush on a long handle (held in the front hand) */
export function brush(c) {
  return sheet().p(c.ribbon([[0, 0], [30, 40]], 3), C.wood3).p(c.cut([[24, 36], [40, 30], [48, 50], [32, 56]], 0.3, 3), C.linen).out();
}
/** a bucket of whitewash; origin: base centre */
export function limeBucket(c) {
  return sheet().p(c.cut([[-16, -30], [16, -30], [12, 0], [-12, 0]], 0.3, 4), C.wood).p(c.cut(c.ell(0, -30, 16, 4, 12), 0.2, 3), C.linen).out();
}

/* ================================================================== the monuments of the prophets, the measure */
/** a prophet's monument (Kidron style): a square block with pilasters and a pyramid ('pyr') or a cone ('cone') cap.
 * parts: { base (the block, origin: base centre), cap (origin: its foot centre) } */
export function monument(c, kind = 'pyr', w = 150, h = 150) {
  const st = mix(C.stone, C.sand, 0.3);
  const base = sheet();
  base.p(c.cut([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 0.5, 8), st);
  let pil = '';
  [-w * 0.34, -w * 0.12, w * 0.12, w * 0.34].forEach((x) => { pil += c.cut(c.rect(x - 6, -h + 16, 12, h - 16), 0.2, 4); });
  base.p(pil, shade(st, 0.1));
  base.p(c.cut(c.rect(-w / 2 - 8, -h - 4, w + 16, 14), 0.3, 5), shade(st, -0.08));
  base.x(c.ribbon([[-w / 2 + 4, -h * 0.5], [w / 2 - 4, -h * 0.5]], 1.2), shade(st, -0.2), 'opacity=".5"');
  const cap = sheet();
  if (kind === 'pyr') cap.p(c.cut([[-w / 2 - 4, 0], [0, -w * 0.72], [w / 2 + 4, 0]], 0.5, 6), shade(st, -0.05));
  else {
    cap.p(c.cut([[-w * 0.3, 0], [-w * 0.26, -20], [w * 0.26, -20], [w * 0.3, 0]], 0.4, 5), shade(st, 0.05));
    cap.p(c.cut([[-w * 0.26, -20], ...c.qbez([-w * 0.26, -20], [-w * 0.1, -w * 0.5], [0, -w * 0.95], 10), ...c.qbez([0, -w * 0.95], [w * 0.1, -w * 0.5], [w * 0.26, -20], 10)], 0.4, 5), shade(st, -0.05));
  }
  return { base: base.out(), cap: cap.out() };
}
/** a tall measuring jar (a seah) with notches; origin: base centre; mouth at y = -h */
export function measureJar(c, h = 200, w = 110) {
  const s = sheet();
  const col = mix(C.pot, C.clay, 0.3);
  s.p(c.cut([[-w * 0.36, 0], [-w / 2, -h * 0.25], [-w / 2, -h * 0.9], [-w * 0.42, -h], [w * 0.42, -h], [w / 2, -h * 0.9], [w / 2, -h * 0.25], [w * 0.36, 0]], 0.5, 6), col);
  let n = '';
  for (let i = 1; i <= 5; i++) n += c.ribbon([[-w * 0.46, -h * (0.18 * i)], [-w * 0.26, -h * (0.18 * i)]], 2.4);
  s.x(n, shade(col, -0.3), 'opacity=".8"');
  s.p(c.cut(c.ell(0, -h, w * 0.43, 9, 16), 0.3, 4), shade(col, -0.35));
  return s.out();
}

/* ================================================================== serpents (shadows on a wall) */
/** a rearing serpent's shadow: an S-curve rising from the ground, head turned to the side; origin: its foot */
export function snakeShadow(c, len = 220, col = '#3b2a22') {
  const pts = [];
  for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([Math.sin(u * PI * 2.4) * 24 * (1 - u * 0.4), -u * len]); }
  const top = pts[pts.length - 1];
  const s = sheet();
  s.p(c.ribbon(pts, (u) => 18 - u * 9), col);
  s.p(c.cut(c.ell(top[0] + 12, top[1] - 2, 17, 10, 14, 0.25), 0.3, 4), col);
  s.x(c.ribbon([[top[0] + 28, top[1] + 2], [top[0] + 42, top[1] + 4], [top[0] + 48, top[1]]], 1.6) + c.ribbon([[top[0] + 42, top[1] + 4], [top[0] + 48, top[1] + 8]], 1.4), C.curtain2);
  return s.out();
}

/* ================================================================== the hen and her chicks */
/** a mother hen, front-ish, warm paper; parts { body, wing } — the wing is the right wing (mirror it for the left),
 * hinged at its origin (the shoulder), folded when rotated ~70°, spread at 0°. body origin: feet centre */
export function hen(c) {
  const b = sheet();
  const plum = mix(C.wheat, C.ochre, 0.35), plum2 = shade(plum, -0.12);
  b.p(c.cut([[-8, 0], [-14, 16], [-4, 16], [0, 4], [4, 16], [14, 16], [8, 0]], 0.2, 3), C.ochre);
  b.p(c.cut(c.blob(0, -70, 78, 72, 18, 0.06), 0.6, 6), plum);
  b.p(c.cut(c.blob(0, -48, 52, 40, 14, 0.08), 0.4, 5), shade(plum, 0.2));
  b.p(c.cut(c.circ(0, -150, 30, 18), 0.4, 4), plum);
  b.p(c.cut([[-14, -176], [-10, -194], [-2, -182], [4, -198], [10, -182], [18, -190], [16, -172]], 0.3, 3), C.curtain);
  b.p(c.cut([[-6, -146], [6, -146], [0, -128]], 0.2, 3), C.sunDeep);
  b.p(c.cut(c.ell(0, -126, 6, 9, 10), 0.2, 3), C.curtain);
  b.x(c.poly(c.circ(-11, -156, 3, 8)) + c.poly(c.circ(11, -156, 3, 8)), C.ink);
  let fe = '';
  for (let i = 0; i < 8; i++) fe += c.ribbon(c.arc(0, -40 - i * 10, 40 - i * 2, 10, 0.3, PI - 0.3, 8), 1.4);
  b.x(fe, plum2, 'opacity=".5"');
  const w = sheet();
  const pts = [[0, -8], [60, -30], [130, -40], [190, -30], [230, -6], [220, 6], [200, 4], [206, 20], [180, 18], [184, 34], [150, 30], [150, 46], [110, 36], [60, 30], [10, 14]];
  w.p(c.cut(pts, 0.6, 6), plum2);
  let q = '';
  for (let i = 0; i < 5; i++) q += c.ribbon([[40 + i * 30, -20 + i * 2], [60 + i * 32, 22 + i * 3]], 1.6);
  w.x(q, shade(plum2, -0.2), 'opacity=".6"');
  return { body: b.out(), wing: w.out() };
}
/** a little chick; origin: feet */
export function chick(c) {
  const s = sheet();
  const y = mix(C.wheat, C.halo, 0.4);
  s.p(c.ribbon([[-4, 0], [-3, -8]], 1.4) + c.ribbon([[4, 0], [3, -8]], 1.4), C.sunDeep);
  s.p(c.cut(c.blob(0, -16, 13, 10, 10, 0.08), 0.3, 3), y);
  s.p(c.cut(c.circ(9, -28, 8, 10), 0.3, 3), y);
  s.p(c.cut([[16, -29], [23, -27], [16, -25]], 0.1, 2), C.sunDeep);
  s.x(c.poly(c.circ(11, -30, 1.4, 6)), C.ink);
  return s.out();
}
