// Mk 16,8 — The women come out and run from the tomb, leaving the jars of ointment by the doorway —
// there is no one to anoint. Trembling and astonishment: zig-zags and whirling stars over them.
// On the path they pass people who greet them; they hurry by, hands over their mouths, saying nothing.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { WOMEN, gardenSet, GARDEN_PATH, pathS, DOOR, STONE, spiceJar, along, headAt, speech, talkDots, sparkle, townsfolk, PI } from './lib.js';

const DAY = [C.skyBlue, mix(C.dawn, C.skyBlue, 0.3), '#f8e6bd'];

export default {
  id: 'm16-fled',
  beats: [
    { v: 8, text: 'One wyszły i uciekły od grobu;' },
    { v: 8, cont: true, text: 'ogarnęło je bowiem zdumienie i przestrach.' },
    { v: 8, cont: true, text: 'Nikomu też nic nie oznajmiły, bo się bały.' },
  ],
  cam: { x: [-700, 440], y: [0, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 56, { rays: C.sunDeep }), { x: 900, y: 230, len: 900 });
    const cl = hanging(hangL, cloud(c, 180), { x: 420, y: 170, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 55, scale: 0.5 });

    const G = gardenSet(S);
    const L = G.walkL;
    // the jars, left standing by the doorway
    const left = [0, 1, 2].map((i) => G.ground.add(`<g transform="translate(${DOOR.x - 110 + i * 22} ${DOOR.y + 8})">${spiceJar(c, [C.cream, C.blushVeil, C.linen2][i], [C.clay, C.plumRobe, C.teal2][i])}</g>`));
    // passers-by on the path
    const passers = [townsfolk(c, { man: true, robe: C.dustyBlue, mantle: C.stone }), townsfolk(c, { hairStyle: 'veil', beard: 'none', robe: C.mauve, veil: C.linen2 })]
      .map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))) }));
    const hello = L.add(`<g>${speech(c, talkDots(c), { w: 54, h: 36 })}</g>`);
    const W = WOMEN.map((w, i) => ({ ...w, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...w.o }))) }));
    const hush = W.map(() => L.add(`<g>${speech(c, `<path d="${c.ribbon([[-15, 0], [15, 0]], 3)}" fill="${C.inkSoft}"/><path d="${[-9, -3, 3, 9].map((x) => c.ribbon([[x, -5], [x, 5]], 1.6)).join('')}" fill="${C.inkSoft}"/>`, { w: 50, h: 34, fill: C.stone, flip: true })}</g>`));
    const shiver = W.map(() => L.add(`<g>${[-1, 1].map((d) => `<path d="${c.ribbon([[d * 16, -4], [d * 23, -12], [d * 18, -19], [d * 25, -27]], 2.4)}" fill="${C.terracotta}" opacity=".7"/>`).join('')}</g>`));
    const whirl = Array.from({ length: 6 }, (_, i) => ({ i, el: L.add(`<g>${sparkle(c, 10)}</g>`) }));

    return (t, time) => {
      swing(sunEl, 900, 230, time, 0.8, 0.5);
      swing(cl, 420 + Math.sin(time * 0.1) * 30, 170, time, 1.2, 0.6, 1);
      birds(time, 1);
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0.9 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y - 60, o: 0.5 });

      /* v8a: out of the tomb and away down the path */
      const lead = lerp(0.99, 0.68, es(t, 0.05, 1.0, ease.in)) - es(t, 1.0, 2.0) * 0.06 - es(t, 2.0, 2.9) * 0.06;
      const scare = es(t, 1.02, 1.3) * (1 - es(t, 2.6, 3));
      const heads = [];
      W.forEach((w) => {
        const u = lead + w.i * 0.045;
        const [x0, y] = along(GARDEN_PATH, u);
        const x = x0 + Math.sin(time * 40 + w.i) * 1.6 * scare;
        const s = pathS(y) * 1.02;
        const out = seg(t, 0 + w.i * 0.12, 0.08 + w.i * 0.12);
        const shush = es(t, 2.2 + w.i * 0.08, 2.4 + w.i * 0.08);
        w.p.set({ x, y, s, flip: true, o: out, walk: u < 0.985 ? x * 0.08 + w.i : undefined, amt: 1.3, lean: 8, armF: 30 + scare * 40 + shush * 105, armB: 20 + scare * 90 - shush * 60, head: 6 - scare * 10 + shush * 8, blink: blinkAt(time, w.seed) });
        const [hx, hy] = headAt(x, y, s, true);
        heads.push([hx, hy]);
        w.cx = x;
        pose(shiver[w.i], { x: hx, y: hy - 4, s: 1.1, o: scare });
        const hb = es(t, 2.35 + w.i * 0.1, 2.5 + w.i * 0.1, ease.back);
        pose(hush[w.i], { x: hx - 14, y: hy - 22, s: hb * 0.85, o: hb > 0.01 ? 1 : 0 });
      });
      // astonishment: stars whirling over the three
      whirl.forEach((wl) => {
        const [hx, hy] = heads[wl.i % 3];
        const a = time * 2.4 + wl.i * 2.1;
        pose(wl.el, { x: hx + Math.cos(a) * 34, y: hy - 50 + Math.sin(a) * 12, s: 0.8, r: time * 60, o: scare });
      });

      /* v8c: they pass people who greet them — and say nothing */
      passers.forEach((m) => {
        const [x, y] = along(GARDEN_PATH, lerp(0.3, 0.5, es(t, 1.9, 2.9)) - m.i * 0.04);
        const s = pathS(y + 40) * 1.02;
        const greet = m.i === 0 ? bump(t, 2.15, 2.8) : 0;
        m.p.set({ x, y: y + 40, s, flip: false, o: seg(t, 1.9, 2.0), walk: t < 2.9 ? x * 0.05 + m.i : undefined, armF: greet * 110, armB: 10, head: -greet * 4, blink: blinkAt(time, m.seed) });
        if (m.i === 0) {
          const [hx, hy] = headAt(x, y + 40, s, false);
          const b = es(t, 2.15, 2.3, ease.back) * (1 - es(t, 2.7, 2.8));
          pose(hello, { x: hx + 16, y: hy - 22, s: b * 0.85, o: b > 0.01 ? 1 : 0 });
        }
      });

      const camL = lerp(430, 120, es(t, 0.05, 1.2)) - es(t, 1.2, 2.0) * 220 - es(t, 2.0, 2.9) * 140;
      const gx = (W[0].cx + W[1].cx + W[2].cx) / 3;
      S.cam.x = S.portrait ? Math.max(-700, Math.min(440, (gx - 800) / 0.52 - 60)) : camL;
      S.cam.y = 20;
      S.cam.z = 1.04 - es(t, 0.3, 1.2) * 0.02;
    };
  },
};
