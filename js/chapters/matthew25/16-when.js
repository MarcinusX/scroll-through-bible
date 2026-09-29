// Mt 25,37–40 — three of the righteous step out in front and look up at the King, open-handed: "Lord, when did we see
// you hungry and feed you, thirsty and give you drink?" — the two little pictures come down again over them with a
// question each; then the stranger and the naked one; then the sick and the prisoner. None of them was the King…
// The King rises: "Truly I tell you". And there at the foot of the throne stand the six least — the beggar, the
// traveller, the stranger, the man now in his warm cloak, the sick man, the prisoner with his broken chain — and the
// King spreads his arms over them; the same light that is round his head kindles round each of theirs.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { judgementSet, JG, judgeRest, shadeLayer, glowDisc, vignette, MERCY, LEAST, HELPERS, question, sparkle } from './lib.js';

const REP = [[462, 0], [552, 2], [642, 5]];
const PAIRS = [[1, [0, 1]], [2, [2, 3]], [3, [4, 5]]];
const SPOT = [[600, 0], [652, 1], [704, 2], [896, 5], [948, 4], [1000, 3]];

export default {
  id: 'mt25-when',
  beats: [
    { v: 37, text: 'Wówczas zapytają sprawiedliwi:' },
    { v: 37, cont: true, text: '"Panie, kiedy widzieliśmy Cię głodnym i nakarmiliśmy Ciebie? spragnionym i daliśmy Ci pić?' },
    { v: 38 },
    { v: 39 },
    { v: 40, text: 'A Król im odpowie: "Zaprawdę, powiadam wam:' },
    { v: 40, cont: true, text: 'Wszystko, co uczyniliście jednemu z tych braci moich najmniejszych, Mnieście uczynili".' },
  ],
  cam: { x: [-50, 20], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const J = judgementSet(S, { flock: false });
    const c = J.c;
    const warmL = J.warmL;
    const coolL = shadeLayer(S);
    // the six least at the foot of the throne, and their light
    const leastL = S.layer({ par: 0.31, sh: 5 });
    const glows = SPOT.map(() => leastL.add(`<g>${glowDisc(46, 'halo-glow', 1)}<path d="${c.cut(c.circ(0, 0, 21, 18), 0.3, 3)}" fill="none" stroke="${C.haloRim}" stroke-width="2.6"/></g>`));
    const least = SPOT.map(([x, i]) => {
      const k = MERCY[i];
      const o = k === 'naked' ? { ...LEAST.naked, mantle: C.clayMantle, mantleArm: true } : LEAST[k];
      return { x, i, flip: x > JG.TX, seed: c.rr(0, 9), p: S.puppet(leastL.add(person(c, o))) };
    });
    // the righteous who ask
    const repL = S.layer({ par: 0.45, sh: 5 });
    const reps = REP.map(([x, h], j) => ({ x, j, seed: c.rr(0, 9), p: S.puppet(repL.add(person(c, HELPERS[h]))) }));
    const vL = S.layer({ par: 0.32, sh: 6 });
    const V = MERCY.map((k) => vignette(S, vL, k, true));
    const Q = [0, 1].map(() => vL.add(`<g>${question(c)}</g>`));
    const sp = Array.from({ length: 6 }, () => vL.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      const rise = es(t, 4.05, 4.12);
      const spread = es(t, 5.05, 5.35);
      judgeRest(J, T, { sit: 1 - rise, flip: true, armF: 30 + es(t, 4.1, 4.3) * 50 * (1 - spread) + spread * 70, armB: 20 + es(t, 4.1, 4.3) * 110 * (1 - spread) + spread * 90, head: -4 });
      warmL.fade(0.9);
      coolL.fade(0.3);
      /* the righteous ask: when? */
      const ask = es(t, 0.1, 0.35) * (1 - es(t, 4.0, 4.3));
      const wonder = es(t, 5.1, 5.4);
      reps.forEach((r) => r.p.set({ x: r.x, y: JG.FY, s: 0.84, armF: 20 + ask * 50 + wonder * 70, armB: 10 + ask * 60 * (r.j % 2) + wonder * 40, head: -8 - ask * 6 - wonder * 6, blink: blinkAt(T, r.seed) }));
      /* v37b, 38, 39 — the pictures come back, two at a time, each with a question */
      const qs = [null, null];
      V.forEach((v, id) => {
        const [b, ids] = PAIRS.find(([, l]) => l.includes(id));
        const j = ids.indexOf(id);
        const tt = t - b;
        const inK = es(tt, 0.0, 0.25, ease.out), outK = es(tt, 0.9, 1.0, ease.in);
        const on = tt > -0.01 && tt < 1.0 && inK > 0.01;
        const x = (S.portrait ? 700 : 500) + j * (S.portrait ? 200 : 180), y = (S.portrait ? 160 : 305) - (1 - inK) * 1600 - outK * 1600;
        v.set(x, y, 0.56, 1, on ? 1 : 0, 0);
        if (on) qs[j] = [x, y, es(tt, 0.3 + j * 0.08, 0.5 + j * 0.08, ease.back) * (1 - outK)];
      });
      Q.forEach((q, j) => {
        const [x, y, qk] = qs[j] || [0, 0, 0];
        pose(q, { x: x + 80, y: y - 60, s: Math.max(0.01, qk * 0.9), r: Math.sin(T * 2 + j) * 8, o: qk > 0.01 ? 1 : 0 });
      });
      /* v40b — the least of his brothers, in his own light */
      least.forEach((m, n) => {
        const k = es(t, 5.05 + n * 0.05, 5.3 + n * 0.05);
        m.p.set({ x: m.x, y: JG.TY + 108 + (1 - k) * 20, s: 0.62, flip: m.flip, o: k, armF: 20 + (m.i === 5 ? 30 : 0), head: -6, blink: blinkAt(T, m.seed) });
        const g = es(t, 5.3 + n * 0.06, 5.55 + n * 0.06);
        pose(glows[n], { x: m.x + (m.flip ? -1 : 1) * 1.3, y: JG.TY + 108 - 167 * 0.62, s: 0.6 + g * 0.5, o: g });
        const sk = bump(t, 5.35 + n * 0.05, 5.95);
        pose(sp[n], { x: m.x, y: JG.TY + 108 - 150, s: sk, r: T * 40, o: sk });
      });

      S.cam.x = S.portrait ? 0 : -es(t, 0.05, 0.5) * 40 * (1 - es(t, 4.8, 5.2));
      S.cam.z = 1 + es(t, 4.8, 5.2) * 0.06;
      S.cam.y = -es(t, 4.8, 5.2) * 30;
    };
  },
};
