// Łk 14,15–16a — back at the ruler's table. One of the guests on the gold bolsters, pleased with his place, lifts his
// cup: "Blessed is he who will feast in the kingdom of God!" — and a golden medallion of that feast comes down over the
// table: a table in the light, under a crown. Jesus turns to him and answers.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { rulerHouse, rulerTable, RH, LATE, kingdomFeast, bubble, voiceRings, headAt, kf, popAt, cup, tr } from './lib.js';

export default {
  id: 'lk14-kingdom',
  beats: [
    { v: 15 },
    { v: 16, text: 'Jezus mu odpowiedział:' },
  ],
  cam: { x: [-20, 120], y: [0, 160], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    const R = rulerHouse(S);
    const late = LATE.map((o, i) => S.puppet(R.backL.add(person(c, { ...o, pose: 'sit', holdF: i === 1 ? `<g transform="rotate(100)">${cup(c, C.sun)}</g>` : '' }))));
    const T0 = rulerTable(S, R, { seats: [0, 1, 2, 3] });
    const jSit = S.puppet(R.backL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const voice = voiceRings(R.fx, c, { n: 3, color: C.sun, r: 26, w: 4 });
    const gv = voiceRings(R.fx, c, { n: 2, color: C.clay, r: 22, w: 4 });
    const kf_ = R.fx.add(`<g opacity="0">${kingdomFeast(c, 62)}</g>`);
    const say = R.fx.add(`<g opacity="0">${bubble(c, [tr('Szczęśliwy ten, kto będzie', 'Blessed is he who will'), tr('ucztował w królestwie Bożym!', 'feast in God’s Kingdom!')], { size: 19, dir: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T);
      const raise = es(t, 0.08, 0.22);
      const X1 = RH.HONOUR[0];
      late.forEach((p, i) => p.set({ x: RH.HONOUR[1 - i], y: RH.SEAT, s: 0.98, flip: false, armF: i === 1 ? 20 + raise * 100 : 24, armB: 10, head: i === 1 ? -4 - raise * 10 : -2 + raise * 4, blink: blinkAt(T, i + 5) }));
      const [ghx, ghy] = headAt(X1, RH.SEAT, 0.98, false, 62);
      gv(ghx, ghy, bump(t, 0.1, 0.95), T, { spread: 1.6 });
      popAt(say, t, 0.14, 1.0, ghx + 10, ghy - 30, { d: 0.12 });
      const kk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.6, 1.9, ease.in));
      pose(kf_, { x: 920, y: lerp(-700, 330, kk) + (T ? Math.sin(T * 1.1) * 3 : 0), o: kk > 0.01 ? 1 : 0 });
      /* v16a — He answers him */
      const speak = es(t, 1.06, 1.18);
      jSit.set({ x: RH.JX, y: RH.SEAT, s: 1.02, flip: false, armF: 30 + speak * 40, armB: 10 + speak * 60, head: -2 + es(t, 0.2, 0.4) * -4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(RH.JX, RH.SEAT, 1.02, false, 62);
      voice(jhx, jhy, speak, T, { spread: 1.8 });
      T0.set(t, T, { heads: { 0: -6, 1: -4 + es(t, 0.3, 0.5) * -6, 2: -4, 3: 4 }, hostArmF: 30 + raise * 20, hostArmB: 10, hostHead: 6 });

      S.cam.x = kf(t, [[0, 60], [1.0, 60], [1.3, 30]]);
      S.cam.y = kf(t, [[0, 90], [1.0, 90], [1.3, 120]]);
      S.cam.z = kf(t, [[0, 1.14], [1.0, 1.16], [1.3, 1.22]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 90], [1.0, 90], [1.3, 40]]); S.cam.z = 1.0; }
      void seg;
    };
  },
};
