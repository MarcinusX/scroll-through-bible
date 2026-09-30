// Łk 15,20 — the farmstead in the golden evening, the long road winding down to its gateway. "So he arose and came
// to his father": far up on the hills a small ragged figure comes down the road, step by step. "But while he was
// still far off, his father saw him and was filled with compassion": the old father, who stands at the gateway
// every evening watching the road, shades his eyes — it is he! — and his hands go to his heart, a warm light
// kindling round him. "He ran to meet him": the old man runs, his mantle flying, arms wide, down the road. "…threw
// his arms round his neck and kissed him": they meet on the road; the father falls on his son's neck and kisses him,
// and behind the two of them the evening light opens wide and golden.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  farmSet, heartFlat, FM, ROAD, onRoad, roadS, FATHER, YOUNGER_RAGS, withFace, faceBits, embrace, heart, glow, rayBurst, sparkle,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, GOLDEN,
  ragsMarkup,
} from './lib.js';
import { heartGlow } from '../matthew9/lib.js';

const GY = FM.GY;
const MEET = 0.3;          // where on the road they meet

export default {
  id: 'lk15-faroff',
  parable: true,
  beats: [
    { v: 20, text: 'Wybrał się więc i poszedł do swojego ojca.' },
    { v: 20, cont: true, text: 'A gdy był jeszcze daleko, ujrzał go jego ojciec i wzruszył się głęboko;' },
    { v: 20, cont: true, text: 'wybiegł naprzeciw niego,' },
    { v: 20, cont: true, text: 'rzucił mu się na szyję i ucałował go.' },
  ],
  cam: { x: [0, 520], y: [-40, 220], z: [1, 1.5] },
  build(S) {
    const F = farmSet(S, { skyCols: GOLDEN, sunAt: [1320, 300], sunR: 50 });
    const c = F.c;
    const L = F.people;

    /* the light behind them (a layer under the people) */
    const behind = S.layer({ par: FM.P, sh: 0, flat: true });
    L.el.parentNode.insertBefore(behind.el, L.el);
    const warm = behind.add(`<g opacity="0">${glow(110, 0.9)}</g>`);
    const burst = behind.add(`<g opacity="0">${glow(300, 0.95)}${rayBurst(c, { n: 18, r0: 170, r1: 310, spread: 0.035, color: C.haloRim, o: 0.24 })}</g>`);

    const father = S.puppet(L.add(withFace(person(c, FATHER), faceBits(c))));
    const son = S.puppet(L.add(withFace(ragsMarkup(c), faceBits(c))));
    fade(son.el.querySelector('[data-part="sad"]'), 1);
    const hug = L.add(`<g opacity="0">${embrace(c, YOUNGER_RAGS)}</g>`);
    const hg = F.fx.add(`<g opacity="0">${heartGlow(c, 12).replace(/<circle[^>]*\/>/, '')}</g>`);
    const kiss = F.fx.add(`<g opacity="0">${heartFlat(c, 9)}</g>`);
    const hearts = [0, 1, 2].map((i) => F.fx.add(`<g opacity="0">${heart(c, 10 + i * 2)}</g>`));
    const twinkles = Array.from({ length: 6 }, (_, i) => ({ i, el: F.fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`) }));

    return (t, time) => {
      const T = time;
      F.update(T, { glowO: 0.7 });

      /* v20a — the son comes down the road from far away */
      const su = kf(t, [[0.0, 1], [1.0, 0.9], [1.9, 0.74], [3.0, MEET + 0.035]], (x) => x);
      const [sx, sy, ss, sd] = onRoad(su);
      const met = seg(t, 3.06, 3.1);
      son.set({ x: sx, y: sy, s: ss, flip: sd > 0, o: 1 - met, walk: t < 3.0 ? su * 160 : undefined, armF: 10, armB: 10, head: 10 - es(t, 2.7, 3.0) * 14, blink: blinkAt(T, 1) });

      /* v20b — the father at the gateway sees him far off; compassion */
      const see = es(t, 1.08, 1.3);
      const moved = es(t, 1.4, 1.65);
      const runU = es(t, 2.04, 3.02, (x) => x * 0.6 + ease.io(x) * 0.4) * (MEET - 0.035);
      const [fx, fy, fs, fd] = t < 2.04 ? [FM.GATE + 20, GY + 2, 1.02, 1] : onRoad(runU);
      const running = t > 2.04 && t < 3.02;
      const arms = es(t, 2.06, 2.25);
      father.set({ x: fx, y: fy, s: t < 2.04 ? 1.02 : Math.max(fs, 0.86), o: 1 - met, walk: running ? runU * 260 : undefined, amt: 1.6, lean: running ? 12 : moved * 6, armF: 20 + see * (1 - moved) * 130 + moved * (1 - arms) * 60 + arms * 70, armB: 10 + moved * (1 - arms) * 70 + arms * 110, head: -see * (1 - moved) * 8 + moved * 10 * (1 - arms), bob: running ? -Math.abs(Math.sin(runU * 130)) * 8 : 0, blink: blinkAt(T) });
      fade(father.el.querySelector('[data-part="sad"]'), moved * (1 - arms) * 0.8);
      pose(warm, { x: fx, y: fy - 110, s: 0.7 + moved * 0.5, o: moved * (1 - es(t, 3.0, 3.1)) });
      const [chx, chy] = handP(FM.GATE + 20, GY + 2, 1.02, false, 60);
      pose(hg, { x: FM.GATE + 36, y: GY - 120, s: moved, o: moved * (1 - es(t, 2.0, 2.1)) });

      /* v20d — he falls on his neck and kisses him */
      const [mx, my, ms] = onRoad(MEET);
      pose(hug, { x: mx, y: my, s: ms * 1.04, o: met });
      const bk = es(t, 3.1, 3.5);
      pose(burst, { x: mx, y: my - 110 * ms, s: 0.7 + bk * 0.3, r: T ? T * 2 : 0, o: bk });
      const [kx, ky] = headP(mx, my, ms, false);
      pose(kiss, { x: kx + 4, y: ky - 30, s: es(t, 3.3, 3.45, ease.back), o: es(t, 3.3, 3.4) });
      hearts.forEach((h, i) => {
        const k = seg(t, 3.4 + i * 0.1, 3.99);
        pose(h, { x: mx + (i - 1) * 50, y: my - 240 - k * 60, s: Math.sin(Math.min(1, k * 1.5) * PI * 0.5), o: k > 0 && k < 1 ? 1 - Math.max(0, k - 0.75) / 0.25 : 0 });
      });
      twinkles.forEach((w) => {
        const a = (w.i / 6) * PI * 2 + 0.3;
        const k = es(t, 3.3 + w.i * 0.04, 3.5 + w.i * 0.04);
        pose(w.el, { x: mx + Math.cos(a) * 190, y: my - 120 + Math.sin(a) * 120, s: k, r: T * 20, o: k });
      });

      S.cam.x = kf(t, [[0, 220], [1.0, 200], [1.4, 60], [2.0, 60], [3.0, 240], [3.5, (onRoad(MEET)[0] - 800) / FM.P]]);
      S.cam.y = kf(t, [[0, -30], [1.0, -20], [1.4, 20], [3.0, 30], [3.5, 190]]);
      S.cam.z = kf(t, [[0, 1.02], [1.4, 1.12], [2.0, 1.06], [3.0, 1.14], [3.5, 1.5]]);
    };
  },
};
