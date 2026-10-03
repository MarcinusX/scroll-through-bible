// Mk 11,4–6 — Bethphage: the colt tied at a door, out in the street. The two untie it,
// the neighbours ask what they are doing, they answer as Jesus told them — and are let go.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, palm, grass, bush, rock, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { colt, coltRig, TWO, bubble, hand, headAt, sparkle, knotBall, man, woman, jarProp, bench, lantern } from './lib.js';

const PI = Math.PI;
const ST = 690;                 // the street
const DOOR = 640;               // door of the first house (centre x)
const RING = [712, 560];        // the tethering ring beside the door
const CX = 830;                 // where the colt stands

export default {
  id: 'm11-colt',
  beats: [
    { v: 4, text: 'Poszli i znaleźli oślę przywiązane do drzwi z zewnątrz, na ulicy.' },
    { v: 4, cont: true, text: 'Odwiązali je,' },
    { v: 5 },
    { v: 6, text: 'Oni zaś odpowiedzieli im tak, jak Jezus polecił.' },
    { v: 6, cont: true, text: 'I pozwolili im.' },
  ],
  cam: { x: [-60, 200], y: [-20, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    // phone: the camera pans further right while the neighbours ask, and the lad and the '?' stand inside the screen
    const PH = S.portrait;
    const SKY = ['#d8e3d9', '#f2e8cc', '#f8edd8'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1240, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 560, y: 120, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 960, y: 200, len: 700 });

    /* ---------- hills and the rest of the village behind ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const backL = S.layer({ par: 0.18, sh: 3 });
    const hb = hillsWith(c, { y: 470, amps: [12, 6, 2], lens: [900, 300, 120], color: C.hillMid, trees: 22, treeColor: C.olive, treeH: 20 });
    backL.add(hb.markup);
    backL.add(town(c, { x: 1000, y: hb.fn(1000) + 12, n: 8, spread: 520, sc: 0.8 }) + town(c, { x: 300, y: hb.fn(300) + 12, n: 5, spread: 300, sc: 0.7 }));
    backL.add(cypress(c, 560, hb.fn(560) + 8, 140) + cypress(c, 1320, hb.fn(1320) + 8, 120) + olive(c, 170, hb.fn(170) + 8, 0.8));
    backL.add(palm(c, 850, hb.fn(850) + 30, 250) + palm(c, 340, hb.fn(340) + 30, 190));

    /* ---------- the street facades ---------- */
    const houseL = S.layer({ par: 0.4, sh: 4 });
    const hs = sheet();
    const wall = mix(C.plaster, C.sand, 0.25), wall2 = mix(C.plaster2, C.sand2, 0.3);
    // house 1: the colt's house, on the left
    hs.p(c.cut([[380, ST - 6], [380, 420], [780, 414], [780, ST - 6]], 0.8, 10), wall);
    hs.p(c.cut([[372, 424], [790, 418], [790, 406], [372, 412]], 0.5, 10), C.roof);
    // house 2 on the right, set back, with an awning and a bench
    hs.p(c.cut([[900, ST - 6], [900, 380], [1300, 376], [1300, ST - 6]], 0.8, 10), mix(C.parchment, C.plaster, 0.4));
    hs.p(c.cut([[892, 386], [1308, 382], [1308, 370], [892, 374]], 0.5, 10), C.roof);
    // an outside stair to the roof of house 2
    let stair = '';
    for (let i = 0; i < 8; i++) stair += c.cut(c.rect(1300 + i * 0, ST - 36 - i * 36, 60 - i * 6, 36), 0.4, 6);
    hs.p(stair, wall2);
    // an upper room on the roof of house 2, a parapet with pots on house 1
    hs.p(c.cut([[1010, 372], [1010, 300], [1190, 296], [1190, 372]], 0.6, 8), mix(C.plaster, C.sand, 0.15));
    hs.p(c.cut([[1002, 304], [1198, 300], [1198, 290], [1002, 294]], 0.4, 8), C.roof);
    hs.p(c.cut([[1080, 372], [1080, 330], ...c.arc(1100, 330, 20, 18, PI, 2 * PI, 8), [1120, 372]], 0.4, 5), C.soilDark);
    let par = '';
    for (let x = 384; x < 776; x += 26) par += c.cut(c.rect(x, 396, 16, 14), 0.3, 4);
    hs.p(par, wall);
    // walls blotches
    let bl = '';
    for (let i = 0; i < 12; i++) bl += c.cut(c.blob(c.rr(400, 1280), c.rr(440, 640), c.rr(14, 30), c.rr(6, 12), 9, 0.2), 0.5, 4);
    hs.x(bl, wall2, 'opacity=".5"');
    // doors & windows
    hs.p(c.cut([[DOOR - 42, ST - 4], [DOOR - 42, 548], ...c.arc(DOOR, 548, 42, 40, PI, 2 * PI, 10), [DOOR + 42, ST - 4]], 0.4, 6), C.wood2);
    let planks = '';
    for (let x = DOOR - 30; x < DOOR + 40; x += 14) planks += c.ribbon([[x, ST - 8], [x, 530]], 1.4);
    hs.x(planks, shade(C.wood2, -0.25), 'opacity=".6"');
    hs.p(c.ribbon([[DOOR - 48, ST - 4], [DOOR - 48, 546]], 7) + c.ribbon([[DOOR + 48, ST - 4], [DOOR + 48, 546]], 7) + c.ribbon(c.arc(DOOR, 548, 48, 46, PI, 2 * PI, 10), 7), C.wood);
    hs.p(c.cut([[460, 520], [460, 480], ...c.arc(488, 480, 28, 24, PI, 2 * PI, 8), [516, 520]], 0.4, 5), C.soilDark);
    hs.p(c.ribbon([[454, 522], [522, 522]], 6), C.wood2);
    hs.p(c.cut(c.rect(1000, 470, 60, 56), 0.4, 5), C.soilDark);
    hs.p(c.ribbon([[994, 528], [1066, 528]], 6), C.wood2);
    hs.p(c.cut([[1150, ST - 4], [1150, 560], ...c.arc(1190, 560, 40, 36, PI, 2 * PI, 10), [1230, ST - 4]], 0.4, 6), mix(C.soilDark, C.wood2, 0.4));
    // the tethering ring
    hs.p(c.ribbon(c.arc(RING[0], RING[1] + 6, 7, 7, 0, PI * 2, 12), 3), C.rock3);
    hs.p(c.cut(c.rect(RING[0] - 4, RING[1] - 6, 8, 8), 0.2, 3), C.rock3);
    houseL.add(hs.out());
    // a vine over the colt's door, pots on the steps
    const vine = sheet();
    let lv = '', lv2 = '';
    const vp = c.cbez([DOOR - 90, ST - 10], [DOOR - 110, 470], [DOOR - 20, 470], [DOOR + 100, 470], 20);
    vine.p(c.ribbon(vp, 4), C.wood2);
    vp.forEach(([x, y], i) => { const l = c.cut(c.blob(x + c.rr(-10, 10), y + c.rr(-10, 8), c.rr(10, 16), c.rr(8, 12), 8, 0.25), 0.4, 4); if (i % 2) lv += l; else lv2 += l; });
    vine.p(lv, C.leaf).p(lv2, C.moss);
    let grapes = '';
    [[DOOR - 40, 492], [DOOR + 30, 488]].forEach(([x, y]) => { for (let k = 0; k < 7; k++) grapes += c.cut(c.circ(x + (k % 3) * 7 - 7, y + Math.floor(k / 3) * 7, 4, 7), 0.2, 3); });
    vine.p(grapes, C.plumRobe);
    houseL.add(vine.out());
    // a washing line between the houses
    const line = sheet();
    const lp = c.qbez([780, 440], [840, 470], [900, 440], 10);
    line.x(c.ribbon(lp, 1.4), C.ink, 'opacity=".5"');
    [[806, C.dustyBlue], [836, C.roseRobe], [866, C.wheatRobe]].forEach(([x, col]) => { const y = lp[Math.round((x - 780) / 12)][1]; line.p(c.cut([[x - 12, y], [x + 12, y], [x + 14, y + 30], [x - 14, y + 32]], 0.5, 5), col); });
    houseL.add(line.out());
    const awn = sheet();
    const ap = [[940, 510], [1130, 510], [1150, 548]];
    for (let x = 1150; x > 920; x -= 23) ap.push(...c.arc(x - 11.5, 548, 11.5, 8, 0, PI, 4));
    awn.p(c.cut(ap, 0.5, 6), C.cream);
    let str = '';
    for (let x = 940; x < 1140; x += 46) str += c.cut([[x, 510], [x + 23, 510], [x + 26, 550], [x + 3, 550]], 0.3, 5);
    awn.x(str, C.terracotta, 'opacity=".75"');
    awn.p(c.ribbon([[942, 510], [942, ST - 6]], 5) + c.ribbon([[1136, 510], [1136, ST - 6]], 5), C.wood2);
    houseL.add(awn.out());
    houseL.add(`<g transform="translate(1040 ${ST - 2})">${bench(c, 120, 38)}</g>`);
    const pots = sheet();
    [[530, 18], [560, 13], [770, 15]].forEach(([x, r]) => { pots.p(c.cut([[x - r, ST - 2], [x - r * 1.1, ST - r * 1.8], [x + r * 1.1, ST - r * 1.8], [x + r, ST - 2]], 0.3, 4), C.pot); pots.p(c.cut(c.blob(x, ST - r * 2.4, r * 1.2, r * 0.8, 9, 0.25), 0.5, 4), C.leaf); });
    houseL.add(pots.out());
    const lampEl = houseL.add(`<g transform="translate(1100 470) scale(.7)">${lantern(c)}</g>`);
    fade(lampEl.querySelector('.glow'), 0);

    /* ---------- the street ---------- */
    const streetL = S.layer({ par: 0.46, sh: 3 });
    const sfn = c.wave(ST, [3, 1.5], [700, 180]);
    const st = sheet();
    st.p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.4));
    let cobbles = '';
    for (let i = 0; i < 60; i++) cobbles += c.cut(c.blob(c.rr(-300, 1900), c.rr(ST + 12, ST + 170), c.rr(8, 16), c.rr(4, 7), 8, 0.2), 0.4, 4);
    st.x(cobbles, shade(C.sand2, -0.1), 'opacity=".55"');
    streetL.add(st.out());
    streetL.add(grass(c, { x0: -600, x1: 380, y: ST, fn: sfn, n: 10, h: 12, color: C.olive }) + grass(c, { x0: 1300, x1: 2200, y: ST, fn: sfn, n: 10, h: 12, color: C.olive }));

    /* ---------- the neighbours ---------- */
    const nbL = S.layer({ par: 0.46, sh: 5 });
    const owner = { o: man(c, { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.greyHair, beard: 'full', beardColor: C.greyHair, hairStyle: 'wrap', veil: C.linen2 }), seed: c.rr(0, 9) };
    owner.p = S.puppet(nbL.add(person(c, { ...owner.o, pose: 'sit' })));
    const wife = { seed: c.rr(0, 9) };
    wife.p = S.puppet(nbL.add(person(c, woman(c, { robe: C.roseRobe, veil: C.skyVeil, holdB: `<g transform="translate(0 -6) scale(.8)">${jarProp(c)}</g>` }))));
    const lad = { seed: c.rr(0, 9) };
    lad.p = S.puppet(nbL.add(person(c, man(c, { robe: C.tealRobe, mantle: null, hairStyle: 'curly', beard: 'none' }))));

    /* ---------- the colt, the rope and the two disciples ---------- */
    const coltL = S.layer({ par: 0.5, sh: 5 });
    const ropeEl = coltL.add(`<path d="${c.ribbon([[0, 0], [0.6, -50], [0, -100]], 2.6)}" fill="${C.rope}"/>`);
    const knot = coltL.add(`<g>${knotBall(c, 7)}</g>`);
    const cRig = coltRig(coltL.add(colt(c)));
    const star = coltL.add(`<g>${sparkle(c, 14)}</g>`);
    const two = TWO.map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(coltL.add(person(c, o))) }));

    /* ---------- words ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const ask = fx.add(`<g>${bubble(c, [tr('Co to ma znaczyć,', 'What are you doing,'), tr('że odwiązujecie oślę?', 'untying the young donkey?')], { size: 18, tail: -1 })}</g>`);
    const q2 = fx.add(`<g>${bubble(c, ['?'], { size: 26, tail: 1 })}</g>`);
    const reply = fx.add(`<g>${bubble(c, [tr('Pan go potrzebuje', 'The Lord needs him'), tr('i zaraz go odeśle', 'and will send him back')], { size: 18, tail: 1 })}</g>`);
    const ok = fx.add(`<g>${bubble(c, [tr('Idźcie!', 'Go on!')], { size: 20, tail: -1 })}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 240, 880, 220, C.sage, C.moss) + rock(c, 1380, 900, 190, 70, C.rock2) + bush(c, 1500, 880, 180, C.moss, C.sage));
    fg.add(flowers(c, { x0: 120, x1: 380, y: 850, n: 10 }) + flowers(c, { x0: 1300, x1: 1560, y: 846, n: 9 }));

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#d4e2dc', '#f0e7cd', '#f7ecd7'], seg(t, 0, 5));
      swing(sunEl, 1240, 130, T, 1, 0.7);
      swing(cl1, 560 + Math.sin(T * 0.1) * 26, 120, T, 1.3, 0.6, 1);
      swing(cl2, 960 + Math.sin(T * 0.12 + 1) * 26, 200, T, 1.3, 0.7, 2);

      /* v4a — they come into the village and find the colt at the door */
      const inK = es(t, 0.0, 0.55, ease.out);
      const found = bump(t, 0.5, 0.95);
      pose(star, { x: CX - 10, y: ST - 150, s: found * 1.3 + 0.001, r: t * 90, o: found });
      /* v4b — they untie it */
      const untie = es(t, 1.15, 1.5);
      /* v6b — they are let go: lead the colt away to the left */
      const away = es(t, 4.4, 4.98, ease.in);
      const cX = CX - away * 520;
      cRig.set({
        x: cX, y: ST + 4, s: 0.95, flip: true,
        walk: away > 0 && away < 1 ? cX * 0.06 : undefined,
        nod: bump(t, 0.55, 0.95) * 10 - bump(t, 2.1, 2.8) * 6 + Math.sin(T * 0.7) * 1.5, ear: Math.sin(T * 1.3) * 8 + bump(t, 2.0, 2.4) * 16,
        tail: Math.sin(T * 1.8) * 8,
      });
      // the halter is at (116,-110) in colt coords
      const hx = cX - 118 * 0.95, hy = ST + 4 - 118 * 0.95;
      // Andrew (left) unties the knot at the ring; Philip (right) pats the colt
      const A = two[0], P = two[1];
      const ax = lerp(120, 610, inK) - away * 520, px = lerp(40, 960, es(t, 0.05, 0.7, ease.out)) - away * 520;
      const aWalk = (t > 0 && t < 0.55) || (away > 0 && away < 1);
      A.p.set({
        x: ax, y: ST + 10, s: 0.94, flip: away > 0.02,
        walk: aWalk ? ax * 0.05 : undefined,
        armF: t < 1.6 ? es(t, 0.8, 1.1) * 75 + bump(t, 1.15, 1.5) * 12 : away > 0 ? 55 : 30 + bump(t, 3.0, 3.8) * 30,
        armB: bump(t, 3.0, 3.9) * 60, head: -es(t, 0.8, 1.0) * 6 * (1 - es(t, 1.6, 1.8)), blink: blinkAt(T, A.seed),
      });
      P.p.set({
        x: px, y: ST + 18, s: 0.96, flip: t > 0.72 && away < 0.02 ? true : away > 0.02,
        walk: (t > 0.05 && t < 0.7) || (away > 0 && away < 1) ? px * 0.05 + 1 : undefined,
        armF: bump(t, 0.9, 1.9) * 70 + es(t, 3.0, 3.3) * (1 - es(t, 3.95, 4.2)) * 70,
        armB: es(t, 3.0, 3.3) * (1 - es(t, 3.95, 4.2)) * 40, head: bump(t, 2.1, 2.6) * 10, blink: blinkAt(T, P.seed),
      });
      // the rope: ring → halter, then halter → Andrew's hand
      const [ahx, ahy] = hand(ax, ST + 10, 0.94, away > 0.02, away > 0 ? 55 : t < 1.6 ? 75 : 30);
      const ex = lerp(RING[0], ahx, untie), ey = lerp(RING[1] + 12, ahy, untie);
      const dx = ex - hx, dy = ey - hy, L = Math.hypot(dx, dy);
      pose(ropeEl, { x: hx, y: hy, r: (Math.atan2(dx, -dy) * 180) / PI, sy: L / 100, o: 1 });
      pose(knot, { x: RING[0], y: RING[1] + 12, s: 1 - untie, o: 1 - untie });

      /* the neighbours: the old owner on his bench, his wife at the door, a lad */
      const look = es(t, 1.4, 1.8);
      const askK = es(t, 2.05, 2.3, ease.back) * (1 - es(t, 2.95, 3.1));
      const lets = es(t, 4.0, 4.25);
      owner.p.set({ x: 1040, y: ST - 30, s: 0.95, flip: true, armF: askK * 70 + lets * (60 + Math.sin(T * 3) * 10) * (1 - away * 0.5), armB: askK * 30, head: -look * 4 + bump(t, 3.1, 3.9) * 8 + lets * 6, blink: blinkAt(T, owner.seed) });
      const wIn = es(t, 1.4, 1.9);
      wife.p.set({ x: lerp(1195, PH ? 1090 : 1130, wIn), y: ST - 2, s: 0.9, flip: true, o: seg(t, 1.35, 1.45), walk: wIn > 0 && wIn < 1 ? t * 30 : undefined, armB: 150, armF: bump(t, 2.1, 2.8) * 60 + lets * 40, head: bump(t, 2.2, 2.8) * -8, blink: blinkAt(T, wife.seed) });
      const lIn = es(t, 1.5, 2.0);
      lad.p.set({ x: lerp(1420, PH ? 1140 : 1240, lIn), y: ST + 14, s: 0.86, flip: true, walk: lIn > 0 && lIn < 1 ? t * 30 + 1 : undefined, armF: bump(t, 2.2, 2.9) * 90 + lets * 30, head: -bump(t, 2.2, 2.9) * 6, blink: blinkAt(T, lad.seed) });

      const [ohx, ohy] = headAt(1040, ST - 30, 0.95, true, 62);
      pose(ask, { x: ohx - 30, y: ohy - 30, s: askK, o: askK > 0.02 ? 1 : 0 });
      const q2K = es(t, 2.3, 2.5, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(q2, { x: PH ? 1125 : 1220, y: ST - 190, s: q2K, o: q2K > 0.02 ? 1 : 0 });
      const repK = es(t, 3.05, 3.3, ease.back) * (1 - es(t, 3.95, 4.1));
      const [phx, phy] = headAt(px, ST + 18, 0.96, true);
      pose(reply, { x: phx + 20, y: phy - 30, s: repK, o: repK > 0.02 ? 1 : 0 });
      const okK = es(t, 4.05, 4.25, ease.back) * (1 - es(t, 4.75, 4.9));
      pose(ok, { x: ohx - 30, y: ohy - 30, s: okK, o: okK > 0.02 ? 1 : 0 });

      S.cam.x = -es(t, 0, 0.8) * 20 + es(t, 1.8, 2.4) * 60 - es(t, 2.9, 3.4) * 40 - es(t, 4.2, 4.9) * 60
        + (PH ? es(t, 1.8, 2.4) * 150 - es(t, 4.2, 4.9) * 50 : 0);
      S.cam.z = 1.02 + es(t, 0.6, 1.2) * 0.1 - es(t, 1.8, 2.4) * 0.06 + es(t, 2.9, 3.4) * 0.02;
      S.cam.y = es(t, 0.6, 1.2) * 30 - es(t, 1.8, 2.4) * 20;
    };
  },
};
