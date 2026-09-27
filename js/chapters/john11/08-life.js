// J 11,25–27 — the great I AM of the chapter. The warm afternoon dims to a violet, pre-dawn hush and a hillside of
// small rock tombs slides up behind Jesus. "I am the resurrection and the life": dawn breaks — a great gold sun rises
// behind Him, rays turning slowly, and the words hang in gold. "Whoever believes in Me, though he die, yet shall he
// live": one by one the stones roll from the little tombs, light pours out, and small lights rise like lanterns; seeds
// in the earth at their feet split and send up shoots. "Whoever lives and believes shall never die": the flowers open
// and a ring without end draws itself round Him. "Do you believe this?" — all grows still; He holds out His hand.
// "Yes, Lord" — Martha kneels and her heart shines. "I believe that You are the Christ, the Son of God, He who comes
// into the world" — three plates come down: the horn of anointing, the light of the Son, the world He comes to.
import { C, person, CAST, blinkAt, sky, attr } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { band, hillsWith, grass, olive, cypress, house } from '../../assets/nature.js';
import { tomb } from '../mark5/lib.js';
import { goldWord } from '../john1/lib.js';
import { iAm } from '../john8/lib.js';
import {
  WARM, PREDAWN, DAWN, DISC, martha, radiance, rayBurst, soulLight, flowerGrow, growFlower, eternityRing, drawRing, heart, question, oilHorn, globe,
  hungPlate, strip, hang2, vis, kf, pose, sheet, shade, mix, lerp, tr, PI,
} from './lib.js';

const F = 712;

export default {
  id: 'j11-life',
  beats: [
    { v: 25, text: 'Rzekł do niej Jezus:' },
    { v: 25, cont: true, text: '«Ja jestem zmartwychwstaniem i życiem.' },
    { v: 25, cont: true, text: 'Kto we Mnie wierzy, choćby i umarł, żyć będzie.' },
    { v: 26, text: 'Każdy, kto żyje i wierzy we Mnie, nie umrze na wieki.' },
    { v: 26, cont: true, text: 'Wierzysz w to?»' },
    { v: 27, text: 'Odpowiedziała Mu: «Tak, Panie!' },
    { v: 27, cont: true, text: 'Ja mocno wierzę, żeś Ty jest Mesjasz, Syn Boży, który miał przyjść na świat».' },
  ],
  cam: { x: [-40, 60], y: [-100, 30], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const sk = sky(S, WARM);
    /* the rising sun of the resurrection morning */
    const dawnL = S.layer({ par: 0.04, sh: 1 });
    const rays = dawnL.add(`<g>${rayBurst(c, { n: 20, r0: 90, r1: 900, spread: 0.045, o: 0.5 })}</g>`);
    const sunG = dawnL.add(`<g><circle r="330" fill="url(#halo-glow)"/>${radiance(c, 110)}</g>`);
    const far = S.layer({ par: 0.08, sh: 2 });
    const f1 = band(c, { y: 486, amps: [16, 7, 3], lens: [900, 300, 120], color: mix(C.hillFar, C.duskViolet, 0.3) });
    far.add(f1.markup);
    /* the hillside of tombs (slides up) */
    const tl = S.layer({ par: 0.18, sh: 3, pad: 260 });
    const h1 = band(c, { y: 540, amps: [12, 5, 2], lens: [700, 240, 90], color: mix(C.hillMid, C.rock, 0.35) });
    const TB = [[395, 50], [505, 44], [612, 54], [995, 52], [1105, 46], [1215, 56]].map(([x, w], i) => ({ i, x, w, h: w * 1.2, y: h1.fn(x) + 18 + (i % 2) * 10 }));
    tl.add(h1.markup + TB.map((b) => `<g transform="translate(${b.x} ${b.y})">${tomb(c, b.w, b.h, { stone: false, face: mix(C.rock, C.rock2, 0.4) })}</g>`).join('') + olive(c, 700, h1.fn(700) + 20, 0.55) + cypress(c, 880, h1.fn(880) + 16, 90));
    TB.forEach((b) => {
      const dw = b.w / 2, dh = b.h * 0.62;
      b.glow = tl.add(`<g opacity="0"><circle cy="${-b.h * 0.4}" r="${b.w * 1.4}" fill="url(#halo-glow)"/><path d="${c.cut([[-dw, 2], [-dw, -dh], ...c.arc(0, -dh, dw, b.h * 0.38, PI, 2 * PI, 10), [dw, -dh], [dw, 2]], 0.4, 5)}" fill="${C.lampGlow}"/></g>`);
      b.stone = tl.add(`<g>${sheet().p(c.cut(c.circ(0, 0, b.w * 0.56, 20), 0.8, 5), shade(C.rock2, 0.06)).x(c.ribbon(c.arc(0, 0, b.w * 0.4, b.w * 0.4, PI * 1.1, PI * 1.6, 6), 2), shade(C.rock2, -0.2), 'opacity=".6"').out()}</g>`);
      b.soul = tl.add(`<g>${soulLight(c, 10)}</g>`);
    });
    /* the near ground */
    const ground = S.layer({ par: 0.4, sh: 3 });
    const g1 = band(c, { y: 648, amps: [5, 2], lens: [600, 200], color: mix(C.hillNear, C.sand, 0.35) });
    ground.add(g1.markup + grass(c, { x0: -800, x1: 2400, y: 648, fn: g1.fn, n: 40, h: 14, color: C.moss }));
    const dim = S.layer({ par: 0.42, sh: 0, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".38"/>`);
    const glowL = S.layer({ par: 0.46, sh: 0, flat: true });
    const jGlow = glowL.add(`<g><circle r="300" fill="url(#halo-glow)"/></g>`);
    const ringL = S.layer({ par: 0.48, sh: 2 });
    const ring = ringL.add(`<g><circle r="210" fill="url(#halo-glow)" opacity=".5"/>${eternityRing(c, 180, 8, 30)}</g>`);

    const A = S.layer({ par: 0.52, sh: 5 });
    const DP = [[600, F - 2], [530, F + 10], [470, F - 4], [410, F + 8]];
    const disc = DP.map(([x, y], i) => ({ i, x, y, p: S.puppet(A.add(person(c, DISC[[0, 3, 1, 5][i]]))) }));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const mStand = S.puppet(A.add(martha(c)));
    const mKneel = S.puppet(A.add(martha(c, { pose: 'kneel' })));
    /* seeds → flowers at the front */
    const seedL = S.layer({ par: 0.56, sh: 3 });
    const FX = [395, 455, 520, 585, 655, 945, 1010, 1080, 1150, 1215];
    const COLS = [C.jesusMantle, C.lavender, C.cream, C.wheat, C.roseRobe];
    const fl = FX.map((x, i) => ({ i, x, h: 60 + (i % 3) * 16, el: seedL.add(`<g>${flowerGrow(c, 60 + (i % 3) * 16, COLS[i % COLS.length])}</g>`) }));
    fl.forEach((f) => pose(f.el, { x: f.x, y: 752 + (f.i % 2) * 10 }));

    const X = S.layer({ par: 0.58, sh: 6 });
    const am = X.add(`<g>${hang2(iAm(c, tr('JA JESTEM', 'I AM'), { size: 36 }), 90, 300)}</g>`);
    const rl = X.add(`<g>${hang2(goldWord(c, tr('zmartwychwstaniem i życiem', 'the resurrection and the life'), { size: 24 }), 110, 300)}</g>`);
    const q = X.add(`<g>${question(c)}</g>`);
    const mHeart = X.add(`<g>${heart(c, 16, C.jesusMantle)}</g>`);
    const titles = [
      [`<g transform="translate(-34 22) scale(1.2)">${oilHorn(c)}</g><path d="${c.cut([[40, -26], [44, -16], [40, -12], [36, -16]], 0.1, 2)}" fill="${C.ochre}"/><path d="${c.cut([[42, -4], [45, 4], [42, 7], [39, 4]], 0.1, 2)}" fill="${C.ochre}"/>`, tr('Mesjasz', 'the Christ'), 610, 330],
      [`${radiance(c, 30)}`, tr('Syn Boży', "God's Son"), 800, 280],
      [`${globe(c, 34)}`, [tr('który miał przyjść', 'who comes'), tr('na świat', 'into the world')], 990, 330],
    ].map(([icon, word, x, y], i) => ({ i, x, y, el: X.add(`<g>${hungPlate(c, icon, { r: 50, fill: i === 0 ? mix(C.skyBlue, C.teal2, 0.35) : i === 1 ? C.cream : mix(C.skyBlue, C.cream, 0.4) })}</g>`), w: X.add(`<g>${Array.isArray(word) ? `<g transform="translate(0 -12)">${strip(c, word[0], { size: 15 })}</g><g transform="translate(0 12)">${strip(c, word[1], { size: 15 })}</g>` : strip(c, word, { size: 17 })}</g>`) }));

    return (t, time) => {
      const T = time;
      /* the light: warm → pre-dawn hush → dawn */
      const hush = es(t, 0.3, 0.9);
      const dawn = es(t, 1.05, 1.7);
      const calm = es(t, 4.05, 4.4) * (1 - es(t, 5.9, 6.3));
      const pre = hush * (1 - dawn);
      sk.set(...[0, 1, 2].map((j) => mix(mix(WARM[j], PREDAWN[j], pre), DAWN[j], dawn)));
      dim.fade(pre * 1 + calm * 0.7);
      const sy = lerp(720, 380, es(t, 1.05, 2.0, ease.out));
      vis(sunG, { x: 800, y: sy, s: 1 + Math.sin(T * 0.8) * 0.01, o: dawn });
      vis(rays, { x: 800, y: sy, r: T * 1.2, o: dawn * (1 - calm * 0.6) });
      vis(jGlow, { x: 800, y: 540, s: 0.8 + dawn * 0.4, o: 0.2 + dawn * 0.5 + calm * 0.3 });

      /* the hill of tombs slides up */
      const hk = es(t, 0.25, 0.95, ease.out);
      tl.shift(0, (1 - hk) * 240);
      tl.fade(hk);
      TB.forEach((b) => {
        const open = es(t, 2.05 + b.i * 0.08, 2.4 + b.i * 0.08, ease.io);
        pose(b.stone, { x: b.x + open * b.w * 1.05, y: b.y - b.w * 0.56 + 2, r: open * 160 });
        attr(b.glow, 'opacity', open);
        pose(b.glow, { x: b.x, y: b.y });
        const rise = es(t, 2.3 + b.i * 0.08, 2.95 + b.i * 0.08, ease.out);
        const hov = Math.sin(T * 1.2 + b.i) * 6;
        vis(b.soul, { x: b.x + Math.sin(T * 0.7 + b.i) * 8 * rise, y: b.y - b.h * 0.4 - rise * (110 + (b.i % 3) * 30) + hov * rise, s: 0.6 + rise * 0.6, o: rise * (1 - calm * 0.4) });
      });

      /* seeds sprout (v25c) and bloom (v26a) */
      fl.forEach((f) => growFlower(f.el, es(t, 2.2 + f.i * 0.04, 2.9 + f.i * 0.04) * 0.55 + es(t, 3.05 + f.i * 0.04, 3.55 + f.i * 0.04) * 0.45, f.h));

      /* the ring without end */
      const rk = es(t, 3.1, 3.75);
      drawRing(ring, rk);
      vis(ring, { x: 800, y: 560, r: T * 3, o: rk > 0 ? 1 - es(t, 4.0, 4.35) : 0 });

      /* the words of the I AM */
      const ak = es(t, 1.1, 1.45, ease.out) * (1 - es(t, 3.95, 4.25));
      vis(am, { x: 800, y: 200 - (1 - ak) * 420, r: Math.sin(T * 0.6) * 0.8, o: ak > 0.01 ? 1 : 0 });
      const bk = es(t, 1.3, 1.65, ease.out) * (1 - es(t, 3.95, 4.25));
      vis(rl, { x: 800, y: 272 - (1 - bk) * 420, r: Math.sin(T * 0.7 + 1) * 0.8, o: bk > 0.01 ? 1 : 0 });

      /* Jesus and Martha */
      const speak = es(t, 0.1, 0.4);
      const offer = es(t, 4.1, 4.45) * (1 - es(t, 5.9, 6.2));
      jesus.set({ x: 800, y: F, s: 1.06, armF: 20 + speak * 20 + bump(t, 1.1, 1.9) * 40 + offer * 40, armB: 10 + bump(t, 1.1, 2.0) * 90 + bump(t, 3.05, 3.9) * 60, head: bump(t, 1.1, 1.9) * -6 + offer * 6, blink: blinkAt(T, 1) });
      const kneel = seg(t, 5.05, 5.12);
      mStand.set({ x: 930, y: F + 4, s: 0.98, flip: true, armF: 20 + bump(t, 1.1, 2.0) * 20, armB: 10, head: -dawn * 6 + bump(t, 2.1, 3.5) * -4 + calm * 6, blink: blinkAt(T, 2), o: 1 - kneel });
      mKneel.set({ x: 920, y: F + 4, s: 0.98, flip: true, armF: 60 + es(t, 6.05, 6.4) * 30, armB: 40, head: -8, lean: -4, blink: blinkAt(T, 2), o: kneel });
      const qk = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.1));
      vis(q, { x: 868, y: 470 + Math.sin(T * 2) * 3, s: qk * 1.3, o: qk > 0.01 ? 1 : 0 });
      const hk2 = es(t, 5.2, 5.5, ease.back);
      vis(mHeart, { x: 920 - 2, y: F + 4 - 110, s: hk2 * (1 + Math.sin(T * 3) * 0.05), o: hk2 > 0.01 ? 1 : 0 });
      disc.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.9, armF: 10 + dawn * 20 * (1 - calm), armB: 6, head: -dawn * 8 + calm * 6, blink: blinkAt(T, d.i + 4) }));

      /* v27b — the Christ, the Son of God, He who comes into the world */
      titles.forEach((p) => {
        const k = es(t, 6.05 + p.i * 0.14, 6.4 + p.i * 0.14, ease.back);
        const y = p.y - (1 - k) * 480;
        vis(p.el, { x: p.x, y, r: Math.sin(T * 0.8 + p.i) * 1.5, o: k > 0.01 ? 1 : 0 });
        vis(p.w, { x: p.x, y: y + (p.i === 2 ? 84 : 72), o: k > 0.01 ? es(t, 6.3 + p.i * 0.14, 6.45 + p.i * 0.14) : 0 });
      });

      S.cam.x = kf(t, [[0, 40], [1, 0], [2, 0], [3, 0], [4, 30], [5, 50], [6, 40], [7, 0]]);
      S.cam.y = kf(t, [[0, 0], [1, -60], [2, -80], [3, -40], [4, -20], [5, 0], [6, 0], [7, -60]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.0], [2, 1.0], [3, 1.02], [4, 1.1], [5, 1.14], [6, 1.1], [7, 1.0]]);
    };
  },
};

