// Łk 2,25–27a — early morning in a street of Jerusalem, the Temple rising white at the end of it. Old Simeon sits by his
// door with a little lamp that he keeps burning. A righteous and devout man: he kneels towards the Temple and waits,
// looking to the east for the consolation of Israel — and a white dove comes down and rests over him in a soft light:
// the Holy Spirit is upon him. What the Spirit told him hangs in gold — he will not see death before he has seen the
// Lord's Christ — beside an hourglass whose sand has stopped. Moved by the Spirit, he gets up with his staff and
// walks up the street to the Temple, the dove flying ahead of him.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, town, cypress, olive, sun, cloud } from '../../assets/nature.js';
import {
  SIMEON, DAWN, flatHouse, sanctuary, staff, dove, flapWings, goldWord, placeTag, hourglass, glowDisc, rayBurst, handLampBig,
  hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const Y = 706;
const HX0 = 420;                     // Simeon's house (door)
const TX0 = 1190;                    // the Temple at the end of the street

export default {
  id: 'lk2-simeon',
  beats: [
    { v: 25, text: 'A żył w Jerozolimie człowiek, imieniem Symeon.' },
    { v: 25, cont: true, text: 'Był to człowiek prawy i pobożny, wyczekiwał pociechy Izraela, a Duch Święty spoczywał na nim.' },
    { v: 26 },
    { v: 27, text: 'Za natchnieniem więc Ducha przyszedł do świątyni.' },
  ],
  cam: { x: [-30, 130], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    // phone: Simeon's house and door further in from the left edge, the hourglass clear of the thread
    const HX = S.portrait ? 520 : HX0, GX = S.portrait ? 960 : 1060, TX = S.portrait ? 1010 : TX0;
    const WK = [[3.1, HX + 140], [3.95, 1010]];
    const sk = sky(S, DAWN);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40, { disc: C.peach, inner: C.dawn, rays: C.apricot }), { x: 0, y: 0, len: 900 });
    const cl = hanging(hangL, cloud(c, 160, C.dawn, C.peach), { x: 560, y: 150, len: 800 });
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 470, amps: [18, 7, 3], lens: [900, 320, 120], color: mix(C.hillFar, C.duskViolet, 0.25), x0: -1400, x1: 3000 }).markup);
    // the Temple on its platform at the end of the street
    const tL = S.layer({ par: 0.14, sh: 3 });
    const tglow = tL.add(`<g>${glowDisc(200, 'halo-glow', 1)}</g>`);
    const pl = sheet();
    pl.p(c.cut([[TX - 230, 610], [TX - 214, 520], [TX + 240, 520], [TX + 256, 610]], 0.6, 10), mix(C.sand, C.stone, 0.45));
    let courses = '';
    for (let y = 534; y < 606; y += 14) courses += c.ribbon([[TX - 222, y], [TX + 248, y + c.rr(-1, 1)]], 1.1);
    pl.x(courses, shade(C.stone, -0.18), 'opacity=".5"');
    pl.p(c.cut(c.rect(TX - 226, 512, 474, 10), 0.3, 8), C.sun);
    tL.add(`<g transform="translate(${TX} 516)">${sanctuary(c, 0.85, { glow: false })}</g>` + pl.out());
    tL.add(sheet().p(c.ridge(c.wave(596, [6, 3], [500, 160]), -1400, 3000, 1900, 12, 1), mix(C.sand2, C.dawn, 0.35)).out());
    tL.add(town(c, { x: 560, y: 600, n: 10, spread: 560, sc: 0.9, wall: mix(C.plaster, C.dawn, 0.3), shadow: mix(C.plaster2, C.duskViolet, 0.2) }) + cypress(c, 920, 590, 110) + olive(c, 250, 596, 0.7));
    const near = S.layer({ par: 0.22, sh: 3 });
    near.add(sheet().p(c.ridge(c.wave(656, [4, 2], [500, 160]), -1400, 3000, 1900, 12, 1), mix(C.sand2, C.stone, 0.3)).out() + town(c, { x: 760, y: 664, n: 5, spread: 340, sc: 1.25, wall: mix(C.plaster, C.peach, 0.25), shadow: C.plaster2 }) + town(c, { x: 1560, y: 664, n: 4, spread: 260, sc: 1.25, wall: mix(C.plaster, C.peach, 0.25), shadow: C.plaster2 }));
    // the street
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.ridge(c.wave(Y - 36, [3, 1], [600, 170]), -1400, 3000, 1900, 12, 1), mix(C.sand2, C.stone, 0.4)).out());
    let cob = '';
    for (let i = 0; i < 50; i++) { const x = c.rr(-600, 2200), y = c.rr(Y - 20, Y + 160); cob += c.cut(c.blob(x, y, c.rr(12, 22), c.rr(5, 8), 8, 0.2), 0.4, 4); }
    G.add(sheet().x(cob, mix(C.stone2, C.sand2, 0.5), 'opacity=".6"').out());
    G.add(flatHouse(c, HX - 170, Y - 26, 250, 220, { wall: mix(C.plaster, C.dawn, 0.2), wall2: C.plaster2 }));
    G.add(sheet().p(c.cut([[HX + 60, Y - 16], [HX + 190, Y - 16], [HX + 190, Y - 4], [HX + 60, Y - 4]], 0.3, 6), C.wood).p(c.cut(c.rect(HX + 70, Y - 4, 10, 20), 0.2, 4) + c.cut(c.rect(HX + 170, Y - 4, 10, 20), 0.2, 4), C.wood2).out());

    const glowL = S.layer({ par: 0.34, sh: 0, flat: true });
    const spirit = glowL.add(`<g>${glowDisc(210, 'halo-glow', 1)}${rayBurst(c, { n: 14, r0: 30, r1: 200, spread: 0.035, color: '#fff3cf', o: 0.3 })}</g>`);
    const lampGlow = glowL.add(`<g>${glowDisc(90, 'warm-glow', 1)}</g>`);
    const P = S.layer({ par: 0.34, sh: 5 });
    const lamp = P.add(`<g>${handLampBig(c)}</g>`);
    const sit = S.puppet(P.add(person(c, { ...SIMEON, pose: 'sit' })));
    const kneel = S.puppet(P.add(person(c, { ...SIMEON, pose: 'kneel' })));
    const walk = S.puppet(P.add(person(c, { ...SIMEON, holdB: staff(c, 190, 30) })));
    const dv = P.add(dove(c));

    const X = S.layer({ par: 0.3, sh: 5 });
    const tag = hanging(X, placeTag(c, tr('Symeon', 'Simeon'), 22), { x: 0, y: 0, len: 600 });
    const word = hanging(X, goldWord(c, tr('ujrzysz Mesjasza Pańskiego', 'you will see the Lord’s Christ'), { size: 26 }), { x: 0, y: 0, len: 700 });
    const glass = hanging(X, `<g transform="scale(2.2)">${hourglass(c, 34)}</g>`, { x: 0, y: 0, len: 700 });
    const seal = X.add(`<g>${sheet().p(c.ribbon([[-44, 0], [44, 0]], 8), C.haloRim).p(c.cut(c.circ(0, 0, 13, 14), 0.2, 3), C.sun).out()}</g>`);
    const sparks = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 9)}</g>`));

    return (t, time) => {
      const T = time;
      const rise = es(t, 0, 4);
      hangAt(sunEl, 1250, lerp(300, 190, rise), T, 1, 0.8, 0.5, 1);
      pose(cl, { x: 560 + Math.sin(T * 0.1) * 20, y: 150, r: Math.sin(T * 0.6) * 1.2 });
      pose(tglow, { x: TX, y: 400, s: 0.7 + es(t, 3.2, 3.8) * 0.4, o: 0.5 + es(t, 3.2, 3.8) * 0.4 });

      /* v25a — a man in Jerusalem named Simeon */
      const kn = es(t, 1.05, 1.13);
      const up = es(t, 3.05, 3.13);
      sit.set({ x: HX + 130, y: Y - 10 - 4, s: 0.96, o: 1 - kn, armF: 40, armB: 20, head: 6, blink: blinkAt(T, 1) });
      pose(lamp, { x: HX + 60, y: Y - 18 });
      pose(lampGlow, { x: HX + 88, y: Y - 44, s: 1 + Math.sin(T * 5) * 0.04, o: 0.8 });
      const nk = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      hangAt(tag, HX + 130, lerp(-500, 300, nk), T, nk > 0.001 ? 1 : 0, 1.2, 0.9, 1);

      /* v25b — righteous and devout, waiting for the consolation of Israel; the Spirit rests on him */
      const pray = es(t, 1.15, 1.4);
      const lookUp = es(t, 2.05, 2.3);
      kneel.set({ x: HX + 200, y: Y, s: 0.96, o: kn * (1 - up), armF: 40 + pray * 40, armB: 30 + pray * 70, head: -pray * 8 - lookUp * 6, blink: blinkAt(T, 1) });
      const dk = es(t, 1.35, 1.75, ease.out);
      const fly = es(t, 3.1, 3.95);
      const dx = lerp(lerp(1300, HX + 210, dk), 1080, fly), dy = lerp(lerp(40, Y - 290, dk), 330, fly) + Math.sin(T * 1.4) * 4;
      pose(dv, { x: dx, y: dy, s: 1.1, sx: fly > 0.01 ? 1 : -1, o: dk > 0.01 ? 1 : 0 });
      if (dk > 0.01) flapWings(dv, T || t * 3, dk < 0.99 || fly > 0.01 ? 34 : 18, dk < 0.99 || fly > 0.01 ? 8 : 3, -6);
      pose(spirit, { x: HX + 210, y: Y - 180, s: 0.5 + dk * 0.5, r: T * 2, o: dk * (1 - fly) });

      /* v26 — he will not see death before he has seen the Lord's Christ */
      const wk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      hangAt(word, 830, lerp(-500, 230, wk), T, wk > 0.001 ? 1 : 0, 1, 0.8, 2);
      const gk = es(t, 2.15, 2.45, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      hangAt(glass, GX, lerp(-500, 360, gk), T, gk > 0.001 ? 1 : 0, 1, 0.8, 3);
      const sl = es(t, 2.4, 2.55, ease.back) * (gk > 0.95 ? 1 : 0);
      vpose(seal, { x: GX, y: 360, s: Math.max(0.001, sl), r: -18, o: sl > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = es(t, 2.3 + i * 0.05, 2.5 + i * 0.05) * (1 - es(t, 2.95, 3.1)), a = T * 0.8 + i * 1.6;
        vpose(sp, { x: 830 + Math.cos(a) * 200, y: 230 + Math.sin(a) * 40, s: k * 0.8, r: T * 30, o: k });
      });

      /* v27a — led by the Spirit, he goes up to the Temple */
      const wx = kf(t, WK, ease.sine);
      walk.set({ x: wx, y: Y + 4, s: 0.96, o: up, walk: moving(t, WK, 0.3) ? wx * 0.06 : undefined, armF: 30, armB: 30, head: -6, blink: blinkAt(T, 1) });

      S.cam.x = kf(t, [[0, -20], [2.9, 0], [3.9, 120]], ease.sine);
      S.cam.y = 10;
      S.cam.z = 1.03 + es(t, 1.1, 1.5) * 0.05 - es(t, 3.0, 3.6) * 0.05;
    };
  },
};
