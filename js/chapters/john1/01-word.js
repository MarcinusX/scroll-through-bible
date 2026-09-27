// J 1,1–2 — In the beginning: the curtains open on darkness; a single spark becomes a flame — the Word;
// the Word faces a great round light (God — never a figure), then shines with the very same light;
// a ring without end draws itself around them: "in the beginning with God".
import { C, pose, lerp, sky, curtains, sheet, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { VOID, wordFlame, glowDisc, rayBurst, radiance, eternityRing, drawRing, hungGold, PI } from './lib.js';

export default {
  id: 'j1-word',
  beats: [
    { cover: true },
    { v: 1, text: 'Na początku było Słowo,' },
    { v: 1, cont: true, text: 'a Słowo było u Boga,' },
    { v: 1, cont: true, text: 'i Bogiem było Słowo.' },
    { v: 2 },
  ],
  cam: { x: [-20, 20], y: [-30, 30], z: [0.96, 1.18] },
  build(S) {
    const c = S.c;
    const sk = sky(S, VOID);

    /* ---------- the formless dark: drifting sheets of night paper ---------- */
    const mists = [0, 1, 2].map((i) => {
      const L = S.layer({ par: 0.05 + i * 0.12, sh: 3 + i, pad: 160 });
      const col = mix(VOID[1], '#3a3f72', 0.25 + i * 0.12);
      const s = sheet();
      const y0 = 250 + i * 190;
      const pts = [];
      for (let x = -1300; x <= 2900; x += 60) pts.push([x, y0 + Math.sin(x / (230 + i * 60) + i) * (30 + i * 10) + c.rr(-6, 6)]);
      const top = pts.map(([x, y]) => [x, y]);
      s.p(c.poly([...top, [2900, y0 + 80 + i * 30], ...top.slice().reverse().map(([x, y]) => [x, y + 70 + i * 26 + Math.sin(x / 140) * 14])]), col);
      L.add(s.out());
      return L;
    });

    /* ---------- the light of God (right) and the Word (a flame) ---------- */
    const glowL = S.layer({ par: 0, sh: 1, flat: true });
    const godGlow = glowL.add(`<g>${glowDisc(420, 'halo-glow', 1)}</g>`);
    const godRays = glowL.add(`<g>${rayBurst(c, { n: 30, r0: 60, r1: 720, spread: 0.028, o: 0.3 })}</g>`);
    const wordGlow = glowL.add(`<g>${glowDisc(300, 'warm-glow', 1)}</g>`);
    const wordRays = glowL.add(`<g>${rayBurst(c, { n: 16, r0: 30, r1: 420, spread: 0.035, color: '#ffe7a8', o: 0.38 })}</g>`);
    const bridge = glowL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [190, -70], [380, 0], 24), (u) => 18 + Math.sin(u * PI) * 16)}" fill="#fff1c4" opacity=".55"/><path d="${c.ribbon(c.qbez([0, 0], [190, -60], [380, 0], 24), (u) => 5 + Math.sin(u * PI) * 5)}" fill="#fffaf0" opacity=".9"/></g>`);

    /* ---------- the words on strings ---------- */
    const tagL = S.layer({ par: 0, sh: 6 });
    const wordTag = tagL.add(hungGold(c, tr('Słowo', 'the Word'), { size: 30 }));
    const godTag = tagL.add(hungGold(c, tr('Bóg', 'God'), { size: 30 }));
    const begTag = tagL.add(hungGold(c, tr('na początku', 'in the beginning'), { size: 24 }));

    const lightL = S.layer({ par: 0, sh: 5 });
    const god = lightL.add(`<g>${radiance(c, 118)}</g>`);
    const ringEl = lightL.add(`<g>${eternityRing(c, 250, 9, 30)}</g>`);
    const spark = lightL.add(`<g><path d="${c.poly(c.star(0, 0, 18, 3.5, 4, 0))}" fill="${C.star}"/><path d="${c.poly(c.star(0, 0, 9, 2, 4, PI / 4))}" fill="${C.star}"/></g>`);
    const flameEl = lightL.add(`<g>${wordFlame(c, 118)}</g>`);

    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);
      mists.forEach((L, i) => L.shift(Math.sin(time * 0.05 + i * 2) * 60 * (i + 1) * 0.5, Math.sin(time * 0.07 + i) * 6));
      sk.blend(VOID, ['#171a3b', '#232752', '#2f3462'], es(t, 1.2, 3.8) * 0.8);

      /* v1a: a spark in the void becomes the flame of the Word */
      const sp = es(t, 1.02, 1.3, ease.out);
      const born = es(t, 1.2, 1.6, ease.back);
      /* v1b: the Word with God — face to face */
      const withG = es(t, 2.05, 2.55);
      /* v1c: and the Word was God — one light */
      const one = es(t, 3.05, 3.55) * (1 - es(t, 4.05, 4.5));
      /* v2: in the beginning with God — the ring without end */
      const ring = seg(t, 4.1, 4.75);

      const apart = withG * (1 - one), dx = lerp(200, 125, es(t, 4.05, 4.5));
      const fx = 800 - apart * dx;
      const fy = lerp(470, 470, withG);
      const gx = 800 + dx * (1 - one), gy = lerp(380, 400, one) + (1 - withG) * -260;
      const flick = time ? Math.sin(time * 7.3) * 0.03 + Math.sin(time * 11.1) * 0.02 : 0;
      pose(spark, { x: 800, y: 420, s: sp * (1 - born) * 1.4, r: t * 40, o: sp * (1 - born) });
      pose(flameEl, { x: fx, y: fy + 59, s: born * (1 + one * 0.12), sx: born * (1 + one * 0.12) * (1 + flick), oy: 0, o: born > 0.01 ? 1 : 0 });
      pose(wordGlow, { x: fx, y: fy, s: born * (0.9 + one * 0.6) + bump(t, 1.2, 1.9) * 0.3, o: Math.min(1, born) });
      pose(wordRays, { x: fx, y: fy, s: born * (0.7 + one * 0.3), r: t * 5, o: Math.min(1, born) * (1 - one * 0.6) });

      const gIn = es(t, 2.05, 2.6, ease.out);
      pose(god, { x: gx, y: gy, s: 0.4 + gIn * 0.6 + one * 0.35, o: gIn > 0.01 ? 1 : 0 });
      pose(godGlow, { x: gx, y: gy, s: gIn * (0.9 + one * 0.5), o: gIn });
      pose(godRays, { x: gx, y: gy, s: 0.5 + gIn * 0.5 + one * 0.3, r: -t * 4, o: gIn * (0.7 + one * 0.3) });
      // the bridge of light between them (they face one another)
      const br = es(t, 2.35, 2.75) * (1 - one) * (1 - es(t, 4.6, 4.95) * 0.3);
      pose(bridge, { x: fx + 50, y: fy - 50, sx: Math.max(0.01, (gx - fx - 100) / 380), sy: 1, o: br });

      // the ring without end
      pose(ringEl, { x: 800, y: 430, s: 1.1 + ring * 0.04, r: ring * 40, o: ring > 0 ? 1 : 0 });
      drawRing(ringEl, ease.io(ring));

      // words on strings
      const wT = es(t, 1.35, 1.65, ease.out) * (1 - es(t, 3.05, 3.3, ease.in));
      pose(wordTag, { x: fx, y: lerp(-560, 620, wT), r: Math.sin(t * 3.6) * 1.4 * wT, o: wT > 0.01 ? 1 : 0 });
      const gT = es(t, 2.35, 2.65, ease.out) * (1 - es(t, 3.05, 3.3, ease.in));
      pose(godTag, { x: gx, y: lerp(-560, gy + 220, gT), r: Math.sin(t * 3.2 + 1) * 1.4 * gT, o: gT > 0.01 ? 1 : 0 });
      const bT = es(t, 4.25, 4.55, ease.out);
      pose(begTag, { x: 800, y: lerp(-560, 752, bT), r: Math.sin(t * 2.8 + 2) * 1.2 * bT, o: bT > 0.01 ? 1 : 0 });

      /* camera: lean in to the first spark, back out for the ring */
      S.cam.z = 0.98 + es(t, 0.9, 1.6) * 0.16 - es(t, 1.95, 2.5) * 0.12 + es(t, 3.0, 3.5) * 0.06 - es(t, 4.0, 4.6) * 0.1;
      S.cam.y = es(t, 0.9, 1.6) * 10 - es(t, 4.0, 4.6) * 20;
    };
  },
};
