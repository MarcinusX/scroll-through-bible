// Łk 14,35b — evening on the road. Jesus stands among the crowds with His arms open: "He who has ears to hear, let him
// hear!" — and over the heads of the people little paper ears open one after another and glow, those who hear.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, knot, pose3, TWELVE, earGlyph, voiceRings, headAt, kf, makeCutter, mix } from './lib.js';
import { EVENING } from '../luke8/lib.js';

const FEET = 724, JX = 800;
const EARS = [[340, 548], [430, 534], [520, 552], [1100, 552], [1190, 534], [1280, 548]];

export default {
  id: 'lk14-ears',
  beats: [
    { v: 35, cont: true, text: 'Kto ma uszy do słuchania, niechaj słucha!»' },
  ],
  cam: { x: [-20, 20], y: [0, 160], z: [1, 1.2] },
  build(S) {
    const R = roadSet(S, { skyCols: EVENING, sunAt: [1150, 300] });
    const c = R.c;
    const cL = S.layer({ par: 0.5, sh: 4 });
    const left = cL.sprite(knot('lk14-e1', 7, { s: 0.84, spread: 44, flip: false, arms: [0, 20], head: [-10, -2] }), 450, FEET - 4);
    const right = cL.sprite(knot('lk14-e2', 7, { s: 0.84, spread: 44, flip: true, arms: [0, 20], head: [-10, -2] }), 1150, FEET - 4);
    const three = cL.sprite(pose3(makeCutter('lk14-3'), [0, 1, 2].map((k) => ({ x: (k - 1) * 40, y: (k % 2) * 8, s: 0.86, flip: true, head: -2, armF: 14 + k * 6, armB: 8, o: TWELVE[k].o }))), 960, FEET - 2);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const glows = EARS.map(() => glowL.add(`<g opacity="0"><circle r="34" fill="url(#warm-glow)"/></g>`));
    const eL = S.layer({ par: 0.5, sh: 4 });
    const ears = EARS.map((_, i) => eL.add(`<g opacity="0">${earGlyph(c, 20, [C.skin, C.skin2, C.skin3][i % 3])}</g>`));
    const jL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(jL.add(person(c, CAST.jesus)));
    const voice = voiceRings(jL, c, { n: 3, color: C.sun, r: 32, w: 5 });

    return (t, time) => {
      const T = time;
      R.update(T, 0);
      left.set({ x: 450, y: FEET - 4 });
      right.set({ x: 1150, y: FEET - 4 });
      three.set({ x: 960, y: FEET - 2 });
      const open = es(t, 0.05, 0.25);
      jesus.set({ x: JX, y: FEET, s: 1.08, flip: false, armF: 20 + open * 34, armB: 20 + open * 130, head: -6, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, FEET, 1.08, false);
      voice(jhx, jhy, open, T, { spread: 2.2 });
      EARS.forEach(([x, y], i) => {
        const k = es(t, 0.22 + i * 0.07, 0.34 + i * 0.07, ease.back);
        const yy = y - 36 + (T ? Math.sin(T * 1.5 + i) * 3 : 0);
        pose(ears[i], { x, y: yy, s: Math.max(0, k), r: (i % 2 ? -1 : 1) * 8, o: k > 0.02 ? 1 : 0 });
        pose(glows[i], { x, y: yy, o: es(t, 0.3 + i * 0.07, 0.5 + i * 0.07) * 0.9 });
      });
      S.cam.x = 0;
      S.cam.y = kf(t, [[-0.5, 40], [0.3, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.3, 1.06]]);
      if (S.portrait) { S.cam.z = 1.0; }
      void seg; void bump; void lerp; void mix;
    };
  },
};
