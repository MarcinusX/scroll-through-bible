// Łk 3,35–36 — back beyond Abraham, into a washed sky after the rain: a rainbow stands over the road, and far
// away on a mountain rests the ark. Serug, Reu, Peleg (in whose days the earth was divided), Eber and Shelah;
// then Cainan, Arphaxad, Shem, and Noah with his ark on his badge, and Lamech.
import { C, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { eraSet, lineRoad, gen, ICON3, VP, tr, es, pose, PI } from './lib.js';

function ark(c, w = 150) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -20], [w / 2, -20], [w / 2 - 20, 12], [-w / 2 + 20, 12]], 0.5, 6), C.wood2);
  s.p(c.cut(c.rect(-w * 0.3, -46, w * 0.6, 28), 0.4, 5), C.wood3);
  s.p(c.cut([[-w * 0.34, -46], [0, -66], [w * 0.34, -46]], 0.4, 5), C.roof);
  s.x(c.ribbon([[-w / 2 + 6, -8], [w / 2 - 6, -8]], 1.6), shade(C.wood2, -0.25), 'opacity=".7"');
  s.x(c.poly(c.rect(-8, -38, 16, 12)), C.soilDark);
  return s.out();
}

export default {
  id: 'lk3-flood',
  beats: [
    { v: 35 },
    { v: 36 },
  ],
  cam: { x: [-10, 10], y: [0, 30], z: [1, 1.05] },
  build(S) {
    const c = S.c;
    const E = eraSet(S, { skyCols: ['#b9d0d8', '#e3ecdf', '#f3eed8'], far: mix(C.duskViolet, C.skyVeil, 0.4), mid: mix(C.hillMid, C.sage, 0.4), ground: mix(C.sage2, C.hillNear, 0.5), road: mix(C.sand, C.cream, 0.45), grassCol: C.moss });
    // the rainbow (behind the hills), a few rain-washed clouds
    let rb = '';
    [C.terracotta, C.sun, C.sageRobe, C.dustyBlue, C.plumRobe].forEach((col, i) => { rb += `<path d="${c.ribbon(c.arc(800, VP[1] + 40, 520 - i * 22, 420 - i * 22, PI, 2 * PI, 40), 22)}" fill="${col}" opacity=".55"/>`; });
    E.back.add(`<g>${rb}</g>`);
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 190, '#f1f0e8', '#d9dcd4'), { x: 440, y: 150, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150, '#f1f0e8', '#d9dcd4'), { x: 1180, y: 200, len: 700 });
    // Ararat and the ark on it
    const ms = sheet();
    ms.p(c.cut([[1000, VP[1]], [1110, 470], [1170, 430], [1230, 470], [1340, VP[1]]], 1, 8), mix(C.duskViolet, C.rock2, 0.4));
    ms.p(c.cut([[1150, 440], [1170, 430], [1192, 442], [1178, 450]], 0.4, 4), C.cream);
    E.midL.add(ms.out() + `<g transform="translate(1172 432) scale(.45)">${ark(c)}</g>`);

    const R = (pl, en, o) => gen(c, tr(pl, en), o);
    const L = lineRoad(S, [
      { people: [R('Seruch', 'Serug', { rim: 'desert' }), R('Ragau', 'Reu', { rim: 'desert' }), R('Falek', 'Peleg', { rim: 'desert', icon: ICON3.split }), R('Eber', 'Eber', { rim: 'desert' }), R('Sala', 'Shelah', { rim: 'desert' })] },
      { people: [
        R('Kainam', 'Cainan', { rim: 'patriarch' }), R('Arfaksad', 'Arphaxad', { rim: 'patriarch' }),
        R('Sem', 'Shem', { o: { robe: C.dustyBlue, mantle: C.wheatRobe, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3 }, rim: 'patriarch' }),
        R('Noe', 'Noah', { o: { robe: C.sageRobe, mantle: C.linen2, hair: '#ece6da', hairStyle: 'wrap', veil: C.linen, beard: 'wild', beardColor: '#ece6da', skin: C.skin2 }, r: 58, rim: 'patriarch', back: mix(C.skyVeil, C.cream, 0.3), icon: ICON3.ark, size: 22 }),
        R('Lamech', 'Lamech', { rim: 'patriarch' }),
      ] },
    ], [0, 1], { extra: 2 });

    return (t, time) => {
      swing(cl1, 440 + Math.sin(time * 0.1) * 20, 150, time, 1.2, 0.6, 1);
      swing(cl2, 1180 + Math.sin(time * 0.1 + 2) * 20, 200, time, 1.2, 0.6, 2);
      L.update(t);
      S.cam.z = 1.02 + Math.min(1, t / 2) * 0.02;
      S.cam.y = 15;
    };
  },
};
