// Matthew 14 — the cast and cut-outs of this chapter. Most of it is borrowed so the same people look the same:
// Herod's court, John, the platter and the tomb from Mark 6; the green hill over the lake, the seated rows and
// the boat hull from John 6; sprite crowds and storm waves from Matthew 8. Here: a few pieces of our own —
// the oath scroll, a sword in a thought, a snuffed candle, a ghost, wind lines, the shroud, a helping hand.
import { C, CAST, person, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, waveStrip, stars, moon } from '../../assets/nature.js';
import { fade } from '../../core/anim.js';
import { stormWaves as stormWaves8 } from '../matthew8/lib.js';
import { tr } from '../../core/i18n.js';
import { folk as folk6, group as group6 } from '../john6/lib.js';

export {
  kf, moving, hand, headAt, speech, thought, GLYPH, spark, heart, wordSlip, loaf, bowl, cup, lantern, garland, candle, circlet,
  tambourine, lowTable, johnsOpts, coin, coinStack, scrollRolled, pallet, blanket, addToHead, addToBody,
  crown, helmet, faceBits, withFace, throne, portrait, labelTag, platter, storyFrame, SEPIA, tombRock, tombStone, basket, fishCut, crumb,
  oar, sickOnMat, awning, jesusWithFringe, tassels, noble, man, woman, sheep, LOOK as L6, DY,
} from '../mark6/lib.js';
export { hillSet, meadowRows, folk, group, hull, smallSail, capShore, DUSK, NIGHT, DAWN, GOLDEN, SPRING, MORNING, TW, hungGold, hungWord, glowDisc, rayBurst, waveIcon } from '../john6/lib.js';
export { mob, stormWaves, hangAt } from '../matthew8/lib.js';
export { pose3, bakeArms, tiltHead } from '../matthew4/lib.js';
export { cry, bubble } from '../mark5/lib.js';
export { shadowPerson, silhouette } from '../mark3/lib.js';
export { tr };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';

/* ================================================================== skies */
export const DAY = ['#c6ddd8', '#eeebd4', '#f7ead0'];
export const EVENING = ['#b7a2bd', '#eeb993', '#f6d6aa'];
export const NIGHT2 = ['#141a3d', '#26306a', '#4b5791'];

/* ================================================================== small things */
/** a sealed oath: a parchment sheet with lines and a red seal, hung on a string; origin top (string) */
export function oathSheet(c) {
  const s = sheet().p(c.cut(c.rect(-44, 0, 88, 108), 0.5, 6), C.parchment);
  s.x(c.ribbon([[-30, 22], [30, 22]], 1.4) + c.ribbon([[-30, 36], [26, 36]], 1.4) + c.ribbon([[-30, 50], [30, 50]], 1.4) + c.ribbon([[-30, 64], [18, 64]], 1.4), C.ink, 'opacity=".5"');
  return `${s.out()}<path d="${c.cut(c.circ(20, 90, 14, 16), 0.3, 3)}" fill="${C.terracotta}"/><path d="${c.cut(c.star(20, 90, 7, 3, 6, 0), 0.2, 2)}" fill="${shade(C.terracotta, -0.2)}"/>`;
}
/** a short sword (for Herod's dark thought); origin: the hilt, blade up */
export function swordIcon(c, len = 46) {
  const s = sheet();
  s.p(c.cut([[-4, -8], [4, -8], [2.5, -len], [0, -len - 7], [-2.5, -len]], 0.2, 3), C.stone2);
  s.p(c.cut(c.rect(-11, -9, 22, 5), 0.2, 3), C.ochre);
  s.p(c.cut(c.rect(-2.5, -4, 5, 12), 0.2, 3), C.wood2);
  return s.out();
}
/** a candle that has just gone out: a thin curl of smoke (the news of John's death); origin: base */
export function snuffedCandle(c, h = 34) {
  const s = sheet();
  s.p(c.cut([[-13, 0], [-10, -5], [-4, -6], [-3, -12], [3, -12], [4, -6], [10, -5], [13, 0]], 0.2, 3), C.sun);
  s.p(c.cut(c.rect(-5, -12 - h, 10, h), 0.2, 5), C.cream);
  s.x(c.ribbon([[0, -12 - h], [0, -17 - h]], 1.2), C.ink);
  const smoke = c.ribbon(c.cbez([0, -18 - h], [8, -28 - h], [-8, -38 - h], [3, -52 - h], 12), (u) => 2.6 - u * 2);
  return `${s.out()}<path d="${smoke}" fill="${C.stone2}" opacity=".85"/>`;
}
/** a white paper ghost (what the frightened disciples think they see); origin centre */
export function ghost(c) {
  const s = sheet();
  const pts = [...c.arc(0, -8, 14, 16, PI, 2 * PI, 10)];
  for (let x = 14; x > -14; x -= 7) pts.push(...c.arc(x - 3.5, 10, 3.5, 4, 0, PI, 3));
  s.p(c.cut(pts, 0.3, 3), '#f4f2ea');
  s.x(c.poly(c.ell(-5, -8, 2.2, 3.2, 8)) + c.poly(c.ell(5, -8, 2.2, 3.2, 8)) + c.poly(c.ell(0, 0, 3, 3.6, 8)), C.ink);
  return s.out();
}
/** streaks of wind as one sheet (slid on the compositor) */
export function windLines(c, { x0 = -1400, x1 = 3000, y0 = -200, y1 = 1100, n = 70, col = '#e8eef6' } = {}) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = c.rr(x0, x1), y = c.rr(y0, y1), l = c.rr(60, 160);
    d += c.ribbon(c.qbez([x, y], [x + l / 2, y - c.rr(4, 10)], [x + l, y], 8), (u) => Math.sin(u * PI) * 4 + 0.5);
  }
  return `<path d="${d}" fill="${col}" opacity=".7"/>`;
}
/** a body wrapped in a linen shroud, bound with cords (carried, never shown); origin: bottom centre */
export function shroud(c, w = 170) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], ...c.arc(-w / 2 + 16, -14, 16, 15, PI * 0.5, PI * 1.5, 8), [w / 2 - 14, -28], ...c.arc(w / 2 - 14, -14, 14, 14, -PI * 0.5, PI * 0.5, 8)], 0.6, 6), C.linen);
  let b = '';
  [-0.3, 0, 0.28].forEach((f) => { b += c.ribbon([[w * f, -29], [w * f + 3, 1]], 3); });
  s.x(b, C.rope, 'opacity=".8"');
  s.x(c.ribbon([[-w / 2 + 10, -8], [w / 2 - 10, -8]], 2), C.linen2, 'opacity=".7"');
  return s.out();
}
/** a guard's sword held upright (arm coords: hand at 0,0, arm pointing +y); for the executioner's shadow */
export function heldSword(c, len = 90) {
  return `<g transform="rotate(180)">${sheet().p(c.cut([[-3.5, -6], [3.5, -6], [2.2, -len], [0, -len - 8], [-2.2, -len]], 0.2, 3), C.stone2).p(c.cut(c.rect(-10, -8, 20, 5), 0.2, 3), C.ochre).out()}</g>`;
}
/** a little sun going down behind a hill (icon for "the hour is late"); origin centre */
export function sunsetIcon(c) {
  return `<path d="${c.cut([[-20, 8], ...c.arc(0, 8, 20, 18, PI, 2 * PI, 10), [20, 8]], 0.3, 4)}" fill="${C.sunDeep}"/><path d="${c.ribbon([[-26, 9], [26, 9]], 3)}" fill="${C.moss}"/>`;
}
/** coins → a loaf (icon for "go and buy food"); origin centre */
export function buyIcon(c, coinFn, loafFn) {
  return `<g transform="translate(-18 4)">${coinFn(c, 8)}</g><g transform="translate(-10 -4)">${coinFn(c, 7)}</g><path d="${c.ribbon([[-2, 2], [8, 2]], 2.4)}" fill="${C.ink}"/><path d="M8 -3L14 2L8 7Z" fill="${C.ink}"/><g transform="translate(24 10)">${loafFn(c, 11)}</g>`;
}
/** a small paper sign on a stake, stuck in the ground; origin: foot of the stake */
export function stakeSign(c, text, { size = 18 } = {}) {
  const ww = text.length * size * 0.5 + size * 1.4, hh = size * 1.4;
  const s = sheet().p(c.cut(c.rect(-3, -70, 6, 70), 0.3, 5), C.wood2).p(c.cut([[-ww / 2, -70 - hh], [ww / 2, -72 - hh], [ww / 2 + 2, -70], [-ww / 2 - 1, -68]], 0.4, 5), C.cream);
  return `${s.out()}<text x="0" y="${(-70 - hh / 2 + size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}

/**
 * A crowd on the meadow slope (John 6's hill) as still groups of five, each one sprite (moved and faded on the
 * compositor, never repainted). Returns [{ i, x, y, s1, sp }].
 */
export function slopeCrowd(S, L, sfn, { n = 13, x0 = 250, step = 95, cx = 800, pose: P = 'stand', size = 5, skip = 0 } = {}) {
  const c = S.c;
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step + c.rr(-24, 24);
    if (skip && Math.abs(x - cx) < skip) continue;
    const mem = Array.from({ length: size }, (_, k) => ({ x: (k - (size - 1) / 2) * 24 + c.rr(-6, 6), y: c.rr(-10, 10), s: 1, flip: x > cx, o: { ...folk6(c), pose: P } }));
    const dy = (i % 2) * 34 + c.rr(14, 30), s1 = 0.34 + dy * 0.0024;
    out.push({ i: out.length, x, y: sfn(x) + dy, s1, sp: L.sprite(`<g transform="scale(${s1.toFixed(4)})">${group6(c, mem)}</g>`, x, sfn(x) + dy) });
  }
  return out;
}

/* ================================================================== the lake at night, in the wind */
/**
 * The night lake of Mark 6 / John 6 as whole sheets: a night sky and a dawn sky, stars, the moon and dark clouds on
 * strings, the far hills, the moon path, storm waves behind and in front of the boat (slid on the compositor),
 * wind streaks and a blue night tint. update(t, T, { wind, dawnK, moonX, moonY }) runs the weather and returns
 * { heave, rock } for the boat.
 */
export function nightLake(S, { hills = true } = {}) {
  const c = S.c;
  sky(S, NIGHT2, { name: 'night' });
  const dawn = sky(S, ['#6d6f9e', '#d7a3a0', '#f2c9a4'], { name: 'dawn' }).layer;
  const starL = S.layer({ par: 0.02, sh: 1, flat: true });
  starL.add(stars(c, { x0: -800, x1: 2400, y0: -400, y1: 430, n: 150 }));
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const moonEl = hanging(hangL, `<circle r="120" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 40)}`, { x: 0, y: 0, len: 900 });
  const clouds = [[420, 120, 360], [1100, 90, 420], [780, 170, 300]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, sheet().p(c.cut(c.blob(0, 0, w / 2, w * 0.13, 14, 0.2), 1.2, 8), i % 2 ? '#3d4670' : '#4a5380').out(), { x, y, len: 900 }) }));
  if (hills) S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [14, 7, 3], lens: [1100, 380, 140], color: '#3a4270', x0: -1400, x1: 3200 }).markup);
  const water = S.layer({ par: 0.3, sh: 2 });
  water.add(band(c, { y: 480, amps: [3, 1.5], lens: [300, 90], color: '#4f6f8f', x0: -1400, x1: 3200, step: 10, j: 0.6 }).markup);
  const moonPath = water.add(`<g>${Array.from({ length: 12 }, (_, i) => `<path d="${c.cut([[-40, 0], [0, -2.4], [40, 0], [0, 1.8]], 0.2, 8)}" fill="#f5ecd6" transform="translate(${c.rr(-20, 20)} ${i * 22}) scale(${1 - i * 0.05} 1)"/>`).join('')}</g>`);
  const wBack = S.layer({ par: 0.5, sh: 4, pad: 300 });
  wBack.add(stormWaves8(c, { y: 690, len: 230, amp: 64, color: C.waveStorm }));
  return {
    c, dawn, starL, hangL, moonEl, clouds, water, moonPath, wBack,
    /** call after adding the boat layer: the front waves, the wind, the tint */
    front() {
      this.wFront = S.layer({ par: 0.8, sh: 6, pad: 300 });
      this.wFront.add(stormWaves8(c, { y: 810, len: 280, amp: 84, color: C.waveStorm2 }));
      this.windL = S.layer({ par: 0.85, sh: 1, flat: true, pad: 400 });
      this.windL.add(windLines(c));
      this.tint = S.layer({ par: 0, sh: 1, flat: true });
      this.tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);
    },
    update(t, T, { wind = 1, dawnK = 0, moonX = 1010, moonY = 150 } = {}) {
      const calm = 1 - wind;
      this.dawn.fade(dawnK);
      this.starL.fade(1 - dawnK * 0.9);
      this.tint.fade(0.22 * (1 - dawnK) + 0.04);
      swing(this.moonEl, moonX, moonY + dawnK * 300, T, 0.8, 0.5);
      fade(this.moonPath, 1 - dawnK);
      pose(this.moonPath, { x: 900 + S.cam.x * 0.3, y: 492 });
      this.clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.4 + cl.i) * 40 * wind, cl.y - calm * 300, T, 1.4 * wind + 0.2, 0.9, cl.i));
      const sp = 0.25 + wind;
      this.wBack.shift(-((T * 70 * sp) % 230) + 115, calm * 50 - Math.sin(T * 1.3) * 10 * wind);
      this.wFront.shift(-((T * 110 * sp) % 280) + 140, calm * 70 - Math.sin(T * 1.7 + 1) * 14 * wind);
      this.windL.shift(-((T * 700) % 800) + 400, 0);
      this.windL.fade(wind * 0.9);
      return { rock: wind * (Math.sin(T * 1.6) * 5 + Math.sin(T * 0.8) * 3), heave: wind * Math.sin(T * 1.2) * 10 };
    },
  };
}
/** a wave around someone's middle (he sinks behind it); origin: the water line at his centre */
export function waveCollar(c, w = 170, col = C.waveStorm2) {
  const pts = [[-w / 2, 8]];
  for (let i = 0; i <= 8; i++) { const x = -w / 2 + (i / 8) * w; pts.push([x, (i % 2 ? -10 : 2) - Math.sin((i / 8) * PI) * 12]); }
  pts.push([w / 2, 8], [w / 2 - 10, 160], [-w / 2 + 10, 160]);
  const s = sheet().p(c.cut(pts, 0.8, 6), col);
  s.x(c.ribbon(pts.slice(1, 10), (u) => 2 + Math.sin(u * PI) * 3), C.foam, 'opacity=".85"');
  return s.out();
}
