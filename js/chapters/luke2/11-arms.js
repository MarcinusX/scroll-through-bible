// Łk 2,27b–29 — the Temple court. The parents bring in the Child Jesus to do for Him what the Law requires: Mary with
// the Child in her arms, Joseph with the two doves. Old Simeon comes to meet them; Mary holds the Child out and Simeon
// takes Him into his arms, lifts his face and his hand and blesses God, a soft light round them both. "Now, Master,
// you let your servant go in peace, according to your word": he closes his eyes, content; the day turns golden, the
// sun goes gently down behind the Temple, and the words hang over him: in peace.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import {
  templeSet, TFLOOR, EVENING, JOSEPH, MARY, SIMEON, inArms, staff, doveCage, glowDisc, rayBurst, goldWord,
  hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const FL = TFLOOR;
const MK = [[0, 300], [0.8, 700]];
const JK = [[0, 170], [0.85, 560]];
const SX = 900;

export default {
  id: 'lk2-arms',
  beats: [
    { v: 27, cont: true, text: 'A gdy Rodzice wnosili Dzieciątko Jezus, aby postąpić z Nim według zwyczaju Prawa,' },
    { v: 28 },
    { v: 29 },
  ],
  cam: { x: [-40, 40], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const TS = templeSet(S, { sky2: EVENING, sunAt: [1160, 170] });
    const holy = TS.holyL.add(`<g>${glowDisc(260, 'halo-glow', 1)}</g>`);
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const light = glowL.add(`<g>${glowDisc(230, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 30, r1: 220, spread: 0.03, color: '#fff3cf', o: 0.3 })}</g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    const cageM = `<g transform="rotate(-70) translate(0 -4)">${doveCage(c, { w: 50, h: 44 })}</g>`;
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdF: cageM })));
    const mHold = S.puppet(P.add(person(c, { ...MARY, holdF: inArms(c) })));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const sim = S.puppet(P.add(person(c, { ...SIMEON, holdB: staff(c, 190, 30) })));
    const simH = S.puppet(P.add(person(c, { ...SIMEON, holdF: inArms(c) })));
    const simC = S.puppet(P.add(person(c, { ...SIMEON, holdF: inArms(c), eyes: 'closed' })));
    const X = S.layer({ par: 0.3, sh: 5 });
    const peace = hanging(X, goldWord(c, tr('w pokoju', 'in peace'), { size: 32 }), { x: 0, y: 0, len: 700 });
    const word = hanging(X, goldWord(c, tr('według Twojego słowa', 'according to your word'), { size: 20 }), { x: 0, y: 0, len: 700 });
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      /* v27b — the parents bring in the Child Jesus */
      const mx = kf(t, MK, ease.sine), jx = kf(t, JK, ease.sine);
      const give = es(t, 1.0, 1.2);
      const took = es(t, 1.22, 1.3);
      mHold.set({ x: mx, y: FL, s: 0.95, o: 1 - took, walk: moving(t, MK, 0.3) ? mx * 0.06 : undefined, armF: 70 + give * 30, armB: 30 + give * 20, head: 8, blink: blinkAt(T, 1) });
      mary.set({ x: mx, y: FL, s: 0.95, o: took, armF: 60 - es(t, 1.3, 1.6) * 30, armB: 30, head: 6, blink: blinkAt(T, 1) });
      jos.set({ x: jx, y: FL + 4, s: 0.95, walk: moving(t, JK, 0.3) ? jx * 0.06 : undefined, armF: 60, armB: 20, head: 4, blink: blinkAt(T, 2) });
      const meet = es(t, 0.4, 0.9);
      sim.set({ x: lerp(1020, SX, meet), y: FL, s: 0.96, flip: true, o: 1 - took, walk: meet > 0.01 && meet < 0.99 ? t * 20 : undefined, armF: 30 + give * 40, armB: 30, head: 6, blink: blinkAt(T, 3) });

      /* v28 — he takes Him in his arms and blesses God */
      const bless = es(t, 1.35, 1.65);
      const shut = es(t, 2.1, 2.16);
      const o = { x: SX - 30, y: FL, s: 0.96, flip: true, armF: 70, armB: 30 + bless * 110, head: -bless * 14 };
      simH.set({ ...o, o: took * (1 - shut), blink: blinkAt(T, 3) });
      simC.set({ ...o, o: shut, head: -bless * 14 + es(t, 2.1, 2.5) * 6 });
      pose(light, { x: SX - 50, y: FL - 150, s: 0.5 + took * 0.5 + bump(t, 1.35, 2.0) * 0.1, r: T * 2, o: took });
      sparks.forEach((sp, i) => {
        const k = seg(t, 1.4 + i * 0.05, 1.9 + i * 0.05), a = PI * (1.1 + i * 0.2);
        vpose(sp, { x: SX - 40 + Math.cos(a) * (80 + k * 80), y: FL - 200 + Math.sin(a) * (40 + k * 70), s: 0.9 - k * 0.5, r: t * 90, o: bump(t, 1.4 + i * 0.05, 1.9 + i * 0.05) });
      });

      /* v29 — "Now you let your servant go in peace": evening light, the sun goes down */
      const eve = es(t, 2.0, 2.7) * 0.85;
      TS.sk2.layer.fade(eve);
      hangAt(TS.sunEl, 1160, 170 + eve * 200, T, 1, 1, 0.5, 1);
      pose(holy, { x: TS.sanctX, y: TS.IW - 180, s: 1 + eve * 0.4, o: 0.4 + eve * 0.6 });
      const pk = es(t, 2.1, 2.4, ease.out);
      hangAt(peace, 800, lerp(-500, 190, pk), T, pk > 0.001 ? 1 : 0, 1, 0.7, 2);
      const wk = es(t, 2.3, 2.55, ease.out);
      hangAt(word, 800, lerp(-500, 262, wk), T, wk > 0.001 ? 1 : 0, 1, 0.7, 3);

      S.cam.x = lerp(-20, 20, es(t, 0.5, 1.3));
      S.cam.y = 20 - es(t, 2.0, 2.5) * 20;
      S.cam.z = 1.02 + es(t, 1.0, 1.5) * 0.06;
    };
  },
};
