// Mk 5,35–37 — messengers run up from Jairus's house: the lamp has gone out — "Your daughter is dead";
// Jairus sinks down; Jesus lays a hand on him: "Don't be afraid, only believe" and a small flame is lit
// again; then He holds back the crowd and takes only Peter, James and John (name tags on strings).
import { C, person, CAST, crowd, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, streetSet, bubble, tag, townsfolk, headAt, candle } from './lib.js';

const PI = Math.PI;
const JX = 800, FEET = 722;

export default {
  id: 'm5-news',
  beats: [
    { v: 35, text: 'Gdy On jeszcze mówił, przyszli ludzie od przełożonego synagogi i donieśli:' },
    { v: 35, cont: true, text: '«Twoja córka umarła, czemu jeszcze trudzisz Nauczyciela?»' },
    { v: 36 },
    { v: 37 },
  ],
  cam: { x: [-60, 160], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#d6dcd6', '#f2e2c6', '#f6dcb4'];
    const set = streetSet(S, { skyCols: SKY, sunAt: S.portrait ? [1000, 60] : [1180, 190] });   // phone: the sun hangs inward, not as a sliver under the thread
    const dim = S.layer({ par: 0, sh: 1, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#3b3450"/>`);

    const crowdL = S.layer({ par: 0.45, sh: 3 });
    const back = crowd(S, crowdL, [
      { y: 648, s: 0.7, n: 9, x0: 380, x1: 1000 },
      { y: 672, s: 0.8, n: 6, x0: 360, x1: 980 },
    ]);

    const pL = S.layer({ par: 0.5, sh: 5 });
    const FRONT = [[430, 0.94], [500, 0.92]].map(([x, s], i) => ({ i, x, s, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, townsfolk(c)))) }));
    const THREE = [
      { cast: CAST.james, x: 600, name: tr('Jakub', 'James') },
      { cast: CAST.peter, x: 660, name: tr('Piotr', 'Peter') },
      { cast: CAST.john, x: 716, name: tr('Jan', 'John') },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, { ...d.cast }))) }));
    const jairus = S.puppet(pL.add(person(c, { ...LOOK.jairus })));
    const jairusK = S.puppet(pL.add(person(c, { ...LOOK.jairus, pose: 'kneel' })));
    const MSG = [0, 1].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, { ...LOOK.messenger, robe: i ? C.stone : LOOK.messenger.robe, beard: i ? 'full' : 'short' }))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const flame = pL.add(`<g>${candle(c, 16)}</g>`);

    /* ---------- words & signs ---------- */
    const wL = S.layer({ par: 0.52, sh: 4 });
    const news = wL.add(`<g>${bubble(c, [tr('Twoja córka umarła,', 'Your daughter is dead.'), tr('czemu jeszcze trudzisz Nauczyciela?', 'Why bother the Teacher any more?')], { size: 18, dir: 1, fill: mix(C.stone, C.storm, 0.12) })}</g>`);
    const lampEl = hanging(wL, `${sheet().p(c.cut(c.circ(0, 0, 60, 34), 0.5, 5), C.cream).p(c.cut(c.circ(0, 0, 54, 34), 0.4, 5), mix(C.parchment, C.stone2, 0.3)).out()}<g transform="translate(-8 20) scale(1.3)">${oilLamp(c)}</g><path class="smoke" d="${c.ribbon(c.cbez([37, 0], [26, -16], [48, -26], [36, -46], 12), (u) => 4 - u * 2.8)}" fill="${C.stone2}" opacity="0"/>`, { x: 1010, y: -1000, len: 600 });
    const lampFlame = lampEl.querySelector('.flame'), lampGlow = lampEl.querySelector('.glow'), smoke = lampEl.querySelector('.smoke');
    const fear = wL.add(`<g>${bubble(c, [tr('Nie bój się,', 'Don’t be afraid,'), tr('wierz tylko!', 'only believe.')], { size: 22, dir: -1, fill: C.halo })}</g>`);
    const tags = THREE.map((d) => ({ d, el: hanging(wL, tag(c, d.name, { size: 18, w: 76 }), { x: d.x, y: -1000, len: 500 }) }));

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1420, 960, 260, 100, C.rock2) + rock(c, 180, 975, 220, 80, C.rock));

    return (t, time) => {
      const T = time;
      set.update(t, T);
      const sad = es(t, 1.1, 1.6) * (1 - es(t, 2.1, 2.8) * 0.8);
      dim.fade(sad * 0.22);

      /* v35 — messengers run in from the house */
      const mEnd = S.portrait ? [995, 1048] : [1030, 1100];   // phone: the second messenger clear of the thread
      MSG.forEach((m) => {
        const x = kf(t, [[0.05 + m.i * 0.12, 1700 + m.i * 60], [0.75 + m.i * 0.12, mEnd[m.i]]], ease.out);
        const tellK = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
        m.p.set({ x, y: FEET - 4 + m.i * 4, s: 0.96, flip: true, walk: t < 0.8 + m.i * 0.12 ? x * 0.06 : undefined, amt: 1.4, armF: 30 + tellK * (m.i ? 20 : 70), armB: 10 + tellK * (m.i ? 60 : 10), head: m.i ? 8 * tellK : 0, lean: t < 0.8 ? 6 : 0, blink: blinkAt(T, m.seed) });
      });
      /* Jairus: turns to them, sinks down; is raised by the word */
      const sink = es(t, 1.35, 1.42) * (1 - es(t, 2.55, 2.62));
      const walkOff = es(t, 3.35, 4, (u) => u);
      const jaX = 910 + walkOff * 260;
      jairus.set({ x: jaX, y: FEET, s: 1, flip: t < 1.3 ? false : t < 2.6 ? false : false, o: 1 - sink, walk: walkOff > 0 && walkOff < 1 ? jaX * 0.06 : undefined, armF: 20 + bump(t, 0.8, 1.35) * 40 + es(t, 2.6, 3) * 20, armB: 10, head: -bump(t, 0.8, 1.4) * 8 + es(t, 2.6, 3.0) * -4, blink: blinkAt(T, 5) });
      jairusK.set({ x: 910, y: FEET, s: 1, flip: false, o: sink, armF: 150, armB: 120, lean: 22, head: 18, blink: blinkAt(T, 5) });

      /* Jesus: hears; lays a hand on him; then holds the crowd back */
      const hand = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const halt = es(t, 3.05, 3.3) * (1 - es(t, 3.8, 3.95));
      const jx = JX + walkOff * 250;
      jesus.set({ x: jx, y: FEET, s: 1, flip: halt > 0.5, walk: walkOff > 0 && walkOff < 1 ? jx * 0.06 : undefined, armF: 12 + bump(t, 0.1, 0.7) * 50 + hand * 76 + halt * 30, armB: 8 + halt * 110, head: -bump(t, 1.1, 1.9) * 6 + hand * 10, lean: hand * 4, blink: blinkAt(T) });
      const fl = es(t, 2.3, 2.6, ease.back) * (1 - es(t, 3.3, 3.5));
      pose(flame, { x: 896, y: FEET - 118, s: fl * 0.9, o: fl > 0.02 ? 1 : 0 });

      /* v37 — only Peter, James and John go on with Him */
      THREE.forEach((d) => {
        const step = es(t, 3.15 + d.i * 0.08, 3.4 + d.i * 0.08);
        const x = d.x + step * 60 + walkOff * 250;
        d.p.set({ x, y: FEET - 12 + d.i * 3, s: 0.94, flip: false, walk: (step > 0 && step < 1) || (walkOff > 0 && walkOff < 1) ? x * 0.06 : undefined, armF: 10 + bump(t, 1.2, 2) * 30, armB: 6, head: -sad * 6, blink: blinkAt(T, d.seed) });
      });
      tags.forEach((g) => swing(g.el, g.d.x + 60 + walkOff * 250, -1000 + es(t, 3.2 + g.d.i * 0.1, 3.5 + g.d.i * 0.1, ease.back) * 1420, T, 1.5, 0.9, g.d.i));
      const held = es(t, 3.1, 3.4);
      back.forEach((m) => m.p.set({ x: m.x - held * 16, y: m.y, s: m.s, flip: false, armF: held * 20, head: -held * 4 + sad * 6, blink: blinkAt(T, m.seed) }));
      FRONT.forEach((f) => f.p.set({ x: f.x - held * 10, y: FEET + 12 + f.i * 4, s: f.s, flip: false, armF: 10 + held * 30, lean: -held * 3, blink: blinkAt(T, f.seed) }));

      /* the bubbles & the lamp that goes out */
      const k1 = es(t, 1.08, 1.28, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(news, { x: 1016, y: FEET - 205, s: k1, o: k1 > 0.02 ? 1 : 0 });
      swing(lampEl, 1010, -1000 + es(t, 1.05, 1.4, ease.back) * 1320 - es(t, 1.9, 2.1) * 1320, T, 1.2, 0.8);
      const out = es(t, 1.4, 1.7);
      fade(lampFlame, 1 - out); fade(lampGlow, 1 - out);
      attrSmoke(smoke, bump(t, 1.55, 2.0));
      const [hx, hy] = headAt(jx, FEET, 1, false);
      const k2 = es(t, 2.08, 2.28, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(fear, { x: hx + 12, y: hy - 34, s: k2, o: k2 > 0.02 ? 1 : 0 });

      S.cam.x = es(t, 0, 0.8) * 60 - es(t, 1.9, 2.3) * 40 + walkOff * 120;
      S.cam.y = 20 + bump(t, 1.2, 3.0) * 20;
      S.cam.z = 1.06 + bump(t, 1.2, 3.0) * 0.08;
    };
  },
};
function attrSmoke(el, o) { fade(el, o); }
