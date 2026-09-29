// Mt 12,3–4 — "Have you not read what David did?": a painted flat on old parchment. David and his companions come
// down the road worn out and hungry — David turns his empty pouch upside down. At the house of God (a tent of blue,
// purple and scarlet) the priest opens the curtain: on the golden table lie the twelve loaves of the Presence, and a
// tag hangs over them — only for the priests. He hands them out, and David and his men eat.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { parchSet, davidPuppet, PRIEST, kf, moving, handAt, headAt, loaf, menorah, turban, breastplate, addToHead, addToBody, thought, bowl, nameTag, plate, glow, rayBurst, sparkle, tr, PI } from './lib.js';

const Y = 690;
const TENT = { x0: 830, x1: 1300, top: 380, d0: 890, d1: 1040 };
const TABLE = { x: 965, top: 618 };

export default {
  id: 'mt12-david',
  enter: 'fly',
  beats: [
    { v: 3 },
    { v: 4 },
  ],
  cam: { x: [-30, 30], y: [-20, 30], z: [1, 1.1] },
  build(S) {
    const P = parchSet(S, { gy: 650, sunAt: [660, 190] });
    const c = P.c;

    /* ---------- the house of God ---------- */
    const tentIn = S.layer({ par: 0.5, sh: 3 });
    tentIn.add(`<rect x="${TENT.d0}" y="450" width="${TENT.d1 - TENT.d0}" height="${Y - 448}" fill="${mix(C.soilDark, C.plumRobe, 0.3)}"/>`);
    const inGlow = tentIn.add(`<g opacity="0">${glow(170)}</g>`);
    const tb = sheet();
    tb.p(c.cut(c.rect(TABLE.x - 46, TABLE.top, 92, 8), 0.3, 5), C.sun);
    tb.p(c.cut(c.rect(TABLE.x - 40, TABLE.top + 8, 6, Y - TABLE.top - 8), 0.2, 4) + c.cut(c.rect(TABLE.x + 34, TABLE.top + 8, 6, Y - TABLE.top - 8), 0.2, 4), shade(C.sun, -0.15));
    tentIn.add(tb.out());
    // two rows of six loaves on the table
    const LOAVES = [];
    [-20, 20].forEach((dx, si) => { for (let k = 0; k < 6; k++) LOAVES.push({ si, k, el: tentIn.add(`<g transform="translate(${TABLE.x + dx} ${TABLE.top - k * 7})">${loaf(c, 15, mix(C.wheat2, C.sun, 0.2))}</g>`) }); });
    const tent = S.layer({ par: 0.5, sh: 5 });
    const ts = sheet();
    const door = [[TENT.d0, Y + 2], [TENT.d0, 480], ...c.arc((TENT.d0 + TENT.d1) / 2, 480, (TENT.d1 - TENT.d0) / 2, 36, PI, 2 * PI, 10), [TENT.d1, Y + 2]];
    ts.p(c.cut([[TENT.x0, Y + 2], [TENT.x0, 460], [TENT.x0 + 60, TENT.top], [TENT.x1 - 60, TENT.top], [TENT.x1, 460], [TENT.x1, Y + 2]], 1, 10) + c.hole(door, 0.5, 6), C.linen2);
    ts.x(c.ribbon([[TENT.x0 + 60, TENT.top + 6], [TENT.x1 - 60, TENT.top + 6]], 8), C.dustyBlue);
    ts.x(c.ribbon([[TENT.x0 + 30, 414], [TENT.x1 - 30, 414]], 7), C.plumRobe);
    ts.x(c.ribbon([[TENT.x0 + 4, 456], [TENT.d0, 456]], 7) + c.ribbon([[TENT.d1, 456], [TENT.x1 - 4, 456]], 7), C.terracotta);
    let folds = '';
    for (let x = TENT.x0 + 30; x < TENT.x1 - 20; x += 44) if (x < TENT.d0 - 10 || x > TENT.d1 + 10) folds += c.ribbon([[x, 470], [x + c.rr(-3, 3), Y]], 2);
    ts.x(folds, shade(C.linen2, -0.12), 'opacity=".7"');
    ts.p(c.cut(c.rect(TENT.x0 - 6, 450, 10, Y - 450), 0.3, 6) + c.cut(c.rect(TENT.x1 - 4, 450, 10, Y - 450), 0.3, 6), C.wood2);
    ts.x(c.ribbon([[TENT.x0 + 60, TENT.top], [TENT.x0 - 60, Y]], 1.4) + c.ribbon([[TENT.x1 - 60, TENT.top], [TENT.x1 + 60, Y]], 1.4), C.rope);
    tent.add(ts.out());
    tent.add(`<g transform="translate(${TENT.x1 - 90} ${Y})">${menorah(c, 96)}</g>`);
    const flapW = (TENT.d1 - TENT.d0) / 2 + 4;
    const flapL = tent.add(`<g>${sheet().p(c.cut([[0, 0], [flapW, 0], [flapW, Y - 450], [0, Y - 450]], 0.6, 8), C.plumRobe).x(c.ribbon([[10, 10], [12, Y - 460]], 2) + c.ribbon([[36, 10], [38, Y - 460]], 2), shade(C.plumRobe, 0.2), 'opacity=".6"').out()}</g>`);
    const flapR = tent.add(`<g>${sheet().p(c.cut([[-flapW, 0], [0, 0], [0, Y - 450], [-flapW, Y - 450]], 0.6, 8), C.dustyBlue).x(c.ribbon([[-12, 10], [-14, Y - 460]], 2) + c.ribbon([[-38, 10], [-40, Y - 460]], 2), shade(C.dustyBlue, 0.2), 'opacity=".6"').out()}</g>`);

    /* ---------- people ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const priest = S.puppet(act.add(addToBody(addToHead(person(c, PRIEST), turban(c)), breastplate(c))));
    const COMP = [
      { robe: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3, belt: C.leather },
      { robe: C.sageRobe, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather },
      { robe: C.ochreRobe, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.leather },
    ].map((o, i) => ({ i, o, x1: [610, 530, 450][i], seed: c.rr(0, 9), p: S.puppet(act.add(person(c, o))) }));
    const david = S.puppet(act.add(davidPuppet(c)));
    const pouch = act.add(`<g>${sheet().p(c.cut([[-9, 0], [9, 0], [12, 18], [0, 24], [-12, 18]], 0.4, 4), C.leather).p(c.ribbon([[-8, 2], [8, 2]], 3), C.rope).out()}</g>`);
    const bread = [0, 1, 2, 3].map(() => act.add(`<g>${loaf(c, 17, shade(C.wheat2, -0.06))}</g>`));

    /* ---------- tags ---------- */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const tagD = hanging(fx, nameTag(c, tr('Dawid', 'David'), { size: 20 }), { x: 0, y: 0, len: 600 });
    const hungry = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(0 8)">${bowl(c, { w: 36, food: 'none' })}</g>`, { w: 72, h: 52 })}</g>`);
    const onlyP = hanging(fx, plate(c, `<g transform="translate(-16 -2) scale(1.2)">${turban(c)}</g><g transform="translate(20 14)">${loaf(c, 14, C.wheat2)}</g>`, { r: 52, word: tr('tylko kapłani', 'priests only'), size: 15 }), { x: TABLE.x, y: -300, len: 900 });
    const burst = fx.add(`<g opacity="0">${rayBurst(c, { n: 12, r0: 20, r1: 140, spread: 0.06, color: '#fff3cf', o: 0.8 })}</g>`);
    const sparks = [0, 1, 2].map(() => fx.add(`<g opacity="0">${sparkle(c, 11)}</g>`));

    const dKeys = [[-0.7, 150], [0.55, 690], [1.0, 690], [1.3, 770]];

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v3 — David and his companions come, hungry */
      const dx = kf(t, dKeys);
      const walking = moving(t, dKeys);
      const hunger = 1 - es(t, 1.55, 1.8);
      const eatD = bump(t, 1.55, 1.85) + bump(t, 1.8, 2.0) * 0.6;
      const give = [es(t, 1.55, 1.7), es(t, 1.62, 1.77), es(t, 1.69, 1.84)];
      const turnBack = es(t, 1.5, 1.56) * (1 - es(t, 1.9, 1.96));
      const empty = bump(t, 0.4, 1.1);
      david.set({ x: dx, y: Y, s: 1.0, flip: turnBack > 0.5, walk: walking ? dx * 0.05 : undefined, armF: hunger * 40 * (1 - es(t, 1.3, 1.42)) + es(t, 1.3, 1.42) * 70 + eatD * 44 + turnBack * 30, armB: empty * 90, head: hunger * 12 - eatD * 6, lean: hunger * 6, blink: blinkAt(T, 2) });
      COMP.forEach((m) => {
        const keys = dKeys.map(([k, v], j) => [k + 0.08 * (m.i + 1), j < 2 ? v - (690 - m.x1) : m.x1 + (j === 3 ? 60 : 0)]);
        const x = kf(t, keys);
        const got = give[m.i];
        const eat = bump(t, 1.72 + m.i * 0.08, 2.0);
        const glad = es(t, 1.78 + m.i * 0.06, 1.95);
        m.p.set({ x, y: Y + (m.i % 2 ? 6 : -4), s: 0.96, flip: false, walk: moving(t, keys) ? x * 0.05 + m.i : undefined, armF: 36 * (1 - got) + got * 72 + eat * 30, armB: glad * 50 + (1 - got) * 20 * hunger, head: 12 * (1 - glad) - eat * 6, lean: 7 * (1 - glad), blink: blinkAt(T, m.seed) });
      });
      const [bhx, bhy] = [dx - 9 + Math.sin(empty * 90 * PI / 180) * 57, Y - 138 + Math.cos(empty * 90 * PI / 180) * 57];
      pose(pouch, { x: bhx, y: bhy, r: 180 * es(t, 0.5, 0.7), o: empty > 0.02 ? 1 : 0 });
      const [dhx, dhy] = headAt(dx, Y, 1.0, false);
      const th = es(t, 0.55, 0.75, ease.back) * (1 - es(t, 1.1, 1.25));
      pose(hungry, { x: dhx + 34, y: dhy - 10, s: th, o: th > 0.01 ? 1 : 0 });
      const ld = es(t, 0.1, 0.45, ease.back);
      pose(tagD, { x: dhx - 20, y: lerp(-300, dhy - 84, ld), r: Math.sin(T * 1.1) * 0.6, oy: 0, o: ld > 0.01 ? 1 : 0 });

      /* v4 — the priest opens the tent and gives them the holy bread */
      const open = es(t, 1.05, 1.35);
      const greet = es(t, 1.1, 1.3);
      const hand = bump(t, 1.35, 1.7);
      priest.set({ x: 870, y: Y + 4, s: 1.02, flip: true, armF: greet * 40 * (1 - hand) + hand * 84, armB: greet * 50, head: -2, blink: blinkAt(T, 7) });
      pose(flapL, { x: TENT.d0, y: 450, sx: 1 - open * 0.78 });
      pose(flapR, { x: TENT.d1, y: 450, sx: 1 - open * 0.78 });
      pose(inGlow, { x: TABLE.x, y: 580, o: open * 0.9 });
      pose(burst, { x: TABLE.x, y: 580, s: 0.6 + open * 0.6, r: T * 5, o: bump(t, 1.1, 1.9) * 0.7 });
      const pl = es(t, 1.2, 1.45, ease.back);
      pose(onlyP, { x: TABLE.x + 10, y: lerp(-300, 300, pl), r: Math.sin(T * 0.9) * 0.6, oy: 0, o: pl > 0.01 ? 1 : 0 });

      const takeT = [1.36, 1.42, 1.48, 1.54];
      LOAVES.forEach((L) => {
        const idx = L.k >= 4 ? L.si * 2 + (L.k - 4) : -1;
        pose(L.el, { x: TABLE.x + (L.si ? 20 : -20), y: TABLE.top - L.k * 7, o: idx >= 0 ? 1 - seg(t, takeT[idx], takeT[idx] + 0.03) : 1 });
      });
      const [prx, pry] = handAt(870, Y + 4, 1.02, true, 84);
      bread.forEach((b, i) => {
        const t0 = takeT[i];
        const src = [TABLE.x + (i < 2 ? -20 : 20), TABLE.top - (i % 2 ? 35 : 28)];
        const toP = es(t, t0, t0 + 0.08);
        let x, y, s = 1;
        if (i === 0) {
          const [hx, hy] = handAt(dx, Y, 1.0, false, 70 + eatD * 44);
          const toD = es(t, 1.45, 1.58);
          x = lerp(lerp(src[0], prx, toP), hx, toD); y = lerp(lerp(src[1], pry, toP), hy, toD);
          s = 1 - es(t, 1.62, 1.98) * 0.6;
        } else {
          const m = COMP[i - 1];
          const keys = dKeys.map(([k, v], j) => [k + 0.08 * (m.i + 1), j < 2 ? v - (690 - m.x1) : m.x1 + (j === 3 ? 60 : 0)]);
          const mx = kf(t, keys);
          const [hx, hy] = handAt(mx, Y + (m.i % 2 ? 6 : -4), 0.96, false, 72);
          const toC = give[m.i];
          x = lerp(lerp(src[0], prx, toP), hx, toC); y = lerp(lerp(src[1], pry, toP), hy, toC) - Math.sin(toC * PI) * 40;
          s = 1 - es(t, 1.8 + m.i * 0.06, 2.0) * 0.5;
        }
        pose(b, { x, y, s, o: seg(t, t0, t0 + 0.02) });
      });
      sparks.forEach((sp, i) => {
        const m = COMP[i];
        const k = es(t, 1.8 + i * 0.05, 1.95 + i * 0.05, ease.back);
        const [hx, hy] = headAt(m.x1 + 60, Y, 0.96, false);
        pose(sp, { x: hx + 24, y: hy - 34, s: k * 0.9, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, -30], [0.6, -20], [1.2, 20], [2, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.6, 1.06], [1.2, 1.08], [2, 1.08]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.2, 24]]);
    };
  },
};
