// Łk 20,1–2 — the curtains open on the Temple court in the bright forenoon: Jesus on the low step in the middle, Peter
// and John beside Him, the people all round. "One day, as He was teaching the people in the Temple and preaching the
// Good News": little slips of His words fly out to the people, who lean in, and a gold word hangs over Him — when the
// chief priest, a scribe and an elder come walking up across the court and plant themselves on the right. "Tell us, by
// what authority do You do these things, or who gave You this authority?": the chief priest lifts his own sealed
// scroll high — his authority, stamped in red wax — and points at Jesus; over Jesus an empty seal drops on its string,
// a "?" in the middle where the stamp should be.
import { C, blinkAt, pose, lerp, curtains } from '../kit.js';
import { courtSet, CQ, LEADERS, priest, waxSeal, sealedScroll, goldWord, bubble, sparkle, popAt, dropIn, oppHead, kf, tr, es, ease, bump, seg, PI } from './lib.js';
import { wordSlip } from '../mark2/lib.js';

const F = CQ.FEET;

export default {
  id: 'lk20-teach',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-20, 40], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: [(c) => priest(c, 1, { holdB: `<g transform="rotate(-60) translate(4 -2)">${sealedScroll(c, 50)}</g>` }), LEADERS[1], LEADERS[2]] });
    const c = Q.c;
    const news = Q.flyL.add(`<g>${goldWord(c, tr('Dobra Nowina', 'the Good News'), { size: 24 })}</g>`);
    const slips = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: Q.W.add(`<g opacity="0">${wordSlip(c, 30)}</g>`) }));
    const sparks = [0, 1, 2].map(() => Q.W.add(`<g opacity="0">${sparkle(c, 9)}</g>`));
    const full = Q.flyL.add(`<g><path d="M0 -1600V-46" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${waxSeal(c, 34)}</g>`);
    const empty = Q.flyL.add(`<g><path d="M0 -1600V-46" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${waxSeal(c, 40, { blank: true })}</g>`);
    const ask = Q.W.add(`<g opacity="0">${bubble(c, [tr('Jakim prawem', 'By what authority'), tr('to czynisz?', 'do You do these things?')], { size: 18, tail: 1 })}</g>`);
    const cur = curtains(S);
    const walk = [[1.3, 1560], [1.72, 0]];

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      /* v1 — He teaches and preaches the Good News; the leaders come up */
      const teach = es(t, 0.6, 0.9) * (1 - es(t, 2.05, 2.2) * 0.6);
      const gest = T ? Math.sin(T * 1.3) * 6 : 0;
      const inK = es(t, 1.3, 1.72);
      const walking = inK > 0 && inK < 1;
      const lift = es(t, 2.05, 2.3, ease.back);
      const point = es(t, 2.3, 2.45);
      Q.pose(t, T,
        { armF: 16 + teach * (54 + gest), armB: 8 + teach * 28, head: -2 + es(t, 1.6, 1.8) * 3, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - es(t, 1.6, 1.8) * 4, blink: blinkAt(T, d.seed) }),
        (m) => {
          const x = m.x + (1 - inK) * (560 + m.i * 60);
          const o = {
            x, walk: walking ? x * 0.05 + m.i : undefined, head: m.i === 0 ? -lift * 6 : es(t, 2.1, 2.3) * -4, blink: blinkAt(T, m.seed),
            armB: 4 + (m.i === 0 ? lift * 150 : 0), armF: 8 + (m.i === 0 ? point * 84 : m.i === 2 ? es(t, 2.2, 2.4) * 40 : 0), lean: m.i === 0 ? -lift * 4 : 0,
          };
          return o;
        });
      Q.amaze(bump(t, 1.05, 1.5) * 0.9, bump(t, 1.05, 1.5) * 0.9 * (1 - inK));
      const nk = dropIn(news, t, 0.95, 2.1, CQ.JX, 312, { T, d: 0.25 });
      void nk;
      slips.forEach((s) => {
        const a = 0.9 + s.i * 0.06, u = seg(t, a, a + 0.36);
        const dir = s.i % 2 ? 1 : -1;
        const x = CQ.JX + dir * (40 + u * (280 + (s.i % 3) * 50));
        const y = F - 150 - Math.sin(u * PI) * (60 + (s.i % 3) * 20) + u * 40;
        pose(s.el, { x, y, r: dir * u * 30, o: u > 0 && u < 1 ? 1 : 0 });
      });
      sparks.forEach((el, i) => popAt(el, t, 1.2 + i * 0.1, 1.6 + i * 0.1, [470, 380, 520][i], [520, 560, 580][i]));
      /* v2 — "by what authority?": his sealed scroll high; the empty seal over Jesus */
      const [hx, hy] = oppHead(0);
      popAt(ask, t, 2.18, undefined, hx - 30, hy - 30, { d: 0.12 });
      dropIn(full, t, 2.12, undefined, 1075, 370, { T, d: 0.25 });
      dropIn(empty, t, 2.38, undefined, CQ.JX, 330, { T, d: 0.28 });

      S.cam.x = kf(t, [[0, 0], [1.2, 0], [1.8, 20], [2.2, 30]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 20], [2.2, -10]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [2.2, 1.04]]);
      void walk; void lerp; void C;
    };
  },
};
