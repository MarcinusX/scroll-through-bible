// Łk 24,8–9 — Out in the garden in the full morning. The women come out of the doorway and stand still: His words
// come back to them — a little light kindles over each of them, and a medallion of the Lord hangs above, bright.
// Then they turn and hurry back along the path towards the city; up in the flies the Eleven come down one by one on
// their strings, and more faces after them — "the Eleven and all the rest" — waiting for the news.
import { C, CAST, person, blinkAt, pose, lerp, sky, hanging, swing, crowdPerson } from './lib.js';
import { sun, cloud } from '../../assets/nature.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { WOMEN, JARS, GOLD, tombGarden, OPEN, SR, STONE_Y, DX, DYD, PATH, pathS, along, headAt, spiceJar, medallion, spark, sparkle, ELEVEN, hangK, upright, PI } from './lib.js';

const OUT = [[880, 718], [800, 722], [720, 726], [640, 730]];   // where the women stand outside the doorway

export default {
  id: 'lk24-remembered',
  beats: [
    { v: 8 },
    { v: 9 },
  ],
  cam: { x: [-460, 120], y: [-30, 40], z: [0.9, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep }), { x: 1300, y: 160, len: 900 });
    const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 150, len: 700 });
    const G = tombGarden(S);
    const L = G.front;
    const W = WOMEN.map((w, i) => {
      const holdF = `<g transform="translate(2 8)">${spiceJar(c, JARS[i][0], JARS[i][1])}</g>`;
      return { ...w, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...w.o, holdF }))) };
    });
    const lights = W.map(() => L.add(`<g>${spark(c, 10)}</g>`));

    /* the Lord's medallion; the Eleven and the rest in the flies */
    const fx = S.layer({ par: 0.3, sh: 5 });
    const lord = hanging(fx, `<circle r="70" fill="url(#halo-glow)"/>${medallion(c, CAST.jesus, { r: 40, back: C.halo, rim: C.haloRim })}`, { x: 0, y: 0, len: 900 });
    const rays = fx.add(`<g>${sparkle(c, 16)}</g>`);
    const faces = ELEVEN.map((m, i) => ({ i, el: hanging(fx, medallion(c, m.o, { r: 24 }), { x: 0, y: 0, len: 900 }) }));
    const rest = [0, 1, 2, 3, 4].map((i) => ({ i, el: hanging(fx, medallion(c, crowdPerson(c), { r: 18, back: C.linen2 }), { x: 0, y: 0, len: 900 }) }));

    return (t, T) => {
      swing(sunEl, 1300, 160, T, 0.8, 0.5);
      swing(cl, 560 + (T ? Math.sin(T * 0.1) * 30 : 0), 150, T, 1.2, 0.6, 1);
      pose(G.stone, { x: OPEN, y: STONE_Y, r: ((OPEN - DX) / SR) * 57.3 });
      pose(G.cord, { o: 0 });
      pose(G.doorGlow, { x: DX, y: DYD, o: 0.3 });

      /* v8: they remember His words */
      const rem = es(t, 0.15, 0.5);
      const lk = es(t, 0.1, 0.4, ease.back) * (1 - es(t, 1.2, 1.45, ease.in));
      hangK(lord, lk, 760, 250, T, 0);
      const rb = bump(t, 0.35, 0.95);
      pose(rays, { x: 800, y: 210, s: rb * 1.4, r: T * 25, o: rb });

      /* v9: they hurry back along the path to the city */
      const go = es(t, 1.08, 1.95, ease.in);
      W.forEach((w) => {
        const [ox, oy] = OUT[w.i];
        const turn = es(t, 1.0 + w.i * 0.03, 1.08 + w.i * 0.03);
        const u = Math.max(0, go * 1.25 - w.i * 0.06);
        const [px, py] = along(PATH.slice().reverse(), Math.min(1, u) * 0.36);
        const toPath = es(t, 1.02 + w.i * 0.04, 1.3 + w.i * 0.04);
        const x = lerp(ox, px, toPath), y = lerp(oy, py, toPath);
        const s = pathS(y) * 1.02;
        const moving = t > 1.02 + w.i * 0.04 && u < 1;
        const look = rem * (1 - turn);
        const armF = 22 + look * 10;
        w.p.set({ x, y, s, flip: turn > 0.5, walk: moving ? x * 0.07 + w.i : undefined, amt: 1.2, lean: moving ? 6 : 0, armF, armB: 10 + look * (w.i === 1 ? 50 : 20), head: -look * 12, blink: blinkAt(T, w.seed) });
        upright(w.p, 'F', armF);
        const [hx, hy] = headAt(x, y, s, turn > 0.5);
        const lg = es(t, 0.3 + w.i * 0.1, 0.55 + w.i * 0.1, ease.back) * (1 - es(t, 1.4, 1.7));
        pose(lights[w.i], { x: hx, y: hy - 52, s: lg * (1 + (T ? Math.sin(T * 3 + w.i) * 0.08 : 0)), o: lg > 0.01 ? 1 : 0 });
      });
      faces.forEach((f) => {
        const k = es(t, 1.35 + f.i * 0.03, 1.6 + f.i * 0.03, ease.back);
        // phone: the camera has gone with the women towards the city, so the row hangs further left to stay on screen
        const x = S.portrait ? 404 + f.i * 54 : 470 + f.i * 58, y = 206 + (f.i % 2) * 22;
        hangK(f.el, k, x, y, T, f.i);
      });
      rest.forEach((f) => {
        const k = es(t, 1.62 + f.i * 0.04, 1.85 + f.i * 0.04, ease.back);
        hangK(f.el, k, (S.portrait ? 450 : 520) + f.i * 100, 290 + (f.i % 2) * 14, T, f.i + 11);
      });

      S.cam.x = lerp(S.portrait ? 60 : 90, S.portrait ? -440 : -440, es(t, 1.1, 1.95));
      S.cam.y = 20;
      S.cam.z = S.portrait ? 0.92 : 1.04;
      void PI; void fade; void seg;
    };
  },
};
