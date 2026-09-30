// John 12 — the cut-outs of the chapter: Bethany at dusk with Lazarus' house and his empty tomb in the hillside,
// the supper room (low table, hanging lamps, the jar of nard and the fragrance that fills the house), Martha,
// Mary and Lazarus; the road below the city gate with palms and the young donkey; the Temple court where the
// Greeks come; the cut-away field of the grain of wheat; the dark stage of Isaiah's vision and the last word.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, swing, lerp } from '../kit.js';
import { band, hillsWith, olive, palm, cypress, rock, moon, stars, sun, cloud, grass, bush, house } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { blinkAt } from '../../assets/people.js';
import { addToHead, addToBody, loaf as loaf2, cup as cup2, grapes as grapes2, bowl as bowl2 } from '../mark2/lib.js';
import { LOOK as L3, withFace as withFace3, faceBits as faceBits3 } from '../mark3/lib.js';
import { walledCity } from '../mark1/lib.js';
import { dayDisc as dayDisc2 } from '../john2/lib.js';

export { kf, moving, hand, headAt, addToHead, addToBody, speech, thought, spark, heart, coin, coinStack, wordSlip, scrollOpen, loaf, cup, bowl, grapes } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, shadowPerson, silhouette, stoneHeart, tornPair } from '../mark3/lib.js';
export { voiceRings, hang2, tagOnString, flame, plate, sparkle, scrollParts, walledCity } from '../mark1/lib.js';
export { glory, soulLight, lightCrown, globe, say, balance } from '../mark8/lib.js';
export { storyFrame, SEPIA, tick, crossX, staff, purse as purse6 } from '../mark6/lib.js';
export { vis, alabaster, nardMist, purse, linenCloth, womanCameo, priestOpts, lampGlow, hangingLamp } from '../mark14/lib.js';
export { colt, coltRig, saddleCloaks, riderLeg, cityWall, sanctuary, portico, templeCourt, courtFront, frond, oliveBranch, roadBranch, roadCloak, pennant, clothBanner } from '../mark11/lib.js';
export { crossSil, skullHill, farCity } from '../mark15/lib.js';
export { scent, spiceJar, tombIcon, linenCloths } from '../mark16/lib.js';
export { tint, handLamp } from '../mark13/lib.js';
export { iAm, framed, lightPath, drawPath, forkTongue, shadowSerpent, scalesParts, poseScales } from '../john8/lib.js';
export { hourglassRig } from '../john7/lib.js';
export { leaderOpts, laurel, bigLamp } from '../john5/lib.js';
export { signBadge, dayDisc, verseScroll, moneyBag } from '../john2/lib.js';
export { wordFlame, rayBurst, radiance, eternityRing, drawRing, glowDisc, threads, darkSheet, goldWord, hungGold, hungWord, hungPlate, iconWord, smallAngel } from '../john1/lib.js';
export { beamGrad, lightBeam, darkPool, word } from '../john3/lib.js';
export { roundel, panel, sepia } from '../john4/lib.js';
export { eyeIcon } from '../john6/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, crowdPerson, lerp, blinkAt };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const INK = '#3b2a22';
const LK = makeCutter('j12-looks');
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ====================================================================== palettes */
export const DUSK = ['#9a86ad', '#e7ab8f', '#f5d3aa'];
export const EVE = ['#4f4f84', '#9b7f9f', '#dba08c'];
export const NIGHT = ['#1d2349', '#2b3262', '#4a4876'];
export const MORNING = ['#d4e4dc', '#f2e8cc', '#f8ecd2'];
export const DAY = ['#cfe2dc', '#f0e7cd', '#f7ead0'];
export const GOLDEN = ['#e3cfa6', '#f2d7a8', '#f8e6c2'];
export const DARK = ['#171a38', '#22284f', '#2f335f'];

/* ====================================================================== the cast */
export const JESUS = CAST.jesus;
// Martha, Mary and Lazarus are the John 11 cut-outs (same paper, same colours), imported from js/chapters/john11.
import { MARTHA as M11, MARY as MY11, LAZARUS as L11, martha as martha11, mary as mary11 } from '../john11/lib.js';
/** Lazarus: sky-blue tunic, sage mantle, curly hair (John 11) */
export const LAZ = L11;
/** Martha: clay robe, pale veil, linen apron with keys (John 11) */
export const MARTHA = M11;
/** Mary: rose and lavender, long dark hair uncovered, a lavender band (John 11, as the woman of Bethany in Mark 14) */
export const MARY = MY11;
export const JUDAS = L3.judas;
export const PHILIP = L3.philip;
export const ANDREW = CAST.andrew;
/** the Twelve we need, as in Mark 3 */
export const TW = { peter: CAST.peter, john: CAST.john, james: CAST.james, andrew: CAST.andrew, thomas: CAST.thomas, matthew: CAST.matthew, philip: L3.philip, judas: L3.judas, bartholomew: L3.bartholomew, thaddaeus: L3.thaddaeus };

export const martha = (c, extra = {}) => martha11(c, extra);
export const mary = (c, extra = {}) => mary11(c, extra);

/** Mary's loosened hair: a long dark fall from the back of the head (head coords) */
export function longHair(c, col = C.hair3) {
  const s = sheet();
  s.p(c.cut([[-18, -6], [-8, -18], [6, -20], [2, 4], [-4, 30], [-10, 60], [-14, 92], [-22, 104], [-30, 96], [-30, 60], [-28, 26], [-24, 6]], 0.7, 5), col);
  s.x(c.ribbon(c.qbez([-14, 10], [-20, 50], [-22, 94], 8), 1.4) + c.ribbon(c.qbez([-6, 12], [-10, 50], [-16, 90], 8), 1.2), shade(col, 0.2), 'opacity=".6"');
  return `<g class="lhair">${s.out()}</g>`;
}
/** Mary with her long hair falling free, to wipe His feet (the fall hangs from the head; counter-rotate .lhair) */
export function maryHair(c, pose = 'kneel', extra = {}) {
  return mary11(c, { pose, ...extra }).replace('<g class="headr">', `<g class="headr">${longHair(c)}`);
}

/** a Greek pilgrim: short chlamys pinned at the shoulder, a wide sun-hat (petasos) or a fillet in curly hair */
export function greek(c, i = 0) {
  const robes = [C.linen, mix(C.linen, C.skyVeil, 0.4), C.linen2];
  const cloaks = [shade(C.indigo, 0.35), C.terracotta, mix(C.teal2, C.skyVeil, 0.3)];
  const o = { robe: robes[i % 3], mantle: cloaks[i % 3], mantleArm: true, skin: [C.skin, C.skin2, C.skin3][i % 3], hair: [C.hair2, C.wheat2, C.hair][i % 3], hairStyle: 'curly', beard: ['short', 'none', 'full'][i % 3], beardColor: [C.hair2, C.wheat2, C.greyHair][i % 3], belt: C.sun };
  let m = person(c, o);
  // the pin (fibula) on the shoulder and a hem stripe
  m = addToBody(m, sheet().p(c.cut(c.circ(18, -138, 4.4, 10), 0.2, 3), C.sun).x(c.ribbon([[-40, -12], [42, -12]], 3), shade(o.mantle, 0.35), 'opacity=".8"').out());
  if (i % 3 === 0) {
    // petasos
    const h = sheet().p(c.cut(c.ell(1, -14, 34, 6, 18), 0.4, 4), C.straw || C.wheat2).p(c.cut([[-12, -16], [-10, -30], [0, -34], [12, -30], [14, -16]], 0.3, 4), shade(C.wheat2, 0.1)).x(c.ribbon([[-12, -18], [14, -18]], 2.6), C.terracotta).out();
    m = addToHead(m, h);
  } else {
    // a fillet
    m = addToHead(m, sheet().p(c.ribbon(c.arc(0, -2, 19, 16, PI * 1.05, PI * 1.95, 10), 3.4), i % 3 === 1 ? C.leaf : C.sun).out());
  }
  return m;
}

/** a pilgrim man (never veiled) */
export function man(c, extra = {}) {
  const o = crowdPerson(c, extra);
  if (o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  return { ...o, ...extra };
}
/** a leader among the Jews / a Pharisee (same looks as John 5) */
export function leader(i = 0) {
  const robes = [C.linen2, C.stone, C.linen, C.wheatRobe];
  const mantles = [C.dustyBlue, shade(C.indigo, 0.25), C.tealRobe, C.plumRobe];
  return {
    robe: robes[i % 4], mantle: mantles[i % 4], skin: [C.skin2, C.skin, C.skin3][i % 3],
    hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: [C.dustyBlue, C.indigo, C.tealRobe, C.plumRobe][i % 4],
    beard: i % 2 ? 'wild' : 'full', beardColor: [C.greyHair, C.hair3, C.hair][i % 3], belt: i % 2 ? C.sun : C.leather,
  };
}
/** a chief priest: linen, a coloured mantle, gold sash, white turban-wrap */
export function chiefPriest(i = 0) {
  const M = [shade(C.indigo, 0.25), C.plumRobe, shade(C.teal2, 0.1)];
  return { robe: C.linen, mantle: M[i % 3], belt: C.sun, skin: [C.skin2, C.skin, C.skin3][i % 3], hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.sun, beard: i % 2 ? 'wild' : 'full', beardColor: [C.greyHair, C.hair3][i % 2] };
}
/** Isaiah the prophet: white hair and beard, sage robe, a wood-brown mantle */
export const ISAIAH = { robe: C.sageRobe, mantle: C.wood3, hair: '#ece6da', hairStyle: 'long', beard: 'wild', beardColor: '#ece6da', skin: C.skin3, belt: C.rope };

/** puppets from a list of { x, y, s, flip, look, face } (face: add brows/tears) */
export function people(S, L, list, seed = 'p') {
  const c = makeCutter('j12-people-' + seed + L.el.childElementCount);
  return list.map((o, i) => {
    const mk = typeof o.look === 'string' ? o.look : o.face ? withFace3(person(c, o.look), faceBits3(c)) : person(c, o.look);
    const p = S.puppet(L.add(mk));
    return { ...o, i, seed: c.rr(0, 9), p, angry: p.el.querySelector('[data-part="angry"]'), sad: p.el.querySelector('[data-part="sad"]') };
  });
}
export function place(m, T, o = {}) { m.p.set({ x: m.x, y: m.y, s: m.s ?? 1, flip: m.flip, blink: blinkAt(T, m.seed), ...o }); }

/* ====================================================================== small props */
/** Jesus' legs stretched out on the floor from a sitting puppet (facing right; flip with sx:-1); origin = the puppet's feet point */
export function outLegs(c, { robe = C.linen, skin = C.skin } = {}) {
  const s = sheet();
  s.p(c.cut([[30, -30], [70, -26], [118, -18], [124, -8], [118, 0], [40, 0]], 0.5, 6), shade(robe, -0.04));
  s.x(c.ribbon([[56, -20], [112, -12]], 1.6), shade(robe, -0.14), 'opacity=".7"');
  const f = sheet();
  const foot = (dx, dy) => c.cut([[118 + dx, -6 + dy], [122 + dx, -20 + dy], [130 + dx, -26 + dy], [136 + dx, -22 + dy], [146 + dx, -8 + dy], [148 + dx, -2 + dy], [138 + dx, 0 + dy], [122 + dx, 0 + dy]], 0.3, 3);
  f.p(foot(-4, -3), shade(skin, -0.08)).p(foot(4, 0), skin);
  f.x(c.ribbon([[142, -6], [145, -2]], 1.2), shade(skin, -0.25), 'opacity=".5"');
  return `${s.out()}<g class="feet">${f.out()}<path class="sheen" d="${c.poly(c.ell(134, -16, 7, 3, 8, 0.5))}" fill="#fff6d8" opacity="0"/></g>`;
}
/** a cushion / low couch with a bolster (origin: bottom centre) */
export function cushion(c, w = 150, col = C.terracotta) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 4, -20], [w / 2 - 4, -22], [w / 2, 0]], 0.5, 6), col);
  s.p(c.cut(c.ell(-w / 2 + 10, -22, 16, 12, 12), 0.4, 4), shade(col, -0.12));
  let d = '';
  for (let x = -w / 2 + 30; x < w / 2 - 10; x += 22) d += c.poly(c.circ(x, -10, 2.4, 6));
  s.x(d, C.sun, 'opacity=".8"');
  return s.out();
}
/** the jar of nard: a tall alabaster flask with a stopper (origin at its base; h tall) */
export function nardJar(c, h = 60) {
  const k = h / 60;
  const white = mix(C.cream, C.linen, 0.5), vein = mix(C.stone2, C.blushVeil, 0.4);
  const s = sheet();
  s.p(c.cut([[-9 * k, 0], [-17 * k, -10 * k], [-19 * k, -28 * k], [-13 * k, -44 * k], [-6 * k, -48 * k], [-6 * k, -54 * k], [6 * k, -54 * k], [6 * k, -48 * k], [13 * k, -44 * k], [19 * k, -28 * k], [17 * k, -10 * k], [9 * k, 0]], 0.3, 4), white);
  s.x(c.ribbon(c.qbez([-11 * k, -10 * k], [-3 * k, -26 * k], [-9 * k, -40 * k], 8), 1.2) + c.ribbon(c.qbez([8 * k, -8 * k], [13 * k, -22 * k], [5 * k, -36 * k], 8), 1), vein, 'opacity=".8"');
  s.x(c.poly(c.ell(-7 * k, -30 * k, 3 * k, 9 * k, 8)), '#fff', 'opacity=".6"');
  s.p(c.cut(c.rect(-8 * k, -62 * k, 16 * k, 9 * k), 0.2, 3), C.plumRobe);
  s.x(c.ribbon([[-7 * k, -50 * k], [7 * k, -50 * k]], 2.4 * k), C.sun);
  return s.out();
}
/** a sprig of spikenard: a stem with little pink-purple flower-balls (origin at the stem's foot) */
export function nardSprig(c, h = 40) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [2, -h * 0.5], [-2, -h], 6), 1.8), C.moss);
  let fl = '';
  for (let i = 0; i < 7; i++) { const y = -h * (0.55 + i * 0.07), x = (i % 2 ? 3 : -3) + c.rr(-1, 1); fl += c.cut(c.circ(x, y, 3.2 - i * 0.2, 8), 0.2, 3); }
  s.p(fl, mix(C.mauve, C.roseRobe, 0.4));
  s.x(c.poly(c.circ(-1, -h * 1.02, 2.4, 6)), C.blushVeil);
  return s.out();
}
/** the house-filling fragrance: soft curls (origin: bottom of the curl) */
export function curl(c, h = 120, col = '#f3dcec') {
  const pts = c.cbez([0, 0], [-h * 0.34, -h * 0.25], [h * 0.4, -h * 0.55], [0, -h], 18);
  const tip = c.arc(h * 0.1, -h - 10, 12, 12, PI * 0.9, PI * 2.5, 10);
  return `<ellipse cx="0" cy="${-h * 0.5}" rx="${h * 0.34}" ry="${h * 0.6}" fill="url(#halo-glow)" opacity=".35"/><path d="${c.ribbon([...pts, ...tip], (u) => 1.4 + Math.sin(u * PI) * 7)}" fill="${col}" opacity=".62"/>`;
}
/** a hanging oil lamp (origin at the chain's end); .flame for flicker */
export function hangLamp(c) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [-22, 30]], 1.2) + c.ribbon([[0, 0], [22, 30]], 1.2), shade(C.wood2, -0.2));
  s.p(c.cut([[-34, 32], [34, 32], [44, 38], [30, 48], [-24, 50], [-44, 42]], 0.4, 5), C.pot);
  s.x(c.ribbon([[-30, 40], [30, 40]], 1.6), shade(C.pot, 0.3), 'opacity=".6"');
  return `<circle cy="30" r="130" fill="url(#warm-glow)" opacity=".8"/>${s.out()}<g class="flame" transform="translate(40 36)"><path d="M0 0C-6 -4 -5 -12 0 -20C5 -12 6 -4 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2 -5 -2 -9 0 -12C2 -9 2 -5 0 -2Z" fill="#fff4d2"/></g>`;
}
/** a platter of bread and fruit (origin: centre of the platter's rim) */
export function platter(c) {
  const s = sheet();
  s.p(c.cut([[-34, 0], [34, 0], [26, 8], [-26, 8]], 0.3, 4), C.pot);
  return `<g transform="translate(-14 0)">${loaf2(c, 13)}</g><g transform="translate(12 -2)">${grapes2(c, 3.6)}</g>${s.out()}`;
}
/** a water / wine jug (origin at the base) */
export function jug(c, col = C.clay) {
  const s = sheet();
  s.p(c.cut([[-9, 0], [-14, -10], [-14, -24], [-8, -32], [-7, -40], [7, -40], [8, -32], [14, -24], [14, -10], [9, 0]], 0.3, 4), col);
  s.p(c.ribbon(c.arc(15, -24, 7, 9, -PI / 2, PI / 2, 8), 2.6), shade(col, -0.1));
  s.x(c.ribbon([[-13, -18], [13, -18]], 1.6), shade(col, 0.3), 'opacity=".6"');
  return s.out();
}
/** a coin-purse / money box of the Twelve (origin at the tie) */
export function moneybag(c, col = shade(C.leather, 0.05)) {
  const s = sheet();
  s.p(c.cut([[-6, 0], [6, 0], [12, 10], [22, 22], [24, 38], [14, 48], [-14, 48], [-24, 38], [-22, 22], [-12, 10]], 0.5, 4), col);
  s.p(c.ribbon([[-8, 5], [8, 5]], 3.6), C.rope);
  s.x(c.ribbon(c.arc(0, 32, 14, 8, 0.4, PI - 0.4, 6), 1.2), shade(col, 0.3), 'opacity=".6"');
  return s.out();
}
/** a small silver coin (the denarius) */
export function denar(c, r = 7) {
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.3, 3), mix(C.stone, C.skyBlue, 0.3)).p(c.cut(c.circ(0, 0, r * 0.6, 10), 0.2, 3), mix(C.stone2, C.skyBlue, 0.3)).x(c.poly(c.circ(-r * 0.3, -r * 0.3, r * 0.2, 6)), '#fff').out();
}
/** a poor beggar with a bowl (opts only) */
export function poorOpts(i = 0) {
  return { robe: [mix(C.stone2, C.wood3, 0.3), mix(C.dune, C.stone2, 0.5)][i % 2], mantle: null, hair: [C.greyHair, C.hair][i % 2], hairStyle: ['wrap', 'veil'][i % 2], veil: mix(C.stone2, C.dune, 0.4), beard: ['wild', 'none'][i % 2], beardColor: C.greyHair, skin: [C.skin3, C.skin2][i % 2] };
}

/** the six days before the Passover: a string of six day-discs and a Passover plate (origin: left end).
 *  Pieces: .dd[data-i] (each dayDisc has .off/.lit) and .pascha */
export function sixDays(c, { gap = 74, r = 22 } = {}) {
  let out = '';
  const w = gap * 6.2;
  out += `<path d="${c.ribbon(c.qbez([-20, 0], [w / 2, 26], [w + 40, 0], 20), 1.6)}" fill="${C.rope}"/>`;
  for (let i = 0; i < 6; i++) {
    const x = i * gap, y = 14 + Math.sin(((i + 0.5) / 6.4) * PI) * 12;
    out += `<g class="dd" data-i="${i}" transform="translate(${x} ${y + r + 8})"><path d="M0 ${-r - 8}V${-r}" stroke="${C.rope}" stroke-width="1.4"/>${dayDisc2(c, String(6 - i), r)}</g>`;
  }
  // the Passover: unleavened bread and a cup on a round plate
  const p = sheet().p(c.cut(c.circ(0, 0, r + 12, 26), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, r + 6, 26), 0.4, 4), C.cream);
  p.p(c.cut(c.circ(-8, 4, 12, 16), 0.3, 3), C.wheat);
  p.x(c.poly(c.circ(-12, 2, 1.4, 5)) + c.poly(c.circ(-5, 7, 1.4, 5)) + c.poly(c.circ(-7, -1, 1.4, 5)), shade(C.wheat2, -0.2));
  p.p(c.cut([[6, -12], [18, -12], [16, -4], [13, -2], [13, 6], [16, 8], [8, 8], [11, 6], [11, -2], [8, -4]], 0.2, 3), C.clay);
  out += `<g class="pascha" transform="translate(${6 * gap + 14} ${14 + r + 20})"><path d="M0 ${-r - 26}V${-r - 12}" stroke="${C.rope}" stroke-width="1.4"/>${p.out()}<text x="0" y="${r + 30}" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.cream}">${tr('Pascha', 'Passover')}</text></g>`;
  return `<g class="hang"><path d="M-20 -1600V0M${w + 40} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${out}</g></g>`;
}
/** light the day-discs of sixDays: lit(i) 0..1 */
export function litDays(el, fn) {
  el.__dd = el.__dd || Array.from(el.querySelectorAll('.dd')).map((g) => ({ off: g.querySelector('.off'), lit: g.querySelector('.lit'), i: +g.dataset.i }));
  el.__dd.forEach((d) => { const k = fn(d.i); fade(d.lit, k); fade(d.off, 1 - k * 0.9); });
}

/* ====================================================================== Bethany (outside) */
export const BE = { GROUND: 690, DOOR: 1075, HX0: 985, HX1: 1245, TOMB: [420, 506], CITY: [1330, 452] };
/**
 * Bethany on the slope of the Mount of Olives: the far city, the hillside with Lazarus' empty tomb, the village,
 * Lazarus' house (door and window can glow), the road. Returns handles + update(t, T, o).
 */
export function bethanySet(S, { skyCols = DUSK, starsN = 50 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 340, n: starsN }));
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1180, y: 160, len: 700 });
  const moonEl = hanging(hangL, moon(c, 30), { x: 560, y: 150, len: 700 });
  const clouds = [[700, 120, 170], [1060, 210, 120]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w, mix(C.cream, C.peach, 0.35), mix(C.peach, C.dusk, 0.3)), { x, y, len: 600 }), x, y, i }));
  // far hills and the city
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 470, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.25), x0: -1400, x1: 3200 }).markup);
  far.add(walledCity(c, BE.CITY[0], BE.CITY[1] + 10, 0.62, { wall: mix(C.stone, C.duskViolet, 0.2), wall2: mix(C.stone2, C.duskViolet, 0.25), temple: C.cream }));
  // the Mount of Olives slope with the tomb cut in the rock
  const slope = S.layer({ par: 0.16, sh: 3 });
  const sp = sheet();
  sp.p(c.cut([[-1400, 1700], [-1400, 430], [-300, 400], [200, 440], [520, 492], [760, 560], [1000, 610], [1400, 640], [3200, 650], [3200, 1700]], 1.4, 14), mix(C.hillMid, C.sage2, 0.3));
  sp.p(c.cut([[-1400, 1700], [-1400, 520], [-200, 500], [300, 530], [640, 590], [900, 640], [3200, 660], [3200, 1700]], 1.2, 14), mix(C.hillNear, C.sage, 0.3));
  slope.add(sp.out());
  let trees = '';
  [[-200, 470, 0.7], [80, 486, 0.6], [640, 560, 0.55], [220, 500, 0.5], [760, 590, 0.6]].forEach(([x, y, s]) => { trees += olive(c, x, y, s, { leaf: mix(C.olive, C.duskViolet, 0.15) }); });
  slope.add(trees + cypress(c, 560, 540, 110, mix(C.moss2, C.duskViolet, 0.15)));
  // the tomb: a rock face, a dark mouth, the stone rolled away
  const [TX, TY] = BE.TOMB;
  const tr_ = sheet();
  tr_.p(c.cut([[TX - 120, TY + 20], [TX - 104, TY - 70], [TX - 50, TY - 118], [TX + 30, TY - 124], [TX + 96, TY - 90], [TX + 130, TY - 20], [TX + 140, TY + 22]], 1.4, 8), mix(C.rock, C.duskViolet, 0.12));
  tr_.p(c.cut([[TX - 26, TY + 12], [TX - 26, TY - 34], ...c.arc(TX, TY - 34, 26, 24, PI, 2 * PI, 10), [TX + 26, TY + 12]], 0.5, 5), C.soilRich);
  tr_.x(c.ribbon(c.arc(TX, TY - 34, 32, 30, PI, 2 * PI, 10), 3), shade(C.rock, -0.15), 'opacity=".6"');
  slope.add(tr_.out());
  const tombGlow = slope.add(`<g><circle r="70" fill="url(#halo-glow)"/></g>`);
  slope.add(`<g transform="translate(${TX + 66} ${TY - 2})">${sheet().p(c.cut(c.circ(0, 0, 30, 24), 0.8, 5), C.rock2).x(c.ribbon(c.arc(0, 0, 22, 22, 3.5, 5.1, 8), 2.4), shade(C.rock2, -0.2), 'opacity=".6"').out()}</g>`);
  // the village along the ridge
  const vil = S.layer({ par: 0.26, sh: 3 });
  let hs = '';
  [[560, 620, 64, 40], [650, 628, 54, 36], [760, 636, 70, 46], [1300, 646, 60, 40], [1380, 652, 70, 44]].forEach(([x, y, w, h]) => { hs += house(c, x, y, w, h, { wall: mix(C.plaster, C.dusk, 0.12), shadow: mix(C.plaster2, C.duskViolet, 0.2), lit: true }); });
  vil.add(hs);
  // Lazarus' house
  const hL = S.layer({ par: 0.4, sh: 4 });
  const G = BE.GROUND, X0 = BE.HX0, X1 = BE.HX1, D = BE.DOOR;
  const wall = mix(C.plaster, C.apricot, 0.18);
  const h = sheet();
  h.p(c.cut([[X0, G + 4], [X0, G - 200], [X1, G - 200], [X1, G + 4]], 0.6, 10), wall);
  h.p(c.cut([[X1, G - 200], [X1 + 44, G - 190], [X1 + 44, G + 4], [X1, G + 4]], 0.5, 8), mix(C.plaster2, C.duskViolet, 0.2));
  h.p(c.cut(c.rect(X0 - 8, G - 212, X1 - X0 + 58, 14), 0.4, 10), C.roof);
  let par = '';
  for (let x = X0 - 4; x < X1 + 44; x += 30) par += c.cut(c.rect(x, G - 228, 16, 18), 0.3, 5);
  // an upper room on the roof
  h.p(c.cut(c.rect(X0 + 150, G - 300, 110, 90), 0.5, 8), mix(C.plaster, C.apricot, 0.1));
  h.p(c.cut(c.rect(X0 + 144, G - 308, 122, 10), 0.3, 6), C.roof);
  h.p(c.cut([[X0 + 196, G - 212], [X0 + 196, G - 256], ...c.arc(X0 + 205, G - 256, 9, 9, PI, 2 * PI, 6), [X0 + 214, G - 212]], 0.3, 4), C.lampFlame);
  h.p(par, mix(C.plaster2, C.apricot, 0.1));
  // the arched door (dark) and a window
  const door = [[D - 36, G + 2], [D - 36, G - 100], ...c.arc(D, G - 100, 36, 30, PI, 2 * PI, 10), [D + 36, G + 2]];
  h.p(c.cut(door, 0.4, 5), mix(C.soilRich, C.plumRobe, 0.2));
  h.p(c.ribbon([...door.slice(0, -1)], 7), C.wood2);
  h.p(c.cut([[D - 44, G + 4], [D + 44, G + 4], [D + 50, G + 12], [D - 50, G + 12]], 0.3, 6), C.stone2);
  const W = [1185, G - 150];
  h.p(c.cut([[W[0] - 26, W[1] + 44], [W[0] - 26, W[1]], ...c.arc(W[0], W[1], 26, 22, PI, 2 * PI, 8), [W[0] + 26, W[1] + 44]], 0.4, 5), C.lampFlame);
  h.p(c.ribbon([[W[0], W[1] - 20], [W[0], W[1] + 44]], 3) + c.ribbon([[W[0] - 26, W[1] + 18], [W[0] + 26, W[1] + 18]], 3), C.wood2);
  h.p(c.cut(c.rect(W[0] - 34, W[1] + 42, 68, 8), 0.3, 5), C.wood);
  // an awning over the door, a vine
  h.p(c.cut([[D - 70, G - 150], [D + 70, G - 150], [D + 84, G - 128], [D - 84, G - 128]], 0.5, 6), C.terracotta);
  let st = '';
  for (let x = D - 76; x < D + 80; x += 28) st += c.cut([[x, G - 150], [x + 14, G - 150], [x + 18, G - 128], [x + 4, G - 128]], 0.3, 4);
  h.p(st, C.cream);
  hL.add(h.out());
  const doorGlow = hL.add(`<g><path d="${c.poly(door)}" fill="${C.lampFlame}"/><circle cy="-40" r="90" fill="url(#warm-glow)"/></g>`);
  pose(doorGlow, { x: 0, y: 0, o: 0 });
  // trees by the house
  hL.add(palm(c, X1 + 90, G + 6, 250, { frond: mix(C.moss, C.duskViolet, 0.1) }) + olive(c, X0 - 60, G + 4, 0.8));
  // the road
  const ground = S.layer({ par: 0.45, sh: 3 });
  const gp = sheet();
  gp.p(c.cut([[-1400, G - 16], [3200, G - 16], [3200, 1700], [-1400, 1700]], 1, 20), mix(C.sage2, C.sand, 0.35));
  gp.p(c.cut([[-1400, G + 4], [3200, G - 4], [3200, G + 60], [-1400, G + 74]], 1.2, 16), mix(C.sand, C.sand2, 0.4));
  ground.add(gp.out() + grass(c, { x0: -1400, x1: 3000, y: G - 12, n: 50, h: 12, color: C.olive }) + grass(c, { x0: -1400, x1: 3000, y: G + 96, n: 40, h: 16, color: C.moss }));
  // dusk wash: a flat violet veil (faded by the caller)
  const veil = S.layer({ par: 0.4, sh: 0, flat: true });
  veil.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".26"/>`);
  return {
    sk, starL, hangL, sunEl, moonEl, clouds, slope, hL, ground, veil, tombGlow, doorGlow,
    fg(par = 0.92) {
      const L = S.layer({ par, sh: 7, pad: 200 });
      L.add(bush(c, 240, 920, 220, C.sage, C.moss) + rock(c, 1370, 900, 170, 60, C.rock2) + bush(c, 1480, 930, 180, C.moss, C.sage));
      return L;
    },
    update(t, T, { sunY = 160, sunO = 1, moonY = 150, moonO = 0, starsO = 0, night = 0, door = 0, tomb = 0 } = {}) {
      swing(sunEl, 1180, sunY, T, 0.8, 0.6); fade(sunEl, sunO);
      swing(moonEl, 560, moonY, T, 0.8, 0.5, 2); fade(moonEl, moonO);
      clouds.forEach((cl) => swing(cl.el, cl.x + (T ? Math.sin(T * 0.1 + cl.i) * 20 : 0), cl.y, T, 1.1, 0.6, cl.i));
      starL.fade(starsO);
      veil.fade(night);
      fade(doorGlow, door);
      pose(tombGlow, { x: TX, y: TY - 20, s: 0.8 + tomb * 0.4, o: tomb });
    },
  };
}

/* ====================================================================== the supper room */
export const SR = { FLOOR: 700, CEIL: 210, JX: 800, MX: 596, TX0: 880, TX1: 1230, TOP: 628, SEAT: 652, GUESTS: [935, 1015, 1095, 1175], JUD: 1262, DOOR: [300, 410, 440], WIN: [1010, 1170, 330, 520] };
/**
 * Lazarus' house at supper: warm plaster walls, a window onto the dusk and the Mount of Olives, an arched door on
 * the left (where Mary comes in), two hanging lamps, a woven rug and the low table. Layers are returned so the
 * scene can put its people between them: { wallL, lampL, floorL, backL, tableL, frontL, fx, scentBack, scentFront, wash }.
 */
export function supperRoom(S, { skyCols = EVE } = {}) {
  const c = S.c;
  const { FLOOR } = SR;
  const CEIL = S.portrait ? -80 : SR.CEIL;    // phone: the ceiling sits higher, so the tall screen is not a third wood
  const [W0, W1, WT, WB] = SR.WIN;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.03, sh: 1, flat: true });
  starL.add(stars(c, { x0: 950, x1: 1250, y0: 280, y1: 460, n: 16 }));
  const view = S.layer({ par: 0.12, sh: 2 });
  view.add(band(c, { y: 470, amps: [12, 5, 2], lens: [600, 220, 80], color: mix(C.hillMid, C.duskViolet, 0.5) }).markup);
  let ol = '';
  for (let i = 0; i < 10; i++) ol += c.cut(c.blob(960 + i * 26, 468 + c.rr(-6, 4), 12, 9, 8, 0.2), 0.4, 3);
  view.add(`<path d="${ol}" fill="${mix(C.olive, C.duskViolet, 0.45)}"/>`);
  // the wall
  const wallL = S.layer({ par: 0.3, sh: 3 });
  const wcol = mix(C.plaster, C.apricot, 0.22);
  const [D0, D1, DT] = SR.DOOR;
  const win = [[W0, WB], [W0, WT + 60], ...c.arc((W0 + W1) / 2, WT + 60, (W1 - W0) / 2, 60, PI, 2 * PI, 14), [W1, WB]];
  const door = [[D0, FLOOR + 6], [D0, DT], ...c.arc((D0 + D1) / 2, DT, (D1 - D0) / 2, 50, PI, 2 * PI, 12), [D1, FLOOR + 6]];
  const w = sheet();
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), wcol);
  let blot = '';
  for (let i = 0; i < 12; i++) blot += c.cut(c.blob(c.rr(-200, 1800), c.rr(CEIL + 50, FLOOR - 80), c.rr(24, 60), c.rr(10, 22), 10, 0.2), 0.8, 6);
  w.x(blot, shade(wcol, -0.06), 'opacity=".5"');
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, CEIL], [-900, CEIL]], 0.8, 30), shade(C.wood2, -0.2));
  let beams = '';
  for (let x = -300; x < 1900; x += 120) beams += c.cut(c.rect(x, CEIL - 6, 24, 28), 0.3, 5);
  w.p(beams, shade(C.wood, -0.08));
  w.p(c.ribbon(win.slice(0, -1), 12), C.wood2);
  w.p(c.cut(c.rect(W0 - 18, WB - 4, W1 - W0 + 36, 14), 0.3, 8), C.wood);
  w.p(c.ribbon([[(W0 + W1) / 2, WT + 2], [(W0 + W1) / 2, WB]], 5) + c.ribbon([[W0, WT + 110], [W1, WT + 110]], 5), C.wood2);
  w.p(c.ribbon([[D0 - 5, FLOOR + 4], [D0 - 5, DT]], 10) + c.ribbon([[D1 + 5, FLOOR + 4], [D1 + 5, DT]], 10) + c.ribbon(c.arc((D0 + D1) / 2, DT, (D1 - D0) / 2 + 5, 55, PI, 2 * PI, 12), 10), C.wood2);
  // a niche with jars, a shelf; a garland of dried herbs
  w.p(c.cut([[500, 470], [500, 400], ...c.arc(550, 400, 50, 34, PI, 2 * PI, 10), [600, 470]], 0.4, 5), shade(wcol, -0.12));
  w.p(c.cut([[516, 470], [512, 446], [520, 432], [534, 430], [538, 446], [534, 470]], 0.3, 4) + c.cut([[556, 470], [552, 440], [566, 436], [580, 440], [576, 470]], 0.3, 4), C.pot);
  w.p(c.cut(c.rect(1250, 420, 170, 9), 0.3, 6), C.wood2);
  w.p(c.cut([[1270, 420], [1266, 396], [1276, 386], [1290, 396], [1286, 420]], 0.3, 4) + c.cut([[1320, 420], [1318, 404], [1340, 400], [1344, 420]], 0.3, 4) + c.cut([[1370, 420], [1364, 392], [1384, 388], [1392, 420]], 0.3, 4), mix(C.clay, C.cream, 0.3));
  wallL.add(`<rect x="${D0}" y="${DT - 60}" width="${D1 - D0}" height="${FLOOR - DT + 70}" fill="${mix(C.night, C.plumRobe, 0.35)}"/>` + w.out());
  // the lamps
  const lampL = S.layer({ par: 0.34, sh: 3 });
  const lamps = [[650, 300], [1000, 280]].map(([x, y]) => { const el = hanging(lampL, `<g transform="translate(-20 0)">${hangLamp(c)}</g>`, { x, y, len: 120 + SR.CEIL - CEIL }); return { el, x, y, fl: el.querySelector('.flame') }; });
  // the floor and a woven rug
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR - 4], [2500, FLOOR - 4], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.clay, 0.3));
  let tiles = '';
  for (let r = 0; r < 6; r++) tiles += c.ribbon([[-900, FLOOR + 12 + r * r * 9 + r * 14], [2500, FLOOR + 12 + r * r * 9 + r * 14 + c.rr(-2, 2)]], 1.4);
  fl.x(tiles, shade(C.stone2, -0.2), 'opacity=".45"');
  fl.p(c.cut([[520, FLOOR + 8], [1320, FLOOR + 8], [1400, FLOOR + 120], [440, FLOOR + 120]], 0.8, 12), mix(C.terracotta, C.plumRobe, 0.2));
  let dia = '';
  for (let x = 540; x < 1340; x += 44) dia += c.poly([[x, FLOOR + 64], [x + 10, FLOOR + 52], [x + 20, FLOOR + 64], [x + 10, FLOOR + 76]]);
  fl.x(dia, C.ochre, 'opacity=".8"');
  fl.x(c.ribbon([[500, FLOOR + 30], [1340, FLOOR + 30]], 3) + c.ribbon([[470, FLOOR + 100], [1370, FLOOR + 100]], 3), C.cream, 'opacity=".5"');
  floorL.add(fl.out());
  // a warm pool of lamplight
  const glowL = S.layer({ par: 0.42, sh: 0, flat: true });
  glowL.add(`<ellipse cx="840" cy="520" rx="620" ry="340" fill="url(#warm-glow)" opacity=".5"/>`);
  const scentBack = S.layer({ par: 0.43, sh: 0, flat: true, pad: 80 });
  const backL = S.layer({ par: 0.46, sh: 4 });
  const tableL = S.layer({ par: 0.48, sh: 5 });
  // the low table with a cloth
  const t = sheet();
  const { TX0, TX1, TOP } = SR;
  t.p(c.cut(c.rect(TX0 + 18, TOP, 12, 44), 0.3, 5) + c.cut(c.rect(TX1 - 30, TOP, 12, 44), 0.3, 5), C.wood2);
  t.p(c.cut(c.rect(TX0, TOP - 6, TX1 - TX0, 12), 0.4, 10), C.wood);
  const cl = [[TX0 + 6, TOP + 4], [TX1 - 6, TOP + 4], [TX1 - 10, TOP + 26]];
  for (let x = TX1 - 10; x > TX0 + 10; x -= 22) cl.push(...c.arc(x - 11, TOP + 26, 11, 7, 0, PI, 4));
  t.p(c.cut(cl, 0.4, 6), C.linen);
  let dots = '';
  for (let x = TX0 + 22; x < TX1 - 16; x += 22) dots += c.poly(c.star(x, TOP + 16, 3.4, 1.2, 4, 0));
  t.x(dots, C.terracotta, 'opacity=".7"');
  tableL.add(t.out());
  const frontL = S.layer({ par: 0.5, sh: 5 });
  const scentFront = S.layer({ par: 0.62, sh: 0, flat: true, pad: 80 });
  const fx = S.layer({ par: 0.55, sh: 5 });
  // the fragrance: curls everywhere in the house + little nard sprigs, one flat sheet each side of the actors
  const curls = (n, x0, x1, y0, y1, col, sMax) => { let o = ''; for (let i = 0; i < n; i++) { const x = c.rr(x0, x1), y = c.rr(y0, y1), s = c.rr(0.5, sMax); o += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)}) rotate(${c.rr(-20, 20).toFixed(0)})">${curl(c, 120, col)}</g>`; } return o; };
  scentBack.add(`<g>${curls(18, -300, 1900, 300, 700, '#f4dcef', 1.2)}${curls(10, -300, 1900, 260, 520, '#fbe6c4', 1)}</g>`);
  let spr = '';
  for (let i = 0; i < 16; i++) spr += `<g transform="translate(${c.rr(-200, 1800).toFixed(0)} ${c.rr(250, 560).toFixed(0)}) rotate(${c.rr(-40, 40).toFixed(0)}) scale(${c.rr(0.6, 1.1).toFixed(2)})">${nardSprig(c, 34)}</g>`;
  scentBack.add(spr);
  scentFront.add(`<g opacity=".6">${curls(4, -200, 380, 700, 900, '#f7e3f2', 1.3)}${curls(4, 1250, 1800, 700, 900, '#f7e3f2', 1.3)}</g>`);
  const wash = S.layer({ par: 0.6, sh: 0, flat: true });
  wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.blushVeil, C.lavender, 0.4)}" opacity=".22"/>`);
  return {
    sk, starL, wallL, lampL, floorL, backL, tableL, frontL, fx, scentBack, scentFront, wash, lamps,
    update(t, T, { scent = 0, lit = 1 } = {}) {
      lamps.forEach((l, i) => { swing(l.el, l.x, l.y, T, 0.7, 0.6, i * 2); pose(l.fl, { x: 40, y: 36, sy: 1 + (T ? Math.sin(T * 9 + i) * 0.08 : 0), sx: 1 + (T ? Math.sin(T * 7 + i) * 0.05 : 0), o: lit }); });
      scentBack.fade(scent);
      scentFront.fade(scent * 0.9);
      wash.fade(scent);
      if (scent > 0.001 && T) { scentBack.shift(Math.sin(T * 0.25) * 30, -Math.sin(T * 0.18) * 16); scentFront.shift(Math.sin(T * 0.2 + 1) * 40, Math.sin(T * 0.22) * 14); }
    },
  };
}

/* ====================================================================== the road below the city gate */
import { cityWall as cityWall11, sanctuary as sanct11, frond as frond11 } from '../mark11/lib.js';
export const RD = { GROUND: 668, GATE: 440, WT: 420, GY: 650 };
/**
 * The road that leaves Jerusalem's east gate towards the Mount of Olives: the city wall and gate on the left with
 * the Temple rising behind, festival pilgrims' tents, date palms along the road, the olive slopes on the right.
 * Returns { sk, sunEl, clouds, cityL, palmsL, roadL, fg(), update(t, T) }.
 */
export function roadSet(S, { skyCols = MORNING, sunAt = [1200, 150], bunting = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 42), { x: sunAt[0], y: sunAt[1], len: 700 });
  const clouds = [[560, 120, 180], [980, 200, 130]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 600 }), x, y, i }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 130], color: C.hillFar, x0: -1400, x1: 3200 }).markup);
  // the Mount of Olives on the right
  const mt = S.layer({ par: 0.16, sh: 3 });
  mt.add(hillsWith(c, { y: 520, amps: [30, 10, 3], lens: [1300, 360, 120], color: mix(C.hillMid, C.sage2, 0.2), trees: 40, treeColor: C.olive, treeH: 16, x0: 700, x1: 3200 }).markup);
  // the city: the Temple, roofs, the wall and the gate
  const cityL = S.layer({ par: 0.24, sh: 4, pad: 200 });
  const { GATE, WT, GY } = RD;
  cityL.add(`<g transform="translate(${GATE - 250} ${WT - 40})">${sanct11(c, 1.0)}</g>`);
  const hs = sheet();
  let hd = '';
  for (let x = GATE - 900; x < GATE + 240; x += c.rr(34, 60)) { const h = c.rr(30, 70); if (Math.abs(x - GATE + 250) < 110) continue; hd += c.cut(c.rect(x, WT - h, c.rr(36, 58), h + 10), 0.4, 6); }
  hs.p(hd, mix(C.plaster, C.sand, 0.3));
  cityL.add(hs.out());
  cityL.add(cityWall11(c, GATE - 1000, GATE + 220, WT, GY, { towers: [{ x: GATE - 90, w: 78, h: 60 }, { x: GATE + 90, w: 78, h: 60 }, { x: GATE - 480, w: 60, h: 36 }], gate: { x: GATE, w: 110, h: 180 }, merlon: 12 }));
  const gd = sheet();
  gd.p(c.cut([[GATE - 55, GY], [GATE - 55, GY - 125], [GATE - 92, GY - 118], [GATE - 92, GY + 4]], 0.4, 6) + c.cut([[GATE + 55, GY], [GATE + 55, GY - 125], [GATE + 92, GY - 118], [GATE + 92, GY + 4]], 0.4, 6), C.wood2);
  cityL.add(gd.out());
  if (bunting) {
    const bs = sheet();
    const cord = c.qbez([GATE - 460, WT - 20], [GATE - 180, WT + 30], [GATE + 170, WT - 50], 20);
    bs.p(c.ribbon(cord, 1.4), C.rope);
    const cols = [C.terracotta, C.ochre, C.teal2, C.roseRobe, C.sageRobe];
    cord.forEach(([x, y], i) => { if (i % 2) return; bs.p(c.cut([[x - 9, y], [x + 9, y], [x, y + 20]], 0.3, 4), cols[i % cols.length]); });
    cityL.add(bs.out());
  }
  // pilgrims' tents along the wall
  const tents = S.layer({ par: 0.3, sh: 3, pad: 200 });
  let td = '';
  [[GATE + 250, C.ochreRobe], [GATE + 380, C.dustyBlue], [GATE + 520, C.roseRobe]].forEach(([x, col]) => {
    const s = sheet();
    s.p(c.cut([[x - 60, GY + 6], [x - 4, GY - 70], [x + 4, GY - 70], [x + 60, GY + 6]], 0.6, 6), col);
    s.p(c.cut([[x - 14, GY + 6], [x, GY - 40], [x + 14, GY + 6]], 0.3, 4), shade(col, -0.3));
    s.x(c.ribbon([[x, GY - 70], [x, GY - 84]], 2), C.wood2);
    td += s.out();
  });
  tents.add(td);
  // palms along the road
  const palmsL = S.layer({ par: 0.36, sh: 3, pad: 300 });
  palmsL.add(palm(c, GATE + 330, GY + 20, 240) + palm(c, GATE + 470, GY + 24, 280) + palm(c, 1160, GY + 20, 250) + palm(c, 1330, GY + 24, 290) + olive(c, 1500, GY + 20, 1) + cypress(c, GATE + 620, GY + 22, 150));
  // the ground and the road
  const roadL = S.layer({ par: 0.45, sh: 3, pad: 500 });
  const rs = sheet();
  const G = RD.GROUND;
  rs.p(c.ridge(c.wave(G - 26, [4, 2], [800, 200]), -1600, 3600, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4));
  rs.p(c.cut([[GATE - 60, GY + 2], [GATE + 60, GY + 2], [3600, G - 12], [3600, G + 60], [-1600, G + 70], [-1600, G + 8]], 1.4, 16), mix(C.sand, C.sand2, 0.35));
  roadL.add(rs.out() + grass(c, { x0: -1400, x1: 3400, y: G - 20, n: 50, h: 13, color: C.olive }) + grass(c, { x0: -1400, x1: 3400, y: G + 90, n: 50, h: 16, color: C.moss }));
  return {
    sk, sunEl, clouds, hangL, mt, cityL, tents, palmsL, roadL,
    fg(par = 0.95) {
      const L = S.layer({ par, sh: 6, pad: 300 });
      L.add(bush(c, 200, 930, 240, C.sage, C.moss) + rock(c, 1320, 915, 180, 60, C.rock2) + palm(c, 1560, 960, 330));
      return L;
    },
    update(t, T, { sunY = sunAt[1] } = {}) {
      swing(sunEl, sunAt[0], sunY, T, 1, 0.7);
      clouds.forEach((cl) => swing(cl.el, cl.x + (T ? Math.sin(T * 0.1 + cl.i) * 24 : 0), cl.y, T, 1.2, 0.6, cl.i));
    },
  };
}
/** the Daughter of Zion: a young woman in sky-blue whose crown is a little city wall with towers */
export function zionDaughter(c) {
  const o = { robe: C.skyVeil, mantle: C.dustyBlue, hairStyle: 'veil', veil: C.dustyBlue, veil2: shade(C.dustyBlue, 0.2), hair: C.hair2, skin: C.skin, beard: 'none', belt: C.sun };
  const s = sheet();
  const pts = [[-20, -14], [-20, -26]];
  for (let x = -20; x < 18; x += 8) pts.push([x, -26], [x, -32], [x + 4, -32], [x + 4, -26]);
  pts.push([20, -26], [20, -14]);
  s.p(c.cut(pts, 0.3, 3), C.sun);
  s.x(c.poly(c.rect(-3, -22, 6, 8)), shade(C.sun, -0.3));
  return addToHead(person(c, o), s.out());
}
/** a palm frond held in a hand (hold coords) */
export const handFrond = (c, len = 96) => `<g class="fr" transform="rotate(-8)">${frond11(c, len)}</g>`;

/* ====================================================================== the Temple court */
import { templeCourt as court11, courtFront as front11 } from '../mark11/lib.js';
import { hourglassRig as glass7 } from '../john7/lib.js';
export const CT = { FLOOR: 704, JX: 820 };
/** the Court of the Gentiles (the mark11 court with its soreg balustrade) + a dimming veil; layers back / act / fx */
export function courtStage(S, { skyCols = DAY, sunAt = [1220, 150], front = true } = {}) {
  const court = court11(S, { skyCols, floorY: CT.FLOOR + 30, sanctX: 800, sunAt });
  const dim = S.layer({ par: 0.42, sh: 0, flat: true });
  dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.3)}" opacity=".4"/>`);
  dim.fade(0);
  const glowL = S.layer({ par: 0.44, sh: 0, flat: true });
  const back = S.layer({ par: 0.47, sh: 4 });
  const act = S.layer({ par: 0.52, sh: 5 });
  const fx = S.layer({ par: 0.56, sh: 5 });
  return { ...court, dim, glowL, back, act, fx, front: () => (front ? front11(S, {}) : null) };
}
/** an hourglass hung from the flies on a string: { el, set(x, y, level, flow, T, o) } */
export function hangGlass(L, c, h = 110) {
  const str = L.add(`<g><path d="M0 -1600V${-h / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
  const g = glass7(L, c, h);
  return {
    el: g.el,
    set(x, y, level, flow, T = 0, o = 1) {
      const r = T ? Math.sin(T * 0.7) * 1 : 0;
      pose(str, { x, y, o });
      pose(g.el, { x, y, r, o });
      g.set(level, flow);
    },
  };
}
/** a small Greek ship on waves (origin centre) — "from over the sea" */
export function shipIcon(c) {
  const s = sheet();
  s.p(c.cut([[-40, 0], [40, 0], [30, 16], [-30, 16]], 0.4, 4), C.wood2);
  s.p(c.ribbon([[0, 0], [0, -46]], 2.4), C.wood2);
  s.p(c.cut([[2, -44], [30, -36], [28, -6], [2, -8]], 0.4, 4), C.cream);
  s.x(c.ribbon([[4, -30], [28, -24]], 3), C.terracotta);
  s.p(c.cut([[-60, 18], [-30, 12], [0, 18], [30, 12], [60, 18], [60, 28], [-60, 28]], 0.6, 5), C.lake2);
  s.x(c.poly(c.circ(-28, 6, 2.4, 6)) + c.poly(c.circ(-14, 6, 2.4, 6)) + c.poly(c.circ(14, 6, 2.4, 6)), C.sun);
  return s.out();
}

/* ====================================================================== the dark stage */
/** a night stage: deep sky with paper stars, dark hills, a floor; a flat veil; layers back / act / fx */
export function darkStage(S, { skyCols = DARK, floor = 704, starsN = 80, hills = true } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 460, n: starsN }));
  const heav = S.layer({ par: 0.05, sh: 0, flat: true });
  if (hills) S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 520, amps: [18, 7, 3], lens: [1100, 380, 130], color: mix(C.night2, C.indigo, 0.5), x0: -1400, x1: 3200 }).markup);
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fs = sheet();
  fs.p(c.cut([[-1400, floor - 40], [3200, floor - 40], [3200, 1800], [-1400, 1800]], 1, 20), mix(C.indigo, C.stone2, 0.22));
  let pl = '';
  for (let i = 0; i < 6; i++) pl += c.ribbon([[-1400, floor - 30 + i * i * 8 + i * 12], [3200, floor - 30 + i * i * 8 + i * 12 + c.rr(-2, 2)]], 1.2);
  fs.x(pl, C.indigo, 'opacity=".6"');
  floorL.add(fs.out());
  const glowL = S.layer({ par: 0.44, sh: 0, flat: true });
  const back = S.layer({ par: 0.47, sh: 4 });
  const act = S.layer({ par: 0.52, sh: 5 });
  const fx = S.layer({ par: 0.56, sh: 5 });
  return { sk, starL, heav, floorL, glowL, back, act, fx, FLOOR: floor };
}
/** a seraph of light: a flame body and three pairs of wings (origin centre) */
export function seraph(c, s = 1) {
  const g = sheet();
  const wing = (dir, a, len, w) => c.cut([[0, 0], ...c.arc(0, 0, len, w, a - 0.35, a + 0.35, 6).map(([x, y]) => [x * dir, y])], 0.4, 4);
  const P = (d) => d;
  g.p(wing(1, -0.9, 70 * s, 50 * s) + wing(-1, -0.9, 70 * s, 50 * s), mix(C.halo, C.star, 0.4));
  g.p(wing(1, -0.3, 60 * s, 30 * s) + wing(-1, -0.3, 60 * s, 30 * s) + wing(1, 0.7, 50 * s, 34 * s) + wing(-1, 0.7, 50 * s, 34 * s), C.halo);
  g.p(c.cut([[0, -38 * s], [12 * s, -10 * s], [8 * s, 30 * s], [0, 40 * s], [-8 * s, 30 * s], [-12 * s, -10 * s]], 0.3, 4), mix(C.sun, C.halo, 0.4));
  return `<circle r="${90 * s}" fill="url(#halo-glow)"/>${g.out()}`;
}
/** the throne of glory: empty, cut from pale gold, with a train of light falling from it (origin: seat centre) */
export function throneOfLight(c) {
  const s = sheet();
  // the train of light, soft and pale, spilling down behind the steps
  const tr_ = sheet();
  tr_.p(c.cut([[-80, 40], [80, 40], [200, 300], [120, 320], [0, 300], [-120, 320], [-200, 300]], 0.8, 10), mix(C.halo, C.star, 0.4));
  let fold = '';
  for (let i = -3; i <= 3; i++) fold += c.ribbon([[i * 12, 44], [i * 50, 300]], 2.4);
  tr_.x(fold, C.haloRim, 'opacity=".4"');
  // the throne: an arched back, arms, a seat, steps — all of light, and empty
  s.p(c.cut([[-58, 0], [-58, -110], ...c.arc(0, -110, 58, 58, PI, 2 * PI, 14), [58, -110], [58, 0]], 0.5, 6), mix(C.halo, C.haloRim, 0.35));
  s.p(c.cut([[-40, -6], [-40, -104], ...c.arc(0, -104, 40, 40, PI, 2 * PI, 12), [40, -104], [40, -6]], 0.4, 6), C.halo);
  s.p(c.cut([[-84, -40], [-58, -40], [-58, 0], [-84, 0]], 0.3, 4) + c.cut([[58, -40], [84, -40], [84, 0], [58, 0]], 0.3, 4), C.haloRim);
  s.p(c.cut([[-76, -4], [76, -4], [76, 14], [-76, 14]], 0.4, 6), mix(C.halo, C.haloRim, 0.5));
  s.p(c.cut([[-96, 14], [96, 14], [104, 30], [-104, 30]], 0.4, 6) + c.cut([[-116, 30], [116, 30], [124, 46], [-124, 46]], 0.4, 6), mix(C.halo, C.star, 0.3));
  s.x(c.poly(c.star(0, -140, 16, 6, 6, 0)), C.star);
  return `<circle r="320" fill="url(#halo-glow)"/><g opacity=".75">${tr_.out()}</g>${s.out()}`;
}
/** a blindfold band across the eyes (head coords, facing right) */
export function blindBand(c, col = '#2a2140') {
  return sheet().p(c.cut([[-18, -9], [20, -8], [21, 1], [-18, 0]], 0.3, 4), col).p(c.cut([[-18, -6], [-30, 4], [-26, 8], [-16, 0]], 0.3, 3), col).out();
}
