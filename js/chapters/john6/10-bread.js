// J 6,35–37 — the synagogue dims and a great loaf of light comes down behind Jesus like a rising sun: "I am the
// bread of life" hangs in gold. Whoever comes to Him will not hunger — the empty bowls held out on the benches
// fill with bread; whoever believes will never thirst — the empty cups fill with water. "You have seen Me and do
// not believe": some turn their faces away. All that the Father gives Him will come — people walk up a path of
// light — and whoever comes He will never cast out: He opens His arms and receives them.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, folk, breadOfLight, hungGold, fillBowl, waterCup, eyeIcon, speech, heart, sparkle, rayBurst, glowDisc, headAt, hand, kf, moving, tr, PI } from './lib.js';

const JX = 800, FEET = 742;

export default {
  id: 'j6-bread',
  beats: [
    { v: 35, text: 'Odpowiedział im Jezus: «Jam jest chleb życia.' },
    { v: 35, cont: true, text: 'Kto do Mnie przychodzi, nie będzie łaknął;' },
    { v: 35, cont: true, text: 'a kto we Mnie wierzy, nigdy pragnąć nie będzie.' },
    { v: 36 },
    { v: 37, text: 'Wszystko, co Mi daje Ojciec, do Mnie przyjdzie,' },
    { v: 37, cont: true, text: 'a tego, który do Mnie przychodzi, precz nie odrzucę,' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    const dim = S.layer({ par: 0, sh: 1, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#3a2436"/>`);
    const lightL = S.layer({ par: 0.4, sh: 1, flat: true });
    const rays = lightL.add(`<g>${rayBurst(c, { n: 18, r0: 70, r1: 620, spread: 0.028, o: 0.28 })}</g>`);
    const big = lightL.add(`<g>${glowDisc(360, 'halo-glow', 1)}</g>`);
    const path = lightL.add(`<path d="${c.poly([[JX - 30, FEET - 6], [JX + 30, FEET - 6], [JX + 300, 1000], [JX - 300, 1000]])}" fill="#fff1c4" opacity="0"/>`);
    const loafL = S.layer({ par: 0.42, sh: 5 });
    const loaf = loafL.add(`<g>${breadOfLight(c, 78)}</g>`);

    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    // on the front benches: people holding out empty bowls and cups
    const HOLD = [[330, 'bowl'], [430, 'cup'], [1180, 'bowl'], [1280, 'cup'], [1380, 'bowl']].map(([x, kind], i) => {
      const el = L.add(person(c, { ...folk(c, i % 2 === 0), pose: 'sit', holdF: `<g transform="rotate(${kind === 'bowl' ? 80 : 84}) translate(0 -2)">${kind === 'bowl' ? fillBowl(c, { w: 30 }) : waterCup(c)}</g>` }));
      const fillEl = el.querySelector(kind === 'bowl' ? '.fill' : '.water');
      return { x, i, kind, seed: c.rr(0, 9), p: S.puppet(el), fillEl };
    });
    // those who come up to Him
    const COME = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), st: S.puppet(L.add(person(c, folk(c, i !== 1)))), kn: S.puppet(L.add(person(c, { ...folk(c, i !== 1), pose: 'kneel' }))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    I.addColumns();

    const fx = S.layer({ par: 0.6, sh: 5 });
    const word = fx.add(hungGold(c, tr('Jam jest chleb życia', 'I am the bread of life'), { size: 34 }));
    const glints = HOLD.map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));
    const shut = [1, 4, 6].map((ci, i) => ({ m: cong[ci], i, el: fx.add(`<g>${speech(c, eyeIcon(c, false, 14), { w: 46, h: 36 })}</g>`) }));
    const hearts = COME.map(() => fx.add(`<g>${heart(c, 11)}</g>`));

    return (t, time) => {
      const T = time;
      I.flicker(T);
      /* v35a — I am the bread of life */
      const iam = es(t, 0.1, 0.5);
      dim.fade(iam * 0.24 * (1 - es(t, 5.3, 5.9) * 0.5));
      const ly = lerp(-300, 330, es(t, 0.05, 0.6, ease.out));
      pose(loaf, { x: JX, y: ly, s: 1 + Math.sin(T * 1.2) * 0.02, o: seg(t, 0.05, 0.15) });
      pose(big, { x: JX, y: ly, s: 0.5 + iam * 0.7, o: iam });
      pose(rays, { x: JX, y: ly, s: 0.4 + iam * 0.7, r: t * 6, o: iam });
      const wk = es(t, 0.3, 0.6, ease.out);
      pose(word, { x: JX, y: lerp(-500, 180, wk), r: Math.sin(T * 0.8) * 1, o: wk > 0.01 ? 1 : 0 });

      /* v35b — bowls fill; v35c — cups fill */
      HOLD.forEach((h, i) => {
        const a = h.kind === 'bowl' ? 1.2 : 2.2;
        const k = es(t, a + (i % 3) * 0.08, a + 0.25 + (i % 3) * 0.08);
        const out = es(t, 0.9, 1.1);
        h.p.set({ x: h.x, y: FEET - 50, s: 0.9, flip: h.x > JX, armF: 20 + out * 60 + k * 8, armB: 10 + k * 30, head: -out * 6 + k * 4, blink: blinkAt(T, h.seed) });
        if (h.fillEl) h.fillEl.setAttribute('opacity', String(k));
        const [hx, hy] = hand(h.x, FEET - 50, 0.9, h.x > JX, 20 + out * 60 + k * 8, 0, 62);
        const g = bump(t, a + 0.15, a + 0.8);
        pose(glints[i], { x: hx, y: hy - 30, s: g, r: T * 60, o: g });
      });

      /* v36 — you have seen Me, and yet you do not believe */
      const away = es(t, 3.05, 3.3) * (1 - es(t, 4.0, 4.2) * 0.6);
      cong.forEach((m, i) => {
        const turned = i === 1 || i === 4 || i === 6;
        const look = es(t, 0.3, 0.6);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: turned && away > 0.5 ? m.x < JX : m.x > JX, armF: 20 + look * 20 + (turned ? away * 40 : 0), armB: turned ? away * 60 : look * (i % 3 ? 0 : 60), head: -look * 8 + (turned ? away * 10 : 0), blink: blinkAt(T, m.seed) });
      });
      shut.forEach((s) => {
        const k = es(t, 3.15 + s.i * 0.08, 3.35 + s.i * 0.08, ease.back) * (1 - es(t, 3.95, 4.05));
        const [hx, hy] = headAt(s.m.x, s.m.y, s.m.s, s.m.x < JX, 62);
        pose(s.el, { x: hx, y: hy - 16, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });

      /* v37a — all that the Father gives Me will come: up the path of light */
      pose(path, { o: es(t, 4.05, 4.35) * 0.35 * (1 - es(t, 5.6, 5.95)) });
      COME.forEach((m) => {
        const k = es(t, 4.1 + m.i * 0.12, 4.75 + m.i * 0.08);
        const kneel = es(t, 5.2 + m.i * 0.06, 5.28 + m.i * 0.06);
        const side = m.i === 1 ? 0 : m.i === 0 ? -1 : 1;
        const tx = JX + side * 110 + (side === 0 ? -170 : 0);
        const x = lerp(JX + (m.i - 1) * 240, tx, k), y = lerp(1000, FEET + 16, k), s = lerp(1.2, 0.96, k);
        const o = seg(t, 4.1, 4.2);
        m.st.set({ x, y, s, flip: x > tx, walk: k > 0 && k < 1 ? y * 0.08 : undefined, o: o * (1 - kneel), armF: 20 + k * 40, blink: blinkAt(T, m.seed) });
        m.kn.set({ x: tx, y: FEET + 16, s: 0.96, flip: tx > JX, o: kneel, armF: 60, armB: 30, head: -12, blink: blinkAt(T, m.seed) });
        const hk = es(t, 5.3 + m.i * 0.07, 5.5 + m.i * 0.07, ease.back);
        pose(hearts[m.i], { x: tx + (tx > JX ? -10 : 10), y: FEET - 150 + Math.sin(T * 1.4 + m.i) * 3, s: hk, o: hk > 0.01 ? 1 : 0 });
      });

      /* Jesus: speaks; at v37b opens His arms wide */
      const open = es(t, 5.05, 5.35);
      jesus.set({ x: JX, y: FEET, s: 1.08, armF: 20 + iam * 40 + bump(t, 1.0, 2.9) * 30 - bump(t, 3.0, 4.0) * 20 + open * 50, armB: 10 + iam * 30 + open * 110, head: -iam * 4 + open * 4, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.06], [0.6, 1.1], [1.0, 1.06], [3.0, 1.04], [4.0, 1.02], [5.2, 1.1]]);
      S.cam.y = kf(t, [[0, 0], [0.6, -20], [1.0, 20], [3.0, 20], [4.0, 30], [5.2, 30]]);
    };
  },
};
