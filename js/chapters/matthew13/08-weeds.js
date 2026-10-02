// Mt 13,24–26 — the parable of the weeds, a new painted flat. The householder's farm at dawn: his house on the
// left, the barn on the right, the ploughed field between. A plate of wheat and darnel comes down for "another
// parable"; the householder comes out with his seed basket and sows good seed all along the field. Night falls,
// the stars come out, his servants sleep on the flat roof — and a hooded enemy creeps along the path, flinging dark
// seed among the wheat, and slips away. Morning: green blades spring up, grow into ears of wheat — and among them the
// darnel shows its dark seed heads.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade } from '../kit.js';
import { wheatStalk } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { farmSet, growRow, FARM, MASTER, SERVANTS, ENEMY, darnelStalk, discPlate, storyFrame, kf, moving, hangAt, PI } from './lib.js';

export default {
  id: 'mt13-weeds',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 24, text: 'Inną przypowieść im przedłożył:' },
    { v: 24, cont: true, text: '«Królestwo niebieskie podobne jest do człowieka, który posiał dobre nasienie na swej roli.' },
    { v: 25 },
    { v: 26 },
  ],
  cam: { x: [-60, 60], y: [0, 90], z: [1, 1.2] },
  build(S) {
    const F = farmSet(S, { night: true });
    const c = F.c;

    /* the rows: blades first, then wheat and darnel */
    const wBlade = F.rows('blade');
    const dBlade = F.rows('dblade');
    const wheat = F.rows('wheat');
    const darnel = F.rows('darnel');

    /* servants asleep on the roof, the lamp in the window */
    const sleepers = [0, 1].map((i) => {
      const el = F.bld.add(`<g>${person(c, { ...SERVANTS[i], eyes: 'closed' })}</g>`);
      return { i, el };
    });

    /* the householder and the enemy */
    const basketB = sheet().p(c.cut([[-18, -4], [18, -4], [14, 20], [-14, 20]], 0.5, 5), C.basket).x(c.ribbon([[-16, 4], [16, 4]], 2.4), shade(C.basket, -0.3)).out();
    const master = S.puppet(F.ppl.add(person(c, { ...MASTER, holdB: `<g transform="translate(2 4)">${basketB}</g>` })));
    const sackE = sheet().p(c.cut(c.blob(0, 14, 15, 13, 10, 0.2), 0.6, 4), '#2b2640').out();
    const enemy = S.puppet(F.ppl.add(person(c, { ...ENEMY, holdB: `<g transform="translate(2 4)">${sackE}</g>` })));
    const seeds = [];
    for (let i = 0; i < 16; i++) seeds.push({ i, el: F.ppl.add(`<path d="${c.poly(c.ell(0, 0, 5, 3, 8, c.rr(0, 3)))}" fill="${C.wheat}"/>`), to: [FARM.X0 + 40 + i * 58 + c.rr(-10, 10), FARM.WHEAT[i % 3] + 2], t0: 1.1 + i * 0.045 });
    const bad = [];
    for (let i = 0; i < 12; i++) bad.push({ i, el: F.ppl.add(`<path d="${c.poly(c.ell(0, 0, 4.6, 2.8, 8, c.rr(0, 3)))}" fill="${shade('#3d3650', 0.2)}"/>`), to: [FARM.X1 - 40 - i * 78 + c.rr(-10, 10), FARM.DARNEL[i % 3] + 2], t0: 2.32 + i * 0.045 });

    /* the plate of "another parable" */
    const ic = `<g transform="translate(-14 34) scale(.72)">${wheatStalk(c, { h: 80 }).replace('class="stalk"', '')}</g><g transform="translate(16 34) scale(.72)">${darnelStalk(c, { h: 70 })}</g>`;
    const plate = hanging(F.ppl, `<g transform="scale(1.3)">${discPlate(c, ic, { r: 54 })}</g>`, { x: 0, y: 0, len: 900 });
    storyFrame(S);

    // phone: the householder and the enemy sow a shorter stretch of the path, inside the screen
    const MK = S.portrait ? [[0.35, 560], [1.0, 580], [1.95, 1040], [2.15, 1040], [2.3, 1040]] : [[0.35, 520], [1.0, 540], [1.95, 1120], [2.15, 1120], [2.3, 1120]];
    const EK = S.portrait ? [[2.2, 1700], [2.35, 1200], [2.9, 520], [3.0, -300]] : [[2.2, 1700], [2.35, 1320], [2.9, 380], [3.0, -300]];

    return (t, time) => {
      /* day → night → day */
      const nt = es(t, 2.0, 2.3) * (1 - es(t, 2.95, 3.25));
      F.nightL.fade(nt);
      F.starL.fade(nt);
      F.update(time, { sunY: 160 + nt * 500, moonY: lerp(-300, 170, nt) });
      fade(F.lit, es(t, 2.0, 2.15) * (1 - es(t, 2.35, 2.45)) * 0.9);
      sleepers.forEach((s) => pose(s.el, { x: FARM.HOUSE + 6 + s.i * 70, y: FARM.ROOF - 16, s: 0.4, r: -90, o: es(t, 2.15, 2.3) * (1 - es(t, 2.95, 3.1)) }));

      /* v24a — another parable: the plate comes down, then up */
      const pl = es(t, 0.0, 0.3, ease.back) * (1 - es(t, 0.9, 1.15));
      hangAt(plate, 800, lerp(-400, 300, pl), time, 1.5, 0.8);

      /* the householder: out of his house, then sowing along the path */
      const mx = kf(t, MK);
      const sow = t > 1.05 && t < 1.95 ? Math.abs(Math.sin((t - 1.05) * PI * 5)) : 0;
      master.set({
        x: mx, y: FARM.PATH, s: 1.0, flip: t > 1.95, o: es(t, 0.3, 0.45) * (1 - es(t, 2.0, 2.15)),
        walk: moving(t, MK) ? mx * 0.05 : undefined, armF: 20 + sow * 90 + bump(t, 0.5, 0.95) * 30, armB: 14, head: -sow * 4, blink: blinkAt(time),
      });
      seeds.forEach((s) => {
        const u = seg(t, s.t0, s.t0 + 0.14);
        const hx = kf(s.t0, MK) + 40, hy = FARM.PATH - 150;
        pose(s.el, { x: lerp(hx, s.to[0], u), y: lerp(hy, s.to[1], u) - Math.sin(u * PI) * 50, r: u * 300, o: u > 0 && u < 1 ? 1 : 0 });
      });

      /* v25 — night: the enemy sows darnel and goes away */
      const ex = kf(t, EK);
      const fling = t > 2.35 && t < 2.9 ? Math.abs(Math.sin((t - 2.35) * PI * 6)) : 0;
      enemy.set({
        x: ex, y: FARM.PATH, s: 1.0, flip: true, walk: moving(t, EK) ? ex * 0.06 : undefined, amt: 1.2, lean: -6,
        armF: 10 + fling * 80, armB: 10, head: 6 + bump(t, 2.4, 2.6) * 6, blink: blinkAt(time, 2),
      });
      bad.forEach((s) => {
        const u = seg(t, s.t0, s.t0 + 0.12);
        const hx = kf(s.t0, EK) - 40, hy = FARM.PATH - 150;
        pose(s.el, { x: lerp(hx, s.to[0], u), y: lerp(hy, s.to[1], u) - Math.sin(u * PI) * 40, r: -u * 300, o: u > 0 && u < 1 ? 1 : 0 });
      });

      /* v26 — blades, ears, and the darnel appears */
      const blade = es(t, 3.05, 3.3);
      const grow = es(t, 3.35, 3.65);
      const dar = es(t, 3.55, 3.75);
      wBlade.forEach((r) => growRow(r, blade, 1 - grow));
      dBlade.forEach((r) => growRow(r, blade, 1 - dar));
      wheat.forEach((r) => growRow(r, grow * 0.98 + 0.02, grow > 0.01 ? 1 : 0));
      darnel.forEach((r) => growRow(r, 0.3 + dar * 0.7, dar));

      S.cam.x = kf(t, [[0.3, 0], [0.6, -40], [1.1, -30], [1.95, 40], [2.3, 40], [2.9, -20], [3.2, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.1], [1.95, 1.08], [2.3, 1.06], [3.1, 1.04], [3.7, 1.14]]);
      S.cam.y = kf(t, [[0, 20], [0.6, 60], [3.1, 50], [3.7, 80]]);
    };
  },
};
