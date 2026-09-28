// Matthew 1 — cut-outs and sets shared by this chapter's scenes.
// The genealogy is a Jesse tree: a vine that climbs from Abraham to Christ, and for every name a paper
// medallion blooms on it (a portrait, a rim for its age, a small badge with the person's sign). The four
// mothers hang on rose ribbons beside their sons. Each age is painted on the flat behind the vine.
import { C, sheet, shade, mix, pose, person, CAST, crowdPerson, lerp, clamp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { crown, sheep, square as carpSquare } from '../mark6/lib.js';
import { harp, LOOK as L12 } from '../mark12/lib.js';
import { lion, sparkle } from '../mark1/lib.js';
import { sheaf, grainPile } from '../../assets/things.js';
import { LOOK as L6 } from '../john6/lib.js';
import { ABRAHAM as AB8 } from '../john8/lib.js';

export { glowDisc, rayBurst, radiance, manger, baby, hungGold, hungWord, goldWord, wordFlame, doorHouse } from '../john1/lib.js';
import { doorHouse, baby as babyCut, glowDisc as gDisc } from '../john1/lib.js';
import { tint as tintM } from '../mark13/lib.js';
import { workbench as wbench } from '../mark6/lib.js';
import { sky as skyK } from '../kit.js';
import { stars as starsN, band as bandN, town as townN, olive as oliveN, cypress as cypressN } from '../../assets/nature.js';
export { dove, flapWings, scrollParts, hang2, headAt, hand, sparkle, lion } from '../mark1/lib.js';
export { angel, glory, soulLight, oilHorn } from '../mark8/lib.js';
export { lyingPerson, bedFrame } from '../mark5/lib.js';
export { thought, kf } from '../mark2/lib.js';
export { tint, handLamp } from '../mark13/lib.js';
export { sanctuary } from '../mark11/lib.js';
export { workbench, saw, hammer, square, sheep, crown, staff } from '../mark6/lib.js';
export { harp, throne } from '../mark12/lib.js';
export { tentMamre } from '../john8/lib.js';
export { along } from '../mark3/lib.js';
export { murmur } from '../john6/lib.js';
export { tent } from '../mark9/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== skies */
export const PARCH = ['#e4cfae', '#f1dfbf', '#f7ead2'];
export const STARRY = ['#10163a', '#1f2858', '#3a4378'];
export const DUSK = ['#8a7aa6', '#e0ac92', '#f3cfa4'];
export const GOLDEN = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
export const DAY = ['#cfe0da', '#f1e5c9', '#f7e9cf'];
export const EVE = ['#a79bbd', '#ecc2a4', '#f5dcb8'];
export const NIGHT = ['#1b2150', '#2b3262', '#4a4876'];
export const DAWN = ['#9fa3c4', '#efc2a8', '#f6dcbc'];

/* ================================================================== the cast */
export const JOSEPH = L6.joseph;
export const MARY = L6.mary;
export const ABRAHAM = AB8;
export const DAVID = L12.david;
export const ISAIAH = { robe: C.linen2, mantle: C.plumRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, veil2: C.plumRobe, beard: 'full', beardColor: '#e6dfd2', skin: C.skin2, belt: C.ochre };
const SKINS = [C.skin, C.skin2, C.skin3, C.skin4];
const ROBES = [C.dustyBlue, C.sageRobe, C.mauve, C.wheatRobe, C.plumRobe, C.tealRobe, C.clayMantle, C.stone, C.ochreRobe, C.linen2, C.roseRobe];
/** a man of the line: seeded variety of robe, beard, hair */
export function elder(c, extra = {}) {
  const o = crowdPerson(c);
  o.hairStyle = c.pick(['short', 'short', 'curly', 'wrap', 'bald']);
  o.beard = c.pick(['full', 'short', 'full', 'wild']);
  o.robe = c.pick(ROBES);
  o.skin = c.pick(SKINS);
  return { ...o, ...extra };
}
/** a woman of the line (always veiled) */
export function mother(c, extra = {}) {
  return { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', ...extra };
}

/* ================================================================== small icons (origin centre, ~ radius 20) */
const g = (tf, inner) => `<g transform="${tf}">${inner}</g>`;
export const ICON = {
  stars: (c) => `<path d="${c.poly(c.star(-6, -4, 11, 3.4, 4, 0)) + c.poly(c.star(9, 8, 7, 2.2, 4, 0)) + c.poly(c.star(10, -12, 5, 1.6, 4, 0)) + c.poly(c.circ(-12, 12, 2.2, 6)) + c.poly(c.circ(2, 16, 1.6, 6))}" fill="${C.star}"/>`,
  ram: (c) => sheet().p(c.cut(c.blob(2, 4, 13, 11, 12, 0.18), 0.4, 3), C.linen).p(c.cut([[8, -2], [18, 2], [16, 10], [8, 8]], 0.3, 3), mix(C.inkSoft, C.stone2, 0.4)).p(c.ribbon([...c.arc(4, -4, 8, 8, PI * 1.2, PI * 2.6, 10)], 3.4), C.clay).out(),
  ladder: (c) => { let d = c.ribbon([[-8, 18], [-4, -18]], 3) + c.ribbon([[8, 18], [4, -18]], 3); for (let i = 0; i < 5; i++) { const y = 14 - i * 8, w = 8 - i * 0.8; d += c.ribbon([[-w, y], [w, y]], 2.2); } return `<path d="${d}" fill="${C.sun}"/>`; },
  lion: (c) => g('translate(-10 12) scale(.2)', lion(c)),
  seal: (c) => sheet().p(c.ribbon([[-12, 18], [-6, -18]], 3.4), C.wood2).p(c.ribbon(c.qbez([-4, -12], [10, 4], [4, 14], 8), 1.6), C.terracotta).p(c.cut(c.circ(6, 12, 6, 10), 0.2, 3), C.sun).out(),
  thread: (c) => sheet().p(c.cut([[-12, 18], [-8, -4], [-2, -12], [6, -12], [10, -4], [12, 18]], 0.3, 3), C.skin2).p(c.ribbon([[-11, 4], [11, 2]], 3.4) + c.ribbon([[10, 2], [16, 10]], 1.6), C.terracotta).out(),
  banner: (c) => sheet().p(c.ribbon([[-12, 20], [-12, -20]], 3), C.wood2).p(c.cut([[-10, -19], [16, -16], [10, -8], [16, 0], [-10, -2]], 0.3, 3), C.terracotta).x(c.poly(c.star(1, -9, 4, 1.6, 5)), C.sun).out(),
  cord: (c) => sheet().p(c.cut(c.rect(-18, -18, 36, 36), 0.3, 5), C.stone2).p(c.cut(c.rect(-6, -10, 12, 12), 0.2, 3), C.soilDark).p(c.ribbon([[0, 0], [2, 10], [-1, 20]], 2.4), C.terracotta).x(c.ribbon([[-18, -4], [18, -5]], 1) + c.ribbon([[-18, 8], [18, 7]], 1), shade(C.stone2, -0.2)).out(),
  sheaf: (c) => g('translate(0 16) scale(.28)', sheaf(c, 110)),
  crook: (c) => sheet().p(c.ribbon([[2, 20], [0, -8]], 3), C.wood2).p(c.ribbon(c.arc(-6, -8, 7, 8, 0, -PI, 8), 3), C.wood2).out() + g('translate(-2 18) scale(.3)', sheep(c)),
  harp: (c) => g('translate(-6 18) scale(.4)', harp(c)),
  temple: (c) => sheet().p(c.cut(c.rect(-16, -2, 32, 18), 0.3, 3), C.cream).p(c.cut(c.rect(-8, -20, 16, 22), 0.3, 3), mix(C.cream, C.linen, 0.5)).x(c.ribbon([[-17, -2], [17, -2]], 2) + c.ribbon([[-9, -20], [9, -20]], 2), C.sun).x(c.poly(c.rect(-3, -8, 6, 10)), C.plumRobe).out(),
  lily: (c) => sheet().p(c.ribbon([[0, 20], [0, -2]], 2), C.moss2).p(c.cut([[0, -4], [-10, -16], [-4, -14], [0, -22], [4, -14], [10, -16]], 0.3, 3), C.linen).x(c.poly(c.circ(0, -8, 2, 6)), C.sun).out(),
  tear: (c) => sheet().p(c.cut([[0, -16], [8, -2], [9, 5], ...c.arc(0, 5, 9, 9, 0, PI, 8), [-9, 5], [-8, -2]], 0.3, 3), C.skyVeil).out(),
  sundial: (c) => sheet().p(c.cut([...c.arc(0, 8, 18, 18, PI, 2 * PI, 12), [18, 12], [-18, 12]], 0.3, 3), C.stone).x(c.poly([[0, 8], [-12, -4], [-1, 8]]), C.inkSoft, 'opacity=".7"').x(c.ribbon([[0, 8], [8, -6]], 1.4), C.sun).out(),
  scroll: (c) => sheet().p(c.cut(c.rect(-14, -10, 28, 20), 0.3, 3), C.parchment).p(c.cut(c.ell(-15, 0, 4, 12, 8), 0.2, 3) + c.cut(c.ell(15, 0, 4, 12, 8), 0.2, 3), C.wood3).x(c.ribbon([[-9, -4], [9, -4]], 1.2) + c.ribbon([[-9, 1], [7, 1]], 1.2) + c.ribbon([[-9, 6], [8, 6]], 1.2), C.ink, 'opacity=".5"').out(),
  chain: (c) => { let d = ''; for (let i = 0; i < 4; i++) d += c.ribbon(c.arc(-13 + i * 9, (i % 2) * 2, 6, 4, 0, PI * 2, 12), 2.4); return `<path d="${d}" fill="${C.rock3}"/>`; },
  stones: (c) => sheet().p(c.cut(c.rect(-18, 4, 16, 12), 0.3, 3) + c.cut(c.rect(0, 4, 16, 12), 0.3, 3) + c.cut(c.rect(-9, -8, 16, 12), 0.3, 3), C.stone).p(c.ribbon([[12, -20], [12, -4]], 1), C.inkSoft).p(c.cut(c.ell(12, -2, 3, 4, 8), 0.2, 2), C.rock3).out(),
  lamp: (c) => sheet().p(c.cut([[-14, 6], [-16, 0], [-8, -4], [8, -4], [14, -1], [18, -4], [19, -1], [12, 5], [4, 7], [-10, 7]], 0.3, 3), C.pot).out() + `<path d="M17 -4C13 -8 14 -14 17 -20C20 -14 21 -8 17 -4Z" fill="${C.lampFlame}"/>`,
  plough: (c) => sheet().p(c.ribbon([[-16, -14], [10, 10]], 3), C.wood2).p(c.cut([[8, 6], [18, 14], [6, 16]], 0.2, 3), C.rock3).p(c.ribbon([[-14, 4], [-4, -6]], 2.4), C.wood2).out(),
  jar: (c) => sheet().p(c.cut([[-6, -16], [6, -16], [5, -10], [12, -2], [12, 10], [6, 17], [-6, 17], [-12, 10], [-12, -2], [-5, -10]], 0.3, 3), C.pot).x(c.ribbon([[-11, 2], [11, 2]], 1.6), C.cream, 'opacity=".6"').out(),
  loaf: (c) => sheet().p(c.cut(c.ell(0, 2, 17, 10, 14), 0.3, 3), C.wheat2).x(c.ribbon([[-8, -2], [-4, 6]], 1.4) + c.ribbon([[0, -4], [4, 6]], 1.4) + c.ribbon([[7, -3], [10, 5]], 1.4), shade(C.wheat2, -0.25)).out(),
  net: (c) => { let d = ''; for (let i = -2; i <= 2; i++) { d += c.ribbon([[i * 7 - 4, -16], [i * 7 + 4, 16]], 1.2) + c.ribbon([[-16, i * 7], [16, i * 7 + 2]], 1.2); } return `<path d="${d}" fill="${C.rope}"/><path d="${c.poly(c.circ(-14, 16, 3, 6)) + c.poly(c.circ(14, 16, 3, 6))}" fill="${C.wood3}"/>`; },
  spindle: (c) => sheet().p(c.ribbon([[0, -18], [0, 18]], 2), C.wood2).p(c.cut(c.ell(0, 10, 9, 3.6, 10), 0.2, 3), C.wood3).p(c.cut(c.blob(0, -6, 8, 10, 10, 0.1), 0.3, 3), C.linen2).out(),
  fish: (c) => sheet().p(c.cut([[-16, 0], [-4, -7], [8, -6], [16, 0], [8, 6], [-4, 7], [-16, 0], [-22, -7], [-21, 0], [-22, 7]], 0.3, 3), C.lake3).x(c.poly(c.circ(9, -1.5, 1.4, 6)), C.ink).out(),
  grapes: (c) => { let d = ''; [[0, -8], [-6, -2], [6, -2], [-3, 5], [3, 5], [0, 11], [-9, -8], [9, -8]].forEach(([x, y]) => { d += c.cut(c.circ(x, y, 4.4, 8), 0.1, 2); }); return sheet().p(d, C.plumRobe).p(c.ribbon([[0, -12], [2, -20]], 1.6), C.moss2).out(); },
  square: (c) => g('translate(-14 14) scale(.8)', carpSquare(c)),
  star: (c) => `<path d="${c.poly(c.star(0, 0, 16, 6, 8, 0))}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 5, 10))}" fill="${C.star}"/>`,
  crown: (c) => g('translate(0 14) scale(.9)', crown(c)),
  grain: (c) => g('translate(0 10) scale(.4)', grainPile(c, 90, 36)) + sheet().p(c.ribbon([[-14, -18], [10, 8]], 2.4), C.wood3).p(c.cut(c.ell(-16, -20, 6, 3, 8, 0.8), 0.2, 2), C.wood3).out(),
};

/* ================================================================== medallions */
let NCLIP = 0;
/** a paper strip with a name on it; origin at its top centre */
export function nameStrip(c, text, { size = 20, fill = C.cream, ink = C.ink, dark = false } = {}) {
  const w = Math.max(size * 2.4, text.length * size * 0.47 + size * 0.9), h = size * 1.32;
  const s = sheet();
  const bg = dark ? mix(C.storm2, C.rock3, 0.3) : fill;
  s.p(c.cut([[-w / 2, 0], [w / 2, -1], [w / 2 + h * 0.34, h * 0.5], [w / 2 + 1, h], [-w / 2 - 1, h + 1], [-w / 2 - h * 0.34, h * 0.5]], 0.4, 6), bg);
  return `${s.out()}<text x="0" y="${(h * 0.5 + size * 0.33).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${dark ? C.cream : ink}">${text}</text>`;
}
/** a small round badge with an icon (origin centre) */
export function badge(c, icon, { r = 20, rim = C.wood3, fill = C.cream } = {}) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 3, 20), 0.3, 3), rim).p(c.cut(c.circ(0, 0, r, 20), 0.3, 3), fill);
  return s.out() + g(`scale(${(r / 22).toFixed(3)})`, icon);
}
/**
 * A portrait medallion (origin at the disc centre): a rim, a coloured disc, a head-and-shoulders cut-out
 * of `o` (a puppet's options), an optional crown, badge and name strip under it.
 * opts: r, rim, back, name, flip (face left), king, icon (badge markup), behind/front (disc coords), size, dark
 */
export function medal(S, o, { r = 50, rim = C.haloRim, back = C.parchment, name = '', flip = false, king = false, icon = '', badgeFill = C.cream, behind = '', front = '', size = 0, dark = false, nameDy = 0, figS = 1 } = {}) {
  const c = S.c;
  const id = S.id('mc' + NCLIP++);
  const k = (r / 52) * figS, hy = -0.12 * r, d = flip ? -1 : 1;
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 5 + r * 0.08, 40), 0.4, 5), rim);
  s.p(c.cut(c.circ(0, 0, r, 40), 0.3, 5), back);
  s.x(c.ribbon(c.arc(0, 0, r + 2.5 + r * 0.04, r + 2.5 + r * 0.04, 0, PI * 2, 44), 1.1), shade(rim, -0.3), 'opacity=".45"');
  const fig = o ? `<g transform="translate(${(-2 * k * d).toFixed(1)} ${(hy + 167 * k).toFixed(1)}) scale(${(k * d).toFixed(3)} ${k.toFixed(3)})">${person(c, { ...o, halo: o.halo, holdF: o.holdF || '', holdB: o.holdB || '' })}</g>` : '';
  const cr = king ? `<g transform="translate(${(2 * k * d).toFixed(1)} ${(hy - 2 * k).toFixed(1)}) scale(${(k * d).toFixed(3)} ${k.toFixed(3)})">${crown(c)}</g>` : '';
  let out = s.out() + `<clipPath id="${id}"><circle r="${(r - 0.5).toFixed(1)}"/></clipPath><g clip-path="url(#${id})">${behind}${fig}${cr}${front}</g>`;
  if (icon) out += `<g transform="translate(${(r * 0.74 * -d).toFixed(1)} ${(r * 0.7).toFixed(1)})">${badge(c, icon, { r: Math.max(15, r * 0.3), fill: badgeFill, rim: shade(rim, -0.12) })}</g>`;
  if (name) out += `<g transform="translate(0 ${(r + 6 + r * 0.08 + nameDy).toFixed(1)})">${nameStrip(c, name, { size: size || clamp(r * 0.36, 18, 25), dark })}</g>`;
  return `<g>${out}</g>`;
}
/** the kinds of medallion by age: rim / disc colours */
export const RIM = {
  patriarch: { rim: C.haloRim, back: mix(C.parchment, C.sand, 0.3) },
  night: { rim: C.haloRim, back: mix(STARRY[1], C.indigo, 0.4) },
  mother: { rim: C.roseRobe, back: mix(C.blushVeil, C.cream, 0.4) },
  desert: { rim: C.clay, back: mix(C.sand, C.dune, 0.35) },
  field: { rim: C.wheat2, back: mix(C.wheat, C.cream, 0.45) },
  king: { rim: C.sun, back: mix(C.cream, C.halo, 0.5) },
  exile: { rim: C.rock2, back: mix(C.stone2, C.skyVeil, 0.4) },
  humble: { rim: C.wood3, back: mix(C.parchment, C.sage3, 0.35) },
  holy: { rim: C.sun, back: C.halo },
};
/** an empty disc with a rim, for the counted generations (origin centre) */
export function bead(c, r = 12, rim = C.wood3, fill = C.parchment) {
  return sheet().p(c.cut(c.circ(0, 0, r + 3, 16), 0.3, 3), rim).p(c.cut(c.circ(0, 0, r, 16), 0.3, 3), fill).out();
}

/* ================================================================== the vine */
export const VINE = mix(C.moss2, C.wood2, 0.25);
/** one link of the vine along +x, from 0 to len: a bending stem with leaves (origin at its start) */
export function vineLink(c, len, { w = 9, bend = 0.16, col = VINE, leaf = C.leaf, leaf2 = C.moss, n, gold = false } = {}) {
  const b = bend * len * (c.chance(0.5) ? 1 : -1);
  const N = 18;
  const pts = c.cbez([0, 0], [len * 0.33, -b], [len * 0.66, b * 0.8], [len, 0], N);
  const s = sheet();
  s.p(c.ribbon(pts, (u) => w * (1 - u * 0.3)), gold ? mix(col, C.sun, 0.5) : col);
  n = n ?? Math.max(1, Math.round(len / 62));
  let l1 = '', l2 = '';
  for (let i = 0; i < n; i++) {
    const u = (i + 0.55) / (n + 0.3), p = pts[Math.min(N, Math.round(u * N))], q = pts[Math.min(N, Math.round(u * N) + 1)] || p;
    const ang = Math.atan2(q[1] - p[1], q[0] - p[0]), side = i % 2 ? 1 : -1;
    const a = ang + side * c.rr(0.7, 1.05), L = c.rr(15, 22);
    const cx = p[0] + Math.cos(a) * L * 0.55, cy = p[1] + Math.sin(a) * L * 0.55;
    const lf = c.cut(c.ell(cx, cy, L * 0.55, L * 0.24, 12, a), 0.3, 3);
    if (i % 2) l1 += lf; else l2 += lf;
  }
  if (l1) s.p(l1, leaf);
  if (l2) s.p(l2, leaf2);
  // a curl of tendril
  const p = pts[Math.round(N * 0.4)];
  s.x(c.ribbon([[p[0], p[1]], [p[0] + 5, p[1] - 8], ...c.arc(p[0] + 10, p[1] - 12, 5, 5, PI, PI * 3, 10)], 1.3), mix(C.leaf, C.wheatGreen, 0.4));
  return s.out();
}
/** a rose ribbon with a little flower, joining a mother to her son (along +x, origin at its start) */
export function motherRibbon(c, len, { col = C.roseRobe } = {}) {
  const pts = c.qbez([0, 0], [len * 0.5, len * 0.18], [len, 0], 14);
  const s = sheet();
  s.p(c.ribbon(pts, 5), col);
  const m = pts[7];
  s.p(c.cut(c.star(m[0], m[1], 10, 6, 5, 0.3), 0.3, 3), mix(C.roseRobe, C.cream, 0.4));
  s.x(c.poly(c.circ(m[0], m[1], 3, 8)), C.sun);
  return s.out();
}

/**
 * The line of generations, built into layers: vineL gets the links, medL the medallions.
 * nodes: [{ key, parent, x, y, r, s?, at, markup, mother? (ribbon instead of vine), root? [x, y] }]
 * A node with at < 0 is already there. At `at` its link has grown from the parent and the medallion pops out.
 * Returns { nodes, by, update(t) }.
 */
export function lineage(S, vineL, medL, nodes, { grow = 0.3, pop = 0.2, vineOpts = {} } = {}) {
  const c = S.c;
  const by = {};
  nodes.forEach((n) => {
    by[n.key] = n;
    n.s = n.s ?? 1;
    const p = n.parent ? by[n.parent] : null;
    const from = p ? [p.x, p.y] : n.root;
    if (from) {
      const dx = n.x - from[0], dy = n.y - from[1], d = Math.hypot(dx, dy) || 1;
      const r0 = p ? p.r * p.s * 0.92 : 0, r1 = n.r * n.s * 0.92;
      const len = Math.max(10, d - r0 - r1 + 10);
      const markup = n.mother ? motherRibbon(c, len) : vineLink(c, len, { ...vineOpts, ...(n.vine || {}) });
      n.link = { el: vineL.add(`<g>${markup}</g>`), x: from[0] + (dx / d) * (r0 - 5), y: from[1] + (dy / d) * (r0 - 5), r: (Math.atan2(dy, dx) * 180) / PI };
    }
    n.el = medL.add(n.markup);
  });
  const update = (t, { shift = 0 } = {}) => {
    nodes.forEach((n) => {
      const la = n.linkAt ?? n.at;
      const gk = n.at < 0 ? 1 : es(t, la - (n.grow ?? grow), la, ease.out);
      if (n.link) pose(n.link.el, { x: n.link.x, y: n.link.y, r: n.link.r, sx: Math.max(0.001, gk), sy: 0.35 + 0.65 * gk, o: gk > 0.002 ? 1 : 0 });
      const m = n.at < 0 ? 1 : es(t, n.at - 0.04, n.at + pop, ease.back);
      pose(n.el, { x: n.x, y: n.y, s: n.s * Math.max(0.001, m), o: m > 0.002 ? 1 : 0 });
    });
  };
  return { nodes, by, update };
}

/* ================================================================== sets */
/** a band of ground whose top follows fn */
export function groundBand(c, fn, col, { x0 = -1100, x1 = 2700, bottom = 1900 } = {}) {
  return sheet().p(c.ridge(fn, x0, x1, bottom, 12, 1), col).out();
}
/** a paper star with a soft glow (origin centre) */
export function glowStar(c, r = 14, col = C.star) {
  return `<circle r="${r * 3}" fill="url(#warm-glow)" opacity=".7"/><path d="${c.cut(c.star(0, 0, r, r * 0.4, 5), 0.2, 3)}" fill="${col}"/>`;
}
/** a big open book: { base, leftSide, cover } — origin at the gutter, bottom; pages w wide each */
export function bookParts(c, { w = 250, h = 190, cover = C.terracotta, page = C.parchment, left = '', right = '', fs = 26 } = {}) {
  const pg = (dir) => {
    const s = sheet();
    const top = c.qbez([0, -h + 8], [dir * w * 0.5, -h - 16], [dir * w, -h - 2], 12);
    s.p(c.cut([[0, 0], [dir * w * 0.5, 10], [dir * w, 2], ...top.slice().reverse()], 0.5, 8), page);
    let ln = '';
    for (let i = 0; i < 7; i++) {
      const y = -h + 72 + i * 15;
      ln += c.ribbon([[dir * 26, y + i * 0.6], [dir * (w - 26 - c.rr(0, 30)), y + 2]], 1.8);
    }
    s.x(ln, C.ink, 'opacity=".32"');
    s.x(c.ribbon([[dir * 4, -h + 10], [dir * 6, -4]], 3), shade(page, -0.15), 'opacity=".6"');
    return s.out();
  };
  const cov = (dir) => sheet().p(c.cut([[0, 12], [dir * (w + 12), 6], [dir * (w + 14), -h - 8], [dir * w * 0.5, -h - 22], [0, -h - 4]], 0.5, 8), cover).out();
  const txt = (dir, t) => `<text x="${dir * w * 0.5}" y="${-h + 50}" text-anchor="middle" font-family="${FONT}" font-size="${fs}" font-style="italic" fill="${C.terracotta}">${t}</text>`;
  const orn = (dir) => `<path d="${c.ribbon([[dir * w * 0.3, -h + 60], [dir * w * 0.7, -h + 60]], 1.4)}" fill="${C.haloRim}"/>`;
  const front = sheet().p(c.cut([[0, 12], [w + 12, 6], [w + 14, -h - 22], [0, -h - 18]], 0.5, 8), cover)
    .x(c.ribbon([[18, -h + 16], [w - 8, -h + 14], [w - 8, -12], [18, -10], [18, -h + 16]], 2.4), C.haloRim, 'opacity=".8"')
    .p(c.cut(c.star(w * 0.5, -h * 0.5, 30, 12, 8, 0), 0.3, 4), C.sun).out();
  return {
    base: cov(1) + pg(1) + txt(1, right) + orn(1),
    leftSide: cov(-1) + pg(-1) + txt(-1, left) + orn(-1),
    cover: front,
  };
}
/** a lectern for the book (origin: floor centre, top at -h) */
export function lectern(c, h = 150) {
  const s = sheet();
  s.p(c.cut([[-12, 0], [-8, -h], [8, -h], [12, 0]], 0.4, 6), C.wood2);
  s.p(c.cut([[-60, 0], [-50, -14], [50, -14], [60, 0]], 0.4, 6), C.wood);
  s.p(c.cut([[-180, -h + 6], [180, -h + 6], [170, -h - 8], [-170, -h - 8]], 0.4, 6), C.wood);
  return s.out();
}
/** a paper numeral card "14" (origin centre) */
export function numberCard(c, text, { size = 64, fill = C.cream, ink = C.terracotta, rim = C.haloRim } = {}) {
  const w = size * 1.6, h = size * 1.3;
  const s = sheet().p(c.cut([[-w / 2 - 5, -h / 2 - 5], [w / 2 + 5, -h / 2 - 6], [w / 2 + 6, h / 2 + 5], [-w / 2 - 5, h / 2 + 6]], 0.5, 6), rim).p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 1], [w / 2 + 1, h / 2], [-w / 2 - 1, h / 2 + 1]], 0.5, 6), fill);
  return `${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a pyramid with its lit face (origin: base centre) */
export function pyramid(c, w = 220, h = 150, col = C.dune) {
  return sheet().p(c.cut([[-w / 2, 0], [0, -h], [w / 2, 0]], 0.6, 8), shade(col, -0.12)).p(c.cut([[-w * 0.08, 0], [0, -h], [w / 2, 0]], 0.5, 8), shade(col, 0.1)).out();
}
/** the pillar of fire in the wilderness: a tall column of paper flames (origin: base centre) */
export function fireColumn(c, h = 420, w = 70) {
  const s = sheet();
  const side = (d, k) => { const pts = []; for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([d * (w * k * (0.55 + 0.45 * Math.sin(u * PI * 3 + d)) * (1 - u * 0.5)), -h * u]); } return pts; };
  s.p(c.cut([...side(-1, 1), ...side(1, 1).reverse()], 1.2, 8), C.sunDeep);
  s.p(c.cut([...side(-1, 0.62).map(([x, y]) => [x, y * 0.94]), ...side(1, 0.62).reverse().map(([x, y]) => [x, y * 0.94])], 1, 8), C.sun);
  s.p(c.cut([...side(-1, 0.3).map(([x, y]) => [x, y * 0.84]), ...side(1, 0.3).reverse().map(([x, y]) => [x, y * 0.84])], 0.8, 8), C.lampFlame);
  return `<ellipse cx="0" cy="${-h * 0.5}" rx="${w * 3}" ry="${h * 0.7}" fill="url(#warm-glow)" opacity=".6"/>` + s.out();
}
/** the wall of Jericho with Rahab's house built into it, a scarlet cord hanging from her window (origin: base centre) */
export function jerichoWall(c, w = 420, h = 130) {
  const s = sheet();
  const pts = [[-w / 2, 0], [-w / 2, -h]];
  for (let x = -w / 2; x < w / 2 - 10; x += 20) pts.push([x, -h], [x, -h - 9], [x + 10, -h - 9], [x + 10, -h]);
  pts.push([w / 2, -h], [w / 2, 0]);
  s.p(c.cut(pts, 0.4, 6), mix(C.sand2, C.stone2, 0.4));
  s.p(c.cut(c.rect(-w / 2 - 20, -h - 40, 44, h + 40), 0.4, 6) + c.cut(c.rect(w / 2 - 24, -h - 40, 44, h + 40), 0.4, 6), mix(C.sand2, C.stone2, 0.2));
  // Rahab's house on the wall
  s.p(c.cut(c.rect(-40, -h - 70, 90, 72), 0.4, 6), C.plaster);
  s.p(c.cut(c.rect(-46, -h - 76, 102, 8), 0.3, 5), C.roof);
  s.x(c.poly(c.rect(-6, -h - 50, 22, 20)), C.soilDark);
  let ln = '';
  for (let y = -h + 20; y < -6; y += 22) ln += c.ribbon([[-w / 2 + 4, y], [w / 2 - 4, y + 1]], 1);
  s.x(ln, shade(C.sand2, -0.2), 'opacity=".5"');
  const cord = sheet().p(c.ribbon([[5, -h - 32], [8, -h + 10], [3, -h + 60], [6, -h + 96]], 4.4), C.terracotta).out();
  return s.out() + cord;
}
/** a stepped ziggurat of Babylon (origin: base centre) */
export function ziggurat(c, w = 320, h = 200, col = mix(C.clay, C.dune, 0.4)) {
  const s = sheet();
  const n = 4;
  for (let i = 0; i < n; i++) {
    const ww = w * (1 - i * 0.22), y0 = -(h / n) * i, y1 = -(h / n) * (i + 1);
    s.p(c.cut([[-ww / 2, y0], [-ww / 2 + 8, y1], [ww / 2 - 8, y1], [ww / 2, y0]], 0.5, 8), shade(col, i * 0.05));
  }
  s.p(c.ribbon([[0, 0], [0, -h]], 16), shade(col, -0.12));
  s.p(c.cut(c.rect(-18, -h - 26, 36, 28), 0.3, 5), shade(col, 0.15));
  return s.out();
}
/** a weeping willow on the river bank, with a harp hung on a branch (origin: base) */
export function willow(c, h = 220, { harpAt = null } = {}) {
  const s = sheet();
  s.p(c.cut([[-9, 0], [-6, -h * 0.6], [-16, -h * 0.8], [-8, -h * 0.84], [2, -h * 0.66], [14, -h * 0.86], [20, -h * 0.82], [8, -h * 0.6], [9, 0]], 0.7, 6), C.wood2);
  let d1 = '', d2 = '';
  for (let i = 0; i < 16; i++) {
    const x0 = c.rr(-h * 0.36, h * 0.36), y0 = -h * c.rr(0.78, 1.0), len = h * c.rr(0.35, 0.62);
    const strand = c.ribbon(c.qbez([x0 * 0.3, -h * 0.84], [x0, y0 - 20], [x0 * 1.1, y0 + len], 8), (u) => 7 - u * 5);
    if (i % 2) d1 += strand; else d2 += strand;
  }
  s.p(d2, mix(C.sage, C.olive, 0.4)).p(d1, C.sage);
  let out = s.out();
  if (harpAt) out += `<g transform="translate(${harpAt[0]} ${harpAt[1]}) rotate(-12) scale(.55)"><path d="M0 -84V-110" stroke="${C.rope}" stroke-width="2"/>${harp(c)}</g>`;
  return out;
}
/** a line of captives walking in chains (one still cut-out, for a sprite): n people spaced dx apart, facing right */
export function captives(c, n = 7, dx = 70, s = 0.62) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const o = crowdPerson(c);
    out += `<g transform="translate(${(i * dx).toFixed(0)} ${c.rr(-3, 3).toFixed(1)}) scale(${(s * c.rr(0.92, 1.05)).toFixed(3)})">${person(c, { ...o, holdF: '', holdB: '' })}</g>`;
  }
  // the chain from wrist to wrist
  let ch = '';
  for (let i = 0; i < n - 1; i++) {
    const x0 = i * dx + 40 * s, x1 = (i + 1) * dx - 8 * s, y = -82 * s;
    for (let x = x0; x < x1; x += 9) ch += c.ribbon(c.arc(x + 4, y + Math.sin(((x - x0) / (x1 - x0)) * PI) * 10, 5, 3, 0, PI * 2, 8), 1.6);
  }
  return out + `<path d="${ch}" fill="${C.rock3}"/>`;
}
/* ================================================================== Nazareth */
/** Mary holding the Child in her arms (arm-local, for holdF with armF ≈ 70) */
export const childInArms = (c) => `<g transform="rotate(-70) translate(-14 12) scale(.9)">${babyCut(c)}</g>`;
/** outside stairs up to a flat roof (origin: foot of the stairs, rising to the left, to the roof at -h) */
export function roofStairs(c, h = 150, w = 90, col = C.plaster2) {
  const s = sheet();
  const n = 7;
  const pts = [[0, 0]];
  for (let i = 0; i < n; i++) { const x = -(w * (i + 1)) / n, y = -(h * (i + 1)) / n; pts.push([x + w / n, y], [x, y]); }
  pts.push([-w, 0]);
  s.p(c.cut(pts, 0.4, 5), col);
  return s.out();
}
/** a low parapet along a flat roof, and a sleeping mat (origin: roof level, left end; w long) */
export function roofTop(c, w = 240, col = C.plaster) {
  return sheet().p(c.cut([[0, 0], [0, -16], [10, -18], [10, -4], [w - 10, -4], [w - 10, -18], [w, -16], [w, 0]], 0.4, 6), shade(col, -0.04)).out();
}
/**
 * The street of Nazareth: Joseph's house on the left (a flat roof, his workbench before it),
 * Mary's on the right. Returns { sk, starL, J, M, GY, P (layer for people), front, NC } — J/M: { x, w, h, doorX, inside, leaf, shut, winX, winY }.
 * k: how far the colours are tinted toward night (0 day … 0.5 night).
 */
export const GY = 706;
export function nazarethSet(S, skyCols, { k = 0, NC = NIGHT[1], starsOn = false, bench = true } = {}) {
  const c = S.c;
  const T = (m, f = 1) => tintM(m, NC, k * f);
  const sk = skyK(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(starsN(c, { x0: -1000, x1: 2600, y0: -900, y1: 470, n: 160 }));
  starL.fade(starsOn ? 1 : 0);
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const far = S.layer({ par: 0.07, sh: 2 });
  const ffn = c.wave(540, [16, 7, 3], [900, 320, 120]);
  far.add(T(sheet().p(c.ridge(ffn, -1200, 2800, 1900, 12, 1), mix(C.hillFar, C.hillMid, 0.3)).out() + townN(c, { x: 800, y: ffn(800) + 16, n: 9, spread: 600, sc: 0.46 }) + cypressN(c, 230, ffn(230) + 8, 90) + cypressN(c, 1330, ffn(1330) + 8, 110), 1.1));
  const mid = S.layer({ par: 0.14, sh: 3 });
  mid.add(T(sheet().p(c.ridge(c.wave(610, [10, 4], [700, 220]), -1200, 2800, 1900, 12, 1), mix(C.hillMid, C.sand, 0.3)).out() + oliveN(c, 700, 620, 0.8) + oliveN(c, 1500, 626, 0.9) + oliveN(c, 60, 626, 0.9)));
  const H = S.layer({ par: 0.3, sh: 4 });
  const mk = (x, w, h, wall) => {
    const d = doorHouse(c, { w, h, wall: T(wall), shadow: T(C.plaster2), roof: T(C.roof), dw: 46, dh: 80 });
    H.add(`<g transform="translate(${x} ${GY})">${d.wall}</g>`);
    const inside = H.add(`<g transform="translate(${x} ${GY})">${d.inside}</g>`);
    const leaf = H.add(`<g>${T(d.leaf, 0.6)}</g>`);
    const shut = H.add(`<g>${T(d.shutter, 0.6)}</g>`);
    return { x, w, h, d, inside, leaf, shut, doorX: x + d.door[0] + d.door[1] / 2, doorL: x + d.door[0], winX: x + d.win[0], winY: GY + d.win[1] };
  };
  // Joseph's house: roof at GY - 170, stairs on its right side
  const J = mk(350, 214, 170, C.plaster);
  H.add(T(`<g transform="translate(350 ${GY - 170})">${roofTop(c, 214)}</g>`));
  const M = mk(996, 180, 150, mix(C.plaster, C.peach, 0.3));
  // the workbench before Joseph's house
  if (bench) H.add(T(`<g transform="translate(724 ${GY + 4})">${wbench(c, 150)}</g>`));
  const road = S.layer({ par: 0.3, sh: 3 });
  road.add(T(sheet().p(c.ridge(c.wave(GY - 2, [2, 1], [500, 140]), -1200, 2800, 1900, 12, 0.8), mix(C.sand2, C.sand, 0.4)).out()));
  const G = S.layer({ par: 0.3, sh: 1, flat: true });     // light behind the people
  const P = S.layer({ par: 0.3, sh: 5 });
  return { sk, starL, hangL, J, M, GY, H, G, P, NC, T };
}
/** open / close a house's door (0 shut … 1 open) and light its door and window */
export function houseLight(h, { open = 0, lit = 0, shut = 0 } = {}) {
  pose(h.leaf, { x: h.doorL, y: GY, sx: Math.max(0.1, 1 - open * 0.88), o: 1 });
  fade(h.inside, lit);
  pose(h.shut, { x: h.winX, y: h.winY, sx: Math.max(0.001, shut), o: shut > 0.01 ? 1 : 0 });
}
/** a cloud-shaped dream / thought frame (origin centre), w × h, with a few trailing puffs toward (tx, ty) */
export function dreamCloud(c, w = 300, h = 190, { fill = mix(C.skyVeil, C.cream, 0.5), tx = 0, ty = 0 } = {}) {
  const s = sheet();
  const pts = [], n = 11;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2, a2 = ((i + 1) / n) * PI * 2;
    const x1 = Math.cos(a) * w / 2, y1 = Math.sin(a) * h / 2, x2 = Math.cos(a2) * w / 2, y2 = Math.sin(a2) * h / 2;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, an = Math.atan2(my, mx);
    pts.push(...c.qbez([x1, y1], [mx + Math.cos(an) * 26, my + Math.sin(an) * 22], [x2, y2], 6).slice(0, -1));
  }
  s.p(c.cut(pts, 0.4, 6), fill);
  if (tx || ty) [0.35, 0.62, 0.84].forEach((u, i) => { s.p(c.cut(c.circ(tx * u, h / 2 * (1 - u) + ty * u, 13 - i * 3.5, 12), 0.2, 3), fill); });
  return s.out();
}
export { tr, clamp, lerp, seg, es, ease, bump, fade };
