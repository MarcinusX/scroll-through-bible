// Łk 17,36–37 — sunset on the road to Jerusalem, the city dark against the red sky. "They, answering, asked Him,
// 'Where, Lord?'": the four crowd in close round Jesus with their hands open, "Where, Lord?" in a bubble. "He said to
// them, 'Where the body is, there will the vultures also be gathered together'": Jesus lifts His hand to the sky over
// the far hills — and there, high up, dark vultures come gliding in from every side, one after another, and wheel
// round and round in a slow ring over one place in the distance.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, roadFour, vulture, bubble, voiceRings, headAt, halo, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const JX = 760, JY = 716;
const SPOT = { peter: [636, 722, false], andrew: [566, 732, false], john: [884, 722, true], james: [956, 732, true] };
const RING = { x: 1010, y: 210, rx: 190, ry: 46 };

export default {
  id: 'lk17-where',
  beats: [
    { v: 36 },
    { v: 37 },
  ],
  cam: { x: [-20, 60], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const R = roadSet(S, { village: false });
    const c = S.c;
    const birdL = S.layer({ par: 0.06, sh: 3 });
    const BIRDS = Array.from({ length: 7 }, (_, i) => ({ i, ph: (i / 7) * PI * 2, from: i % 2 ? 1 : -1, el: birdL.add(`<g opacity="0">${vulture(c, mix(C.soilDark, C.wood2, 0.35))}</g>`) }));
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const F = roadFour(S, act, c);
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    const fx = S.layer({ par: 0.45, sh: 5 });
    const ask = fx.add(`<g opacity="0">${bubble(c, tr('Gdzie, Panie?', 'Where, Lord?'), { size: 20, tail: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.9 + es(t, 0, 2) * 0.1, nightK: es(t, 0.8, 2) * 0.3, sunK: 0.95 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, o: 0.35 });

      /* v36 — "Where, Lord?" */
      const close = es(t, 0.05, 0.35);
      F.ds.forEach((d) => {
        const [x, y, fl] = SPOT[d.k];
        const ask1 = bump(t, 0.2, 1.1);
        const up = es(t, 1.2, 1.5);
        d.p.set({ x: x + (fl ? -1 : 1) * close * 26, y, s: 0.96, flip: fl ? up < 0.5 : false, armF: 14 + ask1 * 50 + up * 30, armB: 6 + ask1 * 40, head: -4 - up * 18, blink: blinkAt(T, d.seed) });
      });
      const [phx, phy] = headAt(SPOT.peter[0] + 26, SPOT.peter[1], 0.96, false);
      const ak = es(t, 0.25, 0.42, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(ask, { x: phx + 30, y: phy - 36, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v37 — He lifts His hand to the sky: the vultures gather and wheel */
      const point = es(t, 1.05, 1.3);
      F.jesus.set({ x: JX, y: JY, s: 1.04, armF: 16 + point * 130, armB: 8 + bump(t, 0.3, 1.0) * 30, head: -point * 16, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 1.02, 1.1) * (1 - es(t, 1.6, 1.7)), T, { dir: 1, spread: 2 });
      BIRDS.forEach((b) => {
        const k = es(t, 1.15 + b.i * 0.06, 1.55 + b.i * 0.06);
        const a = b.ph + (T ? T * 0.35 : 0) + t * 1.2;
        const rx = RING.x + Math.cos(a) * RING.rx * (0.7 + (b.i % 3) * 0.15), ry = RING.y + Math.sin(a) * RING.ry - (b.i % 3) * 18;
        const sx0 = RING.x + b.from * 900, sy0 = 120 + b.i * 20;
        const x = lerp(sx0, rx, k), y = lerp(sy0, ry, k);
        const dir = k < 1 ? -b.from : (Math.sin(a) > 0 ? -1 : 1);
        pose(b.el, { x, y, s: 0.78 + (b.i % 3) * 0.1, sx: dir, r: dir * (Math.cos(a) * 12) + (T ? Math.sin(T * 0.8 + b.i) * 4 : 0), o: k > 0.001 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 10], [1, 10], [1.4, 40], [2, 40]]);
      S.cam.y = kf(t, [[0, 30], [1, 30], [1.4, -40], [2, -40]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.08], [1.4, 1.0], [2, 1.0]]);
    };
  },
};
