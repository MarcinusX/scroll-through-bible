// Mk 5,30–34 — Jesus feels that power has gone out of Him (golden rings), stops, turns round and asks who
// touched His clothes; Peter points at the pressing crowd; He keeps looking; the crowd parts and the woman
// comes, trembling, falls at His feet and tells the whole story (twelve moons, coins, the hem, a heart);
// "Daughter, your faith has made you well. Go in peace" — and she goes, upright and in colour.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, streetSet, bubble, coin, spark, heart, townsfolk, headAt } from './lib.js';

const PI = Math.PI;
const JX = 850, FEET = 722, WX = 730;

export default {
  id: 'm5-who',
  beats: [
    { v: 30, text: 'A Jezus natychmiast uświadomił sobie, że moc wyszła od Niego.' },
    { v: 30, cont: true, text: 'Obrócił się w tłumie i zapytał: «Kto się dotknął mojego płaszcza?»' },
    { v: 31 },
    { v: 32 },
    { v: 33, text: 'Wtedy kobieta przyszła zalękniona i drżąca, gdyż wiedziała, co się z nią stało,' },
    { v: 33, cont: true, text: 'upadła przed Nim i wyznała Mu całą prawdę.' },
    { v: 34, text: 'On zaś rzekł do niej: «Córko, twoja wiara cię ocaliła,' },
    { v: 34, cont: true, text: 'idź w pokoju i bądź uzdrowiona ze swej dolegliwości!».' },
  ],
  cam: { x: [-120, 60], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe1dc', '#f2e9cf', '#f8edd6'];
    const set = streetSet(S, { skyCols: SKY });

    const crowdL = S.layer({ par: 0.45, sh: 3 });
    const back = crowd(S, crowdL, [
      { y: 648, s: 0.7, n: 9, x0: 420, x1: 1320 },
      { y: 672, s: 0.8, n: 6, x0: 460, x1: 1300 },
    ]);

    const pL = S.layer({ par: 0.5, sh: 5 });
    const rings = [0, 1, 2].map(() => pL.add(`<path d="${c.ribbon(c.arc(0, 0, 60, 60, 0, PI * 2, 30), 3)}" fill="${C.halo}"/>`));
    const jairus = S.puppet(pL.add(person(c, { ...LOOK.jairus })));
    const john = S.puppet(pL.add(person(c, { ...CAST.john })));
    const peter = S.puppet(pL.add(person(c, { ...CAST.peter })));
    // people she hides among (front-left), and the front-right of the crowd
    const HIDE = [[610, 0.94], [680, 0.96], [790, 0.9]].map(([x, s], i) => ({ i, x, s, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, townsfolk(c)))) }));
    const RIGHT = [[1160, 0.94], [1240, 0.9], [460, 0.92], [520, 0.95]].map(([x, s], i) => ({ i, x, s, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, townsfolk(c)))) }));
    const glow = pL.add(`<circle r="130" fill="url(#halo-glow)"/>`);
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const herL = S.layer({ par: 0.5, sh: 5 });
    const woman = S.puppet(herL.add(person(c, { ...LOOK.well })));
    const womanK = S.puppet(herL.add(person(c, { ...LOOK.well, pose: 'kneel' })));

    /* ---------- words ---------- */
    const wL = S.layer({ par: 0.52, sh: 4 });
    const who = wL.add(`<g>${bubble(c, [tr('Kto się dotknął', 'Who touched'), tr('mojego płaszcza?', 'my clothes?')], { size: 21, dir: 1 })}</g>`);
    const pet = wL.add(`<g>${bubble(c, [tr('Widzisz, że tłum zewsząd Cię ściska,', 'You see the multitude pressing against you,'), tr('a pytasz: Kto się Mnie dotknął?', 'and you say, ‘Who touched me?’')], { size: 18, dir: -1 })}</g>`);
    const moon = sheet().p(c.cut(c.circ(0, 0, 7, 12), 0.2, 3), C.moon).p(c.cut(c.circ(3, -1, 6, 12), 0.2, 3), mix(C.stone2, C.storm, 0.25)).out();
    const hemIcon = sheet().p(c.cut([[-12, -14], [10, -14], [14, 10], [-14, 10]], 0.4, 4), C.jesusMantle).x(c.ribbon([[-14, 8], [14, 8]], 2), shade(C.jesusMantle, 0.3)).out();
    const icons = [
      `<g>${[0, 1, 2, 3].map((k) => `<g transform="translate(${(k % 2) * 16 - 8} ${Math.floor(k / 2) * 16 - 8}) scale(.8)">${moon}</g>`).join('')}</g>`,
      `<g>${[0, 1, 2].map((k) => `<g transform="translate(${k * 9 - 9} ${k * -3})">${coin(c, 8)}</g>`).join('')}</g>`,
      `<g>${hemIcon}<g transform="translate(10 -10) scale(.6)">${spark(c, 10)}</g></g>`,
      `<g>${heart(c, 12)}</g>`,
    ];
    const truth = wL.add(`<g>${bubble(c, [' ', ' '], { w: 230, size: 22, dir: 1 })}${icons.map((ic, k) => `<g class="ic" data-i="${k}" transform="translate(${-174 + k * 52} -58)">${ic}</g>`).join('')}</g>`);
    const icEls = Array.from(truth.querySelectorAll('.ic'));
    const daughter = wL.add(`<g>${bubble(c, [tr('Córko, twoja wiara', 'Daughter, your faith'), tr('cię ocaliła,', 'has made you well.')], { size: 21, dir: 1, fill: C.halo })}</g>`);
    const peace = wL.add(`<g>${bubble(c, [tr('idź w pokoju!', 'Go in peace!')], { size: 22, dir: 1, fill: C.halo })}</g>`);
    const hearts = [0, 1, 2].map(() => wL.add(`<g>${heart(c, 9)}</g>`));
    const flowers = Array.from({ length: 6 }, (_, i) => wL.add(`<g>${sheet().p(c.cut(c.star(0, 0, 7, 3, 5, i), 0.2, 3), [C.jesusMantle, C.cream, C.wheat][i % 3]).x(c.poly(c.circ(0, 0, 2, 6)), C.ochre).out()}</g>`));

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1420, 960, 260, 100, C.rock2) + rock(c, 180, 975, 220, 80, C.rock));

    return (t, time) => {
      const T = time;
      set.update(t, T);
      set.sk.blend(SKY, ['#d3e3dd', '#f4ebd2', '#f9efda'], seg(t, 0, 8));

      /* v30a — power has gone out of Him: rings of light */
      rings.forEach((r, i) => {
        const k = seg(t, 0.15 + i * 0.18, 0.85 + i * 0.18);
        pose(r, { x: JX + 4, y: FEET - 120, s: 0.4 + k * 2.2, sy: 0.4 + k * 2.2, o: (1 - k) * 0.9 * (k > 0 ? 1 : 0) });
      });
      /* v30b–32 — He turns, asks, looks round */
      const turned = es(t, 1.1, 1.18);
      const look = t > 3 && t < 4 ? Math.sin((t - 3) * PI * 2) : 0;
      const toHer = es(t, 3.85, 4.1);
      const speak = es(t, 6.05, 6.3);
      const send = es(t, 7.05, 7.3);
      jesus.set({
        x: JX, y: FEET, s: 1, flip: turned > 0.5 && !(look > 0.35),
        armF: 12 + es(t, 0.1, 0.4) * 20 * (1 - turned) + bump(t, 1.2, 2.0) * 50 + speak * 50 + send * 20, armB: 8 + es(t, 0.1, 0.5) * 30 * (1 - turned) + send * 40,
        head: -look * 8 + toHer * 8 + speak * 4 - es(t, 0.1, 0.6) * 6 * (1 - turned), blink: blinkAt(T),
      });
      pose(glow, { x: JX + 2, y: FEET - 160, s: 1 + bump(t, 0.1, 1.0) * 0.4 + speak * 0.3, o: bump(t, 0.1, 1.2) * 0.7 + speak * 0.5 });

      /* v31 — the disciples: look at the crowd pressing on you! */
      const pp = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      peter.set({ x: JX + 110, y: FEET - 16, s: 0.96, flip: true, armF: 20 + pp * 70, armB: 10 + pp * (120 + Math.sin(t * 20) * 10), head: pp * -6, blink: blinkAt(T, 6) });
      john.set({ x: JX + 170, y: FEET - 26, s: 0.92, flip: true, armF: 10 + pp * 40, armB: 6, blink: blinkAt(T, 7) });
      jairus.set({ x: JX + 250, y: FEET - 8, s: 0.98, flip: true, armF: 20 + bump(t, 5.5, 8) * 0, armB: 20, head: 6 + Math.sin(t * 3) * 3 * (t > 2 && t < 6 ? 1 : 0), lean: 3, blink: blinkAt(T, 5) });
      const press = bump(t, 2.05, 2.95);
      back.forEach((m) => m.p.set({ x: m.x + (JX - m.x) * press * 0.06, y: m.y, s: m.s, flip: m.x > JX, head: -2, armF: press * 20, blink: blinkAt(T, m.seed) }));
      RIGHT.forEach((f) => f.p.set({ x: f.x + (JX - f.x) * press * 0.08, y: FEET + 12 + (f.i % 2) * 4, s: f.s, flip: f.x > JX, armF: 10 + press * 40, lean: press * (f.x > JX ? -4 : 4), blink: blinkAt(T, f.seed) }));

      /* v32–33 — the crowd parts; she comes trembling and falls at His feet */
      const part = es(t, 3.7, 4.2);
      HIDE.forEach((h) => h.p.set({ x: h.x + (h.i === 2 ? part * 150 : -part * (40 + h.i * 30)) + (JX - h.x) * press * 0.08, y: FEET + 14 + (h.i % 2) * 4, s: h.s, flip: h.i === 2 ? part < 0.5 : false, walk: part > 0 && part < 1 ? t * 30 + h.i : undefined, armF: 10 + press * 30 + part * 20, blink: blinkAt(T, h.seed) }));
      const tremble = bump(t, 3.9, 5.6) * Math.sin(T * 34) * 1.6;
      const wx = kf(t, [[4.05, 690], [4.6, WX]]);
      const fall = es(t, 5.02, 5.1);
      const up = es(t, 6.9, 6.98);
      const goX = kf(t, [[7.1, WX], [7.95, 470]], (u) => u);
      woman.set({
        x: up > 0 ? goX : wx + tremble, y: FEET + 10, s: 0.96, flip: up > 0.5, o: seg(t, 3.9, 4.0) * (1 - fall) + up,
        walk: (t > 4.05 && t < 4.6) || t > 7.1 ? (up ? goX : wx) * 0.06 : undefined,
        armF: 30 + (1 - up) * 50 + up * 20, armB: 20 + (1 - up) * 50 + up * 70, lean: (1 - up) * 8, head: (1 - up) * 12 - up * 6 + tremble, blink: blinkAt(T, 2),
      });
      const tell = es(t, 5.1, 5.35);
      womanK.set({ x: WX + 10, y: FEET + 10, s: 0.96, flip: false, o: fall * (1 - up), armF: 60 + tell * 20 * Math.max(0, Math.sin(t * 14)) + speak * 20, armB: 40 + tell * 30, lean: 16 - speak * 10, head: 14 - tell * 16 - speak * 8, blink: blinkAt(T, 2) });

      /* the bubbles */
      const [hx, hy] = headAt(JX, FEET, 1, true);
      const show = (el, a, b, x, y) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, b - 0.12, b)); pose(el, { x, y, s: k, o: k > 0.02 ? 1 : 0 }); return k; };
      show(who, 1.12, 1.98, hx - 10, hy - 34);
      show(pet, 2.08, 2.98, JX + 124, FEET - 220);
      show(truth, 5.15, 6.0, WX + 20, FEET - 150);
      icEls.forEach((el, k) => fade(el, es(t, 5.25 + k * 0.14, 5.35 + k * 0.14)));
      show(daughter, 6.08, 6.98, hx - 10, hy - 34);
      show(peace, 7.08, 7.98, hx - 10, hy - 34);
      hearts.forEach((h, i) => {
        const k = seg(t, 6.2 + i * 0.18, 6.9 + i * 0.18);
        pose(h, { x: lerp(JX - 20, WX + 30, k) + Math.sin(k * 6 + i) * 6, y: FEET - 140 - Math.sin(k * PI) * 50 - i * 10, s: 0.8 + k * 0.4, o: bump(t, 6.2 + i * 0.18, 6.9 + i * 0.18) });
      });
      flowers.forEach((f, i) => {
        const k = es(t, 7.2 + i * 0.1, 7.45 + i * 0.1, ease.back);
        pose(f, { x: lerp(WX, 470, (i + 1) / 7) - 10, y: FEET + 2 - (i % 2) * 6, s: k, r: T * 20 * 0 + i * 30, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = -20 - toHer * 40 + es(t, 7.1, 7.9) * -40;
      S.cam.y = 20 + es(t, 0, 1) * 10 + es(t, 4.8, 5.4) * 20 - es(t, 7.1, 7.9) * 20;
      S.cam.z = 1.08 + es(t, 0, 1) * 0.06 - bump(t, 1.9, 3.2) * 0.06 + es(t, 4.8, 5.4) * 0.06 - es(t, 7.1, 7.9) * 0.08;
    };
  },
};
