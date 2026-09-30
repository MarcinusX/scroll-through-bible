// John 11 — the cast and cut-outs of this chapter: the house at Bethany with Martha (apron and keys), Mary
// (the one who anointed the Lord — long dark hair, a lavender band) and their brother Lazarus; the camp beyond the
// Jordan; the road below the village with Jerusalem on the far hills; the cave-tomb with its stone; the grave
// clothes that unwind like paper ribbons; day-discs, hearts, seeds that grow into flowers, the Roman eagle and the
// posted order of the chief priests.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, attr } from '../kit.js';
import { band, hillsWith, house, cypress, olive, palm, bush, rock, reeds, grass, flowers, sun, cloud } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { addToHead, addToBody } from '../mark2/lib.js';
import { walledCity } from '../mark1/lib.js';
import { houseSection } from '../mark3/lib.js';
import { bedFrame } from '../mark5/lib.js';
import { lyingOn } from '../john5/lib.js';
import { miniHead } from '../mark16/lib.js';

export { kf, moving, hand, headAt, speech, thought, spark, heart, addToHead, addToBody, dust } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, card, handAt } from '../mark3/lib.js';
export { voiceRings, hang2, sparkle, flame, footprint, signpost } from '../mark1/lib.js';
export { vis, zzz, seal, highPriest, priest, scribe, chamber, table, hangingLamp, lampGlow, alabaster, nardMist, templeMini, wordTag, discPlate, HP } from '../mark14/lib.js';
export { storyFrame, SEPIA } from '../mark6/lib.js';
export { glory, globe, soulLight, lightCrown, oilHorn } from '../mark8/lib.js';
export { templeCourt, jerusalem, lamb } from '../mark11/lib.js';
export { miniHead, medallion, tombIcon, skyKeys } from '../mark16/lib.js';
export { radiance, rayBurst, glowDisc, eternityRing, drawRing, hungWord, hungPlate, darkSheet, JESUS_HOODED, wordFlame } from '../john1/lib.js';
export { signBadge, dayDisc, heartWindow, openWindow, bigBalance, iconBubble } from '../john2/lib.js';
export { dayArc, hourAt, sunToken, feverWaves, roundel, panel, sepia } from '../john4/lib.js';
export { leaderOpts, lyingOn, ripple } from '../john5/lib.js';
export { bedFrame, blanket } from '../mark5/lib.js';
export { tr, sky, hanging, pose, sheet, shade, mix, C, CAST, person, crowdPerson, lerp, attr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const DAY = ['#cfe2dc', '#f0e7cd', '#f7ead0'];
export const WARM = ['#d9dcc4', '#f2e2c0', '#f8e6c6'];          // Bethany, a still, warm afternoon
export const SOFT = ['#c9d3d6', '#e9dfcc', '#f1e3cc'];          // a quieter, greyer light (grief)
export const AFTERNOON = ['#d3dcc9', '#f1e3c4', '#f7e6c8'];
export const EVENING = ['#8f86ad', '#e2b096', '#f4d2aa'];
export const DUSK = ['#5f5e8f', '#c9919a', '#eab796'];
export const NIGHT = ['#1e2552', '#2f3668', '#50507e'];
export const PREDAWN = ['#2c315f', '#6a5f8a', '#b88e9a'];
export const DAWN = ['#f0d9b0', '#f8e3bd', '#fbeed2'];
export const GOLD_L = '#fff3cf';

/* ================================================================== the cast */
/** Martha — practical, busy: a warm clay robe, a linen apron, keys on her belt, a pale veil */
export const MARTHA = { robe: C.clayMantle, hairStyle: 'veil', veil: C.wheatRobe, veil2: shade(C.clay, 0.05), hair: C.hair2, skin: C.skin2, belt: C.leather };
/** Mary — the one who anointed the Lord (the woman at Bethany in Mk 14 wears the same rose and lavender):
 *  long dark hair left uncovered, a lavender band */
export const MARY = { robe: C.roseRobe, mantle: C.lavender, hairStyle: 'long', hair: C.hair3, skin: C.skin, belt: null, beard: 'none' };
/** Lazarus — the friend: sky-blue tunic, sage mantle, curly hair, a short beard */
export const LAZARUS = { robe: C.skyVeil, mantle: C.sageRobe, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin2, belt: C.leather };
/** Lazarus freed from the grave clothes — in a plain linen tunic */
export const LAZ_LINEN = { ...LAZARUS, robe: C.linen, mantle: null, belt: C.rope };
/** the messenger the sisters send */
export const MESSENGER = { robe: C.ochreRobe, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.terracotta };
/** the six disciples on stage (the same cut-outs as in Mark): Peter, Andrew, James, John, Matthew, Thomas */
export const DISC = [CAST.peter, CAST.andrew, CAST.james, CAST.john, CAST.matthew, CAST.thomas];

const MR = [C.stone, mix(C.dustyBlue, C.stone, 0.45), C.linen2, mix(C.plumRobe, C.stone, 0.45), mix(C.sageRobe, C.stone, 0.4), C.stone2, mix(C.clayMantle, C.stone, 0.5)];
const MV = [C.stone2, C.linen2, mix(C.skyVeil, C.stone, 0.4), C.stone, mix(C.lavender, C.stone, 0.5)];
/** a mourner from Jerusalem (muted, veiled women and wrapped men); deterministic by i */
export function mournerOpts(i = 0, extra = {}) {
  const woman = i % 3 !== 1;
  return {
    robe: MR[i % MR.length], mantle: i % 2 ? MV[(i + 2) % MV.length] : null, skin: [C.skin2, C.skin, C.skin3, C.skin4][i % 4],
    hair: [C.hair3, C.greyHair, C.hair, C.hair2][i % 4], hairStyle: woman ? 'veil' : 'wrap', veil: MV[i % MV.length], veil2: shade(MV[i % MV.length], -0.12),
    beard: woman ? 'none' : ['full', 'short'][i % 2], beardColor: [C.greyHair, C.hair3][i % 2], belt: i % 4 === 3 ? C.leather : null, ...extra,
  };
}

/** Martha's linen apron and ring of keys (body coords, per pose) */
function apron(c, P = 'stand') {
  const s = sheet();
  const pts = P === 'sit' ? [[-12, -35], [22, -35], [48, -20], [50, -6], [-6, -6]]
    : P === 'kneel' ? [[-12, -51], [22, -51], [42, -30], [46, -8], [-6, -8]]
      : [[-15, -96], [22, -96], [27, -26], [-11, -24]];
  s.p(c.cut(pts, 0.4, 5), C.linen);
  const by = -97 + DY[P];
  s.x(c.ribbon([[-15, by + 3], [23, by + 3]], 2), shade(C.linen, -0.12), 'opacity=".8"');
  // keys on a ring at the belt
  const kx = 27, ky = by + 10;
  s.x(c.ribbon(c.arc(kx, ky, 4, 4, 0, PI * 2, 10), 1.3), C.ochre);
  s.p(c.cut([[kx - 1, ky + 3], [kx + 1, ky + 3], [kx + 1.5, ky + 15], [kx + 4, ky + 15], [kx + 4, ky + 18], [kx - 1, ky + 18]], 0.1, 2), C.ochre);
  s.p(c.cut([[kx + 3, ky + 2], [kx + 5, ky + 2], [kx + 7, ky + 11], [kx + 9, ky + 11], [kx + 9, ky + 13], [kx + 5, ky + 13]], 0.1, 2), shade(C.ochre, -0.1));
  return s.out();
}
/** Mary's lavender head band (head coords) */
function headband(c) {
  return sheet().p(c.ribbon(c.arc(0, 0, 19.5, 19.5, PI * 1.08, PI * 1.9, 12), 3.4), mix(C.lavender, C.plumRobe, 0.3)).out();
}
/** puppet markup for the three of Bethany (extra: pose, eyes, holdF…) */
export const martha = (c, extra = {}, face = '') => addToHead(addToBody(person(c, { ...MARTHA, ...extra }), apron(c, extra.pose || 'stand')), face);
export const mary = (c, extra = {}, face = '') => addToHead(person(c, { ...MARY, ...extra }), headband(c) + face);
export const lazarus = (c, extra = {}, face = '') => addToHead(person(c, { ...LAZARUS, ...extra }), face);

/* ================================================================== small props */

/** a folded message on a string seal (origin centre) */
export function letter(c, w = 34) {
  const s = sheet().p(c.cut(c.rect(-w / 2, -w * 0.32, w, w * 0.64), 0.3, 4), C.parchment);
  s.x(c.ribbon([[-w / 2, -w * 0.3], [0, w * 0.05], [w / 2, -w * 0.3]], 1.2), shade(C.parchment, -0.3), 'opacity=".8"');
  s.p(c.cut(c.circ(0, w * 0.06, w * 0.11, 10), 0.2, 2), C.terracotta);
  return s.out();
}
/** a small frame on a string; inner drawn in a w×h box centred on the origin */
export function framed(S, inner, { w = 300, h = 200, rim = C.wood3, bg = C.parchment, k, str = true } = {}) {
  const c = S.c;
  const id = S.id('frm' + (k || Math.round(c.rr(0, 1e6))));
  S.defs(`<clipPath id="${id}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath>`);
  const fr = sheet().p(c.cut(c.rect(-w / 2 - 10, -h / 2 - 10, w + 20, h + 20), 0.6, 8), rim).out();
  const s = str ? `<path d="M${-w * 0.3} -1600V${-h / 2 - 10}M${w * 0.3} -1600V${-h / 2 - 10}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>` : '';
  return `${s}${fr}<g clip-path="url(#${id})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${bg}"/>${inner}</g>`;
}
/** a sickbed icon: a little bed with a figure lying under a blanket (origin centre bottom) */
export function bedIcon(c, o = LAZARUS, sc = 1) {
  const s = sheet();
  s.p(c.cut([[-40 * sc, -14 * sc], [40 * sc, -14 * sc], [40 * sc, -8 * sc], [-40 * sc, -8 * sc]], 0.2, 4), C.wood);
  s.p(c.cut([[-36 * sc, -8 * sc], [-32 * sc, -8 * sc], [-32 * sc, 0], [-36 * sc, 0]], 0.1, 3) + c.cut([[32 * sc, -8 * sc], [36 * sc, -8 * sc], [36 * sc, 0], [32 * sc, 0]], 0.1, 3), C.wood2);
  s.p(c.cut([[-38 * sc, -14 * sc], [-34 * sc, -26 * sc], [18 * sc, -28 * sc], [22 * sc, -14 * sc]], 0.3, 4), C.blushVeil);
  return s.out() + `<g transform="translate(${30 * sc} ${-24 * sc}) rotate(-90)">${miniHead(c, o, 9 * sc)}</g>`;
}
/** a small cave-tomb icon with its stone (origin centre bottom); open: stone rolled aside, light inside */
export function caveIcon(c, { open = false, sc = 1 } = {}) {
  const s = sheet();
  s.p(c.cut([[-46 * sc, 0], [-40 * sc, -40 * sc], [-18 * sc, -62 * sc], [16 * sc, -64 * sc], [42 * sc, -44 * sc], [50 * sc, 0]], 0.8, 6), C.rock);
  s.p(c.cut([[-16 * sc, 0], [-16 * sc, -26 * sc], ...c.arc(0, -26 * sc, 16 * sc, 16 * sc, PI, 2 * PI, 8), [16 * sc, 0]], 0.3, 4), open ? C.lampGlow : mix(C.soilDark, C.storm2, 0.35));
  s.p(c.cut(c.circ(open ? 34 * sc : 0, -20 * sc, 20 * sc, 16), 0.4, 4), shade(C.rock2, 0.05));
  return (open ? `<circle cy="${-24 * sc}" r="${46 * sc}" fill="url(#halo-glow)"/>` : '') + s.out();
}
/** a dashed outline of someone who is not there (origin: feet) */
export function absentOutline(c, sc = 1, col = C.haloRim) {
  const pts = [[-30, 0], [-26, -110], [-14, -140], [-12, -150], [-18, -166], [-10, -184], [4, -186], [14, -178], [16, -160], [10, -150], [14, -140], [26, -110], [34, 0]];
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    for (let u = 0; u < 1; u += 0.34) d += c.ribbon([[(x0 + (x1 - x0) * u) * sc, (y0 + (y1 - y0) * u) * sc], [(x0 + (x1 - x0) * (u + 0.2)) * sc, (y0 + (y1 - y0) * (u + 0.2)) * sc]], 2.4 * sc);
  }
  return `<path d="${d}" fill="${col}"/>`;
}
/** a little curl of linen (a grave-band unwinding; origin at its start) */
export function bandCurl(c, len = 70, dir = 1, col = C.linen) {
  const pts = [];
  for (let i = 0; i <= 18; i++) { const u = i / 18, a = u * PI * 1.6; pts.push([dir * (u * len * 0.8 + Math.sin(a) * 12), -Math.cos(a) * 10 + u * 8]); }
  return sheet().p(c.ribbon(pts, (u) => 5.2 - u * 1.6, 0.6), col).x(c.ribbon(pts.map(([x, y]) => [x, y + 1.2]), 0.8), shade(col, -0.18), 'opacity=".6"').out();
}
/**
 * Lazarus in the grave clothes: a linen-wrapped standing figure, hands and feet bound, the face wrapped in a
 * cloth (origin: feet; facing the viewer; ~200 tall). Returns { body, cloth } (the cloth is separate so it can lift off).
 */
export function wrapped(c) {
  const s = sheet();
  const body = [[-14, -150], [15, -151], [25, -140], [28, -110], [27, -70], [22, -34], [15, -8], [11, 0], [-10, 0], [-14, -8], [-21, -34], [-26, -70], [-27, -110], [-24, -140]];
  s.p(c.cut(body, 0.5, 6), C.linen);
  // the bands, wound round and round
  let d = '';
  for (let y = -144, i = 0; y < -6; y += 12, i++) {
    const w = y < -120 ? 24 : y < -40 ? 27 : 20 - (y + 40) * 0.25;
    d += c.ribbon([[-w, y + (i % 2 ? 4 : -2)], [w, y + (i % 2 ? -3 : 4)]], 1.6);
  }
  d += c.ribbon([[-20, -120], [18, -60]], 1.2) + c.ribbon([[18, -110], [-16, -40]], 1.2);
  s.x(d, shade(C.linen, -0.2), 'opacity=".75"');
  // arms bound at the sides (a faint crease)
  s.x(c.ribbon([[-19, -134], [-21, -80]], 1.2) + c.ribbon([[19, -134], [21, -80]], 1.2), shade(C.linen, -0.26), 'opacity=".6"');
  s.p(c.poly([[-6, -156], [7, -156], [7, -148], [-6, -148]]), C.linen2);
  const h = sheet();
  h.p(c.cut(c.blob(1, -168, 19, 20, 16, 0.05), 0.4, 4), C.linen2);
  h.x(c.ribbon([[-17, -174], [19, -166]], 1.2) + c.ribbon([[-18, -162], [19, -158]], 1.2) + c.ribbon([[-14, -184], [14, -180]], 1.2), shade(C.linen2, -0.2), 'opacity=".7"');
  h.p(c.cut([[16, -160], [26, -150], [22, -146], [14, -154]], 0.2, 3), C.linen2);
  return { body: s.out(), cloth: h.out() };
}

/** the round, flat stone that lies against the cave (origin centre) */
export function slab(c, r = 74) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.98, 30, 0.05), 1.2, 6), C.rock2);
  s.p(c.cut(c.blob(-r * 0.06, -r * 0.08, r * 0.8, r * 0.76, 24, 0.06), 0.8, 6), shade(C.rock2, 0.08));
  let m = '';
  for (let i = 0; i < 6; i++) { const a = c.rr(0, PI * 2), d = c.rr(0.2, 0.7) * r; m += c.ribbon([[Math.cos(a) * d, Math.sin(a) * d], [Math.cos(a) * d + c.rr(-12, 12), Math.sin(a) * d + c.rr(-12, 12)]], 2); }
  s.x(m, shade(C.rock2, -0.22), 'opacity=".5"');
  s.x(c.ribbon(c.arc(0, 0, r * 0.88, r * 0.88, PI * 1.1, PI * 1.45, 8), 4), shade(C.rock2, 0.35), 'opacity=".55"');
  return s.out();
}
/** a seed → sprout → flower (origin: at the soil line). Pieces: .seed .stem .leafL .leafR .bloom for posing */
export function flowerGrow(c, h = 70, col = C.jesusMantle) {
  const seed = sheet().p(c.cut(c.ell(0, 4, 7, 4.4, 10), 0.2, 3), C.wood2).out();
  const stem = sheet().p(c.ribbon(c.qbez([0, 0], [4, -h * 0.5], [0, -h], 10), 2.6), C.moss).out();
  const leaf = (d) => sheet().p(c.cut([[0, 0], [d * 10, -8], [d * 22, -6], [d * 12, 2]], 0.2, 3), C.leaf).out();
  const petals = [];
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; petals.push(c.cut(c.ell(Math.cos(a) * 9, Math.sin(a) * 9, 8, 5, 8, a), 0.2, 3)); }
  const bloom = sheet().p(petals.join(''), col).p(c.cut(c.circ(0, 0, 5, 8), 0.2, 2), C.sun).out();
  return `<g class="seed">${seed}</g><g class="stem">${stem}</g><g class="leafL" transform="translate(0 ${-h * 0.4})">${leaf(-1)}</g><g class="leafR" transform="translate(0 ${-h * 0.6})">${leaf(1)}</g><g class="bloom" transform="translate(0 ${-h})"><circle r="22" fill="url(#warm-glow)" opacity=".8"/>${bloom}</g>`;
}
/** grow a flowerGrow element: k 0 (seed) → 1 (in bloom) */
export function growFlower(el, k, h = 70) {
  const q = el.__q || (el.__q = { stem: el.querySelector('.stem'), l: el.querySelector('.leafL'), r: el.querySelector('.leafR'), b: el.querySelector('.bloom'), seed: el.querySelector('.seed') });
  const s = Math.max(0.001, Math.min(1, k * 1.6));
  pose(q.stem, { sy: s, sx: 1 });
  const lk = Math.max(0, Math.min(1, (k - 0.35) / 0.3));
  pose(q.l, { y: -h * 0.4 * s, s: Math.max(0.001, lk) });
  pose(q.r, { y: -h * 0.6 * s, s: Math.max(0.001, lk) });
  const bk = Math.max(0, Math.min(1, (k - 0.6) / 0.4));
  pose(q.b, { y: -h * s, s: Math.max(0.001, bk), r: bk * 30 });
  pose(q.seed, { o: 1 - Math.min(1, k * 3) });
}

/* ================================================================== sets */

/** a hill band with scattered olive trees (markup) */
function olives(c, fn, xs, sc = 0.5, tint = 0) {
  return xs.map((x) => olive(c, x, fn(x) + 6, sc * c.rr(0.8, 1.15), { leaf: mix(C.olive, C.hillFar, tint), leaf2: mix(C.sage, C.hillFar, tint) })).join('');
}

/**
 * Beyond the Jordan: far hills of Judea, the river with reeds and palms, a sandy bank where they camp.
 * Returns { sk, hangL, sunEl, cl, floor, front() } — call front() after adding the cast (foreground reeds).
 */
export function jordanSet(S, { skyCols = DAY, sunAt = [1240, 150] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 3 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 420 });
  const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 150, len: 300 });
  const far = S.layer({ par: 0.08, sh: 2 });
  const f1 = band(c, { y: 440, amps: [24, 10, 3], lens: [900, 300, 120], color: mix(C.hillFar, C.duskViolet, 0.22) });
  far.add(f1.markup + walledCity(c, 470, f1.fn(470) + 8, 0.55, { wall: mix(C.stone, C.duskViolet, 0.25), wall2: mix(C.stone2, C.duskViolet, 0.3), temple: mix(C.cream, C.duskViolet, 0.15) }));
  const mid = S.layer({ par: 0.16, sh: 3 });
  const m1 = hillsWith(c, { y: 510, amps: [14, 6, 2], lens: [800, 260, 100], color: mix(C.hillMid, C.sand, 0.3), trees: 26, treeColor: C.sage, treeH: 20 });
  mid.add(m1.markup);
  // the river
  const riv = S.layer({ par: 0.24, sh: 2 });
  const rv = sheet();
  rv.p(c.ridge(c.wave(560, [3, 1.5], [300, 90]), -1400, 2800, 1700, 14, 0.6), C.lake);
  let glint = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(-600, 2200), y = c.rr(570, 598); glint += c.ribbon([[x, y], [x + c.rr(20, 50), y + c.rr(-1, 1)]], 1.6); }
  rv.x(glint, C.foam, 'opacity=".7"');
  riv.add(rv.out());
  // the near bank: reeds, palms, a tamarisk
  const bank = S.layer({ par: 0.32, sh: 3 });
  const b1 = band(c, { y: 604, amps: [5, 2], lens: [500, 160], color: mix(C.sand, C.hillNear, 0.35) });
  let rd = '';
  for (const x of [-300, 20, 250, 560, 990, 1320, 1600, 1900]) rd += reeds(c, x, b1.fn(x) + 4, 8, 70);
  bank.add(b1.markup + rd + palm(c, 300, b1.fn(300) + 6, 250) + palm(c, 1380, b1.fn(1380) + 6, 280) + palm(c, 1450, b1.fn(1450) + 6, 210) + bush(c, 640, b1.fn(640) + 4, 90, C.sage, C.moss));
  const ground = S.layer({ par: 0.45, sh: 3 });
  const g1 = band(c, { y: 648, amps: [5, 2], lens: [600, 200], color: mix(C.sand, C.sand2, 0.35) });
  ground.add(g1.markup + grass(c, { x0: -800, x1: 2400, y: 650, fn: g1.fn, n: 44, h: 14, color: C.olive }) + rock(c, 470, 700, 70, 30, C.rock2) + rock(c, 1150, 706, 56, 24, C.rock));
  return {
    sk, hangL, sunEl, cl, floor: 700,
    front() {
      const fg = S.layer({ par: 0.9, sh: 6 });
      fg.add(reeds(c, -120, 1000, 12, 190, C.olive) + reeds(c, 1720, 1000, 12, 200, C.olive) + bush(c, 60, 1010, 240, C.moss, C.sage) + bush(c, 1560, 1010, 230, C.sage, C.moss));
      return fg;
    },
  };
}

/**
 * Bethany on the slope of the Mount of Olives: Jerusalem small on the far hills (right), the village on the hill,
 * the road below. opts.house: the sisters' house in front on the right, with an open doorway and a room behind it
 * (inL: put Mary there). Returns { sk, hangL, sunEl, cl, inL, gy, jer:[x,y], vil:[x,y], door, floor, front() }.
 */
export function bethanySet(S, { skyCols = WARM, sunAt = [1250, 140], house: withHouse = false, tint = 0 } = {}) {
  const c = S.c;
  const T = (col) => (tint ? mix(col, C.duskViolet, tint) : col);
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 3 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 420 });
  const cl = hanging(hangL, cloud(c, 190), { x: 600, y: 160, len: 300 });
  const far = S.layer({ par: 0.08, sh: 2 });
  const f1 = band(c, { y: 452, amps: [18, 8, 3], lens: [900, 300, 120], color: T(mix(C.hillFar, C.duskViolet, 0.18)) });
  const JX = withHouse ? 470 : 1150;
  far.add(f1.markup + walledCity(c, JX, f1.fn(JX) + 8, 0.62, { wall: T(mix(C.stone, C.duskViolet, 0.2)), wall2: T(mix(C.stone2, C.duskViolet, 0.25)), temple: T(C.cream) }));
  const mid = S.layer({ par: 0.16, sh: 3 });
  const m1 = hillsWith(c, { y: 520, amps: [20, 8, 3], lens: [900, 300, 110], color: T(C.hillMid), trees: 18, treeColor: T(C.sage), treeH: 22 });
  const VX = withHouse ? 760 : 1010;
  let vil = '';
  [[-150, 0.9], [-90, 1], [-20, 1.1], [60, 0.9], [120, 1], [180, 0.85]].forEach(([dx, s], i) => {
    const x = VX + dx, y = m1.fn(x) + 12 - (i % 2) * 8;
    vil += house(c, x, y, 50 * s, 38 * s, { wall: T(C.plaster), shadow: T(C.plaster2), stairs: i % 2 === 0 });
  });
  mid.add(m1.markup + vil + olives(c, m1.fn, [180, 420, 560, 1260, 1420], 0.5, 0.1) + cypress(c, VX + 230, m1.fn(VX + 230) + 8, 90, T(C.moss2)));
  // the near slope and the road
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gy = c.wave(632, [6, 3], [700, 220]);
  const gs = sheet();
  gs.p(c.ridge(gy, -1400, 2800, 1700, 12, 1), T(mix(C.hillNear, C.sand, 0.35)));
  const road = c.cbez([-900, 760], [200, 700], [900, 740], [2400, 690], 40);
  gs.p(c.ribbon(road, 120, 2), T(C.sand));
  gs.x(c.ribbon(road.map(([x, y]) => [x, y + 6]), 60, 2), T(C.sand2), 'opacity=".45"');
  ground.add(gs.out());
  ground.add(olive(c, 330, 690, 1.05, { leaf: T(C.olive), leaf2: T(C.sage) }) + (withHouse ? '' : olive(c, 1290, 686, 1.15, { leaf: T(C.olive), leaf2: T(C.sage) })) + bush(c, 560, 650, 70, T(C.sage), T(C.moss)) + rock(c, 250, 720, 80, 30, C.rock2));
  ground.add(grass(c, { x0: -800, x1: 2400, y: 632, fn: gy, n: 50, h: 14, color: T(C.moss) }) + flowers(c, { x0: -400, x1: 2000, y: 660, fn: (x) => gy(x) + c.rr(10, 50), n: 26, h: 16 }));
  let inL = null, door = null;
  if (withHouse) {
    // the room behind the doorway
    const H = { x0: 1000, x1: 1280, top: 440, floor: 706, d0: 1040, d1: 1140, dTop: 540 };
    door = H;
    inL = S.layer({ par: 0.5, sh: 3 });
    inL.add(`<rect x="${H.d0 - 20}" y="${H.dTop - 60}" width="${H.d1 - H.d0 + 40}" height="${H.floor - H.dTop + 70}" fill="${mix(C.wood2, C.soilRich, 0.45)}"/><circle cx="${H.d0 + 70}" cy="${H.dTop + 40}" r="120" fill="url(#warm-glow)" opacity=".55"/>` + sheet().p(c.cut(c.rect(H.d0 - 20, H.floor - 26, H.d1 - H.d0 + 40, 30), 0.3, 6), mix(C.sand2, C.wood3, 0.3)).out());
    const fac = S.layer({ par: 0.5, sh: 5 });
    const s = sheet();
    const dp = [[H.d0, H.floor + 2], [H.d0, H.dTop + 30], ...c.arc((H.d0 + H.d1) / 2, H.dTop + 30, (H.d1 - H.d0) / 2, 34, PI, 2 * PI, 10), [H.d1, H.floor + 2]];
    s.p(c.cut([[H.x0, H.top], [H.x1, H.top], [H.x1 + 6, H.floor + 4], [H.x0 - 4, H.floor + 4]], 0.8, 10) + c.hole(dp, 0.5, 6), T(C.plaster));
    let patch = '';
    for (let i = 0; i < 6; i++) patch += c.cut(c.blob(c.rr(H.x0 + 20, H.x1 - 20), c.rr(H.top + 30, H.floor - 40), c.rr(16, 34), c.rr(8, 16), 9, 0.2), 0.6, 6);
    s.x(patch, T(C.plaster2), 'opacity=".6"');
    s.p(c.cut([[H.x0 - 10, H.top - 16], [H.x1 + 10, H.top - 16], [H.x1 + 10, H.top + 4], [H.x0 - 10, H.top + 4]], 0.4, 8), T(C.roof));
    s.p(c.ribbon([[H.d0 - 5, H.floor], [H.d0 - 5, H.dTop + 30]], 8) + c.ribbon([[H.d1 + 5, H.floor], [H.d1 + 5, H.dTop + 30]], 8) + c.ribbon(c.arc((H.d0 + H.d1) / 2, H.dTop + 30, (H.d1 - H.d0) / 2 + 5, 39, PI, 2 * PI, 10), 8), C.wood2);
    // a small window, a vine, a water jar by the door
    s.p(c.cut(c.rect(1180, 500, 44, 40), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
    s.p(c.ribbon([[1176, 544], [1228, 544]], 5), C.wood2);
    let vine = '';
    for (let i = 0; i < 9; i++) vine += c.cut(c.blob(H.x0 + 10 + i * 30, H.top + 6 + (i % 2) * 8, 16, 10, 8, 0.2), 0.5, 4);
    s.p(vine, T(C.moss));
    s.p(c.cut([[1158, 706], [1150, 680], [1156, 660], [1168, 654], [1180, 660], [1186, 680], [1178, 706]], 0.4, 5), C.pot);
    fac.add(s.out());
  }
  return {
    sk, hangL, sunEl, cl, inL, door, gy, floor: 706,
    jer: [JX, f1.fn(JX) - 20], vil: [VX, m1.fn(VX) - 10],
    front() {
      const fg = S.layer({ par: 0.9, sh: 6 });
      fg.add(bush(c, -40, 1010, 250, T(C.moss), T(C.sage)) + bush(c, 1660, 1010, 240, T(C.moss2), T(C.sage)) + grass(c, { x0: -700, x1: 300, y: 985, n: 20, h: 40, color: T(C.moss2) }) + grass(c, { x0: 1300, x1: 2300, y: 985, n: 20, h: 40, color: T(C.moss2) }) + flowers(c, { x0: 120, x1: 360, y: 985, n: 8, h: 36 }) + flowers(c, { x0: 1240, x1: 1480, y: 985, n: 8, h: 36 }));
      return fg;
    },
  };
}

/**
 * Inside the sisters' house (a cut-away room): the door on the left, the window on the right with the hills of
 * Bethany outside, Lazarus's bed under the window. Returns { sk, outL, floor, bedX, door, win, front() }.
 */
export const HOME = { x0: 420, x1: 1180, floor: 690, ceil: 290, bedX: 860 };
export function homeSet(S, { skyCols = WARM } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const outL = S.layer({ par: 0.12, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [16, 6, 2], lens: [700, 240, 90], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
  let hs = '';
  [[1010, 1], [1080, 0.8], [360, 1], [460, 0.8]].forEach(([x, s]) => { hs += house(c, x, h1.fn(x) + 10, 60 * s, 44 * s, { stairs: false }); });
  outL.add(`<g transform="translate(1120 330)">${sun(c, 30)}</g>` + h1.markup + hs + olive(c, 1000, h1.fn(1000) + 60, 0.6) + band(c, { y: 560, amps: [4, 2], lens: [400, 140], color: mix(C.hillNear, C.sand, 0.4) }).markup);
  const hs3 = houseSection(c, { x0: HOME.x0, x1: HOME.x1, floor: HOME.floor, ceil: HOME.ceil, doorX: 50, doorW: 96, doorH: 196 });
  const back = S.layer({ par: 0.3, sh: 3 });
  back.add(hs3.back);
  // a lamp niche and a hanging lamp; the bed under the window
  const props = S.layer({ par: 0.3, sh: 4 });
  props.add(`<g transform="translate(${HOME.bedX} ${HOME.floor + 6})">${bedFrame(c, 250)}</g>`);
  return {
    sk, outL, back, props, floor: HOME.floor, bedX: HOME.bedX, door: hs3.door, win: hs3.win,
    front() {
      const f = S.layer({ par: 0.32, sh: 6 });
      f.add(hs3.front);
      return f;
    },
  };
}

/**
 * The tomb at Bethany: a rock face on the right with a cave mouth (DOOR), the round stone lying against it,
 * olive trees and the village far behind. Returns { sk, hangL, sunEl, cl, caveL, caveGlow, stoneL, stone, DOOR, front() }.
 * caveL is behind the rock (seen only through the doorway); stoneL is just in front of it.
 */
export const DOOR = { x: 1070, y: 694, w: 112, h: 156 };
export function tombSet(S, { skyCols = EVENING, sunAt = [470, 250], tint = 0 } = {}) {
  const c = S.c;
  const T = (col) => (tint ? mix(col, C.duskViolet, tint) : col);
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 3 });
  const sunEl = hanging(hangL, sun(c, 40), { x: sunAt[0], y: sunAt[1], len: 420 });
  const cl = hanging(hangL, cloud(c, 160), { x: 900, y: 150, len: 300 });
  const far = S.layer({ par: 0.08, sh: 2 });
  const f1 = band(c, { y: 458, amps: [16, 7, 3], lens: [900, 300, 120], color: T(mix(C.hillFar, C.duskViolet, 0.2)) });
  let vil = '';
  [[500, 1], [560, 0.8], [620, 1.1], [690, 0.9]].forEach(([x, s], i) => { vil += house(c, x, f1.fn(x) + 10 - (i % 2) * 6, 40 * s, 30 * s, { wall: T(C.plaster), shadow: T(C.plaster2), stairs: false }); });
  far.add(f1.markup + vil);
  const mid = S.layer({ par: 0.16, sh: 3 });
  const m1 = hillsWith(c, { y: 540, amps: [14, 6, 2], lens: [800, 260, 100], color: T(C.hillMid), trees: 22, treeColor: T(C.sage), treeH: 22 });
  mid.add(m1.markup + olives(c, m1.fn, [220, 380, 640, 820], 0.55, 0.1) + cypress(c, 900, m1.fn(900) + 8, 110, T(C.moss2)) + cypress(c, 940, m1.fn(940) + 8, 80, T(C.moss2)));
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gy = c.wave(648, [5, 2], [600, 200]);
  const gs = sheet();
  gs.p(c.ridge(gy, -1400, 2800, 1700, 12, 1), T(mix(C.hillNear, C.sand, 0.45)));
  gs.p(c.ribbon(c.cbez([-900, 780], [100, 740], [700, 730], [DOOR.x, DOOR.y + 8], 30), (u) => 150 - u * 70, 2), T(C.sand));
  ground.add(gs.out() + olive(c, 250, 700, 1.1, { leaf: T(C.olive), leaf2: T(C.sage) }) + grass(c, { x0: -800, x1: 2400, y: 648, fn: gy, n: 46, h: 14, color: T(C.moss) }));
  // the cave (dark inside, a light that can come)
  const X = DOOR.x, Y = DOOR.y, W = DOOR.w, H = DOOR.h;
  const caveL = S.layer({ par: 0.44, sh: 1 });
  caveL.add(`<rect x="${X - W}" y="${Y - H - 40}" width="${W * 2}" height="${H + 60}" fill="${mix(C.soilRich, C.storm2, 0.45)}"/>` + sheet().p(c.cut([[X - W, Y - 30], [X + W, Y - 36], [X + W, Y + 20], [X - W, Y + 20]], 0.4, 6), mix(C.soilDark, C.storm2, 0.3)).out());
  const caveGlow = caveL.add(`<g opacity="0"><rect x="${X - W}" y="${Y - H - 40}" width="${W * 2}" height="${H + 60}" fill="${C.lampGlow}" opacity=".55"/><circle cx="${X}" cy="${Y - H * 0.45}" r="${H}" fill="url(#halo-glow)"/></g>`);
  const rockL = S.layer({ par: 0.44, sh: 4 });
  const r = sheet();
  const dp = [[X - W / 2, Y + 2], [X - W / 2, Y - H + W / 2], ...c.arc(X, Y - H + W / 2, W / 2, W * 0.42, PI, 2 * PI, 12), [X + W / 2, Y - H + W / 2], [X + W / 2, Y + 2]];
  const rockPts = [[X - 250, Y + 16], [X - 226, Y - 80], [X - 180, Y - 190], [X - 100, Y - 260], [X + 10, Y - 290], [X + 140, Y - 300], [X + 290, Y - 270], [X + 420, Y - 210], [X + 520, Y - 120], [X + 600, Y + 16]];
  r.p(c.cut(rockPts, 3, 12) + c.hole(dp, 0.5, 6), T(C.rock));
  r.x(c.cut(c.blob(X + 150, Y - 220, 70, 24, 9, 0.3), 1, 6) + c.cut(c.blob(X - 120, Y - 180, 50, 20, 9, 0.3), 1, 6) + c.cut(c.blob(X + 300, Y - 130, 46, 18, 9, 0.3), 1, 6), shade(C.rock, 0.28), 'opacity=".65"');
  r.x(c.cut(c.blob(X - 170, Y - 50, 50, 18, 9, 0.3), 1, 6) + c.cut(c.blob(X + 260, Y - 40, 60, 16, 9, 0.3), 1, 6), shade(C.rock, -0.1), 'opacity=".5"');
  r.p(c.ribbon([[X - W / 2 - 6, Y], [X - W / 2 - 6, Y - H + W / 2], ...c.arc(X, Y - H + W / 2, W / 2 + 6, W * 0.42 + 6, PI, 2 * PI, 12), [X + W / 2 + 6, Y - H + W / 2], [X + W / 2 + 6, Y]], 7), shade(C.rock, -0.1));
  r.p(c.cut(c.blob(X - 40, Y - 288, 40, 12, 9, 0.3), 0.8, 5) + c.cut(c.blob(X + 190, Y - 296, 34, 12, 9, 0.3), 0.8, 5) + c.cut(c.blob(X + 420, Y - 206, 30, 12, 9, 0.3), 0.8, 5), T(C.moss));
  r.p(c.cut([[X - 110, Y + 4], [X + 150, Y + 2], [X + 150, Y + 16], [X - 110, Y + 18]], 0.4, 8), C.rock3);
  rockL.add(r.out());
  const stoneL = S.layer({ par: 0.46, sh: 5 });
  const stone = stoneL.add(`<g>${slab(c, 80)}</g>`);
  return {
    sk, hangL, sunEl, cl, caveL, caveGlow, rockL, stoneL, stone, DOOR, gy,
    front() {
      const fg = S.layer({ par: 0.9, sh: 6 });
      fg.add(bush(c, -40, 1010, 250, T(C.moss), T(C.sage)) + bush(c, 1680, 1010, 240, T(C.moss2), T(C.sage)) + grass(c, { x0: -700, x1: 300, y: 985, n: 20, h: 40, color: T(C.moss2) }) + grass(c, { x0: 1300, x1: 2300, y: 985, n: 20, h: 40, color: T(C.moss2) }));
      return fg;
    },
  };
}

/* ================================================================== the council */
import { chamber as chamber14, table as table14, priest as priest14, priestOpts as priestOpts14, highPriest as hp14, HP as HP14, hangingLamp as lamp14, lampGlow as lampGlow14 } from '../mark14/lib.js';
import { shadowPerson as shadowP3 } from '../mark3/lib.js';
import { leaderOpts as leader5 } from '../john5/lib.js';

/**
 * The chief priests' chamber (Mk 14's): the arched window onto Jerusalem, the table under a hanging lamp, the
 * priests and Pharisees with their big shadows on the wall. Caiaphas stands behind the middle of the table.
 * Returns { R, FLOOR, TOP, lamp, lampFl, lampGl, fxBack, cast:[{k,x,y,s,flip,p,sh}], pose(m, {…}) , idle(T) }.
 * fxBack: a layer between the wall and the people (for shadows of other things, e.g. the eagle).
 */
export function councilSet(S, { skyCols = ['#5b5a8c', '#b58a9b', '#e7ae93'] } = {}) {
  const c = S.c;
  const R = chamber14(S, { skyCols });
  const FLOOR = R.FLOOR, TOP = FLOOR - 100;
  const SH = '#2a2034';
  // phone: the two Pharisees in front stand closer in, inside the narrow screen
  const cast = [
    { k: 'ph0', o: leader5(0), m: () => person(c, leader5(0)), x: S.portrait ? 528 : 500, y: FLOOR + 10, s: 1.0, flip: false, front: true },
    { k: 'pr1', o: priestOpts14(1), m: () => priest14(c, 1), x: 650, y: FLOOR - 26, s: 0.94, flip: false },
    { k: 'hp', o: HP14, m: () => hp14(c), x: 820, y: FLOOR - 26, s: 0.98, flip: true },
    { k: 'pr2', o: priestOpts14(2), m: () => priest14(c, 2), x: 975, y: FLOOR - 26, s: 0.94, flip: true },
    { k: 'ph1', o: leader5(1), m: () => person(c, leader5(1)), x: S.portrait ? 1072 : 1110, y: FLOOR + 10, s: 1.0, flip: true, front: true },
  ];
  cast.forEach((m, i) => {
    m.i = i; m.seed = c.rr(0, 9);
    m.sh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".16">${shadowP3(c, m.o, SH)}</g>`).firstElementChild);
  });
  const fxBack = S.layer({ par: 0.34, sh: 0, flat: true });
  const lampL = S.layer({ par: 0.44, sh: 3 });
  const lampGl = lampL.add(lampGlow14(800, 330));
  const lamp = hanging(lampL, `<g transform="translate(-6 0)">${lamp14(c)}</g>`, { x: 800, y: 330, len: 100 });
  const lampFl = lamp.querySelector('.flame');
  const back = S.layer({ par: 0.5, sh: 5 });
  cast.filter((m) => !m.front).forEach((m) => { m.p = S.puppet(back.add(m.m())); });
  const tabL = S.layer({ par: 0.52, sh: 6 });
  tabL.add(`<g transform="translate(800 ${FLOOR})">${table14(c, 360, 100)}</g>`);
  const front = S.layer({ par: 0.56, sh: 5 });
  cast.filter((m) => m.front).forEach((m) => { m.p = S.puppet(front.add(m.m())); });
  return {
    R, FLOOR, TOP, lamp, lampFl, lampGl, fxBack, back, tabL, front, cast,
    /** pose a member and his shadow (thrown away from the lamp, `grow` makes it loom) */
    pose(m, p, grow = 0) {
      m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, ...p });
      const x = p.x ?? m.x;
      m.sh.set({ ...p, x: x + (x - 800) * 0.55, y: 700, s: m.s * (1.18 + grow), flip: m.flip, o: 1 });
    },
    idle(T, lit = 1) {
      pose(lamp, { x: 800, y: 330, r: Math.sin(T * 0.8) * 1 });
      pose(lampFl, { x: 32, y: 36, sx: 1 + Math.sin(T * 7) * 0.08, sy: 1 + Math.sin(T * 5.3) * 0.12 });
      attr(lampGl, 'opacity', lit);
    },
  };
}

/** the Roman standard: an eagle on a pole with a wreath and a plaque (origin: foot of the pole); col for a shadow */
export function eagleStandard(c, col = C.sun, h = 300) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0, -h]], 7), col);
  s.p(c.cut(c.rect(-34, -h * 0.55, 68, 44), 0.4, 5), col);
  s.x(c.ribbon(c.arc(0, -h * 0.72, 22, 22, 0, PI * 2, 18), 5), col);
  // the eagle: spread wings, head to the side
  const E = [[0, -h - 6], [-14, -h - 16], [-38, -h - 44], [-64, -h - 52], [-52, -h - 34], [-70, -h - 36], [-50, -h - 20], [-60, -h - 18], [-28, -h - 6], [-12, -h + 8], [0, -h + 2], [12, -h + 8], [28, -h - 6], [60, -h - 18], [50, -h - 20], [70, -h - 36], [52, -h - 34], [64, -h - 52], [38, -h - 44], [14, -h - 16], [10, -h - 30], [16, -h - 40], [4, -h - 38]];
  s.p(c.cut(E, 0.5, 4), col);
  return s.out();
}
/** a crowd of little heads and shoulders (the nation / the scattered), origin centre; n figures in rows */
export function peopleIcon(c, n = 9, col = C.inkSoft, w = 120) {
  let d = '';
  const rows = Math.ceil(n / 5);
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / 5), k = i % 5, per = Math.min(5, n - r * 5);
    const x = (k - (per - 1) / 2) * (w / 5) + (r % 2) * 6, y = (r - (rows - 1) / 2) * 30;
    d += c.cut(c.circ(x, y - 12, 6, 10), 0.2, 3) + c.cut([[x - 10, y + 12], [x - 8, y - 3], [x + 8, y - 3], [x + 10, y + 12]], 0.2, 3);
  }
  return `<path d="${d}" fill="${col}"/>`;
}
/** the chief priests' order, nailed up (origin: its top centre) */
export function notice(c, { w = 150, h = 190 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, -3], [w / 2 + 4, h], [-w / 2 - 2, h + 3]], 0.8, 8), C.parchment);
  let lines = '';
  for (let i = 0; i < 7; i++) { const y = 70 + i * 14, l = w * (i === 6 ? 0.45 : 0.76); lines += c.ribbon([[-w * 0.38, y], [-w * 0.38 + l, y + c.rr(-1, 1)]], 1.6); }
  s.x(lines, C.ink, 'opacity=".5"');
  s.p(c.cut(c.circ(0, 12, 5, 8), 0.2, 2), C.rock3);
  return s.out() + `<g transform="translate(0 38)">${miniHead(c, CAST.jesus, 18)}</g><g transform="translate(${w * 0.3} ${h - 22})"><path d="${c.cut(c.blob(0, 0, 15, 14, 12, 0.1), 0.6, 3)}" fill="${shade(C.terracotta, -0.2)}"/></g>`;
}
