// Mt 9,35 — Jesus and His disciples walk the roads of Galilee past signposts to Cana, Nain and Magdala; people
// come out of every village to see Him go by. In one village He teaches on the steps of the synagogue, and golden
// slips of the good news of the Kingdom fly out over the listeners. In the next the sick are waiting — a man on a
// mat, a lame man on a crutch, a blind woman — and they get up healed: the crutch goes up, the mat is rolled.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock, grass, bush, olive, cypress, palm, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { galileeHills, village, synagogueFront, mob, pose3, folk4, crutch, stick, spark, wordSlip, rolledMat, kf, moving, tr, DIS4, MORNING, PI } from './lib.js';
import { signpost } from '../mark1/lib.js';
import { sickOnMat } from '../mark6/lib.js';

const P = 0.55;
const camFor = (x) => (x - 800) / P;
const FEET = 712;
const SYN = 1300, SICK = 1900;

export default {
  id: 'mt9-towns',
  beats: [
    { v: 35, text: 'Tak Jezus obchodził wszystkie miasta i wioski.' },
    { v: 35, cont: true, text: 'Nauczał w tamtejszych synagogach, głosił Ewangelię królestwa' },
    { v: 35, cont: true, text: 'i leczył wszystkie choroby i wszystkie słabości.' },
  ],
  cam: { x: [camFor(600), camFor(1900)], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const set = galileeHills(S, { skyCols: MORNING, sunAt: [S.portrait ? 1030 : 1100, 140] });     // phone: the sun clear of the progress thread
    const c = S.c;
    // far villages on the green hills
    const farV = S.layer({ par: 0.2, sh: 3 });
    [[300, 0.34], [760, 0.3], [1260, 0.34], [1800, 0.3], [2300, 0.34], [2800, 0.3]].forEach(([x, sc]) => farV.add(`<g transform="translate(${x} ${set.mfn(x) + 14})">${village(c, { n: 4, w: 150, sc })}</g>`));

    /* the near land: a rolling green band with the road */
    const land = S.layer({ par: P, sh: 3 });
    const gfn = (x) => 600 + Math.sin(x * 0.004) * 16 + Math.sin(x * 0.011) * 6;
    const gs = sheet().p(c.ridge(gfn, -900, 3400, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.35));
    gs.p(c.ribbon(Array.from({ length: 44 }, (_, i) => { const x = -900 + i * 100; return [x, FEET + 8 + Math.sin(x * 0.006) * 6]; }), 64, 2), mix(C.sand, C.cream, 0.3));
    land.add(gs.out());
    // three villages along the road
    land.add(`<g transform="translate(700 ${gfn(700) + 16})">${village(c, { n: 5, w: 260, sc: 0.62 })}</g>` + `<g transform="translate(${SYN - 150} ${gfn(SYN - 150) + 16})">${village(c, { n: 3, w: 140, sc: 0.6 })}</g>` + `<g transform="translate(${SICK + 60} ${gfn(SICK + 60) + 16})">${village(c, { n: 5, w: 280, sc: 0.62 })}</g>`);
    land.add(`<g transform="translate(${SYN + 40} ${FEET - 40})">${synagogueFront(c, 1.3)}</g>`);
    land.add(olive(c, 460, gfn(460) + 20, 0.7) + cypress(c, 1020, gfn(1020) + 12, 110) + palm(c, 1580, gfn(1580) + 16, 170) + olive(c, 2220, gfn(2220) + 20, 0.8) + grass(c, { x0: -800, x1: 3200, y: 640, fn: (x) => gfn(x) + 8, n: 50, h: 12, color: C.moss }) + flowers(c, { x0: 300, x1: 2600, y: 660, fn: (x) => gfn(x) + 30, n: 18 }));
    land.add([[540, tr('Kana', 'Cana')], [1080, tr('Nain', 'Nain')], [1660, tr('Magdala', 'Magdala')]].map(([x, t]) => `<g transform="translate(${x} ${FEET - 30})">${signpost(c, t, { size: 18 })}</g>`).join(''));

    /* villagers: the first village comes out to see Him; the listeners at the synagogue; the sick */
    const folkL = S.layer({ par: P, sh: 4 });
    const v1 = folkL.sprite(mob(makeCutter('mt9-towns-v1'), 5, { s: 0.8, spread: 40, rows: 2, flip: true, arms: 50 }), 760, FEET - 40);
    const listen = folkL.sprite(pose3(makeCutter('mt9-towns-l'), Array.from({ length: 7 }, (_, i) => ({ x: (i - 3) * 50 + (i % 2) * 10, y: (i % 2) * 16, s: 0.82, flip: i > 3, head: -6, o: { ...folk4(makeCutter('mt9-towns-l' + i)), pose: 'sit' } }))), SYN + 40, FEET + 50);
    const SK = [
      { x: SICK - 60, sick: `<g transform="translate(0 -14)">${sickOnMat(c, {}, 170)}</g>`, well: person(c, { robe: C.linen2, mantle: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, holdF: `<g transform="translate(-4 -40) rotate(-70)">${rolledMat(c, 80)}</g>` }) },
      { x: SICK + 80, sick: person(c, { ...folk4(c, true), holdF: `<g transform="translate(0 30)">${crutch(c)}</g>` }), well: person(c, { ...folk4(c, true), holdF: `<g transform="translate(0 -20) rotate(160)">${crutch(c)}</g>` }) },
      { x: SICK + 190, sick: person(c, { ...folk4(c, false), eyes: 'closed', holdF: stick(c) }), well: person(c, folk4(c, false)) },
    ].map((k, i) => ({ ...k, i, a: folkL.add(`<g>${k.sick}</g>`), b: S.puppet(folkL.add(k.well)), seed: c.rr(0, 9) }));

    /* Jesus and the four */
    const walkL = S.layer({ par: P, sh: 5 });
    const DIS = DIS4.map((k, i) => ({ k, i, off: [-90, -150, -210, -270][i], dy: [-10, 4, -6, 8][i], seed: c.rr(0, 9), p: S.puppet(walkL.add(person(c, { ...CAST[k] }))) }));
    const jesus = S.puppet(walkL.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: P, sh: 6 });
    const slips = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g><circle r="22" fill="url(#warm-glow)"/>${wordSlip(c, 32)}</g>`), to: [SYN - 160 + i * 48, FEET - 150 - (i % 3) * 30] }));
    const sparks = SK.map(() => fx.add(`<g>${spark(c, 16)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(rock(c, 200, 1000, 240, 80, C.rock2) + rock(c, 2100, 1000, 280, 90, C.rock) + bush(c, 3000, 1010, 260, C.moss, C.sage));

    const JK = [[-0.3, 380], [0.9, 1000], [1.15, SYN - 60], [2.0, SYN - 60], [2.3, SICK - 150]];
    return (t, time) => {
      const T = time;
      set.update(T);
      const jx = kf(t, JK);
      const walking = moving(t, JK);
      const teach = es(t, 1.2, 1.4) * (1 - es(t, 1.95, 2.05));
      const heal = es(t, 2.3, 2.5);
      jesus.set({ x: jx, y: FEET - teach * 20, s: 1.02, walk: walking ? jx * 0.05 : undefined, armF: 14 + teach * 70 + heal * 70, armB: 8 + teach * 50 + heal * 40, head: -teach * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const lag = 0.08 + d.i * 0.04;
        const x = kf(t - lag, JK) + d.off;
        d.p.set({ x, y: FEET + d.dy, s: 0.94, walk: moving(t - lag, JK) ? x * 0.05 + d.i : undefined, armF: 14 + bump(t, 0.4, 1.0) * (d.i === 0 ? 40 : 0), blink: blinkAt(T, d.seed) });
      });

      /* v35a — the villages come out to see Him */
      v1.set({ x: lerp(640, 800, es(t, 0.2, 0.6)), y: FEET - 40, o: seg(t, 0.15, 0.3) });
      /* v35b — He teaches at the synagogue */
      listen.set({ x: SYN + 40, y: FEET + 50, o: seg(t, 0.9, 1.1) });
      slips.forEach((s) => {
        const k = T ? ((T * 0.25 + s.i / 8) % 1) : (s.i + 0.5) / 8;
        const on = teach;
        const sx = jx + 20, sy = FEET - 200;
        pose(s.el, { x: lerp(sx, s.to[0], k), y: lerp(sy, s.to[1], k) - Math.sin(k * PI) * 40, r: (s.to[0] - sx) * 0.03, s: 0.6 + k * 0.5, o: on * Math.min(1, k * 4) * (1 - k * 0.5) });
      });
      /* v35c — the sick are healed */
      SK.forEach((k) => {
        const h = es(t, 2.4 + k.i * 0.1, 2.5 + k.i * 0.1);
        pose(k.a, { x: k.x, y: FEET + 10, o: 1 - h });
        const joy = es(t, 2.5 + k.i * 0.1, 2.75 + k.i * 0.1);
        k.b.set({ x: k.x, y: FEET + 10, s: 0.94, flip: true, o: h, armF: 40 + joy * 90, armB: 30 + joy * 110 * (k.i === 1 ? 1 : 0.6), head: -joy * 8, blink: blinkAt(T, k.seed) });
        const sk = bump(t, 2.35 + k.i * 0.1, 2.9 + k.i * 0.1);
        pose(sparks[k.i], { x: k.x + 10, y: FEET - 120, s: 0.6 + sk * 0.6, r: T * 30, o: sk });
      });

      S.cam.x = camFor(kf(t, [[0, 700], [0.9, 1000], [1.2, SYN - 20], [2.0, SYN - 20], [2.4, SICK - 40]]));
      S.cam.z = 1.04 + teach * 0.04;
      S.cam.y = 20;
      if (S.portrait) fg.shift(0, 160);   // phone: the foreground rocks would float as grey scraps above the caption
    };
  },
};
