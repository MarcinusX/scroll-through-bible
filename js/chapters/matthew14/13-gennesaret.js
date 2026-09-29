// Mt 14,34–36 — morning at Gennesaret: they moor and come ashore. The people know Him at once: runners go out over
// the hills and the sick are carried in on mats and laid in the market place. They reach for the fringe of His
// cloak as He passes — and everyone who touches it stands up, healed.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waveStrip, palm, olive, reeds, rock, flowers, bush, town, house, sun, cloud } from '../../assets/nature.js';
import { bird, boat } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, moving, headAt, speech, GLYPH, spark, heart, pallet, sickOnMat, awning, basket, jesusWithFringe, labelTag, man, woman, mob, MORNING, tr, PI } from './lib.js';

const Y = 700;
const MAT_Y = 742;
const SHORE = 470;          // the water's edge
const MATS = [720, 880, 1120, 1280];

export default {
  id: 'mt14-gennesaret',
  beats: [
    { v: 34 },
    { v: 35 },
    { v: 36, text: 'i prosili, żeby przynajmniej frędzli Jego płaszcza mogli się dotknąć;' },
    { v: 36, cont: true, text: 'a wszyscy, którzy się Go dotknęli, zostali uzdrowieni.' },
  ],
  cam: { x: [-520, 140], y: [0, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#d8c9d6', '#f5d9bd', '#f8e5cc']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 0, y: 0, len: 800 });
    const cls = [[300, 150, 190], [1000, 120, 220], [1500, 200, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 600 }) }));
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 45, scale: 0.5, x0: -600, x1: 2400 });
    const sign = hanging(hangL, labelTag(tr('ziemia Genezaret', 'the land of Gennesaret'), 24), { x: 0, y: 0, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 410, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3200 }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const hb = hillsWith(c, { y: 470, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3200 });
    hills.add(hb.markup);
    let fields = '';
    for (let i = 0; i < 16; i++) { const x = c.rr(-300, 2100), y = hb.fn(x) + c.rr(14, 40); fields += c.cut([[x, y], [x + 90, y - 4], [x + 100, y + 16], [x + 8, y + 20]], 0.6, 8); }
    hills.add(sheet().p(fields, mix(C.wheatGreen, C.leaf, 0.3)).out());
    hills.add(town(c, { x: 1250, y: hb.fn(1250) + 24, n: 6, spread: 300, sc: 0.6 }) + town(c, { x: 200, y: hb.fn(200) + 24, n: 4, spread: 200, sc: 0.55 }));
    // runners spreading the news over the countryside (small still pairs, slid on the compositor)
    const runners = Array.from({ length: 6 }, (_, i) => ({ i, x0: 300 + i * 260 + c.rr(-60, 60), dir: i % 2 ? 1 : -1, d: c.rr(0, 0.25) }));
    runners.forEach((r) => { r.sp = hills.sprite(mob(c, 2, { s: 0.3, spread: 14, rows: 1, flip: r.dir < 0 }), r.x0, hb.fn(r.x0) + 20); });

    const lake = S.layer({ par: 0.4, sh: 2 });
    lake.add(sheet().p(c.cut([[-1400, 560], [SHORE + 60, 560], [SHORE - 40, 1700], [-1400, 1700]], 0.8, 10), C.lake).out());
    lake.add(reeds(c, SHORE - 40, 610, 8, 60));

    /* the market place */
    const ground = S.layer({ par: 0.5, sh: 3 });
    ground.add(sheet().p(c.cut([[SHORE, 560], [3200, 560], [3200, 1700], [SHORE - 120, 1700]], 1, 10), mix(C.sand, C.stone, 0.25)).out());
    ground.add(sheet().p(c.cut([[SHORE, 564], [SHORE + 40, 700], [SHORE - 20, 800], [SHORE - 60, 800], [SHORE - 20, 700], [SHORE - 40, 564]], 0.6, 8), C.sand2).out());
    ground.add(house(c, 1450, 640, 140, 110) + house(c, 620, 630, 110, 90, { stairs: false }) + palm(c, 1640, 660, 260) + olive(c, 560, 650, 0.8));
    [[860, C.terracotta], [1080, C.dustyBlue], [1300, C.moss]].forEach(([x, col]) => {
      ground.add(`<g transform="translate(${x} 650)">${awning(c, 170, 150, col)}<g transform="translate(-40 -2)">${basket(c, { w: 40, h: 22 })}</g><g transform="translate(20 -2)">${basket(c, { w: 38, h: 20, full: true })}</g></g>`);
    });
    ground.add(sheet().p(c.cut(c.rect(SHORE - 6, 650, 12, 56), 0.3, 5), C.wood2).out());
    const ropeEl = ground.add(`<path d="${c.ribbon(c.qbez([SHORE, 660], [SHORE - 70, 700], [SHORE - 150, 676], 12), 2.6)}" fill="${C.rope}"/>`);

    /* people */
    const act = S.layer({ par: 0.55, sh: 5 });
    const B = boat(c, { mast: true });
    const ONB = [CAST.peter, CAST.andrew, CAST.james, CAST.john].map((o, i) => ({ o, i, x: -80 + i * 54 }));
    const boatG = act.add(`<g><g>${B.back}</g><g data-k="jb">${jesusWithFringe(c)}</g>${ONB.map((d) => `<g data-k="gb${d.i}">${person(c, d.o)}</g>`).join('')}<g>${B.front}</g></g>`);
    const jBoat = S.puppet(S.$('jb').firstElementChild);
    const onb = ONB.map((d) => ({ ...d, p: S.puppet(S.$('gb' + d.i).firstElementChild) }));
    const ashore = ONB.map((d) => ({ ...d, p: S.puppet(act.add(person(c, d.o))) }));
    const folk = [[700, 0], [770, 1], [950, 2], [1020, 3]].map(([x, i]) => ({ x, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, i % 2 ? woman(c) : man(c)))) }));
    const CARRY = MATS.map((mx, i) => {
      const side = i < 2 ? -1 : 1;
      const a = S.puppet(act.add(person(c, man(c, { belt: C.leather }))));
      const mat = act.add(`<g>${sickOnMat(c, { skin: [C.skin2, C.skin3, C.skin, C.skin4][i] }, 130)}</g>`);
      const b = S.puppet(act.add(person(c, man(c))));
      return { i, mx, side, a, b, mat, d: (i % 2) * 0.08 };
    });
    const SICK = MATS.map((mx, i) => {
      const look = { ...(i % 2 ? woman(c) : man(c)), skin: [C.skin2, C.skin3, C.skin, C.skin4][i] };
      const mat = act.add(`<g>${pallet(c, 120)}</g>`);
      const sit = S.puppet(act.add(person(c, { ...look, pose: 'sit' })));
      const up = S.puppet(act.add(person(c, look)));
      return { i, mx, mat, sit, up, seed: c.rr(0, 6) };
    });
    const jesus = S.puppet(act.add(jesusWithFringe(c)));
    const fringeGlow = act.add(`<g><circle r="34" fill="url(#halo-glow)"/></g>`);

    const fx = S.layer({ par: 0.6, sh: 4 });
    const bangs = folk.map(() => fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 38, h: 40 })}</g>`));
    const heals = SICK.map(() => fx.add(`<g>${spark(c, 16)}</g>`));
    const joy = SICK.map(() => fx.add(`<g>${heart(c, 12)}</g>`));

    const wv = S.layer({ par: 0.72, sh: 4, pad: 200 });
    wv.add(waveStrip(c, { y: 820, len: 160, amp: 10, color: C.lake2, x0: -1400, x1: SHORE - 60 }));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1700, 890, 240, C.moss, C.sage) + rock(c, 1500, 910, 130, 50, C.rock2) + flowers(c, { x0: 1300, x1: 1800, y: 872, n: 14 }));

    const jKeys = [[0.6, SHORE - 60], [0.95, 600], [1.95, 600], [2.3, 790], [2.95, 1010], [3.05, 1010]];
    return (t, time) => {
      const T = time;
      sk.blend(['#d8c9d6', '#f5d9bd', '#f8e5cc'], MORNING, es(t, 0, 1.5));
      swing(sunEl, 360, 260 - es(t, 0, 3) * 90, T, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 30, cl.y, T, 1.4, 0.6, cl.i));
      birds(T, 1);
      wv.shift(((T * 16) % 160) - 80);

      /* v34 — across the lake to Gennesaret; they moor and come ashore */
      const arrive = es(t, -0.4, 0.45);
      const bob = Math.sin(T * 1.4) * 2.5;
      pose(boatG, { x: lerp(-300, SHORE - 230, arrive), y: 712 + bob, s: 0.9, r: Math.sin(T * 1.1) * 0.8 });
      pose(ropeEl, { o: es(t, 0.45, 0.6) });
      const sg = es(t, 0.1, 0.4, ease.back) * (1 - es(t, 1.9, 2.1));
      pose(sign, { x: 760, y: lerp(-400, 250, sg), r: Math.sin(T * 1.2) * 2.5, o: sg > 0.01 ? 1 : 0 });
      const out = es(t, 0.58, 0.64);
      jBoat.set({ x: 150, y: -8, s: 0.98, o: 1 - out, flip: false, armF: 20, blink: blinkAt(T) });
      onb.forEach((d) => d.p.set({ x: d.x, y: 4, s: 0.94, o: 1 - es(t, 0.64 + d.i * 0.04, 0.68 + d.i * 0.04), armF: 30 + (d.i === 0 ? bump(t, 0.4, 0.7) * 80 : 0), blink: blinkAt(T, d.i + 2) }));
      ashore.forEach((d) => {
        const k = es(t, 0.64 + d.i * 0.04, 0.95 + d.i * 0.03);
        const x = lerp(SHORE - 220 + d.x, 520 - d.i * 40 + es(t, 1.95, 2.3) * 110, k);
        d.p.set({ x, y: Y + 4 + (d.i % 2) * 6, s: 0.88, o: es(t, 0.64 + d.i * 0.04, 0.68 + d.i * 0.04), walk: (k > 0 && k < 1) || (t > 1.95 && t < 2.3) ? x * 0.05 + d.i : undefined, blink: blinkAt(T, d.i + 7) });
      });

      /* v35 — they know Him, send word round the country, and bring all the sick */
      const jx = kf(t, jKeys);
      const walking = moving(t, jKeys);
      const bless = bump(t, 3.05, 3.9);
      jesus.set({ x: jx, y: Y, s: 1.0, o: out, walk: walking ? jx * 0.05 : undefined, armF: 20 + bump(t, 0.95, 1.4) * 50 + bless * 60, armB: bless * 120, head: es(t, 2.2, 2.4) * 8 * (1 - es(t, 3.0, 3.2)), blink: blinkAt(T) });
      folk.forEach((f) => {
        const see = es(t, 0.8 + f.i * 0.04, 0.95 + f.i * 0.04);
        const run = es(t, 1.3 + f.i * 0.04, 1.7 + f.i * 0.04);
        const x = f.x + run * (f.x > 900 ? 700 : -600);
        f.p.set({ x, y: Y - 6 + (f.i % 2) * 10, s: 0.86, flip: run > 0.02 ? f.x < 900 : true, o: es(t, 0.6, 0.8) * (1 - es(t, 1.6, 1.8)), walk: run > 0 && run < 1 ? x * 0.07 : undefined, amt: 1.3, armF: see * 90 * (1 - run), armB: see * 40 * (1 - run), blink: blinkAt(T, f.seed) });
      });
      bangs.forEach((b, i) => {
        const f = folk[i];
        const k = es(t, 0.85 + i * 0.06, 1.0 + i * 0.06, ease.back) * (1 - es(t, 1.3, 1.4));
        const [hx, hy] = headAt(f.x, Y - 6, 0.86, true);
        pose(b, { x: hx - 16, y: hy - 22, s: k * 0.8, o: k > 0.01 ? 1 : 0 });
      });
      runners.forEach((r) => {
        const k = es(t, 1.2 + r.d, 1.95 + r.d, (u) => u);
        const x = r.x0 + k * 420 * r.dir;
        r.sp.set({ x, y: hb.fn(x) + 20 - Math.abs(Math.sin(x * 0.1)) * 2, o: k > 0 && k < 1 ? 1 : 0 });
      });
      CARRY.forEach((cr) => {
        const k = es(t, 1.2 + cr.d, 1.72 + cr.d);
        const lay = es(t, 1.8, 1.9);
        const from = cr.side < 0 ? -200 : 1900;
        const x = lerp(from, cr.mx, k);
        const w = k > 0 && k < 1;
        const vis = es(t, 1.2 + cr.d, 1.25 + cr.d) * (1 - lay);
        cr.a.set({ x: x + 80 * cr.side, y: Y + 30, s: 0.88, flip: cr.side > 0, o: vis, walk: w ? x * 0.05 : undefined, armF: 70, blink: blinkAt(T, cr.i) });
        cr.b.set({ x: x - 80 * cr.side, y: Y + 34, s: 0.88, flip: cr.side > 0, o: vis, walk: w ? x * 0.05 + 2 : undefined, armF: 70, blink: blinkAt(T, cr.i + 3) });
        pose(cr.mat, { x, y: Y - 84 + (w ? Math.abs(Math.sin(x * 0.05)) * 3 : 0), s: 0.9, sx: cr.side > 0 ? -1 : 1, o: vis });
      });

      /* v36 — they beg to touch the fringe of His cloak; all who touch it are healed */
      SICK.forEach((s) => {
        const laid = es(t, 1.8, 1.9);
        const near = Math.max(0, 1 - Math.abs(jx - s.mx) / 170);
        const reach = es(t, 2.05, 2.3) * (0.45 + near * 0.55);
        const healT = 3.05 + s.i * 0.1;
        const healed = es(t, healT, healT + 0.08);
        pose(s.mat, { x: s.mx, y: MAT_Y, o: laid });
        s.sit.set({ x: s.mx - 10, y: MAT_Y, s: 0.82, flip: s.mx > jx, o: laid * (1 - healed), armF: 20 + reach * 100, armB: reach * 40, head: -reach * 10, lean: reach * 6 * (s.mx > jx ? -1 : 1), blink: blinkAt(T, s.seed) });
        s.up.set({ x: s.mx, y: MAT_Y - 4, s: 0.86, flip: s.mx > jx, o: healed, armF: 60, armB: 150, head: -6, blink: blinkAt(T, s.seed) });
        const hk = bump(t, healT, healT + 0.55);
        pose(heals[s.i], { x: s.mx, y: MAT_Y - 190, s: hk, r: T * 40, o: hk > 0.02 ? 1 : 0 });
        const jk = es(t, healT + 0.15, healT + 0.35, ease.back);
        pose(joy[s.i], { x: s.mx + 20, y: MAT_Y - 215 - Math.sin(T * 2 + s.i) * 4, s: jk, o: jk > 0.01 ? 1 : 0 });
      });
      const fg_ = es(t, 2.1, 2.3) * (1 - es(t, 3.4, 3.7));
      pose(fringeGlow, { x: jx - 34, y: Y - 2, s: 0.8 + Math.sin(T * 3) * 0.08, o: fg_ });

      S.cam.x = kf(t, [[0, -440], [0.6, -380], [1.0, -200], [1.4, 0], [2.0, 0], [2.4, 60], [3.0, 100]]);
      S.cam.z = kf(t, [[0, 1.04], [0.9, 1.08], [1.4, 1.0], [2.0, 1.02], [2.4, 1.1], [3.1, 1.02]]);
      S.cam.y = kf(t, [[0, 30], [1.4, 20], [2.4, 60], [3.1, 50]]);
    };
  },
};
