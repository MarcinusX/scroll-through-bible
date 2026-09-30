// Łk 6,36–37 — back on the level place. "Be merciful, as your Father is merciful": Jesus opens His arms; high above
// the plain a great soft radiance opens (the Father is never shown, only light) and warm rays come down over the whole
// crowd. "Do not judge… do not condemn… forgive, and you will be forgiven": in the front row three little scenes
// play out at once — a man pointing at his neighbour lowers his finger and holds out his hand instead; a man holding a
// sealed verdict over a kneeling one tears it in two; and a creditor unlocks the fetters on his debtor's wrists, the
// chain falls, and the freed man lifts his hands — while over each of them a small light kindles in return.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { chain, fetter } from '../mark5/lib.js';
import { plainSet, PL, radiance, rayBurst, kf, headAt, handAt, sparkle, halo, manO, womanO, tr, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

function verdict(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-22, -30, 44, 60), 0.4, 5), C.parchment);
  let ln = '';
  for (let i = 0; i < 5; i++) ln += c.ribbon([[-14, -20 + i * 9], [14 - c.rr(0, 10), -20 + i * 9]], 1.3);
  s.x(ln, C.ink, 'opacity=".5"');
  s.p(c.cut(c.circ(0, 22, 7, 10), 0.3, 3), '#3b3346');
  return s.out();
}
function half(c, side) {
  const s = sheet();
  const x0 = side < 0 ? -22 : 0, x1 = side < 0 ? 0 : 22;
  const pts = side < 0 ? [[x0, -30], [x1 + 2, -30], [x1 - 3, -12], [x1 + 3, 4], [x1 - 2, 30], [x0, 30]] : [[x0 + 2, -30], [x1, -30], [x1, 30], [x0 - 2, 30], [x0 + 3, 4], [x0 - 3, -12]];
  s.p(c.cut(pts, 0.4, 4), C.parchment);
  return s.out();
}

export default {
  id: 'lk6-mercy',
  beats: [
    { v: 36 },
    { v: 37 },
  ],
  cam: { x: [-20, 20], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    let rad, beams;
    const P = plainSet(S, {
      dis: false,
      behind: (S2) => {
        const skyLight = S2.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
        rad = skyLight.add(`<g opacity="0"><circle r="330" fill="url(#halo-glow)"/>${radiance(c, 120)}</g>`);
        beams = skyLight.add(`<g opacity="0">${rayBurst(c, { n: 30, r0: 110, r1: 1300, spread: 0.03, color: '#fff3cf', o: 0.45 })}</g>`);
      },
    });
    const pc = makeCutter('lk6-mercy-people');

    /* the light of the Father's mercy, high above (behind everything but the sky) */
    const aura = P.aura;
    const lights = P.crowd.map(() => P.fx.add(`<g opacity="0">${sparkle(c, 9)}</g>`));

    /* three pairs in the front row */
    const L = P.act;
    const PAIRS = [
      { x: 470, kind: 'judge', a: manO(pc, { robe: C.ochreRobe }), b: womanO(pc, { robe: C.tealRobe }) },
      { x: 1110, kind: 'condemn', a: manO(pc, { robe: C.plumRobe, mantle: C.linen2 }), b: manO(pc, { robe: C.stone2 }) },
      { x: 640, kind: 'release', a: manO(pc, { robe: C.clayMantle, belt: C.sun }), b: manO(pc, { robe: mix(C.stone2, C.sand2, 0.4) }) },
    ].map((p, i) => ({ ...p, i, seed: pc.rr(0, 9), pa: S.puppet(L.add(person(c, p.a))), pb: S.puppet(L.add(person(c, { ...p.b, pose: 'kneel' }))), pb2: S.puppet(L.add(person(c, p.b))) }));
    const ver = L.add(`<g>${verdict(c)}</g>`);
    const verL = L.add(`<g opacity="0">${half(c, -1)}</g>`), verR = L.add(`<g opacity="0">${half(c, 1)}</g>`);
    const fet = L.add(`<g>${fetter(c, 11)}<g transform="translate(10 0)">${chain(c, 3, 6)}</g><g transform="translate(34 0)">${fetter(c, 11)}</g></g>`);
    const pops = PAIRS.map(() => P.fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const jesus = P.jesus;

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v36 — merciful as the Father */
      const open = es(t, 0.05, 0.35);
      jesus.set({ x: PL.JX, y: PL.JY, s: PL.JS, flip: false, armF: 16 + open * 80 * (1 - es(t, 1.0, 1.2)) + bump(t, 1.05, 1.85) * 30, armB: 10 + open * 120 * (1 - es(t, 1.0, 1.2)), head: -4 * open, blink: blinkAt(T) });
      const lit = es(t, 0.15, 0.55);
      pose(rad, { x: 800, y: -40, s: 0.8 + lit * 0.3, r: T * 2, o: lit });
      pose(beams, { x: 800, y: -40, r: T * 1.2, o: lit * (1 - es(t, 1.2, 1.6) * 0.4) });
      pose(aura, { x: PL.JX, y: PL.JY - 120, s: 1 + open * 0.3, o: 0.5 + open * 0.4 });
      P.crowd.forEach((g, i) => {
        const at = 0.35 + (Math.abs(g.x - 800) / 700) * 0.3 + g.row * 0.05;
        const k = es(t, at, at + 0.2) * (1 - es(t, 1.1, 1.3) * 0.7);
        pose(lights[i], { x: g.x, y: g.y - 160 * [0.5, 0.58, 0.66][g.row] - 14, s: 1, r: T * 30, o: k });
      });

      /* v37 — do not judge, do not condemn, forgive */
      PAIRS.forEach((p) => {
        const flip = p.x > 800;
        const d = flip ? -1 : 1;
        const ax = p.x - d * 40, bx = p.x + d * 44;
        const k0 = 1.05 + p.i * 0.18;
        const act = es(t, k0, k0 + 0.16);
        const joy = es(t, k0 + 0.16, k0 + 0.32);
        const point = p.kind === 'judge' ? 1 - act : 0;
        const hold = p.kind === 'condemn' ? 1 - es(t, k0 + 0.06, k0 + 0.1) : 0;
        p.pa.set({ x: ax, y: 770, s: 0.92, flip, armF: 20 + point * 70 + act * (p.kind === 'judge' ? 50 : 30) + hold * 70 + (p.kind === 'release' ? bump(t, k0, k0 + 0.25) * 50 : 0), armB: 10 + (p.kind === 'condemn' ? act * 60 : 0), head: act * 6 - point * 4, blink: blinkAt(T, p.seed) });
        const stood = p.kind === 'judge' ? es(t, k0 + 0.14, k0 + 0.18) : es(t, k0 + 0.14, k0 + 0.18);
        p.pb.set({ x: bx, y: 772, s: 0.9, flip: !flip, o: 1 - stood, armF: p.kind === 'release' ? 70 : 40, armB: 20, head: 14, blink: blinkAt(T, p.seed + 1) });
        p.pb2.set({ x: bx, y: 772, s: 0.9, flip: !flip, o: stood, armF: 40 + joy * 60, armB: 20 + joy * 120, head: -joy * 8, blink: blinkAt(T, p.seed + 1) });
        const [hx, hy] = headAt(bx, 772, 0.9, !flip);
        const pk = bump(t, k0 + 0.18, k0 + 0.7);
        pose(pops[p.i], { x: hx, y: hy - 50, s: pk, r: T * 40, o: pk });
        if (p.kind === 'condemn') {
          const [vx, vy] = handAt(ax, 770, 0.92, flip, 90);
          const torn = es(t, k0 + 0.08, k0 + 0.1);
          const fall = seg(t, k0 + 0.1, k0 + 0.5);
          pose(ver, { x: vx, y: vy - 20, o: t > 0 ? 1 - torn : 0 });
          pose(verL, { x: vx - 4 - fall * 30, y: vy - 20 + fall * fall * 120, r: -fall * 80, o: torn * (1 - seg(t, k0 + 0.45, k0 + 0.5)) });
          pose(verR, { x: vx + 4 + fall * 30, y: vy - 20 + fall * fall * 120, r: fall * 80, o: torn * (1 - seg(t, k0 + 0.45, k0 + 0.5)) });
        }
        if (p.kind === 'release') {
          const [fx, fy] = handAt(bx, 772, 0.9, !flip, 70, 'kneel');
          const drop = es(t, k0 + 0.1, k0 + 0.3, ease.in);
          pose(fet, { x: fx - 20 + drop * 10, y: lerp(fy, 776, drop), r: drop * 30, s: 0.9, o: 1 - es(t, k0 + 0.5, k0 + 0.6) });
        }
      });

      S.cam.z = kf(t, [[-0.5, 1.0], [0.4, 1.0], [0.9, 1.0], [1.2, 1.06]]);
      S.cam.y = kf(t, [[-0.5, -10], [0.4, -50], [0.9, -40], [1.2, 30]]);
    };
  },
};
