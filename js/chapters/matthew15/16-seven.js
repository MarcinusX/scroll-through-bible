// Mt 15,34–36 — "How many loaves do you have?" — "Seven, and a few small fish": Andrew opens his basket and the seven
// loaves hop out onto the cloth, John holds up a tray with the little fish. "He commanded the multitude to sit down on
// the ground": the crowd on the slopes sits down, row after row, in the grass. He takes the loaves and the fish, lifts
// them, gives thanks — a light opens above Him — and breaks them; He gives to the disciples, and the disciples carry the
// baskets out to the crowd, bread and fish flying out to every row.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hillSet, crowdGroup, meadowRows, loaf, speech, GLYPH, spark, basket, crumb, loafHalves, smallFish, tray, cloth, say, hand, kf, moving, tr, PI } from './lib.js';

const JX = 800;
const DIS = [
  { k: 'peter', o: CAST.peter, x: 918, out: 1180 },
  { k: 'andrew', o: CAST.andrew, x: 690, out: 430 },
  { k: 'james', o: CAST.james, x: 985, out: 1090 },
  { k: 'john', o: CAST.john, x: 620, out: 520 },
  { k: 'matthew', o: CAST.matthew, x: 1050, out: 1300 },
  { k: 'thomas', o: CAST.thomas, x: 555, out: 330 },
];

export default {
  id: 'mt15-seven',
  beats: [
    { v: 34, text: 'Jezus zapytał ich: «Ile macie chlebów?»' },
    { v: 34, cont: true, text: 'Odpowiedzieli: «Siedem i parę rybek».' },
    { v: 35 },
    { v: 36, text: 'wziął siedem chlebów i ryby, i odmówiwszy dziękczynienie, połamał,' },
    { v: 36, cont: true, text: 'dawał uczniom, uczniowie zaś tłumom.' },
  ],
  cam: { x: [-40, 40], y: [-20, 90], z: [0.97, 1.2] },
  build(S) {
    const H = hillSet(S, { skyCols: ['#d9e1d2', '#f1e6c9', '#f5e0bd'], meadow: mix(C.hillNear, C.wheat, 0.25) });
    const c = S.c;
    const { sfn, gfn } = H;
    const heaven = H.hangL.add(`<g>${rays(c, { n: 16, r0: 30, r1: 700, spread: 0.05, color: '#fff3cf' })}<circle r="160" fill="url(#halo-glow)"/></g>`);

    /* ---------- the crowd: standing groups, then the seated rows ---------- */
    const GR = [[250, 34, 6], [450, 20, 6], [650, 10, 4], [950, 10, 4], [1150, 20, 6], [1350, 34, 6]].map(([x, dy, n], i) => ({ i, x, sp: H.slopeL.sprite(crowdGroup('mt15-cp-' + i, n, { s: 0.44, flip: x > 800, spread: 32, rows: 2 }), x, sfn(x) + dy) }));
    const M = meadowRows(S, sfn, { par: 0.3 });
    M.L.fade(0);

    /* ---------- Jesus, the disciples, the bread ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const JY = gfn(JX) + 4;
    L.add(`<g transform="translate(${JX + 6} ${JY + 26})">${cloth(c, 250, 24)}</g>`);
    const loaves = Array.from({ length: 7 }, (_, i) => ({ i, el: L.add(`<g>${loaf(c, 16)}</g>`), x: JX - 96 + i * 32, y: JY + 22 }));
    const dis = DIS.map((d, i) => {
      const p = S.puppet(L.add(person(c, d.o)));
      const bk = L.add(`<g>${basket(c, { w: 42, h: 30, heapK: 'heap7-' + d.k })}</g>`);
      return { ...d, i, p, bk, heap: S.$('heap7-' + d.k), seed: c.rr(0, 9), y: gfn(d.x) + 22 + (i % 2) * 8 };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const halves = loafHalves(c, 20);
    const hl = L.add(`<g>${halves.left}</g>`), hr = L.add(`<g>${halves.right}</g>`);
    const fishTray = L.add(`<g>${tray(c, 90)}${[-26, 0, 26].map((x, i) => `<g transform="translate(${x} ${-6 - (i % 2) * 3}) rotate(${i * 8 - 8})">${smallFish(c, { s: 0.8 })}</g>`).join('')}</g>`);
    const fx = S.layer({ par: 0.5, sh: 3 });
    const sparks = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, 9)}</g>`) }));
    const flyFish = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${smallFish(c, { s: 0.6, col: i % 2 ? C.lake3 : C.lake2 })}</g>`), row: M.rows[(i * 7 + 3) % M.rows.length] }));
    const crumbs = Array.from({ length: 14 }, (_, i) => ({ i, el: fx.add(`<g>${crumb(c, 8)}</g>`), row: M.rows[(i * 5) % M.rows.length] }));
    const bub = S.layer({ par: 0.5, sh: 4 });
    const askB = bub.add(`<g>${speech(c, `<g transform="translate(-12 10)">${loaf(c, 14)}</g><g transform="translate(18 -2)">${GLYPH.q(c)}</g>`, { w: 84, h: 54 })}</g>`);
    const sevenB = bub.add(`<g>${say(c, tr('Siedem i parę rybek', 'Seven, and a few fish'), { size: 21, side: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      H.update(T);

      /* v35 — they sit down, row after row */
      GR.forEach((g) => {
        const k = es(t, 2.1 + Math.abs(g.x - 800) * 0.0006, 2.3 + Math.abs(g.x - 800) * 0.0006);
        g.sp.set({ x: g.x, y: g.sp.by, o: 1 - k });
      });
      M.L.fade(es(t, 2.12, 2.6));

      /* Jesus */
      const ask = bump(t, 0.02, 0.95);
      const down = bump(t, 2.02, 2.9);
      const lift = es(t, 3.05, 3.3) * (1 - es(t, 3.55, 3.7));
      const brk = es(t, 3.55, 3.7);
      const giving = es(t, 4.02, 4.15) * (1 - es(t, 4.5, 4.7));
      const jArmF = 14 + ask * 55 + down * 70 + lift * 60 + brk * (1 - es(t, 4.4, 4.6)) * 58 + giving * 20;
      const jArmB = 8 + down * 60 + lift * 130 + brk * (1 - es(t, 4.4, 4.6)) * 50;
      jesus.set({ x: JX, y: JY, s: 1, flip: giving > 0.5, armF: jArmF, armB: jArmB, head: -lift * 20 + brk * 8 * (1 - giving) - down * 4, blink: blinkAt(T) });
      const [lx, ly] = hand(JX, JY, 1, false, jArmF);
      const inHand = es(t, 3.05, 3.12) * (1 - es(t, 4.1, 4.2));
      const split = es(t, 3.55, 3.75);
      pose(hl, { x: lx - split * 18, y: ly - 4, r: -split * 16, o: inHand });
      pose(hr, { x: lx + split * 18, y: ly - 4, r: split * 16, o: inHand });
      fade(heaven, lift * 0.6 + brk * (1 - es(t, 4.0, 4.3)) * 0.3);
      pose(heaven, { x: JX, y: 280, s: 0.8 + lift * 0.3, r: T ? T * 3 : 0 });
      sparks.forEach((sp) => {
        const a = (sp.i / 6) * PI * 2 + (T ? T * 0.8 : 0);
        const on = es(t, 3.1, 3.3) * (1 - es(t, 3.9, 4.0));
        pose(sp.el, { x: JX + 10 + Math.cos(a) * 60, y: JY - 250 + Math.sin(a) * 30, s: on * 0.9, o: on });
      });
      // v34b — the seven loaves hop out of Andrew's basket onto the cloth
      loaves.forEach((l) => {
        const k = es(t, 1.08 + l.i * 0.07, 1.22 + l.i * 0.07);
        const x = lerp(700, l.x, k), y = lerp(JY - 90, l.y, k) - Math.sin(k * PI) * 60;
        const taken = l.i === 3 ? es(t, 3.02, 3.06) : es(t, 3.9 + l.i * 0.02, 4.0 + l.i * 0.02);
        pose(l.el, { x, y, o: k > 0.02 ? 1 - taken : 0, r: (1 - k) * 60 });
      });

      /* the disciples: Andrew's basket, John's tray; then out to the crowd with full baskets */
      dis.forEach((d) => {
        const out = S.portrait ? ({ peter: 1250, james: 1045, andrew: 360 })[d.k] ?? d.out : d.out;   // phone: nobody stops half out of the frame or under the thread
        const keys = [[4.0, d.x], [4.12, JX + (d.x > JX ? 90 : -90)], [4.22, JX + (d.x > JX ? 90 : -90)], [4.6, out], [4.95, out]];
        const x = kf(t, keys);
        const walk = moving(t, keys, 1);
        const dir = kf(t + 0.02, keys) - kf(t - 0.02, keys);
        const answer = d.k === 'andrew' ? bump(t, 1.0, 1.95) : 0;
        const carry = es(t, 4.1, 4.2);
        const trayUp = d.k === 'john' ? es(t, 1.3, 1.5) * (1 - es(t, 2.95, 3.1)) * 1.5 : 0;
        const aF = 20 + answer * 70 + carry * 30 + trayUp * 60 + bump(t, 4.6, 5.0) * 40;
        const fl = walk ? dir < 0 : d.x > JX;
        d.p.set({ x, y: d.y, s: 0.88, flip: fl, walk: walk ? x * 0.05 : undefined, armF: aF, armB: 10 + bump(t, 0.05, 0.9) * 20, head: bump(t, 3.05, 3.6) * -12, blink: blinkAt(T, d.seed) });
        const [bx, by] = hand(x, d.y, 0.88, fl, aF);
        const hasB = d.k === 'andrew' ? Math.max(bump(t, 0.9, 1.7) > 0 ? 1 : 0, carry) : carry;
        pose(d.bk, { x: bx, y: by + 22, o: hasB > 0.05 ? 1 : 0, s: 0.9 });
        fade(d.heap, es(t, 4.1, 4.2));
        if (d.k === 'john') pose(fishTray, { x: bx, y: by - 6, o: trayUp > 0.02 ? es(t, 1.3, 1.4) : 0, s: 1.35 });
      });

      /* v36b — bread and fish go out to every row */
      crumbs.forEach((cr) => {
        const k = seg(t, 4.3 + cr.i * 0.03, 4.72 + cr.i * 0.02);
        const tx = cr.row.x, ty = cr.row.y - 20;
        pose(cr.el, { x: lerp(cr.row.x > JX ? 1150 : 450, tx, k), y: lerp(JY - 120, ty, k) - Math.sin(k * PI) * 90, r: k * 360, o: k > 0 && k < 1 ? 1 : 0 });
      });
      flyFish.forEach((f) => {
        const k = seg(t, 4.4 + f.i * 0.03, 4.8 + f.i * 0.02);
        const tx = f.row.x, ty = f.row.y - 22;
        pose(f.el, { x: lerp(f.row.x > JX ? 1150 : 450, tx, k), y: lerp(JY - 130, ty, k) - Math.sin(k * PI) * 100, sy: tx < JX ? -1 : 1, r: tx < JX ? 180 : 0, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* speech */
      const a = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(askB, { x: JX + 24, y: JY - 222, s: a, o: a > 0.02 ? 1 : 0, r: T ? Math.sin(T * 2) * 3 : 0 });
      const sv = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(sevenB, { x: S.portrait ? 730 : 700, y: JY - 200, s: sv, o: sv > 0.02 ? 1 : 0 });

      /* camera: close on the loaves → wide for the crowd sitting → close for the blessing → wide */
      S.cam.z = kf(t, [[0, 1.18], [1.9, 1.18], [2.3, 1.0], [2.95, 1.0], [3.3, 1.14], [3.95, 1.14], [4.3, 0.98]]);
      S.cam.y = kf(t, [[0, 80], [1.9, 80], [2.3, 0], [2.95, 0], [3.3, 40], [3.95, 40], [4.3, -10]]);
    };
  },
};
