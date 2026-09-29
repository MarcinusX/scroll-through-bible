// Łk 3,8–9 — one continuous meadow by the Jordan. "Bear fruits worthy of repentance": the young tree beside
// John blossoms and its fruit ripens. "Do not say, 'We have Abraham for our father'": the proud listeners lift
// their chins and Abraham's medallion, ringed with his stars, comes down over them. "God can raise children to
// Abraham from these stones": the stars fall from it onto the stones at their feet, and the stones stand up as
// children. "The axe already lies at the root": an axe comes down against the root of the barren tree. "Every
// tree that does not bear good fruit is cut down and thrown into the fire": two strokes, it falls, and it goes
// into the fire, which flares — while the young tree stands in the light, heavy with fruit.
import { C, person, blinkAt, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, flowers, rock, reeds } from '../../assets/nature.js';
import {
  JOHN_B, headAt, hand, voiceRings, orchardTree, fruit, blossom, axe, chip, firePit, fireFlames, medal, ICON, ABRAHAM, child,
  sparkle, glowStar, folk, JORDAN_DAY, tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const GY = 690;                    // where people stand
const JX = 512;                    // John
const TX = 650, TY = 694;          // the young tree
const BX = 1050, BY = 690;         // the barren tree
const FX = 1100;                   // the fire
const AX = 810, AY = 250;          // Abraham's medallion

export default {
  id: 'lk3-fruit',
  beats: [
    { v: 8, text: 'Wydajcie więc owoce godne nawrócenia;' },
    { v: 8, cont: true, text: 'i nie próbujcie sobie mówić: "Abrahama mamy za ojca",' },
    { v: 8, cont: true, text: 'bo powiadam wam, że z tych kamieni może Bóg wzbudzić dzieci Abrahamowi.' },
    { v: 9, text: 'Już siekiera do korzenia drzew jest przyłożona.' },
    { v: 9, cont: true, text: 'Każde więc drzewo, które nie wydaje dobrego owocu, będzie wycięte i w ogień wrzucone».' },
  ],
  cam: { x: [-20, 60], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, JORDAN_DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1260, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 560, y: 150, len: 700 });

    /* the far hills, the Jordan, the meadow */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.dune, 0.5) }).markup);
    S.layer({ par: 0.14, sh: 3 }).add(hillsWith(c, { y: 520, amps: [12, 5, 2], lens: [900, 320, 120], color: mix(C.dune, C.sand2, 0.4), trees: 10, treeColor: C.olive, treeH: 16 }).markup);
    const river = S.layer({ par: 0.2, sh: 2 });
    river.add(sheet().p(c.ridge(c.wave(560, [3, 1.2], [300, 90]), -1100, 2700, 1900, 12, 0.6), C.lake).p(c.ridge(c.wave(596, [3, 1], [260, 80]), -1100, 2700, 1900, 12, 0.6), mix(C.sand, C.sage3, 0.4)).out());
    river.add(reeds(c, 300, 600, 8, 60) + reeds(c, 1320, 600, 9, 64));
    const G = S.layer({ par: 0.35, sh: 3 });
    const gfn = c.wave(640, [4, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -1100, 2700, 1900, 12, 1), mix(C.sage2, C.sand, 0.35)).out());
    G.add(grass(c, { x0: -1100, x1: 2700, y: 640, fn: gfn, n: 60, h: 14, color: C.moss }) + flowers(c, { x0: -600, x1: 2200, y: GY + 30, n: 22 }));

    /* the trees, the fire */
    const T = S.layer({ par: 0.35, sh: 5 });
    const goodGlow = T.add(`<ellipse rx="170" ry="150" fill="url(#warm-glow)"/>`);
    const young = orchardTree(c, { sc: 0.9, leaf: C.leaf, leaf2: C.moss });
    T.add(`<g transform="translate(${TX} ${TY})">${young.tree}</g>`);
    const blooms = young.fruits.map((f, i) => ({ ...f, i, el: T.add(`<g>${blossom(c, 7)}</g>`) }));
    const fruits = young.fruits.map((f, i) => ({ ...f, i, el: T.add(`<g>${fruit(c, 10)}</g>`) }));
    const fGlow = T.add(`<circle r="200" fill="url(#warm-glow)"/>`);
    T.add(`<g transform="translate(${FX} ${GY + 12})">${firePit(c, 120)}</g>`);
    const flames = T.add(`<g>${fireFlames(c, 120)}</g>`);
    const bad = orchardTree(c, { sc: 1.0, barren: true });
    const badEl = T.add(`<g>${bad.tree}</g>`);
    const stump = T.add(`<g>${sheet().p(c.cut([[-16, 0], [-15, -22], [-6, -26], [6, -22], [16, -24], [17, 0]], 0.5, 4), mix(C.stone2, C.wood3, 0.3)).x(c.poly(c.ell(0, -23, 13, 4, 12)), C.wood3).out()}</g>`);

    /* people: John, the proud listeners; the stones and the children they become */
    const act = S.layer({ par: 0.35, sh: 5 });
    const john = S.puppet(act.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5, both: false });
    const PROUD = [
      { o: { robe: C.plumRobe, mantle: C.ochre, belt: C.sun, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin2 }, x: 790, s: 1.0 },
      { o: { robe: C.tealRobe, mantle: C.linen2, belt: C.sun, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3 }, x: 872, s: 0.98 },
      { o: { robe: C.mauve, mantle: C.clayMantle, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin }, x: 950, s: 1.0 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(act.add(person(c, m.o))), seed: c.rr(0, 9) }));
    const STONES = [[720, 712, 34], [780, 720, 30], [842, 716, 36], [904, 722, 30], [962, 714, 32]].map(([x, y, w], i) => ({
      x, y, w, i,
      glow: act.add(`<circle r="40" fill="url(#halo-glow)"/>`),
      el: act.add(`<g>${rock(c, 0, 0, w, w * 0.55, i % 2 ? C.rock : C.rock2)}</g>`),
      kid: S.puppet(act.add(person(c, child(c, i)))),
    }));

    /* Abraham's medallion and his stars; the axe, chips, glint */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const abr = hanging(fly, medal(S, ABRAHAM, { r: 62, rim: C.haloRim, back: mix('#2b3262', C.indigo, 0.3), name: tr('Abraham', 'Abraham'), size: 23, icon: ICON.stars(c) }), { x: 0, y: -1500, len: 700 });
    const STARS = STONES.map((s, i) => ({ i, el: fly.add(`<g>${glowStar(c, 11)}</g>`) }));
    const A = S.layer({ par: 0.35, sh: 6 });
    const axeEl = A.add(`<g>${axe(c, 180)}</g>`);
    const glint = A.add(`<g>${sparkle(c, 16, C.star)}</g>`);
    const chips = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: A.add(`<g>${chip(c, 6 + (i % 3) * 2)}</g>`), vx: -50 - i * 22, vy: -90 - (i % 3) * 30 }));

    return (t, time) => {
      swing(sunEl, 1260, 150, time, 1, 0.6);
      swing(cl1, 560 + Math.sin(time * 0.1) * 20, 150, time, 1.2, 0.6, 1);

      /* v8a — fruits worthy of repentance: the young tree blossoms and bears */
      blooms.forEach((b) => {
        const k = es(t, 0.1 + b.i * 0.025, 0.28 + b.i * 0.025, ease.back), gone = es(t, 0.44 + b.i * 0.02, 0.54 + b.i * 0.02);
        pose(b.el, { x: TX + b.x * 1, y: TY + b.y, s: k * (1 - gone), r: t * 40, o: k > 0.01 && gone < 1 ? 1 : 0 });
      });
      fruits.forEach((f) => {
        const k = es(t, 0.42 + f.i * 0.025, 0.62 + f.i * 0.025, ease.back);
        const drop = es(t, 4.5, 4.6) * 0; // (the good tree keeps its fruit)
        pose(f.el, { x: TX + f.x, y: TY + f.y + 6 + drop, s: k, o: k > 0.01 ? 1 : 0 });
      });
      pose(goodGlow, { x: TX, y: TY - 190, s: 1.1, o: es(t, 0.5, 0.75) * 0.6 * (1 - es(t, 1.0, 1.3) * 0.6) + es(t, 4.6, 4.85) * 0.5 });

      /* John: to the tree, shakes his head, to the stones, to the barren tree */
      const tell = es(t, 0.05, 0.2) * (1 - es(t, 0.85, 1.0));
      const shake = bump(t, 1.3, 1.9);
      const pointS = es(t, 2.05, 2.2) * (1 - es(t, 2.85, 3.0));
      const pointT = es(t, 3.05, 3.2);
      john.set({
        x: JX, y: GY, s: 1.04, flip: false,
        armF: 20 + tell * 64 + shake * 20 + pointS * 50 + pointT * 70, armB: 10 + tell * 30 + shake * 50 + pointT * 30,
        head: Math.sin(seg(t, 1.35, 1.85) * PI * 3) * 6 * shake + pointS * 10 - pointT * 6, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(JX, GY, 1.04);
      voice(hx + 14, hy, Math.max(tell, shake, pointS, pointT * (1 - es(t, 4.8, 5.0))), time, { spread: 2.4, dir: 1 });

      /* v8b — "We have Abraham for our father": chins up, Abraham comes down over them */
      const proud = es(t, 1.08, 1.3) * (1 - es(t, 2.3, 2.5));
      const ak = es(t, 1.12, 1.45, ease.out), aUp = es(t, 3.0, 3.35, ease.in);
      swing(abr, AX, lerp(-600, AY, ak) - aUp * 900, time, 1.2, 0.7);
      fade(abr, ak > 0.01 && aUp < 1 ? 1 : 0);

      /* v8c — the stars fall onto the stones, and the stones stand up as children */
      const surprise = es(t, 2.45, 2.65);
      const back = es(t, 3.05, 3.4);
      PROUD.forEach((m) => {
        m.p.set({
          x: m.x + surprise * 14 - back * 20, y: GY + (m.i % 2) * 6, s: m.s, flip: true,
          head: -proud * 12 + surprise * 6, lean: -proud * 4 - surprise * 5,
          armF: 20 + (m.i === 0 ? proud * 130 : proud * 30) + surprise * 40, armB: 10 + (m.i === 2 ? proud * 150 : 0) + surprise * (m.i % 2 ? 60 : 20),
          walk: back > 0 && back < 1 ? t * 30 + m.i : undefined, blink: blinkAt(time, m.seed),
        });
      });
      STARS.forEach((st, i) => {
        const s = STONES[i];
        const k = seg(t, 2.1 + i * 0.05, 2.32 + i * 0.05);
        const x = lerp(AX + (i - 2) * 40, s.x, k), y = lerp(AY + 20, s.y - 20, k * k);
        pose(st.el, { x, y, s: 0.8 + bump(t, 2.1 + i * 0.05, 2.4 + i * 0.05) * 0.5, r: t * 90, o: k > 0 && k < 1 ? 1 : 0 });
      });
      STONES.forEach((s) => {
        const a = 2.28 + s.i * 0.05;
        const hop = es(t, a, a + 0.12), stand = es(t, a + 0.1, a + 0.15);
        pose(s.el, { x: s.x, y: s.y - Math.sin(hop * PI) * 26 - s.w * 0.2, r: hop * 180, o: 1 - stand });
        pose(s.glow, { x: s.x, y: s.y - 24, s: 1 + bump(t, a - 0.1, a + 0.3), o: bump(t, a - 0.08, a + 0.35) });
        const joy = es(t, a + 0.2, a + 0.4);
        const run = es(t, 3.05, 3.45);
        s.kid.set({
          x: s.x - run * (250 - s.i * 20), y: s.y + 4, s: 0.58 * (0.7 + stand * 0.3), flip: run > 0.02 ? true : s.i % 2 === 1, o: stand,
          armF: 10 + joy * (s.i % 2 ? 60 : 120) * (1 - run), armB: joy * (s.i % 2 ? 130 : 30) * (1 - run), head: -joy * 8,
          walk: run > 0 && run < 1 ? t * 40 + s.i : undefined, blink: blinkAt(time, s.i),
        });
      });

      /* v9a — the axe comes down and lies at the root of the barren tree */
      const down = es(t, 3.08, 3.45, ease.out);
      const settle = bump(t, 3.4, 3.55);
      const restX = BX - 64, restY = BY - 32, restR = 38;
      const chop1 = bump(t, 4.04, 4.2), chop2 = bump(t, 4.2, 4.36);
      const lift = Math.max(chop1, chop2);
      const leave = es(t, 4.36, 4.5);
      const ax = lerp(restX - 240, restX, down) - lift * 50 - leave * 110;
      const ay = lerp(-300, restY, down) - lift * 80 - leave * 60;
      pose(axeEl, { x: ax, y: ay, r: lerp(-80, restR, down) + settle * 4 - lift * 70 - leave * 40, o: down > 0.001 ? 1 - es(t, 4.58, 4.68) : 0 });
      const gk = bump(t, 3.5, 3.9);
      pose(glint, { x: restX + 44, y: restY + 36, s: gk * 1.2, r: time * 60, o: gk });

      /* v9b — two strokes, chips fly, the tree falls into the fire, which flares */
      chips.forEach((ch) => {
        const a = ch.i < 3 ? 4.12 : 4.28;
        const k = seg(t, a, a + 0.28);
        pose(ch.el, { x: BX - 16 + ch.vx * k, y: BY - 24 + ch.vy * k + 260 * k * k, r: k * 400, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const fall = es(t, 4.38, 4.5, ease.in);
      const drag = es(t, 4.52, 4.66);
      pose(badEl, { x: lerp(BX, FX - 20, drag), y: BY + 4 + drag * 10, r: fall * 80 + drag * 8, s: 1 - drag * 0.35, o: 1 - es(t, 4.6, 4.68) });
      pose(stump, { x: BX, y: BY + 4, o: seg(t, 4.37, 4.39) });
      const flare = bump(t, 4.6, 5.1) * 0.7 + es(t, 4.6, 4.7) * 0.4;
      const fl = time ? 1 + Math.sin(time * 9) * 0.07 : 1;
      pose(flames, { x: FX, y: GY + 12, sx: 1 + flare * 0.4, sy: (0.75 + flare) * fl });
      pose(fGlow, { x: FX, y: GY - 30, s: 0.7 + flare * 0.8, o: 0.45 + flare * 0.45 });

      S.cam.x = es(t, 1.0, 1.3) * 20 * (1 - es(t, 2.9, 3.1)) + es(t, 3.0, 3.4) * 50;
      S.cam.z = 1.03 + es(t, 2.0, 2.3) * 0.04 * (1 - es(t, 3.0, 3.3)) + es(t, 3.0, 3.4) * 0.05;
      S.cam.y = 30 + es(t, 3.0, 3.4) * 20;
    };
  },
};
