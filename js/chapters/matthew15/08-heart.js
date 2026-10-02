// Mt 15,18–20 — the same room, now lamp-lit at night. "What comes out of the mouth comes from the heart": the paper
// doll on the right — its heart darkens, and a dark thread rises from it to the mouth and out as a jagged word.
// A heart-shaped paper box comes down over the table; its lid lifts and out come, one by one, the seven dark things of
// verse 19 (restrained cut-outs): evil thoughts (a storm-cloud), murders (a snuffed candle), adulteries (a broken ring),
// sexual sins (a torn heart), thefts (a grasping hand), false witness (a two-faced mask), slanders (a jagged bubble).
// "These are what defile a man" — they all go over to the doll and stain it. "But eating with unwashed hands does not"
// — the box and the doll are drawn up, the plate of the dusty hand with its bread comes down with a gold star, and the
// disciples break their bread in the lamplight.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hand, headAt, room, feastTable, paperDoll, dollHeart, heartBox, darkThing, DARK, plate, bigHand, loaf, sparkle, jagBubble, PI } from './lib.js';

const SEAT = 706;
const TABLE = { x: 800, y: 722 };
const BOX = { x: 790, y: 390 };
const DOLL0 = { x: 1070, h: 200, top: 180 };
const KINDS = ['cloud', 'snuff', 'ring', 'torn', 'grab', 'mask', 'jag'];

export default {
  id: 'mt15-heart',
  beats: [
    { v: 18 },
    { v: 19 },
    { v: 20, text: 'To właśnie czyni człowieka nieczystym.' },
    { v: 20, cont: true, text: 'To zaś, że się je nie umytymi rękami, nie czyni człowieka nieczystym».' },
  ],
  cam: { x: [-20, 60], y: [-80, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const DOLL = { ...DOLL0, x: S.portrait ? 990 : DOLL0.x };   // phone: the doll and its dark word clear of the thread
    const R = room(S, { sky: ['#232a55', '#3a3f72', '#6b5d86'], night: true });
    const FLOOR = R.FLOOR;

    /* ---------- the same company round the table ---------- */
    const back = S.layer({ par: 0.5, sh: 4 });
    const matthew = S.puppet(back.add(person(c, CAST.matthew)));
    const thomas = S.puppet(back.add(person(c, CAST.thomas)));
    const seat = S.layer({ par: 0.55, sh: 5 });
    const SEATS = [
      { o: CAST.andrew, x: 604, flip: false }, { o: CAST.peter, x: 676, flip: false },
      { o: CAST.james, x: 928, flip: true }, { o: CAST.john, x: 998, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(seat.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const jesus = S.puppet(seat.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const bread = SEATS.map(() => seat.add(`<g>${loaf(c, 9)}</g>`));
    const tableL = S.layer({ par: 0.58, sh: 5 });
    tableL.add(`<g transform="translate(${TABLE.x} ${TABLE.y})">${feastTable(c, 460).markup}</g>`);
    const lampGlow = tableL.add(`<ellipse cx="${TABLE.x}" cy="${TABLE.y - 120}" rx="420" ry="220" fill="url(#warm-glow)" opacity=".45"/>`);

    /* ---------- the doll, the heart box, the dark things ---------- */
    const fx = S.layer({ par: 0.56, sh: 6 });
    const doll = paperDoll(c, DOLL.h);
    const dollEl = hanging(fx, `<g transform="translate(0 ${DOLL.h + 20})"><g>${doll.body}</g><g data-g="stain" opacity="0">${doll.stain}</g><g transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${dollHeart(c, 15)}</g><g data-g="dark" opacity="0" transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${sheet().p(c.cut(c.blob(0, 0, 14, 12, 10, 0.2), 0.6, 4), mix(C.night2, C.jesusMantle, 0.35)).out()}</g><g data-g="thread" opacity="0"><path d="${c.ribbon([[doll.P.heart[0], doll.P.heart[1] - 8], [6, (doll.P.heart[1] + doll.P.mouth[1]) / 2], [doll.P.mouth[0], doll.P.mouth[1] + 4]], 5)}" fill="${DARK}"/></g></g>`, { x: DOLL.x, y: DOLL.top, len: 700 });
    const stainG = dollEl.querySelector('[data-g="stain"]'), darkHeart = dollEl.querySelector('[data-g="dark"]'), thread = dollEl.querySelector('[data-g="thread"]');
    const word = fx.add(`<g>${jagBubble(c)}</g>`);
    const hb = heartBox(c, 74);
    const boxEl = hanging(fx, `<g transform="translate(0 80)">${hb.box}</g>`, { x: BOX.x, y: BOX.y - 80, len: 700 });
    const lid = fx.add(`<g>${hb.lid}</g>`);
    const inner = fx.add(`<g><circle r="46" fill="${DARK}" opacity=".35"/></g>`);
    const THINGS = KINDS.map((k, i) => {
      const a = PI * (1.08 + i * 0.14);
      return { k, i, el: fx.add(`<g>${darkThing(c, k)}</g>`), to: [BOX.x + Math.cos(a) * 240, BOX.y - 20 + Math.sin(a) * 130], t0: 1.1 + i * 0.11, seed: c.rr(0, 6) };
    });
    const handPlate = hanging(fx, `<g>${plate(c, `<g transform="translate(-8 4) scale(.9)">${bigHand(c, { dirty: true })}</g><g transform="translate(40 -10)">${loaf(c, 14)}</g>`, { r: 62 })}</g>`, { x: 800, y: 250, len: 700 });
    const star = fx.add(`<g><circle r="40" fill="url(#halo-glow)"/>${sparkle(c, 22, C.star)}</g>`);

    return (t, time) => {
      const T = time;
      const bright = es(t, 3.05, 3.4);
      const low = es(t, 2.2, 2.8) * (1 - bright);
      fade(R.lamp.glow, 0.7 + (T ? Math.sin(T * 3) * 0.05 : 0) - low * 0.25 + bright * 0.2);
      fade(lampGlow, 0.45 - low * 0.15 + bright * 0.25 + (T ? Math.sin(T * 2.6) * 0.03 : 0));
      pose(R.lamp.flame, { x: 35, y: -16, sx: 1 + (T ? Math.sin(T * 9) * 0.06 : 0), sy: 1 - low * 0.3 + (T ? Math.sin(T * 7 + 1) * 0.08 : 0) });

      /* people */
      const point = es(t, 0.1, 0.35) * (1 - es(t, 2.9, 3.1));
      const sober = es(t, 2.2, 2.6) * (1 - bright);
      const bless = es(t, 3.1, 3.35);
      jesus.set({ x: 800, y: SEAT, s: 0.94, armF: 20 + point * 20 + sober * 30 + bless * 50, armB: 10 + point * 120 * (1 - sober) + bless * 30, head: -point * 12 * (1 - sober) + sober * 8 - bless * 4, blink: blinkAt(T, 1) });
      SEATS.forEach((d) => {
        const look = es(t, 0.2 + d.i * 0.05, 0.5 + d.i * 0.05);
        const shrink = bump(t, 1.1 + d.i * 0.1, 2.6) * 0.8;
        const eat = bright * Math.max(0, Math.sin(t * 16 + d.i * 1.3));
        const armF = 20 + shrink * 40 + bright * (40 + eat * 50);
        d.p.set({ x: d.x, y: SEAT, s: 0.9, flip: d.flip, armF, armB: shrink * 60, head: -look * 14 * (1 - sober) * (1 - bright) + sober * 12 + bright * 4 - eat * 4, lean: (d.flip ? 1 : -1) * shrink * 4, blink: blinkAt(T, d.seed) });
        const [hx, hy] = hand(d.x, SEAT, 0.9, d.flip, armF, 0, 62);
        pose(bread[d.i], { x: hx + (d.flip ? -3 : 3), y: hy + 2, o: bright });
      });
      matthew.set({ x: 540, y: FLOOR + 4, s: 0.86, head: -es(t, 0.3, 0.6) * 12 * (1 - bright) + sober * 16, armF: bump(t, 1.1, 2.6) * 40 + bright * 30, blink: blinkAt(T, 6) });
      thomas.set({ x: 1068, y: FLOOR + 4, s: 0.86, flip: true, head: -es(t, 0.3, 0.6) * 12 * (1 - bright) + sober * 16, armF: bump(t, 1.1, 2.6) * 40 + bright * 30, blink: blinkAt(T, 8) });

      /* v18 — out of the mouth, from the heart: the doll's heart darkens and a dark word comes out */
      const dK = es(t, -0.3, 0.2, ease.out) * (1 - es(t, 3.0, 3.35, ease.in));
      const dTop = DOLL.top - (1 - dK) * 1150;
      swing(dollEl, DOLL.x, dTop, T, 0.6, 0.5, 2);
      fade(darkHeart, es(t, 0.2, 0.4));
      fade(thread, es(t, 0.35, 0.55) * (1 - es(t, 0.95, 1.1)));
      const mouth = [DOLL.x + doll.P.mouth[0], dTop + DOLL.h + 20 + doll.P.mouth[1]];
      const wk = es(t, 0.5, 0.7, ease.back) * (1 - es(t, 0.95, 1.1));
      pose(word, { x: mouth[0] + 10 + wk * 30, y: mouth[1] - 6, s: wk * 0.9, o: wk > 0.02 ? 1 : 0 });

      /* v19 — the heart box opens and out they come, one by one */
      const bK = es(t, 0.75, 1.1, ease.out) * (1 - es(t, 3.0, 3.35, ease.in));
      const by = BOX.y - 80 - (1 - bK) * 1150;
      swing(boxEl, BOX.x, by, T, 0.5, 0.5);
      const rim = [BOX.x + hb.hinge[0], by + 80 + hb.hinge[1]];
      const openA = es(t, 1.0, 1.15) * (1 - es(t, 2.4, 2.6));
      pose(lid, { x: rim[0], y: rim[1], r: -openA * 64 });
      pose(inner, { x: BOX.x, y: by + 80 + hb.hinge[1] + 4, sy: 0.25, o: openA });
      THINGS.forEach((th) => {
        const k = es(t, th.t0, th.t0 + 0.28, ease.out);
        const src = [BOX.x + (th.i % 3 - 1) * 20, by + 70];
        const hover = T ? Math.sin(T * 1.6 + th.seed) * 5 : 0;
        let x = lerp(src[0], th.to[0], k), y = lerp(src[1], th.to[1], k) - Math.sin(k * PI) * 30 + hover * k;
        /* v20a — they all go over to the doll */
        const land = [DOLL.x + Math.cos(th.i * 2.4) * 34, dTop + 60 + ((th.i * 37) % 150)];
        const g = es(t, 2.05 + th.i * 0.04, 2.45 + th.i * 0.04, ease.io);
        x = lerp(x, land[0], g); y = lerp(y, land[1], g) - Math.sin(g * PI) * 40;
        pose(th.el, { x, y, s: (0.7 + k * 0.7) * (1 - g * 0.6), r: T ? Math.sin(T * 1.3 + th.seed) * 10 * (1 - g) : 0, o: k > 0.01 ? 1 - es(t, 2.45 + th.i * 0.03, 2.6 + th.i * 0.03) : 0 });
      });
      fade(stainG, es(t, 2.3, 2.7) * 0.85);

      /* v20b — unwashed hands do not defile: the plate with the bread, a gold star; they eat */
      const pK = es(t, 3.1, 3.4, ease.back);
      swing(handPlate, 800, 240 - (1 - pK) * 1150, T, 1.1, 0.7, 1);
      const sk = es(t, 3.3, 3.5, ease.back);
      pose(star, { x: 860, y: 190 - (1 - pK) * 1150, s: sk * (1 + (T ? Math.sin(T * 3) * 0.06 : 0)), r: T ? T * 20 : 0, o: sk > 0.02 ? 1 : 0 });

      const swarm = es(t, 2.05, 2.5) * (1 - bright);
      S.cam.y = lerp(40, -60, es(t, 0.0, 0.6)) + swarm * 20 + bright * 30;
      S.cam.z = lerp(1.1, 1.0, es(t, 0.0, 0.6)) + es(t, 1.0, 2.0) * 0.03 + bright * 0.02;
      S.cam.x = swarm * 50 + es(t, -0.2, 0.4) * 30 * (1 - es(t, 0.8, 1.2));
    };
  },
};
