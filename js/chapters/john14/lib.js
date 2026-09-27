// John 14 — the farewell discourse: the upper room at night after Judas has gone out (the eleven at the long table,
// his place left empty), the Father's house of many rooms up a path of light, the I AM of the way, the truth and the
// life, the dove of the Advocate and the companion lamps, a child on a doorstep, the little house that becomes a
// dwelling of light, the calm lake of peace — and the walls lifting away as they rise and go out into the night.
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt } from '../kit.js';
import { band, hillsWith, olive, cypress, moon, stars } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { TWELVE as T12, LOOK as L3, withFace, faceBits } from '../mark3/lib.js';
import { hangingLamp, lampGlow, templeMini, SEATS, supperTable } from '../mark14/lib.js';
import { dove as dove1 } from '../mark1/lib.js';

export { kf, hand, headAt, wordSlip, scrollOpen, scrollRolled, heart, spark, thought, speech } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, shadowPerson, thunderCloud, stoneHeart } from '../mark3/lib.js';
export { dove, flapWings, hourglassParts, sparkle, flame, signpost, voiceRings } from '../mark1/lib.js';
export { glory, soulLight, lightCrown, globe, smallCross } from '../mark8/lib.js';
export { tombIcon } from '../mark16/lib.js';
export { vis, supperTable, worldMap, MAP_SPOTS, chalice, discPlate, wordTag, shadowHand, hangingLamp, lampGlow, SEATS } from '../mark14/lib.js';
export { oliveBranch, pennant, clothBanner } from '../mark11/lib.js';
export { handLamp } from '../mark13/lib.js';
export { hourglassRig } from '../john7/lib.js';
export { iAm, framed, lightPath, drawPath } from '../john8/lib.js';
export { signBadge } from '../john2/lib.js';
export { workPlate, clayLamp, lightLamp, sealedScroll, polyAt, polyLen } from '../john10/lib.js';
export { radiance, rayBurst, glowDisc, eternityRing, drawRing, threads, darkSheet, goldWord, hungGold, hungWord, hungPlate, iconWord, tongue } from '../john1/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, lerp, blinkAt };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const NIGHT = ['#232857', '#3c3f72', '#5f5a86'];
export const DEEP = ['#141733', '#1f2449', '#2d3160'];
export const MIDNIGHT = ['#1a1e42', '#2a3060', '#474a7a'];
export const PEACE = ['#1f2a55', '#35477a', '#6a74a0'];

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
/** the Eleven (Mark's looks), keyed by name — Judas Iscariot has gone out */
export const TW = Object.fromEntries(T12.map((m) => [m.k, m.o]));
export const NAME = Object.fromEntries(T12.map((m) => [m.k, m.name]));
NAME.thaddaeus = () => tr(['Juda,', 'nie Iskariota'], ['Judas,', 'not Iscariot']);
NAME.peter = () => tr('Piotr', 'Peter');
/** one-word names (for small tags) */
const SHORT = { peter: ['Piotr', 'Peter'], andrew: ['Andrzej', 'Andrew'], james: ['Jakub', 'James'], john: ['Jan', 'John'], philip: ['Filip', 'Philip'], bartholomew: ['Bartłomiej', 'Bartholomew'], matthew: ['Mateusz', 'Matthew'], thomas: ['Tomasz', 'Thomas'], jamesA: ['Jakub', 'James'], thaddaeus: ['Juda', 'Judas'], simonZ: ['Szymon', 'Simon'] };
export const short = (k) => tr(SHORT[k][0], SHORT[k][1]);
/** the seats at the long table (as in Mark 14); Judas' place (862) stays empty */
export const SEATS11 = SEATS.filter(([k]) => k !== 'judas');
export const EMPTY_X = SEATS.find(([k]) => k === 'judas')[1];
export const seatX = (k) => SEATS.find(([n]) => n === k)[1];

/**
 * The Eleven and Jesus seated at the table (sad brows and tears ready). Returns [{k, x, i, p, sad, tear, flip, s, seed}].
 * Everyone faces the middle.
 */
export function seatEleven(S, L) {
  const c = S.c;
  return SEATS11.map(([k, x], i) => {
    const o = k === 'jesus' ? CAST.jesus : TW[k];
    const el = L.add(withFace(person(c, { ...o, pose: 'sit' }), faceBits(c)));
    return { k, x, i, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]'), flip: x > 800, s: k === 'jesus' ? 1.04 : 0.88, seed: c.rr(0, 9) };
  });
}
/** pose a seated member; o = extra puppet options */
export function sitAt(m, SEAT, T, o = {}) {
  m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, armF: 36, armB: 14, blink: blinkAt(T, m.seed), ...o });
}
/** the empty cushion where Judas sat (origin: floor centre of the seat) */
export function emptySeat(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -12, 30, 11, 12, 0.08), 0.5, 5), mix(C.terracotta, C.indigo, 0.25));
  s.x(c.ribbon([[-22, -12], [22, -13]], 1.2), shade(C.terracotta, -0.3), 'opacity=".6"');
  return s.out();
}

/* ================================================================== the upper room at night */
/**
 * The upper room (the same room as Mark 14) at night, after the supper: two arched windows onto the sleeping city,
 * the woven hanging, two hanging lamps. Behind the wall waits the Mount of Olives under the moon, so the wall can
 * lift away at the end (wallsAway). Returns { sky, stars, wall, beams, out, dim, lamps, FLOOR, CEIL, TOP, SEAT, update }.
 */
export function nightRoom(S, { skyCols = NIGHT, outside = false, between = null } = {}) {
  const c = S.c;
  const FLOOR = 712, CEIL = 200;
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.03, sh: 1, flat: true });
  starL.add(stars(c, { x0: -600, x1: 2200, y0: -600, y1: 470, n: 80 }));
  // outside: the Mount of Olives and the Kidron (only seen when the walls lift)
  let out = null;
  if (outside) {
    out = S.layer({ par: 0.1, sh: 2 });
    out.add(`<g transform="translate(1180 170)"><circle r="120" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 40)}</g>`);
    out.add(hillsWith(c, { y: 500, amps: [26, 9, 3], lens: [1200, 380, 130], color: mix(C.hillMid, C.night, 0.62), trees: 44, treeColor: mix(C.olive, C.night, 0.55), treeH: 20, x0: -1400, x1: 3200 }).markup);
    out.add(band(c, { y: 600, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillNear, C.night, 0.6), x0: -1400, x1: 3200 }).markup
      + olive(c, 1270, 620, 1.1, { leaf: mix(C.olive, C.night, 0.45), leaf2: mix(C.sage, C.night, 0.45), trunk: mix(C.wood2, C.night, 0.4) })
      + olive(c, 320, 630, 1.0, { leaf: mix(C.olive, C.night, 0.45), leaf2: mix(C.sage, C.night, 0.45), trunk: mix(C.wood2, C.night, 0.4) })
      + cypress(c, 1130, 610, 150, mix(C.moss2, C.night, 0.45)));
  }
  // roofs of the city through the windows
  const roofs = S.layer({ par: 0.12, sh: 2 });
  const rs = sheet();
  let rd = '', rl = '';
  for (let i = 0; i < 30; i++) { const x = c.rr(250, 1350), w = c.rr(30, 60), top = c.rr(468, 505); rd += c.cut(c.rect(x, top, w, 200), 0.4, 6); if (c.chance(0.4)) rl += c.poly(c.rect(x + w * 0.4, top + 8, 4, 5)); }
  rs.p(rd, mix(C.plaster2, C.indigo, 0.62));
  roofs.add(`<g transform="translate(1085 500)">${templeMini(c, 0.8, { col: mix(C.cream, C.indigo, 0.45), gold: mix(C.sun, C.indigo, 0.35) })}</g>` + rs.out() + `<path d="${rl}" fill="${C.lampFlame}" opacity=".8"/><g transform="translate(520 380)"><circle r="40" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 16)}</g>`);
  const extra = between ? between(S) : null;
  // back wall with two arched windows (lifted away at the end — so it gets a pad)
  const wallL = S.layer({ par: 0.3, sh: 3, pad: outside ? 260 : 0 });
  const wcol = mix(C.plaster, C.apricot, 0.22);
  const archWin = (x0, x1, top, bot) => [[x0, bot], [x0, top + (x1 - x0) / 2], ...c.arc((x0 + x1) / 2, top + (x1 - x0) / 2, (x1 - x0) / 2, (x1 - x0) / 2, PI, 2 * PI, 14), [x1, bot]];
  const winA = archWin(470, 590, 330, 520), winB = archWin(1010, 1130, 330, 520);
  const w = sheet();
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(winA, 0.5, 6) + c.hole(winB, 0.5, 6), wcol);
  let blot = '';
  for (let i = 0; i < 14; i++) blot += c.cut(c.blob(c.rr(-200, 1800), c.rr(CEIL + 60, FLOOR - 60), c.rr(24, 60), c.rr(10, 22), 10, 0.2), 0.8, 6);
  w.x(blot, shade(wcol, -0.05), 'opacity=".55"');
  w.p(c.ribbon(winA.slice(0, -1), 10) + c.ribbon(winB.slice(0, -1), 10), C.wood2);
  w.p(c.cut(c.rect(456, 516, 148, 10), 0.3, 6) + c.cut(c.rect(996, 516, 148, 10), 0.3, 6), C.wood);
  w.p(c.cut([[-900, -1200], [2500, -1200], [2500, CEIL], [-900, CEIL]], 0.8, 30), shade(C.wood2, -0.15));
  let beams = '';
  for (let x = -300; x < 1900; x += 100) beams += c.cut(c.rect(x, CEIL - 6, 22, 28), 0.3, 5);
  w.p(beams, C.wood);
  const hg = sheet();
  hg.p(c.cut(c.rect(690, 300, 220, 170), 0.5, 8), mix(C.terracotta, C.clay, 0.5));
  let pat = '';
  for (let y = 320; y < 460; y += 30) for (let x = 710; x < 900; x += 30) pat += c.cut(c.star(x + ((y / 30) % 2) * 15, y, 7, 3, 4, 0), 0.2, 3);
  hg.x(pat, C.cream, 'opacity=".65"');
  hg.p(c.ribbon([[682, 300], [918, 300]], 7), C.wood2);
  let fr = '';
  for (let x = 694; x < 910; x += 9) fr += c.ribbon([[x, 470], [x + 1, 482]], 1.6);
  hg.x(fr, C.wheat2);
  wallL.add(w.out() + hg.out());
  // floor
  const floorL = S.layer({ par: 0.4, sh: 3 });
  const fl = sheet();
  fl.p(c.cut([[-900, FLOOR - 40], [2500, FLOOR - 40], [2500, 1700], [-900, 1700]], 1, 30), mix(C.clay, C.sand2, 0.5));
  let lines = '';
  for (let i = 0; i < 6; i++) { const y = FLOOR - 26 + i * i * 10 + i * 12; lines += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.5); }
  fl.x(lines, shade(C.sand2, -0.2), 'opacity=".45"');
  floorL.add(fl.out());
  // the night dims the room around the lamps
  const dimL = S.layer({ par: 0.4, sh: 1, flat: true });
  dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.plumRobe, 0.25)}" opacity=".46"/><ellipse cx="800" cy="580" rx="640" ry="330" fill="url(#warm-glow)" opacity=".5"/>`);
  // hanging lamps (their own layer so they can go with the walls)
  const lampL = S.layer({ par: 0.45, sh: 3 });
  const lamps = [560, 1040].map((x, i) => {
    const gl = lampL.add(lampGlow(x, 290));
    const el = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x, y: 290, len: 120 });
    return { el, x, y: 290, fl: el.querySelector('.flame'), gl, i };
  });
  starL.fade(1);
  return {
    sky: sk, stars: starL, wall: wallL, roofs, out, extra, floor: floorL, dim: dimL, lampL, lamps, FLOOR, CEIL, TOP: FLOOR - 50, SEAT: FLOOR - 16,
    /** idle: lamps swing and flicker; low 0..1 dims them */
    update(T, low = 1) {
      lamps.forEach((l) => {
        swing(l.el, l.x, l.y, T, 1, 0.7, l.i);
        pose(l.fl, { x: 26, y: 36, sx: low * (1 + (T ? Math.sin(T * 7 + l.i) * 0.08 : 0)), sy: low * (1 + (T ? Math.sin(T * 5.3 + l.i) * 0.12 : 0)) });
        fade(l.gl, 0.85 * low);
      });
    },
  };
}
/** the long table after the supper (bread, cups, the lamb dish) and Judas' empty cushion; origin floor centre */
export function afterTable(c, w = 860) { return supperTable(c, w); }

/** a small worried storm cloud with a few drops of rain (origin: its bottom centre) */
export function worryCloud(c, w = 64) {
  const h = w * 0.42, s = sheet();
  const pts = [[-w / 2, 0]];
  const n = 4;
  for (let i = 0; i < n; i++) { const cx = -w / 2 + (w * (i + 0.5)) / n, rr = (w / n) * (i === 1 || i === 2 ? 0.95 : 0.7); pts.push(...c.arc(cx, -h * (i === 1 || i === 2 ? 0.45 : 0.2), rr, rr * 0.95, PI, 2 * PI, 8)); }
  pts.push([w / 2, 0], [w / 2 - 4, 4], [-w / 2 + 4, 4]);
  s.p(c.cut(pts, 0.6, 5), mix(C.storm, C.lavender, 0.25));
  s.p(c.cut([[-w / 2 + 3, -2], [w / 2 - 3, -2], [w / 2 - 6, 5], [-w / 2 + 6, 5]], 0.4, 6), C.storm2);
  let rain = '';
  for (let i = 0; i < 5; i++) { const x = -w * 0.34 + i * w * 0.17; rain += c.ribbon([[x, 9 + (i % 2) * 4], [x - 3, 18 + (i % 2) * 4]], 1.6); }
  s.x(rain, mix(C.skyVeil, C.storm, 0.3));
  return s.out();
}
/** n arched golden threads (quadratic curves that lift between their ends); returns set(i, x1, y1, x2, y2, lift, o) */
export function arcThreads(L, n, { color = C.haloRim, w = 1.8 } = {}) {
  let inner = '';
  for (let i = 0; i < n; i++) inner += `<path d="M0 0L0 0" stroke="${color}" stroke-width="${w}" fill="none" opacity="0" stroke-linecap="round"/>`;
  const g = L.add(`<g>${inner}</g>`);
  const ps = Array.from(g.querySelectorAll('path'));
  return (i, x1, y1, x2, y2, lift, o) => {
    const p = ps[i];
    if (o <= 0.01) { attr(p, 'opacity', 0); return; }
    attr(p, 'd', `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${((x1 + x2) / 2).toFixed(1)} ${(Math.min(y1, y2) - lift).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
    attr(p, 'opacity', o);
  };
}

/* ================================================================== the Father's house */
const archPts = (c, x, y, w, h) => [[x - w / 2, y], [x - w / 2, y - h + w / 2], ...c.arc(x, y - h + w / 2, w / 2, w / 2, PI, 2 * PI, 10), [x + w / 2, y]];
/**
 * The house of many rooms: three storeys of cream paper with gold trim, two wings, a dome with a star, a great
 * arched door. Origin: base centre (it stands ~330 tall at sc 1). Returns { markup, wins: [{x, y, w, h}] (house
 * coords, bottom centre of each window), door: {x, y, w, h} }. The window lights are separate pieces (winLight).
 */
export function fatherHouse(c) {
  const s = sheet();
  const wall = mix(C.linen, C.halo, 0.25), wall2 = mix(C.linen2, C.haloRim, 0.2), gold = C.haloRim, dark = mix(C.indigo, C.night2, 0.4);
  const wins = [];
  // steps
  s.p(c.cut(c.rect(-250, -16, 500, 16), 0.4, 10), wall2);
  s.p(c.cut(c.rect(-228, -30, 456, 16), 0.4, 10), wall);
  // wings
  s.p(c.cut(c.rect(-340, -120, 130, 90), 0.4, 8) + c.cut(c.rect(210, -120, 130, 90), 0.4, 8), wall2);
  s.p(c.cut(c.rect(-348, -128, 146, 10), 0.3, 8) + c.cut(c.rect(202, -128, 146, 10), 0.3, 8), gold);
  [[-310, -40], [-245, -40], [245, -40], [310, -40]].forEach(([x, y]) => wins.push({ x, y, w: 26, h: 48 }));
  // lower storey
  s.p(c.cut(c.rect(-205, -160, 410, 130), 0.4, 10), wall);
  s.p(c.cut(c.rect(-215, -170, 430, 12), 0.3, 10), gold);
  [-170, -110, 110, 170].forEach((x) => wins.push({ x, y: -48, w: 30, h: 66 }));
  // middle storey
  s.p(c.cut(c.rect(-165, -258, 330, 90), 0.4, 10), mix(wall, C.cream, 0.4));
  s.p(c.cut(c.rect(-175, -268, 350, 12), 0.3, 10), gold);
  [-124, -62, 0, 62, 124].forEach((x) => wins.push({ x, y: -180, w: 28, h: 58 }));
  // top storey + dome + star
  s.p(c.cut(c.rect(-100, -330, 200, 64), 0.4, 8), wall);
  s.p(c.cut(c.rect(-108, -338, 216, 10), 0.3, 8), gold);
  [-50, 50].forEach((x) => wins.push({ x, y: -276, w: 26, h: 44 }));
  s.p(c.cut([[-78, -336], ...c.arc(0, -336, 78, 70, PI, 2 * PI, 18), [78, -336]], 0.4, 6), mix(C.halo, C.cream, 0.3));
  s.x(c.ribbon(c.arc(0, -336, 56, 50, PI * 1.05, PI * 1.95, 12), 2), gold, 'opacity=".7"');
  s.p(c.cut(c.star(0, -426, 17, 7, 5, -PI / 2), 0.3, 4), C.sun);
  // little domes on the wings
  s.p(c.cut([[-306, -128], ...c.arc(-275, -128, 31, 26, PI, 2 * PI, 10), [-244, -128]], 0.3, 5) + c.cut([[244, -128], ...c.arc(275, -128, 31, 26, PI, 2 * PI, 10), [306, -128]], 0.3, 5), mix(C.halo, C.cream, 0.3));
  // pilasters
  let pil = '';
  [-205, -140, 140, 205].forEach((x) => { pil += c.cut(c.rect(x - 5, -158, 10, 128), 0.2, 6); });
  [-165, -93, 93, 165].forEach((x) => { pil += c.cut(c.rect(x - 4, -256, 8, 88), 0.2, 6); });
  s.p(pil, wall2);
  // the dark window holes and the door
  let holes = '';
  wins.forEach((w) => { holes += c.cut(archPts(c, w.x, w.y, w.w, w.h), 0.3, 4); });
  const door = { x: 0, y: -30, w: 64, h: 110 };
  holes += c.cut(archPts(c, 0, door.y, door.w, door.h), 0.3, 5);
  s.p(holes, dark);
  // frames
  let frames = '';
  wins.forEach((w) => { frames += c.ribbon(archPts(c, w.x, w.y, w.w + 6, w.h + 3).slice(0, -1), 2.4); });
  frames += c.ribbon(archPts(c, 0, door.y, door.w + 10, door.h + 5).slice(0, -1), 4);
  s.p(frames, gold);
  return { markup: s.out(), wins, door };
}
/** the light in one window of the house (origin: window bottom centre); w, h as in fatherHouse */
export function winLight(c, w, h) {
  const pts = archPts(c, 0, 0, w - 1, h - 1);
  return `<circle cy="${-h / 2}" r="${h * 1.1}" fill="url(#warm-glow)"/><path d="${c.poly(pts)}" fill="${C.lampFlame}"/><path d="${c.poly(archPts(c, 0, -3, w * 0.55, h * 0.62))}" fill="#fff1c4"/><path d="${c.ribbon([[0, -2], [0, -h + w / 2 - 2]], 1.6) + c.ribbon([[-w / 2, -h * 0.45], [w / 2, -h * 0.45]], 1.6)}" fill="${C.haloRim}"/>`;
}
/** one leaf of the great door (origin: its hinge at the bottom; dir -1 left leaf, 1 right leaf) */
export function doorLeaf(c, dir, w = 32, h = 110) {
  const s = sheet();
  const pts = dir < 0 ? [[0, 0], [0, -h + w], ...c.arc(w, -h + w, w, w, PI, PI * 1.5, 6), [w, -h], [w, 0]] : [[0, 0], [0, -h + w], ...c.arc(-w, -h + w, w, w, 0, -PI * 0.5, 6), [-w, -h], [-w, 0]];
  s.p(c.cut(pts, 0.3, 5), C.wood3);
  s.x(c.ribbon([[dir * w * 0.5, -8], [dir * w * 0.5, -h + 20]], 1.2), C.wood2, 'opacity=".6"');
  s.x(c.poly(c.circ(dir * (w - 7), -h * 0.45, 2.6, 8)), C.sun);
  return s.out();
}
/** a very small name tag (origin at its hole, hangs down) */
export function miniTag(c, text, { size = 10 } = {}) {
  const ww = text.length * size * 0.5 + size * 1.2, hh = size * 1.5;
  const s = sheet().p(c.cut([[-ww / 2 + 4, 2], [ww / 2 - 4, 2], [ww / 2, 7], [ww / 2, hh + 3], [-ww / 2, hh + 3], [-ww / 2, 7]], 0.3, 4), C.cream);
  s.x(c.poly(c.circ(0, 5, 1.6, 6)), C.wood2);
  return `<path d="M0 -14V3" stroke="rgba(74,54,34,.6)" stroke-width="1" fill="none"/>${s.out()}<text x="0" y="${(hh * 0.62 + 5).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** a signpost whose arms have lost their words (origin: foot of the post); .arms turn */
export function blankSign(c, h = 120) {
  const post = sheet().p(c.cut(c.rect(-3.5, -h, 7, h), 0.2, 4), shade(C.wood2, -0.1)).out();
  const arms = sheet().p(c.cut([[0, -10], [66, -14], [80, -2], [66, 10], [0, 6]], 0.3, 4), C.wood3).p(c.cut([[0, 20], [-58, 16], [-72, 28], [-58, 40], [0, 36]], 0.3, 4), shade(C.wood3, -0.08)).p(c.cut([[0, 48], [52, 46], [64, 56], [52, 66], [0, 64]], 0.3, 4), C.wood3).out();
  return `${post}<g class="arms" transform="translate(0 ${-h + 14})">${arms}</g>`;
}
/** a long bank of night mist (flat, origin at its right end; it reaches w to the left) */
export function mistBank(c, { w = 1800, h = 180, col = '#cfc9e0' } = {}) {
  let d = '';
  for (let i = 0; i < 16; i++) d += c.poly(c.ell(-w + (i + 0.5) * (w / 16) + c.rr(-30, 30), c.rr(-h * 0.3, h * 0.3), c.rr(110, 170), c.rr(h * 0.2, h * 0.34), 28, c.rr(-0.08, 0.08)));
  return `<path d="${d}" fill="${col}" opacity=".42"/><path d="${d}" fill="${col}" opacity=".26" transform="translate(60 34)"/>`;
}

/* ================================================================== the way, the truth, the life */
/** a small living tree with golden fruit (origin: base; ~h tall) */
export function lifeTree(c, h = 150) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [-3, -h * 0.35], [2, -h * 0.6]], (u) => 11 - u * 6) + c.ribbon([[-2, -h * 0.4], [-28, -h * 0.62]], 4) + c.ribbon([[1, -h * 0.48], [26, -h * 0.66]], 4), C.wood2);
  let lv = '', lv2 = '';
  for (let i = 0; i < 26; i++) {
    const a = c.rr(0, PI * 2), r = c.rr(0, 1) ** 0.6 * h * 0.36;
    const leaf = c.cut(c.blob(Math.cos(a) * r * 1.2, -h * 0.66 + Math.sin(a) * r * 0.85, c.rr(12, 20), c.rr(9, 14), 8, 0.15), 0.4, 4);
    if (i % 2) lv += leaf; else lv2 += leaf;
  }
  s.p(lv2, C.moss).p(lv, C.leaf);
  let fr = '';
  for (let i = 0; i < 9; i++) { const a = (i / 9) * PI * 2 + 0.3, r = h * (0.16 + (i % 3) * 0.08); fr += c.cut(c.circ(Math.cos(a) * r * 1.2, -h * 0.66 + Math.sin(a) * r * 0.8, 5.5, 10), 0.2, 3); }
  s.p(fr, C.sun);
  return `<circle cy="${-h * 0.62}" r="${h * 0.9}" fill="url(#halo-glow)" class="glow"/>${s.out()}`;
}
/** a dark wall with a tall arched doorway (hole) at (cx, bottom); returns markup (world coords) */
export function archWall(c, { cx = 800, w = 300, top = 170, bottom = 662, col = '#1f2350', side = 120 } = {}) {
  const arch = [[cx - w / 2, bottom], [cx - w / 2, top + w / 2], ...c.arc(cx, top + w / 2, w / 2, w / 2, PI, 2 * PI, 20), [cx + w / 2, bottom]];
  const x0 = cx - w / 2 - side, x1 = cx + w / 2 + side, y0 = top - 60;
  const s = sheet();
  s.p(c.cut([[x0 - 20, y0 - 30], [x1 + 20, y0 - 30], [x1 + 20, y0], [x0 - 20, y0]], 0.5, 10), shade(col, 0.1));
  s.p(c.cut([[x0, y0], [x1, y0], [x1, bottom + 10], [x0, bottom + 10]], 0.8, 14) + c.hole(arch, 0.5, 8), col);
  let bricks = '';
  for (let y = y0 + 30; y < bottom; y += 40) for (let x = x0 + ((y / 40) % 2) * 30; x < x1 - 50; x += 64) { if (x + 56 > cx - w / 2 - 6 && x < cx + w / 2 + 6 && y > top - 10) continue; bricks += c.ribbon([[x, y], [x + 56, y + c.rr(-1, 1)]], 1.2); }
  s.x(bricks, shade(col, 0.14), 'opacity=".5"');
  s.p(c.ribbon(arch.slice(0, -1), 10), C.haloRim);
  s.p(c.ribbon(c.arc(cx, top + w / 2, w / 2 + 16, w / 2 + 16, PI, 2 * PI, 20), 4), shade(C.haloRim, -0.2));
  return s.out();
}

/* ================================================================== Philip: the frame, the garland */
/** an empty gilt picture frame (origin centre), w × h inside; hung by two strings from the flies */
export function goldFrame(c, w = 190, h = 220, { strings = true } = {}) {
  const s = sheet();
  const b = 16;
  const inner = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
  s.p(c.cut([[-w / 2 - b, -h / 2 - b], [w / 2 + b, -h / 2 - b], [w / 2 + b, h / 2 + b], [-w / 2 - b, h / 2 + b]], 0.5, 10) + c.hole(inner, 0.3, 10), C.sun);
  s.p(c.cut([[-w / 2 - b + 5, -h / 2 - b + 5], [w / 2 + b - 5, -h / 2 - b + 5], [w / 2 + b - 5, h / 2 + b - 5], [-w / 2 + 5 - b, h / 2 + b - 5]], 0.4, 10) + c.hole([[-w / 2 - 4, -h / 2 - 4], [w / 2 + 4, -h / 2 - 4], [w / 2 + 4, h / 2 + 4], [-w / 2 - 4, h / 2 + 4]], 0.3, 10), C.haloRim);
  let orn = '';
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { orn += c.cut(c.star(sx * (w / 2 + b / 2), sy * (h / 2 + b / 2), 13, 5, 4, PI / 4), 0.2, 3); });
  orn += c.cut(c.star(0, -h / 2 - b / 2 - 4, 16, 6, 5, -PI / 2), 0.2, 3);
  s.p(orn, C.halo);
  const str = strings ? `<path d="M${-w * 0.35} -1600V${-h / 2 - b}M${w * 0.35} -1600V${-h / 2 - b}" stroke="rgba(233,196,111,.6)" stroke-width="1.3" fill="none"/>` : '';
  return str + s.out();
}
/** a sagging string for a garland from (x0, y) to (x1, y) (flat markup) */
export function garlandString(c, x0, x1, y, sag = 40) {
  const pts = [];
  for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push([lerp(x0, x1, u), y + Math.sin(u * PI) * sag]); }
  return `<path d="${c.ribbon(pts, 1.6)}" fill="${C.rope}"/>`;
}

/* ================================================================== prayers */
/** a small folded-paper prayer lantern with a flame inside (origin centre) */
export function prayerLantern(c, r = 12) {
  const s = sheet();
  s.p(c.cut([[-r * 0.7, -r], [r * 0.7, -r], [r, r * 0.6], [r * 0.5, r], [-r * 0.5, r], [-r, r * 0.6]], 0.3, 3), mix(C.cream, C.apricot, 0.25));
  s.x(c.ribbon([[0, -r], [0, r]], 0.8) + c.ribbon([[-r * 0.45, -r], [-r * 0.3, r]], 0.7) + c.ribbon([[r * 0.45, -r], [r * 0.3, r]], 0.7), C.haloRim, 'opacity=".7"');
  return `<circle r="${r * 2.6}" fill="url(#warm-glow)"/>${s.out()}<path d="M0 ${r * 0.5}C${-r * 0.3} ${r * 0.2} ${-r * 0.25} ${-r * 0.2} 0 ${-r * 0.5}C${r * 0.25} ${-r * 0.2} ${r * 0.3} ${r * 0.2} 0 ${r * 0.5}Z" fill="${C.lampFlame}" opacity=".9"/>`;
}

/* ================================================================== the Advocate */
/** a window shutter leaf for the arched windows of the room (origin: hinge at the sill; dir -1 left, 1 right) */
export function shutter(c, dir, w = 60, h = 190) {
  const s = sheet();
  const pts = dir < 0 ? [[0, 0], [0, -h + w], ...c.arc(w, -h + w, w, w, PI, PI * 1.5, 6), [w, -h], [w, 0]] : [[0, 0], [0, -h + w], ...c.arc(-w, -h + w, w, w, 0, -PI * 0.5, 6), [-w, -h], [-w, 0]];
  s.p(c.cut(pts, 0.3, 5), mix(C.wood3, C.indigo, 0.35));
  let sl = '';
  for (let y = -16; y > -h + w * 0.6; y -= 16) sl += c.ribbon([[-dir * 6, y], [-dir * (w - 6), y]], 1.4);
  s.x(sl, shade(mix(C.wood3, C.indigo, 0.35), -0.3), 'opacity=".6"');
  return s.out();
}
/** a grey passer-by of the world, hood up, eyes down (origin feet, facing right) */
export function passerOpts(i = 0) {
  const robes = [C.storm, C.stone2, C.storm2, mix(C.stone2, C.indigo, 0.4)];
  return { robe: mix(robes[i % 4], C.stone, 0.3), mantle: null, hairStyle: 'veil', veil: mix(C.stone2, C.storm, 0.4), veil2: mix(C.storm2, C.stone2, 0.3), skin: mix(C.skin3, C.stone2, 0.2), hair: C.hair3, beard: i % 2 ? 'short' : 'none', eyes: 'closed' };
}
/** the little one on the doorstep (an orphan — "I will not leave you orphans") */
export const CHILD = { robe: mix(C.skyVeil, C.stone2, 0.3), mantle: null, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.rope };
/** a small plain house front with a doorstep (origin: bottom centre; ~150 wide); .win and .door lights are separate */
export function smallHouse(c, { w = 170, h = 130, wall = mix(C.plaster2, C.indigo, 0.35), roof = mix(C.roof, C.indigo, 0.35) } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 0.6, 8), wall);
  s.p(c.cut([[-w / 2 - 10, -h], [w / 2 + 10, -h], [w / 2 + 6, -h - 12], [-w / 2 - 6, -h - 12]], 0.4, 8), roof);
  s.p(c.cut(c.rect(-w / 2 - 12, -8, w + 24, 10), 0.4, 8), shade(wall, -0.12));
  s.p(c.cut([[10, -8], [10, -84], [58, -84], [58, -8]], 0.3, 6), mix(C.night2, C.wood2, 0.3));
  s.p(c.cut([[-58, -92], [-18, -92], [-18, -58], [-58, -58]], 0.3, 5), mix(C.night2, C.indigo, 0.3));
  return s.out();
}
/** the light of the dwelling laid over smallHouse (same origin): lit window and door, gold edges, a glow */
export function dwellingLight(c, { w = 170, h = 130 } = {}) {
  const s = sheet();
  s.p(c.cut([[10, -8], [10, -84], [58, -84], [58, -8]], 0.3, 6), C.lampFlame);
  s.p(c.cut([[-58, -92], [-18, -92], [-18, -58], [-58, -58]], 0.3, 5), C.lampFlame);
  s.x(c.poly([[16, -12], [16, -78], [52, -78], [52, -12]]) + c.poly([[-52, -86], [-24, -86], [-24, -64], [-52, -64]]), '#fff1c4');
  s.p(c.ribbon([[-w / 2 - 8, -h - 12], [w / 2 + 8, -h - 12]], 4) + c.ribbon([[-w / 2, -2], [-w / 2, -h]], 3) + c.ribbon([[w / 2, -2], [w / 2, -h]], 3), C.haloRim);
  return `<circle cy="${-h / 2}" r="${w * 1.2}" fill="url(#halo-glow)"/>${s.out()}`;
}

/* ================================================================== remembered words */
/** a saying written on an open scroll (origin centre; lines = 1–2 strings) */
export function sayingScroll(c, lines, { w = 150, size = 15 } = {}) {
  lines = Array.isArray(lines) ? lines : [lines];
  const h = 22 + lines.length * size * 1.2;
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 0.5, 8), C.parchment);
  s.p(c.cut(c.rect(-w / 2 - 9, -h / 2 - 4, 12, h + 8), 0.3, 5) + c.cut(c.rect(w / 2 - 3, -h / 2 - 4, 12, h + 8), 0.3, 5), C.wood3);
  const y0 = -((lines.length - 1) * size * 1.2) / 2 + size * 0.34;
  const txt = lines.map((l, i) => `<text x="0" y="${(y0 + i * size * 1.2).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${l}</text>`).join('');
  return `<circle r="${w * 0.75}" fill="url(#halo-glow)" class="glow"/>${s.out()}${txt}`;
}
/** the same saying rolled up and tied (origin centre) */
export function rolledSaying(c, h = 54) {
  return sheet().p(c.cut(c.rect(-9, -h / 2, 18, h), 0.3, 5), C.parchment).p(c.cut(c.rect(-4, -h / 2 - 7, 8, 7), 0.2, 3) + c.cut(c.rect(-4, h / 2, 8, 7), 0.2, 3), C.wood3).x(c.ribbon([[-9, 0], [9, 0]], 3), C.terracotta).out();
}

/* ================================================================== peace */
/** the world's peace: a gilded Roman standard with an eagle and a red PAX banner (origin: foot of the pole).
 *  .banner is a separate group (pivot at the crossbar) so it can wilt and fall */
export function paxStandard(c, h = 280) {
  const s = sheet();
  s.p(c.cut(c.rect(-4, -h, 8, h), 0.3, 6), shade(C.wood2, -0.1));
  s.p(c.cut(c.circ(0, -h * 0.45, 13, 16), 0.3, 4) + c.cut(c.circ(0, -h * 0.3, 11, 16), 0.3, 4), C.sun);
  s.x(c.poly(c.circ(0, -h * 0.45, 6, 12)) + c.poly(c.circ(0, -h * 0.3, 5, 12)), shade(C.sun, -0.2));
  // the eagle
  s.p(c.cut([[0, -h - 6], [-30, -h - 30], [-44, -h - 26], [-22, -h - 14], [-10, -h - 4], [10, -h - 4], [22, -h - 14], [44, -h - 26], [30, -h - 30]], 0.4, 4) + c.cut(c.circ(0, -h - 14, 8, 10), 0.3, 3), C.sun);
  s.p(c.cut(c.rect(-50, -h + 8, 100, 7), 0.3, 5), C.sun);
  const b = sheet();
  b.p(c.cut([[-46, 0], [46, 0], [46, 96], [30, 108], [0, 96], [-30, 108], [-46, 96]], 0.5, 6), '#b8322e');
  b.x(c.ribbon([[-40, 6], [40, 6]], 2) + c.ribbon([[-40, 88], [40, 88]], 2), C.sun);
  let fr = '';
  for (let x = -44; x <= 44; x += 8) fr += c.ribbon([[x, 98 + (Math.abs(x) > 20 ? 6 : 0)], [x, 108 + (Math.abs(x) > 20 ? 6 : 0)]], 1.4);
  b.x(fr, C.sun);
  const txt = `<text x="0" y="60" text-anchor="middle" font-family="${FONT}" font-size="34" letter-spacing="3" fill="${C.halo}">PAX</text>`;
  return `${s.out()}<g class="banner" transform="translate(0 ${-h + 15})">${b.out()}${txt}</g>`;
}
/** a white dove carrying an olive sprig (origin: body centre); .bird inside for flapWings */
export function peaceDove(c) {
  return `<circle r="50" fill="url(#halo-glow)"/><g transform="translate(34 -9) rotate(70) scale(.42)">${oliveSprig(c)}</g>${dove1(c)}`;
}
function oliveSprig(c, len = 60) {
  const s = sheet();
  const spine = c.qbez([0, 0], [-6, len * 0.5], [3, len], 8);
  s.p(c.ribbon(spine, 2.6), C.wood2);
  let lv = '';
  spine.forEach(([x, y], i) => { if (i < 1) return; const d = i % 2 ? 1 : -1; lv += c.cut(c.ell(x + d * 8, y + 4, 10, 3.6, 10, d * 0.8), 0.2, 3); });
  s.p(lv, C.olive);
  return s.out();
}

/** a thin veil of pale cloth laid over a round plate (origin: plate centre) */
export function plateVeil(c, r = 50) {
  const pts = [[-r - 8, -r - 4], [r + 8, -r - 6], [r + 12, r * 0.7], [r * 0.4, r + 12], [-r * 0.3, r + 6], [-r - 10, r + 10]];
  return `<path d="${c.cut(pts, 0.8, 8)}" fill="#e6def0" opacity=".78"/><path d="${c.ribbon([[-r, -r * 0.2], [r, r * 0.1]], 1.2) + c.ribbon([[-r * 0.8, r * 0.4], [r * 0.9, r * 0.6]], 1.2)}" fill="#cfc6de" opacity=".7"/>`;
}
