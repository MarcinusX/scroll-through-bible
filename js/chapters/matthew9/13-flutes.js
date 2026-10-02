// Mt 9,23–24 — the ruler's house: the room is full of mourners wailing with their hands raised and two flute
// players piping a dirge (notes fly), the girl lies still on her bed, her mother bent beside her. Jesus comes in
// with the ruler: "Make room! The girl is not dead, but asleep" — and over the bed float the little z's of sleep.
// They laugh at Him: heads thrown back, "ha! ha!"
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roomSet, girlOnBed, blanketOnBed, mourners, RM, RULER, L5, flute, note, bubble, glyphTag, kf, moving, tr } from './lib.js';

const FEET = RM.FLOOR + 20;

export default {
  id: 'mt9-flutes',
  beats: [
    { v: 23 },
    { v: 24, text: 'rzekł: «Usuńcie się, bo dziewczynka nie umarła, tylko śpi».' },
    { v: 24, cont: true, text: 'A oni wyśmiewali Go.' },
  ],
  cam: { x: [-60, 120], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const set = roomSet(S);
    const c = S.c;
    // phone: the bed (and the girl on it) moves in from the edge, and Jesus comes a little further into the room
    const BD = S.portrait ? -60 : 0;
    const GX = S.portrait ? [720, 830] : [720, 880], PX = S.portrait ? [610, 920] : [610, 990];   // phone: the crowd closes up so the girl's head shows
    set.bedL.add(`<g>${girlOnBed(c, L5.girl)}</g>`);
    set.bedL.add(`<g>${blanketOnBed(c)}</g>`);

    /* the mother at the bed, the mourners, the flute players */
    const L = S.layer({ par: 0.5, sh: 5 });
    const mother = S.puppet(L.add(person(c, { ...L5.mother, pose: 'kneel' })));
    const G = [[[0, 1, 2], GX[0]], [[3, 1, 0], GX[1]]].map(([idx, x], i) => ({ i, x, wail: L.sprite(mourners(c, idx, 'wail'), x, FEET), laugh: L.sprite(mourners(c, idx, 'laugh'), x, FEET) }));
    const pipers = [0, 1].map((i) => ({ i, x: PX[i], p: S.puppet(L.add(person(c, { ...L5.mourner, robe: mix(C.stone2, C.storm, 0.3 + i * 0.1), hairStyle: 'wrap', veil: C.stone2, beard: i ? 'short' : 'full', holdF: flute(c) }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const ruler = S.puppet(L.add(person(c, RULER)));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const notes = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${note(c, mix(C.ink, C.storm, 0.3))}</g>`), from: i % 2 ? PX[1] : PX[0] }));
    const cries = [0, 1, 2].map((i) => fx.add(`<g opacity="0">${glyphTag(c, '!', { size: 22, ink: C.storm2 })}</g>`));
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Usuńcie się! Dziewczynka', 'Make room! The girl'), tr('nie umarła, tylko śpi', 'isn’t dead, but sleeping')], { size: 20, dir: -1 })}</g>`);
    const zs = [0, 1, 2].map((i) => fx.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${22 + i * 6}" font-style="italic" fill="${C.dustyBlue}">z</text></g>`));
    const has = [[660, 480], [760, 460], [860, 470], [950, 488]].map(([x, y], i) => ({ i, x, y, el: fx.add(`<g opacity="0">${glyphTag(c, 'ha!', { size: 20, ink: C.terracotta })}</g>`) }));

    const JK = [[0.05, 300], [0.6, S.portrait ? 560 : 520]];
    return (t, time) => {
      const T = time;
      /* v23 — He comes in and sees the pipers and the noisy crowd */
      const jx = kf(t, JK);
      const speak = es(t, 1.05, 1.25);
      jesus.set({ x: jx, y: FEET, s: 1.04, walk: moving(t, JK) ? jx * 0.05 : undefined, armF: 14 + speak * 70 * (1 - es(t, 2.1, 2.3)), armB: 10 + speak * 60 * (1 - es(t, 2.1, 2.3)), head: -bump(t, 2.1, 2.9) * 4, blink: blinkAt(T) });
      if (BD) set.bedL.shift(BD, 0);
      const rx = kf(t, [[0.0, 220], [0.62, S.portrait ? 470 : 440]]);
      ruler.set({ x: rx, y: FEET - 10, s: 1, walk: t > 0 && t < 0.62 ? rx * 0.05 : undefined, armF: 20, head: 10, blink: blinkAt(T, 3) });
      mother.set({ x: 1000 + BD, y: FEET - 30, s: 0.94, armF: 60, armB: 30, head: 16, blink: blinkAt(T, 7) });
      const laugh = es(t, 2.05, 2.15);
      G.forEach((g) => {
        g.wail.set({ x: g.x, y: FEET - (T ? Math.abs(Math.sin(T * 2.2 + g.i)) * 3 : 0) * (1 - laugh), o: 1 - laugh });
        g.laugh.set({ x: g.x, y: FEET, o: laugh });
      });
      pipers.forEach((p) => p.p.set({ x: p.x, y: FEET - 16, s: 0.98, flip: p.i === 1, armF: 70 + (1 - laugh) * 0, armB: 60, head: -laugh * 18 + 6, blink: blinkAt(T, p.seed) }));
      const noisy = 1 - es(t, 1.9, 2.1);
      notes.forEach((n) => {
        const k = T ? ((T * 0.4 + n.i / 8) % 1) : n.i / 8;
        pose(n.el, { x: n.from + (n.i % 2 ? -1 : 1) * k * 90, y: FEET - 150 - k * 140 + Math.sin(k * 8 + n.i) * 10, r: Math.sin(k * 6 + n.i) * 20, o: noisy * Math.sin(k * Math.PI) });
      });
      cries.forEach((cr, i) => {
        const k = es(t, 0.3 + i * 0.12, 0.5 + i * 0.12, ease.back) * (1 - es(t, 1.0, 1.1));
        pose(cr, { x: 700 + i * 110, y: 470 - (i % 2) * 20, s: k, r: T ? Math.sin(T * 5 + i) * 8 : 0, o: k > 0.02 ? 1 : 0 });
      });

      /* v24a — "the girl is not dead, but sleeping" */
      const sk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(say, { x: jx + 40, y: FEET - 232, s: sk, o: sk > 0.02 ? 1 : 0 });
      zs.forEach((z, i) => {
        const k = T ? ((T * 0.35 + i / 3) % 1) : (i + 1) / 4;
        const on = es(t, 1.3, 1.5);
        pose(z, { x: 1020 + BD + k * 50, y: RM.FLOOR - 100 - k * 90, o: on * Math.sin(k * Math.PI) });
      });

      /* v24b — they laugh at Him */
      has.forEach((h) => {
        const k = es(t, 2.12 + h.i * 0.08, 2.3 + h.i * 0.08, ease.back);
        pose(h.el, { x: h.x, y: h.y - (T ? Math.abs(Math.sin(T * 5 + h.i)) * 8 : 0), s: k, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = 40 - es(t, 0.0, 0.6) * 40 + es(t, 1.2, 1.6) * 40;
      S.cam.z = 1.06 + es(t, 0.6, 1.2) * 0.04;
      S.cam.y = 30;
    };
  },
};
