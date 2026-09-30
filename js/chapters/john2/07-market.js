// J 2,14–16 — the Temple court at Passover has become a market: oxen, sheep, dove cages, the money
// changers at their tables. Jesus plaits a whip of cords (a hanging close-up shows three cords twisting
// together), cracks it in the air — never at anyone — and the oxen and sheep run out with their sellers;
// He pours out the changers' coins and tips their tables over; the dove seller carries his cages away;
// "Do not make my Father's house a marketplace!" — the market sign falls, and the sanctuary glows.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, swing } from '../kit.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, courtFront, changerTable, coinStack, coin, balance, cage, smallDove, flapDove, bench, sheep, ox, walkOx, townsfolk, whip, cords, moneyBag, dust, iconBubble, hungWord, strip, hand, tr, PI } from './lib.js';

const FLOOR = 684;
const TABLES = [{ x: 1000, w: 150 }, { x: 1170, w: 150 }];
const BENCH = { x: 470, w: 170 };

/** a market sign on two strings: a coin and a little balance */
function marketSign(c) {
  const s = sheet();
  s.p(c.cut([[-130, 0], [130, 0], [130, 74], [110, 64], [90, 74], [-90, 74], [-110, 64], [-130, 74]], 0.5, 8), C.cream);
  let st = '';
  for (let x = -126; x < 126; x += 36) st += c.cut(c.rect(x, 4, 16, 62), 0.3, 5);
  s.x(st, C.terracotta, 'opacity=".75"');
  s.p(c.ribbon([[-126, 1], [126, 1]], 7), C.wood2);
  s.x(c.ribbon([[-104, 10], [104, 10]], 2), C.ochre, 'opacity=".8"');
  return `<path d="M-110 -1400V0M110 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${sheet().p(c.cut(c.circ(0, 36, 30, 20), 0.3, 4), C.cream).out()}<g transform="translate(0 54)">${balance(c)}</g><g transform="translate(-72 50)">${coinStack(c, 4, 10)}</g><g transform="translate(72 38)">${coin(c, 12)}</g>`;
}

export default {
  id: 'j2-market',
  beats: [
    { v: 14 },
    { v: 15, text: 'Wówczas sporządziwszy sobie bicz ze sznurków,' },
    { v: 15, cont: true, text: 'powypędzał wszystkich ze świątyni, także baranki i woły,' },
    { v: 15, cont: true, text: 'porozrzucał monety bankierów, a stoły powywracał.' },
    { v: 16, text: 'Do tych zaś, którzy sprzedawali gołębie, rzekł: «Weźcie to stąd,' },
    { v: 16, cont: true, text: 'a nie róbcie z domu mego Ojca targowiska!»' },
  ],
  cam: { x: [-260, 200], y: [-60, 60], z: [0.98, 1.14] },
  build(S) {
    const c = S.c;
    const { sunEl, cl1 } = templeCourt(S, { skyCols: ['#cfe1dc', '#f1e6c9', '#f8ead0'], floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 140] });

    /* the Father's house: light over the sanctuary (never a figure) */
    const holyL = S.layer({ par: 0.16, sh: 1, flat: true });
    const holy = holyL.add(`<g>${rays(c, { n: 18, r0: 60, r1: 700, spread: 0.05, color: '#fff3cf' })}<circle r="260" fill="url(#halo-glow)"/></g>`);
    const signL = S.layer({ par: 0.2, sh: 5 });
    const sign = signL.add(`<g>${marketSign(c)}</g>`);
    const fatherTag = hanging(signL, `${hungWord(c, tr('dom mego Ojca', 'my Father’s house'), { size: 26, len: 0 }).replace('<g class="hang">', '<g>')}`, { x: 800, y: 150, len: 700 });

    /* animals and their sellers at the back */
    const backL = S.layer({ par: 0.44, sh: 4 });
    const oxen = [[590, FLOOR - 40, 1], [700, FLOOR - 30, -1]].map(([x, y, d], i) => ({ x, y, d, i, el: backL.add(ox(c, { col: i ? mix(C.wood3, C.parchment, 0.3) : mix(C.wood3, C.clay, 0.35) })) }));
    const flock = [[870, FLOOR - 34], [930, FLOOR - 24], [890, FLOOR - 14], [960, FLOOR - 38]].map(([x, y], i) => ({ x, y, i, el: backL.add(sheep(c)), dir: i % 2 ? 1 : -1 }));
    const sellers = [[520, -44, false, -1], [770, -40, true, -1], [1010, -48, true, 1], [900, -52, false, 1]].map(([x, dy, flip, dir], i) => ({ x, y: FLOOR + dy, flip, dir, i, seed: c.rr(0, 9), p: S.puppet(backL.add(person(c, townsfolk(c, { man: i < 3 })))) }));

    /* the changers' tables (right) and the dove seller's bench (left) */
    const mkL = S.layer({ par: 0.5, sh: 5 });
    const changers = TABLES.map((tb, i) => ({ ...tb, i, seed: c.rr(0, 9), p: S.puppet(mkL.add(person(c, townsfolk(c, { man: true, robe: i ? C.plumRobe : C.ochreRobe, mantle: i ? C.ochre : C.plumRobe, belt: C.sun })))) }));
    const dover = { seed: c.rr(0, 9), p: S.puppet(mkL.add(person(c, townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather })))) };
    TABLES.forEach((tb, i) => {
      tb.el = mkL.add(`<g>${changerTable(c, tb.w)}<g transform="translate(-44 -60)">${coinStack(c, 5, 9)}</g><g transform="translate(36 -60)">${balance(c)}</g></g>`);
      tb.bag = mkL.add(`<g>${moneyBag(c)}</g>`);
      tb.coins = Array.from({ length: 10 }, (_, k) => ({ k, el: mkL.add(`<g>${coin(c, 7)}</g>`), x1: tb.x - 140 + k * 30 + c.rr(-20, 20), y1: FLOOR + c.rr(6, 44), h: c.rr(50, 130), roll: c.rr(20, 70), d: k * 0.018 }));
    });
    BENCH.el = mkL.add(`<g>${bench(c, BENCH.w, 38)}</g>`);
    const cages = [-46, 34].map((dx, i) => ({ dx, i, el: mkL.add(`<g>${cage(c, 64, 56)}</g>`) }));
    const doves = Array.from({ length: 4 }, (_, i) => ({ i, el: mkL.add(`<g>${smallDove(c)}</g>`), cage: i % 2 }));
    const dustL = [0, 1].map(() => mkL.add(`<g>${dust(c, 30, mix(C.stone, C.sand, 0.4))}</g>`));

    /* Jesus, the cords and the whip */
    const L = S.layer({ par: 0.56, sh: 6 });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jesusW = S.puppet(L.add(person(c, { ...CAST.jesus, holdB: `<g transform="translate(0 -4)">${whip(c, 80)}</g>` })));
    const crack = L.add(`<g>${[0, 1, 2].map((i) => `<path d="${c.ribbon(c.arc(0, 0, 60 + i * 16, 60 + i * 16, -2.4, -1.4, 10), 3 - i * 0.6)}" fill="${C.cream}" opacity="${0.9 - i * 0.25}"/>`).join('')}</g>`);
    const plate = L.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 86, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 80, 36), 0.5, 5), C.cream).out()}<g class="cords" transform="translate(0 -58)">${cords(c, 112)}</g><g class="made" opacity="0" transform="translate(0 -62) scale(1.15)">${whip(c, 84)}</g></g>`);
    const strands = Array.from(plate.querySelectorAll('.strand')), made = plate.querySelector('.made'), cordsG = plate.querySelector('.cords');
    const bOut = L.add(`<g>${iconBubble(c, `<g transform="translate(-26 18) scale(.62)">${cage(c, 64, 56)}</g><path d="M4 -4H40M28 -16L42 -4L28 8" stroke="${C.terracotta}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, { w: 124, h: 80, side: -1 })}</g>`);

    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v14 — He comes in and finds the market */
      const inK = es(t, 0.0, 0.7, ease.out);
      const look = Math.sin(seg(t, 0.6, 1.0) * PI * 2) * 10;
      /* v15a — the whip: swap to the puppet holding it */
      const hasWhip = es(t, 1.72, 1.79) * (1 - es(t, 3.93, 4.0));
      /* v15b — driving out; v15c — coins and tables; v16 — the doves; the Father's house */
      const drive = es(t, 2.05, 2.85);
      const flipT = TABLES.map((_, i) => es(t, 3.2 + i * 0.25, 3.45 + i * 0.25, ease.in));
      const jx = t < 3 ? lerp(160, 740, inK) + es(t, 2.0, 2.5) * 40 : t < 4 ? lerp(780, 900, es(t, 3.0, 3.25)) + es(t, 3.35, 3.6) * 60 : lerp(960, 760, es(t, 3.95, 4.3));
      const jflip = t > 4.0 && t < 5.2;
      const walking = (inK > 0 && inK < 1) || (t > 2 && t < 2.5) || (t > 3.0 && t < 3.6) || (t > 3.95 && t < 4.3);
      const swingW = t > 1.8 && t < 3.95 ? bump(t, 2.05, 2.9) : 0;
      const crackK = Math.max(bump(t, 2.1, 2.35), bump(t, 2.4, 2.65), bump(t, 2.7, 2.9));
      const push = Math.max(bump(t, 3.15, 3.45), bump(t, 3.4, 3.7));
      const pointOut = bump(t, 4.1, 5.0) * 1.0;
      const toHouse = es(t, 5.05, 5.35);
      const o = {
        x: jx, y: FLOOR + 18, s: 1.06, flip: jflip && toHouse < 0.5, walk: walking ? jx * 0.06 : undefined,
        armF: 20 + bump(t, 1.05, 1.75) * 60 + push * 100 + pointOut * 90 + toHouse * 60, armB: 10 + swingW * (120 + Math.sin(t * 22) * 30) + toHouse * 150 * 0,
        head: look + toHouse * -14, lean: push * 8, blink: blinkAt(T, 1),
      };
      jesus.set({ ...o, o: 1 - hasWhip });
      jesusW.set({ ...o, o: hasWhip, armB: 30 + swingW * (110 + Math.sin(t * 22) * 30) });
      pose(crack, { x: jx - 40, y: FLOOR - 250, s: 0.8 + crackK * 0.4, r: Math.sin(t * 22) * 10, o: crackK * 0.8 });

      // the close-up of the cords being plaited
      const pk = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.75, 1.95));
      pose(plate, { x: 640, y: FLOOR - 330, s: 0.3 + 0.7 * pk, o: pk });
      const tw = es(t, 1.2, 1.65);
      strands.forEach((st, i) => pose(st, { x: (i - 1) * 4 * (1 - tw), r: (i - 1) * 26 * (1 - tw) + Math.sin(tw * PI * 3 + i * 2) * 10 * Math.sin(tw * PI) }));
      fade(cordsG, 1 - es(t, 1.58, 1.68));
      fade(made, es(t, 1.58, 1.68));

      /* the animals run out, the sellers with them */
      const run = (a, b, i) => es(t, a + i * 0.05, b + i * 0.04, ease.in);
      oxen.forEach((ob) => {
        const k = run(2.15, 2.8, ob.i);
        const dir = ob.i ? 1 : -1;
        const x = ob.x + dir * k * 900;
        pose(ob.el, { x, y: ob.y - Math.abs(Math.sin(t * 24)) * 4 * (k > 0 && k < 1 ? 1 : 0), s: 0.95, sx: dir * (k > 0.01 ? 1 : ob.d * dir), o: 1 - seg(t, 2.8, 2.86) });
        walkOx(ob.el, k > 0 && k < 1 ? t * 30 : 0, k > 0 && k < 1 ? 1 : 0);
      });
      flock.forEach((sh) => {
        const k = run(2.2, 2.8, sh.i);
        const x = sh.x + sh.dir * k * 800;
        pose(sh.el, { x, y: sh.y - Math.abs(Math.sin(t * 30 + sh.i)) * 10 * (k > 0 && k < 1 ? 1 : 0), s: 0.9, sx: k > 0.01 ? sh.dir : (sh.i % 2 ? -1 : 1), o: 1 - seg(t, 2.8, 2.86) });
      });
      sellers.forEach((m) => {
        const go = run(2.25, 2.85, m.i);
        const x = m.x + m.dir * go * 800;
        const haggle = 1 - seg(t, 1.9, 2.1);
        m.p.set({ x, y: m.y, s: 0.9, flip: go > 0.02 ? m.dir < 0 : m.flip, walk: go > 0 && go < 1 ? x * 0.08 : undefined, armF: haggle * (20 + bump(t, 0.2 + m.i * 0.1, 0.8 + m.i * 0.1) * 50) + go * 40, armB: go * 90, lean: go * 8 * m.dir, blink: blinkAt(T, m.seed), o: 1 - seg(t, 2.85, 2.92) });
      });

      /* the changers: the bags are poured out, the tables go over */
      TABLES.forEach((tb, i) => {
        const f = flipT[i];
        pose(tb.el, { x: tb.x + tb.w / 2 + f * 30, y: FLOOR - 4 + f * 4, r: f * 96, ox: tb.w / 2, oy: 0 });
        const pour = es(t, 3.05 + i * 0.12, 3.25 + i * 0.12);
        pose(tb.bag, { x: tb.x - 20, y: FLOOR - 60 - pour * 30, r: pour * 150, ox: 0, oy: -20, o: 1 - es(t, 3.6, 3.7) });
        const ch = tb === TABLES[0] ? changers[0] : changers[1];
        const flee = es(t, 3.3 + i * 0.2, 3.95 + i * 0.15, ease.in);
        const cx = tb.x + 30 + flee * 520;
        ch.p.set({ x: cx, y: FLOOR - 26, s: 0.92, flip: flee < 0.05, walk: flee > 0 && flee < 1 ? cx * 0.08 : undefined, armB: bump(t, 3.1 + i * 0.2, 3.6 + i * 0.2) * 150 + flee * 60, armF: 40 + bump(t, 3.1, 3.6) * 80, head: -bump(t, 3.1, 3.6) * 10, blink: blinkAt(T, ch.seed), o: 1 - seg(t, 3.95 + i * 0.1, 4.05 + i * 0.1) });
        tb.coins.forEach((co) => {
          const k = seg(t, 3.12 + i * 0.12 + co.d, 3.45 + i * 0.12 + co.d);
          const r = seg(t, 3.4 + i * 0.12 + co.d, 3.9 + i * 0.12);
          const x = lerp(tb.x - 20, co.x1, k) + ease.out(r) * co.roll;
          const y = lerp(FLOOR - 80, co.y1, k) - Math.sin(k * PI) * co.h;
          pose(co.el, { x, y, r: k * 540 + r * 300, sx: k > 0 ? 0.4 + Math.abs(Math.cos(k * 9 + r * 6)) * 0.6 : 1, o: k > 0 ? 1 : 0 });
        });
        const dk = seg(t, 3.3 + i * 0.25, 3.7 + i * 0.25);
        pose(dustL[i], { x: tb.x + 70, y: FLOOR - 20 - dk * 30, s: 0.5 + dk * 1.4, o: bump(t, 3.3 + i * 0.25, 3.7 + i * 0.25) * 0.8 });
      });

      /* v16a — the dove seller takes his cages and goes */
      const lift = es(t, 4.35, 4.6);
      const go = es(t, S.portrait ? 4.7 : 4.55, 5.1, ease.in);   // phone: he is still in view while Jesus speaks to him
      const dx = BENCH.x - 60 - go * 600;
      const armD = 30 + lift * 80;
      dover.p.set({ x: dx, y: FLOOR - 10, s: 0.94, flip: go > 0.02 ? true : false, walk: go > 0 && go < 1 ? dx * 0.08 : undefined, armF: armD, armB: 20 + lift * 70, head: bump(t, 4.1, 4.4) * 10, blink: blinkAt(T, dover.seed), o: 1 - seg(t, 5.05, 5.12) });
      pose(BENCH.el, { x: BENCH.x, y: FLOOR - 4 });
      const [hx, hy] = hand(dx, FLOOR - 10, 0.94, go > 0.02, armD);
      cages.forEach((cg) => {
        const cx = lerp(BENCH.x + cg.dx, hx + (cg.i ? 20 : -26), lift), cy = lerp(FLOOR - 42, hy + 40 + cg.i * 6, lift);
        pose(cg.el, { x: cx, y: cy, s: 1 - lift * 0.2, o: 1 - seg(t, 5.05, 5.12) });
        cg.x = cx; cg.y = cy;
      });
      doves.forEach((dv) => {
        const cg = cages[dv.cage];
        pose(dv.el, { x: cg.x + (dv.i > 1 ? 8 : -8), y: cg.y - 8, s: 0.7 * (1 - lift * 0.2), sx: dv.i % 2 ? -1 : 1, o: 1 - seg(t, 5.05, 5.12) });
        flapDove(dv.el, T * 0.6 + dv.i, 6, 3, 0);
      });
      const bk = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.9, 5.0));
      pose(bOut, { x: jx - 30, y: FLOOR - 200, s: 0.3 + 0.7 * bk, o: bk });

      /* v16b — the market sign falls; the Father's house shines */
      const fall = es(t, 5.15, 5.6, ease.in);
      pose(sign, { x: 800 + fall * 40, y: 318 + fall * 700, r: fall * 30 + Math.sin(T * 0.8) * 1.2 * (1 - fall), o: 1 - seg(t, 5.55, 5.6) });
      const hk = es(t, 5.1, 5.5);
      pose(holy, { x: 800, y: FLOOR - 330, s: 0.5 + hk * 0.6, r: t * 10, o: hk * 0.38 });
      pose(fatherTag, { x: 800, y: 130 - (1 - es(t, 5.25, 5.6, ease.out)) * 400, r: Math.sin(T * 0.7) * 1.2 });

      // phone: look right at the changers' tables going over, then left at the dove seller
      S.cam.x = S.portrait ? -40 + inK * 40 + es(t, 2.9, 3.3) * 190 - es(t, 3.9, 4.3) * 430 + es(t, 5.0, 5.4) * 240
        : -40 + inK * 40 + es(t, 2.9, 3.3) * 70 - es(t, 3.9, 4.3) * 110 + es(t, 5.0, 5.4) * 40;
      S.cam.z = 1.06 + es(t, 1.0, 1.3) * 0.06 * (1 - es(t, 1.8, 2.1)) - es(t, 5.0, 5.4) * 0.07;
      S.cam.y = es(t, 5.0, 5.4) * -40;
    };
  },
};
