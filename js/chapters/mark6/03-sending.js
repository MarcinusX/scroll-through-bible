// Mk 6,6b–9 — Jesus goes round the villages teaching; then he calls the Twelve, pairs them two by two,
// gives them authority over unclean spirits, and packs them for the road: a staff, sandals — nothing else.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, grass, flowers, town, sun, cloud } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, spark, scrap, wordSlip, loaf, staff, bag, purse, tunic, sandals, crossX, tick, disc, labelTag, TWELVE, PAIRS, man, woman } from './lib.js';

const PI = Math.PI;
const GY = 704;                   // the meadow where the Twelve stand
const VX_ = [450, 800, 1150];     // villages on the hill
const HILL = (x) => 548 + Math.sin(x * 0.006) * 10;
// where each pair stands (centre x), and which side faces Jesus
const PAIR_X_ = [470, 580, 690, 910, 1020, 1130];

export default {
  id: 'm6-sending',
  beats: [
    { v: 6, cont: true, text: 'Potem obchodził okoliczne wsie i nauczał.' },
    { v: 7, text: 'Następnie przywołał do siebie Dwunastu i zaczął rozsyłać ich po dwóch.' },
    { v: 7, cont: true, text: 'Dał im też władzę nad duchami nieczystymi' },
    { v: 8, text: 'i przykazał im, żeby nic z sobą nie brali na drogę prócz laski:' },
    { v: 8, cont: true, text: 'ani chleba, ani torby, ani pieniędzy w trzosie.' },
    { v: 9 },
  ],
  cam: { x: [-40, 40], y: [0, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the third village, the outer pairs and the sun stay inside the screen
    const VX = S.portrait ? [520, 800, 1070] : VX_;
    const PAIR_X = S.portrait ? [565, 642, 720, 880, 958, 1035] : PAIR_X_;
    const SUNX = S.portrait ? 1000 : 1180, SUNY = S.portrait ? 30 : 170;   // phone: the sun also hangs higher, above the medallions
    const SKY = ['#c6dcdc', '#ece6cf', '#f7ebd4'];
    sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: SUNX, y: SUNY, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 640, y: 130, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 980, y: 230, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 40, scale: 0.5 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [20, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const hb = hillsWith(c, { y: 470, amps: [14, 7, 3], lens: [900, 320, 110], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 22 });
    hills.add(hb.markup);
    // the village hill with its road
    const hp = [];
    for (let x = -900; x <= 2500; x += 14) hp.push([x, HILL(x) - 24 + c.rr(-1, 1)]);
    hp.push([2500, 1700], [-900, 1700]);
    hills.add(sheet().p(c.poly(hp), mix(C.hillNear, C.hillMid, 0.4)).out());
    const rd = [], rd2 = [];
    for (let x = -900; x <= 2500; x += 20) { rd.push([x, HILL(x) - 5]); rd2.unshift([x, HILL(x) + 7]); }
    hills.add(sheet().p(c.cut([...rd, ...rd2], 0.6, 10), C.sand).out());
    VX.forEach((x, i) => hills.add(town(c, { x, y: HILL(x) - 16, n: 5, spread: 170, sc: 0.62 })));
    hills.add(cypress(c, 620, HILL(620) - 10, 70) + cypress(c, 980, HILL(980) - 10, 80) + olive(c, 280, HILL(280) - 8, 0.45) + olive(c, 1320, HILL(1320) - 8, 0.45));
    // villagers who come out to listen
    const folk = [];
    VX.forEach((vx, v) => (S.portrait ? [-40, -20, 22, 40] : [-46, -24, 26, 48]).forEach((dx, j) => {
      folk.push({ v, j, x: vx + dx, p: S.puppet(hills.add(person(c, j % 2 ? woman(c) : man(c)))), seed: c.rr(0, 6) });
    }));
    const jMid = S.puppet(hills.add(person(c, { ...CAST.jesus })));
    const midWords = [0, 1, 2].map(() => hills.add(wordSlip(c, 22)));
    // unclean spirits hovering over the villages (they flee on beat 3)
    const spirits = [];
    VX.forEach((vx, v) => { for (let j = 0; j < 3; j++) spirits.push({ v, j, x: vx + (j - 1) * 50, y: HILL(vx) - 110 - (j % 2) * 26, el: hills.add(`<g>${scrap(c, 14)}</g>`), seed: c.rr(0, 6) }); });

    /* ---------- the meadow ---------- */
    const meadow = S.layer({ par: 0.5, sh: 3 });
    const mfn = c.wave(640, [6, 3], [800, 200]);
    meadow.add(sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out());
    // a patch of trodden ground under each pair (they appear as the Twelve pair up)
    const roadEls = PAIR_X.map((x) => meadow.add(`<g>${sheet().p(c.cut(c.blob(x, GY + 4, 64, 13, 14, 0.12), 0.8, 8), C.sand).out()}</g>`));
    meadow.add(grass(c, { x0: -600, x1: 2200, y: 650, fn: mfn, n: 40, h: 14, color: C.moss }));

    /* ---------- Jesus and the Twelve ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const glow = act.add(`<g>${rays(c, { n: 16, r0: 30, r1: 420, spread: 0.05, color: '#fff3cf' })}<circle r="130" fill="url(#halo-glow)"/></g>`);
    const twelve = TWELVE.map((a, i) => {
      const pi = PAIRS.findIndex((p) => p.includes(i));
      const second = PAIRS[pi][1] === i;
      const px = PAIR_X[pi];
      const left = px < 800;
      const x = px + (second ? 1 : -1) * (S.portrait ? 16 : 22) * (left ? 1 : -1);
      return { ...a, i, pi, second, x, y: GY + (second ? 10 : -4), left, from: left ? -200 - i * 40 : 1800 + i * 40, seed: c.rr(0, 6) };
    }).sort((a, b) => a.y - b.y);
    twelve.forEach((m) => {
      const el = act.add(person(c, { ...m.o, holdF: staff(c, 200, 20) }));
      m.p = S.puppet(el); m.hold = el.querySelector('.hold');
    });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const lights = PAIRS.map(() => act.add(`<g>${spark(c, 10)}</g>`));
    const sandalGlow = twelve.map(() => act.add(`<g><ellipse rx="22" ry="6" fill="${C.halo}" opacity=".8"/></g>`));

    /* ---------- the packing list, hung from the flies ---------- */
    const flies = S.layer({ par: 0.6, sh: 5 });
    const item = (inner, label) => hanging(flies, disc(c, inner, { r: 42 }) + `<g transform="translate(0 64)">${labelTag(label, 17)}</g>`, { x: 0, y: 0, len: 700 });
    const ITEMS = [
      { el: item(`<g transform="rotate(20) scale(.3)">${staff(c, 200, 0)}</g>`, tr('laska', 'a staff')), x: 800, y: 220, on: 3.05, off: 3.95, ok: true },
      { el: item(`<g transform="translate(0 10)">${loaf(c, 22)}</g>`, tr('chleb', 'bread')), x: 580, y: 250, on: 4.05, off: 4.95, x_: 4.3 },
      { el: item(`<g transform="translate(0 -8) scale(.9)">${bag(c)}</g>`, tr('torba', 'a bag')), x: 800, y: 230, on: 4.25, off: 4.95, x_: 4.5 },
      { el: item(`<g transform="translate(0 2) scale(1.1)">${purse(c)}</g>`, tr('pieniądze', 'money')), x: 1020, y: 250, on: 4.45, off: 4.95, x_: 4.7 },
      { el: item(`<g transform="translate(0 -4) scale(1.1)">${sandals(c)}</g>`, tr('sandały', 'sandals')), x: 640, y: 240, on: 5.05, off: 6.4, ok: true },
      { el: item(`<g transform="translate(-10 0) scale(.62)">${tunic(c, C.sageRobe)}</g><g transform="translate(14 4) scale(.62)">${tunic(c, C.dustyBlue)}</g>`, tr('dwie suknie', 'two tunics')), x: 960, y: 240, on: 5.3, off: 6.4, x_: 5.55 },
    ];
    ITEMS.forEach((it) => {
      it.mark = flies.add(`<g>${it.ok ? tick(c, 24) : crossX(c, 30)}</g>`);
    });
    // the second tunic being taken back off
    const spare = flies.add(`<g>${tunic(c, C.dustyBlue)}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 120, 880, 220, C.sage, C.moss) + bush(c, 1480, 870, 240, C.moss, C.sage) + rock(c, 300, 890, 140, 50, C.rock2) + flowers(c, { x0: 1150, x1: 1500, y: 860, n: 14 }) + flowers(c, { x0: 60, x1: 400, y: 866, n: 12 }));

    // the mid-ground walk: village to village, then down to the meadow
    const MK = [[-0.5, [180, 0.4]], [0.1, [VX[0] - 70, 0.4]], [0.28, [VX[0] - 70, 0.4]], [0.42, [VX[1] - 70, 0.4]], [0.56, [VX[1] - 70, 0.4]], [0.7, [VX[2] - 70, 0.4]], [0.82, [VX[2] - 70, 0.4]], [1.02, [900, 0.66]]];
    const stops = [[0.1, 0.28], [0.42, 0.56], [0.7, 0.82]];

    return (t, time) => {
      const T = time;
      swing(sunEl, SUNX, SUNY, T, 1.1, 0.6);
      swing(cl1, 640 + Math.sin(T * 0.1) * 30, 130, T, 1.4, 0.6, 1);
      swing(cl2, 980 + Math.sin(T * 0.13 + 2) * 30, 230, T, 1.4, 0.8, 2);
      birds(T, 1);

      /* v6b — round the villages, teaching */
      const [mx, ms] = kf(t, MK, (u) => u);
      const down = seg(t, 0.82, 1.02);
      const my = lerp(HILL(mx) + 4, GY - 40, ease.in(down));
      const swap = es(t, 1.0, 1.06);
      const atStop = stops.findIndex(([a, b]) => t >= a && t <= b);
      jMid.set({ x: mx, y: my, s: ms, o: 1 - swap, flip: false, walk: moving(t, MK) ? mx * 0.08 : undefined, armF: atStop >= 0 ? 40 + Math.sin(T * 2) * 20 : 0, armB: atStop >= 0 ? 30 : 0, blink: blinkAt(T) });
      midWords.forEach((w, i) => {
        const k = ((T * 0.5 + i / 3) % 1);
        pose(w, { x: mx + 20 + k * 60 * (i - 1), y: my - 90 - k * 30, s: 0.7, o: atStop >= 0 ? Math.sin(k * PI) : 0 });
      });
      folk.forEach((f) => {
        const [a] = stops[f.v];
        const k = es(t, a - 0.04 + f.j * 0.02, a + 0.06 + f.j * 0.02);
        f.p.set({ x: f.x, y: HILL(f.x) + 4, s: 0.34, flip: f.x > VX[f.v] - 70, o: k, armF: bump(t, a, a + 0.3) * (f.j % 2 ? 80 : 30), blink: blinkAt(T, f.seed) });
      });

      /* v7 — the Twelve are called, paired, and shown their roads */
      const call = es(t, 1.05, 1.3);
      const auth = es(t, 2.05, 2.35);
      jesus.set({ x: 800, y: GY, s: 0.98, o: swap, flip: t > 1.5 && t < 1.9, armF: call * 40 * (1 - auth) + bump(t, 1.5, 1.95) * 60 + auth * 70 * (1 - es(t, 2.9, 3.1)) + bump(t, 3.05, 3.9) * 60 + bump(t, 5.05, 6) * 50, armB: bump(t, 1.05, 1.5) * 120 + auth * 150 * (1 - es(t, 2.9, 3.1)), head: -auth * 8 * (1 - es(t, 2.9, 3.1)), blink: blinkAt(T) });
      pose(glow, { x: 800, y: GY - 150, s: 0.3 + auth * 0.7, r: T * 5, o: bump(t, 2.05, 3.0) * 0.5 });
      const pairUp = es(t, 1.45, 1.7);
      twelve.forEach((m) => {
        const k0 = 1.02 + (m.left ? m.i : 11 - m.i) * 0.018;
        const keys = [[k0, m.from], [k0 + 0.34, m.x + (m.second ? 18 : -18) * (m.left ? 1 : -1) * (1 - pairUp) * 1.6]];
        const x = t < 1.45 ? kf(t, keys, ease.out) : m.x + (m.second ? 18 : -18) * (m.left ? 1 : -1) * (1 - pairUp) * 1.6;
        const walking = moving(t, keys) || (pairUp > 0 && pairUp < 1);
        const look = bump(t, 1.55, 1.95);
        const staffK = es(t, 3.1 + m.pi * 0.05, 3.3 + m.pi * 0.05);
        const got = es(t, 2.2 + m.pi * 0.08, 2.45 + m.pi * 0.08);
        m.p.set({ x, y: m.y, s: 0.84, flip: !m.left !== (look > 0.5), walk: walking ? x * 0.05 + m.i : undefined, armF: 20 + look * 25 + got * 30 * (1 - es(t, 2.9, 3.05)), armB: bump(t, 5.2, 5.9) * 40, head: -look * 4, blink: blinkAt(T, m.seed) });
        if (m.hold) m.hold.setAttribute('opacity', staffK.toFixed(2));
      });
      roadEls.forEach((r, i) => fade(r, es(t, 1.5 + i * 0.05, 1.7 + i * 0.05)));
      lights.forEach((l, i) => {
        const k = es(t, 2.15 + i * 0.08, 2.4 + i * 0.08);
        const x = lerp(800, PAIR_X[i], k), y = lerp(GY - 190, GY - 190 + Math.sin(k * PI) * -60, k) + k * 10;
        pose(l, { x, y, s: 0.5 + k * 0.4 * (1 - es(t, 3.0, 3.3)), r: T * 30, o: k > 0.01 ? 1 - es(t, 3.0, 3.3) : 0 });
      });
      spirits.forEach((sp) => {
        const flee = es(t, 2.4 + sp.v * 0.1, 2.8 + sp.v * 0.1);
        pose(sp.el, { x: sp.x + Math.sin(T * 1.3 + sp.seed) * 8 + flee * (sp.x - VX[sp.v]) * 2, y: sp.y + Math.cos(T * 1.1 + sp.seed) * 6 - flee * 120, r: T * 20 + sp.seed * 40, s: 1 - flee * 0.7, o: 0.85 * es(t, 1.4, 1.8) * (1 - flee) });
      });

      /* v8–9 — the packing list: staff yes; no bread, bag, money; sandals yes; not two tunics */
      ITEMS.forEach((it, i) => {
        const k = es(t, it.on, it.on + 0.25, ease.back) * (1 - es(t, it.off, it.off + 0.3));
        pose(it.el, { x: it.x, y: lerp(-600, it.y, k), r: Math.sin(T * 1.1 + i) * 2.5, o: k > 0.01 ? 1 : 0 });
        const mk = es(t, it.ok ? it.on + 0.3 : it.x_, (it.ok ? it.on + 0.3 : it.x_) + 0.15, ease.back);
        pose(it.mark, { x: it.x + (it.ok ? 30 : 0), y: lerp(-600, it.y, k) + (it.ok ? -30 : 0), s: mk, o: mk > 0.01 && k > 0.01 ? 1 : 0 });
      });
      const sp = es(t, 5.6, 5.95);
      pose(spare, { x: lerp(974, S.portrait ? 1060 : 1300, sp), y: 244 - Math.sin(sp * PI) * 80 - sp * (S.portrait ? 700 : 300), r: sp * 60, s: 0.62, o: t > 5.55 && sp < 1 ? 1 : 0 });
      twelve.forEach((m, i) => {
        const g = bump(t, 5.1 + (i % 6) * 0.04, 5.6);
        pose(sandalGlow[i], { x: m.x, y: m.y - 2, s: g, o: g });
      });

      S.cam.z = kf(t, S.portrait ? [[0, 1.0], [0.9, 1.0], [1.3, 1.05], [2.9, 1.04], [3.2, 1.06]] : [[0, 1.0], [0.9, 1.0], [1.3, 1.1], [2.9, 1.08], [3.2, 1.12]]);   // phone: a smaller push-in keeps the outer pairs off the frame and the thread
      S.cam.y = kf(t, [[0, 10], [0.9, 10], [1.3, 50], [3.2, 60]]);
    };
  },
};
