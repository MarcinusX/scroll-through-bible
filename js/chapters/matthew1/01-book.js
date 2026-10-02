// Mt 1,1 — the book of the genealogy: the curtains open on a great closed book on its lectern. It opens,
// and a vine shoots up out of its pages: at the top a medallion of light, Jesus Christ; then, as the
// sentence names them, David with his harp and crown, and Abraham under the stars, on the same vine.
import { C, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, stars } from '../../assets/nature.js';
import {
  PARCH, RIM, ICON, medal, lineage, phoneFit, bookParts, lectern, glowDisc, rayBurst, glowStar, DAVID, ABRAHAM, harp, sparkle,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { CAST } from '../kit.js';

const BX = 800, BY = 600, BW = 210, BH = 150;   // the book's gutter (bottom), page size

export default {
  id: 'mt1-book',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, PARCH);

    /* ---------- paper stars hung from the flies, a soft wall of light ---------- */
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const hs = [[470, 170, 11], [560, 110, 8], [1130, 150, 12], [1040, 96, 8], [430, 330, 7], [1190, 330, 9]].map(([x, y, r], i) => ({ x, y, i, el: hanging(hangL, glowStar(c, r, C.sun), { x, y, len: 600 }) }));
    const back = S.layer({ par: 0.08, sh: 2 });
    back.add(band(c, { y: 612, amps: [10, 4, 2], lens: [900, 300, 120], color: mix(C.parchment, C.dune, 0.4) }).markup);
    const glowL = S.layer({ par: 0.1, sh: 1, flat: true });
    const topGlow = glowL.add(`<g>${glowDisc(360, 'halo-glow', 1)}</g>`);
    const topRays = glowL.add(`<g>${rayBurst(c, { n: 26, r0: 70, r1: 680, spread: 0.03, color: '#fff3cf', o: 0.5 })}</g>`);

    /* ---------- the lectern and the floor ---------- */
    const floor = S.layer({ par: 0.3, sh: 3 });
    floor.add(sheet().p(c.ridge((x) => 690 + Math.sin(x * 0.01) * 2, -1100, 2700, 1900, 16, 0.6), mix(C.wood3, C.parchment, 0.35)).x(c.ribbon([[-1100, 700], [2700, 700]], 2), shade(C.wood3, -0.2), 'opacity=".4"').out());
    const bookL = S.layer({ par: 0.3, sh: 5 });
    bookL.add(`<g transform="translate(${BX} 702)">${lectern(c, 100)}</g>`);
    const B = bookParts(c, { w: BW, h: BH, fs: 22, left: tr('Rodowód', 'The genealogy'), right: tr('Jezusa Chrystusa', 'of Jesus Christ') });
    const base = bookL.add(`<g>${B.base}</g>`);
    const leftSide = bookL.add(`<g>${B.leftSide}</g>`);
    const coverEl = bookL.add(`<g>${B.cover}</g>`);

    /* ---------- the vine: book → Abraham → David → Jesus ---------- */
    const vineL = S.layer({ par: 0.3, sh: 3 });
    const medL = S.layer({ par: 0.3, sh: 6 });
    const J = { ...CAST.jesus };
    const nodes = [
      { key: 'abraham', root: [BX, BY - BH - 6], x: 1010, y: 372, r: 54, at: 1.58, linkAt: 1.2, grow: 0.16,
        markup: medal(S, ABRAHAM, { r: 54, ...RIM.night, name: tr('Abraham', 'Abraham'), flip: true, icon: ICON.stars(c), badgeFill: mix(C.indigo, C.night, 0.3) }) },
      { key: 'david', parent: 'abraham', x: 596, y: 300, r: 56, at: 1.46, linkAt: 1.28, grow: 0.12,
        markup: medal(S, DAVID, { r: 56, ...RIM.king, name: tr('Dawid', 'David'), king: true, icon: ICON.harp(c) }) },
      { key: 'jesus', parent: 'david', x: 800, y: 158, r: 64, at: 1.34, linkAt: 1.34, grow: 0.1,
        markup: medal(S, J, { r: 64, ...RIM.holy, name: tr('Jezus Chrystus', 'Jesus Christ'), icon: ICON.star(c), size: 24 }) },
    ];
    phoneFit(S, nodes, { k: 0.85 });   // phone: Abraham and David come in from the edges
    const line = lineage(S, vineL, medL, nodes);
    // the order the sentence names them: Jesus Christ, son of David, son of Abraham — a light runs down the vine
    const runL = S.layer({ par: 0.3, sh: 1, flat: true });
    const runner = runL.add(`<g>${glowDisc(70, 'halo-glow', 1)}<path d="${c.poly(c.star(0, 0, 18, 4, 4, 0))}" fill="${C.star}"/></g>`);
    const PATH = [2, 1, 0].map((i) => [nodes[i].x, nodes[i].y]);
    const rings = nodes.map((n) => runL.add(`<g><path d="${c.ribbon(c.arc(0, 0, n.r + 16, n.r + 16, 0, PI * 2, 40), 4)}" fill="#fff3cf"/></g>`));
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => runL.add(`<g>${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);
      hs.forEach((h) => swing(h.el, h.x, h.y, time, 1.4, 0.7, h.i));

      /* v1: the book opens (its cover turns over to the left) */
      const open = es(t, 1.0, 1.22);
      const gx = BX - (1 - open) * BW / 2;
      pose(base, { x: gx, y: BY });
      pose(coverEl, { x: gx, y: BY, sx: Math.max(0.001, 1 - open * 2), o: open < 0.5 ? 1 : 0 });
      pose(leftSide, { x: gx, y: BY, sx: Math.max(0.001, open * 2 - 1), o: open > 0.5 ? 1 : 0 });
      /* … and the vine shoots up out of it; the medallions bloom in the order of the sentence */
      line.update(t);
      // the three in the order named: Jesus Christ (1.6) — son of David — son of Abraham: a ring of light passes down
      const ringAt = [1.62, 1.48, 1.36];
      rings.forEach((r, i) => { const n = nodes[i], k = bump(t, ringAt[i] - 0.1, ringAt[i] + 0.2); pose(r, { x: n.x, y: n.y, s: 0.9 + k * 0.2, o: k * 0.8 }); });
      const run = seg(t, 1.34, 1.62);
      const seg2 = run < 0.5 ? run * 2 : (run - 0.5) * 2, [a, b] = run < 0.5 ? [PATH[0], PATH[1]] : [PATH[1], PATH[2]];
      pose(runner, { x: lerp(a[0], b[0], seg2), y: lerp(a[1], b[1], seg2), s: 1, r: t * 90, o: bump(t, 1.32, 1.66) });
      sparks.forEach((sp, i) => {
        const k = seg(t, 1.05 + i * 0.03, 1.4 + i * 0.03);
        pose(sp, { x: BX + (i - 2.5) * 30 * k, y: BY - BH - k * 200 - (i % 2) * 30, s: 0.6 + (1 - k) * 0.6, r: t * 120 + i * 30, o: bump(t, 1.05 + i * 0.03, 1.45 + i * 0.03) });
      });
      const lit = es(t, 1.3, 1.6);
      pose(topGlow, { x: 800, y: 158, s: 0.4 + lit * 0.7, o: lit });
      pose(topRays, { x: 800, y: 158, s: 0.5 + lit * 0.5, r: t * 4, o: lit * 0.8 });
      sk.blend(PARCH, ['#e9d2a8', '#f4e0bb', '#f8ecd4'], lit);

      S.cam.z = 1.04 - es(t, 0.9, 1.4) * 0.06;
      S.cam.y = 20 - es(t, 0.9, 1.4) * 40;
    };
  },
};
