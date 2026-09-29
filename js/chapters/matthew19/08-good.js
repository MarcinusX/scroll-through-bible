// Mt 19,16–17 — a young man in fine clothes (his loaded cart waits by the road) comes up to Jesus: "Teacher, what
// good thing must I do to have eternal life?" — "Why do you ask Me about what is good?" The word "good" lifts out
// of the talk and rises into the light: One alone is good. "If you would enter life, keep the commandments" —
// the tablets of the Law come down, and far along the road a little gate of life begins to shine.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing } from '../kit.js';
import { bush, rock, olive } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, TWELVE, LOOK, say, slip, lawTablets, cart, sack, kingdomGate, tr } from './lib.js';

const GY = 672;
const JX = 760, MX = 930;

export default {
  id: 'mt19-good',
  beats: [
    { v: 16, text: 'A oto zbliżył się do Niego pewien człowiek i zapytał:' },
    { v: 16, cont: true, text: '«Nauczycielu, co dobrego mam czynić, aby otrzymać życie wieczne?»' },
    { v: 17, text: 'Odpowiedział mu: «Dlaczego Mnie pytasz o dobro?' },
    { v: 17, cont: true, text: 'Jeden tylko jest Dobry.' },
    { v: 17, cont: true, text: 'A jeśli chcesz osiągnąć życie, zachowaj przykazania».' },
  ],
  cam: { x: [-40, 60], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.2, jerX: 1170, roadX: 820, trees: 18, clouds: [[480, 150, 170], [1000, 120, 120]] });
    const lightL = S.layer({ par: 0.04, sh: 1, flat: true });
    const heaven = lightL.add(`<g opacity="0">${rays(c, { n: 16, r0: 40, r1: 700, spread: 0.05, color: '#fff3cf' })}<circle r="200" fill="url(#halo-glow)"/></g>`);
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1400, 606, 0.9) + bush(c, 1330, 610, 60, C.sage, C.moss));
    // the gate of life, far along the road
    const gate = side.add(`<g opacity="0">${kingdomGate(c, 30, 70)}</g>`);

    // his cart, loaded, waiting at the roadside
    const cartL = S.layer({ par: 0.42, sh: 4 });
    const K = cart(c, 190);
    cartL.add(`<g transform="translate(1200 ${GY - 70}) scale(.8)">${K.body}<g transform="translate(-40 0)">${K.wheel}</g><g transform="translate(50 0)">${K.wheel}</g></g>`);
    cartL.add(`<g transform="translate(1100 ${GY - 34}) scale(.9)">${sack(c, 44)}</g>`);

    const hangL = S.layer({ par: 0.3, sh: 5 });
    const law = hanging(hangL, `<g transform="translate(0 150)">${lawTablets(c, { w: 76, h: 110 })}</g>`, { x: 800, y: 110, len: 900 });
    const good = hangL.add(`<g opacity="0">${slip(c, tr('dobro', 'good'), { size: 26 })}</g>`);
    const one = hangL.add(`<g opacity="0">${slip(c, tr('Jeden tylko jest Dobry', 'One alone is good'), { size: 26 })}</g>`);

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1], TWELVE[6]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const man = S.puppet(pL.add(person(c, LOOK.rich)));

    const wordL = S.layer({ par: 0.5, sh: 6 });
    const ask = wordL.add(`<g opacity="0">${say(c, tr(['Nauczycielu, co dobrego', 'mam czynić, aby otrzymać', 'życie wieczne?'], ['Good teacher, what good', 'thing shall I do, that I may', 'have eternal life?']), { size: 18, side: 1 })}</g>`);
    const why = wordL.add(`<g opacity="0">${say(c, tr(['Dlaczego Mnie', 'pytasz o dobro?'], ['Why do you', 'call me good?']), { size: 18, side: -1 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 20 });

      /* beat 0: a man comes up to Him */
      const come = es(t, -0.2, 0.6);
      const mx = lerp(MX + 420, MX, come);
      const say1 = es(t, 1.02, 1.25) * (1 - es(t, 1.9, 2.05));
      const listen = es(t, 2.05, 2.3);
      man.set({ x: mx, y: GY, s: 0.96, flip: true, walk: come > 0 && come < 1 ? mx * 0.07 : undefined, armF: 14 + say1 * 60 + bump(t, 0.55, 0.95) * 30, armB: say1 * 70, head: -4 - say1 * 3 - es(t, 3.05, 3.4) * 8 * (1 - es(t, 4.0, 4.3)) - es(t, 4.05, 4.4) * 6, blink: blinkAt(T, 4) });
      pose(ask, { x: MX - 26, y: GY - 196, s: es(t, 1.02, 1.25, ease.back), o: t > 1.02 && t < 2.05 ? 1 - es(t, 1.9, 2.05) : 0 });

      /* Jesus */
      const answer = es(t, 2.02, 2.3) * (1 - es(t, 2.9, 3.05));
      const toHeaven = es(t, 3.02, 3.3) * (1 - es(t, 3.9, 4.1));
      const law_ = es(t, 4.02, 4.3);
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 16 + answer * 55 + law_ * 70 + bump(t, 0.5, 1.2) * 16, armB: toHeaven * 150 + answer * 20, head: -answer * 3 - toHeaven * 10 - law_ * 8 + Math.sin(T * 0.6), blink: blinkAt(T) });
      pose(why, { x: JX + 14, y: GY - 222, s: es(t, 2.02, 2.25, ease.back), o: t > 2.02 && t < 3.05 ? 1 - es(t, 2.9, 3.05) : 0 });
      DIS.forEach((d) => {
        d.p.set({ x: JX - 150 - d.i * 62, y: GY - 30 + (d.i % 2) * 12, s: 0.84, head: -3 - toHeaven * 10 + (d.i === 0 ? 0 : listen * 2), armF: 10, blink: blinkAt(T, d.seed) });
      });

      /* "good" — the word hangs over them, then rises into the light of God */
      const gUp = es(t, 3.05, 3.7);
      pose(good, { x: lerp(850, 800, gUp), y: lerp(330, 60, gUp), s: 1 - gUp * 0.2, r: Math.sin(T * 1.5) * 4, o: es(t, 2.2, 2.4) * (1 - es(t, 3.6, 3.8)) });
      pose(one, { x: 800, y: 150, s: es(t, 3.5, 3.75, ease.back), r: Math.sin(T * 1.1) * 2, o: t > 3.5 ? 1 - es(t, 3.95, 4.1) : 0 });
      pose(heaven, { x: 800, y: -20, s: 0.7 + gUp * 0.4, r: t * 6, o: bump(t, 3.0, 4.2) * 0.9 });

      /* the Law comes down; the gate of life shines far along the road */
      const ld = es(t, 4.02, 4.35, ease.back);
      swing(law, 800, 170 - (1 - ld) * 1100, T, 0.8, 0.6);
      pose(gate, { x: 1080, y: 596, s: 0.3 + es(t, 4.2, 4.6) * 0.5, o: es(t, 4.2, 4.5) });

      S.cam.z = 1 + es(t, 0.6, 1.2) * 0.05 - es(t, 3.8, 4.3) * 0.04;
      S.cam.y = -es(t, 2.9, 3.4) * 30 * (1 - es(t, 3.9, 4.3)) - es(t, 3.9, 4.3) * 10;
      S.cam.x = es(t, 0.2, 0.9) * 30;
    };
  },
};
