// Łk 20,27–29a — "Then some of the Sadducees came to Him, who say that there is no resurrection": three priestly men
// in white linen and deep blue walk across the court, and over them a thought — a tomb with its stone rolled shut and
// crossed out: no one comes out. "Teacher, Moses wrote for us: if a man's brother dies, having a wife but no children,
// his brother must take the widow and raise up offspring for his brother": a painted panel comes down, the Law of
// Moses — a grave, the widow in grey beside it, the brother giving her his hand, and a cradle appearing between them.
// "Now there were seven brothers": the panel goes up and a long flat comes down, a street of houses, and on it seven
// brothers standing in a row.
import { C, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { courtSet, CQ, SADDUCEES, panel, panelSky, panelGround, figure, BROTHERS, WIDOW, ROW, rowInner, stele, tombIcon, crossX, thought, popAt, dropIn, oppHead, kf, tr, es, ease, bump, seg } from './lib.js';

const PW = 340, PH = 190;

function lawInner(S, c) {
  let m = panelSky(S, PW, PH, ['#dcd8cc', '#f2e4c8']);
  m += sheet().p(c.cut([[-PW / 2 - 10, 10], [-40, -4], [80, 8], [PW / 2 + 10, -6], [PW / 2 + 10, 60], [-PW / 2 - 10, 60]], 0.8, 10), mix(C.hillMid, C.sand, 0.3)).out();
  m += panelGround(c, PW, 64, mix(C.sand, C.dune, 0.3), 2);
  m += `<g transform="translate(-110 70)">${stele(c, 64)}</g>`;
  m += figure(c, WIDOW, { x: -40, y: 76, s: 0.5, head: 8, armF: 50 });
  m += figure(c, BROTHERS[1], { x: 70, y: 76, s: 0.52, flip: true, armF: 70, head: -4 });
  return m;
}
function cradle(c) {
  const s = sheet();
  s.p(c.cut([[-24, -16], [24, -16], [18, 0], [-18, 0]], 0.4, 5), C.wood);
  s.p(c.ribbon(c.arc(0, 4, 26, 8, PI_, 2 * PI_, 8), 3), C.wood2);
  s.p(c.cut(c.ell(-4, -18, 16, 6, 12), 0.3, 3), C.linen);
  s.p(c.cut(c.circ(12, -20, 6, 10), 0.2, 3), C.skin);
  return s.out();
}
const PI_ = Math.PI;

export default {
  id: 'lk20-sadducees',
  beats: [
    { v: 27 },
    { v: 28 },
    { v: 29, text: 'Otóż było siedmiu braci.' },
  ],
  cam: { x: [-20, 80], y: [-70, 40], z: [1, 1.12] },
  build(S) {
    const Q = courtSet(S, { opp: SADDUCEES });
    const c = Q.c;
    const tomb = `<g transform="translate(0 4)">${tombIcon(c)}</g><g transform="translate(0 0)">${crossX(c, 26)}</g>`;
    const noRes = Q.W.add(`<g opacity="0">${thought(c, tomb, { w: 96, h: 76 })}</g>`);
    const law = Q.flyL.add(panel(S, lawInner(S, c), { w: PW, h: PH, word: tr('Mojżesz napisał', 'Moses wrote') }));
    const crad = Q.flyL.add(`<g>${cradle(c)}</g>`);
    const row = Q.flyL.add(panel(S, rowInner(S, c), { w: ROW.W, h: ROW.H, word: tr('siedmiu braci', 'seven brothers') }));
    const bros = BROTHERS.map((o, i) => ({ i, el: Q.flyL.add(`<g>${figure(c, o, { s: ROW.S, flip: i > 3, head: i === 3 ? 0 : (i < 3 ? 4 : -4) })}</g>`) }));

    return (t, time) => {
      const T = time;
      /* v27 — the Sadducees come */
      const walk = es(t, 0.05, 0.45);
      const [hx, hy] = oppHead(1);
      popAt(noRes, t, 0.5, 1.2, hx, hy - 16, { d: 0.12 });
      /* v28 — the law of the brother-in-law */
      const lk = dropIn(law, t, 1.05, 2.1, CQ.JX, 290, { d: 0.25 });
      const ly = lerp(-1500, 290, lk);
      const ck = es(t, 1.45, 1.6, ease.back);
      pose(crad, { x: CQ.JX + 14, y: ly + 76, s: Math.max(0.001, ck), o: ck > 0.01 && lk > 0.98 ? 1 : 0 });
      /* v29a — seven brothers */
      const rk = dropIn(row, t, 2.1, undefined, ROW.X, ROW.Y, { d: 0.3 });
      const ry = lerp(-1500, ROW.Y, rk);
      bros.forEach((b) => pose(b.el, { x: ROW.X + (b.i - 3) * ROW.DX, y: ry + ROW.FEET, o: rk > 0.002 ? 1 : 0 }));
      Q.pose(t, T,
        { armF: 16 + es(t, 1.0, 1.2) * 10, armB: 8, head: -bump(t, 1.1, 2.9) * 6, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - bump(t, 1.1, 2.9) * 8, blink: blinkAt(T, d.seed) }),
        (m) => {
          const x = lerp(m.x + 360 + m.i * 40, m.x, walk);
          return { x, walk: walk > 0 && walk < 1 ? x * 0.05 + m.i : undefined, armF: 8 + (m.i === 1 ? bump(t, 1.05, 1.9) * 60 + bump(t, 2.05, 2.6) * 70 : 0), armB: 4 + (m.i === 1 ? bump(t, 2.05, 2.6) * 40 : 0), head: -bump(t, 1.2, 2.9) * 8, lean: m.i === 1 ? -bump(t, 1.05, 1.9) * 3 : 0, blink: blinkAt(T, m.seed) };
        });
      Q.amaze(0);
      void C; void seg;

      S.cam.x = kf(t, [[0, 60], [0.5, 50], [1.0, 20], [2.0, 10], [2.3, 0]]);
      S.cam.y = kf(t, [[0, 0], [1.0, 0], [1.3, -40], [2.0, -40], [2.4, -60]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [2.3, 1.02]]);
    };
  },
};
