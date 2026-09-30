// Łk 5,27–28 — the road out of Capernaum along the lake, and the tax booth under its striped awning. A traveller pays
// his toll; behind the counter sits a tax collector named Levi (his tag comes down), counting coins onto the scale.
// Jesus comes out along the road with the four and stops: "Follow me!" — a warm light runs across to Levi, and the coin
// drops from his fingers. He gets up and walks out after Jesus, leaving everything where it lies: the stacks of coins,
// the scale, the open ledger, glinting on the empty counter.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { house, palm, cypress, grass, rock, bush } from '../../assets/nature.js';
import {
  lakeSet, taxBooth, coin, coinStack, coinScale, ledger, nameTag, sparkle, voiceRings, withFace, faceBits, headAt, hand, kf, moving, townsfolk,
  LEVI, DAY, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const P = 0.5, Y = 716;
const BX = 1010;                      // the booth
const CT = Y - 96;                    // the counter top
const JX1 = 700;                      // where Jesus stops
const DIS = ['peter', 'andrew', 'james', 'john'];

export default {
  id: 'lk5-levi',
  beats: [
    { v: 27, text: 'Potem wyszedł i zobaczył celnika, imieniem Lewi, siedzącego w komorze celnej.' },
    { v: 27, cont: true, text: 'Rzekł do niego: «Pójdź za Mną!»' },
    { v: 28 },
  ],
  cam: { x: [-240, 200], y: [0, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const K = lakeSet(S, { skyCols: DAY, sunAt: [1260, 140], lakeY: 440 });
    // the road, the edge of the town on the left
    const townL = S.layer({ par: 0.3, sh: 3 });
    let hs = '';
    [[-420, 150, 110], [-250, 120, 90], [-110, 140, 120], [40, 110, 84], [170, 130, 100]].forEach(([x, w, h], i) => { hs += house(c, x, 590 + (i % 2) * 6, w, h, { stairs: i % 2 === 0 }); });
    townL.add(hs + palm(c, 280, 596, 170) + cypress(c, -40, 594, 120));
    const road = S.layer({ par: P, sh: 3 });
    const rfn = c.wave(640, [4, 2], [700, 180]);
    road.add(sheet().p(c.ridge(rfn, -1400, 3000, 1700, 12, 1), mix(C.sand, C.hillNear, 0.25)).out());
    road.add(sheet().p(c.ribbon([[-1400, 740], [300, 732], [900, 736], [1600, 730], [3000, 738]], 70, 2), mix(C.sand, C.cream, 0.3)).out());
    road.add(grass(c, { x0: -900, x1: 2400, y: 0, fn: (x) => rfn(x) + 10, n: 40, h: 14, color: C.olive }) + rock(c, 1400, 712, 80, 28, C.rock2) + bush(c, 470, 690, 70, C.sage, C.moss));

    /* the booth, Levi behind the counter, the things on it */
    const bL = S.layer({ par: P, sh: 4 });
    const TB = taxBooth(c, 250, 250);
    bL.add(`<g transform="translate(${BX} ${Y})">${TB.back}</g>`);
    const leviSit = S.puppet(bL.add(withFace(person(c, { ...LEVI, pose: 'sit' }), faceBits(c))));
    bL.add(`<g transform="translate(${BX} ${Y})">${TB.front}</g>`);
    const stacks = [[-80, 5], [-54, 7], [58, 4]].map(([dx, n]) => bL.add(`<g transform="translate(${BX + dx} ${CT})">${coinStack(c, n, 9)}</g>`));
    bL.add(`<g transform="translate(${BX + 10} ${CT})">${coinScale(c)}</g><g transform="translate(${BX + 96} ${CT + 1})">${ledger(c, 64)}</g>`);
    const spill = [0, 1, 2, 3, 4].map((i) => ({ i, el: bL.add(`<g>${coin(c, 7)}</g>`), x: BX - 70 + i * 9, to: BX - 110 + i * 20 }));
    const dropCoin = bL.add(`<g>${coin(c, 7)}</g>`);
    const glints = [0, 1, 2].map(() => bL.add(`<g>${sparkle(c, 10)}</g>`));

    /* the traveller paying; Jesus and the four; Levi walking after Him */
    const PL = S.layer({ par: P, sh: 5 });
    const trav = S.puppet(PL.add(person(c, townsfolk(c, { man: true, robe: C.ochreRobe, mantle: C.stone, holdB: `<g transform="translate(0 -6)">${sheet().p(c.cut(c.blob(0, 0, 18, 14, 10, 0.2), 0.5, 4), C.linen2).x(c.ribbon([[-14, -4], [14, 4]], 2), C.rope).out()}</g>` }))));
    const payCoin = PL.add(`<g>${coin(c, 7)}</g>`);
    const dis = DIS.map((k, i) => ({ k, i, p: S.puppet(PL.add(person(c, CAST[k]))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(PL.add(person(c, CAST.jesus)));
    const levi = S.puppet(PL.add(withFace(person(c, LEVI), faceBits(c))));
    const voice = voiceRings(PL, c, { n: 3, color: C.sun, r: 36, w: 6, both: false });
    const beam = PL.add(`<g><path d="${c.poly([[0, -12], [100, -30], [100, 30], [0, 12]])}" fill="url(#warm-glow)" opacity=".9"/></g>`);
    const TL = S.layer({ par: 0.4, sh: 6 });
    const tag = TL.add(`<g><path d="M0 -1600V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, [tr('Lewi,', 'Levi,'), tr('celnik', 'a tax collector')], { size: 18 })}</g>`);

    const JKEYS = [[0.0, 120], [0.55, JX1], [2.05, JX1], [2.9, 540]];

    return (t, time) => {
      const T = time;
      K.idle(T);

      /* v27a — the traveller pays; Levi counts; Jesus comes along the road and sees him */
      const tk = [[0, 1260], [0.25, 1150], [0.55, 1150], [0.85, 1420]];
      const tx = kf(t, tk, (u) => u);
      trav.set({ x: tx, y: Y + 14, s: 0.96, flip: t < 0.55, walk: moving(t, tk) ? tx * 0.05 : undefined, armF: 14 + bump(t, 0.25, 0.55) * 60, armB: 20, blink: blinkAt(T, 7) });
      const pk = seg(t, 0.35, 0.5);
      const [thx, thy] = hand(1150, Y + 14, 0.96, true, 70);
      pose(payCoin, { x: lerp(thx, BX + 40, pk), y: lerp(thy, CT - 30, pk) - Math.sin(pk * PI) * 20, o: pk > 0 && pk < 1 ? 1 : 0 });
      const up = es(t, 1.05, 1.25);
      const rise = es(t, 2.08, 2.14);
      const count = (T ? Math.max(0, Math.sin(T * 4)) : 0.5) * (1 - up);
      leviSit.set({ x: BX - 8, y: CT + 44, s: 0.94, flip: true, o: 1 - rise, armF: 40 + count * 30 + up * 20, armB: 30 + bump(t, 0.35, 0.6) * 30, head: 12 * (1 - up) - up * 6, blink: blinkAt(T, 4) });
      const jx = kf(t, JKEYS, ease.sine);
      const call = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      jesus.set({ x: jx, y: Y + 4, s: 1.04, flip: t > 2.05, walk: moving(t, JKEYS) ? jx * 0.05 : undefined, armF: 14 + call * 76, armB: 8 + call * 30, head: -call * 4, blink: blinkAt(T) });
      dis.forEach((d) => {
        const x = Math.min(jx - 110 - d.i * 70, kf(t, [[0, -40 - d.i * 70], [0.6, JX1 - 120 - d.i * 70]], ease.sine) + (t > 2.05 ? -(JX1 - jx) : 0));
        const mv = (t > 0 && t < 0.6) || (t > 2.05 && t < 2.8);
        d.p.set({ x, y: Y + 10 + (d.i % 2) * 8, s: 0.98, flip: t > 2.05, walk: mv ? x * 0.05 + d.i : undefined, armF: 12 + bump(t, 1.2, 1.9) * (d.i === 0 ? 20 : 0), blink: blinkAt(T, d.seed) });
      });
      const tg = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      pose(tag, { x: BX + 10, y: lerp(-400, 346, tg), r: T ? Math.sin(T * 0.8) * 1.4 : 0, o: tg > 0.01 ? 1 : 0 });

      /* v27b — "Follow me!": a warm light runs across to him; the coin drops */
      const [hx, hy] = headAt(jx, Y + 4, 1.04, false);
      voice(hx + 16, hy, call, T, { dir: 1, spread: 2.2 });
      const bk = es(t, 1.1, 1.4) * (1 - es(t, 2.1, 2.3));
      const len = BX - 40 - hx;
      pose(beam, { x: hx + 20, y: hy + 30, sx: (len / 100) * bk, sy: 1, o: bk * 0.9 });
      const dk = es(t, 1.25, 1.45, ease.in);
      pose(dropCoin, { x: BX - 44, y: lerp(CT - 50, CT - 4, dk), r: dk * 200, o: t > 1.2 && t < 2.9 ? 1 : 0 });

      /* v28 — he leaves everything, rises and follows Him */
      const LK = [[2.12, BX - 150], [2.9, 690]];
      const lx = kf(t, LK, ease.sine);
      levi.set({ x: lx, y: Y + 12, s: 0.96, flip: true, o: rise, walk: moving(t, LK) ? lx * 0.05 : undefined, armF: 14, armB: 10, head: -2, blink: blinkAt(T, 4) });
      spill.forEach((sp) => { const k = es(t, 2.1 + sp.i * 0.02, 2.3 + sp.i * 0.02, ease.out); pose(sp.el, { x: lerp(sp.x, sp.to, k), y: CT - 4 - Math.sin(k * PI) * 16, r: k * 90 * (sp.i % 2 ? 1 : -1), o: t > 2.08 ? 1 : 0 }); });
      pose(stacks[0], { r: es(t, 2.1, 2.2) * -60, x: 0, y: 0, o: 1 - es(t, 2.1, 2.14) });
      glints.forEach((g, i) => { const k = ((T * 0.6 + i / 3) % 1); pose(g, { x: BX - 60 + i * 60, y: CT - 20, s: bump(k, 0, 1), r: T * 40, o: es(t, 2.3, 2.6) * bump(k, 0, 1) }); });

      S.cam.x = kf(t, [[0, -60], [0.6, 60], [1.0, 80], [1.3, 140], [2.0, 140], [2.9, -160], [3, -160]]);
      S.cam.y = kf(t, [[0, 50], [1.3, 60], [3, 50]]);
      S.cam.z = kf(t, [[0, 1.04], [0.6, 1.06], [1.3, 1.12], [2.0, 1.12], [3, 1.06]]);
    };
  },
};
