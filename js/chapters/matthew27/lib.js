// Matthew 27 — the Passion as Matthew tells it. Mark 15's and John 19's Passion sets and cut-outs are reused
// (Pilate's hall, the square with Barabbas' cell, the shadow-play screen, Golgotha from afar, the cross near,
// the soldiers, the women, the tomb in the rock) so all three Gospels look alike. Matthew's own pieces live here:
// Judas' thirty pieces of silver and the Temple treasury, the potter's field, the far dark tree, Pilate's wife and
// her dream, the basin and ewer of the hand-washing, the scarlet cloak and the reed, the tombs split open by the
// earthquake, and the seal and the guard on the stone.
// Everything returns SVG markup (origin noted per piece) cut with the seeded scissors + sheet().
import { C, CAST, person, sheet, shade, mix, pose, lerp } from '../kit.js';
import { LOOK as L3 } from '../mark3/lib.js';
import { MOTHER as ZEB, silver, silverStack } from '../matthew20/lib.js';
import { purse } from '../mark14/lib.js';
import { templeCourt, trumpetChest, COURT, pharisee } from '../mark12/lib.js';
import { priest, elder, purpleCloak } from '../mark15/lib.js';

export * from '../john19/lib.js';
export { silver, silverStack, purse, templeCourt, trumpetChest, COURT, pharisee };

const PI = Math.PI;
const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== the cast */

/** Judas Iscariot as the Twelve were drawn (Mark 3) */
export const JUDAS = L3.judas;
/** the mother of the sons of Zebedee (as in Matthew 20) */
export const ZEBEDEE = ZEB;
/** Pilate's wife: a Roman lady in pale linen and a lavender mantle */
export const WIFE = { robe: C.linen, mantle: mix(C.lavender, C.plumRobe, 0.35), hairStyle: 'veil', veil: mix(C.lavender, C.linen, 0.35), veil2: shade(C.lavender, -0.14), skin: C.skin, hair: C.hair2, belt: C.sun };
/** her servant who carries the message */
export const MAID = { robe: C.skyVeil, mantle: null, hairStyle: 'veil', veil: C.linen2, veil2: shade(C.linen2, -0.12), skin: C.skin3, hair: C.hair3, belt: C.leather };
/** the potter of the potter's field */
export const POTTER = { robe: mix(C.clay, C.wheatRobe, 0.5), mantle: null, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.stone2, beard: 'full', skin: C.skin4, belt: C.leather };
/** the scarlet soldier's cloak (Matthew: scarlet, where Mark and John say purple) */
export const SCARLET = mix(C.curtain2, C.terracotta, 0.35);
export const scarletCloak = (c) => purpleCloak(c, SCARLET);
/** the chief priests and the elders of the people, alternating (mark11's priest/elder) */
export const leader = (c, i, extra = {}) => (i % 2 === 0 ? priest(c, i / 2, extra) : elder(c, i, extra));
/** Matthew's own skies for this chapter */
export const MT = {
  temple: ['#d3dcd6', '#efe4cc', '#f5e6c8'],
  dusk: ['#4c4670', '#b98a8a', '#e4b08e'],
  dark: ['#2b2a47', '#6d5a6e', '#a77f78'],
  field: ['#cfd6cf', '#eedfc2', '#f3dcb6'],
  sabbath: ['#b9c9cc', '#ecdcc0', '#f4e1c0'],
  tombDay: ['#a9b8c4', '#e3d3bb', '#efd8b4'],
};

/* ================================================================== small props */

/** a reed held in the right hand as a mock sceptre (hold markup; upright when the arm is raised ~40°) */
export function reedSceptre(c, a = 40, len = 150) {
  const r = (a * PI) / 180, dx = Math.sin(r), dy = -Math.cos(r);
  const p0 = [-dx * len * 0.12, -dy * len * 0.12], p1 = [dx * len * 0.88, dy * len * 0.88];
  const tip = [p1[0] + dx * 16, p1[1] + dy * 16];
  return `<path d="${c.ribbon([p0, p1], 2.4)}" fill="${C.wheat2}"/><path d="${c.cut(c.ell(tip[0], tip[1], 4.5, 10, 10, r), 0.2, 3)}" fill="${shade(C.wheat2, -0.12)}"/>`;
}
/** a bronze ewer (origin: base centre) */
export function ewer(c, h = 56) {
  const col = mix(C.ochre, C.clay, 0.25);
  const s = sheet();
  s.p(c.cut([[-12, 0], [-15, -h * 0.35], [-11, -h * 0.62], [-6, -h * 0.72], [-7, -h * 0.9], [9, -h], [6, -h * 0.72], [11, -h * 0.62], [15, -h * 0.35], [12, 0]], 0.3, 4), col);
  s.p(c.ribbon(c.qbez([12, -h * 0.3], [26, -h * 0.5], [10, -h * 0.72], 8), 3), shade(col, -0.15));
  s.x(c.ribbon([[-13, -h * 0.4], [13, -h * 0.4]], 1.4), shade(col, 0.3), 'opacity=".7"');
  return s.out();
}
/** a wide bronze basin on a stand (origin: floor centre); the water surface is .water */
export function basin(c, w = 90, h = 70) {
  const col = mix(C.ochre, C.clay, 0.25);
  const s = sheet();
  s.p(c.cut([[-8, 0], [-5, -h + 14], [5, -h + 14], [8, 0]], 0.3, 4) + c.cut(c.ell(0, -2, 26, 5, 12), 0.2, 3), C.wood2);
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2 - 12, -h + 20], [-w / 2 + 12, -h + 20]], 0.3, 5), col);
  s.x(c.ribbon([[-w / 2 + 6, -h + 6], [w / 2 - 6, -h + 6]], 1.3), shade(col, 0.3), 'opacity=".7"');
  return `${s.out()}<path class="water" d="${c.poly(c.ell(0, -h, w / 2 - 3, 5, 16))}" fill="${C.lake2}"/>`;
}
/** a small falling drop of water (origin centre) */
export function drop(c, r = 4) {
  return `<path d="${c.poly([[0, -r * 1.8], ...c.arc(0, 0, r, r, -PI * 0.1, PI * 1.1, 10)])}" fill="${C.lake2}"/>`;
}
/** a wax writing tablet folded open (the wife's message); origin centre; .words are the lines */
export function tablet(c, w = 70, h = 50) {
  const s = sheet();
  s.p(c.cut(c.rect(-w - 4, -h / 2 - 4, w + 3, h + 8), 0.3, 4) + c.cut(c.rect(1, -h / 2 - 4, w + 3, h + 8), 0.3, 4), C.wood);
  s.p(c.cut(c.rect(-w + 2, -h / 2 + 2, w - 6, h - 4), 0.2, 4) + c.cut(c.rect(4, -h / 2 + 2, w - 6, h - 4), 0.2, 4), mix(C.soil, C.wood2, 0.3));
  let d = '';
  for (let i = 0; i < 4; i++) { const y = -h / 2 + 10 + i * 9; d += c.ribbon([[-w + 8, y], [-12 - (i === 3 ? 20 : 0), y + c.rr(-1, 1)]], 1.2) + c.ribbon([[10, y], [w - 12 - (i === 3 ? 26 : 0), y + c.rr(-1, 1)]], 1.2); }
  return `${s.out()}<path class="words" d="${d}" fill="${C.linen2}"/>`;
}
/** a small clay pot (origin: base) */
export function claypot(c, h = 40, col = C.pot) {
  return sheet().p(c.cut([[-8, -h], [8, -h], [7, -h + 6], [h * 0.34, -h * 0.55], [h * 0.3, -h * 0.16], [8, 0], [-8, 0], [-h * 0.3, -h * 0.16], [-h * 0.34, -h * 0.55], [-7, -h + 6]], 0.4, 4), col)
    .x(c.ribbon([[-h * 0.3, -h * 0.5], [h * 0.3, -h * 0.5]], 1.3), shade(col, -0.2), 'opacity=".6"').out();
}
/** broken potsherds scattered on the ground (origin: the middle of the spread) */
export function sherds(c, w = 200, n = 12, col = C.pot) {
  let a = '', b = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(-w / 2, w / 2), y = c.rr(-8, 8), r = c.rr(5, 11), k = c.rr(0, PI);
    const d = c.cut([[x - r, y], [x - r * 0.3, y - r * 0.6], [x + r, y - r * 0.2], [x + r * 0.5, y + r * 0.3]].map(([px, py]) => [x + (px - x) * Math.cos(k) - (py - y) * Math.sin(k) * 0.4, y + (py - y)]), 0.3, 3);
    if (i % 2) a += d; else b += d;
  }
  return sheet().p(a, col).p(b, shade(col, -0.12)).out();
}
/** a potter's wheel with a half-made pot on it (origin: floor centre) */
export function potterWheel(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -4, 38, 7, 14), 0.3, 4), C.wood2);
  s.p(c.cut(c.rect(-4, -40, 8, 36), 0.2, 4), C.wood);
  s.p(c.cut(c.ell(0, -42, 28, 6, 14), 0.3, 4), C.wood3);
  s.p(c.cut([[-12, -44], [-16, -58], [-10, -74], [10, -74], [16, -58], [12, -44]], 0.3, 4), mix(C.pot, C.clay, 0.4));
  return s.out();
}
/** a simple low stone marking a stranger's grave (origin: base centre) */
export function graveStone(c, w = 34, h = 24) {
  const col = mix(C.rock, C.stone2, 0.4);
  return sheet().p(c.cut([[-w / 2, 0], [-w / 2 + 3, -h * 0.7], [-w * 0.2, -h], [w * 0.25, -h * 0.96], [w / 2 - 2, -h * 0.6], [w / 2, 0]], 0.5, 4), col)
    .x(c.ribbon([[-w * 0.3, -h * 0.5], [w * 0.2, -h * 0.62]], 1.2), shade(col, 0.2), 'opacity=".6"').out();
}
/** a far, dark, leafless tree on a ridge (a silhouette; origin: foot of the trunk) */
export function bareTree(c, h = 170, col = '#2c2533') {
  const s = sheet();
  const trunk = [[-10, 0], [-6, -h * 0.35], [-10, -h * 0.55], [-3, -h * 0.62], [4, -h * 0.5], [6, -h * 0.3], [11, 0]];
  s.p(c.cut(trunk, 0.6, 5), col);
  let br = '';
  const B = (pts, w) => { br += c.ribbon(pts, w); };
  B(c.qbez([-6, -h * 0.55], [-40, -h * 0.72], [-72, -h * 0.7], 10), (u) => 7 - u * 5.5);
  B(c.qbez([-40, -h * 0.68], [-50, -h * 0.86], [-44, -h * 0.98], 8), (u) => 4 - u * 3);
  B(c.qbez([-2, -h * 0.6], [4, -h * 0.85], [-10, -h * 1.02], 10), (u) => 6 - u * 5);
  B(c.qbez([2, -h * 0.52], [40, -h * 0.66], [82, -h * 0.62], 10), (u) => 7 - u * 5.5);
  B(c.qbez([46, -h * 0.64], [60, -h * 0.8], [52, -h * 0.94], 8), (u) => 4 - u * 3);
  B(c.qbez([66, -h * 0.63], [84, -h * 0.72], [96, -h * 0.7], 6), (u) => 2.6 - u * 2);
  B(c.qbez([-58, -h * 0.71], [-78, -h * 0.8], [-92, -h * 0.76], 6), (u) => 2.6 - u * 2);
  B(c.qbez([-4, -h * 0.9], [16, -h * 0.98], [24, -h * 1.08], 6), (u) => 2.4 - u * 1.8);
  s.p(br, col);
  return s.out();
}
/** a small rock-cut tomb in a hillside: dark mouth + a round stone that can roll (.stone); origin: door foot */
export function rockTomb(c, { w = 44, h = 58, col = C.rock2, stone = true } = {}) {
  const s = sheet();
  const arch = [[-w / 2, 0], [-w / 2, -h + w / 2], ...c.arc(0, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 10), [w / 2, 0]];
  s.p(c.cut(arch.map(([x, y]) => [x * 1.3, y * 1.12 - 2]), 0.4, 5), shade(col, -0.12));
  const mouth = `<path d="${c.cut(arch, 0.3, 5)}" fill="${C.soilRich}"/>`;
  const glow = `<g class="glow" opacity="0"><path d="${c.cut(arch, 0.3, 5)}" fill="${C.lampGlow}"/><circle cy="${-h / 2}" r="${h * 1.4}" fill="url(#halo-glow)"/></g>`;
  const st = sheet().p(c.cut(c.circ(0, 0, h * 0.54, 20), 0.5, 4), mix(col, C.stone2, 0.3)).x(c.ribbon(c.arc(0, 0, h * 0.4, h * 0.4, PI * 1.1, PI * 1.5, 6), 2.4), shade(col, 0.25), 'opacity=".6"').out();
  return `${s.out()}${mouth}${glow}${stone ? `<g class="stone" transform="translate(0 ${(-h * 0.54).toFixed(1)})">${st}</g>` : ''}`;
}
/** the round stone of a rockTomb on its own (origin: its centre) */
export function tombDisc(c, h = 58, col = C.rock2) {
  return sheet().p(c.cut(c.circ(0, 0, h * 0.54, 20), 0.5, 4), mix(col, C.stone2, 0.3)).x(c.ribbon(c.arc(0, 0, h * 0.4, h * 0.4, PI * 1.1, PI * 1.5, 6), 2.4), shade(col, 0.25), 'opacity=".6"').out();
}
/** the cord across the great stone, with Pilate's seal in the middle (origin: the stone's centre) */
export function sealCord(c, r = 104) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([-r * 1.35, -r * 0.2], [0, r * 0.1], [r * 1.35, -r * 0.2], 16), 3.4), C.rope);
  s.x(c.ribbon(c.qbez([-r * 1.35, -r * 0.2], [0, r * 0.1], [r * 1.35, -r * 0.2], 16), 1), shade(C.rope, -0.3), 'opacity=".6"');
  return s.out();
}
/** a figure of light (a risen saint): a pale soft silhouette with a glow (origin: feet) */
export function lightFigure(c, o = {}, col = '#fff6dc') {
  const m = person(c, { robe: col, mantle: null, skin: col, hair: col, hairStyle: o.hairStyle || 'veil', veil: col, veil2: shade(col, -0.04), beard: 'none', belt: null, halo: false });
  return `<circle cx="0" cy="-100" r="120" fill="url(#halo-glow)"/>${m.split(`fill="${C.blush}"`).join(`fill="${col}"`).replace(/fill="#3a2a20"/g, `fill="${shade(col, -0.2)}"`)}`;
}
/** thirty silver pieces in a ring (the price) — each coin in its own .k0…k29 group; origin centre */
export function thirtyRing(c, r = 70, cr = 7) {
  let out = '';
  for (let i = 0; i < 30; i++) {
    const a = -PI / 2 + (i / 30) * PI * 2;
    out += `<g class="k${i}" transform="translate(${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)})">${silverFlat(c, cr)}</g>`;
  }
  return out;
}
/** a silver coin without its glow (for many coins at once); origin centre */
export function silverFlat(c, r = 7) {
  const col = mix(C.stone, C.cream, 0.2);
  return sheet().p(c.cut(c.circ(0, 0, r, 14), 0.2, 3), shade(col, -0.08)).p(c.cut(c.circ(0, 0, r * 0.7, 12), 0.2, 3), col).out();
}
/** a painted plate on two strings (origin: top centre): a framed picture clipped to w×h */
export function picturePlate(c, id, inner, { w = 300, h = 180, frame = mix(C.wood3, C.parchment, 0.3), label = '' } = {}) {
  const fr = sheet().p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.6, 8), frame).out();
  const str = `<path d="M${-w / 2 + 10} -12L${-w / 2 + 10} -1400M${w / 2 - 10} -12L${w / 2 - 10} -1400" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/>`;
  return `${str}${fr}<defs><clipPath id="${id}"><rect x="${-w / 2}" y="0" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>${label}`;
}
export { lerp, mix, shade, FONT, PI as PI27, CAST };
