// Łk 3,37–38 — the last stretch of the road runs through a garden at first light: Methuselah, oldest of all, with
// his hourglass; Enoch, who walked with God, in a halo of gold; Jared, Mahalaleel, Cainan. The last garland does
// not pass by: it comes to rest at the end of the road — Enos, Seth, Adam with the tree of the garden — and its
// last link is no face at all but light. At the horizon a great light rises: Adam, the son of God.
import { C, hanging, swing, sheet, shade, mix } from '../kit.js';
import { olive, cypress, flowers, palm } from '../../assets/nature.js';
import { eraSet, lineRoad, gen, ICON3, rays, VP, tr, es, ease, pose, lerp } from './lib.js';

export default {
  id: 'lk3-adam',
  beats: [
    { v: 37 },
    { v: 38 },
  ],
  cam: { x: [-10, 10], y: [-20, 30], z: [1, 1.05] },
  build(S) {
    const c = S.c;
    const E = eraSet(S, {
      behind: (SS) => SS.layer({ par: 0.05, sh: 1, flat: true, rise: 0 }).add(`<g><circle r="420" fill="url(#halo-glow)"/>${rays(c, { n: 26, r0: 50, r1: 950, spread: 0.04, color: '#fff3cf' })}<circle r="80" fill="#fff6dc"/><circle r="60" fill="#fffaf0"/></g>`),
      skyCols: ['#e6cfb0', '#f6dcb0', '#fbead0'], far: mix(C.hillFar, C.sage, 0.35), mid: mix(C.sage, C.hillNear, 0.5), ground: mix(C.hillNear, C.sage2, 0.4), road: mix(C.sand, C.cream, 0.5), grassCol: C.moss2 });
    // the garden along the road
    E.midL.add(olive(c, 330, VP[1], 0.7) + cypress(c, 420, VP[1] + 2, 90) + palm(c, 1150, VP[1], 110) + olive(c, 1260, VP[1] + 4, 0.6) + cypress(c, 560, VP[1], 60));
    E.R.add(flowers(c, { x0: -600, x1: 2200, y: VP[1] + 60, n: 30 }) + flowers(c, { x0: -600, x1: 2200, y: VP[1] + 150, n: 24, h: 30 }) + olive(c, 180, 760, 1.2) + olive(c, 1440, 770, 1.1));

    const light = E.behind;               // the light at the end of the road, behind the hills

    const R = (pl, en, o) => gen(c, tr(pl, en), o);
    const L = lineRoad(S, [
      { people: [
        R('Matusala', 'Methuselah', { o: { robe: C.linen2, mantle: C.plumRobe, hair: '#ece6da', hairStyle: 'wrap', veil: C.linen, beard: 'wild', beardColor: '#f2ede2', skin: C.skin2 }, icon: ICON3.hourglass, rim: 'patriarch' }),
        R('Henoch', 'Enoch', { o: { robe: C.linen, mantle: C.wheatRobe, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin }, rim: 'holy', icon: ICON3.up }),
        R('Jaret', 'Jared', { rim: 'patriarch' }), R('Maleleel', 'Mahalaleel', { rim: 'patriarch' }), R('Kainam', 'Cainan', { rim: 'patriarch' }),
      ] },
      { people: [
        R('Enos', 'Enos', { rim: 'field', r: 48 }),
        R('Set', 'Seth', { rim: 'field', r: 48 }),
        R('Adam', 'Adam', { o: { robe: mix(C.wood3, C.sand2, 0.4), fur: true, hair: C.hair2, hairStyle: 'long', beard: 'full', skin: C.skin2 }, r: 58, rim: 'holy', back: mix(C.leaf, C.cream, 0.55), icon: ICON3.tree, size: 23 }),
        { name: '', light: true, r: 46 },
      ], opts: { gold: true } },
    ], [0, 1], {
      extra: 0,
      // the last garland comes to rest at the end of the road, low, where the closing card leaves it visible
      tweak: (i, t) => (i === 1 ? { dy: es(t, 1.35, 1.75) * 250, s: 1 - es(t, 1.35, 1.75) * 0.22 } : null),
    });

    return (t, time) => {
      L.update(t);
      const rise = es(t, 1.3, 1.8, ease.out);
      pose(light, { x: VP[0], y: lerp(VP[1] + 160, VP[1] - 70, rise), s: 0.5 + rise * 0.6, r: t * 3, o: 0.2 + rise * 0.8 });
      S.cam.z = 1.02 + Math.min(1, t / 2) * 0.02;
      S.cam.y = 15 - es(t, 1.3, 1.8) * 30;
    };
  },
};
