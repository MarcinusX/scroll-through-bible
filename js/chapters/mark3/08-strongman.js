// Mk 3,27 — parable of the strong man's house: a fortress with a padlocked door and a giant on
// guard. Nobody gets in — until a stronger one binds him with rope; then the lock falls, the door
// swings open and everything held inside is carried out into the light (the caged birds fly free).
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, flap, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, cloud, moon, stars, bush, cypress } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { handAt, headAt, sparkle } from './lib.js';

const PI = Math.PI;
const GROUND = 668;
const DOOR = [872, 470, 972];       // x0, top, x1 of the door

function padlock(c) {
  const s = sheet();
  s.p(c.ribbon(c.arc(0, -16, 12, 14, PI, 2 * PI, 12), 5), C.rock3);
  s.p(c.cut(c.rect(-17, -18, 34, 30), 0.4, 5), C.ochre);
  s.x(c.poly(c.circ(0, -6, 4, 8)) + c.poly([[-2, -4], [2, -4], [3, 4], [-3, 4]]), C.soilDark);
  return s.out();
}
function chest(c, w = 52) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -32, w, 32), 0.4, 5), C.wood);
  s.p(c.cut([[-w / 2, -32], ...c.arc(0, -32, w / 2, 14, PI, 2 * PI, 10), [w / 2, -32]], 0.4, 5), C.wood2);
  s.p(c.cut(c.rect(-4, -26, 8, 10), 0.2, 3), C.sun);
  s.x(c.ribbon([[-w / 2, -16], [w / 2, -16]], 3), C.ochre);
  return s.out();
}
function jar(c) {
  return sheet().p(c.cut([[-10, 0], [-16, -18], [-9, -34], [-7, -40], [7, -40], [9, -34], [16, -18], [10, 0]], 0.4, 5), C.pot).x(c.ribbon([[-14, -20], [14, -20]], 2), shade(C.pot, -0.2)).out();
}
function cage(c) {
  const s = sheet();
  let bars = '';
  for (let i = 0; i < 6; i++) bars += c.ribbon([[-20 + i * 8, 0], [-20 + i * 8, -40 + Math.abs(i - 2.5) * 3]], 1.6);
  s.p(bars + c.ribbon(c.arc(0, -40, 21, 12, PI, 2 * PI, 10), 2) + c.ribbon([[-22, 0], [22, 0]], 3), C.ochre);
  return s.out();
}

export default {
  id: 'm3-strongman',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 27, text: 'Nikt nie może wejść do domu mocarza i sprzęt mu zagrabić,' },
    { v: 27, cont: true, text: 'jeśli mocarza wpierw nie zwiąże,' },
    { v: 27, cont: true, text: 'i wtedy dom jego ograbi.' },
  ],
  cam: { x: [-20, 40], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const DUSK = [mix(C.indigo, C.duskViolet, 0.45), C.duskViolet, mix(C.dusk, C.duskViolet, 0.3)];
    const DAWN = [mix(C.skyBlue, C.duskViolet, 0.2), C.dawn, C.peach];
    const sk = sky(S, DUSK);
    const hangL = S.layer({ par: 0.04, sh: 3 });
    const starsEl = hangL.add(`<g>${stars(c, { x0: -500, x1: 2100, y0: -200, y1: 330, n: 50 })}</g>`);
    const moonEl = hanging(hangL, moon(c, 28), { x: 470, y: 170, len: 600 });

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [24, 9, 3], lens: [900, 300, 120], color: mix(C.hillFar, C.duskViolet, 0.4) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(hillsWith(c, { y: 540, amps: [14, 6, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.25), trees: 14, treeColor: mix(C.sage, C.duskViolet, 0.3), treeH: 20 }).markup);

    /* the strong man's house: a stone stronghold with a heavy door */
    const houseL = S.layer({ par: 0.34, sh: 5 });
    const hs = sheet();
    hs.p(c.cut([[-900, GROUND - 6], [2500, GROUND - 6], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand2, C.duskViolet, 0.15));
    const hx0 = 700, hx1 = 1160, top = 330;
    let crenel = [[hx0, GROUND], [hx0, top]];
    for (let x = hx0; x < hx1; x += 40) crenel.push([x, top], [x, top - 22], [x + 22, top - 22], [x + 22, top]);
    crenel.push([hx1, top], [hx1, GROUND]);
    hs.p(c.cut(crenel, 0.6, 8), C.stone2);
    let blocks = '';
    for (let r = 0; r < 9; r++) { const y = top + 16 + r * 36; blocks += c.ribbon([[hx0, y], [hx1, y + c.rr(-2, 2)]], 1.3); for (let x = hx0 + (r % 2) * 30; x < hx1; x += 60) blocks += c.ribbon([[x, y], [x, y + 36]], 1.2); }
    hs.x(blocks, shade(C.stone2, -0.15), 'opacity=".7"');
    // a barred window: inside, the goods and the caged birds
    hs.p(c.cut(c.rect(1010, 400, 100, 80), 0.4, 6), C.soilDark);
    hs.p(c.ribbon([[1035, 400], [1035, 480]], 5) + c.ribbon([[1060, 400], [1060, 480]], 5) + c.ribbon([[1085, 400], [1085, 480]], 5), C.rock3);
    // the doorway (dark until opened)
    hs.p(c.cut([[DOOR[0], GROUND], [DOOR[0], DOOR[1] + 40], ...c.arc((DOOR[0] + DOOR[2]) / 2, DOOR[1] + 40, (DOOR[2] - DOOR[0]) / 2, 40, PI, 2 * PI, 12), [DOOR[2], GROUND]], 0.5, 6), C.soilRich);
    houseL.add(hs.out());
    houseL.add(cypress(c, 660, GROUND, 150, mix(C.moss2, C.duskViolet, 0.2)) + rock(c, 1220, GROUND + 4, 90, 36, C.rock2));
    const glowIn = houseL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="60" ry="100" fill="url(#warm-glow)"/>${rays(c, { n: 14, r0: 30, r1: 210, spread: 0.05, color: '#fff3cf' }).replace('<path', '<path opacity=".35"')}</g>`);
    // the goods inside the doorway
    const goodsL = S.layer({ par: 0.34, sh: 4 });
    const GOODS = [
      { el: goodsL.add(`<g>${chest(c)}</g>`), x: 905, y: GROUND - 4, tx: 560, ty: GROUND + 34 },
      { el: goodsL.add(`<g>${jar(c)}</g>`), x: 940, y: GROUND - 4, tx: 610, ty: GROUND + 40 },
      { el: goodsL.add(`<g>${jar(c)}</g>`), x: 888, y: GROUND - 6, tx: 510, ty: GROUND + 38 },
    ];
    const CAGES = [0, 1].map((i) => ({ i, el: goodsL.add(`<g>${cage(c)}</g>`), x: [1045, 1080][i], y: 478 }));
    const BIRDS = [0, 1, 2].map((i) => ({ i, el: goodsL.add(bird(c, { color: [C.sun, C.skyVeil, C.cream][i] })), x: [1040, 1080, 1060][i], y: [466, 466, 470][i], ph: c.rr(0, 6) }));
    // the door itself, and its padlock
    const door = goodsL.add(`<g>${sheet().p(c.cut([[0, 0], [0, -(GROUND - DOOR[1]) + 40], ...c.arc((DOOR[2] - DOOR[0]) / 2, -(GROUND - DOOR[1]) + 40, (DOOR[2] - DOOR[0]) / 2, 40, PI, 2 * PI, 12), [DOOR[2] - DOOR[0], -(GROUND - DOOR[1]) + 40], [DOOR[2] - DOOR[0], 0]], 0.5, 6), C.wood).x(c.ribbon([[6, -60], [DOOR[2] - DOOR[0] - 6, -60]], 7) + c.ribbon([[6, -150], [DOOR[2] - DOOR[0] - 6, -150]], 7), C.wood2).x(c.ribbon([[30, -4], [30, -190]], 1.4) + c.ribbon([[60, -4], [60, -190]], 1.4), shade(C.wood, -0.25), 'opacity=".6"').out()}</g>`);
    const chain = goodsL.add(`<g>${sheet().x(c.ribbon([[-40, -8], [40, 8]], 4) + c.ribbon([[-40, 8], [40, -8]], 4), C.rock3).out()}</g>`);
    const lock = goodsL.add(`<g>${padlock(c)}</g>`);

    /* the strong man, and the stronger one */
    const act = S.layer({ par: 0.5, sh: 5 });
    const STRONG = { robe: C.clay, mantle: shade(C.clay, -0.2), belt: C.soilDark, skin: C.skin4, hair: C.hair3, hairStyle: 'bald', beard: 'wild', beardColor: C.hair3 };
    const club = `<g transform="rotate(-10)">${sheet().p(c.ribbon([[0, -10], [2, 70]], (u) => 5 + u * 9), C.wood2).out()}</g>`;
    const strong = S.puppet(act.add(person(c, { ...STRONG, holdF: club })));
    const strongSit = S.puppet(act.add(person(c, { ...STRONG, pose: 'sit' })));
    const ropeL = act.add(`<g opacity="0">${[0, 1, 2, 3].map((i) => `<g data-part="loop" data-i="${i}"><path d="${c.ribbon(c.arc(0, 0, 36, 9, 0, PI * 2, 20), 5)}" fill="${C.rope}"/></g>`).join('')}</g>`);
    const loops = Array.from(ropeL.querySelectorAll('[data-part="loop"]'));
    const knot = act.add(`<g opacity="0"><path d="${c.cut(c.circ(0, 0, 7, 10), 0.3, 3)}" fill="${shade(C.rope, -0.15)}"/><path d="${c.ribbon([[0, 0], [8, 22]], 4) + c.ribbon([[0, 0], [-6, 20]], 4)}" fill="${C.rope}"/></g>`);
    const heroGlow = act.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const coil = `<g transform="translate(0 6)">${sheet().p(c.ribbon(c.arc(0, 0, 12, 12, 0, PI * 2, 16), 4) + c.ribbon(c.arc(1, 2, 8, 8, 0, PI * 2, 12), 3.4), C.rope).out()}</g>`;
    const hero = S.puppet(act.add(person(c, { robe: C.linen, mantle: C.sun, hair: C.hairJesus, hairStyle: 'long', beard: 'short', skin: C.skin, holdF: coil })));
    const ropeLine = act.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [1, 0]], 3.4)}" fill="${C.rope}"/></g>`);
    const shine = act.add(`<g opacity="0">${sparkle(c, 18)}</g>`);

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 240, 960, 230, mix(C.sage, C.duskViolet, 0.2), mix(C.moss, C.duskViolet, 0.2)) + rock(c, 1350, 985, 200, 70, C.rock2) + grass(c, { x0: 0, x1: 1600, y: 930, n: 30, h: 22, color: C.moss }));

    return (t, time) => {
      const T = time;
      const dawn = es(t, 2.1, 2.9);
      sk.blend(DUSK, DAWN, dawn);
      fade(starsEl, 1 - dawn);
      swing(moonEl, 470, 170 - dawn * 300, T, 1, 0.5);

      /* beat 0: the stronger one comes — the giant blocks the door */
      const walkIn = es(t, 0.05, 0.45);
      const pushed = bump(t, 0.45, 0.8);
      const hx = lerp(360, 660, walkIn) - pushed * 60 + es(t, 1.02, 1.3) * 60;
      const bindArm = es(t, 1.1, 1.3) * (1 - es(t, 1.8, 2));
      const carry = es(t, 2.3, 2.5);
      hero.set({ x: hx, y: GROUND + 4, s: 0.95, walk: (walkIn > 0 && walkIn < 1) || (t > 1.02 && t < 1.3) ? hx * 0.05 : undefined, armF: 30 + bindArm * (50 + Math.sin(T * 6) * 20) + carry * 60, armB: pushed * 40 + carry * 120, lean: -pushed * 8, head: -2, blink: blinkAt(T, 3) });
      pose(heroGlow, { x: hx, y: GROUND - 150, o: 0.55 + es(t, 1, 1.5) * 0.3 });

      const bound = es(t, 1.2, 1.75);
      const sitDown = es(t, 1.82, 1.9);
      const block = es(t, 0.2, 0.45) * (1 - bound);
      const struggle = bump(t, 1.2, 1.85);
      strong.set({ x: 820, y: GROUND + 2, s: 1.52, flip: true, o: 1 - sitDown, armF: 20 + block * 90 - bound * 20 + struggle * Math.sin(T * 9) * 10, armB: block * 140 * (1 - bound) + bound * 10, head: -block * 6 + struggle * Math.sin(T * 7) * 6, lean: struggle * Math.sin(T * 8) * 3, blink: blinkAt(T, 7) });
      strongSit.set({ x: 800, y: GROUND + 4, s: 1.45, flip: true, o: sitDown, armF: 6, armB: 4, head: 8 + es(t, 2.2, 2.6) * 8, blink: 0.3 + blinkAt(T, 7) });
      // the rope winds round him, loop by loop
      const bx = sitDown > 0.5 ? 800 : 820, by = sitDown > 0.5 ? GROUND + 4 - 62 * 1.45 : GROUND + 2;
      fade(ropeL, bound > 0 ? 1 : 0);
      loops.forEach((lp, i) => {
        const k = es(t, 1.2 + i * 0.12, 1.36 + i * 0.12, ease.back);
        const yy = sitDown > 0.5 ? by - 24 + i * 22 : by - 150 * 1.52 + 44 + i * 34;
        pose(lp, { x: bx, y: yy, sx: k * (sitDown > 0.5 ? 1.2 : 1.16), sy: k, o: k > 0.02 ? 1 : 0 });
      });
      pose(knot, { x: bx - 30, y: sitDown > 0.5 ? by + 10 : by - 120, o: es(t, 1.66, 1.75) });
      const [rhx, rhy] = handAt(hx, GROUND + 4, 0.95, false, 30 + bindArm * 50);
      const rope0 = [bx - 34, sitDown > 0.5 ? by + 10 : by - 120];
      const rl = es(t, 1.15, 1.25) * (1 - es(t, 1.85, 1.95));
      pose(ropeLine, { x: rope0[0], y: rope0[1], sx: Math.hypot(rhx - rope0[0], rhy - rope0[1]) * rl, r: (Math.atan2(rhy - rope0[1], rhx - rope0[0]) * 180) / PI, o: rl > 0.01 ? 1 : 0 });

      /* the lock: rattles in beat 0, falls in beat 2; the door opens and all comes out */
      const rattle = bump(t, 0.3, 0.8) * Math.sin(T * 30) * 5;
      const unlock = es(t, 2.05, 2.3, ease.in);
      pose(lock, { x: (DOOR[0] + DOOR[2]) / 2 + 2, y: 560 + unlock * 110 + rattle * 0.3, r: rattle + unlock * 70, o: 1 - es(t, 2.4, 2.6) });
      pose(chain, { x: (DOOR[0] + DOOR[2]) / 2, y: 560 + unlock * 110, r: unlock * 40, o: 1 - es(t, 2.2, 2.4) });
      const open = es(t, 2.2, 2.45);
      pose(door, { x: DOOR[0], y: GROUND, sx: 1 - open * 0.82 });
      pose(glowIn, { x: (DOOR[0] + DOOR[2]) / 2, y: GROUND - 90, s: 0.6 + open * 0.6, r: T * 3, o: open });
      pose(shine, { x: (DOOR[0] + DOOR[2]) / 2, y: 520, s: 1 + Math.sin(T * 3) * 0.1, o: bump(t, 0.4, 0.95) * 0 + open * 0.9 });
      GOODS.forEach((g, i) => {
        const k = es(t, 2.4 + i * 0.08, 2.75 + i * 0.08);
        pose(g.el, { x: lerp(g.x, g.tx, k), y: lerp(g.y, g.ty, k) - Math.sin(k * PI) * 40, o: open > 0.2 ? 1 : 0 });
      });
      CAGES.forEach((cg) => pose(cg.el, { x: cg.x, y: cg.y, o: 1 }));
      BIRDS.forEach((b) => {
        const free = es(t, 2.35 + b.i * 0.07, 2.9 + b.i * 0.07, ease.in);
        pose(b.el, { x: b.x - free * (300 + b.i * 120), y: b.y - free * (330 + b.i * 60) + Math.sin(T * 2 + b.ph) * 4 * free, s: 0.5 + free * 0.4, sx: -1, o: 1 });
        if (free > 0 && free < 1) flap(b.el, T + b.ph);
      });

      S.cam.x = es(t, 0.9, 1.3) * 20 + es(t, 1.95, 2.3) * 20;
      S.cam.z = 1 + es(t, 0.9, 1.3) * 0.06;
      S.cam.y = es(t, 0.9, 1.3) * 20 - es(t, 1.95, 2.3) * 30;
    };
  },
};
