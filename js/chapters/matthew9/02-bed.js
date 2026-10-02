// Mt 9,2 — a courtyard in Capernaum, full of people; scribes sit on the stone bench. Four friends carry in a
// paralysed man lying on his bed and set him down before Jesus. Jesus sees their faith (a warm little heart
// over each of the four), and says to the man: "Take heart, son! Your sins are forgiven" — dark scraps lift off
// him one by one and turn into light.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { courtSet, courtCast, CT, WP, FRIENDS, matWithMan, heart, scrap, spark, bubble, darkKnot, kf, moving, tr, DAY } from './lib.js';

const JX = 790, BEDX = 1000;

export default {
  id: 'mt9-bed',
  beats: [
    { v: 2, text: 'I oto przynieśli Mu paralityka, leżącego na łożu.' },
    { v: 2, cont: true, text: 'Jezus, widząc ich wiarę, rzekł do paralityka:' },
    { v: 2, cont: true, text: '«Ufaj, synu! Odpuszczają ci się twoje grzechy».' },
  ],
  cam: { x: [-40, 260], y: [0, 60], z: [1, 1.2] },
  build(S) {
    const set = courtSet(S, { skyCols: DAY });
    const c = S.c;
    const cast = courtCast(S, set, { awe: false });
    const { jesus, scribes, dis, crowd } = cast;

    /* the four friends and the man on his bed */
    const L = S.layer({ par: WP, sh: 5 });
    const fr = FRIENDS.map((o, i) => ({ i, o, seed: c.rr(0, 9) }));
    fr.slice(0, 2).forEach((f) => { f.p = S.puppet(L.add(person(c, f.o))); });
    const bed = L.add(`<g>${matWithMan(c)}</g>`);
    fr.slice(2).forEach((f) => { f.p = S.puppet(L.add(person(c, f.o))); });
    const hearts = fr.map((f) => ({ f, el: L.add(`<g>${heart(c, 11)}</g>`) }));

    /* sins lifting off, the words */
    const fx = S.layer({ par: WP, sh: 4 });
    const scraps = Array.from({ length: 9 }, (_, i) => ({ i, el: fx.add(`<g>${scrap(c, c.rr(10, 16))}</g>`), sp: fx.add(`<g>${spark(c, 9)}</g>`), dx: c.rr(-50, 50), dy: c.rr(-20, 20), tx: c.rr(-160, 160), ty: c.rr(-420, -300), r: c.rr(-200, 200) }));
    const glow = fx.add(`<g><circle r="150" fill="url(#warm-glow)"/></g>`);
    const knot = fx.add(`<g>${darkKnot(c, 34)}<g transform="translate(-30 10)">${darkKnot(c, 22)}</g><g transform="translate(34 6)">${darkKnot(c, 24)}</g></g>`);
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Ufaj, synu!', 'Son, cheer up!')], { size: 24, dir: -1 })}</g>`);

    // the carry: the bed's centre x while they walk in, then they lower it
    const CK = [[-0.3, 1560], [0.62, BEDX]];
    const offs = [-72, 64, -80, 74];
    const REST = S.portrait ? [-60, 26, 200, 96] : [-60, 26, 230, 136];     // where each steps to once the bed is down (phone: closer)
    return (t, time) => {
      const T = time;
      set.update(T);
      crowd.forEach((g) => g.calm.set({ x: g.x, y: g.y }));

      /* v2a — they bring him */
      const cx = kf(t, CK, ease.out);
      const walking = moving(t, CK, 0.3);
      const down = es(t, 0.66, 0.9);
      const bedY = lerp(CT.FEET - 70, CT.FEET - 14, down);
      pose(bed, { x: cx, y: bedY + (walking ? Math.abs(Math.sin(cx * 0.05)) * 2 : 0) });
      fr.forEach((f) => {
        const x = cx + offs[f.i] + es(t, 0.9, 1.2) * REST[f.i];
        const kneel = f.i === 0 ? es(t, 2.2, 2.45) * 0 : 0;
        const heartK = bump(t, 1.08 + f.i * 0.07, 1.95);
        f.p.set({
          x, y: CT.FEET + (f.i < 2 ? -6 : 6), s: 0.9, flip: true,
          walk: walking || (t > 0.9 && t < 1.2) ? x * 0.05 + f.i : undefined,
          armF: 58 * (1 - down) + 20 + heartK * 30 + kneel, armB: 34 * (1 - down) + 10 + heartK * 50,
          head: -down * 6 + heartK * -4, blink: blinkAt(T, f.seed),
        });
      });
      hearts.forEach((h) => {
        const k = es(t, 1.1 + h.f.i * 0.08, 1.3 + h.f.i * 0.08, ease.back) * (1 - es(t, 2.5, 2.7));
        const x = cx + offs[h.f.i] + REST[h.f.i];
        pose(h.el, { x, y: CT.FEET - 232 * 0.9 - 10 - k * 14 + Math.sin(T * 2 + h.f.i) * 2, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* Jesus: turns to them, sees their faith, speaks to the man */
      const look = es(t, 1.05, 1.3);
      const speak = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: CT.FEET, s: 1.04, armF: 16 + look * 30 + speak * 50, armB: 10 + speak * 14, head: look * 6, blink: blinkAt(T) });
      const sk = es(t, 2.06, 2.26, ease.back) * (1 - es(t, 2.95, 3.0));
      pose(say, { x: JX + 50, y: CT.FEET - 236, s: sk, o: sk > 0.02 ? 1 : 0 });

      /* the sins lift off him and become light */
      scraps.forEach((s) => {
        const a = 2.3 + s.i * 0.05, k = es(t, a, a + 0.4, ease.in);
        const on = seg(t, 2.28 + s.i * 0.05, 2.3 + s.i * 0.05);
        const x = BEDX - 10 + s.dx + s.tx * k, y = CT.FEET - 96 + s.dy + s.ty * k;
        const turn = es(t, a + 0.25, a + 0.4);
        pose(s.el, { x, y, r: s.r * k, s: 1 - turn * 0.6, o: on * (1 - turn) });
        pose(s.sp, { x, y, s: 0.6 + turn * 0.6, r: T * 30, o: turn * (1 - es(t, a + 0.45, a + 0.6)) });
      });
      const kk = es(t, 2.0, 2.2) * (1 - es(t, 2.28, 2.4));
      pose(knot, { x: BEDX - 10, y: CT.FEET - 96 + Math.sin(T * 1.4) * 3, s: 0.6 + es(t, 2.0, 2.2) * 0.4, o: kk });
      pose(glow, { x: BEDX - 30, y: CT.FEET - 40, s: 0.6 + es(t, 2.3, 2.8) * 0.6, o: es(t, 2.25, 2.6) * 0.9 });

      scribes.forEach((s) => s.p.set({ x: s.x, y: s.y, s: 0.9, armF: 30, armB: 18, head: -es(t, 0.3, 0.7) * 4 + es(t, 2.4, 2.7) * (s.i % 2 ? 6 : -4), blink: blinkAt(T, s.seed) }));
      dis.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.86, flip: true, armF: 10 + bump(t, 1.1, 2) * (d.i === 0 ? 40 : 0), head: -look * 3, blink: blinkAt(T, d.seed) }));

      /* camera: the whole yard → the bed */
      // phone: further right, so the four friends (and their hearts) stay in view next to Jesus and the bed
      S.cam.x = S.portrait ? 60 + es(t, 0.6, 1.2) * 150 + es(t, 2.0, 2.5) * 30 : es(t, 0.6, 1.2) * 120 + es(t, 2.0, 2.5) * 40;
      S.cam.z = 1.02 + es(t, 0.8, 1.4) * 0.08 + es(t, 2.0, 2.5) * 0.08;
      S.cam.y = 20 + es(t, 0.8, 1.4) * 20 + es(t, 2.0, 2.5) * 20;
    };
  },
};
