// Łk 17,3 — a painted courtyard in a village in the morning: the house door on the left, the long plastered wall, a
// fig tree over it. One brother has set out his basket of figs by the bench; the other comes out of the house in a
// hurry and kicks it over — the figs roll across the flagstones. "If your brother sins against you, rebuke him": the
// wronged one goes after him and stops him, a finger raised, the spilt basket in his speech bubble. "If he repents,
// forgive him": the other turns round, hangs his head with his hand on his heart, and a tear falls — and his brother
// opens his arms and embraces him; a warm heart lights above the two of them.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { yardSet, YARD, BRO_A, BRO_B, figBasket, fig1, speech, heart, tearDrop, headAt, hand, kf, es, ease, bump, seg, PI } from './lib.js';

const GY = YARD.GY;
const BASK = 560;

export default {
  id: 'lk17-rebuke',
  enter: 'fly',
  beats: [
    { v: 3, text: 'Jeśli brat twój zawini, upomnij go;' },
    { v: 3, cont: true, text: 'i jeśli żałuje, przebacz mu!' },
  ],
  cam: { x: [-20, 60], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const Y = yardSet(S);
    const c = S.c;
    const basket = Y.act.add(`<g>${figBasket(c, 56)}</g>`);
    const figs = Array.from({ length: 6 }, (_, i) => ({ i, el: Y.act.add(`<g>${fig1(c, 6.5)}</g>`), dx: 30 + i * 26 + c.rr(-6, 6), sp: c.rr(300, 600) }));
    const A = S.puppet(Y.act.add(person(c, BRO_A)));
    const B = S.puppet(Y.act.add(person(c, BRO_B)));
    const say = Y.fx.add(`<g opacity="0">${speech(c, `<g transform="translate(-4 12) rotate(-70)">${figBasket(c, 30)}</g><g transform="translate(16 12)">${fig1(c, 4)}</g><g transform="translate(24 10)">${fig1(c, 4)}</g>`, { w: 76, h: 56 })}</g>`);
    const tear = Y.fx.add(`<g opacity="0">${tearDrop(c, 4)}</g>`);
    const love = Y.fx.add(`<g opacity="0">${heart(c, 16)}</g>`);
    const seedA = c.rr(0, 9), seedB = c.rr(0, 9);

    return (t, time) => {
      const T = time;
      Y.update(T, { sunK: 0.25 });

      /* v3a — he kicks over his brother's basket; the other rebukes him */
      const bOut = es(t, 0.02, 0.4, (u) => u);
      const kick = bump(t, 0.2, 0.34);
      const over = es(t, 0.24, 0.32);
      const bx = lerp(330, 900, bOut);
      const turnB = es(t, 1.02, 1.14);
      const sorry = es(t, 1.1, 1.35);
      const hug = es(t, 1.5, 1.8);
      B.set({ x: bx - hug * 30, y: GY, s: 1, flip: turnB > 0.5, walk: bOut > 0 && bOut < 1 ? bx * 0.05 : undefined, armF: 14 + hug * 70, armB: 6 + sorry * 70 * (1 - hug * 0.6), head: -sorry * 16 * (1 - hug * 0.7), lean: kick * 8 - sorry * 4 + hug * 6, o: seg(t, 0.0, 0.04), blink: blinkAt(T, seedB) });
      pose(basket, { x: BASK, y: GY + 2, r: -over * 90, ox: -24, oy: 0 });
      figs.forEach((f) => {
        const k = es(t, 0.28 + f.i * 0.02, 0.6 + f.i * 0.03, ease.out);
        pose(f.el, { x: BASK - 20 + (over > 0 ? k * f.dx : 0), y: GY + 6 - (over > 0 ? Math.sin(k * PI) * 10 : 30), r: k * f.sp, o: over > 0.5 ? 1 : 0 });
      });
      // the wronged brother: kneeling to his basket at first, then after him
      const go = es(t, 0.45, 0.75);
      const rebuke = es(t, 0.7, 0.85);
      const ax = lerp(640, 790, go) + hug * 20;
      A.set({ x: ax, y: GY + 2, s: 1, flip: go < 0.02 ? true : false, walk: go > 0 && go < 1 ? ax * 0.05 : undefined, armF: 20 + bump(t, 0.25, 0.45) * 50 + rebuke * 30 * (1 - es(t, 1.4, 1.5)) + hug * 70, armB: 8 + rebuke * 120 * (1 - es(t, 1.2, 1.45)), head: rebuke * -4 + es(t, 1.2, 1.45) * 6, lean: bump(t, 0.25, 0.45) * -6 + hug * 8, blink: blinkAt(T, seedA) });
      const [ahx, ahy] = headAt(ax, GY + 2, 1, false);
      const sk = es(t, 0.8, 0.95, ease.back) * (1 - es(t, 1.2, 1.3));
      pose(say, { x: ahx + 14, y: ahy - 30, s: sk * 1.2, o: sk > 0.01 ? 1 : 0 });

      /* v3b — he repents: head bowed, hand on heart, a tear; and he is forgiven */
      const [bhx, bhy] = headAt(bx - hug * 30, GY, 1, true);
      const tk = seg(t, 1.3, 1.55);
      pose(tear, { x: bhx - 8, y: bhy + 4 + tk * 26, o: tk > 0 && tk < 1 ? 1 : 0 });
      const lk = es(t, 1.6, 1.85, ease.back);
      pose(love, { x: (ax + bx - hug * 30) / 2, y: GY - 250 - lk * 16, s: lk, o: lk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [0.4, 20], [1, 40], [2, 40]]);
      S.cam.y = kf(t, [[0, 40], [1, 40], [2, 30]]);
      S.cam.z = kf(t, [[0, 1.04], [0.6, 1.06], [1.3, 1.12], [2, 1.12]]);
    };
  },
};
