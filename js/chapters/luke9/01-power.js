// Łk 9,1–2 — a morning meadow in Galilee; on the ridge behind, four villages, dark little spirits hovering over their
// roofs, and roads running up to each from the middle of the meadow, where Jesus stands. He calls the Twelve together:
// they come in from both sides and stand round Him. He gives them power and authority: He lifts His hands, a light
// opens behind Him and a spark flies to the hands of each; two tags come down — over all demons (a spirit, crossed
// out) and to cure diseases (a crutch, with a star) — and the spirits over the villages shrink and flee. Then He sends
// them out: in pairs they turn and walk away up the roads, growing small, and over every village a light comes on.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { galSet, roadAt, VIL9, LK12, spirit, disc, crossX, crutch, labelTag, spark, sparkle, wordSlip, halo, rayBurst, kf, tr, PI } from './lib.js';

const JX = 800, JY = 716;
// ring slots round Jesus (dx, y, s) and the road each pair takes; pairs: [0,1] [2,3] [4,5] [6,7] [8,9] [10,11]
const SLOT = {
  peter: [-130, 742, 0.96], andrew: [-212, 744, 0.96], philip: [-170, 694, 0.84], bartholomew: [-252, 696, 0.84], jamesA: [-298, 744, 0.96], simonZ: [-338, 698, 0.84],
  james: [130, 742, 0.96], john: [212, 744, 0.96], matthew: [170, 694, 0.84], thomas: [252, 696, 0.84], thaddaeus: [298, 744, 0.96], judas: [338, 698, 0.84],
};
// pair index → [road, delay]
const GO = [[1, 0], [2, 0], [0, 0.02], [3, 0.02], [0, 0.16], [3, 0.16]];

export default {
  id: 'lk9-power',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-20, 20], y: [-20, 50], z: [1, 1.08] },
  build(S) {
    const G = galSet(S);
    const c = S.c;
    const { ROAD } = G;

    /* the spirits over the villages */
    const SP = [];
    VIL9.forEach(([x, y], v) => [-1, 1].forEach((d, j) => SP.push({ v, j, x: x + d * 34, y: y - 70 - j * 16, seed: c.rr(0, 6), el: G.spiritL.add(`<g>${spirit(c, 0.9)}</g>`) })));
    /* lights over the villages when the Twelve arrive */
    const lightL = S.layer({ par: 0.18, sh: 3 });
    const VL = VIL9.map(([x, y], v) => ({ v, x, y, glow: lightL.add(`<g opacity="0">${halo(70, 0.9)}</g>`), star: lightL.add(`<g opacity="0">${sparkle(c, 12)}</g>`), words: [0, 1].map(() => lightL.add(`<g opacity="0">${wordSlip(c, 20)}</g>`)) }));

    /* the light behind Jesus */
    const glowL = S.layer({ par: 0.5, sh: 1, flat: true });
    const burst = glowL.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 30, r1: 330, spread: 0.04, o: 0.5 })}${halo(150, 0.8)}</g>`);

    /* the Twelve and Jesus */
    const act = S.layer({ par: 0.5, sh: 5 });
    const T12 = LK12.map((m) => {
      const [dx, y, s] = SLOT[m.k];
      const pair = Math.floor(m.i / 2);
      return { ...m, dx, y, s, pair, second: m.i % 2 === 1, road: GO[pair][0], delay: GO[pair][1], seed: c.rr(0, 9) };
    }).sort((a, b) => a.y - b.y);
    T12.forEach((m) => { m.p = S.puppet(act.add(person(c, m.o))); });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    /* the sparks of power */
    const fx = S.layer({ par: 0.52, sh: 4 });
    T12.forEach((m) => { m.spk = fx.add(`<g opacity="0">${spark(c, 9)}</g>`); });

    /* the two tags: over all demons, to cure diseases */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const tagD = hanging(flies, disc(c, `<g transform="translate(0 4) scale(1.3)">${spirit(c, 1, '#43384d')}</g><g>${crossX(c, 24)}</g>`, { r: 44 }) + `<g transform="translate(0 70)">${labelTag(tr('nad złymi duchami', 'over all demons'), 16)}</g>`, { x: 0, y: -1500, len: 800 });
    const tagH = hanging(flies, disc(c, `<g transform="translate(-4 -30) rotate(18) scale(.42)">${crutch(c)}</g><g transform="translate(18 -14)">${sparkle(c, 10)}</g>`, { r: 44 }) + `<g transform="translate(0 70)">${labelTag(tr('leczyć choroby', 'to cure diseases'), 16)}</g>`, { x: 0, y: -1500, len: 800 });

    return (t, time) => {
      const T = time;
      G.update(T);

      /* v1 — called together, given power */
      const come = es(t, 1.0, 1.36);
      const lift = es(t, 1.36, 1.5) * (1 - es(t, 1.95, 2.1));
      const send = es(t, 2.0, 2.2);
      const power = es(t, 1.4, 1.62);
      jesus.set({ x: JX, y: JY, s: 1.02, armF: 20 + bump(t, 0.98, 1.3) * 50 + lift * 75 + send * 50, armB: bump(t, 0.98, 1.3) * 130 + lift * 125 + send * 60, head: -lift * 8, flip: t > 2.1 && t < 2.5 ? Math.sin(T * 0.4) > 0 : false, blink: blinkAt(T, 1) });
      pose(burst, { x: JX, y: JY - 150, s: 0.4 + lift * 0.8 + send * 0.2, r: T * 3, o: lift * 0.9 + send * 0.4 * (1 - es(t, 2.6, 3)) });

      T12.forEach((m) => {
        const left = m.dx < 0;
        const i0 = m.second ? 0.05 : 0;
        const inK = es(t, 1.0 + m.pair * 0.025 + i0, 1.3 + m.pair * 0.025 + i0, ease.out);
        const x0 = left ? -260 - m.pair * 30 : 1860 + m.pair * 30;
        let x = lerp(x0, JX + m.dx, inK), y = m.y, s = m.s;
        let walking = inK > 0 && inK < 1;
        let flip = !left;
        /* v2 — sent: along the road */
        const u = seg(t, 2.05 + m.delay, 2.72 + m.delay);
        let o = t > 0.95 ? 1 : 0;
        if (u > 0) {
          const [rx, ry, rs] = roadAt(ROAD, m.road, u * 0.82 - 0.02 + (m.second ? -0.03 : 0), 0.96);
          const side = m.second ? 16 : -16;
          const k = es(u, 0, 0.18);
          x = lerp(JX + m.dx, rx + side * rs, k); y = lerp(m.y, ry + 18 * rs, k); s = lerp(m.s, rs, k);
          walking = u < 1;
          flip = rx < x - 1 ? true : rx > x + 1 ? false : m.road < 2;
          if (k >= 1) flip = m.road < 2;
        }
        const got = es(t, 1.5 + m.i * 0.012, 1.6 + m.i * 0.012);
        m.p.set({ x, y, s, flip, o, walk: walking ? x * 0.07 + m.i : undefined, amt: 1.1, armF: 16 + got * 60 * (1 - send), armB: got * 20 * (1 - send), head: -got * 8 * (1 - send), blink: blinkAt(T, m.seed) });
        // the spark from Jesus to his hands
        const sk = seg(t, 1.42 + m.i * 0.012, 1.58 + m.i * 0.012);
        const hx = JX + m.dx + (left ? 34 : -34) * m.s, hy = m.y - 110 * m.s;
        pose(m.spk, { x: lerp(JX, hx, ease.out(sk)), y: lerp(JY - 150, hy, sk) - Math.sin(sk * PI) * 60, s: 0.8, r: T * 60, o: sk > 0 ? 1 - es(t, 1.95, 2.1) : 0 });
      });

      /* the two tags */
      const tg = es(t, 1.4, 1.62, ease.back) * (1 - es(t, 2.0, 2.2));
      pose(tagD, { x: 560, y: lerp(-1500, 200, tg), r: Math.sin(T * 0.8) * 2, oy: 0, o: tg > 0.002 ? 1 : 0 });
      pose(tagH, { x: 1040, y: lerp(-1500, 210, es(t, 1.46, 1.68, ease.back) * (1 - es(t, 2.0, 2.2))), r: Math.sin(T * 0.8 + 1) * 2, oy: 0, o: tg > 0.002 ? 1 : 0 });

      /* the spirits over the villages shrink and flee */
      SP.forEach((sp) => {
        const flee = es(t, 1.5 + sp.v * 0.04, 1.9 + sp.v * 0.04);
        pose(sp.el, { x: sp.x + Math.sin(T * 1.2 + sp.seed) * 6 + flee * (sp.j ? 60 : -60), y: sp.y + Math.sin(T * 1.6 + sp.seed) * 5 - flee * 160, s: 0.9 * (1 - flee * 0.6), r: Math.sin(T * 2 + sp.seed) * 10, o: 1 - flee });
      });

      /* lights come on over the villages as the pairs arrive */
      VL.forEach((v) => {
        const k = es(t, 2.5 + (v.v === 1 || v.v === 2 ? 0 : 0.05), 2.72);
        pose(v.glow, { x: v.x, y: v.y - 10, s: 0.6 + k * 0.5, o: k * 0.8 });
        pose(v.star, { x: v.x, y: v.y - 80, s: k, r: T * 30, o: k });
        v.words.forEach((w, i) => {
          const q = T ? (T * 0.35 + i * 0.5) % 1 : 0.5;
          pose(w, { x: v.x + (i ? 24 : -24) + q * (i ? 16 : -16), y: v.y - 40 - q * 40, s: 0.6, o: k * Math.sin(q * PI) });
        });
      });

      S.cam.z = kf(t, [[0, 1.0], [0.9, 1.0], [1.4, 1.07], [1.95, 1.07], [2.4, 1.0]]);
      S.cam.y = kf(t, [[0, 6], [0.9, 6], [1.4, 18], [1.95, 18], [2.4, 0]]);
    };
  },
};
