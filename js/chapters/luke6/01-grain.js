// Łk 6,1–2 — the curtains open on the ripe grain on a Sabbath (the tag with its two candles hangs over the field).
// Jesus walks the path through the wheat with four disciples, the field sliding past; they pluck ears at the edge of
// the path and — Luke's own detail — rub them out in their hands: the husks blow away in a little cloud of chaff and
// the kernels are left in their palms, and they eat. Then some Pharisees come along the path from the other side,
// stop short and point at the disciples: "Why do you do what is not lawful on the Sabbath?"
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, flock } from '../kit.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { fieldSet, pluckStalk, FP, kf, moving, sabbathTag, bubble, phOpts, scribeOpts, handAt, headAt, tr, PI } from './lib.js';

const WALK = 460;
const DIS = [{ k: 'peter', x: 540 }, { k: 'andrew', x: 626 }, { k: 'john', x: 900 }, { k: 'james', x: 972 }];
const DIS_P = [{ k: 'peter', x: 548 }, { k: 'andrew', x: 630 }, { k: 'john', x: 884 }, { k: 'james', x: 944 }];   // phone

export default {
  id: 'lk6-grain',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-30, 80], y: [-20, 50], z: [1, 1.14] },
  build(S) {
    const F = fieldSet(S, { walk: WALK });
    const c = F.c;
    const tagL = S.layer({ par: 0.05, sh: 5 });
    const birds = flock(S, tagL, 4, (cc) => bird(cc, { color: C.bird }), { y: 270, speed: 40, scale: 0.5 });
    const tag = hanging(tagL, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 800, y: 150, len: 800 });

    /* ---------- on the path ---------- */
    const act = S.layer({ par: 0.6, sh: 5 });
    const D = (S.portrait ? DIS_P : DIS).map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    // the ears they pluck, at the edge of the path ahead of each disciple
    const STALKS = D.map((d, i) => ({ ...pluckStalk(act, c, 128 + (i % 2) * 8), x: d.x + (i < 2 ? 44 : -44), d }));
    // chaff blown off the rubbing hands, and the kernels left in the palm
    const chaff = [];
    D.forEach((d) => { for (let j = 0; j < 9; j++) chaff.push({ d, j, el: act.add(`<path d="${c.cut(c.ell(0, 0, c.rr(4, 7), c.rr(1.6, 2.6), 8, c.rr(0, 3)), 0.3, 2)}" fill="${C.cream}"/>`), dx: c.rr(20, 80) * (d.i >= 2 ? -1 : 1), dy: c.rr(-60, -10), ph: c.rr(0, 0.25) }); });
    const kernels = D.map(() => act.add(`<g>${[0, 1, 2, 3].map((k) => `<path d="${c.poly(c.ell(-6 + k * 4, -1 + (k % 2) * 2, 2.6, 1.6, 8, 0.4))}" fill="${C.wheat2}"/>`).join('')}</g>`));

    /* ---------- the Pharisees, coming along the path ---------- */
    const phL = S.layer({ par: 0.6, sh: 5 });
    // phone: the Pharisees stop closer together, inside the screen and clear of the thread
    const PH = [{ x: 1112, o: phOpts(0) }, { x: 1196, o: scribeOpts(1) }, { x: 1276, o: phOpts(2) }].map((m, i) => (S.portrait ? { ...m, x: 996 + i * 56 } : m)).map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(phL.add(person(c, m.o))) }));
    F.front();

    const fx = S.layer({ par: 0.62, sh: 4 });
    const why = fx.add(`<g opacity="0">${bubble(c, [tr('Czemu czynicie to,', 'Why do you do'), tr('czego nie wolno w szabat?', 'what is not lawful on the Sabbath?')], { size: 20, tail: 1 })}</g>`);

    const cur = curtains(S);
    const walkK = [[0.95, 0], [1.42, WALK]];

    return (t, time) => {
      const T = time;
      F.update(T);
      birds(T, 1);
      cur.set(es(t, 0.05, 0.85), T);
      pose(tag, { x: 800, y: 150, r: Math.sin(T * 0.9) * 1.6, oy: 0 });

      const shift = kf(t, walkK, (u) => u);
      const walking = moving(t, walkK);
      F.shift(shift);

      /* v2 — the Pharisees come along the path and stop short */
      const come = es(t, 1.98, 2.34);
      const point = es(t, 2.3, 2.45);
      PH.forEach((m) => {
        const x = m.x + (1 - come) * 420;
        m.p.set({ x, y: FP + (m.i % 2 ? -8 : 4), s: 0.94, flip: true, o: seg(t, 1.95, 2.02), walk: come > 0 && come < 1 ? x * 0.05 + m.i : undefined, armF: m.i === 0 ? 10 + point * 84 : 10 + point * 20, armB: m.i === 1 ? 10 + point * 60 : 8, head: m.i === 0 ? -point * 4 : 2, lean: m.i === 0 ? point * 3 : 0, blink: blinkAt(T, m.seed) });
      });
      const wk = es(t, 2.38, 2.55, ease.back);
      const [phx, phy] = headAt(PH[0].x, FP + 4, 0.94, true);
      pose(why, { x: phx - 60, y: phy - 36, s: wk, o: wk > 0.01 ? 1 : 0 });

      /* Jesus in the middle of them; at v2 He turns towards the Pharisees */
      const toPh = es(t, 2.45, 2.65);
      jesus.set({ x: 800, y: FP, s: 1.04, flip: bump(t, 1.5, 2.25) > 0.35, walk: walking ? shift * 0.05 : undefined, armF: 12 + toPh * 26, armB: 8 + toPh * 16, head: -2 + bump(t, 1.55, 2.2) * 5, blink: blinkAt(T) });

      /* v1 — they pluck the ears, rub them out in their hands, blow the chaff away and eat */
      D.forEach((d) => {
        const st = STALKS[d.i];
        const reach = es(t, 1.42 + d.i * 0.04, 1.54 + d.i * 0.04);
        const rub = es(t, 1.56 + d.i * 0.04, 1.6 + d.i * 0.04) * (1 - es(t, 1.9, 1.96));
        const eat = bump(t, 1.9 + d.i * 0.02, 2.12 + d.i * 0.02);
        const startle = es(t, 2.3, 2.45);
        const toStalk = st.x < d.x;
        const r2 = rub * (1 - startle);
        d.p.set({
          x: d.x - (d.i >= 2 ? startle * 26 : 0), y: FP + (d.i % 2 ? 6 : -4), s: 0.95, flip: reach > 0 && reach < 1 ? toStalk : startle > 0.5 ? false : d.i >= 2,
          walk: walking ? shift * 0.05 + d.i : undefined,
          armF: 10 + reach * (1 - rub) * 52 + r2 * (60 + Math.sin(t * 60 + d.i) * 7) + eat * 48 + startle * 12,
          armB: r2 * (54 + Math.sin(t * 60 + d.i + 1.6) * 7) + startle * 20,
          head: r2 * 12 - eat * 8 - startle * (d.i >= 2 ? 0 : 6), lean: r2 * 4, blink: blinkAt(T, d.seed),
        });
      });
      STALKS.forEach((st) => {
        const d = st.d;
        const fx_ = st.x + WALK - shift;
        pose(st.el, { x: fx_, y: FP - 20 });
        const pick = es(t, 1.46 + d.i * 0.04, 1.54 + d.i * 0.04);
        const gone = es(t, 1.62 + d.i * 0.04, 1.7 + d.i * 0.04);
        const [hx, hy] = handAt(d.x, FP, 0.95, st.x < d.x, 62);
        pose(st.ear, { x: lerp(st.ex0, hx - fx_, pick), y: lerp(st.ey0, hy - (FP - 20), pick), r: pick * 60, s: 1 - gone * 0.7, o: 1 - gone });
        pose(st.stem, { r: pick * 5 });
      });
      chaff.forEach((ch) => {
        const d = ch.d;
        const k = seg(t, 1.6 + d.i * 0.04 + ch.ph, 1.98 + d.i * 0.04 + ch.ph);
        const flip = d.i >= 2;
        const [hx, hy] = handAt(d.x, FP + (d.i % 2 ? 6 : -4), 0.95, flip, 62);
        pose(ch.el, { x: hx + (flip ? -1 : 1) * 4 + k * ch.dx * (flip ? 1 : 1), y: hy + k * ch.dy + k * k * 30, r: k * 400, o: k > 0 && k < 1 ? 1 - k * 0.6 : 0 });
      });
      kernels.forEach((el, i) => {
        const d = D[i];
        const flip = d.i >= 2;
        const on = es(t, 1.72 + i * 0.04, 1.8 + i * 0.04) * (1 - es(t, 2.0 + i * 0.02, 2.06 + i * 0.02));
        const [hx, hy] = handAt(d.x, FP + (d.i % 2 ? 6 : -4), 0.95, flip, 64);
        pose(el, { x: hx, y: hy - 6, s: 1, o: on });
      });

      S.cam.z = kf(t, [[0.8, 1.03], [1.42, 1.04], [1.62, 1.14], [2.0, 1.14], [2.3, 1.04]]);
      S.cam.y = kf(t, [[0.8, 20], [1.42, 20], [1.62, 44], [2.0, 44], [2.3, 14]]);
      S.cam.x = kf(t, [[1.95, 0], [2.35, S.portrait ? 80 : 34]]);
    };
  },
};
