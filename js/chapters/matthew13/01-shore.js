// Mt 13,1–3a — the curtains open on Mark 4's lake. Jesus comes out of Peter's house at the edge of the beach
// and sits down by the water. The crowds stream in from both sides until there is no room: He steps into a boat,
// it pushes out towards us and He sits in it, the whole crowd standing on the shore. Then He begins to speak in
// parables — little painted plates of the parables to come rise out of the boat on their strings.
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, sheet } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { sprout, wheatStalk, fish } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { shoreSet, beachCrowd, boatIn, placeBoat, mustardTree2, darnelStalk, chest, pearl, leaven, kf, moving } from './lib.js';

const BX0 = 935, BY0 = 590, BS0 = 0.5;          // the boat drawn up on the sand
const BX1 = 800, BY1 = 722, BS1 = 1.05;         // …and pushed out towards us

export default {
  id: 'mt13-shore',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3, text: 'I mówił im wiele w przypowieściach tymi słowami:' },
  ],
  cam: { x: [-90, 20], y: [-30, 140], z: [1, 1.26] },
  build(S) {
    // phone: Peter's house moves right (as in mt13-home), so He is seen coming out of it, not out of the frame edge
    const HX = S.portrait ? 190 : 0;
    const Z = shoreSet(S, { house: true, houseX: 330 + HX });
    const c = Z.c;

    /* the crowd arrives from both sides (sprites) */
    const crowd = beachCrowd(S, Z.crowdL, [
      { y: 508, s: 0.34, n: 28, x0: 40, x1: 1560 },
      { y: 524, s: 0.41, n: 20, x0: 90, x1: 1510 },
      { y: 544, s: 0.49, n: 16, x0: 140, x1: 1460 },
    ], { per: 4, gap: 90, arms: [0, 20] });
    crowd.forEach((g) => { g.from = g.x < 800 ? g.x - 1100 - g.d * 200 : g.x + 1100 + g.d * 200; if (g.x < 470 && g.ri > 0) g.from = g.x - 900; });

    /* Jesus on the beach: walking out of the house, then sitting on a stone by the water */
    const walkL = S.layer({ par: 0.34, sh: 4 });
    walkL.add(rock(c, 790, 550, 46, 14, C.rock2));
    const jWalk = S.puppet(walkL.add(person(c, { ...CAST.jesus })));
    const jRest = S.puppet(walkL.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    /* the boat and Jesus in it */
    const B = boatIn(Z.boatL, c, () => S.puppet(Z.boatL.add(person(c, { ...CAST.jesus, pose: 'sit' }))));
    const jBoat = B.inside;

    /* the parables to come, as little plates rising from the boat */
    const tree = mustardTree2(c, { h: 420 });
    const icon = (m, tf) => `<g transform="${tf}">${m}</g>`;
    const ICONS = [
      icon(sprout(c, { h: 34 }), 'translate(0 18)'),
      icon(wheatStalk(c, { h: 58 }).replace('class="stalk"', '') + `<g transform="translate(14 4)">${darnelStalk(c, { h: 46 })}</g>`, 'translate(-8 30) scale(.72)'),
      icon(tree.markup.replace(/class="(grow|branch|crown|trunk)"/g, ''), 'translate(0 30) scale(.12)'),
      icon(`<circle r="18" fill="url(#warm-glow)"/>${leaven(c, 14)}`, 'translate(0 2)'),
      icon(chest(c, { w: 56, h: 30 }).replace('class="glow" opacity="0"', 'opacity=".7"'), 'translate(0 16)'),
      icon(pearl(14), 'translate(0 0)'),
      icon(fish(c), 'translate(0 0) scale(1.1)'),
    ];
    const plates = ICONS.map((ic, i) => {
      const disc = sheet().p(c.cut(c.circ(0, 0, 42, 30), 0.6, 5), C.cream).out();
      const a = (-0.5 + i / (ICONS.length - 1)) * 1.9;
      // phone: an even, narrower row of slightly smaller plates that stays inside the screen
      if (S.portrait) return { i, x: 800 + (-1 + (2 * i) / (ICONS.length - 1)) * 205, y: 470 - Math.cos(a) * 110 + (i % 2) * 36, k: 0.82, el: hanging(Z.boatL, `<g>${disc}${ic}</g>`, { x: 0, y: 0, len: 500 }) };
      return { i, x: 800 + Math.sin(a) * 330, y: 470 - Math.cos(a) * 110 + (i % 2) * 36, el: hanging(Z.boatL, `<g>${disc}${ic}</g>`, { x: 0, y: 0, len: 500 }) };
    });

    const cur = curtains(S);

    const WALK = [[1, 374 + HX], [1.62, 770], [1.72, 790]];

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);
      const hush = 1 - es(t, 3, 3.6) * 0.6;
      Z.update(time * hush);

      /* crowds gather during v2 */
      crowd.forEach((g) => {
        const k = es(t, 2.0 + g.d * 0.35 + g.ri * 0.05, 2.45 + g.d * 0.35 + g.ri * 0.05, ease.out);
        g.sp.set({ x: lerp(g.from, g.x, k), y: g.y, o: k > 0.001 ? 1 : 0 });
      });

      /* v1: out of the house, along the beach, sit by the water */
      const jx = kf(t, WALK);
      const out = es(t, 0.95, 1.1);
      const sit = seg(t, 1.72, 1.8);
      const up = seg(t, 2.3, 2.36);
      const walk2 = seg(t, 2.36, 2.62);
      const inBoat = seg(t, 2.6, 2.66);
      const x2 = lerp(790, BX0 - 6, walk2);
      const standing = (1 - sit) + up;
      jWalk.set({
        x: t < 2.3 ? jx : x2, y: 548 - bump(t, 2.52, 2.64) * 14, s: 0.5, flip: false, o: out * Math.min(1, standing) * (1 - inBoat),
        walk: moving(t, WALK) || (walk2 > 0 && walk2 < 1) ? (t < 2.3 ? jx : x2) * 0.1 : undefined,
        armF: 8 + bump(t, 2.05, 2.3) * 30, blink: blinkAt(time),
      });
      jRest.set({ x: 790, y: 552, s: 0.5, o: sit * (1 - up), armF: 30, armB: 10, head: -4 + bump(t, 2.0, 2.3) * 8, blink: blinkAt(time, 1) });

      /* v2: the boat pushes out and He sits in it */
      const push = es(t, 2.66, 2.98);
      const bob = Math.sin(time * 1.4) * 2.5;
      const bx = lerp(BX0, BX1, push), by = lerp(BY0, BY1, push), bs = lerp(BS0, BS1, push);
      const rr = Math.sin(time * 1.1) * 0.8;
      placeBoat(B, bx, by + bob * bs, bs, rr);
      const teach = seg(t, 3.02, 3.9);
      jBoat.set({
        x: bx - 10 * bs, y: by + bob * bs - 12 * bs, s: bs, o: inBoat,
        armF: 30 + teach * (40 + Math.sin(time * 1.6) * 14) + bump(t, 2.9, 3.1) * 20,
        armB: 10 + teach * (24 + Math.sin(time * 1.1 + 1) * 10),
        head: -4 + Math.sin(time * 0.7) * 2 * teach, blink: blinkAt(time, 3),
      });

      /* v3a: the parables rise out of the boat */
      plates.forEach((p) => {
        const r = es(t, 3.08 + p.i * 0.08, 3.5 + p.i * 0.08, ease.back);
        const x = lerp(bx, p.x, r), y = lerp(by - 160, p.y, r) + Math.sin(time * 1.2 * hush + p.i) * 4;
        pose(p.el, { x, y, s: (0.2 + 0.8 * r) * (p.k || 1), o: seg(t, 3.05 + p.i * 0.08, 3.2 + p.i * 0.08), r: Math.sin(time * 0.9 + p.i * 2) * 3 });
      });

      S.cam.x = kf(t, [[0.6, 0], [1.1, -80], [1.7, -20], [2.0, 0]]);
      S.cam.z = kf(t, [[0, 1], [0.8, 1.04], [1.1, 1.22], [1.75, 1.16], [2.05, 1.04], [2.6, 1.06], [3.0, 1.16], [3.7, 1.2]]);
      S.cam.y = kf(t, [[0, 0], [0.8, 20], [1.1, 60], [1.75, 60], [2.05, 30], [2.6, 50], [3.0, 110], [3.7, 120]]);
    };
  },
};
