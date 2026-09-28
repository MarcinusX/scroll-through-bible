// Mt 1,7–10 — the kings of Judah: from Solomon the vine climbs past crowned medallion after crowned medallion,
// three to a sentence, and the camera climbs with it above the Temple and the palace. The day wears on to evening
// as the royal line goes on — Hezekiah with the sundial whose shadow turned back, Josiah with the found book of the Law.
import { C, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { sun, cloud, stars } from '../../assets/nature.js';
import {
  GOLDEN, DUSK, RIM, ICON, medal, lineage, elder, sanctuary, kf,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const ROWS = [
  // [key, pl, en, x, y, icon?]
  [['rehoboam', 'Roboam', 'Rehoboam', 690, 548], ['abijah', 'Abiasz', 'Abijah', 890, 470], ['asa', 'Asa', 'Asa', 1076, 392]],
  [['jehoshaphat', 'Jozafat', 'Jehoshaphat', 910, 290], ['joram', 'Joram', 'Joram', 712, 236], ['uzziah', 'Ozjasz', 'Uzziah', 520, 180]],
  [['jotham', 'Joatam', 'Jotham', 700, 88], ['ahaz', 'Achaz', 'Ahaz', 890, 30], ['hezekiah', 'Ezechiasz', 'Hezekiah', 1076, -40, 'sundial']],
  [['manasseh', 'Manasses', 'Manasseh', 910, -150], ['amon', 'Amos', 'Amon', 716, -214], ['josiah', 'Jozjasz', 'Josiah', 530, -276, 'scroll']],
];

export default {
  id: 'mt1-kings',
  beats: [
    { v: 7 },
    { v: 8 },
    { v: 9 },
    { v: 10 },
  ],
  cam: { x: [-20, 20], y: [-640, 20], z: [1, 1] },
  build(S) {
    const c = S.c;
    const LATE = ['#6e6696', '#d69c86', '#efc198'];
    const sk = sky(S, GOLDEN);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -1000, x1: 2600, y0: -1200, y1: 300, n: 120 }));
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1190, y: 180, len: 900 });
    const cls = [[430, 250, 170], [1010, 120, 130]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w, '#f8e6c8', '#ecd2ae'), { x, y, len: 900 }) }));

    /* ---------- far below: the Temple and the palace on the hill ---------- */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(sheet().p(c.ridge(c.wave(590, [16, 7, 3], [900, 320, 120]), -1200, 2800, 1900, 12, 1), mix(C.hillFar, C.duskViolet, 0.3)).out());
    const city = S.layer({ par: 0.12, sh: 3 });
    const hs = sheet();
    hs.p(c.cut([[-1200, 1900], [-1200, 670], [-200, 640], [300, 610], [560, 596], [1000, 596], [1300, 610], [1800, 640], [2800, 670], [2800, 1900]], 1.2, 12), mix(C.sand2, C.dune, 0.4));
    // the palace: a long colonnade
    hs.p(c.cut(c.rect(260, 520, 300, 80), 0.4, 6), mix(C.plaster, C.cream, 0.4));
    hs.p(c.cut(c.rect(250, 508, 320, 14), 0.3, 6), C.sun);
    let cols = '';
    for (let i = 0; i < 9; i++) cols += c.cut(c.rect(274 + i * 33, 530, 10, 66), 0.2, 4);
    hs.x(cols, shade(C.plaster, -0.12));
    city.add(hs.out() + `<g transform="translate(900 604)">${sanctuary(c, 0.9, { glow: false })}</g>`);

    /* ---------- the royal line ---------- */
    const vineL = S.layer({ par: 0.9, sh: 3 });
    const medL = S.layer({ par: 0.9, sh: 6 });
    const K = RIM.king;
    const nodes = [{ key: 'solomon', x: 500, y: 630, r: 48, at: -1, markup: medal(S, elder(c, { robe: C.linen, mantle: C.plumRobe, hairStyle: 'short', hair: C.hair3, beard: 'short', skin: C.skin }), { r: 48, ...K, king: true, name: tr('Salomon', 'Solomon'), icon: ICON.temple(c) }) }];
    let prev = 'solomon';
    ROWS.forEach((row, b) => row.forEach(([key, pl, en, x, y, icon], i) => {
      nodes.push({ key, parent: prev, x, y, r: 40, at: b + 0.3 + i * 0.15, grow: 0.2,
        markup: medal(S, elder(c, { robe: c.pick([C.linen, C.plumRobe, C.dustyBlue, C.roseRobe, C.tealRobe]), mantle: c.pick([C.plumRobe, C.terracotta, C.ochre, C.clayMantle, null]) }), { r: 40, ...K, king: true, flip: x > 800, name: tr(pl, en), icon: icon ? ICON[icon](c) : '' }) });
      prev = key;
    }));
    const line = lineage(S, vineL, medL, nodes);

    return (t, time) => {
      line.update(t);
      // the long day of the kingdom wears on towards evening
      const late = es(t, 0.5, 3.8);
      sk.blend(GOLDEN, LATE, late);
      starL.fade(es(t, 3.0, 3.9) * 0.8);
      pose(sunEl, { x: 1190, y: lerp(180, 420, late), r: Math.sin(time * 0.6) });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(time * 0.1 + cl.i) * 20, y: cl.y, r: Math.sin(time * 0.6 + cl.i) * 1.2 }));

      S.cam.y = kf(t, [[0.85, 0], [1.3, -150], [1.85, -150], [2.3, -370], [2.85, -370], [3.3, -610]]);
    };
  },
};
