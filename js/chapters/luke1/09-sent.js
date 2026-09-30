// Łk 1,26–27 — in the sixth month (six moons come out in a row, the sixth one full) the angel Gabriel is sent from God:
// a light opens high above and he flies down across the sky to a town of Galilee — Nazareth, with its little street.
// To a virgin betrothed to a man named Joseph, of the house of David: Joseph at his workbench, David's crowned medallion
// over him. And the virgin's name was Mary: she comes out of her door with her water jar; the angel comes down over her house.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import {
  JOSEPH, MARY, DAVID, nazarethSet, houseLight, NGY as GY, gabriel, medal, RIM, hungWord, moonDisc, glowDisc, rayBurst, waterJar, sparkle,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { square } from '../mark6/lib.js';

const DAYC = ['#cfe0da', '#f1e5c9', '#f7e9cf'];
const JX = 640, MX = 1000;

export default {
  id: 'lk1-sent',
  beats: [
    { v: 26 },
    { v: 27, text: 'do Dziewicy poślubionej mężowi, imieniem Józef, z rodu Dawida;' },
    { v: 27, cont: true, text: 'a Dziewicy było na imię Maryja.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const N = nazarethSet(S, DAYC, { k: 0 });
    const high = N.G.add(`<g>${glowDisc(260, 'halo-glow', 1)}${rayBurst(c, { n: 24, r0: 40, r1: 360, spread: 0.024, o: 0.35 })}</g>`);
    const moons = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: hanging(N.hangL, i === 5 ? `${glowDisc(50, 'halo-glow', 1)}${moonDisc(c, 20)}` : `<g opacity=".8">${moonDisc(c, 15)}</g>`, { x: 0, y: -1500, len: 800 }) }));
    const fly = S.layer({ par: 0.2, sh: 6 });
    const town = fly.add(hungWord(c, tr('Nazaret w Galilei', 'Nazareth of Galilee'), { size: 24 }));
    const david = hanging(fly, medal(S, DAVID, { r: 44, ...RIM.king, king: true, name: tr('Józef, z rodu Dawida', 'Joseph, of David’s house'), size: 19 }), { x: 0, y: -1500, len: 900 });
    const mName = fly.add(hungWord(c, tr('Maryja', 'Mary'), { size: 26 }));

    const P = N.P;
    const jo = S.puppet(P.add(person(c, { ...JOSEPH, holdF: `<g transform="translate(0 2) rotate(-40)">${square(c)}</g>` })));
    const ma = S.puppet(P.add(person(c, { ...MARY, holdB: `<g transform="translate(-2 46)">${waterJar(c, 50)}</g>` })));
    const aGlow = S.layer({ par: 0.25, sh: 1, flat: true }).add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);
    const angL = S.layer({ par: 0.25, sh: 5 });
    const ang = S.puppet(angL.add(gabriel(c)));
    const sparks = [0, 1, 2, 3].map((i) => angL.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v26: the sixth month; sent from God to Nazareth */
      moons.forEach((m) => { const k = es(t, 0.02 + m.i * 0.06, 0.2 + m.i * 0.06, ease.out) * (1 - es(t, 1.0, 1.2, ease.in)); swing(m.el, 700 + m.i * 90, lerp(-1500, 175 + (m.i % 2) * 20, k), T, 1.2, 0.7, m.i); });
      const hk = es(t, 0.1, 0.35);
      pose(high, { x: 470, y: 110, s: 0.5 + hk * 0.6, r: t * 3, o: hk * (1 - es(t, 1.4, 1.8) * 0.7) });
      const fl = es(t, 0.3, 0.8);
      const f2 = es(t, 2.0, 2.4);
      const ax = lerp(lerp(500, 860, fl), 1000, f2), ay = lerp(lerp(170, 350, fl), 380, f2);
      ang.set({ x: ax, y: ay, s: lerp(0.5, 0.72, fl), flip: false, lean: 18 - fl * 12, o: es(t, 0.25, 0.35), armF: 70, armB: 40, head: -6, blink: blinkAt(T, 2) });
      pose(aGlow, { x: ax, y: ay - 100, s: 0.6 + fl * 0.3, o: es(t, 0.25, 0.35) });
      const tk = es(t, 0.55, 0.8, ease.out) * (1 - es(t, 1.05, 1.25, ease.in));
      pose(town, { x: 800, y: lerp(-1100, 430, tk), r: Math.sin(T * 0.8) * 1.2, o: tk > 0.002 ? 1 : 0 });

      /* v27a: a virgin betrothed to Joseph, of the house of David */
      const work = t < 1.0 ? Math.max(0, Math.sin(T * 3)) * 20 : 0;
      jo.set({ x: JX, y: GY, s: 1, flip: false, armF: 50 + work, armB: 10, head: 6 - bump(t, 1.2, 1.9) * 12, blink: blinkAt(T, 1) });
      const dk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      swing(david, JX, lerp(-1500, 330, dk), T, 1.2, 0.7, 1);

      /* v27b: and her name was Mary */
      const mOut = es(t, 2.05, 2.4);
      houseLight(N.M, { open: es(t, 1.95, 2.1), lit: 0.4 });
      houseLight(N.J, { open: 0.3, lit: 0.3 });
      ma.set({ x: lerp(N.M.doorX, MX - 30, mOut), y: GY, s: 0.96, flip: true, o: mOut > 0.001 ? 1 : 0, walk: mOut > 0 && mOut < 1 ? t * 28 : undefined, armF: 10, armB: 16, head: -es(t, 2.5, 2.8) * 10, blink: blinkAt(T, 3) });
      const mk = es(t, 2.3, 2.55, ease.out);
      pose(mName, { x: MX - 30, y: lerp(-1100, 440, mk), r: Math.sin(T * 0.8 + 1) * 1.2, o: mk > 0.002 ? 1 : 0 });
      sparks.forEach((sp, i) => { const kk = seg(t, 2.4 + i * 0.06, 2.8 + i * 0.06); pose(sp, { x: ax - 40 + i * 30, y: ay - 120 + kk * 60, s: 1 - kk * 0.5, r: t * 90, o: bump(t, 2.4 + i * 0.06, 2.8 + i * 0.06) }); });

      S.cam.z = 1.03 + es(t, 1.0, 1.5) * 0.03;
      S.cam.y = 0;
      S.cam.x = lerp(-20, 0, es(t, 0.3, 1.0)) + es(t, 2.0, 2.5) * 20;
    };
  },
};
