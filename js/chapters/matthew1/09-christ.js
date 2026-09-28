// Mt 1,16 — the top of the tree, over Nazareth at night. Jacob's son Joseph blooms (the carpenter's square), and on a
// rose ribbon beside him Mary, his wife. Then from Mary the last shoot rises, gold, and opens into the great medallion
// of light: Jesus, who is called Christ. The light runs back down the whole vine.
import { C, CAST, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import {
  NIGHT, RIM, ICON, JOSEPH, MARY, medal, lineage, elder, glowDisc, rayBurst, radiance, sparkle, glowStar, tint,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { town } from '../../assets/nature.js';

const JX = 800, JY = 222, JR = 74;

export default {
  id: 'mt1-christ',
  beats: [
    { v: 16, text: 'Jakub ojcem Józefa, męża Maryi,' },
    { v: 16, cont: true, text: 'z której narodził się Jezus, zwany Chrystusem.' },
  ],
  cam: { x: [-20, 20], y: [-40, 20], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const NC = NIGHT[1];
    const sk = sky(S, NIGHT);
    S.layer({ par: 0.02, sh: 1, flat: true }).add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 480, n: 170 }));
    const glowL = S.layer({ par: 0.04, sh: 1, flat: true });
    const bigGlow = glowL.add(`<g>${glowDisc(520, 'halo-glow', 1)}${rayBurst(c, { n: 30, r0: 90, r1: 900, spread: 0.026, color: '#fff3cf', o: 0.45 })}</g>`);

    /* ---------- Nazareth asleep on its hill ---------- */
    const far = S.layer({ par: 0.07, sh: 2 });
    far.add(sheet().p(c.ridge(c.wave(560, [16, 7, 3], [900, 320, 120]), -1200, 2800, 1900, 12, 1), tint(C.hillFar, NC, 0.55)).out());
    const hill = S.layer({ par: 0.14, sh: 3 });
    const hfn = (x) => 640 - Math.max(0, 1 - Math.abs(x - 800) / 700) * 60 + Math.sin(x * 0.01) * 4;
    hill.add(sheet().p(c.ridge(hfn, -1200, 2800, 1900, 12, 1), tint(C.hillMid, NC, 0.5)).out() + tint(town(c, { x: 800, y: 600, n: 11, spread: 700, sc: 0.62 }), NC, 0.45));
    const lamps = [470, 610, 760, 930, 1080].map((x, i) => ({ x, i, el: hill.add(`<g>${glowDisc(40, 'warm-glow', 1)}</g>`) }));

    /* ---------- the vine's crown ---------- */
    const vineL = S.layer({ par: 0.4, sh: 3 });
    const medL = S.layer({ par: 0.4, sh: 6 });
    const nodes = [
      { key: 'jacob', x: 486, y: 620, r: 40, at: -1, markup: medal(S, elder(c, { mantle: null }), { r: 40, ...RIM.humble, name: tr('Jakub', 'Jacob'), icon: ICON.scroll(c) }) },
      { key: 'joseph', parent: 'jacob', x: 600, y: 470, r: 56, at: 0.3, markup: medal(S, JOSEPH, { r: 56, ...RIM.humble, name: tr('Józef', 'Joseph'), icon: ICON.square(c), size: 23 }) },
      { key: 'mary', parent: 'joseph', mother: true, x: 1000, y: 470, r: 56, at: 0.52, markup: medal(S, MARY, { r: 56, ...RIM.mother, back: mix(C.skyVeil, C.cream, 0.4), flip: true, name: tr('Maryja', 'Mary'), icon: ICON.lily(c), size: 23 }) },
      { key: 'jesus', parent: 'mary', x: JX, y: JY, r: JR, at: 1.42, grow: 0.36, vine: { gold: true, w: 11 }, markup: medal(S, { ...CAST.jesus }, { r: JR, ...RIM.holy, name: tr('Jezus, zwany Chrystusem', 'Jesus, who is called Christ'), icon: ICON.star(c), size: 24 }) },
    ];
    const line = lineage(S, vineL, medL, nodes);
    const fx = S.layer({ par: 0.4, sh: 1, flat: true });
    const rad = fx.add(`<g>${glowDisc(JR * 2.4, 'halo-glow', 1)}</g>`);
    const budEl = fx.add(`<g>${glowStar(c, 18)}</g>`);
    // the light runs back down the vine to every medallion
    const rings = nodes.slice(0, 3).map((n, i) => ({ n, i, el: fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, n.r + 14, n.r + 14, 0, PI * 2, 40), 4)}" fill="#fff3cf"/></g>`) }));
    const sparks = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => fx.add(`<g>${sparkle(c, 10 + (i % 3) * 5)}</g>`));

    return (t, time) => {
      line.update(t);
      lamps.forEach((l) => pose(l.el, { x: l.x, y: hfn(l.x) - 10 - (l.i % 2) * 18, s: 1, o: 0.5 + es(t, 1.4, 1.7) * 0.5 }));
      /* v16b: the golden shoot rises from Mary — a bud — and opens into the medallion of Christ */
      const up = seg(t, 1.06, 1.42);
      pose(budEl, { x: lerp(1000, JX, up), y: lerp(420, JY, ease.io(up)), s: 0.7 + up * 0.6, r: t * 80, o: t > 1.04 && t < 1.5 ? 1 - es(t, 1.4, 1.5) : 0 });
      const lit = es(t, 1.4, 1.7);
      pose(rad, { x: JX, y: JY, s: 0.4 + lit * 0.7, o: lit });
      pose(bigGlow, { x: JX, y: JY, s: 0.5 + lit * 0.6, r: t * 3, o: lit * 0.85 });
      sk.blend(NIGHT, ['#2a3268', '#4a4f86', '#8a7fa6'], lit * 0.8);
      rings.forEach((r) => { const k = bump(t, 1.55 + r.i * 0.08, 1.85 + r.i * 0.08); pose(r.el, { x: r.n.x, y: r.n.y, s: 0.9 + k * 0.2, o: k * 0.8 }); });
      sparks.forEach((sp, i) => { const a = (i / 8) * PI * 2; const k = seg(t, 1.42, 1.9); pose(sp, { x: JX + Math.cos(a) * (JR + 20 + k * 90), y: JY + Math.sin(a) * (JR + 20 + k * 90), s: 1 - k * 0.5, r: t * 90, o: bump(t, 1.42, 1.95) }); });

      S.cam.z = 1.02 + es(t, 1.1, 1.6) * 0.03;
      S.cam.y = -es(t, 1.1, 1.6) * 30;
    };
  },
};
