// Łk 17,28–29 — a painted flat flies in: Sodom on the plain, the salt sea shining far off, the walled city with its
// gate, and the road running out to the hills of Zoar. "Likewise, even as it was in the days of Lot": a name board
// comes down — "Lot" — and Lot stands in the gateway with his wife and his two daughters. "They ate, they drank,
// they bought, they sold, they planted, they built": before the walls two men at a table lift their cups; at a stall
// a woman pays her coins for a basket; a man plants a sapling and it springs up; on the wall a mason sets a new stone.
// "But in the day that Lot went out from Sodom, it rained fire and sulfur from the sky, and destroyed them all": Lot
// leads his family out of the gate and away up the road — the sky turns red, fire and sulfur fall like glowing
// sparks, the city goes dark and charred, and the people before it fade away into the smoke.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { behindOf } from './lib.js';
import { sodomSet, SODOM, LOT, LOTWIFE, DAUGHTERS, ember, figure, manO, womanO, coin, cup, strung, flyIn, dust, kf, es, ease, bump, seg, tr, PI } from './lib.js';
import { awning } from '../mark6/lib.js';
import { makeCutter } from '../../core/paper.js';

const GY = SODOM.GY;
const [GX] = SODOM.GATE;
const FAM = [[LOT, 0.96], [LOTWIFE, 0.9], [DAUGHTERS[0], 0.84], [DAUGHTERS[1], 0.8]];

function boardText(c, text) {
  const w = 30 + text.length * 14;
  const s = sheet().p(c.cut([[-w / 2, 0], [w / 2, -2], [w / 2 + 3, 46], [-w / 2 - 2, 48]], 0.5, 6), mix(C.wood3, C.sand, 0.3)).p(c.cut([[-w / 2 + 6, 6], [w / 2 - 6, 4], [w / 2 - 4, 40], [-w / 2 + 5, 42]], 0.3, 6), C.parchment);
  return `${s.out()}<text x="0" y="33" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="26" font-style="italic" fill="${C.ink}">${text}</text>`;
}
function alongRoad(u) {
  const P = SODOM.ROAD, n = P.length - 1, f = Math.min(n - 1e-6, Math.max(0, u) * n), i = Math.floor(f), k = f - i;
  return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)];
}

export default {
  id: 'lk17-lot',
  enter: 'fly',
  beats: [
    { v: 28, text: 'Podobnie jak działo się za czasów Lota:' },
    { v: 28, cont: true, text: 'jedli i pili, kupowali i sprzedawali, sadzili i budowali,' },
    { v: 29 },
  ],
  cam: { x: [-80, 100], y: [-40, 40], z: [0.98, 1.1] },
  build(S) {
    const Z = sodomSet(S);
    const c = S.c;
    const pc = makeCutter('lk17-sodom-folk');
    /* the people of the city (in front of the wall), each group one cut-out, with a second pose to cross-fade */
    const table = sheet().p(pc.cut(pc.rect(-60, -40, 120, 9), 0.3, 5), C.wood).p(pc.cut(pc.rect(-52, -31, 7, 31), 0.2, 4) + pc.cut(pc.rect(45, -31, 7, 31), 0.2, 4), C.wood2).out();
    const eatO = [manO(pc, { pose: 'sit' }), manO(pc, { pose: 'sit' })];
    const eaters = (up) => figure(pc, { ...eatO[0], holdF: `<g transform="rotate(${up ? 120 : 60}) translate(0 16)">${cup(pc)}</g>` }, { x: -50, y: 18, s: 0.84, armF: up ? 120 : 60 }) + figure(pc, { ...eatO[1], holdF: `<g transform="rotate(${up ? 110 : 50}) translate(0 16)">${cup(pc)}</g>` }, { x: 50, y: 18, s: 0.84, flip: true, armF: up ? 110 : 50 }) + table;
    const EAT = [660, GY + 8];
    const eatA = Z.act.add(`<g>${eaters(false)}</g>`), eatB = Z.act.add(`<g opacity="0">${eaters(true)}</g>`);
    const STALL = [1110, GY + 6];
    const stall = Z.act.add(`<g><g transform="translate(${STALL[0]} ${STALL[1]})">${awning(pc, 150, 150, C.plumRobe)}${sheet().p(pc.cut(pc.rect(-66, -54, 132, 10), 0.3, 5), C.wood).p(pc.cut([[-40, -54], [-46, -80], [-14, -80], [-20, -54]], 0.4, 4) + pc.cut([[10, -54], [6, -76], [36, -76], [32, -54]], 0.4, 4), C.basket).out()}</g></g>`);
    const seller = S.puppet(Z.act.add(person(pc, manO(pc, { robe: C.ochreRobe }))));
    const buyer = S.puppet(Z.act.add(person(pc, womanO(pc, { robe: C.roseRobe }))));
    const coins = [0, 1].map(() => Z.fx.add(`<g opacity="0">${coin(pc, 5)}</g>`));
    const PLANT = [520, GY + 10];
    const planter = S.puppet(Z.act.add(person(pc, manO(pc, { robe: C.sageRobe, belt: C.rope }))));
    const sapling = Z.act.add(`<g>${sheet().p(pc.ribbon([[0, 0], [0, -60]], 4), C.wood2).p(pc.cut(pc.blob(0, -70, 26, 18, 10, 0.2), 0.6, 4), C.leaf).out()}</g>`);
    const mason = S.puppet(Z.act.add(person(pc, manO(pc, { robe: C.stone, belt: C.leather }))));
    const block = Z.act.add(`<g>${sheet().p(pc.cut(pc.rect(-17, -12, 34, 20), 0.3, 4), mix(C.sand2, C.stone2, 0.35)).out()}</g>`);
    /* Lot and his family */
    const fam = FAM.map(([o, s], i) => ({ i, s, p: S.puppet(Z.act.add(person(pc, o))) }));
    const board = Z.hangL.add(`<g transform="translate(0 -1500)">${strung(boardText(c, tr('Lot', 'Lot')), 0, 2400, [-26, 26])}</g>`);
    /* fire and sulfur; smoke */
    const fireL = S.layer({ par: 0.3, sh: 0, flat: true, pad: 600 });
    let em = '';
    for (let i = 0; i < 90; i++) em += `<g transform="translate(${c.rr(-900, 2500).toFixed(0)} ${c.rr(-900, 900).toFixed(0)}) scale(${c.rr(1.4, 2.6).toFixed(2)})">${ember(c, 5)}</g>`;
    fireL.add(`<g>${em}</g>`);
    behindOf(fireL, Z.act);
    fireL.fade(0);
    const smoke = [0, 1, 2, 3, 4].map((i) => Z.fx.add(`<g opacity="0">${dust(c, 60, mix(C.storm2, C.soilDark, 0.4))}</g>`));

    return (t, time) => {
      const T = time;
      const fireK = es(t, 2.3, 2.55);
      Z.update(T, { fireK, burn: es(t, 2.45, 2.8) });
      const gone = es(t, 2.42, 2.62);

      /* v28a — "Lot": the board; the family in the gateway */
      flyIn(board, es(t, 0.1, 0.35, ease.back) * (1 - es(t, 1.9, 2.05)), GX, 330, T, 1, 1);
      const out = es(t, 2.02, 2.95, (x) => x);
      fam.forEach((f) => {
        const u = Math.max(0, out - f.i * 0.05);
        const [x, y] = u > 0 ? alongRoad(0.08 + u * 0.47) : [GX - 84 + f.i * 22, GY - 2];
        const walking = u > 0 && u < 1;
        f.p.set({ x, y: y + f.i * 3, s: f.s * (u > 0 ? lerp(1, 0.9, u) : 1), flip: u > 0, walk: walking ? t * 30 + f.i : undefined, armF: 14 + (f.i === 0 ? bump(t, 0.3, 0.9) * 40 : 0), armB: 6, head: f.i === 1 ? -4 : 2, o: 1, blink: blinkAt(T, f.i + 5) });
      });

      /* v28b — eat and drink, buy and sell, plant, build */
      const drink = T ? (Math.sin(t * 10) > 0 ? 1 : 0) : 1;
      const dK = t > 1.05 && t < 2.3 ? drink : 0;
      const pay = es(t, 1.2, 1.45);
      seller.set({ x: STALL[0] + 30, y: STALL[1], s: 0.88, flip: true, armF: 20 + pay * 50, armB: 10 + bump(t, 1.45, 1.7) * 60, head: 4, o: 1 - gone, blink: blinkAt(T, 2) });
      buyer.set({ x: STALL[0] - 80, y: STALL[1] + 4, s: 0.88, armF: 30 + bump(t, 1.15, 1.5) * 50, armB: 10 + es(t, 1.5, 1.7) * 40, head: -2, o: 1 - gone, blink: blinkAt(T, 3) });
      coins.forEach((el, i) => {
        const k = es(t, 1.22 + i * 0.08, 1.38 + i * 0.08);
        pose(el, { x: lerp(STALL[0] - 40, STALL[0] + 4, k), y: STALL[1] - 110 - Math.sin(k * PI) * 20, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const dig = bump(t, 1.3, 1.5), grow = es(t, 1.45, 1.75, ease.back);
      planter.set({ x: PLANT[0] - 50, y: PLANT[1], s: 0.9, armF: 30 + dig * 70, armB: 10 + dig * 50, lean: dig * 20, head: 10, o: 1 - gone, blink: blinkAt(T, 6) });
      const lift = es(t, 1.5, 1.8);
      const MS = [1176, GY + 2];
      mason.set({ x: MS[0], y: MS[1], s: 0.9, flip: true, armF: 30 + lift * 120, armB: 20 + lift * 130, head: -lift * 16, o: 1 - gone, blink: blinkAt(T, 8) });

      /* v29 — fire and sulfur from the sky; the city dark, its people gone */
      fireL.fade(es(t, 2.3, 2.45) * (1 - es(t, 2.9, 3.0) * 0.4));
      fireL.shift(0, T ? (T * 260) % 600 : 0);
      [eatA, eatB].forEach((el) => pose(el, { x: EAT[0], y: EAT[1], o: (el === eatA ? 1 - dK : dK) * (1 - gone) }));
      pose(sapling, { x: PLANT[0], y: PLANT[1], sy: Math.max(0.05, 0.3 + grow * 0.7) * (1 - gone * 0.6), sx: Math.max(0.05, 0.5 + grow * 0.5), o: 1 - gone });
      pose(block, { x: lerp(MS[0] - 30, 1176, lift), y: lerp(MS[1] - 60, 578, lift), o: 1 - gone });
      pose(stall, { o: 1 - gone });
      smoke.forEach((el, i) => {
        const k = T ? ((T * 0.15 + i / 5) % 1) : (i + 1) / 6;
        pose(el, { x: 700 + i * 120 + Math.sin(k * 5 + i) * 20, y: 560 - k * 260, s: 0.8 + k * 1.2, o: gone * (1 - k) * 0.8 });
      });

      S.cam.x = kf(t, [[0, 60], [1, 60], [1.6, 60], [2.2, 20], [3, -20]]);
      S.cam.y = kf(t, [[0, 0], [1, 20], [3, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.06], [2, 1.06], [3, 1.02]]);
    };
  },
};
