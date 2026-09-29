// Mt 13,9–12 — back at the lake. "He who has ears, let him hear": Jesus raises His hand in the boat, rings of sound
// travel over the water and little paper ears pop up over the crowd. The disciples wade out to the boat and ask
// why He speaks to them in parables. To them the mysteries of the Kingdom are given: Mark 4's casket comes down,
// opens, and sparks of light settle over their heads; to the crowd it is not given: the casket shuts, is tied and
// sealed, and a haze drifts over the beach. Two plates: grain pours into a full basket until it overflows; the little left in a bowl
// is blown away.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade } from '../kit.js';
import { ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  shoreSet, beachCrowd, boatIn, placeBoat, casket, discPlate, basket, bowl, speech, GLYPH, spark, headAt, hangAt, kf, moving, PI,
} from './lib.js';

const BX = 800, BY = 724, BS = 1.05;
const WADE = 812;          // disciples' feet, hidden in the waves

export default {
  id: 'mt13-why',
  beats: [
    { v: 9 },
    { v: 10 },
    { v: 11, text: 'On im odpowiedział: «Wam dano poznać tajemnice królestwa niebieskiego,' },
    { v: 11, cont: true, text: 'im zaś nie dano.' },
    { v: 12, text: 'Bo kto ma, temu będzie dodane, i nadmiar mieć będzie;' },
    { v: 12, cont: true, text: 'kto zaś nie ma, temu zabiorą również to, co ma.' },
  ],
  cam: { x: [-20, 20], y: [0, 130], z: [1, 1.24] },
  build(S) {
    const Z = shoreSet(S, { skyCols: ['#d2e3dc', '#f2e8cf', '#f8ecd6'], sunAt: [1230, 180], haze: true });
    const c = Z.c;

    /* the crowd on the beach, and the ears that pop up over it */
    const crowd = beachCrowd(S, Z.crowdL, [
      { y: 508, s: 0.34, n: 28, x0: 40, x1: 1560 },
      { y: 526, s: 0.41, n: 20, x0: 90, x1: 1510 },
      { y: 546, s: 0.49, n: 16, x0: 140, x1: 1460 },
    ], { per: 4, gap: 0, arms: [0, 20], seed: 'mt13-why-crowd' });
    const ears = crowd.filter((g, i) => i % 3 === 1).map((g, i) => ({ g, i, el: Z.crowdL.add(`<g>${ear(c, [C.skin, C.skin2, C.skin3][i % 3])}</g>`) }));
    // the haze that falls over the beach: it is not given to them
    const haze = Z.hazeL;
    haze.add(`<ellipse cx="800" cy="490" rx="1300" ry="80" fill="${C.lavender}"/><ellipse cx="800" cy="530" rx="1300" ry="50" fill="${C.cream}" opacity=".6"/>`);
    haze.fade(0);
    // rings of sound travelling to the shore
    const rings = [0, 1, 2, 3, 4].map((i) => ({ i, el: Z.lake.add(`<path d="${c.ribbon(c.arc(0, 0, 60, 60, PI * 1.1, PI * 1.9, 14), 5)}" fill="${C.foam}" opacity="0"/>`) }));

    /* the boat with Jesus; the disciples wading on either side */
    const B = boatIn(Z.boatL, c, () => S.puppet(Z.boatL.add(person(c, { ...CAST.jesus, pose: 'sit' }))));
    const jesus = B.inside;
    const DIS = [
      { o: CAST.james, x: 548, from: -160, flip: false },
      { o: CAST.andrew, x: 610, from: -90, flip: false },
      { o: CAST.peter, x: 1000, from: 1700, flip: true },
      { o: CAST.john, x: 1066, from: 1770, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 6), p: S.puppet(Z.boatL.add(person(c, d.o))) }));

    /* over the scene: questions, the casket, sparks, the two plates */
    const fx = S.layer({ par: 0.6, sh: 6 });
    const asks = [DIS[1], DIS[2]].map((d, i) => ({ d, i, el: fx.add(`<g>${speech(c, GLYPH.q(c), { w: 46, h: 40, flip: d.flip })}</g>`) }));
    const box = hanging(fx, casket(c), { x: 0, y: 0, len: 700 });
    const lid = box.querySelector('.lid'), glow = box.querySelector('.glow'), rays = box.querySelector('.rays'), cord = box.querySelector('.cord'), seal = box.querySelector('.seal');
    const sparks = DIS.map((d) => ({ d, el: fx.add(`<g>${spark(c, 12)}</g>`) }));
    // "whoever has": a basket that fills and overflows
    const P1 = [600, 330], P2 = [1000, 330];
    const plate1 = hanging(fx, discPlate(c, '', { r: 92 }), { x: 0, y: 0, len: 900 });
    const bask = fx.add(`<g>${basket(c, { w: 76, h: 46, full: true, heapK: 'mt13-heap' })}</g>`);
    const heap = S.$('mt13-heap');
    const pour = Array.from({ length: 16 }, (_, i) => ({ i, el: fx.add(`<path d="${c.poly(c.ell(0, 0, 4.4, 2.8, 8, c.rr(0, 3)))}" fill="${i % 3 ? C.wheat : C.wheat2}"/>`), dx: c.rr(-20, 20), off: c.rr(0, 1) }));
    const spill = [-1, 1, -1, 1].map((d, i) => ({ d, i, el: fx.add(`<path d="${c.poly(c.ell(0, 0, 4.4, 2.8, 8, c.rr(0, 3)))}" fill="${C.wheat}"/>`) }));
    // "whoever has not": a bowl with a few grains, blown away
    const plate2 = hanging(fx, discPlate(c, '', { r: 92, face: shade(C.parchment, -0.04) }), { x: 0, y: 0, len: 900 });
    const bw = fx.add(`<g>${bowl(c, { w: 70, food: 'none', color: C.pot })}</g>`);
    const few = [[-12, -24], [4, -26], [14, -23]].map(([x, y], i) => ({ x, y, i, el: fx.add(`<path d="${c.poly(c.ell(0, 0, 4.4, 2.8, 8, i))}" fill="${C.wheat2}"/>`) }));
    const gust = [0, 1, 2].map((i) => ({ i, el: fx.add(`<path d="${c.ribbon(c.qbez([0, 0], [40, -10 - i * 4], [90, 2], 10), (u) => Math.sin(u * PI) * 4 + 0.6)}" fill="${C.cream}" opacity="0"/>`) }));

    return (t, time) => {
      Z.update(time);
      const T = time;
      const bob = Math.sin(T * 1.4) * 2.5, rr = Math.sin(T * 1.1) * 0.6;
      placeBoat(B, BX, BY + bob, BS, rr);

      /* v9 — who has ears, let him hear */
      const call = es(t, 0.1, 0.45) * (1 - es(t, 0.95, 1.2));
      const give = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      const toCrowd = es(t, 3.05, 3.25) * (1 - es(t, 3.9, 4.1));
      const twoHands = es(t, 4.05, 4.3);
      jesus.set({
        x: BX - 10 * BS, y: BY + bob - 12 * BS, s: BS, flip: t > 1.2 && t < 3.0,
        armF: 25 + call * 30 + give * 55 + toCrowd * 60 + twoHands * (50 + bump(t, 4.9, 5.4) * 20) + Math.sin(T * 1.2) * 3,
        armB: 10 + call * 140 + give * 40 + twoHands * 40,
        head: -call * 6 - toCrowd * 4 + Math.sin(T * 0.6) * 1.5, blink: blinkAt(T),
      });
      rings.forEach((r) => {
        const k = seg(t, 0.35 + r.i * 0.1, 0.95 + r.i * 0.1);
        pose(r.el, { x: 800, y: 600 - k * 60, s: 0.5 + k * 3.2, sy: 0.9, o: k > 0 && k < 1 ? (1 - k) * 0.9 : 0 });
      });
      ears.forEach((e) => {
        const k = es(t, 0.6 + e.i * 0.04, 0.8 + e.i * 0.04, ease.back) * (1 - es(t, 1.0, 1.2));
        const side = e.g.x > 800 ? -1 : 1;
        pose(e.el, { x: e.g.x + side * 10, y: e.g.y - 230 * e.g.s - 30 + Math.sin(T * 1.6 + e.i) * 3, s: 0.5 * k, sx: side, o: k > 0.01 ? 1 : 0 });
      });

      /* v10 — the disciples wade out and ask why */
      DIS.forEach((d) => {
        const keys = [[1.0 + d.i * 0.04, d.from], [1.45 + d.i * 0.04, d.x]];
        const x = kf(t, keys);
        const ask = asks.find((a) => a.d === d) ? bump(t, 1.4, 2.05) : 0;
        const lit = es(t, 2.4, 2.6);
        const back = d.flip ? -1 : 1;
        d.p.set({
          x, y: WADE, s: 0.98, flip: d.flip, walk: moving(t, keys) ? x * 0.05 : undefined, amt: 0.6,
          armF: ask * 80 + lit * 20 + bump(t, 2.35, 2.9) * 30, armB: ask * (d.i === 2 ? 60 : 0) + es(t, 4.1, 4.5) * 20,
          head: -ask * 6 - lit * 8 + (d.i === 1 || d.i === 2 ? bump(t, 3.05, 3.9) * 10 * back * 0 : 0), blink: blinkAt(T, d.seed),
        });
      });
      asks.forEach((a) => {
        const k = es(t, 1.45 + a.i * 0.08, 1.62 + a.i * 0.08, ease.back) * (1 - es(t, 1.95, 2.1));
        const [hx, hy] = headAt(a.d.x, WADE, 0.98, a.d.flip);
        pose(a.el, { x: hx + (a.d.flip ? -20 : 20), y: hy - 26, s: k, r: Math.sin(T * 2 + a.i) * 4, o: k > 0.02 ? 1 : 0 });
      });

      /* v11a — the casket of the mysteries opens to them */
      const bIn = es(t, 2.0, 2.3, ease.out) * (1 - es(t, 3.9, 4.1));
      const open = es(t, 2.25, 2.5) * (1 - es(t, 3.0, 3.12));
      const toBeach = es(t, 3.05, 3.3);
      hangAt(box, lerp(800, 800, toBeach), lerp(-200, lerp(470, 400, toBeach), bIn), T, 1.2, 0.8);
      const tie = es(t, 3.2, 3.4);
      pose(cord, { s: 1, sx: tie, o: tie });
      const stamp = es(t, 3.35, 3.5, ease.back);
      pose(seal, { x: 0, y: -26, s: lerp(1.8, 1, stamp), o: stamp });
      pose(lid, { x: -37, y: -38, r: -open * 78 });
      fade(glow, open * 0.9);
      pose(rays, { x: 0, y: -40, r: t * 12, s: 0.4 + open * 0.6, o: open * 0.8 });
      sparks.forEach((sp, i) => {
        const fly = es(t, 2.35 + i * 0.04, 2.7 + i * 0.04, ease.out);
        const [hx, hy] = headAt(sp.d.x, WADE, 0.98, sp.d.flip);
        const x = lerp(800, hx, fly), y = lerp(440, hy - 44, fly) - Math.sin(fly * PI) * 60;
        pose(sp.el, { x, y: y + Math.sin(T * 1.6 + i) * 3, s: 0.6 + 0.4 * fly, o: seg(t, 2.33, 2.45) * (1 - es(t, 4.0, 4.3) * 0.4) });
      });

      /* v11b — to them it is not given: the casket is sealed, a haze covers the beach */
      haze.fade(es(t, 3.1, 3.5) * 0.75 * (1 - es(t, 5.9, 6) * 0));

      /* v12 — the two plates */
      const p1 = es(t, 4.0, 4.3, ease.back), p2 = es(t, 5.0, 5.3, ease.back);
      const y1 = lerp(-300, P1[1], p1), y2 = lerp(-300, P2[1], p2);
      pose(plate1, { x: P1[0], y: y1, o: y1 < -150 ? 0 : 1 });
      pose(plate2, { x: P2[0], y: y2, o: y2 < -150 ? 0 : 1 });
      const fill = es(t, 4.3, 4.8);
      pose(bask, { x: P1[0], y: y1 + 44, s: 1.1 });
      pose(heap, { y: -46, sy: 0.5 + fill * 1.6, oy: -46, o: 1 });
      pour.forEach((g) => {
        const on = es(t, 4.25, 4.35) * (1 - es(t, 4.85, 4.95));
        const k = ((T * 0.9 + g.off + t * 1.5) % 1);
        pose(g.el, { x: P1[0] + g.dx * 0.6, y: y1 - 80 + k * 90, s: 1.5, r: k * 200, o: on * (k < 0.9 ? 1 : 0) });
      });
      spill.forEach((g) => {
        const k = es(t, 4.6 + g.i * 0.05, 4.85 + g.i * 0.05, ease.in);
        pose(g.el, { x: P1[0] + g.d * (30 + k * 28 + g.i * 4), y: y1 - 10 + k * 46, s: 1.5, r: k * 180, o: k > 0.01 ? 1 : 0 });
      });
      pose(bw, { x: P2[0], y: y2 + 34, s: 1 });
      const blow = es(t, 5.3, 5.95, ease.in);
      few.forEach((g) => {
        pose(g.el, { x: P2[0] + g.x + blow * (160 + g.i * 40), y: y2 + 34 + g.y - blow * (60 + g.i * 20) + Math.sin(blow * 6 + g.i) * 8, s: 1.6, r: blow * 300, o: (1 - seg(t, 5.9, 5.98)) * (y2 < -150 ? 0 : 1) });
      });
      gust.forEach((g) => {
        const k = seg(t, 5.25 + g.i * 0.06, 5.95 + g.i * 0.02);
        pose(g.el, { x: P2[0] - 110 + k * 180, y: y2 + 4 + g.i * 12, o: bump(t, 5.25 + g.i * 0.06, 5.95 + g.i * 0.02) * 0.9 });
      });

      S.cam.z = kf(t, [[0, 1.02], [0.9, 1.02], [1.3, 1.14], [2.0, 1.14], [2.4, 1.2], [3.0, 1.2], [3.3, 1.04], [4.0, 1.04], [4.3, 1.08]]);
      S.cam.y = kf(t, [[0, 30], [0.9, 30], [1.3, 110], [2.0, 110], [2.4, 110], [3.0, 110], [3.3, 20], [4.0, 20], [4.3, 40]]);
    };
  },
};
