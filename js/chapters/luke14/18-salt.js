// Łk 14,34–35a — a painted flat of a farmyard: the house wall with its door, a little table with a loaf, a ploughed field
// and a manure heap with a pitchfork in it. "Salt is good": the farmer's wife sprinkles white salt from her bowl over the
// bread — it glitters — she tastes, and smiles. "But if the salt has lost its taste…": the salt in her bowl goes grey
// and dull; she tastes and makes a face — with what could it be salted again? "It is fit neither for the soil nor for
// the manure heap": she tries it on the field — no; on the heap — no; and she flings it out onto the road.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, sun, cloud, house } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SF, FARMWIFE, saltBowl, saltGrains, manureHeap, crossMark, question, sparkle, storyFrame, loaf, headAt, hand, kf, moving, popAt, sheet, mix, shade, DAY } from './lib.js';

const GY = SF.GY, WX = 470, TBX = 560;

export default {
  id: 'lk14-salt',
  enter: 'fly',
  beats: [
    { v: 34, text: 'Dobra jest sól;' },
    { v: 34, cont: true, text: 'lecz jeśli nawet sól smak swój utraci, to czymże ją zaprawić?' },
    { v: 35, text: 'Nie nadaje się ani do ziemi, ani do nawozu; precz się ją wyrzuca.' },
  ],
  cam: { x: [-120, 120], y: [0, 140], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1200, y: 180, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 760, y: 150, len: 800 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillMid, C.hillFar, 0.3), trees: 16, treeColor: C.sage, treeH: 18 }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(band(c, { y: 550, amps: [8, 3], lens: [700, 220], color: C.hillNear }).markup + olive(c, 660, 556, 0.7) + cypress(c, 1320, 556, 120));
    const G = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet();
    gs.p(c.cut([[-900, 600], [2500, 600], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.hillNear, C.sand, 0.3));
    // the field
    gs.p(c.cut([[SF.FIELD - 150, 612], [SF.FIELD + 150, 608], [SF.FIELD + 190, 690], [SF.FIELD - 190, 694]], 0.8, 10), mix(C.soil, C.sand2, 0.35));
    let fur = '';
    for (let i = 0; i < 8; i++) { const y = 620 + i * 9; fur += c.ribbon([[SF.FIELD - 150 - i * 5, y], [SF.FIELD + 150 + i * 5, y - 2]], 2); }
    gs.x(fur, shade(C.soil, -0.2), 'opacity=".55"');
    let sh = '';
    for (let k = 0; k < 50; k++) { const x = c.rr(SF.FIELD - 170, SF.FIELD + 170), y = c.rr(616, 688); sh += c.poly([[x, y], [x - 2, y - 7], [x + 2, y - 7]]); }
    gs.x(sh, C.leaf);
    // the road in front
    gs.p(c.ribbon([[-900, SF.ROADY], [2500, SF.ROADY - 6]], 70, 2), mix(C.sand, C.cream, 0.3));
    G.add(gs.out());
    // the house wall and door, the table
    const hL = S.layer({ par: 0.42, sh: 4 });
    const hs = sheet();
    const wall = mix(C.plaster, C.ochre, 0.15);
    hs.p(c.cut([[-900, GY - 10], [-900, 420], [WX - 60, 420], [WX - 60, GY - 10]], 0.5, 10), wall);
    hs.p(c.cut(c.rect(-900, 410, WX - 60 + 910, 16), 0.3, 8), shade(wall, -0.15));
    hs.p(c.cut([[WX - 170, GY - 10], [WX - 170, 540], ...c.arc(WX - 130, 540, 40, 30, Math.PI, 2 * Math.PI, 8), [WX - 90, 540], [WX - 90, GY - 10]], 0.3, 5), C.wood2);
    hs.p(c.cut([[TBX - 50, GY - 56], [TBX + 50, GY - 56], [TBX + 50, GY - 46], [TBX - 50, GY - 46]], 0.3, 5), C.wood);
    hs.p(c.cut(c.rect(TBX - 44, GY - 46, 8, 46), 0.3, 4) + c.cut(c.rect(TBX + 36, GY - 46, 8, 46), 0.3, 4), C.wood2);
    hL.add(hs.out());
    const bread = hL.add(`<g>${loaf(c, 18)}</g>`);
    const heapL = S.layer({ par: 0.42, sh: 4 });
    heapL.add(`<g transform="translate(${SF.HEAP} ${GY + 4})">${manureHeap(c, 170)}</g>`);
    const pL = S.layer({ par: 0.46, sh: 5 });
    const wife = S.puppet(pL.add(person(c, FARMWIFE)));
    const good = pL.add(`<g>${saltBowl(c, 64)}</g>`);
    const dull = pL.add(`<g opacity="0">${saltBowl(c, 64, { dull: true })}</g>`);
    const white = pL.add(`<g opacity="0">${saltGrains(c, 16, 22)}</g>`);
    const grey = [0, 1, 2].map(() => pL.add(`<g opacity="0">${saltGrains(c, 18, 24, mix(C.stone2, C.rock2, 0.5))}</g>`));
    const thrown = pL.add(`<g opacity="0">${saltGrains(c, 40, 70, mix(C.stone2, C.rock2, 0.5))}</g>`);
    const fx = S.layer({ par: 0.48, sh: 3 });
    const glint = [0, 1, 2].map(() => fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`));
    const q = fx.add(`<g opacity="0">${question(c)}</g>`);
    const x1 = fx.add(`<g opacity="0">${crossMark(c, 26, C.terracotta)}</g>`);
    const x2 = fx.add(`<g opacity="0">${crossMark(c, 26, C.terracotta)}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1200, 180, T, 1, 0.6);
      swing(cl, 760 + Math.sin(T * 0.1) * 16, 150, T, 1.2, 0.6, 1);
      pose(bread, { x: TBX + 10, y: GY - 56 });
      /* v34a — salt is good */
      const K = [[2.0, WX], [2.2, SF.FIELD - 120], [2.36, SF.FIELD - 120], [2.52, SF.HEAP - 150], [2.64, SF.HEAP - 150]];
      const wx = kf(t, K);
      const sprinkle = bump(t, 0.06, 0.42);
      const taste = bump(t, 0.46, 0.8) + bump(t, 1.3, 1.62);
      const yuck = es(t, 1.5, 1.6) * (1 - es(t, 1.95, 2.0));
      const onField = bump(t, 2.2, 2.36), onHeap = bump(t, 2.52, 2.64), fling = es(t, 2.64, 2.72);
      const armF = 60 + sprinkle * 30 + taste * 70 + onField * 40 + onHeap * 40 + fling * 90 - yuck * 20;
      wife.set({ x: wx, y: GY + 4, s: 1.02, flip: false, walk: moving(t, K) ? wx * 0.05 : undefined, amt: 0.8, armF, armB: 20 + yuck * 110, head: 6 + sprinkle * 10 - taste * 8 + (T && yuck ? Math.sin(T * 14) * 8 * yuck : 0), lean: sprinkle * 6, blink: blinkAt(T, 2) });
      const [hx, hy] = hand(wx, GY + 4, 1.02, false, armF, sprinkle * 6);
      const turned = es(t, 1.14, 1.24);
      const gone = es(t, 2.66, 2.72);
      const tilt = sprinkle * 60 + onField * 70 + onHeap * 70 + fling * 120;
      pose(good, { x: hx, y: hy + 6, r: tilt, o: 1 - turned });
      pose(dull, { x: hx, y: hy + 6, r: tilt, o: turned * (1 - gone) });
      const fall = seg(t, 0.14, 0.42);
      pose(white, { x: TBX + 16, y: lerp(hy - 6, GY - 70, fall), o: fall > 0 && fall < 1 ? 1 : 0 });
      glint.forEach((e, i) => { const k = bump(t, 0.3 + i * 0.08, 0.8 + i * 0.08); pose(e, { x: TBX - 10 + i * 20, y: GY - 76 - i * 6, s: k, r: T * 40, o: k > 0.02 ? 1 : 0 }); });
      /* v34b — the salt goes dull: with what shall it be salted? */
      const [whx, why] = headAt(wx, GY + 4, 1.02, false);
      popAt(q, t, 1.62, 2.02, whx + 40, why - 80 + (T ? Math.sin(T * 1.6) * 4 : 0), { d: 0.12, s: 1.2 });
      /* v35a — not for the soil, not for the manure heap: thrown out */
      grey.forEach((e, i) => {
        const [a, b, tx, ty] = [[2.22, 2.36, SF.FIELD, 650], [2.54, 2.66, SF.HEAP - 40, GY - 50], [2.66, 2.8, SF.HEAP + 110, GY + 10]][i];
        const u = seg(t, a, b);
        pose(e, { x: lerp(hx, tx, u), y: lerp(hy, ty, u) - Math.sin(u * Math.PI) * 40, o: u > 0 && u < 1 ? 1 : 0 });
      });
      popAt(x1, t, 2.32, undefined, SF.FIELD, 580, { d: 0.1 });
      popAt(x2, t, 2.62, undefined, SF.HEAP, GY - 130, { d: 0.1 });
      pose(thrown, { x: SF.HEAP + 110, y: GY + 12, sy: 0.35, o: es(t, 2.76, 2.82) });

      S.cam.x = kf(t, [[-0.5, -60], [0.3, -80], [1.9, -80], [2.3, 40], [2.7, 90]]);
      S.cam.y = kf(t, [[-0.5, 80], [0.3, 130], [1.9, 130], [2.2, 80]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.3, 1.18], [1.9, 1.18], [2.2, 1.04]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, -120], [1.9, -120], [2.2, 20], [2.55, 120], [2.8, 100]]); S.cam.z = 1.0; }
      void ease; void house; void grass;
    };
  },
};
