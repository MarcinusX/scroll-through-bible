// Łk 24,27–28 — They walk on in the golden late afternoon, and over the road a long scroll unrolls between its
// rollers: beginning with Moses and all the prophets He opens to them what the Scriptures say about Himself — Moses
// with the tablets, the bronze serpent lifted up, the Passover lamb, Isaiah's servant, Jonah and the great fish,
// David's harp of the Psalms — each picture lighting up in its window, and a warm little heart kindles in each of the
// two. They come near the village; the scroll rolls up. The two stop at the door of the first house, but the Stranger
// walks on past it, as though He would go farther.
import { C, blinkAt, pose, lerp, mix, shade, sheet, person } from './lib.js';
import { fish } from '../../assets/things.js';
import { es, ease, bump, seg, fade } from './lib.js';
import {
  GOLDEN, SUNSET, emmausSet, RD, TRIO, roadTrio, headAt, isaiahScroll, still, L9, lawTablets, serpentPole, lamb, harp, scrollOpen,
  heart, sparkle, bodyAt, kf, tr,
} from './lib.js';

const GY = RD.GY;
const XS = {
  fr: [[0, 560], [1.0, 700], [1.75, 1010]],
  st: [[0, 680], [1.0, 820], [1.7, 1100], [2.0, 1330]],
  cl: [[0, 800], [1.0, 940], [1.72, 1170]],
};
const ISAIAH = { robe: C.linen2, mantle: C.plumRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, veil2: C.plumRobe, beard: 'full', beardColor: C.greyHair, skin: C.skin2 };
const JONAH = { robe: C.skyVeil, mantle: C.ochreRobe, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin2 };

export default {
  id: 'lk24-moses',
  beats: [
    { v: 27 },
    { v: 28 },
  ],
  cam: { x: [-400, 720], y: [-20, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: GOLDEN, sky2: SUNSET, sunAt: [1250, 270], house: true, tone: 0.15 });
    const R = roadTrio(S, E.act, E.fx);
    const hearts = [0, 1].map(() => E.fx.add(`<g><circle r="22" fill="url(#warm-glow)" opacity=".6"/>${heart(c, 11)}</g>`));

    /* the scroll of Moses and the Prophets */
    const L = E.FL;
    const sc = isaiahScroll(c, { w: 660, h: 230, cols: 6, title: tr('Mojżesz i Prorocy', 'Moses and the Prophets') });
    const parch = L.add(`<g>${sc.sheet}</g>`);
    const rollL = L.add(`<g>${sc.rollerL}</g>`);
    const rollR = L.add(`<g>${sc.rollerR}</g>`);
    const win = sheet().p(c.cut(c.rect(-46, -76, 92, 152), 0.5, 6), mix(C.parchment, C.halo, 0.25)).x(c.ribbon([[-46, -76], [46, -76], [46, 76], [-46, 76], [-46, -74]], 1.6), C.terracotta, 'opacity=".45"').out();
    const pics = [
      still(c, [{ x: -8, y: 66, s: 0.56, o: L9.moses, armF: 70, armB: 20, head: -4 }]) + `<g transform="translate(20 -2) scale(.42)">${lawTablets(c)}</g>`,
      `<g transform="translate(0 70) scale(.44)">${serpentPole(c, 280)}</g>`,
      `<g transform="translate(-6 30) scale(1.1)">${lamb(c)}</g><path d="${c.cut([[-30, 40], [34, 40], [30, 50], [-26, 50]], 0.4, 4)}" fill="${C.sage}"/>`,
      still(c, [{ x: 0, y: 68, s: 0.54, o: ISAIAH, armF: 70, armB: 130, head: -8 }]) + `<g transform="translate(18 -4) rotate(-20) scale(.34)">${scrollOpen(c, 80, 56)}</g>`,
      `<path d="${c.cut([[-46, 20], [46, 16], [46, 76], [-46, 76]], 0.4, 5)}" fill="${C.lake2}"/><g transform="translate(-4 34) scale(2.2)">${fish(c, { color: C.lake3 })}</g>` + still(c, [{ x: 12, y: 18, s: 0.3, o: JONAH, armF: 120, armB: 140, head: -10 }]),
      `<g transform="translate(0 40) scale(1.05)">${harp(c)}</g>`,
    ].map((inner, k) => ({ k, w: L.add(`<g>${win}</g>`), p: L.add(`<g>${inner}</g>`), sp: L.add(`<g>${sparkle(c, 10)}</g>`) }));

    return (t, T) => {
      E.update(T, { sunY: 270 + es(t, 0, 2) * 60 });
      E.sk2.fade(es(t, 0.8, 2.0) * 0.8);
      const fx = kf(t, XS.fr, ease.sine), sx = kf(t, XS.st, ease.sine), cx = kf(t, XS.cl, ease.sine);
      const camx = Math.min(720, ((fx + sx) / 2 - 800) * 1.8);
      S.cam.x = camx;
      const walkF = t > 0 && t < 1.75, walkS = t > 0 && t < 2.0, walkC = t > 0 && t < 1.72;
      /* v27: He opens the Scriptures to them as they walk */
      const show = es(t, 0.05, 0.25) * (1 - es(t, 0.95, 1.1));
      const listen = es(t, 0.1, 0.3) * (1 - es(t, 1.0, 1.1));
      const past = es(t, 1.7, 1.95);
      R.fr.p.set({ x: fx, y: GY - 2, s: TRIO.S, walk: walkF ? fx * 0.05 : undefined, amt: 0.8, armF: 20 + es(t, 1.8, 2.0) * 50, armB: 10, head: -listen * 14, blink: blinkAt(T, 1) });
      R.cl.p.set({ x: cx, y: GY + 4, s: TRIO.S, walk: walkC ? cx * 0.05 + 2 : undefined, amt: 0.8, armF: 22 + past * 40, armB: 12, head: -listen * 14, blink: blinkAt(T, 4) });
      fade(R.fr.sad, 0.5 - listen * 0.5);
      fade(R.cl.sad, 0.5 - listen * 0.5);
      R.stSet({ x: sx, y: GY + 2, s: TRIO.S + 0.02, walk: walkS ? sx * 0.05 + 1 : undefined, amt: 0.8, armF: 34, armB: 10 + show * 120 + past * 30, head: -show * 8, blink: blinkAt(T, 6) });
      R.halo(0.3);
      [[fx, false, GY - 2], [cx, false, GY + 4]].forEach(([x, fl, y], i) => {
        const hk = es(t, 0.7 + i * 0.08, 0.9 + i * 0.08, ease.back);
        const [bx, by] = bodyAt(x, y, TRIO.S, fl, 6, -104);
        pose(hearts[i], { x: bx, y: by, s: hk * (1 + (T ? Math.sin(T * 3 + i) * 0.06 : 0)), o: hk > 0.01 ? 1 : 0 });
      });

      /* the scroll, following the walkers (it hangs in the flies, its own parallax) */
      // phone: the open scroll is wider than the screen, so it hangs a little smaller and centred
      const K = S.portrait ? 0.86 : 1;
      const SX = (S.portrait ? 800 : 830) + 0.3 * camx, SY = 292;
      const down = es(t, 0.02, 0.2, ease.out) * (1 - es(t, 1.2, 1.45, ease.in));
      const open = es(t, 0.12, 0.4) * (1 - es(t, 1.02, 1.2));
      const yy = lerp(-600, SY, down) + (T ? Math.sin(T * 0.8) * 2 : 0);
      const vis = down > 0.01 ? 1 : 0;
      pose(parch, { x: SX, y: yy, s: K, sx: 0.02 + open * 0.98, o: vis && open > 0.01 ? 1 : 0 });
      pose(rollL, { x: SX - (8 + open * sc.w / 2) * K, y: yy, s: K, o: vis });
      pose(rollR, { x: SX + (8 + open * sc.w / 2) * K, y: yy, s: K, o: vis });
      pics.forEach((p) => {
        const a = 0.22 + p.k * 0.1;
        const inK = es(t, a, a + 0.12, ease.out) * (open > 0.97 ? 1 : 0);
        const x = SX + sc.colX(p.k) * K, y = yy + sc.winY * K;
        pose(p.w, { x, y, s: K, o: inK });
        pose(p.p, { x, y, s: (0.8 + inK * 0.2) * K, o: inK });
        const b = bump(t, a + 0.05, a + 0.3);
        pose(p.sp, { x: x + 30 * K, y: y - 60 * K, s: b, r: T * 30, o: b * (open > 0.97 ? 1 : 0) });
      });

      S.cam.y = 18;
      S.cam.z = S.portrait ? 0.98 : 1.04;
      void seg; void shade; void person;
    };
  },
};
