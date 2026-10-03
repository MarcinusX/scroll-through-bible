// Łk 7,31–32 — the market square of a lakeside town, awnings and stalls. Jesus stands on the step of the fountain:
// "To what shall I compare the people of this generation? What are they like?" — round the square the grown-ups
// stand with their arms folded and their faces turned away. "They are like children sitting in the marketplace,
// calling to one another": two little groups sit facing each other across the square. "We played the flute for you,
// and you did not dance": one group pipes and shakes the tambourine and holds up a wedding garland, the notes fly
// across — the others fold their arms. "We wailed, and you did not weep": now they play at a funeral, hands over
// their faces round a rag doll on a board — and the others yawn and turn their backs.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { townSet, kid, kidHead, flute, tambourine, note, tear, question, throng, folkGroup, headAt, voiceRings, kf, PI } from './lib.js';

const JX = 800, JY = 676;
const KY = 728;
const A = [[480, 0], [565, 2], [650, 4]];      // the callers (sitting on the left)
const B = [[955, 1], [1040, 3], [1125, 5]];    // the others (sitting on the right)

function fountain(c) {
  const s = sheet();
  s.p(c.cut([[-130, 0], [-120, -20], [120, -20], [130, 0]], 0.5, 8), C.stone2);
  s.p(c.cut([[-96, -20], [-90, -58], [90, -58], [96, -20]], 0.5, 8), C.stone);
  s.p(c.cut([[-100, -58], [100, -58], [96, -68], [-96, -68]], 0.4, 8), shade(C.stone, 0.1));
  s.p(c.cut(c.rect(-8, -120, 16, 56), 0.3, 5), C.stone2);
  s.p(c.cut(c.ell(0, -122, 24, 7, 14), 0.3, 4), C.stone);
  return s.out();
}
function doll(c) {
  return sheet().p(c.cut(c.rect(-34, -4, 68, 8), 0.3, 5), C.wood3).p(c.cut([[-22, -4], [-20, -14], [14, -16], [18, -4]], 0.4, 4), C.linen2).p(c.cut(c.circ(-26, -12, 7, 10), 0.3, 3), C.parchment).out();
}
function garland(c) {
  let d = '';
  for (let i = 0; i < 9; i++) { const a = PI + (i / 8) * PI; d += c.cut(c.star(Math.cos(a) * 30, Math.sin(a) * 20, 6, 3, 5, i), 0.2, 3); }
  return sheet().p(c.ribbon(c.arc(0, 0, 30, 20, PI, 2 * PI, 10), 2), C.moss).p(d, C.roseRobe).out();
}

export default {
  id: 'lk7-market',
  beats: [
    { v: 31 },
    { v: 32, text: 'Podobni są do dzieci, które przebywają na rynku i głośno przymawiają jedne drugim:' },
    { v: 32, cont: true, text: '"Przygrywaliśmy wam, a nie tańczyliście;' },
    { v: 32, cont: true, text: 'biadaliśmy, a wyście nie płakali".' },
  ],
  cam: { x: [-40, 40], y: [0, 150], z: [1, 1.5] },
  build(S) {
    const T0 = townSet(S, { gy: 650, market: true, gap: [600, 1000] });
    // phone: the two groups of children sit closer in (the outer ones were cut by the edge and the thread), the camera
    // zooms a little less, and the notes fly a little higher so they pass over His head, not across His face
    const PH = S.portrait;
    const AX = PH ? [535, 600, 665] : A.map((a) => a[0]);
    const BX = PH ? [900, 960, 1020] : B.map((b) => b[0]);
    const c = T0.c;
    /* this generation: grown-ups standing about, arms folded, faces turned away */
    const back = S.layer({ par: 0.45, sh: 4 });
    back.sprite(throng(makeCutter('lk7-mk-a'), 5, { s: 0.72, rows: 2, spread: 40, arms: 60, flip: true }), 330, 668);
    back.sprite(throng(makeCutter('lk7-mk-b'), 5, { s: 0.72, rows: 2, spread: 40, arms: 60 }), 1270, 668);
    back.add(`<g transform="translate(${JX} ${JY + 4})">${fountain(c)}</g>`);
    const act = S.layer({ par: 0.45, sh: 5 });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });
    const q = act.add(`<g opacity="0">${question(c)}</g>`);
    /* the children */
    const kidsL = S.layer({ par: 0.5, sh: 5 });
    const hold = [`<g transform="rotate(-30) scale(1.1)">${flute(c)}</g>`, `<g transform="translate(4 6) scale(1.2)">${tambourine(c)}</g>`, `<g transform="translate(6 -4)">${garland(c)}</g>`];
    const callers = A.map(([x0, look], i) => ({ i, x: AX[i], p: S.puppet(kidsL.add(kid(c, look, { pose: 'sit', holdF: hold[i] }))) }));
    const others = B.map(([x0, look], i) => ({ i, x: BX[i], p: S.puppet(kidsL.add(kid(c, look, { pose: 'sit' }))) }));
    const fx = S.layer({ par: 0.5, sh: 3 });
    const board = fx.add(`<g opacity="0">${doll(c)}</g>`);
    const callA = callers.map(() => voiceRings(fx, c, { n: 2, color: C.ochre, r: 22, w: 4, both: false }));
    const callB = others.map(() => voiceRings(fx, c, { n: 2, color: C.ochre, r: 22, w: 4, both: false }));
    const notes = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${note(c, 8, [C.teal2, C.terracotta, C.plumRobe][i % 3])}</g>`) }));
    const tears = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${tear(c, 4)}</g>`) }));

    return (t, time) => {
      const T = time;
      T0.update(T);
      /* v31 — "To what shall I compare the people of this generation?" */
      const ask = es(t, 0.08, 0.25);
      const showKids = es(t, 1.0, 1.2);
      jesus.set({ x: JX, y: JY - 20, s: 0.98, armF: 20 + ask * 40 + showKids * 30, armB: 10 + ask * 90 * (1 - showKids), head: -ask * 4 + showKids * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, JY - 20, 0.98);
      voice(hx, hy, ask * (1 - es(t, 1.8, 2.0)), T, { dir: 1, spread: 2.2 });
      const qk = es(t, 0.2, 0.36, ease.back) * (1 - es(t, 0.98, 1.06));
      pose(q, { x: hx + 50, y: hy - 70 + (T ? Math.sin(T * 2) * 3 : 0), s: qk * 1.2, r: T ? Math.sin(T * 1.6) * 6 : 0, o: qk > 0.02 ? 1 : 0 });

      /* v32a — children calling to one another across the square */
      const call = bump(t, 1.1, 1.95);
      const play = es(t, 2.05, 2.2) * (1 - es(t, 2.92, 3.02));
      const wail = es(t, 3.05, 3.2);
      callers.forEach((cl) => {
        const pip = Math.sin(t * 40 + cl.i);
        const armF = 30 + call * 40 + play * (cl.i === 1 ? 90 + pip * 30 : cl.i === 2 ? 150 : 130) + wail * 130;
        const armB = 20 + call * (cl.i === 1 ? 20 : 110) + play * (cl.i === 1 ? 40 : 120) + wail * 150;
        cl.p.set({ x: cl.x, y: KY, s: 0.8, armF: Math.min(170, armF), armB: Math.min(170, armB), head: -call * 10 - play * 6 + wail * 16 + (play && cl.i === 1 ? pip * 4 : 0), lean: wail * 10, blink: blinkAt(T, cl.i + 1) });
        const [kx, ky] = kidHead(cl.x, KY, 0.8, false, 62);
        callA[cl.i](kx + 8, ky, call, T, { dir: 1, spread: 1.8 });
      });
      others.forEach((f) => {
        const back2 = es(t, 1.45 + f.i * 0.05, 1.55 + f.i * 0.05) * (1 - es(t, 1.95, 2.0));
        const turn = es(t, 2.3 + f.i * 0.06, 2.36 + f.i * 0.06);
        const yawn = es(t, 3.3 + f.i * 0.08, 3.45 + f.i * 0.08);
        const sulk = turn * (1 - yawn);
        f.p.set({ x: f.x, y: KY + 4, s: 0.8, flip: turn < 0.5, armF: 20 + back2 * 60 + sulk * 40 + yawn * (f.i === 1 ? 150 : f.i === 0 ? 60 : 20), armB: 20 + back2 * 100 + sulk * 40 + yawn * (f.i === 2 ? 150 : 10), head: sulk * 14 - yawn * (f.i === 1 ? 16 : -20), lean: yawn * (f.i === 0 ? 14 : 0), blink: yawn > 0.3 ? 1 : blinkAt(T, f.i + 5) });
        const [kx, ky] = kidHead(f.x, KY + 4, 0.8, true, 62);
        callB[f.i](kx - 8, ky, back2, T, { dir: -1, spread: 1.8 });
      });
      notes.forEach((n) => {
        const k = T ? (T * 0.35 + n.i / 7) % 1 : n.i / 7;
        const x = PH ? lerp(620, 1040, k) : lerp(600, 1080, k), y = KY - 150 - Math.sin(k * PI) * (PH ? 170 : 90) + (n.i % 3) * 16 + k * k * 60;
        pose(n.el, { x, y, r: Math.sin(k * 8) * 16, s: 1.2, o: play * Math.sin(k * PI) });
      });
      pose(board, { x: 610, y: KY + 10, o: es(t, 2.98, 3.1) });
      tears.forEach((tr_) => {
        const cl = callers[tr_.i % 3];
        const [kx, ky] = kidHead(cl.x, KY, 0.8, false, 62);
        const k = T ? (T * 0.8 + tr_.i / 6) % 1 : tr_.i / 6;
        pose(tr_.el, { x: kx + 10 + (tr_.i > 2 ? -6 : 0), y: ky + 8 + k * 40, o: wail * (1 - k) });
      });

      const down = es(t, 0.95, 1.3);
      S.cam.z = PH ? lerp(1.06, 1.14, down) : lerp(1.1, 1.26, down);
      S.cam.y = lerp(10, 60, down);
      S.cam.x = 0;
      void folkGroup; void seg; void kf;
    };
  },
};
