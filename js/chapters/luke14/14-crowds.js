// Łk 14,25–27 — on the road. Great crowds are going with Him: knots of people follow along the road as the hills roll
// past, Peter, James and John close behind Him. He stops, turns round to them and speaks. A man steps out of the crowd
// towards Him; ribbons run from his hand back to those who hold him — his father and mother, his wife and children, his
// brothers and sisters. The ribbons fall slack, the family draws back and grows pale, and as he steps forward his own
// grey paper double stays behind and fades: not even his own life comes first. Then small wooden crosses come down from
// the flies onto the shoulders of those who would follow — each his own — and Jesus turns and walks on, and they come
// after Him.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, knot, pose3, TWELVE, DISC, childPerson, smallCross, ropeUnit, ropeBetween, voiceRings, headAt, hand, kf, moving, makeCutter, mix, shade } from './lib.js';
import { MORNING } from '../luke8/lib.js';

const FEET = 724, JX = 850, DX0 = 600, DX1 = 730;
const FAMILY = [
  { x: -70, y: 0, s: 0.9, o: { robe: C.stone2, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather } },   // father
  { x: -30, y: 6, s: 0.86, o: { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.mauve, hair: C.greyHair, skin: C.skin2, beard: 'none' } },  // mother
  { x: 14, y: 2, s: 0.86, o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair3, skin: C.skin, beard: 'none', belt: C.ochre } },  // wife
  { x: 44, y: 10, s: 0.6, child: true, o: { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', skin: C.skin, belt: C.ochre } },  // a child
  { x: 70, y: 12, s: 0.52, child: true, o: { robe: C.skyVeil, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair3, skin: C.skin } },  // a child
  { x: -110, y: 8, s: 0.9, o: { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather } }, // a brother
  { x: -140, y: 14, s: 0.84, o: { robe: C.tealRobe, hairStyle: 'veil', veil: C.linen2, hair: C.hair2, skin: C.skin2, beard: 'none' } }, // a sister
];

export default {
  id: 'lk14-crowds',
  beats: [
    { v: 25, text: 'A szły z Nim wielkie tłumy.' },
    { v: 25, cont: true, text: 'On odwrócił się i rzekł do nich:' },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-130, 20], y: [0, 160], z: [1, 1.24] },
  build(S) {
    const R = roadSet(S, { skyCols: MORNING });
    const c = R.c;
    const cL = S.layer({ par: 0.5, sh: 4 });
    const crowds = [[190, 'lk14-cr1', 6], [380, 'lk14-cr2', 6], [560, 'lk14-cr3', 5]].map(([x, seed, n]) => ({ x, sp: cL.sprite(knot(seed, n, { s: 0.8, spread: 40, flip: false, arms: [0, 24] }), x, FEET - 6) }));
    const three = cL.sprite(pose3(makeCutter('lk14-3'), [0, 1, 2].map((k) => ({ x: (k - 1) * 40, y: (k % 2) * 8, s: 0.86, flip: false, head: -2, armF: 14 + k * 6, armB: 8, o: TWELVE[k].o }))), 1010, FEET - 4);
    const famL = S.layer({ par: 0.5, sh: 4 });
    const cc = makeCutter('lk14-family');
    const fam = famL.sprite(FAMILY.map((m) => `<g transform="translate(${m.x} ${m.y}) scale(${m.s})">${(m.child ? childPerson(cc, m.o) : person(cc, m.o)).replace('<g class="armFr">', '<g class="armFr" transform="rotate(-60)">')}</g>`).join(''), 470, FEET + 4);
    const ribs = [0, 1, 2, 3, 4, 5].map(() => famL.add(`<g opacity="0">${ropeUnit(c, 3.4, C.jesusMantle)}</g>`));
    const lifeGlow = famL.add(`<g opacity="0"><circle r="46" fill="url(#warm-glow)"/></g>`);
    const jL = S.layer({ par: 0.5, sh: 5 });
    const disc = S.puppet(jL.add(person(c, DISC)));
    const F2 = [{ robe: C.ochreRobe, hair: C.hair3, hairStyle: 'curly', beard: 'short', skin: C.skin3, belt: C.leather }, { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, hair: C.hair2, skin: C.skin2, beard: 'none', belt: C.ochre }];
    const fol = F2.map((o) => S.puppet(jL.add(person(c, o))));
    const jesus = S.puppet(jL.add(person(c, CAST.jesus)));
    const crosses = [0, 1, 2].map((i) => jL.add(`<g opacity="0">${smallCross(c, [110, 96, 90][i])}</g>`));
    const voice = voiceRings(jL, c, { n: 3, color: C.sun, r: 30, w: 4 });
    const life = jL.add(`<g opacity="0"><path d="M0 0C-9 -6 -8 -18 0 -30C8 -18 9 -6 0 0Z" fill="${C.halo}"/><path d="M0 -4C-4 -8 -3 -14 0 -20C3 -14 4 -8 0 -4Z" fill="${C.lampFlame}"/></g>`);

    return (t, time) => {
      const T = time;
      /* v25a — the crowds go with Him; the road rolls past */
      const walk1 = t < 1.2 ? 1 - es(t, 1.0, 1.2) : es(t, 3.3, 3.5);
      const travel = kf(t, [[0, 0], [1.2, 560], [3.3, 560], [4.2, 1100]], (x) => x);
      R.update(T, travel);
      const turned = es(t, 1.14, 1.2) * (1 - es(t, 3.3, 3.36));
      const speak = es(t, 1.2, 1.32) * (1 - es(t, 3.2, 3.3));
      jesus.set({ x: JX, y: FEET, s: 1.06, flip: turned > 0.5, walk: walk1 > 0.05 ? travel * 0.05 : undefined, amt: walk1, armF: 14 + speak * 50, armB: 8 + speak * 70, head: speak * 4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, FEET, 1.06, true);
      voice(jhx, jhy, speak * (t > 2 ? 0.6 : 1), T, { dir: -1, spread: 1.8 });
      const bob = (i) => (walk1 > 0.05 && T ? Math.abs(Math.sin(travel * 0.05 + i)) * -3 : 0);
      const back = es(t, 1.9, 2.1);
      crowds.forEach((g, i) => g.sp.set({ x: g.x - back * 150, y: FEET - 6 + bob(i) }));
      three.set({ x: 1010, y: FEET - 4 + bob(5), o: 1 });
      /* v26 — father and mother, wife and children, brothers and sisters, and even his own life */
      const out = es(t, 2.02, 2.2);
      const step = es(t, 2.48, 2.64);
      const D0 = S.portrait ? 660 : DX0, FAMX = S.portrait ? 570 : 470;   // phone: the family stays inside the screen
      const dx = lerp(D0 - 60, D0, out) + step * (DX1 - D0);
      const on = seg(t, 2.0, 2.06);
      const offer = es(t, 2.62, 2.74);
      disc.set({ x: dx, y: FEET + 4, s: 1.0, flip: false, o: on, walk: (out > 0 && out < 1) || (step > 0 && step < 1) ? dx * 0.06 : undefined, amt: 0.7, armF: 20 + step * 20 + offer * 50, armB: -30 + step * 40 + offer * 60, head: -2 + es(t, 2.3, 2.45) * 10 - offer * 14, lean: offer * 6, blink: blinkAt(T, 3) });
      const draw = es(t, 2.3, 2.5);
      fam.set({ x: FAMX - draw * 50, y: FEET + 4 - draw * 6, s: 1 - draw * 0.1, o: on * (1 - es(t, 3.2, 3.4)) });
      const [bx, by] = hand(D0, FEET + 4, 1.0, false, -30);
      const TG = [[-70, 0.9], [-30, 0.86], [14, 0.86], [44, 0.6], [70, 0.52], [-110, 0.9]];
      ribs.forEach((r, i) => {
        const [fx, fs] = TG[i];
        const tx = FAMX - draw * 50 + fx * (1 - draw * 0.1), ty = FEET + 4 - 80 * fs;
        ropeBetween(r, [bx - 8, by - 2], [tx + 26 * fs, ty], on * (1 - es(t, 2.3, 2.44)));
      });
      const [lx, ly] = hand(DX1, FEET + 4, 1.0, false, 70, 6);
      const lk = es(t, 2.64, 2.8);
      pose(life, { x: lx + 10 + lk * 12, y: ly - 6 - lk * 18, s: 0.6 + lk * 0.5, o: lk > 0.01 && t < 3.05 ? 1 : 0 });
      pose(lifeGlow, { x: lx + 10 + lk * 12, y: ly - 20 - lk * 18, o: lk * (1 - es(t, 2.95, 3.05)) });
      /* v27 — his own cross, and after Him */
      const drop = (i) => es(t, 3.06 + i * 0.07, 3.3 + i * 0.07, ease.out);
      const walk2 = es(t, 3.3, 3.5);
      const FX = [DX1, DX1 - 120, DX1 - 220];
      fol.forEach((p, i) => p.set({ x: FX[i + 1], y: FEET + 2, s: 0.96, flip: false, o: es(t, 2.95, 3.05), walk: walk2 > 0.05 ? travel * 0.05 + i : undefined, amt: walk2, armF: 60, armB: 20, head: -2, blink: blinkAt(T, 6 + i) }));
      if (t > 3.0) disc.set({ x: DX1, y: FEET + 4, s: 1.0, flip: false, walk: walk2 > 0.05 ? travel * 0.05 + 3 : undefined, amt: walk2, armF: 60, armB: 20, head: -2, blink: blinkAt(T, 3) });
      crosses.forEach((el, i) => {
        const x = FX[i], s = [1.0, 0.96, 0.96][i];
        const k = drop(i);
        pose(el, { x: x + 4 * s, y: lerp(-400, FEET - 136 * s, k), r: -28, s: 1, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [2.0, 0], [2.3, -60], [3.0, -40], [3.5, -10]]);
      S.cam.y = kf(t, [[0, 120], [2.0, 130], [2.3, 150], [3.0, 130]]);
      S.cam.z = kf(t, [[0, 1.14], [2.0, 1.14], [2.3, 1.22], [3.0, 1.16]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 0], [2.0, 0], [2.3, -130], [3.0, -110], [3.5, -40]]); S.cam.z = 1.0; }
      void shade; void moving;
    };
  },
};
