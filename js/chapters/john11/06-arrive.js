// J 11,17–20 — Bethany in the afternoon. Jesus comes along the road with the disciples: a small cave-plate hangs
// down with four day-discs lighting one by one — Lazarus has lain in the tomb four days already. "Bethany was near
// Jerusalem, about fifteen stadia" — a dotted line runs from the village to the city on the far hills. Mourners come
// out from Jerusalem and gather at the sisters' house, faces hidden in their hands. Martha hears that Jesus is coming
// and hurries out along the road to meet Him; Mary stays sitting in the house, her head bowed.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  bethanySet, WARM, DISC, mournerOpts, martha, mary, caveIcon, dayDisc, hungPlate, hungWord, strip, iconBubble, medallion, hang2,
  vis, kf, moving, pose, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

const F = 706;

export default {
  id: 'j11-arrive',
  beats: [
    { v: 17 },
    { v: 18 },
    { v: 19 },
    { v: 20, text: 'Kiedy zaś Marta dowiedziała się, że Jezus nadchodzi, wyszła Mu na spotkanie.' },
    { v: 20, cont: true, text: 'Maria zaś siedziała w domu.' },
  ],
  cam: { x: [-80, 200], y: [-80, 30], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const set = bethanySet(S, { skyCols: WARM, house: true, sunAt: [1180, 150] });
    // Mary inside, beyond the doorway
    const marySit = S.puppet(set.inL.add(mary(c, { pose: 'sit', eyes: 'closed' })));
    const A = S.layer({ par: 0.52, sh: 5 });
    const MOURN = [
      { x: 975, y: F + 6, f: 1, from: 1500 }, { x: 1185, y: F + 4, f: 1, from: 1560 }, { x: 1250, y: F + 10, f: 1, from: 1620 },
      { x: 925, y: F + 22, f: 1, from: 1680 }, { x: 1300, y: F + 24, f: 1, from: 1740 }, { x: 1020, y: F + 30, f: 0, from: 1800 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(A.add(person(c, mournerOpts(i)))) }));
    const DP = [[610, F + 14], [540, F + 6], [480, F + 18], [420, F + 8], [360, F + 16], [300, F + 6]];
    const disc = DISC.map((o, i) => ({ i, x: DP[i][0], y: DP[i][1], p: S.puppet(A.add(person(c, o))) }));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const mt = S.puppet(A.add(martha(c)));
    set.front();

    const X = S.layer({ par: 0.56, sh: 6 });
    const tomb = X.add(`<g>${hungPlate(c, `<g transform="translate(0 32)">${caveIcon(c, { sc: 1.15 })}</g>`, { r: 66, fill: mix(C.stone, C.cream, 0.4) })}</g>`);
    const days = ['I', 'II', 'III', 'IV'].map((n, i) => ({ i, el: X.add(`<g>${hang2(dayDisc(c, n, 24), 0.01, 300)}</g>`) }));
    days.forEach((d) => { d.lit = d.el.querySelector('.lit'); });
    const nameB = X.add(hungWord(c, tr('Betania', 'Bethany'), { size: 24 }));
    const nameJ = X.add(hungWord(c, tr('Jerozolima', 'Jerusalem'), { size: 20 }));
    const line = X.add(`<g><path d="" fill="${C.terracotta}"/></g>`);
    const lineP = line.querySelector('path');
    const dist = X.add(`<g>${strip(c, tr('ok. 15 stadiów', 'about 15 stadia'), { size: 18 })}</g>`);
    const news = X.add(`<g>${iconBubble(c, `<g transform="translate(0 2)">${medallion(c, { ...CAST.jesus }, { r: 22, rim: C.haloRim, back: C.halo })}</g>`, { w: 84, h: 70, side: -1 })}</g>`);

    // the dotted road from Bethany to Jerusalem (world coords at the X layer)
    const B = [set.vil[0], set.vil[1] - 10], J = [set.jer[0] + 30, set.jer[1] + 10];
    let dots = '';
    for (let i = 0; i <= 14; i++) { const u = i / 14; dots += c.cut(c.circ(lerp(B[0], J[0], u), lerp(B[1], J[1], u) - Math.sin(u * PI) * 26, 4, 8), 0.2, 2); }
    lineP.setAttribute('d', dots);

    const JK = [[0, 280], [0.8, 700]];
    return (t, time) => {
      const T = time;
      pose(set.sunEl, { x: 1180, y: 150, r: Math.sin(T * 0.6) * 1.5 });
      pose(set.cl, { x: 760 + Math.sin(T * 0.1) * 20, y: 170, r: 0 });

      /* v17 — Jesus arrives; four days in the tomb */
      const jx = kf(t, JK, ease.out);
      jesus.set({ x: jx, y: F + 12, s: 1.04, walk: moving(t, JK) ? jx * 0.1 : undefined, armF: 14 + es(t, 3.9, 4.3) * 50, armB: 8 + es(t, 3.9, 4.3) * 30, head: es(t, 2.1, 2.5) * 4, blink: blinkAt(T, 1) });
      disc.forEach((d) => {
        const K = [[0, d.x - 420], [0.85 + d.i * 0.03, d.x]];
        const x = kf(t, K, ease.out);
        d.p.set({ x, y: d.y, s: 0.92, walk: moving(t, K) ? x * 0.1 : undefined, armF: 10, head: es(t, 2.1, 2.5) * 6, blink: blinkAt(T, d.i + 4) });
      });
      const tk = es(t, 0.2, 0.55, ease.out) * (1 - es(t, 1.0, 1.2));
      vis(tomb, { x: 800, y: 300 - (1 - tk) * 520, r: Math.sin(T * 0.7) * 1.2, o: tk > 0.01 ? 1 : 0 });
      days.forEach((d) => {
        const k = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.0, 1.2));
        vis(d.el, { x: 800 + (d.i - 1.5) * 76, y: 420 - (1 - k) * 520, r: Math.sin(T * 0.8 + d.i) * 2, o: k > 0.01 ? 1 : 0 });
        if (d.lit) d.lit.setAttribute('opacity', es(t, 0.45 + d.i * 0.1, 0.52 + d.i * 0.1).toFixed(2));
      });

      /* v18 — Bethany … Jerusalem, about fifteen stadia */
      const nk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.95, 2.15));
      vis(nameB, { x: set.vil[0], y: 300 - (1 - nk) * 420, r: Math.sin(T * 0.8) * 1.2, o: nk > 0.01 ? 1 : 0 });
      vis(nameJ, { x: set.jer[0] + 60, y: 336 - (1 - nk) * 420, r: Math.sin(T * 0.7 + 1) * 1.2, o: nk > 0.01 ? 1 : 0 });
      const lk = es(t, 1.3, 1.7);
      pose(line, { o: lk * (1 - es(t, 1.95, 2.15)) });
      vis(dist, { x: (B[0] + J[0]) / 2, y: (B[1] + J[1]) / 2 + 20, s: es(t, 1.6, 1.75, ease.back), o: es(t, 1.6, 1.7) * (1 - es(t, 1.95, 2.15)) });

      /* v19 — the mourners come from Jerusalem */
      MOURN.forEach((m) => {
        const K = [[2.0 + m.i * 0.06, m.from], [2.55 + m.i * 0.06, m.x]];
        const x = kf(t, K, ease.out);
        const weep = es(t, 2.55 + m.i * 0.05, 2.8 + m.i * 0.05);
        const turn = es(t, 3.2, 3.4);
        m.p.set({ x, y: m.y, s: 0.9, flip: m.f ? (t < 3.3 || m.i % 2 ? true : false) : false, walk: moving(t, K) ? x * 0.1 : undefined, armF: 10 + weep * (m.i % 3 === 0 ? 122 : 40), armB: 6 + weep * 20, head: weep * 16 - turn * (m.i % 2 ? 0 : 6), blink: blinkAt(T, m.i + 7), o: t > 2.0 ? 1 : 0 });
      });

      /* v20a — Martha hears and goes out to meet Him */
      const heard = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.7, 3.85));
      const MK = [[3.35, 1090], [3.95, 820]];
      const mx = kf(t, MK);
      mt.set({ x: mx, y: F + 12, s: 0.98, flip: t > 3.2, walk: moving(t, MK) ? mx * 0.12 : undefined, amt: 1.3, lean: moving(t, MK) ? -5 : 0, armF: 20 + heard * 30 + es(t, 3.9, 4.2) * 40, armB: 10, head: -heard * 6 + es(t, 3.9, 4.2) * 6, blink: blinkAt(T, 2) });
      vis(news, { x: 1090 - 12, y: F + 12 - 210, s: heard, o: heard > 0.01 ? 1 : 0 });

      /* v20b — Mary sits in the house */
      marySit.set({ x: 1100, y: F - 4, s: 0.9, flip: true, armF: 40 + es(t, 4.1, 4.4) * 100, armB: 20, head: 14, blink: 0 });

      // phone: Jerusalem and its name in view for v18; Mary in the doorway for v20b
      S.cam.x = S.portrait ? kf(t, [[0, -40], [1, 0], [1.9, 0], [2.3, 80], [3, 120], [4, 60], [4.6, 190], [5, 190]])
        : kf(t, [[0, -40], [1, 0], [2, 80], [3, 120], [4, 60], [5, 140]]);
      S.cam.y = kf(t, [[0, 0], [1, -60], [2, -40], [3, 0], [4, 10], [5, 20]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.02], [3, 1.06], [4, 1.04], [5, 1.16]]);
    };
  },
};
