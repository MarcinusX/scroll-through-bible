// Łk 16,25–26 — the same world beyond death. "But Abraham said: Child, remember that you in your lifetime received your
// good things, and Lazarus in like manner bad things": Abraham raises his hand, and a pair of scales comes down over the
// chasm — on the rich man's side the pan heavy with gold, a dish of the feast and a fold of purple, sunk low; on
// Lazarus' side a crust and a rag, high up and light. "But now he is comforted here, and you are in anguish": the
// scales swing over — Lazarus' pan fills with light and goes down, the rich man's flies up and its gold spills out and
// tumbles into the dark. "And besides all this, between us and you a great chasm has been fixed, so that those who
// would pass from here to you may not be able, and none may cross from there to us": the scales go up; the two lands
// draw apart and the chasm opens wider and deeper; a plank is pushed out from the height, falls short, tips and drops
// into the depth, and the rich man's hands reach out over the edge in vain.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { afterSet, AF, RICH_DEAD, LAZ_BLEST, ABRAHAM, scalesParts, poseScales, coin, platter, crumb, plank, glow, sparkle, headAt, kf, tr, es, ease, bump, seg, PI } from './lib.js';

const HY = AF.HY, TOP = AF.TOP;
const BX = 800, BY = 230, ARM = 150;

export default {
  id: 'lk16-chasm',
  parable: true,
  beats: [
    { v: 25, text: 'Lecz Abraham odrzekł: "Wspomnij, synu, że za życia otrzymałeś swoje dobra, a Łazarz przeciwnie, niedolę;' },
    { v: 25, cont: true, text: 'teraz on tu doznaje pociechy, a ty męki cierpisz.' },
    { v: 26 },
  ],
  cam: { x: [-20, 40], y: [-40, 60], z: [1, 1.08] },
  build(S) {
    const A = afterSet(S);
    const c = A.c;
    const abr = S.puppet(A.abr.add(person(c, { ...ABRAHAM, pose: 'sit' })));
    const laz = S.puppet(A.abr.add(person(c, { ...LAZ_BLEST, pose: 'sit' })));
    const board = A.abr.add(`<g>${plank(c, 150)}</g>`);
    const rich = S.puppet(A.act.add(person(c, { ...RICH_DEAD, pose: 'kneel' })));
    /* the scales and what lies in the pans */
    const sp = scalesParts(c, { arm: ARM, drop: 90 });
    const els = { frame: A.fly.add(`<g>${sp.frame}</g>`), beam: A.fly.add(`<g>${sp.beam}</g>`), panL: A.fly.add(`<g>${sp.pan}</g>`), panR: A.fly.add(`<g>${sp.pan}</g>`) };
    const goods = A.fly.add(`<g>${sheet().p(c.cut(c.blob(0, -6, 30, 8, 10, 0.2), 0.4, 4), mix(C.plumRobe, C.curtain2, 0.35)).out()}<g transform="translate(-6 -10)">${platter(c, { w: 44 })}</g></g>`);
    const gold = [0, 1, 2, 3, 4].map((i) => ({ i, el: A.fly.add(`<g>${coin(c, 7)}</g>`) }));
    const poor = A.fly.add(`<g><g transform="translate(-8 -6)">${crumb(c, 8)}</g>${sheet().p(c.cut([[4, -4], [22, -8], [24, -2], [6, 2]], 0.6, 3), mix(C.sand2, C.stone2, 0.5)).out()}</g>`);
    const comfort = A.fly.add(`<g opacity="0">${glow(40, 1, 'halo-glow')}${sparkle(c, 14)}</g>`);

    return (t, time) => {
      const T = time;
      A.update(t, T, { fl: 1, heatX: AF.RX + 20 });
      /* Abraham speaks */
      const speak = es(t, 0.05, 0.2) * (1 - es(t, 2.6, 2.9));
      abr.set({ x: AF.AX, y: A.hfn(AF.AX) + 4, s: 0.9, armF: 60, armB: 40 + speak * 110, head: 2, blink: blinkAt(T, 1) });
      laz.set({ x: AF.AX + 52, y: A.hfn(AF.AX + 52) + 8, s: 0.8, armF: 20, armB: 10, head: -4, lean: -8, blink: blinkAt(T, 3) });
      /* the scales: then (heavy on his side), now (heavy on Lazarus' side), gone */
      const dk = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 2.05, 2.3, ease.in));
      const by = lerp(-500, BY, dk);
      const swing = es(t, 1.08, 1.4, ease.out);
      const a = lerp(16, -16, swing);                                   // + tips the right pan down
      poseScales(els, BX, by, a, dk > 0.004 ? 1 : 0, 1, ARM);
      const r = (a * PI) / 180;
      const pL = [BX - Math.cos(r) * ARM, by - Math.sin(r) * ARM + 90], pR = [BX + Math.cos(r) * ARM, by + Math.sin(r) * ARM + 90];
      pose(goods, { x: pR[0], y: pR[1], o: dk > 0.004 ? 1 : 0 });
      pose(poor, { x: pL[0], y: pL[1], o: dk > 0.004 ? 1 - es(t, 1.1, 1.3) : 0 });
      pose(comfort, { x: pL[0], y: pL[1] - 14, s: 0.6 + swing * 0.5, o: es(t, 1.1, 1.3) * (dk > 0.004 ? 1 : 0), r: T * 20 });
      gold.forEach((g) => {
        const fall = es(t, 1.3 + g.i * 0.04, 1.9 + g.i * 0.04, ease.in);
        const x0 = pR[0] - 16 + g.i * 8, y0 = pR[1] - 6 - (g.i % 2) * 6;
        pose(g.el, { x: lerp(x0, AF.EDGE + 90 + g.i * 10, fall), y: lerp(y0, 1100, fall), r: fall * 400, o: dk > 0.004 && fall < 0.97 ? 1 : 0 });
      });
      /* v26 — the chasm opens; the plank falls short */
      const wide = es(t, 2.1, 2.5);
      A.height.shift(-wide * 50, 0); A.abr.shift(-wide * 50, 0); A.light.shift(-wide * 50, 0);
      A.hades.shift(wide * 50, 0); A.fire.shift(wide * 50, 0); A.act.shift(wide * 50, 0); A.heat.shift(wide * 50, 0);
      A.chasm.shift(0, 0);
      const push = es(t, 2.45, 2.6);
      const tip = es(t, 2.6, 2.95, ease.in);
      const ex = AF.EDGE - 110 + push * 100;
      pose(board, { x: ex + tip * 40, y: A.hfn(AF.EDGE - 20) - 2 + tip * 500, r: tip * 70, o: push > 0 ? 1 - es(t, 2.93, 2.99) : 0 });
      const reach = es(t, 2.5, 2.7);
      rich.set({ x: AF.RX + 10 - reach * 60, y: HY + 2, s: 1.0, flip: true, armF: 80 + reach * 20 - bump(t, 0.2, 0.9) * 40, armB: 100 + reach * 20 - bump(t, 0.2, 0.9) * 60, head: -10 + bump(t, 0.2, 0.9) * 20, blink: blinkAt(T, 2) });

      S.cam.x = kf(t, [[-0.5, 20], [2.0, 20], [2.4, 0]]);
      S.cam.y = kf(t, [[-0.5, 30], [2.0, 0], [2.4, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [2.0, 1.02], [2.4, 1.0]]);
    };
  },
};
