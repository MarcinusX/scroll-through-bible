// Łk 1,23–25 — his days of service over, Zechariah walks home up the hill road in the evening; Elizabeth comes out to
// meet him. Then she conceives: the two go in, the door shuts, a warm light glows in the window, and five moons come out
// one by one over the hidden house. At last she steps out into the morning with lifted hands — "the Lord has done this
// for me" — and the grey shawl of her reproach lifts off her shoulders and flies away into the light.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import {
  ZECHARIAH, ELIZABETH, zechMute, HILLEVE, HILLNIGHT, HILLDAY, hillHome, homeLight, hillFront, HGY, moonDisc, glowDisc, rayBurst, sparkle,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const EX = 800;

export default {
  id: 'lk1-home',
  beats: [
    { v: 23 },
    { v: 24 },
    { v: 25 },
  ],
  cam: { x: [-30, 30], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const MORN = ['#d9d3c9', '#f5dcc0', '#f8e8d0'];
    const W = hillHome(S, HILLEVE);
    const sunEl = hanging(W.hangL, sun(c, 42), { x: 1150, y: -1500, len: 800 });
    const moons = [0, 1, 2, 3, 4].map((i) => ({ i, el: hanging(W.G, moonDisc(c, 22), { x: 0, y: -1500, len: 800 }) }));
    const winGlow = W.G.add(`<g>${glowDisc(60, 'warm-glow', 1)}</g>`);
    const eGlow = W.G.add(`<g>${glowDisc(160, 'halo-glow', 0.85)}${rayBurst(c, { n: 16, r0: 60, r1: 170, spread: 0.03, o: 0.18 })}</g>`);
    const P = W.P;
    const z = S.puppet(P.add(zechMute(c)));
    const e = S.puppet(P.add(person(c, ELIZABETH)));
    const eJoy = S.puppet(P.add(person(c, ELIZABETH)));
    const shawl = P.add(`<g>${sheet().p(c.cut([[-34, -8], [-10, -18], [16, -16], [36, -4], [30, 20], [0, 14], [-28, 22]], 1, 5), mix(C.storm, C.stone2, 0.4)).x(c.ribbon([[-20, 0], [20, 2]], 1.6), shade(C.storm, -0.2), 'opacity=".6"').out()}</g>`);
    const sparks = [0, 1, 2, 3, 4].map((i) => P.add(`<g>${sparkle(c, 10 + (i % 2) * 4)}</g>`));
    hillFront(S);

    return (t, time) => {
      const T = time;
      /* skies: evening (v23) → night with five moons (v24) → morning (v25) */
      const night = es(t, 1.0, 1.3), morn = es(t, 2.0, 2.35);
      if (morn > 0) W.sk.blend(HILLNIGHT, MORN, morn); else W.sk.blend(HILLEVE, HILLNIGHT, night);
      W.starL.fade(night * (1 - morn));
      W.dim.fade(night * (1 - morn));
      swing(sunEl, 1150, lerp(-1500, lerp(330, 170, morn), morn > 0 ? 1 : es(t, 0, 0.2) * (1 - night)), T, 1, 0.7);
      moons.forEach((m) => {
        const k = es(t, 1.08 + m.i * 0.1, 1.26 + m.i * 0.1, ease.out) * (1 - es(t, 2.0, 2.25, ease.in));
        swing(m.el, 600 + m.i * 100, lerp(-1500, 190 + (m.i % 2) * 22, k), T, 1.2, 0.7, m.i);
      });

      /* v23: he comes home; she comes out to meet him */
      const walk = es(t, 0.05, 0.6);
      const zx = lerp(1450, 880, walk);
      const inside = es(t, 1.05, 1.35);
      const eOut = es(t, 0.3, 0.6);
      const ex = lerp(W.H.doorX, 700, eOut) + (W.H.doorX - 700) * inside;
      z.set({ x: zx + (W.H.doorX + 20 - 880) * inside, y: HGY, s: 1, flip: true, o: 1 - es(t, 1.3, 1.36), walk: (walk > 0 && walk < 1) || (inside > 0 && inside < 1) ? t * 28 : undefined, armF: 12 + bump(t, 0.6, 0.95) * 50, armB: 8, blink: blinkAt(T, 1) });
      e.set({ x: ex, y: HGY, s: 0.96, flip: inside > 0.02, o: (1 - es(t, 1.3, 1.36)) * (eOut > 0.001 ? 1 : 0), walk: (eOut > 0 && eOut < 1) || (inside > 0 && inside < 1) ? t * 28 + 1 : undefined, armF: 12 + bump(t, 0.6, 0.95) * 50, armB: 8, blink: blinkAt(T, 3) });

      /* v24: she conceives and hides herself five months — the door shut, a light in the window */
      const open = eOut * (1 - es(t, 1.35, 1.5)) + es(t, 2.05, 2.2);
      homeLight(W.H, { open, lit: es(t, 1.3, 1.6) * (1 - morn * 0.6) });
      pose(winGlow, { x: W.H.winX + 13, y: W.H.winY + 11, s: 0.6 + es(t, 1.4, 1.9) * 0.6, o: es(t, 1.35, 1.6) * (1 - morn) });

      /* v25: she comes out in the morning: the Lord has taken away my reproach */
      const come = es(t, 2.05, 2.3);
      const joy = es(t, 2.28, 2.4);
      eJoy.set({ x: lerp(W.H.doorX, EX, come), y: HGY, s: 0.96, flip: false, o: come > 0.001 ? 1 : 0, walk: come > 0 && come < 1 ? t * 28 : undefined, armF: 20 + joy * 50, armB: 12 + joy * 130, head: -joy * 14, blink: blinkAt(T, 3) });
      const lift = es(t, 2.38, 2.72, ease.in);
      pose(shawl, { x: lerp(W.H.doorX, EX, come) + 2 + lift * 160, y: HGY - 112 - lift * 420, r: lift * 70, s: 1 - lift * 0.3, o: come > 0.001 ? 1 - es(t, 2.62, 2.74) : 0 });
      pose(eGlow, { x: EX, y: HGY - 130, s: 0.5 + joy * 0.6, r: t * 3, o: joy });
      sparks.forEach((sp, i) => { const kk = seg(t, 2.6 + i * 0.03, 2.95 + i * 0.03); pose(sp, { x: EX + 160 + (i - 2) * 30, y: HGY - 500 - kk * 60, s: 1 - kk * 0.5, r: t * 90, o: bump(t, 2.6 + i * 0.03, 2.95 + i * 0.03) }); });

      S.cam.z = 1.03 + es(t, 1.1, 1.5) * 0.02 + es(t, 2.2, 2.6) * 0.03;
      S.cam.y = 20;
    };
  },
};
