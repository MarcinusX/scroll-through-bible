// Mk 6,27–29 — told with restraint: the guard is sent, a cloth falls over the prison window and John's
// candle goes out; a covered platter passes from hand to hand; at dawn his disciples carry him to a tomb.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, candle, crown, helmet, circlet, faceBits, withFace, platter, tombRock, tombStone, johnsOpts, storyFrame, SEPIA, LOOK } from './lib.js';

const PI = Math.PI;
const Y = 690;
const DOOR = 520;          // the banquet hall door
const WIN = { x: 830, y: 470 };
const TOMB = 1300;

function shroud(c, w = 170) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], ...c.arc(-w / 2 + 16, -14, 16, 15, PI * 0.5, PI * 1.5, 8), [w / 2 - 14, -28], ...c.arc(w / 2 - 14, -14, 14, 14, -PI * 0.5, PI * 0.5, 8)], 0.6, 6), C.linen);
  let b = '';
  [-0.3, 0, 0.28].forEach((f) => { b += c.ribbon([[w * f, -29], [w * f + 3, 1]], 3); });
  s.x(b, C.rope, 'opacity=".8"');
  s.x(c.ribbon([[-w / 2 + 10, -8], [w / 2 - 10, -8]], 2), C.linen2, 'opacity=".7"');
  return s.out();
}

export default {
  id: 'm6-tomb',
  enter: 'fly',
  beats: [
    { v: 27, text: 'Zaraz też król posłał kata i polecił przynieść głowę Jana.' },
    { v: 27, cont: true, text: 'Ten poszedł, ściął go w więzieniu' },
    { v: 28, text: 'i przyniósł głowę jego na misie;' },
    { v: 28, cont: true, text: 'dał ją dziewczęciu, a dziewczę dało swej matce.' },
    { v: 29 },
  ],
  cam: { x: [-220, 640], y: [0, 60], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const DUSK = [mix(SEPIA.sky[0], C.duskViolet, 0.55), mix(SEPIA.sky[1], C.dusk, 0.3), SEPIA.sky[2]];
    sky(S, DUSK);
    const dawn = sky(S, [mix(SEPIA.sky[0], C.dawn, 0.4), mix(C.dawn, C.peach, 0.3), SEPIA.sky[2]], { name: 'dawn' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2600, y0: -400, y1: 360, n: 70, color: C.cream }));
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 34)}`, { x: 1000, y: 170, len: 800 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 460, amps: [30, 12, 4], lens: [900, 330, 120], color: mix(C.dune, C.duskViolet, 0.25) }).markup);

    /* ---------- the fortress wall with the hall door and the prison window; the tomb beyond ---------- */
    const walls = S.layer({ par: 0.45, sh: 3 });
    const B = sheet();
    const stone = mix(C.stone2, C.dune, 0.35);
    B.p(c.ridge(c.wave(Y - 20, [3, 1], [600, 150]), -900, 2600, 1700, 12, 1), mix(C.sand, C.sand2, 0.5));
    B.p(c.cut([[-600, Y - 10], [-600, 330], [1010, 330], [1010, Y - 10]], 1, 12), stone);
    let bl = '';
    for (let y = 334; y < Y - 20; y += 34) for (let x = -590 + (Math.round(y / 34) % 2) * 30; x < 1000; x += 64) bl += c.cut(c.rect(x, y, 56, 28), 0.6, 8);
    B.p(bl, shade(stone, 0.12));
    let cren = '';
    for (let x = -600; x < 1010; x += 46) cren += c.cut(c.rect(x, 300, 28, 32), 0.5, 5);
    B.p(cren, stone);
    // the hall door (warm light inside)
    B.p(c.cut([[DOOR - 60, Y - 8], [DOOR - 60, 520], ...c.arc(DOOR, 520, 60, 52, PI, 2 * PI, 10), [DOOR + 60, Y - 8]], 0.5, 8), mix(C.lampFlame, C.apricot, 0.4));
    // the prison window
    B.p(c.cut([[WIN.x - 50, WIN.y + 60], [WIN.x - 50, WIN.y - 20], ...c.arc(WIN.x, WIN.y - 20, 50, 40, PI, 2 * PI, 10), [WIN.x + 50, WIN.y + 60]], 0.5, 8), mix(C.soilDark, C.wood2, 0.4));
    // prison door
    B.p(c.cut(c.rect(WIN.x + 90, Y - 130, 70, 122), 0.4, 6), C.wood2);
    walls.add(B.out());
    walls.add(`<g transform="translate(${DOOR} 0)"><circle cy="600" r="140" fill="url(#warm-glow)" opacity=".7"/></g>`);
    const cand = walls.add(`<g>${candle(c, 34)}</g>`);
    const flame = cand.querySelector('.flame'), glow = cand.querySelector('.glow');
    walls.add(`<g transform="translate(${WIN.x} ${WIN.y + 60})">${sheet().p([-36, -12, 12, 36].map((x) => c.cut(c.rect(x - 4, -120, 8, 120), 0.2, 6)).join('') + c.cut(c.rect(-50, -70, 100, 7), 0.2, 6), mix(C.ink, C.storm, 0.4)).out()}</g>`);
    const cloth = walls.add(`<g>${sheet().p(c.cut([[-60, 0], [60, 0], [58, 150], [30, 156], [0, 150], [-30, 156], [-58, 150]], 0.8, 8), mix(C.plumRobe, C.ink, 0.45)).out()}</g>`);
    const smoke = walls.add(`<path d="${c.ribbon(c.cbez([0, 0], [10, -20], [-10, -40], [4, -70], 16), (u) => 4 - u * 3)}" fill="${C.stone}" opacity="0"/>`);
    // the tomb in the rock
    walls.add(`<g transform="translate(${TOMB} ${Y - 8})">${tombRock(c, 420, 300)}</g>`);
    const stoneEl = walls.add(`<g>${tombStone(c, 60)}</g>`);

    /* ---------- people ---------- */
    const act = S.layer({ par: 0.5, sh: 5 });
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herod = S.puppet(act.add(hMark({ ...LOOK.herod })));
    const hSad = herod.el.querySelector('[data-part="sad"]');
    const herodias = S.puppet(act.add(withFace(person(c, { ...LOOK.herodias, holdF: `<g transform="translate(4 4) rotate(90)">${platter(c, { covered: true, w: 80 })}</g>` }), circlet(c))));
    const hdHold = herodias.el.querySelector('.hold');
    const girl = S.puppet(act.add(person(c, { ...LOOK.girl, holdF: `<g transform="translate(4 4) rotate(90)">${platter(c, { covered: true, w: 80 })}</g>` })));
    const gHold = girl.el.querySelector('.hold');
    const guard = S.puppet(act.add(withFace(person(c, { ...LOOK.guard, robe: mix(C.storm2, C.clay, 0.2), holdF: `<g transform="translate(4 4) rotate(90)">${platter(c, { covered: true, w: 80 })}</g>` }), helmet(c))));
    const guardHold = guard.el.querySelector('.hold');
    // John's disciples and the body
    const DIS = [0, 1, 2, 3].map((i) => ({ i, o: johnsOpts(c), seed: c.rr(0, 6) }));
    DIS.slice(0, 2).forEach((d) => { d.p = S.puppet(act.add(person(c, d.o))); });
    const body = act.add(`<g>${shroud(c)}</g>`);
    DIS.slice(2).forEach((d) => { d.p = S.puppet(act.add(person(c, d.o))); });

    storyFrame(S);

    const carryX = [[3.95, 700], [4.4, TOMB - 60]];
    return (t, time) => {
      const T = time;
      const dawnK = es(t, 3.9, 4.6);
      dawn.fade(dawnK);
      starL.fade(1 - dawnK);
      swing(moonEl, 1000, 170 + dawnK * 400, T, 0.8, 0.5);

      /* v27a — the king sends the guard */
      const send = bump(t, -0.1, 0.9);
      herod.set({ x: DOOR - 10, y: Y - 8, s: 0.98, o: 1 - es(t, 1.0, 1.2), armF: send * 95, armB: 10, head: 6, blink: blinkAt(T, 1) });
      attr(hSad, 'opacity', '0.9');
      const gKeys = [[0.2, DOOR + 40], [0.95, WIN.x + 125], [1.25, WIN.x + 125], [1.95, WIN.x + 125], [2.6, DOOR + 70]];
      const gx = kf(t, gKeys);
      const inside = es(t, 1.0, 1.1) * (1 - es(t, 1.9, 2.0));
      const carrying = t > 1.95 ? 1 : 0;
      const handOver = es(t, 3.1, 3.2);
      guard.set({ x: gx, y: Y + 6, s: 0.96, flip: t > 1.95, o: (1 - inside) * (1 - es(t, 3.3, 3.5)), walk: moving(t, gKeys) ? gx * 0.05 : undefined, armF: 20 + carrying * 60 * (1 - handOver), head: carrying * 14, blink: blinkAt(T, 5) });
      if (guardHold) guardHold.setAttribute('opacity', String(carrying * (1 - handOver)));

      /* v27b — a cloth falls over the window; the candle goes out */
      const fall = es(t, 1.3, 1.55, ease.in);
      pose(cloth, { x: WIN.x, y: WIN.y - 70 - (1 - fall) * 200, sy: Math.max(0.05, fall), o: fall > 0.01 ? 1 : 0 });
      const out = es(t, 1.5, 1.6);
      pose(cand, { x: WIN.x, y: WIN.y + 52 });
      pose(flame, { x: 0, y: -54, sx: (1 - out) * (1 + Math.sin(T * 9) * 0.06), sy: (1 - out) * (1 + Math.sin(T * 11) * 0.1) });
      fade(glow, 1 - out);
      const sm = seg(t, 1.55, 1.95);
      pose(smoke, { x: WIN.x, y: WIN.y - 20 - sm * 40, o: Math.sin(sm * PI) * 0.7 * (fall > 0.99 ? 0 : 1) + Math.sin(sm * PI) * 0.4 });

      /* v28 — the covered platter: guard → girl → her mother */
      const gIn = es(t, 2.6, 2.8);
      const gHas = es(t, 3.1, 3.2) * (1 - es(t, 3.5, 3.6));
      girl.set({ x: lerp(DOOR - 60, DOOR + 10, gIn), y: Y - 2, s: 0.9, flip: t > 3.35, o: gIn * (1 - es(t, 3.95, 4.1)), armF: 20 + gHas * 50, head: 12 + gHas * 6, blink: blinkAt(T, 6) });
      if (gHold) gHold.setAttribute('opacity', String(gHas));
      const hdIn = es(t, 3.1, 3.3);
      const hdHas = es(t, 3.5, 3.6);
      herodias.set({ x: DOOR - 60, y: Y - 8, s: 0.94, flip: false, o: hdIn * (1 - es(t, 3.95, 4.1)), armF: 20 + hdHas * 50, blink: blinkAt(T, 4) });
      if (hdHold) hdHold.setAttribute('opacity', String(hdHas));

      /* v29 — at dawn his disciples carry him to the tomb and close it */
      const cx = kf(t, carryX, (u) => u);
      const cm = moving(t, carryX);
      const laid = es(t, 4.4, 4.55);
      const roll = es(t, 4.55, 4.8);
      const bow = es(t, 4.8, 5.0);
      DIS.forEach((d) => {
        const off = [-70, 58, -46, 80][d.i];
        const x = t < 4.4 ? cx + off : lerp(cx + off, TOMB - 250 + d.i * 60 - (d.i > 1 ? 30 : 0), es(t, 4.4, 4.6));
        d.p.set({ x, y: Y + 6 + (d.i > 1 ? 8 : 0), s: 0.9, flip: t > 4.6, o: es(t, 3.9, 4.0), walk: cm || (t > 4.4 && t < 4.6) ? x * 0.05 + d.i : undefined, armF: laid < 1 ? 150 : 20 + bump(t, 4.55, 4.8) * (d.i === 1 ? 70 : 0), armB: laid < 1 ? 140 : 0, head: bow * 16, lean: bow * 6, blink: bow > 0.5 ? 0 : blinkAt(T, d.seed) });
      });
      pose(body, { x: cx + 6 + laid * 60, y: Y - 168 + Math.abs(Math.sin(cx * 0.05)) * 2 + laid * 20, o: es(t, 3.9, 4.0) * (1 - laid) });
      pose(stoneEl, { x: TOMB + 110 - roll * 110, y: Y - 68, r: -roll * 200 });

      // phone: the king at his door, and Herodias taking the platter, inside the screen
      S.cam.x = S.portrait ? kf(t, [[0, -200], [0.75, -150], [0.95, 80], [1.9, 80], [2.6, -160], [3.9, -160], [4.4, 600]]) : kf(t, [[0, -110], [0.6, -60], [0.9, 80], [1.9, 80], [2.6, -60], [3.9, -60], [4.4, 600]]);
      S.cam.z = kf(t, [[0, 1.08], [1.2, 1.14], [1.9, 1.14], [2.6, 1.08], [3.6, 1.12], [4.4, 1.1]]);
      S.cam.y = kf(t, [[0, 30], [5, 40]]);
    };
  },
};
