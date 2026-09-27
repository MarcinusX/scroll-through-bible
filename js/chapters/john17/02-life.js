// J 17,3 — "This is eternal life": a ring without end draws itself around the radiance above, a gold word hanging
// in it. "That they may know You, the only true God": from the small flame above each of the Eleven a thread of
// light climbs to the radiance — knowing is light kindling — while three grey idols hanging in the dark crack and
// fall away. "And Him whom You sent, Jesus Christ": a ray comes down from the radiance to Jesus, every thread bends to
// pass through Him, and His name is lowered beside Him.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, lifeFlames, fatherLight, eternityRing, drawRing, goldWord, idol, strip,
  curves, spark, vis, kf, lower, pose, fade, tr, C, JX, JY, NIGHT, HOLY, PRAY, arcAt,
} from './lib.js';

const RY = 172;

export default {
  id: 'j17-life',
  beats: [
    { v: 3, text: 'A to jest życie wieczne:' },
    { v: 3, cont: true, text: 'aby znali Ciebie, jedynego prawdziwego Boga,' },
    { v: 3, cont: true, text: 'oraz Tego, którego posłałeś, Jezusa Chrystusa.' },
  ],
  cam: { x: [-20, 20], y: [-70, 30], z: [0.96, 1.12] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: HOLY });

    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 58)}</g>`);
    const ring = hiL.add(`<g>${eternityRing(c, 96, 8, 30)}</g>`);
    const word = hiL.add(`<g>${goldWord(c, tr('życie wieczne', 'eternal life'), { size: 22 })}</g>`);
    // the idols
    const idL = S.layer({ par: 0.12, sh: 4 });
    const IDOLS = [[420, 300, 0], [1170, 280, 1], [1010, 360, 2], [560, 380, 1]];
    const idols = IDOLS.map(([x, y, k]) => ({ x, y, str: idL.add(`<g><path d="M0 -1600V${k === 1 ? -34 : -62}" stroke="rgba(233,210,160,.4)" stroke-width="1.2" fill="none"/></g>`), el: idL.add(`<g>${idol(c, k)}</g>`) }));
    // the threads
    const thL = S.layer({ par: 0.3, sh: 0, flat: true });
    const thr = curves(thL, 11, { color: C.halo, w: 1.6 });
    const ray = thL.add(`<g><path d="M-3 0L3 0L10 1L-10 1Z" fill="#fff3cf" opacity=".6"/></g>`);
    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL);
    const D = eleven(S, peopleL);
    const fx = S.layer({ par: 0.42, sh: 2 });
    const flames = lifeFlames(S, fx, D);
    const nameL = S.layer({ par: 0.42, sh: 4 });
    const name = nameL.add(`<g><path d="M0 -1600V-14" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${strip(c, tr('Jezus Chrystus', 'Jesus Christ'), { size: 22, fill: C.cream })}</g>`);
    const glowJ = thL.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`);
    const run = D.map(() => fx.add(`<g>${spark(3.5)}</g>`));

    const JH = [JX + 2, JY - 175];
    return (t, time) => {
      const T = time;
      P.update(T);
      vis(high, { x: JX, y: RY, s: 1, r: T * 1.5, o: 1 });

      /* v3a — the ring of eternal life */
      const rk = es(t, 0.1, 0.7);
      vis(ring, { x: JX, y: RY, r: T * -2, o: rk > 0.01 ? 1 : 0 });
      drawRing(ring, rk);
      const wk = es(t, 0.45, 0.75, ease.out);
      lower(word, wk, JX, RY + 132, { len: 500 });

      /* v3b — knowing the only true God: threads from each flame up to the light; the idols fall */
      const via = es(t, 2.1, 2.55);
      D.forEach((m, i) => {
        const [hx, hy] = headOf(m);
        const a = [hx, hy - 30 * m.s - 18];
        const d = Math.abs(m.x - JX) / 400;
        const k = es(t, 1.05 + d * 0.2, 1.45 + d * 0.2);
        // later the thread runs through Him: a → Jesus' head, then His ray carries it up
        const b = [lerpP(JX, JX + (m.x - JX) * 0.25, 1 - via), lerpP(RY + 60, JH[1] - 40, via)];
        thr(i, a, b, -40 - d * 30, k, 0.8);
        const u = (T * 0.25 + i * 0.13) % 1;
        const [sx, sy] = arcAt(a, b, -40 - d * 30, u);
        vis(run[i], { x: sx, y: sy, s: 0.8, o: k > 0.95 ? Math.sin(u * Math.PI) : 0 });
        put(m, T, { head: -10 - k * 8 + via * 10 * (m.flip ? 1 : 1) });
        lampK(m, 0.8 + k * 0.2, k * 0.4);
      });
      flames(1, T, { boost: es(t, 1.1, 1.6) });
      idols.forEach((d, i) => {
        const f = es(t, 1.45 + i * 0.08, 1.85 + i * 0.08, ease.in);
        vis(d.el, { x: d.x + f * (i % 2 ? 30 : -30), y: d.y + f * 520, r: f * (i % 2 ? 50 : -60), o: (1 - es(t, 1.7 + i * 0.08, 1.9 + i * 0.08)) });
        vis(d.str, { x: d.x, y: d.y - f * 900, o: 1 - f });
      });

      /* v3c — and Him whom You sent: a ray to Him, the name */
      const rr = es(t, 2.05, 2.4);
      vis(ray, { x: JX, y: RY + 50, sx: 3, sy: Math.max(1, rr * (JH[1] - 60 - RY)), o: rr });
      vis(glowJ, { x: JX, y: JY - 120, s: 0.8 + rr * 0.8, o: 0.3 + rr * 0.7 });
      lower(name, es(t, 2.3, 2.65, ease.out), 1000, 410, { len: 600, r: T ? Math.sin(T * 0.8) * 1.2 : 0 });

      put(J, T, { head: PRAY.head + bump(t, 2.15, 2.9) * 10, armF: PRAY.armF - bump(t, 2.2, 2.95) * 20, armB: PRAY.armB });
      P.sky.blend(NIGHT, HOLY, 0.7);

      S.cam.x = kf(t, [[0, 0], [2, 0], [3, 10]]);
      S.cam.y = kf(t, [[0, -60], [0.9, -60], [1.6, -20], [2.2, -10], [3, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2, 1.0], [3, 1.06]]);
    };
  },
};
function lerpP(a, b, k) { return a + (b - a) * k; }
