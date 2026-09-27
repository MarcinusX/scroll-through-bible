// J 16,14–15 — a pause on the slope: the Eleven sit down in a half-circle, their lanterns set on the ground, Jesus
// standing among them. "He will glorify Me": the dove of light circles Him, and a radiance opens behind Him;
// "for He will take from what is Mine and declare it to you": the dove takes a small flame from His heart and
// carries it round the circle, and their faces light up. "All that the Father has is Mine": golden streams pour down
// from the light above (never a figure) into Him. "Therefore I said that He takes of Mine and will declare it to
// you": from Him the dove carries a flame to every one of them — the light passes from the Father, through the Son,
// by the Spirit, into their hearts.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, lantern, lampK, withFace, faceBits, person, dove, flapWings, radiance, fatherLight, soulLight, tongue, headAt,
  kf, vis, pose, lerp, blinkAt, C, PI, JX, JESUS, TW, NIGHT,
} from './lib.js';

const SEATS = [
  { k: 'andrew', x: 470, y: 8 }, { k: 'james', x: 545, y: 14 }, { k: 'thomas', x: 600, y: -34 }, { k: 'john', x: 628, y: 20 }, { k: 'peter', x: 700, y: 24 },
  { k: 'matthew', x: 905, y: 24 }, { k: 'philip', x: 985, y: 18 }, { k: 'bartholomew', x: 1010, y: -34 }, { k: 'jamesA', x: 1060, y: 12 }, { k: 'thaddaeus', x: 1128, y: 6 }, { k: 'simonZ', x: 1180, y: -4 },
];

export default {
  id: 'j16-glory',
  beats: [
    { v: 14 },
    { v: 15, text: 'Wszystko, co ma Ojciec, jest moje.' },
    { v: 15, cont: true, text: 'Dlatego powiedziałem, że z mojego weźmie i wam objawi.' },
  ],
  cam: { x: [-20, 20], y: [-90, 30], z: [1, 1.15] },
  build(S) {
    const c = S.c;
    const P = pathSet(S, { skyCols: NIGHT, moonAt: [1220, 150] });
    const GY = P.GY;

    // the light above and its golden streams
    const hiL = S.layer({ par: 0.1, sh: 2 });
    const high = hiL.add(`<g>${fatherLight(c, 70, { ray: [1.6, 2.4], glow: 2.8 })}</g>`);
    const strL = S.layer({ par: 0.3, sh: 0, flat: true });
    const gid = S.id('stream');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3cf" stop-opacity=".9"/><stop offset="1" stop-color="#ffe3a1" stop-opacity=".25"/></linearGradient>`);
    const streams = Array.from({ length: 7 }, (_, i) => ({ i, el: strL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [(i - 3) * 40, 180], [(i - 3) * 8, 380], 16), (u) => 10 - u * 6)}" fill="url(#${gid})"/></g>`) }));
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const rad = glowL.add(`<g><circle r="210" fill="url(#halo-glow)"/><g transform="scale(.7)">${radiance(c, 150)}</g></g>`);

    // the Eleven sitting, lanterns set down beside them
    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const D = SEATS.map((d) => ({ ...d, y: GY - 46 + d.y })).sort((a, b) => a.y - b.y).map((d, i) => {
      const el = peopleL.add(withFace(person(c, { ...TW[d.k], pose: 'sit' }), faceBits(c)));
      const flip = d.x > JX;
      const lx = d.x + (flip ? 44 : -44) * 0.88;
      const lampEl = peopleL.add(`<g transform="translate(${lx.toFixed(1)} ${(d.y - 33).toFixed(1)})">${lantern(c, 0)}</g>`);
      return { ...d, i, flip, s: d.y < GY - 66 ? 0.8 : 0.88, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), fl: lampEl.querySelector('.lfl'), gl: lampEl.querySelector('.lgl'), seed: c.rr(0, 9) };
    });
    const jel = peopleL.add(withFace(person(c, JESUS), faceBits(c)));
    const J = { x: JX, y: GY - 10, s: 1.04, p: S.puppet(jel) };

    const fx = S.layer({ par: 0.56, sh: 4 });
    const dv = fx.add(`<g><circle r="80" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    const heartJ = fx.add(`<g>${soulLight(c, 12)}</g>`);
    const carried = fx.add(`<g>${tongue(c, 22)}</g>`);
    const faces = D.map((m) => ({ m, el: fx.add(`<g><circle r="46" fill="url(#warm-glow)"/></g>`) }));
    const hearts = D.map((m) => ({ m, el: fx.add(`<g>${soulLight(c, 8)}</g>`) }));

    return (t, time) => {
      const T = time;
      P.update(T);
      const jhy = J.y - 112 * J.s;               // His heart

      /* v14 — glory, and a flame carried round */
      const glor = es(t, 0.1, 0.5);
      vis(rad, { x: JX, y: J.y - 150, s: 0.6 + glor * 0.4 + (T ? Math.sin(T * 1.1) * 0.015 : 0), r: T * 3, o: glor * (0.8 + es(t, 1.2, 1.6) * 0.2) });
      const hk = es(t, 0.45, 0.6) * (1 - es(t, 2.9, 3));
      vis(heartJ, { x: JX + 4, y: jhy, s: 1 + es(t, 1.2, 1.7) * 0.4, o: hk });
      // the dove: circles Him (v14 first half), carries a flame round the circle (v14 second half)
      const circ = seg(t, 0.05, 0.55);
      const carry = seg(t, 0.55, 0.95);
      const give2 = seg(t, 2.1, 2.9);
      let dx, dy;
      const ring = (a) => [JX + Math.cos(a) * 335, GY - 250 + Math.sin(a) * 90];
      const H = [JX + 130, J.y - 280];
      if (t < 0.55) { const a = -PI / 2 + circ * PI * 2.4; dx = JX + Math.cos(a) * 150; dy = J.y - 180 + Math.sin(a) * 60 - (1 - es(t, 0, 0.2)) * 400; }
      else if (t < 0.97) { [dx, dy] = ring(PI * (1.05 + carry * 0.9)); }
      else if (t < 2.05) { const [ex, ey] = ring(PI * 1.95), k = es(t, 0.97, 1.3); dx = lerp(ex, H[0], k); dy = lerp(ey, H[1], k); }
      else { const [sx, sy] = ring(PI * 1.05), k = es(t, 2.02, 2.14), [rx, ry] = ring(PI * (1.05 + give2 * 0.9)); dx = lerp(lerp(H[0], sx, k), rx, give2 > 0 ? 1 : 0); dy = lerp(lerp(H[1], sy, k), ry, give2 > 0 ? 1 : 0); }
      vis(dv, { x: dx, y: dy, s: 0.7, sx: t < 0.55 ? (Math.sin(-PI / 2 + circ * PI * 2.4) > 0 ? -1 : 1) : t > 0.97 && t < 2.14 ? -1 : 1, o: es(t, 0, 0.15) });
      flapWings(dv, t * 6 + T, 26, 3);
      const ck = es(t, 0.5, 0.6) * (1 - es(t, 0.95, 1.0)) + es(t, 2.05, 2.15) * (1 - es(t, 2.9, 2.95));
      vis(carried, { x: dx + 20, y: dy + 16, s: 0.8, o: ck });

      /* v15a — golden streams from the light above into Him */
      const all = es(t, 1.05, 1.4) * (1 - es(t, 2.6, 2.95) * 0.7);
      vis(high, { x: JX, y: 120 + (1 - es(t, 1.0, 1.3)) * -250, s: 0.9, o: es(t, 1.0, 1.25) });
      streams.forEach((st) => {
        const k = es(t, 1.1 + st.i * 0.04, 1.5 + st.i * 0.04);
        vis(st.el, { x: JX, y: 150, sy: Math.max(0.02, k), s: 1, o: all });
      });

      /* the Eleven — faces lit as the flame passes (v14), every heart lit (v15b) */
      D.forEach((m, i) => {
        const u = (m.x - 470) / 710;                         // round the circle, left → right
        const seen = es(t, 0.6 + u * 0.33, 0.68 + u * 0.33);
        const got = es(t, 2.15 + u * 0.7, 2.25 + u * 0.7);
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip, 62);
        void hy;
        vis(faces[i].el, { x: hx, y: hy, s: 1, o: seen * 0.45 * (1 - got * 0.5) });
        vis(hearts[i].el, { x: m.x + (m.flip ? -4 : 4), y: m.y - 74 * m.s, s: got, o: got > 0.01 ? 1 : 0 });
        lampK(m, 0.8 + got * 0.2, 0, T);
        const up = es(t, 1.05, 1.35) * (1 - es(t, 2.1, 2.3));
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 36 + got * 30 * (i % 2), armB: 14 + seen * 20, head: -up * 18 - seen * 4, blink: blinkAt(T, m.seed) });
      });
      J.p.set({ x: JX, y: J.y, s: J.s, armF: 20 + bump(t, 0.05, 0.6) * 40 + bump(t, 2.0, 2.9) * 60, armB: 10 + es(t, 1.05, 1.3) * 120 * (1 - es(t, 1.9, 2.1)), head: -es(t, 1.05, 1.3) * 12 * (1 - es(t, 1.9, 2.1)), blink: blinkAt(T) });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 0], [0.5, -10], [1.0, 0], [1.5, -50], [2.1, -10], [3, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [0.5, 1.1], [1.0, 1.02], [1.6, 1.0], [2.2, 1.04], [3, 1.02]]);
    };
  },
};
