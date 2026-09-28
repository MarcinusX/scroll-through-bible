// Mt 2,1a — the curtains open on the hills of Judea at night. In little Bethlehem one house has its door open
// and lit: Mary holds the newborn Child, Joseph stands by. A new star comes down on its string over the house,
// and at the edge of the stage hangs the medallion of the one who reigns: King Herod.
import { C, person, blinkAt, pose, lerp, curtains, hanging, sheet, shade, mix } from '../kit.js';
import { band, cypress, olive, grass, rock } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  LOOK, NIGHT, dim, nightSky, bigStar, beamGrad, starBeam, hillTown, infant, herodPuppet, bustMedal, placeTag,
  hangAt, vpose, flicker, sparkle, tr, PI,
} from './lib.js';

const GY = 700;          // the ground in front of the house
const HX = 800;          // the house

export default {
  id: 'mt2-bethlehem',
  beats: [
    { cover: true },
    { v: 1, text: 'Gdy zaś Jezus narodził się w Betlejem w Judei za panowania króla Heroda,' },
  ],
  cam: { x: [-30, 30], y: [-40, 60], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const { hangL } = nightSky(S, { cols: NIGHT, n: 170 });

    /* the hills of Judea and the town on its ridge */
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(band(c, { y: 470, amps: [24, 9, 3], lens: [1000, 360, 130], color: dim(C.hillFar, 0.55) }).markup);
    const townL = S.layer({ par: 0.14, sh: 3 });
    const tfn = c.wave(560, [10, 4], [700, 220]);
    townL.add(sheet().p(c.ridge(tfn, -900, 2500, 1700, 12, 1), dim(mix(C.hillMid, C.sand2, 0.4), 0.5)).out());
    townL.add(`<g transform="translate(470 ${tfn(470) + 6})">${hillTown(c, { w: 330, h: 70, col: dim(mix(C.sand2, C.hillMid, 0.3), 0.5), wall: dim(C.plaster, 0.45), wall2: dim(C.plaster2, 0.5), roof: dim(C.roof, 0.45), n: 10, lit: 0.4 })}</g>`);
    townL.add(`<g transform="translate(1170 ${tfn(1170) + 6})">${hillTown(c, { w: 300, h: 60, col: dim(mix(C.sand2, C.hillMid, 0.3), 0.5), wall: dim(C.plaster, 0.45), wall2: dim(C.plaster2, 0.5), roof: dim(C.roof, 0.45), n: 9, lit: 0.4 })}</g>`);
    townL.add(cypress(c, 700, tfn(700) + 8, 120, dim(C.moss2, 0.4)) + cypress(c, 930, tfn(930) + 8, 100, dim(C.moss2, 0.4)));

    /* the near ground */
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(GY - 40, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), dim(mix(C.sand2, C.hillNear, 0.35), 0.45)).out());
    G.add(olive(c, 230, gfn(230) + 22, 1.05, { leaf: dim(C.olive, 0.4), leaf2: dim(C.sage, 0.4), trunk: dim(C.wood2, 0.3) }) + olive(c, 1380, gfn(1380) + 22, 0.95, { leaf: dim(C.olive, 0.4), leaf2: dim(C.sage, 0.4), trunk: dim(C.wood2, 0.3) }));
    G.add(rock(c, 520, gfn(520) + 30, 90, 30, dim(C.rock2, 0.4)) + grass(c, { x0: -800, x1: 2400, y: GY, fn: (x) => gfn(x) + 20, n: 40, h: 12, color: dim(C.moss, 0.4) }));

    /* the house: the lit room behind the doorway, the family, then the facade in front */
    const DW = 270, DT = 500, HW = 250, HT = 410;
    const inL = S.layer({ par: 0.5, sh: 1 });
    inL.add(`<g><path d="${c.cut(c.rect(HX - DW / 2 - 10, DT - 60, DW + 20, GY - DT + 70), 0.5, 10)}" fill="${dim(mix(C.clay, C.wood3, 0.4), 0.35)}"/></g>`);
    const inside = inL.add(`<g><path d="${c.cut(c.rect(HX - DW / 2 - 10, DT - 60, DW + 20, GY - DT + 70), 0.5, 10)}" fill="${mix(C.clay, C.apricot, 0.5)}"/><circle cx="${HX}" cy="${GY - 90}" r="230" fill="url(#warm-glow)"/></g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const joseph = S.puppet(P.add(person(c, { ...LOOK.joseph })));
    const mary = S.puppet(P.add(person(c, { ...LOOK.mary, pose: 'sit' })));
    const babyEl = P.add(`<g>${infant(c)}</g>`);
    const front = S.layer({ par: 0.5, sh: 5 });
    const fs = sheet();
    const door = [[HX - DW / 2, GY + 30], [HX - DW / 2, DT + 40], ...c.arc(HX, DT + 40, DW / 2, 70, PI, 2 * PI, 12), [HX + DW / 2, GY + 30]];
    fs.p(c.cut([[HX - HW, GY + 30], [HX - HW, HT], [HX + HW, HT], [HX + HW, GY + 30]], 0.6, 10) + c.hole(door, 0.5, 6), dim(mix(C.plaster, C.dawn, 0.3), 0.25));
    fs.p(c.cut([[HX + HW, HT + 12], [HX + HW + 60, HT + 30], [HX + HW + 60, GY + 30], [HX + HW, GY + 30]], 0.4, 8), dim(C.plaster2, 0.3));
    fs.p(c.cut([[HX - HW - 14, HT - 12], [HX + HW + 14, HT - 12], [HX + HW + 14, HT + 6], [HX - HW - 14, HT + 6]], 0.4, 8), dim(C.roof, 0.25));
    fs.p(c.ribbon(c.arc(HX, DT + 40, DW / 2 + 6, 76, PI, 2 * PI, 12), 10), dim(C.wood2, 0.2));
    fs.p(c.cut(c.rect(HX + 160, 450, 44, 36), 0.3, 5), mix(C.lampFlame, C.apricot, 0.3));
    fs.p(c.cut([[HX - DW / 2 - 16, GY + 8], [HX + DW / 2 + 16, GY + 8], [HX + DW / 2 + 22, GY + 34], [HX - DW / 2 - 22, GY + 34]], 0.4, 8), dim(C.stone2, 0.3));
    let bricks = '';
    for (let i = 0; i < 22; i++) { const x = c.rr(HX - HW + 10, HX + HW - 10), y = c.rr(HT + 20, GY); if (Math.abs(x - HX) < DW / 2 + 20) continue; bricks += c.cut(c.blob(x, y, c.rr(14, 26), c.rr(7, 11), 8, 0.2), 0.5, 5); }
    fs.x(bricks, dim(C.plaster2, 0.36), 'opacity=".5"');
    front.add(fs.out());
    front.add(`<g><circle cx="${HX + 182}" cy="468" r="64" fill="url(#warm-glow)" opacity=".7"/></g>`);

    /* in the flies: the star, the name of the town, King Herod's medallion */
    const fly = S.layer({ par: 0.2, sh: 5 });
    const bid = beamGrad(S, 'beam');
    const beam = fly.add(`<g>${starBeam(bid, 20, 260, 330)}</g>`);
    const star = hanging(fly, bigStar(c, 30), { x: 0, y: 0, len: 700 });
    const glints = [0, 1, 2].map(() => fly.add(`<g>${sparkle(c, 9)}</g>`));
    const name = hanging(fly, placeTag(c, tr('Betlejem w Judei', 'Bethlehem of Judea'), 21), { x: 0, y: 0, len: 600 });
    const herodM = hanging(fly, bustMedal(c, S.id('herod'), herodPuppet(c, {}), { r: 50, face: mix(C.parchment, C.mauve, 0.3), rim: C.plumRobe, label: tr('król Herod', 'King Herod'), size: 16 }), { x: 0, y: 0, len: 700 });

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(40, 930, 300, 120, 14, 0.15), 1, 8), dim(C.moss2, 0.5)).p(c.cut(c.blob(1580, 940, 320, 130, 14, 0.15), 1, 8), dim(C.moss2, 0.5)).out());

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* v1a — the Child is born in Bethlehem: the doorway glows, Mary holds Him, the star comes down */
      const born = es(t, 1.0, 1.4);
      pose(inside, { o: born });
      mary.set({ x: HX - 40, y: GY + 4, s: 0.86, armF: 50 + born * 12, armB: 36 + born * 10, head: 12, blink: blinkAt(T, 1) });
      pose(babyEl, { x: HX - 6, y: GY - 60, s: 0.9 * (0.6 + 0.4 * born), r: -10, o: born > 0.01 ? 1 : 0 });
      joseph.set({ x: HX + 96, y: GY + 6, s: 0.84, flip: true, armF: 18 + born * 34, armB: 8, head: 10, blink: blinkAt(T, 3) });

      const sk = es(t, 1.15, 1.55, ease.out);
      hangAt(star, HX, lerp(-520, 200, sk), T, sk > 0.001 ? 1 : 0, 1.2, 0.7, 0);
      vpose(beam, { x: HX, y: 214, sx: 0.3 + sk * 0.7, o: es(t, 1.45, 1.75) * 0.8 });
      glints.forEach((g, i) => {
        const a = T * 0.8 + i * 2.1, k = es(t, 1.5 + i * 0.06, 1.7 + i * 0.06);
        vpose(g, { x: HX + Math.cos(a) * 70, y: 200 + Math.sin(a) * 50, s: k * (0.8 + 0.2 * Math.sin(T * 3 + i)), r: T * 30, o: k });
      });
      const nk = es(t, 1.05, 1.35, ease.out) * 1;
      hangAt(name, 470, lerp(-500, 330, nk), T, nk > 0.001 ? 1 : 0, 1.4, 0.9, 2);
      const hk = es(t, 1.35, 1.7, ease.out);
      hangAt(herodM, 1120, lerp(-500, 200, hk), T, hk > 0.001 ? 1 : 0, 1.2, 0.8, 4);

      S.cam.z = 1 + es(t, 0.4, 1.3) * 0.08;
      S.cam.y = es(t, 0.4, 1.3) * 30;
      S.cam.x = 0;
    };
  },
};
