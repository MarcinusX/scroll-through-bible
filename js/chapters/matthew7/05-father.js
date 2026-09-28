// Mt 7,9–11 — back on the mountainside. In the front row a little boy tugs at his father's sleeve and asks for
// bread: a grey stone shaped like a loaf swings down in front of them — would anyone give him that? It is snatched
// back up, and the father gives him a real loaf. He asks for a fish: a hissing snake drops down — snatched away too;
// he gets a fish. "How much more will your Father in heaven": the sky above the hill turns gold, rays pour down,
// and good gifts of light float down onto everyone who lifts up their hands.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountSet, manOf, womanOf, childOf, handAt, speech, stoneLoaf, breadLoaf, snake, smallFish, heart, sparkle, rayBurst, glowDisc, tag, THATDAY, SPRING, kf, PI } from './lib.js';

const JX = 800;
const FY = 776;

export default {
  id: 'mt7-father',
  beats: [
    { v: 9 },
    { v: 10 },
    { v: 11 },
  ],
  cam: { x: [-90, 20], y: [-40, 130], z: [1, 1.36] },
  build(S) {
    const c = S.c;
    // the rays of heaven (v11) come down behind the crowd's slope
    const H = mountSet(S, { sky2: THATDAY });
    const JY = H.JY;
    // the rays of heaven (v11) come down behind the crowd's slope
    const rays = H.mid.add(`<g><g transform="translate(800 -160)">${rayBurst(c, { n: 26, r0: 40, r1: 1500, spread: 0.035, color: '#fff3cf', o: 0.7 })}</g><circle cx="800" cy="-60" r="560" fill="url(#halo-glow)"/></g>`);


    /* the front row: the father and his boy, and others who will lift their hands */
    const front = S.layer({ par: 0.6, sh: 5 });
    front.add(`<g>${sheet().p(c.ridge(c.wave(FY - 14, [4, 2], [500, 160]), -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.3)).out()}</g>`);
    const FO = manOf(c, { robe: C.sageRobe, mantle: C.wood3, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather });
    const father = S.puppet(front.add(person(c, { ...FO, pose: 'sit' })));
    const boy = S.puppet(front.add(person(c, childOf(0, { robe: C.skyVeil, hair: C.hair2 }))));
    const OTHERS = [[340, womanOf(c, { robe: C.mauve }), false], [1000, manOf(c, { robe: C.wheatRobe }), false], [1120, womanOf(c, { robe: C.tealRobe, veil: C.blushVeil }), true], [1260, manOf(c, { robe: C.plumRobe }), true]].map(([x, o, flip], i) => ({ x, flip, i, seed: c.rr(0, 9), p: S.puppet(front.add(person(c, { ...o, pose: 'sit' }))) }));
    const breadEl = front.add(`<g>${breadLoaf(c, 18)}</g>`);
    const fishEl = front.add(`<g transform="scale(1.3)">${smallFish(c, { col: C.lake3 })}</g>`);

    /* what he asks for; what no father would give */
    const fly = S.layer({ par: 0.6, sh: 6 });
    const askB = fly.add(`<g>${speech(c, `<g transform="translate(0 8)">${breadLoaf(c, 16)}</g>`, { w: 64, h: 46, flip: true })}</g>`);
    const askF = fly.add(`<g>${speech(c, `<g transform="scale(1.1)">${smallFish(c, { col: C.lake3 })}</g>`, { w: 70, h: 44, flip: true })}</g>`);
    const stoneH = hanging(fly, `<g transform="translate(0 30)">${stoneLoaf(c, 30)}</g><g transform="translate(46 -6)">${tag(c, '?', { size: 22, w: 34 })}</g>`, { x: 0, y: 0, len: 900 });
    const snakeH = hanging(fly, `<g transform="translate(0 56) scale(1.3)">${snake(c)}</g><g transform="translate(58 -6)">${tag(c, '?', { size: 22, w: 34 })}</g>`, { x: 0, y: 0, len: 900 });
    const hiss = fly.add(`<path d="${c.ribbon([[0, 0], [10, -3], [16, 0]], 1.6)}" fill="${C.terracotta}"/>`);

    /* the good gifts of light */
    const gifts = S.layer({ par: 0.6, sh: 3 });
    const GIFT = [[340, 'h'], [560, 'b'], [650, 's'], [1000, 'b'], [1120, 'h'], [1260, 's'], [460, 's'], [880, 'h'], [720, 'b'], [1190, 'b']].map(([x, kind], i) => {
      const inner = kind === 'h' ? heart(c, 11) : kind === 'b' ? `${glowDisc(40, 'halo-glow', 0.9)}<g transform="translate(0 8)">${breadLoaf(c, 14, C.wheat)}</g>` : `${glowDisc(36, 'halo-glow', 0.9)}${sparkle(c, 13, C.star)}`;
      return { x, i, kind, el: gifts.add(`<g>${inner}</g>`) };
    });

    const FX = 592, BX = 686;
    return (t, time) => {
      const T = time;
      const heaven = es(t, 2.05, 2.45);
      H.sky2.fade(heaven * 0.85);
      pose(rays, { o: heaven });

      /* Jesus teaches; at v11 he lifts his hand to heaven */
      const upK = es(t, 2.1, 2.35);
      H.pose(t, T, { armF: 34 + bump(t, 0.1, 0.9) * 20 + bump(t, 1.1, 1.9) * 20 - upK * 10, armB: 10 + bump(t, 0.2, 0.8) * 40 + upK * 140, head: -4 - upK * 10, blink: blinkAt(T, 1) });
      H.listen(T, (d) => ({ armF: 16 + (d.i % 3) * 8 + upK * 30, armB: 8 + upK * (d.i % 2 ? 60 : 110), head: (d.flip ? 3 : -3) - upK * 12, blink: blinkAt(T, d.seed) }));

      /* v9 — bread, not a stone */
      const tug1 = bump(t, 0.05, 0.25), tug2 = bump(t, 1.05, 1.25);
      const giveB = es(t, 0.56, 0.74), giveF = es(t, 1.56, 1.74);
      const hug = Math.max(es(t, 0.74, 0.86) * (1 - es(t, 1.0, 1.1)), es(t, 1.74, 1.86));
      boy.set({ x: BX, y: FY, s: 0.66, flip: true, armF: 30 + (tug1 + tug2) * 40 + hug * 30, armB: 10 + (tug1 + tug2) * 20 + hug * 40 + upK * 140, head: 8 - upK * 18, blink: blinkAt(T, 3) });
      const fGive = Math.max(bump(t, 0.5, 0.8), bump(t, 1.5, 1.8));
      const shake = (bump(t, 0.34, 0.54) + bump(t, 1.34, 1.54)) * Math.sin(t * 60) * 5;
      father.set({ x: FX, y: FY, s: 1.08, armF: 20 + fGive * 60 + upK * 60, armB: 10 + upK * 130, head: 6 + shake - upK * 18, blink: blinkAt(T, 5) });
      const ab = es(t, 0.06, 0.2, ease.back) * (1 - es(t, 0.45, 0.55));
      const af = es(t, 1.06, 1.2, ease.back) * (1 - es(t, 1.45, 1.55));
      pose(askB, { x: BX - 20, y: FY - 124, s: ab, o: ab > 0.01 ? 1 : 0 });
      pose(askF, { x: BX - 20, y: FY - 124, s: af, o: af > 0.01 ? 1 : 0 });
      const sk = es(t, 0.22, 0.4, ease.out) * (1 - es(t, 0.94, 1.04, ease.in));
      const away = es(t, 0.5, 0.62);
      pose(stoneH, { x: 640 - away * 40, y: lerp(-520, 580, sk) - away * 130, r: Math.sin(T * 1.1) * 2, o: sk > 0.01 ? 1 : 0 });
      const nk = es(t, 1.22, 1.4, ease.out) * (1 - es(t, 1.94, 2.04, ease.in));
      const away2 = es(t, 1.5, 1.62);
      const snX = 636 - away2 * 40, snY = lerp(-520, 552, nk) - away2 * 130;
      pose(snakeH, { x: snX, y: snY, r: Math.sin(T * 1.3) * 3, o: nk > 0.01 ? 1 : 0 });
      pose(hiss, { x: snX + 37 * 1.3, y: snY + 56 - 52 * 1.3 - 16, s: 1.4, o: nk > 0.9 && away2 < 0.1 ? (time ? (Math.sin(T * 14) > 0 ? 1 : 0) : 1) : 0 });
      // the loaf and the fish, from the father's hand into the boy's
      const [fx, fy] = handAt(FX, FY, 1.08, false, 80, 0, 62);
      const [bx, by] = handAt(BX, FY, 0.66, true, 60);
      pose(breadEl, { x: lerp(fx, bx - 4, giveB), y: lerp(fy + 4, by - 2, giveB), o: seg(t, 0.5, 0.56) * (1 - es(t, 2.0, 2.1)) });
      pose(fishEl, { x: lerp(fx, bx + 10, giveF), y: lerp(fy - 2, by - 26, giveF), r: giveF * -20, o: seg(t, 1.5, 1.56) * (1 - es(t, 2.0, 2.1)) });

      /* v11 — the gifts of light on all who lift their hands */
      OTHERS.forEach((m) => {
        const k = es(t, 2.3 + m.i * 0.05, 2.5 + m.i * 0.05);
        m.p.set({ x: m.x, y: FY + (m.i % 2) * 4, s: 0.98, flip: m.flip, armF: 20 + k * 70, armB: 10 + k * 130, head: -k * 16, blink: blinkAt(T, m.seed) });
      });
      GIFT.forEach((g) => {
        const k = es(t, 2.25 + (g.i % 5) * 0.06, 2.7 + (g.i % 5) * 0.05, ease.out);
        const yEnd = g.i < 6 ? 560 : 470;
        pose(g.el, { x: g.x + Math.sin(T * 0.8 + g.i) * 8, y: lerp(-80, yEnd, k) + Math.sin(T * 1.2 + g.i) * 4, s: 1.25 + Math.sin(T * 1.6 + g.i) * 0.06, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1.34 - heaven * 0.34;
      S.cam.y = 120 - heaven * 140;
      S.cam.x = -80 * (1 - heaven);
    };
  },
};
