// Łk 6,31–35 — a painted flat of a village square with its well. "As you would like people to do to you, do so to
// them": a man sees his neighbour go down on one knee under a heavy sack; a thought comes to him — himself fallen, a
// hand reaching down to him — and he does exactly that: he helps him up and takes the sack; a golden "=" hangs
// between the thought and the deed. Then the round plate of "credit" comes down over the well, a laurel wreath with a
// question in it. Two friends embrace, a heart goes one way and back again — what credit is that? And on the other
// side of the square a tax collector and his rough mate do just the same ("="). A jug for a loaf, and the sinners a cup
// for a cup; a loan of three coins noted on a tally and paid back, and the sinners lend to sinners, coin for coin. "But
// love your enemies, do good and lend, expecting nothing": the neighbour from the lane comes asking; the man gives him
// the coins and tears up the tally, and he goes off without a word of thanks. "Your reward will be great, you will be
// sons of the Most High, for He is kind to the ungrateful and the wicked": the plate turns over — the wreath is gold
// and full — and light pours down from above on the man, on the sinners, and on the ungrateful one too.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, palm, house, bush, grass } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { ENEMY, TAXMAN, ROUGH, AFTERNOON, kf, moving, headAt, handAt, heart, thought, equals, wreath6, loaf, cup, jug, coin, ledger, sparkle, storyFrame, halo, rayBurst, figure, tr, PI } from './lib.js';

const GY = 706;
const AX0 = 540, BX0 = 650, TX0 = 950, RX0 = 1060;
const A = { robe: C.dustyBlue, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather };
const B = { robe: C.roseRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.clayMantle, beard: 'short', skin: C.skin3, belt: C.rope };

function sack(c) { return sheet().p(c.cut([[-22, -44], [22, -44], [30, -10], [24, 0], [-24, 0], [-30, -10]], 0.6, 5), C.linen2).p(c.ribbon([[-20, -40], [20, -40]], 4), C.rope).out(); }
function loopArrow(c, r = 56) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, 0, r, r * 0.42, PI * 1.08, PI * 1.92, 16), 5), C.ochre);
  s.p(c.ribbon(c.arc(0, 0, r, r * 0.42, PI * 0.08, PI * 0.92, 16), 5), C.ochre);
  const tipR = [Math.cos(PI * 1.92) * r, Math.sin(PI * 1.92) * r * 0.42], tipL = [Math.cos(PI * 0.92) * r, Math.sin(PI * 0.92) * r * 0.42];
  s.p(c.poly([[tipR[0] - 4, tipR[1] - 10], [tipR[0] + 14, tipR[1] + 2], [tipR[0] - 6, tipR[1] + 8]]) + c.poly([[tipL[0] + 4, tipL[1] + 10], [tipL[0] - 14, tipL[1] - 2], [tipL[0] + 6, tipL[1] - 8]]), C.ochre);
  return s.out();
}
function creditPlate(c, full) {
  const s = sheet().p(c.cut(c.circ(0, 0, 66, 36), 0.5, 5), full ? C.sun : C.haloRim).p(c.cut(c.circ(0, 0, 59, 34), 0.5, 5), C.cream).p(c.cut(c.circ(0, 0, 52, 32), 0.4, 5), full ? mix(C.halo, C.cream, 0.4) : C.parchment);
  const q = full ? `<g transform="translate(0 -2)">${sheet().p(c.cut(c.star(0, 0, 18, 8, 8, 0), 0.3, 3), C.sun).p(c.cut(c.circ(0, 0, 7, 10), 0.2, 2), C.star).out()}</g>` : `<path d="${c.ribbon([...c.arc(0, -12, 9, 9, PI * 1.02, PI * 2.5, 12), [0, 2]], 4.4)}" fill="${C.terracotta}"/><path d="${c.poly(c.circ(0, 11, 3, 8))}" fill="${C.terracotta}"/>`;
  return `${full ? '<circle r="110" fill="url(#halo-glow)"/>' : ''}<path d="M0 -2000V-66" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<g transform="translate(0 -4)">${wreath6(c, 34, { gold: full })}</g>${q}<text x="0" y="92" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="18" font-style="italic" fill="${C.ink}">${tr('wdzięczność?', 'credit?')}</text>`;
}

export default {
  id: 'lk6-credit',
  enter: 'fly',
  beats: [
    { v: 31 },
    { v: 32, text: 'Jeśli bowiem miłujecie tych tylko, którzy was miłują, jakaż za to dla was wdzięczność?' },
    { v: 32, cont: true, text: 'Przecież i grzesznicy miłość okazują tym, którzy ich miłują.' },
    { v: 33, text: 'I jeśli dobrze czynicie tym tylko, którzy wam dobrze czynią, jaka za to dla was wdzięczność?' },
    { v: 33, cont: true, text: 'I grzesznicy to samo czynią.' },
    { v: 34, text: 'Jeśli pożyczek udzielacie tym, od których spodziewacie się zwrotu, jakaż za to dla was wdzięczność?' },
    { v: 34, cont: true, text: 'I grzesznicy grzesznikom pożyczają, żeby tyleż samo otrzymać.' },
    { v: 35, text: 'Wy natomiast miłujcie waszych nieprzyjaciół, czyńcie dobrze i pożyczajcie, niczego się za to nie spodziewając.' },
    { v: 35, cont: true, text: 'A wasza nagroda będzie wielka, i będziecie synami Najwyższego; ponieważ On jest dobry dla niewdzięcznych i złych.' },
  ],
  cam: { x: [-40, 40], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    // phone: the two pairs stand a little closer to the well, the sinners clear of the thread
    const [AX, BX, TX, RX] = S.portrait ? [566, 668, 932, 1026] : [AX0, BX0, TX0, RX0];
    const c = S.c;
    sky(S, AFTERNOON);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1210, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 520, y: 130, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    const mid = S.layer({ par: 0.18, sh: 3 });
    let hs = '';
    [[-300, 150, 120], [-120, 130, 150], [60, 160, 110], [240, 120, 130], [1180, 150, 130], [1350, 120, 110], [1500, 160, 140], [1680, 130, 120]].forEach(([x, w, h]) => { hs += house(c, x, 600, w, h, { stairs: c.chance(0.5) }); });
    mid.add(hillsWith(c, { y: 520, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 18 }).markup + hs + palm(c, 420, 604, 230) + olive(c, 1150, 606, 0.9));
    const G = S.layer({ par: 0.3, sh: 3 });
    const gp = sheet().p(c.cut([[-1400, 596], [3000, 596], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.4));
    let cob = '';
    for (let i = 0; i < 60; i++) cob += c.cut(c.blob(c.rr(-300, 1900), c.rr(630, 1000), c.rr(12, 22), c.rr(5, 9), 8, 0.2), 0.3, 4);
    gp.x(cob, C.stone2, 'opacity=".55"');
    G.add(gp.out());
    // the well
    const w = sheet();
    w.p(c.cut([[740, 650], [740, 600], [860, 600], [860, 650]], 0.5, 6), C.stone2).p(c.cut(c.ell(800, 600, 62, 10, 16), 0.3, 5), shade(C.stone2, -0.3));
    w.p(c.ribbon([[746, 600], [746, 520]], 6) + c.ribbon([[854, 600], [854, 520]], 6) + c.ribbon([[738, 522], [862, 522]], 6), C.wood2);
    w.x(c.ribbon([[800, 522], [800, 570]], 1.4), C.rope);
    G.add(w.out());

    /* light from above (for the end) */
    const lightL = S.layer({ par: 0.32, sh: 1, flat: true });
    const rays = lightL.add(`<g opacity="0">${rayBurst(c, { n: 26, r0: 40, r1: 900, spread: 0.035, color: '#fff3cf', o: 0.5 })}</g>`);
    const spots = [AX, TX, 1240].map(() => lightL.add(`<g opacity="0"><ellipse cx="0" cy="-80" rx="90" ry="150" fill="url(#halo-glow)"/></g>`));

    /* the people */
    const L = S.layer({ par: 0.4, sh: 5 });
    const pa = S.puppet(L.add(person(c, A)));
    const pbK = S.puppet(L.add(person(c, { ...B, pose: 'kneel' })));
    const pb = S.puppet(L.add(person(c, B)));
    const pt = S.puppet(L.add(person(c, TAXMAN)));
    const pr = S.puppet(L.add(person(c, ROUGH)));
    const en = S.puppet(L.add(person(c, ENEMY)));
    const sk = L.add(`<g>${sack(c)}</g>`);
    const items = {
      hA: L.add(`<g opacity="0">${heart(c, 16)}</g>`), hB: L.add(`<g opacity="0">${heart(c, 16)}</g>`),
      hT: L.add(`<g opacity="0">${heart(c, 16)}</g>`), hR: L.add(`<g opacity="0">${heart(c, 16)}</g>`),
      jugA: L.add(`<g opacity="0">${jug(c)}</g>`), loafB: L.add(`<g opacity="0">${loaf(c, 15)}</g>`),
      cupT: L.add(`<g opacity="0">${cup(c)}</g>`), cupR: L.add(`<g opacity="0">${cup(c, C.clay)}</g>`),
      tally: L.add(`<g opacity="0">${ledger(c, 56)}</g>`),
    };
    const coinsL = [0, 1, 2].map(() => L.add(`<g opacity="0">${coin(c, 8)}</g>`));
    const coinsR = [0, 1, 2].map(() => L.add(`<g opacity="0">${coin(c, 8)}</g>`));
    const coinsE = [0, 1, 2].map(() => L.add(`<g opacity="0">${coin(c, 8)}</g>`));
    const shreds = [0, 1, 2, 3].map(() => L.add(`<g opacity="0">${sheet().p(c.cut(c.rect(-8, -5, 16, 10), 0.6, 3), C.parchment).out()}</g>`));

    /* thoughts, signs, the plate of credit */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const wish = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(-4 20) scale(.36)">${figure(c, { ...A, pose: 'kneel' }, { x: -20, y: 0, s: 1, armF: 40, head: 10 })}</g><g transform="translate(14 -16) rotate(150) scale(.3)"><path d="${c.ribbon([[0, 0], [0, 60]], 18)}" fill="${C.skin2}"/></g>`, { w: 92, h: 74 })}</g>`);
    const eq1 = fx.add(`<g opacity="0">${equals(c, 30, C.sun)}</g>`);
    const eq2 = fx.add(`<g opacity="0">${equals(c, 40)}</g>`);
    const loops = [0, 1].map(() => fx.add(`<g opacity="0">${loopArrow(c)}</g>`));
    const plate0 = hanging(fx, creditPlate(c, false), { x: 800, y: -400, len: 0 });
    const plate1 = hanging(fx, creditPlate(c, true), { x: 800, y: -400, len: 0 });
    const help = fx.add(`<g opacity="0">${sparkle(c, 14)}</g>`);
    storyFrame(S);

    /* move an item from one hand to another along an arc: k 0..1 */
    const toss = (el, [x0, y0], [x1, y1], k, on, s = 1) => pose(el, { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(k * PI) * 50, s, o: on });

    return (t, time) => {
      const T = time;
      swing(sunEl, 1210, 140, T, 1, 0.6);
      swing(cl, 520 + Math.sin(T * 0.1) * 20, 130, T, 1.2, 0.6, 1);

      /* v31 — the golden rule */
      const up = es(t, 0.5, 0.56);
      const helpK = es(t, 0.38, 0.52);
      pbK.set({ x: BX, y: GY, s: 0.96, flip: true, armF: 60, armB: 20 + helpK * 50, head: 12, o: 1 - up, blink: blinkAt(T, 4) });
      const eA = bump(t, 1.05, 1.9), eT = bump(t, 2.05, 2.9);     // the embraces
      const w1 = es(t, 3.05, 3.2) * (1 - es(t, 3.9, 4.0)), w2 = es(t, 5.05, 5.2) * (1 - es(t, 5.9, 6.0));
      pa.set({ x: AX + eA * 30, y: GY, s: 0.98, flip: t > 7.05 && t < 7.9 ? false : false, armF: 16 + helpK * (1 - up) * 50 + eA * 60 + w1 * 50 + w2 * 60 + es(t, 7.2, 7.35) * (1 - es(t, 7.7, 7.8)) * 60, armB: 8 + eA * 80 + es(t, 8.1, 8.3) * 120, head: helpK * (1 - up) * 10 - es(t, 8.1, 8.3) * 10, lean: helpK * (1 - up) * 10, blink: blinkAt(T, 1) });
      const bAside = es(t, 6.95, 7.2);
      pb.set({ x: BX - eA * 30 + bAside * 150, y: GY, walk: bAside > 0 && bAside < 1 ? t * 40 : undefined, s: 0.96, flip: true, armF: 20 + eA * 60 + w1 * 50 + w2 * 60 + (t < 1 ? 40 : 0), armB: 10 + eA * 80, head: -2, o: up, blink: blinkAt(T, 4) });
      pt.set({ x: TX + eT * 30, y: GY, s: 0.96, flip: false, armF: 16 + eT * 60 + bump(t, 4.05, 4.9) * 50 + bump(t, 6.05, 6.9) * 60, armB: 8 + eT * 80 + es(t, 8.1, 8.3) * 60, head: -2, blink: blinkAt(T, 2) });
      pr.set({ x: RX - eT * 30, y: GY, s: 0.98, flip: true, armF: 16 + eT * 60 + bump(t, 4.05, 4.9) * 50 + bump(t, 6.05, 6.9) * 60, armB: 8 + eT * 80, head: -2, blink: blinkAt(T, 6) });
      const [ahx, ahy] = headAt(AX, GY, 0.98, false);
      const wk = es(t, 0.08, 0.24, ease.back) * (1 - es(t, 0.9, 1.0));
      pose(wish, { x: ahx - 30, y: ahy - 10, s: wk, o: wk > 0.01 ? 1 : 0 });
      const [bhx, bhy] = handAt(BX, GY, 0.96, true, 60, 'kneel');
      pose(sk, { x: lerp(BX - 30, AX + 40, es(t, 0.56, 0.7)), y: lerp(GY, GY - 60, es(t, 0.56, 0.7)) + (t < 0.56 ? 0 : 0), o: 1 - es(t, 1.0, 1.1) });
      pose(help, { x: BX - 20, y: GY - 200, s: bump(t, 0.52, 0.9), r: T * 30, o: bump(t, 0.52, 0.9) });
      pose(eq1, { x: ahx + 40, y: ahy - 60, s: es(t, 0.6, 0.72, ease.back), o: es(t, 0.6, 0.64) * (1 - es(t, 0.95, 1.05)) });

      /* the plate of credit comes down; at the end it turns over, full */
      const pd = es(t, 1.2, 1.5, ease.back);
      const turn = seg(t, 8.12, 8.3);
      const px = 800, py = lerp(-400, 250, pd);
      pose(plate0, { x: px, y: py, sx: turn < 0.5 ? Math.max(0.04, Math.cos(turn * PI)) : 0.04, r: Math.sin(T * 0.8) * 1.2, oy: 0, o: pd > 0.01 && turn < 0.5 ? 1 : 0 });
      pose(plate1, { x: px, y: py, sx: turn < 0.5 ? 0.04 : Math.max(0.04, -Math.cos(turn * PI)), r: Math.sin(T * 0.8) * 1.2, oy: 0, o: turn >= 0.5 ? 1 : 0 });

      /* v32 — hearts back and forth (friends), and the same with the sinners */
      const loopK = (a) => es(t, a, a + 0.15) * (1 - es(t, a + 0.85, a + 0.95));
      pose(loops[0], { x: (AX + BX) / 2, y: GY - 250, o: Math.max(loopK(1.05), loopK(3.05), loopK(5.05)) });
      pose(loops[1], { x: (TX + RX) / 2, y: GY - 250, o: Math.max(loopK(2.05), loopK(4.05), loopK(6.05)) });
      const L1 = [AX + 40, GY - 230], R1 = [BX - 40, GY - 230], L2 = [TX + 40, GY - 230], R2 = [RX - 40, GY - 230];
      toss(items.hA, L1, R1, es(t, 1.2, 1.45), bump(t, 1.15, 1.9));
      toss(items.hB, R1, L1, es(t, 1.5, 1.75), bump(t, 1.45, 1.95));
      toss(items.hT, L2, R2, es(t, 2.2, 2.45), bump(t, 2.15, 2.9));
      toss(items.hR, R2, L2, es(t, 2.5, 2.75), bump(t, 2.45, 2.95));
      pose(eq2, { x: 800, y: GY - 150, s: 1.3, o: Math.max(bump(t, 2.3, 2.98), bump(t, 4.3, 4.98), bump(t, 6.3, 6.98)) });

      /* v33 — a jug for a loaf; the sinners a cup for a cup */
      const hA = handAt(AX, GY, 0.98, false, 66), hB = handAt(BX, GY, 0.96, true, 66);
      toss(items.jugA, hA, hB, es(t, 3.2, 3.45), bump(t, 3.1, 3.98), 0.8);
      toss(items.loafB, hB, hA, es(t, 3.5, 3.75), bump(t, 3.45, 3.98));
      const hT = handAt(TX, GY, 0.96, false, 66), hR = handAt(RX, GY, 0.98, true, 66);
      toss(items.cupT, hT, hR, es(t, 4.2, 4.45), bump(t, 4.1, 4.98));
      toss(items.cupR, hR, hT, es(t, 4.5, 4.75), bump(t, 4.45, 4.98));

      /* v34 — three coins lent on a tally and paid back; the sinners coin for coin */
      coinsL.forEach((el, i) => {
        const out = es(t, 5.2 + i * 0.05, 5.4 + i * 0.05), back = es(t, 5.55 + i * 0.05, 5.75 + i * 0.05);
        toss(el, hA, hB, out * (1 - back), bump(t, 5.15, 5.98), 1);
      });
      pose(items.tally, { x: AX - 44, y: GY - 120, r: -10, o: bump(t, 5.1, 5.98) });
      coinsR.forEach((el, i) => {
        const out = es(t, 6.2 + i * 0.05, 6.4 + i * 0.05), back = es(t, 6.55 + i * 0.05, 6.75 + i * 0.05);
        toss(el, hT, hR, out * (1 - back), bump(t, 6.15, 6.98), 1);
      });

      /* v35a — the enemy comes asking; the coins given, the tally torn, no thanks */
      const eK = [[7.0, 1500], [7.25, BX], [7.55, BX], [7.95, 1250]];
      const ex = kf(t, eK);
      const leaving = t > 7.55;
      en.set({ x: ex, y: GY, s: 0.98, flip: !leaving, walk: moving(t, eK) ? ex * 0.05 : undefined, armF: 30 + bump(t, 7.2, 7.55) * 50, armB: 10, head: leaving ? 6 : 4, o: seg(t, 6.98, 7.02), blink: blinkAt(T, 7) });
      const hE = handAt(BX, GY, 0.98, true, 60);
      coinsE.forEach((el, i) => {
        const k = es(t, 7.3 + i * 0.04, 7.48 + i * 0.04);
        toss(el, hA, hE, k, es(t, 7.25, 7.3) * (1 - es(t, 7.55, 7.6)), 1);
      });
      const tear = es(t, 7.6, 7.75);
      pose(items.tally, { x: AX - 44, y: GY - 120, r: -10, o: Math.max(bump(t, 5.1, 5.98), es(t, 7.35, 7.4) * (1 - tear)) });
      shreds.forEach((el, i) => {
        const k = seg(t, 7.62, 8.2);
        pose(el, { x: AX - 44 + (i - 1.5) * 14 + k * (i - 1.5) * 30, y: GY - 120 + k * k * 110, r: k * 200 * (i % 2 ? 1 : -1), o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v35b — the reward: light from the Most High on all of them, the ungrateful too */
      const lit = es(t, 8.15, 8.45);
      pose(rays, { x: 800, y: -80, s: 1, r: T * 1.5, o: lit * 0.9 });
      spots.forEach((el, i) => pose(el, { x: [AX, (TX + RX) / 2, 1250][i], y: GY, s: i === 1 ? 1.4 : 1, o: lit * 0.9 }));

      S.cam.x = kf(t, [[-0.5, -30], [0.2, -40], [1.0, -20], [2.0, 20], [3.0, -20], [4.0, 20], [5.0, -20], [6.0, 20], [7.0, 0], [7.4, -20], [8.1, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.2, 1.1], [1.0, 1.08], [8.0, 1.08], [8.4, 1.0]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.2, 36], [1.0, 20], [8.0, 20], [8.4, -10]]);
    };
  },
};
