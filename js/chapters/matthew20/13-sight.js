// Mt 20,32–34 — Jesus stands still: "Call them!" — and the two blind men get up from their cloaks and come, hands
// feeling the air. "What do you want me to do for you?" — "Lord, that our eyes may be opened." Moved with compassion
// (a warm heart glows in him), he touches their eyes; light bursts at their eyes, they open, and they lift their hands
// to the colour and the sun. Then they walk on after him up the road towards Jerusalem, with all the crowd.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { jerichoSet, JR, TWELVE, BLIND2, say, spark, heartGlow, rays, headAt, handAt, mob, makeCutter, tr, bush, rock, grass } from './lib.js';

const JX = 700;
const COME = [[806, 690], [872, 700]];

export default {
  id: 'mt20-sight',
  beats: [
    { v: 32, text: 'Jezus przystanął, kazał ich przywołać' },
    { v: 32, cont: true, text: 'i zapytał: «Cóż chcecie, żebym wam uczynił?»' },
    { v: 33 },
    { v: 34, text: 'Jezus więc zdjęty litością dotknął ich oczu,' },
    { v: 34, cont: true, text: 'a natychmiast przejrzeli i poszli za Nim.' },
  ],
  cam: { x: [-60, 120], y: [-20, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const J = jerichoSet(S);
    const G = JR.G;
    const crowdL = S.layer({ par: 0.5, sh: 4 });
    const CROWD = [[0, 8, 0.66, -150], [1, 7, 0.7, -330], [2, 8, 0.64, -500]].map(([i, n, s, dx]) => ({ i, dx, sp: crowdL.sprite(mob(makeCutter('mt20-jer-crowd' + i), n, { s, spread: 40, rows: 2, arms: 12 }), JX + dx - 60, JR.G - 30 - i * 10) }));
    const P = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 3, 1, 2, 6, 7].map((k, i) => ({ i, p: S.puppet(P.add(person(c, TWELVE[k].o))), dx: -80 - i * 44, dy: (i % 2) * 16 - 8, seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const blind = BLIND2.map((o, i) => ({
      i, at: JR.B[i], to: COME[i], seed: c.rr(0, 9),
      sit: S.puppet(P.add(person(c, { ...o, pose: 'sit', eyes: 'closed' }))),
      stand: S.puppet(P.add(person(c, { ...o, eyes: 'closed' }))),
      see: S.puppet(P.add(person(c, { ...o }))),
    }));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const callB = fx.add(`<g>${say(c, tr('Zawołajcie ich!', 'Call them!'), { size: 19, side: 1 })}</g>`);
    const what = fx.add(`<g>${say(c, tr(['Cóż chcecie,', 'żebym wam uczynił?'], ['What do you want', 'me to do for you?']), { size: 19, side: 1 })}</g>`);
    const eyes = fx.add(`<g>${say(c, tr(['Panie, żeby się oczy', 'nasze otworzyły!'], ['Lord, that our eyes', 'may be opened!']), { size: 19, side: -1 })}</g>`);
    const heart = fx.add(`<g>${heartGlow(c, 16)}</g>`);
    const sparks = blind.map(() => fx.add(`<g>${spark(c, 12)}</g>`));
    const bursts = blind.map(() => fx.add(`<g>${rays(c, { n: 14, r0: 16, r1: 170, spread: 0.07, color: '#fff3cf' })}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 160, 1000, 230, C.olive, C.moss) + rock(c, 1440, 990, 200, 66, C.rock2) + grass(c, { x0: -300, x1: 1900, y: 980, n: 16, h: 30, color: C.olive }));

    return (t, time) => {
      const T = time;
      J.R.update(t, T, { sunY: 20 + es(t, 0, 5) * 10 });
      const follow = es(t, 4.12, 4.62, (u) => u);
      const fb = es(t, 4.42, 5.25, (u) => u);
      const jx = JX + follow * 330;
      const call = es(t, 0.05, 0.2) * (1 - es(t, 0.85, 1.0));
      const ask = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.05));
      const touch = es(t, 3.1, 3.35) * (1 - es(t, 4.1, 4.25));
      jesus.set({ x: jx, y: G, s: 1.02, walk: follow > 0 && follow < 1 ? jx * 0.06 : undefined, armF: 14 + call * 60 + ask * 50 + touch * 88, armB: call * 110 + ask * 20, head: -touch * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = JX + d.dx + fb * 200;
        d.p.set({ x, y: G + d.dy, s: 0.86, walk: fb > 0 && fb < 1 ? x * 0.06 + d.i : undefined, head: -es(t, 4.1, 4.3) * 6, armF: es(t, 4.05, 4.2) * (d.i % 2 ? 90 : 30), blink: blinkAt(T, d.seed) });
      });
      CROWD.forEach((m) => m.sp.set({ x: JX + m.dx - 60 + fb * (200 - m.i * 20), y: G - 30 - m.i * 10, s: 1, o: 1 }));

      /* the blind men: up (0), come feeling the air (0), answer (2), healed (4), follow */
      const upK = es(t, 0.3, 0.36);
      const saw = es(t, 4.04, 4.1);
      blind.forEach((b) => {
        const come = es(t, 0.4 + b.i * 0.05, 0.9 + b.i * 0.05, (u) => u);
        const x = lerp(b.at[0], b.to[0], come) + fb * 150;
        const y = lerp(b.at[1] - 6, b.to[1], come);
        const plead = es(t, 2.04, 2.2) * (1 - es(t, 2.9, 3.05));
        b.sit.set({ x: b.at[0], y: b.at[1], s: 0.92, flip: true, o: 1 - upK, armF: 40 + call * 40, head: -8 - call * 6, blink: 0 });
        b.stand.set({ x, y, s: 0.94, flip: true, o: upK * (1 - saw), walk: come > 0 && come < 1 ? x * 0.05 + b.i : undefined, armF: 70 + plead * 30, armB: 20 + plead * (b.i ? 60 : 110), head: -6 - plead * 6 + es(t, 3.1, 3.3) * 10, blink: 0 });
        const joy = es(t, 4.1, 4.3);
        b.see.set({ x, y, s: 0.94, flip: fb < 0.02, o: saw, walk: fb > 0 && fb < 1 ? x * 0.06 + b.i : undefined, armF: 30 + joy * 90 * (1 - fb * 0.5), armB: joy * 150 * (1 - fb * 0.4), head: -joy * 12, blink: blinkAt(T, b.seed) });
        const [hx, hy] = headAt(x, y, 0.94, true);
        const sk = bump(t, 3.2 + b.i * 0.1, 4.1);
        pose(sparks[b.i], { x: hx - 8, y: hy - 3, s: 0.6 + sk * 0.6, r: T * 40, o: sk });
        const bk = bump(t, 4.05, 4.6);
        pose(bursts[b.i], { x: hx - 6, y: hy, s: 0.4 + es(t, 4.05, 4.5) * 1.0, r: t * 20, o: bk });
      });
      pose(callB, { x: JX + 20, y: G - 226, s: es(t, 0.05, 0.2, ease.back), o: t > 0.05 && t < 1 ? 1 - es(t, 0.88, 1) : 0 });
      pose(what, { x: JX + 20, y: G - 226, s: es(t, 1.05, 1.2, ease.back), o: t > 1.05 && t < 2 ? 1 - es(t, 1.88, 2) : 0 });
      pose(eyes, { x: COME[1][0] + 10, y: G - 196, s: es(t, 2.05, 2.2, ease.back), o: t > 2.05 && t < 3 ? 1 - es(t, 2.88, 3) : 0 });
      const [jhx, jhy] = headAt(jx, G, 1.02, false);
      pose(heart, { x: jhx + 4, y: jhy + 70, s: es(t, 3.05, 3.25, ease.back), o: t > 3.05 ? 1 - es(t, 4.1, 4.3) : 0 });

      S.cam.x = 70 + es(t, 2.9, 3.3) * 10 + follow * 50;
      S.cam.z = 1.04 + es(t, 2.9, 3.3) * 0.06 * (1 - es(t, 4.1, 4.6));
      S.cam.y = 10;
    };
  },
};
