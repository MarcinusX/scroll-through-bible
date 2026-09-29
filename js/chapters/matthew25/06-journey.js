// Mt 25,14–15 — a new painted flat comes down: a rich man's courtyard in the morning, his travelling bundle and staff
// by the gate. He calls his three servants in and opens his chest. To the first he gives five gold talents, to the
// second two, to the third one — they fly into their hands, and a number hangs over each. "Each according to his
// ability": three vessels come down over them, a big, a middle and a small one, each filled to the brim with gold.
// Then he takes his staff and goes out of the gate on his journey, and the gate swings to.
import { C, person, blinkAt, pose, lerp, sheet, shade } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { estateSet, ES, MASTER, SERV5, SERV2, SERV1, talent, pilePos, chest, wordOn, plateOn, sparkle, kf, moving, tr } from './lib.js';

const CX = 780;                              // the chest
const SP = [[880, SERV5, 5], [965, SERV2, 2], [1045, SERV1, 1]];

export default {
  id: 'mt25-journey',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 14 },
    { v: 15, text: 'Jednemu dał pięć talentów, drugiemu dwa, trzeciemu jeden,' },
    { v: 15, cont: true, text: 'każdemu według jego zdolności,' },
    { v: 15, cont: true, text: 'i odjechał. Zaraz' },
  ],
  cam: { x: [-30, 90], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const E = estateSet(S, { sunAt: [1300, 170] });
    const c = E.c;
    const P = S.layer({ par: E.P, sh: 5 });
    const box = P.add(`<g>${chest(c, { w: 76, h: 44 })}</g>`);
    const lid = box.querySelector('.lid'), boxGlow = box.querySelector('.glow');
    const pack = P.add(`<g>${sheetBundle(c)}</g>`);
    const masterStaff = S.puppet(P.add(person(c, { ...MASTER, holdB: `<g transform="rotate(10)">${staffM(c)}</g>` })));
    const master = S.puppet(P.add(person(c, MASTER)));
    const serv = SP.map(([x, o, n], i) => ({ i, x, n, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, o))), gold: Array.from({ length: n }, () => P.add(`<g>${talent(c)}</g>`)) }));
    const fx = S.layer({ par: 0.3, sh: 6 });
    const nums = serv.map((s) => fx.add(`<g>${wordOn(c, String(s.n), { size: 30, w: 50 })}</g>`));
    const vessels = serv.map((s, i) => fx.add(`<g>${plateOn(c, jarGold(c, [58, 40, 26][i]), { r: 50 })}</g>`));
    const sparks = [0, 1, 2, 3, 4, 5, 6, 7].map(() => fx.add(`<g>${sparkle(c, 8)}</g>`));

    return (t, time) => {
      const T = time;
      E.update(T, { sunX: lerp(1300, 1180, es(t, 0, 4)), sunY: lerp(190, 130, es(t, 0, 4)) });
      E.joy(0);
      /* v14 — he calls his servants and opens his chest */
      const openK = es(t, 0.55, 0.8);
      pose(box, { x: CX, y: ES.G + 4 });
      pose(lid, { x: -39, y: -44, r: -openK * 100 });
      pose(boxGlow, { o: openK * (1 - es(t, 3.0, 3.3)) });
      /* v15c — he takes his staff and goes out of the gate */
      const MK_ = [[3.05, 700], [3.6, ES.GATE + 20]];
      const mx = kf(t, MK_, (u) => u);
      const withStaff = es(t, 3.0, 3.06);
      const gone = es(t, 3.55, 3.65);
      const call = es(t, 0.05, 0.3) * (1 - es(t, 0.6, 0.8));
      const giving = t > 1 && t < 2 ? 1 : 0;
      const touch = bump(t, 2.05, 2.9);
      master.set({ x: 700, y: ES.G, s: 0.98, o: 1 - withStaff, armF: 20 + call * 70 + giving * 50 + touch * 60, armB: 10 + call * 40, head: -call * 4, blink: blinkAt(T, 1) });
      masterStaff.set({ x: mx, y: ES.G, s: 0.98, o: withStaff * (1 - gone), walk: moving(t, MK_) ? mx * 0.06 : undefined, armB: 30, blink: blinkAt(T, 1) });
      pose(pack, { x: ES.GATE - 70, y: ES.G + 2, o: 1 - withStaff });
      E.gateOpen(es(t, 3.05, 3.3) * (1 - es(t, 3.65, 3.9)));

      /* the servants come in (v14) and receive the talents (v15a) */
      serv.forEach((s) => {
        const SK = [[0.1 + s.i * 0.08, 1250 + s.i * 40], [0.6 + s.i * 0.08, s.x]];
        const x = kf(t, SK, ease.out);
        const hold = es(t, 1.0, 1.15);
        const leave = es(t, 3.7 + s.i * 0.05, 3.95, (u) => u) * (s.i === 0 ? 1 : 0);
        s.p.set({ x: x + leave * 60, y: ES.G + s.i * 3, s: 0.9, flip: leave < 0.02, walk: moving(t, SK) || (leave > 0 && leave < 1) ? x * 0.07 : undefined, armF: 12 + hold * 58, armB: 6 + hold * 20, head: -4 + (1 - hold) * 4, blink: blinkAt(T, s.seed) });
        const start = 1.05 + [0, 0.35, 0.55][s.i];
        s.gold.forEach((el, k) => {
          const f = es(t, start + k * 0.06, start + k * 0.06 + 0.25);
          const [px, py] = pilePos(x + leave * 60, ES.G + s.i * 3, 0.9, leave < 0.02, 12 + hold * 58, s.n, k);
          pose(el, { x: lerp(CX, px, f), y: lerp(ES.G - 50, py, f) - Math.sin(f * Math.PI) * 60, s: 0.72, o: f > 0.01 ? 1 : 0 });
        });
        const nk = es(t, start + 0.2, start + 0.45, ease.out) * (1 - es(t, 1.95, 2.1));
        pose(nums[s.i], { x: s.x, y: lerp(-1500, 330, nk), r: Math.sin(T * 0.9 + s.i) * 2, o: nk > 0.01 ? 1 : 0 });
        /* v15b — according to his ability: three vessels, big, middle, small, each full */
        const vk = es(t, 2.1 + s.i * 0.1, 2.45 + s.i * 0.1, ease.out) * (1 - es(t, 2.95, 3.1));
        pose(vessels[s.i], { x: s.x, y: lerp(-1500, 300, vk), r: Math.sin(T * 0.8 + s.i) * 2, o: vk > 0.01 ? 1 : 0 });
      });
      sparks.forEach((sp, i) => {
        const k = bump(t, 1.1 + i * 0.08, 1.45 + i * 0.08);
        pose(sp, { x: CX + Math.cos(i * 2.1) * 40, y: ES.G - 70 + Math.sin(i * 1.3) * 20, s: k, r: T * 40, o: k });
      });

      S.cam.x = es(t, 0.9, 1.3) * 40 * (1 - es(t, 2.9, 3.1)) + es(t, 3.1, 3.6) * 70;
      S.cam.z = 1 + es(t, 0.9, 1.3) * 0.05 * (1 - es(t, 2.9, 3.1));
    };
  },
};

/** a jar brim-full of gold coins (origin: plate centre) */
function jarGold(c, h) {
  const s = sheet();
  const y0 = h / 2 + 4;
  s.p(c.cut([[-h * 0.3, y0], [-h * 0.44, y0 - h * 0.45], [-h * 0.34, y0 - h * 0.9], [h * 0.34, y0 - h * 0.9], [h * 0.44, y0 - h * 0.45], [h * 0.3, y0]], 0.4, 4), C.pot);
  let d = '';
  for (let i = 0; i < Math.round(h / 8); i++) d += c.cut(c.circ(c.rr(-h * 0.3, h * 0.3), y0 - h * 0.9 - c.rr(0, h * 0.18), c.rr(4, 6), 8), 0.2, 2);
  s.p(d, C.sun);
  s.x(c.ribbon([[-h * 0.4, y0 - h * 0.5], [h * 0.4, y0 - h * 0.5]], 2), shade(C.pot, -0.25), 'opacity=".7"');
  return s.out();
}
/** a walking staff for the journey (held in the back hand) */
function staffM(c) {
  return sheet().p(c.ribbon([[0, -120], [1.5, 0], [0, 80]], 5), C.wood2).out();
}
/** the travelling bundle and a waterskin by the gate (origin: bottom centre) */
function sheetBundle(c) {
  return sheet().p(c.cut([[-26, 0], [-30, -22], [-18, -38], [14, -40], [28, -24], [26, 0]], 0.6, 5), C.clayMantle).p(c.ribbon([[-20, -30], [18, -32]], 3), C.rope).p(c.cut(c.ell(34, -12, 12, 14, 12), 0.4, 4), C.leather).out();
}
