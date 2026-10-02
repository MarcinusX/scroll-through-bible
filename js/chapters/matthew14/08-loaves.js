// Mt 14,19–21 — the crowd sits down in rows on the green grass. Jesus takes the five loaves and two fish, looks up
// to heaven (a warm light opens) and blesses; He breaks the bread and gives it to the disciples, and they carry it in
// baskets to the rows — pieces fly to every row. All eat and are filled: hearts rise. Twelve baskets of pieces
// stand in a row; the camera draws back over the whole hillside: about five thousand men, besides women and children.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hillSet, meadowRows, slopeCrowd, folk, group, GOLDEN, TW, L6, kf, headAt, hand, loaf, fishCut, basket, crumb, heart, spark, labelTag, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'mt14-loaves',
  beats: [
    { v: 19, text: 'Kazał tłumom usiąść na trawie,' },
    { v: 19, cont: true, text: 'następnie wziąwszy pięć chlebów i dwie ryby, spojrzał w niebo, odmówił błogosławieństwo' },
    { v: 19, cont: true, text: 'i połamawszy chleby dał je uczniom, uczniowie zaś tłumom.' },
    { v: 20, text: 'Jedli wszyscy do sytości,' },
    { v: 20, cont: true, text: 'i zebrano z tego, co pozostało, dwanaście pełnych koszy ułomków.' },
    { v: 21 },
  ],
  cam: { x: [-30, 30], y: [-40, 70], z: [0.92, 1.16] },
  build(S) {
    const c = S.c;
    const H = hillSet(S, { skyCols: GOLDEN, sunAt: [1200, 360] });
    const { sfn, gfn } = H;
    const heaven = H.hangL.add(`<g>${rays(c, { n: 14, r0: 10, r1: 800, spread: 0.035, color: '#fff3cf' })}</g>`);
    const warm = S.layer({ par: 0, sh: 1, flat: true });
    warm.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#e79a5f"/>`);
    // far away on the hills: more and more people (seen when the camera draws back)
    const farPeople = [];
    for (let i = 0; i < 46; i++) { const x = c.rr(-300, 1900); farPeople.push({ x, y: 520 + c.rr(-6, 30), s: 0.19, flip: x > JX, o: { ...folk(c), pose: 'sit' } }); }
    const farCrowd = H.mid.sprite(group(c, farPeople), 0, 0);

    /* the standing crowd, then the seated rows */
    const standL = S.layer({ par: 0.3, sh: 3 });
    const GR = slopeCrowd(S, standL, sfn, { n: 14, x0: 200, step: 92 });
    const M = meadowRows(S, sfn);
    const ROWS = M.rows;
    const joyL = S.layer({ par: 0.32, sh: 3 });
    const joys = ROWS.filter((r, i) => i % 2 === 0).map((r, i) => ({ r, i, el: joyL.add(`<g>${i % 3 ? spark(c, 8) : heart(c, 8)}</g>`) }));

    /* the near people, the disciples, Jesus, the baskets */
    const L = S.layer({ par: 0.5, sh: 5 });
    const NEAR = (S.portrait ? [[525, 0, true], [600, 1, false], [975, 2, true], [1045, 3, false], [1005, 4, null]] : [[500, 0, true], [580, 1, false], [1020, 2, true], [1100, 3, false], [1150, 4, null]]).map(   // phone: the near sitters off the edge and the thread
      ([x, i, m]) => ({ x, i, seed: c.rr(0, 9), child: m === null, p: S.puppet(L.add(person(c, { ...(m === null ? { ...folk(c, true), beard: 'none', hair: C.hair2 } : folk(c, m)), pose: 'sit' }))), piece: L.add(`<g>${crumb(c, 9)}</g>`) }));
    const DIS = [
      { o: TW.peter, side: -1, row: 2 }, { o: TW.andrew, side: 1, row: 8 }, { o: TW.john, side: -1, row: 14 }, { o: L6.philip, side: 1, row: 20 },
    ].map((d, i) => {
      const el = L.add(person(c, { ...d.o, holdF: `<g transform="translate(-36 13) rotate(70)">${basket(c, { w: 40, h: 24, full: true })}</g>` }));
      return { ...d, i, p: S.puppet(el), hold: el.querySelector('.hold'), seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const held = L.add(`<g>${[-30, -15, 0, 15, 30].map((x, i) => `<g transform="translate(${x} ${-Math.abs(x) * 0.3 - (i % 2) * 6})">${loaf(c, 13)}</g>`).join('')}<g transform="translate(-14 -30) rotate(-12) scale(.8)">${fishCut(c, { color: C.teal2 })}</g><g transform="translate(18 -32) rotate(10) scale(.8)">${fishCut(c)}</g></g>`);
    const halves = [-1, 1].map((sd) => L.add(`<g>${loaf(c, 15)}</g>`));
    const glowEl = L.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);
    const BASK = Array.from({ length: 12 }, (_, i) => {
      const side = i < 6 ? -1 : 1, k = i % 6;
      const x = S.portrait ? (side < 0 ? 480 + k * 38 : 930 + k * 38) : side < 0 ? 430 + k * 46 : 940 + k * 46;   // phone: both rows of baskets inside the screen
      return { i, x, y: gfn(x) + 34 + (k % 2) * 6, el: L.add(`<g>${basket(c, { w: 42, h: 26, full: true })}</g>`) };
    });

    /* flying bread and fish, the count */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const bits = Array.from({ length: 12 }, (_, i) => ({ i, el: fx.add(`<g>${i % 3 ? crumb(c, 9) : loaf(c, 10)}</g>`), row: ROWS[(i * 7) % ROWS.length] }));
    const fishes = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${fishCut(c, { color: i % 2 ? C.lake3 : C.teal2, r: 0.55 })}</g>`), row: ROWS[(i * 11 + 2) % ROWS.length] }));
    const t12 = hanging(fx, `<g transform="scale(1.2)">${labelTag(tr('12 koszów', '12 baskets'), 22)}</g>`, { x: 0, y: 0, len: 800 });
    const t5000 = hanging(fx, `<g transform="scale(1.3)">${labelTag(tr('ok. 5000 mężczyzn', 'about 5000 men'), 24)}</g><g transform="translate(0 50)">${labelTag(tr('nie licząc kobiet i dzieci', 'besides women and children'), 18)}</g>`, { x: 0, y: 0, len: 800 });

    const JY = gfn(JX) + 12;
    return (t, time) => {
      const T = time;
      const gold = es(t, 0, 6);
      warm.fade(0.08 + gold * 0.08);
      H.update(T, { sunY: 360 + gold * 40 });

      /* v19a — sit down on the grass */
      GR.forEach((g) => {
        const k = es(t, 0.2 + (g.i % 5) * 0.06, 0.55 + (g.i % 5) * 0.06);
        g.sp.set({ x: g.x, y: g.y + k * 10, o: 1 - k });
      });
      ROWS.forEach((r) => fade(r.el, es(t, 0.3 + (r.i % 7) * 0.04, 0.6 + (r.i % 7) * 0.04)));
      const wave = bump(t, 0.05, 0.9);

      /* v19b — takes the loaves and fish, looks up to heaven, blesses */
      const lift = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      const bless = bump(t, 1.2, 1.98);
      /* v19c — breaks and gives to the disciples; the disciples to the crowds */
      const brk = bump(t, 2.02, 2.45);
      const give = es(t, 2.35, 2.5) * (1 - es(t, 2.95, 3.1));
      jesus.set({ x: JX, y: JY, s: 1.06, armF: 20 + wave * 80 + lift * 70 + brk * 70 + give * 60, armB: 10 + wave * 50 + lift * 150 + brk * 70 + give * 20, head: -lift * 22 + give * 3, blink: blinkAt(T, 1) });
      const [lhx, lhy] = hand(JX, JY, 1.06, false, 10 + lift * 150);
      pose(held, { x: lerp(JX + 50, lhx - 12, lift), y: lerp(JY - 110, lhy - 6, lift), s: 1.1, o: es(t, 0.95, 1.05) * (1 - es(t, 2.0, 2.05)) });
      halves.forEach((h, i) => pose(h, { x: JX + 30 + (i ? 1 : -1) * brk * 30, y: JY - 150, r: (i ? 1 : -1) * brk * 20, o: seg(t, 2.0, 2.05) * (1 - es(t, 2.4, 2.5)) }));
      pose(glowEl, { x: JX + 10, y: JY - 250, s: 0.4 + bless * 1.2, o: bless * 0.9 });
      pose(heaven, { x: JX, y: -200, r: T * 2, o: bless * 0.5 });
      DIS.forEach((d) => {
        const r = ROWS[d.row];
        const go = es(t, 2.4 + d.i * 0.05, 2.75 + d.i * 0.05) * (1 - es(t, 4.1, 4.4));
        const x0 = JX + d.side * (140 + d.i * 34);
        const x = lerp(x0, r.x + d.side * 20, go * 0.7);
        const walking = (t > 2.4 && t < 2.9) || (t > 4.1 && t < 4.45);
        d.p.set({ x, y: gfn(x) + 20 + (d.i % 2) * 6, s: 0.92, flip: walking ? (t < 3.5 ? d.side < 0 : d.side > 0) : d.side > 0, walk: walking ? x * 0.06 + d.i : undefined, armF: 70, armB: bump(t, 2.8, 3.1) * 60, o: 1 - es(t, 4.4, 4.5) * 0, blink: blinkAt(T, d.seed) });
        if (d.hold) d.hold.setAttribute('opacity', String(es(t, 2.3, 2.4) * (1 - es(t, 4.05, 4.15))));
      });
      bits.forEach((b) => {
        const on = es(t, 2.5, 2.6) * (1 - es(t, 3.9, 4.0));
        const u = ((b.i / 12) + t * 2.2) % 1;
        const tx = b.row.x, ty = b.row.y - 30 * b.row.s * 2;
        pose(b.el, { x: lerp(JX + 30, tx, u), y: lerp(JY - 150, ty, u) - Math.sin(u * PI) * 140, r: u * 260, s: 0.9 - u * 0.3, o: on * Math.min(1, u * 8) * (1 - Math.max(0, u - 0.85) * 6) });
      });
      fishes.forEach((f) => {
        const on = es(t, 2.6, 2.7) * (1 - es(t, 3.9, 4.0));
        const u = ((f.i / 6) + 0.08 + t * 2.2) % 1;
        const tx = f.row.x, ty = f.row.y - 30 * f.row.s * 2;
        pose(f.el, { x: lerp(JX + 30, tx, u), y: lerp(JY - 160, ty, u) - Math.sin(u * PI) * 150, r: (tx > JX ? 1 : -1) * (-20 + u * 40), sx: tx > JX ? 1 : -1, o: on * Math.min(1, u * 8) * (1 - Math.max(0, u - 0.85) * 6) });
      });

      /* v20a — they all eat and are filled */
      NEAR.forEach((m) => {
        const got = es(t, 2.6 + m.i * 0.06, 2.7 + m.i * 0.06);
        const eat = es(t, 3.05, 3.15) * (1 - es(t, 3.8, 3.95));
        const chew = eat * (Math.sin(T * 4 + m.i) * 0.5 + 0.5);
        const full = es(t, 3.5, 3.8);
        const s = m.child ? 0.6 : 0.86;
        const y = gfn(m.x) + 26 + (m.i % 2) * 6;
        const aF = 20 + got * 60 + eat * (60 + chew * 30) - full * 40;
        m.p.set({ x: m.x, y, s, flip: m.x > JX, armF: aF, armB: 10 + full * 20, head: -eat * 4 + full * 4, lean: -full * 4, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(m.x, y, s, m.x > JX, aF, 0, 62);
        pose(m.piece, { x: hx, y: hy - 6, s: s / 0.86 * (1 - es(t, 3.4, 3.8) * 0.6), o: got * (1 - es(t, 3.8, 4.0)) });
      });
      joys.forEach((j) => {
        const k = bump(t, 3.1 + (j.i % 6) * 0.07, 3.98);
        pose(j.el, { x: j.r.x + Math.sin(T * 2 + j.i) * 8, y: j.r.y - 60 * j.r.s - k * 26, s: k * (0.8 + j.r.r * 0.2), o: k > 0.02 ? 1 : 0 });
      });

      /* v20b — twelve baskets full of pieces */
      BASK.forEach((b) => {
        const k = es(t, 4.1 + b.i * 0.04, 4.28 + b.i * 0.04, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const k12 = es(t, 4.45, 4.7, ease.back) * (1 - es(t, 5.0, 5.2));
      pose(t12, { x: JX, y: lerp(-500, 250, k12), r: Math.sin(T * 1.2) * 2.5, o: k12 > 0.01 ? 1 : 0 });

      /* v21 — about five thousand men, besides women and children */
      const k5 = es(t, 5.1, 5.4, ease.back);
      pose(t5000, { x: JX, y: lerp(-500, 200, k5), r: Math.sin(T * 1.1) * 2, o: k5 > 0.01 ? 1 : 0 });
      farCrowd.set({ x: 0, y: 0, o: es(t, 5.05, 5.4) });

      S.cam.z = kf(t, [[0, 1.02], [0.9, 1.0], [1.2, 1.12], [2.0, 1.1], [2.4, 1.02], [3.0, 1.0], [4.0, 1.04], [5.0, 1.04], [5.5, 0.93]]);
      S.cam.y = kf(t, [[0, 20], [1.2, 40], [2.4, 20], [4.0, 40], [5.0, 40], [5.5, -30]]);
    };
  },
};
