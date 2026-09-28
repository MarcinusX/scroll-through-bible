// Mt 6,1 — the curtains open again on the green mountain over the lake: Jesus seated on the knoll, the
// disciples round Him, the crowd sitting in rows on the slope. He lifts a warning hand. A painted plate comes down:
// a man on a little stage holds up his good deed, a coin over a bowl, and paper eyes open all round him — "to be
// seen". Above, from the light of heaven, a gold star was coming down on its string; as he turns to the eyes it
// stops, and is drawn back up: no reward from your Father in heaven.
import { C, person, blinkAt, pose, lerp, curtains, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mount, mountFront, plateBoard, watchEye, rewardStar, hypocrite, beggarBowl, coin, fatherLight, sparkle, headAt, tr, PI } from './lib.js';

const PX = 720, PY = 200, PW = 430, PH = 240;   // the plate (top centre)
const HX = 1110, HY = 190;                      // the light of heaven

export default {
  id: 'mt6-mount',
  beats: [
    { cover: true },
    { v: 1, text: 'Strzeżcie się, żebyście uczynków pobożnych nie wykonywali przed ludźmi po to, aby was widzieli;' },
    { v: 1, cont: true, text: 'inaczej nie będziecie mieli nagrody u Ojca waszego, który jest w niebie.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const M = mount(S, { sunAt: [1360, 120] });

    /* the light of heaven, and the star on its string */
    const heavenL = S.layer({ par: 0.1, sh: 2 });
    const light = heavenL.add(`<g>${fatherLight(c, 46)}</g>`);
    const star = hanging(heavenL, rewardStar(c, 16), { x: HX, y: HY, len: 1200 });

    /* the plate: a little stage, the man with his coin, the bowl, the eyes */
    const plateL = S.layer({ par: 0.12, sh: 6 });
    const board = plateL.add(`<g>${plateBoard(c, PW, PH, { fill: mix(C.parchment, C.dawn, 0.35), ground: mix(C.sand, C.stone, 0.4), gy: 0.74 })}</g>`);
    const pedestal = plateL.add(`<g>${sheet().p(c.cut(c.rect(-46, -34, 92, 34), 0.4, 6), C.stone2).p(c.cut(c.rect(-54, -40, 108, 8), 0.3, 6), C.stone).out()}</g>`);
    const man = S.puppet(plateL.add(person(c, { ...hypocrite(0), holdF: `<g transform="translate(0 4)">${coin(c, 7)}</g>` })));
    const bowl = plateL.add(`<g>${beggarBowl(c)}</g>`);
    const EYES = [[-170, 44], [-120, 26], [-60, 16], [60, 16], [120, 26], [172, 46], [-186, 110], [188, 112]].map(([x, y], i) => ({ x, y, i, el: plateL.add(`<g>${watchEye(c, 13, { iris: [C.teal2, C.wood2, C.lakeDeep][i % 3] })}</g>`) }));
    const label = plateL.add(`<g>${sheet().p(c.cut(c.rect(-86, -13, 172, 26), 0.4, 6), C.cream).out()}<text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.terracotta}">${tr('aby was widzieli', 'to be seen by them')}</text></g>`);
    const sparks = [0, 1, 2].map(() => plateL.add(`<g>${sparkle(c, 9, C.sun)}</g>`));

    mountFront(S);
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* Jesus: a warning hand (v1a), then a hand lifted towards heaven (v1b) */
      const warn = es(t, 1.02, 1.3) * (1 - es(t, 1.95, 2.15));
      const up = es(t, 2.05, 2.35);
      M.pose(t, T, { armF: 20 + warn * 62 + up * 20, armB: 10 + up * 118, head: -warn * 2 - up * 10, blink: blinkAt(T) });
      M.listen(T, (d) => ({ head: (d.flip ? 3 : -3) - es(t, 2.2, 2.5) * 8, blink: blinkAt(T, d.seed) }));

      /* the plate comes down */
      const pk = es(t, 1.0, 1.35, ease.out);
      const px = PX, py = lerp(-560, PY, pk) + (T ? Math.sin(T * 0.8) * 2 : 0);
      const po = pk > 0.005 ? 1 : 0;
      pose(board, { x: px, y: py, o: po });
      const gy = py + PH * 0.74 + 6;
      pose(pedestal, { x: px - 10, y: gy, o: po });
      // he holds the coin up high over the bowl — for show
      const show = es(t, 1.3, 1.55);
      const turn = es(t, 2.2, 2.4);
      man.set({ x: px - 10, y: gy - 40, s: 0.5, flip: turn > 0.5, o: po, armF: 30 + show * 90, armB: 10 + show * 40 + turn * 30, head: -show * 10, blink: blinkAt(T, 2) });
      pose(bowl, { x: px + 62, y: gy + 2, o: po });
      EYES.forEach((e) => {
        const k = es(t, 1.4 + e.i * 0.05, 1.55 + e.i * 0.05, ease.back);
        const bl = T ? blinkAt(T, e.i * 0.7) : 0;
        pose(e.el, { x: px + e.x, y: py + e.y, sy: Math.max(0.08, k * (1 - bl * 0.9)), o: k > 0.02 ? po : 0 });
      });
      const lk = es(t, 1.55, 1.75, ease.back);
      pose(label, { x: px, y: py + PH - 4, s: lk, o: lk > 0.02 ? po : 0 });
      sparks.forEach((sp, i) => {
        const k = bump(t, 1.45 + i * 0.06, 1.95);
        pose(sp, { x: px - 10 + Math.cos(i * 2.1 + T) * 40, y: gy - 120 + Math.sin(i * 2.1 + T) * 20, s: k, r: T * 40, o: k * po });
      });

      /* v1b — heaven's light, the star coming down … and drawn back up */
      const hk = es(t, 1.8, 2.2);
      pose(light, { x: HX, y: HY, s: 0.8 + hk * 0.2 + (T ? Math.sin(T * 0.7) * 0.02 : 0), o: hk * (1 - es(t, 2.5, 2.8) * 0.45) });
      const come = es(t, 1.85, 2.2, ease.out), back = es(t, 2.3, 2.7);
      const sy = HY + 40 + come * 190 - back * 200;
      pose(star, { x: HX - 10, y: sy, r: T ? Math.sin(T * 0.9) * 2 : 0, o: come > 0.01 ? 1 : 0 });

      S.cam.z = 1 + es(t, 0.6, 1.2) * 0.04;
      S.cam.y = -es(t, 0.8, 1.3) * 40;
      S.cam.x = es(t, 1.8, 2.3) * 12;
    };
  },
};
