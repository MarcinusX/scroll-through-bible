// Mt 7,13–14 — a painted flat of a landscape with a fork in the road. A pilgrim with a big bundle comes to the
// fork, looks both ways, and points up to a small, narrow gate in the rocks, where light shines through: "Enter by
// the narrow gate". To the left a broad, smooth road leads to a wide, gilded gate with pennants, and many walk it —
// through the gate and on into a darkening violet haze. The pilgrim climbs the steep, narrow path; at the gate his
// bundle won't fit, so he lets it drop and squeezes through into the light. Only one other is on the path, far below.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, flowers, olive, cypress, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { VILLAGE, manOf, womanOf, folk, group, traveller, wideGate, narrowGate, bigBundle, along, radiance, glowDisc, storyFrame, kf, PI } from './lib.js';

const P = 0.5;
const FORK = [800, 748];
const BROAD = [[800, 752], [740, 716], [680, 676], [620, 636], [570, 604], [530, 588], [490, 574], [420, 550], [350, 532]];
const NARROW = [[816, 752], [880, 724], [930, 690], [990, 668], [1030, 636], [996, 604], [1016, 572], [1060, 548], [1086, 520], [1066, 492], [1090, 468], [1112, 452]];
const CROWD = [[500, 920], [590, 790], [640, 712], [680, 676], ...BROAD.slice(3)];
const WG = [530, 590];      // the wide gate
const NG = [1112, 452];     // the narrow gate
const bS = (y) => lerp(0.52, 1.0, (y - 530) / (752 - 530));
const nS = (y) => lerp(0.46, 1.0, (y - 452) / (752 - 452));

export default {
  id: 'mt7-gates',
  enter: 'fly',
  beats: [
    { v: 13, text: 'Wchodźcie przez ciasną bramę!' },
    { v: 13, cont: true, text: 'Bo szeroka jest brama i przestronna ta droga, która prowadzi do zguby, a wielu jest takich, którzy przez nią wchodzą.' },
    { v: 14 },
  ],
  cam: { x: [-110, 200], y: [-150, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const sk = sky(S, VILLAGE);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 150, len: 700 });
    const cls = [[520, 150, 170], [1000, 110, 130]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) }));
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);

    /* the violet haze beyond the wide gate; the light beyond the narrow one */
    const hid = S.id('haze');
    S.defs(`<radialGradient id="${hid}"><stop offset="0" stop-color="#3a3052" stop-opacity=".95"/><stop offset=".55" stop-color="#5a4d6e" stop-opacity=".6"/><stop offset="1" stop-color="#8a7aa0" stop-opacity="0"/></radialGradient>`);
    const hazeL = S.layer({ par: 0.46, sh: 1, flat: true });
    hazeL.add(`<ellipse cx="370" cy="540" rx="420" ry="220" fill="url(#${hid})"/>`);
    const lightL = S.layer({ par: 0.46, sh: 1, flat: true });
    lightL.add(`<g transform="translate(${NG[0] + 6} ${NG[1] - 60})"><circle r="260" fill="url(#halo-glow)"/><g transform="scale(.9)">${radiance(c, 60)}</g></g>`);

    /* the land: the broad road on the left, the rocky hill and its narrow path on the right */
    const land = S.layer({ par: P, sh: 3 });
    land.add(sheet().p(c.ridge(c.wave(520, [6, 3], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.sage3, C.sand, 0.35)).out());
    // the road goes on into the haze and ends at a broken edge
    land.add(`<path d="${c.ribbon([[530, 588], [440, 558], [360, 536], [290, 522]], (u) => 90 - u * 50)}" fill="${mix(C.stone2, C.duskViolet, 0.35)}"/>`);
    land.add(`<path d="${c.ribbon(BROAD.slice(0, 6), (u) => 190 - u * 110)}" fill="${mix(C.stone, C.cream, 0.4)}"/>` + `<path d="${c.ribbon(BROAD.slice(0, 6).map(([x, y]) => [x, y + 2]), 3)}" fill="${C.stone2}" opacity=".5"/>`);
    const hill = sheet();
    hill.p(c.cut([[850, 760], [900, 700], [960, 640], [1020, 570], [1070, 500], [1100, 470], [1180, 440], [1260, 470], [1340, 520], [1440, 560], [1600, 600], [2500, 620], [2500, 1700], [850, 1700]], 1.4, 9), mix(C.rock, C.hillNear, 0.3));
    hill.x(c.cut([[1180, 470], [1260, 490], [1320, 540], [1220, 520]], 0.6, 6) + c.cut([[980, 660], [1040, 610], [1060, 640], [1000, 690]], 0.6, 6), shade(C.rock, 0.2), 'opacity=".6"');
    land.add(hill.out());
    land.add(`<path d="${c.ribbon(NARROW, (u) => 22 - u * 14)}" fill="${mix(C.sand, C.cream, 0.3)}"/>`);
    land.add(rock(c, 950, 720, 60, 26, C.rock2) + rock(c, 1060, 600, 50, 22, C.rock3) + rock(c, 1140, 540, 40, 20, C.rock2) + bush(c, 1230, 470, 50, C.moss) + olive(c, 1400, 560, 0.7) + cypress(c, 180, 560, 90) + olive(c, 740, 560, 0.6) + grass(c, { x0: -600, x1: 850, y: 540, n: 30, h: 10, color: C.olive }));

    /* the crowd on the broad road (sprites: drawn once, moved on the compositor) */
    const walkL = S.layer({ par: P, sh: 4 });
    const GROUPS = Array.from({ length: 7 }, (_, g) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 40 + c.rr(-6, 6), y: c.rr(-6, 6), s: 0.95 * c.rr(0.92, 1.04), flip: true, o: folk(c) }));
      return { g, u0: g / 7, sp: walkL.sprite(group(c, mem), 680, 676) };
    });
    /* the pilgrim and his bundle, a second one far below */
    const PO = traveller(c, { robe: C.sageRobe, mantle: C.wood3, holdF: '', holdB: '' });
    const bundle = walkL.add(`<g>${bigBundle(c)}</g>`);
    const pil = S.puppet(walkL.add(person(c, PO)));
    const other = S.puppet(walkL.add(person(c, womanOf(c, { robe: C.roseRobe }))));

    /* the gates (in front of the walkers: they go through) */
    const gates = S.layer({ par: P, sh: 5 });
    gates.add(`<g transform="translate(${WG[0]} ${WG[1]}) scale(.82)">${wideGate(c, 260, 250)}</g>`);
    gates.add(`<g transform="translate(${NG[0]} ${NG[1]}) scale(.7)">${narrowGate(c, 34, 116)}</g>`);

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 990, 260, C.moss, C.sage) + bush(c, 1510, 990, 260, C.sage, C.moss) + flowers(c, { x0: -200, x1: 1800, y: 935, n: 16, h: 26 }));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1250, y: 150, r: Math.sin(T * 0.6) });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));

      /* the many on the broad road, through the wide gate, into the haze */
        const dark = es(t, 1.2, 1.7) * (1 - es(t, 2.1, 2.4) * 0.4);
      hazeL.fade(0.3 + dark * 0.7);
      GROUPS.forEach((g) => {
        const u = ((g.u0 + t * 0.16) % 1 + 1) % 1;
        const [x, y] = along(CROWD, u);
        const s = bS(Math.min(752, y));
        const o = (1 - es(u, 0.8, 0.96)) * (g.g % 2 ? 1 : seg(t, 1.0, 1.08));
        g.sp.set({ x, y: y - Math.abs(Math.sin(u * 40 + g.g)) * 3, s: s * 0.8, o });
      });

      /* v13a — the pilgrim at the fork: left, right, and the narrow gate lights up */
      const arrive = es(t, 0.0, 0.3);
      const climb = es(t, 2.04, 2.6, (u) => u);
      const [cx, cy] = climb > 0 ? along(NARROW, climb) : [lerp(760, FORK[0], arrive), lerp(820, FORK[1], arrive)];
      const s = climb > 0 ? nS(cy) : 1.0;
      const lookL = bump(t, 0.3, 0.55);
      const point = es(t, 0.55, 0.72) * (1 - es(t, 0.95, 1.05));
      const squeeze = es(t, 2.6, 2.8);
      const moving = (arrive > 0 && arrive < 1) || (climb > 0 && climb < 1);
      pil.set({ x: cx + squeeze * 12, y: cy, s, flip: lookL > 0.5, walk: moving ? cx * 0.08 + cy * 0.05 : undefined, armF: 20 + point * 110 + squeeze * 30, armB: 10 + squeeze * 40, head: -point * 10 - (climb > 0 && climb < 1 ? 6 : 0), lean: climb > 0 && climb < 1 ? 6 : 0, o: 1 - es(t, 2.72, 2.84), blink: blinkAt(T, 2) });
      // v14: the bundle doesn't fit — he lets it drop, it rolls down the rocks
      const drop = es(t, 2.58, 2.76, ease.in);
      const bx = cx - 16 * s, by = cy - 140 * s;
      pose(bundle, { x: drop > 0 ? lerp(bx, NG[0] - 70, drop) : bx, y: drop > 0 ? lerp(by, NG[1] + 40, drop) - Math.sin(drop * PI) * 30 : by, s: s, r: drop * -120, o: 1 });
      const glowK = es(t, 0.55, 0.8) * 0.6 + es(t, 2.3, 2.7) * 0.4;
      lightL.fade(0.35 + glowK * 0.65);
      // one more, far below on the narrow path
      const ok = es(t, 2.1, 2.9, (u) => u);
      const [ox, oy] = along(NARROW, 0.12 + ok * 0.3);
      other.set({ x: ox, y: oy, s: nS(oy) * 0.96, walk: ok > 0 && ok < 1 ? ox * 0.08 : undefined, o: seg(t, 2.05, 2.15), armF: 20, blink: blinkAt(T, 7) });

      S.cam.x = kf(t, [[0, 0], [0.9, 0], [1.2, -100], [1.9, -100], [2.3, 170], [3, 190]]);
      S.cam.y = kf(t, [[0, 40], [0.9, 30], [1.2, 20], [1.9, 20], [2.3, -110], [3, -140]]);
      S.cam.z = kf(t, [[0, 1.1], [0.9, 1.06], [1.2, 1.12], [1.9, 1.12], [2.3, 1.26], [3, 1.28]]);
    };
  },
};
