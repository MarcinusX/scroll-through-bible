// Mt 2,9–10 — the Magi ride out of Jerusalem by night. The star they saw in the East comes out on its string and goes
// before them along the road south, over the hills, until it stops over a house in Bethlehem and pours its light
// down on it. They get down from their camels with arms raised: great, great joy.
import { C, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, grass, rock, stars } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  NIGHT, dim, nightSky, magus, camelRider, walkCamel, jerusalem, hillTown, bigStar, beamGrad, starBeam, glory, flatHouse,
  hangAt, vpose, kf, moving, sparkle, placeTag, tr, PI,
} from './lib.js';

const Y = 712;
const HX = 1160;                     // the house where the Child is (on the town layer)
const LEAD = [[0.0, 480], [0.95, 640], [1.1, 660], [2.9, 900], [3.2, 960]];

export default {
  id: 'mt2-star',
  beats: [
    { v: 9, text: 'Oni zaś wysłuchawszy króla, ruszyli w drogę.' },
    { v: 9, cont: true, text: 'A oto gwiazda, którą widzieli na Wschodzie, szła przed nimi,' },
    { v: 9, cont: true, text: 'aż przyszła i zatrzymała się nad miejscem, gdzie było Dziecię.' },
    { v: 10 },
  ],
  cam: { x: [-320, 340], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    nightSky(S, { cols: NIGHT, n: 190 });

    /* far hills, Jerusalem behind on the left */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 470, amps: [22, 8, 3], lens: [1000, 360, 130], color: dim(C.hillFar, 0.58), x0: -1400, x1: 3000 }).markup);
    const cityL = S.layer({ par: 0.2, sh: 3 });
    cityL.add(`<g transform="translate(330 585)">${jerusalem(c, 0.5, { tglow: false })}</g>`);
    cityL.add(`<rect x="-3000" y="-600" width="8000" height="2600" fill="${C.night}" opacity=".42"/>`);
    let win = '';
    for (let i = 0; i < 16; i++) win += c.poly(c.rect(c.rr(0, 640), c.rr(470, 560), 4, 5));
    cityL.add(`<path d="${win}" fill="${C.lampFlame}" opacity=".85"/>`);

    /* Bethlehem ahead on the right, and the star that goes before them (same layer) */
    const townL = S.layer({ par: 0.35, sh: 3 });
    const tfn = (x) => 640 - Math.max(0, 1 - Math.abs(x - HX) / 420) ** 1.4 * 90;
    townL.add(sheet().p(c.ridge(tfn, -900, 2800, 1700, 12, 1), dim(mix(C.hillMid, C.sand2, 0.35), 0.5)).out());
    townL.add(`<g transform="translate(${HX - 60} ${tfn(HX - 60) + 14})">${hillTown(c, { w: 240, h: 40, col: dim(mix(C.hillMid, C.sand2, 0.35), 0.5), wall: dim(C.plaster, 0.45), wall2: dim(C.plaster2, 0.5), roof: dim(C.roof, 0.45), n: 7, lit: 0.5 })}</g>`);
    const houseY = tfn(HX) + 12;
    townL.add(flatHouse(c, HX - 45, houseY, 90, 64, { wall: dim(mix(C.plaster, C.dawn, 0.3), 0.3), wall2: dim(C.plaster2, 0.35), roofEdge: dim(C.roof, 0.3), door: dim(C.wood2, 0.3), lit: true }));
    const bid = beamGrad(S, 'beam');
    const beam = townL.add(`<g>${starBeam(bid, 16, 150, 200)}</g>`);
    const gl = townL.add(`<g>${glory(c, 170, 18)}</g>`);
    const star = hanging(townL, bigStar(c, 24), { x: 0, y: 0, len: 900 });
    const tagB = hanging(townL, placeTag(c, tr('Betlejem', 'Bethlehem'), 20), { x: 0, y: 0, len: 700 });

    /* the road */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(Y - 40, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -1200, 3000, 1700, 12, 1), dim(mix(C.sand2, C.hillNear, 0.35), 0.45)).p(c.ribbon([[-1200, Y + 2], [3000, Y + 6]], 40, 2), dim(C.sand, 0.4)).out());
    G.add(olive(c, 40, gfn(40) + 20, 0.9, { leaf: dim(C.olive, 0.45), leaf2: dim(C.sage, 0.45), trunk: dim(C.wood2, 0.35) }) + cypress(c, 1500, gfn(1500) + 10, 150, dim(C.moss2, 0.45)) + olive(c, 1880, gfn(1880) + 20, 1, { leaf: dim(C.olive, 0.45), leaf2: dim(C.sage, 0.45), trunk: dim(C.wood2, 0.35) }));
    G.add(rock(c, 700, gfn(700) + 26, 80, 26, dim(C.rock2, 0.45)) + grass(c, { x0: -1100, x1: 2900, y: Y, fn: (x) => gfn(x) + 18, n: 60, h: 12, color: dim(C.moss, 0.45) }));

    /* the caravan, and the Magi on foot for the joy */
    const cam = S.layer({ par: 0.5, sh: 5 });
    const camels = [0, 1, 2].map((i) => ({ i, el: cam.add(camelRider(c, i)) }));
    const plains = [0, 1, 2].map((i) => ({ i, el: cam.add(camelRider(c, i, { rider: false })) }));
    const M = S.layer({ par: 0.5, sh: 5 });
    const magi = [0, 1, 2].map((i) => ({ i, p: S.puppet(M.add(magus(c, i))), seed: c.rr(0, 9) }));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const joy = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, c.rr(9, 15))}</g>`), a: c.rr(0, PI * 2), r: c.rr(60, 190) }));

    return (t, time) => {
      const T = time;
      /* v9a — they set out: the camels come away from Jerusalem */
      const lx = kf(t, LEAD, ease.sine);
      const walking = moving(t, LEAD, 0.3);
      const down = es(t, 3.05, 3.12);
      camels.forEach((m) => {
        const x = lx - m.i * 150;
        pose(m.el, { x, y: Y + 6 - m.i * 3, s: 0.72, o: 1 - down });
        walkCamel(m.el, walking ? x * 0.05 + m.i : 0, walking ? 1 : 0);
      });
      plains.forEach((m) => pose(m.el, { x: lx - m.i * 150, y: Y + 6 - m.i * 3, s: 0.72, o: down }));
      magi.forEach((m) => {
        const x = lx - m.i * 150 + 70;
        const up = es(t, 3.12 + m.i * 0.06, 3.35 + m.i * 0.06);
        const hop = bump(t, 3.3 + m.i * 0.05, 3.55 + m.i * 0.05) + bump(t, 3.6 + m.i * 0.05, 3.85 + m.i * 0.05) * 0.6;
        m.p.set({ x, y: Y + 12 - hop * 16, s: 0.9, o: down, armF: 30 + up * 60, armB: 20 + up * 145, head: -up * 18, blink: blinkAt(T, m.seed) });
      });

      /* v9b — the star goes before them; v9c — it stops over the house */
      const sOn = es(t, 1.0, 1.3, ease.out);
      const sx = kf(t, [[1.0, 560], [2.0, 900], [2.8, HX]], ease.sine);
      const sy = kf(t, [[1.0, 150], [2.0, 190], [2.8, 250]], ease.sine);
      if (sOn <= 0.001) pose(star, { x: sx, y: -700, o: 0 });
      else pose(star, { x: sx, y: lerp(-500, sy, sOn) + Math.sin(T * 1.2) * 3, r: Math.sin(T * 0.8) * 2, oy: 0, o: 1 });
      const stop = es(t, 2.7, 3.0);
      vpose(beam, { x: HX, y: 262, sx: 0.3 + stop * 0.7, o: stop * 0.85 });
      const flare = es(t, 3.05, 3.4);
      vpose(gl, { x: HX, y: 250, s: 0.4 + flare * 0.6, r: T * 4, o: flare * 0.45 });
      const tk = es(t, 2.2, 2.5, ease.out);
      hangAt(tagB, HX - 170, lerp(-500, 330, tk), T, tk > 0.001 ? 1 : 0, 1.2, 0.9, 2);
      joy.forEach((j) => {
        const k = es(t, 3.1 + j.i * 0.03, 3.4 + j.i * 0.03);
        const a = j.a + T * 0.3;
        vpose(j.el, { x: lx - 90 + Math.cos(a) * j.r * 1.4, y: 430 + Math.sin(a) * j.r * 0.5, s: k * (0.8 + Math.sin(T * 3 + j.i) * 0.2), r: T * 40, o: k });
      });

      S.cam.x = kf(t, [[0, -300], [1.0, -220], [2.9, 300], [3.2, 320]], ease.sine);
      S.cam.y = 30 - es(t, 3.0, 3.4) * 10;
      S.cam.z = 1 + es(t, 3.0, 3.4) * 0.06;
    };
  },
};
