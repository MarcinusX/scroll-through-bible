// Mt 18,20 — night in a small house: through the window, stars and the moon over the lake. Three of them — John,
// Matthew and a woman of the town — sit round a low table with one little lamp, bow their heads and pray. A warm
// light gathers above the table, and there, in the middle of them, Jesus is standing, His hands open over them;
// the room turns golden and they lift their faces to Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { stars, moon, band } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { NIGHT, lowTable, smallLamp, woman, kf, PI } from './lib.js';

const FLOOR = 716, CEIL0 = 180;

export default {
  id: 'mt18-gathered',
  beats: [
    { v: 20 },
  ],
  cam: { x: [-10, 10], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the ceiling sits higher (a beam, not a third of the screen in wood) and the window comes in from the thread
    const CEIL = S.portrait ? -170 : CEIL0, WX = S.portrait ? -100 : 0;
    sky(S, NIGHT);
    const starL = S.layer({ par: 0.03, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -600, y1: 470, n: 70 }));
    const outL = S.layer({ par: 0.1, sh: 2 });
    outL.add(`<g transform="translate(${1110 + WX} 330)"><circle r="80" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 22)}</g>`);
    outL.add(band(c, { y: 470, amps: [10, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.night, 0.6) }).markup + band(c, { y: 500, amps: [2, 1], lens: [300, 90], color: mix(C.lake, C.night, 0.55) }).markup);

    /* the room */
    const wallL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.plaster, C.indigo, 0.35);
    const win = [[1040 + WX, 520], [1040 + WX, 380], ...c.arc(1110 + WX, 380, 70, 60, PI, 2 * PI, 12), [1180 + WX, 520]];
    const w = sheet();
    w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6), wcol);
    let blot = '';
    for (let i = 0; i < 12; i++) blot += c.cut(c.blob(c.rr(-200, 1800), c.rr(CEIL + 60, FLOOR - 60), c.rr(24, 60), c.rr(10, 22), 10, 0.2), 0.8, 6);
    w.x(blot, shade(wcol, -0.06), 'opacity=".5"');
    w.p(c.ribbon(win.slice(0, -1), 10) + c.cut(c.rect(1030 + WX, 516, 160, 10), 0.3, 6), mix(C.wood2, C.indigo, 0.3));
    w.p(c.cut([[-900, -1200], [2500, -1200], [2500, CEIL], [-900, CEIL]], 0.8, 30), mix(C.wood2, C.night, 0.4));
    let beams = '';
    for (let x = -300; x < 1900; x += 100) beams += c.cut(c.rect(x, CEIL - 6, 22, 28), 0.3, 5);
    w.p(beams, mix(C.wood, C.night, 0.3));
    w.p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 0.8, 30), mix(C.sand2, C.indigo, 0.35));
    w.p(c.cut([[560, FLOOR + 10], [1040, FLOOR + 10], [1060, FLOOR + 40], [540, FLOOR + 40]], 0.5, 8), mix(C.basket, C.indigo, 0.25));
    wallL.add(w.out());
    // the golden room: the same wall, lit, faded in over the dark one
    const warmL = S.layer({ par: 0.3, sh: 1, flat: true });
    warmL.add(`<rect x="-900" y="-1200" width="3400" height="3000" fill="${C.lampGlow}" opacity=".35"/><ellipse cx="800" cy="520" rx="520" ry="360" fill="url(#halo-glow)"/>`);

    /* the three at the table, the lamp, and Him among them */
    const L = S.layer({ par: 0.45, sh: 5 });
    const jGlow = L.add(`<g opacity="0"><ellipse cx="0" cy="-110" rx="130" ry="190" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(L.add(person(c, CAST.jesus)));
    const john = S.puppet(L.add(person(c, { ...CAST.john, pose: 'sit' })));
    const mat = S.puppet(L.add(person(c, { ...CAST.matthew, pose: 'kneel' })));
    const wom = S.puppet(L.add(person(c, { ...woman(c, { robe: C.roseRobe, veil: C.cream }), pose: 'sit' })));
    L.add(`<g transform="translate(800 ${FLOOR + 30}) scale(1.2)">${lowTable(c, 260, 40)}</g>`);
    const lamp = L.add(`<g>${smallLamp(c)}</g>`);
    const flame = lamp.querySelector('.fl');
    const dark = S.layer({ par: 0, sh: 1, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#141a40"/>`);

    return (t, time) => {
      const T = time;
      const come = es(t, 0.3, 0.62);
      const lit = es(t, 0.4, 0.75);
      warmL.fade(lit);
      dark.fade(0.28 * (1 - lit));
      pose(lamp, { x: 786, y: FLOOR - 18, s: 1.2 });
      pose(flame, { x: 22, y: -11, sy: 1 + Math.sin(T * 9) * 0.08 + lit * 0.3 });

      const pray = es(t, 0.02, 0.25) * (1 - es(t, 0.62, 0.82));
      const lookUp = es(t, 0.62, 0.85);
      john.set({ x: 610, y: FLOOR + 22, s: 1.12, flip: false, armF: 60 + pray * 20 - lookUp * 10, armB: 50 + pray * 30 + lookUp * 40, head: pray * 18 - lookUp * 16, blink: blinkAt(T, 3) });
      wom.set({ x: 1010, y: FLOOR + 22, s: 1.06, flip: true, armF: 60 + pray * 20, armB: 50 + pray * 30 + lookUp * 30, head: pray * 18 - lookUp * 16, blink: blinkAt(T, 5) });
      mat.set({ x: 905, y: FLOOR + 34, s: 1.08, flip: true, armF: 50 + pray * 30, armB: 40 + pray * 40 + lookUp * 40, head: pray * 16 - lookUp * 14, blink: blinkAt(T, 7) });
      jesus.set({ x: 790, y: FLOOR - 10, s: 1.18, o: come, armF: 30 + es(t, 0.55, 0.8) * 50, armB: 20 + es(t, 0.55, 0.8) * 70, head: 6, blink: blinkAt(T, 1) });
      pose(jGlow, { x: 790, y: FLOOR - 10, s: 0.7 + come * 0.55, o: es(t, 0.25, 0.55) });

      S.cam.z = kf(t, [[0, 1.04], [0.8, 1.08]]);
      S.cam.y = kf(t, [[0, 20], [0.8, 30]]);
      S.cam.x = 0;
    };
  },
};
