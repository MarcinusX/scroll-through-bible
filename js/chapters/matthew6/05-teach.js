// Mt 6,8 — back on the mountain. "Do not be like them": a small plate hangs by Jesus — the tower of paper words
// topples and scatters. "Your Father knows what you need before you ask Him": the light of heaven opens over the
// hill and, before anyone has said a word, it lets down what they need on strings: bread, water, a cloak. "Pray, then,
// like this": Jesus lifts His hands, and the disciples fold theirs.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { mount, mountFront, plateBoard, slipHeap, wordSlip, fatherLight, loaf, tunic, rewardStar, tr, PI } from './lib.js';
import { jug } from '../mark2/lib.js';

const PX = 1010, PY = 170, PW = 300, PH = 230;
const LX = 700, LY = 180;          // the light of heaven

export default {
  id: 'mt6-teach',
  beats: [
    { v: 8, text: 'Nie bądźcie podobni do nich!' },
    { v: 8, cont: true, text: 'Albowiem wie Ojciec wasz, czego wam potrzeba, wpierw zanim Go poprosicie. Wy zatem tak się módlcie:' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const M = mount(S, { sunAt: [1360, 130] });

    /* the light of heaven and what it lets down */
    const heavenL = S.layer({ par: 0.1, sh: 2 });
    const light = heavenL.add(`<g>${fatherLight(c, 50)}</g>`);
    const NEEDS = [
      [`<g transform="translate(0 16) scale(1.6)">${loaf(c, 24)}</g>`, -150, 330],
      [`<g transform="translate(0 26) scale(1.4)">${jug(c)}</g>`, 0, 370],
      [`<g transform="translate(0 6) scale(1.3)">${tunic(c, C.dustyBlue)}</g>`, 150, 330],
    ].map(([m, dx, y], i) => ({ i, x: LX + dx, y, el: hanging(heavenL, `<circle r="50" fill="url(#halo-glow)"/>${m}`, { x: 0, y: 0, len: 1200 }) }));

    /* the plate: the tower of words topples */
    const plateL = S.layer({ par: 0.12, sh: 6 });
    const board = plateL.add(`<g>${plateBoard(c, PW, PH, { fill: mix(C.parchment, C.dusk, 0.3), ground: mix(C.stone2, C.dusk, 0.3), gy: 0.8 })}</g>`);
    const HEAP = [[150, 40], [110, 60], [80, 70], [50, 60]].map(([w, h], i) => ({ i, w, h, el: plateL.add(`<g>${slipHeap(c, w, h)}</g>`) }));
    const SL = Array.from({ length: 9 }, (_, i) => ({ i, el: plateL.add(wordSlip(c, 22)) }));

    mountFront(S);

    return (t, time) => {
      const T = time;
      /* v8a — "not like them": a raised hand; the tower of words topples */
      const stop = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.2));
      const lift = es(t, 1.55, 1.8);
      M.pose(t, T, { armF: 20 + stop * 70 + lift * 50, armB: 10 + stop * 20 + lift * 120, head: -lift * 12 + stop * 4, blink: blinkAt(T) });
      const fold = es(t, 1.62, 1.85);
      M.listen(T, (d) => ({ armF: 16 + (d.i % 3) * 8 + fold * 50, armB: 8 + fold * 60, head: (d.flip ? 3 : -3) - es(t, 1.0, 1.3) * 10 + fold * 6, blink: blinkAt(T, d.seed) }));

      const pk = es(t, 0.0, 0.25, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      const px = PX, py = lerp(-560, PY, pk) - es(t, 0.95, 1.2) * 0;
      const po = pk > 0.005 ? 1 : 0;
      pose(board, { x: px, y: py, o: po });
      const gy = py + PH * 0.8 + 4;
      const fall = es(t, 0.3, 0.6, ease.in);
      let top = gy;
      HEAP.forEach((h) => {
        const dir = h.i % 2 ? 1 : -1;
        const drop = fall * (h.i + 1) * 0.25;
        pose(h.el, { x: px - 20 + h.i * 6 + dir * fall * h.i * 30 + fall * h.i * 20, y: top + (gy - top) * Math.min(1, drop * 1.6), r: fall * dir * h.i * 22, o: po });
        top -= h.h * 0.85;
      });
      SL.forEach((sl) => {
        const k = es(t, 0.35 + sl.i * 0.02, 0.8 + sl.i * 0.02);
        const a = -PI * (0.1 + (sl.i / 8) * 0.8);
        pose(sl.el, { x: px - 10 + Math.cos(a) * k * 120, y: gy - 150 + Math.sin(a) * k * 60 + k * k * 140, r: k * 400 * (sl.i % 2 ? 1 : -1), o: k > 0 && k < 1 ? po : 0 });
      });

      /* v8b — the Father knows: the light opens, the needs come down */
      const hk = es(t, 1.02, 1.3);
      pose(light, { x: LX, y: LY, s: 0.7 + hk * 0.3 + (T ? Math.sin(T * 0.7) * 0.02 : 0), o: hk });
      NEEDS.forEach((n) => {
        const k = es(t, 1.12 + n.i * 0.07, 1.42 + n.i * 0.07, ease.out);
        pose(n.el, { x: n.x, y: lerp(-420, n.y, k), r: T ? Math.sin(T * 0.8 + n.i) * 2 : 0, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1 + es(t, 0.0, 0.6) * 0.04;
      S.cam.y = -30 - es(t, 1.0, 1.4) * 20;
    };
  },
};
