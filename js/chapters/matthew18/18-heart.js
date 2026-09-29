// Mt 18,35 — evening in the house at Capernaum. The parable is over; Jesus sits among the disciples and lays His
// hand on His heart: so my heavenly Father will do, unless each of you forgives his brother from the heart. Peter
// turns to his brother Andrew beside him; they kneel and hold each other — and from the two of them a heart of light
// rises up above the house and hangs there, glowing, over the closing card.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { capHouse, SEATS, FLOOR, TWELVE, EVENING, heart, kf, headAt, PI } from './lib.js';

const JX = 800, JY = 628;

export default {
  id: 'mt18-heart',
  beats: [
    { v: 35 },
  ],
  cam: { x: [-10, 10], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const H = capHouse(S, { skyCols: EVENING, sunAt: [1250, 300] });
    const c = S.c;
    const inL = S.layer({ par: H.P, sh: 5 });
    const sitters = [TWELVE[1], TWELVE[2], TWELVE[4], TWELVE[5], TWELVE[6], TWELVE[7], TWELVE[8]].map((d, i) => {
      const seat = [0, 1, 2, 3, 4, 8, 9][i];
      const [x, s] = SEATS[seat];
      return { x, s, flip: x > JX, seed: c.rr(0, 9), p: S.puppet(inL.add(person(c, { ...d.o, pose: 'sit' }))) };
    });
    const warm = inL.add(`<g opacity="0"><ellipse cx="0" cy="-40" rx="170" ry="120" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const peter = S.puppet(inL.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const andrew = S.puppet(inL.add(person(c, { ...CAST.andrew, pose: 'kneel' })));
    H.front();
    const hv = S.layer({ par: 0.2, sh: 5, rise: 0 });
    const big = hv.add(`<g opacity="0"><circle r="130" fill="url(#halo-glow)"/>${heart(c, 34, mix(C.jesusMantle, C.halo, 0.25))}</g>`);
    const small = inL.add(`<g opacity="0">${heart(c, 12)}</g>`);

    return (t, time) => {
      const T = time;
      H.update(T);
      const hand = es(t, 0.05, 0.25) * (1 - es(t, 0.45, 0.6));
      const open = es(t, 0.5, 0.7);
      jesus.set({ x: JX - 40, y: JY, s: 0.94, armF: 20 + hand * 26 + open * 50, armB: 10 + open * 60, head: 6 * hand - 4 * open, blink: blinkAt(T, 1) });
      const turn = es(t, 0.15, 0.3);
      const hug = es(t, 0.3, 0.5);
      peter.set({ x: lerp(820, 888, turn), y: 664, s: 0.9, flip: false, armF: 30 + hug * 50, armB: 20 + hug * 70, head: 6 + hug * 6, blink: blinkAt(T, 2) });
      andrew.set({ x: lerp(1010, 966, turn), y: 666, s: 0.9, flip: true, armF: 30 + hug * 50, armB: 20 + hug * 70, head: 6 + hug * 6, blink: blinkAt(T, 4) });
      pose(warm, { x: 928, y: 666, s: 0.6 + hug * 0.5, o: hug * 0.8 });
      sitters.forEach((d) => d.p.set({ x: d.x, y: 648, s: d.s, flip: d.flip, head: -es(t, 0.5, 0.8) * 12, blink: blinkAt(T, d.seed) }));

      const rise = es(t, 0.42, 0.8, ease.out);
      pose(small, { x: 928, y: lerp(560, 440, rise), s: 1, o: bump(t, 0.4, 0.62) });
      const bk = es(t, 0.55, 0.85, ease.out);
      pose(big, { x: 800, y: lerp(420, 236, bk), s: 0.6 + bk * 0.4 + Math.sin(T * 1.6) * 0.02 * bk, o: bk });

      S.cam.z = kf(t, [[0, 1.06], [0.7, 1.02]]);
      S.cam.y = kf(t, [[0, 30], [0.7, 10]]);
      S.cam.x = 0;
    };
  },
};
