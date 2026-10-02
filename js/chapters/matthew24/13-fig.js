// Mt 24,32–33 — a spring morning on the Mount of Olives (Mark 13's fig tree and door). "From the fig tree learn this
// parable": Jesus points to a bare fig tree; a round lens comes down with one branch close up. "When its branch
// becomes tender and puts out leaves, you know that summer is near": the sap runs green through it, the buds swell,
// the leaves unfold — and the real tree comes into leaf while the sun climbs. "So you too, when you see all these
// things, know that He is near, at the doors": a door stands up on the hill with light leaking round its edges, and it
// opens a crack.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, flock } from '../kit.js';
import { bird } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { olivesSet, SKIES, FOUR, figTree, roundel, voiceRings, PI } from './lib.js';

const GY = 690, TREE_W = [470, 684], DOOR_W = [1112, GY];
// phone: the tree and the door come in from the edges (and the camera leans further towards each)
const TREE_P = [515, 684], DOOR_P = [1085, GY];
const LENS = { x: 640, y: 250, r: 104 };

/** a fig leaf (three lobes), origin at its stalk, pointing up */
function figLeaf(c, r = 22, col = C.leaf) {
  const pts = [];
  for (let i = 0; i < 18; i++) {
    const u = (i / 18) * PI * 2, lobe = 0.6 + 0.4 * Math.abs(Math.cos(u * 1.5));
    pts.push([Math.cos(u) * r * lobe * 0.95, -r + Math.sin(u) * r * lobe]);
  }
  return sheet().p(c.cut(pts, 0.3, 4), col).x(c.ribbon([[0, 0], [0, -r * 1.3]], 1.4) + c.ribbon([[0, -r * 0.8], [-r * 0.5, -r * 1.3]], 1.1) + c.ribbon([[0, -r * 0.8], [r * 0.5, -r * 1.3]], 1.1), shade(col, -0.25), 'opacity=".6"').out();
}

export default {
  id: 'mt24-fig',
  parable: true,
  beats: [
    { v: 32, text: 'A od figowego drzewa uczcie się przez podobieństwo!' },
    { v: 32, cont: true, text: 'Gdy jego gałązka staje się soczysta i liście wypuszcza, poznajecie, że zbliża się lato.' },
    { v: 33 },
  ],
  cam: { x: [-45, 55], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PH = S.portrait, TREE = PH ? TREE_P : TREE_W, DOOR = PH ? DOOR_P : DOOR_W;
    const set = olivesSet(S, { skyCols: SKIES.morning, tintCol: C.cream, tintK: 0.05, sunXY: [1240, 330], templeGlow: 0.4 });
    const birds = flock(S, set.hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 200, speed: 60, scale: 0.4 });

    /* the fig tree: bare twigs, then leaves */
    const treeL = S.layer({ par: 0.5, sh: 5 });
    const ft = figTree(c, 1.08);
    treeL.add(`<g transform="translate(${TREE[0]} ${TREE[1]})">${ft.withered.replace(/fill="#[0-9a-f]{6}"/, `fill="${mix(C.stone2, C.wood3, 0.45)}"`)}${ft.trunk}</g>`);
    const leaves = treeL.add(`<g transform="translate(0 -1500)">${ft.leaves}</g>`);

    /* the door on the hill, light behind it */
    const doorL = S.layer({ par: 0.5, sh: 6 });
    const light = doorL.add(`<g transform="translate(0 -1500)"><circle cy="-120" r="230" fill="url(#halo-glow)"/><path d="${c.poly([[-60, -230], [60, -230], [140, -320], [-140, -320]]) + c.poly([[62, -228], [62, 0], [180, 40], [180, -300]]) + c.poly([[-62, -228], [-62, 0], [-180, 40], [-180, -300]])}" fill="#fff3cf" opacity=".35"/></g>`);
    const frameS = sheet();
    frameS.p(c.cut([[-86, 4], [-86, -250], ...c.arc(0, -250, 86, 40, PI, 2 * PI, 12), [86, -250], [86, 4], [66, 4], [66, -236], ...c.arc(0, -236, 66, 26, 2 * PI, PI, 12), [-66, -236], [-66, 4]], 0.6, 8), mix(C.stone, C.sand, 0.3));
    frameS.p(c.cut(c.rect(-96, -6, 192, 12), 0.4, 8), C.stone2);
    const frame = doorL.add(`<g transform="translate(0 -1500)">${frameS.out()}</g>`);
    const glowIn = doorL.add(`<g transform="translate(0 -1500)"><path d="${c.cut([[-66, 2], [-66, -236], ...c.arc(0, -236, 66, 26, PI, 2 * PI, 12), [66, -236], [66, 2]], 0.3, 6)}" fill="${C.lampGlow}"/></g>`);
    const leafS = sheet();
    leafS.p(c.cut([[0, 0], [0, -236], [128, -236], [128, 0]], 0.4, 6), C.wood);
    let planks = '';
    for (let x = 22; x < 128; x += 26) planks += c.ribbon([[x, -230], [x, -6]], 1.6);
    leafS.x(planks, shade(C.wood, -0.25), 'opacity=".6"');
    leafS.p(c.cut(c.rect(8, -190, 112, 10), 0.3, 5) + c.cut(c.rect(8, -60, 112, 10), 0.3, 5), C.wood2);
    leafS.p(c.cut(c.circ(110, -120, 6, 10), 0.2, 3), C.ochre);
    const door = doorL.add(`<g transform="translate(0 -1500)">${leafS.out()}</g>`);
    const spill = doorL.add(`<g transform="translate(0 -1500)"><path d="M-60 6L60 6L150 90L-150 90Z" fill="${C.lampGlow}" opacity=".45"/></g>`);

    /* Jesus and the four */
    const P = S.layer({ par: 0.55, sh: 5 });
    const pos = [590, 660, 930, 996];
    const four = FOUR.map((f, i) => ({ ...f, i, x: pos[i], flip: pos[i] > 800, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, f.o))) }));
    const J = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 26, w: 4 });

    /* the lens: one branch close up */
    const lensL = S.layer({ par: 0.35, sh: 6 });
    const lensEl = lensL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V${-LENS.r - 8}" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${roundel(c, LENS.r, { face: mix(C.skyBlue, C.cream, 0.5) })}</g>`);
    const BR = c.qbez([-86, 60], [-10, 30], [74, -54], 14);
    const branch = lensL.add(`<g transform="translate(0 -1500)">${sheet().p(c.ribbon(BR, (u) => 16 - u * 10), mix(C.stone2, C.wood3, 0.45)).x(c.ribbon([[20, 12], [40, -30], [34, -64]], (u) => 7 - u * 5), mix(C.stone2, C.wood3, 0.45)).out()}</g>`);
    const sap = lensL.add(`<g transform="translate(0 -1500)"><path d="${c.ribbon(BR, (u) => 7 - u * 4)}" fill="${C.wheatGreen}"/></g>`);
    const BUDS = [[-40, 42, -30], [4, 20, -10], [40, -14, 20], [72, -52, 30], [34, -62, -20], [-64, 52, -50]];
    const buds = BUDS.map(([x, y, r], i) => ({ i, x, y, r, bud: lensL.add(`<g transform="translate(0 -1500)"><path d="${c.cut([[-5, 0], [0, -14], [5, 0]], 0.2, 3)}" fill="${C.wheatGreen}"/></g>`), leaf: lensL.add(`<g transform="translate(0 -1500)">${figLeaf(c, 24, i % 2 ? C.leaf : mix(C.leaf, C.sage, 0.4))}</g>`) }));

    return (t, time) => {
      const T = time;
      const summer = es(t, 1.1, 2.0);
      set.update(t, T, { sun: 330 - es(t, 0.8, 2.2) * 150, sunO: 1, moonO: 0, glow: 0.35, starsO: 0 });
      birds(T, summer);

      /* the tree comes into leaf (beat 1) */
      const lf = es(t, 1.35, 1.95);
      pose(leaves, { x: TREE[0], y: TREE[1] - 232 - (1 - lf) * 20, s: Math.max(0.001, 0.4 + lf * 0.6), o: lf, ox: 0, oy: -230 * 1.08 });

      /* the lens (beats 0–1) */
      const ln = es(t, 0.2, 0.55, ease.back) * (1 - es(t, 2.05, 2.35));
      const lx = LENS.x, ly = lerp(-260, LENS.y, ln);
      const on = ln > 0.001 ? 1 : 0;
      pose(lensEl, { x: lx, y: ly, r: Math.sin(T * 0.8) * 1.2 * ln, o: on });
      pose(branch, { x: lx, y: ly, o: on });
      const sp = es(t, 1.05, 1.45);
      pose(sap, { x: lx - 86, y: ly + 60, sx: Math.max(0.001, sp), sy: Math.max(0.001, sp), ox: -86, oy: 60, o: on * (sp > 0.01 ? 1 : 0) });
      buds.forEach((b) => {
        const sw = es(t, 1.2 + b.i * 0.04, 1.45 + b.i * 0.04, ease.back);
        const op = es(t, 1.45 + b.i * 0.05, 1.8 + b.i * 0.05, ease.back);
        pose(b.bud, { x: lx + b.x, y: ly + b.y, r: b.r, s: 0.6 + sw * 0.6, o: on * (1 - op) });
        pose(b.leaf, { x: lx + b.x, y: ly + b.y, r: b.r + Math.sin(T * 1.3 + b.i) * 3 * op, s: Math.max(0.001, op * 0.95), o: on * (op > 0.01 ? 1 : 0) });
      });

      /* the door: stands up on the hill, light round its edges; opens a crack (beat 2) */
      const dIn = es(t, 1.95, 2.3, ease.out);
      const open = es(t, 2.35, 2.7);
      const dy = DOOR[1] + (1 - dIn) * 400;
      const don = dIn > 0.01 ? 1 : 0;
      pose(frame, { x: DOOR[0], y: dy, o: don });
      pose(glowIn, { x: DOOR[0], y: dy, o: don });
      pose(door, { x: DOOR[0] - 64, y: dy, sx: 1 - open * 0.3, o: don });
      pose(light, { x: DOOR[0], y: dy, o: es(t, 2.2, 2.5) * (0.7 + open * 0.3) });
      pose(spill, { x: DOOR[0], y: dy, sx: 0.3 + open * 0.7, o: open });

      /* Jesus points: to the tree (0), shows the branch (1), to the door (2) */
      const toTree = es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.1));
      const toDoor = es(t, 2.1, 2.4);
      const left = toTree > 0.5 && toDoor < 0.5;
      J.set({ x: 800, y: GY, s: 1.04, flip: left, armF: 20 + toTree * 85 + toDoor * 80, armB: 10 + bump(t, 1.2, 1.9) * 40, head: -toTree * 6 - toDoor * 4 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(800 + (left ? -6 : 6), GY - 172, bump(t, 0.05, 0.9) + es(t, 2.1, 2.3) * 0.7, T, { dir: left ? -1 : 1, s0: 0.7 });

      four.forEach((m) => {
        const lookTree = es(t, 0.15 + m.i * 0.05, 0.4 + m.i * 0.05) * (1 - es(t, 2.1, 2.3));
        const lookDoor = es(t, 2.2 + m.i * 0.04, 2.45 + m.i * 0.04);
        const flip = lookDoor > 0.5 ? false : lookTree > 0.5 ? true : m.flip;
        m.p.set({ x: m.x, y: GY + (m.i % 2) * 4, s: 0.92, flip, head: -lookTree * 10 - bump(t, 1.2, 1.9) * 6, armF: (m.k === 'peter' ? bump(t, 1.3, 1.9) * 80 : 0) + (m.k === 'john' ? lookDoor * 60 : 0), blink: blinkAt(T, m.seed) });
      });

      S.cam.x = -es(t, 0.1, 0.6) * (PH ? 40 : 20) * (1 - es(t, 1.9, 2.3)) + es(t, 1.95, 2.4) * (PH ? 50 : 25);
      S.cam.y = -es(t, 0.1, 0.6) * 20 * (1 - es(t, 1.9, 2.3));
    };
  },
};
