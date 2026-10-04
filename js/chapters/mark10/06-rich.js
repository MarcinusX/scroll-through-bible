// Mk 10,17–20 — as he sets out, a man in fine clothes runs up and kneels: "Good Teacher, what must I do
// to inherit eternal life?" The word "good" floats up into the light — only God is good. The tablets of
// the Law come down and break into six small stones, one for each commandment; the young man ticks
// them off one by one: all these I have kept since my youth. His loaded cart waits at the roadside.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { bush, rock, olive } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { roadSet, TWELVE, LOOK, say, slip, lawTablets, tablet, tick, cart, sack, headAt } from './lib.js';

const GY = 672;
const JX = 760, MX = 900;

export const COMMANDMENTS = () => [
  tr(['nie zabijaj'], ['Do not murder']),
  tr(['nie cudzołóż'], ['Do not commit', 'adultery']),
  tr(['nie kradnij'], ['Do not steal']),
  tr(['nie zeznawaj', 'fałszywie'], ['Do not give', 'false testimony']),
  tr(['nie oszukuj'], ['Do not defraud']),
  tr(['czcij ojca', 'i matkę'], ['Honor father', 'and mother']),
];

export default {
  id: 'm10-rich',
  beats: [
    { v: 17, text: 'Gdy wybierał się w drogę, przybiegł pewien człowiek i upadłszy przed Nim na kolana, pytał Go:' },
    { v: 17, cont: true, text: '«Nauczycielu dobry, co mam czynić, aby osiągnąć życie wieczne?»' },
    { v: 18, text: 'Jezus mu rzekł: «Czemu nazywasz Mnie dobrym?' },
    { v: 18, cont: true, text: 'Nikt nie jest dobry, tylko sam Bóg.' },
    { v: 19, text: 'Znasz przykazania:' },
    { v: 19, cont: true, text: 'Nie zabijaj, nie cudzołóż, nie kradnij, nie zeznawaj fałszywie, nie oszukuj, czcij swego ojca i matkę».' },
    { v: 20 },
  ],
  cam: { x: [-40, 60], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;   // phone: cart, bubbles and the six stones kept inside the screen
    const BX = P ? MX - 70 : MX - 30;
    const R = roadSet(S, { jer: 0.22, jerX: 1170, roadX: 820, trees: 18, clouds: [[480, 150, 170], [1000, 120, 120]] });
    const lightL = S.layer({ par: 0.04, sh: 1, flat: true });
    const heaven = lightL.add(`<g opacity="0">${rays(c, { n: 16, r0: 40, r1: 700, spread: 0.05, color: '#fff3cf' })}<circle r="200" fill="url(#halo-glow)"/></g>`);
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1400, 606, 0.9) + bush(c, 1330, 610, 60, C.sage, C.moss));

    // his cart, loaded, waiting at the roadside
    const cartL = S.layer({ par: 0.42, sh: 4 });
    const K = cart(c, 190);
    cartL.add(`<g transform="translate(${P ? 1025 : 1180} ${GY - 70}) scale(.8)">${K.body}<g transform="translate(-40 0)">${K.wheel}</g><g transform="translate(50 0)">${K.wheel}</g></g>`);
    cartL.add(`<g transform="translate(${P ? 975 : 1080} ${GY - 34}) scale(.9)">${sack(c, 44)}</g>`);

    /* hanging: the tablets of the Law and the six small stones */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const law = hanging(hangL, `<g transform="translate(0 150)">${lawTablets(c, { w: 76, h: 110 })}</g>`, { x: 800, y: 110, len: 900 });
    const CM = COMMANDMENTS();
    const XS = P ? [600, 800, 1000, 600, 800, 1000] : [535, 655, 775, 895, 1015, 1135];
    const stones = CM.map((lines, i) => {
      const el = hanging(hangL, tablet(c, lines, { w: 112, size: lines.length > 1 ? 14 : 15 }), { x: XS[i], y: 110, len: 900 });
      const tk = hangL.add(`<g opacity="0">${tick(c, 17)}</g>`);
      return { el, tk, i, x: XS[i], h: 34 + lines.length * 17 };
    });
    const good = hangL.add(`<g opacity="0">${slip(c, tr('dobry', 'good'), { size: 24 })}</g>`);

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1], TWELVE[6]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const runner = S.puppet(pL.add(person(c, LOOK.rich)));
    const kneeler = S.puppet(pL.add(person(c, { ...LOOK.rich, pose: 'kneel' })));

    const wordL = S.layer({ par: 0.5, sh: 6 });
    const ask = wordL.add(`<g opacity="0">${say(c, tr(['Nauczycielu dobry,', 'co mam czynić, aby osiągnąć', 'życie wieczne?'], ['Good Teacher,', 'what shall I do to inherit', 'eternal life?']), { size: 18, side: 1 })}</g>`);
    const why = wordL.add(`<g opacity="0">${say(c, tr(['Czemu nazywasz', 'Mnie dobrym?'], ['Why do you', 'call me good?']), { size: 18, side: -1 })}</g>`);
    const kept = wordL.add(`<g opacity="0">${say(c, tr(['Wszystkiego tego', 'przestrzegałem', 'od młodości!'], ['All these things', 'I have observed', 'from my youth!']), { size: 18, side: 1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 7) * 25 });

      /* beat 0: setting out; a man runs up and falls on his knees */
      const setOut = es(t, -0.4, 0.35);
      const jx = lerp(JX - 120, JX, setOut);
      const run = es(t, -0.2, 0.55);
      const kneel = es(t, 0.55, 0.62);
      const rx = lerp(MX + 520, MX + 12, run);
      runner.set({ x: rx, y: GY, s: 0.96, flip: true, o: 1 - kneel, walk: run > 0 && run < 1 ? rx * 0.1 : undefined, lean: run > 0 && run < 1 ? -6 : 0, armF: run < 1 ? 30 + Math.sin(rx * 0.1) * 20 : 0, armB: 20, blink: blinkAt(T, 4) });
      const say1 = es(t, 1.02, 1.3) * (1 - es(t, 1.9, 2.05));
      const tick_ = seg(t, 6.1, 6.8);
      const proud = es(t, 6.02, 6.25);
      kneeler.set({ x: MX, y: GY, s: 0.96, flip: true, o: kneel, armF: 40 + say1 * 50 + proud * (60 + Math.sin(tick_ * Math.PI * 6) * 15), armB: say1 * 70 + proud * 20, head: -6 - say1 * 4 - proud * 6 + es(t, 4.02, 4.3) * -8, blink: blinkAt(T, 4) });
      pose(ask, { x: BX, y: GY - 150, s: es(t, 1.02, 1.25, ease.back), o: t > 1.02 && t < 2.05 ? 1 - es(t, 1.9, 2.05) : 0 });

      /* Jesus: stops, answers, lifts his hand to heaven, points to the Law */
      const toHeaven = es(t, 3.02, 3.3) * (1 - es(t, 3.9, 4.1));
      const answer = es(t, 2.02, 2.3) * (1 - es(t, 2.9, 3.05));
      const law_ = es(t, 4.0, 4.3) * (1 - es(t, 5.9, 6.1));
      jesus.set({ x: jx, y: GY, s: 1.02, walk: setOut > 0 && setOut < 1 ? jx * 0.07 : undefined, armF: 14 + answer * 55 + law_ * 70 + bump(t, 0.6, 1.4) * 20, armB: toHeaven * 150 + answer * 20, head: -answer * 3 - toHeaven * 10 - law_ * 8 + Math.sin(T * 0.6), blink: blinkAt(T) });
      pose(why, { x: jx + 14, y: GY - 222, s: es(t, 2.02, 2.25, ease.back), o: t > 2.02 && t < 3.05 ? 1 - es(t, 2.9, 3.05) : 0 });
      DIS.forEach((d) => {
        const dx = lerp(JX - 160 - d.i * 62 - 120, JX - 150 - d.i * 62, setOut);
        d.p.set({ x: dx, y: GY - 30 + (d.i % 2) * 12, s: 0.84, walk: setOut > 0 && setOut < 1 ? dx * 0.07 + d.i : undefined, head: -3 - es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1)) * 10, armF: 10, blink: blinkAt(T, d.seed) });
      });

      /* "good" — the word lifts out of his question and rises into the light of God */
      const gUp = es(t, 3.05, 3.8);
      pose(good, { x: lerp(MX - 10, 800, gUp), y: lerp(GY - 230, 60, gUp), s: 1 - gUp * 0.3, r: Math.sin(T * 1.5) * 4, o: es(t, 2.2, 2.4) * (1 - es(t, 3.75, 3.95)) });
      pose(heaven, { x: 800, y: -20, s: 0.7 + gUp * 0.4, r: t * 6, o: bump(t, 3.0, 4.3) * 0.9 });

      /* the Law comes down, then gives way to six small stones */
      const ld = es(t, 4.0, 4.35, ease.back), lu = es(t, 4.95, 5.25);
      swing(law, 800, 190 - (1 - ld) * 1100 - lu * 1100, T, 0.8, 0.6);
      stones.forEach((st) => {
        const d = es(t, 5.02 + st.i * 0.1, 5.3 + st.i * 0.1, ease.back);
        const y = (P ? 190 + Math.floor(st.i / 3) * 100 : 226 + (st.i % 2) * 36) - (1 - d) * 1100;   // phone: two rows of three
        swing(st.el, st.x, y, T, 1.4, 0.8, st.i);
        const tk = es(t, 6.1 + st.i * 0.1, 6.25 + st.i * 0.1, ease.back);
        pose(st.tk, { x: st.x + 40, y: y + st.h - 12, s: tk, r: -8, o: tk > 0.02 ? 1 : 0 });
      });
      pose(kept, { x: BX, y: GY - 150, s: es(t, 6.02, 6.25, ease.back), o: t > 6.02 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.6, 1.2) * 0.05 - es(t, 4.8, 5.3) * 0.04;
      S.cam.y = -es(t, 2.9, 3.4) * 30 * (1 - es(t, 3.9, 4.3)) - es(t, 4.8, 5.3) * 20;
      S.cam.x = es(t, 0.2, 0.9) * 30;
    };
  },
};
