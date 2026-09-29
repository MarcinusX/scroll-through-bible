// Mt 21,6–7a — Bethphage: the she-donkey tied at a door and her colt beside her. The two disciples untie them;
// the owner asks, they answer as Jesus told them ("The Lord needs them") and he waves them on. Then they lead
// the donkey and the colt out of the village street — and Jesus comes to meet them with the others.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, palm, grass, bush, rock, flowers } from '../../assets/nature.js';
import { es, ease, bump, fade, seg } from '../../core/anim.js';
import { colt, jenny, coltRig, TWO, bubble, hand, headAt, sparkle, man, woman, jarProp, bench, tr, DAY, PI } from './lib.js';
import { knotBall as kb } from '../mark11/lib.js';

const ST = 690;                 // the street
const DOOR = 900;               // door of the owner's house (centre x)
const RING = [972, 560];        // the tethering ring beside the door
const JX = 1080;                // where the she-donkey stands

export default {
  id: 'mt21-village',
  beats: [
    { v: 6 },
    { v: 7, text: 'Przyprowadzili oślicę i źrebię' },
  ],
  cam: { x: [-240, 160], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1240, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 560, y: 120, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 960, y: 200, len: 700 });

    /* ---------- hills and the rest of the village behind ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3000 }).markup);
    const backL = S.layer({ par: 0.18, sh: 3 });
    const hb = hillsWith(c, { y: 470, amps: [12, 6, 2], lens: [900, 300, 120], color: C.hillMid, trees: 22, treeColor: C.olive, treeH: 20, x0: -1400, x1: 3000 });
    backL.add(hb.markup);
    backL.add(town(c, { x: 1150, y: hb.fn(1150) + 12, n: 8, spread: 520, sc: 0.8 }) + olive(c, 170, hb.fn(170) + 8, 0.8) + olive(c, -120, hb.fn(-120) + 8, 0.7));
    backL.add(cypress(c, 700, hb.fn(700) + 8, 140) + cypress(c, 1480, hb.fn(1480) + 8, 120) + palm(c, 440, hb.fn(440) + 30, 210));

    /* ---------- the street facades (right half); the open road out of the village (left) ---------- */
    const houseL = S.layer({ par: 0.4, sh: 4 });
    const hs = sheet();
    const wall = mix(C.plaster, C.sand, 0.25), wall2 = mix(C.plaster2, C.sand2, 0.3);
    hs.p(c.cut([[640, ST - 6], [640, 420], [1040, 414], [1040, ST - 6]], 0.8, 10), wall);
    hs.p(c.cut([[632, 424], [1050, 418], [1050, 406], [632, 412]], 0.5, 10), C.roof);
    hs.p(c.cut([[1160, ST - 6], [1160, 380], [1560, 376], [1560, ST - 6]], 0.8, 10), mix(C.parchment, C.plaster, 0.4));
    hs.p(c.cut([[1152, 386], [1568, 382], [1568, 370], [1152, 374]], 0.5, 10), C.roof);
    let par = '';
    for (let x = 644; x < 1036; x += 26) par += c.cut(c.rect(x, 396, 16, 14), 0.3, 4);
    hs.p(par, wall);
    let bl = '';
    for (let i = 0; i < 10; i++) bl += c.cut(c.blob(c.rr(660, 1540), c.rr(440, 640), c.rr(14, 30), c.rr(6, 12), 9, 0.2), 0.5, 4);
    hs.x(bl, wall2, 'opacity=".5"');
    hs.p(c.cut([[DOOR - 42, ST - 4], [DOOR - 42, 548], ...c.arc(DOOR, 548, 42, 40, PI, 2 * PI, 10), [DOOR + 42, ST - 4]], 0.4, 6), C.wood2);
    let planks = '';
    for (let x = DOOR - 30; x < DOOR + 40; x += 14) planks += c.ribbon([[x, ST - 8], [x, 530]], 1.4);
    hs.x(planks, shade(C.wood2, -0.25), 'opacity=".6"');
    hs.p(c.ribbon([[DOOR - 48, ST - 4], [DOOR - 48, 546]], 7) + c.ribbon([[DOOR + 48, ST - 4], [DOOR + 48, 546]], 7) + c.ribbon(c.arc(DOOR, 548, 48, 46, PI, 2 * PI, 10), 7), C.wood);
    hs.p(c.cut([[720, 520], [720, 480], ...c.arc(748, 480, 28, 24, PI, 2 * PI, 8), [776, 520]], 0.4, 5), C.soilDark);
    hs.p(c.ribbon([[714, 522], [782, 522]], 6), C.wood2);
    hs.p(c.cut(c.rect(1260, 470, 60, 56), 0.4, 5), C.soilDark);
    hs.p(c.ribbon([[1254, 528], [1326, 528]], 6), C.wood2);
    hs.p(c.cut([[1410, ST - 4], [1410, 560], ...c.arc(1450, 560, 40, 36, PI, 2 * PI, 10), [1490, ST - 4]], 0.4, 6), mix(C.soilDark, C.wood2, 0.4));
    hs.p(c.ribbon(c.arc(RING[0], RING[1] + 6, 7, 7, 0, PI * 2, 12), 3), C.rock3);
    hs.p(c.cut(c.rect(RING[0] - 4, RING[1] - 6, 8, 8), 0.2, 3), C.rock3);
    houseL.add(hs.out());
    const vine = sheet();
    let lv = '', lv2 = '';
    const vp = c.cbez([DOOR - 90, ST - 10], [DOOR - 110, 470], [DOOR - 20, 470], [DOOR + 100, 470], 20);
    vine.p(c.ribbon(vp, 4), C.wood2);
    vp.forEach(([x, y], i) => { const l = c.cut(c.blob(x + c.rr(-10, 10), y + c.rr(-10, 8), c.rr(10, 16), c.rr(8, 12), 8, 0.25), 0.4, 4); if (i % 2) lv += l; else lv2 += l; });
    vine.p(lv, C.leaf).p(lv2, C.moss);
    houseL.add(vine.out());
    const line = sheet();
    const lp = c.qbez([1040, 440], [1100, 470], [1160, 440], 10);
    line.x(c.ribbon(lp, 1.4), C.ink, 'opacity=".5"');
    [[1066, C.dustyBlue], [1096, C.roseRobe], [1126, C.wheatRobe]].forEach(([x, col]) => { const y = lp[Math.round((x - 1040) / 12)][1]; line.p(c.cut([[x - 12, y], [x + 12, y], [x + 14, y + 30], [x - 14, y + 32]], 0.5, 5), col); });
    houseL.add(line.out());
    houseL.add(`<g transform="translate(1300 ${ST - 2})">${bench(c, 120, 38)}</g>`);
    const pots = sheet();
    [[790, 18], [820, 13], [1030, 15]].forEach(([x, r]) => { pots.p(c.cut([[x - r, ST - 2], [x - r * 1.1, ST - r * 1.8], [x + r * 1.1, ST - r * 1.8], [x + r, ST - 2]], 0.3, 4), C.pot); pots.p(c.cut(c.blob(x, ST - r * 2.4, r * 1.2, r * 0.8, 9, 0.25), 0.5, 4), C.leaf); });
    houseL.add(pots.out());

    /* ---------- the street and the road ---------- */
    const streetL = S.layer({ par: 0.46, sh: 3 });
    const sfn = c.wave(ST, [3, 1.5], [700, 180]);
    const st = sheet();
    st.p(c.ridge(sfn, -1400, 2800, 1700, 12, 1), mix(C.sand, C.sand2, 0.4));
    let cobbles = '';
    for (let i = 0; i < 50; i++) cobbles += c.cut(c.blob(c.rr(620, 1900), c.rr(ST + 12, ST + 170), c.rr(8, 16), c.rr(4, 7), 8, 0.2), 0.4, 4);
    st.x(cobbles, shade(C.sand2, -0.1), 'opacity=".55"');
    streetL.add(st.out());
    streetL.add(grass(c, { x0: -1200, x1: 630, y: ST, fn: sfn, n: 22, h: 12, color: C.olive }) + flowers(c, { x0: -900, x1: 600, y: ST + 2, fn: sfn, n: 12 }) + rock(c, 380, ST + 20, 60, 22, C.rock2));

    /* ---------- the owner and a neighbour ---------- */
    const nbL = S.layer({ par: 0.46, sh: 5 });
    const owner = { seed: c.rr(0, 9), p: S.puppet(nbL.add(person(c, { ...man(c, { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.greyHair, beard: 'full', beardColor: C.greyHair, hairStyle: 'wrap', veil: C.linen2 }), pose: 'sit' }))) };
    const wife = { seed: c.rr(0, 9), p: S.puppet(nbL.add(person(c, woman(c, { robe: C.roseRobe, veil: C.skyVeil, holdB: `<g transform="translate(0 -6) scale(.8)">${jarProp(c)}</g>` })))) };

    /* ---------- the she-donkey, her colt, the rope, the two disciples ---------- */
    const aL = S.layer({ par: 0.5, sh: 5 });
    const ropeEl = aL.add(`<path d="${c.ribbon([[0, 0], [0.6, -50], [0, -100]], 2.6)}" fill="${C.rope}"/>`);
    const knot = aL.add(`<g>${kb(c, 7)}</g>`);
    const jRig = coltRig(aL.add(jenny(c)));
    const star = aL.add(`<g>${sparkle(c, 14)}</g>`);
    const two = TWO.map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(aL.add(person(c, o))) }));
    const cRig = coltRig(aL.add(colt(c, { halter: false })));

    /* ---------- Jesus and the others, coming to meet them ---------- */
    const jL = S.layer({ par: 0.5, sh: 5 });
    const others = [CAST.peter, CAST.john, CAST.james].map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(jL.add(person(c, o))) }));
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));

    /* ---------- words ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const ask = fx.add(`<g>${bubble(c, [tr('Co robicie?', 'What are you doing?')], { size: 19, tail: -1 })}</g>`);
    const reply = fx.add(`<g>${bubble(c, [tr('Pan ich potrzebuje', 'The Lord needs them')], { size: 19, tail: 1 })}</g>`);
    const ok = fx.add(`<g>${bubble(c, [tr('Idźcie!', 'Go on!')], { size: 20, tail: -1 })}</g>`);

    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 60, 880, 220, C.sage, C.moss) + rock(c, 1640, 900, 190, 70, C.rock2) + bush(c, 1540, 880, 180, C.moss, C.sage) + flowers(c, { x0: -80, x1: 260, y: 850, n: 10 }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1240, 130, T, 1, 0.7);
      swing(cl1, 560 + Math.sin(T * 0.1) * 26, 120, T, 1.3, 0.6, 1);
      swing(cl2, 960 + Math.sin(T * 0.12 + 1) * 26, 200, T, 1.3, 0.7, 2);

      /* v6 — they come into the street, find them, untie; the owner asks, they answer, he lets them go */
      const inK = es(t, 0.0, 0.3, ease.out);
      const found = bump(t, 0.22, 0.45);
      pose(star, { x: JX - 40, y: ST - 160, s: found * 1.3 + 0.001, r: t * 90, o: found });
      const untie = es(t, 0.34, 0.5);
      /* v7a — they lead the donkey and the colt out to the left, where Jesus comes to meet them */
      const away = es(t, 1.02, 1.6, ease.out);
      const jX = JX - away * 330, cX = JX - 150 - away * 330;
      const aw = away > 0 && away < 1;
      jRig.set({ x: jX, y: ST + 4, s: 1.02, flip: true, walk: aw ? jX * 0.06 : undefined, nod: bump(t, 0.25, 0.45) * 10 + Math.sin(T * 0.7) * 1.5, ear: Math.sin(T * 1.3) * 8 + bump(t, 0.6, 0.8) * 14, tail: Math.sin(T * 1.8) * 8 });
      cRig.set({ x: cX, y: ST + 20, s: 0.76, flip: true, walk: aw ? cX * 0.07 + 1 : undefined, amt: 1.1, nod: Math.sin(T * 1.1 + 1) * 3, ear: Math.sin(T * 2 + 2) * 10, tail: Math.sin(T * 2.4) * 10 });
      // the halter is at (116,-110) in colt coords (flipped: to the left)
      const hx = jX - 118 * 1.02, hy = ST + 4 - 118 * 1.02;
      // Andrew unties the knot and leads the she-donkey; Philip leads the colt
      const A = two[0], P = two[1];
      const ax = lerp(1600, RING[0] - 70, inK) - away * 330, px = lerp(1700, JX + 150, es(t, 0.02, 0.34, ease.out)) - away * 330;
      A.p.set({
        x: ax - (away > 0 ? 20 * away : 0), y: ST + 10, s: 0.94, flip: true, walk: (inK > 0 && inK < 1) || aw ? ax * 0.05 : undefined,
        armF: t < 1 ? es(t, 0.28, 0.36) * 75 * (1 - es(t, 0.55, 0.6)) + es(t, 0.55, 0.6) * 30 : 55, armB: bump(t, 0.62, 0.8) * 60,
        head: -es(t, 0.28, 0.34) * 6 * (1 - es(t, 0.5, 0.55)), blink: blinkAt(T, A.seed),
      });
      P.p.set({
        x: px, y: ST + 18, s: 0.96, flip: true, walk: (t > 0.02 && t < 0.34) || aw ? px * 0.05 + 1 : undefined,
        armF: bump(t, 0.35, 0.55) * 60 + es(t, 0.6, 0.66) * (1 - es(t, 0.8, 0.86)) * 70 + (aw || t > 1.6 ? 40 : 0),
        armB: es(t, 0.6, 0.66) * (1 - es(t, 0.8, 0.86)) * 40, head: bump(t, 0.6, 0.8) * 8, blink: blinkAt(T, P.seed),
      });
      // the rope: ring → halter, then halter → Andrew's hand
      const aHand = t < 1 ? 75 : 55;
      const [ahx, ahy] = hand(ax - (away > 0 ? 20 * away : 0), ST + 10, 0.94, true, aHand);
      const ex = lerp(RING[0], ahx, untie), ey = lerp(RING[1] + 12, ahy, untie);
      const dx = ex - hx, dy = ey - hy, L = Math.hypot(dx, dy);
      pose(ropeEl, { x: hx, y: hy, r: (Math.atan2(dx, -dy) * 180) / PI, sy: L / 100, o: 1 });
      pose(knot, { x: RING[0], y: RING[1] + 12, s: 1 - untie, o: 1 - untie });

      /* the owner on his bench, his wife at the door */
      const askK = es(t, 0.5, 0.58, ease.back) * (1 - es(t, 0.66, 0.7));
      const lets = es(t, 0.78, 0.84);
      owner.p.set({ x: 1300, y: ST - 30, s: 0.95, flip: true, armF: askK * 70 + lets * 60 * (1 - away * 0.6), armB: askK * 30, head: -es(t, 0.45, 0.55) * 4 + lets * 6, blink: blinkAt(T, owner.seed) });
      const wIn = es(t, 0.4, 0.6);
      wife.p.set({ x: lerp(1460, 1400, wIn), y: ST - 2, s: 0.9, flip: true, o: seg(t, 0.38, 0.42), walk: wIn > 0 && wIn < 1 ? t * 30 : undefined, armB: 150, armF: bump(t, 0.55, 0.8) * 50 + lets * 30, blink: blinkAt(T, wife.seed) });
      const [ohx, ohy] = headAt(1300, ST - 30, 0.95, true, 62);
      pose(ask, { x: ohx - 30, y: ohy - 30, s: askK, o: askK > 0.02 ? 1 : 0 });
      const repK = es(t, 0.66, 0.72, ease.back) * (1 - es(t, 0.95, 1.02));
      const [phx, phy] = headAt(px, ST + 18, 0.96, true);
      pose(reply, { x: phx + 20, y: phy - 30, s: repK, o: repK > 0.02 ? 1 : 0 });
      const okK = es(t, 0.8, 0.86, ease.back) * (1 - es(t, 1.1, 1.2));
      pose(ok, { x: ohx - 30, y: ohy - 30, s: okK, o: okK > 0.02 ? 1 : 0 });

      /* v7a — Jesus and three of the Twelve come along the road to meet them */
      const meet = es(t, 1.05, 1.55, ease.out);
      const jx = lerp(-160, 480, meet);
      const greet = es(t, 1.55, 1.75);
      jesus.set({ x: jx, y: ST + 6, s: 1.02, walk: meet > 0 && meet < 1 ? jx * 0.05 : undefined, armF: greet * 70, armB: greet * 20, head: greet * 4, blink: blinkAt(T), o: seg(t, 1.02, 1.06) });
      others.forEach((d) => { const x = jx - 110 - d.i * 70; d.p.set({ x, y: ST - 4 + (d.i % 2) * 10, s: 0.92, walk: meet > 0 && meet < 1 ? x * 0.05 + d.i : undefined, head: -greet * 4, armF: greet * (d.i === 0 ? 40 : 0), blink: blinkAt(T, d.seed), o: seg(t, 1.02, 1.06) }); });

      S.cam.x = 40 + es(t, 0.2, 0.5) * 20 - es(t, 1.0, 1.6) * 240;
      if (S.portrait) S.cam.x = es(t, 0.2, 0.5) * 150 - es(t, 1.0, 1.6) * 390;
      S.cam.z = 1.04 + es(t, 0.2, 0.5) * 0.06 - es(t, 1.0, 1.6) * 0.08;
      S.cam.y = es(t, 0.2, 0.5) * 30 - es(t, 1.0, 1.6) * 20;
    };
  },
};
