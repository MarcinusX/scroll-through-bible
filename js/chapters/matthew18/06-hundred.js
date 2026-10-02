// Mt 18,12 — the parable flies in: a high pasture in the hills. "What do you think?" — a paper question mark swings
// down over the empty meadow where the shepherd stands leaning on his staff. A man has a hundred sheep: the flock
// pours over the rise, group after group, and the tag counts them up to 100. One of them, a sheep with a brown patch,
// wanders off after a butterfly, up among the rocks and out of sight — the tag drops to 99, and the shepherd turns
// round to look. Does he not leave the ninety-nine on the mountains? The flock settles down to graze, and he sets off
// up the stony path with his staff, shading his eyes, to look for the one that went astray.
import { C, person, blinkAt, pose, lerp, swing, hanging, sheet, shade, mix } from '../kit.js';
import { rock, grass, bush } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { pastureSet, ewe, sheepRig, WOOLS, SHEPHERD, staff, question, hungWords, along, kf, PI } from './lib.js';

const P = 0.45, GY = 660;
const SH = [860, 668];
const STRAY = [[900, 640], [990, 620], [1080, 600], [1150, 572], [1200, 548], [1240, 530]];
const CLIMB = [[860, 668], [960, 650], [1060, 620], [1140, 588], [1200, 560], [1260, 536]];
const TAG = [1010, 150];

export default {
  id: 'mt18-hundred',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 12, text: 'Jak wam się zdaje?' },
    { v: 12, cont: true, text: 'Jeśli kto posiada sto owiec i zabłąka się jedna z nich:' },
    { v: 12, cont: true, text: 'czy nie zostawi dziewięćdziesięciu dziewięciu na górach i nie pójdzie szukać tej, która się zabłąkała?' },
  ],
  cam: { x: [-20, 90], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const set = pastureSet(S, { sunAt: [1250, 150], groundY: 640 });
    const field = S.layer({ par: P, sh: 3 });
    const ffn = c.wave(600, [8, 3], [700, 170]);
    const f = sheet().p(c.ridge(ffn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage, 0.3));
    // a stony rise on the right, with the path climbing it
    f.p(c.cut([[860, 646], [960, 616], [1060, 574], [1160, 534], [1260, 508], [1380, 498], [1560, 512], [1800, 552], [2400, 590], [2400, 656], [860, 656]], 1.2, 10), mix(C.hillNear, C.rock, 0.35));
    f.x(c.cut([[1100, 560], [1180, 530], [1260, 520], [1200, 548]], 0.6, 6) + c.cut([[1420, 510], [1520, 516], [1470, 530]], 0.6, 6), shade(C.rock, 0.2), 'opacity=".6"');
    f.p(c.ribbon(CLIMB.map(([x, y]) => [x, y + 4]), (u) => 22 - u * 12, 2), mix(C.sand, C.rock, 0.4));
    field.add(f.out());
    field.add(grass(c, { x0: -1200, x1: 2800, y: 600, fn: ffn, n: 60, h: 13, color: C.moss }) + bush(c, 330, 620, 80, C.sage, C.moss));

    /* the flock: groups of sheep as still sprites (100 of them: 11 groups of 9, and the one) */
    const flockL = S.layer({ par: P, sh: 4 });
    const groups = [];
    for (let gi = 0; gi < 11; gi++) {
      const cx = 330 + (gi % 6) * 100 + c.rr(-14, 14) + (gi >= 6 ? 50 : 0), cy = gi >= 6 ? 646 : 610;
      let m = '';
      const pts = Array.from({ length: 9 }, () => [c.rr(-46, 46), c.rr(-14, 14)]).sort((a, b) => a[1] - b[1]);
      pts.forEach(([dx, dy]) => { m += `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${c.chance(0.5) ? 0.58 : -0.58} .58)">${ewe(c, { wool: c.pick(WOOLS) })}</g>`; });
      groups.push({ gi, cx, cy, sp: flockL.sprite(`<g>${m}</g>`, cx, cy) });
    }
    const lost = sheepRig(flockL.add(ewe(c, { wool: C.linen, patch: true })));
    const bfly = flockL.add(`<g>${sheet().p(c.cut([[0, 0], [-8, -8], [-10, 2]], 0.2, 2) + c.cut([[0, 0], [8, -8], [10, 2]], 0.2, 2), C.jesusMantle).out()}</g>`);
    const rocksL = S.layer({ par: P, sh: 5 });
    rocksL.add(rock(c, 1240, 556, 150, 70, C.rock2) + rock(c, 1330, 548, 110, 56, C.rock3) + rock(c, 1130, 600, 70, 26));

    /* the shepherd */
    const act = S.layer({ par: P, sh: 5 });
    const shep = S.puppet(act.add(person(c, { ...SHEPHERD, holdF: staff(c, 200, 30) })));

    /* the question, and the tally tag */
    const hq = S.layer({ par: 0.2, sh: 6 });
    const q = hanging(hq, `<g transform="scale(2.2)">${question(c)}</g>`, { x: 0, y: 0, len: 900 });
    const tags = ['100', '99'].map((n) => hanging(hq, hungWords(c, n, { size: 44, w: 110 }), { x: 0, y: 0, len: 900 }));

    return (t, time) => {
      const T = time;
      set.update(T);

      /* v12a — what do you think? */
      const qk = es(t, 0.1, 0.4, ease.back) * (1 - es(t, 1.0, 1.2));
      swing(q, 800, lerp(-900, 190, qk), T, 1.6, 0.8);

      /* v12b — a hundred sheep pour over the rise; one strays; 100 → 99 */
      groups.forEach((g) => {
        const a = 1.0 + g.gi * 0.025;
        const k = es(t, a, a + 0.2, ease.out);
        g.sp.set({ x: lerp(g.cx - 160, g.cx, k), y: g.cy + (1 - k) * -30, s: 1, o: k });
      });
      const t100 = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.62, 1.68));
      const t99 = es(t, 1.64, 1.76, ease.back);
      swing(tags[0], TAG[0], lerp(-900, TAG[1], t100), T, 1.4, 0.8, 1);
      swing(tags[1], TAG[0], lerp(-900, TAG[1], t99), T, 1.4, 0.8, 2);

      const su = es(t, 1.38, 1.9, (x) => x);
      const [lx, ly, ld] = along(STRAY, su);
      const inFlock = es(t, 1.1, 1.3);
      lost.set({ x: su > 0 ? lx : lerp(760, 900, inFlock), y: su > 0 ? ly : 640, s: 0.62 - su * 0.14, flip: su > 0 ? ld < 0 : false, head: Math.sin(t * 20) * 6 * (su > 0 && su < 1 ? 1 : 0), hop: su > 0 && su < 1 ? Math.abs(Math.sin(su * 26)) * 4 : 0, o: inFlock * (1 - es(t, 1.8, 1.92)) });
      const bf = es(t, 1.3, 1.9, (x) => x);
      const [bx, by] = along(STRAY, Math.min(1, bf + 0.12));
      pose(bfly, { x: bx + 20, y: by - 44 + Math.sin(T * 5) * 8, sy: 0.6 + Math.abs(Math.sin(T * 14)) * 0.5, o: bump(t, 1.3, 1.95) });

      /* the shepherd: waits, counts, turns to look; v12c — leaves the 99 and climbs off to search */
      const go = es(t, 2.08, S.portrait ? 3.4 : 2.95, (x) => x);   // phone: he is still on screen at the beat's pause
      const [sx, sy, sd] = along(CLIMB, go);
      const look = es(t, 1.66, 1.8);
      const shade_ = go > 0.05 ? 1 : 0;
      shep.set({ x: sx, y: sy, s: lerp(1.0, 0.68, go), flip: go > 0 ? sd < 0 : look < 0.5, walk: go > 0 && go < 1 ? go * 50 : undefined, armF: 30 + bump(t, 1.0, 1.35) * 30, armB: shade_ * 150 + look * (1 - shade_) * 30, head: -look * 8 - shade_ * 4, lean: shade_ * 4, blink: blinkAt(T, 2) });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.4, 30], [2.0, 40], [2.9, 80]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.02], [2.0, 1.04], [2.9, 1.06]]);
    };
  },
};
