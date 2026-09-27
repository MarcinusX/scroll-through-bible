// Mk 11,20–22 — the next morning the fig tree is withered from the roots (the earth is cut open so we
// see its dry roots). Peter remembers — yesterday's green tree floats up in his thought — and points;
// Jesus answers: "Have faith in God."
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, grass, rock, flowers } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { figTree, thought, bubble, heart, headAt, sparkle, hang2 } from './lib.js';

const PI = Math.PI;
const ROAD = 640;
const TREE = [1010, 640];
const FACE = 668;

export default {
  id: 'm11-withered',
  beats: [
    { v: 20 },
    { v: 21, text: 'Wtedy Piotr przypomniał sobie' },
    { v: 21, cont: true, text: 'i rzekł do Niego: «Rabbi, patrz, drzewo figowe, któreś przeklął, uschło».' },
    { v: 22 },
  ],
  cam: { x: [-60, 120], y: [-60, 60], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    const MORN = ['#cfd6e0', '#f3dfc6', '#f8e9d2'];
    const sk = sky(S, MORN);
    const heav = S.layer({ par: 0.02, sh: 1, flat: true });
    const burst = heav.add(`<g>${rays(c, { n: 20, r0: 40, r1: 1200, spread: 0.05, color: '#fff3cf' })}<circle r="220" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 330, y: 210, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 900, y: 120, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 200, speed: 34, scale: 0.42 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar, x0: -1400, x1: 3200 }).markup);
    const hillL = S.layer({ par: 0.2, sh: 3 });
    const hb = hillsWith(c, { y: 488, amps: [14, 7, 3], lens: [900, 320, 120], color: C.hillMid, trees: 22, treeColor: C.olive, treeH: 20, x0: -1400, x1: 3200 });
    hillL.add(hb.markup + town(c, { x: 60, y: hb.fn(60) + 14, n: 6, spread: 300, sc: 0.7 }) + cypress(c, 1400, hb.fn(1400) + 8, 110));

    /* ---------- the ground, cut open under the tree ---------- */
    const groundL = S.layer({ par: 0.5, sh: 4 });
    const rfn = c.wave(588, [5, 2], [800, 200]);
    const gs = sheet();
    gs.p(c.ridge(rfn, -1400, 3200, 1800, 12, 1), mix(C.hillNear, C.sand2, 0.35));
    gs.p(c.cut([[-1400, 612], [800, 606], [3200, 602], [3200, FACE + 4], [-1400, FACE + 4]], 1.4, 14), mix(C.sand, C.sand2, 0.35));
    // the cut face of the earth: we see under the ground
    gs.p(c.ridge(c.wave(FACE, [3, 1.5], [600, 140]), -1400, 3200, 1800, 10, 1.2), mix(C.soil, C.sand2, 0.3));
    gs.p(c.ridge(c.wave(FACE + 90, [5, 2], [500, 150]), -1400, 3200, 1800, 10, 1.2), shade(mix(C.soil, C.sand2, 0.3), -0.15));
    let cracks = '';
    for (let i = 0; i < 16; i++) { const x = TREE[0] + c.rr(-260, 260), y = c.rr(FACE + 10, FACE + 110); cracks += c.ribbon([[x, y], [x + c.rr(-14, 14), y + c.rr(8, 20)], [x + c.rr(-20, 20), y + c.rr(20, 30)]], 1.4); }
    let pebbles = '';
    for (let i = 0; i < 30; i++) pebbles += c.cut(c.blob(c.rr(-600, 2200), c.rr(FACE + 16, FACE + 180), c.rr(3, 7), c.rr(2, 4), 7, 0.2), 0.3, 3);
    gs.x(pebbles, shade(C.soil, 0.25), 'opacity=".5"');
    gs.x(cracks, C.soilDark, 'opacity=".55"');
    groundL.add(gs.out());
    groundL.add(grass(c, { x0: -800, x1: 2600, y: 598, fn: (x) => rfn(x) + 12, n: 30, h: 12, color: mix(C.olive, C.wheat2, 0.3) }) + flowers(c, { x0: -600, x1: 600, y: 600, n: 10 }) + rock(c, TREE[0] + 180, 612, 50, 20, C.rock));
    const tree = figTree(c, 1.05);
    const treeL = S.layer({ par: 0.5, sh: 5 });
    treeL.add(`<g transform="translate(${TREE[0]} ${FACE - 6})">${tree.rootsDry}</g>`);
    treeL.add(`<g transform="translate(${TREE[0]} ${TREE[1]})">${tree.trunk.replace(/fill="#[0-9a-f]{6}"/, `fill="${mix(C.stone2, C.rock3, 0.4)}"`)}${tree.withered}</g>`);
    // a few dry leaves lie on the ground
    let dl = '';
    for (let i = 0; i < 8; i++) dl += c.cut(c.blob(TREE[0] + c.rr(-160, 160), TREE[1] + c.rr(2, 16), 8, 4, 7, 0.3), 0.6, 3);
    treeL.add(`<path d="${dl}" fill="${mix(C.wood3, C.ochre, 0.3)}"/>`);

    /* ---------- Jesus, Peter and the others ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [CAST.john, CAST.james, CAST.andrew, CAST.thomas, CAST.matthew].map((o, i) => ({ o, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))), dx: -120 - i * 56 - (i % 2) * 10, dy: -14 + (i % 2) * 10 }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const peter = { seed: c.rr(0, 9), p: S.puppet(L.add(person(c, CAST.peter))) };

    /* ---------- memory, words, faith ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const memTree = figTree(c, 0.2);
    const memory = fx.add(`<g>${thought(c, `<g transform="translate(0 30)">${memTree.trunk}${memTree.leaves}</g>`, { w: 110, h: 92 })}</g>`);
    const say = fx.add(`<g>${bubble(c, [tr('Rabbi, patrz!', 'Rabbi, look!')], { size: 20, tail: -1 })}</g>`);
    const faith = hanging(fx, `<g transform="scale(1.5)">${heart(c, 22)}</g>`, { x: 700, y: 230, len: 800 });
    const sparks = [0, 1, 2, 3, 4].map((i) => fx.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      sk.blend(MORN, ['#d3e2dc', '#f2e6c8', '#f8ebd3'], es(t, 0, 3));
      swing(sunEl, 330, 210 - es(t, 0, 4) * 60, T, 1, 0.6);
      swing(cl1, 900 + Math.sin(T * 0.1) * 26, 120, T, 1.3, 0.6, 1);
      birds(T, 1);
      const faithK = es(t, 3.05, 3.4);
      pose(burst, { x: 700, y: -80, s: 0.5 + faithK * 0.5, r: t * 5, o: faithK * 0.45 });

      /* v20 — they pass by in the morning and see it */
      const walkIn = es(t, 0.0, 0.6, ease.out);
      const jx = lerp(260, 700, walkIn);
      const walking = walkIn > 0 && walkIn < 1;
      const see = es(t, 0.55, 0.75);
      const turnTo = es(t, 3.0, 3.15);
      jesus.set({ x: jx, y: ROAD, s: 1.02, flip: turnTo > 0.5, walk: walking ? jx * 0.05 : undefined, head: -see * 4 * (1 - turnTo), armF: turnTo * 70, armB: turnTo * 110, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const x = jx + d.dx;
        d.p.set({ x, y: ROAD + d.dy, s: 0.9, walk: walking ? x * 0.05 + d.i : undefined, head: -see * 6 - faithK * 10, armF: see * (d.i === 1 ? 60 : 0) * (1 - faithK), armB: faithK * (d.i % 2 ? 120 : 0), blink: blinkAt(T, d.seed) });
      });
      /* v21 — Peter remembers, and points */
      const remember = es(t, 1.05, 1.3);
      const point = es(t, 2.05, 2.3);
      const px = jx + 100 * (1 - point * 0.3) + point * 70;
      const pX = jx + 110;
      const pflip = false;
      peter.p.set({ x: pX, y: ROAD + 8, s: 0.95, flip: pflip, walk: walking ? pX * 0.05 + 3 : undefined, armF: remember * 40 * (1 - point) + point * 92 * (1 - faithK * 0.7), armB: point * 20, head: -remember * 10 * (1 - point) + point * 4 - faithK * 6, blink: blinkAt(T, peter.seed) });
      const [phx, phy] = headAt(pX, ROAD + 8, 0.95, pflip);
      const mk = es(t, 1.1, 1.4, ease.back) * (1 - es(t, 2.0, 2.2));
      pose(memory, { x: phx + 6, y: phy - 16, s: mk * 1.1, o: mk > 0.02 ? 1 : 0 });
      const sk2 = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(say, { x: phx + 30, y: phy - 30, s: sk2, o: sk2 > 0.02 ? 1 : 0 });
      /* v22 — "Have faith in God" */
      swing(faith, 760, 250 - (1 - es(t, 3.05, 3.4, ease.back)) * 700, T, 1.2, 0.8);
      sparks.forEach((sp, i) => {
        const k = ((T * 0.3 + i / 5) % 1);
        pose(sp, { x: 600 + i * 50 + Math.sin(T + i) * 10, y: 300 + k * 160, s: 0.8, r: T * 40, o: faithK * Math.sin(k * PI) });
      });

      S.cam.x = -40 + walkIn * 40 + es(t, 0.5, 1.0) * 60 - es(t, 1.0, 1.3) * 40 + es(t, 2.0, 2.4) * 60 - faithK * 60;
      S.cam.y = 10 - faithK * 40 + es(t, 0.5, 1.0) * 20;
      S.cam.z = 1.04 + es(t, 1.0, 1.3) * 0.06 - faithK * 0.08;
    };
  },
};
