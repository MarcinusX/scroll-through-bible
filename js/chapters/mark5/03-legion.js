// Mk 5,6–10 — the man runs down and falls on his knees before Jesus; the spirit screams; Jesus commands it
// to come out and asks its name — "Legion" — and the dark shadow behind the man breaks into a swarm of
// little shadow-spirits, which beg not to be sent out of the country.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { rock, reeds } from '../../assets/nature.js';
import { boat, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, shoreSet, shadowCloak, cry, bubble, spirit, tag, headAt } from './lib.js';

const PI = Math.PI;
const JX = 760, FEET = 720, MX = 910;

export default {
  id: 'm5-legion',
  beats: [
    { v: 6 },
    { v: 7, text: 'i krzyczał wniebogłosy: «Czego chcesz ode mnie, Jezusie, Synu Boga Najwyższego?' },
    { v: 7, cont: true, text: 'Zaklinam Cię na Boga, nie dręcz mnie!».' },
    { v: 8 },
    { v: 9, text: 'I zapytał go: «Jak ci na imię?»' },
    { v: 9, cont: true, text: 'Odpowiedział Mu: «Na imię mi "Legion", bo nas jest wielu».' },
    { v: 10 },
  ],
  cam: { x: [-40, 120], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = shoreSet(S, { skyCols: ['#b9c6d2', '#efd9bf', '#f6dab0'], sunAt: [1300, 250], sunR: 40 });

    /* ---------- the boat pulled up, the disciples ---------- */
    const back = S.layer({ par: 0.5, sh: 4 });
    const B = boat(c, {});
    back.add(`<g transform="translate(250 752) scale(.86)">${B.back}${B.front}</g>`);
    const DIS = [
      { cast: CAST.james, x: 470 }, { cast: CAST.andrew, x: 530 }, { cast: CAST.john, x: 590 }, { cast: CAST.peter, x: 648 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(back.add(person(c, { ...d.cast }))) }));

    /* ---------- the man and his shadow ---------- */
    const manL = S.layer({ par: 0.5, sh: 4 });
    const shadowEl = manL.add(`<g>${shadowCloak(c, 150, 270)}</g>`);
    const run = S.puppet(manL.add(person(c, { ...LOOK.wild })));
    const kneel = S.puppet(manL.add(person(c, { ...LOOK.wild, pose: 'kneel' })));

    /* ---------- Jesus ---------- */
    const jL = S.layer({ par: 0.5, sh: 5 });
    const burst = jL.add(`<g>${rays(c, { n: 18, r0: 40, r1: 420, spread: 0.045, color: '#fff3cf' })}<circle r="130" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));

    /* ---------- words ---------- */
    const wL = S.layer({ par: 0.52, sh: 3 });
    const b1 = wL.add(`<g>${cry(c, [tr('Czego chcesz ode mnie, Jezusie,', 'What have I to do with you, Jesus,'), tr('Synu Boga Najwyższego?', 'Son of the Most High God?')], { size: 19, dir: -1 })}</g>`);
    const b2 = wL.add(`<g>${cry(c, [tr('Nie dręcz mnie!', 'Don’t torment me!')], { size: 24, dir: -1 })}</g>`);
    const b3 = wL.add(`<g>${bubble(c, [tr('Wyjdź, duchu nieczysty,', 'Come out of the man,'), tr('z tego człowieka!', 'you unclean spirit!')], { size: 19, dir: 1, fill: C.halo })}</g>`);
    const b4 = wL.add(`<g>${bubble(c, [tr('Jak ci na imię?', 'What is your name?')], { size: 22, dir: 1 })}</g>`);
    const b5 = wL.add(`<g>${cry(c, [tr('„Legion” — bo nas jest wielu', '“Legion” — for we are many')], { size: 20, dir: -1 })}</g>`);
    const b6 = wL.add(`<g>${cry(c, [tr('Nie wyganiaj nas', 'Don’t send us away'), tr('z tej okolicy!', 'out of the country!')], { size: 19, dir: -1 })}</g>`);

    /* ---------- the legion: many small shadows ---------- */
    const swarmL = S.layer({ par: 0.55, sh: 3 });
    const N = 30;
    const imps = Array.from({ length: N }, (_, i) => {
      const a = (i / N) * PI * 2 + c.rr(-0.1, 0.1);
      const row = i % 3;
      const hx = c.rr(1000, 1560);
      return {
        i, el: swarmL.add(`<g>${spirit(c, c.rr(0.7, 1.15))}</g>`), ph: c.rr(0, 6),
        home: [MX + Math.cos(a) * c.rr(10, 50), 520 + Math.sin(a) * c.rr(20, 70)],
        out: [lerp(560, 1240, ((i * 7) % N) / N) + c.rr(-30, 30), 200 + row * 70 + c.rr(-30, 30)],
        cling: [hx, set.hfn(hx) - c.rr(6, 40)],
        d: c.rr(0, 0.35),
      };
    });
    const tagL = S.layer({ par: 0.3, sh: 5 });
    const legionTag = hanging(tagL, tag(c, tr('LEGION', 'LEGION'), { size: 30, italic: false, weight: 600, fill: mix(C.storm2, C.stone2, 0.3), face: '#43384d', ink: C.cream }), { x: 1070, y: 120, len: 500 });

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1420, 960, 260, 100, C.rock2) + reeds(c, 170, 940, 14, 220, C.moss) + rock(c, 260, 980, 160, 60, C.rock));

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunY: 250 - es(t, 0, 7) * 60 });
      set.sk.blend(['#b9c6d2', '#efd9bf', '#f6dab0'], ['#c3d8da', '#f0e3c8', '#f6e4c2'], seg(t, 0, 7));

      /* v6 — he runs down from the hill and bows down before Jesus */
      const rx = kf(t, [[0, 1500], [0.55, MX + 10]], (u) => u);
      const down = es(t, 0.55, 0.62);
      const [, ry] = [0, lerp(set.bfn(1500) + 60, FEET, seg(t, 0, 0.55))];
      run.set({ x: rx, y: ry, s: 1, flip: true, o: 1 - down, walk: t < 0.55 ? t * 44 : undefined, amt: 1.5, armF: 60, armB: 80, lean: -8, head: 4 });
      const bow = bump(t, 0.62, 1.05) * 26;
      const cryK = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.2));
      const cower = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const shudder = bump(t, 3.1, 3.95);
      const lookUp = es(t, 4.1, 4.4);
      const beg = es(t, 6.0, 6.3);
      kneel.set({
        x: MX, y: FEET, s: 1, flip: true, o: down,
        armF: 20 + bow * 1.5 + cryK * (120 + Math.sin(t * 40) * 20) + cower * 150 + beg * 70 - shudder * 10,
        armB: 10 + cryK * (150 + Math.sin(t * 36 + 1) * 16) + cower * 110 + beg * 70,
        lean: bow - cryK * 10 + cower * 14 + beg * 16 + shudder * Math.sin(t * 60) * 5,
        head: bow * 0.6 - cryK * 18 + cower * 14 - lookUp * 8 * (1 - beg) + beg * 10, blink: blinkAt(T, 4),
      });
      const legion = es(t, 5.1, 5.45);
      const cs = 1 + shudder * Math.sin(T * 30) * 0.03 + cryK * 0.08;
      pose(shadowEl, { x: lerp(rx, MX, down) + 6, y: down ? FEET : ry, s: cs, o: (0.95 - shudder * 0.25) * (1 - legion) });

      /* Jesus: turns to meet him, commands, asks the name */
      const cmd = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const ask = es(t, 4.05, 4.3) * (1 - es(t, 5.0, 5.3));
      jesus.set({
        x: JX, y: FEET, s: 1, flip: false,
        armF: 14 + bump(t, 0.4, 1.0) * 30 + cmd * 76 + ask * 40 + beg * 20, armB: 8 + cmd * 120 + ask * 10,
        head: -cmd * 6 + ask * 4 + (1 - lookUp) * 0, blink: blinkAt(T), lean: -cryK * 2,
      });
      pose(burst, { x: JX + 20, y: FEET - 170, s: 0.3 + cmd * 0.7, r: cmd > 0 ? T * 5 : 0, o: cmd * 0.5 });

      /* the disciples draw back from the screaming man */
      DIS.forEach((d) => {
        const fear = es(t, 1.1, 1.4) * (1 - es(t, 4, 4.5));
        const awe = es(t, 5.1, 5.5);
        d.p.set({ x: d.x - fear * 16, y: FEET - 12 + d.i * 3, s: 0.92, flip: false, armF: 10 + fear * (d.i % 2 ? 90 : 40) + awe * 60, armB: 8 + fear * (d.i % 2 ? 40 : 110) + awe * (d.i % 2 ? 130 : 20), lean: -fear * 5, head: -awe * 10, blink: blinkAt(T, d.seed) });
      });

      /* bubbles */
      const [mhx, mhy] = headAt(MX, FEET, 1, true, 46);
      const show = (el, a, b, x, y, s = 1) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, b - 0.12, b)); pose(el, { x, y, s: k * s, r: k > 0.02 ? Math.sin(T * 7) * (el === b3 || el === b4 ? 0 : 2) : 0, o: k > 0.02 ? 1 : 0 }); };
      show(b1, 1.08, 2.0, mhx + 16, mhy - 38, 1);
      show(b2, 2.08, 3.0, mhx + 16, mhy - 40, 1.05);
      show(b3, 3.1, 4.0, JX - 4, FEET - 230, 1);
      show(b4, 4.08, 5.0, JX - 4, FEET - 230, 1);
      show(b5, 5.2, 6.0, mhx + 16, mhy - 40, 1);
      show(b6, 6.1, 7.2, mhx + 16, mhy - 40, 1);

      /* the swarm: hidden in the shadow → bursts out on "Legion" → clings to the hills */
      imps.forEach((m) => {
        const outK = es(t, 5.12 + m.d * 0.5, 5.6 + m.d * 0.5, ease.out);
        const clingK = es(t, 6.05 + m.d * 0.6, 6.7 + m.d * 0.6);
        const ph = (t > 5.1 ? T : 0) * 1.2 + m.ph;
        let x = lerp(m.home[0], m.out[0], outK), y = lerp(m.home[1], m.out[1], outK);
        x = lerp(x, m.cling[0], clingK); y = lerp(y, m.cling[1], clingK);
        const wig = 1 - clingK * 0.7;
        pose(m.el, { x: x + Math.cos(ph) * 8 * wig, y: y + Math.sin(ph * 1.3) * 6 * wig, r: Math.sin(ph) * 12, s: 0.6 + outK * 0.4, o: seg(t, 5.1, 5.2) });
      });
      swing(legionTag, 1070, 120 + es(t, 5.2, 5.6, ease.back) * 150 - es(t, 6.9, 7.2) * 60, T, 1.6, 0.9);
      tagL.fade(seg(t, 5.15, 5.3) * (1 - es(t, 6.8, 7)));

      /* camera */
      S.cam.x = 80 - es(t, 0.3, 0.9) * 50 + es(t, 5.9, 6.6) * 40;
      S.cam.y = 10 + es(t, 0.6, 1.2) * 30 - es(t, 5.0, 5.6) * 60 + es(t, 5.9, 6.6) * 20;
      S.cam.z = 1.02 + es(t, 0.6, 1.2) * 0.1 - es(t, 5.0, 5.6) * 0.1 + bump(t, 1.05, 2.1) * 0.03;
    };
  },
};
