// Mk 7,20–23 — later that evening, lamp-lit. "What comes out of a man, that defiles him."
// A heart-shaped paper box comes down over the table; its lid lifts and the dark little things of
// verses 21–22 fly out one by one (restrained, symbolic cut-outs). At the end they all settle on the
// paper doll and stain it.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hand, headAt, room, feastTable, paperDoll, dollHeart, heartBox, darkThing, DARK_KINDS, DARK } from './lib.js';

const PI = Math.PI;
const SEAT = 706;
const TABLE = { x: 800, y: 722 };
const BOX = { x: 800, y: 330 };
const DOLL = { x: 1080, h: 200, top: 190 };

export default {
  id: 'm7-heart',
  beats: [
    { v: 20 },
    { v: 21 },
    { v: 22 },
    { v: 23 },
  ],
  cam: { x: [-20, 60], y: [-80, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const DX = S.portrait ? 990 : DOLL.x;   // phone: the stained doll inside the frame, clear of the thread
    const R = room(S, { sky: ['#232a55', '#3a3f72', '#6b5d86'], night: true });
    const FLOOR = R.FLOOR;

    /* ---------- the same company around the table ---------- */
    const back = S.layer({ par: 0.5, sh: 4 });
    const matthew = S.puppet(back.add(person(c, CAST.matthew)));
    const thomas = S.puppet(back.add(person(c, CAST.thomas)));
    const seat = S.layer({ par: 0.55, sh: 5 });
    const SEATS = [
      { o: CAST.andrew, x: 604, flip: false }, { o: CAST.peter, x: 676, flip: false },
      { o: CAST.james, x: 928, flip: true }, { o: CAST.john, x: 998, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(seat.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const jesus = S.puppet(seat.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const tableL = S.layer({ par: 0.58, sh: 5 });
    tableL.add(`<g transform="translate(${TABLE.x} ${TABLE.y})">${feastTable(c, 460).markup}</g>`);
    // lamplight over the table
    const lampGlow = tableL.add(`<ellipse cx="${TABLE.x}" cy="${TABLE.y - 120}" rx="420" ry="220" fill="url(#warm-glow)" opacity=".45"/>`);

    /* ---------- the heart box, the dark things, the doll ---------- */
    const fx = S.layer({ par: 0.56, sh: 6 });
    const hb = heartBox(c, 74);
    const boxEl = hanging(fx, `<g transform="translate(0 80)">${hb.box}</g>`, { x: BOX.x, y: BOX.y - 80, len: 700 });
    const lid = fx.add(`<g>${hb.lid}</g>`);
    const inner = fx.add(`<g><circle r="46" fill="${DARK}" opacity=".35"/></g>`);
    const doll = paperDoll(c, DOLL.h);
    const dollEl = hanging(fx, `<g transform="translate(0 ${DOLL.h + 20})"><g>${doll.body}</g><g data-g="stain" opacity="0">${doll.stain}</g><g transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${dollHeart(c, 15)}</g><g data-g="dark" opacity="0" transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${sheet().p(c.cut(c.blob(0, 0, 14, 12, 10, 0.2), 0.6, 4), mix(C.night2, C.jesusMantle, 0.35)).out()}</g></g>`, { x: DX, y: DOLL.top, len: 700 });
    const stainG = dollEl.querySelector('[data-g="stain"]'), darkHeart = dollEl.querySelector('[data-g="dark"]');
    // 4 things in v21, 9 in v22 — placed on a ring round the box
    const THINGS = DARK_KINDS.map((k, i) => {
      const first = i < 4;
      const a = first ? PI * (0.82 + i * 0.16) : PI * (1.5 + (i - 4) * 0.19) - PI * 0.36;
      const rx = first ? 250 : 215, ry = first ? 160 : 150;
      return { k, i, el: fx.add(`<g>${darkThing(c, k)}</g>`), to: [BOX.x + Math.cos(a) * rx, BOX.y - 10 + Math.sin(a) * ry], t0: first ? 1.1 + i * 0.18 : 2.05 + (i - 4) * 0.09, seed: c.rr(0, 6) };
    });
    const wisp = fx.add(`<path d="${c.ribbon(c.cbez([0, 0], [-14, -16], [16, -26], [2, -44], 14), (u) => (1 - u) * 8 + 1.5)}" fill="${DARK}" opacity=".7"/>`);

    return (t, time) => {
      const T = time;
      const low = es(t, 3.2, 3.8);
      fade(R.lamp.glow, 0.7 + Math.sin(T * 3) * 0.05 - low * 0.25);
      fade(lampGlow, 0.45 - low * 0.15 + Math.sin(T * 2.6) * 0.03);
      pose(R.lamp.flame, { x: 35, y: -16, sx: 1 + Math.sin(T * 9) * 0.06, sy: 1 - low * 0.3 + Math.sin(T * 7 + 1) * 0.08 });

      /* people */
      const point = es(t, 0.1, 0.4) * (1 - es(t, 3.0, 3.3));
      const sober = es(t, 3.2, 3.6);
      jesus.set({ x: 800, y: SEAT, s: 0.94, armF: 20 + point * 20 + sober * 30, armB: 10 + point * 140 * (1 - sober), head: -point * 12 * (1 - sober) + sober * 8, blink: blinkAt(T, 1) });
      SEATS.forEach((d) => {
        const look = es(t, 0.3 + d.i * 0.05, 0.6 + d.i * 0.05);
        const shrink = bump(t, 1.2 + d.i * 0.1, 3.0) * 0.8;
        d.p.set({ x: d.x, y: SEAT, s: 0.9, flip: d.flip, armF: 20 + shrink * 40, armB: shrink * 60, head: -look * 14 * (1 - sober) + sober * 12, lean: (d.flip ? 1 : -1) * shrink * 4, blink: blinkAt(T, d.seed) });
      });
      matthew.set({ x: 540, y: FLOOR + 4, s: 0.86, head: -es(t, 0.3, 0.6) * 12 + sober * 16, armF: bump(t, 1.2, 3.0) * 40, blink: blinkAt(T, 6) });
      thomas.set({ x: S.portrait ? 1036 : 1068, y: FLOOR + 4, s: 0.86, flip: true, head: -es(t, 0.3, 0.6) * 12 + sober * 16, armF: bump(t, 1.2, 3.0) * 40, blink: blinkAt(T, 8) });

      /* v20 — the heart comes down; its lid stirs */
      const bK = es(t, -0.3, 0.3, ease.out);
      const by = BOX.y - 80 - (1 - bK) * 1150;
      swing(boxEl, BOX.x, by, T, 0.5, 0.5);
      const rim = [BOX.x + hb.hinge[0], by + 80 + hb.hinge[1]];
      const rattle = bump(t, 0.35, 0.95) * Math.max(0, Math.sin(T * 14)) * 8;
      const openA = es(t, 1.0, 1.25) * (1 - es(t, 3.35, 3.6));
      pose(lid, { x: rim[0], y: rim[1], r: -rattle - openA * 64 });
      pose(inner, { x: BOX.x, y: by + 80 + hb.hinge[1] + 4, sy: 0.25, o: openA });
      const wk = seg(t, 0.55, 0.98);
      pose(wisp, { x: BOX.x + 20, y: by + 60 - wk * 50, s: 0.8 + wk * 0.5, o: bump(t, 0.55, 0.98) * 0.8 });

      /* v21–22 — out they come, one by one */
      const swarm = es(t, 3.05, 3.55, ease.in);
      const dollTop = DOLL.top;
      THINGS.forEach((th) => {
        const k = es(t, th.t0, th.t0 + 0.3, ease.out);
        const src = [BOX.x + (th.i % 3 - 1) * 20, by + 70];
        const hover = Math.sin(T * 1.6 + th.seed) * 5;
        let x = lerp(src[0], th.to[0], k), y = lerp(src[1], th.to[1], k) - Math.sin(k * PI) * 30 + hover * k;
        // v23 — they all go over to the doll
        const land = [DX + Math.cos(th.i * 2.4) * 36, dollTop + 60 + ((th.i * 37) % 150)];
        const g = es(t, 3.05 + th.i * 0.025, 3.45 + th.i * 0.025, ease.io);
        x = lerp(x, land[0], g); y = lerp(y, land[1], g) - Math.sin(g * PI) * 40;
        pose(th.el, { x, y, s: (0.7 + k * 0.65) * (1 - g * 0.6), r: Math.sin(T * 1.3 + th.seed) * 10 * (1 - g), o: k > 0.01 ? 1 - es(t, 3.5 + th.i * 0.02, 3.7 + th.i * 0.02) : 0 });
      });

      /* the doll: it waits on the right, and takes the stain */
      const dK = es(t, 2.9, 3.2, ease.out);
      swing(dollEl, DX, DOLL.top - (1 - dK) * 1150, T, 0.6, 0.5, 2);
      fade(stainG, es(t, 3.4, 3.8) * 0.85);
      fade(darkHeart, es(t, 3.4, 3.7));

      S.cam.y = lerp(40, -60, es(t, 0.0, 0.6)) + swarm * 20;
      S.cam.z = lerp(1.1, 1.0, es(t, 0.0, 0.6)) + es(t, 1.0, 2.9) * 0.03;
      S.cam.x = swarm * 50;
    };
  },
};
