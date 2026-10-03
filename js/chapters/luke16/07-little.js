// Łk 16,10–12 — the saying is played out in the rich man's court, with two young servants. "Whoever is faithful in a
// very little is faithful also in much": the master gives the first a single small coin; he carries it carefully to
// the money chest and puts it in — and the master gives him the great key of the house. "Whoever is dishonest in a
// very little is dishonest also in much": the second is given a coin too; he glances round and slips it into his
// sleeve — and then he is creeping off towards the gate with a whole sack of his master's grain on his back. "If you
// have not been faithful with unrighteous wealth, who will entrust to you the true riches?": a little chest full of
// light comes down over him; he reaches for it — and it rises out of his reach and goes to the faithful one. "And if
// you have not been faithful with what belongs to another, who will give you what is your own?": the master takes his
// sack back from him; to the faithful servant he gives a ring of his own, and the other stands with empty hands.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { estateSet, ES, coin, bigKey, ring, sack, label, glow, sparkle, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI, MASTER } from './lib.js';

const GY = ES.GY, DAIS = ES.DAIS;
const MX = 1060;                   // the master on the dais
const AX = 880, BX = 740;          // the faithful one, the other
const BOX = 1000;                  // the money chest, on the dais
const FAITHFUL = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.leather };
const SLY = { robe: mix(C.mauve, C.stone2, 0.3), mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope };

/** a money chest (origin: its foot); lid separate */
function chest(c) {
  return sheet().p(c.cut(c.rect(-30, -34, 60, 34), 0.4, 5), C.wood).x(c.ribbon([[-30, -24], [30, -24]], 3) + c.ribbon([[-30, -8], [30, -8]], 3), C.sun, 'opacity=".8"').p(c.cut(c.rect(-5, -30, 10, 10), 0.2, 3), C.sun).out();
}
function lid(c) { return sheet().p(c.cut([[-32, 0], [-30, -10], [30, -10], [32, 0]], 0.3, 4), C.wood2).out(); }
/** a small chest full of light: the true riches (origin: its foot) */
function lightChest(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-26, -30, 52, 30), 0.3, 5), mix(C.sun, C.ochre, 0.3));
  s.p(c.cut([[-28, -30], [-22, -52], [22, -52], [28, -30]], 0.3, 5), shade(C.sun, 0.15));
  s.x(c.ribbon([[-26, -16], [26, -16]], 2.4), C.star, 'opacity=".8"');
  let gems = '';
  [[-12, -36, 6], [4, -40, 7], [16, -34, 5]].forEach(([x, y, r]) => { gems += c.poly(c.star(x, y, r, r * 0.5, 6, 0)); });
  s.x(gems, '#fff6d8');
  return `<circle cy="-30" r="50" fill="url(#halo-glow)"/>${s.out()}`;
}

export default {
  id: 'lk16-little',
  enter: 'fly',
  beats: [
    { v: 10, text: 'Kto w drobnej rzeczy jest wierny, ten i w wielkiej będzie wierny;' },
    { v: 10, cont: true, text: 'a kto w drobnej rzeczy jest nieuczciwy, ten i w wielkiej nieuczciwy będzie.' },
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [-20, 190], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    E.act.add(`<g transform="translate(${BOX} ${DAIS})">${chest(c)}</g>`);
    const lidEl = E.act.add(`<g>${lid(c)}</g>`);
    const master = S.puppet(E.act.add(person(c, MASTER)));
    const A = S.puppet(E.act.add(person(c, FAITHFUL)));
    const bagB = E.act.add(`<g opacity="0">${sack(c, 60, 72)}</g>`);
    const B = S.puppet(E.act.add(person(c, SLY)));
    const coinA = E.front.add(`<g>${coin(c, 7)}</g>`);
    const coinB = E.front.add(`<g>${coin(c, 7)}</g>`);
    const key = E.front.add(`<g opacity="0">${bigKey(c)}</g>`);
    const keyGlow = E.back.add(`<g opacity="0">${glow(60, 0.9, 'halo-glow')}</g>`);
    const riches = E.W.add(`<g opacity="0">${lightChest(c)}<g transform="translate(0 26)">${label(c, tr('prawdziwe dobro', 'the true riches'), { size: 15 })}</g></g>`);
    const ringEl = E.W.add(`<g opacity="0">${ring(c, 11)}<circle r="30" fill="url(#halo-glow)" opacity=".6"/></g>`);
    const ringLab = E.W.add(`<g opacity="0">${label(c, tr('wasze', 'your own'), { size: 15 })}</g>`);
    const shine = [0, 1].map(() => E.W.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      E.update(T);
      /* the master on the dais, giving */
      const g1 = bump(t, 0.05, 0.3), g2 = bump(t, 0.5, 0.75), g3 = bump(t, 1.02, 1.25), take = es(t, 3.05, 3.25) * (1 - es(t, 3.4, 3.5)), g4 = bump(t, 3.35, 3.7);
      master.set({ x: MX, y: DAIS, s: 1.02, flip: true, armF: 20 + (g1 + g2 + g3 + g4) * 60 + take * 60, armB: 10, head: -4, blink: blinkAt(T, 1) });
      const [mhx, mhy] = handAt(MX, DAIS, 1.02, true, 80);
      /* A: the coin to the chest; then the key */
      const AK = [[0.2, AX], [0.3, BOX - 60], [0.46, BOX - 60], [0.55, AX]];
      const ax = kf(t, AK);
      const holdKey = es(t, 0.66, 0.72);
      const receive = bump(t, 2.62, 2.9) + bump(t, 3.5, 3.8);
      A.set({ x: ax, y: GY, s: 0.98, flip: (t > 0.46 && t < 0.55), walk: moving(t, AK) ? ax * 0.07 : undefined, armF: 30 + bump(t, 0.36, 0.46) * 40 + holdKey * 60 + receive * 30, armB: 8 + holdKey * 20, head: -4 + bump(t, 0.36, 0.46) * 14, blink: blinkAt(T, 4) });
      const [ahx, ahy] = handAt(ax, GY, 0.98, (t > 0.46 && t < 0.55), 30 + holdKey * 60);
      const c1 = es(t, 0.08, 0.22);
      const inBox = es(t, 0.38, 0.44);
      pose(coinA, { x: t < 0.22 ? lerp(mhx, AX - 40, c1) : lerp(ahx, BOX, inBox), y: t < 0.22 ? lerp(mhy, GY - 110, c1) - Math.sin(c1 * PI) * 30 : lerp(ahy, DAIS - 30, inBox), o: 1 - seg(t, 0.44, 0.46) });
      pose(lidEl, { x: BOX, y: DAIS - 34, r: -bump(t, 0.32, 0.5) * 50, ox: -30 });
      const kk = es(t, 0.55, 0.68);
      pose(key, { x: lerp(mhx, ahx, kk), y: lerp(mhy, ahy, kk) - Math.sin(kk * PI) * 40 - 6, r: -40, s: 1.2, o: kk > 0 ? 1 : 0 });
      pose(keyGlow, { x: ahx + 20, y: ahy - 6, o: es(t, 0.68, 0.8) * (1 - es(t, 1.9, 2.1)) });
      /* B: the coin into his sleeve; the sack; reaching; empty-handed */
      const BK = [[1.4, BX], [1.5, BX - 10], [1.92, 580], [2.05, BX], [5, BX]];
      const bx = kf(t, BK);
      const sneak = es(t, 1.45, 1.55) * (1 - es(t, 1.92, 2.0));
      const reach = es(t, 2.3, 2.42) * (1 - es(t, 2.55, 2.7));
      const ashamed = es(t, 3.3, 3.45);
      const look = bump(t, 1.22, 1.4);
      B.set({ x: bx, y: GY, s: 0.98, flip: (t > 1.45 && t < 1.95) || (t > 1.2 && t < 1.3), walk: moving(t, BK) ? bx * 0.05 : undefined, amt: 0.6, armF: 20 + sneak * 90 + reach * 120 + look * 20, armB: 10 + sneak * 100 + reach * 40, head: look * -10 + sneak * 12 + ashamed * 18, lean: sneak * 14 + ashamed * 4, blink: blinkAt(T, 6) });
      const [bhx, bhy] = handAt(bx, GY, 0.98, false, 20 + look * 20);
      const c3 = es(t, 1.02, 1.18);
      pose(coinB, { x: lerp(mhx, bhx, c3), y: lerp(mhy, bhy, c3) - Math.sin(c3 * PI) * 30, o: c3 > 0 ? 1 - es(t, 1.3, 1.36) : 0 });
      const onBack = es(t, 1.46, 1.5);
      const bagBack = t < 3.1;
      const tk = es(t, 3.1, 3.3);
      pose(bagB, { x: bagBack ? bx + (t > 1.45 && t < 1.95 ? 18 : -18) * 1 : lerp(bx, MX - 50, tk), y: bagBack ? GY - 70 : lerp(GY - 70, DAIS, tk), r: bagBack ? (t > 1.45 && t < 1.95 ? 20 : -10) : 0, o: onBack * (t < 1.95 || t > 2.0 ? 1 : 1) });
      /* v11 — the chest of true riches: over him, withdrawn, to the faithful one */
      const down = es(t, 2.05, 2.3, ease.out);
      const away = es(t, 2.45, 2.75);
      const rx = lerp(bx, ax + 70, away), ry = lerp(lerp(-300, 460, down), GY - 170, away) - Math.sin(away * PI) * 90 - es(t, 3.0, 3.2) * 60;
      pose(riches, { x: rx, y: ry, s: 1.3 - away * 0.3, o: down > 0.01 ? 1 : 0 });
      /* v12 — the ring */
      const rk = es(t, 3.4, 3.62);
      pose(ringEl, { x: lerp(mhx, ahx, rk), y: lerp(mhy, ahy - 14, rk) - Math.sin(rk * PI) * 40, s: 1.3, o: rk > 0 ? 1 : 0 });
      const lk = es(t, 3.62, 3.72, ease.back);
      pose(ringLab, { x: ahx, y: ahy + 26, s: lk, o: lk > 0.01 ? 1 : 0 });
      shine.forEach((sp, i) => pose(sp, { x: ahx + (i ? 30 : -24), y: ahy - 30 - i * 16, s: bump(t, 0.7 + i * 0.1, 1.0 + i * 0.1) + bump(t, 3.65 + i * 0.08, 3.95 + i * 0.05), r: T * 40, o: 1 }));

      S.cam.x = kf(t, [[-0.5, 20], [1, 20], [1.6, 0], [2.2, 20]]);
      S.cam.y = kf(t, [[-0.5, 20], [2.0, 20], [2.3, -10], [3, 10]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [2.0, 1.08], [2.3, 1.04], [3, 1.08]]);
      if (S.portrait) S.cam.x += kf(t, [[-0.5, 150], [1.3, 150], [1.6, 10], [2.0, 10], [2.3, 150]]);   // phone: the master and his chest clear of the thread; the thief's creep to the gate stays in
    };
  },
};
