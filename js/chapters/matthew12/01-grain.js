// Mt 12,1–2 — the curtains open on the ripe grain of Galilee on a Sabbath (the tag with its two candles comes down).
// Jesus walks the path through the field with four disciples, the wheat sliding past. They are hungry — little
// thought clouds with empty bowls — and they pluck ears at the edge of the path, rub out the kernels and eat.
// Two Pharisees rise out of the wheat further on and point: "Look, your disciples do what is not lawful!"
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, flock } from '../kit.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { fieldSet, pluckStalk, wheatField, FP, kf, thought, sabbathTag, bubble, phOpts, scribeOpts, handAt, headAt, bowl, tr, PI } from './lib.js';

const WALK = 520;

export default {
  id: 'mt12-grain',
  beats: [
    { cover: true },
    { v: 1, text: 'Pewnego razu Jezus przechodził w szabat wśród zbóż.' },
    { v: 1, cont: true, text: 'Uczniowie Jego, odczuwając głód, zaczęli zrywać kłosy i jeść.' },
    { v: 2 },
  ],
  cam: { x: [-30, 40], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const F = fieldSet(S, { walk: WALK });
    const c = F.c;
    const tagL = S.layer({ par: 0.05, sh: 5 });
    const birds = flock(S, tagL, 4, (cc) => bird(cc, { color: C.bird }), { y: 270, speed: 40, scale: 0.5 });
    const tag = hanging(tagL, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 800, y: -300, len: 800 });

    /* ---------- the Pharisees, back in the wheat ---------- */
    const phL = S.layer({ par: 0.6, sh: 4 });
    const PH = [{ x: 1090, o: phOpts(0) }, { x: 1160, o: scribeOpts(1) }].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(phL.add(person(c, m.o))) }));
    // a strip of wheat in front of them, to rise out of
    const hide = phL.add(`<g>${wheatField(c, { x0: 960, x1: 1260, y: FP - 20, h: 96, n: 60, color: C.wheat2, ear: C.wheat })}</g>`);

    /* ---------- on the path ---------- */
    const act = S.layer({ par: 0.6, sh: 5 });
    const DIS = [
      { k: 'peter', x: 548 }, { k: 'andrew', x: 636 }, { k: 'john', x: 912 }, { k: 'james', x: 990 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    // the ears they pluck: at the edge of the path, just ahead of each disciple
    const STALKS = DIS.map((d, i) => ({ ...pluckStalk(act, c, 128 + (i % 2) * 8), x: d.x + (i < 2 ? 40 : -40) + (i % 2 ? 6 : -6), d }));
    const grains = [];
    DIS.forEach((d) => { for (let j = 0; j < 5; j++) grains.push({ d, j, el: act.add(`<path d="${c.cut(c.ell(0, 0, 3.4, 2.1, 8, c.rr(0, 3)), 0.2, 2)}" fill="${C.wheat}"/>`), dx: c.rr(-7, 7), ph: c.rr(0, 1) }); });
    F.front();

    /* ---------- thoughts and words ---------- */
    const fx = S.layer({ par: 0.62, sh: 4 });
    const bowlIcon = `<g transform="translate(0 6) scale(.9)">${bowl(c, { w: 36, color: C.pot, food: 'none' })}</g>`;
    const hungry = [0, 2].map((i) => ({ i, el: fx.add(`<g opacity="0">${thought(c, bowlIcon, { w: 70, h: 52 })}</g>`) }));
    const look = fx.add(`<g opacity="0">${bubble(c, [tr('Nie wolno', 'Not lawful'), tr('w szabat!', 'on the Sabbath!')], { size: 21, tail: -1 })}</g>`);

    const cur = curtains(S);
    const walkK = [[0.95, 0], [1.95, WALK]];

    return (t, time) => {
      const T = time;
      F.update(T);
      birds(T, 1);
      cur.set(es(t, 0.05, 0.85), T);
      const tg = es(t, 1.1, 1.55, ease.back);
      pose(tag, { x: 800, y: lerp(-300, 150, tg), r: Math.sin(T * 0.9) * 2, oy: 0, o: tg > 0.01 ? 1 : 0 });

      const shift = kf(t, walkK, (u) => u);
      const walking = t > 0.95 && t < 1.95;
      F.shift(shift);
      pose(hide, { x: WALK - shift });

      /* Jesus walks in the middle of them, then stops and watches them kindly; at v2 he turns to the Pharisees */
      const toPh = es(t, 3.2, 3.4);
      jesus.set({ x: 800, y: FP, s: 1.04, flip: bump(t, 2.15, 3.15) > 0.3 && t < 3.2, walk: walking ? shift * 0.05 : undefined, armF: 12 + toPh * 30, armB: 8 + toPh * 20, head: -2 + bump(t, 2.2, 3.1) * 4, blink: blinkAt(T) });

      DIS.forEach((d) => {
        const st = STALKS[d.i];
        const hungerK = bump(t, 2.0, 2.6);
        const reach = es(t, 2.25 + d.i * 0.06, 2.42 + d.i * 0.06);
        const rub = es(t, 2.45 + d.i * 0.06, 2.55 + d.i * 0.06) * (1 - es(t, 3.05, 3.2));
        const eat = bump(t, 2.72 + d.i * 0.04, 3.02 + d.i * 0.04);
        const startle = es(t, 3.12, 3.3);
        const toStalk = st.x < d.x;
        const flip = reach > 0 && reach < 1 ? toStalk : startle > 0.5 ? false : false;
        d.p.set({
          x: d.x, y: FP + (d.i % 2 ? 6 : -4), s: 0.95, flip,
          walk: walking ? shift * 0.05 + d.i : undefined,
          armF: 10 + hungerK * 14 + reach * (1 - rub) * 52 + rub * (66 + Math.sin(t * 50) * 8) * (1 - startle) + eat * 40 + startle * 16,
          armB: rub * (58 + Math.sin(t * 50 + 1) * 8) * (1 - startle) + hungerK * 20,
          head: hungerK * 10 + rub * 8 - eat * 8 - startle * 6, lean: hungerK * 5, blink: blinkAt(T, d.seed),
        });
      });
      // stalks slide with the field; each ear is plucked into a hand
      STALKS.forEach((st) => {
        const d = st.d;
        const fx_ = st.x + WALK - shift;
        pose(st.el, { x: fx_, y: FP - 20 });
        const pick = es(t, 2.32 + d.i * 0.06, 2.45 + d.i * 0.06);
        const gone = es(t, 2.6 + d.i * 0.06, 2.72 + d.i * 0.06);
        const [hx, hy] = handAt(d.x, FP, 0.95, st.x < d.x, 62);
        pose(st.ear, { x: lerp(st.ex0, hx - fx_, pick), y: lerp(st.ey0, hy - (FP - 20), pick), r: pick * 60, s: 1 - gone * 0.8, o: 1 - gone });
        pose(st.stem, { r: pick * 5 });
      });
      grains.forEach((g) => {
        const k = seg(t, 2.5 + g.d.i * 0.06 + g.ph * 0.3, 2.9 + g.d.i * 0.06 + g.ph * 0.3);
        const [hx, hy] = handAt(g.d.x, FP, 0.95, false, 70);
        pose(g.el, { x: hx + g.dx, y: hy + k * 100, r: k * 300, o: k > 0 && k < 1 ? 1 : 0 });
      });
      hungry.forEach((h) => {
        const d = DIS[h.i];
        const k = es(t, 2.02 + h.i * 0.04, 2.2 + h.i * 0.04, ease.back) * (1 - es(t, 2.55, 2.7));
        const [hx, hy] = headAt(d.x, FP, 0.95, false);
        pose(h.el, { x: hx + 8, y: hy - 22, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v2 — the Pharisees rise out of the wheat and point */
      PH.forEach((m) => {
        const up = es(t, 3.0 + m.i * 0.08, 3.3 + m.i * 0.08, ease.out);
        const point = m.i === 0 ? es(t, 3.3, 3.45) : 0;
        m.p.set({ x: m.x, y: lerp(FP + 170, FP - 44, up), s: 0.86, flip: true, o: up > 0.01 ? 1 : 0, armF: point * 92 + up * 10, armB: m.i === 1 ? es(t, 3.35, 3.55) * 50 : 12, head: -point * 4, lean: point * 3, blink: blinkAt(T, m.seed) });
      });
      const lk = es(t, 3.35, 3.55, ease.back);
      const [lhx, lhy] = headAt(1090, FP - 44, 0.86, true);
      pose(look, { x: lhx - 40, y: lhy - 34, s: lk, o: lk > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0.8, 1.04], [1.9, 1.05], [2.3, 1.11], [2.95, 1.11], [3.2, 1.06]]);
      S.cam.y = kf(t, [[0.8, 20], [2.3, 36], [2.95, 36], [3.2, 10]]);
      S.cam.x = kf(t, [[2.95, 0], [3.25, 30]]);
    };
  },
};
