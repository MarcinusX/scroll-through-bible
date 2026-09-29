// Mt 11,1 — the curtains open on a green hillside in Galilee: Jesus stands in the middle of the Twelve, seated round
// Him on the grass, finishing His instructions (the discourse of chapter 10). He lifts His hand over them; they rise
// and set off two by two, down the roads to the left and right. He Himself walks on to the little walled town on the
// hill to the right; people come out of its gate and gather round, and He begins to teach and proclaim.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import { house } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hillsSet, TWELVE, pose3, throng, headAt, voiceRings, kf, moving, PI } from './lib.js';

const GY = 712;
const JX0 = 760, JX1 = 1010;            // Jesus among the Twelve → at the town gate
const GATE = 1250;

/** a little walled hill town with its gate (origin: the gate's foot) */
function hillTown(c) {
  const s = sheet();
  s.p(c.cut([[-420, 40], [-360, -20], [-200, -60], [0, -74], [200, -60], [340, -10], [420, 40]], 1.2, 12), mix(C.hillNear, C.sand, 0.25));
  let hs = '';
  [[-190, 64, 58], [-120, 54, 74], [-46, 62, 52], [60, 56, 66], [130, 64, 50], [196, 50, 60]].forEach(([x, w, h], i) => { hs += house(c, x, -84 + (i % 2) * 6, w, h, { wall: i % 2 ? C.plaster2 : C.plaster, stairs: false }); });
  s.raw(hs);
  const w = sheet();
  w.p(c.cut([[-250, 0], [-250, -86], [-40, -92], [-40, -118], [40, -118], [40, -92], [250, -86], [250, 0], [40, 0], [40, -58], ...c.arc(0, -58, 40, 34, 2 * PI, PI, 10), [-40, -58], [-40, 0]], 0.8, 10), C.stone);
  let cren = '';
  for (let x = -248; x < 244; x += 22) if (Math.abs(x) > 50) cren += c.cut(c.rect(x, -98, 12, 14), 0.3, 4);
  for (let x = -44; x < 40; x += 20) cren += c.cut(c.rect(x, -130, 12, 14), 0.3, 4);
  w.p(cren, C.stone);
  let bl = '';
  for (let y = -80; y < -4; y += 20) for (let x = -244 + (Math.round(y / 20) % 2) * 18; x < 240; x += 36) if (Math.abs(x + 15) > 58) bl += c.cut(c.rect(x, y, 30, 16), 0.4, 6);
  w.x(bl, shade(C.stone, -0.06), 'opacity=".6"');
  w.p(c.cut([[-36, 0], [-36, -58], ...c.arc(0, -58, 36, 30, PI, 2 * PI, 10), [36, 0]], 0.4, 6), mix(C.soilDark, C.wood2, 0.4));
  return s.out() + w.out();
}

export default {
  id: 'mt11-towns',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [0, 420], y: [-10, 40], z: [1, 1.14] },
  build(S) {
    const H = hillsSet(S, { gy: GY - 12, midY: 520 });
    const c = H.c;
    const P = 0.5;

    /* the town on the right */
    const townL = S.layer({ par: 0.44, sh: 4 });
    townL.add(`<g transform="translate(${GATE} ${GY - 36})">${hillTown(c)}</g>`);

    /* the Twelve: seated in a ring (one sprite), then six walking pairs */
    const L = S.layer({ par: P, sh: 4 });
    const SEAT = [-300, -240, -175, -112, 112, 175, 240, 300, -60, 60];
    const seatedM = TWELVE.map((m, i) => {
      const back = i >= 8;
      const dx = back ? [-220, -140, 140, 220][i - 8] : SEAT[i];
      return { x: dx, y: -(back ? 34 : 0), s: back ? 0.72 : 0.8, flip: dx > 0, head: dx > 0 ? 4 : -4, armF: 14 + (i % 3) * 8, o: { ...m.o, pose: 'sit' } };
    });
    const seated = L.sprite(pose3(c, seatedM), JX0, GY);
    const PAIRS = [[0, 3], [1, 2], [4, 5], [6, 7], [8, 9], [10, 11]];
    const pairs = PAIRS.map(([a, b], i) => {
      const left = i % 2 === 0;
      const mem = [a, b].map((k, j) => ({ x: (j - 0.5) * 46, y: j * 6, s: 0.8, flip: left, armF: 20 + j * 10, o: TWELVE[k].o }));
      const x0 = JX0 + (left ? -1 : 1) * (110 + Math.floor(i / 2) * 90);
      return { i, left, x0, y: GY - 20 + (i % 3) * 10, sp: L.sprite(pose3(c, mem), 800, 600), d: i * 0.05 };
    });

    /* the town's people who come out to Him */
    const folkL = S.layer({ par: 0.44, sh: 4 });
    const G1 = folkL.sprite(throng(makeCutter('mt11-t-f1'), 5, { s: 0.7, flip: true, rows: 2, spread: 40 }), 800, 600);
    const G2 = folkL.sprite(throng(makeCutter('mt11-t-f2'), 4, { s: 0.74, flip: true, rows: 1, spread: 44 }), 800, 600);

    /* Jesus */
    const act = S.layer({ par: P, sh: 5 });
    const glow = act.add(`<circle r="160" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      H.update(T);
      cur.set(es(t, 0.05, 0.85), T);

      /* cover — He finishes instructing the Twelve */
      const teach = es(t, 0.3, 0.6) * (1 - es(t, 1.0, 1.1));
      const bless = bump(t, 1.0, 1.3);
      const JK = [[1.18, JX0], [1.55, JX1]];
      const jx = kf(t, JK, (u) => u);
      const walking = moving(t, JK);
      const speak = es(t, 1.58, 1.7);
      jesus.set({
        x: jx, y: GY, s: 1.04, walk: walking ? jx * 0.05 : undefined,
        armF: 20 + teach * 40 + bless * 20 + speak * 44 + (T ? Math.sin(T * 1.4) * 4 * teach : 0), armB: 10 + teach * 60 + bless * 130 + speak * 30,
        head: -teach * 4 - bless * 6, blink: blinkAt(T),
      });
      pose(glow, { x: jx, y: GY - 110, s: 1, o: 0.25 + bless * 0.5 + speak * 0.3 });
      const [hx, hy] = headAt(jx, GY, 1.04);
      voice(hx, hy, teach * 0.8 + speak, T, { dir: 1, spread: 2.2 });

      /* v1 — the Twelve rise and go two by two */
      const rise = es(t, 1.08, 1.14);
      seated.set({ x: JX0, y: GY, o: 1 - rise });
      pairs.forEach((p) => {
        const go = es(t, 1.14 + p.d, 1.62 + p.d, (u) => u);
        const x = p.x0 + (p.left ? -1 : 1) * go * 900;
        const bob = go > 0 && go < 1 ? Math.abs(Math.sin(x * 0.05)) * 3 : 0;
        p.sp.set({ x, y: p.y - bob, s: 1, o: rise * (1 - seg(go, 0.85, 1)) });
      });

      /* the townspeople come out of the gate */
      const come1 = es(t, 1.36, 1.66), come2 = es(t, 1.42, 1.7);
      G1.set({ x: lerp(GATE, JX1 + 190, come1), y: GY - 30 - Math.abs(Math.sin(come1 * 9)) * 3 * (come1 < 1), s: 1, o: seg(t, 1.3, 1.36) });
      G2.set({ x: lerp(GATE + 20, JX1 + 290, come2), y: GY - 4 - Math.abs(Math.sin(come2 * 9)) * 3 * (come2 < 1), s: 1, o: seg(t, 1.36, 1.42) });

      /* camera: follow Him to the town */
      const pan = es(t, 1.14, 1.62);
      S.cam.x = pan * 400;
      S.cam.z = 1.04 + es(t, 0.3, 0.9) * 0.04 + es(t, 1.55, 1.8) * 0.04;
      S.cam.y = 10 + pan * 20;
    };
  },
};
