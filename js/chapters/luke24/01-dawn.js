// Łk 24,1–2 — The garden before dawn: the stars go out one by one, the moon sets, the sky turns violet and rose over
// Jerusalem. Along the path come the women who had followed Him from Galilee — Mary Magdalene, Joanna, Mary the
// mother of James and Susanna — each with a jar of the spices they had prepared, a lantern paling in the dawn.
// They come round the olive and stop: the great stone lies rolled away from the doorway, and the dark mouth of the
// tomb stands open.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from './lib.js';
import { moon, stars } from '../../assets/nature.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { WOMEN, NIGHT, PRE, ROSE, tombGarden, OPEN, SR, STONE_Y, DX, DYD, PATH, pathS, along, headAt, sparkle, spiceJar, lantern, GLYPH, upright, JARS as JAR, PI } from './lib.js';

const WALK = [...PATH, [720, 727]];   // on round the olive, nearer the doorway
const WALK_P = [...WALK, [840, 722]];  // phone: a step nearer still, so the women and the stone share the screen

export default {
  id: 'lk24-dawn',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-60, 380], y: [-20, 40], z: [0.86, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    const pre = sky(S, PRE, { name: 'pre', rise: 0 }).layer;
    const rose = sky(S, ROSE, { name: 'rose', rise: 0 }).layer;
    pre.fade(0); rose.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const starA = hangL.add(`<g>${stars(c, { x0: -800, x1: 2400, y0: -400, y1: 380, n: 70 })}</g>`);
    const starB = hangL.add(`<g>${stars(c, { x0: -800, x1: 2400, y0: -400, y1: 300, n: 40 })}</g>`);
    const moonEl = hanging(hangL, moon(c, 30), { x: 1240, y: 170, len: 700 });
    const dawnGlow = hangL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="900" ry="260" fill="url(#warm-glow)"/></g>`);

    const G = tombGarden(S, { tint: 0.28 });
    const L = G.front;

    /* the women with their spices; Joanna carries the lantern */
    const W = WOMEN.map((w, i) => {
      const [col, lid] = JAR[i];
      const holdF = `<g transform="translate(2 8)">${spiceJar(c, col, lid)}</g>`;
      const holdB = i === 1 ? `<g transform="translate(0 -2) scale(.8)">${lantern(c, { col: C.apricot })}</g>` : '';
      return { ...w, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...w.o, holdF, holdB }))) };
    });
    const lanternGlow = W[1].p.armB.querySelector('.glow');
    const stoneSpark = G.ground.add(`<g opacity="0">${sparkle(c, 18)}</g>`);
    const qs = [0, 1].map(() => L.add(`<g>${GLYPH.q(c)}</g>`));

    return (t, time) => {
      pose(G.stone, { x: OPEN, y: STONE_Y, r: ((OPEN - DX) / SR) * 57.3 });
      pose(G.cord, { o: 0 });
      /* cover + v1: the stars go out, the moon sets, dawn */
      const dawn = es(t, 0.9, 2.2);
      pre.fade(es(t, 0.8, 1.5));
      rose.fade(es(t, 1.3, 2.3));
      fade(starA, 1 - es(t, 0.9, 1.6));
      fade(starB, 1 - es(t, 1.2, 2.0));
      swing(moonEl, 1240 + es(t, 0.9, 2.4) * 120, 170 + es(t, 0.9, 2.4) * 360, time, 1, 0.6, 1);
      pose(dawnGlow, { x: 900, y: 470, s: 0.6 + dawn * 0.5, o: es(t, 1.0, 2.2) * 0.85 });

      /* v1: they come along the path with the spices */
      const go = es(t, 1.02, 2.2, ease.out);
      const stop = es(t, 2.05, 2.3);
      const heads = [];
      const P = S.portrait;
      W.forEach((w) => {
        const [x, y] = along(P ? WALK_P : WALK, Math.max(0, go - w.i * (P ? 0.045 : 0.07)));
        const s = pathS(y) * 1.02;
        const walking = go > 0.001 && go < 0.999 - w.i * 0.02;
        const see = es(t, 2.08 + w.i * 0.04, 2.3 + w.i * 0.04);
        const armF = 22 + see * (w.i === 0 ? 34 : 8);
        w.p.set({ x, y, s, walk: walking ? x * 0.05 + w.i : undefined, amt: 0.8, lean: -see * 4, armF, armB: w.i === 1 ? 32 - see * 8 : 10 + see * (w.i === 2 ? 60 : 12), head: -see * 8, blink: blinkAt(time, w.seed), o: seg(t, 1.0, 1.06) });
        upright(w.p, 'F', armF);
        heads.push(headAt(x, y, s, false));
      });
      fade(lanternGlow, 1 - es(t, 1.6, 2.6));

      /* v2: the stone rolled away — the first light catches it; the open doorway */
      const k = es(t, 2.1, 2.5);
      pose(G.doorGlow, { x: DX, y: DYD, o: k * 0.18 });
      const sp = bump(t, 2.2, 2.95);
      pose(stoneSpark, { x: OPEN + 20, y: STONE_Y - SR + 10, s: sp * 1.3, r: time * 30, o: sp });
      qs.forEach((q, i) => {
        const [hx, hy] = heads[i * 2];
        const b = es(t, 2.3 + i * 0.1, 2.5 + i * 0.1, ease.back);
        pose(q, { x: hx + 16, y: hy - 44, s: b, o: b > 0.01 ? 1 : 0 });
      });

      S.cam.x = S.portrait ? lerp(140, 20, es(t, 1.4, 2.0)) + es(t, 2.0, 2.4) * 280 + (1 - es(t, 0.85, 1.25)) * 230 : lerp(120, 70, es(t, 1.3, 2.4));
      S.cam.y = 20 - es(t, 0.8, 2) * 20;
      S.cam.z = S.portrait ? 0.92 - es(t, 2.0, 2.4) * 0.04 : 1.02 + es(t, 1.9, 2.8) * 0.03;
      void PI; void stop;
    };
  },
};
