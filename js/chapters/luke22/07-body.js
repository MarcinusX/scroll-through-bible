// Łk 22,19–20 — the heart of the chapter, kept simple and still. He takes the bread, gives thanks (a soft light gathers
// behind His hands), breaks it and gives it: a piece goes to each of them, a little light resting on it — "This is my
// body, which is given for you; do this in memory of me." After supper, likewise the cup: He lifts it, the wine
// catches the light, and "poured out for you" — small lights run from the cup along the table, one to each place.
import { es, ease, bump, seg } from '../../core/anim.js';
import { tableSet, NIGHTROOM, kf, hand, headAt, loaf, loafHalves, chalice, lightDrop, sheet, vis, pose, fade, lerp, mix, blinkAt, C, PI } from './lib.js';

export default {
  id: 'lk22-body',
  beats: [
    { v: 19 },
    { v: 20 },
  ],
  cam: { x: [-40, 40], y: [0, 290], z: [1, 2.0] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTROOM });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus;
    // light gathering — behind the diners, on the wall
    const glowB = T0.behindL.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);
    const fx = S.layer({ par: 0.57, sh: 4 });
    const H = loafHalves(c, 24);
    const whole = fx.add(`<g>${loaf(c, 24)}</g>`);
    const halfL = fx.add(`<g>${H.left}</g>`), halfR = fx.add(`<g>${H.right}</g>`);
    const others = at.filter((m) => m.k !== 'jesus');
    const handOf = (m, a = 60) => hand(m.x, SEAT, m.s, m.flip, a, 0, 62);
    const pieces = others.map((m, n) => ({ m, n, el: fx.add(`<g>${sheet().p(c.cut(c.blob(0, -4, 10, 6, 8, 0.25), 0.3, 3), C.wheat2).out()}<g transform="translate(0 -18) scale(.9)">${lightDrop(c, 8)}</g></g>`) }));
    const cupEl = fx.add(`<g>${chalice(c, 48)}</g>`);
    const motes = others.map((m, i) => ({ m, i, el: fx.add(`<g>${lightDrop(c, 9)}</g>`) }));
    const dim = S.layer({ par: 0.6, sh: 0, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".22"/>`);

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0.2);
      R.stars.fade(1);
      dim.fade(1);

      /* v19 — bread: take, give thanks, break, give */
      const lift = es(t, 0.05, 0.25) * (1 - es(t, 0.42, 0.5));
      const thanks = es(t, 0.12, 0.3) * (1 - es(t, 0.4, 0.5));
      const brk = es(t, 0.42, 0.55);
      const give = es(t, 0.55, 0.68) * (1 - es(t, 0.95, 1.05));
      const cupUp = es(t, 1.08, 1.3);
      const armF = 44 + lift * 50 + brk * 16 * (1 - give) + give * 26 - es(t, 0.95, 1.05) * 20 + cupUp * 40;
      const armB = 20 + lift * 50 + brk * 40 * (1 - es(t, 0.95, 1.05)) + cupUp * 30;
      T0.sit(J, T, { armF, armB, head: -thanks * 16 - cupUp * 10 + give * 4 + es(t, 1.55, 1.75) * 12 });
      fade(J.sad, es(t, 1.55, 1.8) * 0.6);
      const [hx, hy] = hand(800, SEAT, J.s, false, armF, 0, 62);
      vis(whole, { x: hx - 4, y: hy + 10, o: t < 0.5 && t > -0.2 ? 1 : 0 });
      const ap = brk * 20;
      const halves = t >= 0.5 && t < 1.02 ? 1 : 0;
      vis(halfL, { x: hx - 6 - ap, y: hy + 10, r: -brk * 10, o: halves });
      vis(halfR, { x: hx - 2 + ap, y: hy + 10, r: brk * 10, o: halves });
      const gl = Math.max(thanks, brk * (1 - es(t, 0.9, 1.05)), cupUp * (1 - es(t, 1.9, 2.0) * 0.3));
      vis(glowB, { x: hx, y: hy - 40, s: 0.6 + gl * 0.5, o: gl * 0.9 });
      pieces.forEach((p) => {
        const d = Math.abs(p.m.i - 6);
        const k = es(t, 0.58 + d * 0.035, 0.8 + d * 0.035);
        const [tx, ty] = handOf(p.m);
        vis(p.el, { x: lerp(hx, tx, k), y: lerp(hy, ty, k) - Math.sin(k * PI) * 46, s: 0.9, o: k > 0 && t < 1.05 ? 1 : 0 });
      });
      others.forEach((m) => {
        const d = Math.abs(m.i - 6);
        const recv = es(t, 0.66 + d * 0.035, 0.84 + d * 0.035) * (1 - es(t, 1.0, 1.1));
        const pour = es(t, 1.4 + d * 0.03, 1.6 + d * 0.03);
        T0.sit(m, T, { armF: 36 + recv * 28 + pour * 18, head: thanks * 6 - recv * 6 + cupUp * -8 * (1 - pour) + pour * 6 });
        fade(m.sad, 0);
      });

      /* v20 — the cup after supper: poured out for you */
      const cupOn = es(t, 1.0, 1.08);
      vis(cupEl, { x: hx, y: hy + 8, o: cupOn > 0.01 ? 1 : 0 });
      motes.forEach((mo) => {
        const d = Math.abs(mo.m.i - 6);
        const k = es(t, 1.35 + d * 0.03, 1.62 + d * 0.03);
        const [tx, ty] = handOf(mo.m, 54);
        const x = lerp(hx, tx, k), y = lerp(hy - 50, ty - 6, k) - Math.sin(k * PI) * 10;
        vis(mo.el, { x, y, s: 0.9, o: k > 0.001 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.3, 0], [0.5, 0], [0.9, 0], [1.3, 0]]);
      S.cam.z = kf(t, [[-0.3, 1.8], [0.45, 1.9], [0.62, 1.45], [1.0, 1.45], [1.15, 1.85], [1.36, 1.9], [1.5, 1.45]]);
      S.cam.y = kf(t, [[-0.3, 260], [0.45, 275], [0.62, 200], [1.0, 200], [1.15, 265], [1.36, 275], [1.5, 200]]);
    };
  },
};
