// Mk 3,13–15 — the mountain at dawn: Jesus climbs up, calls those he wants by threads of light,
// they climb to him; he makes them the Twelve, to be with him, to be sent out to preach —
// and gives them authority over the dark.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, town, sun, cloud, flowers, cypress, olive, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { TWELVE, man, woman, along, headAt, handAt, spark, wisp, strip, scrollRoll } from './lib.js';

const PI = Math.PI;
const PAR = 0.35;
const TOP = 392;                   // the summit plateau
const FOOT = 668;                  // the foot of the mountain
const PATH = [[800, FOOT - 6], [676, 612], [906, 548], [712, 486], [860, 428], [800, TOP]];
const SLOTS = [
  // front row (nearer), back row (further up)
  [700, TOP + 8, 0.56], [640, TOP + 10, 0.56], [580, TOP + 12, 0.55], [900, TOP + 8, 0.56], [960, TOP + 10, 0.56], [1020, TOP + 12, 0.55],
  [672, TOP - 18, 0.5], [612, TOP - 16, 0.5], [552, TOP - 12, 0.49], [928, TOP - 18, 0.5], [988, TOP - 16, 0.5], [1048, TOP - 12, 0.49],
];

export default {
  id: 'm3-mountain',
  beats: [
    { v: 13, text: 'Potem wyszedł na górę' },
    { v: 13, cont: true, text: 'i przywołał do siebie tych, których sam chciał,' },
    { v: 13, cont: true, text: 'a oni przyszli do Niego.' },
    { v: 14, text: 'I ustanowił Dwunastu, aby Mu towarzyszyli,' },
    { v: 14, cont: true, text: 'by mógł wysyłać ich na głoszenie nauki,' },
    { v: 15 },
  ],
  cam: { x: [-20, 20], y: [-80, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const DAWN = [mix(C.duskViolet, C.skyBlue, 0.4), C.dawn, C.peach];
    const DAY = [C.skyBlue, mix(C.cream, C.skyBlue, 0.3), C.dawn];
    const sk = sky(S, DAWN);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 54), { x: 1120, y: 300, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 180, C.cream, C.peach), { x: 470, y: 170, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130, C.cream, C.peach), { x: 1180, y: 120, len: 600 });

    /* distant ranges */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [30, 12, 4], lens: [900, 300, 120], color: mix(C.hillFar, C.lavender, 0.3) }).markup);
    const far = S.layer({ par: 0.16, sh: 3 });
    const fh = hillsWith(c, { y: 540, amps: [22, 9, 3], lens: [800, 280, 110], color: mix(C.hillMid, C.lavender, 0.12), trees: 24, treeColor: C.sage, treeH: 20 });
    far.add(fh.markup);

    /* ---------- the mountain ---------- */
    const mt = S.layer({ par: PAR, sh: 4 });
    const s = sheet();
    const prof = [[-900, 1700], [-900, 700], [120, 690], [300, 640], [430, 560], [520, 460], [560, 412], [600, TOP + 6], [700, TOP - 2], [800, TOP - 6], [900, TOP - 2], [1000, TOP + 4], [1040, 410], [1090, 460], [1190, 560], [1320, 640], [1500, 690], [2500, 700], [2500, 1700]];
    s.p(c.cut(prof, 1.6, 12), C.hillNear);
    s.p(c.cut([[430, 560], [520, 460], [560, 412], [600, TOP + 6], [640, 420], [600, 520], [520, 620], [420, 680], [300, 690]], 1.2, 10), shade(C.hillNear, -0.08), 'opacity=".8"');
    s.p(c.cut([[1000, TOP + 4], [1040, 410], [1090, 460], [1190, 560], [1320, 640], [1250, 690], [1110, 620], [1020, 500], [980, 430]], 1.2, 10), shade(C.hillNear, 0.1), 'opacity=".7"');
    // the path zig-zagging up
    s.p(c.ribbon(PATH.map(([x, y]) => [x, y + 4]), 14, 2), mix(C.sand, C.hillNear, 0.35));
    s.p(c.cut(c.ell(800, TOP + 2, 250, 16, 20), 0.8, 8), mix(C.sage2, C.hillNear, 0.4));
    mt.add(s.out());
    mt.add(rock(c, 520, 520, 60, 30, C.rock) + rock(c, 1090, 520, 70, 34, C.rock2) + rock(c, 660, 640, 50, 20) + cypress(c, 540, 470, 90, C.moss2) + cypress(c, 1070, 480, 110, C.moss2) + olive(c, 380, 640, 0.7) + olive(c, 1250, 650, 0.75));
    mt.add(grass(c, { x0: 300, x1: 1300, y: 600, n: 30, h: 12, color: C.olive, fn: (x) => 600 + Math.abs(x - 800) * 0.1 }));
    mt.add(flowers(c, { x0: 560, x1: 1040, y: TOP + 4, n: 16, h: 12 }));
    // two villages in the valley, and the ground at the foot
    const vil = sheet();
    vil.p(c.cut([[-900, FOOT + 10], [2500, FOOT + 10], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sage2, C.sand, 0.4));
    mt.add(vil.out());
    const TOWNS = [[492, 628], [1108, 628]];
    mt.add(town(c, { x: TOWNS[0][0], y: TOWNS[0][1], n: 5, spread: 150, sc: 0.8 }) + town(c, { x: TOWNS[1][0], y: TOWNS[1][1], n: 5, spread: 150, sc: 0.8 }));

    /* roads down to the villages (drawn on in beat 4) */
    const roadL = S.layer({ par: PAR, sh: 1, flat: true });
    const ROADS = [
      [[640, TOP + 6], [600, 440], [570, 520], [555, 590], [540, 640]],
      [[960, TOP + 6], [1000, 440], [1030, 520], [1045, 590], [1060, 640]],
    ];
    const roads = ROADS.map((r) => {
      const d = 'M' + r.map(([x, y]) => `${x} ${y}`).join('L');
      let len = 0;
      for (let i = 1; i < r.length; i++) len += Math.hypot(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]);
      const el = roadL.add(`<g><path d="${d}" fill="none" stroke="${C.sun}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${len.toFixed(0)}" stroke-dashoffset="${len.toFixed(0)}" opacity=".85"/></g>`);
      return { el, path: el.firstElementChild, len };
    });
    // dark things over the villages, that flee in beat 5
    const WISPS = [];
    TOWNS.forEach(([x, y], ti) => { for (let k = 0; k < 3; k++) WISPS.push({ ti, k, x: x - 40 + k * 40, y: y - 60 - (k % 2) * 16, el: roadL.add(`<g opacity="0">${wisp(c, 0.8)}</g>`), seed: c.rr(0, 6) }); });

    /* ---------- people ---------- */
    const folk = S.layer({ par: PAR, sh: 3 });
    // the crowd that stays below
    const OTHERS = [];
    [[640, 0.56], [700, 0.58], [752, 0.55], [860, 0.57], [915, 0.56], [968, 0.55]].forEach(([x, s0], i) => {
      OTHERS.push({ x, y: FOOT + 12 + (i % 3) * 8, s: s0, flip: x > 800, seed: c.rr(0, 9), p: S.puppet(folk.add(person(c, crowdPerson(c)))), sit: S.puppet(folk.add(person(c, { ...crowdPerson(c), pose: 'sit' }))) });
    });
    // the chosen, waiting in the crowd at first
    const FOOTX = [590, 650, 730, 870, 950, 1010, 540, 680, 760, 840, 920, 1060];
    const glowL = S.layer({ par: PAR, sh: 1, flat: true });
    const threads = S.layer({ par: PAR, sh: 1, flat: true });
    const AP = TWELVE.map((a, i) => ({
      ...a, i, fx: FOOTX[i], fy: FOOT + (i < 6 ? 0 : -14), slot: SLOTS[i], seed: c.rr(0, 9), delay: (i % 6) * 0.07 + (i < 6 ? 0 : 0.04),
      glow: glowL.add(`<g opacity="0">${spark(c, 10)}</g>`),
      line: threads.add(`<g opacity="0"><path d="" fill="none" stroke="${C.sun}" stroke-width="2.4" stroke-dasharray="6 7" stroke-linecap="round"/></g>`),
    }));
    AP.forEach((a) => {
      a.p = S.puppet(folk.add(person(c, { ...a.o, holdF: `<g transform="translate(0 6) rotate(90) scale(.7)">${scrollRoll(c)}</g>` })));
      a.hand = folk.add(`<g opacity="0">${spark(c, 9)}</g>`);
      a.lp = a.line.querySelector('path');
      a.side = [0, 1, 2, 6, 7, 8].includes(a.i) ? 0 : 1;
      a.rank = a.side === 0 ? [0, 1, 2, 6, 7, 8].indexOf(a.i) : [3, 4, 5, 9, 10, 11].indexOf(a.i);
      a.town = [a.side ? 1132 - a.rank * 27 : 468 + a.rank * 27, 660 + (a.rank % 2) * 10];
    });
    const voices = [0, 1].map((side) => glowL.add(`<g opacity="0">${[0, 1, 2].map((i) => `<path data-part="w" d="${c.ribbon(c.arc(0, 0, 22 + i * 14, 22 + i * 14, -0.8, 0.8, 10), 4)}" fill="${C.cream}"/>`).join('')}</g>`));
    const jesus = S.puppet(folk.add(person(c, { ...CAST.jesus })));
    const ring = glowL.add(`<g opacity="0"><ellipse rx="300" ry="34" fill="url(#warm-glow)"/></g>`);
    const tagL = S.layer({ par: 0.3, sh: 6 });
    const tag = hanging(tagL, `<g transform="translate(0 20)">${strip(c, tr('Dwunastu', 'the Twelve'), { size: 26 })}</g>`, { x: 800, y: 150, len: 700 });

    /* foreground */
    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(bush(c, 260, 960, 220, C.sage, C.moss) + bush(c, 1360, 970, 240, C.sage, C.moss) + rock(c, 1180, 980, 160, 60, C.rock2));

    return (t, time) => {
      const T = time;
      sk.blend(DAWN, DAY, es(t, 0, 3, ease.sine));
      swing(sunEl, 1120, 300 - es(t, -0.3, 2.5) * 150, T, 1, 0.6);
      swing(cl1, 470 + t * 8, 170, T, 1.4, 0.6, 1);
      swing(cl2, 1180 - t * 6, 120, T, 1.4, 0.7, 2);

      /* Jesus climbs to the top, calls, appoints, sends */
      const climb = es(t, 0.05, 0.9, ease.sine);
      const [cx, cy, cdir] = along(PATH, climb);
      const call = es(t, 1.05, 1.3) * (1 - es(t, 2.6, 2.9));
      const appoint = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      const send = bump(t, 4.0, 4.9);
      const bless = es(t, 5.0, 5.3);
      jesus.set({
        x: cx, y: cy, s: lerp(0.62, 0.6, climb), flip: climb < 1 ? cdir < 0 : false,
        walk: climb > 0 && climb < 1 ? climb * 70 : undefined, amt: 0.7,
        armF: 10 + call * 80 + appoint * 60 + send * 90 + bless * 70 + bump(t, 1.2, 1.6) * 20 * Math.sin(T * 6),
        armB: 8 + call * 30 + appoint * 60 + send * 20 + bless * 140,
        head: -2 + call * 8 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2),
      });
      const [jhx, jhy] = handAt(cx, cy, 0.6, false, 90);

      /* the crowd below: looks up, then sits down */
      OTHERS.forEach((m, i) => {
        const sit = es(t, 3.05 + i * 0.03, 3.12 + i * 0.03);
        const look = es(t, 0.3, 0.8);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, o: 1 - sit, head: -look * 10, armF: bump(t, 1.1 + i * 0.05, 2) * 40, blink: blinkAt(T, m.seed) });
        m.sit.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, o: sit, head: -8, blink: blinkAt(T, m.seed) });
      });

      /* the Twelve: called by a thread of light, climb, gather, go out */
      AP.forEach((a) => {
        const chosen = es(t, 1.15 + a.i * 0.035, 1.3 + a.i * 0.035);
        const up = seg(t, 2.02 + a.delay, 2.8 + a.delay * 0.5);
        const down = seg(t, 4.1 + a.rank * 0.04, 4.6 + a.rank * 0.03);
        let x, y, s0, flip, walk;
        if (down > 0) {
          const road = ROADS[a.side];
          const [rx, ry, rd] = along([[a.slot[0], a.slot[1]], ...road, a.town], ease.io(down));
          x = rx; y = ry; s0 = lerp(a.slot[2], 0.56, down); flip = down < 1 ? rd < 0 : a.side === 1; walk = down > 0 && down < 1 ? down * 90 : undefined;
        } else if (up > 0) {
          const [px, py, pd] = along([[a.fx, a.fy], ...PATH.slice(0, -1), [a.slot[0], a.slot[1]]], ease.io(up));
          x = px; y = py; s0 = lerp(0.58, a.slot[2], up); flip = up < 1 ? pd < 0 : a.slot[0] > 800; walk = up < 1 ? up * 110 : undefined;
        } else { x = a.fx; y = a.fy; s0 = 0.58; flip = a.fx > 800; walk = undefined; }
        const at = up >= 1 && down <= 0;
        const preach = es(t, 4.55, 4.75);
        const auth = es(t, 5.15 + a.rank * 0.04, 5.35 + a.rank * 0.04);
        a.p.set({
          x, y, s: s0, flip,
          walk, amt: 0.8,
          armF: chosen * (1 - up) * 50 + (at ? 20 + appoint * 20 : 0) + preach * (40 + Math.sin(T * 3 + a.seed) * 10 * (1 - auth)) + auth * 60,
          armB: (at ? bump(t, 3.2, 3.9) * 30 : 0) + auth * 20,
          head: -chosen * (1 - up) * 10 + (at ? -3 : 0), blink: blinkAt(T, a.seed),
        });
        // the thread of the call
        const th = chosen * (1 - es(t, 2.0 + a.delay, 2.3 + a.delay));
        if (th > 0.01) {
          const [hx, hy] = headAt(a.fx, a.fy, 0.58, a.fx > 800);
          const mx = (jhx + hx) / 2 + (hx - jhx) * 0.2, my = Math.min(jhy, hy) - 30;
          attr(a.lp, 'd', `M${jhx.toFixed(1)} ${jhy.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${hx.toFixed(1)} ${(hy - 20).toFixed(1)}`);
        }
        fade(a.line, th);
        const [gx, gy] = headAt(x, y, s0, flip);
        pose(a.glow, { x: gx, y: gy - 34 * s0, s: s0 * 1.4, o: chosen * (1 - es(t, 3.4, 3.8)) * 0.9 + auth * 0.9 });
        const [ahx, ahy] = handAt(x, y, s0, flip, 60);
        pose(a.hand, { x: ahx, y: ahy, s: s0 * (1 + Math.sin(T * 3 + a.seed) * 0.1), o: auth });
      });
      pose(ring, { x: 800, y: TOP + 4, s: 0.5 + appoint * 0.5 + es(t, 3.3, 3.8) * 0.1, o: es(t, 3.05, 3.4) * (1 - es(t, 4.1, 4.4)) });
      pose(tag, { x: 800, y: lerp(-300, 150, es(t, 3.1, 3.45, ease.back)) - es(t, 4.05, 4.3) * 500, r: Math.sin(T * 0.8) * 2, o: t > 3 && t < 4.4 ? 1 : 0 });

      voices.forEach((v, side) => pose(v, { x: side ? 990 : 610, y: 560, sx: side ? -1 : 1, s: 0.9 + Math.sin(T * 3 + side) * 0.06, o: es(t, 4.55, 4.78) * (1 - es(t, 5.6, 5.9)) * 0.9 }));

      /* the roads to the villages; the dark flees before them */
      roads.forEach((r) => attr(r.path, 'stroke-dashoffset', (r.len * (1 - es(t, 4.02, 4.6))).toFixed(1)));
      WISPS.forEach((w) => {
        const on = es(t, 3.9, 4.3);
        const flee = es(t, 5.2 + w.k * 0.08, 5.8 + w.k * 0.08, ease.in);
        pose(w.el, { x: w.x + Math.sin(T * 1.2 + w.seed) * 8 + flee * (w.ti ? 140 : -140), y: w.y + Math.cos(T * 1.5 + w.seed) * 5 - flee * 260, s: 1 - flee * 0.5, r: Math.sin(T + w.seed) * 12, o: on * (1 - flee) });
      });

      /* camera: follow the climb up, look at the summit, pull back for the sending */
      S.cam.y = lerp(60, -40, es(t, 0.05, 0.9)) + es(t, 1.9, 2.4) * 40 - es(t, 2.9, 3.3) * 80 + es(t, 3.95, 4.5) * 60;
      S.cam.z = 1 + es(t, 0.3, 0.9) * 0.06 - es(t, 1.9, 2.4) * 0.06 + es(t, 2.9, 3.3) * 0.18 - es(t, 3.95, 4.5) * 0.18;
      S.cam.x = 0;
    };
  },
};
