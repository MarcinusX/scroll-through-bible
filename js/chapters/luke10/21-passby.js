// Łk 10,31–32 — the same stretch of the Jericho road; the man lies at the roadside in the hot sun. "Now by chance a
// priest was going down that road": in his white robe and turban he comes down from Jerusalem, sees the man — stops,
// a hand to his mouth — and then crosses over to the far side of the road and hurries past, his face turned away.
// "So likewise a Levite, when he came to the place and saw him": the Levite comes nearer still, even bends to look —
// then he too steps across to the other side and goes on his way down to Jericho.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { jerichoSet, ROAD, lying, priest, LEVITE, glow, kf, moving, HOT, STRIPPED, es, ease, bump, seg, PI } from './lib.js';
import { scrollRolled } from '../mark2/lib.js';

export default {
  id: 'lk10-passby',
  parable: true,
  beats: [
    { v: 31 },
    { v: 32 },
  ],
  cam: { x: [-40, 90], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const V = jerichoSet(S, { skyCols: HOT, sunAt: S.portrait ? [1000, 150] : undefined });   // phone: the sun clear of the thread
    const c = S.c;
    const P = S.layer({ par: 0.44, sh: 5 });
    const man = P.add(`<g>${lying(person(c, { ...STRIPPED, eyes: 'closed' }), 0.95)}</g>`);
    const pr = S.puppet(P.add(priest(c, 2)));
    const lv = S.puppet(P.add(person(c, { ...LEVITE, holdB: `<g transform="rotate(20)">${scrollRolled(c, 36)}</g>` })));
    V.front();

    /** a walker: comes down the near side, stops at `stopX` to look, crosses to the far side, hurries on */
    const walker = (p, t0, { stopX, lean = 0 }) => (t, T, seed) => {
      const k1 = es(t, t0, t0 + 0.32, (x) => x);          // to the stop
      const cross = es(t, t0 + 0.5, t0 + 0.64);           // over to the far side
      const k3 = es(t, t0 + 0.58, t0 + 0.9, (x) => x);    // hurrying on
      const x = lerp(lerp(-120, stopX, k1), 1500, k3);
      const y = lerp(ROAD.MID, ROAD.FAR - 6, cross);
      const s = lerp(0.98, 0.8, cross);
      const stopped = k1 >= 1 && k3 <= 0 && cross < 0.5;
      const look = es(t, t0 + 0.32, t0 + 0.42) * (1 - es(t, t0 + 0.5, t0 + 0.56));
      const away = es(t, t0 + 0.56, t0 + 0.62);
      const moving_ = !stopped && t > t0 && k3 < 1;
      p.set({ x, y, s, flip: false, walk: moving_ ? x * 0.05 + (cross > 0 && cross < 1 ? t * 30 : 0) : undefined, armF: 14 + look * 90, armB: 10 + look * 10, head: look * 16 - away * 12, lean: look * lean, blink: blinkAt(T, seed), o: t > t0 - 0.05 && k3 < 1 ? 1 : 0 });
    };
    const priestW = walker(pr, 0.0, { stopX: 520, lean: 4 });
    const leviteW = walker(lv, 1.0, { stopX: 600, lean: 16 });

    return (t, time) => {
      const T = time;
      V.update(T);
      pose(man, { x: ROAD.LIE[0] + 80, y: ROAD.LIE[1] });
      priestW(t, T, 3);
      leviteW(t, T, 4);
      const GO = S.portrait ? 90 : 30;   // phone: the camera follows each further as he hurries past, clear of the thread
      S.cam.x = kf(t, [[0, -20], [0.5, -20], [0.9, GO], [1.0, -20], [1.5, -20], [1.9, GO], [2, GO]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.04], [0.4, 1.08], [1, 1.04], [1.4, 1.08], [2, 1.04]]);
    };
  },
};
