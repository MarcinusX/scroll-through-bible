// Mt 13,36a — dusk on the lake. Jesus sends the crowds away: the groups on the beach turn and drift off to both
// sides. The boat is drawn up; He steps out and walks along the sand to Peter's house, where a lamp is lit in the
// window, and the disciples follow Him in.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { shoreSet, beachCrowd, boatIn, placeBoat, kf, moving, DUSK } from './lib.js';

export default {
  id: 'mt13-home',
  beats: [
    { v: 36, text: 'Wtedy odprawił tłumy i wrócił do domu.' },
  ],
  cam: { x: [-80, 0], y: [0, 80], z: [1, 1.2] },
  build(S) {
    const Z = shoreSet(S, { skyCols: DUSK, sunAt: [1150, 330], house: true });
    const c = Z.c;
    const crowd = beachCrowd(S, Z.crowdL, [
      { y: 508, s: 0.34, n: 24, x0: 520, x1: 1560 },
      { y: 526, s: 0.41, n: 16, x0: 560, x1: 1510 },
      { y: 546, s: 0.49, n: 12, x0: 600, x1: 1460 },
    ], { per: 4, gap: 0, arms: [0, 16], seed: 'mt13-home-crowd' });
    crowd.forEach((g) => { g.to = g.x < 1000 ? g.x - 1300 - g.d * 300 : g.x + 900 + g.d * 300; });
    // the lamp in the window of the house
    const win = Z.beach.add(`<g><circle cx="432" cy="444" r="50" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(420, 434, 24, 19))}" fill="${C.lampGlow}"/></g>`);
    const walkL = S.layer({ par: 0.34, sh: 4 });
    const jWalk = S.puppet(walkL.add(person(c, { ...CAST.jesus })));
    const DIS = [CAST.peter, CAST.john, CAST.andrew, CAST.james].map((o, i) => ({ i, p: S.puppet(walkL.add(person(c, o))), seed: c.rr(0, 6) }));
    const B = boatIn(Z.boatL, c, () => S.puppet(Z.boatL.add(person(c, { ...CAST.jesus, pose: 'sit' }))));
    const jBoat = B.inside;
    placeBoat(B, 935, 590, 0.5, 0);
    const JK = [[0.2, 930], [0.85, 390], [0.95, 374]];

    return (t, time) => {
      Z.update(time * 0.6, { sunY: 330 + es(t, 0, 1) * 60 });
      crowd.forEach((g) => {
        const k = es(t, 0.02 + g.d * 0.3, 0.5 + g.d * 0.3, ease.in);
        g.sp.set({ x: lerp(g.x, g.to, k), y: g.y, o: 1 - seg(t, 0.6 + g.d * 0.3, 0.9 + g.d * 0.3) });
      });
      jBoat.set({ x: 935 - 5, y: 590 - 6, s: 0.5, o: 1 - seg(t, 0.14, 0.2), armF: 30 + bump(t, 0, 0.14) * 60, armB: 10 + bump(t, 0, 0.14) * 60, blink: blinkAt(time) });
      const jx = kf(t, JK);
      jWalk.set({ x: jx, y: 548, s: 0.5, flip: true, o: seg(t, 0.14, 0.2) * (1 - seg(t, 0.93, 0.99)), walk: moving(t, JK) ? jx * 0.1 : undefined, blink: blinkAt(time) });
      DIS.forEach((d) => {
        const keys = [[0.12 + d.i * 0.05, 1060 + d.i * 50], [0.9 + d.i * 0.03, 440 + d.i * 44]];
        const x = kf(t, keys);
        d.p.set({ x, y: 540 + (d.i % 2) * 8, s: 0.46, flip: true, walk: moving(t, keys) ? x * 0.1 : undefined, blink: blinkAt(time, d.seed) });
      });
      fade(win, 0.5 + es(t, 0.2, 0.6) * 0.5);
      S.cam.x = kf(t, [[0, 0], [0.9, -70]]);
      S.cam.z = kf(t, [[0, 1.04], [0.9, 1.14]]);
      S.cam.y = kf(t, [[0, 30], [0.9, 60]]);
    };
  },
};
