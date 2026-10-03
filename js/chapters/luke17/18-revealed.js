// Łk 17,30–31 — a village on an ordinary grey morning: a flat-roofed house (Luke 12's, cut open, its goods inside —
// chests, jars, a rolled rug, a lamp), and a field beyond it with a man at work and his cloak left on a post at the
// edge. "It will be the same way in the day that the Son of Man is revealed": the grey cloud that covers the whole
// sky is drawn back to either side like a curtain, and a golden light stands open behind it; everyone looks up. "In
// that day, he who will be on the housetop, and his goods in the house, let him not go down to take them away": the
// man on the roof hurries to the head of the stair, looks down towards his goods — and stops, turns his back on them,
// and faces the light. "Let him who is in the field likewise not turn back": the man in the field turns towards his
// cloak on the post — and does not go back for it; he drops his hoe and looks up into the light.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, cypress, olive, grass } from '../../assets/nature.js';
import { cutHouse, HS, REVEAL, cloudCurtain, fieldPatch, manO, crossX, halo, behindOf, headAt, kf, es, ease, bump, seg, PI } from './lib.js';
import { postCloak } from '../matthew24/lib.js';
import { coinChest, wineJar } from '../matthew24/lib.js';
import { makeCutter } from '../../core/paper.js';

const R = HS.ROOF, F = HS.FLOOR;
const RM = { x0: 560, stair: 872 };      // the man on the roof
const FM0 = { x: 1100, y: 716 };         // the man in the field
const POST0 = [1200, 700];

function rays(c, n = 11, r0 = 60, r1 = 260) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = PI * (0.15 + (0.7 * i) / (n - 1)) + PI, w = 0.035;
    d += c.poly([[Math.cos(a - w * 0.3) * r0, Math.sin(a - w * 0.3) * r0], [Math.cos(a - w) * r1, Math.sin(a - w) * r1], [Math.cos(a + w) * r1, Math.sin(a + w) * r1], [Math.cos(a + w * 0.3) * r0, Math.sin(a + w * 0.3) * r0]]);
  }
  return `<path d="${d}" fill="#fff3cf" opacity=".55"/>`;
}

export default {
  id: 'lk17-revealed',
  beats: [
    { v: 30 },
    { v: 31, text: 'W owym dniu kto będzie na dachu, a jego rzeczy w mieszkaniu, niech nie schodzi, by je zabrać;' },
    { v: 31, cont: true, text: 'a kto na polu, niech również nie wraca do siebie.' },
  ],
  cam: { x: [0, 200], y: [-80, 40], z: [0.96, 1.1] },
  build(S) {
    // phone: the man in the field and the post with his cloak a step in, and the camera further right at v31b,
    // so the cloak and its cross stand clear of the thread
    const FM = S.portrait ? { x: 1060, y: FM0.y } : FM0, POST = S.portrait ? [1140, POST0[1]] : POST0;
    const c = S.c;
    sky(S, ['#aeb3bf', '#d4d0c8', '#e4dccb']);
    const gold = sky(S, REVEAL, { name: 'gold', rise: 0 });
    gold.layer.fade(0);
    const light = S.layer({ par: 0.02, sh: 0, flat: true, rise: 0 });
    light.add(`<g transform="translate(1000 160)"><circle r="140" fill="url(#halo-glow)"/>${rays(c)}<circle r="50" fill="#fffaf0" opacity=".9"/></g>`);
    light.fade(0);
    const curtL = S.layer({ par: 0.03, sh: 6, rise: 0, pad: 1600 });
    const left = curtL.add(`<g>${cloudCurtain(c, -1, { w: 1800, h: 900 })}</g>`);
    const right = curtL.add(`<g>${cloudCurtain(c, 1, { w: 1800, h: 900 })}</g>`);
    const far = S.layer({ par: 0.1, sh: 2 });
    const fh = hillsWith(c, { y: 470, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 18 });
    far.add(band(c, { y: 430, amps: [16, 7, 3], lens: [1000, 380, 130], color: C.hillFar }).markup + fh.markup + town(c, { x: 200, y: fh.fn(200) + 12, n: 5, spread: 260, sc: 0.5 }));
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-900, 610], [2500, 604], [2500, 1800], [-900, 1800]], 0.8, 20), mix(C.hillNear, C.sand, 0.3)).out() + grass(c, { x0: -800, x1: 2400, y: 612, n: 30, h: 12, color: C.moss }) + cypress(c, 1460, 612, 140) + olive(c, 240, 620, 0.8));
    const fieldL = S.layer({ par: 0.36, sh: 3 });
    fieldL.add(fieldPatch(c, { x0: 1045, x1: 1500, y0: 660, y1: 740, post: 0 }));
    fieldL.add(`<g transform="translate(${POST[0]} ${POST[1]})">${sheet().p(c.cut(c.rect(-5, -110, 10, 116), 0.3, 5), C.wood2).out()}<g transform="translate(0 -104)">${postCloak(c, C.clayMantle)}</g></g>`);
    /* the house and what is in it */
    let inL;
    const H = cutHouse(S, { inside: () => { inL = S.layer({ par: 0.45, sh: 5 }); } });
    const pc = makeCutter('lk17-goods');
    inL.add(`<g transform="translate(470 ${F})">${coinChest(pc, 70)}</g><g transform="translate(560 ${F})">${wineJar(pc, 70)}</g><g transform="translate(640 ${F - 8})">${sheet().p(pc.cut(pc.ell(0, -14, 48, 16, 16), 0.5, 5), C.terracotta).x(pc.ribbon([[-40, -14], [40, -14]], 3), C.sun, 'opacity=".6"').out()}</g><g transform="translate(730 ${F})">${wineJar(pc, 56)}</g>`);
    const goodsGlow = H.glowL.add(`<g opacity="0"><ellipse cx="600" cy="640" rx="200" ry="70" fill="url(#warm-glow)"/></g>`);
    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const roofMan = S.puppet(pL.add(person(pc, manO(pc, { robe: C.dustyBlue, mantle: C.ochreRobe, belt: C.leather }))));
    const HOE = `<g transform="rotate(10) translate(0 -6)">${sheet().p(pc.ribbon([[0, -40], [2, 70]], 4), C.wood3).p(pc.cut([[-12, 66], [14, 64], [12, 86], [-10, 86]], 0.3, 4), mix(C.stone2, C.rock3, 0.4)).out()}</g>`;
    const fieldMan = S.puppet(pL.add(person(pc, manO(pc, { robe: C.wheatRobe, belt: C.rope, holdF: HOE }))));
    const freeMan = S.puppet(pL.add(person(pc, manO(pc, { robe: C.wheatRobe, belt: C.rope }))));
    const dropped = pL.add(`<g opacity="0">${HOE}</g>`);
    const fx = S.layer({ par: 0.5, sh: 5 });
    const noStair = fx.add(`<g opacity="0">${crossX(c, 22)}</g>`);
    const noCloak = fx.add(`<g opacity="0">${crossX(c, 22)}</g>`);

    return (t, time) => {
      const T = time;
      pose(H.front, { x: 0, y: -es(t, 0.02, 0.3, ease.in) * 1300, o: t < 0.32 ? 1 : 0 });

      /* v30 — the sky is drawn back: the light of His day */
      const open = es(t, 0.25, 0.8);
      pose(left, { x: 800 - open * 1500, y: 300 });
      pose(right, { x: 800 + open * 1500, y: 300 });
      gold.layer.fade(open);
      light.fade(es(t, 0.4, 0.8));
      const look = es(t, 0.45, 0.7);

      /* v31a — on the roof: to the stair — and not down */
      const toStair = es(t, 1.05, 1.35);
      const stop = es(t, 1.4, 1.55);
      const back = es(t, 1.6, 1.85);
      const rx = lerp(lerp(RM.x0, RM.stair, toStair), RM.stair - 60, back);
      roofMan.set({ x: rx, y: R, s: 0.94, flip: back > 0.5 ? false : false, walk: (toStair > 0 && toStair < 1) || (back > 0 && back < 1) ? rx * 0.06 : undefined, armF: 20 + look * 30 * (1 - toStair) + stop * 30 + back * 40, armB: 10 + look * 60 * (1 - toStair) + back * 120, head: -look * 18 * (1 - toStair) + toStair * 22 * (1 - back) - back * 20, lean: toStair * 8 * (1 - back), blink: blinkAt(T, 3) });
      pose(goodsGlow, { o: bump(t, 1.25, 1.6) * 0.9 });
      const xk = es(t, 1.4, 1.55, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(noStair, { x: RM.stair + 44, y: R + 30, s: Math.max(0.001, xk), o: xk > 0.01 ? 1 : 0 });

      /* v31b — in the field: towards the cloak — and not back */
      const hoe = t < 0.4 ? (T ? Math.sin(t * 20) : 0) : 0;
      const turn = es(t, 2.05, 2.2);
      const refuse = es(t, 2.4, 2.55);
      const free = t > 2.55;
      const fm = { x: FM.x + turn * 30 * (1 - refuse), y: FM.y, s: 0.96, flip: !(turn > 0.5 && refuse < 0.5), armF: 40 + hoe * 14 + look * 20 * (1 - turn), armB: 10 + look * 70 * (1 - turn) + refuse * 130, head: -look * 18 * (1 - turn) + turn * 6 - refuse * 24, lean: hoe * 4, blink: blinkAt(T, 5) };
      fieldMan.set({ ...fm, o: free ? 0 : 1 });
      freeMan.set({ ...fm, armF: 40 + refuse * 60, o: free ? 1 : 0 });
      pose(dropped, { x: FM.x - 30, y: FM.y - 20, r: -70, o: free ? 1 : 0 });
      const ck = es(t, 2.3, 2.45, ease.back) * (1 - es(t, 2.85, 2.95));
      pose(noCloak, { x: POST[0], y: POST[1] - 150, s: Math.max(0.001, ck), o: ck > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 40], [0.9, 40], [1.1, 20], [1.9, 20], [2.1, S.portrait ? 180 : 100], [3, S.portrait ? 180 : 100]]);
      S.cam.y = kf(t, [[0, 10], [0.4, -60], [0.9, -40], [1.1, -10], [1.9, -10], [2.1, 20], [3, 20]]);
      S.cam.z = kf(t, [[0, 1.0], [0.6, 0.96], [1.1, 1.06], [1.9, 1.06], [2.1, 1.06], [3, 1.06]]);
    };
  },
};
