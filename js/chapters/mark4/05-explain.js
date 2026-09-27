// Mk 4,14–20 — Jesus explains the sower. The seed is the WORD (a little glowing scroll);
// each soil is a listener, whose heart opens like a tiny window onto that very soil.
// The field runs left → right: path · rocky ground · (Jesus) · thorns · good soil; the camera walks it.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, grass, flowers, rock, olive, cypress, bush, town, sun, cloud } from '../../assets/nature.js';
import { thornBush, wheatStalk, paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade, clamp } from '../../core/anim.js';

const PI = Math.PI;
const PAR = 0.6;                               // field, plants and people share one depth
const X = { path: -200, rock: 300, jesus: 800, thorn: 1300, good: 1810 };
const camFor = (x) => (x - 800) / PAR;
const CAMX = { path: camFor(X.path), rock: camFor(X.rock), thorn: camFor(X.thorn), good: camFor(X.good) };
const TOP = 548;                               // back edge of the field
const FACE = 614;                              // front edge — below it the soil shows in cross-section
const FLAP_B = 746;                            // hinge of the cross-section flaps
const FEET = 592;                              // where listeners stand

/** eased keyframe track: [[t, v], …] */
function track(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], ease.io(seg(t, keys[i - 1][0], keys[i][0])));
  }
  return keys[keys.length - 1][1];
}
/** a point on a thrown arc */
function arcAt(p, [x0, y0], [x1, y1], h) {
  return [lerp(x0, x1, p), lerp(y0, y1, p) - Math.sin(p * PI) * h];
}

/* ---------------- local paper pieces ---------------- */

function heartPts(w, t0 = 0, t1 = 2 * PI, n = 30) {
  const k = w / 34, p = [];
  for (let i = 0; i <= n; i++) {
    const a = t0 + ((t1 - t0) * i) / n;
    p.push([16 * Math.sin(a) ** 3 * k, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * k - 2.5 * k]);
  }
  return p;
}

/** the WORD: a tiny scroll with two ink lines and a warm glow */
function wordSeed(c, { glow = 26 } = {}) {
  const s = sheet();
  s.p(c.cut(c.rect(-7, -5, 14, 10), 0.3, 3), C.parchment);
  s.p(c.cut(c.ell(-7.5, 0, 2.8, 5.8, 10), 0.2, 2) + c.cut(c.ell(7.5, 0, 2.8, 5.8, 10), 0.2, 2), C.haloRim);
  s.x(c.ribbon([[-4, -2], [4, -2.3]], 1.1) + c.ribbon([[-4, 1.4], [2.5, 1.2]], 1.1), C.inkSoft, 'opacity=".75"');
  return `<g class="wseed">${glow ? `<circle class="glow" r="${glow}" fill="url(#warm-glow)"/>` : ''}<g class="tok">${s.out()}</g></g>`;
}

/** a sewn heart-patch on the chest that opens like two little doors onto a soil */
const HW = 25, HK = HW / 34;
function heartWindow(c, kind, robe) {
  const full = heartPts(HW, 0, 2 * PI, 32).slice(0, -1);
  const fill = { path: C.sand2, rock: C.rock2, thorn: C.soil, good: C.soilRich }[kind];
  const s = sheet();
  s.p(c.cut(full, 0.2, 3), fill);
  if (kind === 'path') {
    s.p(c.cut(c.circ(-5, 5, 2.4, 7), 0.2, 2) + c.cut(c.circ(4, 8, 2, 7), 0.2, 2) + c.cut(c.circ(6, -4, 2.2, 7), 0.2, 2), C.stone2);
    s.x(c.ribbon([[-9, 1], [9, 0]], 0.9) + c.ribbon([[-6, -3], [7, -4]], 0.9), shade(C.sand2, -0.25));
  }
  if (kind === 'rock') {
    s.p(c.cut([[-9, -6], [9, -6.5], [8, -3], [-8, -2.5]], 0.3, 3), C.clay);
    s.x(c.ribbon([[-5, 2], [-1, 5], [-3, 10]], 0.9), C.rock3);
  }
  if (kind === 'good') s.x(c.ribbon([[-9, 1], [9, 0.5]], 1.3) + c.ribbon([[-7, 6], [7, 5.5]], 1.3), shade(C.soilRich, 0.22));
  let extra = '';
  if (kind === 'rock') extra = `<g class="hcrack" opacity="0"><path d="${c.ribbon([[1, -7], [-2, -2], [3, 2], [-1, 7], [1, 12]], 1.6)}" fill="${C.ink}"/></g>`;
  if (kind === 'thorn') {
    let d = '';
    [[-8, 9, -6], [0, 12, 2], [8, 9, 7]].forEach(([x, y, l]) => {
      d += c.ribbon(c.qbez([x, y], [x + l * 0.3, y - 8], [x + l, y - 16], 6), (u) => 2.2 - u * 1.4);
      d += c.poly([[x + l * 0.35 - 1, y - 7], [x + l * 0.35 + 5, y - 10], [x + l * 0.35 + 1, y - 6]]);
    });
    extra = `<g class="hthorn" transform="scale(0)">${sheet().p(d, C.thorn2).out(false)}</g>`;
  }
  if (kind === 'good') {
    extra = `<g class="hsprout" transform="scale(0)">${sheet().p(c.ribbon([[0, 0], [0, -9]], 1.4) + c.cut([[0, -7], [-5, -11], [-8, -10], [-4, -7]], 0.2, 2) + c.cut([[0, -8], [5, -12], [8, -11], [4, -8]], 0.2, 2), C.leaf).out(false)}</g>`;
  }
  const door = (a0, a1) => c.cut(heartPts(HW, a0, a1, 16), 0.2, 3);
  const doors = `<g class="doorL"><path d="${door(PI, 2 * PI)}" fill="${shade(robe, -0.07)}"/><path d="${c.poly(c.circ(-3, 3, 1.2, 6))}" fill="${C.haloRim}"/></g>`
    + `<g class="doorR"><path d="${door(0, PI)}" fill="${shade(robe, -0.02)}"/><path d="${c.poly(c.circ(3, 3, 1.2, 6))}" fill="${C.haloRim}"/></g>`;
  const rim = c.ribbon([...full, full[0], full[1]], 1.9);
  return `<g class="heart" transform="translate(-7 -110)"><circle class="hglow" r="46" fill="url(#warm-glow)" opacity="0"/>${s.out()}${extra}<g class="hseed" opacity="0">${wordSeed(c, { glow: 0 })}</g>${doors}<path d="${rim}" fill="${shade(robe, -0.3)}"/></g>`;
}
/** add a heart window to a puppet's body; returns a setter */
function addHeart(pup, c, kind, robe) {
  const armF = pup.el.querySelector('.body > .armF');
  armF.insertAdjacentHTML('beforebegin', heartWindow(c, kind, robe));
  const h = armF.previousElementSibling;
  const q = (s) => h.querySelector(s);
  const P = { dL: q('.doorL'), dR: q('.doorR'), seed: q('.hseed'), glow: q('.hglow'), crack: q('.hcrack'), thorn: q('.hthorn'), sprout: q('.hsprout') };
  const edge = 16 * HK;
  return ({ open = 0, seed = 0, glow = 0, crack = 0, thorn = 0, sprout = 0, pulse = 0 }) => {
    pose(P.dL, { x: -edge, sx: Math.max(0.06, 1 - open * 0.94), ox: -edge });
    pose(P.dR, { x: edge, sx: Math.max(0.06, 1 - open * 0.94), ox: edge });
    pose(P.seed, { x: 0, y: -1, s: 0.6 * (0.5 + 0.5 * seed), o: seed * open });
    pose(P.glow, { s: 0.7 + glow * 0.35 + pulse * 0.08, o: glow * open });
    if (P.crack) fade(P.crack, crack);
    if (P.thorn) pose(P.thorn, { s: thorn });
    if (P.sprout) pose(P.sprout, { y: 9, s: sprout });
  };
}

/** a seedling that can wilt (paper theatre: swap to the dry cut-out) */
function sproutRig(c, h, green = C.leaf, dry = C.wood3) {
  const L = h / 30;
  const fresh = sheet()
    .p(c.ribbon(c.qbez([0, 0], [2, -h * 0.5], [0, -h], 8), (u) => 3.6 - u * 1.4), green)
    .p(c.cut([[0, -h + 6 * L], [-9 * L, -h - 2 * L], [-19 * L, -h - 1 * L], [-10 * L, -h + 5 * L]], 0.3, 4) + c.cut([[0, -h + 3 * L], [9 * L, -h - 6 * L], [20 * L, -h - 5 * L], [11 * L, -h + 2 * L]], 0.3, 4), green).out();
  const tip = [h * 0.45, -h * 0.42];
  const wilt = sheet()
    .p(c.ribbon(c.qbez([0, 0], [4, -h * 0.8], tip, 10), (u) => 3.4 - u * 1.6), dry)
    .p(c.cut([tip, [tip[0] - 4 * L, tip[1] + 10 * L], [tip[0] - 2 * L, tip[1] + 18 * L], [tip[0] + 2 * L, tip[1] + 8 * L]], 0.3, 4)
      + c.cut([tip, [tip[0] + 8 * L, tip[1] + 6 * L], [tip[0] + 10 * L, tip[1] + 15 * L], [tip[0] + 4 * L, tip[1] + 6 * L]], 0.3, 4), shade(dry, -0.1)).out();
  return `<g><g class="fresh">${fresh}</g><g class="wilt" opacity="0">${wilt}</g></g>`;
}

/** the crow — a dark, jagged cut-out, more shadow than monster */
function crow(c) {
  const s = sheet();
  s.p(c.cut([[-40, -2], [-20, -12], [6, -15], [22, -10], [24, 2], [8, 9], [-16, 8], [-44, 14], [-58, 13], [-50, 7], [-60, 3], [-50, -1]], 0.5, 4), C.crow);
  s.p(c.cut(c.circ(26, -13, 11, 14), 0.3, 3), C.crow);
  s.p(c.cut([[34, -17], [52, -11], [35, -7]], 0.2, 3), C.rock3);
  s.x(c.poly(c.circ(29, -16, 2.3, 8)), C.cream);
  const wing = (col) => `<path d="${c.cut([[0, 0], [-6, -18], [-16, -34], [-30, -54], [-33, -45], [-42, -50], [-39, -39], [-49, -39], [-39, -27], [-46, -22], [-29, -10], [-14, -2]], 0.4, 4)}" fill="${col}"/>`;
  return `<g class="crow"><g class="wingB">${wing(shade(C.crow, -0.2))}</g>${s.out()}<g class="wingF">${wing(shade(C.crow, 0.16))}</g></g>`;
}

/** a thorn tendril growing from (0,0); returns path + tip */
function tendril(c, len, lean) {
  const sw = c.rr(0.5, 0.9) * (lean >= 0 ? -1 : 1) * Math.max(40, Math.abs(lean));
  const pts = c.cbez([0, 0], [sw * 0.9, -len * 0.3], [lean + sw * -0.8, -len * 0.62], [lean, -len], 22);
  let d = c.ribbon(pts, (u) => 10 - u * 7), sp = '';
  pts.forEach(([px, py], j) => {
    if (j < 2 || j > pts.length - 3) return;
    const a = pts[j - 1], b = pts[j + 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L, sd = j % 2 ? 1 : -1, k = 15 - (j / pts.length) * 7;
    sp += c.poly([[px - dx / L * 3, py - dy / L * 3], [px + nx * sd * k + dx / L * 5, py + ny * sd * k + dy / L * 5], [px + dx / L * 3, py + dy / L * 3]]);
  });
  // two short spiky side shoots, one with a curl
  [0.35, 0.6].forEach((f, i) => {
    const st = pts[Math.floor(f * (pts.length - 1))], dir = i ? 1 : -1;
    const sh = c.qbez(st, [st[0] + dir * 30, st[1] - 24], [st[0] + dir * 40, st[1] - 4], 8);
    d += c.ribbon(sh, (u) => 5 - u * 3.8);
    sh.forEach(([px, py], j) => { if (j % 3 === 1) sp += c.poly([[px - 2, py], [px + dir * 3, py - 11], [px + 2, py - 1]]); });
  });
  return { d: d + sp, tip: pts[pts.length - 1] };
}

const glint = (c, x, y, r = 6) => `<path class="glint" transform="translate(${x} ${y})" d="${c.poly(c.star(0, 0, r, r * 0.25, 4, 0))}" fill="${C.star}"/>`;

/* the cares, riches and desires that ride on the thorns (all hang from (0,0)) */
function hourglass(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-14, 2, 28, 5), 0.3, 4) + c.cut(c.rect(-14, 43, 28, 5), 0.3, 4), C.wood2);
  s.p(c.cut([[-10, 7], [10, 7], [2, 25], [10, 43], [-10, 43], [-2, 25]], 0.3, 4), C.skyVeil);
  s.p(c.cut([[-6, 13], [6, 13], [1, 24], [-1, 24]], 0.2, 3) + c.cut([[-8, 43], [8, 43], [0, 34]], 0.2, 3), C.ochre);
  s.p(c.ribbon([[-12, 6], [-12, 44]], 2.6) + c.ribbon([[12, 6], [12, 44]], 2.6), C.wood);
  return s.out();
}
function worryCloud(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, 20, 26, 15, 12, 0.24), 0.8, 4), C.storm);
  s.p(c.cut(c.blob(-12, 26, 12, 8, 9, 0.2), 0.6, 4), C.storm2);
  s.x(c.ribbon([[-13, 18], [-6, 12], [0, 24], [5, 12], [11, 21], [-4, 26], [8, 16], [2, 20]], 1.7), C.cream);
  return s.out();
}
function coins(c) {
  const s = sheet();
  s.x(c.ribbon([[0, 0], [-6, 8]], 1.2) + c.ribbon([[0, 0], [8, 10]], 1.2), C.rope);
  [[-7, 16, 10], [8, 19, 10], [0, 30, 11.5]].forEach(([x, y, r]) => {
    s.p(c.cut(c.circ(x, y, r, 18), 0.25, 3), C.sun);
    s.p(c.cut(c.circ(x, y, r * 0.64, 14), 0.2, 3), shade(C.sun, -0.16));
    s.x(c.poly(c.rect(x - 1.2, y - r * 0.4, 2.4, r * 0.8)), shade(C.sun, 0.3));
  });
  return s.out() + glint(c, -10, 11) + glint(c, 6, 32, 5);
}
function moneyBag(c) {
  const s = sheet();
  s.p(c.cut([[-5, 6], [5, 6], [9, 12], [19, 22], [23, 36], [17, 48], [0, 52], [-17, 48], [-23, 36], [-19, 22], [-9, 12]], 0.5, 4), C.basket);
  s.p(c.cut([[-9, 0], [9, 0], [11, 7], [-11, 7]], 0.3, 3), shade(C.basket, -0.12));
  s.p(c.ribbon([[-10, 9], [10, 9]], 3.4), C.terracotta);
  s.p(c.cut(c.circ(0, 33, 9, 14), 0.2, 3), C.sun);
  s.x(c.cut(c.circ(0, 33, 5.5, 10), 0.2, 3), shade(C.sun, -0.18));
  return s.out() + glint(c, 8, 28, 5);
}
function gem(c) {
  const s = sheet();
  s.x(c.ribbon([[-11, -2], [0, 13]], 1.3) + c.ribbon([[11, -2], [0, 13]], 1.3), C.haloRim);
  s.p(c.cut([[0, 13], [13, 24], [0, 46], [-13, 24]], 0.3, 4), C.lavender);
  s.p(c.cut([[0, 13], [13, 24], [0, 27], [-13, 24]], 0.2, 3), shade(C.lavender, 0.4));
  s.p(c.cut([[0, 27], [13, 24], [0, 46]], 0.2, 3), shade(C.lavender, -0.14));
  s.p(c.cut(c.circ(0, 13, 3.4, 8), 0.2, 2), C.sun);
  return s.out() + glint(c, 6, 22, 7);
}
function ring(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 26, 14, 24), 0.2, 3) + c.hole(c.circ(0, 26, 9, 18), 0.2, 3), C.sun);
  s.p(c.cut(c.star(0, 10, 9, 6, 6), 0.2, 3), C.roseRobe);
  s.x(c.poly(c.circ(-2, 8, 2.2, 6)), shade(C.roseRobe, 0.5));
  return s.out() + glint(c, 8, 6, 6);
}
const SYMBOLS = { hourglass, worryCloud, coins, moneyBag, gem, ring };

/** growing roots: a polyline cut into short pieces that appear one by one */
function roots(c, lines, w = 3, color = C.cream) {
  let out = '';
  lines.forEach(({ pts, o0 = 0, o1 = 1 }) => {
    const n = pts.length - 1;
    for (let i = 0; i < n; i++) {
      const ww = w * (1 - (i / n) * 0.6);
      out += `<path class="rs" data-o="${(o0 + ((o1 - o0) * i) / n).toFixed(3)}" d="${c.ribbon([pts[i], pts[i + 1]], ww)}" fill="${color}" opacity="0"/>`;
    }
  });
  return out;
}
function rootLines(c, x0, y0, depth, spread, branches = 3) {
  const main = [[x0, y0]];
  let x = x0;
  for (let y = y0 + 10; y <= y0 + depth; y += 12) { x += c.rr(-4, 4); main.push([x, y]); }
  const lines = [{ pts: main, o0: 0, o1: 0.8 }];
  for (let b = 0; b < branches; b++) {
    const k = 0.2 + (b / branches) * 0.6, st = main[Math.floor(k * (main.length - 1))];
    const dir = b % 2 ? 1 : -1, pts = [st];
    for (let i = 1; i <= 4; i++) pts.push([st[0] + dir * spread * (i / 4) + c.rr(-3, 3), st[1] + i * 8 + c.rr(-2, 2)]);
    lines.push({ pts, o0: k * 0.8 + 0.05, o1: Math.min(1, k * 0.8 + 0.4) });
  }
  return lines;
}

/* ---------------- the scene ---------------- */

export default {
  id: 'explain',
  parable: true,
  beats: [
    { v: 14 },
    { v: 15, text: 'A oto są ci [posiani] na drodze: u nich się sieje słowo,' },
    { v: 15, cont: true, text: 'a skoro je usłyszą, zaraz przychodzi szatan i porywa słowo zasiane w nich.' },
    { v: 16 },
    { v: 17, text: 'lecz nie mają w sobie korzenia i są niestali.' },
    { v: 17, cont: true, text: 'Gdy potem przyjdzie ucisk lub prześladowanie z powodu słowa, zaraz się załamują.' },
    { v: 18 },
    { v: 19, text: 'lecz troski tego świata, ułuda bogactwa i inne żądze wciskają się' },
    { v: 19, cont: true, text: 'i zagłuszają słowo, tak że zostaje bezowocne.' },
    { v: 20, text: 'W końcu na ziemię żyzną zostali posiani ci, którzy słuchają słowa, przyjmują je' },
    { v: 20, cont: true, text: 'i wydają owoc: trzydziestokrotny, sześćdziesięciokrotny i stokrotny».' },
  ],
  cam: { x: [CAMX.path - 20, CAMX.good + 20], y: [0, 130], z: [0.9, 1.45] },
  build(S) {
    const c = S.c;
    const SKY = [C.skyBlue, mix(C.cream, C.skyBlue, 0.25), C.paper];
    const HOT = [C.apricot, C.peach, C.dawn];
    const GOLD = [mix(C.dawn, C.halo, 0.4), C.halo, C.cream];
    const sk = sky(S, SKY);

    /* ---- sky ornaments on strings ---- */
    const skyL = S.layer({ par: 0.05, sh: 4 });
    const SUN = [1090, 168];
    const sunGold = skyL.add(`<g opacity="0">${rays(c, { n: 20, r0: 70, r1: 760, spread: 0.06, color: C.halo })}</g>`);
    const sunEl = hanging(skyL, sun(c, 46), { x: SUN[0], y: SUN[1], len: 620 });
    const hotSun = hanging(skyL, `<g class="spin">${sheet().p(c.cut(c.star(0, 0, 104, 66, 22), 0.6, 5), C.sunRay).out()}</g>${sheet().p(c.cut(c.circ(0, 0, 62, 40), 0.5, 5), C.sunDeep).p(c.cut(c.circ(-6, -6, 44, 30), 0.4, 5), C.sun).out()}`, { x: SUN[0], y: SUN[1], len: 620 });
    const hotSpin = hotSun.querySelector('.spin');
    const clouds = [[380, 150, 190], [760, 105, 130], [1330, 215, 170]].map(([x, y, w], i) => ({ x, y, el: hanging(skyL, cloud(c, w), { x, y, len: 500 + i * 60 }) }));

    /* ---- hills ---- */
    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(hillsWith(c, { y: 408, amps: [20, 8, 3], lens: [1000, 380, 140], x0: -1500, x1: 3300, color: C.hillFar, trees: 26, treeColor: C.sage2, treeH: 22 }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    const m2 = hillsWith(c, { y: 455, amps: [18, 8, 3], lens: [800, 300, 110], x0: -1500, x1: 3300, color: C.hillMid, trees: 34, treeColor: C.sage, treeH: 26 });
    mid.add(m2.markup);
    mid.add(town(c, { x: 150, y: m2.fn(150) + 10, n: 7, spread: 260, sc: 0.5 }) + town(c, { x: 1560, y: m2.fn(1560) + 10, n: 6, spread: 220, sc: 0.48 }));

    /* ---- back field with the busy road ---- */
    const backL = S.layer({ par: 0.42, sh: 3 });
    const bf = c.wave(506, [6, 2], [650, 180]);
    backL.add(sheet().p(c.ridge(bf, -1500, 3300, 1700, 12, 1), C.sage2).out());
    backL.add(sheet().p(c.cut([[-700, 512], [700, 509], [720, 526], [-720, 528]], 0.8, 14), C.sand).out());
    let hedge = '';
    for (let x = -1400; x < 3200; x += c.rr(60, 140)) if (x < -700 || x > 720) hedge += c.cut(c.blob(x, bf(x) - 8, c.rr(24, 44), c.rr(10, 16), 10, 0.2), 0.8, 6);
    backL.add(sheet().p(hedge, C.sage).out());
    backL.add(olive(c, -560, 510, 0.7) + olive(c, 860, 507, 0.6) + cypress(c, 1140, 508, 110) + olive(c, 2150, 508, 0.7));
    const glowField = backL.add(`<circle cx="${800 + 0.42 * CAMX.good + 60}" cy="470" r="720" fill="url(#warm-glow)" opacity="0"/>`);
    const walkers = [0, 1, 2, 3].map((i) => ({
      p: S.puppet(backL.add(person(c, crowdPerson(c, { belt: C.leather })))),
      dir: i % 2 ? -1 : 1, off: i * 0.27 + c.rr(0, 0.1), sp: c.rr(0.85, 1.15), s: c.rr(0.33, 0.38), y: 516 + (i % 2) * 7, ph: c.rr(0, 6),
    }));

    /* ---- the field: surface, patches, cross-section ---- */
    const ground = S.layer({ par: PAR, sh: 4 });
    const topFn = c.wave(TOP, [5, 2], [700, 170]);
    const faceFn = c.wave(FACE, [2, 1], [500, 130]);
    const G = sheet();
    G.p(c.ridge(topFn, -1500, 3300, 1700, 12, 1), C.hillNear);
    G.p(c.cut(c.blob(X.jesus, 580, 230, 30, 16, 0.08), 1, 8), shade(C.hillNear, 0.1));
    const patch = (x0, x1, col) => {
      const pts = [];
      for (let x = x0; x <= x1; x += 20) pts.push([x, 557 + c.rr(-3, 3) + (x === x0 || x > x1 - 20 ? 7 : 0)]);
      pts.push([x1 + 10, FACE + 14], [x0 - 10, FACE + 14]);
      G.p(c.cut(pts, 0.8, 10), col);
    };
    patch(-440, 40, C.sand);
    patch(60, 540, C.clay);
    patch(1060, 1540, C.soil);
    patch(1575, 2065, C.soilRich);
    // path: ruts, footprints, pebbles
    G.x(c.ribbon(c.qbez([-440, 574], [-200, 568], [40, 576], 16), 5) + c.ribbon(c.qbez([-440, 600], [-200, 594], [40, 603], 16), 5), C.sand2);
    let fp = '';
    for (let i = 0; i < 12; i++) { const x = -420 + i * 38 + c.rr(-4, 4), y = 585 + (i % 2) * 8; fp += c.cut(c.ell(x, y, 6, 2.6, 8), 0.2, 3); }
    G.x(fp, shade(C.sand, -0.14));
    let peb = '';
    for (let i = 0; i < 22; i++) peb += c.cut(c.blob(c.rr(-430, 30), c.rr(562, 610), c.rr(2.5, 5), c.rr(2, 3.5), 7, 0.2), 0.3, 3);
    G.p(peb, C.stone2);
    // rocky: flat slabs breaking through
    let slabs = '';
    for (let i = 0; i < 10; i++) slabs += c.cut(c.blob(c.rr(80, 520), c.rr(566, 606), c.rr(16, 34), c.rr(4, 7), 9, 0.2), 0.5, 5);
    G.p(slabs, C.rock);
    // thorns: dry stalks
    let dry = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(1070, 1530), y = c.rr(566, 610); dry += c.ribbon([[x, y], [x + c.rr(-8, 8), y - c.rr(6, 14)]], 1.4); }
    G.p(dry, C.thorn2);
    // good soil: furrows
    let fur = '';
    [570, 584, 598].forEach((y) => { fur += c.ribbon(c.qbez([1590, y + 2], [1820, y - 3], [2050, y + 2], 18), 4.4, 0.8); });
    G.p(fur, C.soil);
    // the cut front face
    G.p(c.ridge(faceFn, -1500, 3300, 1700, 12, 0.6), C.soil);
    G.p(c.ridge(c.wave(770, [6, 3], [300, 90]), -1500, 3300, 1700, 12, 1), shade(C.soil, -0.18));
    const block = (x0, x1, y0, y1, col, j = 2) => {
      const pts = [];
      for (let x = x0; x <= x1; x += 24) pts.push([x, y0 + c.rr(-j, j)]);
      for (let x = x1; x >= x0; x -= 24) pts.push([x, y1 + c.rr(-j, j)]);
      G.p(c.cut(pts, 0.6, 8), col);
    };
    // path: hard-packed layers
    block(-440, 40, FACE + 2, 700, shade(C.sand2, -0.1));
    [626, 646, 668].forEach((y, i) => block(-436, 36, y, y + 8, i % 2 ? C.sand2 : shade(C.sand2, -0.22), 1));
    // rocky: a thin skin of soil over a slab of rock
    block(60, 540, FACE + 2, 634, C.clay);
    block(60, 540, 632, 748, C.rock2, 4);
    let cracks = '';
    for (let i = 0; i < 7; i++) { const x = c.rr(80, 520); cracks += c.ribbon([[x, 640], [x + c.rr(-10, 10), 668], [x + c.rr(-14, 14), 700]], 1.8); }
    G.x(cracks, C.rock3);
    let chunks = '';
    for (let i = 0; i < 6; i++) chunks += c.cut(c.blob(c.rr(80, 520), c.rr(650, 730), c.rr(10, 22), c.rr(7, 12), 8, 0.2), 0.5, 5);
    G.p(chunks, C.rock);
    // thorns: tangled thorny roots
    let troots = '';
    for (let i = 0; i < 9; i++) { const x = c.rr(1070, 1530); troots += c.ribbon(c.cbez([x, FACE + 2], [x + c.rr(-40, 40), 640], [x + c.rr(-50, 50), 670], [x + c.rr(-30, 30), 700], 12), 2.2); }
    G.p(troots, C.thorn2);
    // good: deep dark soil
    block(1575, 2065, FACE + 2, 760, C.soilRich, 3);
    let specks = '';
    for (let i = 0; i < 40; i++) specks += c.poly(c.circ(c.rr(1585, 2055), c.rr(622, 750), c.rr(1.2, 2.6), 6));
    G.x(specks, shade(C.soilRich, 0.25), 'opacity=".8"');
    G.p(c.ribbon(c.qbez([1640, 712], [1660, 700], [1690, 716], 10), 4), C.roseRobe);
    // cut edge catching the light
    const edgePts = [];
    for (let x = -1500; x <= 3300; x += 20) edgePts.push([x, faceFn(x)]);
    G.x(c.ribbon(edgePts, 2.4), C.cream, 'opacity=".45"');
    // grass fringe over the edge where there is no patch
    let fringe = '';
    for (let x = -1500; x < 3300; x += c.rr(7, 14)) {
      if ((x > -450 && x < 50) || (x > 50 && x < 550) || (x > 1050 && x < 1550) || (x > 1565 && x < 2075)) continue;
      const y = faceFn(x) - 1, hh = c.rr(6, 14);
      fringe += c.poly([[x - 2.2, y], [x + c.rr(-3, 3), y + hh], [x + 2.2, y]]);
    }
    G.p(fringe, C.moss);
    ground.add(G.out());

    // roots that will grow under the flaps
    const rockRootX = X.rock + 35;
    const rootRock = ground.add(`<g>${roots(c, [
      { pts: [[rockRootX, FACE + 2], [rockRootX + 1, 622], [rockRootX + 3, 630], [rockRootX + 12, 634], [rockRootX + 24, 635], [rockRootX + 36, 632], [rockRootX + 44, 634]], o0: 0, o1: 0.85 },
      { pts: [[rockRootX + 1, 624], [rockRootX - 10, 631], [rockRootX - 22, 634], [rockRootX - 32, 632]], o0: 0.3, o1: 1 },
    ], 5)}</g>`);
    const bonk = ground.add(`<g opacity="0">${sheet().x(c.poly(c.star(0, 0, 11, 4, 6)), C.cream).out(false)}</g>`);
    const CL = [{ x: 1722, n: 3, h: [104, 124], label: '30', ly: 356 }, { x: 1852, n: 6, h: [128, 150], label: '60', ly: 318 }, { x: 1986, n: 10, h: [152, 182], label: '100', ly: 282 }];
    const rootGood = ground.add(`<g>${roots(c, CL.flatMap((cl, i) => rootLines(c, cl.x, FACE + 2, 90 + i * 22, 18 + i * 6, 3 + i)), 3.2)}</g>`);
    const rsRock = Array.from(rootRock.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    const rsGood = Array.from(rootGood.querySelectorAll('.rs')).map((el) => ({ el, o: +el.dataset.o }));
    // the lift-up flaps that hide the cross-sections
    const flap = (x0, x1) => {
      const s = sheet();
      const pts = [];
      for (let x = x0; x <= x1; x += 24) pts.push([x, FACE + 1 + c.rr(-1, 1)]);
      pts.push([x1, FLAP_B], [x0, FLAP_B]);
      s.p(c.cut(pts, 0.5, 8), shade(C.soil, -0.05));
      s.p(c.cut([[x0 + 7, FACE + 7], [x1 - 7, FACE + 7], [x1 - 7, FLAP_B - 6], [x0 + 7, FLAP_B - 6]], 0.8, 10), shade(C.soil, 0.05));
      let sp = '';
      for (let i = 0; i < 24; i++) sp += c.poly(c.circ(c.rr(x0 + 12, x1 - 12), c.rr(FACE + 12, FLAP_B - 10), c.rr(1.2, 2.6), 6));
      s.x(sp, shade(C.soil, -0.2), 'opacity=".7"');
      const mx = (x0 + x1) / 2;
      s.p(c.cut([[mx - 22, FACE + 3], [mx + 22, FACE + 3], ...c.arc(mx, FACE + 3, 22, 16, 0, PI, 8).slice(1, -1)], 0.3, 4), C.cream);
      return ground.add(`<g>${s.out()}</g>`);
    };
    const flapRock = flap(54, 546);
    const flapGood = flap(1569, 2071);

    /* ---- plants & props on the field ---- */
    const plants = S.layer({ par: PAR, sh: 3 });
    // centre: Jesus' little hill
    plants.add(olive(c, 610, 566, 1.05) + cypress(c, 1010, 570, 160) + bush(c, 690, 598, 64, C.sage, C.moss) + bush(c, 930, 596, 54, C.sage2, C.sage));
    plants.add(flowers(c, { x0: 590, x1: 1030, y: 588, n: 26, fn: (x) => 576 + Math.abs(x - 800) * 0.06 + c.rr(0, 16) }));
    plants.add(grass(c, { x0: -1400, x1: 3200, y: 556, n: 70, h: 14, color: C.moss, fn: (x) => ((x > -450 && x < 550) || (x > 1050 && x < 2075) ? 552 : 560) }));
    // path: a signpost and a donkey-worn stone
    plants.add(sheet().p(c.cut(c.rect(-434, 470, 8, 104), 0.3, 6), C.wood2).p(c.cut([[-470, 474], [-400, 470], [-386, 484], [-400, 498], [-470, 498]], 0.4, 6), C.wood3).x(c.ribbon([[-460, 484], [-410, 483]], 1.6), C.wood2).out());
    // rocky: stones
    plants.add(rock(c, 120, 580, 70, 34, C.rock2) + rock(c, 200, 572, 40, 22, C.rock) + rock(c, 470, 576, 64, 30, C.rock) + rock(c, 520, 568, 36, 18, C.rock3));
    // thorns: old thorn bushes at the margins
    plants.add(thornBush(c, 1090, 590, 90, C.thorn2) + thornBush(c, 1170, 570, 64, C.thorn) + thornBush(c, 1500, 592, 96, C.thorn2) + thornBush(c, 1530, 566, 60, C.thorn));

    // thorn tendrils carrying cares, riches and desires
    const TD = [
      { x: 1150, len: 250, lean: -35, sym: 'hourglass', back: true },
      { x: 1196, len: 316, lean: 42, sym: 'worryCloud', back: true },
      { x: 1470, len: 300, lean: -60, sym: 'gem', back: true },
      { x: 1290, len: 212, lean: 44, sym: 'moneyBag', back: false },
      { x: 1398, len: 160, lean: 36, sym: 'coins', back: false },
      { x: 1502, len: 214, lean: -24, sym: 'ring', back: false },
    ];
    const ORDER = ['hourglass', 'worryCloud', 'moneyBag', 'coins', 'gem', 'ring'];
    const people = S.layer({ par: PAR, sh: 5 });
    const fx = S.layer({ par: PAR, sh: 5 });       // in front of the people: front thorns, crow, sparkles, labels
    const tds = TD.map((d) => {
      const L = d.back ? plants : fx;
      const { d: path, tip } = tendril(c, d.len, d.lean);
      const grow = L.add(`<g>${sheet().p(path, C.thorn).out()}</g>`);
      const sym = L.add(`<g>${SYMBOLS[d.sym](c)}</g>`);
      return { ...d, grow, sym, tip, glints: Array.from(sym.querySelectorAll('.glint')), at: 7.06 + ORDER.indexOf(d.sym) * 0.075 };
    });

    // seedlings, seeds and wheat
    const choke = plants.add(`<g>${thornBush(c, 0, 0, 105, C.thorn2)}${thornBush(c, 16, 0, 80, C.thorn)}</g>`);
    const rockSprout = plants.add(sproutRig(c, 56));
    const thornSprout = plants.add(sproutRig(c, 40));
    const goodSprouts = CL.map(() => plants.add(sproutRig(c, 22)));
    const clusters = CL.map((cl) => {
      const stalks = [];
      for (let j = 0; j < cl.n; j++) {
        const dx = (j - (cl.n - 1) / 2) * (cl.n > 6 ? 9.5 : 12) + c.rr(-3, 3);
        const h = c.rr(cl.h[0], cl.h[1]) - Math.abs(dx) * 0.25;
        stalks.push({ el: plants.add(`<g>${wheatStalk(c, { h })}</g>`), dx, ph: c.rr(0, 6), d: c.rr(0, 0.12) });
      }
      return stalks;
    });
    const seedEl = () => plants.add(`<g>${wordSeed(c)}</g>`);
    const pathSeed = seedEl(), rockSeed = seedEl(), thornSeed = seedEl();
    const goodSeeds = CL.map(seedEl);
    const crowShadow = plants.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 44, 7, 16), 0.5, 5)}" fill="${C.soilDark}" opacity=".35"/></g>`);
    // front stones on the rocky ground (in front of the sprout's roots)
    plants.add(rock(c, 410, 610, 70, 28, C.rock2) + rock(c, 150, 612, 50, 22, C.rock));

    /* ---- people ---- */
    const bag = sheet().p(c.cut(c.blob(0, 16, 13, 15, 12, 0.12), 0.4, 4), C.basket).p(c.ribbon([[-6, 3], [6, 3]], 3), C.rope).out();
    const jesus = S.puppet(people.add(person(c, { ...CAST.jesus, holdB: bag })));
    const LP = {
      path: { robe: C.dustyBlue, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather, holdB: sheet().p(c.cut(c.blob(0, 12, 14, 10, 10, 0.15), 0.4, 4), C.linen2).out() },
      rock: { robe: C.roseRobe, hair: C.hair2, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin },
      thorn: { robe: C.plumRobe, mantle: C.ochreRobe, hairStyle: 'wrap', veil: C.stone, beard: 'full', hair: C.hair, skin: C.skin2, belt: C.sun },
      good: { robe: C.tealRobe, hair: C.hair, hairStyle: 'veil', veil: C.linen2, skin: C.skin4 },
    };
    const mk = (key, extra = {}) => {
      const p = S.puppet(people.add(person(c, { ...LP[key], ...extra })));
      return { p, heart: addHeart(p, c, key, LP[key].robe) };
    };
    const pathMan = mk('path');
    const rockW = mk('rock');
    const rockK = mk('rock', { pose: 'kneel' });
    const thornM = mk('thorn');
    const goodW = mk('good');
    // the kneeling heart sits lower on the body
    rockK.p.el.querySelector('.heart').setAttribute('transform', 'translate(-7 -66)');

    /* ---- fx: flying seeds, crow, sun-heat, wind, sparkles, labels ---- */
    const sown = [];
    for (let v = 0; v < 2; v++) {
      for (let i = 0; i < 7; i++) {
        const dir = v === 0 ? -1 : 1;
        sown.push({
          el: fx.add(`<g opacity="0">${wordSeed(c, { glow: 20 })}</g>`),
          tr: (v === 0 ? 0.25 : 0.64) + i * 0.02, dur: c.rr(0.2, 0.3),
          from: [800 + dir * 60, 392], to: [800 + dir * c.rr(150, 640), c.rr(584, 608)], h: c.rr(70, 190), spin: c.rr(-2, 2),
        });
      }
    }
    const crowEl = fx.add(`<g opacity="0">${crow(c)}</g>`);
    const crowWF = crowEl.querySelector('.wingF'), crowWB = crowEl.querySelector('.wingB');
    let heat = '';
    for (let i = 0; i < 4; i++) {
      const x = 360 + i * 44, pts = [];
      for (let y = 0; y <= 220; y += 10) pts.push([x + Math.sin(y / 18 + i) * 7, y]);
      heat += c.ribbon(pts, 3.2);
    }
    const heatEl = fx.add(`<g opacity="0"><path d="${heat}" fill="${C.sunRay}" opacity=".45"/></g>`);
    const wind = [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const len = c.rr(120, 220), y = 330 + i * 38 + c.rr(-10, 10);
      const pts = c.qbez([0, 0], [len * 0.5, -c.rr(6, 14)], [len, c.rr(-4, 4)], 10);
      return { el: fx.add(`<g opacity="0"><path d="${c.ribbon(pts, (u) => Math.sin(u * PI) * 5 + 0.6)}" fill="${C.cream}"/></g>`), y, off: c.rr(0, 1), len };
    });
    const sparkles = Array.from({ length: 9 }, (_, i) => ({
      el: fx.add(`<g opacity="0">${sheet().p(c.cut(c.star(0, 0, 12, 4.5, 4, 0), 0.2, 3), i % 3 ? C.halo : C.star).out(false)}</g>`),
      x: X.rock - 55 + Math.cos(i * 2.4) * c.rr(50, 95), y: 410 + Math.sin(i * 2.4) * c.rr(40, 90), d: i * 0.035,
    }));
    const labels = CL.map((cl, i) => ({ ...cl, el: hanging(fx, paperLabel(cl.label, { size: 30 + i * 3, fill: C.cream }), { x: cl.x, y: cl.ly, len: 400 }) }));
    const motes = Array.from({ length: 18 }, () => ({
      el: fx.add(`<g opacity="0"><circle r="9" fill="url(#warm-glow)"/><path d="${c.poly(c.circ(0, 0, 2, 6))}" fill="${C.star}"/></g>`),
      x: c.rr(1640, 2060), y0: c.rr(420, 600), off: c.rr(0, 1), sp: c.rr(0.7, 1.3),
    }));

    /* ---- foreground ---- */
    const fg = S.layer({ par: 0.85, sh: 6 });
    const bankFn = c.wave(800, [8, 4], [520, 170]);
    fg.add(sheet().p(c.ridge(bankFn, -1700, 3500, 1800, 14, 1.2), C.sage).p(c.ridge(c.wave(850, [6, 3], [400, 130]), -1700, 3500, 1800, 14, 1), shade(C.sage, -0.08)).out());
    fg.add(grass(c, { x0: -1600, x1: 3400, y: 800, fn: bankFn, n: 110, h: 30, color: C.moss }) + flowers(c, { x0: -1600, x1: 3400, y: 800, fn: bankFn, n: 40, h: 34 }));
    const fx85 = (x) => 800 + 0.85 * camFor(x);
    fg.add(rock(c, fx85(X.path) - 380, 830, 160, 70, C.rock2) + rock(c, fx85(X.path) + 390, 836, 120, 50, C.stone2));
    fg.add(rock(c, fx85(X.rock) - 400, 820, 140, 90, C.rock3) + rock(c, fx85(X.rock) + 380, 826, 190, 80, C.rock2));
    fg.add(thornBush(c, fx85(X.thorn) - 440, 830, 110, C.thorn2) + thornBush(c, fx85(X.thorn) + 450, 834, 100, C.thorn2));
    let fgw = '';
    for (let i = 0; i < 9; i++) fgw += `<g transform="translate(${fx85(X.good) + 380 + i * 15} ${840 + (i % 3) * 6})">${wheatStalk(c, { h: c.rr(150, 220), color: C.wheat2, ear: C.wheat })}</g>`;
    fg.add(fgw);

    /* ---------------- frame update ---------------- */
    const CAMKEYS = [[0.78, 0], [1.3, CAMX.path], [3.0, CAMX.path], [3.38, CAMX.rock], [6.0, CAMX.rock], [6.55, CAMX.thorn], [9.0, CAMX.thorn], [9.4, CAMX.good]];
    const ZKEYS = [[0, 0.9], [0.7, 0.96], [1.3, 1.34], [3.0, 1.34], [3.38, 1.36], [4.05, 1.36], [4.4, 1.42], [5.05, 1.42], [5.4, 1.34], [6.0, 1.34], [6.28, 1.08], [6.55, 1.34], [9.0, 1.34], [9.4, 1.32], [10.02, 1.32], [10.5, 1.0]];
    const YKEYS = [[0, 10], [1.3, 85], [4.05, 85], [4.4, 125], [5.05, 125], [5.4, 90], [9.0, 90], [9.45, 118], [10.02, 118], [10.5, 20]];

    return (t, time) => {
      const camx = track(t, CAMKEYS);
      S.cam.x = camx; S.cam.z = track(t, ZKEYS); S.cam.y = track(t, YKEYS);
      const near = (k) => Math.abs(camx - CAMX[k]) < 700;
      const nearJ = Math.abs(camx) < 900;

      /* sky: hot during persecution, golden at the harvest */
      const hot = es(t, 5.02, 5.32) * (1 - es(t, 5.95, 6.3));
      const gold = es(t, 9.15, 10.6);
      const b = SKY.map((col, i) => mix(mix(col, HOT[i], hot), GOLD[i], gold));
      sk.set(b[0], b[1], b[2]);
      swing(sunEl, SUN[0], SUN[1] + hot * 60 - gold * 28, time, 1.1, 0.7);
      pose(sunEl.querySelector('.obj'), { s: 1 + hot * 0.3 + gold * 0.12 });
      swing(hotSun, SUN[0], SUN[1] + hot * 60, time, 1.1, 0.7);
      pose(hotSun.querySelector('.obj'), { s: 0.8 + hot * 0.45, o: hot });
      pose(hotSpin, { r: t * 40 + (hot > 0 ? time * 14 : 0) });
      pose(sunGold, { x: SUN[0], y: SUN[1] - gold * 28, o: es(t, 10.2, 10.7) * 0.75, r: t * 6 });
      clouds.forEach((cl, i) => swing(cl.el, cl.x + Math.sin(time * 0.1 + i) * 20, cl.y - hot * 420, time, 1.4, 0.6, i));

      /* the busy road */
      walkers.forEach((w) => {
        const span = 1100;
        const pos = ((((t * 110 + time * 16) * w.sp + w.off * span) % span) + span) % span;
        const x = -550 + (w.dir > 0 ? pos : span - pos);
        w.p.set({ x, y: w.y, s: w.s, flip: w.dir < 0, o: clamp(pos / 90) * clamp((span - pos) / 90), walk: x * 0.11 * w.dir, blink: blinkAt(time, w.ph) });
      });
      fade(glowField, gold * 0.8);

      /* ---------- v14: the Sower sows the word ---------- */
      const sow1 = bump(t, 0.06, 0.44), sow2 = bump(t, 0.46, 0.84);
      const pointL = es(t, 0.86, 1.05) * (1 - es(t, 1.3, 1.5));
      const pointR = es(t, 6.02, 6.2) * (1 - es(t, 6.55, 6.8));
      const jFlip = t < 0.45 || (t >= 0.85 && t < 5.5);
      jesus.set({
        x: X.jesus, y: 580, s: 1.15, flip: jFlip,
        armF: 20 + 118 * Math.max(sow1, sow2) + pointL * 62 + pointR * 60 + (nearJ ? Math.sin(time * 0.9) * 3 : 0),
        armB: 12 + Math.max(sow1, sow2) * 10, head: -Math.max(sow1, sow2) * 6 + pointR * -4,
        lean: Math.max(sow1, sow2) * 5, blink: blinkAt(time),
      });
      sown.forEach((sd) => {
        const p = seg(t, sd.tr, sd.tr + sd.dur);
        const [x, y] = arcAt(ease.out(p), sd.from, sd.to, sd.h);
        const on = seg(t, sd.tr - 0.01, sd.tr + 0.01) * (1 - seg(t, 1.2, 1.5));
        pose(sd.el, { x, y, s: 1.35, r: p * 300 * sd.spin, o: on });
      });

      /* ---------- v15: the path ---------- */
      const wp = seg(t, 0.9, 2.95);
      const px = lerp(-40, -470, wp);
      pathMan.p.set({
        x: px, y: FEET, s: 1.1, flip: true, walk: wp > 0 && wp < 1 ? -px * 0.085 : undefined, amt: 1.2, lean: 4,
        head: bump(t, 1.5, 1.95) * 14 - 3, armF: 6, armB: 4, blink: blinkAt(time, 1),
      });
      pathMan.heart({ open: es(t, 1.5, 1.68) * (1 - es(t, 2.55, 2.8)), seed: es(t, 1.52, 1.62) * (1 - seg(t, 2.46, 2.52)), glow: es(t, 1.52, 1.62) * (1 - seg(t, 2.46, 2.56)) * 0.9 });
      // crow swoops in from the left, takes the word
      const PS = [-236, 596];
      const cu = seg(t, 2.08, 2.86);
      const P0 = [-720, 170], P2 = [240, 90], P1 = [2 * PS[0] - 0.5 * (P0[0] + P2[0]), 2 * (PS[1] - 10) - 0.5 * (P0[1] + P2[1])];
      const bz = (u) => [(1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0], (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1]];
      const [cx, cy] = bz(cu);
      const dx = 2 * (1 - cu) * (P1[0] - P0[0]) + 2 * cu * (P2[0] - P1[0]), dy = 2 * (1 - cu) * (P1[1] - P0[1]) + 2 * cu * (P2[1] - P1[1]);
      const ang = clamp(Math.atan2(dy, dx) * 180 / PI, -38, 38);
      const crowOn = seg(t, 2.06, 2.12) * (1 - seg(t, 2.84, 2.88));
      pose(crowEl, { x: cx, y: cy, s: 1.15, r: ang, o: crowOn });
      const flapA = Math.sin(time * 13 + t * 40) * 32 * (1 - bump(t, 2.4, 2.55) * 0.6);
      pose(crowWF, { x: -4, y: -9, r: flapA });
      pose(crowWB, { x: -4, y: -10, r: flapA * 0.8 });
      pose(crowShadow, { x: cx, y: 604, sx: 0.5 + 0.5 * clamp(1 - (604 - cy) / 460), o: crowOn * clamp(1 - (604 - cy) / 460) });
      // the seed on the road: arrives from the Sower, then is carried off
      {
        const a = seg(t, 1.24, 1.54);
        let [x, y] = arcAt(ease.out(a), [60, 200], PS, 120);
        let o = seg(t, 1.23, 1.26);
        if (cu >= 0.5) {
          const r = ang * PI / 180, bx = 50 * 1.15, by = -11 * 1.15;
          x = cx + bx * Math.cos(r) - by * Math.sin(r); y = cy + bx * Math.sin(r) + by * Math.cos(r);
          o *= 1 - seg(t, 2.8, 2.86);
        }
        pose(pathSeed, { x, y, s: 1.5 + (a >= 1 ? Math.sin(time * 3) * 0.08 : 0), r: (1 - a) * 200, o });
      }

      /* ---------- v16–17: rocky ground ---------- */
      const land = seg(t, 3.28, 3.5);
      {
        const [x, y] = arcAt(ease.out(land), [560, 170], [rockRootX, 600], 110);
        pose(rockSeed, { x, y, s: 1.5, r: (1 - land) * -200, o: seg(t, 3.27, 3.3) * (1 - es(t, 5.4, 5.7) * 0.85) });
      }
      const joy = es(t, 3.5, 3.66) * (1 - es(t, 4.02, 4.3));
      const hop = t > 3.5 && t < 3.98 ? Math.abs(Math.sin(((t - 3.5) * PI) / 0.16)) * 12 * (1 - seg(t, 3.5, 3.98)) : 0;
      const sway = es(t, 4.15, 4.4) * (1 - es(t, 5.3, 5.5));
      const fall = es(t, 5.45, 5.78);
      const kn = es(t, 5.7, 5.84);
      rockW.p.set({
        x: X.rock - 55, y: FEET - hop, s: 1.1, o: 1 - kn,
        armF: 8 + joy * 150 + Math.sin(t * 40) * 8 * joy - fall * 4, armB: 6 + joy * 140 + fall * 10,
        head: -joy * 10 + fall * 22, lean: Math.sin((t - 4) * PI * 3.2) * 7 * sway + (near('rock') ? Math.sin(time * 2.1) * 2 * sway : 0) + fall * 26,
        blink: blinkAt(time, 2),
      });
      rockK.p.set({ x: X.rock - 50, y: FEET, s: 1.1, o: kn, armF: 150, armB: 30, head: 24, lean: 8, blink: 1 });
      const rh = { open: es(t, 3.5, 3.68), seed: es(t, 3.5, 3.6) * (1 - es(t, 5.5, 5.75) * 0.7), glow: es(t, 3.5, 3.6) * (1 - es(t, 5.4, 5.7)) * (1 + joy * 0.4), pulse: joy * Math.sin(time * 6) };
      rockW.heart(rh);
      rockK.heart({ ...rh, crack: es(t, 5.62, 5.8) });
      sparkles.forEach((sp) => {
        const k = bump(t, 3.52 + sp.d, 3.92 + sp.d);
        pose(sp.el, { x: sp.x + (sp.x - X.rock + 55) * k * 0.2, y: sp.y - k * 12, s: k * 1.2, r: t * 200 + sp.d * 900, o: k });
      });
      {
        const pop = es(t, 3.55, 3.76, ease.back);
        const wilt = es(t, 5.34, 5.62);
        const rsw = Math.sin((t - 4) * PI * 3.2 + 0.6) * 9 * sway + (near('rock') ? Math.sin(time * 1.7) * 2 : 0) * (1 - wilt);
        pose(rockSprout, { x: rockRootX, y: 603, sy: pop, sx: 0.6 + 0.4 * pop, r: rsw + hot * 6 });
        fade(rockSprout.querySelector('.fresh'), 1 - wilt);
        fade(rockSprout.querySelector('.wilt'), wilt);
      }
      // cross-section flap and shallow roots that hit the rock
      pose(flapRock, { x: 0, y: FLAP_B, sy: 1 - es(t, 4.04, 4.34) * 1.12, oy: FLAP_B });
      const rrv = seg(t, 4.3, 4.72);
      rsRock.forEach((r) => fade(r.el, clamp((rrv - r.o) * 12) * (1 - es(t, 5.4, 5.7) * 0.5)));
      pose(bonk, { x: rockRootX + 3, y: 636, s: bump(t, 4.5, 4.78) * 1.6, r: t * 90, o: bump(t, 4.5, 4.78) });
      // harsh sun & wind
      pose(heatEl, { x: 0, y: 260 + ((t * 120 + (hot > 0 ? time * 20 : 0)) % 30), o: hot * 0.9 });
      const windOn = es(t, 5.12, 5.35) * (1 - es(t, 5.9, 6.1));
      wind.forEach((w) => {
        const k = ((t * 1.6 + (windOn > 0 ? time * 0.5 : 0) + w.off) % 1);
        pose(w.el, { x: X.rock - 520 + k * 1000, y: w.y + Math.sin(k * 6 + w.off * 9) * 8, o: windOn * Math.sin(k * PI) * 0.85 });
      });

      /* ---------- v18–19: among thorns ---------- */
      const tl = seg(t, 6.34, 6.6);
      {
        const [x, y] = arcAt(ease.out(tl), [1040, 170], [X.thorn + 35, 600], 110);
        pose(thornSeed, { x, y, s: 1.5, r: (1 - tl) * 200, o: seg(t, 6.33, 6.36) * (1 - es(t, 8.35, 8.6) * 0.9) });
      }
      const listen = es(t, 6.55, 6.75);
      const reach = es(t, 7.4, 7.7);
      const grip = es(t, 8.1, 8.4);
      thornM.p.set({
        x: X.thorn - 65, y: FEET, s: 1.1,
        armF: 6 + listen * 22 * (1 - reach) + reach * 74 - grip * 8, armB: 4 + reach * 14,
        head: listen * 9 * (1 - reach) - reach * 12 + grip * 6 + (near('thorn') ? Math.sin(time * 0.8) * 1.5 : 0),
        blink: blinkAt(time, 3),
      });
      thornM.heart({ open: es(t, 6.6, 6.78), seed: es(t, 6.62, 6.72) * (1 - es(t, 8.35, 8.6)), glow: es(t, 6.62, 6.72) * (1 - es(t, 8.3, 8.6)), thorn: es(t, 7.3, 7.8) * 0.9 + grip * 0.3 });
      {
        const g = es(t, 6.66, 6.96, ease.out);
        const wilt = es(t, 8.3, 8.6);
        pose(thornSprout, { x: X.thorn + 35, y: 603, sy: g * (1 - wilt * 0.2), sx: 0.6 + 0.4 * g, r: near('thorn') ? Math.sin(time * 1.5) * 2 * (1 - wilt) : 0 });
        fade(thornSprout.querySelector('.fresh'), 1 - wilt);
        fade(thornSprout.querySelector('.wilt'), wilt);
      }
      const press = es(t, 7.52, 7.92);
      tds.forEach((d, i) => {
        const g = es(t, d.at, d.at + 0.3, ease.out);
        const toward = Math.sign(X.thorn + 20 - d.x) || 1;
        const r = press * toward * 5 + grip * toward * 4 + (near('thorn') ? Math.sin(time * 1.1 + i) * 1.2 * g : 0);
        pose(d.grow, { x: d.x, y: 606, s: g, r, o: g > 0.01 ? 1 : 0 });
        const rr = r * PI / 180, tx = d.tip[0] * g, ty = d.tip[1] * g;
        const pop = es(t, d.at + 0.1, d.at + 0.28, ease.back);
        pose(d.sym, { x: d.x + tx * Math.cos(rr) - ty * Math.sin(rr), y: 606 + tx * Math.sin(rr) + ty * Math.cos(rr), s: pop * 1.25, r: near('thorn') ? Math.sin(time * 1.6 + i) * 6 : 0, o: pop > 0.01 ? 1 : 0 });
        d.glints.forEach((gl, j) => fade(gl, pop * (0.35 + 0.65 * Math.abs(Math.sin((near('thorn') ? time * 2.6 : 0) + t * 9 + j * 2 + i)))));
      });
      pose(choke, { x: X.thorn + 30, y: 608, sx: es(t, 8.04, 8.4, ease.out) * 1.05, sy: es(t, 8.04, 8.4, ease.out), o: es(t, 8.03, 8.08) });

      /* ---------- v20: good soil ---------- */
      goodSeeds.forEach((el, i) => {
        const a = seg(t, 9.22 + i * 0.07, 9.5 + i * 0.07);
        const [x, y] = arcAt(ease.out(a), [1470, 150], [CL[i].x, 604], 120);
        pose(el, { x, y, s: 1.5, r: (1 - a) * 220, o: seg(t, 9.21 + i * 0.07, 9.24 + i * 0.07) * (1 - es(t, 10.1 + i * 0.1, 10.35 + i * 0.1) * 0.8) });
      });
      const openH = es(t, 9.12, 9.3) * (1 - es(t, 9.68, 9.92));
      const hold = es(t, 9.68, 9.92) * (1 - es(t, 10.36, 10.56));
      const cheer = es(t, 10.36, 10.56);
      goodW.p.set({
        x: X.good - 190, y: FEET, s: 1.1,
        armF: 8 + openH * 66 + hold * 30 + cheer * 140 + (near('good') ? Math.sin(time * 2) * 4 * cheer : 0),
        armB: 6 + openH * 50 + hold * 22 + cheer * 128,
        head: openH * 6 + hold * 10 - cheer * 12, blink: blinkAt(time, 4),
      });
      goodW.heart({ open: es(t, 9.46, 9.64), seed: es(t, 9.5, 9.6), glow: es(t, 9.5, 9.6) * (0.8 + hold * 0.4 + cheer * 0.5), sprout: es(t, 9.72, 10.0, ease.back), pulse: near('good') ? Math.sin(time * 3) : 0 });
      pose(flapGood, { x: 0, y: FLAP_B, sy: 1 - es(t, 9.44, 9.72) * 1.12, oy: FLAP_B });
      const grv = seg(t, 9.6, 10.45);
      rsGood.forEach((r) => fade(r.el, clamp((grv - r.o) * 10)));
      goodSprouts.forEach((el, i) => {
        const g = es(t, 9.64 + i * 0.05, 9.88 + i * 0.05, ease.back);
        pose(el, { x: CL[i].x, y: 603, sy: g, sx: 0.6 + 0.4 * g, o: 1 - es(t, 10.08 + i * 0.12, 10.3 + i * 0.12) });
      });
      clusters.forEach((st, i) => st.forEach((s) => {
        const a = 10.02 + i * 0.12 + s.d;
        const g = es(t, a, a + 0.34, ease.out);
        pose(s.el, { x: CL[i].x + s.dx, y: 606, sy: g, sx: 0.7 + 0.3 * g, r: (near('good') ? Math.sin(time * 1.3 + s.ph) * 2.2 : 0) * g, o: g > 0.01 ? 1 : 0 });
      }));
      labels.forEach((lb, i) => {
        const a = es(t, 10.16 + i * 0.12, 10.4 + i * 0.12, ease.back);
        swing(lb.el, lb.x, lerp(lb.ly - 460, lb.ly, a), near('good') ? time : 0, 2, 0.9, i);
        fade(lb.el, a > 0.01 ? 1 : 0);
      });
      const moteOn = es(t, 10.35, 10.7);
      motes.forEach((m) => {
        const k = (((near('good') ? time * 0.12 : 0) + t * 0.6) * m.sp + m.off) % 1;
        pose(m.el, { x: m.x + Math.sin(k * 7 + m.off * 6) * 12, y: m.y0 - k * 260, s: 1, o: moteOn * Math.sin(k * PI) });
      });
    };
  },
};
