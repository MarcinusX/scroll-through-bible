// Mk 9,20–27 — the boy is brought; at the sight of Jesus the spirit throws him down (a dark flurry
// of paper scraps, kept small and restrained); "since childhood" (a cradle), "into fire and water";
// the father pleads, kneeling — "If you can?… All things are possible to him who believes." —
// "I believe; help my unbelief!" (his heart: half stone, half warm, and slowly all warm);
// Jesus rebukes the spirit, it tears away with a cry; the boy lies as if dead — Jesus takes his hand
// and raises him up.
import { C, person, CAST, blinkAt, pose, lerp, crowd, swing, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { plainSet, PLAIN_ROWS, TWELVE, LOOK, scribe, shout, bubble, speech, GLYPH, withFace, faceBits, cradle, dangerPlate, shadowShards, flecks, heart, stoneHeart, spark, arcRings, kf, plate } from './lib.js';

const PI = Math.PI;
const FEET = 690;
const JX = 760, FX = 1040;
const BOY = { head: 836, feet: 960, y: 668 };   // where he lies
const BS = 0.68;

export default {
  id: 'm9-boy',
  beats: [
    { v: 20, text: 'I przywiedli go do Niego.' },
    { v: 20, cont: true, text: 'Na widok Jezusa duch zaraz począł szarpać chłopca, tak że upadł na ziemię i tarzał się z pianą na ustach.' },
    { v: 21, text: 'Jezus zapytał ojca: «Od jak dawna to mu się zdarza?»' },
    { v: 21, cont: true, text: 'Ten zaś odrzekł: «Od dzieciństwa.' },
    { v: 22, text: 'I często wrzucał go nawet w ogień i w wodę, żeby go zgubić.' },
    { v: 22, cont: true, text: 'Lecz jeśli możesz co, zlituj się nad nami i pomóż nam!».' },
    { v: 23 },
    { v: 24 },
    { v: 25 },
    { v: 26, text: 'A on krzyknął i wyszedł wśród gwałtownych wstrząsów.' },
    { v: 26, cont: true, text: 'Chłopiec zaś pozostawał jak martwy, tak że wielu mówiło: «On umarł».' },
    { v: 27 },
  ],
  cam: { x: [0, 120], y: [-30, 40], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const set = plainSet(S);

    /* ---------- the crowd; at v25 more come running ---------- */
    const crowdL = S.layer({ par: 0.34, sh: 3 });
    const people = crowd(S, crowdL, PLAIN_ROWS);
    const runners = crowd(S, crowdL, [{ y: 632, s: 0.58, n: 8, x0: 300, x1: 1500 }]).filter((m) => Math.abs(m.x - 900) > 220);
    runners.forEach((m) => { m.from = m.x < 900 ? m.x - 700 : m.x + 700; });
    const saying = [
      { x: 520, y: 470, el: crowdL.add(`<g opacity="0">${bubble(c, tr('On umarł!', 'He is dead!'), { size: 18, tail: 1 })}</g>`) },
      { x: 1250, y: 480, el: crowdL.add(`<g opacity="0">${bubble(c, tr('Umarł…', 'Dead…'), { size: 18, tail: -1 })}</g>`) },
    ];

    /* ---------- disciples on the left, scribes on the right ---------- */
    const sideL = S.layer({ par: 0.45, sh: 4 });
    const DIS = TWELVE.slice(0, 5).map((d, i) => ({ ...d, i, x: 470 + i * 46, y: 664 + (i % 2) * 8, s: 0.86, seed: c.rr(0, 9), p: S.puppet(sideL.add(person(c, d.o))) }));
    const SCR = [0, 1].map((i) => ({ i, x: 1230 + i * 60, y: 664 + i * 8, s: 0.88, seed: c.rr(0, 9), p: S.puppet(sideL.add(scribe(c, i + 1))) }));

    /* ---------- the plates of the father's story ---------- */
    const plL = S.layer({ par: 0.1, sh: 5 });
    const cradleP = hanging(plL, plate(c, `<g transform="translate(0 26) scale(1.2)">${cradle(c, 64)}</g>`, { r: 66 }), { x: 1060, y: 250, len: 900 });
    const fireP = hanging(plL, dangerPlate(c, 'fire', 56), { x: 960, y: 250, len: 900 });
    const waterP = hanging(plL, dangerPlate(c, 'water', 56), { x: 1140, y: 262, len: 900 });

    /* ---------- the main group ---------- */
    const mainL = S.layer({ par: 0.5, sh: 5 });
    const halo = mainL.add(`<g opacity="0"><circle r="170" fill="url(#halo-glow)"/></g>`);
    // the boy: standing, and lying (the same cut-out laid down), sitting up
    const bStand = S.puppet(mainL.add(person(c, LOOK.boy)));
    const bLie = S.puppet(mainL.add(person(c, { ...LOOK.boy, eyes: 'closed' })));
    const bSit = S.puppet(mainL.add(person(c, { ...LOOK.boy, pose: 'sit' })));
    const foam = mainL.add(`<g opacity="0">${flecks(c, 5)}</g>`);
    const shards = shadowShards(c, { n: 9, r: 46, color: '#3b3148' }).map((sh) => ({ ...sh, el: mainL.add(`<g opacity="0">${sh.m}</g>`), seed: c.rr(0, 6) }));
    const cry = mainL.add(`<g opacity="0">${shout('!', { size: 30, jag: true, c, fill: '#43384d', ink: C.cream })}</g>`);
    // the father: standing, kneeling
    const fStand = S.puppet(mainL.add(withFace(person(c, LOOK.father), faceBits(c))));
    const fKneel = S.puppet(mainL.add(withFace(person(c, { ...LOOK.father, pose: 'kneel' }), faceBits(c))));
    const fParts = (p, k) => p.el.querySelector(`[data-part="${k}"]`);
    // Jesus
    const jesus = S.puppet(mainL.add(person(c, CAST.jesus)));
    const cmd = arcRings(mainL, c, { n: 3, r: 34, w: 6, color: C.haloRim, a: 0, span: 0.6 });
    const possible = mainL.add(`<g opacity="0">${spark(c, 16)}</g>`);
    const jAsk = mainL.add(`<g opacity="0">${speech(c, GLYPH.q(c), { w: 54, h: 42 })}</g>`);
    const fSays = mainL.add(`<g opacity="0">${bubble(c, tr('Od dzieciństwa…', 'From childhood…'), { size: 18, tail: -1 })}</g>`);

    // the father's heart: half stone, half warm — and at last all warm
    S.defs(`<clipPath id="${S.id('hl')}"><rect x="-60" y="-60" width="60" height="120"/></clipPath><clipPath id="${S.id('hr')}"><rect x="0" y="-60" width="60" height="120"/></clipPath>`);
    const heartEl = mainL.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)" data-k="hglow"/><g clip-path="url(#${S.id('hr')})">${heart(c, 30)}</g><g data-k="hstone" clip-path="url(#${S.id('hl')})">${stoneHeart(c, 30)}</g><g data-k="hwarm" opacity="0" clip-path="url(#${S.id('hl')})">${heart(c, 30)}</g></g>`);
    const hStone = S.$('hstone'), hWarm = S.$('hwarm'), hGlow = S.$('hglow');
    const fCry = mainL.add(`<g opacity="0">${bubble(c, [tr('Wierzę,', 'I believe.'), tr('zaradź memu niedowiarstwu!', 'Help my unbelief!')], { size: 18, tail: 1 })}</g>`);

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(140, 980, 230, 90, 14, 0.15), 1.4, 8), C.rock2).p(c.cut(c.blob(1500, 985, 210, 80, 14, 0.15), 1.4, 8), C.rock).out());

    return (t, time) => {
      const T = time;
      set.clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.3, 0.6, cl.i));

      /* phases */
      const brought = es(t, 0, 0.8);
      const down = es(t, 1.15, 1.4);                    // thrown to the ground
      const seize = es(t, 1.1, 1.3) * (1 - es(t, 2.1, 2.6)) + es(t, 9.02, 9.15) * (1 - es(t, 9.8, 9.95)) * 1.6;
      const spiritOn = es(t, 1.05, 1.3) * (1 - es(t, 9.4, 9.97));
      const out = es(t, 9.25, 9.97);                       // the spirit tears away
      const still = es(t, 9.95, 10.2);
      const rise = es(t, 11.2, 11.5);
      const standUp = es(t, 11.5, 11.57);
      const faith = es(t, 7.1, 7.6);
      const kneel = es(t, 5.05, 5.12) * (1 - es(t, 11.55, 11.62));

      /* the boy */
      const bx = lerp(1130, 890, brought);
      const lieO = es(t, 1.2, 1.26) * (1 - es(t, 11.2, 11.26));
      const shake = seize * Math.sin(T * 26) * 2.2;
      bStand.set({ x: t < 11 ? bx : 900, y: FEET + 2, s: BS, flip: true, o: t < 11 ? 1 - es(t, 1.2, 1.26) : standUp, r: t < 11 ? -down * 30 + shake : 0, walk: brought > 0 && brought < 1 ? bx * 0.07 : undefined, armF: t > 11 ? 70 : 8 + seize * 30, head: t > 11 ? -6 : 10, blink: t > 11 ? blinkAt(T, 4) : 0 });
      bLie.set({ x: BOY.feet, y: BOY.y + (1 - lieO) * -10, s: BS, r: -90 + shake * 1.5, o: lieO, armF: 20 + seize * 30 * Math.sin(T * 9), armB: 10, head: 0 });
      bSit.set({ x: 880, y: FEET + 2, s: BS, flip: true, o: es(t, 11.2, 11.26) * (1 - standUp), armF: 60 + rise * 20, head: -8, blink: blinkAt(T, 4) });
      pose(foam, { x: BOY.feet - 150 * BS, y: BOY.y - 16, s: 1, o: bump(t, 1.35, 2.1) * 0.9 });
      shards.forEach((sh) => {
        const cx = t < 1.2 ? bx - 4 : (BOY.head + BOY.feet) / 2 - 20, cy = t < 1.2 ? FEET - 90 : BOY.y - 10;
        const swirl = T * 1.6 + sh.a;
        const fly = out * (260 + sh.seed * 40);
        const r = 30 + seize * 10 + Math.sin(T * 3 + sh.seed) * 4;
        pose(sh.el, { x: cx + Math.cos(swirl) * r * 1.4 + Math.cos(sh.a) * fly, y: cy + Math.sin(swirl) * r * 0.7 + Math.sin(sh.a) * fly * 0.7 - out * 120, s: 0.7 + seize * 0.3, r: T * 40 + sh.i * 40, o: spiritOn * 0.9 * (1 - out) + (out > 0 && out < 1 ? (1 - out) * 0.9 : 0) });
      });
      pose(cry, { x: 940, y: BOY.y - 130, s: es(t, 9.05, 9.2, ease.back), o: bump(t, 9.02, 9.98) > 0.05 ? 1 : 0 });

      /* the plates: cradle, fire and water */
      const cp = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.9, 4.1));
      swing(cradleP, 1060, lerp(-1000, 250, cp), T, 1.1, 0.8, 1);
      const dp = es(t, 4.05, 4.3, ease.back) * (1 - es(t, 4.9, 5.1));
      swing(fireP, 960, lerp(-1000, 250, dp), T, 1.4, 0.9, 2);
      swing(waterP, 1140, lerp(-1000, 262, es(t, 4.15, 4.4, ease.back) * (1 - es(t, 4.9, 5.1))), T, 1.4, 0.9, 3);

      /* the father */
      const fx = lerp(1180, FX, brought);
      const talk = (t > 3 && t < 5) ? Math.sin(T * 1.8) * 0.5 + 0.5 : 0;
      const grief = es(t, 1.2, 1.5);
      const joy = es(t, 11.6, 11.9);
      fStand.set({ x: fx, y: FEET, s: 1.04, flip: true, o: 1 - kneel, walk: brought > 0 && brought < 1 ? fx * 0.06 : undefined, armF: 20 + bump(t, 1.2, 2) * 60 + talk * 30 + joy * 70, armB: 10 + bump(t, 1.2, 2) * 90 + joy * 140, head: -4 + grief * 6 * (1 - joy) - joy * 8, blink: blinkAt(T, 3) });
      const lift = es(t, 5.1, 5.5);
      fKneel.set({ x: FX, y: FEET, s: 1.04, flip: true, o: kneel, armF: 30 + lift * 70 - faith * 10, armB: 20 + lift * 110 + faith * 20, head: -12 + lift * 4 - faith * 4, lean: -lift * 4, blink: blinkAt(T, 3) });
      [fStand, fKneel].forEach((p) => { fade(fParts(p, 'sad'), grief * (1 - joy)); fade(fParts(p, 'tear'), es(t, 5.2, 5.5) * (1 - es(t, 11.5, 11.8)) + faith * 0.5); });
      pose(fSays, { x: FX - 70, y: FEET - 230, s: es(t, 3.05, 3.25, ease.back), o: bump(t, 3.02, 3.95) > 0.05 ? 1 : 0 });
      const fcy = kneel > 0.5 ? FEET - 58 : FEET - 96;
      pose(heartEl, { x: FX - 16 - kneel * 10, y: fcy, s: 0.72 + faith * 0.16 + Math.sin(T * 2.2) * 0.03 * faith, o: faith * (1 - es(t, 11.8, 12)) });
      const warmUp = es(t, 7.6, 8.3) * 0.35 + es(t, 11.3, 11.8) * 0.65;
      fade(hWarm, warmUp);
      fade(hStone, 1 - warmUp * 0.8);
      fade(hGlow, 0.4 + warmUp * 0.6);
      pose(fCry, { x: FX - 120, y: FEET - 236, s: es(t, 7.1, 7.3, ease.back), o: bump(t, 7.05, 7.97) > 0.05 ? 1 : 0 });

      /* Jesus */
      const askK = bump(t, 2.05, 2.95);
      const answer = es(t, 6.05, 6.3) * (1 - es(t, 6.9, 7.1));
      const command = es(t, 8.2, 8.5) * (1 - es(t, 9.8, 10.1));
      const bend = es(t, 10.95, 11.3) * (1 - es(t, 11.7, 12));
      jesus.set({
        x: JX + bend * 30, y: FEET, s: 1.1,
        armF: 16 + askK * 40 + answer * 40 + command * 76 + bend * 30 + es(t, 7.4, 7.8) * 30 * (1 - es(t, 8.1, 8.3)) + standUp * 40 * (1 - es(t, 11.8, 12)),
        armB: 10 + answer * 140 + command * 40 + es(t, 7.4, 7.8) * 50 * (1 - es(t, 8.1, 8.3)),
        head: -2 + bend * 12 - command * 4, lean: bend * 9, blink: blinkAt(T, 1),
      });
      pose(jAsk, { x: JX + 20, y: FEET - 226, s: es(t, 2.1, 2.3, ease.back), o: askK > 0.05 ? 1 : 0 });
      pose(possible, { x: JX + 140, y: FEET - 250 - answer * 20, s: 0.6 + answer * 1.4 + faith * 0.4 * (1 - es(t, 8, 8.4)), r: T * 12, o: Math.max(answer, faith * (1 - es(t, 8, 8.4))) });
      cmd(JX + 70, FEET - 150, command * (1 - out), T, { spread: 2.2, speed: 0.6, s0: 0.8 });
      pose(halo, { x: 870, y: FEET - 90, s: 0.8 + rise * 0.6, o: rise * (1 - es(t, 11.9, 12)) * 0.9 + faith * 0.3 * (1 - es(t, 8.2, 8.6)) });

      /* the crowd: watching, running together (v25), saying "he is dead" (v26b) */
      people.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 880, head: -6 - bump(t, 1.1, 2.2) * 6, armF: bump(t, 1.2, 2.2) * (m.i % 3 === 0 ? 90 : 0) + es(t, 11.5, 11.9) * (m.i % 4 === 0 ? 140 : 20), blink: blinkAt(T, m.seed) }));
      runners.forEach((m) => {
        const r = es(t, 8.02 + m.delay * 0.3, 8.6 + m.delay * 0.3);
        const x = lerp(m.from, m.x, r);
        m.p.set({ x, y: m.y, s: m.s, flip: m.from > m.x, o: r > 0 ? 1 : 0, walk: r > 0 && r < 1 ? x * 0.08 : undefined, armF: 40, blink: blinkAt(T, m.seed) });
      });
      saying.forEach((sy, i) => pose(sy.el, { x: sy.x, y: sy.y, s: es(t, 10.2 + i * 0.15, 10.4 + i * 0.15, ease.back), o: bump(t, 10.15 + i * 0.15, 11.05) > 0.05 ? 1 : 0 }));
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: d.s, flip: false, head: -4 + bump(t, 1.1, 2.3) * 8, armF: 10 + bump(t, 1.2, 2) * 50 + es(t, 11.6, 11.9) * 60, blink: blinkAt(T, d.seed) }));
      SCR.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, head: -6, armF: 20 + bump(t, 10.2, 11) * 40, blink: blinkAt(T, m.seed) }));

      /* camera: close on the father at his cry, wide again for the healing */
      const close = es(t, 6.9, 7.4) * (1 - es(t, 7.9, 8.4));
      S.cam.z = 1.04 + close * 0.14 + es(t, 10.9, 11.3) * 0.04;
      S.cam.x = 60 + close * 110;
      S.cam.y = 10 + close * -10;
    };
  },
};
