// Łk 24,6–7 — "He is not here, but is risen": the one in white points to the empty linen — it shines — and a word
// of gold opens over the chamber. The women lift their faces and get up. "Remember what He told you while He was still
// in Galilee": a painted flat comes down — the lake of Galilee, Jesus sitting on the shore teaching, the disciples and
// these same women listening. Then His words, one card at a time on strings: the Son of Man delivered into the hands
// of sinners (dark hands reaching), crucified (the cross on its hill at dusk), and on the third day rising (the sun
// over the hill).
import { C, CAST, person, blinkAt, pose, lerp, mix, shade } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import {
  WOMEN, JARS, IN, tombInside, angelPerson, ANGEL_A, ANGEL_B, headAt, voiceRings, spiceJar, sparkle, goldWord, withFace, faceBits,
  flat, flatSky, flatHills, fig, iconCard, miniHead, shadowHand, crossHill, sunriseIcon, MAGD, JOANNA, TW, hangK, tr,
} from './lib.js';

const { FLOOR, LEDGE } = IN;
const WX = [790, 690, 590, 500];
const A1 = 1010, A2 = 1150;
const FW = 440, FH = 240;

export default {
  id: 'lk24-risen',
  beats: [
    { v: 6, text: 'Nie ma Go tutaj; zmartwychwstał.' },
    { v: 6, cont: true, text: 'Przypomnijcie sobie, jak wam mówił, będąc jeszcze w Galilei:' },
    { v: 7 },
  ],
  cam: { x: [-40, 120], y: [-40, 50], z: [0.9, 1.18] },
  build(S) {
    const c = S.c;
    const T0 = tombInside(S, { out: [mix(C.skyBlue, C.dawn, 0.35), C.sage] });
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const white = lightL.add(`<g><ellipse rx="230" ry="260" fill="url(#halo-glow)"/></g>`);
    const AL = S.layer({ par: 0.51, sh: 4 });
    const ang1 = S.puppet(AL.add(angelPerson(c, ANGEL_A, 'stand')));
    const ang2 = S.puppet(AL.add(angelPerson(c, ANGEL_B, 'stand')));
    const rings = voiceRings(AL, c, { n: 3, color: C.halo, r: 30, w: 4, both: false });

    const PL = S.layer({ par: 0.52, sh: 5 });
    WOMEN.forEach((w, i) => PL.add(`<g transform="translate(${WX[i] + 44} ${FLOOR})">${spiceJar(c, JARS[i][0], JARS[i][1])}</g>`));
    const W = WOMEN.map((w, i) => {
      const kn = PL.add(withFace(person(c, { ...w.o, pose: 'kneel' }), faceBits(c)));
      const st = PL.add(withFace(person(c, { ...w.o }), faceBits(c)));
      return { ...w, i, x: WX[i], seed: c.rr(0, 9), kn: S.puppet(kn), st: S.puppet(st) };
    });

    /* "He has risen" */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const word = fx.add(`<g>${goldWord(c, tr('Zmartwychwstał!', 'He is risen!'), { size: 30 })}</g>`);
    const marks = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    /* the flat: Galilee, Jesus teaching on the shore, the disciples and the women listening */
    const FLy = S.layer({ par: 0.4, sh: 6 });
    const inner = flatSky(S, FW, FH, ['#cfe2dd', '#f6e6c6'])
      + flatHills(c, FW, -6, mix(C.hillFar, C.duskViolet, 0.15), 8)
      + `<path d="${c.cut([[-FW / 2 - 4, 22], [FW / 2 + 4, 16], [FW / 2 + 4, 70], [-FW / 2 - 4, 76]], 0.6, 8)}" fill="${C.lake}"/>`
      + `<path d="${c.ribbon([[-FW / 2, 34], [-80, 32], [60, 36], [FW / 2, 30]], 1.4) + c.ribbon([[-FW / 2, 52], [40, 50], [FW / 2, 54]], 1.2)}" fill="${C.foam}" opacity=".7"/>`
      + flatHills(c, FW, 66, mix(C.sand, C.sage2, 0.4), 4)
      + fig(c, { ...CAST.jesus, pose: 'sit' }, -30, 106, 0.44)
      + fig(c, TW.peter, 60, 104, 0.4, true) + fig(c, TW.john, 106, 108, 0.4, true)
      + fig(c, { ...MAGD, pose: 'sit' }, -120, 112, 0.38) + fig(c, { ...JOANNA, pose: 'sit' }, -170, 116, 0.38)
      + fig(c, TW.andrew, 160, 110, 0.38, true);
    const galilee = FLy.add(flat(S, inner, { w: FW, h: FH }));
    const place = FLy.add(`<g>${goldWord(c, tr('w Galilei', 'in Galilee'), { size: 18, fill: C.cream, ink: C.terracotta })}</g>`);

    /* His words, card by card */
    const handsI = `<g transform="translate(0 -2)">${miniHead(c, CAST.jesus, 14)}</g><g transform="translate(-24 42) rotate(22) scale(.5)">${shadowHand(c)}</g><g transform="translate(26 42) rotate(-24) scale(.5)">${shadowHand(c)}</g>`;
    const crossI = `<rect x="-46" y="-42" width="92" height="84" fill="${mix(C.duskViolet, C.dusk, 0.45)}"/><g transform="translate(0 40)">${crossHill(c, 0.52)}</g>`;
    const sunI = `<rect x="-46" y="-42" width="92" height="84" fill="${mix(C.dawn, C.skyBlue, 0.3)}"/><g transform="translate(0 40)">${sunriseIcon(c, 0.78)}</g>`;
    const cards = [
      [handsI, tr('wydany', 'delivered up')],
      [crossI, tr('ukrzyżowany', 'crucified')],
      [sunI, tr('trzeciego dnia', 'the third day')],
    ].map(([ic, w], i) => ({ i, el: FLy.add(`<g>${iconCard(c, ic, w, { w: 112, h: 124, size: 15 })}</g>`) }));
    const dawnSpark = FLy.add(`<g>${sparkle(c, 16)}</g>`);

    return (t, T) => {
      fade(T0.shaft, 0.4 + es(t, 2.4, 2.9) * 0.2);
      /* v6a: "He is not here" — He points to the empty linen; "He is risen" */
      const point = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.15));
      const lift = es(t, 1.05, 1.3);
      ang1.set({ x: A1, y: FLOOR, s: 1.04, flip: true, armF: 18 + point * 50 + lift * 60 * (1 - es(t, 2.0, 2.2)) + es(t, 2.05, 2.3) * 40, armB: 10 + point * 20 + es(t, 2.05, 2.3) * 110, head: point * 12 - lift * 6, blink: blinkAt(T, 5) });
      ang2.set({ x: A2, y: FLOOR - 4, s: 1.0, flip: true, armF: 14 + es(t, 0.3, 0.6) * 20, armB: 8, head: 4, blink: blinkAt(T, 7) });
      pose(white, { x: (A1 + A2) / 2, y: FLOOR - 140, s: 1.0, o: 0.85 });
      const [ahx, ahy] = headAt(A1, FLOOR, 1.04, true);
      rings(ahx - 22, ahy, bump(t, 0.02, 0.98) + bump(t, 1.02, 1.98) * 0.7 + bump(t, 2.02, 2.98) * 0.7, T, { dir: -1, spread: 1.6 });
      const shine = es(t, 0.15, 0.45);
      pose(T0.linenGlow, { x: IN.LINEN, y: LEDGE.top - 4, s: 1 + shine * 0.2, o: shine * (1 - es(t, 1.1, 1.4) * 0.6) });
      marks.forEach((el, i) => {
        const b = bump(t, 0.3 + i * 0.1, 0.95 + i * 0.1);
        pose(el, { x: IN.LINEN - 110 + i * 70, y: LEDGE.top - 34 - (i % 2) * 16, s: b, r: T * 30, o: b });
      });
      const wk = es(t, 0.4, 0.6, ease.back) * (1 - es(t, 0.98, 1.1));
      pose(word, { x: 840, y: 360, s: wk, o: wk > 0.01 ? 1 : 0 });

      /* the women lift their faces, then get up to "remember" */
      const up = seg(t, 1.05, 1.12);
      W.forEach((w) => {
        const raise = es(t, 0.3 + w.i * 0.06, 0.6 + w.i * 0.06);
        w.kn.set({ x: w.x + 6, y: FLOOR, s: 1.0, o: 1 - up, lean: 20 - raise * 18, armF: 60 + raise * 10, armB: 40 + raise * 30, head: 20 - raise * 30, blink: raise > 0.5 ? blinkAt(T, w.seed) : 1 });
        const look = es(t, 1.3, 1.6);
        const recall = es(t, 2.2, 2.5);
        w.st.set({ x: w.x, y: FLOOR, s: 1.0, o: up, armF: 24 + look * 20 + recall * (w.i === 0 ? 40 : 14), armB: 10 + recall * (w.i === 1 ? 60 : 10), head: -look * 10 + recall * 2, blink: blinkAt(T, w.seed) });
      });

      /* v6b: the flat of Galilee */
      const fk = es(t, 1.08, 1.4, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      hangK(galilee, fk, 780, 270, T, 0);
      const pk = es(t, 1.35, 1.55, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(place, { x: 780, y: 406, s: pk, r: -2, o: pk > 0.01 ? 1 : 0 });

      /* v7: delivered up — crucified — the third day */
      cards.forEach((cd) => {
        const k = es(t, 2.12 + cd.i * 0.22, 2.4 + cd.i * 0.22, ease.back);
        hangK(cd.el, k, 590 + cd.i * 200, 262 + (cd.i === 1 ? 14 : 0), T, cd.i);
      });
      const ds = bump(t, 2.66, 3.0);
      pose(dawnSpark, { x: 1030, y: 230, s: ds * 1.3, r: T * 30, o: ds });

      S.cam.x = S.portrait ? 60 : 60;
      S.cam.y = 38 - es(t, 1.0, 1.3) * 30;
      S.cam.z = S.portrait ? 0.94 : 1.16 - es(t, 1.0, 1.3) * 0.06;
      void lerp; void shade;
    };
  },
};
