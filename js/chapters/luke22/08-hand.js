// Łk 22,21–23 — "But behold, the hand of him who betrays me is with me on the table": the room darkens, and in a pool
// of light on the table two hands reach for the same dish — His, and Judas's beside Him. "The Son of Man goes as it has
// been determined" — an open scroll comes down; "but woe to that man" — Judas's shadow grows long on the wall and the
// candle before him gutters. They begin to ask one another which of them it could be: a question over every head.
import { es, ease, bump, seg } from '../../core/anim.js';
import { tableSet, NIGHTROOM, DISH, kf, hand, headAt, bowl, candle, scrollOpen, question, shadowPerson, vignette, TW, hanging, vis, pose, fade, lerp, mix, blinkAt, C, PI } from './lib.js';

export default {
  id: 'lk22-hand',
  beats: [
    { v: 21 },
    { v: 22 },
    { v: 23 },
  ],
  cam: { x: [-40, 80], y: [0, 300], z: [1, 2.0] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTROOM });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus, JU = by.judas;
    const jShG = T0.wallFx.add(`<g opacity="0">${shadowPerson(c, { ...TW.judas, pose: 'sit' }, '#2a2034')}</g>`);
    const jSh = S.puppet(jShG.firstElementChild);
    T0.tabL.add(`<g transform="translate(${DISH} ${TOP - 2})">${bowl(c, { w: 40, food: 'stew', color: mix(C.pot, C.clay, 0.4) })}</g>`);
    const cand = T0.tabL.add(`<g transform="translate(906 ${TOP - 2}) scale(.55)">${candle(c, 40)}</g>`);
    const cFlame = cand.querySelector('.flame'), cGlow = cand.querySelector('.glow');
    const shadeL = S.layer({ par: 0.56, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".34"/>`);
    const spotL = S.layer({ par: 0.56, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: DISH, cy: TOP - 50, r: 240, col: '#1d1830', o: 0.6 }));
    const fx = S.layer({ par: 0.58, sh: 4 });
    const scroll = hanging(fx, `<g transform="scale(1.5)">${scrollOpen(c, 110, 60)}</g>`, { x: 0, y: -1500, len: 700 });
    const qs = at.filter((m) => m.k !== 'jesus').map((m) => ({ m, el: fx.add(`<g>${question(c)}</g>`) }));

    return (t, time) => {
      const T = time;
      const dark = es(t, 0.05, 0.4);
      T0.idle(t, T, dark * 0.3);
      R.stars.fade(1);
      shadeL.fade(dark * 0.85);
      spotL.fade(es(t, 0.15, 0.4) * (1 - es(t, 0.95, 1.2)));

      /* v21 — two hands on the table, at one dish */
      const reach = es(t, 0.2, 0.45) * (1 - es(t, 1.0, 1.2));
      const woe = es(t, 1.5, 1.8);
      const ask = (m) => { const d = Math.abs(m.i - 6); return es(t, 2.05 + d * 0.05, 2.2 + d * 0.05); };
      at.forEach((m) => {
        if (m.k === 'jesus') {
          T0.sit(m, T, { armF: 36 + reach * 36, armB: 14 + bump(t, 1.05, 1.9) * 40, head: reach * 12 + woe * 8, lean: reach * 4 });
          fade(m.sad, es(t, 0.3, 0.6));
          return;
        }
        if (m.k === 'judas') {
          T0.sit(m, T, { armF: 36 + reach * 34 - woe * 10, head: reach * 8 + woe * 16 - ask(m) * 4, lean: reach * 3 });
          fade(m.sad, 0);
          return;
        }
        const a = ask(m) * (1 - es(t, 2.9, 3.0) * 0.3);
        const turn = (m.i % 2 ? 1 : -1) * a * 10;
        T0.sit(m, T, { armF: 36 + a * 34, armB: 14 + a * 30, head: turn - dark * 2 + (m.k === 'peter' ? a * 6 : 0) });
        fade(m.sad, a * 0.9);
      });

      /* v22 — as it was determined (the scroll); woe (the shadow, the candle) */
      const sc = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.5, 1.75, ease.in));
      vis(scroll, { x: 800, y: 340 - (1 - sc) * 700, r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: sc > 0.01 ? 1 : 0 });
      jSh.set({ x: JU.x + 30, y: SEAT - 8, s: JU.s * (1.3 + woe * 0.8), flip: true, head: woe * 16 });
      fade(jShG, woe * 0.24);
      const out = es(t, 1.6, 1.85);
      pose(cFlame, { x: 0, y: -60, sy: (1 - out * 0.85) * (1 + (T ? Math.sin(T * 8) * 0.08 : 0)), sx: 1 - out * 0.5 });
      fade(cGlow, (1 - out) * 0.8);

      /* v23 — which of them? */
      qs.forEach((q) => {
        const k = es(t, 2.1 + Math.abs(q.m.i - 6) * 0.05, 2.25 + Math.abs(q.m.i - 6) * 0.05, ease.back);
        const [hx, hy] = headAt(q.m.x, SEAT, q.m.s, q.m.flip, 62);
        vis(q.el, { x: hx + (q.m.flip ? -6 : 6), y: hy - 48 - (q.m.i % 2) * 16, s: k * 0.8, r: q.m.flip ? 6 : -6, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.3, 0], [0.3, 40], [1.0, 40], [1.3, 0], [1.5, 40], [2.0, 30], [2.2, 0]]);
      S.cam.z = kf(t, [[-0.3, 1.3], [0.3, 1.95], [1.0, 1.95], [1.25, 1.3], [1.5, 1.7], [1.95, 1.7], [2.2, 1.28]]);
      S.cam.y = kf(t, [[-0.3, 150], [0.3, 290], [1.0, 290], [1.25, 120], [1.5, 230], [1.95, 230], [2.2, 150]]);
    };
  },
};
