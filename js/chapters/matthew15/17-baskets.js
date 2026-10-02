// Mt 15,37–38 — the whole slope sits eating; the people near us break their bread, and little hearts and sparks rise
// over the rows: they are filled. The disciples go through the grass picking up the broken pieces, and seven baskets
// stand full in a row, counted one to seven. "Those who ate were four thousand men" — the camera draws back over the
// whole mountainside and a big tag comes down; "besides women and children" — mothers with their little ones come
// forward at the front, and a second tag hangs beside the first.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hillSet, meadowRows, folk, crowdGroup, kid, womanOf, pose3, basket, crumb, heart, spark, tag, nameTag, loaf, hand, kf, moving, tr, PI } from './lib.js';

const JX = 800;
const BASKETS = [440, 515, 590, 665, 935, 1010, 1085];
const BASKETS_P = [486, 548, 610, 672, 928, 990, 1052];   // phone: all seven on screen

export default {
  id: 'mt15-baskets',
  beats: [
    { v: 37, text: 'Jedli wszyscy do sytości,' },
    { v: 37, cont: true, text: 'a pozostałych ułomków zebrano jeszcze siedem pełnych koszów.' },
    { v: 38 },
  ],
  cam: { x: [-30, 30], y: [-80, 50], z: [0.93, 1.1] },
  build(S) {
    const H = hillSet(S, { skyCols: ['#dcdcc8', '#f2e2c2', '#f4dcb6'], meadow: mix(C.hillNear, C.wheat, 0.25) });
    const c = S.c;
    const { sfn, gfn } = H;
    const M = meadowRows(S, sfn, { par: 0.3 });
    const ROWS = M.rows;
    const joyL = S.layer({ par: 0.32, sh: 2 });
    const joys = ROWS.filter((r, i) => i % 2 === 0).map((r, i) => ({ r, i, el: joyL.add(`<g>${i % 3 ? spark(c, 8) : heart(c, 8)}</g>`) }));
    let cd = '';
    for (let i = 0; i < 80; i++) { const x = c.rr(250, 1400); cd += c.cut(c.blob(x, sfn(x) + c.rr(20, 96), c.rr(3, 5), c.rr(2, 3.4), 7, 0.25), 0.2, 2); }
    const leftovers = joyL.add(`<g><path d="${cd}" fill="${C.wheat2}"/></g>`);

    /* ---------- the near people eating, the disciples, Jesus ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const JY = gfn(JX) + 4;
    const NEAR = (S.portrait ? [[360, 0], [522, 1], [1078, 2], [1235, 3]] : [[360, 0], [480, 1], [1120, 2], [1235, 3]]).map(   // phone: the near eaters not sliced by the edge or the thread
      ([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...folk(c, i % 2 === 0), pose: 'sit' }))), piece: L.add(`<g>${i % 2 ? loaf(c, 10) : crumb(c, 9)}</g>`) }));
    const DIS = [
      { o: CAST.peter, side: -1, row: 4 }, { o: CAST.andrew, side: 1, row: 9 }, { o: CAST.john, side: -1, row: 14 }, { o: CAST.james, side: 1, row: 20 },
    ].map((d, i) => ({ ...d, i, p: S.puppet(L.add(person(c, { ...d.o, holdF: `<g transform="translate(-36 13) rotate(70)">${basket(c, { w: 38, h: 22 })}</g>` }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const BK = (S.portrait ? BASKETS_P : BASKETS).map((x, i) => ({ i, x, el: L.add(`<g>${basket(c, { w: 56, h: 38, full: true })}</g>`), num: L.add(`<g>${tag(c, String(i + 1), { size: 20, w: 34 })}</g>`) }));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const pick = Array.from({ length: 14 }, (_, i) => ({ i, el: fx.add(`<g>${crumb(c, 6)}</g>`), sx: c.rr(300, 1300) }));

    /* ---------- women and children come forward ---------- */
    const famL = S.layer({ par: 0.55, sh: 5 });
    const fam = (S.portrait ? [[-1, 552], [1, 1040]] : [[-1, 360], [1, 1240]]).map(   // phone: the women and children step into the picture
      ([side, x], i) => {
      const cc = makeCutter('mt15-fam' + i);
      const m = pose3(cc, [
        { x: 0, y: 0, s: 0.86, flip: side > 0, armF: 30, armB: 40, o: womanOf(cc) },
        { x: side * -52, y: 10, s: 0.84, flip: side > 0, armF: 20, o: womanOf(cc) },
      ]) + `<g transform="translate(${side * 40} 12)">${kid(cc, i * 2, { pose: 'stand' }).replace('class="fig"', `class="fig" transform="scale(${side > 0 ? -0.6 : 0.6} 0.6)"`)}</g><g transform="translate(${side * -18} 16)">${kid(cc, i * 2 + 3, { pose: 'stand' }).replace('class="fig"', `class="fig" transform="scale(${side > 0 ? -0.52 : 0.52} 0.52)"`)}</g>`;
      return { side, x, sp: famL.sprite(m, x, gfn(x) + 34) };
    });

    /* ---------- the count ---------- */
    const hangT = S.layer({ par: 0.12, sh: 5 });
    const count = hanging(hangT, tag(c, tr('4000 mężczyzn', '4,000 men'), { size: 30, w: 250 }), { x: 680, y: 110, len: 900 });
    const plus = hanging(hangT, nameTag(c, tr(['nie licząc', 'kobiet i dzieci'], ['besides women', 'and children']), { size: 19 }), { x: 950, y: 110, len: 900 });

    return (t, time) => {
      const T = time;
      H.update(T);

      /* v37a — they all eat and are filled */
      NEAR.forEach((m) => {
        const eat = es(t, 0.05, 0.15) * (1 - es(t, 0.85, 1.0));
        const full = es(t, 0.5, 0.8);
        const chew = eat * (Math.sin(t * 24 + m.i) * 0.5 + 0.5);
        const aF = 20 + eat * (60 + chew * 30) - full * 20 + es(t, 2.1, 2.3) * 30;
        m.p.set({ x: m.x, y: gfn(m.x) + 26 + (m.i % 2) * 6, s: 0.86, flip: m.x > JX, armF: aF, armB: 10 + full * (m.i % 2 ? 0 : 20), head: -eat * 4 + full * 4 - es(t, 2.1, 2.3) * 8, lean: -full * 4, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(m.x, gfn(m.x) + 26 + (m.i % 2) * 6, 0.86, m.x > JX, aF, 0, 62);
        pose(m.piece, { x: hx, y: hy - 6, s: 1 - es(t, 0.5, 0.9) * 0.6, o: 1 - es(t, 0.9, 1.0) });
      });
      joys.forEach((j) => {
        const k = bump(t, 0.2 + (j.i % 6) * 0.06, 1.0);
        pose(j.el, { x: j.r.x + Math.sin(t * 9 + j.i) * 8, y: j.r.y - 60 * j.r.s - k * 26, s: k * (0.8 + j.r.r * 0.2), o: k > 0.02 ? 1 : 0 });
      });
      pose(leftovers, { o: es(t, 0.6, 0.95) * (1 - es(t, 1.2, 1.7)) });

      /* v37b — they gather the pieces: seven full baskets */
      jesus.set({ x: JX, y: JY, s: 1, armF: 16 + bump(t, 1.0, 1.4) * 60 + es(t, 2.05, 2.3) * 40, armB: 10 + es(t, 2.05, 2.3) * 110, head: -es(t, 2.05, 2.3) * 8, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const r = ROWS[d.row];
        const go = es(t, 1.05 + d.i * 0.04, 1.3 + d.i * 0.04) * (1 - es(t, 1.55, 1.75));
        const x0 = JX + d.side * (150 + d.i * 40);
        const x = lerp(x0, r.x + d.side * 20, go * 0.7);
        const walking = (t > 1.05 && t < 1.35) || (t > 1.55 && t < 1.78);
        const stoop = bump(t, 1.3, 1.6);
        d.p.set({ x, y: gfn(x) + 20 + (d.i % 2) * 6, s: 0.92, flip: walking ? (t < 1.45 ? d.side < 0 : d.side > 0) : d.side > 0, walk: walking ? x * 0.06 + d.i : undefined, armF: 70, armB: stoop * 60, lean: stoop * 14, o: 1, blink: blinkAt(T, d.seed) });
      });
      pick.forEach((p) => {
        const k = es(t, 1.3 + (p.i % 7) * 0.03, 1.45 + (p.i % 7) * 0.03);
        const d = DIS[p.i % 4];
        const x = lerp(p.sx, ROWS[d.row].x + d.side * 20, k);
        pose(p.el, { x, y: lerp(sfn(p.sx) + 70, gfn(x) - 60, k) - Math.sin(k * PI) * 40, r: k * 200, o: k > 0.02 && k < 0.98 ? 1 : 0 });
      });
      BK.forEach((b) => {
        const k = es(t, 1.45 + b.i * 0.035, 1.6 + b.i * 0.035, ease.back);
        const y = gfn(b.x) + 14;
        pose(b.el, { x: b.x, y, s: k, o: k > 0.02 ? 1 : 0 });
        const nk = es(t, 1.5 + b.i * 0.035, 1.64 + b.i * 0.035, ease.back) * (1 - es(t, 2.1, 2.3));
        pose(b.num, { x: b.x, y: y - 96, s: nk, o: nk > 0.02 ? 1 : 0 });
      });

      /* v38 — four thousand men, besides women and children */
      const on = es(t, 2.05, 2.4, ease.back);
      swing(count, 690, 110 - (1 - on) * 700, T, 1.2, 0.8, 3);
      const on2 = es(t, 2.35, 2.6, ease.back);
      swing(plus, 960, 118 - (1 - on2) * 700, T, 1.2, 0.8, 4);
      fam.forEach((f) => {
        const k = es(t, 2.3, 2.6, ease.out);
        f.sp.set({ x: f.x + f.side * (1 - k) * 260, y: f.sp.by, o: k });
      });

      S.cam.z = kf(t, [[0, 1.08], [0.95, 1.08], [1.3, 1.0], [2.0, 1.0], [2.4, 0.94]]);
      S.cam.y = kf(t, [[0, 40], [0.95, 40], [1.3, 20], [2.0, 20], [2.4, -30]]);
    };
  },
};
