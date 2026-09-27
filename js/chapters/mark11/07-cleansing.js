// Mk 11,15–16 — the market in the Temple court. Jesus drives out the sellers and buyers, overturns
// the money changers' tables (coins fly and roll) and the dove sellers' benches (the cages spring open
// and the doves fly free), and lets no one carry goods through the Temple.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, courtFront, changerTable, coinStack, coin, balance, cage, smallDove, flapDove, bench, lamb, townsfolk, basketProp, jarProp, TWELVE_O, headAt, dust } from './lib.js';

const PI = Math.PI;
const FLOOR = 676;
const TABLES = [{ x: 930, w: 150 }, { x: 1120, w: 150 }];
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
  id: 'm11-cleansing',
  beats: [
    { v: 15, text: 'I przyszedł do Jerozolimy.' },
    { v: 15, cont: true, text: 'Wszedłszy do świątyni, zaczął wyrzucać tych, którzy sprzedawali i kupowali w świątyni' },
    { v: 15, cont: true, text: 'powywracał stoły zmieniających pieniądze' },
    { v: 15, cont: true, text: 'i ławki tych, którzy sprzedawali gołębie,' },
    { v: 16 },
  ],
  cam: { x: [-80, 120], y: [-50, 40], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const SKY = ['#d0e2dd', '#f1e6c9', '#f8ebd3'];
    const { sk, sunEl, cl1 } = templeCourt(S, { skyCols: SKY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1220, 140] });

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
    const mkL = S.layer({ par: 0.5, sh: 5 });
    const changers = TABLES.map((tb, i) => ({ ...tb, i, seed: c.rr(0, 9), p: S.puppet(mkL.add(person(c, townsfolk(c, { man: true, robe: i ? C.plumRobe : C.ochreRobe, mantle: i ? C.ochre : C.plumRobe, belt: C.sun })))) }));
    const dover = { seed: c.rr(0, 9), p: S.puppet(mkL.add(person(c, townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather })))) };
    TABLES.forEach((tb) => {
      tb.el = mkL.add(`<g>${changerTable(c, tb.w)}<g transform="translate(-44 -60)">${coinStack(c, 4, 9)}</g><g transform="translate(-18 -60)">${coinStack(c, 6, 9)}</g><g transform="translate(36 -60)">${balance(c)}</g></g>`);
      tb.coins = Array.from({ length: 9 }, (_, k) => ({ k, el: mkL.add(`<g>${coin(c, 7)}</g>`), x0: tb.x - 50 + k * 10, y0: FLOOR - 66 - (k % 3) * 4, x1: tb.x - 120 + k * 34 + c.rr(-20, 20), y1: FLOOR + c.rr(4, 40), h: c.rr(60, 140), roll: c.rr(20, 70), d: k * 0.02 }));
    });
    BENCH.el = mkL.add(`<g>${bench(c, BENCH.w, 38)}</g>`);
    const doves = Array.from({ length: 6 }, (_, i) => ({ i, el: mkL.add(`<g>${smallDove(c)}</g>`), cage: i % 2, x1: 300 + i * 190 + c.rr(-40, 40), y1: c.rr(-80, 120), ph: c.rr(0, 6) }));
    const cages = [-48, 30].map((dx, i) => ({ dx, i, el: mkL.add(`<g>${cage(c, 64, 56)}</g>`) }));
    const dustL = [0, 1, 2].map((i) => mkL.add(`<g>${dust(c, 30, mix(C.stone, C.sand, 0.4))}</g>`));

    /* ---------- the porter who would cut through with his load ---------- */
    const porter = { seed: c.rr(0, 9), p: S.puppet(mkL.add(person(c, townsfolk(c, { man: true, robe: C.wheatRobe, mantle: null, belt: C.leather, holdF: `<g transform="translate(2 18)">${basketProp(c, 52)}</g>` })))) };

    /* ---------- Jesus and the disciples ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v15a — the bustling market; Jesus comes in from the left */
      const inK = es(t, 0.0, 0.75, ease.out);
      /* v15b — He drives out sellers and buyers */
      const drive = es(t, 1.05, 1.9);
      /* v15c — the tables; v15d — the benches of the dove sellers */
      const flipT = TABLES.map((_, i) => es(t, 2.1 + i * 0.22, 2.4 + i * 0.22, ease.in));
      const flipB = es(t, 3.1, 3.4, ease.in);
      // where He is
      const jx = t < 2 ? lerp(240, 780, inK) + drive * 60 : t < 3 ? lerp(840, 870, es(t, 2.0, 2.4)) + es(t, 2.3, 2.6) * 60 : lerp(930, 700, es(t, 2.95, 3.15)) + es(t, 3.9, 4.2) * 110;
      const jflip = t > 2.95 && t < 3.95;
      const moving_ = (inK > 0 && inK < 1) || (t > 2.0 && t < 2.6) || (t > 2.95 && t < 3.15) || (t > 3.9 && t < 4.2);
      const sweep = bump(t, 1.1, 1.8);
      const push = Math.max(bump(t, 2.05, 2.45), bump(t, 2.27, 2.67), bump(t, 3.05, 3.45));
      const stop = es(t, 4.25, 4.45);
      jesus.set({
        x: jx, y: FLOOR, s: 1.04, flip: jflip, walk: moving_ ? jx * 0.05 : undefined,
        armF: sweep * (70 + Math.sin(t * 20) * 20) + push * 100 + stop * 90, armB: sweep * 60 + push * 40 + stop * 20, lean: push * 8 * (jflip ? -1 : 1), head: stop * 4, blink: blinkAt(T),
      });

      // sellers and buyers bustle, then are driven out to both sides
      TR.forEach((m) => {
        const go = es(t, 1.25 + m.i * 0.04, 1.75 + m.i * 0.03, ease.in);
        const x = m.x + m.dir * go * 700;
        const haggle = 1 - seg(t, 1.0, 1.1);
        m.p.set({ x, y: m.y, s: 0.92, flip: go > 0.02 ? m.dir < 0 : m.flip, walk: go > 0 && go < 1 ? x * 0.08 : undefined, armF: haggle * (m.i % 2 ? 30 + bump(t, 0.2 + m.i * 0.05, 0.7 + m.i * 0.05) * 50 : 20) + go * 40, armB: go * 90, head: haggle * (m.i % 3 ? 6 : -4), lean: go * 10 * m.dir, blink: blinkAt(T, m.seed), o: 1 - seg(t, 1.9, 1.98) });
      });
      lambs.forEach((l) => { const go = es(t, 1.35 + l.i * 0.1, 1.9, ease.in); pose(l.el, { x: l.x + go * 620, y: l.y - Math.abs(Math.sin(t * 30)) * 6 * (go > 0 && go < 1 ? 1 : 0), sx: l.d, s: 0.8, o: 1 - seg(t, 1.9, 1.98) }); });

      // the tables go over; coins fly and roll across the paving
      TABLES.forEach((tb, i) => {
        const f = flipT[i];
        pose(tb.el, { x: tb.x + tb.w / 2 + f * 30, y: FLOOR - 4 + f * 4, r: f * 96, ox: tb.w / 2, oy: 0 });
        const ch = changers[i];
        const flee = es(t, 2.2 + i * 0.22, 2.9 + i * 0.2, ease.in);
        const cx = tb.x + 30 + flee * 520;
        ch.p.set({ x: cx, y: FLOOR - 26, s: 0.9, flip: flee < 0.05, walk: flee > 0 && flee < 1 ? cx * 0.08 : undefined, armB: bump(t, 2.1 + i * 0.22, 2.6 + i * 0.22) * 150 + flee * 60, armF: 40 + bump(t, 2.1 + i * 0.22, 2.6 + i * 0.22) * 80, head: -bump(t, 2.1, 2.6) * 10, blink: blinkAt(T, ch.seed), o: 1 - seg(t, 2.95 + i * 0.1, 3.1 + i * 0.1) });
        tb.coins.forEach((co) => {
          const k = seg(t, 2.18 + i * 0.22 + co.d, 2.55 + i * 0.22 + co.d);
          const r = seg(t, 2.5 + i * 0.22 + co.d, 3.0 + i * 0.22);
          const x = lerp(co.x0, co.x1, k) + ease.out(r) * co.roll;
          const y = lerp(co.y0, co.y1, k) - Math.sin(k * PI) * co.h;
          pose(co.el, { x, y, r: k * 540 + r * 300, sx: k > 0 ? 0.4 + Math.abs(Math.cos(k * 9 + r * 6)) * 0.6 : 1, o: k > 0 ? 1 : 0 });
        });
      });
      dustL.forEach((d, i) => {
        const at = i < 2 ? 2.28 + i * 0.22 : 3.3;
        const k = seg(t, at, at + 0.4);
        pose(d, { x: i < 2 ? TABLES[i].x + 70 : BENCH.x - 20, y: FLOOR - 20 - k * 30, s: 0.5 + k * 1.4, o: bump(t, at, at + 0.4) * 0.8 });
      });

      // the dove seller's bench goes over, the cages tumble and spring open, the doves fly free
      pose(BENCH.el, { x: BENCH.x - BENCH.w / 2 - flipB * 20, y: FLOOR - 4, r: -flipB * 94, ox: -BENCH.w / 2, oy: 0 });
      cages.forEach((cg) => {
        const fall = es(t, 3.18 + cg.i * 0.05, 3.45 + cg.i * 0.05, ease.in);
        const x = BENCH.x + cg.dx - fall * (50 + cg.i * 40), y = FLOOR - 70 + fall * 58;
        pose(cg.el, { x, y, r: -fall * (70 + cg.i * 40), ox: 0, oy: -28 });
        cg.x = x; cg.y = y;
      });
      const flee = es(t, 3.1, 3.7, ease.in);
      const dx = BENCH.x - 70 - flee * 520;
      dover.p.set({ x: dx, y: FLOOR - 10, s: 0.92, flip: flee > 0.05 || t < 3, walk: flee > 0 && flee < 1 ? dx * 0.08 : undefined, armB: bump(t, 3.05, 3.5) * 150, armF: 40 + bump(t, 3.05, 3.5) * 60, blink: blinkAt(T, dover.seed), o: 1 - seg(t, 3.65, 3.8) });
      doves.forEach((dv) => {
        const cg = cages[dv.cage];
        const k = es(t, 3.4 + dv.i * 0.05, 3.95 + dv.i * 0.04, ease.in);
        const sx = BENCH.x + cages[dv.cage].dx + (dv.i % 3 - 1) * 10, sy = FLOOR - 50 - (dv.i % 3) * 6;
        const x = lerp(sx, dv.x1, k), y = lerp(sy, dv.y1, k) - Math.sin(k * PI) * 80;
        const flying = k > 0;
        pose(dv.el, { x, y, s: 0.8 + k * 0.3, sx: dv.x1 < sx ? -1 : 1, r: flying ? -16 : 0, o: 1 });
        if (flying) flapDove(dv.el, t * 3 + dv.ph, 34, 12, -10); else flapDove(dv.el, 0, 0, 0, 0);
      });

      /* v16 — a porter tries to cut through with his jar: Jesus stops him; he turns back */
      const pin = es(t, 4.0, 4.3), back = es(t, 4.5, 4.95, ease.in);
      const px = lerp(1500, 1010, pin) + back * 540;
      porter.p.set({ x: px, y: FLOOR + 6, s: 0.94, flip: back < 0.02, walk: (pin > 0 && pin < 1) || (back > 0 && back < 1) ? px * 0.06 : undefined, armB: bump(t, 4.3, 4.6) * 70, armF: 55, head: bump(t, 4.3, 4.6) * 8, blink: blinkAt(T, porter.seed), o: seg(t, 3.95, 4.02) });

      S.cam.x = -40 + inK * 40 + es(t, 2.0, 2.4) * 90 - es(t, 2.9, 3.2) * 150 + es(t, 3.85, 4.2) * 110;
      S.cam.z = 1.02 + es(t, 2.0, 2.3) * 0.06 - es(t, 3.6, 3.9) * 0.05;
      S.cam.y = es(t, 3.35, 3.7) * -30 + es(t, 3.9, 4.2) * 30;
    };
  },
};
