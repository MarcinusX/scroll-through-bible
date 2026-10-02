// Mt 14,15–18 — evening on the green hill over the lake; the crowd still stands on the slope. The disciples come:
// "This place is deserted and the hour is late" (the sun sinks) — "send them to the villages to buy food" (the far
// villages light up). "They need not go away: you give them something to eat." — "We have nothing here but five
// loaves and two fish": they rise out of Andrew's basket. "Bring them here to me": Andrew carries the basket to Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { paperLabel } from '../../assets/things.js';
import { hillSet, slopeCrowd, GOLDEN, TW, L6, kf, moving, headAt, hand, speech, GLYPH, coin, loaf, fishCut, basket, sunsetIcon, buyIcon, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'mt14-evening',
  beats: [
    { v: 15, text: 'A gdy nastał wieczór, przystąpili do Niego uczniowie i rzekli:' },
    { v: 15, cont: true, text: '«Miejsce to jest puste i pora już spóźniona.' },
    { v: 15, cont: true, text: 'Każ więc rozejść się tłumom: niech idą do wsi i zakupią sobie żywności!»' },
    { v: 16 },
    { v: 17 },
    { v: 18 },
  ],
  cam: { x: [-40, 40], y: [-20, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const H = hillSet(S, { skyCols: GOLDEN, sunAt: [1200, 170] });
    const { sfn, gfn } = H;
    const warm = S.layer({ par: 0, sh: 1, flat: true });
    warm.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#e79a5f"/>`);
    // lamps coming on in the villages across the lake
    const vglow = H.far.add(`<g><circle cx="330" cy="400" r="90" fill="url(#warm-glow)"/><circle cx="1290" cy="410" r="70" fill="url(#warm-glow)"/></g>`);

    /* the crowd standing on the slope */
    const crowdL = S.layer({ par: 0.3, sh: 3 });
    const GR = slopeCrowd(S, crowdL, sfn, { n: 14, x0: 200, step: 92 });

    /* Jesus and the disciples on the near ground */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [
      { o: TW.john, x: 560, from: 200 }, { o: TW.peter, x: 640, from: 260 },
      { o: TW.andrew, x: 960, from: 1340, andrew: true }, { o: L6.philip, x: P ? 1010 : 1040, from: 1400 }, { o: TW.james, x: P ? 1062 : 1120, from: 1460 },   // phone: James out from under the thread
    ].map((d, i) => {
      const extra = d.andrew ? { holdF: `<g transform="translate(-30 13) rotate(70)">${basket(c, { w: 40, h: 24 })}</g>` } : {};
      const el = L.add(person(c, { ...d.o, ...extra }));
      return { ...d, i, left: d.x < JX, seed: c.rr(0, 9), p: S.puppet(el), hold: el.querySelector('.hold') };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* bubbles, the loaves and fish, the numbers */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const late = fx.add(`<g>${speech(c, sunsetIcon(c), { w: 64, h: 48 })}</g>`);
    const buy = fx.add(`<g>${speech(c, buyIcon(c, coin, loaf), { w: 84, h: 50, flip: true })}</g>`);
    const give = fx.add(`<g>${speech(c, `<g transform="translate(0 10)">${loaf(c, 17)}</g>`, { w: 56, h: 48 })}</g>`);
    const wonder = [0, 1].map(() => fx.add(`<g>${GLYPH.q(c, C.ochre)}</g>`));
    const loaves = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${loaf(c, 17)}</g>`));
    const fishes = [0, 1].map((i) => fx.add(`<g>${fishCut(c, { color: i ? C.lake3 : C.teal2, r: 1 })}</g>`));
    const n5 = fx.add(`<g>${paperLabel('5', { size: 30 })}</g>`);
    const n2 = fx.add(`<g>${paperLabel('2', { size: 30 })}</g>`);
    const bring = fx.add(`<g>${speech(c, `<g transform="translate(0 12)">${basket(c, { w: 36, h: 20, full: true })}</g>`, { w: 58, h: 52 })}</g>`);

    const JY = gfn(JX) + 12;
    const AK = [[5.2, 960], [5.6, JX + 110]];
    return (t, time) => {
      const T = time;
      const lateK = es(t, 0, 2.2);
      warm.fade(0.04 + lateK * 0.1);
      H.update(T, { sunY: 170 + lateK * 190 });
      fade(vglow, es(t, 2.05, 2.4));
      GR.forEach((g) => g.sp.set({ x: g.x, y: g.y, o: 1 }));

      /* v15 — the disciples come to Him */
      DIS.forEach((d) => {
        const inK = es(t, 0.05 + d.i * 0.05, 0.5 + d.i * 0.05);
        const isA = d.andrew;
        const ax = kf(t, AK);
        const x = isA && t > 5 ? ax : lerp(d.from, d.x, inK);
        const walking = (inK > 0 && inK < 1) || (isA && moving(t, AK));
        const surprised = bump(t, 3.1, 3.9);
        const speakLate = d.i === 1 ? bump(t, 1.05, 1.95) : 0;
        const speakBuy = d.i === 3 ? bump(t, 2.05, 2.95) : 0;
        const offer = isA ? es(t, 4.1, 4.3) : 0;
        d.p.set({
          x, y: gfn(x) + 18 + (d.i % 2) * 6, s: 0.94, flip: walking ? !d.left : !d.left, walk: walking ? x * 0.06 + d.i : undefined,
          armF: 20 + speakLate * 70 + speakBuy * 90 + offer * 50, armB: speakLate * 40 + surprised * 50 + speakBuy * 30,
          head: -surprised * 6, lean: -surprised * 5 * (d.left ? 1 : -1) + (isA ? bump(t, 5.6, 5.95) * 12 : 0), blink: blinkAt(T, d.seed),
        });
        if (d.hold) d.hold.setAttribute('opacity', String(es(t, 4.0, 4.1)));
      });
      const point = bump(t, 3.05, 3.95);
      const take = es(t, 5.1, 5.3);
      jesus.set({ x: JX, y: JY, s: 1.04, armF: 20 + point * 70 + take * 60, armB: 10 + point * 30 + bump(t, 2.1, 2.9) * 20 + take * 40, head: point * 4, blink: blinkAt(T, 1) });

      const b = (el, x, y, a, z) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, z, z + 0.1)); pose(el, { x, y, s: k * 1.25, o: k > 0.01 ? 1 : 0 }); };
      const [px, py] = headAt(640, gfn(640) + 24, 0.94, false);
      b(late, px + 24, py - 18, 1.15, 1.92);
      const [fx_, fy] = headAt(DIS[3].x, gfn(DIS[3].x) + 18, 0.94, true);
      b(buy, fx_ - 24, fy - 18, 2.15, 2.92);
      const [jx, jy] = headAt(JX, JY, 1.04, false);
      b(give, jx + 26, jy - 18, 3.12, 3.92);
      wonder.forEach((w, i) => {
        const k = es(t, 3.3 + i * 0.1, 3.5 + i * 0.1, ease.back) * (1 - es(t, 3.9, 4.0));
        const d = DIS[[1, 3][i]];
        const [hx, hy] = headAt(d.x, gfn(d.x) + 20, 0.94, !d.left);
        pose(w, { x: hx, y: hy - 40, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v17 — five loaves and two fish rise from Andrew's basket; v18 — they go back in and He takes them */
      const [bx, by] = hand(960, gfn(960) + 18, 0.94, true, 70);
      const back = es(t, 5.05, 5.25);
      loaves.forEach((l, i) => {
        const k = es(t, 4.15 + i * 0.06, 4.4 + i * 0.06, ease.back) * (1 - back);
        const a = PI * (1.1 + i * 0.12);
        pose(l, { x: lerp(bx, 880 + Math.cos(a) * 120, k), y: lerp(by, 470 + Math.sin(a) * 60, k), s: 0.4 + k * 0.9, o: k > 0.02 ? 1 : 0 });
      });
      fishes.forEach((f, i) => {
        const k = es(t, 4.45 + i * 0.08, 4.7 + i * 0.08, ease.back) * (1 - back);
        pose(f, { x: lerp(bx, (P ? 985 + i * 60 : 1070 + i * 80), k), y: lerp(by, 440 - i * 14, k), s: 0.4 + k * 0.9, r: -10 + i * 20, o: k > 0.02 ? 1 : 0 });
      });
      const k5 = es(t, 4.4, 4.55, ease.back) * (1 - back), k2 = es(t, 4.7, 4.85, ease.back) * (1 - back);
      pose(n5, { x: 750, y: 420, s: k5, o: k5 > 0.01 ? 1 : 0 });
      pose(n2, { x: P ? 1045 : 1180, y: P ? 370 : 400,   // phone: the 2 over the second fish, not off the edge
        s: k2, o: k2 > 0.01 ? 1 : 0 });
      const bk = es(t, 5.08, 5.25, ease.back) * (1 - es(t, 5.6, 5.7));
      pose(bring, { x: jx + 26, y: jy - 18, s: bk, o: bk > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.06], [3.0, 1.08], [4.0, 1.04], [5.0, 1.1], [5.6, 1.12]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 30], [4.0, 20], [5.0, 40]]);
      S.cam.x = kf(t, [[0, 0], [1, -20], [2, 20], [3, 0], [4, 20], [5, 10]]);
    };
  },
};
