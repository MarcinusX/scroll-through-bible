// Mt 11,16–17 — a market square in a Galilean town, awnings and stalls, grown-ups standing about with folded arms.
// "To what shall I compare this generation?" Jesus asks, standing on the step of the fountain. In front of Him the
// children of the market are at play: three sit on the kerb and call to their friends across the square. "We played
// the flute for you": they pipe and shake the tambourine, notes float over — but the others fold their arms and turn
// away. "We wailed": they cover their faces and weep over a little rag-doll on a board, like mourners at a funeral —
// and the others only yawn and look elsewhere.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { townSet, kid, kidHead, flute, tambourine, note, tear, question, throng, headAt, voiceRings, kf, PI } from './lib.js';

const JX = 800, JY = 690;
const KY = 734;                                   // the children's ground
const A = [[450, 0], [560, 2], [670, 4]];         // the callers (sitting on the kerb), x and look
const B = [[940, 1], [1045, 3], [1150, 5]];       // their companions (standing)

/** a stone basin fountain with a step (origin: its foot, centre) */
function fountain(c) {
  const s = sheet();
  s.p(c.cut([[-150, 0], [-140, -22], [140, -22], [150, 0]], 0.5, 8), C.stone2);
  s.p(c.cut([[-110, -22], [-104, -64], [104, -64], [110, -22]], 0.5, 8), C.stone);
  s.p(c.cut([[-116, -64], [116, -64], [112, -74], [-112, -74]], 0.4, 8), shade(C.stone, 0.1));
  s.p(c.cut(c.rect(-8, -130, 16, 60), 0.3, 5), C.stone2);
  s.p(c.cut(c.ell(0, -132, 26, 8, 14), 0.3, 4), C.stone);
  return s.out();
}
/** a little rag doll lying on a board (origin: the board's centre) */
function doll(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-34, -4, 68, 8), 0.3, 5), C.wood3);
  s.p(c.cut([[-22, -4], [-20, -14], [14, -16], [18, -4]], 0.4, 4), C.linen2);
  s.p(c.cut(c.circ(-26, -12, 7, 10), 0.3, 3), C.parchment);
  return s.out();
}

export default {
  id: 'mt11-market',
  beats: [
    { v: 16, text: 'Lecz z kim mam porównać to pokolenie?' },
    { v: 16, cont: true, text: 'Podobne jest do przebywających na rynku dzieci, które przymawiają swym rówieśnikom:' },
    { v: 17, text: '"Przygrywaliśmy wam, a nie tańczyliście;' },
    { v: 17, cont: true, text: 'biadaliśmy, a wyście nie zawodzili".' },
  ],
  cam: { x: [-60, 60], y: [0, 170], z: [1, 1.6] },
  build(S) {
    const T0 = townSet(S, { gy: 650, market: true, gap: [600, 1000] });
    const c = T0.c;

    /* this generation: grown-ups standing about */
    const back = S.layer({ par: 0.45, sh: 4 });
    back.sprite(throng(makeCutter('mt11-mk-a'), 5, { s: 0.74, rows: 2, spread: 40, arms: 70 }), 330, 676);
    back.sprite(throng(makeCutter('mt11-mk-b'), 5, { s: 0.74, rows: 2, spread: 40, arms: 70, flip: true }), 1280, 676);
    back.add(`<g transform="translate(${JX} ${JY + 4})">${fountain(c)}</g>`);

    /* Jesus on the step of the fountain */
    const act = S.layer({ par: 0.45, sh: 5 });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });
    const q = act.add(`<g>${question(c)}</g>`);

    /* the children */
    const kidsL = S.layer({ par: 0.5, sh: 5 });
    const board = kidsL.add(`<g>${doll(c)}</g>`);
    const callers = A.map(([x, look], i) => ({
      i, x,
      p: S.puppet(kidsL.add(kid(c, look, { pose: 'sit', holdF: i === 1 ? `<g transform="translate(4 6) scale(1.2)">${tambourine(c)}</g>` : `<g transform="rotate(-30) scale(1.1)">${flute(c)}</g>` }))),
    }));
    const friends = B.map(([x, look], i) => ({ i, x, p: S.puppet(kidsL.add(kid(c, look))) }));
    const fx = S.layer({ par: 0.5, sh: 3 });
    const calls = callers.map((cl) => voiceRings(fx, c, { n: 2, color: C.ochre, r: 22, w: 4, both: false }));
    const notes = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g>${note(c, 8, [C.teal2, C.terracotta, C.plumRobe][i % 3])}</g>`) }));
    const tears = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${tear(c, 4)}</g>`) }));

    return (t, time) => {
      const T = time;
      T0.update(T);

      /* v16a — "to what shall I compare this generation?" */
      const ask = es(t, 0.1, 0.3);
      const showKids = es(t, 1.0, 1.2);
      jesus.set({ x: JX, y: JY - 22, s: 0.98, flip: false, armF: 20 + ask * 40 + showKids * 30, armB: 10 + ask * 80 * (1 - showKids), head: -ask * 4 + showKids * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, JY - 22, 0.98);
      voice(hx, hy, ask * (1 - es(t, 1.8, 2.0)), T, { dir: 1, spread: 2.2 });
      const qk = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(q, { x: hx + 40, y: hy - 70 + (T ? Math.sin(T * 2) * 3 : 0), s: qk, r: T ? Math.sin(T * 1.6) * 6 : 0, o: qk > 0.02 ? 1 : 0 });

      /* v16b — the children call to their friends */
      const call = es(t, 1.1, 1.3) * (1 - es(t, 1.9, 2.0));
      const play = es(t, 2.05, 2.2) * (1 - es(t, 2.92, 3.02));
      const wail = es(t, 3.05, 3.2);
      callers.forEach((cl) => {
        const pip = T ? Math.sin(T * 5 + cl.i) : 0;
        const armF = 30 + call * 60 + play * (cl.i === 1 ? 90 + pip * 30 : 130) + wail * 130;
        const armB = 20 + call * (cl.i === 1 ? 20 : 120) + play * (cl.i === 1 ? 40 : 120) + wail * 150;
        cl.p.set({ x: cl.x, y: KY, s: 0.8, armF, armB, head: -call * 10 - play * 6 + wail * 16 + (play && cl.i === 1 ? pip * 4 : 0), lean: wail * 10, blink: blinkAt(T, cl.i + 1) });
        const [kx, ky] = kidHead(cl.x, KY, 0.8, false, 62);
        calls[cl.i](kx + 8, ky, call, T, { dir: 1, spread: 1.8 });
      });
      friends.forEach((f) => {
        const look = es(t, 1.35 + f.i * 0.05, 1.5 + f.i * 0.05);
        const away = es(t, 2.35 + f.i * 0.06, 2.45 + f.i * 0.06);
        const fold = es(t, 2.3, 2.45);
        const yawn = bump(t, 3.35 + f.i * 0.1, 3.8 + f.i * 0.1);
        f.p.set({ x: f.x, y: KY + 8, s: 0.8, flip: look > 0.5 && away < 0.5, armF: 20 + fold * 60 + yawn * (f.i === 1 ? 90 : 0), armB: 20 + fold * 64 + yawn * (f.i === 1 ? 60 : 0), head: -yawn * 14 + away * 6, blink: blinkAt(T, f.i + 5) });
      });
      // the notes float across to them, and fall flat
      notes.forEach((n) => {
        const k = T ? (T * 0.35 + n.i / 7) % 1 : n.i / 7;
        const x = lerp(560, 1080, k), y = KY - 150 - Math.sin(k * PI) * 90 + (n.i % 3) * 16 + k * k * 60;
        pose(n.el, { x, y, r: Math.sin(k * 8) * 16, s: 1.2, o: play * Math.sin(k * PI) });
      });
      // the pretend funeral: the doll on its board, tears
      pose(board, { x: 560, y: KY + 6, o: es(t, 2.98, 3.1) });
      tears.forEach((tr_) => {
        const cl = callers[tr_.i % 3];
        const [kx, ky] = kidHead(cl.x, KY, 0.8, false, 62);
        const k = T ? (T * 0.8 + tr_.i / 6) % 1 : tr_.i / 6;
        pose(tr_.el, { x: kx + 10 + (tr_.i > 2 ? -6 : 0), y: ky + 8 + k * 40, o: wail * (1 - k) });
      });

      /* camera: the square, then down to the children */
      const down = es(t, 0.95, 1.3);
      S.cam.z = lerp(1.14, 1.6, down);
      S.cam.y = lerp(10, 170, down);
      S.cam.x = 0;
    };
  },
};
