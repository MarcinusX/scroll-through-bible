// J 9,7b — the showpiece. We are in his world: a sheet of deep night paper over everything, and only the sounds
// come through, as pale rings — the tap of his stick finding each step, the water running from the channel's
// mouth, a bird, the voices of women at the far side of the pool. He goes down the steps, lays his stick
// down, kneels and washes: splashes ring out on the water, the clay runs off his eyes.
// "…and came back seeing": he lifts his face, his eyes open — and the night sheet flies up like a theatre drop.
// The light is blinding white at first, then the colours flood in: the sky, the sun on its string, the stepped
// pool of Siloam, oleanders opening, birds, the women with their jars turning to look. He stands, arms wide,
// and turns back up the steps, leaving the stick behind.
import { C, person, blinkAt, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { hillsWith, sun, cloud, olive, palm, bush, house, cypress } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  siloamBack, siloamNear, outlet, SI, NOON, BLIND, SEER, manPuppet, neighbour, stick, soundRings, rayBurst, spark, portico,
  kf, moving, hand, headAt, vis, tr, pose, PI, DY,
} from './lib.js';
import { hydria as hydria4 } from '../john4/lib.js';

const KX = 772;                   // where he kneels, on the last step
const stairY = (x) => {           // his feet on the steps (5 steps of 19 from x 548)
  const u = (x - 548) / 48;
  if (u <= 0) return SI.TOP;
  const k = Math.min(SI.STEPS, Math.floor(u) + 1), f = Math.min(1, (u - Math.floor(u)) * 5);
  return SI.TOP + (Math.min(SI.STEPS, k - 1) + (k <= SI.STEPS ? f : 1)) * 19;
};

export default {
  id: 'j9-siloam',
  beats: [
    { v: 7, text: 'On więc odszedł, obmył się' },
    { v: 7, cont: true, text: 'i wrócił widząc.' },
  ],
  cam: { x: [-60, 60], y: [0, 130], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const v = S.view();

    /* ---------- the world in colour (under the night sheet) ---------- */
    const sk = sky(S, NOON);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1190, y: 150, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 480, y: 140, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 900, y: 96, len: 700 });
    const birds = flock(S, hangL, 5, (cc) => bird(cc, { color: C.bird }), { y: 250, speed: 70, scale: 0.55 });
    S.layer({ par: 0.08, sh: 2 }).add(hillsWith(c, { y: 410, amps: [18, 8, 3], lens: [1100, 380, 140], color: mix(C.hillMid, C.hillFar, 0.4), trees: 30, treeColor: mix(C.olive, C.hillMid, 0.3), treeH: 16, x0: -1500, x1: 3100 }).markup);
    // the City of David on its slope
    const cityL = S.layer({ par: 0.16, sh: 3 });
    const slope = (x) => 470 - Math.max(0, 700 - x) * 0.12;
    cityL.add(sheet().p(c.ridge((x) => slope(x) + Math.sin(x / 90) * 4, -1500, 3100, 1700, 14, 1), mix(C.hillNear, C.sand, 0.4)).out());
    let houses = '';
    [[-160, 70, 50], [-60, 60, 44], [40, 76, 56], [150, 58, 42], [250, 70, 52], [360, 64, 46], [460, 72, 50], [1300, 70, 50], [1420, 60, 44], [1520, 76, 54]].forEach(([x, w, h]) => { houses += house(c, x, slope(x + w / 2) + 6, w, h); });
    cityL.add(houses + cypress(c, 560, slope(560) + 6, 120) + cypress(c, 1260, 476, 110));
    // a colonnade along the far side of the pool
    const porL = S.layer({ par: 0.26, sh: 4 });
    porL.add(portico(c, 640, 3000, 604, 118, { step: 54 }));
    porL.add(palm(c, 470, 612, 230) + olive(c, 330, 616, 1.1));
    // the women at the far steps, with their jars
    const farL = S.layer({ par: 0.32, sh: 4 });
    farL.add(siloamBack(c));
    const women = [0, 1].map((i) => ({ i, p: S.puppet(farL.add(person(c, { ...neighbour(c, 1), hairStyle: 'veil', beard: 'none', holdB: i ? '' : `<g transform="translate(0 16) rotate(180)">${hydria4(c, { sc: 0.55 })}</g>` }))), seed: c.rr(0, 9) }));
    const jarDown = farL.add(`<g transform="translate(1092 668)">${hydria4(c, { sc: 0.6 })}</g>`);
    const OX = 1000;
    const out = farL.add(`<g transform="translate(${OX} 640)">${outlet(c)}</g>`);
    const pour = farL.add(`<g><path d="${c.ribbon(c.qbez([OX, 648], [OX + 8, 676], [OX + 12, 708], 10), (u) => 12 - u * 4)}" fill="#bfe3ea" opacity=".9"/></g>`);
    // the water
    const waterL = S.layer({ par: 0.34, sh: 1 });
    waterL.add(sheet().p(c.cut([[640, 700], [3100, 700], [3100, 1700], [640, 1700]], 0.5, 20), mix(C.lake, C.teal2, 0.12)).x(c.ribbon([[640, 703], [3100, 703]], 2.2), C.foam, 'opacity=".7"').out());
    const glints = Array.from({ length: 7 }, (_, i) => ({ i, x: 860 + i * 70 + c.rr(-20, 20), y: 716 + (i % 3) * 8, el: waterL.add(`<g opacity="0"><path d="${c.poly(c.ell(0, 0, c.rr(9, 16), 1.8, 10))}" fill="${C.foam}"/></g>`) }));
    // the near side: the paving, the steps, the lip; oleanders
    const nearL = S.layer({ par: 0.4, sh: 3 });
    nearL.add(siloamNear(c));
    nearL.add(bush(c, 330, 620, 110, C.moss, C.sage) + bush(c, 1100, 752, 150, C.moss, C.leaf) + bush(c, 1420, 752, 130, C.moss, C.sage));
    const flowerAt = [[300, 590], [340, 578], [372, 596], [1060, 726], [1100, 716], [1138, 728], [1400, 730], [1440, 720]];
    const flowers = flowerAt.map(([x, y], i) => ({ i, x, y, el: nearL.add(`<g>${sheet().p(c.cut(c.star(0, 0, 9, 4.5, 5, c.rr(0, 1)), 0.2, 3), i % 3 ? C.roseRobe : C.jesusMantle).x(c.poly(c.circ(0, 0, 2.6, 6)), C.cream).out()}</g>`) }));

    /* ---------- first light: a white glare that fades as the colours come ---------- */
    const glareL = S.layer({ par: 0, sh: 0, flat: true, rise: 0 });
    glareL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#fff7e2"/>`);
    glareL.fade(0);

    /* ---------- the night sheet (his world): a drop that flies up ---------- */
    const darkL = S.layer({ par: 0, sh: 8, rise: 0, flat: true });
    const x0 = v.x0 - 80, x1 = v.x1 + 80, y0 = v.y0 - 80, yb = v.y1 + 90;
    const hem = [];
    for (let x = x1; x >= x0; x -= 36) hem.push(...c.arc(x - 18, yb, 18, 14, 0, PI, 5));
    const dsh = sheet().p(c.cut([[x0, y0], [x1, y0], ...hem], 0.8, 16), '#1b1d3c');
    darkL.add(dsh.out() + `<path d="${c.ribbon([[x0, yb - 30], [x1, yb - 30]], 3)}" fill="#2b2e5a"/>`);
    const LIFT = yb - y0 + 60;

    /* ---------- the man ---------- */
    const actL = S.layer({ par: 0.5, sh: 5 });
    const laid = actL.add(`<g>${sheet().p(c.ribbon([[0, 0], [118, -4]], 3.8), C.wood2).out()}</g>`);
    const walker = manPuppet(S, actL, BLIND, { clay: true, holdF: stick(c, 104) });
    const kneelB = manPuppet(S, actL, BLIND, { pose: 'kneel', clay: true });
    const kneelS = manPuppet(S, actL, SEER, { pose: 'kneel' });
    const standS = manPuppet(S, actL, SEER, {});

    /* ---------- sounds (rings) and light ---------- */
    const ringL = S.layer({ par: 0.5, sh: 0, flat: true });
    const tapR = soundRings(ringL, c, { n: 2, r: 14 });
    const waterR = soundRings(ringL, c, { n: 3, r: 16 });
    const birdR = soundRings(ringL, c, { n: 2, r: 10 });
    const voiceR = soundRings(ringL, c, { n: 3, r: 14 });
    const splashR = soundRings(ringL, c, { n: 3, r: 16, col: mix(C.cream, C.skyBlue, 0.4) });
    const fxL = S.layer({ par: 0.5, sh: 3 });
    const drops = Array.from({ length: 6 }, (_, i) => ({ i, el: fxL.add(`<g opacity="0"><path d="${c.cut([[0, -5], [3, 0], [0, 3], [-3, 0]], 0.1, 2)}" fill="#cfeaf0"/></g>`), dx: c.rr(-14, 14) }));
    const muddy = fxL.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 18, 3.4, 12), 0.3, 3)}" fill="${mix(C.soil, C.lake, 0.4)}" opacity=".7"/></g>`);
    const burst = fxL.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/>${rayBurst(c, { n: 22, r0: 14, r1: 170, spread: 0.035, color: '#fff1c4', o: 0.75 })}</g>`);
    const eyeSpark = fxL.add(`<g opacity="0">${spark(c, 12)}</g>`);
    const joy = Array.from({ length: 6 }, (_, i) => ({ i, el: fxL.add(`<g opacity="0">${spark(c, 8)}</g>`) }));

    return (t, time) => {
      const T = time;
      /* the lift and the flood of colour */
      const lift = es(t, 1.06, 1.42, ease.in);
      const glare = t < 1.06 ? 0 : Math.min(1, seg(t, 1.06, 1.14)) * (1 - es(t, 1.2, 1.62));
      const colour = es(t, 1.25, 1.65);
      darkL.shift(0, -lift * LIFT);
      darkL.fade(t > 1.44 ? 0 : 1);
      glareL.fade(glare * 0.85);
      const live = colour > 0.01 || lift > 0;
      if (live) {
        swing(sunEl, 1190, 150, T, 1.1, 0.6);
        swing(cl1, 480 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);
        swing(cl2, 900 + Math.sin(T * 0.08 + 2) * 26, 96, T, 1.2, 0.7, 2);
      }
      birds(colour > 0.01 ? T : 0, colour);

      /* v7b — he goes: down the steps, tapping */
      const WK = [[-0.3, 110], [0.02, 170], [0.55, KX]];
      const wx = kf(t, WK, (u) => u);
      const walking = t > -0.3 && t < 0.55;
      const kneel = es(t, 0.55, 0.6);
      const wy = stairY(wx) + 4;
      const tapPh = (t - 0.02) * 9;
      const tapA = walking ? 34 + Math.sin(tapPh * PI * 2) * 12 : 30;
      walker.p.set({ x: wx, y: wy, s: 1, o: 1 - kneel, armF: tapA, armB: 20, head: -6, walk: walking ? wx * 0.07 : undefined, amt: 0.6, lean: 2, blink: 0 });
      fade(walker.clay, 1);
      const [tx, ty] = hand(wx, wy, 1, false, tapA);
      const tipX = tx + Math.sin((tapA * PI) / 180) * 100, tipY = Math.min(stairY(tipX) + 6, ty + Math.cos((tapA * PI) / 180) * 100);
      tapR(tipX, tipY, walking ? 1 : 0, T, { sy: 0.35, speed: 1.4, spread: 2.2 });
      // the stick laid down on the step
      pose(laid, { x: KX - 150, y: stairY(KX - 60) + 2, r: -4, o: kneel > 0.5 ? 1 : 0 });

      /* washing: two scoops of water to the face */
      const sc1 = bump(t, 0.62, 0.8), sc2 = bump(t, 0.8, 0.98);
      const scoop = Math.max(sc1, sc2);
      const lifted = es(t, 1.0, 1.1);
      const seen = es(t, 1.06, 1.1);
      const up = es(t, 1.5, 1.56);
      const kArm = 34 + scoop * 110 - lifted * 10 + lifted * bump(t, 1.1, 1.5) * 40;
      const kLean = 18 * (1 - lifted) - scoop * 8;
      const kHead = 14 * (1 - lifted) - lifted * 18;
      kneelB.p.set({ x: KX, y: SI.TOP + 5 * 19 + 2, s: 1, o: kneel * (1 - seen), armF: kArm, armB: 20 + scoop * 60, head: kHead, lean: kLean, blink: 0 });
      fade(kneelB.clay, 1 - es(t, 0.7, 0.98));
      kneelS.p.set({ x: KX, y: SI.TOP + 5 * 19 + 2, s: 1, o: seen * (1 - up), armF: kArm, armB: 20 + bump(t, 1.1, 1.5) * 90, head: kHead, lean: kLean, blink: blinkAt(T, 3) });
      const [hx, hy] = hand(KX, SI.TOP + 97, 1, false, 34, 18, DY.kneel);
      splashR(hx + 12, 712, t > 0.6 && t < 1.04 ? Math.max(bump(t, 0.6, 0.8), bump(t, 0.78, 1.0)) * 1.2 : 0, T, { sy: 0.3, speed: 1.2, spread: 2.4 });
      const [ex, ey] = headAt(KX, SI.TOP + 97, 1, false, DY.kneel);
      drops.forEach((d) => {
        const k = t > 0.62 && t < 1.0 ? ((t - 0.62) * 5.3 + d.i / 6) % 1 : 0;
        vis(d.el, { x: ex + 10 + d.dx, y: ey + 12 + k * 90, o: k ? 1 - k * 0.6 : 0 });
      });
      vis(muddy, { x: hx + 18, y: 713, s: 0.4 + es(t, 0.75, 1.0) * 0.8, o: es(t, 0.75, 0.85) * (1 - es(t, 1.25, 1.6)) });

      /* v7c — his eyes open: the light bursts out and the night flies away */
      vis(eyeSpark, { x: ex + 10, y: ey - 3, s: bump(t, 1.04, 1.3) * 1.4, r: T * 50, o: t > 1.04 && t < 1.3 ? 1 : 0 });
      vis(burst, { x: ex + 10, y: ey - 3, s: 0.3 + es(t, 1.06, 1.4) * 0.9, r: T * 6, o: bump(t, 1.06, 1.6) });

      /* he stands, arms wide, looks around, and turns back up the steps */
      const back = es(t, 1.72, 2.1, ease.sine);
      const bx = lerp(KX, 420, back);
      const turnL = t > 1.66;
      const wonder = bump(t, 1.52, 1.76);
      standS.p.set({ x: bx, y: stairY(bx) + 4, s: 1, o: up, flip: turnL, armF: 30 + wonder * 70 + (t > 1.72 ? 20 : 0), armB: 30 + wonder * 110, head: -12 * wonder + (turnL ? -4 : 0), walk: back > 0 && back < 1 ? bx * 0.08 : undefined, blink: blinkAt(T, 3) });
      const [sx, sy] = headAt(bx, stairY(bx) + 4, 1, turnL);
      joy.forEach((j) => {
        const k = ((T * 0.6 + j.i / 6) % 1);
        vis(j.el, { x: sx + Math.cos(j.i * 1.1) * 44, y: sy - 20 - k * 70, s: 0.6 + k * 0.5, o: es(t, 1.55, 1.7) * Math.sin(k * PI) * (1 - es(t, 2.05, 2.2)) });
      });

      /* the sounds in his dark */
      const dark = 1 - es(t, 1.05, 1.3);
      waterR(OX + 10, 704, dark, T, { sy: 0.45, speed: 0.7, spread: 3.2 });
      birdR(880, 470, dark * (Math.sin(T * 1.7) > 0.2 ? 1 : 0), T, { speed: 1.6, spread: 2.2 });
      voiceR(1150, 540, dark * bump(t, 0.15, 0.95), T, { speed: 0.8, spread: 2.6 });

      /* the world in colour: the pour, the glints, the flowers opening, the women turning */
      const pw = 1 + Math.sin(T * 7) * 0.04;
      pose(pour, { sx: pw, ox: OX + 6, oy: 676, x: OX + 6, y: 676 });
      glints.forEach((g) => vis(g.el, { x: g.x + Math.sin(T * 0.8 + g.i) * 10, y: g.y, o: colour * (0.4 + 0.6 * Math.max(0, Math.sin(T * 1.3 + g.i * 1.7))) }));
      flowers.forEach((f) => {
        const k = es(t, 1.35 + f.i * 0.03, 1.55 + f.i * 0.03, ease.back);
        vis(f.el, { x: f.x, y: f.y, s: 0.25 + k * 0.85, r: k * 40, o: 1 });
      });
      const look = es(t, 1.45, 1.6);
      women.forEach((w) => w.p.set({ x: 1130 + w.i * 64, y: 668 - w.i * 16, s: 0.66, flip: look > 0.5 || w.i === 1, armF: 20 + look * (w.i ? 60 : 30), armB: w.i ? 10 : 160, head: -look * 6, blink: blinkAt(T, w.seed) }));

      S.cam.x = kf(t, [[-0.3, -40], [0.55, 0], [1.05, 0], [1.5, 20], [2, -20]]);
      S.cam.y = kf(t, [[-0.3, 60], [0.55, 110], [1.05, 120], [1.5, 80], [2, 80]]);
      S.cam.z = kf(t, [[-0.3, 1.06], [0.55, 1.14], [1.05, 1.16], [1.5, 1.0], [2, 1.02]]);
    };
  },
};
