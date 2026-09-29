// Mt 18,23–25 — the parable flies in: a king's hall, the king on his throne under a violet drape, his steward
// with the long roll of accounts. The servants come up one by one and pay in: coins drop into the chest. Then two
// guards bring in the man who owes ten thousand talents — and behind him the debt rises out of the floor, a whole
// mountain of gold ingots, with its bill hanging over it. He cannot pay: he turns out an empty purse. The king points:
// sold, with his wife and children and all he has — they are brought in beside him, their chest and jars and rug are
// set down under a tag, and a rope is tied round his wrists.
import { C, person, blinkAt, pose, lerp, swing, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kingHall, KH, kingPuppets, moody, DEBTOR, WIFE, SERVANTS, STEWARD, JAILER, helmet, withFace, kid, talentHeap, debtBill, saleTag, goods, coin, bonds, scrollOpen, purse, speech, crossX, kf, hand, headAt, hanging, tr, PI } from './lib.js';

const P = 0.45, FY = KH.FLOOR;
export const HEAP = [430, FY - 2];
export const BILL = [440, 236];
export const DX = 690;                 // where the debtor stands before the throne

export default {
  id: 'mt18-king',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 23 },
    { v: 24 },
    { v: 25 },
  ],
  cam: { x: [-90, 30], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const H = kingHall(S, { P });
    const c = S.c;

    /* the debt: a mountain of gold, and its bill */
    const heapL = S.layer({ par: P, sh: 4 });
    const heap = heapL.add(`<g>${talentHeap(c, { w: 340, h: 250 })}</g>`);
    const flies = S.layer({ par: 0.3, sh: 6 });
    const bill = hanging(flies, debtBill(c, tr('10 000 talentów', '10,000 talents'), { w: 170, h: 170, size: 21 }), { x: 0, y: 0, len: 900 });
    const roll = hanging(flies, debtBill(c, '', { w: 120, h: 230 }), { x: 0, y: 0, len: 900 });
    const sale = hanging(flies, saleTag(c, tr('na sprzedaż', 'to be sold'), { size: 20 }), { x: 0, y: 0, len: 900 });

    /* people */
    const L = S.layer({ par: P, sh: 5 });
    const K = kingPuppets(S, L);
    const steward = S.puppet(L.add(person(c, STEWARD)));
    const chest = L.add(`<g>${sheet().p(c.cut(c.rect(-34, -40, 68, 40), 0.4, 6), C.wood).p(c.cut(c.rect(-38, -48, 76, 12), 0.3, 6), C.wood2).x(c.ribbon([[-34, -24], [34, -24]], 3), C.ochre).out()}</g>`);
    const coins = [0, 1, 2].map(() => L.add(`<g opacity="0">${coin(c, 7)}</g>`));
    const queue = SERVANTS.slice(0, 3).map((o, i) => ({ i, p: S.puppet(L.add(person(c, o))), seed: c.rr(0, 9) }));
    const goodsEl = L.add(`<g opacity="0">${goods(c)}</g>`);
    const wife = moody(S, L, WIFE);
    const kids = [2, 4].map((i) => S.puppet(L.add(kid(c, i))));
    const guards = [0, 1].map(() => S.puppet(L.add(withFace(person(c, JAILER), helmet(c)))));
    const debtor = moody(S, L, { ...DEBTOR, holdF: `<g transform="rotate(40)">${purse(c, { full: false })}</g>` });
    const bound = moody(S, L, { ...DEBTOR, holdF: bonds(c) });
    const fx = S.layer({ par: P, sh: 4 });
    const empty = fx.add(`<g opacity="0">${speech(c, crossX(c, 12), { w: 40, h: 34 })}</g>`);

    return (t, time) => {
      const T = time;
      H.update(T);

      /* v23 — the king settles accounts: the roll, the servants paying in */
      const rk = es(t, 0.1, 0.35, ease.back);
      swing(roll, 1040, lerp(-900, 170, rk) - es(t, 1.0, 1.2) * 1000, T, 1, 0.7, 1);
      steward.set({ x: 950, y: FY - 4, s: 0.94, flip: true, armF: 30 + bump(t, 0.1, 0.4) * 60 + bump(t, 1.1, 1.5) * 50, armB: 10, head: -bump(t, 0.1, 0.4) * 10, blink: blinkAt(T, 3) });
      pose(chest, { x: 1010, y: FY + 6 });
      queue.forEach((q) => {
        const a = 0.35 + q.i * 0.18;
        const step = bump(t, a, a + 0.34);
        const x = 1090 + q.i * 58 - step * 50 - es(t, 0.9, 1.1) * 0;
        q.p.set({ x, y: FY - 6 + q.i * 3, s: 0.88, flip: true, walk: step > 0.02 && step < 0.98 ? x * 0.06 : undefined, armF: 20 + bump(t, a + 0.1, a + 0.3) * 60, head: bump(t, a + 0.1, a + 0.3) * 10, o: 1 - es(t, 1.9, 2.1) * 0, blink: blinkAt(T, q.seed) });
        const drop = es(t, a + 0.14, a + 0.3, ease.in);
        pose(coins[q.i], { x: x - 34, y: lerp(FY - 120, FY - 44, drop), o: drop > 0 && drop < 1 ? 1 : 0 });
      });

      /* v24 — the man who owes ten thousand talents is brought in; the mountain of gold rises */
      const inK = es(t, 1.0, 1.4, (x) => x);
      const dx = lerp(260, DX, inK);
      const bnd = es(t, 2.62, 2.7);
      const pleaEmpty = bump(t, 2.05, 2.5);
      debtor.set({ x: dx, y: FY + 4, s: 0.94, flip: false, o: es(t, 0.95, 1.0) * (1 - bnd), walk: inK > 0 && inK < 1 ? dx * 0.06 : undefined, armF: 14 + pleaEmpty * 60, armB: pleaEmpty * 40, head: 6 + es(t, 1.5, 1.8) * 8, blink: blinkAt(T, 2) });
      debtor.mood({ sad: es(t, 1.5, 1.8) });
      bound.set({ x: DX, y: FY + 4, s: 0.94, flip: false, o: bnd, armF: 40, armB: 30, head: 16, blink: blinkAt(T, 2) });
      bound.mood({ sad: 1, tear: es(t, 2.7, 2.9) });
      const [ehx, ehy] = headAt(DX, FY + 4, 0.94, false);
      pose(empty, { x: ehx + 16, y: ehy - 16, s: pleaEmpty > 0.05 ? 1 : 0, o: pleaEmpty > 0.05 ? 1 : 0 });
      guards.forEach((g, i) => {
        const leave = es(t, 1.45, 1.95, (x) => x);
        const gx = dx - 90 - i * 60 - leave * 560;
        g.set({ x: gx, y: FY - 4 - i * 6, s: 0.9, flip: leave > 0, o: es(t, 0.95, 1.0) * (1 - es(t, 1.85, 1.95)), walk: (inK > 0 && inK < 1) || (leave > 0 && leave < 1) ? gx * 0.06 : undefined, armF: 30, blink: blinkAt(T, 4 + i) });
      });
      const rise = es(t, 1.35, 1.8, ease.out);
      pose(heap, { x: HEAP[0], y: HEAP[1], sy: Math.max(0.001, rise), o: rise > 0.01 ? 1 : 0 });
      const bk = es(t, 1.55, 1.8, ease.back);
      swing(bill, BILL[0], lerp(-900, BILL[1], bk), T, 1.2, 0.8, 2);

      /* v25 — sold, with his wife, his children and all he has */
      const fam = es(t, 2.2, 2.55, (x) => x);
      const fx0 = lerp(160, 560, fam);
      wife.set({ x: fx0, y: FY - 2, s: 0.88, flip: false, walk: fam > 0 && fam < 1 ? fx0 * 0.06 : undefined, armF: 30 + es(t, 2.55, 2.8) * 30, armB: 20, head: 10, o: es(t, 2.15, 2.22), blink: blinkAt(T, 6) });
      wife.mood({ sad: es(t, 2.5, 2.8), tear: es(t, 2.7, 2.9) });
      kids.forEach((k, i) => {
        const kx = fx0 - 60 - i * 50 + (i ? 20 : 0);
        k.set({ x: kx + (fam >= 1 ? (i ? 150 : 100) : 0) * 0, y: FY + 6 + i * 4, s: 0.52, flip: false, walk: fam > 0 && fam < 1 ? kx * 0.1 : undefined, armF: 40, head: 8, o: es(t, 2.15, 2.22), blink: blinkAt(T, 7 + i) });
      });
      pose(goodsEl, { x: 330, y: lerp(FY - 200, FY + 8, es(t, 2.3, 2.5, ease.in)), o: es(t, 2.28, 2.32) });
      const sk = es(t, 2.45, 2.7, ease.back);
      swing(sale, 330, lerp(-900, 560, sk), T, 1.2, 0.8, 3);

      /* the king: calls for the accounts, looks at the bill, points: sell him */
      const point = es(t, 2.1, 2.3);
      K.sit.set({ x: KH.TX + 8, y: KH.DAIS - 8, s: 1.05, flip: t > 1.3, armF: 20 + bump(t, 0.05, 0.5) * 60 + point * 70, armB: 10 + bump(t, 0.05, 0.5) * 40, head: -bump(t, 1.5, 2.0) * 8, blink: blinkAt(T, 1) });
      K.sit.mood({ angry: point * 0.8 });
      K.stand.set({ o: 0 });

      S.cam.x = kf(t, [[0, 20], [1.0, 20], [1.6, -60], [2.3, -70]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.02], [1.8, 1.03], [2.6, 1.05]]);
    };
  },
};
