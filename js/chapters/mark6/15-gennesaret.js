// Mk 6,53–56 — morning at Gennesaret: they moor, he is known at once; the sick are carried in on mats and
// laid in the market place; they reach for the fringe of his cloak — and everyone who touches him is healed.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, olive, reeds, rock, grass, flowers, bush, town, house, sun, cloud } from '../../assets/nature.js';
import { bird, boat, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, speech, GLYPH, spark, heart, pallet, sickOnMat, awning, basket, jesusWithFringe, labelTag, man, woman, DY } from './lib.js';

const PI = Math.PI;
const Y = 700;
const MAT_Y = 742;
const SHORE = 470;          // the water's edge
const MATS_ = [720, 860, 1140, 1280];

export default {
  id: 'm6-gennesaret',
  beats: [
    { v: 53 },
    { v: 54 },
    { v: 55 },
    { v: 56, text: 'I gdziekolwiek wchodził do wsi, do miast czy osad, kładli chorych na otwartych miejscach' },
    { v: 56, cont: true, text: 'i prosili Go, żeby choć frędzli u Jego płaszcza mogli się dotknąć.' },
    { v: 56, cont: true, text: 'A wszyscy, którzy się Go dotknęli, odzyskiwali zdrowie.' },
  ],
  cam: { x: [-520, 420], y: [0, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const MATS = S.portrait ? [700, 840, 1030, 1130] : MATS_;   // phone: all four mats in sight
    const SKY = ['#cfe2df', '#f2e6cb', '#f8e8cf'];
    const sk = sky(S, ['#d8c9d6', '#f5d9bd', '#f8e5cc']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 0, y: 0, len: 800 });
    const cls = [[300, 150, 190], [1000, 120, 220], [1500, 200, 150]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 600 }) }));
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 230, speed: 45, scale: 0.5, x0: -600, x1: 2400 });
    const sign = hanging(hangL, labelTag(tr('Genezaret', 'Gennesaret'), 24), { x: 0, y: 0, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 410, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3200 }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const hb = hillsWith(c, { y: 470, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 30, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3200 });
    hills.add(hb.markup);
    // the fertile plain: little fields and gardens
    let fields = '';
    for (let i = 0; i < 16; i++) { const x = c.rr(-300, 2100), y = hb.fn(x) + c.rr(14, 40); fields += c.cut([[x, y], [x + 90, y - 4], [x + 100, y + 16], [x + 8, y + 20]], 0.6, 8); }
    hills.add(sheet().p(fields, mix(C.wheatGreen, C.leaf, 0.3)).out());
    hills.add(town(c, { x: 1250, y: hb.fn(1250) + 24, n: 6, spread: 300, sc: 0.6 }) + town(c, { x: 200, y: hb.fn(200) + 24, n: 4, spread: 200, sc: 0.55 }));
    // runners on the far hills, spreading the news
    const runners = Array.from({ length: 10 }, (_, i) => ({ i, x0: c.rr(-200, 1800), dir: i % 2 ? 1 : -1, p: S.puppet(hills.add(person(c, i % 3 ? man(c) : woman(c)))), d: c.rr(0, 0.3) }));

    const lake = S.layer({ par: 0.4, sh: 2 });
    lake.add(sheet().p(c.cut([[-1400, 560], [SHORE + 60, 560], [SHORE - 40, 1700], [-1400, 1700]], 0.8, 10), C.lake).out());
    lake.add(reeds(c, SHORE - 40, 610, 8, 60));

    /* ---------- the market place ---------- */
    const ground = S.layer({ par: 0.5, sh: 3 });
    const gp = [[SHORE, 560], [3200, 560], [3200, 1700], [SHORE - 120, 1700]];
    ground.add(sheet().p(c.cut(gp, 1, 10), mix(C.sand, C.stone, 0.25)).out());
    ground.add(sheet().p(c.cut([[SHORE, 564], [SHORE + 40, 700], [SHORE - 20, 800], [SHORE - 60, 800], [SHORE - 20, 700], [SHORE - 40, 564]], 0.6, 8), C.sand2).out());
    ground.add(house(c, 1450, 640, 140, 110) + house(c, 620, 630, 110, 90, { stairs: false }) + palm(c, 1640, 660, 260) + olive(c, 560, 650, 0.8));
    const stalls = [[860, C.terracotta], [1080, C.dustyBlue], [1300, C.moss]].map(([x, col]) => {
      let m = awning(c, 170, 150, col);
      m += `<g transform="translate(-40 -2)">${basket(c, { w: 40, h: 22 })}</g><g transform="translate(20 -2)">${basket(c, { w: 38, h: 20, full: true })}</g>`;
      return ground.add(`<g transform="translate(${x} 650)">${m}</g>`);
    });
    // the mooring post
    ground.add(sheet().p(c.cut(c.rect(SHORE - 6, 650, 12, 56), 0.3, 5), C.wood2).out());
    const ropeEl = ground.add(`<path d="${c.ribbon(c.qbez([SHORE, 660], [SHORE - 70, 700], [SHORE - 150, 676], 12), 2.6)}" fill="${C.rope}"/>`);

    /* ---------- people ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const B = boat(c, { mast: true });
    const ONB = [CAST.peter, CAST.andrew, CAST.james, CAST.john].map((o, i) => ({ o, i, x: -80 + i * 54 }));
    const boatG = act.add(`<g><g>${B.back}</g><g data-k="jb">${jesusWithFringe(c)}</g>${ONB.map((d) => `<g data-k="gb${d.i}">${person(c, d.o)}</g>`).join('')}<g>${B.front}</g></g>`);
    const jBoat = S.puppet(S.$('jb').firstElementChild);
    const onb = ONB.map((d) => ({ ...d, p: S.puppet(S.$('gb' + d.i).firstElementChild) }));
    const ashore = ONB.map((d) => ({ ...d, p: S.puppet(act.add(person(c, d.o))) }));
    // villagers who recognise him
    const folk = [[700, 0], [760, 1], [940, 2], [1000, 3], [1180, 4], [1240, 5]].map(([x, i]) => ({ ox: x, x: S.portrait && i > 1 && i < 4 ? x - 70 - (i - 2) * 15 : x, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, i % 2 ? woman(c) : man(c)))) }));
    // carriers bringing the sick on mats
    const CARRY = MATS.map((mx, i) => {
      const side = i < 2 ? -1 : 1;
      const a = S.puppet(act.add(person(c, man(c, { belt: C.leather }))));
      const mat = act.add(`<g>${sickOnMat(c, { skin: [C.skin2, C.skin3, C.skin, C.skin4][i] }, 130)}</g>`);
      const b = S.puppet(act.add(person(c, man(c))));
      return { i, mx, side, a, b, mat, d: (i % 2) * 0.1 };
    });
    // the sick, sitting on their mats, reaching out — and then standing, healed
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
    const bangs = folk.slice(0, 4).map(() => fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 38, h: 40 })}</g>`));
    const heals = SICK.map(() => fx.add(`<g>${spark(c, 14)}</g>`));
    const joy = SICK.map(() => fx.add(`<g>${heart(c, 11)}</g>`));

    const wv = S.layer({ par: 0.72, sh: 4, pad: 200 });
    wv.add(waveStrip(c, { y: 820, len: 160, amp: 10, color: C.lake2, x0: -1400, x1: SHORE - 60 }));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1700, 890, 240, C.moss, C.sage) + rock(c, 1500, 910, 130, 50, C.rock2) + flowers(c, { x0: 1300, x1: 1800, y: 872, n: 14 }));

    const jKeys = [[1.05, SHORE - 60], [1.4, 600], [2.9, 600], [3.3, 790], [4.05, 790], [4.9, S.portrait ? 945 : 1010]];
    return (t, time) => {
      const T = time;
      sk.blend(['#d8c9d6', '#f5d9bd', '#f8e5cc'], SKY, es(t, 0, 2));
      swing(sunEl, 360, 260 - es(t, 0, 3) * 90, T, 1.1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 30, cl.y, T, 1.4, 0.6, cl.i));
      birds(T, 1);
      wv.shift(((T * 16) % 160) - 80);

      /* v53 — across the lake to Gennesaret; they moor */
      const arrive = es(t, -0.4, 0.55);
      const bob = Math.sin(T * 1.4) * 2.5;
      pose(boatG, { x: lerp(-300, SHORE - 230, arrive), y: 712 + bob, s: 0.9, r: Math.sin(T * 1.1) * 0.8 });
      pose(ropeEl, { o: es(t, 0.6, 0.8) });
      const sg = es(t, 0.2, 0.5, ease.back);
      pose(sign, { x: 760, y: lerp(-400, 250, sg), r: Math.sin(T * 1.2) * 2.5, o: sg > 0.01 ? 1 : 0 });
      const out = es(t, 1.02, 1.08);
      jBoat.set({ x: 150, y: -8, s: 0.98, o: 1 - out, flip: false, armF: 20, blink: blinkAt(T) });
      onb.forEach((d) => d.p.set({ x: d.x, y: 4, s: 0.94, o: 1 - es(t, 1.1 + d.i * 0.05, 1.16 + d.i * 0.05), armF: 30 + (d.i === 0 ? bump(t, 0.55, 0.9) * 80 : 0), blink: blinkAt(T, d.i + 2) }));
      ashore.forEach((d) => {
        const k = es(t, 1.1 + d.i * 0.05, 1.5 + d.i * 0.05);
        const x = lerp(SHORE - 220 + d.x, 520 - d.i * 40 + (t > 3 ? es(t, 3.0, 3.4) * 120 : 0), k);
        d.p.set({ x, y: Y + 4 + (d.i % 2) * 6, s: 0.88, o: es(t, 1.1 + d.i * 0.05, 1.16 + d.i * 0.05), walk: (k > 0 && k < 1) || (t > 3 && t < 3.4) ? x * 0.05 + d.i : undefined, blink: blinkAt(T, d.i + 7) });
      });

      /* v54 — they come ashore and he is known at once */
      const jx = kf(t, jKeys);
      const walking = moving(t, jKeys);
      const reachK = es(t, 4.05, 4.3);
      jesus.set({ x: jx, y: Y, s: 1.0, o: out, walk: walking ? jx * 0.05 : undefined, armF: 20 + bump(t, 1.4, 1.95) * 50 + bump(t, 5.05, 5.9) * 60, armB: bump(t, 5.05, 5.9) * 120, head: reachK * 8 * (1 - es(t, 5.0, 5.2)), blink: blinkAt(T) });
      folk.forEach((f) => {
        const see = es(t, 1.15 + f.i * 0.05, 1.35 + f.i * 0.05);
        const run = es(t, 2.0 + f.i * 0.05, 2.6 + f.i * 0.05);
        const x = f.x + run * (f.i % 2 ? 700 : -900) * (f.ox > 900 ? 1 : 0.4);
        f.p.set({ x, y: Y - 6 + (f.i % 2) * 10, s: 0.86, flip: run > 0.02 ? (f.ox > 900 ? false : true) : true, o: es(t, 0.8, 1.0) * (1 - es(t, 2.5, 2.8)), walk: run > 0 && run < 1 ? x * 0.07 : undefined, amt: 1.3, armF: see * 90 * (1 - run), armB: see * 40 * (1 - run), blink: blinkAt(T, f.seed) });
      });
      bangs.forEach((b, i) => {
        const f = folk[i];
        const k = es(t, 1.2 + i * 0.07, 1.35 + i * 0.07, ease.back) * (1 - es(t, 1.9, 2.0));
        const [hx, hy] = headAt(f.x, Y - 6, 0.86, true);
        pose(b, { x: hx - 16, y: hy - 22, s: k * 0.8, o: k > 0.01 ? 1 : 0 });
      });
      runners.forEach((r) => {
        const k = es(t, 2.0 + r.d, 2.9 + r.d, (u) => u);
        const x = r.x0 + k * 500 * r.dir;
        r.p.set({ x, y: hb.fn(x) + 18, s: 0.3, flip: r.dir < 0, o: k > 0 && k < 1 ? 1 : 0, walk: x * 0.12, amt: 1.4, lean: 8 });
      });

      /* v55 — they bring the sick on mats */
      CARRY.forEach((cr) => {
        const k = es(t, 1.95 + cr.d, 2.6 + cr.d);
        const lay = es(t, 3.05, 3.2);
        const from = cr.side < 0 ? -200 : 1900;
        const x = lerp(from, cr.mx, k);
        const w = k > 0 && k < 1;
        const vis = es(t, 1.95 + cr.d, 2.0 + cr.d) * (1 - lay);
        cr.a.set({ x: x - 80 * cr.side * -1, y: Y + 30, s: 0.88, flip: cr.side > 0, o: vis, walk: w ? x * 0.05 : undefined, armF: 70, blink: blinkAt(T, cr.i) });
        cr.b.set({ x: x + 80 * cr.side * -1 * -1, y: Y + 34, s: 0.88, flip: cr.side > 0, o: vis, walk: w ? x * 0.05 + 2 : undefined, armF: 70, blink: blinkAt(T, cr.i + 3) });
        pose(cr.mat, { x, y: Y - 84 + (w ? Math.abs(Math.sin(x * 0.05)) * 3 : 0), s: 0.9, sx: cr.side > 0 ? -1 : 1, o: vis });
      });

      /* v56 — laid in the market place; they reach for the fringe; all who touch are healed */
      SICK.forEach((s) => {
        const laid = es(t, 3.05, 3.2);
        const near = Math.max(0, 1 - Math.abs(jx - s.mx) / 160);
        const reach = es(t, 4.05, 4.3) * (0.4 + near * 0.6);
        const healT = 5.05 + s.i * 0.14;
        const healed = es(t, healT, healT + 0.1);
        pose(s.mat, { x: s.mx, y: MAT_Y, o: laid });
        s.sit.set({ x: s.mx - 10, y: MAT_Y, s: 0.82, flip: s.mx > jx, o: laid * (1 - healed), armF: 20 + reach * 100, armB: reach * 40, head: -reach * 10, lean: reach * 6 * (s.mx > jx ? -1 : 1), blink: blinkAt(T, s.seed) });
        s.up.set({ x: s.mx, y: MAT_Y - 4, s: 0.86, flip: s.mx > jx, o: healed, armF: 60 + Math.sin(T * 3 + s.i) * 10, armB: 150, head: -6, blink: blinkAt(T, s.seed) });
        const hk = bump(t, healT, healT + 0.5);
        pose(heals[s.i], { x: s.mx, y: MAT_Y - 170, s: hk, r: T * 40, o: hk > 0.02 ? 1 : 0 });
        const jk = es(t, healT + 0.2, healT + 0.4, ease.back);
        pose(joy[s.i], { x: s.mx + 20, y: MAT_Y - 200 - Math.sin(T * 2 + s.i) * 4, s: jk * 0.9, o: jk > 0.01 ? 1 : 0 });
      });
      const fg_ = es(t, 4.1, 4.3) * (1 - es(t, 5.6, 5.9));
      pose(fringeGlow, { x: jx - 34, y: Y - 2, s: 0.8 + Math.sin(T * 3) * 0.08, o: fg_ });

      // phone: the boat, the folk who know him, and the mats inside the screen
      S.cam.x = S.portrait ? kf(t, [[0, -520], [1.0, -480], [1.4, -170], [1.9, -170], [2.4, 110], [3.0, 110], [3.4, 140], [4.0, 140], [4.9, 330]]) : kf(t, [[0, -440], [1.0, -380], [1.9, -300], [2.4, 0], [3.0, 0], [3.4, 60], [4.0, 60], [4.9, 360]]);
      S.cam.z = kf(t, [[0, 1.04], [1.9, 1.08], [2.4, 1.0], [3.4, 1.04], [4.2, 1.1], [5.2, 1.06]]);
      S.cam.y = kf(t, [[0, 30], [2.4, 20], [4.2, 60], [5.2, 50]]);
    };
  },
};
