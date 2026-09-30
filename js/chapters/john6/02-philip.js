// J 6,5–7 — on the mountain. Jesus lifts His eyes: crowds pour over the ridge and come down towards Him.
// He turns to Philip — "Where shall we buy bread?" — a warm beam falls on Philip, who scratches his head: it
// was a test. Above Jesus a small golden thought shows what He already knew (loaves without end, baskets).
// Philip counts: two hundred denarii — the coins become a few loaves, the loaves become crumbs, and the
// crumbs run out long before the crowd does.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { hillSet, SPRING, LOOK, TW, folk, group, scatter, speech, thought, GLYPH, coin, coinStack, barleyLoaf, crumb, basket, headAt, hand, labelTag, question, sparkle, tr, PI } from './lib.js';

const JX = 800;

export default {
  id: 'j6-philip',
  beats: [
    { v: 5, text: 'Kiedy więc Jezus podniósł oczy i ujrzał, że liczne tłumy schodzą do Niego,' },
    { v: 5, cont: true, text: 'rzekł do Filipa: «Skąd kupimy chleba, aby oni się posilili?»' },
    { v: 6, text: 'A mówił to wystawiając go na próbę.' },
    { v: 6, cont: true, text: 'Wiedział bowiem, co miał czynić.' },
    { v: 7 },
  ],
  cam: { x: [-30, 30], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = hillSet(S, { skyCols: SPRING });
    const { sfn, gfn } = H;

    /* the crowds coming over the ridge and down the meadow */
    const crowdL = S.layer({ par: 0.3, sh: 3 });
    const GR = Array.from({ length: 13 }, (_, i) => {
      const x = 250 + i * 95 + c.rr(-24, 24);
      const mem = Array.from({ length: 5 }, (_, k) => ({ x: (k - 2) * 24 + c.rr(-6, 6), y: c.rr(-10, 10), s: 1, flip: x > JX, o: folk(c) }));
      const dy = (i % 2) * 34 + c.rr(14, 30), s1 = 0.34 + dy * 0.0024;
      // drawn at the size they arrive at; they walk down on the compositor (never repainted)
      return { i, x, d: c.rr(0, 0.3), dy, s1, sp: crowdL.sprite(`<g transform="scale(${s1.toFixed(4)})">${group(c, mem)}</g>`, x + (JX - x) * 0.08, sfn(x) + dy) };
    });
    // the ones who get a crumb, and the question marks of those who don't
    const fx0 = S.layer({ par: 0.32, sh: 4 });
    const crumbs = GR.map((g) => ({ g, el: fx0.add(`<g>${crumb(c, 7)}</g>`) }));
    const qs = GR.map(() => fx0.add(`<g>${labelTag('?', 16)}</g>`));

    /* Jesus seated on the knoll with the disciples; Philip standing */
    const L = S.layer({ par: 0.5, sh: 5 });
    const SEAT = [[-250, TW.james, false], [-175, TW.andrew, false], [-100, TW.peter, false], [290, TW.john, true]];
    const seated = SEAT.map(([dx, o, fl], i) => ({ i, x: JX + dx, fl, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))) }));
    const beam = L.add(`<path d="${c.poly([[-26, -560], [26, -560], [110, 0], [-110, 0]])}" fill="#fff4d0" opacity="0"/>`);
    const philip = S.puppet(L.add(person(c, { ...LOOK.philip })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    /* bubbles and the counting */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-16 10)">${barleyLoaf(c, 14)}</g><g transform="translate(18 0) scale(.9)">${GLYPH.q(c)}</g>`, { w: 84, h: 56 })}</g>`);
    const puzzled = fx.add(`<g>${thought(c, `<g transform="scale(1.1)">${GLYPH.q(c)}</g>`, { w: 56, h: 46 })}</g>`);
    // what He knew: a golden thought with loaves and baskets
    const knewInner = `<circle r="54" fill="url(#halo-glow)"/><g transform="translate(-26 18)">${basket(c, { w: 34, h: 20, full: true })}</g><g transform="translate(8 20)">${basket(c, { w: 34, h: 20, full: true })}</g><g transform="translate(-10 -6)">${barleyLoaf(c, 12)}</g><g transform="translate(18 -10)">${barleyLoaf(c, 11)}</g>`;
    const knew = fx.add(`<g>${thought(c, knewInner, { w: 112, h: 84, fill: mix(C.cream, C.halo, 0.5) })}</g>`);
    const knewSparks = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    // two hundred denarii
    const coins = [[-60, 9], [-30, 12], [0, 14], [30, 11], [60, 8]].map(([x, n], i) => ({ x, i, el: fx.add(`<g>${coinStack(c, n, 11)}</g>`) }));
    const d200 = fx.add(`<g>${labelTag(tr('200 denarów', '200 denarii'), 20)}</g>`);
    const loaves = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: fx.add(`<g>${barleyLoaf(c, 14)}</g>`) }));
    const say7 = fx.add(`<g>${speech(c, `<g transform="translate(-14 4)">${coin(c, 9)}</g><path d="${c.ribbon([[-2, 2], [8, 2]], 2.4)}" fill="${C.ink}"/><path d="M8 -3L14 2L8 7Z" fill="${C.ink}"/><g transform="translate(24 10)">${crumb(c, 6)}</g>`, { w: 80, h: 48, flip: true })}</g>`);

    const CX = S.portrait ? 985 : 1080;   // phone: the counting stays inside the screen
    return (t, time) => {
      const T = time;
      H.update(T);

      /* v5a — He lifts His eyes: the crowds come down to Him */
      const see = es(t, 0.05, 0.35);
      GR.forEach((g) => {
        const k = es(t, 0.1 + g.d, 0.85 + g.d, ease.out);
        const y = lerp(sfn(g.x) - 10, sfn(g.x) + g.dy, k);
        g.sp.set({ x: g.x + (JX - g.x) * 0.08 * k, y: y + (k > 0 && k < 1 ? -Math.abs(Math.sin(k * 30 + g.i)) * 2 : 0), s: lerp(0.26, g.s1, k) / g.s1, o: seg(t, 0.08 + g.d, 0.2 + g.d) });
      });

      /* v5b — He turns to Philip */
      const turn = es(t, 1.05, 1.3);
      const askK = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.95, 2.1));
      /* v6a — a test: a warm beam on Philip, who scratches his head */
      const test = es(t, 2.05, 2.35) * (1 - es(t, 2.9, 3.1));
      const scratch = es(t, 2.15, 2.35) * (1 - es(t, 3.9, 4.05));
      /* v6b — He knew what He would do */
      const kn = es(t, 3.1, 3.4, ease.back) * (1 - es(t, 3.92, 4.05));
      /* v7 — Philip counts it out */
      const count = es(t, 4.05, 4.3);
      const PX = 960, PY = gfn(PX) + 14;
      philip.set({ x: PX, y: PY, s: 1.0, flip: true, armF: 20 + bump(t, 1.2, 1.9) * 30 + count * 70 + Math.sin(T * 4) * 8 * count, armB: scratch * 150 + bump(t, 4.3, 4.9) * 60, head: -scratch * 10 + bump(t, 1.2, 1.9) * 4 + count * 4, lean: -scratch * 3, blink: blinkAt(T, 3) });
      pose(beam, { x: PX, y: PY + 4, o: test * 0.45 });
      jesus.set({ x: JX, y: gfn(JX) + 10, s: 1.04, flip: false, armF: 20 + turn * 50 - kn * 20, armB: 10 + turn * 20, head: -see * 14 * (1 - turn) + turn * 4 - kn * 6, blink: blinkAt(T, 1) });
      seated.forEach((d) => d.p.set({ x: d.x, y: gfn(d.x) + 14, s: 0.94, flip: d.fl, armF: 20 + see * 20 + (d.i % 2) * 20, armB: 10 + see * (d.i === 2 ? 60 : 0), head: -see * 8 + (d.fl ? 0 : turn * 4), blink: blinkAt(T, d.seed) }));

      const [jhx, jhy] = headAt(JX, gfn(JX) + 10, 1.04, false, 62);
      pose(ask, { x: jhx + 28, y: jhy - 18, s: askK, o: askK > 0.01 ? 1 : 0 });
      const [phx, phy] = headAt(PX, PY, 1.0, true);
      const pz = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(puzzled, { x: phx + 6, y: phy - 20, s: pz, o: pz > 0.01 ? 1 : 0 });
      pose(knew, { x: jhx - 20, y: jhy - 30, s: kn, o: kn > 0.01 ? 1 : 0 });
      knewSparks.forEach((sp, i) => {
        const a = (i / 4) * PI * 2 + T * 0.6;
        pose(sp, { x: jhx - 4 + Math.cos(a) * 70, y: jhy - 90 + Math.sin(a) * 44, s: kn * 0.9, r: T * 50, o: kn });
      });

      /* v7 — two hundred denarii would not be enough */
      const sayK = es(t, 4.05, 4.25, ease.back) * (1 - es(t, 4.75, 4.9));
      pose(say7, { x: phx - 26, y: phy - 18, s: sayK, o: sayK > 0.01 ? 1 : 0 });
      const cz = es(t, 4.08, 4.3, ease.out);
      coins.forEach((co) => pose(co.el, { x: CX + co.x, y: lerp(120, 250, es(t, 4.08 + co.i * 0.03, 4.28 + co.i * 0.03, ease.out)), s: 1.1, o: cz }));
      pose(d200, { x: CX, y: 282, s: cz, o: cz > 0.01 ? 1 : 0 });
      const lv = es(t, 4.28, 4.4, ease.back);
      loaves.forEach((l) => pose(l.el, { x: CX + (l.i - 2.5) * 30, y: 336 - (l.i % 2) * 6, s: lv, o: lv > 0.01 ? 1 - es(t, 4.4 + l.i * 0.03, 4.46 + l.i * 0.03) * 0.75 : 0 }));
      crumbs.forEach((cb, i) => {
        const a = 4.38 + i * 0.025, k = es(t, a, a + 0.14);
        const got = i % 4 === 1;
        const g = cb.g, gy = sfn(g.x) + g.dy - 36;
        pose(cb.el, { x: lerp(CX, g.x + (JX - g.x) * 0.08, k), y: lerp(336, gy, k) - Math.sin(k * PI) * 60, s: 0.8, r: k * 200, o: got && k > 0 ? 1 : 0 });
        const q = es(t, 4.52 + i * 0.015, 4.62 + i * 0.015, ease.back);
        pose(qs[i], { x: g.x + (JX - g.x) * 0.08, y: gy - 14, s: got ? 0 : q * 0.9, r: Math.sin(T * 2 + i) * 8, o: !got && q > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1.04 + es(t, 0.9, 1.3) * 0.04 + es(t, 3.0, 3.4) * 0.02 - es(t, 4.1, 4.4) * 0.05;
      S.cam.y = 30 - es(t, 0, 0.6) * 20 + es(t, 0.9, 1.3) * 20 - es(t, 4.1, 4.4) * 20;
      S.cam.x = es(t, 1.9, 2.3) * 20 * (1 - es(t, 3.0, 3.3)) + es(t, 4.0, 4.3) * 20;
    };
  },
};
