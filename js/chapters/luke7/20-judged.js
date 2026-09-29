// Łk 7,43–46 — back in Simon's court. Simon answers, "The one, I suppose, for whom he cancelled the larger debt" —
// "You have judged rightly," and a tick is cut beside him. Then Jesus turns round to the woman, a warm light behind
// her: "Do you see this woman?" Three times over He sets what Simon did not give against what she gave: above Simon
// hangs a card with a dry basin and towel, crossed out — while her tears fall shining on His feet and her hair wipes
// them; a card with a withheld kiss — while her kisses keep rising from His feet; a card with the horn of oil for His
// head — while the alabaster glows and its fragrance rises from His feet.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { simonRoom, sparkle, SH, SR7, basin, kiss, oilHorn, crossMark, tick, tear, nardMist, bubble, headAt, voiceRings, kf, tr, PI } from './lib.js';

const { FLOOR, JX } = SH;
const WX = SR7.WX, FX = SR7.FEETX, FY = SR7.FEETY;

/** a small parchment card with an icon, crossed out (origin centre) */
function card(c, icon) {
  const s = sheet().p(c.cut(c.rect(-70, -54, 140, 108), 0.5, 6), C.cream).p(c.cut(c.rect(-64, -48, 128, 96), 0.4, 6), C.parchment).out();
  return `${s}<g>${icon}</g><g transform="translate(0 0)" opacity=".62">${crossMark(c, 34, C.terracotta)}</g>`;
}

export default {
  id: 'lk7-judged',
  beats: [
    { v: 43, text: 'Szymon odpowiedział: «Sądzę, że ten, któremu więcej darował».' },
    { v: 43, cont: true, text: 'On mu rzekł: «Słusznie osądziłeś».' },
    { v: 44, text: 'Potem zwrócił się do kobiety i rzekł Szymonowi: «Widzisz tę kobietę?' },
    { v: 44, cont: true, text: 'Wszedłem do twego domu, a nie podałeś Mi wody do nóg; ona zaś łzami oblała Mi stopy i swymi włosami je otarła.' },
    { v: 45 },
    { v: 46 },
  ],
  cam: { x: [-60, 110], y: [0, 200], z: [0.8, 1.3] },
  build(S) {
    const M = simonRoom(S);
    const { R, c } = M;
    const herGlow = R.glowL.add(`<g opacity="0"><circle r="150" fill="url(#halo-glow)"/></g>`);
    const tears = [0, 1, 2, 3].map(() => R.fx.add(`<g opacity="0">${tear(c, 4.4)}</g>`));
    const shine = [0, 1, 2].map(() => R.fx.add(`<g opacity="0">${sparkle(c, 6, C.star)}</g>`));
    const kisses = [0, 1, 2, 3, 4].map(() => R.fx.add(`<g opacity="0">${kiss(c, 8)}</g>`));
    const mist = R.fx.add(`<g opacity="0">${nardMist(c, 70, { glow: false })}</g>`);
    const cards = [
      card(c, `<g transform="translate(-26 22)">${basin(c)}</g>`),
      card(c, `<g transform="translate(0 0)">${kiss(c, 28, C.jesusMantle)}</g>`),
      card(c, `<g transform="translate(-4 34) scale(1.3)">${oilHorn(c)}</g>`),
    ].map((m) => R.fx.add(`<g opacity="0">${m}</g>`));
    const tk = R.fx.add(`<g opacity="0">${tick(c)}</g>`);
    const jv = voiceRings(R.frontL, c, { n: 3, color: C.sun, r: 30, w: 4 });
    const sv = voiceRings(R.frontL, c, { n: 2, color: C.clay, r: 26, w: 4 });
    const bS = R.fx.add(`<g opacity="0">${bubble(c, [tr('Sądzę, że ten,', 'He, I suppose,'), tr('któremu więcej darował', 'to whom he forgave the most')], { size: 20, dir: 1 })}</g>`);
    const bJ = R.fx.add(`<g opacity="0">${bubble(c, tr('Słusznie osądziłeś', 'You have judged correctly'), { size: 20, dir: -1, fill: C.halo })}</g>`);
    const bSee = R.fx.add(`<g opacity="0">${bubble(c, tr('Widzisz tę kobietę?', 'Do you see this woman?'), { size: 21, dir: 1, fill: C.halo })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(t, T, { lit: 1 });
      R.sk2.fade(0.7);
      /* v43a — Simon answers */
      const ans = es(t, 0.08, 0.22) * (1 - es(t, 0.9, 1.0));
      M.table(t, T, { look: es(t, 2.1, 2.3), simonArmF: 30 + ans * 60, simonArmB: 10 + ans * 30, simonHead: 4 + bump(t, 1.1, 1.9) * 10 - es(t, 3.1, 3.3) * 8, simonLean: -es(t, 3.1, 3.3) * 4 });
      const [shx, shy] = headAt(SR7.SX, FLOOR, 0.96, true, 62);
      sv(shx, shy, ans, T, { dir: -1, spread: 1.6 });
      const k0 = es(t, 0.1, 0.22, ease.back) * (1 - es(t, 0.92, 0.98));
      pose(bS, { x: shx - 30, y: shy - 36, s: k0, o: k0 > 0.02 ? 1 : 0 });
      /* v43b — "You have judged rightly" */
      const turn = t > 2.06;
      const speak = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.0)) + es(t, 2.1, 2.2);
      M.jesus.set({ x: JX, y: FLOOR, s: 1.0, flip: turn, armF: 30 + speak * 30 + es(t, 2.1, 2.3) * 30, armB: 10 + bump(t, 1.1, 1.9) * 60, head: turn ? 8 : 4, blink: blinkAt(T) });
      pose(M.legs, { x: JX, y: FLOOR, sx: -1 });
      const [jhx, jhy] = headAt(JX, FLOOR, 1.0, turn, 62);
      jv(jhx, jhy, Math.min(1, speak), T, { dir: turn ? -1 : 1, spread: 1.8 });
      const k1 = es(t, 1.08, 1.2, ease.back) * (1 - es(t, 1.92, 1.98));
      pose(bJ, { x: jhx + 40, y: jhy - 40, s: k1, o: k1 > 0.02 ? 1 : 0 });
      const tkk = es(t, 1.25, 1.4, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(tk, { x: shx - 50, y: shy - 70, s: tkk * 1.4, o: tkk > 0.02 ? 1 : 0 });
      /* v44a — He turns to the woman: "Do you see this woman?" */
      const see = es(t, 2.15, 2.4);
      pose(herGlow, { x: WX + 10, y: FLOOR - 70, s: 0.8 + see * 0.4, o: see * 0.85 });
      const k2 = es(t, 2.18, 2.3, ease.back) * (1 - es(t, 2.92, 2.98));
      pose(bSee, { x: jhx - 40, y: jhy - 44, s: k2, o: k2 > 0.02 ? 1 : 0 });
      /* the woman: bowed at His feet; wipes again (v44b), kisses (v45) */
      const wipe = bump(t, 3.1, 3.9);
      const kissK = bump(t, 4.1, 4.9);
      const lift = es(t, 2.2, 2.4) * (1 - es(t, 3.0, 3.1));
      const lean = 26 + wipe * 22 + kissK * 18 - lift * 20;
      const head = 24 + wipe * 10 + kissK * 8 - lift * 30;
      M.wHair.set({ x: WX, y: FLOOR, s: 0.98, armF: 50 + wipe * 20, armB: 30, lean, head, blink: lift > 0.5 ? blinkAt(T, 6) : 1 });
      pose(M.hairEl, { r: -(lean + head) * 0.8 });
      M.wStand.set({ x: WX, y: FLOOR, o: 0 });
      M.wKneel.set({ x: WX, y: FLOOR, o: 0 });
      pose(M.sheen, { o: 0.9 });
      /* the three cards over Simon, and her gifts at His feet */
      cards.forEach((el, i) => {
        const a = 3.1 + i;
        const k = es(t, a, a + 0.14, ease.back) * (1 - es(t, a + 0.86, a + 0.94));
        pose(el, { x: shx - 90, y: shy - 120 + (T ? Math.sin(T * 1.4 + i) * 3 : 0), s: k, r: T ? Math.sin(T * 0.9 + i) * 3 : 0, o: k > 0.02 ? 1 : 0 });
      });
      const [wfx, wfy] = headAt(WX, FLOOR, 0.98, false, 46);
      tears.forEach((e, i) => {
        const k = T ? ((T * 0.9 + i / 4) % 1) : (i + 0.5) / 4;
        const on = bump(t, 3.1, 3.98);
        pose(e, { x: lerp(wfx + 14 + i * 4, FX - 6 + i * 6, k), y: lerp(wfy + 20, FY - 4, k), o: on * (1 - k * 0.5) });
      });
      shine.forEach((e, i) => { const k = bump(t, 3.2 + i * 0.1, 3.9); pose(e, { x: FX - 10 + i * 12, y: FY - 16, s: 0.6 + k * 0.6, r: T * 40, o: k }); });
      kisses.forEach((k, i) => { const u = T ? ((T * 0.5 + i / 5) % 1) : (i + 0.5) / 5; const on = bump(t, 4.05, 4.98); pose(k, { x: FX - 10 + i * 7 + Math.sin(u * 6 + i) * 6, y: FY - 20 - u * 100, s: 1 + u * 0.4, o: on * Math.sin(u * PI) }); });
      const mk = bump(t, 5.05, 6.4);
      pose(mist, { x: FX + 6, y: FY - 10, s: 0.6 + mk * 0.7, o: mk });
      pose(M.flask, { x: WX - 64, y: FLOOR + 2, s: 1 + bump(t, 5.1, 5.9) * 0.15 });

      S.cam.x = kf(t, [[0, 40], [1.9, 20], [2.2, -30], [6, -20]]);
      S.cam.z = kf(t, [[0, 1.18], [2.2, 1.24]]);
      S.cam.y = kf(t, [[0, 150], [2.2, 170]]);
      if (S.portrait) { S.cam.x = 100; S.cam.z = 0.82; }
    };
  },
};
