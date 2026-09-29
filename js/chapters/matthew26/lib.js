// Matthew 26 — the cast and cut-outs of the Passion's first night. Nearly all of it is Mark 14's (so the two Gospels
// look the same): the chief priests and Caiaphas, the lamp-lit chamber, the woman of Bethany and her alabaster flask,
// the upper room and the long table, the olive garden at night, the cup of light, the torchlit band (as John 18 cut
// it: dark shadow-play silhouettes whose flames are separate little pieces), the high priest's palace with its hall
// above and the courtyard fire below, the rooster. Matthew's own: the thirty pieces of silver weighed out on a
// balance, the city street and the house of "a certain man", the twelve legions of angels waiting in the sky, the
// sword that turns on the one who takes it, and the high priest's palace at dawn (a second sky that fades in).
import { C, CAST, person, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt } from '../kit.js';
import { band, stars, moon, house } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { firePit, fireFlames, hangingLamp, lampGlow, templeMini } from '../mark14/lib.js';

export {
  chamber, table, priest, priestOpts, highPriest, HP, scribe, scribeOpts, shadowPerson, hangingLamp, lampGlow, pawn, snare, discPlate,
  matzahRound, matzah, wordTag, speech, thought, headAt, hand, kf, moving, scrollOpen, lamb, vis, LOOK, TW, JESUS, withFace, faceBits, alabaster,
  nardMist, lowTable, bowl, loaf, cup, grapes, coin, coinStack, GLYPH, heart, spark, worldMap, MAP_SPOTS, womanCameo, linenCloth, hourglassParts,
  man, vignette, purse, upperRoom, supperTable, seatAll, SEATS, question, candle, garden, note, sheep, rooster, tally, signpost, voiceRings,
  zzz, cupOfLight, soulLight, wordSlip, shadowHand, torch, sword, club, cord, seal, say, guardOpts, templeMini, puzzle, crookedScroll,
  glory, heavenPanel, oilLamp, waterJar, drop, chalice, loafHalves, SEPIA, NIGHT, NIGHT2, DUSK, DAWN, PI, firePit, fireFlames, sparkle,
} from '../mark14/lib.js';
export { lightCrown } from '../mark8/lib.js';
export { scrap } from '../mark2/lib.js';
export { nightSet, gardenTrees, makeBand, bandPose, eleven, lamp, sheathed, paperEar, ropeHands, torchFlame, MALCHUS, MAID, nt, INK as BAND_INK } from '../john18/lib.js';
export { radiance, rayBurst, darkSheet, hungWord } from '../john1/lib.js';
export { iAm } from '../john8/lib.js';
export { nameTag, bubble, strip } from '../mark3/lib.js';
export { silver, silverStack, bigSun, hillCross } from '../matthew20/lib.js';
export { balance } from '../mark8/lib.js';
export { tr, C, CAST, person, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt, fade, attr };

export const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== skies */
export const EVE = ['#6d6a9e', '#c7959c', '#eab596'];
export const NIGHTFALL = ['#2a2f60', '#4d4a7c', '#7d6a8a'];
export const DEEP = ['#171b3c', '#262c58', '#3e416e'];
export const PREDAWN = ['#3b3f74', '#8a7aa0', '#d7a79a'];
export const MORNING = ['#bcd3d6', '#eee3c8', '#f6e3c4'];
export const SUNSET = ['#8f86ad', '#e3a58e', '#f3c79e'];

/** two skies, the second (created with rise: 0) cross-faded over the first with sky2.fade(k) */
export function twoSkies(S, a, b, o = {}) {
  const s1 = sky(S, a, o);
  const s2 = sky(S, b, { ...o, name: 'sky2', rise: 0 });
  s2.layer.fade(0);
  return { sky: s1, sky2: s2.layer };
}

/* ================================================================== the city street and the house of "a certain man" */
/**
 * A street in Jerusalem (after Mark 14's): roofs and the Temple behind, a row of houses, the city gate on the left,
 * the street floor, and on the right the house of the upper room — its first-floor front is a flap that folds down to
 * show the room, spread and ready. Build: streetSet(S) → .room() people/lamps → .facade(). Returns handles.
 */
export const HOUSE = { GY: 700, HX: 1180, HW: 380, H1: 520, H2: 318 };
export function streetSet(S, { skyCols = MORNING } = {}) {
  const c = S.c;
  const { GY, HX, HW, H1, H2 } = HOUSE;
  const sk = sky(S, skyCols);
  const far = S.layer({ par: 0.12, sh: 2 });
  let rf = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(-500, 2200), w = c.rr(50, 110), top = c.rr(400, 470); rf += c.cut(c.rect(x, top, w, 300), 0.4, 6); }
  far.add(sheet().p(rf, mix(C.plaster2, C.skyBlue2, 0.35)).out() + `<g transform="translate(560 420)">${templeMini(c, 1.5)}</g>`);
  const row = S.layer({ par: 0.3, sh: 3 });
  const walls = [C.plaster, mix(C.plaster, C.sand, 0.4), mix(C.plaster, C.apricot, 0.25), mix(C.plaster2, C.sand, 0.2)];
  let hs = '';
  [[-420, 150, 150], [-250, 120, 190], [-110, 160, 150], [360, 140, 170], [520, 170, 140], [700, 130, 190], [840, 120, 160]].forEach(([x, w, h], i) => {
    hs += house(c, x, GY - 60, w, h, { wall: walls[i % 4], shadow: shade(walls[i % 4], -0.1), stairs: false });
  });
  row.add(hs);
  const gate = sheet();
  gate.p(c.cut([[40, GY - 40], [40, 330], [300, 330], [300, GY - 40]], 0.6, 8) + c.hole([[110, GY - 38], [110, 470], ...c.arc(170, 470, 60, 60, Math.PI, 2 * Math.PI, 10), [230, GY - 38]], 0.4, 6), C.stone);
  let merl = '';
  for (let x = 40; x < 300; x += 26) merl += c.cut(c.rect(x, 314, 14, 18), 0.2, 4);
  gate.p(merl, C.stone2);
  row.add(`<path d="${c.poly([[110, GY - 38], [110, 470], ...c.arc(170, 470, 60, 60, Math.PI, 2 * Math.PI, 10), [230, GY - 38]])}" fill="${C.hillMid}"/>` + gate.out());
  const streetL = S.layer({ par: 0.38, sh: 3 });
  const st = sheet();
  st.p(c.cut([[-900, GY - 60], [2500, GY - 60], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.sand, 0.5));
  let cob = '';
  for (let i = 0; i < 90; i++) cob += c.cut(c.blob(c.rr(-600, 2200), c.rr(GY - 40, GY + 200), c.rr(10, 20), c.rr(5, 8), 8, 0.2), 0.4, 4);
  st.x(cob, shade(C.stone2, -0.1), 'opacity=".55"');
  streetL.add(st.out());
  // the room inside (behind its front)
  const X0 = HX - HW / 2, X1 = HX + HW / 2;
  const hIn = S.layer({ par: 0.42, sh: 3 });
  const inner = sheet();
  inner.p(c.cut([[X0, H1], [X0, H2], [X1, H2], [X1, H1]], 0.4, 8), mix(C.plaster, C.apricot, 0.3));
  inner.p(c.cut([[X0, H1], [X1, H1], [X1, H1 - 16], [X0, H1 - 16]], 0.3, 8), mix(C.terracotta, C.clay, 0.5));
  let pat = '';
  for (let x = X0 + 20; x < X1 - 10; x += 34) pat += c.cut(c.star(x, H1 - 8, 5, 2, 4, 0), 0.2, 3);
  inner.x(pat, C.cream, 'opacity=".7"');
  let cush = '';
  for (let x = X0 + 40; x < X1 - 30; x += 56) cush += c.cut(c.blob(x, H1 - 26, 24, 12, 10, 0.1), 0.4, 4);
  inner.p(cush, mix(C.jesusMantle, C.clay, 0.3));
  hIn.add(`<rect x="${X0}" y="${H2}" width="${HW}" height="${H1 - H2}" fill="${C.lampGlow}" opacity=".4"/>` + inner.out());
  const roomGlow = hIn.add(`<g><circle cx="${HX}" cy="${H1 - 80}" r="240" fill="url(#warm-glow)"/></g>`);
  return {
    sky: sk, roomGlow, X0, X1, DOORX: HX - 110,
    /** the facade: ground floor with its door, the outside stair, and the flap (the upper front, hinged at the bottom) */
    facade() {
      const hf = S.layer({ par: 0.42, sh: 5 });
      const wall = mix(C.plaster, C.sand, 0.25);
      const DOORX = HX - 110;
      const g = sheet();
      g.p(c.cut([[X0, GY - 56], [X0, H1], [X1, H1], [X1, GY - 56]], 0.5, 8) + c.hole([[DOORX - 30, GY - 54], [DOORX - 30, GY - 140], ...c.arc(DOORX, GY - 140, 30, 26, Math.PI, 2 * Math.PI, 8), [DOORX + 30, GY - 54]], 0.3, 5), wall);
      g.p(c.cut(c.rect(X0 - 8, H1 - 4, HW + 16, 12), 0.3, 8), C.wood2);
      g.p(c.cut(c.rect(X0 - 10, H2 - 14, HW + 20, 16), 0.4, 8), C.roof);
      g.p(c.cut(c.rect(HX + 60, GY - 150, 44, 34), 0.3, 5), C.soilDark);
      hf.add(`<path d="${c.poly([[DOORX - 30, GY - 54], [DOORX - 30, GY - 140], ...c.arc(DOORX, GY - 140, 30, 26, Math.PI, 2 * Math.PI, 8), [DOORX + 30, GY - 54]])}" fill="${mix(C.soilDark, C.wood2, 0.4)}"/>` + g.out());
      const stair = sheet();
      const nS = 9, stepW = 17, stepH = (GY - 56 - H1) / nS;
      const sp = [[X0 - nS * stepW - 14, GY - 56]];
      for (let i = 0; i < nS; i++) { const x = X0 - (nS - i) * stepW - 14, y = GY - 56 - (i + 1) * stepH; sp.push([x, y], [x + stepW, y]); }
      sp.push([X0, H1], [X0, GY - 56]);
      stair.p(c.cut(sp, 0.3, 6), mix(C.stone, C.sand, 0.3));
      hf.add(stair.out());
      const fl = sheet();
      fl.p(c.cut([[X0, 0], [X0, -(H1 - H2)], [X1, -(H1 - H2)], [X1, 0]], 0.5, 8), wall);
      fl.p(c.cut([[HX - 40, -30], [HX - 40, -110], ...c.arc(HX, -110, 40, 36, Math.PI, 2 * Math.PI, 8), [HX + 40, -30]], 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
      fl.p(c.cut(c.rect(HX - 150, -120, 40, 50), 0.3, 5) + c.cut(c.rect(HX + 110, -120, 40, 50), 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
      const flap = hf.add(`<g>${fl.out()}</g>`);
      return { flap };
    },
  };
}

/* ================================================================== the high priest's palace (Mark 14's), with a dawn sky */
/**
 * As mark14/lib palace(), plus a second sky (dawn) that can be cross-faded in with R.dawn.fade(k), and a low dawn glow.
 * Returns the same handles as palace(): { sky, dawn, dawnGlow, stars, moon, hang, hallLamps, P, HALL, YARD, HX0, HX1, HTOP, GATE, FIRE, SEATX, yard(), porch() }.
 */
export function palaceDawn(S, { skyCols = DEEP, dawnCols = PREDAWN } = {}) {
  const c = S.c;
  const P = 0.5;
  const HALL = 380, YARD = 760, HX0 = 650, HX1 = 1430, HTOP = 110, GATE = 190, FIRE = 520, SEATX = 1200;
  const sk = sky(S, skyCols, { bottom: 900 });
  const dawn = sky(S, dawnCols, { bottom: 900, name: 'dawnsky', rise: 0 }).layer;
  dawn.fade(0);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -900, x1: 2400, y0: -500, y1: 470, n: 90 }));
  const glowL = S.layer({ par: 0.06, sh: 0, flat: true });
  glowL.add(`<ellipse cx="200" cy="520" rx="1200" ry="280" fill="url(#warm-glow)" opacity=".9"/>`);
  glowL.fade(0);
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const moonEl = hanging(hangL, moon(c, 34), { x: 380, y: 150, len: 600 });
  const far = S.layer({ par: 0.16, sh: 2 });
  let hs = '';
  for (let i = 0; i < 22; i++) { const x = c.rr(-700, 2300), wv = c.rr(50, 110), top = c.rr(400, 480); hs += c.cut(c.rect(x, top, wv, 500), 0.4, 6); }
  far.add(sheet().p(hs, mix(C.plaster2, C.indigo, 0.62)).out());

  const wall = mix(C.plaster, C.indigo, 0.3), wall2 = mix(C.plaster2, C.indigo, 0.38), stone = mix(C.stone, C.indigo, 0.3);
  const bld = S.layer({ par: P, sh: 3 });
  const b = sheet();
  b.p(c.cut([[-900, 470], [2500, 470], [2500, YARD + 4], [-900, YARD + 4]], 1, 14), wall2);
  let crs = '';
  for (let y = 494; y < YARD; y += 26) crs += c.ribbon([[-900, y], [2500, y + c.rr(-1, 1)]], 1.2);
  b.x(crs, shade(wall2, -0.12), 'opacity=".55"');
  b.p(c.cut([[-900, 458], [2500, 458], [2500, 474], [-900, 474]], 0.6, 12), shade(wall2, -0.14));
  b.p(c.cut([[HX0 - 20, 404], [HX0 - 20, HTOP - 24], [HX1 + 20, HTOP - 24], [HX1 + 20, 404]], 0.8, 12), wall);
  b.p(c.cut([[HX0 - 36, HTOP - 40], [HX1 + 36, HTOP - 40], [HX1 + 36, HTOP - 20], [HX0 - 36, HTOP - 20]], 0.5, 10), shade(wall, -0.2));
  let arches = '';
  for (let x = HX0; x < HX1 - 40; x += 195) arches += c.cut([[x + 20, YARD], [x + 20, 520], ...c.arc(x + 97, 520, 77, 70, Math.PI, 2 * Math.PI, 12), [x + 174, YARD]], 0.4, 6);
  b.p(c.cut([[HX0 - 20, 404], [HX1 + 20, 404], [HX1 + 20, YARD], [HX0 - 20, YARD]], 0.6, 10), wall);
  b.p(arches, mix(C.night, C.plumRobe, 0.3));
  b.p(c.cut([[HX0 - 30, HALL], [HX1 + 30, HALL], [HX1 + 30, HALL + 26], [HX0 - 30, HALL + 26]], 0.5, 10), shade(C.stone2, -0.28));
  bld.add(b.out());
  const hi = sheet();
  hi.p(c.cut([[HX0, HALL], [HX0, HTOP], [HX1, HTOP], [HX1, HALL]], 0.8, 14), mix(C.plaster, C.apricot, 0.25));
  let panels = '';
  for (let x = HX0 + 40; x < HX1 - 100; x += 170) if (Math.abs(x + 50 - SEATX) > 120) panels += c.cut([[x, HALL - 26], [x, HTOP + 100], ...c.arc(x + 50, HTOP + 100, 50, 44, Math.PI, 2 * Math.PI, 10), [x + 100, HALL - 26]], 0.4, 6);
  hi.p(panels, mix(C.plaster2, C.clay, 0.22));
  hi.p(c.cut([[HX0, HALL - 16], [HX1, HALL - 16], [HX1, HALL], [HX0, HALL]], 0.4, 10), mix(C.stone2, C.clay, 0.3));
  hi.p(c.cut([[SEATX - 110, HTOP + 16], [SEATX + 110, HTOP + 16], [SEATX + 100, HALL - 24], [SEATX - 100, HALL - 24]], 0.6, 8), shade(C.indigo, 0.2));
  hi.p(c.ribbon([[SEATX - 120, HTOP + 16], [SEATX + 120, HTOP + 16]], 8), C.sun);
  hi.p(c.cut([[SEATX - 40, HALL - 16], [SEATX - 40, HALL - 150], [SEATX + 40, HALL - 150], [SEATX + 40, HALL - 16]], 0.4, 6), C.wood);
  hi.p(c.cut(c.rect(SEATX - 46, HALL - 158, 92, 12), 0.3, 6), C.sun);
  hi.p(c.cut(c.rect(SEATX - 52, HALL - 66, 104, 16), 0.3, 6), mix(C.wood, C.plumRobe, 0.3));
  bld.add(`<rect x="${HX0}" y="${HTOP}" width="${HX1 - HX0}" height="${HALL - HTOP}" fill="${C.lampGlow}" opacity=".3"/>` + hi.out());
  const lampL = S.layer({ par: P, sh: 3 });
  const hallLamps = [840, 1320].map((x) => {
    const gl = lampL.add(lampGlow(x, HTOP + 24));
    const el = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x, y: HTOP + 24, len: 40 });
    return { el, x, y: HTOP + 24, fl: el.querySelector('.flame'), gl };
  });
  return {
    sky: sk, dawn, dawnGlow: glowL, stars: starL, moon: moonEl, hang: hangL, hallLamps, P, HALL, YARD, HX0, HX1, HTOP, GATE, FIRE, SEATX,
    yard() {
      const yardL = S.layer({ par: P, sh: 3 });
      const yf = sheet();
      yf.p(c.cut([[-900, YARD], [2500, YARD], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.indigo, 0.34));
      let tl = '';
      for (let r = 0; r < 6; r++) tl += c.ribbon([[-900, YARD + 14 + r * r * 9 + r * 14], [2500, YARD + 14 + r * r * 9 + r * 14 + c.rr(-2, 2)]], 1.4);
      yf.x(tl, shade(C.stone2, -0.4), 'opacity=".5"');
      yardL.add(yf.out());
      const st = sheet();
      const n = 14, sx0 = HX1 + 170, sx1 = HX1 + 10;
      let steps = '';
      for (let i = 0; i < n; i++) { const u = (i + 1) / n, x = lerp(sx0, sx1, u), y = lerp(YARD, HALL, u); steps += c.cut(c.rect(x - 4, y, 40, YARD - y), 0.3, 6); }
      st.p(steps, stone);
      yardL.add(st.out());
      yardL.add(`<g transform="translate(${FIRE} ${YARD + 30})">${firePit(c, 120)}</g>`);
      const glowL2 = S.layer({ par: P, sh: 0, flat: true });
      glowL2.add(`<g><circle cx="${FIRE}" cy="${YARD - 40}" r="380" fill="url(#warm-glow)"/></g>`);
      const fireL = S.layer({ par: P, sh: 2 });
      const fireFl = fireL.add(`<g transform="translate(${FIRE} ${YARD + 30})">${fireFlames(c, 120)}</g>`);
      return { yardL, fireL, glowL: glowL2, fireFl, tongues: Array.from(fireFl.querySelectorAll('.tongue')) };
    },
    porch() {
      const porchL = S.layer({ par: P, sh: 5 });
      const ps = sheet();
      const arch = [[GATE - 54, YARD + 2], [GATE - 54, 600], ...c.arc(GATE, 600, 54, 54, Math.PI, 2 * Math.PI, 10), [GATE + 54, YARD + 2]];
      ps.p(c.cut([[GATE - 100, YARD + 40], [GATE - 100, 440], [GATE + 100, 440], [GATE + 100, YARD + 40]], 0.6, 8) + c.hole(arch, 0.4, 6), stone);
      ps.p(c.cut([[GATE - 116, 440], [GATE + 116, 440], [GATE + 106, 420], [GATE - 106, 420]], 0.4, 8), shade(stone, -0.15));
      porchL.add(ps.out());
      return porchL;
    },
  };
}
/** idle for the palace: hall lamps swing & flicker, fire tongues; ember 0 (burning) → 1 (low) */
export function palaceIdle(R, Y, T, ember = 0, still = 0) {
  R.hallLamps.forEach((l, i) => { swing(l.el, l.x, l.y, T * (1 - still), 0.8, 0.7, i); pose(l.fl, { x: 26, y: 36, sx: 1 + (T ? Math.sin(T * 7 + i) * 0.08 * (1 - still) : 0), sy: 1 + (T ? Math.sin(T * 5.3 + i) * 0.1 * (1 - still) : 0) }); });
  swing(R.moon, 380, 150, T, 1, 0.6);
  if (Y) {
    Y.tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: (1 - ember * 0.75) * (0.85 + (T ? Math.sin(T * (6 + i) + i) * 0.15 : 0)), sx: 1 + (T ? Math.sin(T * 5 + i * 2) * 0.06 : 0) }));
    Y.glowL.fade((0.85 + (T ? Math.sin(T * 4) * 0.08 : 0)) * (1 - ember * 0.6));
  }
}

/* ================================================================== small pieces */
/** one angel of the legions at (x, y): a small figure of light with wings (origin: feet) → { w, b } path data */
export function angelMark(c, x = 0, y = 0, sc = 1) {
  const P = (px, py) => [x + px * sc, y + py * sc];
  const w = c.cut([P(0, -30), P(-10, -40), P(-24, -52), P(-30, -44), P(-22, -34), P(-26, -26), P(-12, -24)], 0.3, 3) +
    c.cut([P(0, -30), P(10, -40), P(24, -52), P(30, -44), P(22, -34), P(26, -26), P(12, -24)], 0.3, 3);
  const b = c.cut([P(-8, 0), P(-5, -26), P(5, -26), P(8, 0)], 0.3, 3) + c.cut(c.circ(x, y - 34 * sc, 5.5 * sc, 10), 0.2, 3);
  return { w, b };
}
/**
 * The twelve legions: rank upon rank of little angels of light in the night sky, one sheet (fade it with L.fade).
 * cx, cy: centre; returns markup.
 */
export function legions(c, cx = 800, cy = 260, { cols = 12, rows = 4, dx = 70, dy = 62 } = {}) {
  let W = '', B = '', glow = '';
  for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) {
    const x = cx + (i - (cols - 1) / 2) * dx + (r % 2 ? dx / 2 : 0) + c.rr(-6, 6), y = cy + (r - (rows - 1) / 2) * dy + c.rr(-5, 5);
    const a = angelMark(c, x, y, 0.9 - r * 0.08 + c.rr(-0.05, 0.05));
    W += a.w; B += a.b;
    if (i % 3 === 1) glow += `<circle cx="${x.toFixed(0)}" cy="${(y - 30).toFixed(0)}" r="70" fill="url(#halo-glow)" opacity=".5"/>`;
  }
  return `${glow}<path d="${W}" fill="#fff6dc" opacity=".92"/><path d="${B}" fill="${C.halo}"/>`;
}
/** a sword on a round plate that breaks in two (for "all who take the sword"): { plate, a, b } — a/b are the blade halves (origin: break point) */
export function swordHalves(c, len = 120) {
  const blade = mix(C.stone, C.skyBlue2, 0.4);
  const a = sheet().p(c.cut([[-4, 0], [4, 0], [3.4, -len * 0.5], [0, -len * 0.5 - 12], [-3.4, -len * 0.5]], 0.2, 5), blade).x(c.ribbon([[0, -4], [0, -len * 0.5 + 4]], 1), '#fff', 'opacity=".6"').out();
  const b = sheet().p(c.cut([[-4, 0], [4, 0], [4, len * 0.34], [-4, len * 0.34]], 0.2, 5), blade)
    .p(c.cut(c.rect(-16, len * 0.34, 32, 7), 0.2, 3), C.wood2).p(c.cut(c.rect(-3.5, len * 0.34 + 7, 7, 22), 0.2, 3), C.leather).out();
  return { a, b };
}
/** a bubble with a dark lip-print of a kiss (the sign): origin at the tail tip */
export function kissIcon(c) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-8, -8], [0, -4], [8, -8], [16, 0], [8, 7], [-8, 7]], 0.4, 3), C.terracotta);
  s.x(c.ribbon([[-14, 0], [14, 0]], 1.2), shade(C.terracotta, -0.3));
  return s.out();
}
/** a paper flame of the dawn — a thin pink band along the horizon (flat, for fading) */
export function dawnBand(c, y = 470) {
  return `<rect x="-3000" y="${y - 60}" width="8000" height="120" fill="${C.dawn}" opacity=".35"/>`;
}
/** an opened hand-letter (the host's message): a small parchment with an hourglass on it; origin centre */
export function messageCard(c, text, { size = 17, w = 210 } = {}) {
  const hh = size * 3.4;
  const s = sheet().p(c.cut([[-w / 2, -hh / 2], [w / 2, -hh / 2 - 2], [w / 2 + 2, hh / 2], [-w / 2 - 1, hh / 2 + 1]], 0.5, 6), C.parchment);
  s.x(c.ribbon([[-w / 2 + 8, -hh / 2 + 6], [w / 2 - 8, -hh / 2 + 5]], 1), C.wood3, 'opacity=".5"');
  const lines = Array.isArray(text) ? text : [text];
  const tx = lines.map((l, i) => `<text x="${14}" y="${(-hh / 2 + size * 1.35 + i * size * 1.25).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${l}</text>`).join('');
  return s.out() + tx;
}

/* ================================================================== the arrest: where everyone stands (after John 18) */
/** the great crowd from the chief priests and elders: torches, swords, clubs (no Romans in Matthew) */
export const MOB = [
  { kind: 'torch', x: 612, y: 8 }, { kind: 'sword', x: 566, y: -10 }, { kind: 'club', x: 520, y: 10 }, { kind: 'torch', x: 474, y: -16 },
  { kind: 'sword', x: 430, y: 6 }, { kind: 'club', x: 386, y: -20, s: 0.94 }, { kind: 'torch', x: 340, y: 8 }, { kind: 'club', x: 294, y: -18, s: 0.92 },
  { kind: 'sword', x: 246, y: 4 }, { kind: 'torch', x: 200, y: -16, s: 0.92 }, { kind: 'club', x: 150, y: 8 }, { kind: 'torch', x: 100, y: -12, s: 0.9 },
];
/** the Eleven, facing the band */
export const ELEVEN = [
  { k: 'peter', x: 900, y: 4 }, { k: 'john', x: 948, y: -22, s: 0.86 }, { k: 'james', x: 990, y: 8 }, { k: 'andrew', x: 1036, y: -24, s: 0.86 }, { k: 'thomas', x: 1080, y: 6 },
  { k: 'philip', x: 1122, y: -26, s: 0.84 }, { k: 'matthew', x: 1160, y: 4 }, { k: 'bartholomew', x: 1200, y: -24, s: 0.84 }, { k: 'jamesA', x: 1240, y: 8 },
  { k: 'thaddaeus', x: 1282, y: -22, s: 0.84 }, { k: 'simonZ', x: 1320, y: 6 },
];

