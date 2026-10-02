// Mt 1,2 — Abraham under the stars of the promise ("count the stars… so shall your offspring be"):
// he stands by his tent and lifts his hand to the sky; a vine springs up at his feet. A star flares and
// comes down as Isaac, another as Jacob; then twelve at once — Judah with his lion, and his brothers.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import {
  STARRY, RIM, ICON, ABRAHAM, medal, lineage, vineLink, elder, tentMamre, tint, glowDisc, sparkle, glowStar,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const AY = 716;                    // Abraham (x: AX below)
const JX = 800, JY = 250;          // Judah, among his brothers

export default {
  id: 'mt1-abraham',
  beats: [
    { v: 2, text: 'Abraham był ojcem Izaaka;' },
    { v: 2, cont: true, text: 'Izaak ojcem Jakuba;' },
    { v: 2, cont: true, text: 'Jakub ojcem Judy i jego braci;' },
  ],
  cam: { x: [-20, 20], y: [-60, 20], z: [0.94, 1.06] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;             // phone: Abraham, Isaac, Jacob and the brothers come in from the edges
    const AX = PH ? 580 : 512;
    const NC = STARRY[1];
    const sk = sky(S, STARRY);
    S.layer({ par: 0.02, sh: 1, flat: true }).add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 560, n: 110 }));
    // more and more stars as he counts them
    const more = S.layer({ par: 0.02, sh: 1, flat: true });
    more.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 540, n: 520 }) + stars(c, { x0: 300, x1: 1300, y0: -200, y1: 480, n: 140 }));
    const moreL = more;

    /* ---------- the desert at night ---------- */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(sheet().p(c.ridge(c.wave(590, [16, 7, 3], [900, 320, 120]), -1100, 2700, 1900, 12, 1), tint(mix(C.dune, C.duskViolet, 0.4), NC, 0.62)).out());
    const near = S.layer({ par: 0.2, sh: 3 });
    const nfn = c.wave(700, [8, 3], [700, 200]);
    near.add(`<g transform="translate(330 ${nfn(330) + 6})">${tint(tentMamre(c, 250, 170), NC, 0.45)}</g>`);
    near.add(sheet().p(c.ridge(nfn, -1100, 2700, 1900, 12, 1), tint(C.sand2, NC, 0.5)).out());
    const lampL = near.add(`<g>${glowDisc(90, 'warm-glow', 0.8)}</g>`);

    /* ---------- Abraham ---------- */
    const act = S.layer({ par: 0.2, sh: 5 });
    const ab = S.puppet(act.add(person(c, { ...ABRAHAM, holdB: `<g transform="translate(0 -40) rotate(-14)"><path d="${c.ribbon([[0, -70], [2, 150]], 5)}" fill="${C.wood2}"/></g>` })));

    /* ---------- the vine and the medallions ---------- */
    const vineL = S.layer({ par: 0.2, sh: 3 });
    const medL = S.layer({ par: 0.2, sh: 6 });
    const P = RIM.patriarch;
    const judahO = elder(c, { robe: C.clayMantle, mantle: C.ochre, hairStyle: 'curly', hair: C.hair3, beard: 'full', skin: C.skin3 });
    const nodes = [
      { key: 'isaac', root: [PH ? 690 : 630, 712], x: PH ? 790 : 742, y: 494, r: 52, at: 0.5, vine: { w: 11 },
        markup: medal(S, { robe: C.wheatRobe, mantle: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2 }, { r: 52, ...P, name: tr('Izaak', 'Isaac'), icon: ICON.ram(c) }) },
      { key: 'jacob', parent: 'isaac', x: PH ? 975 : 1062, y: 438, r: 52, at: 1.5,
        markup: medal(S, { robe: C.tealRobe, mantle: C.clayMantle, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin2, belt: C.leather }, { r: 52, ...P, name: tr('Jakub', 'Jacob'), flip: true, icon: ICON.ladder(c) }) },
      { key: 'judah', parent: 'jacob', x: JX, y: JY, r: 46, at: 2.4,
        markup: medal(S, judahO, { r: 46, ...P, name: tr('Juda', 'Judah'), icon: ICON.lion(c), size: 21 }) },
    ];
    const line = lineage(S, vineL, medL, nodes);
    // the brothers on one bough to each side of Judah
    const bough = [-1, 1].map((d) => ({ d, el: vineL.add(`<g>${vineLink(c, 360, { w: 6, bend: 0.05, n: 5 })}</g>`) }));
    const BR = [];
    for (let i = 0; i < 11; i++) {
      const d = i < 6 ? -1 : 1, j = i < 6 ? i : i - 6;
      const x = JX + d * (PH ? 64 + j * 43 : 78 + j * 54), y = JY + 20 + Math.pow((x - JX) / (PH ? 280 : 330), 2) * 62;
      const o = elder(c);
      BR.push({ x, y, d, j, el: medL.add(medal(S, o, { r: PH ? 21 : 24, ...P, flip: d > 0 })) });
    }

    /* ---------- the stars that come down as sons ---------- */
    const fx = S.layer({ par: 0.2, sh: 1, flat: true });
    const flares = [...nodes.map((n) => [n.x, n.y, n.at]), ...BR.map((b, i) => [b.x, b.y, 2.46 + b.j * 0.035])].map(([x, y, at], i) => ({
      x, y, at, i, el: fx.add(`<g>${glowStar(c, i < 3 ? 22 : 12)}</g>`),
    }));

    return (t, time) => {
      /* v2a: Abraham counts the stars of the promise; the vine springs up at his feet */
      const count = es(t, 0.02, 0.3);
      moreL.fade(es(t, 0.05, 0.45));
      const pointAt = Math.sin(Math.max(0, t - 0.1) * 5) * 8 * bump(t, 0.1, 0.9);
      ab.set({ x: AX, y: AY, s: 1.02, armF: 20 + count * 104 + pointAt, armB: 14, head: -count * 26 + bump(t, 1.2, 2.0) * 10, blink: blinkAt(time, 1) });
      pose(lampL, { x: 350, y: 630, s: 1, o: 0.7 });

      line.update(t);
      // each son is first a star that flares above, then falls to his place on the vine
      flares.forEach((f) => {
        const k = seg(t, f.at - 0.35, f.at + 0.02);
        const y = lerp(f.y - 220, f.y, ease.io(k));
        pose(f.el, { x: f.x + Math.sin(k * PI) * 30, y, s: 0.7 + bump(t, f.at - 0.35, f.at + 0.1) * 0.6, r: t * 60, o: bump(t, f.at - 0.35, f.at + 0.08) });
      });

      /* v2c: Judah and his brothers, twelve at once */
      bough.forEach((b) => {
        const k = es(t, 2.35, 2.62, ease.out);
        pose(b.el, { x: JX + b.d * 40, y: JY + 26, r: b.d < 0 ? 180 - 7 : 7, sx: Math.max(0.001, k) * (PH ? 0.8 : 1), sy: b.d < 0 ? -1 : 1, o: k > 0.002 ? 1 : 0 });
      });
      BR.forEach((b) => {
        const k = es(t, 2.44 + b.j * 0.035, 2.62 + b.j * 0.035, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: Math.max(0.001, k), o: k > 0.002 ? 1 : 0 });
      });

      S.cam.z = 1.04 - es(t, 1.9, 2.4) * 0.08;
      S.cam.y = 10 - es(t, 0.9, 1.4) * 20 - es(t, 1.9, 2.4) * 30;
      S.cam.x = es(t, 0.9, 1.4) * 10 - es(t, 1.9, 2.4) * 10;
    };
  },
};
