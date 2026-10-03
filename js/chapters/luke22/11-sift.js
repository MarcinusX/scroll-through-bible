// Łk 22,31–34 — He turns to Peter: "Simon, Simon, Satan has asked to sift you like wheat": a sieve comes down, a dark
// wind shakes it, the grain leaps and the chaff blows away. "But I have prayed for you, that your faith may not fail":
// a small flame cupped in a hand — the wind tugs at it, and it stays alight. "And when you have turned again,
// strengthen your brothers": from it little lights go down the table to the others. Peter stands up: "Lord, I am ready to
// go with you to prison and to death" — behind him hang the bars of a prison. "The rooster will not crow today until you
// deny three times that you know me": the rooster, three marks — and Peter sits down slowly.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, NIGHTROOM, TW, kf, hand, headAt, sieve, grain, chaff, shadowWisp, cuppedFlame, lightDrop, bars, rooster, tally, discPlate, withFace,
  faceBits, person, sheet, hanging, vis, pose, fade, lerp, mix, blinkAt, C, PI,
} from './lib.js';

export default {
  id: 'lk22-sift',
  beats: [
    { v: 31 },
    { v: 32, text: 'ale Ja prosiłem za tobą, żeby nie ustała twoja wiara.' },
    { v: 32, cont: true, text: 'Ty ze swej strony utwierdzaj twoich braci».' },
    { v: 33 },
    { v: 34 },
  ],
  cam: { x: [-120, 20], y: [0, 220], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTROOM });
    const { R, at, by, SEAT, TOP } = T0;
    if (S.portrait) at.forEach((m) => { m.x = 800 + (m.x - 800) * 0.76; });   // phone: the thirteen sit closer so the table fits
    const J = by.jesus, P = by.peter;
    // Peter standing (behind the table)
    const pStEl = T0.behindL.add(withFace(person(c, TW.peter), faceBits(c)));
    const pSt = S.puppet(pStEl);
    const pStSad = pStEl.querySelector('[data-part="sad"]');

    const fx = S.layer({ par: 0.58, sh: 4 });
    const SV = sieve(c, 80);
    const sieveEl = hanging(fx, `<g class="sv">${SV.mesh}${SV.frame}</g>`, { x: 0, y: -1500, len: 700 });
    const sv = sieveEl.querySelector('.sv');
    const grains = Array.from({ length: 14 }, (_, i) => ({ i, dx: c.rr(-58, 58), dy: c.rr(-12, 8), el: fx.add(`<g>${grain(c, 5)}</g>`) }));
    const chaffs = Array.from({ length: 8 }, (_, i) => ({ i, dx: c.rr(-50, 50), el: fx.add(`<g>${chaff(c, 7)}</g>`) }));
    const wisps = [0, 1, 2].map((i) => ({ i, el: fx.add(`<g>${shadowWisp(c, 150 - i * 20)}</g>`) }));
    const flameEl = hanging(fx, discPlate(c, `<g transform="translate(0 38)">${cuppedFlame(c)}</g>`, { r: 70, rim: C.ochre, fill: mix(C.night, C.indigo, 0.3) }), { x: 0, y: -1500, len: 700 });
    const cupFl = flameEl.querySelector('.flame');
    const others = at.filter((m) => m.k !== 'jesus' && m.k !== 'peter' && m.k !== 'judas');
    const lights = others.map((m) => ({ m, el: fx.add(`<g>${lightDrop(c, 8)}</g>`) }));
    const barsEl = hanging(fx, discPlate(c, `<g transform="translate(0 56) scale(.5)">${bars(c, 190, 220, 5)}</g>`, { r: 70, rim: C.stone2, fill: mix(C.storm2, C.indigo, 0.3) }), { x: 0, y: -1500, len: 700 });
    const roo = hanging(fx, discPlate(c, `<g transform="translate(-10 40) scale(.9)">${rooster(c)}</g><g class="mk">${[0, 1, 2].map((i) => `<g class="m" transform="translate(${28 + i * 12} 14)">${tally(c, 1, C.ink, 24)}</g>`).join('')}</g>`, { r: 70, rim: C.ochre }), { x: 0, y: -1500, len: 700 });
    const marks = Array.from(roo.querySelectorAll('.m'));

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0.15);
      R.stars.fade(1);
      const turn = es(t, 0.05, 0.2);
      const pray = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));

      /* v31 — the sieve, shaken by a dark wind */
      const sIn = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      const shake = seg(t, 0.4, 1.0);
      const sy = 420 - (1 - sIn) * 700;
      vis(sieveEl, { x: 780, y: sy, s: 1.2, o: sIn > 0.01 ? 1 : 0 });
      pose(sv, { x: Math.sin(shake * PI * 8) * 14 * (shake > 0 && shake < 1 ? 1 : 0), r: Math.sin(shake * PI * 8 + 1) * 4 * (shake > 0 && shake < 1 ? 1 : 0) });
      grains.forEach((g) => {
        const hop = Math.abs(Math.sin(shake * PI * 8 + g.i)) * 26 * (shake > 0 && shake < 1 ? 1 : 0);
        vis(g.el, { x: 780 + g.dx + Math.sin(shake * PI * 8) * 14, y: sy + g.dy - 4 - hop, r: g.i * 30 + shake * 200, o: sIn > 0.3 ? 1 : 0 });
      });
      chaffs.forEach((ch) => {
        const k = es(t, 0.45 + ch.i * 0.05, 0.95 + ch.i * 0.03);
        vis(ch.el, { x: 780 + ch.dx + k * 320, y: sy - 10 - k * 120 + Math.sin(k * 9 + ch.i) * 16, r: k * 400, o: sIn > 0.3 && k < 0.98 ? 1 : 0 });
      });
      wisps.forEach((w) => {
        const k = seg(t, 0.3 + w.i * 0.08, 1.9);
        const x = lerp(560, 1100, k), y = 380 + w.i * 36 + Math.sin(k * 9 + w.i) * 20;
        vis(w.el, { x, y, s: 1, r: Math.sin(k * 6 + w.i) * 10, o: k > 0.01 && k < 0.99 ? 0.9 : 0 });
      });

      /* v32a — the flame that does not go out; v32b — lights for the brothers */
      const fIn = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(flameEl, { x: 660, y: 380 - (1 - fIn) * 700, r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: fIn > 0.01 ? 1 : 0 });
      const gust = bump(t, 1.2, 1.9);
      pose(cupFl, { x: 0, y: -16, r: gust * 22 * (T ? 0.7 + 0.3 * Math.sin(T * 6) : 1), sy: 1 - gust * 0.25 });
      lights.forEach((l) => {
        const d = Math.abs(l.m.x - 640);
        const k = es(t, 2.15 + d * 0.0006, 2.5 + d * 0.0006);
        const [tx] = hand(l.m.x, SEAT, l.m.s, l.m.flip, 60, 0, 62);
        vis(l.el, { x: lerp(660, tx, k), y: lerp(440, TOP - 14, k) - Math.sin(k * PI) * 60, s: 0.9, o: k > 0.001 && t < 3.2 ? 1 - es(t, 3.0, 3.2) : 0 });
      });

      /* v33 — Peter stands: to prison and to death */
      const up = es(t, 3.02, 3.1) * (1 - es(t, 4.4, 4.5));
      pSt.set({ x: P.x, y: 720, s: 0.9, flip: false, o: up, armF: 40 + es(t, 3.1, 3.3) * 40, armB: 10 + es(t, 3.15, 3.35) * 90 * (1 - es(t, 4.05, 4.25)), head: -6 + es(t, 4.1, 4.3) * 16, blink: blinkAt(T, 3) });
      fade(pStSad, es(t, 4.1, 4.3));
      const bIn = es(t, 3.1, 3.4, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
      vis(barsEl, { x: 700, y: 380 - (1 - bIn) * 700, r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: bIn > 0.01 ? 1 : 0 });

      /* v34 — the rooster; three denials */
      const rIn = es(t, 4.05, 4.35, ease.out);
      vis(roo, { x: 900, y: 330 - (1 - rIn) * 700, r: T ? Math.sin(T * 0.8 + 1) * 1.5 : 0, o: rIn > 0.01 ? 1 : 0 });
      marks.forEach((m, i) => fade(m, es(t, 4.35 + i * 0.1, 4.45 + i * 0.1)));

      at.forEach((m) => {
        if (m.k === 'jesus') {
          T0.sit(m, T, { flip: turn > 0.5 && t < 4.95 ? true : false, armF: 36 + bump(t, 0.1, 0.9) * 30 + bump(t, 2.1, 2.9) * 30 + bump(t, 4.1, 4.9) * 20, armB: 14 + pray * 120, head: -pray * 16 + es(t, 4.1, 4.3) * 10 });
          fade(m.sad, es(t, 0.2, 0.5) * 0.7 + es(t, 4.1, 4.3) * 0.3);
          return;
        }
        if (m.k === 'peter') {
          T0.sit(m, T, { o: 1 - up, armF: 36 + es(t, 2.1, 2.4) * 30, armB: 14, head: -turn * 4 + es(t, 2.1, 2.4) * (-8) + es(t, 4.4, 4.6) * 18 });
          fade(m.sad, es(t, 0.3, 0.6) * (1 - es(t, 2.1, 2.3)) + es(t, 4.45, 4.6));
          return;
        }
        const near = Math.abs(m.x - P.x) < (S.portrait ? 106 : 140) ? 1 : 0.4;
        T0.sit(m, T, { head: -turn * 2 + es(t, 3.1, 3.3) * (m.x < P.x ? 6 : -6) * near });
        fade(m.sad, es(t, 4.4, 4.6) * near * 0.8);
      });

      S.cam.x = kf(t, [[-0.3, -40], [0.3, -70], [3.0, -70], [3.3, -90], [4.0, -60], [4.4, 0]]) + (S.portrait ? 16 : 0);   // phone: the row sits clear of the progress thread
      const zk = kf(t, [[-0.3, 1.2], [0.3, 1.2], [2.0, 1.2], [2.3, 1.05], [2.9, 1.05], [3.3, 1.36], [4.0, 1.36], [4.4, 1.2]]);
      S.cam.z = S.portrait ? Math.max(1, zk - 0.12) : zk;   // phone: a little wider, so the whole table shows
      S.cam.y = kf(t, [[-0.3, 80], [0.3, 60], [2.0, 60], [2.3, 30], [2.9, 30], [3.3, 130], [4.0, 130], [4.4, 80]]);
    };
  },
};
