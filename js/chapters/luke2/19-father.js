// Łk 2,48–50 — Mary and Joseph hurry in and stand astonished; the boy gets up from among the teachers. Mary kneels to
// Him: "Son, why have you done this to us?" — "Your father and I have been looking for you in sorrow": in her bubble
// the night road and the lantern of those three days. He answers them quietly: "Why were you looking for me?" — and
// turning, He lifts His hand towards the sanctuary: "Did you not know that I must be in my Father's house?" The
// sanctuary fills with light (only light: the Father is never shown). But they do not understand what He says to
// them: they look at each other, a question hanging over each.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import { scrollRolled } from '../mark2/lib.js';
import {
  templeSet, TFLOOR, JOSEPH, MARY, BOY, kid, priest, scribe, staff, say, speech, question, heart, lantern, goldWord,
  glowDisc, rayBurst, hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const FL = TFLOOR;
const BX = 830;

export default {
  id: 'lk2-father',
  beats: [
    { v: 48, text: 'Na ten widok zdziwili się bardzo, a Jego Matka rzekła do Niego:' },
    { v: 48, cont: true, text: '«Synu, czemuś nam to uczynił?' },
    { v: 48, cont: true, text: 'Oto ojciec Twój i ja z bólem serca szukaliśmy Ciebie».' },
    { v: 49, text: 'Lecz On im odpowiedział: «Czemuście Mnie szukali?' },
    { v: 49, cont: true, text: 'Czy nie wiedzieliście, że powinienem być w tym, co należy do mego Ojca?»' },
    { v: 50 },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const TS = templeSet(S, {});
    const holy = TS.holyL.add(`<g>${rayBurst(c, { n: 24, r0: 50, r1: 520, spread: 0.035, color: '#fff3cf', o: 0.6 })}${glowDisc(300, 'halo-glow', 1)}</g>`);
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const bglow = glowL.add(`<g>${glowDisc(190, 'halo-glow', 1)}</g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    const t1 = S.puppet(P.add(priest(c, 3, { pose: 'sit' })));
    const t2 = S.puppet(P.add(scribe(c, 2, { pose: 'sit', holdF: `<g transform="rotate(-80) translate(0 -6)">${scrollRolled(c, 44)}</g>` })));
    const boyS = S.puppet(P.add(kid(c, { ...BOY, pose: 'sit' }, 1.1)));
    const boy = S.puppet(P.add(kid(c, { ...BOY }, 1.1)));
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const maryK = S.puppet(P.add(person(c, { ...MARY, pose: 'kneel' })));

    const X = S.layer({ par: 0.35, sh: 5 });
    const b1 = X.add(`<g>${say(c, tr('Synu, czemuś nam to uczynił?', 'Son, why have you treated us so?'), { size: 22, side: 1 })}</g>`);
    const b2 = X.add(`<g>${speech(c, `<g transform="translate(-26 -4)">${sheet().p(c.ribbon([[-30, 20], [0, 8], [30, 14]], 8), C.sand2).out()}<g transform="translate(-4 -30) scale(.7)">${lantern(c, { col: C.apricot })}</g></g><g transform="translate(34 4)">${heart(c, 14)}</g>`, { w: 130, h: 90 })}</g>`);
    const b3 = X.add(`<g>${say(c, tr('Czemuście Mnie szukali?', 'Why were you looking for me?'), { size: 22, side: -1 })}</g>`);
    const house = hanging(X, goldWord(c, tr('w domu mego Ojca', 'in my Father’s house'), { size: 26 }), { x: 0, y: 0, len: 700 });
    const qs = [0, 1].map(() => X.add(`<g>${question(c)}</g>`));
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v48a — seeing Him they are astonished; His mother speaks */
      const come = es(t, 0.0, 0.5);
      const up = es(t, 0.3, 0.38);
      const kneel = es(t, 1.0, 1.08);
      mary.set({ x: lerp(480, 700, come), y: FL, s: 0.95, o: 1 - kneel, walk: come > 0.01 && come < 0.99 ? t * 30 : undefined, armF: 30 + es(t, 0.5, 0.75) * 70, armB: 20 + es(t, 0.5, 0.75) * 110, head: -6, blink: blinkAt(T, 1) });
      const plead = es(t, 1.1, 1.3) * (1 - es(t, 2.9, 3.2));
      maryK.set({ x: 720, y: FL, s: 0.95, o: kneel, armF: 60 + plead * 30, armB: 40 + plead * 20, head: -8 + es(t, 5.0, 5.3) * 14, blink: blinkAt(T, 1) });
      jos.set({ x: lerp(380, 590, come), y: FL + 4, s: 0.95, walk: come > 0.01 && come < 0.99 ? t * 30 + 1 : undefined, armF: 30 + es(t, 0.5, 0.75) * 50 - es(t, 2.0, 2.3) * 20, armB: 30, head: -4 + es(t, 5.0, 5.3) * 10, blink: blinkAt(T, 2) });
      boyS.set({ x: BX, y: FL, s: 0.8, o: 1 - up, armF: 30, armB: 20, head: 0, blink: blinkAt(T, 4) });
      const point = es(t, 4.05, 4.35) * (1 - es(t, 5.1, 5.4));
      const turn = point > 0.5;
      boy.set({ x: BX + 10, y: FL, s: 0.8, flip: !turn, o: up, armF: 20 + bump(t, 3.1, 3.9) * 30 + point * 100, armB: 20 + bump(t, 3.1, 3.9) * 20, head: -point * 16, blink: blinkAt(T, 4) });
      t1.set({ x: 1010, y: FL, s: 0.9, flip: true, armF: 40, armB: 20 + point * 60, head: 4 - point * 10, blink: blinkAt(T, 6) });
      t2.set({ x: 1090, y: FL, s: 0.9, flip: true, armF: 30, armB: 20, head: 6, blink: blinkAt(T, 7) });

      /* v48b, v48c — "why have you done this to us? we have been looking for you in sorrow" */
      const k1 = es(t, 1.1, 1.25, ease.back) * (1 - es(t, 1.95, 2.05));
      vpose(b1, { x: 690, y: FL - 160, s: Math.max(0.001, k1), o: k1 > 0.01 ? 1 : 0 });
      const k2 = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.95, 3.05));
      vpose(b2, { x: 700, y: FL - 150, s: Math.max(0.001, k2), o: k2 > 0.01 ? 1 : 0 });

      /* v49a — "why were you looking for me?" */
      const k3 = es(t, 3.1, 3.25, ease.back) * (1 - es(t, 3.95, 4.05));
      vpose(b3, { x: BX - 10, y: FL - 170, s: Math.max(0.001, k3), o: k3 > 0.01 ? 1 : 0 });
      pose(bglow, { x: BX + 10, y: FL - 110, s: 0.7 + point * 0.4, o: 0.5 + point * 0.4 });

      /* v49b — "I must be in my Father's house": the sanctuary fills with light */
      const lk = es(t, 4.1, 4.5) * (1 - es(t, 5.1, 5.5) * 0.6);
      pose(holy, { x: TS.sanctX, y: TS.IW - 200, s: 0.6 + lk * 0.5, r: T * 1.5, o: lk });
      const hk = es(t, 4.2, 4.45, ease.out) * (1 - es(t, 4.95, 5.15, ease.in));
      hangAt(house, 800, lerp(-500, 200, hk), T, hk > 0.001 ? 1 : 0, 1, 0.7, 2);
      sparks.forEach((sp, i) => {
        const k = seg(t, 4.3 + i * 0.05, 4.9 + i * 0.05), a = PI * (1.1 + i * 0.2);
        vpose(sp, { x: TS.sanctX + Math.cos(a) * (120 + k * 100), y: TS.IW - 220 + Math.sin(a) * (60 + k * 60), s: 0.9 - k * 0.5, r: t * 90, o: bump(t, 4.3 + i * 0.05, 4.9 + i * 0.05) });
      });

      /* v50 — they did not understand */
      qs.forEach((q, i) => {
        const k = es(t, 5.1 + i * 0.1, 5.25 + i * 0.1, ease.back);
        vpose(q, { x: [610, 740][i], y: FL - [250, 170][i], s: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -20], [1.0, 0], [4.0, 0], [4.4, 10], [5.2, -10]], ease.sine);
      S.cam.y = kf(t, [[0, 20], [4.0, 20], [4.4, -30], [5.2, 20]], ease.sine);
      S.cam.z = kf(t, [[0, 1.03], [1.0, 1.08], [4.0, 1.08], [4.4, 1.0], [5.2, 1.08]], ease.sine);
    };
  },
};
