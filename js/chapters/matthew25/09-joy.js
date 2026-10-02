// Mt 25,21–23 — "Well done, good and faithful servant!": the master rises with his arms wide and the servant bows
// among sparks of gold. "Faithful over a little — I will set you over much": the ten talents on the table are a small
// heap, but a great key flies into his hand and a round picture of a whole town with its fields comes down over him.
// "Enter into the joy of your master": the great inner door swings open on golden light and a feast, and he goes in.
// The second servant sets out his four talents; the master says the same to him, gives him a key too, and he follows
// the first into the joy.
import { C, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { town, band } from '../../assets/nature.js';
import { estateSet, ES, RK, court, tablePos, pilePos, keyProp, plateOn, wordOn, sparkle, kf, moving, tr } from './lib.js';

export default {
  id: 'mt25-joy',
  parable: true,
  beats: [
    { v: 21, text: 'Rzekł mu pan: "Dobrze, sługo dobry i wierny!' },
    { v: 21, cont: true, text: 'Byłeś wierny w rzeczach niewielu, nad wieloma cię postawię:' },
    { v: 21, cont: true, text: 'wejdź do radości twego pana!"' },
    { v: 22 },
    { v: 23 },
  ],
  cam: { x: [-80, 60], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    const L = S.layer({ par: E.P, sh: 5 });
    const K = court(S, L);
    const P = S.portrait;
    const [W2, W1] = P ? [1005, 1065] : [1040, 1110];   // where the second and third wait (phone: clear of the edge)
    const keys = [0, 1].map(() => L.add(`<g>${keyProp(c)}</g>`));
    const fx = S.layer({ par: 0.3, sh: 6 });
    const many = fx.add(`<g>${plateOn(c, `<g>${band(c, { y: 18, amps: [4, 2], lens: [80, 30], x0: -60, x1: 60, bottom: 60, color: C.hillNear, grain: false }).markup}</g>${town(c, { x: 0, y: 20, n: 9, spread: 90, sc: 0.36 })}`, { r: 56 })}</g>`);
    const tag2 = fx.add(`<g>${wordOn(c, '2 + 2', { size: 28 })}</g>`);
    const sp = Array.from({ length: 8 }, () => fx.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      E.update(T);
      E.joy(es(t, 2.02, 2.35));
      E.gateOpen(0);
      /* the master: stands, rejoices (v21a, v23), gives the keys, shows them the door */
      const stand = es(t, 0.05, 0.12);
      const joyUp = es(t, 0.1, 0.35) * (1 - es(t, 0.95, 1.1)) + es(t, 4.05, 4.25) * (1 - es(t, 4.6, 4.8));
      const give = bump(t, 1.05, 1.5) + bump(t, 4.2, 4.6);
      const show = es(t, 2.05, 2.2) * (1 - es(t, 2.85, 3.0)) + es(t, 4.5, 4.6);
      const faceL = show > 0.5;
      K.masterSit.set({ x: RK.MS, y: ES.G, s: 0.98, o: 1 - stand });
      K.masterStand.set({ x: RK.MS + 10, y: ES.G, s: 0.98, flip: faceL, o: stand, armF: 20 + joyUp * 90 + give * 70 + show * 80, armB: 10 + joyUp * 120, head: -joyUp * 8, blink: blinkAt(T, 1) });

      /* the first servant: bows, takes the key, goes in to the joy */
      const bow = bump(t, 0.2, 0.95);
      const IN5 = [[2.2, 930], [2.7, RK.DOOR5]];
      const x5 = kf(t, IN5, (u) => u);
      K.s5.set({ x: x5, y: ES.G, s: 0.9, flip: true, walk: moving(t, IN5) ? x5 * 0.07 : undefined, armF: 20 + es(t, 1.3, 1.45) * 40, armB: 8, head: bow * 16 - es(t, 2.7, 2.9) * 4, lean: -bow * 6, blink: blinkAt(T, 3) });
      /* the second: steps up, sets out four; praised; goes in */
      const up2 = es(t, 3.05, 3.35);
      const IN2 = [[3.05, W2], [3.35, 930], [4.4, 930], [4.85, RK.DOOR2]];
      const x2 = kf(t, IN2, (u) => u);
      const set2 = es(t, 3.4, 3.7);
      const bow2 = bump(t, 4.05, 4.4);
      K.s2.set({ x: x2, y: ES.G + 3, s: 0.9, flip: true, walk: moving(t, IN2) ? x2 * 0.07 : undefined, armF: 64 - set2 * 40 + es(t, 4.4, 4.5) * 20, armB: 8, head: set2 * 8 * (1 - es(t, 3.9, 4)) + bow2 * 14, blink: blinkAt(T, 5) });
      K.s1.set({ x: W1, y: ES.G + 6, s: 0.9, flip: true, armF: 56, armB: 8, head: 6, blink: blinkAt(T, 7) });
      K.s1k.set({ o: 0 });
      const [bx, by] = pilePos(W1, ES.G + 6, 0.9, true, 56, 1, 0);
      pose(K.pack, { x: bx, y: by + 14, s: 0.8 });
      pose(K.dull, { o: 0 });
      K.g5.forEach((el, k) => {
        if (k > 9) { pose(el, { o: 0 }); return; }
        const [tx, ty] = tablePos(5, 5, k % 5);
        pose(el, { x: tx - 22 + (k < 5 ? 0 : 44), y: ty, s: 0.72 });
      });
      K.g2.forEach((el, k) => {
        const f = es(t, 3.4 + k * 0.04, 3.62 + k * 0.04);
        const [px, py] = pilePos(x2, ES.G + 3, 0.9, true, 64, 4, k);
        const [tx, ty] = tablePos(2, 2, k % 2);
        const qx = tx - 16 + (k < 2 ? 0 : 32);
        pose(el, { x: lerp(px, qx, f), y: lerp(py, ty, f) - Math.sin(f * Math.PI) * 30, s: 0.72 });
      });
      const tk = es(t, 3.6, 3.85, ease.back) * (1 - es(t, 4.9, 5));
      pose(tag2, { x: 846, y: lerp(-1500, 340, tk), r: Math.sin(T * 0.9) * 2, o: tk > 0.01 ? 1 : 0 });
      /* the keys */
      [[1.1, x5, ES.G, 20 + es(t, 1.3, 1.45) * 40], [4.25, x2, ES.G + 3, 64 - set2 * 40 + es(t, 4.4, 4.5) * 20]].forEach(([t0, x, y, a], i) => {
        const f = es(t, t0, t0 + 0.3);
        const [px, py] = pilePos(x, y, 0.9, true, a, 1, 0);
        pose(keys[i], { x: lerp(RK.MS + 60, px, f), y: lerp(ES.G - 150, py, f) - Math.sin(f * Math.PI) * 50, r: -30 + f * 60, s: 0.9, o: f > 0.01 ? 1 : 0 });
      });
      /* over much: the town on its plate */
      const mk = es(t, 1.1, 1.45, ease.out) * (1 - es(t, 1.95, 2.1));
      pose(many, { x: 930, y: lerp(-1500, 330, mk), r: Math.sin(T * 0.8) * 2, o: mk > 0.01 ? 1 : 0 });
      sp.forEach((el, i) => {
        const k = bump(t, 0.15 + i * 0.05, 0.9 + i * 0.03) + bump(t, 4.05 + i * 0.04, 4.6 + i * 0.03);
        const cx = t < 3 ? 930 : 930, a = i * 0.8 + T * 0.6;
        pose(el, { x: cx + Math.cos(a) * 70, y: ES.G - 190 + Math.sin(a) * 40, s: k, r: T * 40, o: k });
      });

      S.cam.x = -es(t, 2.1, 2.6) * (P ? 40 : 70) * (1 - es(t, 2.95, 3.3)) - es(t, 4.4, 4.8) * (P ? 30 : 50);
      S.cam.z = 1 + es(t, 0, 0.3) * 0.04;
      S.cam.y = es(t, 0, 0.3) * 10;
    };
  },
};
