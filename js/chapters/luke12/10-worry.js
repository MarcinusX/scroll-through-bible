// Łk 12,22–23 — back on the plain in the late afternoon; the crowd has sat down, and the disciples sit on the grass
// round the rise. "Do not be anxious for your life, what you will eat, nor for your body, what you will wear": grey
// worry-clouds gather over their heads, each with its care painted on it — a loaf, a bowl, a cloak; Jesus opens His hands
// and the clouds are drawn back up into the flies. "Life is more than food, and the body more than clothing": a great
// balance comes down over Him: on one pan the little flame of a life and a small paper man, on the other a loaf and a
// cloak — and the side of the life goes down.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tunic } from '../mark6/lib.js';
import { plainSet, RISE, GOLDEN, seatDisciples, poseSeated, careCloud, balance10, soulLight, loaf, bowl, headAt, voiceRings, PI } from './lib.js';

const JX = 800;
const PIV = [800, 196];

export default {
  id: 'lk12-worry',
  beats: [
    { v: 22 },
    { v: 23 },
  ],
  cam: { x: [-20, 20], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const P = plainSet(S, { skyCols: ['#d3dbd0', '#f1dcb6', '#f6e3c2'], crowd: 'sit', near: false });
    const c = S.c;
    const dis = seatDisciples(S, P);
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    const clouds = [
      { icon: `<g transform="translate(0 8)">${loaf(c, 16)}</g>`, x: 616, y: 480 },
      { icon: `<g transform="translate(0 12)">${bowl(c, { w: 30, food: 'stew' })}</g>`, x: 694, y: 440 },
      { icon: `<g transform="translate(0 4) scale(.62)">${tunic(c)}</g>`, x: 984, y: 470 },
    ].map((m, i) => ({ ...m, i, el: P.fx.add(`<g opacity="0">${careCloud(c, m.icon)}</g>`) }));

    const B = balance10(c, { arm: 170, drop: 110, pan: 120, col: C.ochre });
    const bl = P.hangL;
    const frame = bl.add(`<g><path d="M0 -80V-2400" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${B.frame}</g>`);
    const beamB = bl.add(`<g>${B.beam}</g>`);
    const panL = bl.add(`<g>${B.panL}<g transform="translate(-16 84)">${soulLight(c, 12)}</g><g transform="translate(24 108) scale(.34)">${person(c, { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2 })}</g></g>`);
    const panR = bl.add(`<g>${B.panR}<g transform="translate(-20 106)">${loaf(c, 18)}</g><g transform="translate(24 90) scale(.72)">${tunic(c)}</g></g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      P.crowd.forEach((g) => g.sp.set({ x: g.x, y: g.y, s: 1, o: g.y > 600 && g.x > 380 && g.x < 1220 ? 0 : 1 }));
      /* v22 — do not be anxious */
      const open = es(t, 0.45, 0.65);
      const teach = bump(t, 1.1, 1.9);
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, armF: 16 + bump(t, 0.05, 0.45) * 40 + open * 50 + teach * 20, armB: 8 + open * 70 + teach * 40, head: -open * 6, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, RISE, P.J.s, false);
      voice(hx, hy, bump(t, 0.05, 0.6) + teach * 0.6, T, { spread: 2 });
      poseSeated(dis, T, (d) => {
        const worry = es(t, 0.1 + d.i * 0.03, 0.3 + d.i * 0.03) * (1 - es(t, 0.6, 0.8));
        return { armF: 22 + worry * 40, head: -6 + worry * 16 - es(t, 1.1, 1.4) * 10 };
      });
      clouds.forEach((cl) => {
        const k = es(t, 0.08 + cl.i * 0.06, 0.3 + cl.i * 0.06, ease.back);
        const up = es(t, 0.6 + cl.i * 0.04, 0.95, ease.in);
        pose(cl.el, { x: cl.x, y: cl.y - up * 700 + (time ? Math.sin(T * 1.3 + cl.i) * 4 : 0), s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v23 — life more than food, the body more than clothing */
      const dk = es(t, 1.05, 1.35, ease.out);
      const py = lerp(-600, PIV[1], dk);
      const tilt = -es(t, 1.4, 1.75, ease.back) * 14 + (time ? Math.sin(T * 1.1) * 0.5 * dk : 0);
      const a = (tilt * PI) / 180;
      pose(frame, { x: PIV[0], y: py, o: dk > 0.002 ? 1 : 0 });
      pose(beamB, { x: PIV[0], y: py, r: tilt, o: dk > 0.002 ? 1 : 0 });
      pose(panL, { x: PIV[0] - Math.cos(a) * 170, y: py - Math.sin(a) * 170, o: dk > 0.002 ? 1 : 0 });
      pose(panR, { x: PIV[0] + Math.cos(a) * 170, y: py + Math.sin(a) * 170, o: dk > 0.002 ? 1 : 0 });

      S.cam.z = 1.06 + es(t, 0.05, 0.4) * 0.04 - es(t, 1.0, 1.3) * 0.06;
      S.cam.y = 30 - es(t, 1.0, 1.3) * 90;
    };
  },
};
