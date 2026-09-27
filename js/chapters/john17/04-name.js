// J 17,6–8 — "I revealed Your name to the people You gave Me out of the world": a gold word, "Abba — Father", is let
// down over Him and its light falls on the Eleven, whose small flames brighten. "They were Yours, and You gave them
// to Me": two round plates hang side by side — the radiance with eleven little lights around it, and Jesus — and the
// eleven lights travel across from the one to the other. "They have kept Your word": a small scroll of light glows in
// every one's hands. "Now they know that all You gave Me is from You": gifts hang over Him — bread, the word, a heart,
// the flame of life — and each is joined by a thread of light to the radiance. "For the words You gave Me I have given
// them": slips of words come down from the light to Him and fly on to each of them; "and they received them": hands
// rise and take them; "and knew for sure that I came from You": a dotted path of light runs down from the radiance to
// Him and every face follows it; "and believed that You sent Me": a heart of light kindles in each of them.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, lifeFlames, fatherLight, goldWord, spark, wordSlip, scrollRolled,
  heart, lightPath, drawPath, lineD, curves, arcAt, lower, hand, person, vis, kf, pose, fade, tr, sheet, mix, shade,
  C, CAST, JX, JY, NIGHT, HOLY, PRAY, PI, lerp,
} from './lib.js';

const RY = 150;
const PL = [[560, 300], [1040, 300]];

export default {
  id: 'j17-name',
  beats: [
    { v: 6, text: 'Objawiłem imię Twoje ludziom, których Mi dałeś ze świata.' },
    { v: 6, cont: true, text: 'Twoimi byli i Ty Mi ich dałeś,' },
    { v: 6, cont: true, text: 'a oni zachowali słowo Twoje.' },
    { v: 7 },
    { v: 8, text: 'Słowa bowiem, które Mi powierzyłeś, im przekazałem,' },
    { v: 8, cont: true, text: 'a oni je przyjęli' },
    { v: 8, cont: true, text: 'i prawdziwie poznali, że od Ciebie wyszedłem,' },
    { v: 8, cont: true, text: 'oraz uwierzyli, żeś Ty Mnie posłał.' },
  ],
  cam: { x: [-20, 20], y: [-70, 30], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: HOLY });
    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 54)}</g>`);

    /* hanging things */
    const hangL = S.layer({ par: 0.2, sh: 4 });
    const name = hangL.add(`<g><path d="M-60 -1600V-18M60 -1600V-18" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${goldWord(c, tr('Abba — Ojcze', 'Abba — Father'), { size: 30 })}</g>`);
    // the two plates
    const clip = S.id('jp');
    S.defs(`<clipPath id="${clip}"><circle r="62"/></clipPath>`);
    const plate = (inner, face) => {
      const s = sheet().p(c.cut(c.circ(0, 0, 76, 40), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 70, 40), 0.5, 5), C.cream).p(c.cut(c.circ(0, 0, 62, 40), 0.4, 5), face);
      return `<path d="M0 -1600V-76" stroke="rgba(233,210,160,.5)" stroke-width="1.2" fill="none"/>${s.out()}<g clip-path="url(#${clip})">${inner}</g>`;
    };
    const pF = hangL.add(`<g>${plate(`<circle r="60" fill="url(#halo-glow)"/><g transform="scale(.32)">${fatherLight(c, 70)}</g>`, '#2a2e5a')}</g>`);
    const pJ = hangL.add(`<g>${plate(`<circle cy="-10" r="60" fill="url(#halo-glow)"/><g transform="translate(-4 110) scale(.62)">${person(c, { ...CAST.jesus })}</g>`, mix(C.parchment, C.halo, 0.4))}</g>`);
    const dots = Array.from({ length: 11 }, () => hangL.add(`<g>${spark(3.2, 4)}</g>`));
    // gifts over Him, joined to the light
    const GIFTS = [[640, 318], [720, 290], [880, 290], [960, 318]];
    const giftM = [
      sheet().p(c.cut(c.ell(0, 0, 22, 14, 16), 0.4, 4), C.wheat2).x(c.ribbon([[-10, -4], [-4, 6]], 2) + c.ribbon([[2, -6], [8, 4]], 2), shade(C.wheat2, -0.25)).out(),
      scrollRolled(c, 44),
      heart(c, 20, C.jesusMantle),
      `<circle r="30" fill="url(#warm-glow)"/><path d="M0 16C-12 8 -12 -6 0 -22C12 -6 12 8 0 16Z" fill="${C.lampFlame}"/><path d="M0 12C-5 6 -5 -2 0 -10C5 -2 5 6 0 12Z" fill="#fff6dc"/>`,
    ];
    const gifts = GIFTS.map((_, i) => hangL.add(`<g><circle r="40" fill="url(#halo-glow)" opacity=".6"/>${giftM[i]}</g>`));

    const thL = S.layer({ par: 0.3, sh: 0, flat: true });
    const thr = curves(thL, 4, { color: C.halo, w: 1.8 });
    const nameRays = curves(thL, 11, { color: '#fff3cf', w: 1.4 });
    const beliefs = curves(thL, 11, { color: C.jesusMantle, w: 1.6 });
    const pathEl = thL.add(`<g>${lightPath(lineD(pathPts()), { w: 5, col: C.halo })}</g>`);
    const pathP = pathEl.firstElementChild;
    const runner = thL.add(`<g>${spark(5)}</g>`);

    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL);
    const D = eleven(S, peopleL);
    const fx = S.layer({ par: 0.42, sh: 3 });
    const flames = lifeFlames(S, fx, D, 16);
    const scrolls = D.map(() => fx.add(`<g><circle r="30" fill="url(#halo-glow)"/><g transform="rotate(90) scale(1.3)">${scrollRolled(c, 30)}</g></g>`));
    const slips = D.map(() => fx.add(`<g><circle r="22" fill="url(#halo-glow)"/>${wordSlip(c, 26)}</g>`));
    const hearts = D.map(() => fx.add(`<g><circle r="30" fill="url(#halo-glow)"/>${heart(c, 9, C.jesusMantle)}</g>`));
    const down = [0, 1, 2].map(() => fx.add(`<g>${wordSlip(c, 30)}</g>`));
    const jGlow = thL.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);

    const JC = chestOf(J), JH = [JX + 2, JY - 176];
    function pathPts() { const p = []; for (let i = 0; i <= 30; i++) { const u = i / 30; p.push([JX + Math.sin(u * PI * 2) * 34 * (1 - u), lerp(RY + 60, JY - 215, u)]); } return p; }

    return (t, time) => {
      const T = time;
      P.update(T);
      vis(high, { x: JX, y: RY, r: T * 1.5, o: 1 });

      /* v6a — the Name */
      const nk = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      lower(name, nk, JX, 318, { len: 600, r: T ? Math.sin(T * 0.7) * 0.8 : 0 });
      D.forEach((m, i) => {
        const [hx, hy] = headOf(m);
        const k = bump(t, 0.35 + (i % 4) * 0.04, 1.0);
        nameRays(i, [JX + (m.x - JX) * 0.2, 336], [hx, hy - 40 * m.s], 20, Math.min(1, k * 2), k * 0.8);
      });

      /* v6b — Yours, given to Me: two plates, the lights go across */
      const pk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.0, 2.25, ease.in));
      lower(pF, pk, PL[0][0], PL[0][1], { len: 700, r: T ? Math.sin(T * 0.8) : 0 });
      lower(pJ, pk, PL[1][0], PL[1][1], { len: 700, r: T ? Math.sin(T * 0.8 + 1) : 0 });
      dots.forEach((el, i) => {
        const a = (i / 11) * PI * 2 + T * 0.4;
        const home = [PL[0][0] + Math.cos(a) * 46, PL[0][1] - (1 - pk) * 700 + Math.sin(a) * 46];
        const dest = [PL[1][0] + Math.cos(a) * 50, PL[1][1] - (1 - pk) * 700 + Math.sin(a) * 50];
        const u = es(t, 1.4 + i * 0.03, 1.75 + i * 0.03);
        const [x, y] = arcAt(home, dest, -80 - (i % 3) * 20, u);
        vis(el, { x, y, o: pk > 0.05 ? pk : 0 });
      });

      /* v6c — they kept Your word: a small scroll in every one's hands */
      const keep = es(t, 2.1, 2.45) * (1 - es(t, 4.0, 4.3));
      D.forEach((m, i) => {
        const [x, y] = hand(m.x, m.y, m.s, m.flip, 50, 0, 62);
        const k = es(t, 2.1 + (i % 5) * 0.04, 2.4 + (i % 5) * 0.04) * (1 - es(t, 4.0, 4.3));
        vis(scrolls[i], { x, y: y - 4, s: m.s * k, o: k > 0.01 ? 1 : 0 });
      });

      /* v7 — all You gave Me is from You: gifts over Him, threads to the light */
      GIFTS.forEach(([x, y], i) => {
        const g = es(t, 3.05 + i * 0.06, 3.35 + i * 0.06, ease.out) * (1 - es(t, 3.95, 4.2, ease.in));
        lower(gifts[i], g, x, y, { len: 600, r: T ? Math.sin(T + i) * 2 : 0 });
        const k = es(t, 3.35 + i * 0.06, 3.65 + i * 0.06) * (1 - es(t, 3.95, 4.1));
        thr(i, [x, y - 24], [JX + (x - JX) * 0.2, RY + 40], -10, k, 0.9);
      });

      /* v8a — the words: from the light to Him, and on to each of them; v8b they receive them */
      down.forEach((el, i) => {
        const u = es(t, 4.05 + i * 0.1, 4.4 + i * 0.1);
        const [x, y] = arcAt([JX, RY + 50], [JX + 20, JY - 150], (i - 1) * 60, u);
        vis(el, { x, y, r: u * 180, o: u > 0.01 && u < 0.98 ? 1 : 0 });
      });
      D.forEach((m, i) => {
        const [x, y] = hand(m.x, m.y, m.s, m.flip, 50, 0, 62);
        const d = Math.abs(m.x - JX) / 400;
        const u = es(t, 4.4 + d * 0.25, 4.85 + d * 0.25);
        const got = es(t, 5.1, 5.4);
        const [sx, sy] = arcAt(JC, [x, y - 10], -110, u);
        const hold = got * (1 - es(t, 6.9, 7.1));
        vis(slips[i], { x: sx, y: sy, s: m.s * (1 + hold * 0.15), r: (1 - u) * 90 + (m.flip ? 12 : -12), o: u > 0.01 ? 1 - es(t, 6.9, 7.1) : 0 });
      });

      /* v8c — He came from You: the dotted path of light */
      const pk2 = es(t, 6.05, 6.6);
      drawPath(pathP, pk2);
      const rp = pathPts()[Math.min(30, Math.round(pk2 * 30))];
      vis(runner, { x: rp[0], y: rp[1], o: pk2 > 0.01 && pk2 < 0.99 ? 1 : 0 });
      fade(pathEl, pk2 > 0.001 ? 1 - es(t, 7.4, 7.7) * 0.6 : 0);

      /* v8d — they believed: hearts of light */
      D.forEach((m, i) => {
        const [cx, cy] = chestOf(m);
        const d = Math.abs(m.x - JX) / 400;
        const k = es(t, 7.05 + d * 0.2, 7.35 + d * 0.2, ease.back);
        vis(hearts[i], { x: cx + (m.flip ? -4 : 4), y: cy + 6, s: k * m.s, o: k > 0.01 ? 1 : 0 });
        beliefs(i, [cx, cy], JC, -40, es(t, 7.3 + d * 0.2, 7.6 + d * 0.2), 0.7);
      });
      vis(jGlow, { x: JX, y: JY - 120, s: 1, o: 0.3 + bump(t, 6.2, 7.0) * 0.5 + es(t, 7.3, 7.7) * 0.3 });

      /* the Eleven */
      D.forEach((m, i) => {
        const d = Math.abs(m.x - JX) / 400;
        const recv = es(t, 4.9 + d * 0.2, 5.2 + d * 0.2);
        const holdS = Math.max(keep, recv * (1 - es(t, 6.9, 7.1)));
        const look = bump(t, 6.0, 7.1);
        put(m, T, { head: -8 - look * 16 + holdS * 8, armF: 14 + holdS * 36 + es(t, 7.1, 7.4) * 10, armB: 6 + recv * 20 * (1 - es(t, 6.9, 7.1)) });
        lampK(m, 0.85);
      });
      flames((m, i) => 1, T, { boost: bump(t, 0.4, 1.1) * 0.8 });

      /* Jesus */
      const give = bump(t, 4.3, 5.2);
      put(J, T, { head: PRAY.head + give * 30 + bump(t, 1.2, 2.0) * 16, armF: PRAY.armF + give * 20, armB: PRAY.armB - give * 70 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -40], [1, -40], [2, -30], [3, -10], [4, -30], [5, 0], [6, -20], [7, 0], [8, 10]]);
      S.cam.z = kf(t, [[0, 1.0], [2, 1.02], [3, 1.08], [4, 1.02], [5, 1.08], [6, 1.02], [8, 1.1]]);
    };
  },
};
