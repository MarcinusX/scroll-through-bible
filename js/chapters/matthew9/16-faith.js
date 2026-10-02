// Mt 9,28b–30 — inside the house the room looks dull and grey, as the blind men know it. "Do you believe that I
// am able to do this?" — "Yes, Lord!" and a little heart of faith lights over each. He touches their eyes:
// "According to your faith be it done to you" — sparks at their eyes, the grey veil lifts, their eyes open and
// the room is full of colour and light; they lift their hands and look about them. Then He warns them sternly,
// a finger raised: "See that no one knows about this!" — and closes the shutters.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roomSet, RM, BLIND, bubble, heart, spark, sparkle, kf, moving, tr } from './lib.js';

const FEET = RM.FLOOR + 20;
const JX = 820;

export default {
  id: 'mt9-faith',
  beats: [
    { v: 28, cont: true, text: 'a Jezus ich zapytał: «Wierzycie, że mogę to uczynić?»' },
    { v: 28, cont: true, text: 'Oni odpowiedzieli Mu: «Tak, Panie!»' },
    { v: 29 },
    { v: 30, text: 'I otworzyły się ich oczy,' },
    { v: 30, cont: true, text: 'a Jezus surowo im przykazał: «Uważajcie, niech się nikt o tym nie dowie!»' },
  ],
  cam: { x: [-40, 80], y: [0, 60], z: [1, 1.2] },
  build(S) {
    const set = roomSet(S, { bed: false, wall: mix(C.plaster, C.sand, 0.3) });
    const c = S.c;
    // the grey of blindness over the room (it lifts when their eyes open)
    const veil = S.layer({ par: 0.5, sh: 0, rise: 0 });
    veil.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.storm2, C.stone2, 0.45)}" opacity=".62"/>`);
    // a shutter over the window (closes at the end)
    const shL = S.layer({ par: 0.5, sh: 4 });
    const shut = [-1, 1].map((d) => shL.add(`<g>${sheet().p(c.cut(c.rect(d < 0 ? -52 : 0, 280, 52, 146), 0.4, 6), C.wood3).x(c.ribbon([[d * 26, 300], [d * 26, 410]], 2), shade(C.wood3, -0.2)).out()}</g>`));

    /* the two men, Peter and John, Jesus */
    const L = S.layer({ par: 0.5, sh: 5 });
    const peter = S.puppet(L.add(person(c, { ...CAST.peter })));
    const john = S.puppet(L.add(person(c, { ...CAST.john })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const M = BLIND.map((o, i) => ({
      i, x: [640, 540][i], seed: c.rr(0, 9),
      shut: S.puppet(L.add(person(c, { ...o, eyes: 'closed' }))),
      open: S.puppet(L.add(person(c, { ...o, mantle: i === 0 ? C.tealRobe : C.clayMantle }))),
    }));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const ask = fx.add(`<g opacity="0">${bubble(c, [tr('Wierzycie, że mogę', 'Do you believe that'), tr('to uczynić?', 'I am able to do this?')], { size: 21, dir: -1 })}</g>`);
    const yes = fx.add(`<g opacity="0">${bubble(c, [tr('Tak, Panie!', 'Yes, Lord!')], { size: 24, dir: 1 })}</g>`);
    const faith = fx.add(`<g opacity="0">${bubble(c, [tr('Według wiary waszej', 'According to your faith'), tr('niech wam się stanie!', 'be it done to you!')], { size: 21, dir: 1 })}</g>`);
    const warn = fx.add(`<g opacity="0">${bubble(c, [tr('Uważajcie, niech się nikt', 'See that no one'), tr('o tym nie dowie!', 'knows about this!')], { size: 21, dir: 1 })}</g>`);
    const hearts = M.map(() => fx.add(`<g>${heart(c, 11)}</g>`));
    const sparks = M.map(() => fx.add(`<g>${spark(c, 12)}</g>`));
    const glints = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 12)}</g>`), x: 470 + i * 70 + c.rr(-20, 20), y: 380 + c.rr(-60, 60) }));

    return (t, time) => {
      const T = time;
      /* v28b — the question */
      const touch = es(t, 2.1, 2.35) * (1 - es(t, 2.9, 3.1));
      const stern = es(t, 4.05, 4.25);
      jesus.set({ x: JX - touch * 60, y: FEET, s: 1.04, flip: true, armF: 20 + es(t, 0.1, 0.3) * 30 * (1 - touch) + touch * 70 + stern * 20, armB: 10 + stern * 150, head: touch * 8 - stern * 4, blink: blinkAt(T) });
      const ak = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(ask, { x: JX - 30, y: FEET - 230, s: ak, o: ak > 0.02 ? 1 : 0 });
      // phone: Peter and John stand a little nearer, clear of the right edge and the progress thread
      peter.set({ x: S.portrait ? 970 : 1000, y: FEET - 16, s: 0.98, flip: true, armF: 14 + bump(t, 3.1, 4.0) * 60, head: -2, blink: blinkAt(T, 2) });
      john.set({ x: S.portrait ? 1034 : 1080, y: FEET - 4, s: 1, flip: true, armF: 12 + bump(t, 3.1, 4.0) * 80, armB: bump(t, 3.1, 4.0) * 60, blink: blinkAt(T, 6) });

      /* v28c — "Yes, Lord!"; v29 — He touches their eyes; v30a — they see */
      const opened = es(t, 3.05, 3.12);
      M.forEach((m, i) => {
        const nod = es(t, 1.1, 1.3);
        const bow = es(t, 2.1, 2.3) * (1 - opened);
        m.shut.set({ x: m.x, y: FEET + i * 8, s: 0.98, o: 1 - opened, armF: 30 + nod * 40, armB: 20 + nod * 50 * (i ? 1 : 0.5), head: -8 * (1 - bow) + bow * 10, lean: bow * 6, blink: 0 });
        const joy = es(t, 3.12, 3.4);
        m.open.set({ x: m.x, y: FEET + i * 8, s: 0.98, o: opened, armF: 60 + joy * 80 * (1 - stern * 0.6), armB: 40 + joy * 110 * (1 - stern * 0.6), head: -joy * 10 + (i ? 1 : -1) * bump(t, 3.2, 3.9) * 8 + stern * 8, blink: blinkAt(T, m.seed) });
        const hk = es(t, 1.2 + i * 0.1, 1.4 + i * 0.1, ease.back) * (1 - es(t, 1.95, 2.1));
        pose(hearts[i], { x: m.x + 4, y: FEET - 240 - hk * 10, s: hk, o: hk > 0.02 ? 1 : 0 });
        const sk = bump(t, 2.3 + i * 0.12, 3.15);
        pose(sparks[i], { x: m.x + 12, y: FEET + i * 8 - 170, s: 0.6 + sk * 0.6, r: T * 40, o: sk });
      });
      const yk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(yes, { x: 610, y: FEET - 226, s: yk, o: yk > 0.02 ? 1 : 0 });
      const fk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(faith, { x: JX - 70, y: FEET - 230, s: fk, o: fk > 0.02 ? 1 : 0 });
      veil.fade(1 - es(t, 3.05, 3.4));
      pose(set.winLight, { o: es(t, 3.1, 3.4) * (1 - es(t, 4.3, 4.5)) });
      glints.forEach((g) => {
        const k = bump(t, 3.1 + g.i * 0.05, 3.9 + g.i * 0.05);
        pose(g.el, { x: g.x, y: g.y - k * 20, s: 0.6 + k * 0.5, o: k });
      });

      /* v30b — the stern warning; the shutters close */
      const wk = es(t, 4.1, 4.3, ease.back);
      pose(warn, { x: JX + 20, y: FEET - 236, s: wk, o: wk > 0.02 ? 1 : 0 });
      const close = es(t, 4.3, 4.55);
      shut.forEach((sh, i) => pose(sh, { x: RM.WIN + (i ? 1 : -1) * 50 * (1 - close), sx: 0.1 + close * 0.9, o: close > 0.02 ? 1 : 0 }));

      S.cam.x = 20 + es(t, 1.9, 2.3) * -20 + es(t, 3.9, 4.3) * 20;
      S.cam.z = 1.08 + es(t, 1.9, 2.3) * 0.08 - es(t, 3.0, 3.4) * 0.06;
      S.cam.y = 30;
    };
  },
};
