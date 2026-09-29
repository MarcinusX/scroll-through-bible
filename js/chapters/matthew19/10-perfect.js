// Mt 19,21–22 — "If you would be perfect, go, sell what you have and give to the poor": coins fly from his loaded cart
// into the bowls of the poor sitting by the road — and rise from there as stars: treasure in heaven. "Then come,
// follow Me": footprints of light glow along the road ahead. But he hears it and his face falls; a grey cloud
// crosses the sun, the stars go out, and he goes away sad, pulling his heavy cart — for he had great possessions:
// his houses, his fields and his flocks float over him in a cloud of thought.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix, hanging, swing } from '../kit.js';
import { bush, rock, olive, cloud, house } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, TWELVE, LOOK, cart, coin, treasureStar, heart, withFace, faceBits, face, frown, beggarBowl, footprint, thought, field, sack } from './lib.js';
import { sheep } from '../mark6/lib.js';

const GY = 672;
const JX = 760, MX = 900;
const CARTX = 960, CARTY = GY - 44, CS = 0.85;
const GREY = ['#c3ccca', '#e0dccb', '#ecdfc9'];

export default {
  id: 'mt19-perfect',
  beats: [
    { v: 21, text: 'Jezus mu odpowiedział: «Jeśli chcesz być doskonały, idź, sprzedaj, co posiadasz, i rozdaj ubogim,' },
    { v: 21, cont: true, text: 'a będziesz miał skarb w niebie.' },
    { v: 21, cont: true, text: 'Potem przyjdź i chodź za Mną!»' },
    { v: 22, text: 'Gdy młodzieniec usłyszał te słowa, odszedł zasmucony,' },
    { v: 22, cont: true, text: 'miał bowiem wiele posiadłości.' },
  ],
  cam: { x: [-40, 260], y: [-40, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { sky2: GREY, jer: 0.23, jerX: 1170, roadX: 820, trees: 18, clouds: [[480, 150, 170], [1000, 120, 120]] });
    const grey = hanging(R.hangL, cloud(c, 170, mix(C.stone2, C.storm, 0.35), mix(C.storm, C.stone2, 0.3)), { x: 1200, y: 150, len: 600 });
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1) + olive(c, 1460, 606, 0.9));
    const skyL = S.layer({ par: 0.08, sh: 2 });
    const STARS = Array.from({ length: 8 }, (_, i) => ({ el: skyL.add(`<g opacity="0">${treasureStar(c, 12 + (i % 3) * 3)}</g>`), x: 520 + i * 90 + c.rr(-20, 20), y: 110 + (i % 3) * 50 + c.rr(-10, 10), i }));

    /* the road ahead lights up */
    const roadL = S.layer({ par: 0.5, sh: 1, flat: true });
    const prints = Array.from({ length: 8 }, (_, i) => ({ el: roadL.add(`<g opacity="0"><circle r="16" fill="url(#halo-glow)"/>${footprint(c, i % 2 === 0)}</g>`), i }));

    /* the poor with their bowls, the disciples, Jesus, the young man and his cart */
    const cartL = S.layer({ par: 0.5, sh: 4 });
    const pL = S.layer({ par: 0.5, sh: 5 });
    const POOR = [
      { o: { robe: mix(C.stone2, C.rock2, 0.4), hairStyle: 'wrap', veil: C.stone2, beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin3 }, x: 440 },
      { o: { robe: mix(C.sand2, C.rock2, 0.4), hairStyle: 'veil', veil: C.stone, beard: 'none', skin: C.skin2, hair: C.hair }, x: 530 },
      { o: { robe: mix(C.wood3, C.rock2, 0.5), hairStyle: 'short', beard: 'short', hair: C.hair3, skin: C.skin4 }, x: 620 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), y: GY + 40, p: S.puppet(pL.add(person(c, { ...m.o, pose: 'sit' }))), bowl: pL.add(`<g>${beggarBowl(c)}</g>`) }));
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[2], TWELVE[1], TWELVE[6]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, d.o))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const manEl = pL.add(withFace(person(c, LOOK.rich), faceBits(c) + frown(c, LOOK.rich.skin)));
    const man = S.puppet(manEl);
    const K = cart(c, 190);
    const cartEl = cartL.add(`<g><g class="w1" transform="translate(-40 0)">${K.wheel}</g>${K.body}<g class="w2" transform="translate(50 0)">${K.wheel}</g></g>`);
    const w1 = cartEl.querySelector('.w1'), w2 = cartEl.querySelector('.w2');

    const fxL = S.layer({ par: 0.5, sh: 5 });
    const love = fxL.add(`<g opacity="0"><circle r="70" fill="url(#warm-glow)"/>${heart(c, 20)}</g>`);
    const COINS = Array.from({ length: 9 }, (_, i) => ({ el: fxL.add(`<g opacity="0">${coin(c, 9)}</g>`), i, to: i % 3 }));
    // his possessions: a cloud of thought with houses, a field and a flock
    const goods = `<g transform="translate(-34 8)">${house(c, 0, 0, 36, 28, { stairs: false })}</g><g transform="translate(-6 10)">${house(c, 0, 0, 30, 24, { stairs: false })}</g><g transform="translate(36 12)">${field(c, 44)}</g><g transform="translate(-24 34) scale(.32)">${sheep(c)}</g><g transform="translate(4 36) scale(.3)">${sheep(c)}</g><g transform="translate(30 36) scale(.32)">${sack(c, 40)}</g>`;
    const riches = fxL.add(`<g opacity="0">${thought(c, `<g transform="translate(0 -12)">${goods}</g>`, { w: 150, h: 96 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 30 });
      const gloom = es(t, 3.0, 3.6);
      R.sk2.layer.fade(gloom * 0.8);
      swing(grey, 1210 - gloom * 10, 196 - (1 - gloom) * 600, T, 1.2, 0.7, 3);

      /* he looks at him with love */
      const lv = es(t, -0.2, 0.3) * (1 - es(t, 3.0, 3.3));
      pose(love, { x: (JX + MX) / 2 + 8, y: GY - 175 + Math.sin(T * 1.6) * 3, s: 0.3 + lv * 0.7, o: lv * (1 - es(t, 0.5, 0.7) * 0.6) });

      /* beat 0: sell and give to the poor — coins fly from the cart into the bowls */
      COINS.forEach((cn) => {
        const k = seg(t, 0.35 + cn.i * 0.05, 0.7 + cn.i * 0.05);
        const p = POOR[cn.to];
        const x0 = CARTX - 10, y0 = CARTY - 130, x1 = p.x + 38, y1 = p.y - 18;
        pose(cn.el, { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(k * Math.PI) * 240, r: k * 540, o: k > 0 && k < 1 ? 1 : 0 });
      });
      /* beat 1: treasure in heaven — they rise from the bowls as stars */
      const starOn = 1 - es(t, 3.05, 3.5);
      STARS.forEach((st) => {
        const k = es(t, 1.05 + st.i * 0.05, 1.5 + st.i * 0.05);
        pose(st.el, { x: lerp(POOR[st.i % 3].x + 30, st.x, k), y: lerp(GY - 20, st.y, k), s: 0.4 + k * 0.6 + Math.sin(T * 2 + st.i) * 0.05, r: T * 10 + st.i * 20, o: (k > 0 ? Math.min(1, k * 3) : 0) * starOn });
      });
      POOR.forEach((p) => {
        const got = es(t, 0.7 + p.i * 0.05, 0.9 + p.i * 0.05);
        const look = es(t, 1.05, 1.3);
        p.p.set({ x: p.x, y: p.y, s: 0.78, armF: 50 + got * 40 * (1 - look) + look * 70, armB: got * 60 * (1 - es(t, 3, 3.3)) + look * 60, head: -8 - got * 6 - look * 10, blink: blinkAt(T, p.seed) });
        pose(p.bowl, { x: p.x + 40, y: p.y - 4, s: 0.9 });
      });

      /* beat 2: come, follow Me — footprints glow ahead */
      const follow = es(t, 2.05, 2.3) * (1 - es(t, 3.2, 3.5));
      const upH = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.05));
      jesus.set({ x: JX, y: GY, s: 1.02, armF: 20 + bump(t, 0.1, 0.95) * 50 + follow * 70, armB: bump(t, 0.1, 0.95) * 40 + upH * 140 + follow * 30, head: -4 - upH * 10 + Math.sin(T * 0.6), blink: blinkAt(T) });
      prints.forEach((pr) => {
        const k = es(t, 2.1 + pr.i * 0.07, 2.3 + pr.i * 0.07);
        pose(pr.el, { x: 820 + pr.i * 32, y: GY + 58 - pr.i * 12 + (pr.i % 2) * 6, s: 0.7 - pr.i * 0.04, o: k * (1 - es(t, 3.1, 3.5)) * 0.9 });
      });
      DIS.forEach((d) => d.p.set({ x: JX - 150 - d.i * 56, y: GY - 44 + (d.i % 2) * 8, s: 0.82, head: -3 - es(t, 1.05, 1.3) * 8 * (1 - es(t, 2, 2.3)) + es(t, 3.2, 3.6) * 6, armF: 8, blink: blinkAt(T, d.seed) }));

      /* beats 3–4: his face falls; he turns to his cart and pulls it away */
      const sad = es(t, 3.02, 3.25);
      const toCart = es(t, 3.3, 3.85);
      const shaftX = CARTX + 174 * CS + 6;
      const pull = seg(t, 4.02, 5.6);
      const cx = CARTX + pull * 200;
      const mx = pull > 0 ? cx + 174 * CS + 6 : lerp(MX, shaftX, toCart);
      const walking = (toCart > 0 && toCart < 1) || (pull > 0 && pull < 1);
      const ready = pull > 0 || toCart > 0.95;
      man.set({ x: mx, y: GY, s: 0.96, flip: toCart < 0.02, walk: walking ? mx * 0.07 : undefined, lean: pull > 0 ? 12 : sad * 3, head: sad * 14 + (1 - sad) * -4, armF: ready ? 70 : 14 + lv * 10 - sad * 10, armB: ready ? 60 : 0, blink: blinkAt(T, 4) });
      face(manEl, 'sad', sad); face(manEl, 'frown', sad);
      pose(cartEl, { x: cx, y: CARTY, s: CS, r: pull > 0 && pull < 1 ? Math.sin(T * 6) * 0.8 : 0 });
      pose(w1, { x: -40, r: pull * 600 });
      pose(w2, { x: 50, r: pull * 600 });
      const rk = es(t, 4.05, 4.35, ease.back);
      pose(riches, { x: mx - 30, y: GY - 200 + Math.sin(T * 1.2) * 3, s: rk, o: rk > 0.01 ? 1 : 0 });

      S.cam.z = 1 + es(t, -0.4, 0.3) * 0.04 + es(t, 3.9, 4.6) * 0.04;
      S.cam.y = -es(t, 0.9, 1.3) * 30 * (1 - es(t, 1.9, 2.3));
      S.cam.x = es(t, 3.2, 3.9) * 80 + es(t, 4.0, 4.7) * 180;
    };
  },
};
