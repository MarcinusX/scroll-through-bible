// J 18,37–38a — in the dim hall. Pilate leans in: "So You are a king?" (the paper crown with its question hangs again).
// "Yes, I am a king": the paper crown is gone — above His halo a crown of light, and the hall darkens round the one
// light. "For this I was born, and for this I came into the world: to testify to the truth": a star comes down from
// the flies to the paper world on a thread of gold, and a gold word hangs — TRUTH. "Everyone who is of the truth
// listens to My voice": His voice goes out in rings, and in the dark small lights appear and turn towards Him.
// "What is truth?" — Pilate turns his back and walks towards the door; a big question mark is left hanging in the
// air, unanswered, and the light stays on Jesus.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  praetorium, praetoriumCast, PR, say, question, bigQuestion, nameTag, paperCrown, globe, lightCrown, radiance, goldWord, voiceRings, spark, lampSet, hanging, vis, kf,
  moving, headAt, pose, fade, lerp, mix, sheet, tr, blinkAt, C, PI, DAWN,
} from './lib.js';

const { FLOOR, DOOR } = PR;
const JX = 970;

export default {
  id: 'j18-truth',
  beats: [
    { v: 37, text: 'Piłat zatem powiedział do Niego: «A więc jesteś królem?»' },
    { v: 37, cont: true, text: 'Odpowiedział Jezus: «Tak, jestem królem.' },
    { v: 37, cont: true, text: 'Ja się na to narodziłem i na to przyszedłem na świat, aby dać świadectwo prawdzie.' },
    { v: 37, cont: true, text: 'Każdy, kto jest z prawdy, słucha mojego głosu».' },
    { v: 38, text: 'Rzekł do Niego Piłat: «Cóż to jest prawda?»' },
  ],
  cam: { x: [0, 400], y: [-160, 40], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const R = praetorium(S, { skyCols: DAWN });
    const dimL = S.layer({ par: PR.P, sh: 0, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c1832" opacity=".62"/>`);
    const glowL = S.layer({ par: PR.P, sh: 0, flat: true });
    const aura = glowL.add(`<g><circle r="260" fill="url(#halo-glow)"/>${radiance(c, 90)}</g>`);
    const visL = S.layer({ par: PR.P, sh: 4 });
    const world = hanging(visL, `<circle r="100" fill="url(#halo-glow)" opacity=".35"/>${globe(c, 50)}`, { x: 0, y: 0, len: 900 });
    const star = visL.add(`<g><circle r="70" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, 26, 10, 8, 0), 0.3, 3), C.halo).p(c.cut(c.circ(0, 0, 7, 10), 0.2, 2), C.star).out()}</g>`);
    const thread = visL.add(`<g><path d="M0 0L0 100" stroke="${C.haloRim}" stroke-width="2.4" fill="none"/></g>`);
    const lights = Array.from({ length: 14 }, (_, i) => ({ i, x: c.rr(420, 1440), y: c.rr(240, 620), el: visL.add(`<g>${spark(c, 8)}</g>`) }));
    const K = praetoriumCast(S, R);
    const PXI = 1110;

    const fx = S.layer({ par: PR.P, sh: 4 });
    const ask = fx.add(`<g>${say(c, tr('A więc jesteś królem?', 'Are you a king then?'), { size: 18, side: -1 })}</g>`);
    const crownQ = hanging(fx, `<g transform="translate(0 30)">${paperCrown(c, 70)}</g><g transform="translate(46 -4) scale(.9)">${question(c)}</g>`, { x: 0, y: 0, len: 800 });
    const crownL = fx.add(`<g><circle r="90" fill="url(#halo-glow)"/>${lightCrown(c, 30)}</g>`);
    const truth = hanging(fx, goldWord(c, tr('prawda', 'truth'), { size: 30 }), { x: 0, y: 0, len: 900 });
    const rings = voiceRings(fx, c, { n: 4, color: C.halo, r: 40, w: 5, both: true });
    const what = fx.add(`<g>${say(c, tr('Cóż to jest prawda?', 'What is truth?'), { size: 19, side: -1, fill: mix(C.cream, C.stone2, 0.4) })}</g>`);
    const bigQ = hanging(fx, `<circle r="70" fill="url(#halo-glow)" opacity=".25"/>${bigQuestion(c, 56, mix(C.cream, C.stone2, 0.3))}`, { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      R.sky.set(...DAWN);
      vis(R.sun, { x: 330, y: 250, o: 1 });
      const dark = es(t, 1.05, 1.4) * (1 - es(t, 4.4, 4.9) * 0.35);
      dimL.fade(0.35 + dark * 0.6);
      lampSet(R.lamp, 0.6, T);
      K.poseLead(T);
      K.poseSols(T);

      /* Pilate */
      const lean = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const pK = [[4.22, [PXI, FLOOR]], [4.7, [700, FLOOR + 2]]];
      const [px, py] = kf(t, pK, ease.sine);
      const away = t > 4.22;
      K.pil.set({ x: px, y: py, s: 1.0, flip: !away, walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 22 + lean * 40 + bump(t, 4.05, 4.4) * 40, armB: 10 + bump(t, 4.05, 4.5) * 50, head: -lean * 4 + (away ? 8 : 0), lean: lean * 6, blink: blinkAt(T, 13) });

      /* Jesus: the light on Him */
      const speak = es(t, 1.05, 1.2) * (1 - es(t, 3.9, 4.0));
      K.J.set({ x: JX, y: FLOOR, s: 1.02, flip: false, armF: 26, armB: 12 + speak * 26, head: -speak * 4, blink: blinkAt(T) });
      fade(K.jEl.querySelector('[data-part="sad"]'), 0);
      const lit = es(t, 1.05, 1.4);
      vis(aura, { x: JX, y: FLOOR - 120, s: 0.35 + lit * 0.55, r: T ? T * 2 : 0, o: 0.2 + lit * 0.8 });
      const [jhx, jhy] = headAt(JX, FLOOR, 1.02, false);
      const ck = es(t, 1.15, 1.45, ease.back);
      vis(crownL, { x: jhx, y: jhy - 58 + (T ? Math.sin(T * 1.3) * 2 : 0), s: ck, o: ck > 0.01 ? 1 : 0 });

      /* words */
      const [phx, phy] = headAt(PXI, FLOOR, 1.0, true);
      const ak = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.9, 1.0));
      vis(ask, { x: phx - 14, y: phy - 20, s: ak, o: ak > 0.01 ? 1 : 0 });
      const cq = es(t, 0.2, 0.45, ease.out) * (1 - es(t, 1.05, 1.2, ease.in));
      vis(crownQ, { x: (JX + PXI) / 2, y: 330 - (1 - cq) * 800, r: T ? Math.sin(T * 0.9) * 1.6 : 0, o: cq > 0.01 ? 1 : 0 });

      /* v37 — born to testify to the truth */
      const wk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 3.9, 4.2));   // lifts right out (a phone sees high above the roof)
      vis(world, { x: 700, y: 440 - (1 - wk) * 800, r: T ? Math.sin(T * 0.7) * 2 : 0, o: wk > 0.01 ? 1 : 0 });
      const sd = es(t, 2.15, 2.65, ease.sine);
      const sx = lerp(760, 700, sd), sy = lerp(60, 380, sd);
      vis(star, { x: sx, y: sy, s: 0.9 + (T ? Math.sin(T * 3) * 0.05 : 0), o: es(t, 2.1, 2.2) * (1 - es(t, 3.9, 4.2)) });
      const th = es(t, 2.1, 2.2) * (1 - es(t, 3.9, 4.2));
      // the thread is one straight strip, turned and stretched from its peg to the star
      pose(thread, { x: 760, y: 0, r: (Math.atan2(760 - sx, sy) * 180) / PI, sy: Math.hypot(sx - 760, sy) / 100, o: th });
      const tk = es(t, 2.4, 2.7, ease.out) * (1 - es(t, 3.9, 4.1, ease.in));
      vis(truth, { x: 860, y: 220 - (1 - tk) * 800, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: tk > 0.01 ? 1 : 0 });

      /* v37 — everyone who is of the truth listens */
      rings(jhx, jhy, es(t, 3.05, 3.2) * (1 - es(t, 3.9, 4.0)), T, { spread: 3 });
      lights.forEach((l) => {
        const k = es(t, 3.1 + l.i * 0.03, 3.4 + l.i * 0.03, ease.out);
        const pull = es(t, 3.4, 3.9) * 0.25;
        vis(l.el, { x: lerp(l.x, JX, pull), y: lerp(l.y, FLOOR - 150, pull) + (T ? Math.sin(T * 1.6 + l.i) * 4 : 0), s: 0.8, o: k * (1 - es(t, 4.1, 4.4) * 0.8) });
      });

      /* v38 — "What is truth?" — he turns away; the question hangs */
      const [p2x, p2y] = headAt(px, py, 1.0, !away);
      const w2 = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.55, 4.7));
      vis(what, { x: phx - 14, y: phy - 20, s: w2, o: w2 > 0.01 ? 1 : 0 });
      const qk = es(t, 4.4, 4.7, ease.out);
      vis(bigQ, { x: (JX + PXI) / 2 - 20, y: 300 - (1 - qk) * 800, r: T ? Math.sin(T * 0.6) * 3 : 0, o: qk > 0.01 ? 1 : 0 });
      void p2x; void p2y;

      S.cam.x = kf(t, [[0, 300], [1, 300], [1.4, 280], [2, 260], [2.5, 200], [3, 240], [4, 260], [5, 220]]);
      S.cam.y = kf(t, [[0, 0], [1, -10], [2, -80], [3, -60], [4, -40], [5, -60]]);
      S.cam.z = kf(t, [[0, 1.28], [1, 1.34], [1.4, 1.2], [2, 1.1], [3, 1.14], [4, 1.18], [5, 1.12]]);
    };
  },
};
