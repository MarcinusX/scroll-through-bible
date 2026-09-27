// John 20 — the first day of the week. The garden and the tomb before dawn (Mark 16's garden), the race of the two
// disciples, the inside of the tomb with the linen lying and the face cloth rolled apart, the two angels in white,
// the gardener's garden that bursts into bloom at "Mary!", the upper room of John 13–14 with its door bolted, the
// signs of light on His hands and side, Thomas' three conditions, eight days, the night globe of those who have not
// seen, and the book that is written "so that you may believe".
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, hanging, swing, lerp, blinkAt, sky } from '../kit.js';
import { fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { flowers, house, grass } from '../../assets/nature.js';
import { nightRoom, TW as TW14 } from '../john14/lib.js';
import { withFace, faceBits } from '../mark3/lib.js';
import { signBadge } from '../john2/lib.js';
import { signMedal, loafIcon, waveIcon } from '../john6/lib.js';
import { matRoll } from '../john5/lib.js';
import { caveIcon } from '../john11/lib.js';
import { eyeIcon } from '../john9/lib.js';
import { heart } from '../mark3/lib.js';
import { gardenSet } from '../mark16/lib.js';

export {
  MAGD, gardenSet, GARDEN_PATH, pathS, DOOR, STONE, skyKeys, upright, tombLight, bigStone, medallion, miniHead, risenIcon,
  tombIcon, talkDots, ELEVEN, kf, hand, headAt, handAt, speech, thought, GLYPH, spark, heart, stoneHeart, withFace, faceBits,
  along, nameTag, bubble, strip, sparkle, voiceRings, hang2, dove, glory, globe, soulLight, lightCrown, TWELVE, LOOK,
} from '../mark16/lib.js';
export { nightRoom, shutter, peaceDove, plateVeil, worryCloud, TW, short, NIGHT as ROOM_NIGHT } from '../john14/lib.js';
export { radiance, rayBurst, glowDisc, goldWord, hungGold, hungWord, hungPlate, threads } from '../john1/lib.js';
export { signBadge, dayDisc } from '../john2/lib.js';
export { handLamp } from '../mark13/lib.js';
export { vis, wordTag } from '../mark14/lib.js';
export { flapWings, flame } from '../mark1/lib.js';
export { question } from '../mark3/lib.js';
export { tr, C, CAST, person, sheet, shade, mix, pose, hanging, swing, lerp, blinkAt, sky, fade, attr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const NIGHT = [C.night2, C.indigo, mix(C.indigo, C.duskViolet, 0.45)];
export const PRE = [C.indigo, mix(C.indigo, C.duskViolet, 0.55), mix(C.duskViolet, C.dusk, 0.5)];
export const ROSE = [mix(C.duskViolet, C.skyBlue2, 0.45), mix(C.dusk, C.peach, 0.4), C.dawn];
export const GOLD = [C.skyBlue, mix(C.dawn, C.skyBlue, 0.3), '#f8e6bd'];
export const DAY = [mix(C.skyBlue, C.cream, 0.2), mix(C.skyBlue, C.cream, 0.6), C.cream];
export const EVENING = ['#3a3c72', '#7d6a92', '#c99a95'];

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
export const PETER = CAST.peter;
export const BELOVED = CAST.john;          // "the other disciple, whom Jesus loved"
export const THOMAS = CAST.thomas;
export const ANGEL_A = { robe: '#fffdf6', mantle: mix(C.linen, C.halo, 0.25), hair: C.wheat2, hairStyle: 'long', beard: 'none', skin: C.skin };
export const ANGEL_B = { robe: '#fffdf6', mantle: mix(C.linen, C.skyVeil, 0.3), hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2 };

/** back-hand position of a puppet (arm angle a in degrees), like handAt for the front arm */
export function handB(x, y, s, flip, a, p = 'stand') {
  const r = (a * PI) / 180;
  const hx = -9 + 1.5 * Math.cos(r) + 57 * Math.sin(r), hy = -138 + DY[p] - 1.5 * Math.sin(r) + 57 * Math.cos(r);
  return [x + (flip ? -1 : 1) * hx * s, y + hy * s];
}
/** a point on the body (side, chest…) in world coords: local (lx, ly) of a puppet at x, y, s, flip */
export const bodyAt = (x, y, s, flip, lx, ly) => [x + (flip ? -1 : 1) * lx * s, y + ly * s];

/** an angel in white with soft, subtle wings (wings follow the pose) */
export function angelPerson(c, o, P = 'sit') {
  const dy = DY[P];
  const w = (dir, col, dk) => {
    const pts = [[0, 0], [-18, -26], [-44, -58], [-74, -74], [-70, -52], [-84, -42], [-64, -24], [-74, -10], [-46, 0], [-50, 14], [-18, 10]];
    let fe = '';
    for (let i = 0; i < 4; i++) fe += c.ribbon([[-(18 + i * 12), -8 - i * 9], [-(40 + i * 10), -26 - i * 10]], 1.2);
    return `<g transform="translate(${dir < 0 ? -2 : -8} ${-128 + dy}) scale(${dir < 0 ? 0.9 : 1} 1)" opacity=".9"><path d="${c.cut(pts, 0.5, 5)}" fill="${col}"/><path d="${fe}" fill="${dk}"/></g>`;
  };
  const wings = w(-1, mix(C.linen, C.halo, 0.25), mix(C.linen2, C.haloRim, 0.2)) + w(1, '#fffaf0', mix(C.linen2, C.halo, 0.3));
  return person(c, { ...o, pose: P }).replace('<g class="body">', `<g class="body"><g class="wings">${wings}</g>`);
}

/* ================================================================== small lights and marks */
/** a small radiant light (the marks on His hands and side are only ever shown as light); origin centre */
export function markLight(c, r = 7) {
  const s = sheet().p(c.cut(c.star(0, 0, r * 1.7, r * 0.55, 8, 0), 0.2, 2), C.halo).x(c.poly(c.circ(0, 0, r * 0.55, 10)), '#fffdf4');
  return `<circle r="${r * 4.2}" fill="url(#halo-glow)"/>${s.out()}`;
}
/** an open palm, fingers up (origin palm centre) */
export function palm(c, col = C.skin2, sc = 1) {
  const s = sheet();
  const f = [[-10, 20], [-3.5, 23], [3.5, 22], [10, 18]];
  let fing = '';
  f.forEach(([dx, len], i) => { fing += c.ribbon([[dx * sc, -6 * sc], [dx * 1.15 * sc, -(len + 2) * sc]], 6.4 * sc); });
  fing += c.ribbon([[-13 * sc, 6 * sc], [-24 * sc, -6 * sc]], 7 * sc);
  s.p(c.cut(c.blob(0, 4 * sc, 15 * sc, 17 * sc, 12, 0.06), 0.3, 3) + fing, col);
  s.x(c.ribbon(c.arc(0, 10 * sc, 8 * sc, 5 * sc, 0.2, PI - 0.2, 6), 1.1 * sc), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/** a hand with one finger reaching out to the right (origin: fingertip) */
export function fingerHand(c, col = C.skin2, sleeve = C.tealRobe) {
  const s = sheet();
  s.p(c.cut([[-96, -12], [-40, -14], [-38, 12], [-96, 14]], 0.4, 5), sleeve);
  s.p(c.cut(c.blob(-28, 2, 15, 12, 10, 0.1), 0.3, 3) + c.ribbon([[-18, -4], [0, -4]], 6.4) + c.ribbon([[-24, 10], [-10, 12]], 6), col);
  return s.out();
}
/** a picture card on a string (origin: top centre, string going up); inner is drawn at the card's centre */
export function card(c, inner, { w = 120, h = 128, face = C.parchment, rim = C.cream, k } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, -2], [w / 2 + 2, h], [-w / 2 - 1, h + 1]], 0.6, 6), rim);
  s.p(c.cut([[-w / 2 + 7, 7], [w / 2 - 7, 6], [w / 2 - 6, h - 7], [-w / 2 + 7, h - 6]], 0.4, 6), face);
  s.x(c.poly(c.circ(0, 4, 3, 8)), C.wood2);
  return `<g${k_(k)}><path d="M0 -1600V2" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<g transform="translate(0 ${h / 2 + 2})">${inner}</g></g>`;
}
/** a small eye (origin centre) */
export function eye(c, r = 14, col = C.teal2) {
  const s = sheet();
  const almond = [...c.arc(0, r * 0.62, r * 1.18, r * 1.1, PI * 1.25, PI * 1.75, 10), ...c.arc(0, -r * 0.62, r * 1.18, r * 1.1, PI * 0.25, PI * 0.75, 10)];
  s.p(c.cut(almond, 0.3, 3), C.cream);
  s.p(c.cut(c.circ(0, 0, r * 0.45, 12), 0.2, 2), col);
  s.x(c.poly(c.circ(0, 0, r * 0.2, 8)), C.ink);
  s.x(c.ribbon(almond, 1.3), C.inkSoft);
  return s.out();
}
/** a robe's side seen close (for "put your hand into my side"), a light on it; origin centre */
export function sideIcon(c) {
  const s = sheet();
  s.p(c.cut([[-26, -40], [18, -42], [26, -20], [30, 40], [-30, 40], [-28, -10]], 0.5, 5), C.linen);
  s.p(c.cut([[-26, -40], [-6, -44], [-14, 0], [-20, 40], [-30, 40], [-28, -10]], 0.5, 5), C.jesusMantle);
  return `${s.out()}<g transform="translate(12 2)">${markLight(c, 6)}</g>`;
}
/** Thomas' three conditions, as picture icons (origin centre): 'see' | 'finger' | 'side' */
export function conditionIcon(c, kind) {
  if (kind === 'see') return `<g transform="translate(6 12)">${palm(c, C.skin, 1.2)}</g><g transform="translate(6 14)">${markLight(c, 5)}</g><g transform="translate(-26 -30)">${eye(c, 13)}</g>`;
  if (kind === 'finger') return `<g transform="translate(-10 0)">${palm(c, C.skin, 1.2)}</g><g transform="translate(-10 2)">${markLight(c, 5)}</g><g transform="translate(-4 24) rotate(-160) scale(.62)">${fingerHand(c, C.skin2, C.tealRobe)}</g>`;
  return `<g transform="translate(-10 0) scale(.9)">${sideIcon(c)}</g><g transform="translate(40 20) rotate(200) scale(.55)">${palm(c, C.skin2)}</g>`;
}
/** Thomas' arms folded across his chest: drawn onto the body (hidden until .fold is shown) */
export function foldedArms(c, o = THOMAS) {
  const s = sheet();
  const robe = shade(o.robe, -0.06);
  s.p(c.cut([[-16, -120], [24, -110], [26, -98], [-14, -104]], 0.4, 4), shade(o.robe, -0.14));
  s.p(c.cut([[-18, -104], [26, -118], [30, -106], [-14, -92]], 0.4, 4), robe);
  s.p(c.cut(c.circ(27, -114, 6, 10), 0.2, 3) + c.cut(c.circ(-15, -99, 5.5, 10), 0.2, 3), o.skin || C.skin2);
  return `<g class="fold" opacity="0">${s.out()}</g>`;
}
/** add the folded arms to a puppet's body (in front of the robe) */
export const withFolded = (markup, extra) => markup.replace('<g class="head"', `${extra}<g class="head"`);

/* ================================================================== the tomb from inside */
export const IN = { FLOOR: 700, DOOR_X: 420, LEDGE: { x0: 690, top: 606 }, LINEN: 930, HEAD: 1150 };
/**
 * The inside of the garden tomb: the rock chamber, the low doorway on the left (the garden in the morning
 * beyond it), the ledge along the right where the body lay, with the linen cloths and the face cloth rolled apart.
 * Returns { outside, outFig, room, shaft, linen, head, linenGlow, headGlow, dark } — `outFig` is a layer seen only
 * through the doorway (for someone standing outside); `dark` is a flat sheet of shadow over the chamber.
 */
export function tombInside(S, { out = [mix(C.skyBlue, C.dawn, 0.45), C.sage] } = {}) {
  const c = S.c;
  const { FLOOR, DOOR_X, LEDGE } = IN;
  const back = S.layer({ par: 0, sky: true });
  const wall = mix(C.rock2, C.soilDark, 0.32);
  back.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${wall}"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
  const cave = S.layer({ par: 0.3, sh: 3 });
  const cs = sheet();
  let blots = '';
  for (let i = 0; i < 24; i++) blots += c.cut(c.blob(c.rr(-600, 2200), c.rr(-400, 640), c.rr(60, 160), c.rr(30, 70), 10, 0.3), 1, 8);
  cs.x(blots, shade(wall, 0.1), 'opacity=".6"');
  cave.add(cs.out());
  // the garden beyond the doorway
  const outside = S.layer({ par: 0.45, sh: 0, flat: true });
  const doorPts = [[DOOR_X - 72, FLOOR], [DOOR_X - 72, 520], ...c.arc(DOOR_X, 520, 72, 62, PI, 2 * PI, 12), [DOOR_X + 72, 520], [DOOR_X + 72, FLOOR]];
  const os = sheet();
  os.p(c.cut(doorPts, 0.5, 6), out[0]);
  os.p(c.cut([[DOOR_X - 72, 646], [DOOR_X - 20, 628], [DOOR_X + 72, 638], [DOOR_X + 72, FLOOR], [DOOR_X - 72, FLOOR]], 0.6, 6), out[1]);
  os.p(c.cut(c.blob(DOOR_X + 34, 610, 22, 34, 9, 0.2), 0.6, 5) + c.cut(c.blob(DOOR_X - 44, 624, 16, 22, 9, 0.2), 0.6, 5), C.moss);
  outside.add(os.out());
  const outFig = S.layer({ par: 0.45, sh: 3 });
  const clip = S.id('doorclip');
  S.defs(`<clipPath id="${clip}"><path d="${c.poly(doorPts)}"/></clipPath>`);
  /** add a puppet seen only through the doorway; returns its .fig element */
  outFig.person = (markup) => outFig.add(`<g clip-path="url(#${clip})">${markup}</g>`).querySelector('.fig');
  // the chamber: rock around the doorway, the floor, the ledge
  const room = S.layer({ par: 0.5, sh: 5 });
  const rs = sheet();
  const ceil = [];
  for (let x = 2500; x > 300; x -= 70) ceil.push([x, 318 + Math.sin(x / 130) * 24 + c.rr(-10, 10) + (x < 640 ? (640 - x) * 0.14 : 0)]);
  rs.p(c.cut([[-900, -600], [2500, -600], ...ceil, [270, 430], [240, 480], [240, FLOOR + 10], [-900, FLOOR + 10]], 2, 14), mix(C.rock3, C.soilDark, 0.45));
  // the doorway's cut edge in the rock
  rs.p(c.ribbon([[DOOR_X - 80, FLOOR + 4], [DOOR_X - 80, 520], ...c.arc(DOOR_X, 520, 80, 70, PI, 2 * PI, 14), [DOOR_X + 80, 520], [DOOR_X + 80, FLOOR + 4]], 14), mix(C.rock2, C.soilDark, 0.4));
  rs.p(c.cut([[-900, FLOOR - 6], [2500, FLOOR - 10], [2500, 1700], [-900, 1700]], 1.2, 20), mix(C.rock2, C.soilDark, 0.25));
  rs.p(c.cut([[LEDGE.x0, LEDGE.top], [2500, LEDGE.top - 8], [2500, FLOOR - 6], [LEDGE.x0 + 10, FLOOR - 6]], 0.8, 10), mix(C.rock, C.soilDark, 0.12));
  rs.p(c.cut([[LEDGE.x0 - 10, LEDGE.top - 8], [2500, LEDGE.top - 16], [2500, LEDGE.top + 4], [LEDGE.x0, LEDGE.top + 6]], 0.6, 10), mix(C.rock, C.cream, 0.15));
  room.add(rs.out());
  const shaft = room.add(`<path d="${c.poly([[DOOR_X - 62, FLOOR - 2], [DOOR_X + 72, FLOOR - 2], [DOOR_X + 440, FLOOR + 150], [DOOR_X + 110, FLOOR + 160]])}" fill="${C.lampGlow}" opacity=".3"/>`);
  const linenGlow = room.add(`<g opacity="0"><ellipse cx="0" cy="-12" rx="190" ry="64" fill="url(#halo-glow)"/></g>`);
  const headGlow = room.add(`<g opacity="0"><ellipse cx="0" cy="-12" rx="80" ry="50" fill="url(#halo-glow)"/></g>`);
  const cl = S.layer({ par: 0.5, sh: 3 });
  const linen = cl.add(`<g transform="translate(${IN.LINEN} ${LEDGE.top - 4})">${linenLying(c)}</g>`);
  const head = cl.add(`<g transform="translate(${IN.HEAD} ${LEDGE.top - 4})">${faceCloth(c)}</g>`);
  return { outside, outFig, room, shaft, linen, head, linenGlow, headGlow, FLOOR, DOOR_X, LEDGE, doorPts };
}
/** the linen cloths lying flat where the body was (origin: bottom centre), ~260 long */
export function linenLying(c) {
  const s = sheet();
  // flat and empty: long strips collapsed where the body lay, a little dip in the middle
  s.p(c.cut([[-134, 0], [-130, -8], [-96, -11], [-50, -9], [-10, -6], [30, -8], [80, -11], [118, -9], [130, 0]], 0.5, 7), C.linen);
  s.p(c.cut([[-120, -8], [-104, -17], [-70, -16], [-40, -9], [-60, -8], [-96, -9]], 0.4, 5) + c.cut([[40, -8], [66, -16], [104, -15], [116, -9], [90, -10]], 0.4, 5), C.linen2);
  let bands = '';
  for (let x = -112; x < 116; x += 24) bands += c.ribbon([[x, -1], [x + 8, -9]], 1.2);
  s.x(bands, shade(C.linen2, -0.18), 'opacity=".7"');
  // loose ends hanging over the edge of the ledge
  s.p(c.cut([[112, -4], [134, -2], [140, 18], [128, 22], [122, 2]], 0.4, 4) + c.cut([[-128, -3], [-112, -2], [-118, 14], [-130, 12]], 0.4, 4), C.linen);
  return s.out();
}
/** the face cloth, rolled up and laid in a place by itself (origin: bottom centre) */
export function faceCloth(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -10, 22, 10, 18), 0.3, 4), C.linen);
  s.p(c.cut(c.circ(-20, -10, 9.5, 14), 0.3, 3), C.linen2);
  s.x(c.ribbon(c.arc(-20, -10, 5, 5, 0.2, PI * 1.8, 10), 1.2) + c.ribbon(c.arc(-20, -10, 2, 2, 0, PI * 1.6, 6), 1), shade(C.linen2, -0.22));
  s.x(c.ribbon([[-10, -19], [18, -18]], 1.1) + c.ribbon([[-10, -2], [18, -3]], 1.1), shade(C.linen2, -0.14), 'opacity=".7"');
  return s.out();
}

/* ================================================================== the city house (where Peter and John are) */
/** a flat-roofed house with its doorway and a bench beside it (origin: foot of the doorway) */
export function cityHouse(c, dawn = 0.4) {
  const wall = mix(C.plaster, C.duskViolet, 0.18 * (1 - dawn)), sh = mix(C.plaster2, C.duskViolet, 0.25 * (1 - dawn));
  const s = sheet();
  s.p(c.cut([[-150, 0], [-150, -190], [170, -190], [170, 0]], 0.8, 10), wall);
  s.p(c.cut([[120, 0], [120, -190], [170, -190], [170, 0]], 0.6, 8), sh);
  s.p(c.cut([[-162, -186], [182, -186], [182, -202], [-162, -202]], 0.5, 8), C.roof);
  let beams = '';
  for (let x = -140; x < 170; x += 38) beams += c.cut(c.rect(x, -186, 12, 10), 0.2, 3);
  s.p(beams, C.wood2);
  // doorway (dark inside), a window, a lamp niche
  s.p(c.cut([[-34, 0], [-34, -110], ...c.arc(0, -110, 34, 26, PI, 2 * PI, 10), [34, -110], [34, 0]], 0.5, 6), mix(C.soilDark, C.indigo, 0.25));
  s.p(c.cut(c.rect(62, -150, 38, 34), 0.3, 5), mix(C.soilDark, C.indigo, 0.2));
  s.p(c.ribbon([[-40, 2], [-40, -112], [0, -140], [40, -112], [40, 2]], 6), C.wood2);
  // the bench
  s.p(c.cut(c.rect(-140, -46, 96, 10), 0.3, 5), C.wood);
  s.p(c.cut(c.rect(-134, -36, 8, 36), 0.2, 3) + c.cut(c.rect(-62, -36, 8, 36), 0.2, 3), C.wood2);
  // a vine by the door
  let lv = '';
  for (let i = 0; i < 14; i++) lv += c.cut(c.ell(c.rr(44, 116), c.rr(-190, -60), c.rr(6, 10), c.rr(4, 6), 8, c.rr(0, 3)), 0.2, 3);
  s.p(c.ribbon([[52, 0], [60, -80], [48, -150], [80, -186]], 3), C.wood2);
  s.p(lv, C.moss);
  return s.out();
}
/** the stretch of city wall with a gate that the path runs through (origin: foot of the gate's centre) */
export function cityGate(c, tint = 0) {
  const st = mix(C.stone, C.duskViolet, tint), st2 = mix(C.stone2, C.duskViolet, tint);
  const s = sheet();
  s.p(c.cut([[-360, 0], [-360, -250], [360, -250], [360, 0], [70, 0], [70, -120], ...c.arc(0, -120, 70, 70, 0, -PI, 12), [-70, -120], [-70, 0]], 0.8, 10), st);
  let blocks = '';
  for (let y = -236; y < -10; y += 34) for (let x = -350 + ((y / 34) % 2 ? 0 : 30); x < 350; x += 62) if (Math.abs(x) > 90 || y < -200) blocks += c.ribbon([[x, y], [x + 50, y]], 1.2);
  s.x(blocks, st2, 'opacity=".7"');
  let cren = '';
  for (let x = -360; x < 360; x += 48) cren += c.cut(c.rect(x, -276, 30, 28), 0.3, 4);
  s.p(cren, st);
  s.p(c.ribbon([...c.arc(0, -120, 76, 76, PI, 2 * PI, 12)], 8), st2);
  return s.out();
}

/* ================================================================== the gardener's garden */
/** a gardener's hoe (origin: the hand-hold; handle along +y) */
export function hoe(c, len = 150) {
  const s = sheet();
  s.p(c.ribbon([[0, -30], [0, len]], 4.5), C.wood);
  s.p(c.cut([[-4, len - 6], [22, len - 2], [26, len + 10], [-4, len + 6]], 0.3, 3), mix(C.rock3, C.storm2, 0.3));
  return s.out();
}
/** a clay watering jar (origin: bottom centre) */
export function wateringJar(c) {
  const s = sheet();
  s.p(c.cut([[-16, 0], [-22, -18], [-18, -34], [-8, -40], [-9, -46], [9, -46], [8, -40], [18, -34], [22, -18], [16, 0]], 0.3, 4), C.pot);
  s.p(c.ribbon([[18, -28], [36, -40], [42, -44]], 3.4), C.pot);
  s.x(c.ribbon([[-18, -22], [18, -22]], 1.2), shade(C.pot, -0.2), 'opacity=".6"');
  return s.out();
}
/** a bed of young plants (origin: centre of the bed's front edge) */
export function plantBed(c, w = 220) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 10, -14], [w / 2 - 10, -16], [w / 2, 0]], 0.6, 8), C.soil);
  let lv = '';
  for (let x = -w / 2 + 16; x < w / 2 - 10; x += 22) {
    lv += c.cut(c.ell(x - 5, -20, 7, 3.2, 8, -0.6), 0.2, 2) + c.cut(c.ell(x + 5, -22, 7, 3.2, 8, 0.6), 0.2, 2);
    lv += c.ribbon([[x, -12], [x, -24]], 1.6);
  }
  s.p(lv, C.leaf);
  return s.out();
}
/** a cluster of closed buds (origin: ground centre) — w wide */
export function buds(c, w = 90, n = 7) {
  const s = sheet();
  let st = '', bd = '';
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (i + 0.5) * (w / n) + c.rr(-4, 4), h = c.rr(14, 26);
    st += c.ribbon([[x, 0], [x + c.rr(-2, 2), -h]], 1.4);
    bd += c.cut(c.ell(x, -h - 4, 3, 5, 8), 0.2, 2);
  }
  s.p(st, C.moss).p(bd, C.sage);
  return s.out();
}
/** the same cluster in full bloom (origin: ground centre) */
export function blooms(c, w = 90, n = 7, cols = [C.jesusMantle, C.cream, C.lavender, C.wheat, C.roseRobe]) {
  return flowers(c, { x0: -w / 2, x1: w / 2, y: 0, n, h: 26, colors: cols });
}
/** blossom on the crown of a tree (origin: centre of the crown) */
export function blossom(c, r = 70, n = 22, cols = [C.cream, C.blushVeil, C.roseRobe]) {
  let out = '';
  cols.forEach((col, j) => {
    let d = '';
    for (let i = 0; i < n / cols.length; i++) { const a = c.rr(0, PI * 2), rr = c.rr(0.1, 1) * r; d += c.cut(c.star(Math.cos(a) * rr, Math.sin(a) * rr * 0.7, c.rr(4, 7), 2.4, 5, c.rr(0, 6)), 0.2, 2); }
    out += `<path d="${d}" fill="${col}"/>`;
  });
  return out;
}
/** a translucent veil of tears (origin centre), two halves: returns { l, r } markup */
export function tearVeil(c, w = 170, h = 260) {
  const half = (dir) => {
    const pts = dir < 0
      ? [[-w / 2, -h / 2], [4, -h / 2 - 6], [-4, -h / 4], [6, 0], [-4, h / 4], [2, h / 2 + 4], [-w / 2 + 6, h / 2]]
      : [[4, -h / 2 - 6], [w / 2, -h / 2 + 4], [w / 2 - 4, h / 2], [2, h / 2 + 4], [-4, h / 4], [6, 0], [-4, -h / 4]];
    let d = '';
    for (let i = 0; i < 5; i++) { const y = -h / 2 + 20 + i * (h / 5); d += c.ribbon([[dir < 0 ? -w / 2 + 12 : 12, y], [dir < 0 ? -12 : w / 2 - 12, y + c.rr(-6, 6)]], 1.2); }
    return `<path d="${c.cut(pts, 1.2, 8)}" fill="#dfe6ee" opacity=".62"/><path d="${d}" fill="#c9d6e2" opacity=".6"/>`;
  };
  return { l: half(-1), r: half(1) };
}
/** a small gardener with his hoe (for a thought bubble; origin: feet) */
export function gardenerMini(c) {
  return person(c, { robe: C.ochreRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.wheat, veil2: C.ochre, beard: 'short', skin: C.skin3, belt: C.rope, holdF: `<g transform="rotate(-20)">${hoe(c, 110)}</g>` });
}

/* ================================================================== the upper room of John 20 */
/**
 * The upper room of John 13–14 (nightRoom), its windows shuttered for fear, plus a door on the right with a bar.
 * night: lamps lit, the dim sheet on; day: dim off, light through the cracks of the shutters.
 * Returns { R, door, FLOOR, dim } with door = { set(open), bolt(k), light, leaf, bar, cx, d0, d1, top }.
 */
export const RDOOR = { d0: 1158, d1: 1252, top: 486 };
export function room20(S, { night = true } = {}) {
  const c = S.c;
  const winA = [470, 590], winB = [1010, 1130];
  const col = mix(C.wood3, C.clay, 0.2);
  const shutterSheet = (x0, x1, y0, pad = 10) => {
    const s = sheet();
    s.p(c.cut([[x0 - pad, 518], [x0 - pad, y0], [x1 + pad, y0], [x1 + pad, 518]], 0.4, 6), col);
    let sl = '';
    for (let y = 510; y > y0 + 6; y -= 16) sl += c.ribbon([[x0 + 4, y], [x1 - 4, y + c.rr(-1, 1)]], 1.4);
    s.x(sl, shade(col, -0.3), 'opacity=".6"');
    s.p(c.ribbon([[(x0 + x1) / 2, y0 + 2], [(x0 + x1) / 2, 520]], 4), shade(col, -0.35));
    s.p(c.cut(c.rect((x0 + x1) / 2 - 20, 420, 40, 10), 0.2, 3), C.wood2);
    return s.out();
  };
  // by day the windows are shuttered (for fear); at night they show the sleeping city, as in John 13–14
  const R = nightRoom(S, {
    skyCols: night ? ['#232857', '#3c3f72', '#5f5a86'] : DAY,
    between: night ? null : (S2) => {
      const L = S2.layer({ par: 0.3, sh: 2 });
      [winA, winB].forEach(([x0, x1]) => L.add(shutterSheet(x0, x1, 320)));
      return L;
    },
  });
  if (!night) {
    // the lower part again in front of the wall (the wall's paper blotches must not float over the shutters)
    const F = S.layer({ par: 0.3, sh: 1 });
    [winA, winB].forEach(([x0, x1]) => F.add(shutterSheet(x0, x1, 352, -5)));
    F.add(`<path d="${c.ribbon([[530, 352], [530, 516]], 2.4) + c.ribbon([[1070, 352], [1070, 516]], 2.4)}" fill="#fff6d8"/>`);
  }
  if (!night) { R.dim.fade(0); R.stars.fade(0); }
  // day: soft beams through the cracks of the shutters
  const beamL = S.layer({ par: 0.35, sh: 0, flat: true });
  if (!night) {
    const gid = S.id('crack');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3cf" stop-opacity=".55"/><stop offset="1" stop-color="#fff3cf" stop-opacity="0"/></linearGradient>`);
    beamL.add(`<path d="${c.poly([[526, 340], [534, 340], [640, 712], [560, 712]])}" fill="url(#${gid})"/><path d="${c.poly([[1066, 340], [1074, 340], [1000, 712], [920, 712]])}" fill="url(#${gid})"/>`);
  }
  // the door on the right: opening, frame, leaf, bar
  const { d0, d1, top } = RDOOR, FLOOR = R.FLOOR;
  const nk = night ? 0.42 : 0;
  const tone = (col) => mix(col, mix(C.night2, C.plumRobe, 0.25), nk);
  const dL = S.layer({ par: 0.3, sh: 3 });
  const light = dL.add(`<path d="${c.poly(c.rect(d0, top, d1 - d0, FLOOR - top + 2))}" fill="${night ? '#0d0f26' : mix(C.lampGlow, C.cream, 0.4)}"/>`);
  const fr = sheet();
  fr.p(c.ribbon([[d0 - 7, FLOOR + 2], [d0 - 7, top - 7], [d1 + 7, top - 7], [d1 + 7, FLOOR + 2]], 12), tone(C.wood2));
  fr.p(c.cut(c.rect(d0 - 24, top - 28, d1 - d0 + 48, 15), 0.3, 6), tone(C.wood));
  // brackets for the bar
  fr.p(c.cut(c.rect(d0 - 22, 594, 16, 22), 0.2, 3) + c.cut(c.rect(d1 + 6, 594, 16, 22), 0.2, 3), tone(C.soilDark));
  dL.add(fr.out());
  const lw = d1 - d0, lh = FLOOR - top;
  const lf = sheet();
  lf.p(c.cut(c.rect(0, 0, lw, lh), 0.4, 8), tone(C.wood3));
  let planks = '';
  for (let x = lw / 4; x < lw; x += lw / 4) planks += c.ribbon([[x, 4], [x + c.rr(-1, 1), lh - 4]], 1.4);
  lf.x(planks, shade(tone(C.wood3), -0.25), 'opacity=".7"');
  lf.p(c.cut(c.rect(4, lh * 0.18, lw - 8, 10), 0.3, 4) + c.cut(c.rect(4, lh * 0.74, lw - 8, 10), 0.3, 4), tone(C.wood2));
  lf.p(c.cut(c.circ(lw - 14, lh * 0.5, 4, 8), 0.2, 3), C.ochre);
  const leaf = dL.add(`<g>${lf.out()}</g>`);
  const bar = dL.add(`<g>${sheet().p(c.cut(c.rect(-lw / 2 - 30, -8, lw + 60, 16), 0.3, 5), tone(C.wood2)).x(c.ribbon([[-lw / 2 - 24, -2], [lw / 2 + 24, -3]], 1.2), shade(tone(C.wood2), -0.3), 'opacity=".6"').out()}</g>`);
  const door = {
    light, leaf, bar, d0, d1, top, cx: (d0 + d1) / 2, layer: dL,
    set(open) { pose(leaf, { x: d0, y: top, sx: Math.max(0.12, 1 - open * 0.88) }); },
    /** k 0 → the bar leans on the wall to the right, 1 → it lies across the door in its brackets */
    bolt(k) { pose(bar, { x: lerp(d1 + 120, (d0 + d1) / 2, k), y: lerp(560, 605, k), r: lerp(-70, 0, Math.min(1, k * 1.3)) }); },
  };
  door.set(0); door.bolt(1);
  return { R, door, FLOOR, beamL };
}
/** standing places in the room (people layer): back row and front row, left and right of the middle */
export const SPOTS = {
  back: [[470, 700], [570, 702], [1030, 702], [1130, 700]],
  front: [[420, 748], [530, 752], [640, 756], [960, 756], [1070, 752], [1180, 748]],
};
/** the ten (without Thomas) at their spots: returns [{k, o, x, y, s, flip, seed}] in draw order (back first) */
export function tenAt(c) {
  const ks = ['bartholomew', 'jamesA', 'thaddaeus', 'simonZ', 'matthew', 'andrew', 'peter', 'john', 'james', 'philip'];
  const spots = [...SPOTS.back, SPOTS.front[0], SPOTS.front[1], SPOTS.front[2], SPOTS.front[3], SPOTS.front[4], SPOTS.front[5]];
  return ks.map((k, i) => {
    const [x, y] = spots[i];
    return { k, x, y, s: y < 720 ? 0.86 : 0.96, flip: x > 800, seed: c.rr(0, 9), i };
  });
}

/* ================================================================== breath, keys, cords */
/** the breath of the Spirit: soft ribbons of light flowing out to the right (origin: the mouth) */
export function breath(c, len = 380) {
  let d = '', d2 = '';
  for (let i = 0; i < 6; i++) {
    const spread = (i - 2.5) * 34;
    const pts = c.cbez([0, 0], [len * 0.3, -20 + spread * 0.2], [len * 0.6, spread * 0.9 - 30], [len, spread * 1.3 + c.rr(-10, 10)], 18);
    const rib = c.ribbon(pts, (u) => 1 + Math.sin(u * PI) * (6 + (i % 3) * 2), 2);
    if (i % 2) d += rib; else d2 += rib;
  }
  let sp = '';
  for (let i = 0; i < 12; i++) { const x = c.rr(len * 0.2, len), y = c.rr(-90, 90) * (x / len); sp += c.poly(c.star(x, y, c.rr(4, 7), 1.6, 4, 0)); }
  return `<path d="${d}" fill="${C.halo}" opacity=".55"/><path d="${d2}" fill="#fffaf0" opacity=".5"/><path d="${sp}" fill="${C.star}"/>`;
}
/** a key of light (origin: centre of the bow; the shaft points right) */
export function lightKey(c, len = 70) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 15, 18), 0.3, 3) + c.hole(c.circ(0, 0, 7, 12), 0.2, 2) + c.cut(c.rect(12, -4, len, 8), 0.2, 4) + c.cut(c.rect(len - 4, 2, 8, 16), 0.2, 3) + c.cut(c.rect(len - 20, 2, 7, 12), 0.2, 3), C.sun);
  s.x(c.ribbon([[16, -1], [len + 6, -1]], 1.2), '#fff4d2', 'opacity=".7"');
  return `<circle r="60" fill="url(#halo-glow)"/>${s.out()}`;
}
/** dark cords bound round a heart (origin: heart centre) */
export function cords(c, r = 26) {
  const col = mix(C.storm2, C.plumRobe, 0.3);
  const d = c.ribbon([[-r * 1.3, -r * 0.6], [r * 1.3, r * 0.4]], 4.4) + c.ribbon([[-r * 1.3, r * 0.5], [r * 1.3, -r * 0.5]], 4.4) + c.ribbon([[-r * 1.2, -r * 0.05], [r * 1.25, r * 0.1]], 4);
  return `<path d="${d}" fill="${col}"/><path d="${c.cut(c.blob(r * 0.1, -r * 0.05, 7, 6, 8, 0.2), 0.3, 2)}" fill="${shade(col, -0.2)}"/>`;
}
/** a round plate for the forgiven / retained heart (origin centre) */
export function heartPlate(c, r = 64, bright = true) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, r, 34), 0.5, 5), bright ? mix(C.cream, C.halo, 0.3) : mix(C.stone, C.lavender, 0.3));
  return s.out();
}

/* ================================================================== eight days */
/** a string of n day discs (a sun that sets and rises) — returns markup with .day[data-i] groups (origin: first disc) */
export function daysString(c, n = 8, gap = 70, r = 20) {
  let out = `<path d="${c.qbez([-40, -6], [((n - 1) * gap) / 2, 40], [(n - 1) * gap + 40, -6], 20).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')}" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>`;
  for (let i = 0; i < n; i++) {
    const x = i * gap, y = 34 * Math.sin((i / (n - 1)) * PI) * 0.75 + 8;
    const off = sheet().p(c.cut(c.circ(0, 0, r + 4, 18), 0.3, 3), C.stone2).p(c.cut(c.circ(0, 0, r, 18), 0.3, 3), mix(C.indigo, C.lavender, 0.4)).x(c.poly(c.circ(-4, -3, r * 0.55, 12)), C.moon).out();
    const on = sheet().p(c.cut(c.star(0, 0, r * 1.45, r * 1.1, 12, 0), 0.3, 3), C.sunDeep).p(c.cut(c.circ(0, 0, r, 18), 0.3, 3), C.sun).out();
    out += `<g transform="translate(${x} ${y.toFixed(1)})"><path d="M0 -4V${-r - 2}" stroke="rgba(74,54,34,.5)" stroke-width="1" fill="none"/><g class="day" data-i="${i}"><g class="off">${off}</g><g class="lit" opacity="0"><circle r="${r * 2.2}" fill="url(#warm-glow)"/>${on}<text x="0" y="${r * 0.36}" text-anchor="middle" font-family="${FONT}" font-size="${r * 0.9}" font-style="italic" fill="${C.cream}">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] || i + 1}</text></g></g></g>`;
  }
  return out;
}

/* ================================================================== the seven signs and the book */
/** the seven signs of this Gospel, as the sign medallions of John 2–11 (origin centre) */
export function sevenSigns(c, r = 40) {
  const k = r / 40;
  const boy = `<g transform="translate(${-16 * k} ${12 * k}) scale(${0.18 * k})">${person(c, { robe: C.linen, skin: C.skin2, hair: C.hair3, hairStyle: 'curly', belt: C.sun })}</g>`;
  return [
    signBadge(c, 1, { r }),
    `${signBadge(c, 2, { r, icon: 'boy' })}${boy}`,
    `${signBadge(c, 3, { r, icon: 'mat' })}<g transform="translate(${-16 * k} ${-4 * k}) scale(${0.26 * k})">${matRoll(c, 110)}</g>`,
    signMedal(c, 4, loafIcon(c), r),
    signMedal(c, 5, waveIcon(c), r),
    `${signBadge(c, 6, { r, icon: 'eye' })}<g transform="translate(${-18 * k} ${-4 * k}) scale(${0.5 * k})">${eyeIcon(c, { r: 20 })}</g>`,
    `${signBadge(c, 7, { r, icon: 'cave' })}<g transform="translate(${-17 * k} ${8 * k}) scale(${0.3 * k})">${caveIcon(c, { open: true })}</g>`,
  ];
}
/** a faint, unnamed sign medallion (the many others "not written in this book"); origin centre */
export function faintSign(c, r = 22) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 4, 20), 0.3, 3), mix(C.haloRim, C.lavender, 0.4)).p(c.cut(c.circ(0, 0, r, 20), 0.3, 3), mix(C.cream, C.lavender, 0.25));
  return `${s.out()}<path d="${c.poly(c.star(0, 0, r * 0.5, r * 0.2, 4, 0))}" fill="${mix(C.haloRim, C.lavender, 0.3)}"/>`;
}
/**
 * The open book (origin: bottom of the spine), w wide. Parts: .pageL/.pageR, .linesL/.linesR (fade in),
 * .glow (the light of the pages).
 */
export function openBook(c, w = 340, h = 210) {
  const hw = w / 2;
  const cov = sheet().p(c.cut([[-hw - 12, 8], [-hw - 14, -h + 6], [-6, -h + 14], [6, -h + 14], [hw + 14, -h + 6], [hw + 12, 8], [8, 14], [-8, 14]], 0.5, 6), C.terracotta);
  const page = (dir) => {
    const s = sheet();
    const pts = dir < 0
      ? [[0, 0], ...c.qbez([0, 0], [-hw * 0.5, -18], [-hw, -4], 10).slice(1), [-hw, -h + 6], ...c.qbez([-hw, -h + 6], [-hw * 0.5, -h - 12], [0, -h + 8], 10).slice(1)]
      : [[0, 0], ...c.qbez([0, 0], [hw * 0.5, -18], [hw, -4], 10).slice(1), [hw, -h + 6], ...c.qbez([hw, -h + 6], [hw * 0.5, -h - 12], [0, -h + 8], 10).slice(1)];
    s.p(c.cut(pts, 0.4, 6), C.parchment);
    s.x(c.ribbon([[dir * 4, -4], [dir * 4, -h + 10]], 3), shade(C.parchment, -0.12), 'opacity=".8"');
    return s.out();
  };
  const lines = (dir) => {
    let d = '';
    for (let i = 0; i < 8; i++) {
      const y = -h + 34 + i * ((h - 56) / 7);
      const x0 = dir * 22, x1 = dir * (hw - 20 - (i === 7 ? hw * 0.35 : c.rr(0, 16)));
      d += c.ribbon([[x0, y - (dir < 0 ? 0 : 0)], [x1, y - 6 * Math.abs(x1) / hw]], 2.2);
    }
    return `<path d="${d}" fill="${C.inkSoft}" opacity=".55"/>`;
  };
  return `<g class="glow" opacity="0"><ellipse cx="0" cy="${-h * 0.55}" rx="${w * 0.8}" ry="${h * 0.9}" fill="url(#halo-glow)"/></g>${cov.out()}<g class="pageL">${page(-1)}<g class="linesL" opacity="0">${lines(-1)}</g></g><g class="pageR">${page(1)}<g class="linesR" opacity="0">${lines(1)}</g></g>`;
}

/* ================================================================== the night globe of those who have not seen */
/** a paper globe at night (origin centre) */
export function nightGlobe(c, r = 380) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 70), 0.6, 8), mix(C.lakeDeep, C.night, 0.45));
  const land = [[-0.35, -0.3, 0.36, 0.26], [0.36, 0.08, 0.3, 0.42], [-0.42, 0.46, 0.26, 0.16], [0.05, -0.64, 0.24, 0.12], [-0.72, 0.05, 0.14, 0.26], [0.72, -0.4, 0.14, 0.16]];
  s.p(land.map(([x, y, a, b]) => c.cut(c.blob(x * r, y * r, a * r, b * r, 12, 0.3), 1, 6)).join(''), mix(C.moss2, C.night, 0.45));
  s.x(c.ribbon(c.arc(0, 0, r, r * 0.3, 0, PI, 24), 1.6) + c.ribbon(c.arc(0, 0, r * 0.35, r, -PI / 2, PI / 2, 24), 1.6) + c.ribbon(c.arc(0, 0, r * 0.8, r, -PI / 2, PI / 2, 24), 1.4), C.cream, 'opacity=".18"');
  return `<circle r="${r * 1.25}" fill="url(#halo-glow)" opacity=".35"/>${s.out()}`;
}
/** n small lights scattered on a disc of radius r (only the upper part, y < ymax): one piece */
export function lightsOn(c, r, n, { ymax = 0.2, size = 4 } = {}) {
  let d = '', g = '';
  for (let i = 0; i < n; i++) {
    let x, y;
    let n2 = 0;
    do { x = c.rr(-r, r); y = c.rr(-r, r * ymax); } while (x * x + y * y > r * r * 0.9 && ++n2 < 60);
    const sz = size * c.rr(0.7, 1.3);
    d += c.poly(c.star(x, y, sz * 1.6, sz * 0.5, 4, 0));
    g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(sz * 4).toFixed(1)}" fill="url(#warm-glow)" opacity=".7"/>`;
  }
  return `${g}<path d="${d}" fill="${C.star}"/>`;
}
/** a little lit house (origin: its foot) — the room where Thomas knelt, far away */
export function litHouse(c, sc = 1) {
  return house(c, 0, 0, 60 * sc, 44 * sc, { wall: mix(C.plaster, C.indigo, 0.35), shadow: mix(C.plaster2, C.indigo, 0.45), door: C.lampGlow, win: C.lampFlame, roofEdge: mix(C.roof, C.indigo, 0.3), stairs: true, lit: true });
}
/** a small open book held in the hand (for the reader; origin at the hand) */
export function smallBook(c) {
  const s = sheet();
  s.p(c.cut([[-24, 0], [-22, -22], [0, -18], [22, -22], [24, 0], [0, 4]], 0.3, 3), C.terracotta);
  s.p(c.cut([[-21, -2], [-20, -20], [-1, -16], [-1, 1]], 0.2, 3) + c.cut([[1, 1], [1, -16], [20, -20], [21, -2]], 0.2, 3), C.parchment);
  s.x(c.ribbon([[-17, -12], [-5, -10]], 1) + c.ribbon([[-17, -7], [-5, -5]], 1) + c.ribbon([[5, -10], [17, -12]], 1) + c.ribbon([[5, -5], [17, -7]], 1), C.inkSoft, 'opacity=".5"');
  return `<circle cy="-10" r="44" fill="url(#halo-glow)" opacity=".9"/>${s.out()}`;
}

/* ================================================================== misc */
/** a small heart that pops (origin centre) */
export const joyHeart = (c, r = 13) => heart(c, r, C.jesusMantle);
/** a round vignette frame (origin centre): rim + clip; inner drawn clipped */
export function vignette(S, inner, { r = 150, fill = C.parchment, rim = C.wood3, k } = {}) {
  const c = S.c;
  const id = S.id('vig' + (k || Math.round(c.rr(0, 1e6))));
  S.defs(`<clipPath id="${id}"><circle r="${r}"/></clipPath>`);
  const fr = sheet().p(c.cut(c.circ(0, 0, r + 12, 48), 0.5, 6) + c.hole(c.circ(0, 0, r, 48), 0.3, 6), rim).out();
  return `<g clip-path="url(#${id})"><circle r="${r}" fill="${fill}"/>${inner}</g>${fr}`;
}
/** a row of small grass tufts (re-export shortcut) */
export const tufts = (c, x0, x1, y, n = 20, h = 16, color = C.moss) => grass(c, { x0, x1, y, n, h, color });
/** idle flicker of a lamp flame group */
export function flicker(el, x, y, T, k = 1, i = 0) { pose(el, { x, y, sx: k * (1 + (T ? Math.sin(T * 7 + i) * 0.08 : 0)), sy: k * (1 + (T ? Math.sin(T * 5.3 + i) * 0.12 : 0)) }); }

/* ================================================================== the garden of the Resurrection (scenes 6–7) */
export const GJ = { x: 780, y: 726 };   // where the Risen One stands
export const GM = { x: 1010, y: 716 };  // Mary, by the tomb
/**
 * Mark 16's garden with the gardener's things in it: beds of young plants, a watering jar, a hoe; closed buds all
 * over the ground and the foreground that can burst into bloom, blossom on the olive. Returns { G, blooms, bloom(k, T) }.
 */
export function easterGarden(S) {
  const c = S.c;
  const G = gardenSet(S);
  G.ground.add(`<g transform="translate(620 748)">${plantBed(c, 200)}</g><g transform="translate(420 770)">${plantBed(c, 160)}</g><g transform="translate(690 738)">${wateringJar(c)}</g><g transform="translate(1085 560) rotate(8)">${hoe(c, 150)}</g>`);
  const list = [];
  const spots = [[480, 720], [560, 712], [650, 706], [720, 730], [860, 716], [930, 706], [540, 752], [760, 760], [880, 752], [980, 748], [1060, 736], [440, 740], [610, 776], [820, 782], [950, 780], [1120, 760]];
  spots.forEach(([x, y], i) => {
    const w = 60 + (i % 3) * 14;
    list.push({ x, y, s: 1, i, b: G.ground.add(`<g transform="translate(${x} ${y})">${buds(c, w, 5)}</g>`), f: G.ground.add(`<g>${blooms(c, w, 5)}</g>`), d: Math.hypot(x - GJ.x, (y - GJ.y) * 2) });
  });
  const big = [[180, 975], [330, 980], [470, 985], [1130, 985], [1280, 978], [1420, 975]];
  big.forEach(([x, y], i) => {
    list.push({ x, y, s: 2, i: i + 20, b: G.fg.add(`<g transform="translate(${x} ${y}) scale(2)">${buds(c, 80, 6)}</g>`), f: G.fg.add(`<g>${blooms(c, 80, 6)}</g>`), d: Math.hypot(x - GJ.x, (y - GJ.y) * 1.2) });
  });
  const trees = [[520, 560, 90], [-120, 560, 100], [1900, 560, 90]].map(([x, y, r]) => ({ x, y, el: G.ground.add(`<g>${blossom(c, r, 30)}</g>`), d: Math.abs(x - GJ.x) }));
  return {
    G, list, trees,
    /** k: 0 → buds, 1 → everything open; the wave spreads out from where He stands */
    bloom(k) {
      list.forEach((m) => {
        const u = Math.max(0, Math.min(1, k * 1.8 - m.d / 900));
        const e = u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(2, -9 * u) * Math.cos(u * 8);
        fade(m.b, 1 - Math.min(1, u * 2));
        pose(m.f, { x: m.x, y: m.y, s: e * m.s, o: u > 0.01 ? 1 : 0 });
      });
      trees.forEach((tr2) => {
        const u = Math.max(0, Math.min(1, k * 1.8 - tr2.d / 900));
        pose(tr2.el, { x: tr2.x, y: tr2.y, s: u, o: u > 0.01 ? 1 : 0 });
      });
    },
  };
}

/* ================================================================== the room with the disciples standing (scenes 9–12) */
/** standing places: back row, front row, and Thomas' place near the middle */
export function crewAt(c, withThomas = false) {
  const back = [['bartholomew', 440], ['jamesA', 530], ['thaddaeus', 620], ['simonZ', 980], ['matthew', 1070], ['philip', 1160]];
  const front = [['andrew', 420], ['peter', 540], ['john', 1060], ['james', 1180]];
  const out = back.map(([k, x], i) => ({ k, x, y: 700 + (i % 2) * 4, s: 0.86, flip: x > 800, seed: c.rr(0, 9), i, row: 0 }));
  front.forEach(([k, x], i) => out.push({ k, x, y: 752 - (i % 2) * 4, s: 0.97, flip: x > 800, seed: c.rr(0, 9), i: i + 6, row: 1 }));
  if (withThomas) out.push({ k: 'thomas', x: 648, y: 768, s: 1.0, flip: false, seed: c.rr(0, 9), i: 10, row: 2 });
  return out;
}
/**
 * The upper room at evening with the disciples standing round an empty middle, and Jesus (hidden until He comes).
 * Returns { R, door, FLOOR, crew: [{k, x, y, s, flip, p, el, sad}], by, jesus, gl, PL }.
 */
export const MID = { x: 800, y: 742, s: 1.1 };
export function eveningRoom(S, { withThomas = false, night = true } = {}) {
  const c = S.c;
  const RR = room20(S, { night });
  const glL = S.layer({ par: 0.5, sh: 0, flat: true });
  const gl = glL.add(`<g opacity="0"><circle r="260" fill="url(#halo-glow)"/>${glowRays(c)}</g>`);
  const PL = S.layer({ par: 0.52, sh: 5 });
  const list = crewAt(c, withThomas);
  const mk = (m) => {
    const o = m.k === 'thomas' ? THOMAS : TW14[m.k];
    const el = PL.add(withFace(person(c, { ...o }), faceBits(c)));
    return { ...m, el, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') };
  };
  const crew = list.filter((m) => m.row === 0).map(mk);
  const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
  list.filter((m) => m.row > 0).forEach((m) => crew.push(mk(m)));
  const by = Object.fromEntries(crew.map((m) => [m.k, m]));
  return { ...RR, crew, by, jesus, gl, PL };
}
/** thin rays for the coming of the Risen One (origin centre) */
function glowRays(c) {
  let d = '';
  for (let i = 0; i < 20; i++) { const a = (i / 20) * PI * 2, w = 0.05; d += c.poly([[Math.cos(a - w * 0.3) * 40, Math.sin(a - w * 0.3) * 40], [Math.cos(a - w) * 330, Math.sin(a - w) * 330], [Math.cos(a + w) * 330, Math.sin(a + w) * 330], [Math.cos(a + w * 0.3) * 40, Math.sin(a + w * 0.3) * 40]]); }
  return `<path d="${d}" fill="#fff3cf" opacity=".32"/>`;
}
export { eyeIcon };
