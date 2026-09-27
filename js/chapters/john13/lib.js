// John 13 — the upper room (the same room as Mark 14 — it stays for John 13–17): the long table with the Twelve,
// hanging lamps, the door in the side wall that opens onto the night. The foot-washing set (the disciples on cushions
// with their bare feet, the rest waiting at the table behind), the towel, the basin and the ewer, the morsel,
// and the little devices of the chapter's words (plates, a heart of light, the rooster of the denial).
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, hanging, swing, lerp, blinkAt } from '../kit.js';
import { fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { upperRoom, supperTable, seatAll, SEATS, TW, vis, lampGlow } from '../mark14/lib.js';
import { withFace, faceBits } from '../mark3/lib.js';
import { addToBody } from '../mark2/lib.js';
import { cushion } from '../john12/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, bowl, loaf, cup, addToHead, addToBody, candle, scrollOpen, wordSlip } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, question, shadowPerson, silhouette, sparkle, strip, heart } from '../mark3/lib.js';
export { voiceRings, hang2 } from '../mark1/lib.js';
export { upperRoom, supperTable, seatAll, SEATS, TW, vis, rooster, tally, hangingLamp, lampGlow, matzah, chalice, vignette, wordTag, purse, oilLamp } from '../mark14/lib.js';
export { rayBurst, radiance, glowDisc, threads, darkSheet, goldWord, hungGold, hungWord, hungPlate, iconWord, bust } from '../john1/lib.js';
export { iAm, framed, numberCard } from '../john8/lib.js';
export { hourglassRig } from '../john7/lib.js';
export { outLegs, cushion, jug, moneybag, denar, poorOpts, platter } from '../john12/lib.js';
export { beamGrad, lightBeam, darkPool, word } from '../john3/lib.js';
export { pourStream } from '../john2/lib.js';
export { lightCrown, glory, globe } from '../mark8/lib.js';
export { tr, pose, fade, attr, sheet, shade, mix, C, CAST, person, lerp, blinkAt, hanging, swing };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const INK = '#3b2a22';

/* ====================================================================== palettes */
export const EVE = ['#6d6a9e', '#c7959c', '#eab596'];          // the evening before the feast
export const NIGHTFALL = ['#2a2f60', '#4d4a7c', '#7d6a8a'];    // the night has come
export const DEEP = ['#15173a', '#1f2350', '#2c2f5c'];         // "and it was night"

/* ====================================================================== the cast */
export const JESUS = CAST.jesus;
/** Jesus with His outer garment laid aside: the linen tunic */
export const JESUS_TUNIC = { ...CAST.jesus, mantle: null };
export const LOOK = TW;   // the Twelve, as in Mark 3 / Mark 14, keyed by name

/* ====================================================================== small props */
/** the towel tied round the waist (body coords; for pose 'stand' or 'kneel'); .tail hangs from the knot */
export function towelWrap(c, P = 'stand') {
  const dy = DY[P];
  const s = sheet();
  const tw = mix(C.linen2, C.stone2, 0.35);
  s.p(c.cut([[-33, -108 + dy], [33, -108 + dy], [34, -86 + dy], [-34, -86 + dy]], 0.5, 6), tw);
  s.x(c.ribbon([[-30, -103 + dy], [30, -103 + dy]], 1.8) + c.ribbon([[-31, -91 + dy], [31, -91 + dy]], 1.8), C.dustyBlue, 'opacity=".9"');
  const tl = P === 'stand' ? 52 : 34;
  s.p(c.cut([[12, -92 + dy], [26, -92 + dy], [30, -92 + dy + tl], [24, -88 + dy + tl], [18, -92 + dy + tl], [10, -90 + dy + tl * 0.5]], 0.5, 5), shade(tw, 0.04));
  s.x(c.ribbon([[13, -92 + dy + tl * 0.8], [28, -92 + dy + tl * 0.8]], 1.6), C.dustyBlue, 'opacity=".9"');
  s.p(c.cut(c.ell(20, -96 + dy, 7, 6, 10), 0.3, 3), shade(tw, -0.06));
  return s.out();
}
/** a folded cloth (the laid-aside mantle, the towel) — origin bottom centre */
export function foldedCloth(c, w = 60, h = 16, col = C.jesusMantle) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 3, -h], [w / 2 - 2, -h - 2], [w / 2, 0]], 0.4, 5), col);
  s.x(c.ribbon([[-w / 2 + 4, -h * 0.45], [w / 2 - 4, -h * 0.5]], 1.4), shade(col, -0.14), 'opacity=".75"');
  s.p(c.cut([[w / 2 - 14, -h - 2], [w / 2 - 2, -h - 2], [w / 2 + 3, -h * 0.4], [w / 2 - 8, -h * 0.5]], 0.3, 3), shade(col, 0.08));
  return s.out();
}
/** the towel held in the hand, hanging (origin at the grip) */
export function towelHeld(c, len = 60) {
  const s = sheet();
  s.p(c.cut([[-8, -4], [8, -4], [12, len * 0.5], [9, len], [2, len - 5], [-4, len], [-10, len * 0.5]], 0.5, 5), mix(C.linen2, C.stone2, 0.35));
  s.x(c.ribbon([[-9, len * 0.75], [11, len * 0.75]], 1.6) + c.ribbon([[-8, len * 0.65], [11, len * 0.65]], 1.2), C.dustyBlue, 'opacity=".9"');
  return s.out();
}
/** a wide shallow basin, split so that feet can stand in it: { back, water, front } — origin at the bottom centre */
export function basinParts(c, w = 84) {
  const h = w * 0.3, col = mix(C.sun, C.clay, 0.45);
  const back = sheet().p(c.cut(c.ell(0, -h, w / 2, h * 0.3, 18), 0.3, 4), shade(col, -0.2)).out();
  const water = `<path d="${c.cut(c.ell(0, -h + 2, w / 2 - 5, h * 0.22, 16), 0.2, 3)}" fill="#bcdfe4"/><path d="${c.ribbon([[-w * 0.26, -h + 1], [-w * 0.06, -h]], 1.4)}" fill="#fff" opacity=".7"/>`;
  const f = sheet();
  f.p(c.cut([[-w / 2, -h], [w / 2, -h], [w * 0.36, -3], [w * 0.2, 0], [-w * 0.2, 0], [-w * 0.36, -3]], 0.4, 6), col);
  f.x(c.ribbon([[-w * 0.46, -h + 5], [w * 0.46, -h + 5]], 2), shade(col, 0.25), 'opacity=".7"');
  f.x(c.ribbon([[-w * 0.34, -h * 0.4], [w * 0.34, -h * 0.4]], 1.2), shade(col, -0.2), 'opacity=".5"');
  return { back, water, front: f.out(), h };
}
/** an ewer with a spout (origin at the base; the spout's lip is at (22, -46)) */
export function ewer(c, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-10, 0], [-16, -12], [-16, -28], [-9, -38], [-8, -46], [8, -46], [9, -38], [16, -28], [16, -12], [10, 0]], 0.3, 4), col);
  s.p(c.cut([[8, -40], [22, -48], [24, -45], [12, -34]], 0.2, 3), col);
  s.p(c.ribbon(c.arc(-16, -26, 8, 11, PI / 2, PI * 1.5, 8), 2.8), shade(col, -0.12));
  s.x(c.ribbon([[-15, -20], [15, -20]], 1.6), shade(col, 0.3), 'opacity=".6"');
  return s.out();
}
/** a slender stream of water (origin at the top; len long) */
export function waterStream(c, len = 60) {
  return `<path d="${c.ribbon([[0, 0], [1.5, len * 0.5], [0, len]], (u) => 3.6 - u * 1.2)}" fill="#bcdfe4"/><path d="${c.ribbon([[-0.6, 3], [0.4, len * 0.6]], 1)}" fill="#fff" opacity=".6"/>`;
}
/** a few flying drops (origin centre) */
export function splash(c, r = 14, n = 5, col = '#bcdfe4') {
  let d = '';
  for (let i = 0; i < n; i++) { const a = PI * (1.1 + (i / (n - 1)) * 0.8); d += c.cut(c.ell(Math.cos(a) * r, Math.sin(a) * r, 2, 3.4, 8, a + PI / 2), 0.1, 2); }
  return `<path d="${d}" fill="${col}"/>`;
}
/** bare feet for a sitting puppet (body coords, at the hem, pointing forward); .feet can be posed; .dust fades when washed */
export function bareFeet(c, skin = C.skin) {
  const f = sheet();
  const foot = (dx, dy) => c.cut([[46 + dx, 0 + dy], [48 + dx, -10 + dy], [56 + dx, -14 + dy], [66 + dx, -10 + dy], [78 + dx, -4 + dy], [80 + dx, 0 + dy]], 0.3, 3);
  f.p(foot(-3, -2), shade(skin, -0.1)).p(foot(3, 0), skin);
  f.x(c.ribbon([[74, -3], [77, 0]], 1.1), shade(skin, -0.28), 'opacity=".5"');
  let d = '';
  for (let i = 0; i < 7; i++) d += c.poly(c.circ(c.rr(54, 78), c.rr(-9, -1), c.rr(1, 2.2), 5));
  return `<g class="feet">${f.out()}<path class="dust" d="${d}" fill="${mix(C.soil, C.dune, 0.4)}" opacity=".75"/><path class="wet" d="${c.poly(c.ell(64, -8, 8, 2.4, 8, 0.3))}" fill="#fff" opacity="0"/></g>`;
}
/** a seated disciple with bare feet (and sad / angry brows, a tear) */
export function seatedBare(c, o) {
  return withFace(addToBody(person(c, { ...o, pose: 'sit' }), bareFeet(c, o.skin)), faceBits(c));
}
/** a morsel of bread (origin centre); dipped: the dark edge */
export function morsel(c, r = 9) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 0, r, r * 0.7, 9, 0.25), 0.6, 3), C.wheat);
  s.x(c.cut([[-r, r * 0.1], [r * 0.9, r * 0.2], [r * 0.6, r * 0.7], [-r * 0.7, r * 0.6]], 0.3, 3), mix(C.pot, C.soil, 0.4), 'class="dip" opacity="0"');
  return s.out();
}
/** a heart of light (origin centre) */
export function lightHeart(c, r = 30, col = C.halo) {
  const pts = [...c.arc(-r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI * 0.8, PI * 2, 12), ...c.arc(r * 0.5, -r * 0.2, r * 0.52, r * 0.52, PI, PI * 2.2, 12), [0, r * 0.95]];
  const s = sheet().p(c.cut(pts, 0.5, 5), col).x(c.cut(c.ell(-r * 0.45, -r * 0.35, r * 0.16, r * 0.1, 8, -0.6), 0.2, 3), '#fffdf4', 'opacity=".9"');
  return `<circle r="${r * 3}" fill="url(#halo-glow)"/>${s.out()}`;
}
/** a little flame-shaped light (origin centre) */
export function lightDrop(c, r = 10) {
  return `<circle r="${r * 2.6}" fill="url(#warm-glow)" opacity=".8"/><path d="${c.cut([[0, -r * 1.4], [r * 0.7, -r * 0.2], [r * 0.6, r * 0.5], [0, r * 0.8], [-r * 0.6, r * 0.5], [-r * 0.7, -r * 0.2]], 0.2, 3)}" fill="${C.halo}"/>`;
}
/** a small dark curl of shadow (origin at its foot) — never a figure */
export function shadowCurl(c, h = 60, col = '#2a2238') {
  const pts = c.cbez([0, 0], [-h * 0.3, -h * 0.3], [h * 0.35, -h * 0.55], [0, -h], 14);
  return `<path d="${c.ribbon(pts, (u) => (1 - u) * h * 0.14 + 1.5)}" fill="${col}" opacity=".85"/>`;
}
/** icons for Peter's bubble: a foot, a hand, a head (origin centre, ~ 30 wide) */
export function footIcon(c, col = C.skin2) {
  return sheet().p(c.cut([[-14, 6], [-12, -4], [-2, -8], [8, -4], [15, 3], [15, 7]], 0.3, 3), col).out();
}
export function handIcon(c, col = C.skin2) {
  const s = sheet();
  s.p(c.cut([[-8, 12], [-9, -2], [-12, -8], [-9, -10], [-5, -4], [-5, -14], [-2, -15], [-1, -5], [1, -16], [4, -16], [4, -5], [6, -14], [9, -13], [8, -3], [11, -10], [13, -8], [9, 4], [8, 12]], 0.3, 3), col);
  return s.out();
}
export function headIcon(c, col = C.skin2, hair = C.greyHair) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 11, 16), 0.2, 3), col);
  let d = '';
  for (let i = 0; i < 7; i++) { const a = PI * (1.0 + i * 0.15); d += c.cut(c.circ(Math.cos(a) * 10, Math.sin(a) * 10, 4, 8), 0.2, 2); }
  s.p(d, hair);
  s.x(c.poly(c.circ(4, 0, 1.3, 6)), C.ink);
  return s.out();
}
/** a tiny paper figure (for the plates): standing, bowing or kneeling; origin at the feet, ~ 60 tall */
export function mini(c, o, { pose: P = 'stand', col, sc = 0.3 } = {}) {
  const src = col ? { ...o, robe: col, mantle: o.mantle ? shade(col, 0.08) : null, skin: col, hair: col, veil: col, veil2: col, beardColor: col, belt: null, halo: false } : o;
  const m = person(c, { ...src, pose: P, holdF: '', holdB: '' });
  return `<g transform="scale(${sc})">${col ? m.split(`fill="${C.blush}"`).join(`fill="${col}"`) : m}</g>`;
}
/** a small sandal lifted at the heel — the psalm's image (origin centre) */
export function heelIcon(c, col = '#4a3a44') {
  const s = sheet();
  s.p(c.cut([[-24, 8], [-18, -2], [-2, -8], [14, -18], [24, -16], [22, -8], [4, 4], [-16, 12]], 0.4, 4), col);
  s.p(c.ribbon([[-8, -4], [-2, 6]], 2.2) + c.ribbon([[6, -12], [10, 0]], 2.2), shade(col, 0.25));
  return s.out();
}
/** a path of little steps rising to a light (origin at the start, going up-right); .steps[data-i] */
export function stepPath(c, n = 7, { dx = 34, dy = -26, col = C.cream } = {}) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = i * dx, y = i * dy + (i % 2 ? 6 : -6);
    out += `<path data-i="${i}" d="${c.cut(c.ell(x, y, 7, 4.2, 10, -0.5), 0.2, 3)}" fill="${col}"/>`;
  }
  return out;
}

/* ====================================================================== the upper room with the table */
export const DISH = 832;
export const JX = 800;
/**
 * The upper room with the Twelve at the long table (Mark 14's room and seating). Options:
 *  wing — the side wall with the door on the right (for Judas' going out into the night).
 * Returns { R, at, by, seatL, behindL, midL, tabL, wallFx, W, SEAT, TOP, FLOOR, idle(t, T, low), sit(m, T, o) }.
 */
export function tableSet(S, { skyCols = EVE, wing = false, moon = true } = {}) {
  const c = S.c;
  const R = upperRoom(S, { skyCols });
  const { SEAT, TOP, FLOOR } = R;
  const wallFx = S.layer({ par: 0.31, sh: 0, flat: true });
  const W = wing ? doorWing(S) : null;
  const behindL = S.layer({ par: 0.5, sh: 5 });
  const seatL = S.layer({ par: 0.5, sh: 5 });
  const at = seatAll(S, seatL);
  const by = Object.fromEntries(at.map((m) => [m.k, m]));
  const midL = S.layer({ par: 0.5, sh: 5 });     // in front of the diners, behind the table (John leaning on His breast)
  const tabL = S.layer({ par: 0.55, sh: 6 });
  tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${supperTable(c, 860)}</g>`);
  const idle = (t, T, low = 0) => {
    R.lamps.forEach((l) => {
      swing(l.el, l.x, l.y, T, 1, 0.7, l.i);
      const k = 1 - low;
      pose(l.fl, { x: 26, y: 36, sx: k * (1 + Math.sin(T * 7 + l.i) * 0.08), sy: k * (1 + Math.sin(T * 5.3 + l.i) * 0.12) });
      fade(l.gl, 0.85 * k);
    });
  };
  const sit = (m, T, o = {}) => m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, armF: 36, armB: 14, head: 0, blink: blinkAt(T, m.seed), ...o });
  return { R, c, at, by, seatL, behindL, midL, tabL, wallFx, W, SEAT, TOP, FLOOR, idle, sit };
}

/**
 * The side wall on the right with the door (all on par 0.5, like the diners): a black night behind the doorway,
 * a layer for a figure going out, the wall, the door leaf (hinged at its left edge: set(open 0..1)).
 */
export const DOOR = { x0: 1240, d0: 1270, d1: 1372, top: 468 };
export function doorWing(S) {
  const c = S.c;
  const FLOOR = 712, { x0, d0, d1, top } = DOOR;
  const nightL = S.layer({ par: 0.5, sh: 0, flat: true });
  nightL.add(`<rect x="${d0 - 20}" y="${top - 40}" width="${d1 - d0 + 40}" height="${FLOOR - top + 42}" fill="#07081a"/>`);
  const outL = S.layer({ par: 0.5, sh: 2 });
  const wingL = S.layer({ par: 0.5, sh: 5 });
  const wcol = shade(mix(C.plaster, C.apricot, 0.22), -0.1);
  const w = sheet();
  const door = [[d0, FLOOR + 4], [d0, top], [d1, top], [d1, FLOOR + 4]];
  w.p(c.cut([[x0, -1200], [2500, -1200], [2500, FLOOR + 6], [x0 + 6, FLOOR + 6], [x0 - 4, 400], [x0, 220]], 0.8, 20) + c.hole(door, 0.4, 6), wcol);
  w.p(c.cut([[x0, -1200], [2500, -1200], [2500, 200], [x0, 200]], 0.6, 20), shade(C.wood2, -0.2));
  w.p(c.ribbon([[x0 + 2, 200], [x0 + 2, FLOOR + 4]], 7), shade(wcol, -0.12));
  w.p(c.ribbon([[d0 - 6, FLOOR + 4], [d0 - 6, top - 6], [d1 + 6, top - 6], [d1 + 6, FLOOR + 4]], 11), C.wood2);
  w.p(c.cut(c.rect(d0 - 22, top - 26, d1 - d0 + 44, 14), 0.3, 6), C.wood);
  w.p(c.cut(c.rect(d0 - 10, FLOOR - 2, d1 - d0 + 20, 8), 0.3, 6), shade(C.stone2, -0.1));
  wingL.add(w.out());
  const leafL = S.layer({ par: 0.5, sh: 5 });
  const lw = d1 - d0, lh = FLOOR - top;
  const lf = sheet();
  lf.p(c.cut(c.rect(0, 0, lw, lh), 0.4, 8), C.wood3);
  let planks = '';
  for (let x = lw / 4; x < lw; x += lw / 4) planks += c.ribbon([[x, 4], [x + c.rr(-1, 1), lh - 4]], 1.4);
  lf.x(planks, shade(C.wood3, -0.25), 'opacity=".7"');
  lf.p(c.cut(c.rect(4, lh * 0.2, lw - 8, 10), 0.3, 4) + c.cut(c.rect(4, lh * 0.72, lw - 8, 10), 0.3, 4), C.wood2);
  lf.p(c.cut(c.circ(lw - 14, lh * 0.52, 4, 8), 0.2, 3), C.ochre);
  const leaf = leafL.add(`<g>${lf.out()}</g>`);
  return {
    nightL, outL, wingL, leafL, leaf, ...DOOR, cx: (d0 + d1) / 2,
    set(open) { pose(leaf, { x: d0, y: top, sx: Math.max(0.1, 1 - open * 0.9) }); },
  };
}

/* ====================================================================== the foot-washing set */
/** the disciples on their cushions in front (facing right), the rest at the table behind */
export const WASH = {
  FRONT: 742,
  ROW: [['andrew', 230], ['john', 460], ['peter', 690], ['judas', 1000], ['thomas', 1210]],
  BACK: [['simonZ', 470], ['thaddaeus', 560], ['philip', 650], ['james', 740], ['matthew', 870], ['bartholomew', 960], ['jamesA', 1050]],
  KNEEL: 150,   // Jesus kneels this far to the right of the disciple whose feet He washes
};
export function washSet(S, { skyCols = EVE } = {}) {
  const c = S.c;
  const R = upperRoom(S, { skyCols });
  const { FLOOR } = R;
  const wallFx = S.layer({ par: 0.31, sh: 0, flat: true });
  // the table behind, the rest of the Twelve at it (smaller: further back)
  const backL = S.layer({ par: 0.42, sh: 4 });
  const BY = FLOOR - 34, BS = 0.74;
  const back = WASH.BACK.map(([k, x], i) => {
    const el = backL.add(withFace(person(c, { ...TW[k], pose: 'sit' }), faceBits(c)));
    return { k, x, i, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), flip: x > 800, seed: c.rr(0, 9), y: BY - 12 + (i % 2) * 2, s: BS };
  });
  const btL = S.layer({ par: 0.43, sh: 4 });
  btL.add(`<g transform="translate(800 ${BY}) scale(${BS})">${supperTable(c, 900)}</g>`);
  // the Master's empty place, His mantle folded on the cushion
  btL.add(`<g transform="translate(806 ${BY - 36})">${foldedCloth(c, 44, 11)}</g>`);
  // cushions and the row of disciples with bare feet
  const rowL = S.layer({ par: 0.55, sh: 5 });
  const F = WASH.FRONT;
  WASH.ROW.forEach(([, x]) => rowL.add(`<g transform="translate(${x + 4} ${F + 4})">${cushion(c, 124, mix(C.terracotta, C.clay, 0.4))}</g>`));
  const bas = basinParts(c, 84);
  const basinB = rowL.add(`<g>${bas.back}${bas.water}</g>`);
  const row = WASH.ROW.map(([k, x], i) => {
    const o = TW[k];
    const el = rowL.add(seatedBare(c, o));
    return {
      k, x, i, p: S.puppet(el), el, y: F, s: 0.96, seed: c.rr(0, 9),
      feet: el.querySelector('.feet'), dust: el.querySelector('.dust'), wet: el.querySelector('.wet'),
      sad: el.querySelector('[data-part="sad"]'), angry: el.querySelector('[data-part="angry"]'),
    };
  });
  const by = Object.fromEntries(row.map((m) => [m.k, m]));
  // Jesus: kneeling (girded), standing (girded)
  const jK = S.puppet(rowL.add(addToBody(withFace(person(c, { ...JESUS_TUNIC, pose: 'kneel' }), faceBits(c)), towelWrap(c, 'kneel'))));
  const jS = S.puppet(rowL.add(addToBody(person(c, JESUS_TUNIC), towelWrap(c, 'stand'))));
  const basinF = rowL.add(`<g>${bas.front}</g>`);
  const fx = S.layer({ par: 0.56, sh: 3 });
  const cloth = fx.add(`<g>${towelHeld(c, 44)}</g>`);
  const drops = fx.add(`<g>${splash(c, 16, 6)}</g>`);
  const idle = (t, T, low = 0) => {
    R.lamps.forEach((l) => {
      swing(l.el, l.x, l.y, T, 1, 0.7, l.i);
      pose(l.fl, { x: 26, y: 36, sx: (1 - low) * (1 + Math.sin(T * 7 + l.i) * 0.08), sy: (1 - low) * (1 + Math.sin(T * 5.3 + l.i) * 0.12) });
      fade(l.gl, 0.85 * (1 - low));
    });
  };
  /** place the basin at the feet of disciple m (0..1 visible) */
  const basinAt = (x, o = 1) => { vis(basinB, { x, y: F + 2, o }); vis(basinF, { x, y: F + 2, o }); };
  return { R, c, back, row, by, jK, jS, basinB, basinF, basinAt, cloth, drops, fx, rowL, backL, wallFx, F, FLOOR, idle };
}
/** where disciple m's feet are (world) */
export const feetAt = (m) => [m.x + 64 * m.s, m.y - 6];

/** a label on a string (tag) that comes down and swings; k 0..1 */
export function drop(el, x, y, k, T, { amp = 1, speed = 0.7, seed = 0, rise = 700 } = {}) {
  if (k <= 0.001) { pose(el, { x, y: y - rise, o: 0 }); return; }
  pose(el, { x, y: y - (1 - k) * rise, r: Math.sin(T * speed + seed) * amp, oy: 0, o: 1 });
}

/** "now / later": a hanging card — the left leaf (now: a grey cloud and a question), the right leaf folded
 *  against it (later: light over the basin and towel). Origin: the hinge at the top; pose .later with sx 0..1 to unfold it. */
export function nowLater(c, { w = 118, h = 104 } = {}) {
  const leaf = (fill) => sheet().p(c.cut(c.rect(0, 0, w, h), 0.5, 6), C.cream).p(c.cut(c.rect(5, 5, w - 10, h - 10), 0.4, 6), fill).out();
  const cloud = sheet().p(c.cut(c.blob(w / 2, h * 0.4, 30, 17, 12, 0.2), 0.8, 4), C.stone2).out();
  const q = `<g transform="translate(${w / 2} ${h * 0.4}) scale(1.1)"><path d="${c.ribbon([...c.arc(0, -6, 7, 7, PI * 1.02, PI * 2.5, 12), [0, 5]], 4)}" fill="${C.inkSoft}"/><path d="${c.poly(c.circ(0, 12, 2.6, 8))}" fill="${C.inkSoft}"/></g>`;
  const txt = (x, s) => `<text x="${x}" y="${h - 14}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${s}</text>`;
  const bas = basinParts(c, 46);
  const later = `<g class="later">${leaf(mix(C.parchment, C.halo, 0.5))}<circle cx="${w / 2}" cy="${h * 0.38}" r="44" fill="url(#halo-glow)"/><g transform="translate(${w / 2 - 4} ${h * 0.62})">${bas.back}${bas.water}${bas.front}</g><g transform="translate(${w / 2 + 30} ${h * 0.24}) rotate(20)">${towelHeld(c, 28)}</g>${txt(w / 2, tr('później', 'later'))}</g>`;
  const now = `<g transform="translate(${-w} 0)">${leaf(mix(C.parchment, C.stone2, 0.4))}${cloud}${q}${txt(w / 2, tr('teraz', 'now'))}</g>`;
  return `<path d="M${-w * 0.75} -1600V0M${-w * 0.1} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${now}${later}`;
}

/**
 * John, the disciple whom Jesus loved, reclining on His breast: a second John puppet in front of Jesus (behind the
 * table). set(k, T, o): k 0 → sitting upright in his place, 1 → leaning on Jesus' breast.
 */
export function beloved(S, T0) {
  const c = S.c, J = T0.by.john;
  const el = T0.midL.add(withFace(person(c, { ...TW.john, pose: 'sit' }), faceBits(c)));
  const p = S.puppet(el);
  return {
    p, el,
    /** returns false while John sits upright (then the scene poses him in his place as usual) */
    set(k, T, o = {}) {
      if (k <= 0.001) { p.set({ x: J.x, y: T0.SEAT, s: J.s, o: 0 }); return false; }
      J.p.set({ x: J.x, y: T0.SEAT + (J.i % 2) * 3, s: J.s, flip: false, o: 0 });
      p.set({ x: lerp(J.x, J.x + 26, k), y: T0.SEAT + (J.i % 2) * 3 - k * 8, s: J.s, flip: false, o: 1, armF: 36 + k * 14, armB: 14 + k * 10, lean: k * 14, head: -k * 8, blink: blinkAt(T, J.seed), ...o });
      return true;
    },
  };
}
