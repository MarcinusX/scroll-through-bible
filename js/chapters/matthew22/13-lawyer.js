// Mt 22,34–36 — the Pharisees hear that he has silenced the Sadducees, and gather together in a knot on the
// right. One of them, a lawyer with his scroll, steps out to test him: "Which commandment in the Law is the
// greatest?" — and a flurry of little law-slips, all the Law's commands, whirls up into the air.
import { C, person, CAST, blinkAt, pose, lerp, crowd } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { templeCourt, pharisee, scribe, moodPuppet, voiceRings, bubble, wordSlip, popBubble, tr } from './lib.js';

const JX = 700, LX = 950;
const GX = [1020, 1080, 1140, 1070];            // the gathered Pharisees

export default {
  id: 'mt22-lawyer',
  beats: [
    { v: 34 },
    { v: 35 },
    { v: 36 },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 4, x0: 380, x1: 600, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 860, x1: 1000, pose: 'sit' }]);

    /* the law-slips in the air */
    const air = S.layer({ par: 0.3, sh: 5 });
    const slips = Array.from({ length: 18 }, (_, i) => ({ el: air.add(wordSlip(c, c.rr(26, 36))), i, x: lerp(440, 1160, (i + 0.5) / 18) + c.rr(-20, 20), y: c.rr(150, 340), ph: c.rr(0, 6) }));

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 590 - i * 56, i }));
    const phar = [0, 1, 4, 3].map((k, i) => ({ i, p: moodPuppet(S, pl, c, pharisee(c, k)), seed: c.rr(0, 9) }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const law = S.puppet(pl.add(person(c, scribe(c, 0))));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const ask = pl.add(`<g>${bubble(c, tr(['Nauczycielu, które przykazanie', 'w Prawie jest największe?'], ['Teacher, which is the greatest', 'commandment in the law?']), { size: 17, tail: -1 })}</g>`);
    const heard = pl.add(`<g>${bubble(c, tr(['Zamknął usta', 'saduceuszom!'], ['He silenced', 'the Sadducees!']), { size: 17, tail: -1 })}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v34 — they hear, and gather */
      phar.forEach((p) => {
        const k = es(t, 0.05 + p.i * 0.07, 0.5 + p.i * 0.07);
        const x = lerp(1480 + p.i * 60, GX[p.i], k);
        const y = F + 2 + (p.i === 3 ? -12 : (p.i % 2) * 10);
        const huddle = es(t, 0.55, 0.7);
        p.p.set({ x, y, s: 0.9, flip: k < 1 || p.i !== 2 ? true : huddle < 0.5, walk: k > 0 && k < 1 ? x * 0.05 + p.i : undefined, head: huddle * 10 - bump(t, 1.2, 1.9) * 6, lean: huddle * 5, armF: 26 + huddle * 24, blink: blinkAt(T, p.seed) });
        p.p.mood({ angry: es(t, 0.3, 0.6) * 0.8, sad: 0 });
      });
      popBubble(heard, t, 0.3, 0.95, GX[0] - 10, F - 206);

      /* v35 — the lawyer steps out; v36 — his question, and a flurry of the Law's commands */
      const come = es(t, 1.08, 1.55);
      const x = lerp(1150, LX, come);
      law.set({ x, y: F + 6, s: 0.95, flip: true, walk: come > 0 && come < 1 ? x * 0.05 : undefined, blink: blinkAt(T, 3), head: -bump(t, 2.1, 2.9) * 6, armF: 26 + bump(t, 2.1, 2.9) * 40, armB: bump(t, 2.1, 2.9) * 60 });
      popBubble(ask, t, 2.1, 2.97, LX - 30, F - 210);
      const fly = es(t, 2.2, 2.55);
      slips.forEach((s) => {
        const y = s.y + Math.sin(T * 1.4 + s.ph) * 6 * fly;
        pose(s.el, { x: lerp(LX - 30, s.x, fly), y: lerp(F - 180, y, fly), r: Math.sin(T * 1.1 + s.ph) * 20 * fly, s: 0.5 + fly * 0.9, o: fly });
      });

      /* Jesus */
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), head: bump(t, 2.1, 2.9) * -8, armF: 30 + bump(t, 0.1, 0.9) * 20, armB: 16 });
      voice(JX + 26, F - 176, 0, T);
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + d.i * 8, s: 0.9, head: -bump(t, 2.1, 2.9) * 12, blink: blinkAt(T, d.i + 3) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -bump(t, 2.1, 2.9) * 14 - 3, blink: blinkAt(T, m.seed) }));

      S.cam.z = 1 + es(t, 1.0, 1.6) * 0.03;
      S.cam.x = es(t, 0.0, 0.8) * 20;
    };
  },
};
