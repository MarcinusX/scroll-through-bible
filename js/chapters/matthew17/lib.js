// Matthew 17 — the cast and cut-outs of this chapter: the high mountain of the Transfiguration (Mark 9's zig-zag
// path, the summit above a sea of clouds, Moses with his tablets and Elijah with his wheel of fire), the plain at
// its foot with the father and his boy, the house where the disciples ask why they could not, the mountain that
// moves at a word of faith as small as a mustard seed, Capernaum by the lake with the collectors of the Temple tax,
// a painted flat of a king taking tribute from strangers while his sons go free, and the fish with a silver
// stater in its mouth. Mark 9's people and plates are reused so the same events look the same in both Gospels.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, waterBand, hillsWith, palm, cloud, sun, olive, rock, grass, town, cypress, bush } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';
import { houseSection, plainSet, TWELVE } from '../mark9/lib.js';
import { crowdMarkup } from '../matthew12/lib.js';
import { pose3 } from '../matthew4/lib.js';

export { LOOK as L9, JESUS_WHITE, tablets, fireWheel, tent, arcRings, bubble, thought, GLYPH, sparkle, withFace, faceBits, strip, TWELVE, along, plate, sealedScroll, tombHill, shadowPerson, JOHN_B, candle, scrollOpen, speech, plainSet, PLAIN_ROWS, shout, wisp, dangerPlate, seizurePlate, shadowShards, flecks, spark, kf, houseSection, question, emptyBowl, reachingHand, silhouette, dust, nameTag, voiceRings, headAt, handAt, paperHand, heart, stoneHeart } from '../mark9/lib.js';
export { prisonWall, bars, hang2 } from '../mark1/lib.js';
export { coin } from '../mark2/lib.js';
export { hourglass } from '../mark13/lib.js';
export { crown } from '../mark6/lib.js';
export { throne } from '../mark12/lib.js';
export { lakeShore, cloudSea, pose3 } from '../matthew4/lib.js';
export { crowdMarkup };
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== skies */
export const MORN = ['#c3d8d8', '#e8e6d2', '#f4e2c6'];
export const HIGH = ['#b9d3d8', '#dfe7de', '#f1e8d6'];
export const GLORY = ['#e9d9b0', '#f8ebc6', '#fff4da'];
export const DAY = ['#c6dad8', '#ece5cf', '#f5e4c8'];
export const DIM = ['#a9b3bd', '#d7d0c4', '#e6d6c0'];
export const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
export const EVENING = ['#6f6f9c', '#d8a58f', '#efc39c'];
export const NIGHT = ['#27305e', '#46508a', '#8b7fa6'];
export const DEEP = ['#141a3d', '#26306a', '#4b5791'];
export const DAWN = ['#a9b8d6', '#f4cfa8', '#f9dcb4'];
export const LAKE = ['#bcd8d8', '#e6ecdc', '#f5ead0'];

/* ================================================================== the cast */
/** the two collectors of the Temple's half-shekel (the didrachma) */
export const COLLECTORS = [
  { robe: C.linen2, mantle: C.dustyBlue, hairStyle: 'wrap', veil: C.linen, veil2: C.stone2, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin2, belt: C.ochre },
  { robe: C.wheatRobe, mantle: mix(C.tealRobe, C.stone2, 0.3), hairStyle: 'wrap', veil: C.stone, veil2: C.stone2, beard: 'short', hair: C.hair3, skin: C.skin3, belt: C.leather },
];
/** the king of the painted flat, his sons, and the strangers who bring him tribute */
export const KING = { robe: C.plumRobe, mantle: C.terracotta, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full' };
export const PRINCES = [
  { robe: mix(C.roseRobe, C.cream, 0.3), mantle: C.lavender, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'curly', beard: 'none' },
  { robe: mix(C.skyVeil, C.cream, 0.3), mantle: mix(C.plumRobe, C.roseRobe, 0.4), belt: C.sun, skin: C.skin, hair: C.hair2, hairStyle: 'short', beard: 'none' },
];
export const STRANGERS = [
  { robe: mix(C.stone2, C.dune, 0.4), mantle: null, hairStyle: 'wrap', veil: C.clay, veil2: shade(C.clay, -0.15), beard: 'full', hair: C.hair, skin: C.skin4, belt: C.rope },
  { robe: C.sageRobe, mantle: C.ochreRobe, hairStyle: 'short', beard: 'short', hair: C.hair2, skin: C.skin3, belt: C.leather },
  { robe: mix(C.dune, C.sand2, 0.5), mantle: null, hairStyle: 'wrap', veil: C.linen2, veil2: C.stone2, beard: 'wild', hair: C.greyHair, beardColor: C.greyHair, skin: C.skin3, belt: C.rope },
];

/* ================================================================== things */
/** the silver stater (a Tyrian shekel: an eagle on the back); origin: centre */
export function stater(c, r = 20) {
  const silver = mix(C.stone, C.skyVeil, 0.35);
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 22), 0.3, 3), shade(silver, -0.12));
  s.p(c.cut(c.circ(0, 0, r * 0.84, 20), 0.3, 3), silver);
  // the eagle: body, spread wing, head and tail, cut in a darker silver
  const k = r / 20;
  const eagle = [[-4, 8], [-7, -1], [-4, -8], [0, -12], [4, -10], [3, -6], [6, -3], [12, -8], [10, 0], [6, 4], [4, 10], [0, 12]].map(([x, y]) => [x * k, y * k]);
  s.p(c.cut(eagle, 0.2, 3), shade(silver, -0.22));
  s.x(c.poly(c.circ(1.5 * k, -9.5 * k, 0.9 * k, 6)), C.ink);
  let dots = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; dots += c.poly(c.circ(Math.cos(a) * r * 0.74, Math.sin(a) * r * 0.74, 0.9 * k, 5)); }
  s.x(dots, shade(silver, -0.25), 'opacity=".7"');
  s.x(c.ribbon(c.arc(0, 0, r * 0.62, r * 0.62, PI * 1.1, PI * 1.45, 6), 2 * k), '#fff', 'opacity=".6"');
  return s.out();
}
/** a fish seen from the side, facing right; its lower jaw is .jaw (rotate it to open the mouth, pivot at 0,0 of the
 *  jaw group) and the coin inside is .inCoin; origin: centre */
export function bigFish(c, { w = 90, col = C.lake3 } = {}) {
  const h = w * 0.36;
  const s = sheet();
  // tail
  s.p(c.cut([[-w * 0.42, 0], [-w * 0.62, -h * 0.62], [-w * 0.56, 0], [-w * 0.62, h * 0.62]], 0.4, 4), shade(col, -0.1));
  // body (upper jaw included), mouth notch at the right
  s.p(c.cut([[-w * 0.44, 0], [-w * 0.2, -h * 0.52], [w * 0.14, -h * 0.5], [w * 0.4, -h * 0.26], [w * 0.5, -h * 0.04], [w * 0.36, 0], [w * 0.3, h * 0.12], [w * 0.1, h * 0.46], [-w * 0.2, h * 0.46]], 0.4, 5), col);
  s.p(c.cut([[-w * 0.3, h * 0.12], [w * 0.2, h * 0.14], [w * 0.1, h * 0.4], [-w * 0.2, h * 0.4]], 0.3, 4), mix(col, C.cream, 0.55));
  // fins and scales
  s.p(c.cut([[-w * 0.08, -h * 0.5], [w * 0.06, -h * 0.84], [w * 0.14, -h * 0.5]], 0.3, 3) + c.cut([[-w * 0.02, h * 0.1], [-w * 0.18, h * 0.3], [w * 0.06, h * 0.22]], 0.3, 3), shade(col, 0.14));
  let sc = '';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) sc += c.ribbon(c.arc(-w * 0.18 + i * w * 0.12, -h * 0.18 + j * h * 0.22, h * 0.14, h * 0.14, -PI * 0.4, PI * 0.4, 5), 1.2);
  s.x(sc, shade(col, -0.22), 'opacity=".5"');
  s.x(c.poly(c.circ(w * 0.3, -h * 0.2, 2.6, 8)), C.cream);
  s.x(c.poly(c.circ(w * 0.305, -h * 0.2, 1.4, 6)), C.ink);
  s.x(c.ribbon(c.arc(w * 0.18, -h * 0.05, h * 0.3, h * 0.4, -PI * 0.35, PI * 0.35, 6), 1.4), shade(col, -0.25), 'opacity=".6"');
  // the coin, just inside the mouth, and the lower jaw hinged at the corner of the mouth
  const jaw = sheet().p(c.cut([[0, 0], [w * 0.18, -h * 0.02], [w * 0.2, h * 0.1], [w * 0.02, h * 0.24], [-w * 0.1, h * 0.2]], 0.3, 4), shade(col, -0.06)).out();
  return `<g class="inCoin" transform="translate(${(w * 0.4).toFixed(1)} ${(h * 0.02).toFixed(1)})">${stater(c, h * 0.26)}</g>${s.out()}<g class="jaw" transform="translate(${(w * 0.3).toFixed(1)} ${(h * 0.08).toFixed(1)})">${jaw}</g>`;
}
/** a fishing rod (a cane with a line wound at the grip); origin: the grip end, the rod points along +x */
export function rod(c, len = 190) {
  return sheet().p(c.ribbon([[0, 0], [len * 0.5, -1], [len, 0]], (t) => 5 - t * 3.4), C.wood3)
    .p(c.ribbon([[10, 0], [34, 0]], 7), C.rope).out();
}
/** a hook on its line: the line hangs from 0,0 down 100 units (scale sy to lengthen); the hook is separate */
export function lineDown(len = 100) {
  return `<path d="M0 0V${len}" stroke="${mix(C.ink, C.stone2, 0.5)}" stroke-width="1.2" fill="none"/>`;
}
export function hook(c, r = 6) {
  return `<path d="${c.ribbon([[0, -6], [0, r * 1.4], ...c.arc(-r * 0.7, r * 1.4, r * 0.7, r * 0.8, 0, PI * 1.1, 6)], 1.6)}" fill="${C.stone2}"/>`;
}
/** the Temple-tax chest (a wooden box with a brass trumpet-mouth for the coins); origin: base centre */
export function taxChest(c, w = 60) {
  const h = w * 0.62;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.4, 6), C.wood);
  s.p(c.cut(c.rect(-w / 2 - 3, -h - 6, w + 6, 8), 0.3, 5), C.wood2);
  s.x(c.ribbon([[-w / 2 + 4, -h * 0.5], [w / 2 - 4, -h * 0.5]], 2), C.wood2);
  // the trumpet
  s.p(c.cut([[-5, -h - 6], [-3, -h - 22], [-12, -h - 34], [12, -h - 34], [3, -h - 22], [5, -h - 6]], 0.3, 4), C.sun);
  s.p(c.cut(c.ell(0, -h - 34, 12, 3.5, 10), 0.2, 3), shade(C.sun, -0.3));
  s.x(c.poly(c.circ(0, -h * 0.5, 3.2, 8)), C.sun);
  return s.out();
}
/** a mustard seed under a round magnifying glass (after Mark 4); origin: lens centre */
export function mustardGlass(c, r = 60) {
  const s = sheet();
  s.p(c.ribbon([[r * 0.66, r * 0.66], [r * 1.4, r * 1.4]], 12), C.wood2);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.3, 5), C.ochre);
  s.x(c.poly(c.circ(0, 0, r * 0.86, 40)), C.skyVeil, 'opacity=".92"');
  const seed = sheet().x(c.poly(c.circ(0, 0, 9, 22)), mix(C.sunDeep, C.wood2, 0.3)).x(c.poly(c.circ(3.4, 2.6, 4.4, 14)), C.sunDeep).x(c.poly(c.circ(-1.2, 5.6, 1.3, 8)), C.soilDark).out();
  return `${s.out()}<circle r="${r * 0.5}" fill="url(#warm-glow)" opacity=".7"/>${seed}<path d="${c.ribbon(c.arc(0, 0, r * 0.66, r * 0.66, PI * 1.1, PI * 1.45, 8), 5)}" fill="${C.cream}" opacity=".75"/>`;
}
/** a tiny mustard seed (to lie in a palm); origin: centre */
export function seedDot(c, r = 3) {
  return `<circle r="${r * 5}" fill="url(#warm-glow)"/><path d="${c.poly(c.circ(0, 0, r, 12))}" fill="${mix(C.sunDeep, C.wood2, 0.3)}"/>`;
}
/** a mountain cut from one sheet, snow on its crown and trees on its shoulders, hung from the flies by two strings;
 *  origin: base centre */
export function flatMountain(c, { w = 420, h = 330, col = mix(C.hillNear, C.rock, 0.3) } = {}) {
  const s = sheet();
  const prof = [[-w / 2, 0], [-w * 0.34, -h * 0.3], [-w * 0.2, -h * 0.58], [-w * 0.08, -h * 0.9], [0, -h], [w * 0.08, -h * 0.94], [w * 0.2, -h * 0.66], [w * 0.36, -h * 0.34], [w / 2, 0]];
  s.p(c.cut(prof, 1.2, 10), col);
  s.p(c.cut([[-w * 0.2, -h * 0.58], [-w * 0.08, -h * 0.9], [0, -h], [-w * 0.02, -h * 0.6], [-w * 0.12, -h * 0.2], [-w * 0.3, -h * 0.1]], 0.8, 8), shade(col, -0.08), 'opacity=".8"');
  s.p(c.cut([[-w * 0.1, -h * 0.87], [0, -h], [w * 0.08, -h * 0.94], [w * 0.13, -h * 0.8], [w * 0.06, -h * 0.84], [0, -h * 0.78], [-w * 0.05, -h * 0.84]], 0.6, 6), C.cream);
  s.p(c.cut([[-w / 2, 0], [-w * 0.3, -h * 0.08], [0, -h * 0.05], [w * 0.3, -h * 0.1], [w / 2, 0], [w / 2, 8], [-w / 2, 8]], 0.6, 8), mix(C.sage, C.hillNear, 0.5));
  let tr_ = '';
  [[-w * 0.3, -h * 0.12], [-w * 0.26, -h * 0.1], [w * 0.27, -h * 0.14], [w * 0.31, -h * 0.1]].forEach(([x, y]) => { tr_ += c.cut([[x - 7, y], [x, y - 34], [x + 7, y]], 0.3, 4); });
  s.p(tr_, C.moss2);
  return s.out();
}
/** a painted flat's frame: an arched board with a gilt rim; origin: bottom centre. Returns { back, rim } */
export function archFlat(c, { w = 560, h = 380, bg = mix(C.parchment, C.sand, 0.3) } = {}) {
  const arch = (dw, dh) => [[-w / 2 - dw, dh], [-w / 2 - dw, -h + w * 0.18], ...c.arc(0, -h + w * 0.18, w / 2 + dw, w * 0.18 + dh, PI, 2 * PI, 20), [w / 2 + dw, dh]];
  const back = sheet().p(c.cut(arch(10, 10), 0.6, 8), C.haloRim).p(c.cut(arch(0, 0), 0.6, 8), bg).out();
  return { back };
}

/* ================================================================== sets */
/**
 * Capernaum by the lake (after Mark 9's house of Capernaum): the lake with boats behind, palms along the shore,
 * a signboard, and — optionally — a house cut open. Returns handles, including H (the house section) if house.
 */
export function capSet(S, { house = true, X0 = 480, X1 = 1120, FLOOR = 650, CEIL = 300, par = 0.4, skyCols = DAY, sign = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 140, len: 800 });
  const cl = hanging(hangL, cloud(c, 170), { x: 420, y: 150, len: 700 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 2], lens: [1000, 340, 120], color: C.hillFar }).markup);
  const lakeL = S.layer({ par: 0.16, sh: 2 });
  lakeL.add(waterBand(c, { y: 470, color: C.lake, foamN: 20 }).markup);
  const b = boat(c, { mast: true });
  lakeL.add(`<g transform="translate(250 500) scale(.3)">${b.back}${b.front}</g><g transform="translate(1350 492) scale(.24)">${b.back}${b.front}</g>`);
  const shoreL = S.layer({ par: 0.3, sh: 3 });
  shoreL.add(sheet().p(c.cut([[-900, 548], [2500, 548], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.3)).out());
  shoreL.add(palm(c, 250, 560, 190) + palm(c, 1330, 562, 170) + olive(c, 1460, 566, 0.8) + rock(c, 380, 600, 50, 20));
  if (sign) {
    const signL = S.layer({ par, sh: 4 });
    signL.add(`<g transform="translate(250 ${FLOOR - 40})">${sheet().p(c.cut(c.rect(-4, -120, 8, 122), 0.3, 6), C.wood2).p(c.cut([[-70, -118], [70, -118], [84, -100], [70, -82], [-70, -82]], 0.4, 6), C.wood3).out()}<text x="4" y="-93" text-anchor="middle" font-family="${FONT}" font-size="21" font-style="italic" fill="${C.ink}">${tr('Kafarnaum', 'Capernaum')}</text></g>`);
  }
  let H = null, houseL = null;
  if (house) {
    H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL, doorX: 60 });
    houseL = S.layer({ par, sh: 4 });
    houseL.add(H.back);
  }
  return {
    c, sk, hangL, H, houseL, lakeL,
    update(T) {
      swing(sunEl, 1240, 140, T, 1, 0.6);
      swing(cl, 420 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);
    },
  };
}

/** a painted flat hung on two strings: y goes from -1000 (in the flies) to its resting place */
export function flyIn(el, x, y, k, T, seed = 0) {
  pose(el, { x, y: lerp(-1100, y, k), r: Math.sin(T * 0.7 + seed) * 0.6 * k, oy: 0, o: k > 0.001 ? 1 : 0 });
}

/**
 * The plain at the foot of the mountain (Mark 9's plainSet) with its crowd as sprites — each group has a twin with
 * arms raised in joy (b) — and the nine disciples who could not heal the boy, standing on the right (a: still,
 * b: shrugging, empty-handed, heads down). Returns { set, groups, nine, FEET }.
 */
export function plainStage(S, { FEET = 724 } = {}) {
  const c = S.c;
  const set = plainSet(S);
  const crowdL = S.layer({ par: 0.34, sh: 3 });
  const GR = [
    { seed: 'mt17-pc-a', x: 470, y: 596, n: 12, s: 0.44, flip: false },
    { seed: 'mt17-pc-b', x: 1290, y: 594, n: 12, s: 0.42, flip: true },
    { seed: 'mt17-pc-c', x: 340, y: 626, n: 8, s: 0.52, flip: false },
    { seed: 'mt17-pc-d', x: 1420, y: 626, n: 8, s: 0.52, flip: true },
  ];
  const groups = GR.map((g, i) => ({
    ...g, i,
    a: crowdL.sprite(crowdMarkup(g.seed, g.n, { s: g.s, rows: 2, spread: 40, flip: g.flip, head: [-8, 2] }), g.x, g.y),
    b: crowdL.sprite(crowdMarkup(g.seed, g.n, { s: g.s, rows: 2, spread: 40, flip: g.flip, armF: [60, 110], armB: [100, 160], head: [-10, -2] }), g.x, g.y),
  }));
  const nineL = S.layer({ par: 0.46, sh: 4 });
  const NINE = TWELVE.filter((d) => !['peter', 'james', 'john'].includes(d.k));
  const nc = makeNine(c, NINE);
  const nine = { a: nineL.sprite(nc.a, 1130, FEET - 34), b: nineL.sprite(nc.b, 1130, FEET - 34) };
  return { set, groups, nine, FEET, crowdL, nineL };
}
function makeNine(c, NINE) {
  const mem = (shrug) => NINE.map((d, i) => ({ x: (i % 5) * 52 - 104 + (i >= 5 ? 26 : 0), y: i >= 5 ? 14 : 0, s: 0.86, flip: true, head: shrug ? 10 + (i % 3) * 3 : -4, armF: shrug ? 40 + (i % 2) * 30 : 10, armB: shrug ? 50 + (i % 3) * 20 : 6, o: d.o }));
  return { a: pose3(c, mem(false)), b: pose3(c, mem(true)) };
}

/** the front of Peter's house in Capernaum: plastered walls, a flat roof with a parapet, outside stairs, a tall open
 *  doorway (dark inside) and a window; origin: world coordinates (x0..x1, base) */
export function houseFront(c, { x0 = 360, x1 = 700, base = 660, top = 380, doorX = 200, doorW = 84, doorH = 200 } = {}) {
  const s = sheet();
  s.p(c.cut([[x0, base + 4], [x0, top], [x1, top], [x1, base + 4]], 0.8, 10), C.plaster);
  let patch = '';
  for (let i = 0; i < 6; i++) patch += c.cut(c.blob(c.rr(x0 + 30, x1 - 30), c.rr(top + 30, base - 60), c.rr(18, 40), c.rr(8, 18), 10, 0.2), 0.6, 6);
  s.x(patch, C.plaster2, 'opacity=".6"');
  s.p(c.cut([[x1, top + 6], [x1 + 40, top + 22], [x1 + 40, base + 4], [x1, base + 4]], 0.6, 8), C.plaster2);
  s.p(c.cut([[x0 - 8, top - 16], [x1 + 8, top - 16], [x1 + 8, top + 4], [x0 - 8, top + 4]], 0.5, 8), C.roof);
  let beams = '';
  for (let x = x0 + 20; x < x1; x += 46) beams += c.cut(c.rect(x - 5, top + 4, 10, 10), 0.3, 4);
  s.p(beams, C.wood2);
  const dx = x0 + doorX;
  s.p(c.cut([[dx - 6, base + 2], [dx - 6, base - doorH + 30], ...c.arc(dx + doorW / 2, base - doorH + 30, doorW / 2 + 6, 36, PI, 2 * PI, 10), [dx + doorW + 6, base + 2]], 0.4, 6), C.wood2);
  s.p(c.cut([[dx, base + 2], [dx, base - doorH + 30], ...c.arc(dx + doorW / 2, base - doorH + 30, doorW / 2, 30, PI, 2 * PI, 10), [dx + doorW, base + 2]], 0.4, 6), mix(C.soilDark, C.hair3, 0.4));
  const wx = x0 + 60;
  s.p(c.cut([[wx, top + 120], [wx, top + 70], ...c.arc(wx + 30, top + 70, 30, 22, PI, 2 * PI, 8), [wx + 60, top + 120]], 0.4, 5), mix(C.soilDark, C.hair3, 0.4));
  s.p(c.ribbon([[wx - 4, top + 123], [wx + 64, top + 123]], 6), C.wood2);
  // outside stairs up to the roof, on the right
  let st = '';
  for (let i = 0; i < 8; i++) st += c.cut(c.rect(x1 + 40 + i * 12, base - (i + 1) * ((base - top) / 9), 14, (i + 1) * ((base - top) / 9)), 0.3, 4);
  s.p(st, C.stone);
  return s.out();
}
/** a tiny Temple on a plate: the sanctuary front with its gold, and two coins of the half-shekel; origin: centre */
export function templeIcon(c, r = 60) {
  const s = sheet();
  s.p(c.cut([[-r * 0.6, r * 0.2], [-r * 0.6, -r * 0.3], [r * 0.6, -r * 0.3], [r * 0.6, r * 0.2]], 0.3, 5), C.stone);
  s.p(c.cut([[-r * 0.24, r * 0.2], [-r * 0.24, -r * 0.62], [r * 0.24, -r * 0.62], [r * 0.24, r * 0.2]], 0.3, 5), C.linen);
  s.p(c.cut([[-r * 0.28, -r * 0.62], [r * 0.28, -r * 0.62], [r * 0.28, -r * 0.7], [-r * 0.28, -r * 0.7]], 0.2, 4) + c.cut(c.rect(-r * 0.1, -r * 0.44, r * 0.2, r * 0.64), 0.2, 4), C.sun);
  let col = '';
  [-0.52, -0.4, 0.4, 0.52].forEach((k) => { col += c.cut(c.rect(r * k - 2, -r * 0.26, 4, r * 0.44), 0.1, 3); });
  s.x(col, C.stone2);
  s.p(c.cut(c.rect(-r * 0.72, r * 0.2, r * 1.44, 6), 0.2, 4), C.stone2);
  return s.out();
}
