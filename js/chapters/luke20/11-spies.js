// Łk 20,20–22 — "So they watched Him and sent spies": the chief priest and the scribe stand at the far right of the
// court, peering round at Him, and send three men across the court to Him. "They pretended to be righteous, to catch
// Him in His words so as to hand Him over to the power and authority of the governor": the three fold their hands and
// lift pious faces — but the last hides a net behind his back, and over them a panel comes down: the Roman governor
// on his judgement seat between the eagles. "Teacher, we know that You speak and teach rightly, and show no partiality,
// but truly teach the way of God": they bow low, sweet words, and a golden path unrolls behind Him back to the
// sanctuary. "Is it lawful for us to pay taxes to Caesar, or not?": the trap — and a net comes down from the flies and
// hangs over His head.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { courtSet, CQ, SPY, LEADERS, panel, governorInner, goldPath, snare, bubble, popAt, dropIn, oppHead, kf, tr, es, ease, bump, seg } from './lib.js';

const PW = 260, PH = 170;

export default {
  id: 'lk20-spies',
  beats: [
    { v: 20, text: 'Śledzili Go więc i nasłali na Niego szpiegów.' },
    { v: 20, cont: true, text: 'Ci udawali pobożnych i mieli podchwycić Go w mowie, aby Go wydać zwierzchności i władzy namiestnika.' },
    { v: 21 },
    { v: 22 },
  ],
  cam: { x: [-20, 90], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const netB = (c) => `<g transform="translate(-6 -8) rotate(20) scale(.34)">${snare(c, 150, 110).replace(/<path d="M0 -1400V0"[^>]*\/>/, '')}</g>`;
    const Q = courtSet(S, { opp: [SPY[0], SPY[1], { ...SPY[2], holdB: '' }] });
    const c = Q.c;
    const netEl = Q.act.add(`<g>${netB(c)}</g>`);
    const lead = [0, 1].map((i) => ({ i, p: S.puppet(Q.act.add(LEADERS[i](c))), x: [1330, 1400][i], seed: c.rr(0, 9) }));
    const pathEl = Q.rayFx.add(`<g opacity="0">${goldPath(c, 0, 130, 150, 40)}</g>`);
    const gov = Q.flyL.add(panel(S, governorInner(S, c, PW, PH), { w: PW, h: PH, word: tr('namiestnik', 'the governor') }));
    const sweet = Q.W.add(`<g opacity="0">${bubble(c, [tr('Nauczycielu, wiemy,', 'Teacher, we know'), tr('że słusznie mówisz…', 'that You say what is right…')], { size: 17, tail: -1 })}</g>`);
    const trap = Q.W.add(`<g opacity="0">${bubble(c, [tr('Płacić podatek Cezarowi', 'Pay taxes to Caesar,'), tr('czy nie?', 'or not?')], { size: 18, tail: -1 })}</g>`);
    const net = Q.flyL.add(`<g>${snare(c, 170, 120)}</g>`);

    return (t, time) => {
      const T = time;
      /* v20a — watched; the spies sent across */
      const peek = es(t, 0.05, 0.25);
      const send = bump(t, 0.2, 0.6);
      const walk = es(t, 0.3, 0.75);
      lead.forEach((l) => l.p.set({ x: l.x + (1 - peek) * 200, y: CQ.FEET + l.i * 8, s: 0.96, flip: true, walk: peek > 0 && peek < 1 ? l.x * 0.05 : undefined, armF: 10 + send * (l.i ? 30 : 80), armB: 6, head: -4 + l.i * 6, lean: -peek * 6, blink: blinkAt(T, l.seed), o: 1 - es(t, 1.9, 2.1) }));
      /* v20b — pious faces, the hidden net; the governor */
      const pious = es(t, 1.05, 1.25);
      const bow = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const ask = es(t, 3.05, 3.2);
      Q.pose(t, T,
        { armF: 16, armB: 8, head: bump(t, 2.1, 2.9) * -4 + ask * 4, blink: blinkAt(T, 2) },
        (d) => ({ head: -4, blink: blinkAt(T, d.seed) }),
        (m) => {
          const x = lerp(m.x + 330 + m.i * 40, m.x, walk);
          return {
            x, walk: walk > 0 && walk < 1 ? x * 0.05 + m.i : undefined, o: 1,
            armF: 8 + pious * 62 * (1 - ask) + ask * (m.i === 0 ? 70 : 20), armB: 4 + pious * (m.i === 2 ? 20 : 66) * (1 - ask),
            head: -pious * 10 * (1 - bow) + bow * 18 - ask * 4, lean: -bow * 16, blink: blinkAt(T, m.seed),
          };
        });
      const s2 = Q.phs[2];
      const x2 = lerp(s2.x + 330 + 80, s2.x, walk);
      pose(netEl, { x: x2 + 16 + bow * 20, y: CQ.FEET - 4 - 70, r: -bow * 10, o: es(t, 1.2, 1.35) });
      dropIn(gov, t, 1.2, 2.1, 1030, 320, { d: 0.25 });
      /* v21 — flattery; the way of God */
      const [hx, hy] = oppHead(0);
      popAt(sweet, t, 2.1, 3.0, hx - 20, hy - 20, { d: 0.1 });
      pose(pathEl, { x: CQ.JX, y: CQ.FEET - 14, sy: Math.max(0.01, es(t, 2.3, 2.6)), o: es(t, 2.25, 2.35) * (1 - es(t, 3.0, 3.2)) });
      /* v22 — the question; the net over Him */
      popAt(trap, t, 3.12, undefined, hx - 20, hy - 20, { d: 0.1 });
      dropIn(net, t, 3.25, undefined, CQ.JX, 250, { T, d: 0.3 });
      Q.amaze(0, 0);
      Q.CROWD.forEach((g, i) => { if (i) { const dx = (1 - peek) * 0 + 90; g.calm.set({ x: g.x + dx, o: g.calm.o }); g.wow.set({ x: g.x + dx, o: 0 }); } });

      S.cam.x = kf(t, [[0, 80], [0.8, 60], [1.2, 40], [2.0, 30], [3.0, 20]]);
      S.cam.y = kf(t, [[0, 0], [1.0, 0], [1.3, -30], [2.0, -10], [3.2, -30]]);
      S.cam.z = kf(t, [[0, 1.06], [3.0, 1.06]]);
      void seg; void ease; void person; void C;
    };
  },
};
