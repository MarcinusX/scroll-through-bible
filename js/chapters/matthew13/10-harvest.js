// Mt 13,30 — the farm again. "Let both grow until the harvest": the sun swings across the sky and the field grows
// tall and turns gold, wheat and darnel together. At harvest the reapers come with their sickles: first the dark
// darnel is pulled out, tied in bundles and thrown on a small fire at the edge of the field; then the wheat is cut,
// bound in sheaves and carried into the barn, whose door stands open and glowing, while the householder watches.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { sheaf, sickle } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { farmSet, growRow, FARM, MASTER, REAPERS, darnelBundle, bonfire, storyFrame, kf, moving, arcAt, HARVEST, PI } from './lib.js';

const FIRE = [370, 732];

export default {
  id: 'mt13-harvest',
  parable: true,
  beats: [
    { v: 30, text: 'Pozwólcie obojgu róść aż do żniwa;' },
    { v: 30, cont: true, text: 'a w czasie żniwa powiem żeńcom: Zbierzcie najpierw chwast i powiążcie go w snopki na spalenie;' },
    { v: 30, cont: true, text: 'pszenicę zaś zwieźcie do mego spichlerza"».' },
  ],
  cam: { x: [-60, 60], y: [0, 100], z: [1, 1.2] },
  build(S) {
    const F = farmSet(S, { skyCols: ['#d0e2dc', '#f0e8cf', '#f8ebd2'], sky2: HARVEST });
    const c = F.c;
    const wheatG = F.rows('wheat'), wheatY = F.rows('wheat', { gold: true });
    const darG = F.rows('darnel'), darY = F.rows('darnel', { gold: true });
    const gold = F.sk2L;

    /* the fire at the edge of the field */
    const fireL = F.ppl;
    const fire = fireL.add(`<g>${bonfire(c, 110)}</g>`);
    const flames = fire.querySelector('.fl');
    const smoke = [0, 1, 2].map((i) => ({ i, el: fireL.add(`<path d="${c.cut(c.blob(0, 0, 26, 18, 10, 0.3), 0.8, 4)}" fill="${mix(C.stone2, C.storm, 0.3)}" opacity="0"/>`) }));

    /* the people */
    const master = S.puppet(F.ppl.add(person(c, MASTER)));
    const bundleM = `<g transform="translate(0 4) rotate(180) scale(.6)">${darnelBundle(c, 80)}</g>`;
    const R = REAPERS.map((o, i) => ({
      i, seed: c.rr(0, 6), x: [640, 820, 1000][i],
      cut: S.puppet(F.ppl.add(person(c, { ...o, holdF: `<g transform="translate(0 4) rotate(200) scale(.5)">${sickle(c)}</g>` }))),
    }));
    /* the darnel bundles and the sheaves */
    const bundles = [0, 1, 2, 3].map((i) => ({ i, x: 560 + i * 170, el: F.ppl.add(`<g>${darnelBundle(c, 86)}</g>`) }));
    const sheaves = [0, 1, 2, 3, 4].map((i) => ({ i, x: 520 + i * 130, el: F.ppl.add(`<g>${sheaf(c, 96)}</g>`) }));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      /* v30a — both grow until the harvest: the sun swings over, the field ripens */
      const pass = seg(t, 0.05, 0.9);
      const ripe = es(t, 0.25, 0.9);
      gold.fade(ripe * 0.9);
      const sx = lerp(1250, 600, pass), sy = 320 - Math.sin(pass * PI) * 170;
      F.update(T, { sunX: t < 0.9 ? sx : lerp(600, 1180, es(t, 0.9, 1.2)), sunY: t < 0.9 ? sy : 320 - es(t, 0.9, 1.2) * 160 });
      const tall = 0.86 + es(t, 0.1, 0.8) * 0.14;
      const pull = es(t, 1.2, 1.5);
      const cutK = es(t, 2.05, 2.3);
      wheatG.forEach((r) => growRow(r, tall, 1 - ripe));
      wheatY.forEach((r) => growRow(r, tall * (1 - cutK * 0.9), ripe * (1 - cutK)));
      darG.forEach((r) => growRow(r, tall, (1 - ripe) * (1 - pull)));
      darY.forEach((r) => growRow(r, tall * (1 - pull * 0.5), ripe * (1 - pull)));

      /* the householder watches, then rejoices */
      master.set({ x: 540, y: FARM.PATH, s: 1.0, flip: false, armF: 20 + es(t, 0.1, 0.4) * 20 + es(t, 2.5, 2.7) * 90, armB: 10 + es(t, 2.5, 2.7) * 120, head: -4 - es(t, 2.5, 2.7) * 8, blink: blinkAt(T) });

      /* v30b — the reapers pull the darnel, bind it, throw it on the fire */
      const come = es(t, 1.0, 1.25);
      R.forEach((r) => {
        const x = lerp(1500 + r.i * 80, r.x + 60, come);
        const work = t > 1.25 && t < 2.9 ? Math.abs(Math.sin((t - 1.25) * PI * 4 + r.i)) : 0;
        r.cut.set({ x, y: FARM.PATH, s: 1.0, flip: true, walk: come > 0 && come < 1 ? x * 0.05 : undefined, armF: 30 + work * 80, armB: 20 + work * 30, head: 6 + work * 6, lean: -work * 8, blink: blinkAt(T, r.seed) });
      });
      bundles.forEach((b) => {
        const tie = es(t, 1.35 + b.i * 0.06, 1.5 + b.i * 0.06, ease.back);
        const toss = seg(t, 1.55 + b.i * 0.08, 1.85 + b.i * 0.08);
        const [x, y] = arcAt(ease.io(toss), [b.x, FARM.WHEAT[1] + 20], [FIRE[0] + (b.i - 1.5) * 16, FIRE[1] - 20], 160);
        pose(b.el, { x, y, s: 1.25 * tie * (1 - toss * 0.3), r: toss * -90, o: tie > 0.02 && toss < 0.98 ? 1 : 0 });
      });
      const burn = es(t, 1.62, 1.95);
      const flick = 1 + Math.sin(T * 9) * 0.06 + Math.sin(T * 13.7) * 0.04;
      pose(fire, { x: FIRE[0], y: FIRE[1], s: 0.55 + burn * 0.45, o: es(t, 1.2, 1.35) });
      pose(flames, { sx: 1 / flick, sy: flick * (0.4 + burn * 0.6), oy: 0 });
      smoke.forEach((sm) => {
        const k = ((T * 0.25 + sm.i / 3) % 1);
        pose(sm.el, { x: FIRE[0] + Math.sin(k * 4 + sm.i) * 20, y: FIRE[1] - 90 - k * 240, s: 0.6 + k * 1.2, o: burn * (1 - k) * 0.55 });
      });

      /* v30c — the wheat is cut, bound in sheaves and carried into the barn */
      const open = es(t, 2.0, 2.2);
      pose(F.barnDoor, { x: FARM.BARN - 36, y: FARM.BY, sx: FARM.BS * 2 * (1 - open * 0.85), sy: FARM.BS });
      pose(F.barnIn, { x: FARM.BARN, y: FARM.BY, s: FARM.BS * (0.4 + es(t, 2.4, 2.9) * 0.8), o: open });
      sheaves.forEach((sh) => {
        const up = es(t, 2.12 + sh.i * 0.04, 2.3 + sh.i * 0.04, ease.back);
        const go = seg(t, 2.45 + sh.i * 0.08, 2.8 + sh.i * 0.08);
        const [x, y] = arcAt(ease.io(go), [sh.x, FARM.WHEAT[2] + 26], [FARM.BARN, FARM.BY - 20], 90);
        pose(sh.el, { x, y, s: up * (1 - go * 0.45), o: up > 0.02 && go < 0.97 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.4, -40], [2.0, -40], [2.4, 40]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.06], [1.4, 1.12], [2.0, 1.12], [2.4, 1.1]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 50], [1.4, 80], [2.0, 80], [2.4, 70]]);
    };
  },
};
