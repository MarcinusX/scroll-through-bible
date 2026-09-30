// Łk 21,38 — dawn over the Temple court: the sky pales from night to morning, the stars go out and the sun comes up
// behind the sanctuary. Jesus is already standing in the middle of the court; "all the people came early in the
// morning to him in the Temple to hear him": they come hurrying in from both sides, knot after knot, Peter and John
// among the first, and gather round Him — and He begins to teach.
import { blinkAt, lerp } from '../kit.js';
import { templeTeach, TT, headAt, NIGHT, es, ease } from './lib.js';

const { JX, JS } = TT;
const DYL = 36;                   // everyone a little lower: the closing card covers the middle on this last beat
const GY = TT.GY + DYL;
const DAWN = ['#b6a9c9', '#f1c9ab', '#f8e0c0'];

export default {
  id: 'lk21-morning',
  beats: [
    { v: 38 },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S, { skyCols: DAWN, sky2: NIGHT, sunAt: [960, 180], flats: false });

    return (t, time) => {
      const T = time;
      const day = es(t, 0.02, 0.4);
      T0.update(t, T, { sunDY: (1 - es(t, 0.1, 0.55)) * 220, sunO: es(t, 0.1, 0.3), dis: false, crowd: false });
      T0.sk2.layer.fade(1 - day);
      T0.starL.fade((1 - day) * 0.9);
      T0.dimL.fade((1 - day) * 0.9);

      /* the people hurry in from both sides: the near ones first, the others still coming */
      T0.groups.forEach((g, i) => {
        const a = [0.36, 0.42, 0.12, 0.16][i];
        const k = es(t, a, a + 0.44, ease.out);
        const from = g.x < 800 ? -500 : 2100;
        g.sp.set({ x: lerp(from, g.x, k), y: g.y + DYL - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 18)) * 6 : 0), o: 1 });
      });
      const pk = es(t, 0.08, 0.4, ease.out), jk = es(t, 0.1, 0.42, ease.out);
      const px = lerp(-200, TT.PX, pk), jx = lerp(1800, TT.JOX, jk);
      T0.peter.set({ x: px, y: GY + 10, s: 0.98, flip: false, walk: pk > 0 && pk < 1 ? px * 0.05 : undefined, head: -6, blink: blinkAt(T, 3) });
      T0.john.set({ x: jx, y: GY + 10, s: 0.98, flip: true, walk: jk > 0 && jk < 1 ? jx * 0.05 : undefined, head: -6, blink: blinkAt(T, 5) });

      /* Jesus waits for them, then teaches */
      const teach = es(t, 0.5, 0.65);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + teach * 60, armB: 10 + teach * 90, head: -4 - teach * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, teach * 0.8, T, { spread: 1.8 });

      S.cam.z = 1 + es(t, 0.3, 0.8) * 0.03;
      S.cam.y = es(t, 0.3, 0.8) * 10;
    };
  },
};
