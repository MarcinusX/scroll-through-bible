// J 1,14 — The Word became flesh: the flame comes down out of the night into a tent, and there is a child.
// He pitched His tent among us: the camp around wakes, lamps are lit, people come. We saw His glory —
// the glory the only Son has from the Father (a light from above, never a figure), full of grace and truth.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, stars, olive, rock, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { NIGHT, LOOK, wordFlame, glowDisc, rayBurst, radiance, bigTent, manger, baby, handLamp, hungGold, glory, hand, tint, man as manOpts, woman as womanOpts, sparkle, PI } from './lib.js';

const TX = 800, TY = 700;          // the tent
const NC = '#2b3262';

export default {
  id: 'j1-flesh',
  beats: [
    { v: 14, text: 'A Słowo stało się ciałem' },
    { v: 14, cont: true, text: 'i zamieszkało wśród nas.' },
    { v: 14, cont: true, text: 'I oglądaliśmy Jego chwałę,' },
    { v: 14, cont: true, text: 'chwałę, jaką Jednorodzony otrzymuje od Ojca, pełen łaski i prawdy.' },
  ],
  cam: { x: [-30, 30], y: [-80, 60], z: [0.94, 1.3] },
  build(S) {
    const c = S.c;
    const sk = sky(S, NIGHT);
    S.layer({ par: 0.02, sh: 1, flat: true }).add(stars(c, { x0: -900, x1: 2500, y0: -700, y1: 460, n: 140 }));

    /* ---------- the light from above (v14d) ---------- */
    const aboveL = S.layer({ par: 0.03, sh: 1, flat: true });
    const aGlow = aboveL.add(`<g>${glowDisc(360, 'halo-glow', 1)}</g>`);
    const aBeam = aboveL.add(`<path d="${c.poly([[TX - 50, -900], [TX + 50, -900], [TX + 230, TY], [TX - 230, TY]])}" fill="#fff1c4" opacity=".4"/>`);
    const aDisc = S.layer({ par: 0.03, sh: 5 }).add(`<g>${radiance(c, 80)}</g>`);

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 540, amps: [18, 8, 3], lens: [1000, 360, 130], color: tint(C.hillMid, NC, 0.6) }).markup);
    const back = S.layer({ par: 0.16, sh: 3 });
    back.add(tint(olive(c, 180, 612, 0.8) + olive(c, 1420, 610, 0.9), NC, 0.55));
    back.add(sheet().p(c.ridge(c.wave(606, [8, 3], [600, 180]), -900, 2500, 1700, 12, 1), tint(C.hillNear, NC, 0.5)).out());

    /* ---------- the camp: small tents all around ---------- */
    const camp = S.layer({ par: 0.3, sh: 3 });
    const small = [[250, 640, C.clayMantle, 0.7], [470, 628, C.stone, 0.6], [1130, 630, C.ochreRobe, 0.62], [1360, 642, C.dustyBlue, 0.72], [-40, 650, C.sageRobe, 0.75], [1640, 652, C.roseRobe, 0.75]].map(([x, y, col, sc], i) => {
      const t = bigTent(c, { w: 190, h: 150, col: tint(col, NC, 0.35), stripe: tint(C.terracotta, NC, 0.35), inside: '#3a2c30' });
      camp.add(`<g transform="translate(${x} ${y}) scale(${sc})">${t.back}<g transform="translate(0 -150) rotate(14)">${t.flapL}</g><g transform="translate(0 -150) rotate(-14)">${t.flapR}</g></g>`);
      const glow = camp.add(`<g>${glowDisc(90, 'warm-glow', 1)}</g>`);
      return { x, y, sc, glow, i };
    });
    camp.add(sheet().p(c.ridge(c.wave(660, [4, 2], [500, 150]), -900, 2500, 1700, 12, 1), tint(C.sand2, NC, 0.4)).out());
    camp.add(tint(grass(c, { x0: -900, x1: 2500, y: 662, n: 50, h: 14, color: C.olive }) + rock(c, 620, 700, 60, 22, C.rock2), NC, 0.4));

    /* ---------- the tent of the Word ---------- */
    const T = S.layer({ par: 0.4, sh: 4 });
    const tent = bigTent(c, { w: 320, h: 260, col: C.wheatRobe, stripe: C.terracotta, inside: '#5c3f35' });
    T.add(`<g transform="translate(${TX} ${TY})">${tent.back}</g>`);
    const inGlow = T.add(`<g>${glowDisc(170, 'warm-glow', 1)}</g>`);
    T.add(`<g transform="translate(${TX} ${TY - 26})">${manger(c)}</g>`);
    const babyEl = T.add(`<g>${baby(c)}</g>`);
    const flapL = T.add(`<g>${tent.flapL}</g>`);
    const flapR = T.add(`<g>${tent.flapR}</g>`);
    const mary = S.puppet(T.add(person(c, { ...LOOK.mary, pose: 'kneel' })));
    const JOSEPH = { robe: C.sageRobe, mantle: C.wood3, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather, holdB: `<g transform="translate(0 -30)"><path d="${c.ribbon([[0, -60], [0, 160]], 5)}" fill="${C.wood2}"/></g>` };
    const joseph = S.puppet(T.add(person(c, JOSEPH)));

    /* ---------- the people of the camp who come ---------- */
    const P = S.layer({ par: 0.45, sh: 4 });
    const lamp = handLamp(c, { glowR: 70 });
    const COMERS = [
      { o: manOpts(c, { robe: C.dustyBlue, holdF: lamp }), x: 470, from: -200, y: 778, s: 0.92, lamp: true },
      { o: womanOpts(c, { robe: C.mauve, veil: C.linen2 }), x: 380, from: -300, y: 800, s: 0.95 },
      { o: { robe: C.skyVeil, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2 }, x: 555, from: -120, y: 792, s: 0.62 },
      { o: womanOpts(c, { robe: C.ochreRobe, veil: C.skyVeil, holdF: lamp }), x: 1080, from: 1800, y: 780, s: 0.92, lamp: true },
      { o: manOpts(c, { robe: C.clayMantle, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, hair: C.greyHair }), x: 1190, from: 1900, y: 800, s: 0.95 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(P.add(person(c, m.o))) }));

    /* ---------- the flame coming down; glory; grace and truth ---------- */
    const G = S.layer({ par: 0.4, sh: 1, flat: true });
    const gl = G.add(`<g>${glowDisc(420, 'halo-glow', 1)}${rayBurst(c, { n: 22, r0: 60, r1: 520, spread: 0.03, color: '#ffe9b0', o: 0.5 })}</g>`);
    const flash = G.add(`<g>${glowDisc(260, 'halo-glow', 1)}</g>`);
    const trail = [0, 1, 2, 3, 4, 5].map((i) => G.add(`<g>${sparkle(c, 7 + (i % 3) * 3)}</g>`));
    const FL = S.layer({ par: 0.4, sh: 4 });
    const fGlow = FL.add(`<g>${glowDisc(200, 'warm-glow', 1)}</g>`);
    const flameEl = FL.add(`<g>${wordFlame(c, 80)}</g>`);
    const W = S.layer({ par: 0.3, sh: 6 });
    const grace = W.add(hungGold(c, tr('łaska', 'grace'), { size: 30 }));
    const truth = W.add(hungGold(c, tr('prawda', 'truth'), { size: 30 }));

    return (t, time) => {
      const flick = time ? Math.sin(time * 7.3) * 0.03 : 0;
      /* v14a: the flame comes down into the tent — and becomes a child */
      const fall = es(t, 0.05, 0.55, ease.io);
      const into = es(t, 0.5, 0.66);
      const fx = TX + Math.sin(fall * PI) * 60, fy = lerp(-160, TY - 40, fall);
      pose(flameEl, { x: fx, y: fy + 40, s: 1 - into * 0.9, sx: (1 - into * 0.9) * (1 + flick), o: into < 0.98 ? 1 : 0 });
      pose(fGlow, { x: fx, y: fy, s: 1 - into * 0.4, o: 1 - into });
      trail.forEach((sp, i) => {
        const k = seg(t, 0.05 + i * 0.05, 0.6 + i * 0.05);
        const u = Math.max(0, fall - 0.08 * (i + 1));
        pose(sp, { x: TX + Math.sin(u * PI) * 60 + (i % 2 ? 10 : -10), y: lerp(-160, TY - 40, u), s: 0.9 - i * 0.1, r: t * 90, o: bump(t, 0.05 + i * 0.04, 0.7) * 0.8 });
      });
      const born = es(t, 0.56, 0.8, ease.out);
      pose(flash, { x: TX, y: TY - 60, s: 0.4 + bump(t, 0.52, 0.95) * 1.6, o: bump(t, 0.52, 0.95) });
      pose(babyEl, { x: TX - 4, y: TY - 70, s: 1.25 * (0.6 + born * 0.4), o: born });
      pose(inGlow, { x: TX, y: TY - 70, s: 0.5 + born * 0.6 + es(t, 2.05, 2.4) * 0.4, o: Math.max(born, 0.25) });
      const open = es(t, 0.3, 0.55) * 22;
      pose(flapL, { x: TX, y: TY - 260, r: open + 6 });
      pose(flapR, { x: TX, y: TY - 260, r: -open - 6 });
      mary.set({ x: TX - 150, y: TY + 22, s: 0.9, flip: false, armF: 40 + born * 30, armB: born * 70, head: 8 + born * 6, blink: blinkAt(time, 1) });
      joseph.set({ x: TX + 170, y: TY + 22, s: 0.95, flip: true, armF: 20 + born * 40, armB: 8, head: 6 + born * 4, blink: blinkAt(time, 3) });

      /* v14b: He dwelt among us — the camp wakes, lamps are lit, people come */
      const wake = es(t, 1.05, 1.5);
      small.forEach((s) => pose(s.glow, { x: s.x, y: s.y - 60 * s.sc, s: s.sc * seg(t, 1.05 + s.i * 0.06, 1.25 + s.i * 0.06), o: seg(t, 1.05 + s.i * 0.06, 1.25 + s.i * 0.06) }));
      COMERS.forEach((m) => {
        const k = es(t, 1.2 + m.i * 0.05, 1.8 + m.i * 0.05);
        const x = lerp(m.from, m.x, k);
        const see = es(t, 2.05, 2.4);
        const kneel = es(t, 3.2, 3.5) * (m.i % 2);
        m.p.set({ x, y: m.y, s: m.s, flip: m.x > TX, o: k > 0.001 ? 1 : 0, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: m.lamp ? 50 + see * 10 : see * 60, armB: see * (m.lamp ? 0 : 110) + kneel * 20, head: -see * 8, lean: kneel * 8, blink: blinkAt(time, m.i) });
      });

      /* v14c: we saw His glory */
      const gk = es(t, 2.05, 2.5);
      pose(gl, { x: TX, y: TY - 90, s: 0.3 + gk * 0.6 + es(t, 3.05, 3.4) * 0.15, r: t * 3, o: gk * 0.4 * (1 - es(t, 3.05, 3.4) * 0.4) });

      /* v14d: glory from the Father — light from above; full of grace and truth */
      const fa = es(t, 3.05, 3.45);
      pose(aDisc, { x: TX, y: lerp(-320, 170, fa), s: 1, o: fa });
      pose(aGlow, { x: TX, y: lerp(-320, 170, fa), s: 1, o: fa });
      pose(aBeam, { o: fa * 0.45 });
      const gw = es(t, 3.3, 3.6, ease.out), tw = es(t, 3.45, 3.75, ease.out);
      pose(grace, { x: 560, y: lerp(-600, 380, gw), r: Math.sin(t * 3.2) * 1.6, o: gw > 0.01 ? 1 : 0 });
      pose(truth, { x: 1040, y: lerp(-600, 380, tw), r: Math.sin(t * 3.2 + 2) * 1.6, o: tw > 0.01 ? 1 : 0 });

      /* camera: close on the tent as the Word comes, wide for the camp, up for the light from above */
      S.cam.z = 1.02 + es(t, 0.3, 0.8) * 0.22 - es(t, 1.0, 1.5) * 0.28 + es(t, 2.0, 2.4) * 0.06 - es(t, 3.0, 3.4) * 0.04;
      S.cam.y = es(t, 0.3, 0.8) * 50 - es(t, 1.0, 1.5) * 50 - es(t, 3.0, 3.4) * 40;
    };
  },
};
