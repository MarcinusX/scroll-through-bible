// J 10,37–39 — the portico at nightfall, snow thickening. "If I do not do My Father's works, do not believe Me" —
// four empty frames come down, dark and blank. "But if I do them, believe the works" — one after another the frames
// fill with light: water become wine, the mat carried, the loaves, the opened eye. "That you may know that the
// Father is in Me and I in the Father" — two circles of light, one coming down from above and one rising from Him,
// slide into each other round Him until they are one. They try again to seize Him — hands reach in from both sides —
// but He goes out of their hands: the hands close on falling snow, and far back along the colonnade a small figure
// walks away into the snow.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { winterPortico, JESUS, leader, cast, mood, voiceRings, workPlate, radiance, hanging, kf, vis, tr, WINTER_DUSK, WINTER_NIGHT, PI } from './lib.js';
import { swing } from '../kit.js';

const F = 704;
const LEAD = [[560, 704, 1.02, false, 0], [636, 670, 0.92, true, 1], [482, 724, 1.04, false, 2], [1040, 704, 1.02, false, 3], [964, 670, 0.92, true, 4], [1118, 726, 1.04, false, 5]];
const WK = [['jar', 590], ['mat', 720], ['bread', 880], ['eye', 1010]];

export default {
  id: 'j10-believe',
  beats: [
    { v: 37 },
    { v: 38, text: 'Jeżeli jednak dokonuję, to choćbyście Mnie nie wierzyli, wierzcie moim dziełom,' },
    { v: 38, cont: true, text: 'abyście poznali i wiedzieli, że Ojciec jest we Mnie, a Ja w Ojcu».' },
    { v: 39, text: 'I znowu starali się Go pojmać,' },
    { v: 39, cont: true, text: 'ale On uszedł z ich rąk.' },
  ],
  cam: { x: [-60, 80], y: [-140, 40], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const W = winterPortico(S, { skyCols: WINTER_NIGHT, FLOOR: F, veil: 0.3 });
    // the far walker goes behind the back row
    const far = S.layer({ par: 0.46, sh: 4 });
    const jFar = S.puppet(far.add(person(c, JESUS)));
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.54, sh: 6 });
    const leads = LEAD.map(([x, y, s, b, li], i) => ({ ...cast(S, b ? back : act, [{ look: leader(li), x, y, s, face: true }], 'bl' + i)[0], i, bk: b }));
    const circL = S.layer({ par: 0.52, sh: 0, flat: true });
    const cA = circL.add(`<g><circle r="150" fill="url(#halo-glow)"/><circle r="130" stroke="${C.halo}" stroke-width="6" fill="none"/></g>`);
    const cB = circL.add(`<g><circle r="120" fill="url(#warm-glow)" opacity=".6"/><circle r="100" stroke="${C.sun}" stroke-width="6" fill="none"/></g>`);
    const radEl = circL.add(`<g>${radiance(c, 30)}</g>`);
    const jesus = S.puppet(act.add(person(c, JESUS)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: true, color: shade(C.halo, -0.05) });
    const frames = WK.map(([ic, x], i) => {
      const empty = sheet().p(c.cut(c.circ(0, 0, 46, 32), 0.4, 5), mix(C.wood3, C.storm, 0.3)).p(c.cut(c.circ(0, 0, 40, 32), 0.4, 5), mix(C.stone2, C.storm, 0.5)).out();
      const el = hanging(fx, `<g class="em">${empty}</g><g class="fu" opacity="0">${workPlate(c, ic, { r: 40 })}</g>`, { x, y: 240, len: 700 });
      return { i, x, el, em: el.querySelector('.em'), fu: el.querySelector('.fu') };
    });
    const puff = fx.add(`<g>${[[-30, 0, 30], [10, -14, 26], [34, 6, 22], [-6, 16, 24]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbf8f1" opacity=".8"/>`).join('')}</g>`);
    const snowF = W.snowFront();

    return (t, time) => {
      const T = time;
      W.sk.set(...WINTER_NIGHT);
      W.update(T, { lit: 1, snow: 1 });
      snowF.update(T, 0.9 + es(t, 4, 5) * 0.1);
      /* v37 — empty frames; v38a — the works light them */
      frames.forEach((f) => {
        const k = es(t, 0.15 + f.i * 0.08, 0.45 + f.i * 0.08, ease.out);
        const up = es(t, 2.0, 2.3, ease.in);
        swing(f.el, f.x, 240 - (1 - k) * 700 - up * 700, k > 0.001 ? T : 0, 1.3, 0.8, f.i);
        fade(f.el, k > 0.001 && up < 0.99 ? 1 : 0);
        fade(f.fu, es(t, 1.15 + f.i * 0.15, 1.35 + f.i * 0.15));
      });
      /* v38b — the Father in Me and I in the Father */
      const ck = es(t, 2.1, 2.4);
      const join = es(t, 2.35, 2.85);
      const cy = F - 150;
      vis(cA, { x: lerp(620, 800, join), y: lerp(300, cy, join), s: 0.8 + join * 0.3, o: ck * (1 - es(t, 3.0, 3.3)) });
      vis(cB, { x: lerp(980, 800, join), y: cy, s: 1, o: ck * (1 - es(t, 3.0, 3.3)) });
      vis(radEl, { x: lerp(620, 800, join), y: lerp(300, cy, join), s: 1, o: ck * (1 - join * 0.7) * (1 - es(t, 3.0, 3.3)) });
      /* v39a — they try to seize Him; v39b — He goes out of their hands */
      const lunge = es(t, 3.1, 3.5);
      const slip = es(t, 4.05, 4.2);
      const away = es(t, 4.1, 4.95);
      const talk = Math.max(bump(t, 0.05, 0.95), bump(t, 1.05, 1.95), bump(t, 2.05, 2.95));
      jesus.set({ x: 800, y: F + 4 - slip * 14, s: 1.06, o: 1 - slip, flip: false, armF: 14 + talk * 16 + bump(t, 1.1, 1.9) * 40, armB: 8 + bump(t, 1.1, 1.9) * 120 + bump(t, 2.3, 2.9) * 40, head: -bump(t, 1.1, 1.9) * 12, blink: blinkAt(T, 1) });
      jFar.set({ x: lerp(820, 1220, away), y: lerp(676, 646, away), s: lerp(0.9, 0.7, away), flip: false, walk: away > 0 && away < 1 ? T * 6 : undefined, armF: 12, o: slip * (1 - es(t, 4.8, 4.98)) });
      rings(806, F - 176, talk * 0.8, T, { s0: 0.8, spread: 1.8 });
      const pk = bump(t, 4.05, 4.6);
      vis(puff, { x: 800, y: F - 110, s: 0.7 + pk * 0.8, o: pk * 0.9 });
      leads.forEach((m) => {
        const i = m.i;
        const faceL = m.x > 800;
        const d = faceL ? -1 : 1;
        const x = m.x + d * lunge * (m.bk ? 60 : 110) - d * es(t, 4.3, 4.8) * 20;
        const look = es(t, 1.2, 1.5) * (1 - es(t, 2.0, 2.3));
        const turn = es(t, 4.4, 4.7) * (i === 4 ? 1 : 0);
        m.p.set({ x, y: m.y, s: m.s, flip: turn > 0.5 ? !faceL : faceL, walk: lunge > 0 && lunge < 1 ? x * 0.08 : undefined, armF: 18 + lunge * 80 - es(t, 4.3, 4.7) * 40, armB: 10 + lunge * 60, lean: d * lunge * 10, head: -look * 18 + es(t, 4.2, 4.5) * 10, blink: blinkAt(T, m.seed) });
        mood(m, { angry: 0.4 + lunge * 0.4, sad: 0 });
      });
      S.cam.x = kf(t, [[0, 0], [4, 0], [4.9, 60]]);
      S.cam.y = kf(t, [[0, -100], [2, -90], [2.4, -10], [3, 0], [4, 10], [5, -10]]);
      S.cam.z = kf(t, [[0, 1.04], [2, 1.04], [2.5, 1.16], [3.1, 1.1], [4, 1.14], [5, 1.08]]);
    };
  },
};
