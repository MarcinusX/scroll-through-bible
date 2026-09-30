// Łk 22,14–16 — evening in the upper room. When the hour came He came in with the Twelve and they reclined at the long
// table (Mark 14's room and seating). "I have earnestly desired to eat this Passover with you before I suffer": He looks
// round at them all with open hands, a heart of light over the table — and the light falls on the lamb in the dish.
// "I will not eat it again until it is fulfilled in the Kingdom of God": the golden table of the Kingdom comes down.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, SEATS, TW, CAST, EVE, kf, hand, headAt, lightHeart, lightCrown, discPlate, lowTable, chalice, kingdomPlate, person, hanging, vis, pose,
  fade, lerp, mix, blinkAt, tr, C, PI,
} from './lib.js';

export default {
  id: 'lk22-hour',
  beats: [
    { v: 14 },
    { v: 15 },
    { v: 16 },
  ],
  cam: { x: [-40, 40], y: [0, 260], z: [1, 1.8] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: EVE });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus;
    // they come in (behind the table) and sit
    const order = ['jesus', ...SEATS.filter(([k]) => k !== 'jesus').map(([k]) => k).reverse()];
    const walkers = order.map((k, n) => {
      const x = SEATS.find((s) => s[0] === k)[1];
      return { k, n, x, p: S.puppet(T0.behindL.add(person(c, k === 'jesus' ? CAST.jesus : TW[k]))), seed: c.rr(0, 9) };
    });
    // the light on the lamb in the dish (behind the diners' front, on the table)
    const lampL = S.layer({ par: 0.56, sh: 0, flat: true });
    const lambGlow = lampL.add(`<g><ellipse cx="0" cy="0" rx="70" ry="26" fill="url(#halo-glow)"/></g>`);
    const fx = S.layer({ par: 0.57, sh: 3 });
    const heartEl = fx.add(`<g>${lightHeart(c, 30)}</g>`);
    const kingdom = hanging(fx, kingdomPlate(c, lightCrown, discPlate, lowTable, chalice, 66), { x: 0, y: -1500, len: 700 });

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0);
      R.sky.blend(EVE, ['#4d4a7c', '#9a7f98', '#d8a592'], es(t, 0, 3));
      R.stars.fade(es(t, 0.5, 2.5));

      /* v14 — the hour: He comes in with the apostles; they recline */
      walkers.forEach((w) => {
        const t0 = 0.02 + w.n * 0.04, x0 = 250 - w.n * 10, sp = 1500;
        const arrive = t0 + Math.abs(w.x - x0) / sp;
        const u = seg(t, t0, arrive);
        const x = lerp(x0, w.x, ease.out(u));
        w.sit = es(t, arrive, arrive + 0.06);
        w.p.set({ x, y: SEAT - 8, s: w.k === 'jesus' ? 1.02 : 0.88, flip: false, o: seg(t, t0 - 0.02, t0) * (1 - w.sit), walk: u > 0 && u < 1 ? x * 0.05 : undefined, blink: blinkAt(T, w.seed) });
      });

      /* v15 — "I have earnestly desired…": He looks round at them, open hands; the heart of light; the lamb */
      const desire = es(t, 1.05, 1.35) * (1 - es(t, 2.05, 2.3));
      const suffer = es(t, 1.55, 1.8);
      const up = es(t, 2.1, 2.35);
      at.forEach((m) => {
        const on = walkers.find((w) => w.k === m.k).sit;
        if (m.k === 'jesus') {
          const look = Math.sin(seg(t, 1.05, 1.9) * PI * 2) * 10 * desire;
          T0.sit(m, T, { o: on, armF: 36 + desire * 34 + up * 30, armB: 14 + desire * 40 + up * 70, head: look + suffer * 6 * (1 - up) - up * 14 });
          fade(m.sad, suffer * 0.7 * (1 - up * 0.6));
          return;
        }
        const lookJ = es(t, 1.05, 1.3);
        T0.sit(m, T, { o: on, head: lookJ * (m.x < 800 ? -4 : -4) + suffer * 6 - up * 12, armF: 36 + suffer * 10 });
        fade(m.sad, suffer * 0.6 * (m.k === 'judas' ? 0 : 1));
      });
      const hk = es(t, 1.12, 1.45, ease.back) * (1 - es(t, 2.05, 2.25));
      vis(heartEl, { x: 800, y: 500 - hk * 20, s: 0.6 + hk * 0.5, o: hk > 0.01 ? 1 : 0 });
      vis(lambGlow, { x: 760, y: TOP - 8, s: 1, o: es(t, 1.55, 1.8) * (1 - es(t, 2.9, 3.0) * 0.4) });

      /* v16 — until it is fulfilled in the Kingdom of God */
      const kin = es(t, 2.1, 2.45, ease.out);
      vis(kingdom, { x: 800, y: 330 - (1 - kin) * 700, r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: kin > 0.01 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.z = kf(t, [[-0.3, 1.1], [0.9, 1.2], [1.3, 1.7], [1.9, 1.7], [2.2, 1.2], [3, 1.16]]);
      S.cam.y = kf(t, [[-0.3, 60], [0.9, 120], [1.3, 220], [1.9, 220], [2.2, 90], [3, 80]]);
    };
  },
};
