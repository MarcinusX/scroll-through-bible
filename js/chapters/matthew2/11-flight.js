// Mt 2,14 — at once, by night: Joseph comes out of the house with a lantern, Mary rides the donkey with the Child
// in her arms, and they slip away from sleeping Bethlehem. Then the long way south-west across the desert under
// the moon, past the palms, until the pyramids of Egypt rise on the horizon.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, palm, rock, grass, moon } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  LOOK, NIGHT, dim, nightSky, colt, coltRig, donkeyWithMary, infant, lantern, staff, pyramid, hillTown, flatHouse,
  placeTag, hangAt, vpose, kf, moving, scrub, tr, PI,
} from './lib.js';

const Y = 712;
const HX = 1250;                                   // the house in Bethlehem
const JK = [[0.05, HX - 10], [0.6, HX - 140], [0.95, HX - 260], [1.0, HX - 280], [1.95, 380]];

export default {
  id: 'mt2-flight',
  beats: [
    { v: 14, text: 'On wstał, wziął w nocy Dziecię i Jego Matkę' },
    { v: 14, cont: true, text: 'i udał się do Egiptu;' },
  ],
  cam: { x: [-440, 360], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const { hangL } = nightSky(S, { cols: NIGHT, n: 200 });
    const moonEl = hanging(hangL, moon(c, 34), { x: 0, y: 0, len: 800 });

    /* far: Bethlehem's hills on the right, desert dunes and the pyramids far on the left */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 480, amps: [18, 7, 3], lens: [900, 340, 120], color: dim(mix(C.dune, C.hillFar, 0.5), 0.55), x0: -1600, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    const mfn = c.wave(560, [14, 5], [600, 200]);
    mid.add(`<g transform="translate(470 ${mfn(470) + 20})">${pyramid(c, 240, 150, dim(C.dune, 0.42))}</g><g transform="translate(300 ${mfn(300) + 20})">${pyramid(c, 150, 95, dim(mix(C.dune, C.sand, 0.4), 0.42))}</g>`);
    mid.add(sheet().p(c.ridge(mfn, -1500, 3000, 1700, 12, 1), dim(mix(C.dune, C.sand2, 0.4), 0.5)).out());
    mid.add(`<g transform="translate(1260 ${mfn(1260) + 8})">${hillTown(c, { w: 280, h: 60, col: dim(mix(C.dune, C.sand2, 0.4), 0.5), wall: dim(C.plaster, 0.45), wall2: dim(C.plaster2, 0.5), roof: dim(C.roof, 0.45), n: 8, lit: 0.2 })}</g>`);
    mid.add(palm(c, 20, mfn(20) + 6, 170, { trunk: dim(C.wood3, 0.45), frond: dim(C.moss, 0.45), frond2: dim(C.leaf, 0.45) }) + palm(c, 110, mfn(110) + 6, 140, { trunk: dim(C.wood3, 0.45), frond: dim(C.moss, 0.45), frond2: dim(C.leaf, 0.45) }));

    /* the near ground: the house door on the right, the sand track to the left */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(Y - 40, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -1500, 3000, 1700, 12, 1), dim(mix(C.sand, C.sand2, 0.5), 0.45)).p(c.ribbon([[-1500, Y + 4], [3000, Y + 2]], 36, 2), dim(C.sand, 0.35)).out());
    G.add(flatHouse(c, HX - 100, Y - 24, 240, 170, { wall: dim(mix(C.plaster, C.dawn, 0.3), 0.3), wall2: dim(C.plaster2, 0.35), roofEdge: dim(C.roof, 0.3), door: dim(C.soilDark, 0.2), lit: false }));
    G.add(rock(c, 620, gfn(620) + 30, 90, 30, dim(C.rock2, 0.45)) + scrub(c, 160, gfn(160) + 34, 50, dim(C.olive, 0.45)) + scrub(c, 900, gfn(900) + 34, 44, dim(C.olive, 0.45)) + grass(c, { x0: -1400, x1: 2900, y: Y, fn: (x) => gfn(x) + 22, n: 40, h: 12, color: dim(C.olive, 0.45) }));

    /* the family */
    const P = S.layer({ par: 0.5, sh: 5 });
    const ride = donkeyWithMary(c, { infant: infant(c) });
    const donkey = coltRig(P.add(colt(c, { over: ride.saddle, rider: ride.rider })));
    const jEl = P.add(person(c, { ...LOOK.joseph, holdF: `<g class="lh"><g transform="scale(.9)">${lantern(c, { col: C.apricot })}</g></g>`, holdB: staff(c, 190, 30) }));
    const joseph = S.puppet(jEl);
    const lanHold = jEl.querySelector('.armFr .hold');

    const X = S.layer({ par: 0.3, sh: 5 });
    const tagN = hanging(X, placeTag(c, tr('w nocy', 'by night'), 18), { x: 0, y: 0, len: 600 });
    const tagE = hanging(X, placeTag(c, tr('Egipt', 'Egypt'), 22), { x: 0, y: 0, len: 600 });

    return (t, time) => {
      const T = time;
      swing(moonEl, 900 - es(t, 0, 2) * 500, 150, T, 1, 0.5);

      /* v14a — he rises and takes the Child and His mother, by night; v14b — away into Egypt */
      const jx = kf(t, JK, ease.sine);
      const walking = moving(t, JK, 0.3);
      const armN = 50;
      joseph.set({ x: jx, y: Y + 4, s: 0.9, flip: true, o: es(t, 0.02, 0.12), walk: walking ? jx * 0.06 : undefined, armF: armN, armB: 30, head: -4, blink: blinkAt(T, 2) });
      pose(lanHold, { x: 1.5, y: 57, r: armN + (walking ? Math.sin(jx * 0.06) * 14 : 0) });
      const dx = jx + 170;
      const dk = es(t, 0.3, 0.55);
      donkey.set({ x: dx, y: Y + 10, s: 0.95, flip: true, o: dk > 0.01 ? 1 : 0, walk: walking ? dx * 0.05 : undefined, nod: walking ? 0 : Math.sin(T * 0.8) * 3 });
      const nk = es(t, 0.2, 0.5, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      hangAt(tagN, HX - 180, lerp(-500, 260, nk), T, nk > 0.001 ? 1 : 0, 1.2, 0.9, 1);
      const ek = es(t, 1.5, 1.8, ease.out);
      hangAt(tagE, 420, lerp(-500, 280, ek), T, ek > 0.001 ? 1 : 0, 1.2, 0.9, 2);

      S.cam.x = kf(t, [[0, 340], [0.9, 250], [1.95, -420]], ease.sine);
      S.cam.y = 30;
      S.cam.z = 1.04;
    };
  },
};
