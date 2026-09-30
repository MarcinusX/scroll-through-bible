// J 2,11 — "the beginning of the signs": the first medallion of seven comes down on its strings above
// Jesus (the other six wait, blank, for the chapters to come). He revealed His glory — slow golden rays
// open behind Him; and His disciples believed in Him: they kneel, and small lights kindle above them.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { canaSet, canaIdle, DISC, EVENING, NIGHT, signBadge, heart, sparkle, hungWord, tr, PI } from './lib.js';

const FLOOR = 700;

export default {
  id: 'j2-glory',
  beats: [
    { v: 11, text: 'Taki to początek znaków uczynił Jezus w Kanie Galilejskiej.' },
    { v: 11, cont: true, text: 'Objawił swoją chwałę' },
    { v: 11, cont: true, text: 'i uwierzyli w Niego Jego uczniowie.' },
  ],
  cam: { x: [0, 0], y: [-40, 80], z: [0.94, 1.18] },
  build(S) {
    const c = S.c;
    const set = canaSet(S, { floorY: FLOOR, doorX: 1250, skyCols: EVENING });
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c2250"/>`);

    /* the first sign, and six more waiting */
    const signL = S.layer({ par: 0.1, sh: 6 });
    const badge = hanging(signL, signBadge(c, 1, { r: 62 }), { x: 800, y: 220, len: 700 });
    const row = Array.from({ length: 7 }, (_, i) => {
      const x = 800 + (i - 3) * 62;
      const s = sheet().p(c.cut(c.circ(0, 0, 20, 18), 0.3, 3), i ? C.parchment : C.sun).p(c.cut(c.circ(0, 0, 14, 16), 0.2, 3), i ? mix(C.parchment, C.stone2, 0.4) : C.halo).out();
      const el = hanging(signL, `${i ? '' : `<circle r="46" fill="url(#warm-glow)"/>`}${s}<text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="16" font-style="italic" fill="${i ? C.stone2 : C.terracotta}">${i + 1}</text>`, { x, y: 360, len: 700 });
      return { el, x, i };
    });
    const place = signL.add(hungWord(c, tr('w Kanie Galilejskiej', 'in Cana of Galilee'), { size: 22, len: 700 }));

    /* glory */
    const gloryL = S.layer({ par: 0.5, sh: 1, flat: true });
    const ray = gloryL.add(`<g>${rays(c, { n: 22, r0: 70, r1: 900, spread: 0.05, color: '#fff1c4' })}</g>`);
    ray.setAttribute('opacity', '1');
    const glow = gloryL.add(`<g><circle r="360" fill="url(#halo-glow)"/></g>`);

    /* Jesus and the disciples */
    const L = S.layer({ par: 0.56, sh: 6 });
    const SPOT = S.portrait ? [[585, 0], [665, 0], [940, 1], [1015, 1], [1090, 1]] : [[560, 0], [650, 0], [950, 1], [1040, 1], [1125, 1]];
    const dis = DISC.map((o, i) => {
      const [x, right] = SPOT[i];
      return { i, x, right, seed: c.rr(0, 9), st: S.puppet(L.add(person(c, o))), kn: S.puppet(L.add(person(c, { ...o, pose: 'kneel' }))) };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const lights = dis.map((d) => ({ d, el: L.add(`<g>${heart(c, 12, C.jesusMantle)}</g>`) }));
    const sparks = Array.from({ length: 10 }, (_, i) => ({ i, el: L.add(`<g>${sparkle(c, c.rr(8, 14))}</g>`), a: (i / 10) * PI * 2, r: c.rr(140, 230) }));

    return (t, time) => {
      const T = time;
      const dusk = es(t, 0, 3);
      set.sk.blend(EVENING, NIGHT, 0.3 + dusk * 0.5);
      tint.fade(0.12 + dusk * 0.18 - es(t, 1.05, 1.6) * 0.06);
      canaIdle(set, T, { lit: 1, sunY: 570 + dusk * 200 });

      /* v11a — the first sign */
      const bd = es(t, 0.05, 0.5, ease.out);
      pose(badge, { x: 800, y: 210 - (1 - bd) * 500, r: (1 - bd) * 6, s: 1 + bump(t, 0.45, 0.8) * 0.1 });
      row.forEach((r) => {
        const k = es(t, 0.3 + r.i * 0.04, 0.5 + r.i * 0.04, ease.out);
        pose(r.el, { x: r.x, y: 340 - (1 - k) * 500, r: (1 - k) * (r.i - 3) * 3 });
      });
      const pk = es(t, 0.5, 0.8, ease.out) * (1 - es(t, 1.05, 1.3));
      pose(place, { x: 800, y: 405 - (1 - pk) * 520 });

      /* v11b — glory */
      const gl = es(t, 1.05, 1.6);
      pose(ray, { x: 800, y: 540, r: t * 20, s: 0.4 + gl * 0.8, o: gl * 0.28 });
      pose(glow, { x: 800, y: 560, s: 0.6 + gl * 0.6, o: 0.3 + gl * 0.5 });
      sparks.forEach((sp) => {
        const k = gl * (1 - es(t, 2.6, 3.0) * 0.5);
        const a = sp.a + T * 0.25 + t * 0.4;
        pose(sp.el, { x: 800 + Math.cos(a) * sp.r * k, y: 560 + Math.sin(a) * sp.r * 0.75 * k, s: 0.4 + k * 0.6, r: T * 30, o: k * (0.6 + Math.sin(T * 2 + sp.i) * 0.3) });
      });
      jesus.set({ x: 800, y: FLOOR + 14, s: 1.14, armF: 20 + gl * 50 - es(t, 2.1, 2.5) * 20, armB: 10 + gl * 70, head: -gl * 3, blink: blinkAt(T, 1) });

      /* v11c — the disciples believe: they kneel, and lights kindle over them */
      dis.forEach((d, i) => {
        const kneel = es(t, 2.1 + i * 0.07, 2.17 + i * 0.07);
        const turn = es(t, 1.2, 1.5);
        const x = d.x + (d.right ? -1 : 1) * es(t, 2.0, 2.3) * 30;
        const o = { x, y: FLOOR - 4 + (i % 2) * 8, s: 1.02, flip: d.right, blink: blinkAt(T, d.seed) };
        d.st.set({ ...o, o: 1 - kneel, armF: 20 + turn * 40, armB: turn * 30, head: -turn * 8 });
        d.kn.set({ ...o, o: kneel, armF: 70 + (i % 2) * 30, armB: 40, head: -10 });
        const lk = es(t, 2.3 + i * 0.08, 2.6 + i * 0.08, ease.back);
        pose(lights[i].el, { x: x + (d.right ? -6 : 6), y: FLOOR - 150 - lk * 20 + Math.sin(T * 1.4 + i) * 3, s: lk, o: lk });
      });

      S.cam.z = (S.portrait ? 0.96 : 1.04) + es(t, 0.9, 1.6) * (S.portrait ? 0.03 : 0.06) + es(t, 2, 2.8) * (S.portrait ? 0.02 : 0.04);
      S.cam.y = -20 + es(t, 0.9, 1.6) * 60;
    };
  },
};
