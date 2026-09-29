// Mt 9,36–38 — from a green knoll Jesus looks down over the valley full of people, and a warm light of
// compassion glows in His breast and spreads over them. Harassed and helpless: the crowds become a scattered flock
// on the stony slopes, lying down or straying, and no shepherd — only a crook left lying in the grass. Then the
// valley turns to a great field of ripe wheat, with just two reapers in it: "The harvest is plentiful, but the
// labourers are few." The disciples kneel and pray to the Lord of the harvest; light pours down from above, and
// over the far hills labourers come streaming into the field with their sickles.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, rock, grass, olive, cypress, bush, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { sheep, mob, pose3, folk4, heartGlow, rayBurst, wheatBand, sickleHeld, REAPER, kf, moving, DIS4, GOLDEN, GREY, PI } from './lib.js';
import { staff as crookM } from '../mark6/lib.js';

const JX = 800, KNOLL = 690;                 // Jesus on the knoll
const VALLEY = [440, 600];                   // the valley floor (y range) behind the knoll

export default {
  id: 'mt9-harvest',
  beats: [
    { v: 36, text: 'A widząc tłumy ludzi, litował się nad nimi,' },
    { v: 36, cont: true, text: 'bo byli znękani i porzuceni, jak owce nie mające pasterza.' },
    { v: 37 },
    { v: 38 },
  ],
  cam: { x: [-60, 520], y: [-270, 40], z: [0.94, 1.1] },
  build(S) {
    const c = S.c;
    const sk1 = sky(S, ['#c9dcd6', '#efe7cd', '#f7e8cb'], { name: 'day', rise: 0 });
    const grey = sky(S, GREY, { name: 'grey', rise: 0 }).layer;
    const gold = sky(S, GOLDEN, { name: 'gold', rise: 0 }).layer;
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1230, y: 150, len: 800 });
    const cls = [[430, 140, 180], [1560, 190, 160]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
    const rays = hangL.add(`<g>${rayBurst(c, { n: 22, r0: 60, r1: 1100, spread: 0.05, o: 0.55 })}</g>`);

    /* far hills with the horizon where the labourers will come over */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 360, amps: [20, 8, 3], lens: [1100, 400, 130], color: mix(C.hillFar, C.duskViolet, 0.15), x0: -1400, x1: 3200 }).markup);
    const hillL = S.layer({ par: 0.16, sh: 3 });
    const hfn = (x) => 420 + Math.sin(x * 0.003 + 1) * 18 + Math.sin(x * 0.009) * 6;
    hillL.add(sheet().p(c.ridge(hfn, -1400, 3200, 1700, 12, 1), C.hillMid).out());
    const comers = [[1, 'l', 1720, 1470], [1, 'r', 1480, 1230]].map(([d, k, x0, x1]) => ({ d, x0, x1, sp: hillL.sprite(pose3(makeCutter('mt9-h-' + k), Array.from({ length: 6 }, (_, i) => ({ x: i * 34 * d, y: i * 4, s: 0.36, flip: d > 0, armF: 20, o: { ...REAPER, robe: [C.linen2, C.wheatRobe, C.sageRobe, C.dustyBlue, C.roseRobe, C.ochreRobe][i], holdF: sickleHeld(c) } }))), x0, hfn(x0) + 8) }));

    /* the valley: stony slopes (the flock), and the field of wheat */
    const valL = S.layer({ par: 0.3, sh: 3 });
    const vfn = (x) => 470 + Math.sin(x * 0.005) * 10;
    const vs = sheet().p(c.ridge(vfn, -1200, 3000, 1700, 12, 1), mix(C.hillNear, C.sand, 0.3));
    let stones = '';
    for (let i = 0; i < 50; i++) { const x = c.rr(-800, 2600), y = c.rr(490, 700); stones += c.cut(c.blob(x, y, c.rr(10, 26), c.rr(6, 12), 8, 0.2), 0.4, 4); }
    vs.p(stones, C.rock2);
    valL.add(vs.out());
    // the crowds (still sprites)
    const crowds = [[360, 520, 'a'], [640, 560, 'b'], [980, 530, 'c'], [1260, 570, 'd'], [180, 600, 'e'], [1440, 520, 'f']].map(([x, y, k], i) => ({ i, x, y, sp: valL.sprite(mob(makeCutter('mt9-h-c' + k), 6, { s: 0.5, spread: 28, rows: 2, flip: x > 800, arms: 20 }), x, y) }));
    // the scattered sheep
    const flock = Array.from({ length: 14 }, (_, i) => {
      const x = c.rr(160, 1500), y = c.rr(500, 650), lying = c.chance(0.35);
      const m = `<g transform="scale(${(c.chance(0.5) ? -1 : 1) * 0.7} ${lying ? 0.5 : 0.7})">${sheep(c)}</g>`;
      return { i, x, y, el: valL.add(`<g>${m}</g>`) };
    });
    const crook = valL.add(`<g transform="rotate(-80)">${crookM(c, 120)}</g>`);
    const fieldL = S.layer({ par: 0.3, sh: 3 });
    const field = sheet().p(c.ridge((x) => vfn(x) + 6, -1200, 3000, 1700, 12, 1), mix(C.wheat, C.wheat2, 0.4)).out();
    fieldL.add(field + wheatBand(c, { x0: -1200, x1: 3000, fn: (x) => vfn(x) + 16, h: 40, n: 260 }) + wheatBand(c, { x0: -1200, x1: 3000, fn: (x) => vfn(x) + 90, h: 56, n: 240 }) + wheatBand(c, { x0: -1200, x1: 3000, fn: (x) => vfn(x) + 170, h: 70, n: 200 }));
    const reapers = [[520, 560], [1180, 590]].map(([x, y], i) => ({ i, x, y, p: S.puppet(fieldL.add(person(c, { ...REAPER, robe: i ? C.sageRobe : C.linen2, holdF: sickleHeld(c) }))) }));

    /* the knoll in front with Jesus and the disciples */
    const knoll = S.layer({ par: 0.5, sh: 4 });
    const kfn = (x) => KNOLL - Math.max(0, 1 - Math.abs(x - JX) / 700) ** 1.6 * 70 + Math.sin(x * 0.012) * 4;
    knoll.add(sheet().p(c.ridge(kfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out() + grass(c, { x0: -800, x1: 2400, y: 640, fn: kfn, n: 40, h: 12, color: C.moss }) + olive(c, 250, kfn(250) + 18, 0.8) + cypress(c, 1400, kfn(1400) + 12, 120) + rock(c, 1100, kfn(1100) + 20, 90, 30, C.rock2) + flowers(c, { x0: 420, x1: 1180, y: 700, fn: (x) => kfn(x) + 24, n: 12 }));
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = DIS4.concat(['matthew']).map((k, i) => {
      const x = [726, 666, 606, 546, 486][i];
      return { k, i, x, y: kfn(x) + 6 + (i % 2 ? 12 : 0), stand: S.puppet(L.add(person(c, { ...CAST[k] }))), kneel: S.puppet(L.add(person(c, { ...CAST[k], pose: 'kneel' }))), seed: c.rr(0, 9) };
    });
    const heartEl = L.add(`<g>${heartGlow(c, 14)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const warm = L.add(`<g><circle r="420" fill="url(#warm-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 150, T, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));

      /* v36a — He sees the crowds and is moved with compassion */
      const see = es(t, 0.05, 0.3);
      const comp = es(t, 0.3, 0.7);
      const JY = kfn(JX) + 6;
      const pray = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 16 + comp * 40 * (1 - es(t, 1.9, 2.2)) + es(t, 2.1, 2.4) * 30 + pray * 40, armB: 10 + comp * 50 * (1 - es(t, 1.9, 2.2)) + pray * 130, head: 6 * see - pray * 12, blink: blinkAt(T) });
      pose(heartEl, { x: JX + 6, y: JY - 128, s: 0.5 + comp * 0.5 + bump(t, 1.0, 2.0) * 0.1, o: comp * (1 - es(t, 2.0, 2.3)) });
      pose(warm, { x: JX, y: JY - 128, s: 0.2 + comp * 0.8, o: comp * (1 - es(t, 1.2, 1.9)) * 0.45 });
      const toFlock = es(t, 1.05, 1.35);
      crowds.forEach((g) => g.sp.set({ x: g.x, y: g.y, o: 1 - toFlock }));

      /* v36b — like sheep without a shepherd */
      const toField = es(t, 2.0, 2.4);
      grey.fade(toFlock * (1 - toField) * 0.75);
      flock.forEach((f) => pose(f.el, { x: f.x + (f.i % 2 ? 1 : -1) * es(t, 1.2, 1.9) * 30, y: f.y, o: toFlock * (1 - toField) }));
      pose(crook, { x: 900, y: 640, o: es(t, 1.3, 1.5) * (1 - toField) });

      /* v37 — the harvest is plentiful, the labourers few */
      fieldL.fade(toField);
      reapers.forEach((r) => r.p.set({ x: r.x, y: r.y, s: 0.5, flip: r.i === 1, armF: 60 + Math.max(0, Math.sin(t * 8 + r.i)) * 40 * es(t, 2.3, 2.5), armB: 20, lean: 16, blink: 0 }));
      gold.fade(toField * 0.8);

      /* v38 — they pray; labourers come over the hills */
      DIS.forEach((d) => {
        const kn = es(t, 3.05 + d.i * 0.04, 3.12 + d.i * 0.04);
        const face = false;
        d.stand.set({ x: d.x, y: d.y, s: 0.94, flip: face, o: 1 - kn, armF: 12 + bump(t, 2.2, 3.0) * 40 * (d.i === 0 ? 1 : 0), head: -4, blink: blinkAt(T, d.seed) });
        d.kneel.set({ x: d.x, y: d.y, s: 0.94, flip: face, o: kn, armF: 70, armB: 160, head: -14, blink: blinkAt(T, d.seed) });
      });
      pose(rays, { x: 1230, y: 150, r: T * 1.2, o: es(t, 3.1, 3.5) });
      comers.forEach((m) => {
        const k = es(t, 3.2, 3.95, (u) => u);
        const x = lerp(m.x0, m.x1, k);
        m.sp.set({ x, y: hfn(x) + 8 + k * 30, o: seg(t, 3.15, 3.3) });
      });

      // the closing card will cover the middle of the last beat: in landscape turn the view so Jesus and the praying
      // disciples stand to its left; in portrait (where the card spans the width) lift the view so they stand below it
      const end = es(t, 3.05, 3.7);
      S.cam.z = 1.02 - es(t, 2.0, 2.5) * 0.04 - end * 0.02;
      S.cam.y = 10 - end * (S.portrait ? 270 : 10);
      S.cam.x = -40 + end * (S.portrait ? 40 : 560);
    };
  },
};
