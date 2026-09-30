// J 10,22–26 — winter in Jerusalem: grey snow sky, white roofs on the sanctuary, snow falling. For the Feast of the
// Dedication the little clay lamps along Solomon's Portico are kindled one by one. Jesus walks in along the
// colonnade. The leaders close round Him: "How long will You keep us in suspense?" — a question mark swings like a
// pendulum; "If You are the Christ, tell us plainly" — a card "the Christ?" is held up. "I told you, and you do not
// believe" — His words, a golden slip, drop at their folded arms. "The works I do in My Father's name bear witness"
// — plates of His signs come down glowing: water become wine, the mat carried, the loaves, the opened eye. "But you
// do not believe, because you are not of My sheep" — a little flock of light gathers at His feet; they stand apart.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet, swing } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import {
  winterPortico, JESUS, leader, cast, mood, voiceRings, nameTag, question, word, workPlate, ewe, sheepRig, hanging, kf, vis, tr,
  WINTER, WINTER_DUSK, FONT, PI,
} from './lib.js';

const F = 704;
const LEAD = [
  { from: [300, 700], to: [598, 700], s: 1.02, back: false },
  { from: [240, 670], to: [668, 668], s: 0.92, back: true },
  { from: [360, 720], to: [540, 724], s: 1.04, back: false },
  { from: [1320, 704], to: [1004, 704], s: 1.02, back: false },
  { from: [1380, 670], to: [936, 668], s: 0.92, back: true },
  { from: [1300, 724], to: [1070, 726], s: 1.04, back: false },
];
const PLATES = [['jar', 590], ['mat', 720], ['bread', 880], ['eye', 1010]];

export default {
  id: 'j10-winter',
  beats: [
    { v: 22 },
    { v: 23 },
    { v: 24, text: 'Otoczyli Go Żydzi i mówili do Niego: «Dokąd będziesz nas trzymał w niepewności?' },
    { v: 24, cont: true, text: 'Jeśli Ty jesteś Mesjaszem, powiedz nam otwarcie!»' },
    { v: 25, text: 'Rzekł do nich Jezus: «Powiedziałem wam, a nie wierzycie.' },
    { v: 25, cont: true, text: 'Czyny, których dokonuję w imię mojego Ojca, świadczą o Mnie.' },
    { v: 26 },
  ],
  cam: { x: [-80, 80], y: [-140, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const W = winterPortico(S, { skyCols: WINTER, FLOOR: F });
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.54, sh: 6 });
    const leads = LEAD.map((o, i) => ({ ...o, ...cast(S, o.back ? back : act, [{ look: leader(i), x: 0, y: 0, s: o.s, face: true }], 'w' + i)[0], i }));
    const flockL = S.layer({ par: 0.54, sh: 3 });
    const flock = [0, 1, 2, 3, 4].map((i) => ({ i, r: sheepRig(flockL.add(`<g><ellipse cx="0" cy="-26" rx="60" ry="40" fill="url(#halo-glow)"/>${ewe(c, { wool: mix(C.linen, C.halo, 0.35), lamb: i === 4 })}</g>`)) }));
    const jesus = S.puppet(act.add(person(c, JESUS)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: true, color: shade(C.halo, -0.05) });
    const tagF = hanging(fx, nameTag(c, [tr('Święto Poświęcenia', 'Feast of Dedication'), tr('zima', 'winter')], { size: 18 }), { x: 800, y: 210, len: 700 });
    const tagP = hanging(fx, nameTag(c, tr('portyk Salomona', 'Solomon’s porch'), { size: 18 }), { x: 480, y: 270, len: 700 });
    const qPend = hanging(fx, `<g transform="scale(2.2)">${question(c)}</g>`, { x: 800, y: 250, len: 700 });
    const card = fx.add(`<g>${word(c, tr('Mesjasz?', 'the Christ?'), { size: 24, fill: C.cream, ink: C.terracotta })}</g>`);
    const slip = fx.add(`<g><circle r="50" fill="url(#halo-glow)"/>${word(c, tr('powiedziałem wam', 'I told you'), { size: 17, fill: C.cream })}</g>`);
    const plates = PLATES.map(([ic, x], i) => ({ x, i, el: hanging(fx, workPlate(c, ic, { r: 44 }), { x, y: 250, len: 700 }) }));
    const line = fx.add(`<path d="M${540} ${F + 40}Q800 ${F + 80} ${1060} ${F + 40}" stroke="${C.haloRim}" stroke-width="3" stroke-dasharray="10 8" fill="none" opacity="0"/>`);
    const front = W.front();
    const snowF = W.snowFront();

    return (t, time) => {
      const T = time;
      W.sk.blend(WINTER, WINTER_DUSK, es(t, 2, 7) * 0.45);
      /* v22 — the feast in winter: the lamps kindled one by one */
      W.update(T, { lit: (i) => es(t, 0.15 + i * 0.045, 0.3 + i * 0.045), snow: 1 });
      snowF.update(T, 0.9);
      const tf = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      swing(tagF, 800, 210 - (1 - tf) * 700, tf > 0.001 ? T : 0, 1.2, 0.7);
      fade(tagF, tf > 0.001 ? 1 : 0);
      /* v23 — He walks in the portico */
      const walk = es(t, 0.8, 1.85);
      const jx = lerp(120, 800, walk);
      const tp = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      swing(tagP, S.portrait ? 620 : 520, 270 - (1 - tp) * 700, tp > 0.001 ? T : 0, 1.2, 0.8, 1);
      fade(tagP, tp > 0.001 ? 1 : 0);
      /* v24 — they surround Him */
      const sur = (i) => es(t, 2.0 + (i % 3) * 0.08, 2.55 + (i % 3) * 0.08);
      const qk = es(t, 2.4, 2.7, ease.out) * (1 - es(t, 2.95, 3.1, ease.in));
      pose(qPend, { x: 800, y: 250 - (1 - qk) * 700, r: qk > 0.01 ? Math.sin((T || t * 3) * 2.2) * 16 : 0, o: qk > 0.001 ? 1 : 0 });
      const ck = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      /* v25a — I told you: the slip falls at their folded arms */
      const sl = es(t, 4.15, 4.6);
      const fall = es(t, 4.6, 4.9, ease.in);
      vis(slip, { x: lerp(830, 990, sl), y: lerp(540, 560, sl) + fall * 130, r: fall * 30, s: 1, o: sl > 0.01 ? 1 - es(t, 4.8, 4.95) : 0 });
      const fold = es(t, 4.4, 4.6);
      /* v25b — the works bear witness */
      plates.forEach((p) => {
        const k = es(t, 5.1 + p.i * 0.1, 5.4 + p.i * 0.1, ease.out) * (1 - es(t, 6.05, 6.3, ease.in) * 0);
        const up = es(t, 6.4, 6.7, ease.in);
        swing(p.el, p.x, 250 - (1 - k) * 700 - up * 700, k > 0.001 ? T : 0, 1.4, 0.8, p.i);
        fade(p.el, k > 0.001 && up < 0.99 ? 1 : 0);
      });
      /* v26 — His sheep; they stand apart */
      const fk = es(t, 6.1, 6.5);
      flock.forEach((m) => {
        const x = [724, 790, 856, 760, 824][m.i], y = [716, 722, 716, 732, 736][m.i];
        m.r.set({ x, y, s: m.i === 4 ? 0.8 : 0.9, flip: false, head: -12 * fk, o: fk * (0.95) });
      });
      attr(line, 'opacity', es(t, 6.3, 6.6) * 0.8);
      const talk = Math.max(bump(t, 4.05, 4.95), bump(t, 5.05, 5.95), bump(t, 6.05, 6.95));
      jesus.set({ x: jx, y: F + 4, s: 1.06, flip: false, walk: walk > 0 && walk < 1 ? jx * 0.06 : undefined, armF: 14 + talk * 20 + bump(t, 5.2, 5.9) * 40, armB: 8 + bump(t, 5.1, 5.9) * 130 + bump(t, 6.1, 6.9) * 30, head: -bump(t, 5.2, 5.9) * 10, blink: blinkAt(T, 1) });
      rings(jx + 6, F - 176, talk * 0.9, T, { s0: 0.8, spread: 1.8 });
      leads.forEach((m) => {
        const k = sur(m.i);
        const apart = es(t, 6.05, 6.45) * (m.to[0] < 800 ? -1 : 1) * (S.portrait ? 40 : 70);
        const x = lerp(m.from[0], m.to[0], k) + apart, y = lerp(m.from[1], m.to[1], k);
        const faceL = m.to[0] > 800;
        const speaker = m.i === 3 && (bump(t, 2.05, 2.95) + bump(t, 3.05, 3.95)) > 0;
        const holdCard = m.i === 0;
        m.p.set({ x, y, s: m.s, flip: faceL, walk: k > 0 && k < 1 ? x * 0.07 : undefined, armF: 18 + (speaker ? 50 : 0) + (holdCard ? ck * 110 : 0) + fold * 50 * (m.back ? 0 : 1) - (holdCard ? fold * 50 : 0), armB: 10 + (m.i === 4 ? bump(t, 2.1, 2.9) * 110 : 0) + fold * 40 * (m.back ? 0 : 1), head: (m.i % 2 ? 4 : -4) - fold * 8 * (m.i % 2 ? -1 : 1), o: k > 0.001 ? 1 : 0, blink: blinkAt(T, m.seed) });
        mood(m, { angry: 0.2 + es(t, 2.2, 2.6) * 0.4 + fold * 0.2 });
        if (holdCard) {
          const hx = x + 7 * m.s + 57 * m.s * Math.sin((18 + ck * 110) * PI / 180), hy = y - 138 * m.s + 57 * m.s * Math.cos((18 + ck * 110) * PI / 180);
          vis(card, { x: hx + 20, y: hy - 30, s: ck, r: -6, o: ck > 0.01 ? 1 : 0 });
        }
      });
      S.cam.x = kf(t, [[0, 0], [1, -40], [1.9, 0], [4, 0], [5, 0]]);
      S.cam.y = kf(t, [[0, -120], [0.9, -60], [1.9, 20], [2.3, -40], [3, 0], [5, -80], [6, -40], [7, 20]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.04], [2, 1.14], [3, 1.16], [5, 1.06], [6, 1.06], [7, S.portrait ? 1.02 : 1.16]]); // phone: all six stay in view as they step apart
    };
  },
};
