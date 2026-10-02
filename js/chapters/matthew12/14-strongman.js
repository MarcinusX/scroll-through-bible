// Mt 12,29 — the parable of the strong man, a painted flat at dusk. A grim stone house with a heavy door and barred
// windows, and faces behind the bars; the strong man sits before it in dark armour, a club across his knees. Nobody
// gets in — until a Stronger One comes up the path in light: the strong man leaps up and swings his club, but a golden
// cord loops round and round him and he stands bound. "Then he will plunder his house": the door swings open, and out
// of the dark come the prisoners, their chains dropping off, into the light.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, rock, grass, cloud, moon } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { club } from '../mark14/lib.js';
import { fetter } from '../mark5/lib.js';
import { DUSK, manOf, womanOf, handAt, headAt, kf, moving, glow, rayBurst, sparkle, tr, PI } from './lib.js';

const Y = 700;
const HX = 1000;       // the house
const DOOR = { x0: 930, x1: 1030, top: 530 };

/** the strong man's house: a stone keep with a door opening (hole) and two barred windows */
function keep(c) {
  const s = sheet();
  const st = mix(C.rock2, C.storm, 0.25);
  const doorPts = [[DOOR.x0, Y + 2], [DOOR.x0, DOOR.top + 40], ...c.arc((DOOR.x0 + DOOR.x1) / 2, DOOR.top + 40, (DOOR.x1 - DOOR.x0) / 2, 40, PI, 2 * PI, 10), [DOOR.x1, Y + 2]];
  const win = (x) => [[x, 470], [x, 430], ...c.arc(x + 25, 430, 25, 20, PI, 2 * PI, 8), [x + 50, 430], [x + 50, 470]];
  s.p(c.cut([[820, Y + 4], [820, 360], [1260, 360], [1260, Y + 4]], 0.8, 12) + c.hole(doorPts, 0.4, 6) + c.hole(win(860), 0.3, 5) + c.hole(win(1150), 0.3, 5), st);
  let blocks = '';
  for (let y = 380; y < Y; y += 30) for (let x = 826 + ((y / 30) % 2) * 22; x < 1250; x += 46) blocks += c.ribbon([[x, y], [x + 40, y]], 1.2);
  s.x(blocks, shade(st, -0.2), 'opacity=".6"');
  let bat = '';
  for (let x = 820; x < 1260; x += 40) bat += c.cut(c.rect(x, 336, 26, 26), 0.3, 4);
  s.p(bat, st);
  // bars on the windows
  let bars = '';
  [860, 1150].forEach((x) => { for (let k = 1; k < 4; k++) bars += c.ribbon([[x + k * 12.5, 414], [x + k * 12.5, 470]], 3); });
  s.p(bars, C.ink);
  return s.out();
}

export default {
  id: 'mt12-strongman',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 29, text: 'Albo jak może ktoś wejść do domu mocarza, i sprzęt mu zagrabić, jeśli mocarza wpierw nie zwiąże?' },
    { v: 29, cont: true, text: 'I dopiero wtedy dom Jego ograbi.' },
  ],
  cam: { x: [-40, 40], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DUSK);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const cl = hanging(hangL, cloud(c, 200, mix(C.cream, C.dusk, 0.35), mix(C.peach, C.duskViolet, 0.4)), { x: 600, y: 240, len: 900 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 480, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.35), trees: 10, treeColor: mix(C.sage2, C.duskViolet, 0.3), treeH: 18 }).markup);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.ridge(c.wave(Y - 20, [4, 2], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.duskViolet, 0.2)).p(c.ribbon([[200, Y + 40], [500, Y + 20], [800, Y + 10]], 50, 2), mix(C.sand, C.dusk, 0.2)).out() + rock(c, 420, Y, 90, 30, C.rock2) + grass(c, { x0: -600, x1: 2200, y: Y - 16, n: 30, h: 12, color: C.moss }));

    /* the house: the dark inside behind the door, the prisoners at the windows, the walls, the door leaf */
    const H = S.layer({ par: 0.36, sh: 5 });
    H.add(`<rect x="840" y="400" width="400" height="${Y - 398}" fill="${mix(C.soilRich, C.night2, 0.4)}"/>`);
    const inGlow = H.add(`<g opacity="0">${glow(200, 1)}</g>`);
    const faces = [[885, 452], [1175, 452]].map(([x, y], i) => H.add(`<g transform="translate(${x} ${y})"><path d="${c.cut(c.circ(0, 0, 13, 14), 0.3, 3)}" fill="${[C.skin2, C.skin3][i]}"/><path d="${c.cut(c.arc(0, -2, 14, 13, PI, 2 * PI, 8), 0.3, 3)}" fill="${C.hair3}"/></g>`));
    H.add(keep(c));
    const leaf = H.add(`<g>${sheet().p(c.cut([[0, 0], [DOOR.x1 - DOOR.x0, 0], [DOOR.x1 - DOOR.x0, -(Y - DOOR.top) + 40], [0, -(Y - DOOR.top) + 40]], 0.5, 6), C.wood2).p(c.ribbon([[6, -40], [DOOR.x1 - DOOR.x0 - 6, -40]], 6) + c.ribbon([[6, -120], [DOOR.x1 - DOOR.x0 - 6, -120]], 6), C.rock3).out()}</g>`);

    /* light streaming out of the open door */
    const out = S.layer({ par: 0.4, sh: 1, flat: true });
    const rays = out.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 30, r1: 300, spread: 0.05, color: '#fff3cf', o: 0.4 })}</g>`);
    /* the strong man and the Stronger One */
    const act = S.layer({ par: 0.45, sh: 5 });
    const STRONG = { robe: mix(C.storm2, C.soilDark, 0.3), mantle: mix(C.rock3, C.storm, 0.4), hair: C.hair3, hairStyle: 'wild', beard: 'full', skin: C.skin4, belt: C.rock3 };
    const sit = S.puppet(act.add(person(c, { ...STRONG, pose: 'sit', holdF: `<g transform="rotate(-80)">${club(c, 80)}</g>` })));
    const stand = S.puppet(act.add(person(c, { ...STRONG, holdF: `<g transform="rotate(-30)">${club(c, 80)}</g>` })));
    const rope = act.add(`<g opacity="0">${[0, 1, 2, 3].map((k) => `<path data-part="loop" d="${c.ribbon(c.arc(0, -40 - k * 26, 40, 9, -0.2, PI + 0.2, 12), 5)}" fill="${C.sun}"/>`).join('')}</g>`);
    const loops = Array.from(rope.querySelectorAll('[data-part="loop"]'));
    const aura = act.add(`<g opacity="0">${glow(170, 1, 'halo-glow')}</g>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const cord = act.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [1, 0]], 3)}" fill="${C.sun}"/></g>`);
    const PRIS = [manOf(c, { robe: mix(C.stone2, C.rock2, 0.4) }), womanOf(c, { robe: mix(C.roseRobe, C.rock2, 0.4), veil: C.stone }), manOf(c, { robe: mix(C.tealRobe, C.rock2, 0.4) })]
      .map((o, i) => ({ i, p: S.puppet(act.add(person(c, { ...o, holdF: `<g data-part="ch" transform="translate(0 4)">${fetter(c, 10)}</g>` }))) }));
    const chains = [0, 1, 2].map(() => act.add(`<g opacity="0">${fetter(c, 10)}</g>`));
    const sp = [0, 1, 2, 3].map(() => act.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    const jK = [[-0.6, 260], [0.3, 620]];
    const SX = 800;

    return (t, time) => {
      const T = time;
      pose(cl, { x: 600 + Math.sin(T * 0.1) * 20, y: 240, r: Math.sin(T * 0.6) * 1.1 });

      /* v29a — the Stronger One comes and binds the strong man */
      const jx = kf(t, jK, (u) => ease.sine(u));
      const up = es(t, 0.2, 0.26);
      const swing = bump(t, 0.3, 0.5);
      const bind = es(t, 0.42, 0.72);
      const bound = es(t, 0.7, 0.78);
      sit.set({ x: SX + 40, y: Y, s: 1.2, flip: true, o: 1 - up, armF: 30, armB: 10, head: -4 + es(t, 0.05, 0.2) * -6, blink: blinkAt(T, 4) });
      stand.set({ x: SX, y: Y, s: 1.22, flip: true, o: up, armF: 40 + swing * 110 - bind * 30, armB: 30 + swing * 40 - bind * 20, lean: -swing * 6 + bound * 4, head: -6 + bound * 12, blink: bound * 0.5 });
      pose(rope, { x: SX, y: Y - 24, s: 1.22, o: bind > 0.01 ? 1 : 0 });
      loops.forEach((lp, k) => pose(lp, { sx: seg(bind, k * 0.22, k * 0.22 + 0.3) + 0.001, o: seg(bind, k * 0.22, k * 0.22 + 0.05) }));
      const pull = bump(t, 0.4, 0.8);
      jesus.set({ x: jx, y: Y + 4, s: 1.06, flip: false, walk: moving(t, jK) ? jx * 0.055 : undefined, armF: 14 + es(t, 0.35, 0.45) * 70 - bound * 30 + es(t, 1.05, 1.3) * 40, armB: 10 + es(t, 0.35, 0.45) * 50 - bound * 20 + es(t, 1.05, 1.3) * 60, head: -2, lean: pull * -3, blink: blinkAt(T, 2) });
      pose(aura, { x: jx, y: Y - 110, o: es(t, -0.3, 0.2) });
      const [hx, hy] = handAt(jx, Y + 4, 1.06, false, 84);
      const th = bump(t, 0.4, 0.78);
      const tx = SX - 30, ty = Y - 110;
      pose(cord, { x: hx, y: hy, sx: Math.hypot(tx - hx, ty - hy) * th, r: (Math.atan2(ty - hy, tx - hx) * 180) / PI, o: th > 0.02 ? 1 : 0 });

      /* v29b — the door opens; the prisoners walk out free */
      const open = es(t, 1.02, 1.2);
      pose(leaf, { x: DOOR.x0, y: Y + 2, sx: 1 - open * 0.85 });
      pose(inGlow, { x: (DOOR.x0 + DOOR.x1) / 2, y: 610, o: open });
      pose(rays, { x: (DOOR.x0 + DOOR.x1) / 2, y: 620, s: 0.6 + open * 0.6, r: T * 4, o: open * 0.9 });
      faces.forEach((f) => fade(f, 1 - open));
      const DEST = S.portrait ? [[880, Y + 26], [960, Y + 36], [1040, Y + 26]] : [[905, Y + 26], [1000, Y + 36], [1095, Y + 26]];   // phone: the freed stay clear of the thread
      PRIS.forEach((m) => {
        const k = es(t, 1.15 + m.i * 0.1, 1.45 + m.i * 0.1);
        const [dx, dy] = DEST[m.i];
        const x = lerp(980, dx, k), y = lerp(Y - 4, dy, k);
        const free = es(t, 1.4 + m.i * 0.08, 1.5 + m.i * 0.08);
        m.p.set({ x, y, s: lerp(0.86, 0.96, k), flip: m.i === 0, o: es(t, 1.12 + m.i * 0.1, 1.2 + m.i * 0.1), walk: k > 0 && k < 1 ? x * 0.08 + m.i : undefined, armF: 40 + free * 60, armB: 20 + free * 120, head: -free * 8, blink: blinkAt(T, m.i) });
        fade(m.p.el.querySelector('[data-part="ch"]'), 1 - free);
        const ck = es(t, 1.4 + m.i * 0.08, 1.6 + m.i * 0.08, ease.in);
        const [hx2, hy2] = handAt(dx, dy, 0.96, m.i === 0, 40);
        pose(chains[m.i], { x: hx2, y: hy2 + ck * 60, r: ck * 90, o: ck > 0.01 ? 1 : 0 });
      });
      sp.forEach((s_, i) => {
        const k = es(t, 1.5 + i * 0.05, 1.7 + i * 0.05, ease.back);
        pose(s_, { x: [880, 960, 1050, 1130][i], y: [470, 430, 440, 470][i], s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.6, -40], [0.3, -10], [0.9, -10], [1.2, 20]]);
      S.cam.z = kf(t, [[-0.6, 1.04], [0.3, 1.08], [0.9, 1.08], [1.2, 1.06]]);
      S.cam.y = kf(t, [[-0.6, 20], [0.3, 30], [1.2, 20]]);
    };
  },
};
