// Mt 28,8 — They hurry away from the tomb (small, far off on the right, its doorway open) "with fear and great
// joy": a little shiver still round their heads, but hearts and sparks of joy rising all about them, and the sun
// bursting out. Then they run — skirts flying, leaning into it — along the road towards the city, where the faces of
// the Eleven come down over the walls: they run to tell his disciples.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, flock } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { MAGD, MARYJ, ELEVEN, GOLD, roadSet, roadY, medallion, heart, sparkle, shakeLines, headAt, bird, rays } from './lib.js';

export default {
  id: 'mt28-run',
  beats: [
    { v: 8, text: 'Pośpiesznie więc oddaliły się od grobu, z bojaźnią i wielką radością,' },
    { v: 8, cont: true, text: 'i biegły oznajmić to Jego uczniom.' },
  ],
  cam: { x: [-420, 260], y: [-20, 40], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunGlow = hangL.add(`<g><circle r="420" fill="url(#warm-glow)"/><g opacity=".4">${rays(c, { n: 20, r0: 70, r1: 900, spread: 0.05, color: '#fff1c8' })}</g></g>`);
    const sunEl = hanging(hangL, sun(c, 56, { rays: C.sunDeep }), { x: 1180, y: 190, len: 900 });
    const cl = hanging(hangL, cloud(c, 170), { x: 620, y: 150, len: 700 });
    const birds = flock(S, hangL, 5, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 70, scale: 0.45 });

    const R = roadSet(S, { cityX: 180, tombX: 1560 });
    /* the Eleven, over the city */
    const fx = S.layer({ par: 0.2, sh: 5 });
    const MED = ELEVEN.map((m, i) => ({ i, el: hanging(fx, medallion(c, m.o, { r: 20 }), { x: 0, y: -1500, len: 900 }) }));

    /* the two women, and their fear and great joy */
    const W = [MAGD, MARYJ].map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(R.P.add(person(c, o))), fear: R.P.add(`<g>${shakeLines(c, 22, C.lavender)}</g>`) }));
    const joy = Array.from({ length: 10 }, (_, i) => ({ i, el: R.front.add(i % 3 === 2 ? `<g>${sparkle(c, 14)}</g>` : `<g>${heart(c, 11 + (i % 2) * 4, i % 2 ? C.jesusMantle : C.roseRobe)}</g>`) }));

    return (t, time) => {
      swing(cl, 620 + (time ? Math.sin(time * 0.1) * 30 : 0), 150, time, 1.2, 0.6, 1);
      birds(time, 1);
      const burst = es(t, 0.3, 0.9);
      swing(sunEl, 1180, 190, time, 0.8, 0.5);
      pose(sunGlow, { x: 1180, y: 190, s: 0.6 + burst * 0.6, r: t * 5, o: 0.4 + burst * 0.6 });

      /* v8a: out from the tomb, quickly, with fear and great joy; v8b: running to the city */
      const u = es(t, 0.02, 0.95, ease.sine) * 0.45 + es(t, 1.0, 1.95, ease.sine) * 0.55;
      const run = es(t, 0.95, 1.1);
      const heads = [];
      W.forEach((w) => {
        const x = lerp(1300, 330, u) + w.i * lerp(90, 120, run);
        const y = roadY(R.road, x) - 16 + w.i * 6;
        const s = 1.0;
        const moving = t > 0.02 && t < 1.95;
        w.p.set({ x, y, s, flip: true, walk: moving ? x * (0.05 + run * 0.025) + w.i : undefined, amt: 0.8 + run * 0.5, lean: 4 + run * 10, armF: 30 + run * 30 + bump(t, 0.3, 0.9) * 30, armB: 20 + run * 40 + (w.i === 0 ? bump(t, 0.35, 0.95) * 70 : 0), head: -6 - bump(t, 0.3, 0.9) * 8, blink: blinkAt(time, w.seed) });
        const [hx, hy] = headAt(x, y, s, true);
        heads.push([hx, hy, x]);
        pose(w.fear, { x: hx, y: hy, s: 0.9, o: 0.85 * (1 - es(t, 0.9, 1.3) * 0.7) });
      });
      joy.forEach((j) => {
        const k = ((t * 1.3 + j.i / 10) % 1);
        const h = heads[j.i % 2];
        const on = es(t, 0.15, 0.4) * (1 - es(t, 1.85, 2.0));
        pose(j.el, { x: h[0] + ((j.i * 37) % 90) - 40, y: h[1] - 30 - k * 120, s: (0.6 + k * 0.6) * on, r: j.i % 3 === 2 ? time * 40 : ((j.i % 2) * 2 - 1) * 10, o: on * (1 - k) });
      });

      /* the Eleven, waiting in the city */
      MED.forEach((m) => {
        const k = es(t, 1.15 + m.i * 0.03, 1.5 + m.i * 0.03, ease.back);
        swing(m.el, 380 + m.i * 44, lerp(-900, 300 + (m.i % 2) * 34, k), k > 0.001 ? time : 0, 1.2, 0.8, m.i);
      });

      // the camera runs with them
      const gx = (heads[0][2] + heads[1][2]) / 2;
      S.cam.x = Math.max(-420, Math.min(260, (gx - 800) / 0.52 + 30));
      S.cam.y = 20;
      S.cam.z = 1.02;
    };
  },
};
