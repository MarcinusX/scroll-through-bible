// Mk 7,1–4 — by the lake at Gennesaret the disciples eat bread; Pharisees and scribes come down
// from Jerusalem and notice their unwashed hands. The tradition of the elders is acted out beside
// the courtyard: hands washed over a copper basin, a man back from the market washing, and at last
// a whole washing-line of cups, pitchers, copper pots and even a couch drips from the flies.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush, grass, rock } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  kf, hand, headAt, townsfolk, thought, GLYPH, loaf, cup, jug, pharisee, LOOK, stoneJar, basin, copperPot, couch, stream, drop,
  marketBasket, marketStall, farCity, COPPER, nameTag, plate, bigHand, hang2, scrollOpen,
} from './lib.js';

const PI = Math.PI;
const PAR = 0.6;
const FLOOR = 652;          // where standing people's feet are
const MATY = 700;           // the disciples sit here
const BASIN = { x: 566, y: 646 };
const camFor = (x) => (x - 800) / PAR;

export default {
  id: 'm7-washing',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3 },
    { v: 4, text: 'I [gdy wrócą] z rynku, nie jedzą, dopóki się nie obmyją.' },
    { v: 4, cont: true, text: 'Jest jeszcze wiele innych [zwyczajów], które przejęli i których przestrzegają, jak obmywanie kubków, dzbanków, naczyń miedzianych.' },
  ],
  cam: { x: [camFor(540), 160], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const SKY = ['#cfe2dd', '#f0e7cf', '#f8ecd6'];
    const sk = sky(S, SKY);

    /* ---------- the flies: sun, clouds, birds ---------- */
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const SUNX = P ? 520 : 440, CL2X = P ? 1050 : 1130;   // phone: the sun and the far cloud inside the frame
    const sunEl = hanging(hangL, sun(c, 46), { x: SUNX, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 760, y: 140, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: CL2X, y: 200, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 40, scale: 0.5 });

    /* ---------- far hills with Jerusalem on the right, the road coming down ---------- */
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 360, amps: [30, 10, 3], lens: [1300, 420, 140], color: C.hillFar });
    far.add(h1.markup);
    const CX = P ? 1000 : 1150;   // phone: Jerusalem and its name tag inside the frame
    const CITY = { x: CX, y: h1.fn(CX) + 8 };
    far.add(`<g transform="translate(${CITY.x} ${CITY.y})">${farCity(c, 0.62)}</g>`);
    // the road winding down from the city gate
    const RD = CX - 1150;
    const road = [[CITY.x - 10, CITY.y + 2], [1080 + RD, 392], [1170 + RD, 408], [1040 + RD, 424], [990 + RD, 440]];
    far.add(sheet().p(c.ribbon(road, (t) => 4 + t * 7), mix(C.sand, C.hillFar, 0.3)).out());
    const walkers = [0, 1, 2, 3].map((i) => ({ i, p: S.puppet(far.add(person(c, { ...townsfolk(c), robe: [C.linen2, C.stone, C.plumRobe, C.tealRobe][i], hairStyle: 'wrap', veil: C.linen }))) }));
    const jTag = hanging(far, nameTag(c, tr('Jerozolima', 'Jerusalem'), { size: 16 }), { x: CITY.x, y: 250, len: 600 });

    /* ---------- the lake of Gennesaret and the near hills ---------- */
    const lakeL = S.layer({ par: 0.14, sh: 1 });
    lakeL.add(waterBand(c, { y: 432, color: C.lake, foamN: 16, bottom: 900 }).markup);
    const hills = S.layer({ par: 0.24, sh: 3 });
    const h2 = hillsWith(c, { y: 486, amps: [10, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup);
    hills.add(palm(c, 1290, h2.fn(1290) + 16, 150) + palm(c, 170, h2.fn(170) + 16, 140) + olive(c, 1440, h2.fn(1440) + 14, 0.7));

    /* ---------- the courtyard: back wall, a fig tree, the floor ---------- */
    const yard = S.layer({ par: 0.45, sh: 3 });
    const ws = sheet();
    const gate = [[1250, 604], [1250, 520], ...c.arc(1290, 520, 40, 34, PI, 2 * PI, 10), [1330, 604]];
    ws.p(c.cut([[-900, 520], [2500, 520], [2500, 606], [-900, 606]], 1, 20) + c.hole(gate.map(([x, y]) => [x, Math.max(y, 522)]), 0.4, 6), mix(C.plaster, C.sand, 0.25));
    ws.p(c.cut([[-900, 512], [2500, 512], [2500, 524], [-900, 524]], 0.6, 12), C.stone2);
    let blotch = '';
    for (let i = 0; i < 14; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(540, 590), c.rr(18, 40), c.rr(6, 12), 9, 0.2), 0.6, 5);
    ws.x(blotch, C.plaster2, 'opacity=".6"');
    yard.add(olive(c, 960, 520, 0.95, { leaf: C.moss, leaf2: C.leaf }));
    yard.add(ws.out());
    yard.add(bush(c, 1100, 606, 90, C.sage, C.moss) + bush(c, 330, 606, 80, C.sage, C.moss));

    const floorL = S.layer({ par: PAR, sh: 3 });
    const fl = sheet();
    fl.p(c.cut([[-900, 600], [2500, 600], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand, C.sand2, 0.4));
    let flags = '';
    for (let r = 0; r < 6; r++) { const y = 616 + r * r * 8 + r * 16; flags += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.4); for (let x = -900 + (r % 2) * 40; x < 2500; x += c.rr(70, 110) + r * 14) flags += c.ribbon([[x, y], [x + c.rr(-3, 3), y + 16 + r * 12]], 1.2); }
    fl.x(flags, shade(C.sand2, -0.15), 'opacity=".5"');
    floorL.add(fl.out());
    // the market stall on the left, its seller
    floorL.add(`<g transform="translate(250 ${FLOOR - 16})">${marketStall(c, 190, 170)}</g>`);
    const seller = S.puppet(floorL.add(person(c, townsfolk(c, { hairStyle: 'veil', veil: C.blushVeil, robe: C.ochreRobe, beard: 'none' }))));
    // the washing corner: stone jars on a ledge, the copper basin, the servant with his jug
    floorL.add(sheet().p(c.cut(c.rect(378, 604, 130, 20), 0.5, 8), C.stone2).out());
    floorL.add(`<g transform="translate(404 606)">${stoneJar(c, 88)}</g><g transform="translate(470 610)">${stoneJar(c, 72, C.stone2)}</g>`);
    floorL.add(`<g transform="translate(${BASIN.x} ${BASIN.y})">${basin(c, 84)}</g>`);

    /* ---------- people standing: servant, Pharisees & scribes, the man from the market ---------- */
    const standL = S.layer({ par: PAR, sh: 5 });
    const servant = S.puppet(standL.add(person(c, LOOK.servant)));
    const jugEl = standL.add(`<g>${jug(c, C.pot)}</g>`);
    const water = standL.add(`<g>${stream(c, 100, 6)}</g>`);
    const drops = Array.from({ length: 6 }, (_, i) => ({ i, el: standL.add(drop(c, 2.8, C.lake)), dx: c.rr(-22, 22), ph: c.rr(0, 1) }));
    const PH = [
      { i: 0, x: 1010, from: 1560 }, { i: 1, x: 1062, from: 1620 }, { i: 2, x: 1114, from: 1680 },
      { i: 3, x: 1150, from: 1740 }, { i: 4, x: 1196, from: 1800 },
    ].map((m) => ({ ...m, seed: c.rr(0, 9), p: S.puppet(standL.add(pharisee(c, m.i))) }));
    // phone: the Pharisees stand closer together, the last one clear of the thread
    if (P) PH.forEach((m) => { m.x = [966, 998, 1030, 1060, 1090][m.i]; });
    const market = { p: S.puppet(standL.add(pharisee(c, 2, { robe: C.wheatRobe }))), seed: c.rr(0, 9) };
    const basketEl = standL.add(`<g>${marketBasket(c, 46)}</g>`);

    /* ---------- the disciples at their bread, Jesus in the middle ---------- */
    const eatL = S.layer({ par: PAR, sh: 5 });
    const D = [
      { o: CAST.peter, x: 668, flip: false }, { o: CAST.andrew, x: 732, flip: false },
      { o: CAST.james, x: 924, flip: true }, { o: CAST.john, x: 984, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(eatL.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const jesus = S.puppet(eatL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    // the cloth spread on the ground with bread
    const cl = sheet();
    const clPts = [[680, MATY + 4], [980, MATY + 2], [1000, MATY + 30], [660, MATY + 32]];
    cl.p(c.cut(clPts, 0.6, 8), C.cream);
    let pat = '';
    for (let x = 690; x < 980; x += 30) pat += c.cut(c.star(x, MATY + 22, 4, 1.8, 4, 0), 0.2, 3);
    cl.x(pat, C.terracotta, 'opacity=".5"');
    eatL.add(cl.out());
    eatL.add(`<g transform="translate(772 ${MATY + 14})">${loaf(c, 16)}</g><g transform="translate(870 ${MATY + 16})">${loaf(c, 14)}</g><g transform="translate(826 ${MATY + 18})">${cup(c)}</g>`);
    // the bread in the disciples' hands
    const bits = D.map(() => eatL.add(`<g>${loaf(c, 8)}</g>`));

    /* ---------- the flies: a close-up plate of a hand, the tag of the tradition, the washing line ---------- */
    const fx = S.layer({ par: PAR, sh: 6 });
    const handPlate = hanging(fx, `<g>${plate(c, `<g data-g="dirty"><g transform="translate(-8 4) scale(.9)">${bigHand(c, { dirty: true })}</g><g transform="translate(40 -10)">${loaf(c, 14)}</g></g><g data-g="clean" opacity="0"><g transform="translate(-8 16) scale(.9)">${bigHand(c)}</g><g transform="translate(-4 -60)">${stream(c, 60, 12)}</g></g>`, { r: 62 })}</g>`, { x: 1010, y: 250, len: 700 });
    const dirtyG = handPlate.querySelector('[data-g="dirty"]'), cleanG = handPlate.querySelector('[data-g="clean"]');
    const frowns = [1, 2].map(() => fx.add(`<g>${thought(c, GLYPH.frown(c))}</g>`));
    const tradTag = hanging(fx, `<g transform="translate(0 0)">${nameTag(c, tr(['tradycja', 'starszych'], ['the tradition', 'of the elders']), { size: 17 })}</g><g transform="translate(0 -40) scale(.55)">${scrollOpen(c, 80, 50)}</g>`, { x: 520, y: 300, len: 700 });
    // the washing line: a rope on two strings, vessels pegged along it, all dripping
    const LINE = { x0: 340, x1: 1200, y: 240 };
    const LSX = P ? 0.78 : 1, LCX = P ? 830 : 800;   // phone: the line and its vessels drawn in to fit the width
    const lineEl = fx.add(`<g>${hang2(`<path d="${c.ribbon(c.qbez([LINE.x0 - 800, 0], [0, 26], [LINE.x1 - 800, 0], 20), 2.4)}" fill="${C.rope}"/>`, 400, 400)}</g>`);
    const V = [
      { m: cup(c, C.pot), x: 400, s: 1.6, flipY: true }, { m: jug(c, C.pot), x: 460, s: 0.78, flipY: true },
      { m: copperPot(c, 28), x: 548, s: 1, dy: 30 }, { m: cup(c, shade(C.pot, 0.1)), x: 628, s: 1.6, flipY: true },
      { m: jug(c, COPPER), x: 680, s: 0.66, flipY: true },
      { m: couch(c, 130), x: 800, s: 1, dy: 32, big: true }, { m: jug(c, shade(C.clay, 0.1)), x: 918, s: 0.74, flipY: true },
      { m: copperPot(c, 24), x: 996, s: 1, dy: 26 }, { m: cup(c, C.clay), x: 1060, s: 1.6, flipY: true }, { m: jug(c, COPPER), x: 1116, s: 0.6, flipY: true },
      { m: cup(c, C.pot), x: 1166, s: 1.4, flipY: true },
    ].map((v, i) => {
      const peg = sheet().p(c.cut(c.rect(-3, -8, 6, 14), 0.2, 2), C.wood3).out();
      const body = v.flipY ? `<g transform="translate(0 4) scale(${v.s} ${-v.s})">${v.m}</g>` : `<g transform="translate(0 ${v.dy}) scale(${v.s})">${v.m}</g>`;
      const el = fx.add(`<g>${body}${peg}</g>`);
      const dr = [0, 1].map(() => fx.add(drop(c, 3, C.lake2)));
      const bottom = v.flipY ? (v.m === undefined ? 0 : 4 + (v.s > 1 ? 20 * v.s : 76 * v.s)) : v.dy + (v.big ? 26 : 16);
      return { ...v, i, el, dr, bottom, sag: Math.sin(((v.x - LINE.x0) / (LINE.x1 - LINE.x0)) * PI) * 13, ph: c.rr(0, 1), seed: c.rr(0, 6) };
    });

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1330, 860, 200, C.sage, C.moss) + bush(c, 170, 870, 220, C.moss, C.sage) + rock(c, 1200, 880, 150, 50, C.rock2));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      sk.blend(SKY, ['#d6e6df', '#f4ead2', '#f9efdc'], seg(t, 1, 6));
      swing(sunEl, SUNX, 150 - es(t, 0, 3) * 24, T, 1.1, 0.7);
      swing(cl1, 760 + Math.sin(T * 0.1) * 26, 140, T, 1.4, 0.6, 1);
      swing(cl2, CL2X + Math.sin(T * 0.13 + 2) * 26, 200, T, 1.4, 0.8, 2);
      birds(T, 1);

      /* v1 — tiny figures come down the road from Jerusalem, then the full-size men walk in */
      const tagIn = es(t, 0.9, 1.3, ease.back) * (1 - es(t, 2.1, 2.5));
      swing(jTag, CITY.x, 250 - (1 - tagIn) * 1150, T, 1.5, 0.9, 3);
      walkers.forEach((w) => {
        const u = seg(t, 0.9 + w.i * 0.06, 1.55 + w.i * 0.06);
        const [x, y] = kf(u, road.map((p, i) => [i / (road.length - 1), p]), (q) => q);
        w.p.set({ x: x - 3 + w.i * 6, y, s: 0.1, flip: x < kf(u + 0.02, road.map((p, i) => [i / (road.length - 1), p]), (q) => q)[0], o: u > 0 && u < 1 ? 1 : 0, walk: u * 90 });
      });

      const point = es(t, 2.05, 2.35) * (1 - es(t, 3.0, 3.2));
      const leave0 = t >= 3.0;
      PH.forEach((m) => {
        const pr = seg(t, 1.3 + m.i * 0.06, 1.85 + m.i * 0.06);
        let x = lerp(m.from, m.x, ease.out(pr)), y = FLOOR, flip = true, walk = pr > 0 && pr < 1 ? x * 0.05 : undefined;
        let armF = 0, armB = 0, head = 0;
        if (m.i === 0) {
          armF = point * 95;
          if (leave0) {
            // walk over to the basin and wash (v3), then step back and watch (v4)
            const keys = [[3.0, m.x], [3.32, 632], [4.0, 632], [4.2, 700]];
            x = kf(t, keys);
            walk = (t > 3.0 && t < 3.32) || (t > 4.0 && t < 4.2) ? x * 0.05 : undefined;
            flip = true;
            const wash = seg(t, 3.34, 3.98);
            if (wash > 0 && wash < 1 || (t >= 3.34 && t < 4.0)) { armF = 68 + Math.sin(t * 60) * 7; armB = 58 + Math.sin(t * 60 + 1.4) * 7; head = 10; }
            if (t >= 4.2) { flip = false; armF = 14; head = 4; }
            y = t > 4.0 ? lerp(FLOOR, FLOOR - 26, es(t, 4.0, 4.2)) : FLOOR;
          }
        } else {
          armF = (m.i === 1 ? point * 40 : 0) + (m.i === 3 ? 60 : 0);
          head = -point * 4;
        }
        m.p.set({ x, y, s: 0.84, flip, walk, armF, armB, head, blink: blinkAt(T, m.seed) });
      });

      /* v2 — the disciples eat; the plate shows a dusty hand */
      D.forEach((d, i) => {
        const bite = t > 1.9 && t < 3.3 ? Math.max(0, Math.sin((t - 1.9 - i * 0.12) * 9)) : 0;
        const armF = 40 + bite * 70 + es(t, 5.0, 5.3) * 10;
        const eating = t > 1.8;
        d.p.set({ x: d.x, y: MATY, s: 0.84, flip: d.flip, armF, armB: 10, head: 4 - bite * 6 + (point * (d.flip ? -6 : 0)), blink: blinkAt(T, d.seed) });
        const [hx, hy] = hand(d.x, MATY, 0.84, d.flip, armF, 0, 62);
        pose(bits[i], { x: hx + (d.flip ? -4 : 4), y: hy + 4, o: eating ? 1 : 0 });
      });
      jesus.set({ x: 826, y: MATY + 2, s: 0.9, flip: t > 4.5, armF: 26 + bump(t, 0.9, 1.9) * 30 + es(t, 5.1, 5.5) * 20, armB: 10, head: t < 3 ? 4 : -4, blink: blinkAt(T, 2) });
      const plateIn = es(t, 2.1, 2.45, ease.back) * (1 - es(t, 4.2, 4.6));
      const plx = lerp(1010, 640, es(t, 2.95, 3.4));
      swing(handPlate, plx, 250 - (1 - plateIn) * 1150, T, 1.2, 0.8, 1);
      const clean = es(t, 3.3, 3.5);
      fade(dirtyG, 1 - clean); fade(cleanG, clean);
      frowns.forEach((f, i) => {
        const m = PH[i + 1];
        const k = es(t, 2.3 + i * 0.1, 2.5 + i * 0.1, ease.back) * (1 - es(t, 3.0, 3.2));
        const [hx, hy] = headAt(m.x, FLOOR, 0.84, true);
        pose(f, { x: hx - 10, y: hy - 28, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      /* v3 — the servant pours; hands washed over the basin; the tradition of the elders */
      const tagK = es(t, 3.05, 3.4, ease.back) * (1 - es(t, 5.0, 5.3));
      swing(tradTag, 470, 300 - (1 - tagK) * 1150, T, 1.3, 0.8, 2);
      const pour = es(t, 3.3, 3.42) * (1 - es(t, 3.95, 4.05)) + es(t, 4.55, 4.65) * (1 - es(t, 5.1, 5.25));
      const SV = { x: 516, y: FLOOR - 26 };
      const svArm = 46 + pour * 38;
      servant.set({ x: SV.x, y: SV.y, s: 0.78, armF: svArm, armB: 20 + pour * 50, head: 10 * pour, blink: blinkAt(T, 4) });
      const [jx, jy] = hand(SV.x, SV.y, 0.78, false, svArm);
      const tilt = pour * 58;
      pose(jugEl, { x: jx + 2, y: jy + 10, s: 0.6, r: tilt, ox: 0, oy: -40 });
      const r = (tilt * PI) / 180;
      const sx = jx + 2 + (30 * Math.cos(r) + 30 * Math.sin(r)) * 0.6, sy = jy + 10 + (30 * Math.sin(r) - 30 * Math.cos(r)) * 0.6;
      pose(water, { x: sx, y: sy, sy: Math.max(0.05, (BASIN.y - 40 - sy) / 100), o: pour > 0.5 ? 1 : 0 });
      drops.forEach((d) => {
        const k = ((T * 1.4 + d.ph) % 1);
        pose(d.el, { x: sx + d.dx * k, y: BASIN.y - 44 - Math.sin(k * PI) * 16, s: 1 - k * 0.5, o: pour > 0.5 ? 1 - k : 0 });
      });

      /* v4a — a Pharisee comes back from the market, puts down his basket and washes too */
      const mk = [[3.9, 232], [4.02, 232], [4.26, 452], [4.32, 452], [4.5, 632]];
      const mx = kf(t, mk);
      const mWalk = (t > 4.02 && t < 4.26) || (t > 4.32 && t < 4.5);
      const down = t > 4.29;
      const washing2 = t > 4.55 && t < 5.15;
      market.p.set({
        x: mx, y: FLOOR + 6, s: 0.84, flip: t > 4.5,
        walk: mWalk ? mx * 0.05 : undefined,
        armB: down ? (washing2 ? 60 + Math.sin(t * 60 + 1) * 7 : 10) : 20, armF: washing2 ? 70 + Math.sin(t * 60) * 7 : down ? 10 : 30,
        head: washing2 ? 10 : 0, blink: blinkAt(T, market.seed),
      });
      const [bx, by] = hand(mx, FLOOR + 6, 0.84, false, 30);
      pose(basketEl, down ? { x: 452, y: FLOOR + 14 } : { x: bx, y: by + 36 });
      seller.set({ x: 306, y: FLOOR - 4, s: 0.72, flip: true, armF: bump(t, 3.9, 4.25) * 80 + (t < 3.9 ? 30 : 0), armB: 8, blink: blinkAt(T, 7) });

      /* v4b — the washing line comes down, everything on it dripping */
      const lineK = es(t, 5.0, 5.45, ease.out);
      const ly = LINE.y - (1 - lineK) * 1150;
      pose(lineEl, { x: LCX, y: ly, sx: LSX, o: lineK > 0.01 ? 1 : 0 });
      V.forEach((v) => {
        const k = es(t, 5.12 + v.i * 0.04, 5.4 + v.i * 0.04, ease.back);
        const yy = ly + v.sag + 8;
        const sw = Math.sin(T * 1.6 + v.seed) * 4 * k;
        const vx = LCX + (v.x - 800) * LSX;
        pose(v.el, { x: vx, y: yy - (1 - k) * 60, r: sw, o: lineK > 0.01 ? Math.min(1, k * 3) : 0 });
        v.dr.forEach((d, j) => {
          const q = ((T * 0.9 + v.ph + j * 0.5) % 1);
          const bottom = yy + v.bottom;
          pose(d, { x: vx + (j ? 6 : -5), y: bottom + q * q * 90, s: 1 - q * 0.4, o: k > 0.9 ? (1 - q) * 0.9 : 0 });
        });
      });

      /* camera: the courtyard → over to the washing corner → up to the line */
      // phone: look further right while the Pharisees arrive, less far left at the basin (Jesus stays in),
      // and all the way back for the washing line
      const toBasin = es(t, 2.9, 3.35) * (1 - es(t, 5.0, 5.5) * (P ? 1 : 0.6));
      S.cam.x = es(t, 0.7, 1.4) * (P ? 150 : 30) * (1 - es(t, 2.9, 3.35)) + toBasin * camFor(P ? 615 : 560) + (P ? es(t, 5.0, 5.5) * 60 : 0);
      S.cam.y = es(t, 0.7, 1.6) * 20 + es(t, 2.9, 3.4) * 10 - es(t, 5.0, 5.5) * 70;
      S.cam.z = 1 + es(t, 0.7, 1.6) * 0.04 + es(t, 2.9, 3.4) * 0.05 - es(t, 5.0, 5.5) * 0.08;
    };
  },
};
