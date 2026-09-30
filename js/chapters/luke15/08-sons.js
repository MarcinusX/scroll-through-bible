// Łk 15,11–13a — the parable flies in: a farmstead on a spring morning — the two-storey house with its arched door,
// the courtyard, the stone gateway, the road winding away over the fields and hills. "A certain man had two sons":
// the old father comes out of his door; the elder son comes in from the left with his hoe on his shoulder, the
// younger from the gate on the right, and the father opens his arms to both. "The younger said to his father:
// 'Father, give me the share of the property that falls to me'": the younger steps up with his hand held out, and
// the father's face falls. "So he divided his property between them": a chest is opened, and the coins go out of
// it in two streams, a heap before each son. "Not many days later the younger son gathered all he had and set off
// for a far country": the younger scoops his heap into a fat purse, mounts a camel hung with bags and rides out
// through the gate and away along the winding road, smaller and smaller over the hills — the father at the gate
// with his hand raised, the elder turning back to his work.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  farmSet, FM, ROAD, onRoad, FATHER, YOUNGER, YOUNGER_RICH, ELDER, withFace, faceBits, say, goldCoin, coinHeap, riderCamel, walkCamel,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, MORNING,
} from './lib.js';

const GY = FM.GY;
const FX = 600, EX = 452, YX = 730;
const CH = [640, GY + 6];
const HL = 500, HR = 772;

/** a small wooden chest with a lid that opens (origin: base centre); lid: .lid */
function chest(c) {
  const s = sheet().p(c.cut([[-40, 0], [-40, -40], [40, -40], [40, 0]], 0.4, 6), C.wood).x(c.ribbon([[-40, -20], [40, -20]], 3), C.ochre).p(c.cut(c.rect(-5, -30, 10, 10), 0.2, 3), C.sun);
  const lid = sheet().p(c.cut([[-42, 0], [-42, -10], ...c.arc(0, -10, 42, 14, PI, 2 * PI, 10), [42, 0]], 0.4, 6), shade(C.wood, -0.12)).x(c.ribbon([[-42, -6], [42, -6]], 3), C.ochre);
  return `<g class="box">${s.out()}</g><g class="lid" transform="translate(-42 -40)"><g transform="translate(42 0)">${lid.out()}</g></g>`;
}

export default {
  id: 'lk15-sons',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 11 },
    { v: 12, text: 'Młodszy z nich rzekł do ojca: "Ojcze, daj mi część majątku, która na mnie przypada".' },
    { v: 12, cont: true, text: 'Podzielił więc majątek między nich.' },
    { v: 13, text: 'Niedługo potem młodszy syn, zabrawszy wszystko, odjechał w dalekie strony' },
  ],
  cam: { x: [-80, 200], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const F = farmSet(S, { skyCols: MORNING, sunAt: [1250, 150] });
    const c = F.c;
    const L = F.people;

    const father = S.puppet(L.add(withFace(person(c, FATHER), faceBits(c))));
    const sad = father.el.querySelector('[data-part="sad"]');
    const hoe = `<g transform="rotate(160)">${sheet().p(c.ribbon([[0, -20], [0, 110]], 4), C.wood3).p(c.cut([[-4, 104], [18, 104], [20, 116], [-4, 116]], 0.3, 3), C.rock3).out()}</g>`;
    const elder = S.puppet(L.add(withFace(person(c, { ...ELDER, holdB: hoe }), faceBits(c))));
    const eAngry = elder.el.querySelector('[data-part="angry"]');
    const younger = S.puppet(L.add(person(c, YOUNGER)));
    const box = F.front.add(`<g>${chest(c)}</g>`);
    const lid = box.querySelector('.lid');
    const heapL = F.front.add(`<g>${coinHeap(c, 80, 30)}</g>`);
    const heapR = F.front.add(`<g>${coinHeap(c, 80, 30)}</g>`);
    const flying = Array.from({ length: 14 }, (_, i) => ({ i, side: i % 2 ? 1 : -1, el: F.front.add(`<g opacity="0">${goldCoin(c, 6)}</g>`) }));
    const camelEl = L.add(riderCamel(c, YOUNGER_RICH));
    const ask = F.fx.add(`<g opacity="0">${say(c, [tr('Ojcze, daj mi część', 'Father, give me my share'), tr('majątku!', 'of your property!')], { size: 19, side: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      F.update(T);

      /* v11 — the father and his two sons */
      const FK = [[0.02, FM.DOOR], [0.26, FX]];
      const fx = kf(t, FK);
      const EK = [[0.2, 180], [0.56, EX]];
      const ex = kf(t, EK);
      const YK = [[0.36, FM.GATE + 10], [0.64, YX]];
      // (the younger stands behind his heap at HR)
      const yx = kf(t, YK);
      const open = bump(t, 0.66, 1.0);
      const divide = es(t, 2.04, 2.2) * (1 - es(t, 2.8, 2.9));
      const wave = es(t, 3.3, 3.45);
      const grief = es(t, 1.35, 1.55);
      father.set({ x: fx, y: GY, s: 1.02, flip: false, o: seg(t, 0.0, 0.04), walk: moving(t, FK) ? fx * 0.06 : undefined, armF: 20 + open * 60 + divide * 50 + wave * 40, armB: 14 + open * 70 + divide * 40 + wave * 100, head: grief * 10 + divide * 12 - wave * 8, lean: divide * 8, blink: blinkAt(T) });
      fade(sad, grief * (1 - es(t, 2.0, 2.2)) + es(t, 3.3, 3.5));
      const back = es(t, 3.2, 3.4);
      const EB = [[3.2, EX], [3.7, 200]];
      const ex2 = t > 3.2 ? kf(t, EB) : ex;
      elder.set({ x: ex2, y: GY, s: 1.0, flip: t > 3.2, o: seg(t, 0.2, 0.24), walk: moving(t, EK) || (t > 3.2 && moving(t, EB)) ? ex2 * 0.06 : undefined, armF: 20 + bump(t, 2.3, 2.9) * 30, armB: 150, head: -bump(t, 1.2, 1.9) * 10, blink: blinkAt(T, 3) });
      fade(eAngry, es(t, 1.2, 1.4) * (1 - es(t, 2.2, 2.4)));

      /* v12a — "give me my share": he steps up, hand out */
      const step = es(t, 1.04, 1.2);
      const scoop = es(t, 3.02, 3.14);
      const mount = seg(t, 3.16, 3.2);
      const toCamel = es(t, 3.1, 3.18);
      younger.set({ x: yx - step * 40 - scoop * 20 + toCamel * 150, y: GY, s: 0.96, flip: toCamel < 0.2, o: seg(t, 0.36, 0.4) * (1 - mount), walk: moving(t, YK) || (toCamel > 0 && toCamel < 1) ? (yx + toCamel * 150) * 0.07 : undefined, armF: 20 + step * 60 * (1 - es(t, 1.9, 2.0)) + bump(t, 2.8, 3.1) * 40 + scoop * 30, armB: 10 + step * 20, head: step * -6 + scoop * 14, lean: scoop * -12, blink: blinkAt(T, 5) });
      const ak = es(t, 1.1, 1.24, ease.back) * (1 - es(t, 1.92, 2.0));
      const [ahx, ahy] = headP(yx - 40, GY, 0.96, true);
      pose(ask, { x: ahx + 20, y: ahy - 30, s: Math.max(0.001, ak), o: ak > 0.01 ? 1 : 0 });

      /* v12b — he divides his property between them */
      const lidO = es(t, 2.02, 2.14);
      pose(box, { x: CH[0], y: CH[1], s: 1.4, o: es(t, 1.9, 2.0) * (1 - es(t, 3.5, 3.6)) });
      pose(lid, { x: -42, y: -40, r: -lidO * 100 });
      flying.forEach((f) => {
        const k = es(t, 2.14 + (f.i >> 1) * 0.08, 2.36 + (f.i >> 1) * 0.08);
        const tx = f.side < 0 ? HL : HR;
        pose(f.el, { x: lerp(CH[0], tx, k), y: lerp(CH[1] - 60, GY - 4, k) - Math.sin(k * PI) * 80, s: 1.3, r: k * 360, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const hk = es(t, 2.2, 2.8);
      pose(heapL, { x: HL, y: GY + 4, s: Math.max(0.001, hk), o: hk > 0.01 ? 1 : 0 });
      pose(heapR, { x: HR, y: GY + 4, s: Math.max(0.001, hk * (1 - scoop)), o: hk * (1 - scoop) > 0.01 ? 1 : 0 });

      /* v13a — he gathers it all and rides away into the far country */
      const ride = es(t, 3.22, 3.96, (x) => x * 0.3 + ease.io(x) * 0.7);
      const [rx, ry, rs, rd] = t < 3.22 ? [YX - 70, GY, 1, 1] : onRoad(ride * 0.999);
      pose(camelEl, { x: t < 3.22 ? lerp(FM.GATE + 220, FM.GATE + 30, es(t, 2.9, 3.14)) : rx, y: ry, s: rs * 0.92, sx: rd < 0 ? -1 : 1, o: es(t, 2.9, 2.98) * (1 - es(t, 3.9, 3.99)) });
      walkCamel(camelEl, (t < 3.22 ? es(t, 2.9, 3.14) * 12 : ride * 60), (t > 2.9 && t < 3.14) || (t > 3.22 && ride < 1) ? 1 : 0);
      fade(camelEl.querySelector('g[transform^="translate(-20 -150)"]'), mount);

      S.cam.x = kf(t, [[0, -40], [2.9, -40], [3.4, 120], [3.9, 160]]);
      S.cam.y = kf(t, [[0, 20], [2.9, 20], [3.9, -20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.1, 1.08], [2.9, 1.06], [3.9, 1.02]]);
    };
  },
};
