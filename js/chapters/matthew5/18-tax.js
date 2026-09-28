// Mt 5,46–47 — a painted flat of a town square: a tax booth on one side, a little pagan shrine on the other.
// Two friends embrace — a heart goes from one to the other and back: if you love those who love you, what reward
// is that? (a question mark hangs over an empty prize-plate). At the booth the tax collector embraces his friend
// in just the same way. A man greets his two brothers warmly — and turns his back on a stranger with his bundle:
// what more are you doing? And before the shrine the Gentiles greet one another too (and the tax collectors wave).
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, olive, cypress, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { SKY, LOOK, taxBooth, heart, question, tagWord, man, woman, folk, tr, PI, STRING } from './lib.js';

const G = 690;
const BOOTH = [520, G], SHRINE = [1090, G];

function shrine(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-110, -26, 220, 26), 0.5, 8), mix(C.stone, C.cream, 0.3));
  s.p(c.cut(c.rect(-96, -40, 192, 14), 0.4, 8), C.stone);
  let cols = '';
  [-80, -40, 40, 80].forEach((x) => { cols += c.cut(c.rect(x - 8, -190, 16, 150), 0.3, 6); });
  s.p(cols, mix(C.cream, C.stone, 0.3));
  s.p(c.cut([[-104, -190], [104, -190], [0, -250]], 0.5, 8), mix(C.stone, C.cream, 0.2));
  s.p(c.cut(c.rect(-104, -198, 208, 12), 0.4, 8), C.stone2);
  // a little statue on a plinth inside
  s.p(c.cut(c.rect(-14, -80, 28, 40), 0.3, 4), C.stone2);
  s.p(c.cut([[-10, -80], [-8, -130], [0, -140], [8, -130], [10, -80]], 0.3, 4) + c.cut(c.circ(0, -148, 9, 12), 0.2, 3), mix(C.stone, C.rock, 0.4));
  return s.out();
}
function prizePlate(c) {
  const s = sheet().p(c.cut(c.circ(0, 0, 34, 30), 0.4, 5), C.haloRim).p(c.cut(c.circ(0, 0, 27, 30), 0.4, 5), C.cream);
  return `<path d="M0 -2400V-34" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}`;
}

export default {
  id: 'mt5-tax',
  enter: 'fly',
  beats: [
    { v: 46, text: 'Jeśli bowiem miłujecie tych, którzy was miłują, cóż za nagrodę mieć będziecie?' },
    { v: 46, cont: true, text: 'Czyż i celnicy tego nie czynią?' },
    { v: 47, text: 'I jeśli pozdrawiacie tylko swych braci, cóż szczególnego czynicie?' },
    { v: 47, cont: true, text: 'Czyż i poganie tego nie czynią?' },
  ],
  cam: { x: [-20, 20], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SKY.morning);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 620, y: 150, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.2), x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(hillsWith(c, { y: 520, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 18, x0: -1400, x1: 3000 }).markup + house(c, 660, 540, 90, 70, { stairs: false }) + house(c, 780, 530, 110, 84, { stairs: false }) + house(c, 920, 542, 80, 64, { stairs: false }));
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, 590], [3000, 584], [3000, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.stone, 0.35)).out() + cypress(c, 1400, 610, 120) + olive(c, 140, 640, 0.8));
    const TB = taxBooth(c, 230, 230);
    ground.add(`<g transform="translate(${BOOTH[0]} ${BOOTH[1]})">${TB.back}</g><g transform="translate(${SHRINE[0]} ${SHRINE[1]})">${shrine(c)}</g>`);

    /* people */
    const P = S.layer({ par: 0.34, sh: 5 });
    const tax = S.puppet(P.add(person(c, LOOK.taxman)));
    const tax2 = S.puppet(P.add(person(c, { ...LOOK.taxman, robe: C.ochreRobe, mantle: C.plumRobe, hair: C.hair2 })));
    const front = S.layer({ par: 0.34, sh: 4 });
    front.add(`<g transform="translate(${BOOTH[0]} ${BOOTH[1]})">${TB.front}</g>`);
    const Q = S.layer({ par: 0.36, sh: 5 });
    const A = S.puppet(Q.add(person(c, man(c, { robe: C.sageRobe, mantle: C.wood3 }))));
    const B = S.puppet(Q.add(person(c, man(c, { robe: C.dustyBlue, mantle: null }))));
    const bros = [0, 1].map((i) => S.puppet(Q.add(person(c, man(c, { robe: [C.mauve, C.tealRobe][i], mantle: null })))));
    const stranger = S.puppet(Q.add(person(c, { ...folk(c, true, { robe: mix(C.stone2, C.sand2, 0.3), mantle: null }), holdB: `<g transform="translate(-4 4)">${sheet().p(c.cut(c.blob(0, 0, 16, 12, 10, 0.2), 0.5, 4), C.leather).out()}</g>` })));
    const pag = [0, 1].map((i) => S.puppet(Q.add(person(c, { ...LOOK.pagan, mantle: [C.curtain, C.dustyBlue][i], hair: [C.hair2, C.greyHair][i], beard: i ? 'short' : 'none', skin: [C.skin, C.skin2][i] }))));
    const hearts = [0, 1, 2, 3].map(() => Q.add(`<g>${heart(c, 11)}</g>`));
    const pairHeart = Q.add(`<g>${heart(c, 16)}</g>`);
    const fly = S.layer({ par: 0.3, sh: 6 });
    const prize = fly.add(`<g>${prizePlate(c)}</g>`);
    const q1 = fly.add(`<g>${question(c)}</g>`);
    const q2 = fly.add(`<g>${question(c)}</g>`);
    const tagT = fly.add(`<g>${tagWord(c, tr('celnicy', 'tax collectors'), { size: 18 })}</g>`);
    const tagP = fly.add(`<g>${tagWord(c, tr('poganie', 'Gentiles'), { size: 18 })}</g>`);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1250, y: 140, r: Math.sin(T * 0.6) });
      pose(cl, { x: 620 + Math.sin(T * 0.1) * 20, y: 150, r: Math.sin(T * 0.6 + 1) });
      const heartArc = (el, x0, x1, k, lift = 90) => pose(el, { x: lerp(x0, x1, k), y: G - 200 - Math.sin(k * PI) * lift, s: k > 0.001 && k < 0.999 ? 1 : 0, o: k > 0.001 && k < 0.999 ? 1 : 0 });

      /* v46a — friends who love each other; what reward? */
      const aside = es(t, 1.95, 2.3);
      const hug = es(t, 0.08, 0.28) * (1 - aside);
      const ax = lerp(700, 740, hug) - aside * 60, bx = lerp(900, 860, hug) + aside * 60;
      if (t <= 2) A.set({ x: ax, y: G + 10, s: 1.0, armF: 20 + hug * 70, armB: hug * 40, blink: blinkAt(T, 1) });
      heartArc(hearts[0], 750, 850, es(t, 0.22, 0.44, (x) => x), 60);
      heartArc(hearts[1], 850, 750, es(t, 0.42, 0.62, (x) => x), 60);
      const ph = es(t, 0.6, 0.72, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(pairHeart, { x: 800, y: G - 236, s: ph, o: ph > 0.01 ? 1 : 0 });
      const pk = es(t, 0.44, 0.66, ease.out) * (1 - es(t, 1.95, 2.2));
      pose(prize, { x: 800, y: lerp(-300, 250, pk), r: Math.sin(T * 1.1) * 3, o: pk > 0.01 ? 1 : 0 });
      pose(q1, { x: 830, y: 216, s: es(t, 0.56, 0.7, ease.back) * (1 - es(t, 1.95, 2.2)), r: Math.sin(T * 1.4) * 6 });

      /* v46b — the tax collectors do the same */
      const th = es(t, 1.06, 1.26);
      const wave = es(t, 3.2, 3.4);
      tax.set({ x: BOOTH[0] - 40, y: G - 6, s: 0.96, armF: 20 + th * 70 + wave * 20, armB: th * 30 + wave * 100, head: -wave * 4, blink: blinkAt(T, 3) });
      tax2.set({ x: lerp(BOOTH[0] + 150, BOOTH[0] + 40, es(t, 0.9, 1.1)), y: G - 2, s: 0.96, flip: true, o: seg(t, 0.86, 0.92), walk: t > 0.9 && t < 1.1 ? t * 30 : undefined, armF: 20 + th * 70, armB: th * 20 + wave * 90, blink: blinkAt(T, 4) });
      heartArc(hearts[2], BOOTH[0] - 20, BOOTH[0] + 30, es(t, 1.2, 1.44, (x) => x), 40);
      pose(tagT, { x: BOOTH[0], y: lerp(-300, 290, es(t, 1.3, 1.5, ease.back)), r: Math.sin(T * 1.1) * 2 });

      /* v47a — greeting only his brothers, turning his back on the stranger */
      const bk = es(t, 2.04, 2.3, (x) => x);
      const greet = es(t, 2.3, 2.46);
      const snub = es(t, 2.5, 2.6);
      bros.forEach((b, i) => {
        const x = lerp(1000 + i * 70, 880 + i * 70, bk);
        b.set({ x, y: G + 14, s: 0.98, flip: true, walk: bk > 0 && bk < 1 ? x * 0.05 : undefined, armB: greet * 130 * (i === 0 ? 1 : 0.6), armF: 20 + greet * 30, o: seg(t, 2.0, 2.06), blink: blinkAt(T, 5 + i) });
      });
      const sx = lerp(440, 640, es(t, 2.2, 2.46, (x) => x));
      stranger.set({ x: sx, y: G + 16, s: 0.96, walk: t > 2.2 && t < 2.46 ? sx * 0.05 : undefined, armF: 20 + es(t, 2.46, 2.56) * 60, head: 4, o: seg(t, 2.16, 2.22), blink: blinkAt(T, 7) });
      // A turns from the stranger to greet his brothers (B has gone aside)
      if (t > 2) A.set({ x: lerp(740, 770, es(t, 2.0, 2.2)), y: G + 10, s: 1.0, armB: greet * 140, armF: 20 + greet * 40, head: -greet * 4, lean: snub * 3, blink: blinkAt(T, 1) });
      pose(q2, { x: 900, y: 360, s: es(t, 2.56, 2.7, ease.back) * (1 - es(t, 2.95, 3.1)), r: Math.sin(T * 1.3) * 6 });

      /* v47b — the Gentiles greet each other the same way (and the tax collectors wave) */
      const pg = es(t, 3.06, 3.3);
      pag.forEach((p, i) => p.set({ x: SHRINE[0] - 50 + i * 96 - (i ? pg * 26 : -pg * 18), y: G + 10, s: 0.98, flip: i === 1, armB: pg * 120, armF: 20 + pg * 50, head: -pg * 4, blink: blinkAt(T, 8 + i) }));
      heartArc(hearts[3], SHRINE[0] - 30, SHRINE[0] + 30, es(t, 3.2, 3.44, (x) => x), 40);
      pose(tagP, { x: SHRINE[0], y: lerp(-300, 290, es(t, 3.2, 3.42, ease.back)), r: Math.sin(T * 1.2) * 2 });
      B.set({ x: bx, y: G + 12, s: 1.0, flip: true, armF: 20 + hug * 70, armB: hug * 40, o: 1 - aside, blink: blinkAt(T, 2) });

      S.cam.x = -es(t, 0.9, 1.2) * 20 * (1 - es(t, 1.9, 2.1)) + es(t, 2.9, 3.2) * 20;
      S.cam.z = 1.02;
      S.cam.y = -12;
    };
  },
};
