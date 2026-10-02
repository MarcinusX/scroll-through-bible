// Mt 12,11 — "Which of you, if he has one sheep…": a painted flat of a hillside farm on the Sabbath (the tag with the
// candles hangs over it; the shepherd sits resting by his door). His only sheep wanders to the edge of an old pit and
// tumbles in — only its head shows, bleating. He jumps up, runs, kneels at the edge, reaches down and heaves it out,
// and stands up with it across his shoulders.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, house, olive, cypress, bush, grass, rock, cloud, sun, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SHEPHERD, WARM, ewe, sheepRig, onShoulders, shoulderLamb, sabbathTag, speech, bang, handAt, headAt, sparkle, kf, moving, tr, PI } from './lib.js';

const G = 690;        // the ground line
const PX = 780;       // the pit

export default {
  id: 'mt12-sheep',
  enter: 'fly',
  beats: [
    { v: 11 },
  ],
  cam: { x: [-20, 30], y: [-10, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, WARM);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const SUN = S.portrait ? [1010, 210] : [1180, 170];   // phone: the sun hangs inside the frame (only a sliver peeped under the thread)
    const sunEl = hanging(hangL, sun(c, 40), { x: SUN[0], y: SUN[1], len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 250, len: 800 });
    const tag = hanging(hangL, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 800, y: -300, len: 900 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 450, amps: [18, 8, 3], lens: [1000, 360, 130], color: C.hillFar, trees: 14, treeColor: C.sage2, treeH: 18 }).markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    const mb = band(c, { y: 540, amps: [16, 7, 2], lens: [800, 300, 110], color: C.hillMid });
    mid.add(mb.markup + olive(c, 330, mb.fn(330) + 8, 0.7) + cypress(c, 1400, mb.fn(1400) + 10, 110));
    /* the farm: a little house with its door, a low stone wall */
    const farm = S.layer({ par: 0.45, sh: 3 });
    const fs = sheet();
    fs.p(c.ridge(c.wave(628, [5, 2], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.25));
    farm.add(fs.out() + house(c, 1010, 632, 170, 120, { stairs: true }) + olive(c, 1290, 640, 0.75));
    let wall = '';
    for (let x = -300; x < 640; x += 26) wall += c.cut(c.blob(x, 640 - (x % 52 ? 0 : 6), 16, 11, 8, 0.2), 0.6, 4);
    farm.add(sheet().p(wall, C.rock2).out());
    /* the ground with the pit */
    const ground = farm;
    const gs = sheet();
    gs.p(c.cut([[-900, 660], [2500, 660], [2500, 1700], [-900, 1700]], 1, 20), mix(C.hillNear, C.sage2, 0.4));
    gs.p(c.cut(c.ell(PX, G + 10, 96, 26, 26), 0.8, 6), C.soilRich);
    gs.x(c.cut(c.ell(PX, G + 16, 80, 16, 22), 0.5, 6), mix(C.soilRich, C.night2, 0.4));
    ground.add(gs.out() + grass(c, { x0: -600, x1: 2200, y: 668, n: 40, h: 12, color: C.moss }) + flowers(c, { x0: 380, x1: 620, y: 700, n: 8 }) + rock(c, 930, 700, 40, 16, C.rock2));
    /* people and the sheep */
    const act = S.layer({ par: 0.45, sh: 5 });
    const sheepEl = act.add(ewe(c, { wool: C.linen }));
    const sh = sheepRig(sheepEl);
    const sit = S.puppet(act.add(person(c, { ...SHEPHERD, pose: 'sit' })));
    const run = S.puppet(act.add(person(c, SHEPHERD)));
    const kneel = S.puppet(act.add(person(c, { ...SHEPHERD, pose: 'kneel' })));
    const carry = S.puppet(act.add(onShoulders(person(c, SHEPHERD), shoulderLamb(c))));
    /* the front lip of the pit: hides the sheep's legs when it is down in it */
    const lip = S.layer({ par: 0.45, sh: 3 });
    lip.add(sheet().p(c.cut([...c.arc(PX, G + 10, 96, 26, 0, PI, 14), [PX - 130, G + 60], [PX + 130, G + 60]], 0.6, 6), mix(C.hillNear, C.sage2, 0.4)).out());
    lip.add(grass(c, { x0: PX - 110, x1: PX + 110, y: G + 38, n: 10, h: 10, color: C.moss }));
    const fx = lip;
    const bleat = fx.add(`<g opacity="0">${speech(c, bang(c, 30), { w: 44, h: 44, flip: true })}</g>`);
    const joy = [0, 1, 2].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    const runK = [[0.22, 1090], [0.44, 880]];

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: SUN[0], y: SUN[1], r: Math.sin(T * 0.6) * 1 });
      pose(cl, { x: 560 + Math.sin(T * 0.1) * 20, y: 250, r: Math.sin(T * 0.6 + 1) * 1.1 });
      const tg = es(t, -0.5, -0.1, ease.back);
      pose(tag, { x: 800, y: lerp(-300, 150, tg), r: Math.sin(T * 0.9) * 0.8, oy: 0, o: tg > 0.01 ? 1 : 0 });

      /* the sheep: grazes, steps to the edge, falls in; is pulled out */
      const step = es(t, -0.6, 0.06);
      const fall = es(t, 0.06, 0.16, ease.in);
      const lift = es(t, 0.52, 0.64);
      const onShoulder = t >= 0.66;
      const sx = lerp(600, PX - 20, step) + fall * 20;
      const sy = G + fall * 56 - lift * 90;
      sh.set({ x: sx + lift * 60, y: sy, s: 1.1, flip: false, head: (1 - step) * 24 - fall * 20 - bump(t, 0.2, 0.5) * 30 + lift * 10, r: fall * 20 * (1 - lift) - lift * 20, o: onShoulder ? 0 : 1 });
      const bl = es(t, 0.16, 0.24, ease.back) * (1 - es(t, 0.5, 0.58));
      pose(bleat, { x: PX + 36, y: G - 40, s: bl, o: bl > 0.01 ? 1 : 0 });

      /* the shepherd */
      const up = es(t, 0.18, 0.22);
      const rx = kf(t, runK);
      const kn = es(t, 0.44, 0.47);
      const stand2 = es(t, 0.64, 0.68);
      sit.set({ x: 1080, y: 660, s: 0.94, flip: true, o: 1 - up, head: -4 + es(t, 0.14, 0.2) * -10, armF: 20, blink: blinkAt(T, 3) });
      run.set({ x: rx, y: 676, s: 0.98, flip: true, o: up * (1 - kn), walk: moving(t, runK) ? rx * 0.08 : undefined, amt: 1.6, armF: 50, armB: 40, lean: -8, head: -6, blink: 0 });
      const reach = es(t, 0.46, 0.54) * (1 - es(t, 0.6, 0.64));
      kneel.set({ x: 880, y: 676, s: 0.98, flip: true, o: kn * (1 - stand2), armF: 40 + reach * 90 - lift * 40, armB: 30 + reach * 80, lean: -10 - reach * 12, head: 10, blink: blinkAt(T, 3) });
      carry.set({ x: 900, y: 676, s: 0.98, flip: true, o: stand2, armF: 62, armB: 130, head: -8, blink: blinkAt(T, 3) });
      joy.forEach((j, i) => {
        const k = es(t, 0.66 + i * 0.03, 0.76 + i * 0.03, ease.back);
        const [hx, hy] = headAt(900, 676, 0.98, true);
        pose(j, { x: hx - 40 + i * 40, y: hy - 50 - (i % 2) * 20, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1.12;
      S.cam.y = 36;
      S.cam.x = kf(t, [[-0.5, -10], [0.3, 10]]);
    };
  },
};
