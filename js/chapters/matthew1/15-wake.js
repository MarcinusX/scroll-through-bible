// Mt 1,24 — dawn over Nazareth. On the roof Joseph wakes from his sleep, sits up, stands; he takes the little scroll he
// wrote in the night and tears it in two. He comes out of his door and goes up the street to Mary's house; she comes
// out, he takes her hand, and they walk back together to his house, where a garland hangs over the door.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import {
  DAWN, DAY, JOSEPH, MARY, nazarethSet, houseLight, GY, lyingPerson, glowDisc, rayBurst, sparkle, hungWord,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { garland } from '../mark2/lib.js';

const RY = GY - 170;          // Joseph's roof

export default {
  id: 'mt1-wake',
  beats: [
    { v: 24, text: 'Zbudziwszy się ze snu, Józef uczynił tak, jak mu polecił anioł Pański:' },
    { v: 24, cont: true, text: 'wziął swoją Małżonkę do siebie,' },
  ],
  cam: { x: [-40, 30], y: [-40, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const N = nazarethSet(S, DAWN, { k: 0.08 });
    const sunEl = hanging(N.hangL, sun(c, 42), { x: 1150, y: 420, len: 900 });
    const sunGlow = N.G.add(`<g>${glowDisc(260, 'warm-glow', 1)}</g>`);

    /* ---------- on the roof: lying, sitting, standing; the little scroll ---------- */
    const R = S.layer({ par: 0.3, sh: 5 });
    const lying = R.add(`<g>${lyingPerson(c, JOSEPH, 0.66)}</g>`);
    const sit = S.puppet(R.add(person(c, { ...JOSEPH, pose: 'sit' })));
    const rolledM = sheet().p(c.cut(c.ell(0, 0, 6, 13, 10), 0.2, 3), C.parchment).x(c.ribbon([[-6, 0], [6, 0]], 2), C.terracotta).out();
    const stand = S.puppet(R.add(person(c, { ...JOSEPH, holdF: `<g transform="translate(0 2) rotate(80)">${rolledM}</g>` })));
    const scrollLying = R.add(`<g>${rolledM}</g>`);
    const halves = [-1, 1].map((d) => ({ d, el: R.add(`<g>${sheet().p(c.cut([[0, -12], [d * 18, -13], [d * 20, 12], [0, 11], [d * 4, 4], [0, -2]], 0.4, 4), C.parchment).x(c.ribbon([[d * 5, -4], [d * 15, -5]], 1.1) + c.ribbon([[d * 5, 3], [d * 14, 3]], 1.1), C.ink, 'opacity=".5"').out()}</g>`) }));

    /* ---------- in the street ---------- */
    const walkJ = S.puppet(N.P.add(person(c, JOSEPH)));
    const walkM = S.puppet(N.P.add(person(c, MARY)));
    const G = S.layer({ par: 0.3, sh: 6 });
    const gar = G.add(`<g>${garland(c, 150, 26)}</g>`);
    const sparks = [0, 1, 2, 3, 4].map((i) => G.add(`<g>${sparkle(c, 9 + (i % 2) * 5)}</g>`));
    const LX = 430;                 // where he lies on the roof

    return (t, time) => {
      /* the sun comes up */
      const rise = es(t, 0, 1.6);
      N.sk.blend(DAWN, DAY, rise);
      swing(sunEl, 1150, lerp(420, 190, rise), time, 1, 0.5);
      pose(sunGlow, { x: 1150, y: lerp(420, 190, rise), s: 1, o: 0.6 });

      /* v24a: he wakes, sits up, stands, tears the scroll, comes down and out of his door */
      const up1 = es(t, 0.12, 0.18), up2 = es(t, 0.26, 0.32), gone = es(t, 0.52, 0.58);
      pose(lying, { x: LX, y: RY - 6, o: 1 - up1 });
      sit.set({ x: LX + 40, y: RY - 2, s: 0.9, flip: false, o: up1 * (1 - up2), armF: 30, armB: 10, head: -bump(t, 0.15, 0.3) * 10, blink: blinkAt(time, 1) });
      const tear = es(t, 0.36, 0.44);
      stand.set({ x: LX + 44, y: RY - 2, s: 0.9, flip: false, o: up2 * (1 - gone), armF: 60 + tear * 20, armB: 10 + tear * 70, head: 6, blink: blinkAt(time, 1) });
      pose(scrollLying, { x: LX + 100, y: RY - 12, r: 90, o: up2 < 0.5 ? 1 : 0 });
      halves.forEach((h) => {
        const f = seg(t, 0.42, 0.9);
        pose(h.el, { x: LX + 100 + h.d * (10 + f * 90), y: RY - 110 + f * f * 380, r: h.d * f * 260, o: tear > 0.98 && f < 0.98 ? 1 : 0 });
      });
      const out = es(t, 0.55, 0.62);
      const toM = es(t, 0.6, 1.02), back = es(t, 1.32, 1.72);
      const hand = es(t, 1.22, 1.32);
      const jx = lerp(N.J.doorX, 876, toM) + (560 - 876) * back;
      const jWalk = (toM > 0 && toM < 1) || (back > 0 && back < 1);
      walkJ.set({ x: jx, y: GY, s: 1, flip: back > 0.01, o: out, walk: jWalk ? t * 30 : undefined, armF: 10 + hand * 44 * (1 - back) + bump(t, 1.05, 1.25) * 30, armB: 10 - hand * 50 * es(t, 1.3, 1.4), head: 0, blink: blinkAt(time, 1) });
      houseLight(N.J, { open: es(t, 0.5, 0.58) * (1 - es(t, 0.7, 0.8) * 0.6) + es(t, 1.55, 1.7) * 0.6, lit: 0.5 });

      /* v24b: Mary comes out; he takes her hand; they go to his house together */
      const mOut = es(t, 1.02, 1.18);
      const mx = lerp(N.M.doorX, 956, mOut) + (640 - 956) * back;
      walkM.set({ x: mx, y: GY, s: 0.96, flip: back < 0.01, o: mOut, walk: (mOut > 0 && mOut < 1) || (back > 0 && back < 1) ? t * 30 + 1 : undefined, armF: 10 + hand * 40, armB: 6, head: -hand * 6, blink: blinkAt(time, 3) });
      houseLight(N.M, { open: es(t, 0.98, 1.08), lit: 0.4 });
      const gk = es(t, 1.4, 1.62, ease.back);
      pose(gar, { x: N.J.doorL - 52, y: GY - 108, sx: Math.max(0.001, gk), o: gk > 0.002 ? 1 : 0 });
      sparks.forEach((sp, i) => { const kk = seg(t, 1.5 + i * 0.05, 1.95 + i * 0.05); pose(sp, { x: N.J.doorL - 40 + i * 40, y: GY - 120 - kk * 60, s: 1 - kk * 0.5, r: t * 90, o: bump(t, 1.5 + i * 0.05, 1.95 + i * 0.05) }); });

      S.cam.z = 1.12 + es(t, 0.0, 0.3) * 0.04 - es(t, 0.55, 0.9) * 0.06;
      S.cam.x = lerp(-30, 0, es(t, 0.55, 1.0)) - es(t, 1.3, 1.7) * 20;
      S.cam.y = 20 - bump(t, 0, 0.6) * 30;
    };
  },
};
