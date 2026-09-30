// Łk 18,9 — the same wayside. Among those listening stand three fine gentlemen who "trusted in themselves that they
// were righteous": they step up onto a boulder above the rest, hands on their chests and noses in the air, and one
// of them points down with scorn at a poor man and a woman sitting in the dust beside them, who bow their heads.
// Jesus turns to them and begins "this parable".
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { waySet, WY, PROUD, LOWLY, headAt, es, ease, bump, seg, PI } from './lib.js';
import { rock } from '../../assets/nature.js';

const { GY, JX } = WY;
const RX = 1100, RY = GY - 4;       // the boulder they climb (top at RY - 34)

export default {
  id: 'lk18-trusted',
  beats: [
    { v: 9 },
  ],
  cam: { x: [-20, 40], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const W = waySet(S, {
      dis: { keys: ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew'], x: 560, y: GY + 6, s: 0.86, flip: false },
    });
    const c = S.c;
    const A = W.act;
    const rockEl = A.add(`<g>${rock(c, 0, 0, 280, 64, mix(C.rock, C.sand2, 0.3))}</g>`);
    const proud = PROUD.map((o, i) => ({ i, p: S.puppet(A.add(person(c, o))), seed: c.rr(0, 9) }));
    const low = LOWLY.map((o, i) => ({ i, p: S.puppet(A.add(person(c, { ...o, pose: 'sit' }))) }));

    return (t, time) => {
      const T = time;
      W.update(T);
      if (W.disSp) W.disSp.set({ x: 560, y: GY + 6 });
      pose(rockEl, { x: RX, y: RY + 10 });

      /* the three step up onto the boulder, noses up; one points down at the two in the dust */
      proud.forEach((m) => {
        const up = es(t, 0.08 + m.i * 0.06, 0.3 + m.i * 0.06);
        const x = RX - 60 + m.i * 60;
        const y = lerp(RY + 20, RY - 46, up);
        const point = m.i === 0 ? es(t, 0.45, 0.6) : 0;
        m.p.set({ x, y, s: 0.92, flip: true, bob: -Math.sin(up * PI) * 10, armF: 20 + (m.i === 0 ? point * 60 : up * 70), armB: 10 + up * (m.i === 1 ? 40 : 20), head: -up * 14 + point * 18, blink: blinkAt(T, m.seed) });
      });
      low.forEach((m) => {
        const bow = es(t, 0.5, 0.65);
        m.p.set({ x: 950 + m.i * 70, y: GY + 34 + m.i * 4, s: 0.88, flip: false, head: 10 + bow * 14, armF: 30 + bow * 20, blink: 0 });
      });

      /* Jesus turns to them */
      const turn = es(t, 0.3, 0.45);
      W.jesus.set({ x: JX, y: GY, s: 1.06, flip: false, armF: 20 + turn * 50, armB: 10 + turn * 90, head: -turn * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, false);
      W.voice(hx, hy, es(t, 0.35, 0.5) * 0.7, T, { dir: 1, spread: 1.8 });

      S.cam.x = 20;
      S.cam.y = -10;
      S.cam.z = 1.04;
      void shade; void sheet; void ease; void seg; void bump;
    };
  },
};
