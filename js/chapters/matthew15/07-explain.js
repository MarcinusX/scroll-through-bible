// Mt 15,15–17 — later, in the house, round the low table. Peter speaks up: "Explain this parable to us!" (a bubble
// with the little paper man and a question mark). "Are you also still without understanding?" — question marks bob
// over the puzzled disciples. Then the paper doll comes down again: a crumb of bread goes in at the mouth, down past
// the heart (which it never touches — a gold ring guards it) into the stomach, and out and away in a puff.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { headAt, room, feastTable, paperDoll, dollHeart, speech, GLYPH, loaf, dust, voiceRings, PI } from './lib.js';

const SEAT = 706;           // seated people's feet
const TABLE = { x: 800, y: 722 };
const DOLL = { x: 800, h: 230, top: 150 };

export default {
  id: 'mt15-explain',
  beats: [
    { v: 15 },
    { v: 16 },
    { v: 17 },
  ],
  cam: { x: [-20, 60], y: [-90, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const R = room(S, { sky: ['#d8c9d6', '#f0d9c0', '#f6e3c8'] });
    const FLOOR = R.FLOOR;

    /* ---------- the disciples round the table; Jesus in the middle ---------- */
    const back = S.layer({ par: 0.5, sh: 4 });
    const matthew = S.puppet(back.add(person(c, CAST.matthew)));
    const thomas = S.puppet(back.add(person(c, CAST.thomas)));
    const seat = S.layer({ par: 0.55, sh: 5 });
    const SEATS = [
      { o: CAST.andrew, x: 604, flip: false }, { o: CAST.peter, x: 676, flip: false },
      { o: CAST.james, x: 928, flip: true }, { o: CAST.john, x: 998, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(seat.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const jesus = S.puppet(seat.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const tbl = feastTable(c, 460);
    S.layer({ par: 0.58, sh: 5 }).add(`<g transform="translate(${TABLE.x} ${TABLE.y})">${tbl.markup}</g>`);

    /* ---------- speech, puzzlement, the doll ---------- */
    const fx = S.layer({ par: 0.56, sh: 6 });
    const dollIcon = `<g transform="translate(0 16) scale(.16)">${paperDoll(c, 230).body}</g>`;
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-12 0)">${dollIcon}</g><g transform="translate(14 -2)">${GLYPH.q(c)}</g>`, { w: 76, h: 56 })}</g>`);
    const qs = [...SEATS, { x: 540, stand: true }, { x: 1068, stand: true }].map(() => fx.add(`<g>${GLYPH.q(c)}</g>`));
    const doll = paperDoll(c, DOLL.h);
    const dollEl = hanging(fx, `<g transform="translate(0 ${DOLL.h + 20})"><g>${doll.body}</g><g data-g="belly" opacity="0" transform="translate(${doll.P.stomach[0]} ${doll.P.stomach[1]})"><circle r="46" fill="url(#warm-glow)"/></g><g transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${dollHeart(c, 17)}</g><g data-g="guard" opacity="0" transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})"><path d="${c.ribbon(c.arc(0, 0, 30, 28, 0, PI * 2, 24), 2.4)}" fill="${C.sun}"/></g></g>`, { x: DOLL.x, y: DOLL.top, len: 700 });
    const belly = dollEl.querySelector('[data-g="belly"]'), guard = dollEl.querySelector('[data-g="guard"]');
    const crumb = fx.add(`<g>${loaf(c, 11)}</g>`);
    const puff = fx.add(`<g>${dust(c, 16, C.sand2)}</g>`);
    const voice = voiceRings(fx, c, { n: 3, r: 26, color: shade(C.ochre, 0.3) });

    return (t, time) => {
      const T = time;
      fade(R.lamp.glow, 0.55 + (T ? Math.sin(T * 3) * 0.04 : 0));
      pose(R.lamp.flame, { x: 35, y: -16, sx: 1 + (T ? Math.sin(T * 9) * 0.06 : 0), sy: 1 + (T ? Math.sin(T * 7 + 1) * 0.08 : 0) });

      /* v15 — Peter: "Explain this parable to us!" */
      const askK = es(t, 0.15, 0.35, ease.back) * (1 - es(t, 0.95, 1.08));
      const [px, py] = headAt(676, SEAT, 0.9, false, 62);
      pose(ask, { x: px + 22, y: py - 22, s: askK, o: askK > 0.02 ? 1 : 0 });

      /* v16 — "Are you also still without understanding?" */
      const open = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const upDoll = es(t, 2.0, 2.3);
      jesus.set({
        x: 800, y: SEAT, s: 0.94,
        armF: 20 + bump(t, 0.2, 0.9) * 10 + open * 50 + upDoll * 30 + bump(t, 2.3, 2.75) * 30, armB: 10 + open * 70 + upDoll * 110,
        head: bump(t, 0.2, 0.9) * -6 + open * 4 - upDoll * 12, blink: blinkAt(T, 1),
      });
      const [jhx, jhy] = headAt(800, SEAT, 0.94, false, 62);
      voice(jhx + 8, jhy + 4, bump(t, 1.05, 1.9), T, { dir: 1 });
      SEATS.forEach((d) => {
        const puzzled = es(t, 1.1 + d.i * 0.06, 1.3 + d.i * 0.06) * (1 - es(t, 2.0, 2.2));
        const asks = d.i === 1 ? es(t, 0.1, 0.3) * (1 - es(t, 0.95, 1.05)) : 0;
        d.p.set({ x: d.x, y: SEAT, s: 0.9, flip: d.flip, armF: 20 + asks * 70, armB: puzzled * 165 + asks * 40, head: puzzled * 10 - upDoll * 12 + (d.i === 1 ? 0 : bump(t, 0.2, 0.9) * (d.flip ? -6 : 6)), blink: blinkAt(T, d.seed) });
      });
      matthew.set({ x: 540, y: FLOOR + 4, s: 0.86, armB: es(t, 1.15, 1.35) * (1 - es(t, 2.0, 2.2)) * 160, head: -upDoll * 10, blink: blinkAt(T, 6) });
      thomas.set({ x: 1068, y: FLOOR + 4, s: 0.86, flip: true, armB: es(t, 1.2, 1.4) * (1 - es(t, 2.0, 2.2)) * 150, head: -upDoll * 10, blink: blinkAt(T, 8) });
      qs.forEach((q, i) => {
        const d = SEATS[i] || { x: i === 4 ? 540 : 1068, flip: i === 5, stand: true };
        const [hx, hy] = d.stand ? headAt(d.x, FLOOR + 4, 0.86, d.flip) : headAt(d.x, SEAT, 0.9, d.flip, 62);
        const qk = es(t, 1.2 + i * 0.07, 1.4 + i * 0.07, ease.back) * (1 - es(t, 1.95, 2.08));
        pose(q, { x: hx + (d.flip ? -8 : 8), y: hy - 40 - qk * 6 + (T ? Math.sin(T * 3 + i) * 2 : 0), s: qk * 1.3, r: T ? Math.sin(T * 2 + i) * 8 : 0, o: qk > 0.02 ? 1 : 0 });
      });

      /* v17 — the doll: a crumb goes in at the mouth, past the heart to the stomach, and out */
      const dK = es(t, 1.95, 2.3, ease.out);
      const dy = DOLL.top - (1 - dK) * 1150;
      swing(dollEl, DOLL.x, dy, T, 0.6, 0.5);
      const base = dy + DOLL.h + 20;
      const P = (p) => [DOLL.x + p[0], base + p[1]];
      const [mx, my] = P(doll.P.mouth), [sx, sy] = P(doll.P.stomach), [hx0, hy0] = P(doll.P.heart);
      const [tx, ty] = [TABLE.x - 110, TABLE.y - 60];
      const keys = [
        [2.3, [tx, ty]], [2.5, [mx, my]], [2.58, [mx + 2, my + 40]], [2.64, [hx0 + 34, hy0]], [2.7, [sx, sy]], [2.74, [sx, sy]],
        [2.84, [DOLL.x + 22, base - 40]], [2.94, [DOLL.x + 26, base + 10]],
      ];
      let cx = tx, cy = ty;
      for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, pa] = keys[i - 1], [b, pb] = keys[i]; const u = ease.io(seg(t, a, b)); cx = lerp(pa[0], pb[0], u); cy = lerp(pa[1], pb[1], u) - (i === 1 ? Math.sin(u * PI) * 70 : 0); break; } else { cx = keys[i][1][0]; cy = keys[i][1][1]; }
      pose(crumb, { x: cx, y: cy, s: t > 2.5 ? 0.8 : 1, r: t * 90, o: t > 2.3 && t < 2.94 ? 1 : 0 });
      fade(guard, es(t, 2.55, 2.65) * (1 - es(t, 2.95, 3)));
      fade(belly, es(t, 2.66, 2.72) * 0.9 * (1 - es(t, 2.95, 3)));
      const pk = seg(t, 2.88, 3.0);
      pose(puff, { x: DOLL.x + 26, y: base + 16 + pk * 10, s: 0.6 + pk, o: pk > 0 ? Math.max(0.35, Math.sin(pk * PI)) * 0.9 : 0 });

      const up = es(t, 1.9, 2.35);
      S.cam.x = 40 * (1 - up);
      S.cam.y = lerp(60, -90, up);
      S.cam.z = lerp(1.14, 1.0, up);
    };
  },
};
