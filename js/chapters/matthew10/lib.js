// Matthew 10 — the cast and cut-outs of this chapter: the green hill where the Twelve are called and named (in
// pairs, each with a small sign of who he is), the village street with its houses (worthy and unworthy), the dark
// hall of councils and kings, and the little props of the missionary discourse. Parallel drawings are reused from
// Mark 3 (the Twelve, name tags), Mark 6 (the sending), Mark 13 (persecution) and others.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, house, sun, moon, cloud, stars, rock, grass, olive, cypress, bush, flowers, palm } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { hillSet } from '../john6/lib.js';
import { question, TWELVE as T12 } from '../mark3/lib.js';
import { square } from '../mark6/lib.js';
import { coin } from '../mark2/lib.js';
import { flame } from '../mark1/lib.js';

export { nameTag, strip, crutch, question, tornPair, shadowPerson, silhouette, faceBits, withFace, dove as spreadDove, heart as bigHeart, stoneHeart, scrollRoll } from '../mark3/lib.js';
export { staff, bag, purse, tunic, sandals, crossX, tick, disc, sheep, throne, crown, helmet, labelTag, square, sickOnMat, oilFlask, LOOK as L6 } from '../mark6/lib.js';
export { kf, moving, hand, headAt, speech, thought, GLYPH, spark, dust, coin, cup, loaf, bowl, wordSlip, scrap, addToHead, addToBody, wreath, lantern, heart } from '../mark2/lib.js';
export { dove, flapWings, snake, flame, voiceRings, sparkle, LEPER, LEPER_HEALED, POSSESSED, leperSpots, handLamp, jug } from '../mark1/lib.js';
export { wolf } from '../john10/lib.js';
export { folk, group, SPRING, NOON, GOLDEN, DUSK, NIGHT, DAWN, MORNING } from '../john6/lib.js';
export { pose3, bakeArms, tiltHead, lightShaft, goldSlip } from '../matthew4/lib.js';
export { radiance, rayBurst, glowDisc, doorHouse } from '../john1/lib.js';
export { shadowScreen, hourglass, lightHand, globe } from '../mark13/lib.js';
export { priest, elder, oliveBranch } from '../mark11/lib.js';
export { sword } from '../mark14/lib.js';
export { child } from '../matthew3/lib.js';
export { spirit, bubble, cry } from '../mark5/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
export const INK = '#3b2a22';

/* ================================================================== the Twelve */
/** the Twelve as Matthew names them, two by two (looks as in Mark 3 / Mark 6) */
const BY = Object.fromEntries(T12.map((m) => [m.k, m]));
export const MT12 = ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew', 'thomas', 'matthew', 'jamesA', 'thaddaeus', 'simonZ', 'judas'].map((k, i) => ({ k, i, pair: i >> 1, o: BY[k].o, name: BY[k].name }));
/** where each of the Twelve stands in the ring round Jesus on the hill: pair 0 inner-left, 1 inner-right, 2, 3 … outward */
export const RING = MT12.map((m) => {
  const left = m.pair % 2 === 0;
  const tier = m.pair >> 1;                        // 0 inner … 2 outer
  const slot = tier * 2 + (m.i % 2);               // 0..5 outward from the centre
  const x = 800 + (left ? -1 : 1) * (84 + slot * 50);
  return { x, dy: -14 + slot * 6, s: 0.76 + slot * 0.02, flip: !left, left, slot };
});

/* ================================================================== skies */
export const DAY = ['#c6ddd8', '#eeebd4', '#f7ead0'];
export const EVENING = ['#9b8fb2', '#e6ae90', '#f4cea3'];
export const HALL = mix(C.night2, C.plumRobe, 0.35), HALL2 = mix(C.night2, C.plumRobe, 0.2);

/* ================================================================== the green hill (scenes 1–3, 5, 8) */
/** John 6's mountainside over the lake, always cut with the same scissors so it looks the same in every scene */
export function hill(S, opts = {}) {
  return hillSet({ ...S, c: makeCutter('mt10-hill') }, opts);
}

/* ================================================================== a village street */
/**
 * A village: sky, sun and clouds on strings, hills with far towns, and a street of flat-roofed houses (layer `row`,
 * par 0.3). Ground at GY. Returns { sk, gfn, row, ground, update(t, T) }.
 */
export function village(S, { skyCols = DAY, sunAt = [1240, 140], houses = true, seed = 'mt10-village', night = false } = {}) {
  const c = makeCutter(seed);
  const sk = sky(S, skyCols);
  const nightL = night ? sky(S, ['#1d2349', '#39407a', '#6b6f9a'], { name: 'night' }).layer : null;
  const starL = night ? S.layer({ par: 0.02, sh: 1, flat: true }) : null;
  if (night) starL.add(stars(c, { x0: -800, x1: 2400, y0: -500, y1: 380, n: 110 }));
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 44), { x: sunAt[0], y: sunAt[1], len: 700 });
  const moonEl = night ? hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 34)}`, { x: 0, y: -600, len: 900 }) : null;
  const cl = [[430, 150, 200], [990, 200, 150]].map(([x, y, w], i) => ({ el: hanging(hangL, cloud(c, w), { x, y, len: 620 }), x, y, i }));
  S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 396, amps: [16, 7, 3], lens: [1000, 380, 130], color: C.hillFar }).markup);
  const hl = S.layer({ par: 0.16, sh: 3 });
  const hw = hillsWith(c, { y: 452, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 18, treeColor: C.sage, treeH: 22 });
  hl.add(hw.markup + town(c, { x: 260, y: hw.fn(260) + 14, n: 7, spread: 380, sc: 0.55 }) + town(c, { x: 1380, y: hw.fn(1380) + 14, n: 6, spread: 360, sc: 0.55 }));
  const row = S.layer({ par: 0.3, sh: 4 });
  const base = 614;
  if (houses) {
    let hs = '';
    let x = -760, i = 0;
    while (x < 2400) {
      const w = c.rr(110, 160), h = c.rr(96, 140);
      if (x > 300 && x < 1200) { x += 60; continue; }            // the square stays open
      hs += house(c, x, base + c.rr(-4, 4), w, h, { wall: i % 3 === 1 ? C.plaster2 : C.plaster, shadow: shade(C.plaster2, -0.06), stairs: i % 2 === 0 });
      x += w + c.rr(40, 90); i++;
    }
    row.add(hs + palm(c, 1290, base + 2, 170) + olive(c, 250, base + 2, 0.7) + cypress(c, 1480, base, 130));
  }
  const ground = S.layer({ par: 0.4, sh: 3 });
  const gfn = c.wave(base + 6, [3, 1.5], [700, 180]);
  ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.25)).out());
  let stones = '';
  for (let k = 0; k < 70; k++) { const px = c.rr(-600, 2200), py = c.rr(base + 26, base + 300); stones += c.cut(c.blob(px, py, c.rr(8, 18), c.rr(4, 8), 8, 0.2), 0.4, 4); }
  ground.add(sheet().x(stones, C.sand2, 'opacity=".7"').out());
  ground.add(grass(c, { x0: -600, x1: 2200, y: base + 6, fn: gfn, n: 24, h: 12, color: C.olive }));
  const dimL = night ? S.layer({ par: 0.4, sh: 1, flat: true }) : null;
  if (night) dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".42"/>`);
  return {
    c, sk, gfn, row, ground, hangL, sunEl,
    /** night: 0 day … 1 full night (fades the night sky and stars, lowers the sun, raises the moon) */
    update(t, T, { sunY = sunAt[1], sunO = 1, night: nk = 0, moonX = 460 } = {}) {
      pose(sunEl, { x: sunAt[0], y: sunY + nk * 700, r: Math.sin(T * 0.7) * 1.1, o: sunO });
      if (nightL) { nightL.fade(nk * 0.92); starL.fade(nk); dimL.fade(nk); pose(moonEl, { x: moonX, y: 170 + (1 - nk) * 700, r: Math.sin(T * 0.5) * 0.8, o: nk > 0.01 ? 1 : 0 }); }
      cl.forEach((k) => swing(k.el, k.x + Math.sin(T * 0.1 + k.i * 2) * 26, k.y, T, 1.4, 0.6 + k.i * 0.2, k.i));
    },
  };
}

/** a house with a door that opens (leaf swings on its left edge), a window and a flat roof; origin bottom-left.
 *  Returns { wall, leaf, glow, door:[dx, dw, dh], win:[wx, wy, ww, wh] } */
export function openHouse(c, { w = 230, h = 200, wall = C.plaster, shadow = C.plaster2, roof = C.roof, dw = 58, dh = 104 } = {}) {
  const s = sheet();
  const dx = w * 0.2, wx = w * 0.62, wy = -h * 0.72, ww = 40, wh = 34;
  const doorPts = [[dx, 2], [dx, -dh + dw / 2], ...c.arc(dx + dw / 2, -dh + dw / 2, dw / 2, dw / 2, PI, 2 * PI, 8), [dx + dw, 2]];
  const winPts = c.rect(wx, wy, ww, wh);
  s.p(c.cut(c.rect(0, -h, w, h + 4), 0.6, 8) + c.hole(doorPts, 0.3, 6) + c.hole(winPts, 0.3, 5), wall);
  s.p(c.cut([[w, -h], [w + w * 0.14, -h + 10], [w + w * 0.14, 4], [w, 4]], 0.4, 6), shadow);
  s.p(c.cut([[-6, -h - 8], [w + 6, -h - 8], [w + 6, -h + 2], [-6, -h + 2]], 0.3, 6), roof);
  let beams = '';
  for (let x = 12; x < w; x += 30) beams += c.cut(c.circ(x, -h - 3, 4, 8), 0.2, 3);
  s.p(beams, C.wood3);
  s.p(c.ribbon([[dx - 4, 2], [dx - 4, -dh + dw / 2]], 6) + c.ribbon([[dx + dw + 4, 2], [dx + dw + 4, -dh + dw / 2]], 6) + c.ribbon(c.arc(dx + dw / 2, -dh + dw / 2, dw / 2 + 4, dw / 2 + 4, PI, 2 * PI, 8), 6), C.wood2);
  s.p(c.ribbon([[wx - 3, wy + wh + 3], [wx + ww + 3, wy + wh + 3]], 5), C.wood2);
  // stairs to the roof on the right
  let st = '';
  for (let i = 0; i < 6; i++) st += c.cut(c.rect(w + w * 0.14 + i * 8, -(i + 1) * (h / 7), 12, 5), 0.2, 3);
  s.p(st, shade(shadow, -0.08));
  const inside = `<path d="${c.poly(doorPts)}" fill="${mix(C.soilDark, C.night, 0.3)}"/><path d="${c.poly(winPts)}" fill="${mix(C.soilDark, C.night, 0.3)}"/>`;
  const glow = `<path d="${c.poly(doorPts)}" fill="${C.lampGlow}"/><path d="${c.poly(winPts)}" fill="${C.lampGlow}"/><circle cx="${wx + ww / 2}" cy="${wy + wh / 2}" r="90" fill="url(#warm-glow)"/><circle cx="${dx + dw / 2}" cy="${-dh * 0.5}" r="110" fill="url(#warm-glow)"/>`;
  const leaf = sheet().p(c.cut(doorPts.map(([x, y]) => [x - dx, y]), 0.3, 5), C.wood2).x(c.ribbon([[dw * 0.25, -8], [dw * 0.25, -dh + 20]], 2) + c.ribbon([[dw * 0.6, -8], [dw * 0.6, -dh + 14]], 2), shade(C.wood2, -0.2), 'opacity=".6"').out();
  return { wall: s.out(), inside, glow, leaf, door: [dx, dw, dh], win: [wx, wy, ww, wh] };
}

/* ================================================================== the dark hall (councils, governors, kings) */
export function hallSet(S) {
  const c = makeCutter('mt10-hall');
  sky(S, [HALL, HALL, HALL2]);
  const back = S.layer({ par: 0.12, sh: 3 });
  const s = sheet();
  s.p(c.cut([[-1400, -1400], [3000, -1400], [3000, 640], [-1400, 640]], 0.4, 30), HALL);
  let arches = '', pil = '';
  for (let x = -1300; x < 3000; x += 260) {
    arches += c.cut([[x + 40, 620], [x + 40, 250], ...c.arc(x + 130, 250, 90, 90, PI, 2 * PI, 14), [x + 220, 620]], 0.5, 8);
    pil += c.cut(c.rect(x - 22, 120, 44, 520), 0.4, 10);
  }
  s.p(arches, HALL2);
  s.p(pil, mix(HALL, C.stone2, 0.18));
  s.p(c.cut([[-1400, 96], [3000, 96], [3000, 130], [-1400, 130]], 0.4, 20), mix(HALL, C.sun, 0.25));
  back.add(s.out());
  const lamps = [300, 1300].map((x) => back.add(`<g><circle cx="${x}" cy="200" r="120" fill="url(#warm-glow)" opacity=".7"/><path d="${c.cut(c.ell(x, 206, 22, 8, 12), 0.3, 3)}" fill="${C.ochre}"/><path d="M${x} -1400V200" stroke="rgba(240,220,190,.3)" stroke-width="1.2"/></g>`));
  const flo = S.layer({ par: 0.42, sh: 3 });
  const f = sheet();
  const col = mix(C.stone2, C.plumRobe, 0.35);
  f.p(c.cut([[-1400, 630], [3000, 630], [3000, 1800], [-1400, 1800]], 0.5, 20), col);
  let d = '';
  [650, 680, 724, 790, 890].forEach((y) => { d += c.ribbon([[-1400, y], [3000, y]], 1.4); });
  for (let k = -16; k <= 16; k++) d += c.ribbon([[800 + k * 60, 630], [800 + k * 170, 1300]], 1.2);
  f.x(d, shade(col, -0.2), 'opacity=".5"');
  flo.add(f.out());
  return { c, back, flo, update(T) { lamps.forEach((el, i) => pose(el, { o: 0.75 + Math.sin(T * 2 + i) * 0.1 })); } };
}

/* ================================================================== the signs of the Twelve (icons, origin centre, ~44 across) */
export function rockIcon(c) {
  return sheet().p(c.cut(c.blob(0, 2, 22, 14, 10, 0.2).map(([x, y]) => [x, Math.min(y, 10)]), 0.8, 4), C.rock2).x(c.cut([[-10, -4], [0, -9], [8, -3], [-2, -1]], 0.3, 3), shade(C.rock2, 0.35), 'opacity=".8"').out();
}
export function fishIcon(c, col = C.lake3) {
  return sheet().p(c.cut([[-22, 0], [-6, -9], [10, -8], [22, 0], [10, 8], [-6, 8], [-22, 0], [-32, -9], [-30, 0], [-32, 9]], 0.3, 4), col).x(c.ribbon(c.arc(4, 0, 5, 7, -1.2, 1.2, 6), 1.2), shade(col, -0.25), 'opacity=".6"').x(c.poly(c.circ(12, -2, 1.6, 6)), C.ink).out();
}
/** Zebedee's boat, small */
export function boatIcon(c) {
  const s = sheet();
  s.p(c.cut([[-30, -8], [30, -8], [22, 6], [-22, 6]], 0.4, 4), C.wood);
  s.p(c.ribbon([[-28, -6], [28, -6]], 3), C.terracotta);
  s.p(c.cut([[-1, -8], [2, -8], [2, -40], [-1, -40]], 0.2, 4), C.wood2);
  s.p(c.cut([[4, -36], [22, -12], [4, -12]], 0.3, 4), C.sail);
  return s.out();
}
/** a folded fishing net with floats */
export function netIcon(c) {
  const s = sheet();
  s.p(c.cut([[-20, -16], [20, -18], [24, 14], [-24, 16]], 0.8, 5), mix(C.rope, C.cream, 0.3));
  let m = '';
  for (let i = -3; i <= 3; i++) m += c.ribbon([[-20 + i * 2, -16], [-8 + i * 7, 16]], 1) + c.ribbon([[20 + i * 2, -18], [8 + i * 7, 14]], 1);
  s.x(m, shade(C.rope, -0.3), 'opacity=".6"');
  s.p(c.cut(c.circ(-14, -16, 4, 8), 0.2, 2) + c.cut(c.circ(0, -18, 4, 8), 0.2, 2) + c.cut(c.circ(14, -18, 4, 8), 0.2, 2), C.terracotta);
  return s.out();
}
/** two small barley loaves (Philip) */
export function loavesIcon(c) {
  const one = (x, y) => c.cut(c.ell(x, y, 14, 8, 14), 0.4, 4);
  return sheet().p(one(-8, 4) + one(8, -4), C.wheat2).x(c.ribbon([[-14, 2], [-4, 0]], 1.2) + c.ribbon([[2, -6], [12, -8]], 1.2), shade(C.wheat2, -0.25), 'opacity=".7"').out();
}
/** a fig leaf (Bartholomew, whom Jesus saw under the fig tree) */
export function figLeaf(c) {
  const pts = [[0, 20], [-6, 8], [-20, 6], [-14, -2], [-22, -12], [-10, -12], [-8, -22], [0, -14], [8, -22], [10, -12], [22, -12], [14, -2], [20, 6], [6, 8]];
  return sheet().p(c.cut(pts, 0.4, 4), C.leaf).x(c.ribbon([[0, 20], [0, -12]], 1.4) + c.ribbon([[0, 2], [-12, -6]], 1) + c.ribbon([[0, 2], [12, -6]], 1), shade(C.leaf, -0.3), 'opacity=".6"').out();
}
/** a builder's square (Thomas) */
export const squareIcon = (c) => `<g transform="translate(-16 16) scale(.9)">${square(c)}</g>`;
/** a written scroll with a quill (Matthew, who wrote this Gospel) */
export function scrollIcon(c) {
  const s = sheet();
  s.p(c.cut([[-18, -14], [18, -14], [18, 14], [-18, 14]], 0.3, 5), C.parchment);
  s.p(c.cut(c.ell(-19, 0, 4, 15, 10), 0.2, 3) + c.cut(c.ell(19, 0, 4, 15, 10), 0.2, 3), C.wood2);
  let d = '';
  for (let i = 0; i < 4; i++) d += c.ribbon([[-12, -8 + i * 5], [12 - (i % 2) * 5, -8 + i * 5]], 1.1);
  s.x(d, C.ink, 'opacity=".5"');
  s.p(c.cut([[10, 10], [30, -22], [26, -26], [8, 6]], 0.2, 3), C.cream);
  return s.out();
}
/** a handful of coins (the tax collector's past) */
export function coinsIcon(c) { return `<g transform="translate(-10 4)">${coin(c, 9)}</g><g transform="translate(8 -2)">${coin(c, 10)}</g><g transform="translate(-1 -12)">${coin(c, 8)}</g>`; }
/** a lit clay lamp (James son of Alphaeus) */
export const lampIcon = (c) => `<g transform="translate(-6 10) scale(.62)">${oilLamp(c)}</g>`;
/** a little "?" bubble (Thaddaeus, who asked "Lord, how is it…?" — Jn 14,22) */
export const questionIcon = (c) => `<g transform="translate(0 -4) scale(.9)">${question(c)}</g>`;
/** a flame of zeal (Simon the Zealot) */
export const flameIcon = (c) => `<circle r="40" fill="url(#warm-glow)"/><g transform="translate(0 18)">${flame(c, 44)}</g>`;
/** the money bag (Judas), cut from dark paper */
export function darkPurse(c) {
  const s = sheet();
  const col = mix(C.leather, C.night2, 0.45);
  s.p(c.cut([[-8, -16], [8, -16], [12, -6], [18, 8], [12, 18], [-12, 18], [-18, 8], [-12, -6]], 0.5, 4), col);
  s.p(c.ribbon([[-10, -9], [10, -9]], 3), shade(C.rope, -0.3));
  return s.out();
}
export const SIGNS = { peter: rockIcon, andrew: fishIcon, james: boatIcon, john: netIcon, philip: loavesIcon, bartholomew: figLeaf, thomas: squareIcon, matthew: scrollIcon, jamesA: lampIcon, thaddaeus: questionIcon, simonZ: flameIcon, judas: darkPurse };

/* ================================================================== other props */
/** a small sparrow (house sparrow, brown), facing right; wings .wingF/.wingB like things.bird; origin centre */
export function sparrow(c, { k } = {}) {
  const body = mix(C.wood3, C.soil, 0.35), back = mix(C.wood2, C.soil, 0.4), belly = mix(C.cream, C.sand2, 0.4);
  const s = sheet();
  s.p(c.cut([[-16, -2], [-8, -8], [4, -9], [12, -5], [12, 2], [2, 6], [-10, 4], [-22, 4], [-26, 0]], 0.3, 4), body);
  s.p(c.cut([[-4, 1], [8, 0], [10, 4], [0, 6]], 0.2, 3), belly);
  s.p(c.cut(c.circ(12, -8, 6.5, 10), 0.2, 3), back);
  s.x(c.cut([[8, -5], [16, -4], [14, 0], [8, -1]], 0.1, 2), C.cream);
  s.x(c.poly([[18, -9], [23, -7], [18, -5.5]]), C.ink);
  s.x(c.poly(c.circ(14, -9.5, 1.3, 6)), C.ink);
  const wing = (col) => `<path d="${c.cut([[0, 0], [-9, -16], [-18, -20], [-14, -8], [-6, -1]], 0.3, 3)}" fill="${col}"/>`;
  return `<g${k ? ` data-k="${k}"` : ''} class="bird"><g class="wingB" transform="translate(-2 -6)">${wing(shade(back, -0.2))}</g>${s.out()}<g class="wingF" transform="translate(-2 -5)">${wing(back)}</g></g>`;
}
/** a hanging balance: beam + two pans on cords; returns { frame, beam, panL, panR } (frame origin: the pivot; pans hang from ±arm) */
export function balance(c, { arm = 130, drop = 120, pan = 70, col = C.ochre } = {}) {
  const frame = sheet().p(c.cut([[-6, 0], [6, 0], [8, -80], [-8, -80]], 0.3, 5), shade(col, -0.2)).p(c.cut(c.circ(0, 0, 9, 12), 0.3, 3), col).out();
  const beam = sheet().p(c.cut([[-arm - 6, -4], [arm + 6, -4], [arm + 6, 4], [-arm - 6, 4]], 0.4, 8), col).p(c.cut(c.circ(-arm, 0, 5, 8), 0.2, 3) + c.cut(c.circ(arm, 0, 5, 8), 0.2, 3), shade(col, -0.25)).out();
  const panM = () => {
    const s = sheet();
    s.x(c.ribbon([[0, 0], [-pan * 0.46, drop]], 1) + c.ribbon([[0, 0], [pan * 0.46, drop]], 1), C.ink, 'opacity=".55"');
    s.p(c.cut([...c.arc(0, drop, pan / 2, 18, 0, PI, 12)], 0.4, 5), shade(col, -0.1));
    s.p(c.cut(c.ell(0, drop, pan / 2, 5, 16), 0.3, 4), shade(col, 0.15));
    return s.out();
  };
  return { frame, beam, panL: panM(), panR: panM() };
}
/** a plain wooden cross for carrying on the shoulder; origin: where it rests on the shoulder */
export function carryCross(c, h = 150, col = C.wood3) {
  const s = sheet();
  s.p(c.cut([[-5, -h * 0.35], [5, -h * 0.35], [5, h * 0.65], [-5, h * 0.65]], 0.4, 6), col);
  s.p(c.cut([[-h * 0.26, -h * 0.18], [h * 0.26, -h * 0.18], [h * 0.26, -h * 0.1], [-h * 0.26, -h * 0.1]], 0.4, 6), col);
  s.x(c.ribbon([[-1, -h * 0.3], [1, h * 0.6]], 1), shade(col, -0.25), 'opacity=".5"');
  return s.out();
}
/** a ruined, smouldering town (Sodom and Gomorrah) painted on a plate; origin centre */
export function ruinsIcon(c, w = 150, h = 90) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.4, 8), mix(C.dusk, C.apricot, 0.4));
  s.p(c.cut([[-w / 2, h / 2], [-w / 2, 10], [-w * 0.2, 4], [w * 0.1, 12], [w / 2, 2], [w / 2, h / 2]], 0.6, 8), mix(C.soil, C.dune, 0.4));
  let ru = '';
  [[-50, 18, 16, 20], [-30, 14, 12, 30], [-8, 20, 18, 16], [20, 16, 14, 26], [44, 12, 16, 18]].forEach(([x, y, ww, hh]) => { ru += c.cut([[x, y], [x, y - hh], [x + ww * 0.4, y - hh + 6], [x + ww, y - hh + 2], [x + ww, y]], 0.6, 4); });
  s.p(ru, mix(C.rock3, C.soilDark, 0.4));
  let sm = '';
  for (let i = 0; i < 3; i++) sm += c.ribbon(c.cbez([-40 + i * 34, -2], [-50 + i * 34, -18], [-30 + i * 34, -26], [-38 + i * 34, -40], 10), (u) => 7 - u * 4);
  s.x(sm, C.rock3, 'opacity=".6"');
  return s.out();
}
/** a painted plate on a string: cream card, parchment face, a picture and a caption; origin: top centre */
export function plateCard(c, inner, word, { w = 180, h = 140, face = C.parchment, ink = C.ink } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.6, 8), C.cream);
  s.p(c.cut(c.rect(-w / 2 + 8, 8, w - 16, h - 16 - (word ? 22 : 0)), 0.4, 8), face);
  const lab = word ? `<text x="0" y="${h - 12}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${ink}">${word}</text>` : '';
  return `${s.out()}<g transform="translate(0 ${(h - (word ? 22 : 0)) / 2 + 2})">${inner}</g>${lab}`;
}
/** a word on a paper strip hung from the flies; origin at its centre */
export function hungStrip(c, text, { size = 24, fill = C.cream, ink = C.ink, w } = {}) {
  const ww = w || text.length * size * 0.5 + size * 1.4, hh = size * 1.55;
  const s = sheet().p(c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 2], [ww / 2 + 2, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6), fill);
  return `<path d="M${-ww / 2 + 16} ${-hh / 2}V-2000M${ww / 2 - 16} ${-hh / 2}V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${ink}">${text}</text>`;
}
/** a place a hung thing: k 0 (up in the flies) … 1 (in place) */
export function drop(el, x, y, k, time = 0, seed = 0, amp = 1.6) {
  pose(el, { x, y: y - (1 - k) * 900, r: Math.sin(time * 1.1 + seed) * amp * k, o: k > 0.003 ? 1 : 0 });
}
