// Mt 26,20–23 — evening in the upper room (Mark 14's room, table and seating). He comes in with the Twelve and they
// recline at the long table. As they eat: "one of you will betray me" — the lamps dim. Deeply grieved, one after
// another they ask "Surely not I, Lord?" — a little question over every head. "He who dipped his hand with me in the
// dish": a light falls on the dish where His hand and Judas's meet.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { upperRoom, supperTable, seatAll, SEATS, TW, kf, hand, headAt, question, bowl, say, vignette, tr, vis, PI } from './lib.js';

const DISH = 832;

export default {
  id: 'mt26-supper',
  beats: [
    { v: 20 },
    { v: 21 },
    { v: 22 },
    { v: 23 },
  ],
  cam: { x: [-60, 120], y: [-40, 300], z: [1, 2.0] },
  build(S) {
    const c = S.c;
    const R = upperRoom(S, { skyCols: ['#4e4f86', '#9c7f98', '#cf9f94'] });
    const { SEAT, TOP, FLOOR } = R;

    // they come in
    const walkL = S.layer({ par: 0.5, sh: 5 });
    const order = ['jesus', ...SEATS.filter(([k]) => k !== 'jesus').map(([k]) => k).reverse()];
    const walkers = order.map((k, n) => {
      const x = SEATS.find((s) => s[0] === k)[1];
      const o = k === 'jesus' ? CAST.jesus : TW[k];
      return { k, n, x, p: S.puppet(walkL.add(person(c, o))), seed: c.rr(0, 9) };
    });
    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatAll(S, seatL);
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${supperTable(c, 860)}</g>`);
    tabL.add(`<g transform="translate(${DISH} ${TOP - 2})">${bowl(c, { w: 40, food: 'stew', color: mix(C.pot, C.clay, 0.4) })}</g>`);

    const shadeL = S.layer({ par: 0.56, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".32"/>`);
    const spotL = S.layer({ par: 0.56, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: DISH, cy: TOP - 60, r: 260, col: '#1d1830', o: 0.55 }));

    const fx = S.layer({ par: 0.58, sh: 4 });
    const qs = at.filter((m) => m.k !== 'jesus').map((m, n) => ({ m, n, el: fx.add(`<g>${question(c)}</g>`) }));
    const lord = fx.add(`<g>${say(c, tr('Chyba nie ja, Panie?', 'It isn’t me, is it, Lord?'), { size: 19, side: -1 })}</g>`);
    const shine = fx.add(`<g><circle r="46" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      R.stars.fade(es(t, -0.5, 1.5));
      const dark = es(t, 1.2, 1.6);
      shadeL.fade(dark * 0.8);
      spotL.fade(es(t, 3.05, 3.35));
      R.lamps.forEach((l, i) => {
        swing(l.el, l.x, l.y, T, 1, 0.7, i);
        const low = 1 - dark * 0.35;
        pose(l.fl, { x: 26, y: 36, sx: low * (1 + Math.sin(T * 7 + i) * 0.08), sy: low * (1 + Math.sin(T * 5.3 + i) * 0.12) });
        fade(l.gl, 0.85 * low);
      });

      /* v20 — they come in and take their places */
      walkers.forEach((w) => {
        const t0 = -0.3 + w.n * 0.035, x0 = 260 - w.n * 10, sp = 1500;
        const arrive = t0 + Math.abs(w.x - x0) / sp;
        const u = seg(t, t0, arrive);
        const x = lerp(x0, w.x, ease.out(u));
        const sit = es(t, arrive, arrive + 0.06);
        w.sit = sit;
        w.p.set({ x, y: SEAT - 8, s: w.k === 'jesus' ? 1.02 : 0.88, flip: false, o: seg(t, t0 - 0.02, t0) * (1 - sit), walk: u > 0 && u < 1 ? x * 0.05 : undefined, blink: blinkAt(T, w.seed) });
      });

      /* at table: they eat; "one of you"; "Is it I?"; the dish */
      const eating = es(t, 0.6, 0.8) * (1 - es(t, 1.2, 1.35));
      const shock = es(t, 1.25, 1.5);
      const dip = es(t, 3.1, 3.4);
      at.forEach((m) => {
        const w = walkers.find((x) => x.k === m.k);
        let armF = 36, armB = 14, head = 0, lean = 0;
        armF += eating * (20 + Math.sin((t - 0.6) * PI * 4 + m.seed) * 22);
        head += eating * Math.sin((t - 0.6) * PI * 3 + m.seed) * 4;
        if (m.k === 'jesus') {
          armF = 30 + bump(t, 1.3, 1.95) * 30 + dip * 44;
          armB = 16 + bump(t, 1.3, 1.95) * 70 + bump(t, 3.05, 3.5) * 30;
          head = es(t, 1.4, 1.7) * 10 - dip * 4;
          fade(m.sad, es(t, 1.3, 1.6));
        } else {
          const ask = es(t, 2.05 + qIndex(m) * 0.05, 2.2 + qIndex(m) * 0.05) * (1 - es(t, 2.9, 3.1));
          armF += shock * 20 * (1 - ask) + ask * 30;
          armB += ask * 30;
          head += shock * 8 - ask * 10 + (m.k === 'judas' ? dip * 10 : 0);
          lean += shock * 3;
          fade(m.sad, es(t, 2.0 + qIndex(m) * 0.05, 2.2 + qIndex(m) * 0.05) * (m.k === 'judas' ? 0 : 1));
          if (m.k === 'judas') { armF = armF * (1 - dip) + dip * 62; fade(m.angry, dip * 0.5); }
        }
        m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, o: w.sit, armF, armB, head, lean, blink: blinkAt(T, m.seed) });
      });
      function qIndex(m) { return Math.abs(m.i - 6) - 1 + (m.i > 6 ? 0.5 : 0); }
      qs.forEach((q) => {
        const d = qIndex(q.m);
        const k = es(t, 2.08 + d * 0.05, 2.22 + d * 0.05, ease.back) * (1 - es(t, 2.9, 3.05));
        const [hx, hy] = headAt(q.m.x, SEAT, q.m.s, q.m.flip, 62);
        vis(q.el, { x: hx + (q.m.flip ? -6 : 6), y: hy - 50 - (q.m.i % 2) * 16, s: k * 0.82, r: q.m.flip ? 6 : -6, o: k > 0.01 && q.m.k !== 'peter' ? 1 : 0 });
      });
      const [phx, phy] = headAt(676, SEAT, 0.88, false, 62);
      const lk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(lord, { x: phx - 4, y: phy - 30, s: lk, o: lk > 0.01 ? 1 : 0 });
      vis(shine, { x: DISH, y: TOP - 18, s: 0.6 + dip * 0.8, o: dip });

      S.cam.x = kf(t, [[-0.5, -30], [0.6, 0], [2.0, 0], [2.9, 0], [3.1, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [0.6, 1.2], [1.2, 1.3], [1.5, 1.5], [2.0, 1.26], [2.9, 1.26], [3.15, 1.62]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.6, 130], [1.5, 200], [2.0, 150], [2.9, 150], [3.15, 230]]);
    };
  },
};
