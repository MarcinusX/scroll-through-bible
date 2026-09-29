// Łk 21,23–24 — Judea again, the camp round the walls. "Woe to those who are pregnant and to those who nurse infants in
// those days!": on the road in front a woman heavy with child comes slowly, her husband's arm under hers, and a mother
// hurries after with her baby held close — they stop, out of breath. "For there will be great distress in the land, and
// wrath to this people": the sky goes dark and heavy clouds come down over the city. "They will fall by the edge of the
// sword, and will be led captive into all the nations": a dark sword hangs over the land and the little lights of the
// villages go out one by one; along the road a soldier leads a line of captives away, roped together, heads bowed.
// "Jerusalem will be trampled down by the Gentiles, until the times of the Gentiles are fulfilled": foreign standards go
// up on the walls, a column of soldiers marches in at the gate — and an hourglass hangs over the city, its sand running
// out.
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  judeaSet, campRing, EXPECT, HUSBAND, MOTHER, roman, swordSil, cord, hourglass, eagleStandard, cloud, warm, handAt, addToBody, STORM, STRING,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';
import { inArms } from '../luke2/lib.js';

const RY = 752;       // the road in front

export default {
  id: 'lk21-woe',
  beats: [
    { v: 23, text: 'Biada brzemiennym i karmiącym w owe dni!' },
    { v: 23, cont: true, text: 'Będzie bowiem wielki ucisk na ziemi i gniew na ten naród:' },
    { v: 24, text: 'jedni polegną od miecza, a drugich zapędzą w niewolę między wszystkie narody.' },
    { v: 24, cont: true, text: 'A Jerozolima będzie deptana przez pogan, aż czasy pogan przeminą.' },
  ],
  cam: { x: [-30, 30], y: [-50, 40], z: [1, 1.12] },
  build(S) {
    const J = judeaSet(S, { skyCols: ['#b9a3b4', '#e2b49c', '#f0cfad'], sky2: STORM, dim: true });
    const c = S.c;
    const camp = campRing(J, c);

    /* the storm clouds */
    const clL = J.hangL;
    const clouds = [[360, 150, 260], [820, 110, 300], [1220, 170, 240], [600, 230, 200]].map(([x, y, w], i) => ({ i, x, y, el: clL.add(`<g>${cloud(c, w, mix(C.storm, C.night2, 0.25), mix(C.storm2, C.night2, 0.2))}</g>`) }));
    /* little lights of the villages on the hills (they go out) */
    const lights = [[120, 520], [260, 560], [1330, 520], [1450, 560], [1200, 580]].map(([x, y], i) => ({ i, x, y, el: J.mtL.add(`<g>${warm(16, 0.9)}<path d="M-5 0L5 0L5 -8L-5 -8Z" fill="${C.plaster}"/><path d="M-2 -3L2 -3L2 -6L-2 -6Z" fill="${C.lampFlame}"/></g>`) }));
    /* the sword hung over the land */
    const sword = J.fx.add(`<g><path d="M0 -1600V-30" stroke="${STRING}" stroke-width="1.2"/><g transform="rotate(180) scale(1.9)">${swordSil(c, 90, mix(C.night2, C.rock3, 0.3))}</g></g>`);

    /* the woman with child and her husband; the mother with her baby */
    const F = J.fx;
    const belly = `<path d="${c.cut(c.ell(26, -80, 19, 27, 16), 0.3, 4)}" fill="${shade(EXPECT.robe, 0.06)}"/>`;
    const wife = S.puppet(F.add(addToBody(person(c, EXPECT), belly)));
    const husb = S.puppet(F.add(person(c, HUSBAND)));
    const mom = S.puppet(F.add(person(c, { ...MOTHER, holdF: inArms(c) })));

    /* the captives and their guard */
    const CAP = Array.from({ length: 5 }, (_, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(F.add(person(c, { ...crowdPerson(c), belt: C.rope }))) }));
    const cords = CAP.slice(1).map(() => F.add(`<g>${cord(c, 100)}</g>`));
    const guard = S.puppet(F.add(roman(c, 1)));

    /* the city trampled: standards on the walls, a column marching in, the hourglass */
    const wallStd = [[430, 470], [620, 452], [1000, 440], [1130, 470]].map(([x, y], i) => ({ i, x, y, el: J.cityL.add(`<g transform="scale(.26)">${eagleStandard(c, 300)}</g>`) }));
    const column = Array.from({ length: 5 }, (_, i) => ({ i, p: S.puppet(J.campL.add(roman(c, i))) }));
    const hg = J.fx.add(`<g><path d="M0 -1600V-44" stroke="${STRING}" stroke-width="1.2"/>${hourglass(c, 96)}</g>`);
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB'), stream = hg.querySelector('.stream');

    J.front();

    return (t, time) => {
      const T = time;
      const dark = es(t, 1.05, 1.5);
      J.sk2.fade(dark);
      J.dimL.fade(dark * 0.8);
      J.update(t, T, { sunY: 330 + dark * 200, sunO: 1 - dark });
      camp.set(t, T, -1);

      /* v23a — the woman with child, her husband, the mother and her baby */
      const w = es(t, 0.0, 0.65, (x) => x) ;
      const go = es(t, 1.15, 1.95, (x) => x);
      const wx = lerp(lerp(420, 720, w), 1320, go);
      const rest = bump(t, 0.6, 1.1);
      const walking = (w > 0 && w < 1) || (go > 0 && go < 1);
      wife.set({ x: wx, y: RY, s: 0.95, flip: false, walk: walking ? wx * 0.035 : undefined, amt: 0.5, lean: -3 + rest * 4, head: rest * 8, armF: 8, armB: 20, o: go < 1 ? 1 : 0, blink: blinkAt(T, 2) });
      husb.set({ x: wx - 62, y: RY + 6, s: 0.98, flip: false, walk: walking ? wx * 0.035 + 1 : undefined, amt: 0.5, armF: 64, head: 6 * rest, o: go < 1 ? 1 : 0, blink: blinkAt(T, 3) });
      const mx = wx + 110 - 40 * (1 - w);
      mom.set({ x: mx, y: RY + 12, s: 0.95, flip: false, walk: walking ? mx * 0.04 : undefined, amt: 0.6, head: 10, o: go < 1 ? 1 : 0, blink: blinkAt(T, 5) });

      /* v23b — the storm */
      clouds.forEach((cl) => {
        const k = es(t, 1.05 + cl.i * 0.08, 1.4 + cl.i * 0.08, ease.out);
        pose(cl.el, { x: cl.x + (T ? Math.sin(T * 0.3 + cl.i) * 10 : 0), y: lerp(-400, cl.y, k), o: k > 0.002 ? 1 : 0 });
      });

      /* v24a — the sword; the lights go out; the captives led away */
      const sk = es(t, 2.05, 2.3, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      pose(sword, { x: 1040, y: lerp(-500, 250, sk), r: T ? Math.sin(T * 0.7) * 1.5 : 0, o: sk > 0.002 ? 1 : 0 });
      lights.forEach((l) => pose(l.el, { x: l.x, y: l.y, o: 1 - es(t, 2.25 + l.i * 0.08, 2.35 + l.i * 0.08) }));
      const cg = es(t, 2.05, 2.95, (x) => x);
      const gx = lerp(360, 1500, cg);
      const capOn = cg > 0 && cg < 1 ? 1 : 0;
      guard.set({ x: gx, y: RY, s: 0.9, flip: false, walk: capOn ? gx * 0.05 : undefined, armB: 40, o: capOn, blink: blinkAt(T, 7) });
      const px = CAP.map((m) => gx - 90 - m.i * 70);
      CAP.forEach((m) => {
        m.p.set({ x: px[m.i], y: RY + 4 + (m.i % 2) * 4, s: 0.84, flip: false, walk: capOn ? px[m.i] * 0.05 + m.i : undefined, amt: 0.6, head: 16, lean: 6, armF: 30, o: capOn, blink: blinkAt(T, m.seed) });
      });
      cords.forEach((el, i) => {
        const [x0, y0] = handAt(px[i + 1], RY + 4, 0.84, false, 30);
        const [x1] = [px[i] - 10];
        pose(el, { x: x0, y: y0, sx: Math.max(0.01, (x1 - x0) / 100), o: capOn });
      });

      /* v24b — the standards on the walls, the column at the gate, the hourglass */
      wallStd.forEach((sd) => {
        const k = es(t, 3.05 + sd.i * 0.08, 3.25 + sd.i * 0.08, ease.back);
        pose(sd.el, { x: sd.x, y: sd.y + (1 - k) * 40, s: 0.26, o: k > 0.02 ? 1 : 0 });
      });
      column.forEach((m) => {
        const k = es(t, 3.05 + m.i * 0.06, 3.7 + m.i * 0.06, (x) => x);
        const x = lerp(1180 - m.i * 10, 870, k), y = lerp(680, 600, k);
        m.p.set({ x: x + m.i * 44 * (1 - k), y: y + m.i * 4 * (1 - k), s: 0.42, flip: true, walk: k > 0 && k < 1 ? x * 0.1 + m.i : undefined, o: k > 0 && k < 0.98 ? 1 : 0 });
      });
      const hk = es(t, 3.1, 3.4, ease.out);
      pose(hg, { x: 800, y: lerp(-400, 190, hk) + (T ? Math.sin(T * 0.9) * 2 : 0), r: T ? Math.sin(T * 0.8) * 1.2 * hk : 0, o: hk > 0.002 ? 1 : 0 });
      const sand = es(t, 3.3, 3.95);
      pose(sandT, { x: 0, y: -3, sy: Math.max(0.02, 1 - sand) });
      pose(sandB, { x: 0, y: 48, sy: 0.25 + sand * 0.75 });
      fade(stream, hk > 0.5 && sand < 0.98 ? 0.9 : 0);

      S.cam.x = -es(t, 0.0, 0.5) * 20 * (1 - es(t, 1.0, 1.5));
      S.cam.z = 1 + es(t, 0.0, 0.5) * 0.08 * (1 - es(t, 1.0, 1.5)) + es(t, 3.0, 3.5) * 0.04;
      S.cam.y = es(t, 0.0, 0.5) * 30 * (1 - es(t, 1.0, 1.5)) - es(t, 3.0, 3.5) * 30;
      void seg; void shade; void tr;
    };
  },
};
