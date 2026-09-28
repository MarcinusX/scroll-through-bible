// Mt 5,3–12 — the eight Beatitudes. Jesus sits on His rock with the four; the crowd sits on the slope below.
// For each blessing a round painted medallion comes down from the flies above Him and its little picture
// comes true: the poor man's gate of heaven opens; the mourner is held and a sun rises; green land rises
// around the meek shepherd; the hungry man's balance comes level and his bowl is filled; the merciful woman
// stands in light; the clouds part before the pure in heart; two quarrelling brothers take hands under the
// peacemaker's blessing; the persecuted man stands in the open gate. Each medallion then takes its place in
// an arch around Him. "Blessed are you when they revile you": shadows rise and throw dark words at the four —
// "Rejoice!": the words crumble, the whole arch shines and a crown of light comes down; and a frieze of the
// prophets shows who were persecuted before them.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { cloud, olive, flowers } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  mountSet, SKY, JX, JY, JS, teach, medallion, paintedLand, LOOK, hand, bowl, loaf, cup, heart, lightCrown, kingdomGate, littleHouse,
  beam, darkSay, pointHand, wordCard, lamb, shadowPerson, dove, flapWings, bang, prophetCameo, sep, tr, PI, DY, voiceRings, STRING,
} from './lib.js';

const R = 120, SS = 0.4, BIG = [800, 360];
const SLOT = Array.from({ length: 8 }, (_, i) => { const a = ((196 + (i * 148) / 7) * PI) / 180; return [800 + Math.cos(a) * 312, 615 + Math.sin(a) * 420]; });

/* place a part / a puppet inside medallion m (local coords around its centre) */
const put = (m, el, lx, ly, o = {}) => pose(el, { ...o, x: m.x + lx * m.s, y: m.y + ly * m.s, s: (o.s ?? 1) * m.s, o: (o.o ?? 1) * m.on });
const pup = (m, p, lx, ly, o = {}) => p.set({ ...o, x: m.x + lx * m.s, y: m.y + ly * m.s, s: (o.s ?? 1) * m.s, o: (o.o ?? 1) * m.on });

/** gate of heaven with two door leaves that open; returns { gate, dl, dr } parts added to L */
function heavenGate(c, L, w = 64, h = 92) {
  const G = kingdomGate(c, w, h);
  const gate = L.add(`<g>${G.light}${G.frame}</g>`);
  const r = w / 2, top = -h + 50;
  const leaf = (dir) => {
    const pts = dir < 0 ? [[0, 0], [0, top], ...c.arc(r, top, r, 50, PI, 1.5 * PI, 8), [r, 0]] : [[0, 0], [0, top], ...c.arc(-r, top, r, 50, 2 * PI, 1.5 * PI, 8), [-r, 0]];
    return L.add(`<g>${sheet().p(c.cut(pts, 0.3, 4), mix(C.sun, C.ochre, 0.45)).x(c.ribbon([[dir * -4, -14], [dir * -(r - 6), -14]], 2) + c.ribbon([[dir * -4, top + 4], [dir * -(r - 6), top + 4]], 2), shade(C.ochre, -0.2), 'opacity=".6"').out()}</g>`);
  };
  return { gate, dl: leaf(-1), dr: leaf(1), r };
}
function setGate(m, g, lx, ly, { o = 1, open = 0, s = 1 } = {}) {
  put(m, g.gate, lx, ly, { o, s });
  put(m, g.dl, lx - g.r * s, ly, { o, s, sx: Math.max(0.08, 1 - open * 0.9) });
  put(m, g.dr, lx + g.r * s, ly, { o, s, sx: Math.max(0.08, 1 - open * 0.9) });
}

/* ================================================================== the eight pictures */
const V = [
  /* 0 — the poor in spirit: theirs is the kingdom of heaven */
  (S, L, c, frame) => {
    frame(paintedLand(c, { skyCol: mix(C.dawn, C.skyBlue, 0.45), far: mix(C.hillFar, C.duskViolet, 0.2), near: mix(C.sand2, C.hillNear, 0.3), horizon: 34 }) + `<g transform="translate(-86 74) scale(.8)">${littleHouse(c)}</g><g transform="translate(88 70)">${olive(c, 0, 0, 0.3)}</g>`);
    const G = heavenGate(c, L);
    const bm = L.add(`<g>${beam(c, 44, 96, 104)}</g>`);
    const poor = S.puppet(L.add(person(c, { ...LOOK.poor, pose: 'kneel' })));
    const bw = L.add(`<g>${bowl(c, { w: 30, food: null, color: C.clay })}</g>`);
    const cr = L.add(`<g>${lightCrown(c, 16)}</g>`);
    return (k, T, m) => {
      const g = es(k, 0.18, 0.38, ease.out), open = es(k, 0.4, 0.56);
      setGate(m, G, 0, -14, { o: g, open, s: 0.8 + g * 0.2 });
      put(m, bm, 0, -16, { o: es(k, 0.48, 0.62) * 0.9 });
      const lift = es(k, 0.5, 0.68);
      const px = -8, py = 96, a = 60 + lift * 16;
      pup(m, poor, px, py, { s: 0.42, armF: a, armB: 10 + lift * 30, head: 16 - lift * 28, blink: blinkAt(T, 3) });
      const [hx, hy] = hand(px, py, 0.42, false, a, 0, DY.kneel);
      put(m, bw, hx + 8, hy + 6);
      const ck = es(k, 0.56, 0.72, ease.out);
      put(m, cr, px + 2, lerp(-10, 30, ck), { o: ck });
    };
  },
  /* 1 — those who mourn: they shall be comforted */
  (S, L, c, frame) => {
    const hills = sheet().p(c.cut([[-130, 60], [-60, 40], [10, 52], [70, 36], [130, 48], [130, 130], [-130, 130]], 0.8, 8), mix(C.hillNear, C.duskViolet, 0.28)).out();
    const fr_ = frame(paintedLand(c, { skyCol: mix(C.duskViolet, C.dawn, 0.4), far: mix(C.hillFar, C.duskViolet, 0.45), near: mix(C.hillNear, C.duskViolet, 0.28), horizon: 36 }) + `<g class="sun"><circle r="54" fill="url(#warm-glow)"/>${sheet().p(c.cut(c.circ(0, 0, 15, 20), 0.3, 4), C.sun).out()}</g>` + hills);
    const sunE = fr_.querySelector('.sun');
    const mo = S.puppet(L.add(person(c, { ...LOOK.mourner, pose: 'sit' })));
    const tears = [0, 1].map(() => L.add(`<path d="${c.cut([[0, -4], [2.6, 1], [0, 3.4], [-2.6, 1]], 0.1, 2)}" fill="${C.skyBlue}"/>`));
    const fr = S.puppet(L.add(person(c, LOOK.friend)));
    return (k, T, m) => {
      const come = es(k, 0.12, 0.46), hold = es(k, 0.44, 0.6), lift = es(k, 0.58, 0.72);
      const sk = es(k, 0.5, 0.74);
      pose(sunE, { x: 58, y: lerp(62, 16, sk), o: sk });
      pup(m, mo, -22, 98, { s: 0.44, armF: 140 * (1 - lift) + 30 * lift, armB: 10, head: 16 - lift * 22, blink: blinkAt(T, 5) });
      tears.forEach((te, j) => {
        const ph = T ? (T * 0.8 + j * 0.5) % 1 : 0.3 + j * 0.4;
        put(m, te, -22 + 12 + j * 4, 98 - 46 + 6 + ph * 26, { o: (1 - hold) * (1 - ph) });
      });
      const fx = lerp(108, 26, come);
      pup(m, fr, fx, 100, { s: 0.44, flip: true, walk: come > 0.01 && come < 0.99 ? fx * 0.2 : undefined, armF: 20 + hold * 70, armB: 10 + hold * 20, lean: -hold * 5, head: 6, blink: blinkAt(T, 2) });
    };
  },
  /* 2 — the meek: they shall inherit the earth */
  (S, L, c, frame) => {
    const ls = sheet();
    ls.p(c.cut([[-140, 0], [-140, -78], [-90, -92], [-40, -80], [10, -96], [60, -84], [140, -100], [140, 0]], 0.8, 8), mix(C.hillNear, C.sage2, 0.3));
    ls.p(c.cut([[-140, 0], [-140, -44], [-60, -56], [20, -44], [90, -58], [140, -48], [140, 0]], 0.8, 8), C.hillNear);
    let fields = '';
    for (let i = 0; i < 5; i++) fields += c.ribbon([[-130 + i * 60, -40 + (i % 2) * 6], [-90 + i * 60, -48 + (i % 2) * 6]], 3);
    ls.x(fields, C.wheatGreen, 'opacity=".8"');
    const fr_ = frame(paintedLand(c, { skyCol: mix(C.skyBlue, C.cream, 0.35), far: mix(C.hillFar, C.dune, 0.2), near: mix(C.sand2, C.soil, 0.3), horizon: 44 }) + `<g class="land" transform="translate(0 132) scale(1 0.001)">${ls.out()}<g transform="translate(-86 -88)">${olive(c, 0, 0, 0.3)}</g><g transform="translate(66 -86) scale(.7)">${littleHouse(c)}</g><g transform="translate(104 -98)">${olive(c, 0, 0, 0.24)}</g></g>`);
    const land = fr_.querySelector('.land');
    const fl = L.add(`<g>${flowers(c, { x0: -100, x1: 100, y: 0, n: 12, h: 12 })}</g>`);
    const sh = S.puppet(L.add(person(c, LOOK.shepherd)));
    const lb = L.add(`<g>${lamb(c)}</g>`);
    return (k, T, m) => {
      const rise = es(k, 0.22, 0.58, ease.out), open = es(k, 0.3, 0.55), fk = es(k, 0.55, 0.72, ease.back);
      pose(land, { x: 0, y: 132, sy: Math.max(0.001, rise) });
      put(m, fl, 0, 108, { s: fk, o: fk > 0.01 ? 1 : 0 });
      pup(m, sh, -30, 100, { s: 0.42, armF: 20 + open * 45, armB: 10 + open * 40, head: 12 - open * 16, blink: blinkAt(T, 4) });
      put(m, lb, 28, 102, { s: 0.32, sx: -1 });
    };
  },
  /* 3 — hunger and thirst for righteousness: they shall be filled */
  (S, L, c, frame) => {
    frame(paintedLand(c, { skyCol: mix(C.sand, C.skyBlue, 0.35), far: mix(C.dune, C.hillFar, 0.4), near: mix(C.sand2, C.dune, 0.35), horizon: 42 }));
    const post = L.add(`<g>${sheet().p(c.cut([[-3, 0], [3, 0], [4, 92], [-4, 92]], 0.2, 5), C.wood2).p(c.cut(c.ell(0, 94, 18, 5, 12), 0.3, 4), C.wood2).out()}</g>`);
    const bs = sheet();
    bs.p(c.cut(c.rect(-56, -3, 112, 6), 0.2, 5), C.sun);
    bs.x(`M-52 0L-64 34M-52 0L-40 34M52 0L40 34M52 0L64 34`, 'none', `stroke="${STRING}" stroke-width="1"`);
    bs.p(c.cut([...c.arc(-52, 34, 16, 8, 0, PI, 8)], 0.2, 3) + c.cut([...c.arc(52, 34, 16, 8, 0, PI, 8)], 0.2, 3), C.sun);
    bs.p(c.cut(c.circ(0, 0, 5, 8), 0.2, 3), shade(C.sun, -0.2));
    const beamE = L.add(`<g>${bs.out()}</g>`);
    const man = S.puppet(L.add(person(c, { ...LOOK.poor, robe: C.stone2, hair: C.hair3 })));
    const bw = L.add(`<g>${bowl(c, { w: 30, food: null, color: C.pot })}</g>`);
    const br = L.add(`<g>${loaf(c, 11)}</g>`);
    const cp = L.add(`<g>${cup(c, C.clay)}</g>`);
    const water = L.add(`<g><path d="${c.cut(c.ell(0, 0, 9, 2.6, 10), 0.1, 2)}" fill="${C.lake}"/></g>`);
    const stream = L.add(`<g><path d="${c.ribbon([[0, 0], [0, 1]], 3)}" fill="${C.lake}"/></g>`);
    return (k, T, m) => {
      const lev = es(k, 0.18, 0.42), fill = es(k, 0.46, 0.6, ease.back), pour = bump(k, 0.44, 0.74), full = es(k, 0.5, 0.66);
      put(m, post, 40, -58);
      put(m, beamE, 40, -58, { r: 20 * (1 - lev) });
      const px = -42, py = 100, a = 72;
      pup(m, man, px, py, { s: 0.42, armF: a, armB: 10, head: -lev * 10 * (1 - full) + full * 8, blink: blinkAt(T, 6) });
      const [hx, hy] = hand(px, py, 0.42, false, a);
      put(m, bw, hx + 8, hy + 6);
      put(m, br, hx + 8, hy - 2, { s: fill, o: fill > 0.01 ? 1 : 0 });
      put(m, cp, 34, 102);
      put(m, water, 34, 102 - 24, { o: full });
      put(m, stream, 34, -30, { sy: 104, o: pour > 0.02 ? 0.85 : 0 });
    };
  },
  /* 4 — the merciful: they shall obtain mercy */
  (S, L, c, frame) => {
    frame(paintedLand(c, { skyCol: mix(C.peach, C.skyBlue, 0.5), far: mix(C.hillFar, C.dune, 0.3), near: mix(C.sand, C.hillNear, 0.35), horizon: 36 }) + `<path d="${c.ribbon([[-130, 110], [0, 84], [130, 70]], 26)}" fill="${mix(C.sand, C.cream, 0.35)}"/>`);
    const bm = L.add(`<g>${beam(c, 30, 96, 116)}</g>`);
    const fallen = S.puppet(L.add(person(c, { ...LOOK.poor, robe: C.linen2, pose: 'sit' })));
    const helper = S.puppet(L.add(person(c, { ...LOOK.girl, robe: C.roseRobe, veil: C.blushVeil, pose: 'kneel' })));
    const cp = L.add(`<g>${cup(c, C.pot)}</g>`);
    const ht = L.add(`<g>${heart(c, 8)}</g>`);
    return (k, T, m) => {
      const reach = es(k, 0.12, 0.38), take = es(k, 0.34, 0.5), bk = es(k, 0.5, 0.64), hk = es(k, 0.56, 0.72, ease.back);
      put(m, bm, -30, -112, { o: bk * 0.9 });
      pup(m, fallen, 36, 102, { s: 0.42, flip: true, lean: 8 - take * 8, armF: 10 + take * 50, head: 16 - take * 18, blink: blinkAt(T, 7) });
      const a = 20 + reach * 62;
      pup(m, helper, -30, 102, { s: 0.42, armF: a, armB: 10 + hk * 40, lean: reach * 6, head: 4 - hk * 14, blink: blinkAt(T, 8) });
      const [hx, hy] = hand(-30, 102, 0.42, false, a, reach * 6, DY.kneel);
      put(m, cp, hx + 4, hy + 8);
      put(m, ht, -26, lerp(20, 4, hk), { s: hk, o: hk > 0.01 ? 1 : 0 });
    };
  },
  /* 5 — the pure in heart: they shall see God (light, never a figure) */
  (S, L, c, frame) => {
    const fr_ = frame(paintedLand(c, { skyCol: mix(C.lavender, C.skyBlue, 0.5), far: mix(C.hillFar, C.lavender, 0.3), near: C.hillNear, horizon: 46 }) + `<g class="rad" opacity="0" transform="translate(0 -54)"><circle r="96" fill="url(#halo-glow)"/>${rays(c, { n: 16, r0: 18, r1: 100, spread: 0.07 })}${sheet().p(c.cut(c.circ(0, 0, 18, 22), 0.3, 4), C.halo).x(c.poly(c.circ(0, 0, 10, 14)), '#fffdf2').out()}</g>` + [0, 1].map((j) => `<g class="cl${j}">${cloud(c, 120, mix(C.cream, C.lavender, 0.3), mix(C.stone, C.lavender, 0.35))}</g>`).join(''));
    const cl = [0, 1].map((j) => fr_.querySelector('.cl' + j));
    const rad = fr_.querySelector('.rad');
    const girl = S.puppet(L.add(person(c, LOOK.girl)));
    const ht = L.add(`<g>${heart(c, 6)}</g>`);
    return (k, T, m) => {
      const part = es(k, 0.22, 0.56), shine = es(k, 0.36, 0.62);
      pose(rad, { x: 0, y: -54, s: 0.7 + shine * 0.3, o: shine });
      cl.forEach((e, j) => { const d = j ? 1 : -1; pose(e, { x: d * lerp(30, 90, part), y: -40 - part * 10, o: 1 - es(k, 0.36, 0.56) }); });
      pup(m, girl, -4, 102, { s: 0.42, armF: 20 + part * 26, armB: 10 + part * 20, head: -part * 22, blink: blinkAt(T, 9) });
      put(m, ht, -4 + 4, 102 - 104 * 0.42, { s: 1 + Math.sin(T * 2) * 0.05, o: es(k, 0.05, 0.2) });
    };
  },
  /* 6 — the peacemakers: they shall be called children of God */
  (S, L, c, frame) => {
    frame(paintedLand(c, { skyCol: mix(C.skyBlue, C.dawn, 0.35), far: C.hillFar, near: mix(C.hillNear, C.sand, 0.3), horizon: 38 }) + `<g transform="translate(-104 72) scale(.7)">${littleHouse(c)}</g><g transform="translate(100 70) scale(-.7 .7)">${littleHouse(c)}</g>`);
    const mk = S.puppet(L.add(person(c, { robe: C.linen2, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2 })));
    const A = S.puppet(L.add(person(c, LOOK.brotherA)));
    const B = S.puppet(L.add(person(c, LOOK.brotherB)));
    const bangs = [0, 1].map(() => L.add(`<g>${bang(c, C.terracotta, 0.8)}</g>`));
    const dv = L.add(`<g>${dove(c)}</g>`);
    const tg = L.add(`<g>${wordCard(c, tr('synowie Boży', 'children of God'), { size: 13 })}</g>`);
    return (k, T, m) => {
      const anger = 1 - es(k, 0.3, 0.44), step = es(k, 0.34, 0.58), bless = es(k, 0.12, 0.34), fly = es(k, 0.42, 0.66, (x) => x), tk = es(k, 0.58, 0.72, ease.back);
      pup(m, mk, 0, 88, { s: 0.4, o: bless, armB: 20 + bless * 120, armF: 30 + bless * 20, head: -4, blink: blinkAt(T, 1) });
      const ax = lerp(-74, -26, step), bx = lerp(74, 26, step);
      pup(m, A, ax, 102, { s: 0.4, walk: step > 0.01 && step < 0.99 ? step * 12 : undefined, armB: anger * 150, armF: 20 + step * 64, head: -anger * 6, blink: blinkAt(T, 2) });
      pup(m, B, bx, 102, { s: 0.4, flip: true, walk: step > 0.01 && step < 0.99 ? step * 12 : undefined, armB: anger * 150, armF: 20 + step * 64, head: -anger * 6, blink: blinkAt(T, 3) });
      bangs.forEach((b, j) => put(m, b, (j ? bx : ax) + (j ? 14 : -14), 22, { r: (j ? 1 : -1) * 10, o: anger * es(k, 0, 0.08) }));
      put(m, dv, lerp(120, 0, fly), lerp(-80, -44, fly) + Math.sin(fly * PI) * -14, { s: 0.42, sx: -1, o: fly > 0.01 ? 1 : 0 });
      flapWings(dv, T || 1, 30, 8, fly > 0.95 ? 12 : 0);
      put(m, tg, 0, lerp(-130, -84, tk), { o: tk > 0.01 ? 1 : 0 });
    };
  },
  /* 7 — persecuted for righteousness: theirs is the kingdom of heaven */
  (S, L, c, frame) => {
    frame(paintedLand(c, { skyCol: mix(C.storm, C.dusk, 0.4), far: mix(C.hillFar, C.storm, 0.35), near: mix(C.hillNear, C.storm, 0.22), horizon: 38 }));
    const G = heavenGate(c, L, 78, 128);
    const man = S.puppet(L.add(person(c, { ...LOOK.elder, mantle: C.sageRobe })));
    const sc = L.add(`<g>${sheet().p(c.cut(c.rect(-5, -16, 10, 32), 0.2, 3), C.parchment).p(c.cut(c.ell(0, -17, 6, 3, 8), 0.2, 2) + c.cut(c.ell(0, 17, 6, 3, 8), 0.2, 2), C.wood2).out()}</g>`);
    const sh = [-1, 1].map((d) => ({ d, p: S.puppet(L.add(shadowPerson(c, { hairStyle: 'short', beard: 'short' }, mix(C.storm2, C.ink, 0.4)))) }));
    const says = [-1, 1].map((d) => L.add(`<g>${darkSay(c, { w: 34, h: 22, side: -d })}</g>`));
    const cr = L.add(`<g>${lightCrown(c, 16)}</g>`);
    return (k, T, m) => {
      const near = es(k, 0.02, 0.28), back = es(k, 0.44, 0.62), g = es(k, 0.38, 0.54), open = es(k, 0.5, 0.66), ck = es(k, 0.58, 0.74, ease.out);
      setGate(m, G, 0, 102, { o: g, open });
      pup(m, man, 2, 102, { s: 0.42, armF: 64, armB: 10 + ck * 30, head: 6 - ck * 14, blink: blinkAt(T, 4) });
      const [hx, hy] = hand(2, 102, 0.42, false, 64);
      put(m, sc, hx + 4, hy + 2, { r: -20 });
      sh.forEach((q) => pup(m, q.p, q.d * (lerp(120, 70, near) + back * 26), 104, { s: 0.42 - back * 0.06, flip: q.d > 0, armF: 90 * (1 - back * 0.7), o: 1 - back * 0.45 }));
      says.forEach((e, j) => {
        const d = j ? 1 : -1, f = es(k, 0.1 + j * 0.06, 0.34 + j * 0.06), drop = es(k, 0.42, 0.6);
        put(m, e, d * lerp(70, 28, f), lerp(40, 30, f) + drop * 60, { o: f * (1 - drop) });
      });
      put(m, cr, 4, lerp(-10, 30, ck), { o: ck });
    };
  },
];

export default {
  id: 'mt5-blessed',
  beats: [
    { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 10 },
    { v: 11 },
    { v: 12, text: 'Cieszcie się i radujcie, albowiem wasza nagroda wielka jest w niebie.' },
    { v: 12, cont: true, text: 'Tak bowiem prześladowali proroków, którzy byli przed wami.' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = mountSet(S, { skyCols: SKY.day, sunXY: [1330, 110] });

    /* the shadows who revile (v11), behind the four */
    const shL = S.layer({ par: 0.48, sh: 4 });
    const SH = [[446, -1], [530, -1], [1070, 1], [1154, 1]].map(([x, d], i) => ({ x, d, i, p: S.puppet(shL.add(shadowPerson(c, { hairStyle: i % 2 ? 'wrap' : 'short', veil: '#000', beard: 'short', mantle: i % 2 ? '#000' : null }, mix(C.storm2, C.ink, 0.35)))) }));

    /* the medallions */
    const ML = S.layer({ par: 0.3, sh: 6 });
    const glows = SLOT.map(() => ML.add(`<g><circle r="96" fill="url(#halo-glow)"/></g>`));
    const MED = V.map((fn, i) => {
      let frameEl = null;
      const upd = fn(S, ML, c, (inner) => (frameEl = ML.add(`<g>${medallion(c, S.id('m' + i), R, inner)}</g>`)));
      // the frame has to sit behind its parts: it is added first by fn (frame() is called before any part)
      return { i, frameEl, upd };
    });
    // v12a — the crown of light, the reward in heaven
    const crown = ML.add(`<g>${lightCrown(c, 60)}</g>`);
    // v12b — the prophets before you: a frieze of sepia cameos, with shadow hands pointing at them
    const PROPH = [
      [tr('Eliasz', 'Elijah'), { robe: C.wood3, mantle: C.leather, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: C.greyHair, skin: C.skin3, fur: true }],
      [tr('Izajasz', 'Isaiah'), { robe: C.linen2, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin2 }],
      [tr('Jeremiasz', 'Jeremiah'), { robe: C.sageRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin2 }],
      [tr('Zachariasz', 'Zechariah'), { robe: C.linen, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3 }],
    ];
    const bw = 460, bh = 170;
    const board = sheet().p(c.cut(c.rect(-bw / 2 - 12, -bh / 2 - 12, bw + 24, bh + 24), 0.6, 10), C.wood2).p(c.cut(c.rect(-bw / 2, -bh / 2, bw, bh), 0.5, 10), mix(C.parchment, C.sand, 0.3)).out();
    const frieze = ML.add(`<g><path d="M${-bw * 0.32} -2400V${-bh / 2 - 12}M${bw * 0.32} -2400V${-bh / 2 - 12}" stroke="${STRING}" stroke-width="1.3" fill="none"/>${sep(board, 0.3)}${PROPH.map(([name, look], i) => `<g transform="translate(${-165 + i * 110} -14)">${prophetCameo(c, S.id('pr' + i), look, name, { w: 66, h: 84 })}</g>`).join('')}</g>`);
    const hands = PROPH.map((_, i) => ML.add(`<g>${pointHand(c, mix(C.storm2, C.ink, 0.35))}</g>`));

    /* Jesus and the four */
    const { jesus, four } = set.circle();
    const voice = voiceRings(set.L, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });
    const says = four.map((f, i) => ({ f, i, el: set.L.add(`<g>${darkSay(c, { w: 54, h: 34, side: f.x > JX ? 1 : -1 })}</g>`) }));
    set.front();

    return (t, time) => {
      const T = time;
      set.update(T);

      /* the medallions: come down big above Him, the picture happens, then go to their places in the arch */
      MED.forEach((md) => {
        const i = md.i;
        const inK = es(t, i - 0.04, i + 0.28, ease.out);
        const out = es(t, i + 1, i + 1.3);
        const m = {
          x: lerp(BIG[0], SLOT[i][0], out),
          y: lerp(lerp(-720, BIG[1], inK), SLOT[i][1], out) + Math.sin(T * 0.9 + i) * 2 * (1 - out),
          s: lerp(1, SS, out),
          on: inK > 0.001 ? 1 : 0,
        };
        put(m, md.frameEl, 0, 0);
        md.upd(Math.min(t - i, 0.99), T, m);
        const gk = es(t, 9.15 + i * 0.05, 9.45 + i * 0.05) * (1 - es(t, 10.05, 10.4) * 0.5);
        pose(glows[i], { x: SLOT[i][0], y: SLOT[i][1], s: 0.9 + Math.sin(T * 1.5 + i) * 0.04, o: gk });
      });

      /* v11 — shadows rise and throw dark words at the four */
      const rise = es(t, 8.08, 8.36, ease.out) * (1 - es(t, 9.05, 9.3));
      SH.forEach((q) => q.p.set({ x: q.x, y: lerp(900, 648, rise), s: 0.64, flip: q.d > 0, armF: 20 + es(t, 8.3, 8.45) * 70, armB: 10 + bump(t, 8.35, 8.9) * 60, o: rise > 0.01 ? 1 : 0 }));
      says.forEach((q) => {
        const f = es(t, 8.3 + q.i * 0.05, 8.6 + q.i * 0.05), drop = es(t, 9.02, 9.28, ease.in);
        const from = q.f.x < JX ? 440 : 1160;
        pose(q.el, { x: lerp(from, q.f.hx + (q.f.x < JX ? -20 : 20), f), y: lerp(520, q.f.hy - 30, f) + drop * 260, r: drop * 40 * (q.i % 2 ? 1 : -1), s: 0.6 + f * 0.4, o: f > 0.01 ? 1 - drop : 0 });
      });

      /* v12a — the crown of light: your reward is great in heaven */
      const ck = es(t, 9.25, 9.55, ease.out) * (1 - es(t, 10.0, 10.25));
      pose(crown, { x: 800, y: lerp(-300, 330, ck) - es(t, 10.0, 10.25) * 300, s: 1 + Math.sin(T * 1.4) * 0.03, o: ck > 0.01 ? 1 : 0 });

      /* v12b — the prophets before you */
      const fk = es(t, 10.08, 10.4, ease.out);
      pose(frieze, { x: 800, y: lerp(-500, 410, fk) + Math.sin(T * 0.8) * 2, o: fk > 0.01 ? 1 : 0 });
      hands.forEach((h, i) => {
        const hk = es(t, 10.4 + i * 0.05, 10.58 + i * 0.05);
        const x = 800 - 165 + i * 110;
        pose(h, { x: x - 58 - (1 - hk) * 30, y: 410 + 30, r: -18, s: 0.8, o: hk });
      });

      /* Jesus: points up to each medallion, then speaks; opens His arms at "rejoice" */
      let up = 0;
      for (let b = 0; b < 8; b++) up = Math.max(up, bump(t, b + 0.02, b + 0.7));
      const joy = es(t, 9.1, 9.4) * (1 - es(t, 10.0, 10.3));
      const care = bump(t, 8.2, 9.1);
      teach(jesus, T, { armB: up * 100 + joy * 110 + es(t, 10.1, 10.4) * 60, armF: up * 20 + joy * 40 + care * 40, head: -up * 8 - joy * 6 - es(t, 10.1, 10.4) * 8, blink: blinkAt(T, 1) });
      voice(JX - 2, JY - 160, 0.55 + joy * 0.4, T, { s0: 0.7 });

      /* the four: look up; cower when reviled; rejoice */
      four.forEach((f) => {
        const cower = es(t, 8.4, 8.6) * (1 - es(t, 9.05, 9.3));
        const cheer = es(t, 9.3 + f.i * 0.04, 9.5 + f.i * 0.04) * (1 - es(t, 10.05, 10.3));
        f.p.set({
          x: f.x, y: f.y - cheer * 6 * Math.abs(Math.sin(T * 3 + f.i)), s: f.s, flip: f.flip,
          lean: f.dir * (2 - cower * 10), head: -8 + cower * 18 - cheer * 8 - es(t, 10.2, 10.5) * 6,
          armF: 20 + cower * 60 + cheer * 60, armB: cheer * 140 + cower * 30, blink: blinkAt(T, f.seed),
        });
      });

      S.cam.y = -20 - es(t, 7.9, 8.4) * 10 + es(t, 9.9, 10.3) * 10;
      S.cam.z = 1.02 + es(t, 7.9, 8.5) * -0.02;
    };
  },
};
