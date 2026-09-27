// John 2 — the cast and cut-outs of this chapter: the wedding at Cana (courtyard, canopy, lanterns,
// six stone water jars with a cut-away window, wine), the hour-glass, the numbered "sign" medallion,
// the road map of Galilee and Judea, the Temple market (oxen, a whip of cords), the Temple built of
// blocks that falls and rises, the balance of years and days, and little heart-windows.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, hillsWith, town, house, cypress, olive, sun, cloud, grass } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { addToHead, wreath, garland, lantern } from '../mark2/lib.js';
import { LOOK as L6 } from '../mark6/lib.js';

export { kf, moving, hand, headAt, addToHead, addToBody, thought, speech, spark, heart, coin, coinStack, dust, townsfolk, canopy, garland, lantern, wreath, tambourine, bowl, loaf, cup, grapes, jug, lowTable, WINE, scrollOpen, wordSlip } from '../mark2/lib.js';
export { voiceRings, hang2, tagOnString, sparkle, hourglassParts, scrollParts } from '../mark1/lib.js';
export { nameTag, bubble, strip, withFace, faceBits, shadowPerson, silhouette } from '../mark3/lib.js';
export { templeCourt, courtFront, changerTable, balance, cage, smallDove, flapDove, bench, lamb, basketProp, jarProp, priest, elder, jerusalem, sanctuary, hungWord } from '../mark11/lib.js';
export { medallion, miniHead, tombIcon, talkDots, risenIcon, skyKeys } from '../mark16/lib.js';
export { sheep } from '../mark6/lib.js';
export { wordTag, discPlate, chalice } from '../mark14/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== the cast */

export const LOOK = {
  // the mother of Jesus — the same blue veil she wears in Mark (mark3/mark6 LOOK.mary)
  mary: L6.mary,
  bJames: L6.bJames, bJoses: L6.bJoses, bJudas: L6.bJudas, bSimon: L6.bSimon,
  philip: { robe: C.roseRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin, belt: C.leather },
  nathanael: { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3 }, // = Bartholomew
  steward: { robe: C.linen2, mantle: C.teal2, belt: C.sun, hair: C.greyHair, hairStyle: 'wrap', veil: C.cream, veil2: C.terracotta, beard: 'full', beardColor: C.greyHair, skin: C.skin2 },
  groom: { robe: C.linen, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.terracotta },
  bride: { robe: C.linen, mantle: C.roseRobe, hairStyle: 'veil', veil: C.cream, veil2: C.blushVeil, hair: C.hair2, skin: C.skin, belt: C.sun },
};
/** the first disciples (John 1): Peter, Andrew, John, Philip, Nathanael */
export const DISC = [CAST.peter, CAST.andrew, CAST.john, LOOK.philip, LOOK.nathanael];
export const SERVANTS = [
  { robe: C.stone, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.clay },
  { robe: C.linen2, hair: C.hair3, hairStyle: 'wrap', veil: C.skyVeil, veil2: C.dustyBlue, beard: 'short', skin: C.skin4, belt: C.clay },
  { robe: mix(C.sageRobe, C.stone, 0.4), hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.clay },
];
/** wedding puppets with flower wreaths */
export const groomPuppet = (c, extra = {}) => addToHead(person(c, { ...LOOK.groom, ...extra }), wreath(c));
export const bridePuppet = (c, extra = {}) => addToHead(person(c, { ...LOOK.bride, ...extra }), wreath(c));
/** a guest who is never veiled if man */
export function guest(c, man = false, extra = {}) {
  const o = crowdPerson(c);
  if (man && o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; }
  if (!man) { o.hairStyle = 'veil'; o.beard = 'none'; }
  return { ...o, ...extra };
}

/* ================================================================== colours */

export const WATER = '#a9d3dc';
export const WATER2 = '#8cc0cd';
export const WINE_A = '#9c3d5c';      // deep red-violet
export const WINE_B = '#7a2d4f';
export const DAY = ['#cfe2dc', '#f0e6cc', '#f8ebd2'];
export const AFTERNOON = ['#c6dedb', '#efe3c6', '#f6dcb6'];
export const EVENING = ['#6f6a9c', '#d9a08f', '#f2c49a'];
export const NIGHT = ['#1e2552', '#343d74', '#5f5d8c'];

/* ================================================================== Cana: the courtyard */

/**
 * The wedding house at Cana: sky, hills with the village, the courtyard wall with a doorway and a
 * vine pergola, the paved yard, garlands and lanterns on the flies.
 * Returns { sk, hangL, sunEl, cl, lamps:[{el, glow, x, y, i}], garl:[{el,x,y}], floorY, flyL }.
 */
export function canaSet(S, { skyCols = AFTERNOON, floorY = 680, doorX = 1130, lanterns = [360, 520, 680, 920, 1080, 1240], sunAt = [1230, 150], vine = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 700 });
  const cl = hanging(hangL, cloud(c, 200), { x: 460, y: 150, len: 700 });

  // Galilean hills and the village of Cana
  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = hillsWith(c, { y: 432, amps: [22, 8, 3], lens: [1100, 380, 130], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3000 });
  far.add(h1.markup);
  far.add(town(c, { x: 240, y: h1.fn(240) + 12, n: 8, spread: 420, sc: 0.62 }) + town(c, { x: 1390, y: h1.fn(1390) + 12, n: 7, spread: 380, sc: 0.6 }));
  far.add(cypress(c, 560, h1.fn(560) + 6, 100) + cypress(c, 1040, h1.fn(1040) + 6, 110));

  // the courtyard wall
  const wallL = S.layer({ par: 0.26, sh: 4 });
  const WY = floorY - 110, top = WY - 104;
  const w = sheet();
  w.p(c.cut([[-1600, WY + 20], [-1600, top + 8], [3200, top], [3200, WY + 20]], 1, 16), mix(C.plaster, C.peach, 0.22));
  let stones = '';
  for (let y = top + 22; y < WY; y += 24) for (let x = -1600 + c.rr(0, 40); x < 3200; x += c.rr(60, 110)) stones += c.ribbon([[x, y], [x + c.rr(30, 60), y + c.rr(-1, 1)]], 1.2);
  w.x(stones, shade(C.plaster, -0.14), 'opacity=".45"');
  w.p(c.cut(c.rect(-1600, top - 10, 4800, 14), 0.6, 18), C.roof);
  // the doorway into the house
  w.p(c.cut([[doorX - 46, WY + 20], [doorX - 46, WY - 60], ...c.arc(doorX, WY - 60, 46, 30, PI, 2 * PI, 10), [doorX + 46, WY + 20]], 0.4, 6), mix(C.soilDark, C.wood2, 0.4));
  w.p(c.ribbon([[doorX - 52, WY + 20], [doorX - 52, WY - 60], ...c.arc(doorX, WY - 60, 52, 36, PI, 2 * PI, 10), [doorX + 52, WY - 60], [doorX + 52, WY + 20]], 8), C.stone2);
  // small windows with shutters
  [[380, WY - 56], [640, WY - 58], [1380, WY - 56]].forEach(([x, y]) => {
    w.p(c.cut(c.rect(x - 16, y - 20, 32, 30), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
    w.p(c.cut(c.rect(x - 30, y - 22, 12, 34), 0.3, 5) + c.cut(c.rect(x + 18, y - 22, 12, 34), 0.3, 5), C.teal2);
  });
  wallL.add(w.out());
  if (vine) {
    // a pergola with a vine along the top of the wall
    const v = sheet();
    let beams = '';
    for (let x = -1600; x < 3200; x += 170) beams += c.cut(c.rect(x, top - 34, 12, 30), 0.3, 5);
    v.p(beams + c.cut(c.rect(-1600, top - 42, 4800, 10), 0.4, 16), C.wood2);
    let lv = '', lv2 = '', gr = '';
    for (let x = -1600; x < 3200; x += 26) {
      const y = top - 38 + Math.sin(x * 0.02) * 10;
      const leaf = c.cut(c.blob(x + c.rr(-8, 8), y + c.rr(-8, 10), c.rr(12, 20), c.rr(8, 13), 9, 0.25), 0.6, 4);
      if (c.chance(0.5)) lv += leaf; else lv2 += leaf;
      if (c.chance(0.16)) { const gx = x + c.rr(-6, 6), gy = y + 14; for (let r = 0; r < 3; r++) for (let k = 0; k < 3 - r; k++) gr += c.cut(c.circ(gx + (k - (2 - r) / 2) * 7, gy + r * 6, 3.8, 7), 0.1, 3); }
    }
    v.p(lv2, C.moss).p(lv, C.leaf).p(gr, shade(C.plumRobe, -0.12));
    wallL.add(v.out());
  }

  // the paved yard
  const floorL = S.layer({ par: 0.34, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-1800, WY + 12], [3400, WY + 12], [3400, 1800], [-1800, 1800]], 0.8, 30), mix(C.sand, C.stone, 0.45));
  let tiles = '';
  for (let i = 0; i < 8; i++) { const y = WY + 24 + i * i * 7 + i * 12; tiles += c.ribbon([[-1800, y], [3400, y + c.rr(-2, 2)]], 1.2); }
  for (let x = -1800; x < 3400; x += 110) tiles += c.ribbon([[x, WY + 14], [800 + (x - 800) * 2.4, 1800]], 1.1);
  f.x(tiles, shade(C.sand2, -0.2), 'opacity=".35"');
  floorL.add(f.out());
  floorL.add(grass(c, { x0: -1600, x1: 3000, y: WY + 14, n: 40, h: 14, color: C.olive }));

  // garlands & lanterns hang in front of the wall
  const flyL = S.layer({ par: 0.42, sh: 4 });
  const garl = [[180, 340], [540, 260], [820, 260], [1100, 340]].map(([x, gw], i) => ({ x, i, el: flyL.add(`<g><path d="M0 -1600V0M${gw} -1600V0" stroke="rgba(74,54,34,.45)" stroke-width="1.1" fill="none"/>${garland(c, gw, 36)}</g>`) }));
  const lamps = lanterns.map((x, i) => {
    const el = hanging(flyL, lantern(c, { col: [C.apricot, C.roseRobe, C.wheat][i % 3] }), { x, y: 240, len: 800 });
    return { x, i, el, glow: el.querySelector('.glow'), y: 262 + (i % 2) * 26 };
  });
  return { sk, hangL, sunEl, cl, lamps, garl, floorY, WY, flyL, wallL, floorL };
}
/** idle for the Cana set: sun/cloud/garlands/lanterns (lit: 0..1) */
export function canaIdle(set, T, { lit = 0.5, sunY, drop = 0 } = {}) {
  const sw = (el, x, y, a, sp, sd) => pose(el, { x, y, r: Math.sin(T * sp + sd) * a });
  sw(set.sunEl, 1230, sunY ?? 150, 1, 0.6, 0);
  sw(set.cl, 460 + Math.sin(T * 0.1) * 26, 150, 1.3, 0.6, 1);
  set.garl.forEach((g) => pose(g.el, { x: g.x, y: 226 - drop, r: Math.sin(T * 0.6 + g.i) * 0.6 }));
  set.lamps.forEach((l) => {
    pose(l.el, { x: l.x, y: l.y - drop, r: Math.sin(T * 1.1 + l.i) * 2.5 });
    pose(l.glow, { o: lit * (0.8 + Math.sin(T * 3 + l.i) * 0.08) });
  });
}

/* ================================================================== jars, wine */

export const JAR = { h: 128, win: { x: 15, y0: -24, y1: -96 } };
/**
 * A tall stone water jar for purification (origin: bottom centre), with a cut-away window in front
 * so the level inside can be seen. Parts: back (dark inside), front (body with the window hole).
 * The liquid goes between: liquid() drawn from y0 up to y1, scale sy from the bottom.
 */
export function stoneJar(c, { col = mix(C.stone, C.rock, 0.35), n = 0 } = {}) {
  const H = JAR.h, { x: wx, y0, y1 } = JAR.win;
  const body = [[-22, 0], [-26, -8], [-40, -34], [-44, -66], [-40, -96], [-28, -112], [-20, -116], [-22, -124], [-26, -128], [26, -128], [22, -124], [20, -116], [28, -112], [40, -96], [44, -66], [40, -34], [26, -8], [22, 0]];
  const winPts = [[-wx, y0], [-wx, y1 + 6], ...c.arc(0, y1 + 6, wx, 6, PI, 2 * PI, 6), [wx, y0]];
  const back = sheet().p(c.cut([[-wx - 4, y0 + 4], [-wx - 4, y1 - 4], [wx + 4, y1 - 4], [wx + 4, y0 + 4]], 0.2, 5), mix(C.soilDark, col, 0.35)).out();
  const front = sheet();
  front.p(c.cut(body, 0.5, 6) + c.hole(winPts, 0.2, 5), col);
  // handles, bands, the rim, chisel marks
  front.p(c.ribbon(c.arc(-40, -92, 10, 12, PI * 0.5, PI * 1.5, 6), 5) + c.ribbon(c.arc(40, -92, 10, 12, -PI * 0.5, PI * 0.5, 6), 5), shade(col, -0.1));
  front.x(c.ribbon([[-40, -34], [-wx - 3, -34]], 2.4) + c.ribbon([[wx + 3, -34], [40, -34]], 2.4) + c.ribbon([[-42, -86], [-wx - 3, -86]], 2.4) + c.ribbon([[wx + 3, -86], [42, -86]], 2.4), shade(col, -0.16), 'opacity=".7"');
  front.p(c.cut(c.ell(0, -126, 27, 5, 16), 0.2, 4), shade(col, 0.2));
  front.x(c.cut(c.ell(0, -126, 20, 3, 14), 0.2, 3), mix(C.soilDark, col, 0.3));
  let chip = '';
  for (let i = 0; i < 6; i++) { const x = c.rr(-36, 36), y = c.rr(-110, -12); if (Math.abs(x) > wx + 4) chip += c.ribbon([[x, y], [x + c.rr(-4, 4), y + c.rr(3, 7)]], 1); }
  front.x(chip, shade(col, -0.25), 'opacity=".5"');
  // three measure ticks beside the window
  let ticks = '';
  [0.34, 0.67, 1].forEach((f) => { const y = y0 + (y1 - y0) * f; ticks += c.ribbon([[wx + 2, y], [wx + 9, y]], 1.6); });
  front.x(ticks, C.inkSoft, 'opacity=".55"');
  // a little rim for the window
  front.x(c.ribbon([...winPts, winPts[0]], 1.6), shade(col, -0.3), 'opacity=".6"');
  return { back, front: front.out(), H };
}
/** the liquid inside a jar window: origin at the window bottom centre (0, 0), full height = win height. */
export function liquid(c, col, { crest = true } = {}) {
  const { x: wx, y0, y1 } = JAR.win;
  const h = y0 - y1 + 4;
  const pts = [[-wx - 2, 2]];
  for (let i = 0; i <= 8; i++) pts.push([-wx - 2 + (i / 8) * (wx * 2 + 4), -h + Math.sin(i * 1.3) * 1.6]);
  pts.push([wx + 2, 2]);
  const s = sheet().p(c.poly(pts), col);
  if (crest) s.x(c.ribbon(Array.from({ length: 9 }, (_, i) => [-wx - 2 + (i / 8) * (wx * 2 + 4), -h + 1 + Math.sin(i * 1.3) * 1.6]), 2.2), '#ffffff', 'opacity=".55"');
  s.x(c.ribbon([[-wx + 4, -4], [-wx + 4, -h + 8]], 2.4), '#ffffff', 'opacity=".25"');
  return s.out(false);
}
/** a wine amphora on a little stand (origin: floor centre); tipped by rotating the .amph part */
export function amphora(c, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-12, 0], [-8, -10], [-18, -40], [-24, -80], [-18, -104], [-8, -112], [-8, -126], [8, -126], [8, -112], [18, -104], [24, -80], [18, -40], [8, -10], [12, 0]], 0.5, 5), col);
  s.p(c.ribbon(c.qbez([-8, -118], [-30, -114], [-20, -96], 6), 4) + c.ribbon(c.qbez([8, -118], [30, -114], [20, -96], 6), 4), shade(col, -0.12));
  s.x(c.ribbon([[-22, -70], [22, -70]], 3) + c.ribbon([[-20, -58], [20, -58]], 1.6), C.cream, 'opacity=".45"');
  s.x(c.cut(c.ell(0, -126, 8, 2.4, 10), 0.2, 3), mix(C.soilDark, col, 0.4));
  return s.out();
}
export function amphoraStand(c) {
  return sheet().p(c.ribbon([[-26, 0], [0, -46]], 5) + c.ribbon([[26, 0], [0, -46]], 5) + c.ribbon([[-20, -10], [20, -10]], 4), C.wood2).p(c.cut(c.ell(0, -46, 20, 5, 12), 0.3, 4), C.wood).out();
}
/** a wine cup held in a hand (hold coords) or on a table; origin at its foot. .wine is fadable */
export function goblet(c, { col = C.sun, fill = WINE_A, r = 1 } = {}) {
  const s = sheet();
  s.p(c.cut([[-9 * r, -20 * r], [9 * r, -20 * r], [7 * r, -10 * r], [2 * r, -6 * r], [2 * r, -2 * r], [7 * r, 0], [-7 * r, 0], [-2 * r, -2 * r], [-2 * r, -6 * r], [-7 * r, -10 * r]], 0.2, 3), col);
  return s.out() + `<path class="wine" d="${c.poly(c.ell(0, -19 * r, 7.6 * r, 2.2 * r, 10))}" fill="${fill}"/>`;
}
/** a ladle / dipper (hold coords: handle along +y from the hand, bowl at the end) */
export function dipper(c, len = 64) {
  const s = sheet();
  s.p(c.ribbon([[0, -10], [0, len]], 4), C.wood2);
  s.p(c.cut([[-12, len - 2], [12, len - 2], [8, len + 12], [-8, len + 12]], 0.3, 4), C.wood);
  return s.out();
}
/** a stream of liquid pouring down from its origin, len tall (scale sy) */
export function pourStream(c, col, len = 100) {
  return `<path d="${c.ribbon([[0, 0], [2, len * 0.5], [0, len]], (u) => 5 - u * 1.8)}" fill="${col}"/><path d="${c.ribbon([[-1, 4], [0.5, len * 0.6]], 1.2)}" fill="#fff" opacity=".5"/>`;
}
/** a splash of drops (origin: centre) */
export function drops(c, col, r = 16, n = 6) {
  let d = '';
  for (let i = 0; i < n; i++) { const a = PI * (1.1 + (i / (n - 1)) * 0.8); d += c.cut(c.ell(Math.cos(a) * r, Math.sin(a) * r, 2.6, 4.2, 8, a + PI / 2), 0.1, 2); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** a hand-washing icon for the purification rites (origin centre) */
export function washIcon(c) {
  const s = sheet();
  // a small pitcher pouring onto two open hands
  s.p(c.cut([[-26, -34], [-10, -34], [-8, -26], [-2, -30], [2, -28], [-6, -18], [-10, -10], [-24, -10], [-28, -20]], 0.3, 3), C.pot);
  s.p(c.cut([[-22, 18], [-18, 4], [-10, 0], [-2, 4], [0, 14], [-8, 20]], 0.3, 3) + c.cut([[22, 18], [18, 4], [10, 0], [2, 4], [0, 14], [8, 20]], 0.3, 3), C.skin2);
  s.x(c.cut([[0, -24], [2, -16], [0, -12], [-2, -16]], 0.1, 2) + c.cut([[-3, -8], [-1, -2], [-3, 0], [-5, -2]], 0.1, 2) + c.cut([[3, -6], [5, 0], [3, 2], [1, 0]], 0.1, 2), WATER2);
  return s.out();
}
/** a measure (a small bucket-like vessel) with a Roman numeral (origin centre) */
export function measureIcon(c, text = 'I') {
  const s = sheet();
  s.p(c.cut([[-16, -14], [16, -14], [12, 14], [-12, 14]], 0.3, 4), C.wood3);
  s.x(c.ribbon([[-15, -6], [15, -6]], 2) + c.ribbon([[-13, 6], [13, 6]], 2), C.wood2, 'opacity=".7"');
  s.p(c.cut(c.ell(0, -14, 16, 3.4, 12), 0.2, 3), WATER);
  return s.out() + `<text x="0" y="36" text-anchor="middle" font-family="${FONT}" font-size="18" font-style="italic" fill="${C.inkSoft}">${text}</text>`;
}

/* ================================================================== signs & symbols */

/** the numbered "sign" medallion (origin centre): gold rim, jar of wine, the number, the word "znak" */
export function signBadge(c, n = 1, { r = 58, icon = 'jar' } = {}) {
  const s = sheet();
  let rays = '';
  for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; rays += c.poly([[Math.cos(a - 0.08) * (r + 4), Math.sin(a - 0.08) * (r + 4)], [Math.cos(a) * (r + 22), Math.sin(a) * (r + 22)], [Math.cos(a + 0.08) * (r + 4), Math.sin(a + 0.08) * (r + 4)]]); }
  s.x(rays, C.sun, 'opacity=".85"');
  s.p(c.cut(c.circ(0, 0, r + 6, 40), 0.4, 5), C.haloRim);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.4, 5), C.cream);
  s.x(c.ribbon(c.arc(0, 0, r - 7, r - 7, 0, PI * 2, 40), 1.4), C.ochre, 'opacity=".6"');
  let ic = '';
  if (icon === 'jar') {
    const j = sheet();
    j.p(c.cut([[-9, 18], [-14, 4], [-15, -8], [-10, -16], [-6, -18], [-7, -22], [7, -22], [6, -18], [10, -16], [15, -8], [14, 4], [9, 18]], 0.3, 3), mix(C.stone, C.rock, 0.35));
    j.x(c.cut([[-6, 10], [-6, -8], [6, -8], [6, 10]], 0.2, 3), WINE_A);
    ic = `<g transform="translate(-20 -6)">${j.out()}</g>`;
  }
  const txt = `<text x="${icon ? 14 : 0}" y="10" text-anchor="middle" font-family="${FONT}" font-size="${r * 0.72}" font-style="italic" fill="${C.terracotta}">${n}</text>` +
    `<text x="0" y="${r * 0.62}" text-anchor="middle" font-family="${FONT}" font-size="${r * 0.26}" font-style="italic" letter-spacing="2" fill="${C.inkSoft}">${tr('ZNAK', 'SIGN')}</text>`;
  return `<circle r="${r * 2.2}" fill="url(#halo-glow)" opacity=".8"/>${s.out()}${ic}${txt}`;
}
/** a small day disc (sun) with a Roman numeral (origin centre); .lit fades in */
export function dayDisc(c, label, r = 24) {
  const off = sheet().p(c.cut(c.circ(0, 0, r + 4, 20), 0.3, 3), C.stone2).p(c.cut(c.circ(0, 0, r, 20), 0.3, 3), C.parchment).out();
  const on = sheet().p(c.cut(c.star(0, 0, r * 1.45, r * 1.1, 14, 0), 0.3, 3), C.sunDeep).p(c.cut(c.circ(0, 0, r, 20), 0.3, 3), C.sun).out();
  const txt = (col) => `<text x="0" y="${r * 0.36}" text-anchor="middle" font-family="${FONT}" font-size="${r * 0.95}" font-style="italic" fill="${col}">${label}</text>`;
  return `<g class="off">${off}${txt(C.inkSoft)}</g><g class="lit" opacity="0"><circle r="${r * 2.4}" fill="url(#warm-glow)"/>${on}${txt(C.cream)}</g>`;
}
/** a braided whip of cords (hold coords: handle along +y, cords fall away beyond) */
export function whip(c, len = 90) {
  const s = sheet();
  s.p(c.cut([[-4, -8], [4, -8], [4, 26], [-4, 26]], 0.2, 3), C.wood2);
  let br = '';
  for (let y = -6; y < 24; y += 5) br += c.ribbon([[-4, y], [4, y + 3]], 1.2);
  s.x(br, C.rope, 'opacity=".8"');
  let cords = '';
  [-5, 0, 5].forEach((dx, i) => { cords += c.ribbon(c.qbez([dx * 0.4, 26], [dx * 2 + 6, 26 + len * 0.5], [dx * 3 + (i - 1) * 4, 26 + len], 10), (u) => 3.2 - u * 1.6); });
  s.p(cords, C.rope);
  let knots = '';
  [-5, 0, 5].forEach((dx, i) => { knots += c.cut(c.circ(dx * 3 + (i - 1) * 4, 26 + len, 3, 6), 0.2, 2); });
  s.p(knots, shade(C.rope, -0.2));
  return s.out();
}
/** three loose cords (origin at the top knot); each .strand rotates about the knot to close into a braid */
export function cords(c, len = 110) {
  return [0, 1, 2].map((i) => `<g class="strand"><path d="${c.ribbon([[0, 0], [c.rr(-2, 2), len * 0.5], [0, len]], (u) => 6 - u * 2.4)}" fill="${shade(C.rope, i * -0.1)}"/><path d="${c.cut(c.circ(0, len, 4.4, 8), 0.2, 2)}" fill="${shade(C.rope, -0.25)}"/></g>`).join('') + `<path d="${c.cut(c.circ(0, 0, 7, 10), 0.2, 2)}" fill="${C.wood2}"/>`;
}
/** an ox, facing right (origin: hooves). parts .oxhead (pivot at neck), .leg x4 */
export function ox(c, { col = mix(C.wood3, C.clay, 0.35), k } = {}) {
  const dk = shade(col, -0.22), lt = mix(col, C.cream, 0.5);
  const leg = (x, far) => `<g class="leg" transform="translate(${x} -44)">${sheet().p(c.cut([[-7, -4], [7, -4], [6, 30], [5, 40], [-5, 40], [-6, 30]], 0.3, 4), far ? dk : col).p(c.cut(c.rect(-6, 38, 12, 6), 0.2, 3), C.soilDark).out()}</g>`;
  const b = sheet();
  b.p(c.cut([[-62, -48], [-58, -80], [-30, -92], [20, -94], [48, -96], [64, -84], [66, -56], [56, -42], [20, -40], [-30, -40], [-56, -40]], 0.8, 6), col);
  b.p(c.cut([[-40, -56], [-10, -48], [30, -50], [50, -56], [44, -44], [-30, -42]], 0.4, 5), lt, 'opacity=".6"');
  b.p(c.ribbon(c.qbez([-60, -76], [-78, -60], [-72, -30], 8), 3) + c.cut(c.blob(-72, -28, 4, 7, 8, 0.2), 0.3, 3), dk);
  const h = sheet();
  h.p(c.cut([[-6, -20], [14, -24], [30, -14], [34, 6], [30, 16], [18, 18], [8, 8], [-4, 10], [-8, -6]], 0.5, 5), col);
  h.p(c.cut(c.ell(28, 12, 8, 6, 10), 0.3, 3), lt);
  h.p(c.ribbon(c.qbez([4, -20], [0, -36], [14, -40], 8), (u) => 5 - u * 3.4) + c.ribbon(c.qbez([12, -20], [16, -34], [28, -34], 8), (u) => 5 - u * 3.4), C.parchment);
  h.p(c.cut([[0, -16], [-12, -22], [-8, -12]], 0.2, 3), dk);
  h.x(c.poly(c.circ(18, -6, 2, 6)), C.ink);
  return `<g${k_(k)}>${leg(-40, true)}${leg(40, true)}<g>${b.out()}</g>${leg(-50, false)}${leg(30, false)}<g class="oxhead" transform="translate(58 -80)">${h.out()}</g></g>`;
}
/** walk an ox: legs swing (phase), head nods */
export function walkOx(el, ph, amt = 1) {
  const legs = el.querySelectorAll('.leg');
  const xs = [-40, 40, -50, 30];
  legs.forEach((l, i) => pose(l, { x: xs[i], y: -44, r: Math.sin(ph + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * 18 * amt }));
  pose(el.querySelector('.oxhead'), { x: 58, y: -80, r: Math.sin(ph * 2) * 4 * amt });
}
/** a small coin purse / money bag (origin: its base) */
export function moneyBag(c) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-22, -16], [-14, -30], [-6, -34], [-10, -40], [10, -40], [6, -34], [14, -30], [22, -16], [18, 0]], 0.4, 4), C.leather);
  s.p(c.ribbon([[-8, -34], [8, -34]], 3), C.rope);
  return s.out();
}

/* ================================================================== the temple in blocks */

/**
 * The sanctuary as separate paper blocks that can fall apart and rise again.
 * Returns [{ markup, x, y, w, h }] with (x, y) the block centre relative to the base centre.
 */
export function templeBlocks(c, sc = 1, { white = mix(C.cream, C.linen, 0.5), white2 = mix(C.stone, C.cream, 0.4) } = {}) {
  const out = [];
  const blk = (x, y, w, h, col, extra = '') => {
    const s = sheet().p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 6), col);
    out.push({ markup: s.out() + extra, x, y, w, h });
  };
  const P = (v) => v * sc;
  // steps
  blk(0, P(-6), P(200), P(12), white2);
  // shoulders
  [-1, 1].forEach((d) => { blk(d * P(78), P(-40), P(44), P(56), white2); blk(d * P(78), P(-92), P(44), P(48), white2); });
  // the porch, three courses
  blk(0, P(-40), P(100), P(56), white, sheet().p(c.cut(c.rect(P(-16), P(-28), P(32), P(56)), 0.3, 4), C.plumRobe).out());
  blk(0, P(-96), P(100), P(56), white, sheet().p(c.cut(c.rect(P(-16), P(-28), P(32), P(34)), 0.3, 4), C.plumRobe).p(c.ribbon([[P(-20), P(-2)], [P(20), P(-2)]], P(5)), C.sun).out());
  blk(0, P(-152), P(100), P(56), white, sheet().p(c.cut(c.circ(0, 0, P(10), 14), 0.3, 3), C.sun).out());
  // gold cornice with spikes
  let sp = '';
  for (let x = -46; x <= 46; x += 11) sp += c.poly([[P(x - 2.4), P(-4)], [P(x), P(-16)], [P(x + 2.4), P(-4)]]);
  const corn = sheet().p(c.cut(c.rect(P(-54), P(-5), P(108), P(10)), 0.3, 5), C.sun).x(sp, C.sun).out();
  out.push({ markup: corn, x: 0, y: P(-185), w: P(108), h: P(10) });
  return out;
}
/** a gold line drawing of the sanctuary (origin: base centre), ~ w 200·sc, h 250·sc */
export function templeOutline(c, sc = 1, col = C.sun, wd = 5) {
  const P = (v) => v * sc;
  const l = (pts) => c.ribbon(pts, wd);
  let d = '';
  d += l([[P(-100), 0], [P(-100), P(-116)], [P(-50), P(-116)]]) + l([[P(100), 0], [P(100), P(-116)], [P(50), P(-116)]]);
  d += l([[P(-50), 0], [P(-50), P(-180)], [P(50), P(-180)], [P(50), 0]]);
  d += l([[P(-110), 0], [P(110), 0]]);
  d += l([[P(-16), 0], [P(-16), P(-68)], [P(16), P(-68)], [P(16), 0]]);
  for (let x = -44; x <= 44; x += 11) d += c.poly([[P(x - 2.6), P(-180)], [P(x), P(-196)], [P(x + 2.6), P(-180)]]);
  d += c.cut(c.circ(0, P(-140), P(11), 14), 0.2, 3);
  return `<path d="${d}" fill="${col}"/>`;
}

/* ================================================================== writing, balance */

/** a hanging scroll with hand-lettered lines (origin at the top rod) */
export function verseScroll(c, lines, { w = 420, size = 24, ink = C.ink, title = '' } = {}) {
  const lh = size * 1.35, h = lines.length * lh + (title ? size * 1.6 : 0) + 40;
  const s = sheet();
  s.p(c.cut([[-w / 2 + 6, 0], [w / 2 - 6, 0], [w / 2 - 8, h], [-w / 2 + 8, h]], 0.5, 8), C.parchment);
  s.x(c.ribbon([[-w / 2 + 18, 10], [-w / 2 + 18, h - 10]], 1.2) + c.ribbon([[w / 2 - 18, 10], [w / 2 - 18, h - 10]], 1.2), C.terracotta, 'opacity=".35"');
  const rod = (y) => sheet().p(c.cut(c.rect(-w / 2 - 4, y - 8, w + 8, 16), 0.3, 6), C.parchment).p(c.cut(c.rect(-w / 2 - 22, y - 5, 18, 10), 0.2, 4) + c.cut(c.rect(w / 2 + 4, y - 5, 18, 10), 0.2, 4), C.wood2).p(c.cut(c.ell(-w / 2 - 26, y, 6, 11, 10), 0.2, 3) + c.cut(c.ell(w / 2 + 26, y, 6, 11, 10), 0.2, 3), C.wood).out();
  let y = 30 + (title ? size * 1.5 : 0);
  const t = title ? `<text x="0" y="${30 + size * 0.7}" text-anchor="middle" font-family="${FONT}" font-size="${size * 0.8}" letter-spacing="1.5" fill="${C.terracotta}">${title}</text>` : '';
  const txt = lines.map((ln) => { const e = `<text x="0" y="${(y + size * 0.4).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${ln}</text>`; y += lh; return e; }).join('');
  return { sheet: s.out() + t + txt, rodTop: rod(0), rodBottom: rod(0), h };
}
/** a big hanging balance (origin: its hook); parts .beam (pivot 0,40) .panL .panR hang from the beam ends */
export function bigBalance(c, arm = 170) {
  const s = sheet();
  s.p(c.cut([[-6, 0], [6, 0], [5, 44], [-5, 44]], 0.3, 4), C.ochre);
  s.p(c.cut(c.circ(0, 44, 9, 12), 0.2, 3), shade(C.ochre, -0.15));
  const beam = sheet().p(c.cut([[-arm - 6, -5], [arm + 6, -5], [arm + 6, 5], [-arm - 6, 5]], 0.3, 8), C.ochre).p(c.cut(c.circ(-arm, 0, 7, 10), 0.2, 3) + c.cut(c.circ(arm, 0, 7, 10), 0.2, 3), shade(C.ochre, -0.15)).out();
  const pan = () => sheet().x(c.ribbon([[0, 0], [-40, 90]], 1.4) + c.ribbon([[0, 0], [40, 90]], 1.4), C.inkSoft, 'opacity=".6"').p(c.cut([[-52, 88], [52, 88], ...c.arc(0, 88, 52, 20, 0, PI, 12)], 0.3, 5), shade(C.ochre, -0.08)).out();
  return { stand: s.out(), beam, pan: pan() };
}
/** a pile of little building stones (for the 46 years); origin: base centre; .st pieces */
export function stonePile(c, n = 12) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 4), k = i % 4;
    const x = (k - 1.5) * 20 + (row % 2) * 10 - 5, y = -8 - row * 14;
    out += `<g class="st" transform="translate(${x} ${y})">${sheet().p(c.cut(c.rect(-9, -6, 18, 12), 0.3, 3), mix(C.stone, C.cream, i % 3 ? 0.2 : 0)).out()}</g>`;
  }
  return out;
}

/* ================================================================== hearts */

/** a little window with two shutters; origin centre. .shutL/.shutR open (sx), .inner shows the heart */
export function heartWindow(c, kind = 'bright', r = 17) {
  const fr = sheet();
  fr.p(c.cut(c.rect(-r - 5, -r - 5, 2 * r + 10, 2 * r + 10), 0.3, 4), C.wood3);
  fr.x(c.cut(c.rect(-r, -r, 2 * r, 2 * r), 0.2, 4), kind === 'cloud' ? mix(C.storm, C.dusk, 0.3) : '#fff2cf');
  const hc = kind === 'bright' ? C.jesusMantle : kind === 'cloud' ? mix(C.jesusMantle, C.storm, 0.45) : mix(C.jesusMantle, C.stone2, 0.5);
  const hp = [];
  for (let i = 0; i < 24; i++) { const a = (i / 24) * PI * 2; hp.push([Math.pow(Math.sin(a), 3) * r * 0.62, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r * 0.042 + 1]); }
  let inner = sheet().p(c.cut(hp, 0.2, 3), hc).out();
  if (kind === 'cloud') inner += `<path d="${c.cut(c.blob(r * 0.25, -r * 0.35, r * 0.5, r * 0.26, 9, 0.2), 0.3, 3)}" fill="${mix(C.storm, C.stone2, 0.3)}"/>`;
  if (kind === 'faint') inner += `<path d="${c.ribbon([[-r * 0.2, -r * 0.4], [r * 0.05, 0], [-r * 0.1, r * 0.3]], 1.4)}" fill="${C.inkSoft}" opacity=".6"/>`;
  const glow = kind === 'bright' ? `<circle r="${r * 2.4}" fill="url(#warm-glow)" opacity=".7"/>` : '';
  const shut = (d) => sheet().p(c.cut(c.rect(d < 0 ? -r : 0, -r, r, 2 * r), 0.3, 4), C.teal2).x(c.ribbon([[d * r * 0.5, -r + 4], [d * r * 0.5, r - 4]], 1.2), shade(C.teal2, -0.3), 'opacity=".6"').out();
  return `<g class="inner">${glow}${fr.out()}${inner}</g><g class="shutL">${shut(-1)}</g><g class="shutR">${shut(1)}</g>`;
}
/** open a heartWindow (0 closed → 1 open) */
export function openWindow(el, k, r = 17) {
  pose(el.querySelector('.shutL'), { x: -r, sx: Math.max(0.06, 1 - k), ox: -r });
  pose(el.querySelector('.shutR'), { x: r, sx: Math.max(0.06, 1 - k), ox: r });
}

/* ================================================================== the map */

export const MAP = { w: 1000, h: 1200, cana: [-190, -330], caph: [90, -390], lake: [150, -300], jer: [-150, 330] };
/** a parchment map of the land (origin centre): Cana, Capernaum and the lake, the Jordan, Jerusalem */
export function landMap(c) {
  const { w, h } = MAP;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2.4, 12), C.parchment);
  s.x(c.ribbon([[-w / 2 + 20, -h / 2 + 20], [w / 2 - 20, -h / 2 + 20], [w / 2 - 20, h / 2 - 20], [-w / 2 + 20, h / 2 - 20], [-w / 2 + 20, -h / 2 + 22]], 2.4), C.clay, 'opacity=".5"');
  // the Great Sea on the west
  s.p(c.cut([[-w / 2 + 22, -h / 2 + 22], [-400, -h / 2 + 22], [-380, -300], [-420, -100], [-400, 120], [-440, 360], [-420, h / 2 - 22], [-w / 2 + 22, h / 2 - 22]], 1.4, 10), mix(C.lake, C.parchment, 0.3));
  let hills = '';
  [[-260, -420], [-80, -470], [-300, -180], [-120, -220], [-20, -120], [-260, 20], [-120, 80], [10, 160], [-280, 220], [-60, 250], [60, 420], [-260, 430], [260, 100], [280, 300], [300, -120]].forEach(([x, y]) => { hills += c.cut([[x - 26, y + 10], [x, y - 20], [x + 26, y + 10]], 0.6, 6); });
  s.x(hills, shade(C.parchment, -0.14));
  // the lake, the Jordan, the Dead Sea
  const [lx, ly] = MAP.lake;
  s.p(c.cut([[lx - 30, ly - 100], [lx + 30, ly - 96], [lx + 56, ly - 40], [lx + 50, ly + 30], [lx + 20, ly + 80], [lx - 16, ly + 70], [lx - 44, ly + 10], [lx - 50, ly - 60]], 1, 6), C.lake);
  s.p(c.ribbon([[lx + 10, ly + 76], [lx + 34, ly + 180], [lx + 16, ly + 300], [lx + 40, ly + 420], [lx + 26, ly + 560]], 5), C.lake2);
  s.p(c.cut(c.blob(lx + 30, ly + 640, 30, 80, 12, 0.15), 0.8, 6), C.lake2);
  s.x(c.ribbon([[lx - 20, ly - 20], [lx + 30, ly - 26]], 2) + c.ribbon([[lx - 10, ly + 30], [lx + 30, ly + 24]], 2), C.foam, 'opacity=".7"');
  // compass star
  s.x(c.poly(c.star(w / 2 - 90, h / 2 - 90, 34, 7, 4, 0)), C.clay, 'opacity=".6"');
  const txt = (x, y, t, size = 22, col = C.inkSoft, anchor = 'start', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}"${extra}>${t}</text>`;
  const town_ = (x, y, big = false) => c.cut(c.rect(x - (big ? 20 : 12), y - 10, big ? 40 : 24, 16), 0.3, 4) + c.cut([[x - (big ? 22 : 14), y - 10], [x, y - (big ? 28 : 22)], [x + (big ? 22 : 14), y - 10]], 0.3, 4);
  s.p(town_(...MAP.cana) + town_(...MAP.caph) + town_(...MAP.jer, true), C.clay);
  const [cx, cy] = MAP.cana, [kx, ky] = MAP.caph, [jx, jy] = MAP.jer;
  const labels = txt(cx - 26, cy + 8, tr('Kana', 'Cana'), 28, C.inkSoft, 'end') + txt(kx + 22, ky - 14, tr('Kafarnaum', 'Capernaum'), 26) + txt(jx + 34, jy + 8, tr('Jerozolima', 'Jerusalem'), 30) +
    txt(-110, -520, tr('Galilea', 'Galilee'), 40, C.terracotta) + txt(-110, 540, tr('Judea', 'Judea'), 40, C.terracotta) + txt(-470, 0, tr('Morze Wielkie', 'the Great Sea'), 20, shade(C.lakeDeep, -0.1), 'middle', ' transform="rotate(-80 -470 0)"') +
    txt(lx + 80, ly + 280, tr('Jordan', 'Jordan'), 20, shade(C.lakeDeep, -0.1), 'middle', ` transform="rotate(80 ${lx + 80} ${ly + 280})"`);
  return s.out() + labels;
}
/** the road from Cana down to Capernaum, and from Capernaum up to Jerusalem (map coords) */
export const ROAD1 = [[-190, -330], [-140, -300], [-80, -330], [-10, -350], [40, -380], [90, -390]];
export const ROAD2 = [[90, -390], [110, -330], [100, -220], [120, -80], [110, 60], [60, 180], [-20, 260], [-90, 310], [-150, 330]];
/** point at fraction u along a polyline */
export function along(pts, u) {
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  let x = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (x <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, x / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])]; }
    x -= seg[i];
  }
  return pts[pts.length - 1];
}
/** a dotted road drawn as separate dashes (so it can be revealed): returns [{markup, u}] */
export function roadDashes(c, pts, step = 22, col = C.terracotta) {
  const out = [];
  const L = (() => { let t = 0; for (let i = 1; i < pts.length; i++) t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return t; })();
  for (let d = 0; d < L; d += step) {
    const u = d / L, [x, y, a] = along(pts, u);
    out.push({ u, markup: `<path d="${c.cut(c.ell(x, y, 6, 2.6, 8, a), 0.2, 2)}" fill="${col}"/>` });
  }
  return out;
}
/** a little house by the lake, for Capernaum on the map; origin: base centre */
export function mapHouse(c) {
  return house(c, -26, 0, 52, 40, { stairs: false });
}

/** a round speech bubble holding a picture; origin at the tail tip. side: 1 → bubble up-right, -1 → up-left */
export function iconBubble(c, inner, { w = 120, h = 86, side = 1, fill = C.cream } = {}) {
  const cx = side * (w / 2 - 14), cy = -h / 2 - 22;
  const s = sheet();
  s.p(c.cut(c.blob(cx, cy, w / 2, h / 2, 18, 0.04), 0.6, 6), fill);
  s.p(c.cut([[side * 6, -26], [0, 0], [side * 26, -24]], 0.3, 4), fill);
  return `${s.out()}<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})">${inner}</g>`;
}
