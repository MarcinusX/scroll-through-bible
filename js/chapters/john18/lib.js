// John 18 — the night of the arrest and the dawn of the trial. Shared cut-outs and sets for this chapter:
// the moonlit valley of the Kidron and the olive garden (continuing John 16's night path, the Eleven with their
// small lanterns), the band with torches and lanterns as dark shadow-play silhouettes, Annas' courtyard with its
// charcoal fire and the lamp-lit hall above it, and Pilate's praetorium cut open at the threshold — the leaders
// stay outside in the dawn, Jesus stands inside, Pilate goes in and out between them.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt } from '../kit.js';
import { band, hillsWith, olive, cypress, moon, stars, grass, rock } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK as LOOK3, TWELVE, withFace, faceBits } from '../mark3/lib.js';
import { walledCity, column } from '../mark1/lib.js';
import { swag as swag15, eagleStandard as eagle15, curuleSeat as seat15, dais as dais15, standLamp as lamp15, vexillum as vex15 } from '../mark15/lib.js';
import { sun as sunCut, town } from '../../assets/nature.js';
import { addToHead, addToBody, turban, breastplate, menorah } from '../mark2/lib.js';
import { LOOK as LOOK14, HP, torch, sword, club, firePit, fireFlames, hangingLamp, lampGlow, templeMini, oilLamp, guardOpts as guardOptsL } from '../mark14/lib.js';
import { lantern as lantern16 } from '../john16/lib.js';
import { soldier as soldierP, pilate as pilateP } from '../mark15/lib.js';
import { highPriest as highPriestP, priest as priestP } from '../mark14/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, scrollOpen, scrollRolled, addToHead, addToBody } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, shadowPerson, silhouette, card } from '../mark3/lib.js';
export { voiceRings, hang2, walledCity, column } from '../mark1/lib.js';
export { say, bigQuestion, glory, globe, soulLight, lightCrown, tag } from '../mark8/lib.js';
export {
  vis, torch, sword, club, cord, rooster, firePit, fireFlames, shadowHand, cupOfLight, chalice, wordTag, discPlate, templeMini, vignette,
  oilLamp, hangingLamp, lampGlow, highPriest, priest, priestOpts, guardOpts, HP, crookedScroll, seal, lamb, matzahRound, tally, table,
} from '../mark14/lib.js';
export { pilate, soldier, soldierSil, centurion, bonds as wristBonds, curuleSeat, dais, eagleStandard, vexillum, standLamp, lampSet, swag, SOLDIER, taunt, handChain } from '../mark15/lib.js';
export { lantern, lampK, fatherLight, roundPlate, panel, goldArc, at, greyCloud, paperSun } from '../john16/lib.js';
export { radiance, rayBurst, goldWord, hungWord, hungPlate, iconWord, darkSheet } from '../john1/lib.js';
export { iAm } from '../john8/lib.js';
export { balanceRig } from '../john5/lib.js';
export { peopleIcon, medallion } from '../john11/lib.js';
export { storyFrame, SEPIA } from '../mark6/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, lerp, blinkAt, fade, attr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');
/** a colour seen by moonlight */
export const nt = (col, k = 0.45) => mix(col, C.indigo, k);
/** the band's shadow-play ink */
export const INK = '#211b35';

/* ================================================================== skies */
export const NIGHT = ['#232857', '#3c3f72', '#5f5a86'];
export const DEEP = ['#15183a', '#23284f', '#353866'];
export const PREDAWN = ['#3b3f74', '#8a7aa0', '#d7a79a'];
export const DAWN = ['#8f9cc0', '#e6b9a8', '#f6d7b0'];
export const MORNING = ['#bcd5d8', '#f0e3c8', '#f8e6c4'];

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
/** the Twelve's looks (Mark 3), keyed by name — Judas included */
export const TW = Object.fromEntries(TWELVE.map((m) => [m.k, m.o]));
/** Malchus — the high priest's servant, the same man as in Mark 14 */
export const MALCHUS = LOOK14.servant;
/** the girl who keeps the door (Mark 14's maid) */
export const MAID = LOOK14.maid;
/** Malchus' kinsman: the family face, a darker tunic */
export const KINSMAN = { ...LOOK14.servant, robe: mix(C.stone2, C.wood3, 0.5), hair: C.hair3, beard: 'full', skin: C.skin4 };
/** Annas, the old high priest: very white beard, plum mantle, turban */
export const ANNAS = { robe: C.linen, mantle: shade(C.plumRobe, -0.18), belt: C.sun, skin: C.skin2, hair: '#ece6da', hairStyle: 'short', beard: 'wild', beardColor: '#ece6da' };
export function annas(c, extra = {}) { return addToHead(addToBody(person(c, { ...ANNAS, ...extra }), breastplate(c)), turban(c)); }
export { LOOK3 };

/* ================================================================== the Eleven with lanterns (as in John 16) */
/** the Eleven around Jesus: pos [{k, x, y}] (y relative to gy); holds lanterns. Returns { J, D, all } */
export function eleven(S, L, { gy = 700, pos, s = 0.9, lamps = true, arm = 28, js = 1.02, jesusOpts = {} } = {}) {
  const c = S.c;
  const D = pos.map((d) => ({ ...d, y: gy + d.y })).sort((a, b) => a.y - b.y).map((d, i) => {
    const o = { ...TW[d.k] };
    if (lamps && d.lamp !== false) o.holdF = lantern16(c, arm);
    const el = L.add(withFace(person(c, o), faceBits(c)));
    return { ...d, i, s: d.s ?? s, arm, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), fl: el.querySelector('.lfl'), gl: el.querySelector('.lgl'), seed: c.rr(0, 9) };
  });
  const el = L.add(withFace(person(c, { ...JESUS, ...jesusOpts }), faceBits(c)));
  const J = { k: 'jesus', p: S.puppet(el), el, s: js, sad: el.querySelector('[data-part="sad"]'), seed: 0 };
  return { J, D };
}
/** light a lantern (k 0..1), bend = flame lean, time: tiny flicker (0 = still) */
export function lamp(m, k, bend = 0, time = 0) {
  if (!m.fl) return;
  fade(m.fl, k > 0.02 ? 1 : 0);
  fade(m.gl, Math.min(1, k * 1.1));
  if (k > 0.02) pose(m.fl, { x: 0, y: 25, sx: 0.5 + k * 0.5, sy: (0.35 + k * 0.65) * (1 + (time ? Math.sin(time * 8 + m.seed * 3) * 0.05 : 0)), r: bend });
}

/* ================================================================== the band: shadow-play silhouettes */
const silOpts = (c, o) => ({ ...o, robe: INK, mantle: o.mantle ? shade(INK, 0.06) : null, skin: INK, hair: INK, veil: INK, veil2: INK, beardColor: INK, belt: null, halo: false });
const inkify = (m) => m.split(`fill="${C.blush}"`).join(`fill="${INK}"`).replace(/fill="#3a2a20"/g, `fill="${INK}"`);
/** a Roman helmet in silhouette (head coords) */
function helmSil(c) {
  return sheet().p(c.cut([...c.arc(0, -2, 21, 21, PI * 0.98, PI * 2.02, 14), [22, 1], [-22, 1]], 0.4, 4) + c.cut([[-7, -21], [-1, -33], [9, -35], [5, -21]], 0.4, 3) + c.cut([[-18, -1], [-10, -1], [-11, 12], [-17, 10]], 0.3, 3), INK).out(false);
}
/** a stick held upright in a hand raised `a` degrees (hold markup) */
function upright(inner, a) { return `<g transform="rotate(${a})">${inner}</g>`; }
/** the torch stick alone (the flame is a separate piece so the silhouette never re-renders) */
function torchStick(c, len = 88) {
  return sheet().p(c.cut([[-3, 18], [3, 18], [4, -len], [-4, -len]], 0.3, 6), INK).p(c.cut([[-7, -len], [7, -len], [6, -len - 11], [-6, -len - 11]], 0.3, 4), shade(INK, 0.12)).out();
}
/** a lantern in silhouette with a lit pane (hangs from the hand) */
function lanternSil(c, a) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 6, 6, 7, PI, 2 * PI, 6), 1.8), INK);
  s.p(c.cut([[-9, 5], [9, 5], [8, 9], [-8, 9]], 0.2, 3) + c.cut([[-10, 27], [10, 27], [9, 31], [-9, 31]], 0.2, 3), INK);
  s.x(c.cut([[-7, 9], [7, 9], [8.5, 27], [-8.5, 27]], 0.2, 3), C.lampGlow);
  s.x(c.ribbon([[0, 9], [0, 27]], 1.4), INK);
  return `<g transform="rotate(${a}) scale(1.15)"><circle cx="0" cy="18" r="46" fill="url(#warm-glow)"/>${s.out()}</g>`;
}
/** a flame for a torch (origin at its base); a separate little piece */
export function torchFlame(c, sc = 1) {
  return `<g transform="scale(${sc})"><circle cy="-22" r="70" fill="url(#warm-glow)" opacity=".85"/><path d="M0 0C-12 -8 -10 -26 0 -44C4 -30 14 -26 10 -10C8 -4 4 0 0 0Z" fill="${C.sunDeep}"/><path d="M0 -2C-7 -8 -6 -20 0 -32C5 -20 7 -8 0 -2Z" fill="${C.lampFlame}"/><path d="M0 -4C-3 -8 -3 -14 0 -20C3 -14 3 -8 0 -4Z" fill="#fff4d2"/></g>`;
}
/**
 * One of the band (facing right, feet at 0,0): kind 'torch' | 'lantern' | 'sword' | 'club' | 'spear'; roman: helmet.
 * Returns markup; for a torch, the flame sits at FLAME_AT(arm) relative to the feet (before scale/rotation).
 */
export function bandSil(c, { kind = 'torch', roman = false, arm = 40, i = 0 } = {}) {
  const o = roman
    ? { hairStyle: 'short', beard: i % 2 ? 'short' : 'none', mantle: i % 2 ? null : 1 }
    : { hairStyle: c.pick(['wrap', 'short', 'curly']), beard: c.pick(['short', 'full']), mantle: c.chance(0.4) ? 1 : null };
  let hold = '';
  if (kind === 'torch') hold = upright(torchStick(c), arm);
  if (kind === 'lantern') hold = lanternSil(c, arm);
  if (kind === 'sword') hold = upright(`<g transform="scale(1.05)">${sword(c, 54).replace(/fill="#[0-9a-f]{6}"/g, `fill="${INK}"`)}</g>`, arm - 12);
  if (kind === 'club') hold = upright(club(c, 60).replace(/fill="#[0-9a-f]{6}"/g, `fill="${INK}"`), arm - 14);
  let m = inkify(person(c, { ...silOpts(c, o), holdF: hold }));
  if (kind === 'spear') m = addToBody(m, `<path d="${c.ribbon([[34, -6], [34, -250]], 3)}" fill="${INK}"/><path d="${c.poly([[29, -248], [34, -272], [39, -248]])}" fill="${INK}"/>`);
  if (roman) m = addToHead(m, helmSil(c));
  return m;
}
/** where the top of an upright torch is, relative to the feet (facing right), for an arm raised `a` degrees */
export function torchTop(a, len = 88) {
  const r = (a * PI) / 180;
  const hx = 7 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [hx, hy - len - 9];
}
/**
 * Build the band on layer L (silhouettes) + flames on layer F. list: [{kind, roman, x, y, s, arm}].
 * Returns members { ...d, p, fl } — call bandPose(m, {x, y, s, r, o, flip}, time).
 */
export function makeBand(S, L, F, list) {
  const c = S.c;
  return list.map((d, i) => {
    const arm = d.arm ?? (d.kind === 'lantern' ? 30 : d.kind === 'torch' ? 66 : 40);
    const el = L.add(bandSil(c, { kind: d.kind, roman: d.roman, arm, i }));
    const fl = d.kind === 'torch' ? F.add(`<g>${torchFlame(c, 0.72)}</g>`) : null;
    return { ...d, i, arm, el, p: S.puppet(el), fl, seed: c.rr(0, 9) };
  });
}
/** pose one of the band; r = rotation about the feet (falling back = negative when facing right) */
export function bandPose(m, { x, y, s = 1, r = 0, o = 1, flip = false, walk, head = 0, lean = 0, armB = 6, flameK = 1 }, time = 0) {
  m.p.set({ x, y, s, r, o, flip, walk, head, lean, armF: m.arm, armB });
  if (!m.fl) return;
  const [tx, ty] = torchTop(m.arm);
  const X = (flip ? -tx : tx) * s, Y = ty * s, rr = (r * PI) / 180;
  const px = x + X * Math.cos(rr) - Y * Math.sin(rr), py = y + X * Math.sin(rr) + Y * Math.cos(rr);
  const fk = o * flameK;
  if (fk <= 0.01) { pose(m.fl, { x: px, y: py, o: 0 }); return; }
  pose(m.fl, { x: px, y: py, s: s * (0.4 + 0.6 * flameK), sy: s * (0.4 + 0.6 * flameK) * (1 + (time ? Math.sin(time * 9 + m.seed * 3) * 0.08 : 0)), r: r * 0.4, o: fk });
}

/* ================================================================== the night valley and the garden */
/**
 * The Kidron valley and the olive garden at night: the city on its ridge up on the left (optional zigzag path down
 * from its gate — for the torchlight procession), the Mount of Olives, olives at two depths, the garden floor.
 * Options: brook (the Kidron crossing the floor at brookX), gate (the garden's low wall and gate at gateX).
 * The stage floor sits on par P (= the people's layer) so that the camera can travel along it.
 * Returns { sky, stars, moon, hang, far, torchL, ZZ, mid, ground, GY, P, brookL, glint, gateLeaf, update(T) }
 */
export const ZZ = [[330, 380], [470, 400], [300, 426], [470, 454], [250, 488], [380, 520], [120, 556]];
export function nightSet(S, { skyCols = NIGHT, moonAt = [1230, 140], zigzag = false, brook = false, brookX = 800, gate = false, gateX = 1130, gy = 700, P = 0.5, cityX = 300, wide = false } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -900, x1: 2500, y0: -700, y1: 420, n: 100 }));
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const moonEl = hanging(hangL, `<circle r="130" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 42)}`, { x: moonAt[0], y: moonAt[1], len: 620 });

  // far: the ridge with Jerusalem on the left
  const far = S.layer({ par: 0.12, sh: 2 });
  const ridge = [[-900, 1700], [-900, 330], [-400, 322], [0, 336], [cityX - 40, 352], [cityX + 180, 392], [cityX + 400, 456], [cityX + 620, 500], [1300, 492], [1700, 470], [2500, 452], [2500, 1700]];
  far.add(sheet().p(c.cut(ridge, 1.2, 14), nt(C.hillFar, 0.6)).out());
  far.add(walledCity(c, cityX - 60, 362, 1.0, { wall: nt(C.stone, 0.48), wall2: nt(C.stone2, 0.55), temple: nt(C.cream, 0.36) }));
  let lit = '';
  for (let i = 0; i < 12; i++) lit += c.poly(c.rect(c.rr(cityX - 150, cityX + 30), c.rr(322, 352), 3, 4));
  far.add(`<path d="${lit}" fill="${C.lampFlame}" opacity=".85"/>`);
  const zz = ZZ.map(([x, y]) => [x + cityX - 300, y]);
  if (zigzag) far.add(sheet().p(c.ribbon(zz, 7, 3), nt(C.sand, 0.5)).out());
  const torchL = S.layer({ par: 0.12, sh: 0, flat: true });
  // mid: the Mount of Olives across the valley
  const mid = S.layer({ par: 0.2, sh: 3 });
  const h2 = hillsWith(c, { y: 540, amps: [12, 6, 2], lens: [900, 300, 110], color: nt(C.hillMid, 0.55), trees: 26, treeColor: nt(C.olive, 0.5), treeH: 22 });
  mid.add(h2.markup);
  const OL = { trunk: nt(C.wood2, 0.38), leaf: nt(C.olive, 0.4), leaf2: nt(C.sage, 0.4) };
  mid.add(olive(c, 80, h2.fn(80) + 20, 0.8, OL) + olive(c, 1540, h2.fn(1540) + 20, 0.85, OL) + olive(c, 1180, h2.fn(1180) + 14, 0.6, OL) + cypress(c, 1330, h2.fn(1330) + 10, 120, nt(C.moss2, 0.45)));

  // the stage floor
  const ground = S.layer({ par: P, sh: 3 });
  const x0 = wide ? -1400 : -900, x1 = wide ? 3000 : 2500;
  const fn = c.wave(gy - 44, [5, 2], [700, 160]);
  const g = sheet().p(c.ridge(fn, x0, x1, 1800, 12, 1), nt(mix(C.sage, C.moss, 0.4), 0.5));
  let pebbles = '';
  for (let i = 0; i < 30; i++) pebbles += c.cut(c.ell(c.rr(x0 + 200, x1 - 200), gy + c.rr(-18, 60), c.rr(3, 7), c.rr(2, 4), 8), 0.2, 3);
  g.x(pebbles, nt(C.rock2, 0.4), 'opacity=".7"');
  const fg = sheet();
  let st = '', tf = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(x0 + 300, x1 - 300), y = c.rr(gy + 110, gy + 420); st += c.cut(c.blob(x, y, c.rr(10, 26), c.rr(6, 12), 10, 0.25), 0.6, 5); }
  for (let i = 0; i < 44; i++) { const x = c.rr(x0 + 200, x1 - 200), y = c.rr(gy + 90, gy + 460); for (let j = 0; j < 4; j++) tf += c.ribbon([[x + j * 3, y], [x + j * 3 + c.rr(-6, 6), y - c.rr(8, 16)]], 1.6); }
  fg.p(st, nt(C.rock2, 0.45)).x(tf, nt(C.moss, 0.45));
  ground.add(g.out() + fg.out());
  ground.add(grass(c, { x0: x0 + 200, x1: x1 - 200, y: gy - 44, fn, n: 44, h: 12, color: nt(C.moss, 0.42) }));
  let brookL = null, glint = [];
  if (brook) {
    // the Kidron: a narrow brook winding across the floor, with stepping stones
    const bx = brookX;
    const bank = c.cbez([bx - 330, gy - 44], [bx - 150, gy - 10], [bx + 40, gy + 90], [bx + 150, gy + 520], 36);
    const bw = sheet();
    bw.p(c.ribbon(bank, (u) => 30 + u * 150, 4), nt(C.soil, 0.5));
    bw.p(c.ribbon(bank, (u) => 22 + u * 128, 4), nt(C.lake3, 0.42));
    bw.p(c.ribbon(bank, (u) => 12 + u * 90, 4), nt(C.lake, 0.3));
    ground.add(bw.out());
    let stones = '';
    [[bx - 118, gy + 2], [bx - 72, gy + 10], [bx - 26, gy + 16]].forEach(([x, y]) => { stones += c.cut(c.blob(x, y, 21, 9, 10, 0.2), 0.4, 4); });
    ground.add(sheet().p(stones, nt(C.rock, 0.3)).out());
    brookL = S.layer({ par: P, sh: 0, flat: true });
    glint = Array.from({ length: 7 }, (_, i) => {
      const u = 0.06 + i * 0.1, pt = bank[Math.round(u * (bank.length - 1))];
      return { i, x: pt[0] + c.rr(-8, 8), y: pt[1], el: brookL.add(`<g><path d="${c.ribbon([[-9, 0], [9, 0]], 1.8)}" fill="${C.moon}" opacity=".8"/></g>`) };
    });
  }
  let gateLeaf = null;
  if (gate) {
    // the garden: a low dry-stone wall with a gap and a wooden gate
    const ws = sheet();
    const wy = gy - 20;
    ws.p(c.cut([[gateX + 60, wy - 64], [x1, wy - 70], [x1, wy + 10], [gateX + 60, wy + 12]], 1, 10), nt(C.rock2, 0.36));
    let stn = '';
    for (let x = gateX + 70; x < x1; x += c.rr(26, 40)) for (let r = 0; r < 3; r++) stn += c.cut(c.blob(x + (r % 2) * 14, wy - 50 + r * 22, c.rr(10, 15), c.rr(7, 10), 8, 0.2), 0.3, 3);
    ws.x(stn, nt(C.rock3, 0.4), 'opacity=".55"');
    ws.p(c.cut(c.rect(gateX + 48, wy - 96, 16, 110), 0.4, 6), nt(C.wood2, 0.3));
    ground.add(ws.out());
    const leaf = sheet();
    let bars = '';
    for (let i = 0; i < 5; i++) bars += c.cut(c.rect(i * 14, -80, 8, 84), 0.3, 5);
    leaf.p(bars, nt(C.wood, 0.3)).p(c.cut(c.rect(-2, -66, 70, 8), 0.3, 5) + c.cut(c.rect(-2, -24, 70, 8), 0.3, 5), nt(C.wood2, 0.3));
    gateLeaf = ground.add(`<g transform="translate(${gateX + 56} ${wy + 6})">${leaf.out()}</g>`);
    const OL2 = { trunk: nt(C.wood2, 0.3), leaf: nt(C.olive, 0.3), leaf2: nt(C.sage, 0.3) };
    ground.add(olive(c, gateX + 260, wy - 30, 1.2, OL2) + olive(c, gateX + 520, wy - 34, 1.35, OL2));
  }
  return {
    sky: sk, stars: starL, hang: hangL, moon: moonEl, far, torchL, zz, mid, ground, GY: gy, P, fn, brookL, glint, gateLeaf, gateX, moonAt,
    update(T) {
      swing(moonEl, moonAt[0], moonAt[1], T, 0.9, 0.5);
      glint.forEach((g) => pose(g.el, { x: g.x + (T ? Math.sin(T * 1.3 + g.i) * 6 : 0), y: g.y, o: T ? 0.5 + Math.sin(T * 2 + g.i * 1.7) * 0.4 : 0.7 }));
    },
  };
}
/** the olive garden proper: big near olives framing the stage (on the people's plane, behind them) */
export function gardenTrees(S, L, gy = 700) {
  const c = S.c;
  const OL2 = { trunk: nt(C.wood2, 0.28), leaf: nt(C.olive, 0.3), leaf2: nt(C.sage, 0.3) };
  L.add(olive(c, 170, gy - 20, 1.55, OL2) + olive(c, 1450, gy - 16, 1.6, OL2) + olive(c, 1010, gy - 40, 1.05, OL2));
  L.add(rock(c, 1220, gy + 4, 110, 40, nt(C.rock2, 0.34)));
}
/** a string of torch lights for the far procession (small glowing dots) on layer L; set(k, o) moves them along pts */
export function torchLine(S, L, pts, n = 14, gap = 0.035) {
  const c = S.c;
  const dots = Array.from({ length: n }, (_, i) => ({ i, el: L.add(`<g><circle r="22" fill="url(#warm-glow)"/><path d="${c.cut([[0, -9], [4, -2], [3, 3], [-3, 3], [-4, -2]], 0.2, 2)}" fill="${C.lampFlame}"/><path d="${c.cut(c.circ(0, 0, 2, 6), 0.1, 2)}" fill="#fff4d2"/></g>`), seed: c.rr(0, 9) }));
  const segs = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  const along = (u) => {
    let d = Math.max(0, Math.min(1, u)) * tot;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) { const k = d / segs[i]; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  };
  return (k, o = 1, time = 0) => dots.forEach((d) => {
    const u = k - d.i * gap;
    const on = u > 0 && u < 1 ? o : 0;
    const [x, y] = along(u);
    pose(d.el, { x, y, s: (0.8 + u * 0.3) * (1 + (time ? Math.sin(time * 7 + d.seed) * 0.08 : 0)), o: on });
  });
}

/* ================================================================== the arrest: where everyone stands */
export const BAND = [
  { kind: 'lantern', x: 632, y: 8 }, { kind: 'sword', roman: true, x: 584, y: -8 }, { kind: 'torch', x: 536, y: 10 }, { kind: 'spear', roman: true, x: 490, y: -14 },
  { kind: 'club', x: 446, y: 6 }, { kind: 'torch', x: 404, y: -18, s: 0.94 }, { kind: 'spear', roman: true, x: 358, y: 8 }, { kind: 'lantern', x: 312, y: -20, s: 0.92 },
  { kind: 'torch', x: 262, y: 4 }, { kind: 'spear', roman: true, x: 214, y: -16, s: 0.92 }, { kind: 'torch', x: 160, y: 8 },
];
export const DIS = [
  { k: 'peter', x: 900, y: 4 }, { k: 'john', x: 948, y: -22, s: 0.86 }, { k: 'james', x: 990, y: 8 }, { k: 'andrew', x: 1036, y: -24, s: 0.86 }, { k: 'thomas', x: 1080, y: 6 },
  { k: 'philip', x: 1122, y: -26, s: 0.84 }, { k: 'matthew', x: 1160, y: 4 }, { k: 'bartholomew', x: 1200, y: -24, s: 0.84 }, { k: 'jamesA', x: 1240, y: 8 },
  { k: 'thaddaeus', x: 1282, y: -22, s: 0.84 }, { k: 'simonZ', x: 1320, y: 6 },
];
export const ARREST = { JDX: 640, JX: 800, GY: 700 };

/* ================================================================== small props */
/** a sheathed sword (scabbard) at the belt (body coords) — shown when the sword is put away */
export function sheathed(c) {
  return `<g transform="translate(-18 -92) rotate(-18)"><path d="${c.cut([[-3, 0], [3, 0], [4, 58], [0, 64], [-4, 58]], 0.2, 4)}" fill="${C.leather}"/><path d="${c.cut(c.rect(-9, -4, 18, 4), 0.2, 3)}" fill="${C.wood2}"/><path d="${c.cut(c.rect(-2.5, -14, 5, 11), 0.2, 3)}" fill="${C.leather}"/></g>`;
}
/** a small cut-paper ear (origin centre, ~ 14 tall) */
export function paperEar(c, col = C.skin2) {
  return sheet().p(c.cut([[0, -8], [5, -7], [7, -2], [6, 3], [3, 7], [-1, 8], [-2, 4], [0, 1], [-1, -4]], 0.2, 2), col).x(c.ribbon(c.qbez([2, -4], [5, 0], [1, 4], 5), 1), shade(col, -0.25)).out();
}
/** a grey "no" tag (a denial) — dim paper, origin at the hole */
export function noTag(c, text, { size = 20 } = {}) {
  const ww = Math.max(80, text.length * size * 0.52 + size * 1.4), hh = size * 1.7;
  const s = sheet();
  s.p(c.cut([[-ww / 2 + 10, 0], [ww / 2 - 10, 0], [ww / 2, 10], [ww / 2 - 2, hh], [-ww / 2 + 2, hh + 2], [-ww / 2, 10]], 0.6, 6), mix(C.storm, C.stone2, 0.45));
  s.x(c.poly(c.circ(0, 6, 3, 8)), C.storm2);
  return `${s.out()}<text x="0" y="${(hh * 0.5 + size * 0.5).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.cream}">${text}</text>`;
}
/** a crown outline cut from gold paper (origin: bottom centre, ~ w wide) */
export function paperCrown(c, w = 70, { col = C.sun, dark = false } = {}) {
  const h = w * 0.55;
  const pts = [[-w / 2, 0], [-w / 2, -h * 0.55], [-w / 4, -h * 0.25], [0, -h], [w / 4, -h * 0.25], [w / 2, -h * 0.55], [w / 2, 0]];
  const s = sheet().p(c.cut(pts, 0.3, 4), dark ? mix(col, C.storm, 0.5) : col).p(c.cut(c.rect(-w / 2, -8, w, 8), 0.2, 4), shade(col, -0.15));
  let jw = '';
  [[-w / 2, -h * 0.55], [0, -h], [w / 2, -h * 0.55]].forEach(([x, y]) => { jw += c.cut(c.circ(x, y - 3, 4, 8), 0.1, 2); });
  s.p(jw, dark ? C.storm2 : C.terracotta);
  return s.out();
}
/** a rope from the hands (hold markup for the front hand): a loop and a short loose end */
export function ropeHands(c) {
  return sheet().p(c.ribbon(c.arc(0, -2, 9, 4, 0, PI * 2, 14), 2.6) + c.ribbon(c.arc(0, 3, 9, 4, 0, PI * 2, 14), 2.6), C.rope).out();
}
/** a lead rope from (0,0) to (100,0), sagging; pose with r & sx */
export function leadRope(c) {
  return `<path d="${c.ribbon(c.qbez([0, 0], [50, 14], [100, 0], 12), 2.4)}" fill="${C.rope}"/>`;
}

/* ================================================================== Annas' house: the courtyard and the hall */
/**
 * Annas' house at night, cut open on one plane (par P = 0.5) so the camera can travel along it: the street and the
 * gate on the left (GATE), the courtyard with its charcoal fire (FIRE) and a back wall with a coping (the rooster's
 * perch), and on the right the hall raised on a platform (floor HALL, from HX0 to HX1), lamp-lit, where Annas sits
 * (ANX) and Jesus stands (JXH). The hall's back wall is a pale lit screen — shadows can be cast on it (shadowL).
 * Build order: courtyard(S) → hall people (S.layer par P) → C.front() → yard people → C.gate().
 */
export const CY = { YARD: 720, HALL: 606, HX0: 860, HX1: 1470, HTOP: 210, GATE: 300, FIRE: 650, JXH: 1010, ANX: 1270, P: 0.5 };
export function courtyard(S, { skyCols = DEEP } = {}) {
  const c = S.c;
  const { YARD, HALL, HX0, HX1, HTOP, GATE, FIRE, ANX, P } = CY;
  const sk = sky(S, skyCols, { bottom: 900 });
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -900, x1: 2500, y0: -700, y1: 420, n: 90 }));
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 32)}`, { x: 620, y: 120, len: 600 });
  const dawnL = S.layer({ par: 0.1, sh: 0, flat: true });
  dawnL.add(`<ellipse cx="300" cy="520" rx="1300" ry="320" fill="url(#warm-glow)" opacity=".9"/>`);
  const far = S.layer({ par: 0.16, sh: 2 });
  let hs = '', rf = '';
  for (let i = 0; i < 26; i++) {
    const x = -800 + i * 124 + c.rr(-20, 20), w = c.rr(70, 118), top = c.rr(520, 580);
    hs += c.cut(c.rect(x, top, w, 700), 0.4, 6);
    if (c.chance(0.4)) rf += c.cut(c.rect(x + w * 0.3, top - 26, w * 0.4, 28), 0.3, 4);
  }
  far.add(sheet().p(hs + rf, nt(C.plaster2, 0.66)).out());
  let lit = '';
  for (let i = 0; i < 12; i++) lit += c.poly(c.rect(c.rr(-600, 2200), c.rr(545, 600), 4, 5));
  far.add(`<path d="${lit}" fill="${C.lampFlame}" opacity=".7"/>`);

  const wallC = nt(C.plaster, 0.36), wall2 = nt(mix(C.plaster2, C.clay, 0.12), 0.5), stoneC = nt(C.stone2, 0.42);
  const bld = S.layer({ par: P, sh: 3 });
  const b = sheet();
  // the courtyard's back wall (inside the gate only) with a coping on top; dressed stone courses
  const WX0 = GATE + 40;
  b.p(c.cut([[WX0, 440], [HX0 + 20, 440], [HX0 + 20, YARD + 4], [WX0, YARD + 4]], 1, 14), wall2);
  let crs = '', joints = '';
  for (let y = 466, r = 0; y < YARD; y += 28, r++) {
    crs += c.ribbon([[WX0, y], [HX0, y + c.rr(-1, 1)]], 1.2);
    for (let x = WX0 + (r % 2) * 36 + 20; x < HX0; x += 72) joints += c.ribbon([[x, y - 27], [x + c.rr(-1, 1), y]], 1.1);
  }
  b.x(crs + joints, shade(wall2, -0.14), 'opacity=".5"');
  b.p(c.cut([[WX0 - 10, 426], [HX0 + 30, 426], [HX0 + 30, 444], [WX0 - 10, 444]], 0.6, 12), shade(wall2, -0.16));
  // a doorway into the house (dark), and a small barred window
  b.p(c.cut([[WX0 + 260, YARD + 2], [WX0 + 260, 600], ...c.arc(WX0 + 300, 600, 40, 36, PI, 2 * PI, 10), [WX0 + 340, YARD + 2]], 0.4, 6), nt(C.soilDark, 0.4));
  // outside: the street, darker, and the city's houses beyond
  b.p(c.cut([[-900, YARD - 6], [WX0, YARD - 6], [WX0, YARD + 4], [-900, YARD + 4]], 0.6, 12), nt(C.stone2, 0.55));
  // the hall: a lit back wall (the screen), a beamed ceiling, the seat
  b.p(c.cut([[HX0 - 10, YARD + 4], [HX0 - 10, HTOP - 40], [HX1 + 60, HTOP - 40], [HX1 + 60, YARD + 4]], 0.8, 12), wallC);
  bld.add(b.out());
  const hi = sheet();
  hi.p(c.cut([[HX0 + 10, HALL], [HX0 + 10, HTOP], [HX1 - 10, HTOP], [HX1 - 10, HALL]], 0.6, 12), mix(C.plaster, C.apricot, 0.28));
  let beams = '';
  for (let x = HX0 + 40; x < HX1; x += 90) beams += c.cut(c.rect(x, HTOP, 14, 18), 0.3, 4);
  hi.p(beams, mix(C.wood2, C.soil, 0.2));
  hi.p(c.cut([[HX0 + 10, HTOP], [HX1 - 10, HTOP], [HX1 - 10, HTOP + 8], [HX0 + 10, HTOP + 8]], 0.3, 8), C.wood2);
  // a hanging behind the seat
  hi.p(c.cut([[ANX - 90, HTOP + 30], [ANX + 90, HTOP + 30], [ANX + 84, HALL - 30], [ANX - 84, HALL - 30]], 0.6, 8), shade(C.plumRobe, -0.12));
  let fold = '';
  for (let x = ANX - 74; x < ANX + 84; x += 28) fold += c.ribbon([[x, HTOP + 34], [x + c.rr(-3, 3), HALL - 34]], 5);
  hi.x(fold, shade(C.plumRobe, -0.25), 'opacity=".5"');
  hi.p(c.ribbon([[ANX - 100, HTOP + 30], [ANX + 100, HTOP + 30]], 7), C.sun);
  // the seat
  hi.p(c.cut([[ANX - 34, HALL - 10], [ANX - 34, HALL - 136], [ANX + 34, HALL - 136], [ANX + 34, HALL - 10]], 0.4, 6), C.wood);
  hi.p(c.cut(c.rect(ANX - 40, HALL - 144, 80, 12), 0.3, 6), C.sun);
  hi.p(c.cut(c.rect(ANX - 46, HALL - 62, 92, 14), 0.3, 6), mix(C.wood, C.plumRobe, 0.3));
  bld.add(`<rect x="${HX0 + 10}" y="${HTOP}" width="${HX1 - HX0 - 20}" height="${HALL - HTOP}" fill="${C.lampGlow}" opacity=".25"/>` + hi.out());
  // shadows fall on the lit wall here
  const shadowL = S.layer({ par: P, sh: 0, flat: true });
  const lampL = S.layer({ par: P, sh: 3 });
  const hallLamps = [HX0 + 150, HX1 - 120].map((x) => {
    const gl = lampL.add(lampGlow(x, HTOP + 30, 150));
    const el = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x, y: HTOP + 30, len: 60 });
    return { el, x, y: HTOP + 30, fl: el.querySelector('.flame'), gl };
  });
  return {
    sky: sk, stars: starL, moon: moonEl, hang: hangL, dawn: dawnL, far, bld, shadowL, hallLamps,
    /** the hall's front: floor slab, steps, columns (call after the hall people) */
    front() {
      const fr = S.layer({ par: P, sh: 4 });
      const f = sheet();
      f.p(c.cut([[HX0 - 20, HALL], [HX1 + 60, HALL], [HX1 + 60, YARD + 4], [HX0 - 20, YARD + 4]], 0.6, 10), stoneC);
      f.p(c.cut([[HX0 - 30, HALL - 4], [HX1 + 70, HALL - 4], [HX1 + 70, HALL + 12], [HX0 - 30, HALL + 12]], 0.4, 10), shade(stoneC, -0.12));
      let steps = '';
      for (let i = 0; i < 4; i++) steps += c.cut(c.rect(HX0 - 40 - i * 26, HALL + 12 + i * 27, 60 + i * 26, 30), 0.3, 6);
      f.p(steps, shade(stoneC, 0.04));
      fr.add(f.out());
      fr.add(column(c, HX0 + 4, HALL, HALL - HTOP + 40, 34, nt(C.stone, 0.2)) + column(c, HX1 + 30, HALL, HALL - HTOP + 40, 34, nt(C.stone, 0.2)));
      fr.add(sheet().p(c.cut([[HX0 - 40, HTOP - 60], [HX1 + 80, HTOP - 60], [HX1 + 80, HTOP - 30], [HX0 - 40, HTOP - 30]], 0.5, 10), shade(wallC, -0.16)).out());
      return fr;
    },
    /** the courtyard floor, the fire (static pit + animated tongues + a glow) */
    yard() {
      const yl = S.layer({ par: P, sh: 3 });
      const yf = sheet();
      yf.p(c.cut([[-900, YARD], [HX0 - 20, YARD], [HX0 - 20, YARD + 4], [2500, YARD + 4], [2500, 1800], [-900, 1800]], 1, 30), nt(C.stone2, 0.36));
      yf.p(c.cut([[-900, YARD], [GATE, YARD], [GATE, 1800], [-900, 1800]], 0.8, 20), nt(C.soil, 0.55));
      let tl = '';
      for (let r = 0; r < 6; r++) tl += c.ribbon([[-900, YARD + 14 + r * r * 9 + r * 14], [2500, YARD + 14 + r * r * 9 + r * 14 + c.rr(-2, 2)]], 1.4);
      yf.x(tl, shade(C.stone2, -0.4), 'opacity=".45"');
      yl.add(yf.out());
      yl.add(`<g transform="translate(${FIRE} ${YARD + 26})">${firePit(c, 110)}</g>`);
      const glowL = S.layer({ par: P, sh: 0, flat: true });
      glowL.add(`<g><circle cx="${FIRE}" cy="${YARD - 30}" r="360" fill="url(#warm-glow)"/></g>`);
      const fireL = S.layer({ par: P, sh: 2 });
      const fl = fireL.add(`<g transform="translate(${FIRE} ${YARD + 26})">${fireFlames(c, 110)}</g>`);
      return { yl, glowL, fireL, tongues: Array.from(fl.querySelectorAll('.tongue')) };
    },
    /** the gate on the left: pillars and arch in front of the people, a door leaf that opens (door: sx 1 → 0.15) */
    gate() {
      const gl = S.layer({ par: P, sh: 5 });
      const g = sheet();
      const x0 = GATE - 70, x1 = GATE + 70;
      g.p(c.cut([[x0 - 34, YARD + 30], [x0 - 34, 400], [x1 + 34, 400], [x1 + 34, YARD + 30], [x1, YARD + 30], [x1, 560], ...c.arc(GATE, 560, 70, 60, 0, -PI, 12), [x0, YARD + 30]], 0.6, 8), stoneC);
      g.p(c.cut([[x0 - 46, 400], [x1 + 46, 400], [x1 + 40, 384], [x0 - 40, 384]], 0.4, 8), shade(stoneC, -0.15));
      gl.add(g.out());
      // a small oil lamp in a niche by the gate
      const lampEl = gl.add(`<g transform="translate(${x1 + 12} 470) scale(.5)">${oilLamp(c, { r: 120 })}</g>`);
      const leaf = sheet();
      let planks = '';
      for (let i = 0; i < 5; i++) planks += c.cut(c.rect(-i * 28 - 26, -160, 26, 164), 0.3, 6);
      leaf.p(planks, mix(C.wood2, C.indigo, 0.2)).p(c.cut(c.rect(-140, -128, 140, 10), 0.3, 5) + c.cut(c.rect(-140, -46, 140, 10), 0.3, 5), mix(C.wood, C.indigo, 0.25));
      const door = gl.add(`<g>${leaf.out()}</g>`);
      return { gl, door, doorX: x1, doorY: YARD + 4, lampFl: lampEl.querySelector('.flame') };
    },
  };
}
/** idle for the courtyard: hall lamps swing & flicker; fire tongues; embers k (0 burning → 1 low) */
export function courtIdle(R, Y, T, ember = 0) {
  R.hallLamps.forEach((l, i) => { swing(l.el, l.x, l.y, T, 0.8, 0.7, i); pose(l.fl, { x: 26, y: 36, sx: 1 + (T ? Math.sin(T * 7 + i) * 0.08 : 0), sy: 1 + (T ? Math.sin(T * 5.3 + i) * 0.1 : 0) }); });
  if (Y) {
    Y.tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: (1 - ember * 0.7) * (0.85 + (T ? Math.sin(T * (6 + i) + i) * 0.15 : 0)), sx: 1 + (T ? Math.sin(T * 5 + i * 2) * 0.06 : 0) }));
    Y.glowL.fade((0.85 + (T ? Math.sin(T * 4) * 0.08 : 0)) * (1 - ember * 0.5));
  }
}

/** the servants and officers round the fire (+ Peter), all warming their hands; positions relative to CY.FIRE */
export const RING = [{ dx: -130, y: 6, f: false }, { dx: 100, y: 2, f: true }, { dx: 44, y: -26, f: true, s: 0.82 }, { dx: -52, y: -24, f: false, s: 0.82 }];
export function fireCircle(S, L, { peterAt = -64, peterPuppet = true } = {}) {
  const c = S.c;
  const ring = RING.map((d, i) => ({ ...d, x: CY.FIRE + d.dx, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, guardOptsL(c)))) }));
  let peter = null;
  if (peterPuppet) {
    const el = L.add(withFace(person(c, TW.peter), faceBits(c)));
    peter = { p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), angry: el.querySelector('[data-part="angry"]'), x: CY.FIRE + peterAt };
  }
  return {
    ring, peter,
    set(T, { warm = 1, turn = 0, o = 1 } = {}) {
      ring.forEach((d) => d.p.set({ x: d.x, y: CY.YARD + d.y, s: d.s ?? 0.94, o, flip: turn > 0.5 && d.dx > 0 ? true : d.f, armF: 16 + warm * 58, armB: 6 + warm * 34, head: warm * 5, lean: warm * 3, blink: blinkAt(T, d.seed) }));
    },
  };
}

/* ================================================================== picture plates for the hall */
/** a little synagogue (origin: bottom centre, ~ 150 wide): a lamp-lit room, the scroll ark, benches of listeners */
export function synagogueIcon(c) {
  const s = sheet();
  s.p(c.cut([[-76, 0], [-76, -86], [0, -118], [76, -86], [76, 0]], 0.5, 8), mix(C.stone, C.cream, 0.3));
  s.p(c.cut([[-18, -4], [-18, -60], ...c.arc(0, -60, 18, 18, PI, 2 * PI, 8), [18, -4]], 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-12, -58, 24, 44), 0.2, 4), C.parchment);
  let heads = '';
  [-58, -42, 42, 58].forEach((x) => { heads += c.cut(c.circ(x, -30, 6, 10), 0.2, 3) + c.cut([[x - 8, -4], [x - 7, -22], [x + 7, -22], [x + 8, -4]], 0.2, 3); });
  s.p(heads, mix(C.wood3, C.ink, 0.2));
  return `<g transform="translate(0 -96) scale(.24)">${menorah(c, 110)}</g>${s.out()}`;
}

/* ================================================================== Pilate's praetorium, cut open at the threshold */
/**
 * The praetorium at dawn, cut open on one plane (par P): outside on the left the paved square under the sky (the city
 * and the Temple beyond) where the leaders stand; the threshold (DOOR) with its jamb in front; inside on the right
 * Pilate's cool hall — columns, red swags, the eagle standard, the judgement seat on its dais (SEAT), a stand lamp.
 * Build order: praetorium(S) → inside people → P.jamb() → outside people. Returns { sky, sun, hall light, lamp, ... }
 */
export const PR = { FLOOR: 700, DOOR: 610, IN0: 660, IN1: 1560, TOP: 170, JX: 930, SEAT: 1290, P: 0.5 };
export function praetorium(S, { skyCols = DAWN } = {}) {
  const c = S.c;
  const { FLOOR, DOOR, IN0, IN1, TOP, SEAT, P } = PR;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const sunEl = hanging(hangL, `<circle r="130" fill="url(#warm-glow)" opacity=".85"/>${sunCut(c, 40, { disc: C.peach, inner: C.dawn, rays: C.apricot })}`, { x: 330, y: 300, len: 800 });
  const far = S.layer({ par: 0.12, sh: 2 });
  const hcol = mix(C.hillFar, C.dawn, 0.35);
  far.add(band(c, { y: 500, amps: [14, 7, 3], lens: [900, 300, 110], color: hcol }).markup);
  far.add(`<g transform="translate(250 506)">${templeMini(c, 1.1, { col: mix(C.cream, C.dawn, 0.3) })}</g>`);
  far.add(town(c, { x: 80, y: 512, n: 7, spread: 380, sc: 0.6, wall: mix(C.plaster, hcol, 0.3), shadow: mix(C.plaster2, hcol, 0.4) }));
  far.add(town(c, { x: 470, y: 516, n: 5, spread: 220, sc: 0.55, wall: mix(C.plaster, hcol, 0.3), shadow: mix(C.plaster2, hcol, 0.4) }));
  // the building: the hall's back wall, ceiling, roof — only from the threshold rightwards
  const bld = S.layer({ par: P, sh: 3 });
  const wallIn = mix(C.stone2, C.dustyBlue, 0.4), wallOut = mix(C.stone, C.sand, 0.25);
  const b = sheet();
  b.p(c.cut([[DOOR - 40, FLOOR + 4], [DOOR - 40, TOP - 50], [IN1 + 80, TOP - 50], [IN1 + 80, FLOOR + 4]], 0.8, 14), wallOut);
  b.p(c.cut([[DOOR - 70, TOP - 50], [(DOOR + IN1) / 2, TOP - 150], [IN1 + 110, TOP - 50], [IN1 + 110, TOP - 34], [DOOR - 70, TOP - 34]], 0.6, 10), mix(C.roof, C.stone2, 0.4));
  b.p(c.cut([[DOOR - 40, TOP - 50], [(DOOR + IN1) / 2, TOP - 136], [IN1 + 80, TOP - 50]], 0.4, 10), mix(C.stone, C.cream, 0.3));
  b.x(c.poly(c.circ((DOOR + IN1) / 2, TOP - 76, 14, 14)), C.sun);
  const inn = sheet();
  inn.p(c.cut([[IN0, FLOOR], [IN0, TOP], [IN1, TOP], [IN1, FLOOR]], 0.6, 12), wallIn);
  let panels = '';
  for (let x = IN0 + 60; x < IN1 - 80; x += 150) panels += c.cut(c.rect(x, TOP + 110, 90, FLOOR - TOP - 170), 0.4, 6);
  inn.p(panels, shade(wallIn, -0.06));
  inn.p(c.cut([[IN0, TOP], [IN1, TOP], [IN1, TOP + 16], [IN0, TOP + 16]], 0.3, 10), shade(wallIn, -0.18));
  // a high window with morning light coming in
  inn.p(c.cut([[1080, TOP + 40], [1160, TOP + 40], [1160, TOP + 150], [1080, TOP + 150]], 0.3, 6), mix(C.dawn, C.cream, 0.4));
  inn.x(c.ribbon([[1120, TOP + 40], [1120, TOP + 150]], 3) + c.ribbon([[1080, TOP + 95], [1160, TOP + 95]], 3), shade(wallIn, -0.2));
  // the floor inside: marble with a pattern
  inn.p(c.cut([[IN0 - 20, FLOOR - 2], [IN1 + 60, FLOOR - 2], [IN1 + 60, FLOOR + 30], [IN0 - 20, FLOOR + 30]], 0.4, 10), mix(C.stone, C.sand, 0.3));
  bld.add(b.out() + inn.out());
  let cols = '';
  [IN0 + 130, IN1 - 60].forEach((x) => { cols += column(c, x, FLOOR, FLOOR - TOP - 16, 40, mix(C.stone, C.cream, 0.2)); });
  bld.add(cols);
  bld.add(swag15(c, IN0 + 130, IN1 - 60, TOP + 30, 40, C.curtain));
  const beamL = S.layer({ par: P, sh: 0, flat: true });
  const beam = beamL.add(`<g><path d="${c.poly([[1080, TOP + 40], [1160, TOP + 40], [1010, FLOOR], [860, FLOOR]])}" fill="#fff3d6" opacity=".22"/></g>`);
  const props = S.layer({ par: P, sh: 5 });
  props.add(`<g transform="translate(${SEAT} ${FLOOR + 2})">${dais15(c, 300, 54)}</g><g transform="translate(${SEAT} ${FLOOR - 52})">${seat15(c)}</g>`);
  props.add(`<g transform="translate(${SEAT + 190} ${FLOOR})">${eagle15(c, 330)}</g>`);
  const lampEl = props.add(`<g transform="translate(${IN0 + 60} ${FLOOR})">${lamp15(c, 180)}</g>`);
  // outside: the paved square
  const sq = S.layer({ par: P, sh: 2 });
  const q = sheet();
  q.p(c.cut([[-900, FLOOR], [DOOR, FLOOR], [DOOR, FLOOR + 4], [2500, FLOOR + 4], [2500, 1800], [-900, 1800]], 0.8, 24), mix(C.sand, C.stone, 0.45));
  let tl = '';
  for (let r = 0; r < 6; r++) tl += c.ribbon([[-900, FLOOR + 16 + r * r * 9 + r * 16], [DOOR, FLOOR + 16 + r * r * 9 + r * 16]], 1.3);
  for (let i = -8; i <= 3; i++) tl += c.ribbon([[DOOR - 100 + i * 70, FLOOR], [DOOR - 100 + i * 150, FLOOR + 400]], 1.2);
  q.x(tl, shade(C.stone2, -0.1), 'opacity=".4"');
  // the threshold stone
  q.p(c.cut([[DOOR - 50, FLOOR - 2], [IN0 + 10, FLOOR - 2], [IN0 + 16, FLOOR + 14], [DOOR - 56, FLOOR + 14]], 0.3, 6), mix(C.stone2, C.clay, 0.2));
  sq.add(q.out());
  return {
    sky: sk, sun: sunEl, far, bld, beam, beamL, props, lamp: { flame: lampEl.querySelector('.flame'), glow: lampEl.querySelector('.glow'), h: 180 }, sq,
    /** the door jamb and lintel, in front of whoever passes the threshold */
    jamb() {
      const L = S.layer({ par: P, sh: 5 });
      const j = sheet();
      j.p(c.cut([[DOOR - 40, FLOOR + 14], [DOOR - 40, TOP - 40], [DOOR + 6, TOP - 40], [DOOR + 6, FLOOR + 14]], 0.5, 8), shade(wallOut, -0.04));
      j.p(c.cut([[DOOR - 54, TOP - 50], [DOOR + 20, TOP - 50], [DOOR + 20, TOP - 26], [DOOR - 54, TOP - 26]], 0.4, 6), shade(wallOut, -0.14));
      j.x(c.ribbon([[DOOR - 26, TOP - 30], [DOOR - 26, FLOOR]], 2) + c.ribbon([[DOOR - 8, TOP - 30], [DOOR - 8, FLOOR]], 2), shade(wallOut, -0.12), 'opacity=".6"');
      L.add(j.out());
      return L;
    },
  };
}
/** the people of the praetorium scenes: inside (two soldiers, Jesus bound), the jamb, the leaders outside, Pilate
 *  (on his own layer so he is in front wherever he stands). Returns { sols, J, jEl, lead, pil, pose(T) } */
export const LEADERS = [{ k: 'cai', x: 470 }, { k: 'p1', x: 400, y: -18, s: 0.9 }, { k: 'p2', x: 340, y: 4 }, { k: 'g1', x: 270, y: -16, s: 0.9 }, { k: 'g2', x: 210, y: 6 }, { k: 'g3', x: 130, y: -12, s: 0.94 }];
export function praetoriumCast(S, R) {
  const c = S.c;
  const inL = S.layer({ par: PR.P, sh: 5 });
  const sols = [0, 1].map((i) => S.puppet(inL.add(soldierP(c, i + 1))));
  const jEl = inL.add(withFace(person(c, { ...JESUS, holdF: ropeHands(c) }), faceBits(c)));
  const J = S.puppet(jEl);
  R.jamb();
  const outL = S.layer({ par: PR.P, sh: 5 });
  const lead = LEADERS.map((d, i) => {
    const m = d.k === 'cai' ? highPriestP(c) : d.k[0] === 'p' ? priestP(c, i) : person(c, guardOptsL(c));
    return { ...d, i, seed: c.rr(0, 9), p: S.puppet(outL.add(m)) };
  });
  const pilL = S.layer({ par: PR.P, sh: 5 });
  const pilEl = pilL.add(withFace(pilateP(c), faceBits(c)));
  const pil = S.puppet(pilEl);
  return {
    sols, J, jEl, lead, pil, pilEl, outL,
    poseLead(T, f = () => ({})) { lead.forEach((m) => m.p.set({ x: m.x, y: PR.FLOOR + (m.y ?? 0), s: m.s ?? 1, flip: false, armF: 16, armB: 6, blink: blinkAt(T, m.seed), ...f(m) })); },
    poseSols(T) { sols.forEach((so, i) => so.set({ x: i === 0 ? PR.SEAT + 110 : PR.JX - 170, y: PR.FLOOR + (i ? -8 : -14), s: 0.94, flip: i === 0, armF: 34, armB: 8, blink: blinkAt(T, 20 + i) })); },
  };
}
