// Łk 24,41–43 — Joy and wonder all round the room, too great to believe: little stars and questions over their heads,
// arms lifted. "Have you anything here to eat?" — His bubble shows an empty bowl. Peter brings Him a piece of broiled
// fish on a dish (and, in the English, some honeycomb); Jesus takes it and eats it before them, and they watch,
// leaning close — a spirit does not eat.
import { C, blinkAt, pose, lerp, mix, sheet } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { gatherRoom, MID, headAt, handAt, handB, speech, bowl, GLYPH, roastFish, sparkle, markLight, tr } from './lib.js';

export default {
  id: 'lk24-fish',
  beats: [
    { v: 41, text: 'Lecz gdy oni z radości jeszcze nie wierzyli i pełni byli zdumienia,' },
    { v: 41, cont: true, text: 'rzekł do nich: «Macie tu coś do jedzenia?»' },
    { v: 42 },
    { v: 43 },
  ],
  cam: { x: [-40, 60], y: [-20, 60], z: [0.9, 1.2] },
  build(S) {
    const c = S.c;
    const G = gatherRoom(S);
    const fx = S.layer({ par: 0.56, sh: 5 });
    const wonder = G.crew.filter((m, i) => i % 2 === 0).map((m, i) => ({ m, i, el: fx.add(`<g>${i % 2 ? GLYPH.star(c) : `<g transform="scale(1.2)">${GLYPH.bang(c)}</g>`}</g>`) }));
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-6 12)">${bowl(c, { w: 40, food: null })}</g><g transform="translate(26 -2) scale(.8)">${GLYPH.q(c)}</g>`, { w: 90, h: 60 })}</g>`);
    const EN = tr('pl', 'en') === 'en';
    const comb = EN ? sheet().p(c.cut([[-8, -4], [-4, -12], [6, -12], [10, -4], [6, 4], [-4, 4]], 0.3, 3), mix(C.sun, C.ochre, 0.3)).x(c.ribbon([[-2, -12], [-2, 4]], 1) + c.ribbon([[-8, -4], [10, -4]], 1), shade2(C.ochre), 'opacity=".6"').out() : '';
    const dish = fx.add(`<g>${sheet().p(c.cut(c.ell(0, 0, 34, 6, 16), 0.3, 4), C.stone2).out()}<g transform="translate(-4 -8) scale(.9)">${roastFish(c)}</g>${comb ? `<g transform="translate(22 -6)">${comb}</g>` : ''}</g>`);
    const piece = fx.add(`<g transform="scale(.7)">${roastFish(c)}</g>`);
    const lights = [0, 1].map(() => fx.add(`<g>${markLight(c, 5)}</g>`));
    const spk = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 11)}</g>`));

    return (t, T) => {
      G.RR.R.update(T, 1);
      G.RR.door.set(0); G.RR.door.bolt(1);
      pose(G.glow, { x: MID.x, y: MID.y, s: 1, o: 0.8 });
      /* v41a: joy and wonder */
      const joyK = es(t, 0.05, 0.3) * (1 - es(t, 2.0, 2.3) * 0.6);
      const askK = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.1));
      const take = es(t, 2.5, 2.75);
      const eat = es(t, 3.05, 3.3);
      const aF = 24 + askK * 40 + take * 50 + eat * 26;
      const aB = 14 + askK * 60 * (1 - take);
      G.jesus.set({ x: MID.x, y: MID.y, s: MID.s, flip: t > 2.0 && t < 3.0 ? true : false, armF: aF, armB: aB, head: eat * 6, blink: blinkAt(T) });
      const flipJ = t > 2.0 && t < 3.0;
      const [jhx, jhy] = headAt(MID.x, MID.y, MID.s, flipJ);
      const ak = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(ask, { x: jhx + 14, y: jhy - 34, s: ak, o: ak > 0.01 ? 1 : 0 });
      [[handAt(MID.x, MID.y, MID.s, flipJ, aF)], [handB(MID.x, MID.y, MID.s, flipJ, aB)]].forEach(([[x, y]], i) => pose(lights[i], { x, y, s: 0.8, o: (1 - take) * 0.9 }));

      /* v42: Peter brings the fish */
      const bring = es(t, 2.05, 2.5);
      G.crew.forEach((m) => {
        const flip = m.x > MID.x;
        if (m.k === 'peter') {
          const px = lerp(m.x, 700, bring) - es(t, 2.8, 3.1) * 40;
          m.p.set({ x: px, y: m.y, s: m.s, flip: false, walk: bring > 0.01 && bring < 0.99 ? px * 0.06 : undefined, armF: 30 + bring * 50 * (1 - take * 0.6), armB: 10 + joyK * 60 * (1 - bring), head: 4, blink: blinkAt(T, m.seed) });
          m.px = px;
        } else {
          const watch = es(t, 3.05, 3.3);
          m.p.set({ x: m.x, y: m.y, s: m.s, flip, lean: -joyK * 6 + watch * 8, armF: 24 + joyK * (m.i % 2 ? 60 : 30) + watch * 10, armB: 10 + joyK * (m.i % 2 ? 40 : 130), head: -joyK * 6 + watch * 10, blink: blinkAt(T, m.seed) });
        }
        fade(m.sad, 0);
      });
      const P = G.by.peter;
      const [phx, phy] = handAt(P.px, P.y, P.s, false, 30 + bring * 50 * (1 - take * 0.6));
      const [jfx, jfy] = handAt(MID.x, MID.y, MID.s, flipJ, aF);
      pose(dish, { x: phx + 6, y: phy - 2, o: seg(t, 2.02, 2.08) * (1 - es(t, 2.9, 3.0)) });
      const onJ = take > 0.5;
      pose(piece, { x: onJ ? jfx + (flipJ ? -6 : 6) : phx, y: onJ ? jfy - 4 : phy - 8, r: -eat * 20, o: take > 0.5 ? 1 - es(t, 3.7, 3.95) : 0 });
      wonder.forEach((w) => {
        const [hx, hy] = headAt(w.m.x, w.m.y, w.m.s, w.m.x > MID.x);
        const k = es(t, 0.1 + w.i * 0.05, 0.3 + w.i * 0.05, ease.back) * (1 - es(t, 0.95, 1.1));
        pose(w.el, { x: hx + 10, y: hy - 46, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v43: He takes it and eats before them */
      spk.forEach((el, i) => {
        const b = bump(t, 3.3 + i * 0.12, 3.9 + i * 0.05);
        pose(el, { x: jhx - 60 + i * 60, y: jhy - 80 - (i % 2) * 18, s: b, r: T * 30, o: b });
      });

      S.cam.x = 0;
      S.cam.y = 40 + es(t, 2.9, 3.3) * 6;
      S.cam.z = (S.portrait ? 0.92 : 1.04) + es(t, 2.9, 3.3) * 0.08;
    };
  },
};
function shade2(col) { return mix(col, '#2a1d12', 0.3); }
