// Łk 24,50–52 — Morning on the Mount of Olives: Jesus leads them out of the city (Jerusalem across the valley at the
// left) up the path towards Bethany, whose roofs lie among the trees below. On the hilltop He lifts up His hands and
// blesses them. While He is blessing them He parts from them — the theatre's strings take Him — and He is carried up
// into heaven: the sky turns to gold, the clouds draw together beneath Him, and the light above receives Him. They fall
// on their knees and worship; then they rise and go back down towards Jerusalem with great joy.
import { C, CAST, person, blinkAt, pose, lerp, mix } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { olivetSet, OL, TW, swing, headAt, sparkle, heart, glory } from './lib.js';

const [TX, TY] = OL.TOP;
const SPOTS = [
  ['andrew', 470, 734], ['james', 560, 722], ['john', 650, 712], ['matthew', 950, 712], ['thomas', 1040, 722], ['philip', 1130, 734],
  ['jamesA', 400, 772], ['peter', 560, 786], ['bartholomew', 1040, 786], ['thaddaeus', 1200, 772], ['simonZ', 700, 800],
];

export default {
  id: 'lk24-bethany',
  beats: [
    { v: 50, text: 'Potem wyprowadził ich ku Betanii' },
    { v: 50, cont: true, text: 'i podniósłszy ręce błogosławił ich.' },
    { v: 51, text: 'A kiedy ich błogosławił, rozstał się z nimi' },
    { v: 51, cont: true, text: 'i został uniesiony do nieba.' },
    { v: 52 },
  ],
  cam: { x: [-560, 40], y: [-160, 40], z: [0.92, 1.08] },
  build(S) {
    const c = S.c;
    const O = olivetSet(S);
    const glowEl = O.heaven.add(`<g opacity="0"><circle r="300" fill="url(#halo-glow)"/>${glory(c, 330, 26)}</g>`);
    const PL = O.PL;
    const M = SPOTS.map(([k, x, y], i) => ({ k, x, y, i, s: 0.9 + (y - 712) / 300, seed: c.rr(0, 9) })).sort((a, b) => a.y - b.y);
    const back = M.filter((m) => m.y < 740), front = M.filter((m) => m.y >= 740);
    back.forEach((m) => { m.st = S.puppet(PL.add(person(c, { ...TW[m.k] }))); m.kn = S.puppet(PL.add(person(c, { ...TW[m.k], pose: 'kneel' }))); });
    const strings = PL.add(`<g><path d="M-9 -1800V-150M11 -1800V-150" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/></g>`);
    const J = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    front.forEach((m) => { m.st = S.puppet(PL.add(person(c, { ...TW[m.k] }))); m.kn = S.puppet(PL.add(person(c, { ...TW[m.k], pose: 'kneel' }))); });
    const fx = O.fx;
    const joys = M.map((m, i) => fx.add(`<g>${i % 2 ? heart(c, 10) : sparkle(c, 12)}</g>`));

    return (t, T) => {
      /* v50a: He leads them out as far as Bethany */
      const walk = es(t, 0.02, 0.95, ease.sine);
      const dx = lerp(-620, 0, walk);
      const going = t > 0.02 && t < 0.95;
      const bless = es(t, 1.05, 1.3);
      const rise1 = es(t, 2.1, 2.9, ease.sine);
      const rise2 = es(t, 3.0, 3.85, ease.sine);
      const jy = TY - rise1 * 120 - rise2 * 290;
      const js = 1.12 - rise1 * 0.1 - rise2 * 0.3;
      const jx = TX + dx + 20;
      J.set({ x: jx, y: jy, s: js, walk: going ? jx * 0.05 : undefined, o: 1 - es(t, 3.7, 3.95), armF: 30 + bless * 50, armB: 20 + bless * 130, head: -bless * 6, blink: blinkAt(T) });
      pose(strings, { x: jx, y: jy, s: js, o: es(t, 2.05, 2.2) * (1 - es(t, 3.7, 3.95)) });
      /* v51b: the clouds draw together; the light above */
      const part = es(t, 2.9, 3.5);
      const cy = lerp(-600, 350, es(t, 2.6, 3.2, ease.out));
      swing(O.cl.L, lerp(420, 660, part), cy, T, 0.8, 0.5, 1);
      swing(O.cl.R, lerp(1180, 950, part), cy + 16, T, 0.8, 0.6, 2);
      swing(O.cl.M, 800, lerp(-600, 300, es(t, 3.5, 3.95, ease.out)), T, 0.6, 0.5, 3);
      O.sk2.fade(es(t, 2.2, 3.4));
      pose(glowEl, { x: 800, y: 170, s: 0.6 + es(t, 2.4, 3.6) * 0.4, r: t * 4, o: es(t, 2.4, 3.4) * (1 - es(t, 4.4, 5) * 0.4) });

      /* the Eleven */
      const kneel = seg(t, 4.05, 4.12) * (1 - seg(t, 4.5, 4.57));
      const home = es(t, 4.55, 4.98, ease.in);
      M.forEach((m) => {
        const x = m.x + dx - home * 520;
        const moving = going || (home > 0.01 && home < 0.99);
        const up = rise1 * (1 - home);
        const bow = bless * (1 - rise1);
        const joy = es(t, 4.5, 4.7);
        m.st.set({ x, y: m.y, s: m.s, flip: home > 0.01 ? true : x > jx, o: 1 - kneel, walk: moving ? x * 0.05 + m.i : undefined, amt: home > 0.01 ? 1.2 : 0.8, armF: 20 + up * 40 + joy * 50, armB: 10 + up * (m.i % 2 ? 60 : 120) + joy * 110, head: bow * 12 - up * 22, blink: blinkAt(T, m.seed) });
        m.kn.set({ x, y: m.y, s: m.s, flip: x > 800, o: kneel, armF: 70, armB: 130, head: -18, lean: -6, blink: blinkAt(T, m.seed) });
        const [hx, hy] = headAt(x, m.y, m.s, false);
        const jk = bump(t, 4.55 + (m.i % 4) * 0.05, 5.0);
        pose(joys[m.i], { x: hx, y: hy - 50 - jk * 20, s: jk, r: T * 20, o: jk });
      });

      S.cam.x = lerp(-560, 0, walk) - home * 200;
      S.cam.y = 20 - es(t, 2.2, 3.6) * 150 * (1 - es(t, 4.0, 4.4)) + es(t, 4.0, 4.4) * 0;
      S.cam.z = (S.portrait ? 0.94 : 1.02) + es(t, 1.0, 1.4) * 0.04 * (1 - es(t, 2.2, 2.8));
      void mix; void fade;
    };
  },
};
