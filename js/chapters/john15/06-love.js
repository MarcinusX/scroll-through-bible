// J 15,9–11 — The eleven sit down among the vines round Jesus; the night grows warmer. "As the Father has loved Me":
// a great heart of light comes down from the light above into Him — "so I have loved you": from Him, a heart flies
// to each of them. "Abide in My love": a ring of light draws itself round them all. "If you keep My commandments, you
// will abide in My love": a little sealed scroll comes to rest at each one's heart. "Just as I have kept My Father's
// commandments and abide in His love": He lifts His own scroll up into the beam from above. "These things I have
// spoken to you, that My joy may be in you and your joy may be full": a cup of light hangs over them and fills to the
// brim; it overflows, and every disciple's own little cup fills with gold.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, radiance, lightCone, heartLight, eternityRing, drawRing, sealedScroll, chalice, clayCup, sparkle, voiceRings,
  vis, kf, pose, attr, lerp, blinkAt, mix, shade, sheet, C, P, PI, WARMNIGHT,
} from './lib.js';

export default {
  id: 'j15-love',
  beats: [
    { v: 9, text: 'Jak Mnie umiłował Ojciec, tak i Ja was umiłowałem.' },
    { v: 9, cont: true, text: 'Wytrwajcie w miłości mojej!' },
    { v: 10, text: 'Jeśli będziecie zachowywać moje przykazania, będziecie trwać w miłości mojej,' },
    { v: 10, cont: true, text: 'tak jak Ja zachowałem przykazania Ojca mego i trwam w Jego miłości.' },
    { v: 11, text: 'To wam powiedziałem,' },
    { v: 11, cont: true, text: 'aby radość moja w was była i aby radość wasza była pełna.' },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.96, 1.25] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { skyCols: WARMNIGHT, pose: 'sit', beadsN: 0, before: () => {
      const upL = S.layer({ par: 0.1, sh: 0, flat: true });
      return {
        cone: upL.add(`<g>${lightCone(c, { w0: 60, w1: 300, h: 720, o: 0.22 })}</g>`),
        rad: upL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 58)}</g>`),
      };
    } });
    const { vine, ms, jesus, JX, JY } = tb;
    const { cone, rad } = tb.pre;
    // phone: a smaller ring, whole inside the screen, round the eleven (who stand closer together there)
    const ring = tb.glowL.add(S.portrait ? `<g><g transform="scale(1 .27)">${eternityRing(c, 345, 12, 36, C.haloRim)}</g></g>` : `<g><g transform="scale(1 .2)">${eternityRing(c, 450, 14, 36, C.haloRim)}</g></g>`);
    const ringGlow = tb.glowL.add(`<g><ellipse rx="470" ry="110" fill="url(#halo-glow)" opacity=".7"/></g>`);
    const fx = S.layer({ par: P, sh: 4 });
    const bigHeart = fx.add(`<g>${heartLight(c, 34, C.jesusMantle)}</g>`);
    const hearts = ms.map(() => fx.add(`<g>${heartLight(c, 10, C.jesusMantle)}</g>`));
    const scrolls = ms.map(() => fx.add(`<g>${sealedScroll(c, 38)}</g>`));
    const jScroll = fx.add(`<g>${sealedScroll(c, 70)}</g>`);
    const rings = voiceRings(fx, c, { n: 3, r: 30, w: 4, color: shade(C.halo, -0.05) });
    // the cup of joy: a gold chalice whose light rises to the brim (the level is clipped to the bowl)
    const cid = S.id('cup');
    const K = 1.9;
    const bowl = [[-24, -46], [-28, -70], [28, -70], [24, -46], [4, -34], [-4, -34]].map(([x, y]) => [x * K, y * K]);
    S.defs(`<clipPath id="${cid}"><path d="${c.poly(bowl)}"/></clipPath>`);
    const cup = fx.add(`<g><circle cy="-100" r="170" fill="url(#halo-glow)" data-k="cupglow"/>${chalice(c, 70 * K, { dark: false })}<g clip-path="url(#${cid})"><rect x="-60" y="-140" width="120" height="120" fill="${mix(C.night, C.sunDeep, 0.35)}"/><rect data-k="level" x="-60" y="-34" width="120" height="100" fill="${C.lampFlame}"/><rect x="-60" y="-140" width="120" height="120" fill="#fff4d2" opacity=".35"/></g><ellipse data-k="brim" cx="0" cy="${-69 * K}" rx="${26 * K}" ry="${5 * K}" fill="${C.lampGlow}"/></g>`);
    const level = cup.querySelector('[data-k="level"]'), brim = cup.querySelector('[data-k="brim"]');
    const pours = ms.map(() => fx.add(`<g><circle r="10" fill="url(#warm-glow)"/><circle r="3.4" fill="${C.lampFlame}"/></g>`));
    const cups = ms.map(() => fx.add(`<g>${clayCup(c, { col: C.pot, w: 11 })}<ellipse data-k="wine" cx="0" cy="-20" rx="9" ry="2.6" fill="${C.lampFlame}"/></g>`));
    const cupWine = cups.map((el) => el.querySelector('[data-k="wine"]'));
    const joys = ms.map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));
    tb.set.front();

    const chest = (m) => [m.x + (m.flip ? -6 : 6) * m.s, m.y - 66 * m.s];
    const handP = (m) => [m.x + (m.flip ? -36 : 36) * m.s, m.y - 78 * m.s];
    return (t, time) => {
      const T = time;
      tb.set.update(T);
      vine.set({ grow: 1, sap: 1, fruit: 1.1, ripe: 1, glow: 0.7 + bump(t, 0.9, 2) * 0.3, T });
      /* v9a — the Father's love comes down into Him, then from Him to each */
      const fa = es(t, 0.05, 0.3) * (1 - es(t, 1.2, 1.5)) + bump(t, 3.0, 4.2);
      vis(rad, { x: 800, y: 124, s: 1 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: Math.min(1, fa) });
      vis(cone, { x: 800, y: 124, o: Math.min(1, fa) * (0.7 + bump(t, 3.1, 3.9) * 0.5) });
      const hd = es(t, 0.12, 0.45, ease.io);
      vis(bigHeart, { x: 800, y: lerp(150, 600, hd), s: 1 - es(t, 0.45, 0.6) * 0.5 + bump(t, 0.42, 0.62) * 0.2, o: es(t, 0.1, 0.2) * (1 - es(t, 1.2, 1.4) * 0.6) });
      /* v11b — the cup of joy fills and runs over into theirs */
      const cupIn = es(t, 4.05, 4.35, ease.out) * (1 - es(t, 5.95, 6));
      const fill = es(t, 5.05, 5.4);
      vis(cup, { x: 800, y: lerp(-200, 470, es(t, 4.05, 4.35, ease.out)) + (T ? Math.sin(T * 0.9) * 3 : 0), o: cupIn > 0.001 ? 1 : 0 });
      attr(level, 'y', (lerp(-36, -70 * K, fill)).toFixed(1));
      attr(brim, 'opacity', es(t, 5.3, 5.42));
      ms.forEach((m, i) => {
        const [cx, cy] = chest(m);
        const hs = es(t, 0.5 + i * 0.03, 0.85 + i * 0.03);
        vis(hearts[i], { x: lerp(806, cx, hs), y: lerp(590, cy, hs) - Math.sin(hs * PI) * 80, s: 0.8 + es(t, 0.8 + i * 0.03, 0.95 + i * 0.03, ease.back) * 0.3, o: hs > 0 ? (1 - es(t, 2.0, 2.2) * 0.5) : 0 });
        /* v10a — a scroll at each one's heart */
        const sc = es(t, 2.1 + i * 0.03, 2.4 + i * 0.03, ease.back);
        vis(scrolls[i], { x: cx + (m.flip ? -8 : 8), y: cy + 4, r: m.flip ? 24 : -24, s: sc * 0.72, o: sc > 0.01 ? (1 - es(t, 3.9, 4.1)) : 0 });
        /* v11b — pour into their cups */
        const po = seg(t, 5.4 + (i % 6) * 0.03, 5.62 + (i % 6) * 0.03);
        const [px, py] = handP(m);
        vis(pours[i], { x: lerp(800, px, po), y: lerp(470 - 70 * K, py - 22, po) - Math.sin(po * PI) * 90, o: po > 0 && po < 1 ? 1 : 0 });
        const cupK = es(t, 5.0, 5.2);
        vis(cups[i], { x: px, y: py, s: m.s * 1.1, o: cupK });
        attr(cupWine[i], 'opacity', es(t, 5.55 + (i % 6) * 0.03, 5.65 + (i % 6) * 0.03));
        vis(joys[i], { x: px + 4, y: py - 40, r: T * 40, s: 0.5 + bump(t, 5.6, 6) * 0.7, o: bump(t, 5.6 + (i % 5) * 0.02, 6.0) });
        placeM(m, T, { head: -es(t, 0, 0.3) * 10 * (1 - es(t, 2, 2.2)) - bump(t, 3.05, 3.95) * 8 - es(t, 4.1, 4.4) * 12,
          armF: bump(t, 0.6 + i * 0.03, 1.4) * 30 + es(t, 2.2, 2.4) * 40 * (1 - es(t, 3.9, 4.1)) + es(t, 5.0, 5.2) * 58 });
      });
      lampsAll(ms, 0.8);
      /* v9b — the ring of love round them all */
      const rk = es(t, 1.1, 1.7);
      vis(ring, { x: 800, y: 690, o: rk > 0.001 ? 1 : 0 });
      drawRing(ring.firstElementChild, rk);
      vis(ringGlow, { x: 800, y: 690, o: es(t, 1.3, 1.8) * (0.8 + bump(t, 2.1, 2.9) * 0.2) });
      /* v10b — His own scroll lifted up into the beam */
      const lift = es(t, 3.1, 3.4) * (1 - es(t, 3.95, 4.1));
      jesus.set({ x: JX, y: JY, s: 1.05, armF: bump(t, 0.5, 1.0) * 70 + bump(t, 1.05, 1.9) * 90 + bump(t, 2.05, 2.9) * 40 + bump(t, 4.05, 4.9) * 50 + bump(t, 5.05, 5.9) * 40,
        armB: bump(t, 1.05, 1.9) * 100 + lift * 150, head: -lift * 14 - bump(t, 0.1, 0.5) * 10, blink: blinkAt(T, 1) });
      vis(jScroll, { x: JX + 22, y: lerp(580, 500, lift), r: -10, s: 0.8 + lift * 0.2, o: lift });
      rings(JX + 8, JY - 180, bump(t, 4.02, 4.95) * 0.8, T, { s0: 0.8, spread: 1.8 });
      S.cam.y = kf(t, [[0, -40], [0.6, 0], [1.2, 20], [2, 20], [3, -20], [3.9, -40], [4.4, -20], [5, -20], [6, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.08], [1.2, 1.0], [2, 1.02], [2.8, 1.12], [3.5, 1.04], [4.4, 1.08], [5.5, 1.14], [6, 1.14]]);
    };
  },
};
