// Mt 22,46 — the questioners of that day stand silent, each under the paper "?" he came with: the lawyer, the
// Pharisee, the Sadducee, Herod's man. Not one of them can answer a word. Then they turn and go, and one by one
// their questions are drawn up into the flies; evening falls over the court, and Jesus stays with his disciples.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { templeCourt, pharisee, sadducee, herodian, scribe, moodPuppet, question, voiceRings } from './lib.js';

const JX = 780;
const QX = [920, 990, 1060, 1130];

export default {
  id: 'mt22-silence',
  beats: [
    { v: 46, text: 'I żaden z nich nie mógł Mu odpowiedzieć.' },
    { v: 46, cont: true, text: 'Nikt też od owego dnia nie odważył się więcej Go pytać.' },
  ],
  cam: { x: [-20, 20], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;
    // evening over the court (a warm veil over the set, under the people)
    const veil = S.layer({ par: 0.46, sh: 0 });
    veil.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.dusk, C.apricot, 0.35)}" opacity=".26"/>`);
    veil.fade(0);
    const stepL = S.layer({ par: 0.47, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 4, x0: 420, x1: 640, pose: 'sit' }]);

    const pl = S.layer({ par: 0.5, sh: 5 });
    const looks = [scribe(c, 0), pharisee(c, 0), sadducee(1), herodian(c, 0)];
    const Q = looks.map((o, i) => ({ i, p: moodPuppet(S, pl, c, o), x: QX[i], seed: c.rr(0, 9) }));
    const tags = Q.map((q) => hanging(pl, question(c), { x: q.x, y: 0, len: 600 }));
    const dis = [CAST.peter, CAST.john, CAST.james].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 640 - i * 56, i }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunDY: es(t, 1.0, 1.8) * 70 });
      veil.fade(es(t, 1.1, 1.8));

      /* v46a — silent under their question marks; v46b — they go, and the questions are drawn up */
      const mute = es(t, 0.15, 0.4);
      Q.forEach((q) => {
        const go = es(t, 1.05 + q.i * 0.1, 1.6 + q.i * 0.08, ease.in);
        const x = lerp(q.x, 1500 + q.i * 70, go);
        q.p.set({ x, y: F + 4 + (q.i % 2) * 8, s: 0.92, flip: go < 0.02, walk: go > 0 && go < 1 ? x * 0.05 + q.i : undefined, head: mute * 16, lean: mute * 3, armF: 20 + (1 - mute) * 30, armB: 0, blink: blinkAt(T, q.seed) });
        q.p.mood({ sad: mute * 0.8, angry: 0 });
        const up = es(t, 1.1 + q.i * 0.12, 1.5 + q.i * 0.12, ease.in);
        const droop = mute * 10;
        pose(tags[q.i], { x: q.x - 6, y: lerp(F - 250 + droop, -520, up), r: Math.sin(T * 0.9 + q.i) * 3 * (1 - up) + (q.i % 2 ? -1 : 1) * droop * 0.8, s: 1.2 });
      });

      /* Jesus */
      // evening: he turns to his disciples and walks over to them
      const walk = es(t, 1.35, 1.8);
      const jx = lerp(JX, 660, walk);
      jesus.set({ x: jx, y: F, s: 1.04, flip: walk > 0.02, walk: walk > 0 && walk < 1 ? jx * 0.05 : undefined, blink: blinkAt(T), head: 4 - es(t, 1.2, 1.8) * 8, armF: 30 + (1 - mute) * 30 + es(t, 1.7, 1.85) * 20, armB: 16 });
      voice(JX + 26, F - 176, 1 - mute, T, { dir: 1 });
      dis.forEach((d) => { const x = lerp(d.x, d.x - 110, walk); d.p.set({ x, y: F + 10 + (d.i % 2) * 8, s: 0.9, walk: walk > 0 && walk < 1 ? x * 0.05 + d.i : undefined, head: -4, armF: es(t, 1.5, 1.8) * (d.i === 0 ? 40 : 0), blink: blinkAt(T, d.i + 2) }); });
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -4, blink: blinkAt(T, m.seed) }));

      S.cam.z = 1.02 + es(t, 1.2, 1.8) * 0.04;
      S.cam.y = -es(t, 1.2, 1.8) * 20;
    };
  },
};
