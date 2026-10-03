// Łk 18,13–14 — the same Temple court. The camera moves over to the tax collector by the columns: "standing far
// away, he would not even lift up his eyes to heaven" — head bowed low, eyes shut, the dark sack on his back. "But he
// beat his breast, saying, 'God, be merciful to me, a sinner!'" — his fist on his chest, again and again, and his
// small prayer goes straight up, a spark rising high into the sky. "I tell you, this man went down to his house
// justified rather than the other": the sack slips off his back and melts into light; he straightens, opens his eyes,
// and goes out at the right lit and light; the Pharisee goes out at the left, and his words, which had circled round
// his head, drop to the paving. "For everyone who exalts himself will be humbled, but he who humbles himself will be
// exalted": a painted see-saw is let down — the little proud figure on the high end sinks, the little bowed figure on
// the low end rises.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { templeParable, TP, PHARISEE, TAXMAN, words, wordSlip, sparkle, fig13, warm, onString, headAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const F = TP.FLOOR, PX = TP.PHX, TXW = TP.TXX;
const SX = 800, SY = 300, ARM = 170;   // the see-saw: pivot, half-length

export default {
  id: 'lk18-mercy',
  parable: true,
  beats: [
    { v: 13, text: 'Natomiast celnik stał z daleka i nie śmiał nawet oczu wznieść ku niebu,' },
    { v: 13, cont: true, text: 'lecz bił się w piersi i mówił: "Boże, miej litość dla mnie, grzesznika!"' },
    { v: 14, text: 'Powiadam wam: Ten odszedł do domu usprawiedliwiony, nie tamten.' },
    { v: 14, cont: true, text: 'Każdy bowiem, kto się wywyższa, będzie poniżony, a kto się uniża, będzie wywyższony».' },
  ],
  cam: { x: [-60, 120], y: [0, 40], z: [1, 1.14] },
  build(S) {
    const TPR = templeParable(S);
    const TX = S.portrait ? 1000 : TXW;   // phone: the tax collector inside the screen, clear of the thread
    const { c, fx, glowL } = TPR;
    const slips = [0, 1, 2].map((i) => ({ i, el: fx.add(`<g>${wordSlip(c, 38)}</g>`) }));
    const plea = fx.add(`<g opacity="0">${words(c, tr(['Boże, miej litość', 'dla mnie, grzesznika!'], ['God, be merciful', 'to me, a sinner!']), { size: 18, side: -1 })}</g>`);
    const up = [0, 1, 2].map((i) => ({ i, el: fx.add(`<g opacity="0">${sparkle(c, 10, C.halo)}</g>`) }));
    const glow = glowL.add(`<g opacity="0">${warm(120)}</g>`);
    const joyS = [0, 1, 2].map((i) => ({ i, el: fx.add(`<g opacity="0">${sparkle(c, 9, C.halo)}</g>`) }));
    const melt = [0, 1, 2, 3, 4].map((i) => ({ i, el: fx.add(`<g opacity="0">${sparkle(c, 8, C.star)}</g>`) }));

    /* the see-saw flat */
    const SL = S.layer({ par: 0.3, sh: 6 });
    const board = sheet().p(c.cut([[-ARM - 20, -8], [ARM + 20, -8], [ARM + 20, 6], [-ARM - 20, 6]], 0.4, 6), C.wood).x(c.ribbon([[-ARM, -1], [ARM, -1]], 1.2), shade(C.wood, -0.25), 'opacity=".6"').out();
    const pivot = sheet().p(c.cut([[-26, 60], [0, 0], [26, 60]], 0.4, 5), C.wood2).out();
    const back = sheet().p(c.cut(c.rect(-ARM - 60, -150, ARM * 2 + 120, 240), 0.5, 8), mix(C.wood3, C.ochre, 0.4)).p(c.cut(c.rect(-ARM - 54, -144, ARM * 2 + 108, 228), 0.4, 8), C.parchment).out();
    const frame = SL.add(`<g><path d="M${-ARM} -1800V-150M${ARM} -1800V-150" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${back}<g transform="translate(0 16)">${pivot}</g></g>`);
    const plank = SL.add(`<g>${board}</g>`);
    const hi = SL.add(`<g>${fig13(c, PHARISEE, { s: 0.36, armF: 100, armB: 150, head: -14 })}</g>`);
    const lo = SL.add(`<g>${fig13(c, { ...TAXMAN, pose: 'kneel' }, { s: 0.36, flip: true, armF: 70, head: 20 })}</g>`);
    const upTag = SL.add(`<g opacity="0">${sheet().p(c.cut([[-8, 6], [-8, -8], [-16, -8], [0, -24], [16, -8], [8, -8], [8, 6]], 0.3, 3), C.moss).out()}</g>`);
    const dnTag = SL.add(`<g opacity="0">${sheet().p(c.cut([[-8, -6], [-8, 8], [-16, 8], [0, 24], [16, 8], [8, 8], [8, -6]], 0.3, 3), C.terracotta).out()}</g>`);

    return (t, time) => {
      const T = time;

      /* the Pharisee, still praying at the front, then going out at the left */
      const outP = es(t, 2.1, 2.9);
      const ppx = lerp(PX, S.portrait ? 530 : 470, outP);
      TPR.phar.set({ x: ppx, y: F, s: 1.0, o: 1 - es(t, 2.95, 3.1), flip: outP > 0.01, walk: outP > 0 && outP < 1 ? ppx * 0.05 : undefined, armF: 14 + 90 * (1 - es(t, 2.0, 2.15)), armB: 10 + 150 * (1 - es(t, 2.0, 2.15)), head: -18 + es(t, 2.0, 2.15) * 12, blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(PX, F, 1.0, false);
      const fall = es(t, 2.1, 2.4, ease.in);
      slips.forEach((sl) => {
        const k = T ? (T * 0.3 + sl.i / 3) % 1 : (sl.i + 0.5) / 3;
        const a = k * PI * 2;
        const cx = phx + Math.cos(a) * 70, cy = phy - 46 + Math.sin(a) * 26;
        pose(sl.el, { x: lerp(cx, PX - 60 + sl.i * 50, fall), y: lerp(cy, F + 10 + sl.i * 4, fall), r: lerp(Math.cos(a) * 10, (sl.i - 1) * 20, fall), o: 1 - es(t, 3.0, 3.15) });
      });

      /* the tax collector: bowed (13a), beating his breast (13b), justified and going home (14a) */
      const beat = es(t, 1.02, 1.12) * (1 - es(t, 1.95, 2.05));
      const fist = beat * (60 + Math.max(0, Math.sin(t * 38)) * 22);
      const freed = es(t, 2.12, 2.2);
      const home = es(t, 2.35, 2.95);
      const tx = lerp(TX, S.portrait ? 1055 : 1170, home);
      const bow = 22 * (1 - freed);
      TPR.tax.set({ x: TX, y: F - 8, s: 0.94, flip: true, armF: 12 + fist, armB: 8, head: bow + beat * 4, lean: 12 * (1 - freed), o: 1 - freed, blink: 0 });
      TPR.taxOpen.set({ x: tx, y: F - 8, s: 0.94, flip: false, o: freed * (1 - es(t, 2.95, 3.1)), walk: home > 0 && home < 1 ? tx * 0.05 : undefined, armF: 20 + bump(t, 2.15, 2.5) * 70, armB: 10 + bump(t, 2.15, 2.5) * 120, head: -6, blink: blinkAt(T, 5) });
      const slide = es(t, 2.05, 2.25, ease.in);
      pose(TPR.sack, { x: TX + 22 + slide * 20, y: lerp(F - 70, F - 4, slide), r: 8 + slide * 30, o: 1 - es(t, 2.2, 2.45) });
      melt.forEach((m) => {
        const k = seg(t, 2.2 + m.i * 0.03, 2.55 + m.i * 0.03);
        pose(m.el, { x: TX + 30 + (m.i - 2) * 16, y: F - 20 - k * 110, s: 0.8, o: Math.sin(k * PI) });
      });
      const [thx, thy] = headAt(TX, F - 8, 0.94, true);
      pose(plea, { x: thx - 20, y: thy - 36, s: es(t, 1.1, 1.28, ease.back), o: t > 1.1 && t < 2.05 ? 1 - es(t, 1.95, 2.05) : 0 });
      up.forEach((u) => {
        const k = T ? (T * 0.35 + u.i / 3) % 1 : (u.i + 0.5) / 3;
        pose(u.el, { x: thx - 6 + Math.sin(k * 7 + u.i) * 6, y: thy - 60 - k * 360, o: es(t, 1.2, 1.35) * (1 - es(t, 2.0, 2.1)) * Math.sin(k * PI) });
      });
      const [ohx, ohy] = headAt(tx, F - 8, 0.94, false);
      joyS.forEach((j) => {
        const a = (T ? T * 1.2 : 0) + (j.i * PI * 2) / 3;
        pose(j.el, { x: ohx + Math.cos(a) * 34, y: ohy - 44 + Math.sin(a) * 10, s: 0.9, o: es(t, 2.2, 2.4) * (1 - es(t, 2.95, 3.1)) });
      });
      pose(glow, { x: tx, y: F - 90, s: 0.95, o: freed * 0.6 * (1 - es(t, 2.95, 3.1)) });

      /* v14b — the see-saw */
      const sk = es(t, 3.02, 3.3, ease.out);
      const sy = lerp(-1500, SY, sk);
      const tilt = lerp(-16, 16, es(t, 3.35, 3.65, ease.io));     // left end (proud) up at first, then down
      pose(frame, { x: SX, y: sy });
      pose(plank, { x: SX, y: sy + 16, r: tilt });
      const r = (tilt * PI) / 180;
      const endL = [SX - Math.cos(r) * (ARM - 20), sy + 16 - Math.sin(r) * (ARM - 20)];
      const endR = [SX + Math.cos(r) * (ARM - 20), sy + 16 + Math.sin(r) * (ARM - 20)];
      pose(hi, { x: endL[0], y: endL[1] - 8 });
      pose(lo, { x: endR[0], y: endR[1] - 8 });
      pose(dnTag, { x: endL[0] - 50, y: endL[1] - 40, s: es(t, 3.6, 3.75, ease.back), o: t > 3.6 ? 1 : 0 });
      pose(upTag, { x: endR[0] + 50, y: endR[1] - 60, s: es(t, 3.6, 3.75, ease.back), o: t > 3.6 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 60], [0.5, 100], [2.0, 90], [2.5, 60], [3.0, 0]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.06], [0.5, 1.12], [2.0, 1.12], [2.6, 1.04]]);
      void mix; void onString; void person; void PHARISEE;
    };
  },
};
