// Łk 19,39–40 — still on the way down, the city across the valley. Out of the rejoicing crowd step two Pharisees in
// their blue-bordered mantles, frowning, hands raised: "Teacher, rebuke your disciples!" He answers them: "I tell you,
// if these were silent, the stones would cry out." For a moment the disciples lower their arms and fall still — and
// the stones along the roadside wake: one after another they get little eyes and round singing mouths, a warm light
// behind each, and rings of voice go up from them.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { olivetSet, OV, TWELVE, still, folk, colt, coltRig, saddleCloaks, riderLeg, pharisee, say, voiceRings, headAt, hand, kf, tr, es, ease, bump, seg, PI, PRAISE, mix, shade, sheet } from './lib.js';
import { rock } from '../../assets/nature.js';

const RY = (x) => 648 + (x - 200) * 0.05;
const CX = 880;
const STONES = [[290, 730, 96, 56], [430, 756, 62, 36], [1290, 752, 66, 38], [1430, 728, 100, 58], [590, 774, 52, 30], [1140, 776, 54, 30]];

export default {
  id: 'lk19-stones',
  beats: [
    { v: 39 },
    { v: 40 },
  ],
  cam: { x: [-40, 120], y: [-40, 90], z: [1, 1.2] },
  build(S) {
    const O = olivetSet(S, { skyCols: PRAISE, cityX: 1060, cityY: 500, cityS: 0.62, sunAt: [1300, 130], slopeY: 590, seed: 'lk19-olivet-c', grove2: false, road: [[-1400, RY(-1400)], [0, RY(0)], [800, RY(800)], [1600, RY(1600)], [3000, RY(3000)]] });
    const c = S.c;
    const A = O.act;
    const mk = (up) => still(c, Array.from({ length: 12 }, (_, i) => ({ x: i * 64 - 380, y: RY(420 + i * 64) - RY(420) - 30 + (i % 2) * 6, s: 0.74, flip: i > 6, armB: up ? 140 + (i % 3) * 10 : 10, armF: up ? 40 + (i % 2) * 60 : 20, head: up ? -6 : 6, o: folk(makeFolkCutter(i)) })));
    const farUp = A.sprite(mk(true), 800, RY(420));
    const farDown = A.sprite(mk(false), 800, RY(420));
    const disUp = A.sprite(still(c, [0, 2, 3, 1, 4].map((k, i) => ({ x: (i < 3 ? -i * 58 - 150 : 150 + (i - 3) * 62), y: 0, s: 0.9, flip: i >= 3, armB: 150, armF: 60, head: -6, o: TWELVE[k].o }))), CX, RY(CX) + 10);
    const disDown = A.sprite(still(c, [0, 2, 3, 1, 4].map((k, i) => ({ x: (i < 3 ? -i * 58 - 150 : 150 + (i - 3) * 62), y: 0, s: 0.9, flip: i >= 3, armB: 10, armF: 20, head: 8, o: TWELVE[k].o }))), CX, RY(CX) + 10);
    const rider = person(c, { ...CAST.jesus, pose: 'sit' });
    const coltEl = A.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]), rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${rider}</g>${riderLeg(c)}` }));
    const cR = coltRig(coltEl);
    const jRide = S.puppet(coltEl.querySelector('[data-k="rider"]').firstElementChild);
    const phar = [0, 1].map((i) => ({ i, p: S.puppet(A.add(person(c, pharisee(c, i)))) }));
    /* the roadside stones, and their waking faces */
    const stL = S.layer({ par: 0.55, sh: 4 });
    const glows = STONES.map(([x, y, w, h]) => stL.add(`<g opacity="0"><ellipse rx="${w * 1.2}" ry="${h * 1.0}" fill="url(#warm-glow)"/></g>`));
    STONES.forEach(([x, y, w, h]) => stL.add(rock(c, x, y, w, h, mix(C.rock, C.stone2, 0.3))));
    const faces = STONES.map(([x, y, w, h]) => stL.add(`<g>${stoneFace(c, Math.min(w, h * 1.6) / 50)}</g>`));
    const fx = S.layer({ par: 0.55, sh: 6 });
    const notes = STONES.map(() => [0, 1, 2].map(() => fx.add(`<g>${noteGlyph(c)}</g>`)));
    const say1 = O.fx.add(`<g>${say(c, tr(['Nauczycielu, zabroń', 'tego swoim uczniom!'], ['Teacher,', 'rebuke your disciples!']), { size: 19, side: 1 })}</g>`);
    const say2 = O.fx.add(`<g>${say(c, tr(['Jeśli ci umilkną,', 'kamienie wołać będą!'], ['If these were silent,', 'the stones would cry out!']), { size: 19, side: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      O.update(T, { glow: 0.6 });
      /* v39 — some Pharisees: "Teacher, rebuke your disciples!" */
      const quiet = es(t, 1.2, 1.35) * (1 - es(t, 1.85, 2.0));
      farUp.set({ x: 800, y: RY(420), o: 1 - quiet });
      farDown.set({ x: 800, y: RY(420), o: quiet });
      disUp.set({ x: CX, y: RY(CX) + 10, o: 1 - quiet });
      disDown.set({ x: CX, y: RY(CX) + 10, o: quiet });
      cR.set({ x: CX, y: RY(CX) + 6, s: 1.0, r: 3, nod: T ? Math.sin(T * 0.8) * 2 : 0, ear: T ? Math.sin(T * 1.3) * 6 : 0, tail: T ? Math.sin(T * 1.7) * 6 : 0 });
      const ans = es(t, 1.05, 1.25);
      jRide.set({ x: 0, y: 0, s: 1, flip: false, armF: 30 + ans * 50, armB: 20 + es(t, 1.4, 1.6) * 60, head: -2 + ans * 4, blink: blinkAt(T) });
      phar.forEach((m) => {
        const k = es(t, -0.2 + m.i * 0.08, 0.35 + m.i * 0.08);
        const x = lerp(1500 + m.i * 60, 1080 + m.i * 64, k);
        const angry = es(t, 0.3, 0.45) * (1 - es(t, 1.6, 1.9) * 0.5);
        m.p.set({ x, y: RY(x) + 16 - m.i * 6, s: 0.94, flip: true, walk: k > 0 && k < 1 ? x * 0.06 + m.i : undefined, armF: 20 + angry * (m.i ? 60 : 90), armB: angry * (m.i ? 130 : 30), head: 4, lean: -angry * 4, blink: blinkAt(T, m.i + 5) });
      });
      const [phx, phy] = headAt(1080, RY(1080) + 16, 0.94, true);
      const k1 = es(t, 0.35, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(say1, { x: phx + 10, y: phy - 26, s: k1, o: k1 > 0.02 ? 1 : 0 });
      /* v40 — "if these are silent, the stones will cry out" */
      const jhx = CX - 16 * 1 + 4, jhy = RY(CX) + 6 - 106 - 105 * 0.95;
      const k2 = es(t, 1.05, 1.2, ease.back) * (1 - es(t, 1.95, 2.02));
      pose(say2, { x: jhx + 20, y: jhy - 30, s: k2, o: k2 > 0.02 ? 1 : 0 });
      STONES.forEach(([x, y, w, h], i) => {
        const k = es(t, 1.35 + i * 0.05, 1.55 + i * 0.05, ease.back);
        pose(faces[i], { x, y: y - h * 0.55, s: k, o: k > 0.02 ? 1 : 0 });
        pose(glows[i], { x, y: y - h * 0.3, s: 0.9 + (T ? Math.sin(T * 2 + i) * 0.05 : 0), o: k * 0.9 });
        notes[i].forEach((n, j) => {
          const u = ((T ? T * 0.45 : 0.3) + j / 3 + i * 0.13) % 1;
          pose(n, { x: x + (j - 1) * 14 + Math.sin(u * 6 + i) * 8, y: y - h * 0.7 - u * 90, s: 0.8 + u * 0.4, r: (j - 1) * 12, o: k * Math.sin(u * PI) });
        });
      });

      S.cam.x = kf(t, [[-0.5, 40], [0.5, 60], [1.2, 40]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 10], [1.3, 80]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.5, 1.12], [1.3, 1.08]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 60], [0.5, 180], [1.3, 60]]); S.cam.z = 1.0; }
      void hand; void shade; void sheet; void PI; void seg; void bump; void OV;
    };
  },
};
import { makeCutter } from '../../core/paper.js';
const makeFolkCutter = (i) => makeCutter('lk19-stones-folk-' + i);
/** a little paper note of song (origin: the note head) */
function noteGlyph(c) {
  return sheet().p(c.cut(c.ell(0, 0, 6, 4.6, 10, -0.4), 0.2, 3) + c.ribbon([[5, -1], [6, -22]], 2) + c.ribbon([[6, -22], [14, -16]], 2.4), C.sunDeep).out();
}
/** a stone's waking face: two little eyes and a round singing mouth (origin: centre of the face); k scales it */
function stoneFace(c, k = 1) {
  const s = sheet();
  const ink = C.inkSoft;
  s.x(c.poly(c.ell(-10 * k, -4 * k, 2.6 * k, 3.2 * k, 8)) + c.poly(c.ell(10 * k, -4 * k, 2.6 * k, 3.2 * k, 8)), ink);
  s.x(c.poly(c.ell(0, 8 * k, 5 * k, 6 * k, 10)), mix(C.soilDark, C.curtain2, 0.3));
  s.x(c.poly(c.circ(-15 * k, 4 * k, 3.4 * k, 8)) + c.poly(c.circ(15 * k, 4 * k, 3.4 * k, 8)), C.blush, 'opacity=".5"');
  return s.out();
}
