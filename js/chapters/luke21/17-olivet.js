// Łk 21,37 — the Mount of Olives across the Kidron valley from Jerusalem (Mark 13's set). "Every day Jesus was teaching
// in the Temple": in the daylight a round lens hangs over the city and shows Him there, teaching, the people round Him;
// "and every night he would go out and spend the night on the mountain that is called Olivet": the sun goes down behind
// the hills, the lens is drawn up, and Jesus comes up the slope with Peter, James, John and Andrew; night falls, the moon
// rises and the stars come out, and they sit down under the olive trees, the city far off with the Temple dim in the dark.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import {
  olivesSet, circle, FOUR, OJX as JX, OJY as JY, still, crowdKnot, warm, onString, NIGHT,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

export default {
  id: 'lk21-olivet',
  beats: [
    { v: 37 },
  ],
  cam: { x: [-30, 30], y: [-40, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = olivesSet(S, { skyCols: ['#cfe0dc', '#eee6cf', '#f7ebd4'], tintCol: C.duskViolet, tintK: 0.06, sunXY: [1180, 200], templeGlow: 0.6 });
    const eve = sky(S, ['#8f86ad', '#e3a58e', '#f3c79e'], { name: 'eve', rise: 0 }).layer;
    const night = sky(S, NIGHT, { name: 'night', rise: 0 }).layer;
    set.sk.layer.el.after(eve.el);
    eve.el.after(night.el);
    eve.fade(0); night.fade(0);
    const dimL = S.layer({ par: 0.45, sh: 0, flat: true, pad: 300 });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night2, C.indigo, 0.4)}" opacity=".45"/>`);
    dimL.fade(0);

    /* the lens over the city: He teaches in the Temple */
    const lensL = S.layer({ par: 0.12, sh: 6 });
    const clip = S.id('lensT');
    const LR = 88;
    const inner = `<clipPath id="${clip}"><circle r="${LR}"/></clipPath><g clip-path="url(#${clip})"><rect x="${-LR}" y="${-LR}" width="${LR * 2}" height="${LR * 2}" fill="${mix(C.parchment, C.dawn, 0.3)}"/>` +
      `${sheet().p(c.cut([[-60, -LR], [60, -LR], [60, 10], [-60, 10]], 0.4, 6), mix(C.cream, C.stone, 0.2)).p(c.cut([[-18, 10], [-18, -30], [18, -30], [18, 10]], 0.3, 5), mix(C.plumRobe, C.lavender, 0.3)).p(c.cut([[-LR, 30], [LR, 30], [LR, LR], [-LR, LR]], 0.3, 6), mix(C.stone, C.sand, 0.35)).out()}` +
      `<g transform="translate(0 64)">${still(c, CAST.jesus, { s: 0.42, armF: 70, armB: 40 })}</g>` +
      `<g transform="translate(-52 70)">${crowdKnot('lk21-lensL', 3, { s: 0.36, spread: 18, rows: 1, flip: false }).m}</g><g transform="translate(54 70)">${crowdKnot('lk21-lensR', 3, { s: 0.36, spread: 18, rows: 1, flip: true }).m}</g></g>`;
    const lens = lensL.add(`<g>${onString(`<g transform="translate(0 ${LR + 8})">${sheet().p(c.cut(c.circ(0, 0, LR + 8, 40), 0.4, 5), C.haloRim).out()}${inner}</g>`)}</g>`);

    /* Jesus and the four come up the slope, then sit under the olives */
    const P = S.layer({ par: 0.55, sh: 5 });
    const walkers = [{ o: CAST.jesus, to: JX }, ...FOUR.map((f) => ({ o: f.o, to: f.x }))].map((w, i) => ({ ...w, i, p: S.puppet(P.add(person(c, w.o))) }));
    const circ = circle(S, P);


    return (t, time) => {
      const T = time;
      const ev = es(t, 0.3, 0.45), nt = es(t, 0.45, 0.62);
      eve.fade(ev * (1 - nt));
      night.fade(nt);
      dimL.fade(nt);
      set.update(t, T, { sun: 200 + es(t, 0.28, 0.5) * 340, sunO: 1 - nt, moon: lerp(520, 170, es(t, 0.5, 0.7)), moonO: es(t, 0.48, 0.55), glow: 0.6 - nt * 0.3, starsO: nt * 0.9 });

      /* the lens (day) */
      const lk = es(t, 0.0, 0.1, ease.out) * (1 - es(t, 0.3, 0.42, ease.in));
      pose(lens, { x: set.TEMPLE[0], y: lerp(-1000, 110, lk), r: T ? Math.sin(T * 0.8) * 0.8 : 0, o: lk > 0.002 ? 1 : 0 });

      /* the walk up (evening) and sitting down (night) */
      const sat = es(t, 0.6, 0.66);
      walkers.forEach((w) => {
        const k = es(t, 0.34 + w.i * 0.02, 0.6, (x) => x);
        const x = lerp(1500 + w.i * 70, w.to, ease.out(k));
        const y = w.i === 0 ? JY : FOUR[w.i - 1].y;
        const s = w.i === 0 ? 1.0 : FOUR[w.i - 1].s;
        w.p.set({ x, y, s, flip: true, walk: k > 0 && k < 1 ? x * 0.05 + w.i : undefined, o: k > 0 ? 1 - sat : 0, blink: blinkAt(T, w.i) });
      });
      circ.jesus.set({ x: JX, y: JY, s: circ.s, flip: false, armF: 25, armB: 10, head: 4, o: sat, blink: blinkAt(T, 2) });
      circ.four.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, o: sat, head: -4, lean: m.dir * 3, blink: blinkAt(T, m.seed) }));

      S.cam.z = 1 + es(t, 0.0, 0.2) * 0.06 * (1 - es(t, 0.3, 0.5)) + es(t, 0.55, 0.75) * 0.04;
      S.cam.y = -es(t, 0.0, 0.2) * 30 * (1 - es(t, 0.3, 0.5)) + es(t, 0.55, 0.75) * 20;
      void seg; void fade; void shade; void tr; void PI; void bump; void warm;
    };
  },
};
