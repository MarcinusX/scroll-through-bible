// John 9 — the cast and cut-outs of the chapter: the man born blind (begging by a Temple gate, then seeing),
// his frightened old parents, the neighbours, the officials of the hall (some Pharisees — never a whole people),
// the gate street under the Temple wall, the stepped pool of Siloam, and the Pharisees' hall with its door.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt } from '../kit.js';
import { hillsWith, sun, moon, stars, cloud, olive, cypress, bush, rock, palm, flowers, grass, house } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, GLYPH, spark, heart, candle, sabbathTag, scrap, dust, scrollOpen } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, shadowPerson, sparkle } from '../mark3/lib.js';
export { voiceRings, hang2, tagOnString, plate, signpost, flame } from '../mark1/lib.js';
export { say, slip, qmark, bang, beggarBowl, cloakSpread, lawTablets, tablet } from '../mark10/lib.js';
export { globe, glory, soulLight, lightCrown, heavenPanel } from '../mark8/lib.js';
export { storyFrame, SEPIA, crossX, tick, disc } from '../mark6/lib.js';
export { sanctuary, portico } from '../mark11/lib.js';
export { tint } from '../mark13/lib.js';
export { vis } from '../mark14/lib.js';
export { medallion, miniHead } from '../mark16/lib.js';
export { sundial, darkSheet, rayBurst, radiance, hungWord, hungPlate, hungGold, goldWord, iconWord, crossOut, MOSES, glowDisc, bust } from '../john1/lib.js';
export { signBadge, iconBubble } from '../john2/lib.js';
export { beamGrad, lightBeam, darkPool, cradle, baby } from '../john3/lib.js';
export { dayArc, hourAt, sunToken, roundel, panel, sepia } from '../john4/lib.js';
export { leaderOpts } from '../john5/lib.js';
export { iAm, framed, numberCard } from '../john8/lib.js';
export { harp } from '../mark12/lib.js';
export { crownIcon } from '../mark13/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, crowdPerson, lerp, blinkAt };

import { withFace as withFace3, faceBits as faceBits3 } from '../mark3/lib.js';
import { addToHead as addToHead2 } from '../mark2/lib.js';
import { sanctuary as sanct11, portico as portico11 } from '../mark11/lib.js';
import { beggarBowl as bowl10, cloakSpread as cloak10 } from '../mark10/lib.js';
import { candle as candleM } from '../mark2/lib.js';
import { lawTablets as tablets10 } from '../mark10/lib.js';
import { MOSES as MOSES1 } from '../john1/lib.js';
import { leaderOpts as lead5 } from '../john5/lib.js';
import { miniHead as mini16 } from '../mark16/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const INK = '#3b2a22';

/* ====================================================================== skies */
export const DAY = ['#cfe2dc', '#f0e7cd', '#f7ead0'];
export const NOON = ['#c9e0de', '#f1ead2', '#f8eed6'];
export const EVE = ['#c7a9ae', '#efc59f', '#f6ddb9'];
export const DUSK = ['#5f5b8c', '#b98c99', '#e9b297'];
export const NIGHTS = ['#1e2552', '#2f3668', '#50507e'];
export const HALL = ['#b9a282', '#d3bd98', '#e2cfae'];

/* ====================================================================== the cast */
/** the man born blind: a worn sand-grey robe, a faded blue mantle, curly dark hair, a young short beard */
export const BLIND = {
  robe: mix(C.stone2, C.sand2, 0.5), mantle: mix(C.dustyBlue, C.stone2, 0.55), hair: C.hair3, hairStyle: 'curly', beard: 'short',
  skin: C.skin3, belt: C.rope, eyes: 'closed',
};
/** the same man, seeing: eyes open, a gold sash of joy */
export const SEER = { ...BLIND, eyes: 'open', belt: C.sun };
/** his old parents — the same skin as their son, greyed, careful clothes */
export const FATHER = {
  robe: C.stone2, mantle: mix(C.dustyBlue, C.stone, 0.45), hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.stone2,
  beard: 'full', beardColor: '#e3ddd2', skin: C.skin3, belt: C.rope,
};
export const MOTHER = {
  robe: mix(C.mauve, C.stone, 0.35), mantle: mix(C.plumRobe, C.stone, 0.4), hairStyle: 'veil', veil: mix(C.lavender, C.stone, 0.35),
  veil2: shade(mix(C.lavender, C.stone, 0.35), -0.12), hair: C.greyHair, skin: C.skin3,
};
/** the disciples on the road */
export const DISC = [CAST.peter, CAST.john, CAST.andrew, CAST.thomas];
/** one of the officials of the hall (some Pharisees): the John 5 leaders' looks */
export const official = (i) => lead5(i);
/** a neighbour from the lanes by the gate; i fixes man / woman */
export function neighbour(c, i, extra = {}) {
  const o = crowdPerson(c);
  if (i % 2 === 1) { o.hairStyle = 'veil'; o.beard = 'none'; } else if (o.hairStyle === 'veil') { o.hairStyle = ['short', 'wrap', 'curly'][i % 3]; o.beard = ['full', 'short', 'none'][i % 3]; }
  return { ...o, ...extra };
}

/* ====================================================================== the man's pieces */
/** two dabs of clay over the closed eyes (head coords), hidden: data-part="clay" */
export function clayEyes(c) {
  const col = mix(C.soil, C.clay, 0.35);
  return `<g data-part="clay" opacity="0"><path d="${c.cut(c.blob(4.2, -2.6, 5, 3.6, 9, 0.2), 0.3, 2) + c.cut(c.blob(12.6, -2.8, 4.2, 3.4, 9, 0.2), 0.3, 2)}" fill="${col}"/><path d="${c.poly(c.ell(3.2, -4, 1.6, 0.8, 6)) + c.poly(c.ell(11.8, -4.2, 1.4, 0.7, 6))}" fill="${shade(col, 0.35)}" opacity=".7"/></g>`;
}
/** a blind man's walking stick held in the hand (hold coords: the arm hangs along +y) */
export function stick(c, len = 100) {
  return sheet().p(c.ribbon([[0, -26], [0.6, len * 0.5], [1, len]], 3.6), C.wood2).out();
}
/** a man puppet with face bits (+ clay dabs); returns { p, el, clay, sad, angry, tear } */
export function manPuppet(S, L, look, { pose: P = 'stand', clay = false, holdF = '', holdB = '', c = S.c } = {}) {
  let m = person(c, { ...look, pose: P, holdF, holdB });
  m = withFace3(m, faceBits3(c) + (clay ? clayEyes(c) : ''));
  const el = L.add(m);
  const q = (k) => el.querySelector(`[data-part="${k}"]`);
  return { p: S.puppet(el), el, clay: q('clay'), sad: q('sad'), angry: q('angry'), tear: q('tear') };
}
/** a face-bit puppet for anybody (officials, neighbours, parents) */
export function facePuppet(S, L, look, { pose: P = 'stand', c = S.c, holdF = '', holdB = '' } = {}) {
  const el = L.add(withFace3(person(c, { ...look, pose: P, holdF, holdB }), faceBits3(c)));
  const q = (k) => el.querySelector(`[data-part="${k}"]`);
  return { p: S.puppet(el), el, sad: q('sad'), angry: q('angry'), tear: q('tear') };
}

/* ====================================================================== icons */
/** an eye: open (white, iris, glint) or closed (a lid line with lashes); origin centre */
export function eyeIcon(c, { r = 26, open = true, col = C.teal2 } = {}) {
  const s = sheet();
  const almond = [...c.arc(0, r * 0.62, r * 1.18, r * 1.1, PI * 1.25, PI * 1.75, 12), ...c.arc(0, -r * 0.62, r * 1.18, r * 1.1, PI * 0.25, PI * 0.75, 12)];
  if (open) {
    s.p(c.cut(almond, 0.3, 4), C.linen);
    s.p(c.cut(c.circ(0, 0, r * 0.46, 20), 0.2, 3), col);
    s.x(c.poly(c.circ(0, 0, r * 0.2, 12)), C.inkSoft);
    s.x(c.poly(c.circ(r * 0.14, -r * 0.14, r * 0.08, 8)), '#fff');
    s.x(c.ribbon(c.arc(0, r * 0.62, r * 1.18, r * 1.1, PI * 1.25, PI * 1.75, 12), 2.2), C.inkSoft);
  } else {
    s.p(c.cut([...c.arc(0, -r * 0.62, r * 1.18, r * 1.1, PI * 0.25, PI * 0.75, 12)], 0.3, 4), mix(C.skin3, C.stone2, 0.3));
    s.x(c.ribbon(c.arc(0, -r * 0.62, r * 1.18, r * 1.1, PI * 0.25, PI * 0.75, 12), 2.4), C.inkSoft);
    let lash = '';
    for (let i = 0; i < 5; i++) { const a = PI * (0.33 + i * 0.085); const x = Math.cos(a) * r * 1.18, y = -r * 0.62 + Math.sin(a) * r * 1.1; lash += c.ribbon([[x, y], [x * 1.08, y + r * 0.2]], 1.5); }
    s.x(lash, C.inkSoft);
  }
  return s.out();
}
/** a little mound of clay with two finger dents (origin: bottom centre) */
export function clayLump(c, r = 20) {
  const col = mix(C.clay, C.soil, 0.5);
  return sheet().p(c.cut([[-r, 0], ...c.arc(0, 0, r, r * 0.7, PI, 2 * PI, 12), [r, 0]], 0.4, 4), col)
    .x(c.poly(c.ell(-r * 0.3, -r * 0.42, r * 0.16, r * 0.08, 8)) + c.poly(c.ell(r * 0.26, -r * 0.36, r * 0.14, r * 0.07, 8)), shade(col, -0.3), 'opacity=".7"').out();
}
/** a tiny water pool with steps and a ripple (origin centre) */
export function poolIcon(c, r = 26) {
  const s = sheet();
  s.p(c.cut([[-r, -r * 0.2], [-r * 0.6, -r * 0.2], [-r * 0.6, 0], [-r * 0.25, 0], [-r * 0.25, r * 0.2], [r, r * 0.2], [r, r * 0.7], [-r, r * 0.7]], 0.3, 4), C.stone2);
  s.p(c.cut([[-r * 0.2, r * 0.22], [r * 0.98, r * 0.22], [r * 0.98, r * 0.66], [-r * 0.2, r * 0.66]], 0.2, 4), C.lake);
  s.x(c.ribbon(c.arc(r * 0.4, r * 0.34, r * 0.28, r * 0.08, 0, PI * 2, 14), 1.2), C.foam);
  return s.out();
}
/** a row of three rounded picture tiles joined by arrows: clay → Siloam → an open eye (origin centre) */
export function threeTiles(c, { w = 70, gap = 26, bg = C.parchment } = {}) {
  const s = sheet();
  const xs = [-(w + gap), 0, w + gap];
  xs.forEach((x) => s.p(c.cut(c.rect(x - w / 2, -w / 2, w, w), 0.5, 6), C.cream).p(c.cut(c.rect(x - w / 2 + 5, -w / 2 + 5, w - 10, w - 10), 0.3, 6), bg));
  let arr = '';
  [-(w + gap) / 2, (w + gap) / 2].forEach((x) => { arr += c.ribbon([[x - 9, 0], [x + 5, 0]], 3) + c.poly([[x + 4, -6], [x + 12, 0], [x + 4, 6]]); });
  s.x(arr, C.terracotta);
  return `${s.out()}<g transform="translate(${xs[0]} 14)">${clayLump(c, 20)}</g><g transform="translate(0 0)">${poolIcon(c, 25)}</g><g transform="translate(${xs[2]} 0)"><circle r="30" fill="url(#warm-glow)"/>${eyeIcon(c, { r: 18 })}</g>`;
}
/** a square picture card hung on two strings (origin: top centre); inner drawn around (0, w/2) */
export function storyTile(c, inner, { w = 124, bg = C.parchment, label = '' } = {}) {
  const s = sheet().p(c.cut(c.rect(-w / 2, 0, w, w), 0.5, 6), C.cream).p(c.cut(c.rect(-w / 2 + 6, 6, w - 12, w - 12), 0.3, 6), bg);
  const lab = label ? `<text x="0" y="${w - 12}" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${label}</text>` : '';
  return `<path d="M${-w * 0.3} -1600V0M${w * 0.3} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<g transform="translate(0 ${w / 2 - (label ? 8 : 0)})">${inner}</g>${lab}`;
}
/** a closed eye with two dabs of clay (origin centre) */
export function clayEye(c, r = 22) {
  const col = mix(C.clay, C.soil, 0.5);
  return eyeIcon(c, { r, open: false }) + `<path d="${c.cut(c.blob(0, -r * 0.1, r * 0.8, r * 0.5, 9, 0.25), 0.4, 3)}" fill="${col}"/>`;
}
/** a jagged crack of division (origin top; grows down to h) */
export function crack(c, h = 220, col = '#3b2a36') {
  const pts = [];
  for (let i = 0; i <= 12; i++) pts.push([(i % 2 ? 1 : -1) * c.rr(4, 12), (h * i) / 12]);
  return `<path d="${c.ribbon(pts, (u) => 5 - u * 3)}" fill="${col}"/>`;
}
/** a gold rayed badge of a "sign" with an inner picture (origin centre) */
export function signSeal(c, inner, r = 30) {
  const s = sheet();
  let rays = '';
  for (let i = 0; i < 14; i++) { const a = (i / 14) * PI * 2; rays += c.poly([[Math.cos(a - 0.1) * (r + 2), Math.sin(a - 0.1) * (r + 2)], [Math.cos(a) * (r + 15), Math.sin(a) * (r + 15)], [Math.cos(a + 0.1) * (r + 2), Math.sin(a + 0.1) * (r + 2)]]); }
  s.x(rays, C.sun, 'opacity=".9"');
  s.p(c.cut(c.circ(0, 0, r + 4, 30), 0.3, 4), C.haloRim).p(c.cut(c.circ(0, 0, r, 30), 0.3, 4), C.cream);
  return s.out() + inner;
}
/** two Sabbath candles side by side (origin: between their bases) */
export function twoCandles(c, sc = 0.5) {
  return `<g transform="translate(-16 0) scale(${sc})">${candleM(c, 40)}</g><g transform="translate(16 0) scale(${sc})">${candleM(c, 40)}</g>`;
}
/** a prophet's head on a plate with the word "prophet" */
export function prophetIcon(c) {
  const o = { skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair };
  const scroll = sheet().p(c.cut(c.rect(-14, -5, 28, 10), 0.3, 4), C.parchment).p(c.cut(c.ell(-15, 0, 3, 7, 8), 0.2, 3) + c.cut(c.ell(15, 0, 3, 7, 8), 0.2, 3), C.wood2).out();
  return `<g transform="translate(0 -14)">${mini16(c, o, 26)}</g><g transform="translate(30 12) rotate(-20)">${scroll}</g>`;
}
/** a dark scrap of "sin?" (origin centre) */
export function darkScrap(c, r = 16, col = '#3a3450') {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.72, 8, 0.35), 1.2, 4), col).out();
}
/** a small door with a dark bar across it (exclusion from the synagogue); origin: bottom centre */
export function barredDoor(c, { w = 56, h = 84, bar = true } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 10, 0], [-w / 2 - 10, -h - 10], [w / 2 + 10, -h - 10], [w / 2 + 10, 0]], 0.4, 5), mix(C.stone, C.cream, 0.2));
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.3, 5), C.wood);
  s.x(c.ribbon([[-w / 6, -h + 4], [-w / 6, -4]], 1.4) + c.ribbon([[w / 6, -h + 4], [w / 6, -4]], 1.4), shade(C.wood, -0.25), 'opacity=".7"');
  const b = bar ? sheet().p(c.cut([[-w / 2 - 16, -h * 0.55], [w / 2 + 16, -h * 0.62], [w / 2 + 16, -h * 0.5], [-w / 2 - 16, -h * 0.43]], 0.3, 5), '#2c2430').out() : '';
  return s.out() + b;
}
/** a ring of sound (a full circle ribbon); origin centre */
export function soundRing(c, r = 30, w = 3, col = C.cream) {
  return `<path d="${c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 30), w)}" fill="${col}"/>`;
}
/**
 * Sounds heard in the dark: n full rings that swell and fade from a point. Returns fn(x, y, on, time, {sy, spread, speed}).
 */
export function soundRings(L, c, { n = 3, r = 16, w = 2.6, col = mix(C.cream, C.halo, 0.4) } = {}) {
  const els = Array.from({ length: n }, (_, i) => ({ i, el: L.add(`<g opacity="0">${soundRing(c, r, w, col)}</g>`) }));
  return (x, y, on, time, { sy = 1, spread = 2.6, speed = 0.55, s0 = 0.5, ph = 0 } = {}) => {
    els.forEach(({ el, i }) => {
      if (on <= 0.001) { pose(el, { x, y, o: 0 }); return; }
      const k = time ? (time * speed + i / n + ph) % 1 : (i + 1) / (n + 0.5);
      pose(el, { x, y, s: s0 + k * spread, sy, o: on * (1 - k) * 0.9 });
    });
  };
}
/** a pane of dark smoked glass on a frame, hung from the flies (origin top centre) */
export function darkGlass(c, { w = 300, h = 330 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.5, 8) + c.hole(c.rect(-w / 2, 0, w, h), 0.3, 8), mix(C.wood2, C.storm2, 0.3));
  const glass = `<path d="${c.poly(c.rect(-w / 2, 0, w, h))}" fill="#232238" opacity=".52"/>`;
  const shine = `<path d="${c.poly([[-w / 2 + 30, 0], [-w / 2 + 70, 0], [-w / 2 + 10, h * 0.5], [-w / 2, h * 0.5], [-w / 2, h * 0.3]])}" fill="#fff" opacity=".08"/><path d="${c.poly([[w / 2 - 60, h], [w / 2 - 40, h], [w / 2, h * 0.7], [w / 2, h * 0.62]])}" fill="#fff" opacity=".06"/>`;
  return `<path d="M${-w * 0.35} -1600V-12M${w * 0.35} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${glass}${shine}`;
}
/** a two-faced round plate: the dark face (a closed eye in the night) and the gold face (an open eye in the sun).
 *  Returns { dark, gold } markup, each origin centre; flip one into the other with sx. */
export function eyePlate(c, r = 92) {
  const rim = (fill, rimC) => sheet().p(c.cut(c.circ(0, 0, r + 8, 44), 0.5, 5), rimC).p(c.cut(c.circ(0, 0, r, 44), 0.4, 5), fill).out();
  let st = '';
  for (let i = 0; i < 9; i++) { const a = c.rr(0, PI * 2), d = c.rr(r * 0.45, r * 0.85); st += c.poly(c.star(Math.cos(a) * d, Math.sin(a) * d, 4, 1.6, 4, 0)); }
  const dark = `${rim('#262a55', mix(C.storm2, C.wood2, 0.4))}<path d="${st}" fill="${C.star}" opacity=".7"/><g transform="translate(0 6)">${eyeIcon(c, { r: r * 0.5, open: false })}</g>`;
  let rays = '';
  for (let i = 0; i < 18; i++) { const a = (i / 18) * PI * 2; rays += c.poly([[Math.cos(a - 0.07) * r * 0.66, Math.sin(a - 0.07) * r * 0.66], [Math.cos(a) * r * 0.96, Math.sin(a) * r * 0.96], [Math.cos(a + 0.07) * r * 0.66, Math.sin(a + 0.07) * r * 0.66]]); }
  const gold = `<circle r="${r * 2}" fill="url(#halo-glow)"/>${rim(C.halo, C.haloRim)}<path d="${rays}" fill="${C.sun}" opacity=".8"/><circle r="${r * 0.64}" fill="${C.cream}"/>${eyeIcon(c, { r: r * 0.46 })}`;
  return { dark, gold };
}

/** Sinai for a framed plate (inner coords 0..w × 0..h): the mountain, the cloud of glory, Moses with the tablets.
 *  The glory's centre is at (w * 0.62, 52). */
export function sinaiInner(c, w = 320, h = 210) {
  const s = sheet();
  s.p(c.cut([[0, h], [w * 0.2, h * 0.62], [w * 0.42, h * 0.5], [w * 0.62, h * 0.3], [w * 0.8, h * 0.52], [w, h * 0.66], [w, h]], 0.8, 10), mix(C.rock2, C.dune, 0.35));
  s.p(c.cut([[w * 0.5, h * 0.42], [w * 0.62, h * 0.3], [w * 0.72, h * 0.42], [w * 0.64, h * 0.46]], 0.5, 6), shade(C.rock2, -0.12));
  const cloud = sheet().p(c.cut(c.blob(w * 0.62, 56, 70, 30, 14, 0.2), 1, 6) + c.cut(c.blob(w * 0.5, 64, 44, 22, 12, 0.2), 1, 6) + c.cut(c.blob(w * 0.75, 66, 46, 20, 12, 0.2), 1, 6), mix(C.cream, C.halo, 0.4)).out();
  const moses = `<g transform="translate(${w * 0.3} ${h - 12}) scale(.42)">${person(c, { ...MOSES1, holdF: `<g transform="translate(0 30) rotate(180) scale(.7)">${tablets10(c, { w: 40, h: 56 })}</g>` })}</g>`;
  return `<rect x="0" y="0" width="${w}" height="${h}" fill="${mix(C.skyBlue, C.halo, 0.25)}"/><circle cx="${w * 0.62}" cy="56" r="110" fill="url(#halo-glow)"/>${s.out()}${cloud}${moses}`;
}
/** a path winding off into mist, a "?" at its end (inner coords 0..w × 0..h) */
export function whenceInner(c, w = 240, h = 170) {
  const s = sheet();
  s.p(c.cut([[0, h], [0, h * 0.7], [w, h * 0.55], [w, h]], 0.6, 10), mix(C.sand, C.hillNear, 0.4));
  const path = c.ribbon(c.cbez([w * 0.3, h], [w * 0.45, h * 0.85], [w * 0.7, h * 0.75], [w * 0.82, h * 0.6], 16), (u) => 26 - u * 22);
  s.p(path, mix(C.sand, C.cream, 0.4));
  const mist = sheet().p(c.cut(c.blob(w * 0.8, h * 0.52, 60, 26, 12, 0.2), 1, 6), '#f2eee6').out();
  return `<rect x="0" y="0" width="${w}" height="${h}" fill="${mix(C.skyBlue, C.cream, 0.4)}"/>${s.out()}<g opacity=".9">${mist}</g>`;
}

/* ====================================================================== the gate street under the Temple wall */
export const G = { FLOOR: 700, JX: 790, BEGX: 962, GATEX: 1160, STEPX0: 1000 };
/** Herod's great wall with a double gate, the sanctuary rising behind it; returns markup (world coords) */
function templeWall(c) {
  const s = sheet();
  const top = 418, base = 668, col = mix(C.sand2, C.stone2, 0.45), GX = G.GATEX;
  const openings = [[GX - 84, GX - 10], [GX + 10, GX + 84]];
  const arch = (x0, x1, yb, yt) => [[x0, yb], [x0, yt], ...c.arc((x0 + x1) / 2, yt, (x1 - x0) / 2, (x1 - x0) / 2 * 0.9, PI, 2 * PI, 10), [x1, yt], [x1, yb]];
  s.p(c.cut([[-1500, base], [-1500, top], [3100, top], [3100, base]], 0.8, 30), col);
  // the parapet
  let cren = '';
  for (let x = -1500; x < 3100; x += 46) cren += c.cut(c.rect(x, top - 20, 26, 22), 0.3, 6);
  s.p(cren, col);
  // courses of great stones with drafted margins
  let joints = '', lights = '';
  for (let y = top + 30, row = 0; y < base; y += 32, row++) {
    joints += c.ribbon([[-1500, y], [3100, y]], 1.4);
    let x = -1500 + (row % 2) * 60;
    while (x < 3100) { const L = c.rr(90, 170); joints += c.ribbon([[x, y - 32], [x, y]], 1.3); if (c.chance(0.3)) lights += c.poly(c.rect(x + 6, y - 26, L - 12, 20)); x += L; }
  }
  s.x(lights, shade(col, 0.12), 'opacity=".55"');
  s.x(joints, shade(col, -0.22), 'opacity=".5"');
  // the gate: frame, dark passages with a glow of light inside
  s.p(c.cut([[GX - 104, base], [GX - 104, 462], [GX + 104, 462], [GX + 104, base]], 0.5, 8), shade(col, 0.14));
  openings.forEach(([x0, x1]) => s.p(c.cut(arch(x0, x1, base, 530), 0.3, 6), '#5d4a3b'));
  openings.forEach(([x0, x1]) => s.x(c.poly(arch(x0 + 10, x1 - 10, base, 550)), '#7a6350', 'opacity=".8"'));
  s.x(c.ribbon([[GX - 104, 468], [GX + 104, 468]], 3), C.ochre, 'opacity=".8"');
  // a smaller blocked gate far left
  s.p(c.cut(arch(250, 330, base, 580), 0.3, 6), shade(col, -0.12));
  // caper plants growing out of the joints
  let cap = '', capF = '';
  [[420, 470], [610, 540], [880, 452], [1330, 500], [1420, 590], [-40, 520], [740, 612]].forEach(([x, y]) => {
    for (let i = 0; i < 5; i++) cap += c.cut(c.blob(x + c.rr(-16, 16), y + c.rr(-8, 8), c.rr(7, 11), c.rr(5, 8), 8, 0.2), 0.3, 3);
    capF += c.poly(c.circ(x + c.rr(-12, 12), y + c.rr(-8, 4), 2.6, 6)) + c.poly(c.circ(x + c.rr(-12, 12), y + c.rr(-8, 4), 2.2, 6));
  });
  s.p(cap, C.moss);
  s.x(capF, C.roseRobe);
  return s.out();
}
/** a street stall: two poles, a striped awning, jars and a basket below (origin: ground centre) */
export function stall(c, w = 200) {
  const s = sheet();
  s.p(c.ribbon([[-w / 2, 0], [-w / 2, -150]], 5) + c.ribbon([[w / 2, 0], [w / 2, -150]], 5), C.wood2);
  const aw = [[-w / 2 - 20, -150], [w / 2 + 20, -150], [w / 2 + 30, -112], [-w / 2 - 30, -112]];
  s.p(c.cut(aw, 0.5, 8), C.cream);
  let st = '';
  for (let x = -w / 2 - 20; x < w / 2 + 20; x += 36) st += c.poly([[x, -150], [x + 18, -150], [x + 18 + 3, -112], [x + 3, -112]]);
  s.x(st, C.terracotta, 'opacity=".75"');
  let sc = '';
  for (let x = -w / 2 - 30; x < w / 2 + 30; x += 20) sc += c.poly([...c.arc(x + 10, -112, 10, 8, 0, PI, 6)]);
  s.p(sc, C.cream);
  s.p(c.cut(c.rect(-w / 2 + 6, -46, w - 12, 46), 0.4, 6), C.wood3);
  const jar = (x, h, col) => c.cut([[x - 10, -46], [x - 14, -46 - h * 0.5], [x - 8, -46 - h], [x + 8, -46 - h], [x + 14, -46 - h * 0.5], [x + 10, -46]], 0.3, 4);
  s.p(jar(-w / 2 + 34, 40, 0) + jar(-w / 2 + 70, 30, 0), C.pot);
  s.p(c.cut(c.ell(w / 2 - 50, -56, 26, 12, 12), 0.4, 4), C.basket);
  s.p(c.cut(c.circ(w / 2 - 60, -66, 7, 8), 0.2, 3) + c.cut(c.circ(w / 2 - 44, -66, 7, 8), 0.2, 3) + c.cut(c.circ(w / 2 - 52, -72, 7, 8), 0.2, 3), C.plumRobe);
  return s.out();
}
function gateSteps(c) {
  const s = sheet();
  const GX = G.GATEX, col = mix(C.stone, C.sand, 0.3);
  // pavement behind the actors
  s.p(c.cut([[-1500, 664], [3100, 664], [3100, 1700], [-1500, 1700]], 0.6, 30), mix(C.sand, C.stone2, 0.55));
  let tiles = '';
  for (let i = 0; i < 8; i++) { const y = 676 + i * i * 7 + i * 12; tiles += c.ribbon([[-1500, y], [3100, y + c.rr(-2, 2)]], 1.2); }
  for (let x = -1500; x < 3100; x += 96) tiles += c.ribbon([[x, 664], [800 + (x - 800) * 2.4, 1700]], 1.1);
  s.x(tiles, shade(C.stone, -0.16), 'opacity=".4"');
  // four broad steps up to the gate
  for (let k = 3; k >= 0; k--) {
    const y0 = 700 - 22 * (k + 1), x0 = G.STEPX0 + k * 26, x1 = GX + 190 - k * 20;
    s.p(c.cut(c.rect(x0, y0, x1 - x0, 700 - y0 + 2), 0.4, 8), shade(col, -k * 0.03));
    s.x(c.ribbon([[x0 + 2, y0 + 2], [x1 - 2, y0 + 2]], 2.4), shade(col, 0.2), 'opacity=".8"');
  }
  return s.out();
}
/**
 * The street by a Temple gate: sky, sun and clouds on strings, the Mount of Olives, the sanctuary above the
 * great wall, the double gate at the top of four broad steps, the pavement. The caller adds actors, then front().
 */
export function gateSet(S, { skyCols = DAY, sunAt = [1250, 150], clouds = true, sunR = 44, starsN = 0, moonAt = null } = {}) {
  const c = makeCutter('j9-gate');
  const sk = sky(S, skyCols);
  let starsL = null;
  if (starsN) { starsL = S.layer({ par: 0.02, sh: 0, flat: true }); starsL.add(stars(c, { x0: -900, x1: 2500, y0: -500, y1: 420, n: starsN })); starsL.fade(0); }
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const moonEl = moonAt ? hanging(hangL, moon(c, 34), { x: moonAt[0], y: moonAt[1], len: 900 }) : null;
  const sunEl = hanging(hangL, sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cl1 = clouds ? hanging(hangL, cloud(c, 190), { x: 470, y: 150, len: 700 }) : null;
  const cl2 = clouds ? hanging(hangL, cloud(c, 130), { x: 900, y: 104, len: 700 }) : null;
  S.layer({ par: 0.08, sh: 2 }).add(hillsWith(c, { y: 400, amps: [20, 8, 3], lens: [1200, 400, 140], color: mix(C.hillMid, C.hillFar, 0.5), trees: 34, treeColor: mix(C.olive, C.hillMid, 0.3), treeH: 16, x0: -1500, x1: 3100 }).markup);
  const tL = S.layer({ par: 0.16, sh: 4 });
  tL.add(`<g transform="translate(${G.GATEX - 30} 470)">${sanct11(c, 1.05)}</g>`);
  const wallL = S.layer({ par: 0.3, sh: 4 });
  wallL.add(templeWall(c));
  wallL.add(cypress(c, 120, 668, 170) + cypress(c, 190, 668, 130) + cypress(c, 1480, 668, 150) + `<g transform="translate(400 674)">${stall(c, 190)}</g>`);
  const groundL = S.layer({ par: 0.4, sh: 3 });
  groundL.add(gateSteps(c));
  return {
    c, sk, starsL, hangL, sunEl, moonEl, cl1, cl2, wallL, groundL,
    /** the foreground frame: an olive on the left, a wall-end with a bush on the right */
    front() {
      const F = S.layer({ par: 0.9, sh: 7 });
      F.add(olive(c, 40, 1010, 2.2, { trunk: C.wood2, leaf: C.olive, leaf2: C.sage }));
      F.add(sheet().p(c.cut([[1480, 1100], [1470, 830], [1520, 800], [2100, 800], [2100, 1100]], 0.8, 10), mix(C.stone, C.sand, 0.35)).out() + bush(c, 1500, 820, 150, C.moss, C.sage));
      return F;
    },
    update(T, { sunX = sunAt[0], sunY = sunAt[1], sunO = 1 } = {}) {
      if (sunO > 0.01) swing(sunEl, sunX, sunY, T, 1, 0.6);
      fade(sunEl, sunO);
      if (cl1) swing(cl1, 470 + Math.sin(T * 0.1) * 26, 150, T, 1.3, 0.6, 1);
      if (cl2) swing(cl2, 900 + Math.sin(T * 0.08 + 2) * 30, 104, T, 1.2, 0.7, 2);
    },
  };
}
/** the beggar's place by the gate: his cloak spread and the bowl (two pieces on L); returns { mat, bowl } */
export function beggarPlace(S, L, { x = G.BEGX, y = G.FLOOR } = {}) {
  const c = makeCutter('j9-beggar');
  const mat = L.add(`<g transform="translate(${x - 14} ${y + 6})">${cloak10(c, mix(C.sand2, C.wood3, 0.4))}</g>`);
  const bowl = L.add(`<g>${bowl10(c)}</g>`);
  pose(bowl, { x: x - 76, y: y + 8 });
  return { mat, bowl };
}

/* ====================================================================== the pool of Siloam */
export const SI = { TOP: 612, WATER: 706, KX: 790, STEPS: 5 };
/** the far side of the pool: the city on the slope, a portico, the rising steps, the outlet of the channel */
export function siloamBack(c) {
  const s = sheet();
  const far = mix(C.stone, C.sand, 0.3);
  // far steps rising from the water up to the portico
  for (let k = 0; k < 6; k++) {
    const y = 700 - k * 16;
    s.p(c.cut([[640, y], [3100, y], [3100, y - 16], [640 + k * 6, y - 16]], 0.4, 12), shade(far, (k % 2 ? -0.05 : 0.04)));
    s.x(c.ribbon([[640 + k * 6, y - 15], [3100, y - 15]], 1.4), shade(far, 0.2), 'opacity=".7"');
  }
  return s.out();
}
/** the water outlet in the far steps: a stone mouth; origin at the mouth */
export function outlet(c) {
  return sheet().p(c.cut([[-40, 20], [-40, -40], ...c.arc(0, -40, 40, 30, PI, 2 * PI, 10), [40, 20]], 0.4, 6), mix(C.stone2, C.rock, 0.3))
    .p(c.cut([[-22, 20], [-22, -30], ...c.arc(0, -30, 22, 18, PI, 2 * PI, 8), [22, 20]], 0.3, 5), '#4a3c33').out();
}
/** near side: the paved top on the left, five steps down to the water, the near lip of the pool */
export function siloamNear(c) {
  const s = sheet();
  const col = mix(C.stone, C.sand, 0.45);
  s.p(c.cut([[-1500, SI.TOP], [560, SI.TOP], [560, 1700], [-1500, 1700]], 0.6, 20), col);
  for (let k = 0; k < SI.STEPS; k++) {
    const x0 = 560 + k * 48, y0 = SI.TOP + (k + 1) * 19;
    s.p(c.cut([[x0, y0], [x0 + 60, y0], [x0 + 60, 1700], [x0, 1700]], 0.4, 8), shade(col, -0.03 - k * 0.025));
    s.x(c.ribbon([[x0 + 1, y0 + 2], [x0 + 58, y0 + 2]], 2.4), shade(col, 0.2), 'opacity=".8"');
  }
  // the near lip of the pool (we look over it); it runs in front of the foot of the steps too, so on a tall
  // screen the steps do not run on down the picture as stripes
  s.p(c.cut([[560, 744], [3100, 744], [3100, 1700], [560, 1700]], 0.5, 16), shade(col, -0.08));
  s.x(c.ribbon([[560, 746], [3100, 746]], 3), shade(col, 0.2), 'opacity=".8"');
  let joints = '';
  for (let x = 620; x < 3100; x += 120) joints += c.ribbon([[x, 748], [x + 4, 800]], 1.2);
  s.x(joints, shade(col, -0.2), 'opacity=".45"');
  return s.out();
}

/* ====================================================================== the Pharisees' hall */
export const H = { FLOOR: 700, BASE: 640, DOORX: 470, DOORW: 108, DOORH: 196, SEAT: 650, B0: 900, B1: 1200, SPLIT: 1004, MANX: 720, WINX: 800 };
/** the back wall of the hall with the door opening, a high window, the ark niche (markup, world coords) */
function hallWall(c) {
  const s = sheet();
  const col = mix(C.plaster2, C.ochre, 0.22), dado = mix(C.clay, C.plaster2, 0.45);
  const D = H.DOORX, B = H.BASE;
  const opening = [[D, B], [D, B - H.DOORH], [D + H.DOORW, B - H.DOORH], [D + H.DOORW, B]];
  // the wall with the door and the window cut out (evenodd)
  const win = [[H.WINX - 46, 316], [H.WINX - 46, 196], ...c.arc(H.WINX, 196, 46, 46, PI, 2 * PI, 10), [H.WINX + 46, 316]];
  s.p(c.cut([[-1500, B], [-1500, -900], [3100, -900], [3100, B]], 0.6, 30) + c.hole(opening, 0.3, 6) + c.hole(win, 0.3, 6), col, 'fill-rule="evenodd"');
  s.x(c.poly([[-1500, B - 64], [3100, B - 64], [3100, B], [-1500, B]]), dado, 'opacity=".9"');
  let mz = '';
  for (let x = -1500; x < 3100; x += 28) mz += c.poly([[x, B - 34], [x + 14, B - 46], [x + 28, B - 34], [x + 14, B - 22]]);
  s.x(mz, shade(dado, 0.25), 'opacity=".7"');
  s.x(c.ribbon([[-1500, B - 64], [3100, B - 64]], 3), shade(col, 0.2), 'opacity=".7"');
  // pilasters
  let pil = '';
  [180, 680, 920, 1420].forEach((x) => { pil += c.cut(c.rect(x - 20, -900, 40, B + 900 - 64), 0.4, 12); });
  s.p(pil, shade(col, 0.1));
  // the door frame: jambs and a lintel
  s.p(c.cut(c.rect(D - 16, B - H.DOORH - 22, 16, H.DOORH + 22), 0.3, 6) + c.cut(c.rect(D + H.DOORW, B - H.DOORH - 22, 16, H.DOORH + 22), 0.3, 6) + c.cut(c.rect(D - 26, B - H.DOORH - 34, H.DOORW + 52, 18), 0.3, 6), mix(C.stone, C.cream, 0.1));
  // the window frame and bars
  s.p(c.ribbon([...c.arc(H.WINX, 196, 52, 52, PI, 2 * PI, 12)], 8) + c.cut(c.rect(H.WINX - 58, 314, 116, 12), 0.3, 6), mix(C.stone, C.cream, 0.1));
  // the ark niche with its curtain
  const AX = 1066;
  s.p(c.cut([[AX - 70, 590], [AX - 70, 450], ...c.arc(AX, 450, 70, 50, PI, 2 * PI, 12), [AX + 70, 590]], 0.4, 6), shade(col, -0.16));
  s.p(c.cut(c.rect(AX - 54, 450, 108, 136), 0.3, 6), mix(C.plumRobe, C.indigo, 0.2));
  let folds = '';
  for (let x = AX - 44; x < AX + 50; x += 18) folds += c.ribbon([[x, 454], [x + 1, 582]], 2.4);
  s.x(folds, shade(C.plumRobe, -0.25), 'opacity=".5"');
  s.p(c.cut(c.rect(AX - 60, 440, 120, 12), 0.3, 5), C.ochre);
  s.x(c.poly(c.star(AX, 520, 12, 5, 6, -PI / 2)), C.sun, 'opacity=".8"');
  return s.out();
}
/** the view through the door (the bright street outside): drawn behind the wall */
function doorView(c) {
  const D = H.DOORX, B = H.BASE;
  const s = sheet();
  s.p(c.cut(c.rect(D - 40, B - H.DOORH - 40, H.DOORW + 80, H.DOORH + 60), 0.3, 8), '#f6e6c2');
  s.p(c.cut([[D - 40, B - 50], [D + 40, B - 70], [D + 150, B - 60], [D + 150, B + 20], [D - 40, B + 20]], 0.4, 8), mix(C.stone, C.sand, 0.35));
  s.p(c.cut(c.rect(D + 50, B - 130, 90, 80), 0.3, 6), mix(C.plaster, C.sand, 0.3));
  return s.out() + palm(c, D + 20, B - 50, 150);
}
/**
 * The hall where the Pharisees sit: an interior backdrop, the door (leaf + bar are live pieces), a stone bench in two
 * halves (for the division), window light, a hanging lamp. The caller adds its actor layers, then front().
 */
export function hallSet(S, { beamO = 1 } = {}) {
  const c = makeCutter('j9-hall');
  const sk = sky(S, HALL);
  const viewL = S.layer({ par: 0.3, sh: 1 });
  viewL.add(doorView(c));
  const wallL = S.layer({ par: 0.3, sh: 4 });
  wallL.add(hallWall(c));
  // the window: sky seen through it (behind the wall — the wall's hole shows it)
  viewL.add(`<path d="${c.poly(c.rect(H.WINX - 60, 130, 120, 200))}" fill="#cfe4e4"/>`);
  // door leaf (pivot at its left edge, bottom) and the dark bar
  const leaf = wallL.add(`<g>${sheet().p(c.cut(c.rect(0, -H.DOORH, H.DOORW, H.DOORH), 0.3, 6), C.wood).x(c.ribbon([[H.DOORW * 0.33, -H.DOORH + 6], [H.DOORW * 0.33, -6]], 1.6) + c.ribbon([[H.DOORW * 0.66, -H.DOORH + 6], [H.DOORW * 0.66, -6]], 1.6) + c.ribbon([[6, -H.DOORH * 0.5], [H.DOORW - 6, -H.DOORH * 0.5]], 2.4), shade(C.wood, -0.25), 'opacity=".7"').x(c.poly(c.circ(H.DOORW - 14, -H.DOORH * 0.46, 4, 8)), C.sun).out()}</g>`);
  const bar = wallL.add(`<g>${sheet().p(c.cut([[-24, -9], [H.DOORW + 24, -13], [H.DOORW + 26, 9], [-22, 12]], 0.4, 6), '#2e2632').out()}</g>`);
  // the floor
  const floorL = S.layer({ par: 0.36, sh: 3 });
  const f = sheet();
  f.p(c.cut([[-1500, H.BASE - 4], [3100, H.BASE - 4], [3100, 1700], [-1500, 1700]], 0.6, 30), mix(C.stone2, C.sand2, 0.45));
  let tiles = '';
  for (let i = 0; i < 9; i++) { const y = H.BASE + 8 + i * i * 7 + i * 10; tiles += c.ribbon([[-1500, y], [3100, y + c.rr(-2, 2)]], 1.2); }
  for (let x = -1500; x < 3100; x += 90) tiles += c.ribbon([[x, H.BASE], [800 + (x - 800) * 2.2, 1700]], 1.1);
  f.x(tiles, shade(C.stone, -0.16), 'opacity=".42"');
  floorL.add(f.out());
  // light falling from the window
  const beamL = S.layer({ par: 0.34, sh: 0, flat: true });
  S.defs(`<linearGradient id="${S.id('hbeam')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3cf" stop-opacity=".6"/><stop offset="1" stop-color="#fff3cf" stop-opacity=".05"/></linearGradient>`);
  beamL.add(`<path d="M${H.WINX - 44} 210L${H.WINX + 44} 210L${H.WINX + 30} 760L${H.WINX - 200} 760Z" fill="url(#${S.id('hbeam')})" opacity="${beamO}"/>`);
  // the bench in two halves
  const benchL = S.layer({ par: 0.44, sh: 4 });
  const bcol = mix(C.stone, C.cream, 0.15);
  const half = (x0, x1) => sheet().p(c.cut(c.rect(x0, H.SEAT, x1 - x0, 12), 0.4, 8), shade(bcol, 0.1)).p(c.cut(c.rect(x0 + 8, H.SEAT + 12, x1 - x0 - 16, H.FLOOR - H.SEAT - 10), 0.4, 8), bcol)
    .x(c.ribbon([[x0 + 8, H.SEAT + 30], [x1 - 8, H.SEAT + 30]], 1.4), shade(bcol, -0.2), 'opacity=".5"').out();
  const benchA = benchL.add(`<g>${half(H.B0, H.SPLIT)}</g>`);
  const benchB = benchL.add(`<g>${half(H.SPLIT, H.B1)}</g>`);
  pose(benchA, {}); pose(benchB, {});
  return {
    c, sk, viewL, wallL, floorL, beamL, benchL, benchA, benchB, leaf, bar,
    /** door: open 0..1 (leaf folds back); barK 0..1 (the dark bar drops into place) */
    door(open, barK = 0) {
      pose(leaf, { x: H.DOORX, y: H.BASE, sx: 1 - open * 0.9 });
      pose(bar, { x: H.DOORX, y: H.BASE - H.DOORH * 0.55 - (1 - barK) * 260, r: -3 * barK, o: barK > 0.01 ? Math.min(1, barK * 3) : 0 });
    },
    /** split the bench: k 0..1 */
    split(k) { pose(benchA, { x: -k * 26 }); pose(benchB, { x: k * 26 }); },
    front() {
      const F = S.layer({ par: 0.9, sh: 7 });
      const col = mix(C.cream, C.stone, 0.4);
      const s = sheet();
      // phone: the camera goes further right to show the whole bench, so the right pillar stands further off
      [150, S.portrait ? 1760 : 1470].forEach((x) => {
        s.p(c.cut([[x - 50, 1100], [x - 46, -600], [x + 46, -600], [x + 50, 1100]], 0.5, 12), col);
        let fl = '';
        for (let k = -3; k <= 3; k++) fl += c.ribbon([[x + k * 12, 1080], [x + k * 11.5, -580]], 2.4);
        s.x(fl, shade(col, -0.14), 'opacity=".5"');
      });
      F.add(s.out());
      return F;
    },
  };
}
/** where people stand in the hall. Officials: seated on the bench (sit) and standing at its ends */
export const OFFS = [
  { x: 1222, y: H.FLOOR + 4, pose: 'stand', s: 1.0, side: 1 },
  { x: 952, y: H.SEAT + 12, pose: 'sit', s: 0.98, side: 0 },
  { x: 1052, y: H.SEAT + 12, pose: 'sit', s: 0.98, side: 1 },
  { x: 1142, y: H.SEAT + 12, pose: 'sit', s: 0.98, side: 1 },
  { x: 868, y: H.FLOOR + 10, pose: 'stand', s: 1.0, side: 0 },
];
/** the officials of the hall: face puppets at OFFS; each { p, x, y, s, side, angry, sad, seed, i } */
export function officials(S, L) {
  const c = makeCutter('j9-officials');
  return OFFS.map((o, i) => ({ ...o, i, seed: c.rr(0, 9), ...facePuppet(S, L, official(i), { pose: o.pose, c }) }));
}
/** set an official with overrides (faces left toward the man unless flip given) */
export function offSet(m, T, o = {}) {
  const { angry = 0, sad = 0, ...rest } = o;
  m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, blink: blinkAt(T, m.seed), ...rest });
  fade(m.angry, angry); fade(m.sad, sad);
}

/* ====================================================================== small helpers */
/** head centre of a puppet in any pose */
export const head = (x, y, s, flip, P = 'stand') => [x + (flip ? -2 : 2) * s, y + (-167 + DY[P]) * s];
export { fade, attr };
/** a hung ornament that comes down from the flies as k goes 0 → 1 (and swings a little); frozen while hidden */
export function drop(el, x, y, k, T, { amp = 1, speed = 0.7, seed = 0, rise = 700 } = {}) {
  if (k <= 0.001) {
    if (el.__dropped !== false) { pose(el, { x, y: y - rise, o: 0 }); el.__dropped = false; }
    return;
  }
  el.__dropped = true;
  pose(el, { x, y: y - (1 - k) * rise, r: Math.sin(T * speed + seed) * amp * k, oy: 0, o: 1 });
}
