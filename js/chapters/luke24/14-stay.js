// Łk 24,29 — At the door of the house, at sunset. The Stranger walks on down the road; Cleopas runs after Him and
// takes Him by the arm, his friend beckons towards the door: "Stay with us, for it is towards evening and the day is
// now far spent" — and the sun sinks behind the hills, the sky going violet. He goes in to stay with them: one after
// another they pass in at the door, and a lamp is lit inside — the window and the doorway glow gold.
import { C, blinkAt, pose, lerp } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { SUNSET, EVENING, emmausSet, RD, TRIO, roadTrio, headAt, kf } from './lib.js';

const GY = RD.GY;
const D = RD.DOOR;

export default {
  id: 'lk24-stay',
  beats: [
    { v: 29, text: 'Lecz przymusili Go, mówiąc: «Zostań z nami, gdyż ma się ku wieczorowi i dzień się już nachylił».' },
    { v: 29, cont: true, text: 'Wszedł więc, aby zostać z nimi.' },
  ],
  cam: { x: [560, 900], y: [-20, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: SUNSET, sky2: EVENING, sunAt: [1260, 330], house: true, tone: 0.45 });
    const R = roadTrio(S, E.act, E.fx);

    return (t, T) => {
      E.update(T, { sunY: lerp(330, 600, es(t, 0.1, 1.2)) });
      E.sk2.fade(es(t, 0.5, 1.6));
      E.starL.fade(es(t, 1.4, 2.0) * 0.6);
      E.tint.fade(es(t, 0.6, 1.8) * 0.16);

      /* v29a: they urge Him to stay */
      const sx = kf(t, [[0, 1330], [0.45, 1450], [1.05, 1450], [1.55, D + 4]], ease.sine);
      const turn = t > 0.55 && t < 1.05 ? true : t >= 1.05;
      const stGo = (t > 0 && t < 0.45) || (t > 1.05 && t < 1.55);
      const stIn = es(t, 1.5, 1.62);
      R.stSet({ x: sx, y: GY + 2, s: TRIO.S + 0.02, flip: turn, walk: stGo ? sx * 0.05 : undefined, amt: 0.8, o: 1 - stIn, armF: 34, armB: 10 + bump(t, 0.1, 0.5) * 40, head: 4 - bump(t, 0.6, 1.0) * 8, blink: blinkAt(T, 6) });
      R.halo(0.3);
      const cx = kf(t, [[0.05, 1170], [0.5, 1320], [1.05, 1320], [1.4, D - 4]], ease.sine);
      const cGo = (t > 0.05 && t < 0.5) || (t > 1.05 && t < 1.4);
      const plead = es(t, 0.4, 0.6) * (1 - es(t, 1.0, 1.1));
      const cIn = es(t, 1.36, 1.46);
      R.cl.p.set({ x: cx, y: GY + 4, s: TRIO.S, flip: t > 1.05, walk: cGo ? cx * 0.05 : undefined, amt: 1, o: 1 - cIn, lean: plead * 6, armF: 22 + plead * 70, armB: 12 + plead * 40, head: -plead * 8, blink: blinkAt(T, 4) });
      const fx = kf(t, [[1.3, 1040], [1.8, D - 2]], ease.sine);
      const fGo = t > 1.3 && t < 1.8;
      const beck = es(t, 0.45, 0.7) * (1 - es(t, 1.2, 1.3));
      const fIn = es(t, 1.76, 1.86);
      R.fr.p.set({ x: fx, y: GY - 2, s: TRIO.S, walk: fGo ? fx * 0.05 : undefined, amt: 0.9, o: 1 - fIn, armF: 20 + beck * 30, armB: 10 + beck * (100 + Math.sin(t * 20) * 20), head: -beck * 6, blink: blinkAt(T, 1) });
      fade(R.fr.sad, 0.2);
      fade(R.cl.sad, 0.2);

      /* v29b: He goes in with them; the lamp is lit */
      fade(E.door, es(t, 1.35, 1.55) * 0.85 + es(t, 1.8, 2.0) * 0.15);
      fade(E.win, es(t, 1.7, 1.95));

      S.cam.x = lerp(860, 700, es(t, 1.0, 1.8));
      S.cam.y = 16;
      S.cam.z = S.portrait ? 0.98 : 1.06;
      void seg; void C;
    };
  },
};
