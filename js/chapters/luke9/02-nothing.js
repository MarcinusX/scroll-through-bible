// Łk 9,3–6 — the same meadow, closer. Peter and Andrew, James and John stand round Jesus loaded for the road: a staff,
// a travelling bag, a loaf, a purse, a spare tunic over the arm. "Take nothing for the journey": five tags come down one
// after another, each thing flies up off them onto its tag and a red cross is laid over it — Luke's list, no staff
// either. "Whatever house you enter, stay there": a painted flat comes down, a house with its door open and the host
// waiting; the two go in, the day goes down, the window glows under the moon — and in the morning they come out again.
// "Where they do not receive you, shake off the dust": a second flat, a town gate that swings shut on them, and the two
// outside knock the dust off their feet. Then they go: the four turn and walk away up the roads, and in every village
// people come out to meet them, the lights come on, a crutch is thrown up into the air.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { galSet, roadAt, VIL9, TW9, staff, bag, purse, tunic, loaf, crutch, disc, crossX, labelTag, openHouse, flat, flatSky, flatHills, fig, flyTo, dust, halo, sparkle, heart, folk, stillGroup, hand, kf, tr, PI } from './lib.js';
import { moon } from '../../assets/nature.js';

const JX = 800, JY = 716;
const W = 440, H = 250, FX = 800, FY = 292;
const DISCS = [[548, 206], [674, 238], [800, 206], [926, 238], [1052, 206]];

export default {
  id: 'lk9-nothing',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5 },
    { v: 6 },
  ],
  cam: { x: [-20, 20], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const G = galSet(S);
    const c = S.c;
    const { ROAD } = G;

    /* the villagers who come out, and the signs over the villages (v6) */
    const vilL = S.layer({ par: 0.18, sh: 3 });
    const VL = VIL9.map(([x, y], v) => {
      const mem = Array.from({ length: 4 }, (_, k) => ({ x: (k - 1.5) * 26 + c.rr(-4, 4), y: c.rr(-3, 3), s: 1, flip: k > 1, o: folk(c), armF: c.rr(20, 70), armB: c.rr(0, 40), head: -4 }));
      return { v, x, y, folk: vilL.add(`<g opacity="0"><g transform="scale(.3)">${stillGroup(c, mem)}</g></g>`), glow: vilL.add(`<g opacity="0">${halo(60, 0.9)}</g>`), star: vilL.add(`<g opacity="0">${v % 2 ? heart(c, 8) : sparkle(c, 11)}</g>`), cr: vilL.add(`<g opacity="0"><g transform="scale(.3)">${crutch(c)}</g></g>`) };
    });

    /* the four, loaded, and Jesus */
    const act = S.layer({ par: 0.5, sh: 5 });
    const FOUR = [
      { k: 'andrew', x: 498, y: 736, road: 0 }, { k: 'peter', x: 612, y: 724, road: 1 },
      { k: 'james', x: 988, y: 724, road: 2 }, { k: 'john', x: 1102, y: 736, road: 3 },
    ].map((d, i) => ({ ...d, i, flip: d.x > JX, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    // the things they carry (each its own cut-out, so it can fly up to its tag)
    /* the five tags */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const LAB = [tr('laska', 'staff'), tr('torba', 'wallet'), tr('chleb', 'bread'), tr('pieniądze', 'money'), tr('dwie suknie', 'two coats')];
    const TAGS = DISCS.map(([x, y], i) => ({ i, x, y, el: hanging(flies, disc(c, '', { r: 40 }) + `<g transform="translate(0 62)">${labelTag(LAB[i], 16)}</g>`, { x: 0, y: -1500, len: 800 }), X: flies.add(`<g opacity="0">${crossX(c, 26)}</g>`) }));

    const kitL = S.layer({ par: 0.4, sh: 5 });
    const kit = (m) => kitL.add(m);
    const ITEMS = [
      { who: 1, el: kit(`<g>${staff(c, 190, 0)}</g>`), dx: 12, dy: -100, r: 4, s: 1 },
      { who: 0, el: kit(`<g>${bag(c)}</g>`), dx: -30, dy: -110, r: -10, s: 1 },
      { who: 0, el: kit(`<g>${loaf(c, 18)}</g>`), dx: 40, dy: -96, r: 0, s: 1 },
      { who: 2, el: kit(`<g>${purse(c)}</g>`), dx: 42, dy: -90, r: 0, s: 1 },
      { who: 3, el: kit(`<g><g transform="translate(-6 0)">${tunic(c, C.sageRobe)}</g><g transform="translate(8 6)">${tunic(c, C.dustyBlue)}</g></g>`), dx: 40, dy: -104, r: 10, s: 0.9 },
    ];

    /* the flats: the house that receives them, the town that does not */
    const flatL = S.layer({ par: 0.3, sh: 6 });
    const house = openHouse(c, { w: 150, h: 118, dw: 38, dh: 70 });
    const HX = -40, HYb = 88;   // house bottom-left, flat coords
    const f1 = flatL.add(flat(S, flatSky(S, W, H, [C.skyBlue, C.cream]) + flatHills(c, W, 40, mix(C.hillMid, C.sand, 0.3)) + sheet().p(c.cut(c.rect(-W / 2 - 4, 70, W + 8, 70), 0.6, 10), mix(C.hillNear, C.sand, 0.4)).out()
      + `<g transform="translate(${HX} ${HYb})">${house.inside}${house.wall}</g>` + fig(c, { robe: C.ochreRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3 }, HX + 20, HYb, 0.42, true), { w: W, h: H }));
    const f2 = flatL.add(flat(S, flatSky(S, W, H, [mix(C.skyBlue, C.stone, 0.3), C.cream]) + flatHills(c, W, 30, mix(C.hillMid, C.stone, 0.3)) + sheet().p(c.cut(c.rect(-W / 2 - 4, 70, W + 8, 70), 0.6, 10), mix(C.sand, C.stone2, 0.3)).out()
      + gateWall(c, fig(c, folk(c, true), 22, 72, 0.34, false) + fig(c, folk(c, false), 58, 72, 0.32, false)), { w: W, h: H }));
    // pieces in front of the flats (they follow the flat as it moves)
    const ov = S.layer({ par: 0.3, sh: 5 });
    const nightTint = ov.add(`<g opacity="0"><rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" fill="${C.night}" opacity=".62"/></g>`);
    const houseGlow = ov.add(`<g opacity="0"><g transform="translate(${HX} ${HYb})">${house.glow}</g></g>`);
    const moonEl = ov.add(`<g opacity="0">${halo(40, 0.5)}${moon(c, 16)}</g>`);
    const pairIn = [0, 1].map((j) => ov.add(`<g>${person(c, TW9[j ? 'andrew' : 'peter'])}</g>`));
    const leafL = ov.add(`<g>${sheet().p(c.cut(c.rect(0, -70, 44, 70), 0.3, 4), C.wood2).out()}</g>`);
    const leafR = ov.add(`<g>${sheet().p(c.cut(c.rect(-44, -70, 44, 70), 0.3, 4), C.wood2).out()}</g>`);
    const pairOut = [0, 1].map((j) => S.puppet(ov.add(person(c, TW9[j ? 'john' : 'james']))));
    const puffs = [0, 1, 2].map(() => ov.add(`<g opacity="0">${dust(c, 20, C.sand2)}</g>`));

    const fp = (k, i) => [FX, lerp(-1500, FY, k)];
    return (t, time) => {
      const T = time;
      G.update(T);

      /* v3 — take nothing */
      const leave = seg(t, 3.0, 3.6);
      jesus.set({ x: JX, y: JY, s: 1.02, flip: t > 3.2 ? Math.sin(T * 0.35) > 0.2 : false, armF: 30 + bump(t, 0.05, 0.9) * 50 + bump(t, 1.05, 1.95) * 40 + bump(t, 2.05, 2.95) * 40 + es(t, 3.0, 3.3) * 40, armB: 10 + bump(t, 0.05, 0.9) * 40 + es(t, 3.0, 3.3) * 50, head: -2, blink: blinkAt(T, 1) });
      FOUR.forEach((d) => {
        const lighten = es(t, 0.1, 0.8);
        let x = d.x, y = d.y, s = 0.96, flip = d.flip, walking = false;
        if (leave > 0) {
          const [rx, ry, rs] = roadAt(ROAD, d.road, leave * 0.7, 0.96);
          const k = es(leave, 0, 0.25);
          x = lerp(d.x, rx, k); y = lerp(d.y, ry + 16 * rs, k); s = lerp(0.96, rs, k);
          walking = leave < 1; flip = d.road < 2;
        }
        d.x_ = x; d.y_ = y; d.s_ = s;
        d.p.set({ x, y, s, flip, walk: walking ? x * 0.07 + d.i : undefined, armF: 40 - lighten * 20 + bump(t, 0.1, 0.8) * 20, armB: 30 - lighten * 20, head: -4 + bump(t, 1.1, 2.9) * -6, blink: blinkAt(T, d.seed) });
      });
      ITEMS.forEach((it, i) => {
        const d = FOUR[it.who];
        const k = es(t, 0.12 + i * 0.12, 0.3 + i * 0.12, ease.io);
        const [tx, ty] = DISCS[i];
        const sx = d.x + (d.flip ? -it.dx : it.dx), sy = d.y + it.dy;
        pose(it.el, { x: lerp(sx, tx, k), y: lerp(sy, ty, k) - Math.sin(k * PI) * 60, r: lerp(it.r, 0, k), s: it.s * (1 - k * 0.3), o: 1 - es(t, 0.95, 1.05) });
      });
      TAGS.forEach((tg) => {
        const k = es(t, 0.06 + tg.i * 0.12, 0.26 + tg.i * 0.12, ease.back) * (1 - es(t, 0.98, 1.2));
        pose(tg.el, { x: tg.x, y: lerp(-1500, tg.y, k), r: Math.sin(T * 0.8 + tg.i) * 2, oy: 0, o: k > 0.002 ? 1 : 0 });
        const xk = es(t, 0.3 + tg.i * 0.12, 0.38 + tg.i * 0.12, ease.back) * (1 - es(t, 0.95, 1.0));
        pose(tg.X, { x: tg.x, y: lerp(-1500, tg.y, k), s: xk, o: xk > 0.01 ? 1 : 0 });
      });

      /* v4 — the house that takes them in */
      const k1 = es(t, 1.02, 1.3, ease.out) * (1 - es(t, 1.98, 2.2, ease.in));
      flyTo(f1, k1, FX, FY, T, 0);
      const [ox, oy] = [FX, lerp(-1500, FY, k1)];
      const night = es(t, 1.42, 1.56) * (1 - es(t, 1.8, 1.92));
      pose(nightTint, { x: ox, y: oy, o: night });
      pose(houseGlow, { x: ox, y: oy, o: es(t, 1.5, 1.6) * (1 - es(t, 1.82, 1.92)) });
      pose(moonEl, { x: ox + 150, y: oy - 70 + (1 - night) * 20, o: night });
      const doorX = ox + HX + 150 * 0.2 + 19, doorY = oy + HYb;
      pairIn.forEach((el, j) => {
        const wIn = seg(t, 1.12 + j * 0.04, 1.42 + j * 0.04);
        const wOut = seg(t, 1.84 + j * 0.04, 2.1);
        const inside = t > 1.42 + j * 0.04 && t < 1.84 + j * 0.04;
        const x = wOut > 0 ? lerp(doorX, ox + 190, wOut) : lerp(ox - 200, doorX, wIn);
        pose(el, { x, y: doorY - 2, s: 0.4, sx: wOut > 0 ? 1 : 1, o: k1 > 0.9 && !inside && wIn > 0 ? (wIn > 0.9 && wOut === 0 ? (1 - seg(wIn, 0.9, 1)) : 1) * (wOut > 0.95 ? 0 : 1) : 0 });
      });

      /* v5 — the town that does not: the gate shuts, the dust is shaken off */
      const k2 = es(t, 2.02, 2.3, ease.out) * (1 - es(t, 2.98, 3.2, ease.in));
      flyTo(f2, k2, FX, FY, T, 1);
      const [gx, gy] = [FX, lerp(-1500, FY, k2)];
      const shut = es(t, 2.18, 2.4);
      pose(leafL, { x: gx + 40 - 44, y: gy + 72, sx: Math.max(0.05, shut), o: k2 > 0.01 ? 1 : 0 });
      pose(leafR, { x: gx + 40 + 44, y: gy + 72, sx: Math.max(0.05, shut), o: k2 > 0.01 ? 1 : 0 });
      const shake = bump(t, 2.45, 2.95);
      pairOut.forEach((p, j) => {
        const back = es(t, 2.2, 2.42);
        const px = gx - 60 - j * 50 - back * 20;
        p.set({ x: px, y: gy + 88, s: 0.42, flip: back > 0.5, armF: 30 + shake * 30, armB: 20 + shake * 40, lean: j ? 0 : -shake * 8, o: k2 > 0.01 ? 1 : 0, blink: 0 });
        const kick = Math.max(0, Math.sin(t * 40 + j)) * shake;
        pose(p.footF, { x: -kick * 6, y: -kick * 10 });
      });
      puffs.forEach((pf, i) => {
        const q = T ? (T * 1.3 + i / 3) % 1 : 0.5;
        pose(pf, { x: gx - 70 - (i % 2) * 50 - q * 24, y: gy + 82 - q * 30, s: 0.8 + q, o: shake * (0.4 + 0.6 * Math.sin(q * PI)) });
      });

      /* v6 — they go through the villages, preaching and healing everywhere */
      VL.forEach((v) => {
        const k = es(t, 3.45 + (v.v % 3) * 0.04, 3.62 + (v.v % 3) * 0.04);
        pose(v.folk, { x: v.x + (v.v < 2 ? 26 : -26), y: v.y + 26, o: k });
        pose(v.glow, { x: v.x, y: v.y - 6, s: 0.6 + k * 0.4, o: k * 0.8 });
        pose(v.star, { x: v.x - 10, y: v.y - 64 - k * 10, s: k, r: v.v % 2 ? 0 : T * 30, o: k });
        const cr = seg(t, 3.55 + v.v * 0.03, 3.95);
        pose(v.cr, { x: v.x + (v.v < 2 ? 40 : -40) + cr * 20, y: v.y + 10 - Math.sin(cr * PI) * 70, r: cr * 300, o: cr > 0 && cr < 1 ? 1 : 0 });
      });

      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.08], [1.1, 1.04], [3.0, 1.04], [3.5, 1.0]]);
      S.cam.y = kf(t, [[0, 30], [0.9, 30], [1.1, 20], [3.0, 20], [3.5, 0]]);
    };
  },
};

/** a town wall with an arched gate (flat coords; the gate at x 40, its foot at y 72) */
function gateWall(c, inside = '') {
  const s = sheet();
  const gx = 40, gy = 72;
  const gate = [[gx - 44, gy + 2], [gx - 44, gy - 50], ...c.arc(gx, gy - 50, 44, 34, Math.PI, 2 * Math.PI, 10), [gx + 44, gy + 2]];
  s.p(c.cut([[-230, gy + 4], [-230, -20], [-190, -20], [-190, -34], [-160, -34], [-160, -20], [240, -20], [240, gy + 4]], 0.6, 10) + c.hole(gate, 0.3, 6), mix(C.stone, C.sand, 0.3));
  let bl = '';
  for (let y = -10; y < gy; y += 18) for (let x = -226 + (Math.round(y / 18) % 2) * 20; x < 236; x += 40) { if (Math.abs(x - gx) < 60) continue; bl += c.cut(c.rect(x, y, 34, 13), 0.3, 6); }
  s.x(bl, shade(C.stone, -0.06), 'opacity=".5"');
  s.p(c.cut([[gx - 58, -24], [gx - 52, -80], [gx + 52, -80], [gx + 58, -24]], 0.4, 6), mix(C.stone2, C.sand, 0.2));
  return `<path d="${c.poly(gate)}" fill="${mix(C.soilDark, C.night, 0.2)}"/>` + inside + s.out();
}
