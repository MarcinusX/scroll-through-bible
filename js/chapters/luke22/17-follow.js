// Łk 22,54–55 — they seize Him and lead Him away, bound, into the high priest's house (John 18's courtyard cut open):
// in through the gate, across the yard and up the steps into the lamp-lit hall. Peter follows far behind — a small
// figure in the dark street who stops at the gate and looks in. They kindle a fire in the middle of the courtyard and
// sit down round it, and Peter comes in and sits among them, in the firelight.
import { es, ease, bump, seg } from '../../core/anim.js';
import { courtScene, kf, moving, hand, headAt, leadRope, vis, pose, fade, lerp, blinkAt, C, PI } from './lib.js';

const PETER_AT = 70;

export default {
  id: 'lk22-follow',
  beats: [
    { v: 54, text: 'Schwycili Go więc, poprowadzili i zawiedli do domu najwyższego kapłana.' },
    { v: 54, cont: true, text: 'A Piotr szedł z daleka.' },
    { v: 55 },
  ],
  cam: { x: [-1100, 120], y: [-40, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const K = courtScene(S, { lead: true });
    const { YARD, HALL, FIRE, JXH, GATE } = K;
    const DOORX = 640;

    return (t, time) => {
      const T = time;
      const fireK = es(t, 2.05, 2.4);
      K.idle(T, fireK);
      K.R.dawn.fade(0);
      pose(K.roEl, { x: K.ROO.x, y: K.ROO.y, s: 0.9 });

      /* v54a — led in, bound, up into the hall */
      const jK = [[-0.4, [-160, YARD]], [0.5, [560, YARD]], [0.72, [790, YARD]], [0.85, [880, HALL]], [0.98, [JXH, HALL]]];
      const [jx, jy] = kf(t, jK, (u) => u);
      const inHall = t > 0.98;
      K.hall(T, { jx: inHall ? JXH : -2000, jo: inHall ? 1 : 0, head: 10 });
      K.leadL.forEach((g, i) => {
        const off = i === 0 ? 90 : -90;
        const gK = jK.map(([tt, [x, y]]) => [tt, [x + off, y]]);
        const [gx, gy] = kf(t, gK, (u) => u);
        const k2 = es(t, 0.98, 1.2);
        const fin = i === 0 ? [JXH + 60, HALL] : [JXH - 170, HALL];
        g.set({ x: lerp(gx, fin[0], k2), y: lerp(gy, fin[1], k2), s: gy < YARD - 10 ? 0.9 : 0.98, flip: false, o: 1 - es(t, 1.2, 1.4), walk: moving(t, gK, 1) ? gx * 0.05 : undefined, armF: 30, armB: 8, blink: blinkAt(T, 4 + i) });
      });
      K.walker.set({ x: jx, y: jy, s: jy < YARD - 10 ? 0.94 : 1.0, flip: false, o: inHall ? 0 : 1, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, amt: 0.7, armF: 26, armB: 12, head: 8, blink: blinkAt(T) });

      /* v54b — Peter, far behind, at the gate */
      const pK = [[0.6, [-700, YARD + 4]], [1.5, [GATE - 120, YARD + 4]], [1.9, [GATE - 60, YARD + 4]], [2.35, [DOORX - 60, YARD + 6]], [2.6, [FIRE + PETER_AT, YARD + 14]]];
      const [px, py] = kf(t, pK, ease.sine);
      const sitP = es(t, 2.62, 2.7);
      const peer = es(t, 1.5, 1.7) * (1 - es(t, 1.95, 2.1));
      K.pSt.set({ x: px, y: py, s: 0.92, flip: t > 2.45, o: 1 - sitP, walk: moving(t, pK, 1) ? px * 0.06 : undefined, lean: peer * 10, head: -peer * 6, armF: 20 + peer * 30, armB: 8, blink: blinkAt(T, 3) });
      fade(K.pStF.sad, 0.6);
      K.pSit.set({ x: FIRE + PETER_AT, y: YARD + 14, s: 0.9, flip: true, o: sitP, armF: 60, armB: 40, head: 8, blink: blinkAt(T, 3) });
      fade(K.pSitF.sad, 0.6);
      pose(K.G.door, { x: K.G.doorX, y: K.G.doorY, sx: 0.15 + es(t, 1.0, 1.3) * 0.5 * (1 - es(t, 1.95, 2.15)) });

      /* v55 — the fire; they sit round it */
      K.ring.forEach((d) => {
        const come = es(t, 2.0 + d.i * 0.06, 2.35 + d.i * 0.06, ease.sine);
        const sit = es(t, 2.35 + d.i * 0.06, 2.42 + d.i * 0.06);
        const x = lerp(DOORX, d.x, come);
        d.stand.set({ x, y: YARD + d.y, s: d.s, flip: x > d.x, o: es(t, 1.95, 2.02) * (1 - sit), walk: come > 0 && come < 1 ? x * 0.05 : undefined, blink: blinkAt(T, d.seed) });
        d.sit.set({ x: d.x, y: YARD + d.y + 4, s: d.s, flip: d.f, o: sit, armF: 64, armB: 40, head: 6, blink: blinkAt(T, d.seed) });
      });
      K.maid.set({ x: 1300, y: YARD, s: 0.86, o: 0 });

      S.cam.x = kf(t, [[-0.4, -900], [0.5, -300], [0.95, 280], [1.1, 200], [1.4, -760], [1.95, -760], [2.3, 0], [3, 20]]);
      S.cam.y = kf(t, [[-0.4, 120], [0.5, 120], [0.95, 0], [1.1, 20], [1.4, 130], [1.95, 130], [2.3, 110], [3, 110]]);
      S.cam.z = kf(t, [[-0.4, 1.2], [0.5, 1.2], [0.95, 1.1], [1.1, 1.1], [1.4, 1.3], [1.95, 1.3], [2.3, 1.16], [3, 1.2]]);
    };
  },
};
