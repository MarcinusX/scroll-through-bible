// John 15 — the cut-outs of the chapter. The farewell discourse goes on at night on the way down to the Kidron:
// a moonlit terraced vineyard on the slope outside Jerusalem, the eleven with their lanterns. The great image is the
// true vine — a luminous paper vine that grows from behind Jesus, its branches reaching out over every disciple
// (each branch can grow, carry glowing sap, bear green or ripe grapes, wither and be lifted away). The Father is
// never a figure: only light from above, a hand of light, a pruning hook of light.
// Everything returns SVG markup (origin noted), cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, sky, hanging, lerp, blinkAt } from '../kit.js';
import { band, grass, rock, moon, stars, olive, cypress } from '../../assets/nature.js';
import { fade, attr, clamp } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { LOOK as L3 } from '../mark3/lib.js';
import { walledCity } from '../mark1/lib.js';
import { grapeBunch, vineStock, stoneWall } from '../mark12/lib.js';
import { tint } from '../mark13/lib.js';
import { lanternHeld } from '../john10/lib.js';

export { kf, moving, wordSlip, scrollOpen } from '../mark2/lib.js';
export { nameTag, strip, bubble, heart, shadowPerson, silhouette, withFace, faceBits, question, sparkle as sparkle3 } from '../mark3/lib.js';
export { dove, flapWings, voiceRings, sparkle, flame, hang2 } from '../mark1/lib.js';
export { storyFrame, SEPIA } from '../mark6/lib.js';
export { vis, chalice, cupOfLight, firePit, fireFlames, wordTag } from '../mark14/lib.js';
export { lightHand, sealedScroll, workPlate, shadowHand, polyAt, polyLen, lanternHeld } from '../john10/lib.js';
export { radiance, rayBurst, glowDisc, threads, hungWord, hungPlate, hungGold, goldWord, eternityRing, drawRing, darkSheet, iconWord } from '../john1/lib.js';
export { iAm, lightPath, drawPath, framed } from '../john8/lib.js';
export { windStroke } from '../john3/lib.js';
export { grapeBunch, vineStock, stoneWall, tint, walledCity, crowdPerson as crowdPersonOpts };
export { tr, sky, hanging, pose, sheet, shade, mix, C, CAST, person, lerp, blinkAt, attr, fade };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const DY = { stand: 0, kneel: 46, sit: 62 };
/** the parallax plane of the terrace, the vine and the people */
export const P = 0.45;

/* ================================================================== skies */
export const NIGHT = ['#20264f', '#373c6d', '#5d5a85'];      // the moonlit vineyard
export const COLD = ['#141834', '#212a50', '#344068'];       // the world's cold wind
export const WARMNIGHT = ['#262a58', '#4c4a7e', '#8b7596'];  // love, joy — a warmer night
export const HOPE = ['#2a3264', '#5a5f94', '#b394a2'];       // the Counsellor comes: the horizon warms

export const JESUS = CAST.jesus;
export const GOLD_L = '#fff3cf';
const N = (col, k = 0.45) => mix(col, C.indigo, k);          // the night tint of the set

/* ================================================================== the eleven */
const LOOKS = { peter: CAST.peter, andrew: CAST.andrew, james: CAST.james, john: CAST.john, matthew: CAST.matthew, thomas: CAST.thomas, philip: L3.philip, nathanael: L3.bartholomew, jamesA: L3.jamesA, thaddaeus: L3.thaddaeus, simonZ: L3.simonZ };
const NAMES = {
  peter: ['Piotr', 'Peter'], andrew: ['Andrzej', 'Andrew'], james: ['Jakub', 'James'], john: ['Jan', 'John'], matthew: ['Mateusz', 'Matthew'],
  thomas: ['Tomasz', 'Thomas'], philip: ['Filip', 'Philip'], nathanael: ['Natanael', 'Nathanael'], jamesA: ['Jakub Mł.', 'James the Less'],
  thaddaeus: ['Juda Tadeusz', 'Jude'], simonZ: ['Szymon', 'Simon'],
};
export const nameOf = (k) => tr(NAMES[k][0], NAMES[k][1]);
/** where the eleven stand round Jesus (x 800): a back row of five, a front row of six; feet y, scale, facing */
export const SPOTS = {
  philip: [505, 648, 0.78], nathanael: [610, 648, 0.78], simonZ: [712, 648, 0.78], jamesA: [990, 648, 0.78], thaddaeus: [1095, 648, 0.78],
  andrew: [452, 706, 0.9], peter: [560, 706, 0.9], john: [668, 706, 0.9], james: [935, 706, 0.9], thomas: [1042, 706, 0.9], matthew: [1150, 706, 0.9],
};
export const ORDER = ['philip', 'nathanael', 'simonZ', 'jamesA', 'thaddaeus', 'andrew', 'peter', 'john', 'james', 'thomas', 'matthew'];
export const LAMPS = ['peter', 'john', 'thomas', 'philip', 'james', 'simonZ'];
export const headOf = (m, lift = 0, sit = false) => [m.x + (m.flip ? -2 : 2) * m.s, m.y - (sit ? 105 : 167) * m.s - lift];

/**
 * The eleven as puppets in layer L (back row first). Lantern bearers hold a lamp in the back hand; placeM keeps it upright.
 * Returns [{ k, x, y, s, flip, p, lampU, glow, seed, name }]
 */
export function eleven(S, L, { lamps = LAMPS, only = ORDER, extra = {} } = {}) {
  const c = makeCutter('j15-eleven');
  return ORDER.filter((k) => only.includes(k)).map((k, i) => {
    const [x0, y, s] = SPOTS[k];
    const x = S.portrait ? 800 + (x0 - 800) * 0.85 : x0;   // phone: the outer disciples stand inside the screen
    const holdB = lamps.includes(k) ? `<g class="lampU">${lanternHeld(c, 0)}</g>` : '';
    const el = L.add(person(c, { ...LOOKS[k], holdB, ...(extra[k] || {}) }));
    return { k, i, x, y, s, flip: x > 800, p: S.puppet(el), el, lampU: el.querySelector('.lampU'), glow: el.querySelector('.lampU .glow'), seed: c.rr(0, 9), name: nameOf(k), o: LOOKS[k] };
  });
}
export const LAMP_A = 58;
/** set a disciple; a lantern stays upright whatever the back arm does */
export function placeM(m, T, o = {}) {
  const armB = o.armB ?? (m.lampU ? LAMP_A : 0);
  m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, blink: blinkAt(T, m.seed), ...o, armB });
  if (m.lampU) attr(m.lampU, 'transform', `rotate(${armB.toFixed(1)})`);
}
export function lampK(m, k) { if (m.glow) fade(m.glow, k); }

/* ================================================================== the vineyard at night */
/**
 * The terraced vineyard on the slope outside the city, by moonlight: Jerusalem on its hill across the Kidron (left),
 * terraces of vines stepping down, our terrace with a low stone wall behind the people. Layers: sky, stars, moon,
 * far (city), terraces, ground. Call .front() after the people for the foreground vines.
 * Returns { sk, starL, hangL, moonEl, far, ground, GY, front(), update(T, { moonY }) }.
 */
export function vineyardNight(S, { skyCols = NIGHT, moonAt = [1180, 150], city = true, starsN = 110 } = {}) {
  const c = makeCutter('j15-vineyard');
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -800, x1: 2400, y0: -700, y1: 400, n: starsN }));
  const hangL = S.layer({ par: 0.05, sh: 4 });
  if (S.portrait) moonAt = [Math.min(moonAt[0], 1050), moonAt[1] - 120];   // phone: the moon whole, inside the right edge, clear of the hung words
  const moonEl = hanging(hangL, `<circle r="130" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 40)}`, { x: moonAt[0], y: moonAt[1], len: 700 });

  const far = S.layer({ par: 0.08, sh: 2 });
  const h1 = band(c, { y: 432, amps: [26, 9, 3], lens: [1300, 420, 140], color: N(C.hillFar, 0.58) });
  far.add(h1.markup);
  if (city) {
    const cy = h1.fn(330) + 12;
    far.add(walledCity(c, 330, cy, 1.05, { wall: N(C.stone, 0.5), wall2: N(C.stone2, 0.55), temple: N(C.cream, 0.4) }));
    let lit = '';
    for (let i = 0; i < 14; i++) lit += c.poly(c.rect(c.rr(230, 440), c.rr(cy - 44, cy - 6), 3, 4));
    far.add(`<path d="${lit}" fill="${C.lampFlame}" opacity=".85"/>`);
  }
  // the Kidron valley below, dark, with a line of olive trees (the garden across the brook)
  const val = S.layer({ par: 0.12, sh: 2 });
  const h2 = band(c, { y: 470, amps: [8, 4, 2], lens: [900, 300, 120], color: N(C.hillMid, 0.62) });
  val.add(h2.markup);
  const OLf = { trunk: N(C.wood2, 0.5), leaf: N(C.olive, 0.5), leaf2: N(C.sage, 0.5) };
  let olv = '';
  for (let x = -300; x < 1900; x += c.rr(90, 150)) olv += olive(c, x, h2.fn(x) + 16, c.rr(0.34, 0.46), OLf);
  val.add(olv);
  // our slope: terraces stepping down, each with a stone lip and a row of vines
  const ter = S.layer({ par: 0.24, sh: 3 });
  const tcol = [N(mix(C.hillNear, C.sand, 0.3), 0.5), N(mix(C.hillNear, C.sand, 0.3), 0.44)];
  [[512, 0.42, 0], [556, 0.52, 1]].forEach(([y, sc, j]) => {
    const fn = c.wave(y, [4, 2], [700, 220]);
    ter.add(sheet().p(c.ridge(fn, -900, 2500, 1700, 14, 0.8), tcol[j]).x(c.ribbon([[-900, y + 6], [2500, y + 6]], 3), N(C.rock2, 0.4), 'opacity=".6"').out());
    let row = '';
    for (let x = -700 + j * 40; x < 2300; x += 62 + j * 10) row += `<g transform="translate(${x.toFixed(0)} ${fn(x).toFixed(0)}) scale(${sc})">${vineStock(c, 96)}</g>`;
    ter.add(tint(row, C.indigo, 0.42 - j * 0.04));
  });
  // our terrace: the floor, a low wall behind the people, vines trained along it
  const ground = S.layer({ par: P, sh: 3 });
  const GY = 612;
  const gfn = c.wave(GY, [3, 1.5], [800, 200]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), N(mix(C.sand2, C.hillNear, 0.35), 0.4)).out());
  let wall = '';
  for (let x = -700; x < 2300; x += 128) wall += `<g transform="translate(${x} ${GY + 4})">${stoneWall(c, 132, 30, N(C.rock, 0.3))}</g>`;
  ground.add(wall);
  let wv = '';
  for (let x = -640; x < 2300; x += 150) if (Math.abs(x - 800) > 120) wv += `<g transform="translate(${x} ${GY - 18}) scale(.72)">${vineStock(c, 96)}</g>`;
  ground.add(tint(wv, C.indigo, 0.34));
  ground.add(grass(c, { x0: -600, x1: 2200, y: GY + 10, fn: (x) => gfn(x) + 10, n: 40, h: 12, color: N(C.moss, 0.4) }));
  if (S.portrait) {
    // phone: much more of the floor shows, and the straight-edged patch reads as a slab — a trodden path instead,
    // winding down the terrace from under their feet
    const pl = [], pr = [];
    for (let i = 0; i <= 32; i++) { const u = i / 32, y = 716 + u * 984, mx = 800 + Math.sin(u * 5.2) * 50 * u, w = 64 + u * 330; pl.push([mx - w, y]); pr.push([mx + w, y]); }
    ground.add(`<path d="${c.cut([...pl, ...pr.reverse()], 1.6, 14)}" fill="${N(C.sand, 0.36)}" opacity=".55"/>`);
  } else
  ground.add(`<path d="${c.cut([[520, 760], [1080, 760], [1180, 1700], [420, 1700]], 1, 14)}" fill="${N(C.sand, 0.36)}" opacity=".55"/>`);

  return {
    c, sk, starL, hangL, moonEl, far, ground, GY,
    front({ par = 0.9 } = {}) {
      const fg = S.layer({ par, sh: 7 });
      const big = (x, y, sc, fl) => `<g transform="translate(${x} ${y}) scale(${fl ? -sc : sc} ${sc})">${vineStock(c, 110)}</g>`;
      let m = big(210, 1010, 3.1, false) + big(1420, 1016, 3.2, true) + big(-40, 980, 2.4, true) + big(1680, 990, 2.6, false);
      fg.add(tint(m, C.night2, 0.42));
      fg.add(rock(c, 1350, 1000, 260, 90, N(C.rock2, 0.38)) + rock(c, 330, 1010, 200, 70, N(C.rock, 0.4)));
      return fg;
    },
    update(T, { moonY = moonAt[1], moonO = 1 } = {}) {
      pose(moonEl, { x: moonAt[0], y: moonY, r: T ? Math.sin(T * 0.6) * 1.1 : 0, oy: 0, o: moonO });
    },
  };
}

/* ================================================================== the true vine */
const WOOD = mix(C.wood2, C.soilDark, 0.18), WOOD2 = mix(C.wood, C.wood3, 0.4), RIM = C.haloRim;
const LEAF = C.leaf, LEAF2 = C.moss, LEAF_RIM = mix(C.halo, C.wheatGreen, 0.35);
export const GRAPE = mix(C.plumRobe, C.mauve, 0.25), GRAPE_G = mix(C.wheatGreen, C.sage3, 0.15);
/** a bunch of grapes (origin: the stem at the top), each grape with a highlight */
export function bunch(c, r = 5, col = GRAPE) {
  const rows = [5, 4, 4, 3, 2, 1];
  let d = '', hi = '', dk = '';
  rows.forEach((n, row) => { for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * r * 1.75 + (row % 2 ? r * 0.2 : 0), y = r + 2 + row * r * 1.5; d += c.cut(c.circ(x, y, r, 9), 0.15, 2); hi += c.poly(c.circ(x - r * 0.35, y - r * 0.35, r * 0.28, 6)); dk += c.poly(c.arc(x, y, r * 0.95, r * 0.95, 0.2, PI - 0.2, 5)); } });
  return sheet().p(c.ribbon([[0, 3], [1, -7]], 2), C.moss2).p(d, col).x(dk, shade(col, -0.25), 'opacity=".35"').x(hi, shade(col, 0.55), 'opacity=".8"').out();
}
const DEAD = mix(C.rock2, C.stone2, 0.45), DEAD_LEAF = mix(C.wood3, C.rock2, 0.4);

/** a five-lobed grape leaf with a gold-lit rim (origin centre, stem notch at the bottom) */
function leafPts(r, a) {
  const pts = [], n = 44;
  for (let i = 0; i < n; i++) {
    const th = (i / n) * PI * 2;
    const lobe = 0.62 + 0.38 * Math.pow(Math.abs(Math.cos(2.5 * (th - PI * 1.5))), 0.7);
    const d = Math.atan2(Math.sin(th - PI / 2), Math.cos(th - PI / 2));
    const notch = 1 - 0.6 * Math.exp(-((d / 0.26) ** 2));
    const rr = r * lobe * notch;
    pts.push([Math.cos(th + a) * rr, Math.sin(th + a) * rr * 0.94]);
  }
  return pts;
}
export function vineLeaf(c, r = 14, { col = LEAF, rim = LEAF_RIM, rot } = {}) {
  const a = rot ?? c.rr(-0.5, 0.5);
  const P = leafPts(r, a);
  const vein = [1.5, 1.08, 1.92, 0.62, 2.38].map((k) => { const th = PI * k + a; return c.ribbon([[Math.cos(PI / 2 + a) * r * 0.25, Math.sin(PI / 2 + a) * r * 0.25], [Math.cos(th) * r * 0.72, Math.sin(th) * r * 0.72]], 0.9); }).join('');
  return sheet().p(c.cut(leafPts(r * 1.12, a), 0.4, 3), rim).p(c.cut(P, 0.35, 3), col).x(vein, shade(col, -0.25), 'opacity=".55"').out();
}
/** a curled dry leaf (origin centre) */
function deadLeaf(c, r = 10) {
  return c.cut(c.blob(0, 0, r * 0.9, r * 0.55, 8, 0.35), 0.8, 3);
}
/** a tendril curl, drawn from (0,0) */
function tendril(c, dir = 1, r = 9) {
  return c.ribbon([[0, 0], [dir * 6, -6], ...c.arc(dir * 12, -10, r * 0.6, r * 0.6, dir > 0 ? PI : 0, dir > 0 ? PI * 3 : -PI * 2, 14)], 1.4);
}
/** a curve of the vine as points + a pathLength-1 "sap" path along them */
const dOf = (pts) => pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join('');
function sapPaths(pts, w = 2) {
  const d = dOf(pts);
  return `<path class="sapG" d="${d}" pathLength="1" stroke="${C.halo}" stroke-width="${w * 2.6}" stroke-linecap="round" fill="none" opacity=".3" stroke-dasharray="1 1" stroke-dashoffset="1"/>` +
    `<path class="sap" d="${d}" pathLength="1" stroke="${GOLD_L}" stroke-width="${w}" stroke-linecap="round" fill="none" stroke-dasharray="1 1" stroke-dashoffset="1"/>`;
}
/** wood as n growth segments (each carries data-u), plus a gold rim line */
function woodSegs(c, pts, width, n = 8, col = WOOD) {
  let out = '';
  const m = pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = Math.floor((i / n) * m), b = Math.min(m, Math.ceil(((i + 1) / n) * m) + 1);
    const sub = pts.slice(a, b + 1);
    const w0 = typeof width === 'function' ? width : () => width;
    const d = c.ribbon(sub, (u) => w0((a + u * (sub.length - 1)) / m), 0.6);
    const rim = c.ribbon(sub.map(([x, y]) => [x - 1.2, y - 2]), (u) => Math.max(1, w0((a + u * (sub.length - 1)) / m) * 0.18));
    out += `<g data-u="${(i / n).toFixed(3)}"><path d="${d}" fill="${col}"/><path d="${rim}" fill="${RIM}" opacity=".55"/></g>`;
  }
  return out;
}
/** reveal a growing piece (k 0→1): every [data-u] part fades in, [data-lx] leaves pop from their stem */
export function growIn(el, k) {
  if (!el) return;
  const parts = el.__gp || (el.__gp = Array.from(el.querySelectorAll('[data-u]')).map((p) => ({ p, u: +p.dataset.u, lx: p.dataset.lx, ly: p.dataset.ly, r: p.dataset.r || 0 })));
  parts.forEach((q) => {
    const a = clamp((k * 1.12 - q.u) * 9);
    if (q.lx !== undefined) attr(q.p, 'transform', `translate(${q.lx} ${q.ly}) rotate(${q.r}) scale(${a.toFixed(2)})`);
    else attr(q.p, 'opacity', a);
  });
}

/**
 * One branch (latorośl): origin at its joint on the vine, reaching to the tip (dx, dy) where a bunch of grapes hangs.
 * Parts: .live (growing wood + leaves), .dead (the same branch withered, grey), sap paths, .fr fruit (green + ripe).
 * Use branchRig(el).set({ x, y, r, s, o, grow, sap, fruit, ripe, dry }).
 */
export function vineBranch(c, dx, dy, { leaves = 3, w = 7, k } = {}) {
  const dir = Math.sign(dx) || 1;
  const pts = c.cbez([0, 0], [dx * 0.3, -22], [dx * 0.9, dy * 0.15], [dx, dy], 18);
  const width = (u) => w * (1 - u * 0.55);
  let live = woodSegs(c, pts, width, 7);
  const at = (u) => pts[Math.min(pts.length - 1, Math.round(u * (pts.length - 1)))];
  const us = [0.3, 0.55, 0.8, 0.42, 0.68].slice(0, leaves);
  us.forEach((u, i) => {
    const [x, y] = at(u), side = i % 2 ? 1 : -1;
    const lx = x + side * 4, ly = y - 12 - (i % 2) * 4;
    live += `<g data-u="${u}" data-lx="${lx.toFixed(1)}" data-ly="${ly.toFixed(1)}" data-r="${(side * 10).toFixed(0)}" transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)}) scale(0)">${vineLeaf(c, c.rr(12, 16), { col: i % 2 ? LEAF : LEAF2 })}</g>`;
  });
  const [tx, ty] = at(0.62);
  live += `<g data-u=".62"><path d="${tendril(c, dir, 9)}" transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)})" fill="${mix(LEAF, C.wheatGreen, 0.4)}"/></g>`;
  // the same branch, dead
  const ds = sheet();
  ds.p(c.ribbon(pts, (u) => width(u) * 0.8, 0.8), DEAD);
  let dl = '';
  us.forEach((u, i) => { const [x, y] = at(u); dl += `<path d="${deadLeaf(c, 9)}" transform="translate(${(x + (i % 2 ? 5 : -5)).toFixed(1)} ${(y - 6).toFixed(1)}) rotate(${c.rr(-40, 40).toFixed(0)})"/>`; });
  const dead = `${ds.out()}<g fill="${DEAD_LEAF}">${dl}</g>`;
  const fruit = `<g class="fr" transform="translate(${dx} ${dy}) scale(0)"><g class="gG">${bunch(c, 4.4, GRAPE_G)}</g><g class="gR" opacity="0"><circle cy="18" r="30" fill="url(#halo-glow)" opacity=".5"/>${bunch(c, 5, GRAPE)}</g></g>`;
  return `<g${k ? ` data-k="${k}"` : ''} data-tx="${dx}" data-ty="${dy}"><g class="live">${live}</g><g class="dead" opacity="0">${dead}</g>${sapPaths(pts)}${fruit}</g>`;
}
/** controller for a vineBranch / vineTrunk / vineArm element */
export function branchRig(el, pts) {
  const q = (s) => el.querySelector(s);
  const live = q('.live'), dead = q('.dead'), sapG = q('.sapG'), sap = q('.sap'), fr = q('.fr'), gG = q('.gG'), gR = q('.gR');
  const tx = +el.dataset.tx || 0, ty = +el.dataset.ty || 0;
  const rig = {
    el, pts, tx, ty,
    set({ x = 0, y = 0, r = 0, s = 1, o = 1, grow = 1, sap: k = 0, fruit = 0, ripe = 0, dry = 0 } = {}) {
      pose(el, { x, y, r, s, o });
      if (o <= 0.005) return;
      growIn(live, grow);
      fade(live, 1 - dry);
      if (dead) fade(dead, dry);
      attr(sap, 'stroke-dashoffset', 1 - k); attr(sapG, 'stroke-dashoffset', 1 - k);
      fade(sap, k > 0.002 ? 1 - dry : 0); fade(sapG, k > 0.002 ? 0.3 * (1 - dry) : 0);
      if (fr) {
        attr(fr, 'transform', `translate(${tx} ${ty}) scale(${fruit.toFixed(3)})`);
        fade(gR, ripe); fade(gG, 1 - ripe * 0.95);
      }
    },
  };
  return rig;
}

/** the trunk: gnarled, two strands twisting up from the root (origin) to the crown (0, -h); gold rims, sap inside */
export function vineTrunk(c, h = 330) {
  const s1 = c.cbez([0, 0], [-26, -h * 0.3], [24, -h * 0.62], [0, -h], 24);
  const s2 = c.cbez([6, 0], [30, -h * 0.34], [-22, -h * 0.66], [2, -h], 24);
  let out = '';
  // roots
  const rs = sheet();
  rs.p(c.ribbon([[-6, -6], [-30, 4], [-52, 10]], (u) => 10 - u * 7) + c.ribbon([[6, -6], [34, 3], [58, 12]], (u) => 10 - u * 7) + c.ribbon([[0, -4], [4, 12]], 8), WOOD);
  out += `<g data-u="0">${rs.out()}</g>`;
  out += woodSegs(c, s1, (u) => 28 - u * 12, 10, WOOD) + woodSegs(c, s2, (u) => 19 - u * 8, 10, WOOD2);
  // bark lines
  let bark = '';
  for (let i = 0; i < 12; i++) { const y = -h * (0.05 + i * 0.075); bark += c.ribbon([[-8, y], [c.rr(-2, 4), y - c.rr(8, 16)]], 1.2); }
  out += `<g data-u=".5"><path d="${bark}" fill="${shade(WOOD, -0.25)}" opacity=".6"/></g>`;
  // a crown of leaves at the top
  let crown = '';
  for (let i = 0; i < 9; i++) {
    const a = PI + (i / 8) * PI, lx = Math.cos(a) * c.rr(26, 48), ly = -h - 6 + Math.sin(a) * c.rr(18, 34);
    crown += `<g data-u="${(0.82 + i * 0.015).toFixed(3)}" data-lx="${lx.toFixed(1)}" data-ly="${ly.toFixed(1)}" data-r="0" transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)}) scale(0)">${vineLeaf(c, c.rr(15, 20), { col: i % 2 ? LEAF : LEAF2 })}</g>`;
  }
  const pts = c.cbez([3, 0], [2, -h * 0.3], [0, -h * 0.66], [1, -h], 16);
  return { markup: `<g><g class="live">${out}${crown}</g>${sapPaths(pts, 3.4)}</g>`, pts };
}
/** one arm of the vine along a trellis (origin at the crown, reaching to (dx, dy)); leaves and tendrils along it */
export function vineArm(c, dx, dy) {
  const dir = Math.sign(dx);
  const pts = c.cbez([0, 0], [dx * 0.3, -44], [dx * 0.66, dy + 28], [dx, dy], 30);
  let out = woodSegs(c, pts, (u) => 13 - u * 8, 12, WOOD);
  for (let i = 0; i < 9; i++) {
    const u = 0.08 + i * 0.105, [x, y] = pts[Math.round(u * 30)];
    const lx = x + c.rr(-8, 8), ly = y - c.rr(8, 18);
    out += `<g data-u="${u.toFixed(3)}" data-lx="${lx.toFixed(1)}" data-ly="${ly.toFixed(1)}" data-r="0" transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)}) scale(0)">${vineLeaf(c, c.rr(13, 18), { col: i % 2 ? LEAF : LEAF2 })}</g>`;
    if (i % 3 === 1) out += `<g data-u="${(u + 0.03).toFixed(3)}"><path d="${tendril(c, dir, 8)}" transform="translate(${x.toFixed(1)} ${(y - 4).toFixed(1)})" fill="${mix(LEAF, C.wheatGreen, 0.4)}"/></g>`;
  }
  return { markup: `<g><g class="live">${out}</g>${sapPaths(pts, 3)}</g>`, pts };
}

/**
 * The true vine, built into layer L: trunk from (cx, baseY) up to the crown (cx, crownY), two arms along the top,
 * and one branch per tip ({ x, y } in world coords, tip = where the grapes hang). Returns
 * { trunk, arms: [L, R], branches: [rig…], glow, crown: [x, y], armAt(side, x) }.
 */
export function greatVine(S, L, { cx = 800, baseY = 640, crownY = 292, tips = [], seed = 'vine', span = 400, glowL = null } = {}) {
  const c = makeCutter('j15-' + seed);
  const gl = (glowL || L).add(`<g><circle r="330" fill="url(#halo-glow)" opacity=".75"/><circle r="140" fill="url(#warm-glow)" opacity=".5"/></g>`);
  const T = vineTrunk(c, baseY - crownY);
  const trunkEl = L.add(T.markup);
  const trunk = branchRig(trunkEl, T.pts.map(([x, y]) => [x + cx, y + baseY]));
  const arms = [-1, 1].map((d) => {
    const A = vineArm(c, d * span, 36);
    const el = L.add(A.markup);
    return branchRig(el, A.pts.map(([x, y]) => [x + cx, y + crownY]));
  });
  const armAt = (d, x) => {
    const P = arms[d < 0 ? 0 : 1].pts;
    let best = P[0];
    P.forEach((p) => { if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p; });
    return best;
  };
  const branches = tips.map((tp, i) => {
    const d = tp.x < cx ? -1 : 1;
    const [sx, sy] = armAt(d, tp.x - d * (tp.back ? 34 : 52));
    const dx = tp.x - sx, dy = tp.y - sy;
    const el = L.add(vineBranch(c, dx, dy, { leaves: 3, w: tp.back ? 6 : 7 }));
    const rig = branchRig(el, c.cbez([0, 0], [dx * 0.3, -22], [dx * 0.9, dy * 0.15], [dx, dy], 18).map(([x, y]) => [x + sx, y + sy]));
    rig.sx = sx; rig.sy = sy; rig.k = tp.k; rig.i = i; rig.tip = [tp.x, tp.y];
    return rig;
  });
  return {
    c, trunk, arms, branches, glow: gl, crown: [cx, crownY], armAt,
    /** set the whole vine; per-branch overrides via fn(i, branch) → partial props */
    set({ o = 1, grow = 1, sap = 0, fruit = 0, ripe = 0, glow = 0, T = 0 } = {}, per) {
      pose(gl, { x: cx, y: crownY + 20, s: 1 + (T ? Math.sin(T * 1.1) * 0.02 : 0), o: glow * o });
      const g3 = [clamp(grow / 0.4), clamp((grow - 0.3) / 0.35), clamp((grow - 0.55) / 0.45)];
      const s3 = [clamp(sap / 0.35), clamp((sap - 0.3) / 0.3), clamp((sap - 0.55) / 0.45)];
      trunk.set({ x: cx, y: baseY, o, grow: g3[0], sap: s3[0] });
      arms.forEach((a) => a.set({ x: cx, y: crownY, o, grow: g3[1], sap: s3[1] }));
      branches.forEach((b, i) => {
        const p = { x: b.sx, y: b.sy, o, grow: g3[2], sap: s3[2], fruit, ripe, ...(per ? per(i, b) : {}) };
        b.set(p);
      });
    },
  };
}
/** tips for the vine above the eleven (one per disciple, in ORDER) */
export function tipsFor(ms, lift = 62) {
  return ms.map((m) => { const [hx, hy] = headOf(m); return { x: hx + (m.x < 800 ? -6 : 6), y: hy - lift, k: m.k, back: m.s < 0.85 }; });
}

/** little beads of light that run along the branches while the sap flows; returns fn(T, o, per?) */
export function sapBeads(L, rigs, n = 2) {
  const beads = [];
  rigs.forEach((r, i) => { for (let j = 0; j < n; j++) beads.push({ r, j, el: L.add(`<g><circle r="10" fill="url(#warm-glow)"/><circle r="2.6" fill="${C.star}"/></g>`), ph: (i * 0.37 + j / n) % 1 }); });
  return (T, o = 1, per) => {
    beads.forEach((b) => {
      const oo = o * (per ? per(b.r) : 1);
      if (oo <= 0.01) { fade(b.el, 0); return; }
      const u = T ? (T * 0.32 + b.ph) % 1 : (b.j + 0.5) / n;
      const P = b.r.pts, idx = u * (P.length - 1), i0 = Math.floor(idx), f = idx - i0, a = P[i0], z = P[Math.min(P.length - 1, i0 + 1)];
      const off = b.r.sx !== undefined ? [0, 0] : [0, 0];
      pose(b.el, { x: a[0] + (z[0] - a[0]) * f + off[0], y: a[1] + (z[1] - a[1]) * f + off[1], o: oo * Math.sin(u * PI) });
    });
  };
}

/* ================================================================== the vinedresser's light */
/** a pruning hook (the vinedresser's knife) cut from gold light; origin at the grip, blade to +x curling down */
export function pruneHook(c, len = 64) {
  const s = sheet();
  s.p(c.ribbon([[-34, 0], [4, 0]], 9), mix(C.halo, C.wood3, 0.3));
  const blade = [...c.arc(len * 0.55, 14, len * 0.5, 26, PI * 1.02, PI * 1.9, 12)];
  s.p(c.cut([[2, -4], ...blade.map(([x, y]) => [x, y - 3]), [len * 0.95, 20], ...blade.slice().reverse().map(([x, y]) => [x - 2, y + 5]), [2, 4]], 0.3, 4), C.halo);
  s.x(c.ribbon(blade.map(([x, y]) => [x, y - 2]), 1.2), GOLD_L);
  return `<circle cx="${len * 0.5}" cy="0" r="${len * 0.9}" fill="url(#halo-glow)" opacity=".8"/>${s.out()}`;
}
/** a small snipped shoot that falls (origin centre) */
export function shoot(c, col = mix(C.leaf, C.wheatGreen, 0.3)) {
  return sheet().p(c.ribbon([[-8, 4], [0, 0], [8, -6]], 2), mix(WOOD, C.wood3, 0.4)).p(c.cut(c.star(9, -8, 6, 4, 5, c.rr(0, 6)), 0.3, 2), col).out();
}
/** light pouring down from above (the Father's light): a soft cone; origin at the top. The cone keeps its slope
 *  (w0 → w1 over h) but runs on below h, so that its lower end never shows on a tall (portrait) screen */
export function lightCone(c, { w0: a0 = 60, w1: a1 = 360, h: h0 = 700, col = GOLD_L, o = 0.35, ext = 2.1 } = {}) {
  const w0 = a0, w1 = a0 + (a1 - a0) * ext, h = h0 * ext;
  return `<path d="${c.poly([[-w0, 0], [w0, 0], [w1, h], [-w1, h]])}" fill="${col}" opacity="${o}"/><path d="${c.poly([[-w0 * 0.5, 0], [w0 * 0.5, 0], [w1 * 0.45, h], [-w1 * 0.45, h]])}" fill="${col}" opacity="${o * 0.8}"/>`;
}

/* ================================================================== small things */
/** a little heart-shaped light (origin centre) */
export function heartLight(c, r = 12, col = C.jesusMantle) {
  const pts = [];
  for (let i = 0; i < 28; i++) { const t = (i / 28) * PI * 2; pts.push([16 * Math.sin(t) ** 3 * r / 16, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r / 16]); }
  return `<circle r="${r * 2.4}" fill="url(#warm-glow)" opacity=".8"/>${sheet().p(c.cut(pts, 0.3, 3), col).x(c.poly(c.circ(-r * 0.35, -r * 0.3, r * 0.22, 8)), '#fff4e6', 'opacity=".7"').out()}`;
}
/** a small clay cup (origin: the foot) with a wine level (.wine, scale sy from the bottom) */
export function clayCup(c, { col = C.pot, w = 16 } = {}) {
  const s = sheet();
  s.p(c.cut([[-w, -24], [w, -24], [w * 0.75, -8], [w * 0.3, -4], [w * 0.4, 0], [-w * 0.4, 0], [-w * 0.3, -4], [-w * 0.75, -8]], 0.3, 4), col);
  s.x(c.ribbon([[-w + 2, -21], [w - 2, -21]], 2), shade(col, 0.25), 'opacity=".6"');
  return s.out();
}
/** an apron of a servant (in the hold of nothing: drawn on the body, origin at the puppet's feet) */
export function apron(c, col = mix(C.stone, C.linen2, 0.4)) {
  return sheet().p(c.cut([[-24, -96], [24, -96], [30, -40], [26, -20], [-26, -20], [-30, -40]], 0.5, 6), col).x(c.ribbon([[-30, -96], [30, -96]], 4), shade(col, -0.2)).out();
}
/** a road into the distance (origin at its near end), for "go and bear fruit" — pts toward (dx, dy) */
export function roadStrip(c, dx, dy, w0 = 60, w1 = 10, col = N(C.sand, 0.3)) {
  const n = 14, L = [], R = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = dx * u + Math.sin(u * PI * 1.3) * dx * 0.12, y = dy * u, w = lerp(w0, w1, u) / 2;
    L.push([x - w, y]); R.push([x + w, y]);
  }
  return `<path d="${c.cut([...L, ...R.reverse()], 0.8, 8)}" fill="${col}"/>`;
}
/** a scroll of the Law, opened, with lines of text (origin centre); text lines drawn as [pl/en string] */
export function lawScroll(c, w = 380, h = 150, lines = []) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 2], [w / 2 + 2, h / 2], [-w / 2, h / 2 + 2]], 0.5, 8), C.parchment);
  s.p(c.cut(c.rect(-w / 2 - 16, -h / 2 - 12, 18, h + 24), 0.3, 6) + c.cut(c.rect(w / 2 - 2, -h / 2 - 12, 18, h + 24), 0.3, 6), shade(C.parchment, -0.14));
  s.p(c.cut(c.rect(-w / 2 - 11, -h / 2 - 24, 8, 12), 0.2, 3) + c.cut(c.rect(-w / 2 - 11, h / 2 + 12, 8, 12), 0.2, 3) + c.cut(c.rect(w / 2 + 3, -h / 2 - 24, 8, 12), 0.2, 3) + c.cut(c.rect(w / 2 + 3, h / 2 + 12, 8, 12), 0.2, 3), C.wood2);
  let ink = '';
  for (let i = 0; i < 6; i++) { const y = -h / 2 + 22 + i * 21; if (i === 3 || i === 4) continue; ink += c.ribbon([[-w / 2 + 26, y], [w / 2 - 26 - c.rr(0, 60), y + c.rr(-1, 1)]], 2.2); }
  s.x(ink, C.inkSoft, 'opacity=".35"');
  const txt = lines.map((l, i) => `<text class="lawLine" x="0" y="${(-h / 2 + 22 + (3 + i) * 21 + 6).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="21" font-style="italic" fill="${C.terracotta}">${l}</text>`).join('');
  return `${s.out()}${txt}`;
}
/** a lit shadow-play screen on a little wooden frame (origin: bottom centre); content goes in a clipped group */
export function screenFrame(S, { w = 440, h = 260, k = 'scr' } = {}) {
  const c = S.c;
  const id = S.id('clip-' + k);
  S.defs(`<clipPath id="${id}"><rect x="${-w / 2}" y="${-h - 30}" width="${w}" height="${h}"/></clipPath>`);
  const fr = sheet();
  fr.p(c.cut(c.rect(-w / 2 - 14, -h - 44, w + 28, h + 28), 0.6, 8), C.wood2);
  fr.p(c.cut(c.rect(-w / 2 - 6, -h - 36, 12, h + 36), 0.4, 6) + c.cut(c.rect(w / 2 - 6, -h - 36, 12, h + 36), 0.4, 6), C.wood);
  fr.p(c.cut(c.rect(-w / 2 - 20, -18, 12, 18), 0.3, 4) + c.cut(c.rect(w / 2 + 8, -18, 12, 18), 0.3, 4), C.wood2);
  const face = `<rect x="${-w / 2}" y="${-h - 30}" width="${w}" height="${h}" fill="${mix(C.lampGlow, C.cream, 0.45)}"/><circle cx="0" cy="${-h / 2 - 30}" r="${w * 0.55}" fill="url(#warm-glow)" opacity=".7"/>`;
  return { frame: fr.out(), face, clip: id, top: -h - 30, w, h };
}

/* ================================================================== stage helpers */
/** tuck the eleven's lanterns: gentle t-driven brightness for every lamp */
export function lampsAll(ms, k) { ms.forEach((m) => lampK(m, k)); }
export { clamp };

/**
 * The standing tableau used by most scenes: the vineyard, the true vine (optional), the eleven and Jesus in the middle.
 * Layers: set…, glow, vine, beads, chars. Add your own fx layers after, then call set.front().
 * Returns { set, vine, ms, jesus, chars, vineL, beadL, beads, JX, JY }.
 */
export function tableau(S, { skyCols = NIGHT, vine = true, lift = 66, city = true, lamps = LAMPS, beadsN = 0, before = null, pose: P0 = 'stand' } = {}) {
  const set = vineyardNight(S, { skyCols, city });
  const pre = before ? before(S, set) : null;
  const glowL = S.layer({ par: P, sh: 0, flat: true });
  const vineL = S.layer({ par: P, sh: 4 });
  const beadL = S.layer({ par: P, sh: 0, flat: true });
  const chars = S.layer({ par: P, sh: 5 });
  const ms = eleven(S, chars, { lamps, extra: P0 === 'stand' ? {} : Object.fromEntries(ORDER.map((k) => [k, { pose: P0 }])) });
  const v = vine ? greatVine(S, vineL, { tips: tipsFor(ms, lift), glowL }) : null;
  const beads = v && beadsN ? sapBeads(beadL, [v.trunk, ...v.arms, ...v.branches], beadsN) : null;
  const jesus = S.puppet(chars.add(person(makeCutter('j15-jesus'), { ...JESUS })));
  return { set, pre, vine: v, ms, jesus, chars, vineL, beadL, glowL, beads, JX: 800, JY: 706 };
}

/** two open hands, palms up and empty (origin centre, ~120 wide): two cupped paper hands side by side */
export function emptyHands(c, skin = C.skin2) {
  const one = lightHandL(c, { w: 260, col: skin, rim: shade(skin, -0.18) }).replace(/<circle[^>]*halo-glow[^>]*\/>/, '');
  let dust = '';
  for (let i = 0; i < 6; i++) dust += c.cut(c.blob(c.rr(-10, 10), c.rr(20, 44), c.rr(1.6, 3), c.rr(1.4, 2.4), 6, 0.3), 0.2, 2);
  return `<g transform="translate(-6 -2) scale(-.26 .26) rotate(-12)">${one}</g><g transform="translate(6 -2) scale(.26) rotate(-12)">${one}</g><path d="${dust}" fill="${C.rock3}" opacity=".7"/>`;
}
import { lightHand as lightHandL } from '../john10/lib.js';
/** a little paper doll (origin: feet), ~46 tall, arms out to the sides so a row of them link hands */
export function doll(c, col = '#2b2233') {
  const s = sheet();
  s.p(c.cut([[-9, -30], [9, -30], [13, 0], [-13, 0]], 0.3, 4) + c.cut(c.circ(0, -37, 7, 10), 0.2, 3) + c.ribbon([[-20, -22], [-8, -28], [8, -28], [20, -22]], 4), col);
  return s.out();
}
/** the world as a dark disc ringed by paper dolls linked hand in hand, "loving its own" (origin centre) */
export function worldDisc(c, r = 110, { col = '#2b2233', n = 12 } = {}) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r, 48), 0.6, 6), mix('#2b2233', C.indigo, 0.5));
  let lands = '';
  for (let i = 0; i < 5; i++) lands += c.cut(c.blob(c.rr(-r * 0.5, r * 0.5), c.rr(-r * 0.5, r * 0.5), c.rr(r * 0.15, r * 0.3), c.rr(r * 0.1, r * 0.2), 9, 0.3), 0.5, 5);
  s.x(lands, mix('#2b2233', C.moss2, 0.35), 'opacity=".8"');
  let ring = '';
  for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2; ring += `<g transform="translate(${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}) rotate(${(a * 180 / PI + 90).toFixed(1)})">${doll(c, col)}</g>`; }
  return `${s.out()}${ring}`;
}

/**
 * "The world": a row of dark shadow figures on the far ridge (right), in their own layer. Each can also be lit — a
 * coloured copy with a little lamp fades in over it (for those who keep His word).
 * Returns [{ p, lp, x, y, i }]; set with worldSet(list, i => ({ up, point, lit, flip }))
 */
export function worldRidge(S, { litIdx = [] } = {}) {
  const c = makeCutter('j15-world');
  const L = S.layer({ par: 0.14, sh: 2 });
  const INK = '#241d2e';
  const xs = [880, 930, 985, 1040, 1100, 1150, 1210, 1270, 1330, 1390, 1450, 1510];
  return xs.map((x, i) => {
    const o = crowdPerson(c);
    const p = S.puppet(L.add(person(c, { ...silhouette3(o, INK), holdF: '', holdB: '' }).split(`fill="${C.blush}"`).join(`fill="${INK}"`)));
    const lp = litIdx.includes(i) ? S.puppet(L.add(person(c, { ...o, holdB: `<g class="lampU" transform="rotate(58)">${lanternHeld(c, 0)}</g>` }))) : null;
    return { p, lp, x, y: 470 + (i % 3) * 5 + Math.abs(x - 1200) * 0.03, i };
  });
}
import { silhouette as silhouette3 } from '../mark3/lib.js';
export function worldSet(list, fn) {
  list.forEach((sh) => {
    const { up = 1, point = 0, lit = 0, flip = true, armB = 0, head = 0 } = fn(sh);
    const base = { x: sh.x, y: sh.y + (1 - up) * 90, s: 0.34, flip, armF: point * 95, armB, head };
    sh.p.set({ ...base, o: up > 0.01 ? 1 - lit : 0 });
    if (sh.lp) sh.lp.set({ ...base, armF: 0, armB: 58, o: up > 0.01 ? lit : 0 });
  });
}

/** a reaching shadow hand on a long arm (origin at the wrist, fingers to +x, the arm runs back to -len) */
export function shadowArm(c, col = '#231c30', len = 900) {
  return sheet().p(c.cut([[-len, -22], [-10, -20], [10, -34], [44, -40], [60, -34], [42, -28], [30, -22], [70, -24], [76, -16], [40, -10], [72, -8], [74, 0], [38, 2], [66, 8], [62, 14], [30, 12], [10, 18], [-len, 26]], 0.8, 8), col).out();
}
