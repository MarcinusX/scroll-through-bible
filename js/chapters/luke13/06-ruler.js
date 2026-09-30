// Łk 13,14 — the ruler of the synagogue gets up, indignant, a storm in his thoughts, and speaks not to Jesus but to
// the people on the benches: "There are six days on which work ought to be done" — six cards come down in a row, one
// for each working day, with a hoe, a sickle, a spade, a hammer, bread and a water jug, and then a seventh, the
// Sabbath, with its two candles. He counts them off on his raised hand. "Come on those days and be healed, and not on
// the Sabbath day!": a small mark of healing lights on each of the six cards; on the seventh it is crossed out, and he
// waves the people away. Jesus stands quietly in the middle, the woman beside Him, straight and free.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { sickle } from '../../assets/things.js';
import {
  synSet, BENT, RULER, pharisee, dayCard, hoe, spade, hammer, loaf, jug, candle, healMark, crossOut, thought, GLYPH, withFace, faceBits, face,
  headAt, kf, es, ease, bump, seg, tr, PI,
} from './lib.js';

const FEET = 742, JX = 810, WX = 660, RX = 1010;

export default {
  id: 'lk13-ruler',
  beats: [
    { v: 14, text: 'Lecz przełożony synagogi, oburzony tym, że Jezus w szabat uzdrowił, rzekł do ludu: «Jest sześć dni, w których należy pracować.' },
    { v: 14, cont: true, text: 'W te więc przychodźcie i leczcie się, a nie w dzień szabatu!»' },
  ],
  cam: { x: [-20, 40], y: [110, 140], z: [1.05, 1.16] },
  build(S) {
    const Y = synSet(S);
    const c = S.c;
    const I = Y.I;

    const act = S.layer({ par: 0.5, sh: 5 });
    const phs = [0, 1].map((i) => S.puppet(act.add(person(c, pharisee(c, i + 1)))));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const woman = S.puppet(act.add(person(c, { ...BENT })));
    const rulerEl = act.add(withFace(person(c, { ...RULER }), faceBits(c)));
    const ruler = S.puppet(rulerEl);
    const fx = S.layer({ par: 0.5, sh: 6 });
    const storm = fx.add(`<g opacity="0">${thought(c, `<g transform="scale(1.3)">${GLYPH.storm(c)}</g>`, { w: 74, h: 54, fill: mix(C.storm, C.stone2, 0.5) })}</g>`);

    /* the seven cards */
    const icons = [
      `<g transform="rotate(30) scale(.62) translate(0 -24)">${hoe(c)}</g>`,
      `<g transform="scale(.46) translate(8 -2)">${sickle(c)}</g>`,
      `<g transform="rotate(-24) scale(.5) translate(0 -58)">${spade(c, 118)}</g>`,
      `<g transform="rotate(-20) scale(.7)">${hammer(c)}</g>`,
      `<g transform="translate(0 12)">${loaf(c, 22)}</g>`,
      `<g transform="translate(2 24) scale(.46)">${jug(c)}</g>`,
      `<g transform="translate(-16 26) scale(.4)">${candle(c, 44)}</g><g transform="translate(16 26) scale(.4)">${candle(c, 44)}</g>`,
    ];
    const cardL = S.layer({ par: 0.5, sh: 6 });
    const cards = icons.map((ic, i) => ({ i, x: 618 + i * 88, el: cardL.add(`<g>${dayCard(c, i < 6 ? String(i + 1) : tr('szabat', 'Sabbath'), ic, { face: i < 6 ? C.cream : C.halo, rim: i < 6 ? C.parchment : C.haloRim, w: i < 6 ? 78 : 92 })}</g>`) }));
    const marks = cards.map((cd) => ({ ...cd, el: cardL.add(`<g opacity="0">${healMark(c, 13)}</g>`) }));
    const cross = cardL.add(`<g opacity="0">${crossOut(c, 30)}</g>`);

    return (t, time) => {
      const T = time;
      I.flicker(T);
      Y.set(0);

      /* the ruler: up, indignant, counting on the cards; waving the people off */
      const rise = es(t, 0.02, 0.2);
      const count = bump(t, 0.4, 0.95);
      const wave = es(t, 1.2, 1.35) * (1 - es(t, 1.85, 1.95) * 0.3);
      ruler.set({ x: RX, y: FEET, s: 1.04, flip: true, armB: 10 + rise * 30 + count * 100 + wave * 40, armF: 20 + wave * 70 + Math.sin(t * 30) * wave * 10, head: -count * 10 - wave * 4, lean: -wave * 4, blink: blinkAt(T, 4) });
      face(rulerEl, 'angry', es(t, 0.05, 0.25));
      const sk = es(t, 0.12, 0.3, ease.back);
      const [rx, ry] = headAt(RX, FEET, 1.04, true);
      pose(storm, { x: rx + 6, y: ry - 20, s: sk * 1.1, o: sk > 0.02 ? 1 : 0 });
      phs.forEach((p, i) => p.set({ x: 1120 + i * 70, y: FEET - 20 - i * 10, s: 0.98, flip: true, armF: 20 + wave * 30 * (1 - i), armB: 10, head: -4 + i * 4, blink: blinkAt(T, 6 + i) }));

      /* Jesus and the woman, quiet in the middle */
      jesus.set({ x: JX, y: FEET, s: 1.06, flip: false, armF: 16, armB: 8, head: 4, blink: blinkAt(T) });
      woman.set({ x: WX, y: FEET, s: 1.04, flip: false, armF: 56, armB: 44, head: -4 - wave * 6, blink: blinkAt(T, 2) });

      /* the six days and the Sabbath */
      cards.forEach((cd) => {
        const k = es(t, 0.3 + cd.i * 0.06, 0.52 + cd.i * 0.06, ease.out);
        pose(cd.el, { x: cd.x, y: lerp(-800, 262 + (cd.i % 2) * 14, k) + (T ? Math.sin(T * 0.8 + cd.i) * 2 : 0), r: T ? Math.sin(T * 0.7 + cd.i * 1.3) * 1.5 : 0 });
      });
      marks.forEach((m) => {
        const k = es(t, 1.12 + m.i * 0.05, 1.26 + m.i * 0.05, ease.back);
        pose(m.el, { x: m.x + 24, y: 262 + (m.i % 2) * 14 + 92, s: k, o: k > 0.02 ? 1 : 0 });
      });
      const xk = es(t, 1.5, 1.62, ease.back);
      pose(cross, { x: cards[6].x + 24, y: 262 + 92, s: xk * 0.7, o: xk > 0.02 ? 1 : 0 });

      S.cam.x = 20;
      S.cam.y = 130;
      S.cam.z = 1.1;
      void lerp; void kf; void seg; void PI; void shade; void sheet;
    };
  },
};
