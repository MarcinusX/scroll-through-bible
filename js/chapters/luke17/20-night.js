// Łk 17,34–35 — night; a house in the village, and its front wall lifts away (Luke 12's house, dark blue with the
// night). The lamp in the niche burns low. "I tell you, in that night there will be two people in one bed": two men
// lie asleep side by side on one mat under their blankets. "The one will be taken, and the other will be left": a soft
// light wakes behind one of them, and he is lifted up, still as he lay, and is gone into it; the other stirs, sits
// up, and looks at the empty place beside him. "There will be two grinding grain together": at the hand-mill two
// women sit face to face and turn the upper stone between them, the flour trickling out. "One will be taken, and the
// other will be left": the light comes behind one of them and she is lifted up and gone; the other is left with her
// hand on the handle, looking up.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, house, moon, stars, cypress } from '../../assets/nature.js';
import { cutHouse, HS, NIGHT, quern, manO, womanO, halo, warm, kf, es, ease, bump, seg, PI } from './lib.js';
import { lyingPerson } from '../mark5/lib.js';
import { makeCutter } from '../../core/paper.js';

const F = HS.FLOOR;
const BED = 540, MILL = 772;
const SLEEP = [{ o: { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2 }, y: F - 14 }, { o: { robe: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3 }, y: F - 30 }];

function zzz(c, size = 18) {
  return `<text x="0" y="0" font-family="EB Garamond, Georgia, serif" font-size="${size}" font-style="italic" fill="${C.cream}">z<tspan dx="2" dy="-8" font-size="${size * 0.8}">z</tspan><tspan dx="2" dy="-7" font-size="${size * 0.64}">z</tspan></text>`;
}

export default {
  id: 'lk17-night',
  beats: [
    { v: 34, text: 'Powiadam wam: Tej nocy dwóch będzie na jednym posłaniu:' },
    { v: 34, cont: true, text: 'jeden będzie wzięty, a drugi zostawiony.' },
    { v: 35, text: 'Dwie będą mleć razem:' },
    { v: 35, cont: true, text: 'jedna będzie wzięta, a druga zostawiona».' },
  ],
  cam: { x: [-120, 60], y: [-20, 60], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 420, n: 130 }));
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const moonEl = hanging(hangL, `${halo(90, 0.45)}${moon(c, 30)}`, { x: 1180, y: 160, len: 800 });
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = hillsWith(c, { y: 440, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.night, 0.45), trees: 12, treeColor: mix(C.sage, C.night, 0.45), treeH: 18 });
    far.add(band(c, { y: 400, amps: [16, 7, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.night, 0.45) }).markup + fb.markup + town(c, { x: 1250, y: fb.fn(1250) + 12, n: 5, spread: 260, sc: 0.5, wall: mix(C.plaster, C.night, 0.4), shadow: mix(C.plaster2, C.night, 0.45) }));
    const street = S.layer({ par: 0.3, sh: 3 });
    street.add(sheet().p(c.cut([[-1400, 606], [3000, 606], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.night, 0.45)).out() + cypress(c, 1180, 612, 150, mix(C.moss2, C.night, 0.4)));
    /* the house, dark with the night; inside: the mat, the sleepers, the mill */
    let inL;
    const H = cutHouse(S, { tintCol: C.night, tintK: 0.32, inside: () => { inL = S.layer({ par: 0.45, sh: 5 }); } });
    const nicheGlow = H.glowL.add(`<g><circle r="90" fill="url(#warm-glow)" opacity=".8"/></g>`);
    const takeGlows = [0, 1].map(() => H.glowL.add(`<g opacity="0"><ellipse rx="120" ry="90" fill="url(#halo-glow)"/></g>`));
    const pc = makeCutter('lk17-night-folk');
    inL.add(`<g transform="translate(622 530)"><path d="M0 0C-5 -5 -5 -12 0 -20C5 -12 5 -5 0 0Z" fill="${C.lampFlame}"/></g>`);
    inL.add(`<g transform="translate(${BED} ${F - 4})">${sheet().p(pc.cut([[-130, 0], [130, 0], [126, 12], [-126, 12]], 0.4, 8), C.basket).x(pc.ribbon([[-124, 5], [124, 5]], 1.4), shade(C.basket, -0.25), 'opacity=".7"').p(pc.cut(pc.blob(30, -24, 22, 9, 10, 0.1), 0.4, 4) + pc.cut(pc.blob(46, -56, 22, 9, 10, 0.1), 0.4, 4), C.skyVeil).out()}</g>`);
    const sleepers = SLEEP.map((sl, i) => ({ i, el: inL.add(`<g>${lyingPerson(pc, sl.o, 0.62)}${sheet().p(pc.cut([[-54, -20], [64, -24], [70, 6], [-58, 8]], 0.8, 6), [C.clayMantle, C.plumRobe][i]).out()}</g>`), y: sl.y }));
    const sitUp = S.puppet(inL.add(person(pc, { ...SLEEP[0].o, pose: 'sit' })));
    const Q = quern(pc);
    inL.add(`<g transform="translate(${MILL} ${F + 4})">${Q.base}</g>`);
    const upper = inL.add(`<g>${Q.upper}</g>`);
    const peg = inL.add(`<g>${Q.peg}</g>`);
    const flour = inL.add(`<g opacity="0"><path d="${pc.cut(pc.blob(0, 0, 10, 4, 8, 0.2), 0.3, 3)}" fill="${C.linen}"/></g>`);
    const women = [[MILL - 70, false, C.roseRobe, C.blushVeil], [MILL + 72, true, C.skyVeil, C.linen2]].map(([x, fl, robe, veil], i) => ({ i, x, fl, seed: pc.rr(0, 9), p: S.puppet(inL.add(person(pc, womanO(pc, { robe, veil, pose: 'sit' })))) }));
    const zz = [0, 1].map(() => inL.add(`<g opacity="0">${zzz(c, 16)}</g>`));
    /* the front wall lifts away */

    return (t, time) => {
      const T = time;
      swing(moonEl, 1180, 160, T);
      pose(H.front, { x: 0, y: -es(t, 0.02, 0.3, ease.in) * 1300, o: t < 0.32 ? 1 : 0 });
      pose(nicheGlow, { x: 622, y: 516, o: 0.8 + (T ? Math.sin(T * 7) * 0.05 : 0) });

      /* v34 — two on one mat; one is taken, the other left */
      const lift = es(t, 1.2, 1.75, ease.in);
      const gone = es(t, 1.55, 1.78);
      const breathe = (i) => (T ? Math.sin(T * 1.4 + i * 2) * 1.2 : 0);
      sleepers.forEach((sp) => {
        const taken = sp.i === 1;
        const k = taken ? lift : 0;
        pose(sp.el, { x: BED - 60 + sp.i * 16, y: sp.y - sp.i * 8 - k * 220 + breathe(sp.i) * 0.5, o: taken ? 1 - gone : 1 - es(t, 1.82, 1.9) });
      });
      pose(takeGlows[0], { x: BED + 10, y: SLEEP[1].y - 20 - lift * 200, s: 0.6 + es(t, 1.05, 1.3) * 0.6, o: es(t, 1.05, 1.3) * (1 - es(t, 1.7, 1.9)) });
      const woke = es(t, 1.85, 1.95);
      sitUp.set({ x: BED - 30, y: F - 6, s: 0.92, flip: false, armF: 30 + es(t, 1.9, 2.2) * 40, armB: 10, head: -10 - es(t, 1.9, 2.2) * 10, o: woke, blink: blinkAt(T, 4) });
      zz.forEach((z, i) => {
        const k = T ? ((T * 0.3 + i * 0.5) % 1) : 0.5;
        pose(z, { x: BED - 150 + i * 18 + k * 20, y: F - 70 - k * 40 - i * 10, o: (1 - k) * (i === 1 ? 1 - es(t, 1.1, 1.3) : 1 - es(t, 1.8, 1.9)) * (t < 2.2 ? 1 : 0) });
      });

      /* v35 — two at the mill; one taken, the other left */
      const turning = t > 2.0 && t < 3.3;
      const a = turning && T ? T * 3 : 0;
      const stop = es(t, 3.25, 3.35);
      const px = Math.sin(a) * 26 * (1 - stop);
      pose(upper, { x: MILL, y: F + 4 });
      pose(peg, { x: MILL + px, y: F + 4 - 38 });
      pose(flour, { x: MILL + 50, y: F - 2 + (T ? (T * 30) % 6 : 0), o: turning ? 1 : 0 });
      const liftW = es(t, 3.2, 3.75, ease.in), goneW = es(t, 3.55, 3.78);
      women.forEach((w) => {
        const taken = w.i === 1;
        const look = taken ? 0 : es(t, 3.5, 3.7);
        w.p.set({ x: w.x, y: F + 6 - (taken ? liftW * 220 : 0), s: 0.9, flip: w.fl, armF: 76 + (w.fl ? -1 : 1) * px * 0.4 * (taken ? 1 - liftW : 1) + (taken ? liftW * 40 : 0), armB: 10 + (taken ? liftW * 100 : 0), head: 10 - look * 30, o: taken ? 1 - goneW : 1, blink: blinkAt(T, w.seed) });
      });
      pose(takeGlows[1], { x: women[1].x, y: F - 80 - liftW * 200, s: 0.6 + es(t, 3.05, 3.3) * 0.5, o: es(t, 3.05, 3.3) * (1 - es(t, 3.7, 3.9)) });

      S.cam.x = kf(t, [[0, -60], [1.9, -60], [2.2, 20], [4, 30]]);
      S.cam.y = kf(t, [[0, 20], [0.4, 50], [4, 50]]);
      S.cam.z = kf(t, [[0, 1.04], [0.5, 1.18], [1.9, 1.2], [2.2, 1.2], [4, 1.2]]);
    };
  },
};
import { swing } from '../kit.js';
