// Mark 6 — the cast of this chapter and its cut-outs: carpenter's tools, the travel kit of the Twelve,
// Herod's court (crown, throne, portraits, platter), sheep, baskets, oars, a tomb, mats for the sick…
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose } from '../kit.js';
import { hang } from '../../assets/nature.js';

export {
  kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, scrap, dust, pallet, blanket,
  coin, coinStack, bowl, loaf, cup, lantern, garland, candle, scrollOpen, scrollRolled, circlet, plateDisc, jug,
  lowTable, johnsOpts, wordSlip, rolledMat, tambourine, sabbathTag, menorah, rope,
} from '../mark2/lib.js';
import { addToHead, addToBody, pallet, blanket } from '../mark2/lib.js';

const PI = Math.PI;
const k_ = (k) => (k ? ` data-k="${k}"` : '');
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ---------- the cast ---------- */
export const LOOK = {
  philip: { robe: C.roseRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather },
  bartholomew: { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3 },
  jamesA: { robe: C.linen2, mantle: C.tealRobe, hair: C.hair, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin4 },
  thaddaeus: { robe: C.lavender, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin },
  simonZ: { robe: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.terracotta, beard: 'full', skin: C.skin4, belt: C.leather },
  judas: { robe: mix(C.dustyBlue, C.storm, 0.5), mantle: shade(C.wood3, -0.05), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  // Jesus' family in Nazareth
  mary: { robe: C.linen2, mantle: C.dustyBlue, hairStyle: 'veil', veil: C.dustyBlue, veil2: shade(C.dustyBlue, -0.12), skin: C.skin, hair: C.hair },
  bJames: { robe: C.wheatRobe, mantle: C.olive, hair: C.hairJesus, hairStyle: 'short', beard: 'full', skin: C.skin, belt: C.leather },
  bJoses: { robe: C.sageRobe, hair: C.hairJesus, hairStyle: 'curly', beard: 'short', skin: C.skin, belt: C.leather },
  bJudas: { robe: C.clayMantle, hair: C.hairJesus, hairStyle: 'short', beard: 'short', skin: C.skin2 },
  bSimon: { robe: C.tealRobe, hair: C.hairJesus, hairStyle: 'short', beard: 'none', skin: C.skin },
  sister1: { robe: C.roseRobe, hairStyle: 'veil', veil: C.cream, veil2: C.linen2, skin: C.skin, hair: C.hairJesus },
  sister2: { robe: C.lavender, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.1), skin: C.skin2, hair: C.hairJesus },
  // Herod's court
  herod: { robe: C.plumRobe, mantle: C.terracotta, belt: C.sun, skin: C.skin2, hair: C.hair3, hairStyle: 'short', beard: 'full', beardColor: C.hair3 },
  herodias: { robe: shade(C.roseRobe, -0.08), mantle: C.plumRobe, hairStyle: 'veil', veil: C.terracotta, veil2: shade(C.terracotta, -0.18), skin: C.skin, hair: C.hair3, belt: C.sun },
  girl: { robe: C.peach, mantle: null, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.1), skin: C.skin, hair: C.hair2, belt: C.sun },
  john: { robe: '#b98f63', fur: true, belt: C.leather, hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin3 },
  elijah: { robe: mix(C.dune, C.wood3, 0.3), fur: true, mantle: C.clay, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: C.greyHair, skin: C.skin3, belt: C.leather },
  prophet: { robe: C.linen2, mantle: C.tealRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin2 },
  guard: { robe: mix(C.storm, C.clay, 0.3), mantle: C.terracotta, belt: C.leather, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3 },
};

/** the Twelve in the order Mark names them (same look as in chapter 3) */
export const TWELVE = [
  { k: 'peter', o: CAST.peter }, { k: 'james', o: CAST.james }, { k: 'john', o: CAST.john }, { k: 'andrew', o: CAST.andrew },
  { k: 'philip', o: LOOK.philip }, { k: 'bartholomew', o: LOOK.bartholomew }, { k: 'matthew', o: CAST.matthew }, { k: 'thomas', o: CAST.thomas },
  { k: 'jamesA', o: LOOK.jamesA }, { k: 'thaddaeus', o: LOOK.thaddaeus }, { k: 'simonZ', o: LOOK.simonZ }, { k: 'judas', o: LOOK.judas },
];
/** the six pairs (Mk 6,7 — two by two) */
export const PAIRS = [[0, 3], [1, 2], [4, 5], [6, 7], [8, 9], [10, 11]];

/** a man / woman from the crowd */
export function man(c, extra = {}) {
  const o = crowdPerson(c, extra);
  if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  return o;
}
export function woman(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }
/** a noble / officer at Herod's table */
export function noble(c, i = 0) {
  const robes = [C.indigo, C.tealRobe, C.plumRobe, C.dustyBlue, C.mauve, C.ochreRobe];
  const mantles = [C.ochre, C.linen2, C.sun, C.terracotta, C.stone, C.teal2];
  return {
    robe: robes[i % robes.length], mantle: mantles[(i + 2) % mantles.length], belt: i % 2 ? C.sun : C.leather,
    skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4], hair: [C.hair3, C.hair, C.greyHair, C.hair2][i % 4],
    hairStyle: ['short', 'curly', 'wrap', 'bald', 'short', 'curly'][i % 6], veil: [C.linen2, C.ochre, C.stone][i % 3], beard: ['full', 'short', 'full', 'none', 'short', 'full'][i % 6],
  };
}

/* ---------- head & body extras ---------- */
/** Herod's crown (head coords) */
export function crown(c, col = C.sun) {
  const s = sheet();
  const pts = [[-17, -12], [17, -12], [18, -22], [12, -30], [8, -21], [4, -34], [-1, -22], [-6, -33], [-10, -21], [-14, -30], [-19, -22]];
  s.p(c.cut(pts, 0.3, 3), col);
  s.x(c.ribbon([[-17, -15], [17, -15]], 3), shade(col, -0.25), 'opacity=".7"');
  s.x(c.poly(c.circ(4, -16, 2.2, 6)) + c.poly(c.circ(-7, -16, 2, 6)), C.terracotta);
  return s.out();
}
/** a soldier's helmet (head coords) */
export function helmet(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, -2, 21, 21, PI * 0.98, PI * 2.02, 14), [21, -2], [-21, -2]], 0.4, 4), C.rock2);
  s.p(c.cut([[-21, -4], [22, -4], [22, 1], [-21, 1]], 0.3, 4), shade(C.rock2, -0.2));
  s.p(c.cut([[-8, -22], [-2, -34], [8, -36], [4, -22]], 0.4, 3), C.terracotta);
  return s.out();
}
/** tassels on the corners of Jesus' cloak (body coords) — for "the fringe of his garment" */
export function tassels(c) {
  let d = '', t = '';
  [[-38, -9], [-27, -5]].forEach(([x, y]) => {
    d += c.ribbon([[x, y], [x - 1, y + 6]], 1.4);
    t += c.cut([[x - 3, y + 5], [x + 2, y + 5], [x + 3, y + 13], [x - 4, y + 13]], 0.3, 3);
  });
  return sheet().x(d, C.dustyBlue).p(t, C.dustyBlue).out();
}
export const jesusWithFringe = (c, extra = {}) => addToBody(person(c, { ...CAST.jesus, ...extra }), tassels(c));

/** brows (sad / worried) and a tear drawn onto a face (head coords), hidden until needed via data-part */
export function faceBits(c) {
  const ink = C.inkSoft;
  const sad = c.ribbon([[-1, -6.6], [7.2, -10.4]], 2.5) + c.ribbon([[10, -10.4], [16.5, -6.8]], 2.4);
  const angry = c.ribbon([[-1.5, -10.5], [7.5, -6.2]], 2.8) + c.ribbon([[9.8, -6.4], [17, -10.2]], 2.6);
  return `<g data-part="sad" opacity="0"><path d="${sad}" fill="${ink}"/></g><g data-part="angry" opacity="0"><path d="${angry}" fill="${ink}"/></g>`;
}
export const withFace = (markup, extra) => addToHead(markup, extra);

/* ---------- held things (holdF / holdB: arm-local, the hand at 0,0, arm pointing +y) ---------- */
/** a walking staff; base = the arm angle at which it stands upright */
export function staff(c, h = 200, base = 20) {
  const s = sheet().p(c.ribbon([[0, -h * 0.62], [1.5, 0], [0, h * 0.36]], 5.5), C.wood2).p(c.ribbon(c.arc(-9, -h * 0.62, 9, 11, 0, -PI, 8), 5), C.wood2);
  return `<g transform="rotate(${base})">${s.out()}</g>`;
}
/** a small alabaster flask of oil; origin: base */
export function oilFlask(c, { k } = {}) {
  const s = sheet();
  s.p(c.cut([[-9, 0], [-12, -12], [-10, -24], [-4, -30], [-4, -38], [4, -38], [4, -30], [10, -24], [12, -12], [9, 0]], 0.4, 4), C.cream);
  s.p(c.cut(c.rect(-5, -44, 10, 7), 0.2, 3), C.wood2);
  s.x(c.ribbon([[-11, -16], [11, -16]], 2.2), C.ochre, 'opacity=".7"');
  s.x(c.cut(c.ell(-4, -18, 2.4, 6, 8), 0.2, 3), '#fff', 'opacity=".6"');
  return `<g${k_(k)}>${s.out()}</g>`;
}
/** a golden drop of oil; origin centre */
export function oilDrop(c, r = 5) { return `<path d="${c.cut([[0, -r * 1.8], [r, 0], [r * 0.6, r * 0.8], [-r * 0.6, r * 0.8], [-r, 0]], 0.1, 2)}" fill="${C.sun}"/>`; }

/* ---------- carpentry ---------- */
/** a carpenter's workbench with a plank and shavings; origin: floor centre */
export function workbench(c, w = 220) {
  const s = sheet();
  s.p(c.cut([[-w / 2 + 14, 0], [-w / 2 + 26, -60], [-w / 2 + 36, -60], [-w / 2 + 28, 0]], 0.3, 5) + c.cut([[w / 2 - 28, 0], [w / 2 - 36, -60], [w / 2 - 26, -60], [w / 2 - 14, 0]], 0.3, 5), C.wood2);
  s.p(c.cut([[-w / 2, -60], [w / 2, -60], [w / 2, -72], [-w / 2, -72]], 0.4, 8), C.wood);
  s.x(c.ribbon([[-w / 2 + 6, -66], [w / 2 - 6, -65]], 1.2), shade(C.wood, -0.25), 'opacity=".6"');
  // a plank being planed
  s.p(c.cut([[-w / 2 + 30, -72], [w / 2 - 50, -72], [w / 2 - 50, -82], [-w / 2 + 30, -82]], 0.3, 6), C.wood3);
  s.x(c.ribbon([[-w / 2 + 40, -77], [w / 2 - 60, -76]], 1), shade(C.wood3, -0.2), 'opacity=".6"');
  // curly shavings on the floor
  let sh = '';
  for (let i = 0; i < 7; i++) { const x = c.rr(-w / 2, w / 2); sh += c.ribbon(c.arc(x, -5, c.rr(4, 7), c.rr(3, 5), 0, PI * 1.6, 8), 2); }
  s.x(sh, C.wood3);
  return s.out();
}
export function saw(c) {
  const s = sheet();
  let teeth = [[-40, 0], [36, -6]];
  for (let x = 36; x > -40; x -= 6) teeth.push([x - 3, -2 + (x + 40) * -0.08 + 4], [x - 6, -6 + (x + 40) * -0.08 + 4]);
  s.p(c.cut([[-40, -14], [36, -22], [36, -6], [-40, 0]], 0.3, 6), C.stone2);
  s.p(c.cut([[36, -26], [58, -26], [60, -2], [36, -4]], 0.4, 4), C.wood2);
  s.x(c.poly(c.ell(48, -14, 5, 7, 8)), C.soilDark);
  return s.out();
}
export function hammer(c) {
  return sheet().p(c.ribbon([[0, 0], [0, -46]], 5), C.wood3).p(c.cut([[-12, -54], [14, -54], [14, -42], [-12, -42]], 0.3, 4), C.rock3).out();
}
export function square(c) {
  return sheet().p(c.cut([[0, 0], [40, 0], [40, -6], [6, -6], [6, -34], [0, -34]], 0.3, 4), C.wood3).x(c.ribbon([[10, -3], [36, -3]], 0.8), C.ink, 'opacity=".4"').out();
}
/** a carpenter's plate: saw, hammer, set square on a round board (for hanging); origin centre */
export function carpenterPlate(c, r = 56) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 5, 40), 0.5, 6), C.wood2).p(c.cut(c.circ(0, 0, r, 40), 0.5, 6), C.cream);
  return s.out() + `<g transform="translate(-12 10) rotate(-18) scale(.72)">${saw(c)}</g><g transform="translate(22 30) rotate(24) scale(.78)">${hammer(c)}</g><g transform="translate(-30 30) scale(.7)">${square(c)}</g>`;
}

/* ---------- the travel kit (Mk 6,8–9) ---------- */
export function bag(c) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, -8, 22, 30, PI * 1.05, PI * 1.95, 10), 4), C.leather);
  s.p(c.cut([[-24, -10], [24, -10], [26, 20], [18, 28], [-18, 28], [-26, 20]], 0.5, 5), C.wood3);
  s.p(c.cut([[-24, -10], [24, -10], [20, 8], [-20, 8]], 0.4, 5), shade(C.wood3, -0.12));
  s.p(c.cut(c.circ(0, 6, 3.4, 8), 0.2, 3), C.ochre);
  return s.out();
}
export function purse(c) {
  const s = sheet();
  s.p(c.cut([[-8, -16], [8, -16], [12, -6], [18, 8], [12, 18], [-12, 18], [-18, 8], [-12, -6]], 0.5, 4), C.leather);
  s.p(c.ribbon([[-10, -9], [10, -9]], 3), C.rope);
  s.p(c.cut(c.circ(-9, -20, 5, 8), 0.2, 3) + c.cut(c.circ(3, -21, 5, 8), 0.2, 3), C.sun);
  return s.out();
}
export function tunic(c, col = C.sageRobe) {
  const s = sheet();
  s.p(c.cut([[-16, -30], [-6, -26], [6, -26], [16, -30], [34, -18], [28, -8], [18, -14], [22, 30], [-22, 30], [-18, -14], [-28, -8], [-34, -18]], 0.6, 5), col);
  s.x(c.ribbon(c.arc(0, -26, 6, 4, 0, PI, 6), 1.6), shade(col, -0.25));
  return s.out();
}
export function sandals(c) {
  const one = (x, y) => c.cut([[x - 14, y], [x + 14, y - 2], [x + 16, y + 4], [x - 14, y + 6]], 0.3, 4);
  const s = sheet().p(one(-16, 8) + one(14, 14), C.sandal);
  s.x(c.ribbon([[-24, 7], [-14, 0], [-4, 6]], 2) + c.ribbon([[6, 13], [16, 6], [26, 12]], 2), C.leather);
  return s.out();
}
/** a red "not this" cross; origin centre */
export function crossX(c, r = 30) {
  return sheet().x(c.ribbon([[-r, -r], [r, r]], 7) + c.ribbon([[r, -r], [-r, r]], 7), C.terracotta).out();
}
/** a green tick; origin centre */
export function tick(c, r = 26) {
  return sheet().x(c.ribbon([[-r, 0], [-r * 0.3, r * 0.7], [r, -r * 0.8]], 7), C.moss).out();
}
/** a round hanging tag with an object on it; origin centre */
export function disc(c, inner, { r = 44, fill = C.cream, rim = C.ochre } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 4, 34), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), fill).out() + inner;
}

/* ---------- creatures, food ---------- */
/** a paper sheep; origin: between its feet. k for the whole, .leg for legs */
export function sheep(c, { k, wool = C.linen, face = mix(C.inkSoft, C.stone2, 0.35) } = {}) {
  const s = sheet();
  let legs = '';
  [[-18, 0], [-10, 1], [10, 0], [18, 1]].forEach(([x]) => { legs += c.cut([[x - 2.4, -14], [x + 2.4, -14], [x + 2, 0], [x - 2, 0]], 0.2, 3); });
  s.p(legs, face);
  const body = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * PI * 2, x = Math.cos(a) * 28, y = -30 + Math.sin(a) * 17;
    body.push(...c.arc(x, y, 5.5, 5.5, a - 1.2, a + 1.2, 3));
  }
  s.p(c.cut(body, 0.3, 3), wool);
  s.p(c.cut([[22, -40], [32, -46], [42, -38], [40, -28], [30, -26], [24, -32]], 0.3, 3), face);
  s.p(c.cut([[28, -44], [22, -50], [20, -44]], 0.2, 2), face);
  s.x(c.poly(c.circ(36, -38, 1.4, 6)), '#fff');
  s.p(c.cut(c.blob(28, -46, 8, 5, 8, 0.2), 0.3, 3), wool);
  return `<g${k_(k)}>${s.out()}</g>`;
}
/** a fish lying flat (side view) with scales; origin centre */
export function fishCut(c, { color = C.lake3, r = 1 } = {}) {
  const s = sheet();
  s.p(c.cut([[-22, 0], [-6, -9], [10, -8], [22, 0], [10, 8], [-6, 8], [-22, 0], [-32, -9], [-30, 0], [-32, 9]].map(([x, y]) => [x * r, y * r]), 0.3, 4), color);
  s.x(c.ribbon(c.arc(4 * r, 0, 5 * r, 7 * r, -1.2, 1.2, 6), 1.2), shade(color, -0.25), 'opacity=".6"');
  s.x(c.poly(c.circ(12 * r, -2 * r, 1.6 * r, 6)), C.ink);
  return s.out();
}
/** a wicker basket; origin: bottom centre. full: heaped with bread pieces and fish */
export function basket(c, { w = 56, h = 34, full = false, k } = {}) {
  const s = sheet();
  if (full) {
    let heap = '';
    for (let i = 0; i < 6; i++) heap += c.cut(c.blob(c.rr(-w * 0.34, w * 0.34), -h - c.rr(2, 12), c.rr(8, 12), c.rr(6, 9), 8, 0.25), 0.4, 3);
    s.p(heap, C.wheat2);
    s.p(c.cut([[w * 0.1, -h - 10], [w * 0.36, -h - 18], [w * 0.4, -h - 8]], 0.2, 3), C.lake3);
  }
  s.p(c.ribbon(c.arc(0, -h, w * 0.42, h * 0.9, PI * 1.05, PI * 1.95, 12), 3.4), shade(C.basket, -0.2));
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w * 0.38, 0], [-w * 0.38, 0]], 0.5, 6), C.basket);
  let weave = '';
  for (let y = -h + 7; y < -2; y += 8) weave += c.ribbon([[-w / 2 + 6 + (y + h) * 0.18, y], [w / 2 - 6 - (y + h) * 0.18, y]], 1.6);
  s.x(weave, shade(C.basket, -0.28), 'opacity=".6"');
  s.p(c.cut(c.ell(0, -h, w / 2 + 1, 4, 14), 0.3, 4), shade(C.basket, 0.12));
  return `<g${k_(k)}>${s.out()}</g>`;
}
/** a piece broken off a loaf; origin centre */
export function crumb(c, r = 9) { return sheet().p(c.cut(c.blob(0, 0, r, r * 0.72, 8, 0.28), 0.4, 3), C.wheat2).x(c.ribbon([[-r * 0.4, -r * 0.1], [r * 0.3, -r * 0.2]], 1), shade(C.wheat2, -0.25)).out(); }

/* ---------- the court ---------- */
/** a throne with a high back; origin: floor centre (sit a puppet at about (4, -8)) */
export function throne(c) {
  const s = sheet();
  s.p(c.cut([[-40, 0], [-40, -170], [-30, -186], [0, -196], [30, -186], [40, -170], [40, -60], [-24, -60], [-24, 0]], 0.5, 6), C.sun);
  s.p(c.cut([[-32, -64], [-32, -164], [0, -180], [32, -164], [32, -64]], 0.4, 6), C.plumRobe);
  s.x(c.cut(c.star(0, -150, 12, 5, 6, 0), 0.2, 3), C.sun);
  s.p(c.cut([[-44, -56], [52, -56], [52, -44], [-44, -44]], 0.4, 6), shade(C.sun, -0.15));
  s.p(c.cut([[36, -44], [48, -44], [46, 0], [38, 0]], 0.3, 5) + c.cut([[-40, -44], [-28, -44], [-30, 0], [-38, 0]], 0.3, 5), shade(C.sun, -0.25));
  s.p(c.cut(c.blob(4, -60, 42, 7, 10, 0.1), 0.4, 4), C.terracotta);
  return s.out();
}
/** a hanging portrait: frame + a bust of a puppet. id must be unique (S.id). origin: top centre (string) */
export function portrait(c, id, look, { w = 120, h = 140, bg = C.parchment, frame = C.ochre, extra = '', label = '' } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 10, 0, w + 20, h + 20), 0.6, 8), frame);
  s.p(c.cut(c.rect(-w / 2, 10, w, h), 0.5, 8), bg);
  const bust = person(c, { ...look, halo: false });
  const lab = label ? `<g transform="translate(0 ${h + 36})">${labelTag(label, 17)}</g>` : '';
  return `${s.out()}<clipPath id="${id}"><rect x="${-w / 2}" y="10" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${extra}<g transform="translate(-6 ${10 + h * 0.42 + 167 * (h / 120)}) scale(${h / 120})">${bust}</g></g>${sheet().p(c.cut([[-w / 2 - 10, -2], [w / 2 + 10, -2], [w / 2 + 10, 12], [-w / 2 - 10, 12]], 0.4, 6), shade(frame, -0.15)).out()}${lab}`;
}
/** a little paper name tag; origin centre */
export function labelTag(text, size = 20, { fill = C.cream, ink = C.ink } = {}) {
  const ww = size * (0.5 * String(text).length + 1.2), hh = size * 1.3;
  return `<path d="M${-ww / 2} ${-hh / 2}L${ww / 2} ${-hh / 2 - 2}L${ww / 2 + 2} ${hh / 2}L${-ww / 2 - 1} ${hh / 2 + 1}Z" fill="${fill}"/><path class="grain" d="M${-ww / 2} ${-hh / 2}L${ww / 2} ${-hh / 2 - 2}L${ww / 2 + 2} ${hh / 2}L${-ww / 2 - 1} ${hh / 2 + 1}Z"/><text x="0" y="${size * 0.34}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a brass platter; covered: under a linen cloth. origin: bottom centre */
export function platter(c, { covered = false, w = 86 } = {}) {
  const s = sheet();
  if (covered) {
    const pts = [[-w * 0.42, -6], ...c.arc(0, -8, w * 0.42, w * 0.36, PI, 2 * PI, 14), [w * 0.42, -6]];
    for (let x = w * 0.42; x > -w * 0.42; x -= 12) pts.push(...c.arc(x - 6, -4, 6, 3, 0, PI, 3));
    s.p(c.cut(pts, 0.6, 5), C.linen);
    s.x(c.ribbon(c.qbez([-w * 0.2, -w * 0.3], [-w * 0.26, -w * 0.12], [-w * 0.3, -6], 8), 1.6) + c.ribbon(c.qbez([w * 0.14, -w * 0.33], [w * 0.2, -w * 0.14], [w * 0.24, -6], 8), 1.6), C.linen2);
  }
  s.p(c.cut(c.ell(0, -3, w / 2, 6, 20), 0.4, 5), C.sun);
  s.x(c.ribbon([[-w / 2 + 6, -3], [w / 2 - 6, -3]], 1.4), shade(C.sun, -0.25), 'opacity=".7"');
  s.p(c.cut([[-12, 0], [12, 0], [8, 6], [-8, 6]], 0.2, 3), shade(C.sun, -0.2));
  return s.out();
}
/** one half of the kingdom (a torn map); side -1 left / 1 right; origin at the tear's middle */
export function mapHalf(c, side = -1, { w = 150, h = 110 } = {}) {
  const tear = [];
  for (let i = 0; i <= 8; i++) tear.push([(i % 2 ? 5 : -5) + c.rr(-2, 2), -h / 2 + (i * h) / 8]);
  const s = sheet();
  const pts = side < 0 ? [[-w, -h / 2 + 3], ...tear, [-w + 2, h / 2]] : [...tear, [w, h / 2 - 2], [w - 2, -h / 2]];
  s.p(c.cut(pts, 0.8, 7), C.parchment);
  if (side < 0) {
    s.p(c.cut(c.blob(-w * 0.55, -8, 26, 36, 10, 0.2), 0.5, 5), C.lake);
    s.x(c.ribbon([[-w * 0.52, 26], [-w * 0.46, 50]], 3), C.lake2);
    s.p(c.cut(c.rect(-w * 0.85, -30, 10, 8), 0.2, 3) + c.cut(c.rect(-w * 0.26, 18, 10, 8), 0.2, 3), C.clay);
  } else {
    s.x(c.ribbon([[w * 0.3, -h / 2], [w * 0.25, -10], [w * 0.35, 20], [w * 0.3, h / 2]], 3), C.lake2);
    s.p(c.cut(c.rect(w * 0.55, -26, 12, 9), 0.2, 3) + c.cut(c.rect(w * 0.7, 20, 10, 8), 0.2, 3), C.clay);
    s.p(c.cut([[w * 0.5, 10], [w * 0.62, -12], [w * 0.74, 10]], 0.3, 3), C.rock2);
  }
  let hills = '';
  for (let i = 0; i < 3; i++) { const x = side * c.rr(w * 0.2, w * 0.85), y = c.rr(-40, 40); hills += c.ribbon(c.arc(x, y, 10, 6, PI, 2 * PI, 5), 1.4); }
  s.x(hills, C.moss, 'opacity=".7"');
  return s.out();
}

/* ---------- places ---------- */
/** a rock-cut tomb (the round stone is separate); origin: ground centre of the doorway */
export function tombRock(c, w = 380, h = 260) {
  const s = sheet();
  const pts = [[-w / 2, 0], [-w / 2 + 30, -h * 0.6], [-w * 0.2, -h * 0.92], [w * 0.1, -h], [w * 0.36, -h * 0.8], [w / 2, -h * 0.4], [w / 2 + 20, 0]];
  s.p(c.cut(pts, 3, 12), C.rock);
  s.p(c.cut([[-44, 0], [-44, -80], ...c.arc(0, -80, 44, 46, PI, 2 * PI, 12), [44, 0]], 0.6, 6), C.soilRich);
  s.x(c.cut(c.blob(w * 0.2, -h * 0.55, 60, 28, 9, 0.3), 1, 6) + c.cut(c.blob(-w * 0.26, -h * 0.38, 50, 22, 9, 0.3), 1, 6), shade(C.rock, 0.25), 'opacity=".6"');
  s.x(c.ribbon([[-60, 2], [60, 2]], 5), C.rock3, 'opacity=".6"');
  return s.out();
}
/** a round rolling stone; a chiselled rim on the upper left (never under the hub — that reads as a face) */
export function tombStone(c, r = 62) {
  return sheet().p(c.cut(c.circ(0, 0, r, 30), 1, 6), C.rock2).x(c.ribbon(c.arc(0, 0, r * 0.8, r * 0.8, 3.5, 5.1, 10), 3), shade(C.rock2, -0.18), 'opacity=".6"').x(c.poly(c.circ(0, 0, 6, 8)), shade(C.rock2, -0.25)).out();
}
/** an oar; origin: the grip, blade down along +y */
export function oar(c, len = 170) {
  return sheet().p(c.ribbon([[0, 0], [0, len * 0.72]], 5), C.wood3).p(c.cut([[-7, len * 0.7], [7, len * 0.7], [9, len], [-9, len]], 0.4, 5), C.wood3).out();
}
/** a market awning on two poles; origin: ground centre */
export function awning(c, w = 200, h = 150, col = C.terracotta) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 + 4, -h, 7, h), 0.3, 6) + c.cut(c.rect(w / 2 - 11, -h, 7, h), 0.3, 6), C.wood2);
  const pts = [[-w / 2 - 10, -h + 6], [-w / 2 + 6, -h - 26], [w / 2 - 6, -h - 26], [w / 2 + 10, -h + 6]];
  for (let x = w / 2 + 10; x > -w / 2 - 10; x -= 24) pts.push(...c.arc(x - 12, -h + 6, 12, 8, 0, PI, 4));
  s.p(c.cut(pts, 0.5, 7), C.cream);
  let st = '';
  for (let x = -w / 2; x < w / 2 + 10; x += 48) st += c.cut([[x, -h + 12], [x + 6, -h - 24], [x + 28, -h - 24], [x + 24, -h + 14]], 0.3, 5);
  s.x(st, col, 'opacity=".85"');
  return s.out();
}
/** a sick person lying on a mat (under a blanket); origin: middle of the mat top */
export function sickOnMat(c, look, w = 170) {
  const s = 0.62;
  const p = person(c, { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, ...look, eyes: 'closed' });
  return `${pallet(c, w)}<g transform="translate(${w / 2 - 30} ${-40 * s}) rotate(-90) scale(${s})">${p}</g><g transform="translate(${-w * 0.05} 0) scale(${w / 200} 1)">${blanket(c)}</g>`;
}

/* ---------- the flashback frame ---------- */
export const SEPIA = { sky: ['#e8d6b4', '#efe2c6', '#f4ead5'], wall: mix(C.parchment, C.dune, 0.35), wall2: mix(C.parchment, C.dune, 0.6), ink: mix(C.ink, C.wood2, 0.4) };
/** a torn sepia vignette around the stage: "a story from before". Returns the layer. */
export function storyFrame(S, { col = mix(C.parchment, C.wood3, 0.45), inset = 58 } = {}) {
  const c = S.c;
  const v = S.view();
  const L = S.layer({ par: 0, sh: 6, rise: 0.4 });
  const x0 = v.x0 + inset, x1 = v.x1 - inset, y0 = v.y0 + inset, y1 = v.y1 - inset;
  const edge = [];
  const jag = (a, b, n) => { for (let i = 0; i < n; i++) { const u = i / n; edge.push([a[0] + (b[0] - a[0]) * u + c.rr(-5, 5), a[1] + (b[1] - a[1]) * u + c.rr(-5, 5)]); } };
  jag([x0, y0], [x1, y0], 40); jag([x1, y0], [x1, y1], 30); jag([x1, y1], [x0, y1], 40); jag([x0, y1], [x0, y0], 30);
  const s = sheet();
  s.p(c.cut([[-3000, -3000], [5000, -3000], [5000, 5000], [-3000, 5000]], 0, 400) + c.hole(edge, 1.2, 8), col);
  L.add(s.out());
  return L;
}

/* ---------- a hanging thing that also works as a plain `hang` ---------- */
export function hung(inner, len = 600) { return hang(inner, len); }
/** move a hung element down from the flies (k: 0 up in the flies → 1 in place) */
export function drop(el, x, y, k, time = 0, seed = 0, amp = 2) {
  pose(el, { x, y: y - (1 - k) * 700, r: Math.sin(time * 1.1 + seed) * amp * k, o: k > 0.005 ? 1 : 0 });
}
