// Mk 14,17–21 — evening in the upper room: He comes with the Twelve and they sit at the long table.
// "One of you will betray me" — the lamps dim; one after another they ask "Is it I?"; a light falls on the dish
// where He and Judas dip their hands; the Scriptures unroll; a candle before Judas gutters and goes out.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  upperRoom, supperTable, seatAll, SEATS, TW, kf, hand, headAt, question, bowl, candle, scrollOpen, hang2, shadowPerson, vignette, PI,
vis, } from './lib.js';

const DISH = 832;

export default {
  id: 'm14-supper',
  beats: [
    { v: 17 },
    { v: 18, text: 'A gdy zajęli miejsca i jedli,' },
    { v: 18, cont: true, text: 'Jezus rzekł: «Zaprawdę, powiadam wam: jeden z was Mnie zdradzi, ten, który je ze Mną».' },
    { v: 19 },
    { v: 20 },
    { v: 21, text: 'Wprawdzie Syn Człowieczy odchodzi, jak o Nim jest napisane,' },
    { v: 21, cont: true, text: 'lecz biada temu człowiekowi, przez którego Syn Człowieczy będzie wydany.' },
    { v: 21, cont: true, text: 'Byłoby lepiej dla tego człowieka, gdyby się nie narodził».' },
  ],
  cam: { x: [-60, 120], y: [-40, 300], z: [1, 2.0] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const tight = (x) => (PH ? 800 + (x - 800) * 0.76 : x);   // phone: the thirteen sit closer so the table fits
    const CANDLE = tight(900);
    const R = upperRoom(S, { skyCols: ['#6d6a9e', '#c7959c', '#eab596'] });
    const { SEAT, TOP, FLOOR } = R;

    // Judas's shadow on the wall behind him
    const shL = S.layer({ par: 0.31, sh: 0, flat: true });
    const jShadow = S.puppet(shL.add(`<g opacity=".0">${shadowPerson(c, { ...TW.judas, pose: 'sit' }, '#2a2034')}</g>`).firstElementChild);
    const jShadowG = jShadow.el.parentNode;

    // they come in
    const walkL = S.layer({ par: 0.5, sh: 5 });
    const order = ['jesus', ...SEATS.filter(([k]) => k !== 'jesus').map(([k]) => k).reverse()];
    const walkers = order.map((k, n) => {
      const x = tight(SEATS.find((s) => s[0] === k)[1]);
      const o = k === 'jesus' ? CAST.jesus : TW[k];
      return { k, n, x, p: S.puppet(walkL.add(person(c, o))), seed: c.rr(0, 9) };
    });
    // at table
    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatAll(S, seatL);
    if (PH) at.forEach((m) => { m.x = tight(m.x); });
    const J = at.find((m) => m.k === 'jesus'), JU = at.find((m) => m.k === 'judas');
    // the table and the supper, the dish, a candle before Judas
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${supperTable(c, 860)}</g>`);
    tabL.add(`<g transform="translate(${DISH} ${TOP - 2})">${bowl(c, { w: 40, food: 'stew', color: mix(C.pot, C.clay, 0.4) })}</g>`);
    const cand = tabL.add(`<g transform="translate(${CANDLE} ${TOP - 2}) scale(.55)">${candle(c, 40)}</g>`);
    const cFlame = cand.querySelector('.flame'), cGlow = cand.querySelector('.glow');
    const smoke = tabL.add(`<g><path d="${c.ribbon(Array.from({ length: 12 }, (_, i) => [Math.sin(i * 0.9) * 5, -i * 6]), (u) => 2.4 - u * 1.8)}" fill="#e8e2da" opacity=".8"/></g>`);

    // darkness gathering; a light on the dish
    const shadeL = S.layer({ par: 0.56, sh: 0, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d1830" opacity=".32"/>`);
    const spotL = S.layer({ par: 0.56, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: DISH, cy: TOP - 60, r: 260, col: '#1d1830', o: 0.55 }));

    const fx = S.layer({ par: 0.58, sh: 4 });
    const qs = at.filter((m) => m.k !== 'jesus').map((m, n) => ({ m, n, el: fx.add(`<g>${question(c)}</g>`) }));
    const scroll = hanging(fx, `<g transform="scale(1.6)">${scrollOpen(c, 110, 60)}</g>`, { x: 800, y: 330, len: 700 });
    const shine = fx.add(`<g><circle r="46" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      R.sky.blend(['#6d6a9e', '#c7959c', '#eab596'], ['#2a2f60', '#4d4a7c', '#7d6a8a'], es(t, -0.3, 2.5));
      R.stars.fade(es(t, 0.5, 2.5));
      const dark = es(t, 2.05, 2.5) * (1 - es(t, 7.6, 8.2) * 0.2);
      shadeL.fade(dark * 0.8);
      spotL.fade(es(t, 4.05, 4.35) * (1 - es(t, 4.9, 5.2)));
      R.lamps.forEach((l, i) => {
        swing(l.el, l.x, l.y, T, 1, 0.7, i);
        const low = 1 - dark * 0.35 - (i === 1 ? es(t, 6.05, 6.4) * 0.35 : 0);
        pose(l.fl, { x: 26, y: 36, sx: low * (1 + Math.sin(T * 7 + i) * 0.08), sy: low * (1 + Math.sin(T * 5.3 + i) * 0.12) });
        fade(l.gl, 0.85 * low);
      });

      /* v17 — they come in and take their places */
      walkers.forEach((w) => {
        const t0 = 0.02 + w.n * 0.035, x0 = 260 - w.n * 10, sp = 1500;
        const arrive = t0 + Math.abs(w.x - x0) / sp;
        const u = seg(t, t0, arrive);
        const x = lerp(x0, w.x, ease.out(u));
        const sit = es(t, arrive, arrive + 0.06);
        w.sit = sit;
        w.p.set({ x, y: SEAT - 8, s: w.k === 'jesus' ? 1.02 : 0.88, flip: false, o: seg(t, t0 - 0.02, t0) * (1 - sit), walk: u > 0 && u < 1 ? x * 0.05 : undefined, blink: blinkAt(T, w.seed) });
      });

      /* at table */
      const eating = es(t, 1.0, 1.1) * (1 - es(t, 2.05, 2.2));
      const shock = es(t, 2.1, 2.35);
      const dip = es(t, 4.1, 4.4) * (1 - es(t, 4.85, 5.05));
      const woe = es(t, 6.05, 6.35);
      const sorrow = es(t, 7.05, 7.4);
      at.forEach((m) => {
        const w = walkers.find((x) => x.k === m.k);
        const on = w.sit;
        let armF = 36, armB = 14, head = 0, lean = 0;
        // v18a — eating: little movements driven by the scroll
        armF += eating * (20 + Math.sin((t - 1) * PI * 4 + m.seed) * 22);
        head += eating * Math.sin((t - 1) * PI * 3 + m.seed) * 4;
        if (m.k === 'jesus') {
          armF = 30 + bump(t, 2.15, 2.9) * 30 + dip * 44 + bump(t, 5.1, 5.9) * 30;
          armB = 16 + bump(t, 2.15, 2.9) * 70 + bump(t, 5.1, 5.9) * 60;
          head = eating * 0 + sorrow * 16 - bump(t, 5.1, 5.9) * 6;
          fade(m.sad, es(t, 2.2, 2.5) * (1 - es(t, 5.05, 5.3)) + sorrow);
          fade(m.tear, es(t, 7.2, 7.5));
        } else {
          // v18b shock; v19 each asks "Is it I?"
          const ask = es(t, 3.05 + qIndex(m) * 0.06, 3.2 + qIndex(m) * 0.06) * (1 - es(t, 3.9, 4.1));
          armF += shock * 20 * (1 - ask) + ask * 30;
          armB += ask * 30;
          head += shock * 8 - ask * 10 + (m.k === 'judas' ? woe * 18 : 0) + sorrow * 8;
          lean += shock * 3;
          fade(m.sad, es(t, 3.0 + qIndex(m) * 0.06, 3.2 + qIndex(m) * 0.06) * (1 - (m.k === 'judas' ? 0 : es(t, 7.6, 8) * 0.3)));
          if (m.k === 'judas') { armF = armF * (1 - dip) + dip * 62; }
        }
        m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, o: on, armF, armB, head, lean, blink: blinkAt(T, m.seed) });
      });
      function qIndex(m) { return Math.abs(m.i - 6) - 1 + (m.i > 6 ? 0.5 : 0); }
      qs.forEach((q) => {
        const d = qIndex(q.m);
        const k = es(t, 3.08 + d * 0.06, 3.22 + d * 0.06, ease.back) * (1 - es(t, 3.9, 4.05));
        const [hx, hy] = headAt(q.m.x, SEAT, q.m.s, q.m.flip, 62);
        vis(q.el, { x: hx + (q.m.flip ? -6 : 6), y: hy - 50 - (q.m.i % 2) * 16, s: k * 0.82, r: q.m.flip ? 6 : -6, o: k > 0.01 ? 1 : 0 });
      });
      vis(shine, { x: DISH, y: TOP - 18, s: 0.6 + dip * 0.8, o: dip });

      /* v21a — it is written: the scroll */
      const sc = es(t, 5.05, 5.4, ease.out) * (1 - es(t, 5.9, 6.2, ease.in));
      vis(scroll, { x: 800, y: 340 - (1 - sc) * 700, r: Math.sin(T * 0.8) * 1.5, o: sc > 0.01 ? 1 : 0 });

      /* v21b — woe: Judas's shadow grows on the wall; v21c — the candle before him goes out */
      jShadow.set({ x: JU.x + 20, y: SEAT - 10, s: 0.88 * (1.3 + woe * 0.8), flip: true, head: woe * 18 });
      fade(jShadowG, woe * 0.22);
      const out = es(t, 7.1, 7.35);
      pose(cFlame, { x: 0, y: -60, sy: (1 - out) * (1 + Math.sin(T * 8) * 0.08), sx: 1 - out * 0.6 });
      fade(cGlow, (1 - out) * (0.8 - dark * 0.2));
      vis(smoke, { x: CANDLE, y: TOP - 40 - out * 10, sy: out, o: out * (1 - es(t, 7.8, 8)) * 0.8 });

      S.cam.x = kf(t, [[-0.5, -30], [0.9, 0], [2.0, 0], [3.0, 0], [4.05, 40], [4.9, 40], [5.2, 0], [6.0, 0], [6.4, 60], [7.0, 40], [7.5, 0]]) + (PH ? 16 : 0);   // phone: the row sits clear of the progress thread
      const zk = kf(t, [[-0.5, 1.1], [0.9, 1.2], [2.0, 1.3], [2.5, 1.5], [3.0, 1.26], [4.05, 1.9], [4.9, 1.9], [5.2, 1.2], [6.0, 1.2], [6.4, 1.7], [7.0, 1.7], [7.5, 1.6]]);
      // phone: wider, so the whole table shows (and stays wide while each of them asks "Is it I?")
      S.cam.z = PH ? kf(t, [[-0.5, 1.0], [0.9, 1.0], [2.0, 1.1], [2.5, 1.3], [3.0, 1.0], [3.95, 1.0], [4.15, 1.6], [4.9, 1.6], [5.2, 1.0], [6.0, 1.0], [6.4, 1.4], [7.0, 1.4], [7.5, 1.3]]) : zk;
      S.cam.y = kf(t, [[-0.5, 60], [0.9, 130], [2.5, 200], [3.0, 150], [4.05, 270], [4.9, 270], [5.2, 60], [6.0, 90], [6.4, 240], [7.5, 230]]);
    };
  },
};
