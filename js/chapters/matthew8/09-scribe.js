// Mt 8,18–19 — the shore at Capernaum, the next morning. Crowds press round Jesus on the beach; He points across
// the lake — "to the other side" — and Peter and Andrew go down to the boat and raise the sail. Then a scribe in his
// fine mantle pushes out of the crowd: "Teacher, I will follow you wherever you go", sweeping his arm out wide.
import { C, person, CAST, blinkAt, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { boat } from '../../assets/things.js';
import { capShore, SCRIBE8, mob, bubble, hungWord, hangAt, headAt, voiceRings, tr, PI, MORNING } from './lib.js';

const FEET = 742, JX = 780;

export default {
  id: 'mt8-scribe',
  beats: [
    { v: 18 },
    { v: 19, text: 'Wtem przystąpił pewien uczony w Piśmie i rzekł do Niego:' },
    { v: 19, cont: true, text: '«Nauczycielu, pójdę za Tobą, dokądkolwiek się udasz».' },
  ],
  cam: { x: [-40, 40], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const st = capShore(S, { skyCols: MORNING, sunAt: [1260, 150] });
    const c = S.c;

    /* the boat, pulled up at the water's edge on the left */
    const boatL = S.layer({ par: 0.36, sh: 4 });
    const B = boat(c, { mast: true });
    boatL.add(`<g transform="translate(330 668) scale(.8)">${B.back}</g>`);
    const rowers = [CAST.peter, CAST.andrew].map((o, i) => ({ i, p: S.puppet(boatL.add(person(c, o))) }));
    boatL.add(`<g transform="translate(330 668) scale(.8)">${B.front}</g>`);

    /* the crowd round Him (sprites) */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const CR = [[540, 712, false, 0.8], [1190, 714, true, 0.8], [680, 690, false, 0.66], [1040, 684, true, 0.62], [1350, 730, true, 0.86]].map(([x, y, flip, s], i) => ({ i, x, y, sp: crowdL.sprite(mob(makeCutter('mt8-scr' + i), i < 4 ? 4 : 3, { s, spread: 40, flip }), x, y) }));

    const P = S.layer({ par: 0.4, sh: 5 });
    const DIS = [CAST.john, CAST.james].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const scribe = S.puppet(P.add(person(c, SCRIBE8)));
    const talk = voiceRings(P, c, { n: 3, color: C.sun, r: 36, w: 5 });
    const W = S.layer({ par: 0.42, sh: 3 });
    const vow = W.add(`<g opacity="0">${bubble(c, [tr('Nauczycielu, pójdę za Tobą,', 'Teacher, I will follow you'), tr('dokądkolwiek się udasz', 'wherever you go')], { size: 21, dir: -1 })}</g>`);
    const flyL = S.layer({ par: 0.12, sh: 6 });
    const other = flyL.add(hungWord(c, tr('← na drugą stronę', '← to the other side'), { size: 24 }));

    return (t, time) => {
      const T = time;
      st.update(T);

      /* v18 — He sees the crowds all round, and gives orders to cross to the other side */
      const see = bump(t, 0.05, 0.45);
      const point = es(t, 0.35, 0.55) * (1 - es(t, 1.05, 1.3));
      jesus.set({ x: JX, y: FEET, s: 1.04, flip: t > 0.3 && t < 1.3, armF: 14 + see * 20 + point * 80, armB: 10 + see * 40, head: -see * 6 + point * -4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, FEET, 1.04, t > 0.3 && t < 1.3);
      talk(hx, hy, point, T, { dir: -1, spread: 1.8 });
      CR.forEach((g) => g.sp.set({ x: g.x + (g.i === 1 || g.i === 4 ? es(t, 1.0, 1.4) * 40 : 0), y: g.y, o: 1 }));
      const ok = es(t, 0.45, 0.7, ease.out) * (1 - es(t, 1.1, 1.3));
      hangAt(other, 620, lerp(-600, 360, ok), T, 1, 0.7);
      // Peter and Andrew go down to the boat
      rowers.forEach((r) => {
        const k = es(t, 0.5 + r.i * 0.08, 0.95 + r.i * 0.08);
        const inB = seg(t, 0.92 + r.i * 0.08, 0.98 + r.i * 0.08);
        const x = inB > 0.5 ? 330 + (r.i ? -60 : 50) * 0.8 : lerp(620 - r.i * 40, 440, k);
        const y = inB > 0.5 ? 668 - 22 : lerp(730, 700, k);
        r.p.set({ x, y, s: inB > 0.5 ? 0.78 : lerp(0.96, 0.84, k), flip: inB > 0.5 ? r.i === 0 : true, walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: inB > 0.5 ? 60 + (r.i ? 40 : 0) : 12, armB: inB > 0.5 ? 100 : 6, o: 1, blink: blinkAt(T, r.i + 4) });
      });
      DIS.forEach((d) => d.p.set({ x: 640 - d.i * 70, y: FEET + 6 + d.i * 4, s: 0.98, armF: 14 + point * 20, head: -2, blink: blinkAt(T, d.i + 2) }));

      /* v19 — a scribe comes up: "Teacher, I will follow you wherever you go" */
      const come = es(t, 1.05, 1.6);
      const sx = lerp(1320, 940, come);
      const vowK = es(t, 2.08, 2.3);
      scribe.set({ x: sx, y: FEET + 4, s: 1, flip: true, walk: come > 0 && come < 1 ? sx * 0.05 : undefined, armF: 14 + bump(t, 1.55, 2.0) * 30 + vowK * 70, armB: 10 + vowK * 110, head: -vowK * 8, lean: vowK * -4, blink: blinkAt(T, 7) });
      const vb = es(t, 2.1, 2.3, ease.back);
      pose(vow, { x: S.portrait ? sx - 150 : sx + 14, y: FEET - 196, s: vb, o: vb > 0.02 ? 1 : 0 });

      S.cam.z = 1.04 + es(t, 1.2, 1.6) * 0.04;
      S.cam.x = -20 + es(t, 1.2, 1.7) * 40;
      S.cam.y = 30;
    };
  },
};
