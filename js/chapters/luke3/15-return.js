// Łk 3,24–27 — further back along the road: the quiet generations after the exile. On the horizon Jerusalem
// stands rebuilt, its walls and its Second Temple. One garland comes near with each verse, five names on each;
// the last brings Zerubbabel, who rebuilt the Temple (the Temple on his badge), and Shealtiel, born in exile
// (a chain), and beyond them, far down the road, the line goes on.
import { C, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud, palm } from '../../assets/nature.js';
import { eraSet, lineRoad, gen, ICON3, circlet, VP, tr, es, pose } from './lib.js';

/** Jerusalem rebuilt on the horizon: walls, towers, the Temple (origin: ground centre) */
function jerusalem(c, w = 420) {
  const s = sheet();
  const wall = mix(C.stone, C.sand2, 0.35);
  const pts = [[-w / 2, 0], [-w / 2, -34]];
  for (let x = -w / 2; x < w / 2; x += 16) pts.push([x, -34], [x, -42], [x + 8, -42], [x + 8, -34]);
  pts.push([w / 2, -34], [w / 2, 0]);
  s.p(c.cut(pts, 0.4, 6), wall);
  let tw = '';
  [-w / 2 + 20, -40, w / 2 - 30].forEach((x) => { tw += c.cut(c.rect(x - 16, -70, 32, 72), 0.4, 5); });
  s.p(tw, shade(wall, -0.08));
  s.p(c.cut(c.rect(40, -66, 90, 34), 0.4, 5), mix(C.cream, C.linen, 0.5));
  s.p(c.cut(c.rect(62, -104, 46, 40), 0.4, 5), C.cream);
  s.x(c.ribbon([[38, -66], [132, -66]], 3) + c.ribbon([[60, -104], [110, -104]], 3), C.sun);
  let rf = '';
  for (let i = 0; i < 9; i++) { const x = -w / 2 + 40 + i * 40 + c.rr(-8, 8); if (x > 20 && x < 140) continue; rf += c.cut(c.rect(x, -34 - c.rr(12, 26), c.rr(24, 34), 30), 0.3, 4); }
  s.p(rf, C.plaster);
  return s.out();
}

export default {
  id: 'lk3-return',
  beats: [
    { v: 24 },
    { v: 25 },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-10, 10], y: [0, 30], z: [1, 1.05] },
  build(S) {
    const c = S.c;
    const E = eraSet(S, { skyCols: ['#cdd6d0', '#f0dcb6', '#f7e3c0'], far: mix(C.duskViolet, C.dune, 0.45), mid: mix(C.dune, C.sand2, 0.45), ground: mix(C.sand2, C.sage2, 0.35), road: mix(C.sand, C.cream, 0.45), grassCol: C.olive });
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 200, len: 700 });
    const cl = hanging(hangL, cloud(c, 150), { x: 520, y: 170, len: 700 });
    E.midL.add(`<g transform="translate(470 ${VP[1] - 6}) scale(.8)">${jerusalem(c)}</g>` + palm(c, 1120, VP[1] - 4, 120) + palm(c, 1190, VP[1] - 2, 90));

    const R = (pl, en, o) => gen(c, tr(pl, en), o);
    const L = lineRoad(S, [
      { people: [R('Mattat', 'Matthat'), R('Lewi', 'Levi'), R('Melchi', 'Melchi'), R('Jannaj', 'Jannai'), R('Józef', 'Joseph')] },
      { people: [R('Matatiasz', 'Mattathias'), R('Amos', 'Amos'), R('Nahum', 'Nahum'), R('Chesli', 'Esli'), R('Naggaj', 'Naggai')] },
      { people: [R('Maat', 'Maath'), R('Matatiasz', 'Mattathias'), R('Semei', 'Semein'), R('Josech', 'Joseph'), R('Joda', 'Judah')] },
      { people: [
        R('Jan', 'Joanan'), R('Resa', 'Rhesa'),
        R('Zorobabel', 'Zerubbabel', { o: { robe: C.linen2, mantle: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun }, r: 56, rim: 'king', icon: ICON3.temple, head: (cc) => circlet(cc) }),
        R('Salatiel', 'Shealtiel', { rim: 'exile', icon: ICON3.chain }),
        R('Neri', 'Neri'),
      ] },
    ], [0, 1, 2, 3], { extra: 2, gopts: S.portrait ? { x0: 370, x1: 1190, inner: 110 } : null });   // phone: the row stays clear of the edges and the thread

    return (t, time) => {
      swing(sunEl, 1260, 200, time, 1, 0.6);
      swing(cl, 520 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);
      L.update(t);
      S.cam.z = 1.02 + Math.min(1, t / 4) * 0.02;
      S.cam.y = 15;
    };
  },
};
