// Luke 22 — the Passion begins. Nearly every set and every face is the one Mark 14, Matthew 26 and John 13/18 cut
// (so the Gospels look alike): the chief priests' chamber, the city street and the house of the upper room, the long
// table of the Last Supper and its seating, the olive garden at night with the torchlit band as shadow-play, the high
// priest's house with its hall above the courtyard fire, the rooster. Luke's own pieces are here: the ring of the
// Twelve with one bead gone dark (Satan entering Judas — never a figure, only a curl of shadow), the kings of the
// nations with their "benefactor" banner, the one who serves with a towel, the twelve thrones, the sieve of wheat, the
// travel kit of the first mission, a stone thrown to measure the distance, the drops that fall like blood (dark drops
// of light, no gore), the ear that is touched and healed, and the window of the hall across the courtyard where the
// Lord turns and looks at Peter.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt } from '../kit.js';
import { fade, attr } from '../../core/anim.js';
import { band, stars } from '../../assets/nature.js';
import { walledCity as wcity } from '../mark1/lib.js';
import { tr } from '../../core/i18n.js';

export {
  chamber, table, priest, priestOpts, highPriest, HP, scribe, scribeOpts, shadowPerson, hangingLamp, lampGlow, pawn, discPlate, matzahRound, matzah,
  wordTag, lamb, vis, TW, upperRoom, supperTable, seatAll, SEATS, chalice, cupOfLight, torch, sword, club, cord, seal, rooster, tally, oilLamp,
  waterJar, drop, templeMini, vignette, zzz, purse, garden, palace, firePit, fireFlames, guardOpts, man, NIGHT, NIGHT2, DUSK, DAWN, hourglassParts,
  loafHalves, glory, heavenPanel, speech, say, GLYPH, question, kf, moving, hand, headAt, withFace, faceBits, lowTable, bowl, loaf, cup, grapes, coin,
  candle, scrollOpen, crookedScroll, snare, blindfold, voiceRings, spark, heart, sparkle, lamb as lambCut, LOOK as LOOK14, addToHead, addToBody,
  bubble, nameTag, strip, silhouette, soulLight, bigQuestion, tag, thought,
} from '../mark14/lib.js';
export { twoSkies, streetSet, HOUSE, palaceDawn, palaceIdle, kissIcon, EVE, NIGHTFALL, DEEP, PREDAWN, MORNING, MOB, ELEVEN, legions } from '../matthew26/lib.js';
export {
  nightSet, gardenTrees, makeBand, bandPose, eleven, lamp, sheathed, paperEar, ropeHands, torchFlame, MALCHUS, MAID, KINSMAN, nt, INK as BAND_INK,
  courtyard, CY, courtIdle, fireCircle, torchLine, noTag, leadRope, paperCrown,
} from '../john18/lib.js';
export { tableSet, towelWrap, towelHeld, ewer, waterStream, JESUS_TUNIC, shadowCurl, morsel, lightDrop, lightHeart, beloved, foldedCloth, basinParts, mini, DISH } from '../john13/lib.js';
export { angel, lightCrown } from '../mark8/lib.js';
export { bag, sandals, tunic, crossX, tick } from '../mark6/lib.js';
export { bars, walledCity } from '../mark1/lib.js';
export { turban, breastplate } from '../mark2/lib.js';
export { radiance, rayBurst, darkSheet, hungWord, goldWord } from '../john1/lib.js';
export { templeCourt, courtFront } from '../mark11/lib.js';
export { folk, group } from '../john6/lib.js';
export { tr, C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing, blinkAt, fade, attr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
export const STRING = 'rgba(74,54,34,.55)';

/* ================================================================== skies */
export const DUSKGOLD = ['#6d6a9e', '#c7959c', '#eab596'];
export const LATEDUSK = ['#343a6e', '#6d5f8a', '#b88592'];
export const NIGHTROOM = ['#2a2f60', '#4d4a7c', '#7d6a8a'];
export const DEEPNIGHT = ['#15183a', '#23284f', '#353866'];
export const AGONY = ['#1a1a3c', '#2c2a55', '#4a3f66'];
export const DAYBREAK = ['#8f9cc0', '#e6b9a8', '#f6d7b0'];

/* ================================================================== the cast */
/** a captain of the Temple guard (Luke's strategoi): dark tunic, leather mantle, head-cloth, a staff of office */
export const CAPTAIN = { robe: mix(C.storm, C.stone2, 0.35), mantle: shade(C.leather, 0.12), hair: C.hair3, hairStyle: 'wrap', veil: mix(C.clay, C.stone, 0.45), veil2: mix(C.clay, C.stone2, 0.3), beard: 'full', skin: C.skin3, belt: C.sun };
export function captain(c, extra = {}) {
  const staffM = `<g transform="rotate(-8)">${sheet().p(c.cut([[-3, 30], [3, 30], [3, -150], [-3, -150]], 0.3, 8), C.wood2).p(c.cut(c.circ(0, -154, 6, 10), 0.2, 3), C.sun).out()}</g>`;
  return person(c, { ...CAPTAIN, holdB: staffM, ...extra });
}
/** the angel who strengthens Him in the garden: linen, pale-gold mantle, fair hair */
export const ANGEL = { robe: C.linen, mantle: C.halo, hair: C.wheat2, hairStyle: 'long', beard: 'none', skin: C.skin };

/* ================================================================== Luke's own pieces */

/** the ring of the Twelve: twelve small beads on a gold ring, the last one (Judas) with a dark cover .jd (fade it in);
 *  origin centre */
export function twelveRing(c, r = 60) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 0, r, r, 0, PI * 2, 40), 3.4), C.haloRim);
  let beads = '';
  const pos = [];
  for (let i = 0; i < 12; i++) {
    const a = -PI / 2 + (i / 12) * PI * 2, x = Math.cos(a) * r, y = Math.sin(a) * r;
    pos.push([x, y]);
    beads += c.cut(c.circ(x, y, 11, 14), 0.3, 3);
  }
  s.p(beads, C.cream);
  let faces = '';
  pos.forEach(([x, y], i) => { if (i < 11) faces += c.cut(c.circ(x, y, 6, 10), 0.2, 2); });
  s.x(faces, C.halo);
  const [jx, jy] = pos[11];
  const dark = `<g class="jd" opacity="0"><path d="${c.cut(c.circ(jx, jy, 12.5, 14), 0.3, 3)}" fill="#231c33"/><path d="${c.ribbon(c.cbez([jx, jy + 4], [jx - 8, jy - 2], [jx + 8, jy - 8], [jx, jy - 14], 8), (u) => 3 - u * 2)}" fill="#4a3d5e"/></g>`;
  return { markup: `<circle r="${r * 1.6}" fill="url(#halo-glow)" opacity=".5"/>${s.out()}${dark}`, judasAt: [jx, jy] };
}

/** a curl of shadow that slips along a path — several thin dark wisps (origin at its head, trailing to the left) */
export function shadowWisp(c, len = 120, col = '#241c33') {
  let d = '';
  for (let i = 0; i < 3; i++) {
    const pts = [];
    for (let j = 0; j <= 16; j++) { const u = j / 16; pts.push([-u * len, Math.sin(u * 7 + i * 1.7) * 10 * u + (i - 1) * 5 * u]); }
    d += c.ribbon(pts, (u) => (1 - u) * (7 - i * 1.6) + 0.8);
  }
  return `<path d="${d}" fill="${col}" opacity=".82"/>`;
}

/** a king enthroned under a canopy, raised on steps, with his sceptre (origin: foot of the steps, centre).
 *  Parts: .king (a separate cut so it can lift its sceptre) — returns { back, king } markup */
export function kingThrone(c) {
  const b = sheet();
  // steps
  b.p(c.cut(c.rect(-120, -24, 240, 24), 0.4, 8) + c.cut(c.rect(-96, -46, 192, 24), 0.4, 8) + c.cut(c.rect(-70, -66, 140, 22), 0.4, 8), mix(C.stone, C.plumRobe, 0.2));
  // canopy on two posts
  b.p(c.cut(c.rect(-86, -300, 10, 236), 0.3, 8) + c.cut(c.rect(76, -300, 10, 236), 0.3, 8), C.sun);
  const can = [[-104, -300], [104, -300], [110, -280]];
  for (let x = 104; x > -104; x -= 26) can.push(...c.arc(x - 13, -280, 13, 10, 0, PI, 4));
  can.push([-110, -280]);
  b.p(c.cut(can, 0.5, 6), shade(C.plumRobe, -0.1));
  b.p(c.ribbon([[-106, -300], [106, -300]], 7), C.sun);
  // the throne
  b.p(c.cut([[-46, -66], [-46, -214], [-36, -226], [36, -226], [46, -214], [46, -66]], 0.4, 6), C.sun);
  b.p(c.cut(c.rect(-54, -122, 108, 16), 0.3, 6), shade(C.sun, -0.18));
  return b.out();
}
/** a king (the puppet options): purple mantle, gold crown added to the head */
export const KING = { robe: C.linen, mantle: mix(C.plumRobe, C.terracotta, 0.25), mantleArm: true, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun };
export function crownHead(c) {
  const pts = [[-18, -14], [-18, -26], [-10, -20], [-3, -34], [4, -20], [12, -28], [18, -18], [18, -12]];
  return sheet().p(c.cut(pts, 0.2, 3), C.sun).p(c.cut(c.circ(-3, -30, 2.6, 6), 0.1, 2), C.terracotta).out();
}
/** a sceptre held in the hand (hold markup) */
export function sceptre(c) {
  return `<g transform="rotate(170)">${sheet().p(c.cut([[-2.5, 0], [2.5, 0], [2.5, 76], [-2.5, 76]], 0.2, 6), C.sun).p(c.cut(c.circ(0, 80, 7, 10), 0.2, 3), C.sun).out()}</g>`;
}

/** a small gold throne seen side-on (origin: foot, centre), ~ 60 tall at sc 1 */
export function smallThrone(c, sc = 1, col = C.sun) {
  const k = sc;
  const s = sheet();
  s.p(c.cut([[-16 * k, 0], [-16 * k, -58 * k], [-10 * k, -64 * k], [-4 * k, -58 * k], [-4 * k, -30 * k], [16 * k, -30 * k], [16 * k, 0], [12 * k, 0], [12 * k, -22 * k], [-12 * k, -22 * k], [-12 * k, 0]], 0.3, 4), col);
  s.p(c.cut(c.rect(-6 * k, -34 * k, 24 * k, 6 * k), 0.2, 3), mix(C.plumRobe, C.terracotta, 0.3));
  return s.out();
}

/** a round wooden sieve, seen a little from above (origin centre): { frame, mesh } — the grain is separate */
export function sieve(c, r = 70) {
  const f = sheet();
  f.p(c.cut(c.ell(0, 0, r, r * 0.34, 36), 0.5, 5) + c.hole(c.ell(0, -2, r - 9, r * 0.34 - 6, 36), 0.4, 5), C.wood3);
  f.p(c.cut([[-r, 0], [r, 0], [r - 2, 22], [-r + 2, 22]], 0.5, 6), C.wood2);
  f.x(c.ribbon([[-r + 4, 12], [r - 4, 12]], 1.4), shade(C.wood2, -0.3), 'opacity=".6"');
  let mesh = '';
  for (let x = -r + 16; x < r - 10; x += 11) mesh += c.ribbon([[x, -r * 0.3 + 6], [x + 4, r * 0.3 - 4]], 0.8);
  for (let y = -r * 0.26; y < r * 0.3; y += 6) { const w = Math.sqrt(Math.max(0, 1 - (y / (r * 0.34)) ** 2)) * (r - 12); mesh += c.ribbon([[-w, y], [w, y]], 0.7); }
  return { frame: f.out(), mesh: `<path d="${c.poly(c.ell(0, -2, r - 9, r * 0.34 - 6, 36))}" fill="${mix(C.wood3, C.soil, 0.35)}"/><path d="${mesh}" fill="${C.rope}" opacity=".7"/>` };
}
/** a grain of wheat (origin centre) */
export function grain(c, r = 4.2, col = C.wheat) {
  return `<path d="${c.cut(c.ell(0, 0, r, r * 0.6, 10), 0.15, 2)}" fill="${col}"/><path d="${c.ribbon([[-r * 0.6, 0], [r * 0.6, 0]], 0.7)}" fill="${shade(col, -0.25)}"/>`;
}
/** a bit of chaff (origin centre) */
export function chaff(c, r = 6) {
  return `<path d="${c.cut([[-r, 0], [-r * 0.2, -r * 0.4], [r, -r * 0.1], [r * 0.2, r * 0.3]], 0.2, 2)}" fill="${mix(C.wheat, C.stone, 0.4)}"/>`;
}

/** a small flame cupped in a hand (faith that does not fail): origin at the palm */
export function cuppedFlame(c) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-24, -10], [-14, -16], [14, -16], [24, -10], [26, 0], [16, 8], [-16, 8]], 0.3, 4), C.skin);
  s.p(c.cut([[20, -8], [30, -30], [36, -28], [28, -4]], 0.3, 3), C.skin);
  s.x(c.ribbon([[-14, -4], [14, -4]], 1), shade(C.skin, -0.2), 'opacity=".6"');
  const fl = `<g class="flame" transform="translate(0 -16)"><path d="M0 0C-10 -8 -9 -24 0 -44C9 -24 10 -8 0 0Z" fill="${C.lampFlame}"/><path d="M0 -3C-4 -8 -4 -16 0 -26C4 -16 4 -8 0 -3Z" fill="#fff4d2"/></g>`;
  return `<circle cy="-30" r="60" fill="url(#warm-glow)"/>${fl}${s.out()}`;
}

/** a small stone (origin centre) */
export function stone(c, r = 9) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.72, 9, 0.18), 0.4, 3), C.rock2).x(c.poly(c.ell(-r * 0.3, -r * 0.3, r * 0.3, r * 0.16, 8)), '#fff', 'opacity=".35"').out();
}
/** a drop "like blood": a dark rose drop edged with gold light — never gore (origin centre) */
export function agonyDrop(c, r = 5) {
  const pts = [[0, -r * 2], [r * 0.9, -r * 0.2], [r * 0.7, r * 0.6], [0, r], [-r * 0.7, r * 0.6], [-r * 0.9, -r * 0.2]];
  return `<path d="${c.cut(pts, 0.1, 2)}" fill="${mix(C.terracotta, C.plumRobe, 0.45)}"/><path d="${c.poly([[-r * 0.3, -r * 0.6], [-r * 0.1, -r * 1.2], [0, -r * 0.3]])}" fill="${C.halo}" opacity=".85"/>`;
}

/** a hanging banner with a word on it (origin at the rod's centre) */
export function banner(c, text, { w = 180, h = 64, col = mix(C.plumRobe, C.terracotta, 0.25), ink = C.halo, size = 22 } = {}) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0], [w / 2, h], [w / 4, h - 10], [0, h], [-w / 4, h - 10], [-w / 2, h]];
  s.p(c.cut(pts, 0.5, 6), col);
  s.p(c.ribbon([[-w / 2 - 10, 0], [w / 2 + 10, 0]], 6), C.sun);
  s.x(c.ribbon([[-w / 2 + 8, 8], [w / 2 - 8, 8]], 1.2) + c.ribbon([[-w / 2 + 8, h - 18], [w / 2 - 8, h - 18]], 1.2), C.sun, 'opacity=".7"');
  return `${s.out()}<text x="0" y="${(h * 0.5 + size * 0.1).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}

/** the vine along the wall, clipped by a growing circle (for "the fruit of the vine") — returns markup of the vine only */
export function vineSpray(c, from, to) {
  const pts = c.cbez(from, [from[0] - 20, from[1] - 260], [to[0] - 160, to[1] + 20], to, 30);
  const s = sheet();
  s.p(c.ribbon(pts, 4), C.wood2);
  let lv = '', lv2 = '', gr = '';
  pts.forEach(([x, y], i) => {
    if (i % 2) return;
    const leaf = c.cut(c.star(x + c.rr(-8, 8), y + c.rr(-6, 6), c.rr(11, 15), c.rr(6, 9), 5, c.rr(0, 6)), 0.4, 3);
    if (i % 4) lv += leaf; else lv2 += leaf;
    if (i % 8 === 4) for (let g = 0; g < 7; g++) gr += c.cut(c.circ(x + (g % 3 - 1) * 5.5, y + 14 + Math.floor(g / 3) * 6, 3.8, 8), 0.2, 2);
  });
  s.p(lv2, C.moss).p(lv, C.leaf).p(gr, C.plumRobe);
  return s.out();
}

/** the Kingdom's table: a disc plate with a low golden table, a cup of light and a crown of light (origin centre) */
export function kingdomPlate(c, lightCrownFn, discPlateFn, lowTableFn, chaliceFn, r = 64) {
  return discPlateFn(c, `<g transform="translate(0 30) scale(.5)">${lowTableFn(c, 150, 40)}</g><g transform="translate(0 6)">${chaliceFn(c, 40, { dark: false })}</g><g transform="translate(0 -30) scale(.36)">${lightCrownFn(c, 46)}</g>`, { r, rim: C.sun, fill: mix(C.cream, C.halo, 0.4) });
}

/** a torn edge "window" into a memory: a sepia oval, clipped (origin centre); inner drawn in -w/2..w/2 */
export function memoryOval(S, inner, { w = 300, h = 200, fill = mix(C.parchment, C.duskViolet, 0.35), rim = C.wood3 } = {}) {
  const c = S.c;
  const id = S.id('mem' + Math.round(c.rr(0, 1e6)));
  const rim2 = c.ell(0, 0, w / 2 - 6, h / 2 - 5, 44);
  return `${sheet().p(c.cut(c.ell(0, 0, w / 2, h / 2, 40), 0.6, 6), mix(C.parchment, C.dune, 0.5)).out()}<defs><clipPath id="${id}"><ellipse cx="0" cy="0" rx="${w / 2 - 12}" ry="${h / 2 - 10}"/></clipPath></defs><g clip-path="url(#${id})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${fill}"/>${inner}</g><path d="${c.ribbon(rim2.concat([rim2[0]]), 5)}" fill="${rim}"/>`;
}

/** a little figure of Jesus with His halo for plates and bubbles (origin at the feet, ~ 44 tall) */
export function miniJesus(c, sc = 1) {
  const k = sc;
  return `<circle cy="${-36 * k}" r="${16 * k}" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, -36 * k, 9 * k, 12), 0.2, 3)}" fill="${C.halo}"/><path d="${c.cut([[-9 * k, 0], [-7 * k, -26 * k], [7 * k, -26 * k], [9 * k, 0]], 0.2, 3)}" fill="${C.linen}"/><path d="${c.cut([[-7 * k, -26 * k], [4 * k, -26 * k], [-3 * k, 0], [-9 * k, 0]], 0.2, 3)}" fill="${C.jesusMantle}"/><path d="${c.cut(c.circ(0, -35 * k, 5.5 * k, 10), 0.2, 3)}" fill="${C.skin}"/>`;
}
/** a little plain figure (origin at the feet, ~ 40 tall) */
export function miniMan(c, col = C.dustyBlue, skin = C.skin2, sc = 1) {
  const k = sc;
  return `<path d="${c.cut([[-8 * k, 0], [-6 * k, -24 * k], [6 * k, -24 * k], [8 * k, 0]], 0.2, 3)}" fill="${col}"/><path d="${c.cut(c.circ(0, -31 * k, 6 * k, 10), 0.2, 3)}" fill="${skin}"/>`;
}

/* ================================================================== the chief priests' chamber, door on the left */
/**
 * Mark 14's chamber of the chief priests at dusk (the same wall, window onto the city, shelf of scrolls, lamp-lit floor)
 * cut the other way round: the door on the LEFT (so Judas comes in where a phone can see him), the window right of
 * centre. Returns { sky, stars, crowd (layer inside the window), shadows (on the wall), dim, clipId, FLOOR, CEIL, DOOR, WIN }.
 */
export function chamberL(S, { skyCols = LATEDUSK, ctop = -1200 } = {}) {
  const c = S.c;
  const FLOOR = 700, CEIL = 230;
  const W0 = 700, W1 = 1060, WT = 300, WB = 560;
  const DOOR = { x0: 420, x1: 530, top: 470 };
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.03, sh: 1, flat: true });
  starL.add(stars(c, { x0: 560, x1: 1200, y0: 150, y1: 420, n: 26 }));
  const city = S.layer({ par: 0.12, sh: 2 });
  const h1 = band(c, { y: 500, amps: [10, 5, 2], lens: [700, 260, 90], color: mix(C.hillFar, C.duskViolet, 0.45) });
  city.add(h1.markup);
  city.add(wcity(c, 880, 540, 1.0, { wall: mix(C.stone, C.duskViolet, 0.3), wall2: mix(C.stone2, C.duskViolet, 0.35), temple: mix(C.cream, C.dusk, 0.15) }));
  let lit = '';
  for (let i = 0; i < 16; i++) lit += c.poly(c.rect(c.rr(730, 1030), c.rr(470, 520), 3, 4));
  city.add(`<path d="${lit}" fill="${C.lampFlame}"/>`);
  // the doorway's night (behind the wall)
  const doorNight = S.layer({ par: 0.14, sh: 0, flat: true });
  doorNight.add(`<rect x="${DOOR.x0 - 60}" y="${DOOR.top - 80}" width="${DOOR.x1 - DOOR.x0 + 120}" height="${FLOOR - DOOR.top + 140}" fill="${mix(C.night, C.plumRobe, 0.25)}"/>`);
  const crowdL = S.layer({ par: 0.16, sh: 1 });
  // the wall
  const wallL = S.layer({ par: 0.3, sh: 3 });
  const wcol = mix(C.plaster, C.ochre, 0.2);
  const win = [[W0, WB], [W0, WT + 90], ...c.arc((W0 + W1) / 2, WT + 90, (W1 - W0) / 2, 90, PI, 2 * PI, 16), [W1, WB]];
  const door = [[DOOR.x0, FLOOR + 6], [DOOR.x0, DOOR.top], ...c.arc((DOOR.x0 + DOOR.x1) / 2, DOOR.top, (DOOR.x1 - DOOR.x0) / 2, 44, PI, 2 * PI, 10), [DOOR.x1, FLOOR + 6]];
  const w = sheet();
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), wcol);
  let blot = '';
  for (let i = 0; i < 14; i++) {
    const bx = c.rr(-200, 1800), by = c.rr(CEIL + 40, FLOOR - 60), rx = c.rr(24, 60), ry = c.rr(10, 22);
    if ((bx + rx > W0 - 20 && bx - rx < W1 + 20 && by + ry > WT - 20) || (bx + rx > DOOR.x0 - 20 && bx - rx < DOOR.x1 + 20 && by + ry > DOOR.top - 60)) continue;
    blot += c.cut(c.blob(bx, by, rx, ry, 10, 0.2), 0.8, 6);
  }
  w.x(blot, shade(wcol, -0.06), 'opacity=".55"');
  // ctop: the top of the ceiling's wood (a phone passes CEIL - 150, so the ceiling is a beam, not the top third of the screen)
  w.p(c.cut([[-900, ctop], [2500, ctop], [2500, CEIL], [-900, CEIL]], 0.8, 30), shade(C.wood2, -0.25));
  let beams = '';
  for (let x = -300; x < 1900; x += 110) beams += c.cut(c.rect(x, CEIL - 6, 22, 26), 0.3, 5);
  w.p(beams, shade(C.wood, -0.1));
  w.p(c.ribbon(win.slice(0, -1), 12), C.wood2);
  w.p(c.cut(c.rect(W0 - 20, WB - 4, W1 - W0 + 40, 14), 0.3, 8), C.wood);
  w.p(c.ribbon([[DOOR.x0 - 5, FLOOR + 4], [DOOR.x0 - 5, DOOR.top]], 10) + c.ribbon([[DOOR.x1 + 5, FLOOR + 4], [DOOR.x1 + 5, DOOR.top]], 10) + c.ribbon(c.arc((DOOR.x0 + DOOR.x1) / 2, DOOR.top, (DOOR.x1 - DOOR.x0) / 2 + 5, 49, PI, 2 * PI, 12), 10), C.wood2);
  w.p(c.cut([[W1 - 10, WT - 10], [W1 + 60, WT - 10], [W1 + 64, WB], [W1 + 30, WB], [W1 + 4, WT + 120]], 0.6, 8), shade(C.plumRobe, -0.1));
  w.p(c.ribbon([[W1 + 16, WT + 160], [W1 + 60, WT + 150]], 5), C.sun);
  w.p(c.cut(c.rect(1130, 420, 220, 9), 0.3, 6) + c.cut(c.rect(1130, 500, 220, 9), 0.3, 6), C.wood2);
  let scrolls = '';
  for (let i = 0; i < 7; i++) scrolls += c.cut(c.ell(1150 + i * 30, 406, 12, 13, 10), 0.3, 3);
  for (let i = 0; i < 6; i++) scrolls += c.cut(c.ell(1160 + i * 32, 486, 12, 13, 10), 0.3, 3);
  w.p(scrolls, C.parchment);
  wallL.add(w.out());
  const shadowsL = S.layer({ par: 0.32, sh: 0, flat: true });
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.clay, 0.25));
  let tiles = '';
  for (let r = 0; r < 6; r++) tiles += c.ribbon([[-900, FLOOR + 14 + r * r * 9 + r * 14], [2500, FLOOR + 14 + r * r * 9 + r * 14 + c.rr(-2, 2)]], 1.4);
  fl.x(tiles, shade(C.stone2, -0.2), 'opacity=".5"');
  floorL.add(fl.out());
  const dimL = S.layer({ par: 0.4, sh: 1, flat: true });
  dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".14"/><ellipse cx="860" cy="480" rx="560" ry="360" fill="url(#warm-glow)" opacity=".5"/>`);
  const clipId = S.id('wallclip');
  S.defs(`<clipPath id="${clipId}"><path clip-rule="evenodd" d="${c.poly([[-900, -1200], [2500, -1200], [2500, FLOOR], [-900, FLOOR]])}${c.poly(win)}${c.poly(door)}"/></clipPath>`);
  return { clipId, sky: sk, stars: starL, crowd: crowdL, shadows: shadowsL, dim: dimL, doorNight, FLOOR, CEIL, DOOR, WIN: { x0: W0, x1: W1, top: WT, bottom: WB } };
}

/* ================================================================== the high priest's courtyard (John 18's, for Luke) */
import { courtyard as court18, CY as CY18, MAID as MAID18 } from '../john18/lib.js';
import { highPriest as hp14, guardOpts as go14, oilLamp as ol14, rooster as roo14 } from '../mark14/lib.js';
import { withFace as wf3, faceBits as fb3 } from '../mark3/lib.js';
import { ropeHands as rope18 } from '../john18/lib.js';
import { TW as TW14 } from '../mark14/lib.js';
/**
 * Luke's courtyard of the high priest's house (John 18's set): the hall up on the right with the high priest seated,
 * two guards and Jesus bound (JXH); the fire "in the middle of the courtyard" (FIRE) with the servants sitting round it
 * and Peter among them (sitting and standing puppets), the servant girl with her lamp and two men who will accuse him,
 * the gate on the left, a rooster on the wall-top. Layer order: set → hall people → hall front → yard → yard people →
 * gate → rooster → (the scene's own layers). Returns handles.
 */
export const RINGL = [{ dx: -150, y: 10, f: false }, { dx: 180, y: 6, f: true }, { dx: -70, y: -22, f: false, s: 0.8 }, { dx: 96, y: -26, f: true, s: 0.8 }];
export function courtScene(S, { skyCols = DEEPNIGHT, lead = false } = {}) {
  const c = S.c;
  const R = court18(S, { skyCols });
  const { YARD, HALL, FIRE, JXH, ANX, P } = CY18;
  const hallL = S.layer({ par: P, sh: 5 });
  const hp = S.puppet(hallL.add(hp14(c, { pose: 'sit' })));
  const hg = [0, 1].map(() => S.puppet(hallL.add(person(c, go14(c)))));
  const jEl = hallL.add(wf3(person(c, { ...CAST.jesus, holdF: rope18(c) }), fb3(c)));
  const jesus = S.puppet(jEl);
  const jSad = jEl.querySelector('[data-part="sad"]');
  R.front();
  const Y = R.yard();
  const PL = S.layer({ par: P, sh: 5 });
  const ring = RINGL.map((d, i) => {
    const o = go14(c);
    return { ...d, i, x: FIRE + (S.portrait && i === 0 ? -125 : d.dx), seed: c.rr(0, 9), s: d.s ?? 0.9, sit: S.puppet(PL.add(wf3(person(c, { ...o, pose: 'sit' }), fb3(c)))), stand: S.puppet(PL.add(person(c, o))) };
  });
  const pSitEl = PL.add(wf3(person(c, { ...TW14.peter, pose: 'sit' }), fb3(c)));
  const pStEl = PL.add(wf3(person(c, TW14.peter), fb3(c)));
  const face = (el) => ({ sad: el.querySelector('[data-part="sad"]'), angry: el.querySelector('[data-part="angry"]'), tear: el.querySelector('[data-part="tear"]') });
  const maidEl = PL.add(person(c, { ...MAID18, holdF: `<g transform="translate(-2 6) scale(.42)">${ol14(c, { r: 90 })}</g>` }));
  const leadL = lead ? [0, 1].map(() => S.puppet(PL.add(person(c, go14(c))))) : [];
  const walker = lead ? S.puppet(PL.add(wf3(person(c, { ...CAST.jesus, holdF: rope18(c) }), fb3(c)))) : null;
  const G = R.gate();
  const rL = S.layer({ par: P, sh: 4 });
  const roEl = rL.add(`<g>${roo14(c)}</g>`);
  return {
    R, Y, G, hp, hg, jesus, jEl, jSad, ring, PL, rL, leadL, walker,
    pSit: S.puppet(pSitEl), pSt: S.puppet(pStEl), pSitF: face(pSitEl), pStF: face(pStEl),
    maid: S.puppet(maidEl), maidFl: maidEl.querySelector('.flame'),
    roEl, roHead: roEl.querySelector('.rhead'), beakL: roEl.querySelector('.beakL'),
    ...CY18, ROO: { x: S.portrait ? 520 : 470, y: 428 },   // phone: the rooster whole on the wall, not a half at the edge
    /** idle: lamps, fire (k 0 = out, 1 = burning), gate lamp */
    idle(T, fireK = 1) {
      R.hallLamps.forEach((l, i) => { swing(l.el, l.x, l.y, T, 0.8, 0.7, i); pose(l.fl, { x: 26, y: 36, sx: 1 + (T ? Math.sin(T * 7 + i) * 0.08 : 0), sy: 1 + (T ? Math.sin(T * 5.3 + i) * 0.1 : 0) }); });
      Y.tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: Math.max(0.01, fireK) * (0.85 + (T ? Math.sin(T * (6 + i) + i) * 0.15 : 0)), sx: 1, o: fireK > 0.02 ? 1 : 0 }));
      Y.glowL.fade(fireK * (0.85 + (T ? Math.sin(T * 4) * 0.08 : 0)));
      pose(G.lampFl, { x: 35, y: -16, sy: 1 + (T ? Math.sin(T * 7) * 0.1 : 0) });
      pose(this.maidFl, { x: 35, y: -16, sy: 1 + (T ? Math.sin(T * 7) * 0.1 : 0) });
      swing(R.moon, 620, 120, T, 0.8, 0.5);
    },
    /** the hall: the high priest seated, two guards, Jesus bound, facing into the hall (look 0) or turned to the yard (1) */
    hall(T, { look = 0, jx = JXH, jo = 1, head = 8 } = {}) {
      hp.set({ x: ANX, y: HALL, s: 0.9, flip: true, armF: 30, armB: 20, head: 4, blink: blinkAt(T, 5) });
      hg[0].set({ x: JXH - 110, y: HALL, s: 0.88, flip: false, armF: 16, armB: 6, blink: blinkAt(T, 7) });
      hg[1].set({ x: JXH + 120, y: HALL, s: 0.88, flip: true, o: S.portrait ? 0 : 1, armF: 20, armB: 6, blink: blinkAt(T, 8) });   // phone: he would only stand under the progress thread
      jesus.set({ x: jx, y: HALL, s: 0.94, flip: look > 0.5, o: jo, armF: 26, armB: 12, head, blink: blinkAt(T) });
    },
  };
}

/* ================================================================== the council at daybreak (Mark 14's palace, with Matthew 26's dawn) */
import { palaceDawn as pd26 } from '../matthew26/lib.js';
import { priest as pr14, scribe as sc14 } from '../mark14/lib.js';
/**
 * The hall of the high priest's house at daybreak: the elders, chief priests and scribes seated along the hall (left,
 * facing right; right, facing left), the high priest in his seat, Jesus bound in the middle, a guard. Returns handles;
 * call K.idle(T) and K.seatAll(T, fn) each frame.
 */
export function councilScene(S, { skyCols = DEEP_C, dawnCols = DAYBREAK } = {}) {
  const c = S.c;
  const R = pd26(S, { skyCols, dawnCols });
  const { HALL, SEATX } = R;
  const glowL = S.layer({ par: R.P, sh: 0, flat: true });
  const hallL = S.layer({ par: R.P, sh: 5 });
  const SEATED = [
    { m: () => sc14(c, 0, { pose: 'sit' }), x: 680 }, { m: () => pr14(c, 1, { pose: 'sit' }), x: 742 }, { m: () => sc14(c, 3, { pose: 'sit' }), x: 804 }, { m: () => pr14(c, 2, { pose: 'sit' }), x: 866 },
    { m: () => pr14(c, 3, { pose: 'sit' }), x: 1320, flip: true }, { m: () => sc14(c, 2, { pose: 'sit' }), x: 1382, flip: true },
  ].map((d, i) => { const el = hallL.add(wf3(d.m(), fb3(c))); return { ...d, x: S.portrait && d.x < 900 ? 866 - (866 - d.x) * 0.62 : d.x, i, el, seed: c.rr(0, 9), p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]') }; });
  const hpEl = hallL.add(wf3(hp14(c, { pose: 'sit' }), fb3(c)));
  const guard = S.puppet(hallL.add(person(c, go14(c))));
  const jEl = hallL.add(wf3(person(c, { ...CAST.jesus, holdF: rope18(c) }), fb3(c)));
  const Y = R.yard();
  R.porch();
  return {
    R, Y, SEATED, glowL, hallL, HALL, SEATX, JX: 1010,
    hp: S.puppet(hpEl), hpAngry: hpEl.querySelector('[data-part="angry"]'),
    guard, jesus: S.puppet(jEl), jSad: jEl.querySelector('[data-part="sad"]'),
  };
}
export const DEEP_C = ['#171b3c', '#262c58', '#3e416e'];

/* ================================================================== the Eleven with small lanterns (John 18's eleven(), Luke's cut) */
import { lantern as lantern16 } from '../john16/lib.js';
/**
 * As john18 eleven(), but each lantern's glow is kept tiny (just round the lantern itself), so it never lies over a
 * disciple's robe and every one of them keeps his true colours. Returns { J, D }.
 */
export function elevenL(S, L, { gy = 700, pos, s = 0.9, lamps = true, arm = 28, js = 1.02 } = {}) {
  const c = S.c;
  const D = pos.map((d) => ({ ...d, y: gy + d.y })).sort((a, b) => a.y - b.y).map((d, i) => {
    const o = { ...TW14[d.k] };
    if (lamps && d.lamp !== false) o.holdF = lantern16(c, arm, { glowR: 17 });
    const el = L.add(wf3(person(c, o), fb3(c)));
    return { ...d, i, s: d.s ?? s, arm, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), fl: el.querySelector('.lfl'), gl: el.querySelector('.lgl'), seed: c.rr(0, 9) };
  });
  const el = L.add(wf3(person(c, CAST.jesus), fb3(c)));
  const J = { k: 'jesus', p: S.puppet(el), el, s: js, sad: el.querySelector('[data-part="sad"]'), seed: 0 };
  return { J, D };
}
