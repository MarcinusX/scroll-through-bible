// Łk 18,18–21 — on the wayside a ruler comes up the road, a rich young man in plum and gold (Mark 10's rich man),
// and bows before Jesus: "Good Teacher, what shall I do to inherit eternal life?" — in his thoughts, the ring without
// end. "Why do you call me good?": the little word "good" hangs between them. "No one is good, except one — God":
// Jesus points up, and the word rises to the light that comes down high over them (God, shown only as light).
// "You know the commandments": five picture cards come down in a row — two rings, a dagger, a purse, a lying tongue,
// each crossed through, and an old father and mother. "I have observed all these things from my youth up": one by one
// a green tick is laid on every card, and he stands a little taller, a hand on his chest.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { waySet, WY, L10, words, wordTag, onString, iconCard, commandIcons, godLight, tick, CARD_X, CARD_Y, eternityRing, withFace, faceBits, headAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { GY } = WY;
const JX = 760, RX = 970;

export default {
  id: 'lk18-ruler',
  beats: [
    { v: 18 },
    { v: 19, text: 'Jezus mu odpowiedział: «Czemu nazywasz Mnie dobrym?' },
    { v: 19, cont: true, text: 'Nikt nie jest dobry, tylko sam Bóg.' },
    { v: 20 },
    { v: 21 },
  ],
  cam: { x: [-20, 40], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const W = waySet(S, { jesus: false, dis: { keys: ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew'], x: 520, y: GY + 6, s: 0.86 } });
    const c = S.c;
    const A = W.act;
    const ruler = S.puppet(A.add(person(c, L10.rich)));
    const J = S.puppet(A.add(person(c, CAST.jesus)));
    const fx = W.fx;
    const ask = fx.add(`<g opacity="0">${words(c, tr(['Nauczycielu dobry, co mam czynić,', 'aby osiągnąć życie wieczne?'], ['Good Teacher, what shall I do', 'to inherit eternal life?']), { size: 18, side: -1 })}</g>`);
    const ringEl = fx.add(`<g opacity="0">${eternityRing(c, 34, 5, 20)}</g>`);
    const why = fx.add(`<g opacity="0">${words(c, tr(['Czemu nazywasz', 'Mnie dobrym?'], ['Why do you', 'call me good?']), { size: 18, side: 1 })}</g>`);
    const good = fx.add(`<g>${onString(wordTag(c, tr('dobry', 'good'), { size: 22, fill: C.halo }), 1600)}</g>`);
    const god = fx.add(`<g><circle r="90" fill="url(#halo-glow)" opacity=".7"/>${godLight(c, 34)}</g>`);
    const ICONS = commandIcons(c);
    const cards = ICONS.map((ic, i) => ({ i, el: fx.add(`<g>${iconCard(c, `<g transform="translate(0 -2)">${ic.icon}</g>`, tr(ic.pl, ic.en), { w: 100, h: 104, size: 13 })}</g>`), tk: fx.add(`<g opacity="0">${tick(c, 22)}</g>`) }));

    return (t, time) => {
      const T = time;
      W.update(T);
      if (W.disSp) W.disSp.set({ x: 520, y: GY + 6 });

      /* the ruler comes and bows (v18); stands proud (v21) */
      const inR = es(t, -0.2, 0.45);
      const rx = lerp(1450, RX, inR);
      const bow = es(t, 0.4, 0.55) * (1 - es(t, 2.9, 3.1));
      const proud = es(t, 4.05, 4.3);
      ruler.set({ x: rx, y: GY - 2, s: 1.0, flip: true, walk: inR > 0 && inR < 1 ? rx * 0.05 : undefined, armF: 20 + bow * 50 + proud * 70 + bump(t, 3.2, 3.9) * 20, armB: 10 + bow * 30 + proud * 30, head: bow * 10 - proud * 12, lean: -bow * 6, blink: blinkAt(T, 3) });
      const [rhx, rhy] = headAt(rx, GY - 2, 1.0, true);
      pose(ask, { x: rhx - 10, y: rhy - 40, s: es(t, 0.5, 0.68, ease.back), o: t > 0.5 && t < 1.05 ? 1 - es(t, 0.97, 1.05) : 0 });
      pose(ringEl, { x: rhx + 70, y: rhy - 170, s: es(t, 0.6, 0.8, ease.back), r: T * 10, o: t > 0.6 && t < 1.05 ? 1 - es(t, 0.97, 1.05) : 0 });

      /* Jesus: asks (v19a), points up (v19b), counts the commandments (v20) */
      const up = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      const count = bump(t, 3.05, 3.95);
      J.set({ x: JX, y: GY, s: 1.06, flip: false, armF: 20 + bump(t, 1.05, 1.9) * 50 + count * 60, armB: 10 + up * 165 + count * 20, head: -up * 14 + count * -4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, GY, 1.06, false);
      W.voice(jhx, jhy, Math.max(bump(t, 1.02, 1.95), bump(t, 2.02, 2.95), bump(t, 3.02, 3.95)) * 0.7, T, { dir: 1, spread: 1.6 });
      pose(why, { x: jhx + 20, y: jhy - 40, s: es(t, 1.05, 1.22, ease.back), o: t > 1.05 && t < 2.05 ? 1 - es(t, 1.95, 2.05) : 0 });

      /* the word "good", and the light it goes up to */
      const gk = es(t, 1.2, 1.45, ease.out);
      const rise = es(t, 2.2, 2.6);
      const gone = es(t, 2.9, 3.1);
      pose(good, { x: lerp(860, 800, rise), y: lerp(-1500, lerp(360, 250, rise), gk) - gone * 1400 + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.7) * 1.5 : 0 });
      const lk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.9, 3.15, ease.in));
      pose(god, { x: 800, y: lerp(-1500, 170, lk), s: 1 + (T ? Math.sin(T * 1.2) * 0.02 : 0) });

      /* v20 — the five cards; v21 — a tick on each */
      cards.forEach((cd) => {
        const k = es(t, 3.05 + cd.i * 0.1, 3.3 + cd.i * 0.1, ease.out);
        const x = CARD_X(cd.i), y = lerp(-1500, CARD_Y + (cd.i % 2) * 14, k) + (T ? Math.sin(T * 0.8 + cd.i) * 2 : 0);
        pose(cd.el, { x, y, r: T ? Math.sin(T * 0.7 + cd.i * 2) * 1.2 : 0 });
        const tk = es(t, 4.1 + cd.i * 0.08, 4.25 + cd.i * 0.08, ease.back);
        pose(cd.tk, { x: x + 30, y: y - 30, s: tk, o: tk > 0.02 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 30], [1.0, 20], [3.0, 10]]);
      S.cam.y = kf(t, [[0, 0], [2.0, -10], [3.0, -20]]);
      S.cam.z = 1.04;
      void shade; void mix; void sheet; void seg; void PI; void withFace; void faceBits;
    };
  },
};
