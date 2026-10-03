// Łk 10,33–34a — the same road, later in the day. "But a Samaritan, as he journeyed, came to where he was": a man in a
// striped teal mantle comes riding down the road on his donkey, its saddle hung with two skins, and draws level with
// the man lying there. "And when he saw him, he had compassion": he stops, and a warm heart kindles in his breast; he
// slips down from the donkey and hurries to him. "He went to him and bound up his wounds, pouring on oil and wine":
// he kneels at the man's head, tips his flask of oil over the wounds, then the wine, drop by drop — and binds them
// with strips of linen, round the head and the arm.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { jerichoSet, ROAD, lying, samaritan, samDonkey, coltRig, heart, glow, oilFlask, jug, headBandage, addToHead, kf, moving, handAt, headAt, HOT, STRIPPED, es, ease, bump, seg, PI } from './lib.js';

const DX = 520;                          // where the donkey stops
const KX = 610;                          // where he kneels, at the man's head

export default {
  id: 'lk10-compassion',
  parable: true,
  beats: [
    { v: 33, text: 'Pewien zaś Samarytanin, będąc w podróży, przechodził również obok niego.' },
    { v: 33, cont: true, text: 'Gdy go zobaczył, wzruszył się głęboko:' },
    { v: 34, text: 'podszedł do niego i opatrzył mu rany, zalewając je oliwą i winem;' },
  ],
  cam: { x: [-130, 40], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const V = jerichoSet(S, { skyCols: HOT, sunAt: [1260, 220] });
    const c = S.c;
    const P = S.layer({ par: 0.44, sh: 5 });
    const hurt = person(c, { ...STRIPPED, eyes: 'closed' });
    const man = P.add(`<g>${lying(hurt, 0.95)}</g>`);
    const bound = P.add(`<g>${lying(addToHead(hurt, headBandage(c)), 0.95)}</g>`);
    const armBand = P.add(`<g><path d="${c.ribbon([[-12, 0], [12, 0]], 9)}" fill="${C.linen}"/></g>`);
    const donkey = coltRig(P.add(samDonkey(c, 'samaritan')));
    const donkeyE = coltRig(P.add(samDonkey(c, '')));
    const glowH = P.add(`<g>${glow(80, 0.9, 'warm-glow')}</g>`);
    const sam = S.puppet(P.add(samaritan(c)));
    const kneel = S.puppet(P.add(samaritan(c, { pose: 'kneel' })));
    const fx = S.layer({ par: 0.46, sh: 4 });
    const hrt = fx.add(`<g>${heart(c, 14)}</g>`);
    const flask = fx.add(`<g>${oilFlask(c)}</g>`);
    const wine = fx.add(`<g transform="scale(.42)">${jug(c, mix(C.plumRobe, C.clay, 0.4))}</g>`);
    const drops = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<path d="${c.cut([[0, -5], [3, 0], [0, 4], [-3, 0]], 0.1, 2)}" fill="${i < 3 ? C.sun : mix(C.plumRobe, C.terracotta, 0.5)}"/>`) }));
    V.front();

    return (t, time) => {
      const T = time;
      V.update(T, { sunY: 220 });
      const lieX = ROAD.LIE[0] + 80, lieY = ROAD.LIE[1];
      const band = es(t, 2.72, 2.78);
      pose(man, { x: lieX, y: lieY, o: 1 - band });
      pose(bound, { x: lieX, y: lieY, o: band });
      pose(armBand, { x: lieX - 90, y: lieY - 44, r: 90, o: band });

      /* v33a — he comes riding down the road and draws level */
      const rK = [[0.02, -100], [0.6, DX]];
      const dx = kf(t, rK, (x) => x);
      const riding = moving(t, rK);
      const off = es(t, 1.5, 1.56);
      const see = es(t, 0.6, 0.75);
      donkey.set({ x: dx, y: ROAD.MID - 4, s: 0.94, flip: false, walk: riding ? dx * 0.05 : undefined, nod: riding ? 0 : (T ? Math.sin(T * 0.8) * 3 : 0), o: 1 - off });
      donkeyE.set({ x: DX, y: ROAD.MID - 4, s: 0.94, flip: false, nod: T ? Math.sin(T * 0.8) * 3 : 0, o: off });

      /* v33b — compassion: the heart kindles; he gets down and hurries over */
      const warm = es(t, 1.05, 1.35);
      const [shx, shy] = [DX - 10, ROAD.MID - 190];
      const wK = [[1.56, DX + 50], [1.9, KX - 30]];
      const sx = kf(t, wK);
      const knelt = es(t, 1.95, 2.02);
      sam.set({ x: sx, y: ROAD.MID + 4, s: 0.98, flip: false, walk: moving(t, wK) ? sx * 0.06 : undefined, armF: 30 + es(t, 1.6, 1.8) * 40, armB: 20, head: 8, o: off * (1 - knelt), blink: blinkAt(T, 3) });
      const bodyX = off > 0.5 ? sx : DX - 12, bodyY = off > 0.5 ? ROAD.MID - 120 : shy + 40;
      pose(hrt, { x: bodyX + 14, y: bodyY, s: 0.4 + warm * 0.8 + (T ? Math.sin(T * 4) * 0.04 * warm : 0), o: warm * (1 - es(t, 2.9, 3.0) * 0.4) });
      pose(glowH, { x: bodyX + 14, y: bodyY, s: 0.6 + warm * 0.6, o: warm });

      /* v34a — oil, wine, bandages */
      const oil = es(t, 2.1, 2.2) * (1 - es(t, 2.4, 2.46));
      const vin = es(t, 2.44, 2.52) * (1 - es(t, 2.68, 2.74));
      const bind = bump(t, 2.66, 2.9);
      kneel.set({ x: KX, y: ROAD.MID + 10, s: 0.98, flip: false, armF: 40 + oil * 40 + vin * 40 + bind * 30, armB: 20 + bind * 60, head: 16, o: knelt, blink: blinkAt(T, 3) });
      const [khx, khy] = handAt(KX, ROAD.MID + 10, 0.98, false, 40 + Math.max(oil, vin) * 40, 'kneel');
      pose(flask, { x: khx + 4, y: khy + 8, r: 120 * oil, s: 0.9, o: oil > 0.02 ? 1 : 0 });
      pose(wine, { x: khx + 4, y: khy + 8, r: 110 * vin, o: vin > 0.02 ? 1 : 0 });
      drops.forEach((d) => {
        const a = d.i < 3 ? 2.2 + d.i * 0.06 : 2.52 + (d.i - 3) * 0.06;
        const k = seg(t, a, a + 0.12);
        pose(d.el, { x: khx + 26, y: lerp(khy + 10, lieY - 40, k), o: k > 0 && k < 1 ? 1 : 0 });
      });

      // phone: the camera leans left so the Samaritan on his donkey is on screen
      S.cam.x = S.portrait ? kf(t, [[0, -120], [0.6, -120], [1.2, -110], [2.0, -60], [3, -60]]) : kf(t, [[0, -40], [0.6, -40], [1.2, -40], [2.0, -20], [3, -20]]);
      S.cam.y = kf(t, [[0, 10], [1, 10], [2.0, 50], [3, 50]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.06], [1.2, 1.06], [2.0, 1.12], [3, 1.12]]);
    };
  },
};
