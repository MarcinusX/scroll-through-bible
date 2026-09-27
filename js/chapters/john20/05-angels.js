// J 20,11–13 — Inside the tomb again, looking out. Mary stands alone in the bright doorway, weeping, a hand to her
// face. Still weeping, she stoops and looks in — and the dim chamber fills with a white light: two angels in white
// sit where the body of Jesus had lain, one at the head and one at the feet, the empty linen between them. They ask
// her gently, "Woman, why are you weeping?" She answers with the empty place and a question: they have taken my
// Lord, and I don't know where they have laid Him.
import { C, person, blinkAt, pose, lerp, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, ANGEL_A, ANGEL_B, IN, tombInside, angelPerson, headAt, voiceRings, bubble, speech, question, linenLying, withFace, faceBits, sparkle, tr } from './lib.js';

const { FLOOR, DOOR_X, LEDGE } = IN;
const AF = 750, AH = 1205;   // the angel at the feet, the angel at the head

export default {
  id: 'j20-angels',
  beats: [
    { v: 11, text: 'Maria Magdalena natomiast stała przed grobem płacząc.' },
    { v: 11, cont: true, text: 'A kiedy [tak] płakała, nachyliła się do grobu' },
    { v: 12 },
    { v: 13, text: 'I rzekli do niej: «Niewiasto, czemu płaczesz?»' },
    { v: 13, cont: true, text: 'Odpowiedziała im: «Zabrano Pana mego i nie wiem, gdzie Go położono».' },
  ],
  cam: { x: [-560, 360], y: [-20, 50], z: [0.9, 1.2] },
  build(S) {
    const c = S.c;
    const T0 = tombInside(S, { out: [mix(C.skyBlue, '#f8e6bd', 0.5), C.sage] });
    const outEl = T0.outFig.person(withFace(person(c, { ...MAGD }), faceBits(c)));
    const mOut = S.puppet(outEl);
    const outTear = [outEl.querySelector('[data-part="sad"]'), outEl.querySelector('[data-part="tear"]')];

    // the white light and the two angels
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const white = lightL.add(`<g><ellipse rx="560" ry="300" fill="url(#halo-glow)"/></g>`);
    const AL = S.layer({ par: 0.51, sh: 4 });
    const auraF = AL.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const auraH = AL.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const angF = S.puppet(AL.add(angelPerson(c, ANGEL_B, 'sit')));
    const angH = S.puppet(AL.add(angelPerson(c, ANGEL_A, 'sit')));
    const ringsF = voiceRings(AL, c, { n: 3, color: C.halo, r: 30, w: 4, both: false });
    const ringsH = voiceRings(AL, c, { n: 3, color: C.halo, r: 30, w: 4, both: false });
    const marks = [0, 1].map(() => AL.add(`<g>${sparkle(c, 12)}</g>`));

    // Mary stooping in at the doorway
    const PL = S.layer({ par: 0.52, sh: 5 });
    const inEl = PL.add(withFace(person(c, { ...MAGD }), faceBits(c)));
    const mIn = S.puppet(inEl);
    const inTear = [inEl.querySelector('[data-part="sad"]'), inEl.querySelector('[data-part="tear"]')];
    const drops = [0, 1, 2].map(() => PL.add(`<path d="${c.cut([[0, -6], [3.4, 1], [0, 4], [-3.4, 1]], 0.2, 2)}" fill="#bfe0ee"/>`));

    const fx = S.layer({ par: 0.56, sh: 5 });
    const ask = fx.add(`<g>${bubble(c, tr(['Niewiasto,', 'czemu płaczesz?'], ['Woman, why', 'are you weeping?']), { size: 19, tail: 1 })}</g>`);
    const answer = fx.add(`<g>${bubble(c, tr(['Zabrano Pana mego', 'i nie wiem, gdzie…'], ['They have taken my Lord,', 'I don’t know where…']), { size: 18, tail: -1 })}</g>`);

    return (t, T) => {
      fade(T0.shaft, 0.3);
      /* v11a: she stands outside the tomb weeping */
      const stoop = es(t, 1.1, 1.45);
      const swap = seg(t, 1.3, 1.36);
      const mx = DOOR_X - 10;
      mOut.set({ x: mx, y: FLOOR - 4, s: 0.94, o: 1 - swap, armF: 18, armB: 136 + (T ? Math.sin(T * 1.5) * 4 : 0), head: 10, lean: 2 + stoop * 16, blink: 0.9 });
      outTear.forEach((e) => fade(e, 1));
      const talk = es(t, 4.05, 4.3);
      const sees = es(t, 2.05, 2.35);
      mIn.set({ x: mx + 16, y: FLOOR, s: 0.96, o: swap, lean: 20 - sees * 8 - talk * 6, armF: 30 + sees * 20 + talk * 30, armB: 20 + bump(t, 4.2, 4.95) * 60, head: 8 - sees * 6, blink: sees > 0.1 && sees < 0.9 ? 0 : blinkAt(T, 3) });
      inTear.forEach((e) => fade(e, 1 - es(t, 3.2, 3.6) * 0.6));
      const [hx, hy] = headAt(mx + 16, FLOOR, 0.96, false);
      drops.forEach((d, i) => {
        const k = T ? (T * 0.9 + i / 3) % 1 : (i + 0.5) / 3;
        const [ox, oy] = t < 1.33 ? headAt(mx, FLOOR - 4, 0.94, false) : [hx, hy];
        pose(d, { x: ox + 14 + i * 2, y: oy + 10 + k * 70, o: (1 - k) * (1 - es(t, 2.1, 2.5)) });
      });

      /* v12: two angels in white where the body had lain — at the head and at the feet */
      const come = es(t, 2.05, 2.5);
      pose(white, { x: 1000, y: LEDGE.top - 60, s: 0.5 + come * 0.6, o: come * 0.9 });
      pose(auraF, { x: AF, y: LEDGE.top - 70, s: 0.6 + come * 0.5 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: come });
      pose(auraH, { x: AH, y: LEDGE.top - 70, s: 0.6 + come * 0.5 + (T ? Math.sin(T * 1.2 + 1) * 0.02 : 0), o: come });
      const ask1 = es(t, 3.02, 3.2);
      angF.set({ x: AF, y: LEDGE.top, s: 0.98, flip: true, o: es(t, 2.1, 2.45), armF: 16 + ask1 * 50 * (1 - talk * 0.6), armB: 10, head: -2 + ask1 * 4, blink: blinkAt(T, 5) });
      angH.set({ x: AH, y: LEDGE.top, s: 0.98, flip: true, o: es(t, 2.2, 2.55), armF: 14 + ask1 * 30, armB: 8, head: 4, blink: blinkAt(T, 7) });
      marks.forEach((el, i) => {
        const b = bump(t, 2.4 + i * 0.15, 3.0 + i * 0.15);
        pose(el, { x: i ? AH - 60 : AF + 60, y: LEDGE.top - 30, s: b, r: T * 30, o: b });
      });

      /* v13a: "Woman, why are you weeping?" */
      const say = bump(t, 3.0, 4.0);
      const [fhx, fhy] = headAt(AF, LEDGE.top, 0.98, true, 62);
      const [hhx, hhy] = headAt(AH, LEDGE.top, 0.98, true, 62);
      ringsF(fhx - 20, fhy, say, T, { dir: -1, spread: 1.6 });
      ringsH(hhx - 20, hhy, say * 0.7, T, { dir: -1, spread: 1.6 });
      const aq = es(t, 3.05, 3.25, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(ask, { x: (fhx + hhx) / 2 - 90, y: fhy - 42, s: aq, o: aq > 0.01 ? 1 : 0 });
      /* v13b: her answer */
      const an = es(t, 4.1, 4.3, ease.back);
      pose(answer, { x: hx + 110, y: hy - 26, s: an, o: an > 0.01 ? 1 : 0 });

      S.cam.x = S.portrait ? -540 + es(t, 1.9, 2.6) * 900 - es(t, 3.9, 4.3) * 820 : lerp(-200, -150, es(t, 0, 1)) + es(t, 1.9, 2.6) * 200 - es(t, 3.9, 4.3) * 60;
      S.cam.y = 30 - es(t, 1.9, 2.6) * 20;
      S.cam.z = S.portrait ? 1.0 - es(t, 1.9, 2.6) * 0.1 : 1.14 - es(t, 1.9, 2.6) * 0.18 + es(t, 3.9, 4.3) * 0.02;
    };
  },
};
