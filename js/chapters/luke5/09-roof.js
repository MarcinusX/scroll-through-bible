// Łk 5,18–19 — four men come down the street carrying a paralysed man on his bed and try to get him in at the door;
// but the doorway and the street are packed and there is no way through ("?"). So they climb the stair beyond the
// door with the bed, go along the flat roof to the place over Jesus, lift the clay tiles off one by one and the
// laths beneath them, and let him down on ropes, bed and all, into the middle of the room, right in front of Jesus —
// while everyone inside looks up at the light and the dust coming through the ceiling.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  houseSet, houseCast, HS, JH, BED, stairStep, matWithMan, FRIENDS, rope, dust, speech, GLYPH, hand, headAt, kf, moving,
  DAY, es, ease, bump, seg, PI,
} from './lib.js';

const OFF = [-68, 64, -78, 72];                 // each friend's place along the bed (0,1 behind it, 2,3 in front)
const ROOFY = HS.ROOF - 2;                       // they walk on the roof here
const AT_HOLE = [HS.HOLE0 - 34, HS.HOLE1 + 34, HS.HOLE0 - 74, HS.HOLE1 + 74];
const MATW = 170;

/** the bed's centre at time t: along the street, up the stair, along the roof to the hole */
function bedPath(t) {
  const [s0x, s0y] = stairStep(0), [s9x, s9y] = stairStep(9);
  return kf(t, [
    [0.05, [1900, HS.STREET + 10]], [0.7, [1640, HS.STREET + 10]], [0.85, [1600, HS.STREET + 10]], [1.08, [s0x + 60, HS.STREET + 10]],
    [1.2, [s0x + 20, s0y + 10]], [1.6, [s9x + 10, s9y + 4]], [1.72, [HS.WING - 20, ROOFY]], [2.0, [HS.HOLE1 + 150, ROOFY]],
  ], (u) => u);
}

export default {
  id: 'lk5-roof',
  beats: [
    { v: 18 },
    { v: 19, text: 'Nie mogąc z powodu tłumu w żaden sposób go przynieść, wyszli na płaski dach' },
    { v: 19, cont: true, text: 'i przez powałę spuścili go wraz z łożem w sam środek przed Jezusa.' },
  ],
  cam: { x: [-60, 1400], y: [-260, 60], z: [0.96, 1.12] },
  build(S) {
    const c = S.c;
    const H = houseSet(S, { skyCols: DAY });
    const P = houseCast(S, H);

    /* the bed coming down through the hole (inside), the ropes */
    const ropes = [0, 1, 2, 3].map(() => H.lowL.add(rope(c, 100)));
    const bedIn = H.lowL.add(`<g>${matWithMan(c, { w: MATW })}</g>`);
    const shaft = H.glowL.add(`<path d="M${HS.HOLE0 + 10} ${HS.CEIL}L${HS.HOLE1 - 10} ${HS.CEIL}L${HS.HOLE1 + 60} ${HS.FLOOR}L${HS.HOLE0 - 40} ${HS.FLOOR}Z" fill="#fff3cf" opacity=".5"/>`);
    const dustIn = [0, 1, 2, 3, 4].map((i) => ({ i, el: H.lowL.add(`<g>${dust(c, 18 + i * 3)}</g>`), x: HS.HOLE0 + 20 + i * 36 }));

    /* the four friends and the bed they carry */
    const frL = S.layer({ par: 0.5, sh: 5 });
    const fr = FRIENDS.map((o, i) => ({ i, o, seed: c.rr(0, 9) }));
    fr.slice(0, 2).forEach((f) => { f.p = S.puppet(frL.add(person(c, f.o))); });
    const bedOut = frL.add(`<g>${matWithMan(c, { w: MATW })}</g>`);
    fr.slice(2).forEach((f) => { f.p = S.puppet(frL.add(person(c, f.o))); });
    const noWay = frL.add(`<g>${speech(c, GLYPH.q(c), { w: 44, h: 44, flip: true })}</g>`);
    const idea = frL.add(`<g>${speech(c, GLYPH.bang(c, C.teal), { w: 40, h: 40, flip: true })}</g>`);
    const dustOut = [0, 1, 2, 3].map(() => frL.add(`<g>${dust(c, 22, C.sand2)}</g>`));

    return (t, time) => {
      const T = time;
      H.idle(T);
      P.crowd(0, 1);
      const S_ = 0.64;                      // the friends' scale (they are nearer the street than the room)

      /* inside: He teaches; at the noise overhead all look up */
      const up = es(t, 2.08, 2.3);
      const toBed = es(t, 2.75, 2.95);
      P.jesus.set({ x: JH.x, y: HS.FLOOR, s: JH.s, flip: true, armF: 16 + (1 - up) * 40 + toBed * 40, armB: 10 + (1 - up) * 20, head: -up * 16 * (1 - toBed) + toBed * 12, blink: blinkAt(T) });
      P.scribes.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 0.8, flip: false, armF: 24 + (m.i % 2) * 14 + up * (m.i % 2 ? 40 : 0), armB: 14 + up * (m.i === 2 ? 60 : 0), head: -up * 18 * (1 - toBed) + toBed * 8, blink: blinkAt(T, m.seed) }));

      /* the friends: along the street, blocked at the door, up the stair, along the roof */
      const [bx, by] = bedPath(t);
      const walking = t > 0.05 && t < 2.0 && !(t > 0.7 && t < 1.08 && Math.abs(bedPath(t + 0.02)[0] - bx) < 0.3);
      const onRoof = t >= 1.72;
      const dig = es(t, 2.02, 2.08);
      fr.forEach((f) => {
        const i = f.i;
        let x = bx + OFF[i] * (bx > 1500 ? 1 : 1), y = by, flip = true, armF = 150, armB = 120, lean = 0, head = 0, walk;
        // on the stair: stagger each carrier along the slope
        if (t > 1.08 && t < 1.72) { const [x2, y2] = bedPath(t - OFF[i] * 0.0012); x = x2 + OFF[i] * 0.5; y = y2; }
        if (walking) walk = (x + y) * 0.06 + i;
        if (t > 0.72 && t < 1.05) { armF = 150 - bump(t, 0.75, 1.0) * 20; head = -bump(t, 0.75, 1.0) * 10; }
        if (dig > 0) {
          const k = es(t, 2.04, 2.18);
          x = lerp(x, AT_HOLE[i], k); y = ROOFY;
          flip = AT_HOLE[i] > (HS.HOLE0 + HS.HOLE1) / 2;
          const lift = bump(t, 2.1 + i * 0.03, 2.4);
          const lower = es(t, 2.42, 2.5);
          armF = lerp(150, 60 + lift * 50, k) * (1 - lower) + lower * 40;
          armB = lerp(120, 30 + lift * 40, k) * (1 - lower) + lower * 30;
          lean = (lift * 22 + lower * 10) * (flip ? -1 : 1) * -1;
          head = 16 + lower * 8;
          walk = k > 0 && k < 1 ? x * 0.06 : undefined;
        }
        f.p.set({ x, y: y + (i < 2 ? -4 : 4), s: S_, flip: dig > 0 ? flip : true, walk, armF, armB, lean, head, blink: blinkAt(T, f.seed) });
      });
      // the bed they carry (outside); it is set down on the roof, then swapped for the one that goes through the hole
      const carryY = by - 118 * S_;
      const set = es(t, 2.04, 2.16);
      const swap = es(t, 2.4, 2.44);
      pose(bedOut, { x: bx, y: lerp(carryY, ROOFY - 10, set), s: S_ / 0.64 * 0.8, o: 1 - swap });
      const lowerK = es(t, 2.44, 2.72, ease.sine);
      const inY = lerp(HS.ROOF - 10, BED.y, lowerK);
      const bedX = lerp(HS.HOLE1 + 150, BED.x, es(t, 2.4, 2.46));
      pose(bedIn, { x: BED.x, y: inY, s: 0.8, o: swap });
      ropes.forEach((r, i) => {
        const [hx, hy] = hand(AT_HOLE[i], ROOFY, S_, AT_HOLE[i] > (HS.HOLE0 + HS.HOLE1) / 2, 40, (i % 2 ? 1 : -1) * 10);
        const ax = BED.x + (i % 2 ? 1 : -1) * (MATW * 0.4 - (i < 2 ? 0 : 22)), ay = inY - 4;
        const dx = hx - ax, dy = hy - ay, L = Math.hypot(dx, dy);
        pose(r, { x: ax, y: ay, r: (Math.atan2(dx, -dy) * 180) / PI, sy: L / 100, o: swap * (1 - es(t, 2.88, 2.96)) });
      });
      void bedX;

      /* the tiles come off one by one, then the laths; dust falls into the room, light comes in */
      H.tiles.forEach((tl) => {
        const k = es(t, 2.1 + tl.i * 0.035, 2.24 + tl.i * 0.035);
        const side = tl.x < (HS.HOLE0 + HS.HOLE1) / 2 ? -1 : 1;
        const tx = side < 0 ? HS.HOLE0 - 120 - tl.i * 10 : HS.HOLE1 + 170 + tl.i * 6, ty = ROOFY - 6 - (tl.i % 2) * 8;
        pose(tl.el, { x: lerp(tl.x, tx, k), y: lerp(tl.y, ty, k) - Math.sin(k * PI) * 40, r: k * (side * 20 + tl.i * 7), s: 1 - k * 0.1 });
      });
      H.laths.forEach((l) => {
        const k = es(t, 2.26 + l.i * 0.04, 2.4 + l.i * 0.04);
        const side = l.i === 0 ? -1 : 1;
        pose(l.el, { x: lerp(l.x, side < 0 ? HS.HOLE0 - 160 : HS.HOLE1 + 230 + l.i * 40, k), y: lerp(l.y, ROOFY - 10, k) - Math.sin(k * PI) * 30, r: k * side * 8, s: 1 - k * 0.3, o: 1 });
      });
      pose(shaft, { o: es(t, 2.3, 2.5) * 0.6 });
      dustOut.forEach((d, i) => { const k = seg(t, 2.12 + i * 0.07, 2.4 + i * 0.07); pose(d, { x: HS.HOLE0 + 20 + i * 50, y: ROOFY - 16 - k * 40, s: 0.6 + k * 1.2, o: bump(t, 2.12 + i * 0.07, 2.4 + i * 0.07) * 0.9 }); });
      dustIn.forEach((d) => { const k = seg(t, 2.2 + d.i * 0.05, 2.6 + d.i * 0.05); pose(d.el, { x: d.x, y: HS.CEIL + 10 + k * 140, s: 0.5 + k, o: bump(t, 2.2 + d.i * 0.05, 2.6 + d.i * 0.05) * 0.8 }); });

      /* no way in at the door — then the idea: the roof */
      const qk = es(t, 0.78, 0.92, ease.back) * (1 - es(t, 1.02, 1.08));
      pose(noWay, { x: 1560, y: HS.STREET - 150, s: qk * 0.9, o: qk > 0.01 ? 1 : 0 });
      const ik = es(t, 1.02, 1.1, ease.back) * (1 - es(t, 1.2, 1.26));
      pose(idea, { x: 1640, y: HS.STREET - 160, s: ik * 0.9, o: ik > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 1300], [0.7, 1260], [1.05, 1220], [1.6, 900], [1.9, 500], [2.05, 120], [2.5, 40], [3, 0]]);
      S.cam.y = kf(t, [[0, 40], [1.05, 20], [1.6, -220], [2.0, -200], [2.3, -120], [2.6, -20], [3, 0]]);
      S.cam.z = kf(t, [[0, 1.08], [1.05, 1.06], [1.6, 1.02], [2.05, 1.0], [2.6, 1.0], [3, 1.02]]);
    };
  },
};
