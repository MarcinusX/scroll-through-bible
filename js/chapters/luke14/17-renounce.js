// Łk 14,33 — back on the road, in the golden afternoon. Jesus stands facing the crowd; the man who stepped out to follow
// Him now lays down all that he has at the roadside: the heavy bundle off his back, his money bag, the key of his house,
// his fine cloak — the pile grows by the road, and he stands before Jesus with empty, open hands, free to follow.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, knot, pose3, TWELVE, DISC, moneyBag, voiceRings, sparkle, headAt, hand, kf, makeCutter, sheet, mix, shade } from './lib.js';
import { bundle } from '../mark8/lib.js';
import { GOLDEN } from '../luke8/lib.js';

const FEET = 724, JX = 850, DX = 690;

function key(c) {
  return sheet().p(c.cut(c.circ(0, 0, 7, 12), 0.2, 3) + c.cut([[5, -2], [30, -2], [30, 2], [5, 2]], 0.2, 3) + c.cut([[22, 2], [26, 2], [26, 8], [22, 8]], 0.2, 2) + c.cut([[28, 2], [30, 2], [30, 7], [28, 7]], 0.2, 2), mix(C.sun, C.wood3, 0.4)).out();
}
function cloakHeap(c) {
  return sheet().p(c.cut([[-30, 0], [-26, -10], [-8, -16], [14, -14], [30, -6], [32, 0]], 0.5, 5), DISC.mantle).x(c.ribbon([[-20, -6], [22, -8]], 1.6), shade(DISC.mantle, -0.2), 'opacity=".6"').out();
}

export default {
  id: 'lk14-renounce',
  beats: [
    { v: 33 },
  ],
  cam: { x: [-60, 20], y: [0, 160], z: [1, 1.24] },
  build(S) {
    const R = roadSet(S, { skyCols: GOLDEN, sunAt: S.portrait ? [1010, 200] : [1180, 200] });   // phone: the sun clear of the progress thread
    const c = R.c;
    const cL = S.layer({ par: 0.5, sh: 4 });
    const crowds = [[240, 'lk14-cr1', 6], [430, 'lk14-cr2', 6]].map(([x, seed, n]) => cL.sprite(knot(seed, n, { s: 0.8, spread: 40, flip: false, arms: [0, 24] }), x, FEET - 6));
    const three = cL.sprite(pose3(makeCutter('lk14-3'), [0, 1, 2].map((k) => ({ x: (k - 1) * 40, y: (k % 2) * 8, s: 0.86, flip: false, head: -2, armF: 14 + k * 6, armB: 8, o: TWELVE[k].o }))), 1010, FEET - 4);
    const pileL = S.layer({ par: 0.5, sh: 4 });
    const items = [
      { el: pileL.add(`<g opacity="0">${bundle(c)}</g>`), to: [560, FEET - 22], s: 1.7 },
      { el: pileL.add(`<g opacity="0"><g transform="scale(1.2)">${moneyBag(c)}</g></g>`), to: [606, FEET + 4], s: 1.4 },
      { el: pileL.add(`<g opacity="0">${key(c)}</g>`), to: [540, FEET + 8], s: 1.6 },
      { el: pileL.add(`<g opacity="0">${cloakHeap(c)}</g>`), to: [586, FEET + 12], s: 1.5 },
    ];
    const jL = S.layer({ par: 0.5, sh: 5 });
    const man = S.puppet(jL.add(person(c, { ...DISC, holdB: bundle(c) })));
    const man2 = S.puppet(jL.add(person(c, { ...DISC, mantle: null })));
    const jesus = S.puppet(jL.add(person(c, CAST.jesus)));
    const voice = voiceRings(jL, c, { n: 3, color: C.sun, r: 30, w: 4 });
    const sp = jL.add(`<g opacity="0">${sparkle(c, 14)}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, 0);
      crowds.forEach((g, i) => g.set({ x: [240, 430][i], y: FEET - 6 }));
      three.set({ x: 1010, y: FEET - 4 });
      const speak = es(t, -0.2, 0.05) * (1 - es(t, 0.85, 1.0));
      jesus.set({ x: JX, y: FEET, s: 1.06, flip: true, armF: 20 + speak * 40, armB: 10 + speak * 50, head: 4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, FEET, 1.06, true);
      voice(jhx, jhy, speak, T, { dir: -1, spread: 1.8 });
      /* he lays down all he has */
      const lay = (i) => es(t, 0.08 + i * 0.12, 0.2 + i * 0.12);
      const cloakOff = es(t, 0.44, 0.48);
      const bend = bump(t, 0.06, 0.58);
      const open = es(t, 0.58, 0.68);
      const [hx, hy] = hand(DX, FEET + 4, 1.0, true, 40, -bend * 10);
      man.set({ x: DX, y: FEET + 4, s: 1.0, flip: true, o: 1 - cloakOff, armF: 30 - bend * 20, armB: 10, lean: -bend * 10, head: 10 * bend, blink: blinkAt(T, 3) });
      man2.set({ x: DX, y: FEET + 4, s: 1.0, flip: false, o: cloakOff, armF: 30 + open * 50, armB: 10 + open * 70, lean: -bend * 10 * (1 - open), head: -open * 6, blink: blinkAt(T, 3) });
      items.forEach((it, i) => {
        const k = lay(i);
        pose(it.el, { x: lerp(hx, it.to[0], k), y: lerp(hy, it.to[1], k) - Math.sin(k * Math.PI) * 30, s: it.s, r: (1 - k) * 20, o: k > 0.01 ? 1 : 0 });
      });
      const [mhx, mhy] = headAt(DX, FEET + 4, 1.0, false);
      pose(sp, { x: mhx + 50, y: mhy - 20, s: bump(t, 0.64, 0.98), r: T * 40, o: bump(t, 0.64, 0.98) > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -20], [0.2, -40], [1, -30]]);
      S.cam.y = kf(t, [[-0.5, 110], [0.3, 150]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.3, 1.22]]);
      if (S.portrait) { S.cam.x = -40; S.cam.z = 1.0; }
      void seg; void ease;
    };
  },
};
