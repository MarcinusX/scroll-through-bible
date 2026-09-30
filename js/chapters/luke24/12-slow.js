// Łk 24,25–26 — The Stranger turns to them: "O foolish ones, and slow of heart to believe all that the prophets have
// spoken!" — over them hang the open scrolls of the prophets, and in each of the two a heart of grey stone.
// "Was it not necessary for the Christ to suffer these things and to enter into His glory?" — a long painted board
// comes down: the cross on its dark hill at one end, and from it a golden road climbing into light at the other.
import { C, blinkAt, pose, lerp, mix } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { LATE, GOLDEN, emmausSet, RD, TRIO, roadTrio, headAt, hangK, flat, crossHill, lightCrown, scrollOpen, stoneHeart, bodyAt, sparkle, STRING } from './lib.js';

const GY = RD.GY;
const FW = 520, FH = 170;

export default {
  id: 'lk24-slow',
  beats: [
    { v: 25 },
    { v: 26 },
  ],
  cam: { x: [-40, 40], y: [-20, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: LATE, sky2: GOLDEN, sunAt: [1250, 250] });
    const R = roadTrio(S, E.act, E.fx);
    const scrolls = [0, 1, 2].map((i) => ({ i, el: E.bits.add(`<g><path d="M0 -1600V-34" stroke="${STRING}" stroke-width="1.2" fill="none"/>${scrollOpen(c, 86, 58)}</g>`) }));
    const hearts = [0, 1].map(() => E.fx.add(`<g>${stoneHeart(c, 15)}</g>`));

    /* the board: the cross, and the road up into glory */
    const gid = S.id('glorygrad');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(C.duskViolet, C.plumRobe, 0.3)}"/><stop offset=".45" stop-color="${C.dusk}"/><stop offset="1" stop-color="#fbeccb"/></linearGradient>`);
    const road = c.cbez([-170, 64], [-40, 70], [40, 10], [170, -34], 30);
    const inner = `<rect x="${-FW / 2 - 2}" y="${-FH / 2 - 2}" width="${FW + 4}" height="${FH + 4}" fill="url(#${gid})"/>`
      + `<circle cx="190" cy="-40" r="120" fill="url(#halo-glow)"/>`
      + `<path d="${c.cut([[-FW / 2 - 4, 90], [-FW / 2 - 4, 58], [-120, 50], [0, 60], [120, 40], [FW / 2 + 4, 20], [FW / 2 + 4, 90]], 0.8, 8)}" fill="${mix(C.hillNear, C.duskViolet, 0.35)}"/>`
      + `<g transform="translate(-190 66)">${crossHill(c, 0.9)}</g>`
      + `<path d="${c.ribbon(road, (u) => 14 - u * 8, 1)}" fill="${C.halo}"/>`
      + `<g transform="translate(192 -42)">${lightCrown(c, 26)}</g>`;
    const board = E.FL.add(flat(S, inner, { w: FW, h: FH }));
    const walker = E.bits.add(`<g><circle r="16" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 7, 10), 0.2, 2)}" fill="${C.halo}"/></g>`);
    const spk = E.bits.add(`<g>${sparkle(c, 16)}</g>`);

    return (t, T) => {
      E.update(T, { sunY: 250 + es(t, 0, 2) * 20 });
      E.sk2.fade(es(t, 1.0, 2.0) * 0.6);
      /* v25: "O foolish ones, slow of heart…" */
      const speak = es(t, 0.05, 0.3);
      const point = es(t, 1.05, 1.3);
      R.stSet({ x: TRIO.ST, y: GY + 2, s: TRIO.S + 0.02, flip: t < 1 ? false : false, armF: 34 + speak * 50 * (1 - point) + point * 30, armB: 10 + speak * 100 * (1 - point) + point * 140, head: -speak * 4 - point * 10, blink: blinkAt(T, 6) });
      R.halo(0.26);
      const bowed = es(t, 0.3, 0.6) * (1 - point * 0.7);
      R.fr.p.set({ x: TRIO.FR, y: GY - 2, s: TRIO.S, armF: 20 - bowed * 6 + point * 30, armB: 10, head: bowed * 14 - point * 12, blink: blinkAt(T, 1) });
      R.cl.p.set({ x: TRIO.CL, y: GY + 4, s: TRIO.S, flip: true, armF: 22 + point * 20, armB: 12, head: bowed * 14 - point * 12, blink: blinkAt(T, 4) });
      fade(R.fr.sad, 0.6);
      fade(R.cl.sad, 0.6);
      [[TRIO.FR, false], [TRIO.CL, true]].forEach(([x, fl], i) => {
        const hk = es(t, 0.35 + i * 0.1, 0.55 + i * 0.1, ease.back) * (1 - es(t, 1.9, 2.0) * 0);
        const [bx, by] = bodyAt(x, GY + (i ? 4 : -2), TRIO.S, fl, 6, -104);
        pose(hearts[i], { x: bx, y: by, s: hk, o: hk > 0.01 ? 1 : 0 });
      });
      scrolls.forEach((sc) => {
        const k = es(t, 0.15 + sc.i * 0.1, 0.4 + sc.i * 0.1, ease.back) * (1 - es(t, 0.95, 1.1, ease.in));
        hangK(sc.el, k, 620 + sc.i * 180, 300 + (sc.i % 2) * 24, T, sc.i);
      });

      /* v26: to suffer, and so to enter into His glory */
      const bk = es(t, 1.05, 1.35, ease.out);
      hangK(board, bk, 800, 290, 0, 0);
      const by = lerp(-1500, 290, bk);
      const u = es(t, 1.35, 1.9);
      const i = Math.min(road.length - 1, Math.floor(u * (road.length - 1)));
      pose(walker, { x: 800 + road[i][0], y: by + road[i][1] - 10, o: bk > 0.99 ? es(t, 1.35, 1.4) : 0 });
      const sb = bump(t, 1.8, 2.0);
      pose(spk, { x: 992, y: by - 42, s: sb * 1.4, r: T * 30, o: sb });

      S.cam.x = 0;
      S.cam.y = 14;
      S.cam.z = S.portrait ? 0.98 : 1.04;
      void seg; void bump;
    };
  },
};
