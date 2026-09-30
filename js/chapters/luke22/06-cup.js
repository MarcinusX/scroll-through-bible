// Łk 22,17–18 — the first cup. He takes it and gives thanks (His eyes lifted); "Take this and share it among
// yourselves": the cup goes round the table from hand to hand, left side and right side. "I will not drink of the
// fruit of the vine until the Kingdom of God comes": He sets the cup down, and a vine heavy with grapes grows along
// the wall on both sides, meeting above Him.
import { es, ease, bump, seg } from '../../core/anim.js';
import { tableSet, NIGHTROOM, kf, hand, headAt, chalice, vineSpray, vis, pose, fade, attr, lerp, mix, blinkAt, C, PI } from './lib.js';

export default {
  id: 'lk22-cup',
  beats: [
    { v: 17 },
    { v: 18 },
  ],
  cam: { x: [-40, 40], y: [0, 200], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: ['#4d4a7c', '#9a7f98', '#d8a592'] });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus;
    // the vine along the wall, revealed by a growing circle
    const vineL = T0.wallFx;
    const clip = S.id('vclip');
    vineL.add(`<defs><clipPath id="${clip}"><circle data-k="vr" cx="800" cy="720" r="10"/></clipPath></defs><g clip-path="url(#${clip})">${vineSpray(c, [380, 720], [800, 262])}${vineSpray(c, [1220, 720], [800, 262])}</g>`);
    const vr = S.$('vr');
    const fx = S.layer({ par: 0.57, sh: 4 });
    const cupEl = fx.add(`<g>${chalice(c, 44)}</g>`);
    const others = at.filter((m) => m.k !== 'jesus');
    const left = others.filter((m) => m.x < 800).sort((a, b) => b.x - a.x), right = others.filter((m) => m.x > 800).sort((a, b) => a.x - b.x);
    const handOf = (m) => hand(m.x, SEAT, m.s, m.flip, 60, 0, 62);

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0.1);
      R.stars.fade(1);
      R.sky.blend(['#4d4a7c', '#9a7f98', '#d8a592'], NIGHTROOM, es(t, 0, 2));

      /* v17 — He takes the cup, gives thanks; it goes round */
      const take = es(t, 0.05, 0.2);
      const thanks = es(t, 0.15, 0.35) * (1 - es(t, 0.5, 0.62));
      const give = es(t, 0.5, 0.62) * (1 - es(t, 0.95, 1.05));
      const round = seg(t, 0.55, 1.25);
      const setDown = es(t, 1.26, 1.42);
      const armF = 40 + take * 30 + thanks * 40 + give * 20 - setDown * 20;
      const [hx, hy] = hand(800, SEAT, J.s, false, armF, 0, 62);
      const path = [[hx, hy], ...left.map(handOf), [800, TOP + 14], ...right.map(handOf), [hx, hy]];
      const f = round * (path.length - 1), si = Math.min(path.length - 2, Math.floor(f)), sf = f - si;
      const inRound = round > 0 && round < 1;
      const [cx, cy] = inRound ? [lerp(path[si][0], path[si + 1][0], ease.io(sf)), lerp(path[si][1], path[si + 1][1], ease.io(sf)) - Math.sin(sf * PI) * 12] : [hx, hy];
      const [dx, dy] = setDown > 0 ? [lerp(hx, 856, setDown), lerp(hy, TOP, setDown)] : [cx, cy];
      vis(cupEl, { x: dx, y: dy + 6, o: take > 0.01 ? 1 : 0 });
      T0.sit(J, T, { armF, armB: 16 + thanks * 60 + es(t, 1.7, 1.95) * 50, head: -thanks * 14 - es(t, 1.75, 2.0) * 10 });
      fade(J.sad, 0);
      others.forEach((m) => {
        const near = inRound ? Math.max(0, 1 - Math.abs(cx - handOf(m)[0]) / 50) : 0;
        T0.sit(m, T, { armF: 36 + near * 26, head: thanks * 6 - near * 10 - es(t, 1.7, 2.0) * 10 });
        fade(m.sad, 0);
      });

      /* v18 — not of the fruit of the vine until the Kingdom comes */
      attr(vr, 'r', Math.round(10 + es(t, 1.2, 1.85) * 720));

      S.cam.x = 0;
      S.cam.z = kf(t, [[-0.3, 1.36], [0.4, 1.46], [0.7, 1.16], [1.6, 1.16], [1.9, 1.06]]);
      S.cam.y = kf(t, [[-0.3, 170], [0.4, 190], [0.7, 110], [1.6, 110], [1.9, 40]]);
    };
  },
};
