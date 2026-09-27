// Mark 16 — cut-outs shared by this chapter's scenes: the three women, the young man in white,
// spice jars, the garden with the tomb, the upper room, maps, the globe, sign plates, the throne of light.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, hanging, sky } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, flowers, rock, town, house } from '../../assets/nature.js';
import { rays, paperLabel } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';
import { TWELVE } from '../mark3/lib.js';
import { walledCity } from '../mark1/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, cup, lowTable, bowl, loaf, candle, lantern, addToHead, dust, townsfolk } from '../mark2/lib.js';
export { TWELVE, LOOK, withFace, faceBits, along, nameTag, bubble, strip, stoneHeart, wisp, sparkle, man, woman, handAt } from '../mark3/lib.js';
export { voiceRings, hang2, tagOnString, snake, walledCity, dove } from '../mark1/lib.js';
export { glory, globe, soulLight, lightCrown } from '../mark8/lib.js';
export { throne } from '../mark12/lib.js';
export { tr, paperLabel };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ---------- the cast of this chapter ---------- */
// the three women who come to the tomb (kept the same in every scene)
export const MAGD = { robe: C.linen2, mantle: C.roseRobe, hairStyle: 'veil', veil: C.roseRobe, veil2: shade(C.roseRobe, -0.14), hair: C.hair2, skin: C.skin, belt: null };
export const MARYJ = { robe: C.sageRobe, mantle: C.stone, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.greyHair, skin: C.skin2, belt: null };
export const SALOME = { robe: C.ochreRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14), hair: C.hair3, skin: C.skin3, belt: C.clay };
export const WOMEN = [
  { k: 'magd', o: MAGD, name: () => tr(['Maria', 'Magdalena'], ['Mary', 'Magdalene']) },
  { k: 'maryj', o: MARYJ, name: () => tr(['Maria,', 'matka Jakuba'], ['Mary,', 'mother of James']) },
  { k: 'salome', o: SALOME, name: () => tr('Salome', 'Salome') },
];
// the young man in the white robe (Mark says only "a young man"; no wings)
export const YOUTH = { robe: '#fffdf6', mantle: C.linen, hair: C.wheat2, hairStyle: 'short', beard: 'none', skin: C.skin };
// the Risen One "in another form": a traveller's hood and cloak
export const STRANGER = { ...CAST.jesus, robe: C.stone, mantle: C.dustyBlue, hairStyle: 'wrap', veil: C.dustyBlue, veil2: shade(C.dustyBlue, -0.15) };
// the two walking into the country
export const WALKERS = [
  { robe: C.clayMantle, mantle: C.stone, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather },
  { robe: C.tealRobe, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.leather },
];
export const MERCHANT = { robe: C.plumRobe, mantle: C.ochre, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.terracotta, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };
/** the Eleven (the Twelve without Judas), Peter first */
export const ELEVEN = TWELVE.filter((m) => m.k !== 'judas');

/* ---------- spices ---------- */
/** a small alabaster flask of ointment; origin at its base */
export function spiceJar(c, col = C.cream, lid = C.clay) {
  const s = sheet();
  s.p(c.cut([[-7, 0], [-10, -8], [-11, -20], [-7, -28], [-4, -32], [-4, -38], [4, -38], [4, -32], [7, -28], [11, -20], [10, -8], [7, 0]], 0.3, 4), col);
  s.p(c.cut(c.rect(-5.5, -44, 11, 7), 0.2, 3), lid);
  s.x(c.ribbon([[-10, -15], [10, -15]], 1.8), shade(col, -0.2), 'opacity=".7"');
  s.x(c.cut(c.ell(-4, -20, 2, 6, 8), 0.2, 2), '#fff', 'opacity=".5"');
  return s.out();
}
/** a curl of fragrance rising (origin at its foot) */
export function scent(c, h = 70, col = '#fff3d6') {
  const pts = c.cbez([0, 0], [-16, -h * 0.3], [18, -h * 0.6], [-2, -h], 16);
  return `<path d="${c.ribbon(pts, (u) => 4.2 - u * 3)}" fill="${col}" opacity=".85"/><path d="${c.poly(c.circ(-2, -h - 4, 3, 8))}" fill="${col}" opacity=".8"/>`;
}
/** a spice seller's stall: back (posts, awning, shelves of jars) and front (counter with heaps of spice) */
export function spiceStall(c, w = 300, h = 250) {
  const b = sheet();
  b.p(c.cut(c.rect(-w / 2, -h, 10, h), 0.3, 6) + c.cut(c.rect(w / 2 - 10, -h, 10, h), 0.3, 6), C.wood2);
  b.p(c.cut(c.rect(-w / 2 + 10, -h + 20, w - 20, h - 90), 0.5, 10), mix(C.wood2, C.soilDark, 0.35));
  // shelves with jars
  let shelves = '', jars = '', jars2 = '';
  [-h + 70, -h + 130].forEach((y) => {
    shelves += c.cut(c.rect(-w / 2 + 14, y, w - 28, 7), 0.3, 8);
    for (let x = -w / 2 + 30; x < w / 2 - 24; x += c.rr(24, 34)) {
      const hh = c.rr(22, 36), ww = hh * c.rr(0.35, 0.5);
      const jar = c.cut([[x - ww * 0.7, y], [x - ww, y - hh * 0.5], [x - ww * 0.55, y - hh * 0.9], [x - ww * 0.3, y - hh], [x + ww * 0.3, y - hh], [x + ww * 0.55, y - hh * 0.9], [x + ww, y - hh * 0.5], [x + ww * 0.7, y]], 0.3, 4);
      if (c.chance(0.5)) jars += jar; else jars2 += jar;
    }
  });
  b.p(shelves, C.wood);
  b.p(jars, C.cream).p(jars2, C.pot);
  // bundles of herbs hanging from the awning beam
  let herbs = '';
  for (let x = -w / 2 + 40; x < w / 2 - 30; x += 46) herbs += c.cut([[x - 4, -h + 4], [x + 4, -h + 4], [x + 9, -h + 34], [x, -h + 40], [x - 9, -h + 34]], 0.6, 4);
  b.p(herbs, C.olive);
  // striped awning
  const aw = [[-w / 2 - 22, -h + 6], [-w / 2 + 6, -h - 34], [w / 2 - 6, -h - 34], [w / 2 + 22, -h + 6]];
  for (let x = w / 2 + 22; x > -w / 2 - 22; x -= 28) aw.push(...c.arc(x - 14, -h + 6, 14, 9, 0, PI, 5));
  b.p(c.cut(aw, 0.5, 7), C.cream);
  let stripes = '';
  for (let x = -w / 2 - 10; x < w / 2 + 10; x += 56) stripes += c.cut([[x, -h + 10], [x + 9, -h - 32], [x + 32, -h - 32], [x + 28, -h + 12]], 0.3, 5);
  b.x(stripes, C.terracotta, 'opacity=".75"');
  const f = sheet();
  f.p(c.cut([[-w / 2 - 8, -76], [w / 2 + 8, -76], [w / 2 + 8, -64], [-w / 2 - 8, -64]], 0.3, 8), C.wood);
  f.p(c.cut(c.rect(-w / 2, -64, w, 64), 0.5, 10), C.wood3);
  f.x(c.ribbon([[-w / 2 + 2, -40], [w / 2 - 2, -39]], 1.4) + c.ribbon([[-w / 2 + 2, -18], [w / 2 - 2, -19]], 1.4), shade(C.wood3, -0.2), 'opacity=".6"');
  // heaps of spice in shallow bowls on the counter
  const heaps = [[-w * 0.36, C.sun], [-w * 0.18, C.clay], [w * 0.2, C.wood3], [w * 0.38, C.sage]];
  heaps.forEach(([x, col]) => {
    f.p(c.cut([[x - 24, -76], ...c.arc(x, -76, 22, 16, PI, 2 * PI, 10), [x + 24, -76]], 0.4, 4), col);
    f.p(c.cut([[x - 28, -80], [x + 28, -80], [x + 20, -70], [x - 20, -70]], 0.3, 5), C.pot);
  });
  return { back: b.out(), front: f.out() };
}
/** the stall's cloth cover (drawn from its top edge at 0 down to h) */
export function stallCover(c, w = 300, h = 170) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0], [w / 2, h]];
  for (let x = w / 2; x > -w / 2; x -= 30) pts.push([x - 15, h + c.rr(-4, 6)], [x - 30, h]);
  s.p(c.cut(pts, 0.6, 8), mix(C.dustyBlue, C.stone2, 0.4));
  let folds = '';
  for (let x = -w / 2 + 20; x < w / 2; x += 34) folds += c.ribbon([[x, 4], [x + c.rr(-4, 4), h - 6]], 2.4);
  s.x(folds, shade(mix(C.dustyBlue, C.stone2, 0.4), -0.2), 'opacity=".6"');
  s.p(c.ribbon([[-w / 2 - 4, 3], [w / 2 + 4, 3]], 7), C.wood2);
  return s.out();
}
/** a little tomb in a bubble, with a soft light over it: "to go and anoint Jesus" */
export function tombIcon(c, { open = false } = {}) {
  const s = sheet();
  s.p(c.cut([[-30, 12], [-28, -14], [-14, -28], [14, -30], [28, -16], [32, 12]], 0.6, 5), C.rock);
  s.p(c.cut([[-10, 12], [-10, -4], ...c.arc(0, -4, 10, 10, PI, 2 * PI, 8), [10, 12]], 0.3, 4), C.soilRich);
  s.p(c.cut(c.circ(open ? 24 : 4, 2, 11, 14), 0.4, 3), C.rock2);
  return `<circle cx="0" cy="-30" r="30" fill="url(#halo-glow)"/>${s.out()}`;
}
/** a star hung on a string (the three stars that end the Sabbath) */
export function hungStar(c, r = 12) {
  return sheet().p(c.cut(c.star(0, 0, r, r * 0.42, 5, -PI / 2), 0.3, 3), C.star).x(c.poly(c.circ(0, 0, r * 0.25, 6)), '#fff').out();
}

/* ---------- the garden with the tomb (scenes: dawn, flight, Mary Magdalene) ---------- */
export const DOOR = { x: 1180, y: 692 };        // foot of the tomb's doorway
export const STONE = { x: 1335, r: 104 };        // the great round stone, rolled aside
export const GARDEN_PATH = [[-520, 810], [-120, 780], [260, 748], [620, 728], [900, 714], [1080, 700], [1150, 694]];
/** depth scale of a walker on the garden path (y → s) */
export const pathS = (y) => 0.8 + (y - 694) / 116 * 0.24;

/** the tomb: a rock outcrop with a doorway; returns { rock, door } markup */
export function tombRockBig(c) {
  const s = sheet();
  const X = DOOR.x, Y = DOOR.y;
  const pts = [[X - 260, Y + 14], [X - 236, Y - 90], [X - 196, Y - 200], [X - 120, Y - 268], [X - 10, Y - 300], [X + 110, Y - 296], [X + 230, Y - 262], [X + 330, Y - 200], [X + 400, Y - 110], [X + 440, Y + 14]];
  s.p(c.cut(pts, 3, 12), C.rock);
  s.x(c.cut(c.blob(X + 150, Y - 220, 70, 26, 9, 0.3), 1, 6) + c.cut(c.blob(X - 130, Y - 180, 56, 22, 9, 0.3), 1, 6) + c.cut(c.blob(X + 260, Y - 120, 40, 18, 9, 0.3), 1, 6), shade(C.rock, 0.28), 'opacity=".65"');
  s.x(c.cut(c.blob(X - 170, Y - 60, 60, 20, 9, 0.3), 1, 6) + c.cut(c.blob(X + 330, Y - 40, 50, 16, 9, 0.3), 1, 6), shade(C.rock, -0.1), 'opacity=".5"');
  // the doorway: carved frame, then the dark mouth
  s.p(c.cut([[X - 70, Y + 4], [X - 70, Y - 110], ...c.arc(X, Y - 110, 70, 56, PI, 2 * PI, 14), [X + 70, Y - 110], [X + 70, Y + 4]], 0.6, 6), shade(C.rock, -0.08));
  s.p(c.cut([[X - 54, Y + 4], [X - 54, Y - 104], ...c.arc(X, Y - 104, 54, 44, PI, 2 * PI, 12), [X + 54, Y - 104], [X + 54, Y + 4]], 0.5, 6), mix(C.soilRich, C.storm2, 0.3));
  // the groove the stone rolls in
  s.p(c.cut([[X - 90, Y - 2], [X + 300, Y - 4], [X + 300, Y + 10], [X - 90, Y + 12]], 0.4, 8), C.rock3);
  // a few plants on the rock
  s.p(c.cut(c.blob(X - 40, Y - 296, 40, 14, 9, 0.3), 0.8, 5) + c.cut(c.blob(X + 190, Y - 272, 34, 12, 9, 0.3), 0.8, 5) + c.cut(c.blob(X + 380, Y - 130, 30, 12, 9, 0.3), 0.8, 5), C.moss);
  return s.out();
}
/** the great round stone (origin at its centre) */
export function bigStone(c, r = STONE.r) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 40), 1, 6), C.rock2);
  s.p(c.cut(c.circ(-r * 0.06, -r * 0.06, r * 0.84, 34), 0.8, 6), shade(C.rock2, 0.08));
  // chisel marks and cracks (no face!)
  let marks = '';
  for (let i = 0; i < 7; i++) { const a = c.rr(0, PI * 2), d = c.rr(0.2, 0.7) * r; marks += c.ribbon([[Math.cos(a) * d, Math.sin(a) * d], [Math.cos(a) * d + c.rr(-14, 14), Math.sin(a) * d + c.rr(-14, 14)]], 2.2); }
  marks += c.ribbon([[r * 0.2, -r * 0.8], [r * 0.3, -r * 0.5], [r * 0.18, -r * 0.3], [r * 0.34, -r * 0.1]], 2);
  s.x(marks, shade(C.rock2, -0.22), 'opacity=".5"');
  s.x(c.ribbon(c.arc(0, 0, r * 0.9, r * 0.9, PI * 1.1, PI * 1.45, 8), 5), shade(C.rock2, 0.35), 'opacity=".55"');
  return s.out();
}
/** light pouring out of the open tomb (origin at the doorway's centre) */
export function tombLight(c) {
  let d = '';
  for (let i = 0; i < 8; i++) {
    const a = PI + 0.25 + i * 0.37 + c.rr(-0.05, 0.05), w = c.rr(0.03, 0.06), r = c.rr(380, 560);
    d += c.poly([[Math.cos(a - w) * 30, Math.sin(a - w) * 30], [Math.cos(a - w * 2.5) * r, Math.sin(a - w * 2.5) * r], [Math.cos(a + w * 2.5) * r, Math.sin(a + w * 2.5) * r], [Math.cos(a + w) * 30, Math.sin(a + w) * 30]]);
  }
  return `<path d="${d}" fill="${C.lampGlow}" opacity=".3"/>`;
}

/**
 * The garden set. Adds its layers to S (after the sky & the hanging layer) and returns handles.
 * { ground, walkL, doorGlow, doorRays, stone, hedge, fg, gy }
 * opts.hedge: add the flowering hedge flat that hides the doorway until the women look up.
 */
export function gardenSet(S, { hedge = false, tint = 0 } = {}) {
  const c = S.c;
  const T = (col) => (tint ? mix(col, C.duskViolet, tint) : col);
  const far = S.layer({ par: 0.08, sh: 2 });
  const h1 = band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 340, 120], color: T(C.hillFar) });
  far.add(h1.markup + `<g>${walledCity(c, 330, h1.fn(330) + 8, 1.3, { wall: T(C.stone), wall2: T(C.stone2), temple: T(C.cream) })}</g>`);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 540, amps: [16, 7, 3], lens: [900, 300, 110], color: T(C.hillMid), trees: 34, treeColor: T(C.sage), treeH: 26 });
  mid.add(h2.markup + olive(c, 60, h2.fn(60) + 6, 0.8, { leaf: T(C.olive), leaf2: T(C.sage) }) + cypress(c, 820, h2.fn(820) + 4, 120, T(C.moss2)) + cypress(c, 860, h2.fn(860) + 4, 90, T(C.moss2)));

  const ground = S.layer({ par: 0.5, sh: 3 });
  const gy = c.wave(652, [5, 2], [700, 200]);
  const gs = sheet();
  gs.p(c.ridge(gy, -1400, 2800, 1700, 12, 1), T(mix(C.hillNear, C.sage2, 0.4)));
  // the path, a sandy ribbon winding to the doorway
  const pth = c.cbez([-900, 1000], [-200, 760], [700, 780], [DOOR.x, DOOR.y + 6], 40);
  gs.p(c.ribbon(pth, (u) => 170 - u * 120, 3), T(C.sand));
  gs.x(c.ribbon(pth.map(([x, y]) => [x, y + 8]), (u) => 90 - u * 70, 2), T(C.sand2), 'opacity=".45"');
  ground.add(gs.out());
  ground.add(olive(c, -120, 690, 1.3, { leaf: T(C.olive), leaf2: T(C.sage) }) + olive(c, 520, 664, 1.05, { leaf: T(C.olive), leaf2: T(C.sage) }) + cypress(c, 700, 670, 170, T(C.moss2)) + cypress(c, 1650, 680, 190, T(C.moss2)) + olive(c, 1900, 690, 1.2, { leaf: T(C.olive), leaf2: T(C.sage) }));
  ground.add(`<g>${tombRockBig(c)}</g>`);
  const doorGlow = ground.add(`<g opacity="0"><path d="${c.cut([[-54, 4], [-54, -104], ...c.arc(0, -104, 54, 44, PI, 2 * PI, 12), [54, -104], [54, 4]], 0.5, 6)}" fill="${C.lampGlow}"/><circle cx="0" cy="-60" r="150" fill="url(#halo-glow)"/></g>`);
  const doorRays = ground.add(`<g opacity="0">${tombLight(c)}</g>`);
  const stone = ground.add(`<g>${bigStone(c)}</g>`);
  ground.add(grass(c, { x0: -1200, x1: 960, y: 652, fn: gy, n: 50, h: 16, color: T(C.moss) }) + grass(c, { x0: 1580, x1: 2600, y: 652, fn: gy, n: 20, h: 16, color: T(C.moss) }));
  ground.add(flowers(c, { x0: -700, x1: 960, y: 690, fn: (x) => gy(x) + c.rr(20, 120), n: 40, h: 20 }));
  ground.add(bush(c, 880, 700, 90, T(C.sage), T(C.moss)) + bush(c, 1620, 700, 120, T(C.moss), T(C.sage)) + rock(c, 960, 720, 60, 24, C.rock2));

  const walkL = S.layer({ par: 0.52, sh: 4 });
  let hedgeEl = null;
  if (hedge) {
    const hl = S.layer({ par: 0.6, sh: 6 });
    const hs = sheet();
    let lv = '', lv2 = '', fl = '';
    for (let i = 0; i < 26; i++) {
      const x = c.rr(1000, 1560), y = c.rr(470, 740);
      const blob = c.cut(c.blob(x, y, c.rr(60, 100), c.rr(50, 80), 12, 0.2), 1, 7);
      if (i % 2) lv += blob; else lv2 += blob;
    }
    hs.p(c.cut([[1020, 780], [1030, 600], [1100, 520], [1560, 500], [1600, 780]], 1, 10), T(C.moss2));
    hs.p(lv2, T(C.moss)).p(lv, T(C.leaf));
    for (let i = 0; i < 40; i++) fl += c.cut(c.star(c.rr(1010, 1560), c.rr(470, 740), c.rr(6, 9), 3, 5, c.rr(0, 6)), 0.2, 3);
    hs.p(fl, C.roseRobe);
    hedgeEl = hl.add(`<g>${hs.out()}</g>`);
  }
  const fg = S.layer({ par: 0.9, sh: 6 });
  fg.add(bush(c, -40, 1000, 260, T(C.moss), T(C.sage)) + bush(c, 1640, 1000, 240, T(C.moss2), T(C.sage)) + grass(c, { x0: -700, x1: 350, y: 975, n: 24, h: 46, color: T(C.moss2) }) + grass(c, { x0: 1250, x1: 2300, y: 975, n: 24, h: 46, color: T(C.moss2) }) + flowers(c, { x0: 140, x1: 420, y: 975, n: 10, h: 40 }) + flowers(c, { x0: 1200, x1: 1480, y: 975, n: 10, h: 40 }));
  return { ground, walkL, doorGlow, doorRays, stone, hedge: hedgeEl, fg, gy };
}

/* ---------- sky & choreography helpers ---------- */
/** blend a sky through several palettes: keys = [[t0, [top, mid, bottom]], …] */
export function skyKeys(sk, t, keys) {
  if (t <= keys[0][0]) { sk.set(...keys[0][1]); return; }
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [a, pa] = keys[i - 1], [b, pb] = keys[i];
      const u = (t - a) / (b - a), e = u * u * (3 - 2 * u);
      sk.blend(pa, pb, e);
      return;
    }
  }
  sk.set(...keys[keys.length - 1][1]);
}
/** keep a held prop upright while the arm swings: counter-rotate the puppet's .hold group */
export function upright(p, which, a) {
  const el = (which === 'B' ? p.armB : p.armF)?.querySelector('.hold');
  if (el) pose(el, { x: 1.5, y: 57, r: a });
}
/** "Who will roll away the stone?" — a huge stone and three tiny women pushing at it */
export function pushIcon(c) {
  const s = sheet();
  s.p(c.cut(c.circ(10, -34, 34, 26), 0.6, 4), C.rock2);
  s.x(c.ribbon(c.arc(10, -34, 22, 22, 0.4, 2.4, 8), 2), shade(C.rock2, -0.2), 'opacity=".6"');
  const tiny = (x, col) => sheet().p(c.cut([[x - 5, 0], [x - 2, -16], [x + 3, -18], [x + 6, 0]], 0.2, 3), col).p(c.cut(c.circ(x + 3, -21, 3.6, 8), 0.1, 2), C.skin2).p(c.ribbon([[x + 2, -14], [x + 9, -16]], 2.4), col).out();
  return s.out() + tiny(-40, C.roseRobe) + tiny(-31, C.sageRobe) + tiny(-22, C.ochreRobe);
}
/** three dots of talk (for a speech bubble) */
export function talkDots(c, col = C.inkSoft) {
  return `<path d="${c.poly(c.circ(-9, 0, 2.6, 8)) + c.poly(c.circ(0, 0, 2.6, 8)) + c.poly(c.circ(9, 0, 2.6, 8))}" fill="${col}"/>`;
}

/* ---------- inside the tomb ---------- */
/** folded linen cloths (origin at their bottom centre, lying on the ledge) */
export function linenCloths(c) {
  const s = sheet();
  s.p(c.cut([[-62, 0], [-58, -12], [40, -14], [52, -4], [50, 0]], 0.5, 6), C.linen);
  s.p(c.cut([[-54, -12], [-50, -22], [30, -24], [38, -14]], 0.4, 6), C.linen2);
  s.x(c.ribbon([[-50, -7], [44, -8]], 1.4) + c.ribbon([[-44, -18], [30, -19]], 1.2), shade(C.linen2, -0.15), 'opacity=".7"');
  // the cloth for the head, rolled up apart
  s.p(c.cut(c.ell(84, -9, 18, 9, 14), 0.4, 4), C.linen);
  s.x(c.ribbon(c.arc(84, -9, 10, 5, 0.3, PI * 1.7, 8), 1.2), shade(C.linen2, -0.15), 'opacity=".7"');
  return s.out();
}
/** a small head portrait (for medallions): face, hair, beard, veil from a look */
export function miniHead(c, o, r = 16) {
  const s = sheet();
  const hs = o.hairStyle || 'short';
  if (hs === 'veil' || hs === 'wrap') s.p(c.cut(c.arc(0, r * 0.1, r * 1.25, r * 1.35, PI * 0.95, PI * 2.05, 14).concat([[r * 1.2, r * 1.1], [-r * 1.2, r * 1.1]]), 0.3, 4), o.veil || C.stone);
  s.p(c.cut(c.circ(0, 0, r, 18), 0.2, 3), o.skin || C.skin);
  if (hs === 'short' || hs === 'long') s.p(c.cut([...c.arc(0, 0, r * 1.06, r * 1.06, PI * 1.02, PI * 1.98, 10), [r * 0.7, -r * 0.5], [-r * 0.7, -r * 0.5]], 0.3, 3), o.hair || C.hair);
  if (hs === 'curly') { let d = ''; for (let i = 0; i < 7; i++) { const a = PI * (1.05 + i * 0.15); d += c.cut(c.circ(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95, r * 0.32, 8), 0.1, 2); } s.p(d, o.hair || C.hair); }
  if (hs === 'wrap' || hs === 'veil') s.p(c.cut(c.arc(0, -r * 0.1, r * 1.1, r * 1.0, PI * 1.05, PI * 1.95, 10), 0.2, 3), o.veil2 || shade(o.veil || C.stone, -0.1));
  const bc = o.beardColor || o.hair || C.hair;
  if (o.beard === 'full' || o.beard === 'wild') s.p(c.cut([[-r * 0.8, r * 0.1], [-r * 0.5, r * 0.8], [0, r * 1.15], [r * 0.5, r * 0.8], [r * 0.8, r * 0.1], [r * 0.4, r * 0.4], [-r * 0.4, r * 0.4]], 0.2, 3), bc);
  if (o.beard === 'short') s.p(c.cut([[-r * 0.7, r * 0.3], [-r * 0.3, r * 0.85], [r * 0.3, r * 0.85], [r * 0.7, r * 0.3], [r * 0.3, r * 0.5], [-r * 0.3, r * 0.5]], 0.2, 3), bc);
  s.x(c.poly(c.circ(-r * 0.33, -r * 0.08, r * 0.1, 6)) + c.poly(c.circ(r * 0.33, -r * 0.08, r * 0.1, 6)), C.inkSoft);
  s.x(c.poly(c.circ(-r * 0.5, r * 0.3, r * 0.16, 8)) + c.poly(c.circ(r * 0.5, r * 0.3, r * 0.16, 8)), C.blush, 'opacity=".5"');
  return s.out();
}
/** a round medallion with a portrait inside (origin at its centre) */
export function medallion(c, o, { r = 28, rim = C.wood3, back = C.parchment } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 5, 24), 0.4, 4), rim).p(c.cut(c.circ(0, 0, r, 24), 0.3, 4), back);
  return s.out() + `<g transform="translate(0 ${(r * 0.12).toFixed(1)})">${miniHead(c, o, r * 0.52)}</g>`;
}
/** a two-sided hanging disc: returns { front, back } markup, each origin at centre */
export function discFaces(c, r = 110) {
  const rim = (fill) => sheet().p(c.cut(c.circ(0, 0, r + 8, 40), 0.5, 5), C.wood3).p(c.cut(c.circ(0, 0, r, 40), 0.4, 5), fill).out();
  // front: the cross on the hill at dusk (reverent, small, no figure)
  const f = sheet();
  f.p(c.cut([[-r * 0.95, r * 0.3], [-r * 0.5, r * 0.05], [0, -r * 0.08], [r * 0.5, r * 0.06], [r * 0.95, r * 0.3], [r * 0.7, r * 0.72], [-r * 0.7, r * 0.72]], 0.8, 6), mix(C.storm2, C.plumRobe, 0.3));
  f.p(c.cut([[-4, -r * 0.08], [-4, -r * 0.62], [4, -r * 0.62], [4, -r * 0.08]], 0.3, 4) + c.cut([[-r * 0.2, -r * 0.46], [r * 0.2, -r * 0.46], [r * 0.2, -r * 0.39], [-r * 0.2, -r * 0.39]], 0.3, 4), mix(C.wood2, C.soilDark, 0.5));
  const front = `<g>${rim(mix(C.duskViolet, C.dusk, 0.4))}${f.out()}</g>`;
  // back: the sunrise over the open, empty tomb
  const b = sheet();
  let rs = '';
  for (let i = 0; i < 14; i++) { const a = PI + (i / 13) * PI, w = 0.07; rs += c.poly([[0, r * 0.1], [Math.cos(a - w) * r, r * 0.1 + Math.sin(a - w) * r], [Math.cos(a + w) * r, r * 0.1 + Math.sin(a + w) * r]]); }
  b.x(rs, '#fff3cf', 'opacity=".8"');
  b.p(c.cut(c.circ(0, r * 0.12, r * 0.3, 24), 0.3, 4), C.sun);
  b.p(c.cut([[-r * 0.95, r * 0.4], [-r * 0.6, r * 0.16], [-r * 0.1, r * 0.1], [r * 0.4, r * 0.14], [r * 0.95, r * 0.36], [r * 0.7, r * 0.72], [-r * 0.7, r * 0.72]], 0.8, 6), C.sage);
  b.p(c.cut([[-r * 0.1, r * 0.5], [-r * 0.08, r * 0.28], [r * 0.08, r * 0.18], [r * 0.34, r * 0.2], [r * 0.5, r * 0.5]], 0.5, 4), C.rock);
  b.p(c.cut([[r * 0.08, r * 0.5], [r * 0.08, r * 0.38], ...c.arc(r * 0.16, r * 0.38, r * 0.08, r * 0.07, PI, 2 * PI, 6), [r * 0.24, r * 0.5]], 0.2, 3), C.lampGlow);
  b.p(c.cut(c.circ(r * 0.44, r * 0.42, r * 0.1, 12), 0.2, 3), C.rock2);
  const back = `<g>${rim(mix(C.skyBlue, C.dawn, 0.5))}${b.out()}</g>`;
  return { front, back };
}

/* ---------- the map: from Jerusalem to Galilee ---------- */
export const MAP = { w: 660, h: 430, jer: [-90, 150], lake: [110, -120], road: [[-90, 140], [-120, 80], [-80, 20], [-20, -30], [40, -70], [90, -104]] };
/** parchment map of the land (origin at its centre): Jerusalem, the Jordan, the lake of Galilee */
export function landMap(c) {
  const { w, h } = MAP;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2, 10), C.parchment);
  s.x(c.ribbon([[-w / 2 + 16, -h / 2 + 16], [w / 2 - 16, -h / 2 + 16], [w / 2 - 16, h / 2 - 16], [-w / 2 + 16, h / 2 - 16], [-w / 2 + 16, -h / 2 + 18]], 2), C.clay, 'opacity=".5"');
  // the sea to the west
  s.p(c.cut([[-w / 2 + 18, -h / 2 + 18], [-230, -h / 2 + 18], [-250, -120], [-236, -40], [-262, 60], [-250, 140], [-270, h / 2 - 18], [-w / 2 + 18, h / 2 - 18]], 1.2, 8), mix(C.lake, C.parchment, 0.3));
  let hills = '';
  [[-180, -150], [-40, -170], [200, -150], [-190, 20], [-10, 60], [60, 120], [-170, 140], [200, 60], [230, 170]].forEach(([x, y]) => { hills += c.cut([[x - 22, y + 8], [x, y - 16], [x + 22, y + 8]], 0.5, 6); });
  s.x(hills, shade(C.parchment, -0.14));
  // the lake of Galilee, the Jordan, the Dead Sea
  const [lx, ly] = MAP.lake;
  s.p(c.cut([[lx - 10, ly - 44], [lx + 22, ly - 40], [lx + 34, ly - 10], [lx + 26, ly + 24], [lx + 4, ly + 42], [lx - 16, ly + 30], [lx - 24, ly], [lx - 22, ly - 30]], 0.6, 5), C.lake);
  s.p(c.ribbon([[lx + 4, ly + 40], [lx + 20, ly + 90], [lx + 6, ly + 150], [lx + 26, ly + 210], [lx + 14, 190]], 4), C.lake2);
  s.p(c.cut(c.blob(lx + 20, 200, 18, 34, 10, 0.15), 0.6, 5), C.lake2);
  const txt = (x, y, t, size = 18, col = C.inkSoft, anchor = 'start') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${t}</text>`;
  const [jx, jy] = MAP.jer;
  s.p(c.cut(c.rect(jx - 16, jy - 12, 32, 18), 0.3, 4) + c.cut([[jx - 18, jy - 12], [jx, jy - 26], [jx + 18, jy - 12]], 0.3, 4), C.clay);
  const labels = txt(jx - 26, jy + 6, tr('Jerozolima', 'Jerusalem'), 20, C.inkSoft, 'end') + txt(lx + 44, ly + 4, tr('Galilea', 'Galilee'), 30, C.terracotta) + txt(-300, -h / 2 + 50, tr('Morze Wielkie', 'the Great Sea'), 15, shade(C.lakeDeep, -0.1));
  return s.out() + labels;
}
/** the road on the map, drawn as a ribbon (origin at map centre) */
export function mapRoad(c, col) {
  return `<path d="${c.ribbon(c.cbez(...[MAP.road[0], MAP.road[1], MAP.road[3], MAP.road[5]], 30), 7)}" fill="${col}"/>`;
}

/* ---------- the upper room (the mourning disciples; the Eleven at table) ---------- */
export const ROOM = { floor: 660, doorX: 1180, doorW: 110, doorTop: 470, winX: 520 };
/**
 * A cut-away room: back wall with a shuttered window, beams, a door on the right that opens onto the light.
 * Returns { door (leaf: pose sx 1 → closed, 0.15 → open), doorLight, lamps: [{el, flame, glow}] , wallL, floorL }.
 */
export function upperRoom(S, { dusk = 0, lamps = [] } = {}) {
  const c = S.c;
  const { floor, doorX, doorW, doorTop, winX } = ROOM;
  const wallCol = mix(C.plaster, C.duskViolet, 0.12 + dusk * 0.2), wallShade = mix(C.plaster2, C.duskViolet, 0.2 + dusk * 0.25);
  const back = S.layer({ par: 0, sky: true });
  back.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${wallCol}"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
  // what is seen through the doorway: morning street light
  const outL = S.layer({ par: 0.28, sh: 2 });
  const doorLight = outL.add(`<g><path d="${c.poly(c.rect(doorX, doorTop, doorW, floor - doorTop + 4))}" fill="${C.lampGlow}"/><path d="${c.poly([[doorX + 10, floor - 60], [doorX + 40, floor - 90], [doorX + 80, floor - 70], [doorX + doorW, floor - 80], [doorX + doorW, floor + 4], [doorX, floor + 4]])}" fill="${mix(C.sage2, C.lampGlow, 0.4)}"/></g>`);
  const wallL = S.layer({ par: 0.3, sh: 4 });
  const w = sheet();
  const winPts = c.rect(winX, 330, 110, 100);
  const doorPts = c.rect(doorX, doorTop, doorW, floor - doorTop + 6);
  w.p(c.cut([[-900, -600], [2500, -600], [2500, floor + 6], [-900, floor + 6]], 1, 20) + c.hole(doorPts, 0.4, 8) + c.hole(winPts, 0.4, 6), wallCol);
  let blot = '';
  for (let i = 0; i < 14; i++) blot += c.cut(c.blob(c.rr(-400, 2000), c.rr(200, 620), c.rr(40, 90), c.rr(14, 30), 9, 0.25), 0.6, 6);
  w.x(blot, wallShade, 'opacity=".55"');
  // beams across the top, a shelf, frames
  let beams = '';
  for (let x = -700; x < 2400; x += 230) beams += c.cut([[x, -600], [x + 30, -600], [x + 26, 190], [x + 4, 190]], 0.4, 10);
  w.p(c.cut([[-900, 150], [2500, 150], [2500, 186], [-900, 186]], 0.6, 16) + beams, C.wood2);
  w.p(c.cut([[winX - 10, 322], [winX + 120, 322], [winX + 120, 332], [winX - 10, 332]], 0.3, 6) + c.cut([[winX - 12, 428], [winX + 122, 428], [winX + 122, 440], [winX - 12, 440]], 0.3, 6), C.wood);
  w.p(c.cut([[doorX - 12, doorTop - 14], [doorX + doorW + 12, doorTop - 14], [doorX + doorW + 12, doorTop], [doorX - 12, doorTop]], 0.3, 6) + c.cut(c.rect(doorX - 12, doorTop, 12, floor - doorTop + 6), 0.3, 6) + c.cut(c.rect(doorX + doorW, doorTop, 12, floor - doorTop + 6), 0.3, 6), C.wood);
  w.p(c.cut([[240, 380], [400, 380], [400, 392], [240, 392]], 0.3, 6), C.wood);
  w.p(c.cut(c.blob(280, 366, 18, 14, 8, 0.1), 0.3, 4) + c.cut(c.blob(350, 362, 14, 18, 8, 0.1), 0.3, 4), C.pot);
  wallL.add(w.out());
  // shutters: dark blue-grey through the window (it is closed and fastened)
  wallL.add(sheet().p(c.cut(winPts, 0.3, 6), mix(C.dustyBlue, C.storm2, 0.35)).x(c.ribbon([[winX + 55, 330], [winX + 55, 430]], 3) + c.ribbon([[winX, 380], [winX + 110, 380]], 3), C.wood2).out());
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-900, floor], [2500, floor], [2500, 1700], [-900, 1700]], 1, 30), mix(C.wood3, C.sand2, 0.35));
  let planks = '';
  for (let r = 0; r < 7; r++) planks += c.ribbon([[-900, floor + 16 + r * r * 7 + r * 12], [2500, floor + 16 + r * r * 7 + r * 12 + c.rr(-2, 2)]], 1.4);
  f.x(planks, shade(C.wood3, -0.2), 'opacity=".5"');
  floorL.add(f.out());
  const door = floorL.add(`<g>${sheet().p(c.cut(c.rect(-doorW, 0, doorW, floor - doorTop + 4), 0.4, 8), C.wood).x(c.ribbon([[-doorW + 12, 40], [-12, 40]], 4) + c.ribbon([[-doorW + 12, 150], [-12, 150]], 4), C.wood2).p(c.cut(c.circ(-doorW + 18, 100, 5, 8), 0.2, 3), C.soilDark).out()}</g>`);
  const lampEls = lamps.map(([x, y]) => {
    const el = wallL.add(`<g transform="translate(${x} ${y})"><path d="M0 ${-600}V-4" stroke="rgba(74,54,34,.6)" stroke-width="1.4" fill="none"/><g transform="translate(-6 30) scale(.9)">${lampM(c)}</g></g>`);
    return { el, flame: el.querySelector('.flame'), glow: el.querySelector('.glow') };
  });
  return { door, doorLight, lamps: lampEls, wallL, floorL, outL };
}
function lampM(c) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-30, -8], [-18, -16], [10, -16], [24, -12], [34, -16], [38, -12], [26, -2], [14, 2], [-18, 2]], 0.4, 5), C.pot);
  s.p(c.cut(c.circ(-4, -14, 7, 10), 0.2, 3), shade(C.pot, -0.3));
  return `<circle class="glow" cx="34" cy="-30" r="170" fill="url(#warm-glow)"/>${s.out()}<g class="flame" transform="translate(35 -16)"><path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/></g>`;
}
/** Jesus, small, risen, in a speech bubble: a sunburst with a haloed head */
export function risenIcon(c) {
  let d = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; d += c.poly([[Math.cos(a - 0.12) * 16, Math.sin(a - 0.12) * 16], [Math.cos(a) * 30, Math.sin(a) * 30], [Math.cos(a + 0.12) * 16, Math.sin(a + 0.12) * 16]]); }
  const s = sheet().p(c.cut(c.circ(0, 0, 19, 18), 0.3, 3), C.halo);
  return `<path d="${d}" fill="${C.sun}" opacity=".8"/>${s.out()}<g transform="translate(0 2)">${miniHead(c, CAST.jesus, 12)}</g>`;
}
export { sorrowCloud } from '../mark5/lib.js';

/* ---------- the whole world, the whole creation ---------- */
export { lamb } from '../mark11/lib.js';
export { camel } from '../mark1/lib.js';
/**
 * A big paper globe with all creation standing round its rim and paths of light from Jerusalem.
 * One piece; its parts carry classes: .ray (stroked, pathLength 1), .who (rim figures, data-a = angle).
 * Origin at the globe's centre.
 */
export function worldGlobe(c, r, rim) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 60), 0.5, 6), C.lake2);
  const land = [[-0.35, -0.3, 0.36, 0.28], [0.36, 0.08, 0.3, 0.44], [-0.4, 0.48, 0.24, 0.16], [0.05, -0.62, 0.22, 0.12], [-0.7, 0.05, 0.14, 0.26]];
  s.p(land.map(([x, y, a, b]) => c.cut(c.blob(x * r, y * r, a * r, b * r, 12, 0.3), 1, 5)).join(''), C.sage);
  s.x(land.slice(0, 3).map(([x, y, a, b]) => c.cut(c.blob(x * r + a * r * 0.2, y * r, a * r * 0.4, b * r * 0.4, 9, 0.3), 0.5, 4)).join(''), C.ochre, 'opacity=".6"');
  s.x(c.ribbon(c.arc(0, 0, r, r * 0.3, 0, PI, 20), 1.6) + c.ribbon(c.arc(0, 0, r * 0.35, r, -PI / 2, PI / 2, 20), 1.6) + c.ribbon(c.arc(0, 0, r * 0.8, r, -PI / 2, PI / 2, 20), 1.4), C.cream, 'opacity=".4"');
  s.x(c.poly(c.ell(-r * 0.42, -r * 0.5, r * 0.2, r * 0.08, 12, -0.6)), '#fff', 'opacity=".35"');
  const J = [-0.12 * r, -0.2 * r];   // Jerusalem
  let rays = '', who = '';
  rim.forEach((m, i) => {
    const a = m.a, ex = Math.cos(a) * r, ey = Math.sin(a) * r;
    const mx = (J[0] + ex) / 2 + Math.cos(a) * r * 0.25, my = (J[1] + ey) / 2 + Math.sin(a) * r * 0.25;
    rays += `<path class="ray" data-i="${i}" d="M${J[0].toFixed(1)} ${J[1].toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="${C.halo}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    const deg = (a * 180) / PI + 90;
    who += `<g transform="rotate(${deg.toFixed(1)}) translate(0 ${-r + 2})"><g class="who" data-i="${i}" transform="scale(0)">${m.m}</g></g>`;
  });
  const jer = sheet().p(c.cut(c.star(J[0], J[1], 11, 4, 4, 0), 0.2, 3), C.star).out();
  return `<circle r="${r * 1.5}" fill="url(#halo-glow)"/>${s.out()}${rays}<circle cx="${J[0]}" cy="${J[1]}" r="30" fill="url(#warm-glow)"/>${jer}${who}`;
}
/** an arched, framed plate for a hanging picture: returns { frame(inner), clip id } — origin at the top centre */
export function archPlate(S, inner, { w = 210, h = 240, fill = C.skyBlue, k } = {}) {
  const c = S.c;
  const id = S.id('arch' + (k || Math.round(c.rr(0, 1e6))));
  const pts = [[-w / 2, h], [-w / 2, w / 2], ...c.arc(0, w / 2, w / 2, w / 2, PI, 2 * PI, 20), [w / 2, h]];
  S.defs(`<clipPath id="${id}"><path d="${c.poly(pts)}"/></clipPath>`);
  const outer = [[-w / 2 - 10, h + 10], [-w / 2 - 10, w / 2], ...c.arc(0, w / 2, w / 2 + 10, w / 2 + 10, PI, 2 * PI, 22), [w / 2 + 10, h + 10]];
  const fr = sheet().p(c.cut(outer, 0.5, 6), C.wood3).out();
  const bg = `<path d="${c.poly(pts)}" fill="${fill}"/>`;
  return `<path d="M0 ${-1600}V-2" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${fr}<g clip-path="url(#${id})">${bg}${inner}</g>`;
}
