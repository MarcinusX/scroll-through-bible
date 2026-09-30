// John 16 — the farewell discourse goes on at night, on the way down from the city to the Kidron: the moon over the
// Mount of Olives, Jerusalem's walls and the Temple up on the left, terraced vineyards and olive trees on the slope,
// a pale path winding down, and the Eleven with their little lanterns around Jesus (He needs none — He is the light).
// Everything returns SVG markup (origin noted per piece), cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, sky, hanging, swing, lerp, blinkAt } from '../kit.js';
import { band, hillsWith, olive, cypress, moon, stars, grass } from '../../assets/nature.js';
import { fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { TWELVE, withFace, faceBits } from '../mark3/lib.js';
import { walledCity } from '../mark1/lib.js';
import { templeMini } from '../mark14/lib.js';

export { kf, hand, headAt, thought, speech, GLYPH, scrollOpen, scrollRolled, spark } from '../mark2/lib.js';
export { withFace, faceBits, nameTag, bubble, strip, question, shadowPerson, stoneHeart, heart, card } from '../mark3/lib.js';
export { dove, flapWings, voiceRings, walledCity } from '../mark1/lib.js';
export { glory, soulLight, globe } from '../mark8/lib.js';
export { vis, shadowHand, discPlate, wordTag, templeMini, chalice } from '../mark14/lib.js';
export { worldGlobe } from '../mark16/lib.js';
export { hourglassRig } from '../john7/lib.js';
export { radiance, rayBurst, goldWord, hungWord, hungPlate, iconWord, darkSheet } from '../john1/lib.js';
export { tr, sky, hanging, swing, pose, sheet, shade, mix, C, CAST, person, lerp, blinkAt };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
const k_ = (k) => (k ? ` data-k="${k}"` : '');
/** a colour seen by moonlight */
export const nt = (col, k = 0.45) => mix(col, C.indigo, k);

/* ================================================================== skies */
export const NIGHT = ['#232857', '#3c3f72', '#5f5a86'];
export const DEEP = ['#141733', '#1f2449', '#2d3160'];
export const STORM = ['#1b1d38', '#2b2d4e', '#44466a'];
export const PREDAWN = ['#3b3f74', '#8a7aa0', '#d7a79a'];
export const DAWN = ['#8f9cc0', '#e6b9a8', '#f6d7b0'];
export const MORNING = ['#bcd5d8', '#f0e3c8', '#f8e6c4'];

/* ================================================================== the cast */
export const JESUS = CAST.jesus;
/** the Eleven (Mark's looks) — Judas Iscariot has gone out */
export const TW = Object.fromEntries(TWELVE.filter((m) => m.k !== 'judas').map((m) => [m.k, m.o]));
export const NAME = Object.fromEntries(TWELVE.map((m) => [m.k, m.name]));
/** the usual line on the path: Jesus in the middle (JX), the Eleven either side (as in Mark 14 on the way out) */
export const JX = 800;
export const LINE = [
  { k: 'andrew', x: 440, y: -14 }, { k: 'james', x: 512, y: -6 }, { k: 'thomas', x: 578, y: -20 }, { k: 'john', x: 640, y: 2 },
  { k: 'peter', x: 690, y: 8 }, { k: 'matthew', x: 900, y: -18 }, { k: 'philip', x: 955, y: 2 }, { k: 'bartholomew', x: 1018, y: -12 },
  { k: 'jamesA', x: 1076, y: -2 }, { k: 'thaddaeus', x: 1130, y: -16 }, { k: 'simonZ', x: 1186, y: 0 },
];

/** a small hand lantern (origin: the hand's grip; it hangs below). base: the arm angle it is held at, so it hangs
 *  straight. .lfl = flame, .lgl = glow */
export function lantern(c, base = 28, { glowR = 80 } = {}) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 6, 6, 7, PI, 2 * PI, 6), 1.8), C.wood2);
  s.p(c.cut([[-8, 5], [8, 5], [7, 9], [-7, 9]], 0.2, 3), C.wood2);
  s.x(c.cut([[-7, 9], [7, 9], [8.5, 27], [-8.5, 27]], 0.2, 3), mix(C.lampGlow, C.cream, 0.3), 'opacity=".9"');
  s.p(c.cut([[-10, 27], [10, 27], [9, 31], [-9, 31]], 0.2, 3), C.wood2);
  s.p(c.cut([[-9, 9], [-6.5, 9], [-7.5, 27], [-10, 27]], 0.1, 3) + c.cut([[6.5, 9], [9, 9], [10, 27], [7.5, 27]], 0.1, 3), C.wood);
  const fl = `<g class="lfl" transform="translate(0 25)"><path d="M0 0C-4 -3 -4 -9 0 -15C4 -9 4 -3 0 0Z" fill="${C.lampFlame}"/><path d="M0 -1.5C-1.8 -4 -1.8 -6.5 0 -9C1.8 -6.5 1.8 -4 0 -1.5Z" fill="#fff4d2"/></g>`;
  return `<g transform="rotate(${base}) scale(1.15)"><circle class="lgl" cx="0" cy="18" r="${glowR}" fill="url(#warm-glow)"/>${s.out()}${fl}</g>`;
}
/** light a member's lantern: k 0..1, bend = sideways lean of the flame (a gust), time for a tiny flicker */
export function lampK(m, k, bend = 0, time = 0) {
  if (!m.fl) return;
  fade(m.fl, k > 0.02 ? 1 : 0);
  fade(m.gl, Math.min(1, k * 1.1));
  if (k > 0.02) pose(m.fl, { x: 0, y: 25, sx: 0.5 + k * 0.5, sy: (0.35 + k * 0.65) * (1 + (time ? Math.sin(time * 8 + m.seed * 3) * 0.05 : 0)), r: bend });
}

/**
 * The Eleven (with lanterns in their front hands) and Jesus, on one layer. pos: [{k, x, y}] (y relative to gy).
 * Returns { J, D, all } — members { k, x, y, s, p, sad, tear, fl, gl, seed, flip, i }.
 */
export function cast(S, L, { gy = 700, pos = LINE, s = 0.9, lamps = true, arm = 28, jesus = true, js = 1.02 } = {}) {
  const c = S.c;
  const D = pos.map((d) => ({ ...d, y: gy + d.y })).sort((a, b) => a.y - b.y).map((d, i) => {
    const o = { ...TW[d.k] };
    if (lamps) o.holdF = lantern(c, arm);
    const el = L.add(withFace(person(c, o), faceBits(c)));
    return { ...d, i, s, arm, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]'), fl: el.querySelector('.lfl'), gl: el.querySelector('.lgl'), seed: c.rr(0, 9), flip: d.x > JX };
  });
  let J = null;
  if (jesus) {
    const el = L.add(withFace(person(c, JESUS), faceBits(c)));
    J = { k: 'jesus', x: JX, y: gy + 4, s: js, p: S.puppet(el), el, sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]'), seed: 0, flip: false };
  }
  return { J, D, all: J ? [...D, J] : D };
}
/** pose a member where it stands (o overrides) */
export function put(m, T, o = {}) {
  m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: m.arm ?? 20, armB: 8, blink: blinkAt(T, m.seed), ...o });
}

/* ================================================================== the night path to the Kidron */
/**
 * The way down from the city to the Kidron at night. Returns
 * { sky, stars, moon, far, olives, slope, ground, GY, fn, moonAt, update(T) }.
 * opts: skyCols, moonAt, city (Jerusalem up on the left), gy (feet line)
 */
export function pathSet(S, { skyCols = NIGHT, moonAt = [1170, 160], city = true, gy = 700, moonLen = 620, beyond = null } = {}) {
  const c = S.c;
  if (S.portrait) moonAt = [1078, -70];        // phone: the moon whole, high in the tall sky (not sliced by the edge)
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 440, n: 95 }));
  const hangL = S.layer({ par: 0.05, sh: 4 });
  const moonEl = hanging(hangL, `<circle r="130" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 42)}`, { x: moonAt[0], y: moonAt[1], len: moonLen });

  // far: the city on its hill (left), the Temple catching the moon
  const far = S.layer({ par: 0.1, sh: 2 });
  const hill = [[-900, 1700], [-900, 480], [-300, 452], [120, 410], [380, 388], [600, 384], [760, 404], [900, 452], [1100, 478], [2500, 470], [2500, 1700]];
  far.add(sheet().p(c.cut(hill, 1.2, 14), nt(C.hillFar, 0.62)).out());
  if (city) {
    far.add(walledCity(c, 470, 396, 0.95, { wall: nt(C.stone, 0.48), wall2: nt(C.stone2, 0.55), temple: nt(C.cream, 0.36) }));
    far.add(`<g transform="translate(600 372)">${templeMini(c, 0.62, { col: nt(C.cream, 0.34), gold: nt(C.sun, 0.25) })}</g>`);
    let lit = '';
    for (let i = 0; i < 12; i++) lit += c.poly(c.rect(c.rr(390, 560), c.rr(360, 388), 3, 4));
    far.add(`<path d="${lit}" fill="${C.lampFlame}" opacity=".85"/>`);
  }
  // (things that rise or sink behind the Mount of Olives)
  const back = beyond ? beyond(S) : null;
  // the Mount of Olives across the valley, dotted with trees
  const oliv = S.layer({ par: 0.15, sh: 2 });
  const h2 = hillsWith(c, { y: 505, amps: [22, 9, 3], lens: [1100, 360, 120], color: nt(C.hillMid, 0.6), trees: 40, treeColor: nt(C.olive, 0.5), treeH: 20 });
  oliv.add(h2.markup);
  // the near slope: terraced vineyards and olives going down to the Kidron
  const slope = S.layer({ par: 0.24, sh: 3 });
  const h3 = band(c, { y: 590, amps: [14, 6, 2], lens: [900, 300, 110], color: nt(C.hillNear, 0.5) });
  let terr = '', stakes = '', vine = '';
  for (let r = 0; r < 3; r++) {
    const y0 = 600 + r * 22;
    terr += c.ribbon([[-900, y0 + 4], [2500, y0 + 10]], 3);
    for (let x = -860 + r * 20; x < 2500; x += c.rr(34, 44)) {
      if (x > 560 && x < 1040 && r < 2) continue;         // leave the middle open behind Jesus
      const y = h3.fn(x) + 10 + r * 22;
      stakes += c.ribbon([[x, y], [x + 1, y - 22]], 1.8);
      vine += c.cut(c.blob(x + 2, y - 20, 11, 7, 8, 0.3), 0.4, 3);
    }
  }
  slope.add(h3.markup);
  slope.add(sheet().x(terr, nt(C.soil, 0.45), 'opacity=".35"').x(stakes, nt(C.wood2, 0.4)).p(vine, nt(C.leaf, 0.5)).out());
  const OL = { trunk: nt(C.wood2, 0.4), leaf: nt(C.olive, 0.42), leaf2: nt(C.sage, 0.42) };
  slope.add(olive(c, 200, 606, 0.75, OL) + olive(c, 1420, 610, 0.8, OL) + cypress(c, 1290, 600, 130, nt(C.moss2, 0.45)));
  // the ground and the path
  const ground = S.layer({ par: 0.34, sh: 3 });
  const fn = c.wave(gy - 44, [5, 2], [700, 160]);
  const g = sheet().p(c.ridge(fn, -900, 2500, 1700, 12, 1), nt(mix(C.sage, C.moss, 0.4), 0.5));
  const path = [[-900, gy - 28], [-200, gy - 30], [300, gy - 16], [800, gy + 6], [1300, gy + 26], [2500, gy + 60]];
  g.p(c.ribbon(c.cbez(...path.slice(0, 4), 30).concat(c.cbez(path[3], path[4], [1900, gy + 40], path[5], 20).slice(1)), (u) => 70 + u * 60, 3), nt(C.sand, 0.36));
  let pebbles = '';
  for (let i = 0; i < 26; i++) pebbles += c.cut(c.ell(c.rr(-600, 2200), gy + c.rr(-18, 40), c.rr(3, 7), c.rr(2, 4), 8), 0.2, 3);
  g.x(pebbles, nt(C.rock2, 0.4), 'opacity=".7"');
  ground.add(g.out());
  ground.add(grass(c, { x0: -700, x1: 2300, y: gy - 44, fn, n: 40, h: 12, color: nt(C.moss, 0.42) }));
  // the near foreground (seen on tall phone screens): stones, tufts, a low wall of the terraces
  const fg = sheet();
  let st = '', tf = '';
  for (let i = 0; i < 22; i++) { const x = c.rr(-200, 1800), y = c.rr(gy + 110, gy + 420); st += c.cut(c.blob(x, y, c.rr(10, 26), c.rr(6, 12), 10, 0.25), 0.6, 5); }
  for (let i = 0; i < 40; i++) { const x = c.rr(-300, 1900), y = c.rr(gy + 90, gy + 460); for (let j = 0; j < 4; j++) tf += c.ribbon([[x + j * 3, y], [x + j * 3 + c.rr(-6, 6), y - c.rr(8, 16)]], 1.6); }
  fg.p(c.ribbon([[-900, gy + 250], [300, gy + 236], [900, gy + 262], [2500, gy + 244]], 18, 4), nt(C.rock2, 0.5));
  fg.p(st, nt(C.rock2, 0.45)).x(tf, nt(C.moss, 0.45));
  ground.add(fg.out());
  const OL2 = { trunk: nt(C.wood2, 0.3), leaf: nt(C.olive, 0.3), leaf2: nt(C.sage, 0.3) };
  ground.add(olive(c, 60, fn(60) + 40, 1.35, OL2) + olive(c, 1560, fn(1560) + 44, 1.4, OL2));
  return {
    sky: sk, stars: starL, hang: hangL, moon: moonEl, far, back, ridge: h2.fn, olives: oliv, slope, ground, GY: gy, fn, moonAt,
    update(T) { swing(moonEl, moonAt[0], moonAt[1], T, 0.9, 0.5); },
  };
}

/* ================================================================== plates and props */
/**
 * A framed picture panel hung from the flies (origin: top centre of the frame).
 * inner is drawn in panel coordinates: x -w/2..w/2, y 0..h. Returns markup.
 */
export function panel(S, w, h, inner, { frame = C.wood2, bg = nt(C.parchment, 0.2), k } = {}) {
  const c = S.c;
  const clip = S.id('clip' + Math.round(c.rr(0, 1e6)));
  const fr = sheet().p(c.cut(c.rect(-w / 2 - 10, -10, w + 20, h + 20), 0.6, 8), frame)
    .x(c.ribbon([[-w / 2 - 4, -4], [w / 2 + 4, -4]], 1.4), shade(frame, 0.3), 'opacity=".6"').out();
  return `<g${k_(k)}>${fr}<defs><clipPath id="${clip}"><rect x="${-w / 2}" y="0" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${clip})"><rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${bg}"/>${inner}</g></g>`;
}
/** a round plate with a word under it, for the three plates of the Advocate (origin: centre) */
export function roundPlate(c, icon, word, { r = 66, fill = C.cream, rim = C.haloRim, face = C.parchment, ink = C.ink } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 7, 40), 0.5, 5), rim).p(c.cut(c.circ(0, 0, r, 38), 0.5, 5), fill).p(c.cut(c.circ(0, 0, r - 7, 36), 0.4, 5), face);
  if (!word) return s.out() + icon;
  const ww = word.length * 9 + 30;
  const tag = sheet().p(c.cut([[-ww / 2, r - 4], [ww / 2, r - 6], [ww / 2 + 2, r + 24], [-ww / 2 - 1, r + 25]], 0.4, 6), fill).out();
  return `${s.out()}${icon}${tag}<text x="0" y="${r + 15}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${ink}">${word}</text>`;
}
/** the light of the Father — never a figure: a glow, a radiance, rays (origin centre) */
export function fatherLight(c, r = 90, { ray = [2.4, 3.3], glow = 2.2 } = {}) {
  let d = '';
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * PI * 2 + c.rr(-0.04, 0.04), w = 0.05 * c.rr(0.7, 1.3), rr = r * c.rr(ray[0], ray[1]);
    d += c.poly([[Math.cos(a - w * 0.2) * r * 0.4, Math.sin(a - w * 0.2) * r * 0.4], [Math.cos(a - w) * rr, Math.sin(a - w) * rr], [Math.cos(a + w) * rr, Math.sin(a + w) * rr], [Math.cos(a + w * 0.2) * r * 0.4, Math.sin(a + w * 0.2) * r * 0.4]]);
  }
  const s = sheet();
  s.p(c.cut(c.star(0, 0, r * 0.62, r * 0.52, 24, 0), 0.4, 5), mix(C.halo, C.haloRim, 0.3));
  s.p(c.cut(c.circ(0, 0, r * 0.5, 36), 0.4, 5), C.halo);
  s.p(c.cut(c.circ(0, 0, r * 0.3, 28), 0.3, 4), C.star);
  return `<circle r="${r * glow}" fill="url(#halo-glow)"/><path class="rays" d="${d}" fill="#fff3cf" opacity=".4"/>${s.out()}`;
}
/** a dove of light (origin centre), wings .wingF/.wingB for flapWings */
export function lightDove(c, dv, { r = 90 } = {}) {
  return `<circle r="${r}" fill="url(#halo-glow)"/>${dv}`;
}
/** a small grey storm cloud (origin: bottom centre) */
export function greyCloud(c, w = 120, col = mix(C.storm, C.lavender, 0.15)) {
  const h = w * 0.42, s = sheet();
  const pts = [[-w / 2, 0]];
  const n = 5;
  for (let i = 0; i < n; i++) { const cx = -w / 2 + (w * (i + 0.5)) / n, big = i > 0 && i < n - 1, rr = (w / n) * (big ? 0.95 : 0.7); pts.push(...c.arc(cx, -h * (big ? 0.42 : 0.18), rr, rr * 0.9, PI, 2 * PI, 8)); }
  pts.push([w / 2, 0], [w / 2 - 5, 5], [-w / 2 + 5, 5]);
  s.p(c.cut(pts, 0.8, 6), col);
  s.p(c.cut([[-w / 2 + 4, -3], [w / 2 - 4, -3], [w / 2 - 8, 6], [-w / 2 + 8, 6]], 0.5, 7), shade(col, -0.18));
  return s.out();
}
/** rain streaks under a cloud (origin: cloud bottom centre) */
export function rainStreaks(c, w = 120, h = 140, col = '#c9d3e6') {
  let d = '';
  for (let i = 0; i < Math.round(w / 9); i++) { const x = -w / 2 + 6 + c.rr(0, w - 12), y = c.rr(8, 30), l = c.rr(14, 26); d += c.ribbon([[x, y], [x - 3, y + l]], 1.5); if (c.chance(0.7)) d += c.ribbon([[x + 4, y + l + 20], [x + 1, y + l + 20 + c.rr(10, 20)]], 1.4); }
  return `<path d="${d}" fill="${col}" opacity=".85"/>`;
}
/** a heavy little chest of scrolls with a hinged lid (.lid pivots at its back edge); origin: bottom centre */
export function scrollChest(c, w = 150, h = 80) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.5, 8), C.wood2);
  s.p(c.cut(c.rect(-w / 2 - 4, -h - 2, w + 8, 10), 0.4, 6) + c.cut(c.rect(-w / 2 - 4, -12, w + 8, 12), 0.4, 6), C.wood);
  s.x(c.ribbon([[-w / 2 + 18, -h], [-w / 2 + 18, 0]], 5) + c.ribbon([[w / 2 - 18, -h], [w / 2 - 18, 0]], 5), C.ochre);
  s.p(c.cut(c.rect(-10, -h + 14, 20, 22), 0.2, 4), C.ochre);
  s.x(c.cut(c.circ(0, -h + 26, 3.5, 8), 0.2, 2), C.soilDark);
  const lid = sheet();
  lid.p(c.cut([[0, 0], [w + 8, 0], [w + 6, -24], [w - 10, -34], [16, -34], [2, -24]], 0.5, 8), C.wood);
  lid.x(c.ribbon([[22, -34], [22, 0]], 5) + c.ribbon([[w - 14, -34], [w - 14, 0]], 5), C.ochre);
  return { box: s.out(), lid: `<g class="lid" transform="translate(${-w / 2 - 4} ${-h - 2})">${lid.out()}</g>` };
}
/** a round paper sun (origin centre) */
export function paperSun(c, r = 46) {
  let d = '';
  for (let i = 0; i < 14; i++) { const a = (i / 14) * PI * 2; d += c.poly([[Math.cos(a - 0.12) * r * 1.08, Math.sin(a - 0.12) * r * 1.08], [Math.cos(a) * r * 1.55, Math.sin(a) * r * 1.55], [Math.cos(a + 0.12) * r * 1.08, Math.sin(a + 0.12) * r * 1.08]]); }
  const s = sheet().p(d, C.sunDeep).p(c.cut(c.circ(0, 0, r, 30), 0.4, 4), C.sun).x(c.poly(c.circ(-r * 0.2, -r * 0.2, r * 0.55, 20)), '#efc57d', 'opacity=".8"');
  return `<circle r="${r * 3}" fill="url(#halo-glow)" opacity=".8"/>${s.out()}`;
}
/** a little golden flame-tongue (origin: its base) */
export function tongue(c, h = 26) {
  const s = sheet().p(c.cut([[0, 0], [-h * 0.3, -h * 0.35], [-h * 0.1, -h * 0.7], [0, -h], [h * 0.18, -h * 0.6], [h * 0.3, -h * 0.3]], 0.2, 3), C.lampFlame).x(c.poly([[0, -2], [-h * 0.12, -h * 0.3], [0, -h * 0.55], [h * 0.12, -h * 0.3]]), '#fff4d2');
  return `<circle cy="${-h * 0.4}" r="${h * 1.6}" fill="url(#warm-glow)"/>${s.out()}`;
}
/** a small paper flower (origin centre) */
export function flower(c, r = 7, col = C.jesusMantle) {
  const s = sheet();
  let p = '';
  for (let i = 0; i < 5; i++) { const a = (i / 5) * PI * 2; p += c.cut(c.circ(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7, r * 0.55, 8), 0.2, 2); }
  s.p(p, col).x(c.poly(c.circ(0, 0, r * 0.4, 8)), C.sun);
  return s.out();
}
/** a paper hill piece (origin: bottom centre), for the hanging vignettes */
export function hillPiece(c, w, h, col) {
  return sheet().p(c.cut([[-w / 2, 0], ...c.arc(0, 0, w / 2, h, PI, 2 * PI, 18).slice(1, -1), [w / 2, 0], [w / 2, 40], [-w / 2, 40]], 1, 8), col).out();
}
/** sample a polyline at u (0..1) with linear interpolation → [x, y] */
export function at(pts, u) {
  const f = Math.max(0, Math.min(1, u)) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), k = f - i;
  return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
}
/** a dotted golden path along pts; returns set(k, o) that draws it (0..1) */
export function goldArc(L, c, pts, { w = 5, col = C.halo, n = 40 } = {}) {
  let inner = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = at(pts, (i + 0.5) / n);
    inner += `<path data-i="${i}" d="${c.cut(c.circ(x, y, w * (i % 2 ? 0.7 : 1), 8), 0.2, 3)}" fill="${col}" opacity="0"/>`;
  }
  const el = L.add(`<g>${inner}</g>`);
  const segs = Array.from(el.querySelectorAll('[data-i]'));
  return (k, o = 1) => segs.forEach((p, i) => attr(p, 'opacity', Math.max(0, Math.min(1, k * n - i)) * o));
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
