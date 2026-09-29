// Łk 18,22–23 — the same wayside, the five ticked cards still hanging. "You still lack one thing": a sixth card comes
// down at the end of the row — empty, with only a question on it — and Jesus lifts one finger. "Sell all that you
// have, and distribute it to the poor; you will have treasure in heaven": the young man's laden cart rolls up behind
// him, and coins from it fly over in an arc into the bowls of two beggars sitting by the road, while high above a gold
// star of treasure comes out in the sky. "Come, follow me": Jesus turns towards the road and holds out His hand, and
// on the empty card appear two footprints. "But when he heard these things, he became very sad, for he was very rich":
// the coins stop and fly back into the cart, the star fades, and he clutches his purse to his chest, head down.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  waySet, WY, L10, iconCard, commandIcons, tick, question, footsteps, cart, treasureStar, coin, beggarBowl, purse, withFace, faceBits, face, LOWLY,
  headAt, handAt, CARD_X, kf, es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY } = WY;
const JX = 760, RX = 970, CY = 350;
const CX = (i) => CARD_X(i) - 50;
const POOR = [[560, GY + 34], [640, GY + 40]];
const CART = [1230, GY - 20];

export default {
  id: 'lk18-lack',
  beats: [
    { v: 22, text: 'Jezus słysząc to, rzekł mu: «Jednego ci jeszcze brak:' },
    { v: 22, cont: true, text: 'sprzedaj wszystko, co masz, i rozdaj ubogim, a będziesz miał skarb w niebie;' },
    { v: 22, cont: true, text: 'potem przyjdź i chodź ze Mną».' },
    { v: 23 },
  ],
  cam: { x: [-20, 60], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const W = waySet(S, { jesus: false, dis: { keys: ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew'], x: 480, y: GY + 4, s: 0.86 } });
    const c = S.c;
    const A = W.act;
    const K = cart(c, 200);
    const cartEl = A.add(`<g>${K.body}<g transform="translate(-50 0)">${K.wheel}</g><g transform="translate(56 0)">${K.wheel}</g></g>`);
    const poor = LOWLY.map((o, i) => ({ i, p: S.puppet(A.add(person(c, { ...o, pose: 'sit' }))), bowl: A.add(`<g>${beggarBowl(c)}</g>`) }));
    const rulerEl = A.add(withFace(person(c, { ...L10.rich, holdF: `<g transform="translate(-4 -6) scale(.8)">${purse(c)}</g>` }), faceBits(c)));
    const ruler = S.puppet(rulerEl);
    const J = S.puppet(A.add(person(c, CAST.jesus)));
    const fx = W.fx;
    const ICONS = commandIcons(c);
    const cards = ICONS.map((ic, i) => ({ i, el: fx.add(`<g>${iconCard(c, `<g transform="translate(0 -2)">${ic.icon}</g>`, tr(ic.pl, ic.en), { w: 100, h: 104, size: 13 })}</g><g transform="translate(30 -30)">${tick(c, 22)}</g>`) }));
    const sixth = fx.add(`<g>${iconCard(c, '', tr('jeszcze…', 'one thing…'), { w: 100, h: 104, size: 13, face: mix(C.parchment, C.cream, 0.5) })}</g>`);
    const q = fx.add(`<g opacity="0"><g transform="scale(.8)">${question(c)}</g></g>`);
    const feet = fx.add(`<g opacity="0">${footsteps(c)}</g>`);
    const star = fx.add(`<g opacity="0">${treasureStar(c, 24)}</g>`);
    const coins = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${coin(c, 8)}</g>`) }));

    return (t, time) => {
      const T = time;
      W.update(T);
      if (W.disSp) W.disSp.set({ x: 480, y: GY + 4 });

      /* the cards, and the sixth */
      cards.forEach((cd) => pose(cd.el, { x: CX(cd.i), r: T ? Math.sin(T * 0.7 + cd.i * 2) * 1.2 : 0, y: CY + (cd.i % 2) * 14 + (T ? Math.sin(T * 0.8 + cd.i) * 2 : 0) - es(t, 3.0 + cd.i * 0.03, 3.3 + cd.i * 0.03, ease.in) * 1600 }));
      const sk = es(t, 0.05, 0.3, ease.out);
      const sy = lerp(-1500, CY + 14, sk) + (T ? Math.sin(T * 0.8 + 5) * 2 : 0) - es(t, 3.18, 3.48, ease.in) * 1600;
      pose(sixth, { x: CX(5), y: sy, r: T ? Math.sin(T * 0.7 + 10) * 1.2 : 0 });
      pose(q, { x: CX(5), y: sy - 16, s: es(t, 0.3, 0.45, ease.back) * (1 - es(t, 2.1, 2.2)), o: t > 0.3 && t < 2.2 ? 1 : 0 });
      pose(feet, { x: CX(5), y: sy - 14, s: es(t, 2.2, 2.4, ease.back), o: t > 2.2 ? 1 : 0 });

      /* Jesus: one finger (22a), the poor (22b), "come, follow me" (22c) */
      const one = es(t, 0.1, 0.25) * (1 - es(t, 0.9, 1.05));
      const toPoor = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      const come = es(t, 2.05, 2.25) * (1 - es(t, 3.3, 3.6));
      J.set({ x: JX, y: GY, s: 1.06, flip: toPoor > 0.5, armF: 20 + toPoor * 80 + come * 70, armB: 10 + one * 150 + come * 30, head: -one * 6 + come * 4 - es(t, 3.2, 3.5) * -6, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, GY, 1.06, toPoor > 0.5);
      W.voice(jhx, jhy, Math.max(bump(t, 0.02, 0.95), bump(t, 1.02, 1.95), bump(t, 2.02, 2.95)) * 0.7, T, { dir: toPoor > 0.5 ? -1 : 1, spread: 1.6 });

      /* the cart rolls up; the poor with their bowls */
      const ck = es(t, 1.0, 1.35);
      pose(cartEl, { x: lerp(1600, CART[0], ck), y: CART[1], s: 0.9, o: ck > 0 ? 1 : 0 });
      poor.forEach((p) => {
        const [x, y] = POOR[p.i];
        const hope = es(t, 1.3, 1.5) * (1 - es(t, 3.2, 3.5));
        p.p.set({ x, y, s: 0.86, flip: false, armF: 30 + hope * 50, armB: 10 + hope * 40, head: 8 - hope * 14, blink: blinkAt(T, p.i + 6) });
        pose(p.bowl, { x: x + 44, y: y + 2 });
      });
      coins.forEach((co) => {
        const a = 1.35 + co.i * 0.06;
        const k = seg(t, a, a + 0.3);
        const back = es(t, 3.1 + co.i * 0.02, 3.4 + co.i * 0.02);
        const [tx, ty] = POOR[co.i % 2];
        const x0 = CART[0] - 20, y0 = CART[1] - 150;
        let x = lerp(x0, tx + 44, k), y = lerp(y0, ty - 16, k) - Math.sin(k * PI) * 240;
        x = lerp(x, x0, back); y = lerp(y, y0, back) - Math.sin(back * PI) * 200;
        const vis = k > 0 && !(back >= 1) ? 1 : 0;
        pose(co.el, { x, y, o: vis * (back > 0 ? 1 : (k < 1 ? 1 : 0.9)) });
      });
      const stk = es(t, 1.5, 1.8, ease.back) * (1 - es(t, 3.1, 3.4));
      pose(star, { x: 800, y: 180, s: stk * 1.3, r: T * 8, o: stk > 0.02 ? 1 : 0 });

      /* the young man: listens; at the end, very sad, clutching his purse */
      const sad = es(t, 3.05, 3.3);
      ruler.set({ x: RX, y: GY - 2, s: 1.0, flip: true, armF: 20 + sad * 70, armB: 10 + sad * 50, head: bump(t, 1.4, 2.0) * -8 + sad * 16, lean: sad * 5, blink: blinkAt(T, 3) });
      face(rulerEl, 'sad', sad);
      face(rulerEl, 'tear', es(t, 3.4, 3.55));

      S.cam.x = kf(t, [[0, 30], [1.0, 40], [2.0, 20], [3.0, 30]]);
      S.cam.y = -10;
      S.cam.z = kf(t, [[0, 1.02], [3.0, 1.02], [3.5, 1.06]]);
      void shade; void sheet; void handAt;
    };
  },
};
