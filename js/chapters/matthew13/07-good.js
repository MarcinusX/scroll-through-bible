// Mt 13,22–23 — the same cut-open field, now with the thorny patch on the left and the good soil on the right,
// Jesus sowing the word from the knoll between. The rich man among the thorns hears the word and a shoot comes up —
// then thorn tendrils climb round him carrying the cares of the age (an hourglass, a storm cloud) and the deceit of
// riches (a purse, coins, a jewel); he reaches for them, the thorns close over the shoot and it withers. The woman
// on the good soil hears and understands: the word settles in her heart and sprouts, the flap lifts on deep dark
// earth where roots spread, and the wheat rises in three sheaves: a hundredfold, sixty, thirty.
import { C, person, CAST, blinkAt, pose, lerp, sheet, hanging, swing } from '../kit.js';
import { thornBush, wheatStalk, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade, clamp } from '../../core/anim.js';
import {
  soilStage, XP, FFACE, FLAPB, FEET, LISTEN, addHeart, wordSeed, sproutRig, rootPieces, rootLines, tendril,
  hourglassT, worryCloud, coinsT, moneyBag, gem, track, arcAt, PI,
} from './lib.js';

const camFor = (x) => (x - 800) / 0.6 * 0.62;
const SYM = { hourglassT, worryCloud, coinsT, moneyBag, gem };

export default {
  id: 'mt13-good',
  parable: true,
  beats: [
    { v: 22, text: 'Posiane między ciernie oznacza tego, kto słucha słowa,' },
    { v: 22, cont: true, text: 'lecz troski doczesne i ułuda bogactwa zagłuszają słowo, tak że zostaje bezowocne.' },
    { v: 23, text: 'Posiane w końcu na ziemię żyzną oznacza tego, kto słucha słowa i rozumie je.' },
    { v: 23, cont: true, text: 'On też wydaje plon: jeden stokrotny, drugi sześćdziesięciokrotny, inny trzydziestokrotny».' },
  ],
  cam: { x: [camFor(XP.L) - 20, camFor(XP.R) + 20], y: [0, 130], z: [0.96, 1.4] },
  build(S) {
    const St = soilStage(S, { left: 'thorn', right: 'good', sky2: ['#f1dca0', '#f7e2a6', C.cream] });
    const c = St.c;

    /* the good soil: deep roots under its flap; three clusters of wheat */
    const CL = [{ x: XP.R - 110, n: 10, h: [152, 182], label: '100', ly: 300 }, { x: XP.R + 10, n: 6, h: [128, 150], label: '60', ly: 336 }, { x: XP.R + 118, n: 3, h: [104, 124], label: '30', ly: 372 }];
    const rootGood = St.ground.add(`<g>${rootPieces(c, CL.flatMap((cl, i) => rootLines(c, cl.x, FFACE + 2, 112 - i * 22, 30 - i * 6, 5 - i)), 3.2)}</g>`);
    const rsGood = Array.from(rootGood.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    const flapThorn = St.ground.add(`<g>${St.flap(XP.L)}</g>`);
    const flapGood = St.ground.add(`<g>${St.flap(XP.R)}</g>`);
    St.plants.add(thornBush(c, XP.L - 170, 596, 90, C.thorn2) + thornBush(c, XP.L - 120, 578, 64, C.thorn) + thornBush(c, XP.L + 170, 598, 96, C.thorn2));
    const thornSprout = St.plants.add(sproutRig(c, 40));
    const choke = St.plants.add(`<g>${thornBush(c, 0, 0, 105, C.thorn2)}${thornBush(c, 16, 0, 80, C.thorn)}</g>`);
    const goodSprouts = CL.map(() => St.plants.add(sproutRig(c, 22)));
    const clusters = CL.map((cl) => {
      const stalks = [];
      for (let j = 0; j < cl.n; j++) {
        const dx = (j - (cl.n - 1) / 2) * (cl.n > 6 ? 9.5 : 12) + c.rr(-3, 3);
        const h = c.rr(cl.h[0], cl.h[1]) - Math.abs(dx) * 0.25;
        stalks.push({ el: St.plants.add(`<g>${wheatStalk(c, { h })}</g>`), dx, ph: c.rr(0, 6), d: c.rr(0, 0.12) });
      }
      return stalks;
    });

    /* the tendrils with the cares and riches */
    const TD = [
      { x: XP.L - 150, len: 250, lean: -35, sym: 'hourglassT', back: true, at: 1.1 },
      { x: XP.L - 100, len: 316, lean: 42, sym: 'worryCloud', back: true, at: 1.17 },
      { x: XP.L + 150, len: 300, lean: -60, sym: 'gem', back: true, at: 1.38 },
      { x: XP.L - 10, len: 212, lean: 44, sym: 'moneyBag', back: false, at: 1.24 },
      { x: XP.L + 90, len: 170, lean: 36, sym: 'coinsT', back: false, at: 1.31 },
    ];
    const tds = TD.map((d) => {
      const L = d.back ? St.plants : St.fx;
      const { d: path, tip } = tendril(c, d.len, d.lean);
      const grow = L.add(`<g>${sheet().p(path, C.thorn).out()}</g>`);
      const sym = L.add(`<g>${SYM[d.sym](c)}</g>`);
      return { ...d, grow, sym, tip, glints: Array.from(sym.querySelectorAll('.glint')) };
    });

    /* people */
    const bag = sheet().p(c.cut(c.blob(0, 16, 13, 15, 12, 0.12), 0.4, 4), C.basket).p(c.ribbon([[-6, 3], [6, 3]], 3), C.rope).out();
    const jesus = S.puppet(St.people.add(person(c, { ...CAST.jesus, holdB: bag })));
    const thornM = S.puppet(St.people.add(person(c, LISTEN.thorn)));
    const thornH = addHeart(thornM, c, 'thorn', LISTEN.thorn.robe);
    const goodW = S.puppet(St.people.add(person(c, LISTEN.good)));
    const goodH = addHeart(goodW, c, 'good', LISTEN.good.robe);

    /* fx: seeds in flight, labels, golden motes */
    const seedT = St.fx.add(`<g>${wordSeed(c)}</g>`);
    const seedG = St.fx.add(`<g>${wordSeed(c)}</g>`);
    const goodSeeds = CL.map(() => St.fx.add(`<g>${wordSeed(c, { glow: 18 })}</g>`));
    const labels = CL.map((cl, i) => ({ ...cl, i, el: hanging(St.fx, paperLabel(cl.label, { size: 36 - i * 3, fill: C.cream }), { x: cl.x, y: cl.ly, len: 400 }) }));
    const motes = Array.from({ length: 14 }, () => ({
      el: St.fx.add(`<g opacity="0"><circle r="9" fill="url(#warm-glow)"/><path d="${c.poly(c.circ(0, 0, 2, 6))}" fill="${C.star}"/></g>`),
      x: c.rr(XP.R - 200, XP.R + 200), y0: c.rr(430, 600), off: c.rr(0, 1), sp: c.rr(0.7, 1.3),
    }));

    const CAMX = [[0, camFor(640)], [0.3, camFor(XP.L)], [1.95, camFor(XP.L)], [2.3, camFor(XP.R)], [3.2, camFor(XP.R)], [3.7, camFor(1090)]];
    const CAMZ = [[0, 1.14], [0.3, 1.28], [1.0, 1.28], [1.3, 1.2], [1.95, 1.2], [2.3, 1.3], [2.6, 1.3], [2.9, 1.24], [3.2, 1.24], [3.7, 1.02]];
    const CAMY = [[0, 70], [0.3, 90], [1.0, 90], [1.3, 70], [1.95, 70], [2.3, 90], [2.6, 90], [2.9, 118], [3.2, 118], [3.7, 60]];
    const X_T = XP.L + 30, X_G = XP.R - 160;

    return (t, time) => {
      S.cam.x = track(t, CAMX); S.cam.z = track(t, CAMZ); S.cam.y = track(t, CAMY);
      const gold = es(t, 3.05, 3.8);
      St.sk2L.fade(gold);
      St.update(time);

      /* Jesus sows: left in v22, right in v23 */
      const sowL = bump(t, 0.0, 0.3), sowR = bump(t, 2.0, 2.3);
      jesus.set({
        x: XP.J, y: 592, s: 1.1, flip: t < 1.95,
        armF: 20 + 118 * Math.max(sowL, sowR) + bump(t, 3.1, 3.9) * 90 + Math.sin(time * 0.9) * 3,
        armB: 12 + Math.max(sowL, sowR) * 10 + bump(t, 3.1, 3.9) * 60, head: -Math.max(sowL, sowR) * 6, lean: Math.max(sowL, sowR) * 5, blink: blinkAt(time),
      });

      /* v22a: the man among the thorns hears; a shoot comes up */
      const tl = seg(t, 0.06, 0.3);
      {
        const [x, y] = arcAt(ease.out(tl), [XP.J - 40, 400], [X_T - 7, FEET - 116], 110);
        pose(seedT, { x, y, s: 1.4, r: (1 - tl) * 200, o: seg(t, 0.05, 0.08) * (1 - seg(t, 0.3, 0.33)) });
      }
      const listen = es(t, 0.3, 0.5);
      const reach = es(t, 1.35, 1.6);
      const grip = es(t, 1.7, 1.9);
      thornM.set({
        x: X_T, y: FEET, s: 1.08, flip: false,
        armF: 6 + listen * 22 * (1 - reach) + reach * 74 - grip * 8, armB: 4 + reach * 14,
        head: listen * 9 * (1 - reach) - reach * 12 + grip * 6, blink: blinkAt(time, 3),
      });
      thornH({ open: es(t, 0.3, 0.42), seed: es(t, 0.3, 0.38) * (1 - es(t, 1.8, 1.95)), glow: es(t, 0.3, 0.38) * (1 - es(t, 1.75, 1.95)), thorn: es(t, 1.2, 1.6) * 0.9 + grip * 0.3 });
      {
        const g = es(t, 0.42, 0.7, ease.out);
        const wilt = es(t, 1.7, 1.92);
        pose(thornSprout, { x: X_T + 60, y: 612, sy: g * (1 - wilt * 0.2), sx: 0.6 + 0.4 * g });
        fade(thornSprout.querySelector('.fresh'), 1 - wilt);
        fade(thornSprout.querySelector('.wilt'), wilt);
      }
      /* v22b: cares and riches climb on the thorns and choke it */
      const press = es(t, 1.45, 1.8);
      tds.forEach((d, i) => {
        const g = es(t, d.at, d.at + 0.3, ease.out);
        const toward = Math.sign(X_T + 20 - d.x) || 1;
        const r = press * toward * 5 + grip * toward * 4;
        pose(d.grow, { x: d.x, y: 616, s: g, r, o: g > 0.01 ? 1 : 0 });
        const rr = r * PI / 180, tx = d.tip[0] * g, ty = d.tip[1] * g;
        const pop = es(t, d.at + 0.1, d.at + 0.28, ease.back);
        pose(d.sym, { x: d.x + tx * Math.cos(rr) - ty * Math.sin(rr), y: 616 + tx * Math.sin(rr) + ty * Math.cos(rr), s: pop * 1.25, r: Math.sin(time * 1.6 + i) * 6, o: pop > 0.01 ? 1 : 0 });
        d.glints.forEach((gl, j) => fade(gl, pop * (0.35 + 0.65 * Math.abs(Math.sin(time * 2.6 + t * 9 + j * 2 + i)))));
      });
      pose(choke, { x: X_T + 66, y: 618, sx: es(t, 1.6, 1.9, ease.out) * 1.05, sy: es(t, 1.6, 1.9, ease.out), o: es(t, 1.59, 1.63) });
      pose(flapThorn, { x: 0, y: FLAPB, sy: 1 - es(t, 1.1, 1.4) * 1.12, oy: FLAPB });

      /* v23a: the good soil — hears and understands */
      const gl = seg(t, 2.1, 2.34);
      {
        const [x, y] = arcAt(ease.out(gl), [XP.J + 40, 400], [X_G - 7, FEET - 116], 110);
        pose(seedG, { x, y, s: 1.4, r: (1 - gl) * -200, o: seg(t, 2.09, 2.12) * (1 - seg(t, 2.34, 2.37)) });
      }
      const hold = es(t, 2.4, 2.6) * (1 - es(t, 3.1, 3.3));
      const cheer = es(t, 3.3, 3.5);
      goodW.set({
        x: X_G, y: FEET, s: 1.08, flip: false,
        armF: 8 + hold * 70 + cheer * 140 + Math.sin(time * 2) * 4 * cheer, armB: 6 + hold * 22 + cheer * 128,
        head: hold * 10 - cheer * 12 + bump(t, 2.5, 2.9) * 6, blink: blinkAt(time, 4),
      });
      goodH({ open: es(t, 2.34, 2.46), seed: es(t, 2.34, 2.42), glow: es(t, 2.34, 2.42) * (0.8 + hold * 0.4 + cheer * 0.5), sprout: es(t, 2.5, 2.75, ease.back), pulse: Math.sin(time * 3) });
      pose(flapGood, { x: 0, y: FLAPB, sy: 1 - es(t, 2.45, 2.72) * 1.12, oy: FLAPB });
      /* v23b: the harvest */
      goodSeeds.forEach((el, i) => {
        const a = seg(t, 2.55 + i * 0.06, 2.8 + i * 0.06);
        const [x, y] = arcAt(ease.out(a), [X_G, FEET - 110], [CL[i].x, 614], 80);
        pose(el, { x, y, s: 1.3, r: (1 - a) * 220, o: seg(t, 2.54 + i * 0.06, 2.57 + i * 0.06) * (1 - es(t, 3.05 + i * 0.05, 3.2 + i * 0.05)) });
      });
      const grv = seg(t, 2.7, 3.5);
      rsGood.forEach((r) => fade(r.el, clamp((grv - r.o) * 10)));
      goodSprouts.forEach((el, i) => {
        const g = es(t, 2.8 + i * 0.05, 3.0 + i * 0.05, ease.back);
        pose(el, { x: CL[i].x, y: 612, sy: g, sx: 0.6 + 0.4 * g, o: 1 - es(t, 3.12 + i * 0.05, 3.25 + i * 0.05) });
      });
      clusters.forEach((st, i) => st.forEach((s) => {
        const a = 3.05 + i * 0.08 + s.d;
        const g = es(t, a, a + 0.32, ease.out);
        pose(s.el, { x: CL[i].x + s.dx, y: 616, sy: g, sx: 0.7 + 0.3 * g, r: Math.sin(time * 1.3 + s.ph) * 2.2 * g, o: g > 0.01 ? 1 : 0 });
      }));
      labels.forEach((lb) => {
        const a = es(t, 3.3 + lb.i * 0.1, 3.5 + lb.i * 0.1, ease.back);
        swing(lb.el, lb.x, lerp(lb.ly - 460, lb.ly, a), time, 2, 0.9, lb.i);
        fade(lb.el, a > 0.01 ? 1 : 0);
      });
      const moteOn = es(t, 3.4, 3.7);
      motes.forEach((m) => {
        const k = ((time * 0.12 + t * 0.6) * m.sp + m.off) % 1;
        pose(m.el, { x: m.x + Math.sin(k * 7 + m.off * 6) * 12, y: m.y0 - k * 260, o: moteOn * Math.sin(k * PI) });
      });
    };
  },
};
