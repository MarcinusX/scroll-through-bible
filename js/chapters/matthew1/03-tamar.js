// Mt 1,3–4 — from Judah the vine climbs on: the twins Perez and Zerah (a scarlet thread on Zerah's wrist),
// and on a rose ribbon beside them their mother Tamar, with Judah's staff and seal. Then Hezron and Ram, while
// the pyramids of Egypt rise on the far flat; then Amminadab, Nahshon with the banner of Judah, and Salmon,
// under the pillar of fire over the camp in the wilderness. The camera climbs with the vine.
import { C, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { palm, stars } from '../../assets/nature.js';
import {
  DUSK, RIM, ICON, medal, lineage, phoneFit, elder, mother, pyramid, fireColumn, tent, tint, glowDisc, kf,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

export default {
  id: 'mt1-tamar',
  beats: [
    { v: 3, text: 'Juda zaś był ojcem Faresa i Zary, których matką była Tamar.' },
    { v: 3, cont: true, text: 'Fares był ojcem Ezrona; Ezron ojcem Arama;' },
    { v: 4 },
  ],
  cam: { x: [-20, 20], y: [-160, 20], z: [1, 1] },
  build(S) {
    const c = S.c;
    const WILD = ['#3b3f6e', '#b78a8e', '#e7b58e'];
    const sk = sky(S, DUSK);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 380, n: 160 }));
    starL.fade(0);

    /* ---------- the flats: Canaan's hills, Egypt, the camp in the wilderness ---------- */
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(sheet().p(c.ridge(c.wave(560, [18, 8, 3], [900, 320, 120]), -1200, 2800, 1900, 12, 1), mix(C.hillFar, C.duskViolet, 0.35)).out());
    const egypt = S.layer({ par: 0.1, sh: 3, pad: 200 });
    egypt.add(`<g transform="translate(1180 600)">${pyramid(c, 300, 200, mix(C.dune, C.apricot, 0.2))}</g><g transform="translate(1390 606)">${pyramid(c, 200, 130, mix(C.dune, C.apricot, 0.3))}</g><g transform="translate(330 606)">${pyramid(c, 180, 118, mix(C.dune, C.apricot, 0.25))}</g>` + palm(c, 1000, 612, 170) + palm(c, 520, 616, 140) + palm(c, 1560, 610, 180));
    const camp = S.layer({ par: 0.14, sh: 3, pad: 200 });
    const fire = camp.add(`<g>${fireColumn(c, 460, 60)}</g>`);
    let tents = '';
    [[260, C.wheatRobe, 0.9], [420, C.clayMantle, 0.8], [640, C.stone, 0.75], [930, C.ochreRobe, 0.8], [1110, C.wheatRobe, 0.9], [1320, C.dustyBlue, 0.85]].forEach(([x, col, s]) => { tents += `<g transform="translate(${x} 640) scale(${s})">${tent(c, { col, w: 110, h: 90 })}</g>`; });
    camp.add(tint(tents, WILD[1], 0.25));
    const near = S.layer({ par: 0.2, sh: 3 });
    near.add(sheet().p(c.ridge(c.wave(648, [8, 3], [700, 200]), -1200, 2800, 1900, 12, 1), mix(C.sand2, C.dune, 0.3)).out());

    /* ---------- the vine ---------- */
    const vineL = S.layer({ par: 0.9, sh: 3 });
    const medL = S.layer({ par: 0.9, sh: 6 });
    const D = RIM.desert;
    const nodes = [
      { key: 'judah', x: 500, y: 600, r: 44, at: -1, markup: medal(S, elder(c, { robe: C.clayMantle, mantle: C.ochre, hairStyle: 'curly', hair: C.hair3, beard: 'full', skin: C.skin3 }), { r: 44, ...RIM.patriarch, name: tr('Juda', 'Judah'), icon: ICON.lion(c) }) },
      { key: 'perez', parent: 'judah', x: 660, y: 516, r: 44, at: 0.38, markup: medal(S, elder(c), { r: 44, ...D, name: tr('Fares', 'Perez') }) },
      { key: 'zerah', parent: 'judah', x: 836, y: 612, r: 36, at: 0.48, markup: medal(S, elder(c), { r: 36, ...D, name: tr('Zara', 'Zerah'), flip: true, icon: ICON.thread(c) }) },
      { key: 'tamar', parent: 'perez', mother: true, x: 500, y: 416, r: 40, at: 0.62, markup: medal(S, mother(c, { robe: C.roseRobe, veil: C.plumRobe, veil2: shade(C.plumRobe, -0.1) }), { r: 40, ...RIM.mother, name: tr('Tamar', 'Tamar'), icon: ICON.seal(c) }) },
      { key: 'hezron', parent: 'perez', x: 866, y: 440, r: 40, at: 1.36, markup: medal(S, elder(c), { r: 40, ...D, name: tr('Ezron', 'Hezron'), flip: true }) },
      { key: 'ram', parent: 'hezron', x: 1070, y: 356, r: 40, at: 1.56, markup: medal(S, elder(c), { r: 40, ...D, name: tr('Aram', 'Ram'), flip: true }) },
      { key: 'amminadab', parent: 'ram', x: 910, y: 250, r: 40, at: 2.3, markup: medal(S, elder(c), { r: 40, ...D, name: tr('Aminadab', 'Amminadab'), flip: true }) },
      { key: 'nahshon', parent: 'amminadab', x: 716, y: 196, r: 44, at: 2.45, markup: medal(S, elder(c, { robe: C.ochreRobe, mantle: C.terracotta }), { r: 44, ...D, name: tr('Naasson', 'Nahshon'), icon: ICON.banner(c) }) },
      { key: 'salmon', parent: 'nahshon', x: 520, y: 150, r: 40, at: 2.6, markup: medal(S, elder(c), { r: 40, ...D, name: tr('Salmon', 'Salmon') }) },
    ];
    phoneFit(S, nodes, { cx: 785, k: 0.78 });   // phone: the outermost medallions come in from the edges
    const line = lineage(S, vineL, medL, nodes);

    return (t, time) => {
      line.update(t);
      /* v3b: the family goes down into Egypt — the pyramids rise on the far flat */
      const eg = es(t, 1.0, 1.4, ease.out) * (1 - es(t, 2.0, 2.3));
      egypt.shift(0, (1 - eg) * 280);
      egypt.fade(eg > 0.001 ? 1 : 0);
      /* v4: out through the wilderness: evening, the camp, the pillar of fire */
      const wild = es(t, 2.0, 2.4);
      sk.blend(DUSK, WILD, wild);
      starL.fade(wild);
      camp.shift(0, (1 - es(t, 2.05, 2.4, ease.out)) * 300);
      camp.fade(wild > 0.001 ? 1 : 0);
      const flick = time ? 1 + Math.sin(time * 5.1) * 0.02 : 1;
      pose(fire, { x: 1240, y: 640, sx: flick, s: 1, o: 1 });

      S.cam.y = kf(t, [[0.9, 0], [1.4, -66], [2.1, -66], [2.5, -146]]);
    };
  },
};
