// Mk 11,7–8 — they bring the colt to Jesus and throw their cloaks on it; He sits on it.
// Many spread their cloaks on the road, others cut leafy branches in the fields.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix, crowdPerson } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, palm, cypress, grass, bush, rock, flowers } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { jerusalem, colt, coltRig, saddleCloaks, riderLeg, TWO, hand, headAt, roadCloak, flyingCloak, roadBranch, frond, oliveBranch, sparkle, townsfolk } from './lib.js';

const PI = Math.PI;
const ROAD = 652;
const JX = 760;               // Jesus stands / rides here
const CS = 1.0;               // colt scale

export default {
  id: 'm11-cloaks',
  beats: [
    { v: 7, text: 'Przyprowadzili więc oślę do Jezusa' },
    { v: 7, cont: true, text: 'i zarzucili na nie swe płaszcze,' },
    { v: 7, cont: true, text: 'a On wsiadł na nie.' },
    { v: 8, text: 'Wielu zaś słało swe płaszcze na drodze,' },
    { v: 8, cont: true, text: 'a inni gałązki ścięte na polach.' },
  ],
  cam: { x: [-40, 120], y: [-40, 60], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the sun hangs inside the screen
    const SUNX = S.portrait ? 550 : 480;
    const SKY = ['#d4e2dc', '#f1e7cc', '#f8ecd6'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: SUNX, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 1000, y: 110, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 190, speed: 36, scale: 0.42 });

    /* ---------- Jerusalem ahead, across the valley ---------- */
    const cityL = S.layer({ par: 0.1, sh: 3 });
    cityL.add(band(c, { y: 410, amps: [10, 5, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup);
    cityL.add(`<g transform="translate(1080 400)">${jerusalem(c, 0.46)}</g>`);
    const valL = S.layer({ par: 0.16, sh: 3 });
    const vb = hillsWith(c, { y: 448, amps: [12, 6, 2], lens: [800, 300, 120], color: mix(C.hillMid, C.sage, 0.35), trees: 30, treeColor: mix(C.olive, C.moss, 0.3), treeH: 16, x0: -1400, x1: 3000 });
    valL.add(vb.markup);

    /* ---------- the fields on the Mount: trees whose branches will be cut ---------- */
    const fieldL = S.layer({ par: 0.3, sh: 3 });
    const fb = hillsWith(c, { y: 560, amps: [12, 6, 2], lens: [900, 320, 120], color: C.hillMid, x0: -1400, x1: 3000 });
    fieldL.add(fb.markup);
    let rows = '';
    for (let i = 0; i < 4; i++) { const y = 572 + i * 14; rows += c.ribbon([[-1400, y], [3000, y + c.rr(-3, 3)]], 1.8); }
    fieldL.add(`<path d="${rows}" fill="${shade(C.hillMid, -0.1)}" opacity=".5"/>`);
    const TREES = [[400, 'olive'], [560, 'palm'], [1040, 'palm'], [1200, 'olive'], [1360, 'palm'], [250, 'palm']];
    TREES.forEach(([x, k]) => fieldL.add(k === 'palm' ? palm(c, x, fb.fn(x) + 8, 190) : olive(c, x, fb.fn(x) + 8, 0.85)));
    fieldL.add(cypress(c, 900, fb.fn(900) + 6, 120) + cypress(c, 700, fb.fn(700) + 6, 90));
    // the cutters in the fields, and the branches they cut (up the slope, so they show over the crowd on the road)
    const cutters = [[430, 0], [590, 1], [1010, 2], [1230, 3], [1330, 4]].map(([x, i]) => ({ x, i, y: fb.fn(x) - 70, seed: c.rr(0, 9), p: S.puppet(fieldL.add(person(c, townsfolk(c, { man: i % 2 === 0, holdB: `<g transform="rotate(-20)">${i % 2 ? oliveBranch(c, 60) : frond(c, 70)}</g>` })))) }));
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
    const CLOAK_COLS = [C.dustyBlue, C.roseRobe, C.wheatRobe, C.tealRobe, C.mauve, C.clayMantle, C.sageRobe, C.ochreRobe, C.plumRobe];
    const carpet = Array.from({ length: 9 }, (_, i) => {
      const x = 900 + i * 92 + c.rr(-10, 10), y = ROAD + 12 + c.rr(-8, 8);
      return { i, x, y, r: c.rr(-8, 8), col: CLOAK_COLS[i], lie: carpetL.add(`<g>${roadCloak(c, CLOAK_COLS[i], 118)}</g>`), fly: carpetL.add(`<g>${flyingCloak(c, CLOAK_COLS[i], 90)}</g>`) };
    });
    const brs = Array.from({ length: 12 }, (_, i) => {
      const src = cutters[i % cutters.length];
      return { i, src, x: 880 + i * 72 + c.rr(-20, 20), y: ROAD + 12 + c.rr(-14, 10), r: c.rr(-30, 30), el: carpetL.add(`<g>${roadBranch(c, c.rr(60, 80), i % 3 ? 'palm' : 'olive')}</g>`) };
    });

    /* ---------- people along the road who spread their cloaks ---------- */
    const crowdL = S.layer({ par: 0.5, sh: 4 });
    const spreaders = [[1070, -36], [1170, -40], [1270, -34], [1370, -38], [1470, -36], [1570, -40]].map(([x, dy], i) => {
      const o = townsfolk(c, { man: i % 2 === 0 });
      const plain = { ...o, mantle: null };
      const withM = { ...o, mantle: CLOAK_COLS[i + 2] };
      return { x, y: ROAD + dy, i, seed: c.rr(0, 9), pM: S.puppet(crowdL.add(person(c, withM))), p0: S.puppet(crowdL.add(person(c, plain))) };
    });

    /* ---------- the disciples, Jesus and the colt ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const back = [{ o: CAST.thomas, x: 470, y: ROAD - 14, s: 0.88 }, { o: CAST.matthew, x: 560, y: ROAD - 16, s: 0.88 }, { o: CAST.john, x: 520, y: ROAD + 6, s: 0.95 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    // Peter and James take off their cloaks (two cut-outs each, swapped as the cloak flies)
    const throwers = [{ o: CAST.peter, x: 620, col: CAST.peter.mantle }, { o: CAST.james, x: 680, col: CAST.james.mantle }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), pM: S.puppet(L.add(person(c, d.o))), p0: S.puppet(L.add(person(c, { ...d.o, mantle: null }))), fly: L.add(`<g>${flyingCloak(c, d.col, 80)}</g>`) }));
    const jStand = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const rider = person(c, { ...CAST.jesus, pose: 'sit' });
    const coltEl = L.add(colt(c, {
      over: `<g data-k="saddle">${saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle])}</g>`,
      rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${rider}</g><g data-k="rleg">${riderLeg(c)}</g>`,
    }));
    const cRig = coltRig(coltEl);
    const saddle = S.$('saddle'), riderG = S.$('rider'), rleg = S.$('rleg');
    const jRide = S.puppet(riderG.firstElementChild);
    const two = TWO.map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))) }));
    const glow = L.add(`<g>${sparkle(c, 14)}</g>`);

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(olive(c, 90, 920, 1.4) + bush(c, 1380, 900, 220, C.sage, C.moss) + rock(c, 300, 905, 160, 60, C.rock2) + palm(c, 1560, 930, 360));

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#d0e1dd', '#efe8cf', '#f7edd9'], seg(t, 0, 5));
      swing(sunEl, SUNX, 130, T, 1, 0.7);
      swing(cl1, 1000 + Math.sin(T * 0.1) * 26, 110, T, 1.3, 0.6, 1);
      birds(T, 1);

      /* v7a — the colt is led in from the village (right), turns round beside Jesus */
      const lead = es(t, 0.0, 0.6, ease.out);
      const turn = es(t, 0.66, 0.72);
      const cx0 = lerp(1500, 880, lead);
      /* v7c — He sits on it; v8 — the colt steps forward onto the carpet a little */
      const mount = es(t, 2.12, 2.2);
      const ride = es(t, 3.3, 4.9);
      const cx = cx0 - mount * (880 - JX - 10) + ride * 60;
      const cWalk = (lead > 0 && lead < 1) || (ride > 0 && ride < 1);
      cRig.set({
        x: cx, y: ROAD + 6, s: CS, flip: turn < 0.5,
        walk: cWalk ? cx * 0.06 : undefined,
        nod: bump(t, 0.7, 1.0) * 10 + Math.sin(T * 0.8) * 1.5, ear: Math.sin(T * 1.3) * 7 + bump(t, 1.4, 1.8) * 18, tail: Math.sin(T * 1.7) * 8,
      });
      // v7b — cloaks thrown on its back
      const on = es(t, 1.45, 1.6);
      fade(saddle, on);
      Array.from(saddle.querySelectorAll('.cl')).forEach((el, i) => fade(el, es(t, 1.4 + i * 0.12, 1.5 + i * 0.12)));
      fade(riderG, mount); fade(rleg, mount);
      jRide.set({ x: 0, y: 0, s: 1, armF: 20 + es(t, 2.3, 2.7) * 30 + bump(t, 3.2, 4.2) * 40, armB: 10 + es(t, 4.2, 4.7) * 60, head: -4 + bump(t, 3.2, 4.2) * 6, blink: blinkAt(T) });

      // Jesus waits, greets the colt, and mounts (the cut-outs swap)
      jStand.set({ x: JX, y: ROAD, s: 1.0, o: 1 - mount, armF: bump(t, 0.5, 1.1) * 60 + es(t, 1.9, 2.1) * 50, armB: es(t, 1.95, 2.1) * 30, head: bump(t, 0.5, 1.1) * 8, blink: blinkAt(T) });
      pose(glow, { x: JX + 10, y: ROAD - 250, s: bump(t, 2.12, 2.7) * 1.4 + 0.001, r: t * 80, o: bump(t, 2.12, 2.7) });

      // the two who fetched it
      two.forEach((m) => {
        const aside = es(t, 1.7, 2.1);
        const x = lerp(1500 - 90 - m.i * 70, 880 + 110 + m.i * 60, lead) - aside * (40 - m.i * 30);
        const y = ROAD + 10 - m.i * 14 - aside * (34 - m.i * 10);
        m.p.set({ x, y, s: (0.94 - m.i * 0.04) * (1 - aside * 0.06), flip: lead < 1, walk: (lead > 0 && lead < 1) || (aside > 0 && aside < 1) ? x * 0.05 + m.i + y * 0.05 : undefined, armF: m.i === 0 ? (lead < 1 ? 60 : 40) * (1 - on) : bump(t, 3.2, 4) * 40, head: bump(t, 2.2, 2.7) * -6, blink: blinkAt(T, m.seed) });
      });
      back.forEach((d) => d.p.set({ x: d.x, y: d.y, s: d.s, flip: false, armF: bump(t, 2.2, 3) * 50 + es(t, 4.2, 4.6) * (d.i === 1 ? 110 : 0), armB: es(t, 2.3, 2.6) * (d.i === 2 ? 120 : 0) * (1 - es(t, 3.2, 3.5)), head: -es(t, 2.2, 2.6) * 6, blink: blinkAt(T, d.seed) }));
      throwers.forEach((d) => {
        const k = seg(t, 1.05 + d.i * 0.14, 1.45 + d.i * 0.12);
        const off = k > 0.02;
        const face = es(t, 0.8, 0.9);
        d.pM.set({ x: d.x, y: ROAD + 2 - d.i * 8, s: 0.95 - d.i * 0.03, o: off ? 0 : 1, armF: face * 60, armB: face * 40, blink: blinkAt(T, d.seed) });
        d.p0.set({ x: d.x, y: ROAD + 2 - d.i * 8, s: 0.95 - d.i * 0.03, o: off ? 1 : 0, armF: bump(t, 1.05, 1.6) * 120 + bump(t, 2.2, 3) * 40, armB: bump(t, 1.05, 1.6) * 90, head: -bump(t, 1.2, 1.6) * 6, blink: blinkAt(T, d.seed) });
        // the cloak flies from the shoulders to the colt's back
        const bx = cx0 - 10 + d.i * 16, by = ROAD - 100;
        const x = lerp(d.x, bx, k), y = lerp(ROAD - 130, by, k) - Math.sin(k * PI) * 90;
        pose(d.fly, { x, y, r: -20 + k * 30, s: 0.8 + Math.sin(k * PI) * 0.3, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v8a — many spread their cloaks on the road */
      spreaders.forEach((m) => {
        const t0 = 3.05 + m.i * 0.1;
        const k = seg(t, t0 + 0.15, t0 + 0.5);
        const off = k > 0.02;
        const bend = bump(t, t0, t0 + 0.6);
        const wave = es(t, 4.3, 4.6);
        m.pM.set({ x: m.x, y: m.y, s: 0.84, flip: true, o: off ? 0 : 1, armF: bend * 60, blink: blinkAt(T, m.seed) });
        m.p0.set({ x: m.x, y: m.y, s: 0.84, flip: true, o: off ? 1 : 0, armF: bend * 70 + wave * 40, armB: wave * (130 + Math.sin(T * 3 + m.i) * 0), lean: -bend * 10, head: bend * 10, blink: blinkAt(T, m.seed) });
      });
      carpet.forEach((cl) => {
        const src = spreaders[Math.min(spreaders.length - 1, Math.floor(cl.i * 0.67))];
        const t0 = 3.2 + cl.i * 0.07;
        const k = es(t, t0, t0 + 0.4, ease.out);
        const flying = k > 0 && k < 1;
        const x = lerp(src.x - 20, cl.x, k), y = lerp(src.y - 120, cl.y, k) - Math.sin(k * PI) * 60;
        pose(cl.fly, { x, y, r: lerp(-30, cl.r, k), s: 0.8, o: flying ? 1 : 0 });
        pose(cl.lie, { x: cl.x, y: cl.y, r: cl.r * 0.3, o: k >= 1 ? 1 : 0 });
      });

      /* v8b — others cut branches in the fields and strew them on the road */
      cutters.forEach((m) => {
        const t0 = 4.0 + m.i * 0.08;
        const cut = bump(t, t0, t0 + 0.35);
        const have = es(t, t0 + 0.25, t0 + 0.32);
        fade(m.hold, have);
        m.p.set({ x: m.x, y: m.y, s: 0.5, flip: m.x > 800, armB: 150 * (cut > 0 ? 1 : have) - (have ? 10 : 0), armF: cut * 120, head: -cut * 20, blink: blinkAt(T, m.seed) });
      });
      brs.forEach((b) => {
        const t0 = 4.3 + b.i * 0.045;
        const k = es(t, t0, t0 + 0.35, ease.out);
        const x = lerp(b.src.x, b.x, k), y = lerp(b.src.y - 120, b.y, k) - Math.sin(k * PI) * 70;
        pose(b.el, { x, y, r: lerp(-60, b.r, k), s: lerp(0.5, 1, k), o: k > 0 ? 1 : 0 });
      });

      S.cam.x = es(t, 0, 0.7) * 50 - es(t, 1.8, 2.3) * 30 + es(t, 2.9, 3.6) * 90;
      S.cam.z = 1.06 - es(t, 2.9, 3.6) * 0.07 + es(t, 4.4, 4.99) * 0.03;
      S.cam.y = 20 - es(t, 2.9, 3.6) * 30 - es(t, 3.9, 4.4) * 30;
    };
  },
};
