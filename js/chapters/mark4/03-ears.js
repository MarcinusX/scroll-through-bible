// Mk 4,9 — "Kto ma uszy do słuchania, niechaj słucha!" Back at the lake: the words travel over the water.
import { C, person, CAST, blinkAt, pose, lerp, sky, crowd, hanging, swing, sheet } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, town, sun, cloud } from '../../assets/nature.js';
import { boat, ear } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';

export default {
  id: 'ears',
  beats: [
    { v: 9, text: 'I dodał:' },
    { v: 9, cont: true, text: '«Kto ma uszy do słuchania, niechaj słucha!».' },
  ],
  cam: { x: [0, 0], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#d9e4dc', '#f2e6cc', '#f8ecd6']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 1210, y: 190, len: 700 });
    const cl = hanging(hangL, cloud(c, 180), { x: 470, y: 180, len: 700 });

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 392, amps: [16, 8, 3], lens: [1000, 400, 150], color: C.hillFar }).markup);
    const h2 = hillsWith(c, { y: 438, amps: [18, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 22 });
    const hills = S.layer({ par: 0.2, sh: 3 });
    hills.add(h2.markup);
    hills.add(town(c, { x: 1280, y: h2.fn(1280) + 10, n: 7, spread: 260, sc: 0.52 }));

    const beach = S.layer({ par: 0.3, sh: 3 });
    const bfn = c.wave(505, [5, 2], [700, 160]);
    beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
    beach.add(palm(c, 240, 510, 190) + palm(c, 1400, 512, 160));

    // the crowd on the shore, each cupping an ear as the words arrive
    const crowdL = S.layer({ par: 0.34, sh: 3 });
    const people = crowd(S, crowdL, [
      { y: 508, s: 0.34, n: 22, x0: 80, x1: 1520 },
      { y: 530, s: 0.42, n: 16, x0: 120, x1: 1480 },
    ]);
    // little paper ears pop up above a few heads
    const ears = people.filter((m, i) => i % 5 === 2).map((m, i) => ({ m, el: crowdL.add(`<g>${ear(c, m.opts.skin)}</g>`), i }));

    const lake = S.layer({ par: 0.42, sh: 2 });
    lake.add(waterBand(c, { y: 556, color: C.lake, foamN: 30 }).markup);
    // sound rings travelling from the boat to the shore
    const rings = [0, 1, 2, 3, 4].map((i) => ({ el: lake.add(`<path d="${c.ribbon(c.arc(0, 0, 60, 60, Math.PI * 1.1, Math.PI * 1.9, 14), 5)}" fill="${C.foam}"/>`), i }));

    const boatL = S.layer({ par: 0.6, sh: 5 });
    const b = boat(c);
    const boatG = boatL.add(`<g><g>${b.back}</g><g data-k="j">${person(c, { ...CAST.jesus })}</g><g>${b.front}</g></g>`);
    const jesus = S.puppet(S.$('j').firstElementChild);

    const w1 = S.layer({ par: 0.72, sh: 4, pad: 160 });
    w1.add(waveStrip(c, { y: 775, len: 150, amp: 11, color: C.lake2 }));
    const w2 = S.layer({ par: 0.8, sh: 4, pad: 200 });
    w2.add(waveStrip(c, { y: 850, len: 190, amp: 14, color: C.lake3 }));

    return (t, time) => {
      swing(sunEl, 1210, 190, time, 1.2, 0.7);
      swing(cl, 470 + Math.sin(time * 0.1) * 20, 180, time, 1.4, 0.6, 1);
      const speak = es(t, 0.6, 1.3);
      const bob = Math.sin(time * 1.4) * 2.5;
      pose(boatG, { x: 800, y: 712 + bob, s: 1.05, r: Math.sin(time * 1.1) * 0.8 });
      jesus.set({
        x: 0, y: 6, s: 1, flip: true,
        armF: 20 + es(t, 0.9, 1.4) * 45 + Math.sin(time * 1.3) * 4 * speak,
        armB: 12 + es(t, 0.2, 0.9) * 138,
        head: -6 * speak, blink: blinkAt(time),
      });
      rings.forEach((r) => {
        const k = seg(t, 0.9 + r.i * 0.18, 1.6 + r.i * 0.18);
        pose(r.el, { x: 800, y: 600 - k * 60, s: 0.5 + k * 3.2, sy: 0.9, o: k > 0 && k < 1 ? (1 - k) * 0.9 : 0 });
      });
      people.forEach((m, i) => {
        const hear = es(t, 1.15 + (Math.abs(m.x - 800) / 800) * 0.45, 1.45 + (Math.abs(m.x - 800) / 800) * 0.45);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, armF: hear * (i % 2 ? 150 : 40), armB: hear * (i % 2 ? 0 : 20), head: -hear * 8, blink: blinkAt(time, m.seed) });
      });
      ears.forEach((e) => {
        const k = es(t, 1.35 + e.i * 0.06, 1.6 + e.i * 0.06, ease.back);
        pose(e.el, { x: e.m.x + (e.m.x > 800 ? -8 : 8), y: e.m.y - 230 * e.m.s - 26 + Math.sin(time * 1.6 + e.i) * 3, s: 0.55 * k, sx: e.m.x > 800 ? -1 : 1, o: k > 0 ? 1 : 0 });
      });
      w1.shift((time * 22) % 150 - 75);
      w2.shift(95 - ((time * 16) % 190));
      S.cam.z = 1.04 + es(t, 0, 1) * 0.06;
      S.cam.y = 40 + es(t, 0, 1) * 15;
    };
  },
};
