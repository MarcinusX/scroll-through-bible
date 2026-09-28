// Mt 6,7 — a pagan shrine at dusk: a great seated stone idol with blank eyes between two columns, incense rising.
// Three worshippers bow before it and pour out words: paper slips stream from their mouths and pile up at its feet.
// "They think they will be heard for their many words": the heap of slips grows into a tower up to the idol's chin,
// the chief of them hopes (a thought-bubble with an ear) — and the stone face does not move.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, stars } from '../../assets/nature.js';
import { ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { DUSK, wordSlip, thought, headAt, slipHeap, tr, PI } from './lib.js';

const GY = 706;
const IX = 930;                 // the idol
const STONE = mix(C.rock2, C.lavender, 0.25), STONE2 = shade(STONE, -0.14);

/** a seated stone idol, blank-eyed (origin: middle of its plinth's foot) */
function idolStatue(c) {
  const s = sheet();
  // plinth
  s.p(c.cut(c.rect(-130, -70, 260, 70), 0.5, 8), STONE2);
  s.p(c.cut(c.rect(-146, -86, 292, 18), 0.4, 8), STONE);
  // throne
  s.p(c.cut([[-96, -86], [-96, -300], [-78, -312], [-60, -300], [-60, -200], [60, -200], [60, -300], [78, -312], [96, -300], [96, -86]], 0.6, 8), STONE2);
  // body, knees, arms
  s.p(c.cut([[-52, -86], [-56, -150], [-60, -250], [-44, -300], [44, -300], [60, -250], [56, -150], [52, -86]], 0.6, 8), STONE);
  s.p(c.cut([[-66, -86], [-70, -150], [70, -150], [66, -86]], 0.5, 6), shade(STONE, 0.08));
  s.p(c.cut([[-60, -250], [-74, -176], [-40, -160], [-36, -176], [-52, -240]], 0.4, 5) + c.cut([[60, -250], [74, -176], [40, -160], [36, -176], [52, -240]], 0.4, 5), STONE2);
  // head: tall hair, a square beard, blank eyes
  s.p(c.cut([[-38, -300], [-40, -350], [-30, -392], [0, -402], [30, -392], [40, -350], [38, -300]], 0.5, 6), STONE2);
  s.p(c.cut(c.ell(0, -346, 30, 36, 20), 0.4, 5), STONE);
  s.p(c.cut([[-26, -336], [26, -336], [22, -294], [0, -286], [-22, -294]], 0.5, 5), STONE2);
  let lines = '';
  for (let i = -2; i <= 2; i++) lines += c.ribbon([[i * 9, -330], [i * 8, -294]], 1.6);
  s.x(lines, shade(STONE, -0.3), 'opacity=".5"');
  s.x(c.ribbon([[-20, -352], [-8, -352]], 3) + c.ribbon([[8, -352], [20, -352]], 3), shade(STONE, -0.35));
  s.x(c.ribbon([[-8, -324], [8, -324]], 2.4), shade(STONE, -0.35));
  // a crack
  s.x(c.ribbon([[30, -250], [22, -220], [34, -196], [26, -170]], 2), shade(STONE, -0.35), 'opacity=".6"');
  return s.out();
}
export default {
  id: 'mt6-babble',
  enter: 'fly',
  beats: [
    { v: 7, text: 'Na modlitwie nie bądźcie gadatliwi jak poganie.' },
    { v: 7, cont: true, text: 'Oni myślą, że przez wzgląd na swe wielomówstwo będą wysłuchani.' },
  ],
  cam: { x: [-30, 30], y: [-80, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DUSK);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -600, y1: 300, n: 50 }));
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [14, 6, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.hillFar, 0.4) }).markup);

    /* the shrine: a back wall, two columns, a pediment */
    const shrine = S.layer({ par: 0.3, sh: 4 });
    const ss = sheet();
    ss.p(c.cut([[560, 270], [1300, 270], [1300, GY - 20], [560, GY - 20]], 0.5, 10), mix(C.plaster2, C.dusk, 0.2));
    ss.p(c.cut([[520, 272], [930, 150], [1340, 272]], 0.6, 10), mix(C.plaster, C.dusk, 0.18));
    ss.p(c.cut([[540, 262], [930, 170], [1320, 262]], 0.4, 10), mix(C.plaster2, C.dusk, 0.25));
    ss.p(c.cut(c.rect(510, 266, 840, 16), 0.4, 10), mix(C.stone2, C.dusk, 0.2));
    [610, 1250].forEach((x) => {
      ss.p(c.cut(c.rect(x - 26, 282, 52, GY - 300), 0.5, 10), C.stone);
      let fl = '';
      for (let k = -2; k <= 2; k++) fl += c.ribbon([[x + k * 9, 296], [x + k * 9, GY - 34]], 2);
      ss.x(fl, C.stone2, 'opacity=".7"');
      ss.p(c.cut([[x - 38, 282], [x + 38, 282], [x + 30, 298], [x - 30, 298]], 0.4, 5) + c.cut(c.rect(x - 36, GY - 38, 72, 18), 0.4, 5), C.stone2);
    });
    shrine.add(ss.out());
    const floor = S.layer({ par: 0.4, sh: 3 });
    floor.add(sheet().p(c.cut([[-1100, GY - 22], [2700, GY - 22], [2700, 1900], [-1100, 1900]], 0.6, 20), mix(C.stone2, C.dusk, 0.25)).out());

    /* the idol, the incense */
    const idolL = S.layer({ par: 0.4, sh: 5 });
    idolL.add(`<g transform="translate(${IX} ${GY - 20})">${idolStatue(c)}</g>`);
    const smoke = [0, 1, 2, 3].map((i) => idolL.add(`<path d="${c.ribbon(c.cbez([0, 0], [14, -30], [-14, -60], [0, -90], 16), (u) => 5 - u * 3)}" fill="${C.lavender}" opacity=".6"/>`));
    const bowlS = sheet().p(c.cut([[-26, 0], [-30, -16], [30, -16], [26, 0]], 0.3, 4), mix(C.ochre, C.clay, 0.3)).p(c.cut(c.rect(-6, 0, 12, 40), 0.2, 4) + c.cut(c.rect(-20, 36, 40, 8), 0.2, 4), C.wood2).out();
    idolL.add(`<g transform="translate(${IX + 190} ${GY - 64})">${bowlS}<circle cy="-20" r="40" fill="url(#warm-glow)"/></g>`);

    /* the heap of words */
    const heapL = S.layer({ par: 0.4, sh: 5 });
    const HEAPS = [[220, 70, 0.3, 0.95], [170, 120, 0.85, 1.35], [120, 150, 1.25, 1.6], [80, 120, 1.5, 1.8]].map(([w, h, a, b], i) => ({ w, h, a, b, i, el: heapL.add(`<g>${slipHeap(c, w, h)}</g>`) }));

    /* the worshippers */
    const act = S.layer({ par: 0.4, sh: 5 });
    const PAG = [
      { o: { robe: C.linen, mantle: C.terracotta, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin2 }, x: 560, pose: 'kneel' },
      { o: { robe: C.wheatRobe, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3 }, x: 440, pose: 'stand' },
      { o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.ochreRobe, skin: C.skin, beard: 'none' }, x: 680, pose: 'kneel' },
    ].map((m, i) => ({ ...m, i, p: S.puppet(act.add(person(c, { ...m.o, pose: m.pose }))), seed: c.rr(0, 9) }));
    const SLIPS = Array.from({ length: 15 }, (_, i) => ({ i, m: PAG[i % 3], el: act.add(wordSlip(c, 30)) }));
    const hope = act.add(`<g>${thought(c, `<g transform="translate(-6 12) scale(.62)">${ear(c, C.skin2)}</g>`, { w: 70, h: 56 })}</g>`);

    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(sheet().p(c.cut(c.rect(-900, 900, 3400, 900), 0.5, 20), mix(C.stone2, C.dusk, 0.35)).out());

    return (t, time) => {
      const T = time;
      const pray = es(t, 0.05, 0.3);
      PAG.forEach((m) => {
        const bob = T ? Math.sin(T * 5 + m.i * 2) : 0;
        const look = es(t, 1.3, 1.55);
        m.p.set({ x: m.x, y: GY + (m.i === 1 ? -4 : 6), s: m.pose === 'kneel' ? 0.92 : 0.9, armF: 40 + pray * 40 + bob * 8 * pray, armB: 30 + pray * 90, head: -pray * 6 + bob * 3 * pray - look * 12, lean: m.pose === 'kneel' ? pray * 8 : 0, blink: blinkAt(T, m.seed) });
      });
      /* the words stream out … */
      const flow = es(t, 0.1, 0.3) * (1 - es(t, 1.85, 1.98));
      SLIPS.forEach((sl) => {
        const [hx, hy] = headAt(sl.m.x, sl.m.pose === 'kneel' ? GY + 6 : GY - 4, 0.92, false, sl.m.pose === 'kneel' ? 46 : 0);
        const k = (t * 1.6 + sl.i / SLIPS.length) % 1;
        const tx = IX - 60 + ((sl.i * 37) % 120), ty = GY - 30 - Math.min(1, t / 1.7) * 200 * ((sl.i % 4) / 4);
        const x = lerp(hx + 24, tx, k), y = lerp(hy + 8, ty, k) - Math.sin(k * PI) * 90;
        pose(sl.el, { x, y, r: k * 360 * (sl.i % 2 ? 1 : -1), s: 0.9, o: flow * (k < 0.92 ? 1 : 0) });
      });
      /* … and pile up at the idol's feet, into a tower */
      let top = GY - 20;
      HEAPS.forEach((h) => {
        const k = es(t, h.a, h.b);
        pose(h.el, { x: IX - 150 + h.i * 14, y: top, sy: Math.max(0.02, k), o: k > 0.01 ? 1 : 0 });
        top -= h.h * k * 0.82;
      });
      smoke.forEach((sm, i) => {
        const k = T ? (T * 0.25 + i / 4) % 1 : i / 4;
        pose(sm, { x: IX + 190 + Math.sin(k * 6 + i) * 8, y: GY - 90 - k * 160, s: 0.6 + k, o: (1 - k) * 0.8 });
      });
      /* v7b — he hopes to be heard; the stone does not move */
      const hk = es(t, 1.2, 1.45, ease.back);
      const [ex, ey] = headAt(440, GY - 4, 0.9, false);
      pose(hope, { x: ex + 10, y: ey - 20, s: hk, o: hk > 0.02 ? 1 : 0 });

      S.cam.z = 1.02 + es(t, 0.2, 1.0) * 0.04 - es(t, 1.1, 1.6) * 0.04;
      S.cam.y = -es(t, 1.1, 1.6) * 60;
      S.cam.x = -10 + es(t, 1.1, 1.6) * 10;
    };
  },
};
