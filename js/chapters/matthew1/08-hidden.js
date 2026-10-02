// Mt 1,13–15 — the hidden generations: after Zerubbabel no more crowns, only plain wooden rims and the signs of
// ordinary lives — a lamp, a plough, a jar, a net, a loaf, a spindle, a flock, a scroll. The vine climbs on through
// quiet centuries over the villages of the land, and the camera climbs with it.
import { C, pose, lerp, mix } from '../kit.js';
import { fieldSet } from '../john1/lib.js';
import { RIM, ICON, medal, lineage, phoneFit, elder, kf, tr, es, ease } from './lib.js';

const ROWS = [
  [['abiud', 'Abiud', 'Abiud', 690, 548, 'lamp'], ['eliakim', 'Eliakim', 'Eliakim', 890, 470, 'plough'], ['azor', 'Azor', 'Azor', 1076, 392, 'jar']],
  [['zadok', 'Sadok', 'Zadok', 920, 280, 'net'], ['achim', 'Achim', 'Achim', 730, 236, 'loaf'], ['eliud', 'Eliud', 'Eliud', 540, 190, 'grapes']],
  [['eleazar', 'Eleazar', 'Eleazar', 700, 60, 'spindle'], ['matthan', 'Mattan', 'Matthan', 890, 10, 'crook'], ['jacob', 'Jakub', 'Jacob', 1076, -50, 'scroll']],
];

export default {
  id: 'mt1-hidden',
  beats: [
    { v: 13 },
    { v: 14 },
    { v: 15 },
  ],
  cam: { x: [-20, 20], y: [-420, 20], z: [1, 1] },
  build(S) {
    const c = S.c;
    const set = fieldSet(S, { sunAt: [300, 160] });

    const vineL = S.layer({ par: 0.9, sh: 3 });
    const medL = S.layer({ par: 0.9, sh: 6 });
    const H = RIM.humble;
    const nodes = [{ key: 'zerubbabel', x: 500, y: 620, r: 44, at: -1, markup: medal(S, elder(c, { robe: C.wheatRobe, mantle: C.sageRobe }), { r: 44, ...RIM.patriarch, name: tr('Zorobabel', 'Zerubbabel'), icon: ICON.stones(c) }) }];
    let prev = 'zerubbabel';
    ROWS.forEach((row, b) => row.forEach(([key, pl, en, x, y, icon], i) => {
      nodes.push({ key, parent: prev, x, y, r: 40, at: b + 0.3 + i * 0.15, grow: 0.2,
        markup: medal(S, elder(c, { mantle: null }), { r: 40, ...H, flip: x > 800, name: tr(pl, en), icon: ICON[icon](c) }) });
      prev = key;
    }));
    phoneFit(S, nodes, { cx: 790, k: 0.8 });   // phone: the outermost medallions come in from the edges
    const line = lineage(S, vineL, medL, nodes);

    return (t, time) => {
      // the sun crosses the sky as the generations pass
      const day = es(t, 0, 3);
      // phone: the sun stops short of the progress thread and stays clear of the topmost medallions
      const PH = S.portrait;
      set.update(t, time, { sunX: lerp(760, PH ? 1000 : 1300, day), sunY: 160 + Math.sin(day * Math.PI) * -40 + 40 - (PH ? day * 70 : 0) });
      line.update(t);
      S.cam.y = kf(t, [[0.85, 0], [1.3, -150], [1.85, -150], [2.3, -390]]);
    };
  },
};
