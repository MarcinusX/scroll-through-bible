// Mt 13,34–35 — back at the lake in the golden late afternoon. Jesus speaks from the boat and all the parables hang
// in a wide ring over the crowd on the beach — the sower, the wheat and darnel, the mustard tree, the leaven, the
// treasure, the pearl, the net: without a parable He told them nothing. The prophet's sepia cameo comes down. "I will
// open my mouth in parables": an old chest in the sky opens, and out of it rise things hidden since the foundation
// of the world — the paper globe, the sun and the moon, a spray of stars.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { sprout, wheatStalk, fish } from '../../assets/things.js';
import { sun as sunCut, moon as moonCut } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  shoreSet, beachCrowd, boatIn, placeBoat, mustardTree2, darnelStalk, chest, pearl, leaven, prophetCameo, globe, sowerPlate, voiceRings, headAt, hangAt, tr, GOLDEN, PI,
} from './lib.js';

const BX = 800, BY = 726, BS = 1.05;
const PSALMIST = { robe: C.linen2, mantle: C.ochreRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, veil2: C.ochre, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather };

export default {
  id: 'mt13-mouth',
  beats: [
    { v: 34 },
    { v: 35, text: 'Tak miało się spełnić słowo Proroka:' },
    { v: 35, cont: true, text: 'Otworzę usta w przypowieściach, wypowiem rzeczy ukryte od założenia świata.' },
  ],
  cam: { x: [-20, 20], y: [-60, 90], z: [0.96, 1.16] },
  build(S) {
    const Z = shoreSet(S, { skyCols: GOLDEN, sunAt: [1250, 230] });
    const c = Z.c;
    beachCrowd(S, Z.crowdL, [
      { y: 508, s: 0.34, n: 28, x0: 40, x1: 1560 },
      { y: 526, s: 0.41, n: 20, x0: 90, x1: 1510 },
      { y: 546, s: 0.49, n: 16, x0: 140, x1: 1460 },
    ], { per: 4, gap: 0, arms: [10, 40], head: [-10, -2], seed: 'mt13-mouth-crowd' });
    const B = boatIn(Z.boatL, c, () => S.puppet(Z.boatL.add(person(c, { ...CAST.jesus, pose: 'sit' }))));
    const jesus = B.inside;

    const top = S.layer({ par: 0.12, sh: 6 });
    /* the ring of parables */
    const tree = mustardTree2(c, { h: 420 });
    const ic = (m, tf) => `<g transform="${tf}">${m}</g>`;
    const ICONS = [
      `<g transform="scale(.82)">${sowerPlate(c)}</g>`,
      ic(wheatStalk(c, { h: 58 }).replace('class="stalk"', '') + `<g transform="translate(14 4)">${darnelStalk(c, { h: 46 })}</g>`, 'translate(-8 30) scale(.72)'),
      ic(tree.markup.replace(/class="(grow|branch|crown|trunk)"/g, ''), 'translate(0 30) scale(.12)'),
      ic(`<circle r="18" fill="url(#warm-glow)"/>${leaven(c, 14)}`, 'translate(0 2)'),
      ic(chest(c, { w: 56, h: 30 }).replace('class="glow" opacity="0"', 'opacity=".7"'), 'translate(0 16)'),
      ic(pearl(14), 'translate(0 0)'),
      ic(fish(c), 'scale(1.1)'),
    ];
    const ring = ICONS.map((m, i) => {
      const disc = sheet().p(c.cut(c.circ(0, 0, 44, 30), 0.6, 5), C.cream).p(c.cut(c.circ(0, 0, 38, 28), 0.4, 5), C.parchment).out();
      const a = (-0.5 + i / (ICONS.length - 1)) * 2.2;
      // phone: an even, narrower row of slightly smaller plates that stays inside the screen
      if (S.portrait) return { i, x: 800 + (-1 + (2 * i) / (ICONS.length - 1)) * 255, y: 350 - Math.cos(a) * 120 + (i % 2) * 30, el: hanging(top, `<g transform="scale(.84)">${disc}${m}</g>`, { x: 0, y: 0, len: 700 }) };
      return { i, x: 800 + Math.sin(a) * 420, y: 350 - Math.cos(a) * 120 + (i % 2) * 30, el: hanging(top, `<g>${disc}${m}</g>`, { x: 0, y: 0, len: 700 }) };
    });

    /* the prophet, the chest of hidden things and what comes out of it */
    const prophet = hanging(top, `<g transform="scale(1.6)">${prophetCameo(c, S.id('ps'), PSALMIST, tr('Prorok', 'the prophet'))}</g>`, { x: 0, y: 0, len: 900 });
    const box = hanging(top, `<g transform="scale(2.1)">${chest(c, { w: 90, h: 50 })}</g>`, { x: 0, y: 0, len: 900 });
    const lid = box.querySelector('.lid'), glow = box.querySelector('.glow');
    const rays = top.add(`<g opacity="0">${sheet().x(Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * PI * 2, w = 0.07; return c.poly([[Math.cos(a) * 60, Math.sin(a) * 60], [Math.cos(a - w) * 250, Math.sin(a - w) * 250], [Math.cos(a + w) * 250, Math.sin(a + w) * 250]]); }).join(''), C.halo).out(false)}</g>`);
    const world = top.add(`<g><circle r="120" fill="url(#halo-glow)" opacity=".7"/>${globe(c, 62)}</g>`);
    const sunI = top.add(`<g>${sunCut(c, 26)}</g>`);
    const moonI = top.add(`<g>${moonCut(c, 20)}</g>`);
    const starsI = Array.from({ length: 10 }, (_, i) => ({ i, a: (i / 10) * PI * 2 + 0.3, r: 150 + (i % 3) * 40, el: top.add(`<path d="${c.cut(c.star(0, 0, 10 + (i % 3) * 3, 4, 5, 0), 0.2, 3)}" fill="${C.star}"/>`) }));
    const rings = voiceRings(Z.boatL, c, { n: 3, r: 34, color: C.cream });

    return (t, time) => {
      const T = time;
      Z.update(T);
      const bob = Math.sin(T * 1.4) * 2.5;
      placeBoat(B, BX, BY + bob, BS, Math.sin(T * 1.1) * 0.6);
      const open = es(t, 2.05, 2.3);
      jesus.set({
        x: BX - 10 * BS, y: BY + bob - 12 * BS, s: BS,
        armF: 30 + es(t, 0.05, 0.3) * 40 + Math.sin(T * 1.5) * 10 * (1 - open) + open * 50, armB: 12 + es(t, 0.05, 0.3) * 30 + open * 110,
        head: -4 - open * 10, blink: blinkAt(T),
      });
      const [hx, hy] = headAt(BX - 10 * BS, BY + bob - 12 * BS, BS, false, 62);
      rings(hx + 14, hy + 6, es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.1) * 0.5), T);

      /* v34 — all these things in parables: the ring comes down over the crowd */
      ring.forEach((p) => {
        const k = es(t, 0.05 + p.i * 0.07, 0.4 + p.i * 0.07, ease.back) * (1 - es(t, 1.0, 1.3));
        hangAt(p.el, p.x, lerp(-500, p.y, k), T, 2, 0.9, p.i);
      });

      /* v35a — the prophet */
      const pr = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.0, 2.3));
      hangAt(prophet, 800, lerp(-500, 250, pr), T, 1.2, 0.7);

      /* v35b — the chest of things hidden since the foundation of the world opens */
      const bIn = es(t, 2.0, 2.25, ease.out);
      const lidK = es(t, 2.2, 2.4);
      const by = lerp(-500, 400, bIn);
      hangAt(box, 800, by, T, 0.6, 0.6);
      pose(lid, { x: -46, y: -50, r: -lidK * 70 });
      fade(glow, lidK);
      pose(rays, { x: 800, y: by - 90, r: t * 10, s: 0.4 + lidK * 0.6, o: lidK * 0.45 });
      const up = es(t, 2.3, 2.6, ease.out);
      const gy = lerp(by - 90, 205, up);
      pose(world, { x: 800, y: gy, s: 0.3 + up * 0.7, r: T * 6, o: up > 0.01 ? 1 : 0 });
      const orb = T * 0.35 + t;
      pose(sunI, { x: 800 + Math.cos(orb) * 150 * up, y: gy + Math.sin(orb) * 60 * up, s: up, o: up > 0.01 ? 1 : 0 });
      pose(moonI, { x: 800 - Math.cos(orb) * 150 * up, y: gy - Math.sin(orb) * 60 * up, s: up, o: up > 0.01 ? 1 : 0 });
      starsI.forEach((s) => {
        const k = es(t, 2.35 + s.i * 0.02, 2.6 + s.i * 0.02, ease.out);
        pose(s.el, { x: 800 + Math.cos(s.a) * s.r * k, y: gy + Math.sin(s.a) * s.r * 0.6 * k, r: T * 20 + s.i * 30, s: k * (1 + Math.sin(T * 3 + s.i) * 0.1), o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1.04 - es(t, 0, 0.5) * 0.06 + es(t, 1.0, 1.4) * 0.02 + es(t, 2.0, 2.4) * 0.04;
      S.cam.y = 40 - es(t, 0, 0.5) * 30 - es(t, 2.0, 2.4) * 50;
    };
  },
};
