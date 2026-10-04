// Mk 5,3–5 — who the man is: he lives among the tombs; chains lie broken around him; men come to bind
// him hand and foot, he bursts the chains and the fetters, nobody can tame him; day and night he cries
// out among the tombs and on the hills and strikes himself with stones (dark scratches, nothing more).
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, moon, sun, stars, rock, grass, cypress } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { LOOK, kf, tomb, boulders, shadowCloak, cry, chain, link, fetter, sharpStone, scratches, armMarks, onBody, townsfolk, spirit } from './lib.js';

const PI = Math.PI;
const MX = 800, FEET = 668;

export default {
  id: 'm5-tombs',
  beats: [
    { v: 3, text: 'Mieszkał on stale w grobach' },
    { v: 3, cont: true, text: 'i nawet łańcuchem nie mógł go już nikt związać.' },
    { v: 4, text: 'Często bowiem wiązano go w pęta i łańcuchy;' },
    { v: 4, cont: true, text: 'ale łańcuchy kruszył, a pęta rozrywał,' },
    { v: 4, cont: true, text: 'i nikt nie zdołał go poskromić.' },
    { v: 5, text: 'Wciąż dniem i nocą krzyczał,' },
    { v: 5, cont: true, text: 'tłukł się kamieniami w grobach i po górach.' },
  ],
  cam: { x: [-40, 120], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const MOONX = P ? 1020 : 1120, SUNX = P ? 590 : 520;   // phone: moon and sun clear of the thread and the frame
    sky(S, ['#171d44', '#2b3470', '#56608f'], { name: 'night' });
    const daySky = sky(S, ['#bcd3d4', '#e9e0c6', '#f3e2c2'], { name: 'day' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -500, y1: 420, n: 130 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 36)}`, { x: MOONX, y: 160, len: 900 });
    const sunEl = hanging(hangL, sun(c, 42), { x: SUNX, y: 160, len: 900 });

    /* ---------- hills behind, the rock face with tombs ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 420, amps: [30, 12, 4], lens: [900, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup);
    const cliffL = S.layer({ par: 0.3, sh: 4 });
    const cfn = c.wave(360, [26, 10, 4], [700, 230, 90]);
    const cpts = [];
    for (let x = -900; x <= 2500; x += 14) cpts.push([x, cfn(x) + (x > 1000 ? -(x - 1000) * 0.16 : 0) + c.rr(-2, 2)]);
    cpts.push([2500, 1700], [-900, 1700]);
    const cs = sheet().p(c.poly(cpts), mix(C.rock, C.duskViolet, 0.22));
    // strata lines in the rock
    let strata = '';
    for (let i = 0; i < 9; i++) { const y = 420 + i * 30, x0 = c.rr(-600, 700); strata += c.ribbon([[x0, y], [x0 + c.rr(300, 700), y + c.rr(-8, 8)]], 2.2); }
    cs.x(strata, shade(C.rock2, -0.1), 'opacity=".5"');
    cliffL.add(cs.out());
    cliffL.add(cypress(c, 1320, cfn(1320) - 50, 110) + cypress(c, 1380, cfn(1380) - 60, 80) + cypress(c, 260, cfn(260) + 4, 100));
    cliffL.add(`<g transform="translate(500 612) scale(.8)">${tomb(c, 70, 84, { face: C.rock2 })}</g><g transform="translate(1110 604) scale(.9)">${tomb(c, 70, 84, { face: C.rock2 })}</g>`);
    // the big tomb he lives in
    cliffL.add(`<g transform="translate(${MX} ${FEET + 4}) scale(2.1)">${tomb(c, 76, 96, { stone: true, face: mix(C.rock2, C.sand2, 0.25) })}</g>`);
    // eyes glinting in the dark doorways
    const eyes = [[500, 570], [1110, 560], [770, 540], [835, 590]].map(([x, y], i) => cliffL.add(`<g opacity="0" transform="translate(${x} ${y})">${sheet().x(c.poly(c.ell(-5, 0, 3, 4, 8)) + c.poly(c.ell(5, 0, 3, 4, 8)), '#efe6c8').out(false)}</g>`));

    /* ---------- the ground in front ---------- */
    const ground = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(FEET, [4, 2], [600, 170]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1.4), mix(C.sand, C.sand2, 0.5)).out());
    ground.add(boulders(c, gfn, -500, 2100, 16, { col: C.rock2 }));
    ground.add(grass(c, { x0: -600, x1: 2200, y: FEET, fn: gfn, n: 24, h: 12, color: C.olive }));
    // the high rock he climbs to cry out from ("on the mountains")
    const CG = P ? -70 : 0;   // phone: the crag stands further in, so he and his shadow stay clear of the thread
    const crag = [1060 + CG, FEET - 96];
    ground.add(sheet().p(c.cut([[960 + CG, FEET + 10], [990 + CG, FEET - 70], [1030 + CG, FEET - 100], [1090 + CG, FEET - 104], [1130 + CG, FEET - 70], [1160 + CG, FEET + 10]], 1.4, 8), C.rock2).x(c.ribbon([[1000 + CG, FEET - 60], [1040 + CG, FEET - 90]], 3), shade(C.rock2, 0.25), 'opacity=".6"').out());

    /* ---------- the man ---------- */
    const manL = S.layer({ par: 0.45, sh: 4 });
    // broken chains that lie about the tomb already
    manL.add(`<g transform="translate(640 ${FEET + 18}) rotate(-8)">${chain(c, 7, 7)}</g><g transform="translate(900 ${FEET + 22}) rotate(12)">${chain(c, 5, 7)}</g><g transform="translate(966 ${FEET + 14})">${fetter(c, 11)}</g>`);
    const shadowEl = manL.add(`<g>${shadowCloak(c, 130, 250)}</g>`);
    const sitting = S.puppet(manL.add(person(c, { ...LOOK.wild, pose: 'sit', holdF: `<g transform="translate(0 4) rotate(90)">${chain(c, 5, 6)}</g>` })));
    const marksBody = `<g class="bodymarks" opacity="0">${scratches(c)}</g>`;
    const standing = S.puppet(manL.add(onBody(person(c, { ...LOOK.wild, holdF: armMarks(c, `<g class="stone" opacity="0">${sharpStone(c)}</g>`) }), marksBody)));
    const bodyMarks = standing.el.querySelector('.bodymarks');
    const armM = standing.el.querySelector('.marks');
    const stoneEl = standing.el.querySelector('.stone');

    /* ---------- the men who come to bind him ---------- */
    const menL = S.layer({ par: 0.45, sh: 4 });
    const MEN = [
      { home: 610, from: 200, side: -1 }, { home: 660, from: 120, side: -1 }, { home: 960, from: 1450, side: 1 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(menL.add(person(c, townsfolk(c, { man: true, belt: C.leather })))) }));
    // chain loops over his chest & hips, fetters on his ankles
    const loopA = menL.add(`<g>${chain(c, 8, 8)}</g>`);
    const loopB = menL.add(`<g>${chain(c, 7, 8)}</g>`);
    const fetF = menL.add(`<g>${fetter(c, 12)}</g>`);
    const fetB = menL.add(`<g>${fetter(c, 12)}</g>`);
    const hobble = menL.add(`<g>${chain(c, 3, 6)}</g>`);
    // what flies apart when he bursts them
    const bits = Array.from({ length: 12 }, (_, i) => ({ i, el: menL.add(`<g>${i < 9 ? link(c, 8) : fetter(c, 10)}</g>`), a: -PI * 0.95 + (i / 11) * PI * 0.9 + c.rr(-0.1, 0.1), d: c.rr(160, 300), rot: c.rr(-400, 400) }));
    const burst = menL.add(`<g>${rays(c, { n: 14, r0: 30, r1: 190, spread: 0.05, color: '#f3e6c0' })}</g>`);
    const cryEl = menL.add(`<g>${cry(c, ['!!'], { size: 34, w: 90, dir: 1 })}</g>`);
    const cry2 = menL.add(`<g>${cry(c, ['!!!'], { size: 34, w: 100, dir: -1 })}</g>`);
    const imps = Array.from({ length: 5 }, (_, i) => ({ i, el: menL.add(`<g>${spirit(c, 0.9)}</g>`), ph: c.rr(0, 6) }));

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 240, 960, 260, 110, C.rock2) + rock(c, 1400, 950, 220, 90, C.rock3) + grass(c, { x0: 100, x1: 1500, y: 900, n: 12, h: 20, color: C.moss }));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1a2050"/>`);

    return (t, time) => {
      const T = time;
      /* day and night pass over him again and again (v5) */
      const cyc = seg(t, 5.0, 6.2);
      const day = Math.max(0, Math.sin(cyc * PI * 2.0 - PI / 2) * 0.5 + 0.5) * (cyc > 0 && cyc < 1 ? 1 : 0);
      daySky.fade(day);
      starL.fade(1 - day);
      tint.fade(0.2 * (1 - day) + 0.03);
      swing(moonEl, MOONX, 160 + day * 500, T, 0.8, 0.5);
      swing(sunEl, SUNX, 160 + (1 - day) * 560, T, 0.8, 0.5, 1);

      /* v3a — he lives in the tombs: eyes glint in the dark doorways */
      eyes.forEach((e, i) => fade(e, bump(t, 0.2 + i * 0.12, 1.4 + i * 0.1) * 0.9 + (t > 5 && t < 7 ? bump(t, 5.05 + i * 0.1, 6.9) * 0.6 : 0)));

      /* poses: sitting in the doorway → standing bound → bursting free → roaming, crying out */
      const stand = es(t, 2.36, 2.42);
      const rock_ = bump(t, 0, 1) * Math.sin(t * 16) * 4;
      const rattle = bump(t, 1.05, 1.95);
      sitting.set({ x: MX - 10, y: FEET - 6, s: 1.05, o: 1 - stand, flip: false, armF: 50 + rattle * (40 + Math.sin(t * 50) * 18), armB: 20 + rattle * 30, head: 6 - rattle * 10, lean: 4 + rock_, blink: blinkAt(T, 2) });

      // where he stands / roams
      const roam = kf(t, [[4.4, [MX, FEET]], [5.2, [MX, FEET]], [5.5, [crag[0], crag[1]]], [5.8, [crag[0], crag[1]]], [6.1, [MX, FEET]]]);
      const moving_ = (t > 5.2 && t < 5.5) || (t > 5.8 && t < 6.1);
      const strain = es(t, 3.0, 3.45) * (1 - es(t, 3.5, 3.6));
      const free = es(t, 3.48, 3.6);
      const roar = es(t, 4.1, 4.4) * (1 - es(t, 6.0, 6.2));
      const strike = es(t, 6.05, 6.3);
      const hit = strike * Math.max(0, Math.sin(t * 26));
      const shake = strain * Math.sin(T * 40) * 3;
      standing.set({
        x: roam[0] + shake, y: roam[1], s: 1.05, o: stand, flip: roam[0] > MX + 20 && t > 5.8,
        walk: moving_ ? t * 40 : undefined,
        armF: (1 - free) * (6 + strain * 20) + free * (60 + roar * 80 + bump(t, 3.5, 4.1) * 40) * (1 - strike) + strike * (100 - hit * 70),
        armB: (1 - free) * (4 + strain * 16) + free * (70 + roar * 90) * (1 - strike) + strike * 30,
        head: -strain * 8 - roar * 14 + strike * 12, lean: -strain * 6 + strike * 5, blink: blinkAt(T, 2),
      });
      fade(stoneEl, strike);
      fade(bodyMarks, es(t, 6.35, 6.9));
      fade(armM, es(t, 6.3, 6.8));
      pose(shadowEl, { x: roam[0] + 6, y: roam[1] + 4, s: 1.05 * (1 + es(t, 0.1, 0.8) * 0.12 + Math.sin(T * 1.6) * 0.03 + es(t, 6.2, 6.9) * 0.1), o: es(t, 0.05, 0.6) * 0.9 });

      /* v4 — men come and bind him with chains and fetters */
      const bindK = es(t, 2.35, 2.85);
      MEN.forEach((m) => {
        const come = seg(t, 2.0 + m.i * 0.06, 2.4 + m.i * 0.06);
        const flee = es(t, 4.05 + m.i * 0.08, 4.7 + m.i * 0.08, (u) => u);
        const knock = bump(t, 3.5, 4.1) * (1 - flee);
        const x = lerp(m.from, m.home, ease.out(come)) + m.side * knock * 40 + m.side * flee * 900;
        m.p.set({
          x, y: FEET + 6 + m.i * 4, s: 0.96, flip: m.side > 0 ? flee < 0.02 : flee > 0.02, o: seg(t, 1.98 + m.i * 0.06, 2.05 + m.i * 0.06),
          walk: (come > 0 && come < 1) || (flee > 0 && flee < 1) ? x * 0.05 : undefined, amt: flee > 0 ? 1.5 : 1,
          armF: 60 + bindK * 20 * (1 - free) + knock * 70 + flee * 120, armB: 30 + bindK * 20 * (1 - free) + knock * 90 + flee * 140,
          lean: m.side * knock * 10, head: knock * -10, blink: blinkAt(T, m.seed),
        });
      });
      const loop = (el, y, w, k) => pose(el, { x: MX - w / 2, y: FEET - y, sx: k, sy: 1, o: k > 0.02 && free < 0.5 ? 1 : 0 });
      loop(loopA, 118, 88, es(t, 2.45, 2.75) * (1 - free));
      loop(loopB, 78, 78, es(t, 2.55, 2.85) * (1 - free));
      const fk = es(t, 2.6, 2.9) * (1 - free);
      pose(fetF, { x: MX + 12, y: FEET - 8, s: fk, o: fk > 0.02 ? 1 : 0 });
      pose(fetB, { x: MX - 12, y: FEET - 8, s: fk, o: fk > 0.02 ? 1 : 0 });
      pose(hobble, { x: MX - 10, y: FEET - 6, sx: fk, o: fk > 0.02 ? 1 : 0 });

      // the chains burst: links and fetters fly out
      const fly = es(t, 3.48, 4.1, ease.out);
      bits.forEach((b) => {
        const y0 = b.i < 9 ? FEET - 100 : FEET - 10;
        pose(b.el, { x: MX + Math.cos(b.a) * b.d * fly, y: y0 + Math.sin(b.a) * b.d * fly * 0.7 + fly * fly * 90, r: fly * b.rot, s: 1, o: fly > 0.01 ? 1 - es(t, 4.6, 4.9) : 0 });
      });
      pose(burst, { x: MX, y: FEET - 110, s: 0.3 + es(t, 3.45, 3.8) * 0.9, r: t > 3.45 && t < 4.1 ? T * 6 : 0, o: bump(t, 3.45, 4.1) * 0.6 });

      /* v4c–v5 — nobody can tame him; he cries out day and night */
      const k1 = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.85, 5.0));
      const [hx, hy] = [roam[0], roam[1] - 205];
      pose(cryEl, { x: hx + 18, y: hy, s: k1, r: k1 > 0.02 ? Math.sin(T * 8) * 4 : 0, o: k1 > 0.02 ? 1 : 0 });
      const pulse = t > 5 && t < 6.2 ? Math.max(0, Math.sin((t - 5) * PI * 4)) : 0;
      pose(cry2, { x: hx - 14, y: hy, s: pulse * 0.9, r: pulse > 0.05 ? Math.sin(T * 8) * 4 : 0, o: pulse > 0.05 ? 1 : 0 });
      imps.forEach((m) => {
        const on = es(t, 4.2, 4.6) * (1 - es(t, 6.8, 7));
        const Ti = on > 0 ? T : 0;
        const a = Ti * 0.8 + m.ph + m.i * 1.25;
        pose(m.el, { x: roam[0] + Math.cos(a) * 110, y: roam[1] - 130 + Math.sin(a) * 60, s: 0.9, r: Math.sin(Ti * 2 + m.ph) * 10, o: on * 0.9 });
      });

      /* camera: push into the tomb, pull back when the chains burst, follow him up the crag */
      S.cam.z = 1 + es(t, 0, 1) * 0.14 - es(t, 1.9, 2.4) * 0.1 + es(t, 3.4, 3.6) * 0.04 - es(t, 4.8, 5.2) * 0.06 + es(t, 6.0, 6.5) * 0.12;
      S.cam.x = es(t, 0, 1) * -10 + es(t, 5.1, 5.5) * 90 - es(t, 5.8, 6.2) * 90;
      S.cam.y = 20 + es(t, 0, 1) * 20 - es(t, 5.1, 5.5) * 40 + es(t, 5.8, 6.2) * 40 + es(t, 6.0, 6.5) * 10;
    };
  },
};
