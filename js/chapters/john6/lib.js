// John 6 — the cast and cut-outs of this chapter: the green mountain over the Sea of Tiberias, the boy with
// his barley loaves, the paper crown, the night sea, the Capernaum shore, manna like snow in a sepia desert,
// the radiant bread of life and the cup of light, the Father's seal, the family portrait from Nazareth,
// threads of light that draw people, the road away from Capernaum.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging } from '../kit.js';
import { band, hillsWith, waterBand, town, house, cypress, olive, sun, cloud, grass, flowers, rock, bush } from '../../assets/nature.js';
import { tr } from '../../core/i18n.js';
import { TWELVE as T12, LOOK as L3 } from '../mark3/lib.js';
import { LOOK as L6 } from '../mark6/lib.js';
import { signBadge } from '../john2/lib.js';
import { loaf as loaf2 } from '../mark2/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, coin, coinStack, bowl, cup, jug, addToHead, dust, scrollOpen, wordSlip, rolledMat } from '../mark2/lib.js';
export { voiceRings, hang2, sparkle, synagogueInterior, synagogueFacade, scrollParts, dove, flapWings } from '../mark1/lib.js';
export { nameTag, bubble, strip, withFace, faceBits, stoneHeart, question, man, woman, pharisee, shadowPerson, silhouette, spiral } from '../mark3/lib.js';
export { fishCut, basket, crumb, storyFrame, SEPIA, oar, labelTag, disc, sheep } from '../mark6/lib.js';
export { heavenPanel, globe, soulLight, glory, lightCrown, say, tag, bigQuestion, loafHalves, crown, cloth } from '../mark8/lib.js';
export { chalice, cupOfLight, matzahRound, wordTag, discPlate, vignette } from '../mark14/lib.js';
export { MOSES, radiance, rayBurst, glowDisc, eternityRing, drawRing, threads, hungWord, hungGold, hungPlate, iconWord, bust, goldWord, bigTent, VOID, GOLD_LIGHT } from '../john1/lib.js';
export { signBadge, verseScroll, iconBubble, dayDisc, DISC } from '../john2/lib.js';
export { medallion, miniHead, skyKeys, talkDots } from '../mark16/lib.js';
export { tent } from '../mark9/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== the cast */

export const LOOK = {
  philip: L3.philip,
  nathanael: L3.bartholomew,
  judas: L3.judas,
  mary: L6.mary,
  // Joseph as he stands at the manger in John 1
  joseph: { robe: C.sageRobe, mantle: C.wood3, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather },
  // the boy with five barley loaves and two fish
  boy: { robe: C.skyVeil, mantle: null, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.ochre },
};
/** the Twelve (the same looks as in Mark 3), keyed by name: { k, o } */
export const TWELVE = T12.map((m) => ({ k: m.k, o: m.o }));
export const TW = Object.fromEntries(T12.map((m) => [m.k, m.o]));

/** a man / woman of the crowd (men are never veiled) */
export function folk(c, man = null, extra = {}) {
  const o = crowdPerson(c);
  const isMan = man === null ? o.hairStyle !== 'veil' : man;
  if (isMan && o.hairStyle === 'veil') { o.hairStyle = c.pick(['short', 'curly', 'wrap']); o.beard = c.pick(['short', 'full']); }
  if (!isMan) { o.hairStyle = 'veil'; o.beard = 'none'; }
  return { ...o, ...extra };
}
/** a still group of people as one cut-out: members [{x, y, s, flip, o}] */
export function group(c, members) {
  return members.slice().sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${person(c, m.o)}</g>`).join('');
}
/** scatter n people between x0..x1 on a ground function fn (+dy0..dy1), with depth scale */
export function scatter(c, n, { x0, x1, fn, dy0 = 0, dy1 = 40, s0 = 0.4, ds = 0.004, pose = 'stand', men = null, cx = 800 } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), base = fn(x), y = base + c.rr(dy0, dy1);
    out.push({ x, y, s: s0 + (y - base) * ds, flip: x > cx, o: { ...folk(c, men), pose } });
  }
  return out;
}

/* ================================================================== skies */
export const SPRING = ['#c9e0da', '#eef0d8', '#f8ecd0'];
export const NOON = ['#bfdbd8', '#ecefd9', '#f7eccf'];
export const GOLDEN = ['#d8c3b4', '#f1cf9f', '#f7dfb4'];
export const DUSK = ['#6f6a9c', '#d9a08f', '#f2c49a'];
export const NIGHT = ['#141a3d', '#26306a', '#4b5791'];
export const DAWN = ['#8d8fb5', '#e3b3a6', '#f4d2ae'];
export const MORNING = ['#cfe2dd', '#f1e9cf', '#f8e9cc'];

/* ================================================================== the mountain over the lake */
/**
 * The green mountainside over the Sea of Tiberias: sky, sun and clouds on strings, the far shore with
 * Tiberias, the lake, hills; a broad meadow slope (slopeL, fn sfn) where the crowds gather, and the near
 * ground (G, fn gfn) with a rocky knoll where Jesus sits. Returns handles and update(time, o).
 */
export function hillSet(S, { skyCols = SPRING, sunAt = [1200, 150], knollX = 800, meadow = C.hillNear, behind = null } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 46), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cls = [[470, 150, 200], [1000, 118, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 800 }), x, y, i }));
  const far = S.layer({ par: 0.08, sh: 2 });
  const fb = band(c, { y: 392, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) });
  far.add(fb.markup);
  far.add(town(c, { x: 330, y: fb.fn(330) + 14, n: 7, spread: 240, sc: 0.42 }));
  const lake = S.layer({ par: 0.1, sh: 1 });
  lake.add(waterBand(c, { y: 418, color: mix(C.lake, C.skyBlue, 0.25), foamN: 18, bottom: 900 }).markup);
  const mid = S.layer({ par: 0.16, sh: 3 });
  const mh = hillsWith(c, { y: 486, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 });
  mid.add(mh.markup);
  const extra = behind ? behind(S) : null;
  // the broad meadow slope where the crowd comes and sits
  const slopeL = S.layer({ par: 0.3, sh: 3 });
  const sfn = c.wave(560, [9, 4], [760, 240]);
  slopeL.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(meadow, C.sand, 0.22)).out());
  slopeL.add(olive(c, 170, 590, 0.8) + olive(c, 1460, 600, 0.85) + cypress(c, 1320, 580, 110));
  // the near ground with the knoll
  const G = S.layer({ par: 0.5, sh: 3 });
  const gfn0 = c.wave(700, [5, 2], [700, 180]);
  const gfn = (x) => gfn0(x) - Math.max(0, 1 - Math.abs(x - knollX) / 260) ** 2 * 34;
  G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 10, 1), mix(C.sage2, C.hillNear, 0.5)).out());
  G.add(rock(c, knollX - 10, gfn(knollX) + 16, 150, 44, C.rock2) + rock(c, knollX + 150, gfn(knollX + 150) + 14, 70, 26, C.rock));
  G.add(grass(c, { x0: -800, x1: 2400, y: 700, fn: gfn, n: 50, h: 14, color: C.moss }) + flowers(c, { x0: 300, x1: 1300, y: 700, fn: gfn, n: 14 }));
  return {
    sk, hangL, sunEl, slopeL, sfn, G, gfn, lake, far, mid, extra,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.i) * 24, y: cl.y, r: Math.sin(time * 0.6 + cl.i) * 1.2, o }));
    },
  };
}
/** a band of tall spring grass as one sheet (grows by sliding the layer up); origin world */
export function tallGrass(c, fn, { x0 = -900, x1 = 2500, n = 160, h = 34, col = C.leaf, col2 = C.wheatGreen } = {}) {
  const s = sheet();
  s.p(c.ridge((x) => fn(x) + 6, x0, x1, 1700, 14, 1), col);
  let bl = '', bl2 = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + ((i + c.rr(0, 1)) / n) * (x1 - x0), y = fn(x) + 10, hh = h * c.rr(0.6, 1.2);
    const blade = c.ribbon(c.qbez([x, y], [x + c.rr(-6, 6), y - hh * 0.6], [x + c.rr(-14, 14), y - hh], 6), (u) => 4.2 - u * 3.6);
    if (i % 3) bl += blade; else bl2 += blade;
  }
  s.p(bl, col).p(bl2, col2);
  return s.out();
}

/**
 * The seated crowd on the meadow (after "they sat down"): rows of seated groups and tall grass in front of
 * each row, all still cut-outs in one layer. Returns { rows: [{x, y, s, el, i}], L }.
 */
export function meadowRows(S, sfn, { par = 0.3, gap = 120, cx = 800, grassK = 1 } = {}) {
  const c = S.c;
  const L = S.layer({ par, sh: 3 });
  const rows = [];
  let grassD = '', grassD2 = '';
  [[14, 0.28, 12], [40, 0.34, 11], [68, 0.4, 10]].forEach(([dy, s, n], r) => {
    for (let i = 0; i < n; i++) {
      const x = 200 + (i + 0.5 + (r % 2) * 0.4) * (1300 / n);
      if (r === 2 && Math.abs(x - cx) < gap) continue;
      const mem = Array.from({ length: 5 }, (_, k) => ({ x: (k - 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > cx, o: { ...folk(c, k !== 2), pose: 'sit' } }));
      const y = sfn(x) + dy;
      rows.push({ r, x, y, s, i: rows.length, el: L.add(`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})">${group(c, mem)}</g>`) });
    }
  });
  [6, 30, 56, 84].forEach((dy, r) => {
    for (let x = -700; x < 2300; x += c.rr(8, 14)) {
      const y = sfn(x) + dy + 10, hh = c.rr(14, 26) * (1 + r * 0.25) * grassK;
      const b = c.ribbon(c.qbez([x, y], [x + c.rr(-4, 4), y - hh * 0.6], [x + c.rr(-10, 10), y - hh], 5), (u) => 3.6 - u * 3.2);
      if (c.chance(0.6)) grassD += b; else grassD2 += b;
    }
  });
  L.add(`<g><path d="${grassD}" fill="${C.leaf}"/><path d="${grassD2}" fill="${C.wheatGreen}"/></g>`);
  return { rows, L };
}

/* ================================================================== bread, fish, baskets */
/** a small oval barley loaf (darker, rustic, with a slash); origin: bottom centre */
export function barleyLoaf(c, r = 16) {
  const col = mix(C.wheat2, C.wood3, 0.35);
  const s = sheet();
  s.p(c.cut([...c.arc(0, -2, r, r * 0.62, PI, 2 * PI, 12), [r * 0.94, 0], [-r * 0.94, 0]], 0.3, 4), col);
  s.x(c.ribbon([[-r * 0.46, -r * 0.3], [r * 0.4, -r * 0.42]], 2), shade(col, -0.28), 'opacity=".75"');
  let dots = '';
  for (let i = 0; i < 5; i++) dots += c.poly(c.ell(c.rr(-r * 0.6, r * 0.6), -c.rr(r * 0.1, r * 0.5), 1.4, 0.8, 6, c.rr(0, 3)));
  s.x(dots, shade(col, 0.3), 'opacity=".8"');
  return s.out();
}
/** a numbered sign medallion (from John 2's series) with a small icon on its left */
export function signMedal(c, n, icon, r = 58) {
  return `${signBadge(c, n, { r, icon: 'own' })}<g transform="translate(${-r * 0.34} ${-r * 0.1})">${icon}</g>`;
}
/** the loaf icon for the fourth sign */
export const loafIcon = (c) => `<g transform="translate(0 10)">${barleyLoaf(c, 15)}</g><g transform="translate(0 -6) scale(.55)"><path d="${c.cut([[-22, 0], [-6, -9], [10, -8], [22, 0], [10, 8], [-6, 8], [-22, 0], [-32, -9], [-30, 0], [-32, 9]], 0.3, 4)}" fill="${C.lake3}"/></g>`;
/** the wave-and-footprints icon for the fifth sign */
export function waveIcon(c) {
  const s = sheet();
  s.p(c.cut([[-18, 6], ...c.arc(-9, 6, 9, 7, PI, 2 * PI, 6), ...c.arc(9, 6, 9, 7, PI, 2 * PI, 6), [18, 14], [-18, 14]], 0.3, 3), C.lake2);
  s.p(c.cut(c.ell(-4, -10, 4, 7, 10, 0.2), 0.2, 3) + c.cut(c.ell(6, -16, 4, 7, 10, 0.2), 0.2, 3), C.sandal);
  return s.out();
}

/**
 * The radiant bread: a round loaf of light with a soft glow and slow rays; origin centre.
 * .glow and .rays can be posed separately if wanted.
 */
export function breadOfLight(c, r = 46, { rays = true } = {}) {
  const s = sheet();
  s.p(c.cut([...c.arc(0, r * 0.28, r, r * 0.86, PI, 2 * PI, 22), ...c.arc(0, r * 0.28, r, r * 0.3, 0, PI, 12)], 0.4, 5), C.halo);
  s.p(c.cut([...c.arc(0, r * 0.2, r * 0.8, r * 0.62, PI, 2 * PI, 18), [r * 0.8, r * 0.26], [-r * 0.8, r * 0.26]], 0.3, 5), mix(C.halo, C.star, 0.5));
  // four gentle scores across the crust
  s.x(c.ribbon([[-r * 0.52, -r * 0.1], [r * 0.52, -r * 0.1]], 3) + c.ribbon([[0, -r * 0.5], [0, r * 0.24]], 3) + c.ribbon([[-r * 0.36, -r * 0.38], [-r * 0.2, r * 0.12]], 2) + c.ribbon([[r * 0.36, -r * 0.38], [r * 0.2, r * 0.12]], 2), C.haloRim, 'opacity=".7"');
  let d = '';
  if (rays) for (let i = 0; i < 18; i++) { const a = (i / 18) * PI * 2, w = 0.05; d += c.poly([[Math.cos(a - w) * r * 0.9, Math.sin(a - w) * r * 0.9], [Math.cos(a) * r * 2.6, Math.sin(a) * r * 2.6], [Math.cos(a + w) * r * 0.9, Math.sin(a + w) * r * 0.9]]); }
  return `<circle class="glow" r="${r * 2.4}" fill="url(#halo-glow)"/>${rays ? `<path class="rays" d="${d}" fill="#fff4d0" opacity=".6"/>` : ''}${s.out()}`;
}
/** a flake of manna (a small white round wafer, like frost); origin centre */
export function mannaFlake(c, r = 5) {
  return `<path d="${c.cut(c.blob(0, 0, r, r * 0.8, 8, 0.25), 0.2, 2)}" fill="#fbf7ec"/><path d="${c.poly(c.circ(-r * 0.25, -r * 0.2, r * 0.3, 6))}" fill="#fff" opacity=".8"/>`;
}
/** a whole sheet of manna flakes scattered over an area (one still cut-out); origin world */
export function mannaField(c, { x0, x1, y0, y1, n = 140, r = 4 }) {
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut(c.blob(c.rr(x0, x1), c.rr(y0, y1), r * c.rr(0.7, 1.3), r * 0.6, 7, 0.25), 0.1, 2);
  return `<path d="${d}" fill="#fbf7ec"/>`;
}
/** a paper crown (golden, with jewels), large enough to be carried by several hands; origin bottom centre */
export function paperCrown(c, w = 120) {
  const h = w * 0.62;
  const pts = [[-w / 2, 0], [-w / 2 - 4, -h * 0.72], [-w * 0.3, -h * 0.34], [-w * 0.17, -h], [0, -h * 0.4], [w * 0.17, -h], [w * 0.3, -h * 0.34], [w / 2 + 4, -h * 0.72], [w / 2, 0]];
  const s = sheet();
  s.p(c.cut(pts, 0.4, 5), C.sun);
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 + 1, -h * 0.2], [-w / 2 - 1, -h * 0.2]], 0.3, 5), shade(C.sun, -0.14));
  s.x(c.poly(c.circ(-w * 0.3, -h * 0.1, w * 0.05, 8)) + c.poly(c.circ(w * 0.3, -h * 0.1, w * 0.05, 8)), C.terracotta);
  s.x(c.poly(c.circ(0, -h * 0.1, w * 0.06, 8)), C.teal2);
  s.x(c.poly(c.circ(-w * 0.17, -h, w * 0.035, 6)) + c.poly(c.circ(w * 0.17, -h, w * 0.035, 6)) + c.poly(c.circ(-w / 2 - 4, -h * 0.72, w * 0.03, 6)) + c.poly(c.circ(w / 2 + 4, -h * 0.72, w * 0.03, 6)), C.star);
  return s.out();
}

/* ================================================================== the boat */
/** a fishing boat hull in two parts (people stand between): { back, front }; origin: waterline centre */
export function hull(c, { w = 360, col = C.wood, stripe = C.terracotta } = {}) {
  const back = sheet().p(c.cut([[-w / 2 + 10, -70], [w / 2 - 10, -70], [w / 2 - 20, -40], [-w / 2 + 20, -40]], 0.5, 8), shade(col, -0.25)).out();
  const f = sheet();
  f.p(c.cut([[-w / 2 - 20, -78], [-w / 2 + 10, -44], [-w / 2 + 40, 6], [w / 2 - 40, 6], [w / 2 - 10, -44], [w / 2 + 20, -80], [w / 2 + 4, -60], [-w / 2 - 4, -60]], 0.8, 8), col);
  f.x(c.ribbon([[-w / 2 + 6, -48], [w / 2 - 6, -48]], 5), stripe, 'opacity=".85"');
  f.x(c.ribbon([[-w / 2 + 30, -20], [w / 2 - 30, -20]], 1.4) + c.ribbon([[-w / 2 + 40, -6], [w / 2 - 40, -6]], 1.4), shade(col, -0.3), 'opacity=".5"');
  f.p(c.cut(c.circ(w / 2 - 34, -56, 5, 8), 0.2, 3), C.sun);
  return { back, front: f.out() };
}
/** a sail boat seen far off (a small whole cut-out); origin: waterline centre */
export function smallSail(c, { w = 70, col = C.wood2, sail = C.sail } = {}) {
  const s = sheet();
  s.p(c.ribbon([[0, -2], [0, -w * 1.1]], 2.4), C.wood2);
  s.p(c.cut([[2, -w * 1.06], [w * 0.52, -w * 0.28], [2, -w * 0.24]], 0.4, 5), sail);
  s.p(c.cut([[-2, -w * 0.94], [-w * 0.34, -w * 0.3], [-2, -w * 0.28]], 0.4, 5), shade(sail, -0.06));
  s.p(c.cut([[-w / 2, -w * 0.22], [w / 2, -w * 0.22], [w * 0.36, 0], [-w * 0.36, 0]], 0.4, 5), col);
  return s.out();
}

/* ================================================================== the Capernaum shore */
/**
 * The shore at Capernaum: sky and sun on strings, far hills, the lake, a pebbled beach with moored boats and
 * the town (flat-roofed houses, the white synagogue) on the right. Returns handles.
 */
export function capShore(S, { skyCols = MORNING, sunAt = [460, 170], beachY = 640 } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 800 });
  const cl = hanging(hangL, cloud(c, 180), { x: 1080, y: 140, len: 800 });
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 408, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.1) }).markup);
  const lakeL = S.layer({ par: 0.12, sh: 1 });
  lakeL.add(waterBand(c, { y: 450, color: mix(C.lake, C.skyBlue, 0.3), foamN: 20, bottom: 1200 }).markup);
  // the town on the right bank
  const townL = S.layer({ par: 0.2, sh: 3 });
  const tfn = c.wave(560, [6, 3], [600, 200]);
  townL.add(sheet().p(c.ridge((x) => (x < 900 ? 900 : tfn(x) + Math.max(0, (1100 - x) * 0.9)), 900, 2600, 1700, 12, 1), mix(C.sand, C.hillNear, 0.35)).out());
  let hs = '';
  [[1040, 44, 36], [1110, 60, 44], [1300, 56, 40], [1380, 70, 46], [1470, 50, 38], [1560, 64, 44], [1650, 56, 40]].forEach(([x, w, h]) => { hs += house(c, x, tfn(x) + 8, w, h, { stairs: false }); });
  townL.add(hs);
  // the white synagogue
  const sy = sheet();
  const SX = 1200, SB = tfn(1200) + 6;
  sy.p(c.cut(c.rect(SX - 64, SB - 86, 128, 90), 0.5, 8), C.cream);
  sy.p(c.cut([[SX - 76, SB - 84], [SX, SB - 124], [SX + 76, SB - 84]], 0.5, 8), C.plaster2);
  [SX - 44, SX - 14, SX + 16, SX + 46].forEach((x) => sy.p(c.cut(c.rect(x - 5, SB - 80, 10, 78), 0.3, 6), C.stone));
  sy.p(c.cut([[SX - 12, SB + 2], [SX - 12, SB - 30], ...c.arc(SX, SB - 30, 12, 12, PI, 2 * PI, 8), [SX + 12, SB + 2]], 0.3, 5), C.soilDark);
  sy.p(c.cut(c.star(SX, SB - 100, 8, 3.6, 6, 0), 0.2, 3), C.sun);
  townL.add(sy.out() + cypress(c, 1010, tfn(1010) + 12, 90) + cypress(c, 1600, tfn(1600) + 10, 100));
  // the beach
  const beachL = S.layer({ par: 0.4, sh: 3 });
  const bfn = c.wave(beachY, [5, 2], [600, 170]);
  const b = sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.3));
  let peb = '';
  for (let i = 0; i < 80; i++) { const x = c.rr(-600, 2200); peb += c.cut(c.blob(x, bfn(x) + c.rr(14, 200), c.rr(4, 9), c.rr(2.5, 5), 7, 0.2), 0.2, 3); }
  b.x(peb, C.stone2, 'opacity=".7"');
  beachL.add(b.out());
  beachL.add(`<path d="${c.ribbon(Array.from({ length: 40 }, (_, i) => { const x = -900 + i * 90; return [x, bfn(x) + 2]; }), 4)}" fill="${C.foam}" opacity=".8"/>`);
  return {
    sk, hangL, sunEl, cl, far, lakeL, townL, beachL, bfn, tfn,
    update(time, { sunX = sunAt[0], sunY = sunAt[1], o = 1 } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6), o });
      pose(cl, { x: 1080 + Math.sin(time * 0.1) * 26, y: 140, r: Math.sin(time * 0.6 + 1) * 1.2, o });
    },
  };
}

/* ================================================================== the Father's seal, the family, threads */
/** the seal of the Father: a round golden seal pressed with a small sun of light; origin centre */
export function lightSeal(c, r = 44) {
  const s = sheet();
  const pts = [];
  for (let i = 0; i < 22; i++) { const a = (i / 22) * PI * 2, rr = r * (i % 2 ? 1 : 1.07); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  s.p(c.cut(pts, 0.6, 4), shade(C.sun, -0.08));
  s.p(c.cut(c.circ(0, 0, r * 0.78, 28), 0.4, 4), C.sun);
  s.x(c.ribbon(c.arc(0, 0, r * 0.7, r * 0.7, 0, PI * 2, 28), 1.6), shade(C.sun, -0.3), 'opacity=".5"');
  s.p(c.cut(c.star(0, 0, r * 0.5, r * 0.26, 12, 0), 0.2, 3), C.star);
  s.x(c.poly(c.circ(0, 0, r * 0.2, 14)), '#fffdf2');
  return `<circle r="${r * 2}" fill="url(#halo-glow)" opacity=".8"/>${s.out()}`;
}
/** the mark the seal leaves (a small golden star-disc) on Jesus' breast (origin centre) */
export function sealMark(c, r = 13) {
  return `<circle r="${r * 2.6}" fill="url(#halo-glow)"/><path d="${c.cut(c.star(0, 0, r, r * 0.55, 12, 0), 0.2, 2)}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, r * 0.4, 10))}" fill="#fffdf2"/>`;
}
/** Joseph and Mary: a double portrait in an oval frame, with a carpenter's plane beneath; origin: top (string) */
export function familyPlate(S, { w = 250, h = 170 } = {}) {
  const c = S.c;
  const id = S.id('famclip');
  const s = sheet();
  s.p(c.cut(c.ell(0, h / 2 + 12, w / 2 + 14, h / 2 + 14, 40), 0.6, 6), C.wood2);
  s.p(c.cut(c.ell(0, h / 2 + 12, w / 2 + 4, h / 2 + 4, 40), 0.5, 6), C.ochre);
  s.p(c.cut(c.ell(0, h / 2 + 12, w / 2 - 4, h / 2 - 4, 40), 0.5, 6), C.parchment);
  // a Nazareth wall behind them
  const wall = sheet().p(c.cut(c.rect(-w / 2, 0, w, h + 30), 0.4, 8), mix(C.plaster, C.parchment, 0.4)).x(c.cut(c.rect(-8, 40, 18, 24), 0.3, 4), mix(C.soilDark, C.wood2, 0.4)).p(c.cut(c.rect(-w / 2, h * 0.86, w, 60), 0.4, 8), mix(C.wood3, C.parchment, 0.3)).out();
  const bJ = person(c, { ...LOOK.joseph, halo: false });
  const bM = person(c, { ...LOOK.mary, halo: false });
  const inner = `${wall}<g transform="translate(-52 ${h + 78}) scale(.9)">${bJ}</g><g transform="translate(50 ${h + 80}) scale(-.84 .84)">${bM}</g>`;
  const plane = sheet().p(c.cut([[-26, -8], [26, -8], [30, 6], [-30, 6]], 0.3, 4), C.wood3).p(c.cut([[-10, -16], [8, -16], [10, -8], [-12, -8]], 0.3, 3), C.wood2).out();
  return `<path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<clipPath id="${id}"><ellipse cx="0" cy="${h / 2 + 12}" rx="${w / 2 - 6}" ry="${h / 2 - 6}"/></clipPath><g clip-path="url(#${id})">${inner}</g><g transform="translate(0 ${h + 36})">${plane}</g>`;
}
/** a murmur: a small grey speech bubble with a scribbled line (origin at the tail) */
export function murmur(c, { side = 1, w = 56, h = 34, col = mix(C.stone2, C.storm, 0.2) } = {}) {
  const d = side;
  const s = sheet();
  const cx = d * (w / 2 - 6), cy = -h / 2 - 12;
  s.p(c.cut([...c.blob(cx, cy, w / 2, h / 2, 12, 0.08), [d * 10, -10], [0, 0], [d * 3, -12]], 0.6, 5), col);
  const pts = [];
  for (let i = 0; i <= 10; i++) pts.push([cx - w * 0.34 + (i / 10) * w * 0.68, cy + (i % 2 ? -5 : 5)]);
  s.x(c.ribbon(pts, 2), C.inkSoft, 'opacity=".7"');
  return s.out();
}

/* ================================================================== a still sepia desert camp (the manna) */
/**
 * The desert camp of the fathers, drawn in sepia: dunes, a mountain, rows of tents. Adds layers; returns
 * { layers, gfn } — each layer can be faded out when the flashback ends.
 */
export function desertCamp(S, { tents } = {}) {
  const c = S.c;
  const out = [];
  const sep = (a) => mix(a, '#c9ae86', 0.55);
  const L1 = S.layer({ par: 0.08, sh: 2 }); out.push(L1);
  L1.add(sheet().p(c.cut([[-900, 470], [120, 470], [420, 250], [520, 232], [640, 300], [900, 470], [2500, 470], [2500, 1700], [-900, 1700]], 1.4, 12), sep(C.rock2)).out());
  const L2 = S.layer({ par: 0.16, sh: 2 }); out.push(L2);
  L2.add(band(c, { y: 500, amps: [16, 6, 2], lens: [800, 280, 100], color: sep(C.dune) }).markup);
  const L3 = S.layer({ par: 0.26, sh: 3 }); out.push(L3);
  const g2 = c.wave(560, [8, 3], [700, 200]);
  L3.add(sheet().p(c.ridge(g2, -900, 2500, 1700, 12, 1), sep(C.sand2)).out());
  let ts = '';
  (tents || [[240, 0.8], [360, 0.66], [470, 0.74], [1080, 0.7], [1190, 0.8], [1310, 0.66], [1420, 0.76]]).forEach(([x, sc], i) => {
    ts += `<g transform="translate(${x} ${g2(x) + 6}) scale(${sc})">${tentSepia(c, sep, i)}</g>`;
  });
  L3.add(ts);
  const L4 = S.layer({ par: 0.4, sh: 3 }); out.push(L4);
  const gfn = c.wave(690, [6, 2], [700, 180]);
  L4.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 10, 1), sep(C.sand)).out());
  return { layers: out, gfn, g2 };
}
function tentSepia(c, sep, i) {
  const col = sep([C.wheatRobe, C.clayMantle, C.stone][i % 3]);
  const w = 110, h = 90;
  const s = sheet();
  s.p(c.cut([[-w / 2 - 6, 0], [0, -h], [w / 2 + 6, 0]], 0.5, 6), shade(col, -0.15));
  s.p(c.cut([[-w / 2, 0], [-2, -h + 4], [w * 0.18, 0]], 0.5, 6), col);
  s.p(c.cut([[-4, 0], [-1, -h * 0.55], [8, 0]], 0.3, 4), shade(col, -0.45));
  s.x(c.ribbon([[-w / 2 + 8, -8], [-3, -h + 12]], 3), sep(C.terracotta), 'opacity=".6"');
  return s.out();
}

/* ================================================================== the road away */
/**
 * A road that winds away from Capernaum into the hills at evening. Returns handles and ROAD (a polyline
 * from the foreground to the far hills) with pathS(y) for the size of a walker.
 */
export const ROAD = [[820, 760], [760, 700], [640, 650], [540, 612], [470, 580], [420, 556], [360, 536], [290, 520], [200, 506], [80, 494]];
export const roadS = (y) => 0.3 + (y - 494) / (760 - 494) * 0.72;
export function roadSet(S, { skyCols = GOLDEN, sunAt = [300, 300] } = {}) {
  const c = S.c;
  const sk = sky(S, skyCols);
  const hangL = S.layer({ par: 0.04, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0b060', inner: '#f5ca8a' }), { x: sunAt[0], y: sunAt[1], len: 900 });
  const cl = hanging(hangL, cloud(c, 220, C.cream, C.peach), { x: 1060, y: 150, len: 800 });
  const far = S.layer({ par: 0.08, sh: 2 });
  far.add(band(c, { y: 440, amps: [22, 9, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.25) }).markup);
  const lakeL = S.layer({ par: 0.1, sh: 1 });
  lakeL.add(sheet().p(c.cut([[900, 470], [2500, 462], [2500, 520], [900, 530]], 0.6, 20), mix(C.lake, C.peach, 0.25)).out());
  const hills = S.layer({ par: 0.2, sh: 3 });
  const hfn = c.wave(496, [10, 4], [700, 220]);
  hills.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillMid, C.sand, 0.25)).out());
  hills.add(town(c, { x: 1320, y: hfn(1320) + 16, n: 7, spread: 260, sc: 0.5 }) + cypress(c, 1150, hfn(1150) + 12, 80) + olive(c, 60, hfn(60) + 20, 0.5));
  const G = S.layer({ par: 0.34, sh: 3 });
  const gfn = c.wave(520, [6, 2], [700, 180]);
  const g = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.sand, 0.35));
  G.add(g.out());
  // the road, widening towards us
  // (the road keeps widening towards us below the figures: a phone shows it far down the screen)
  G.add(sheet().p(c.cut([[ROAD[0][0] - 560, 1700], ...ROAD.map(([x, y]) => [x - 6 - (y - 494) * 0.55, y]), ...ROAD.slice().reverse().map(([x, y]) => [x + 6 + (y - 494) * 0.55, y]), [ROAD[0][0] + 580, 1700]], 0.6, 8), mix(C.sand, C.cream, 0.3)).out());
  G.add(grass(c, { x0: -800, x1: 2400, y: 520, fn: gfn, n: 40, h: 10, color: C.moss }) + olive(c, 1180, 640, 0.9) + olive(c, 250, 700, 0.8) + bush(c, 1420, 700, 120, C.sage, C.moss));
  return {
    sk, hangL, sunEl, cl, G, gfn,
    update(time, { sunX = sunAt[0], sunY = sunAt[1] } = {}) {
      pose(sunEl, { x: sunX, y: sunY, r: Math.sin(time * 0.6) });
      pose(cl, { x: 1060 + Math.sin(time * 0.1) * 26, y: 150, r: Math.sin(time * 0.6 + 1) * 1.2 });
    },
  };
}

/** sample a polyline at u ∈ [0,1] → [x, y] */
export function along(pts, u) {
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  let x = Math.max(0, Math.min(1, u)) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (x <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, x / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; }
    x -= seg[i];
  }
  return pts[pts.length - 1];
}

/* ================================================================== small things */
/** a little paper sun-with-rays drawn on a hanging disc: "the last day" dawn (origin centre) */
export function dawnDisc(c, r = 50) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 5, 36), 0.5, 5), C.haloRim);
  s.p(c.cut(c.circ(0, 0, r, 36), 0.5, 5), mix(C.dawn, C.peach, 0.4));
  s.p(c.cut([...c.arc(0, r * 0.3, r * 0.44, r * 0.44, PI, 2 * PI, 12)], 0.3, 4), C.sun);
  let d = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i + 0.5) / 9 * PI; d += c.ribbon([[Math.cos(a) * r * 0.54, r * 0.3 + Math.sin(a) * r * 0.54], [Math.cos(a) * r * 0.82, r * 0.3 + Math.sin(a) * r * 0.82]], 3); }
  s.x(d, C.sunDeep, 'opacity=".8"');
  s.p(c.cut([[-r, r * 0.3], [r, r * 0.3], [r * 0.8, r * 0.7], [-r * 0.8, r * 0.7]], 0.3, 4), C.hillNear);
  return s.out();
}
/** a small bowl that can be empty or filled (the .fill piece is fadeable); origin: bottom centre */
export function fillBowl(c, { w = 30, col = C.pot, food = 'bread' } = {}) {
  const s = sheet().p(c.cut([[-w / 2, -w * 0.46], [w / 2, -w * 0.46], [w * 0.32, 0], [-w * 0.32, 0]], 0.3, 4), col).x(c.ribbon([[-w * 0.4, -w * 0.3], [w * 0.4, -w * 0.3]], 1.6), shade(col, 0.2), 'opacity=".6"').out();
  const fill = food === 'water'
    ? `<path d="${c.cut(c.ell(0, -w * 0.46, w * 0.46, w * 0.1, 12), 0.2, 3)}" fill="${C.lake}"/>`
    : `<g transform="translate(0 ${-w * 0.4})">${loaf2(c, w * 0.34)}</g>`;
  return `${s}<g class="fill">${fill}</g>`;
}
/** a cup (side view) whose .water surface can be shown; origin: foot */
export function waterCup(c, col = C.pot) {
  const s = sheet().p(c.cut([[-12, -26], [12, -26], [9, -6], [4, -2], [4, 0], [-4, 0], [-4, -2], [-9, -6]], 0.3, 3), col).out();
  return `${s}<g class="water"><path d="${c.cut(c.ell(0, -25, 11, 3, 10), 0.2, 3)}" fill="${C.lake}"/><path d="${c.ribbon([[0, -60], [0, -27]], 3)}" fill="${C.lake}" class="pour"/></g>`;
}
/** a hand-lettered numeral tag floating on the water on a little cork float (origin: waterline) */
export function floatTag(c, text) {
  const s = sheet().p(c.cut(c.ell(0, 0, 14, 6, 12), 0.3, 3), C.clay).p(c.ribbon([[0, -2], [0, -30]], 2), C.wood2).out();
  return `${s}<g transform="translate(0 -44)"><path d="${c.cut(c.rect(-24, -14, 48, 26), 0.4, 5)}" fill="${C.cream}"/><text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${text}</text></g>`;
}
/** a little closed eye / an open eye icon for seeing & not believing (origin centre) */
export function eyeIcon(c, open = true, r = 16) {
  const s = sheet();
  if (open) {
    s.p(c.cut([...c.arc(0, r * 0.1, r, r * 0.66, PI, 2 * PI, 10), ...c.arc(0, -r * 0.1, r, r * 0.66, 0, PI, 10)], 0.2, 3), C.cream);
    s.x(c.poly(c.circ(0, 0, r * 0.36, 10)), C.inkSoft);
  } else {
    s.x(c.ribbon(c.arc(0, -r * 0.1, r, r * 0.5, 0.2, PI - 0.2, 10), 2.4), C.inkSoft);
  }
  return s.out();
}
export { loaf2 as loaf };
