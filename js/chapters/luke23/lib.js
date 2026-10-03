// Luke 23 — the Passion as Luke tells it. The sets and cut-outs of Mark 15, John 19 and Matthew 27 are reused
// (Pilate's hall, the square with Barabbas' cell, Golgotha from afar and near, the hour-dial, the veil, the
// soldiers, the women, the tomb in the rock) so all the Gospels look alike. Luke's own pieces live here: Herod's
// hall in Jerusalem (Mark 6's Herod, his crown and throne) with his guard, the gleaming robe, the map of the land
// from Galilee to Jerusalem, the road out of the city where the daughters of Jerusalem weep, the good thief's
// garden of light, and the room where the women rest on the Sabbath.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, hillsWith, olive, bush, rock, grass, town } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { tr } from '../../core/i18n.js';
import { LOOK as L6, crown as herodCrownM, helmet as helmetM, throne, portrait } from '../mark6/lib.js';
import { MAGD, MARYJ, SALOME, WOMEN, landMap, mapRoad, MAP, upperRoom, ROOM, spiceJar, scent } from '../mark16/lib.js';
import { pose3 } from '../matthew4/lib.js';
import { addToHead, addToBody } from '../mark2/lib.js';
import { column } from '../mark1/lib.js';
import { cityWall, skullHill, farCity, candle, SKIES } from '../mark15/lib.js';

export * from '../matthew27/lib.js';
export { throne, portrait, pose3, landMap, mapRoad, MAP, upperRoom, ROOM, spiceJar, scent, MAGD, MARYJ, SALOME, WOMEN };

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== the cast */

/** Herod Antipas as Mark 6 and Luke 9 drew him, and his crown (head coords) */
export const HEROD = L6.herod;
export const herodCrown = (c) => herodCrownM(c);
/** Herod's own guard: Mark 6's guard with his helmet (not Roman soldiers) */
export const HGUARD = [
  L6.guard,
  { ...L6.guard, robe: mix(C.storm, C.dustyBlue, 0.4), mantle: C.plumRobe, skin: C.skin2, hair: C.hair, beard: 'none' },
  { ...L6.guard, robe: mix(C.clay, C.storm, 0.4), mantle: C.ochre, skin: C.skin4, beard: 'full' },
];
export function hguard(c, i = 0, extra = {}) {
  return addToHead(person(c, { ...HGUARD[i % HGUARD.length], ...extra }), helmetM(c));
}
/** the two criminals led out with Him (the good one on His right — our left) */
export const THIEF_L = { robe: mix(C.soil, C.rock2, 0.5), hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope };
export const THIEF_R = { robe: mix(C.clay, C.soil, 0.5), hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin4, belt: C.rope };

/** the gleaming robe Herod puts on Him in mockery: white, with a gold hem and glints */
export const GLEAM = '#fbf6e4';
export function gleamRobe(c, w = 1) {
  const s = sheet();
  s.p(c.cut([[-40, 0], [40, -4], [58, 40], [66, 120], [40, 150], [0, 142], [-40, 150], [-64, 118], [-56, 40]].map(([x, y]) => [x * w, y]), 0.9, 7), GLEAM);
  s.x(c.ribbon([[-20 * w, 10], [-26 * w, 138]], 2.4) + c.ribbon([[18 * w, 8], [26 * w, 136]], 2.4), C.linen2, 'opacity=".8"');
  s.p(c.ribbon([[-62 * w, 120], [-40 * w, 146], [0, 138], [40 * w, 146], [62 * w, 118]], 5), C.sun);
  let gl = '';
  [[-30, 40], [22, 60], [-8, 100], [36, 110], [-40, 88]].forEach(([x, y]) => { gl += c.poly(c.star(x * w, y, 6, 1.8, 4, 0)); });
  s.x(gl, C.sun);
  return s.out();
}
/** Jesus in the gleaming robe (the mantle white and gold) */
export const JESUS_GLEAM = { ...CAST.jesus, mantle: mix(C.linen, C.sun, 0.3), mantleArm: true };

/* ================================================================== Herod's hall in Jerusalem */

export const HALL = { floor: 690, throne: [1130, 660], windows: [[470, 214, 520], [800, 190, 520], [1130, 214, 520]] };
/**
 * Herod's hall in Jerusalem (Mark 6 / Luke 9's plum frieze with its gold squares, the throne on its dais, candles).
 * Through the three tall windows the city: Jerusalem's roofs and the white sanctuary on its hill.
 * returns { sk, view, wall, floorL, props, candles:[{flame, glow}], charL, backL, fxL, fgL }
 * throneAt: [x, y] of the throne (default HALL.throne)
 */
export function herodHall(S, { pal = ['#aec6cf', '#e2d9c4', '#eed6b2'], throneAt = HALL.throne } = {}) {
  const c = S.c;
  const sk = sky(S, pal);
  const view = S.layer({ par: 0.1, sh: 1 });
  view.add(band(c, { y: 440, amps: [14, 6, 2], lens: [700, 260, 100], color: mix(C.hillFar, C.stone2, 0.3) }).markup);
  view.add(band(c, { y: 486, amps: [8, 4, 2], lens: [600, 220, 90], color: mix(C.hillMid, C.stone2, 0.35) }).markup);
  view.add(`<g transform="translate(800 468)">${farCity(c, 0.95, { col: mix(C.stone, C.dawn, 0.25) })}</g>`);
  view.add(town(c, { x: 360, y: 486, n: 6, spread: 240, sc: 0.5 }) + town(c, { x: 1240, y: 486, n: 6, spread: 240, sc: 0.5 }));
  const wall = S.layer({ par: 0.2, sh: 3 });
  const W = sheet();
  const holes = HALL.windows.map(([x, top, sill]) => { const r = x === 800 ? 92 : 70; return c.hole([[x - r, sill], [x - r, top + r], ...c.arc(x, top + r, r, r, PI, 2 * PI, 14), [x + r, sill]], 0.5, 6); }).join('');
  W.p(c.cut([[-1200, -1400], [2800, -1400], [2800, HALL.floor - 30], [-1200, HALL.floor - 30]], 1, 30) + holes, mix(C.stone, C.dawn, 0.3));
  let blocks = '';
  for (let y = -200; y < HALL.floor - 40; y += 52) for (let x = -1200 + (Math.round(y / 52) % 2 ? 70 : 0); x < 2800; x += 140) {
    if (HALL.windows.some(([wx, top, sill]) => x + 130 > wx - 104 && x < wx + 104 && y + 44 > top - 10 && y < sill + 14)) continue;
    blocks += c.cut(c.rect(x + c.rr(0, 6), y, c.rr(110, 128), 44), 0.6, 10);
  }
  W.x(blocks, shade(C.stone, -0.05), 'opacity=".4"');
  let fr = '';
  for (let x = -1100; x < 2700; x += 40) fr += c.cut(c.rect(x, 110, 20, 20), 0.2, 4);
  W.p(c.cut([[-1200, 102], [2800, 102], [2800, 138], [-1200, 138]], 0.4, 20), C.plumRobe).p(fr, C.sun);
  HALL.windows.forEach(([x, top, sill]) => { const r = x === 800 ? 92 : 70; W.p(c.cut([[x - r - 16, sill], [x + r + 16, sill], [x + r + 22, sill + 14], [x - r - 22, sill + 14]], 0.4, 8), shade(C.stone2, -0.04)); });
  wall.add(W.out());
  // plum hangings between the windows
  let hg = '';
  [300, 635, 965, 1300].forEach((x) => { hg += c.cut([[x - 26, 138], [x + 26, 138], [x + 22, 420], [x, 440], [x - 22, 420]], 0.5, 8); });
  wall.add(sheet().p(hg, shade(C.plumRobe, -0.1)).x([300, 635, 965, 1300].map((x) => c.poly(c.star(x, 300, 12, 5, 6, 0))).join(''), C.sun).out());
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const F = sheet();
  const Y = HALL.floor;
  F.p(c.cut([[-1200, Y - 34], [2800, Y - 34], [2800, 1700], [-1200, 1700]], 0.6, 30), mix(C.stone, C.sand, 0.3));
  let chk = '';
  for (let y = Y - 14; y < 1150; y += 44) for (let x = -700 + (Math.round(y / 44) % 2) * 50; x < 2300; x += 100) chk += c.poly([[x, y], [x + 50, y], [x + 50, y + 22], [x, y + 22]]);
  F.x(chk, mix(C.plumRobe, C.stone, 0.6), 'opacity=".33"');
  floorL.add(F.out());
  const props = S.layer({ par: 0.44, sh: 4 });
  const [TX, TY] = throneAt;   // a phone may pass the throne nearer the middle
  const D = sheet();
  D.p(c.cut([[TX - 130, TY], [TX + 150, TY], [TX + 164, TY + 22], [TX - 144, TY + 22]], 0.5, 8), shade(C.stone2, -0.05));
  D.p(c.cut([[TX - 150, TY + 22], [TX + 170, TY + 22], [TX + 178, TY + 40], [TX - 158, TY + 40]], 0.5, 8), C.stone2);
  D.p(c.cut([[TX - 162, TY + 40], [TX + 182, TY + 40], [TX + 188, TY + 50], [TX - 166, TY + 50]], 0.4, 8), C.plumRobe);
  props.add(D.out());
  props.add(`<g transform="translate(${TX + 6} ${TY}) scale(1.08)">${throne(c)}</g>`);
  const candles = [[TX - 112, TY + 22], [TX + 136, TY + 22]].map(([x, y], i) => {
    const el = props.add(`<g transform="translate(${x} ${y}) scale(1.4)">${candle(c, 60)}</g>`);
    return { el, flame: el.querySelector('.flame'), glow: el.querySelector('.glow'), i };
  });
  const backL = S.layer({ par: 0.5, sh: 5 });
  const charL = S.layer({ par: 0.55, sh: 5 });
  const fxL = S.layer({ par: 0.58, sh: 4 });
  const fgL = S.layer({ par: 0.9, sh: 8 });
  fgL.add(sheet().p(c.cut([[-1200, -1400], [2800, -1400], [2800, 50], [-1200, 60]], 0.8, 16), shade(C.plumRobe, -0.2)).x(c.ribbon([[-1200, 46], [2800, 42]], 6), C.sun).out());
  fgL.add(column(c, -130, 1100, 1300, 90, shade(C.stone, -0.04)) + column(c, 1730, 1100, 1300, 90, shade(C.stone, -0.04)));
  return { sk, view, wall, floorL, props, candles, backL, charL, fxL, fgL };
}
/** candle flicker for herodHall (k: 0 out → 1 lit) */
export function candleSet(cd, k, time) {
  const f = 1 + (time ? Math.sin(time * 9 + cd.i * 2) * 0.08 : 0);
  pose(cd.flame, { x: 0, y: -80, sx: k / f + 0.001, sy: k * f + 0.001, o: k > 0.02 ? 1 : 0 });
  if (cd.glow) pose(cd.glow, { o: k * 0.3 });
}

/* ================================================================== the road out of the city */

export const RGY = 676;   // the road's walking line
/**
 * Outside the city gate (Mark 15's road to Golgotha): grey clouds on the fly-lines, the far hills, the bare hill
 * small in the distance, fields, the city wall with its gate on the left, the road.
 * returns { sk, hangL, clouds, golL, fields, wallL, groundL, P, P2, fx, fg }
 */
export function roadSet(S, { pal = SKIES.storm } = {}) {
  const c = S.c;
  const sk = sky(S, pal);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const clouds = [[420, 170, 260], [900, 120, 200], [1320, 190, 240]].map(([x, y, w], i) => ({ x, y, el: hanging(hangL, sheet().p(c.cut(c.blob(0, 0, w / 2, w * 0.16, 14, 0.2), 1, 8), i === 1 ? C.storm : mix(C.storm, C.stone2, 0.4)).out(), { x, y, len: 700 }) }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 8, 3], lens: [900, 320, 120], color: mix(C.hillFar, C.stone2, 0.3) }).markup);
  const golL = S.layer({ par: 0.15, sh: 3 });
  golL.add(`<g transform="translate(1060 392)">${skullHill(c, { w: 460, h: 150 })}</g>`);
  const fields = S.layer({ par: 0.2, sh: 3 });
  const fh = hillsWith(c, { y: 500, amps: [10, 5, 2], lens: [800, 280, 100], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 20 });
  fields.add(fh.markup);
  let rows = '';
  for (let i = 0; i < 9; i++) { const x0 = 1060 + i * 70; rows += c.ribbon([[x0, fh.fn(x0) + 4], [x0 + 150, 560]], 14); }
  fields.add(sheet().x(rows, C.wheat, 'opacity=".75"').out());
  const wallL = S.layer({ par: 0.25, sh: 4 });
  wallL.add(cityWall(c, -900, 300, 340, 560, { towers: [{ x: -500 }, { x: -120 }, { x: 250, w: 60, h: 40 }], gate: { x: 110, w: 70, h: 110 } }));
  const groundL = S.layer({ par: 0.35, sh: 3 });
  const gfn = c.wave(RGY - 60, [5, 2], [800, 200]);
  groundL.add(sheet().p(c.ridge(gfn, -900, 2600, 1700, 12, 1), mix(C.sand, C.stone2, 0.3)).out());
  groundL.add(sheet().p(c.ribbon([[-900, RGY + 10], [2600, RGY + 4]], 70), mix(C.sand2, C.stone2, 0.3)).out());
  groundL.add(olive(c, 1460, RGY - 58, 0.9) + bush(c, 560, RGY - 56, 80, C.sage) + rock(c, 1700, RGY - 50, 70, 26, C.rock2) + grass(c, { x0: -600, x1: 2400, y: RGY - 60, fn: gfn, n: 30, h: 12, color: C.olive }));
  const P2 = S.layer({ par: 0.5, sh: 5 });
  const P = S.layer({ par: 0.55, sh: 5 });
  const fx = S.layer({ par: 0.58, sh: 5 });
  const fg = S.layer({ par: 0.95, sh: 7 });
  fg.add(bush(c, 60, 960, 240, C.moss) + rock(c, 1520, 980, 260, 90, C.rock2) + bush(c, 2100, 960, 200, C.moss));
  return { sk, hangL, clouds, golL, fields, wallL, groundL, P, P2, fx, fg };
}

/* ================================================================== small pieces */

/** a paper word on a cream card with a thin gold rim (origin: top centre); for spoken words hung in the air */
export function wordCard(c, lines, { size = 22, w, fill = C.cream, rim = C.haloRim, ink = C.ink, italic = true } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const ww = w || Math.max(...lines.map((l) => l.length)) * size * 0.5 + size * 1.8;
  const hh = lines.length * size * 1.2 + size * 0.8;
  const s = sheet();
  s.p(c.cut([[-ww / 2 - 5, -5], [ww / 2 + 5, -6], [ww / 2 + 6, hh + 5], [-ww / 2 - 5, hh + 6]], 0.5, 7), rim);
  s.p(c.cut([[-ww / 2, 0], [ww / 2, -1], [ww / 2 + 1, hh], [-ww / 2, hh + 1]], 0.5, 7), fill);
  const txt = lines.map((l, i) => `<text x="0" y="${(size * 1.05 + i * size * 1.2).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}"${italic ? ' font-style="italic"' : ''} fill="${ink}">${l}</text>`).join('');
  return s.out() + txt;
}
/** a crowd group baked as one cut-out (for sprites): members [{x, y, s, flip, armF, armB, head, o}] */
export const bakedGroup = (c, members) => pose3(c, members);
/** a man / a woman of the crowd (men never veiled) */
export function folkO(c, isMan = null, extra = {}) {
  const o = crowdPerson(c);
  const m = isMan === null ? o.hairStyle !== 'veil' : isMan;
  if (m && o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  if (!m) { o.hairStyle = 'veil'; o.beard = 'none'; }
  return { ...o, ...extra };
}
export { tr, FONT as FONT23, PI as PI23 };

/* ================================================================== portraits on the fly-lines */

/** a framed bust of a puppet (markup of a whole person), origin: top centre of the frame; id must be unique (S.id) */
export function bustPortrait(c, id, personMarkup, { w = 120, h = 140, bg = C.parchment, frame = C.ochre, label = '' } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 10, 0, w + 20, h + 20), 0.6, 8), frame);
  s.p(c.cut(c.rect(-w / 2, 10, w, h), 0.5, 8), bg);
  const lab = label ? `<g transform="translate(0 ${h + 26})">${wordCard(c, label, { size: 17 })}</g>` : '';
  return `${s.out()}<clipPath id="${id}"><rect x="${-w / 2}" y="10" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(-6 ${10 + h * 0.42 + 167 * (h / 120)}) scale(${h / 120})">${personMarkup}</g></g>${lab}`;
}

/** a grey card of accusation with a small picture and a short label (origin: centre) */
export function chargeCard(c, inner, label) {
  const s = sheet().p(c.cut([[-62, -52], [60, -54], [63, 50], [-61, 52]], 0.7, 7), mix(C.storm2, C.rock3, 0.35));
  s.p(c.cut([[-54, -46], [52, -47], [54, 20], [-53, 21]], 0.5, 6), mix(C.stone, C.storm, 0.3));
  return `<g>${s.out()}<g transform="translate(0 -12)">${inner}</g><text x="0" y="40" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.cream}">${label}</text></g>`;
}
/** the picture on the first accusation card: three people and a jagged spark (He stirs up the nation) */
export function stirIcon(c) {
  return `<path d="${c.cut(c.circ(-20, -6, 7, 10), 0.2, 3) + c.cut(c.circ(0, -10, 8, 10), 0.2, 3) + c.cut(c.circ(20, -6, 7, 10), 0.2, 3) + c.cut([[-32, 16], [-28, 2], [-12, 2], [-8, 16]], 0.2, 3) + c.cut([[-12, 16], [-8, -1], [8, -1], [12, 16]], 0.2, 3) + c.cut([[8, 16], [12, 2], [28, 2], [32, 16]], 0.2, 3)}" fill="${C.ink}"/><path d="${c.poly([[-6, -34], [4, -24], [-2, -22], [8, -12], [-8, -24], [-2, -26]])}" fill="${C.terracotta}"/>`;
}

/* ================================================================== the square before the praetorium */

import { squareSet, soldier as soldierM, pilate as pilateM, bonds as bondsM, handChain, priest as priestM, PLAT } from '../mark15/lib.js';
/**
 * A crowd as sprites: rows of little groups, each drawn twice — calm and crying out with raised arms — so the
 * whole crowd can rise (quick swap) without repainting anyone. returns [{ calm, loud, x, y, ri, members }]
 * (members in world coords: { x, y, s, flip, shout }).
 */
export function crowdSprites(S, L, { rows, skip = () => false, chunk = 3 } = {}) {
  const c = S.c;
  const groups = [];
  rows.forEach((r, ri) => {
    const mem = [];
    for (let i = 0; i < r.n; i++) {
      const x = lerp(r.x0, r.x1, (i + c.rr(0.2, 0.8)) / r.n);
      if (skip(x, ri)) continue;
      mem.push({ x, y: r.y + c.rr(-4, 4), s: r.s * c.rr(0.92, 1.06), flip: x > 800, o: folkO(c), shout: c.chance(0.8), sa: c.rr(0, 1) });
    }
    for (let k = 0; k < mem.length; k += chunk) {
      const part = mem.slice(k, k + chunk);
      const gx = part[0].x, gy = r.y;
      const rel = (m, loud) => ({ x: m.x - gx, y: m.y - gy, s: m.s, flip: m.flip, o: m.o, armF: loud && m.shout ? 92 + m.sa * 44 : 14 + m.sa * 10, armB: loud && m.shout ? 128 + m.sa * 30 : 8, head: loud ? -12 : -6 });
      const calm = L.sprite(pose3(c, part.map((m) => rel(m, false))), gx, gy);
      const loud = L.sprite(pose3(c, part.map((m) => rel(m, true))), gx, gy);
      groups.push({ calm, loud, x: gx, y: gy, ri, members: part, cx: part.reduce((a, m) => a + m.x, 0) / part.length });
    }
  });
  return groups;
}
/** set a sprite crowd: k 0 calm → 1 crying out (the swap is quick, no ghosting); dx(group) slides a group */
export function crowdSet(groups, k, dx = () => 0) {
  groups.forEach((g, i) => {
    const kk = k >= 0.5 ? 1 : 0;
    const x = g.x + dx(g, i);
    g.calm.set({ x, y: g.y, o: 1 - kk });
    g.loud.set({ x, y: g.y, o: kk });
  });
}
export const SQ_ROWS = [
  { y: 648, s: 0.72, n: 14, x0: 160, x1: 1440 },
  { y: 702, s: 0.86, n: 12, x0: 130, x1: 1470 },
  { y: 766, s: 1.02, n: 10, x0: 100, x1: 1500 },
];
/**
 * Mark 15's square (the platform, Barabbas' cell) with Luke's cast: Jesus in Herod's gleaming robe between two
 * soldiers, Pilate, Barabbas and two rebels behind the bars, the crowd as sprites, two chief priests in front.
 */
export function squareStage(S, { pal } = {}) {
  const c = S.c;
  const H = squareSet(S, pal ? { pal } : {});
  const P = H.charL;
  const sols = [0, 1].map((i) => S.puppet(P.add(soldierM(c, i + 2))));
  const jes = S.puppet(P.add(person(c, { ...JESUS_GLEAM, holdF: bondsM(c) })));
  const pil = S.puppet(P.add(pilateM(c)));
  const cl = H.cellIn;
  const rebels = [0, 1].map((i) => S.puppet(cl.add(person(c, { robe: [mix(C.soil, C.rock2, 0.5), mix(C.clay, C.soil, 0.5)][i], hair: C.hair3, hairStyle: i ? 'short' : 'wild', beard: 'wild', skin: [C.skin4, C.skin2][i], holdF: handChain(c) }))));
  const bar = S.puppet(cl.add(person(c, { ...L15.barabbas, holdF: handChain(c) })));
  const barFree = S.puppet(H.fxL.add(person(c, { ...L15.barabbas })));
  const crowd = crowdSprites(S, H.crowdL, { rows: SQ_ROWS, skip: (x, ri) => ri === 2 && Math.abs(x - 470) < 100 });
  const pr = [0, 1].map((i) => ({ i, p: S.puppet(H.crowdL.add(priestM(c, i))), x: [420, 520][i], y: 772 - i * 6 }));
  return { H, sols, jes, pil, rebels, bar, barFree, crowd, pr, PLAT, CELL: H.CELL };
}
import { LOOK as L15 } from '../mark15/lib.js';

/* ================================================================== the cross near, in the darkness */

import { NEAR, crossSil } from '../john19/lib.js';
/** John 19's crossNearSet with every colour sunk towards the dark (the hours of darkness) */
export function crossNearDark(S, { pal, tint = 0.6, toward = '#221f34', figure = true, farCol } = {}) {
  const c = S.c;
  const T = (col) => mix(col, toward, tint);
  const sk = sky(S, pal);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 560, amps: [14, 7, 3], lens: [900, 320, 120], color: farCol || T(mix(C.hillFar, C.stone2, 0.45)) }).markup);
  far.add(`<g transform="translate(250 566)">${farCity(c, 0.62, { col: T(mix(C.stone, C.rock, 0.3)) })}</g>`);
  const hillL = S.layer({ par: 0.2, sh: 3 });
  hillL.add(`<g transform="translate(${NEAR.x} ${NEAR.top})">${skullHill(c, { w: 1500, h: 300, col: T(mix(C.rock2, C.dune, 0.35)) })}</g>`);
  const crossL = hillL.add(`<g transform="translate(${NEAR.L[0]} ${NEAR.L[1]})">${crossSil(c, { h: NEAR.L[2], figure, col: NEAR.col })}</g>`);
  const crossR = hillL.add(`<g transform="translate(${NEAR.R[0]} ${NEAR.R[1]})">${crossSil(c, { h: NEAR.R[2], figure, col: NEAR.col })}</g>`);
  const glowL = S.layer({ par: 0.2, sh: 1, flat: true });
  const crossC = S.layer({ par: 0.2, sh: 3 }).add(`<g transform="translate(${NEAR.x} ${NEAR.top})">${crossSil(c, { h: NEAR.H, halo: true, figure, col: NEAR.col })}</g>`);
  const slope = S.layer({ par: 0.3, sh: 3 });
  const gfn = c.wave(690, [8, 3], [800, 220]);
  slope.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1.2), T(mix(C.sand2, C.rock2, 0.4))).out());
  slope.add(grass(c, { x0: -600, x1: 2300, y: 690, fn: gfn, n: 26, h: 12, color: T(mix(C.olive, C.rock3, 0.3)) }) + rock(c, 250, 700, 110, 36, T(C.rock2)) + rock(c, 1380, 704, 130, 40, T(C.rock3)));
  const P = S.layer({ par: 0.5, sh: 5 });
  const fx = S.layer({ par: 0.56, sh: 4 });
  const fg = S.layer({ par: 0.95, sh: 7 });
  fg.add(rock(c, 60, 990, 300, 110, T(C.rock2)) + bush(c, 1580, 960, 220, T(mix(C.moss, C.rock3, 0.3))) + rock(c, 1760, 990, 260, 90, T(C.rock3)));
  const hd = crossC.querySelector('.hd'), hl = crossC.querySelector('.hl');
  const u = NEAR.H / 240;
  const HDY = -NEAR.H + 52 * u - 2 * u;           // the head pivot, relative to the cross foot
  const head = [NEAR.x, NEAR.top + HDY - 11 * u];   // the head centre in world units
  return { sk, hangL, far, hillL, glowL, crossC, crossL, crossR, slope, P, fx, fg, hd, hl, HDY, head, u };
}

/* ================================================================== phone helpers */

/** on a phone, the side crosses of a near set (crossNearSet / crossNearDark) a step nearer the middle, clear of the
 *  frame and the thread; returns the side crosses' feet [[xL, yL, h], [xR, yR, h]] (NEAR's on a wide screen) */
export function nearSides(S, N, { dx = 75 } = {}) {
  if (!S.portrait) return [NEAR.L, NEAR.R];
  const L = [NEAR.L[0] + dx, NEAR.L[1], NEAR.L[2]], R = [NEAR.R[0] - dx, NEAR.R[1], NEAR.R[2]];
  pose(N.crossL, { x: L[0], y: L[1] });
  pose(N.crossR, { x: R[0], y: R[1] });
  return [L, R];
}
/** on a phone, keep a bubble whose origin is its tail tip inside the frame: the body runs w units to the
 *  side `side` (+1 right, -1 left) of x and overhangs the tail by about 0.12 w + 25 on the other side;
 *  lo/hi are the frame's edges in the bubble layer's units */
export function fitX(S, x, w, side, lo = 470, hi = 1120) {
  if (!S.portrait) return x;
  const over = 0.12 * w + 25;
  return side > 0 ? Math.max(lo + over, Math.min(hi - w, x)) : Math.max(lo + w, Math.min(hi - over, x));
}
/** on a phone, the frame's edges [lo, hi] in a layer of parallax par under the current camera (set S.cam first) */
export function frameX(S, par, { l = 325, r = 285 } = {}) {
  const zl = 1 + (S.cam.z - 1) * par, cx = 800 + S.cam.x * par;
  return [cx - l / zl, cx + r / zl];
}
/** the width of a cry() bubble (mark5's jagged bubble) from its text and size, at scale 1 */
export function cryW(lines, size) {
  lines = Array.isArray(lines) ? lines : [lines];
  return (Math.max(...lines.map((l) => l.length)) * size * 0.46 + size * 1.7) * 1.15;
}
