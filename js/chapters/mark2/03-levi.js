// Mk 2,13–14 — by the lake again: the crowd comes, He teaches; passing by He sees Levi
// at the tax booth, counting coins. "Follow me." Levi gets up and follows Him.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, reeds, rock, town, sun, cloud, grass, olive } from '../../assets/nature.js';
import { boat, bird, paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, hand, headAt, townsfolk, taxBooth, coin, coinStack, ledger, coinScale, wordSlip, spark } from './lib.js';

const PI = Math.PI;
const PAR = 0.7;
const Y = 664;                 // where people stand on the shore road
const BOOTH = 1150;
const camFor = (x) => (x - 800) / PAR;

export default {
  id: 'm2-levi',
  beats: [
    { v: 13, text: 'Potem wyszedł znowu nad jezioro.' },
    { v: 13, cont: true, text: 'Cały lud przychodził do Niego, a On go nauczał.' },
    { v: 14, text: 'A przechodząc, ujrzał Lewiego, syna Alfeusza, siedzącego w komorze celnej,' },
    { v: 14, cont: true, text: 'i rzekł do niego: «Pójdź za Mną!».' },
    { v: 14, cont: true, text: 'On wstał i poszedł za Nim.' },
  ],
  cam: { x: [camFor(640), camFor(1060)], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const SKY = ['#c6dcdc', '#eae6cf', '#f6ecd6'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 600, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 900, y: 140, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1350, y: 210, len: 700 });
    const birds = flock(S, hangL, 5, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 50, scale: 0.5 });

    /* far shore, the lake, boats */
    S.layer({ par: 0.1, sh: 2 }).add(hillsWith(c, { y: 400, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1200, x1: 2800, houses: 8, houseColor: C.plaster }).markup);
    const lake = S.layer({ par: 0.2, sh: 2 });
    lake.add(waterBand(c, { y: 432, color: C.lake, foamN: 30, x0: -1200, x1: 2900 }).markup);
    const boats = [[180, 488, 0.5, false], [1500, 470, 0.36, true], [1720, 500, 0.46, false], [880, 452, 0.24, true]].map(([x, y, s, mast], i) => {
      const b = boat(c, { mast, hull: i % 2 ? C.wood2 : C.wood, stripe: i === 2 ? C.dustyBlue : C.terracotta });
      return { el: lake.add(`<g>${b.back}${b.front}</g>`), x, y, s, i };
    });
    const w1 = S.layer({ par: 0.3, sh: 3, pad: 150 });
    w1.add(waveStrip(c, { y: 520, len: 140, amp: 8, color: C.lake2, x0: -1400, x1: 3000 }));

    /* the shore road */
    const shore = S.layer({ par: 0.45, sh: 3 });
    const sfn = c.wave(548, [5, 2], [700, 160]);
    shore.add(sheet().p(c.ridge(sfn, -1400, 3000, 1700, 12, 1), C.sand).out());
    shore.add(reeds(c, 60, 556, 10, 70) + reeds(c, 1640, 556, 9, 60) + palm(c, 1420, 560, 210) + palm(c, 230, 560, 180) + olive(c, 1700, 562, 0.8));
    shore.add(grass(c, { x0: -1200, x1: 2800, y: 548, fn: sfn, n: 40, h: 12, color: C.olive }));
    // nets drying on poles
    const net = sheet();
    net.p(c.ribbon([[1580, 560], [1582, 470]], 5) + c.ribbon([[1690, 560], [1688, 476]], 5), C.wood2);
    let mesh = '';
    for (let i = 0; i < 8; i++) mesh += c.ribbon(c.qbez([1582, 480 + i * 9], [1636, 500 + i * 9], [1688, 484 + i * 9], 8), 1.1);
    for (let i = 0; i < 9; i++) mesh += c.ribbon([[1590 + i * 12, 486 + Math.sin(i / 8 * PI) * 16], [1590 + i * 12, 548]], 1.1);
    net.x(mesh, C.wood3, 'opacity=".8"');
    shore.add(net.out());

    /* the crowd sitting on the shore */
    const crowdL = S.layer({ par: 0.55, sh: 4 });
    const DIS = ['peter', 'andrew', 'james', 'john'].map((k, i) => ({ k, i, off: [-92, -160, -228, -296][i], dy: [-4, 3, -3, 4][i], seed: c.rr(0, 9), p: S.puppet(crowdL.add(person(c, { ...CAST[k] }))) }));
    const people = crowd(S, crowdL, [
      { y: 598, s: 0.62, n: 9, x0: 300, x1: 640, pose: 'sit' },
      { y: 618, s: 0.7, n: 7, x0: 260, x1: 620, pose: 'sit' },
      { y: 600, s: 0.62, n: 3, x0: 840, x1: 960, pose: 'sit' },
    ]);
    people.forEach((m) => { m.from = m.x < 700 ? m.x - c.rr(500, 800) : m.x + c.rr(700, 900); m.d = c.rr(0, 0.35); });

    /* the tax booth */
    const boothL = S.layer({ par: PAR, sh: 4 });
    const B = taxBooth(c, 250, 250);
    boothL.add(`<g transform="translate(${BOOTH} ${Y})">${B.back}</g>`);
    const levi = S.puppet(boothL.add(person(c, { ...CAST.matthew, pose: 'sit' })));
    const leviUp = S.puppet(boothL.add(person(c, { ...CAST.matthew })));
    boothL.add(`<g transform="translate(${BOOTH} ${Y})">${B.front}</g>`);
    const CT = Y - 96;         // counter top
    boothL.add(`<g transform="translate(${BOOTH + 58} ${CT})">${ledger(c, 64)}</g><g transform="translate(${BOOTH + 104} ${CT})">${coinScale(c)}</g>`);
    const stacks = [[BOOTH - 88, 6], [BOOTH - 64, 4], [BOOTH - 40, 7]].map(([x, n], i) => ({ x, n, i, el: boothL.add(`<g>${coinStack(c, n)}</g>`) }));
    const loose = Array.from({ length: 7 }, (_, i) => ({ i, el: boothL.add(`<g>${coin(c, 7)}</g>`), x: BOOTH - 100 + i * 12 + c.rr(-4, 4), fx: BOOTH - 150 + c.rr(-60, 40), r: c.rr(-200, 200) }));
    const handCoin = boothL.add(`<g>${coin(c, 7)}</g>`);
    const nameTag = hanging(boothL, paperLabel(tr('Lewi, syn Alfeusza', 'Levi, son of Alphaeus'), { size: 22 }), { x: BOOTH, y: 330, len: 500 });

    /* Jesus, the four, a fisherman paying his toll */
    const act = S.layer({ par: PAR, sh: 5 });
    const basket = sheet().p(c.cut([[-20, -2], [20, -2], [16, 18], [-16, 18]], 0.5, 5), C.basket).p(c.cut([[-18, -2], [-8, -12], [8, -12], [18, -4]], 0.4, 4), C.lake3).out();
    const fisher = S.puppet(act.add(person(c, townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather, holdB: `<g transform="translate(0 2)">${basket}</g>` }))));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const words = Array.from({ length: 7 }, (_, i) => ({ el: act.add(wordSlip(c, c.rr(26, 34))), i, to: [lerp(300, 980, i / 6) + c.rr(-20, 20), c.rr(470, 520)], seed: c.rr(0, 6) }));
    const glow = act.add(`<g>${rays(c, { n: 12, r0: 34, r1: 96, spread: 0.05, color: '#fff3cf' })}<circle r="80" fill="url(#halo-glow)"/></g>`);
    const sparks = [0, 1, 2].map((i) => act.add(`<g>${spark(c, 9)}</g>`));

    /* foreground */
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(rock(c, 150, 900, 240, 90, C.rock2) + reeds(c, 330, 890, 12, 200, C.moss) + rock(c, 1650, 905, 260, 100, C.rock) + reeds(c, 1500, 900, 12, 190, C.moss));

    // Jesus' walk: along the shore → teaching spot → passing by the booth → back along the shore with Levi
    const jKeys = [[-0.3, 180], [0.75, 700], [2.0, 700], [2.6, 930], [4.2, 930], [4.95, 700]];
    const coinT = (i) => 4.06 + i * 0.03;

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#cfe1dc', '#efe8cf', '#f8eed9'], seg(t, 0, 5));
      swing(sunEl, 600, 150 - es(t, 0, 5) * 20, T, 1.1, 0.6);
      swing(cl1, 900 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);
      swing(cl2, 1350 + Math.sin(T * 0.12 + 2) * 26, 210, T, 1.3, 0.8, 2);
      birds(T, 1);
      boats.forEach((b) => pose(b.el, { x: b.x, y: b.y + Math.sin(T * 1.2 + b.i) * 2, s: b.s, r: Math.sin(T * 0.9 + b.i) * 1.2 }));
      w1.shift(((T * 18) % 140) - 70);

      /* Jesus */
      const jx = kf(t, jKeys);
      const jWalk = moving(t, jKeys);
      const teach = es(t, 1.1, 1.3) * (1 - es(t, 1.9, 2.05));
      const call = es(t, 3.02, 3.25) * (1 - es(t, 4.15, 4.3));
      const lookLevi = es(t, 2.55, 2.75) * (1 - es(t, 4.2, 4.3));
      const back = t > 4.2;
      jesus.set({
        x: jx, y: Y, s: 1.02, flip: back,
        walk: jWalk ? jx * 0.05 : undefined,
        armF: teach * (60 + Math.sin(T * 1.6) * 20) + call * (80 + Math.sin(T * 3) * 14 * es(t, 3.3, 3.5)) + (back ? 20 : 0),
        armB: teach * (30 + Math.sin(T * 1.2) * 10) + call * 20,
        head: -lookLevi * 4 + call * 2, blink: blinkAt(T),
      });
      DIS.forEach((d) => {
        const lag = back ? -(0.04 + d.i * 0.03) : 0.12 + d.i * 0.05;
        const px = kf(t - lag, jKeys) + d.off;
        d.p.set({ x: px, y: 586 + d.dy, s: 0.8, flip: back, walk: moving(t - lag, jKeys) ? px * 0.05 + d.i : undefined, head: lookLevi * -3 + bump(t, 3.2, 4) * 6 * (d.i % 2 ? 1 : -1), armF: bump(t, 3.3, 4.1) * (d.i === 0 ? 50 : 0), blink: blinkAt(T, d.seed) });
      });
      // words while He teaches
      words.forEach((w) => {
        const k = ((T * 0.22 + w.i / words.length) % 1);
        const on = teach;
        const sx = jx + 20, sy = Y - 190;
        pose(w.el, { x: lerp(sx, w.to[0], k), y: lerp(sy, w.to[1], k) - Math.sin(k * PI) * 50, r: Math.sin(T * 2 + w.seed) * 12, s: 0.5 + k * 0.5, o: on * Math.min(1, k * 5) * (1 - k * 0.6) });
      });

      /* the crowd comes and sits down; they watch Him go */
      people.forEach((m) => {
        const pr = seg(t, 1.0 + m.d, 1.4 + m.d);
        const x = lerp(m.from, m.x, ease.out(pr));
        m.p.set({ x, y: m.y, s: m.s, flip: jx < m.x, o: seg(t, 0.95 + m.d, 1.05 + m.d), head: -es(t, 1.2, 1.5) * 6, armF: bump(t, 1.4, 2) * (m.i % 5 === 0 ? 40 : 0), blink: blinkAt(T, m.seed) });
      });

      /* the fisherman pays and goes */
      const FX = S.portrait ? BOOTH - 215 : BOOTH - 160;   // phone: clear of the edge and the thread
      const fKeys = [[-0.5, FX], [1.8, FX], [2.3, BOOTH - 600]];
      const fx = kf(t, fKeys, (u) => u);
      const leaving = t > 1.8;
      fisher.set({ x: fx, y: Y + 6, s: 0.96, flip: leaving, walk: leaving && t < 2.3 ? fx * 0.05 : undefined, armF: bump(t, 0.6, 1.5) * 70, armB: 30, o: 1 - seg(t, 2.2, 2.3), blink: blinkAt(T, 5) });

      /* Levi counts, looks up, gets up, follows */
      const count = (1 - es(t, 3.05, 3.2)) * Math.max(0, Math.sin(T * 3)) ;
      const look = es(t, 2.6, 2.8);
      const hear = es(t, 3.1, 3.3);
      const rise = es(t, 4.05, 4.1);
      levi.set({ x: BOOTH + 14, y: Y - 40, s: 0.96, flip: true, o: 1 - rise, armF: 40 + count * 24 + bump(t, 0.7, 1.4) * 30 + hear * 30, armB: 20 + hear * 40, head: -look * 6 + hear * 4 + count * 4 * (1 - look), blink: blinkAt(T, 3) });
      const lKeys = [[4.1, BOOTH + 14], [4.35, BOOTH - 150], [4.95, 700 + 140]];
      const lx = kf(t, lKeys);
      leviUp.set({ x: lx, y: Y + 2, s: 0.96, flip: true, o: rise, walk: moving(t, lKeys) ? lx * 0.05 : undefined, armF: 20, armB: 10, head: 4, blink: blinkAt(T, 3) });
      const [hx, hy] = hand(BOOTH + 14, Y - 40, 0.96, true, 40 + count * 24, 0, 62);
      const drop = es(t, 3.1, 3.3, ease.in);
      pose(handCoin, { x: hx - drop * 6, y: lerp(hy, CT - 7, drop), r: drop * 90, o: 1 - es(t, 4.05, 4.2) });
      stacks.forEach((st) => pose(st.el, { x: st.x, y: CT, r: es(t, coinT(st.i), coinT(st.i) + 0.1) * (st.i - 1) * 8 }));
      loose.forEach((l) => {
        const k = es(t, coinT(l.i), coinT(l.i) + 0.28, ease.in);
        pose(l.el, { x: lerp(l.x, l.fx, k), y: lerp(CT - 7, Y + 4, k) - Math.sin(k * PI) * 26, r: k * l.r, o: seg(t, 4.02, 4.06) });
      });
      const tag = es(t, 2.45, 2.8, ease.back) * (1 - es(t, 4.4, 4.7));
      pose(nameTag, { x: BOOTH, y: lerp(-150, 330, tag), r: Math.sin(T * 0.9) * 2, o: tag > 0.01 ? 1 : 0 });
      // the call reaches Levi as light
      const [lhx, lhy] = headAt(BOOTH + 14, Y - 40, 0.96, true, 62);
      pose(glow, { x: lhx, y: lhy, s: 0.5 + es(t, 3.15, 3.5) * 0.6, r: T * 4, o: bump(t, 3.1, 4.4) * 0.6 });
      sparks.forEach((sp, i) => {
        const k = es(t, 3.2 + i * 0.1, 3.7 + i * 0.1);
        const [jhx] = hand(jx, Y, 1.02, false, 90);
        pose(sp, { x: lerp(jhx, lhx, k), y: lerp(Y - 150, lhy, k) - Math.sin(k * PI) * 40, s: 0.9, r: T * 40, o: bump(t, 3.2 + i * 0.1, 3.75 + i * 0.1) });
      });

      /* camera: the shore → the booth → following them */
      const AT = camFor(S.portrait ? 1045 : 1010);   // phone: the name tag and the booth clear of the thread
      S.cam.x = kf(t, [[0, camFor(700)], [2.0, camFor(700)], [2.6, AT], [4.2, AT], [4.95, camFor(820)]]);
      S.cam.z = 1.02 + es(t, 2.2, 2.7) * 0.08 - es(t, 4.2, 4.8) * 0.06;
      S.cam.y = 20 + es(t, 2.2, 2.7) * 30 - es(t, 4.2, 4.8) * 20;
    };
  },
};
