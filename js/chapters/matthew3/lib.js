// Matthew 3 — John the Baptist in the wilderness and at the Jordan, and the baptism of Jesus.
// John, the Jordan and the dove are Mark 1's cut-outs (so he looks the same in every Gospel); the river set is
// John 1's. This file adds Matthew's own images: the vipers fleeing the fire, the fruit trees and the axe,
// the stones that become children, the threshing floor with its fork, granary and fire, the doors of heaven.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, hanging } from '../kit.js';
import { band, reeds, rock, sun, cloud, grass } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';

export { JOHN_B, hand, headAt, voiceRings, hang2, scrollParts, dove, flapWings, acacia, scrub, walledCity, camel, walkCamel, honeycomb, bee, locust, shell, scrap, drops, tagOnString, footprint, flame, plate, signpost, sparkle } from '../mark1/lib.js';
export { jordanSet, hungWord, hungGold, hungPlate, goldWord, iconWord, landMap, LAND, pin, rayBurst, glowDisc, radiance, DAY, GOLDEN, GOLD_LIGHT } from '../john1/lib.js';
export { kf, moving, speech } from '../mark2/lib.js';
export { strip, nameTag, shadowPerson, question } from '../mark3/lib.js';
export { firePit, fireFlames } from '../mark14/lib.js';
export { balance, portrait, lightCrown } from '../mark8/lib.js';
export { storyFrame } from '../mark6/lib.js';
export { folk, group, paperCrown } from '../john6/lib.js';
export { ABRAHAM, stone } from '../john8/lib.js';
import { pharisee as ph3 } from '../mark3/lib.js';
import { sadducee as sad12 } from '../mark12/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const MORNING = ['#d3e0da', '#f3e2c4', '#f8e6c8'];
export const DESERT = ['#cddcd6', '#f1dfbf', '#f7e3c2'];
export const KINGDOM = ['#f2cd86', '#f8dca6', '#fbeac6'];
export const HEAVEN = ['#f4c877', '#f9dca0', '#fcebc6'];
export const WRATH = ['#6f6178', '#b98276', '#e2b08a'];
export const HARVEST = ['#e7c9a2', '#f2d7a6', '#f8e5c0'];

/* ================================================================== the cast */
/** Pharisees (Mark 3's look) and Sadducees (Mark 12's look) */
export const pharisee = (c, i = 0) => ph3(c, i);
export const sadducee = (i = 0) => sad12(i);
/** a child of the crowd (drawn at s ≈ 0.55) */
export function child(c, i = 0) {
  const robes = [C.roseRobe, C.skyVeil, C.wheatRobe, C.sageRobe, C.blushVeil, C.mauve];
  const girl = i % 2 === 1;
  return {
    robe: robes[i % robes.length], skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4], hair: [C.hair2, C.hair3, C.hair][i % 3],
    hairStyle: girl ? 'veil' : ['curly', 'short'][i % 2 ? 1 : (i >> 1) % 2], veil: [C.linen2, C.blushVeil, C.skyVeil][i % 3], beard: 'none', belt: i % 3 ? C.ochre : null,
  };
}

/* ================================================================== desert things */
/** a flat-topped desert rock to stand on (origin: its top centre) */
export function standRock(c, w = 200, h = 90, col = C.rock2) {
  const s = sheet();
  s.p(c.cut([[-w / 2, h], [-w / 2 + 10, 20], [-w * 0.3, 2], [w * 0.2, -2], [w / 2 - 12, 10], [w / 2, h]], 1, 8), col);
  s.x(c.cut([[-w * 0.3, 6], [w * 0.1, 3], [w * 0.05, 16], [-w * 0.25, 18]], 0.5, 6), shade(col, 0.3), 'opacity=".6"');
  s.x(c.ribbon([[-w * 0.2, 40], [-w * 0.1, 70]], 3) + c.ribbon([[w * 0.25, 30], [w * 0.3, 64]], 3), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/** layered badland cliffs (a ridge whose face is striped); returns markup */
export function badlands(c, pts, col, bottom = 1700) {
  const s = sheet();
  s.p(c.cut([...pts, [pts[pts.length - 1][0], bottom], [pts[0][0], bottom]], 1.2, 10), col);
  let st = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    for (let k = 1; k < 4; k++) st += c.ribbon([[x0 + 20, Math.max(y0, y1) + k * 26], [x1 - 20, Math.max(y0, y1) + k * 26 + c.rr(-4, 4)]], 3);
  }
  s.x(st, shade(col, -0.12), 'opacity=".45"');
  return s.out();
}
/** a cave mouth in a cliff (origin: floor centre) */
export function caveMouth(c, w = 150, h = 130) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 + 6, -h * 0.5], ...c.arc(0, -h * 0.55, w / 2 - 6, h * 0.45, PI, 2 * PI, 12), [w / 2, 0]], 1, 6), mix(C.soilDark, C.duskViolet, 0.25));
  return s.out();
}

/* ================================================================== the vipers */
/** a slithering viper, head to the left (origin: head); len ≈ body length */
export function viper(c, { len = 150, col = mix(C.olive, C.soil, 0.25), belly = C.sand2, k } = {}) {
  const pts = [];
  for (let i = 0; i <= 26; i++) { const u = i / 26; pts.push([u * len, Math.sin(u * PI * 2.2) * 12 * (0.4 + u * 0.6)]); }
  const s = sheet();
  s.p(c.ribbon(pts, (u) => (u < 0.08 ? 12 + u * 30 : 14 * (1 - u * 0.85) + 1.5)), col);
  s.p(c.cut([[-16, 0], [-6, -9], [10, -9], [14, 0], [10, 8], [-6, 8]], 0.3, 3), shade(col, -0.1));
  let marks = '';
  for (let i = 3; i < 22; i += 3) { const [x, y] = pts[i]; marks += c.poly([[x - 4, y], [x, y - 4], [x + 4, y], [x, y + 4]]); }
  s.x(marks, shade(col, -0.3), 'opacity=".7"');
  s.x(c.poly(c.circ(-8, -3, 1.8, 6)), C.ink);
  s.x(c.ribbon([[-16, 1], [-24, 0], [-28, -3]], 1) + c.ribbon([[-24, 0], [-28, 3]], 1), C.terracotta);
  return `<g${k_(k)}>${s.out()}</g>`;
}
/** a line of grass fire (origin: ground centre; w wide) */
export function fireLine(c, w = 300, h = 60) {
  let d1 = '', d2 = '', d3 = '';
  for (let x = -w / 2; x < w / 2; x += c.rr(14, 24)) {
    const hh = h * c.rr(0.5, 1.1);
    const f = (hk, ww) => `M${x} 0C${x - ww} ${-hk * 0.3} ${x - ww * 0.4} ${-hk * 0.7} ${x + c.rr(-4, 4)} ${-hk}C${x + ww * 0.6} ${-hk * 0.6} ${x + ww} ${-hk * 0.3} ${x + 2} 0Z`;
    d1 += f(hh, 14); d2 += f(hh * 0.7, 9); d3 += f(hh * 0.4, 5);
  }
  return `<path d="${d1}" fill="${C.sunDeep}"/><path d="${d2}" fill="${C.lampFlame}"/><path d="${d3}" fill="#fff4d2"/>`;
}

/* ================================================================== trees, the axe */
/** an orchard tree (origin: foot of the trunk); fruits returned separately as [{x, y}] */
export function orchardTree(c, { sc = 1, leaf = C.leaf, leaf2 = C.moss, trunk = C.wood2, barren = false } = {}) {
  const P = (v) => v * sc;
  const s = sheet();
  const tk = barren ? mix(C.stone2, C.wood3, 0.3) : trunk;
  s.p(c.cut([[P(-14), 0], [P(-10), P(-80)], [P(-50), P(-140)], [P(-40), P(-146)], [P(-4), P(-104)], [P(0), P(-170)], [P(10), P(-170)], [P(12), P(-106)], [P(46), P(-150)], [P(56), P(-142)], [P(16), P(-80)], [P(16), 0]], 0.8, 7), tk);
  // roots
  s.p(c.cut([[P(-14), P(-6)], [P(-40), P(4)], [P(-30), P(6)], [P(-6), P(2)]], 0.4, 4) + c.cut([[P(14), P(-6)], [P(42), P(5)], [P(30), P(7)], [P(8), P(2)]], 0.4, 4), shade(tk, -0.1));
  if (barren) {
    // a thin, greyish crown with a few dry leaves
    let tw = '';
    [[-50, -146, -80, -190], [-40, -146, -30, -200], [0, -170, -10, -230], [10, -170, 30, -226], [56, -142, 90, -186], [46, -150, 50, -206]].forEach(([x0, y0, x1, y1]) => { tw += c.ribbon([[P(x0), P(y0)], [P(x1), P(y1)]], P(4)); });
    s.p(tw, tk);
    let lv = '';
    for (let i = 0; i < 14; i++) lv += c.cut(c.ell(P(c.rr(-80, 90)), P(c.rr(-230, -150)), P(7), P(4), 8, c.rr(0, 3)), 0.2, 3);
    s.p(lv, mix(C.olive, C.sand2, 0.5));
    return { tree: s.out(), fruits: [] };
  }
  s.p(c.cut(c.blob(0, P(-205), P(110), P(78), 16, 0.12), 1.4, 8), leaf2);
  s.p(c.cut(c.blob(P(-40), P(-215), P(70), P(52), 12, 0.15), 1.2, 7) + c.cut(c.blob(P(46), P(-200), P(66), P(50), 12, 0.15), 1.2, 7) + c.cut(c.blob(P(4), P(-250), P(62), P(38), 12, 0.15), 1.2, 7), leaf);
  let vein = '';
  for (let i = 0; i < 16; i++) { const x = P(c.rr(-90, 90)), y = P(c.rr(-270, -150)); vein += c.ribbon([[x, y], [x + P(c.rr(-8, 8)), y - P(10)]], P(1.4)); }
  s.x(vein, shade(leaf2, -0.2), 'opacity=".5"');
  const fruits = [];
  for (let i = 0; i < 9; i++) { const a = c.rr(0, PI * 2), r = Math.sqrt(c.rr(0.15, 1)); fruits.push({ x: P(Math.cos(a) * 88 * r), y: P(-208 + Math.sin(a) * 58 * r) }); }
  return { tree: s.out(), fruits };
}
/** one round fruit (a pomegranate-red apple), origin centre */
export function fruit(c, r = 9, col = mix(C.terracotta, C.roseRobe, 0.35)) {
  return sheet().p(c.cut(c.circ(0, 0, r, 12), 0.3, 3), col).x(c.poly(c.circ(-r * 0.35, -r * 0.35, r * 0.3, 6)), C.cream, 'opacity=".55"').x(c.ribbon([[0, -r], [2, -r - 5]], 1.6), C.wood2).out();
}
/** a blossom (origin centre) */
export function blossom(c, r = 7, col = '#fbe9e4') {
  return sheet().p(c.cut(c.star(0, 0, r, r * 0.55, 5, 0), 0.2, 3), col).x(c.poly(c.circ(0, 0, r * 0.3, 6)), C.sun).out();
}
/** a woodsman's axe, head up, handle down to y = h (origin at the head) */
export function axe(c, h = 190) {
  const s = sheet();
  s.p(c.ribbon([[0, -6], [3, h * 0.5], [-2, h]], (u) => 11 - u * 2, 0.6), C.wood);
  s.x(c.ribbon([[2, 10], [4, h * 0.9]], 2), shade(C.wood, 0.25), 'opacity=".6"');
  s.p(c.cut([[-6, -22], [8, -22], [30, -32], [52, -40], [58, -8], [52, 24], [30, 14], [8, 8], [-6, 8]], 0.4, 4), C.stone2);
  s.p(c.cut([[48, -38], [58, -40], [62, -8], [58, 26], [48, 22], [52, -8]], 0.3, 3), mix(C.stone, C.foam, 0.4));
  s.p(c.cut(c.rect(-10, -26, 16, 38), 0.3, 4), C.rock3);
  return s.out();
}
/** a chip of wood (origin centre) */
export function chip(c, r = 7) { return sheet().p(c.cut([[-r, -r * 0.4], [r, -r * 0.6], [r * 0.8, r * 0.5], [-r * 0.9, r * 0.4]], 0.3, 3), C.wood3).out(); }

/* ================================================================== the threshing floor */
/** a winnowing fork (pitchfork with five wooden tines); origin at the grip, tines up at -h */
export function winnowFork(c, h = 200, col = C.wood3) {
  const s = sheet();
  s.p(c.ribbon([[0, 30], [0, -h + 40]], 7), col);
  s.p(c.cut([[-26, -h + 40], [26, -h + 40], [22, -h + 52], [-22, -h + 52]], 0.3, 4), shade(col, -0.15));
  let t = '';
  for (let i = -2; i <= 2; i++) t += c.ribbon(c.qbez([i * 11, -h + 44], [i * 14, -h + 10], [i * 15 + 2, -h - 8], 6), (u) => 5 - u * 3);
  s.p(t, col);
  return s.out();
}
/** a stone granary with a wooden door (origin: base centre); the door is data-k="barnDoor" hinged on its left */
export function granary(c, { w = 230, h = 190, k = 'barnDoor' } = {}) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h * 0.62], ...c.arc(0, -h * 0.62, w / 2, h * 0.38, PI, 2 * PI, 16), [w / 2, 0]], 0.8, 8), C.stone);
  let bl = '';
  for (let y = -16; y > -h * 0.6; y -= 30) for (let x = -w / 2 + 8 + ((y / 30) % 2 ? 20 : 0); x < w / 2 - 30; x += 46) bl += c.cut(c.rect(x, y - 24, 40, 24), 0.4, 6);
  s.x(bl, C.stone2, 'opacity=".6"');
  s.p(c.cut([[-w / 2 - 8, -h * 0.6], [w / 2 + 8, -h * 0.6], [w / 2 + 4, -h * 0.55], [-w / 2 - 4, -h * 0.55]], 0.3, 6), C.roof);
  const dw = 70, dh = 100;
  s.p(c.cut([[-dw / 2, 0], [-dw / 2, -dh + 20], ...c.arc(0, -dh + 20, dw / 2, 22, PI, 2 * PI, 8), [dw / 2, 0]], 0.3, 5), C.soilDark);
  const door = sheet().p(c.cut([[0, 0], [0, -dh + 20], ...c.arc(dw / 2, -dh + 20, dw / 2, 22, PI, 1.5 * PI, 5), [dw / 2, -dh - 2], [dw, -dh + 20], [dw, 0]], 0.3, 5), C.wood).x(c.ribbon([[6, -dh * 0.3], [dw - 6, -dh * 0.3]], 3) + c.ribbon([[6, -dh * 0.7], [dw - 6, -dh * 0.7]], 3), shade(C.wood, -0.25), 'opacity=".7"').out();
  return { body: s.out(), door: `<g${k_(k)}>${door}</g>`, dw, dh };
}
/** a grain sack (origin: bottom centre) */
export function sack(c, w = 56, h = 70, col = C.linen2, band = C.terracotta) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2 - 4, -h * 0.5], [-w / 2 + 4, -h * 0.85], [-8, -h], [0, -h - 10], [8, -h], [w / 2 - 4, -h * 0.85], [w / 2 + 4, -h * 0.5], [w / 2, 0]], 0.6, 6), col);
  s.x(c.ribbon([[-w / 2 + 2, -h * 0.45], [w / 2 - 2, -h * 0.45]], 5), band, 'opacity=".8"');
  s.x(c.ribbon([[-8, -h + 2], [8, -h + 2]], 3), C.rope);
  return s.out();
}
/** a flake of chaff (origin centre) */
export function chaffFlake(c, r = 5, col = mix(C.sand, C.cream, 0.5)) { return `<path d="${c.poly([[-r, 0], [-r * 0.2, -r * 0.4], [r, -r * 0.1], [r * 0.2, r * 0.4]])}" fill="${col}"/>`; }
/** a grain of wheat (origin centre) */
export function kernel(c, r = 3.4) { return `<path d="${c.poly(c.ell(0, 0, r, r * 0.62, 8, 0.4))}" fill="${C.wheat2}"/>`; }

/* ================================================================== light */
/** a paper ribbon of light with words on it (the voice from heaven); origin centre */
export function lightBanner(c, text, { size = 30, w, col = '#fff6dc', ink = shade(C.sunRay, -0.1) } = {}) {
  const ww = w || text.length * size * 0.5 + size * 2.4, hh = size * 1.6;
  const pts = [[-ww / 2, -hh / 2], [ww / 2, -hh / 2], [ww / 2 - 18, 0], [ww / 2, hh / 2], [-ww / 2, hh / 2], [-ww / 2 + 18, 0]];
  const s = sheet().p(c.cut(pts, 0.6, 8), col);
  s.x(c.ribbon([[-ww / 2 + 26, -hh / 2 + 6], [ww / 2 - 26, -hh / 2 + 6]], 1.4) + c.ribbon([[-ww / 2 + 26, hh / 2 - 6], [ww / 2 - 26, hh / 2 - 6]], 1.4), C.haloRim, 'opacity=".8"');
  return `<ellipse rx="${ww * 0.75}" ry="${hh * 1.8}" fill="url(#halo-glow)"/>${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** one door of heaven: a sky-blue panel (dir -1 opens to the left, 1 to the right) with a gold edge; origin at the seam */
export function heavenDoor(c, dir, gid, { w = 2400, top = -2600, bottom = 760 } = {}) {
  const x1 = dir * w;
  const seam = [];
  for (let y = top; y <= bottom; y += 40) seam.push([dir * c.rr(0, 3), y]);
  const pts = dir < 0 ? [...seam, [x1, bottom], [x1, top]] : [...seam, [x1, bottom], [x1, top]];
  const d = c.poly(pts);
  const edge = c.ribbon(seam.map(([x, y]) => [x + dir * 7, y]), 9);
  // a few paper clouds painted on the door
  let cl = '';
  [[0.18, 170], [0.42, 60], [0.3, 300], [0.62, 220]].forEach(([u, y]) => { const x = dir * (80 + u * 900); cl += c.cut(c.blob(x, y, 90, 26, 12, 0.2), 0.8, 6) + c.cut(c.blob(x + dir * 40, y - 18, 50, 22, 10, 0.2), 0.6, 5); });
  return `<path d="${d}" fill="url(#${gid})"/><path class="grain" d="${d}"/><path d="${cl}" fill="#f6efe0" opacity=".85"/><path d="${edge}" fill="${C.haloRim}"/>`;
}

/* ================================================================== the Jordan, without its sky */
/**
 * John 1's Jordan set (jordanSet), adapted: the scene draws its own sky first (for the heavens that open),
 * then this adds the sun, the mountains, the far bank and the river. Same handles as jordanSet.
 */
export function riverSet(S, { sunAt = [1230, 160], sunR = 46 } = {}) {
  const c = S.c;
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, sunR), { x: sunAt[0], y: sunAt[1], len: 700 });
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [22, 9, 3], lens: [1000, 360, 130], color: mix(C.duskViolet, C.dune, 0.5), x0: -1300 }).markup);
  const hill = S.layer({ par: 0.16, sh: 3 });
  const hs = sheet();
  hs.p(c.cut([[-1300, 700], [-1300, 470], [-600, 440], [80, 400], [330, 360], [560, 356], [700, 420], [860, 470], [1100, 480], [1500, 462], [2600, 470], [2600, 700]], 1.2, 12), mix(C.dune, C.sand2, 0.4));
  hs.x(c.cut([[700, 420], [860, 470], [800, 480], [680, 440]], 0.6, 8), C.sand, 'opacity=".6"');
  hill.add(hs.out());
  const L = S.layer({ par: 0.45, sh: 3 });
  const fbFn = c.wave(578, [5, 2], [600, 170]);
  L.add(sheet().p(c.ridge(fbFn, -1300, 2600, 1700, 12, 1), mix(C.sand, C.sage3, 0.35)).out());
  L.add(grass(c, { x0: -1300, x1: 2600, y: 578, fn: fbFn, n: 50, h: 14, color: C.olive }));
  L.add(reeds(c, 260, 604, 9, 70) + reeds(c, 1350, 606, 10, 80) + reeds(c, 560, 602, 6, 50));
  const W = S.layer({ par: 0.45, sh: 2 });
  W.add(sheet().p(c.ridge(c.wave(600, [3, 1.2], [140, 52]), -1300, 2600, 1700, 10, 0.6), C.lake).out());
  const flow = S.layer({ par: 0.45, sh: 1, flat: true, pad: 200 });
  let st = '';
  for (let i = 0; i < 26; i++) { const x = c.rr(-1300, 2600), y = c.rr(612, 700), w = c.rr(30, 90); st += c.cut([[x, y], [x + w * 0.5, y - 1.6], [x + w, y], [x + w * 0.5, y + 1.2]], 0.2, 8); }
  flow.add(`<path d="${st}" fill="${C.foam}" opacity=".55"/>`);
  return {
    hangL, sunEl, fbFn, far: L, hill,
    riverLayer: () => S.layer({ par: 0.45, sh: 4 }),
    waterFront(R) {
      const wl = sheet();
      wl.p(c.ridge(c.wave(648, [2.5, 1.2], [160, 60]), -1300, 2600, 1700, 10, 0.6), mix(C.lake, C.lake2, 0.4));
      let fl = '';
      for (let x = -1300; x < 2600; x += c.rr(40, 90)) fl += c.cut([[x, 649], [x + 20, 646], [x + 42, 649], [x + 20, 651]], 0.2, 6);
      wl.x(fl, C.foam, 'opacity=".7"');
      R.add(wl.out());
    },
    nearBank() {
      const N = S.layer({ par: 0.45, sh: 4 });
      const nbFn = c.wave(708, [4, 2], [500, 150]);
      N.add(sheet().p(c.ridge(nbFn, -1300, 2600, 1700, 12, 1), C.sand2).out());
      N.add(grass(c, { x0: -1300, x1: 2600, y: 708, fn: nbFn, n: 40, h: 16, color: C.olive }) + rock(c, 380, 760, 70, 24, C.rock2));
      return { N, nbFn };
    },
    foreground() {
      const fg = S.layer({ par: 0.85, sh: 7 });
      fg.add(reeds(c, 150, 960, 16, 260, C.moss) + reeds(c, 1480, 950, 14, 240, C.moss) + rock(c, 1360, 980, 220, 90, C.rock2));
      return fg;
    },
    update(t, time, { sunX = sunAt[0], sunY = sunAt[1] } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6) * 1 });
      flow.shift((time * 18) % 200 - 100, 0);
    },
  };
}

/* ================================================================== people helpers */
/** a man of the crowd (never veiled) / a woman */
export function manOf(c, extra = {}) { const o = crowdPerson(c, extra); if (o.hairStyle === 'veil') { o.hairStyle = 'short'; o.beard = 'short'; } return o; }
export function womanOf(c, extra = {}) { return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra }; }
export { CAST, person, lerp, pose, sheet, shade, mix, C };
