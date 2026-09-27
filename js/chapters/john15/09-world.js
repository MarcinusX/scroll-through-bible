// J 15,18–19 — The last part begins: the night turns cold. "If the world hates you": a cold wind of pale paper streaks
// comes across the vineyard, the lanterns shiver, the eleven draw their shoulders in; on the far ridge the dark
// shadows of "the world" rise up. "Know that it hated Me first": Jesus steps out in front of them, into the wind, and
// every shadow turns and points at Him. "If you were of the world, the world would love its own": the world hangs
// over them as a dark globe ringed with paper dolls hand in hand. "But because you are not of the world — I chose you
// out of it": little figures of light are lifted up out of the ring, and a thorny darkness bristles round the globe.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampK, windStroke, shadowPerson, crowdPersonOpts, worldDisc, doll, hungPlate,
  vis, kf, pose, lerp, blinkAt, mix, shade, sheet, C, P, PI, NIGHT, COLD,
} from './lib.js';

export default {
  id: 'j15-world',
  beats: [
    { v: 18, text: 'Jeżeli was świat nienawidzi,' },
    { v: 18, cont: true, text: 'wiedzcie, że Mnie pierwej znienawidził.' },
    { v: 19, text: 'Gdybyście byli ze świata, świat by was kochał jako swoją własność.' },
    { v: 19, cont: true, text: 'Ale ponieważ nie jesteście ze świata, bo Ja was wybrałem sobie ze świata, dlatego was świat nienawidzi.' },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.96, 1.25] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { skyCols: NIGHT, vine: false, before: () => {
      // the shadows of "the world" on the far ridge
      const L = S.layer({ par: 0.14, sh: 2 });
      const INK = '#241d2e';
      const xs = [880, 930, 985, 1040, 1100, 1150, 1210, 1270, 1330, 1390, 1450, 1510];
      const shadows = xs.map((x, i) => ({ p: S.puppet(L.add(shadowPerson(c, crowdPersonOpts(c), INK))), x, y: 470 + (i % 3) * 5 + Math.abs(x - 1200) * 0.03, i, seed: c.rr(0, 6) }));
      return { shadows };
    } });
    const { ms, jesus, JX, JY } = tb;
    const { shadows } = tb.pre;
    // the cold wind: pale streaks sliding across
    const windL = S.layer({ par: 0.6, sh: 0, flat: true });
    const winds = Array.from({ length: 12 }, (_, i) => ({ el: windL.add(`<g>${windStroke(c, c.rr(120, 220), mix('#e9e4f3', C.skyBlue2, 0.4))}</g>`), y: 260 + ((i * 53) % 420), sp: c.rr(0.8, 1.3), ph: (i * 0.37) % 1, i }));
    // the world as a globe ringed with paper dolls; figures of light lifted out of it; thorns round it
    const hangL = S.layer({ par: 0.12, sh: 6 });
    const globe = hangL.add(`<g><circle r="170" fill="url(#halo-glow)" opacity=".25"/><g data-k="thorns"><path d="${c.cut(c.star(0, 0, 150, 122, 30, 0.1), 0.8, 6)}" fill="#1a1426"/></g>${worldDisc(c, 100, { col: mix(C.stone2, C.plumRobe, 0.35) })}</g>`);
    const thorns = globe.querySelector('[data-k="thorns"]');
    const lit = [0, 1, 2].map((i) => hangL.add(`<g><circle cy="-20" r="30" fill="url(#halo-glow)"/>${doll(c, C.halo)}</g>`));
    tb.set.front();

    return (t, time) => {
      const T = time;
      tb.set.sk.blend(NIGHT, COLD, es(t, 0.05, 0.6));
      tb.set.update(T);
      /* v18a — the cold wind */
      const wind = es(t, 0.05, 0.4) * (1 - es(t, 3.6, 4) * 0.3);
      winds.forEach((w) => {
        const u = ((T ? T * 0.22 * w.sp : 0) + w.ph) % 1;
        vis(w.el, { x: lerp(1500, 100, u), y: w.y + Math.sin(u * 7 + w.i) * 16, sx: -1, o: wind * Math.sin(u * PI) * 0.9 });
      });
      /* v18b — He steps out in front, into the wind */
      const step = es(t, 1.05, 1.4);
      const jx = lerp(JX, JX + 40, step) - es(t, 3.05, 3.4) * 40;
      jesus.set({ x: jx, y: JY, s: 1.05, walk: step > 0 && step < 1 ? step * 12 : undefined, armB: bump(t, 1.2, 2.9) * 70 + bump(t, 3.1, 3.9) * 120, armF: step * 30 * (1 - es(t, 2.9, 3.1)) + bump(t, 2.1, 2.9) * 40, head: -bump(t, 3.1, 3.9) * 10, lean: -step * 3 * (1 - es(t, 3, 3.3)), blink: blinkAt(T, 1) });
      ms.forEach((m, i) => {
        const huddle = es(t, 0.15 + (i % 4) * 0.05, 0.5 + (i % 4) * 0.05);
        const shiver = T ? Math.sin(T * 9 + i) * 0.6 * wind : 0;
        placeM(m, T, { x: m.x + (m.x < 800 ? 10 : -10) * huddle, head: 10 * huddle - es(t, 2.1, 2.4) * 18 + shiver, lean: (m.flip ? -3 : 3) * huddle });
        lampK(m, (0.6 + (T ? Math.sin(T * 13 + i * 2) * 0.12 : 0)) * (1 - wind * 0.3));
      });
      /* the shadows of the world rise on the ridge, then all point at Him */
      shadows.forEach((sh) => {
        const up = es(t, 0.2 + sh.i * 0.03, 0.6 + sh.i * 0.03);
        const point = es(t, 1.2 + (sh.i % 4) * 0.05, 1.45 + (sh.i % 4) * 0.05) * (1 - es(t, 2.0, 2.2) * 0.6) + es(t, 3.4, 3.7) * 0.8;
        sh.p.set({ x: sh.x, y: sh.y + (1 - up) * 90, s: 0.34, flip: true, armF: point * 95, armB: bump(t, 3.5, 4) * 60, head: point * 6, o: up > 0.01 ? 1 : 0 });
      });
      /* v19 — the world and its own; figures of light lifted out */
      const gk = es(t, 2.05, 2.35, ease.out);
      vis(globe, { x: 800, y: 300 - (1 - gk) * 640 + (T ? Math.sin(T * 0.8) * 3 : 0), r: t * 6, o: gk > 0.001 ? 1 : 0 });
      pose(thorns, { s: 0.7 + es(t, 3.4, 3.75) * 0.3, o: es(t, 3.35, 3.7) });
      lit.forEach((el, i) => {
        const a = -PI / 2 + (i - 1) * 0.5;
        const lift = es(t, 3.05 + i * 0.08, 3.45 + i * 0.08);
        vis(el, { x: 800 + Math.cos(a) * lerp(60, 190, lift) + (i - 1) * 30 * lift, y: 300 - (1 - gk) * 640 + Math.sin(a) * lerp(20, 150, lift) + 20, s: 1.3, r: (i - 1) * 16 * (1 - lift), o: es(t, 3.0 + i * 0.08, 3.1 + i * 0.08) });
      });
      S.cam.x = kf(t, [[0, 0], [1, 0], [1.4, -20], [2, -20], [2.3, 0]]);
      S.cam.y = kf(t, [[0, 10], [1, 10], [2, 0], [2.4, -40], [4, -40]]);
      S.cam.z = kf(t, [[0, 1.08], [1, 1.02], [1.5, 1.08], [2, 1.08], [2.4, 1.0], [4, 1.0]]);
    };
  },
};
