// Łk 21,20–22 — Judea: Jerusalem on its hill in the middle, the Temple gleaming, the mountains left and right with
// their paths. "When you see Jerusalem surrounded by armies, know that its desolation is at hand": a ring of leather
// tents springs up round the foot of the hill, eagle standards and red banners among them, campfires, the sky going
// dusky over the city. "Then let those in Judea flee to the mountains, those in the city depart, those in the country
// not enter it": little figures stream out of the gate and up the mountain paths on both sides, while a villager on
// the road with his donkey stops, turns and goes back. "For these are days of vengeance, that all things written may be
// fulfilled": a scroll comes down over the city and unrolls — line upon line of writing — and a red seal is set on it.
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  judeaSet, JU, along, campRing, inkLine, EVE, STRING,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

export default {
  id: 'lk21-armies',
  beats: [
    { v: 20 },
    { v: 21 },
    { v: 22 },
  ],
  cam: { x: [-20, 20], y: [-50, 40], z: [1, 1.1] },
  build(S) {
    const J = judeaSet(S, { sky2: EVE });
    const c = S.c;
    const camp = campRing(J, c);

    /* those who flee, the villager who turns back */
    const P = J.pathL;
    const FLEE = Array.from({ length: 10 }, (_, i) => ({ i, side: i % 2 ? 1 : -1, u0: -0.18 * Math.floor(i / 2), seed: c.rr(0, 9), p: S.puppet(P.add(person(c, crowdPerson(c)))) }));
    // and out of the city on the road in front, both ways
    // on a phone those leaving the city stop short of the frame and the thread, and the villager turns back further in
    const PT = S.portrait;
    const OUT = (PT ? [[640, 612, 470, 740], [700, 612, 530, 748], [930, 612, 1080, 740], [990, 612, 1120, 750]] : [[640, 612, 380, 740], [700, 612, 470, 748], [930, 612, 1180, 740], [990, 612, 1250, 750]]).map(([x0, y0, x1, y1], i) => ({ x0, y0, x1, y1, i, seed: c.rr(0, 9), p: S.puppet(J.campL.add(person(c, crowdPerson(c)))) }));
    const vill = S.puppet(J.fx.add(person(c, { robe: C.ochreRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3, belt: C.rope })));

    /* the scroll of what is written */
    const SW = 300, SHh = 190;
    const sheetEl = J.fx.add(`<g>${sheet().p(c.cut(c.rect(-SW / 2, 0, SW, SHh), 0.5, 8), mix(C.parchment, C.cream, 0.3)).x(Array.from({ length: 8 }, (_, k) => inkLine(c, -SW / 2 + 22, SW / 2 - 22 - (k === 7 ? 90 : 0), 22 + k * 20, 2)).join(''), C.ink, 'opacity=".7"').out()}</g>`);
    const rod = () => sheet().p(c.cut(c.rect(-SW / 2 - 14, -8, SW + 28, 16), 0.3, 6), C.wood2).p(c.cut(c.circ(-SW / 2 - 18, 0, 9, 10), 0.2, 3) + c.cut(c.circ(SW / 2 + 18, 0, 9, 10), 0.2, 3), C.wood).out();
    const rodT = J.fx.add(`<g><path d="M${-SW / 2 + 20} -1600V-8M${SW / 2 - 20} -1600V-8" stroke="${STRING}" stroke-width="1.2" fill="none"/>${rod()}</g>`);
    const rodB = J.fx.add(`<g>${rod()}</g>`);
    const seal = J.fx.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 18, 18, 12, 0.12), 0.4, 4), C.terracotta).x(c.poly(c.star(0, 0, 9, 4, 6, 0)), shade(C.terracotta, -0.25)).out()}</g>`);

    const fg = J.front();

    return (t, time) => {
      const T = time;
      const dusk = es(t, 0.2, 1.0);
      J.sk2.fade(dusk * 0.85);
      J.update(t, T, { sunY: 150 + dusk * 220, sunO: 1 - dusk * 0.6 });

      /* v20 — the ring of the camp */
      camp.set(t, T);

      /* v21 — flight to the mountains */
      FLEE.forEach((f) => {
        const u = seg(t, 1.05 + f.i * 0.035, 1.9 + f.i * 0.02) * 0.95 + f.u0 * 0;
        const path = f.side < 0 ? J.PATH_L : J.PATH_R;
        const lag = Math.floor(f.i / 2) * 0.13;
        const uu = Math.max(0, u - lag) / (1 - lag);
        const [x, y] = along(path, 0.04 + uu * 0.9);
        const s = lerp(0.3, 0.2, uu);
        f.p.set({ x, y: y + 2, s, flip: f.side < 0, walk: uu > 0 && uu < 1 ? x * 0.1 + f.i : undefined, lean: 8, o: uu > 0 ? 1 : 0, blink: blinkAt(T, f.seed) });
      });
      OUT.forEach((m) => {
        const k = es(t, 1.05 + m.i * 0.05, 2.05 + m.i * 0.03, (x) => x);
        const x = lerp(m.x0, m.x1, k), y = lerp(m.y0, m.y1, k);
        m.p.set({ x, y, s: lerp(0.4, 0.62, k), flip: m.x1 < m.x0, walk: k > 0 && k < 1 ? x * 0.08 + m.i : undefined, lean: 8, o: k > 0 && k < 1 ? 1 : 0, blink: blinkAt(T, m.seed) });
      });
      const vk = es(t, 0.95, 1.3, (x) => x);
      const back = es(t, 1.36, 1.44);
      const leave = es(t, 1.45, 2.0, (x) => x);
      const vx = PT ? lerp(lerp(1340, 1040, vk), 1320, leave) : lerp(lerp(1420, 1110, vk), 1330, leave);
      vill.set({ x: vx, y: 742, s: 0.8, flip: back < 0.5, walk: (vk > 0 && vk < 1) || (leave > 0 && leave < 1) ? vx * 0.05 : undefined, armB: bump(t, 1.28, 1.5) * 90, head: bump(t, 1.28, 1.45) * -10, o: vk > 0 && t < 2.05 ? 1 : 0, blink: blinkAt(T, 4) });

      /* v22 — the scroll unrolls; the seal */
      const sd = es(t, 2.05, 2.3, ease.out);
      const unroll = es(t, 2.3, 2.6);
      const sy = lerp(-1300, 150, sd);
      pose(rodT, { x: 800, y: sy, o: sd > 0.002 ? 1 : 0 });
      pose(sheetEl, { x: 800, y: sy, sy: Math.max(0.001, unroll), o: unroll > 0.002 ? 1 : 0 });
      pose(rodB, { x: 800, y: sy + SHh * unroll, o: sd > 0.002 ? 1 : 0 });
      const sk = es(t, 2.62, 2.75, ease.back);
      pose(seal, { x: 800 + SW / 2 - 50, y: sy + SHh - 34, s: sk * 1.1, r: -10, o: sk > 0.02 ? 1 : 0 });

      S.cam.y = -es(t, 1.9, 2.3) * 40;
      S.cam.z = 1 + es(t, 0.0, 0.8) * 0.05 - es(t, 0.9, 1.3) * 0.04;
      void fg; void JU; void tr;
    };
  },
};
