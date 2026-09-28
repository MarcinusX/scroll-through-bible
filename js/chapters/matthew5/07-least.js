// Mt 5,19–20 — a painted flat: a village schoolyard under a big shade tree, two teachers with their children.
// The one on the left tears the smallest commandment off his scroll and teaches the children to do the same —
// and he shrinks, "least in the kingdom". The one on the right keeps the scroll whole, does it and teaches it
// (he shares his bread with a beggar, the children bring theirs) — and he grows, "great in the kingdom".
// "Unless your righteousness exceeds that of the scribes and Pharisees": the golden gate of the kingdom comes
// down; a scribe and a Pharisee in their fine tassels walk up to it and it stays shut before them — but light
// shines through for a humble man whose heart is alight.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, sun, cloud, grass, flowers, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, hand, shadeTree, tagWord, wordCard, lightCrown, heart, loaf, kingdomGate, pharisee, scribe, folk, PI, DY, tr } from './lib.js';

const G = 664;       // the ground line
const GATE = [800, 612];

function scrollHeld(c, w = 44) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -14, w, 28), 0.3, 5), C.parchment);
  let ln = '';
  for (let i = 0; i < 3; i++) ln += c.ribbon([[-w / 2 + 6, -7 + i * 7], [w / 2 - 8, -7 + i * 7]], 1.4);
  s.x(ln, C.ink, 'opacity=".5"');
  s.p(c.cut(c.ell(-w / 2, 0, 4, 16, 10), 0.2, 3) + c.cut(c.ell(w / 2, 0, 4, 16, 10), 0.2, 3), C.wood2);
  return s.out();
}

export default {
  id: 'mt5-least',
  enter: 'fly',
  beats: [
    { v: 19, text: 'Ktokolwiek więc zniósłby jedno z tych przykazań, choćby najmniejszych, i uczyłby tak ludzi, ten będzie najmniejszy w królestwie niebieskim.' },
    { v: 19, cont: true, text: 'A kto je wypełnia i uczy wypełniać, ten będzie wielki w królestwie niebieskim.' },
    { v: 20 },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SKY.morning);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1230, y: 130, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 1000, y: 180, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 460, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.2), x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    const mh = hillsWith(c, { y: 520, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 18, x0: -1400, x1: 3000 });
    mid.add(mh.markup + house(c, 180, 540, 70, 50) + house(c, 1330, 536, 80, 56) + house(c, 1430, 544, 60, 44));
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, 600], [3000, 594], [3000, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.hillNear, 0.4)).out());
    ground.add(shadeTree(c, 800, 612, 1.5) + grass(c, { x0: -600, x1: 2200, y: 600, n: 40, h: 12, color: C.olive }) + rock(c, 360, 640, 60, 20));

    /* the gate of the kingdom (v20) */
    const gateL = S.layer({ par: 0.3, sh: 6 });
    const KG = kingdomGate(c, 120, 190);
    const gLight = gateL.add(`<g><circle cy="-100" r="200" fill="url(#halo-glow)"/>${KG.light}</g>`);
    const doors = [-1, 1].map((d) => gateL.add(`<g>${sheet().p(c.cut([[0, 0], [0, -140], ...(d < 0 ? c.arc(60, -140, 60, 50, PI, 1.5 * PI, 8) : c.arc(-60, -140, 60, 50, 2 * PI, 1.5 * PI, 8)), [d * -60, -190], [d * -60, 0]].map(([x, y]) => [x, y]), 0.4, 6), mix(C.sun, C.ochre, 0.45)).x(c.ribbon([[d * -8, -40], [d * -52, -40]], 3) + c.ribbon([[d * -8, -120], [d * -52, -120]], 3), shade(C.ochre, -0.2), 'opacity=".6"').out()}</g>`));
    const gFrame = gateL.add(`<g><path d="M-50 -2400V-200M50 -2400V-200" stroke="rgba(74,54,34,.55)" stroke-width="1.3" fill="none"/>${KG.frame}</g>`);
    const crack = gateL.add(`<g><path d="${c.poly([[-5, -176], [5, -176], [60, 60], [-60, 60]])}" fill="#fff4d0" opacity=".5"/></g>`);

    /* the two teachers and their children */
    const P = S.layer({ par: 0.34, sh: 5 });
    const KIDS = [
      { x: 620, flip: true, o: { ...LOOK.child }, g: 0 }, { x: 680, flip: true, o: { ...LOOK.child, robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil }, g: 0 },
      { x: 960, flip: false, o: { ...LOOK.child, robe: C.wheatRobe, hair: C.hair2 }, g: 1 }, { x: 900, flip: false, o: { ...LOOK.child, robe: C.sageRobe, hairStyle: 'veil', veil: C.skyVeil }, g: 1 },
    ].map((k, i) => ({ ...k, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...k.o, pose: 'sit' }))) }));
    const A = S.puppet(P.add(person(c, { robe: C.stone2, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3, belt: C.leather })));
    const B = S.puppet(P.add(person(c, { robe: C.linen2, mantle: C.tealRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather })));
    const scA = P.add(`<g>${scrollHeld(c)}</g>`), scB = P.add(`<g>${scrollHeld(c)}</g>`);
    const bits = [0, 1, 2].map(() => P.add(`<g>${sheet().p(c.cut(c.rect(-6, -5, 12, 10), 0.4, 3), C.parchment).out()}</g>`));
    const beggar = S.puppet(P.add(person(c, { ...LOOK.poor, pose: 'sit' })));
    const breadB = P.add(`<g>${loaf(c, 11)}</g>`);
    const tagA = P.add(`<g>${tagWord(c, tr('najmniejszy', 'least'), { size: 18 })}</g>`);
    const tagB = P.add(`<g>${tagWord(c, tr('wielki', 'great'), { size: 22, fill: C.halo })}</g>`);
    const crownB = P.add(`<g>${lightCrown(c, 18)}</g>`);

    /* the scribe, the Pharisee, the humble man (v20) */
    const Q = S.layer({ par: 0.36, sh: 5 });
    const sc = S.puppet(Q.add(person(c, scribe(c, 0))));
    const ph = S.puppet(Q.add(person(c, pharisee(c, 1))));
    const hm = S.puppet(Q.add(person(c, folk(c, true, { robe: C.sageRobe, mantle: null }))));
    const hHeart = Q.add(`<g>${heart(c, 9)}</g>`);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1230, y: 130, r: Math.sin(T * 0.6) });
      pose(cl, { x: 1000 + Math.sin(T * 0.1) * 20, y: 180, r: Math.sin(T * 0.6 + 1) });
      const away = es(t, 2.0, 2.3); // the schoolyard makes room for the gate

      /* v19a — the left teacher tears off the least commandment, teaches it, and shrinks */
      const tear = es(t, 0.1, 0.28), teachA = bump(t, 0.3, 0.7), shrink = es(t, 0.5, 0.72);
      const sA = lerp(1.0, 0.56, shrink);
      const ax = 540 - away * 300;
      const aA = 60 + teachA * 20;
      A.set({ x: ax, y: G + 8, s: sA, armF: aA, armB: 10 + teachA * 120, head: -2, blink: blinkAt(T, 1) });
      const [ahx, ahy] = hand(ax, G + 8, sA, false, aA);
      pose(scA, { x: ahx + 14 * sA, y: ahy, s: sA, r: -8 });
      bits.forEach((b, i) => {
        const k = es(t, 0.14 + i * 0.12, 0.5 + i * 0.12, (x) => x);
        const kid = KIDS[i === 0 ? 0 : i - 1];
        const sx = i === 0 ? ahx + 30 * sA : kid.x + 20, sy = i === 0 ? ahy - 10 : G - 60;
        pose(b, { x: sx + k * 40 + Math.sin(k * 9) * 10 - away * 300, y: lerp(sy, G + 4, k), r: k * 400, o: k > 0.01 ? 1 : 0 });
      });
      const tk = es(t, 0.6, 0.74, ease.back);
      pose(tagA, { x: ax, y: lerp(-300, G - 150 * sA - 60, tk) - away * 300, r: Math.sin(T * 1.2) * 3, o: tk > 0.01 ? 1 : 0 });

      /* v19b — the right teacher does it and teaches it, and grows great */
      const does = es(t, 1.06, 1.3), grow = es(t, 1.44, 1.68);
      const sB = lerp(1.0, 1.3, grow);
      const bx = 1060 + away * 300;
      const aB = 40 + does * 40;
      B.set({ x: bx, y: G + 8, s: sB, flip: true, armF: aB, armB: 20 + grow * 110, head: 4 - grow * 8, blink: blinkAt(T, 2) });
      const [bhx, bhy] = hand(bx, G + 8, sB, true, 40);
      pose(scB, { x: bhx - 10, y: bhy - 30 * (1 - does) - 40 * does, s: sB, r: 8, o: 1 });
      // the bread goes to the beggar by the tree
      const bk = es(t, 1.08, 1.34);
      pose(breadB, { x: lerp(bhx - 10, 866 + away * 300, bk), y: lerp(bhy, G - 34, bk) - Math.sin(bk * PI) * 30, o: 1 });
      beggar.set({ x: 830 + away * 300, y: G + 16, s: 0.86, flip: false, armF: 20 + bk * 50, head: 8 - bk * 12, blink: blinkAt(T, 7) });
      const gk = es(t, 1.6, 1.74, ease.back);
      pose(tagB, { x: bx, y: lerp(-300, G - 150 * sB - 80, gk) - away * 300, r: Math.sin(T * 1.1) * 3, o: gk > 0.01 ? 1 : 0 });
      pose(crownB, { x: bx - 4, y: G - 170 * sB + 8 - away * 300, s: gk, o: gk > 0.01 ? 1 : 0 });

      KIDS.forEach((k) => {
        const off = k.g ? away * 300 : -away * 300;
        const copy = k.g === 0 ? bump(t, 0.32, 0.72) : bump(t, 1.2, 1.7);
        k.p.set({ x: k.x + off, y: G + 12, s: 0.6, flip: k.flip, armF: 30 + copy * 50, armB: copy * 60 * (k.i % 2), head: -8, blink: blinkAt(T, k.seed) });
      });

      /* v20 — the gate of the kingdom stays shut before the scribe and the Pharisee */
      const gd = es(t, 2.08, 2.36, ease.out);
      const gy = lerp(-400, GATE[1], gd);
      const gOn = gd > 0.01 ? 1 : 0;
      pose(gFrame, { x: GATE[0], y: gy, o: gOn });
      pose(gLight, { x: GATE[0], y: gy, o: gOn });
      const crackK = es(t, 2.56, 2.7);
      doors.forEach((d, i) => pose(d, { x: GATE[0] + (i ? 60 : -60), y: gy, sx: 1 - crackK * 0.1, o: gOn }));
      pose(crack, { x: GATE[0], y: gy, o: crackK * 0.8 });
      const walk = es(t, 2.2, 2.5, (x) => x), bump_ = bump(t, 2.48, 2.6);
      const x1 = lerp(1320, 900, walk) + bump_ * 10, x2 = lerp(1420, 990, walk) + bump_ * 10;
      sc.set({ x: x1, y: G + 20, s: 0.96, flip: true, walk: walk > 0 && walk < 1 ? x1 * 0.05 : undefined, armF: 30 + bump_ * 40 + es(t, 2.52, 2.64) * 30, head: -4, o: seg(t, 2.1, 2.18), blink: blinkAt(T, 3) });
      ph.set({ x: x2, y: G + 26, s: 1.0, flip: true, walk: walk > 0 && walk < 1 ? x2 * 0.05 : undefined, armB: es(t, 2.5, 2.64) * 130, armF: 20, head: -6, o: seg(t, 2.1, 2.18), blink: blinkAt(T, 4) });
      const hw = es(t, 2.3, 2.62, (x) => x);
      const x3 = lerp(300, 650, hw);
      hm.set({ x: x3, y: G + 20, s: 0.92, walk: hw > 0 && hw < 1 ? x3 * 0.06 : undefined, armF: 20 + crackK * 30, head: -crackK * 6, o: seg(t, 2.2, 2.28), blink: blinkAt(T, 5) });
      pose(hHeart, { x: x3 + 6, y: G + 20 - 104 * 0.92, s: 0.9 + Math.sin(T * 2) * 0.06, o: seg(t, 2.2, 2.28) * es(t, 2.3, 2.5) });

      S.cam.z = 1.02 + es(t, 2.0, 2.4) * 0.03;
      S.cam.y = -10;
    };
  },
};
