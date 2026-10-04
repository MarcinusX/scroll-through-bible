// Mk 5,41–43 — in the child's room: Jesus takes the girl by the hand — "Talitha kum" on a paper tag, its
// meaning on a second tag beneath — she gets up and walks (twelve little flowers for her twelve years),
// everyone is overcome with amazement; He tells them firmly to let no one know (the shutters close),
// and to give her something to eat: her mother brings a bowl and bread, and she smiles.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { oilLamp, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, bedFrame, blanket, bubble, tag, glyphTag, bowl, loaf, spark, heart, headAt } from './lib.js';

const PI = Math.PI;
const FLOOR = 716, BED = 800, BS = 1.15;       // bed centre & scale
const WIN = [470, 380];                         // window centre

export default {
  id: 'm5-talitha',
  beats: [
    { v: 41, text: 'Ująwszy dziewczynkę za rękę, rzekł do niej: «Talitha kum»,' },
    { v: 41, cont: true, text: 'to znaczy: "Dziewczynko, mówię ci, wstań!"' },
    { v: 42, text: 'Dziewczynka natychmiast wstała i chodziła,' },
    { v: 42, cont: true, text: 'miała bowiem dwanaście lat.' },
    { v: 42, cont: true, text: 'I osłupieli wprost ze zdumienia.' },
    { v: 43, text: 'Przykazał im też z naciskiem, żeby nikt o tym nie wiedział,' },
    { v: 43, cont: true, text: 'i polecił, aby jej dano jeść.' },
  ],
  cam: { x: [-80, 60], y: [-40, 60], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    /* ---------- the room ---------- */
    const room = S.layer({ par: 0, sh: 1, sky: true });
    room.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.plaster2, C.blushVeil, 0.35)}"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const wallL = S.layer({ par: 0.2, sh: 3 });
    const w = sheet();
    // the window with the evening sky in it
    w.p(c.cut([[WIN[0] - 70, WIN[1] + 90], [WIN[0] - 70, WIN[1] - 40], ...c.arc(WIN[0], WIN[1] - 40, 70, 64, PI, 2 * PI, 12), [WIN[0] + 70, WIN[1] + 90]], 0.5, 6), '#f3d2a6');
    w.p(c.cut([[WIN[0] - 70, WIN[1] + 90], [WIN[0] + 70, WIN[1] + 90], [WIN[0] + 70, WIN[1] + 30], [WIN[0] - 70, WIN[1] + 40]], 0.5, 6), C.hillNear);
    w.p(c.ribbon([[WIN[0] - 80, WIN[1] + 94], [WIN[0] + 80, WIN[1] + 94]], 10), C.wood2);
    w.p(c.ribbon([[WIN[0] - 76, WIN[1] + 94], [WIN[0] - 76, WIN[1] - 40], ...c.arc(WIN[0], WIN[1] - 40, 76, 70, PI, 2 * PI, 12), [WIN[0] + 76, WIN[1] + 94]], 8), C.wood);
    // a shelf with jars, a niche with a lamp, a hanging herb bunch, the floor
    w.p(c.cut(c.rect(1010, 470, 170, 7), 0.3, 6), C.wood2);
    w.p(c.cut([[1030, 470], [1026, 446], [1038, 434], [1048, 446], [1044, 470]], 0.3, 4) + c.cut(c.arc(1090, 470, 18, 15, PI, 2 * PI, 6), 0.3, 4) + c.cut([[1140, 470], [1136, 440], [1152, 432], [1158, 470]], 0.3, 4), C.pot);
    w.p(c.cut([[640, 470], [640, 436], ...c.arc(664, 436, 24, 22, PI, 2 * PI, 8), [688, 470]], 0.4, 5), shade(C.plaster2, -0.16));
    w.p(c.cut([[-900, FLOOR - 20], [2500, FLOOR - 20], [2500, 1700], [-900, 1700]], 0.6, 12), mix(C.clay, C.sand2, 0.55));
    w.p(c.cut([[560, FLOOR - 8], [1060, FLOOR - 8], [1080, FLOOR + 20], [540, FLOOR + 20]], 0.5, 8), mix(C.terracotta, C.roseRobe, 0.6));
    let beams = '';
    for (let x = -300; x < 1900; x += 90) beams += c.cut(c.rect(x, 90, 22, 40), 0.3, 5);
    w.p(c.cut(c.rect(-900, 80, 3400, 18), 0.4, 10), C.wood2).p(beams, C.wood);
    wallL.add(w.out());
    const lamp = wallL.add(`<g transform="translate(662 468) scale(.8)">${oilLamp(c)}</g>`);
    const sun = wallL.add(`<g>${rays(c, { n: 9, r0: 20, r1: 340, spread: 0.05, color: '#fff0c8' })}</g>`);
    const shutL = wallL.add(`<path d="${c.cut([[0, -130], [72, -124], [72, 90], [0, 90]], 0.5, 6)}" fill="${C.wood3}"/>`);
    const shutR = wallL.add(`<path d="${c.cut([[0, -130], [-72, -124], [-72, 90], [0, 90]], 0.5, 6)}" fill="${shade(C.wood3, -0.06)}"/>`);

    /* ---------- people behind the bed ---------- */
    const backP = S.layer({ par: 0.45, sh: 4 });
    const P = S.portrait;
    const JAX = P ? 530 : 430;   // phone: the father and the three disciples a step in from the frame and the thread
    const THREE = (P ? [[CAST.peter, 955], [CAST.james, 1005], [CAST.john, 1055]] : [[CAST.peter, 1010], [CAST.james, 1080], [CAST.john, 1150]]).map(([cast, x], i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(backP.add(person(c, { ...cast }))) }));
    const glow = backP.add(`<circle r="160" fill="url(#halo-glow)"/>`);
    const jesus = S.puppet(backP.add(person(c, { ...CAST.jesus })));

    /* ---------- the bed and the girl ---------- */
    const bedL = S.layer({ par: 0.45, sh: 4 });
    bedL.add(`<g transform="translate(${BED} ${FLOOR}) scale(${BS})">${bedFrame(c, 250)}</g>`);
    // lying: a puppet inside a turned group (head on the pillow at the right)
    const ls = 0.68;
    const lyingG = bedL.add(`<g><g transform="translate(${(96 - 167 * ls).toFixed(1)} ${(-40 * ls).toFixed(1)}) scale(-1 1) rotate(-90) scale(${ls})">${person(c, { ...LOOK.girl, eyes: 'closed' })}</g></g>`);
    const lying = S.puppet(lyingG.querySelector('.fig'));
    bedL.add(`<g transform="translate(${BED} ${FLOOR}) scale(${BS})">${blanket(c, 250)}</g>`);
    const sitG = S.puppet(bedL.add(person(c, { ...LOOK.girl, pose: 'sit' })));
    const girl = S.puppet(bedL.add(person(c, { ...LOOK.girl, holdF: `<g class="food" opacity="0"><g transform="translate(0 16)">${bowl(c, { w: 46, food: 'stew' })}</g></g>` })));
    const food = girl.el.querySelector('.food');
    const handGlow = bedL.add(`<g>${spark(c, 12)}</g>`);

    /* ---------- the parents in front ---------- */
    const frontP = S.layer({ par: 0.5, sh: 5 });
    const jairus = S.puppet(frontP.add(person(c, { ...LOOK.jairus })));
    const mother = S.puppet(frontP.add(person(c, { ...LOOK.mother, holdF: `<g class="tray"><g transform="translate(-6 14)">${bowl(c, { w: 34, food: 'stew' })}</g><g transform="translate(22 8)">${loaf(c, 14)}</g></g>` })));
    const tray = mother.el.querySelector('.tray');

    /* ---------- words ---------- */
    const wL = S.layer({ par: 0.3, sh: 5 });
    const aram = `<text x="0" y="78" text-anchor="middle" font-family="EB Garamond, 'Times New Roman', serif" font-size="20" fill="${C.inkSoft}" direction="rtl">טליתא קומי</text>`;
    const tag1 = hanging(wL, `${tag(c, ['Talitha kum', ' '], { size: 30, w: 250 })}${aram}`, { x: 800, y: -1000, len: 600 });
    const tag2 = hanging(wL, tag(c, [tr('Dziewczynko, mówię ci,', 'Girl, I tell you,'), tr('wstań!', 'get up!')], { size: 22, w: 280 }), { x: 800, y: -1000, len: 600 });
    const twelve = hanging(wL, tag(c, tr('12 lat', '12 years'), { size: 24, w: 110 }), { x: 460, y: -1000, len: 600 });
    const flowers = Array.from({ length: 12 }, (_, i) => wL.add(`<g>${sheet().p(c.cut(c.star(0, 0, 11, 5, 5, i), 0.2, 3), [C.jesusMantle, C.cream, C.wheat, C.lavender][i % 4]).x(c.poly(c.circ(0, 0, 3.4, 8)), C.ochre).out()}</g>`));
    const wow = [0, 1, 2, 3, 4].map(() => wL.add(`<g>${glyphTag(c, '!', { size: 22 })}</g>`));
    const hush = wL.add(`<g>${bubble(c, [tr('Niech nikt się o tym', 'Let no one'), tr('nie dowie.', 'know this.')], { size: 20, dir: -1 })}</g>`);
    const eat = wL.add(`<g>${bubble(c, [tr('Dajcie jej jeść.', 'Give her something to eat.')], { size: 20, dir: -1 })}</g>`);
    const hearts = [0, 1, 2].map(() => wL.add(`<g>${heart(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v41 — He takes her by the hand */
      const take = es(t, 0.1, 0.6);
      const up = es(t, 2.05, 2.12);
      const stand = es(t, 2.35, 2.42);
      const hush_ = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.05));
      const jx = 800 + stand * 30;
      jesus.set({ x: jx, y: FLOOR - 26, s: 1.1, flip: false, armF: 14 + take * 56 * (1 - stand) + stand * 40 + hush_ * 40, armB: 8 + hush_ * 120 + bump(t, 1, 2) * 20, lean: take * 10 * (1 - stand), head: take * 12 * (1 - stand) - hush_ * 4, blink: blinkAt(T) });
      pose(glow, { x: jx + 4, y: FLOOR - 220, s: 1 + bump(t, 0.8, 2.6) * 0.4, o: 0.35 + bump(t, 0.8, 2.6) * 0.5 });
      // the girl: lying still (her hand rises into His) → sitting → standing → walking to her parents
      lying.set({ x: 0, y: 0, s: 1, o: 1, armF: take * 150, head: 0, blink: 0 });
      pose(lyingG, { x: BED, y: FLOOR - 54 * BS, s: BS, o: 1 - up });
      pose(handGlow, { x: 856, y: FLOOR - 150, s: bump(t, 0.4, 2.1) * (0.9 + (t > 0.4 && t < 2.1 ? Math.sin(T * 5) * 0.1 : 0)), r: t > 0.4 && t < 2.1 ? T * 20 : 0, o: bump(t, 0.4, 2.1) });
      sitG.set({ x: 880, y: FLOOR - 50, s: 0.84, flip: true, o: up * (1 - stand), armF: 40, armB: 20, blink: blinkAt(T, 8) });
      const gKeys = [[2.42, 860], [2.95, 744]];
      const gx = kf(t, gKeys);
      const eatK = es(t, 6.3, 6.5);
      const gArm = 20 + bump(t, 3, 4) * 30 + eatK * 30;
      pose(food, { r: gArm, o: eatK });
      girl.set({ x: gx, y: FLOOR + 4, s: 0.82, flip: true, o: stand, walk: t > 2.42 && t < 2.95 ? gx * 0.07 : undefined, armF: gArm, armB: 10 + bump(t, 4.05, 4.9) * 60, head: -eatK * 6, blink: blinkAt(T, 8) });

      /* the tags */
      swing(tag1, 800, -1000 + es(t, 0.3, 0.7, ease.back) * 1160 - es(t, 2.0, 2.3) * 1300, T, 1.1, 0.8);
      swing(tag2, 800, -1000 + es(t, 1.05, 1.45, ease.back) * 1300 - es(t, 2.0, 2.3) * 1340, T, 1.1, 0.8, 1);
      swing(twelve, 700, -1000 + es(t, 3.05, 3.4, ease.back) * 1220 - es(t, 3.9, 4.2) * 1220, T, 1.3, 0.8, 2);
      flowers.forEach((f, i) => {
        const a = PI * (1.1 + (i / 11) * 0.8);
        const k = es(t, 3.1 + i * 0.05, 3.3 + i * 0.05, ease.back) * (1 - es(t, 6.8, 7) * 0);
        pose(f, { x: 700 + Math.cos(a) * 150, y: FLOOR - 120 + Math.sin(a) * 130, s: k * (1 + (k > 0.02 ? Math.sin(T * 2 + i) * 0.05 : 0)), r: (k > 0.02 ? T * 8 : 0) + i * 30, o: k > 0.02 ? (1 - es(t, 4.05, 4.4) * 0.6) : 0 });
      });

      /* v42c — amazement */
      const amaze = es(t, 4.05, 4.3) * (1 - es(t, 5.0, 5.3) * 0.7);
      THREE.forEach((d) => d.p.set({ x: d.x, y: FLOOR - 30 - d.i * 6, s: 1.02, flip: true, armF: 12 + amaze * (d.i % 2 ? 60 : 100) + bump(t, 2.4, 3.0) * 20, armB: 8 + amaze * (d.i === 1 ? 140 : 30), head: -amaze * 8, lean: -amaze * 4, blink: blinkAt(T, d.seed) }));
      const hug = es(t, 3.0, 3.4) * (1 - es(t, 6.05, 6.3));
      const bring = es(t, 6.0, 6.3);
      const mx = kf(t, [[0, P ? 570 : 520], [2.9, P ? 570 : 520], [3.3, 604], [6.0, 604], [6.3, 610]]);
      const mArm = 50 + hug * 40 - bring * 20 + amaze * 30;
      pose(tray, { r: mArm, o: es(t, 5.95, 6.1) * (1 - es(t, 6.3, 6.4)) });
      mother.set({ x: mx, y: FLOOR + 16, s: 1.08, flip: false, armF: mArm, armB: 30 + hug * 50 + amaze * 60 * (1 - hug), head: 6 - amaze * 10, lean: hug * 6, walk: (t > 2.9 && t < 3.3) || (t > 6.0 && t < 6.3) ? mx * 0.07 : undefined, blink: blinkAt(T, 3) });
      jairus.set({ x: JAX, y: FLOOR + 20, s: 1.1, flip: false, armF: 30 + amaze * 90, armB: 20 + amaze * 120, head: -amaze * 10, blink: blinkAt(T, 5) });
      wow.forEach((g, i) => {
        const xs = [JAX, 520, ...THREE.map((d) => d.x)];
        const k = es(t, 4.08 + i * 0.05, 4.28 + i * 0.05, ease.back) * (1 - es(t, 4.85, 5.0));
        pose(g, { x: xs[i] + 30, y: FLOOR - 250 - (i % 2) * 20, s: k, r: k > 0.02 ? Math.sin(T * 6 + i) * 8 : 0, o: k > 0.02 ? 1 : 0 });
      });

      /* v43 — tell no one: the shutters close; give her to eat */
      const close = es(t, 5.2, 5.6);
      pose(shutL, { x: WIN[0] - 76, y: WIN[1], sx: 0.12 + close * 0.88 });
      pose(shutR, { x: WIN[0] + 76, y: WIN[1], sx: 0.12 + close * 0.88 });
      pose(sun, { x: WIN[0], y: WIN[1] - 20, r: 30, s: 1, o: (0.2 + bump(t, 1, 3) * 0.3) * (1 - close) });
      fade(lamp, 1);
      const [hx, hy] = headAt(jx, FLOOR - 26, 1.1, false);
      const hk = es(t, 5.08, 5.28, ease.back) * (1 - es(t, 5.9, 6.0));
      pose(hush, { x: hx + 12, y: hy - 30, s: hk, o: hk > 0.02 ? 1 : 0 });
      const ek = es(t, 6.05, 6.25, ease.back) * (1 - es(t, 6.85, 6.98));
      pose(eat, { x: hx + 12, y: hy - 30, s: ek, o: ek > 0.02 ? 1 : 0 });
      hearts.forEach((h, i) => {
        const k = seg(t, 6.35 + i * 0.1, 6.85 + i * 0.1);
        pose(h, { x: 700 + (i - 1) * 40 + Math.sin(k * 5 + i) * 8, y: FLOOR - 220 - k * 70, s: 0.8 + k * 0.3, o: bump(t, 6.35 + i * 0.1, 6.85 + i * 0.1) });
      });

      // phone: a smaller turn to the left once she stands, so John (and his '!') stays clear of the thread
      S.cam.x = 20 - stand * (P ? 15 : 60) + es(t, 5, 5.5) * 30 - es(t, 6, 6.6) * (P ? 30 : 40);
      S.cam.y = 30 - es(t, 2.2, 3) * 10;
      S.cam.z = 1.1 - (P ? 0.05 * (1 - es(t, 2.2, 3)) : 0) - es(t, 2.2, 3) * 0.06 - es(t, 4, 4.5) * 0.04 + es(t, 6, 6.6) * 0.08;
    };
  },
};
