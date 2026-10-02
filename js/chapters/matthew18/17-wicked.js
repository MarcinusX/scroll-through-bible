// Mt 18,32–34 — the king's hall again. The guards bring the servant in; the king stands up on the dais and points at
// him: "You wicked servant!" A round picture comes down from the flies: the servant on his knees before the throne,
// the bill torn in two over him — I forgave you all that debt because you begged me. A second picture comes down
// beside it, the same scene turned round: the poor fellow on his knees before him, and he refusing. Should you not
// have had mercy, as I had mercy on you? In anger the king hands him over: the mountain of gold rises again, the
// bill hangs back up whole, and two jailers lead him away by a rope, out of the hall.
import { C, person, blinkAt, pose, lerp, swing, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kingHall, KH, kingPuppets, moody, DEBTOR, FELLOW, KING, JAILER, helmet, withFace, talentHeap, debtBill, bonds, shout, GLYPH, crossX, plate, qMark, throne, tornPair, kf, hand, headAt, hanging, tr, PI } from './lib.js';
import { DX, hallSpots } from './13-king.js';

const P = 0.45, FY = KH.FLOOR;
const PL1_ = [584, 330], PL2_ = [1026, 330];

/** a sepia picture plate of one kneeling before one seated (who, whom); mirrored or not */
function memory(c, id, seated, kneeling, { refuse = false, torn = false } = {}) {
  const sep = (o) => ({ ...o, halo: false });
  let inner = '';
  inner += `<g transform="translate(26 36) scale(.36)">${throne(c)}</g>`;
  inner += `<g transform="translate(28 34) scale(-.4 .4)">${person(c, { ...sep(seated), pose: 'sit' })}</g>`;
  inner += `<g transform="translate(-30 40) scale(.4)">${person(c, { ...sep(kneeling), pose: 'kneel' })}</g>`;
  if (torn) inner += `<g transform="translate(-10 -40) rotate(-14) scale(.26)">${debtBill(c, '', { w: 150, h: 110 })}</g><g transform="translate(14 -36) rotate(16) scale(.26)">${debtBill(c, '', { w: 150, h: 110 })}</g>`;
  if (refuse) inner += `<g transform="translate(40 -30)">${crossX(c, 12)}</g>`;
  return plate(c, `<g transform="scale(1.3)">${inner}</g>`, { r: 96, face: mix(C.parchment, C.sand, 0.35) });
}

export default {
  id: 'mt18-wicked',
  parable: true,
  beats: [
    { v: 32, text: 'Wtedy pan jego wezwał go przed siebie i rzekł mu: "Sługo niegodziwy!' },
    { v: 32, cont: true, text: 'Darowałem ci cały ten dług, ponieważ mnie prosiłeś.' },
    { v: 33 },
    { v: 34 },
  ],
  cam: { x: [-80, 30], y: [-20, 40], z: [1, 1.06] },
  build(S) {
    const H = kingHall(S, { P });
    const c = S.c;
    const { heap: HEAP, bill: BILL } = hallSpots(S);
    // phone: the second picture comes in from under the thread; the servant is led away slowly enough to be seen
    const PL1 = S.portrait ? [600, 330] : PL1_, PL2 = S.portrait ? [1000, 330] : PL2_;
    const AWAY = S.portrait ? [4.25, 420] : [3.95, 180];
    const heapL = S.layer({ par: P, sh: 4 });
    const heap = heapL.add(`<g>${talentHeap(c, { w: 340, h: 250 })}</g>`);
    const flies = S.layer({ par: 0.3, sh: 6 });
    const bill = hanging(flies, debtBill(c, tr('10 000 talentów', '10,000 talents'), { w: 170, h: 170, size: 21 }), { x: 0, y: 0, len: 900 });
    const m1 = hanging(flies, memory(c, 'm1', KING, DEBTOR, { torn: true }), { x: 0, y: 0, len: 900 });
    const m2 = hanging(flies, memory(c, 'm2', DEBTOR, FELLOW, { refuse: true }), { x: 0, y: 0, len: 900 });
    const q = hanging(flies, `<g transform="scale(.9)">${qMark(c, 54)}</g>`, { x: 0, y: 0, len: 900 });

    const L = S.layer({ par: P, sh: 5 });
    const K = kingPuppets(S, L);
    const guards = [0, 1].map(() => S.puppet(L.add(withFace(person(c, JAILER), helmet(c)))));
    const debtor = moody(S, L, DEBTOR);
    const bound = moody(S, L, { ...DEBTOR, holdF: bonds(c) });
    const fx = S.layer({ par: P, sh: 4 });
    const cry = fx.add(`<g opacity="0">${shout(c, GLYPH.bang(c), { w: 60, h: 50, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      H.update(T);

      /* v32a — called in: "You wicked servant!" */
      const inK = es(t, 0.0, 0.35, (x) => x);
      const away = es(t, 3.3, AWAY[0], (x) => x);
      const bnd = es(t, 3.1, 3.16);
      const dx = t < 3.3 ? lerp(300, DX, inK) : lerp(DX, AWAY[1], away);
      const cower = es(t, 0.4, 0.6);
      debtor.set({ x: dx, y: FY + 4, s: 0.94, flip: false, o: 1 - bnd, walk: inK > 0 && inK < 1 ? dx * 0.06 : undefined, lean: -cower * 8, armF: 20 + cower * 40, armB: cower * 50, head: 10 + cower * 6, blink: blinkAt(T, 2) });
      debtor.mood({ sad: cower });
      bound.set({ x: dx, y: FY + 4, s: 0.94, flip: away > 0, o: bnd, walk: away > 0 && away < 1 ? dx * 0.06 : undefined, armF: 40, armB: 30, head: 16, blink: blinkAt(T, 2) });
      bound.mood({ sad: 1, tear: 1 });
      guards.forEach((g, i) => {
        const back = dx - 100 - i * 60, flank = dx + (i ? 74 : -74);
        const k = es(t, 3.0, 3.25);
        const gx = t < 3.0 ? back : lerp(back, flank, k);
        const moving = (inK > 0 && inK < 1) || (k > 0 && k < 1) || (away > 0 && away < 1);
        g.set({ x: gx, y: FY - 4 - i * 6, s: 0.9, flip: t > 3.28, walk: moving ? gx * 0.06 : undefined, armF: 30 + es(t, 3.15, 3.3) * 40, blink: blinkAt(T, 4 + i) });
      });
      const [khx, khy] = headAt(KH.TX + 12, KH.DAIS - 4, 1.05, true);
      const ck = es(t, 0.4, 0.55, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(cry, { x: khx - 26, y: khy - 20, s: ck, o: ck > 0.01 ? 1 : 0 });
      const point = es(t, 0.35, 0.5) * (1 - es(t, 1.0, 1.15)) + es(t, 3.05, 3.2);
      const between = bump(t, 2.05, 2.95);
      K.stand.set({ x: KH.TX + 12, y: KH.DAIS - 4, s: 1.05, flip: true, armF: 20 + point * 70 + bump(t, 1.1, 1.9) * 50, armB: 10 + between * 120, head: -between * 10, blink: blinkAt(T, 1) });
      K.stand.mood({ angry: Math.max(es(t, 0.3, 0.5) * (1 - es(t, 1.1, 1.3)), es(t, 2.95, 3.15)), sad: bump(t, 1.2, 2.9) });
      K.sit.set({ o: 0 });

      /* v32b, v33 — the two pictures */
      const k1 = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 3.0, 3.2));
      const k2 = es(t, 2.05, 2.35, ease.back) * (1 - es(t, 3.0, 3.2));
      swing(m1, PL1[0], lerp(-900, PL1[1], k1), T, 1.1, 0.7, 1);
      swing(m2, PL2[0], lerp(-900, PL2[1], k2), T, 1.1, 0.7, 2);
      const qk = es(t, 2.4, 2.6, ease.back) * (1 - es(t, 3.0, 3.2));
      swing(q, 805, lerp(-900, 300, qk), T, 1.4, 0.8, 3);

      /* v34 — handed over: the debt back, led away */
      const rise = es(t, 3.1, 3.5, ease.out);
      pose(heap, { x: HEAP[0], y: HEAP[1], sy: Math.max(0.001, rise), o: rise > 0.01 ? 1 : 0 });
      swing(bill, BILL[0], lerp(-900, BILL[1], es(t, 3.3, 3.55, ease.back)), T, 1.2, 0.8, 4);

      S.cam.x = kf(t, [[0, -30], [1.0, -10], [2.0, 10], [3.0, 0], [3.5, -60]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 0], [3.0, 0], [3.4, 20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.02], [3.0, 1.02], [3.5, 1.04]]);
    };
  },
};
