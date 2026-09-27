// Mk 7,17–19 — away from the crowd, in a house. The disciples ask about the saying.
// Jesus shows them the paper doll again: a crumb of bread goes in at the mouth, down past the heart
// (which it never touches) into the stomach, and out and away. Then every dish on the table is clean.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { hand, headAt, townsfolk, room, feastTable, paperDoll, dollHeart, speech, GLYPH, loaf, spark, dust } from './lib.js';

const PI = Math.PI;
const SEAT = 706;           // seated people's feet
const TABLE = { x: 800, y: 722 };
const DOLL = { x: 800, h: 230, top: 150 };

export default {
  id: 'm7-house',
  beats: [
    { v: 17 },
    { v: 18, text: 'Odpowiedział im: «I wy tak niepojętni jesteście?' },
    { v: 18, cont: true, text: 'Nie rozumiecie, że nic z tego, co z zewnątrz wchodzi do człowieka, nie może uczynić go nieczystym;' },
    { v: 19, text: 'bo nie wchodzi do jego serca, lecz do żołądka i na zewnątrz się wydala».' },
    { v: 19, cont: true, text: 'Tak uznał wszystkie potrawy za czyste.' },
  ],
  cam: { x: [-20, 60], y: [-90, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const R = room(S, { sky: ['#d8c9d6', '#f0d9c0', '#f6e3c8'] });
    const FLOOR = R.FLOOR;

    /* ---------- the crowd going home, seen through the door ---------- */
    const away = [0, 1, 2].map((i) => ({ i, p: S.puppet(R.street.add(person(c, townsfolk(c)))) }));

    /* ---------- the disciples around the table; Jesus in the middle ---------- */
    const back = S.layer({ par: 0.5, sh: 4 });
    const matthew = S.puppet(back.add(person(c, CAST.matthew)));
    const thomas = S.puppet(back.add(person(c, CAST.thomas)));
    const seat = S.layer({ par: 0.55, sh: 5 });
    const SEATS = [
      { o: CAST.andrew, x: 604, flip: false, in: false }, { o: CAST.peter, x: 676, flip: false, in: true, from: 1210, t0: 0.18 },
      { o: CAST.james, x: 928, flip: true, in: false }, { o: CAST.john, x: 998, flip: true, in: true, from: 1230, t0: 0.26 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), sit: S.puppet(seat.add(person(c, { ...d.o, pose: 'sit' }))), stand: d.in ? S.puppet(seat.add(person(c, d.o))) : null }));
    const jSit = S.puppet(seat.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jStand = S.puppet(seat.add(person(c, CAST.jesus)));
    const tbl = feastTable(c, 460);
    const tableL = S.layer({ par: 0.58, sh: 5 });
    tableL.add(`<g transform="translate(${TABLE.x} ${TABLE.y})">${tbl.markup}</g>`);

    /* ---------- speech, puzzlement ---------- */
    const fx = S.layer({ par: 0.56, sh: 6 });
    const dollIcon = `<g transform="translate(0 16) scale(.16)">${paperDoll(c, 230).body}</g>`;
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-12 0)">${GLYPH.q(c)}</g><g transform="translate(10 -2)">${dollIcon}</g>`, { w: 70, h: 52 })}</g>`);
    const qs = SEATS.map((d) => fx.add(`<g>${GLYPH.q(c)}</g>`));
    const doll = paperDoll(c, DOLL.h);
    const dollEl = hanging(fx, `<g transform="translate(0 ${DOLL.h + 20})"><g>${doll.body}</g><g data-g="belly" opacity="0" transform="translate(${doll.P.stomach[0]} ${doll.P.stomach[1]})"><circle r="46" fill="url(#warm-glow)"/></g><g transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${dollHeart(c, 17)}</g><g data-g="guard" opacity="0" transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})"><path d="${c.ribbon(c.arc(0, 0, 30, 28, 0, PI * 2, 24), 2.4)}" fill="${C.sun}"/></g></g>`, { x: DOLL.x, y: DOLL.top, len: 700 });
    const belly = dollEl.querySelector('[data-g="belly"]'), guard = dollEl.querySelector('[data-g="guard"]');
    const crumb = fx.add(`<g>${loaf(c, 11)}</g>`);
    const puff = fx.add(`<g>${dust(c, 16, C.sand2)}</g>`);
    const sparks = tbl.dishes.map(([dx, dy], i) => ({ i, el: fx.add(`<g>${spark(c, 11)}</g>`), x: TABLE.x + dx, y: TABLE.y + dy - 14 }));
    const warm = fx.add(`<ellipse cx="0" cy="0" rx="300" ry="70" fill="url(#warm-glow)"/>`);

    return (t, time) => {
      const T = time;
      fade(R.lamp.glow, 0.55 + Math.sin(T * 3) * 0.04);
      pose(R.lamp.flame, { x: 35, y: -16, sx: 1 + Math.sin(T * 9) * 0.06, sy: 1 + Math.sin(T * 7 + 1) * 0.08 });

      /* v17 — in through the door, away from the crowd */
      away.forEach((a) => {
        const k = seg(t, -0.3 + a.i * 0.1, 0.5 + a.i * 0.1);
        const x = lerp(1180 + a.i * 20, 1500 + a.i * 30, k);
        a.p.set({ x, y: 600, s: 0.5, o: 1 - es(t, 0.4, 0.6), walk: x * 0.06, blink: 0 });
      });
      const jx = lerp(1206, 800, es(t, 0.02, 0.5, ease.out));
      const sitJ = es(t, 0.5, 0.57);
      jStand.set({ x: jx, y: FLOOR + 6, s: 0.9, flip: true, o: (1 - sitJ) * seg(t, -0.1, 0.02), walk: t < 0.5 ? jx * 0.05 : undefined, blink: blinkAt(T) });
      const open = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const reach = bump(t, 2.3, 2.75);
      const bless = es(t, 4.05, 4.3);
      jSit.set({
        x: 800, y: SEAT, s: 0.94, o: sitJ,
        armF: 20 + open * 50 + es(t, 2.0, 2.2) * (1 - es(t, 4.0, 4.1)) * 30 + reach * 50 + bless * 60, armB: 10 + open * 70 + es(t, 2.0, 2.3) * (1 - es(t, 4.0, 4.1)) * 130 + bless * 140,
        head: -es(t, 2.0, 2.3) * 12 * (1 - es(t, 4.0, 4.2)) + open * 4 + bless * 6, blink: blinkAt(T, 1),
      });
      SEATS.forEach((d) => {
        const inK = d.in ? es(t, d.t0 + 0.35, d.t0 + 0.42) : 1;
        if (d.stand) {
          const x = lerp(d.from, d.x, es(t, d.t0, d.t0 + 0.38, ease.out));
          d.stand.set({ x, y: FLOOR + 8, s: 0.86, flip: true, o: (1 - inK) * seg(t, d.t0 - 0.1, d.t0), walk: x * 0.05, blink: blinkAt(T, d.seed) });
        }
        const puzzled = es(t, 1.1 + d.i * 0.06, 1.3 + d.i * 0.06) * (1 - es(t, 2.0, 2.2));
        const asks = d.i === 1 ? es(t, 0.62, 0.8) * (1 - es(t, 1.0, 1.1)) : 0;
        const joy = es(t, 4.2 + d.i * 0.05, 4.45 + d.i * 0.05);
        d.sit.set({ x: d.x, y: SEAT, s: 0.9, flip: d.flip, o: inK, armF: 20 + asks * 60 + joy * 50, armB: puzzled * 165 + joy * 30, head: puzzled * 10 - es(t, 2.2, 2.5) * 12 * (1 - es(t, 4.0, 4.2)) - joy * 4, blink: blinkAt(T, d.seed) });
        const [hx, hy] = headAt(d.x, SEAT, 0.9, d.flip, 62);
        const qk = es(t, 1.2 + d.i * 0.08, 1.4 + d.i * 0.08, ease.back) * (1 - es(t, 1.9, 2.05));
        pose(qs[d.i], { x: hx + (d.flip ? -8 : 8), y: hy - 40 - qk * 6 + Math.sin(T * 3 + d.i) * 2, s: qk * 1.3, r: Math.sin(T * 2 + d.i) * 8, o: qk > 0.02 ? 1 : 0 });
      });
      matthew.set({ x: 540, y: FLOOR + 4, s: 0.86, armB: es(t, 1.15, 1.35) * (1 - es(t, 2.0, 2.2)) * 160, head: -es(t, 2.2, 2.5) * 10, blink: blinkAt(T, 6) });
      thomas.set({ x: 1068, y: FLOOR + 4, s: 0.86, flip: true, armF: es(t, 4.2, 4.5) * 60, head: -es(t, 2.2, 2.5) * 10, blink: blinkAt(T, 8) });
      const [px, py] = headAt(676, SEAT, 0.9, false, 62);
      const askK = es(t, 0.62, 0.8, ease.back) * (1 - es(t, 1.0, 1.12));
      pose(ask, { x: px + 20, y: py - 22, s: askK, o: askK > 0.02 ? 1 : 0 });

      /* v18b–19a — the doll comes down; a crumb goes in, past the heart, to the stomach and away */
      const dK = es(t, 2.0, 2.4, ease.out) * (1 - es(t, 4.4, 4.8, ease.in));
      const dy = DOLL.top - (1 - dK) * 1150;
      swing(dollEl, DOLL.x, dy, T, 0.6, 0.5);
      const base = dy + DOLL.h + 20;
      const P = (p) => [DOLL.x + p[0], base + p[1]];
      const [mx, my] = P(doll.P.mouth), [sx, sy] = P(doll.P.stomach), [hx0, hy0] = P(doll.P.heart);
      const [tx, ty] = [TABLE.x - 110, TABLE.y - 60];
      const keys = [
        [2.45, [tx, ty]], [2.9, [mx, my]], [3.12, [mx + 2, my + 40]], [3.3, [hx0 + 34, hy0]], [3.5, [sx, sy]], [3.62, [sx, sy]],
        [3.78, [DOLL.x + 22, base - 40]], [3.92, [DOLL.x + 26, base + 10]],
      ];
      let cx = tx, cy = ty;
      for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, pa] = keys[i - 1], [b, pb] = keys[i]; const u = ease.io(seg(t, a, b)); cx = lerp(pa[0], pb[0], u); cy = lerp(pa[1], pb[1], u) - (i === 1 ? Math.sin(u * PI) * 70 : 0); break; } else { cx = keys[i][1][0]; cy = keys[i][1][1]; }
      const inside = t > 2.9;
      pose(crumb, { x: cx, y: cy, s: inside ? 0.8 : 1, r: t * 90, o: t > 2.45 && t < 3.92 ? 1 : 0 });
      fade(guard, bump(t, 3.1, 3.5));
      fade(belly, bump(t, 3.35, 3.8) * 0.9);
      const pk = seg(t, 3.9, 4.15);
      pose(puff, { x: DOLL.x + 26, y: base + 16 + pk * 10, s: 0.6 + pk, o: bump(t, 3.9, 4.15) * 0.9 });

      /* v19b — all foods clean: sparkles over every dish */
      sparks.forEach((s) => {
        const k = es(t, 4.1 + s.i * 0.06, 4.3 + s.i * 0.06, ease.back);
        pose(s.el, { x: s.x, y: s.y + 4 - k * 8 + Math.sin(T * 2 + s.i) * 3, s: k * (1 + Math.sin(T * 3 + s.i) * 0.08), r: T * 20 + s.i * 20, o: k > 0.02 ? 1 : 0 });
      });
      pose(warm, { x: TABLE.x, y: TABLE.y - 60, o: es(t, 4.05, 4.4) * 0.8 });

      const up = es(t, 1.9, 2.4) * (1 - es(t, 4.1, 4.6));
      S.cam.x = lerp(50, 0, es(t, 0.1, 0.7));
      S.cam.y = lerp(70, -90, up);
      S.cam.z = lerp(1.16, 1.0, up) + es(t, 4.1, 4.6) * 0.04;
    };
  },
};
