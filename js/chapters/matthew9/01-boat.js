// Mt 9,1 — the curtains open on the Gadarene shore: the townsfolk who begged Him to go stand far off on the
// beach; Jesus steps into the boat where the four are waiting, the sail fills and the boat crosses the lake,
// and on the far side Capernaum, "His own town", comes into view: people run down to the water to meet Him.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, town, house, sun, cloud, palm, olive, cypress, reeds, rock, grass, bush } from '../../assets/nature.js';
import { boat, bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { kf, moving, mob, hangAt, hungWord, synagogueFront, tr, MORNING, DIS4 } from './lib.js';

const P = 0.55;              // the boat's layer
const camFor = (x) => (x - 800) / P;
const FEET = 704;            // beach level where people stand
const BY = 742;              // the boat's waterline

export default {
  id: 'mt9-boat',
  beats: [
    { cover: true },
    { v: 1, text: 'On wsiadł do łodzi,' },
    { v: 1, cont: true, text: 'przeprawił się z powrotem' },
    { v: 1, cont: true, text: 'i przyszedł do swego miasta.' },
  ],
  cam: { x: [camFor(640), camFor(1340)], y: [-20, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, MORNING);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1180, y: 140, len: 800 });
    const cls = [[520, 150, 200], [1040, 110, 150], [1560, 160, 180]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));
    const gulls = flock(S, hangL, 4, (cc) => bird(cc, { color: C.linen2, belly: C.cream }), { y: 250, speed: 40, scale: 0.45, x0: -400, x1: 2400 });

    /* far hills, the lake, a middle band of waves */
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 380, amps: [18, 8, 3], lens: [1100, 400, 130], color: mix(C.hillFar, C.duskViolet, 0.14), x0: -1400, x1: 3200 });
    far.add(fb.markup + town(c, { x: 1500, y: fb.fn(1500) + 10, n: 6, spread: 260, sc: 0.36 }));
    const lakeL = S.layer({ par: 0.12, sh: 1 });
    lakeL.add(waterBand(c, { y: 402, color: mix(C.lake, C.skyBlue, 0.25), foamN: 30, bottom: 1400, x0: -1400, x1: 3200 }).markup);
    const waveL = S.layer({ par: 0.3, sh: 2, pad: 160 });
    waveL.add(waveStrip(c, { y: 560, len: 150, amp: 7, color: mix(C.lake2, C.lake, 0.5), x0: -1600, x1: 3400 }));

    /* the Gadarene headland (left) and Capernaum on its hill (right) */
    const shoreL = S.layer({ par: 0.3, sh: 3 });
    const gfn = (x) => 470 + Math.max(0, x - 180) * 0.5 + Math.sin(x * 0.02) * 6;
    shoreL.add(sheet().p(c.ridge((x) => (x > 520 ? 1000 : gfn(x)), -1400, 560, 1400, 12, 1.2), mix(C.hillNear, C.rock, 0.3)).out() + rock(c, 120, 560, 170, 60, C.rock2) + rock(c, 340, 600, 110, 40, C.rock3) + cypress(c, -60, 520, 110) + olive(c, 250, 548, 0.7));
    const tfn = (x) => 560 - Math.min(120, Math.max(0, x - 1360) * 0.4) + Math.sin(x * 0.012) * 5;
    shoreL.add(sheet().p(c.ridge((x) => (x < 1320 ? 1000 : tfn(x)), 1300, 3200, 1400, 12, 1.2), mix(C.hillNear, C.sand, 0.25)).out());
    let hs = '';
    [[1420, 60, 44], [1500, 70, 48], [1650, 64, 44], [1740, 80, 52], [1850, 60, 42], [1940, 74, 50], [2060, 60, 44]].forEach(([x, w, h], i) => { hs += house(c, x, tfn(x + w / 2) + 6, w, h, { stairs: i % 2 === 0 }); });
    shoreL.add(hs + `<g transform="translate(1590 ${tfn(1590) + 4}) scale(.8)">${synagogueFront(c)}</g>` + palm(c, 1380, tfn(1380) + 10, 150) + palm(c, 2000, tfn(2000) + 10, 160) + cypress(c, 1810, tfn(1810) + 8, 100));

    /* the beaches at both ends, on the boat's plane */
    const beachL = S.layer({ par: P, sh: 3 });
    const lb = (x) => FEET - 4 + Math.max(0, x - 560) * 1.5 + Math.sin(x * 0.03) * 2;
    const rb = (x) => FEET - 4 + Math.max(0, 1320 - x) * 1.5 + Math.sin(x * 0.03) * 2;
    // phone: the tall screen would show the lake between the two sloping beaches as a long blue V down to the
    // caption; there the beaches meet in a near shore below the boat, so the lake reads as a bay
    const near = (x) => (S.portrait ? FEET + 170 + Math.sin(x * 0.011) * 6 + Math.sin(x * 0.037) * 2 : 1600);
    const beach = sheet();
    beach.p(c.ridge((x) => Math.min(lb(x), near(x)), -1200, 1150, 1600, 12, 1), mix(C.sand, C.stone, 0.3));
    beach.p(c.ridge((x) => Math.min(rb(x), near(x)), 700, 3300, 1600, 12, 1), mix(C.sand, C.stone, 0.3));
    let peb = '';
    for (let i = 0; i < 70; i++) { const x = c.chance(0.5) ? c.rr(-800, 520) : c.rr(1360, 2800); peb += c.cut(c.blob(x, c.rr(FEET + 20, 1100), c.rr(4, 9), c.rr(2.5, 5), 7, 0.2), 0.2, 3); }
    beach.x(peb, C.stone2, 'opacity=".7"');
    beachL.add(beach.out());
    beachL.add(reeds(c, 460, FEET + 10, 9, 80) + reeds(c, 1400, FEET + 10, 8, 70) + grass(c, { x0: -800, x1: 480, y: FEET, fn: lb, n: 14, h: 12, color: C.olive }) + grass(c, { x0: 1440, x1: 2800, y: FEET, fn: rb, n: 14, h: 12, color: C.olive }));

    /* the Gadarenes watching Him go (left) and the people of Capernaum (right) */
    const folkL = S.layer({ par: P, sh: 4 });
    const gad = folkL.sprite(mob(makeCutter('mt9-boat-gad'), 6, { s: 0.82, spread: 44, rows: 2, flip: true, arms: 10 }), 260, FEET);
    const capA = folkL.sprite(mob(makeCutter('mt9-boat-capA'), 5, { s: 0.9, spread: 46, rows: 2, flip: true, arms: 40 }), 1560, FEET + 6);
    const capB = folkL.sprite(mob(makeCutter('mt9-boat-capB'), 4, { s: 0.9, spread: 46, rows: 2, flip: true, arms: 20 }), 1700, FEET + 10);

    /* the boat, the four, Jesus */
    const boatL = S.layer({ par: P, sh: 5 });
    const B = boat(c, { mast: true });
    const back = boatL.add(`<g>${B.back}</g>`);
    const DIS = DIS4.map((k, i) => ({ k, i, dx: [140, 84, -70, -128][i], seed: c.rr(0, 9), p: S.puppet(boatL.add(person(c, { ...CAST[k] }))) }));
    const jesus = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const front = boatL.add(`<g>${B.front}</g>`);
    const wake = boatL.add(`<path d="${c.ribbon([[0, 0], [-70, 3], [-170, 1], [-260, 4]], (u) => 6 - u * 5)}" fill="${C.foam}" opacity=".85"/>`);
    const bowFoam = boatL.add(`<path d="${c.cut([[0, 0], [16, -8], [34, -4], [22, 4]], 0.4, 4) + c.cut([[-6, 6], [14, 2], [30, 8], [8, 10]], 0.4, 4)}" fill="${C.foam}"/>`);

    /* the name of the town */
    const fly = S.layer({ par: 0.2, sh: 6 });
    const capName = fly.add(hungWord(c, tr('Kafarnaum', 'Capernaum'), { size: 26 }));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(rock(c, -300, 980, 260, 90, C.rock2) + bush(c, 2360, 990, 280, C.sage, C.moss) + reeds(c, 2180, 990, 12, 200, C.moss));

    const cur = curtains(S);

    // the boat's path (centre x in world units on the boat layer)
    const BK = [[2.0, 770], [2.9, 1190]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      swing(sunEl, 1180, 140, T, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));
      gulls(T, 1);
      waveL.shift(((T * 16) % 150) - 75);

      /* the boat */
      const bx = kf(t, BK, ease.io);
      const sailing = moving(t, BK, 0.2);
      const rock_ = Math.sin(T * 0.9) * (sailing ? 2.2 : 1.1);
      const bob = Math.sin(T * 1.3) * 2;
      const by = BY + bob;
      pose(back, { x: bx, y: by, r: rock_ });
      pose(front, { x: bx, y: by, r: rock_ });
      pose(wake, { x: bx - 180, y: by + 12, s: 1, o: bump(t, 2.0, 3.0) * 0.9 });
      pose(bowFoam, { x: bx + 190, y: by - 6, s: 0.8 + (sailing ? Math.sin(T * 6) * 0.1 : 0), o: bump(t, 2.0, 3.0) });

      /* v1a — He steps from the beach into the boat */
      const JK = [[1.05, 590], [1.55, 776], [3.2, 776], [3.65, 1390]];
      const jx = kf(t, JK, ease.io);
      const inBoat = t >= 1.55 && t < 3.2;
      const stepIn = es(t, 1.35, 1.55), stepOut = es(t, 3.2, 3.42);
      const jy = inBoat ? by - 6 : t < 3 ? lerp(FEET, by - 6, stepIn) : lerp(by - 6, FEET + 6, stepOut);
      const jxx = inBoat ? bx + 6 : jx;
      const greet = es(t, 3.5, 3.75);
      jesus.set({
        x: jxx, y: jy, s: 0.96, flip: false,
        walk: (t > 1.05 && t < 1.55) || (t > 3.2 && t < 3.65) ? jx * 0.05 : undefined,
        armF: 12 + bump(t, 1.3, 1.6) * 40 + (inBoat ? 14 : 0) + greet * 60, armB: 8 + greet * 30,
        lean: inBoat ? rock_ * 0.5 : 0, head: greet * -3, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const help = d.i === 1 ? bump(t, 1.2, 1.7) : 0;
        const wave_ = es(t, 3.3 + d.i * 0.06, 3.55 + d.i * 0.06);
        d.p.set({
          x: bx + d.dx, y: by - 6, s: 0.9, flip: d.dx > 0 && t < 1.8,
          armF: 20 + help * 70 + (d.i === 0 ? es(t, 2.1, 2.5) * (1 - wave_) * 50 : 0) + wave_ * (d.i % 2 ? 30 : 60), armB: 10 + (d.i === 3 && sailing ? 30 : 0) + wave_ * (d.i % 2 ? 90 : 20),
          lean: rock_ * 0.5, head: d.i === 0 ? -es(t, 2.1, 2.5) * 6 * (1 - wave_) : 0, blink: blinkAt(T, d.seed),
        });
      });

      /* the Gadarenes stand far off; the people of Capernaum run down to meet Him */
      gad.set({ x: 250 - es(t, 1.8, 2.6) * 120, y: FEET, o: 1 - es(t, 2.2, 2.7) });
      const come = es(t, 2.6, 3.3);
      const PH = S.portrait;   // phone: the people of Capernaum and the town's name stay inside the screen
      capA.set({ x: lerp(1900, PH ? 1505 : 1545, come), y: FEET + 6, o: seg(t, 2.55, 2.7) });
      capB.set({ x: lerp(2080, PH ? 1600 : 1665, es(t, 2.75, 3.45)), y: FEET + 10, o: seg(t, 2.7, 2.85) });
      const nk = es(t, 2.7, 3.1, ease.out);
      hangAt(capName, PH ? 1180 : 1380, lerp(PH ? -700 : -500, PH ? 200 : 250, nk), T, 1.2);

      /* camera follows the boat */
      const view = kf(t, [[0.9, 660], [1.6, 740], [2.0, 800], [2.9, 1220], [3.3, 1300], [3.8, 1400]]);
      S.cam.x = camFor(view);
      S.cam.z = 1 + es(t, 1.0, 1.6) * 0.04 - es(t, 2.0, 2.4) * 0.03 + es(t, 3.2, 3.7) * 0.05;
      S.cam.y = 10 + es(t, 3.2, 3.7) * 20;
    };
  },
};
