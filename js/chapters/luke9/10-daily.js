// Łk 9,23–24 — a road through the hills, and He speaks to all: disciples and the people with them, each with a heavy
// bundle of his own on his back. "If anyone wants to come after me, let him deny himself": they set their bundles down
// by the road; "take up his cross daily": a small cross comes down onto each one's shoulder, and while they follow Him
// along the road the sun on its string crosses the sky and goes down and comes up and crosses again — day after day.
// "Whoever wants to save his life will lose it": at the back a man clutches his little light to his chest, wrapping his
// mantle round it — it gutters and goes out in a curl of smoke; "whoever loses his life for my sake will save it": a
// woman holds hers out towards Jesus — and it blazes up bright between her hands.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, cypress, bush, rock, grass, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { TW9, folk, smallCross, soulLight, halo, DAY9, kf, hand, tr, PI } from './lib.js';
import { bundle } from '../mark8/lib.js';

const RY = (x) => 712 - (x - 800) * 0.05;    // the road rises gently to the right

export default {
  id: 'lk9-daily',
  beats: [
    { v: 23 },
    { v: 24 },
  ],
  cam: { x: [-40, 60], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DAY9);
    const nightL = sky(S, ['#3a3f70', '#8e7c9e', '#d9a996'], { name: 'eve', rise: 0 }).layer;
    nightL.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 0, y: -1500, len: 1400 });
    const cl = hanging(hangL, cloud(c, 180), { x: 500, y: 150, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [20, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.lavender, 0.15) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const mh = hillsWith(c, { y: 520, amps: [16, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
    mid.add(mh.markup);
    // the far road winding on over the hills
    mid.add(sheet().p(c.ribbon(c.cbez([1500, 610], [1300, 560], [1100, 548], [960, 530], 20), (u) => 20 - u * 14), mix(C.sand, C.cream, 0.3)).out());
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = (x) => RY(x) - 40 + Math.sin(x * 0.01) * 4;
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4)).p(c.ribbon([[-900, RY(-900) + 4], [2500, RY(2500) + 4]], 56, 2), mix(C.sand, C.cream, 0.35)).out());
    G.add(olive(c, 330, gfn(330) + 10, 0.9) + cypress(c, 1320, gfn(1320) + 6, 150) + cypress(c, 1370, gfn(1370) + 8, 120) + grass(c, { x0: -800, x1: 2400, y: 670, fn: gfn, n: 40, h: 13, color: C.moss }) + flowers(c, { x0: 300, x1: 1400, y: 670, fn: (x) => gfn(x) + 70, n: 14, h: 12 }));
    const dayL = S.layer({ par: 0.45, sh: 1, flat: true });
    dayL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2c2a55"/>`);
    dayL.fade(0);

    /* the followers, with their bundles, then their crosses */
    const act = S.layer({ par: 0.5, sh: 5 });
    const F = [
      { o: TW9.peter, x: 770 }, { o: folk(c, false, { robe: C.skyVeil }), x: 705, giver: true }, { o: TW9.john, x: 640 },
      { o: folk(c, true), x: 575 }, { o: TW9.andrew, x: 510 }, { o: { ...folk(c, true), robe: C.plumRobe, mantle: C.ochre, belt: C.sun }, x: 445, keeper: true },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 9) }));
    F.forEach((f) => {
      f.p = S.puppet(act.add(person(c, f.o)));
      f.b = act.add(`<g><g transform="scale(1.5)">${bundle(c)}</g></g>`);
      f.cross = act.add(`<g opacity="0">${smallCross(c, 96)}</g>`);
    });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    /* the lights of the two (v24) */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const lightK = fx.add(`<g opacity="0">${soulLight(c, 14)}</g>`);
    const lightG = fx.add(`<g opacity="0">${soulLight(c, 14)}</g>`);
    const blaze = fx.add(`<g opacity="0">${halo(90, 0.9)}</g>`);
    const smoke = fx.add(`<g opacity="0"><path d="${c.ribbon(c.cbez([0, 0], [12, -20], [-10, -40], [4, -70], 14), (u) => 6 - u * 5)}" fill="${C.stone2}"/></g>`);

    return (t, time) => {
      const T = time;
      /* day after day: the sun crosses twice, the sky dims between */
      const d1 = seg(t, 0.3, 0.62), d2 = seg(t, 0.68, 1.1);
      const night = bump(t, 0.58, 0.72);
      nightL.fade(night * 0.85);
      dayL.fade(night * 0.25);
      const arc = (u) => [lerp(460, 1200, u), 370 - Math.sin(u * PI) * 160];
      const [sx, sy] = t < 0.65 ? arc(d1) : arc(d2);
      const sOn = t < 0.3 ? 0 : 1;
      pose(sunEl, { x: t < 0.3 ? 1240 : sx, y: t < 0.3 ? 170 : sy, r: Math.sin(T * 0.6), oy: 0, o: t < 0.3 ? 1 : sOn * (1 - night) });
      swing(cl, 500 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);

      /* v23 — deny himself (the bundles down), take up the cross daily, follow */
      const down = es(t, 0.08, 0.22);
      const crossOn = es(t, 0.22, 0.34);
      const walk = es(t, 0.34, 1.0, (u) => u);
      const walking = t > 0.34 && t < 1.0;
      const JX = lerp(870, 950, walk);
      jesus.set({ x: JX, y: RY(JX), s: 1.02, flip: t < 0.3, walk: walking ? t * 18 : undefined, armF: 20 + bump(t, 0.0, 0.3) * 60 + bump(t, 1.05, 1.9) * 40, armB: 10 + bump(t, 0.0, 0.3) * 80, head: -2, blink: blinkAt(T, 1) });
      F.forEach((f) => {
        const stop = f.keeper ? es(t, 1.05, 1.2) : 0;
        const x = f.x + walk * 80;
        const y = RY(x) + 10 + (f.i % 2) * 8;
        const lean = (1 - down) * 10;
        const clutch = f.keeper ? es(t, 1.08, 1.3) : 0;
        const offer = f.giver ? es(t, 1.4, 1.6) : 0;
        f.p.set({ x, y, s: 0.9, flip: f.keeper && clutch > 0.5, walk: walking ? t * 18 + f.i : undefined, armF: 10 + bump(t, 0.05, 0.25) * 60 + clutch * 70 + offer * 80, armB: 10 + clutch * 40 + offer * 50, lean: lean + clutch * 10 - offer * 4, head: -2 + clutch * 12 - offer * 6, blink: blinkAt(T, f.seed) });
        // the bundle on the back → set down by the road (and the keeper takes his back up)
        const bx = x + (f.keeper && clutch > 0 ? 18 : -22) * 0.9, by = y - 118 * 0.9;
        const gx = f.x - 16, gyy = RY(f.x) + 30;
        const regrab = f.keeper ? es(t, 1.05, 1.2) : 0;
        pose(f.b, { x: lerp(lerp(bx, gx, down), bx, regrab), y: lerp(lerp(by, gyy - 20, down), by, regrab), s: 0.9, o: 1 });
        // the cross on the shoulder
        const ck = es(t, 0.22 + f.i * 0.02, 0.34 + f.i * 0.02, ease.back) * (1 - (f.keeper ? es(t, 1.05, 1.15) : 0));
        pose(f.cross, { x: x - 8, y: lerp(y - 500, y - 118, ck), r: -24, s: 0.95, o: ck > 0.01 ? 1 : 0 });
        f.x_ = x; f.y_ = y;
      });

      /* v24 — save / lose */
      const K = F.find((f) => f.keeper), Gv = F.find((f) => f.giver);
      const lk = es(t, 1.05, 1.15) * (1 - es(t, 1.45, 1.6));
      pose(lightK, { x: K.x_ + 14, y: K.y_ - 110, s: 0.9 * (1 - es(t, 1.3, 1.55) * 0.7), o: lk });
      const sm = seg(t, 1.5, 1.95);
      pose(smoke, { x: K.x_ + 14, y: K.y_ - 120 - sm * 30, s: 0.8 + sm * 0.5, o: sm > 0 ? Math.sin(sm * PI) * 0.9 : 0 });
      const gOn = es(t, 1.35, 1.45);
      const bright = es(t, 1.6, 1.85);
      const [ghx, ghy] = hand(Gv.x_, Gv.y_, 0.9, false, 90);
      pose(lightG, { x: ghx + 10, y: ghy - 16, s: 0.9 + bright * 1.1, o: gOn });
      pose(blaze, { x: ghx + 10, y: ghy - 16, s: 0.4 + bright * 0.8, o: bright });

      S.cam.x = kf(t, [[0, -10], [0.3, -10], [1.0, 20], [1.4, 0]]);
      S.cam.z = kf(t, [[0, 1.08], [0.3, 1.06], [1.0, 1.04], [1.4, 1.1]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 30], [1.4, 50]]);
    };
  },
};
