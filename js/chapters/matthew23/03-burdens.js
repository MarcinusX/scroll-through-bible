// Mt 23,4 — a painted flat: a street of Jerusalem. The scribe and the Pharisee point, and one heavy bundle after another,
// roped tight and stuffed with little rule-scrolls, drops onto the shoulders of the people in the street — a porter, a
// mother, an old man — who bend lower and lower. The old man's load slides; the Pharisee lifts one finger towards it…
// and takes it back, folds his hands behind him and looks away: "they themselves will not move a finger".
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, mix, shade } from '../kit.js';
import { sun, cloud, grass } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, PH, SC, folk, bundle, streetFlat, dust } from './lib.js';

const GY = 660;
/** a point on a puppet's back (body coords bx, by) after it leans; world coords */
function onBack(x, y, s, flip, lean, bx = -22, by = -150) {
  const a = (lean * Math.PI) / 180;
  const rx = bx * Math.cos(a) - by * Math.sin(a), ry = bx * Math.sin(a) + by * Math.cos(a);
  return [x + (flip ? -rx : rx) * s, y + ry * s];
}

export default {
  id: 'mt23-burdens',
  enter: 'fly',
  beats: [
    { v: 4 },
  ],
  cam: { x: [-20, 40], y: [-20, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#d5e2da', '#f0e6cc', '#f6e4c6']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1220, y: 140, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 540, y: 140, len: 700 });
    const back = S.layer({ par: 0.2, sh: 3 });
    back.add(streetFlat(c, { gy: GY - 40 }));
    // an arch over the street at the back
    const arch = sheet();
    const AC = mix(C.stone2, C.sand, 0.3);
    arch.p(c.cut([[180, GY - 40], [180, 330], ...c.arc(330, 330, 150, 110, Math.PI, 2 * Math.PI, 14), [480, 330], [480, GY - 40], [440, GY - 40], [440, 340], ...c.arc(330, 340, 110, 80, 2 * Math.PI, Math.PI, 14), [220, 340], [220, GY - 40]], 0.6, 8), AC);
    back.add(arch.out());
    const G = S.layer({ par: 0.4, sh: 3 });
    G.add(sheet().p(c.cut([[-900, GY - 42], [2500, GY - 46], [2500, 1700], [-900, 1700]], 1, 16), mix(C.sand, C.stone, 0.35)).out() + grass(c, { x0: -700, x1: 2300, y: GY - 40, n: 20, h: 10, color: C.olive }));

    /* the bearers */
    const P = S.layer({ par: 0.45, sh: 5 });
    // phone: the street drawn in a little, so the first bearer and the pointing scribe are both on the screen
    const PH_ = S.portrait;
    const BEAR = [
      { x: PH_ ? 485 : 430, o: folk(c, true, { robe: C.ochreRobe, belt: C.rope }), n: 2 },
      { x: PH_ ? 645 : 610, o: folk(c, false, { robe: C.sageRobe }), n: 1 },
      { x: 850, o: { robe: C.stone2, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3 }, n: 2 },
    ].map((b, i) => ({ ...b, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, b.o))) }));
    const loads = [];
    BEAR.forEach((b) => { for (let k = 0; k < b.n; k++) loads.push({ b, k, el: P.add(`<g>${bundle(c, 96 - k * 16, 70 - k * 12, mix(C.basket, [C.wood3, C.clay, C.wheat2][(b.i + k) % 3], 0.4))}</g>`) }); });
    const fx = S.layer({ par: 0.45, sh: 4 });
    const puffs = BEAR.map(() => fx.add(`<g>${dust(c, 24, C.sand2)}</g>`));

    /* the Pharisee and the scribe */
    const finger = `<path d="${c.ribbon([[0, 0], [2, 13]], 3.2)}" fill="${C.skin2}"/>`;
    const phar = S.puppet(P.add(vain(c, PH, { holdF: finger })));
    const scribe = S.puppet(P.add(vain(c, SC)));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(120, 990, 260, 90, 12, 0.2), 1, 8), mix(C.sand2, C.dune, 0.3)).p(c.cut(c.blob(1500, 1000, 280, 100, 12, 0.2), 1, 8), mix(C.sand2, C.dune, 0.4)).out());

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 140, T, 1, 0.6);
      swing(cl, 540 + (T ? Math.sin(T * 0.1) * 20 : 0), 140, T, 1.2, 0.7, 1);

      /* one bundle after another drops onto their shoulders; they bend lower */
      const slip = es(t, 0.5, 0.62) * (1 - es(t, 0.9, 1.0) * 0.4);
      BEAR.forEach((b) => {
        let bend = 0;
        loads.filter((l) => l.b === b).forEach((l) => { bend += es(t, 0.06 + b.i * 0.1 + l.k * 0.13, 0.14 + b.i * 0.1 + l.k * 0.13, ease.out) * (7 + l.k * 4); });
        const old = b.i === 2;
        b.lean = bend + (old ? slip * 6 : 0);
        b.p.set({ x: b.x, y: GY, s: 0.94, flip: true, lean: b.lean, head: 10 + bend * 1.2, armF: 50 + bend * 2, armB: 70 + bend * 2, bob: bend * 0.4, blink: blinkAt(T, b.seed) });
      });
      loads.forEach((l) => {
        const k = es(t, 0.04 + l.b.i * 0.1 + l.k * 0.13, 0.14 + l.b.i * 0.1 + l.k * 0.13, ease.in);
        const [bx, by] = onBack(l.b.x, GY, 0.94, true, l.b.lean, -40 + l.k * 4, -100 - l.k * 48);
        const old = l.b.i === 2 && l.k === 1;
        pose(l.el, { x: bx + (old ? slip * 24 : 0), y: lerp(-300, by, k) + l.b.lean * 0.3, r: -l.b.lean * 0.8 + (old ? slip * 16 : 0) + (l.k ? 6 : 0), s: 0.94, o: k > 0.01 ? 1 : 0 });
      });
      BEAR.forEach((b, i) => {
        const k = seg(t, 0.14 + i * 0.1, 0.4 + i * 0.1);
        pose(puffs[i], { x: b.x - 10, y: GY - 6, s: 0.6 + k, o: Math.sin(k * Math.PI) * 0.8 });
      });

      /* the scribe points at them; the Pharisee lifts one finger to the sliding load… and takes it back */
      const reach = bump(t, 0.56, 0.93);
      const away = es(t, 0.8, 0.95);
      scribe.set({ x: PH_ ? 1065 : 1120, y: GY + 6, s: 0.96, flip: true, armF: 10 + bump(t, 0.03, 0.5) * 70, armB: 10 + bump(t, 0.03, 0.5) * 40, head: -8 - es(t, 0.5, 0.7) * 6, blink: blinkAt(T, 3) });
      phar.set({ x: PH_ ? 960 : 975, y: GY + 2, s: 1, flip: true, armF: 20 + reach * 62 * (1 - away * 0.6), armB: 10 + away * 40, head: -10 + reach * 8 - away * 10, lean: -away * 5, blink: blinkAt(T, 5) });

      S.cam.x = 20;
      S.cam.z = 1.02 + es(t, 0.4, 0.8) * 0.04;
      S.cam.y = 0;
    };
  },
};
