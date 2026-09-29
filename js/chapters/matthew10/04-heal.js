// Mt 10,7–8 — a village square: Peter and Andrew proclaim, and a golden banner comes down: "The kingdom of heaven
// is at hand". Round the square the other pairs are at work, one command after another: a sick man on his mat
// gets up, a dead girl on her bier sits up, a leper's grey blotches fall away, a dark spirit flies off a tormented
// man. Then the healed man runs up with a full purse — Peter pushes it gently back: light falls from above into his
// open hands, and he gives it on to everyone round him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { village, DAY, L6, LEPER, LEPER_HEALED, POSSESSED, leperSpots, sickOnMat, spirit, purse, heart, spark, sparkle, hungStrip, lightShaft, headAt, hand, folk, tr, PI } from './lib.js';

const GY = 700;
const PX = 810, AX = 744;
// the four at work: [apostle, sufferer x, y]
const MAT = { x: 492, y: 736 }, BIER = { x: 1096, y: 736 }, LEP = { x: 570, y: 668 }, POS = { x: 1034, y: 668 };

export default {
  id: 'mt10-heal',
  beats: [
    { v: 7 },
    { v: 8, text: 'Uzdrawiajcie chorych, wskrzeszajcie umarłych, oczyszczajcie trędowatych, wypędzajcie złe duchy!' },
    { v: 8, cont: true, text: 'Darmo otrzymaliście, darmo dawajcie!' },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const V = village(S, { skyCols: DAY });
    const c = S.c;

    /* the banner and the light from above */
    const flies = S.layer({ par: 0.2, sh: 5 });
    const banner = flies.add(`<g>${hungStrip(c, tr('«Bliskie już jest królestwo niebieskie»', '“The Kingdom of Heaven is at hand!”'), { size: 26, fill: mix(C.halo, C.cream, 0.4) })}</g>`);
    const beam = flies.add(`<g opacity="0">${lightShaft(c, { w0: 24, w1: 80, h: 1200, o: 0.45 })}</g>`);

    /* villagers at the back of the square */
    const back = S.layer({ par: 0.42, sh: 4 });
    const VIL = [[660, 0.62, false], [712, 0.64, false], [900, 0.64, true], [952, 0.62, true]].map(([x, s, flip], i) => ({ x, y: 640 + (i % 2) * 6, s, flip, i, seed: c.rr(0, 9), p: S.puppet(back.add(person(c, folk(c)))) }));
    const leper = S.puppet(back.add(person(c, LEPER)));
    const clean = S.puppet(back.add(person(c, LEPER_HEALED)));
    const spots = leperSpots(c, false).map((sp, i) => ({ ...sp, i, el: back.add(`<g>${sp.m}</g>`), spin: c.rr(-400, 400), dx: c.rr(-40, 40) }));
    const poss = S.puppet(back.add(person(c, POSSESSED)));
    const spir = back.add(`<g>${spirit(c, 1.5)}</g>`);
    const john = S.puppet(back.add(person(c, CAST.john)));
    const philip = S.puppet(back.add(person(c, L6.philip)));

    /* the front: Peter and Andrew, the mat, the bier */
    const P = S.layer({ par: 0.5, sh: 5 });
    const SICK = { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin4 };
    const GIRL = { robe: C.linen, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.1), hair: C.hair2, skin: C.skin, beard: 'none' };
    const mat = P.add(`<g>${sickOnMat(c, SICK, 150)}</g>`);
    const risen = S.puppet(P.add(person(c, SICK)));
    const bier = P.add(`<g>${sickOnMat(c, GIRL, 130)}</g>`);
    const girlUp = S.puppet(P.add(person(c, { ...GIRL, pose: 'sit' })));
    const james = S.puppet(P.add(person(c, { ...CAST.james, pose: 'kneel' })));
    const barth = S.puppet(P.add(person(c, L6.bartholomew)));
    const andrew = S.puppet(P.add(person(c, CAST.andrew)));
    const peter = S.puppet(P.add(person(c, CAST.peter)));

    /* little lights */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const glows = [MAT, BIER, LEP, POS].map(() => fx.add(`<g><circle r="70" fill="url(#warm-glow)"/></g>`));
    const stars = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 14)}</g>`));
    const bag = fx.add(`<g>${purse(c)}</g>`);
    const cup = fx.add(`<g>${spark(c, 16)}</g>`);
    const gifts = VIL.map(() => fx.add(`<g>${heart(c, 13)}</g>`));

    return (t, time) => {
      const T = time;
      V.update(t, T);

      /* v7 — "the kingdom of heaven is at hand" */
      const bk = es(t, 0.15, 0.5, ease.back);
      pose(banner, { x: 820, y: lerp(-400, 200, bk), r: Math.sin(T * 0.8) * 1.2, o: bk > 0.002 ? 1 : 0 });
      const procl = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.2));
      const recv = es(t, 2.35, 2.55), give = es(t, 2.6, 2.8);
      const refuse = bump(t, 2.1, 2.5);
      peter.set({ x: PX, y: GY + 16, s: 1.02, flip: false, armB: 20 + procl * 130 + recv * 40 * (1 - give) + give * 120, armF: 20 + procl * 40 + refuse * 70 + recv * 50 + give * 50, head: -procl * 6 - recv * 10 * (1 - give), blink: blinkAt(T, 1) });
      andrew.set({ x: AX, y: GY + 6, s: 0.96, armF: 20 + procl * 60 + give * 60, armB: 10 + procl * 40, head: -procl * 4, blink: blinkAt(T, 2) });
      VIL.forEach((v) => {
        const turn = es(t, 0.3 + v.i * 0.06, 0.6 + v.i * 0.06);
        v.p.set({ x: v.x, y: v.y, s: v.s, flip: v.x > PX, head: -turn * 6 + bump(t, 2.65, 3.0) * -8, armF: 14 + bump(t, 2.7, 3.0) * 60, blink: blinkAt(T, v.seed) });
      });

      /* v8a — heal, raise, cleanse, cast out (in turn) */
      const A = [es(t, 1.05, 1.22), es(t, 1.2, 1.38), es(t, 1.36, 1.54), es(t, 1.52, 1.7)];
      const W = [bump(t, 1.0, 1.3), bump(t, 1.15, 1.45), bump(t, 1.3, 1.6), bump(t, 1.47, 1.77)];
      // the sick man on his mat gets up
      const up = A[0];
      pose(mat, { x: MAT.x, y: MAT.y, s: 1, o: 1 });
      const walkTo = es(t, 2.0, 2.25);
      const rx = lerp(MAT.x + 30, PX + 96, walkTo);
      risen.set({ x: rx, y: lerp(MAT.y - 6, GY + 22, walkTo), s: 0.9, flip: walkTo > 0.9, o: up > 0.5 ? 1 : 0, walk: walkTo > 0 && walkTo < 1 ? rx * 0.06 : undefined, armF: up * 60 + bump(t, 1.1, 1.9) * 60 + walkTo * 40, armB: up * 140 * (1 - walkTo), head: -8 + walkTo * 8, blink: blinkAt(T, 3) });
      james.set({ x: MAT.x - 96, y: MAT.y - 4, s: 0.86, armF: 30 + W[0] * 50, armB: 10, head: 8 - up * 12, blink: blinkAt(T, 4) });
      fade(mat.querySelector('g[transform*="rotate(-90)"]'), 1 - (up > 0.5 ? 1 : 0));
      // the girl on her bier sits up
      const sit = A[1];
      pose(bier, { x: BIER.x, y: BIER.y, sx: -1, o: 1 });
      fade(bier.querySelector('g[transform*="rotate(-90)"]'), sit > 0.5 ? 0 : 1);
      girlUp.set({ x: BIER.x + 30, y: BIER.y - 6, s: 0.74, flip: true, o: sit > 0.5 ? 1 : 0, armF: 40 + sit * 40, armB: sit * 80, head: -6, blink: blinkAt(T, 5) });
      barth.set({ x: BIER.x - 104, y: BIER.y - 10, s: 0.86, armF: 30 + W[1] * 60, armB: W[1] * 40, head: 6 - sit * 8, blink: blinkAt(T, 6) });
      // the leper made clean
      const cl = A[2];
      leper.set({ x: LEP.x, y: LEP.y, s: 0.74, flip: true, o: 1 - es(t, 1.44, 1.5), head: 8 * (1 - cl), armF: 40, blink: blinkAt(T, 7) });
      clean.set({ x: LEP.x, y: LEP.y, s: 0.74, flip: true, o: es(t, 1.44, 1.5), armB: cl * 130, armF: cl * 80, head: -6, blink: blinkAt(T, 7) });
      spots.forEach((sp) => {
        const k = seg(t, 1.38 + sp.i * 0.008, 1.62 + sp.i * 0.008);
        pose(sp.el, { x: LEP.x - sp.x * 0.74 + sp.dx * k, y: LEP.y + sp.y * 0.74 + k * k * 110, r: k * sp.spin, s: 0.74, o: k < 1 ? 1 - k * 0.4 : 0 });
      });
      john.set({ x: LEP.x - 70, y: LEP.y + 4, s: 0.76, armF: 30 + W[2] * 60, armB: 10, blink: blinkAt(T, 8) });
      // the spirit driven out
      const out = A[3];
      const shake = (1 - out) * Math.sin(T * 22) * 4 * es(t, 1.4, 1.5);
      poss.set({ x: POS.x, y: POS.y, s: 0.74, flip: false, lean: shake, armF: (1 - out) * 110 + out * 20, armB: (1 - out) * 150 + out * 10, head: shake * 2 - out * 6, blink: blinkAt(T, 9) });
      const [shx, shy] = headAt(POS.x, POS.y, 0.74, false);
      pose(spir, { x: shx + 6 + out * 260, y: shy - 36 - out * 300 + Math.sin(T * 2) * 5, r: out * 120 + Math.sin(T * 3) * 8, s: 1 - out * 0.5, o: 1 - es(t, 1.62, 1.72) });
      philip.set({ x: POS.x + 72, y: POS.y + 4, s: 0.76, flip: true, armF: 30 + W[3] * 70, armB: W[3] * 80, blink: blinkAt(T, 10) });
      [MAT, BIER, LEP, POS].forEach((q, i) => {
        const g = bump(t, 1.02 + i * 0.16, 1.02 + i * 0.16 + 0.5) + es(t, 1.02 + i * 0.16 + 0.2, 1.3 + i * 0.16) * 0.35 * (1 - es(t, 1.95, 2.1));
        pose(glows[i], { x: q.x, y: q.y - (i < 2 ? 60 : 110), s: 1 + g * 0.4, o: g });
        const st = es(t, 1.1 + i * 0.16, 1.28 + i * 0.16, ease.back) * (1 - es(t, 1.95, 2.05));
        pose(stars[i], { x: q.x + 20, y: q.y - (i < 2 ? 110 : 170), s: st, r: T * 30, o: st > 0.01 ? 1 : 0 });
      });

      /* v8b — freely received, freely give */
      const offer = es(t, 2.18, 2.3) * (1 - es(t, 2.4, 2.5));
      const [bx, by] = hand(rx, GY + 22, 0.9, true, 100);
      pose(bag, { x: bx + 6, y: by - 12 + (1 - offer) * 10, s: 0.9, o: offer > 0.01 ? 1 : 0 });
      const sh = es(t, 2.3, 2.5);
      pose(beam, { x: PX + 20, y: GY - 100, o: sh * (1 - es(t, 2.95, 3.0) * 0.3) });
      const [chx, chy] = hand(PX, GY + 16, 1.02, false, 20 + recv * 50 + give * 50);
      pose(cup, { x: chx, y: lerp(-100, chy - 8, es(t, 2.3, 2.5)), s: 0.9 + give * 0.3, r: T * 20, o: sh > 0.01 ? 1 : 0 });
      gifts.forEach((g, i) => {
        const v = VIL[i];
        const k = es(t, 2.62 + i * 0.04, 2.85 + i * 0.04);
        const [hx, hy] = headAt(v.x, v.y, v.s, v.flip);
        pose(g, { x: lerp(chx, hx, k), y: lerp(chy, hy - 40, k) - Math.sin(k * PI) * 60, s: 0.4 + k * 0.6, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.y = -bump(t, 0, 1.0) * 30;
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.05;
      S.cam.x = es(t, 1.9, 2.3) * 10;
    };
  },
};
