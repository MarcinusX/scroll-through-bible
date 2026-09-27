// J 6,45–50 — evening lamplight in the synagogue. The prophet's scroll unrolls: "They shall all be taught by God";
// soft rings of the Father's voice spread from the light above, and those who have heard it get up and come to
// Jesus. No one has seen the Father — a bank of cloud comes down and hides the light, but it opens above the Son,
// who has seen Him. Whoever believes has eternal life (a ring without end). "I am the bread of life" — the loaf of
// light again. Your fathers ate manna and died: an old sepia plate turns grey. This bread comes down from heaven,
// that whoever eats it may not die: the light comes down and a withered flower beside it blooms.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { cloud, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, folk, radiance, verseScroll, breadOfLight, hungGold, eternityRing, drawRing, heart, soulLight, glowDisc, SEPIA, mannaField, tent, headAt, kf, tr, PI } from './lib.js';

const JX = 800, FEET = 742;
const SEP = (a) => mix(a, '#c9ae86', 0.55);

export default {
  id: 'j6-taught',
  beats: [
    { v: 45, text: 'Napisane jest u Proroków: Oni wszyscy będą uczniami Boga.' },
    { v: 45, cont: true, text: 'Każdy, kto od Ojca usłyszał i nauczył się, przyjdzie do Mnie.' },
    { v: 46 },
    { v: 47 },
    { v: 48 },
    { v: 49 },
    { v: 50 },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S, { sky: ['#6f6a9c', '#d9a08f', '#f2c49a'] });
    const eve = S.layer({ par: 0, sh: 1, flat: true });
    eve.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#5a3a3a"/>`);
    const hiL = S.layer({ par: 0.3, sh: 4 });
    const rad = hiL.add(`<g><circle r="240" fill="url(#halo-glow)"/>${radiance(c, 56)}</g>`);
    const rings = [0, 1, 2].map(() => hiL.add(`<path d="${c.ribbon(c.arc(0, 0, 100, 50, 0.15, PI - 0.15, 24), 4)}" fill="${C.halo}" opacity="0"/>`));
    const gap = hiL.add(`<path d="${c.poly([[-20, 0], [20, 0], [70, 520], [-70, 520]])}" fill="#fff4d0" opacity="0"/>`);
    // the bank of cloud (v46), two halves
    const bank = (dir) => {
      const Ly = S.layer({ par: 0.32, sh: 6, pad: 600 });
      let m = `<path d="${c.poly(dir < 0 ? [[-1400, -1400], [800, -1400], [800, 250], [-1400, 250]] : [[800, -1400], [3000, -1400], [3000, 250], [800, 250]])}" fill="#e9e1d8"/>`;
      for (let i = 0; i < 6; i++) m += `<g transform="translate(${800 + dir * (70 + i * 150)} ${260 + (i % 2) * 36}) scale(1.5)">${cloud(c, 220, '#eee6dd', '#d9cfc6')}</g>`;
      Ly.add(m);
      return Ly;
    };
    const bankL = bank(-1), bankR = bank(1);

    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    const lights = cong.map(() => L.add(`<g>${soulLight(c, 8)}</g>`));
    const COME = [[330, 0], [1270, 1]].map(([x, i]) => {
      const o = folk(c, i === 0);
      return { x, i, seed: c.rr(0, 9), si: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))), st: S.puppet(L.add(person(c, o))) };
    });
    const jGlow = L.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const eRing = L.add(`<g>${eternityRing(c, 44, 4, 20)}</g>`);
    const eHeart = L.add(`<g>${heart(c, 10)}</g>`);
    I.addColumns();

    const fx = S.layer({ par: 0.6, sh: 5 });
    const V = verseScroll(c, tr(['Oni wszyscy będą', 'uczniami Boga'], ['They will all be', 'taught by God']), { w: 320, size: 22, title: tr('IZ 54,13', 'ISAIAH 54:13') });
    const scrollG = fx.add(`<g>${V.sheet}</g>`);
    const rodT = hanging(fx, V.rodTop, { x: 0, y: 0, len: 900 });
    const rodB = fx.add(`<g>${V.rodBottom}</g>`);
    const loafL = fx.add(`<g>${breadOfLight(c, 58)}</g>`);
    const word = fx.add(hungGold(c, tr('Jam jest chleb życia', 'I am the bread of life'), { size: 32 }));
    // the old sepia plate of the manna — and the fathers who died
    const plateId = S.id('mclip');
    const plateIn = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-130, -80, 260, 160), 0.4, 6), SEPIA.sky[1]);
      s.p(c.cut([[-130, 20], [-40, -10], [40, 6], [130, -6], [130, 80], [-130, 80]], 0.6, 6), SEP(C.sand2));
      let st = '';
      [[-70, 50], [-20, 58], [36, 48], [84, 58]].forEach(([x, y]) => { st += c.cut([[x - 12, y], [x - 8, y - 16], [x + 8, y - 18], [x + 12, y]], 0.4, 4); });
      s.p(st, SEP(C.rock2));
      return `<clipPath id="${plateId}"><rect x="-130" y="-80" width="260" height="160"/></clipPath><g clip-path="url(#${plateId})">${s.out()}<g transform="translate(-70 26) scale(.4)">${tent(c, { col: SEP(C.wheatRobe), stripe: SEP(C.terracotta) })}</g><g transform="translate(60 18) scale(.34)">${tent(c, { col: SEP(C.clayMantle), stripe: SEP(C.terracotta) })}</g>${mannaField(c, { x0: -130, x1: 130, y0: -80, y1: 80, n: 40, r: 2.4 })}</g>`;
    })();
    const plate = fx.add(`<g><path d="M-90 -1600V-86M90 -1600V-86" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><path d="${c.cut(c.rect(-140, -90, 280, 180), 0.5, 6)}" fill="${C.wood3}"/>${plateIn}<rect class="grey" x="-130" y="-80" width="260" height="160" fill="#6d6a66" opacity="0"/></g>`);
    const grey = plate.querySelector('.grey');
    // the flower that blooms when the bread of heaven comes down
    const pot = fx.add(`<g>${sheet().p(c.cut([[-24, 0], [24, 0], [18, 30], [-18, 30]], 0.3, 4), C.pot).out()}</g>`);
    const wither = fx.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [4, -30], [22, -40], 8), 3)}" fill="${C.olive}"/><path d="${c.cut(c.blob(24, -40, 7, 5, 8, 0.2), 0.2, 3)}" fill="${C.wood3}"/></g>`);
    const bloom = fx.add(`<g><path d="${c.ribbon([[0, 0], [0, -64]], 4)}" fill="${C.moss}"/><path d="${c.cut(c.ell(-12, -34, 12, 5, 10, -0.5), 0.2, 3) + c.cut(c.ell(12, -44, 12, 5, 10, 0.5), 0.2, 3)}" fill="${C.leaf}"/>${flowers(c, { x0: -2, x1: 2, y: -58, n: 1, h: 10 })}<path d="${c.cut(c.star(0, -70, 16, 8, 8, 0), 0.3, 3)}" fill="${C.jesusMantle}"/><path d="${c.poly(c.circ(0, -70, 5, 8))}" fill="${C.sun}"/></g>`);

    return (t, time) => {
      const T = time;
      I.flicker(T);
      eve.fade(0.16);
      /* v45a — "They shall all be taught by God" */
      const sk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 1.9, 2.05));
      const un = es(t, 0.3, 0.6);
      pose(rodT, { x: 1060, y: lerp(-500, 140, sk), o: sk > 0.01 ? 1 : 0 });
      pose(scrollG, { x: 1060, y: lerp(-500, 140, sk), sy: Math.max(0.02, un), o: sk > 0.01 ? 1 : 0 });
      pose(rodB, { x: 1060, y: lerp(-500, 140, sk) + V.h * un, o: sk > 0.01 ? 1 : 0 });
      /* the light above; v45b — the Father's voice in rings */
      const rk = es(t, 0.4, 0.8) * (1 - es(t, 2.05, 2.4) * 0.6) + es(t, 2.9, 3.2) * 0.4;
      pose(rad, { x: JX, y: 170, s: 0.8 + rk * 0.2, r: T * 3, o: Math.min(1, rk) });
      rings.forEach((r, i) => {
        const on = es(t, 1.05, 1.2) * (1 - es(t, 1.85, 2.0));
        const k = time ? (T * 0.4 + i / 3) % 1 : (i + 1) / 3.5;
        pose(r, { x: JX, y: 190 + k * 180, s: 0.6 + k * 4, sy: 0.6 + k * 2, o: on * (1 - k) });
      });
      cong.forEach((m, i) => {
        const lit = es(t, 0.6 + (i % 4) * 0.08, 0.85 + (i % 4) * 0.08);
        const [hx, hy] = headAt(m.x, m.y, m.s, m.x > JX, 62);
        pose(lights[i], { x: hx, y: hy - 40 + Math.sin(T * 1.4 + i) * 2, s: lit * 0.9, o: lit * (1 - es(t, 2.0, 2.3) * 0.5) });
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 20 + lit * 20, armB: bump(t, 1.1, 1.9) * (i % 3 ? 0 : 80), head: -lit * 8 - bump(t, 2.1, 2.9) * 6, blink: blinkAt(T, m.seed) });
      });
      COME.forEach((m) => {
        const up = es(t, 1.2 + m.i * 0.06, 1.28 + m.i * 0.06);
        const k = es(t, 1.3 + m.i * 0.06, 1.85);
        const tx = JX + (m.i ? 160 : -160);
        const x = lerp(m.x, tx, k), y = lerp(690, FEET + 10, k);
        m.si.set({ x: m.x, y: 690, s: 0.9, flip: m.x > JX, o: 1 - up, armF: 30, head: -8, blink: blinkAt(T, m.seed) });
        m.st.set({ x, y, s: 0.94, flip: tx < m.x, walk: k > 0.02 && k < 0.98 ? x * 0.06 : undefined, o: up, armF: 30 + k * 20, armB: 10, head: -6, blink: blinkAt(T, m.seed) });
      });

      /* v46 — no one has seen the Father except the One who is from God */
      const down = es(t, 2.05, 2.45, ease.out);
      const part = es(t, 2.5, 2.85);
      bankL.shift(-part * 110 * (1 - es(t, 3.9, 4.2)) - es(t, 3.9, 4.2) * 900, lerp(-800, 0, down));
      bankR.shift(part * 110 * (1 - es(t, 3.9, 4.2)) + es(t, 3.9, 4.2) * 900, lerp(-800, 0, down));
      pose(gap, { x: JX, y: 170, o: part * 0.5 * (1 - es(t, 3.9, 4.2)) });

      /* v47 — whoever believes has eternal life */
      const m0 = COME[0];
      const ek = es(t, 3.05, 3.5);
      drawRing(eRing, ek);
      pose(eRing, { x: JX - 160, y: FEET - 100, r: t * 30, o: seg(t, 3.05, 3.1) * (1 - es(t, 4.8, 5.0)) });
      const hk = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 4.8, 5.0));
      pose(eHeart, { x: JX - 156, y: FEET - 118, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v48 — I am the bread of life */
      const bk = es(t, 4.05, 4.4, ease.out) * (1 - es(t, 5.0, 5.2) * 0.4);
      pose(loafL, { x: JX, y: lerp(-300, 330, bk), s: 0.9 + Math.sin(T * 1.2) * 0.02, o: bk > 0.01 ? 1 : 0 });
      const wk = es(t, 4.2, 4.5, ease.out) * (1 - es(t, 4.95, 5.15));
      pose(word, { x: JX, y: lerp(-500, 180, wk), r: Math.sin(T * 0.8), o: wk > 0.01 ? 1 : 0 });
      pose(jGlow, { x: JX, y: FEET - 130, s: 0.8 + bk * 0.6, o: 0.25 + bk * 0.5 });

      /* v49 — your fathers ate the manna in the wilderness, and they died */
      const pk = es(t, 5.05, 5.35, ease.out);
      pose(plate, { x: 560, y: lerp(-500, 300, pk), r: Math.sin(T * 0.8) * 1, o: pk > 0.01 ? 1 : 0 });
      if (grey) grey.setAttribute('opacity', String(es(t, 5.4, 5.8) * 0.55));
      /* v50 — the bread that comes down from heaven, that whoever eats of it may not die */
      const come = es(t, 6.05, 6.5);
      pose(loafL, { x: lerp(JX, 960, come), y: lerp(330, 420, come), s: 0.9 - come * 0.3, o: bk > 0.01 ? 1 : 0 });
      const fk = es(t, 5.3, 5.5);
      pose(pot, { x: 960, y: 600, o: fk });
      const bl = es(t, 6.4, 6.7, ease.back);
      pose(wither, { x: 960, y: 600, o: fk * (1 - seg(t, 6.4, 6.5)) });
      pose(bloom, { x: 960, y: 600, sy: bl, oy: 0, o: bl > 0.01 ? 1 : 0 });

      jesus.set({ x: JX, y: FEET, s: 1.08, armF: 20 + es(t, 0.1, 0.4) * 30 + bump(t, 1.1, 1.9) * 40 + bump(t, 4.05, 4.95) * 40 + bump(t, 6.05, 6.9) * 50, armB: 10 + bump(t, 2.4, 3.0) * 120 + bump(t, 4.05, 4.95) * 100, head: -bump(t, 2.3, 3.0) * 16, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.02], [2.4, 1.02], [3.1, 1.06], [4.1, 1.04], [5.1, 1.02], [6.2, 1.06]]);
      S.cam.y = kf(t, [[0, 10], [2.4, 0], [3.1, 20], [4.1, 10], [5.1, 10], [6.2, 20]]);
    };
  },
};
