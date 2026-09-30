// Łk 9,16–17 — the companies sit in their rings on the evening slope. Jesus takes the five loaves and the two fish,
// looks up to heaven — a warm light opens over Him — blesses and breaks them, and gives them to the disciples: the
// pieces go into their baskets, and they carry them out and set them down in the middle of every company. "They ate
// and were all filled": little hearts rise over the rings as the bread goes. "And twelve baskets of broken pieces were
// gathered": the baskets come back full and stand in two rows of six before Him, and a tag comes down with the count.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { bethSet, ringSprites, RINGS, TW9, basket, barleyLoaf, fishCut, crumb, heart, sparkle, labelTag, halo, rayBurst, kf, hand, tr, PI } from './lib.js';

const JX = 790;
const CARRY = [{ k: 'peter', x0: 690, to: 3 }, { k: 'john', x0: 900, to: 5 }, { k: 'andrew', x0: 610, to: 1 }, { k: 'james', x0: 980, to: 6 }];

export default {
  id: 'lk9-loaves',
  beats: [
    { v: 16 },
    { v: 17, text: 'Jedli i nasycili się wszyscy,' },
    { v: 17, cont: true, text: 'i zebrano jeszcze dwanaście koszów ułomków, które im zostały.' },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [0.98, 1.12] },
  build(S) {
    const B = bethSet(S, { eveCols: ['#7d78a6', '#e3a78b', '#f4cf9f'] });
    const c = S.c;
    B.eve.fade(0.85);
    const gy = (x) => B.gfn(x) + 18;
    const SEAT = ringSprites(B);
    // the heavens opening: a warm light from above, behind everything on the slope
    const heaven = B.hangL.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 10, r1: 820, spread: 0.035, color: '#fff3cf', o: 0.6 })}</g>`);
    // bread and fish set in the middle of each company, then the hearts when they are filled
    const food = S.layer({ par: 0.3, sh: 3 });
    const FOOD = RINGS.map(([x, y, s], i) => ({ i, x, y, s, el: food.add(`<g opacity="0"><g transform="scale(${s * 1.6})"><g transform="translate(-10 0)">${barleyLoaf(c, 12)}</g><g transform="translate(12 -2) scale(.55)">${fishCut(c, { color: i % 2 ? C.lake3 : C.teal2 })}</g><g transform="translate(0 4)">${crumb(c, 7)}</g></g></g>`), joy: food.add(`<g opacity="0">${i % 3 ? heart(c, 9) : sparkle(c, 11)}</g>`) }));

    /* Jesus, the disciples with their baskets, the seated three */
    const glowL = S.layer({ par: 0.5, sh: 1, flat: true });
    const glowJ = glowL.add(`<g opacity="0">${halo(190, 1)}</g>`);
    const act = S.layer({ par: 0.5, sh: 5 });
    const SITTERS = [{ k: 'philip', x: 930 }, { k: 'matthew', x: 1000 }, { k: 'thomas', x: 650 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit' }))) }));
    const bk = `<g transform="translate(-30 12) rotate(70)">${basket(c, { w: 40, h: 24 })}</g>`;
    const D = CARRY.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...TW9[d.k], holdF: bk }))) }));
    const BASK = Array.from({ length: 12 }, (_, i) => {
      const side = i < 6 ? -1 : 1, k = i % 6;
      const x = side < 0 ? 420 + k * 50 : 890 + k * 50;
      return { i, x, y: 740 - (k % 2) * 8, el: act.add(`<g opacity="0">${basket(c, { w: 46, h: 28, full: true })}</g>`) };
    }).sort((a, b) => a.y - b.y);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const held = act.add(`<g>${[-26, -13, 0, 13, 26].map((x, i) => `<g transform="translate(${x} ${-Math.abs(x) * 0.3 - (i % 2) * 5})">${barleyLoaf(c, 12)}</g>`).join('')}<g transform="translate(-6 -26) rotate(-12) scale(.8)">${fishCut(c, { color: C.teal2 })}</g><g transform="translate(14 -30) rotate(10) scale(.8)">${fishCut(c)}</g></g>`);
    const halves = [0, 1].map((i) => act.add(`<g opacity="0">${barleyLoaf(c, 13)}</g>`));
    const fx = S.layer({ par: 0.55, sh: 4 });
    const PIECES = Array.from({ length: 8 }, (_, i) => ({ i, d: i % 4, el: fx.add(`<g opacity="0">${i % 3 ? crumb(c, 9) : barleyLoaf(c, 9)}</g>`) }));
    const t12 = hanging(fx, `<g transform="scale(1.25)">${labelTag(tr('12 koszów ułomków', '12 baskets of pieces'), 20)}</g>`, { x: 0, y: -1500, len: 900 });

    return (t, time) => {
      const T = time;
      B.update(T, { sunX: 1110, sunY: 420 });

      /* v16 — takes, looks up, blesses, breaks, gives to the disciples to set before the crowd */
      const lift = es(t, 0.02, 0.18) * (1 - es(t, 0.36, 0.46));
      const bless = bump(t, 0.1, 0.6);
      const brk = es(t, 0.36, 0.44);
      const give = bump(t, 0.44, 0.7);
      jesus.set({ x: JX, y: gy(JX), s: 1.04, flip: give > 0.2 && Math.sin(t * 20) > 0, armF: 30 + lift * 80 + brk * 40 * (1 - es(t, 0.7, 0.8)) + give * 20 + bump(t, 1.1, 1.9) * 30, armB: 10 + lift * 100 + brk * 50 * (1 - es(t, 0.7, 0.8)) + bump(t, 1.1, 1.9) * 60, head: -lift * 24, blink: blinkAt(T, 1) });
      const [hx, hy] = hand(JX, gy(JX), 1.04, false, 30 + lift * 80 + brk * 40);
      pose(held, { x: hx - 10, y: hy - 8, s: 1.05, o: 1 - brk });
      halves.forEach((h, i) => pose(h, { x: hx - 10 + (i ? 14 : -14) * brk, y: hy - 12, r: (i ? 20 : -20) * brk, o: brk * (1 - es(t, 0.66, 0.74)) }));
      pose(heaven, { x: JX, y: -200, r: T * 2, o: bless * 0.6 });
      pose(glowJ, { x: JX, y: gy(JX) - 240, s: 0.4 + bless * 0.8, o: bless * 0.9 + bump(t, 1.1, 1.9) * 0.3 });
      D.forEach((d) => {
        const r = RINGS[d.to];
        const out = es(t, 0.56 + d.i * 0.025, 0.8 + d.i * 0.025);
        const back = es(t, 2.02 + d.i * 0.03, 2.3 + d.i * 0.03);
        const tx = r[0] + (r[0] < JX ? 80 : -80);
        const x = lerp(lerp(d.x0, tx, out), d.x0 + (d.x0 < JX ? -150 : 150), back);
        const moving = (out > 0 && out < 1) || (back > 0 && back < 1);
        d.p.set({ x, y: gy(x) + 6 + (d.i % 2) * 8, s: 0.9, flip: moving ? (back > 0 ? d.x0 > JX : tx < d.x0) : d.x0 > JX, walk: moving ? x * 0.07 : undefined, armF: 70 + bump(t, 0.9, 1.05) * 20, armB: bump(t, 0.9, 1.05) * 40, lean: bump(t, 0.9, 1.05) * 10, blink: blinkAt(T, d.seed) });
      });
      PIECES.forEach((p) => {
        const d = D[p.d];
        const k = seg(t, 0.44 + p.i * 0.015, 0.56 + p.i * 0.015);
        const [bx, by] = hand(d.x0, gy(d.x0), 0.9, d.x0 > JX, 70);
        pose(p.el, { x: lerp(hx, bx, k), y: lerp(hy - 10, by - 10, k) - Math.sin(k * PI) * 60, r: k * 200, o: k > 0 && k < 1 ? 1 : 0 });
      });
      SITTERS.forEach((d) => d.p.set({ x: d.x, y: gy(d.x) + 14, s: 0.92, flip: d.x > JX, armF: 30 + bump(t, 1.1, 1.9) * 40, head: -6, blink: blinkAt(T, d.seed) }));
      FOOD.forEach((f) => {
        const on = es(t, 0.64 + (f.i % 8) * 0.02, 0.72 + (f.i % 8) * 0.02);
        const eaten = es(t, 1.1 + (f.i % 6) * 0.05, 1.5 + (f.i % 6) * 0.05);
        pose(f.el, { x: f.x, y: f.y + 2, s: 1 - eaten * 0.7, o: on * (1 - eaten) });
        /* v17a — they ate and were filled */
        const j = bump(t, 1.2 + (f.i % 6) * 0.06, 2.0);
        pose(f.joy, { x: f.x + Math.sin(T * 2 + f.i) * 6, y: f.y - 70 * f.s * 1.4 - j * 30, s: j * f.s * 2, o: j > 0.02 ? 1 : 0 });
      });

      /* v17b — twelve baskets of broken pieces */
      BASK.forEach((b) => {
        const k = es(t, 2.08 + (b.i % 6) * 0.05 + (b.i > 5 ? 0.02 : 0), 2.24 + (b.i % 6) * 0.05 + (b.i > 5 ? 0.02 : 0), ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const k12 = es(t, 2.35, 2.6, ease.back);
      pose(t12, { x: 800, y: lerp(-1500, 250, k12), r: Math.sin(T * 1.2) * 2, oy: 0, o: k12 > 0.002 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.1], [0.6, 1.1], [0.9, 1.0], [1.9, 1.0], [2.3, 1.06]]);
      S.cam.y = kf(t, [[0, 50], [0.6, 50], [0.9, 20], [1.9, 20], [2.3, 50]]);
    };
  },
};
