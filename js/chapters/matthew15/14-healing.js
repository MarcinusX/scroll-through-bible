// Mt 15,30–31 — on the top of the mountain Jesus sits on His rock. Great crowds come up over the slopes, bringing
// their sick and laying them at His feet: a lame man carried on a mat by two friends, a blind man led by a boy, a mute
// man with his mouth bound, a maimed man with his arm in a sling. He lifts His hand over them, and one after another
// they are healed — the band falls from the blind man's eyes, the lame man gets up off his mat, the cloth falls from the
// mute man's mouth, the sling from the maimed arm. The crowds marvel: the mute man sings, the maimed waves both arms,
// the lame walks and leaps, the blind man looks about and points at the sky. And they glorify the God of Israel: every
// arm goes up, and light pours down on the mountain from above.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hillSet, crowdGroup, BLIND, LAME, MUTE, gag, onFace, onBody, addToHead, blindBand, sling, crutch, kid, manOf, pose3, lyingPerson5,
  sparkle, note, eyeGlyph, speech, heart, glory, voiceRings, headAt, kf, moving, PI,
} from './lib.js';
import { makeCutter } from '../../core/paper.js';
import { mat } from '../mark1/lib.js';

const JX = 800;
const P = 0.5;
const MAIMED = { robe: C.clayMantle, mantle: null, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.leather };

export default {
  id: 'mt15-healing',
  beats: [
    { v: 30, text: 'I przyszły do Niego wielkie tłumy, mając z sobą chromych, ułomnych, niewidomych, niemych i wielu innych, i położyli ich u nóg Jego,' },
    { v: 30, cont: true, text: 'a On ich uzdrowił.' },
    { v: 31, text: 'Tłumy zdumiewały się widząc, że niemi mówią, ułomni są zdrowi, chromi chodzą, niewidomi widzą.' },
    { v: 31, cont: true, text: 'I wielbiły Boga Izraela.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const H = hillSet(S, { skyCols: ['#cde0da', '#f0e9d0', '#f7e9cc'], sky2: ['#f2d6a0', '#f8e4bb', '#fbefd6'], meadow: mix(C.hillNear, C.wheat, 0.2) });
    const c = S.c;
    const { sfn, gfn } = H;
    const JY = gfn(JX) + 6;
    const rays = H.hangL.add(`<g>${glory(c, 700, 26)}</g>`);

    /* ---------- the crowds: groups on the slope and at the sides, in three moods ---------- */
    const G_ = [
      { x: 330, side: -1, L: H.slopeL, s: 0.46, n: 6, dy: 36 }, { x: 540, side: -1, L: H.slopeL, s: 0.46, n: 5, dy: 22 },
      { x: 1070, side: 1, L: H.slopeL, s: 0.46, n: 5, dy: 22 }, { x: 1290, side: 1, L: H.slopeL, s: 0.46, n: 6, dy: 36 },
    ];
    const nearL = S.layer({ par: P, sh: 4 });
    G_.push({ x: 360, side: -1, L: nearL, s: 0.8, n: 3, dy: 40, near: true }, { x: 1250, side: 1, L: nearL, s: 0.8, n: 3, dy: 40, near: true });
    const groups = G_.map((g, i) => {
      const y = (g.near ? gfn(g.x) : sfn(g.x)) + g.dy;
      const mk = (mood) => g.L.sprite(crowdGroup('mt15-hl-' + i, g.n, { s: g.s, flip: g.side > 0, spread: g.near ? 50 : 34, rows: g.near ? 1 : 2, mood }), g.x, y);
      return { ...g, i, y, m: [mk(0), mk(1), mk(2)] };
    });

    /* ---------- Jesus on His rock ---------- */
    const L = S.layer({ par: P, sh: 5 });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const glow = L.add(`<circle r="200" fill="url(#halo-glow)" opacity="0"/>`);
    const voice = voiceRings(L, c, { n: 3, r: 30, color: shade(C.ochre, 0.3) });

    /* ---------- the sick, and how they are brought ---------- */
    const LX = S.portrait ? 545 : 515, BX = 650, MX = 950, AX = S.portrait ? 1040 : 1095;   // phone: the lame and the maimed man on screen
    // the lame man carried on a mat by two friends (one moving cut-out), then set down
    const matGround = L.add(`<g>${mat(c, 150)}</g>`);
    const crutchEl = L.add(`<g>${crutch(c)}</g>`);
    const bearers = L.sprite(pose3(makeCutter('mt15-hl-bear'), [
      { x: -84, y: 0, s: 0.9, flip: false, armF: 64, armB: 40, o: manOf(makeCutter('mt15-b1')) },
      { x: 84, y: 4, s: 0.9, flip: true, armF: 64, armB: 40, o: manOf(makeCutter('mt15-b2')) },
    ]), LX, gfn(LX) + 30);
    const carried = L.sprite(`<g transform="translate(0 -4)">${mat(c, 150)}</g><g transform="translate(-40 -8)">${lyingPerson5(c, LAME, 0.6, 'open')}</g>`, LX, gfn(LX) + 20);
    const lameSit = S.puppet(L.add(person(c, { ...LAME, pose: 'sit' })));
    const lameUp = S.puppet(L.add(person(c, LAME)));
    // the blind man led by a boy (the boy behind him)
    const boy = S.puppet(L.add(kid(c, 1)));
    const blind = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed' }), blindBand(c))));
    const blindSit = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed', pose: 'sit' }), blindBand(c))));
    const seerSit = S.puppet(L.add(person(c, { ...BLIND, pose: 'sit' })));
    const seer = S.puppet(L.add(person(c, BLIND)));
    const band = L.add(`<g>${blindBand(c)}</g>`);
    // the mute man with a friend (she stands behind him)
    const friend = S.puppet(L.add(person(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin2, hair: C.hair, beard: 'none' })));
    const mute = S.puppet(L.add(onFace(person(c, MUTE), gag(c))));
    const muteSit = S.puppet(L.add(onFace(person(c, { ...MUTE, pose: 'sit' }), gag(c))));
    const freeSit = S.puppet(L.add(person(c, { ...MUTE, pose: 'sit' })));
    const free = S.puppet(L.add(person(c, MUTE)));
    const gagEl = L.add(`<g>${gag(c)}</g>`);
    // the maimed man, arm in a sling
    const maimed = S.puppet(L.add(onBody(person(c, MAIMED), sling(c))));
    const whole = S.puppet(L.add(person(c, MAIMED)));
    const slingEl = L.add(`<g>${sling(c)}</g>`);

    /* ---------- light, sparks, songs ---------- */
    const fx = S.layer({ par: P, sh: 5 });
    const sparks = [LX, BX, MX, AX].map(() => fx.add(`<g>${sparkle(c, 16, C.star)}</g>`));
    const notes = Array.from({ length: 4 }, (_, i) => fx.add(`<g>${note(c, 8, i % 2 ? C.teal2 : C.terracotta)}</g>`));
    const song = fx.add(`<g>${speech(c, `<g transform="translate(-10 6)">${note(c, 9, C.teal2)}</g><g transform="translate(12 2)">${note(c, 8, C.terracotta)}</g>`, { w: 64, h: 50, flip: true })}</g>`);
    const eye = fx.add(`<g>${eyeGlyph(c, 18)}</g>`);
    const hearts = [0, 1, 2].map(() => fx.add(`<g>${heart(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(T);
      const praise = es(t, 3.05, 3.3);
      H.sky2.fade(praise * 0.9);
      pose(rays, { x: JX, y: 40, s: 0.6 + praise * 0.5, r: T ? T * 2 : 0, o: praise * 0.9 });

      /* v30a — the crowds come up; the sick are brought and laid at His feet */
      const marvel = es(t, 2.05, 2.25);
      groups.forEach((g) => {
        const k = es(t, 0.05 + (g.i % 4) * 0.06, 0.6 + (g.i % 4) * 0.05, ease.out);
        const x = g.x + g.side * (1 - k) * (g.near ? 520 : 700);
        const w = [(1 - marvel), marvel * (1 - praise), praise];
        g.m.forEach((sp, m) => sp.set({ x, y: g.y - Math.abs(Math.sin(k * PI * 4)) * 3 * (1 - k), o: w[m] }));
      });
      // the lame man on his mat
      const bk = es(t, 0.1, 0.62, ease.out);
      const bx = lerp(90, LX, bk);
      const lower = es(t, 0.66, 0.8);
      bearers.set({ x: bx - es(t, 0.84, 1.1) * 260, y: gfn(LX) + 30, o: 1 - es(t, 0.95, 1.1) });
      carried.set({ x: bx, y: gfn(LX) + 20 - 88 * (1 - lower), o: 1 - es(t, 0.82, 0.86) });
      pose(matGround, { x: LX, y: gfn(LX) + 20, o: es(t, 0.82, 0.86) });
      const LY = gfn(LX) + 18;
      const standL = es(t, 1.42, 1.48);
      lameSit.set({ x: LX, y: LY, s: 0.9, o: es(t, 0.82, 0.86) * (1 - standL), armF: 50 + bump(t, 1.1, 1.4) * 40, armB: 20, head: -6, blink: blinkAt(T, 2) });
      const LW = [[2.05, LX], [2.45, LX - (S.portrait ? 60 : 90)], [2.85, LX]];
      const lx = kf(t, LW);
      const leap = Math.abs(Math.sin(t * 24)) * es(t, 1.6, 1.8) * (1 - es(t, 2.0, 2.05) * 0.4);
      lameUp.set({ x: lx, y: LY - leap * 22, s: 0.94, flip: t > 2.05 && t < 2.45, o: standL, walk: moving(t, LW) ? lx * 0.05 : undefined, armF: 40 + leap * 60 + praise * 60, armB: 30 + leap * 100 + praise * 110, head: -10, blink: blinkAt(T, 2) });
      const thr = seg(t, 1.46, 1.8);
      pose(crutchEl, { x: LX + 62 + thr * 60, y: lerp(LY + 4, LY + 2, thr) - Math.sin(thr * PI) * 110, r: lerp(90, 430, thr), s: 0.8, oy: 70, o: es(t, 0.82, 0.86) });

      // the blind man and the boy
      const BK = [[0.15, 230], [0.78, BX]];
      const blx = kf(t, BK);
      const sitB = es(t, 0.8, 0.85);
      const see = es(t, 1.28, 1.34);
      const upB = es(t, 2.1, 2.16);
      blind.set({ x: blx, y: gfn(BX) + 22, s: 0.9, o: (1 - sitB), walk: moving(t, BK) ? blx * 0.05 : undefined, armF: 70, head: -6, blink: 0 });
      blindSit.set({ x: BX, y: gfn(BX) + 24, s: 0.88, o: sitB * (1 - see), armF: 40, head: -4, blink: 0 });
      seerSit.set({ x: BX, y: gfn(BX) + 24, s: 0.88, o: see * (1 - upB), armF: 40 + es(t, 1.4, 1.6) * 40, armB: 20 + es(t, 1.4, 1.6) * 100, head: -10, blink: blinkAt(T, 4) });
      const point = es(t, 2.2, 2.4);
      seer.set({ x: BX - 10, y: gfn(BX) + 22, s: 0.9, o: upB, armF: 40 + point * 30 + praise * 50, armB: 20 + point * 120 + praise * 20, head: -point * 16, blink: blinkAt(T, 4) });
      const bf = seg(t, 1.3, 1.7);
      const [bhx, bhy] = headAt(BX, gfn(BX) + 24, 0.88, false, 62);
      pose(band, { x: bhx - bf * 50, y: bhy + bf * bf * 110, r: -bf * 220, s: 0.88, o: see * (1 - seg(t, 1.62, 1.7)) });
      const bxBoy = kf(t, [[0.15, 290], [0.78, BX + 50], [1.0, BX + 44]]);
      boy.set({ x: bxBoy, y: gfn(BX) + 8, s: 0.6, flip: t > 0.9, walk: t > 0.15 && t < 1.0 ? bxBoy * 0.06 : undefined, armB: t < 0.8 ? 60 : 10 + marvel * 120, armF: 10 + praise * 100, blink: blinkAt(T, 8) });
      const ek = es(t, 2.3, 2.5, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(eye, { x: bhx + 20, y: bhy - 70, s: ek, o: ek > 0.02 ? 1 : 0 });

      // the mute man and his friend
      const MK = [[0.2, 1360], [0.8, MX]];
      const mx = kf(t, MK);
      const sitM = es(t, 0.82, 0.87);
      const speak = es(t, 1.54, 1.6);
      const upM = es(t, 2.08, 2.14);
      mute.set({ x: mx, y: gfn(MX) + 22, s: 0.9, flip: true, o: 1 - sitM, walk: moving(t, MK) ? mx * 0.05 : undefined, armF: 20, blink: blinkAt(T, 5) });
      muteSit.set({ x: MX, y: gfn(MX) + 24, s: 0.88, flip: true, o: sitM * (1 - speak), armF: 30, head: 6, blink: blinkAt(T, 5) });
      freeSit.set({ x: MX, y: gfn(MX) + 24, s: 0.88, flip: true, o: speak * (1 - upM), armF: 30 + es(t, 1.6, 1.8) * 60, armB: 20, head: -8, blink: blinkAt(T, 5) });
      free.set({ x: MX + 6, y: gfn(MX) + 22, s: 0.9, flip: true, o: upM, armF: 60 + Math.sin(t * 18) * 10 + praise * 40, armB: 40 + praise * 100, head: -10, blink: blinkAt(T, 5) });
      const gf = seg(t, 1.56, 1.9);
      const [mhx, mhy] = headAt(MX, gfn(MX) + 24, 0.88, true, 62);
      pose(gagEl, { x: mhx - gf * 30, y: mhy + gf * gf * 120, r: gf * 160, sx: -0.88, sy: 0.88, o: speak * (1 - seg(t, 1.8, 1.9)) });
      const fx_ = kf(t, [[0.2, 1440], [0.8, MX + 60], [1.0, MX + 50]]);
      friend.set({ x: fx_, y: gfn(MX) + 8, s: 0.86, flip: t < 0.9, walk: t > 0.2 && t < 1.0 ? fx_ * 0.05 : undefined, armF: t < 0.8 ? 50 : 10 + marvel * 80 + praise * 40, armB: praise * 140, head: marvel * -6, blink: blinkAt(T, 9) });
      const sk = es(t, 2.12, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      const [fhx, fhy] = headAt(MX + 6, gfn(MX) + 22, 0.9, true);
      pose(song, { x: fhx - 24, y: fhy - 24, s: sk, o: sk > 0.02 ? 1 : 0 });
      notes.forEach((n, i) => {
        const k = T ? (T * 0.4 + i / 4) % 1 : (i + 0.5) / 4;
        pose(n, { x: fhx - 40 - k * 60 + Math.sin(k * 6 + i) * 10, y: fhy - 40 - k * 110, r: -10 + k * 20, o: es(t, 2.15, 2.3) * Math.sin(k * PI) });
      });

      // the maimed man
      const AK = [[0.25, 1480], [0.84, AX]];
      const ax = kf(t, AK);
      const heal = es(t, 1.64, 1.7);
      maimed.set({ x: ax, y: gfn(AX) + 24, s: 0.92, flip: true, o: 1 - heal, walk: moving(t, AK) ? ax * 0.05 : undefined, armF: 6, armB: 0, head: 8, lean: 4, blink: blinkAt(T, 7) });
      const wave = Math.sin(t * 30);
      const waving = es(t, 2.05, 2.2);
      whole.set({ x: AX, y: gfn(AX) + 24, s: 0.92, flip: true, o: heal, armF: 40 + es(t, 1.72, 1.9) * 50 + waving * (40 + wave * 25) + praise * 30, armB: 30 + es(t, 1.72, 1.9) * 60 + waving * (80 - wave * 25) + praise * 30, head: -8, blink: blinkAt(T, 7) });
      const sf = seg(t, 1.66, 2.0);
      pose(slingEl, { x: AX + sf * 40, y: gfn(AX) + 24 + sf * sf * 30 - Math.sin(sf * PI) * 30, r: sf * 90, sx: -0.92, sy: 0.92, o: heal * (1 - seg(t, 1.9, 2.0)) });

      /* v30b — He heals them: His hand lifted, sparks over each in turn */
      const bless = es(t, 1.05, 1.25) * (1 - es(t, 1.95, 2.1));
      const toL = es(t, 1.1, 1.2) * (1 - es(t, 1.5, 1.6));
      jesus.set({ x: JX, y: JY, s: 0.96, flip: toL > 0.5, armF: 24 + bless * 70 + marvel * 10 + praise * 40, armB: 10 + bless * 30 + praise * 110, head: -praise * 12 + bless * 6, blink: blinkAt(T) });
      pose(glow, { x: JX, y: JY - 110, s: 0.8 + bless * 0.4 + praise * 0.3, o: 0.2 + bless * 0.6 + praise * 0.5 });
      const [jhx, jhy] = headAt(JX, JY, 0.96, false, 62);
      voice(jhx, jhy + 4, bless, T);
      [[LX, 1.38], [BX, 1.24], [MX, 1.5], [AX, 1.6]].forEach(([x, a], i) => {
        const k = bump(t, a, a + 0.5);
        pose(sparks[i], { x, y: gfn(x) - 110, s: k * 1.1, r: T ? T * 40 + i * 30 : i * 30, o: k });
      });

      /* v31b — they glorify God: hearts rise */
      hearts.forEach((h, i) => {
        const k = es(t, 3.25 + i * 0.1, 3.45 + i * 0.1, ease.back);
        const x = [LX - 40, BX, AX][i];
        pose(h, { x, y: gfn(x) - 190 - k * 20 + (T ? Math.sin(T * 2 + i) * 3 : 0), s: k, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.04 + es(t, 1.0, 1.6) * 0.04 - es(t, 2.9, 3.4) * 0.06;
      S.cam.y = 20 + es(t, 1.0, 1.6) * 10 - es(t, 2.9, 3.4) * 50;
    };
  },
};
