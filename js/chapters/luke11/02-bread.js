// Łk 11,3–4 — the prayer in an ordinary house, cut open (the same quiet family as in Matthew's Our Father). "Give us
// each day our daily bread": three little suns hang across the room — day after day each one lights, and each time a
// warm loaf comes down on its string to the family's table, and a tiny loaf shows in that day's sun. "Forgive us our
// sins": dark knots of sin rise off the three of them into a shaft of light and are gone; "for we ourselves forgive
// everyone who is indebted to us": two neighbours come in at the door with their wax tablets of debt, and the man
// tears both in two. "And lead us not into temptation": night; the man goes to the door — out on the path a purse
// glitters, and over it, half hidden in a dead tree, hangs a dark net. A shaft of light falls between; he stops and
// turns back — the net drops on the empty bait — and he shuts the door on it, his lamp burning inside.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { sun as sunA, band, bush } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { QUIET, WIFE, CHILD, manOf, loaf, sinKnot, secretShaft, smallLamp, iou, iouHalf, purse, sparkle, headP, handAt, kf, moving, label, tr, PI, NIGHT } from './lib.js';

const GY = 668;                         // the floor line where they sit
const WX0 = 330, WX1 = 960, WT = 200;   // the room
const TX = 650;                         // the table
const DAYS = [520, 650, 780];           // the three suns of the days
const DX = 1000;                        // the doorway (a gap in the right wall)
const BX = 1100;                        // the bait on the path outside

/** a low table (origin: floor centre) */
function table(c, w = 200) {
  return sheet().p(c.cut([[-w / 2, -44], [w / 2, -44], [w / 2 - 4, -32], [-w / 2 + 4, -32]], 0.4, 6), C.wood)
    .p(c.cut(c.rect(-w / 2 + 12, -34, 12, 34), 0.3, 4) + c.cut(c.rect(w / 2 - 24, -34, 12, 34), 0.3, 4), C.wood2).out();
}
/** a small sun for a day (origin centre); .lit shown when it is that day */
function daySun(c, r = 22) {
  const off = sheet().p(c.cut(c.star(0, 0, r * 1.35, r * 1.05, 12, 0), 0.3, 4), mix(C.stone2, C.sand2, 0.4)).p(c.cut(c.circ(0, 0, r, 20), 0.3, 4), mix(C.stone, C.sand, 0.4)).out();
  const on = sheet().p(c.cut(c.star(0, 0, r * 1.4, r * 1.05, 12, 0), 0.3, 4), C.sunDeep).p(c.cut(c.circ(0, 0, r, 20), 0.3, 4), C.sun).out();
  return `<path d="M0 -1600V${-r * 1.3}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="off">${off}</g><g class="lit" opacity="0"><circle r="${r * 2.6}" fill="url(#warm-glow)"/>${on}</g>`;
}
/** a dark net hanging in a heap (origin: its top, where it hangs) and spread when dropped */
function net(c, w = 110, h = 120, col = '#3b3243') {
  // a fowler's net hanging in a bell from its cord, weighted with stones at the hem; origin: the knot at the top
  const bell = [[0, 0], [w * 0.18, h * 0.3], [w * 0.42, h * 0.75], [w / 2, h], [-w / 2, h], [-w * 0.42, h * 0.75], [-w * 0.18, h * 0.3]];
  const id = 'net' + Math.floor(c.r() * 1e9);
  let d = '';
  for (let i = -8; i <= 8; i++) { d += c.ribbon([[i * 16 - 60, -10], [i * 16 + 60, h + 20]], 1.3) + c.ribbon([[i * 16 + 60, -10], [i * 16 - 60, h + 20]], 1.3); }
  let st = '';
  for (let i = 0; i < 6; i++) st += c.cut(c.circ(-w / 2 + 6 + (i * (w - 12)) / 5, h + 2, 5, 8), 0.3, 3);
  return `<clipPath id="${id}"><path d="${c.poly(bell)}"/></clipPath><path d="${c.poly(bell)}" fill="${col}" opacity=".18"/><g clip-path="url(#${id})"><path d="${d}" fill="${col}"/></g>` + sheet().p(c.ribbon([[-w / 2, h], [w / 2, h]], 3) + c.ribbon([[0, 0], [0, -140]], 2), col).p(st, C.rock3).out();
}
/** a dead tree bent over the path (origin: foot) */
function deadTree(c) {
  return sheet().p(c.ribbon([[0, 0], [-6, -80], [10, -160], [60, -210], [120, -228]], (u) => 16 - u * 11), mix(C.wood2, C.rock3, 0.5))
    .p(c.ribbon([[6, -130], [-30, -176], [-44, -200]], 5) + c.ribbon([[60, -210], [72, -250]], 4), mix(C.wood2, C.rock3, 0.5)).out();
}

export default {
  id: 'lk11-bread',
  beats: [
    { v: 3 },
    { v: 4, text: 'i przebacz nam nasze grzechy, bo i my przebaczamy każdemu, kto nam zawini;' },
    { v: 4, cont: true, text: 'i nie dopuść, byśmy ulegli pokusie».' },
  ],
  cam: { x: [-30, 90], y: [-50, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, ['#c7d8d6', '#f2dcbc', '#f8e6c6']);
    const night = sky(S, NIGHT, { name: 'night', rise: 0 }).layer;
    night.fade(0);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.18) }).markup);

    /* outside: the path, a bush, the dead tree with the net, the bait */
    const out = S.layer({ par: 0.36, sh: 3 });
    out.add(sheet().p(c.cut([[WX1 - 20, GY - 8], [2700, GY - 14], [2700, 1900], [WX1 - 20, 1900]], 0.6, 16), mix(C.sand2, C.dune, 0.3)).p(c.ribbon([[WX1, GY + 20], [1200, GY + 30], [1500, GY + 10], [2200, GY + 20]], 34, 2), mix(C.sand, C.cream, 0.35)).out() + bush(c, 1380, GY + 4, 70, C.sage) + `<g transform="translate(1180 ${GY + 10})">${deadTree(c)}</g>`);
    const bait = out.add(`<g opacity="0"><circle r="46" fill="url(#warm-glow)" opacity=".8"/>${purse(c)}</g>`);
    const glint = [0, 1].map(() => out.add(`<g opacity="0">${sparkle(c, 10, '#fff6dc')}</g>`));
    const netEl = out.add(`<g opacity="0">${net(c)}</g>`);

    /* the room: the back wall with a window, the ceiling, the floor */
    const room = S.layer({ par: 0.4, sh: 4 });
    const wall = mix(C.plaster, C.dawn, 0.25);
    const rs = sheet();
    const win = c.rect(380, 250, 90, 84);
    rs.p(c.cut([[WX0, WT], [WX1, WT], [WX1, GY], [WX0, GY]], 0.5, 10) + c.hole(win, 0.3, 6), wall);
    rs.p(c.cut([[-1100, -1400], [WX1 + 40, -1400], [WX1 + 40, WT], [-1100, WT]], 0.5, 12), mix(C.roof, C.wood2, 0.3));
    rs.p(c.cut([[-1100, WT], [WX0, WT], [WX0, GY], [-1100, GY]], 0.5, 12), mix(C.plaster2, C.dawn, 0.2));
    let beams = '';
    for (let x = WX0 + 10; x < WX1; x += 56) beams += c.cut(c.rect(x, WT, 14, 14), 0.2, 4);
    rs.p(beams, C.wood2);
    rs.p(c.cut([[376, 246], [474, 246], [474, 252], [376, 252]], 0.2, 5) + c.cut([[374, 332], [476, 332], [480, 342], [370, 342]], 0.3, 5), C.wood2);
    rs.p(c.cut(c.rect(840, 380, 100, 8), 0.3, 5), C.wood);
    // a niche with water jars, a hanging bunch of herbs, a rolled sleeping mat against the wall
    rs.p(c.cut([[590, 430], [590, 360], ...c.arc(640, 360, 50, 36, PI, 2 * PI, 10), [690, 360], [690, 430]], 0.4, 6), shade(wall, -0.12));
    rs.p(c.cut([[608, 430], [604, 398], [618, 388], [632, 398], [628, 430]], 0.3, 4) + c.cut([[648, 430], [642, 392], [660, 380], [678, 392], [672, 430]], 0.3, 4), C.pot);
    rs.p(c.ribbon([[470, WT + 14], [470, 300]], 1.4), C.rope).p(c.cut(c.blob(470, 316, 16, 24, 10, 0.3), 0.6, 4), C.olive);
    rs.p(c.cut(c.rect(WX0 + 14, GY - 120, 44, 116), 0.5, 6), C.basket).x(c.ribbon([[WX0 + 18, GY - 90], [WX0 + 54, GY - 90]], 2) + c.ribbon([[WX0 + 18, GY - 40], [WX0 + 54, GY - 40]], 2), shade(C.basket, -0.25));
    room.add(rs.out());
    room.add(sheet().p(c.cut([[-1100, GY - 6], [WX1 + 30, GY - 6], [WX1 + 30, 1900], [-1100, 1900]], 0.5, 20), mix(C.wood3, C.sand, 0.45)).out());
    const lampOff = room.add(`<g>${smallLamp(c, { lit: false })}</g>`);
    /* the right wall cut through, with the doorway and its door leaf */
    const wallR = S.layer({ par: 0.4, sh: 5 });
    wallR.add(sheet().p(c.cut([[WX1, WT - 40], [WX1 + 34, WT - 40], [WX1 + 34, 440], [WX1, 440]], 0.5, 8), C.stone).p(c.cut([[WX1 - 4, 440], [WX1 + 38, 440], [WX1 + 38, 452], [WX1 - 4, 452]], 0.3, 6), C.wood2).out());
    const door = wallR.add(`<g>${sheet().p(c.cut(c.rect(0, -(GY - 452), 30, GY - 452), 0.4, 6), C.wood).x(c.ribbon([[15, -(GY - 460)], [15, -8]], 1.6), shade(C.wood, -0.25), 'opacity=".6"').out()}</g>`);

    /* the dark of night inside the room, and the lamp's light */
    const dimL = S.layer({ par: 0.4, sh: 0, flat: true });
    dimL.add(`<rect x="${WX0 - 1400}" y="-1500" width="${WX1 - WX0 + 1440}" height="3600" fill="${mix(C.night, C.plumRobe, 0.3)}" opacity=".5"/>`);
    dimL.fade(0);
    const lampOn = dimL.add(`<g opacity="0">${smallLamp(c)}<circle cx="26" cy="-22" r="200" fill="url(#warm-glow)" opacity=".5"/></g>`);

    /* the three suns of the days, and the little loaf that shows in each */
    const hL = S.layer({ par: 0.4, sh: 5 });
    const suns = DAYS.map((x, i) => {
      const el = hanging(hL, daySun(c), { x: 0, y: -1500, len: 0 });
      return { i, x, el, lit: el.querySelector('.lit'), off: el.querySelector('.off'), mini: hL.add(`<g opacity="0">${loaf(c, 14, C.clay)}</g>`) };
    });
    const dayTag = hL.add(`<g opacity="0">${label(c, tr('każdego dnia', 'day by day'), { size: 16 })}</g>`);

    /* the morning light on the table, the loaves on their strings */
    const lightL = S.layer({ par: 0.4, sh: 0, flat: true });
    const shaft = lightL.add(`<g opacity="0">${secretShaft(c, { w0: 110, w1: 260, h: 480 })}</g>`);
    const doorShaft = lightL.add(`<g opacity="0">${secretShaft(c, { w0: 40, w1: 150, h: 900 })}</g>`);
    const act = S.layer({ par: 0.4, sh: 5 });
    act.add(`<g transform="translate(${TX} ${GY + 6}) scale(1.2)">${table(c)}</g>`);
    const breads = DAYS.map((x, i) => ({ i, x, el: act.add(`<g opacity="0"><circle r="40" fill="url(#warm-glow)" opacity=".8"/>${loaf(c, 26)}</g>`) }));

    /* the family, the neighbours */
    const wife = S.puppet(act.add(person(c, { ...WIFE, pose: 'sit' })));
    const kid = S.puppet(act.add(person(c, { ...CHILD, pose: 'sit' })));
    const manS = S.puppet(act.add(person(c, { ...QUIET, pose: 'sit' })));
    const manW = S.puppet(act.add(person(c, QUIET)));
    const NB = [manOf(c, { robe: C.clayMantle, mantle: null, hairStyle: 'short', beard: 'short' }), manOf(c, { robe: C.tealRobe, mantle: C.wheatRobe, hairStyle: 'wrap', veil: C.stone, beard: 'full' })]
      .map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))), tab: act.add(`<g opacity="0">${iou(c, i ? '20' : '50', { w: 56, h: 40, size: 20 })}</g>`), a: act.add(`<g opacity="0">${iouHalf(c, i ? '20' : '50', -1, { w: 56, h: 40, size: 20 })}</g>`), b: act.add(`<g opacity="0">${iouHalf(c, i ? '20' : '50', 1, { w: 56, h: 40, size: 20 })}</g>`) }));
    const fx = S.layer({ par: 0.42, sh: 3 });
    const sins = [[560, 0], [610, 1], [800, 2], [540, 3], [820, 4]].map(([x, i]) => ({ i, x, el: fx.add(`<g opacity="0">${sinKnot(c, 12)}</g>`), sp: fx.add(`<g opacity="0">${sparkle(c, 9)}</g>`) }));

    /* the front of the room, cut away */
    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(sheet().p(c.cut([[-1100, 900], [WX0 - 10, 900], [WX0 - 30, GY - 200], [WX0 - 120, WT - 80], [-1100, WT - 80]], 0.5, 12), mix(C.plaster2, C.clay, 0.2)).out());

    return (t, time) => {
      const T = time;
      /* v3 — day by day: each sun lights and its loaf comes down */
      const ask = es(t, 0.02, 0.2) * (1 - es(t, 0.85, 1.05));
      const tk = es(t, 0.05, 0.25) * (1 - es(t, 2.0, 2.2));
      pose(dayTag, { x: 650, y: 318, o: tk });
      suns.forEach((d) => {
        const a = 0.08 + d.i * 0.2;
        const hk = es(t, -0.2 + d.i * 0.04, 0.1 + d.i * 0.04, ease.out);
        pose(d.el, { x: d.x, y: lerp(-400, 262, hk), r: T ? Math.sin(T * 0.8 + d.i) * 1.4 : 0, o: hk > 0.01 ? 1 : 0 });
        const lit = es(t, a, a + 0.08);
        attr2(d.lit, lit * (1 - es(t, 2.05, 2.3) * 0.7)); attr2(d.off, 1 - lit);
        const got = es(t, a + 0.2, a + 0.28, ease.back);
        pose(d.mini, { x: d.x, y: 272, s: got, o: got > 0.02 ? 1 - es(t, 2.05, 2.3) * 0.5 : 0 });
      });
      breads.forEach((b) => {
        const a = 0.1 + b.i * 0.2;
        const down = es(t, a, a + 0.18, ease.out);
        const eaten = b.i < 2 ? es(t, a + 0.3, a + 0.4) : 0;
        pose(b.el, { x: lerp(b.x, TX - 10 + b.i * 10, down), y: lerp(300, GY - 66, down), r: T ? Math.sin(T * 0.9 + b.i) * 2 * (1 - down) : 0, o: down > 0.01 ? 1 - eaten : 0 });
      });
      const sk = es(t, 0.1, 0.3) * (1 - es(t, 1.9, 2.1));
      pose(shaft, { x: TX, y: GY - 36, sx: 0.4 + sk * 0.6, o: sk });

      /* the family */
      const up = es(t, 1.28, 1.36);
      const toDoor = es(t, 2.1, 2.4);
      const sinsUp = es(t, 1.05, 1.3);
      wife.set({ x: 500, y: GY + 10, s: 1.3, armF: 30 + ask * 70 + sinsUp * 20, armB: 20 + ask * 70 + sinsUp * 60, head: -ask * 10 - sinsUp * 10 + es(t, 2.3, 2.5) * 12, blink: blinkAt(T, 3) });
      kid.set({ x: 590, y: GY + 16, s: 0.86, armF: 30 + ask * 90, armB: 20 + ask * 60 + bump(t, 0.3, 0.7) * 40, head: -ask * 10 - sinsUp * 8, blink: blinkAt(T, 5) });
      manS.set({ x: 810, y: GY + 10, s: 1.32, flip: true, o: 1 - up, armF: 30 + ask * 70 + sinsUp * 20, armB: 20 + ask * 80 + sinsUp * 50, head: -ask * 10 - sinsUp * 10, blink: blinkAt(T, 1) });

      /* v4a — the sins rise into the light */
      sins.forEach((s) => {
        const a = 1.05 + s.i * 0.05;
        const k = es(t, a, a + 0.35);
        const hy = s.i === 2 || s.i === 4 ? 470 : s.i === 1 ? 560 : 480;
        pose(s.el, { x: s.x + Math.sin(k * 5 + s.i) * 12 * k, y: hy - k * 200, r: k * 80 * (s.i % 2 ? 1 : -1), s: 1 - k * 0.5, o: seg(t, a - 0.04, a) * (1 - es(t, a + 0.22, a + 0.35)) });
        const f = bump(t, a + 0.2, a + 0.45);
        pose(s.sp, { x: s.x, y: hy - 190, s: f, r: T * 60, o: f });
      });
      const fs = es(t, 1.0, 1.15) * (1 - es(t, 1.45, 1.6));
      pose(shaft, { x: TX, y: GY - 36, sx: 1, o: Math.max(sk, fs) });

      /* v4a — the neighbours come in with their debts; he tears both */
      const tear = [es(t, 1.56, 1.6), es(t, 1.68, 1.72)];
      const lifted = es(t, 1.8, 1.95);
      const MX = 800;
      const reach = es(t, 1.44, 1.52);
      manW.set({ x: kf(t, [[2.1, MX], [2.4, DX - 40], [2.62, DX - 40], [2.78, DX - 110]]), y: GY + 2, s: 1.3, flip: t > 2.62, o: up, walk: moving(t, [[2.1, MX], [2.4, DX - 40], [2.62, DX - 40], [2.78, DX - 110]]) ? t * 60 : undefined,
        armF: 16 + reach * 60 * (1 - lifted) + bump(t, 1.52, 1.76) * 20 + lifted * 30 - toDoor * 20 + bump(t, 2.44, 2.6) * 50, armB: 10 + reach * 50 * (1 - lifted), head: 4 * (1 - lifted) - bump(t, 2.4, 2.62) * 4, blink: blinkAt(T, 1) });
      NB.forEach((n) => {
        const K = [[1.3 + n.i * 0.06, DX + 40 + n.i * 40], [1.5 + n.i * 0.06, 910 + n.i * 90], [2.0, 910 + n.i * 90], [2.25, DX + 200 + n.i * 60]];
        const x = kf(t, K);
        const o = seg(t, 1.28 + n.i * 0.06, 1.32 + n.i * 0.06) * (1 - seg(t, 2.2, 2.3));
        const bowd = 1 - es(t, 1.8, 1.95);
        n.p.set({ x, y: GY + 2 + n.i * 6, s: 1.26 - n.i * 0.04, flip: t < 2.02, o, walk: moving(t, K) ? x * 0.06 + n.i : undefined, armF: 14 + es(t, 1.42, 1.5) * 60 * (1 - tear[n.i]) + (1 - bowd) * 40, armB: 8 + (1 - bowd) * 60, head: 14 * bowd - (1 - bowd) * 6, lean: 6 * bowd, blink: blinkAt(T, 6 + n.i) });
        const [hx, hy] = handAt(x, GY + 2 + n.i * 6, 1.26 - n.i * 0.04, true, 74);
        pose(n.tab, { x: hx - 16, y: hy - 12 - n.i * 6, o: o > 0.5 && tear[n.i] === 0 ? es(t, 1.42, 1.5) : 0 });
        const fall = es(t, 1.6 + n.i * 0.12, 1.95 + n.i * 0.1);
        pose(n.a, { x: hx - 22 - fall * 30, y: hy - 12 - n.i * 6 + fall * (GY - hy), r: -fall * 140, o: tear[n.i] > 0 ? 1 - seg(t, 2.1, 2.2) : 0 });
        pose(n.b, { x: hx - 10 + fall * 26, y: hy - 12 - n.i * 6 + fall * (GY - hy + 4), r: fall * 160, o: tear[n.i] > 0 ? 1 - seg(t, 2.1, 2.2) : 0 });
      });

      /* v4b — night; the snare outside; the light between; he turns back and shuts the door */
      const nk = es(t, 1.95, 2.25);
      night.fade(nk * 0.92);
      dimL.fade(nk);
      pose(lampOff, { x: 880, y: 380, o: 1 - es(t, 2.05, 2.1) });
      pose(lampOn, { x: 880, y: 380, o: es(t, 2.05, 2.1) });
      const drop = es(t, 2.56, 2.66, ease.in);
      pose(bait, { x: BX, y: GY + 26, o: es(t, 2.1, 2.25) });
      glint.forEach((g, i) => { const f = bump(t, 2.3 + i * 0.12, 2.5 + i * 0.12) + (t > 2.2 && t < 2.6 && T ? Math.max(0, Math.sin(T * 3 + i * 2)) * 0.6 : 0); pose(g, { x: BX + (i ? 14 : -10), y: GY - (i ? 4 : 16), s: Math.min(1, f), r: T * 40, o: Math.min(1, f) }); });
      pose(netEl, { x: BX + 10, y: lerp(GY - 250, GY - 70, drop), o: es(t, 2.1, 2.25) });
      const dl = es(t, 2.4, 2.55) * (1 - es(t, 2.95, 3.0) * 0.3);
      pose(doorShaft, { x: DX + 60, y: GY + 20, o: dl });
      const shut = es(t, 2.72, 2.86);
      pose(door, { x: DX, y: GY, sx: Math.max(0.12, shut), o: 1 });

      S.cam.x = kf(t, [[0, -20], [1.0, -10], [1.3, 40], [2.0, 40], [2.3, 90]]);
      S.cam.z = kf(t, [[0, 1.12], [1.0, 1.12], [1.3, 1.14], [2.0, 1.14], [2.3, 1.12]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 50], [2.0, 50], [2.3, 50]]);
      if (S.portrait) { S.cam.z = 1.0; S.cam.x = kf(t, [[0, -20], [2.0, 0], [2.3, 90]]); }
    };
  },
};
import { fade as attr2 } from '../../core/anim.js';
