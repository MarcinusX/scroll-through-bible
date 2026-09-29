// Mt 25,5–7 — the bridegroom is long in coming: night falls over the street, the moon climbs, and one after another
// the ten sit down with their lamps set beside them and fall asleep. At midnight torches appear far up the hill road
// and a runner comes down the street with his torch raised, crying "The bridegroom is coming! Come out to meet him!"
// — the sleepers lift their heads. They all get up and trim their lamps: the wise ones' flames stand tall, the
// foolish ones' already burn low and flutter.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { weddingSet, WD, SPOTS, maidens, setMaiden, FRIENDS, torch, zzz, voiceRings, say, along, kf, moving, tr } from './lib.js';

export default {
  id: 'mt25-sleep',
  parable: true,
  beats: [
    { v: 5 },
    { v: 6, text: 'Lecz o północy rozległo się wołanie:' },
    { v: 6, cont: true, text: '"Pan młody idzie, wyjdźcie mu na spotkanie!"' },
    { v: 7 },
  ],
  cam: { x: [-20, 60], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const W = weddingSet(S, { moonAt: [1260, 190] });
    const c = W.c;
    const act = S.layer({ par: 0.45, sh: 5 });
    const fireL = S.layer({ par: 0.45, sh: 0, flat: true });
    const M = maidens(S, act, { fireL });
    const herald = S.puppet(act.add(person(c, { ...FRIENDS[0], holdF: `<g transform="rotate(180)">${torch(c, 56)}</g>` })));
    const fx = S.layer({ par: 0.45, sh: 4 });
    const Z = M.map(() => fx.add(`<g>${zzz(c)}</g>`));
    const voice = voiceRings(fx, c, { n: 3, r: 26, w: 4, color: C.lampGlow });
    const cry = fx.add(`<g>${say(c, tr('Pan młody idzie!', 'The bridegroom is coming!'), { size: 22, side: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v5 — night falls while he delays; they all fall asleep */
      const dark = es(t, 0.05, 0.8);
      W.night.layer.fade(0.35 + dark * 0.65);
      const my = lerp(190, 110, es(t, 0.1, 1.9));
      W.update(T, { moonY: my, moonX: lerp(1260, 1060, es(t, 0.1, 1.9)) });
      W.door(0);
      pose(W.bar, { o: 0 });
      pose(W.shutter, { x: WD.WIN[0] - 26, y: WD.WIN[1] - 2 });
      pose(W.stallGlow, { x: WD.STALL + 70, y: 530, o: 0.25 * (1 - dark) });
      W.seller.set({ x: WD.STALL - 10, y: 640, s: 0.62, o: 1 - dark, blink: blinkAt(T, 4) });

      /* v6 — at midnight torches on the hill road; a runner cries out */
      W.torches.forEach((el, i) => {
        const [x, y] = along(W.ROAD, es(t, 1.05 + i * 0.1, 3.9, (u) => u) * 0.8 + 0.02 - i * 0.02);
        pose(el, { x, y, s: 0.8 + Math.sin(T * 8 + i) * 0.06, o: es(t, 1.05 + i * 0.1, 1.3 + i * 0.1) });
      });
      const HK = [[1.2, 1560], [1.9, 1150]];
      const hx = kf(t, HK, ease.out);
      const call = es(t, 1.9, 2.1) * (1 - es(t, 3.3, 3.5));
      herald.set({ x: hx, y: WD.G + 4, s: 0.84, flip: true, o: es(t, 1.15, 1.25), walk: moving(t, HK) ? hx * 0.08 : undefined, amt: 1.4, armF: 150 + call * 10, armB: 20 + call * 70, head: -4 - call * 6, blink: blinkAt(T, 2) });
      voice(hx - 24, WD.G - 150, call, T, { dir: -1, s0: 0.7 });
      const ck = es(t, 2.05, 2.3, ease.back) * (1 - es(t, 3.3, 3.45));
      pose(cry, { x: hx - 30, y: WD.G - 176, s: ck, o: ck > 0.01 ? 1 : 0 });

      /* v7 — all arise and trim their lamps */
      const rise = es(t, 3.05, 3.25);
      const trim = es(t, 3.25, 3.6);
      M.forEach((m) => {
        const d = m.i;
        const sl = es(t, 0.15 + d * 0.05, 0.3 + d * 0.05) * (1 - seg(t, 3.05 + (d % 5) * 0.03, 3.1 + (d % 5) * 0.03));
        const lift = bump(t, 2.0 + (d % 4) * 0.06, 3.1) * 0.9 + es(t, 1.4, 1.7) * 0.1;
        const fire = m.wise ? 1 - es(t, 0.8, 1.8) * 0.15 + trim * 0.4 : 1 - es(t, 0.8, 1.8) * 0.3 - trim * 0.15;
        const flutter = m.wise ? 0 : trim * Math.sin(T * 17 + m.seed) * 0.12;
        setMaiden(m, {
          x: SPOTS[m.i] + (m.wise ? 16 : -16), y: WD.G + (m.i % 2) * 6, s: 0.8, sleep: sl, sleepHead: 22 - lift * 26,
          armF: 40 + trim * 34, armB: 6, head: -trim * 10, blink: blinkAt(T, m.seed), fire: fire + flutter, time: T,
        });
        const zk = T ? (T * 0.45 + d * 0.23) % 1 : 0.5;
        const zo = es(t, 0.35 + d * 0.05, 0.5 + d * 0.05) * (1 - es(t, 1.95, 2.1));
        pose(Z[d], { x: SPOTS[m.i] + 16, y: WD.G - 150 - zk * 26, s: 0.6 + zk * 0.3, o: zo * (1 - zk * 0.6) });
      });

      S.cam.z = 1 + es(t, 0, 0.8) * 0.04 - es(t, 1.1, 1.6) * 0.03 + es(t, 3.0, 3.5) * 0.03;
      S.cam.x = es(t, 1.1, 1.7) * 50 * (1 - es(t, 2.9, 3.3));
      S.cam.y = -es(t, 1.1, 1.6) * 30 * (1 - es(t, 2.9, 3.3)) + es(t, 3.0, 3.5) * 10;
    };
  },
};
