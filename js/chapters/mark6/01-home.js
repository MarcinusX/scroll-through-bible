// Mk 6,1 — Jesus comes home to Nazareth, a little town stacked on its hill; he stops by the
// carpenter's workshop he grew up in, and his disciples come up the road behind him.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, palm, olive, cypress, bush, rock, grass, flowers, house, sun, cloud } from '../../assets/nature.js';
import { bird, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, man, woman, workbench, saw, hammer, square, jug } from './lib.js';

const PI = Math.PI;
const ROADY = (x) => 684 + Math.sin(x * 0.004) * 6 - Math.max(0, x - 900) * 0.05;
const DIS = [
  { o: CAST.peter, x: 690 }, { o: CAST.john, x: 624 }, { o: CAST.andrew, x: 560 },
  { o: CAST.james, x: 496 }, { o: CAST.thomas, x: 430 }, { o: CAST.matthew, x: 366 },
];

export default {
  id: 'm6-home',
  beats: [
    { cover: true },
    { v: 1, text: 'Wyszedł stamtąd i przyszedł do swego rodzinnego miasta.' },
    { v: 1, cont: true, text: 'A towarzyszyli Mu Jego uczniowie.' },
  ],
  cam: { x: [-200, 30], y: [-30, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const SKY = ['#c9dedb', '#ede5cc', '#f7ead3'];
    const sk = sky(S, SKY);

    /* ---------- the flies: morning sun, clouds, birds ---------- */
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 640, y: 180, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 210), { x: 930, y: 130, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 380, y: 250, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 240, speed: 40, scale: 0.5 });

    /* ---------- Galilean hills ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 410, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.16, sh: 3 });
    const h2 = hillsWith(c, { y: 470, amps: [16, 8, 3], lens: [900, 320, 110], color: C.hillMid, trees: 26, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup);

    /* ---------- Nazareth on its hill ---------- */
    const townL = S.layer({ par: 0.3, sh: 3 });
    const hillFn = (x) => 600 - 250 * Math.exp(-Math.pow((x - 1130) / 330, 2)) - 40 * Math.exp(-Math.pow((x - 560) / 260, 2));
    const hp = [];
    for (let x = -900; x <= 2500; x += 14) hp.push([x, hillFn(x) + c.rr(-1.2, 1.2)]);
    hp.push([2500, 1700], [-900, 1700]);
    const hs = sheet().p(c.poly(hp), mix(C.hillNear, C.sand, 0.35));
    // terraces
    let terr = '';
    [[900, 1360, 470], [960, 1300, 420], [1020, 1250, 372]].forEach(([a, b, y]) => { terr += c.ribbon([[a, y + 16], [b, y + 12]], 3); });
    hs.x(terr, shade(C.hillNear, -0.12), 'opacity=".6"');
    townL.add(hs.out());
    // houses, row by row up the hill
    const rows = [[470, 880, 1390, 7, 0.95], [424, 950, 1320, 6, 0.85], [376, 1010, 1260, 5, 0.75], [338, 1080, 1190, 2, 0.66]];
    let town = '';
    rows.forEach(([y, x0, x1, n, sc]) => {
      for (let i = 0; i < n; i++) {
        const x = lerp(x0, x1, (i + c.rr(0.1, 0.5)) / n), w = c.rr(44, 64) * sc, h = c.rr(32, 44) * sc;
        town += house(c, x, y + c.rr(-4, 4), w, h, { stairs: c.chance(0.4) });
      }
    });
    townL.add(town);
    // the synagogue at the top of the town
    const syn = sheet();
    syn.p(c.cut(c.rect(1090, 262, 110, 62), 0.5, 6), C.stone);
    syn.p(c.cut([[1084, 262], [1206, 262], [1206, 254], [1084, 254]], 0.3, 5), C.roof);
    let cols = '';
    for (let x = 1100; x < 1196; x += 18) cols += c.cut(c.rect(x, 280, 6, 44), 0.2, 4);
    syn.p(cols, C.stone2);
    syn.p(c.cut([[1136, 324], [1136, 294], ...c.arc(1145, 294, 9, 9, PI, 2 * PI, 6), [1154, 324]], 0.3, 4), C.soilDark);
    townL.add(syn.out());
    townL.add(cypress(c, 870, 520, 110) + cypress(c, 1400, 482, 120) + cypress(c, 1030, 372, 80) + olive(c, 760, 590, 0.6) + olive(c, 1480, 520, 0.6));
    // neighbours who come out of their doors (small, up on the hill)
    const far = [[930, 470, 0.26], [1060, 424, 0.24], [1180, 470, 0.26], [1290, 424, 0.24], [1330, 470, 0.26]].map(([x, y, s], i) => ({
      x, y, s, i, p: S.puppet(townL.add(person(c, i % 2 ? woman(c) : man(c)))), seed: c.rr(0, 6),
    }));
    const sign = hanging(townL, paperLabel(tr('Nazaret', 'Nazareth'), { size: 24 }), { x: 0, y: 0, len: 500 });

    /* ---------- the road and the carpenter's workshop ---------- */
    const ground = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(640, [5, 2], [700, 180]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3)).out());
    const road = [];
    for (let x = -900; x <= 2500; x += 20) road.push([x, ROADY(x) - 24]);
    const road2 = [];
    for (let x = 2500; x >= -900; x -= 20) road2.push([x, ROADY(x) + 22]);
    ground.add(sheet().p(c.cut([...road, ...road2], 1, 10), C.sand).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 650, fn: gfn, n: 40, h: 12, color: C.olive }));
    // the workshop: back wall, posts, reed roof, the bench, tools on the wall
    const shop = sheet();
    const SX0 = 880, SX1 = 1150, SY = 676;
    shop.p(c.cut(c.rect(SX0 + 10, 500, SX1 - SX0 - 20, SY - 500), 0.6, 10), C.plaster);
    shop.p(c.cut([[SX1 - 10, 504], [SX1 + 40, 520], [SX1 + 40, SY], [SX1 - 10, SY]], 0.4, 8), C.plaster2);
    let crack = '';
    for (let i = 0; i < 5; i++) crack += c.cut(c.blob(c.rr(SX0 + 30, SX1 - 40), c.rr(520, 640), c.rr(10, 22), c.rr(5, 10), 8, 0.2), 0.5, 4);
    shop.x(crack, C.plaster2, 'opacity=".6"');
    // planks leaning against the wall
    shop.p(c.cut([[SX1 - 50, SY], [SX1 - 32, 540], [SX1 - 22, 540], [SX1 - 38, SY]], 0.4, 6) + c.cut([[SX1 - 30, SY], [SX1 - 10, 552], [SX1, 554], [SX1 - 18, SY]], 0.4, 6), C.wood3);
    ground.add(shop.out());
    ground.add(`<g transform="translate(${SX0 + 70} 560)">${saw(c)}</g><g transform="translate(${SX0 + 160} 590)">${hammer(c)}</g><g transform="translate(${SX0 + 190} 584)">${square(c)}</g>`);
    const posts = sheet();
    posts.p(c.cut(c.rect(SX0, 470, 12, SY - 470 + 4), 0.4, 8) + c.cut(c.rect(SX1 - 4, 486, 12, SY - 486 + 4), 0.4, 8), C.wood2);
    const roof = [[SX0 - 30, 474], [SX1 + 50, 494], [SX1 + 54, 508], [SX0 - 34, 490]];
    posts.p(c.cut(roof, 1, 8), C.wheat2);
    let reeds = '';
    for (let x = SX0 - 26; x < SX1 + 50; x += 9) reeds += c.ribbon([[x, 476 + (x - SX0) * 0.07], [x + 2, 492 + (x - SX0) * 0.07]], 1.6);
    posts.x(reeds, shade(C.wheat2, -0.2), 'opacity=".7"');
    ground.add(posts.out());
    ground.add(`<g transform="translate(${SX0 + 125} ${SY})">${workbench(c, 170)}</g>`);

    /* ---------- people ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const locals = [
      { o: woman(c, { robe: C.roseRobe, veil: C.cream }), x: 1240, y: 700, s: 0.92, hold: true },
      { o: man(c, { robe: C.stone, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair }), x: 1330, y: 712, s: 0.9, pose: 'sit' },
    ].map((m, i) => {
      const hold = m.hold ? `<g transform="translate(-6 -58) scale(.5)">${jug(c, C.pot)}</g>` : '';
      return { ...m, i, seed: c.rr(0, 6), p: S.puppet(act.add(person(c, { ...m.o, pose: m.pose || 'stand', holdB: hold }))) };
    });
    const dis = DIS.map((d, i) => ({ ...d, x: S.portrait ? 690 - (690 - d.x) * 0.65 : d.x, i,   // phone: the last of them not cut by the edge
      seed: c.rr(0, 6), p: S.puppet(act.add(person(c, { ...d.o }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    // a little glow of memory over the bench
    const memo = act.add(`<g><circle r="90" fill="url(#warm-glow)"/></g>`);

    /* ---------- foreground ---------- */
    const near = S.layer({ par: 0.7, sh: 4 });
    near.add(grass(c, { x0: -300, x1: 1900, y: 790, n: 36, h: 16, color: C.moss }) + flowers(c, { x0: 120, x1: 700, y: 792, n: 16 }) + flowers(c, { x0: 980, x1: 1500, y: 796, n: 12 }));
    near.add(rock(c, 520, 800, 90, 34, C.rock2) + rock(c, 1160, 806, 70, 28));
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 140, 870, 230, C.sage, C.moss) + bush(c, 1470, 866, 220, C.moss, C.sage) + rock(c, 330, 880, 150, 60, C.rock2) + rock(c, 1280, 890, 130, 50));
    fg.add(palm(c, -40, 900, 330) + palm(c, 1660, 905, 300));

    const cur = curtains(S);

    const jKeys = [[0.85, -260], [1.62, 800]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      sk.blend(SKY, ['#d4e5df', '#f2e8cf', '#f9eedb'], seg(t, 1, 3));
      swing(sunEl, 640, 180 - es(t, 0, 3) * 40, T, 1.2, 0.7);
      swing(cl1, 930 + Math.sin(T * 0.1) * 30, 130, T, 1.4, 0.6, 1);
      swing(cl2, 380 + Math.sin(T * 0.13 + 2) * 30, 250, T, 1.4, 0.8, 2);
      birds(T, 1);

      /* v1a — he walks up the road to his home town and stops at the old workshop */
      const jx = kf(t, jKeys, (u) => u);
      const walking = moving(t, jKeys);
      const touch = es(t, 1.66, 1.86) * (1 - es(t, 2.2, 2.4));
      const turn = es(t, 2.2, 2.3);
      jesus.set({
        x: jx, y: ROADY(jx) + 2, s: 0.96, flip: turn > 0.5 && t < 2.8,
        walk: walking ? jx * 0.05 : undefined,
        armF: touch * 62 + turn * bump(t, 2.3, 2.9) * 50, armB: 6, head: touch * 8, blink: blinkAt(T),
      });
      pose(memo, { x: 905, y: 600, s: 0.6 + touch * 0.6, o: touch * 0.8 });
      // the town sign comes down as he arrives
      const sg = es(t, 1.0, 1.35, ease.back);
      pose(sign, { x: S.portrait ? 1020 : 1150, y: lerp(S.portrait ? -600 : -300, 205, sg), r: Math.sin(T * 1.1) * 2.5, o: sg > 0.01 ? 1 : 0 });

      // neighbours come out of their doors and look
      far.forEach((f) => {
        const k = es(t, 1.35 + f.i * 0.08, 1.6 + f.i * 0.08);
        f.p.set({ x: f.x + k * 10, y: f.y, s: f.s, flip: true, o: k, armF: bump(t, 1.6 + f.i * 0.05, 2.4) * (f.i % 2 ? 90 : 0), blink: blinkAt(T, f.seed) });
      });
      locals.forEach((m) => {
        const look = es(t, 1.3 + m.i * 0.1, 1.55 + m.i * 0.1);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, armF: look * (m.i ? 40 : 30) + bump(t, 2.4, 3) * 20, armB: m.hold ? 150 : 0, head: -look * 4, blink: blinkAt(T, m.seed) });
      });

      /* v1b — his disciples come up the road behind him */
      dis.forEach((d) => {
        const k0 = 1.95 + d.i * 0.06;
        const keys = [[k0, -300 - d.i * 70], [k0 + 0.55, d.x]];
        const x = kf(t, keys, ease.out);
        const mv = moving(t, keys);
        const greet = d.i === 0 ? bump(t, 2.55, 2.95) : 0;
        d.p.set({ x, y: ROADY(x) + 4 + (d.i % 2) * 3, s: 0.9, walk: mv ? x * 0.05 + d.i : undefined, armF: greet * 70 + (mv ? 0 : 8), armB: 4, head: es(t, 2.6, 2.8) * -4, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, -160], [0.9, -160], [1.6, 0], [2.0, 0], [2.6, -60]]);
      S.cam.z = kf(t, [[0, 1.0], [1.6, 1.08], [2.0, 1.08], [2.6, 1.03]]);
      S.cam.y = kf(t, [[0, 0], [1.6, 30], [2.6, 20]]);
    };
  },
};
