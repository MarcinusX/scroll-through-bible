// Mt 25,44–46 — those on the left ask too, open-handed: "Lord, when did we see you…?" — the six undone scenes hang in
// a row above them, each with its question. The King rises: "Truly I tell you" — and the six least stand again at the
// foot of his throne in his light: "what you did not do to one of the least of these, you did not do to me." Then
// they turn away and go off into the shade, into eternal punishment — nothing more is shown. And the righteous go
// into eternal life: the golden gate of the Kingdom opens wide in the clouds on the right hand of the King, and they
// walk towards its light, the sheep going with them, while the King turns to them with open arms.
import { C, person, blinkAt, pose, lerp, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { judgementSet, JG, flockAt, judgeRest, shadeLayer, glowDisc, vignette, MERCY, LEAST, kingdomGateSet, nationsMarkup, question, sparkle } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const SPOT = [[600, 0], [652, 1], [704, 2], [896, 5], [948, 4], [1000, 3]];
const REP = [960, 1050, 1140];
const REP_P = [920, 1000, 1080];                 // phone: the last of them stays clear of the edge and the thread

export default {
  id: 'mt25-end',
  beats: [
    { v: 44 },
    { v: 45, text: 'Wtedy odpowie im: "Zaprawdę, powiadam wam:' },
    { v: 45, cont: true, text: 'Wszystko, czego nie uczyniliście jednemu z tych najmniejszych, tegoście i Mnie nie uczynili".' },
    { v: 46, text: 'I pójdą ci na mękę wieczną,' },
    { v: 46, cont: true, text: 'sprawiedliwi zaś do życia wiecznego».' },
  ],
  cam: { x: [-60, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    let gate;
    const J = judgementSet(S, { behind: (S2) => { const L = S2.layer({ par: 0.2, sh: 4 }); gate = kingdomGateSet(S2, L, S2.portrait ? { x: 800, y: 240, sc: 1.2 } : { x: 450, y: 520, sc: 1.4 }); return L; } });
    const c = J.c;
    const warmL = J.warmL;
    const coolL = shadeLayer(S);
    const leastL = S.layer({ par: 0.31, sh: 5 });
    const glows = SPOT.map(() => leastL.add(`<g>${glowDisc(46, 'halo-glow', 1)}<path d="${c.cut(c.circ(0, 0, 21, 18), 0.3, 3)}" fill="none" stroke="${C.haloRim}" stroke-width="2.6"/></g>`));
    const least = SPOT.map(([x, i]) => {
      const k = MERCY[i];
      return { x, i, flip: x > JG.TX, seed: c.rr(0, 9), p: S.puppet(leastL.add(person(c, LEAST[k]))) };
    });
    const repL = S.layer({ par: 0.45, sh: 5 });
    const oc = makeCutter('mt25-left-reps');
    const reps = (S.portrait ? REP_P : REP).map((x, j) => ({ x, j, seed: c.rr(0, 9), p: S.puppet(repL.add(person(c, { robe: [C.indigo, C.ochreRobe, C.terracotta][j], mantle: [C.sun, null, C.wheatRobe][j], skin: [C.skin4, C.skin2, C.skin3][j], hair: C.hair3, hairStyle: j === 1 ? 'veil' : 'wrap', veil: [C.ochre, C.linen, C.cream][j], beard: j === 1 ? 'none' : 'full', belt: C.sun }))) }));
    const vL = S.layer({ par: 0.3, sh: 6 });
    const V = MERCY.map((k) => vignette(S, vL, k, false));
    const Q = V.map(() => vL.add(`<g>${question(c)}</g>`));
    const sp = Array.from({ length: 6 }, () => vL.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v45a — he rises; v46b — he turns to the righteous with open arms */
      const rise = es(t, 1.05, 1.12);
      const toRight = es(t, 4.05, 4.12);
      const open = es(t, 4.1, 4.4);
      const heart = es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.1));
      const lift = es(t, 1.1, 1.3) * (1 - es(t, 2.05, 2.2));
      const leave = es(t, 3.05, 3.9, (u) => u);
      judgeRest(J, T, { sit: 1 - rise, flip: toRight > 0.5, armF: 30 + lift * 70 + heart * 10 + open * 60, armB: 10 + lift * 20 + heart * 40 + open * 100, head: -2 - open * 4, glowO: 1, rightNat: false, leftNat: false });
      /* v44 — they ask too; the six undone, each with a question */
      const ask = es(t, 0.1, 0.35) * (1 - es(t, 1.9, 2.2));
      const bow = es(t, 2.2, 2.5);
      reps.forEach((r) => r.p.set({ x: r.x + leave * 320, y: JG.FY, s: 0.84, flip: leave < 0.05, o: 1 - es(t, 3.5, 3.95), armF: 20 + ask * 60, armB: 10 + ask * 50 * (r.j % 2), head: -6 - ask * 6 + bow * 20, walk: leave > 0.05 && leave < 1 ? (r.x + leave * 320) * 0.06 : undefined, blink: blinkAt(T, r.seed) }));
      V.forEach((v, i) => {
        const k = es(t, 0.1 + i * 0.06, 0.35 + i * 0.06, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
        const P = S.portrait;
        const x = P ? 650 + (i % 3) * 150 : 650 + i * 98, y = lerp(-1500, P ? 110 + Math.floor(i / 3) * 100 : 176, k);
        v.set(x, y, P ? 0.4 : 0.3, 0, k > 0.01 ? 1 : 0, 0);
        const qk = es(t, 0.45 + i * 0.05, 0.6 + i * 0.05, ease.back) * (1 - es(t, 1.9, 2.0));
        pose(Q[i], { x: x + 36, y: y + 30, s: Math.max(0.01, qk * 0.6), r: Math.sin(T * 2 + i) * 8, o: qk > 0.01 ? 1 : 0 });
      });
      /* v45b — the least, in his light */
      least.forEach((m, n) => {
        const k = es(t, 2.05 + n * 0.05, 2.3 + n * 0.05) * (1 - es(t, 3.9, 4.1));
        m.p.set({ x: m.x, y: JG.TY + 108 + (1 - k) * 20, s: 0.62, flip: m.flip, o: k, head: -6, blink: blinkAt(T, m.seed) });
        pose(glows[n], { x: m.x + (m.flip ? -1 : 1) * 1.3, y: JG.TY + 108 - 167 * 0.62, s: 1, o: k });
        const sk = bump(t, 2.3 + n * 0.05, 2.9);
        pose(sp[n], { x: m.x, y: JG.TY + 108 - 150, s: sk, r: T * 40, o: sk });
      });
      /* v46a — they go away into the shade */
      J.NR.back.set({ x: J.RX + leave * 360, y: JG.NY - 30 - leave * 30, s: 1 - leave * 0.15, o: 1 - es(t, 3.4, 3.95) });
      J.NR.front.set({ x: J.RX + leave * 420, y: JG.NY + 10 - leave * 30, s: 1 - leave * 0.15, o: 1 - es(t, 3.5, 3.95) });
      coolL.fade(0.3 + leave * 0.3 * (1 - es(t, 4.0, 4.6)));
      /* v46b — the righteous into eternal life: the gate opens, they go towards its light */
      const go = es(t, 4.1, 4.9, (u) => u);
      gate.set(es(t, 4.0, 4.4, ease.out), es(t, 4.3, 4.7));
      J.NL.back.set({ x: J.LX - go * 70, y: JG.NY - 30 - go * 30, s: 1 - go * 0.1 });
      J.NL.front.set({ x: J.LX - go * 90, y: JG.NY + 10 - go * 34, s: 1 - go * 0.1 });
      flockAt(J, 1, T, { sheepX: J.SX - go * 80, goatX: J.GX + leave * 500, y: JG.FY, goatO: 1 - es(t, 3.5, 3.95) });
      warmL.fade(0.8 + es(t, 4.1, 4.5) * 0.2);

      S.cam.x = S.portrait ? 0 : -es(t, 4.0, 4.5) * 60;
      S.cam.y = -es(t, 4.0, 4.5) * 40;
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.04 * (1 - es(t, 3.0, 3.4));
    };
  },
};
