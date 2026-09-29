// Mt 19,1–2 — the curtains open on green Galilee, the lake behind. His discourses finished, Jesus sets out with the
// disciples; the camera travels with them across the ford of the Jordan into the dry hills of Judea (the tags
// drop in: Galilee goes up, Judea — beyond the Jordan comes down; Jerusalem glints, very small, far off).
// Great crowds follow them over the river and gather round, and the sick they carried on mats are laid at His
// feet — He stretches out His hands and they stand up, healed.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, palm, rock, bush, reeds, grass } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { DAY, TWELVE, walledCity, slip, throng, sickOnMat, folk, spark, heart, headAt, footprint, tr } from './lib.js';

const PAR = 0.5;
const WALK0 = 320, WALK1 = 800;        // Jesus walks from here to here
const CAM0 = -960;
const GY = 668;
const RIVER = 560;                     // where the Jordan crosses the road (people's plane)
const roadY = (x) => 684 + Math.sin(x / 260) * 8;

export default {
  id: 'mt19-judea',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Poszły za Nim wielkie tłumy,' },
    { v: 2, cont: true, text: 'i tam ich uzdrowił.' },
  ],
  cam: { x: [CAM0, 0], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1250, y: 150, len: 700 });
    const cls = [[260, 150, 200], [820, 110, 150], [1380, 190, 170]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 600 }) }));
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 50, scale: 0.5, x0: -900, x1: 2000 });

    /* far hills with Jerusalem, very small, on the right */
    const farL = S.layer({ par: 0.1, sh: 2 });
    const far = band(c, { y: 440, amps: [20, 8, 3], lens: [1000, 360, 130], color: C.hillFar, x0: -1400 });
    const jy = far.fn(1250) + 10;
    farL.add(`<g><circle cx="1250" cy="${jy - 14}" r="60" fill="url(#halo-glow)" opacity=".4"/>${walledCity(c, 1250, jy, 0.25)}</g>`);
    farL.add(far.markup);
    /* green hills of Galilee on the left, the dry hills of Judea rising on the right */
    const hillL = S.layer({ par: 0.2, sh: 3 });
    hillL.add(hillsWith(c, { y: 505, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.sage2, 0.3), trees: 30, treeColor: C.sage, treeH: 22, x0: -1400 }).markup);
    const jfn = c.wave(500, [26, 10, 3], [700, 260, 90]);
    const jh = (x) => jfn(x) + Math.max(0, 780 - x) * 0.5;
    hillL.add(sheet().p(c.ridge(jh, 480, 2600, 1700, 12, 1.1), mix(C.sand2, C.hillMid, 0.35)).out());
    let jt = '';
    for (let i = 0; i < 10; i++) { const x = c.rr(820, 2300), y = jh(x) + 3, h = c.rr(12, 20); jt += c.cut([[x, y - h * 1.2], [x + h * 0.22, y - h * 0.3], [x + h * 0.12, y], [x - h * 0.12, y], [x - h * 0.22, y - h * 0.3]], 0.4, 5); }
    hillL.add(sheet().p(jt, C.olive).out());

    /* hanging place names */
    const tagL = S.layer({ par: 0.12, sh: 4 });
    const TAGS = [
      { text: tr('Galilea', 'Galilee'), x: 690, y: 250, on: [-1, -0.5], off: [1.2, 1.5] },
      { text: tr('Jordan', 'the Jordan'), x: 740, y: 300, on: [1.2, 1.45], off: [1.62, 1.85] },
      { text: tr('Judea — za Jordanem', 'Judea — beyond the Jordan'), x: 880, y: 262, on: [1.62, 1.85], off: [9, 9] },
    ].map((g) => ({ ...g, el: hanging(tagL, slip(c, g.text, { size: 25 }), { x: g.x, y: g.y, len: 700 }) }));

    /* the ground on the people's plane: green on the left, sand on the right, the road, the Jordan */
    const G = S.layer({ par: PAR, sh: 3 });
    const gfn = c.wave(590, [5, 2], [700, 170]);
    G.add(sheet().p(c.ridge(gfn, -1400, 2600, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5)).out());
    const dry = [];
    for (let i = 0; i <= 24; i++) { const u = i / 24; dry.push([lerp(700, 470, u) + Math.sin(u * 9) * 30, lerp(gfn(700) + 1, 1700, u)]); }
    dry.push([2600, 1700]);
    for (let x = 2600; x > 700; x -= 20) dry.push([x, gfn(x) + 1]);
    G.add(sheet().p(c.cut(dry, 2, 14), mix(C.sand, C.dune, 0.2)).out());
    G.add(sheet().p(c.cut([[-1400, 594], [-80, 592], [-20, 606], [-180, 628], [-1400, 632]], 0.6, 10), C.lake).out());
    const road = [];
    for (let x = -1400; x <= 2600; x += 100) road.push([x, roadY(x)]);
    G.add(sheet().p(c.ribbon(road, 64), mix(C.sand2, C.dune, 0.2)).out());
    const riv = [];
    for (let i = 0; i <= 22; i++) { const u = i / 22; riv.push([RIVER + 40 + Math.sin(u * 5.2) * 60 * (0.3 + u) - u * 120, lerp(594, 1700, Math.pow(u, 1.2))]); }
    G.add(sheet().p(c.ribbon(riv, (u) => 14 + u * 200), C.lake).x(c.ribbon(riv.slice(2), (u) => 3 + u * 30), C.lake2, 'opacity=".6"').out());
    let steps = '';
    for (let i = 0; i < 6; i++) steps += c.cut(c.blob(RIVER - 60 + i * 24, roadY(RIVER) - 4 + (i % 2) * 8, 12, 6, 8, 0.2), 0.4, 3);
    G.add(sheet().p(steps, C.rock2).out());
    G.add(reeds(c, RIVER - 120, 730, 8, 70) + reeds(c, RIVER + 110, 650, 6, 44) + reeds(c, RIVER - 30, 820, 9, 90));
    G.add(olive(c, -560, 640, 1) + olive(c, -240, 628, 0.85) + palm(c, 40, 640, 190) + bush(c, 180, 646, 70, C.sage, C.moss) + palm(c, 1360, 640, 180) + palm(c, 1460, 652, 150) + rock(c, 1230, 650, 60, 22));
    G.add(grass(c, { x0: -1300, x1: 460, y: 594, fn: gfn, n: 40, h: 14, color: C.moss }));

    /* the crowds that follow: still cut-outs that slide in (drawn once, moved on the compositor) */
    const crowdL = S.layer({ par: PAR, sh: 3 });
    const GROUPS = [
      { n: 7, x: 250, y: 636, s: 0.56, from: -700, d: 0 },
      { n: 6, x: 400, y: 650, s: 0.6, from: -560, d: 0.12 },
      { n: 7, x: 1100, y: 626, s: 0.54, from: 1800, d: 0.08 },
      { n: 7, x: 1290, y: 642, s: 0.58, from: 2000, d: 0.2 },
    ].map((g, i) => ({ ...g, i, sp: crowdL.sprite(throng(c, g.n, { s: g.s, spread: 34, rows: 2, face: g.x < 800 ? 1 : -1, arms: [0, 40] }), g.x, g.y) }));

    /* Jesus and the disciples */
    const walkL = S.layer({ par: PAR, sh: 5 });
    const DIS = TWELVE.slice(0, 6).map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(walkL.add(person(c, d.o))) }));
    const jesus = S.puppet(walkL.add(person(c, { ...CAST.jesus })));
    const prints = [];
    for (let i = 0; i < 12; i++) prints.push({ el: walkL.add(`<g opacity="0">${footprint(c, i % 2 === 0)}</g>`), x: WALK0 + 20 + i * 38, y: GY + 12 + (i % 2) * 8 });

    /* the sick, laid on their mats in front of Him, and the same people standing up */
    const sickL = S.layer({ par: PAR, sh: 4 });
    const SICK = [[630, 722, 1, -1], [965, 712, 2, 1], [1125, 728, 3, 1]].map(([x, y, k, side], i) => {
      const look = { ...folk(c, i !== 1), mantle: null, skin: [C.skin2, C.skin3, C.skin4, C.skin][k] };
      return { x, y, i, side, look, seed: c.rr(0, 9), mat: sickL.add(`<g>${sickOnMat(c, look, 140)}</g>`), up: S.puppet(sickL.add(person(c, look))) };
    });
    const fx = S.layer({ par: PAR, sh: 4 });
    const heals = SICK.map(() => fx.add(`<g opacity="0">${spark(c, 16)}</g>`));
    const joys = SICK.map(() => fx.add(`<g opacity="0">${heart(c, 11)}</g>`));
    const glow = fx.add(`<g opacity="0"><circle r="220" fill="url(#warm-glow)"/></g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(reeds(c, -260, 1010, 10, 170, C.moss) + reeds(c, 330, 1010, 12, 190, C.moss) + rock(c, 1360, 1000, 220, 70, C.rock2));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      swing(sunEl, 1250, 150 + es(t, 1, 4) * 24, T, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i * 2) * 26 + t * 6, cl.y, T, 1.4, 0.7, cl.i));
      birds(T, 1);

      /* v1: the walk south, across the ford — the camera travels with them */
      const w = es(t, 1.0, 1.95, ease.sine);
      const walking = t > 1.0 && t < 1.95;
      const jx = lerp(WALK0, WALK1, w);
      S.cam.x = lerp(CAM0, 0, w);
      S.cam.z = 1.02 + es(t, 2.9, 3.4) * 0.06;
      S.cam.y = 20 + es(t, 2.9, 3.4) * 20;
      const wade = (x) => Math.max(0, 1 - Math.abs(x - RIVER + 10) / 70);   // feet sink a little in the ford

      const heal = es(t, 3.05, 3.35);
      jesus.set({
        x: jx, y: GY + wade(jx) * 6, s: 0.98, walk: walking ? w * 50 : undefined,
        armF: bump(t, 2.05, 2.8) * 40 + heal * 75, armB: heal * 100 + bump(t, 2.1, 2.8) * 20,
        head: -heal * 3 + bump(t, 2.1, 2.8) * -4, flip: bump(t, 2.15, 2.75) > 0.5, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const gap = 70 + d.i * 58;
        const x = lerp(WALK0 - gap, WALK1 - gap, w);
        d.p.set({
          x, y: GY - 34 - (d.i % 2) * 16 + wade(x) * 5, s: 0.84 - (d.i % 2) * 0.05, walk: walking ? w * 50 + d.i : undefined,
          armF: 10 + es(t, 3.1, 3.4) * (d.i % 3 === 0 ? 30 : 0), head: es(t, 3.1, 3.4) * -5, blink: blinkAt(T, d.seed),
        });
      });
      prints.forEach((p) => pose(p.el, { x: p.x, y: p.y, s: 0.6, o: seg(jx, p.x + 20, p.x + 60) * 0.5 * (1 - es(t, 2.1, 2.6)) }));

      TAGS.forEach((g, i) => {
        const on = es(t, g.on[0], g.on[1], ease.back) * (1 - es(t, g.off[0], g.off[1]));
        swing(g.el, g.x, g.y - (1 - on) * 1100, T, 2.2, 0.9, i);
      });

      /* v2a: great crowds follow them over the river */
      GROUPS.forEach((g) => {
        const k = es(t, 2.0 + g.d, 2.7 + g.d, (u) => u);
        const x = lerp(g.from, g.x, ease.out(k));
        g.sp.set({ x, y: g.y - (k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.07)) * 3 : 0), o: k > 0 ? 1 : 0 });
      });

      /* the sick are carried in and laid down (v2a, end), then v2b: healed */
      SICK.forEach((s) => {
        const lay = es(t, 2.35 + s.i * 0.1, 2.75 + s.i * 0.1);
        const ht = 3.15 + s.i * 0.14;
        const up = es(t, ht, ht + 0.07);
        pose(s.mat, { x: s.x + s.side * (1 - lay) * 260, y: s.y, s: 0.9, o: lay * (1 - up) });
        s.up.set({ x: s.x + 20, y: s.y + 4, s: 0.78, flip: s.x > 800, o: up, armF: 60, armB: 150, head: -6, blink: blinkAt(T, s.seed) });
        const k = bump(t, ht - 0.05, ht + 0.5);
        const [hx, hy] = headAt(s.x + 20, s.y + 4, 0.78, s.x > 800);
        pose(heals[s.i], { x: s.x + 10, y: s.y - 60, s: k * 1.2, r: T * 40, o: k > 0.02 ? 1 : 0 });
        const jk = es(t, ht + 0.2, ht + 0.4, ease.back);
        pose(joys[s.i], { x: hx + 14, y: hy - 34 - Math.sin(T * 2 + s.i) * 4, s: jk, o: jk > 0.01 ? 1 : 0 });
      });
      pose(glow, { x: WALK1 + 10, y: GY - 100, s: 0.5 + heal * 0.7, o: heal * 0.8 });
    };
  },
};
