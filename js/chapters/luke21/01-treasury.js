// Łk 21,1–4 — the curtains open on the Temple court: Jesus teaching the people. He looks up and sees the rich
// putting their gifts into the trumpet-mouthed offering chests: they come in their fine mantles and pour out handfuls
// that ring in the bronze. Then a poor widow comes slowly and lets two tiny copper coins fall — a round lens comes down
// over her to show them: two little coins on a thin open palm. "Truly I tell you, this poor widow has put in more than
// all of them": Jesus points to her, and a balance comes down from the flies, a heap of gold on one pan, her
// two coins on the other — and the beam tips towards her. "All these put in out of their abundance": the rich stroll
// back, purses still fat. "But she, out of her poverty, put in all that she had to live on": she turns her purse out —
// nothing left — and on the pan her two coins shine.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, WIDOW, rich, trumpetChest, purse, lepton, coin, coinStack, balance, strip, sparkle, knot, handAt, headAt,
  warm, onString, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const GY = TT.GY;
const JX0 = 610;                // Jesus stands here, the chests to His right
const CH0 = [872, 1004, 1136];  // the chests
const CY = 684;                 // they stand here
const CS = 1.12;
const MOUTH = CY - 118 * CS;    // the trumpet mouths
const WX0 = 1072;               // the widow stops here (by the middle chest)
const BX = 820, BY = 208, ARM = 150;

/** an open palm (seen from above, fingers up) with two copper coins on it; origin: centre of the palm */
function palmCoins(c) {
  const s = sheet();
  const sk = C.skin2, sk2 = shade(C.skin2, -0.1);
  s.p(c.cut([[-36, 110], [-30, 40], [-32, 18], [32, 18], [34, 40], [38, 110]], 0.6, 6), mix(WIDOW.robe, C.stone, 0.25));
  s.x(c.ribbon([[-32, 24], [33, 24]], 3), shade(WIDOW.robe, -0.2), 'opacity=".6"');
  s.p(c.cut([[-30, 22], [-34, -10], [-30, -34], [-12, -42], [14, -42], [30, -34], [33, -10], [30, 22]], 0.5, 5), sk);
  [[-24, -38, 7.5, 26], [-8, -44, 7.5, 32], [8, -44, 7.5, 30], [23, -38, 6.5, 22]].forEach(([x, y, w, h]) => s.p(c.cut(c.ell(x, y - h * 0.55, w, h * 0.7, 14), 0.3, 4), sk));
  s.p(c.cut(c.ell(38, -4, 7, 20, 14, -0.8), 0.3, 4), sk);
  s.x(c.ribbon(c.arc(0, 2, 22, 14, 0.2, PI - 0.2, 8), 1.4) + c.ribbon([[-15, -40], [-15, -46]], 1) + c.ribbon([[0, -42], [0, -48]], 1) + c.ribbon([[15, -40], [15, -46]], 1), sk2, 'opacity=".7"');
  const cu = mix(C.clay, C.sun, 0.3);
  const cn = (x, y) => sheet().p(c.cut(c.circ(x, y, 15, 18), 0.2, 3), shade(cu, -0.25)).p(c.cut(c.circ(x, y, 12.5, 16), 0.2, 3), cu).p(c.cut(c.circ(x, y, 7, 12), 0.2, 3), shade(cu, -0.12)).x(c.poly(c.circ(x - 5, y - 5, 3, 6)), shade(cu, 0.5)).out();
  return s.out() + cn(-12, -8) + cn(14, -2);
}

export default {
  id: 'lk21-treasury',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3 },
    { v: 4, text: 'Wszyscy bowiem wrzucali na ofiarę z tego, co im zbywało;' },
    { v: 4, cont: true, text: 'ta zaś z niedostatku swego wrzuciła wszystko, co miała na utrzymanie».' },
  ],
  cam: { x: [-20, 60], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const T0 = templeTeach(S, { crowd: false, dis: false, jesus: false });
    const c = S.c;
    // on a phone the whole court draws together: the people, Peter, John and Jesus further right, the chests closer
    // together and further left, so neither the listeners nor the rich and the widow are cut off by the frame
    const PT = S.portrait;
    const JX = PT ? 726 : JX0;
    const CH = PT ? [840, 935, 1030] : CH0;
    const WX = PT ? CH[1] + 68 : WX0;
    const KX = PT ? [554, 568] : [300, 400];          // the knots of people
    const DX = PT ? [630, 672] : [462, 514];          // Peter, John
    const RX = PT ? [856, 86] : [900, 96];             // where the rich stroll back to (v4a): x0, step

    /* the people Jesus is teaching, on the left */
    const L = T0.crowdL;
    const kStand = L.sprite(knot('lk21-tr-a', 6, { s: 0.9, spread: PT ? 34 : 46, rows: 2, flip: false }), KX[0], GY - 6);
    const kSit = L.sprite(knot('lk21-tr-b', 3, { s: 0.92, spread: PT ? 36 : 50, rows: 1, flip: false, pose: 'sit' }), KX[1], GY + 40);

    /* the offering chests */
    const chL = S.layer({ par: 0.47, sh: 5 });
    CH.forEach((x) => chL.add(`<g transform="translate(${x} ${CY}) scale(${CS})">${trumpetChest(c)}</g>`));
    const rings = CH.map(() => [0, 1].map(() => chL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 30, 10, PI * 1.1, PI * 1.9, 10), 3)}" fill="${C.sun}"/></g>`)));

    /* the balance */
    const balL = T0.FL;
    const B = balance(c, { arm: ARM, h: 260, drop: 84 });
    const beamEl = balL.add(`<g><path d="M0 -1600V-20" stroke="rgba(74,54,34,.6)" stroke-width="1.4" fill="none"/>${B.beam}</g>`);
    const heapM = [-36, -16, 4, 24, 42].map((x, i) => `<g transform="translate(${x} ${B.drop})">${coinStack(c, 5 + (i % 3) * 2, 9)}</g>`).join('');
    const panL = balL.add(`<g>${B.pan}${heapM}</g>`);
    const panR = balL.add(`<g>${B.pan}<g data-part="glow" opacity="0">${warm(56)}</g><g transform="translate(-8 ${B.drop - 5})">${lepton(c, 5.5)}</g><g transform="translate(8 ${B.drop - 5})">${lepton(c, 5.5)}</g></g>`);
    const panRglow = panR.querySelector('[data-part="glow"]');
    const labels = [balL.add(`<g>${strip(c, tr('z tego, co im zbywało', 'out of their abundance'), { size: 16 })}</g>`), balL.add(`<g>${strip(c, tr('wszystko, co miała na utrzymanie', 'all that she had to live on'), { size: 16 })}</g>`)];
    const sparks = [0, 1, 2, 3].map(() => T0.bits.add(`<g>${sparkle(c, 10)}</g>`));

    /* the lens over the widow: her palm with the two coins */
    const lens = T0.bits.add(`<g>${onString(`<g transform="translate(0 86)">${sheet().p(c.cut(c.circ(0, 0, 86, 40), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, 78, 40), 0.4, 5), mix(C.parchment, C.dawn, 0.3)).out()}<g transform="translate(0 30) scale(.95)">${palmCoins(c)}</g></g>`, 1600)}</g>`);
    const lensTag = T0.bits.add(`<g>${strip(c, tr('dwa pieniążki', 'two small coins'), { size: 16 })}</g>`);

    /* the actors */
    const A = T0.act;
    const peter = S.puppet(A.add(person(c, CAST.peter)));
    const john = S.puppet(A.add(person(c, CAST.john)));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const richP = [0, 1, 2].map((i) => ({ i, p: S.puppet(A.add(person(c, { ...rich(i), holdF: `<g transform="translate(0 -2)">${purse(c)}</g>` }))), seed: c.rr(0, 9), ch: [0, 2, 1][i] }));
    const widow = S.puppet(A.add(person(c, WIDOW)));
    const wPurse = A.add(`<g>${purse(c, { full: false, col: mix(C.leather, C.stone2, 0.4) })}</g>`);
    const coins = Array.from({ length: 9 }, () => A.add(`<g>${coin(c, 7)}</g>`));
    const lepta = [0, 1].map(() => A.add(`<g>${lepton(c, 4.8)}</g>`));
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      T0.update(t, T, { sunDY: es(t, 4.0, 5.8) * 60 });
      T0.sk.blend(['#d3dfd6', '#f2e2c4', '#f6dcbc'], ['#dcc3a3', '#f2d3a2', '#f7e2bd'], es(t, 4.0, 5.8) * 0.8);
      kStand.set({ x: KX[0], y: GY - 6 });
      kSit.set({ x: KX[1], y: GY + 40 });

      /* cover — He teaches; v1 — He looks up and sees the rich at the chests */
      const look = es(t, 1.02, 1.3);
      const say = es(t, 3.1, 3.4);
      jesus.set({
        x: JX, y: GY, s: TT.JS, flip: false,
        armF: 20 + bump(t, 0.2, 1.0) * 50 + say * 70 * (1 - es(t, 3.9, 4.1) * 0.5) + es(t, 5.1, 5.3) * 20, armB: 10 + bump(t, 0.2, 1.0) * 70 + bump(t, 4.1, 4.9) * 60,
        head: -look * 6 + es(t, 2.1, 2.3) * 4 , blink: blinkAt(T),
      });
      const [hx, hy] = headAt(JX, GY, TT.JS, false);
      T0.voice(hx, hy, bump(t, 0.1, 1.0) * 0.8 + es(t, 3.05, 3.3) * (1 - es(t, 5.8, 6)) * 0.7, T, { dir: 1, spread: 1.8 });
      peter.set({ x: DX[0], y: GY + 12, s: 0.98, flip: false, head: -4 - look * 4 , armF: bump(t, 4.6, 5.0) * 20, blink: blinkAt(T, 3) });
      john.set({ x: DX[1], y: GY + 18, s: 0.96, flip: false, head: -4 - look * 6, blink: blinkAt(T, 5) });

      // coins in the air: k 0..1 along the fall from a hand to a chest mouth
      let ci = 0;
      const drop = (x0, y0, x1, k) => {
        if (ci >= coins.length) return;
        const el = coins[ci++];
        if (k <= 0 || k >= 1) { pose(el, { o: 0 }); return; }
        pose(el, { x: lerp(x0, x1, k), y: lerp(y0, MOUTH + 6, k) - Math.sin(k * PI) * 22, r: k * 400, o: 1 });
      };
      const ring = (i, a) => rings[i].forEach((el, j) => { const k = seg(t, a + j * 0.05, a + 0.3 + j * 0.05); pose(el, { x: CH[i], y: MOUTH - 4 - k * 18, s: 0.6 + k * 1.2, o: bump(t, a + j * 0.05, a + 0.3 + j * 0.05) }); });

      /* v1 — the rich pour in their gifts; v4a — they stroll back, purses still fat */
      richP.forEach((r) => {
        const a = 1.02 + r.i * 0.2;
        const k = es(t, a, a + 0.66, (u) => u);
        const cx = CH[r.ch];
        const x = k < 0.35 ? lerp(1500 + r.i * 40, cx + 52, k / 0.35) : k < 0.65 ? cx + 52 : lerp(cx + 52, 1560, (k - 0.65) / 0.35);
        const pour = bump(k, 0.33, 0.67);
        const again = es(t, 4.05 + r.i * 0.08, 4.5 + r.i * 0.08), away = es(t, 5.0, 5.45, ease.in);
        const x2 = lerp(lerp(1540 + r.i * 60, RX[0] + r.i * RX[1], again), 1600 + r.i * 60, away);
        const show = again > 0 && away < 1;
        const walking = (show && ((again > 0 && again < 1) || away > 0)) || (k > 0 && k < 0.35) || (k > 0.65 && k < 1);
        r.p.set({
          x: show ? x2 : x, y: GY + 4 + (r.i % 2) * 8, s: 0.98, flip: show ? away <= 0 : k <= 0.65,
          walk: walking ? (show ? x2 : x) * 0.05 + r.i : undefined,
          armF: show ? 58 : 20 + pour * 110, head: pour * -14 + (show ? -8 : 0), lean: show ? -4 : 0,
          blink: blinkAt(T, r.seed), o: (k > 0 && k < 1) || show ? 1 : 0,
        });
        const [px, py] = handAt(cx + 52, GY + 4, 0.98, true, 130);
        for (let j = 0; j < 3; j++) drop(px, py + 20, cx, seg(k, 0.4 + j * 0.07, 0.52 + j * 0.07));
        ring(r.ch, a + 0.66 * 0.4);
      });
      while (ci < coins.length) pose(coins[ci++], { o: 0 });

      /* v2 — the widow: slowly, two tiny coins; the lens shows them */
      const wIn = es(t, 2.02, 2.45, (u) => u);
      const wx = lerp(1480, WX, ease.out(wIn));
      const give = bump(t, 2.45, 2.9);
      const turnOut = es(t, 5.1, 5.35);
      widow.set({ x: wx, y: GY + 6, s: 0.86, flip: true, walk: wIn > 0 && wIn < 1 ? wx * 0.035 : undefined, amt: 0.6, lean: 6 - give * 4, head: 8 - bump(t, 3.2, 4.0) * 6, armF: 20 + give * 60 + turnOut * 70, armB: 10, blink: blinkAt(T, 3), o: wIn > 0 ? 1 : 0 });
      lepta.forEach((el, i) => {
        const k = seg(t, 2.6 + i * 0.1, 2.8 + i * 0.1);
        const [lx, ly] = handAt(WX, GY + 6, 0.86, true, 75);
        pose(el, { x: lerp(lx, CH[1] + 3 * i, k), y: lerp(ly, MOUTH + 4, k) - Math.sin(k * PI) * 14, o: k > 0 && k < 1 ? 1 : 0, s: 1.3 });
      });
      ring(1, 2.78);
      const lk = es(t, 2.2, 2.45, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      const ly0 = lerp(-1300, 110, lk);
      pose(lens, { x: WX - 42, y: ly0, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: lk > 0.002 ? 1 : 0 });
      const tg = es(t, 2.35, 2.5, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(lensTag, { x: WX - 42, y: ly0 + 196, s: tg, o: tg > 0.02 ? 1 : 0 });
      // her flat purse, turned out at the end: nothing left
      const [qx, qy] = handAt(wx, GY + 6, 0.86, true, 20 + turnOut * 70);
      pose(wPurse, { x: qx, y: qy - 4, r: turnOut * 170, s: 0.8, o: wIn >= 1 ? 1 : 0 });

      /* v3 — the balance comes down and tips towards her two coins */
      const bd = es(t, 3.05, 3.4, ease.out);
      const tip = lerp(-13, 14, es(t, 3.45, 3.85, ease.back)) + (T ? Math.sin(T * 1.1) * 0.5 : 0);
      const by = lerp(-900, BY, bd);
      const ang = (tip * PI) / 180;
      pose(beamEl, { x: BX, y: by, r: tip, o: bd > 0.002 ? 1 : 0 });
      const [lxp, lyp] = [BX - Math.cos(ang) * ARM, by - Math.sin(ang) * ARM];
      const [rxp, ryp] = [BX + Math.cos(ang) * ARM, by + Math.sin(ang) * ARM];
      pose(panL, { x: lxp, y: lyp, o: bd > 0.002 ? 1 : 0 });
      pose(panR, { x: rxp, y: ryp, o: bd > 0.002 ? 1 : 0 });
      fade(panRglow, Math.max(es(t, 3.7, 4.0) * 0.5, es(t, 5.1, 5.5)));
      labels.forEach((el, i) => {
        const k = es(t, 4.05 + i, 4.25 + i, ease.back);
        pose(el, { x: i ? rxp : lxp, y: (i ? ryp : lyp) + B.drop + 44, s: k, o: k > 0.02 ? 1 : 0 });
      });
      sparks.forEach((el, i) => {
        const k = T ? ((T * 0.35 + i / 4) % 1) : 0.5;
        pose(el, { x: rxp - 30 + i * 20 + Math.sin(k * 6 + i) * 6, y: ryp + B.drop - 10 - k * 70, s: 0.7, o: es(t, 5.15, 5.5) * Math.sin(k * PI) });
      });

      S.cam.x = es(t, 1.8, 2.4) * 50 * (1 - es(t, 2.95, 3.3)) + es(t, 5.0, 5.8) * 20;
      S.cam.z = 1 + es(t, 1.8, 2.4) * 0.06 * (1 - es(t, 2.95, 3.3)) + es(t, 5.0, 5.8) * 0.03;
      S.cam.y = -es(t, 3.0, 3.4) * 20 * (1 - es(t, 5.0, 5.8));
    };
  },
};
