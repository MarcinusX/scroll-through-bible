// Łk 20,29b–33 — the long flat of the seven brothers hangs over the court. "The first took a wife and died childless":
// the woman in her rose mantle comes to stand by the first brother, a little gold ring glints between them — and he is
// gone, a grey grave-stone in his place, a thin smoke curling from its snuffed candle. "The second took her", and he
// too; "then the third, and so all seven died, leaving no children": she passes along the row and one stone after
// another stands where a brother stood. "Last of all the woman died": she too becomes a stone. "In the resurrection,
// then, whose wife will she be?": light comes over the flat, the stones stand up as the seven brothers again, she in
// the middle, and a great "?" hangs over her. "For all seven had her as wife": seven red threads run from the seven to
// her, all pulling at once.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { courtSet, CQ, SADDUCEES, panel, figure, BROTHERS, BRIDE, ROW, rowInner, stele, thread, bigQuestion, sparkle, glowDisc, popAt, dropIn, kf, tr, es, ease, bump, seg } from './lib.js';

// when the woman reaches each brother, and when he dies
const MEET = [0.3, 1.25, 2.12, 2.36, 2.48, 2.6, 2.72];
const DIE = [0.62, 1.55, 2.3, 2.44, 2.56, 2.68, 2.8];

export default {
  id: 'lk20-seven',
  beats: [
    { v: 29, cont: true, text: 'Pierwszy wziął żonę i umarł bezdzietnie.' },
    { v: 30 },
    { v: 31 },
    { v: 32 },
    { v: 33, text: 'Przy zmartwychwstaniu więc którego z nich będzie żoną?' },
    { v: 33, cont: true, text: 'Wszyscy siedmiu bowiem mieli ją za żonę».' },
  ],
  cam: { x: [-20, 40], y: [-80, 20], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: SADDUCEES });
    const c = Q.c;
    const row = Q.flyL.add(panel(S, rowInner(S, c), { w: ROW.W, h: ROW.H, word: tr('siedmiu braci', 'seven brothers') }));
    const light = Q.flyL.add(`<g opacity="0">${glowDisc(240, 'halo-glow', 1)}</g>`);
    const bros = BROTHERS.map((o, i) => ({
      i, x: ROW.X + (i - 3) * ROW.DX,
      el: Q.flyL.add(`<g>${figure(c, o, { s: ROW.S, flip: i > 3, head: i === 3 ? 0 : (i < 3 ? 4 : -4) })}</g>`),
      up: Q.flyL.add(`<g opacity="0">${figure(c, o, { s: ROW.S, flip: i > 3, armF: 70, head: i < 3 ? 6 : -6 })}</g>`),
      st: Q.flyL.add(`<g opacity="0">${stele(c, 64)}</g>`),
    }));
    const threads = BROTHERS.map(() => Q.flyL.add(`<g opacity="0">${thread(c)}</g>`));
    const bride = Q.flyL.add(`<g>${figure(c, BRIDE, { s: ROW.S * 0.96, armF: 30 })}</g>`);
    const brideSt = Q.flyL.add(`<g opacity="0">${stele(c, 56, '#c4b8aa')}</g>`);
    const rings = [0, 1].map(() => Q.flyL.add(`<g opacity="0">${sparkle(c, 9)}</g>`));
    const q = Q.flyL.add(`<g opacity="0">${bigQuestion(c, 40, C.terracotta)}</g>`);

    return (t, time) => {
      const T = time;
      const Y = ROW.Y + ROW.FEET;
      pose(row, { x: ROW.X, y: ROW.Y, r: 0 });
      const rise = es(t, 4.1, 4.4);
      pose(light, { x: ROW.X, y: ROW.Y, s: 0.8 + rise * 0.4, o: rise * 0.85 * (1 - es(t, 5.9, 6)) });
      /* the woman walks along the row */
      const keys = [[0.05, ROW.X - ROW.W / 2 - 40]];
      MEET.forEach((m, i) => keys.push([m, bros[i].x + 38], [i < 6 ? Math.min(DIE[i] + 0.08, MEET[i + 1] - 0.08) : 9, bros[i].x + 38]));
      let bx = kf(t, keys);
      const center = es(t, 4.1, 4.3);
      bx = lerp(bx, ROW.X, center);
      const dead = es(t, 3.2, 3.45) * (1 - seg(t, 4.1, 4.15));
      pose(bride, { x: bx, y: Y + (center > 0 ? 8 * center : 0), o: 1 - dead });
      pose(brideSt, { x: bx, y: Y, o: dead });
      /* each brother: meets her, a ring, then the stone; all rise again */
      bros.forEach((b) => {
        const d = seg(t, DIE[b.i], DIE[b.i] + 0.06) * (1 - seg(t, 4.1 + b.i * 0.03, 4.16 + b.i * 0.03));
        const up = seg(t, 4.1 + b.i * 0.03, 4.16 + b.i * 0.03);
        pose(b.el, { x: b.x, y: Y, o: (1 - d) * (1 - up) });
        pose(b.st, { x: b.x, y: Y, o: d });
        pose(b.up, { x: b.x, y: Y, o: up });
        // the thread from him to her
        const k = es(t, 5.05 + b.i * 0.05, 5.25 + b.i * 0.05);
        const hx = b.x + (b.i > 3 ? -24 : 24), hy = Y - 60;
        const tx = ROW.X, ty = Y - 50;
        const len = Math.hypot(tx - hx, ty - hy), a = Math.atan2(ty - hy, tx - hx) * 180 / Math.PI;
        pose(threads[b.i], { x: hx, y: hy, r: a, sx: Math.max(0.01, len / 100 * k), s: 1, o: b.i === 3 ? 0 : k > 0.01 ? 1 : 0 });
      });
      rings.forEach((el, i) => {
        const m = [MEET[0], MEET[1]][i];
        const k = bump(t, m + 0.05, m + 0.3);
        pose(el, { x: bros[i].x + 20, y: Y - 70, s: 0.6 + k * 0.6, r: k * 60, o: k > 0.02 ? 1 : 0 });
      });
      popAt(q, t, 4.35, undefined, ROW.X, ROW.Y - 60 + (T ? Math.sin(T * 1.5) * 3 : 0), { d: 0.12 });

      Q.pose(t, T,
        { armF: 16, armB: 8, head: -6, blink: blinkAt(T, 2) },
        (d) => ({ head: -10, blink: blinkAt(T, d.seed) }),
        (m) => ({ armF: 8 + (m.i === 1 ? 40 + bump(t, 4.1, 4.9) * 40 : 0), armB: 4 + (m.i === 1 ? bump(t, 5.1, 5.9) * 90 : 0), head: -8 + (m.i === 0 ? bump(t, 5.1, 5.9) * 10 : 0), blink: blinkAt(T, m.seed) }));
      Q.amaze(0);

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -60], [5.5, -60]]);
      S.cam.z = 1.02;
      void ease; void dropIn; void lerp; void CQ;
    };
  },
};
