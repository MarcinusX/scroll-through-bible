// Łk 8,30–31 — on the shore, the man on his knees before Jesus, the great shadow behind him. "What is your name?"
// "Legion" — and the shadow breaks up into a crowd of little dark spirits that fall into ranks like a Roman legion
// under a dark standard with the name on it: many demons had gone into him. Then a pit opens in the sand — the
// abyss, dark and swirling — and the whole legion shrinks back from it, begging Him not to send them down there.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { gerasaShore, WILD, shadowCloak, cry, bubble, spirit, abyss, legionStandard, headAt, still, tr, PI } from './lib.js';

const JX = 690, FEET = 700, MX = 860;

export default {
  id: 'lk8-legion',
  beats: [
    { v: 30, text: 'A Jezus zapytał go: «Jak ci na imię?»' },
    { v: 30, cont: true, text: 'On odpowiedział: «Legion», bo wielu złych duchów weszło w niego.' },
    { v: 31 },
  ],
  cam: { x: [-40, 140], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const P = S.portrait;   // phone: the legion, its standard, the pit and the plea drawn in from the edge
    const set = gerasaShore(S, { skyCols: ['#b4bfcf', '#ead3bd', '#f3d6ae'], sunAt: [1320, 260], sunR: 40 });
    const back = S.layer({ par: 0.5, sh: 4 });
    const B = boat(c, {});
    back.add(`<g transform="translate(390 730) scale(.88)">${B.back}${still(c, [CAST.james, CAST.andrew, CAST.john, CAST.peter].map((o, i) => ({ x: -110 + i * 56, y: 2, s: 0.92, flip: false, armF: 14 + (i % 2) * 20, armB: 8, head: -4, o })))}${B.front}</g>`);

    /* the pit that opens in the sand */
    const pitL = S.layer({ par: 0.5, sh: 2 });
    const pit = pitL.add(`<g opacity="0">${abyss(c, 280, 64)}</g>`);

    /* the man, his shadow, the legion */
    const manL = S.layer({ par: 0.5, sh: 4 });
    const shadowEl = manL.add(`<g>${shadowCloak(c, 140, 260)}</g>`);
    const man = S.puppet(manL.add(person(c, { ...WILD, pose: 'kneel' })));
    const jesus = S.puppet(manL.add(person(c, { ...CAST.jesus })));
    const swarmL = S.layer({ par: 0.52, sh: 3 });
    const standard = swarmL.add(`<g opacity="0">${legionStandard(c, 'LEGION')}</g>`);
    const COLS = 6, ROWS = 4;
    const imps = Array.from({ length: COLS * ROWS }, (_, i) => {
      const col = i % COLS, row = Math.floor(i / COLS);
      return { i, col, row, el: swarmL.add(`<g opacity="0">${spirit(c, 0.9)}</g>`), rank: [(P ? 850 : 890) + col * 34 + (row % 2) * 17, 400 + row * 38], ph: c.rr(0, 6) };
    });

    /* words */
    const wL = S.layer({ par: 0.52, sh: 4 });
    const ask = wL.add(`<g opacity="0">${bubble(c, tr('Jak ci na imię?', 'What is your name?'), { size: 22, dir: -1, fill: C.halo })}</g>`);
    const name = wL.add(`<g opacity="0">${cry(c, tr('«Legion»', '“Legion”'), { size: 28, dir: -1 })}</g>`);
    const beg = wL.add(`<g opacity="0">${cry(c, [tr('Nie każ nam', 'Don’t send us'), tr('odejść do Czeluści!', 'into the abyss!')], { size: 20, dir: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v30a — "What is your name?" */
      const askK = es(t, 0.1, 0.3) * (1 - es(t, 0.9, 1.0));
      const forbid = es(t, 2.1, 2.3);
      jesus.set({ x: JX, y: FEET, s: 1.0, armF: 16 + askK * 50 + forbid * 30, armB: 8 + forbid * 20, head: -askK * 4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, FEET, 1.0, false);
      const ab = es(t, 0.15, 0.3, ease.back) * (1 - es(t, 0.92, 1.0));
      pose(ask, { x: jhx + 26, y: jhy - 34, s: ab, o: ab > 0.02 ? 1 : 0 });
      /* v30b — "Legion": the shadow breaks up into many */
      const breakK = es(t, 1.2, 1.5);
      man.set({ x: MX, y: FEET + 4, s: 1.0, flip: true, armF: 70 + bump(t, 1.0, 1.4) * 40, armB: 60, lean: 14, head: -es(t, 0.2, 0.5) * 8 + es(t, 2.2, 2.5) * 8, blink: blinkAt(T, 4) });
      pose(shadowEl, { x: MX + 10, y: FEET + 6, s: 0.86 * (1 + breakK * 0.2), o: 0.9 * (1 - breakK) });
      const [mhx, mhy] = headAt(MX, FEET + 4, 1.0, true, 46);
      const nb = es(t, 1.05, 1.2, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(name, { x: mhx - 20, y: mhy - 30, s: nb, r: nb > 0.02 && T ? Math.sin(T * 8) * 3 : 0, o: nb > 0.02 ? 1 : 0 });
      const march = es(t, 1.4, 1.8);
      const recoil = es(t, 2.25, 2.5);
      imps.forEach((m) => {
        const k = es(t, 1.22 + m.i * 0.008, 1.72 + m.i * 0.008);
        const x0 = MX + 10 + Math.cos(m.i * 2.4) * 40, y0 = FEET - 130 + Math.sin(m.i * 1.7) * 60;
        const wob = T ? Math.sin(T * 2.2 + m.ph) * (3 + recoil * 4) : 0;
        const x = lerp(x0, m.rank[0], k) + recoil * (m.col - 2.5) * 6, y = lerp(y0, m.rank[1], k) - recoil * (60 + m.row * 8) + wob;
        pose(m.el, { x, y, s: 0.9 + recoil * 0.05, r: wob * 2, o: breakK });
      });
      const sk = es(t, 1.6, 1.9, ease.back);
      pose(standard, { x: P ? 1070 : 1150, y: 600, s: sk, r: (T ? Math.sin(T * 0.8) * 2 : 0) - recoil * 6, o: sk > 0.02 ? 1 : 0 });
      /* v31 — they beg Him not to send them into the abyss */
      const open = es(t, 2.05, 2.35);
      pose(pit, { x: P ? 1020 : 1080, y: 690, sx: open, sy: open, o: open > 0.02 ? 1 : 0 });
      const bb = es(t, 2.35, 2.5, ease.back);
      pose(beg, { x: P ? 915 : 1060, y: P ? 330 : 360, s: bb, r: bb > 0.02 && T ? Math.sin(T * 7) * 2 : 0, o: bb > 0.02 ? 1 : 0 });

      S.cam.x = es(t, 0.9, 1.5) * (P ? 110 : 50);
      S.cam.z = 1.1 - es(t, 0.9, 1.5) * 0.06;
      S.cam.y = 20 - es(t, 0.9, 1.5) * 20 + es(t, 2.0, 2.4) * 20;
    };
  },
};
