// Łk 1,42–45 — in the courtyard Elizabeth cries out with lifted hands: "Blessed are you among women" — a garland comes
// down over Mary and the light is on her; "and blessed is the fruit of your womb" — a little light within Mary, and a
// branch with one golden fruit. "Why is this granted me, that the mother of my Lord should come to me?" — Elizabeth kneels
// before her. "When your greeting came to my ears, the child leaped for joy" — the greeting rings into her ear, the light
// in her womb leaps with little hearts. "Blessed is she who believed" — golden words come down to Mary's heart, which glows.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import {
  MARY, ELIZABETH, HILLDAY, hillHome, homeLight, hillFront, HGY, hungGold, voiceRings, glowDisc, rayBurst, sparkle, heart, plainHeart, wordSlip, headAt,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const EX = 700, MX = 900;

/** a garland of little flowers on a string (origin: its middle) */
function garland(c, w = 260) {
  let d = '', f = '', f2 = '';
  const pts = c.qbez([-w / 2, -20], [0, 40], [w / 2, -20], 16);
  d += c.ribbon(pts, 3);
  pts.forEach(([x, y], i) => { if (i % 2) f += c.cut(c.star(x, y, 9, 5, 5, i), 0.2, 3); else f2 += c.cut(c.ell(x, y + 2, 8, 4, 8, i), 0.2, 3); });
  return `<path d="M${-w / 2} -1800V-20M${w / 2} -1800V-20" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/>` + sheet().p(d, C.moss2).p(f2, C.leaf).p(f, mix(C.blushVeil, '#fffaf0', 0.4)).out();
}
/** a branch with one golden fruit (origin: its middle) */
function fruitBranch(c) {
  const s = sheet();
  s.p(c.ribbon(c.qbez([-80, 10], [0, -20], [80, 6], 12), (u) => 5 - u * 3), C.wood2);
  let lv = '';
  [[-50, -2], [-20, -12], [30, -10], [60, 0]].forEach(([x, y], i) => { lv += c.cut(c.ell(x, y - 10, 16, 6, 10, i % 2 ? 0.5 : -0.5), 0.3, 3); });
  s.p(lv, C.leaf);
  s.p(c.cut(c.circ(6, 16, 17, 20), 0.3, 3), C.sun);
  s.p(c.cut(c.star(6, -1, 6, 3, 5, 0), 0.2, 2), C.sunDeep);
  return `<path d="M0 -1800V-12" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/><circle cx="6" cy="16" r="50" fill="url(#halo-glow)"/>${s.out()}`;
}

export default {
  id: 'lk1-blessed',
  beats: [
    { v: 42, text: 'Wydała ona okrzyk i powiedziała: «Błogosławiona jesteś między niewiastami' },
    { v: 42, cont: true, text: 'i błogosławiony jest owoc Twojego łona.' },
    { v: 43 },
    { v: 44 },
    { v: 45 },
  ],
  cam: { x: [-30, 30], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const W = hillHome(S, HILLDAY);
    const sunEl = hanging(W.hangL, sun(c, 42), { x: 1250, y: -1500, len: 800 });
    const mGlow = W.G.add(`<g>${glowDisc(180, 'halo-glow', 1)}${rayBurst(c, { n: 16, r0: 40, r1: 170, spread: 0.03, o: 0.18 })}</g>`);
    const P = W.P;
    const e = S.puppet(P.add(person(c, ELIZABETH)));
    const eK = S.puppet(P.add(person(c, { ...ELIZABETH, pose: 'kneel' })));
    const m = S.puppet(P.add(person(c, MARY)));
    const mWombG = W.G.add(`<g>${glowDisc(40, 'halo-glow', 1)}</g>`);
    const eWombG = W.G.add(`<g>${glowDisc(34, 'warm-glow', 1)}</g>`);
    const mWomb = P.add(`<g><path d="${c.poly(c.star(0, 0, 10, 3.6, 4, 0))}" fill="${C.star}"/></g>`);
    const eWomb = P.add(`<g><path d="${c.poly(c.star(0, 0, 8, 3, 4, 0))}" fill="${C.star}"/></g>`);
    const mHeart = P.add(`<g>${plainHeart(c, 11)}</g>`);
    const voiceE = voiceRings(P, c, { n: 3, color: shade(C.plumRobe, 0.2), r: 40, w: 6, both: true });
    const voiceM = voiceRings(P, c, { n: 3, color: shade(C.ochre, 0.2), r: 34, w: 5, both: true });
    const fly = S.layer({ par: 0.2, sh: 6 });
    const gar = fly.add(`<g>${garland(c)}</g>`);
    const fruit = fly.add(`<g>${fruitBranch(c)}</g>`);
    const mother = fly.add(hungGold(c, tr('Matka mojego Pana', 'the mother of my Lord'), { size: 26 }));
    const hearts = [0, 1, 2, 3].map((i) => fly.add(`<g>${plainHeart(c, 8, [C.jesusMantle, C.roseRobe][i % 2])}</g>`));
    const words = [0, 1, 2, 3, 4].map((i) => ({ i, el: fly.add(`<g>${wordSlip(c, 30)}</g>`) }));
    hillFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1250, 160, T, 1, 0.7);
      homeLight(W.H, { open: 0.9, lit: 0.4 });
      const [ehx, ehy] = headAt(EX, HGY, 0.96, false);
      const [mhx, mhy] = headAt(MX, HGY, 0.96, true);

      /* v42a: she cries out — blessed are you among women */
      const kneel = es(t, 2.05, 2.12);
      const cry = bump(t, 0.05, 1.9);
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, o: 1 - kneel, armF: 40 + cry * 50, armB: 20 + cry * 120, head: -cry * 12, blink: blinkAt(T, 1) });
      voiceE(ehx + 16, ehy + 8, bump(t, 0.1, 1.0), T, { dir: 1, spread: 3 });
      const gk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      swing(gar, MX, lerp(-1500, 330, gk), T, 1.4, 0.8);
      const lit = es(t, 0.35, 0.7);
      pose(mGlow, { x: MX, y: HGY - 130, s: 0.5 + lit * 0.6, r: t * 3, o: lit });

      /* v42b: blessed is the fruit of your womb */
      const wk = es(t, 1.1, 1.35);
      pose(mWomb, { x: MX - 14, y: HGY - 74, s: 0.5 + wk * 0.7 + bump(t, 1.1, 1.6) * 0.3, o: wk });
      pose(mWombG, { x: MX - 14, y: HGY - 74, s: 0.5 + wk * 0.7 + bump(t, 1.1, 1.6) * 0.3, o: wk });
      const fk = es(t, 1.2, 1.45, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      swing(fruit, 1070, lerp(-1500, 300, fk), T, 1.2, 0.7, 2);

      /* v43: why this — the mother of my Lord comes to me? She kneels */
      eK.set({ x: EX + 20, y: HGY, s: 0.96, flip: false, o: kneel, armF: 60 + es(t, 3.2, 3.5) * 10, armB: 40 + es(t, 4.1, 4.4) * 30, head: 12 - es(t, 3.1, 3.4) * 20, blink: blinkAt(T, 1) });
      const mk = es(t, 2.2, 2.45, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      pose(mother, { x: MX - 30, y: lerp(-1100, 330, mk), r: Math.sin(T * 0.8) * 1.2, o: mk > 0.002 ? 1 : 0 });
      m.set({ x: MX, y: HGY, s: 0.96, flip: true, armF: 20 + bump(t, 2.1, 2.9) * 40 + es(t, 4.4, 4.6) * 30, armB: 12 + es(t, 4.4, 4.6) * 20, head: 8 * es(t, 2.1, 2.3) - es(t, 4.1, 4.4) * 12, blink: blinkAt(T, 3) });

      /* v44: at your greeting the child leaped for joy */
      voiceM(mhx - 16, mhy + 8, bump(t, 3.02, 3.6), T, { dir: -1, spread: 3 });
      const leap = Math.abs(Math.sin(seg(t, 3.4, 3.95) * PI * 3)) * (t > 3.4 && t < 3.95 ? 1 : 0);
      const ew = es(t, 3.3, 3.45) * (1 - es(t, 4.8, 5));
      pose(eWomb, { x: EX + 40, y: HGY - 40 - leap * 20, s: 0.6 + ew * 0.6 + leap * 0.3, o: ew });
      pose(eWombG, { x: EX + 40, y: HGY - 40 - leap * 20, s: 0.6 + ew * 0.6 + leap * 0.3, o: ew });
      hearts.forEach((h, i) => { const kk = seg(t, 3.45 + i * 0.08, 3.95 + i * 0.08); pose(h, { x: EX + 40 + (i - 1.5) * 34, y: HGY - 70 - kk * 90, s: 0.6 + bump(t, 3.45 + i * 0.08, 3.95 + i * 0.08) * 0.6, o: bump(t, 3.45 + i * 0.08, 3.95 + i * 0.08) }); });

      /* v45: blessed is she who believed — the Lord's words come down to her heart */
      words.forEach((w) => {
        const k = es(t, 4.05 + w.i * 0.07, 4.45 + w.i * 0.07);
        pose(w.el, { x: lerp(MX - 160 + w.i * 80, MX - 6, k), y: lerp(160 + (w.i % 2) * 40, HGY - 112, k), r: (1 - k) * 18 * (w.i % 2 ? 1 : -1), s: 1 - k * 0.6, o: t > 4.02 && k < 0.98 ? 1 : 0 });
      });
      const hk = es(t, 4.5, 4.7, ease.back);
      pose(mHeart, { x: MX - 6, y: HGY - 112, s: Math.max(0.001, hk), o: hk > 0.01 ? 1 : 0 });

      S.cam.z = 1.04 + es(t, 2.0, 2.4) * 0.02;
      S.cam.y = 20;
      S.cam.x = 0;
    };
  },
};
