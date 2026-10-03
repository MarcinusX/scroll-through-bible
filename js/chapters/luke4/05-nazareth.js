// Łk 4,16a–b — Nazareth, a little town stacked on its hill with the synagogue at the top. Jesus comes along the
// valley road to the town "where He had been brought up": a round memory plate comes down — the workshop, Joseph
// at the bench, the boy with a hammer, Mary. Then the Sabbath (the tag with its two candles comes down) and, as
// was His custom, He climbs the lane with the townspeople to the synagogue.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, olive, cypress, bush, rock, grass, flowers, sun, cloud, palm } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { MORNING, memoryPlate, sabbathTag, labelTag, paperLabel, smallSynagogue, kf, moving, manO, womanO, tr, PI } from './lib.js';

const hillFn = (x) => 640 - 250 * Math.exp(-Math.pow((x - 1120) / 340, 2)) - 30 * Math.exp(-Math.pow((x - 560) / 260, 2));
const ROADY = (x) => 712 + Math.sin(x * 0.004) * 5;
// the lane up the hill to the synagogue door: [x, y, scale]
const LANE = [[800, 712, 1.0], [880, 660, 0.86], [950, 600, 0.74], [1010, 540, 0.64], [1060, 470, 0.54], [1100, 420, 0.46]];
function laneAt(u) {
  const f = Math.max(0, Math.min(1, u)) * (LANE.length - 1), i = Math.min(LANE.length - 2, Math.floor(f)), k = f - i;
  return LANE[i].map((v, j) => lerp(v, LANE[i + 1][j], k));
}

export default {
  id: 'lk4-nazareth',
  beats: [
    { v: 16, text: 'Przyszedł również do Nazaretu, gdzie się wychował.' },
    { v: 16, cont: true, text: 'W dzień szabatu udał się swoim zwyczajem do synagogi' },
  ],
  cam: { x: [-160, 250], y: [-80, 50], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    sky(S, MORNING);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 560, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 900, y: 120, len: 600 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 40, scale: 0.5 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 410, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    S.layer({ par: 0.16, sh: 3 }).add(hillsWith(c, { y: 480, amps: [16, 8, 3], lens: [900, 320, 110], color: C.hillMid, trees: 26, treeColor: C.sage, treeH: 22 }).markup);

    /* ---------- the town on its hill ---------- */
    const townL = S.layer({ par: 0.45, sh: 3 });
    const hp = [];
    for (let x = -900; x <= 2500; x += 14) hp.push([x, hillFn(x) + c.rr(-1.2, 1.2)]);
    hp.push([2500, 1700], [-900, 1700]);
    townL.add(sheet().p(c.poly(hp), mix(C.hillNear, C.sand, 0.35)).out());
    // the lane
    const lane = [], lane2 = [];
    LANE.forEach(([x, y, s]) => { lane.push([x - 24 * s, y + 6]); lane2.unshift([x + 30 * s, y + 6]); });
    townL.add(sheet().p(c.cut([...lane, ...lane2], 0.8, 8), C.sand).out());
    const rows = [[560, 870, 1390, 6, 0.95, 1], [500, 930, 1340, 5, 0.85, 1], [440, 1150, 1310, 3, 0.75, 1], [632, 1180, 1460, 4, 1.0, 0]];
    let tw = '';
    rows.forEach(([y, x0, x1, n, sc]) => {
      for (let i = 0; i < n; i++) {
        const x = lerp(x0, x1, (i + c.rr(0.1, 0.5)) / n);
        if (Math.abs(x - laneAt((y < 600 ? (712 - y) / 300 : 0.1)).at(0)) < 40 && y > 480) continue;
        const w = c.rr(44, 64) * sc, h = c.rr(32, 44) * sc;
        tw += house(c, x, y + c.rr(-4, 4), w, h, { stairs: c.chance(0.4) });
      }
    });
    townL.add(`<g transform="translate(1110 424) scale(.62)">${smallSynagogue(c)}</g>`);
    townL.add(tw);
    townL.add(cypress(c, 860, 600, 110) + cypress(c, 1420, 560, 120) + olive(c, 700, 660, 0.6) + olive(c, 1500, 600, 0.6));
    const sign = hanging(townL, paperLabel(tr('Nazaret', 'Nazareth'), { size: 24 }), { x: 0, y: -1500, len: 500 });

    /* ---------- the road ---------- */
    const G = S.layer({ par: 0.5, sh: 3 });
    const road = [], road2 = [];
    for (let x = -900; x <= 2500; x += 20) road.push([x, ROADY(x) - 22]);
    for (let x = 2500; x >= -900; x -= 20) road2.push([x, ROADY(x) + 24]);
    G.add(sheet().p(c.cut([...road, ...road2], 1, 10), C.sand).out());
    G.add(grass(c, { x0: -600, x1: 700, y: 690, n: 20, h: 12, color: C.olive }));

    /* ---------- people ---------- */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const folk = [0, 1, 2, 3].map((i) => ({ i, p: S.puppet(PL.add(person(c, i % 2 ? womanO(c) : manO(c, { hairStyle: 'wrap', veil: C.linen2 })))) }));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));

    /* ---------- flies: the memory, the Sabbath ---------- */
    const flies = S.layer({ par: 0.3, sh: 6 });
    const memo = hanging(flies, memoryPlate(c), { x: 0, y: -1500, len: 700 });
    const memoTag = hanging(flies, labelTag(tr('tu się wychował', 'where he was brought up'), 18), { x: 0, y: -1500, len: 700 });
    const sabbath = hanging(flies, sabbathTag(c, tr('Szabat', 'Sabbath')), { x: 0, y: -1500, len: 600 });

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 120, 880, 230, C.sage, C.moss) + bush(c, 1500, 876, 200, C.moss, C.sage) + rock(c, 330, 890, 150, 60, C.rock2) + flowers(c, { x0: 150, x1: 600, y: 850, n: 12 }));
    fg.add(palm(c, -60, 920, 330));

    return (t, time) => {
      swing(sunEl, 560, 170 - es(t, 0, 2) * 30, time, 1.2, 0.7);
      swing(cl1, 900 + Math.sin(time * 0.1) * 30, 120, time, 1.4, 0.6, 1);
      birds(time, 1);

      /* v16a: along the road to the town where He grew up */
      const w = es(t, 0.0, 0.7);
      const up = es(t, 1.1, 1.95);
      let jx = lerp(220, 800, w), jy = ROADY(jx), js = 1.0;
      if (up > 0) [jx, jy, js] = laneAt(up);
      const walking = (w > 0 && w < 1) || (up > 0 && up < 1);
      jesus.set({ x: jx, y: jy, s: js, flip: false, walk: walking ? (jx + jy) * 0.05 : undefined, armF: 12 + bump(t, 0.7, 1.0) * 30, head: -bump(t, 0.7, 1.0) * 6, blink: blinkAt(time), o: up > 0.995 ? 0 : 1 });
      const sg = es(t, 0.1, 0.4, ease.back);
      pose(sign, { x: 960, y: lerp(-300, 330, sg), r: Math.sin(time * 1.1) * 2.5, o: sg > 0.01 ? 1 : 0 });
      const mk = es(t, 0.35, 0.65, ease.out) * (1 - es(t, 1.05, 1.3, ease.in));
      pose(memo, { x: 660, y: lerp(-500, 260, mk), r: Math.sin(time * 0.9) * 1.5, o: mk > 0.01 ? 1 : 0 });
      pose(memoTag, { x: 660, y: lerp(-500, 400, mk), r: Math.sin(time * 1.1 + 1) * 2, o: mk > 0.01 ? 1 : 0 });

      /* v16b: the Sabbath — up the lane to the synagogue, with the townsfolk */
      const sb = es(t, 1.0, 1.3, ease.back);
      pose(sabbath, { x: PH ? 1060 : 1110, y: lerp(-500, 200, sb), r: Math.sin(time * 1.1) * 2, o: sb > 0.01 ? 1 : 0 });
      folk.forEach((f) => {
        const u = es(t, 0.75 + f.i * 0.08, 1.5 + f.i * 0.06, (x) => x) * 0.9 + 0.1;
        const k = seg(t, 0.72 + f.i * 0.08, 0.8 + f.i * 0.08);
        const [x, y, s] = laneAt(u);
        f.p.set({ x: x + (f.i % 2 ? 10 : -10), y, s, flip: false, o: k * (u > 0.97 ? 0 : 1), walk: (x + y) * 0.05 + f.i, blink: blinkAt(time, f.i) });
      });

      S.cam.x = kf(t, [[0, -150], [0.7, 0], [1.1, 0], [1.9, PH ? 235 : 170]]);   // phone: follow Him further, so the synagogue door is not under the thread
      S.cam.y = kf(t, [[0, 20], [1.1, 20], [1.9, -60]]);
      S.cam.z = kf(t, [[0, 1.02], [0.7, 1.04], [1.1, 1.04], [1.9, 1.14]]);
    };
  },
};
