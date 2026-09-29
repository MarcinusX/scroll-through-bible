// Łk 12,16–19 — the parable flies in: a rich man's land in the golden afternoon. "The ground of a certain rich man
// produced abundantly": row after row the wheat shoots up and ripens, sheaves stand up all over the field, and he spreads
// his arms over it. "What will I do?": he goes to his two little barns, hand to his beard, a "?" over him, sheaves and
// sacks heaped all round. "I have no room to store my crops": the barn doors burst open and grain pours out; he shoves one
// shut and it bursts again. "I will pull down my barns and build bigger ones": the little barns tip over and sink away,
// and a great new barn rises out of the ground; "and there I will store all my grain and my goods": the sacks, the
// sheaves, a chest and the jars sail in through its wide door. "Soul, you have many goods laid up for many years": he
// sits and pats his chest, and a long garland of years — sun after sun — is strung out across the sky. "Take your ease,
// eat, drink, be merry": a laden table slides up before him, he leans back on his cushion and lifts his cup.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { sheaf } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { farmSet, FARM, RICH, HANDS, flourSack, wineJar, coinChest, thought, GLYPH, sparkle, loaf, cup, jug, headAt, hand, alongPts, kf, PI, FONT } from './lib.js';
import { lowTable, grapes } from '../mark2/lib.js';

const GY = FARM.GY;
const HEAP = [[770, GY + 8], [820, GY + 14], [720, GY + 16], [860, GY + 4], [700, GY + 4], [790, GY - 4]];

function yearDisc(c, n) {
  const s = sheet().p(c.cut(c.circ(0, 0, 22, 24), 0.3, 4), C.haloRim).p(c.cut(c.circ(0, 0, 17, 22), 0.3, 4), C.cream).out();
  return `${s}<path d="${c.cut(c.star(0, -3, 9, 6, 10, 0), 0.2, 3)}" fill="${C.sun}"/><text x="0" y="12" text-anchor="middle" font-family="${FONT}" font-size="10" font-style="italic" fill="${C.ink}">${n}</text>`;
}

export default {
  id: 'lk12-barns',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 16 },
    { v: 17, text: 'I rozważał sam w sobie: Co tu począć?' },
    { v: 17, cont: true, text: 'Nie mam gdzie pomieścić moich zbiorów.' },
    { v: 18, text: 'I rzekł: Tak zrobię: zburzę moje spichlerze, a pobuduję większe' },
    { v: 18, cont: true, text: 'i tam zgromadzę całe zboże i moje dobra.' },
    { v: 19, text: 'I powiem sobie: Masz wielkie zasoby dóbr, na długie lata złożone;' },
    { v: 19, cont: true, text: 'odpoczywaj, jedz, pij i używaj!' },
  ],
  cam: { x: [-120, 120], y: [-30, 40], z: [1, 1.14] },
  build(S) {
    const F = farmSet(S);
    const c = S.c;
    /* sheaves in the field, heaps in the yard */
    const sheaves = [-160, -40, 80, 200, 320, 440, 560].map((x, i) => ({ i, x, y: 640 + (i % 3) * 22, el: F.fieldL.add(`<g opacity="0">${sheaf(c, 70)}</g>`) }));
    const heaps = HEAP.map(([x, y], i) => ({ i, x, y, el: F.act.add(`<g opacity="0">${i % 2 ? sheaf(c, 64) : flourSack(c, 46, 54)}</g>`) }));
    const goods = [coinChest(c, 54), wineJar(c, 52), wineJar(c, 44, C.clay)].map((m, i) => ({ i, el: F.act.add(`<g opacity="0">${m}</g>`) }));
    const spills = F.small.map((b) => ({ b, el: F.barnL.add(`<g opacity="0">${sheet().p(c.cut([[-40, 0], [-30, -30], [-6, -50], [16, -40], [36, -14], [50, 0]], 0.6, 5), C.wheat).x(c.ribbon([[-20, -10], [20, -20]], 2) + c.ribbon([[-10, -30], [24, -26]], 2), C.wheat2).out()}</g>`) }));
    const rubble = F.small.map((b) => ({ b, el: F.barnL.add(`<g opacity="0">${sheet().p(c.cut([[-70, 0], [-50, -24], [-10, -36], [30, -20], [70, 0]], 1.4, 6), mix(C.stone, C.sand, 0.4)).p(c.cut([[-40, -10], [-20, -44], [0, -30]], 0.8, 5) + c.cut([[20, -8], [44, -30], [56, -6]], 0.8, 5), C.roof).out()}</g>`) }));
    const dust = [0, 1, 2, 3, 4, 5].map(() => F.fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 26, 16, 9, 0.3), 0.6, 4)}" fill="${mix(C.sand, C.cream, 0.4)}"/></g>`));

    /* the rich man and his hands */
    const rich = S.puppet(F.act.add(person(c, RICH)));
    const richSit = S.puppet(F.act.add(person(c, { ...RICH, pose: 'sit', holdF: `<g transform="translate(-2 -4)">${cup(c, C.sun)}</g>` })));
    const hands = HANDS.slice(0, 2).map((o, i) => ({ i, p: S.puppet(F.act.add(person(c, o))), load: F.act.add(`<g opacity="0">${flourSack(c, 40, 46)}</g>`) }));
    const table = F.act.add(`<g opacity="0"><g transform="scale(.5)">${lowTable(c, 300, 60)}</g><g transform="translate(-40 -32)">${loaf(c, 14)}</g><g transform="translate(-6 -30)">${grapes(c, 4)}</g><g transform="translate(34 -30)">${jug(c, C.pot)}</g></g>`);
    const cushion = F.act.add(`<g opacity="0">${sheet().p(c.cut(c.blob(0, -10, 44, 14, 12, 0.1), 0.4, 5), C.terracotta).out()}</g>`);
    const q = F.fx.add(`<g opacity="0">${thought(c, GLYPH.q(c))}</g>`);
    const glints = [0, 1, 2].map(() => F.fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    /* the garland of years */
    const yearsL = S.layer({ par: 0.1, sh: 5 });
    const line = yearsL.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([0, 0], [340, 80], [680, 0], 24), 2)}" fill="rgba(74,54,34,.6)"/></g>`);
    const years = Array.from({ length: 8 }, (_, i) => ({ i, el: yearsL.add(`<g opacity="0">${yearDisc(c, i + 1)}</g>`) }));

    return (t, time) => {
      const T = time;
      F.update(T);
      /* v16 — the ground brings forth plentifully */
      F.rows.forEach((el, i) => { const k = es(t, 0.05 + i * 0.1, 0.5 + i * 0.1); pose(el, { x: 0, y: (1 - k) * 80 }); });
      sheaves.forEach((s) => { const k = es(t, 0.55 + s.i * 0.04, 0.72 + s.i * 0.04, ease.back); pose(s.el, { x: s.x, y: s.y, s: k, o: k > 0.01 ? 1 : 0 }); });
      glints.forEach((g, i) => { const k = bump(t, 0.6 + i * 0.08, 1.1 + i * 0.08); pose(g, { x: [120, 360, 540][i], y: 560, s: k, r: T * 40, o: k }); });

      /* v17a — "what will I do?" */
      const toBarns = es(t, 1.02, 1.4), back = es(t, 3.05, 3.3), sitK = es(t, 5.05, 5.15);
      const rx = lerp(lerp(600, 760, toBarns), 680, back);
      const ponder = es(t, 1.4, 1.6) * (1 - es(t, 2.0, 2.1));
      const push = bump(t, 2.3, 2.7);
      const fling = bump(t, 3.1, 3.6);
      const beckon = bump(t, 4.05, 4.5);
      rich.set({ x: rx + push * 20, y: GY, s: 1.0, flip: t < 1.0, walk: (toBarns > 0 && toBarns < 1) || (back > 0 && back < 1) ? rx * 0.05 : undefined, o: 1 - sitK, armF: 20 + bump(t, 0.3, 0.95) * 70 + push * 60 + fling * 80 + beckon * 50, armB: 10 + bump(t, 0.3, 0.95) * 90 + ponder * 120 + fling * 40, head: ponder * 10 - fling * 6, lean: push * 10, blink: blinkAt(T, 1) });
      const [rhx, rhy] = headAt(rx, GY, 1.0, false);
      const qk = es(t, 1.35, 1.5, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(q, { x: rhx + 6, y: rhy - 16, s: qk, o: qk > 0.01 ? 1 : 0 });
      heaps.forEach((h) => {
        const k = es(t, 1.1 + h.i * 0.06, 1.3 + h.i * 0.06, ease.back);
        const inK = es(t, 4.1 + h.i * 0.08, 4.35 + h.i * 0.08);
        const [dx, dy] = alongPts([[h.x, h.y], [(h.x + FARM.BIG[0]) / 2, GY - 160], [FARM.BIG[0], GY - 60]], inK);
        pose(h.el, { x: dx, y: dy, s: k * (1 - inK * 0.5), r: inK * 30, o: k > 0.01 && inK < 0.98 ? 1 : 0 });
      });

      /* v17b — no room: the doors burst, the grain pours out */
      const burst = es(t, 2.08, 2.25) * (1 - es(t, 2.4, 2.46)) + es(t, 2.6, 2.72);
      F.small.forEach((b, i) => {
        const fall = es(t, 3.2 + i * 0.1, 3.45 + i * 0.1, ease.in);
        const [bx, bw, bh] = FARM.SB[i];
        pose(b.el, { x: bx, y: GY + fall * 60, r: fall * (i ? 14 : -14), o: 1 - es(t, 3.35 + i * 0.1, 3.45 + i * 0.1) });
        pose(b.door, { x: bx - 46, y: GY, sx: 1 - burst * 0.85, r: 0, o: 1 - es(t, 3.2 + i * 0.1, 3.3 + i * 0.1) });
        const sp = es(t, 2.1 + i * 0.05, 2.35 + i * 0.05) * (1 - es(t, 3.2, 3.3));
        pose(spills[i].el, { x: bx + 10, y: GY + 4, s: sp * (1 + bump(t, 2.6, 2.9) * 0.3), o: sp > 0.01 ? 1 : 0 });
        const rb = es(t, 3.3 + i * 0.1, 3.5 + i * 0.1) * (1 - es(t, 3.6, 3.8));
        pose(rubble[i].el, { x: bx, y: GY + 2, s: rb, o: rb > 0.01 ? 1 : 0 });
      });
      dust.forEach((d, i) => { const k = bump(t, 3.25 + (i % 3) * 0.05, 3.8 + (i % 3) * 0.05); pose(d, { x: FARM.SB[i % 2][0] + (i - 2.5) * 30, y: GY - 30 - k * 40, s: 0.6 + k, o: k * 0.85 }); });

      /* v18a — bigger barns rise; v18b — everything goes in */
      const rise = es(t, 3.45, 3.95, ease.out);
      const [BX, BW, BH] = FARM.BIG;
      pose(F.big, { x: BX, y: GY + (1 - rise) * (BH + 100), o: rise > 0.001 ? 1 : 0 });
      pose(F.bigDoor, { x: -46, y: 0, sx: 1 - es(t, 3.95, 4.1) * 0.9 });
      goods.forEach((g) => {
        const k = es(t, 4.4 + g.i * 0.1, 4.75 + g.i * 0.1);
        const [x, y] = alongPts([[640 + g.i * 40, GY + 6], [800, GY - 140 - g.i * 20], [BX, GY - 50]], k);
        pose(g.el, { x, y, s: 1 - k * 0.4, o: seg(t, 4.0, 4.05) * (k < 0.98 ? 1 : 0) });
      });
      hands.forEach((h) => {
        const k = es(t, 4.05 + h.i * 0.1, 4.7 + h.i * 0.1);
        const x = lerp(460 - h.i * 90, BX - 60, k);
        h.p.set({ x, y: GY + 8 + h.i * 4, s: 0.94, o: seg(t, 3.95, 4.0) * (1 - es(t, 4.75 + h.i * 0.1, 4.85 + h.i * 0.1)), walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: 90, armB: 110, head: 4, blink: blinkAt(T, 4 + h.i) });
        const [lx, ly] = headAt(x, GY + 8 + h.i * 4, 0.94, false);
        pose(h.load, { x: lx - 4, y: ly - 8, s: 0.9, o: seg(t, 3.95, 4.0) * (1 - es(t, 4.75 + h.i * 0.1, 4.85 + h.i * 0.1)) });
      });

      /* v19a — "Soul, you have many goods laid up for many years" */
      const pat = bump(t, 5.2, 5.6);
      const lean = es(t, 6.1, 6.4);
      richSit.set({ x: 660, y: GY + 6, s: 1.0, o: sitK, armF: 30 + pat * 50 + lean * 90, armB: 20 + pat * 10 + bump(t, 6.2, 6.9) * 60, head: -lean * 10, lean: -lean * 10, blink: blinkAt(T, 1) });
      pose(cushion, { x: 640, y: GY + 8, o: sitK });
      const lk = es(t, 5.2, 5.45);
      pose(line, { x: 500, y: 236, o: lk });
      years.forEach((y) => {
        const k = es(t, 5.25 + y.i * 0.05, 5.45 + y.i * 0.05, ease.back);
        const u = (y.i + 0.5) / 8;
        pose(y.el, { x: 500 + u * 680, y: 236 + 160 * u * (1 - u) + 26, s: k, r: time ? Math.sin(T + y.i) * 3 : 0, o: k > 0.01 ? 1 : 0 });
      });

      /* v19b — eat, drink, be merry */
      const tk = es(t, 6.05, 6.3);
      pose(table, { x: lerp(560, 780, tk), y: GY + 16, s: 1.2, o: tk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -110], [0.9, -100], [1.4, 60], [2.9, 90], [3.3, 110], [4.8, 110], [5.2, 20], [6.0, 20], [6.3, -40]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.9, 30], [1.4, 30], [3.1, 30], [3.4, 0], [5.0, 0], [5.3, -20], [6.0, -20], [6.3, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [1.4, 1.12], [3.1, 1.12], [3.4, 1.04], [5.0, 1.04], [6.0, 1.02], [6.3, 1.14]]);
    };
  },
};
