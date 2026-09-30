// Łk 8,5–8a — the parable of the sower, told along one long field whose front edge is cut open, so we can see
// under the soil (Mark 4's field, told Luke's way). The sower goes out with his bag. Seed falls on the path and a
// traveller comes by and treads it flat — then the birds of the air come down and eat it. Seed falls on the rock:
// it comes up at once, but the section shows the rock right under it and no moisture there (the damp, blue earth
// stops at the rock), a little paper drop dries away, the ground cracks, and the shoots wither. Seed falls among the
// thorns: shoot and thorns come up together, and the thorn tendrils climb over it and choke it. And seed falls into
// good soil: the roots go deep into the dark damp earth, and one seed becomes a great clump of ears — a hundredfold.
import { C, person, pose, lerp, sky, hanging, swing, sheet, shade, mix, blinkAt } from '../kit.js';
import { band, hillsWith, rock, grass, town, sun, cloud, olive, flowers, house } from '../../assets/nature.js';
import { wheatStalk, thornBush, bird, paperLabel, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { SOWER, TRAVELLER, sproutRig, tendril, rootPieces, rootLines, sparkle, tr, PI } from './lib.js';

const PAR = 0.6;
const PATCH = { path: 430, rocky: 700, thorns: 960, good: 1240 };
const camFor = (x) => (x - 800) / PAR;
const TOP = 592, FACE = 664, SOWY = 604, WAY = 652;

export default {
  id: 'lk8-sower',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 5, text: '«Siewca wyszedł siać ziarno.' },
    { v: 5, cont: true, text: 'A gdy siał, jedno padło na drogę i zostało podeptane,' },
    { v: 5, cont: true, text: 'a ptaki powietrzne wydziobały je.' },
    { v: 6 },
    { v: 7 },
    { v: 8, text: 'Inne w końcu padło na ziemię żyzną i gdy wzrosło, wydało plon stokrotny».' },
  ],
  cam: { x: [camFor(250) - 20, camFor(PATCH.good) + 20], y: [0, 110], z: [0.82, 1.3] },
  build(S) {
    const c = S.c;
    const MORN = ['#e2dcc6', '#f5e9d0', '#f8eedc'];
    sky(S, MORN);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 1200, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 160, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 860, y: 110, len: 700 });

    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 430, amps: [20, 9, 3], lens: [1200, 400, 140], color: C.hillFar, x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.3, sh: 3 });
    const h2 = hillsWith(c, { y: 505, amps: [16, 8, 3], lens: [900, 320, 120], color: C.hillNear, trees: 30, treeColor: C.moss, treeH: 26, x0: -1400, x1: 3000 });
    mid.add(h2.markup + town(c, { x: 120, y: h2.fn(120) + 8, n: 5, spread: 180, sc: 0.5 }) + olive(c, 1500, h2.fn(1500) + 10, 0.7));

    /* ---------- the field, cut open at the front ---------- */
    const field = S.layer({ par: PAR, sh: 4 });
    const top = c.wave(TOP, [5, 3], [700, 180]);
    const face = c.wave(FACE, [4, 2], [600, 140]);
    const soilTop = mix(C.clay, C.sand, 0.45);
    const fs = sheet();
    fs.p(c.ridge(top, -1400, 2800, 1700, 12, 1), soilTop);
    let furrows = '';
    for (let i = 0; i < 6; i++) { const y = 604 + i * 10; furrows += c.ribbon([[-1400, y], [2800, y + c.rr(-3, 3)]], 1.4 + i * 0.3); }
    fs.x(furrows, shade(soilTop, -0.12), 'opacity=".5"');
    // the path runs along the field's edge, trodden hard
    fs.p(c.cut([[PATCH.path - 190, FACE + 2], [PATCH.path - 180, 628], [PATCH.path + 140, 626], [PATCH.path + 150, FACE + 2]], 1, 10), C.sand2);
    let prints = '';
    for (let i = 0; i < 12; i++) prints += c.poly(c.ell(PATCH.path - 170 + i * 27, 646 + (i % 2) * 8, 5, 2.2, 8));
    fs.x(prints, shade(C.sand2, -0.15), 'opacity=".6"');
    fs.p(c.cut([[PATCH.good - 150, FACE + 2], [PATCH.good - 130, 598], [PATCH.good + 160, 596], [PATCH.good + 190, FACE + 2]], 1.4, 10), mix(C.soil, C.clay, 0.4));
    field.add(fs.out());
    // the section: earth, the damp layer (none under the rock), the rock slab
    const cs = sheet();
    cs.p(c.ridge(face, -1400, 2800, 1700, 10, 1.2), C.soil);
    const damp = mix(C.soil, C.lake3, 0.32);
    cs.p(c.cut([[-1400, FACE + 40], [PATCH.rocky - 170, FACE + 44], [PATCH.rocky - 170, 1700], [-1400, 1700]], 1, 12) + c.cut([[PATCH.rocky + 170, FACE + 44], [2800, FACE + 40], [2800, 1700], [PATCH.rocky + 170, 1700]], 1, 12), damp);
    let drops = '';
    for (let i = 0; i < 60; i++) { const x = c.rr(-600, 2200); if (Math.abs(x - PATCH.rocky) < 180) continue; drops += c.poly(c.ell(x, c.rr(FACE + 56, FACE + 190), 2, 3, 6)); }
    cs.x(drops, mix(C.lake2, C.soil, 0.3), 'opacity=".7"');
    cs.p(c.cut([[PATCH.path - 200, FACE + 1], [PATCH.path + 160, FACE + 1], [PATCH.path + 150, FACE + 20], [PATCH.path - 190, FACE + 22]], 0.8, 8), shade(C.sand2, -0.15));
    cs.p(c.cut(c.blob(PATCH.rocky, FACE + 78, 170, 66, 14, 0.08).map(([x, y]) => [x, Math.max(y, FACE + 12)]), 1.5, 8), C.rock2);
    cs.p(c.cut(c.blob(PATCH.rocky - 60, FACE + 44, 60, 22, 10, 0.2), 1, 6), C.rock);
    cs.p(c.cut([[PATCH.good - 160, FACE], [PATCH.good + 190, FACE], ...c.arc(PATCH.good + 15, FACE, 175, 190, 0.1, PI - 0.1, 12).map(([x, y]) => [x + c.rr(-8, 8), y + c.rr(-10, 10)])], 2, 10), mix(C.soilRich, C.lake3, 0.18));
    let pebbles = '';
    for (let i = 0; i < 40; i++) pebbles += c.cut(c.blob(c.rr(-600, 2200), c.rr(FACE + 20, FACE + 200), c.rr(3, 8), c.rr(2, 5), 7, 0.2), 0.3, 3);
    cs.x(pebbles, shade(C.soil, 0.2), 'opacity=".5"');
    field.add(cs.out());
    field.add([[-70, 616, 50, 22], [-20, 640, 70, 26], [40, 612, 44, 18], [80, 648, 58, 22], [-120, 650, 40, 16]].map(([dx, y, w, h]) => rock(c, PATCH.rocky + dx, y, w, h, C.rock)).join(''));
    field.add(grass(c, { x0: -1400, x1: PATCH.path - 210, y: 600, n: 26, h: 12, color: C.olive }) + grass(c, { x0: PATCH.good + 220, x1: 2800, y: 600, n: 22, h: 12, color: C.olive }));
    // the sower's house at the left end of the field
    field.add(house(c, -80, 598, 150, 110, { stairs: false }) + olive(c, 60, 602, 0.6));
    // dry cracks on the rocky patch (appear when there is no moisture)
    let cr = '';
    for (let i = 0; i < 7; i++) { const x = PATCH.rocky - 110 + i * 34 + c.rr(-8, 8), y = 618 + c.rr(-8, 22); cr += c.ribbon([[x, y], [x + c.rr(-8, 8), y + 6], [x + c.rr(-10, 10), y + 13]], 1.4); }
    const cracks = field.add(`<g opacity="0"><path d="${cr}" fill="${shade(C.clay, -0.35)}"/></g>`);

    /* ---------- plants ---------- */
    const plants = S.layer({ par: PAR, sh: 3 });
    const rockyS = [[-50, 626], [-6, 630], [36, 622], [-94, 636]].map(([dx, y], i) => ({ i, x: PATCH.rocky + dx, y, el: plants.add(sproutRig(c, 40)) }));
    const rootRock = plants.add(`<g>${rootPieces(c, rockyS.map((s) => ({ pts: [[s.x, FACE + 2], [s.x + 1, FACE + 9], [s.x + 4, FACE + 13], [s.x + 14, FACE + 14]], o0: 0, o1: 1 })), 3, C.wheatGreen)}</g>`);
    const rsRock = Array.from(rootRock.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    const thornS = [[-36, 632], [8, 636], [48, 628]].map(([dx, y], i) => ({ i, x: PATCH.thorns + dx, y, el: plants.add(sproutRig(c, 40)) }));
    const thorns = [[-80, 640, 150], [-14, 646, 180], [62, 638, 160], [110, 644, 120], [-120, 644, 110]].map(([dx, y, h], i) => ({ i, x: PATCH.thorns + dx, y, el: plants.add(`<g>${thornBush(c, PATCH.thorns + dx, y, h, i % 2 ? C.thorn : C.thorn2)}</g>`) }));
    const tendrils = thornS.map((s, i) => { const td = tendril(c, 110, (i - 1) * 30); return { i, s, el: plants.add(`<g><path d="${td.d}" fill="${C.thorn2}"/></g>`) }; });
    // good soil: roots, one great clump of stalks
    const goodRoots = plants.add(`<g>${rootPieces(c, rootLines(c, PATCH.good, FACE + 2, 150, 60, 5), 3.4, C.wheatGreen)}</g>`);
    const rsGood = Array.from(goodRoots.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    const glowGood = plants.add(`<g opacity="0"><circle r="170" fill="url(#warm-glow)"/></g>`);
    const goodSprout = plants.add(sproutRig(c, 36));
    const STALKS = Array.from({ length: 15 }, (_, i) => {
      const dx = (i - 7) * 11 + c.rr(-3, 3);
      const el = plants.add(`<g>${wheatStalk(c, { h: 120 + (7 - Math.abs(i - 7)) * 6 + c.rr(-8, 8) })}</g>`);
      return { i, dx, el, ear: el.querySelector('.ear'), d: Math.abs(i - 7) / 7 };
    });
    const hundred = plants.add(`<g opacity="0">${paperLabel(tr('×100', '×100'), { size: 34 })}</g>`);

    /* ---------- the sower, the traveller, seeds, birds ---------- */
    const act = S.layer({ par: PAR, sh: 5 });
    const bag = sheet().p(c.cut([[-16, -6], [16, -6], [20, 22], [0, 30], [-20, 22]], 0.6, 5), C.basket).x(c.ribbon([[-14, 0], [14, 0]], 3), shade(C.basket, -0.3)).out();
    const sower = S.puppet(act.add(person(c, { ...SOWER, holdB: `<g transform="translate(2 4)">${bag}</g>` })));
    const trav = S.puppet(act.add(person(c, { ...TRAVELLER, holdF: `<path d="${c.ribbon([[0, -120], [0, 70]], 3.4)}" fill="${C.wood2}"/>` })));
    const seeds = [];
    const throwTo = (x, y, t0, flat = false) => {
      const el = act.add(`<path d="${seedPath(c, 0, 0, 7, c.rr(0, 3))}" fill="${shade(C.wheat2, -0.12)}"/>`);
      const s = { el, x, y, t0, flat, gone: Infinity };
      seeds.push(s);
      return s;
    };
    const pathSeeds = [[-110, 640], [-60, 648], [-16, 638], [30, 650], [76, 642]].map(([dx, y], i) => throwTo(PATCH.path + dx, y, 1.12 + i * 0.06, true));
    rockyS.forEach((s, i) => throwTo(s.x, s.y, 3.1 + i * 0.05));
    thornS.forEach((s, i) => throwTo(s.x, s.y, 4.08 + i * 0.05));
    [[-8, 628], [10, 632]].forEach(([dx, y], i) => throwTo(PATCH.good + dx, y, 5.08 + i * 0.05));
    const birds = [0, 1, 2].map((i) => {
      const el = act.add(bird(c, { color: i === 1 ? C.bird : shade(C.bird, 0.15) }));
      return { i, el, wF: el.querySelector('.wingF'), wB: el.querySelector('.wingB'), seed: pathSeeds[[0, 2, 4][i]] };
    });
    pathSeeds.forEach((s, i) => { s.gone = 2.5 + i * 0.07; });
    const dropEl = act.add(`<g opacity="0"><path d="${c.cut([[0, -26], [14, -4], [12, 8], [0, 14], [-12, 8], [-14, -4]], 0.3, 4)}" fill="${C.lake}"/><path d="${c.ribbon([[-5, -4], [-6, 5]], 2.4)}" fill="${C.foam}"/></g>`);
    const gold = [0, 1, 2, 3, 4, 5].map(() => act.add(`<g opacity="0">${sparkle(c, 14)}</g>`));

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    const ffn = c.wave(930, [8, 4], [500, 150]);
    fg.add(sheet().p(c.ridge(ffn, -1600, 3200, 1800, 14, 1.4), C.moss2).out() + grass(c, { x0: -1600, x1: 3200, y: 930, fn: ffn, n: 70, h: 30, color: C.moss2 }) + flowers(c, { x0: -1600, x1: 3200, y: 930, fn: ffn, n: 40, h: 34 }));

    const stops = [[0, -20], [0.85, PATCH.path - 150], [2.95, PATCH.path - 150], [3.1, PATCH.rocky - 160], [3.95, PATCH.rocky - 160], [4.08, PATCH.thorns - 170], [4.95, PATCH.thorns - 170], [5.08, PATCH.good - 150]];
    const track = (keys, t) => {
      for (let i = keys.length - 1; i >= 0; i--) if (t >= keys[i][0]) { const nx = keys[i + 1]; return nx ? lerp(keys[i][1], nx[1], ease.io(seg(t, keys[i][0], nx[0]))) : keys[i][1]; }
      return keys[0][1];
    };
    const camKeys = [[0, camFor(250)], [0.9, camFor(PATCH.path)], [2.95, camFor(PATCH.path)], [3.1, camFor(PATCH.rocky)], [3.95, camFor(PATCH.rocky)], [4.08, camFor(PATCH.thorns)], [4.95, camFor(PATCH.thorns)], [5.08, camFor(PATCH.good)], [5.82, camFor(PATCH.good)], [5.99, camFor(900)]];

    return (t, time) => {
      const T = time;
      swing(sunEl, 1200, 170, T, 1.2, 0.7);
      swing(cl1, 420 + Math.sin(T * 0.12) * 30, 160, T, 1.4, 0.6, 1);
      swing(cl2, 860 + Math.sin(T * 0.1 + 1) * 30, 110, T, 1.4, 0.8, 2);

      /* v5a: the sower goes out from his house to sow */
      const sx = track(stops, t), moving = Math.abs(track(stops, t + 0.01) - track(stops, t - 0.01)) > 0.05;
      const sowing = Math.max(bump(t, 1.05, 1.5), bump(t, 3.02, 3.4), bump(t, 4.0, 4.35), bump(t, 5.0, 5.35));
      const done = es(t, 5.5, 5.7);
      sower.set({ x: sx, y: SOWY, s: 0.98, walk: moving ? sx * 0.045 : undefined, armF: 20 + sowing * (60 + Math.sin(t * 40) * 40) + done * 100, armB: 12, head: -sowing * 6 - done * 8, blink: blinkAt(T, 2) });
      const hand = [sx + 40, SOWY - 146];
      seeds.forEach((s) => {
        const u = seg(t, s.t0, s.t0 + 0.2);
        if (u <= 0 || t > s.gone) { fade(s.el, 0); return; }
        const x = lerp(hand[0], s.x, u), y = lerp(hand[1], s.y, u) - Math.sin(u * PI) * 60;
        // trodden flat when the traveller's foot passes over it
        const flat = s.flat ? es(t, 1.45 + (s.x - (PATCH.path - 200)) / 360 * 0.4, 1.5 + (s.x - (PATCH.path - 200)) / 360 * 0.4) : 0;
        pose(s.el, { x, y: y + flat * 2, r: u * 360, sx: 1 + flat * 0.5, sy: 1 - flat * 0.55, o: 1 });
      });

      /* v5b: trodden under foot on the path */
      const tw = seg(t, 1.35, 1.95);
      const tx = lerp(PATCH.path - 330, PATCH.path + 260, tw);
      trav.set({ x: tx, y: WAY, s: 1.02, walk: tw > 0 && tw < 1 ? tx * 0.05 : undefined, armF: 30, armB: 10, head: 4, o: tw > 0 && tw < 1 ? 1 : 0, blink: blinkAt(T, 4) });

      /* v5c: the birds of the air eat it */
      birds.forEach((b) => {
        const arrive = seg(t, 2.05 + b.i * 0.07, 2.35 + b.i * 0.07), leave = seg(t, 2.72 + b.i * 0.05, 2.98 + b.i * 0.05);
        const bx = b.seed.x - 14, by = b.seed.y - 2;
        let x = lerp(bx + 420, bx, ease.out(arrive)), y = lerp(by - 330, by, ease.out(arrive)) - Math.sin(arrive * PI) * 40;
        x = lerp(x, bx - 520, ease.in(leave)); y = lerp(y, by - 420, ease.in(leave));
        const onGround = arrive >= 1 && leave <= 0;
        const peck = onGround ? Math.max(0, Math.sin((t - 2.35) * 60 + b.i)) : 0;
        pose(b.el, { x, y, s: 1.25, sx: -1, r: peck * 28 - (leave > 0 ? 20 : 0), o: arrive > 0 && leave < 1 ? 1 : 0 });
        const f = onGround ? 0 : Math.sin(T * 14 + b.i + t * 50) * 30;
        pose(b.wF, { x: -2, y: -5, r: f });
        pose(b.wB, { x: -2, y: -6, r: f * 0.8 });
      });

      /* v6: on the rock — up at once, then no moisture: it withers */
      rockyS.forEach((s) => {
        const up = es(t, 3.3 + s.i * 0.04, 3.45 + s.i * 0.04, ease.back);
        const wilt = es(t, 3.72 + s.i * 0.05, 3.92 + s.i * 0.05);
        pose(s.el, { x: s.x, y: s.y, sy: up, sx: 0.6 + 0.4 * up, r: wilt * (s.i % 2 ? 10 : -10) });
        fade(s.el.querySelector('.fresh'), 1 - wilt);
        fade(s.el.querySelector('.wilt'), wilt);
      });
      const rr = seg(t, 3.35, 3.6);
      rsRock.forEach((r) => fade(r.el, rr > r.o ? 1 - es(t, 3.8, 3.95) * 0.4 : 0));
      const dk = seg(t, 3.45, 3.9);
      pose(dropEl, { x: PATCH.rocky, y: 530 - dk * 10, s: (1 - dk) * 2.2, o: dk > 0 && dk < 1 ? 1 : 0 });
      fade(cracks, es(t, 3.6, 3.85));

      /* v7: among the thorns — they grow up together and choke it */
      thornS.forEach((s) => {
        const up = es(t, 4.3 + s.i * 0.04, 4.5 + s.i * 0.04, ease.back);
        const wilt = es(t, 4.65 + s.i * 0.06, 4.9 + s.i * 0.06);
        pose(s.el, { x: s.x, y: s.y, sy: up * (1 - wilt * 0.3), sx: 0.6 + 0.4 * up, r: wilt * 30 });
        fade(s.el.querySelector('.fresh'), 1 - wilt);
        fade(s.el.querySelector('.wilt'), wilt);
      });
      thorns.forEach((th) => {
        const g = es(t, 4.3 + th.i * 0.03, 4.75 + th.i * 0.03);
        pose(th.el, { x: th.x, y: th.y, s: 0.1 + g * 0.95, ox: th.x, oy: th.y, o: g > 0 ? 1 : 0 });
      });
      tendrils.forEach((td) => {
        const g = es(t, 4.5 + td.i * 0.05, 4.85 + td.i * 0.05);
        pose(td.el, { x: td.s.x - 6, y: td.s.y + 4, sy: g, sx: 0.5 + g * 0.5, o: g > 0.01 ? 1 : 0 });
      });

      /* v8a: good soil — deep roots, and a hundredfold */
      const sp = es(t, 5.22, 5.34, ease.back), grow = es(t, 5.3, 5.6);
      pose(goodSprout, { x: PATCH.good, y: 630, sy: sp, sx: sp, o: 1 - grow });
      const gr = seg(t, 5.25, 5.6);
      rsGood.forEach((r) => fade(r.el, gr > r.o ? 1 : 0));
      STALKS.forEach((st) => {
        const g = es(t, 5.3 + st.d * 0.14, 5.56 + st.d * 0.12);
        pose(st.el, { x: PATCH.good + st.dx, y: 630 + Math.abs(st.dx) * 0.04, sx: 0.9 + g * 0.1, sy: g, r: st.dx * 0.12 * g + (g > 0.9 ? Math.sin(T * 1.3 + st.dx * 0.1) * 1.5 : 0), o: g > 0.01 ? 1 : 0 });
        fade(st.ear, es(t, 5.5 + st.d * 0.08, 5.66 + st.d * 0.06));
      });
      const lab = es(t, 5.58, 5.7, ease.back);
      pose(hundred, { x: PATCH.good + 120, y: 430 + Math.sin(T * 1.5) * 3, s: lab, r: Math.sin(T) * 3, o: lab > 0 ? 1 : 0 });
      pose(glowGood, { x: PATCH.good, y: 520, s: 0.6 + es(t, 5.5, 5.9) * 0.5, o: es(t, 5.45, 5.7) * 0.8 });
      gold.forEach((g, i) => { const k = bump(t, 5.6 + i * 0.03, 5.98); pose(g, { x: PATCH.good - 80 + i * 32, y: 470 - (i % 2) * 30, s: k, r: T * 50, o: k }); });

      S.cam.x = track(camKeys, t);
      const zoomOut = es(t, 5.82, 5.99);
      S.cam.z = 1.22 - zoomOut * 0.38;
      S.cam.y = 70 - zoomOut * 20;
    };
  },
};
