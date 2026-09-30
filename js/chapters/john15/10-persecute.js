// J 15,20–21 — "Remember the word I said to you: a servant is not greater than his master": a sepia picture from the
// upper room hangs down — Jesus kneeling with the basin at Peter's feet. "If they persecuted Me, they will persecute
// you": long shadow hands reach in out of the dark, first towards Him, then towards them (they stop short; He stands
// in front). "If they kept My word, they will keep yours": the hands draw back, and on the far ridge some of the dark
// figures light up with lamps of their own. "All this they will do to you because of My name": a small gold seal of
// His name shines on each one's breast. "Because they do not know Him who sent Me": the light opens above, but the
// shadows on the ridge turn their backs to it, and a dark veil of cloud drifts in front of them.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, worldRidge, worldSet, framed, person, strip, shadowArm, radiance, lightCone, tint,
  vis, kf, pose, lerp, blinkAt, mix, shade, sheet, tr, C, P, PI, JESUS, CAST, COLD, NIGHT,
} from './lib.js';

const LIT = [2, 5, 8, 10];

export default {
  id: 'j15-persecute',
  beats: [
    { v: 20, text: 'Pamiętajcie na słowo, które do was powiedziałem: "Sługa nie jest większy od swego pana".' },
    { v: 20, cont: true, text: 'Jeżeli Mnie prześladowali, to i was będą prześladować.' },
    { v: 20, cont: true, text: 'Jeżeli moje słowo zachowali, to i wasze będą zachowywać.' },
    { v: 21, text: 'Ale to wszystko wam będą czynić z powodu mego imienia,' },
    { v: 21, cont: true, text: 'bo nie znają Tego, który Mnie posłał.' },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.96, 1.25] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { skyCols: COLD, vine: false, before: () => {
      const upL = S.layer({ par: 0.1, sh: 0, flat: true });
      const cone = upL.add(`<g>${lightCone(c, { w0: 60, w1: 300, h: 720, o: 0.18 })}</g>`);
      const rad = upL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 56)}</g>`);
      const world = worldRidge(S, { litIdx: LIT });
      const veilL = S.layer({ par: 0.16, sh: 3 });
      const veil = veilL.add(`<g opacity=".8">${sheet().p(c.cut([...c.arc(0, 0, 420, 16, PI, PI * 2, 18), ...c.arc(0, 0, 420, 14, 0, PI, 18)], 2.4, 10), '#1d1a2e').out()}</g>`);
      return { cone, rad, world, veil };
    } });
    const { ms, jesus, JX, JY } = tb;
    const { cone, rad, world, veil } = tb.pre;
    // shadow hands reaching in from the dark (they stop short)
    const fx = S.layer({ par: P, sh: 5 });
    const HANDS = [
      { from: [1700, 452], to: [960, 470], k: 0 }, { from: [1700, 520], to: [1000, 530], k: 0 },
      { from: [-100, 480], to: [420, 500], k: 1 }, { from: [-100, 560], to: [360, 570], k: 1 }, { from: [1700, 590], to: [1230, 590], k: 1 }, { from: [1700, 490], to: [1180, 500], k: 1 },
    ];
    // phone: the hands that reach for the disciples come inside the screen
    if (S.portrait) [[470, 500], [440, 570], [1160, 590], [1130, 500]].forEach((to, i) => { HANDS[i + 2].to = to; });
    HANDS.forEach((h) => { h.el = tb.vineL.add(`<g>${shadowArm(c, '#231c30')}</g>`); h.dir = h.from[0] > 800 ? -1 : 1; });
    const seals = ms.map(() => fx.add(`<g><circle r="16" fill="url(#warm-glow)"/><path d="${c.cut(c.star(0, 0, 9, 7, 12, 0), 0.2, 2)}" fill="${C.sun}"/><path d="${c.poly(c.star(0, 0, 4.4, 1.8, 5, 0))}" fill="${C.star}"/></g>`));
    // the sepia picture from the upper room
    const PW = 380, PH = 210;
    const inner = tint(`<rect x="0" y="0" width="${PW}" height="${PH}" fill="${C.plaster}"/><path d="${c.cut(c.rect(0, PH - 30, PW, 30), 0.4, 8)}" fill="${C.wood3}"/>`
      + `<g transform="translate(290 ${PH - 26}) scale(-.8 .8)">${person(c, { ...CAST.peter, pose: 'sit' })}</g>`
      + `<g data-k="basin" transform="translate(226 ${PH - 26})"><path d="${c.cut([[-26, -18], [26, -18], [20, 0], [-20, 0]], 0.3, 4)}" fill="${C.pot}"/><path d="${c.cut(c.ell(0, -18, 26, 5, 14), 0.2, 3)}" fill="${C.lake}"/></g>`
      + `<g transform="translate(160 ${PH - 26}) scale(.8)">${person(c, { ...JESUS, pose: 'kneel', mantle: null, belt: C.linen2 })}</g>`, mix(C.parchment, C.dune, 0.5), 0.35);
    const hangL = S.layer({ par: 0.12, sh: 6 });
    const pic = hangL.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3 })}<g transform="translate(0 ${PH + 34})">${strip(c, tr('„Sługa nie jest większy od swego pana”', '“A servant is not greater than his lord”'), { size: 20 })}</g></g>`);
    tb.set.front();

    return (t, time) => {
      const T = time;
      tb.set.update(T);
      /* v20a — the picture */
      const pk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      vis(pic, { x: 800, y: 110 - (1 - pk) * 640 + (T ? Math.sin(T * 0.9) * 2 : 0), o: pk > 0.001 ? 1 : 0 });
      /* v20b — the hands reach: at Him first, then at them; v20c — they draw back */
      HANDS.forEach((h) => {
        const a = h.k === 0 ? es(t, 1.08, 1.4) : es(t, 1.4, 1.75);
        const back = es(t, 2.05, 2.35);
        const k = a * (1 - back);
        const x = lerp(h.from[0], h.to[0], k), y = lerp(h.from[1], h.to[1], k) + (T ? Math.sin(T * 1.6 + h.to[1]) * 4 : 0);
        vis(h.el, { x, y, sx: h.dir * 0.7, sy: 0.7, s: 0.7, r: h.dir * -4, o: k > 0.01 ? Math.min(1, k * 3) * 0.8 : 0 });
      });
      const threat = es(t, 1.1, 1.4) * (1 - es(t, 2.05, 2.35));
      jesus.set({ x: JX, y: JY, s: 1.05, armB: threat * 60 + bump(t, 4.1, 4.9) * 130, armF: bump(t, 0.1, 0.9) * 50 + threat * 40 + bump(t, 3.1, 3.9) * 40, head: -bump(t, 4.1, 4.9) * 12, blink: blinkAt(T, 1) });
      ms.forEach((m, i) => {
        const fear = es(t, 1.45, 1.7) * (1 - es(t, 2.05, 2.35));
        placeM(m, T, { head: -es(t, 0.05, 0.3) * 12 * (1 - es(t, 1, 1.2)) + fear * 6 - es(t, 4.1, 4.3) * 12, lean: (m.x < 800 ? 1 : -1) * fear * 4, armF: es(t, 3.1, 3.3) * 20 });
        const sk = es(t, 3.1 + i * 0.03, 3.3 + i * 0.03, ease.back);
        vis(seals[i], { x: m.x + (m.flip ? -6 : 6) * m.s, y: m.y - 108 * m.s, s: sk * m.s, o: sk > 0.01 ? 1 : 0 });
      });
      lampsAll(ms, 0.7 + es(t, 2.1, 2.4) * 0.3 - threat * 0.2);
      /* the world on the ridge: points while the hands reach; some light up; then all turn their backs to the light */
      const away = es(t, 4.2, 4.45);
      worldSet(world, (sh) => ({
        up: 1, point: threat * (sh.i % 2 ? 1 : 0.6) + es(t, 3.2, 3.5) * (1 - away) * 0.7 * (LIT.includes(sh.i) ? 0 : 1),
        lit: LIT.includes(sh.i) ? es(t, 2.2 + LIT.indexOf(sh.i) * 0.08, 2.45 + LIT.indexOf(sh.i) * 0.08) : 0,
        flip: LIT.includes(sh.i) ? true : away < 0.5, head: 0,
      }));
      /* v21b — the light above; a veil of cloud in front of them */
      const fa = es(t, 4.05, 4.35);
      vis(rad, { x: 800, y: 124, s: 1 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: fa });
      vis(cone, { x: 800, y: 124, o: fa });
      vis(veil, { x: lerp(1900, 1250, es(t, 4.25, 4.7)), y: 418, o: es(t, 4.2, 4.3) * 0.85 });
      S.cam.x = kf(t, [[0, 0], [1, 0], [1.3, -20], [2, -20], [2.3, -40], [3, -30], [3.3, 0], [4, 0], [4.5, -20], [5, -20]]);
      S.cam.y = kf(t, [[0, -50], [1, -40], [1.4, 10], [2, 10], [2.3, -10], [3, 0], [3.3, 20], [4, 10], [4.4, -40], [5, -40]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.02], [1.4, 1.06], [2, 1.06], [2.4, 1.1], [3, 1.08], [3.3, 1.14], [4, 1.12], [4.4, 1.0], [5, 1.0]]);
    };
  },
};
