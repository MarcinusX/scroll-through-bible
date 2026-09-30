// J 6,11–13 — Jesus takes the boy's loaves, lifts them and gives thanks (a warm light opens above Him); He Himself
// hands them out to those sitting — the bread never runs out, pieces fly to every row; then the fish, as much as
// anyone wants. They are filled: little hearts rise over the rows. "Gather the pieces left over, so that nothing
// is lost" — the disciples go through the grass with baskets, and twelve baskets stand full in a row.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { hillSet, meadowRows, GOLDEN, SPRING, LOOK, TW, folk, basket, barleyLoaf, fishCut, crumb, heart, spark, speech, labelTag, headAt, hand, kf, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'j6-thanks',
  beats: [
    { v: 11, text: 'Jezus więc wziął chleby i odmówiwszy dziękczynienie, rozdał siedzącym;' },
    { v: 11, cont: true, text: 'podobnie uczynił z rybami, rozdając tyle, ile kto chciał.' },
    { v: 12, text: 'A gdy się nasycili,' },
    { v: 12, cont: true, text: 'rzekł do uczniów: «Zbierzcie pozostałe ułomki, aby nic nie zginęło».' },
    { v: 13 },
  ],
  cam: { x: [-30, 30], y: [-30, 60], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    const H = hillSet(S, { skyCols: SPRING });
    const { sfn, gfn } = H;
    const heaven = H.hangL.add(`<g>${rays(c, { n: 14, r0: 10, r1: 800, spread: 0.035, color: '#fff3cf' })}</g>`);
    const warm = S.layer({ par: 0, sh: 1, flat: true });
    warm.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#e79a5f"/>`);

    const M = meadowRows(S, sfn);
    const ROWS = M.rows;
    // crumbs left in the grass (after the meal)
    const leftL = S.layer({ par: 0.32, sh: 2 });
    let cd = '';
    for (let i = 0; i < 90; i++) { const x = c.rr(250, 1400); cd += c.cut(c.blob(x, sfn(x) + c.rr(20, 96), c.rr(3, 5), c.rr(2, 3.4), 7, 0.25), 0.2, 2); }
    const leftovers = leftL.add(`<g><path d="${cd}" fill="${C.wheat2}"/></g>`);
    const joys = ROWS.filter((r, i) => i % 2 === 0).map((r, i) => ({ r, i, el: leftL.add(`<g>${i % 3 ? spark(c, 8) : heart(c, 8)}</g>`) }));

    /* the near people, the boy, the disciples, Jesus */
    const L = S.layer({ par: 0.5, sh: 5 });
    const NEAR = [[520, 0], [600, 1], [1010, 2], [1090, 3], [1170, 4]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...folk(c, i % 2 === 0), pose: 'sit' }))), piece: L.add(`<g>${i % 2 ? barleyLoaf(c, 10) : crumb(c, 9)}</g>`) }));
    const boy = S.puppet(L.add(person(c, { ...LOOK.boy, pose: 'sit' })));
    const boyBread = L.add(`<g>${barleyLoaf(c, 9)}</g>`);
    const DIS = [
      { o: TW.peter, side: -1, row: 2 }, { o: TW.andrew, side: 1, row: 7 }, { o: TW.john, side: -1, row: 14 }, { o: LOOK.philip, side: 1, row: 20 },
    ].map((d, i) => {
      const el = L.add(person(c, { ...d.o, holdF: `<g transform="translate(-36 13) rotate(70)">${basket(c, { w: 38, h: 22 })}</g>` }));
      return { ...d, i, p: S.puppet(el), seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const held = L.add(`<g>${[-26, -13, 0, 13, 26].map((x, i) => `<g transform="translate(${x} ${-Math.abs(x) * 0.3 - (i % 2) * 5})">${barleyLoaf(c, 12)}</g>`).join('')}</g>`);
    const heldFish = L.add(`<g><g transform="translate(-12 -4) rotate(-10) scale(.8)">${fishCut(c, { color: C.teal2 })}</g><g transform="translate(16 -8) rotate(12) scale(.8)">${fishCut(c)}</g></g>`);
    const glowEl = L.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);
    const BASK = Array.from({ length: 12 }, (_, i) => {
      const side = i < 6 ? -1 : 1, k = i % 6;
      // phone: the twelve baskets stand closer together, all twelve inside the screen
      const x = S.portrait ? (side < 0 ? 480 + k * 38 : 930 + k * 38) : side < 0 ? 440 + k * 46 : 930 + k * 46;
      return { i, x, y: gfn(x) + 40 + (k % 2) * 6, e: L.add(`<g>${basket(c, { w: 42, h: 26 })}</g>`), f: L.add(`<g>${basket(c, { w: 42, h: 26, full: true })}</g>`) };
    });

    /* flying bread and fish, the word, the count */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const bits = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${i % 3 ? crumb(c, 9) : barleyLoaf(c, 9)}</g>`), row: ROWS[(i * 9) % ROWS.length] }));
    const fishes = Array.from({ length: 7 }, (_, i) => ({ i, el: fx.add(`<g>${fishCut(c, { color: i % 2 ? C.lake3 : C.teal2, r: 0.55 })}</g>`), row: ROWS[(i * 11 + 2) % ROWS.length] }));
    const gather = fx.add(`<g>${speech(c, `<g transform="translate(-14 8)">${basket(c, { w: 30, h: 18 })}</g><g transform="translate(14 -4)">${crumb(c, 7)}</g><g transform="translate(20 8)">${crumb(c, 6)}</g>`, { w: 70, h: 52 })}</g>`);
    const pick = Array.from({ length: 14 }, (_, i) => ({ i, el: fx.add(`<g>${crumb(c, 6)}</g>`), sx: c.rr(300, 1300) }));
    const t12 = hanging(fx, `<g transform="scale(1.3)">${labelTag(tr('12 koszów', '12 baskets'), 22)}</g>`, { x: 0, y: 0, len: 800 });

    const JY = gfn(JX) + 12;
    return (t, time) => {
      const T = time;
      const gold = es(t, 0, 5);
      H.sk.blend(SPRING, GOLDEN, gold * 0.7);
      warm.fade(gold * 0.08);
      H.update(T, { sunY: 150 + gold * 60 });

      /* v11a — takes the loaves, gives thanks, hands them out */
      const lift = es(t, 0.05, 0.3) * (1 - es(t, 0.6, 0.75));
      const thanks = bump(t, 0.2, 0.75);
      const give = es(t, 0.7, 0.85) * (1 - es(t, 1.9, 2.05));
      const fishK = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.05));
      const speak = bump(t, 3.05, 3.9);
      const aB = 10 + lift * 150 + give * (40 + Math.sin(t * 14 + 2) * 20) + speak * 20;
      jesus.set({ x: JX, y: JY, s: 1.06, armF: 30 + lift * 70 + give * (60 + Math.sin(t * 14) * 20) + speak * 50, armB: aB, head: -lift * 22 + give * 3, blink: blinkAt(T, 1) });
      const [lhx, lhy] = hand(JX, JY, 1.06, false, 10 + lift * 150);
      pose(held, { x: lhx - 12, y: lhy - 6, s: 1.1, o: seg(t, 0, 0.05) * (1 - es(t, 0.7, 0.8)) });
      const [fhx, fhy] = hand(JX, JY, 1.06, false, 30 + 60 + 20);
      pose(heldFish, { x: fhx + 6, y: fhy - 10, s: 1, o: fishK });
      pose(glowEl, { x: JX + 10, y: JY - 250, s: 0.4 + thanks * 1.2, o: thanks * 0.9 });
      pose(heaven, { x: JX, y: -200, r: T * 2, o: thanks * 0.5 });
      bits.forEach((b) => {
        const on = es(t, 0.8, 0.95) * (1 - es(t, 1.9, 2.0));
        const k = (T * 0.45 + b.i / 10) % 1;
        const u = ((b.i / 10) + t * 2.2) % 1;
        const tx = b.row.x, ty = b.row.y - 30 * b.row.s * 2;
        pose(b.el, { x: lerp(JX + 30, tx, u), y: lerp(JY - 150, ty, u) - Math.sin(u * PI) * 140, r: u * 260, s: 0.9 - u * 0.3, o: on * Math.min(1, u * 8) * (1 - Math.max(0, u - 0.85) * 6) });
      });
      /* v11b — likewise the fish, as much as they wanted */
      fishes.forEach((f) => {
        const on = es(t, 1.1, 1.25) * (1 - es(t, 1.95, 2.05));
        const k = (T * 0.4 + f.i / 7) % 1;
        const u = ((f.i / 7) + t * 2.2) % 1;
        const tx = f.row.x, ty = f.row.y - 30 * f.row.s * 2;
        pose(f.el, { x: lerp(JX + 30, tx, u), y: lerp(JY - 160, ty, u) - Math.sin(u * PI) * 150, r: (tx > JX ? 1 : -1) * (-20 + u * 40), sx: tx > JX ? 1 : -1, o: on * Math.min(1, u * 8) * (1 - Math.max(0, u - 0.85) * 6) });
      });
      NEAR.forEach((m) => {
        const got = es(t, 0.9 + m.i * 0.06, 1.0 + m.i * 0.06);
        const more = bump(t, 1.35 + m.i * 0.05, 1.9);
        const eat = es(t, 2.05, 2.15) * (1 - es(t, 2.8, 2.95));
        const full = es(t, 2.4, 2.7);
        const chew = eat * (Math.sin(T * 4 + m.i) * 0.5 + 0.5);
        m.p.set({ x: m.x, y: gfn(m.x) + 26 + (m.i % 2) * 6, s: 0.86, flip: m.x > JX, armF: 20 + got * 60 + more * 70 + eat * (60 + chew * 30) - full * 40, armB: 10 + full * (m.i % 2 ? 0 : 20), head: -more * 8 - eat * 4 + full * 4, lean: -full * 4, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(m.x, gfn(m.x) + 26 + (m.i % 2) * 6, 0.86, m.x > JX, 20 + got * 60 + more * 70 + eat * (60 + chew * 30) - full * 40, 0, 62);
        pose(m.piece, { x: hx, y: hy - 6, s: 1 - es(t, 2.4, 2.8) * 0.6, o: got * (1 - es(t, 2.8, 3.0)) });
      });
      const bEat = es(t, 0.95, 1.1);
      boy.set({ x: JX - 110, y: gfn(JX - 110) + 22, s: 0.6, flip: false, armF: 20 + bEat * 90 + Math.sin(T * 3) * 10 * bEat * (1 - es(t, 2.8, 3.0)), armB: 20 + bump(t, 2.2, 2.9) * 100, head: -8 + bump(t, 2.2, 2.9) * 4, blink: blinkAt(T, 6) });
      const [bhx, bhy] = hand(JX - 110, gfn(JX - 110) + 22, 0.6, false, 20 + bEat * 90, 0, 62);
      pose(boyBread, { x: bhx + 2, y: bhy - 4, o: bEat * (1 - es(t, 2.8, 3.0)) });

      /* v12a — they are filled */
      joys.forEach((j) => {
        const k = bump(t, 2.1 + (j.i % 6) * 0.07, 2.95);
        pose(j.el, { x: j.r.x + Math.sin(T * 2 + j.i) * 8, y: j.r.y - 60 * j.r.s - k * 26, s: k * (0.8 + j.r.r * 0.2), o: k > 0.02 ? 1 : 0 });
      });
      pose(leftovers, { o: es(t, 2.6, 2.95) * (1 - es(t, 3.3, 4.2)) });

      /* v12b — "Gather the pieces left over, so that nothing is lost" */
      const [jhx, jhy] = headAt(JX, JY, 1.06, false);
      const gk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(gather, { x: jhx + 26, y: jhy - 18, s: gk, o: gk > 0.01 ? 1 : 0 });
      DIS.forEach((d) => {
        const r = ROWS[d.row];
        const go = es(t, 3.2 + d.i * 0.05, 3.55 + d.i * 0.05) * (1 - es(t, 4.4, 4.7));
        const x0 = JX + d.side * (150 + d.i * 40);
        const x = lerp(x0, r.x + d.side * 20, go * 0.7);
        const vis = seg(t, 3.1, 3.2) * (1 - seg(t, 4.8, 4.9));
        const walking = (t > 3.2 && t < 3.7) || (t > 4.4 && t < 4.75);
        const stoop = bump(t, 3.6, 4.35);
        d.p.set({ x, y: gfn(x) + 20 + (d.i % 2) * 6, s: 0.92, flip: walking ? (t < 4 ? d.side < 0 : d.side > 0) : d.side > 0, walk: walking ? x * 0.06 + d.i : undefined, armF: 70, armB: stoop * 60, lean: stoop * 14, o: vis, blink: blinkAt(T, d.seed) });
      });
      pick.forEach((p) => {
        const k = es(t, 3.6 + (p.i % 7) * 0.06, 3.75 + (p.i % 7) * 0.06);
        const d = DIS[p.i % 4];
        const x = lerp(p.sx, ROWS[d.row].x + d.side * 20, k);
        pose(p.el, { x, y: lerp(sfn(p.sx) + 70, gfn(x) - 60, k) - Math.sin(k * PI) * 40, r: k * 200, o: k > 0.02 && k < 0.98 ? 1 : 0 });
      });

      /* v13 — twelve baskets full of pieces */
      BASK.forEach((b) => {
        const k = es(t, 4.05 + b.i * 0.035, 4.2 + b.i * 0.035, ease.back);
        const full = es(t, 4.2 + b.i * 0.035, 4.3 + b.i * 0.035);
        pose(b.e, { x: b.x, y: b.y, s: k, o: k > 0.01 ? 1 - full : 0 });
        pose(b.f, { x: b.x, y: b.y, s: k, o: k > 0.01 ? full : 0 });
      });
      const k12 = es(t, 4.4, 4.62, ease.back);
      pose(t12, { x: JX, y: lerp(-500, 260, k12), r: Math.sin(T * 1.2) * 2.5, o: k12 > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.12], [0.7, 1.14], [1.0, 1.04], [2.0, 1.0], [2.5, 0.98], [3.1, 1.06], [4.0, 1.06], [4.6, 1.02]]);
      S.cam.y = kf(t, [[0, 40], [0.7, 30], [1.0, 20], [2.5, 0], [3.1, 40], [4.6, 50]]);
    };
  },
};
