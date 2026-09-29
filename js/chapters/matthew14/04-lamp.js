// Mt 14,10–12a — told with restraint, as shadow-play: the king sends the guard; in the lit prison window John kneels
// in prayer, a helmeted shadow comes in beside him — and a dark cloth falls over the window, the candle goes out.
// A covered platter passes from the guard to the girl and from the girl to her mother. At dawn John's disciples
// carry his body to a tomb in the rock and roll the stone across.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { kf, moving, candle, crown, helmet, circlet, faceBits, withFace, platter, tombRock, tombStone, johnsOpts, storyFrame, SEPIA, L6, shadowPerson, shroud, tr, PI } from './lib.js';

const Y = 690;
const DOOR = 590;          // the banquet hall door
const WIN = { x: 850, y: 460, w: 100, h: 84 };   // the prison window (centre of its opening)
const TOMB = 1300;

export default {
  id: 'mt14-lamp',
  enter: 'fly',
  beats: [
    { v: 10 },
    { v: 11 },
    { v: 12, text: 'Uczniowie zaś Jana przyszli, zabrali jego ciało i pogrzebali je;' },
  ],
  cam: { x: [-80, 640], y: [0, 60], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    sky(S, [mix(SEPIA.sky[0], C.duskViolet, 0.55), mix(SEPIA.sky[1], C.dusk, 0.3), SEPIA.sky[2]]);
    const dawn = sky(S, [mix(SEPIA.sky[0], C.dawn, 0.4), mix(C.dawn, C.peach, 0.3), SEPIA.sky[2]], { name: 'dawn' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2600, y0: -400, y1: 360, n: 70, color: C.cream }));
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 34)}`, { x: 1000, y: 170, len: 800 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 460, amps: [30, 12, 4], lens: [900, 330, 120], color: mix(C.dune, C.duskViolet, 0.25) }).markup);

    /* ---------- the fortress wall: the hall door, the lit prison window; the tomb beyond ---------- */
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
    B.p(c.cut([[DOOR - 60, Y - 8], [DOOR - 60, 520], ...c.arc(DOOR, 520, 60, 52, PI, 2 * PI, 10), [DOOR + 60, Y - 8]], 0.5, 8), mix(C.lampFlame, C.apricot, 0.4));
    B.p(c.cut(c.rect(WIN.x + 110, Y - 130, 70, 122), 0.4, 6), C.wood2);
    walls.add(B.out());
    walls.add(`<g transform="translate(${DOOR} 0)"><circle cy="600" r="140" fill="url(#warm-glow)" opacity=".7"/></g>`);
    // the window: a warm lit opening (the light fades out when the candle does)
    const winPts = [[WIN.x - WIN.w, WIN.y + WIN.h], [WIN.x - WIN.w, WIN.y - 10], ...c.arc(WIN.x, WIN.y - 10, WIN.w, WIN.h * 0.9, PI, 2 * PI, 14), [WIN.x + WIN.w, WIN.y + WIN.h]];
    walls.add(`<g>${sheet().p(c.cut(winPts, 0.5, 8), mix(C.soilDark, C.wood2, 0.4)).out()}</g>`);
    const winLight = walls.add(`<g>${sheet().p(c.cut(winPts, 0.5, 8), mix(C.lampFlame, C.cream, 0.45)).out()}<circle cx="${WIN.x - 30}" cy="${WIN.y + 20}" r="90" fill="url(#warm-glow)"/></g>`);
    // shadow-play inside: John kneeling in prayer, and the guard's shadow that comes in beside him
    const INK = '#3b2a22';
    const johnSh = walls.add(`<g>${shadowPerson(c, { ...L6.john, pose: 'kneel' }, INK)}</g>`);
    const guardSh = walls.add(`<g>${withFace(shadowPerson(c, L6.guard, INK), sheet().p(c.cut([...c.arc(0, -2, 21, 21, PI * 0.98, PI * 2.02, 14), [21, -2], [-21, -2]], 0.4, 4), INK).p(c.cut([[-8, -22], [-2, -34], [8, -36], [4, -22]], 0.4, 3), INK).out())}<path d="${c.cut([[40, -86], [46, -86], [45, -10], [43, 0], [41, -10]], 0.2, 3)}" fill="${INK}"/></g>`);
    const cand = walls.add(`<g>${candle(c, 26)}</g>`);
    const flame = cand.querySelector('.flame'), glow = cand.querySelector('.glow');
    walls.add(`<g transform="translate(${WIN.x} ${WIN.y + WIN.h})">${sheet().p([-66, -22, 22, 66].map((x) => c.cut(c.rect(x - 4, -WIN.h * 1.9, 8, WIN.h * 1.9), 0.2, 6)).join('') + c.cut(c.rect(-WIN.w, -WIN.h - 10, WIN.w * 2, 7), 0.2, 6), mix(C.ink, C.storm, 0.4)).out()}</g>`);
    const cloth = walls.add(`<g>${sheet().p(c.cut([[-WIN.w - 8, 0], [WIN.w + 8, 0], [WIN.w + 6, 170], [40, 176], [0, 168], [-40, 176], [-WIN.w - 6, 170]], 0.8, 8), mix(C.plumRobe, C.ink, 0.45)).out()}</g>`);
    const smoke = walls.add(`<path d="${c.ribbon(c.cbez([0, 0], [10, -20], [-10, -40], [4, -70], 16), (u) => 4 - u * 3)}" fill="${C.stone}" opacity="0"/>`);
    walls.add(`<g transform="translate(${TOMB} ${Y - 8})">${tombRock(c, 420, 300)}</g>`);
    const stoneEl = walls.add(`<g>${tombStone(c, 60)}</g>`);

    /* ---------- people ---------- */
    const act = S.layer({ par: 0.5, sh: 5 });
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herod = S.puppet(act.add(hMark({ ...L6.herod })));
    const hSad = herod.el.querySelector('[data-part="sad"]');
    const covered = () => `<g transform="translate(4 4) rotate(90)">${platter(c, { covered: true, w: 80 })}</g>`;
    const herodias = S.puppet(act.add(withFace(person(c, { ...L6.herodias, holdF: covered() }), circlet(c))));
    const hdHold = herodias.el.querySelector('.hold');
    const girl = S.puppet(act.add(person(c, { ...L6.girl, holdF: covered() })));
    const gHold = girl.el.querySelector('.hold');
    const guard = S.puppet(act.add(withFace(person(c, { ...L6.guard, robe: mix(C.storm2, C.clay, 0.2), holdF: covered() }), helmet(c))));
    const guardHold = guard.el.querySelector('.hold');
    const DIS = [0, 1, 2, 3].map((i) => ({ i, o: johnsOpts(c), seed: c.rr(0, 6) }));
    DIS.slice(0, 2).forEach((d) => { d.p = S.puppet(act.add(person(c, d.o))); });
    const body = act.add(`<g>${shroud(c)}</g>`);
    DIS.slice(2).forEach((d) => { d.p = S.puppet(act.add(person(c, d.o))); });

    storyFrame(S);

    const carryX = [[2.05, 700], [2.45, TOMB - 60]];
    return (t, time) => {
      const T = time;
      const dawnK = es(t, 1.95, 2.5);
      dawn.fade(dawnK);
      starL.fade(1 - dawnK);
      swing(moonEl, 1000, 170 + dawnK * 400, T, 0.8, 0.5);

      /* v10 — the king sends; in the prison, John prays; a shadow comes; the cloth falls, the candle goes out */
      const send = bump(t, -0.2, 0.5);
      herod.set({ x: DOOR - 10, y: Y - 8, s: 0.98, o: 1 - es(t, 0.95, 1.1), armF: send * 95, armB: 10, head: 8, blink: blinkAt(T, 1) });
      attr(hSad, 'opacity', '0.9');
      const gKeys = [[0.0, DOOR + 40], [0.35, WIN.x + 145], [1.05, WIN.x + 145], [1.35, DOOR + 70]];
      const gx = kf(t, gKeys);
      const inside = es(t, 0.36, 0.42) * (1 - es(t, 1.02, 1.08));
      const carrying = t > 1.05 ? 1 : 0;
      const handOver = es(t, 1.35, 1.42);
      guard.set({ x: gx, y: Y + 6, s: 0.96, flip: t > 1.05, o: (1 - inside) * (1 - es(t, 1.5, 1.65)), walk: moving(t, gKeys) ? gx * 0.05 : undefined, armF: 20 + carrying * 60 * (1 - handOver), head: carrying * 14, blink: blinkAt(T, 5) });
      if (guardHold) guardHold.setAttribute('opacity', String(carrying * (1 - handOver)));
      pose(johnSh, { x: WIN.x - 20, y: WIN.y + WIN.h + 4, s: 0.56, sx: -1, o: 1 - es(t, 0.66, 0.7) });
      const gs = es(t, 0.42, 0.55);
      pose(guardSh, { x: WIN.x + 62 - gs * 12, y: WIN.y + WIN.h + 4, s: 0.56, sx: -1, o: gs * (1 - es(t, 0.66, 0.7)) });
      const fall = es(t, 0.56, 0.7, ease.in);
      pose(cloth, { x: WIN.x, y: WIN.y - WIN.h - 20 - (1 - fall) * 200, sy: Math.max(0.05, fall), o: fall > 0.01 ? 1 : 0 });
      const out = es(t, 0.68, 0.74);
      pose(cand, { x: WIN.x - 62, y: WIN.y + WIN.h - 2 });
      pose(flame, { x: 0, y: -46, sx: (1 - out) * (1 + Math.sin(T * 9) * 0.06), sy: (1 - out) * (1 + Math.sin(T * 11) * 0.1) });
      fade(glow, 1 - out);
      fade(winLight, 1 - out);
      const sm = seg(t, 0.7, 1.0);
      pose(smoke, { x: WIN.x - 62, y: WIN.y - WIN.h - 30 - sm * 40, o: Math.sin(sm * PI) * 0.8 });

      /* v11 — the covered platter: guard → girl → her mother */
      const gIn = es(t, 1.1, 1.25);
      const gHas = es(t, 1.35, 1.42) * (1 - es(t, 1.6, 1.67));
      girl.set({ x: lerp(DOOR - 60, DOOR + 10, gIn), y: Y - 2, s: 0.9, flip: t > 1.55, o: gIn * (1 - es(t, 1.95, 2.05)), armF: 20 + gHas * 50, head: 12 + gHas * 6, blink: blinkAt(T, 6) });
      if (gHold) gHold.setAttribute('opacity', String(gHas));
      const hdIn = es(t, 1.35, 1.5);
      const hdHas = es(t, 1.6, 1.67);
      herodias.set({ x: DOOR - 70, y: Y - 8, s: 0.94, flip: false, o: hdIn * (1 - es(t, 1.95, 2.05)), armF: 20 + hdHas * 50, blink: blinkAt(T, 4) });
      if (hdHold) hdHold.setAttribute('opacity', String(hdHas));

      /* v12a — at dawn his disciples carry him to the tomb, lay him there and close it */
      const cx = kf(t, carryX, (u) => u);
      const cm = moving(t, carryX);
      const laid = es(t, 2.45, 2.55);
      const roll = es(t, 2.55, 2.72);
      const bow = es(t, 2.72, 2.85);
      DIS.forEach((d) => {
        const off = [-70, 58, -46, 80][d.i];
        const x = t < 2.45 ? cx + off : lerp(cx + off, TOMB - 250 + d.i * 60 - (d.i > 1 ? 30 : 0), es(t, 2.45, 2.6));
        d.p.set({ x, y: Y + 6 + (d.i > 1 ? 8 : 0), s: 0.9, flip: t > 2.6, o: es(t, 1.95, 2.05), walk: cm || (t > 2.45 && t < 2.6) ? x * 0.05 + d.i : undefined, armF: laid < 1 ? 150 : 20 + bump(t, 2.55, 2.72) * (d.i === 1 ? 70 : 0), armB: laid < 1 ? 140 : 0, head: bow * 16, lean: bow * 6, blink: bow > 0.5 ? 0 : blinkAt(T, d.seed) });
      });
      pose(body, { x: cx + 6 + laid * 60, y: Y - 168 + Math.abs(Math.sin(cx * 0.05)) * 2 + laid * 20, o: es(t, 1.95, 2.05) * (1 - laid) });
      pose(stoneEl, { x: TOMB + 110 - roll * 110, y: Y - 68, r: -roll * 200 });

      S.cam.x = kf(t, [[0, -60], [0.3, 60], [1.05, 60], [1.3, -60], [1.95, -60], [2.4, 600]]);
      S.cam.z = kf(t, [[0, 1.06], [0.4, 1.24], [1.0, 1.24], [1.3, 1.08], [1.9, 1.1], [2.4, 1.1]]);
      S.cam.y = kf(t, [[0, 30], [0.4, 10], [1.0, 10], [1.3, 30], [3, 40]]);
    };
  },
};
