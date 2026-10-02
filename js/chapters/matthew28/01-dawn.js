// Mt 28,1 — The garden at night: the great stone across the doorway, the cord and the seals on it, and the guard
// keeping watch with their spears (awake — the story they will be paid to tell is not true). The Sabbath is over:
// the stars go out one by one, the moon sets, the sky turns violet and rose over Jerusalem. Along the path come
// Mary Magdalene and the other Mary, a lantern paling in the dawn, to see the tomb.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, MARYJ, NIGHT, PRE, ROSE, tombGarden, soldier, SHUT, STONE_Y, DX, DYD, PATH, pathS, GUARD, along, headAt, sparkle, PI } from './lib.js';
import { lantern } from '../mark2/lib.js';
import { flame } from '../mark1/lib.js';


export default {
  id: 'mt28-dawn',
  beats: [
    { cover: true },
    { v: 1, text: 'Po upływie szabatu, o świcie pierwszego dnia tygodnia' },
    { v: 1, cont: true, text: 'przyszła Maria Magdalena i druga Maria obejrzeć grób.' },
  ],
  cam: { x: [-70, 160], y: [-20, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    const pre = sky(S, PRE, { name: 'pre', rise: 0 }).layer;
    const rose = sky(S, ROSE, { name: 'rose', rise: 0 }).layer;
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const starA = hangL.add(`<g>${stars(c, { x0: -800, x1: 2400, y0: -400, y1: 380, n: 70 })}</g>`);
    const starB = hangL.add(`<g>${stars(c, { x0: -800, x1: 2400, y0: -400, y1: 300, n: 40 })}</g>`);
    const moonEl = hanging(hangL, moon(c, 30), { x: 1240, y: 170, len: 700 });
    const dawnGlow = hangL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="900" ry="260" fill="url(#warm-glow)"/></g>`);
    const morning = hangL.add(`<g>${sparkle(c, 16)}</g>`);

    const G = tombGarden(S, { tint: 0.28 });

    /* the guard */
    const L = G.P;
    const fireGlow = L.add(`<g><circle r="150" fill="url(#warm-glow)"/></g>`);
    const fire = L.add(`<g>${flame(c, 30)}</g>`);
    const guards = GUARD.map((g) => ({ ...g, flip: true, seed: c.rr(0, 9), p: S.puppet(L.add(soldier(c, g.i, { spear: 30 }))) }));

    /* the two Marys */
    const W = [
      { o: { ...MAGD }, i: 0 },
      { o: { ...MARYJ, holdB: `<g transform="translate(0 -2) scale(.8)">${lantern(c, { col: C.apricot })}</g>` }, i: 1 },
    ].map((w) => ({ ...w, seed: c.rr(0, 9), p: S.puppet(G.front.add(person(c, w.o))) }));
    const lanternGlow = W[1].p.armB.querySelector('.glow');
    const look = [0, 1].map(() => G.front.add(`<g>${sparkle(c, 11)}</g>`));

    return (t, time) => {
      pose(G.stone, { x: SHUT, y: STONE_Y });
      pose(G.cord, { x: DX, y: DYD });
      /* v1a: the Sabbath is over — the stars go out, the moon sets, dawn */
      const dawn = es(t, 1.0, 2.0);
      pre.fade(es(t, 0.9, 1.6));
      rose.fade(es(t, 1.4, 2.6));
      fade(starA, 1 - es(t, 1.0, 1.7));
      fade(starB, 1 - es(t, 1.3, 2.2));
      swing(moonEl, 1240 + es(t, 1, 2.6) * 120, 170 + es(t, 1.0, 2.6) * 340, time, 1, 0.6, 1);
      pose(dawnGlow, { x: 900, y: 470, s: 0.6 + dawn * 0.5, o: es(t, 1.1, 2.2) * 0.85 });
      const sp = bump(t, 1.35, 2.2);
      pose(morning, { x: 880, y: 330, s: sp * (1 + (time ? Math.sin(time * 2) * 0.08 : 0)), r: time * 20, o: sp });

      /* the guard on watch (a little fire dying down at dawn) */
      guards.forEach((g, k) => {
        const turn = k === 0 ? es(t, 2.35, 2.6) : 0;          // the first one turns his head to the women
        g.p.set({ x: g.x, y: g.y, s: 0.98, flip: g.flip, armF: 30, armB: 8 + (k === 2 ? 30 : 0), head: -turn * 6 + (k === 2 ? 10 : 0), blink: blinkAt(time, g.seed) });
      });
      const fl = 1 - es(t, 1.6, 2.6) * 0.7;
      pose(fire, { x: 1382, y: DYD + 20, s: fl * (1 + (time ? Math.sin(time * 9) * 0.08 : 0)) });
      pose(fireGlow, { x: 1382, y: DYD - 10, s: 0.8, o: fl * 0.8 });

      /* v1b: along the path come Mary Magdalene and the other Mary */
      const go = es(t, 1.85, 2.72, ease.out);
      const heads = [];
      W.forEach((w) => {
        const [x, y] = along(PATH, go - w.i * (S.portrait ? 0.05 : 0.085));   // phone: the second Mary a step closer, inside the screen
        const s = pathS(y) * 1.02;
        const walking = go > 0 && go < 1;
        const up = es(t, 2.62, 2.8);
        const armF = 20 + up * (w.i === 0 ? 26 : 10);
        w.p.set({ x, y, s, walk: walking ? x * 0.05 + w.i : undefined, amt: 0.8, armF, armB: w.i === 1 ? 30 - up * 6 : 10 + up * 10, head: -up * 8, blink: blinkAt(time, w.seed) });
        heads.push(headAt(x, y, s, false));
      });
      fade(lanternGlow, 1 - es(t, 1.8, 2.8));
      look.forEach((el, i) => {
        const b = bump(t, 2.7 + i * 0.06, 3.0);
        pose(el, { x: heads[i][0] + 22, y: heads[i][1] - 34, s: b, r: time * 30, o: b });
      });

      S.cam.x = S.portrait ? lerp(140, -70, es(t, 1.9, 2.6)) : lerp(120, 40, es(t, 1.8, 2.6));
      S.cam.y = 20 - es(t, 0.8, 2) * 20;
      S.cam.z = 1.02 + es(t, 1.9, 2.8) * 0.03;
    };
  },
};
