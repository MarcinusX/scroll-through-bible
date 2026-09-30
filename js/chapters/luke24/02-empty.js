// Łk 24,3–5 — Inside the tomb. One by one the women stoop through the low doorway with their jars and go to the
// ledge: the linen lies there flat and empty — they do not find the body of the Lord Jesus. They stand at a loss,
// questions over their heads. Then the chamber fills with light: two men in dazzling white stand by them. The
// women set their jars down and bow with their faces to the ground. "Why do you seek the living among the dead?" —
// one of the two lifts his hand towards the doorway, where the morning pours in.
import { C, person, blinkAt, pose, lerp, mix } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { WOMEN, JARS, IN, tombInside, angelPerson, ANGEL_A, ANGEL_B, headAt, voiceRings, speech, risenIcon, spiceJar, question, sparkle, withFace, faceBits, upright, tr } from './lib.js';

const { FLOOR, DOOR_X, LEDGE } = IN;
const WX = [790, 690, 590, 500];     // where the women stand (Mary Magdalene nearest the ledge)
const A1 = 1010, A2 = 1150;          // the two in white

export default {
  id: 'lk24-empty',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5, text: 'Przestraszone, pochyliły twarze ku ziemi,' },
    { v: 5, cont: true, text: 'lecz tamci rzekli do nich: «Dlaczego szukacie żyjącego wśród umarłych?' },
  ],
  cam: { x: [-60, 160], y: [-20, 60], z: [0.9, 1.22] },
  build(S) {
    const c = S.c;
    const T0 = tombInside(S, { out: [mix(C.skyBlue, C.dawn, 0.5), C.sage] });

    /* the light of the two in white (behind them only) */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const white = lightL.add(`<g><ellipse rx="230" ry="260" fill="url(#halo-glow)"/></g>`);
    const AL = S.layer({ par: 0.51, sh: 4 });
    const ang1 = S.puppet(AL.add(angelPerson(c, ANGEL_A, 'stand')));
    const ang2 = S.puppet(AL.add(angelPerson(c, ANGEL_B, 'stand')));
    const rings = voiceRings(AL, c, { n: 3, color: C.halo, r: 30, w: 4, both: false });

    /* the women: standing with their jars, and bowed down (jars set on the floor) */
    const PL = S.layer({ par: 0.52, sh: 5 });
    const jarsDown = WOMEN.map((w, i) => PL.add(`<g opacity="0">${spiceJar(c, JARS[i][0], JARS[i][1])}</g>`));
    const W = WOMEN.map((w, i) => {
      const holdF = `<g transform="translate(2 8)">${spiceJar(c, JARS[i][0], JARS[i][1])}</g>`;
      const st = PL.add(withFace(person(c, { ...w.o, holdF }), faceBits(c)));
      const kn = PL.add(withFace(person(c, { ...w.o, pose: 'kneel' }), faceBits(c)));
      return { ...w, i, x: WX[i], seed: c.rr(0, 9), st: S.puppet(st), kn: S.puppet(kn), sad: st.querySelector('[data-part="sad"]') };
    });

    const fx = S.layer({ par: 0.56, sh: 5 });
    const qs = W.map(() => fx.add(`<g>${question(c)}</g>`));
    const emptyMark = [0, 1, 2].map(() => fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`));
    const say = fx.add(`<g>${speech(c, `<g transform="scale(1.05)">${risenIcon(c)}</g>`, { w: 92, h: 78, flip: true })}</g>`);
    void tr;

    return (t, T) => {
      /* v3: they come in, go to the ledge — the linen lies empty */
      const bow = seg(t, 2.08, 2.16);
      W.forEach((w) => {
        const d = w.i * 0.12;
        const enter = es(t, 0.02 + d, 0.62 + d, ease.out);
        const x = lerp(DOOR_X - 10, w.x, enter);
        const look = es(t, 0.7, 0.95);
        const lost = es(t, 1.05, 1.3) * (1 - es(t, 1.45, 1.6));
        const startle = es(t, 1.45, 1.6);
        const armF = 24 + look * (w.i === 0 ? 34 : 6) + lost * 20 - startle * 10;
        w.st.set({ x, y: FLOOR, s: 1.0, o: seg(t, d, d + 0.06) * (1 - bow), walk: enter > 0.001 && enter < 0.999 ? x * 0.05 : undefined, amt: 0.8, lean: (1 - enter) * 16 - startle * 6, armF, armB: 8 + lost * 50 + startle * 60, head: look * (w.i === 0 ? 10 : 4) - startle * 10, blink: startle > 0.2 ? 0 : blinkAt(T, w.seed) });
        upright(w.st, 'F', armF);
        fade(w.sad, lost);
        /* v5a: they bow their faces to the ground */
        w.kn.set({ x: x + 6, y: FLOOR, s: 1.0, o: bow, lean: 14 + es(t, 2.1, 2.4) * 10 - es(t, 3.4, 3.8) * 12, armF: 60, armB: 40, head: 16 - es(t, 3.4, 3.8) * 20, blink: 1 });
        pose(jarsDown[w.i], { x: x + 38, y: FLOOR, o: bow });
        const [hx, hy] = headAt(x, FLOOR, 1.0, false);
        const qk = es(t, 1.08 + w.i * 0.06, 1.28 + w.i * 0.06, ease.back) * (1 - es(t, 1.45, 1.55));
        pose(qs[w.i], { x: hx + 12, y: hy - 52, s: qk * 0.8, o: qk > 0.01 ? 1 : 0 });
      });
      // the empty place on the ledge
      const empty = es(t, 0.7, 1.0);
      pose(T0.linenGlow, { x: IN.LINEN, y: LEDGE.top - 4, o: empty * 0.7 * (1 - es(t, 1.45, 1.6) * 0.5) });
      emptyMark.forEach((el, i) => {
        const b = bump(t, 0.75 + i * 0.1, 1.3 + i * 0.1);
        pose(el, { x: IN.LINEN - 90 + i * 90, y: LEDGE.top - 30 - (i % 2) * 14, s: b, r: T * 30, o: b });
      });

      /* v4b: suddenly two men in dazzling clothing stand by them */
      const come = es(t, 1.45, 1.75);
      pose(white, { x: (A1 + A2) / 2, y: FLOOR - 140, s: 0.4 + come * 0.6, o: come * 0.9 });
      const speak = es(t, 3.05, 3.25);
      ang1.set({ x: A1, y: FLOOR, s: 1.04, flip: true, o: es(t, 1.45, 1.62), armF: 18 + speak * 70, armB: 10 + speak * 30, head: -2 + speak * 4, blink: blinkAt(T, 5) });
      ang2.set({ x: A2, y: FLOOR - 4, s: 1.0, flip: true, o: es(t, 1.52, 1.7), armF: 14 + speak * 16, armB: 8, head: 4, blink: blinkAt(T, 7) });
      /* v5b: "Why do you seek the living among the dead?" — towards the morning in the doorway */
      const [ahx, ahy] = headAt(A1, FLOOR, 1.04, true);
      rings(ahx - 22, ahy, bump(t, 3.02, 3.98), T, { dir: -1, spread: 1.6 });
      fade(T0.shaft, 0.3 + es(t, 3.2, 3.6) * 0.35);
      const sk = es(t, 3.15, 3.35, ease.back);
      pose(say, { x: ahx - 30, y: ahy - 40, s: sk, o: sk > 0.01 ? 1 : 0 });

      S.cam.x = S.portrait ? lerp(-40, 120, es(t, 0.6, 1.6)) : lerp(10, 70, es(t, 0.4, 1.6));
      S.cam.y = 46 - es(t, 1.4, 1.8) * 8;
      S.cam.z = S.portrait ? 0.96 : 1.2 - es(t, 1.4, 1.8) * 0.04;
    };
  },
};
