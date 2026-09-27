// Mk 4,33–34 — golden evening on the shore: many parables hang over the crowd like ornaments;
// at dusk the people go home and, by a small fire, Jesus explains everything to his disciples.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waterBand, palm, olive, reeds, rock, town, sun, moon, cloud, stars, grass } from '../../assets/nature.js';
import { boat, oilLamp, sprout, sickle, mustardTree, bushel, wheatStalk } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';

const PI = Math.PI;

/** a little campfire: logs, stones and three paper flames (data-part="f0..2") */
function campfire(c) {
  const s = sheet();
  let stones = '';
  for (let i = 0; i < 7; i++) { const a = PI * (0.05 + (i / 6) * 0.9); stones += c.cut(c.blob(Math.cos(a) * 44, 4 - Math.sin(a) * 8, 11, 7, 8, 0.2), 0.4, 3); }
  s.p(stones, C.rock2);
  s.p(c.ribbon([[-34, 0], [30, -14]], 9) + c.ribbon([[-30, -14], [34, 0]], 9), C.wood2);
  s.x(c.poly(c.circ(-34, 0, 4.5, 8)) + c.poly(c.circ(34, 0, 4.5, 8)), C.wood3);
  const flame = (w, h, col, k) => `<g data-part="${k}"><path d="${c.cut([[-w, 0], [-w * 0.8, -h * 0.4], [-w * 0.3, -h * 0.7], [0, -h], [w * 0.35, -h * 0.66], [w * 0.8, -h * 0.35], [w, 0]], 0.6, 4)}" fill="${col}"/></g>`;
  return `<g data-part="glow"><circle cx="0" cy="-20" r="190" fill="url(#warm-glow)"/></g>${s.out()}` +
    `<g data-part="fire" transform="translate(0 -8)">${flame(24, 62, C.sunDeep, 'f0')}${flame(17, 46, C.sun, 'f1')}${flame(9, 28, C.lampGlow, 'f2')}</g>`;
}

/** a warm glint behind a listener's head + a tiny star above it */
function insight(c) {
  const s = sheet();
  s.p(c.cut(c.star(0, -42, 13, 4, 4, 0), 0.2, 3), C.halo);
  s.x(c.poly(c.circ(0, -42, 3, 8)), C.star);
  return `<circle r="40" fill="url(#warm-glow)"/><circle cy="-42" r="22" fill="url(#warm-glow)"/>${s.out()}`;
}

export default {
  id: 'conclusion',
  beats: [
    { v: 33, text: 'W wielu takich przypowieściach głosił im naukę,' },
    { v: 33, cont: true, text: 'o ile mogli [ją] rozumieć.' },
    { v: 34, text: 'A bez przypowieści nie przemawiał do nich.' },
    { v: 34, cont: true, text: 'Osobno zaś objaśniał wszystko swoim uczniom.' },
  ],
  cam: { x: [-10, 10], y: [0, 70], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const GOLD = [mix(C.skyBlue, C.dawn, 0.4), mix(C.dawn, C.sun, 0.18), C.apricot];
    const DUSK = [C.duskViolet, C.dusk, C.apricot];
    const EVE = [mix(C.indigo, C.duskViolet, 0.45), C.duskViolet, mix(C.dusk, C.duskViolet, 0.3)];
    const sk = sky(S, GOLD);

    /* heavens on strings: the sun sets on the right, the moon rises on the left */
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const starsEl = hangL.add(`<g opacity="0">${stars(c, { x0: -500, x1: 2100, y0: -200, y1: 330, n: 60 })}</g>`);
    const sunEl = hanging(hangL, sun(c, 50), { x: 1130, y: 230, len: 700 });
    const moonEl = hanging(hangL, moon(c, 32), { x: 1260, y: 520, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190, C.cream, C.peach), { x: 560, y: 170, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 140, C.cream, C.peach), { x: 1000, y: 130, len: 600 });

    /* far shore */
    const far = S.layer({ par: 0.1, sh: 2 });
    const fs = band(c, { y: 380, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillMid, C.dusk, 0.2) });
    far.add(fs.markup);
    far.add(town(c, { x: 300, y: fs.fn(300) + 10, n: 6, spread: 260, sc: 0.45, lit: true }));

    /* the lake, a glittering sun-path and the boat that will soon cross it */
    const lakeL = S.layer({ par: 0.18, sh: 2 });
    lakeL.add(waterBand(c, { y: 400, color: mix(C.lake, C.dawn, 0.2), foamN: 26 }).markup);
    let glit = '';
    for (let i = 0; i < 16; i++) { const y = 408 + i * 5 + c.rr(-2, 2), w = 60 - i * 2.4 + c.rr(-8, 8); glit += c.ribbon([[1130 - w / 2 + c.rr(-10, 10), y], [1130 + w / 2 + c.rr(-10, 10), y]], 2.2); }
    const glitter = lakeL.add(`<g><path d="${glit}" fill="${C.lampGlow}" opacity=".75"/></g>`);
    const b = boat(c, { mast: true });
    const boatEl = lakeL.add(`<g>${b.back}${b.front}</g>`);

    /* the beach */
    const beach = S.layer({ par: 0.3, sh: 3 });
    const bfn = c.wave(478, [4, 2], [700, 170]);
    beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
    beach.add(palm(c, 170, 484, 230) + palm(c, 1470, 486, 200));
    beach.add(reeds(c, 1020, 480, 8, 50) + reeds(c, 560, 480, 6, 40));
    beach.add(grass(c, { x0: -500, x1: 2100, y: 478, fn: bfn, n: 40, h: 12, color: C.olive }));

    /* the crowd, in two sheets; each listener has a (hidden) glint of understanding behind the head */
    const crowdBack = S.layer({ par: 0.36, sh: 3 });
    const crowdFront = S.layer({ par: 0.46, sh: 4 });
    const ROWS = [
      { L: crowdBack, y: 500, s: 0.34, n: 26, x0: 40, x1: 1560 },
      { L: crowdBack, y: 528, s: 0.42, n: 20, x0: 80, x1: 1520 },
      { L: crowdFront, y: 568, s: 0.52, n: 14, x0: 150, x1: 1450 },
      { L: crowdFront, y: 624, s: 0.64, n: 8, x0: 300, x1: 1300 },
    ];
    const people = [];
    ROWS.forEach((r) => {
      const list = [];
      for (let i = 0; i < r.n; i++) {
        const x = lerp(r.x0, r.x1, (i + c.rr(0.15, 0.85)) / r.n);
        if (Math.abs(x - 800) < 70 + r.s * 60) continue;
        list.push({ x, y: r.y + c.rr(-4, 4), s: r.s * c.rr(0.9, 1.08) });
      }
      list.forEach((m) => {
        m.flip = m.x > 800; m.dir = m.flip ? -1 : 1;
        m.hx = m.x + 2 * m.s * m.dir; m.hy = m.y - 167 * m.s;
        m.lit = c.chance(0.5);
        m.glow = m.lit ? r.L.add(`<g opacity="0">${insight(c)}</g>`) : null;
        m.p = S.puppet(r.L.add(person(c, crowdPerson(c))));
        m.seed = c.rr(0, 9); m.delay = c.rr(0, 1); m.row = r;
        m.home = m.flip ? c.rr(1750, 2100) : c.rr(-500, -150);
        people.push(m);
      });
    });

    /* parables hanging over everyone like ornaments */
    const orn = S.layer({ par: 0.5, sh: 6 });
    const ICONS = [
      `<g transform="translate(0 18)">${sprout(c, { h: 32 })}</g>`,
      `<g transform="translate(-4 8) scale(.78)">${oilLamp(c).replace(/<circle class="glow"[^>]*\/>/, '')}</g>`,
      `<g transform="translate(0 22) scale(.62)">${bushel(c, 64, 52)}</g>`,
      `<g transform="translate(0 30) scale(.5)">${wheatStalk(c, { h: 60 }).replace('class="stalk"', '')}</g>`,
      `<g transform="translate(0 32) scale(.13)">${mustardTree(c, { h: 420 }).replace(/class="grow"/g, '')}</g>`,
      `<g transform="translate(6 2) scale(.52) rotate(20)">${sickle(c)}</g>`,
    ];
    const HIGH = [[445, 262], [580, 196], [712, 250], [888, 232], [1020, 190], [1155, 258]];
    const LOW = [[600, 470], [650, 400], [735, 358], [865, 358], [950, 400], [1000, 470]];
    const plates = ICONS.map((icon, i) => {
      const disc = sheet().p(c.cut(c.circ(0, 0, 42, 30), 0.6, 5), C.cream).p(c.cut(c.circ(0, 0, 36, 28), 0.4, 5), C.parchment).out();
      const el = hanging(orn, `<circle r="70" fill="url(#warm-glow)" opacity="0" data-part="g"/>${disc}${icon}`, { x: HIGH[i][0], y: HIGH[i][1], len: 520 });
      return { i, el, g: el.querySelector('[data-part="g"]'), hi: HIGH[i], lo: LOW[i] };
    });
    // words flying from Jesus to the parables (beat 2)
    const words = [0, 1, 2, 3].map(() => orn.add(`<g opacity="0"><circle r="16" fill="url(#warm-glow)"/><path d="${c.cut(c.ell(0, 0, 10, 6, 12), 0.3, 3)}" fill="${C.cream}"/></g>`));

    /* Jesus, the disciples and the fire */
    const main = S.layer({ par: 0.6, sh: 5 });
    main.add(sheet().p(c.cut(c.blob(800, 612, 70, 20, 12, 0.12).map(([x, y]) => [x, Math.min(y, 618)]), 0.8, 6), C.rock).out());
    const fireEl = main.add(`<g opacity="0">${campfire(c)}</g>`);
    const fGlow = fireEl.querySelector('[data-part="glow"]');
    const flames = [0, 1, 2].map((k) => fireEl.querySelector(`[data-part="f${k}"]`));
    const jStand = S.puppet(main.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(main.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const DIS = [
      { o: CAST.thomas, x: 452, y: 688, s: 0.8, cx: 575, cy: 660 },
      { o: CAST.peter, x: 560, y: 716, s: 0.88, cx: 648, cy: 712 },
      { o: CAST.andrew, x: 668, y: 700, s: 0.82, cx: 700, cy: 646 },
      { o: CAST.john, x: 932, y: 700, s: 0.82, cx: 900, cy: 646 },
      { o: CAST.james, x: 1040, y: 716, s: 0.88, cx: 952, cy: 712 },
      { o: CAST.matthew, x: 1148, y: 688, s: 0.8, cx: 1025, cy: 660 },
    ].map((d, i) => ({ ...d, i, flip: d.x > 800, seed: c.rr(0, 9), glow: main.add(`<g opacity="0">${insight(c)}</g>`), p: S.puppet(main.add(person(c, { ...d.o, pose: 'sit' }))) }));

    /* foreground */
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(reeds(c, 150, 930, 14, 220, C.moss) + reeds(c, 1470, 940, 12, 200, C.moss) + rock(c, 1360, 955, 190, 76, C.rock2) + rock(c, 240, 958, 150, 60, C.rock));

    return (t, time) => {
      const T = time;
      /* light: golden → dusk → evening */
      const dusk = es(t, 1.6, 2.9), eve = es(t, 2.9, 3.8);
      if (eve > 0) sk.blend(DUSK, EVE, eve); else sk.blend(GOLD, DUSK, dusk);
      fade(starsEl, eve);
      pose(sunEl, { x: 1130, y: lerp(230, 470, es(t, 0, 3.4, ease.sine)), r: Math.sin(T * 0.7) * 1.2 });
      fade(glitter, 1 - es(t, 2.4, 3.2));
      pose(moonEl, { x: 1260, y: lerp(520, 165, es(t, 2.9, 4, ease.out)), r: Math.sin(T * 0.6 + 1) * 1.2 });
      pose(cl1, { x: 560 + t * 18, y: 170, r: Math.sin(T * 0.6) * 1.4 });
      pose(cl2, { x: 1000 - t * 14, y: 130, r: Math.sin(T * 0.8 + 2) * 1.4 });
      pose(boatEl, { x: 1245, y: 468 + Math.sin(T * 1.3) * 1.5, s: 0.4, r: Math.sin(T * 1.1) * 1.2 });

      /* the crowd listens, nods, understands (some), then goes home at dusk */
      people.forEach((m) => {
        const go = seg(t, 2.45 + m.delay * 0.4, 3.0 + m.delay * 0.4);
        const x = lerp(m.x, m.home, ease.in(go));
        const nodK = seg(t, 1.05 + m.delay * 0.3, 1.75 + m.delay * 0.3);
        const nod = Math.sin(nodK * PI * 3) * 7 * (m.lit ? 1 : 0.5);
        const understand = m.lit ? es(t, 1.25 + m.delay * 0.45, 1.5 + m.delay * 0.45) * (1 - go) : 0;
        m.p.set({
          x, y: m.y, s: m.s, flip: go > 0 ? !m.flip : m.flip, o: 1 - seg(go, 0.7, 1),
          walk: go > 0 && go < 1 ? x * 0.06 : undefined,
          head: nod - es(t, 0.1, 0.5) * 4 - understand * 3,
          armF: understand * (m.delay > 0.6 ? 40 : 0) + bump(t, 0.2 + m.delay * 0.5, 0.8 + m.delay * 0.5) * 20,
          blink: blinkAt(T, m.seed),
        });
        if (m.glow) {
          const k = understand;
          pose(m.glow, { x: m.hx, y: m.hy, s: Math.max(0.45, m.s) * 1.5 * (0.6 + 0.4 * understand), o: k });
        }
      });

      /* Jesus: stands and teaches, then sits down by the fire with the Twelve */
      const sit = es(t, 3.05, 3.3);
      const target = Math.floor(seg(t, 2, 2.96) * 6);
      const toLeft = t >= 2 && t < 3 ? plates[Math.min(5, target)].hi[0] < 800 : false;
      const speak = t >= 2 && t < 3;
      jStand.set({
        x: 800, y: 606, s: 1.02, o: 1 - sit, flip: toLeft,
        armF: 30 + bump(t, 0, 0.9) * 90 + bump(t, 1, 1.9) * 40 + (speak ? 28 + Math.sin((t - 2) * PI * 12) * 16 : 0) + Math.sin(T * 1.1) * 4,
        armB: 12 + bump(t, 0.1, 0.8) * 50 + bump(t, 1.1, 1.8) * 30,
        head: -6 + Math.sin(T * 0.7) * 1.5, blink: blinkAt(T, 2),
      });
      jSit.set({
        x: 800, y: 618, s: 1, o: sit,
        armF: 35 + es(t, 3.4, 3.8) * 45 + Math.sin(T * 1.4) * 10 * es(t, 3.4, 3.8),
        armB: 15 + es(t, 3.5, 3.9) * 25, head: 4 * sit, blink: blinkAt(T, 2),
      });

      /* disciples draw close once the crowd has gone */
      const gather = es(t, 3.05, 3.55);
      DIS.forEach((d) => {
        const lean = es(t, 3.5 + d.i * 0.04, 3.8 + d.i * 0.04);
        d.p.set({
          x: lerp(d.x, d.cx, gather), y: lerp(d.y, d.cy, gather), s: d.s * lerp(1, 0.95, gather), flip: d.flip,
          walk: gather > 0 && gather < 1 ? t * 40 : undefined, amt: 0.4,
          lean: (d.flip ? -1 : 1) * lean * 4,
          head: -lean * 7 + Math.sin(T * 0.7 + d.seed) * 1.5 - es(t, 0, 0.6) * 5 * (1 - gather),
          armF: bump(t, 1.2 + d.i * 0.08, 1.9 + d.i * 0.08) * 30 + lean * (d.i % 2 ? 20 : 45),
          blink: blinkAt(T, d.seed),
        });
        // understanding dawns on each of them in turn
        const ah = es(t, 3.55 + d.i * 0.06, 3.8 + d.i * 0.06);
        const x = lerp(d.x, d.cx, gather), y = lerp(d.y, d.cy, gather), s = d.s * lerp(1, 0.95, gather);
        pose(d.glow, { x: x + 2 * s * (d.flip ? -1 : 1), y: y - 105 * s, s: s * 1.2 * (0.6 + 0.4 * ah), o: ah * (0.85 + Math.sin(T * 2 + d.seed) * 0.15) });
      });

      /* the fire kindles */
      const fire = es(t, 3.1, 3.45);
      fade(fireEl, fire);
      pose(fireEl, { x: 800, y: 700, s: 0.9 });
      fade(fGlow, fire * (0.8 + Math.sin(T * 5) * 0.1));
      flames.forEach((f, k) => pose(f, { sx: 1 + Math.sin(T * (7 + k * 2) + k) * 0.1, sy: fire * (1 + Math.sin(T * (5 + k * 3) + k * 2) * 0.12), r: Math.sin(T * 4 + k) * 4 }));

      /* the parables: rise out of Jesus' hand, glow as he speaks, then come down into the circle */
      plates.forEach((pl) => {
        const up = es(t, 0.08 + pl.i * 0.12, 0.5 + pl.i * 0.12, ease.back);
        const down = es(t, 3.12 + pl.i * 0.04, 3.55 + pl.i * 0.04);
        const hx = lerp(830, pl.hi[0], up), hy = lerp(470, pl.hi[1], up);
        const x = lerp(hx, pl.lo[0], down), y = lerp(hy, pl.lo[1], down);
        // pulse when words reach it
        const idx = seg(t, 2, 2.96) * 6;
        const hit = t >= 2 && t < 3 ? Math.max(0, 1 - Math.abs(idx - (pl.i + 0.85)) * 3) : 0;
        pose(pl.el, { x, y: y + Math.sin(T * 1.2 + pl.i) * 4, s: (0.2 + 0.8 * up) * (1 + hit * 0.14) * lerp(1, 0.78, down), r: Math.sin(T * 0.9 + pl.i * 2) * 3 + hit * 8 * (pl.i % 2 ? 1 : -1), o: seg(t, 0.05 + pl.i * 0.12, 0.2 + pl.i * 0.12) });
        fade(pl.g, Math.max(bump(t, 1.2, 2) * 0.5, hit, down * (0.55 + Math.sin(T * 2 + pl.i) * 0.1)));
      });
      // words: little paper beads flying from Jesus' mouth to the parable that is being told
      const idx = seg(t, 2, 2.96) * 6, cur = Math.min(5, Math.floor(idx)), u = idx - Math.floor(idx);
      words.forEach((w, j) => {
        const uu = u - j * 0.1;
        const pl = plates[cur];
        const on = t >= 2 && t < 2.97 && uu > 0 && uu < 0.85 ? 1 : 0;
        const k = Math.min(1, Math.max(0, uu / 0.85));
        const sx = 800 + (pl.hi[0] < 800 ? -18 : 18), sy = 440;
        pose(w, { x: lerp(sx, pl.hi[0], k), y: lerp(sy, pl.hi[1], k) - Math.sin(k * PI) * 60, s: 1 - j * 0.16, r: k * 180, o: on });
      });

      S.cam.z = 1 + es(t, 0.8, 1.6) * 0.04 + es(t, 3.0, 3.8) * 0.1;
      S.cam.y = es(t, 0.8, 1.6) * 20 + es(t, 3.0, 3.8) * 40;
    };
  },
};
