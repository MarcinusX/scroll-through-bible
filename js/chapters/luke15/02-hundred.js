// Łk 15,4 (a, b) — the parable flies in: the wilderness in the late afternoon, dry sandy slopes, thorn scrub, a
// rocky ravine opening on the right. "Which of you, having a hundred sheep…": the shepherd stands leaning on his
// staff while his flock pours over the rise, group after group, and a tag counts them — 100. "…and loses one of
// them": one sheep with a brown patch drifts away nibbling, up the stony gully and out of sight behind the rocks;
// the tag drops to 99. "Does he not leave the ninety-nine in the wilderness": he looks back at the flock settled in
// the open waste, lifts his staff over them — and goes, up the gully after the one, while the sun sinks and the
// ninety-nine lie alone in the wilderness.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { rock, grass, bush } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import {
  pastureSet, skyFade, hangOff, ewe, sheepRig, WOOLS, SHEPHERD, staff, hungWords, along, kf, es, ease, bump, seg, PI, EVE,
} from './lib.js';

const P = 0.45, GY = 660;
const STRAY_WIDE = [[860, 648], [960, 630], [1030, 612], [1080, 596], [1110, 586], [1128, 580]];
const STRAY_PHONE = [[860, 648], [930, 634], [980, 620], [1020, 606], [1046, 598], [1062, 592]];   // phone: it strays off short of the thread
const GO = [[800, 668], [900, 652], [1000, 626], [1080, 600], [1150, 572], [1214, 546]];
const TAG = [1000, 150];

export default {
  id: 'lk15-hundred',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 4, text: '«Któż z was, gdy ma sto owiec, a zgubi jedną z nich,' },
    { v: 4, cont: true, text: 'nie zostawia dziewięćdziesięciu dziewięciu na pustyni' },
  ],
  cam: { x: [-20, 90], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const STRAY = PH ? STRAY_PHONE : STRAY_WIDE;
    const set = pastureSet(S, { skyCols: ['#cfddd6', '#f1e1c0', '#f7e3c2'], sunAt: [1250, 170], groundY: 640, far: mix(C.hillFar, C.dune, 0.3), mid: mix(C.dune, C.hillMid, 0.35), meadow: mix(C.sand2, C.hillNear, 0.35) });
    // the evening sky, cross-faded in as he goes
    const eve = skyFade(S, EVE, set.sk.layer);

    const field = S.layer({ par: P, sh: 3 });
    const ffn = c.wave(606, [8, 3], [700, 170]);
    const f = sheet().p(c.ridge(ffn, -1400, 3000, 1800, 12, 1), mix(C.sand, C.hillNear, 0.3));
    // the stony rise on the right with the gully climbing into it
    f.p(c.cut([[840, 652], [940, 620], [1040, 584], [1140, 548], [1230, 520], [1360, 506], [1560, 520], [1800, 556], [2400, 590], [2400, 660], [840, 660]], 1.2, 10), mix(C.dune, C.rock, 0.45));
    f.x(c.cut([[1100, 566], [1180, 540], [1260, 530], [1200, 556]], 0.6, 6) + c.cut([[1420, 520], [1520, 526], [1470, 540]], 0.6, 6), shade(C.rock, 0.2), 'opacity=".6"');
    f.p(c.ribbon(GO.map(([x, y]) => [x, y + 4]), (u) => 24 - u * 14, 2), mix(C.sand, C.rock, 0.35));
    field.add(f.out());
    field.add(grass(c, { x0: -1200, x1: 2800, y: 606, fn: ffn, n: 34, h: 11, color: C.olive }) + bush(c, 300, 628, 70, C.olive, C.moss2) + bush(c, 1500, 600, 90, C.olive));
    field.add(`<g>${thornBush(c, 420, 640, 50)}</g><g>${thornBush(c, 1320, 560, 60)}</g>`);

    /* the flock: 10 groups of 10 as still sprites; the one with the patch is apart */
    const flockL = S.layer({ par: P, sh: 4 });
    const groups = [];
    for (let gi = 0; gi < 10; gi++) {
      const row = gi >= 5 ? 1 : 0;
      const jx = c.rr(-12, 12);
      // phone: the hundred close up into the width of the screen
      const cx = PH ? 556 + (gi % 5) * 62 + jx + row * 40 : 320 + (gi % 5) * 104 + jx + row * 46, cy = row ? 650 : 616;
      let m = '';
      const n = gi === 0 ? 9 : 10;
      Array.from({ length: n }, () => [c.rr(-46, 46), c.rr(-13, 13)]).sort((a, b) => a[1] - b[1]).forEach(([dx, dy]) => { m += `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${c.chance(0.5) ? 0.56 : -0.56} .56)">${ewe(c, { wool: c.pick(WOOLS) })}</g>`; });
      groups.push({ gi, cx, cy, sp: flockL.sprite(`<g>${m}</g>`, cx, cy) });
    }
    const lost = sheepRig(flockL.add(ewe(c, { wool: C.linen, patch: true })));
    const rocksL = S.layer({ par: P, sh: 5 });
    rocksL.add(rock(c, 1230, 566, 170, 84, C.rock2) + rock(c, 1330, 552, 120, 64, C.rock3) + rock(c, 1150, 606, 76, 30, C.rock));

    /* the shepherd */
    const act = S.layer({ par: P, sh: 5 });
    const shep = S.puppet(act.add(person(c, { ...SHEPHERD, holdF: staff(c, 200, 30) })));

    /* the tally tag */
    const hq = S.layer({ par: 0.2, sh: 6 });
    const tags = ['100', '99'].map((n) => hangOff(hq, hungWords(c, n, { size: 44, w: 110 })));

    return (t, time) => {
      const T = time;
      const sunY = lerp(170, 300, es(t, 1.2, 1.95));
      set.update(T, { sunY, glow: 0.5 + es(t, 1.2, 1.95) * 0.3 });
      eve.fade(es(t, 1.2, 1.95));

      /* v4a — a hundred sheep pour over the rise; one strays; 100 → 99 */
      groups.forEach((g) => {
        const a = 0.02 + g.gi * 0.03;
        const k = es(t, a, a + 0.22, ease.out);
        const settle = es(t, 1.1, 1.4) * (g.gi < 5 ? 8 : -6);
        g.sp.set({ x: lerp(g.cx - 180, g.cx, k), y: g.cy + (1 - k) * -26 + settle, s: 1, o: k });
      });
      const t100 = es(t, 0.12, 0.36, ease.back) * (1 - es(t, 0.66, 0.72));
      const t99 = es(t, 0.7, 0.84, ease.back);
      swing(tags[0], TAG[0], lerp(-900, TAG[1], t100), T, 1.4, 0.8, 1);
      swing(tags[1], TAG[0], lerp(-900, TAG[1], t99), T, 1.4, 0.8, 2);

      const su = es(t, 0.3, 0.68, (x) => x);
      const [lx, ly, ld] = along(STRAY, su);
      const inF = es(t, 0.14, 0.3);
      lost.set({ x: su > 0 ? lx : lerp(700, 860, inF), y: su > 0 ? ly : 648, s: 0.58 - su * 0.12, flip: su > 0 ? ld < 0 : false, head: su > 0 && su < 1 ? 14 + Math.sin(su * 30) * 8 : su >= 1 ? 16 : 0, hop: su > 0 && su < 1 ? Math.abs(Math.sin(su * 24)) * 3 : 0, o: inF * (1 - es(t, 0.9, 1.0)) });

      /* the shepherd: counts them in; turns at the loss; v4b — looks back over the 99, lifts his staff, and goes */
      const look = es(t, 0.7, 0.8);
      const back = es(t, 1.05, 1.15) * (1 - es(t, 1.42, 1.5));
      const go = es(t, 1.48, 1.96, (x) => x);
      const [sx, sy, sd] = along(GO, go);
      shep.set({ x: sx, y: sy, s: lerp(1.0, 0.66, go), flip: go > 0 ? sd < 0 : back > 0.5 || look < 0.5 ? back > 0.5 : false, walk: go > 0 && go < 1 ? go * 44 : undefined, armF: 30 + bump(t, 0.1, 0.5) * 20 + back * 60, armB: look * (1 - back) * 20 + (go > 0 ? 20 : 0), head: -look * 8 + back * 6, lean: go > 0 ? 4 : 0, blink: blinkAt(T, 2) });

      S.cam.x = kf(t, [[0, 0], [0.4, 10], [0.8, 50], [1.1, 0], [1.9, 60]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [0.8, 1.04], [1.1, 1.02], [1.9, 1.05]]);
    };
  },
};
