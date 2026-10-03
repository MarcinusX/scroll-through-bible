// Łk 24,53 — The end of the Gospel, where it began: in the Temple court (Luke 2's), gold with morning. The Eleven and the
// women stand before the sanctuary with their hands lifted, blessing God; the sanctuary shines, white doves wheel over
// the porticoes, and little lights of praise go up from them all the time.
import { C, blinkAt, pose, lerp, mix, flock } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { templeSet, TFLOOR, HEAVENLY, TW, MAGD, JOANNA, MARYJ, person, dove, sparkle, spark, heart } from './lib.js';

const ROW = [
  ['bartholomew', 420, 0], ['magd', 500, 0], ['jamesA', 580, 0], ['joanna', 1020, 0], ['maryj', 1100, 0], ['simonZ', 1180, 0],
  ['andrew', 460, 1], ['james', 560, 1], ['peter', 660, 1], ['john', 940, 1], ['thomas', 1040, 1], ['matthew', 1140, 1],
  ['philip', 380, 1], ['thaddaeus', 1230, 1],
];
const LOOK = { ...TW, magd: MAGD, joanna: JOANNA, maryj: MARYJ };

export default {
  id: 'lk24-temple',
  beats: [
    { v: 53 },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [0.92, 1.08] },
  build(S) {
    const c = S.c;
    const TS = templeSet(S, { skyCols: HEAVENLY, sunAt: [1230, 150] });
    TS.holyL.add(`<circle cx="${TS.sanctX}" cy="${TS.IW - 170}" r="330" fill="url(#halo-glow)"/>`);
    const birdL = S.layer({ par: 0.2, sh: 4 });
    const doves = flock(S, birdL, 6, (cc) => dove(cc), { y: 230, spread: 160, speed: 45, scale: 0.42 });
    const PL = S.layer({ par: 0.45, sh: 5 });
    // phone: they stand closer before the sanctuary, so the outer ones are not sliced by the frame and the thread
    const M = ROW.map(([k, x, r], i) => ({ k, x: S.portrait ? Math.round(792 + (x - 800) * 0.66) : x, i, y: TFLOOR + (r ? 56 : 0) + (i % 2) * 4, s: r ? 1.0 : 0.9, seed: c.rr(0, 9) })).sort((a, b) => a.y - b.y);
    M.forEach((m) => { m.p = S.puppet(PL.add(person(c, { ...LOOK[m.k] }))); });
    const fx = S.layer({ par: 0.47, sh: 5 });
    const praise = M.map((m, i) => fx.add(`<g>${i % 3 === 0 ? heart(c, 9) : i % 3 === 1 ? spark(c, 8) : sparkle(c, 11)}</g>`));

    return (t, T) => {
      doves(T, 1);
      /* v53: continually in the Temple, blessing God */
      const lift = es(t, 0.05, 0.45);
      M.forEach((m) => {
        const w = m.i % 3;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, armF: 24 + lift * (w === 0 ? 90 : 60), armB: 14 + lift * (w === 1 ? 150 : 120), head: -lift * 14, blink: blinkAt(T, m.seed) });
        const k = T ? ((T * 0.25 + m.i * 0.13) % 1) : ((m.i * 0.37) % 1);
        const on = es(t, 0.3 + (m.i % 5) * 0.05, 0.5 + (m.i % 5) * 0.05);
        pose(praise[m.i], { x: m.x + (m.x > 800 ? -8 : 8), y: m.y - 200 * m.s - k * 90, s: 0.6 + k * 0.5, r: T * 20, o: on * Math.sin(k * Math.PI) });
      });

      S.cam.x = 0;
      S.cam.y = 40;
      S.cam.z = S.portrait ? 0.94 : 1.02;
      void lerp; void mix; void bump; void seg; void fade;
    };
  },
};
