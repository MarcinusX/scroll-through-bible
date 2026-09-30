// Łk 10,17 — the hill country again, in the gold of the evening; a lamp still burns in every village. "The seventy-two
// returned with joy": down every road they come, two by two, faster and faster, and up over the knoll they come
// running with their hands in the air and gather round Jesus. "Lord, even the demons are subject to us in your name!":
// the elder and the young one tell it with their whole bodies, and over the heads of the others small pictures pop up
// one after another — a man bent under a dark shadow, and the shadow fleeing out of him at the Name.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { countrySet, KN, HUB, ROADS, VILLAGES, roadS, along, pairWalk, glow, folk, stillGroup, barefoot, figure, wisp, thought, sparkle, kf, moving, GOLDEN, EVENING, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';

const JX = KN.X, JY = 688;
const NEAR = [
  [440, 742, 0.78], [540, 750, 0.8], [1060, 750, 0.8], [1160, 742, 0.78],
  [400, 796, 0.86], [520, 802, 0.88], [1080, 802, 0.88], [1200, 796, 0.86],
];
const AX = 640, BX = 712;

export default {
  id: 'lk10-return',
  beats: [
    { v: 17, text: 'Wróciło siedemdziesięciu dwóch z radością mówiąc:' },
    { v: 17, cont: true, text: '«Panie, przez wzgląd na Twoje imię, nawet złe duchy nam się poddają».' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const K = countrySet(S, { skyCols: GOLDEN, sky2: EVENING, sunAt: [1260, 250] });
    const c = S.c;
    const pc = makeCutter('lk10-return-people');
    K.trails.forEach((el) => pose(el, { o: 0.8 }));

    /* the pairs coming back down every road (small sprites facing the hub) */
    const RP = [];
    ROADS.forEach((r, ri) => {
      const left = VILLAGES[ri][0] < 800;
      for (let j = 0; j < 2; j++) RP.push({ ri, j, sp: K.walk.sprite(pairWalk(pc, folk(pc, true), folk(pc, true), { s: 0.5, flip: !left }), HUB[0], HUB[1]), d: j * 0.18 + (ri % 3) * 0.05 });
    });

    /* Jesus on the knoll; the seventy-two gathering round Him, hands up for joy */
    const P = S.layer({ par: 0.45, sh: 5 });
    const aura = P.add(`<g>${glow(170, 0.6)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const pairs = NEAR.map(([x, y, s], i) => {
      const left = x > 800;
      const m = [{ x: -30, y: -4, s, flip: left, o: folk(pc, true) }, { x: 30, y: 2, s: s * 0.97, flip: left, o: folk(pc, true) }];
      const joy = m.map((q, k) => ({ ...q, armF: 70 + k * 30, armB: 150 - k * 10, head: -10 }));
      const calm = m.map((q) => ({ ...q, armF: 30, armB: 14, head: -4 }));
      return { i, x, y, s, left, joy: crowdL.sprite(stillGroup(pc, joy), x, y), calm: crowdL.sprite(stillGroup(pc, calm), x, y) };
    });
    const A = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const B = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));

    /* the little pictures of the spirits fleeing */
    const fx = S.layer({ par: 0.46, sh: 5 });
    const pic = (seed) => {
      const q = makeCutter(seed);
      return `<g transform="translate(-18 40)">${figure(q, folk(q, true), { x: 0, y: 0, s: 0.4, armF: 60, armB: 150, head: -14 })}</g><g class="w" transform="translate(18 -10) rotate(30)">${wisp(q, 1.5, '#3e3448')}</g>`;
    };
    const BUB = [[530, 450], [800, 380], [1070, 450]].map(([x, y], i) => ({ i, x, y, el: fx.add(`<g>${thought(c, pic('lk10-pic' + i), { w: 140, h: 116 })}</g>`) }));
    const pops = BUB.map(() => fx.add(`<g>${sparkle(c, 14)}</g>`));

    return (t, time) => {
      const T = time;
      K.update(T, { sunY: lerp(250, 320, es(t, 0, 2)) });
      K.sk2.layer.fade(es(t, 0.8, 2.0) * 0.8);
      K.lampsOn([1, 1, 1, 1, 1, 1], T);

      /* v17a — down every road, then up over the knoll */
      RP.forEach((w) => {
        const u = es(t, w.d, w.d + 0.55, (x) => x);
        const [x, y] = along(ROADS[w.ri], 1 - u);
        const bob = u > 0 && u < 1 ? Math.abs(Math.sin(u * 50 + w.ri)) * 3 : 0;
        w.sp.set({ x, y: y - bob, s: roadS(y) / 0.5, o: (u < 1 ? 1 : 0) * seg(t, -0.1, 0.0) });
      });
      pairs.forEach((p) => {
        const d = (p.i % 4) * 0.05 + (p.i >= 4 ? 0.08 : 0);
        const up = es(t, 0.4 + d, 0.78 + d, ease.out);
        const x = lerp(lerp(p.x, 800, 0.5), p.x, up), y = lerp(680, p.y, up);
        const bob = up > 0 && up < 1 ? Math.abs(Math.sin(up * 22 + p.i)) * 6 : 0;
        const calm = es(t, 1.05, 1.1) * (1 - es(t, 1.62, 1.68));
        const o = seg(t, 0.4 + d, 0.45 + d);
        p.joy.set({ x, y: y - bob, s: lerp(0.7, 1, up), o: o * (1 - calm) });
        p.calm.set({ x, y, s: 1, o: o * calm });
      });

      /* v17b — the two tell Him; the pictures pop up */
      const tellA = es(t, 1.04, 1.14), tellB = es(t, 1.2, 1.3);
      const g = (k) => (time ? Math.sin(T * 6 + k) * 18 : 0);
      const arrive = es(t, 0.45, 0.8);
      A.set({ x: lerp(560, AX, arrive), y: 744, s: 0.98, flip: false, walk: arrive > 0 && arrive < 1 ? t * 30 : undefined, armF: 30 + (1 - tellA) * 90 * arrive + tellA * (70 + g(0)), armB: 20 + (1 - tellA) * 120 * arrive + tellA * 30, head: -8, blink: blinkAt(T, 2) });
      B.set({ x: lerp(640, BX, arrive), y: 750, s: 0.95, flip: false, walk: arrive > 0 && arrive < 1 ? t * 30 + 1 : undefined, armF: 30 + (1 - tellB) * 100 * arrive + tellB * (100 + g(1)), armB: 10 + (1 - tellB) * 130 * arrive + tellB * (120 + g(2)), head: -10, blink: blinkAt(T, 3) });
      const welcome = es(t, 0.5, 0.8);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: true, armF: 20 + welcome * 60 * (1 - es(t, 1.0, 1.2)) + es(t, 1.2, 1.4) * 20, armB: 10 + welcome * 90 * (1 - es(t, 1.0, 1.2)), head: 4, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 120, o: 0.6 });
      BUB.forEach((b) => {
        const k = es(t, 1.12 + b.i * 0.14, 1.26 + b.i * 0.14, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.01 ? 1 : 0 });
        const flee = es(t, 1.3 + b.i * 0.14, 1.6 + b.i * 0.14);
        const w = b.el.querySelector('.w');
        pose(w, { x: 18 + flee * 26, y: -10 - flee * 18, r: 30 + flee * 40, s: 1 - flee * 0.3, o: 1 - flee * 0.55 });
        const pk = bump(t, 1.4 + b.i * 0.14, 1.7 + b.i * 0.14);
        pose(pops[b.i], { x: b.x + 30, y: b.y - 90, s: pk, r: T * 40, o: pk });
      });

      S.cam.x = 0;
      S.cam.z = kf(t, [[0, 1.0], [0.6, 1.0], [1.0, 1.06], [2, 1.06]]);
      S.cam.y = kf(t, [[0, -40], [0.6, -20], [1.0, 20], [2, 20]]);
    };
  },
};
