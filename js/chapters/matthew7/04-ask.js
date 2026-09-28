// Mt 7,7–8 — a village street with three doors, each with its word on a tag. "Ask": a poor man holds out his
// hands at the first door; it opens and a woman gives him a loaf. "Seek": a woman sweeps the dust with her lamp
// in front of the second door, and something glints — her lost coin, which she holds up. "Knock": a traveller knocks
// at the third door; it swings open on warm light and the old man of the house welcomes him in. "Everyone who asks
// receives…": all three doors stand open, their light spilling on the street.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, flowers, cypress, olive, bush } from '../../assets/nature.js';
import { oilLamp } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { VILLAGE, manOf, womanOf, childOf, traveller, handAt, streetFronts, doorLeafW, doorLight, doorSpill, loaf, coin, hungWord, sparkle, voiceRings, kf, tr, PI } from './lib.js';

const D = [490, 800, 1110];
const GY = 700;          // the wall's foot, the thresholds
const SY = 738;          // the street
const DW = 96, DH = 190;
const P = 0.36;          // the houses' parallax

export default {
  id: 'mt7-ask',
  enter: 'fly',
  beats: [
    { v: 7, text: 'Proście, a będzie wam dane;' },
    { v: 7, cont: true, text: 'szukajcie, a znajdziecie;' },
    { v: 7, cont: true, text: 'kołaczcie, a otworzą wam.' },
    { v: 8 },
  ],
  cam: { x: [-110, 110], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, VILLAGE);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1240, y: 140, len: 700 });
    const cls = [[430, 150, 170], [930, 120, 140]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) }));
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 420, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup + cypress(c, 240, 400, 110) + olive(c, 1400, 420, 0.7));

    /* inside the doorways: dark rooms that fill with light, the people of the houses */
    const inside = S.layer({ par: P, sh: 2 });
    inside.add(D.map((x) => `<path d="${c.cut(c.rect(x - 70, GY - DH - 20, 140, DH + 30), 0.4, 8)}" fill="${mix(C.soilDark, C.wood2, 0.35)}"/>`).join(''));
    const lights = D.map((x) => inside.add(`<g>${doorLight(c, DW, DH)}</g>`));
    const giver = S.puppet(inside.add(person(c, womanOf(c, { robe: C.sageRobe, veil: C.blushVeil }))));
    const kid = S.puppet(inside.add(person(c, childOf(1, { robe: C.roseRobe }))));
    const host = S.puppet(inside.add(person(c, manOf(c, { robe: C.linen2, mantle: C.ochreRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, beard: 'full', beardColor: C.greyHair, skin: C.skin2 }))));

    /* the house fronts and the doors */
    const wall = S.layer({ par: P, sh: 4 });
    wall.add(streetFronts(c, D, { gy: GY, top: 432, dw: DW, dh: DH }));
    const leaves = D.map((x, i) => {
      const hinge = i === 2 ? x + DW / 2 : x - DW / 2;
      return { i, hinge, dir: i === 2 ? -1 : 1, el: wall.add(`<g>${doorLeafW(c, DW, DH, [C.wood, mix(C.wood, C.teal2, 0.35), mix(C.wood2, C.terracotta, 0.2)][i])}</g>`) };
    });
    const tags = [tr('Proście', 'Ask'), tr('Szukajcie', 'Seek'), tr('Kołaczcie', 'Knock')].map((w, i) => ({ i, el: wall.add(hungWord(c, w, { size: 26 })) }));

    /* the street */
    const street = S.layer({ par: 0.42, sh: 3 });
    street.add(sheet().p(c.ridge(c.wave(GY + 12, [2, 1], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.stone, 0.3)).out());
    street.add(grass(c, { x0: -600, x1: 2200, y: GY + 14, n: 26, h: 10, color: C.olive }) + flowers(c, { x0: 300, x1: 1300, y: GY + 16, n: 8, h: 14 }));
    const spillL = S.layer({ par: 0.42, flat: true });
    const spills = D.map((x) => spillL.add(`<g>${doorSpill(DW, 140)}</g>`));

    /* the three people in the street */
    const act = S.layer({ par: 0.45, sh: 5 });
    const asker = S.puppet(act.add(person(c, manOf(c, { robe: mix(C.stone2, C.sand, 0.3), mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope }))));
    const SO = womanOf(c, { robe: C.dustyBlue, mantle: C.wheatRobe, veil: C.linen2 });
    const seek = S.puppet(act.add(person(c, SO)));
    const seekK = S.puppet(act.add(person(c, { ...SO, pose: 'kneel' })));
    const knock = S.puppet(act.add(person(c, traveller(c, { robe: C.tealRobe, mantle: C.clayMantle, holdF: '' }))));
    const bread = act.add(`<g>${loaf(c, 20)}</g>`);
    const lamp = act.add(`<g transform="scale(.8)">${oilLamp(c)}</g>`);
    const coinEl = act.add(`<g>${coin(c, 8)}</g>`);
    const glint = act.add(`<g>${sparkle(c, 16, C.star)}</g>`);
    const rings = voiceRings(act, c, { n: 3, color: C.wood2, r: 26, w: 4, both: false });

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 980, 240, C.moss, C.sage) + bush(c, 1520, 990, 260, C.sage, C.moss));

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1240, y: 140, r: Math.sin(T * 0.6) });
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.2, 0.6, cl.i));

      /* the tags come down over their doors in turn */
      tags.forEach((g) => {
        const k = es(t, g.i + 0.05, g.i + 0.3, ease.out);
                pose(g.el, { x: D[g.i] + [40, 0, -30][g.i], y: lerp(-500, 372 + (g.i % 2) * 26, k), r: Math.sin(T * 0.8 + g.i) * 1.2, o: k > 0.01 ? 1 : 0 });
      });

      /* the doors open */
      const open = [es(t, 0.25, 0.45), es(t, 3.05, 3.25), es(t, 2.45, 2.65)];
      leaves.forEach((l) => pose(l.el, { x: l.hinge, y: GY, sx: l.dir * (1 - open[l.i] * 0.86) }));
      lights.forEach((el, i) => pose(el, { x: D[i], y: GY, o: open[i] }));
      spills.forEach((el, i) => pose(el, { x: D[i], y: GY + 2, o: open[i] * (i === 1 ? 1 : 0.7 + es(t, 3.05, 3.3) * 0.3) }));

      /* v7a — ask: hands held out, a loaf given */
      const give = es(t, 0.48, 0.68);
      const lift = es(t, 0.7, 0.86);
      const ax = 594;
      asker.set({ x: ax, y: SY, s: 1.02, flip: true, armF: 60 + lift * 50, armB: 50 + lift * 60, head: 6 - lift * 14 - es(t, 3.1, 3.4) * 4, blink: blinkAt(T, 2) });
      giver.set({ x: D[0], y: GY, s: 0.92, armF: 20 + give * 70 * (1 - es(t, 0.75, 0.9)), armB: 10 + es(t, 0.8, 0.95) * 40, head: 4, o: open[0] > 0.02 ? 1 : 0, blink: blinkAt(T, 4) });
      const [gx, gy] = handAt(D[0], GY, 0.92, false, 90);
      const [rx, ry] = handAt(ax, SY, 1.02, true, 60 + lift * 50);
      pose(bread, { x: lerp(gx + 10, rx - 4, give), y: lerp(gy + 2, ry - 4, give) - Math.sin(give * PI) * 16, o: seg(t, 0.44, 0.48) });

      /* v7b — seek: the lamp sweeps the dust; a glint; she kneels and holds up the coin */
      const walk = es(t, 1.05, 1.45);
      const sx = lerp(716, 846, walk);
      const kneel = seg(t, 1.5, 1.55) * (1 - seg(t, 1.62, 1.66));
      const raise = es(t, 1.64, 1.78);
      const sArmF = 40 - raise * 10;
      seek.set({ x: sx, y: SY + 4, s: 1.0, walk: walk > 0 && walk < 1 ? sx * 0.07 : undefined, armF: sArmF, armB: 10 + raise * 150, head: 14 * (1 - raise) - raise * 12, lean: 12 * (1 - raise) * es(t, 1.0, 1.1), o: 1 - kneel, blink: blinkAt(T, 6) });
      seekK.set({ x: sx, y: SY + 4, s: 1.0, armF: 70, armB: 20, head: 16, o: kneel });
      const [lx, ly] = handAt(sx, SY + 4, 1.0, false, kneel ? 70 : sArmF, kneel ? 0 : 12 * (1 - raise) * es(t, 1.0, 1.1), kneel ? 46 : 0);
      pose(lamp, { x: lx - 20, y: ly + 12, o: 1 });
      const CX = 900, CY = SY + 2;
      const up = raise;
      // the coin: lying in the dust, then held high in her back hand
      const [bx2, hy] = handAt(sx, SY + 4, 1.0, false, 10 + up * 150, 0, 0, true);
      pose(coinEl, { x: up > 0 ? bx2 : CX, y: up > 0 ? hy : CY, o: 1 });
      const gk = bump(t, 1.4, 1.6) + raise * 0.9;
      pose(glint, { x: up > 0 ? bx2 + 6 : CX + 6, y: (up > 0 ? hy : CY) - 8, s: gk * (0.9 + Math.sin(T * 3) * 0.1), r: T * 50, o: Math.min(1, gk) });

      /* v7c — knock: three knocks, the door opens, the old man welcomes him */
      const kx = 1016;
      const kk = bump(t, 2.08, 2.18) + bump(t, 2.18, 2.28) + bump(t, 2.28, 2.38);
      const welcome = es(t, 2.6, 2.8);
      knock.set({ x: kx + welcome * 20, y: SY, s: 1.02, armF: 70 + kk * 30 - welcome * 40, armB: 10 + welcome * 60, head: -welcome * 6, walk: welcome > 0 && welcome < 1 ? kx * 0.05 : undefined, blink: blinkAt(T, 8) });
      rings(kx + 64, GY - 110, es(t, 2.08, 2.12) * (1 - es(t, 2.38, 2.45)), time, { spread: 1.6, s0: 0.6, dir: 1 });
      host.set({ x: D[2], y: GY, s: 0.94, flip: true, armF: 20 + welcome * 80, armB: 10 + welcome * 110, head: -welcome * 4, o: open[2] > 0.02 ? 1 : 0, blink: blinkAt(T, 3) });

      /* v8 — every door stands open; a child comes to the seeker's door */
      kid.set({ x: D[1], y: GY, s: 0.56, flip: true, armF: 20 + es(t, 3.25, 3.45) * 120, armB: 10 + es(t, 3.25, 3.45) * 130, o: open[1] > 0.02 ? 1 : 0, blink: blinkAt(T, 9) });

      S.cam.x = kf(t, [[0, -80], [0.9, -80], [1.2, 20], [1.9, 20], [2.2, 90], [2.9, 90], [3.3, 0]]);
      S.cam.z = kf(t, [[0, 1.1], [2.9, 1.1], [3.3, 1.0]]);
      S.cam.y = kf(t, [[0, 40], [2.9, 40], [3.3, 10]]);
    };
  },
};
