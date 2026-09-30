// Łk 22,69–71 — "But from now on, the Son of Man will be seated at the right hand of the power of God": a painted
// flat comes down over the hall — the night sky, the Power of God as light only (never a figure), and at its right a
// throne where the Son of Man sits. "Are you then the Son of God?" they all cry, a question over every head. "You say
// it, because I am": a small gold word hangs over Him, the morning light behind Him. "What further testimony do we
// need?" — the high priest flings the witnesses' scroll aside; "we ourselves have heard it from His own mouth" — every
// hand points at Him, and He stands still in the first light of the day.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  councilScene, kf, moving, hand, headAt, speech, say, question, GLYPH, heavenPanel, radiance, smallThrone, crookedScroll, goldWord, person, sheet,
  hanging, vis, pose, fade, lerp, mix, blinkAt, tr, C, CAST, PI,
} from './lib.js';

export default {
  id: 'lk22-power',
  beats: [
    { v: 69 },
    { v: 70, text: 'Zawołali wszyscy: «Więc Ty jesteś Synem Bożym?»' },
    { v: 70, cont: true, text: 'Odpowiedział im: «Tak. Jestem Nim».' },
    { v: 71, text: 'A oni zawołali: «Na co nam jeszcze potrzeba świadectwa?' },
    { v: 71, cont: true, text: 'Sami przecież słyszeliśmy z ust Jego».' },
  ],
  cam: { x: [-100, 560], y: [-600, 100], z: [1, 1.7] },
  build(S) {
    const c = S.c;
    const K = councilScene(S);
    const { HALL, SEATX, JX } = K;
    const burst = K.glowL.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const fx = S.layer({ par: K.R.P, sh: 4 });
    // the vision
    const PW = 460, PH = 220;
    const vclip = S.id('vis');
    const sonM = `<g transform="translate(-92 ${PH - 26})">${smallThrone(c, 1.3)}<g transform="translate(4 -12) scale(.4)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g></g>`;
    const visionEl = hanging(fx, `${sheet().p(c.cut(c.rect(-PW / 2 - 10, -10, PW + 20, PH + 20), 0.6, 8), C.wood2).out()}<defs><clipPath id="${vclip}"><rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}"/></clipPath></defs><g clip-path="url(#${vclip})"><rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="${C.night}"/>${heavenPanel(c, PW, PH + 30)}<g transform="translate(40 ${PH * 0.45})"><circle r="120" fill="url(#halo-glow)"/><g transform="scale(.5)">${radiance(c, 150)}</g></g>${sonM}</g>`, { x: 0, y: -1500, len: 800 });
    const qs = K.SEATED.map((m) => ({ m, el: fx.add(`<g>${question(c)}</g>`) }));
    const hpQ = fx.add(`<g>${question(c)}</g>`);
    const iam = hanging(fx, goldWord(c, tr('Jestem', 'I am'), { size: 30 }), { x: 0, y: -1500, len: 700 });
    const scroll = fx.add(`<g>${crookedScroll(c, 80, 50)}</g>`);
    const mouth = fx.add(`<g>${say(c, tr('z Jego ust', 'from his own mouth'), { size: 18, side: -1, fill: mix(C.cream, C.stone2, 0.3) })}</g>`);

    return (t, time) => {
      const T = time;
      K.R.dawn.fade(1);
      K.R.dawnGlow.fade(0.7 + es(t, 3.0, 5) * 0.3);
      K.R.stars.fade(0.2);
      K.R.hallLamps.forEach((l, i) => { pose(l.fl, { x: 26, y: 36, sx: 0.7, sy: 0.7 * (1 + (T ? Math.sin(T * 5.3 + i) * 0.1 : 0)) }); fade(l.gl, 0.5); });
      K.Y.tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: 0.2, o: 1 }));
      K.Y.glowL.fade(0.2);

      /* v69 — at the right hand of the Power */
      const vIn = es(t, 0.05, 0.45, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      vis(visionEl, { x: JX, y: 40 - (1 - vIn) * 700, r: T ? Math.sin(T * 0.6) * 0.8 : 0, o: vIn > 0.01 ? 1 : 0 });

      /* v70 — "Are you the Son of God?" — "I am" */
      const cry = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      const iamK = es(t, 2.1, 2.35);
      const fling = es(t, 3.1, 3.35);
      const point = es(t, 4.05, 4.3);
      K.SEATED.forEach((m) => {
        m.p.set({ x: m.x, y: HALL - 16, s: 0.72, flip: !!m.flip, armF: 30 + cry * 50 + point * 60, armB: 14 + cry * 90 * (m.i % 2 ? 1 : 0.5) + fling * 20, head: -cry * 8 - point * 4, lean: -cry * 4, blink: blinkAt(T, m.seed) });
        fade(m.angry, 0.5 + cry * 0.5 + point * 0.3);
      });
      K.hp.set({ x: SEATX, y: HALL - 16, s: 0.74, flip: true, armF: 30 + cry * 40 + fling * 60 * (1 - point) + point * 70, armB: 20 + cry * 80 + fling * 100 * (1 - es(t, 3.8, 4.0)), head: -cry * 8 - fling * 6, blink: blinkAt(T, 5) });
      fade(K.hpAngry, 1);
      K.jesus.set({ x: JX, y: HALL, s: 0.76, flip: false, armF: 24, armB: 14 + iamK * 10 * (1 - es(t, 2.9, 3.1)), head: 8 * (1 - iamK) - iamK * 6 * (1 - es(t, 3.0, 3.3)) + es(t, 3.0, 3.3) * 8, blink: blinkAt(T) });
      fade(K.jSad, 0.4 + es(t, 3.0, 3.3) * 0.4);
      K.guard.set({ x: JX - 90, y: HALL, s: 0.74, flip: false, armF: 30, armB: 8, blink: blinkAt(T, 6) });
      qs.forEach((q) => {
        const k = es(t, 1.08 + q.m.i * 0.05, 1.22 + q.m.i * 0.05, ease.back) * (1 - es(t, 1.9, 2.0));
        const [mx, my] = headAt(q.m.x, HALL - 16, 0.72, !!q.m.flip, 62);
        vis(q.el, { x: mx + (q.m.flip ? -6 : 6), y: my - 40 - (q.m.i % 2) * 14, s: k * 0.7, r: q.m.flip ? 6 : -6, o: k > 0.01 ? 1 : 0 });
      });
      const [hx, hy] = headAt(SEATX, HALL - 16, 0.74, true, 62);
      const hq = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(hpQ, { x: hx - 6, y: hy - 40, s: hq * 0.8, r: 6, o: hq > 0.01 ? 1 : 0 });
      const ik = es(t, 2.15, 2.45, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(iam, { x: JX, y: 170 - (1 - ik) * 700, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: ik > 0.01 ? 1 : 0 });
      vis(burst, { x: JX - 4, y: HALL - 120, s: 0.5 + iamK * 0.3, o: 0.8 * iamK * (1 - es(t, 3.0, 3.3) * 0.5) });

      /* v71a — the witnesses' scroll flung aside; v71b — from His own mouth */
      const sk = es(t, 3.15, 3.6);
      vis(scroll, { x: lerp(SEATX - 40, SEATX + 160, sk), y: lerp(HALL - 110, HALL - 10, sk) - Math.sin(sk * PI) * 80, r: sk * 260, o: t > 3.1 ? 1 - es(t, 3.9, 4.0) : 0 });
      const mk = es(t, 4.1, 4.3, ease.back);
      const [ax, ay] = headAt(1320, HALL - 16, 0.72, true, 62);
      vis(mouth, { x: ax - 8, y: ay - 24, s: mk, o: 0 });

      S.cam.x = kf(t, [[-0.3, 420], [0.9, 420], [1.1, 440], [4.0, 440], [4.3, 500]]);
      S.cam.y = kf(t, [[-0.3, -440], [0.9, -440], [1.1, -400], [4.0, -400], [4.3, -560]]);
      S.cam.z = kf(t, [[-0.3, 1.3], [0.9, 1.3], [1.1, 1.5], [2.1, 1.5], [2.35, 1.66], [2.9, 1.66], [3.1, 1.5], [4.0, 1.5], [4.3, 1.3]]);
    };
  },
};
