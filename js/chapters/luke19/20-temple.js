// Łk 19,45–46 — the Court of the Gentiles in the Temple, crowded with trade: a money changer's table with its stacks
// and scales, a bench of dove cages, a man with a lamb, buyers haggling. Jesus comes in and begins to drive out those
// who sell: the table goes over and the coins roll across the paving, the cages tumble open and the doves fly up, the
// sellers scatter to both sides. Then He stands in the emptied court with His hand raised: "It is written: My house
// shall be a house of prayer" — a plate comes down: people at prayer with their hands lifted before the lamp — "but you
// have made it a den of robbers" — and a second plate: a dark cave, shadowy thieves crouched over their plunder.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { templeCourt, courtFront, changerTable, coinStack, coin, balance, cage, smallDove, flapDove, bench, lamb, folk, still, hungPlate, strip, fig, say, dust, headAt, hand, kf, tr, es, ease, bump, seg, PI, TEMPLE, mix, shade, sheet } from './lib.js';
import { menorah } from '../mark2/lib.js';

const FLOOR = 676;
const TB0 = { x: 990, w: 150 }, BN = { x: 560, w: 160 };
const PA = [600, 300], PB = [1000, 300], PR = 104;

export default {
  id: 'lk19-temple',
  beats: [
    { v: 45 },
    { v: 46 },
  ],
  cam: { x: [-80, 120], y: [-60, 40], z: [0.98, 1.14] },
  build(S) {
    const c = S.c;
    const TB = S.portrait ? { x: 900, w: 150 } : TB0;   // phone: the overturned table lands clear of the progress thread
    const { sunEl, cl1 } = templeCourt(S, { skyCols: TEMPLE, floorY: FLOOR + 40, sanctX: 800, sunAt: [1220, 140] });
    const mk = S.layer({ par: 0.5, sh: 5 });
    /* sellers and buyers */
    const TR = [[330, -18, false, -1], [420, -10, true, -1], [700, -16, true, -1], [1150, -18, false, 1], [1260, -10, true, 1], [1360, -16, false, 1]].map(([x, dy, flip, dir], i) => ({ x, y: FLOOR + dy, flip, dir, i, p: S.puppet(mk.add(person(c, folk(c, i % 3 !== 1)))) }));
    const lambEl = mk.add(`<g>${lamb(c)}</g>`);
    const changer = S.puppet(mk.add(person(c, folk(c, true, { robe: C.ochreRobe, mantle: C.plumRobe, belt: C.sun }))));
    const table = mk.add(`<g>${changerTable(c, TB.w)}<g transform="translate(-44 -60)">${coinStack(c, 5, 9)}</g><g transform="translate(-18 -60)">${coinStack(c, 7, 9)}</g><g transform="translate(36 -60)">${balance(c)}</g></g>`);
    const coins = Array.from({ length: 9 }, (_, k) => ({ k, el: mk.add(`<g>${coin(c, 7)}</g>`), x0: TB.x - 50 + k * 10, y0: FLOOR - 66 - (k % 3) * 4, x1: TB.x - 110 + k * 36 + c.rr(-20, 20), y1: FLOOR + c.rr(4, 40), h: c.rr(60, 140), roll: c.rr(20, 70), d: k * 0.015 }));
    const dover = S.puppet(mk.add(person(c, folk(c, true, { robe: C.tealRobe, mantle: null, belt: C.leather }))));
    const benchEl = mk.add(`<g>${bench(c, BN.w, 38)}</g>`);
    const cages = [-46, 30].map((dx, i) => ({ dx, i, el: mk.add(`<g>${cage(c, 60, 54)}</g>`) }));
    const doves = Array.from({ length: 5 }, (_, i) => ({ i, el: mk.add(`<g>${smallDove(c)}</g>`), x1: 360 + i * 230 + c.rr(-40, 40), y1: c.rr(-60, 120), ph: c.rr(0, 6) }));
    const dusts = [0, 1].map(() => mk.add(`<g>${dust(c, 30, mix(C.stone, C.sand, 0.4))}</g>`));
    const jesus = S.puppet(mk.add(person(c, CAST.jesus)));
    /* the two plates */
    const pl = S.layer({ par: 0.3, sh: 5 });
    const plA = pl.add(`<g>${hungPlate(S, c, PR, prayerInner(c), { face: mix(C.halo, C.cream, 0.5) })}<g transform="translate(0 ${PR + 26})">${strip(c, tr('dom modlitwy', 'a house of prayer'), { size: 17 })}</g></g>`);
    const plB = pl.add(`<g>${hungPlate(S, c, PR, caveInner(c), { face: mix(C.storm2, C.soilDark, 0.4), rim: C.rock2 })}<g transform="translate(0 ${PR + 26})">${strip(c, tr('jaskinia zbójców', 'a den of robbers'), { size: 17 })}</g></g>`);
    courtFront(S);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1220, y: 140, r: T ? Math.sin(T * 0.6) : 0 });
      pose(cl1, { x: 470 + (T ? Math.sin(T * 0.1) * 26 : 0), y: 140 });
      /* v45 — He enters the Temple and begins to drive out those who sold */
      const inK = es(t, -0.5, 0.2, ease.out);
      const flipT = es(t, 0.35, 0.55, ease.in), flipB = es(t, 0.5, 0.7, ease.in);
      const jx = lerp(260, 800, inK);
      const sweep = bump(t, 0.2, 0.9);
      const raise = es(t, 1.05, 1.25);
      jesus.set({ x: jx, y: FLOOR + 10, s: 1.04, walk: inK > 0 && inK < 1 ? jx * 0.05 : undefined, armF: sweep * (80 + Math.sin(t * 20) * 20) + raise * 40, armB: sweep * 60 + raise * 130, lean: bump(t, 0.3, 0.7) * 6, head: -raise * 4, blink: blinkAt(T) });
      TR.forEach((m) => {
        const go = es(t, 0.3 + m.i * 0.04, 0.8 + m.i * 0.03, ease.in);
        const x = m.x + m.dir * go * 700;
        m.p.set({ x, y: m.y, s: 0.92, flip: go > 0.02 ? m.dir < 0 : m.flip, walk: go > 0 && go < 1 ? x * 0.08 : undefined, armF: 20 + go * 40 + (1 - seg(t, 0.2, 0.3)) * (m.i % 2) * 40, armB: go * 100, lean: go * 10 * m.dir, blink: blinkAt(T, m.i + 3), o: 1 - seg(t, 0.85, 0.95) });
      });
      const lg = es(t, 0.35, 0.85, ease.in);
      pose(lambEl, { x: 1210 + lg * 600, y: FLOOR + 30 - (lg > 0 && lg < 1 ? Math.abs(Math.sin(t * 30)) * 6 : 0), s: 0.8, o: 1 - seg(t, 0.85, 0.95) });
      pose(table, { x: TB.x + TB.w / 2 + flipT * 30, y: FLOOR - 4 + flipT * 4, r: flipT * 96, ox: TB.w / 2, oy: 0 });
      const cf = es(t, 0.4, 0.9, ease.in);
      const cxh = TB.x + 30 + cf * 520;
      changer.set({ x: cxh, y: FLOOR - 26, s: 0.9, flip: cf < 0.05, walk: cf > 0 && cf < 1 ? cxh * 0.08 : undefined, armB: bump(t, 0.35, 0.7) * 150 + cf * 60, armF: 40 + bump(t, 0.35, 0.7) * 80, blink: blinkAt(T, 7), o: 1 - seg(t, 0.88, 0.96) });
      coins.forEach((co) => {
        const k = seg(t, 0.42 + co.d, 0.72 + co.d), r = seg(t, 0.7 + co.d, 1.0);
        const x = lerp(co.x0, co.x1, k) + ease.out(r) * co.roll, y = lerp(co.y0, co.y1, k) - Math.sin(k * PI) * co.h;
        pose(co.el, { x, y, r: k * 540 + r * 300, sx: k > 0 ? 0.4 + Math.abs(Math.cos(k * 9 + r * 6)) * 0.6 : 1, o: 1 });
      });
      pose(benchEl, { x: BN.x - BN.w / 2 - flipB * 20, y: FLOOR - 4, r: -flipB * 94, ox: -BN.w / 2, oy: 0 });
      cages.forEach((cg) => { const f = es(t, 0.55 + cg.i * 0.05, 0.75 + cg.i * 0.05, ease.in); pose(cg.el, { x: BN.x + cg.dx - f * (50 + cg.i * 40), y: FLOOR - 70 + f * 58, r: -f * (70 + cg.i * 40), ox: 0, oy: -28 }); });
      const df = es(t, 0.5, 0.9, ease.in);
      const dxh = BN.x - 70 - df * 520;
      dover.set({ x: dxh, y: FLOOR - 10, s: 0.92, flip: true, walk: df > 0 && df < 1 ? dxh * 0.08 : undefined, armB: bump(t, 0.45, 0.8) * 150, armF: 40, blink: blinkAt(T, 9), o: 1 - seg(t, 0.88, 0.96) });
      doves.forEach((dv) => {
        const k = es(t, 0.6 + dv.i * 0.04, 1.0 + dv.i * 0.03, ease.in);
        const sx = BN.x + (dv.i % 2 ? 30 : -46), sy = FLOOR - 50;
        const x = lerp(sx, dv.x1, k), y = lerp(sy, dv.y1, k) - Math.sin(k * PI) * 80;
        pose(dv.el, { x, y, s: 0.8 + k * 0.3, sx: dv.x1 < sx ? -1 : 1, r: k > 0 ? -16 : 0, o: k < 1 ? 1 : 0 });
        if (k > 0) flapDove(dv.el, t * 3 + dv.ph, 34, 12, -10); else flapDove(dv.el, 0, 0, 0, 0);
      });
      dusts.forEach((d, i) => { const at = i ? 0.55 : 0.4; const k = seg(t, at, at + 0.4); pose(d, { x: i ? BN.x - 20 : TB.x + 70, y: FLOOR - 20 - k * 30, s: 0.5 + k * 1.4, o: bump(t, at, at + 0.4) * 0.8 }); });
      /* v46 — a house of prayer … a den of robbers */
      const a = es(t, 1.08, 1.35, ease.back), b = es(t, 1.4, 1.65, ease.back);
      pose(plA, { x: PA[0], y: lerp(-1300, PA[1], a), r: T ? Math.sin(T * 0.7) * 1 : 0, o: a > 0.001 ? 1 : 0 });
      pose(plB, { x: PB[0], y: lerp(-1300, PB[1], b), r: T ? Math.sin(T * 0.7 + 1) * 1 : 0, o: b > 0.001 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -40], [0.3, 0], [1.0, 0]]);
      S.cam.y = kf(t, [[-0.5, 10], [0.3, 20], [1.05, -40]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.3, 1.08], [1.05, 1.02]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -60], [0.3, 0]]); S.cam.z = 1.0; }
      void hand; void headAt; void say; void shade; void sheet; void still;
    };
  },
};
/** plate A: people at prayer before a lamp, hands lifted */
function prayerInner(c) {
  const s = sheet();
  s.p(c.cut([[-120, 50], [120, 46], [120, 130], [-120, 130]], 0.4, 10), mix(C.stone, C.cream, 0.3));
  return s.out() + `<circle cx="0" cy="-10" r="60" fill="url(#warm-glow)"/><g transform="translate(0 40) scale(.5)">${menorah(c)}</g>`
    + fig(c, { robe: C.dustyBlue, mantle: C.linen2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', skin: C.skin2 }, { x: -66, y: 70, s: 0.4, flip: false, armF: 150, armB: 150, head: -10 })
    + fig(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, hair: C.hair, skin: C.skin3, beard: 'none' }, { x: 64, y: 70, s: 0.38, flip: true, armF: 140, armB: 150, head: -10 })
    + fig(c, { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, pose: 'kneel' }, { x: -24, y: 80, s: 0.36, flip: false, armF: 150, armB: 140, head: -8 });
}
/** plate B: a dark cave, thieves' shadows crouched over their plunder */
function caveInner(c) {
  const s = sheet();
  const rockC = mix(C.rock3, C.storm2, 0.4);
  s.p(c.cut([[-120, -120], [120, -120], [120, 130], [-120, 130]], 0.4, 10), rockC);
  s.p(c.cut([[-80, 90], [-76, 10], ...c.arc(0, 10, 76, 70, PI, 2 * PI, 14), [76, 10], [80, 90]], 0.8, 6), mix(C.night2, C.soilDark, 0.4));
  const dark = '#2d2430';
  const thief = (x, fl) => `<g transform="translate(${x} 86) scale(${fl ? -0.34 : 0.34} .34)">${person(c, { robe: dark, mantle: null, skin: dark, hair: dark, hairStyle: 'wrap', veil: dark, beard: 'full', beardColor: dark, eyes: 'open' }).split(`fill="${C.blush}"`).join(`fill="${dark}"`)}</g>`;
  return s.out() + thief(-40, false) + thief(44, true) + `<path d="${c.cut(c.blob(4, 80, 22, 14, 10, 0.2), 0.4, 4)}" fill="${C.leather}"/><path d="${c.cut(c.circ(-6, 70, 5, 8), 0.2, 3)}${c.cut(c.circ(10, 72, 5, 8), 0.2, 3)}" fill="${C.sun}"/>`;
}
