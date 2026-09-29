// Mt 11,3–6 — a lakeside street full of the sick. John's two disciples come up, bow and ask their question.
// Jesus answers by pointing to His ear and His eye ("what you hear and see"), and then it happens, one by one,
// in front of them: the blind man's band falls and he sees; the lame man throws away his crutch and leaps; the
// leper's grey blotches peel off; the deaf man hears and cups his ear; the young man on the bier sits up; the two
// beggars receive the golden words of the good news. "Blessed is he who does not stumble": a stone lies on the
// road before the two disciples; they step over it in the light of His blessing and set off back to John.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  townSet, JD, BLIND, LAME, DEAF, YOUTH, BEGGAR, LEPER, LEPER_HEALED, leperSpots, crutch, blindBand, addToHead, addToBody, bier, shroud,
  lyingPerson, bubble, earGlyph, eyeGlyph, stumbleStone, sparkle, goldSlip, voiceRings, headAt, hand, kf, moving, throng, popIn, tr, PI,
} from './lib.js';

const GY = 744;
const JX = 800, JS = 1.06;
const BX = 440, LX = 565, PX = 690;               // blind, lame, leper (left)
const DX = 950, BIX = 1075, BGX = [1215, 1280];   // deaf, bier, beggars (right)
const BACK = 690;                                 // the back row

export default {
  id: 'mt11-signs',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5, text: 'niewidomi wzrok odzyskują, chromi chodzą, trędowaci doznają oczyszczenia,' },
    { v: 5, cont: true, text: 'głusi słyszą, umarli zmartwychwstają, ubogim głosi się Ewangelię.' },
    { v: 6 },
  ],
  cam: { x: [-260, 360], y: [0, 60], z: [1, 1.4] },
  build(S) {
    const T0 = townSet(S, { gy: 660 });
    const c = T0.c;

    /* people of the town behind (sprites) */
    const backL = S.layer({ par: 0.45, sh: 4 });
    backL.sprite(throng(makeCutter('mt11-sg-a'), 6, { s: 0.66, rows: 2, spread: 40 }), 250, 664);
    backL.sprite(throng(makeCutter('mt11-sg-b'), 5, { s: 0.66, rows: 2, spread: 40, flip: true }), 1440, 664);

    /* the sick (back row first, then front) */
    const L = S.layer({ par: 0.45, sh: 5 });
    // the leper (kneeling, blotched) and made clean
    const lep = S.puppet(L.add(addToBody(person(c, { ...LEPER, pose: 'kneel' }), leperSpots(c, true).map((sp) => `<g transform="translate(${sp.x} ${sp.y})">${sp.m}</g>`).join(''))));
    const lepK = S.puppet(L.add(person(c, { ...LEPER_HEALED, pose: 'kneel' })));
    const lepS = S.puppet(L.add(person(c, LEPER_HEALED)));
    const flakes = leperSpots(c, true).map((sp, i) => ({ ...sp, i, el: L.add(`<g>${sp.m}</g>`), dx: c.rr(-1, 1), spin: c.rr(200, 500) }));
    // the deaf man
    const deaf = S.puppet(L.add(person(c, DEAF)));
    const earEl = L.add(`<g>${earGlyph(c, 24, C.skin4)}</g>`);
    // the beggars
    const beg = BGX.map((x, i) => ({ x, i, p: S.puppet(L.add(person(c, { ...BEGGAR, ...(i ? { robe: mix(C.stone2, C.wood3, 0.4), hair: C.hair3, beardColor: C.hair3, skin: C.skin3 } : {}), pose: 'sit' }))) }));
    const slips = Array.from({ length: 5 }, (_, i) => ({ i, el: L.add(`<g>${goldSlip(c, 34)}</g>`) }));
    // the blind man
    const blind = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed' }), blindBand(c))));
    const seer = S.puppet(L.add(person(c, BLIND)));
    const band = L.add(`<g>${blindBand(c)}</g>`);
    // the lame man sitting with his crutch; then up on his feet
    const lameS = S.puppet(L.add(person(c, { ...LAME, pose: 'sit' })));
    const lameU = S.puppet(L.add(person(c, LAME)));
    const cr = L.add(`<g>${crutch(c)}</g>`);
    // the young man on his bier, and sitting up
    const bierEl = L.add(`<g>${bier(c, 190)}</g>`);
    const dead = L.add(`<g>${lyingPerson(c, YOUTH, 0.62)}<g transform="translate(-14 0)">${shroud(c, 150)}</g></g>`);
    const risen = S.puppet(L.add(person(c, { ...YOUTH, pose: 'sit' })));
    const sheetEl = L.add(`<g>${shroud(c, 120)}</g>`);

    /* John's two disciples and Jesus */
    const act = S.layer({ par: 0.45, sh: 5 });
    const stone = act.add(`<g>${stumbleStone(c, 50)}</g>`);
    const stoneGlow = act.add(`<circle r="60" fill="url(#halo-glow)" opacity="0"/>`);
    const glow = act.add(`<circle r="180" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const dis = JD.map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))), seed: c.rr(0, 9) }));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });

    /* words and signs */
    const fx = S.layer({ par: 0.46, sh: 3 });
    const ask = fx.add(`<g>${bubble(c, [tr('Czy Ty jesteś Tym, który ma przyjść,', 'Are you he who comes,'), tr('czy też innego mamy oczekiwać?', 'or should we look for another?')], { size: 20, dir: 1 })}</g>`);
    const tell = fx.add(`<g>${bubble(c, [tr('Idźcie i oznajmijcie Janowi', 'Go and tell John'), tr('to, co słyszycie i widzicie', 'what you hear and see')], { size: 20, dir: -1, fill: C.halo })}</g>`);
    const bless = fx.add(`<g>${bubble(c, [tr('Błogosławiony, kto we Mnie', 'Blessed is he who'), tr('nie zwątpi', 'does not stumble in me')], { size: 20, dir: -1, fill: C.halo })}</g>`);
    const earBig = fx.add(`<g>${earGlyph(c, 30, C.skin)}</g>`);
    const eyeBig = fx.add(`<g>${eyeGlyph(c, 30)}</g>`);
    const sparks = Array.from({ length: 6 }, (_, i) => fx.add(`<g>${sparkle(c, 16, i % 2 ? C.halo : C.star)}</g>`));
    const SPARK_AT = [[BX, GY - 190, 2.1], [LX, GY - 150, 2.3], [PX, BACK - 150, 2.48], [DX, BACK - 175, 3.1], [BIX, GY - 120, 3.26], [1215, GY - 110, 3.45]];

    return (t, time) => {
      const T = time;
      T0.update(T);

      /* v3 — John's disciples come and ask */
      const WK = (i) => i === 0
        ? [[-0.3, 1500], [0.3, 1000], [1.9, 1000], [2.1, 1420], [4.0, 1420], [4.3, 1000], [4.62, 1000], [4.9, 1500]]
        : [[-0.3, 1600], [0.34, 1085], [1.9, 1085], [2.12, 1495], [4.0, 1495], [4.32, 1085], [4.62, 1085], [4.95, 1600]];
      dis.forEach((d) => {
        const x = kf(t, WK(d.i)), y = GY + d.i * 8;
        const s = 1.02;
        const bow = bump(t, 0.3 + d.i * 0.04, 0.55);
        const away = t > 4.62;
        const hop = d.i === 0 ? bump(t, 4.66, 4.78) : bump(t, 4.72, 4.84);
        d.p.set({
          x, y: y - hop * 26, s, flip: !away, walk: moving(t, WK(d.i)) ? x * 0.05 + d.i : undefined,
          armF: d.i === 0 ? 20 + bump(t, 0.4, 0.95) * 60 : 16, armB: d.i === 0 ? 10 + bump(t, 0.4, 0.95) * 90 : 10,
          head: bow * 20 - (t > 2 && t < 4 ? 4 : 0), lean: bow * 8, blink: blinkAt(T, d.seed),
        });
      });
      const [ax, ay] = headAt(1000, GY, 1.02, true);
      const ab = popIn(t, 0.42, 0.98);
      pose(ask, { x: ax - 20, y: ay - 30, s: ab, o: ab > 0.02 ? 1 : 0 });

      /* v4 — "go and tell John what you hear and see" */
      const speak = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.0));
      const toEar = bump(t, 1.2, 1.5), toEye = bump(t, 1.45, 1.75);
      const sweep = es(t, 1.75, 1.95);
      const work = bump(t, 2.05, 2.7) + bump(t, 3.05, 3.7);
      const blessK = es(t, 4.3, 4.45) * (1 - es(t, 4.85, 4.98));
      const face = t > 2.2 && t < 2.8;       // turns left to the blind / lame / leper
      jesus.set({
        x: JX, y: GY, s: JS, flip: face,
        armF: 20 + speak * 30 + sweep * 50 * (1 - es(t, 2.0, 2.1)) + work * 60 + blessK * 20, armB: 10 + toEar * 150 + toEye * 140 + blessK * 130,
        head: -toEar * 8 - blessK * 4, blink: blinkAt(T),
      });
      pose(glow, { x: JX, y: GY - 120, s: 1, o: 0.25 + work * 0.4 + blessK * 0.5 });
      const [hx, hy] = headAt(JX, GY, JS, face);
      voice(hx, hy, speak + work * 0.6, T, { dir: face ? -1 : 1, spread: 2.2 });
      const tb = popIn(t, 1.12, 1.97);
      pose(tell, { x: hx + 22, y: hy - 64, s: tb, o: tb > 0.02 ? 1 : 0 });
      const eb = popIn(t, 1.28, 1.97), yb = popIn(t, 1.5, 1.97);
      pose(earBig, { x: 1050, y: 420 + (T ? Math.sin(T * 2) * 3 : 0), s: eb, r: -10, o: eb > 0.02 ? 1 : 0 });
      pose(eyeBig, { x: 1140, y: 440 + (T ? Math.sin(T * 2 + 1) * 3 : 0), s: yb, o: yb > 0.02 ? 1 : 0 });

      /* v5a — the blind see */
      const see = es(t, 2.12, 2.18);
      blind.set({ x: BX, y: GY - 10, s: 0.94, armF: 40, armB: 20, head: -4, o: 1 - see });
      const joyB = es(t, 2.2, 2.4);
      seer.set({ x: BX, y: GY - 10, s: 0.94, armF: 30 + joyB * 60, armB: 20 + joyB * 120, head: -joyB * 12, o: see, blink: blinkAt(T, 3) });
      const bf = seg(t, 2.14, 2.6);
      const [bhx, bhy] = headAt(BX, GY - 10, 0.94);
      pose(band, { x: bhx - bf * 40, y: bhy + bf * bf * 160, r: -bf * 200, s: 0.94, o: see * (1 - seg(t, 2.5, 2.62)) });
      // the lame walk
      const up = es(t, 2.3, 2.36);
      lameS.set({ x: LX, y: GY + 4, s: 0.96, armF: 60, armB: 20, head: -8, o: 1 - up });
      const leap = bump(t, 2.36, 2.52) + bump(t, 2.52, 2.66) * 0.6;
      lameU.set({ x: LX + es(t, 2.36, 2.66) * 20, y: GY + 4 - leap * 30, s: 0.96, armF: 60 + leap * 60, armB: 40 + leap * 110, head: -10, o: up, blink: blinkAt(T, 5) });
      const throw_ = seg(t, 2.34, 2.62);
      pose(cr, { x: LX + 60 + throw_ * 90, y: lerp(GY - 8, GY - 12, throw_) - Math.sin(throw_ * PI) * 120, r: lerp(90, 420, throw_), s: 0.9, oy: 70, o: 1 });
      // lepers are cleansed
      const clean = es(t, 2.48, 2.54);
      lep.set({ x: PX, y: BACK + 4, s: 0.86, armF: 70, armB: 60, head: -6, o: 1 - clean });
      const stand = es(t, 2.76, 2.82);
      lepK.set({ x: PX, y: BACK + 4, s: 0.86, armF: 50, armB: 40, head: -10, o: clean * (1 - stand) });
      lepS.set({ x: PX, y: BACK + 4, s: 0.86, armF: 40, armB: 90 + bump(t, 2.8, 3.8) * 40, head: -8, o: stand, blink: blinkAt(T, 7) });
      flakes.forEach((f) => {
        const k = seg(t, 2.5 + f.i * 0.015, 2.95 + f.i * 0.015);
        pose(f.el, { x: PX + f.x * 0.86 + k * (40 + f.dx * 80), y: BACK + 4 + f.y * 0.86 - Math.sin(k * PI) * 70 + k * k * 60, r: k * f.spin, s: 1 + k * 0.5, o: clean * (1 - seg(k, 0.6, 1)) });
      });

      /* v5b — the deaf hear */
      const hear = es(t, 3.12, 3.25);
      deaf.set({ x: DX, y: BACK, s: 0.86, flip: true, armF: 20 + hear * 50, armB: 150 - hear * 10, head: -4 - hear * 6, blink: blinkAt(T, 2) });
      const [dhx, dhy] = headAt(DX, BACK, 0.86, true);
      const eg = popIn(t, 3.16, 3.98);
      pose(earEl, { x: dhx + 10, y: dhy - 64, s: eg * 0.9, r: T ? Math.sin(T * 2) * 6 : 0, o: eg > 0.02 ? 1 : 0 });
      // the dead are raised
      pose(bierEl, { x: BIX, y: GY + 6 });
      const sit = es(t, 3.3, 3.38);
      pose(dead, { x: BIX, y: GY + 6 - 44, o: 1 - sit });
      const rise = es(t, 3.36, 3.6);
      risen.set({ x: BIX - 50, y: GY + 6 - 44, s: 0.72, armF: 40 + rise * 60, armB: 20 + rise * 120, head: -rise * 10, lean: -10 + rise * 10, o: sit, blink: blinkAt(T, 4) });
      pose(sheetEl, { x: BIX + 20 + rise * 10, y: GY - 38, sx: 1 - rise * 0.2, o: sit });
      // the poor hear the good news
      const news = es(t, 3.45, 3.75);
      beg.forEach((b) => {
        b.p.set({ x: b.x, y: GY - 2 + b.i * 6, s: 0.82, flip: true, armF: 30 + news * (50 + b.i * 20), armB: 20 + news * 80, head: -news * 10, blink: blinkAt(T, 6 + b.i) });
      });
      slips.forEach((sl) => {
        const k = seg(t, 3.42 + sl.i * 0.05, 3.72 + sl.i * 0.05);
        const tx = BGX[sl.i % 2] - 20, ty = GY - 110;
        pose(sl.el, { x: lerp(hx + 20, tx, k), y: lerp(hy + 20, ty, k) - Math.sin(k * PI) * 90, r: k * 30, s: 0.8 + k * 0.3, o: k > 0 && k < 1 ? 1 : 0 });
      });
      sparks.forEach((sp, i) => {
        const [x, y, a] = SPARK_AT[i];
        const k = bump(t, a, a + 0.5);
        pose(sp, { x, y, s: k, r: T * 40 + i * 30, o: k });
      });

      /* v6 — "blessed…": the stone on their road, and His blessing */
      const st = es(t, 4.05, 4.2);
      pose(stone, { x: 1180, y: GY + 20, s: st, o: st > 0.02 ? 1 : 0 });
      pose(stoneGlow, { x: 1180, y: GY + 4, o: blessK * 0.8 });
      const bb = popIn(t, 4.12, 4.98);
      pose(bless, { x: hx + 22, y: hy - 64, s: bb, o: bb > 0.02 ? 1 : 0 });

      /* camera */
      S.cam.x = kf(t, [[0, 250], [1.9, 250], [2.08, -260], [2.9, -260], [3.08, 360], [3.9, 360], [4.1, 300]]);
      S.cam.z = kf(t, [[0, 1.3], [1.9, 1.3], [2.08, 1.38], [4.0, 1.38], [4.2, 1.3]]);
      S.cam.y = kf(t, [[0, 50], [2.0, 60], [4.2, 50]]);
    };
  },
};
