// Mt 25,16–18 — straight away the first servant goes to the market: his five talents go over a trader's counter, a
// bale of goods comes back, he carries it to the next stall and sells it — and ten talents come back into his hands.
// Down the street the second does the same with his two, and has four. The camera walks on out of the town to a field
// with a lone fig tree: the third servant digs a hole, lays his master's talent in it wrapped in a cloth, and covers
// it over, glancing round.
import { C, person, crowdPerson, blinkAt, pose, lerp, mix, swing } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { marketSet, MK, SERV5, SERV2, SERV1, TRADER, talent, bundle, bale, spade, mound, pilePos, wordOn, sparkle, kf, moving, tr } from './lib.js';

const camFor = (x) => (x - 800) / MK.P;
const G = MK.G;

export default {
  id: 'mt25-trade',
  parable: true,
  beats: [
    { v: 16 },
    { v: 17 },
    { v: 18 },
  ],
  cam: { x: [camFor(560) - 20, camFor(1600) + 20], y: [-10, 30], z: [1, 1.08] },
  build(S) {
    const M = marketSet(S);
    const c = M.c;
    const PT = S.portrait;
    if (PT) {
      // phone: the paved street runs on into the field as a widening road, so the edge of the field is a slanting
      // roadside rather than an upright cut down the screen (laid just over the field, under the houses and trees)
      const road = M.ground.add(`<g><path d="${c.cut([[1270, G - 20], [1302, G - 20], [1390, 860], [1470, 1000], [1560, 1200], [1640, 1700], [1270, 1700]], 0.8, 14)}" fill="${mix(C.stone, C.sand, 0.45)}"/></g>`).parentNode;
      const host = road.parentNode, first = host.querySelector(':scope > .piece');
      host.insertBefore(road, first.nextSibling);
    }
    const P = S.layer({ par: MK.P, sh: 5 });
    const hole = P.add(`<g><path d="${c.cut(c.ell(0, 0, 30, 8, 14), 0.4, 4)}" fill="${C.soilDark}"/></g>`);
    const dirt = P.add(`<g>${mound(c, 64, 22)}</g>`);
    const pack = P.add(`<g>${bundle(c)}</g>`);
    const tr1 = S.puppet(P.add(person(c, TRADER)));
    const by1 = S.puppet(P.add(person(c, crowdPerson(c, { hairStyle: 'wrap', veil: C.cream, beard: 'full' }))));
    const tr2 = S.puppet(P.add(person(c, { ...TRADER, robe: C.sageRobe, mantle: C.ochre, veil: C.linen2 })));
    const by2 = S.puppet(P.add(person(c, crowdPerson(c, { hairStyle: 'veil', veil: C.blushVeil, beard: 'none' }))));
    const s5 = S.puppet(P.add(person(c, SERV5)));
    const s2 = S.puppet(P.add(person(c, SERV2)));
    const s1 = S.puppet(P.add(person(c, { ...SERV1, holdF: `<g transform="rotate(-8)">${spade(c, 100)}</g>` })));
    const baleA = P.add(`<g>${bale(c)}</g>`), baleB = P.add(`<g>${bale(c, C.mauve)}</g>`);
    const g5 = Array.from({ length: 10 }, () => P.add(`<g>${talent(c)}</g>`));
    const g2 = Array.from({ length: 4 }, () => P.add(`<g>${talent(c)}</g>`));
    const fx = S.layer({ par: MK.P, sh: 6 });
    const plus5 = fx.add(`<g>${wordOn(c, '5 + 5', { size: 26 })}</g>`);
    const plus2 = fx.add(`<g>${wordOn(c, '2 + 2', { size: 26 })}</g>`);
    const sp = Array.from({ length: 6 }, () => fx.add(`<g>${sparkle(c, 8)}</g>`));

    const deal = (t0, n, sv, svx0, svx1, trd, trx, buyer, byx, baleEl, gold, plus) => {
      // n talents to the trader, a bale back, walk on, the bale sold, 2n talents back
      const toT = (k) => es(t0, 0.05 + k * 0.03, 0.22 + k * 0.03);
      const baleIn = es(t0, 0.2, 0.34), walk = es(t0, 0.3, 0.48, (u) => u), sold = es(t0, 0.46, 0.56);
      const x = lerp(svx0, svx1, walk);
      const holdA = 70;
      sv.set({ x, y: G, s: 0.9, flip: walk < 0.02, walk: walk > 0 && walk < 1 ? x * 0.08 : undefined, armF: holdA, armB: 10, blink: blinkAt(t0 * 3) });
      trd.set({ x: trx, y: G - 4, s: 0.88, armF: 30 + bump(t0, 0.05, 0.4) * 40, blink: 0 });
      buyer.set({ x: byx, y: G + 2, s: 0.88, flip: true, armF: 20 + bump(t0, 0.45, 0.8) * 50, head: -2 });
      gold.forEach((el, k) => {
        if (k < n) {
          const f = toT(k);
          const [px, py] = pilePos(svx0, G, 0.9, true, holdA, n, k);
          const back = es(t0, 0.54 + k * 0.02, 0.66 + k * 0.02);
          const [qx, qy] = pilePos(x, G, 0.9, walk < 0.02, holdA, 2 * n, k);
          if (back > 0) pose(el, { x: lerp(byx - 20, qx, back), y: lerp(G - 120, qy, back) - Math.sin(back * Math.PI) * 40, s: 0.72, o: 1 });
          else pose(el, { x: lerp(px, trx + 30, f), y: lerp(py, G - 120, f) - Math.sin(f * Math.PI) * 40, s: 0.72, o: 1 - seg(f, 0.9, 1) });
        } else {
          const back = es(t0, 0.58 + (k - n) * 0.03, 0.72 + (k - n) * 0.03);
          const [qx, qy] = pilePos(x, G, 0.9, walk < 0.02, holdA, 2 * n, k);
          pose(el, { x: lerp(byx - 20, qx, back), y: lerp(G - 120, qy, back) - Math.sin(back * Math.PI) * 40, s: 0.72 * Math.max(0.01, back), o: back > 0.01 ? 1 : 0 });
        }
      });
      const [hx, hy] = pilePos(x, G, 0.9, walk < 0.02, holdA, 1, 0);
      const bx = baleIn < 1 ? lerp(trx + 40, hx, baleIn) : lerp(hx, byx - 30, sold);
      const byy = baleIn < 1 ? lerp(G - 80, hy + 14, baleIn) : lerp(hy + 14, G - 100, sold);
      pose(baleEl, { x: bx, y: byy - Math.sin(baleIn * Math.PI) * 30, s: 0.8, o: baleIn > 0.01 && sold < 0.99 ? 1 : 0 });
      const pk = es(t0, 0.62, 0.78, ease.back) * (1 - es(t0, 0.95, 1.0));
      pose(plus, { x: x, y: G - 250, s: pk, o: pk > 0.01 ? 1 : 0 });
      return x;
    };

    return (t, time) => {
      const T = time;
      M.update(T);
      if (PT) swing(M.sunEl, 1010, 140, T, 1, 0.6);   // phone: the sun hangs inside the screen, not under the thread
      /* v16 — five talents traded, five more gained */
      const x5 = deal(Math.min(t, 1), 5, s5, 500, 590, tr1, 360, by1, 690, baleA, g5, plus5);
      /* v17 — two traded, two more gained */
      const x2 = deal(Math.max(0, Math.min(t - 1, 1)), 2, s2, 1060, 1110, tr2, 920, by2, 1210, baleB, g2, plus2);
      sp.forEach((el, i) => {
        const k = bump(t, 0.62 + i * 0.05, 0.9 + i * 0.05) + bump(t, 1.62 + i * 0.05, 1.9 + i * 0.05);
        const x = t < 1.3 ? x5 : x2;
        pose(el, { x: x + Math.cos(i * 1.7) * 40, y: G - 150 + Math.sin(i * 2.3) * 24, s: k, r: T * 40, o: k });
      });
      /* v18 — the third digs a hole and hides his master's money */
      const dig = es(t, 2.05, 2.4);
      const stroke = t > 2.05 && t < 2.4 ? Math.abs(Math.sin((t - 2.05) * Math.PI * 5)) : 0;
      const place = es(t, 2.42, 2.62);
      const cover = es(t, 2.8, 2.95);
      const look = t > 2.95 ? Math.sin((t - 2.95) * 20) : 0;
      s1.set({ x: MK.HOLE - 60, y: G, s: 0.9, armF: 20 + stroke * 40 + place * 50 * (1 - cover), armB: 10 + stroke * 30, lean: stroke * 8, head: 10 * dig * (1 - cover) + look * 20, blink: blinkAt(T, 2) });
      pose(hole, { x: MK.HOLE + 10, y: G + 6, s: 0.4 + dig * 0.6, o: dig > 0.01 ? 1 - cover : 0 });
      pose(dirt, { x: cover > 0 ? lerp(MK.HOLE + 70, MK.HOLE + 10, cover) : MK.HOLE + 70, y: G + 8, sy: 0.2 + dig * 0.8, s: 1, oy: 0, o: 1 });
      pose(pack, { x: lerp(MK.HOLE - 20, MK.HOLE + 10, place), y: lerp(G + 6, G + 10, place) - Math.sin(place * Math.PI) * 30, s: 0.8, o: 1 - cover });

      // phone: in the field the camera goes a little further on, past the buyer at the last stall
      S.cam.x = kf(t, [[0, camFor(560)], [1.0, camFor(560)], [1.3, camFor(1080)], [2.0, camFor(1080)], [2.3, camFor(PT ? 1600 : 1540)]]);
      S.cam.z = 1 + bump(t, 1.0, 1.3) * -0.02 + bump(t, 2.0, 2.3) * -0.02 + es(t, 2.3, 2.6) * 0.06;
      S.cam.y = es(t, 2.3, 2.6) * 20;
    };
  },
};
