// Mk 9,49–50 — evening, around a small fire. Everyone will be salted with fire: sparks fly up from the
// flames and come down as glittering grains of salt on each of them. Salt is good (a bowl of it shines
// in Jesus' hands) — but if it loses its taste (it turns dull and grey)… Have salt in yourselves and be
// at peace with one another: they take each other's hands, and a dove comes down over the circle.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, hillsWith, rock, grass, olive, stars, moon } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { TWELVE, LOOK, saltBowl, saltGrains, flame, dove, flapWings, question, sparkle } from './lib.js';

const PI = Math.PI;
const P = 0.45;
const FIRE = [800, 700];
// phone: the circle drawn in, so the outermost are not sliced by the frame and the thread
const RING_P = [[594, 0.84, false, 'sit'], [650, 0.86, false, 'sit'], [702, 0.9, false, 'kneel'], [898, 0.9, true, 'kneel'], [948, 0.86, true, 'sit'], [998, 0.84, true, 'sit'], [1048, 0.8, true, 'sit'], [546, 0.8, false, 'sit']];
const RING = [[560, 0.84, false, 'sit'], [630, 0.86, false, 'sit'], [690, 0.9, false, 'kneel'], [910, 0.9, true, 'kneel'], [970, 0.86, true, 'sit'], [1040, 0.84, true, 'sit'], [1110, 0.8, true, 'sit'], [490, 0.8, false, 'sit']];

export default {
  id: 'm9-salt',
  beats: [
    { v: 49 },
    { v: 50, text: 'Dobra jest sól;' },
    { v: 50, cont: true, text: 'lecz jeśli sól smak utraci, czymże ją przyprawicie?' },
    { v: 50, cont: true, text: 'Miejcie sól w sobie i zachowujcie pokój między sobą!».' },
  ],
  cam: { x: [-20, 20], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const EVE = ['#5b5d8f', '#c99a9a', '#eab993'];
    const PEACE = ['#4c5a8f', '#d6a7a0', '#f3caa0'];
    const sk = sky(S, EVE);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 90 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 32)}`, { x: 1220, y: 160, len: 900 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.4) }).markup);
    const lakeL = S.layer({ par: 0.14, sh: 2 });
    lakeL.add(waterBand(c, { y: 505, color: mix(C.lake2, C.duskViolet, 0.35), foamN: 14 }).markup);
    const hillL = S.layer({ par: 0.3, sh: 3 });
    hillL.add(sheet().p(c.cut([[-900, 600], [300, 580], [800, 596], [1300, 584], [2500, 600], [2500, 1700], [-900, 1700]], 1.2, 12), mix(C.hillNear, C.duskViolet, 0.25)).out());
    hillL.add(olive(c, 250, 610, 1.1) + olive(c, 1380, 606, 1) + rock(c, 1250, 640, 60, 20, C.rock2));

    /* ---------- the circle: Jesus and the disciples ---------- */
    const mainL = S.layer({ par: P, sh: 5 });
    const DIS = (S.portrait ? RING_P : RING).map(([x, s, flip, pose_], i) => ({ x, s, flip, pose_, i, o: TWELVE[i].o, seed: c.rr(0, 9) }));
    DIS.forEach((d) => { d.p = S.puppet(mainL.add(person(c, { ...d.o, pose: d.pose_ }))); });
    const jesus = S.puppet(mainL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const child = S.puppet(mainL.add(person(c, { ...LOOK.child, pose: 'sit' })));
    const grains = DIS.map((d) => ({ d, el: mainL.add(`<g opacity="0">${saltGrains(c, 10, 22)}</g>`), glint: mainL.add(`<g opacity="0">${sparkle(c, 9)}</g>`) }));
    // the bowl of salt: good, then dull
    const bowlGood = mainL.add(`<g opacity="0"><circle cy="-30" r="60" fill="url(#halo-glow)"/>${saltBowl(c, 70)}</g>`);
    const bowlDull = mainL.add(`<g opacity="0">${saltBowl(c, 70, { dull: true })}</g>`);
    const shine = mainL.add(`<g opacity="0">${sparkle(c, 14)}</g>`);
    const q = mainL.add(`<g opacity="0">${question(c)}</g>`);
    const dullFall = mainL.add(`<g opacity="0">${saltGrains(c, 12, 16, mix(C.stone2, C.rock2, 0.5))}</g>`);

    /* ---------- the fire ---------- */
    const fireL = S.layer({ par: P, sh: 4 });
    const glow = fireL.add(`<g><circle r="260" fill="url(#warm-glow)"/></g>`);
    fireL.add(`<g transform="translate(${FIRE[0]} ${FIRE[1]})">${sheet().p(c.ribbon([[-40, -4], [36, -14]], 9) + c.ribbon([[-34, -14], [42, -2]], 9), C.wood2).p(c.cut(c.ell(0, 2, 56, 9, 16), 0.6, 6), C.rock3).out()}</g>`);
    const flames = [[-14, 50], [8, 64], [22, 44], [-2, 36]].map(([dx, h], i) => ({ dx, i, el: fireL.add(`<g>${flame(c, h, i % 2 ? C.sunDeep : C.lampFlame)}</g>`) }));
    const sparks = Array.from({ length: 10 }, (_, i) => ({ i, seed: c.rr(0, 1), dx: c.rr(-1, 1), el: fireL.add(`<g opacity="0"><circle r="4" fill="${C.lampFlame}"/><circle r="9" fill="url(#warm-glow)"/></g>`) }));

    /* ---------- the dove of peace ---------- */
    const skyL = S.layer({ par: 0.4, sh: 4 });
    const doveEl = skyL.add(`<g><g transform="scale(-1 1)">${dove(c)}</g></g>`);
    const branch = skyL.add(`<g opacity="0">${sheet().p(c.ribbon([[0, 0], [22, -4]], 2), C.wood2).p(c.cut(c.ell(8, -6, 6, 3, 8, -0.4), 0.2, 2) + c.cut(c.ell(16, 2, 6, 3, 8, 0.4), 0.2, 2) + c.cut(c.ell(22, -8, 5, 2.6, 8, -0.3), 0.2, 2), C.olive).out()}</g>`);

    return (t, time) => {
      const T = time;
      const peace = es(t, 3.05, 3.6);
      sk.blend(EVE, PEACE, peace);
      starL.fade(0.5 + peace * 0.5);
      swing(moonEl, 1220, 160, T, 0.8, 0.5);

      /* the fire and its sparks; in beat 0 the sparks turn to salt falling on everyone */
      flames.forEach((f) => pose(f.el, { x: FIRE[0] + f.dx, y: FIRE[1] - 6, sy: 0.9 + Math.sin(T * 7 + f.i * 1.9) * 0.12 + bump(t, 0.05, 0.6) * 0.3, sx: 1 + Math.sin(T * 5 + f.i) * 0.08, r: Math.sin(T * 3 + f.i) * 4 }));
      pose(glow, { x: FIRE[0], y: FIRE[1] - 20, s: 0.8 + Math.sin(T * 4) * 0.03 + peace * 0.15, o: 0.55 });
      sparks.forEach((sp) => {
        const k = T ? (T * 0.35 + sp.seed) % 1 : (sp.i / 10);
        const burst = bump(t, 0, 1);
        pose(sp.el, { x: FIRE[0] + sp.dx * (20 + k * 120 * (0.3 + burst)), y: FIRE[1] - 40 - k * (140 + burst * 160), s: 1 - k * 0.6, o: (1 - k) * (0.5 + burst * 0.5) });
      });
      grains.forEach(({ d, el, glint }) => {
        const k = es(t, 0.35 + d.i * 0.04, 0.85 + d.i * 0.04);
        const [hx, hy] = [d.x + (d.flip ? -2 : 2) * d.s, 700 - (167 - (d.pose_ === 'sit' ? 62 : 46)) * d.s];
        pose(el, { x: lerp(FIRE[0], hx, k), y: lerp(FIRE[1] - 280, hy - 30, k), s: 0.6 + k * 0.4, o: bump(t, 0.35 + d.i * 0.04, 1.2 + d.i * 0.04) });
        pose(glint, { x: hx + 18, y: hy - 22, s: es(t, 0.8 + d.i * 0.04, 0.95 + d.i * 0.04, ease.back), r: T * 20, o: es(t, 0.8 + d.i * 0.04, 0.9 + d.i * 0.04) * (1 - es(t, 1.9, 2.2)) + es(t, 3.2, 3.5) * 0.8 });
      });

      /* Jesus holds up the bowl of salt (beat 1); it turns dull (beat 2) */
      const hold = es(t, 1.05, 1.3) * (1 - es(t, 2.85, 3.1));
      const dull = es(t, 2.1, 2.5);
      const hug = es(t, 3.1, 3.5);
      jesus.set({ x: 800, y: 660, s: 1.02, armF: 20 + hold * 70 + hug * 60, armB: 10 + hold * 40 + hug * 70, head: -4 + dull * 6 * (1 - hug), blink: blinkAt(T, 1) });
      const bx = 800 + 66, by = 660 - 74 - hold * 6;
      pose(bowlGood, { x: bx, y: by, s: 1.05, o: hold * (1 - dull) });
      pose(bowlDull, { x: bx, y: by, s: 1.05, o: hold * dull });
      pose(shine, { x: bx + 24, y: by - 50, s: 0.8 + Math.sin(T * 3) * 0.1, r: T * 20, o: hold * (1 - dull) });
      pose(q, { x: bx + 70, y: by - 70, s: es(t, 2.3, 2.5, ease.back), o: bump(t, 2.25, 2.97) > 0.05 ? 1 : 0 });
      const fallK = seg(t, 2.4, 2.9);
      pose(dullFall, { x: bx + 10, y: by + fallK * 110, o: fallK > 0 && fallK < 1 ? 1 - fallK : 0 });

      /* the circle: salt, then peace — they reach out to one another */
      DIS.forEach((d) => {
        const reach = es(t, 3.1 + d.i * 0.03, 3.45 + d.i * 0.03);
        const look = es(t, 1.05, 1.3) * (1 - es(t, 3, 3.2));
        d.p.set({ x: d.x + (d.flip ? -1 : 1) * reach * 8, y: 700, s: d.s, flip: d.flip, head: -4 - look * 6 + reach * 4, armF: 20 + reach * 60 + bump(t, 0.6, 1.4) * 30, armB: 10 + reach * 30 + bump(t, 0.6, 1.4) * 60 * (d.i % 2), lean: reach * 4, blink: blinkAt(T, d.seed) });
      });
      child.set({ x: 740, y: 696, s: 0.56, head: -6, armF: 20 + es(t, 3.2, 3.5) * 60, blink: blinkAt(T, 9) });

      /* the dove */
      const fly = es(t, 3.1, 3.85, (x) => x);
      pose(doveEl, { x: lerp(1500, 820, fly), y: lerp(200, 380, fly) + Math.sin(fly * PI) * -40 + Math.sin(T * 1.4) * 4 * fly, s: 0.9, o: seg(t, 3.08, 3.2) });
      flapWings(doveEl, T || 1, 30, 7, fly > 0.95 ? 10 : 0);
      pose(branch, { x: lerp(1500, 820, fly) - 60, y: lerp(200, 380, fly) + Math.sin(fly * PI) * -40 + Math.sin(T * 1.4) * 4 * fly - 8, s: 0.9, o: seg(t, 3.08, 3.2) });

      S.cam.z = 1.06 + es(t, 1, 1.5) * 0.05 - es(t, 3.05, 3.6) * 0.05;
      S.cam.y = 20 + es(t, 1, 1.5) * 10;
    };
  },
};
