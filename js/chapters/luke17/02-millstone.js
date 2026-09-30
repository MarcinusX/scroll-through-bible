// Łk 17,2 — a painted flat flies in: a high cliff over the sea, the water cut away below it down to the sandy floor.
// Jesus stands on the cliff top with Peter and John; the little boy with his lamp is beside Him. "It would be better
// for him if a millstone were hung around his neck and he were thrown into the sea": a great millstone with its rope
// noose comes down from the flies over the sea — the rope parts, and it plunges: a splash, rings, and it sinks down
// through the green and the blue to lie on the bottom among the weed, while the fish dart away (no one is shown).
// "Rather than that he should cause one of these little ones to stumble": Jesus draws the boy to His side and his
// little flame burns up bright. "Watch yourselves!": He turns to Peter and John and lifts a warning finger.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { fish } from '../../assets/things.js';
import { seaSet, SEA17, roadFour, child, clayLamp, millstone, strung, voiceRings, headAt, hand, halo, warm, behindOf, kf, es, ease, bump, seg, PI } from './lib.js';

const JX = 600, JY = SEA17.TOP + 2;
const KX = 700;
const MX = 1060, HANG = 320;

export default {
  id: 'lk17-millstone',
  enter: 'fly',
  beats: [
    { v: 2, text: 'Byłoby lepiej dla niego, gdyby kamień młyński zawieszono mu u szyi i wrzucono go w morze,' },
    { v: 2, cont: true, text: 'niż żeby miał być powodem grzechu jednego z tych małych. Uważajcie na siebie!' },
  ],
  cam: { x: [-20, 80], y: [-20, 60], z: [1, 1.1] },
  build(S) {
    const P = seaSet(S);
    const c = S.c;
    const floorY = P.ffn(MX) - 22;
    /* fish in the deep */
    const FISH = [[980, 660, 0.7, 1], [1150, 700, 0.6, -1], [1240, 640, 0.55, 1], [900, 720, 0.5, -1]].map(([x, y, s, d], i) => ({ x, y, s, d, i, el: P.deepL.add(`<g>${fish(c, { color: i % 2 ? C.lake2 : mix(C.lake2, C.lakeDeep, 0.4) })}</g>`) }));
    /* the millstone: on its rope from the flies, then falling, sinking */
    const stone = P.deepL.add(`<g transform="translate(0 -1500)"><g transform="scale(.8)">${millstone(c, 48)}</g></g>`);
    const rope = P.deepL.add(`<g transform="translate(0 -1500)">${strung('', 0, 2400)}</g>`);
    const bubbles = [0, 1, 2, 3, 4].map((i) => ({ i, el: P.deepL.add(`<g opacity="0"><circle r="${3 + (i % 3)}" fill="${C.foam}" opacity=".85"/></g>`) }));
    const fxL = S.layer({ par: 0.3, sh: 2 });
    behindOf(fxL, P.cliff);
    const splash = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ i, a: -PI / 2 + (i - 3) * 0.32, el: fxL.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 5, 8, 10), 0.3, 3)}" fill="${C.foam}"/></g>`) }));
    const rings = [0, 1].map(() => fxL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 40, 9, PI, 2 * PI, 14), 3)}" fill="${C.foam}"/></g>`));

    /* on the cliff */
    const glowL = S.layer({ par: 0.4, sh: 0, flat: true });
    behindOf(glowL, P.act);
    const aura = glowL.add(`<g>${halo(130, 0.55)}</g>`);
    const lampGlow = glowL.add(`<g>${warm(44, 1)}</g>`);
    const kid = S.puppet(P.act.add(child(c, { holdF: `<g transform="rotate(62) translate(-2 4)">${clayLamp(c)}</g>` })));
    const flameEl = kid.el.querySelector('.fl');
    const F = roadFour(S, P.act, c, ['peter', 'john']);
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v2a — the millstone comes down, the rope parts, it plunges and sinks */
      const down = es(t, 0.05, 0.32, ease.back);
      const fall = es(t, 0.42, 0.56, ease.in);
      const sink = es(t, 0.56, 0.95, ease.out);
      const sway = (T ? Math.sin(T * 0.9) : 0) * 3 * (1 - fall) * down;
      const sy = fall < 1 ? lerp(lerp(-1500, HANG, down), SEA17.SURF, fall) : lerp(SEA17.SURF, floorY, sink);
      pose(stone, { x: MX, y: sy, r: sway + sink * 26, o: down > 0.002 ? 1 : 0 });
      // the rope: holds, then flies up when it parts
      const gone = es(t, 0.42, 0.6, ease.in);
      pose(rope, { x: MX, y: lerp(-1500, HANG - 62, down) - gone * 1800, r: sway, oy: 0, o: down > 0.002 && gone < 0.99 ? 1 : 0 });
      const sp = seg(t, 0.55, 0.78);
      splash.forEach((d) => {
        const r = sp * (40 + (d.i % 3) * 16);
        pose(d.el, { x: MX + Math.cos(d.a) * r * 1.4, y: SEA17.SURF - 4 + Math.sin(d.a) * r * 1.3 + sp * sp * 70, s: 1 - sp * 0.4, r: (d.a + PI / 2) * 57, o: sp > 0 && sp < 1 ? 1 - sp * 0.6 : 0 });
      });
      rings.forEach((el, i) => {
        const k = seg(t, 0.56 + i * 0.1, 0.95 + i * 0.1);
        pose(el, { x: MX, y: SEA17.SURF + 4, sx: 0.4 + k * 1.8, sy: 0.4 + k * 1.2, o: k > 0 && k < 1 ? (1 - k) * 0.9 : 0 });
      });
      bubbles.forEach((b) => {
        const k = seg(t, 0.62 + b.i * 0.05, 1.0 + b.i * 0.05);
        const by = lerp(sy - 30, SEA17.SURF + 10, k);
        pose(b.el, { x: MX + (b.i - 2) * 10 + Math.sin(k * 8 + b.i) * 6, y: by, o: k > 0 && k < 1 ? 1 : 0 });
      });
      FISH.forEach((f) => {
        const k = es(t, 0.6, 0.95);
        const away = f.x < MX ? -1 : 1;
        pose(f.el, { x: f.x + away * k * 160 + (T ? Math.sin(T * 0.6 + f.i) * 8 : 0), y: f.y + (T ? Math.sin(T * 1.1 + f.i) * 3 : 0), s: f.s, sx: away, o: 1 - es(t, 0.8, 0.98) * (f.i === 3 ? 1 : 0) });
      });

      /* Jesus points to the sea; then draws the little one to His side; then "watch yourselves!" */
      const toSea = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.1));
      const hold = es(t, 1.08, 1.35);
      const warn = es(t, 1.5, 1.72);
      F.jesus.set({ x: JX, y: JY, s: 1.02, flip: warn > 0.5, armF: 16 + toSea * 70 + hold * 34 * (1 - warn) + warn * 30, armB: 8 + warn * 150, head: toSea * -6 + hold * 10 * (1 - warn) - warn * 4, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jhx, jhy] = headAt(JX, JY, 1.02, warn > 0.5);
      voice(jhx + (warn > 0.5 ? -14 : 14), jhy, bump(t, 0.05, 0.6) * 0.8 + es(t, 1.5, 1.6) * (1 - es(t, 1.9, 2.0)), T, { dir: warn > 0.5 ? -1 : 1, spread: 2 });
      // the boy steps close to Him and looks up; his flame burns up bright
      const kx = lerp(KX + 40, KX - 20, hold);
      kid.set({ x: kx, y: JY + 2, s: 0.62, flip: hold > 0.5, armF: 62, armB: 6, head: -6 + hold * -12, lean: -bump(t, 0.5, 0.9) * 4, blink: blinkAt(T, 6) });
      const bright = es(t, 1.2, 1.5);
      pose(flameEl, { x: 19, y: -9, s: 1 + bright * 0.5 + (T ? Math.sin(T * 9) * 0.05 : 0) });
      const [lx, ly] = hand(kx, JY + 2, 0.62, hold > 0.5, 62);
      pose(lampGlow, { x: lx + (hold > 0.5 ? -12 : 12), y: ly - 20, s: 0.8 + bright * 0.8, o: 0.7 + bright * 0.3 });
      // Peter and John, then they take the warning to heart
      F.ds.forEach((d) => {
        const x = [380, 470][d.i];
        d.p.set({ x, y: JY + 4 + d.i * 4, s: 0.96, armF: 14 + (d.i ? bump(t, 0.3, 0.9) * 40 : 0), armB: 6, head: -2 + warn * 10, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, 40], [0.5, 70], [1.0, 60], [1.4, 10], [2, 0]]);
      S.cam.y = kf(t, [[0, 0], [0.5, 40], [1.0, 40], [1.4, -10], [2, -10]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.04], [1.4, 1.08], [2, 1.08]]);
    };
  },
};
