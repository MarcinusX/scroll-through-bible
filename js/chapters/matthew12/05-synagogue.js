// Mt 12,9–10 — the synagogue of Capernaum (the same hall as in Mark 1): Jesus comes in from the street with Peter and
// John and walks to the middle, the people on the benches turning to see Him. On the front bench a man sits holding
// his withered hand close; a soft light finds him. The Pharisees on the other bench have been watching: one stands and
// asks, "Is it lawful to heal on the Sabbath?" — a big question mark hangs over them, the Sabbath tag beside it —
// while another writes on his wax tablet, ready to accuse Him.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, WITHERED, witheredHand, phOpts, scribeOpts, waxTablet, handAt, headAt, kf, moving, question, bubble, sabbathTag, glow, tr, PI } from './lib.js';

const FEET = 742;
const JX = 800;

export default {
  id: 'mt12-synagogue',
  beats: [
    { v: 9 },
    { v: 10, text: 'A [był tam] człowiek, który miał uschłą rękę.' },
    { v: 10, cont: true, text: 'Zapytali Go, by móc Go oskarżyć: «Czy wolno uzdrawiać w szabat?»' },
  ],
  cam: { x: [-40, 150], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const I = synagogueInterior(S);
    const L = S.layer({ par: I.P, sh: 4 });
    const [, FRONT] = I.benchY;
    const folk = I.congregation(L);
    /* the man with the withered hand, on the left front bench; the Pharisees on the right one */
    const manGlow = L.add(`<g opacity="0">${glow(120, 0.9)}</g>`);
    const man = S.puppet(L.add(person(c, { ...WITHERED, pose: 'sit', holdF: witheredHand(c) })));
    const PH = [{ x: P ? 990 : 1040, o: phOpts(0) }, { x: P ? 1036 : 1120, o: { ...scribeOpts(1), holdF: `<g transform="translate(8 -4) rotate(-20)">${waxTablet(c)}</g>` } }, { x: P ? 1082 : 1200, o: phOpts(2) }]
      .map((m, i) => ({ ...m, i, seed: c.rr(0, 9), sit: S.puppet(L.add(person(c, { ...m.o, pose: 'sit' }))), stand: i === 0 ? S.puppet(L.add(person(c, m.o))) : null }));

    /* Jesus and two disciples */
    const act = S.layer({ par: 0.5, sh: 5 });
    const DIS = [{ k: 'peter', x: 400 }, { k: 'john', x: 478 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    /* the question */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const q = hanging(fx, `<g transform="scale(1.7)">${question(c)}</g>`, { x: 1080, y: -300, len: 800 });
    const tag = hanging(fx, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 900, y: -300, len: 800 });
    const say = act.add(`<g opacity="0">${bubble(c, [tr('Czy wolno uzdrawiać', 'Is it lawful to heal'), tr('w szabat?', 'on the Sabbath?')], { size: 20, tail: -1 })}</g>`);
    const writing = act.add(`<g opacity="0">${sheet().p(c.ribbon([[0, 0], [14, -3]], 1.4) + c.ribbon([[0, 6], [10, 4]], 1.4), C.ink).out()}</g>`);

    const jK = [[-0.7, 250], [0.7, JX]];
    const dK = [[-0.5, 180], [0.85, 0]];

    return (t, time) => {
      const T = time;
      I.flicker(T);
      folk.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, head: es(t, -0.2, 0.4) * (m.flip ? -4 : 4), blink: blinkAt(T, m.seed) }));

      /* v9 — He comes in */
      const jx = kf(t, jK, (u) => ease.sine(u));
      const jWalk = moving(t, jK);
      const toMan = es(t, 1.1, 1.3) * (1 - es(t, 2.1, 2.3));
      jesus.set({ x: jx, y: FEET, s: 1.06, flip: toMan > 0.5 || (t > 2.8 && false), walk: jWalk ? jx * 0.055 : undefined, armF: 10 + toMan * 30 + es(t, 2.6, 2.85) * 16, armB: 8, head: -2 + toMan * 6, blink: blinkAt(T, 2) });
      const dOff = kf(t, dK);
      DIS.forEach((d) => {
        const x = d.x - dOff * (1 + d.i * 0.2);
        d.p.set({ x, y: FEET + (d.i ? 6 : -2), s: 0.96, flip: false, walk: moving(t, dK) ? x * 0.055 + d.i : undefined, armF: 8 + es(t, 2.3, 2.5) * 16, armB: 6, head: -2 + es(t, 2.3, 2.5) * 4, blink: blinkAt(T, d.seed) });
      });

      /* v10a — the man and his withered hand */
      const shy = es(t, 1.15, 1.4) * (1 - es(t, 2.2, 2.4) * 0.6);
      man.set({ x: 610, y: FRONT, s: 0.92, flip: false, armF: 26 + shy * 38, head: 6 + shy * 6, lean: shy * 3, blink: blinkAt(T, 5) });
      const [mhx, mhy] = headAt(610, FRONT, 0.92, false, 'sit');
      pose(manGlow, { x: mhx, y: mhy + 60, o: bump(t, 1.05, 2.3) * 0.95 + es(t, 2.3, 2.6) * 0.3 });

      /* v10b — the Pharisees ask, to accuse Him */
      PH.forEach((m) => {
        const up = m.i === 0 ? es(t, 2.05, 2.12) : 0;
        const narrow = es(t, 1.4 + m.i * 0.06, 1.6 + m.i * 0.06);
        const write = m.i === 1 ? es(t, 2.3, 2.45) : 0;
        m.sit.set({ x: m.x, y: FRONT, s: 0.9, flip: true, o: 1 - up, armF: 10 + write * (50 + Math.sin(t * 40) * 6), head: narrow * -4 + write * 8, blink: Math.max(narrow * 0.5, blinkAt(T, m.seed)) });
        if (m.stand) m.stand.set({ x: m.x - 20, y: FEET - 4, s: 0.94, flip: true, o: up, armF: 30 + es(t, 2.15, 2.3) * 60, armB: es(t, 2.15, 2.3) * 40, head: -4, blink: blinkAt(T, m.seed) });
      });
      const [shx, shy2] = headAt(PH[0].x - 20, FEET - 4, 0.94, true);
      const sk = es(t, 2.2, 2.4, ease.back);
      pose(say, { x: shx - 70, y: shy2 - 34, s: sk, o: sk > 0.01 ? 1 : 0 });
      const [whx, why] = handAt(PH[1].x, FRONT, 0.9, true, 60, 'sit');
      pose(writing, { x: whx - 8, y: why - 6, o: es(t, 2.45, 2.55) });
      const qd = es(t, 2.12, 2.45, ease.back);
      pose(q, { x: P ? 1060 : 1150, y: lerp(-300, 250, qd), r: Math.sin(T * 1.1) * 1.5, oy: 0, o: qd > 0.01 ? 1 : 0 });
      const td = es(t, 0.3, 0.7, ease.back);
      pose(tag, { x: 900, y: lerp(-300, 140, td), r: Math.sin(T * 0.8) * 0.8, oy: 0, o: td > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -30], [0.7, 0], [1.1, -30], [1.9, -30], [2.2, P ? 120 : 30]]);   // phone: pans further, to the Pharisees (sitting closer together) and their question
      S.cam.z = kf(t, [[-0.5, 1.0], [0.7, 1.02], [1.1, 1.1], [1.9, 1.1], [2.2, 1.06]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.1, 40], [1.9, 40], [2.2, 30]]);
    };
  },
};
