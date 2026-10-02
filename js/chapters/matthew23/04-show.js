// Mt 23,5–7 — a painted flat, gently comic. A street corner: the Pharisee climbs a stone block in a shaft of sunlight
// and lifts his arms in a loud prayer while the scribe holds his coin up high over a beggar's bowl before he drops it —
// "everything they do, they do to be seen". Stepping down, the Pharisee parades: the box on his forehead swells and
// swells and the fringes of his mantle grow until they trail along the street behind him. The flat flies away and
// another comes down: a feast, where he settles on the cushioned couch at the head of the table, and next door a
// synagogue, where the scribe climbs into the highest of the first chairs. Then the market again: people bow low as
// the two stroll past, "Rabbi! Rabbi!", and they glow with pleasure.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, mix } from '../kit.js';
import { sun, cloud, grass } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, parts, PH, SC, folk, streetFlat, roomFlat, honourCouch, arkNiche, firstChairs, stall, garland, lowTable, bowl, cup, coin, sparkle, bubble, tr } from './lib.js';
import { secretShaft } from '../matthew6/lib.js';

const GY = 650;
const COUCH = 540;

export default {
  id: 'mt23-show',
  enter: 'fly',
  beats: [
    { v: 5, text: 'Wszystkie swe uczynki spełniają w tym celu, żeby się ludziom pokazać.' },
    { v: 5, cont: true, text: 'Rozszerzają swoje filakterie i wydłużają frędzle u płaszczów.' },
    { v: 6 },
    { v: 7 },
  ],
  cam: { x: [-30, 30], y: [-30, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the feast is laid a little tighter and the synagogue's first chairs come in from under the progress
    // thread; in the market the people who bow and their "Rabbi!" stand inside the screen
    const PH_ = S.portrait;
    const CHAIRS = PH_ ? 1000 : 1090;
    sky(S, ['#cfe0da', '#f0e7cd', '#f7e6c8']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1230, y: 140, len: 700 });
    const cl = hanging(hangL, cloud(c, 160), { x: 520, y: 150, len: 700 });

    /* flat A: the street (with its market stalls for v7) */
    const A = S.layer({ par: 0.25, sh: 3, pad: 170 });
    A.add(streetFlat(c, { gy: GY - 30 }));
    A.add(sheet().p(c.cut([[-900, GY - 34], [2500, GY - 36], [2500, 1700], [-900, 1700]], 1, 16), mix(C.sand, C.stone, 0.3)).out() + grass(c, { x0: -700, x1: 2300, y: GY - 32, n: 16, h: 9, color: C.olive }));
    const M = S.layer({ par: 0.25, sh: 4, pad: 170 });
    M.add(`<g><g transform="translate(380 ${GY - 20})">${stall(c, 180)}</g><g transform="translate(1260 ${GY - 22})">${stall(c, 160)}</g></g>`);
    /* flat B: the feast and the synagogue */
    const B = S.layer({ par: 0.25, sh: 3, pad: 170 });
    B.add(roomFlat(c, { gy: GY - 30, mid: 800 }));
    B.add(`<g><g transform="translate(${PH_ ? 430 : 380} 300)">${garland(c, 420, 40)}</g><g transform="translate(${COUCH} ${GY - 22})">${honourCouch(c)}</g><g transform="translate(${PH_ ? 1120 : 1260} ${GY - 30})">${arkNiche(c)}</g><g transform="translate(${CHAIRS} ${GY - 24})">${firstChairs(c)}</g></g>`);

    /* the people */
    const P = S.layer({ par: 0.45, sh: 5 });
    const block = P.add(`<g>${sheet().p(c.cut([[-56, 0], [-50, -40], [52, -42], [58, 0]], 0.8, 6), mix(C.stone2, C.rock2, 0.4)).out()}</g>`);
    const shaft = P.add(`<g>${secretShaft(c, { w0: 40, w1: 190, h: 1200 })}</g>`);
    const LOOKERS = [[450, 0.9], [560, 0.94], [1180, 0.92], [1290, 0.9]].map(([x, s], i) => ({ x, s, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, folk(c, i % 2 === 0)))) }));
    const beggar = S.puppet(P.add(person(c, { robe: C.stone2, hair: C.hair3, hairStyle: 'wild', beard: 'short', skin: C.skin4, pose: 'sit' })));
    const bowlEl = P.add(`<g>${bowl(c, { w: 30, food: null })}</g>`);
    const guests = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(person(c, { ...folk(c, i !== 1), pose: 'sit' }))) }));
    const table = P.add(`<g>${lowTable(c, 300, 40)}<g transform="translate(-70 -40)">${bowl(c, { w: 30, food: 'fruit' })}</g><g transform="translate(10 -40)">${cup(c)}</g><g transform="translate(70 -40)">${bowl(c, { w: 26, food: 'bread' })}</g></g>`);
    const cong = [0, 1].map((i) => ({ i, p: S.puppet(P.add(person(c, { ...folk(c, i === 0), pose: 'sit' }))) }));
    const PHs = S.puppet(P.add(vain(c, PH)));
    const PHsit = S.puppet(P.add(vain(c, PH, { pose: 'sit' })));
    const SCs = S.puppet(P.add(vain(c, SC, { holdB: `<g transform="translate(0 6)">${coin(c, 7)}</g>` })));
    const SCsit = S.puppet(P.add(vain(c, SC, { pose: 'sit' })));
    const grow = [PHs, PHsit, SCs, SCsit].map((p) => parts(p.el));
    const fx = S.layer({ par: 0.45, sh: 4 });
    const drop = fx.add(`<g>${coin(c, 7)}</g>`);
    const rabbi = fx.add(`<g>${bubble(c, tr('Rabbi! Rabbi!', 'Rabbi! Rabbi!'), { size: 20, tail: 1 })}</g>`);
    const rabbi2 = fx.add(`<g>${bubble(c, tr('Witaj, Rabbi!', 'Hail, Rabbi!'), { size: 18, tail: -1 })}</g>`);
    const glints = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 11)}</g>`) }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl, 520 + (T ? Math.sin(T * 0.1) * 20 : 0), 150, T, 1.2, 0.7, 1);

      /* which flat is down */
      const toB = es(t, 2.0, 2.18), toA = es(t, 3.0, 3.18);
      const bK = toB * (1 - toA), aK = 1 - bK;
      A.fade(aK); A.shift(0, -(1 - aK) * 150);
      B.fade(bK); B.shift(0, (1 - bK) * -150 * (t < 2.5 ? 1 : -1));
      M.fade(toA); M.shift(0, -(1 - toA) * 150);
      const street = aK > 0.5, market = toA > 0.5;

      /* v5a — on the block in a shaft of light, arms up; the scribe shows his coin, then drops it */
      const walkIn = es(t, -0.2, 0.18);
      const up = es(t, 0.18, 0.28) * (1 - es(t, 1.02, 1.12));
      const pray = es(t, 0.28, 0.45) * (1 - es(t, 1.0, 1.1));
      /* v5b — he steps down and parades, the phylactery swelling, the fringes trailing */
      const parade = es(t, 1.08, 1.7);
      const phylK = es(t, 1.1, 1.5), fringeK = es(t, 1.15, 1.75);
      let px = lerp(lerp(600, 780, walkIn), 960, parade);
      /* v6 — to the couch of honour; v7 — strolling through the market */
      const toCouch = es(t, 2.15, 2.4), sitC = es(t, 2.4, 2.46) * (1 - es(t, 3.0, 3.05));
      if (t > 2) px = lerp(700, COUCH + 10, toCouch);
      const stroll = es(t, 3.05, 3.7);
      if (t > 3) px = lerp(1090, 820, stroll);
      const walking = (walkIn > 0 && walkIn < 1) || (parade > 0.02 && parade < 0.98) || (toCouch > 0.02 && toCouch < 0.98) || (stroll > 0.02 && stroll < 0.98);
      const pleased = bump(t, 3.35, 4.2);
      PHs.set({
        x: px, y: GY - up * 40, s: 0.98, walk: walking ? px * 0.05 : undefined, flip: t > 2,
        armB: 20 + pray * 150, armF: 20 + pray * 78 + parade * 10 * (1 - toB), head: -pray * 16 - (parade * (1 - toB) + pleased) * 12 + (T ? Math.sin(T * 3) * 4 * pray : 0),
        lean: -pray * 4 - pleased * 4, o: (street ? 1 : 1 - sitC) * (t > 2 && t < 2.1 ? 0 : 1), blink: blinkAt(T, 1),
      });
      PHsit.set({ x: COUCH + 10, y: GY - 76, s: 0.94, armF: 40, armB: 30, head: -14, lean: -5, o: sitC, blink: blinkAt(T, 1) });
      pose(block, { x: 780, y: GY + 2, o: street && t < 2 ? 1 : 0 });
      const sh = es(t, 0.25, 0.5) * (1 - es(t, 1.0, 1.3));
      pose(shaft, { x: 780, y: GY - 20, o: sh });

      const show = es(t, 0.1, 0.3) * (1 - es(t, 0.6, 0.66));
      const toChair = es(t, 2.2, 2.44), sitS = es(t, 2.44, 2.5) * (1 - es(t, 3.0, 3.05));
      let sx = 1000;
      if (t > 1) sx = lerp(1000, 1080, es(t, 1.2, 1.7));
      if (t > 2) sx = lerp(900, CHAIRS + 70, toChair);
      if (t > 3) sx = lerp(1190, 940, stroll);
      const sWalk = (t > 1.2 && t < 1.7) || (toChair > 0.02 && toChair < 0.98) || (stroll > 0.02 && stroll < 0.98);
      SCs.set({ x: sx, y: GY + 4, s: 0.96, flip: t > 3, walk: sWalk ? sx * 0.05 + 1 : undefined, armB: 30 + show * 130, armF: 20, head: -show * 10 - pleased * 12 - 6, lean: -pleased * 4, o: t > 2 && t < 2.1 ? 0 : 1 - sitS, blink: blinkAt(T, 3) });
      SCsit.set({ x: CHAIRS + 70, y: GY - 80, s: 0.9, flip: true, armF: 30, armB: 20, head: -14, lean: -5, o: sitS, blink: blinkAt(T, 3) });
      const dk = seg(t, 0.62, 0.74);
      pose(drop, { x: 1052 + dk * 20, y: lerp(GY - 236, GY - 18, dk * dk), r: dk * 200, o: dk > 0 && dk < 1 ? 1 : 0 });
      beggar.set({ x: 1090, y: GY + 10, s: 0.84, flip: true, armF: 50 + bump(t, 0.7, 0.95) * 20, armB: 10, head: 6, o: street && t < 2 ? 1 : 0, blink: blinkAt(T, 6) });
      pose(bowlEl, { x: 1062, y: GY + 10, o: street && t < 2 ? 1 : 0 });

      grow.forEach((g) => {
        pose(g.phyl, { s: 1 + phylK * 1.5 });
        pose(g.fringe, { sx: fringeK, sy: 1 });
      });

      /* the passers-by: stare in v5, bow in v7 */
      LOOKERS.forEach((m) => {
        const stare = es(t, 0.3 + m.i * 0.05, 0.5 + m.i * 0.05) * (1 - toB);
        const bow = bump(t, 3.3 + m.i * 0.08, 3.98);
        const mx = PH_ ? (t > 2.5 ? [480, 580, 1005, 1060][m.i] : m.i > 1 ? m.x + 60 : m.x) : m.x;
        m.p.set({ x: mx, y: GY + 10 + (m.i % 2) * 8, s: m.s, flip: mx > 800, head: -stare * 8 + bow * 18 + bump(t, 1.2, 1.9) * 6, lean: bow * 24 - bump(t, 1.2, 1.9) * 4, armF: bow * 40 + (m.i === 1 ? stare * 60 * (1 - es(t, 0.9, 1.1)) : 0), armB: bow * 30, o: street ? 1 : 0, blink: blinkAt(T, m.seed) });
      });
      /* the feast and the synagogue */
      guests.forEach((g) => g.p.set({ x: PH_ ? 655 + g.i * 58 : 700 + g.i * 70, y: GY - 6, s: 0.78, flip: true, armF: 40, head: -bump(t, 2.4, 2.95) * 10, o: bK, blink: blinkAt(T, g.i + 4) }));
      pose(table, { x: PH_ ? 705 : 740, y: GY + 12, ...(PH_ ? { sx: 0.84, sy: 1 } : {}), o: bK });
      cong.forEach((g) => g.p.set({ x: PH_ ? 862 + g.i * 52 : 900 + g.i * 70, y: GY + 2, s: 0.8, armF: 20, head: -8, o: bK, blink: blinkAt(T, g.i + 7) }));

      /* v7 — "Rabbi!" */
      const r1 = es(t, 3.32, 3.48, ease.back) * (1 - es(t, 3.92, 4.0));
      pose(rabbi, { x: PH_ ? 1020 : 1150, y: GY - 200, s: r1, o: r1 > 0.02 ? 1 : 0 });
      const r2 = es(t, 3.45, 3.6, ease.back) * (1 - es(t, 3.92, 4.0));
      pose(rabbi2, { x: PH_ ? 595 : 540, y: GY - 195, s: r2, o: r2 > 0.02 ? 1 : 0 });
      glints.forEach((g) => {
        const k = T ? (T * 0.6 + g.i / 6) % 1 : 0.5;
        const who = g.i % 2 ? [px, GY - 200] : [sx, GY - 200];
        pose(g.el, { x: who[0] + Math.cos(g.i * 2.1) * 50, y: who[1] - k * 40 + (g.i % 3) * 16, s: 0.7, o: pleased * Math.sin(k * Math.PI) });
      });

      S.cam.x = lerp(0, 20, es(t, 0.8, 1.4)) * (1 - toB) + toA * 0;
      S.cam.z = 1.03 + es(t, 1.0, 1.4) * 0.03 * (1 - toB);
      S.cam.y = -10;
    };
  },
};
