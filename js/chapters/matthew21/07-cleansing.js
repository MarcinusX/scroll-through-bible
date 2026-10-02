// Mt 21,12 — the market in the Temple court. Jesus comes in and drives out all who sell and buy; He overturns the
// money changers' tables (the coins fly and roll across the paving) and the seats of the dove sellers (the cages
// tumble open and the doves fly free).
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, swing } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { templeCourt, courtFront, changerTable, coinStack, coin, balance, cage, smallDove, flapDove, bench, lamb, townsfolk, basketProp, jarProp, dust, DAY, PI } from './lib.js';

const FLOOR = 676;
const TABLES = [{ x: 930, x0: 930, w: 150 }, { x: 1120, x0: 1120, xp: 1010, w: 150 }];   // xp: on a phone the far table stands in from the edge
const BENCH = { x: 560, w: 170 };

/** a striped market awning on two poles (origin: floor centre) */
function stall(c, w = 220, h = 250, col = C.terracotta) {
  const s = sheet();
  s.p(c.ribbon([[-w / 2 + 8, 0], [-w / 2 + 8, -h]], 6) + c.ribbon([[w / 2 - 8, 0], [w / 2 - 8, -h]], 6), C.wood2);
  const pts = [[-w / 2 - 10, -h + 6], [-w / 2 + 10, -h - 30], [w / 2 - 10, -h - 30], [w / 2 + 10, -h + 6]];
  for (let x = w / 2 + 10; x > -w / 2 - 10; x -= 24) pts.push(...c.arc(x - 12, -h + 6, 12, 8, 0, PI, 4));
  s.p(c.cut(pts, 0.5, 6), C.cream);
  let st = '';
  for (let x = -w / 2 - 4; x < w / 2 + 10; x += 48) st += c.cut([[x, -h + 10], [x + 8, -h - 28], [x + 30, -h - 28], [x + 26, -h + 12]], 0.4, 5);
  s.x(st, col, 'opacity=".85"');
  return s.out();
}

export default {
  id: 'mt21-cleansing',
  beats: [
    { v: 12, text: 'A Jezus wszedł do świątyni i wyrzucił wszystkich sprzedających i kupujących w świątyni;' },
    { v: 12, cont: true, text: 'powywracał stoły zmieniających pieniądze oraz ławki tych, którzy sprzedawali gołębie.' },
  ],
  cam: { x: [-80, 120], y: [-50, 40], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const { sunEl, cl1 } = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1220, 140] });

    /* ---------- stalls under awnings (back) ---------- */
    const stallL = S.layer({ par: 0.42, sh: 4 });
    stallL.add(`<g transform="translate(360 ${FLOOR - 24})">${stall(c, 220, 230, C.terracotta)}</g><g transform="translate(1290 ${FLOOR - 24})">${stall(c, 240, 240, C.teal2)}</g>`);
    stallL.add(`<g transform="translate(330 ${FLOOR - 26})">${basketProp(c, 54)}</g><g transform="translate(392 ${FLOOR - 26})">${jarProp(c, C.clay)}</g><g transform="translate(1260 ${FLOOR - 26})">${basketProp(c, 56)}</g><g transform="translate(1330 ${FLOOR - 30})">${jarProp(c)}</g>`);

    /* ---------- sellers and buyers ---------- */
    const crowdL = S.layer({ par: 0.46, sh: 4 });
    const TR = [
      [300, -20, false, -1], [410, -22, true, -1], [470, -8, false, -1], [680, -14, true, -1],
      [1010, -18, false, 1], [1240, -20, true, 1], [1350, -16, false, 1], [1420, -8, true, 1],
    ].map(([x, dy, flip, dir], i) => ({ x, y: FLOOR + dy, flip, dir, i, seed: c.rr(0, 9), p: S.puppet(crowdL.add(person(c, townsfolk(c, { holdF: i % 3 === 0 ? `<g transform="translate(0 10) scale(.7)">${basketProp(c)}</g>` : '' })))) }));
    const lambs = [[1180, FLOOR + 30, 1], [1250, FLOOR + 36, -1]].map(([x, y, d], i) => ({ x, y, d, i, el: crowdL.add(`<g>${lamb(c)}</g>`) }));

    /* ---------- the money changers' tables and the dove benches ---------- */
    TABLES.forEach((tb) => { tb.x = S.portrait && tb.xp ? tb.xp : tb.x0; });
    const mkL = S.layer({ par: 0.5, sh: 5 });
    const changers = TABLES.map((tb, i) => ({ ...tb, i, seed: c.rr(0, 9), p: S.puppet(mkL.add(person(c, townsfolk(c, { man: true, robe: i ? C.plumRobe : C.ochreRobe, mantle: i ? C.ochre : C.plumRobe, belt: C.sun })))) }));
    const dover = { seed: c.rr(0, 9), p: S.puppet(mkL.add(person(c, townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather })))) };
    TABLES.forEach((tb) => {
      tb.el = mkL.add(`<g>${changerTable(c, tb.w)}<g transform="translate(-44 -60)">${coinStack(c, 4, 9)}</g><g transform="translate(-18 -60)">${coinStack(c, 6, 9)}</g><g transform="translate(36 -60)">${balance(c)}</g></g>`);
      tb.coins = Array.from({ length: 9 }, (_, k) => ({ k, el: mkL.add(`<g>${coin(c, 7)}</g>`), x0: tb.x - 50 + k * 10, y0: FLOOR - 66 - (k % 3) * 4, x1: tb.x - 120 + k * 34 + c.rr(-20, 20), y1: FLOOR + c.rr(4, 40), h: c.rr(60, 140), roll: c.rr(20, 70), d: k * 0.012 }));
    });
    BENCH.el = mkL.add(`<g>${bench(c, BENCH.w, 38)}</g>`);
    const doves = Array.from({ length: 6 }, (_, i) => ({ i, el: mkL.add(`<g>${smallDove(c)}</g>`), cage: i % 2, x1: 300 + i * 190 + c.rr(-40, 40), y1: c.rr(-80, 120), ph: c.rr(0, 6) }));
    const cages = [-48, 30].map((dx, i) => ({ dx, i, el: mkL.add(`<g>${cage(c, 64, 56)}</g>`) }));
    const dustL = [0, 1, 2].map(() => mkL.add(`<g>${dust(c, 30, mix(C.stone, C.sand, 0.4))}</g>`));

    /* ---------- Jesus ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v12a — He comes in from the left and drives out all who sell and buy */
      const inK = es(t, 0.0, 0.3, ease.out);
      const drive = es(t, 0.35, 0.8);
      /* v12b — the tables go over, then the dove sellers' seats */
      const flipT = TABLES.map((_, i) => es(t, 1.04 + i * 0.14, 1.24 + i * 0.14, ease.in));
      const flipB = es(t, 1.42, 1.58, ease.in);
      const jx = t < 1 ? lerp(240, 780, inK) + drive * 60 : t < 1.38 ? lerp(840, 870, es(t, 1.0, 1.15)) + es(t, 1.12, 1.3) * 60 : lerp(930, 700, es(t, 1.32, 1.44));
      const jflip = t > 1.32;
      const moving_ = (inK > 0 && inK < 1) || (t > 1.0 && t < 1.3) || (t > 1.32 && t < 1.44);
      const sweep = bump(t, 0.38, 0.9);
      const push = Math.max(bump(t, 1.0, 1.26), bump(t, 1.14, 1.4), bump(t, 1.38, 1.6));
      jesus.set({
        x: jx, y: FLOOR, s: 1.04, flip: jflip, walk: moving_ ? jx * 0.05 : undefined,
        armF: sweep * (70 + Math.sin(t * 30) * 20) + push * 100 + es(t, 1.7, 1.85) * 30, armB: sweep * 60 + push * 40, lean: push * 8 * (jflip ? -1 : 1), blink: blinkAt(T),
      });

      // sellers and buyers bustle, then are driven out to both sides
      TR.forEach((m) => {
        const go = seg(t, 0.32 + m.i * 0.015, 1.0);
        const x = m.x + m.dir * go * 380;
        const haggle = 1 - seg(t, 0.3, 0.36);
        m.p.set({ x, y: m.y, s: 0.92, flip: go > 0.02 ? m.dir < 0 : m.flip, walk: go > 0 && go < 1 ? x * 0.08 : undefined, armF: haggle * (m.i % 2 ? 30 + bump(t, 0.05 + m.i * 0.02, 0.3 + m.i * 0.02) * 50 : 20) + (go > 0 ? 50 : 0), armB: go > 0 ? 150 : 0, head: haggle * (m.i % 3 ? 6 : -4) - (go > 0 ? 10 : 0), lean: (go > 0 ? 12 : 0) * m.dir, blink: blinkAt(T, m.seed), o: 1 - seg(t, 0.95, 1.0) });
      });
      lambs.forEach((l) => { const go = es(t, 0.5 + l.i * 0.06, 0.95, ease.in); pose(l.el, { x: l.x + go * 620, y: l.y - Math.abs(Math.sin(t * 60)) * 6 * (go > 0 && go < 1 ? 1 : 0), sx: l.d, s: 0.8, o: 1 - seg(t, 0.94, 0.99) }); });

      // the tables go over; coins fly and roll across the paving
      TABLES.forEach((tb, i) => {
        const f = flipT[i];
        pose(tb.el, { x: tb.x + tb.w / 2 + f * 30, y: FLOOR - 4 + f * 4, r: f * 96, ox: tb.w / 2, oy: 0 });
        const ch = changers[i];
        const flee = es(t, 1.1 + i * 0.14, 1.5 + i * 0.12, ease.in);
        const cx = tb.x + 30 + flee * 520;
        const shock = bump(t, 1.04 + i * 0.14, 1.34 + i * 0.14);
        ch.p.set({ x: cx, y: FLOOR - 26, s: 0.9, flip: flee < 0.05, walk: flee > 0 && flee < 1 ? cx * 0.08 : undefined, armB: shock * 150 + flee * 60, armF: 40 + shock * 80, head: -shock * 10, blink: blinkAt(T, ch.seed), o: 1 - seg(t, 1.55 + i * 0.08, 1.65 + i * 0.08) });
        tb.coins.forEach((co) => {
          const k = seg(t, 1.1 + i * 0.14 + co.d, 1.32 + i * 0.14 + co.d);
          const r = seg(t, 1.3 + i * 0.14 + co.d, 1.62 + i * 0.14);
          const x = lerp(co.x0, co.x1, k) + ease.out(r) * co.roll;
          const y = lerp(co.y0, co.y1, k) - Math.sin(k * PI) * co.h;
          pose(co.el, { x, y, r: k * 540 + r * 300, sx: k > 0 ? 0.4 + Math.abs(Math.cos(k * 9 + r * 6)) * 0.6 : 1, o: k > 0 ? 1 : 0 });
        });
      });
      dustL.forEach((d, i) => {
        const at = i < 2 ? 1.14 + i * 0.14 : 1.5;
        const k = seg(t, at, at + 0.26);
        pose(d, { x: i < 2 ? TABLES[i].x + 70 : BENCH.x - 20, y: FLOOR - 20 - k * 30, s: 0.5 + k * 1.4, o: bump(t, at, at + 0.26) * 0.8 });
      });

      // the dove seller's seat goes over, the cages tumble and spring open, the doves fly free
      pose(BENCH.el, { x: BENCH.x - BENCH.w / 2 - flipB * 20, y: FLOOR - 4, r: -flipB * 94, ox: -BENCH.w / 2, oy: 0 });
      cages.forEach((cg) => {
        const fall = es(t, 1.46 + cg.i * 0.03, 1.62 + cg.i * 0.03, ease.in);
        pose(cg.el, { x: BENCH.x + cg.dx - fall * (50 + cg.i * 40), y: FLOOR - 70 + fall * 58, r: -fall * (70 + cg.i * 40), ox: 0, oy: -28 });
      });
      const flee = es(t, 1.4, 1.75, ease.in);
      const dx = BENCH.x - 70 - flee * 520;
      dover.p.set({ x: dx, y: FLOOR - 10, s: 0.92, flip: flee > 0.05 || t < 1.4, walk: flee > 0 && flee < 1 ? dx * 0.08 : undefined, armB: bump(t, 1.38, 1.62) * 150, armF: 40 + bump(t, 1.38, 1.62) * 60, blink: blinkAt(T, dover.seed), o: 1 - seg(t, 1.72, 1.8) });
      doves.forEach((dv) => {
        const k = es(t, 1.55 + dv.i * 0.03, 1.9 + dv.i * 0.015, ease.in);
        const sx = BENCH.x + cages[dv.cage].dx + (dv.i % 3 - 1) * 10, sy = FLOOR - 50 - (dv.i % 3) * 6;
        const x = lerp(sx, dv.x1, k), y = lerp(sy, dv.y1, k) - Math.sin(k * PI) * 80;
        const flying = k > 0;
        pose(dv.el, { x, y, s: 0.8 + k * 0.3, sx: dv.x1 < sx ? -1 : 1, r: flying ? -16 : 0, o: 1 });
        if (flying) flapDove(dv.el, T + dv.ph + t * 3, 34, 12, -10); else flapDove(dv.el, 0, 0, 0, 0);
      });

      S.cam.x = -40 + inK * 40 + es(t, 1.0, 1.25) * 90 - es(t, 1.3, 1.5) * 150 + (S.portrait ? es(t, 1.3, 1.5) * 45 : 0);   // phone: the overturned far table stays clear of the thread
      S.cam.z = 1.02 + es(t, 1.0, 1.2) * 0.06 - es(t, 1.4, 1.6) * 0.05;
      if (S.portrait) S.cam.z -= es(t, 1.4, 1.6) * 0.07;   // phone: a little wider, so the wrecked bench and the far table both stay in
      S.cam.y = es(t, 1.5, 1.7) * -30;
    };
  },
};
