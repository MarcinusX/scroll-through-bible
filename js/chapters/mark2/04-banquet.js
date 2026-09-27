// Mk 2,15–17 — supper in Levi's courtyard with tax collectors and sinners; scribes of the
// Pharisees peer over the wall and grumble to the disciples. "Those who are sick need a physician."
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, town, moon, stars, cypress, olive, bush } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, headAt, townsfolk, scribe, lowTable, bowl, loaf, cup, grapes, fishDish, thought, speech, spark, scrap, plateDisc, physicianKit, GLYPH } from './lib.js';

const PI = Math.PI;
const FLOOR = 700;           // front edge of the courtyard floor where the table stands
const SEAT = 690;            // guests sit on cushions behind the table
const WALL_X = 440;          // the low courtyard wall ends here (the gate)

export default {
  id: 'm2-banquet',
  beats: [
    { v: 15, text: 'Gdy Jezus siedział w jego domu przy stole, wielu celników i grzeszników siedziało razem z Jezusem i Jego uczniami.' },
    { v: 15, cont: true, text: 'Było bowiem wielu, którzy szli za Nim.' },
    { v: 16, text: 'Niektórzy uczeni w Piśmie, spośród faryzeuszów, widząc, że je z grzesznikami i celnikami,' },
    { v: 16, cont: true, text: 'mówili do Jego uczniów: «Czemu On je i pije z celnikami i grzesznikami?»' },
    { v: 17, text: 'Jezus usłyszał to i rzekł do nich: «Nie potrzebują lekarza zdrowi, lecz ci, którzy się źle mają.' },
    { v: 17, cont: true, text: 'Nie przyszedłem powołać sprawiedliwych, ale grzeszników».' },
  ],
  cam: { x: [-140, 40], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const DUSK = [C.duskViolet, C.dusk, C.peach];
    const EVE = [mix(C.indigo, C.duskViolet, 0.4), mix(C.duskViolet, C.dusk, 0.4), mix(C.dusk, C.peach, 0.5)];
    const sk = sky(S, DUSK);
    const hangL = S.layer({ par: 0.04, sh: 3 });
    const starsEl = hangL.add(`<g opacity="0">${stars(c, { x0: -600, x1: 2200, y0: -200, y1: 320, n: 60 })}</g>`);
    const moonEl = hanging(hangL, moon(c, 32), { x: 1180, y: 170, len: 700 });

    /* town on the hill */
    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = band(c, { y: 420, amps: [18, 8, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.3) });
    far.add(h1.markup + town(c, { x: 300, y: h1.fn(300) + 12, n: 7, spread: 360, sc: 0.55, wall: mix(C.plaster, C.duskViolet, 0.2), shadow: mix(C.plaster2, C.duskViolet, 0.3), lit: true }) + town(c, { x: 1400, y: h1.fn(1400) + 12, n: 6, spread: 300, sc: 0.5, wall: mix(C.plaster, C.duskViolet, 0.2), shadow: mix(C.plaster2, C.duskViolet, 0.3), lit: true }));
    far.add(cypress(c, 700, h1.fn(700) + 6, 100, mix(C.moss2, C.duskViolet, 0.3)) + cypress(c, 1060, h1.fn(1060) + 6, 90, mix(C.moss2, C.duskViolet, 0.3)));

    /* Levi's house: the back wall of the courtyard, a vine pergola */
    const house = S.layer({ par: 0.3, sh: 3 });
    const hs = sheet();
    const door = [[1170, 640], [1170, 520], ...c.arc(1215, 520, 45, 42, PI, 2 * PI, 10), [1260, 640]];
    const win = [[700, 520], [700, 470], [760, 470], [760, 520]];
    hs.p(c.cut([[480, 640], [480, 400], [1520, 400], [1520, 640]], 1, 14) + c.hole(door, 0.5, 6), mix(C.plaster, C.dusk, 0.12));
    hs.p(c.cut(win, 0.4, 5), C.lampFlame);
    hs.p(c.ribbon([[696, 522], [764, 522]], 6) + c.ribbon([[730, 470], [730, 520]], 4), C.wood2);
    hs.p(c.ribbon([[1166, 640], [1166, 518]], 8) + c.ribbon([[1264, 640], [1264, 518]], 8) + c.ribbon(c.arc(1215, 520, 50, 47, PI, 2 * PI, 12), 8), C.wood2);
    hs.p(c.cut([[476, 396], [1524, 396], [1524, 408], [476, 408]], 0.4, 10), C.wood2);
    let blot = '';
    for (let i = 0; i < 8; i++) blot += c.cut(c.blob(c.rr(520, 1480), c.rr(430, 610), c.rr(20, 50), c.rr(10, 20), 9, 0.2), 0.6, 5);
    hs.x(blot, mix(C.plaster2, C.dusk, 0.15), 'opacity=".6"');
    house.add(`<rect x="1170" y="470" width="90" height="170" fill="${C.lampGlow}" opacity=".85"/>` + hs.out());
    const court = sheet();
    court.p(c.cut([[-900, 636], [2500, 636], [2500, 1700], [-900, 1700]], 1, 30), mix(C.stone2, C.sand2, 0.5));
    let tiles = '';
    for (let r = 0; r < 6; r++) tiles += c.ribbon([[-900, 650 + r * r * 8 + r * 14], [2500, 650 + r * r * 8 + r * 14 + c.rr(-2, 2)]], 1.4);
    court.x(tiles, shade(C.stone2, -0.12), 'opacity=".5"');
    house.add(court.out());
    // pergola with vines and grapes
    const perg = sheet();
    perg.p(c.cut(c.rect(476, 300, 12, 340), 0.4, 8) + c.cut(c.rect(1136, 300, 12, 340), 0.4, 8), C.wood2);
    perg.p(c.ribbon([[440, 304], [1560, 300]], 10), C.wood);
    let lv = '', lv2 = '', gr = '';
    for (let i = 0; i < 46; i++) {
      const x = c.rr(430, 1560), y = 300 + c.rr(-14, 22);
      const leaf = c.cut(c.star(x, y, c.rr(12, 17), c.rr(7, 10), 5, c.rr(0, 6)), 0.5, 4);
      if (i % 2) lv += leaf; else lv2 += leaf;
      if (i % 6 === 0) { for (let g = 0; g < 7; g++) gr += c.cut(c.circ(x + (g % 3 - 1) * 6, y + 18 + Math.floor(g / 3) * 7, 4.2, 8), 0.2, 2); }
    }
    perg.p(lv2, C.moss).p(lv, C.leaf).p(gr, C.plumRobe);
    house.add(perg.out());

    /* scribes of the Pharisees, outside the low wall */
    const outL = S.layer({ par: 0.42, sh: 4 });
    const PH = [210, 290, 370].map((x, i) => ({ x, i, s: 0.9, seed: c.rr(0, 9), p: S.puppet(outL.add(scribe(c, i))) }));
    PH.forEach((m) => { m.bub = outL.add(`<g>${thought(c, GLYPH.frown(c))}</g>`); });
    const wallL = S.layer({ par: 0.44, sh: 5 });
    const ws = sheet();
    ws.p(c.cut([[-900, 590], [WALL_X, 594], [WALL_X, 1700], [-900, 1700]], 1, 12), mix(C.plaster, C.dusk, 0.1));
    ws.p(c.cut([[-900, 584], [WALL_X + 6, 588], [WALL_X + 6, 598], [-900, 596]], 0.6, 10), C.stone2);
    ws.p(c.cut(c.rect(WALL_X - 4, 560, 24, 1140), 0.5, 8), C.stone);
    let bl = '';
    for (let x = -880; x < WALL_X; x += c.rr(50, 80)) bl += c.ribbon([[x, 604], [x + c.rr(-2, 2), 698]], 1.2);
    bl += c.ribbon([[-900, 648], [WALL_X, 648]], 1.2);
    ws.x(bl, C.plaster2, 'opacity=".8"');
    wallL.add(ws.out());
    const ask = wallL.add(`<g>${speech(c, `<g transform="translate(-9 0)">${GLYPH.q(c)}</g><g transform="translate(12 6) scale(.7)">${cup(c, C.pot)}</g>`, { w: 58, h: 44 })}</g>`);

    /* the table and everyone at it */
    const tabL = S.layer({ par: 0.55, sh: 5 });
    const BACK = [[600, 0.8], [668, 0.82], [736, 0.8], [872, 0.8], [940, 0.82], [1010, 0.8], [1080, 0.78]].map(([x, s], i) => ({ x, s, i, y: 648, from: 1215, d: i * 0.06, seed: c.rr(0, 9), sick: i === 1 || i === 4 || i === 6, p: S.puppet(tabL.add(person(c, townsfolk(c)))) }));
    const TC = (extra) => townsfolk(c, { man: true, mantle: c.pick([C.ochre, C.clayMantle, C.jesusMantle]), ...extra });
    const GUESTS = [
      { x: 548, o: CAST.peter, k: 'peter' },
      { x: 618, o: TC({ robe: C.ochreRobe, belt: C.leather }), sick: true, k: 'tc1' },
      { x: 690, o: townsfolk(c, { hairStyle: 'veil', veil: C.blushVeil, robe: C.roseRobe, beard: 'none' }), sick: true, k: 'w' },
      { x: 910, o: CAST.matthew, k: 'levi' },
      { x: 982, o: TC({ robe: C.tealRobe }), sick: true, k: 'tc2' },
      { x: 1052, o: CAST.john, k: 'john' },
    ].map((g, i) => ({ ...g, i, y: SEAT, s: 0.94, flip: g.x > 800, seed: c.rr(0, 9) }));
    GUESTS.forEach((g) => { if (g.k !== 'levi') g.p = S.puppet(tabL.add(person(c, { ...g.o, pose: 'sit' }))); });
    const leviSit = S.puppet(tabL.add(person(c, { ...CAST.matthew, pose: 'sit' })));
    GUESTS.find((g) => g.k === 'levi').p = leviSit;
    const jesus = S.puppet(tabL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const leviWalk = S.puppet(tabL.add(person(c, { ...CAST.matthew, holdF: `<g transform="translate(22 -6) rotate(-60)">${fishDish(c)}</g>` })));
    // the table with supper on it
    tabL.add(`<g transform="translate(800 ${FLOOR})">${lowTable(c, 600, 46)}</g>`);
    const TOP = FLOOR - 46;
    const food = [
      [530, bowl(c, { food: 'bread', color: C.pot })], [590, loaf(c, 17)], [660, grapes(c)], [720, cup(c)], [760, fishDish(c)],
      [850, bowl(c, { food: 'fruit', color: C.skyVeil })], [890, loaf(c, 15)], [950, cup(c, C.clay)], [1010, bowl(c, { food: 'stew', color: C.pot })], [1070, grapes(c, 4.4)],
    ].map(([x, m]) => `<g transform="translate(${x} ${TOP + 2})">${m}</g>`).join('');
    tabL.add(food);
    const lamps = [640, 980].map((x) => { const el = tabL.add(`<g>${oilLamp(c)}</g>`); return { el, x, fl: el.querySelector('.flame'), gl: el.querySelector('.glow') }; });
    const raised = GUESTS.filter((g) => g.sick).map((g) => ({ g, el: tabL.add(`<g>${cup(c, C.clay)}</g>`) }));

    /* the sickness they carry, the physician, the light */
    const fx = S.layer({ par: 0.58, sh: 5 });
    const sickOnes = [...GUESTS.filter((g) => g.sick), ...BACK.filter((b) => b.sick)];
    const scraps = [];
    sickOnes.forEach((g, gi) => {
      for (let j = 0; j < 2; j++) scraps.push({ g, j, gi, el: fx.add(`<g>${scrap(c, c.rr(8, 11))}</g>`), sp: fx.add(`<g>${spark(c, 8)}</g>`), dx: c.rr(-10, 10), dy: c.rr(40, 80), r: c.rr(0, 360), drift: c.rr(-40, 40) });
    });
    const plate = hanging(fx, `${plateDisc(c, 58, C.cream, C.teal2)}<g transform="translate(-18 52) scale(1.1)">${physicianKit(c)}</g>`, { x: 800, y: 330, len: 700 });
    const halo = fx.add(`<g opacity="0"><circle r="260" fill="url(#halo-glow)"/></g>`);

    /* foreground */
    const fg = S.layer({ par: 0.9, sh: 6 });
    const pot = (x, y, s) => sheet().p(c.cut([[x - 30 * s, y], [x - 40 * s, y - 50 * s], [x - 34 * s, y - 70 * s], [x + 34 * s, y - 70 * s], [x + 40 * s, y - 50 * s], [x + 30 * s, y]], 0.6, 6), C.pot).x(c.ribbon([[x - 38 * s, y - 50 * s], [x + 38 * s, y - 50 * s]], 3 * s), shade(C.pot, -0.2)).out() + bush(c, x, y - 64 * s, 110 * s, C.moss, C.leaf);
    fg.add(pot(170, 900, 1.6) + pot(1450, 910, 1.8));

    return (t, time) => {
      const T = time;
      sk.blend(DUSK, EVE, es(t, 0, 6, ease.sine));
      fade(starsEl, es(t, 1, 6) * 0.9);
      pose(moonEl, { x: 1180, y: 190 - es(t, -0.5, 6.5) * 50, r: Math.sin(T * 0.6) * 1.2 });
      lamps.forEach((l, i) => {
        pose(l.el, { x: l.x, y: TOP + 2, s: 0.8 });
        pose(l.fl, { x: 35, y: -16, sx: 1 + Math.sin(T * 7 + i) * 0.08, sy: 1 + Math.sin(T * 5.3 + i) * 0.1 });
        fade(l.gl, 0.6 + es(t, 0, 3) * 0.3);
      });

      /* v15 — Levi brings the dish and sits; guests settle; many more come in */
      const lKeys = [[-0.3, 1320], [0.55, 930], [0.62, 910]];
      const lx = kf(t, lKeys);
      const sit = es(t, 0.62, 0.68);
      leviWalk.set({ x: lx, y: SEAT - 10, s: 0.94, flip: true, o: 1 - sit, walk: moving(t, lKeys) ? lx * 0.05 : undefined, armF: 70, armB: 10, blink: blinkAt(T, 3) });
      const hearing = es(t, 3.1, 3.4);
      const toPh = es(t, 4.02, 4.3);
      const call = es(t, 5.02, 5.3);
      jesus.set({
        x: 800, y: SEAT + 4, s: 1.04, flip: toPh > 0.5 && call < 0.5,
        armF: 30 + bump(t, 0.1, 0.9) * 40 + toPh * (1 - call) * 60 + call * 100, armB: 20 + call * 110 + toPh * (1 - call) * 30,
        head: -hearing * 4 * (1 - toPh) - call * 8, blink: blinkAt(T),
      });
      fade(halo, call * 0.7);
      pose(halo, { x: 800, y: 560, s: 0.6 + call * 0.5 });
      GUESTS.forEach((g) => {
        if (g.k === 'levi') {
          g.p.set({ x: g.x, y: g.y, s: g.s, flip: true, o: sit, armF: 40 + call * 40, head: -2, blink: blinkAt(T, g.seed) });
          return;
        }
        const talk = g.k === 'peter' ? es(t, 3.05, 3.25) * (1 - es(t, 4.1, 4.4)) : 0;
        const joy = g.sick ? es(t, 5.3, 5.6) : 0;
        const come = g.sick ? es(t, 0.15 + g.i * 0.08, 0.4 + g.i * 0.08, ease.out) : 1;
        g.p.set({
          x: g.x, y: g.y - (1 - come) * 40, s: g.s, o: come, flip: talk > 0.5 ? true : g.flip,
          armF: 40 + Math.sin(T * 1.3 + g.seed) * 3 * (1 - talk) + talk * 30 + joy * 90, armB: 20 + joy * 40,
          head: -talk * 6 + joy * -8 + bump(t, 2.1, 2.9) * (g.x < 800 ? -6 : 0), blink: blinkAt(T, g.seed),
        });
      });
      raised.forEach((r, i) => {
        const up = es(t, 5.35 + i * 0.05, 5.6 + i * 0.05, ease.back);
        const [hx, hy] = headAt(r.g.x, r.g.y, r.g.s, r.g.flip, 62);
        pose(r.el, { x: lerp(r.g.x + (r.g.flip ? -30 : 30), hx + (r.g.flip ? -36 : 36), up), y: lerp(TOP + 2, hy - 20, up), r: up * (r.g.flip ? 10 : -10), o: up > 0.01 ? 1 : 0 });
      });
      BACK.forEach((b) => {
        const pr = seg(t, 1.0 + b.d, 1.5 + b.d);
        const x = lerp(b.from, b.x, ease.out(pr));
        const joy = b.sick ? es(t, 5.3, 5.6) : es(t, 5.4, 5.7) * 0.5;
        b.p.set({ x, y: b.y, s: b.s, flip: pr < 1 ? true : b.x > 800, o: seg(t, 0.98 + b.d, 1.06 + b.d), walk: pr > 0 && pr < 1 ? x * 0.05 : undefined, armF: joy * 120, armB: joy * 60, head: -joy * 8, blink: blinkAt(T, b.seed) });
      });

      /* v16 — scribes peer over the wall and grumble to the disciples */
      const up = es(t, 2.0, 2.35);
      const shrink = es(t, 5.3, 5.7);
      PH.forEach((m) => {
        const peek = es(t, 2.0 + m.i * 0.08, 2.35 + m.i * 0.08) * (1 - shrink * 0.8);
        const y = lerp(760, 652, peek);
        const speak = m.i === 2 ? bump(t, 3.05, 4.1) : 0;
        m.p.set({ x: m.x, y, s: m.s, flip: false, armF: speak * 80 + peek * 20, armB: m.i === 1 ? bump(t, 2.3, 3.9) * 60 : 0, head: -speak * 4 + (m.i === 0 ? 6 : 0) * peek, lean: speak * 8 + 4 * peek, blink: blinkAt(T, m.seed) });
        const [hx, hy] = headAt(m.x, y, m.s, false);
        const b = es(t, 2.3 + m.i * 0.1, 2.55 + m.i * 0.1, ease.back) * (1 - es(t, 2.95, 3.1));
        pose(m.bub, { x: hx + 6, y: hy - 26, s: b * 0.95, o: b > 0.01 ? 1 : 0 });
      });
      const a = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 4.0, 4.15));
      const [ahx, ahy] = headAt(370, 652, 0.9, false);
      pose(ask, { x: ahx + 26, y: ahy - 4, s: a, o: a > 0.01 ? 1 : 0 });

      /* v17 — the physician; the sinners' burdens lifted into light */
      const pIn = es(t, 4.1, 4.5, ease.out) * (1 - es(t, 5.3, 5.7));
      pose(plate, { x: lerp(800, 760, es(t, 4.5, 5)), y: lerp(-150, 330, pIn), r: Math.sin(T * 0.9) * 2, o: pIn > 0.01 ? 1 : 0 });
      scraps.forEach((s) => {
        const [hx, hy] = headAt(s.g.x, s.g.y, s.g.s, s.g.flip, s.g.y === SEAT ? 62 : 0);
        const bx = hx + s.dx, by = hy + s.dy * s.g.s * 0.8;
        const lift = es(t, 5.1 + s.gi * 0.05 + s.j * 0.05, 5.5 + s.gi * 0.05 + s.j * 0.05);
        const gold = seg(t, 5.3 + s.gi * 0.05, 5.5 + s.gi * 0.05);
        const x = bx + s.drift * lift, y = by - lift * 170;
        const show = seg(t, 0.4 + s.gi * 0.08, 0.6 + s.gi * 0.08);
        const throb = 1 + bump(t, 4.3, 5.0) * 0.25 * Math.max(0, Math.sin(T * 4 + s.gi));
        pose(s.el, { x, y, r: s.r + lift * 160, s: show * (1 - gold * 0.7) * throb, o: show * (1 - gold) });
        pose(s.sp, { x, y, s: gold * (1 - seg(t, 5.6, 5.95)), r: T * 40, o: gold > 0.01 ? 1 : 0 });
      });

      /* camera */
      S.cam.x = kf(t, [[0, 20], [1.8, 20], [2.2, -110], [4.0, -110], [4.4, -30], [5.1, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [1.0, 1.06], [1.8, 1.0], [2.2, 1.1], [4.0, 1.1], [4.4, 1.04], [5.1, 1.04], [5.7, 1.0]]);
      S.cam.y = kf(t, [[-0.5, 0], [1.0, 20], [2.2, 10], [4.4, -20], [5.1, 10]]);
    };
  },
};
