// Łk 24,33a — That same hour, in the dark: the two run all the way back along the road under the stars and the moon,
// a lantern swinging in Cleopas' hand and their hearts still burning, towards Jerusalem on its hill, where a few
// lamps still shine in the windows.
import { C, blinkAt, pose, lerp } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { NIGHTROAD, emmausSet, RD, TRIO, roadTrio, bodyAt, handB, burningHeart, lantern, kf } from './lib.js';

const GY = RD.GY;

export default {
  id: 'lk24-night',
  beats: [
    { v: 33, text: 'W tej samej godzinie wybrali się i wrócili do Jerozolimy.' },
  ],
  cam: { x: [-620, 520], y: [0, 40], z: [0.96, 1.08] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: NIGHTROAD, moonAt: [300, 170], sunAt: [1250, -1400], tone: 0.7, starsOn: true, cityX: 60 });
    // lamps in the city far off
    const lamps = E.far.add(`<g opacity="0"><circle cx="60" cy="400" r="120" fill="url(#warm-glow)" opacity=".6"/><path d="${c.poly(c.rect(20, 398, 5, 6)) + c.poly(c.rect(88, 392, 5, 6)) + c.poly(c.rect(52, 380, 4, 5))}" fill="${C.lampFlame}"/></g>`);
    const R = roadTrio(S, E.act, E.fx, { stranger: false });
    const lan = E.act.add(`<g>${lantern(c, { col: C.apricot })}</g>`);
    const hearts = [0, 1].map(() => E.fx.add(`<g>${burningHeart(c, 12)}</g>`));
    const fl = hearts.map((h) => h.querySelector('.fl'));

    return (t, T) => {
      E.update(T, { moonY: 170 });
      E.tint.fade(0.22);
      fade(lamps, es(t, 0.4, 0.9));
      const gx = kf(t, [[0, 1150], [0.95, 420]], ease.sine);
      const run = t > 0 && t < 0.95;
      [[R.cl, gx - 60, GY + 4], [R.fr, gx + 60, GY - 2]].forEach(([m, x, y], i) => {
        m.p.set({ x, y, s: TRIO.S, flip: true, walk: run ? x * 0.09 + i * 2 : undefined, amt: run ? 1.35 : 0.6, lean: run ? 10 : 0, armF: run ? 40 : 24, armB: i === 0 ? 50 : 34, head: -4, blink: blinkAt(T, i * 3) });
        fade(m.sad, 0);
        const [hx, hy] = bodyAt(x, y, TRIO.S, true, 6, -104);
        pose(hearts[i], { x: hx, y: hy, s: 0.9, o: 1 });
        pose(fl[i], { x: 0, y: -7, sx: 1 + (T ? Math.sin(T * 7 + i) * 0.1 : 0), sy: 1 + (T ? Math.sin(T * 5.3 + i) * 0.12 : 0) });
      });
      // the lantern in Cleopas' back hand (arm raised 50°): hand position
      const a = 50 + (run ? Math.sin((gx - 60) * 0.09) * 14 * 1.35 : 0);
      const [lx, ly] = handB(gx - 60, GY + 4, TRIO.S, true, a);
      pose(lan, { x: lx, y: ly, r: run ? Math.sin(t * 40) * 8 : 0 });

      S.cam.x = Math.max(-620, Math.min(520, (gx - 800) * 1.8));
      S.cam.y = 20;
      S.cam.z = S.portrait ? 0.98 : 1.04;
      void lerp; void seg; void bump;
    };
  },
};
