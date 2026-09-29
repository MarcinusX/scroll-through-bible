// Mt 12,46–50 — a courtyard in the evening light, full of people sitting round Jesus as He talks. Outside the low wall,
// by the gateway on the left, His mother and His brothers come and stand, wanting to speak with Him. A young man
// slips in through the gate and tells Him: "Your mother and your brothers are outside." "Who is my mother, and who are
// my brothers?" — a question mark hangs over the courtyard. He stretches out His hand towards His disciples — "Here
// are my mother and my brothers!" — and a warm light rests on them. "Whoever does the will of my Father in heaven":
// light pours down from above over everyone who listens — over the disciples, the crowd, and over Mary outside the wall
// too — and they lift their hands.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { hillsWith, olive, cypress, house, grass, cloud, sun } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { MARY, GOLDEN, crowdMarkup, manOf, headAt, handAt, kf, moving, bubble, qMark, rayBurst, glow, sparkle, heart, tr, PI } from './lib.js';

const F = 712;
const JX = 800;
const GATE = [650, 730];
const WALL = 612;       // foot of the courtyard wall (outside)

export default {
  id: 'mt12-family',
  beats: [
    { v: 46 },
    { v: 47 },
    { v: 48 },
    { v: 49 },
    { v: 50 },
  ],
  cam: { x: [-60, 30], y: [-40, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42, { rays: C.sunDeep, disc: '#f0b060', inner: '#f5ca8a' }), { x: 1230, y: 250, len: 800 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, C.peach), { x: 1000, y: 200, len: 800 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.2), trees: 12, treeColor: mix(C.sage2, C.duskViolet, 0.2), treeH: 18 }).markup);
    /* outside the wall */
    const outL = S.layer({ par: 0.26, sh: 3 });
    outL.add(sheet().p(c.cut([[-900, 560], [2500, 560], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.3)).out() + house(c, 200, 566, 140, 110) + olive(c, 380, 570, 0.8) + cypress(c, 1330, 566, 140) + house(c, 1400, 566, 160, 120));
    const outGlow = outL.add(`<g opacity="0">${glow(160, 1)}</g>`);
    const FAM = [
      { o: MARY, x: 610, s: 0.9 },
      { o: manOf(c, { robe: C.tealRobe, beard: 'short', hairStyle: 'short', skin: C.skin2 }), x: 552, s: 0.88 },
      { o: manOf(c, { robe: C.ochreRobe, mantle: C.sageRobe, beard: 'none', hairStyle: 'curly', skin: C.skin2 }), x: 494, s: 0.87 },
      { o: manOf(c, { robe: C.clayMantle, beard: 'full', hairStyle: 'wrap', veil: C.linen2, skin: C.skin3 }), x: 530, s: 0.82 },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 9), p: S.puppet(outL.add(person(c, f.o))) }));
    /* the courtyard wall with its gateway */
    const wallL = S.layer({ par: 0.3, sh: 4 });
    const ws = sheet();
    const top = WALL - 58;
    ws.p(c.cut([[-900, WALL + 4], [-900, top], [GATE[0], top], [GATE[0], WALL + 4]], 0.6, 10) + c.cut([[GATE[1], WALL + 4], [GATE[1], top], [2500, top], [2500, WALL + 4]], 0.6, 10), mix(C.plaster, C.stone, 0.4));
    let bl = '';
    for (let y = top + 18; y < WALL; y += 22) for (let x = -880 + ((y / 22) % 2) * 20; x < 2500; x += 46) if (x < GATE[0] - 30 || x > GATE[1]) bl += c.ribbon([[x, y], [x + 38, y]], 1);
    ws.x(bl, shade(C.stone, -0.15), 'opacity=".5"');
    ws.p(c.cut(c.rect(-900, top - 10, GATE[0] + 912, 12), 0.4, 10) + c.cut(c.rect(GATE[1] - 12, top - 10, 3400, 12), 0.4, 10), C.stone2);
    ws.p(c.cut(c.rect(GATE[0] - 18, top - 30, 20, WALL - top + 34), 0.4, 6) + c.cut(c.rect(GATE[1] - 2, top - 30, 20, WALL - top + 34), 0.4, 6), C.stone2);
    wallL.add(ws.out());
    /* inside: the courtyard, the crowd sitting */
    const G = S.layer({ par: 0.34, sh: 3 });
    G.add(sheet().p(c.cut([[-900, WALL], [2500, WALL], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.stone, 0.45)).out() + grass(c, { x0: -600, x1: 2200, y: WALL + 6, n: 30, h: 10, color: C.moss }));
    const crowdL = S.layer({ par: 0.38, sh: 4 });
    const SP = [[700, 652, 'mt12-fam-a', false], [930, 650, 'mt12-fam-b', true]].map(([x, y, seed, flip]) => ({
      x, y,
      a: crowdL.sprite(crowdMarkup(seed, 7, { s: 0.62, spread: 40, rows: 2, flip, pose: 'sit' }), x, y),
      b: crowdL.sprite(crowdMarkup(seed, 7, { s: 0.62, spread: 40, rows: 2, flip, pose: 'sit', armF: [60, 100], armB: [110, 160], head: [-10, -4] }), x, y),
    }));
    /* the act */
    const act = S.layer({ par: 0.5, sh: 5 });
    const disLight = act.add(`<g opacity="0">${glow(190, 1)}</g>`);
    const DIS = [{ k: 'peter', x: 960 }, { k: 'john', x: 1040 }, { k: 'andrew', x: 1120 }, { k: 'james', x: 1000, y: F + 36 }, { k: 'matthew', x: 1090, y: F + 40 }]
      .map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k], pose: 'sit' }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const boy = S.puppet(act.add(person(c, manOf(c, { robe: C.wheatRobe, beard: 'none', hairStyle: 'curly', skin: C.skin2 }))));
    const say = act.add(`<g opacity="0">${bubble(c, [tr('Twoja Matka i bracia', 'Your mother and brothers'), tr('stoją na dworze', 'are standing outside')], { size: 18, tail: 1 })}</g>`);
    const hearts = [0, 1, 2, 3, 4, 5].map(() => act.add(`<g opacity="0">${heart(c, 11)}</g>`));
    /* hanging: the question, the light from above */
    const fx = S.layer({ par: 0.2, sh: 6 });
    const q = hanging(fx, `<g transform="scale(1.1)">${qMark(c, 64)}</g>`, { x: JX, y: -300, len: 900 });
    const light = S.layer({ par: 0.15, sh: 1, flat: true });
    const beam = light.add(`<g opacity="0"><path d="${c.poly([[JX - 90, -900], [JX + 90, -900], [JX + 620, 760], [JX - 620, 760]])}" fill="#fff4d6" opacity=".35"/>${rayBurst(c, { n: 20, r0: 30, r1: 420, spread: 0.04, color: '#fff3cf', o: 0.55 })}</g>`);
    const sp = [0, 1, 2, 3].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    const bK = [[0.9, 690], [1.35, 712]];

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1230, y: 250, r: Math.sin(T * 0.6) });
      pose(cl, { x: 1000 + Math.sin(T * 0.1) * 20, y: 200, r: Math.sin(T * 0.6 + 1) });

      /* v46 — His mother and brothers stand outside */
      const come = es(t, -0.2, 0.45);
      FAM.forEach((f) => {
        const x = lerp(f.x - 260, f.x, come);
        f.p.set({ x, y: WALL - 10 + (f.i % 2) * 4, s: f.s, flip: false, walk: come > 0 && come < 1 ? x * 0.06 + f.i : undefined, armF: 14 + (f.i === 0 ? bump(t, 0.4, 1.0) * 30 : 0), armB: 8, head: -2, blink: blinkAt(T, f.seed) });
      });
      /* v47 — someone tells Him */
      const bx = kf(t, bK);
      const bIn = es(t, 0.85, 0.95);
      boy.set({ x: bx, y: F + 10, s: 0.9, flip: false, o: bIn * (1 - es(t, 3.9, 4.0)), walk: moving(t, bK) ? bx * 0.07 : undefined, armF: 20 + bump(t, 1.35, 1.95) * 60, armB: 10 + bump(t, 1.4, 1.95) * 40, head: -4, blink: blinkAt(T, 3) });
      const sk = es(t, 1.35, 1.5, ease.back) * (1 - es(t, 1.95, 2.05));
      const [bhx, bhy] = headAt(712, F + 10, 0.9, false);
      pose(say, { x: bhx + 40, y: bhy - 40, s: sk, o: sk > 0.01 ? 1 : 0 });

      /* v48 — "Who is my mother?"; v49 — the hand to the disciples; v50 — the Father's will */
      const qd = es(t, 2.1, 2.4, ease.back) * (1 - es(t, 3.0, 3.2));
      pose(q, { x: JX, y: lerp(-300, 300, qd), r: Math.sin(T * 1.1) * 1.2, oy: 0, o: qd > 0.01 ? 1 : 0 });
      const stretch = es(t, 3.05, 3.3);
      const will = es(t, 4.05, 4.4);
      jesus.set({ x: JX, y: F, s: 1.06, flip: t < 2.0 ? t > 1.3 : false, armF: 16 + bump(t, 2.1, 2.9) * 40 + stretch * 70 * (1 - will * 0.4) + will * 20, armB: 8 + bump(t, 2.1, 2.9) * 40 + will * 110, head: -2 - will * 8, blink: blinkAt(T, 2) });
      pose(disLight, { x: 1040, y: F - 50, o: es(t, 3.2, 3.45) });
      DIS.forEach((d) => {
        const up = es(t, 3.25 + d.i * 0.04, 3.45 + d.i * 0.04);
        d.p.set({ x: d.x, y: d.y || F + 6, s: d.y ? 0.92 : 0.88, flip: true, armF: 20 + up * 30 + will * 60, armB: 10 + will * 120 * (d.i % 2), head: -up * 6 - will * 6, blink: blinkAt(T, d.seed) });
      });
      hearts.forEach((h, i) => {
        const k = i < 5 ? es(t, 3.3 + i * 0.05, 3.5 + i * 0.05, ease.back) : es(t, 4.35, 4.55, ease.back);
        const d = DIS[i % DIS.length];
        const [hx, hy] = headAt(d.x, d.y || F + 6, 0.9, true, 'sit');
        pose(h, { x: i < 5 ? hx : 612, y: (i < 5 ? hy : 450) - 40, s: k * (1 + will * 0.2), r: Math.sin(T + i) * 6, o: k > 0.01 ? 1 : 0 });
      });
      pose(beam, { o: will });
      light.fade(1);
      SP.forEach((g) => { g.a.set({ x: g.x, y: g.y, o: 1 - es(t, 4.2, 4.4) }); g.b.set({ x: g.x, y: g.y, o: es(t, 4.2, 4.4) }); });
      pose(outGlow, { x: 570, y: WALL - 110, o: es(t, 4.3, 4.6) });
      sp.forEach((s_, i) => {
        const k = es(t, 4.3 + i * 0.06, 4.5 + i * 0.06, ease.back);
        pose(s_, { x: [680, 960, 580, 1100][i], y: [240, 220, 300, 290][i], s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, -50], [0.9, -50], [1.3, -20], [2.0, -20], [2.2, 0], [3.0, 0], [3.3, 20], [4.0, 20], [4.3, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.9, 1.14], [2.0, 1.14], [2.2, 1.1], [3.0, 1.1], [3.3, 1.12], [4.0, 1.12], [4.3, 1.02]]);
      S.cam.y = kf(t, [[-0.5, 50], [2.0, 50], [2.2, 40], [4.0, 50], [4.3, 10]]);
    };
  },
};
