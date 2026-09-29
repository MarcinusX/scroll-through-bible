// Mt 28,16–17 — Galilee again: the mountain of the Sermon over the lake. The Eleven come up the hillside in a line,
// Peter first, and spread out round the knoll — the place where Jesus told them to go (Peter still turns the women's
// word over: "there you will see me"). Then He is there on the knoll, in light, and they fall to their knees and bow
// down. But some doubted: three of them stay on their feet, hanging back, a question over each head.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { ELEVEN, galileeMount, KX, RING, DOUBT, glory, headAt, thought, risenIcon, question, sparkle, along } from './lib.js';


export default {
  id: 'mt28-mountain',
  beats: [
    { v: 16, text: 'Jedenastu zaś uczniów udało się do Galilei na górę,' },
    { v: 16, cont: true, text: 'tam gdzie Jezus im polecił.' },
    { v: 17, text: 'A gdy Go ujrzeli, oddali Mu pokłon.' },
    { v: 17, cont: true, text: 'Niektórzy jednak wątpili.' },
  ],
  cam: { x: [-200, 40], y: [-20, 80], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const H = galileeMount(S);
    const { G, gfn } = H;
    const JY = gfn(KX) + 4;
    /* the path up the hill */
    const pathPts = [[-420, 940], [-160, 860], [80, 810], [300, 780], [520, 760], [760, 748]];
    G.add(`<path d="${c.ribbon(pathPts, (u) => 60 - u * 34, 2)}" fill="${C.sand}" opacity=".7"/>`);

    /* Jesus on the knoll, in light */
    const L = S.layer({ par: 0.5, sh: 5 });
    const place = L.add(`<g><ellipse cx="0" cy="-10" rx="160" ry="50" fill="url(#halo-glow)"/></g>`);
    const gl = L.add(`<g>${glory(c, 300, 24)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const shine = [0, 1, 2].map(() => L.add(`<g>${sparkle(c, 14)}</g>`));

    /* the Eleven: standing (walking up), kneeling */
    const PL = S.layer({ par: 0.52, sh: 5 });
    const M = ELEVEN.map((m, i) => {
      const [x, dy] = RING[i];
      return { ...m, i, x, y: gfn(x) + dy, s: 0.9 + dy * 0.0014, flip: x > KX, seed: c.rr(0, 9), doubt: DOUBT.includes(i) };
    }).sort((a, b) => a.y - b.y);
    // each walks the path, then leaves it for his own place round the knoll
    M.forEach((m) => {
      m.pts = [...pathPts.slice(0, m.x < KX ? 4 : 5), [m.x, m.y]];
      m.len = 0;
      for (let i = 1; i < m.pts.length; i++) m.len += Math.hypot(m.pts[i][0] - m.pts[i - 1][0], m.pts[i][1] - m.pts[i - 1][1]);
    });
    const LMAX = Math.max(...M.map((m) => m.len));
    M.forEach((m) => { m.st = S.puppet(PL.add(person(c, m.o))); m.kn = S.puppet(PL.add(person(c, { ...m.o, pose: 'kneel' }))); });
    const qs = DOUBT.map(() => PL.add(`<g>${question(c)}</g>`));
    const memo = PL.add(`<g>${thought(c, `<g transform="translate(0 2) scale(1.2)">${risenIcon(c)}</g>`, { w: 110, h: 84 })}</g>`);

    return (t, time) => {
      H.update(time);
      /* v16a: up the mountain, in a line (whole cut-outs gliding, a little step-bob) */
      const byI = Object.fromEntries(M.map((m) => [m.i, m]));
      const kneel = seg(t, 2.3, 2.37);
      M.forEach((m) => {
        // a line up the path: the leader's distance along it, each one ~66 units behind the one before
        const d = seg(t, 0.02, 1.45) * (LMAX + 10 * 88) - m.i * 88;
        const u = Math.max(0, Math.min(1, d / m.len));
        const [x, y] = along(m.pts, u);
        const settle = es(u, 0.8, 1);
        const moving = u > 0 && u < 1;
        const bobY = moving ? -Math.abs(Math.sin(x * 0.06)) * 4 : 0;
        const s = lerp(1.0, m.s, settle);
        const look = es(t, 2.05, 2.3);
        const kn = m.doubt ? 0 : kneel;
        m.st.set({ x, y: y + bobY, s, flip: settle > 0.5 ? m.flip : false, o: 1 - kn, armF: 18 + look * (m.doubt ? 20 : 60), armB: 10 + look * (m.doubt ? 0 : 50), head: -look * 10 + (m.doubt ? es(t, 3.1, 3.4) * 14 : 0), lean: m.doubt ? -es(t, 3.1, 3.4) * 6 : 0, blink: blinkAt(time, m.seed) });
        m.kn.set({ x, y, s, flip: m.flip, o: kn, armF: 60 + es(t, 2.4, 2.7) * 16, armB: 50, head: 16 + es(t, 2.4, 2.7) * 10, lean: 10, blink: 1 });
        m.cx = x; m.cy = y; m.cs = s;
      });
      /* v16b: the place He told them */
      const pl = es(t, 1.05, 1.4);
      pose(place, { x: KX, y: JY, s: 0.6 + pl * 0.5, o: pl * (1 - es(t, 2.0, 2.3) * 0.5) });
      const pm = byI[0];
      const mk = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 1.95, 2.05));
      const [phx, phy] = headAt(pm.cx, pm.cy, pm.cs, pm.flip);
      pose(memo, { x: phx + 10, y: phy - 20, s: mk, o: mk > 0.01 ? 1 : 0 });

      /* v17a: they see Him and worship */
      const come = es(t, 2.02, 2.3);
      jesus.set({ x: KX, y: JY, s: 1.12, o: come, armF: 20 + come * 40, armB: 14 + come * 60, head: -2, blink: blinkAt(time) });
      pose(gl, { x: KX, y: JY - 120, s: 0.5 + come * 0.5 + bump(t, 2.02, 2.6) * 0.3, r: t * 5, o: come * 0.8 });
      shine.forEach((el, i) => { const b = bump(t, 2.1 + i * 0.1, 2.8 + i * 0.1); pose(el, { x: KX - 120 + i * 120, y: JY - 240 - (i % 2) * 40, s: b, r: time * 30, o: b }); });

      /* v17b: but some doubted */
      DOUBT.forEach((d, k) => {
        const m = byI[d];
        const [hx, hy] = headAt(m.cx, m.cy, m.cs, m.flip);
        const q = es(t, 3.1 + k * 0.08, 3.3 + k * 0.08, ease.back);
        pose(qs[k], { x: hx + (m.flip ? -10 : 10), y: hy - 58, s: q, r: (k - 1) * 8, o: q > 0.01 ? 1 : 0 });
      });

      S.cam.x = lerp(-160, 0, es(t, 0.3, 1.4));
      S.cam.y = 40 - es(t, 1.8, 2.3) * 30;
      S.cam.z = lerp(1.0, 1.04, es(t, 1.2, 2.3));
    };
  },
};
