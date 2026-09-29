// Łk 12,51–53 — the town house of chapter 12 again, its front wall gone, at evening: a family of five at supper by
// the lamp — father and mother, their son and his young wife, their daughter. "Do you think that I have come to give
// peace on the earth?": a dove with an olive twig flutters down over the roof. "No, I tell you, but rather division":
// the dove wheels away, and a jagged crack runs down the back wall, through the floor and the table, and the two halves
// of the table slide apart. "From now on there will be five in one house divided, three against two, and two against
// three": they get up and step apart, three on one side of the crack and two on the other. "Father against son, and son
// against father": the two face each other across the crack, arms out; "mother against daughter, and daughter against
// her mother"; "mother-in-law against her daughter-in-law, and daughter-in-law against her mother-in-law" — pair by pair,
// each with a dark scrap of hard words between them.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, house, moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { cutHouse, HS, FIVE, EVENING, dove, flapWings, lampBody, lampFire, WICK, headAt, darkKnot, halo, PI } from './lib.js';

const F = HS.FLOOR, CX = 640;
const SEATED = { father: 520, mother: 580, son: 700, bride: 760, daughter: 820 };
const STAND = { son: 590, daughter: 520, bride: 450, father: 690, mother: 770 };
const POS2 = { son: 520, daughter: 590, bride: 450, father: 770, mother: 690 };
const POS3 = { son: 520, daughter: 450, bride: 590, father: 770, mother: 690 };
const ORDER = ['father', 'mother', 'son', 'bride', 'daughter'];

export default {
  id: 'lk12-division',
  enter: 'fly',
  beats: [
    { v: 51, text: 'Czy myślicie, że przyszedłem dać ziemi pokój?' },
    { v: 51, cont: true, text: 'Nie, powiadam wam, lecz rozłam.' },
    { v: 52 },
    { v: 53, text: 'ojciec przeciw synowi, a syn przeciw ojcu;' },
    { v: 53, cont: true, text: 'matka przeciw córce, a córka przeciw matce;' },
    { v: 53, cont: true, text: 'teściowa przeciw synowej, a synowa przeciw teściowej».' },
  ],
  cam: { x: [-200, 0], y: [-40, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, EVENING);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    hanging(hangL, `${halo(90, 0.5)}${moon(c, 26)}`, { x: 1040, y: 160, len: 800 });
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = hillsWith(c, { y: 440, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.3), trees: 12, treeColor: C.sage, treeH: 18 });
    far.add(band(c, { y: 400, amps: [16, 7, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup + fb.markup + town(c, { x: 1150, y: fb.fn(1150) + 12, n: 6, spread: 300, sc: 0.55 }));
    const street = S.layer({ par: 0.4, sh: 3 });
    street.add(sheet().p(c.cut([[-1400, 606], [3000, 606], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.3)).out());
    let inL, crackL;
    const H = cutHouse(S, { inside: () => { crackL = S.layer({ par: 0.45, sh: 2 }); inL = S.layer({ par: 0.45, sh: 5 }); } });
    const crack = crackL.add(`<g><path d="${c.ribbon([[0, 0], [-10, 40], [8, 90], [-6, 150], [10, 210], [-4, 270], [6, 300]], (u) => 9 - u * 3, 3)}" fill="${mix(C.soilDark, C.night, 0.3)}"/></g>`);
    const floorCrack = crackL.add(`<g><path d="${c.ribbon([[0, 0], [-8, 12], [6, 26], [-4, 40]], 8, 3)}" fill="${mix(C.soilDark, C.night, 0.4)}"/></g>`);
    const tableHalf = (dir) => sheet().p(c.cut(dir < 0 ? [[-110, -44], [0, -44], [-6, -38], [4, -34], [-2, -30], [-110, -34]] : [[0, -44], [110, -44], [110, -34], [-2, -30], [4, -34], [-6, -38]], 0.3, 5), C.wood).p(c.cut(dir < 0 ? c.rect(-100, -34, 8, 34) : c.rect(92, -34, 8, 34), 0.2, 4), C.wood2).out();
    const tables = [-1, 1].map((d) => ({ d, el: inL.add(`<g>${tableHalf(d)}${d < 0 ? `<g transform="translate(-40 -44)">${lampBody(c)}</g>` : ''}</g>`) }));
    const fire = inL.add(`<g>${lampFire(c, 60)}</g>`);
    const people = ORDER.map((k, i) => ({ k, i, seed: c.rr(0, 9), sit: S.puppet(inL.add(person(c, { ...FIVE[k], pose: 'sit' }))), st: S.puppet(inL.add(person(c, FIVE[k]))) }));
    H.front && pose(H.front, { o: 0 });
    const fx = S.layer({ par: 0.5, sh: 6 });
    const doveEl = fx.add(dove(c));
    const twig = fx.add(`<g>${sheet().p(c.ribbon([[0, 0], [14, -6]], 1.6), C.olive).p(c.cut(c.ell(8, -8, 5, 2.4, 8, -0.5), 0.2, 2) + c.cut(c.ell(12, -2, 5, 2.4, 8, 0.4), 0.2, 2), C.olive).out()}</g>`);
    const knots = [0, 1, 2].map(() => fx.add(`<g opacity="0">${darkKnot(c, 14)}</g>`));

    return (t, time) => {
      const T = time;
      pose(H.front, { x: 0, y: -1500, o: 0 });
      fade(H.glow, 0.8);
      /* v51a — peace? a dove over the roof */
      const dv = es(t, 0.05, 0.45), away = es(t, 1.05, 1.5, ease.in);
      const dx = lerp(lerp(300, 640, dv), 1400, away), dy = lerp(lerp(160, HS.ROOF - 90, dv), 60, away);
      pose(doveEl, { x: dx, y: dy + (time ? Math.sin(T * 2) * 4 : 0), s: 1.1, sx: away > 0.05 ? 1 : 1, o: 1 });
      flapWings(doveEl, time ? T : 0.3, dv < 1 || away > 0 ? 34 : 14, dv < 1 || away > 0 ? 7 : 2);
      pose(twig, { x: dx + 34, y: dy - 10 + (time ? Math.sin(T * 2) * 4 : 0), o: 1 - away });
      /* v51b — no, division: the crack */
      const cr = es(t, 1.1, 1.45);
      pose(crack, { x: CX, y: HS.ROOF + 10, sy: Math.max(0.001, cr), o: cr > 0.01 ? 1 : 0 });
      pose(floorCrack, { x: CX, y: F - 6, sy: Math.max(0.001, es(t, 1.4, 1.55)), o: cr > 0.9 ? 1 : 0 });
      const apart = es(t, 1.45, 1.7);
      tables.forEach((tb) => pose(tb.el, { x: CX + tb.d * (4 + apart * 30), y: F + 4, r: tb.d * apart * 3 }));
      pose(fire, { x: CX - apart * 34 - 40 + WICK[0], y: F + 4 - 44 + WICK[1], s: 1 + (time ? Math.sin(T * 9) * 0.05 : 0), o: 1 - es(t, 1.5, 1.7) * 0.4 });
      /* v52 — three against two, two against three */
      const up = es(t, 2.05, 2.15);
      const move = es(t, 2.15, 2.6);
      const pair = [es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.05)), es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.05)), es(t, 5.05, 5.3)];
      const active = { father: pair[0], son: pair[0], mother: pair[1] + pair[2], daughter: pair[1], bride: pair[2] };
      people.forEach((p) => {
        const sx = SEATED[p.k], tx = STAND[p.k];
        const left = tx < CX;
        const x = lerp(lerp(lerp(sx, tx, move), POS2[p.k], es(t, 3.95, 4.15)), POS3[p.k], es(t, 4.95, 5.15));
        const a = Math.min(1, active[p.k]);
        const walking = (move > 0 && move < 1) || (t > 3.95 && t < 4.15) || (t > 4.95 && t < 5.15);
        p.sit.set({ x: sx, y: F + 6, s: 0.92, flip: sx > CX, o: 1 - up, armF: 30 + bump(t, 0.3, 0.9) * 20, armB: 14, head: 4, blink: blinkAt(T, p.seed) });
        p.st.set({ x, y: F + 4 + (p.i % 2) * 4, s: 0.94, flip: x > CX, o: up, walk: walking ? x * 0.05 : undefined, armF: 14 + a * 48, armB: 8 + a * 50, head: a * -6, lean: a * 6, blink: blinkAt(T, p.seed) });
      });
      const PAIRS = [['father', 'son'], ['mother', 'daughter'], ['mother', 'bride']];
      knots.forEach((kn, i) => {
        const k = pair[i];
        const [a, b] = PAIRS[i];
        pose(kn, { x: CX, y: 470, s: es(t, 3.05 + i, 3.25 + i, ease.back), r: time ? T * 30 : 0, o: k > 0.02 ? k : 0 });
      });

      S.cam.x = -160;
      S.cam.y = 10 - es(t, 0.05, 0.4) * 30 * (1 - es(t, 1.0, 1.3)) + es(t, 2.0, 2.4) * 20;
      S.cam.z = 1.1 + es(t, 3.0, 3.3) * 0.04;
    };
  },
};
