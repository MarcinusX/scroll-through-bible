// Mk 8,5–9 — seven loaves and a few small fish: the crowd sits down on the ground, He gives thanks,
// breaks, the disciples carry it out; everyone eats; seven baskets of pieces; about four thousand.
// The far crowd is drawn as still sheets (standing / sitting), crossfaded row by row on the compositor.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, rock, grass } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, hand, loaf, speech, GLYPH, spark, desert, shrub, basket, crumb, loafHalves, smallFish, tray, cloth, say, tag, PI } from './lib.js';

const GY = 600;          // the near crowd
const FY = 648;          // Jesus, the cloth
const JX = 800;
const DIS = [
  { k: 'peter', o: CAST.peter, x: 918, out: 1180, back: 1040 },
  { k: 'andrew', o: CAST.andrew, x: 690, out: 430, back: 560 },
  { k: 'james', o: CAST.james, x: 985, out: 1080, back: 1100 },
  { k: 'john', o: CAST.john, x: 620, out: 520, back: 500 },
  { k: 'matthew', o: CAST.matthew, x: 1050, out: 1300, back: 1160 },
  { k: 'thomas', o: CAST.thomas, x: 555, out: 330, back: 440 },
];
const BASKETS = [450, 530, 610, 690, 910, 990, 1070];
const BASKETS_P = [520, 580, 640, 700, 880, 940, 1000];   // phone: all seven inside the screen
const OUT_P = { peter: 1090, andrew: 520, james: 1030, john: 570, matthew: 1110, thomas: 480 };   // phone: carrying it out stays in view

export default {
  id: 'm8-loaves',
  beats: [
    { v: 5, text: 'Zapytał ich: «Ile macie chlebów?»' },
    { v: 5, cont: true, text: 'Odpowiedzieli: «Siedem».' },
    { v: 6, text: 'I polecił ludowi usiąść na ziemi.' },
    { v: 6, cont: true, text: 'A wziąwszy siedem chlebów, odmówił dziękczynienie, połamał i dawał uczniom, aby je rozdzielali.' },
    { v: 6, cont: true, text: 'I rozdali tłumowi.' },
    { v: 7, text: 'Mieli też kilka rybek.' },
    { v: 7, cont: true, text: 'I nad tymi odmówił błogosławieństwo i polecił je rozdać.' },
    { v: 8 },
    { v: 9, text: 'Było zaś około czterech tysięcy ludzi.' },
    { v: 9, cont: true, text: 'Potem ich odprawił.' },
  ],
  cam: { x: [-40, 40], y: [-60, 130], z: [0.86, 1.32] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SUNX = P ? 1010 : 1200;
    const SKY = ['#d9e1d2', '#f1e6c9', '#f5e0bd'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: SUNX, y: 150, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 470, y: 170, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1020, y: 250, len: 700 });
    const heaven = hangL.add(`<g>${rays(c, { n: 16, r0: 30, r1: 700, spread: 0.05, color: '#fff3cf' })}<circle r="160" fill="url(#halo-glow)"/></g>`);
    const count = hanging(hangL, tag(c, tr('około 4000', 'about 4,000'), { size: 30, w: 210 }), { x: 800, y: 110, len: 900 });

    desert(S, { farY: 400, midY: 455 });

    /* ---------- the far crowd: rows of still sheets, standing and sitting ---------- */
    const rows = [
      { y: 486, s: 0.3, n: 44, x0: -500, x1: 2100 },
      { y: 506, s: 0.35, n: 38, x0: -450, x1: 2050 },
      { y: 528, s: 0.41, n: 30, x0: -400, x1: 2000 },
      { y: 552, s: 0.47, n: 24, x0: -300, x1: 1900 },
    ];
    const groundL = S.layer({ par: 0.26, sh: 3 });
    const gfn = c.wave(470, [5, 2], [700, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out());
    groundL.add(grass(c, { x0: -600, x1: 2200, y: 470, fn: gfn, n: 30, h: 10, color: C.olive }));
    const rowL = rows.map((r, ri) => {
      const st = S.layer({ par: 0.28 + ri * 0.02, sh: 2 + ri * 0.4 }), si = S.layer({ par: 0.28 + ri * 0.02, sh: 2 + ri * 0.4 });
      let a = '', b = '';
      for (let i = 0; i < r.n; i++) {
        const x = lerp(r.x0, r.x1, (i + c.rr(0.15, 0.85)) / r.n), y = r.y + c.rr(-4, 4), s = r.s * c.rr(0.9, 1.08);
        if (ri === 3 && Math.abs(x - 800) < 360) continue; // the near crowd stands here
        const o = crowdPerson(c), f = x > 800 ? -1 : 1;
        a += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s * f).toFixed(3)} ${s.toFixed(3)})">${person(c, o)}</g>`;
        b += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s * f).toFixed(3)} ${s.toFixed(3)})">${person(c, { ...o, pose: 'sit' })}</g>`;
      }
      st.add(a); si.add(b);
      return { st, si, ri };
    });

    /* ---------- the near crowd: puppets that sit, receive bread and fish, eat, stand and go ---------- */
    const nearL = S.layer({ par: 0.4, sh: 4 });
    const NEAR = [];
    [[468, 0.54], [520, 0.56], [585, 0.55], [1010, 0.55], [1075, 0.56], [1130, 0.54], [650, 0.5], [950, 0.5]].forEach(([x, s], i) => NEAR.push({ x, s, y: GY - 36 + (i > 5 ? -16 : (i % 2) * 8), i }));
    NEAR.sort((a, b) => a.y - b.y);
    NEAR.forEach((m) => {
      const o = crowdPerson(c);
      m.st = S.puppet(nearL.add(person(c, o)));
      m.si = S.puppet(nearL.add(person(c, { ...o, pose: 'sit' })));
      m.bread = nearL.add(`<g>${crumb(c, 9)}</g>`);
      m.fish = nearL.add(`<g>${smallFish(c, { s: 0.55 })}</g>`);
      m.flip = m.x > 800; m.d = Math.abs(m.x - 800) / 700; m.seed = c.rr(0, 9);
      m.exit = m.x < 800 ? -300 : 1900;
    });

    /* ---------- Jesus, the disciples, the bread ---------- */
    const frontL = S.layer({ par: 0.55, sh: 5 });
    frontL.add(`<g transform="translate(${JX + 6} ${FY + 10})">${cloth(c, 250, 24)}</g>`);
    const loaves = Array.from({ length: 7 }, (_, i) => ({ i, el: frontL.add(`<g>${loaf(c, 16)}</g>`), x: JX - 96 + i * 32, y: FY + 6 }));
    const dis = DIS.map((d0, i) => {
      const d = P ? { ...d0, x: 800 + (d0.x - 800) * 0.8, back: 800 + (d0.back - 800) * 0.66, out: OUT_P[d0.k] } : d0;   // phone: the six stand closer in, clear of the thread
      const p = S.puppet(frontL.add(person(c, d.o)));
      const bk = frontL.add(`<g>${basket(c, { w: 42, h: 30, heapK: 'heap-' + d.k })}</g>`);
      return { ...d, i, p, bk, heap: S.$('heap-' + d.k), seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(frontL.add(person(c, { ...CAST.jesus })));
    const halves = loafHalves(c, 20);
    const hl = frontL.add(`<g>${halves.left}</g>`), hr = frontL.add(`<g>${halves.right}</g>`);
    const fishTray = frontL.add(`<g>${tray(c, 90)}${[-26, 0, 26].map((x, i) => `<g transform="translate(${x} ${-6 - (i % 2) * 3}) rotate(${i * 8 - 8})">${smallFish(c, { s: 0.8 })}</g>`).join('')}</g>`);
    const blessL = S.layer({ par: 0.55, sh: 2 });
    const sparks = Array.from({ length: 6 }, (_, i) => ({ i, el: blessL.add(`<g>${spark(c, 9)}</g>`) }));
    const flyFish = Array.from({ length: 10 }, (_, i) => ({ i, el: blessL.add(`<g>${smallFish(c, { s: 0.6, col: i % 2 ? C.lake3 : C.lake2 })}</g>`), to: [lerp(380, 1220, i / 9), 470 + (i % 3) * 30] }));
    const crumbs = Array.from({ length: 12 }, (_, i) => ({ i, el: blessL.add(`<g>${crumb(c, 7)}</g>`), to: [lerp(360, 1240, i / 11), 460 + (i % 3) * 36] }));

    /* ---------- seven baskets of pieces ---------- */
    const bL = S.layer({ par: 0.6, sh: 5 });
    const baskets = (P ? BASKETS_P : BASKETS).map((x, i) => ({ i, x, el: bL.add(`<g>${basket(c, { w: 58, h: 40, full: true })}</g>`), num: bL.add(`<g>${tag(c, String(i + 1), { size: 20, w: 34 })}</g>`) }));

    /* ---------- speech ---------- */
    const bubL = S.layer({ par: 0.55, sh: 4 });
    const askB = bubL.add(`<g>${speech(c, `<g transform="translate(-12 10)">${loaf(c, 14)}</g><g transform="translate(18 -2)">${GLYPH.q(c)}</g>`, { w: 84, h: 54 })}</g>`);
    const sevenB = bubL.add(`<g>${say(c, tr('Siedem', 'Seven'), { size: 24, side: -1 })}</g>`);

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 160, 900, 260, 110, C.rock2) + rock(c, 1450, 910, 240, 100, C.rock) + shrub(c, 330, 880, 90, C.olive) + shrub(c, 1280, 890, 80, C.moss));

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#e4d9c4', '#f3dfbd', '#f2d2ac'], es(t, 6, 10));
      swing(sunEl, SUNX, 150 + es(t, 0, 10) * 70, T, 1.1, 0.7);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 170, T, 1.4, 0.6, 1);
      swing(cl2, 1020 + Math.sin(T * 0.13 + 2) * 26, 250, T, 1.4, 0.8, 2);
      const on4000 = es(t, 8.05, 8.4, ease.back) * (1 - es(t, 9.4, 9.8));
      swing(count, 800, 110 - (1 - on4000) * 500, T, 1.2, 0.8, 3);

      /* far rows: sit (v6) and stand again, then leave (v9b) */
      rowL.forEach((r) => {
        const sit = es(t, 2.15 + (3 - r.ri) * 0.12, 2.25 + (3 - r.ri) * 0.12) * (1 - es(t, 9.05 + r.ri * 0.04, 9.12 + r.ri * 0.04));
        const gone = es(t, 9.25 + (3 - r.ri) * 0.1, 9.6 + (3 - r.ri) * 0.1);
        r.si.fade(sit); r.st.fade((1 - sit) * (1 - gone));
        r.st.shift(0, gone * 10);
      });

      /* near crowd */
      NEAR.forEach((m) => {
        const sit = es(t, 2.08 + m.d * 0.5, 2.15 + m.d * 0.5) * (1 - es(t, 9.05 + m.d * 0.2, 9.12 + m.d * 0.2));
        const leave = seg(t, 9.2 + m.d * 0.2, 9.85);
        const x = lerp(m.x, m.exit, ease.in(leave));
        const got = es(t, 4.15 + m.d * 0.5, 4.25 + m.d * 0.5);
        const gotF = es(t, 6.3 + m.d * 0.4, 6.4 + m.d * 0.4);
        const eat = bump(t, 7.05 + m.seed * 0.03, 7.5 + m.seed * 0.03) + bump(t, 7.4 + m.seed * 0.03, 7.85);
        const fa = 36 + got * 20 + eat * 90;
        const look = es(t, 3.1, 3.3) * (1 - es(t, 3.9, 4.1));
        m.st.set({ x, y: m.y, s: m.s, flip: leave > 0 ? m.exit < 800 : m.flip, o: 1 - sit, walk: leave > 0 && leave < 1 ? x * 0.05 : undefined, armB: bump(t, 9.12, 9.6) * 90, blink: blinkAt(T, m.seed) });
        m.si.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, o: sit, armF: sit ? fa : 0, head: -look * 14 + eat * 6, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(m.x, m.y, m.s, m.flip, fa, 0, 62);
        pose(m.bread, { x: hx, y: hy - 2, s: got * (1 - es(t, 7.8, 8)) * (sit ? 1 : 0), r: -20, o: got * sit > 0.05 ? 1 : 0 });
        pose(m.fish, { x: hx + (m.flip ? -6 : 6), y: hy + 6, s: gotF * (1 - es(t, 7.8, 8)) * sit, r: m.flip ? 200 : -20, o: gotF * sit > 0.05 ? 1 : 0 });
      });

      /* Jesus */
      const ask = bump(t, 0.02, 0.95);
      const down = bump(t, 2.02, 2.9);
      const lift = es(t, 3.05, 3.3) * (1 - es(t, 3.55, 3.7));
      const brk = es(t, 3.55, 3.7);
      const giving = es(t, 3.7, 3.85) * (1 - es(t, 4.1, 4.3));
      const bless = es(t, 6.05, 6.25) * (1 - es(t, 6.8, 7));
      const bye = bump(t, 9.05, 9.95);
      const jArmF = 14 + ask * 55 + down * 70 + lift * 60 + brk * (1 - es(t, 4.1, 4.3)) * 58 + bless * 70 + bye * 70;
      const jArmB = 8 + down * 60 + lift * 150 + brk * (1 - es(t, 4.1, 4.3)) * 50 + bless * 30 + bye * 140;
      jesus.set({ x: JX, y: FY - 4, s: 1, flip: giving > 0.5 && t < 4.3, armF: jArmF, armB: jArmB, head: -lift * 22 - bless * 6 + brk * 8 * (1 - giving), blink: blinkAt(T) });
      // the loaf in His hands: whole (lifted), then broken in two
      const [lx, ly] = hand(JX, FY - 4, 1, false, jArmF);
      const inHand = es(t, 3.05, 3.12) * (1 - es(t, 4.25, 4.35));
      const split = es(t, 3.55, 3.75);
      pose(hl, { x: lx - split * 18, y: ly - 4 - lift * 0, r: -split * 16, o: inHand });
      pose(hr, { x: lx + split * 18, y: ly - 4, r: split * 16, o: inHand });
      fade(heaven, lift * 0.55 + bless * 0.35);
      pose(heaven, { x: JX, y: 300, s: 0.8 + lift * 0.3, r: T * 3 });
      // the seven loaves hop out of Andrew's basket onto the cloth, then go up in His hands
      loaves.forEach((l) => {
        const k = es(t, 1.08 + l.i * 0.08, 1.24 + l.i * 0.08);
        const x = lerp(700, l.x, k), y = lerp(FY - 90, l.y, k) - Math.sin(k * PI) * 60;
        const taken = l.i === 3 ? es(t, 3.02, 3.06) : es(t, 3.9 + l.i * 0.02, 4.0 + l.i * 0.02);
        pose(l.el, { x, y, o: k > 0.02 ? 1 - taken : 0, r: (1 - k) * 60 });
      });

      /* disciples: gather, carry baskets out, come back, collect seven baskets */
      dis.forEach((d) => {
        const keys = [[3.7, d.x], [3.85, JX + (d.x > JX ? 90 : -90)], [4.0, JX + (d.x > JX ? 90 : -90)], [4.5, d.out], [5.0, d.x], [7.3, d.x], [7.6, d.back], [7.9, d.x]];
        const x = kf(t, keys);
        const walk = moving(t, keys, 1);
        const dir = kf(t + 0.02, keys) - kf(t - 0.02, keys);
        const answer = d.k === 'andrew' ? bump(t, 1.0, 1.95) : 0;
        const carry = es(t, 3.85, 3.95) * (1 - es(t, 4.9, 5.0)) + es(t, 7.3, 7.35) * (1 - es(t, 7.85, 7.95));
        const trayUp = d.k === 'john' ? es(t, 5.05, 5.35) * (1 - es(t, 6.4, 6.6)) * 1.5 : 0;
        const aF = 20 + answer * 70 + carry * 30 + trayUp * 60;
        const fl = walk ? dir < 0 : d.x > JX;
        d.p.set({ x, y: FY + (d.i % 2) * 8, s: 0.86, flip: fl, walk: walk ? x * 0.05 : undefined, armF: aF, armB: 10 + bump(t, 0.05, 0.9) * 20, head: bump(t, 3.05, 3.6) * -12, blink: blinkAt(T, d.seed) });
        const [bx, by] = hand(x, FY + (d.i % 2) * 8, 0.86, fl, aF);
        const hasB = d.k === 'andrew' ? Math.max(bump(t, 0.85, 1.6) > 0 ? 1 : 0, carry) : carry;
        pose(d.bk, { x: bx, y: by + 22, o: hasB > 0.05 ? 1 : 0, s: 0.9 });
        fade(d.heap, es(t, 3.85, 4.0) * (1 - es(t, 4.6, 4.9)) + es(t, 7.45, 7.6));
        if (d.k === 'john') pose(fishTray, { x: bx, y: by - 6, o: trayUp > 0.02 ? es(t, 5.05, 5.15) : 0, s: 1.35 });
      });

      /* bread and fish go out to everyone */
      crumbs.forEach((cr) => {
        const k = seg(t, 4.05 + cr.i * 0.035, 4.5 + cr.i * 0.035);
        pose(cr.el, { x: lerp(JX, cr.to[0], k), y: lerp(FY - 150, cr.to[1], k) - Math.sin(k * PI) * 90, r: k * 360, o: k > 0 && k < 1 ? 1 : 0 });
      });
      sparks.forEach((sp) => {
        const a = (sp.i / 6) * PI * 2 + T * 0.8;
        pose(sp.el, { x: JX + 118 + Math.cos(a) * 44, y: FY - 170 + Math.sin(a) * 26, s: bless * (0.7 + Math.sin(T * 4 + sp.i) * 0.3), o: bless > 0.05 ? 1 : 0 });
      });
      flyFish.forEach((f) => {
        const k = seg(t, 6.3 + f.i * 0.04, 6.75 + f.i * 0.04);
        pose(f.el, { x: lerp(JX + 110, f.to[0], k), y: lerp(FY - 170, f.to[1], k) - Math.sin(k * PI) * 110, r: (f.to[0] < JX ? 180 : 0) + Math.sin(k * PI * 2) * 20, sy: f.to[0] < JX ? -1 : 1, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* seven baskets of pieces, counted */
      baskets.forEach((b) => {
        const st = P ? 0.025 : 0.06;   // phone: the seventh basket is in by x.75 too
        const k = es(t, 7.45 + b.i * st, 7.62 + b.i * st, ease.back);
        const y = FY + 36 + Math.abs(b.x - JX) * 0.04;
        pose(b.el, { x: b.x, y, s: k * (1 - es(t, 9.3, 9.6)), o: k > 0.02 ? 1 : 0 });
        const nk = es(t, 7.5 + b.i * st, 7.66 + b.i * st, ease.back) * (1 - es(t, 8.1, 8.3));
        pose(b.num, { x: b.x, y: y - 100, s: nk, o: nk > 0.02 ? 1 : 0 });
      });

      /* speech */
      const a = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(askB, { x: JX + 24, y: FY - 222, s: a, o: a > 0.02 ? 1 : 0, r: Math.sin(T * 2) * 3 });
      const sv = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(sevenB, { x: 700, y: FY - 200, s: sv, o: sv > 0.02 ? 1 : 0 });

      /* camera: close on the loaves → wide for the four thousand */
      S.cam.z = 1.3 - es(t, 1.9, 2.4) * 0.14 + es(t, 2.9, 3.3) * 0.04 - es(t, 3.95, 4.3) * 0.06 + es(t, 4.9, 5.3) * 0.08 - es(t, 7.9, 8.4) * 0.36 + es(t, 9, 9.6) * 0.06;
      S.cam.y = 120 - es(t, 1.9, 2.4) * 30 - es(t, 2.9, 3.3) * 20 + es(t, 4.9, 5.3) * 20 - es(t, 7.9, 8.4) * 110 + es(t, 9, 9.6) * 20;
    };
  },
};
