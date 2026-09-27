// J 16,1 — the curtains open on the way down to the Kidron at night: the moon over the Mount of Olives, the city
// behind, the Eleven with their little lanterns around Jesus. "I have said these things to you so that you would not
// stumble": a cold gust sweeps across the slope, every flame bends and gutters, heads go down — He lifts His hand,
// a ring of calm goes out from Him, and the eleven little flames stand up straight and burn steady and bright.
import { curtains } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { pathSet, cast, put, lampK, nameTag, hanging, swing, kf, vis, tr, C, PI, nt } from './lib.js';

export default {
  id: 'j16-lamps',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [-30, 30], y: [-40, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const P = pathSet(S);
    const GY = P.GY;

    // the gust: pale wind strokes sweeping in from the left
    const windL = S.layer({ par: 0.4, sh: 0, flat: true });
    const gusts = Array.from({ length: 6 }, (_, i) => {
      const len = c.rr(160, 260);
      const pts = c.qbez([0, 0], [len * 0.5, -c.rr(10, 26)], [len, c.rr(-4, 6)], 14);
      return { i, y: 470 + i * 34 + c.rr(-10, 10), el: windL.add(`<g><path d="${c.ribbon(pts, (u) => Math.sin(u * PI) * 5 + 0.6)}" fill="${nt(C.skyVeil, 0.25)}" opacity=".75"/></g>`) };
    });

    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY });

    // the ring of calm
    const fx = S.layer({ par: 0.55, sh: 2, flat: true });
    const ring = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 100, 100, 0, PI * 2, 40), 4)}" fill="${C.halo}"/></g>`);

    const tagL = S.layer({ par: 0.3, sh: 4 });
    const tag = hanging(tagL, nameTag(c, tr('W drodze do Cedronu', 'On the way to the Kidron'), { size: 18 }), { x: 800, y: 250, len: 600 });
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      P.update(T);
      const tg = es(t, 0.3, 0.8, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      swing(tag, 800, 250 - (1 - tg) * 600, tg > 0.001 ? T : 0, 1.2, 0.8); fade(tag, tg > 0.001 ? 1 : 0);

      const gust = es(t, 1.0, 1.25) * (1 - es(t, 1.45, 1.7));
      const calm = es(t, 1.4, 1.75);
      const lift = bump(t, 1.3, 2.0);
      gusts.forEach((g) => {
        const k = seg(t, 0.98 + g.i * 0.04, 1.55 + g.i * 0.04);
        vis(g.el, { x: -200 + k * 1800, y: g.y + Math.sin(k * 6 + g.i) * 10, s: 1, o: k > 0 && k < 1 ? Math.sin(k * PI) : 0 });
      });

      D.forEach((m) => {
        const d = Math.abs(m.x - 800);
        const w = gust * (1 - es(t, 1.4 + d * 0.0008, 1.6 + d * 0.0008));
        const bright = es(t, 1.45 + d * 0.0008, 1.75 + d * 0.0008);
        lampK(m, 0.85 - w * 0.5 + bright * 0.15, w * 38, T);
        fade(m.sad, w * 0.9);
        put(m, T, { head: w * 12 - bright * 3, lean: -w * 3, armB: 8 + w * 40 });
      });
      fade(J.sad, 0);
      put(J, T, { armF: 22 + lift * 30, armB: 12 + lift * 118, head: -lift * 4 });

      const rk = seg(t, 1.38, 1.9);
      vis(ring, { x: 800, y: 600, s: 0.4 + rk * 3.2, sy: (0.4 + rk * 3.2) * 0.38, o: rk > 0 && rk < 1 ? (1 - rk) * (1 - rk) * 0.8 : 0 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 0], [1, 20], [2, 40]]);
      S.cam.z = kf(t, [[0, 1], [1, 1.04], [2, 1.12]]);
    };
  },
};
