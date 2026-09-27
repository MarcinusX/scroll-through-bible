// Mk 10,21–22 — Jesus looks at him and loves him (a warm heart of light between them). "One thing you
// lack": an empty frame hangs where something should be. "Sell, give to the poor": coins fly from the
// loaded cart to the beggars' bowls and rise as stars — treasure in heaven. "Come, follow me": the road
// ahead glows. But his face falls; the stars go out, and he trudges off pulling his heavy cart.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { bush, rock, olive, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { roadSet, TWELVE, LOOK, cart, coin, treasureStar, heart, withFace, faceBits, face, frown, beggarBowl, qmark, footprint } from './lib.js';

const GY = 672;
const JX = 750, MX = 890;
const CARTX = 985, CARTY = GY - 44, CS = 0.85;

export default {
  id: 'm10-sad',
  beats: [
    { v: 21, text: 'Wtedy Jezus spojrzał z miłością na niego i rzekł mu: «Jednego ci brakuje.' },
    { v: 21, cont: true, text: 'Idź, sprzedaj wszystko, co masz, i rozdaj ubogim, a będziesz miał skarb w niebie.' },
    { v: 21, cont: true, text: 'Potem przyjdź i chodź za Mną!»' },
    { v: 22, text: 'Lecz on spochmurniał na te słowa i odszedł zasmucony,' },
    { v: 22, cont: true, text: 'miał bowiem wiele posiadłości.' },
  ],
  cam: { x: [-40, 180], y: [-40, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.24, jerX: 1170, roadX: 820, trees: 18, clouds: [[480, 150, 170], [1000, 120, 120]] });
    const grey = hanging(R.hangL, cloud(c, 150, mix(C.stone2, C.storm, 0.35), mix(C.storm, C.stone2, 0.3)), { x: 900, y: 150, len: 600 });
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1440, 606, 0.9));
    // stars of heavenly treasure
    const skyL = S.layer({ par: 0.08, sh: 2 });
    const STARS = Array.from({ length: 8 }, (_, i) => ({ el: skyL.add(`<g opacity="0">${treasureStar(c, 12 + (i % 3) * 3)}</g>`), x: 470 + i * 95 + c.rr(-20, 20), y: 110 + (i % 3) * 50 + c.rr(-10, 10), i }));
    const frame = hanging(R.hangL, `<g>${sheet().p(c.ribbon(c.arc(0, 0, 44, 44, 0, Math.PI * 2, 36), 5), C.ochre).out()}<circle r="40" fill="${C.cream}" opacity=".35"/><path d="${c.ribbon(c.arc(0, 0, 34, 34, 0, Math.PI * 2, 36), 1.6)}" fill="${C.inkSoft}" stroke-dasharray="4 4" opacity=".5"/><g transform="scale(1.3)">${qmark(c)}</g></g>`, { x: 820, y: 250, len: 700 });

    /* the road ahead lights up */
    const roadL = S.layer({ par: 0.5, sh: 1, flat: true });
    const prints = Array.from({ length: 8 }, (_, i) => ({ el: roadL.add(`<g opacity="0"><circle r="16" fill="url(#halo-glow)"/>${footprint(c, i % 2 === 0)}</g>`), i }));

    /* the poor with their bowls */
    const cartL = S.layer({ par: 0.5, sh: 4 });
    const pL = S.layer({ par: 0.5, sh: 5 });
    const POOR = [
      { o: { robe: mix(C.stone2, C.rock2, 0.4), hairStyle: 'wrap', veil: C.stone2, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin3 }, x: 430 },
      { o: { robe: mix(C.sand2, C.rock2, 0.4), hairStyle: 'veil', veil: C.stone, beard: 'none', skin: C.skin2, hair: C.hair }, x: 520 },
      { o: { robe: mix(C.wood3, C.rock2, 0.5), hairStyle: 'short', beard: 'short', hair: C.hair3, skin: C.skin4 }, x: 610 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), y: GY + 40, p: S.puppet(pL.add(person(c, { ...m.o, pose: 'sit' }))), bowl: pL.add(`<g>${beggarBowl(c)}</g>`) }));
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1], TWELVE[6]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const kneelEl = pL.add(withFace(person(c, { ...LOOK.rich, pose: 'kneel' }), faceBits(c) + frown(c, LOOK.rich.skin)));
    const standEl = pL.add(withFace(person(c, LOOK.rich), faceBits(c) + frown(c, LOOK.rich.skin)));
    const kneeler = S.puppet(kneelEl), walker = S.puppet(standEl);
    const K = cart(c, 190);
    const cartEl = cartL.add(`<g><g class="w1" transform="translate(-40 0)">${K.wheel}</g>${K.body}<g class="w2" transform="translate(50 0)">${K.wheel}</g></g>`);
    const w1 = cartEl.querySelector('.w1'), w2 = cartEl.querySelector('.w2');

    const fxL = S.layer({ par: 0.5, sh: 5 });
    const love = fxL.add(`<g opacity="0"><circle r="70" fill="url(#warm-glow)"/>${heart(c, 20)}</g>`);
    const COINS = Array.from({ length: 9 }, (_, i) => ({ el: fxL.add(`<g opacity="0">${coin(c, 9)}</g>`), i, to: i % 3 }));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 30 });
      const gloom = es(t, 3.0, 3.6);
      R.sk.blend(['#cfe0da', '#efe6cd', '#f6e8cf'], ['#c3ccca', '#e0dccb', '#ecdfc9'], gloom * 0.8);
      swing(grey, 1000 + t * 40, 150 + (1 - gloom) * -500, T, 1.2, 0.7, 3);

      /* beat 0: he looks at him with love — one thing you lack */
      const lv = es(t, 0.05, 0.4) * (1 - es(t, 3.0, 3.3));
      pose(love, { x: (JX + MX) / 2 + 8, y: GY - 175 + Math.sin(T * 1.6) * 3, s: 0.3 + lv * 0.8 + Math.sin(T * 2.4) * 0.03 * lv, o: lv });
      const fr = es(t, 0.35, 0.7, ease.back) * (1 - es(t, 1.0, 1.3));
      swing(frame, 820, 250 - (1 - fr) * 1100, T, 1.2, 0.8, 2);

      /* beat 1: sell, give to the poor — coins fly from the cart to the bowls and rise as stars */
      COINS.forEach((cn) => {
        const k = seg(t, 1.05 + cn.i * 0.05, 1.4 + cn.i * 0.05);
        const p = POOR[cn.to];
        const x0 = CARTX - 10, y0 = CARTY - 130, x1 = p.x + 22, y1 = p.y - 20;
        pose(cn.el, { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(k * Math.PI) * 220, r: k * 540, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const starOn = (1 - es(t, 3.05, 3.5));
      STARS.forEach((st) => {
        const k = es(t, 1.4 + st.i * 0.05, 1.8 + st.i * 0.05);
        pose(st.el, { x: lerp(POOR[st.i % 3].x + 20, st.x, k), y: lerp(GY - 20, st.y, k), s: 0.4 + k * 0.6 + Math.sin(T * 2 + st.i) * 0.05, r: T * 10 + st.i * 20, o: (k > 0 ? Math.min(1, k * 3) : 0) * starOn });
      });
      POOR.forEach((p) => {
        const got = es(t, 1.3 + p.i * 0.05, 1.5 + p.i * 0.05);
        p.p.set({ x: p.x, y: p.y, s: 0.78, armF: 50 + got * 40, armB: got * 60 * (1 - es(t, 3, 3.3)), head: -8 - got * 6, blink: blinkAt(T, p.seed) });
        pose(p.bowl, { x: p.x + 40, y: p.y - 4, s: 0.9 });
      });

      /* beat 2: come, follow me — he turns to the road; footprints glow ahead */
      const follow = es(t, 2.05, 2.35) * (1 - es(t, 3.2, 3.5));
      jesus.set({ x: JX, y: GY, s: 1.02, flip: false, armF: 20 + lv * 20 + bump(t, 1.05, 1.9) * 50 + follow * 70, armB: bump(t, 1.05, 1.9) * 40 + follow * 30, head: -4 + lv * 2 + Math.sin(T * 0.6), blink: blinkAt(T) });
      prints.forEach((pr) => {
        const k = es(t, 2.15 + pr.i * 0.07, 2.35 + pr.i * 0.07);
        pose(pr.el, { x: 820 + pr.i * 30, y: GY + 58 - pr.i * 12 + (pr.i % 2) * 6, s: 0.7 - pr.i * 0.04, o: k * (1 - es(t, 3.1, 3.5)) * 0.9 });
      });
      DIS.forEach((d) => {
        d.p.set({ x: JX - 140 - d.i * 56, y: GY - 44 + (d.i % 2) * 8, s: 0.82, head: -3 + es(t, 3.2, 3.6) * 6, armF: 8 + (d.i === 0 ? bump(t, 4.2, 5) * 30 : 0), blink: blinkAt(T, d.seed) });
      });

      /* beats 3–4: his face falls; he gets up, goes to his cart and pulls it away */
      const sad = es(t, 3.02, 3.25);
      const up = es(t, 3.3, 3.37);
      const toCart = es(t, 3.4, 3.95);
      const shaftX = CARTX + 174 * CS + 6;
      const pull = seg(t, 4.02, 5.6);
      const cx = CARTX + pull * 330;
      const mx = lerp(lerp(MX, shaftX, toCart), cx + 174 * CS + 6, pull > 0 ? 1 : 0);
      kneeler.set({ x: MX, y: GY, s: 0.96, flip: true, o: 1 - up, armF: 44 - sad * 20, armB: 10, head: -6 + sad * 14, blink: blinkAt(T, 4) });
      face(kneelEl, 'sad', sad); face(kneelEl, 'frown', sad);
      const walking = (toCart > 0 && toCart < 1) || (pull > 0 && pull < 1);
      walker.set({ x: mx, y: GY, s: 0.96, flip: toCart < 0.02, o: up, walk: walking ? mx * 0.07 : undefined, lean: pull > 0 ? 12 : 4, head: 16, armF: pull > 0 || toCart > 0.95 ? 70 : 10, armB: pull > 0 || toCart > 0.95 ? 60 : 0, blink: blinkAt(T, 4) });
      face(standEl, 'sad', 1); face(standEl, 'frown', 1);
      pose(cartEl, { x: cx, y: CARTY, s: CS, r: pull > 0 && pull < 1 ? Math.sin(T * 6) * 0.8 : 0 });
      pose(w1, { x: -40, r: pull * 700 });
      pose(w2, { x: 50, r: pull * 700 });

      S.cam.z = 1 + es(t, -0.4, 0.4) * 0.08 - es(t, 0.9, 1.3) * 0.08 + es(t, 3.9, 4.6) * 0.04;
      S.cam.y = -es(t, -0.4, 0.4) * 20 + es(t, 0.9, 1.3) * 20;
      S.cam.x = 20 - es(t, 0.9, 1.3) * 50 + es(t, 3.2, 3.9) * 60 + es(t, 4.1, 4.9) * 80;
    };
  },
};
