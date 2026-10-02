// Mt 13,3b–8 — the parable of the sower, on Mark 4's long field with its front edge cut open like a diorama.
// The same sower walks the field and sows: seed on the trodden path (the birds swoop down and eat it), on the
// rocky patch (it springs up at once in the thin skin of soil over the rock, then the sun rises and scorches it),
// among the thorns (they spring up and choke it), and on good soil, where it grows into wheat: a hundredfold,
// sixtyfold, thirtyfold, in Matthew's order.
import { C, person, pose, lerp, sky, hanging, swing, sheet, shade, mix, blinkAt } from '../kit.js';
import { band, hillsWith, rock, grass, town, sun, cloud, olive, flowers } from '../../assets/nature.js';
import { sprout, wheatStalk, thornBush, bird, paperLabel, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { SOWER, storyFrame } from './lib.js';

const PAR = 0.6;
const PATCH = { path: 440, rocky: 690, thorns: 930, good: 1215 };
const camFor = (x) => (x - 800) / PAR;

export default {
  id: 'mt13-sower',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 3, cont: true, text: '«Oto siewca wyszedł siać.' },
    { v: 4, text: 'A gdy siał, niektóre [ziarna] padły na drogę,' },
    { v: 4, cont: true, text: 'nadleciały ptaki i wydziobały je.' },
    { v: 5, text: 'Inne padły na miejsca skaliste, gdzie niewiele miały ziemi;' },
    { v: 5, cont: true, text: 'i wnet powschodziły, bo gleba nie była głęboka.' },
    { v: 6 },
    { v: 7 },
    { v: 8, text: 'Inne w końcu padły na ziemię żyzną' },
    { v: 8, cont: true, text: 'i plon wydały, jedno stokrotny, drugie sześćdziesięciokrotny, a inne trzydziestokrotny.' },
  ],
  cam: { x: [camFor(PATCH.path) - 20, camFor(PATCH.good) + 20], y: [0, 110], z: [0.8, 1.3] },
  build(S) {
    const c = S.c;
    const MORNING = ['#e6dcc4', '#f5e9d0', '#f8eedc'];
    const NOON = ['#f0cf9f', '#f7dcb0', '#f9e9cc'];
    sky(S, MORNING);
    const noonL = sky(S, NOON, { name: 'noon' }).layer;
    noonL.fade(0);

    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunGlow = hangL.add(`<circle r="170" fill="url(#warm-glow)" opacity="0"/>`);
    const sunEl = hanging(hangL, sun(c, 50), { x: 1180, y: 190, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 170, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 820, y: 120, len: 700 });

    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 430, amps: [20, 9, 3], lens: [1200, 400, 140], color: C.hillFar, x0: -1200, x1: 2800 }).markup);
    const mid = S.layer({ par: 0.3, sh: 3 });
    const h2 = hillsWith(c, { y: 505, amps: [16, 8, 3], lens: [900, 320, 120], color: C.hillNear, trees: 30, treeColor: C.moss, treeH: 26, x0: -1200, x1: 2800 });
    mid.add(h2.markup + town(c, { x: 150, y: h2.fn(150) + 8, n: 5, spread: 180, sc: 0.5 }));
    mid.add(olive(c, 1460, h2.fn(1460) + 10, 0.7) + olive(c, -120, h2.fn(-120) + 10, 0.8));

    /* ---------- the field ---------- */
    const field = S.layer({ par: PAR, sh: 4 });
    const top = c.wave(585, [6, 3], [700, 180]);
    const FACE = 664;
    const face = c.wave(FACE, [4, 2], [600, 140]);
    const fs = sheet();
    fs.p(c.ridge(top, -900, 2600, 1700, 12, 1), mix(C.clay, C.sand, 0.45));
    let furrows = '';
    for (let i = 0; i < 6; i++) { const y = 598 + i * 11; furrows += c.ribbon([[-900, y], [2600, y + c.rr(-3, 3)]], 1.6 + i * 0.35); }
    fs.x(furrows, shade(mix(C.clay, C.sand, 0.45), -0.12), 'opacity=".55"');
    fs.p(c.cut([[PATCH.path - 70, FACE + 2], [PATCH.path - 10, 583], [PATCH.path + 50, 583], [PATCH.path + 50, FACE + 2]], 1, 10), C.sand2);
    let steps = '';
    for (let i = 0; i < 9; i++) steps += c.poly(c.ell(PATCH.path + 15 - i * 6 + (i % 2) * 12, 594 + i * 8, 4, 2.2, 8));
    fs.x(steps, shade(C.sand2, -0.15), 'opacity=".6"');
    fs.p(c.cut([[PATCH.good - 150, FACE + 2], [PATCH.good - 120, 590], [PATCH.good + 160, 588], [PATCH.good + 190, FACE + 2]], 1.4, 10), mix(C.soil, C.clay, 0.45));
    field.add(fs.out());
    const cs = sheet();
    cs.p(c.ridge(face, -900, 2600, 1700, 10, 1.2), C.soil);
    cs.p(c.ridge(c.wave(FACE + 70, [5, 3], [500, 150]), -900, 2600, 1700, 10, 1.2), shade(C.soil, -0.18));
    cs.p(c.cut([[PATCH.path - 90, FACE + 1], [PATCH.path + 70, FACE + 1], [PATCH.path + 60, FACE + 22], [PATCH.path - 80, FACE + 24]], 0.8, 8), shade(C.sand2, -0.15));
    cs.p(c.cut(c.blob(PATCH.rocky, FACE + 70, 150, 58, 14, 0.1).map(([x, y]) => [x, Math.max(y, FACE + 14)]), 1.5, 8), C.rock2);
    cs.p(c.cut(c.blob(PATCH.rocky - 60, FACE + 40, 50, 22, 10, 0.2), 1, 6), C.rock);
    cs.p(c.cut([[PATCH.good - 160, FACE], [PATCH.good + 190, FACE], ...c.arc(PATCH.good + 15, FACE, 175, 170, 0.1, Math.PI - 0.1, 12).map(([x, y]) => [x + c.rr(-8, 8), y + c.rr(-10, 10)])], 2, 10), shade(C.soil, -0.3));
    let pebbles = '';
    for (let i = 0; i < 40; i++) pebbles += c.cut(c.blob(c.rr(-600, 2200), c.rr(FACE + 20, FACE + 200), c.rr(3, 8), c.rr(2, 5), 7, 0.2), 0.3, 3);
    cs.x(pebbles, shade(C.soil, 0.2), 'opacity=".55"');
    cs.x(c.ribbon(c.qbez([PATCH.good + 70, FACE + 96], [PATCH.good + 90, FACE + 82], [PATCH.good + 112, FACE + 100], 10), 5), C.blush);
    field.add(cs.out());
    field.add([[-70, 612, 50, 22], [-20, 640, 70, 26], [40, 606, 44, 18], [70, 646, 58, 22], [-110, 650, 40, 16]].map(([dx, y, w, h]) => rock(c, PATCH.rocky + dx, y, w, h, C.rock)).join(''));
    field.add(grass(c, { x0: -900, x1: PATCH.path - 90, y: 596, n: 20, h: 12, color: C.olive }) + grass(c, { x0: PATCH.good + 220, x1: 2600, y: 596, n: 22, h: 12, color: C.olive }));

    /* ---------- plants ---------- */
    const plants = S.layer({ par: PAR, sh: 3 });
    const mkSprout = (green = true) => plants.add(`<g>${sprout(c, { h: 22, color: green ? C.leaf : C.dune })}</g>`);
    const rootL = (x, depth, spread) => {
      let d = '';
      for (let i = 0; i < 5; i++) d += c.ribbon(c.qbez([x, FACE + 2], [x + c.rr(-spread, spread) * 0.4, FACE + depth * 0.5], [x + c.rr(-spread, spread), FACE + depth * c.rr(0.6, 1)], 8), (tt) => 2.6 - tt * 2);
      return plants.add(`<g><path d="${d}" fill="${C.wheatGreen}"/></g>`);
    };
    const rockyS = [[-40, 624], [0, 628], [34, 620], [-80, 632]].map(([dx, y], i) => ({ x: PATCH.rocky + dx, y, g: mkSprout(), w: mkSprout(false), r: rootL(PATCH.rocky + dx, 16, 10), i }));
    const thornS = [[-30, 628], [10, 632], [44, 624]].map(([dx, y], i) => ({ x: PATCH.thorns + dx, y, g: mkSprout(), w: mkSprout(false), i }));
    const thorns = [[-70, 636, 150], [-10, 642, 190], [60, 634, 160], [110, 640, 120], [-110, 640, 110]].map(([dx, y, h], i) => {
      const el = plants.add(`<g>${thornBush(c, PATCH.thorns + dx, y, h, i % 2 ? C.thorn : C.thorn2)}</g>`);
      return { el, x: PATCH.thorns + dx, y, i };
    });
    // good soil: a hundredfold, sixtyfold, thirtyfold (Matthew's order, left to right)
    const clusters = [
      { x: PATCH.good - 85, y: 614, n: 8, label: '100' },
      { x: PATCH.good + 20, y: 626, n: 5, label: '60' },
      { x: PATCH.good + 115, y: 612, n: 3, label: '30' },
    ].map((cl, ci) => {
      cl.roots = rootL(cl.x, 120, 40);
      cl.stalks = [];
      for (let i = 0; i < cl.n; i++) {
        const dx = (i - (cl.n - 1) / 2) * (ci === 0 ? 11 : 14);
        const el = plants.add(`<g>${wheatStalk(c, { h: c.rr(100, 130) + (2 - ci) * 12 })}</g>`);
        cl.stalks.push({ el, ear: el.querySelector('.ear'), dx, dy: c.rr(-4, 4), d: c.rr(0, 0.25) });
      }
      cl.sp = mkSprout();
      cl.tag = plants.add(paperLabel(cl.label, { size: 30 }));
      return cl;
    });

    /* ---------- the sower, his seeds and the birds ---------- */
    const act = S.layer({ par: PAR, sh: 5 });
    const bag = sheet().p(c.cut([[-16, -6], [16, -6], [20, 22], [0, 30], [-20, 22]], 0.6, 5), C.basket).x(c.ribbon([[-14, 0], [14, 0]], 3), shade(C.basket, -0.3)).out();
    const sower = S.puppet(act.add(person(c, { ...SOWER, holdB: `<g transform="translate(2 4)">${bag}</g>` })));
    const seeds = [];
    const throwTo = (x, y, t0) => {
      const el = act.add(`<path d="${seedPath(c, 0, 0, 5.2, c.rr(0, 3))}" fill="${C.wheat}"/>`);
      seeds.push({ el, x, y, t0, gone: Infinity });
      return seeds[seeds.length - 1];
    };
    const pathSeeds = [[-18, 612], [4, 622], [20, 604], [-2, 636], [30, 628]].map(([dx, y], i) => throwTo(PATCH.path + dx, y, 1.1 + i * 0.07));
    rockyS.forEach((s, i) => throwTo(s.x, s.y, 3.34 + i * 0.06));
    [[-60, 634], [70, 628]].forEach(([dx, y], i) => throwTo(PATCH.rocky + dx, y, 3.4 + i * 0.07));
    thornS.forEach((s, i) => throwTo(s.x, s.y, 6.06 + i * 0.05));
    clusters.forEach((cl, i) => { throwTo(cl.x - 6, cl.y, 7.32 + i * 0.07); throwTo(cl.x + 8, cl.y + 2, 7.36 + i * 0.07); });
    const birds = [0, 1, 2].map((i) => {
      const el = act.add(bird(c, { color: i === 1 ? C.bird : shade(C.bird, 0.15) }));
      return { el, wF: el.querySelector('.wingF'), wB: el.querySelector('.wingB'), seed: pathSeeds[i * 2 < 5 ? i * 2 : 4], i };
    });
    pathSeeds.forEach((s, i) => { s.gone = 2.42 + i * 0.07; });
    const heat = act.add(`<g opacity="0">${[0, 1, 2].map((i) => `<path d="${c.ribbon(c.cbez([0, 0], [14, -30], [-14, -60], [0, -90], 16), 3)}" fill="${C.apricot}" opacity=".55" transform="translate(${PATCH.rocky - 50 + i * 50} 590)"/>`).join('')}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    const ffn = c.wave(930, [8, 4], [500, 150]);
    fg.add(sheet().p(c.ridge(ffn, -1400, 3000, 1800, 14, 1.4), C.moss2).out());
    fg.add(grass(c, { x0: -1400, x1: 3000, y: 930, fn: ffn, n: 70, h: 30, color: C.moss2 }));
    fg.add(flowers(c, { x0: -1400, x1: 3000, y: 930, fn: ffn, n: 40, h: 34 }));
    storyFrame(S);

    const stops = [[0, PATCH.path - 250], [0.85, PATCH.path - 60], [3.0, PATCH.path - 60], [3.3, PATCH.rocky - 150], [5.8, PATCH.rocky - 150], [6.02, PATCH.thorns - 165], [7.0, PATCH.thorns - 165], [7.3, PATCH.good - 160]];
    const track = (t, keys) => {
      for (let i = keys.length - 1; i >= 0; i--) {
        if (t >= keys[i][0]) {
          const nx = keys[i + 1];
          if (!nx) return keys[i][1];
          return lerp(keys[i][1], nx[1], ease.io(seg(t, keys[i][0], nx[0])));
        }
      }
      return keys[0][1];
    };
    const CAMK = [[0, camFor(PATCH.path)], [3.0, camFor(PATCH.path)], [3.3, camFor(PATCH.rocky)], [5.8, camFor(PATCH.rocky)], [6.02, camFor(PATCH.thorns)], [7.0, camFor(PATCH.thorns)], [7.3, camFor(PATCH.good)], [8.2, camFor(PATCH.good)], [8.8, camFor(S.portrait ? 1090 : 1040)]];   // phone: the thirtyfold stays clear of the thread

    return (t, time) => {
      const hot = es(t, 5.0, 5.5) * (1 - es(t, 5.85, 6.3) * 0.7);
      noonL.fade(Math.max(hot, es(t, 7.5, 8.5) * 0.4));
      const sunY = 190 - es(t, 5.0, 5.5) * 40, sunS = 1 + hot * 0.7;
      swing(sunEl, 1180 - hot * 330, sunY, time, 1.2, 0.7);
      pose(sunEl.querySelector('.obj'), { s: sunS });
      pose(sunGlow, { x: 1180 - hot * 330, y: sunY, s: 1 + hot * 1.6, o: hot * 0.9 });
      swing(cl1, 420 + Math.sin(time * 0.12) * 30, 170, time, 1.4, 0.6, 1);
      swing(cl2, 820 + Math.sin(time * 0.1 + 1) * 30, 120 - hot * 200, time, 1.4, 0.8, 2);

      /* the sower walks the field and sows */
      const sx = track(t, stops), prev = track(t - 0.02, stops);
      const walking = Math.abs(sx - prev) > 0.05;
      const sowing = [bump(t, 1.03, 1.55), bump(t, 3.28, 3.7), bump(t, 6.0, 6.3), bump(t, 7.26, 7.62)].reduce((a, b) => Math.max(a, b), 0);
      const done = es(t, 8.1, 8.5);
      sower.set({
        x: sx, y: 640, s: 1.02, walk: walking ? sx * 0.045 : undefined,
        armF: 20 + sowing * (60 + Math.sin(t * 40) * 40) + done * 110,
        armB: 12 - done * 6, head: -sowing * 6 - done * 8, blink: blinkAt(time, 2),
      });
      const hand = [sx + 40, 640 - 150];
      seeds.forEach((s) => {
        const u = seg(t, s.t0, s.t0 + 0.22);
        if (u <= 0 || t > s.gone) { fade(s.el, 0); return; }
        const x = lerp(hand[0], s.x, u), y = lerp(hand[1], s.y, u) - Math.sin(u * Math.PI) * 60;
        pose(s.el, { x, y, r: u * 360, o: 1 });
      });

      /* the birds swoop, peck and fly off */
      birds.forEach((b) => {
        const arrive = seg(t, 2.0 + b.i * 0.06, 2.3 + b.i * 0.06), leave = seg(t, 2.72 + b.i * 0.05, 3.0 + b.i * 0.05);
        const tx = b.seed.x - 14 - b.i * 4, ty = b.seed.y - 2;
        let x = lerp(tx + 420, tx, ease.out(arrive)), y = lerp(ty - 330, ty, ease.out(arrive)) - Math.sin(arrive * Math.PI) * 40;
        x = lerp(x, tx - 520, ease.in(leave)); y = lerp(y, ty - 420, ease.in(leave));
        const onGround = arrive >= 1 && leave <= 0;
        const peck = onGround ? Math.max(0, Math.sin((t - 2.3) * 60 + b.i)) : 0;
        pose(b.el, { x, y, s: 1.2, r: peck * 28 - (leave > 0 ? 20 : 0), o: arrive > 0 && leave < 1 ? 1 : 0, sx: -1 });
        const f = onGround ? 0 : Math.sin(time * 14 + b.i + t * 50) * 30;
        pose(b.wF, { x: -2, y: -5, r: f });
        pose(b.wB, { x: -2, y: -6, r: f * 0.8 });
      });

      /* rocky ground: up at once in the thin soil, then scorched */
      rockyS.forEach((s) => {
        const up = es(t, 4.05 + s.i * 0.05, 4.25 + s.i * 0.05, ease.back);
        const wilt = es(t, 5.3 + s.i * 0.08, 5.75 + s.i * 0.08);
        pose(s.g, { x: s.x, y: s.y, s: 1.9 * up, r: wilt * 40 * (s.i % 2 ? 1 : -1), o: 1 - wilt });
        pose(s.w, { x: s.x, y: s.y + wilt * 2, s: 1.9 * up, sy: 1.9 * up * (1 - wilt * 0.35), r: wilt * 55 * (s.i % 2 ? 1 : -1), o: wilt });
        pose(s.r, { o: up * (1 - wilt * 0.6) });
      });
      attr(heat, 'opacity', bump(t, 5.05, 6.0) * 0.8);
      pose(heat, { y: -((time * 20) % 20) - es(t, 5, 6) * 10 });

      /* thorns spring up and choke the young shoots */
      thornS.forEach((s) => {
        const up = es(t, 6.22 + s.i * 0.04, 6.36 + s.i * 0.04, ease.back);
        const wilt = es(t, 6.55 + s.i * 0.06, 6.8 + s.i * 0.06);
        pose(s.g, { x: s.x, y: s.y, s: 1.8 * up, r: wilt * 30, o: 1 - wilt });
        pose(s.w, { x: s.x, y: s.y, s: 1.8 * up, sy: 1.8 * up * (1 - wilt * 0.4), r: wilt * 60, o: wilt });
      });
      thorns.forEach((th) => {
        const g = es(t, 6.3 + th.i * 0.05, 6.7 + th.i * 0.05);
        pose(th.el, { x: th.x, y: th.y, s: 0.15 + g * 0.95, ox: th.x, oy: th.y, o: g > 0 ? 1 : 0 });
      });

      /* good soil: shoots, roots, stalks, ears, and the harvest counts */
      clusters.forEach((cl, ci) => {
        const sp = es(t, 7.58 + ci * 0.04, 7.72 + ci * 0.04, ease.back);
        const grow = es(t, 8.02 + ci * 0.04, 8.35 + ci * 0.04);
        pose(cl.sp, { x: cl.x, y: cl.y, s: 1.9 * sp, o: 1 - grow });
        pose(cl.roots, { x: cl.x, y: FACE, sy: sp * (0.3 + grow * 0.7), ox: cl.x, oy: FACE, o: sp });
        cl.stalks.forEach((st) => {
          const g = es(t, 8.05 + st.d * 0.4 + ci * 0.04, 8.4 + st.d * 0.4 + ci * 0.04);
          const sway = Math.sin(time * 1.3 + st.dx * 0.1) * 2 * g;
          pose(st.el, { x: cl.x + st.dx, y: cl.y + st.dy, sx: 0.9 + g * 0.1, sy: g, r: sway, o: g > 0.01 ? 1 : 0 });
          fade(st.ear, es(t, 8.25 + st.d * 0.3 + ci * 0.04, 8.45 + st.d * 0.3 + ci * 0.04));
        });
        const lab = es(t, 8.42 + ci * 0.1, 8.58 + ci * 0.1, ease.back);
        pose(cl.tag, { x: cl.x, y: cl.y - 185 - (2 - ci) * 12 + Math.sin(time * 1.5 + ci) * 3, s: lab * (1.1 - ci * 0.08), r: Math.sin(time + ci) * 3, o: lab > 0 ? 1 : 0 });
      });

      S.cam.x = track(t, CAMK);
      S.cam.z = 1.26 - es(t, 8.2, 8.8) * 0.4;
      S.cam.y = 75 - es(t, 8.2, 8.8) * 25;
    };
  },
};
