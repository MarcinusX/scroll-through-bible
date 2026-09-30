// Łk 9,51–53 — here the long journey begins. A road runs away through the hills, past a walled village, and on up to
// Jerusalem, small and far on its height. "When the days were near that He should be taken up": the city begins to
// shine and light goes up from above it; "He set His face to go to Jerusalem": Jesus, who stood facing His disciples,
// turns, lifts His head towards the city and steps out — and the road lights up, stone by stone, all the way there.
// "He sent messengers before His face": James and John run on ahead down the road; "they went and entered a village of
// the Samaritans, to prepare for Him": at the village gate two villagers come out to them. "They didn't receive Him,
// because He was travelling with His face set towards Jerusalem": the villagers shake their heads and point away up
// the road to the city, and the gate swings shut in the messengers' faces.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, ROAD9, ROAD_NEAR, ROAD_FAR, TW9, SAMARITAN, along, sparkle, speech, GLYPH, halo, kf, headAt, PI } from './lib.js';

const { JX, JY } = ROAD9;
const [GX, GY] = ROAD9.GATE;
const PATH = [...ROAD_NEAR.slice(3), ...ROAD_FAR.slice(1)];

export default {
  id: 'lk9-face',
  beats: [
    { v: 51 },
    { v: 52, text: 'i wysłał przed sobą posłańców.' },
    { v: 52, cont: true, text: 'Ci wybrali się w drogę i przyszli do pewnego miasteczka samarytańskiego, by Mu przygotować pobyt.' },
    { v: 53 },
  ],
  cam: { x: [-20, 80], y: [0, 50], z: [1, 1.16] },
  build(S) {
    const R = roadSet(S);
    const c = S.c;
    /* the road lighting up to the city */
    const dotL = S.layer({ par: 0.4, sh: 1, flat: true });
    const DOTS = Array.from({ length: 16 }, (_, i) => {
      const u = i / 15;
      const [x, y] = along(PATH, u);
      return { i, u, x, y, el: dotL.add(`<g opacity="0"><circle r="${(16 - u * 11).toFixed(1)}" fill="url(#halo-glow)"/><circle r="${(3.4 - u * 2).toFixed(1)}" fill="#fff4d0"/></g>`) };
    });
    // the villagers at the gate
    const vL = S.layer({ par: 0.3, sh: 4 });
    vL.el.parentNode.insertBefore(vL.el, R.villageL.el.nextSibling);
    const V = [0, 1].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(vL.add(person(c, SAMARITAN(i)))) }));

    /* people on the road */
    const act = S.layer({ par: 0.45, sh: 5 });
    const MSG = [{ k: 'james', x: 860, y: 700 }, { k: 'john', x: 920, y: 690 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const REST = [{ k: 'peter', x: 640, y: 744 }, { k: 'andrew', x: 570, y: 764 }, { k: 'thomas', x: 490, y: 790 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const glowL = S.layer({ par: 0.45, sh: 1, flat: true });
    glowL.el.parentNode.insertBefore(glowL.el, act.el);
    const aura = glowL.add(`<g opacity="0">${halo(150, 1)}</g>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.4, sh: 4 });
    const no = [0, 1].map(() => fx.add(`<g opacity="0">${speech(c, GLYPH.bang(c), { w: 30, h: 30, flip: true })}</g>`));

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: es(t, 1.0, 3.5) * 0.35 });
      /* v51 — the days drawing near; He sets His face */
      const shine = es(t, 0.05, 0.4);
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, s: 0.6 + shine * 0.6, o: shine });
      pose(R.rays, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 30, o: es(t, 0.15, 0.5) * 0.9 });
      const turn = es(t, 0.22, 0.28);
      const stepK = es(t, 0.3, 0.6);
      const jx = JX + stepK * 20;
      jesus.set({ x: jx, y: JY - stepK * 4, s: 1.04, flip: turn < 0.5, walk: stepK > 0 && stepK < 1 ? t * 16 : undefined, armF: 20 + bump(t, 1.05, 1.8) * 70, armB: 10, head: -turn * 12 + bump(t, 1.05, 1.8) * 6, blink: blinkAt(T, 1) });
      pose(aura, { x: jx, y: JY - 150, s: 0.8, o: 0.3 + shine * 0.4 });
      DOTS.forEach((d) => {
        const k = es(t, 0.35 + d.u * 0.35, 0.42 + d.u * 0.35);
        pose(d.el, { x: d.x, y: d.y, o: k * (1 - es(t, 3.6, 3.95) * 0.5) });
      });
      REST.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.98, armF: 20 + bump(t, 0.3, 0.9) * 20, head: -4 - shine * 6, blink: blinkAt(T, d.seed) }));

      /* v52a — messengers sent ahead; v52b — at the Samaritan village */
      MSG.forEach((d) => {
        const u = es(t, 1.15 + d.i * 0.08, 2.1 + d.i * 0.05, (x) => x);
        const [ex, ey] = [GX - 70 - d.i * 36, GY + 4 + d.i * 3];
        const x = lerp(d.x, ex, u), y = lerp(d.y, ey, u);
        const s = lerp(0.96, 0.58, u);
        const back = es(t, 3.35, 3.9, (x) => x);
        const bx = lerp(x, x - 120, back), by = lerp(y, y + 30, back), bs = lerp(s, 0.66, back);
        const talk = bump(t, 2.2 + d.i * 0.1, 2.95);
        d.p.set({ x: bx, y: by, s: bs, flip: back > 0, walk: (u > 0 && u < 1) || (back > 0 && back < 1) ? t * 18 + d.i : undefined, amt: 1.2, armF: 20 + talk * 70, armB: talk * 40, head: -4, lean: u > 0 && u < 1 ? 6 : 0, blink: blinkAt(T, d.seed) });
      });
      V.forEach((v) => {
        const out = es(t, 2.05 + v.i * 0.08, 2.35 + v.i * 0.08);
        const refuse = es(t, 3.05, 3.2);
        const x = lerp(GX, GX + 16 + v.i * 34, out);
        v.p.set({ x, y: GY + 2, s: 0.56, flip: true, o: out > 0 ? 1 : 0, walk: out > 0 && out < 1 ? t * 16 : undefined, armF: 20 + refuse * (v.i ? 150 : 60), armB: refuse * (v.i ? 20 : 90), head: refuse * Math.sin(T * 8 + v.i) * 8, blink: blinkAt(T, v.seed) });
        const nk = es(t, 3.08 + v.i * 0.05, 3.2 + v.i * 0.05, ease.back) * (1 - es(t, 3.6, 3.7));
        const [hx, hy] = headAt(x, GY + 2, 0.56, true);
        pose(no[v.i], { x: hx - 6, y: hy - 12, s: nk * 0.8, o: nk > 0.01 ? 1 : 0 });
      });
      /* v53 — the gate shuts */
      const shut = es(t, 3.3, 3.5);
      const inside = es(t, 3.25, 3.35);
      V.forEach((v) => { if (inside > 0.5) v.p.set({ x: GX, y: GY + 2, s: 0.56, o: 0 }); });
      pose(R.gateL, { x: GX - 30, y: GY + 2, sx: Math.max(0.05, shut) });
      pose(R.gateR, { x: GX + 30, y: GY + 2, sx: Math.max(0.05, shut) });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [2.0, 60], [3.9, 60]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.04], [2.0, 1.14], [3.9, 1.14]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [2.0, 10], [3.9, 10]]);
    };
  },
};
