// Łk 10,1 — the curtains open on the hill country on the road to Jerusalem, in the morning. Jesus stands on a green
// knoll with Peter and John; below lies a wide valley and, on the hills beyond, village after village. "The Lord
// appointed seventy-two others": from both sides His disciples come up the slope and gather in front of Him, pair by
// pair, and as He lifts His hands a small light settles over each pair. "And He sent them two by two ahead of Him into
// every town and place where He Himself was about to come": the pairs turn and go over the knoll, and out along the
// roads that fan across the valley — two by two, smaller and smaller, to every village. As each pair arrives, a lamp
// is lit in its village, and a dotted golden trail runs back along every road: the way He Himself will come.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { countrySet, KN, HUB, ROADS, VILLAGES, roadS, along, pairWalk, glow, folk, sparkle, kf, moving, headAt, MORNING, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const JX = KN.X, JY = 688;
/* the twelve pairs that gather in front of Him: [x, y, s, facing-left] */
const NEAR = [
  [470, 742, 0.78], [560, 748, 0.8], [650, 752, 0.82], [950, 752, 0.82], [1040, 748, 0.8], [1130, 742, 0.78],
  [420, 792, 0.86], [530, 800, 0.88], [640, 806, 0.9], [960, 806, 0.9], [1070, 800, 0.88], [1180, 792, 0.86],
];

export default {
  id: 'lk10-seventy',
  beats: [
    { cover: true },
    { v: 1, text: 'Następnie wyznaczył Pan jeszcze innych siedemdziesięciu dwóch' },
    { v: 1, cont: true, text: 'i wysłał ich po dwóch przed sobą do każdego miasta i miejscowości, dokąd sam przyjść zamierzał.' },
  ],
  cam: { x: [-30, 30], y: [-70, 40], z: [1, 1.1] },
  build(S) {
    const K = countrySet(S, { skyCols: MORNING, sunAt: [1250, 150] });
    const c = S.c;
    const pc = makeCutter('lk10-seventy-people');

    /* the pairs on the roads (far, small): three per road, drawn at their nearest size */
    const RP = [];
    ROADS.forEach((r, ri) => {
      const left = VILLAGES[ri][0] < 800;
      for (let j = 0; j < 3; j++) {
        const a = j === 0 && ri < 2 ? SENT_A : folk(pc, true), b = j === 0 && ri < 2 ? SENT_B : folk(pc, true);
        RP.push({ ri, j, left, sp: K.walk.sprite(pairWalk(pc, a, b, { s: 0.5, flip: left }), HUB[0], HUB[1]), d: 2.12 + j * 0.16 + (ri % 3) * 0.05 });
      }
    });

    /* Jesus, Peter and John on the knoll */
    const P = S.layer({ par: 0.45, sh: 5 });
    const aura = P.add(`<g>${glow(170, 0.6)}</g>`);
    const peter = S.puppet(P.add(person(c, CAST.peter)));
    const john = S.puppet(P.add(person(c, CAST.john)));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    /* the seventy-two in front, pair by pair (still sprites) */
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const pairs = NEAR.map(([x0, y, s], i) => {
      const x = S.portrait ? 800 + (x0 - 800) * 0.8 : x0;   // phone: the outer pairs inside the screen, clear of the thread
      const left = x > 800;
      const a = folk(pc, true), b = i % 3 === 1 ? folk(pc, false) : folk(pc, true);
      const m = [
        { x: -30, y: -4, s, flip: left, o: a },
        { x: 30, y: 2, s: s * 0.97, flip: left, o: b },
      ];
      return { i, x, y, s, left, sp: crowdL.sprite(m.slice().sort((p, q) => p.y - q.y).map((q) => `<g transform="translate(${q.x} ${q.y}) scale(${q.flip ? -q.s : q.s} ${q.s})">${person(pc, q.o)}</g>`).join(''), x, y) };
    });
    const fx = S.layer({ par: 0.46, sh: 4 });
    const sparks = NEAR.map(() => fx.add(`<g>${sparkle(c, 13)}</g>`));

    return (t, time) => {
      const T = time;
      K.update(T);

      /* v1a — they come up the slope from both sides and gather before Him; a light settles over each pair */
      const bless = es(t, 1.45, 1.7) * (1 - es(t, 1.95, 2.1));
      const send = es(t, 2.05, 2.3) * (1 - es(t, 2.85, 3.0));
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 16 + bless * 100 + send * 70, armB: 10 + bless * 130 + es(t, 2.8, 3.0) * 30, head: -bless * 8 - send * 6, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 120, s: 0.9 + bless * 0.4, o: 0.35 + bless * 0.5 });
      peter.set({ x: 650, y: JY - 10, s: 0.92, flip: false, armF: 12 + send * 30, armB: 8, head: -2, blink: blinkAt(T, 2) });
      john.set({ x: 950, y: JY - 8, s: 0.9, flip: true, armF: 12 + send * 30, armB: 8, head: -2, blink: blinkAt(T, 3) });

      pairs.forEach((p) => {
        const d = (p.i % 6) * 0.05 + (p.i >= 6 ? 0.08 : 0);
        const come = es(t, 1.0 + d, 1.45 + d);
        const x0 = p.x + (p.left ? 700 : -700) * (1 - come);
        const bob = come > 0 && come < 1 ? Math.abs(Math.sin(come * 20 + p.i)) * 4 : 0;
        // v1b — they go up over the knoll, toward the roads
        const go = es(t, 2.04 + (p.i % 6) * 0.04 + (p.i >= 6 ? 0.1 : 0), 2.5 + (p.i % 6) * 0.04 + (p.i >= 6 ? 0.1 : 0), ease.in);
        const x = lerp(x0, lerp(p.x, 800, 0.55), go), y = lerp(p.y, 680, go) - bob;
        p.sp.set({ x, y, s: lerp(1, 0.66, go), o: seg(t, 0.99 + d, 1.04 + d) * (1 - seg(t, 2.3 + (p.i % 6) * 0.04, 2.5 + (p.i % 6) * 0.04 + (p.i >= 6 ? 0.1 : 0))) });
        const sk = bump(t, 1.5 + (p.i % 6) * 0.03, 1.95 + (p.i % 6) * 0.03);
        pose(sparks[p.i], { x: p.x, y: p.y - 170 * p.s - 10, s: sk, r: T * 40, o: sk });
      });

      /* v1b — two by two along every road, to every village */
      const arrived = [0, 0, 0, 0, 0, 0];
      RP.forEach((w) => {
        const u = es(t, w.d, w.d + 0.62, (x) => x);
        const [x, y] = along(ROADS[w.ri], u);
        const s = roadS(y) / 0.5;
        const bob = u > 0 && u < 1 ? Math.abs(Math.sin(u * 40 + w.ri)) * 2 * s : 0;
        w.sp.set({ x, y: y - bob, s, o: seg(t, w.d, w.d + 0.03) * (1 - seg(t, w.d + 0.58, w.d + 0.64)) });
        if (w.j === 0) arrived[w.ri] = es(t, w.d + 0.55, w.d + 0.66);
      });
      K.lampsOn(arrived, T);
      K.trails.forEach((el, i) => pose(el, { o: es(t, 2.72 + i * 0.03, 2.9 + i * 0.03) }));

      S.cam.x = 0;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.02], [1.6, 1.07], [2.05, 1.06], [2.6, 1.0], [3, 1.0]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.6, 30], [2.05, 20], [2.6, -40], [3, -40]]);
    };
  },
};
