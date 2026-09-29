// Mt 17,19–20a — evening, in the house (Mark 9's room). The disciples come to Jesus by themselves, the door swings
// shut, and they ask: "Why could we not cast it out?" (a "?" and the memory of the dark wisp). "Because of your
// little faith": each holds out an open hand, and over it trembles only the tiniest, flickering spark.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { stars, moon } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { houseSection, TWELVE, question, wisp, plate, paperHand, EVENING, NIGHT } from './lib.js';

const PAR = 0.4;
const X0 = 520, X1 = 1080, FLOOR = 646, CEIL = 316;
const JX = 840;

export default {
  id: 'mt17-why',
  beats: [
    { v: 19 },
    { v: 20, text: 'On zaś im rzekł: «Z powodu małej wiary waszej.' },
  ],
  cam: { x: [-20, 20], y: [-20, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const sk = sky(S, EVENING);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 360, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 36)}`, { x: 1250, y: 170, len: 900 });

    const behind = S.layer({ par: PAR, sh: 3 });
    behind.add(sheet().p(c.cut([[-900, 560], [2500, 560], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand2, C.duskViolet, 0.25)).out());
    const H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL });
    const houseL = S.layer({ par: PAR, sh: 4 });
    houseL.add(H.back);
    const lightL = S.layer({ par: PAR, sh: 1, flat: true });
    const dim = lightL.add(`<g><rect x="${X0}" y="${CEIL}" width="${X1 - X0}" height="${FLOOR - CEIL + 40}" fill="#2a2446" opacity=".32"/></g>`);

    /* inside */
    const inL = S.layer({ par: PAR, sh: 4 });
    const SIX = [TWELVE[3], TWELVE[0], TWELVE[1], TWELVE[2], TWELVE[6]];
    const SEAT = [[700, 0.8], [762, 0.82], [918, 0.84], [980, 0.82], [1040, 0.8]];
    const dis = SIX.map((d, i) => ({ ...d, i, x: SEAT[i][0], s: SEAT[i][1], flip: SEAT[i][0] > JX, seed: c.rr(0, 9), walk: S.puppet(inL.add(person(c, d.o))), sit: S.puppet(inL.add(person(c, { ...d.o, pose: 'kneel' }))) }));
    const jWalk = S.puppet(inL.add(person(c, CAST.jesus)));
    const jSit = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const lamp = inL.add(`<g>${oilLamp(c)}</g>`);
    const lampFlame = lamp.querySelector('.flame'), lampGlow = lamp.querySelector('.glow');
    const q = inL.add(`<g opacity="0">${question(c)}</g>`);
    const memory = inL.add(`<g opacity="0">${wisp(c, 1.2, '#463a52')}</g>`);

    const frontL = S.layer({ par: PAR, sh: 5 });
    frontL.add(H.front + H.stairs);
    const doorL = S.layer({ par: PAR, sh: 5 });
    const dw = H.door[1] - H.door[0];
    const door = doorL.add(`<g>${sheet().p(c.cut([[0, 0], [dw, 0], [dw, -(FLOOR - H.door[2]) + 36], [0, -(FLOOR - H.door[2]) + 36]], 0.5, 6), C.wood2).x(c.ribbon([[dw * 0.3, -10], [dw * 0.3, -(FLOOR - H.door[2]) + 44]], 2) + c.ribbon([[dw * 0.65, -10], [dw * 0.65, -(FLOOR - H.door[2]) + 44]], 2), shade(C.wood2, -0.25)).out()}</g>`);

    // little faith: a plate with two cupped hands, and between them only the tiniest trembling flame
    const plL = S.layer({ par: 0.2, sh: 5 });
    const cupped = `<g transform="translate(-26 44) rotate(-16) scale(1.35)">${paperHand(c, C.skin2)}</g><g transform="translate(26 44) rotate(16) scale(-1.35 1.35)">${paperHand(c, C.skin2)}</g>`;
    const faithPlate = hanging(plL, plate(c, cupped, { r: 70, fill: mix(C.parchment, C.lavender, 0.25) }), { x: 1000, y: 196, len: 900 });
    const tinyFlame = plL.add(`<g opacity="0"><circle r="26" fill="url(#warm-glow)"/><path d="M0 4C-5 0 -4 -8 0 -15C4 -8 5 0 0 4Z" fill="${C.sunDeep}"/><path d="M0 2C-2.4 -1 -2.4 -5 0 -9C2.4 -5 2.4 -1 0 2Z" fill="${C.lampFlame}"/></g>`);

    return (t, time) => {
      const T = time;
      const night = es(t, 0, 2);
      sk.blend(EVENING, NIGHT, night * 0.7);
      starL.fade(night * 0.7);
      swing(moonEl, 1250, lerp(360, 190, es(t, 0, 2)), T, 0.8, 0.5);

      /* beat 0: they come in together; the door closes behind them; they ask */
      const dx = (H.door[0] + H.door[1]) / 2;
      const jw = es(t, 0.02, 0.3), sit = es(t, 0.3, 0.36);
      jWalk.set({ x: lerp(dx, JX, jw), y: lerp(FLOOR - 6, 626, jw), s: lerp(0.82, 0.94, jw), o: 1 - sit, walk: jw > 0 && jw < 1 ? jw * 30 : undefined, blink: blinkAt(T, 1) });
      const answer = es(t, 1.05, 1.25);
      jSit.set({ x: JX, y: 626, s: 0.94, o: sit, armF: 20 + bump(t, 0.6, 1) * 10 + answer * 50 + Math.sin(T * 1.2) * 4 * answer, armB: 10 + answer * 30, head: -2 + bump(t, 0.5, 1) * 6 - answer * 2, blink: blinkAt(T, 1) });
      dis.forEach((d) => {
        const w = es(t, 0.06 + d.i * 0.05, 0.34 + d.i * 0.05), sd = es(t, 0.34 + d.i * 0.05, 0.4 + d.i * 0.05);
        d.walk.set({ x: lerp(dx, d.x, w), y: lerp(FLOOR - 6, 640, w), s: lerp(0.74, d.s, w), flip: d.x < dx, o: es(t, 0.02 + d.i * 0.05, 0.08 + d.i * 0.05) * (1 - sd), walk: w > 0 && w < 1 ? w * 30 : undefined, blink: blinkAt(T, d.seed) });
        const lean = es(t, 0.55, 0.8) * 0.5;
        const ask = bump(t, 0.55, 1.0) * (d.i === 1 || d.i === 2 ? 1 : 0.5);
        const hold = es(t, 1.15 + d.i * 0.04, 1.35 + d.i * 0.04) * 0.4;
        d.sit.set({ x: d.x + (d.flip ? -1 : 1) * lean * 12, y: 640, s: d.s, flip: d.flip, o: sd, armF: 30 + ask * 60 + hold * 62, armB: 10 + ask * 50, head: -4 + lean * 6 - ask * 6 + hold * 12, lean: lean * 5 + hold * 3, blink: blinkAt(T, d.seed) });
        d.hx = d.x + (d.flip ? -1 : 1) * lean * 12;
      });
      const close = es(t, 0.45, 0.7);
      pose(door, { x: H.door[0], y: FLOOR + 2, sx: Math.max(0.02, close), o: close > 0.01 ? 1 : 0 });

      pose(q, { x: 760, y: 470, s: es(t, 0.6, 0.8, ease.back), o: bump(t, 0.55, 1.0) > 0.05 ? 1 : 0 });
      pose(memory, { x: 980, y: 480 + Math.sin(T * 1.6) * 4, r: Math.sin(T) * 8, s: 1 + es(t, 0.6, 1) * 0.2, o: bump(t, 0.55, 1.0) * 0.8 });

      /* beat 1: little faith — a tiny spark over each hand, flickering */
      const fp = es(t, 1.1, 1.35, ease.back);
      swing(faithPlate, 1000, lerp(-1000, 196, fp), T, 0.6, 0.7, 1);
      const fl = 0.75 + Math.sin(T * 9) * 0.18 + Math.sin(T * 13) * 0.08;
      pose(tinyFlame, { x: 1000, y: lerp(-1000, 196, fp) + 6, s: 1.2 * es(t, 1.3, 1.45) * fl, o: es(t, 1.3, 1.45) * (0.7 + 0.3 * Math.sin(T * 7)) });

      pose(lamp, { x: 590, y: 672, s: 0.9 });
      pose(lampFlame, { x: 35, y: -16, sy: 1 + Math.sin(T * 7) * 0.06 });
      fade(lampGlow, 0.5 + night * 0.5);
      fade(dim, 0.1 + night * 0.3);

      S.cam.z = 1 + es(t, 0.5, 1) * 0.07 - es(t, 1.05, 1.4) * 0.05;
      S.cam.y = es(t, 0.5, 1) * 20 - es(t, 1.05, 1.4) * 24;
    };
  },
};
