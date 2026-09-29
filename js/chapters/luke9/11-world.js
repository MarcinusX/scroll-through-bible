// Łk 9,25–27 — the quiet place again, Jesus standing on the flat rock among the disciples. "What does it profit a man
// if he gains the whole world, and loses or forfeits himself?": a painted flat comes down — a man reaches up, and the
// whole world comes down into his arms and grows and grows, while he himself goes grey and hollow, a shadow of paper.
// "Whoever is ashamed of me and of my words": a man of the crowd turns his back and hides the scroll of His words behind
// him; "…the Son of Man will be ashamed of him when He comes in His glory, and the glory of the Father and of the holy
// angels": the sky turns to gold, a light opens behind Jesus (no figure — only light), the angels are let down on their
// strings, and the man is left in his shadow. "Some standing here will not taste death until they see the Kingdom of
// God": the gold goes, and far off on the right a high mountain top begins to shine — Peter, James and John look up.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { restSet, REST_SIT, TW9, folk, globe, angel, radiance, rayBurst, halo, flat, flatSky, flatHills, flyTo, shadowPerson, silhouette, stillGroup, scrollRolled, kf, headAt, tr, PI } from './lib.js';

const JX = 800, JY = 700;
const W = 420, H = 250, FX = 800, FY = 290;

export default {
  id: 'lk9-world',
  beats: [
    { v: 25 },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-20, 60], y: [-20, 50], z: [1, 1.1] },
  build(S) {
    const R = restSet(S);
    const c = S.c;
    const gold = sky(S, ['#e9d9b0', '#f8ebc6', '#fff4da'], { name: 'gold', rise: 0 }).layer;
    gold.fade(0);
    // the far mountain that will shine (v27): on its own layer behind the hills
    const peakL = S.layer({ par: 0.1, sh: 2 });
    peakL.el.parentNode.insertBefore(peakL.el, R.mid.el);
    const peakGlow = peakL.add(`<g opacity="0">${halo(160, 1)}${rayBurst(c, { n: 14, r0: 20, r1: 240, spread: 0.05, o: 0.5 })}</g>`);
    peakL.add(sheet().p(c.cut([[1000, 560], [1120, 470], [1200, 400], [1250, 380], [1300, 398], [1400, 470], [1540, 560]], 1, 10), mix(C.hillFar, C.lavender, 0.35)).p(c.cut([[1200, 400], [1250, 380], [1300, 398], [1270, 410], [1240, 404], [1220, 414]], 0.5, 6), C.cream).out());

    /* the flat of the whole world (v25) */
    const flatL = S.layer({ par: 0.3, sh: 6 });
    const f1 = flatL.add(flat(S, flatSky(S, W, H, [C.skyBlue, C.cream]) + flatHills(c, W, 60, mix(C.hillMid, C.sand, 0.3)) + sheet().p(c.cut(c.rect(-W / 2 - 4, 92, W + 8, 60), 0.6, 10), mix(C.sand, C.hillNear, 0.4)).out(), { w: W, h: H }));
    const ov = S.layer({ par: 0.3, sh: 5 });
    const MAN = { robe: C.ochreRobe, mantle: C.terracotta, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun };
    const man = S.puppet(ov.add(person(c, MAN)));
    const hollow = S.puppet(ov.add(shadowPerson(c, MAN, mix(C.stone2, C.storm, 0.25))));
    const world = ov.add(`<g opacity="0">${globe(c, 50)}</g>`);

    /* the glory behind Jesus (v26), the angels */
    const glowL = S.layer({ par: 0.5, sh: 1, flat: true });
    const glory = glowL.add(`<g opacity="0">${rayBurst(c, { n: 22, r0: 60, r1: 520, spread: 0.045, o: 0.6 })}<g transform="scale(1.1)">${radiance(c, 120)}</g></g>`);
    const angL = S.layer({ par: 0.35, sh: 5 });
    const ANG = [[470, 300, false], [600, 230, false], [1000, 230, true], [1130, 300, true]].map(([x, y, flip], i) => ({ x, y, flip, i, el: hanging(angL, `<g transform="scale(${flip ? -0.72 : 0.72} .72)">${angel(c)}</g>`, { x: 0, y: -1500, len: 1400 }) }));

    /* people */
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = REST_SIT.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit' }))) })).sort((a, b) => a.y - b.y);
    // the man who is ashamed, with a grey knot of mockers behind him (v26)
    const mem = [-1, 0, 1].map((k) => ({ x: k * 34, y: Math.abs(k) * 4, s: 1, flip: true, o: { ...silhouette(folk(c), mix(C.stone2, C.storm, 0.35)) }, armF: 60 + k * 20, head: 6 }));
    const mockers = act.add(`<g opacity="0"><g transform="scale(.8)">${stillGroup(c, mem)}</g></g>`);
    const ASH = { robe: C.dustyBlue, mantle: C.stone, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather, holdB: `<g transform="translate(0 4) rotate(90) scale(1.2)">${scrollRolled(c, 30)}</g>` };
    const ashamed = S.puppet(act.add(person(c, ASH)));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      const T = time;
      R.update(T);
      /* v25 — the whole world, and himself lost */
      const k1 = es(t, -0.1, 0.2, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      flyTo(f1, k1, FX, FY, T, 0);
      const oy = lerp(-1500, FY, k1);
      const grow = es(t, 0.25, 0.75);
      const hollowK = es(t, 0.5, 0.8);
      const mx = FX - 40, my = oy + 100;
      man.set({ x: mx, y: my, s: 0.62, armF: 60 + grow * 20, armB: 70 + grow * 20, head: -10, o: (k1 > 0.01 ? 1 : 0) * (1 - hollowK) });
      hollow.set({ x: mx, y: my, s: 0.62, armF: 60 + grow * 20, armB: 70 + grow * 20, head: -10, o: (k1 > 0.01 ? 1 : 0) * hollowK * (1 - es(t, 0.82, 0.95) * 0.55) });
      pose(world, { x: mx + 44, y: my - 78 - grow * 8, s: 0.3 + grow * 0.55, r: T * 6, o: es(t, 0.1, 0.22) * (k1 > 0.01 ? 1 : 0) });

      /* v26 — ashamed of me; the Son of Man in His glory */
      const ashK = es(t, 1.05, 1.25);
      const turn = es(t, 1.2, 1.3);
      const glowK = es(t, 1.4, 1.7) * (1 - es(t, 2.05, 2.4));
      gold.fade(glowK * 0.9);
      ashamed.set({ x: 470, y: 724, s: 0.92, flip: turn > 0.5, o: ashK * (1 - es(t, 2.1, 2.3)), armF: 30 + turn * 90, armB: 20 + turn * 10, head: turn * 14, lean: turn * 6, blink: blinkAt(T, 7) });
      pose(mockers, { x: 390, y: 708, o: ashK * (1 - es(t, 1.5, 1.7)) });
      pose(glory, { x: JX, y: JY - 150, s: 0.6 + glowK * 0.5, r: T * 3, o: glowK });
      ANG.forEach((a) => {
        const k = es(t, 1.45 + a.i * 0.06, 1.75 + a.i * 0.06, ease.back) * (1 - es(t, 2.05, 2.35));
        pose(a.el, { x: a.x, y: lerp(-1500, a.y + 170, k), r: Math.sin(T * 0.8 + a.i) * 1.5, oy: 0, o: k > 0.002 ? 1 : 0 });
      });

      /* Jesus */
      const lifted = es(t, 1.4, 1.7) * (1 - es(t, 2.05, 2.35));
      const look = es(t, 2.3, 2.5);
      jesus.set({ x: JX, y: JY - lifted * 40, s: 1.04 + lifted * 0.06, flip: lifted > 0.3 ? false : look > 0.5, armF: 20 + bump(t, 0.05, 0.9) * 50 + lifted * 70 + look * 60, armB: 10 + bump(t, 0.05, 0.9) * 40 + lifted * 90, head: -2 - look * 8, blink: blinkAt(T, 1) });

      /* v27 — some standing here: the mountain top begins to shine */
      const shine = es(t, 2.3, 2.7);
      pose(peakGlow, { x: 1250, y: 400, s: 0.5 + shine * 0.6, r: T * 3, o: shine });
      D.forEach((d) => {
        const three = ['peter', 'john', 'james'].includes(d.k);
        const up = three ? es(t, 2.4 + d.i * 0.03, 2.6 + d.i * 0.03) : 0;
        d.p.set({ x: d.x, y: d.y, s: 0.92, flip: up > 0.5 ? false : d.x > JX, armF: 20 + up * 60 + bump(t, 1.45, 2.0) * 40, armB: bump(t, 1.45, 2.0) * 60, head: -6 - up * 10 - bump(t, 1.45, 2.0) * 10, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, 0], [2.2, 0], [2.7, 50]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [1.4, 1.0], [2.2, 1.0], [2.7, 1.04]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.4, -10], [2.2, -10], [2.7, 10]]);
    };
  },
};
