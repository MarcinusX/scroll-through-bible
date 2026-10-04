// Mk 5,25–29 — in the pressing crowd, a woman with a little grey rain-cloud over her head: twelve years of
// illness (twelve moons on a string), physician after physician with their jars, her purse emptied coin by
// coin, and she only grew worse. She hears of Jesus, creeps up behind Him through the crowd and touches His
// cloak — a warm spark runs into her hand, the rain stops, and she feels in her body that she is healed.
import { C, person, CAST, crowd, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, kf, streetSet, bubble, thinkBubble, sorrowCloud, purse, jar, coin, spark, heart, tag, townsfolk } from './lib.js';

const PI = Math.PI;
const FEET = 722, WX0 = 470;

export default {
  id: 'm5-woman',
  beats: [
    { v: 25 },
    { v: 26, text: 'i całe swe mienie wydała,' },
    { v: 26, cont: true, text: 'a nic jej nie pomogło, lecz miała się jeszcze gorzej.' },
    { v: 27, text: 'Słyszała ona o Jezusie,' },
    { v: 27, cont: true, text: 'więc przyszła od tyłu, między tłumem, i dotknęła się Jego płaszcza.' },
    { v: 28 },
    { v: 29, text: 'Zaraz też ustał jej krwotok' },
    { v: 29, cont: true, text: 'i poczuła w ciele, że jest uzdrowiona z dolegliwości.' },
  ],
  cam: { x: [-220, 60], y: [-40, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    // phone: she and her physicians stand a step in and the camera starts further left, so none of them
    // is cut by the frame (the third one stood off-screen)
    const P = S.portrait, WX = P ? 540 : WX0;
    const SKY = ['#c6dcdb', '#eee6cc', '#f6e9cf'];
    const set = streetSet(S, { skyCols: SKY });

    /* ---------- the crowd around Jesus (back rows) ---------- */
    const crowdL = S.layer({ par: 0.45, sh: 3 });
    const back = crowd(S, crowdL, [
      { y: 648, s: 0.7, n: 11, x0: 560, x1: 1320 },
      { y: 672, s: 0.8, n: 8, x0: 600, x1: 1300 },
    ]);

    /* ---------- Jesus, Jairus, the disciples, the front of the crowd ---------- */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const john = S.puppet(pL.add(person(c, { ...CAST.john })));
    const jairus = S.puppet(pL.add(person(c, { ...LOOK.jairus })));
    const peter = S.puppet(pL.add(person(c, { ...CAST.peter })));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const hem = pL.add(`<g>${spark(c, 10)}</g>`);
    const FRONT = [[640, 0.94, 0], [700, 0.96, 1], [1060, 0.96, 0], [1150, 0.92, 1], [1230, 0.9, 0]].map(([x, s, k], i) => ({ i, x, s, k, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, townsfolk(c, i === 0 ? { hairStyle: 'veil', beard: 'none', veil: C.blushVeil } : {})))) }));

    /* ---------- the woman, the physicians ---------- */
    const wL = S.layer({ par: 0.55, sh: 5 });
    const DOC = [
      { from: 120, x: P ? 462 : 360, dir: 1, jar: C.skyVeil },
      { from: 900, x: P ? 625 : 590, dir: -1, jar: C.sage2 },
      { from: -60, x: P ? 402 : 300, dir: 1, jar: C.blushVeil },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(wL.add(person(c, { ...LOOK.doctor, robe: [C.parchment, C.linen2, C.stone][i], mantle: [C.teal2, shade(C.plumRobe, -0.15), C.clayMantle][i], beard: i === 1 ? 'short' : 'full', holdF: `<g transform="translate(0 6)">${jar(c, d.jar)}</g>` }))) }));
    const purseMark = `<g class="pfull">${purse(c, 1)}</g><g class="pempty" opacity="0">${purse(c, 0.05)}</g>`;
    const ill = S.puppet(wL.add(person(c, { ...LOOK.ill, holdF: purseMark })));
    const pFull = ill.el.querySelector('.pfull'), pEmpty = ill.el.querySelector('.pempty');
    const illK = S.puppet(wL.add(person(c, { ...LOOK.ill, pose: 'kneel' })));
    const wellK = S.puppet(wL.add(person(c, { ...LOOK.well, pose: 'kneel' })));
    const coins = Array.from({ length: 7 }, (_, i) => ({ i, el: wL.add(`<g>${coin(c, 7)}</g>`), to: i % 3 }));
    const glowW = wL.add(`<circle r="120" fill="url(#warm-glow)"/>`);
    const inner = wL.add(`<g>${heart(c, 10)}</g>`);

    /* ---------- words, the cloud, the twelve moons ---------- */
    const tL = S.layer({ par: 0.55, sh: 4 });
    const cloudEl = hanging(tL, sorrowCloud(c, 90), { x: WX, y: 380, len: 700 });
    const drops = Array.from(cloudEl.querySelectorAll('.drop'));
    const sunny = tL.add(`<g>${spark(c, 16)}</g>`);
    const years = tL.add(`<g>${tag(c, tr('12 lat', '12 years'), { size: 22, w: 110 })}</g>`);
    const moons = Array.from({ length: 12 }, (_, i) => tL.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 7, 12), 0.2, 3), C.moon).p(c.cut(c.circ(3, -1, 6, 12), 0.2, 3), mix(C.stone2, C.storm, 0.25)).out()}</g>`));
    const heard = tL.add(`<g>${bubble(c, [tr('Jezus uzdrawia chorych!', 'Jesus heals the sick!')], { size: 19, dir: 1 })}</g>`);
    const think = tL.add(`<g>${thinkBubble(c, [tr('Żebym się choć Jego płaszcza', 'If I just touch His clothes,'), tr('dotknęła, a będę zdrowa!', 'I will be made well!')], { size: 18, dir: -1 })}</g>`);
    const shake = [0, 1, 2].map(() => tL.add(`<path d="${c.ribbon(c.arc(0, 0, 12, 6, PI * 1.1, PI * 1.9, 6), 2)}" fill="${C.inkSoft}"/>`));

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 1420, 960, 260, 100, C.rock2) + rock(c, 180, 975, 220, 80, C.rock));

    return (t, time) => {
      const T = time;
      set.update(t, T);
      set.sk.blend(SKY, ['#cfe1dc', '#f2e9cf', '#f8edd6'], seg(t, 0, 8));

      /* Jesus & those around Him move slowly along the street, and stop when she touches Him */
      const walkK = es(t, 0, 4.7, (u) => u);
      const jx = 800 + walkK * 70;
      const moving = t < 4.7;
      jesus.set({ x: jx, y: FEET, s: 1, flip: false, walk: moving ? jx * 0.12 : undefined, amt: 0.6, armF: 12, armB: 8, head: 2, blink: blinkAt(T) });
      jairus.set({ x: jx + 130, y: FEET - 4, s: 0.98, flip: false, walk: moving ? jx * 0.12 + 1 : undefined, amt: 0.6, armF: 30, armB: 10, head: -2, blink: blinkAt(T, 5) });
      peter.set({ x: jx + 72, y: FEET - 20, s: 0.94, flip: false, walk: moving ? jx * 0.12 + 2 : undefined, amt: 0.6, armF: 14, blink: blinkAt(T, 6) });
      john.set({ x: jx - 30, y: FEET - 28, s: 0.92, flip: false, walk: moving ? jx * 0.12 + 3 : undefined, amt: 0.6, armF: 10, blink: blinkAt(T, 7) });
      back.forEach((m) => m.p.set({ x: m.x + walkK * 70, y: m.y, s: m.s, flip: false, walk: moving ? m.x * 0.1 + t * 8 : undefined, amt: 0.5, blink: blinkAt(T, m.seed) }));
      const partK = bump(t, 4.0, 4.7);
      FRONT.forEach((f) => f.p.set({ x: f.x + walkK * 70 + (f.i < 2 ? -partK * (f.i ? 12 : 30) : 0), y: FEET + 10 + f.k * 6, s: f.s, flip: f.i === 0 ? t > 2.9 && t < 3.9 : false, walk: moving ? f.x * 0.1 + t * 8 : undefined, amt: 0.5, armF: f.i === 0 ? bump(t, 3.0, 3.9) * 70 : 10, armB: f.i === 0 ? bump(t, 3.0, 3.9) * 30 : 6, blink: blinkAt(T, f.seed) }));

      /* v25–26 — the woman, the twelve years, the physicians, the purse */
      const stoop = es(t, 2.1, 2.8);
      const hear = es(t, 3.05, 3.4);
      const goX = kf(t, [[4.02, WX], [4.45, jx - 96]], (u) => u);
      const down = es(t, 4.44, 4.5);
      const cured = es(t, 7.05, 7.12);
      ill.set({
        x: goX, y: FEET + 6, s: 0.96, flip: false, o: 1 - down,
        walk: t > 4.02 && t < 4.45 ? goX * 0.08 : undefined,
        armF: 20 + bump(t, 1.05, 1.9) * 50 - stoop * 10 + hear * 30, armB: 8 + hear * 20,
        lean: 4 + stoop * 12 - hear * 8, head: 6 + stoop * 14 - hear * 16, blink: blinkAt(T, 2),
      });
      fade(pFull, 1 - es(t, 1.2, 1.9));
      fade(pEmpty, es(t, 1.2, 1.9));
      const reach = es(t, 4.5, 4.85);
      const lift = es(t, 6.05, 6.4);
      illK.set({ x: jx - 96, y: FEET + 6, s: 0.96, flip: false, o: down * (1 - cured), armF: 20 + reach * 62 - lift * 10, armB: 10, lean: 16 - reach * 4 - lift * 6, head: 10 - reach * 6 - lift * 10, blink: blinkAt(T, 2) });
      wellK.set({ x: jx - 96, y: FEET + 6, s: 0.96, flip: false, o: cured, armF: 72 - es(t, 7.2, 7.7) * 30, armB: 10 + es(t, 7.2, 7.7) * 60, lean: 6 - es(t, 7.1, 7.6) * 8, head: -es(t, 7.1, 7.6) * 10, blink: blinkAt(T, 2) });

      DOC.forEach((d) => {
        const come = seg(t, 0.4 + d.i * 0.12, 0.8 + d.i * 0.12);
        const leave = es(t, 2.3 + d.i * 0.08, 2.9 + d.i * 0.08, (u) => u);
        const x = lerp(d.from, d.x, ease.out(come)) - d.dir * leave * 500;
        d.p.set({
          x, y: FEET + 4 - d.i * 10, s: 0.94 - d.i * 0.04, flip: leave > 0 ? d.dir > 0 : d.dir < 0, o: seg(t, 0.38 + d.i * 0.12, 0.45 + d.i * 0.12) * (1 - seg(t, 2.8, 2.95)),
          walk: (come > 0 && come < 1) || leave > 0 ? x * 0.06 : undefined,
          armF: 40 + bump(t, 0.9 + d.i * 0.1, 1.3 + d.i * 0.1) * 40 + bump(t, 1.2, 1.95) * 30, armB: 10 + bump(t, 2.05, 2.4) * 60,
          head: bump(t, 2.05, 2.4) * Math.sin(t * 40) * 10, blink: blinkAt(T, d.seed),
        });
      });
      shake.forEach((s, i) => {
        const d = DOC[i];
        const k = bump(t, 2.05, 2.4);
        pose(s, { x: d.x + (d.dir > 0 ? 2 : -2) + 1, y: FEET - 10 * d.i - 190 * (0.94 - d.i * 0.04), s: 1 + Math.sin(t * 40) * 0.2, o: k });
      });
      coins.forEach((cn) => {
        const k = seg(t, 1.2 + cn.i * 0.09, 1.5 + cn.i * 0.09);
        const d = DOC[cn.to];
        const x0 = WX + 30, y0 = FEET - 90, x1 = d.x + d.dir * 30, y1 = FEET - 100 - d.i * 10;
        pose(cn.el, { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(k * PI) * 70, r: k * 360, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* the twelve years: a tag and twelve pale moons */
      const tagK = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.2));
      pose(years, { x: WX + 170, y: 292 - (1 - tagK) * 40, s: 1, o: tagK });
      moons.forEach((m, i) => {
        const k = es(t, 0.15 + i * 0.045, 0.25 + i * 0.045, ease.back) * (1 - es(t, 1.0, 1.2));
        pose(m, { x: WX + 60 + (i % 6) * 44, y: 372 + Math.floor(i / 6) * 28, s: k * 1.2, o: k > 0.02 ? 1 : 0 });
      });

      /* the grey cloud rains on her — until the power goes out of Him */
      const cx = t < 4.45 ? goX : jx - 96;
      const cy = 380 + es(t, 4.44, 4.6) * 30 - es(t, 7.05, 7.6) * 1400;
      swing(cloudEl, cx + 10, cy, T, 1.2, 0.8);
      const rain = 1 - es(t, 6.05, 6.3);
      drops.forEach((d, i) => {
        const k = rain > 0 ? ((T * 0.9 + i / drops.length) % 1) : 0;
        pose(d, { x: -30 + i * 15, y: 10 + k * 70, o: rain * (1 - k) * seg(t, 0.02, 0.2) });
      });
      pose(sunny, { x: jx - 90, y: 460 - es(t, 7.1, 7.5) * 30, s: es(t, 7.1, 7.5, ease.back) * (1 + (t > 7.1 ? Math.sin(T * 2) * 0.06 : 0)), r: t > 7.1 ? T * 10 : 0, o: es(t, 7.1, 7.3) });

      /* v27 — she hears of Jesus */
      const hk = es(t, 3.08, 3.28, ease.back) * (1 - es(t, 3.85, 4.0));
      pose(heard, { x: 630, y: FEET - 196, s: hk, o: hk > 0.02 ? 1 : 0 });
      /* v28 — what she said to herself */
      const tk = es(t, 5.08, 5.3, ease.back) * (1 - es(t, 5.9, 6.05));
      pose(think, { x: jx - 120, y: FEET - 160, s: tk, o: tk > 0.02 ? 1 : 0 });

      /* v29 — the power: a spark from His cloak into her hand, warmth through her */
      const sp = es(t, 6.05, 6.5);
      const hx = jx - 38, hy = FEET - 44;
      pose(hem, { x: lerp(hx, jx - 50, sp), y: lerp(hy, FEET - 60, sp), s: bump(t, 4.75, 7.0) * (0.8 + (t > 4.75 && t < 7 ? Math.sin(T * 6) * 0.1 : 0)), r: t > 4.75 && t < 7 ? T * 20 : 0, o: bump(t, 4.75, 7.0) });
      pose(glowW, { x: jx - 96, y: FEET - 90, s: 0.6 + es(t, 6.2, 7.6) * 0.8, o: es(t, 6.2, 6.6) * 0.8 * (1 - es(t, 7.7, 8) * 0.4) });
      const hk2 = es(t, 7.1, 7.4, ease.back);
      pose(inner, { x: jx - 88, y: FEET - 110, s: hk2, o: hk2 > 0.02 ? 1 : 0 });

      /* camera: with her at first, then over to Him */
      const toHim = es(t, 3.85, 4.6);
      S.cam.x = (P ? -220 + toHim * 230 : -190 + toHim * 200) + es(t, 7.2, 7.9) * -30;
      S.cam.y = 20 + bump(t, 0, 3.9) * 10 + es(t, 4.5, 5.2) * 30;
      S.cam.z = 1.06 + es(t, 4.5, 5.2) * 0.1 - es(t, 7.2, 7.9) * 0.06;
    };
  },
};
