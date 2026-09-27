// J 7,10 — the pilgrim road up to Jerusalem: the city and the Temple gleam on the hill, booths crown the roofs.
// Pilgrims walk with lulav and etrog, bundles and a donkey. First His brothers pass by on their way to the
// feast. Then Jesus goes up too — not openly: hooded in a plain mantle, walking among a family of pilgrims;
// only a faint warmth betrays Him, and a tag whispers "in secret".
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, swing, sky } from '../kit.js';
import { band, hillsWith, olive, cypress, rock, bush, grass, sun, cloud } from '../../assets/nature.js';
import { bundle, staff } from '../mark8/lib.js';
import { colt, coltRig } from '../mark11/lib.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  BROS, JESUS_HOODED, jerusalemMini, roofBooth, pilgrim, lulav, etrogHeld, townMan, townWoman, nameTag, strip, glowDisc,
  hangAt, vpose, FEAST, tr, PI,
} from './lib.js';

const RY = 736;

export default {
  id: 'j7-pilgrims',
  beats: [
    { v: 10, text: 'Kiedy zaś bracia Jego udali się na święto,' },
    { v: 10, cont: true, text: 'wówczas poszedł i On, jednakże nie jawnie, lecz skrycie.' },
  ],
  cam: { x: [-60, 80], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, FEAST);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 600, y: 140, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 980, y: 200, len: 600 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [20, 8, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.sage3, 0.3) }).markup);
    // Jerusalem on its hill, upper right, with booths on the roofs
    const city = S.layer({ par: 0.14, sh: 3 });
    city.add(`<g transform="translate(1080 520) scale(.9)">${jerusalemMini(c)}</g>`);
    let rb = '';
    [[760, 452], [850, 440], [1250, 446], [1340, 458], [940, 432]].forEach(([x, y]) => { rb += `<g transform="translate(${x} ${y}) scale(.34)">${roofBooth(c, 110, 80)}</g>`; });
    city.add(rb);
    // the Mount of Olives slope and the road climbing towards the city
    const mid = S.layer({ par: 0.24, sh: 3 });
    const h2 = hillsWith(c, { y: 560, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.hillNear, 0.5), trees: 30, treeColor: C.olive, treeH: 22, x0: -900, x1: 2500 });
    mid.add(h2.markup);
    const ground = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(640, [6, 2], [600, 150]);
    const gs = sheet();
    gs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand2, C.sage3, 0.35));
    gs.p(c.ribbon([[-900, RY + 30], [300, RY + 12], [800, RY + 4], [1300, RY - 4], [2500, RY - 30]], 110), mix(C.sand2, C.dune, 0.3));
    ground.add(gs.out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 640, fn: gfn, n: 36, h: 14, color: C.olive }) + olive(c, 300, gfn(300) + 8, 0.9) + olive(c, 1420, gfn(1420) + 8, 0.8) + cypress(c, 1330, gfn(1330) + 6, 110) + rock(c, 520, gfn(520) + 10, 70, 36));

    /* the pilgrims */
    const P = S.layer({ par: 0.5, sh: 5 });
    const donkeyEl = P.add(colt(c, { over: `<g transform="translate(-10 -96)">${bundle(c)}</g>` }));
    const donkey = coltRig(donkeyEl);
    // the brothers (v10a)
    const bros = BROS.map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...o, holdF: lulav(c, 70, 120), holdB: i % 2 ? bundle(c) : etrogHeld(c) }))) }));
    // other pilgrims, walking ahead and behind
    const crowd = Array.from({ length: 5 }, (_, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(P.add(pilgrim(c, i, { lulavA: 70 }))) }));
    // the family Jesus walks with (v10b) — and Jesus, hooded
    const fam = [
      { o: { ...townMan(c), holdF: staff(c, 150), holdB: bundle(c) }, dx: 150 },
      { o: { ...townWoman(c), holdB: etrogHeld(c) }, dx: 80 },
      { o: { ...townMan(c), holdF: lulav(c, 70, 120) }, dx: -110 },
      { o: { ...townWoman(c), holdF: lulav(c, 70, 110) }, dx: -190 },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, f.o))) }));
    const glowEl = P.add(`<g>${glowDisc(90, 'halo-glow', 0.55)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...JESUS_HOODED, holdF: staff(c, 150) })));

    /* foreground: rocks and brush on the verge */
    const fg = S.layer({ par: 0.9, sh: 6 });
    const fgf = c.wave(980, [8, 4], [500, 150]);
    fg.add(sheet().p(c.ridge(fgf, -1400, 3000, 1800, 14, 1.4), mix(C.moss2, C.olive, 0.3)).out() + bush(c, 180, 990, 120, C.moss, C.olive) + bush(c, 1470, 985, 140, C.moss, C.sage));

    /* words */
    const X = S.layer({ par: 0.5, sh: 6 });
    const brosT = hanging(X, nameTag(c, tr(['Jego bracia', 'idą na święto'], ['His brothers', 'go to the feast']), { size: 17 }), { x: 800, y: 280, len: 600 });
    const secretT = hanging(X, nameTag(c, tr(['nie jawnie,', 'lecz skrycie'], ['not openly,', 'but in secret']), { size: 18 }), { x: 800, y: 280, len: 600 });

    return (t, time) => {
      const T = time;
      swing(sunEl, 600, 140, T, 1, 0.6);
      swing(cl, 980 + Math.sin(T * 0.1) * 24, 200, T, 1.2, 0.6, 1);

      /* v10a — the brothers walk across, with the pilgrims */
      const u1 = seg(t, -0.1, 1.2);
      bros.forEach((b) => {
        const x = lerp(-300, 1560, u1) - b.i * 92;
        const mv = u1 > 0 && u1 < 1;
        b.p.set({ x, y: RY + (b.i % 2) * 8 - 4, s: 0.94, walk: mv ? x * 0.05 + b.i : undefined, armF: 70, armB: 18, blink: blinkAt(T, b.seed), o: x > -150 && x < 1750 ? 1 : 0 });
      });
      crowd.forEach((m) => {
        const x = lerp(-620 - m.i * 150, 1500 + m.i * 60, es(t, 0.0, 1.9, ease.sine)) + (m.i < 2 ? 520 : 0);
        const mv = t > 0 && t < 1.9;
        m.p.set({ x, y: RY + 10 + (m.i % 3) * 6, s: 0.9, walk: mv ? x * 0.05 + m.i : undefined, armF: 70, armB: 16, blink: blinkAt(T, m.seed), o: x > -150 && x < 1750 ? 1 : 0 });
      });
      const dx = lerp(-900, 1500, es(t, 0.0, 1.9, ease.sine)) + 380;
      donkey.set({ x: dx, y: RY + 6, s: 0.8, o: dx > -200 && dx < 1800 ? 1 : 0, walk: t > 0 && t < 1.9 ? dx * 0.05 : undefined, amt: 0.8 });
      const bk = es(t, 0.15, 0.45, ease.out), bu = es(t, 0.85, 1.0, ease.in);
      hangAt(brosT, 800, lerp(-300, 270, bk) - bu * 700, T, bk > 0 && bu < 1 ? 1 : 0, 1.3, 0.9, 1);

      /* v10b — then He goes up, hooded, among a family of pilgrims */
      const u2 = es(t, 1.0, 1.7, ease.sine);
      const JX = lerp(-200, 800, u2);
      const mv2 = u2 > 0 && u2 < 1;
      fam.forEach((f) => {
        const x = JX + f.dx;
        f.p.set({ x, y: RY + (f.i % 2) * 8, s: f.i === 1 || f.i === 3 ? 0.86 : 0.93, walk: mv2 ? x * 0.05 + f.i : undefined, armF: f.i === 0 ? 34 : f.i === 1 ? 10 : 70, armB: 16, blink: blinkAt(T, f.seed), head: bump(t, 1.6, 2.0) * -4, o: u2 > 0 ? 1 : 0 });
      });
      jesus.set({ x: JX, y: RY + 4, s: 0.98, walk: mv2 ? JX * 0.05 : undefined, armF: 34, armB: 12, head: 6 - bump(t, 1.65, 1.95) * 8, blink: blinkAt(T, 3), o: u2 > 0 ? 1 : 0 });
      vpose(glowEl, { x: JX, y: RY - 150, o: u2 > 0 ? 0.5 + Math.sin(T * 1.3) * 0.08 : 0 });
      const sk = es(t, 1.45, 1.7, ease.out);
      hangAt(secretT, 800, lerp(-300, 270, sk), T, sk > 0 ? 1 : 0, 1.3, 0.9, 2);

      S.cam.x = 20 + es(t, 1.2, 1.8) * 20;
      S.cam.z = 1.02 + es(t, 1.3, 1.9) * 0.08;
      S.cam.y = es(t, 1.3, 1.9) * 20;
    };
  },
};
