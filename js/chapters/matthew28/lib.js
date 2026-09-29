// Matthew 28 — the Resurrection, and the last command on the mountain in Galilee.
// The garden and the tomb are Mark 16's (the same rock, the same great round stone, cut with the same scissors, only
// moved so the doorway stands nearer the middle of the stage); the angel in white is John 20's; the inside of the tomb
// with the linen lying is John 20's; the soldiers and Pilate are Mark 15's; the chief priests and the elders are
// Mark 11's (as in Matthew 21–23); the council chamber is Mark 14's; the mountain over the lake is the mountain of the
// Sermon (Matthew 6). Our own pieces: the seal and its cord, cracks in the ground, stones shaken loose, snowflakes,
// the soldiers lying like dead men, the grey "story" flat of the lie, the grey whispers that fly out, the great
// curve of the whole earth with every nation round it, and the sun and the moon going round for "all the days".
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, flowers, rock, town, house, stars, moon, sun, cloud, waterBand } from '../../assets/nature.js';
import { lightning, rays, bird, fish, ear } from '../../assets/things.js';
import { fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { tombRockBig, bigStone, tombLight, DOOR as M16DOOR } from '../mark16/lib.js';
import { walledCity } from '../mark1/lib.js';
import { soldier as soldier15, shadowPerson as shadowP } from '../mark15/lib.js';
import { zzz as zzz14 } from '../mark14/lib.js';

export {
  MAGD, MARYJ, ELEVEN, bigStone, discFaces, landMap, MAP, medallion, miniHead, risenIcon, tombIcon, skyKeys, upright, talkDots,
  kf, hand, headAt, speech, thought, GLYPH, spark, heart, dust, along, nameTag, bubble, strip, sparkle, withFace, faceBits,
  voiceRings, hang2, dove, glory, globe, soulLight, lightCrown, lamb, camel, walledCity, handAt, TWELVE, archPlate,
} from '../mark16/lib.js';
export { angelPerson, ANGEL_A, tombInside, IN, buds, blooms, blossom, radiance, glowDisc, goldWord, threads, handB, card } from '../john20/lib.js';
export { pilate, LOOK as L15, spearHeld, romanHelmet, shadowPerson } from '../mark15/lib.js';
export { seal, purse, zzz, chamber, table, hangingLamp, lampGlow, wordTag } from '../mark14/lib.js';
export { priest, elder, templeCourt, courtFront, cityWall } from '../mark11/lib.js';
export { hillSet } from '../matthew6/lib.js';
export { folk, group } from '../john6/lib.js';
export { scrollOpen, coin, coinStack, wordSlip, addToHead, loaf } from '../mark2/lib.js';
export { oilLamp } from '../../assets/things.js';
export { tr, lightning, rays, bird, fish, ear };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const NIGHT = [C.night2, C.indigo, mix(C.indigo, C.duskViolet, 0.6)];
export const PRE = [C.indigo, C.duskViolet, C.dusk];
export const ROSE = [mix(C.duskViolet, C.skyBlue2, 0.45), mix(C.dusk, C.peach, 0.4), C.dawn];
export const GOLD = [C.skyBlue, mix(C.dawn, C.skyBlue, 0.3), '#f8e6bd'];
export const DAY = [mix(C.skyBlue, C.cream, 0.15), mix(C.skyBlue, C.cream, 0.55), C.cream];
export const STORMY = ['#5a5a7e', '#8d86a4', '#c9a9a4'];
export const GLORY = ['#e9d9b0', '#f8ebc6', '#fff4da'];
export const HEAVEN = ['#2b3470', '#5f6aa0', '#cfd6dc'];
export const EVE = ['#6f6f9c', '#d8a58f', '#efc39c'];

/* ================================================================== the cast */
// "Mary Magdalene and the other Mary" (Mark 16's Mary Magdalene and Mary the mother of James)
export const ANGEL = { robe: '#fffdf6', mantle: mix(C.linen, C.halo, 0.25), hair: C.wheat2, hairStyle: 'long', beard: 'none', skin: C.skin };
/** a Roman soldier of the guard (Mark 15's); spear held upright */
export const soldier = (c, i = 0, o = {}) => soldier15(c, i, o);

/* ================================================================== the garden with the tomb */
export const DX = 960;              // foot of the tomb's doorway (Mark 16's doorway moved to the left)
export const DYD = M16DOOR.y;       // 692
export const SR = 104;              // the great stone's radius
export const SHUT = DX;             // the stone across the doorway
export const OPEN = DX + 178;       // the stone rolled aside
export const STONE_Y = DYD - SR + 2;
const SHIFT = DX - M16DOOR.x;
/** the path from the city to the doorway */
export const PATH = [[-600, 820], [-200, 790], [160, 760], [380, 744], [560, 734]];
/** where the women stand, facing the tomb, and where the guard stands (x, and which soldier) */
export const WOMEN_AT = [[560, 734], [475, 740]];
export const GUARD = [{ i: 0, x: 712, y: 700 }, { i: 1, x: 1296, y: 708 }, { i: 3, x: 1452, y: 714 }];
/** depth scale on the path */
export const pathS = (y) => 0.94 + (y - 720) / 100 * 0.2;

/**
 * The garden and the tomb (Mark 16's), for the first scenes. Adds its layers to S after the sky and returns handles:
 * { far, mid, ground, doorDark, doorGlow, doorRays, stone, seal, cord, P (the people's layer), front, fg, gy }.
 * pad: extra margin for layers that shake (the earthquake).
 */
export function tombGarden(S, { pad = 0, tint = 0 } = {}) {
  const c = S.c;
  const T = (col) => (tint ? mix(col, C.duskViolet, tint) : col);
  const far = S.layer({ par: 0.08, sh: 2, pad });
  const h1 = band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 340, 120], color: T(C.hillFar) });
  far.add(h1.markup + `<g>${walledCity(c, 250, h1.fn(250) + 8, 1.25, { wall: T(C.stone), wall2: T(C.stone2), temple: T(C.cream) })}</g>`);
  const mid = S.layer({ par: 0.2, sh: 3, pad });
  const h2 = hillsWith(c, { y: 540, amps: [16, 7, 3], lens: [900, 300, 110], color: T(C.hillMid), trees: 34, treeColor: T(C.sage), treeH: 26 });
  mid.add(h2.markup + olive(c, 40, h2.fn(40) + 6, 0.8, { leaf: T(C.olive), leaf2: T(C.sage) }) + cypress(c, 620, h2.fn(620) + 4, 120, T(C.moss2)) + cypress(c, 660, h2.fn(660) + 4, 90, T(C.moss2)));

  const ground = S.layer({ par: 0.5, sh: 3, pad });
  const gy = c.wave(652, [5, 2], [700, 200]);
  const gs = sheet();
  gs.p(c.ridge(gy, -1400, 2800, 1700, 12, 1), T(mix(C.hillNear, C.sage2, 0.4)));
  const pth = c.cbez([-900, 1000], [-200, 780], [500, 770], [DX, DYD + 6], 40);
  gs.p(c.ribbon(pth, (u) => 170 - u * 120, 3), T(C.sand));
  gs.x(c.ribbon(pth.map(([x, y]) => [x, y + 8]), (u) => 90 - u * 70, 2), T(C.sand2), 'opacity=".45"');
  ground.add(gs.out());
  ground.add(olive(c, -200, 690, 1.3, { leaf: T(C.olive), leaf2: T(C.sage) }) + olive(c, 330, 664, 1.05, { leaf: T(C.olive), leaf2: T(C.sage) }) + cypress(c, 520, 670, 170, T(C.moss2)) + cypress(c, 1560, 680, 190, T(C.moss2)) + olive(c, 1760, 690, 1.2, { leaf: T(C.olive), leaf2: T(C.sage) }));
  ground.add(`<g transform="translate(${SHIFT} 0)">${tombRockBig(c)}</g>`);
  const doorPts = [[-54, 4], [-54, -104], ...c.arc(0, -104, 54, 44, PI, 2 * PI, 12), [54, -104], [54, 4]];
  const doorGlow = ground.add(`<g opacity="0"><path d="${c.cut(doorPts, 0.5, 6)}" fill="${C.lampGlow}"/><circle cx="0" cy="-60" r="150" fill="url(#halo-glow)"/></g>`);
  const doorRays = ground.add(`<g opacity="0">${tombLight(c)}</g>`);
  const stone = ground.add(`<g>${bigStone(c)}</g>`);
  // the seal: a cord across the stone, fixed to the rock on both sides with wax
  const cord = ground.add(`<g>${sealCord(c)}</g>`);
  ground.add(grass(c, { x0: -1200, x1: 760, y: 652, fn: gy, n: 50, h: 16, color: T(C.moss) }) + grass(c, { x0: 1430, x1: 2600, y: 652, fn: gy, n: 20, h: 16, color: T(C.moss) }));
  ground.add(flowers(c, { x0: -700, x1: 700, y: 690, fn: (x) => gy(x) + c.rr(20, 120), n: 36, h: 20 }));
  ground.add(bush(c, 690, 704, 80, T(C.sage), T(C.moss)) + bush(c, 1500, 700, 120, T(C.moss), T(C.sage)) + rock(c, 1420, 722, 60, 24, C.rock2));

  const P = S.layer({ par: 0.5, sh: 5, pad });
  const front = S.layer({ par: 0.5, sh: 5, pad });
  const fg = S.layer({ par: 0.9, sh: 6, pad: pad * 1.4 });
  fg.add(bush(c, -140, 1000, 260, T(C.moss), T(C.sage)) + bush(c, 1720, 1000, 240, T(C.moss2), T(C.sage)) + grass(c, { x0: -800, x1: 260, y: 975, n: 24, h: 46, color: T(C.moss2) }) + grass(c, { x0: 1340, x1: 2400, y: 975, n: 24, h: 46, color: T(C.moss2) }) + flowers(c, { x0: 60, x1: 330, y: 975, n: 10, h: 40 }) + flowers(c, { x0: 1280, x1: 1540, y: 975, n: 10, h: 40 }));
  return { far, mid, ground, doorGlow, doorRays, stone, cord, P, front, fg, gy, layers: [far, mid, ground, P, front, fg] };
}
/** the cord and wax seals across the shut stone (origin: the doorway's foot) */
export function sealCord(c) {
  const y = -SR + 6;
  const s = sheet();
  s.p(c.ribbon(c.qbez([-SR - 40, y - 30], [0, y + 36], [SR + 40, y - 30], 18), 3), C.rope);
  const wax = (x, yy, r) => s.p(c.cut(c.blob(x, yy, r, r * 0.9, 12, 0.1), 0.6, 4), shade(C.terracotta, -0.2)).x(c.ribbon(c.arc(x, yy, r * 0.55, r * 0.5, 0, PI * 2, 14), 1.6), shade(C.terracotta, -0.45), 'opacity=".6"');
  wax(-SR - 40, y - 30, 11);
  wax(SR + 40, y - 30, 11);
  wax(0, y + 3, 17);
  return s.out();
}
/** a broken half of the seal (for the quake) */
export function sealBit(c, r = 12) {
  return sheet().p(c.cut([[-r, 0], [-r * 0.6, -r * 0.8], [r * 0.3, -r], [r * 0.1, 0], [r * 0.4, r * 0.7], [-r * 0.5, r * 0.8]], 0.4, 3), shade(C.terracotta, -0.2)).out();
}

/* ================================================================== the earthquake */
/** a jagged crack in the ground, opening from its left end (origin: left end); pose sx 0→1 */
export function crack(c, len = 260, w = 12) {
  const pts = [];
  let y = 0;
  for (let i = 0; i <= 9; i++) { pts.push([(len * i) / 9, y]); y += c.rr(-9, 9); }
  const top = pts.map(([x, yy], i) => [x, yy - w * Math.sin((i / 9) * PI) * 0.5]);
  const bot = pts.slice().reverse().map(([x, yy], i) => [x, yy + w * Math.sin(((9 - i) / 9) * PI) * 0.5]);
  let br = '';
  [2, 5, 7].forEach((i) => { const [x, yy] = pts[i]; br += c.ribbon([[x, yy], [x + c.rr(-10, 30), yy + c.rr(-20, 20)]], 2.2); });
  return `<path d="${c.poly([...top, ...bot])}" fill="${mix(C.soilDark, C.storm2, 0.3)}"/><path d="${br}" fill="${mix(C.soilDark, C.storm2, 0.3)}"/>`;
}
/** a small stone shaken loose (origin centre) */
export function pebble(c, r = 12, col = C.rock2) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.8, 9, 0.25), 0.6, 4), col).x(c.ribbon(c.arc(0, 0, r * 0.7, r * 0.5, PI * 1.1, PI * 1.5, 5), 1.4), shade(col, 0.25), 'opacity=".6"').out();
}
/** quake lines: short curved strokes either side of something shaking (origin centre) */
export function shakeLines(c, r = 40, col = C.cream) {
  let d = '';
  [-1, 1].forEach((s) => { for (let i = 0; i < 3; i++) d += c.ribbon(c.arc(0, 0, r + i * 10, r + i * 10, (s > 0 ? 0 : PI) - 0.35, (s > 0 ? 0 : PI) + 0.35, 6), 2.4 - i * 0.5); });
  return `<path d="${d}" fill="${col}"/>`;
}
/** a six-pointed paper snowflake (origin centre) */
export function flake(c, r = 9, col = '#ffffff') {
  let d = '';
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; d += c.ribbon([[0, 0], [Math.cos(a) * r, Math.sin(a) * r]], 1.8) + c.ribbon([[Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55], [Math.cos(a + 0.5) * r * 0.85, Math.sin(a + 0.5) * r * 0.85]], 1.2) + c.ribbon([[Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55], [Math.cos(a - 0.5) * r * 0.85, Math.sin(a - 0.5) * r * 0.85]], 1.2); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** a sheet of snowflakes spread over a box (one cut-out) */
export function snowField(c, { x0, x1, y0, y1, n = 60 }) {
  let out = '';
  for (let i = 0; i < n; i++) out += `<g transform="translate(${c.rr(x0, x1).toFixed(0)} ${c.rr(y0, y1).toFixed(0)}) rotate(${c.rr(0, 60).toFixed(0)}) scale(${c.rr(0.8, 1.6).toFixed(2)})">${flake(c, 9, c.chance(0.5) ? '#ffffff' : '#e8eef2')}</g>`;
  return out;
}
/** a spray of lightning bolts from a centre (origin centre) */
export function boltCrown(c, n = 6, len = 220) {
  let out = '';
  for (let i = 0; i < n; i++) { const a = -90 + (i - (n - 1) / 2) * (300 / n); out += `<g transform="rotate(${a.toFixed(0)}) translate(0 -${(len * 0.35).toFixed(0)}) rotate(180)">${lightning(c, len * c.rr(0.7, 1))}</g>`; }
  return out;
}

/* ================================================================== the soldiers lying "like dead men" */
/** a spear lying on the ground (origin centre) */
export function spearLying(c, len = 250) {
  return `<path d="${c.ribbon([[-len / 2, 0], [len / 2, -2]], 3.4)}" fill="${C.wood2}"/><path d="${c.poly([[len / 2, -7], [len / 2 + 24, -2], [len / 2, 3]])}" fill="${C.rock3}"/>`;
}
/** a Roman helmet rolled off (origin centre) */
export { romanHelmet as helmet } from '../mark15/lib.js';

/* ================================================================== signs & small things */
/** a small open doorway in the rock (for maps and bubbles): the empty tomb (origin: foot) */
export function emptyTomb(c, r = 1) {
  const s = sheet();
  s.p(c.cut([[-40 * r, 0], [-36 * r, -30 * r], [-20 * r, -48 * r], [16 * r, -50 * r], [38 * r, -30 * r], [44 * r, 0]], 0.5, 5), C.rock);
  s.p(c.cut([[-12 * r, 0], [-12 * r, -18 * r], ...c.arc(0, -18 * r, 12 * r, 12 * r, PI, 2 * PI, 8), [12 * r, -18 * r], [12 * r, 0]], 0.3, 4), C.lampGlow);
  s.p(c.cut(c.circ(30 * r, -13 * r, 13 * r, 16), 0.4, 3), C.rock2);
  return s.out();
}
/** a tiny angel on a speech bubble (for the soldiers' report): a white figure with wings (origin: centre) */
export function angelIcon(c, r = 1) {
  const s = sheet();
  s.p(c.cut([[-26 * r, -2 * r], [-40 * r, -26 * r], [-18 * r, -18 * r]], 0.3, 3) + c.cut([[26 * r, -2 * r], [40 * r, -26 * r], [18 * r, -18 * r]], 0.3, 3), '#f4efe2');
  s.p(c.cut([[-10 * r, 20 * r], [-7 * r, -10 * r], [7 * r, -10 * r], [10 * r, 20 * r]], 0.3, 3), '#fffdf6');
  s.p(c.cut(c.circ(0, -17 * r, 7 * r, 12), 0.2, 3), C.skin);
  return `<circle r="${30 * r}" fill="url(#halo-glow)"/>${s.out()}`;
}
/** a small zig-zag "quake" glyph (origin centre) */
export function quakeGlyph(c, w = 40, col = C.terracotta) {
  return `<path d="${c.ribbon([[-w / 2, 4], [-w / 4, -8], [0, 6], [w / 4, -8], [w / 2, 4]], 3)}" fill="${col}"/>`;
}
/** a bag of silver, tied at the neck, with coins spilling (origin: bottom centre) */
export function silverBag(c, r = 1, col = mix(C.leather, C.clay, 0.3)) {
  const s = sheet();
  s.p(c.cut([[-8 * r, -36 * r], [8 * r, -36 * r], [12 * r, -28 * r], [24 * r, -18 * r], [28 * r, -4 * r], [20 * r, 0], [-20 * r, 0], [-28 * r, -4 * r], [-24 * r, -18 * r], [-12 * r, -28 * r]], 0.5, 4), col);
  s.p(c.cut([[-10 * r, -42 * r], [-4 * r, -36 * r], [4 * r, -36 * r], [10 * r, -42 * r], [0, -39 * r]], 0.3, 3), col);
  s.p(c.ribbon([[-9 * r, -34 * r], [9 * r, -34 * r]], 3 * r), C.rope);
  s.x(c.ribbon(c.arc(0, -14 * r, 14 * r, 8 * r, 0.4, PI - 0.4, 6), 1.2 * r), shade(col, 0.3), 'opacity=".6"');
  return s.out();
}
/** a silver coin (origin centre) */
export function silver(c, r = 8) {
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.2, 3), '#d9dcd6').x(c.ribbon(c.arc(0, 0, r * 0.62, r * 0.62, 0, PI * 2, 12), 1.2), '#aab1ad', 'opacity=".8"').x(c.poly(c.ell(-r * 0.3, -r * 0.35, r * 0.25, r * 0.15, 6, -0.6)), '#fff', 'opacity=".6"').out();
}
/** a grey whisper slip: a crumpled scrap with scribbles (origin centre) */
export function rumourSlip(c, w = 34) {
  const s = sheet();
  const col = mix(C.storm, C.stone2, 0.35);
  s.p(c.cut([[-w / 2, -w * 0.3], [0, -w * 0.36], [w / 2, -w * 0.28], [w / 2 + 2, w * 0.3], [0, w * 0.34], [-w / 2 - 1, w * 0.28]], 0.8, 4), col);
  s.x(c.ribbon([[-w * 0.36, -w * 0.08], [w * 0.3, -w * 0.1]], 1.6) + c.ribbon([[-w * 0.32, w * 0.12], [w * 0.22, w * 0.1]], 1.6), C.cream, 'opacity=".7"');
  return s.out();
}
/** a whisper: a small grey curl from a mouth (origin at the mouth) */
export function whisper(c, col = mix(C.storm, C.stone2, 0.3)) {
  const pts = c.cbez([0, 0], [14, -10], [26, 6], [40, -4], 12);
  return `<path d="${c.ribbon(pts, (u) => 3.2 - u * 2)}" fill="${col}"/><path d="${c.ribbon(pts.map(([x, y]) => [x + 4, y + 10]), (u) => 2.6 - u * 1.8)}" fill="${col}" opacity=".7"/>`;
}
/** the day and night disc: the sun on one face, the moon and stars on the other (origin centre) */
export function dayNightDisc(c, r = 44) {
  const d = sheet().p(c.cut(c.circ(0, 0, r + 5, 30), 0.4, 4), C.wood3).p(c.cut(c.circ(0, 0, r, 30), 0.3, 4), mix(C.skyBlue, C.cream, 0.4));
  d.p(c.cut(c.circ(0, 0, r * 0.46, 22), 0.3, 3), C.sun);
  let ry = '';
  for (let i = 0; i < 10; i++) { const a = (i / 10) * PI * 2; ry += c.poly([[Math.cos(a - 0.12) * r * 0.52, Math.sin(a - 0.12) * r * 0.52], [Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8], [Math.cos(a + 0.12) * r * 0.52, Math.sin(a + 0.12) * r * 0.52]]); }
  d.x(ry, C.sunDeep);
  const n = sheet().p(c.cut(c.circ(0, 0, r + 5, 30), 0.4, 4), C.wood3).p(c.cut(c.circ(0, 0, r, 30), 0.3, 4), C.indigo);
  n.p(c.cut([...c.arc(-4, 0, r * 0.42, r * 0.42, PI * 0.35, PI * 1.65, 12), ...c.arc(r * 0.08, -r * 0.04, r * 0.34, r * 0.36, PI * 1.5, PI * 0.5, 12)], 0.3, 3), C.moon);
  n.x(c.poly(c.star(r * 0.5, -r * 0.4, 5, 2, 4, 0)) + c.poly(c.star(r * 0.4, r * 0.45, 4, 1.6, 4, 0)) + c.poly(c.star(-r * 0.5, r * 0.45, 3.6, 1.4, 4, 0)), C.star);
  return { day: d.out(), night: n.out() };
}

/* ================================================================== the whole earth */
/**
 * The great curve of the earth rising behind the mountain: one cut-out (origin at the centre of the circle).
 * r: radius. The top of the curve is at y = -r.
 */
export function earthCurve(c, r = 1400) {
  const s = sheet();
  s.p(c.cut(c.arc(0, 0, r, r, PI, 2 * PI, 90).concat([[r, r * 0.2], [-r, r * 0.2]]), 1, 12), mix(C.lake2, C.skyBlue2, 0.2));
  // continents seen round the curve
  const land = [[-0.62, 0.3, 0.2], [-0.3, 0.1, 0.22], [0.12, 0.06, 0.2], [0.5, 0.22, 0.24], [0.8, 0.5, 0.12], [-0.85, 0.55, 0.1]];
  let d = '', d2 = '';
  land.forEach(([u, depth, w]) => {
    const a = PI * 1.5 + u * 1.2, rr = r * (1 - depth * 0.1);
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    d += c.cut(c.blob(x, y + r * 0.05, r * w * 0.5, r * 0.045, 14, 0.3), 1, 8);
    d2 += c.cut(c.blob(x + r * w * 0.1, y + r * 0.05, r * w * 0.2, r * 0.018, 10, 0.3), 0.8, 6);
  });
  s.p(d, mix(C.sage, C.hillMid, 0.3)).x(d2, C.ochre, 'opacity=".45"');
  s.x(c.ribbon(c.arc(0, 0, r - 8, r - 8, PI * 1.12, PI * 1.88, 60), 6), '#fffaf0', 'opacity=".55"');
  return s.out();
}
/** a path of light (a stroked line drawn by t): returns markup; set stroke-dashoffset 1→0 */
export function lightRoad(pts, { w = 6, col = C.halo, o = 0.9 } = {}) {
  const d = 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
  return `<path d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${o}"/>`;
}
/** people of one nation (a little group, drawn as one piece): dress colours and head-cover per nation */
export const NATIONS = [
  { robe: C.terracotta, mantle: C.sun, skin: C.skin4, hair: C.hair3, hairStyle: 'wrap', veil: C.sun, veil2: C.terracotta },
  { robe: C.dustyBlue, mantle: C.linen, skin: C.skin, hair: C.wheat2, hairStyle: 'short' },
  { robe: C.tealRobe, mantle: C.ochre, skin: C.skin3, hair: C.hair3, hairStyle: 'curly' },
  { robe: C.plumRobe, mantle: C.roseRobe, skin: C.skin2, hair: C.hair, hairStyle: 'veil', veil: C.roseRobe, veil2: shade(C.roseRobe, -0.14) },
  { robe: C.ochreRobe, mantle: C.clay, skin: C.skin4, hair: C.hair3, hairStyle: 'bald' },
  { robe: C.sageRobe, mantle: C.wheatRobe, skin: C.skin2, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, veil2: C.stone2 },
  { robe: C.mauve, mantle: C.lavender, skin: C.skin, hair: C.greyHair, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14) },
  { robe: C.clayMantle, mantle: C.teal2, skin: C.skin3, hair: C.hair, hairStyle: 'short' },
];
export function nationGroup(c, i, { n = 3, flip = false, s = 1 } = {}) {
  const base = NATIONS[i % NATIONS.length];
  const mem = [];
  for (let k = 0; k < n; k++) {
    const woman = (k + i) % 3 === 1;
    const o = { ...base, beard: woman ? 'none' : c.pick(['short', 'full', 'none']), robe: k % 2 ? shade(base.robe, 0.12) : base.robe, belt: c.chance(0.4) ? C.leather : null };
    if (woman) { o.hairStyle = 'veil'; o.veil = o.veil || base.mantle; o.veil2 = shade(o.veil, -0.14); }
    if (k === n - 1 && n > 2) Object.assign(o, { scale: 0.7 });
    mem.push({ x: (k - (n - 1) / 2) * 30 + c.rr(-4, 4), y: (k % 2) * 6, s: k === n - 1 && n > 2 ? 0.66 : 1, flip, o });
  }
  return mem.sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${((m.flip ? -1 : 1) * m.s * s).toFixed(3)} ${(m.s * s).toFixed(3)})">${person(c, m.o)}</g>`).join('');
}

/* ================================================================== the road back to the city */
/**
 * The morning road from the garden to Jerusalem: the city on the far left, the garden rock small on the right, the road
 * winding across. Adds its layers after the sky; returns { hangL, far, mid, ground, P, front, fg, gy, city }.
 */
export function roadSet(S, { cityX = 250, tombX = 1500, flowersOn = true } = {}) {
  const c = S.c;
  const far = S.layer({ par: 0.08, sh: 2 });
  const h1 = band(c, { y: 480, amps: [16, 7, 3], lens: [1000, 340, 120], color: C.hillFar });
  far.add(h1.markup);
  const city = far.add(`<g>${walledCity(c, cityX, h1.fn(cityX) + 10, 1.5)}</g>`);
  // the garden rock with its open doorway, far off on the right
  far.add(`<g transform="translate(${tombX} ${h1.fn(tombX) + 26}) scale(.8)">${emptyTomb(c, 1.4)}</g>`);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 560, amps: [16, 7, 3], lens: [900, 300, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 24 });
  mid.add(h2.markup + olive(c, 1180, h2.fn(1180) + 6, 0.7) + cypress(c, 360, h2.fn(360) + 4, 110, C.moss2));
  const ground = S.layer({ par: 0.5, sh: 3 });
  const gy = c.wave(660, [6, 2], [800, 220]);
  const gs = sheet();
  gs.p(c.ridge(gy, -1400, 2800, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4));
  const road = c.cbez([2400, 1000], [1400, 700], [600, 800], [-900, 700], 50);
  gs.p(c.ribbon(road, 150, 3), C.sand);
  gs.x(c.ribbon(road.map(([x, y]) => [x, y + 10]), 70, 2), C.sand2, 'opacity=".45"');
  ground.add(gs.out());
  ground.add(olive(c, -60, 690, 1.2) + olive(c, 1620, 700, 1.3) + cypress(c, 150, 680, 170) + cypress(c, 1420, 676, 160) + bush(c, 420, 690, 90, C.sage, C.moss) + bush(c, 1230, 690, 80, C.moss, C.sage));
  ground.add(grass(c, { x0: -1200, x1: 2600, y: 660, fn: gy, n: 70, h: 16, color: C.moss }));
  if (flowersOn) ground.add(flowers(c, { x0: -600, x1: 2200, y: 700, fn: (x) => gy(x) + c.rr(10, 50), n: 40, h: 20 }));
  const P = S.layer({ par: 0.52, sh: 5 });
  const front = S.layer({ par: 0.54, sh: 5 });
  const fg = S.layer({ par: 0.9, sh: 6 });
  fg.add(bush(c, -120, 1000, 260, C.moss, C.sage) + bush(c, 1720, 1000, 240, C.moss2, C.sage) + grass(c, { x0: -800, x1: 300, y: 975, n: 24, h: 46, color: C.moss2 }) + grass(c, { x0: 1300, x1: 2400, y: 975, n: 24, h: 46, color: C.moss2 }) + flowers(c, { x0: 80, x1: 340, y: 975, n: 10, h: 40 }) + flowers(c, { x0: 1260, x1: 1520, y: 975, n: 10, h: 40 }));
  return { far, mid, ground, P, front, fg, gy, city, road };
}
/** the y of the road's middle at x (the road set's curve, sampled) */
export function roadY(road, x) {
  let best = road[0];
  for (const p of road) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
  return best[1];
}

/* ================================================================== the story they were paid to tell */
/**
 * The lie, as a grey painted flat with a torn edge: the sealed tomb at night, the soldiers asleep ("zzz"), two dark
 * figures creeping off with a bundle. Everything in dull grey-violet: it is a made-up picture. Origin: top centre.
 * Returns markup (w × h).
 */
export function lieFlat(c, { w = 440, h = 270 } = {}) {
  const bg = mix(C.storm, C.stone2, 0.35), ink = mix(C.storm2, C.night, 0.35), mid = mix(C.storm, C.duskViolet, 0.25);
  const s = sheet();
  // torn paper, a little crooked
  const pts = [];
  for (let x = -w / 2; x <= w / 2; x += 22) pts.push([x, c.rr(-3, 3)]);
  for (let y = 0; y <= h; y += 24) pts.push([w / 2 + c.rr(-4, 4), y]);
  for (let x = w / 2; x >= -w / 2; x -= 18) pts.push([x, h + c.rr(-7, 7)]);
  for (let y = h; y >= 0; y -= 24) pts.push([-w / 2 + c.rr(-4, 4), y]);
  s.p(c.cut(pts, 0.8, 8), bg);
  s.p(c.cut([[-w / 2 + 6, h * 0.72], [w / 2 - 6, h * 0.7], [w / 2 - 6, h - 8], [-w / 2 + 6, h - 8]], 0.6, 10), mid);
  // the tomb, shut, on the right
  s.p(c.cut([[w * 0.05, h * 0.74], [w * 0.1, h * 0.4], [w * 0.24, h * 0.28], [w * 0.42, h * 0.32], [w * 0.49, h * 0.74]], 0.8, 8), mix(C.rock3, C.storm2, 0.5));
  s.p(c.cut(c.circ(w * 0.27, h * 0.6, h * 0.14, 20), 0.5, 5), mix(C.rock2, C.storm2, 0.55));
  // a crescent moon, three stars
  s.x(c.poly([...c.arc(-w * 0.34, h * 0.18, 18, 18, PI * 0.35, PI * 1.65, 12), ...c.arc(-w * 0.32, h * 0.17, 14, 15, PI * 1.5, PI * 0.5, 12)]), mix(C.moon, C.stone2, 0.4));
  s.x(c.poly(c.star(-w * 0.1, h * 0.12, 4, 1.6, 4, 0)) + c.poly(c.star(w * 0.06, h * 0.2, 3.4, 1.4, 4, 0)) + c.poly(c.star(w * 0.36, h * 0.1, 4, 1.6, 4, 0)), mix(C.star, C.stone2, 0.4));
  let out = s.out();
  // the soldiers asleep, sitting slumped by the tomb
  const sleeper = (x, fl) => `<g transform="translate(${x} ${h * 0.8}) scale(${fl ? -0.42 : 0.42} 0.42)">${shadowP(c, { robe: ink, pose: 'sit', hairStyle: 'short' }, ink)}</g>`;
  out += sleeper(w * 0.02, false) + sleeper(w * 0.4, true);
  out += `<g transform="translate(${w * 0.07} ${h * 0.45}) scale(.8)">${zzz14(c, mix(C.stone, C.storm, 0.2))}</g>`;
  // two creeping figures carrying a bundle between them, off to the left
  const creep = (x) => `<g transform="translate(${x} ${h * 0.86}) rotate(-14) scale(-0.5 0.5)">${shadowP(c, { robe: ink, hairStyle: 'wrap', veil: ink }, ink)}</g>`;
  out += creep(-w * 0.42) + creep(-w * 0.13);
  out += `<path d="${c.cut(c.blob(-w * 0.27, h * 0.86 - 66, 58, 13, 14, 0.12), 0.6, 4)}" fill="${mix(ink, C.stone2, 0.25)}"/>`;
  return `<g transform="rotate(-1.5)">${out}</g>`;
}

/* ================================================================== the mountain in Galilee */
export const KX = 800;                      // the knoll where He stands
export const SPRING = ['#c9e0da', '#eef0d8', '#f8ecd0'];
/**
 * Matthew 6's mountain of the Sermon over the lake (John 6's hill), rebuilt so the world can open up behind it:
 * sky, a heaven sky and a glory sky (both faded out, created with rise 0), the hanging layer, then — behind the far
 * hills — the curve of the whole earth and its nations (hidden until the hills are drawn away), then the far hills,
 * the lake, the middle hills, the slope and the ground with the knoll.
 * Returns { hangL, sunEl, clouds, heaven, glorySky, earthL, far, lake, mid, slopeL, G, gfn, sfn, back: [far, lake, mid, slopeL] }.
 */
export function galileeMount(S, { skyCols = SPRING, sunAt = [1220, 160] } = {}) {
  const c = S.c;
  sky(S, skyCols);
  const heaven = sky(S, HEAVEN, { name: 'heaven', rise: 0 }).layer;
  const glorySky = sky(S, GLORY, { name: 'glory', rise: 0 }).layer;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const clouds = [[560, 215, 200], [1030, 190, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 800 }), x, y, i }));
  const earthL = S.layer({ par: 0.12, sh: 4, rise: 0 });
  const far = S.layer({ par: 0.08, sh: 2, pad: 200 });
  const fb = band(c, { y: 392, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup);
  far.add(town(c, { x: 330, y: fb.fn(330) + 14, n: 7, spread: 240, sc: 0.42 }));
  const lake = S.layer({ par: 0.1, sh: 1, pad: 200 });
  lake.add(waterBand(c, { y: 418, color: mix(C.lake, C.skyBlue, 0.25), foamN: 18, bottom: 900 }).markup);
  const mid = S.layer({ par: 0.16, sh: 3, pad: 200 });
  mid.add(hillsWith(c, { y: 486, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 }).markup);
  const slopeL = S.layer({ par: 0.3, sh: 3, pad: 200 });
  const sfn = c.wave(560, [9, 4], [760, 240]);
  slopeL.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.22)).out());
  slopeL.add(olive(c, 170, 590, 0.8) + olive(c, 1460, 600, 0.85) + cypress(c, 1320, 580, 110));
  const G = S.layer({ par: 0.5, sh: 3 });
  const gfn0 = c.wave(700, [5, 2], [700, 180]);
  const gfn = (x) => gfn0(x) - Math.max(0, 1 - Math.abs(x - KX) / 260) ** 2 * 34;
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 10, 1), mix(C.sage2, C.hillNear, 0.5)).out());
  G.add(rock(c, KX - 10, gfn(KX) + 16, 150, 44, C.rock2) + rock(c, KX + 150, gfn(KX + 150) + 14, 70, 26, C.rock));
  G.add(grass(c, { x0: -800, x1: 2400, y: 700, fn: gfn, n: 50, h: 14, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: 700, fn: gfn, n: 14 }));
  return {
    hangL, sunEl, clouds, heaven, glorySky, earthL, far, lake, mid, slopeL, G, gfn, sfn, back: [far, lake, mid, slopeL],
    update(time, { sunX = sunAt[0], sunY = sunAt[1], o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: time ? Math.sin(time * 0.6) : 0, o });
      clouds.forEach((cl) => pose(cl.el, { x: cl.x + (time ? Math.sin(time * 0.1 + cl.i) * 24 : 0), y: cl.y, r: time ? Math.sin(time * 0.6 + cl.i) * 1.2 : 0, o }));
    },
  };
}
/** where the Eleven stand (and kneel) round the knoll: [x, dy below the ground line] */
/** the three who hang back, doubting (never named) */
export const DOUBT = [4, 9, 10];
export const RING = [[652, 40], [572, 70], [492, 36], [410, 72], [330, 40], [948, 40], [1028, 70], [1108, 36], [1190, 72], [1270, 40], [1350, 70]];
export { sheet, mix, shade };
export { question } from '../mark3/lib.js';
