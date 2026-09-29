// Mt 18,26–27 — the same hall. The servant falls on his knees before the king and bows to the floor, his hands held
// up: "Lord, have patience with me!" — his wife and children kneel behind him. The king's heart is moved (a warm
// glow at his breast); he gets up from the throne and comes down to him: the rope drops from his wrists, the bill of
// ten thousand talents is torn in two and falls away, the mountain of gold sinks back into the floor, the tag of sale
// flies off — and the family runs to him and holds him.
import { C, person, blinkAt, pose, lerp, swing, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kingHall, KH, kingPuppets, moody, DEBTOR, WIFE, STEWARD, kid, talentHeap, debtBill, saleTag, goods, bonds, bubble, tornPair, heartGlow, sparkle, kf, hand, headAt, hanging, tr, PI } from './lib.js';
import { HEAP, BILL, DX } from './13-king.js';

const P = 0.45, FY = KH.FLOOR;

export default {
  id: 'mt18-mercy',
  parable: true,
  beats: [
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-90, 30], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const H = kingHall(S, { P });
    const c = S.c;
    const heapL = S.layer({ par: P, sh: 4 });
    const heap = heapL.add(`<g>${talentHeap(c, { w: 340, h: 250 })}</g>`);
    const flies = S.layer({ par: 0.3, sh: 6 });
    const tp = tornPair(c, debtBill(c, tr('10 000 talentów', '10,000 talents'), { w: 170, h: 170, size: 21 }), [-95, -5, 95, 200], 0, S.id('bill'));
    const billL = hanging(flies, tp.left, { x: 0, y: 0, len: 900 });
    const billR = flies.add(`<g>${tp.right}</g>`);
    const billLo = billL.querySelector('.obj');
    const whole = hanging(flies, debtBill(c, tr('10 000 talentów', '10,000 talents'), { w: 170, h: 170, size: 21 }), { x: 0, y: 0, len: 900 });
    const sale = hanging(flies, saleTag(c, tr('na sprzedaż', 'to be sold'), { size: 20 }), { x: 0, y: 0, len: 900 });

    const L = S.layer({ par: P, sh: 5 });
    const K = kingPuppets(S, L);
    const steward = S.puppet(L.add(person(c, STEWARD)));
    L.add(`<g transform="translate(1010 ${FY + 6})">${sheet().p(c.cut(c.rect(-34, -40, 68, 40), 0.4, 6), C.wood).p(c.cut(c.rect(-38, -48, 76, 12), 0.3, 6), C.wood2).x(c.ribbon([[-34, -24], [34, -24]], 3), C.ochre).out()}</g>`);
    L.add(`<g transform="translate(330 ${FY + 8})">${goods(c)}</g>`);
    const wifeK = moody(S, L, { ...WIFE, pose: 'kneel' });
    const wifeU = moody(S, L, WIFE);
    const kids = [2, 4].map((i) => S.puppet(L.add(kid(c, i))));
    const bound = moody(S, L, { ...DEBTOR, holdF: bonds(c) });
    const kneel = moody(S, L, { ...DEBTOR, pose: 'kneel' });
    const free = moody(S, L, DEBTOR);
    const rope = L.add(`<g opacity="0">${bonds(c)}</g>`);
    const fx = S.layer({ par: P, sh: 4 });
    const plea = fx.add(`<g opacity="0">${bubble(c, tr(['Panie, miej', 'cierpliwość!'], ['Lord, have', 'patience!']), { size: 19, tail: -1 })}</g>`);
    const glowH = fx.add(`<g opacity="0">${heartGlow(c, 10)}</g>`);
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(T);

      /* v26 — he falls down and begs */
      const down = es(t, 0.05, 0.12);
      const bow = es(t, 0.12, 0.4) * (1 - es(t, 1.35, 1.6));
      const released = es(t, 1.38, 1.44);
      const upK = es(t, 1.62, 1.68);
      bound.set({ x: DX, y: FY + 4, s: 0.94, flip: false, o: 1 - down, armF: 40, armB: 30, head: 16, blink: 0 });
      bound.mood({ sad: 1 });
      kneel.set({ x: DX + 6, y: FY + 6, s: 0.94, flip: false, o: down * (1 - upK), lean: bow * 34, armF: 60 + bow * 50, armB: 50 + bow * 70, head: -bow * 10 + es(t, 1.2, 1.4) * -10, blink: blinkAt(T, 2) });
      kneel.mood({ sad: 1 - es(t, 1.4, 1.7), tear: es(t, 0.3, 0.5) * (1 - es(t, 1.5, 1.7)) });
      free.set({ x: DX - 20 * es(t, 1.7, 1.95), y: FY + 4, s: 0.94, flip: true, o: upK, armF: 40 + es(t, 1.7, 1.95) * 50, armB: 30 + es(t, 1.7, 1.95) * 70, head: 6, blink: blinkAt(T, 2) });
      const [hx, hy] = hand(DX + 6, FY + 6, 0.94, false, 60 + bow * 50, bow * 34, 46);
      pose(rope, { x: hx, y: lerp(hy, FY + 2, es(t, 1.4, 1.55, ease.in)), r: es(t, 1.4, 1.55) * 80, o: down > 0.5 && released > 0 ? 1 - es(t, 1.8, 1.95) : 0 });
      const pk = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 1.05, 1.15));
      const [bhx, bhy] = headAt(DX + 6, FY + 6, 0.94, false, 46);
      pose(plea, { x: bhx - 30, y: bhy - 64, s: pk, o: pk > 0.01 ? 1 : 0 });

      // the family kneels too, then runs to him
      const famK = es(t, 0.2, 0.26);
      const run = es(t, 1.6, 1.9);
      wifeK.set({ x: 560, y: FY - 2, s: 0.88, flip: false, o: famK * (1 - es(t, 1.55, 1.6)), armF: 60, armB: 50, head: 12, blink: blinkAt(T, 6) });
      wifeK.mood({ sad: 1 - es(t, 1.3, 1.5), tear: 1 - es(t, 1.3, 1.5) });
      wifeU.set({ x: lerp(560, DX - 70, run), y: FY - 2, s: 0.88, flip: false, o: t < 0.2 ? 1 : es(t, 1.55, 1.6), walk: run > 0 && run < 1 ? run * 30 : undefined, armF: 30 + run * 60, armB: 20 + run * 60, head: t < 0.2 ? 10 : -4, blink: blinkAt(T, 6) });
      wifeU.mood({ sad: t < 0.2 ? 1 : 0 });
      kids.forEach((k, i) => {
        const kx = lerp(500 - i * 50 + (i ? 20 : 0), DX - 120 - i * 40, run);
        k.set({ x: kx, y: FY + 6 + i * 4, s: 0.52, flip: false, walk: run > 0 && run < 1 ? kx * 0.1 : undefined, armF: 40 + run * 60, armB: run * 80, head: 8 - run * 16, blink: blinkAt(T, 7 + i) });
      });

      /* v27 — the king is moved, rises, forgives the debt */
      const stand = es(t, 1.1, 1.16);
      const comeDown = es(t, 1.16, 1.4);
      const tear = es(t, 1.42, 1.5);
      const fall = es(t, 1.5, 1.85, ease.in);
      K.sit.set({ x: KH.TX + 8, y: KH.DAIS - 8, s: 1.05, flip: true, o: 1 - stand, armF: 20 + es(t, 0.5, 0.9) * 20, armB: 10 + es(t, 0.7, 1.0) * 40, head: 8 * es(t, 0.4, 0.8), blink: blinkAt(T, 1) });
      K.sit.mood({ angry: 0.8 * (1 - es(t, 0.3, 0.6)), sad: es(t, 0.5, 0.8) });
      const kx = lerp(KH.TX + 8, DX + 110, comeDown), ky = lerp(KH.DAIS - 6, FY - 2, comeDown);
      K.stand.set({ x: kx, y: ky, s: 1.05, flip: true, o: stand, walk: comeDown > 0 && comeDown < 1 ? kx * 0.05 : undefined, armF: 30 + es(t, 1.35, 1.5) * 60, armB: 20 + bump(t, 1.4, 1.7) * 100, head: 10 - es(t, 1.6, 1.8) * 6, blink: blinkAt(T, 1) });
      K.stand.mood({ sad: 1 - es(t, 1.5, 1.8) });
      const [khx, khy] = headAt(t < 1.1 ? KH.TX + 8 : kx, t < 1.1 ? KH.DAIS - 8 : ky, 1.05, true, t < 1.1 ? 62 : 0);
      pose(glowH, { x: khx - 4, y: khy + 58, s: es(t, 0.55, 0.85, ease.back), o: es(t, 0.5, 0.6) * (1 - es(t, 1.85, 1.98)) });
      steward.set({ x: 950, y: FY - 4, s: 0.94, flip: true, armF: 20, head: -bump(t, 1.4, 1.9) * 10, blink: blinkAt(T, 3) });

      // the bill torn and gone; the heap sinks; the sale tag flies up
      swing(whole, BILL[0], BILL[1], T, 1.2 * (1 - tear), 0.8, 2);
      fade(whole, 1 - tear);
      swing(billL, BILL[0], BILL[1], T, 1.2 * (1 - tear), 0.8, 2);
      fade(billL, tear);
      pose(billLo, { x: -fall * 70, y: fall * 520, r: -tear * 14 - fall * 60, o: 1 - es(t, 1.8, 1.9) });
      pose(billR, { x: BILL[0] + tear * 14 + fall * 90, y: BILL[1] + fall * 520, r: tear * 16 + fall * 70, o: tear * (1 - es(t, 1.8, 1.9)) });
      const sink = es(t, 1.5, 1.9, ease.in);
      pose(heap, { x: HEAP[0], y: HEAP[1], sy: Math.max(0.001, 1 - sink), o: sink < 0.99 ? 1 : 0 });
      swing(sale, 330, lerp(560, -900, es(t, 1.55, 1.8, ease.in)), T, 1.2, 0.8, 3);
      sparks.forEach((sp, i) => {
        const k = bump(t, 1.6 + i * 0.05, 2.0);
        pose(sp, { x: DX - 60 + i * 34, y: FY - 230 - (i % 2) * 30, s: k, r: T * 40, o: k });
      });

      S.cam.x = kf(t, [[0, -40], [1.0, -40], [1.4, -20]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 30], [1.4, 20]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [1.4, 1.03]]);
    };
  },
};
