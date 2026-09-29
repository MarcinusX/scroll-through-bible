// Łk 13,24 — a painted flat at dusk: a house on a rise with a long hall lit for a feast, the guests' heads in its
// windows, and in the middle of its wall one narrow door with warm light behind it; a path climbs up to it. "Strive to
// enter through the narrow door": a man climbs the path with a big bundle on his back, sets it down at the step, turns
// sideways and squeezes through into the light. "For many, I tell you, will seek to enter and will not be able": then
// many come up the path, laden with their bundles, and crowd and push at the doorway — and cannot get in.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { doorSet, DH, knot, bigBundle, kf, moving, es, ease, bump, seg, PI } from './lib.js';

const STRIVER = { robe: C.sageRobe, mantle: C.ochreRobe, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2, belt: C.leather };
const sAt = (y) => Math.min(1, lerp(0.62, 1.0, (y - 610) / (900 - 610)));

export default {
  id: 'lk13-door',
  enter: 'fly',
  beats: [
    { v: 24, text: '«Usiłujcie wejść przez ciasne drzwi;' },
    { v: 24, cont: true, text: 'gdyż wielu, powiadam wam, będzie chciało wejść, a nie będą mogli.' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.14] },
  build(S) {
    let inMan = null, glow = null;
    const D = doorSet(S, { insideFn: (L) => { glow = L.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/></g>`); inMan = S.puppet(L.add(person(S.c, STRIVER))); return inMan; } });
    const c = D.c;

    /* the many (still groups) and the one who strives */
    const crowd = [[660, 'a', 3, false, 640], [950, 'b', 3, true, 646], [800, 'c', 4, false, 668]].map(([x, k, n, flip, y], i) => ({ i, x, flip, sp: D.crowdL.sprite(knot('lk13-door-' + k, n, { s: 1, spread: 40, rows: 1, flip, arms: [40, 110], armB: [20, 90] }), x, y) }));
    const bundles = [0, 1, 2, 3].map((i) => D.crowdL.add(`<g>${bigBundle(c, [C.linen2, C.basket, C.stone, mix(C.clay, C.linen2, 0.5)][i])}</g>`));
    const man = S.puppet(D.act.add(person(c, STRIVER)));
    const bundle = D.act.add(`<g>${bigBundle(c, C.linen2)}</g>`);

    const MK = [[0.0, [640, 960]], [0.45, [790, 624]], [0.55, [800, 612]]];

    return (t, time) => {
      const T = time;
      D.update(T);
      pose(D.leaf, { x: DH.DX - DH.DW / 2, y: 528, sx: 0.001, o: 0 });

      /* v24a — one man climbs, sets his bundle down, squeezes through */
      const [mx, my] = kf(t, MK);
      const s = sAt(my);
      const walking = moving(t, MK.map(([a, b]) => [a, b[1]]));
      const through = es(t, 0.6, 0.64);
      const side = es(t, 0.52, 0.6);
      man.set({ x: mx, y: my, s, sx: 1, flip: false, walk: walking ? my * 0.08 : undefined, armF: 20 + side * 20, armB: 30 - side * 20, head: -4, o: 1 - through });
      const drop = es(t, 0.5, 0.58);
      pose(bundle, { x: lerp(mx - 22 * s, 742, drop), y: lerp(my - 150 * s, 596, drop), s: s * 0.9, r: drop * -12 });
      const inK = es(t, 0.62, 0.9);
      inMan.set({ x: DH.DX + 2, y: 528 - inK * 6, s: 0.54 * (1 - inK * 0.15), flip: false, armF: 30, armB: 20, head: -6, o: through * (1 - es(t, 0.82, 0.95)) });
      pose(glow, { x: DH.DX, y: 470, s: 1 + bump(t, 0.6, 1.0) * 1.5, o: bump(t, 0.6, 1.0) * 0.8 });

      /* v24b — many come up the path and push at the door, but cannot get in */
      crowd.forEach((g) => {
        const k = es(t, 1.0 + g.i * 0.08, 1.45 + g.i * 0.08, ease.out);
        const y = lerp(1000 + g.i * 20, [640, 646, 668][g.i], k);
        const push = Math.max(0, Math.sin((t - 1.5) * 22 + g.i * 2)) * es(t, 1.45, 1.55) * 6;
        const x = g.x + (g.i === 2 ? 0 : (g.flip ? -1 : 1) * push);
        g.sp.set({ x, y: y - push * 0.3, s: sAt(y), o: t > 0.98 ? 1 : 0 });
        g.pos = [x, y];
      });
      bundles.forEach((b, i) => {
        const g = crowd[i % 3];
        const [gx, gy] = g.pos;
        const sc = sAt(gy);
        pose(b, { x: gx + (i - 1.5) * 26 * sc, y: gy - 150 * sc + (i % 2) * 8, s: sc * 0.95, r: Math.sin(t * 20 + i) * 3 * es(t, 1.45, 1.55), o: t > 0.98 ? 1 : 0 });
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 10], [0.6, -20], [1.2, -10], [1.8, 10]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.1], [1.2, 1.04]]);
      void seg; void PI; void shade; void sheet; void blinkAt;
    };
  },
};
