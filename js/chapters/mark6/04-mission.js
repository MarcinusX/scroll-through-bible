// Mk 6,10–13 — on the road: a house that takes them in (they stay, day after day), a house that shuts its
// door (they shake the dust off their feet), and then the village square: repentance, spirits driven out,
// the sick anointed with oil.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, town, olive, cypress, bush, rock, grass, flowers, sun, moon, cloud, stars } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, spark, heart, scrap, dust, wordSlip, speech, GLYPH, staff, oilFlask, oilDrop, sickOnMat, LOOK, man, woman, lantern } from './lib.js';

const PI = Math.PI;
const Y = 690;
const LH = { x0: 340, x1: 600, door: 470 };      // the house that welcomes them
const RH = { x0: 1000, x1: 1290, door: 1100 };   // the house that shuts its door

export default {
  id: 'm6-mission',
  beats: [
    { v: 10 },
    { v: 11, text: 'Jeśli w jakim miejscu was nie przyjmą i nie będą słuchać,' },
    { v: 11, cont: true, text: 'wychodząc stamtąd strząśnijcie proch z nóg waszych na świadectwo dla nich!»' },
    { v: 12 },
    { v: 13, text: 'Wyrzucali też wiele złych duchów' },
    { v: 13, cont: true, text: 'oraz wielu chorych namaszczali olejem i uzdrawiali.' },
  ],
  cam: { x: [-560, 560], y: [0, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#c9dedb', '#efe6cd', '#f7ead3'];
    sky(S, SKY);
    const night = sky(S, ['#1d2349', '#39407a', '#6b6f9a'], { name: 'night' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -400, y1: 380, n: 110 }));

    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 0, y: 0, len: 900 });
    const moonEl = hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 36)}`, { x: 0, y: 0, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 760, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1300, y: 200, len: 600 });

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    const back = S.layer({ par: 0.25, sh: 3 });
    const hb = hillsWith(c, { y: 490, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 22 });
    back.add(hb.markup);
    back.add(town(c, { x: 200, y: hb.fn(200) + 20, n: 6, spread: 360, sc: 0.7 }) + town(c, { x: 800, y: hb.fn(800) + 20, n: 6, spread: 400, sc: 0.66 }) + town(c, { x: 1420, y: hb.fn(1420) + 20, n: 6, spread: 360, sc: 0.7 }));

    /* ---------- the street ---------- */
    const street = S.layer({ par: 0.5, sh: 3 });
    const sfn = c.wave(620, [3, 1.5], [700, 180]);
    street.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.3)).out());
    street.add(grass(c, { x0: -600, x1: 2200, y: 622, fn: sfn, n: 30, h: 10, color: C.olive }));
    // the welcoming house (with a window that lights up at night)
    street.add(house(c, LH.x0, Y - 6, LH.x1 - LH.x0, 190, { stairs: false }));
    const lit = street.add(`<g opacity="0"><rect x="${LH.x0 + (LH.x1 - LH.x0) * 0.6}" y="${Y - 6 - 190 * 0.72}" width="${(LH.x1 - LH.x0) * 0.16}" height="${190 * 0.18}" fill="${C.lampFlame}"/><circle cx="${LH.x0 + (LH.x1 - LH.x0) * 0.68}" cy="${Y - 6 - 190 * 0.63}" r="70" fill="url(#warm-glow)"/></g>`);
    street.add(olive(c, 260, Y, 0.8) + cypress(c, 660, Y, 150));
    // the village well in the square
    const well = sheet();
    well.p(c.cut([[730, Y - 4], [736, Y - 60], [864, Y - 60], [870, Y - 4]], 0.6, 8), C.stone2);
    well.p(c.cut(c.ell(800, Y - 60, 66, 10, 20), 0.4, 6), shade(C.stone2, 0.15));
    well.p(c.cut(c.rect(742, Y - 150, 8, 92), 0.3, 5) + c.cut(c.rect(850, Y - 150, 8, 92), 0.3, 5) + c.cut(c.rect(734, Y - 156, 132, 10), 0.3, 5), C.wood2);
    let blk = '';
    for (let r = 0; r < 2; r++) for (let x = 740 + r * 14; x < 860; x += 28) blk += c.ribbon([[x, Y - 50 + r * 22], [x + 24, Y - 50 + r * 22]], 1.2);
    well.x(blk, shade(C.stone2, -0.2), 'opacity=".6"');
    street.add(well.out());
    // the unwelcoming house: door and shutters that close
    street.add(house(c, RH.x0, Y - 6, RH.x1 - RH.x0, 200, { stairs: false, door: C.soilDark }));
    const doorEl = street.add(`<g>${sheet().p(c.cut(c.rect(0, 0, (RH.x1 - RH.x0) * 0.18, 200 * 0.42 + 8), 0.4, 5), C.wood).x(c.ribbon([[6, 10], [6, 80]], 2) + c.ribbon([[20, 10], [20, 80]], 2), shade(C.wood, -0.2), 'opacity=".6"').out()}</g>`);
    const shutL = street.add(`<g>${sheet().p(c.cut(c.rect(0, 0, (RH.x1 - RH.x0) * 0.08, 200 * 0.18), 0.3, 4), C.wood2).out()}</g>`);
    const shutR = street.add(`<g>${sheet().p(c.cut(c.rect(-(RH.x1 - RH.x0) * 0.08, 0, (RH.x1 - RH.x0) * 0.08, 200 * 0.18), 0.3, 4), C.wood2).out()}</g>`);
    street.add(olive(c, 1370, Y, 0.8));

    /* ---------- people ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const W = (o, extra = {}) => person(c, { ...o, holdF: staff(c, 190, 20), ...extra });
    const host = S.puppet(act.add(person(c, { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather })));
    const hostW = S.puppet(act.add(person(c, woman(c, { robe: C.roseRobe, veil: C.cream }))));
    const pA = [S.puppet(act.add(W(CAST.peter))), S.puppet(act.add(W(CAST.andrew)))];
    // villagers who will not listen
    const deaf = [
      { o: man(c, { robe: C.plumRobe }), x: 1180 }, { o: woman(c, { robe: C.tealRobe }), x: 1250 }, { o: man(c, { robe: C.clayMantle, hairStyle: 'wrap' }), x: 1320 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, d.o))) }));
    const pB = [S.puppet(act.add(W(CAST.james))), S.puppet(act.add(W(CAST.john)))];
    // the square
    const SQ = [
      { o: woman(c), x: 560, y: Y + 6 }, { o: man(c), x: 616, y: Y + 12 }, { o: woman(c, { robe: C.sageRobe }), x: S.portrait ? 965 : 1000, y: Y + 8 }, { o: man(c, { hairStyle: 'bald', hair: C.greyHair }), x: S.portrait ? 1022 : 1062, y: Y + 12 },   // phone: the right pair a step in from the thread
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, m.o))) }));
    const possessed = S.puppet(act.add(person(c, { robe: C.stone2, hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin2, belt: C.leather })));
    const pC = [S.puppet(act.add(W(LOOK.philip))), S.puppet(act.add(W(LOOK.bartholomew)))];
    const mat = act.add(`<g>${sickOnMat(c, { robe: C.linen2, skin: C.skin4 }, 160)}</g>`);
    const risen = S.puppet(act.add(person(c, { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin4 })));
    const thomas = S.puppet(act.add(person(c, { ...CAST.thomas, pose: 'kneel', holdF: `<g transform="translate(0 4) rotate(150)">${oilFlask(c)}</g>` })));
    const matthew = S.puppet(act.add(W(CAST.matthew)));

    /* ---------- effects ---------- */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const bounce = [0, 1, 2].map(() => fx.add(wordSlip(c, 26)));
    const noBub = fx.add(`<g>${speech(c, GLYPH.frown(c), { w: 44, h: 42, flip: true })}</g>`);
    const dusts = [0, 1, 2, 3].map(() => fx.add(`<g>${dust(c, 30, mix(C.clay, C.sand2, 0.45))}</g>`));
    const words = [0, 1, 2, 3, 4].map(() => fx.add(wordSlip(c, 26)));
    const hearts = SQ.map(() => fx.add(`<g>${heart(c, 11)}</g>`));
    const shards = Array.from({ length: 7 }, (_, i) => ({ el: fx.add(`<g>${scrap(c, 12)}</g>`), i, a: -PI / 2 + (i - 3) * 0.42, seed: c.rr(0, 6) }));
    const burst = fx.add(`<g>${rays(c, { n: 12, r0: 20, r1: 150, spread: 0.06, color: '#fff3cf' })}</g>`);
    const drops = [0, 1, 2].map(() => fx.add(`<g>${oilDrop(c, 4)}</g>`));
    const healSpark = fx.add(`<g>${spark(c, 14)}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    // phone: the corner bushes sit further out, so the long camera moves don't show half a bush at the frame
    fg.add(bush(c, S.portrait ? -130 : -40, 880, 240, C.sage, C.moss) + bush(c, S.portrait ? 1800 : 1640, 880, 240, C.moss, C.sage) + rock(c, 420, 900, 140, 50, C.rock2) + rock(c, 1200, 905, 120, 46) + flowers(c, { x0: 500, x1: 1100, y: 880, n: 16 }));

    // pair A: arrive → greeted → in the house → come out; pair B: preach → rebuffed → leave shaking dust
    const aKeys = [[-0.4, 120], [0.18, 380], [0.3, 380], [0.4, LH.door + 6], [0.86, LH.door + 6], [0.98, 330]];
    const bKeys = [[0.7, -250], [1.3, 1010], [2.0, 1010], [2.4, 820], [2.62, 820], [2.95, 560]];

    return (t, time) => {
      const T = time;
      /* days pass while they stay in that house */
      const dayK = seg(t, 0.4, 0.9) * 2;             // two days
      const nightK = Math.max(0, Math.sin(dayK * PI * 2 - PI / 2)) * (t > 0.4 && t < 0.9 ? 1 : 0);
      const nf = Math.min(1, nightK * 1.4);
      night.fade(nf * 0.9);
      starL.fade(nf);
      fade(lit, nf);
      const ang = dayK * PI * 2;
      swing(sunEl, 1000, 170 + (1 - Math.cos(ang)) * 250 * (t > 0.4 && t < 0.9 ? 1 : 0), T, 1, 0.6);
      swing(moonEl, 520, 180 + (1 - nightK) * 500, T, 0.8, 0.5, 1);
      swing(cl1, 760 + Math.sin(T * 0.1) * 30, 150, T, 1.4, 0.6, 1);
      swing(cl2, 1300 + Math.sin(T * 0.13 + 2) * 30, 200, T, 1.4, 0.8, 2);

      /* v10 — a house takes them in: stay there until you leave */
      const ax = kf(t, aKeys);
      const inside = es(t, 0.36, 0.42) * (1 - es(t, 0.84, 0.9));
      const greet = bump(t, 0.16, 0.45);
      pA.forEach((p, i) => {
        const x = ax - i * 46;
        p.set({ x, y: Y + i * 4, s: 0.86, flip: t > 0.9, o: 1 - inside, walk: moving(t, aKeys) ? x * 0.05 + i : undefined, armF: 20 + greet * 20, blink: blinkAt(T, i) });
      });
      host.set({ x: LH.door + 30, y: Y - 4, s: 0.84, flip: true, o: es(t, 0.05, 0.15) * (1 - es(t, 0.4, 0.45) * (1 - es(t, 0.85, 0.9))), armF: greet * 90 + bump(t, 0.86, 1.0) * 100, armB: greet * 40, blink: blinkAt(T, 3) });
      hostW.set({ x: LH.door + 78, y: Y - 2, s: 0.8, flip: true, o: es(t, 0.1, 0.2) * (1 - es(t, 0.4, 0.45) * (1 - es(t, 0.85, 0.9))), armF: greet * 50 + bump(t, 0.86, 1.0) * 120, blink: blinkAt(T, 5) });

      /* v11 — a place that will not receive them: doors shut, backs turn */
      const bx = kf(t, bKeys);
      const preachB = bump(t, 1.3, 2.0);
      const shut = es(t, 1.35, 1.55);
      const shake = t > 2.45 && t < 2.62 ? Math.sin(t * 160) : 0;
      pB.forEach((p, i) => {
        const x = bx + (t < 2 ? -52 : 52) * i;
        p.set({ x, y: Y + 4 + i * 6, s: 0.86, flip: t > 2.0, walk: moving(t, bKeys) ? x * 0.05 + i : shake ? t * 140 + i : undefined, amt: shake ? 1.8 : 1, armF: 20, armB: preachB * (i ? 30 : 120), lean: shake * 4, bob: -Math.abs(shake) * 6, blink: blinkAt(T, 7 + i) });
      });
      deaf.forEach((d) => {
        const away = es(t, 1.4 + d.i * 0.08, 1.55 + d.i * 0.08);
        d.p.set({ x: d.x + away * 20, y: Y + 8 + d.i * 4, s: 0.84, flip: away < 0.5, o: 1 - es(t, 2.9, 3.1), armF: away * (d.i === 1 ? 150 : 20), armB: away * (d.i === 1 ? 150 : 30), head: away * 10, blink: blinkAt(T, d.seed) });
      });
      pose(doorEl, { x: RH.x0 + (RH.x1 - RH.x0) * 0.2, y: Y - 6 - 200 * 0.42 - 6, sx: Math.max(0.05, shut), o: shut > 0.01 ? 1 : 0 });
      const sh2 = es(t, 1.5, 1.7);
      const wx = RH.x0 + (RH.x1 - RH.x0) * 0.6, wy = Y - 6 - 200 * 0.72;
      pose(shutL, { x: wx, y: wy, sx: Math.max(0.05, sh2), o: sh2 > 0.01 ? 1 : 0 });
      pose(shutR, { x: wx + (RH.x1 - RH.x0) * 0.16, y: wy, sx: Math.max(0.05, sh2), o: sh2 > 0.01 ? 1 : 0 });
      bounce.forEach((w, i) => {
        const k = seg(t, 1.35 + i * 0.12, 1.75 + i * 0.12);
        const x = bx + 30 + k * 150 - Math.max(0, k - 0.6) * 380, y = Y - 150 - i * 20 - Math.sin(k * PI) * 30;
        pose(w, { x, y, r: k * 200, s: 0.8, o: bump(t, 1.35 + i * 0.12, 1.75 + i * 0.12) });
      });
      const nb = es(t, 1.5, 1.65, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(noBub, { x: 1210, y: Y - 200, s: nb, o: nb > 0.01 ? 1 : 0 });
      dusts.forEach((d, i) => {
        const k = seg(t, 2.46 + (i % 2) * 0.05, 2.9 + (i % 2) * 0.05);
        pose(d, { x: bx + (i < 2 ? 0 : 52) + k * 30 * (i % 2 ? 1 : -1), y: Y - 4 - k * 60, s: 0.5 + k * 1.4, o: Math.sin(k * PI) });
      });

      /* v12 — they preach repentance in the square */
      const cIn = es(t, 2.95, 3.3);
      const preach = es(t, 3.2, 3.4);
      const cx0 = lerp(-150, 740, cIn);
      pC.forEach((p, i) => {
        const x = cx0 + (i ? -50 : 0) + (1 - cIn) * 0;
        p.set({ x: t > 4 ? x - (i ? 0 : 0) : x, y: Y + 10 + i * 6, s: 0.88, walk: cIn > 0 && cIn < 1 ? x * 0.05 + i : undefined, armF: 20, armB: preach * (i ? 30 : 110 + Math.sin(T * 1.5) * 12) * (1 - es(t, 4.0, 4.1)) + bump(t, 4.05, 4.9) * (i ? 0 : 150), blink: blinkAt(T, 9 + i) });
      });
      words.forEach((w, i) => {
        const k = ((T * 0.3 + i / 5) % 1);
        const on = es(t, 3.3, 3.5) * (1 - es(t, 3.95, 4.1));
        pose(w, { x: 760 + k * (i % 2 ? 260 : -160), y: Y - 190 - Math.sin(k * PI) * 50 - i * 6, r: Math.sin(T * 2 + i) * 10, s: 0.5 + k * 0.4, o: on * Math.sin(k * PI) });
      });
      SQ.forEach((m, i) => {
        const turnK = es(t, 3.3 + i * 0.1, 3.55 + i * 0.1);
        const inK = es(t, 2.9 + i * 0.06, 3.2 + i * 0.06);
        const x = lerp(m.x + (m.x < 800 ? -500 : 500), m.x, inK);
        m.p.set({ x, y: m.y, s: 0.84, flip: m.x > 800, o: inK > 0 ? 1 : 0, walk: inK > 0 && inK < 1 ? x * 0.05 + i : undefined, head: turnK * 12, lean: turnK * 8 * (m.x > 800 ? -1 : 1), armF: turnK * 20 + bump(t, 5.8, 6) * 80, blink: blinkAt(T, m.seed) });
        const hk = es(t, 3.45 + i * 0.1, 3.65 + i * 0.1, ease.back) * (1 - es(t, 4.0, 4.15));
        const [hx, hy] = headAt(m.x, m.y, 0.84, m.x > 800);
        pose(hearts[i], { x: hx, y: hy - 42 - Math.sin(T * 2 + i) * 4, s: hk, o: hk > 0.01 ? 1 : 0 });
      });

      /* v13a — many demons driven out */
      const pIn = es(t, 3.9, 4.1);
      const free = es(t, 4.35, 4.5);
      const tremble = (1 - free) * es(t, 4.0, 4.1) * Math.sin(T * 24) * 5;
      possessed.set({ x: 870, y: Y + 14, s: 0.9, flip: true, o: pIn * (1 - es(t, 4.95, 5.05)), lean: tremble, armF: (1 - free) * (60 + tremble * 6) + free * 30, armB: (1 - free) * 120 + free * 20, head: tremble * 2 - free * 6, blink: blinkAt(T, 4) });
      shards.forEach((sd) => {
        const k = seg(t, 4.35 + sd.i * 0.02, 4.85 + sd.i * 0.02);
        const r = k * 160;
        pose(sd.el, { x: 870 + Math.cos(sd.a) * r, y: Y - 130 + Math.sin(sd.a) * r, r: k * 300 + sd.seed * 60, s: 1 - k * 0.8, o: k > 0 && k < 1 ? 1 - k : 0 });
      });
      pose(burst, { x: 870, y: Y - 130, s: 0.4 + free, r: T * 10, o: bump(t, 4.35, 4.95) * 0.7 });

      /* v13b — the sick anointed with oil and healed */
      const sIn = es(t, 4.95, 5.1);
      const up = es(t, 5.5, 5.62);
      pose(mat, { x: 900, y: Y + 4, s: 0.9, o: sIn * (1 - up) });
      risen.set({ x: 930, y: Y + 10, s: 0.88, flip: true, o: up, armF: up * 90 + Math.sin(T * 3) * 10 * up, armB: up * 140, head: -6, blink: blinkAt(T, 11) });
      thomas.set({ x: 840, y: Y + 20, s: 0.88, o: sIn, armF: 40 + bump(t, 5.1, 5.55) * 50, head: 10, blink: blinkAt(T, 12) });
      matthew.set({ x: 790, y: Y + 12, s: 0.86, o: sIn, armF: 20 + up * 30, armB: up * 60, blink: blinkAt(T, 13) });
      drops.forEach((d, i) => {
        const k = ((T * 1.2 + i / 3) % 1);
        const on = bump(t, 5.15, 5.55);
        const [hx, hy] = hand(840, Y + 20, 0.88, false, 40 + bump(t, 5.1, 5.55) * 50, 0, 46);
        pose(d, { x: hx + 16, y: hy + k * 30, o: on * (1 - k) });
      });
      const hs = bump(t, 5.5, 5.95);
      pose(healSpark, { x: 930, y: Y - 180, s: hs, r: T * 40, o: hs > 0.02 ? 1 : 0 });

      // phone: the last of the deaf villagers, and both ends of the square, inside the screen
      S.cam.x = S.portrait ? kf(t, [[-0.5, -420], [0.9, -420], [1.2, 540], [2.4, 540], [2.9, -40]]) : kf(t, [[-0.5, -420], [0.9, -420], [1.2, 480], [2.4, 480], [2.9, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.9, 1.12], [1.2, 1.12], [2.9, 1.06], [4.0, 1.1], [5.0, 1.14]]);
      S.cam.y = kf(t, [[-0.5, 40], [2.9, 30], [5.0, 50]]);
    };
  },
};
