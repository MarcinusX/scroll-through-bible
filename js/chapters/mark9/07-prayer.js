// Mk 9,28–29 — evening, in the house, the door shut: the disciples ask him privately why they could
// not drive it out (empty hands, a question). "This kind can come out only by prayer (and fasting)" —
// Jesus kneels in quiet prayer by the lamp, light falls through the window, an empty bowl turned over.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { stars, moon } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { houseSection, TWELVE, question, emptyBowl, wisp, kf } from './lib.js';

const PI = Math.PI;
const PAR = 0.4;
const X0 = 520, X1 = 1080, FLOOR = 646, CEIL = 316;

export default {
  id: 'm9-prayer',
  beats: [
    { v: 28, text: 'Gdy przyszedł do domu, uczniowie Go pytali na osobności:' },
    { v: 28, cont: true, text: '«Dlaczego my nie mogliśmy go wyrzucić?»' },
    { v: 29 },
  ],
  cam: { x: [-20, 20], y: [-20, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const DUSK = ['#6f6f9c', '#d8a58f', '#efc39c'];
    const NIGHT = ['#27305e', '#46508a', '#8b7fa6'];
    const sk = sky(S, DUSK);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 360, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 36)}`, { x: 1250, y: 170, len: 900 });

    // the courtyard ground outside
    const behind = S.layer({ par: PAR, sh: 3 });
    behind.add(sheet().p(c.cut([[-900, 560], [2500, 560], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand2, C.duskViolet, 0.25)).out());

    const H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL });
    const houseL = S.layer({ par: PAR, sh: 4 });
    houseL.add(H.back);
    // the evening light in the room, and the moonlight falling through the window
    const lightL = S.layer({ par: PAR, sh: 1, flat: true });
    const beam = lightL.add(`<g opacity="0"><path d="${c.poly([[H.win[0] + 4, H.win[2] + 20], [H.win[1] - 4, H.win[2] + 20], [H.win[1] - 150, FLOOR + 10], [H.win[0] - 190, FLOOR + 10]])}" fill="#fff2cc" opacity=".35"/></g>`);
    const dim = lightL.add(`<g><rect x="${X0}" y="${CEIL}" width="${X1 - X0}" height="${FLOOR - CEIL + 40}" fill="#2a2446" opacity=".32"/></g>`);

    /* inside */
    const inL = S.layer({ par: PAR, sh: 4 });
    const SIX = [TWELVE[0], TWELVE[3], TWELVE[1], TWELVE[2], TWELVE[6], TWELVE[7]];
    const SEAT = [[616, 0.8], [676, 0.82], [736, 0.84], [900, 0.84], [960, 0.82], [1020, 0.8]];
    const dis = SIX.map((d, i) => ({ ...d, i, x: SEAT[i][0], s: SEAT[i][1], flip: SEAT[i][0] > 820, seed: c.rr(0, 9), walk: S.puppet(inL.add(person(c, d.o))), sit: S.puppet(inL.add(person(c, { ...d.o, pose: 'kneel' }))) }));
    const jWalk = S.puppet(inL.add(person(c, CAST.jesus)));
    const jSit = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jPray = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'kneel', eyes: 'closed' })));
    const lamp = inL.add(`<g>${oilLamp(c)}</g>`);
    const lampFlame = lamp.querySelector('.flame'), lampGlow = lamp.querySelector('.glow');
    const bowl = inL.add(`<g opacity="0">${emptyBowl(c, 34)}</g>`);
    const q = inL.add(`<g opacity="0">${question(c)}</g>`);
    const memory = inL.add(`<g opacity="0">${wisp(c, 1.2, '#463a52')}</g>`);
    const glow = inL.add(`<g opacity="0"><circle r="150" fill="url(#halo-glow)"/></g>`);

    const frontL = S.layer({ par: PAR, sh: 5 });
    frontL.add(H.front + H.stairs);
    // the door, swinging shut
    const doorL = S.layer({ par: PAR, sh: 5 });
    const dw = H.door[1] - H.door[0];
    const door = doorL.add(`<g>${sheet().p(c.cut([[0, 0], [dw, 0], [dw, -(FLOOR - H.door[2]) + 36], [0, -(FLOOR - H.door[2]) + 36]], 0.5, 6), C.wood2).x(c.ribbon([[dw * 0.3, -10], [dw * 0.3, -(FLOOR - H.door[2]) + 44]], 2) + c.ribbon([[dw * 0.65, -10], [dw * 0.65, -(FLOOR - H.door[2]) + 44]], 2), shade(C.wood2, -0.25)).out()}</g>`);

    return (t, time) => {
      const T = time;
      const night = es(t, 0, 2.5);
      sk.blend(DUSK, NIGHT, night);
      starL.fade(night);
      swing(moonEl, 1250, lerp(360, 170, es(t, 0, 2.4)), T, 0.8, 0.5);

      /* beat 0: Jesus and the disciples come in; the door is closed behind them */
      const [dx] = [(H.door[0] + H.door[1]) / 2];
      const jw = es(t, 0.02, 0.36), sit = es(t, 0.36, 0.42);
      const pray = es(t, 2.25, 2.32);
      jWalk.set({ x: lerp(dx, 800, jw), y: lerp(FLOOR - 6, 626, jw), s: lerp(0.82, 0.94, jw), o: 1 - sit, walk: jw > 0 && jw < 1 ? jw * 30 : undefined, blink: blinkAt(T, 1) });
      const teach = es(t, 2.05, 2.25);
      jSit.set({ x: 800, y: 626, s: 0.94, o: sit * (1 - pray), flip: false, armF: 20 + bump(t, 1.1, 1.9) * 20 + teach * 30, armB: 10 + teach * 20, head: -2 + bump(t, 1.1, 1.9) * 6, blink: blinkAt(T, 1) });
      jPray.set({ x: 800, y: 626, s: 0.94, o: pray, armF: 70, armB: 60, head: -10, blink: 0 });
      dis.forEach((d) => {
        const w = es(t, 0.08 + d.i * 0.06, 0.4 + d.i * 0.06), sd = es(t, 0.4 + d.i * 0.06, 0.46 + d.i * 0.06);
        d.walk.set({ x: lerp(dx, d.x, w), y: lerp(FLOOR - 6, 640, w), s: lerp(0.74, d.s, w), flip: d.x < dx, o: es(t, 0.02 + d.i * 0.06, 0.1 + d.i * 0.06) * (1 - sd), walk: w > 0 && w < 1 ? w * 30 : undefined, blink: blinkAt(T, d.seed) });
        const lean = es(t, 0.6, 0.9) * (1 - es(t, 2.1, 2.4));      // they draw close: a private word
        const ask = bump(t, 1.05, 1.95) * (d.i === 3 || d.i === 0 ? 1 : 0.4);
        const bow = es(t, 2.4, 2.8);
        d.sit.set({ x: d.x + (d.flip ? -1 : 1) * lean * 16, y: 640, s: d.s, flip: d.flip, o: sd, armF: 30 + ask * 60 + bow * 40, armB: 10 + ask * 50 + bow * 30, head: -4 + lean * 6 - ask * 6 + bow * 14, lean: lean * 5 + bow * 8, blink: bow > 0.5 ? 0 : blinkAt(T, d.seed) });
      });
      const close = es(t, 0.55, 0.85);
      pose(door, { x: H.door[0], y: FLOOR + 2, sx: Math.max(0.02, close), o: close > 0.01 ? 1 : 0 });

      /* beat 1: "why could we not?" — empty hands, the memory of the dark wisp */
      pose(q, { x: 868, y: 470, s: es(t, 1.08, 1.3, ease.back), o: bump(t, 1.05, 1.95) > 0.05 ? 1 : 0 });
      pose(memory, { x: 690, y: 500 + Math.sin(T * 1.6) * 4, r: Math.sin(T) * 8, s: 1 + es(t, 1.2, 1.9) * 0.2, o: bump(t, 1.1, 1.95) * 0.8 });

      /* beat 2: prayer — the lamp burns steady, moonlight falls in, an empty bowl turned over */
      pose(lamp, { x: 590, y: 672, s: 0.9 });
      pose(lampFlame, { x: 35, y: -16, sy: 1 + Math.sin(T * 7) * 0.06 });
      fade(lampGlow, 0.5 + night * 0.5);
      pose(bowl, { x: 1010, y: 672, o: es(t, 2.4, 2.7) });
      fade(beam, es(t, 2.2, 2.7));
      fade(dim, 0.1 + night * 0.35 - es(t, 2.3, 2.8) * 0.1);
      pose(glow, { x: 800, y: 540, s: 0.5 + es(t, 2.3, 2.8) * 0.4, o: es(t, 2.3, 2.8) * 0.45 });

      S.cam.z = 1 + es(t, 0.6, 1.4) * 0.08 + es(t, 2.1, 2.8) * 0.04;
      S.cam.y = es(t, 0.6, 1.4) * 20;
    };
  },
};
