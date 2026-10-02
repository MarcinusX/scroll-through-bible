// Mt 13,16–18 — the golden afternoon on the beach, the boat drawn up behind. Jesus sits on a stone with six of the
// disciples close round Him: blessed are your eyes and your ears — little paper eyes open over their heads and
// shine, and ears catch the sound of His words. Above, in the sky, the prophets and the righteous of old (Abraham,
// Moses, David, Isaiah) lean out of their sepia cameos, longing to see and to hear — but a bank of cloud lies
// between. Then "hear the parable of the sower": the cameos rise, the sower plate comes down, the disciples lean in.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, palm, olive, rock, grass, flowers, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  boatIn, placeBoat, prophetCameo, ISAIAH, ABRAHAM, DAVID, MOSES, paperEye, sowerPlate, spark, voiceRings, headAt, hangAt, L6, tr, PI,
} from './lib.js';
import { ear } from '../../assets/things.js';

const JX = 800, JY = 706;

export default {
  id: 'mt13-blessed',
  beats: [
    { v: 16 },
    { v: 17, text: 'Bo zaprawdę, powiadam wam: Wielu proroków i sprawiedliwych pragnęło ujrzeć to, na co wy patrzycie, a nie ujrzeli;' },
    { v: 17, cont: true, text: 'i usłyszeć to, co wy słyszycie, a nie usłyszeli.' },
    { v: 18 },
  ],
  cam: { x: [-20, 20], y: [-60, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const SK = ['#d8c9b4', '#f2dcb4', '#f8e8cb'];
    sky(S, SK);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1260, y: 250, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 8, 3], lens: [1000, 400, 150], color: mix(C.hillFar, C.dawn, 0.3) }).markup);
    const lakeL = S.layer({ par: 0.18, sh: 2 });
    lakeL.add(waterBand(c, { y: 476, color: mix(C.lake, C.dawn, 0.2), foamN: 24 }).markup);
    const beach = S.layer({ par: 0.4, sh: 3 });
    const bfn = c.wave(590, [5, 2], [600, 170]);
    beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dawn, 0.2)).out());
    beach.add(palm(c, 230, 596, 250) + olive(c, 1470, 596, 0.95) + grass(c, { x0: -600, x1: 2200, y: 590, fn: bfn, n: 30, h: 12, color: C.olive }));
    // the boat drawn up on the sand
    const boatL = S.layer({ par: 0.4, sh: 4 });
    const B = boatIn(boatL, c, () => null);
    placeBoat(B, 1370, 628, 0.62, -3);

    /* the heavens: the prophets and the righteous, and the bank of cloud below them */
    const heav = S.layer({ par: 0.08, sh: 5 });
    const OLD = [
      { look: ABRAHAM, name: tr('Abraham', 'Abraham'), x: 590 },
      { look: MOSES, name: tr('Mojżesz', 'Moses'), x: 730 },
      { look: DAVID, name: tr('Dawid', 'David'), x: 870 },
      { look: ISAIAH, name: tr('Izajasz', 'Isaiah'), x: 1010 },
    ].map((o, i) => ({ ...o, i, el: hanging(heav, `<g transform="scale(1.2)">${prophetCameo(c, S.id('old' + i), o.look, o.name)}</g>`, { x: 0, y: 0, len: 900 }) }));
    const bank = S.layer({ par: 0.1, sh: 3 });
    let cl = '';
    for (let i = 0; i < 9; i++) cl += `<g transform="translate(${420 + i * 100 + c.rr(-20, 20)} ${c.rr(-8, 8)})">${cloud(c, c.rr(150, 210))}</g>`;
    const cloudBank = bank.add(`<g>${cl}</g>`);
    const longing = OLD.map((o) => ({ o, eye: bank.add(`<g>${paperEye(c, 30)}</g>`), ear: bank.add(`<g>${ear(c, C.skin2)}</g>`) }));

    /* Jesus and the six */
    const ppl = S.layer({ par: 0.5, sh: 5 });
    ppl.add(rock(c, JX, JY + 8, 120, 40, C.rock2));
    const P = S.portrait;   // phone: the outer four sit closer in, so no one is sliced by the frame or the thread
    const SEATS = [
      { o: CAST.matthew, x: P ? 520 : 470, y: 676, s: 0.84, back: true },
      { o: CAST.thomas, x: P ? 1050 : 1130, y: 676, s: 0.84, back: true },
      { o: CAST.andrew, x: P ? 590 : 560, y: 736, s: 0.94 },
      { o: CAST.james, x: P ? 995 : 1040, y: 736, s: 0.94 },
      { o: CAST.peter, x: 660, y: 766, s: 1.0 },
      { o: CAST.john, x: 940, y: 766, s: 1.0 },
    ].map((d, i) => ({ ...d, i, flip: d.x > JX, seed: c.rr(0, 6), p: S.puppet(ppl.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const jesus = S.puppet(ppl.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const fx = S.layer({ par: 0.52, sh: 5 });
    SEATS.forEach((d) => {
      const [hx, hy] = headAt(d.x, d.y, d.s, d.flip, 62);
      d.hx = hx; d.hy = hy;
      d.eye = fx.add(`<g><circle r="36" fill="url(#warm-glow)"/>${paperEye(c, 40)}</g>`);
      d.ear = fx.add(`<g>${ear(c, d.o.skin)}</g>`);
    });
    const rings = voiceRings(fx, c, { n: 3, r: 34, color: C.cream });
    const plate = hanging(fx, `<g transform="scale(1.7)">${sowerPlate(c)}</g>`, { x: 0, y: 0, len: 900 });
    const plateGlow = fx.add(`<circle r="160" fill="url(#warm-glow)" opacity="0"/>`);

    const fg = S.layer({ par: 0.8, sh: 6 });
    const ffn = c.wave(930, [8, 4], [500, 150]);
    fg.add(sheet().p(c.ridge(ffn, -1200, 2800, 1800, 14, 1.4), mix(C.sand2, C.sand, 0.4)).out() + flowers(c, { x0: -1000, x1: 2600, y: 930, fn: ffn, n: 20, h: 26 }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 250, T, 1, 0.6);

      /* v16 — blessed are your eyes and your ears */
      const eyes = es(t, 0.1, 0.4, ease.back);
      const ears = es(t, 0.35, 0.65, ease.back);
      const lean = es(t, 3.05, 3.4);
      SEATS.forEach((d) => {
        d.p.set({ x: d.x, y: d.y, s: d.s, flip: d.flip, armF: 20 + lean * 20 + bump(t, 0.4, 0.95) * 30 * (d.i % 2), armB: 10, head: -eyes * 6 - lean * 6 * (d.back ? 1 : 0.5), lean: lean * (d.flip ? -6 : 6), blink: blinkAt(T, d.seed) });
        const shine = 1 + Math.sin(T * 2 + d.i) * 0.04;
        const e = eyes * (1 - es(t, 2.9, 3.15));
        pose(d.eye, { x: d.hx + (d.flip ? -4 : 4), y: d.hy - 56 * d.s - 6 + Math.sin(T * 1.3 + d.i) * 2, s: e * 0.8 * shine, o: e > 0.01 ? 1 : 0 });
        const er = ears * (1 - es(t, 2.9, 3.15));
        pose(d.ear, { x: d.hx + (d.flip ? 20 : -20), y: d.hy - 4, s: er * 0.36, sx: d.flip ? -1 : 1, o: er > 0.01 ? 1 : 0 });
      });
      const speakOn = es(t, 0.05, 0.3) * (1 - es(t, 3.6, 3.9));
      jesus.set({
        x: JX, y: JY, s: 1.02, armF: 40 + speakOn * (20 + Math.sin(T * 1.4) * 8) + es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.1)) * 60,
        armB: 12 + bump(t, 0.15, 0.95) * 90 + es(t, 3.05, 3.3) * 70, head: -4 - es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.1)) * 10, blink: blinkAt(T),
      });
      const [jhx, jhy] = headAt(JX, JY, 1.02, false, 62);
      rings(jhx + 14, jhy + 6, speakOn * (t < 3 ? 1 : 0.6), T, { spread: 2.2 + es(t, 2, 2.4) * 1.4 });

      /* v17 — the prophets and the righteous longed to see and to hear */
      const oldIn = es(t, 0.95, 1.3, ease.out) * (1 - es(t, 3.0, 3.35));
      OLD.forEach((o) => {
        const lean2 = es(t, 1.2 + o.i * 0.05, 1.5 + o.i * 0.05) * 7 * (o.x < 800 ? 1 : -1);
        pose(o.el, { x: o.x, y: lerp(-400, 165 + (o.i % 2) * 18, oldIn), r: lean2 + Math.sin(T * 0.8 + o.i) * 1.2, oy: 0, o: oldIn > 0.02 ? 1 : 0 });
      });
      const bk = es(t, 1.05, 1.4) * (1 - es(t, 3.0, 3.35));
      pose(cloudBank, { x: 0, y: lerp(-500, 372, bk), o: bk > 0.02 ? 1 : 0 });
      longing.forEach((l) => {
        const k = es(t, 1.35 + l.o.i * 0.06, 1.55 + l.o.i * 0.06, ease.back) * (1 - es(t, 2.9, 3.1));
        const shut = es(t, 1.8, 1.95);
        const ke = k * (1 - es(t, 1.95, 2.05));
        pose(l.eye, { x: l.o.x + (800 - l.o.x) * 0.1, y: 418 + (l.o.i % 2) * 14, s: ke * 0.9, sy: ke * 0.9 * (1 - shut * 0.85), o: ke > 0.02 ? 1 : 0 });
        const ek = es(t, 2.05 + l.o.i * 0.06, 2.25 + l.o.i * 0.06, ease.back) * (1 - es(t, 2.9, 3.1));
        pose(l.ear, { x: l.o.x + (800 - l.o.x) * 0.1, y: 412 + (l.o.i % 2) * 14, s: ek * 0.36, sx: l.o.x > 800 ? -1 : 1, o: ek > 0.02 ? 1 : 0 });
      });

      /* v18 — hear the parable of the sower */
      const pIn = es(t, 3.1, 3.45, ease.back);
      hangAt(plate, JX, lerp(-400, 330, pIn), T, 1.4, 0.8);
      pose(plateGlow, { x: JX, y: 330, s: 0.8 + Math.sin(T * 1.5) * 0.04, o: pIn * 0.8 });

      S.cam.z = 1.06 + es(t, 0, 0.6) * 0.07 - es(t, 0.9, 1.3) * 0.11 + es(t, 3, 3.5) * 0.04;
      S.cam.y = 50 + es(t, 0, 0.6) * 10 - es(t, 0.9, 1.3) * 110 + es(t, 3.0, 3.5) * 50;
    };
  },
};
