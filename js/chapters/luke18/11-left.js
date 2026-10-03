// Łk 18,28–30 — the same wayside. "Peter said, 'Look, we have left everything, and followed you'": Peter steps out
// from the others, a hand on his heart, and over him a round plate comes down with what he left — his boat drawn up
// on the shore of the lake, the nets, his house in Capernaum. "There is no one who has left house, or wife, or
// brothers, or parents, or children, for God's Kingdom's sake": five picture cards come down in a row, one of each.
// "Who will not receive many times more in this time": each card turns over, and there are many — a whole village of
// houses, rows of brothers and sisters, mothers and fathers, a flock of children. "And in the world to come, eternal
// life": over them all the ring without end draws itself in gold across the sky.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  waySet, WY, DIS, disciples, iconCard, leftIcons, peterMemory, plate, eternityRing, drawRing, halo, words, headAt, kf, es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY } = WY;
const JX = 800;
const DK = ['andrew', 'james', 'john', 'philip', 'bartholomew', 'matthew'];
const CXs = (i) => 590 + i * 105;

export default {
  id: 'lk18-left',
  beats: [
    { v: 28 },
    { v: 29 },
    { v: 30, text: 'nie otrzymał daleko więcej w tym czasie,' },
    { v: 30, cont: true, text: 'a w wieku przyszłym - życia wiecznego».' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const P = S.portrait;   // phone: both knots of listeners come in from the edges
    const W = waySet(S, { jesus: false, groups: [{ k: 'r', x: P ? 995 : 1080, y: GY + 6, n: 6, flip: true, s: 0.86, seed: 'lk18-pray-r' }] });
    const c = S.c;
    W.crowdL.sprite(disciples(c, DK, { s: 0.86, spread: 46, rows: 2 }), P ? 500 : 470, GY + 4);
    const A = W.act;
    const peter = S.puppet(A.add(person(c, DIS.peter)));
    const J = S.puppet(A.add(person(c, CAST.jesus)));
    const fx = W.fx;
    const cid = S.id('mem');
    const mem = fx.add(`<g>${plate(c, `<clipPath id="${cid}"><circle r="62"/></clipPath><g clip-path="url(#${cid})">${peterMemory(c)}</g>`, { r: 62 })}</g>`);
    const said = fx.add(`<g opacity="0">${words(c, tr(['Oto my opuściliśmy swoją', 'własność i poszliśmy za Tobą'], ['Look, we have left everything', 'and followed you']), { size: 17, side: 1 })}</g>`);
    const IC = leftIcons(c);
    const cards = IC.map((ic, i) => ({
      i,
      one: fx.add(`<g>${iconCard(c, ic.one, tr(ic.pl, ic.en), { w: 94, h: 100, size: 14 })}</g>`),
      many: fx.add(`<g opacity="0">${iconCard(c, ic.many, tr(ic.pl, ic.en), { w: 94, h: 100, size: 14, face: mix(C.halo, C.cream, 0.6) })}</g>`),
    }));
    const ringEl = W.behind.add(`<g>${halo(200, 0.45)}${eternityRing(c, 165, 10, 30)}</g>`);

    return (t, time) => {
      const T = time;
      W.update(T);
      W.groups.forEach((g) => g.sp.set({ x: g.x, y: g.y }));

      /* v28 — Peter steps out */
      const out = es(t, 0.05, 0.35);
      const px = lerp(P ? 580 : 560, P ? 660 : 650, out);
      peter.set({ x: px, y: GY + 10, s: 0.92, flip: false, walk: out > 0 && out < 1 ? px * 0.05 : undefined, armF: 20 + es(t, 0.3, 0.45) * 70 * (1 - es(t, 1.0, 1.2)), armB: 10 + bump(t, 0.4, 0.95) * 60, head: -4, blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(px, GY + 10, 0.92, false);
      pose(said, { x: phx + 10, y: phy - 36, s: es(t, 0.3, 0.48, ease.back), o: t > 0.3 && t < 1.05 ? 1 - es(t, 0.97, 1.05) : 0 });
      const mk = es(t, 0.3, 0.55, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      pose(mem, { x: 700, y: lerp(-1500, 330, mk) + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.6) * 1.2 : 0 });

      /* Jesus answers them all */
      J.set({ x: JX, y: GY, s: 1.06, flip: t < 0.9, armF: 20 + bump(t, 1.05, 2.9) * 50 + es(t, 3.05, 3.3) * 60, armB: 10 + bump(t, 1.1, 2.0) * 80 + es(t, 3.05, 3.3) * 140, head: -es(t, 3.05, 3.3) * 12, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, GY, 1.06, false);
      W.voice(jhx, jhy, bump(t, 1.02, 3.95) * 0.7, T, { spread: 1.6 });

      /* v29 — five cards; v30a — many times more */
      cards.forEach((cd) => {
        const k = es(t, 1.08 + cd.i * 0.1, 1.33 + cd.i * 0.1, ease.out) * (1 - es(t, 3.0 + cd.i * 0.03, 3.3 + cd.i * 0.03, ease.in));
        const x = CXs(cd.i), y = lerp(-1500, 360 + (cd.i % 2) * 16, k) + (T ? Math.sin(T * 0.8 + cd.i) * 2 : 0);
        const flip = es(t, 2.1 + cd.i * 0.08, 2.3 + cd.i * 0.08);
        const r = T ? Math.sin(T * 0.7 + cd.i * 2) * 1.2 : 0;
        pose(cd.one, { x, y, r, sx: Math.max(0.02, 1 - flip * 2), o: flip < 0.5 ? 1 : 0 });
        pose(cd.many, { x, y, r, sx: Math.max(0.02, flip * 2 - 1), o: flip >= 0.5 ? 1 : 0 });
      });

      /* v30b — the ring without end */
      const rk = es(t, 3.1, 3.7);
      drawRing(ringEl, rk);
      pose(ringEl, { x: 800, y: 285, s: 1, r: T ? T * 2 : 0, o: t > 3.05 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 0], [1.0, -10], [3.0, -20]]);
      S.cam.z = 1.03;
      void shade; void sheet; void seg; void PI;
    };
  },
};
