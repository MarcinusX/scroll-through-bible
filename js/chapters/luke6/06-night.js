// Łk 6,12–13 — the mountain. In the evening Jesus climbs the path alone to the summit and kneels on the rock to pray;
// night falls, the stars come out, and a thin thread of light goes up from Him into the dark. The moon rises on the
// left and goes right over the sky and down again — the whole night in prayer to God. Then the dawn: the sky pales, the
// sun comes up behind the summit and He stands. His disciples come up the path, many of them; He calls them, and out
// of them He chooses twelve — twelve lights kindle over twelve heads, and they step forward into a half-ring round Him,
// while a word comes down on its strings: "apostles", the ones who are sent.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { along } from '../mark3/lib.js';
import { summitSet, SUMMIT, SUMMIT_PATH, LK12, folk, stillGroup, kf, sparkle, halo, hungWord, tr, PI } from './lib.js';

/** the half-ring round Him on the summit: slot i (0..5 left, inner → outer; 6..11 right) */
export function ringSlot(pf, i, step = 56) {
  const side = i < 6 ? -1 : 1, k = i % 6;
  const x = 800 + side * (74 + k * step);
  return { x, y: pf(x) + 6 + (k % 2) * 8, s: 0.8 - k * 0.012, flip: side > 0 };
}
/** the order of the Twelve in the ring: Luke's pairs, one left, one right */
export const RING_OF = LK12.map((m, i) => (i % 2 ? 6 : 0) + (i >> 1));

export default {
  id: 'lk6-night',
  beats: [
    { v: 12 },
    { v: 13 },
  ],
  cam: { x: [-80, 20], y: [-60, 90], z: [1, 1.16] },
  build(S) {
    const M = summitSet(S);
    const c = S.c;
    const pf = M.pf;

    /* the thread of prayer (behind Him) */
    const back = S.layer({ par: 0.4, sh: 1, flat: true });
    const prayer = back.add(`<g opacity="0"><path d="${c.poly([[-5, 0], [5, 0], [28, -900], [-28, -900]])}" fill="#fff3cf" opacity=".5"/><path d="${c.poly([[-2, 0], [2, 0], [9, -900], [-9, -900]])}" fill="#fffaf0" opacity=".7"/></g>`);
    const jGlow = back.add(`<g opacity="0">${halo(130, 1)}</g>`);

    /* the other disciples (sprites) and the Twelve */
    const L = S.layer({ par: 0.42, sh: 4 });
    const OL = S.layer({ par: 0.41, sh: 4 });
    const others = [[-1, 560], [-1, 470], [1, 1040], [1, 1130]].map(([side, x], g) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 34 + c.rr(-6, 6), y: c.rr(-4, 6), s: 1, flip: side > 0, o: folk(c), head: c.rr(-6, 2), armF: c.rr(0, 20) }));
      return { side, x, sp: OL.sprite(`<g transform="scale(.62)">${stillGroup(c, mem)}</g>`, x, pf(x) - 26) };
    });
    const T12 = LK12.map((m, i) => ({ ...m, slot: ringSlot(pf, RING_OF[i]), seed: c.rr(0, 9), d: c.rr(0, 0.25), p: S.puppet(L.add(person(c, m.o))) }));
    const lights = T12.map(() => L.add(`<g opacity="0">${sparkle(c, 11)}</g>`));
    const jKneel = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.3, sh: 6, rise: 0 });
    const word = fx.add(`<g>${hungWord(c, tr('apostołowie', 'apostles'), { size: 28 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v12 — dusk, the climb, the night of prayer */
      const dark = es(t, -0.2, 0.4) * (1 - es(t, 1.0, 1.35));
      const dawnK = es(t, 0.95, 1.15) * (1 - es(t, 1.3, 1.6) * 0.0);
      const dayK = es(t, 1.2, 1.6);
      const moonU = kfLin(t, [[0.2, 0], [1.0, 1]]);
      const sunUp = es(t, 1.0, 1.5, ease.out);
      M.update(T, { dark, dawnK: Math.max(dawnK, t < 0.2 ? 1 - es(t, -0.3, 0.2) : 0), dayK, moonU: t < 0.15 || t > 1.05 ? -1 : moonU, sunUp, starsK: es(t, 0.1, 0.4) * (1 - es(t, 0.95, 1.2)) });

      const climb = es(t, -0.35, 0.3, (u) => u);
      const [px, py] = along(SUMMIT_PATH, climb);
      const kneel = es(t, 0.34, 0.4);
      const stand = es(t, 1.18, 1.24);
      const onTop = kneel * (1 - stand);
      jesus.set({ x: kneel > 0 ? 800 : px, y: kneel > 0 ? SUMMIT.TOP : py, s: lerp(0.72, 1.0, climb), flip: false, o: 1 - onTop, walk: climb > 0 && climb < 1 ? px * 0.05 : undefined, armF: 12 + es(t, 1.35, 1.55) * 30, armB: 10 + bump(t, 1.35, 1.8) * 130, head: -2, blink: blinkAt(T) });
      jKneel.set({ x: 800, y: SUMMIT.TOP, s: 1.0, flip: false, o: onTop, armF: 64, armB: 140, head: -18, blink: 0 });
      const pr = es(t, 0.38, 0.55) * (1 - es(t, 1.05, 1.25));
      pose(prayer, { x: 812, y: SUMMIT.TOP - 170, o: pr * (time ? 0.85 + Math.sin(T * 1.3) * 0.15 : 1) });
      pose(jGlow, { x: 800, y: SUMMIT.TOP - 110, s: 1, o: Math.max(pr * 0.8, es(t, 1.2, 1.5) * 0.7) });

      /* v13 — at daybreak the disciples come up; He calls them and chooses twelve */
      others.forEach((g) => {
        const k = es(t, 1.15, 1.5);
        const x = g.x + g.side * (1 - k) * 300;
        g.sp.set({ x, y: pf(x) - 26, s: 1, o: seg(t, 1.12, 1.2) });
      });
      T12.forEach((m) => {
        const come = es(t, 1.12 + m.d, 1.45 + m.d);
        const chosen = es(t, 1.6 + m.i * 0.02, 1.72 + m.i * 0.02);
        const side = m.slot.flip ? 1 : -1;
        const gx = m.slot.x + side * 70;
        const x = lerp(m.slot.x + side * 320, gx, come) - side * 70 * chosen;
        const y = pf(x) + 16 - chosen * 10 + (m.slot.y - pf(m.slot.x)) * chosen;
        m.p.set({ x, y, s: m.slot.s * (0.92 + chosen * 0.08), flip: come < 1 ? !m.slot.flip : m.slot.flip, o: seg(t, 1.1 + m.d, 1.16 + m.d), walk: (come > 0 && come < 1) || (chosen > 0 && chosen < 1) ? x * 0.06 : undefined, armF: 10 + chosen * 20, armB: bump(t, 1.62 + m.i * 0.02, 1.95) * 60, head: -chosen * 6, blink: blinkAt(T, m.seed) });
        const lk = es(t, 1.58 + m.i * 0.02, 1.7 + m.i * 0.02, ease.back);
        pose(lights[m.i], { x: m.slot.x + 2 * (side > 0 ? -1 : 1), y: m.slot.y - 172 * m.slot.s, s: lk * 0.9, r: T * 30, o: lk > 0.01 ? 1 - es(t, 1.9, 2.05) * 0.4 : 0 });
      });
      const wd = es(t, 1.66, 1.95, ease.back);
      pose(word, { x: 800, y: lerp(-400, 236, wd), r: Math.sin(T * 0.8) * 0.8, oy: 0, o: wd > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -80], [0.3, 0], [1.1, 0], [1.5, 0]]);
      S.cam.y = kf(t, [[-0.5, 90], [0.3, 30], [0.9, -40], [1.1, -20], [1.5, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.3, 1.12], [0.9, 1.0], [1.1, 1.02], [1.5, 1.06]]);
    };
  },
};
function kfLin(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return va + (vb - va) * ((t - a) / (b - a)); }
  return keys[keys.length - 1][1];
}
