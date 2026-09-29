// Mt 25,19–20 — "after a long time": the sun runs over the courtyard again and again, the fig tree's shadow swings;
// then the gate opens and the master is home. He sits down at his table with the ledger, and his servants come to
// give account. The first steps up with his arms full of gold and sets it out on the table in two heaps of five:
// "you gave me five talents — here are five more."
import { C, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { estateSet, ES, RK, court, tablePos, pilePos, wordOn, sparkle, kf, moving, tr } from './lib.js';

export default {
  id: 'mt25-return',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 19 },
    { v: 20, text: 'Wówczas przyszedł ten, który otrzymał pięć talentów.' },
    { v: 20, cont: true, text: 'Przyniósł drugie pięć i rzekł: "Panie, przekazałeś mi pięć talentów, oto drugie pięć talentów zyskałem".' },
  ],
  cam: { x: [-20, 80], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    const L = S.layer({ par: E.P, sh: 5 });
    const K = court(S, L);
    const fx = S.layer({ par: E.P, sh: 6 });
    const tag = fx.add(`<g>${wordOn(c, '5 + 5', { size: 28 })}</g>`);
    const sp = Array.from({ length: 5 }, () => fx.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      /* v19 — a long time: the sun crosses again and again; then he comes back */
      const days = es(t, 0.0, 0.55, (u) => u) * 3;
      const d = days % 1;
      const run = t < 0.55;
      E.update(T, { sunX: run ? lerp(250, 1350, d) : 1280, sunY: run ? 330 - Math.sin(d * Math.PI) * 240 : 150 });
      E.joy(0);
      E.gateOpen(es(t, 0.55, 0.65) * (1 - es(t, 0.85, 0.95)));
      const MK_ = [[0.58, ES.GATE + 10], [0.86, RK.MS + 30]];
      const mx = kf(t, MK_, (u) => u);
      const seated = es(t, 0.88, 0.94);
      K.masterStand.set({ x: mx, y: ES.G, s: 0.98, flip: true, o: seg(t, 0.56, 0.62) * (1 - seated), walk: moving(t, MK_) ? mx * 0.06 : undefined, blink: blinkAt(T, 1) });
      K.masterSit.set({ x: RK.MS, y: ES.G, s: 0.98, o: seated, armF: 30 + bump(t, 2.1, 2.9) * 30, head: -2 - es(t, 2.05, 2.3) * 6, blink: blinkAt(T, 1) });

      /* the servants come to give account; the first steps up with his ten */
      const come = (i) => es(t, 0.75 + i * 0.06, 0.98 + i * 0.06);
      const up5 = es(t, 1.05, 1.4);
      const set5 = es(t, 2.05, 2.5);
      const sx = [lerp(RK.S[0] + 120, RK.S[0] + 30, come(0)) - up5 * 30, lerp(RK.S[1] + 200, RK.S[1] + 30, come(1)), lerp(RK.S[2] + 260, RK.S[2] + 30, come(2))];
      K.s5.set({ x: sx[0], y: ES.G, s: 0.9, flip: true, o: come(0) > 0.01 ? 1 : 0, walk: (come(0) > 0 && come(0) < 1) || (up5 > 0 && up5 < 1) ? sx[0] * 0.07 : undefined, armF: 70 - set5 * 20, armB: 10, head: 2 + set5 * 8, blink: blinkAt(T, 3) });
      K.s2.set({ x: sx[1], y: ES.G + 3, s: 0.9, flip: true, o: come(1) > 0.01 ? 1 : 0, walk: come(1) > 0 && come(1) < 1 ? sx[1] * 0.07 : undefined, armF: 64, armB: 8, blink: blinkAt(T, 5) });
      K.s1.set({ x: sx[2], y: ES.G + 6, s: 0.9, flip: true, o: come(2) > 0.01 ? 1 : 0, walk: come(2) > 0 && come(2) < 1 ? sx[2] * 0.07 : undefined, armF: 56, armB: 8, head: 6, blink: blinkAt(T, 7) });
      K.s1k.set({ o: 0 });
      K.g5.forEach((el, k) => {
        if (k > 9) { pose(el, { o: 0 }); return; }
        const f = es(t, 2.08 + k * 0.03, 2.3 + k * 0.03);
        const [px, py] = pilePos(sx[0], ES.G, 0.9, true, 70, 10, k);
        const grp = k < 5 ? 0 : 1;
        const [tx, ty] = tablePos(5, 5, k % 5);
        const qx = tx - 22 + grp * 44;
        pose(el, { x: lerp(px, qx, f), y: lerp(py, ty, f) - Math.sin(f * Math.PI) * 30, s: 0.72, o: come(0) > 0.01 ? 1 : 0 });
      });
      K.g2.forEach((el, k) => pose(el, { ...(() => { const [px, py] = pilePos(sx[1], ES.G + 3, 0.9, true, 64, 4, k); return { x: px, y: py }; })(), s: 0.72, o: come(1) > 0.01 ? 1 : 0 }));
      pose(K.dull, { o: 0 });
      const [bx, by] = pilePos(sx[2], ES.G + 6, 0.9, true, 56, 1, 0);
      pose(K.pack, { x: bx, y: by + 14, s: 0.8, o: come(2) > 0.01 ? 1 : 0 });
      const tk = es(t, 2.35, 2.6, ease.back);
      pose(tag, { x: 772, y: lerp(-1500, 400, tk), r: Math.sin(T * 0.9) * 2, o: tk > 0.01 ? 1 : 0 });
      sp.forEach((el, i) => { const k = bump(t, 2.3 + i * 0.06, 2.7 + i * 0.06); pose(el, { x: 750 + i * 14, y: RK.TOP - 60 - (i % 2) * 20, s: k, r: T * 40, o: k }); });

      S.cam.x = es(t, 0.9, 1.3) * 40;
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.05;
      S.cam.y = es(t, 1.9, 2.3) * 20;
    };
  },
};
