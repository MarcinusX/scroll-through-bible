// Łk 20,7–9a — "So they answered that they did not know where it came from": John's medallion goes back up; the three
// turn round to Him and spread their hands, a little "?" over each head. "Then Jesus said to them: Neither will I tell
// you by what authority I do these things": over Him a scroll comes down rolled and bound with a cord, a gold seal on
// the knot — the answer stays sealed — and they hang their heads. "And He began to tell the people this parable":
// the sealed scroll rises, He turns to the people on the left, who lean in, and a painted tag with a bunch of grapes
// comes down on its string.
import { C, blinkAt, pose, lerp, sheet } from '../kit.js';
import { courtSet, CQ, johnMedal, label, question, waxSeal, grapeBunch, popAt, dropIn, oppHead, kf, tr, es, ease, bump, seg, PI } from './lib.js';

/** a scroll rolled up and bound with a cord, a gold seal on the knot (origin centre) */
function boundScroll(c) {
  const s = sheet();
  s.p(c.cut([[-70, -18], [70, -18], [70, 18], [-70, 18]], 0.4, 6), C.parchment);
  s.p(c.cut(c.ell(-72, 0, 8, 22, 12), 0.3, 4) + c.cut(c.ell(72, 0, 8, 22, 12), 0.3, 4), C.wood2);
  s.x(c.ribbon([[-60, -6], [60, -7]], 1.2) + c.ribbon([[-60, 6], [60, 5]], 1.2), C.parchment, 'opacity=".6"');
  s.p(c.ribbon([[-8, -20], [-10, 20]], 4) + c.ribbon([[8, -20], [10, 20]], 4) + c.ribbon([[0, 18], [-14, 40]], 3) + c.ribbon([[0, 18], [12, 42]], 3), C.rope);
  return s.out() + `<g transform="translate(0 16) scale(.5)">${waxSeal(c, 36).replace(new RegExp(C.terracotta, 'g'), C.sun)}</g>`;
}

export default {
  id: 'lk20-unknown',
  beats: [
    { v: 7 },
    { v: 8 },
    { v: 9, text: 'I zaczął mówić do ludu tę przypowieść:' },
  ],
  cam: { x: [-60, 60], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const Q = courtSet(S);
    const c = Q.c;
    const medal = Q.flyL.add(`<g><path d="M0 -1600V-56" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${johnMedal(c, S.id('jm'), 50)}<g transform="translate(0 78)">${label(c, tr('prorok', 'a prophet'), { size: 18 })}</g></g>`);
    const qs = [0, 1, 2].map(() => Q.W.add(`<g opacity="0">${question(c)}</g>`));
    const sealed = Q.flyL.add(`<g><path d="M-40 -1600V-18M40 -1600V-18" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${boundScroll(c)}</g>`);
    const tag = Q.flyL.add(`<g><path d="M0 -1600V-4" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${sheet().p(c.cut([[-76, 0], [76, -2], [80, 74], [-78, 76]], 0.5, 6), C.cream).p(c.cut([[-68, 8], [68, 6], [72, 68], [-70, 68]], 0.3, 6), C.parchment).out()}<g transform="translate(-40 18) scale(1.5)">${grapeBunch(c, 4.4)}</g><path d="${c.ribbon(c.qbez([-64, 22], [-36, 4], [-12, 20], 8), 2.4)}" fill="${C.moss}"/><g transform="translate(22 44)">${label(c, tr('przypowieść', 'a parable'), { size: 17, fill: C.parchment })}</g></g>`);

    return (t, time) => {
      const T = time;
      /* v7 — "we don't know" */
      const back = es(t, 0.05, 0.25);
      const shrug = es(t, 0.25, 0.45) * (1 - es(t, 1.2, 1.4) * 0.6);
      const down = es(t, 1.4, 1.6);
      const up = es(t, 0.05, 0.4, ease.in);
      pose(medal, { x: S.portrait ? 590 : 520, y: lerp(350, -1500, up), r: T ? Math.sin(T * 0.9) * 1.2 : 0, o: up < 0.999 ? 1 : 0 });
      qs.forEach((el, i) => { const [hx, hy] = oppHead(i); popAt(el, t, 0.35 + i * 0.07, 2.2, hx + (i - 1) * 6, hy - 44 + (T ? Math.sin(T * 1.7 + i) * 3 : 0), { d: 0.1 }); });
      /* v8 — the answer stays sealed */
      const sk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.05, 2.35, ease.in));
      pose(sealed, { x: CQ.JX, y: lerp(-1500, 330, sk), r: T ? Math.sin(T * 0.8) * 0.8 * sk : 0, o: sk > 0.002 ? 1 : 0 });
      /* v9a — He turns to the people; a parable */
      const turn = es(t, 2.05, 2.2);
      const speak = es(t, 2.15, 2.35);
      dropIn(tag, t, 2.3, undefined, 610, 330, { T, d: 0.3 });
      Q.pose(t, T,
        { flip: turn > 0.5, armF: 16 + bump(t, 1.05, 1.9) * 40 + speak * 56, armB: 8 + speak * 30, head: -2 + bump(t, 1.1, 1.9) * 4 - speak * 4, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - speak * 6, blink: blinkAt(T, d.seed) }),
        (m) => ({
          x: m.x + (1 - back) * [36, 4, -30][m.i] + turn * 16,
          flip: m.i === 0 ? back > 0.5 : true,
          head: (1 - back) * [12, 10, 8][m.i] - shrug * 10 + down * 18,
          lean: -shrug * 5 + down * 5,
          armF: 8 + shrug * 44, armB: 4 + shrug * 58, blink: blinkAt(T, m.seed),
        }));
      Q.amaze(es(t, 2.2, 2.4) * 0.9, es(t, 2.3, 2.5) * 0.5);

      S.cam.x = kf(t, [[0, 40], [0.5, 50], [1.1, 20], [2.1, 10], [2.5, -20]]);
      S.cam.y = kf(t, [[0, -20], [1.1, -30], [2.5, -10]]);
      S.cam.z = kf(t, [[0, 1.06], [1.1, 1.04], [2.5, 1.06]]);
      void seg; void PI;
    };
  },
};
