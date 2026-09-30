// Łk 10,5–6 — a village lane in the morning. The two sent ones come barefoot up the lane and stop at the first door.
// "Whatever house you enter, first say: Peace to this house!" — the elder lifts his hand, and the peace goes out of
// it as a small warm light with an olive sprig in it; it floats to the door, the door opens and the room inside
// lights up. "If a son of peace is there, your peace will rest on him": the master of the house steps out, the light
// comes down and rests on him — a glow blooms round him, he opens his arms, and his wife smiles in the doorway. "If not,
// it will return to you": up the lane another pair greets another door; it opens a crack, a sour face looks out, and
// the door slams — the light bounces off it and comes back into the hands of the one who gave it.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { laneSet, doorHouse, barefoot, peaceOrb, glow, bubble, sparkle, kf, moving, handAt, headAt, tr, DAY, SENT_A, SENT_B, SENT_C, SENT_D, HOST, HOSTWIFE, SURLY, es, ease, bump, seg, PI } from './lib.js';

const GY = 716, BASE = 710;
const AX = 670, BX = 750;          // the pair at the first door
const CX = 1350, DX = 1430;        // the other pair at the second door

export default {
  id: 'lk10-peace',
  beats: [
    { v: 5 },
    { v: 6, text: 'Jeśli tam mieszka człowiek godny pokoju, wasz pokój spocznie na nim;' },
    { v: 6, cont: true, text: 'jeśli nie, powróci do was.' },
  ],
  cam: { x: [-40, 900], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const V = laneSet(S, { skyCols: DAY, GY });
    const c = S.c;

    /* the two houses */
    const HL = S.layer({ par: 0.45, sh: 4 });
    const HG = S.layer({ par: 0.45, sh: 1, flat: true });
    const D = S.layer({ par: 0.45, sh: 4 });
    const LF = S.layer({ par: 0.45, sh: 4 });
    const H1 = doorHouse(S, HL, LF, c, { x0: 420, base: BASE, w: 270, h: 280, wall: mix(C.plaster, C.peach, 0.18), dw: 84, dh: 186 });
    const H2 = doorHouse(S, HL, LF, c, { x0: 1040, base: BASE, w: 260, h: 268, wall: mix(C.plaster2, C.stone2, 0.45), dw: 84, dh: 186 });
    HL.add(`<g transform="translate(340 ${BASE})">${sheet().p(c.ribbon([[0, 0], [-4, -120], [16, -170]], 12), C.wood2).p(c.cut(c.blob(10, -190, 80, 56, 14, 0.2), 1, 6) + c.cut(c.blob(-30, -160, 50, 36, 10, 0.2), 1, 5), C.leaf).out()}</g>`);

    /* the people in the doorways */
    const restGlow = HG.add(`<g><circle r="96" fill="${C.halo}" opacity=".55"/>${glow(170, 1)}</g>`);
    const wife = S.puppet(D.add(person(c, HOSTWIFE)));
    const host = S.puppet(D.add(person(c, HOST)));
    const surly = S.puppet(D.add(person(c, SURLY)));

    /* the pairs in the lane (barefoot) */
    const P = S.layer({ par: 0.5, sh: 5 });
    const mk = (o) => S.puppet(P.add(barefoot(person(c, o), o.skin)));
    const A = mk(SENT_A), B = mk(SENT_B), Cc = mk(SENT_C), Dd = mk(SENT_D);

    /* the peace, the greeting, the slam */
    const W = S.layer({ par: 0.52, sh: 4 });
    const orb1 = W.add(`<g>${peaceOrb(c, 20)}</g>`);
    const orb2 = W.add(`<g>${peaceOrb(c, 20)}</g>`);
    const say1 = W.add(`<g>${bubble(c, tr('Pokój temu domowi!', 'Peace to this house!'), { size: 19, tail: -1 })}</g>`);
    const say2 = W.add(`<g>${bubble(c, tr('Pokój temu domowi!', 'Peace to this house!'), { size: 19, tail: -1 })}</g>`);
    const bang = W.add(`<g>${[0, 1, 2, 3, 4].map((i) => `<path d="${c.ribbon([[0, 0], [30, 0]], 4)}" fill="${C.terracotta}" transform="rotate(${-60 + i * 30}) translate(22 0)"/>`).join('')}</g>`);
    const twinkle = [0, 1].map(() => W.add(`<g>${sparkle(c, 14)}</g>`));

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v5 — the pair come up the lane to the first door; "Peace to this house!" */
      const inK = [[0, -160], [0.3, 0]];
      const dx = kf(t, inK);
      const walking = moving(t, inK);
      const greet = es(t, 0.3, 0.42) * (1 - es(t, 0.9, 1.05));
      const bow = bump(t, 1.5, 1.95);
      A.set({ x: AX + dx, y: GY, s: 0.98, flip: !walking, walk: walking ? dx * 0.05 : undefined, armF: 14 + greet * 76 + bow * 50, armB: 10 + greet * 40, head: -greet * 4 + bow * 10, blink: blinkAt(T, 2) });
      B.set({ x: BX + dx, y: GY + 4, s: 0.95, flip: !walking, walk: walking ? dx * 0.05 + 1 : undefined, armF: 14 + bow * 50, armB: 10, head: bow * 10, blink: blinkAt(T, 3) });
      pose(say1, { x: AX - 40, y: GY - 206, s: es(t, 0.34, 0.44, ease.back) * (1 - es(t, 0.9, 1.0)), o: seg(t, 0.34, 0.36) * (1 - seg(t, 0.95, 1.0)) });
      const [ahx, ahy] = handAt(AX, GY, 0.98, true, 90);
      const [dcx, dcy] = [H1.door[0] + H1.door[1] / 2, BASE - 90];
      const fly1 = es(t, 0.45, 0.72);
      const [hx, hy] = headAt(560, GY, 1.0, false);
      const rest = es(t, 1.12, 1.45);
      const o1x = rest > 0 ? lerp(dcx, hx + 6, rest) : lerp(ahx - 8, dcx, fly1);
      const o1y = rest > 0 ? lerp(dcy, hy - 40, rest) - Math.sin(rest * PI) * 50 : lerp(ahy - 20, dcy, fly1) - Math.sin(fly1 * PI) * 40;
      pose(orb1, { x: o1x, y: o1y, s: es(t, 0.36, 0.46) * (1 - rest * 0.3) + (T ? Math.sin(T * 3) * 0.03 : 0), o: seg(t, 0.36, 0.4) });
      const open1 = es(t, 0.62, 0.86);
      H1.open(open1);
      H1.lit(es(t, 0.66, 0.9));

      /* v6a — the son of peace steps out; the peace rests on him */
      const out = es(t, 1.0, 1.14);
      const welcome = es(t, 1.45, 1.65);
      host.set({ x: lerp(H1.door[0] + 40, 560, out), y: GY - 2, s: 1.0, flip: false, o: seg(t, 0.98, 1.02), armF: 20 + welcome * 70, armB: 14 + welcome * 100, head: -welcome * 6, blink: blinkAt(T, 4) });
      pose(restGlow, { x: hx, y: hy + 50, s: 0.6 + rest * 0.6, o: rest * 0.95 });
      wife.set({ x: H1.door[0] + 36, y: GY - 6, s: 0.92, flip: false, o: es(t, 1.35, 1.45), armF: 30, armB: 10, head: -4, blink: blinkAt(T, 6) });
      twinkle.forEach((tw, i) => { const k = bump(t, 1.4 + i * 0.12, 1.8 + i * 0.12); pose(tw, { x: hx + (i ? 40 : -34), y: hy - 30 - i * 20, s: k, r: T * 40, o: k }); });

      /* v6b — the other pair, the other door: it slams; the peace comes back to them */
      const in2 = [[2.0, 260], [2.2, 0]];
      const d2 = kf(t, in2);
      const w2 = moving(t, in2);
      const greet2 = es(t, 2.2, 2.3);
      const catchK = es(t, 2.62, 2.8);
      Cc.set({ x: CX + d2, y: GY, s: 0.98, flip: true, walk: w2 ? d2 * 0.05 : undefined, armF: 14 + greet2 * 76 * (1 - catchK) + catchK * 36, armB: 10 + greet2 * 40 * (1 - catchK) + catchK * 40, head: -greet2 * 4 + catchK * 8, blink: blinkAt(T, 7) });
      Dd.set({ x: DX + d2, y: GY + 4, s: 0.95, flip: true, walk: w2 ? d2 * 0.05 + 1 : undefined, armF: 14, armB: 10, head: catchK * 6, blink: blinkAt(T, 8) });
      pose(say2, { x: CX - 40, y: GY - 206, s: es(t, 2.22, 2.3, ease.back) * (1 - es(t, 2.45, 2.52)), o: seg(t, 2.22, 2.24) * (1 - seg(t, 2.5, 2.52)) });
      const [chx, chy] = handAt(CX, GY, 0.98, true, 90);
      const [chx2, chy2] = handAt(CX, GY, 0.98, true, 50);
      const [d2x, d2y] = [H2.door[0] + H2.door[1] / 2, BASE - 90];
      const fly2 = es(t, 2.28, 2.46);
      const back2 = es(t, 2.52, 2.78);
      const o2x = back2 > 0 ? lerp(d2x + 30, chx2 - 4, back2) : lerp(chx - 8, d2x + 10, fly2);
      const o2y = back2 > 0 ? lerp(d2y, chy2 - 12, back2) - Math.sin(back2 * PI) * 130 : lerp(chy - 20, d2y, fly2) - Math.sin(fly2 * PI) * 40;
      pose(orb2, { x: o2x, y: o2y, s: es(t, 2.24, 2.3) * (1 - catchK * 0.2), o: seg(t, 2.24, 2.27) });
      const crack = es(t, 2.34, 2.42) * (1 - es(t, 2.5, 2.54, ease.in));
      H2.open(crack * 0.42);
      surly.set({ x: H2.door[0] + 36, y: GY - 4, s: 0.98, flip: false, o: crack > 0.05 ? 1 : 0, armF: 40, armB: 10, head: 8, blink: 0 });
      const bk = bump(t, 2.52, 2.66);
      pose(bang, { x: H2.door[0] + H2.door[1] + 20, y: BASE - 110, s: 0.6 + bk * 0.6, o: bk });

      S.cam.x = kf(t, [[0, 0], [1.0, -20], [1.9, -20], [2.2, 880], [3, 880]], ease.sine);
      S.cam.y = kf(t, [[0, 30], [1, 20], [2, 20], [3, 20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.1], [1.9, 1.1], [2.2, 1.06], [3, 1.08]]);
    };
  },
};
