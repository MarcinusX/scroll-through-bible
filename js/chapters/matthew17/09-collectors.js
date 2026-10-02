// Mt 17,24–25a — Capernaum by the lake. Jesus and the disciples come along the street towards Peter's house; by the
// way sit the two collectors of the Temple's half-shekel with their brass-mouthed chest (a plate of the Temple and
// its two drachmas comes down). They stop Peter at the back of the group: "Doesn't your teacher pay the didrachma?"
// — "Yes," says Peter, nodding, while Jesus goes on into the house.
import { C, person, CAST, blinkAt, pose, lerp, swing, hanging, sheet, mix } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { capSet, houseFront, COLLECTORS, taxChest, templeIcon, plate, coin, bubble, kf, tr } from './lib.js';

const FEET = 690;
const DOOR = 580;   // the doorway's middle

export default {
  id: 'mt17-collectors',
  beats: [
    { v: 24 },
    { v: 25, text: 'Odpowiedział: «Owszem».' },
  ],
  cam: { x: [-40, 40], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const set = capSet(S, { house: false, sign: false });
    const SH = S.portrait ? -50 : 0;   // on a phone, the collectors' table a little further in
    const c = set.c;

    /* ---------- Peter's house on the left, the street ---------- */
    const hL = S.layer({ par: 0.4, sh: 4 });
    hL.add(houseFront(c, { x0: 330, x1: 690, base: FEET - 6, top: 400, doorX: DOOR - 330 - 42, doorW: 84, doorH: 206 }));
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(FEET - 6, [2, 1], [700, 180]);
    const gs = sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand);
    let stones = '';
    for (let k = 0; k < 60; k++) { const px = c.rr(-600, 2200), py = c.rr(FEET + 10, 980); stones += c.cut(c.blob(px, py, c.rr(8, 18), c.rr(4, 8), 8, 0.2), 0.4, 4); }
    gs.x(stones, C.sand2, 'opacity=".7"');
    G.add(gs.out());

    /* ---------- the collectors' table ---------- */
    const tL = S.layer({ par: 0.5, sh: 4 });
    const COLL = COLLECTORS.map((o, i) => ({ i, o, x: [1016 + SH, 1090 + SH][i], seed: c.rr(0, 9), p: S.puppet(tL.add(person(c, { ...o, pose: i ? 'stand' : 'sit' }))) }));
    const table = tL.add(`<g>${sheet().p(c.cut(c.rect(-56, -44, 112, 10), 0.3, 5), C.wood).p(c.cut(c.rect(-50, -34, 8, 34), 0.3, 4) + c.cut(c.rect(42, -34, 8, 34), 0.3, 4), C.wood2).out()}<g transform="translate(-22 -44) scale(.6)">${taxChest(c, 60)}</g><g transform="translate(26 -48)">${coin(c, 7)}</g><g transform="translate(36 -47)">${coin(c, 6)}</g></g>`);

    /* ---------- Jesus and the disciples ---------- */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const WALK = [
      { k: 'john', o: CAST.john, gap: -150 }, { k: 'andrew', o: CAST.andrew, gap: -84 }, { k: 'james', o: CAST.james, gap: 66 },
    ].map((w, i) => ({ ...w, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, w.o))) }));
    const jesus = S.puppet(pL.add(person(c, CAST.jesus)));
    const peter = S.puppet(pL.add(person(c, CAST.peter)));
    const ask = pL.add(`<g opacity="0">${bubble(c, [tr('Wasz Nauczyciel', 'Doesn’t your teacher'), tr('nie płaci dwudrachmy?', 'pay the didrachma?')], { size: 18, tail: 1 })}</g>`);
    const yes = pL.add(`<g opacity="0">${bubble(c, tr('Owszem.', 'Yes.'), { size: 20, tail: 1 })}</g>`);

    /* ---------- the plate: the Temple and its two drachmas ---------- */
    const plL = S.layer({ par: 0.12, sh: 5 });
    const tp = hanging(plL, plate(c, `<g transform="translate(0 6)">${templeIcon(c, 70)}</g><g transform="translate(-14 52)">${coin(c, 10)}</g><g transform="translate(14 52)">${coin(c, 10)}</g>`, { r: 72 }), { x: 1010 + SH, y: 240, len: 900 });

    return (t, time) => {
      const T = time;
      set.update(T);

      /* Jesus walks in from the right to the middle of the street; at v25a on to the door and inside */
      const jx = kf(t, [[0, 1330], [0.7, 800], [1.15, 800], [1.6, DOOR]]);
      const jWalk = (t > 0.02 && t < 0.7) || (t > 1.15 && t < 1.6);
      const inside = es(t, 1.55, 1.75);
      jesus.set({ x: jx, y: FEET, s: 1.02, flip: true, o: 1 - inside, walk: jWalk ? jx * 0.05 : undefined, amt: 0.9, armF: 12, blink: blinkAt(T, 1) });
      WALK.forEach((w) => {
        const wx = t < 1.15 ? kf(t, [[0, 1330 + w.gap], [0.7, 800 + w.gap]]) : kf(t, [[1.15, 800 + w.gap], [1.7, DOOR + w.gap * 0.4]]);
        w.p.set({ x: wx, y: FEET - 10, s: 0.92, flip: true, o: t > 1.1 ? 1 - es(t, 1.5, 1.72) : 1, walk: jWalk ? wx * 0.05 + w.i : undefined, amt: 0.9, blink: blinkAt(T, w.seed) });
      });
      // Peter, at the back of the group, is stopped by the collectors
      const px = kf(t, [[0, 1450], [0.8, 936 + SH]]);
      const turned = es(t, 0.55, 0.62);
      const nod = bump(t, 1.1, 1.5);
      peter.set({ x: px, y: FEET + 4, s: 1.0, flip: turned < 0.5, walk: t > 0.02 && t < 0.8 ? px * 0.05 : undefined, amt: 0.9, armF: 14 + es(t, 1.05, 1.2) * 40 * (1 - es(t, 1.8, 1.95)), armB: 8, head: -4 + nod * 12, blink: blinkAt(T, 2) });
      COLL.forEach((m) => {
        const call = m.i === 1 ? es(t, 0.4, 0.6) * (1 - es(t, 1.6, 1.9)) : 0;
        m.p.set({ x: m.x, y: FEET + (m.i ? 0 : -10), s: m.i ? 0.98 : 0.96, flip: true, armF: 20 + call * 70 + (m.i === 0 ? es(t, 0.3, 0.5) * 30 : 0), armB: 10 + call * 20, head: -4, blink: blinkAt(T, m.seed) });
      });
      pose(table, { x: 1036 + SH, y: FEET + 2 });
      pose(ask, { x: 1020 + SH * 2, y: FEET - 228, s: es(t, 0.5, 0.7, ease.back), o: bump(t, 0.45, 1.0) > 0.05 ? 1 : 0 });
      pose(yes, { x: 866, y: FEET - 214, s: es(t, 1.08, 1.25, ease.back), o: bump(t, 1.05, 1.97) > 0.05 ? 1 : 0 });

      const pl = es(t, 0.1, 0.35, ease.back) * (1 - es(t, 1.85, 2));
      swing(tp, 1010 + SH, lerp(-1000, 240, pl), T, 1.1, 0.8, 1);

      S.cam.x = kf(t, [[0, 30], [0.8, 10], [1.5, -20]]);
      S.cam.z = 1.03 + es(t, 0.4, 0.9) * 0.04;
      S.cam.y = 18;
    };
  },
};
