// Mt 6,9–10 — the Our Father, first half. Before dawn on a hilltop above the land: Jesus kneels with the
// disciples, faces lifted. "Our Father in heaven": the banks of cloud draw apart at the top of the stage and the light
// of heaven opens (no figure — light). "Hallowed be your name": lamps are lit one after another in every village across
// the land, and the rays reach down. "Your kingdom come": a crown of light comes down on its string towards the earth,
// and the hills flower under it. "Your will be done on earth as in heaven": up in the light a golden chain of paper
// figures unfolds, hand in hand — and down on the green hill the same chain unfolds in people's colours.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, flowers, cloud, olive, cypress, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { DAWN, HEAVEN, TW, fatherLight, rayBurst, lightCrown, peopleChain, tr, PI } from './lib.js';

const LX = 800, LY = 150;        // the light of heaven
const GY = 716;                  // the hilltop where they kneel

export default {
  id: 'mt6-heaven',
  beats: [
    { v: 9, text: 'Ojcze nasz, który jesteś w niebie,' },
    { v: 9, cont: true, text: 'niech się święci imię Twoje!' },
    { v: 10, text: 'Niech przyjdzie królestwo Twoje;' },
    { v: 10, cont: true, text: 'niech Twoja wola spełnia się na ziemi, tak jak i w niebie.' },
  ],
  cam: { x: [-30, 30], y: [-80, 40], z: [0.96, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAWN);
    const gold = sky(S, HEAVEN, { name: 'gold', rise: 0 }).layer;
    gold.fade(0);

    /* the light of heaven, its rays, the gold chain up there */
    const raysL = S.layer({ par: 0.03, sh: 1, flat: true, rise: 0 });
    raysL.add(`<g transform="translate(${LX} ${LY})">${rayBurst(c, { n: 30, r0: 60, r1: 1500, spread: 0.03, color: '#fff3cf', o: 0.4 })}</g>`);
    raysL.fade(0);
    const heavenL = S.layer({ par: 0.04, sh: 3, rise: 0 });
    const light = heavenL.add(`<g>${fatherLight(c, 58)}</g>`);
    const hChain = heavenL.add(`<g>${peopleChain(c, 9, { h: 62, gold: true })}</g>`);
    const cloudL = heavenL.add(`<g>${cloud(c, 420, mix(C.lavender, C.cream, 0.5), mix(C.duskViolet, C.cream, 0.4))}<g transform="translate(-170 40)">${cloud(c, 300, mix(C.lavender, C.cream, 0.35), mix(C.duskViolet, C.cream, 0.3))}</g></g>`);
    const cloudR = heavenL.add(`<g>${cloud(c, 420, mix(C.lavender, C.cream, 0.5), mix(C.duskViolet, C.cream, 0.4))}<g transform="translate(170 40)">${cloud(c, 300, mix(C.lavender, C.cream, 0.35), mix(C.duskViolet, C.cream, 0.3))}</g></g>`);
    const crownEl = hanging(heavenL, lightCrown(c, 44), { x: 0, y: 0, len: 1400 });

    /* the land: far hills, the villages, the lake, the green hill of the chain */
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.2) });
    far.add(fb.markup);
    const mid = S.layer({ par: 0.14, sh: 3 });
    const mh = hillsWith(c, { y: 500, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.12), trees: 16, treeColor: C.sage, treeH: 18 });
    mid.add(mh.markup);
    const VILL = [[300, 7], [640, 5], [1000, 6], [1300, 6]];
    VILL.forEach(([x, n]) => mid.add(town(c, { x, y: mh.fn(x) + 14, n, spread: 150, sc: 0.46 })));
    const lampL = S.layer({ par: 0.14, sh: 1, flat: true });
    const LAMPS = [];
    VILL.forEach(([vx], v) => { for (let k = 0; k < 3; k++) { const x = vx + (k - 1) * 46 + c.rr(-10, 10); LAMPS.push({ x, y: mh.fn(x) - c.rr(2, 14), i: LAMPS.length }); } });
    LAMPS.forEach((l) => { l.el = lampL.add(`<g><circle r="40" fill="url(#warm-glow)"/><path d="M0 4C-6 0 -5 -8 0 -16C5 -8 6 0 0 4Z" fill="${C.lampFlame}"/><path d="M0 2C-2.5 -1 -2.5 -5 0 -9C2.5 -5 2.5 -1 0 2Z" fill="#fff4d2"/></g>`); });
    const meadow = S.layer({ par: 0.22, sh: 3 });
    const mfn = c.wave(596, [10, 4], [700, 220]);
    meadow.add(sheet().p(c.ridge(mfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.duskViolet, 0.08)).out() + olive(c, 250, mfn(250) + 18, 0.7) + cypress(c, 1330, mfn(1330) + 10, 110));
    const BLOOMS = [360, 520, 680, 920, 1080, 1240, 440, 1160].map((x, i) => ({ i, x, y: mfn(x) + 18 + (i > 5 ? 26 : 0), el: meadow.add(`<g>${flowers(c, { x0: -50, x1: 50, y: 0, n: 7 })}</g>`) }));
    const eChain = mid.add(`<g>${peopleChain(c, 9, { h: 62 })}</g>`);

    /* the hilltop where they pray */
    const hill = S.layer({ par: 0.5, sh: 3 });
    const hfn = (x) => GY - 10 - Math.max(0, 1 - Math.abs(x - 800) / 520) ** 1.6 * 40 + Math.sin(x * 0.012) * 4;
    hill.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.duskViolet, 0.18)).out() + grass(c, { x0: -800, x1: 2400, y: 700, fn: hfn, n: 40, h: 12, color: C.moss }));
    const act = S.layer({ par: 0.5, sh: 5 });
    const DIS = [[-220, 'andrew'], [-120, 'peter'], [120, 'john'], [220, 'james']].map(([dx, k], i) => ({ i, k, x: 800 + dx, flip: dx > 0, p: S.puppet(act.add(person(c, { ...TW[k], pose: 'kneel' }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const hollow = S.layer({ par: 0.5, sh: 0, flat: true });
    const jGlow = hollow.add(`<circle r="180" fill="url(#halo-glow)"/>`);

    return (t, time) => {
      const T = time;
      /* v9a — heaven opens */
      const open = es(t, 0.05, 0.6);
      const hg = es(t, 0.2, 0.7);
      gold.fade(es(t, 0.3, 1.4) * 0.8);
      pose(cloudL, { x: LX - 180 - open * 520, y: LY + 70 + open * 20 });
      pose(cloudR, { x: LX + 180 + open * 520, y: LY + 70 + open * 20 });
      pose(light, { x: LX, y: LY, s: 0.5 + hg * 0.5 + (T ? Math.sin(T * 0.7) * 0.02 : 0), o: hg });
      raysL.fade(es(t, 0.9, 1.4) * (1 - es(t, 3.0, 3.3) * 0.4));

      /* they pray, faces lifted */
      const lift = es(t, 0.05, 0.4);
      jesus.set({ x: 800, y: hfn(800) + 12, s: 0.96, armF: 30 + lift * 70, armB: 30 + lift * 120, head: -lift * 18, blink: blinkAt(T) });
      pose(jGlow, { x: 800, y: hfn(800) - 100, s: 0.6 + lift * 0.4, o: lift * 0.5 });
      DIS.forEach((d) => {
        const up = es(t, 0.3 + d.i * 0.05, 0.6 + d.i * 0.05);
        d.p.set({ x: d.x, y: hfn(d.x) + 14, s: 0.82, flip: d.flip, armF: 40 + up * 40, armB: 30 + up * 50, head: -up * 14, blink: blinkAt(T, d.seed) });
      });

      /* v9b — the lamps of the land are lit, one after another */
      LAMPS.forEach((l) => {
        const k = es(t, 1.08 + ((l.i * 7) % LAMPS.length) * 0.035, 1.2 + ((l.i * 7) % LAMPS.length) * 0.035, ease.back);
        pose(l.el, { x: l.x, y: l.y, s: k * (1 + (T ? Math.sin(T * 5 + l.i) * 0.06 : 0)), o: k > 0.02 ? 1 : 0 });
      });

      /* v10a — the kingdom: a crown of light comes down, the hills flower */
      const ck = es(t, 2.03, 2.5, ease.out);
      BLOOMS.forEach((b) => {
        const k = es(t, 2.35 + b.i * 0.04, 2.55 + b.i * 0.04, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* v10b — as in heaven, so on earth: the gold chain unfolds above, the same chain below */
      const hk = es(t, 3.03, 3.3);
      pose(hChain, { x: LX, y: 334, sx: Math.max(0.04, hk), o: hk > 0.02 ? 1 : 0 });
      const ek = es(t, 3.25, 3.55);
      pose(eChain, { x: 800, y: mh.fn(800) + 16, sx: Math.max(0.04, ek), o: ek > 0.02 ? 1 : 0 });
      pose(crownEl, { x: LX, y: lerp(LY - 300, 380, ck) - es(t, 2.95, 3.2) * 150, r: T ? Math.sin(T * 0.8) * 1.4 : 0, o: ck > 0.01 ? 1 : 0 });

      S.cam.z = 1.04 - es(t, 0.0, 0.8) * 0.06;
      S.cam.y = 30 - es(t, 0.0, 0.8) * 90 + es(t, 3.0, 3.4) * 30;
    };
  },
};
