// Matthew 24 — the discourse on the Mount of Olives. Most of the set and cast is Mark 13's (the Mount facing the
// Temple, the seated circle of the four, the hanging plates and the map, the line of days, the house with its
// servants, the fly-system heavens), so the same places look the same in both Gospels. Here: Mark 13's temple
// wall and the Judean refuge (copied from its scenes, where they were local), and Matthew's own pieces — Noah's
// ark, a hand-mill, vultures, the sign of the Son of Man, a thief's cloak, cold hearts, sprite crowds.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { pose3 } from '../matthew4/lib.js';
import { folk } from '../matthew19/lib.js';

export {
  olivesSet, circle, seatRock, SKIES, FOUR, JX, JY, JS, tint, plate, mapSheet, shadowScreen, roundel, ashlar, hourglass, emptyBowl, mask,
  banner, soldier, crownIcon, shoot, lightHand, scissorsBig, dayCard, pointer, word, handLamp, flake, skyStar, tornPieces, oliveBough,
  houseSet, HOUSE, STATIONS, well, oven, broom, keyProp, rooster, zzz, MASTER, SERVANTS, DOORKEEPER, INK, FONT,
  kf, speech, GLYPH, thought, voiceRings, addToHead, addToBody, heart, dust, scrollOpen, sparkle, dove, angel, glory, globe, soulLight,
  lightCrown, jerusalem, templeFront, figTree, question, man, woman, shadowPerson, silhouette, along, nameTag, tagOnString, wordSlip, headAt, hand, spark,
} from '../mark13/lib.js';
export { sanctuary as bigSanctuary } from '../mark12/lib.js';
export { trumpet, blast } from '../matthew6/lib.js';
export { worldGlobe } from '../mark16/lib.js';
export { lowTable, bowl, loaf, cup, canopy, tambourine, garland, jug, candle, lantern, coin, sabbathTag } from '../mark2/lib.js';
export { pose3, folk, tr };

export const PI = Math.PI;
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ====================================================================== */
/* skies                                                                  */
/* ====================================================================== */
export const AFTERNOON = ['#e2d7bf', '#f1dfbf', '#f7e8cf'];
export const LATE = ['#d9b9a4', '#ecc9a8', '#f4dcc0'];
export const WINTERN = ['#2a3150', '#46506e', '#6f7890'];
export const SPRING = ['#bcd9d6', '#eef0d6', '#f8efd6'];
export const DAYSKY = ['#bcd8d8', '#eaeccd', '#f7ecd0'];
export const GREY = ['#8f97a6', '#b9bcc0', '#d8d4cc'];
export const STORMSKY = ['#454e6d', '#5d6682', '#7a8096'];

/* ====================================================================== */
/* people                                                                 */
/* ====================================================================== */
/** a still group as one cut-out (for a sprite): members [{x, y, s, flip, o, head, armF, armB}] */
export function group(c, members) { return pose3(c, members); }
/** a still group of silhouettes (shadow play), one dark colour, no blush */
export function shadowGroup(c, members, col = '#3b2a22') {
  const m = pose3(c, members.map((x) => ({ ...x, o: { ...x.o, robe: col, mantle: x.o.mantle ? shade(col, 0.06) : null, skin: col, hair: col, veil: col, veil2: col, beardColor: col, belt: null, halo: false, holdF: x.o.holdF || '', holdB: x.o.holdB || '' } })));
  return m.split(`fill="${C.blush}"`).join(`fill="${col}"`);
}
/** a crowd strip: n members spread across width w around 0, facing the centre or `face` */
export function crowdStrip(c, n, { w = 600, s = 0.6, rows = 2, face = 0, arms = [0, 30], armB = [0, 10], head = [-6, 3], P = 'stand', o } = {}) {
  const per = Math.ceil(n / rows);
  const ms = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / per), k = i % per;
    const x = -w / 2 + (w * (k + 0.5)) / per + (r % 2) * (w / per) * 0.5 + c.rr(-8, 8);
    ms.push({ x, y: r * 16 + c.rr(-3, 3), s: s * c.rr(0.92, 1.06) * (1 + r * 0.06), flip: face === 0 ? x > 0 : face < 0, head: c.rr(head[0], head[1]), armF: c.rr(arms[0], arms[1]), armB: c.rr(armB[0], armB[1]), o: { ...(o ? o(c, i) : folk(c)), pose: P } });
  }
  return ms;
}
export const NOAH = { robe: C.linen2, mantle: C.olive, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'wild', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
export const THIEF = { robe: mix(C.night2, C.soilDark, 0.4), mantle: mix(C.night, C.soilDark, 0.5), hair: C.hair3, hairStyle: 'wrap', veil: mix(C.night2, C.soilDark, 0.2), beard: 'short', skin: C.skin4, belt: C.leather };
export const HOUSEHOLDER = { robe: C.linen, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather };
export const STEWARD = { robe: C.tealRobe, mantle: C.ochreRobe, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };

/* ====================================================================== */
/* the Temple: the great retaining wall, the street, a little Temple of blocks (after Mark 13,1–2) */
/* ====================================================================== */
export const TW = { GY: 690, WT: 350, GATE: [462, 598] };
const STONE = mix(C.stone, C.cream, 0.3);
/** the retaining wall: courses of drafted ashlars, a double gate, the portico along the top */
export function templeWall(c, ashlarFn) {
  const { GY, WT, GATE } = TW;
  let out = sheet().p(c.cut([[-1400, WT - 2], [3000, WT - 2], [3000, GY], [-1400, GY]], 0.4, 20), mix(C.rock3, C.soil, 0.25)).out();
  const courses = [[WT, 64], [WT + 64, 84], [WT + 148, 110], [WT + 258, 82]];
  courses.forEach(([y, h], r) => {
    let x = -1400 + c.rr(0, 200) - r * 90;
    while (x < 3000) {
      const big = r === 2 && c.chance(0.6);
      const w = big ? c.rr(460, 700) : c.rr(170, 320);
      const x1 = Math.min(x + w, 3000);
      if (!(x1 > GATE[0] - 30 && x < GATE[1] + 30 && y + h > 470)) out += `<g transform="translate(${x.toFixed(1)} ${y})">${ashlarFn(c, x1 - x - 5, h - 5, mix(STONE, c.pick([C.sand, C.dawn, C.stone2, C.sand2]), c.rr(0.1, 0.6)))}</g>`;
      else {
        if (x < GATE[0] - 30) out += `<g transform="translate(${x.toFixed(1)} ${y})">${ashlarFn(c, GATE[0] - 30 - x - 3, h - 3, STONE)}</g>`;
        if (x1 > GATE[1] + 30) out += `<g transform="translate(${GATE[1] + 30} ${y})">${ashlarFn(c, x1 - GATE[1] - 33, h - 3, STONE)}</g>`;
      }
      x = x1;
    }
  });
  const g = sheet();
  const gx = (GATE[0] + GATE[1]) / 2, gw = GATE[1] - GATE[0];
  g.p(c.cut([[GATE[0] - 30, GY], [GATE[0] - 30, 414], [GATE[1] + 30, 414], [GATE[1] + 30, GY]], 0.5, 8), mix(STONE, C.sand2, 0.3));
  g.p(c.cut([[GATE[0], GY + 2], [GATE[0], 520], ...c.arc(gx, 520, gw / 2, 48, PI, 2 * PI, 12), [GATE[1], GY + 2]], 0.4, 6), mix(C.soilDark, C.wood2, 0.25));
  g.p(c.cut([[GATE[0] + 10, GY + 2], [GATE[0] + 10, 530], ...c.arc(gx, 530, gw / 2 - 10, 40, PI, 2 * PI, 12), [GATE[1] - 10, GY + 2]], 0.3, 6), mix(C.soilDark, C.night2, 0.3));
  g.x(c.ribbon(c.arc(gx, 520, gw / 2 + 8, 56, PI, 2 * PI, 14), 7), shade(STONE, -0.12));
  g.p(c.cut(c.rect(GATE[0] - 38, 408, gw + 76, 12), 0.3, 6), C.sun);
  out += g.out();
  const p = sheet();
  p.p(c.cut([[-1400, WT + 2], [-1400, WT - 56], [3000, WT - 56], [3000, WT + 2]], 0.5, 14), mix(C.plaster2, C.rock2, 0.3));
  let cols = '';
  for (let x = -1380; x < 3000; x += 36) cols += c.cut([[x - 6, WT], [x - 5, WT - 50], [x + 5, WT - 50], [x + 6, WT]], 0.2, 6);
  p.p(cols, mix(C.cream, C.stone, 0.3));
  p.p(c.cut([[-1400, WT - 48], [3000, WT - 48], [3000, WT - 64], [-1400, WT - 64]], 0.4, 12), mix(C.stone, C.plaster, 0.4));
  const rf = [[-1400, WT - 62], [-1400, WT - 76]];
  for (let x = -1400; x < 3000; x += 24) rf.push(...c.arc(x + 12, WT - 76, 12, 6, PI, 2 * PI, 4));
  rf.push([3000, WT - 76], [3000, WT - 62]);
  p.p(c.cut(rf, 0.3, 8), mix(C.clay, C.roof, 0.5));
  p.x(c.ribbon([[-1400, WT - 50], [3000, WT - 50]], 2), C.sun, 'opacity=".75"');
  out += p.out();
  return out;
}
/** the street below the wall: big paving slabs in soft perspective */
export function templeStreet(c) {
  const { GY } = TW;
  const s = sheet();
  const col = mix(C.stone, C.sand, 0.4);
  s.p(c.cut([[-1400, GY - 14], [3000, GY - 14], [3000, 1800], [-1400, 1800]], 0.6, 20), col);
  let lines = '';
  [GY + 4, GY + 30, GY + 70, GY + 130, GY + 220].forEach((y) => { lines += c.ribbon([[-1400, y], [3000, y + c.rr(-1, 1)]], 1.4); });
  for (let k = -20; k <= 20; k++) { const xb = 800 + k * 90; lines += c.ribbon([[800 + (xb - 800) * 0.5, GY - 14], [800 + (xb - 800) * 2.4, 1400]], 1.2); }
  s.x(lines, shade(col, -0.15), 'opacity=".5"');
  s.p(c.cut([[-1400, GY - 20], [3000, GY - 20], [3000, GY - 8], [-1400, GY - 8]], 0.5, 14), shade(col, -0.08));
  return s.out();
}
/** the little Temple of a plate, as separate blocks: [{x, y, w, h, col, ...}] (origin: ground centre) */
export function templeBlocks(c) {
  const B = [];
  const st = mix(C.stone, C.cream, 0.35), gold = C.sun;
  for (let i = 0; i < 6; i++) B.push({ x: -150 + i * 50, y: -18, w: 50, h: 18, col: mix(C.stone2, st, 0.4) });
  for (let r = 0; r < 3; r++) { B.push({ x: -120, y: -40 - r * 22, w: 44, h: 22, col: C.plaster2 }); B.push({ x: 76, y: -40 - r * 22, w: 44, h: 22, col: C.plaster2 }); }
  B.push({ x: -124, y: -92, w: 52, h: 8, col: gold }); B.push({ x: 72, y: -92, w: 52, h: 8, col: gold });
  for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) {
    const portal = k === 1 && r < 3;
    B.push({ x: -66 + k * 44, y: -40 - r * 22, w: 44, h: 22, col: portal ? mix(C.plumRobe, C.soilDark, 0.25) : st });
  }
  B.push({ x: -74, y: -180, w: 148, h: 12, col: gold });
  return B.map((b) => ({ ...b, r0: c.rr(-30, 30), ex: c.rr(-150, 140), rot: c.rr(-60, 60) }));
}
/** one block of the little Temple as a cut-out (origin: its centre) */
export function blockCut(c, b) {
  return sheet().p(c.cut(c.rect(-b.w / 2, -b.h / 2, b.w - 1.5, b.h - 1.5), 0.3, 5), b.col).x(c.ribbon([[-b.w / 2 + 3, b.h / 2 - 4], [b.w / 2 - 4, b.h / 2 - 4]], 1.1), shade(b.col, -0.2), 'opacity=".6"').out();
}

/* ====================================================================== */
/* Judea: mountains, the roof house, the field (after Mark 13,14–18)      */
/* ====================================================================== */
export const JG = 690;
/** a tall paper mountain; origin at the middle of its foot */
export function peak(c, w, h, col) {
  const s = sheet();
  const pts = [[-w / 2, 0]];
  for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([-w / 2 + u * w, -h * Math.pow(Math.sin(u * PI), 1.3) + c.rr(-10, 10)]); }
  pts.push([w / 2, 0]);
  s.p(c.cut(pts, 1.2, 10), col);
  s.p(c.cut([[-w * 0.05, -h * 0.98], [w * 0.12, -h * 0.84], [w * 0.2, -h * 0.55], [w * 0.04, -h * 0.66]], 0.8, 6), shade(col, 0.2));
  s.p(c.cut([[w * 0.2, -h * 0.5], [w * 0.36, -h * 0.28], [w * 0.4, -h * 0.05], [w * 0.2, -h * 0.12]], 0.8, 6), shade(col, -0.12));
  return s.out();
}
/** the flat-roofed house with an outside stair, built against the hill; origin world */
export function roofHouse(c) {
  const s = sheet();
  const x0 = 360, x1 = 560, top = 528, GY = JG;
  s.p(c.cut([[x0, GY + 4], [x0, top], [x1, top], [x1, GY + 4]], 0.5, 8), mix(C.plaster, C.sand, 0.2));
  s.p(c.cut([[x0 - 6, top - 8], [x1 + 6, top - 8], [x1 + 6, top + 2], [x0 - 6, top + 2]], 0.3, 8), C.roof);
  s.p(c.cut(c.rect(x0 - 2, top - 20, 30, 12), 0.3, 5) + c.cut(c.rect(x1 - 30, top - 20, 32, 12), 0.3, 5), C.plaster2);
  s.p(c.cut([[440, GY + 2], [440, 610], ...c.arc(462, 610, 22, 18, PI, 2 * PI, 8), [484, GY + 2]], 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
  s.p(c.cut([[448, GY], [448, 664], [456, 656], [464, 664], [464, GY]], 0.3, 4), C.pot);
  s.p(c.cut(c.ell(474, 672, 8, 12, 10), 0.3, 3), C.basket);
  s.x(c.poly(c.rect(390, 580, 22, 18)) + c.poly(c.rect(510, 580, 22, 18)), mix(C.soilDark, C.wood2, 0.3));
  let st = '';
  for (let i = 0; i < 8; i++) st += c.cut(c.rect(x1 + i * 11, top + 4 + i * 20, 22, 20), 0.3, 4);
  s.p(st, C.plaster2);
  return s.out();
}
/** a field with furrows and a post; origin world */
export function fieldPatch(c, { x0 = 980, x1 = 1480, y0 = 646, y1 = 730, post = 1012 } = {}) {
  const s = sheet();
  s.p(c.cut([[x0, y0], [x1, y0 - 6], [x1 + 40, y1], [x0 - 20, y1 + 4]], 0.8, 10), mix(C.soil, C.sand2, 0.35));
  let fur = '';
  const n = Math.floor((y1 - y0) / 13);
  for (let i = 0; i < n; i++) fur += c.ribbon([[x0 + 10 - i * 4, y0 + 10 + i * 13], [x1 + 6 + i * 5, y0 + 4 + i * 13]], 2.2);
  s.x(fur, shade(C.soil, -0.15), 'opacity=".6"');
  let sp = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(x0 + 20, x1 - 10), y = c.rr(y0 + 6, y1 - 8); sp += c.poly([[x, y], [x - 2, y - 8], [x + 1, y - 10], [x + 2, y]]); }
  s.x(sp, C.wheatGreen);
  if (post) s.p(c.cut(c.rect(post, y0 - 48, 9, 94), 0.3, 5), C.wood2);
  return s.out();
}
/** a cloak left on a post; origin at the top of the post */
export function postCloak(c, col) {
  const s = sheet();
  s.p(c.cut([[-10, -4], [16, -6], [30, 10], [26, 60], [34, 88], [8, 80], [-6, 90], [-20, 78], [-14, 40], [-18, 8]], 1, 6), col);
  s.x(c.ribbon([[0, 6], [2, 80]], 2) + c.ribbon([[14, 8], [18, 74]], 2), shade(col, -0.2), 'opacity=".5"');
  return s.out();
}
/** the "abomination": an abstract, ragged column of dark torn paper with wisps (origin: its foot) */
export function abomination(c) {
  const s = sheet();
  const L = [], R = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const u = i / n, y = -u * 150, w = 34 * (1 - u * 0.45) + c.rr(-6, 6);
    L.push([-w + c.rr(-8, 4), y]); R.push([w + c.rr(-4, 8), y]);
  }
  const top = [[R[n][0] - 6, -164], [8, -176], [-6, -168], [L[n][0] + 4, -160]];
  s.p(c.cut([...L, ...top, ...R.reverse()], 2.2, 4), mix(INK_, C.night2, 0.3));
  let wisps = '';
  for (let i = 0; i < 5; i++) { const x = c.rr(-40, 40), y = c.rr(-150, -30), d = i % 2 ? 1 : -1; wisps += c.ribbon(c.qbez([x, y], [x + d * 40, y - 20], [x + d * 70, y - 60], 8), (u) => 6 * (1 - u) + 0.5); }
  s.p(wisps, mix(INK_, C.plumRobe, 0.3));
  s.x(c.cut(c.blob(0, -96, 10, 16, 9, 0.3), 0.8, 3), mix(INK_, C.night, 0.5));
  return s.out();
}
const INK_ = '#3b2a22';

/* ====================================================================== */
/* watches of the night (after Mark 13,35)                                */
/* ====================================================================== */
/** a round plate of one watch of the night: 'eve' | 'mid' | 'cock' | 'morn'. clipId: a <clipPath> with circle r 47 */
export function watchPlate(c, kind, clipId, rooster) {
  const faces = { eve: mix(C.dusk, C.peach, 0.4), mid: mix(C.night, C.indigo, 0.3), cock: mix(C.duskViolet, C.stone, 0.3), morn: mix(C.dawn, C.skyBlue, 0.3) };
  let inner = '';
  if (kind === 'eve') inner = `<path d="${c.cut([[-40, 14], ...c.arc(0, 14, 24, 24, PI, 2 * PI, 12), [40, 14], [40, 42], [-40, 42]], 0.3, 4)}" fill="${C.sunDeep}"/><path d="${c.cut([[-46, 14], [46, 14], [46, 46], [-46, 46]], 0.4, 6)}" fill="${mix(C.hillMid, C.dusk, 0.4)}"/>`;
  if (kind === 'mid') inner = `<g transform="translate(6 -6)">${sheet().p(c.cut(c.circ(0, 0, 18, 20), 0.3, 4), C.moon).out()}</g><path d="${c.poly(c.star(-24, 12, 5, 2, 4, 0)) + c.poly(c.star(22, 20, 4, 1.6, 4, 0)) + c.poly(c.star(-12, -24, 3.6, 1.4, 4, 0))}" fill="${C.star}"/>`;
  if (kind === 'cock') inner = `<g transform="translate(-4 30) scale(.9)">${rooster(c)}</g>`;
  if (kind === 'morn') inner = `<path d="${c.cut([[-40, 20], ...c.arc(0, 20, 22, 22, PI, 2 * PI, 12), [40, 20], [40, 42], [-40, 42]], 0.3, 4)}" fill="${C.sun}"/><path d="${c.poly(c.star(0, 20, 40, 26, 12, 0))}" fill="${C.sun}" opacity=".4"/><path d="${c.cut([[-46, 20], [46, 20], [46, 46], [-46, 46]], 0.4, 6)}" fill="${C.hillMid}"/>`;
  const rim = sheet().p(c.cut(c.circ(0, 0, 56, 48), 0.5, 6), C.ochre).p(c.cut(c.circ(0, 0, 48, 48), 0.5, 6), faces[kind]).out();
  return `<path d="M0 -1500V-58" stroke="rgba(230,210,180,.5)" stroke-width="1.2"/>${rim}<g clip-path="url(#${clipId})">${inner}</g>`;
}

/* ====================================================================== */
/* Matthew's own pieces                                                   */
/* ====================================================================== */
/** Noah's ark: a long wooden hull with a house on it and a door (.door, hinged at its foot); origin: keel centre */
export function ark(c, w = 420) {
  const h = w * 0.2;
  const s = sheet();
  const hull = [[-w / 2 - 20, -h * 1.05], [-w / 2 + 6, -h * 0.2], [-w * 0.3, 0], [w * 0.3, 0], [w / 2 - 6, -h * 0.2], [w / 2 + 20, -h * 1.05], [w / 2 - 10, -h * 0.95], [-w / 2 + 10, -h * 0.95]];
  s.p(c.cut(hull, 0.7, 10), C.wood);
  let planks = '';
  for (let i = 1; i < 4; i++) planks += c.ribbon(c.qbez([-w / 2 + 4 + i * 4, -h * (1 - i * 0.24)], [0, -h * (0.7 - i * 0.24) + h * 0.2], [w / 2 - 4 - i * 4, -h * (1 - i * 0.24)], 16), 1.6);
  s.x(planks, shade(C.wood, -0.25), 'opacity=".6"');
  s.p(c.ribbon([[-w / 2 - 16, -h * 1.02], [w / 2 + 16, -h * 1.02]], 8), C.wood2);
  // the house on the deck
  const hx0 = -w * 0.32, hx1 = w * 0.3, hy = -h * 0.98, hh = h * 0.9;
  s.p(c.cut([[hx0, hy], [hx0, hy - hh], [hx1, hy - hh], [hx1, hy]], 0.5, 8), C.wood3);
  s.p(c.cut([[hx0 - 18, hy - hh + 2], [(hx0 + hx1) / 2, hy - hh - h * 0.6], [hx1 + 18, hy - hh + 2]], 0.6, 8), C.wood2);
  let wins = '';
  for (let x = hx0 + 30; x < hx1 - 40; x += 44) wins += c.cut(c.rect(x, hy - hh + 14, 16, 12), 0.2, 4);
  s.p(wins, mix(C.soilDark, C.wood2, 0.3));
  s.p(c.cut(c.rect(hx1 - 44, hy - hh * 0.78, 36, hh * 0.78), 0.3, 5), mix(C.soilDark, C.wood2, 0.4));
  const door = sheet().p(c.cut(c.rect(0, -hh * 0.78, 36, hh * 0.78), 0.3, 5), shade(C.wood, 0.05)).x(c.ribbon([[12, -hh * 0.72], [12, -4]], 1.4) + c.ribbon([[24, -hh * 0.72], [24, -4]], 1.4), shade(C.wood, -0.25), 'opacity=".6"').out();
  return { body: s.out(), door, doorAt: [hx1 - 44, hy], w, h };
}
/** a boarding ramp; origin at its lower end, rising to the right by (dx, -dy) */
export function ramp(c, dx = 150, dy = 70) {
  const s = sheet().p(c.ribbon([[0, 0], [dx, -dy]], 14), C.wood3);
  let cl = '';
  for (let i = 1; i < 7; i++) { const u = i / 7; cl += c.ribbon([[dx * u - 3, -dy * u - 6], [dx * u + 3, -dy * u + 6]], 2.4); }
  return s.x(cl, C.wood2).out();
}
/** a pair of animals walking two by two (small, side view); kind: 'sheep' | 'ox' | 'bird' */
export function beast(c, kind, col) {
  const s = sheet();
  if (kind === 'sheep') {
    s.p(c.cut(c.blob(0, -16, 18, 11, 12, 0.18), 1.2, 3), col || C.linen);
    s.p(c.cut(c.ell(17, -20, 6, 5, 10), 0.3, 3), C.soilDark);
    s.p(c.ribbon([[-10, -8], [-10, 0]], 2.6) + c.ribbon([[10, -8], [10, 0]], 2.6), C.soilDark);
  } else if (kind === 'ox') {
    s.p(c.cut([[-26, -28], [16, -30], [26, -24], [34, -22], [36, -14], [26, -12], [20, -10], [-24, -10], [-30, -18]], 0.6, 4), col || C.clay);
    s.p(c.ribbon([[-20, -12], [-20, 0]], 4) + c.ribbon([[14, -12], [14, 0]], 4), shade(col || C.clay, -0.2));
    s.p(c.ribbon(c.arc(30, -30, 6, 6, PI, 2 * PI, 5), 2), C.cream);
  } else {
    s.p(c.cut([[-12, -6], [4, -10], [12, -8], [16, -12], [18, -8], [12, -2], [-8, 0], [-18, -2]], 0.3, 3), col || C.bird);
  }
  return s.out();
}
/** a hand-mill (quern): the nether stone on a mat, the upper stone (.upper) with its peg handle; origin: floor centre */
export function quern(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -2, 64, 9, 20), 0.6, 6), mix(C.basket, C.sand2, 0.4));
  s.p(c.cut([[-40, -4], [-38, -24], [38, -24], [40, -4]], 0.5, 6), C.rock2);
  let fl = '';
  for (let i = 0; i < 10; i++) fl += c.cut(c.blob(c.rr(-56, 56), c.rr(-6, 2), c.rr(2, 5), c.rr(1, 2.4), 6, 0.2), 0.2, 2);
  s.x(fl, C.linen, 'opacity=".9"');
  const u = sheet();
  u.p(c.cut([[-36, -22], [-34, -40], [34, -40], [36, -22]], 0.5, 6), mix(C.rock, C.rock2, 0.4));
  u.p(c.cut(c.ell(0, -40, 34, 5, 16), 0.3, 4), shade(C.rock2, -0.2));
  u.p(c.cut(c.ell(0, -40, 8, 2.4, 10), 0.2, 3), C.soilDark);
  return { base: s.out(), upper: u.out(), peg: sheet().p(c.cut([[-4, 0], [-3, -34], [3, -34], [4, 0]], 0.2, 4), C.wood2).out() };
}
/** a soaring vulture, dark, wings spread (no flapping); origin: body centre, facing right */
export function vulture(c, col = '#3a3036') {
  const s = sheet();
  const wing = [[-6, -2], [-30, -10], [-60, -14], [-86, -10], [-100, -2], [-92, 0], [-96, 4], [-84, 4], [-88, 9], [-74, 7], [-76, 12], [-60, 8], [-40, 6], [-10, 6]];
  s.p(c.cut(wing, 0.6, 5), col);
  s.p(c.cut(wing.map(([x, y]) => [-x, y]), 0.6, 5), shade(col, 0.08));
  s.p(c.cut([[-16, -4], [16, -5], [22, 0], [12, 6], [-18, 5], [-30, 8], [-28, 0]], 0.4, 4), shade(col, -0.1));
  s.p(c.cut([[16, -4], [24, -10], [30, -8], [34, -4], [28, -2], [22, 0]], 0.3, 3), mix(C.skin4, col, 0.4));
  return s.out();
}
/** the sign of the Son of Man: a cross of light with rays; origin centre */
export function crossSign(c, h = 150) {
  const w = h * 0.62, t = h * 0.12;
  const s = sheet();
  s.p(c.cut([[-t, -h * 0.55], [t, -h * 0.55], [t, -h * 0.2], [w / 2, -h * 0.2], [w / 2, h * 0.04], [t, h * 0.04], [t, h * 0.45], [-t, h * 0.45], [-t, h * 0.04], [-w / 2, h * 0.04], [-w / 2, -h * 0.2], [-t, -h * 0.2]], 0.5, 6), C.halo);
  s.x(c.poly([[-t * 0.4, -h * 0.5], [t * 0.4, -h * 0.5], [t * 0.4, h * 0.4], [-t * 0.4, h * 0.4]]) + c.poly([[-w / 2 + 8, -h * 0.1], [w / 2 - 8, -h * 0.1], [w / 2 - 8, -h * 0.06], [-w / 2 + 8, -h * 0.06]]), '#fffaf0', 'opacity=".75"');
  let d = '';
  for (let i = 0; i < 24; i++) { const a = (i / 24) * PI * 2, ww = 0.035; d += c.poly([[Math.cos(a - ww * 0.3) * h * 0.2, Math.sin(a - ww * 0.3) * h * 0.2], [Math.cos(a - ww) * h * 2.6, Math.sin(a - ww) * h * 2.6], [Math.cos(a + ww) * h * 2.6, Math.sin(a + ww) * h * 2.6], [Math.cos(a + ww * 0.3) * h * 0.2, Math.sin(a + ww * 0.3) * h * 0.2]]); }
  return `<circle r="${h * 1.8}" fill="url(#halo-glow)"/><path class="rays" d="${d}" fill="#fff3cf" opacity=".4"/>${s.out()}`;
}
/** a tear drop; origin at its tip */
export function tearDrop(c, r = 5, col = C.skyVeil) {
  return `<path d="${c.poly([[0, 0], [r * 0.7, r * 1.4], [r, r * 2.1], [r * 0.7, r * 2.8], [0, r * 3.1], [-r * 0.7, r * 2.8], [-r, r * 2.1], [-r * 0.7, r * 1.4]])}" fill="${col}"/>`;
}
/** a heart that can go cold: warm heart + a frosted grey-blue one on top (.cold, fade it in) */
export function coldHeart(c, r = 12, heartFn) {
  return `${heartFn(c, r)}<g class="cold" opacity="0">${heartFn(c, r, mix(C.skyVeil, C.storm, 0.4)).replace(/url\(#warm-glow\)/, 'none')}<path d="${c.poly(c.star(-r * 0.3, -r * 0.2, r * 0.5, r * 0.12, 6, 0)) + c.poly(c.star(r * 0.4, r * 0.3, r * 0.35, r * 0.09, 6, 0.3))}" fill="#f4f7fa" opacity=".9"/></g>`;
}
/** a plain wooden staff / cudgel (held); origin: grip */
export function cudgel(c, len = 110) {
  return sheet().p(c.ribbon([[0, -len * 0.25], [3, len * 0.75]], (u) => 5 + u * 3), C.wood2).out();
}
/** a digging bar (mattock) for breaking through a wall; origin: grip */
export function mattock(c) {
  return sheet().p(c.ribbon([[0, -30], [2, 70]], 4), C.wood3).p(c.cut([[-16, 64], [18, 60], [20, 68], [-2, 74], [-18, 70]], 0.3, 4), mix(C.stone2, C.rock3, 0.5)).out();
}
/** a wine jar (amphora); origin: foot */
export function wineJar(c, h = 70, col = C.pot) {
  const w = h * 0.36;
  const s = sheet();
  s.p(c.cut([[-w * 0.3, 0], [-w, -h * 0.35], [-w * 0.9, -h * 0.66], [-w * 0.4, -h * 0.8], [-w * 0.3, -h * 0.92], [w * 0.3, -h * 0.92], [w * 0.4, -h * 0.8], [w * 0.9, -h * 0.66], [w, -h * 0.35], [w * 0.3, 0]], 0.5, 5), col);
  s.p(c.ribbon(c.arc(-w * 0.6, -h * 0.8, w * 0.35, h * 0.1, PI * 0.5, PI * 1.5, 6), 3) + c.ribbon(c.arc(w * 0.6, -h * 0.8, w * 0.35, h * 0.1, -PI * 0.5, PI * 0.5, 6), 3), shade(col, -0.15));
  s.x(c.ribbon([[-w * 0.8, -h * 0.5], [w * 0.8, -h * 0.5]], 2), shade(col, -0.25), 'opacity=".6"');
  return s.out();
}
/** a small money chest, open, with coins; origin: foot centre */
export function coinChest(c, w = 70) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -w * 0.5, w, w * 0.5), 0.4, 6), C.wood);
  s.p(c.cut([[-w / 2, -w * 0.5], [-w / 2 + 4, -w * 0.9], [w / 2 - 4, -w * 0.9], [w / 2, -w * 0.5]], 0.4, 6), C.wood2);
  let cs = '';
  for (let i = 0; i < 9; i++) cs += c.cut(c.circ(c.rr(-w * 0.38, w * 0.38), -w * 0.5 - c.rr(0, 8), c.rr(5, 7), 10), 0.2, 3);
  s.p(cs, C.sun);
  s.p(c.cut(c.rect(-6, -w * 0.4, 12, 12), 0.2, 3), C.ochre);
  return s.out();
}
/** a big paper light shaft coming down from above; origin: the ground spot it lights */
export function beamDown(c, w = 70, h = 900) {
  return `<path d="${c.poly([[-w * 0.35, -h], [w * 0.35, -h], [w, 0], [-w, 0]])}" fill="#fff3cf" opacity=".42"/><ellipse rx="${w * 1.3}" ry="${w * 0.3}" fill="url(#halo-glow)"/>`;
}
/** a flock of little lights for the chosen; origin centre */
export function lightMote(c, r = 6) {
  return `<circle r="${r * 3}" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, r, r * 0.4, 4, 0))}" fill="${C.star}"/>`;
}
/** name words as a hanging paper slip (no string); origin centre */
export function slipWord(c, text, { size = 20, fill = C.cream, ink = C.ink } = {}) {
  const ww = text.length * size * 0.5 + size * 1.4, hh = size * 1.55;
  return sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill).out() +
    `<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a cut-away little house front (for plates): walls, a door and a curtained inner room; origin: floor centre */
export function innerRoomHouse(c, w = 230, h = 150) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 0.5, 8), mix(C.plaster, C.sand, 0.2));
  s.p(c.cut([[-w / 2 - 8, -h - 6], [w / 2 + 8, -h - 6], [w / 2 + 8, -h + 6], [-w / 2 - 8, -h + 6]], 0.3, 8), C.roof);
  s.p(c.cut([[-w * 0.4, 0], [-w * 0.4, -h * 0.62], [-w * 0.14, -h * 0.62], [-w * 0.14, 0]], 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
  s.p(c.cut([[w * 0.02, -8], [w * 0.02, -h * 0.8], [w * 0.42, -h * 0.8], [w * 0.42, -8]], 0.3, 5), mix(C.soilDark, C.plumRobe, 0.35));
  return s.out();
}

/** recolour a piece of markup into one flat silhouette colour (shadow play) */
export function silh(markup, col = '#3b2a22') {
  return markup.replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${col}"`);
}
export { helmet } from '../mark6/lib.js';
/** a spear (held, pointing up); origin: grip */
export function spear(c, len = 190) {
  return sheet().p(c.ribbon([[0, 40], [0, -len + 40]], 3), C.wood2).p(c.cut([[-5, -len + 42], [0, -len + 18], [5, -len + 42]], 0.2, 3), C.rock2).out();
}
