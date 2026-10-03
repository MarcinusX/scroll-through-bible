// Łk 14,1–2 — noon on the sabbath (a little tag with two candles hangs from the flies) in the court of a ruler of the
// Pharisees: a vine pergola overhead, columns on the garden, the long table laid, the host on his couch at its head and
// the two places of honour beside him still empty, with their gold bolsters. Jesus comes in through the gateway and
// takes His place in the middle of the table; the host raises his hand in welcome — and every head at the table turns
// to Him: little paper eyes open over the lawyers and Pharisees; they are watching Him. Then, in the gateway, a man
// swollen with dropsy, leaning on a stick, shuffles in and stands before Him.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { rulerHouse, rulerTable, RH, rhHX, dropsyMan, eyeGlyph, headAt, kf, moving, popAt } from './lib.js';

export default {
  id: 'lk14-sabbath',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-80, 40], y: [0, 150], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    const R = rulerHouse(S);
    const T0 = rulerTable(S, R, { seats: [0, 1, 2, 3] });
    const jWalk = S.puppet(R.backL.add(person(c, CAST.jesus)));
    const jSit = S.puppet(R.backL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const sick = S.puppet(R.frontL.add(dropsyMan(c)));
    const eyes = [0, 1, 2, 3, 4].map((i) => R.fx.add(`<g opacity="0">${eyeGlyph(c, 13)}</g>`));

    return (t, time) => {
      const T = time;
      R.update(T);
      /* v1 — He comes in through the gateway and takes His place */
      const WK = [[1.0, 300], [1.12, 330], [1.48, RH.JX]];
      const wx = kf(t, WK);
      const sat = es(t, 1.5, 1.56);
      jWalk.set({ x: wx, y: RH.SEAT, s: 1.02, o: seg(t, 1.0, 1.06) * (1 - sat), walk: moving(t, WK) ? wx * 0.05 : undefined, amt: 0.8, armF: 12, blink: blinkAt(T) });
      const sickIn = seg(t, 2.0, 2.06);
      const toSick = es(t, 2.4, 2.6);
      jSit.set({ x: RH.JX, y: RH.SEAT, s: 1.02, o: sat, flip: toSick > 0.5, armF: 30 + es(t, 1.6, 1.8) * 16, armB: 10, head: 2 + toSick * 6, blink: blinkAt(T) });
      // the table: all turn to watch Him; the host welcomes Him
      const watch = es(t, 1.35, 1.6);
      const glanceSick = es(t, 2.35, 2.55);
      T0.set(t, T, {
        look: 1,
        heads: { 0: -6 + watch * 12 - glanceSick * 8, 1: 4 + watch * 8, 2: 2 + watch * 10 - glanceSick * 14, 3: -2 + watch * 10 },
        arms: { 0: [20, 10], 1: [30 + watch * 30, 10], 2: [20, 10], 3: [24 + watch * 20, 10] },
        hostArmF: 30 + bump(t, 1.2, 1.9) * 30, hostArmB: 10 + bump(t, 1.2, 1.9) * 110, hostHead: 4 + watch * 4,
      });
      // little eyes open over the watchers
      const W = [[RH.SEATS[0], RH.SEAT, 0.98, false], [RH.SEATS[1], RH.SEAT, 0.98, false], [RH.SEATS[2], RH.SEAT, 0.98, false], [RH.SEATS[3], RH.SEAT, 0.98, true], [rhHX(S), RH.HY, 1.02, true]];
      eyes.forEach((e, i) => {
        const [x, y, s, fl] = W[i];
        const [hx, hy] = headAt(x, y, s, fl, 62);
        popAt(e, t, 1.55 + i * 0.04, 2.3, hx + (fl ? -6 : 6), hy - 48 + (T ? Math.sin(T * 1.4 + i) * 2 : 0), { d: 0.1, s: 1 });
      });
      /* v2 — a man with dropsy before Him */
      const SK = [[2.05, 300, 640], [2.5, 700, RH.FL]];
      const [sx, sy] = kf(t, SK.map(([a, x, y]) => [a, [x, y]]));
      sick.set({ x: sx, y: sy, s: 1.0, o: sickIn, walk: moving(t, SK) ? sx * 0.035 : undefined, amt: 0.45, armF: 18, armB: 6, lean: 4, head: 6 - es(t, 2.5, 2.7) * 10, blink: blinkAt(T, 4) });

      S.cam.x = kf(t, [[0, -10], [1.0, -30], [1.4, 0], [2.0, 0], [2.5, -30]]);
      S.cam.y = kf(t, [[0, 60], [1.0, 80], [1.5, 120], [2.5, 140]]);
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.12], [1.5, 1.2], [2.5, 1.24]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 0], [1.0, -60], [1.5, 0], [2.0, 0], [2.5, -10]]); S.cam.z = 1.0; }
    };
  },
};
