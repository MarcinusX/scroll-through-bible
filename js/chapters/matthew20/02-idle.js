// Mt 20,3–5 — the third hour: the sun has climbed and the hour slip under it says so. The first labourers are at
// work among the vines. The householder comes out of the gate again and sees three men standing idle in the market:
// one sits on the rim of the well, one leans with folded arms, one yawns. "You go into my vineyard too, and whatever
// is right I will give you." They go. Then the sun moves on to the sixth hour, and to the ninth, and each time two
// more men are waiting by the well; he beckons, and they go in at the gate.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vineWorld, VW, SLOTS, SKY, OWNER, THIRD, MIDDAY, crew, worker, workPose, kf, moving, kfXY, movingXY, say, tr } from './lib.js';

const OX = 836;                                    // where the householder stands, by the gate
const IDLE3 = [[612, 700, 'sit'], [526, 706, 'stand'], [694, 694, 'stand']];
const IDLE_M = [[566, 704], [650, 696], [584, 700], [668, 708]];

export default {
  id: 'mt20-idle',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [0, 140], y: [0, 20], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const W = vineWorld(S, { sky: SKY.morning, sky2: SKY.afternoon, tags: [3, 6, 9] });

    const P = S.layer({ par: 0.5, sh: 5 });
    const inside = crew(S, P, c, ['first']);
    // the idle men of the third hour: the one on the well rim is a sitting cut-out that swaps for a standing one
    const third = THIRD.map((o, i) => ({ i, p: S.puppet(P.add(worker(c, o, i === 1 ? 'basket' : ''))), sit: i === 0 ? S.puppet(P.add(person(c, { ...o, pose: 'sit' }))) : null, seed: c.rr(0, 9), at: IDLE3[i], sl: SLOTS.third[i] }));
    const mid = MIDDAY.map((o, i) => ({ i, p: S.puppet(P.add(worker(c, o, i % 2 ? 'basket' : ''))), seed: c.rr(0, 9), at: IDLE_M[i], sl: SLOTS.midday[i] }));
    const owner = S.puppet(P.add(person(c, OWNER)));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const call = fx.add(`<g>${say(c, tr(['Idźcie i wy do mojej winnicy,', 'a co będzie słuszne, dam wam!'], ['You also go into the vineyard,', 'and whatever is right I will give you.']), { size: 18, side: -1 })}</g>`);
    const beck = [0, 1].map(() => fx.add(`<g>${say(c, tr('Idźcie i wy!', 'You also go!'), { size: 18, side: -1 })}</g>`));

    W.front();

    // the hours: the third through the first two beats, then the sixth and the ninth within verse 5
    const H6 = 2.26, H9 = 2.56;

    return (t, time) => {
      const T = time;
      const h = lerp(2.4, 3, es(t, 0, 0.6)) + es(t, H6 - 0.12, H6 + 0.04) * 3 + es(t, H9 - 0.12, H9 + 0.04) * 3;
      const tag = t < H6 - 0.04 ? 3 : t < H9 - 0.04 ? 6 : 9;
      const tagIn = tag === 3 ? es(t, 0.1, 0.35, ease.out) : tag === 6 ? es(t, H6 - 0.02, H6 + 0.08, ease.out) : es(t, H9 - 0.02, H9 + 0.08, ease.out);
      W.update(t, T, { h, tag, tagO: tagIn });
      W.sk2L.fade(es(t, H6 - 0.1, H9 + 0.1));

      /* the first labourers at work (a new stoop each hour) */
      inside.forEach((m) => {
        const wp = workPose(m.wi + Math.floor(h / 3), 1);
        m.p.set({ x: m.x, y: m.y, s: m.s, ...wp, blink: blinkAt(T, m.seed) });
      });

      /* v3 — he comes out of the gate and walks to the market; sees the idle men */
      const OK = [[0.05, 1010], [0.25, 935], [0.62, OX]];
      const ox = kf(t, OK, (u) => u);
      const walkO = moving(t, OK, 0.2);
      const speak = es(t, 1.04, 1.2) * (1 - es(t, 1.9, 2.02));
      const wave = Math.max(bump(t, 2.02, 2.24), bump(t, H6 + 0.02, H6 + 0.2), bump(t, H9 + 0.02, H9 + 0.22));
      const see = es(t, 0.6, 0.72);
      owner.set({
        x: ox, y: VW.G + 4, s: 0.98, flip: t > 0.2 && wave < 0.3, walk: walkO ? ox * 0.05 : undefined,
        armF: 12 + see * 20 * (1 - speak) + speak * 64 + wave * 80, armB: speak * 30, head: -see * 3, blink: blinkAt(T),
      });
      const ck = es(t, 1.06, 1.22, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(call, { x: OX - 36, y: VW.G - 216, s: ck, o: ck > 0.02 ? 1 : 0 });
      [H6, H9].forEach((hh, j) => {
        const k = es(t, hh + 0.02, hh + 0.08, ease.back) * (1 - es(t, hh + 0.2, hh + 0.24));
        pose(beck[j], { x: OX - 36, y: VW.G - 214, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* the idle men of the third hour; v5a — they go */
      third.forEach((m) => {
        const go0 = 2.02 + m.i * 0.04;
        const [ax, ay, P0] = m.at;
        const keys = [[go0, [ax, ay]], [go0 + 0.12, [930, VW.G + 2]], [go0 + 0.24, m.sl]];
        const [x, y] = kfXY(t, keys);
        const walking = movingXY(t, keys);
        const inV = t > go0 + 0.24;
        const hear = es(t, 1.08, 1.3);
        const idle = 1 - hear;
        const wp = workPose(5 + m.i + Math.floor(h / 3), es(t, go0 + 0.24, go0 + 0.3));
        const standUp = m.sit ? es(t, 1.3, 1.36) : 1;
        if (m.sit) m.sit.set({ x: ax, y: ay, s: 0.94, flip: false, o: 1 - standUp, armF: 30, armB: 10, head: 8 - hear * 10, blink: blinkAt(T, m.seed) });
        m.p.set({
          x, y, s: inV ? lerp(0.94, 0.8, 1) : lerp(0.94, 0.8, es(t, go0 + 0.12, go0 + 0.24)), o: standUp, flip: walking ? false : inV ? wp.flip : m.i === 2 && t < 0.75,
          walk: walking ? x * 0.05 + m.i : undefined,
          lean: inV ? wp.lean : m.i === 1 ? -4 * idle : 0,
          armF: inV ? wp.armF : m.i === 1 ? 44 * idle + hear * 20 : m.i === 2 ? 10 + hear * 30 : 16,
          armB: inV ? wp.armB : m.i === 1 ? 40 * idle : m.i === 2 ? 150 * bump(t, 0.3, 0.95) : 0,
          head: inV ? wp.head : m.i === 2 ? -12 * bump(t, 0.3, 0.95) - hear * 4 : -hear * 4 + idle * 6, blink: blinkAt(T, m.seed),
        });
      });

      /* the sixth and the ninth hour: two more men each time by the well, and in they go */
      mid.forEach((m) => {
        const hh = m.i < 2 ? H6 : H9;
        const appear = es(t, hh - 0.1, hh - 0.02);
        const go0 = hh + 0.12 + (m.i % 2) * 0.03;
        const keys = [[go0, m.at], [go0 + 0.1, [930, VW.G + 2]], [go0 + 0.2, m.sl]];
        const [x, y] = kfXY(t, keys);
        const walking = movingXY(t, keys);
        const inV = t > go0 + 0.2;
        const wp = workPose(8 + m.i + Math.floor(h / 3), es(t, go0 + 0.2, go0 + 0.26));
        m.p.set({
          x, y, s: lerp(0.94, m.sl[1] > 680 ? 0.86 : 0.8, es(t, go0 + 0.1, go0 + 0.2)), o: appear, flip: walking ? false : inV ? wp.flip : m.i % 2 === 1,
          walk: walking ? x * 0.05 + m.i : undefined, lean: inV ? wp.lean : 0,
          armF: inV ? wp.armF : 14 + bump(t, hh, hh + 0.14) * 30, armB: inV ? wp.armB : 0, head: inV ? wp.head : 4, blink: blinkAt(T, m.seed),
        });
      });

      S.cam.x = lerp(40, 10, es(t, 0.2, 0.8)) + es(t, 2.0, 2.6) * 110;
      S.cam.z = 1 + es(t, 0.6, 1.2) * 0.05 * (1 - es(t, 2.0, 2.4));
      S.cam.y = 10;
    };
  },
};
