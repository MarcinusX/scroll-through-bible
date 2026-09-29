// Mt 25,26–27 — the master stands and points: "You wicked and lazy servant!" — the servant drops to his knees by the
// dull talent. "You knew that I reap where I did not sow…": the round picture of the sheaves comes down on its string,
// thrown back at him. "Then you should have put my money with the bankers": a painted picture of a money-changer's
// table in the town, the talent laid on it — and at the master's return a little coin of interest pops up beside it.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { estateSet, ES, RK, court, tablePos, sheaf, sickle, bankTable, talent, BANKER, plateOn, sparkle } from './lib.js';

export default {
  id: 'mt25-wicked',
  parable: true,
  beats: [
    { v: 26, text: 'Odrzekł mu pan jego: "Sługo zły i gnuśny!' },
    { v: 26, cont: true, text: 'Wiedziałeś, że chcę żąć tam, gdzie nie posiałem, i zbierać tam, gdziem nie rozsypał.' },
    { v: 27 },
  ],
  cam: { x: [-20, 60], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    const L = S.layer({ par: E.P, sh: 5 });
    const K = court(S, L);
    const fx = S.layer({ par: 0.3, sh: 6 });
    const reap = fx.add(`<g>${plateOn(c, `<g transform="translate(-26 34)">${sheaf(c, 60)}</g><g transform="translate(4 34)">${sheaf(c, 66)}</g><g transform="translate(32 20) rotate(30)">${sickle(c)}</g>`, { r: 52, face: mix(C.wheat, C.cream, 0.6) })}</g>`);
    // the bankers: a big picture frame with the money-changer's table, the talent and its interest
    const R = 124;
    const bankBase = fx.add(`<g>${plateOn(c, `<g transform="translate(0 ${R * 0.62})"><path d="${c.cut([[-R, 0], [R, 0], [R, 30], [-R, 30]], 0.3, 6)}" fill="${mix(C.stone, C.sand, 0.4)}"/>${person(c, { ...BANKER }).replace('<g class="fig">', `<g class="fig" transform="translate(-58 0) scale(.62)">`)}<g transform="translate(22 0) scale(.9)">${bankTable(c, 130)}</g></g>`, { r: R, face: mix(C.dawn, C.skyBlue, 0.35) })}</g>`);
    const coinT = fx.add(`<g>${talent(c)}</g>`);
    const interest = fx.add(`<g>${talent(c, 8)}</g>`);
    const sp = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 8)}</g>`));

    return (t, time) => {
      const T = time;
      E.update(T);
      E.joy(1);
      E.gateOpen(0);
      /* v26a — he rises and points: wicked and lazy */
      const stand = es(t, 0.05, 0.12);
      const point = es(t, 0.1, 0.3);
      K.masterSit.set({ x: RK.MS, y: ES.G, s: 0.98, o: 1 - stand });
      K.masterStand.set({ x: RK.MS + 10, y: ES.G, s: 0.98, o: stand, armF: 30 + point * 60 * (1 - es(t, 1.9, 2.1) * 0.5), armB: 10 + bump(t, 1.05, 1.9) * 60 + es(t, 2.05, 2.3) * 60, head: -2, blink: blinkAt(T, 1) });
      const kneel = es(t, 0.3, 0.37);
      K.s1.set({ x: 930, y: ES.G + 6, s: 0.9, flip: true, o: 1 - kneel, armF: 50, head: 12 });
      K.s1k.set({ x: 936, y: ES.G + 6, s: 0.9, flip: true, o: kneel, armF: 30, armB: 10, head: 18, blink: blinkAt(T, 7) });
      K.s5.set({ x: RK.DOOR5, y: ES.G, s: 0.9, armF: 30, head: -2, blink: blinkAt(T, 3) });
      K.s2.set({ x: RK.DOOR2, y: ES.G + 3, s: 0.9, armF: 30, blink: blinkAt(T, 5) });
      K.g5.forEach((el, k) => { if (k > 9) { pose(el, { o: 0 }); return; } const [tx, ty] = tablePos(5, 5, k % 5); pose(el, { x: tx - 22 + (k < 5 ? 0 : 44), y: ty, s: 0.72 }); });
      K.g2.forEach((el, k) => { const [tx, ty] = tablePos(2, 2, k % 2); pose(el, { x: tx - 16 + (k < 2 ? 0 : 32), y: ty, s: 0.72 }); });
      const [tx, ty] = tablePos(1, 1, 0);
      pose(K.dull, { x: tx, y: ty, s: 0.72 });
      pose(K.pack, { o: 0 });

      /* v26b — his own words thrown back: the sheaves he did not sow */
      const rk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.95, 2.1));
      pose(reap, { x: 930, y: lerp(-1500, 320, rk), r: Math.sin(T * 0.8) * 2, o: rk > 0.01 ? 1 : 0 });
      /* v27 — the bankers, and the interest */
      const bk = es(t, 2.05, 2.4, ease.out);
      const by = lerp(-1500, 290, bk), bx = 800;
      pose(bankBase, { x: bx, y: by, r: Math.sin(T * 0.7) * 1, o: bk > 0.01 ? 1 : 0 });
      const lay = es(t, 2.35, 2.5);
      pose(coinT, { x: bx + 30, y: lerp(by - 10, by + 110 * 0.62 - 64, lay), s: 0.72, o: lay > 0.01 ? 1 : 0 });
      const intK = es(t, 2.52, 2.68, ease.back);
      pose(interest, { x: bx + 54, y: by + 110 * 0.62 - 62, s: intK, o: intK > 0.01 ? 1 : 0 });
      sp.forEach((el, i) => { const k = bump(t, 2.55 + i * 0.06, 2.95 + i * 0.06); pose(el, { x: bx + 50 + (i - 1) * 22, y: by + 110 * 0.62 - 90 - (i % 2) * 14, s: k, r: T * 40, o: k }); });

      S.cam.z = 1 + es(t, 0, 0.3) * 0.04;
      S.cam.x = es(t, 0, 0.3) * 30;
      S.cam.y = -es(t, 2.0, 2.4) * 20;
    };
  },
};
