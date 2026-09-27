// J 16,28–30 — "I came from the Father and have come into the world": a diagram drawn in light above them — from
// the light at the top (never a figure) a golden dotted arc curves down to a small paper globe, and a bright star
// travels down it. "Again, I leave the world and go to the Father": the arc goes on up the other side, and the star
// climbs back into the light — a whole loop of gold. "Behold, now You speak plainly, and speak no figures": the
// Eleven step forward with glad exclamation-bubbles, lanterns lifted. "Now we know that You know all things, and
// don't need anyone to question You": little stars ring His head. "By this we believe that You came from God": they
// point up to the light, and the descending arc glows once more.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, fatherLight, globe, goldArc, at, spark, speech, GLYPH, headAt, hanging,
  sheet, shade, mix, kf, vis, pose, lerp, C, PI, JX, NIGHT, PREDAWN,
} from './lib.js';

const TOP = [JX, 130], WG = [JX, 380];

export default {
  id: 'j16-arc',
  beats: [
    { v: 28, text: 'Wyszedłem od Ojca i przyszedłem na świat;' },
    { v: 28, cont: true, text: 'znowu opuszczam świat i idę do Ojca».' },
    { v: 29 },
    { v: 30, text: 'Teraz wiemy, że wszystko wiesz i nie trzeba, aby Cię kto pytał.' },
    { v: 30, cont: true, text: 'Dlatego wierzymy, że od Boga wyszedłeś».' },
  ],
  cam: { x: [-20, 20], y: [-90, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = pathSet(S);
    const GY = P.GY;

    const lightL = S.layer({ par: 0.14, sh: 2 });
    const light = lightL.add(`<g>${fatherLight(c, 60, { ray: [1.5, 2.3], glow: 2.8 })}</g>`);
    const arcL = S.layer({ par: 0.18, sh: 0, flat: true });
    const downPts = c.cbez([TOP[0] - 20, TOP[1] + 30], [520, 150], [520, 380], [WG[0] - 58, WG[1] - 4], 40);
    const upPts = c.cbez([WG[0] + 58, WG[1] - 4], [1080, 380], [1080, 150], [TOP[0] + 20, TOP[1] + 30], 40);
    const glowD = goldArc(arcL, c, downPts, { w: 5, n: 38, col: C.halo });
    const glowU = goldArc(arcL, c, upPts, { w: 5, n: 38, col: C.halo });
    const gL = S.layer({ par: 0.2, sh: 5 });
    const world = hanging(gL, `<circle r="80" fill="url(#halo-glow)" opacity=".4"/>${globe(c, 52)}`, { x: WG[0], y: WG[1], len: 700 });
    const starL = S.layer({ par: 0.2, sh: 3 });
    const star = starL.add(`<g>${spark(c, 16)}</g>`);

    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY });
    const fx = S.layer({ par: 0.56, sh: 4 });
    const bangs = D.map((m) => ({ m, el: fx.add(`<g>${speech(c, `<g transform="scale(1.1)">${GLYPH.bang(c)}</g>`, { w: 40, h: 40, flip: m.flip })}</g>`) }));
    const ring = Array.from({ length: 9 }, (_, i) => ({ i, el: fx.add(`<g><path d="${c.cut(c.star(0, 0, 6, 2.4, 4, 0), 0.1, 2)}" fill="${C.halo}"/><circle r="9" fill="url(#warm-glow)"/></g>`) }));

    return (t, time) => {
      const T = time;
      P.update(T);
      const lk = es(t, -0.2, 0.2);
      vis(light, { x: TOP[0], y: TOP[1], s: 0.8 + (T ? Math.sin(T * 1.1) * 0.015 : 0), o: lk });
      const wIn = es(t, -0.2, 0.25, ease.out);
      vis(world, { x: WG[0], y: WG[1] - (1 - wIn) * 700, r: T ? Math.sin(T * 0.7) * 1 : 0, o: wIn > 0.01 ? 1 : 0 });

      /* v28 — the loop of light */
      const dk = es(t, 0.15, 0.75), uk = es(t, 1.15, 1.75);
      const again = bump(t, 4.1, 4.95);
      glowD(dk, 0.95 - (t > 2 ? 0.45 : 0) + again * 0.5);
      glowU(uk, t > 2 ? 0.5 : 0.95);
      let sx, sy, so = 0;
      if (t < 1.05) { [sx, sy] = at(downPts, dk); so = dk > 0.01 && dk < 0.99 ? 1 : dk >= 0.99 ? 1 - es(t, 0.8, 0.95) : 0; }
      else if (t < 2.05) { [sx, sy] = at(upPts, uk); so = uk > 0.01 && uk < 0.99 ? 1 : uk >= 0.99 ? 1 - es(t, 1.8, 1.95) : 0; }
      else { const k = es(t, 4.15, 4.7); [sx, sy] = at(downPts, k); so = k > 0.01 && k < 0.99 ? 1 : 0; }
      vis(star, { x: sx, y: sy, s: 1 + (T ? Math.sin(T * 5) * 0.08 : 0), o: so });

      /* v29 — glad exclamations */
      bangs.forEach(({ m, el }, i) => {
        const k = es(t, 2.1 + (i % 4) * 0.05, 2.3 + (i % 4) * 0.05, ease.back) * (1 - es(t, 2.9, 3.05));
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        vis(el, { x: hx + (m.flip ? -12 : 12), y: hy - 26, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v30a — a ring of stars round His head */
      const rk = es(t, 3.15, 3.6);
      ring.forEach(({ i, el }) => {
        const a = (i / 9) * PI * 2 + (T ? T * 0.4 : 0);
        const [hx, hy] = headAt(JX, J.y, J.s, false);
        vis(el, { x: hx + Math.cos(a) * 46, y: hy - 4 + Math.sin(a) * 16, s: Math.min(1, rk * 9 - i) , o: Math.max(0, Math.min(1, rk * 9 - i)) * (1 - es(t, 4.8, 5)) });
      });

      /* people */
      D.forEach((m) => {
        const d = Math.abs(m.x - JX);
        const step = es(t, 2.05 + d * 0.0003, 2.35 + d * 0.0003);
        const look = es(t, 0.1, 0.4) * (1 - es(t, 1.9, 2.1)) + es(t, 4.05, 4.3);
        const point = es(t, 4.1 + d * 0.0003, 4.35 + d * 0.0003);
        const nod = bump(t, 3.2, 3.6) + bump(t, 3.55, 3.9);
        lampK(m, 0.85 + step * 0.15, 0, T);
        put(m, T, { x: m.x + (m.flip ? -1 : 1) * step * 16, head: -look * 14 + nod * 8 - step * 4, armF: m.arm + step * 8, armB: 8 + step * (m.i % 2 ? 100 : 60) * (1 - point) * (1 - es(t, 2.95, 3.15)) + point * (m.i % 2 ? 150 : 60) });
      });
      put(J, T, { armF: 20 + bump(t, 0.1, 0.9) * 60 + bump(t, 3.1, 3.9) * 30, armB: 10 + bump(t, 1.1, 1.9) * 140, head: -bump(t, 1.2, 1.9) * 12 + bump(t, 0.2, 0.9) * 4 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -60], [2, -60], [2.4, -10], [3.2, -20], [4.1, -60], [5, -60]]);
      S.cam.z = kf(t, [[0, 1.0], [2, 1.0], [2.4, 1.08], [3.5, 1.1], [4.2, 1.0], [5, 1.0]]);
    };
  },
};
