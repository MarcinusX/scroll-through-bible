// Łk 22,66–68 — as day breaks (a second sky, the dawn, fades in behind the high priest's house), the elders of the
// people gather, chief priests and scribes, and take their seats along the hall; Jesus is brought in, bound, and
// stands in the middle. "If you are the Christ, tell us!" (a bubble: the anointing oil and a question). "If I tell you,
// you will not believe" — His word goes out, and they turn their faces away. "And if I ask, you will not answer" — His
// question hangs in the air, and all along the benches mouths stay shut.
import { es, ease, bump, seg } from '../../core/anim.js';
import { councilScene, kf, moving, hand, headAt, speech, GLYPH, sheet, vis, pose, fade, lerp, mix, blinkAt, tr, C, PI } from './lib.js';

export default {
  id: 'lk22-council',
  beats: [
    { v: 66 },
    { v: 67, text: 'Rzekli: «Jeśli Ty jesteś Mesjasz, powiedz nam!»' },
    { v: 67, cont: true, text: 'On im odrzekł: «Jeśli wam powiem, nie uwierzycie Mi,' },
    { v: 68 },
  ],
  cam: { x: [-100, 520], y: [-460, 100], z: [1, 1.7] },
  build(S) {
    const c = S.c;
    const K = councilScene(S);
    const { HALL, SEATX, JX } = K;
    const fx = S.layer({ par: K.R.P, sh: 4 });
    const oil = sheet().p(c.cut([[0, 0], [8, -6], [30, -18], [48, -38], [52, -32], [36, -10], [10, 6]], 0.4, 4), C.cream).p(c.ribbon([[16, -10], [22, 0]], 3) + c.ribbon([[30, -20], [36, -12]], 3), C.ochre).out();
    const drops = `<path d="${c.cut([[0, -6], [3, 0], [0, 3], [-3, 0]], 0.1, 2)}" fill="${C.sun}"/>`;
    const q1 = fx.add(`<g>${speech(c, `<g transform="translate(-40 16) scale(.7)">${oil}</g><g transform="translate(-10 14)">${drops}</g><g transform="translate(20 0)">${GLYPH.q(c)}</g>`, { w: 90, h: 58, flip: true })}</g>`);
    const slip = sheet().p(c.cut([[-18, -7], [18, -8], [19, 7], [-19, 8]], 0.4, 6), C.cream).x(c.ribbon([[-12, -1], [12, -2]], 1.4) + c.ribbon([[-12, 3], [6, 3]], 1.4), C.ink, 'opacity=".5"').out();
    const words = fx.add(`<g>${speech(c, slip, { w: 64, h: 44 })}</g>`);
    const flying = [0, 1, 2].map(() => fx.add(`<g>${slip}</g>`));
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(0 0)">${GLYPH.q(c)}</g>`, { w: 50, h: 44 })}</g>`);
    const hush = K.SEATED.map((m) => ({ m, el: fx.add(`<g>${speech(c, `<path d="${c.poly(c.circ(-9, 0, 2.6, 8)) + c.poly(c.circ(0, 0, 2.6, 8)) + c.poly(c.circ(9, 0, 2.6, 8))}" fill="${C.stone2}"/>`, { w: 40, h: 26, fill: mix(C.cream, C.stone, 0.3), flip: !!m.flip })}</g>`) }));

    return (t, time) => {
      const T = time;
      const dawn = es(t, 0, 1.2);
      K.R.dawn.fade(dawn);
      K.R.dawnGlow.fade(dawn * 0.7);
      K.R.stars.fade(1 - dawn * 0.8);
      K.R.hallLamps.forEach((l, i) => { pose(l.fl, { x: 26, y: 36, sx: 1 - dawn * 0.3, sy: (1 - dawn * 0.3) * (1 + (T ? Math.sin(T * 5.3 + i) * 0.1 : 0)) }); fade(l.gl, 0.8 - dawn * 0.3); });
      K.Y.tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: 0.2, o: 1 }));
      K.Y.glowL.fade(0.2);

      /* v66 — they gather; He is brought in */
      const away = es(t, 2.2, 2.45) * (1 - es(t, 3.9, 4.0) * 0);
      K.SEATED.forEach((m) => {
        const on = es(t, 0.05 + m.i * 0.07, 0.25 + m.i * 0.07);
        const ask1 = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
        const turn = away * (m.i % 2 ? 1 : 0.6);
        m.p.set({ x: m.x, y: HALL - 16, s: 0.72, flip: turn > 0.5 ? !m.flip : !!m.flip, o: on, armF: 30 + ask1 * 40, armB: 14 + ask1 * 30 - turn * 0, head: -ask1 * 6 + turn * 10 + es(t, 3.1, 3.3) * 6, blink: blinkAt(T, m.seed) });
        fade(m.angry, ask1 * 0.7 + es(t, 3.1, 3.3) * 0.4);
      });
      K.hp.set({ x: SEATX, y: HALL - 16, s: 0.74, flip: true, armF: 30 + es(t, 1.05, 1.25) * 50 * (1 - es(t, 1.9, 2.1)), armB: 20 + es(t, 1.05, 1.25) * 60 * (1 - es(t, 1.9, 2.1)), head: -es(t, 1.05, 1.25) * 6 + es(t, 3.1, 3.3) * 6, blink: blinkAt(T, 5) });
      fade(K.hpAngry, es(t, 1.05, 1.3));
      const jK = [[-0.2, [660, HALL]], [0.8, [JX, HALL]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      const speak = es(t, 2.05, 2.25) * (1 - es(t, 2.8, 2.95)) + es(t, 3.05, 3.25) * (1 - es(t, 3.8, 3.95));
      K.jesus.set({ x: jx, y: jy, s: 0.76, flip: false, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, armF: 24 + speak * 16, armB: 14 + speak * 30, head: 8 - speak * 6, blink: blinkAt(T) });
      fade(K.jSad, 0.5);
      K.guard.set({ x: jx - 90, y: jy, s: 0.74, flip: false, armF: 30, armB: 8, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, blink: blinkAt(T, 6) });

      /* bubbles */
      const [hx, hy] = headAt(SEATX, HALL - 16, 0.74, true, 62);
      const b1 = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(q1, { x: hx - 16, y: hy - 22, s: b1, o: b1 > 0.01 ? 1 : 0 });
      const [jhx, jhy] = headAt(JX, HALL, 0.76, false);
      const b2 = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(words, { x: jhx + 12, y: jhy - 24, s: b2, o: b2 > 0.01 ? 1 : 0 });
      flying.forEach((f, i) => {
        const k = es(t, 2.3 + i * 0.1, 2.7 + i * 0.1);
        const tx = [720, 800, 1330][i];
        const bounce = es(t, 2.7 + i * 0.1, 2.9 + i * 0.1);
        vis(f, { x: lerp(jhx + 30, tx, k), y: lerp(jhy - 40, 230, k) + bounce * 60, r: k * 20 + bounce * 90, o: k > 0.01 && bounce < 0.99 ? 1 - bounce : 0 });
      });
      const b3 = es(t, 3.1, 3.3, ease.back);
      vis(ask, { x: jhx + 12, y: jhy - 24, s: b3, o: b3 > 0.01 ? 1 : 0 });
      hush.forEach((h) => {
        const k = es(t, 3.35 + h.m.i * 0.05, 3.5 + h.m.i * 0.05, ease.back);
        const [mx, my] = headAt(h.m.x, HALL - 16, 0.72, !!h.m.flip, 62);
        vis(h.el, { x: mx + (h.m.flip ? -8 : 8), y: my - 22, s: k * 0.8, o: k > 0.01 ? 0.9 : 0 });
      });

      S.cam.x = kf(t, [[-0.3, 380], [0.8, 420], [1.1, 520], [1.9, 520], [2.1, 420], [4, 420]]);
      S.cam.y = kf(t, [[-0.3, -300], [0.8, -400], [4, -400]]);
      S.cam.z = kf(t, [[-0.3, 1.2], [0.8, 1.44], [1.1, 1.6], [1.9, 1.6], [2.1, 1.5], [4, 1.5]]);
    };
  },
};
