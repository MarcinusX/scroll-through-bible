// Mt 18,13–14 — golden evening in the hills. High on a ledge among the rocks the lost sheep is caught in a thorn bush.
// The shepherd climbs up to it, parts the thorns, frees it and swings it up onto his shoulders — and lifts his arm
// for joy: hearts go up over the one, while far below the ninety-nine graze on quietly. He comes down and sets it
// among the others; the tag is back at 100. It is not the will of your Father in heaven that one of these little
// ones should be lost: the light (only light) opens in the sky over the whole flock, and a little child runs up
// and throws her arms round the found sheep.
import { C, person, blinkAt, pose, lerp, swing, hanging, sheet, shade, mix } from '../kit.js';
import { rock, grass, bush } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { pastureSet, ewe, sheepRig, WOOLS, SHEPHERD, staff, shoulderLamb, onShoulders, hungWords, heart, sparkle, fatherLight, kid, along, kf, GOLDEN_SKY, PI } from './lib.js';

const P = 0.45;
const LEDGE = [1060, 488];
const UP = [[700, 664], [820, 650], [930, 600], [1000, 540], [1040, 498]];
const DOWN = [[1040, 498], [980, 560], [900, 620], [800, 650], [720, 662]];
const FL = [800, 150];

export default {
  id: 'mt18-found',
  parable: true,
  beats: [
    { v: 13 },
    { v: 14 },
  ],
  cam: { x: [-20, 90], y: [-30, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = pastureSet(S, { skyCols: GOLDEN_SKY, sunAt: [1260, 250], groundY: 640 });
    // the crag with its ledge (its foot hidden behind the meadow)
    const cragL = S.layer({ par: P, sh: 3 });
    const RK = mix(C.rock, C.rock2, 0.45);
    const k = sheet().p(c.cut([[820, 1800], [820, 640], [900, 600], [960, 560], [1000, 520], [1040, 498], [1110, 494], [1130, 470], [1180, 420], [1250, 388], [1330, 398], [1420, 436], [1600, 490], [2400, 540], [2400, 1800]], 1.4, 9), RK);
    k.p(c.cut([[1030, 500], [1120, 496], [1130, 512], [1030, 514]], 0.5, 6), shade(RK, -0.12));
    k.x(c.cut([[1180, 436], [1260, 404], [1320, 414], [1250, 446]], 0.6, 6) + c.cut([[1440, 450], [1560, 488], [1480, 492]], 0.6, 6) + c.cut([[930, 580], [990, 540], [1010, 556], [950, 590]], 0.5, 6), shade(RK, 0.25), 'opacity=".7"');
    k.x(c.cut([[1080, 560], [1200, 520], [1300, 560], [1180, 600]], 0.8, 8) + c.cut([[1400, 540], [1520, 530], [1600, 580], [1460, 600]], 0.8, 8), shade(RK, -0.08), 'opacity=".5"');
    k.p(c.ribbon(UP.slice(2).map(([x, y]) => [x, y + 4]), (u) => 16 - u * 6, 2), mix(C.sand, C.rock, 0.5));
    cragL.add(k.out());
    cragL.add(rock(c, 1300, 470, 110, 60, C.rock2));
    const field = S.layer({ par: P, sh: 3 });
    const ffn = c.wave(620, [6, 2], [700, 170]);
    const f = sheet().p(c.ridge(ffn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage, 0.3));
    f.p(c.ribbon(UP.slice(0, 3).map(([x, y]) => [x, y + 4]), (u) => 22 - u * 6, 2), mix(C.sand, C.rock, 0.4));
    field.add(f.out());
    field.add(grass(c, { x0: -1200, x1: 2800, y: 620, fn: ffn, n: 60, h: 13, color: C.moss }));

    /* the ninety-nine on the meadow (still sprites) */
    const flockL = S.layer({ par: P, sh: 4 });
    for (let gi = 0; gi < 6; gi++) {
      const cx = 300 + gi * 80 + c.rr(-10, 10), cy = 612 + (gi % 2) * 30;
      let m = '';
      Array.from({ length: 11 }, () => [c.rr(-44, 44), c.rr(-14, 14)]).sort((a, b) => a[1] - b[1]).forEach(([dx, dy]) => { m += `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${c.chance(0.5) ? 0.56 : -0.56} .56)">${ewe(c, { wool: c.pick(WOOLS) })}</g>`; });
      flockL.sprite(`<g>${m}</g>`, cx, cy);
    }

    /* the thorn bush and the lost sheep */
    const act = S.layer({ par: P, sh: 5 });
    const thornBack = act.add(`<g>${thornBush(c, 0, 0, 60)}</g>`);
    const lost = sheepRig(act.add(ewe(c, { wool: C.linen, patch: true })));
    const thornFront = act.add(`<g>${thornBush(c, 0, 0, 44, C.thorn2)}</g>`);
    const shep = S.puppet(act.add(person(c, { ...SHEPHERD, holdF: staff(c, 200, 30) })));
    const shepLamb = S.puppet(act.add(onShoulders(person(c, { ...SHEPHERD, holdF: staff(c, 200, 30) }), shoulderLamb(c, C.linen))));
    const girl = S.puppet(act.add(kid(c, 0)));

    /* joy, the light, the tag */
    const fx = S.layer({ par: P, sh: 4 });
    const hearts = [0, 1, 2].map((i) => fx.add(`<g>${heart(c, 12 + i * 3)}</g>`));
    const sparks = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));
    const hv = S.layer({ par: 0.1, sh: 2, rise: 0 });
    const light = hv.add(`<g opacity="0">${fatherLight(c, 48)}</g>`);
    const beam = hv.add(`<g opacity="0"><path d="${c.poly([[-50, 0], [50, 0], [300, 560], [-300, 560]])}" fill="#fff3cc" opacity=".22"/></g>`);
    const hq = S.layer({ par: 0.2, sh: 6 });
    const tag = hanging(hq, hungWords(c, '100', { size: 44, w: 110 }), { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      set.update(T, { glow: 0.7 });

      /* v13 — up to the ledge; freed; onto his shoulders; joy */
      const up = es(t, 0.0, 0.3, (x) => x);
      const lift = es(t, 0.46, 0.5);
      const down = es(t, 0.78, 1.25, (x) => x);
      const free = es(t, 0.32, 0.44);
      let x, y, dir, sc;
      if (t < 0.78) { [x, y, dir] = along(UP, up); sc = lerp(0.96, 0.8, up); } else { [x, y, dir] = along(DOWN, down); sc = lerp(0.8, 0.96, down); }
      const bend = bump(t, 0.3, 0.48);
      const joy = bump(t, 0.52, 0.95);
      shep.set({ x, y, s: sc, flip: dir < 0, o: (1 - lift) + es(t, 1.2, 1.24), walk: (up > 0 && up < 1) || (down > 0 && down < 1) ? (up + down) * 40 : undefined, lean: bend * 18, armF: 30 + bend * 40 + es(t, 1.25, 1.4) * 20, armB: bend * 60, head: bend * 14, blink: blinkAt(T, 2) });
      shepLamb.set({ x, y, s: sc, flip: dir < 0, o: lift * (1 - es(t, 1.2, 1.24)), walk: down > 0 && down < 1 ? down * 40 : undefined, armF: 30, armB: 20 + joy * 140, head: -joy * 10, bob: -joy * Math.abs(Math.sin(t * PI * 6)) * 8, blink: blinkAt(T, 2) });
      // the sheep: stuck, freed, gone onto the shoulders — then set down among the flock
      const setDown = es(t, 1.2, 1.24);
      const toFlock = es(t, 1.24, 1.5);
      lost.set({ x: setDown > 0 ? lerp(680, 640, toFlock) : LEDGE[0] + 10 - free * 16, y: setDown > 0 ? 660 : LEDGE[1] + 4, s: 0.6, flip: true, head: setDown > 0 ? 0 : Math.sin(t * 24) * 10 * (1 - free), hop: toFlock > 0 && toFlock < 1 ? Math.abs(Math.sin(toFlock * 20)) * 4 : 0, o: (1 - lift) + setDown });
      const spread = free;
      pose(thornBack, { x: LEDGE[0] + 22 + spread * 12, y: LEDGE[1] + 6, sx: 1 + spread * 0.1 });
      pose(thornFront, { x: LEDGE[0] - 4 - spread * 30, y: LEDGE[1] + 8, r: -spread * 20 });
      hearts.forEach((h, i) => {
        const k = seg3(t, 0.52 + i * 0.06, 1.05);
        pose(h, { x: x + (i - 1) * 34 * sc, y: y - 250 * sc - k * 70, s: Math.sin(Math.min(1, k * 1.4) * PI * 0.5), o: k > 0 && k < 1 ? 1 - Math.max(0, k - 0.7) / 0.3 : 0 });
      });

      /* v14 — back with the flock; the light; the little one */
      const tk = es(t, 1.3, 1.55, ease.back);
      swing(tag, 1010, lerp(-900, 150, tk), T, 1.4, 0.8, 1);
      const lk = es(t, 1.05, 1.45);
      pose(light, { x: FL[0], y: lerp(-300, FL[1], lk), r: T * 3, o: lk });
      pose(beam, { x: FL[0], y: FL[1] + 40, sx: 0.6 + lk * 0.4, o: lk });
      const gw = es(t, 1.4, 1.7);
      girl.set({ x: lerp(460, 600, gw), y: 668, s: 0.5, flip: false, walk: gw > 0 && gw < 1 ? gw * 30 : undefined, armF: 40 + es(t, 1.6, 1.75) * 30, armB: es(t, 1.6, 1.75) * 60, head: 8 * es(t, 1.6, 1.75), o: es(t, 1.35, 1.42), blink: blinkAt(T, 6) });
      sparks.forEach((sp, i) => {
        const k = bump(t, 1.55 + i * 0.05, 2.0);
        pose(sp, { x: 640 + (i - 1.5) * 34, y: 590 - (i % 2) * 24, s: k, r: T * 40, o: k });
      });

      S.cam.x = kf(t, [[0, 40], [0.45, 80], [0.8, 70], [1.3, 10]]);
      S.cam.y = kf(t, [[0, 10], [0.45, -20], [0.8, -10], [1.3, 10]]);
      S.cam.z = kf(t, [[0, 1.02], [0.45, 1.07], [0.8, 1.05], [1.3, 1.02]]);
    };
  },
};

function seg3(t, a, b) { return Math.max(0, Math.min(1, (t - a) / (b - a))); }
