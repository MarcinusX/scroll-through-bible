// Łk 2,51–52 — home again in Nazareth. The boy comes down the road between Mary and Joseph and does as they ask: He
// carries a plank to Joseph's bench and holds it while Joseph works. Mary, at the door, keeps all these things in her
// heart — the pictures of the manger, the angel, Simeon with the Child and the Temple float down into her paper heart
// once more. And Jesus grows: the boy by the doorpost becomes a young man, a new notch cut high on the post, the light
// of God's favour above Him, and the neighbours at the gate greet Him warmly.
import { C, person, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import {
  nazSet, NY, NAZ, JOSEPH, MARY, BOY, SIMEON, kid, staff, workbench, notch, cameo, keepHeart, manger, baby, choirAngel, sanctuary, inArms,
  pilgrims, glowDisc, rayBurst, hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const WK = [[0, 1500], [0.55, 900]];              // they come down the road
const BENCH0 = 1060;
const KX0 = 520;                                  // the young man by the doorpost
const HEART = [608, NY - 116];
const YOUTH = { ...BOY, robe: C.linen, mantle: mix(C.jesusMantle, C.roseRobe, 0.3), hairStyle: 'long', hair: C.hairJesus };

/** a plank held in the hands (hold coords) */
const plank = (c) => sheet().p(c.cut([[-60, -4], [60, -6], [60, 4], [-60, 6]], 0.3, 6), C.wood3).out();

export default {
  id: 'lk2-grew',
  beats: [
    { v: 51, text: 'Potem poszedł z nimi i wrócił do Nazaretu; i był im poddany.' },
    { v: 51, cont: true, text: 'A Matka Jego chowała wiernie wszystkie te wspomnienia w swym sercu.' },
    { v: 52 },
  ],
  cam: { x: [-80, 80], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    // phone: Joseph's bench, the neighbours and the pictures of memory inside the screen
    const BENCH = S.portrait ? 935 : BENCH0, NBX = S.portrait ? 800 : 1260;
    const KX = S.portrait ? 545 : KX0;   // phone: the young Jesus off the left edge
    const N = nazSet(S);
    N.G.add(`<g transform="translate(${BENCH} ${NY + 2})">${workbench(c, 170)}</g>`);
    const grace = N.lightL.add(`<g>${glowDisc(230, 'halo-glow', 1)}${rayBurst(c, { n: 18, r0: 30, r1: 240, spread: 0.03, color: '#fff3cf', o: 0.3 })}</g>`);
    const high = N.markL.add(`<g>${notch(c)}</g>`);
    const low = N.markL.add(`<g>${notch(c)}</g>`);
    const P = N.P;
    const neigh = P.sprite(pilgrims(c, 3, { s: 0.86, flip: true, dx: 58 }), 1250, NY + 6);
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdB: staff(c, 190, 30) })));
    const josW = S.puppet(P.add(person(c, { ...JOSEPH })));
    const mary = S.puppet(P.add(person(c, { ...MARY })));
    const boy = S.puppet(P.add(kid(c, { ...BOY }, 1.1)));
    const boyP = S.puppet(P.add(kid(c, { ...BOY, holdF: `<g transform="rotate(-90)">${plank(c)}</g>` }, 1.1)));
    const youth = S.puppet(P.add(person(c, { ...YOUTH })));
    const heartEl = P.add(`<g>${keepHeart(c, 20)}</g>`);

    const X = S.layer({ par: 0.4, sh: 5 });
    const cams = [
      cameo(c, `<g transform="translate(0 12) scale(.3)">${manger(c)}</g><g transform="translate(-6 -2) scale(.34)">${baby(c)}</g>`, { r: 26 }),
      cameo(c, `<g transform="translate(0 20) scale(.3)">${choirAngel(c, 1, 0)}</g>`, { r: 26 }),
      cameo(c, `<g transform="translate(-4 48) scale(.3)">${person(c, { ...SIMEON, holdF: inArms(c), holdB: '' }).replace('class="armFr"', 'class="armFr" transform="rotate(-70)"')}</g>`, { r: 26, face: mix(C.parchment, C.skyVeil, 0.4) }),
      cameo(c, `<g transform="translate(0 20) scale(.16)">${sanctuary(c, 1, { glow: false })}</g>`, { r: 26, face: mix(C.parchment, C.halo, 0.4) }),
    ].map((m, i) => ({ i, el: X.add(`<g>${m}</g>`) }));
    const sparks = [0, 1, 2, 3, 4, 5].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      N.update(T);
      /* v51a — He goes down with them to Nazareth and is subject to them */
      const wx = kf(t, WK, ease.sine);
      const walking = moving(t, WK, 0.3);
      const atBench = es(t, 0.55, 0.65);
      jos.set({ x: wx + 90, y: NY + 4, s: 0.94, flip: true, o: 1 - atBench, walk: walking ? wx * 0.06 : undefined, armF: 30, armB: 30, blink: blinkAt(T, 2) });
      const work = t > 0.8 && T ? Math.sin(T * 5) * 8 : 0;
      josW.set({ x: BENCH + 80, y: NY + 4, s: 0.94, flip: true, o: atBench, armF: 50 + work + bump(t, 0.6, 0.8) * 30, armB: 30, head: 10, blink: blinkAt(T, 2) });
      const mx = lerp(wx - 90, 600, es(t, 0.55, 0.9)) + es(t, 2.0, 2.3) * 90;
      mary.set({ x: mx, y: NY, s: 0.95, flip: t > 2.1 ? true : es(t, 0.85, 0.9) < 0.5, walk: walking || (t > 0.55 && t < 0.9) ? mx * 0.06 : undefined, armF: 30 + es(t, 1.1, 1.4) * 40, armB: 20 + es(t, 1.1, 1.4) * 40, head: 8 + es(t, 1.1, 1.4) * 4, blink: blinkAt(T, 1) });
      const carry = es(t, 0.62, 0.7) * (1 - es(t, 1.95, 2.02));
      const bx = lerp(wx, BENCH - 70, es(t, 0.6, 0.85));
      boy.set({ x: bx, y: NY + 6, s: 0.8, flip: true, o: 1 - carry - es(t, 1.95, 2.02), walk: walking ? wx * 0.08 : undefined, armF: 20, blink: blinkAt(T, 4) });
      boyP.set({ x: bx, y: NY + 6, s: 0.8, flip: false, o: carry, walk: t > 0.6 && t < 0.85 ? bx * 0.08 : undefined, armF: 70, armB: 30, head: 6, blink: blinkAt(T, 4) });

      /* v51b — His mother keeps all these things in her heart */
      cams.forEach((m) => {
        const show = es(t, 1.08 + m.i * 0.08, 1.3 + m.i * 0.08, ease.back);
        const k = es(t, 1.82 + m.i * 0.04, 2.05 + m.i * 0.04);
        const a = PI * (1.2 + m.i * 0.2);
        const x0 = HEART[0] + (S.portrait ? 80 : 40) + Math.cos(a) * 170, y0 = HEART[1] - 160 + Math.sin(a) * 90 + Math.sin(T * 1.2 + m.i) * 4;
        vpose(m.el, { x: lerp(x0, HEART[0], k), y: lerp(y0, HEART[1], k), s: Math.max(0.001, show * (1 - k * 0.8)), o: show > 0.01 && k < 0.98 ? 1 : 0 });
      });
      const hk = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 2.2, 2.4));
      vpose(heartEl, { x: HEART[0], y: HEART[1], s: Math.max(0.001, hk * (1 + bump(t, 1.95, 2.2) * 0.2)), o: hk > 0.01 ? 1 : 0 });

      /* v52 — He grows in wisdom and stature and favour with God and people */
      const grown = es(t, 2.05, 2.12);
      youth.set({ x: KX, y: NY + 4, s: 0.98, flip: false, o: grown, armF: 20 + es(t, 2.4, 2.7) * 50, armB: 20, head: -4, blink: blinkAt(T, 4) });
      vpose(low, { x: N.postX, y: NY - 178, s: 1.3, o: 1 });
      const nk = es(t, 2.2, 2.3, ease.back);
      vpose(high, { x: N.postX, y: NY - 216, s: Math.max(0.001, nk * 1.3), o: nk > 0.01 ? 1 : 0 });
      const gk = es(t, 2.1, 2.5);
      pose(grace, { x: KX + 10, y: NY - 170, s: 0.5 + gk * 0.6, r: T * 2, o: gk });
      const nb = es(t, 2.3, 2.6, ease.out);
      neigh.set({ x: lerp(1600, NBX, nb), y: NY + 6, o: nb > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = seg(t, 2.35 + i * 0.05, 2.9 + i * 0.05), a = PI * (1.05 + i * 0.18);
        vpose(sp, { x: KX + 10 + Math.cos(a) * (80 + k * 80), y: NY - 250 + Math.sin(a) * (50 + k * 40), s: 0.9 - k * 0.5, r: t * 90, o: bump(t, 2.35 + i * 0.05, 2.9 + i * 0.05) });
      });

      S.cam.x = kf(t, [[0, 60], [0.9, 40], [1.1, -20], [2.0, -20], [2.3, S.portrait ? -40 : 0]], ease.sine);
      S.cam.y = kf(t, [[0, 10], [1.1, 30], [2.0, 30], [2.3, -20]], ease.sine);
      S.cam.z = kf(t, [[0, 1.02], [1.1, 1.12], [2.0, 1.12], [2.3, 1.0]], ease.sine);
    };
  },
};
