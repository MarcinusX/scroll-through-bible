// Mt 20,29–31 — out of Jericho, the city of palms, comes Jesus with the disciples, and a great crowd streams out of the
// gate after them. By the road sit two blind men on their spread cloaks (one of them Mark's Bartimaeus). They hear that
// Jesus is passing — the words come to them on slips of paper — and cry out: "Lord, have mercy on us, Son of David!"
// People near them lean over them: "Quiet!" But they cry out all the more, arms high.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { jerichoSet, JR, TWELVE, BLIND2, say, slip, voiceRings, headAt, mob, manOf, makeCutter, tr, bush, rock, grass } from './lib.js';

export const JSTOP = 700;

export default {
  id: 'mt20-jericho',
  beats: [
    { v: 29 },
    { v: 30, text: 'A oto dwaj niewidomi, którzy siedzieli przy drodze, słysząc, że Jezus przechodzi,' },
    { v: 30, cont: true, text: 'zaczęli wołać: «Panie, ulituj się nad nami, Synu Dawida!».' },
    { v: 31, text: 'Tłum nastawał na nich, żeby umilkli;' },
    { v: 31, cont: true, text: 'lecz oni jeszcze głośniej wołali: «Panie, ulituj się nad nami, Synu Dawida!».' },
  ],
  cam: { x: [-280, 120], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const J = jerichoSet(S);
    const G = JR.G;

    /* the great crowd (whole cut-outs that only move) */
    const crowdL = S.layer({ par: 0.5, sh: 4 });
    const CROWD = [[0, 8, 0.66, -150], [1, 7, 0.7, -330], [2, 8, 0.64, -500]].map(([i, n, s, dx]) => ({ i, dx, sp: crowdL.sprite(mob(makeCutter('mt20-jer-crowd' + i), n, { s, spread: 40, rows: 2, arms: 12 }), 560 + dx, JR.G - 30 - i * 10) }));
    const P = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 3, 1, 2, 6, 7].map((k, i) => ({ i, p: S.puppet(P.add(person(c, TWELVE[k].o))), dx: -80 - i * 44, dy: (i % 2) * 16 - 8, seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    // phone: the two who rebuke from the right stand in from under the progress thread
    const NEAR = [[866, G + 20, false], [S.portrait ? 1062 : 1100, G + 14, true], [S.portrait ? 1094 : 1150, G + 2, true]].map(([x, y, flip], i) => ({ i, x, y, flip, p: S.puppet(P.add(person(c, manOf(c, i === 1 ? { hairStyle: 'veil', beard: 'none' } : {})))), seed: c.rr(0, 9) }));
    const blind = BLIND2.map((o, i) => ({ i, p: S.puppet(P.add(person(c, { ...o, pose: 'sit', eyes: 'closed' }))), at: JR.B[i] }));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const hear = [0, 1, 2].map(() => fx.add(`<g>${slip(c, tr('Jezus przechodzi!', 'Jesus is passing by!'), { size: 17 })}</g>`));
    const cry1 = fx.add(`<g>${say(c, tr(['Panie, ulituj się nad nami,', 'Synu Dawida!'], ['Lord, have mercy on us,', 'you son of David!']), { size: 18, side: -1, jag: true })}</g>`);
    const cry2 = fx.add(`<g>${say(c, tr(['PANIE, ULITUJ SIĘ NAD NAMI,', 'SYNU DAWIDA!'], ['LORD, HAVE MERCY ON US,', 'SON OF DAVID!']), { size: 19, side: -1, jag: true, bold: true })}</g>`);
    const hush = NEAR.map((n) => fx.add(`<g>${say(c, tr('Cicho!', 'Quiet!'), { size: 18, side: n.flip ? -1 : 1 })}</g>`));
    const rings = voiceRings(fx, c, { n: 3, color: C.terracotta, r: 30, w: 4 });

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 160, 1000, 230, C.olive, C.moss) + rock(c, 1440, 990, 200, 66, C.rock2) + grass(c, { x0: -300, x1: 1900, y: 980, n: 16, h: 30, color: C.olive }));

    return (t, time) => {
      const T = time;
      J.R.update(t, T, { sunY: es(t, 0, 5) * 20 });
      /* v29 — out of the gate with a great crowd; he walks on along the road */
      const out = es(t, -0.2, 0.95, (u) => u);
      const onward = es(t, 0.95, 4.2, (u) => u);
      const jx = lerp(JR.CITY + 80, 560, out) + onward * (JSTOP - 560);
      const walking = t > -0.2 && t < 4.2;
      jesus.set({ x: jx, y: G, s: 1.02, o: seg(t, -0.2, -0.05), walk: walking ? jx * 0.06 : undefined, head: -es(t, 2.1, 2.4) * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = jx + d.dx * (0.4 + out * 0.6);
        d.p.set({ x, y: G + d.dy, s: 0.86, o: seg(t, -0.15 + d.i * 0.03, 0 + d.i * 0.03), walk: walking ? x * 0.06 + d.i : undefined, blink: blinkAt(T, d.seed) });
      });
      CROWD.forEach((m) => {
        const k = es(t, 0.05 + m.i * 0.1, 0.9 + m.i * 0.1);
        const x = lerp(JR.CITY + 40, jx + m.dx - 60, k);
        m.sp.set({ x, y: G - 30 - m.i * 10, s: 1, o: k > 0.01 ? 1 : 0 });
      });

      /* v30a — the two blind men hear */
      const turn = es(t, 1.2, 1.45);
      const cry = bump(t, 2.05, 2.97), loud = bump(t, 4.05, 4.98);
      blind.forEach((b) => {
        const [x, y] = b.at;
        b.p.set({ x, y, s: 0.92, flip: true, armF: 40 + cry * (70 + b.i * 20) + loud * 110, armB: cry * 110 + loud * 160, head: -6 - turn * 6 - cry * 8 - loud * 12, lean: -loud * 4, blink: 0 });
      });
      hear.forEach((h, i) => {
        const k = seg(t, 1.1 + i * 0.16, 1.62 + i * 0.16);
        pose(h, { x: lerp(jx + 40 + i * 50, JR.B[0][0] - 20, k), y: G - 210 - i * 34 - Math.sin(k * Math.PI) * 30, r: -4 + i * 4, o: Math.sin(k * Math.PI) });
      });
      const [bx, by] = headAt(JR.B[0][0], JR.B[0][1], 0.92, true, 'sit');
      rings(bx - 10, by, Math.max(cry, loud * 1.2), T, { spread: 1.8 + loud, dir: 0 });
      pose(cry1, { x: JR.B[0][0] - 10, y: JR.B[0][1] - 180, s: es(t, 2.05, 2.25, ease.back), o: t > 2.05 && t < 3.02 ? 1 - es(t, 2.9, 3.02) : 0 });
      pose(cry2, { x: JR.B[0][0] - 10, y: JR.B[0][1] - 190, s: es(t, 4.05, 4.25, ease.back) * 1.15, o: t > 4.05 ? 1 : 0 });

      /* v31a — people rebuke them */
      NEAR.forEach((n) => {
        const reb = es(t, 3.05 + n.i * 0.06, 3.3 + n.i * 0.06) * (1 - es(t, 4.1, 4.3));
        n.p.set({ x: n.x, y: n.y, s: 0.92, flip: n.flip, o: es(t, 1.0, 1.3), lean: reb * (n.flip ? -8 : 8), armF: reb * 150 + 10, armB: reb * 30, head: reb * 10, blink: blinkAt(T, n.seed) });
        const k = es(t, 3.1 + n.i * 0.08, 3.3 + n.i * 0.08, ease.back) * (1 - es(t, 3.92, 4.02));
        pose(hush[n.i], { x: n.x + (n.flip ? -16 : 16), y: n.y - 196 - (S.portrait && n.i === 2 ? 44 : 0), s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = lerp(-260, 0, es(t, 0.2, 1.1)) + es(t, 1.1, 1.6) * (S.portrait ? 120 : 90);   // phone: a little further right, so the rebukers clear the progress thread
      S.cam.z = 1 + es(t, 1.1, 1.6) * 0.04;
      S.cam.y = 10;
    };
  },
};
