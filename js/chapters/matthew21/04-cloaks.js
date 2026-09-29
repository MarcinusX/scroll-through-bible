// Mt 21,7b–8 — on the road over the Mount of Olives: the disciples throw their cloaks over the she-donkey and the
// colt, and Jesus sits on them. A very great crowd gathers on the slope and spreads its cloaks on the road; others
// cut branches from the trees and strew them in the way.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, palm, cypress, grass, bush, rock, flowers } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { jerusalem, colt, jenny, coltRig, saddleCloaks, riderLeg, TWO, roadCloak, flyingCloak, roadBranch, frond, oliveBranch, sparkle, townsfolk, pose3, folk4, TWELVE_O, DAY, PI } from './lib.js';

const ROAD = 652;
const JX = 760;               // Jesus stands / rides here

export default {
  id: 'mt21-cloaks',
  beats: [
    { v: 7, cont: true, text: 'i położyli na nie swe płaszcze, a On usiadł na nich.' },
    { v: 8, text: 'A ogromny tłum słał swe płaszcze na drodze,' },
    { v: 8, cont: true, text: 'inni obcinali gałązki z drzew i ścielili na drodze.' },
  ],
  cam: { x: [-40, 120], y: [-40, 60], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 480, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 1000, y: 110, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 190, speed: 36, scale: 0.42 });

    /* ---------- Jerusalem ahead, across the valley ---------- */
    const cityL = S.layer({ par: 0.1, sh: 3 });
    cityL.add(band(c, { y: 410, amps: [10, 5, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup);
    cityL.add(`<g transform="translate(1080 400)">${jerusalem(c, 0.46)}</g>`);
    const valL = S.layer({ par: 0.16, sh: 3 });
    const vb = hillsWith(c, { y: 448, amps: [12, 6, 2], lens: [800, 300, 120], color: mix(C.hillMid, C.sage, 0.35), trees: 30, treeColor: mix(C.olive, C.moss, 0.3), treeH: 16, x0: -1400, x1: 3000 });
    valL.add(vb.markup);

    /* ---------- the slope: the great crowd gathering (sprites), trees whose branches are cut ---------- */
    const fieldL = S.layer({ par: 0.3, sh: 3 });
    const fb = hillsWith(c, { y: 560, amps: [12, 6, 2], lens: [900, 320, 120], color: C.hillMid, x0: -1400, x1: 3000 });
    fieldL.add(fb.markup);
    let rows = '';
    for (let i = 0; i < 4; i++) { const y = 572 + i * 14; rows += c.ribbon([[-1400, y], [3000, y + c.rr(-3, 3)]], 1.8); }
    fieldL.add(`<path d="${rows}" fill="${shade(C.hillMid, -0.1)}" opacity=".5"/>`);
    const TREES = [[400, 'olive'], [560, 'palm'], [1040, 'palm'], [1200, 'olive'], [1360, 'palm'], [250, 'palm']];
    TREES.forEach(([x, k]) => fieldL.add(k === 'palm' ? palm(c, x, fb.fn(x) + 8, 190) : olive(c, x, fb.fn(x) + 8, 0.85)));
    fieldL.add(cypress(c, 900, fb.fn(900) + 6, 120) + cypress(c, 700, fb.fn(700) + 6, 90));
    // "a very great multitude": groups of people come over the brow of the hill (drawn once, moved on the compositor)
    const throngs = [[140, 0.5], [320, 0.48], [480, 0.5], [640, 0.47], [880, 0.5], [1110, 0.48], [1280, 0.5], [1460, 0.47]].map(([x, s], i) => {
      const mem = Array.from({ length: 5 }, (_, k) => ({ x: (k - 2) * 30 + c.rr(-6, 6), y: c.rr(-6, 6) + (k % 2) * 8, s: 1, flip: x > JX, head: c.rr(-6, 4), armF: c.rr(0, 30), armB: k % 2 ? c.rr(90, 150) : 0, o: folk4(c) }));
      const y = fb.fn(x) + 26;
      return { i, x, y, sp: fieldL.sprite(`<g transform="scale(${s})">${pose3(c, mem)}</g>`, x, y) };
    });
    // the cutters in the trees, and the branches they cut
    const cutters = [[430, 0], [590, 1], [1010, 2], [1230, 3], [1330, 4]].map(([x, i]) => ({ x, i, y: fb.fn(x) + 14, seed: c.rr(0, 9), p: S.puppet(fieldL.add(person(c, townsfolk(c, { man: i % 2 === 0, holdB: `<g transform="rotate(-20)">${i % 2 ? oliveBranch(c, 60) : frond(c, 70)}</g>` })))) }));
    cutters.forEach((m) => { m.hold = m.p.el.querySelector('.armBr .hold'); });

    /* ---------- the road ---------- */
    const roadL = S.layer({ par: 0.5, sh: 4 });
    const rfn = c.wave(604, [5, 2], [800, 200]);
    const rs = sheet();
    rs.p(c.ridge(rfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4));
    rs.p(c.cut([[-1400, 624], [0, 620], [800, 624], [1600, 616], [3000, 610], [3000, 704], [1600, 708], [800, 712], [0, 710], [-1400, 714]], 1.4, 14), mix(C.sand, C.sand2, 0.35));
    roadL.add(rs.out());
    roadL.add(grass(c, { x0: -800, x1: 2400, y: 610, fn: (x) => rfn(x) + 14, n: 34, h: 13, color: C.olive }) + flowers(c, { x0: -300, x1: 2000, y: 612, fn: (x) => rfn(x) + 16, n: 20 }) + grass(c, { x0: -800, x1: 2400, y: 740, n: 40, h: 16, color: C.moss }));
    // cloaks and branches that land on the road
    const carpetL = S.layer({ par: 0.5, sh: 2 });
    const CLOAK_COLS = [C.dustyBlue, C.roseRobe, C.wheatRobe, C.tealRobe, C.mauve, C.clayMantle, C.sageRobe, C.ochreRobe, C.plumRobe, C.skyVeil, C.roseRobe];
    const carpet = Array.from({ length: 11 }, (_, i) => {
      const x = 880 + i * 84 + c.rr(-10, 10), y = ROAD + 12 + c.rr(-8, 8);
      return { i, x, y, r: c.rr(-8, 8), lie: carpetL.add(`<g>${roadCloak(c, CLOAK_COLS[i], 118)}</g>`), fly: carpetL.add(`<g>${flyingCloak(c, CLOAK_COLS[i], 90)}</g>`) };
    });
    const brs = Array.from({ length: 14 }, (_, i) => {
      const src = cutters[i % cutters.length];
      return { i, src, x: 860 + i * 64 + c.rr(-20, 20), y: ROAD + 12 + c.rr(-14, 10), r: c.rr(-30, 30), el: carpetL.add(`<g>${roadBranch(c, c.rr(60, 80), i % 3 ? 'palm' : 'olive')}</g>`) };
    });

    /* ---------- people along the road who spread their cloaks ---------- */
    const crowdL = S.layer({ par: 0.5, sh: 4 });
    const spreaders = [[1070, -36], [1170, -40], [1270, -34], [1370, -38], [1470, -36], [1570, -40]].map(([x, dy], i) => {
      const o = townsfolk(c, { man: i % 2 === 0 });
      return { x, y: ROAD + dy, i, seed: c.rr(0, 9), pM: S.puppet(crowdL.add(person(c, { ...o, mantle: CLOAK_COLS[i + 2] }))), p0: S.puppet(crowdL.add(person(c, { ...o, mantle: null }))) };
    });

    /* ---------- the disciples, Jesus, the she-donkey and the colt ---------- */
    const jenL = S.layer({ par: 0.49, sh: 5 });
    const jEl = jenL.add(jenny(c, { over: `<g data-k="jsaddle">${saddleCloaks(c, [TWELVE_O[5].mantle, TWELVE_O[8].mantle])}</g>` }));
    const jRig = coltRig(jEl);
    const jSaddle = S.$('jsaddle');
    const L = S.layer({ par: 0.5, sh: 5 });
    const back = [{ o: CAST.thomas, x: 400, y: ROAD - 14, s: 0.88 }, { o: CAST.matthew, x: 460, y: ROAD - 16, s: 0.88 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    // Peter and James take off their cloaks (two cut-outs each, swapped as the cloak flies)
    const throwers = [{ o: CAST.peter, x: 520, col: CAST.peter.mantle }, { o: CAST.james, x: 580, col: CAST.james.mantle }, { o: TWELVE_O[5], x: 1150, col: TWELVE_O[5].mantle, flip: true }, { o: TWELVE_O[8], x: 1210, col: TWELVE_O[8].mantle, flip: true }]
      .map((d, i) => ({ ...d, i, seed: c.rr(0, 9), pM: S.puppet(L.add(person(c, d.o))), p0: S.puppet(L.add(person(c, { ...d.o, mantle: null }))), fly: L.add(`<g>${flyingCloak(c, d.col, 80)}</g>`) }));
    const jStand = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const coltEl = L.add(colt(c, {
      over: `<g data-k="saddle">${saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle])}</g>`,
      rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g><g data-k="rleg">${riderLeg(c)}</g>`,
    }));
    const cRig = coltRig(coltEl);
    const saddle = S.$('saddle'), riderG = S.$('rider'), rleg = S.$('rleg');
    const jRide = S.puppet(riderG.firstElementChild);
    const glow = L.add(`<g>${sparkle(c, 14)}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(olive(c, 90, 920, 1.4) + bush(c, 1380, 900, 220, C.sage, C.moss) + rock(c, 300, 905, 160, 60, C.rock2) + palm(c, 1560, 930, 360));

    return (t, time) => {
      const T = time;
      swing(sunEl, 480, 130, T, 1, 0.7);
      swing(cl1, 1000 + Math.sin(T * 0.1) * 26, 110, T, 1.3, 0.6, 1);
      birds(T, 1);

      /* v7b — the cloaks thrown on both; He sits on the colt */
      const mount = es(t, 0.55, 0.62);
      const ride = es(t, 1.2, 2.9);
      const cx = JX + 10 + ride * 60;
      cRig.set({ x: cx, y: ROAD + 6, s: 1, walk: ride > 0 && ride < 1 ? cx * 0.06 : undefined, nod: Math.sin(T * 0.8) * 1.5, ear: Math.sin(T * 1.3) * 7 + bump(t, 0.3, 0.6) * 16, tail: Math.sin(T * 1.7) * 8 });
      const jx0 = cx + 220;
      jRig.set({ x: jx0, y: ROAD - 18, s: 1.04, walk: ride > 0 && ride < 1 ? jx0 * 0.06 + 1 : undefined, nod: Math.sin(T * 0.7 + 1) * 1.5, ear: Math.sin(T * 1.1) * 6, tail: Math.sin(T * 1.5 + 1) * 8 });
      Array.from(saddle.querySelectorAll('.cl')).forEach((el, i) => fade(el, es(t, 0.28 + i * 0.08, 0.34 + i * 0.08)));
      Array.from(jSaddle.querySelectorAll('.cl')).forEach((el, i) => fade(el, es(t, 0.34 + i * 0.08, 0.4 + i * 0.08)));
      fade(riderG, mount); fade(rleg, mount);
      jRide.set({ x: 0, y: 0, s: 1, armF: 20 + es(t, 0.7, 1.0) * 30 + bump(t, 1.2, 2.2) * 40, armB: 10 + es(t, 2.2, 2.7) * 60, head: -4 + bump(t, 1.2, 2.2) * 6, blink: blinkAt(T) });
      jStand.set({ x: JX - 100, y: ROAD, s: 1.0, o: 1 - mount, armF: es(t, 0.4, 0.55) * 50, armB: es(t, 0.45, 0.55) * 30, head: bump(t, 0.05, 0.4) * 6, blink: blinkAt(T) });
      pose(glow, { x: JX + 10, y: ROAD - 250, s: bump(t, 0.58, 0.95) * 1.4 + 0.001, r: t * 80, o: bump(t, 0.58, 0.95) });

      back.forEach((d) => d.p.set({ x: d.x, y: d.y, s: d.s, flip: false, armF: bump(t, 0.6, 1.0) * 50 + es(t, 2.2, 2.6) * (d.i === 1 ? 110 : 0), head: -es(t, 0.6, 0.9) * 6, blink: blinkAt(T, d.seed) }));
      throwers.forEach((d) => {
        const k = seg(t, 0.05 + d.i * 0.06, 0.32 + d.i * 0.06);
        const off = k > 0.02;
        const dir = d.flip ? -1 : 1;
        d.pM.set({ x: d.x, y: ROAD + 2 - (d.i % 2) * 8, s: 0.95 - (d.i % 2) * 0.03, flip: !!d.flip, o: off ? 0 : 1, blink: blinkAt(T, d.seed) });
        d.p0.set({ x: d.x, y: ROAD + 2 - (d.i % 2) * 8, s: 0.95 - (d.i % 2) * 0.03, flip: !!d.flip, o: off ? 1 : 0, armF: bump(t, 0.05 + d.i * 0.06, 0.45) * 120 + bump(t, 0.7, 1.0) * 40, armB: bump(t, 0.05 + d.i * 0.06, 0.45) * 90, head: -bump(t, 0.1, 0.4) * 6, blink: blinkAt(T, d.seed) });
        // the cloak flies from the shoulders to the animal's back
        const bx = d.i < 2 ? JX + 10 + (d.i - 0.5) * 16 : JX + 230 + (d.i - 2.5) * 16, by = ROAD - 96;
        const x = lerp(d.x, bx, k), y = lerp(ROAD - 130, by, k) - Math.sin(k * PI) * 80;
        pose(d.fly, { x, y, r: dir * (-20 + k * 30), s: 0.8 + Math.sin(k * PI) * 0.3, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v8a — a very great crowd: they come over the hill and spread their cloaks on the road */
      throngs.forEach((g) => {
        const k = es(t, 1.0 + (g.i % 4) * 0.06, 1.4 + (g.i % 4) * 0.06, ease.out);
        g.sp.set({ x: g.x, y: g.y + (1 - k) * 40, o: k });
      });
      spreaders.forEach((m) => {
        const t0 = 1.05 + m.i * 0.05;
        const k = seg(t, t0 + 0.1, t0 + 0.3);
        const off = k > 0.02;
        const bend = bump(t, t0, t0 + 0.4);
        const wave = es(t, 2.6, 2.8);
        m.pM.set({ x: m.x, y: m.y, s: 0.84, flip: true, o: off ? 0 : 1, armF: bend * 60, blink: blinkAt(T, m.seed) });
        m.p0.set({ x: m.x, y: m.y, s: 0.84, flip: true, o: off ? 1 : 0, armF: bend * 70 + wave * 40, armB: wave * 130, lean: -bend * 10, head: bend * 10, blink: blinkAt(T, m.seed) });
      });
      carpet.forEach((cl) => {
        const src = spreaders[Math.min(spreaders.length - 1, Math.floor(cl.i * 0.55))];
        const t0 = 1.12 + cl.i * 0.04;
        const k = es(t, t0, t0 + 0.3, ease.out);
        const x = lerp(src.x - 20, cl.x, k), y = lerp(src.y - 120, cl.y, k) - Math.sin(k * PI) * 60;
        pose(cl.fly, { x, y, r: lerp(-30, cl.r, k), s: 0.8, o: k > 0 && k < 1 ? 1 : 0 });
        pose(cl.lie, { x: cl.x, y: cl.y, r: cl.r * 0.3, o: k >= 1 ? 1 : 0 });
      });

      /* v8b — others cut branches from the trees and strew them on the road */
      cutters.forEach((m) => {
        const t0 = 2.02 + m.i * 0.06;
        const cut = bump(t, t0, t0 + 0.3);
        const have = es(t, t0 + 0.22, t0 + 0.28);
        fade(m.hold, have);
        m.p.set({ x: m.x, y: m.y, s: 0.56, flip: m.x > 800, armB: 150 * (cut > 0 ? 1 : have) - (have ? 10 : 0), armF: cut * 120, head: -cut * 20, blink: blinkAt(T, m.seed) });
      });
      brs.forEach((b) => {
        const t0 = 2.25 + b.i * 0.03;
        const k = es(t, t0, t0 + 0.3, ease.out);
        const x = lerp(b.src.x, b.x, k), y = lerp(b.src.y - 120, b.y, k) - Math.sin(k * PI) * 70;
        pose(b.el, { x, y, r: lerp(-60, b.r, k), s: lerp(0.5, 1, k), o: k > 0 ? 1 : 0 });
      });

      S.cam.x = 20 + es(t, 0.9, 1.4) * 70;
      S.cam.z = 1.08 - es(t, 0.9, 1.4) * 0.09 + es(t, 2.4, 2.9) * 0.03;
      S.cam.y = 20 - es(t, 0.9, 1.4) * 30 - es(t, 1.9, 2.3) * 20;
    };
  },
};
