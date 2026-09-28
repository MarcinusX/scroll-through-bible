// Mt 5,23–24 — a painted flat of the Temple court: the altar of burnt offering smoking before the sanctuary, a
// priest waiting. A man brings his lamb up to the altar — and stops: in a thought bubble he sees his brother,
// arms folded, turned away from him. He leaves the lamb there before the altar and goes back through the court to
// his brother; they embrace. Then the two of them come back together, and he offers his gift: the smoke rises
// straight up into the light.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, altar, puff, lamb, thought, heart, greyCloud, beam, PI } from './lib.js';

const G = 668;
const ALTAR = [1030, G - 10];

export default {
  id: 'mt5-altar',
  enter: 'fly',
  beats: [
    { v: 23 },
    { v: 24, text: 'zostaw tam dar swój przez ołtarzem, a najpierw idź i pojednaj się z bratem swoim!' },
    { v: 24, cont: true, text: 'Potem przyjdź i dar swój ofiaruj!' },
  ],
  cam: { x: [-160, 120], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKY.gold);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 360, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 1250, y: 170, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 480, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.dune, 0.25), x0: -1400, x1: 3000 }).markup);

    /* the sanctuary behind, and the colonnade round the court */
    const back = S.layer({ par: 0.16, sh: 3 });
    const sa = sheet();
    const SX = 1180;
    sa.p(c.cut(c.rect(SX - 130, 250, 260, 330), 0.6, 10), mix(C.cream, C.stone, 0.3));
    sa.p(c.cut(c.rect(SX - 150, 230, 300, 26), 0.4, 8), C.sun);
    sa.p(c.cut([[SX - 40, 580], [SX - 40, 370], ...c.arc(SX, 370, 40, 36, PI, 2 * PI, 8), [SX + 40, 580]], 0.4, 6), C.sun);
    let cols = '';
    [SX - 110, SX - 76, SX + 64, SX + 98].forEach((x) => { cols += c.cut(c.rect(x, 270, 14, 300), 0.3, 6); });
    sa.p(cols, C.stone2);
    back.add(sa.out());
    const colL = S.layer({ par: 0.24, sh: 3 });
    const co = sheet();
    co.p(c.cut([[-1400, 380], [880, 380], [880, 404], [-1400, 404]], 0.5, 12), mix(C.stone, C.sand2, 0.3));
    let cc = '';
    for (let x = -700; x < 880; x += 110) cc += c.cut(c.rect(x, 404, 20, 200), 0.3, 8);
    co.p(cc, mix(C.cream, C.stone, 0.4));
    co.p(c.cut([[-1400, 604], [880, 604], [880, 620], [-1400, 620]], 0.4, 12), mix(C.stone, C.sand2, 0.4));
    colL.add(co.out());
    const floor = S.layer({ par: 0.3, sh: 3 });
    const fl = sheet().p(c.cut([[-1400, 620], [3000, 614], [3000, 1800], [-1400, 1800]], 0.6, 14), mix(C.stone, C.sand, 0.4));
    let jn = '';
    for (let y = 650; y < 900; y += 40) jn += c.ribbon([[-1400, y], [3000, y - 4]], 1.2);
    for (let x = -1300; x < 3000; x += 90) jn += c.ribbon([[x, 620], [x - 60, 900]], 1.2);
    fl.x(jn, shade(C.stone, -0.18), 'opacity=".5"');
    floor.add(fl.out());
    floor.add(`<g transform="translate(${ALTAR[0]} ${ALTAR[1]})">${altar(c, 180, 110)}</g>`);

    /* smoke and fire on the altar */
    const smokeL = S.layer({ par: 0.3, sh: 2 });
    const light = smokeL.add(`<g>${beam(c, 60, 200, 520)}</g>`);
    const puffs = Array.from({ length: 6 }, (_, i) => ({ i, el: smokeL.add(`<g>${puff(c, 26 + i * 3)}</g>`) }));
    const fire = smokeL.add(`<g><circle r="70" fill="url(#warm-glow)"/><path d="M-20 0C-26 -20 -10 -30 -6 -52C4 -34 22 -26 18 0Z" fill="${C.sunDeep}"/><path d="M-6 0C-10 -14 0 -20 2 -34C8 -20 12 -12 8 0Z" fill="${C.lampFlame}"/></g>`);

    /* people */
    const P = S.layer({ par: 0.34, sh: 5 });
    const priest = S.puppet(P.add(person(c, { robe: C.linen, mantle: C.skyVeil, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', skin: C.skin2, belt: C.dustyBlue })));
    const lambEl = P.add(`<g>${lamb(c)}</g>`);
    const bro = S.puppet(P.add(person(c, LOOK.brotherB)));
    const man = S.puppet(P.add(person(c, LOOK.brotherA)));
    const inner = `<g transform="translate(-4 34) scale(.3)">${person(c, LOOK.brotherB)}</g><g transform="translate(12 -26) scale(.3)">${greyCloud(c, 90)}</g>`;
    const tb = P.add(`<g>${thought(c, inner, { w: 86, h: 76 })}</g>`);
    const ht = P.add(`<g>${heart(c, 14)}</g>`);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 360, y: 150, r: Math.sin(T * 0.6) });
      pose(cl, { x: 1250 + Math.sin(T * 0.1) * 20, y: 170, r: Math.sin(T * 0.6 + 1) });

      /* fire and smoke: drifting at first; at the offering it rises straight into the light */
      const offer = es(t, 2.45, 2.7);
      pose(fire, { x: ALTAR[0], y: ALTAR[1] - 118, sy: 0.9 + Math.sin(T * 7) * 0.08 + offer * 0.4, o: 1 });
      puffs.forEach((p) => {
        const k = T ? (T * 0.12 + p.i / 6) % 1 : p.i / 6;
        const drift = (1 - offer) * 60;
        pose(p.el, { x: ALTAR[0] + k * drift + Math.sin(k * 6 + p.i) * 10 * (1 - offer), y: ALTAR[1] - 150 - k * 360, s: 0.6 + k * 0.9, o: (1 - k) * (0.6 + offer * 0.3) });
      });
      pose(light, { x: ALTAR[0], y: -30, o: offer * 0.8 });

      /* v23 — he brings his lamb to the altar, and remembers his brother */
      const w1 = es(t, 0.02, 0.42, (x) => x);
      const back1 = es(t, 1.14, 1.46, (x) => x);
      const w3 = es(t, 2.04, 2.42, (x) => x);
      const hug = es(t, 1.48, 1.62) * (1 - es(t, 2.0, 2.1));
      let mx = lerp(560, 880, w1);
      mx = lerp(mx, 590, back1);
      mx = lerp(mx, 860, w3);
      const mFlip = back1 > 0 && w3 === 0;
      const walking = (w1 > 0 && w1 < 1) || (back1 > 0 && back1 < 1) || (w3 > 0 && w3 < 1);
      const stopK = es(t, 0.44, 0.56) * (1 - es(t, 1.05, 1.15));
      man.set({ x: mx, y: G + 12, s: 1.0, flip: mFlip, walk: walking ? mx * 0.05 : undefined, armF: 30 + hug * 60 + offer * 60, armB: 10 + hug * 40 + offer * 100, head: stopK * 10 - offer * 10, blink: blinkAt(T, 1) });
      // the lamb follows him, then stays before the altar
      const lx = t < 1.05 ? mx + 70 : t < 2.3 ? 950 : lerp(950, 1000, es(t, 2.3, 2.5));
      pose(lambEl, { x: lx, y: G + 10, s: 0.9, r: walking && t < 0.5 ? Math.sin(T * 8) * 2 : 0 });
      const th = es(t, 0.46, 0.62, ease.back) * (1 - es(t, 1.08, 1.2));
      pose(tb, { x: mx - 10, y: G - 190, s: th, o: th > 0.01 ? 1 : 0 });
      priest.set({ x: 1150, y: G + 6, s: 1.0, flip: true, armF: 20 + offer * 50, armB: offer * 130, head: -offer * 10 + stopK * 4, blink: blinkAt(T, 2) });

      /* v24a — goes back and makes peace with his brother (they embrace); v24b — they come back together */
      const turn = es(t, 1.4, 1.5);
      const bX = t < 2.0 ? 480 : lerp(480, 740, w3);
      bro.set({ x: bX + hug * 16, y: G + 14, s: 1.0, flip: turn < 0.5, walk: w3 > 0 && w3 < 1 ? bX * 0.05 : undefined, armF: hug * 80 + 10, armB: hug * 50 + offer * 90, head: turn < 0.5 ? 8 : -4 - offer * 8, blink: blinkAt(T, 3) });
      const hk = es(t, 1.56, 1.7, ease.back) * (1 - es(t, 2.0, 2.15));
      pose(ht, { x: 536, y: G - 230, s: hk, o: hk > 0.01 ? 1 : 0 });

      S.cam.x = lerp(20, -130, es(t, 1.1, 1.5)) + es(t, 2.0, 2.45) * 150;
      S.cam.z = 1.02 + es(t, 0.3, 0.6) * 0.03 - es(t, 1.1, 1.4) * 0.03;
    };
  },
};
