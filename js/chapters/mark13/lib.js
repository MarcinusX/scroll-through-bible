// Mark 13 — the discourse on the Mount of Olives. Almost everything here is Jesus speaking, so the
// chapter makes words visible: hanging plates, a map, shadow screens and tableaux around the seated
// Jesus and the four (Peter, James, John, Andrew), with the Temple gleaming across the valley.
// This file holds the shared Mount-of-Olives set, the seated circle, panels and props.
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, grass, sun, moon, cloud, stars } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { jerusalem } from '../mark11/lib.js';

export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, bowl, lantern, candle, scrollOpen, wordSlip, addToHead, addToBody, heart, dust, scrap, wreath } from '../mark2/lib.js';
export { nameTag, bubble, strip, question, tornPair, shadowPerson, silhouette, man, woman, withFace, faceBits, TWELVE, LOOK, along } from '../mark3/lib.js';
export { angel, glory, globe, lightCrown, soulLight } from '../mark8/lib.js';
export { voiceRings, hang2, dove, flapWings, wings, flame, tagOnString, sparkle } from '../mark1/lib.js';
export { jerusalem, sanctuary as templeFront, figTree, cityWall, grove, priest, elder } from '../mark11/lib.js';
export { helmet, crown, throne } from '../mark6/lib.js';

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');
export const INK = '#3b2a22';
export const DY = { stand: 0, kneel: 46, sit: 62 };

/* ====================================================================== */
/* colour                                                                 */
/* ====================================================================== */
/** re-colour every #rrggbb in a piece of markup towards `col` by k (evening light, night, sepia) */
const KEEP = new Set([C.lampFlame, C.lampGlow, '#fff4d2', C.star, C.halo].map((h) => h.toLowerCase()));
export function tint(markup, col, k) {
  if (!k) return markup;
  return markup.replace(/#[0-9a-fA-F]{6}\b/g, (h) => (KEEP.has(h.toLowerCase()) ? h : mix(h, col, k)));
}
/** skies of the chapter */
export const SKIES = {
  gold: ['#e7cfae', '#f2dcb6', '#f7e7cc'],
  dusk: [C.duskViolet, C.dusk, C.peach],
  twilight: ['#6f6a96', '#b78f9e', '#e5b394'],
  night: ['#2b3262', '#4a4876', '#8d7590'],
  deep: ['#1d2349', '#2b3262', '#4a4876'],
  morning: ['#cfe3dc', '#eef0d6', '#f8efd6'],
};

/* ====================================================================== */
/* the seated circle: Jesus on a rock, Peter & Andrew (left), John & James (right) */
/* ====================================================================== */
export const FOUR = [
  { k: 'andrew', o: CAST.andrew, x: 566, y: 668, s: 0.84, name: () => tr('Andrzej', 'Andrew') },
  { k: 'peter', o: CAST.peter, x: 652, y: 716, s: 0.96, name: () => tr('Piotr', 'Peter') },
  { k: 'john', o: CAST.john, x: 950, y: 716, s: 0.96, name: () => tr('Jan', 'John') },
  { k: 'james', o: CAST.james, x: 1034, y: 668, s: 0.84, name: () => tr('Jakub', 'James') },
];
export const JX = 800, JY = 694, JS = 1.02;

/** a flat seat-rock for Jesus; origin: ground centre */
export function seatRock(c, w = 150, h = 44, col = C.rock2) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 4], [-w / 2 + 8, -h * 0.7], [-w * 0.2, -h], [w * 0.25, -h * 0.96], [w / 2 - 6, -h * 0.6], [w / 2, 4]], 1, 7), col);
  s.x(c.ribbon([[-w * 0.3, -h * 0.55], [w * 0.1, -h * 0.7]], 2), shade(col, 0.25), 'opacity=".6"');
  s.x(c.ribbon([[-w * 0.4, -4], [w * 0.4, -2]], 3), shade(col, -0.2), 'opacity=".5"');
  return s.out();
}

/**
 * The circle as puppets in layer L (Jesus in the middle, the four around him, all seated).
 * Returns { jesus, four:[{p, x, y, s, flip, dir, hx, hy, seed}], set(t, time, fn) } where fn(m, i) returns extra pose.
 */
export function circle(S, L, { tintCol = null, tintK = 0, rock: withRock = true, dx = 0 } = {}) {
  const c = S.c;
  const T = (m) => tint(m, tintCol, tintK);
  const four = [];
  const add = (i) => {
    const f = FOUR[i], flip = f.x > JX;
    const p = S.puppet(L.add(T(person(c, { ...f.o, pose: 'sit' }))));
    four[i] = { ...f, x: f.x + dx, i, p, flip, dir: flip ? -1 : 1, seed: c.rr(0, 9), hx: f.x + dx + (flip ? -2 : 2) * f.s, hy: f.y - 105 * f.s };
  };
  // back row, then Jesus on his rock, then the near two
  add(0); add(3);
  if (withRock) L.add(`<g transform="translate(${JX + dx} ${JY + 4})">${T(seatRock(c))}</g>`);
  const jesus = S.puppet(L.add(T(person(c, { ...CAST.jesus, pose: 'sit' }))));
  add(1); add(2);
  return { jesus, four, x: JX + dx, y: JY, s: JS, hx: JX + dx + 2 * JS, hy: JY - 105 * JS };
}

/* ====================================================================== */
/* the Mount of Olives, Jerusalem across the Kidron valley                */
/* ====================================================================== */
/**
 * Adds the set's layers (sky, heavens, the city, the valley, the slope) and returns handles.
 * mood: a sky from SKIES; tintCol/tintK: evening colour laid over the land; moonOn/sunOn: ornaments.
 */
export function olivesSet(S, { skyCols = SKIES.dusk, tintCol = C.duskViolet, tintK = 0.3, sunXY = [1210, 250], moonXY = [1180, 170], cityX = 760, templeGlow = 0.8, starsN = 70 } = {}) {
  const c = makeCutter('m13-olives-set');
  const T = (m, k = tintK) => tint(m, tintCol, k);
  const sk = sky(S, skyCols);
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 360, n: starsN }));
  const hangL = S.layer({ par: 0.04, sh: 4 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunXY[0], y: sunXY[1], len: 700 });
  const moonEl = hanging(hangL, moon(c, 30), { x: moonXY[0], y: moonXY[1], len: 700 });
  const cl1 = hanging(hangL, T(cloud(c, 190), tintK * 0.6), { x: 450, y: 160, len: 600 });

  // Jerusalem on its hill across the valley
  const cityL = S.layer({ par: 0.1, sh: 3 });
  cityL.add(T(band(c, { y: 432, amps: [10, 5, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup));
  const glowEl = cityL.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`);
  cityL.add(T(`<g transform="translate(${cityX} 418)">${jerusalem(c, 0.56, { tglow: false })}</g>`, tintK * 0.8));
  const TEMPLE = [cityX + 280 * 0.56, 418 - (150 + 60) * 0.56 - 250 * 0.72 * 0.56 * 0.6];

  // the Kidron valley and the far slopes
  const valL = S.layer({ par: 0.16, sh: 3 });
  const vb = hillsWith(c, { y: 470, amps: [12, 5, 2], lens: [800, 300, 120], color: mix(C.hillMid, C.sage, 0.35), trees: 30, treeColor: mix(C.olive, C.moss, 0.3), treeH: 18, x0: -1400, x1: 3000 });
  valL.add(T(vb.markup, tintK * 1.1));

  // the slope of the Mount where they sit
  const hillL = S.layer({ par: 0.3, sh: 3 });
  const hb = band(c, { y: 560, amps: [14, 6, 3], lens: [1000, 360, 130], color: C.hillMid, x0: -1400, x1: 3000 });
  let terr = '';
  for (let i = 0; i < 6; i++) { const y = 574 + i * 14, x0 = -600 + c.rr(0, 300); terr += c.ribbon([[x0, y], [x0 + c.rr(700, 1200), y + c.rr(-4, 4)]], 2.2); }
  hillL.add(T(hb.markup + `<path d="${terr}" fill="${shade(C.hillMid, -0.12)}" opacity=".6"/>`, tintK * 1.2));
  hillL.add(T(olive(c, 500, hb.fn(500) + 6, 0.55) + olive(c, 1120, hb.fn(1120) + 6, 0.6) + olive(c, 690, hb.fn(690) + 4, 0.42) + bush(c, 960, hb.fn(960) + 8, 60, C.sage, C.moss), tintK * 1.2));
  hillL.add(T(olive(c, 250, hb.fn(250) + 10, 1.05) + olive(c, 1390, hb.fn(1390) + 10, 1.1) + olive(c, 1560, hb.fn(1560) + 14, 0.9) + cypress(c, 120, hb.fn(120) + 8, 150), tintK * 1.2));

  // the ground in front: grass, stones
  const groundL = S.layer({ par: 0.45, sh: 3 });
  const gfn = c.wave(636, [5, 2], [700, 170]);
  groundL.add(T(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.3)).out() + grass(c, { x0: -800, x1: 2400, y: 636, fn: gfn, n: 40, h: 13, color: C.olive }) + rock(c, 420, 650, 70, 24, C.rock) + rock(c, 1210, 648, 60, 20, C.rock2), tintK * 1.3));

  return {
    c, sk, starL, hangL, sunEl, moonEl, cl1, cityL, valL, hillL, groundL, glowEl, TEMPLE, T,
    /** foreground: rocks, grass and a low olive bough (call after the people) */
    front({ bough = true } = {}) {
      const fg = S.layer({ par: 0.95, sh: 6 });
      let m = bush(c, 110, 930, 230, '#8fa58a', C.moss) + rock(c, 1500, 930, 250, 90, C.rock2) + bush(c, 1660, 910, 170, C.moss);
      fg.add(T(m, tintK * 1.4));
      if (bough) fg.add(T(oliveBough(c, 1400, -40), tintK * 1.4));
      return fg;
    },
    /** idle life for the heavens (call every frame) */
    update(t, time, { sun: sunY = sunXY[1], moon: moonY = moonXY[1], sunO = 1, moonO = 0, glow = templeGlow, starsO = 0 } = {}) {
      swing(sunEl, sunXY[0], sunY, time, 1, 0.7);
      pose(sunEl, { x: sunXY[0], y: sunY, r: Math.sin(time * 0.7) * 1, o: sunO });
      pose(moonEl, { x: moonXY[0], y: moonY, r: Math.sin(time * 0.6 + 1) * 1.2, o: moonO });
      swing(cl1, 450 + Math.sin(time * 0.1) * 24, 160, time, 1.2, 0.6, 1);
      pose(glowEl, { x: TEMPLE[0], y: TEMPLE[1], s: 1 + Math.sin(time * 1.3) * 0.03, o: glow });
      starL.fade(starsO);
    },
  };
}

/** a low olive bough hanging into the top of the frame (foreground); origin world */
export function oliveBough(c, x, y) {
  const s = sheet();
  const br = c.qbez([x + 500, y - 40], [x + 120, y + 60], [x - 180, y + 130], 18);
  s.p(c.ribbon(br, (u) => 18 - u * 13), C.wood2);
  let lv = '', lv2 = '';
  br.forEach(([bx, by], i) => {
    if (i < 3) return;
    for (let k = 0; k < 3; k++) {
      const a = c.rr(0.6, 2.6), l = c.rr(26, 40);
      const d = c.cut(c.ell(bx + Math.cos(a) * l * 0.6, by + Math.sin(a) * l * 0.6, l * 0.55, 6, 10, a), 0.3, 4);
      if (k % 2) lv += d; else lv2 += d;
    }
  });
  s.p(lv, C.olive).p(lv2, mix(C.sage, C.olive, 0.4));
  return s.out();
}

/* ====================================================================== */
/* panels: plates, a map, a shadow screen                                 */
/* ====================================================================== */
/** a hanging picture plate: cream card with a parchment face and an ochre rule; origin: top centre */
export function plate(c, w, h, { face = C.parchment, card = C.cream, rule = C.ochre, rim = C.wood2 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 6, -6, w + 12, h + 12), 0.6, 10), rim);
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 10), card);
  s.p(c.cut(c.rect(-w / 2 + 10, 10, w - 20, h - 20), 0.4, 10), face);
  s.x(c.ribbon([[-w / 2 + 16, 16], [w / 2 - 16, 16], [w / 2 - 16, h - 16], [-w / 2 + 16, h - 16], [-w / 2 + 16, 16]], 1.4), rule, 'opacity=".55"');
  return `<path d="M${-w / 2 + 30} -6V${-2000}M${w / 2 - 30} -6V${-2000}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>` + s.out();
}
/** a parchment map on two rods; origin: top centre */
export function mapSheet(c, w, h, { col = mix(C.parchment, C.sand, 0.25) } = {}) {
  const s = sheet();
  const pts = [[-w / 2, 0], [w / 2, 0]];
  for (let y = 0; y <= h; y += 24) pts.push([w / 2 + c.rr(-3, 3), y]);
  for (let x = w / 2; x >= -w / 2; x -= 30) pts.push([x, h + c.rr(-3, 3)]);
  for (let y = h; y >= 0; y -= 24) pts.push([-w / 2 + c.rr(-3, 3), y]);
  s.p(c.cut(pts, 0.8, 10), col);
  const rod = (y) => c.cut(c.rect(-w / 2 - 16, y - 7, w + 32, 14), 0.3, 8);
  s.p(rod(0) + rod(h), C.wood2);
  s.p(c.cut(c.circ(-w / 2 - 20, 0, 9, 10), 0.2, 3) + c.cut(c.circ(w / 2 + 20, 0, 9, 10), 0.2, 3) + c.cut(c.circ(-w / 2 - 20, h, 9, 10), 0.2, 3) + c.cut(c.circ(w / 2 + 20, h, 9, 10), 0.2, 3), C.wood);
  return `<path d="M${-w / 2 + 20} -6V-2000M${w / 2 - 20} -6V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>` + s.out();
}
/** a lit shadow-play screen in a wooden frame; origin: top centre. Put silhouettes over it. */
export function shadowScreen(c, w, h, { paper = '#f7e6c4' } = {}) {
  const frame = sheet().p(c.cut(c.rect(-w / 2 - 12, -12, w + 24, h + 24), 0.6, 8), C.wood2).out();
  return `<path d="M${-w / 2 + 20} -12V-2000M${w / 2 - 20} -12V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${frame}<rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${paper}"/><circle cx="0" cy="${h * 0.55}" r="${w * 0.6}" fill="url(#warm-glow)" opacity=".7"/>`;
}
/** a round medallion plate; origin centre */
export function roundel(c, r, { face = C.parchment, rim = C.ochre } = {}) {
  return sheet().p(c.cut(c.circ(0, 0, r + 8, 48), 0.5, 6), rim).p(c.cut(c.circ(0, 0, r, 48), 0.5, 6), face).out();
}

/* ====================================================================== */
/* props                                                                  */
/* ====================================================================== */
/** a Herodian ashlar: a big stone with a drafted margin and a raised boss; origin top-left */
export function ashlar(c, w, h, col = mix(C.stone, C.cream, 0.3)) {
  const s = sheet();
  s.p(c.cut(c.rect(0, 0, w, h), 0.6, 10), shade(col, -0.06));
  const m = Math.min(12, h * 0.16);
  s.p(c.cut(c.rect(m, m, w - m * 2, h - m * 2), 0.5, 10), col);
  s.x(c.ribbon([[m + 2, h - m], [w - m, h - m], [w - m, m + 2]], 1.6), shade(col, -0.16), 'opacity=".6"');
  s.x(c.ribbon([[m, m + 1], [w - m - 2, m + 1]], 1.4), shade(col, 0.4), 'opacity=".7"');
  return s.out();
}
/** an hourglass; origin centre. .sandT / .sandB can be scaled (sy) */
export function hourglass(c, h = 80, { k } = {}) {
  const w = h * 0.42;
  const s = sheet();
  s.p(c.cut(c.rect(-w * 0.75, -h / 2 - 8, w * 1.5, 8), 0.3, 5) + c.cut(c.rect(-w * 0.75, h / 2, w * 1.5, 8), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w * 0.7, -h / 2, 4, h), 0.2, 5) + c.cut(c.rect(w * 0.7 - 4, -h / 2, 4, h), 0.2, 5), C.wood);
  const glass = [[-w / 2, -h / 2], [w / 2, -h / 2], [w * 0.1, -2], [w * 0.1, 2], [w / 2, h / 2], [-w / 2, h / 2], [-w * 0.1, 2], [-w * 0.1, -2]];
  s.x(c.poly(glass), '#f5efe2', 'opacity=".75"');
  const sandT = `<g class="sandT" transform="translate(0 -3)"><path d="${c.poly([[-w * 0.42, -h * 0.34], [w * 0.42, -h * 0.34], [w * 0.08, 0], [-w * 0.08, 0]])}" fill="${C.wheat2}"/></g>`;
  const sandB = `<g class="sandB" transform="translate(0 ${h / 2})"><path d="${c.poly([[-w * 0.46, 0], [w * 0.46, 0], [w * 0.2, -h * 0.2], [-w * 0.2, -h * 0.2]])}" fill="${C.wheat2}"/></g>`;
  const stream = `<path class="stream" d="${c.poly(c.rect(-1, 0, 2, h / 2 - 4))}" fill="${C.wheat2}"/>`;
  return `<g${k_(k)}>${sandT}${sandB}${stream}${s.out()}</g>`;
}
/** an empty clay bowl, tipped a little; origin bottom centre */
export function emptyBowl(c, w = 46, col = C.pot) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -w * 0.36, w / 2, w * 0.1, 16), 0.3, 4), shade(col, -0.35));
  s.p(c.cut([[-w / 2, -w * 0.36], ...c.arc(0, -w * 0.36, w / 2, w * 0.1, PI, 0, 8), [w / 2, -w * 0.36], [w * 0.3, -2], [w * 0.14, 0], [-w * 0.14, 0], [-w * 0.3, -2]], 0.4, 5), col);
  s.x(c.ribbon([[-w * 0.42, -w * 0.26], [w * 0.42, -w * 0.26]], 1.6), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/** a mask on a stick (golden, smiling, empty eyes); origin: centre of the face */
export function mask(c, { col = C.sun, r = 20, stick = true } = {}) {
  const s = sheet();
  if (stick) s.p(c.cut([[-2, r * 0.6], [2, r * 0.6], [3, r * 2.8], [-3, r * 2.8]], 0.2, 5), C.wood2);
  const pts = [[-r, -r * 0.2], ...c.arc(0, -r * 0.2, r, r, PI, 2 * PI, 12), [r, -r * 0.2], [r * 0.8, r * 0.5], [r * 0.3, r * 0.95], [-r * 0.3, r * 0.95], [-r * 0.8, r * 0.5]];
  s.p(c.cut(pts, 0.4, 5), col);
  s.x(c.poly(c.ell(-r * 0.38, -r * 0.18, r * 0.2, r * 0.11, 10)) + c.poly(c.ell(r * 0.38, -r * 0.18, r * 0.2, r * 0.11, 10)), INK);
  s.x(c.ribbon(c.arc(0, r * 0.22, r * 0.42, r * 0.28, 0.25, PI - 0.25, 8), 2.2), shade(col, -0.45));
  s.x(c.poly(c.star(-r * 0.62, -r * 0.62, r * 0.2, r * 0.06, 4, 0)) + c.poly(c.star(r * 0.66, -r * 0.4, r * 0.16, r * 0.05, 4, 0)), C.star);
  return s.out();
}
/** a little pennant on a pole: origin foot of the pole */
export function banner(c, col, { h = 60, w = 30 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-1.6, -h, 3.2, h), 0.2, 6), C.wood2);
  s.p(c.cut([[1.6, -h], [w, -h + 5], [w - 6, -h + 11], [w, -h + 18], [1.6, -h + 20]], 0.3, 4), col);
  return s.out();
}
/** a small toy soldier (side view, facing right) with a spear and shield; origin feet */
export function soldier(c, col, { h = 44 } = {}) {
  const s = sheet(), k = h / 44;
  s.p(c.cut(c.rect(14 * k, -h - 10 * k, 2 * k, h + 8 * k), 0.2, 6), C.wood2);
  s.p(c.cut([[14 * k, -h - 10 * k], [15 * k, -h - 18 * k], [17 * k, -h - 10 * k]], 0.1, 3), C.rock2);
  s.p(c.cut([[-6 * k, -h * 0.72], [6 * k, -h * 0.72], [8 * k, 0], [-8 * k, 0]], 0.3, 4), col);
  s.p(c.cut(c.circ(0, -h * 0.84, 5.5 * k, 10), 0.2, 3), C.skin2);
  s.p(c.cut([...c.arc(0, -h * 0.86, 6.2 * k, 6.2 * k, PI, 2 * PI, 6), [6.2 * k, -h * 0.84], [-6.2 * k, -h * 0.84]], 0.2, 3), C.rock3);
  s.p(c.cut(c.ell(7 * k, -h * 0.45, 5 * k, 9 * k, 12), 0.2, 3), shade(col, -0.25));
  return s.out();
}
/** a small paper crown; origin: bottom centre */
export function crownIcon(c, w = 40, col = C.sun) {
  return sheet().p(c.cut([[-w / 2, 0], [-w / 2, -w * 0.6], [-w * 0.25, -w * 0.3], [0, -w * 0.72], [w * 0.25, -w * 0.3], [w / 2, -w * 0.6], [w / 2, 0]], 0.3, 4), col)
    .x(c.poly(c.circ(0, -w * 0.15, w * 0.07, 8)), C.terracotta).out();
}
/** a green shoot (two leaves on a stem); origin at its foot */
export function shoot(c, h = 40) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([0, 0], [-3, -h * 0.5], [2, -h], 8), 3.2), C.moss);
  s.p(c.cut([[1, -h * 0.72], [-12, -h * 0.9], [-22, -h * 0.8], [-12, -h * 0.66]], 0.3, 3), C.leaf);
  s.p(c.cut([[2, -h * 0.95], [14, -h * 1.15], [24, -h * 1.08], [14, -h * 0.9]], 0.3, 3), mix(C.leaf, C.sage, 0.3));
  return s.out();
}
/** a hand of light reaching down (from the top) holding nothing; origin: finger tips */
export function lightHand(c, sc = 1) {
  const s = sheet();
  const P = (v) => v * sc;
  s.p(c.cut([[P(-26), P(-190)], [P(26), P(-190)], [P(24), P(-60)], [P(30), P(-30)], [P(20), P(-6)], [P(8), P(0)], [P(-4), P(-4)], [P(-16), P(-10)], [P(-26), P(-30)], [P(-24), P(-60)]], 0.5, 6), C.halo);
  s.x(c.ribbon([[P(-6), P(-40)], [P(-4), P(-10)]], 1.2) + c.ribbon([[P(6), P(-40)], [P(8), P(-8)]], 1.2), C.haloRim, 'opacity=".6"');
  return `<circle cy="${P(-50)}" r="${P(120)}" fill="url(#halo-glow)"/>` + s.out();
}
/** big paper scissors (open by rotating the .bladeA / .bladeB groups); origin: pivot */
export function scissorsBig(c, len = 120) {
  const blade = (dir) => {
    const s = sheet();
    s.p(c.cut([[0, -5], [len, -1 * dir], [len, 2 * dir], [0, 6]], 0.2, 6), mix(C.stone, C.skyBlue2, 0.4));
    s.p(c.cut(c.ell(-len * 0.32, dir * 12, 16, 11, 14), 0.3, 4), C.terracotta);
    s.x(c.poly(c.ell(-len * 0.32, dir * 12, 9, 5, 12)), C.cream);
    return s.out();
  };
  return `<g class="bladeA">${blade(1)}</g><g class="bladeB">${blade(-1)}</g><circle r="4" fill="${C.rock3}"/>`;
}
/** a day-card for a line of days: dark or light; origin: top centre (peg) */
export function dayCard(c, dark, w = 34, h = 44) {
  const s = sheet();
  const col = dark ? mix(C.night2, C.storm2, 0.4) : C.cream;
  s.p(c.cut([[-w / 2, 4], [w / 2, 3], [w / 2 + 1, h], [-w / 2 - 1, h + 1]], 0.4, 5), col);
  if (!dark) s.x(c.cut(c.circ(0, h * 0.55, w * 0.18, 10), 0.3, 3), C.sun, 'opacity=".8"');
  else s.x(c.cut(c.blob(0, h * 0.55, w * 0.22, w * 0.12, 8, 0.3), 0.6, 3), mix(C.storm, C.night, 0.3), 'opacity=".8"');
  s.p(c.cut(c.rect(-3, -2, 6, 9), 0.2, 3), C.wood3);
  return s.out();
}
/** a wooden signpost with a pointing arm and a word; origin: foot. dir: 1 → right */
export function pointer(c, text, { dir = 1, size = 18, col = C.wood3 } = {}) {
  const w = Math.max(80, text.length * size * 0.5 + 40);
  const s = sheet();
  s.p(c.cut(c.rect(-5, -150, 10, 150), 0.3, 6), C.wood2);
  const arm = dir > 0 ? [[-14, -140], [w - 18, -140], [w, -122], [w - 18, -104], [-14, -104]] : [[14, -140], [-w + 18, -140], [-w, -122], [-w + 18, -104], [14, -104]];
  s.p(c.cut(arm, 0.4, 6), col);
  const tx = dir > 0 ? (w - 14) / 2 : -(w - 14) / 2;
  return s.out() + `<text x="${tx}" y="${-116}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
/** a paper word-tag with italic text (no string); origin centre */
export function word(c, text, { size = 20, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.48 + size * 1.3, hh = size * 1.5;
  return sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill).out() +
    `<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a hand oil-lamp held out (flame .flame, glow .glow); origin: bottom of the lamp */
export function handLamp(c, { glowR = 110 } = {}) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [29, -9], [20, -2], [10, 1], [-12, 1]], 0.3, 4), C.pot);
  s.p(c.cut(c.circ(-3, -11, 5, 10), 0.2, 3), shade(C.pot, -0.3));
  return `<circle class="glow" cx="27" cy="-24" r="${glowR}" fill="url(#warm-glow)"/>${s.out()}<g class="flame" transform="translate(27 -12)"><path d="M0 0C-5 -4 -4.5 -12 0 -22C4.5 -12 5 -4 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-2 -5 -2 -8 0 -12C2 -8 2 -5 0 -2Z" fill="#fff4d2"/></g>`;
}
/** a snow-flake; origin centre */
export function flake(c, r = 6) {
  let d = '';
  for (let i = 0; i < 3; i++) { const a = (i / 3) * PI; d += c.ribbon([[Math.cos(a) * r, Math.sin(a) * r], [-Math.cos(a) * r, -Math.sin(a) * r]], 1.6); }
  return `<path d="${d}" fill="#fbf8f0"/>`;
}
/** a paper star on a thread (for the sky that falls); origin at the star centre, thread going up */
export function skyStar(c, r = 10, len = 900) {
  return `<g class="hang"><path class="thread" d="M0 ${-len}V${-r}" stroke="rgba(240,230,210,.4)" stroke-width="1" fill="none"/><g class="obj"><circle r="${r * 2.6}" fill="url(#warm-glow)" opacity=".55"/><path d="${c.cut(c.star(0, 0, r, r * 0.42, 5), 0.2, 3)}" fill="${C.star}"/></g></g>`;
}

/**
 * Tear a picture into pieces along roughly vertical jagged lines at xs (sorted).
 * Returns [{ markup, cx }] — each piece clipped from the same inner markup; ids must be unique (S.id()).
 */
export function tornPieces(c, inner, [x0, y0, x1, y1], xs, id) {
  const tears = xs.map((tx) => {
    const t = [];
    const n = 12;
    for (let i = 0; i <= n; i++) t.push([tx + c.rr(-10, 10) + (i % 2 ? 6 : -6), y0 - 20 + ((y1 - y0 + 40) * i) / n]);
    return t;
  });
  const edges = [[[x0 - 60, y0 - 20], [x0 - 60, y1 + 20]], ...tears, [[x1 + 60, y0 - 20], [x1 + 60, y1 + 20]]];
  const out = [];
  let defs = '<defs>';
  for (let k = 0; k < edges.length - 1; k++) {
    const L = edges[k], R = edges[k + 1];
    defs += `<clipPath id="${id}-${k}"><path d="${c.poly([...L, ...R.slice().reverse()])}"/></clipPath>`;
  }
  defs += '</defs>';
  for (let k = 0; k < edges.length - 1; k++) {
    const rim = (k > 0 ? c.ribbon(edges[k], 3) : '') + (k < edges.length - 2 ? c.ribbon(edges[k + 1], 3) : '');
    const cx = ((k === 0 ? x0 : xs[k - 1]) + (k === edges.length - 2 ? x1 : xs[k])) / 2;
    out.push({ markup: `<g clip-path="url(#${id}-${k})">${inner}<path d="${rim}" fill="${C.cream}" opacity=".95"/></g>`, cx, cy: (y0 + y1) / 2 });
  }
  // defs go to S.defs(defs) (one shared place), the pieces anywhere
  return { pieces: out, defs };
}

/* ====================================================================== */
/* the master's house (the parable of the doorkeeper)                     */
/* ====================================================================== */
export const HOUSE = { FLOOR: 690, X0: 380, X1: 990, GATE: 1052, ROOF: 336, ROAD: [[1052, 694], [1150, 684], [1250, 656], [1360, 614], [1460, 574], [1560, 540]] };
export const STATIONS = { well: 560, oven: 700, broom: 800, chest: 930 };

/** a stone well with a winch and a bucket; origin: foot centre */
export function well(c) {
  const s = sheet();
  s.p(c.cut([[-40, 0], [-40, -44], [40, -44], [40, 0]], 0.5, 6), C.stone);
  s.p(c.cut(c.ell(0, -44, 42, 8, 16), 0.3, 4), shade(C.stone, -0.3));
  let st = '';
  for (let y = -34; y < 0; y += 14) st += c.ribbon([[-38, y], [38, y]], 1.2);
  s.x(st, shade(C.stone, -0.18), 'opacity=".6"');
  s.p(c.cut(c.rect(-36, -110, 6, 68), 0.3, 5) + c.cut(c.rect(30, -110, 6, 68), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-40, -112, 80, 8), 0.3, 5), C.wood);
  s.x(c.ribbon([[0, -108], [0, -64]], 1.4), C.rope);
  s.p(c.cut([[-9, -66], [9, -66], [7, -50], [-7, -50]], 0.3, 4), C.wood3);
  return s.out();
}
/** a domed clay bread oven with a glowing mouth; origin: foot centre */
export function oven(c) {
  const s = sheet();
  s.p(c.cut([[-46, 0], ...c.arc(0, 0, 46, 60, PI, 2 * PI, 14), [46, 0]], 0.6, 6), C.clay);
  s.p(c.cut([[-16, 0], ...c.arc(0, 0, 16, 22, PI, 2 * PI, 8), [16, 0]], 0.3, 4), mix(C.soilDark, C.terracotta, 0.3));
  s.x(c.cut([[-10, 0], ...c.arc(0, 0, 10, 12, PI, 2 * PI, 6), [10, 0]], 0.3, 3), C.lampFlame, 'class="ember"');
  s.p(c.cut(c.ell(0, -58, 12, 4, 10), 0.2, 3), shade(C.clay, -0.25));
  return `<circle class="glow" cy="-10" r="70" fill="url(#warm-glow)"/>` + s.out();
}
/** a broom (held); origin: grip */
export function broom(c) {
  return sheet().p(c.ribbon([[0, -40], [4, 60]], 4), C.wood3).p(c.cut([[-4, 56], [12, 56], [22, 92], [-14, 92]], 0.6, 4), C.wheat2).out();
}
/** a big iron key; origin: its bow */
export function keyProp(c, col = C.ochre) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 9, 14), 0.3, 3) + c.hole(c.circ(0, 0, 4, 10), 0.2, 3), col);
  s.p(c.cut([[7, -2.5], [40, -2.5], [40, 2.5], [7, 2.5]], 0.2, 4) + c.cut(c.rect(30, 2, 5, 8), 0.2, 3) + c.cut(c.rect(36, 2, 4, 6), 0.2, 3), col);
  return s.out();
}
/** a rooster facing right; .head can be tipped up to crow; origin: feet */
export function rooster(c) {
  const s = sheet();
  s.p(c.cut([[-26, -26], [-6, -34], [12, -30], [18, -18], [8, -8], [-16, -8], [-30, -16]], 0.4, 4), C.cream);
  s.p(c.cut([[-26, -26], [-44, -52], [-38, -26], [-50, -40], [-36, -14]], 0.5, 4), mix(C.terracotta, C.plumRobe, 0.3));
  s.p(c.cut([[-18, -24], [-2, -26], [6, -16], [-12, -14]], 0.3, 3), shade(C.cream, -0.1));
  s.p(c.ribbon([[-4, -8], [-4, 0]], 2) + c.ribbon([[4, -8], [6, 0]], 2), C.ochre);
  const h = sheet();
  h.p(c.cut([[8, -30], [12, -44], [20, -48], [24, -42], [20, -30]], 0.3, 3), C.cream);
  h.p(c.cut([[12, -46], [14, -54], [18, -50], [20, -56], [24, -48]], 0.2, 3), C.terracotta);
  h.x(c.poly([[23, -44], [30, -42], [23, -40]]), C.ochre);
  h.x(c.poly(c.circ(19, -44, 1.3, 6)), C.ink);
  h.p(c.cut([[20, -38], [24, -38], [22, -32]], 0.2, 2), C.terracotta);
  return `${s.out()}<g class="head">${h.out()}</g>`;
}
/** "z z z" of a sleeper; origin at the first z */
export function zzz(c) {
  let out = '';
  [[0, 0, 12], [14, -16, 15], [30, -36, 18]].forEach(([x, y, r]) => { out += `<path d="${c.poly([[x - r / 2, y - r / 2], [x + r / 2, y - r / 2], [x - r / 2, y + r / 2], [x + r / 2, y + r / 2], [x + r / 2 - 3, y + r / 2 + 3], [x - r / 2 - 3, y + r / 2 + 3], [x + r / 2 - 6, y - r / 2 + 3], [x - r / 2, y - r / 2 + 3]])}" fill="${C.cream}"/>`; });
  return out;
}
/** the master: a well-to-do man dressed for the road */
export const MASTER = { robe: C.linen, mantle: C.teal2, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.ochre, beard: 'full', skin: C.skin2, belt: C.ochre };
export const SERVANTS = [
  { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope },
  { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, skin: C.skin2, belt: C.rope },
  { robe: C.wheatRobe, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin4, belt: C.rope },
  { robe: C.plumRobe, mantle: C.stone, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin, belt: C.leather },
];
export const DOORKEEPER = { robe: C.dustyBlue, mantle: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3, belt: C.leather };

/**
 * The master's house as layers: far hills with the road, the house (cut away: back wall, rooms, roof),
 * the courtyard props, the outer wall with the gate. Returns the layers so a scene can fly them out.
 */
export function houseSet(S, { tintCol = C.night, tintK = 0 } = {}) {
  const c = makeCutter('m13-house-set');
  const TT = (m) => tint(m, tintCol, tintK);
  const { FLOOR, X0, X1, GATE, ROOF, ROAD } = HOUSE;
  const farL = S.layer({ par: 0.1, sh: 2 });
  const h1 = hillsWith(c, { y: 500, amps: [14, 6, 2], lens: [900, 300, 120], color: C.hillFar, trees: 20, treeColor: C.sage, treeH: 20, x0: -1400, x1: 3000 });
  farL.add(TT(h1.markup));
  const roadL = S.layer({ par: 0.2, sh: 3 });
  const h2 = band(c, { y: 580, amps: [12, 5, 2], lens: [800, 300, 110], color: C.hillMid, x0: -1400, x1: 3000 });
  roadL.add(TT(h2.markup + sheet().p(c.ribbon([[GATE + 40, FLOOR + 6], [1240, 640], [1360, 600], [1460, 570], [1600, 540], [1800, 520]], (u) => 40 - u * 30), mix(C.sand, C.cream, 0.35)).out() + olive(c, 1300, 628, 0.7) + cypress(c, 1420, 590, 110)));
  // the house, cut away
  const houseL = S.layer({ par: 0.34, sh: 4 });
  const b = sheet();
  b.p(c.cut([[X0, ROOF], [X1, ROOF], [X1, FLOOR + 4], [X0, FLOOR + 4]], 0.8, 12), C.plaster);
  let patch = '';
  for (let i = 0; i < 10; i++) patch += c.cut(c.blob(c.rr(X0 + 30, X1 - 30), c.rr(ROOF + 30, FLOOR - 60), c.rr(20, 50), c.rr(10, 22), 10, 0.2), 0.6, 6);
  b.x(patch, C.plaster2, 'opacity=".6"');
  // the upper room: a floor beam, windows, a lamp niche
  b.p(c.cut([[X0, 482], [X1, 482], [X1, 494], [X0, 494]], 0.4, 10), C.wood2);
  let wins = '';
  [470, 640, 810].forEach((x) => { wins += c.cut([[x, 460], [x, 400], ...c.arc(x + 26, 400, 26, 22, PI, 2 * PI, 8), [x + 52, 460]], 0.4, 5); });
  b.p(wins, mix(C.soilDark, C.wood2, 0.3));
  b.p(c.cut([[X0 + 40, 600], [X0 + 40, 540], ...c.arc(X0 + 70, 540, 30, 26, PI, 2 * PI, 8), [X0 + 100, 600]], 0.4, 5), mix(C.soilDark, C.wood2, 0.3));
  // the courtyard floor
  b.p(c.cut([[X0 - 10, FLOOR - 6], [X1 + 10, FLOOR - 6], [X1 + 30, FLOOR + 40], [X0 - 30, FLOOR + 40]], 0.6, 10), mix(C.sand2, C.stone2, 0.4));
  houseL.add(TT(b.out()));
  // roof slab, parapet, the cut walls
  const f = sheet();
  f.p(c.cut([[X0 - 30, ROOF - 30], [X1 + 30, ROOF - 30], [X1 + 30, ROOF + 4], [X0 - 30, ROOF + 4]], 0.8, 10), mix(C.clay, C.sand2, 0.4));
  let ends = '';
  for (let x = X0 - 10; x < X1 + 20; x += 36) ends += c.cut(c.circ(x, ROOF - 10, 6, 10), 0.3, 3);
  f.p(ends, C.wood3);
  f.p(c.cut([[X0 - 30, ROOF - 50], [X1 + 30, ROOF - 50], [X1 + 30, ROOF - 30], [X0 - 30, ROOF - 30]], 0.4, 8), C.plaster2);
  f.p(c.cut([[X0 - 26, ROOF - 30], [X0, ROOF - 30], [X0, FLOOR + 40], [X0 - 32, FLOOR + 40]], 0.6, 10), C.stone);
  houseL.add(TT(f.out()));
  // courtyard things
  const propsL = S.layer({ par: 0.38, sh: 4 });
  propsL.add(TT(`<g transform="translate(${STATIONS.well} ${FLOOR})">${well(c)}</g>`));
  const ovenEl = propsL.add(TT(`<g transform="translate(${STATIONS.oven} ${FLOOR})">${oven(c)}</g>`));
  const chest = sheet();
  chest.p(c.cut(c.rect(STATIONS.chest - 30, FLOOR - 40, 60, 40), 0.4, 6), C.wood).p(c.cut(c.rect(STATIONS.chest - 32, FLOOR - 46, 64, 10), 0.3, 6), C.wood2).p(c.cut(c.rect(STATIONS.chest - 4, FLOOR - 36, 8, 10), 0.2, 3), C.ochre);
  propsL.add(TT(chest.out()));
  // the outer wall with the gate (in front of the courtyard's right end)
  const gateL = S.layer({ par: 0.4, sh: 5 });
  const g = sheet();
  const gx0 = GATE - 36, gx1 = GATE + 36;
  g.p(c.cut([[X1 - 20, FLOOR + 40], [X1 - 20, 470], [1130, 470], [1130, FLOOR + 40]], 0.6, 10) + c.hole([[gx0, FLOOR + 38], [gx0, 560], ...c.arc(GATE, 560, 36, 30, PI, 2 * PI, 10), [gx1, FLOOR + 38]], 0.4, 6), C.stone);
  let cr = '';
  for (let x = X1 - 20; x < 1130; x += 26) cr += c.cut(c.rect(x, 458, 14, 14), 0.2, 3);
  g.p(cr, C.stone);
  g.x(c.ribbon(c.arc(GATE, 560, 42, 36, PI, 2 * PI, 10), 5), shade(C.stone, -0.15));
  gateL.add(TT(g.out()));
  const gateDoor = gateL.add(TT(`<g>${sheet().p(c.cut(c.rect(0, -128, 34, 128), 0.4, 5), C.wood).x(c.ribbon([[10, -120], [10, -4]], 1.4) + c.ribbon([[22, -120], [22, -4]], 1.4), shade(C.wood, -0.25), 'opacity=".6"').out()}</g>`));
  return { farL, roadL, houseL, propsL, gateL, ovenEl, gateDoor, layers: [farL, roadL, houseL, propsL, gateL] };
}
