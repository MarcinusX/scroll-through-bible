// Mk 3,7–8 — a paper map of the land hangs in the theatre: Jesus walks down to the lake, and from
// every region named — Galilee, Judea, Jerusalem, Idumea, beyond the Jordan, Tyre and Sidon —
// little paper people set out along the roads until they all stand around him by the water.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { strip, along } from './lib.js';

const PI = Math.PI;
const LAKE = [800, 300];
const SHORE = [752, 300];   // where Jesus stands, on the western shore
const SP = 0.15;            // puppet scale on the map

/** a little hill-town: a few cubes with a wall */
function mapTown(c, x, y, sc = 1, walls = false) {
  const s = sheet();
  if (walls) s.p(c.cut([[x - 26 * sc, y], [x - 26 * sc, y - 16 * sc], [x - 20 * sc, y - 22 * sc], [x + 20 * sc, y - 22 * sc], [x + 26 * sc, y - 16 * sc], [x + 26 * sc, y]], 0.4, 5), C.stone2);
  for (let i = 0; i < 4; i++) {
    const hx = x + (i - 1.5) * 11 * sc + c.rr(-2, 2), h = c.rr(9, 15) * sc, w = c.rr(9, 12) * sc, hy = y - (walls ? 12 : 0) * sc - (i % 2) * 3 * sc;
    s.p(c.cut(c.rect(hx - w / 2, hy - h, w, h), 0.2, 4), i % 2 ? C.plaster : C.cream);
    s.x(c.poly(c.rect(hx - w / 2 - 1, hy - h - 2.5 * sc, w + 2, 2.5 * sc)), C.roof);
  }
  if (walls) s.p(c.cut([[x - 5 * sc, y - 34 * sc], [x + 5 * sc, y - 34 * sc], [x + 5 * sc, y - 16 * sc], [x - 5 * sc, y - 16 * sc]], 0.2, 4), C.ochre);
  return s.out();
}
function hills(c, x, y, n, w, col) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const hx = x + c.rr(-w, w), hy = y + c.rr(-w * 0.5, w * 0.5), h = c.rr(10, 20), b = c.rr(12, 22);
    d += c.cut([[hx - b, hy], [hx - b * 0.2, hy - h], [hx + b * 0.1, hy - h * 0.9], [hx + b, hy]], 0.5, 4);
  }
  return sheet().p(d, col).out();
}
function palmsSmall(c, x, y) {
  let d = '', tr_ = '';
  for (let i = 0; i < 3; i++) {
    const px = x + i * 9 + c.rr(-2, 2), py = y + c.rr(-2, 2);
    tr_ += c.ribbon([[px, py], [px + 1, py - 14]], 2);
    for (let k = 0; k < 5; k++) { const a = -PI * (0.1 + k * 0.2); d += c.ribbon([[px + 1, py - 14], [px + 1 + Math.cos(a) * 8, py - 14 + Math.sin(a) * 5 + 3]], 2.6); }
  }
  return sheet().p(tr_, C.wood3).p(d, C.moss).out();
}
function compass(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 34, 30), 0.4, 5), C.cream);
  s.p(c.cut(c.star(0, 0, 30, 7, 4, -PI / 2), 0.3, 4), C.ochre);
  s.p(c.cut(c.star(0, 0, 20, 5, 4, -PI / 4), 0.3, 4), C.clay);
  s.x(c.poly([[0, -30], [5, -6], [-5, -6]]), C.terracotta);
  return `${s.out()}<text x="0" y="-38" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="15" font-style="italic" fill="${C.ink}">N</text>`;
}
function ship(c) {
  const s = sheet();
  s.p(c.cut([[-22, 0], [22, 0], [16, 9], [-16, 9]], 0.3, 4), C.wood);
  s.p(c.ribbon([[0, 0], [0, -28]], 2), C.wood2);
  s.p(c.cut([[2, -26], [18, -8], [2, -6]], 0.3, 4), C.sail);
  return s.out();
}

export default {
  id: 'm3-multitude',
  beats: [
    { v: 7, text: 'Jezus zaś oddalił się ze swymi uczniami w stronę jeziora.' },
    { v: 7, cont: true, text: 'A szło za Nim wielkie mnóstwo ludu z Galilei.' },
    { v: 7, cont: true, text: 'Także z Judei,' },
    { v: 8, text: 'z Jerozolimy, z Idumei i Zajordania oraz z okolic Tyru i Sydonu' },
    { v: 8, cont: true, text: 'szło do Niego mnóstwo wielkie na wieść o Jego wielkich czynach.' },
  ],
  cam: { x: [-60, 0], y: [-170, -40], z: [0.94, 1.62] },
  build(S) {
    const c = S.c;
    sky(S, ['#e7d6ba', '#ead9bd', '#dcc3a0']);

    /* ---------- the map: one big hand-cut parchment hanging on two strings ---------- */
    const mapL = S.layer({ par: 1, sh: 6 });
    const X0 = 372, X1 = 1228, Y0 = 34, Y1 = 790;
    const m = sheet();
    const edge = [];
    for (let x = X0; x <= X1; x += 22) edge.push([x, Y0 + c.rr(-4, 4)]);
    for (let y = Y0; y <= Y1; y += 22) edge.push([X1 + c.rr(-4, 4), y]);
    for (let x = X1; x >= X0; x -= 22) edge.push([x, Y1 + c.rr(-4, 4)]);
    for (let y = Y1; y >= Y0; y -= 22) edge.push([X0 + c.rr(-4, 4), y]);
    m.p(c.poly(edge), C.parchment);
    // the sea in the west
    const coast = [[610, Y0], [598, 90], [580, 150], [566, 210], [552, 280], [536, 360], [520, 440], [508, 520], [494, 600], [482, 680], [470, Y1]];
    const sea = [[X0 + 3, Y0 + 3], ...coast.map(([x, y]) => [x + c.rr(-3, 3), y]), [X0 + 3, Y1 - 3]];
    m.p(c.cut(sea, 1.2, 10), mix(C.lake, C.parchment, 0.35));
    let waves = '';
    for (let i = 0; i < 26; i++) { const y = c.rr(70, 760), x = c.rr(390, 480 - (y - 70) * 0.02); waves += c.ribbon(c.arc(x, y, 9, 4, PI * 1.1, PI * 1.9, 6), 1.4); }
    m.x(waves, shade(C.lake2, -0.1), 'opacity=".6"');
    // hills of Galilee and Judea, the desert of Idumea, the plateau beyond the Jordan
    m.p(c.cut(c.blob(650, 270, 80, 60, 14, 0.2), 1.4, 8), mix(C.hillMid, C.parchment, 0.4));
    m.p(c.cut(c.blob(655, 470, 90, 90, 14, 0.2), 1.4, 8), mix(C.hillFar, C.parchment, 0.3));
    m.p(c.cut(c.blob(680, 640, 110, 60, 14, 0.2), 1.4, 8), mix(C.dune, C.parchment, 0.5));
    m.p(c.cut(c.blob(1010, 440, 150, 190, 16, 0.18), 1.4, 8), mix(C.sand2, C.parchment, 0.55));
    m.p(c.cut(c.blob(590, 140, 50, 70, 12, 0.2), 1.2, 8), mix(C.sage2, C.parchment, 0.4));
    // the lake of Galilee, the Jordan, the Dead Sea
    const jordan = c.cbez([LAKE[0] + 6, LAKE[1] + 52], [770, 400], [860, 440], [836, 520], 24).map(([x, y], i) => [x + Math.sin(i * 1.3) * 5, y]);
    m.p(c.ribbon(jordan, (u) => 4 + u * 2), mix(C.lake2, C.parchment, 0.2));
    m.p(c.cut(c.blob(LAKE[0], LAKE[1], 44, 56, 16, 0.08), 0.8, 6), C.lake);
    m.x(c.ribbon(c.arc(LAKE[0] + 4, LAKE[1] + 4, 30, 40, PI * 1.2, PI * 1.8, 8), 1.6), C.foam, 'opacity=".7"');
    m.p(c.cut(c.blob(840, 560, 26, 52, 14, 0.1), 0.8, 6), mix(C.lake2, C.skyVeil, 0.4));
    // a decorative border
    m.x(c.ribbon([[X0 + 12, Y0 + 12], [X1 - 12, Y0 + 12]], 1.6) + c.ribbon([[X1 - 12, Y0 + 12], [X1 - 12, Y1 - 12]], 1.6) + c.ribbon([[X1 - 12, Y1 - 12], [X0 + 12, Y1 - 12]], 1.6) + c.ribbon([[X0 + 12, Y1 - 12], [X0 + 12, Y0 + 12]], 1.6), C.clay, 'opacity=".55"');
    mapL.add(m.out());
    mapL.add(hills(c, 640, 270, 7, 50, mix(C.moss, C.parchment, 0.3)) + hills(c, 650, 470, 9, 60, mix(C.olive, C.parchment, 0.3)) + hills(c, 1020, 400, 8, 90, mix(C.clay, C.parchment, 0.4)) + hills(c, 600, 130, 4, 30, mix(C.moss, C.parchment, 0.3)));
    let dots = '';
    for (let i = 0; i < 40; i++) dots += c.poly(c.circ(c.rr(590, 780), c.rr(610, 680), c.rr(1, 2.2), 5));
    mapL.add(sheet().x(dots, C.dune).out() + palmsSmall(c, 800, 500) + palmsSmall(c, 870, 330));
    // towns
    mapL.add(mapTown(c, 572, 150, 0.9) + mapTown(c, 588, 80, 0.8) + mapTown(c, 745, 508, 1.1, true) + mapTown(c, 690, 258, 0.8) + mapTown(c, 790, 244, 0.7) + mapTown(c, 1040, 380, 0.7) + mapTown(c, 700, 640, 0.7));
    mapL.add(`<g transform="translate(${S.portrait ? 1050 : 1110} 660)">${compass(c)}</g><g transform="translate(430 300)">${ship(c)}</g>`);
    // two strings from the flies
    mapL.add(`<path d="M${X0 + 60} ${Y0}V-1400M${X1 - 60} ${Y0}V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.4"/>`);

    /* ---------- regions, roads and walkers ---------- */
    const REG = [
      { k: 'galilee', name: tr('Galilea', 'Galilee'), lab: [640, 214], at: 1.12, n: 7, path: [[610, 300], [660, 310], [700, 305], [730, 300]] },
      { k: 'judea', name: tr('Judea', 'Judea'), lab: [610, 406], at: 2.12, n: 6, path: [[610, 470], [650, 430], [690, 380], [715, 335], [735, 312]] },
      { k: 'jerusalem', name: tr('Jerozolima', 'Jerusalem'), lab: [690, 540], at: 3.05, n: 6, path: [[745, 500], [772, 470], [792, 420], [786, 372], [765, 335]] },
      { k: 'idumea', name: tr('Idumea', 'Idumea'), lab: [650, 598], at: 3.14, n: 5, path: [[690, 650], [740, 600], [790, 540], [800, 470], [800, 400], [780, 352]] },
      { k: 'jordan', name: tr('Zajordanie', 'beyond the Jordan'), lab: [1040, 300], at: 3.22, n: 6, path: [[1030, 420], [960, 400], [890, 375], [840, 362], [812, 358]] },
      { k: 'tyre', name: tr('Tyr i Sydon', 'Tyre and Sidon'), lab: [690, 104], at: 3.42, n: 6, path: [[585, 160], [640, 200], [690, 230], [728, 262], [742, 285]] },
    ];
    const roadL = S.layer({ par: 1, sh: 1, flat: true });
    const labL = S.layer({ par: 1, sh: 4 });
    const walkL = S.layer({ par: 1, sh: 3 });
    REG.forEach((r, ri) => {
      let d = '';
      for (let i = 0; i < 60; i++) {
        const [x, y] = along(r.path, i / 60), [x2, y2] = along(r.path, (i + 0.5) / 60);
        if (i % 2 === 0) d += c.ribbon([[x, y], [x2, y2]], 2);
      }
      r.road = roadL.add(`<g opacity="0"><path d="${d}" fill="${C.clay}" opacity=".7"/></g>`);
      r.glow = roadL.add(`<g opacity="0"><ellipse cx="${r.path[0][0]}" cy="${r.path[0][1] - 10}" rx="70" ry="44" fill="url(#warm-glow)"/></g>`);
      r.label = labL.add(`<g>${strip(c, r.name, { size: 19 })}<path d="${c.poly(c.circ(0, -13, 3, 8))}" fill="${C.terracotta}"/></g>`);
      r.walkers = [];
      for (let i = 0; i < r.n; i++) {
        const o = crowdPerson(c);
        r.walkers.push({ i, p: S.puppet(walkL.add(person(c, o))), jit: [c.rr(-12, 12), c.rr(-6, 6)], seed: c.rr(0, 9), s: SP * c.rr(0.9, 1.08) });
      }
      r.ri = ri;
    });

    /* ---------- Jesus and the disciples, little paper figures on the map ---------- */
    const heroL = S.layer({ par: 1, sh: 3 });
    const news = [0, 1, 2].map(() => heroL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 100, 100, 0, PI * 2, 48), 3)}" fill="${C.sun}" opacity=".8"/></g>`));
    const halo = heroL.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/></g>`);
    const DIS = [CAST.peter, CAST.andrew, CAST.james, CAST.john].map((o, i) => ({ i, p: S.puppet(heroL.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(heroL.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      const T = time;
      /* Jesus leaves the town with his disciples and walks down to the shore */
      const w = es(t, 0.05, 0.8, ease.sine);
      const from = [690, 262];
      const jx = lerp(from[0], SHORE[0], w), jy = lerp(from[1], SHORE[1], w);
      const turn = es(t, 1.1, 1.2);
      jesus.set({ x: jx, y: jy, s: SP * 1.15, flip: turn > 0.5, walk: w > 0 && w < 1 ? w * 40 : undefined, amt: 0.8, armF: 10 + es(t, 4.5, 4.8) * 60 + bump(t, 1.2, 1.9) * 40, armB: es(t, 4.6, 4.9) * 40, head: -2, blink: blinkAt(T, 2) });
      DIS.forEach((d) => {
        const wd = es(t, 0.1 + d.i * 0.05, 0.85 + d.i * 0.04, ease.sine);
        const ex = SHORE[0] + [16, 30, 22, 36][d.i], ey = SHORE[1] + [-14, -8, 6, 12][d.i];
        const x = lerp(from[0] - 10 - d.i * 12, ex, wd), y = lerp(from[1] - 4 + (d.i % 2) * 8, ey, wd);
        d.p.set({ x, y, s: SP, flip: wd >= 1 && t > 1.1, walk: wd > 0 && wd < 1 ? wd * 40 : undefined, amt: 0.8, armF: es(t, 4.4, 4.8) * 30, blink: blinkAt(T, d.seed) });
      });

      /* regions light up as they are named; the people set out and walk to him */
      REG.forEach((r) => {
        const on = es(t, r.at, r.at + 0.2, ease.back);
        pose(r.label, { x: r.lab[0], y: r.lab[1], s: Math.max(0.01, on) * 1.0, r: -3 + r.ri * 1.3, o: on > 0.01 ? 1 : 0 });
        fade(r.road, es(t, r.at + 0.05, r.at + 0.35) * 0.9);
        fade(r.glow, bump(t, r.at, r.at + 0.9) * 0.9);
        r.walkers.forEach((wk) => {
          const st = r.at + 0.12 + wk.i * 0.05;
          const u = seg(t, st, 4.55 + wk.i * 0.015);
          const endU = 1 - wk.i * 0.07;
          const [x, y, dir] = along(r.path, ease.io(u) * endU);
          const moving = u > 0 && u < 1;
          wk.p.set({
            x: x + wk.jit[0] * (1 - u * 0.7), y: y + wk.jit[1] * (1 - u * 0.7), s: wk.s * (0.2 + 0.8 * es(t, st - 0.08, st + 0.08)), flip: dir < 0,
            o: t > st - 0.1 ? 1 : 0, walk: moving ? u * 60 + wk.seed : undefined, amt: 0.8,
            armF: es(t, 4.55, 4.9) * (wk.i % 2 ? 80 : 40), head: es(t, 4.55, 4.9) * -6,
          });
        });
      });

      /* the news of his deeds spreads out in rings; the whole land comes */
      news.forEach((n, i) => {
        const k = seg(t, 4.0 + i * 0.12, 4.75 + i * 0.12);
        pose(n, { x: SHORE[0] + 20, y: SHORE[1], s: 0.3 + k * 3, sy: 0.8, o: k > 0 && k < 1 ? (1 - k) * 0.9 : 0 });
      });
      pose(halo, { x: jx, y: jy - 16, s: 1 + es(t, 4.4, 4.8) * 0.4, o: 0.35 + es(t, 4.4, 4.8) * 0.5 });

      /* camera: close on the lake, out to the whole land, back to the shore */
      const out = es(t, 0.85, 1.45) * (1 - es(t, 4.35, 4.95));
      const wide = es(t, 2.85, 3.3) * (1 - es(t, 4.35, 4.95));
      S.cam.z = lerp(1.6, 1.02, out) - wide * 0.08;
      S.cam.x = lerp(-38, -10, out) - wide * 0;
      S.cam.y = lerp(-165, -80, out) + wide * 30;
    };
  },
};
