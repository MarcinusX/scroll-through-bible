// Łk 13,22–23 — the second stage of the journey to Jerusalem. The road through Galilee rolls past: walled towns and
// villages on the hills, people at the wayside stopping to listen as He goes by teaching, the Twelve behind Him, and a
// signpost pointing on — "Jerusalem". Far off on the horizon the city waits. Then a man runs up and asks: "Lord, are
// only a few to be saved?" — a small bubble with his question — and Jesus stops and turns to them all to answer.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { TWELVE } from '../mark3/lib.js';
import { roadSet, still, knot, ASKER, jerusalem, signpost, bubble, voiceRings, headAt, kf, GOLDEN, es, ease, bump, seg, tr, PI } from './lib.js';

const JX = 800, FEET = 724;

export default {
  id: 'lk13-road',
  beats: [
    { v: 22 },
    { v: 23, text: 'Raz ktoś Go zapytał: «Panie, czy tylko nieliczni będą zbawieni?»' },
    { v: 23, cont: true, text: 'On rzekł do nich:' },
  ],
  cam: { x: [-30, 30], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const R = roadSet(S, { skyCols: GOLDEN, sunAt: [420, 170] });
    const c = R.c;
    // Jerusalem far off on the horizon, on the far sheet (it rolls slowly)
    R.far.add(`<g transform="translate(1330 404)">${jerusalem(c, 0.14, { tglow: true })}</g>`);

    /* the wayside: people listening, a signpost (a sheet that rolls with the road) */
    const way = S.layer({ par: 0.5, sh: 4, pad: 2600 });
    const folks = [[1180, 'a', 4], [1900, 'b', 3], [2600, 'c', 4], [3200, 'd', 3]].map(([x, k, n], i) => way.add(`<g transform="translate(${x} ${FEET - 58})">${knot('lk13-way-' + k, n, { s: 0.72, spread: 40, rows: 1, flip: true, arms: [10, 50] })}</g>`));
    way.add(`<g transform="translate(1500 ${FEET - 40}) scale(1.1)">${signpost(c, tr('Jerozolima', 'Jerusalem'), { size: 20, dir: 1 })}</g><g transform="translate(3000 ${FEET - 40}) scale(1.1)">${signpost(c, tr('Jerozolima', 'Jerusalem'), { size: 20, dir: 1 })}</g>`);
    void folks;

    /* the Twelve behind Him, Jesus, the man who asks */
    const twL = S.layer({ par: 0.5, sh: 4 });
    const groups = [0, 1, 2].map((g) => {
      const mem = [0, 1, 2, 3].map((k) => ({ x: -k * 40, y: (k % 2) * 8, s: 0.84, flip: false, armF: 14 + k * 6, armB: 8, head: -2, o: TWELVE[g * 4 + k].o }));
      return { g, x: 660 - g * 150, sp: twL.sprite(still(c, mem), 660 - g * 150, FEET - 30) };
    });
    const jL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(jL, c, { n: 3, color: C.sun, r: 34, w: 5 });
    const asker = S.puppet(jL.add(person(c, ASKER)));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const ask = fx.add(`<g opacity="0">${bubble(c, [tr('Panie, czy tylko nieliczni', 'Lord, are they few'), tr('będą zbawieni?', 'who are saved?')], { size: 20, tail: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      const travel = es(t, 0.0, 0.95, (u) => u) * 1500;
      const rolling = t > 0.0 && t < 0.95;
      R.update(T, travel);
      way.shift(-travel, 0);

      /* v22 — through towns and villages, teaching, on the way to Jerusalem */
      const stop = es(t, 1.02, 1.1);
      const turn = es(t, 2.05, 2.15);
      jesus.set({ x: JX, y: FEET, s: 1.04, flip: turn > 0.5, walk: rolling ? travel * 0.03 : undefined, armF: 16 + bump(t, 0.1, 0.9) * 40 + turn * 30, armB: 8 + bump(t, 0.1, 0.9) * 40 + turn * 110, head: -bump(t, 0.1, 0.9) * 6 + stop * 4 * (1 - turn), blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, FEET, 1.04, turn > 0.5);
      voice(hx, hy, bump(t, 0.05, 0.95) * 0.7 + es(t, 2.15, 2.3) * 0.7, T, { dir: turn > 0.5 ? -1 : 1, spread: 1.8 });
      groups.forEach((g) => g.sp.set({ x: g.x, y: FEET - 30 - (rolling ? Math.abs(Math.sin(travel * 0.02 + g.g)) * 3 : 0) }));

      /* v23 — a man runs up and asks */
      const run = es(t, 1.0, 1.3);
      const ax = lerp(1500, 1000, run);
      asker.set({ x: ax, y: FEET + 6, s: 1.0, flip: true, walk: run > 0 && run < 1 ? ax * 0.06 : undefined, armF: 20 + es(t, 1.3, 1.45) * 60, armB: 10 + es(t, 1.3, 1.45) * 30, head: -6, o: t > 0.99 ? 1 : 0, blink: blinkAt(T, 5) });
      const ak = es(t, 1.35, 1.5, ease.back) * (1 - es(t, 2.05, 2.2));
      const [ahx, ahy] = headAt(1000, FEET + 6, 1.0, true);
      pose(ask, { x: ahx + 10, y: ahy - 36, s: ak, o: ak > 0.02 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.y = 0;
      S.cam.z = 1.04;
      void kf; void seg; void PI; void mix; void shade; void sheet;
    };
  },
};
