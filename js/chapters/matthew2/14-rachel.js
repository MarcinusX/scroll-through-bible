// Mt 2,17–18 — dusk over the dark hills of Ramah. The old prophet Jeremiah unrolls his scroll. A cry goes out over
// the hills in rings of sound: weeping and great mourning. In the middle, Rachel kneels among the empty cradles with
// her face in her hands; a woman comes to comfort her, but she turns away, for they are no more. Small lights rise
// from the cradles into the sky and become stars.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, stars, cypress, olive, grass, rock } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  LOOK, MOURN, dim, hillTown, cradle, voiceRings, scrollOpen, placeTag, folk, withBits, hangAt, vpose, sparkle, tr, PI,
} from './lib.js';

const Y = 700;
const RX = 800;               // Rachel

export default {
  id: 'mt2-rachel',
  beats: [
    { v: 17 },
    { v: 18, text: 'Krzyk usłyszano w Rama, płacz i jęk wielki.' },
    { v: 18, cont: true, text: 'Rachel opłakuje swe dzieci i nie chce utulić się w żalu, bo ich już nie ma.' },
  ],
  cam: { x: [-60, 40], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, MOURN);
    const starL = S.layer({ par: 0.03, sh: 3 });
    starL.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -900, y1: 380, n: 60 })}</g>`);
    const far = S.layer({ par: 0.07, sh: 2 });
    far.add(band(c, { y: 470, amps: [26, 9, 3], lens: [900, 330, 120], color: dim(mix(C.hillFar, C.duskViolet, 0.4), 0.5) }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    const mfn = (x) => 560 - Math.max(0, 1 - Math.abs(x - 540) / 380) ** 1.5 * 130 + Math.sin(x * 0.01) * 6;
    mid.add(sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1), dim(mix(C.hillMid, C.duskViolet, 0.3), 0.5)).out());
    mid.add(`<g transform="translate(540 ${mfn(540) + 10})">${hillTown(c, { w: 200, h: 36, col: dim(mix(C.hillMid, C.duskViolet, 0.3), 0.5), wall: dim(C.plaster, 0.5), wall2: dim(C.plaster2, 0.55), roof: dim(C.roof, 0.5), n: 7 })}</g>`);
    mid.add(cypress(c, 1180, mfn(1180) + 8, 130, dim(C.moss2, 0.5)) + cypress(c, 1240, mfn(1240) + 8, 100, dim(C.moss2, 0.5)));
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(Y - 30, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), dim(mix(C.sand2, C.hillNear, 0.35), 0.5)).out());
    G.add(olive(c, 1400, gfn(1400) + 20, 1, { leaf: dim(C.olive, 0.5), leaf2: dim(C.sage, 0.5), trunk: dim(C.wood2, 0.4) }) + rock(c, 1080, gfn(1080) + 26, 90, 30, dim(C.rock2, 0.5)) + grass(c, { x0: -800, x1: 2400, y: Y, fn: (x) => gfn(x) + 20, n: 30, h: 12, color: dim(C.moss, 0.5) }));

    const ringL = S.layer({ par: 0.16, sh: 2 });
    const rings = voiceRings(ringL, c, { n: 4, color: mix(C.lavender, C.cream, 0.4), r: 50, w: 5 });

    const P = S.layer({ par: 0.5, sh: 5 });
    const cr = [[620, 0.9], [990, 0.85], [1110, 0.8]].map(([x, s], i) => ({ i, x, s, el: P.add(`<g>${cradle(c, 80)}</g>`) }));
    const jer = S.puppet(P.add(person(c, { ...LOOK.jeremiah, holdF: `<g transform="translate(20 10) rotate(-70)">${scrollOpen(c, 64, 42)}</g>` })));
    const rEl = P.add(withBits(person(c, { ...LOOK.rachel, pose: 'kneel' }), c));
    const rachel = S.puppet(rEl);
    const tear = rEl.querySelector('[data-part="tear"]');
    const friend = S.puppet(P.add(person(c, folk(c, false, { robe: mix(C.dustyBlue, C.storm, 0.3), veil: mix(C.skyVeil, C.storm, 0.3) }))));

    const X = S.layer({ par: 0.3, sh: 5 });
    const tagJ = hanging(X, placeTag(c, tr('prorok Jeremiasz', 'Jeremiah the prophet'), 18), { x: 0, y: 0, len: 600 });
    const tagR = hanging(X, placeTag(c, tr('Rama', 'Ramah'), 20), { x: 0, y: 0, len: 600 });
    const tagRa = hanging(X, placeTag(c, tr('Rachel', 'Rachel'), 19), { x: 0, y: 0, len: 600 });
    const souls = Array.from({ length: 7 }, (_, i) => ({ i, el: X.add(`<g><circle r="26" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 7, 2, 4, 0))}" fill="${C.star}"/></g>`), x0: cr[i % 3].x + c.rr(-20, 20), dx: c.rr(-120, 120), top: c.rr(120, 300), d: c.rr(0, 0.2) }));

    return (t, time) => {
      const T = time;
      /* v17 — Jeremiah's words are fulfilled */
      const jk = es(t, -0.2, 0.4, ease.out);
      jer.set({ x: lerp(300, 500, jk), y: Y + 10, s: 0.95, walk: jk > 0 && jk < 1 ? jk * 12 : undefined, armF: 70, armB: 20 + bump(t, 0.4, 1.0) * 70, head: 6, blink: blinkAt(T, 2), o: 1 - es(t, 1.9, 2.1) });
      const tj = es(t, 0.2, 0.45, ease.out) * (1 - es(t, 1.0, 1.15, ease.in));
      hangAt(tagJ, 520, lerp(-500, 330, tj), T, tj > 0.001 ? 1 : 0, 1.2, 0.9, 1);

      /* v18a — a cry heard in Ramah */
      const cry = es(t, 1.0, 1.25) * (1 - es(t, 2.6, 3.0) * 0.6);
      rings(540, mfn(540) - 50, cry, T, { spread: 3.2, speed: 0.4 });
      const tr_ = es(t, 1.05, 1.3, ease.out) * (1 - es(t, 1.95, 2.1, ease.in));
      hangAt(tagR, 540, lerp(-500, 250, tr_), T, tr_ > 0.001 ? 1 : 0, 1.2, 0.9, 2);

      /* Rachel weeps among the empty cradles */
      const rk = es(t, 0.9, 1.3);
      const turn = es(t, 2.45, 2.52);
      rachel.set({ x: RX - turn * 20, y: Y + 8, s: 1.02, flip: turn > 0.5, o: rk, armF: 166, armB: 156, head: 36 + Math.sin(T * 1.4) * 2, lean: 16, blink: 0 });
      pose(tear, { o: es(t, 1.4, 1.7) });
      cr.forEach((k) => pose(k.el, { x: k.x, y: Y + 14 + k.i * 6, s: k.s, o: es(t, 0.95 + k.i * 0.1, 1.25 + k.i * 0.1) }));
      const fk = es(t, 2.0, 2.35, ease.out);
      friend.set({ x: lerp(1250, 930, fk), y: Y + 6, s: 0.95, flip: true, walk: fk > 0 && fk < 1 ? fk * 10 : undefined, armF: 30 + es(t, 2.3, 2.5) * 50 * (1 - turn * 0.5), armB: 20, head: 10, o: fk > 0.01 ? 1 : 0, blink: blinkAt(T, 3) });
      const ra = es(t, 2.1, 2.35, ease.out);
      hangAt(tagRa, RX - 40, lerp(-500, 300, ra), T, ra > 0.001 ? 1 : 0, 1.2, 0.9, 3);

      /* v18b — they are no more: small lights rise into the night */
      souls.forEach((sl) => {
        const k = es(t, 2.3 + sl.d, 2.95 + sl.d, ease.out);
        vpose(sl.el, { x: sl.x0 + sl.dx * k + Math.sin(T + sl.i) * 6, y: lerp(Y - 30, sl.top, k), s: 0.6 + k * 0.4, o: k > 0.01 ? 0.3 + k * 0.7 : 0 });
      });

      S.cam.x = lerp(-50, 0, es(t, 0.8, 1.4));
      S.cam.y = 30 + es(t, 1.9, 2.3) * 10;
      S.cam.z = 1.02 + es(t, 1.9, 2.3) * 0.06;
    };
  },
};
