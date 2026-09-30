// Łk 3,28–31 — the road runs on into an evening of gold: on the horizon the hill of Zion with David's city.
// Four more garlands of names come near, verse by verse; the last brings Nathan, a king's son, and King David
// himself, crowned, with his harp on his badge.
import { C, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud, cypress, olive } from '../../assets/nature.js';
import { eraSet, lineRoad, gen, ICON3, DAVID, circlet, kingHead, harp, VP, tr, pose } from './lib.js';

/** the hill of Zion with the walls and David's tower (origin: ground centre) */
function zion(c, w = 460) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 60, 0], [-w / 2, -40], [-120, -70], [60, -80], [w / 2, -46], [w / 2 + 60, 0]], 1, 10), mix(C.dune, C.sand2, 0.35));
  const wall = mix(C.stone, C.wheat, 0.25);
  const pts = [[-w / 2 + 10, -38], [-w / 2 + 10, -74]];
  for (let x = -w / 2 + 10; x < w / 2 - 20; x += 16) pts.push([x, -74 - (x > -120 && x < 80 ? 8 : 0)], [x, -82], [x + 8, -82], [x + 8, -74]);
  pts.push([w / 2 - 20, -74], [w / 2 - 20, -44]);
  s.p(c.cut(pts, 0.4, 6), wall);
  s.p(c.cut(c.rect(-20, -138, 50, 70), 0.4, 5), shade(wall, -0.06));
  let cr = '';
  for (let x = -22; x < 30; x += 14) cr += c.cut(c.rect(x, -148, 8, 12), 0.2, 3);
  s.p(cr, shade(wall, -0.06));
  s.x(c.poly(c.rect(-2, -120, 12, 16)), C.soilDark);
  let rf = '';
  for (let i = 0; i < 10; i++) { const x = -w / 2 + 30 + i * 42 + c.rr(-8, 8); if (x > -40 && x < 40) continue; rf += c.cut(c.rect(x, -74 - c.rr(14, 28), c.rr(24, 34), 30), 0.3, 4); }
  s.p(rf, C.plaster);
  return s.out();
}

export default {
  id: 'lk3-kings',
  beats: [
    { v: 28 },
    { v: 29 },
    { v: 30 },
    { v: 31 },
  ],
  cam: { x: [-10, 10], y: [0, 30], z: [1, 1.05] },
  build(S) {
    const c = S.c;
    const E = eraSet(S, { skyCols: ['#d4bfa6', '#f0c994', '#f6dfb4'], far: mix(C.hillFar, C.duskViolet, 0.35), mid: mix(C.dune, C.wheat, 0.35), ground: mix(C.sand2, C.wheat, 0.35), road: mix(C.sand, C.cream, 0.45), grassCol: C.olive });
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 250, len: 700 });
    const cl = hanging(hangL, cloud(c, 160, '#f8e6c8', '#ecd2ae'), { x: 460, y: 180, len: 700 });
    E.midL.add(`<g transform="translate(420 ${VP[1] - 2}) scale(.8)">${zion(c)}</g>` + cypress(c, 1080, VP[1], 110) + cypress(c, 1110, VP[1] + 2, 80) + olive(c, 1240, VP[1] + 4, 0.6));

    const R = (pl, en, o) => gen(c, tr(pl, en), o);
    const L = lineRoad(S, [
      { people: [R('Melchi', 'Melchi'), R('Addi', 'Addi'), R('Kosam', 'Cosam'), R('Elmadan', 'Elmodam'), R('Her', 'Er')] },
      { people: [R('Jezus', 'Jose'), R('Eliezer', 'Eliezer'), R('Jorim', 'Jorim'), R('Mattat', 'Matthat'), R('Lewi', 'Levi')] },
      { people: [R('Symeon', 'Simeon'), R('Juda', 'Judah'), R('Józef', 'Joseph'), R('Jona', 'Jonan'), R('Eliakim', 'Eliakim')] },
      { people: [
        R('Meleasz', 'Melea'), R('Menna', 'Menan'), R('Mattata', 'Mattatha'),
        R('Natan', 'Nathan', { o: { robe: C.mauve, mantle: C.ochre, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin, belt: C.sun }, rim: 'king', head: (cc) => circlet(cc) }),
        R('król Dawid', 'King David', { o: { ...DAVID, holdF: '' }, r: 60, rim: 'king', icon: ICON3.harp, head: kingHead, size: 22 }),
      ], opts: { gold: true } },
    ], [0, 1, 2, 3], { extra: 2 });

    return (t, time) => {
      swing(sunEl, 1230, 250, time, 1, 0.6);
      swing(cl, 460 + Math.sin(time * 0.1) * 20, 180, time, 1.2, 0.6, 1);
      L.update(t);
      S.cam.z = 1.02 + Math.min(1, t / 4) * 0.02;
      S.cam.y = 15;
    };
  },
};
