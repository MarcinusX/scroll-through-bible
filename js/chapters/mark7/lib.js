// Mark 7 — this chapter's own cut-outs: Pharisees' washing things (stone jars, basins, copper pots,
// a dining couch), the stone tablets and little rule-scrolls, a paper face with lips, a paper doll
// with a heart and a stomach, a heart-shaped box and the dark little things that come out of it,
// puppies, the Syrophoenician woman and her daughter, the deaf man, words on paper tags.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, sky } from '../kit.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, hand, headAt, addToHead, scribe, townsfolk, thought, speech, GLYPH, spark, heart, scrap, bowl, loaf, cup, jug, lowTable, scrollOpen, candle, dust } from '../mark2/lib.js';

export { kf, moving, hand, headAt, addToHead, scribe, townsfolk, thought, speech, GLYPH, spark, heart, scrap, bowl, loaf, cup, jug, lowTable, scrollOpen, candle, dust };

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- colours of this chapter ---------- */
export const COPPER = mix(C.clay, C.sun, 0.35);
export const PURPLE = mix(C.plumRobe, C.indigo, 0.3);          // Tyrian purple, softened for paper
export const MUREX = mix(C.plumRobe, C.curtain2, 0.45);        // the rosy purple of the dye
export const SEA = mix(C.lake, C.skyBlue2, 0.3);
export const DARK = mix(C.night2, C.soilDark, 0.35);           // the dark things out of the heart

/* ---------- the cast ---------- */
export const LOOK = {
  // the Syrophoenician woman: a Greek of Tyre, in purple, with a little gold
  woman: { robe: PURPLE, mantle: C.ochreRobe, hairStyle: 'veil', veil: MUREX, veil2: shade(MUREX, -0.14), hair: C.hair3, skin: C.skin2, belt: C.sun, mantleArm: false },
  girl: { robe: C.roseRobe, hairStyle: 'wrap', veil: C.blushVeil, hair: C.hair3, skin: C.skin2, beard: 'none' },
  deaf: { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.leather },
  father: { robe: C.stone, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'bald', beard: 'full', beardColor: C.greyHair, skin: C.skin3 },
  mother: { robe: C.mauve, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.greyHair, skin: C.skin2 },
  son: { robe: C.tealRobe, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather },
  servant: { robe: C.linen2, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin4, belt: C.leather },
};
/** the woman, with a small gold earring */
export function woman(c, extra = {}) {
  const ring = sheet().p(c.cut(c.circ(-3, 15, 2.6, 8), 0.2, 2), C.sun).out();
  return addToHead(person(c, { ...LOOK.woman, ...extra }), ring);
}
/** a Pharisee (i 0–2) or a scribe from Jerusalem (i ≥ 3, with a scroll in hand) */
export function pharisee(c, i = 0, extra = {}) {
  const hold = i >= 3 ? { holdF: ruleScroll(c, C.terracotta, 0.9) } : {};
  return scribe(c, i, { ...hold, ...extra });
}

/** a shadow-play cut-out of anybody: one dark colour, no blush, no halo */
export function shadowPerson(c, o, col = '#3b2a22') {
  const so = { ...o, robe: col, mantle: o.mantle ? shade(col, 0.06) : null, skin: col, hair: col, veil: col, veil2: col, beardColor: col, belt: o.belt ? shade(col, 0.1) : null, halo: false, holdF: '', holdB: '' };
  return person(c, so).split(`fill="${C.blush}"`).join(`fill="${col}"`);
}

/* ---------- washing things ---------- */
/** a tall stone water jar (Cana-style); origin: base centre */
export function stoneJar(c, h = 96, col = C.stone) {
  const w = h * 0.34;
  const s = sheet();
  s.p(c.cut([[-w * 0.7, 0], [-w, -h * 0.25], [-w * 1.04, -h * 0.62], [-w * 0.86, -h * 0.9], [-w * 0.72, -h], [w * 0.72, -h], [w * 0.86, -h * 0.9], [w * 1.04, -h * 0.62], [w, -h * 0.25], [w * 0.7, 0]], 0.7, 6), col);
  s.p(c.cut([[-w * 0.8, -h], [w * 0.8, -h], [w * 0.84, -h - 8], [-w * 0.84, -h - 8]], 0.4, 5), shade(col, -0.08));
  s.x(c.ribbon([[-w * 0.98, -h * 0.3], [w * 0.98, -h * 0.3]], 3) + c.ribbon([[-w * 0.98, -h * 0.66], [w * 0.98, -h * 0.66]], 3), shade(col, -0.16), 'opacity=".7"');
  s.x(c.cut(c.ell(-w * 0.45, -h * 0.5, w * 0.16, h * 0.2, 10), 0.3, 4), shade(col, 0.4), 'opacity=".6"');
  s.x(c.cut(c.ell(0, -h - 7, w * 0.62, 3, 12), 0.2, 3), C.lake2);
  return s.out();
}
/** a wide copper basin on a low stand; origin: base centre */
export function basin(c, w = 80) {
  const s = sheet();
  s.p(c.cut([[-w * 0.18, 0], [-w * 0.12, -16], [w * 0.12, -16], [w * 0.18, 0]], 0.3, 4), C.wood2);
  s.p(c.cut([[-w / 2, -40], [w / 2, -40], [w * 0.36, -20], [w * 0.2, -14], [-w * 0.2, -14], [-w * 0.36, -20]], 0.4, 5), COPPER);
  s.p(c.cut(c.ell(0, -40, w / 2 + 3, 5, 18), 0.3, 4), shade(COPPER, 0.15));
  s.x(c.cut(c.ell(0, -40, w / 2 - 4, 3, 16), 0.2, 3), C.lake);
  s.x(c.ribbon([[-w * 0.4, -30], [w * 0.4, -30]], 2), shade(COPPER, -0.25), 'opacity=".6"');
  return s.out();
}
/** a round copper pot with a lid and handles; origin: centre */
export function copperPot(c, r = 22) {
  const s = sheet();
  s.p(c.ribbon(c.arc(-r * 1.02, -r * 0.1, r * 0.3, r * 0.3, PI * 0.5, PI * 1.5, 8), 3.4) + c.ribbon(c.arc(r * 1.02, -r * 0.1, r * 0.3, r * 0.3, -PI * 0.5, PI * 0.5, 8), 3.4), shade(COPPER, -0.2));
  s.p(c.cut([[-r, -r * 0.5], [r, -r * 0.5], [r * 0.98, r * 0.2], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [-r * 0.98, r * 0.2]], 0.4, 5), COPPER);
  s.p(c.cut([[-r * 1.06, -r * 0.5], [r * 1.06, -r * 0.5], [r * 0.9, -r * 0.72], [-r * 0.9, -r * 0.72]], 0.3, 4), shade(COPPER, -0.12));
  s.p(c.cut(c.circ(0, -r * 0.84, r * 0.16, 8), 0.2, 3), shade(COPPER, -0.25));
  s.x(c.cut(c.ell(-r * 0.45, 0, r * 0.14, r * 0.34, 8), 0.2, 3), shade(COPPER, 0.4), 'opacity=".7"');
  return s.out();
}
/** a small dining couch (with a cushion), seen side-on; origin: centre of the seat */
export function couch(c, w = 110) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -4], [w / 2, -4], [w / 2, 8], [-w / 2, 8]], 0.4, 7), C.wood);
  s.p(c.cut([[-w / 2 - 4, -26], [-w / 2 + 8, -26], [-w / 2 + 8, 8], [-w / 2 - 4, 8]], 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w / 2 + 4, 8, 7, 22), 0.3, 4) + c.cut(c.rect(w / 2 - 11, 8, 7, 22), 0.3, 4), C.wood2);
  s.p(c.cut([[-w / 2 + 8, -4], [w / 2 - 2, -4], [w / 2 - 4, -16], [-w / 2 + 10, -18]], 0.5, 6), C.roseRobe);
  s.p(c.cut(c.blob(-w / 2 + 20, -24, 14, 9, 9, 0.12), 0.4, 4), C.skyVeil);
  let st = '';
  for (let x = -w / 2 + 18; x < w / 2 - 6; x += 16) st += c.cut(c.star(x, -10, 3.5, 1.5, 4, 0), 0.1, 2);
  s.x(st, C.cream, 'opacity=".8"');
  return s.out();
}
/** a falling stream of water from (0,0) down, 100 units long (scale sy to stretch) */
export function stream(c, len = 100, w = 7) {
  const pts = [[0, 0], [1.5, len * 0.3], [-1, len * 0.65], [0.5, len]];
  return `<path d="${c.ribbon(pts, (t) => w * (1 - t * 0.35))}" fill="${C.lake}" opacity=".9"/><path d="${c.ribbon(pts.map(([x, y]) => [x - w * 0.18, y]), (t) => w * 0.28 * (1 - t))}" fill="${C.foam}" opacity=".8"/>`;
}
export function drop(c, r = 3.4, col = C.lake2) {
  return `<path d="${c.cut([[0, -r * 2], [r * 0.9, -r * 0.2], [r * 0.7, r * 0.7], [0, r], [-r * 0.7, r * 0.7], [-r * 0.9, -r * 0.2]], 0.1, 2)}" fill="${col}"/>`;
}
/** a market basket with greens, onions and a fish; origin: base centre */
export function marketBasket(c, w = 56) {
  const s = sheet();
  s.p(c.cut(c.blob(-w * 0.2, -w * 0.5, w * 0.24, w * 0.16, 9, 0.2), 0.4, 4) + c.cut(c.blob(w * 0.16, -w * 0.52, w * 0.2, w * 0.18, 9, 0.2), 0.4, 4), C.leaf);
  s.p(c.cut(c.circ(-w * 0.02, -w * 0.46, w * 0.12, 10), 0.3, 3) + c.cut(c.circ(w * 0.3, -w * 0.42, w * 0.1, 10), 0.3, 3), C.apricot);
  s.p(c.cut([[-w * 0.44, -w * 0.5], [-w * 0.2, -w * 0.62], [0, -w * 0.58], [-w * 0.2, -w * 0.46]], 0.2, 3), C.lake3);
  s.p(c.cut([[-w / 2, -w * 0.42], [w / 2, -w * 0.42], [w * 0.4, 0], [-w * 0.4, 0]], 0.4, 5), C.basket);
  let weave = '';
  for (let i = 0; i < 3; i++) weave += c.ribbon([[-w * 0.46 + i * 2, -w * 0.3 + i * w * 0.12], [w * 0.46 - i * 2, -w * 0.3 + i * w * 0.12]], 2);
  s.x(weave, shade(C.basket, -0.25), 'opacity=".7"');
  s.p(c.ribbon(c.arc(0, -w * 0.42, w * 0.42, w * 0.46, PI, 2 * PI, 12), 3.4), shade(C.basket, -0.15));
  return s.out();
}
/** a market stall: striped awning on poles, a counter with baskets; origin: ground centre */
export function marketStall(c, w = 200, h = 170) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, 8, h), 0.3, 6) + c.cut(c.rect(w / 2 - 8, -h, 8, h), 0.3, 6), C.wood2);
  const aw = [[-w / 2 - 16, -h + 10], [-w / 2 + 6, -h - 26], [w / 2 - 6, -h - 26], [w / 2 + 16, -h + 10]];
  for (let x = w / 2 + 16; x > -w / 2 - 16; x -= 26) aw.push(...c.arc(x - 13, -h + 10, 13, 8, 0, PI, 5));
  s.p(c.cut(aw, 0.5, 7), C.cream);
  let stripes = '';
  for (let x = -w / 2 - 6; x < w / 2 + 10; x += 52) stripes += c.cut([[x, -h + 14], [x + 8, -h - 24], [x + 30, -h - 24], [x + 26, -h + 16]], 0.3, 5);
  s.x(stripes, C.sageRobe, 'opacity=".9"');
  s.p(c.cut([[-w / 2 - 6, -70], [w / 2 + 6, -70], [w / 2 + 6, -60], [-w / 2 - 6, -60]], 0.3, 7), C.wood);
  s.p(c.cut(c.rect(-w / 2, -60, w, 60), 0.5, 9), C.wood3);
  s.x(c.ribbon([[-w / 2 + 2, -34], [w / 2 - 2, -33]], 1.4) + c.ribbon([[-w / 2 + 2, -14], [w / 2 - 2, -15]], 1.4), shade(C.wood3, -0.2), 'opacity=".6"');
  // produce on the counter
  s.p(c.cut(c.blob(-w * 0.3, -80, 24, 12, 9, 0.2), 0.4, 4) + c.cut(c.blob(-w * 0.06, -82, 20, 14, 9, 0.2), 0.4, 4), C.leaf);
  let fr = '';
  for (let i = 0; i < 7; i++) fr += c.cut(c.circ(w * 0.14 + i * 9 - (i > 3 ? 30 : 0), -76 - (i > 3 ? 12 : 0), 6, 8), 0.2, 3);
  s.p(fr, C.apricot);
  s.p(c.cut([[w * 0.3, -72], [w * 0.36, -80], [w * 0.46, -78], [w * 0.4, -70]], 0.2, 3) + c.cut([[w * 0.28, -80], [w * 0.36, -88], [w * 0.44, -86], [w * 0.38, -78]], 0.2, 3), C.lake3);
  return s.out();
}
/** a far walled city on a hill with a gleaming temple (Jerusalem); origin: base centre */
export function farCity(c, sc = 1) {
  const s = sheet();
  const W = 150 * sc, H = 40 * sc;
  s.p(c.cut([[-W / 2, 0], [-W / 2, -H], [W / 2, -H], [W / 2, 0]], 0.5, 6), C.stone);
  let t = '';
  for (let x = -W / 2; x <= W / 2; x += W / 5) t += c.cut(c.rect(x - 7 * sc, -H - 14 * sc, 14 * sc, H + 14 * sc), 0.3, 4);
  s.p(t, C.stone2);
  let cr = '';
  for (let x = -W / 2 + 4; x < W / 2; x += 9 * sc) cr += c.poly(c.rect(x, -H - 5 * sc, 5 * sc, 5 * sc));
  s.p(cr, C.stone);
  s.p(c.cut(c.rect(-24 * sc, -H - 40 * sc, 48 * sc, 40 * sc), 0.4, 5), C.cream);
  s.p(c.cut([[-28 * sc, -H - 40 * sc], [28 * sc, -H - 40 * sc], [22 * sc, -H - 48 * sc], [-22 * sc, -H - 48 * sc]], 0.3, 4), C.sun);
  s.x(c.poly(c.rect(-6 * sc, -H - 26 * sc, 12 * sc, 26 * sc)), shade(C.cream, -0.2));
  return s.out();
}

/* ---------- commandments & traditions ---------- */
/** a small rolled rule-scroll with a coloured tie; origin centre */
export function ruleScroll(c, tie = C.terracotta, sc = 1) {
  const h = 30 * sc, w = 11 * sc;
  return sheet().p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.3, 4), C.parchment)
    .p(c.cut(c.rect(-w * 0.22, -h / 2 - 5 * sc, w * 0.44, 5 * sc), 0.2, 3) + c.cut(c.rect(-w * 0.22, h / 2, w * 0.44, 5 * sc), 0.2, 3), C.wood2)
    .x(c.ribbon([[-w / 2 - 1, 0], [w / 2 + 1, -1]], 3 * sc), tie).out();
}
/** the two stone tablets of the Law with numerals I–X; origin: bottom centre.
 *  data-g="iv" is a glow behind the fourth commandment ("Honour your father and mother"). */
export function tablets(c, { w = 96, h = 132, col = mix(C.stone, C.rock, 0.5) } = {}) {
  const s = sheet();
  const one = (x0) => c.cut([[x0, 0], [x0, -h + w / 2], ...c.arc(x0 + w / 2, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x0 + w, 0]], 0.8, 7);
  s.p(one(-w - 3) + one(3), col);
  s.x(c.ribbon([[-w - 1, -2], [-w - 1, -h + w / 2]], 2.4) + c.ribbon([[w + 1, -2], [w + 1, -h + w / 2]], 2.4), shade(col, -0.2), 'opacity=".5"');
  const nums = [['I', 'II', 'III', 'IV', 'V'], ['VI', 'VII', 'VIII', 'IX', 'X']];
  const rowH = (h - w * 0.36) / 5.4;
  let txt = '';
  const glowAt = [-w / 2 - 3, -h + w * 0.36 + rowH * 3.5];
  nums.forEach((col_, k) => col_.forEach((n, i) => {
    const x = k ? w / 2 + 3 : -w / 2 - 3, y = -h + w * 0.36 + rowH * (i + 0.9);
    txt += `<text x="${x}" y="${y.toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${(rowH * 0.8).toFixed(1)}" fill="${shade(col, -0.55)}">${n}</text>`;
  }));
  const gy = glowAt[1] - rowH * 0.32;
  const hi = `<path d="${c.cut([[glowAt[0] - w * 0.36, gy - rowH * 0.5], [glowAt[0] + w * 0.36, gy - rowH * 0.52], [glowAt[0] + w * 0.37, gy + rowH * 0.48], [glowAt[0] - w * 0.37, gy + rowH * 0.5]], 0.3, 4)}" fill="${C.halo}" opacity=".85"/>`;
  return `${s.out()}<g data-g="iv" opacity="0"><circle cx="${glowAt[0]}" cy="${gy}" r="${w * 0.7}" fill="url(#halo-glow)"/>${hi}</g>${txt}`;
}
/** a heap of rule-scrolls; origin: base centre */
export function scrollPile(c, n = 14, w = 110) {
  let out = '';
  const ties = [C.terracotta, C.teal2, C.ochre, C.plumRobe];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 5), inRow = i % 5;
    const x = (inRow - 2) * (w / 5.4) + (row % 2) * 8 + c.rr(-3, 3), y = -8 - row * 13 + c.rr(-2, 2);
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(90 + c.rr(-14, 14)).toFixed(1)})">${ruleScroll(c, ties[i % 4])}</g>`;
  }
  return out;
}

/* ---------- Isaiah: a face that honours with its lips ---------- */
/** a big paper face in profile (looking right); origin at the mouth. Returns { face, lipU, lipL } */
export function profileFace(c, sc = 1) {
  const s = sheet();
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  s.p(c.cut(P([[-10, -150], [30, -148], [58, -128], [66, -100], [72, -76], [90, -52], [74, -44], [70, -26], [76, -14], [64, -8], [62, 6], [68, 14], [60, 26], [46, 44], [20, 54], [-12, 50], [-40, 36], [-60, 6], [-70, -40], [-66, -96], [-46, -134]]), 1, 6), C.skin);
  s.p(c.cut(P([[-10, -150], [30, -148], [58, -128], [50, -122], [24, -130], [-6, -128], [-30, -110], [-44, -80], [-56, -30], [-62, 10], [-70, -40], [-66, -96], [-46, -134]]), 0.8, 6), C.hair2);
  s.x(c.ribbon(c.arc(40, -80, 14, 7, PI * 1.1, PI * 1.9, 6), 2.6), C.inkSoft);
  s.x(c.ribbon(c.arc(40, -66, 10, 4, 0.2, PI - 0.2, 6), 2), C.inkSoft);
  s.x(c.poly(P(c.circ(40, -34, 12, 12))), C.blush, 'opacity=".5"');
  s.x(c.cut(P(c.ell(-24, -50, 12, 18, 12)), 0.5, 4), shade(C.skin, -0.12));
  const lipU = sheet().p(c.cut(P([[-8, -4], [0, -8], [6, -6], [10, -9], [16, -5], [18, 0], [-8, 0]]), 0.3, 3), C.jesusMantle).out();
  const lipL = sheet().p(c.cut(P([[-8, 0], [18, 0], [14, 6], [4, 9], [-6, 5]]), 0.3, 3), shade(C.jesusMantle, -0.08)).out();
  return { face: s.out(), lipU, lipL };
}

/* ---------- the paper doll: "a man", with a heart and a stomach ---------- */
/** a flat paper figure facing us, feet at (0,0), height h. inner: heart window + stomach.
 *  Returns { body, stain, P } — stain is a dark mottled copy to fade in; P holds landmarks. */
export function paperDoll(c, h = 260, col = C.parchment) {
  const u = h / 260;
  const Q = (pts) => pts.map(([x, y]) => [x * u, y * u]);
  const outline = Q([[-10, -206], [-26, -196], [-54, -190], [-78, -168], [-92, -132], [-80, -126], [-62, -154], [-50, -150], [-48, -104], [-46, -64], [-36, -64], [-38, -8], [-40, 0], [-12, 0], [-8, -60], [8, -60], [12, 0], [40, 0], [38, -8], [36, -64], [46, -64], [48, -104], [50, -150], [62, -154], [80, -126], [92, -132], [78, -168], [54, -190], [26, -196], [10, -206]]);
  const head = Q(c.circ(0, -230, 30, 26));
  const s = sheet();
  s.p(c.cut(outline, 1, 7) + c.cut(head, 0.6, 5), col);
  s.x(c.ribbon(Q(c.arc(0, -226, 9, 5, 0.3, PI - 0.3, 6)), 2 * u), C.inkSoft, 'opacity=".7"');
  s.x(c.poly(Q(c.circ(-10, -236, 3, 8))) + c.poly(Q(c.circ(10, -236, 3, 8))), C.inkSoft);
  // the inside: a throat, the heart up high, the stomach below
  s.x(c.ribbon(Q([[0, -212], [0, -196], [4, -150], [2, -112]]), 5 * u), shade(col, -0.1), 'opacity=".7"');
  s.p(c.cut(Q(c.blob(4, -98, 26, 20, 12, 0.08)), 0.6, 4), mix(C.apricot, col, 0.35));
  s.x(c.ribbon(Q([[2, -80], [-6, -70], [0, -62]]), 4 * u), shade(col, -0.1), 'opacity=".6"');
  const st = sheet();
  const blots = [];
  for (let i = 0; i < 12; i++) blots.push(c.cut(Q(c.blob(c.rr(-44, 44), c.rr(-190, -20), c.rr(10, 22), c.rr(8, 16), 9, 0.3)), 1, 4));
  blots.push(c.cut(Q(c.blob(c.rr(-10, 10), -236, 16, 10, 8, 0.3)), 1, 4));
  st.x(blots.join(''), DARK, 'opacity=".55"');
  return {
    body: s.out(), stain: st.out(),
    P: { mouth: [0, -222 * u], heart: [-2 * u, -150 * u], stomach: [4 * u, -98 * u], feet: [0, 0], head: [0, -230 * u], h },
  };
}
/** the heart window drawn on its own (so it can glow / darken); origin at its centre */
export function dollHeart(c, r = 20) {
  return heart(c, r, C.jesusMantle);
}

/* ---------- the heart-shaped box and what comes out of it ---------- */
/** a heart-shaped paper box: { box, lid }. The lid hinges at its left edge (-r, -r*0.35). origin: box centre */
export function heartBox(c, r = 70, col = mix(C.jesusMantle, C.clay, 0.4)) {
  const N = 48, cutY = -r * 0.2;
  const at = (a) => [16 * Math.pow(Math.sin(a), 3) * r / 16, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16];
  const pts = Array.from({ length: N }, (_, i) => at((i / N) * PI * 2));
  // lower part: contiguous around the bottom tip; upper part: both lobes across the top notch
  const low = pts.filter(([, y]) => y >= cutY);
  let i0 = pts.findIndex(([, y]) => y >= cutY);
  const high = [];
  for (let k = 0; k < N; k++) { const p = pts[(i0 + low.length + k) % N]; if (p[1] < cutY) high.push(p); }
  const xL = Math.min(...low.map(([x]) => x)) - 2, xR = Math.max(...low.map(([x]) => x)) + 2;
  const box = sheet();
  box.p(c.cut([[xR, cutY], ...low, [xL, cutY]], 0.6, 6), col);
  box.p(c.cut(c.ell(0, cutY + 2, (xR - xL) * 0.44, r * 0.1, 20), 0.4, 5), shade(col, -0.6));
  box.x(c.ribbon([[xL + 4, cutY + 12], [xR - 4, cutY + 12]], 3), shade(col, 0.3), 'opacity=".6"');
  box.x(c.cut(c.ell(-r * 0.4, cutY + r * 0.36, r * 0.09, r * 0.18, 8, -0.4), 0.2, 3), shade(col, 0.4), 'opacity=".6"');
  const lid = sheet();
  lid.p(c.cut([[xL - 2, cutY + 4], ...high.map(([x, y]) => [x * 1.03, y - 2]), [xR + 2, cutY + 4]], 0.6, 6), shade(col, 0.1));
  lid.x(c.ribbon([[xL, cutY + 1], [xR, cutY + 1]], 4.5), C.ochre);
  lid.x(c.cut(c.ell(-r * 0.45, -r * 0.5, r * 0.16, r * 0.1, 8, -0.5), 0.2, 3), shade(col, 0.45), 'opacity=".7"');
  // the lid is drawn relative to its hinge (left end of the rim)
  return { box: box.out(), lid: `<g transform="translate(${-xL + 2} ${-cutY})">${lid.out()}</g>`, hinge: [xL - 2, cutY] };
}

/** little dark paper things that come out of the heart. kind: see DARK_KINDS. origin centre, ~40 wide */
export const DARK_KINDS = ['cloud', 'torn', 'grab', 'snuff', 'ring', 'sack', 'knot', 'mask', 'flame', 'eye', 'jag', 'crown', 'cap'];
export function darkThing(c, kind, col = DARK) {
  const s = sheet();
  const lite = mix(col, C.stone2, 0.35), dim = mix(C.ochre, col, 0.45);
  switch (kind) {
    case 'cloud': // evil thoughts
      s.p(c.cut([...c.arc(-9, 0, 11, 10, PI, 2 * PI, 6), ...c.arc(5, -4, 13, 13, PI, 2 * PI, 7), ...c.arc(17, 2, 8, 8, PI * 1.2, 2 * PI, 5), [22, 8], [-20, 8]], 0.4, 4), col);
      s.x(c.poly([[1, 8], [-5, 18], [0, 18], [-4, 27], [6, 15], [1, 15], [5, 8]]), dim);
      break;
    case 'torn': { // sexual sin: a heart torn in two
      const hp = [];
      for (let i = 0; i < 24; i++) { const a = (i / 24) * PI * 2; hp.push([16 * Math.pow(Math.sin(a), 3), -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]); }
      const L = hp.filter(([x]) => x <= 0), R = hp.filter(([x]) => x >= 0);
      s.p(c.cut([...L, [0, 12], [3, 4], [-2, -2], [2, -8]].map(([x, y]) => [x - 3, y]), 0.3, 3), col);
      s.p(c.cut([...R, [2, -8], [-2, -2], [3, 4], [0, 12]].map(([x, y]) => [x + 3, y + 2]), 0.3, 3), lite);
      break;
    }
    case 'grab': // theft: a grasping hand closing on a coin
      s.p(c.cut(c.circ(10, 6, 7, 10), 0.2, 3), dim);
      s.p(c.cut([[-22, 8], [-20, -2], [-8, -6], [0, -14], [8, -16], [16, -12], [8, -8], [18, -6], [22, -2], [12, 0], [6, 4], [0, 12], [-10, 14]], 0.5, 4), col);
      break;
    case 'snuff': // murder: a candle snuffed, a thread of smoke
      s.p(c.cut(c.rect(-6, -6, 12, 26), 0.3, 4), lite);
      s.p(c.cut([[-14, 20], [14, 20], [10, 26], [-10, 26]], 0.3, 3), col);
      s.x(c.ribbon(c.cbez([0, -8], [-8, -16], [8, -22], [-2, -34], 10), (t) => 3 - t * 2.2), col, 'opacity=".8"');
      break;
    case 'ring': // adultery: a broken ring
      s.p(c.ribbon(c.arc(0, 0, 16, 16, PI * 0.12, PI * 1.02, 12), 6), col);
      s.p(c.ribbon(c.arc(3, 3, 16, 16, PI * 1.16, PI * 1.9, 10), 6), lite);
      s.p(c.cut(c.star(0, -18, 6, 3, 4, 0), 0.2, 2), dim);
      break;
    case 'sack': // greed: a bulging sack held tight
      s.p(c.cut([[-16, 18], [-20, 4], [-12, -8], [-6, -12], [-10, -20], [10, -20], [6, -12], [12, -8], [20, 4], [16, 18]], 0.5, 4), col);
      s.x(c.ribbon([[-9, -12], [9, -12]], 3), dim);
      s.p(c.cut(c.circ(22, 14, 5, 8), 0.2, 3) + c.cut(c.circ(-22, 16, 4.4, 8), 0.2, 3), dim);
      break;
    case 'knot': // wickedness: a twisted knot
      s.p(c.ribbon(c.cbez([-22, 6], [-6, -26], [10, 26], [22, -6], 16), 5), col);
      s.p(c.ribbon(c.cbez([-20, -10], [0, 24], [8, -26], [22, 10], 16), 5), lite);
      break;
    case 'mask': // deceit: a smiling mask with a frowning shadow behind
      s.p(c.cut(c.blob(5, 3, 17, 15, 12, 0.08), 0.4, 4), col);
      s.p(c.cut(c.blob(-4, -2, 17, 15, 12, 0.08), 0.4, 4), lite);
      s.x(c.poly(c.ell(-10, -6, 3.4, 2, 8)) + c.poly(c.ell(3, -6, 3.4, 2, 8)) + c.ribbon(c.arc(-3, 3, 8, 5, 0.3, PI - 0.3, 6), 1.8), col);
      break;
    case 'flame': // lust: a dark smouldering flame
      s.p(c.cut([[0, 20], [-14, 8], [-12, -6], [-4, -12], [-6, -24], [6, -14], [10, -20], [14, -2], [12, 12]], 0.6, 4), col);
      s.x(c.cut([[0, 16], [-6, 6], [-2, -4], [4, 4], [6, 12]], 0.3, 3), dim, 'opacity=".7"');
      break;
    case 'eye': // envy: an evil, sideways eye
      s.p(c.cut([[-22, 0], [-10, -10], [10, -10], [22, 0], [10, 10], [-10, 10]], 0.4, 4), lite);
      s.p(c.cut(c.circ(8, 0, 7, 10), 0.2, 3), mix(C.moss2, col, 0.5));
      s.x(c.poly(c.circ(9, 0, 3, 8)), col);
      s.x(c.ribbon([[-16, -14], [14, -8]], 3), col);
      break;
    case 'jag': // slander: a jagged speech bubble
      {
        const p = [];
        for (let i = 0; i < 18; i++) { const a = (i / 18) * PI * 2, r = i % 2 ? 12 : 19; p.push([Math.cos(a) * r * 1.2, Math.sin(a) * r * 0.9]); }
        s.p(c.cut([...p], 0.3, 3), col);
        s.x(c.poly([[-6, 8], [-18, 22], [0, 11]]), col);
        s.x(c.poly([[-8, -3], [-3, -6], [2, -1], [7, -5], [10, 1]]), dim);
      }
      break;
    case 'crown': // pride: a tall, puffed crown
      s.p(c.cut([[-18, 14], [-20, -14], [-10, -2], [-6, -22], [0, -4], [6, -22], [10, -2], [20, -14], [18, 14]], 0.4, 4), col);
      s.p(c.cut(c.circ(0, 4, 4, 8), 0.2, 2), dim);
      break;
    case 'cap': // foolishness: a jester's cap with bells
      s.p(c.cut([[-18, 14], [-24, -8], [-30, -20], [-12, -8], [0, -26], [8, -8], [26, -18], [18, 14]], 0.5, 4), col);
      s.p(c.cut(c.circ(-30, -22, 4, 8), 0.2, 2) + c.cut(c.circ(0, -28, 4, 8), 0.2, 2) + c.cut(c.circ(27, -20, 4, 8), 0.2, 2), dim);
      s.p(c.cut(c.rect(-19, 8, 38, 8), 0.3, 3), lite);
      break;
    default:
      s.p(c.cut(c.blob(0, 0, 14, 10, 8, 0.4), 1, 4), col);
  }
  return s.out();
}

/* ---------- Tyre ---------- */
/** a murex shell (the purple dye of Tyre); origin centre */
export function murex(c, r = 18) {
  const s = sheet();
  let sp = '';
  for (let i = 0; i < 7; i++) { const a = PI * (0.9 + i * 0.2); sp += c.poly([[Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.5], [Math.cos(a) * r * 1.3, Math.sin(a) * r * 0.9], [Math.cos(a + 0.12) * r * 0.75, Math.sin(a + 0.12) * r * 0.55]]); }
  s.p(sp, shade(MUREX, -0.1));
  s.p(c.cut([[-r * 1.2, r * 0.1], ...c.arc(0, 0, r * 0.9, r * 0.62, PI, 2 * PI, 10), [r * 1.4, -r * 0.1], [r * 0.6, r * 0.4], [-r * 0.2, r * 0.5]], 0.4, 4), MUREX);
  s.x(c.ribbon(c.arc(-r * 0.1, 0, r * 0.5, r * 0.3, PI * 1.1, PI * 2.1, 8), 1.6) + c.ribbon(c.arc(-r * 0.1, 0, r * 0.25, r * 0.15, PI * 1.1, PI * 2.2, 6), 1.2), shade(MUREX, 0.35));
  return s.out();
}
/** a puppy facing right; feet at (0,0). .tail wags (pivot at the rump), .head tilts. */
export function puppy(c, { col = C.ochre, patch = C.cream, k, sc = 1 } = {}) {
  const Q = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  const dk = shade(col, -0.18);
  const body = sheet();
  body.p(c.cut(Q([[-20, -14], [-24, 0], [-18, 0], [-16, -10]]), 0.3, 3) + c.cut(Q([[12, -14], [8, 0], [14, 0], [18, -12]]), 0.3, 3), dk);
  body.p(c.cut(Q(c.blob(-2, -22, 26, 13, 12, 0.08)), 0.5, 4), col);
  body.p(c.cut(Q([[-18, -14], [-20, 0], [-14, 0], [-10, -12]]), 0.3, 3) + c.cut(Q([[16, -14], [16, 0], [22, 0], [22, -14]]), 0.3, 3), col);
  body.x(c.cut(Q(c.blob(-4, -16, 12, 6, 8, 0.2)), 0.3, 3), patch, 'opacity=".9"');
  const head = sheet();
  head.p(c.cut(Q(c.circ(0, 0, 11, 14)), 0.3, 3), col);
  head.p(c.cut(Q([[6, -2], [18, 0], [19, 5], [8, 7]]), 0.3, 3), patch);
  head.x(c.poly(Q(c.circ(18.5, 1.5, 2.4, 6))), C.ink);
  head.x(c.poly(Q(c.circ(6, -3, 1.8, 6))), C.ink);
  head.p(c.cut(Q([[-8, -8], [-2, -10], [-4, 8], [-10, 6]]), 0.3, 3), dk);
  const tail = sheet().p(c.ribbon(Q(c.qbez([0, 0], [-8, -6], [-12, -18], 6)), (t) => (4 - t * 2.4) * sc), col).out();
  return `<g${k_(k)} class="pup"><g class="tail" transform="translate(${-24 * sc} ${-26 * sc})">${tail}</g>${body.out()}<g class="head" transform="translate(${24 * sc} ${-32 * sc})">${head.out()}</g></g>`;
}

/* ---------- the deaf man's silence ---------- */
/** a soft grey plug of paper wool (for a stopped ear); origin centre */
export function earPlug(c, r = 8) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.8, 9, 0.25), 0.8, 3), C.stone2).x(c.cut(c.blob(-r * 0.2, -r * 0.2, r * 0.4, r * 0.3, 7, 0.2), 0.3, 2), C.cream, 'opacity=".7"').out();
}
/** one half of a knotted cord (side -1 / 1); origin at the knot */
export function knotHalf(c, side = 1, col = C.rope) {
  const pts = c.cbez([0, 0], [side * 10, -8], [side * 16, 10], [side * 28, 4], 10);
  return sheet().p(c.ribbon(pts, 3.4), col).p(c.cut(c.circ(side * 2, 0, 4.6, 8), 0.3, 3), shade(col, -0.2)).out();
}

/* ---------- paper words ---------- */
/** a luggage tag with one or two lines, hung from its hole at (0,0) (after mark 3) */
export function nameTag(c, text, { size = 17, dark = false, w, sub, subSize } = {}) {
  const lines = Array.isArray(text) ? text : [text];
  const ss = subSize || size * 0.62;
  const longest = Math.max(...lines.map((l) => l.length), sub ? (sub.length * ss) / size : 0);
  const ww = w || Math.max(58, size * (0.5 * longest + 1.7));
  const h = size * (0.75 + lines.length * 1.1) + (sub ? ss * 1.25 : 0);
  const s = sheet();
  const fill = dark ? mix(C.storm, C.stone2, 0.25) : C.cream;
  const pts = [[-ww / 2 + 10, 6], [ww / 2 - 10, 6], [ww / 2, 16], [ww / 2, 6 + h], [-ww / 2, 6 + h], [-ww / 2, 16]];
  s.p(c.cut(pts, 0.5, 6), fill);
  s.p(c.cut([[-ww / 2 + 5, 20], [ww / 2 - 5, 20], [ww / 2 - 5, 2 + h], [-ww / 2 + 5, 2 + h]], 0.3, 6), dark ? mix(C.storm, C.stone2, 0.4) : C.parchment);
  s.x(c.poly(c.circ(0, 12, 3.2, 10)), dark ? C.storm2 : C.wood2);
  const ink = dark ? C.cream : C.ink;
  const y0 = 12 + (h - (sub ? ss * 1.25 : 0) - lines.length * size * 1.1) / 2 + size * 0.95;
  let txt = lines.map((l, i) => `<text x="0" y="${(y0 + i * size * 1.1).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  if (sub) txt += `<text x="0" y="${(y0 + (lines.length - 1) * size * 1.1 + ss * 1.4).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${ss.toFixed(1)}" font-style="italic" fill="${C.terracotta}">${sub}</text>`;
  return `${s.out()}${txt}`;
}
/** a speech bubble with one or two lines of text; tail at the bubble's bottom (tail -1 left / 1 right) */
export function bubble(c, lines, { size = 20, fill = C.cream, ink = C.ink, tail = -1, w } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.6;
  const hh = lines.length * size * 1.15 + size * 0.9;
  const s = sheet();
  s.p(c.cut(c.blob(0, -hh / 2 - 14, ww / 2, hh / 2, 18, 0.05), 0.6, 6), fill);
  s.p(c.cut([[tail * 8 - 8, -18], [tail * 22, 2], [tail * 8 + 8, -20]], 0.4, 4), fill);
  const t0 = -hh / 2 - 14 - ((lines.length - 1) * size * 1.15) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="0" y="${(t0 + i * size * 1.15).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** words on a small torn strip of paper; origin centre */
export function strip(c, text, { size = 16, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.2;
  const hh = size * 1.45;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a round hanging plate with an icon; origin centre */
export function plate(c, icon, { r = 54, fill = C.cream, rim = C.haloRim } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), fill).out() + icon;
}
/** an object on two strings from the flies (a banner, a board); half: half the distance between strings */
export function hang2(inner, half, len = 400, color = 'rgba(74,54,34,.55)') {
  return `<g class="hang"><path d="M${-half} ${-len - 1400}V0M${half} ${-len - 1400}V0" stroke="${color}" stroke-width="1.2" fill="none"/><g class="obj">${inner}</g></g>`;
}
/** a big hand (for inset plates), fingers pointing right; origin at the wrist. dirty: little dust specks */
export function bigHand(c, { dirty = false, skin = C.skin2 } = {}) {
  const s = sheet();
  s.p(c.cut([[-40, -14], [-4, -18], [14, -26], [40, -24], [44, -18], [18, -14], [46, -12], [50, -5], [22, -2], [46, 2], [48, 9], [20, 8], [40, 14], [38, 20], [10, 18], [-4, 16], [-40, 14]], 0.5, 4), skin);
  s.p(c.cut([[-60, -16], [-38, -16], [-38, 16], [-60, 16]], 0.4, 4), C.linen2);
  s.x(c.ribbon([[14, -21], [34, -21]], 1.2) + c.ribbon([[20, -8], [40, -8]], 1.2), shade(skin, -0.2), 'opacity=".6"');
  if (dirty) {
    let d = '';
    for (let i = 0; i < 14; i++) d += c.cut(c.blob(c.rr(-30, 40), c.rr(-18, 14), c.rr(1.6, 3.6), c.rr(1.2, 2.6), 6, 0.3), 0.3, 2);
    s.x(d, C.soil, 'opacity=".75"');
  }
  return s.out();
}

/* ---------- motion helpers ---------- */
/** rings of sound rippling out from (x, y); returns updater(x, y, on, time) */
export function soundRings(L, c, { n = 3, color = shade(C.ochre, 0.25), r = 30, w = 5, both = true } = {}) {
  const els = [];
  for (let i = 0; i < n; i++) {
    els.push({ el: L.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, r, r, -0.6, 0.6, 10), w)}" fill="${color}"/></g>`), side: 1, i });
    if (both) els.push({ el: L.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, r, r, PI - 0.6, PI + 0.6, 10), w)}" fill="${color}"/></g>`), side: -1, i });
  }
  return (x, y, on, time, { spread = 2.2, speed = 0.5, s0 = 0.7, off = 4 } = {}) => {
    els.forEach(({ el, side, i }) => {
      if (on <= 0.001) { pose(el, { x, y, o: 0 }); return; }
      const k = time ? (time * speed + i / n) % 1 : (i + 1) / (n + 0.5);
      pose(el, { x: x + side * off, y, s: s0 + k * spread, o: on * (1 - k) * 0.95 });
    });
  };
}

/* ---------- the house where Jesus teaches the disciples (Mk 7,17–23) ---------- */
/**
 * Builds the room: sky seen through a window and the open door, a street outside, the plastered
 * back wall with a shelf, a niche and hanging herbs, the floor, and an oil lamp on a stand.
 * Returns { sky, street (layer), lamp: { el, glow, flame }, FLOOR, DOOR }.
 */
export function room(S, { sky: skyCols = ['#cfe0dc', '#efe5cb', '#f7ead3'], night = false } = {}) {
  const c = S.c;
  const FLOOR = 646, CEIL = 250;
  const DOOR = { x0: 1150, x1: 1262, top: 452 };
  const sk = sky(S, skyCols);
  if (night) S.layer({ par: 0.02, sh: 1 }).add(starsMarkup(c));
  // the street beyond the door
  const street = S.layer({ par: 0.26, sh: 3 });
  street.add(sheet().p(c.cut([[900, 520], [2500, 520], [2500, 1700], [900, 1700]], 1, 20), night ? mix(C.sand2, C.indigo, 0.35) : C.hillMid).out());
  street.add(sheet().p(c.cut([[900, 600], [2500, 600], [2500, 1700], [900, 1700]], 1, 20), night ? mix(C.sand, C.indigo, 0.3) : C.sand).out());
  // the back wall with a window and a doorway
  const wallL = S.layer({ par: 0.32, sh: 3 });
  const wcol = night ? mix(C.plaster, C.plumRobe, 0.18) : mix(C.plaster, C.plaster2, 0.35);
  const win = [[468, 470], [468, 400], ...c.arc(514, 400, 46, 40, PI, 2 * PI, 10), [560, 470]];
  const door = [[DOOR.x0, FLOOR + 6], [DOOR.x0, DOOR.top], ...c.arc((DOOR.x0 + DOOR.x1) / 2, DOOR.top, (DOOR.x1 - DOOR.x0) / 2, 50, PI, 2 * PI, 12), [DOOR.x1, FLOOR + 6]];
  const w = sheet();
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), wcol);
  // on a tall screen the ceiling is only a beam across the wall, so the planks do not fill the top of the picture
  const CTOP = S.portrait ? CEIL - 150 : -1200;
  w.p(c.cut([[-900, CTOP], [2500, CTOP], [2500, CEIL - 16], [-900, CEIL - 16]], 0.8, 30), shade(C.wood2, night ? -0.3 : -0.1));
  let planks = '';
  for (let x = -900; x < 2500; x += 64) planks += c.ribbon([[x, CTOP], [x + c.rr(-3, 3), CEIL - 18]], 2);
  w.x(planks, shade(C.wood2, night ? -0.45 : -0.28), 'opacity=".6"');
  let blotch = '';
  for (let i = 0; i < 16; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(CEIL + 40, FLOOR - 70), c.rr(24, 64), c.rr(10, 24), 10, 0.2), 0.8, 6);
  w.x(blotch, shade(wcol, -0.06), 'opacity=".55"');
  w.p(c.cut([[-900, FLOOR - 46], [2500, FLOOR - 46], [2500, FLOOR + 6], [-900, FLOOR + 6]], 0.8, 14) + c.hole(door.map(([x, y]) => [x, Math.max(y, FLOOR - 46)]), 0.3, 6), shade(wcol, -0.05));
  w.p(c.ribbon([[462, 472], [566, 472]], 8) + c.ribbon([[514, 362], [514, 470]], 5), C.wood2);
  w.p(c.ribbon([[DOOR.x0 - 4, FLOOR + 4], [DOOR.x0 - 4, DOOR.top]], 9) + c.ribbon([[DOOR.x1 + 4, FLOOR + 4], [DOOR.x1 + 4, DOOR.top]], 9) + c.ribbon(c.arc((DOOR.x0 + DOOR.x1) / 2, DOOR.top, (DOOR.x1 - DOOR.x0) / 2 + 4, 54, PI, 2 * PI, 12), 9), C.wood2);
  // beams
  let beams = '';
  for (let x = -300; x < 1900; x += 90) beams += c.cut(c.rect(x, CEIL - 10, 20, 30), 0.3, 5);
  w.p(c.cut(c.rect(-900, CEIL - 22, 3400, 16), 0.5, 20), C.wood2);
  w.p(beams, C.wood);
  // shelf with jars; herbs; a niche
  w.p(c.cut(c.rect(930, 400, 160, 8), 0.3, 6), C.wood2);
  w.p(c.cut([[946, 400], [940, 376], [952, 360], [964, 376], [958, 400]], 0.4, 4) + c.cut(c.arc(1004, 400, 18, 16, PI, 2 * PI, 8), 0.4, 4) + c.cut([[1044, 400], [1040, 370], [1058, 362], [1066, 400]], 0.4, 4), C.pot);
  w.p(c.ribbon([[660, CEIL], [662, 300]], 2.4) + c.ribbon([[682, CEIL], [680, 308]], 2.4), C.moss);
  w.p(c.cut(c.blob(662, 306, 12, 20, 8, 0.2), 0.4, 4) + c.cut(c.blob(680, 316, 11, 18, 8, 0.2), 0.4, 4), C.olive);
  w.p(c.cut([[330, 470], [330, 430], ...c.arc(360, 430, 30, 26, PI, 2 * PI, 8), [390, 470]], 0.4, 5), shade(wcol, -0.16));
  w.p(c.cut([[342, 470], [346, 460], [366, 460], [376, 465], [372, 470]], 0.2, 3), C.pot);
  wallL.add(w.out());
  // the floor
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 1, 30), night ? mix(C.clay, C.plumRobe, 0.25) : mix(C.clay, C.sand2, 0.55));
  let lines = '';
  for (let i = 0; i < 6; i++) { const y = FLOOR + 14 + i * i * 10 + i * 12; lines += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.5); }
  fl.x(lines, shade(C.sand2, -0.2), 'opacity=".45"');
  // a woven rug under the table
  fl.p(c.cut([[520, FLOOR + 40], [1080, FLOOR + 40], [1120, FLOOR + 130], [480, FLOOR + 130]], 0.8, 12), mix(C.terracotta, C.clay, 0.5));
  let rug = '';
  for (let x = 540; x < 1080; x += 40) rug += c.cut(c.star(x, FLOOR + 85, 6, 2.6, 4, 0), 0.2, 3);
  fl.x(rug, C.cream, 'opacity=".7"');
  floorL.add(fl.out());
  // at night the room sinks into shadow, except near the lamp
  if (night) {
    const dimL = S.layer({ par: 0.4, sh: 1, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".34"/><ellipse cx="420" cy="470" rx="320" ry="260" fill="url(#warm-glow)" opacity=".45"/>`);
  }
  // the lamp on a stand
  const lampL = S.layer({ par: 0.45, sh: 4 });
  lampL.add(`<g transform="translate(410 ${FLOOR + 30})">${sheet().p(c.cut([[-26, 0], [-18, -10], [-4, -14], [-4, -150], [4, -150], [4, -14], [18, -10], [26, 0]], 0.4, 6), C.wood2).p(c.cut(c.rect(-24, -156, 48, 8), 0.3, 5), C.wood).out()}</g>`);
  const lampEl = lampL.add(`<g transform="translate(404 ${FLOOR - 128}) scale(.8)">${oilLampM(c)}</g>`);
  return { sky: sk, street, lamp: { el: lampEl, glow: lampEl.querySelector('.glow'), flame: lampEl.querySelector('.flame') }, FLOOR, DOOR, CEIL };
}
function starsMarkup(c) {
  let d = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(300, 1500), y = c.rr(150, 520), r = c.rr(1.2, 2.6); d += c.poly(c.circ(x, y, r, 6)); }
  return `<path d="${d}" fill="${C.star}"/>`;
}
function oilLampM(c) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-30, -8], [-18, -16], [10, -16], [24, -12], [34, -16], [38, -12], [26, -2], [14, 2], [-18, 2]], 0.4, 5), C.pot);
  s.p(c.cut(c.circ(-4, -14, 7, 10), 0.2, 3), shade(C.pot, -0.3));
  return `<circle class="glow" cx="34" cy="-30" r="190" fill="url(#warm-glow)"/>${s.out()}<g class="flame" transform="translate(35 -16)"><path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/></g>`;
}
/** the low table spread with every kind of food; origin: floor centre. Returns markup + dish anchor points */
export function feastTable(c, w = 440) {
  const dishes = [
    { x: -170, m: bowl(c, { w: 34, food: 'stew' }) }, { x: -110, m: loaf(c, 18) }, { x: -50, m: fishDishM(c) },
    { x: 20, m: bowl(c, { w: 36, food: 'fruit', color: C.clay }) }, { x: 80, m: cup(c) }, { x: 130, m: loaf(c, 15) }, { x: 180, m: bowl(c, { w: 30, food: 'bread', color: C.stone2 }) },
  ];
  let m = lowTable(c, w, 46);
  dishes.forEach((d) => { m += `<g transform="translate(${d.x} -46)">${d.m}</g>`; });
  return { markup: m, dishes: dishes.map((d) => [d.x, -60]) };
}
function fishDishM(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -4, 30, 5, 16), 0.3, 4), C.stone2);
  s.p(c.cut([[-20, -8], [-6, -15], [8, -14], [18, -9], [8, -4], [-6, -4], [-20, -8], [-27, -14], [-25, -8], [-27, -2]], 0.3, 4), C.lake3);
  return s.out();
}

/* ---------- the Decapolis ---------- */
/** a small Greek town on a hill: a temple with columns, a couple of houses; origin: base centre */
export function greekTown(c, sc = 1) {
  const s = sheet();
  const W = 110 * sc, H = 40 * sc;
  s.p(c.cut(c.rect(-W / 2, -H, W, H + 4), 0.4, 6), C.stone);
  s.p(c.cut([[-W * 0.3, -H], [W * 0.3, -H], [W * 0.3, -H - 36 * sc], [-W * 0.3, -H - 36 * sc]], 0.3, 5), C.cream);
  let col = '';
  for (let i = 0; i < 5; i++) col += c.cut(c.rect(-W * 0.26 + i * W * 0.13, -H - 34 * sc, 5 * sc, 32 * sc), 0.2, 3);
  s.p(col, C.stone2);
  s.p(c.cut([[-W * 0.34, -H - 36 * sc], [W * 0.34, -H - 36 * sc], [0, -H - 54 * sc]], 0.3, 4), C.clay);
  s.p(c.cut(c.rect(W * 0.32, -H - 16 * sc, 26 * sc, 16 * sc), 0.3, 4) + c.cut(c.rect(-W * 0.5, -H - 12 * sc, 22 * sc, 12 * sc), 0.3, 4), C.plaster);
  return s.out();
}
/** a little blossom / note inside a speech bubble (i picks the flower) */
export function flowerWord(c, i) {
  const cols = [C.jesusMantle, C.sun, C.lavender, C.apricot, C.skyBlue2];
  const s = sheet();
  s.p(c.cut(c.star(0, 0, 11, 5, 5 + (i % 2), i), 0.2, 3), cols[i % cols.length]);
  s.p(c.cut(c.circ(0, 0, 3.4, 8), 0.2, 2), C.sun);
  return s.out();
}
