// Łk 6,3–4 — "Have you not read what David did?": an old scroll unrolls above the field and the story comes down as a
// painted flat on parchment. David and his men come down the road from the right, worn out and hungry — David shakes
// out his empty pouch. At the house of God (the tent of blue, purple and scarlet) the curtain opens on the golden table
// with the twelve loaves of the Presence; David goes in, takes the bread, eats, and hands it to his men. "Although only
// the priests may eat it": a plate with the priest's turban and the loaf comes down over the table, the priest at the
// door lifts his hands — and the hungry men eat all the same.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { parchSet, davidPuppet, PRIEST, kf, moving, handAt, headAt, loaf, menorah, turban, breastplate, addToHead, addToBody, thought, bowl, nameTag, plate, glow, rayBurst, sparkle, storyFrame, tr, PI } from './lib.js';

const Y = 690;
const TENT = { x0: 330, x1: 770, top: 390, d0: 500, d1: 640 };
const TABLE = { x: 570, top: 620 };
const DX = 716;                     // where David stops, at the door

export default {
  id: 'lk6-david',
  enter: 'fly',
  beats: [
    { v: 3 },
    { v: 4, text: 'Jak wszedł do domu Bożego i wziąwszy chleby pokładne, sam jadł i dał swoim ludziom?' },
    { v: 4, cont: true, text: 'Chociaż samym tylko kapłanom wolno je spożywać».' },
  ],
  cam: { x: [-40, 30], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const P = parchSet(S, { gy: 650, sunAt: [1180, 180] });
    const c = P.c;

    /* ---------- the house of God ---------- */
    const tentIn = S.layer({ par: 0.5, sh: 3 });
    tentIn.add(`<rect x="${TENT.d0}" y="450" width="${TENT.d1 - TENT.d0}" height="${Y - 448}" fill="${mix(C.soilDark, C.plumRobe, 0.3)}"/>`);
    const inGlow = tentIn.add(`<g opacity="0">${glow(150)}</g>`);
    const tb = sheet();
    tb.p(c.cut(c.rect(TABLE.x - 46, TABLE.top, 92, 8), 0.3, 5), C.sun);
    tb.p(c.cut(c.rect(TABLE.x - 40, TABLE.top + 8, 6, Y - TABLE.top - 8), 0.2, 4) + c.cut(c.rect(TABLE.x + 34, TABLE.top + 8, 6, Y - TABLE.top - 8), 0.2, 4), shade(C.sun, -0.15));
    tentIn.add(tb.out());
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
    tent.add(`<g transform="translate(${TENT.x0 + 80} ${Y})">${menorah(c, 96)}</g>`);
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
    ].map((o, i) => ({ i, o, x1: [900, 990, 1080][i], seed: c.rr(0, 9), p: S.puppet(act.add(person(c, o))) }));
    const david = S.puppet(act.add(davidPuppet(c)));
    const pouch = act.add(`<g>${sheet().p(c.cut([[-9, 0], [9, 0], [12, 18], [0, 24], [-12, 18]], 0.4, 4), C.leather).p(c.ribbon([[-8, 2], [8, 2]], 3), C.rope).out()}</g>`);
    const bread = [0, 1, 2, 3].map(() => act.add(`<g>${loaf(c, 17, shade(C.wheat2, -0.06))}</g>`));

    /* ---------- the scroll, tags ---------- */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const scroll = hanging(fx, `${sheet().p(c.cut(c.rect(-120, -34, 240, 68), 0.5, 8), C.parchment).x([0, 1, 2, 3].map((k) => c.ribbon([[-100, -18 + k * 12], [100 - c.rr(0, 50), -18 + k * 12]], 1.6)).join(''), C.ink, 'opacity=".45"').p(c.cut(c.rect(-134, -42, 14, 84), 0.3, 5) + c.cut(c.rect(120, -42, 14, 84), 0.3, 5), C.wood2).out()}<text x="0" y="-48" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="18" font-style="italic" fill="${C.terracotta}">${tr('1 Księga Samuela 21', '1 Samuel 21')}</text>`, { x: 800, y: -300, len: 900 });
    const tagD = hanging(fx, nameTag(c, tr('Dawid', 'David'), { size: 20 }), { x: 0, y: -300, len: 700 });
    const hungry = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(0 8)">${bowl(c, { w: 36, food: 'none' })}</g>`, { w: 72, h: 52 })}</g>`);
    const onlyP = hanging(fx, plate(c, `<g transform="translate(-16 -2) scale(1.2)">${turban(c)}</g><g transform="translate(20 14)">${loaf(c, 14, C.wheat2)}</g>`, { r: 52, word: tr('tylko kapłani', 'priests only'), size: 15 }), { x: TABLE.x, y: -300, len: 900 });
    const burst = fx.add(`<g opacity="0">${rayBurst(c, { n: 12, r0: 20, r1: 140, spread: 0.06, color: '#fff3cf', o: 0.8 })}</g>`);
    const sparks = [0, 1, 2].map(() => fx.add(`<g opacity="0">${sparkle(c, 11)}</g>`));
    storyFrame(S);

    const dKeys = [[-0.6, 1420], [0.6, DX + 60], [1.0, DX + 60], [1.15, DX]];

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v3 — "Have you not read?": the scroll; David and his men come, hungry */
      const sc = es(t, -0.2, 0.25, ease.back) * (1 - es(t, 0.95, 1.2));
      pose(scroll, { x: 800, y: lerp(-300, 190, sc), r: Math.sin(T * 0.8) * 0.8, oy: 0, o: sc > 0.01 ? 1 : 0 });
      const dx = kf(t, dKeys);
      const walking = moving(t, dKeys);
      const hunger = 1 - es(t, 1.45, 1.7);
      const eatD = bump(t, 1.42, 1.72);
      const empty = bump(t, 0.45, 1.05);
      david.set({ x: dx, y: Y, s: 1.0, flip: true, walk: walking ? dx * 0.05 : undefined, armF: hunger * 36 * (1 - es(t, 1.15, 1.3)) + es(t, 1.15, 1.3) * 70 * (1 - es(t, 1.38, 1.45)) + eatD * 70, armB: empty * 90 + es(t, 1.55, 1.7) * 60, head: hunger * 12 - eatD * 6, lean: hunger * 5, blink: blinkAt(T, 2) });
      const give = [es(t, 1.55, 1.7), es(t, 1.62, 1.77), es(t, 1.69, 1.84)];
      COMP.forEach((m) => {
        const keys = [[-0.5 + m.i * 0.08, 1500 + m.i * 90], [0.62 + m.i * 0.08, m.x1], [2, m.x1]];
        const x = kf(t, keys);
        const got = give[m.i];
        const eat = bump(t, 1.78 + m.i * 0.06, 2.1);
        const glad = es(t, 1.8 + m.i * 0.06, 1.95);
        m.p.set({ x, y: Y + (m.i % 2 ? 6 : -4), s: 0.96, flip: true, walk: moving(t, keys) ? x * 0.05 + m.i : undefined, armF: 30 * (1 - got) + got * 70 + eat * 30, armB: glad * 40 + (1 - got) * 16 * hunger, head: 12 * (1 - glad) - eat * 6, lean: 6 * (1 - glad), blink: blinkAt(T, m.seed) });
      });
      pose(pouch, { x: dx + 9 - Math.sin((empty * 90 * PI) / 180) * 57, y: Y - 138 + Math.cos((empty * 90 * PI) / 180) * 57, r: 180 * es(t, 0.5, 0.7), o: empty > 0.02 ? 1 : 0 });
      const [dhx, dhy] = headAt(dx, Y, 1.0, true);
      const th = es(t, 0.55, 0.75, ease.back) * (1 - es(t, 1.05, 1.2));
      pose(hungry, { x: dhx - 20, y: dhy - 16, s: th, o: th > 0.01 ? 1 : 0 });
      const ld = es(t, 0.15, 0.45, ease.back) * (1 - es(t, 2.2, 2.5));
      pose(tagD, { x: dhx + 78, y: lerp(-300, dhy - 70, ld), r: Math.sin(T * 1.1) * 0.6, oy: 0, o: ld > 0.01 ? 1 : 0 });

      /* v4a — the curtain opens; he takes the bread, eats, and gives it to his men */
      const open = es(t, 1.02, 1.3);
      priest.set({ x: 452, y: Y + 4, s: 1.0, flip: false, armF: open * 40 + es(t, 2.1, 2.3) * 40, armB: open * 50 + es(t, 2.1, 2.3) * 90, head: -2 - es(t, 2.1, 2.3) * 6, blink: blinkAt(T, 7), o: 1 });
      pose(flapL, { x: TENT.d0, y: 450, sx: 1 - open * 0.78 });
      pose(flapR, { x: TENT.d1, y: 450, sx: 1 - open * 0.78 });
      pose(inGlow, { x: TABLE.x, y: 580, o: open * 0.9 });
      pose(burst, { x: TABLE.x, y: 580, s: 0.6 + open * 0.6, r: T * 5, o: bump(t, 1.1, 1.9) * 0.7 });
      const takeT = [1.3, 1.36, 1.42, 1.48];
      LOAVES.forEach((L) => {
        const idx = L.k >= 4 ? L.si * 2 + (L.k - 4) : -1;
        pose(L.el, { x: TABLE.x + (L.si ? 20 : -20), y: TABLE.top - L.k * 7, o: idx >= 0 ? 1 - seg(t, takeT[idx], takeT[idx] + 0.03) : 1 });
      });
      const [dax, day] = handAt(dx, Y, 1.0, true, 70);
      bread.forEach((b, i) => {
        const t0 = takeT[i];
        const src = [TABLE.x + (i < 2 ? -20 : 20), TABLE.top - (i % 2 ? 35 : 28)];
        const toD = es(t, t0, t0 + 0.08);
        let x, y, s = 1;
        if (i === 0) {
          const [hx, hy] = handAt(dx, Y, 1.0, true, 70 + eatD * 44);
          x = lerp(src[0], hx, toD); y = lerp(src[1], hy, toD);
          s = 1 - es(t, 1.62, 1.98) * 0.6;
        } else {
          const m = COMP[i - 1];
          const [hx, hy] = handAt(m.x1, Y + (m.i % 2 ? 6 : -4), 0.96, true, 70);
          const toC = give[m.i];
          x = lerp(lerp(src[0], dax, toD), hx, toC); y = lerp(lerp(src[1], day, toD), hy, toC) - Math.sin(toC * PI) * 40;
          s = 1 - es(t, 1.85 + m.i * 0.06, 2.05) * 0.5;
        }
        pose(b, { x, y, s, o: seg(t, t0, t0 + 0.02) });
      });
      sparks.forEach((sp, i) => {
        const m = COMP[i];
        const k = es(t, 1.8 + i * 0.05, 1.95 + i * 0.05, ease.back) * (1 - es(t, 2.1, 2.3));
        const [hx, hy] = headAt(m.x1, Y, 0.96, true);
        pose(sp, { x: hx - 24, y: hy - 34, s: k * 0.9, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      /* v4b — only the priests may eat it */
      const pl = es(t, 2.05, 2.35, ease.back);
      pose(onlyP, { x: TABLE.x, y: lerp(-300, 320, pl), r: Math.sin(T * 0.9) * 0.6, oy: 0, o: pl > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 30], [0.6, 20], [1.2, -20], [2.2, -30]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.6, 1.05], [1.2, 1.08], [2.2, 1.06]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.2, 24], [2.2, 10]]);
    };
  },
};
