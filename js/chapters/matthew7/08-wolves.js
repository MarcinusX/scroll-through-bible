// Mt 7,15 — evening on a pasture by a sheepfold wall, the low sun on the right. A preacher in a white woolly
// fleece comes among the flock, hands raised in blessing, and the sheep gather trustingly round him. But the sun
// throws his shadow big on the fold's wall — and the shadow is a wolf's, jaws open, eye glinting. The sheep scatter.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, flowers, olive, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { PROPHET, ewe, sheepRig, shadowPerson, wolfShadow, storyFrame, hungWord, tr, PI } from './lib.js';
import { GOLDEN } from '../john6/lib.js';

const GY = 716;
const PX = 960;

export default {
  id: 'mt7-wolves',
  enter: 'fly',
  beats: [
    { v: 15 },
  ],
  cam: { x: [-40, 20], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0b060', inner: '#f5ca8a' }), { x: 1290, y: 360, len: 800 });
    const cl = hanging(hangL, cloud(c, 190, C.cream, C.peach), { x: 900, y: 150, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 460, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.3) }).markup);
    const hills = S.layer({ par: 0.16, sh: 3 });
    hills.add(band(c, { y: 540, amps: [12, 5, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.peach, 0.2) }).markup + olive(c, 1150, 560, 0.6) + olive(c, 1420, 566, 0.5));

    /* the sheepfold wall, lit by the low sun */
    const wall = S.layer({ par: 0.34, sh: 3 });
    const w = sheet();
    const wpts = [[-900, 380], [260, 380], [300, 366], [460, 372], [620, 364], [780, 376], [860, 400], [880, GY], [-900, GY]];
    w.p(c.cut(wpts, 1.4, 8), mix(C.stone, C.peach, 0.35));
    let st = '';
    for (let y = 400; y < GY - 10; y += 34) for (let x = -300 + ((y / 34) % 2) * 30; x < 840; x += c.rr(50, 80)) st += c.cut(c.blob(x, y + 12, c.rr(20, 30), c.rr(10, 14), 8, 0.15), 0.5, 5);
    w.x(st, mix(C.stone2, C.peach, 0.3), 'opacity=".55"');
    wall.add(w.out());
    /* the shadows on the wall */
    const shL = S.layer({ par: 0.34, sh: 1, flat: true });
    const manSh = shL.add(`<g opacity=".42">${shadowPerson(c, PROPHET, '#2e2638')}</g>`);
    const wolfSh = shL.add(`<g opacity=".5">${wolfShadow(c)}</g>`);

    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(GY - 16, [4, 2], [600, 170]), -900, 2500, 1700, 12, 1), mix(C.hillNear, C.wheat, 0.3)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: GY - 14, n: 40, h: 14, color: C.olive }) + flowers(c, { x0: 600, x1: 1400, y: GY - 10, n: 10, h: 14 }) + rock(c, 1380, GY, 80, 30, C.rock2));

    /* the flock and the preacher */
    const act = S.layer({ par: 0.45, sh: 5 });
    const FLOCK = [[700, 0, 1.6], [810, 1, 1.5], [1110, 2, 1.6], [1210, 3, 1.5], [1300, 4, 1.55], [590, 5, 1.5]].map(([x, i, s]) => ({ x, i, s, seed: c.rr(0, 9), r: sheepRig(act.add(ewe(c, { lamb: i === 4 }))) }));
    const prophet = S.puppet(act.add(person(c, PROPHET)));

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 990, 260, C.moss, C.sage) + bush(c, 1510, 990, 260, C.sage, C.moss));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1290, 360, T, 1, 0.6);
      swing(cl, 900 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);

      /* he comes among the flock with his hands raised in blessing */
      const come = es(t, 0.0, 0.22);
      const px = lerp(1140, PX, come);
      const bless = es(t, 0.18, 0.34);
      const reveal = es(t, 0.44, 0.6);
      prophet.set({ x: px, y: GY, s: 1.14, flip: true, walk: come > 0 && come < 1 ? px * 0.05 : undefined, armF: 30 + bless * 70 + reveal * 20, armB: 10 + bless * 120, head: -bless * 6, blink: blinkAt(T, 3) });
      /* his shadow on the wall: a man … and then a wolf */
      const sx = px - 300;
      pose(manSh, { x: sx, y: GY - 10, s: 1.5, sx: -1, o: 0.42 * (1 - reveal) });
      pose(wolfSh, { x: sx + 20, y: GY - 10, s: lerp(0.9, 1.25, reveal), sx: -1, o: 0.55 * reveal });

      /* the sheep: graze, come close, then scatter */
      FLOCK.forEach((f) => {
        const near = es(t, 0.14 + f.i * 0.02, 0.36 + f.i * 0.02);
        const run = es(t, 0.56 + f.i * 0.02, 0.8 + f.i * 0.02, (u) => u);
        const side = f.x < PX ? -1 : 1;
        const x0 = lerp(f.x, PX + side * (110 + (f.i % 3) * 60), near * 0.6);
        const x = x0 + side * run * 420;
        const hop = run > 0 && run < 1 ? Math.abs(Math.sin(run * 16 + f.i)) * 14 : bump(t, 0.52, 0.6) * 10;
        const flip = run > 0 ? side < 0 : side > 0;
        f.r.set({ x, y: GY + 6 + (f.i % 2) * 8, s: f.s, flip, head: run > 0 ? -10 : near > 0.5 ? -14 : 14 + Math.sin(T * 0.8 + f.seed) * 4, hop, o: 1 });
      });

      S.cam.z = 1.04 + es(t, 0.3, 0.6) * 0.06;
      S.cam.x = -es(t, 0.3, 0.6) * 30;
      S.cam.y = 30;
    };
  },
};
