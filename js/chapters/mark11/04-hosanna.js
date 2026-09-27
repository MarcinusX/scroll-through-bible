// Mk 11,9–10 — the procession to the city gate: those ahead and those behind wave branches and cry
// "Hosanna!". The road of cloaks and the city slide towards us on the compositor while Jesus stays
// centre-stage; pennants, a banner and David's crown drop from the flies; "in the highest" — the sky opens.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, palm, cypress, grass, bush, rock, flowers, stars } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { colt, coltRig, saddleCloaks, riderLeg, cityWall, sanctuary, roadCloak, roadBranch, frond, oliveBranch, pennant, clothBanner, hang2, voiceRings, sparkle, townsfolk, TWELVE_O, headAt, plate, FONT } from './lib.js';

const PI = Math.PI;
const ROAD = 652;
const JX = 770;
const GATE = 1030;            // where the gate ends up

/** a golden crown and a little lyre — the kingdom of David */
function davidIcon(c) {
  const s = sheet();
  const cr = [[-30, 6], [-34, -22], [-18, -8], [-12, -30], [0, -12], [12, -30], [18, -8], [34, -22], [30, 6]];
  s.p(c.cut(cr, 0.4, 4), C.sun);
  s.x(c.poly(c.circ(-12, -30, 3.4, 8)) + c.poly(c.circ(12, -30, 3.4, 8)) + c.poly(c.circ(-34, -22, 3, 8)) + c.poly(c.circ(34, -22, 3, 8)), C.terracotta);
  s.x(c.ribbon([[-28, -2], [28, -2]], 2.4), shade(C.sun, -0.25));
  s.x(c.poly(c.circ(0, -4, 3.4, 8)), C.teal2);
  // the lyre
  const l = sheet();
  l.p(c.ribbon(c.qbez([-16, 44], [-26, 20], [-14, 12], 8), 5) + c.ribbon(c.qbez([16, 44], [26, 20], [14, 12], 8), 5) + c.ribbon([[-16, 44], [16, 44]], 6), C.wood2);
  l.p(c.ribbon([[-18, 14], [18, 14]], 5), C.wood);
  let strings = '';
  for (let x = -9; x <= 9; x += 4.5) strings += c.ribbon([[x, 16], [x, 42]], 0.9);
  l.x(strings, C.cream);
  return `<g transform="translate(0 -10)">${s.out()}</g><g transform="translate(0 8)">${l.out()}</g>`;
}

export default {
  id: 'm11-hosanna',
  beats: [
    { v: 9, text: 'A ci, którzy Go poprzedzali i którzy szli za Nim, wołali:' },
    { v: 9, cont: true, text: '«Hosanna!' },
    { v: 9, cont: true, text: 'Błogosławiony Ten, który przychodzi w imię Pańskie.' },
    { v: 10, text: 'Błogosławione królestwo ojca naszego Dawida, które przychodzi.' },
    { v: 10, cont: true, text: 'Hosanna na wysokościach!»' },
  ],
  cam: { x: [-30, 110], y: [-60, 40], z: [0.94, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe3e0', '#f4e6c6', '#f9ecd4'];
    const sk = sky(S, SKY);

    /* ---------- the heights ---------- */
    const heav = S.layer({ par: 0.02, sh: 1, flat: true });
    const burst = heav.add(`<g>${rays(c, { n: 26, r0: 40, r1: 1400, spread: 0.05, color: '#fff3cf' })}<circle r="260" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 420, y: 140, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 700, y: 110, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1180, y: 170, len: 700 });

    /* ---------- hills; the city wall, its gate and the Temple, sliding nearer ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3200 }).markup);
    const cityL = S.layer({ par: 0.22, sh: 4, pad: 360 });
    const GY = 612, WT = 360;
    cityL.add(`<g transform="translate(${GATE + 170} ${WT - 20})">${sanctuary(c, 1.05)}</g>`);
    // houses over the wall
    const hs = sheet();
    let hd = '';
    for (let x = GATE - 420; x < GATE + 1300; x += c.rr(34, 60)) { const h = c.rr(30, 70); if (Math.abs(x - GATE - 170) < 110) continue; hd += c.cut(c.rect(x, WT - h, c.rr(36, 58), h + 10), 0.4, 6); }
    hs.p(hd, mix(C.plaster, C.sand, 0.3));
    cityL.add(hs.out());
    cityL.add(cityWall(c, GATE - 480, GATE + 1400, WT, GY, { towers: [{ x: GATE - 90, w: 78, h: 60 }, { x: GATE + 90, w: 78, h: 60 }, { x: GATE - 420, w: 60, h: 36 }, { x: GATE + 520, w: 60, h: 36 }], gate: { x: GATE, w: 110, h: 180 }, merlon: 12 }));
    // the gate's open doors, pennants on the towers
    const gd = sheet();
    gd.p(c.cut([[GATE - 55, GY], [GATE - 55, GY - 125], [GATE - 92, GY - 118], [GATE - 92, GY + 4]], 0.4, 6) + c.cut([[GATE + 55, GY], [GATE + 55, GY - 125], [GATE + 92, GY - 118], [GATE + 92, GY + 4]], 0.4, 6), C.wood2);
    let studs = '';
    for (let y = GY - 110; y < GY - 6; y += 22) studs += c.poly(c.circ(GATE - 74, y, 2.4, 6)) + c.poly(c.circ(GATE + 74, y, 2.4, 6));
    gd.x(studs, C.sun);
    gd.p(c.cut([[GATE - 60, GY + 2], [GATE + 60, GY + 2], [GATE + 40, GY - 20], [GATE - 40, GY - 20]], 0.3, 6), mix(C.sand, C.sand2, 0.5));
    cityL.add(gd.out());
    const flags = sheet();
    [[GATE - 90, C.terracotta], [GATE + 90, C.dustyBlue]].forEach(([x, col]) => {
      flags.p(c.ribbon([[x, WT - 68], [x, WT - 150]], 3), C.wood2);
      flags.p(c.cut([[x + 2, WT - 150], [x + 52, WT - 138], [x + 2, WT - 122]], 0.4, 5), col);
    });
    cityL.add(flags.out());
    // spectators on the wall
    const onWall = [GATE - 300, GATE - 250, GATE - 190, GATE + 190, GATE + 250, GATE + 320].map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(cityL.add(person(c, townsfolk(c, { holdB: i % 2 ? `<g transform="rotate(-10)">${frond(c, 70)}</g>` : '' })))) }));
    // the banner that unrolls between the gate towers
    const bannerEl = cityL.add(`<g>${clothBanner(c, tr('Błogosławiony, który przychodzi', 'Blessed is he who comes'), { size: 20, w: 300 })}</g>`);
    // palms by the wall
    const palmsL = S.layer({ par: 0.3, sh: 3, pad: 420 });
    palmsL.add(palm(c, GATE - 560, 632, 250) + palm(c, GATE + 420, 628, 230) + palm(c, GATE - 700, 636, 200) + cypress(c, GATE + 620, 630, 150) + olive(c, -200, 640, 1) + olive(c, 200, 636, 0.9) + palm(c, 440, 636, 220));

    /* ---------- the road of cloaks and branches, moving under the procession ---------- */
    const roadL = S.layer({ par: 0.5, sh: 3, pad: 700 });
    const rs = sheet();
    rs.p(c.ridge(c.wave(606, [4, 2], [800, 200]), -1600, 3600, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4));
    rs.p(c.cut([[-1600, 626], [3600, 612], [3600, 706], [-1600, 714]], 1.4, 16), mix(C.sand, C.sand2, 0.35));
    roadL.add(rs.out());
    roadL.add(grass(c, { x0: -1400, x1: 3400, y: 612, n: 50, h: 13, color: C.olive }) + flowers(c, { x0: -1400, x1: 3400, y: 614, n: 30 }) + grass(c, { x0: -1400, x1: 3400, y: 744, n: 50, h: 16, color: C.moss }));
    const cols = [C.dustyBlue, C.roseRobe, C.wheatRobe, C.tealRobe, C.mauve, C.clayMantle, C.sageRobe, C.ochreRobe, C.plumRobe, C.skyVeil];
    let carpet = '';
    for (let x = -1500; x < 3500; x += c.rr(80, 110)) carpet += `<g transform="translate(${x} ${ROAD + 12 + c.rr(-6, 6)}) rotate(${c.rr(-6, 6)})">${roadCloak(c, c.pick(cols), c.rr(100, 130))}</g>`;
    for (let x = -1500; x < 3500; x += c.rr(50, 90)) carpet += `<g transform="translate(${x} ${ROAD + 10 + c.rr(-14, 12)}) rotate(${c.rr(-30, 30)})">${roadBranch(c, c.rr(55, 80), c.chance(0.6) ? 'palm' : 'olive')}</g>`;
    roadL.add(carpet);

    /* ---------- the crowd: behind and ahead ---------- */
    const crowdBack = S.layer({ par: 0.5, sh: 4 });
    const crowdL = S.layer({ par: 0.5, sh: 5 });
    const mk = (L, x, y, s, flip, i, kind) => {
      const hold = kind === 0 ? `<g transform="rotate(-8)">${frond(c, 100)}</g>` : kind === 1 ? `<g transform="rotate(-8)">${oliveBranch(c, 80)}</g>` : '';
      const o = kind === 3 ? { ...TWELVE_O[i % 12] } : townsfolk(c, { holdB: hold });
      if (kind === 3) o.holdB = `<g transform="rotate(-8)">${frond(c, 96)}</g>`;
      return { x, y, s, flip, i, kind, seed: c.rr(0, 9), ph: c.rr(0, 6), p: S.puppet(L.add(person(c, o))) };
    };
    const behind = [
      mk(crowdBack, 520, ROAD - 34, 0.84, false, 0, 0), mk(crowdBack, 610, ROAD - 38, 0.84, false, 1, 1), mk(crowdBack, 430, ROAD - 30, 0.84, false, 2, 0),
      mk(crowdL, 470, ROAD + 2, 0.95, false, 0, 3), mk(crowdL, 560, ROAD + 6, 0.95, false, 1, 3), mk(crowdL, 650, ROAD + 4, 0.95, false, 3, 3), mk(crowdL, 380, ROAD + 4, 0.95, false, 2, 3),
    ];
    const ahead = [
      mk(crowdBack, 930, ROAD - 36, 0.84, true, 0, 0), mk(crowdBack, 1030, ROAD - 34, 0.84, false, 1, 1), mk(crowdBack, 1120, ROAD - 38, 0.84, true, 2, 0),
      mk(crowdL, 990, ROAD + 4, 0.93, true, 3, 0), mk(crowdL, 1090, ROAD + 2, 0.93, false, 4, 1), mk(crowdL, 1190, ROAD + 6, 0.93, true, 5, 0),
    ];
    const kids = [[948, ROAD + 10, true], [640, ROAD + 16, false]].map(([x, y, flip], i) => ({ x, y, flip, i, seed: c.rr(0, 9), p: S.puppet(crowdL.add(person(c, townsfolk(c, { hairStyle: i ? 'curly' : 'veil', beard: 'none', holdB: `<g transform="rotate(-6)">${frond(c, 80)}</g>` })))) }));

    /* ---------- Jesus on the colt ---------- */
    const jL = S.layer({ par: 0.5, sh: 5 });
    const coltEl = jL.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]), rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g>${riderLeg(c)}` }));
    const cRig = coltRig(coltEl);
    const jRide = S.puppet(S.$('rider').firstElementChild);

    /* ---------- the flies: pennants, the crown of David, confetti ---------- */
    const fx = S.layer({ par: 0.35, sh: 5 });
    const LET = [...tr('HOSANNA', 'HOSANNA')];
    const PC = [C.terracotta, C.ochre, C.teal2, C.jesusMantle, C.dustyBlue, C.moss, C.plumRobe];
    const span = 560;
    const sag = (u) => Math.sin(u * PI) * 60;
    let pen = `<path d="${c.ribbon(Array.from({ length: 21 }, (_, i) => [-span / 2 + (i / 20) * span, sag(i / 20)]), 2)}" fill="${C.rope}"/>`;
    LET.forEach((ch, i) => { const u = (i + 0.5) / LET.length; pen += `<g transform="translate(${-span / 2 + u * span - 21} ${sag(u) + 1}) rotate(${(u - 0.5) * -14})">${pennant(c, ch, PC[i % PC.length])}</g>`; });
    const penEl = fx.add(`<g>${hang2(pen, span / 2, 500)}</g>`);
    const david = hanging(fx, plate(c, davidIcon(c), { r: 56, rim: C.sun }), { x: 790, y: 318, len: 800 });
    const conf = Array.from({ length: 22 }, (_, i) => ({ i, el: fx.add(`<g>${i % 3 ? `<path d="${c.cut(c.ell(0, 0, 10, 4, 10, c.rr(0, 3)), 0.2, 3)}" fill="${[C.leaf, C.moss, C.sage][i % 3]}"/>` : `<path d="${c.cut(c.star(0, 0, 7, 3, 5, c.rr(0, 6)), 0.2, 3)}" fill="${[C.cream, C.jesusMantle, C.sun][i % 3]}"/>`}</g>`), x: c.rr(420, 1180), ph: c.rr(0, 1), sp: c.rr(0.6, 1.2), r: c.rr(-200, 200) }));
    const voiceL = S.layer({ par: 0.5, sh: 2 });
    const voices = [0, 1, 2].map(() => voiceRings(voiceL, c, { n: 3, r: 30, w: 5, color: shade(C.terracotta, 0.3) }));
    const glint = fx.add(`<g>${sparkle(c, 18)}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6, pad: 300 });
    fg.add(bush(c, 200, 900, 240, C.sage, C.moss) + rock(c, 1300, 910, 180, 60, C.rock2) + palm(c, 40, 940, 330));

    return (t, time) => {
      const T = time;
      const high = es(t, 4.05, 4.5);
      sk.blend(SKY, ['#e6eee2', '#fbf0d2', '#fcf2dc'], high);
      swing(sunEl, 420, 140, T, 1, 0.7);
      swing(cl1, 700 + Math.sin(T * 0.1) * 26, 110 - high * 40, T, 1.3, 0.6, 1);
      swing(cl2, 1180 + Math.sin(T * 0.12 + 1) * 26, 170 - high * 40, T, 1.3, 0.7, 2);
      pose(burst, { x: 800, y: -60, s: 0.4 + high * 0.8, r: t * 6, o: high * 0.55 });

      /* the procession advances: the road and the city slide towards us */
      const adv = t / 5;
      roadL.shift(260 - adv * 560, 0);
      cityL.shift(300 - es(t, 0, 5, ease.sine) * 300, 0);
      palmsL.shift(360 - es(t, 0, 5, ease.sine) * 380, 0);
      fg.shift(200 - adv * 400, 0);
      const step = t * 9;
      const cry = es(t, 0.3, 0.6);
      const wave = (i, a = 1) => Math.sin(t * 11 + i * 1.7) * 18 * a;

      cRig.set({ x: JX, y: ROAD + 6, s: 1, walk: step, amt: 0.8, nod: Math.sin(t * 5) * 2, ear: Math.sin(t * 7) * 6 + bump(t, 1, 1.4) * 14, tail: Math.sin(t * 9) * 8 });
      const bless = es(t, 2.05, 2.4) * (1 - es(t, 4.0, 4.3));
      jRide.set({ x: 0, y: 0, s: 1, armF: 30 + bless * 70 + high * 20, armB: 20 + high * 110, head: -4 - high * 8 + bless * 2, blink: blinkAt(T) });

      const act = (m, j, lagX) => {
        const up = es(t, 0.9 + (m.i % 3) * 0.05, 1.2 + (m.i % 3) * 0.05);
        const bow = bump(t, 2.15 + (m.i % 4) * 0.05, 2.9) * (m.kind === 3 ? 1 : 0.6);
        const turnBack = m.flip;
        m.p.set({
          x: m.x, y: m.y, s: m.s, flip: turnBack, walk: step + m.ph,
          armB: m.kind === 2 ? 0 : 40 + up * 100 + wave(j) * up + high * 20, armF: cry * 20 + bump(t, 3.1, 3.9) * 40 + high * (m.kind === 1 ? 90 : 30),
          head: -cry * 6 - high * 10 + bow * 14, lean: bow * (turnBack ? -6 : 6), blink: blinkAt(T, m.seed),
        });
      };
      behind.forEach((m, j) => act(m, j));
      ahead.forEach((m, j) => act(m, j + 7));
      kids.forEach((k, j) => k.p.set({ x: k.x, y: k.y, s: 0.66, flip: k.flip, walk: step * 1.3 + j, armB: 60 + es(t, 0.9, 1.2) * 90 + wave(j + 3, 1.4), armF: 40 + high * 60, head: -8, bob: -Math.abs(Math.sin(t * 8 + j)) * 6 * es(t, 1, 1.3), blink: blinkAt(T, k.seed) }));
      onWall.forEach((m) => m.p.set({ x: m.x, y: WT - 2, s: 0.46, flip: m.x > GATE, armB: es(t, 1.0, 1.3) * 140 + wave(m.i + 11) , armF: es(t, 2.0, 2.3) * 70 + high * 50, blink: blinkAt(T, m.seed) }));

      // voices
      const heads = [[behind[4].x, behind[4].y, 0.95, false], [ahead[3].x, ahead[3].y, 0.93, true], [behind[0].x, behind[0].y, 0.84, false], [ahead[5].x, ahead[5].y, 0.93, true]];
      voices.forEach((v, i) => { const [x, y, s, f] = heads[i]; const [hx, hy] = headAt(x, y, s, f); v(hx + (f ? -14 : 14), hy + 4, cry * (1 - es(t, 4.9, 5)) * (0.6 + bump(t, 1, 1.5) * 0.4 + high * 0.4), T, { dir: f ? -1 : 1 }); });

      /* v9b — HOSANNA pennants drop in; v10b — they rise "into the highest" */
      const pd = es(t, 1.0, 1.4, ease.back);
      pose(penEl, { x: 800, y: 136 - (1 - pd) * 600 - high * 50 - bump(t, 3.0, 4.2) * 20, r: Math.sin(t * 2.6) * (1.2 + high * 1.5), oy: 0 });
      /* v9c — the banner unrolls between the gate towers */
      const unroll = es(t, 2.05, 2.5);
      pose(bannerEl, { x: GATE, y: WT - 60, sy: Math.max(0.01, unroll), o: unroll > 0.01 ? 1 : 0 });
      pose(glint, { x: JX, y: ROAD - 280, s: bump(t, 2.1, 2.8) * 1.4 + 0.001, r: t * 60, o: bump(t, 2.1, 2.8) });
      /* v10a — the crown of David comes down */
      const dv = es(t, 3.05, 3.45, ease.back) * (1 - es(t, 4.4, 4.8));
      swing(david, 790, 318 - (1 - dv) * 700, T, 1.6, 0.8, 2);
      /* v10b — confetti of leaves and petals thrown up high */
      conf.forEach((f) => {
        const k = seg(t, 4.1 + f.ph * 0.4, 4.9 + f.ph * 0.1);
        const up = Math.sin(k * PI);
        pose(f.el, { x: f.x + Math.sin(t * 9 * f.sp + f.i) * 20, y: 560 - up * (300 + f.i * 8), r: f.r * k * 3, s: 1.2, o: k > 0 && k < 1 ? 1 : 0 });
      });

      S.cam.x = es(t, 0, 5, ease.sine) * 70;
      S.cam.z = 1.04 - es(t, 3.9, 4.6) * 0.08;
      S.cam.y = 10 - es(t, 3.9, 4.6) * 50;
    };
  },
};
