// Mt 4,21–22 — further along the shore Zebedee's boat is drawn up on the sand. Jesus comes by with Peter and
// Andrew behind Him; name tags come down: James, son of Zebedee, and John his brother. They sit in the boat with
// their father at the stern, mending a torn net over the side, needles going. He calls them: the needles stop,
// the brothers look up. At once they put down the net, climb out of the boat and go after Him — and Zebedee stays
// in the boat with the net across his knees, lifting his hand after his sons.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { rock, reeds, grass } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { lakeShore, ZEBEDEE, netDrape, nameTag, voiceRings, headAt, tr, PI } from './lib.js';

const BX = 1020, BY = 726;      // the boat on the sand
const SHORE = 774;

export default {
  id: 'mt4-zebedee',
  beats: [
    { v: 21, text: 'A gdy poszedł stamtąd dalej, ujrzał innych dwóch braci: Jakuba, syna Zebedeusza, i brata jego, Jana,' },
    { v: 21, cont: true, text: 'jak z ojcem swym Zebedeuszem naprawiali w łodzi swe sieci.' },
    { v: 21, cont: true, text: 'Ich też powołał.' },
    { v: 22 },
  ],
  cam: { x: [-60, 60], y: [0, 60], z: [1, 1.1] },
  build(S) {
    const L = lakeShore(S, { beachY: 700 });
    const c = L.c;

    /* ---------- the boat drawn up on the beach ---------- */
    const BL = S.layer({ par: 0.5, sh: 4 });
    const B = boat(c, { hull: mix(C.wood, C.wood3, 0.3), stripe: C.terracotta });
    BL.add(`<g transform="translate(${BX} ${BY}) scale(1.1)">${B.back}</g>`);
    const zeb = S.puppet(BL.add(person(c, { ...ZEBEDEE, pose: 'sit' })));
    const jamesB = S.puppet(BL.add(person(c, { ...CAST.james, pose: 'sit' })));
    const johnB = S.puppet(BL.add(person(c, { ...CAST.john, pose: 'sit' })));
    BL.add(`<g transform="translate(${BX} ${BY}) scale(1.1)">${B.front}</g>`);
    const netA = BL.add(`<g>${netDrape(c, 210, 56)}</g>`);
    const netB = BL.add(`<g opacity="0">${netDrape(c, 150, 40)}</g>`);
    const needles = [0, 1].map(() => BL.add(`<g><path d="${c.ribbon([[0, -9], [0, 9]], 2)}" fill="${C.wood2}"/></g>`));
    const post = BL.add(`<g>${sheet().p(c.cut(c.rect(-7, -80, 14, 84), 0.3, 6), C.wood2).out()}<path d="${c.ribbon(c.qbez([-4, -60], [-50, -20], [-96, -50], 12), 2.4)}" fill="${C.rope}"/></g>`);

    /* ---------- people on the beach ---------- */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const andrew = S.puppet(PL.add(person(c, { ...CAST.andrew })));
    const peter = S.puppet(PL.add(person(c, { ...CAST.peter })));
    const james = S.puppet(PL.add(person(c, { ...CAST.james })));
    const john = S.puppet(PL.add(person(c, { ...CAST.john })));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(PL, c, { n: 3, color: C.clay, r: 36, w: 5, both: false });

    /* ---------- names ---------- */
    const TL = S.layer({ par: 0.3, sh: 6 });
    const tags = [
      { x: 900, y: 270, m: nameTag(c, [tr('Jakub', 'James'), tr('syn Zebedeusza', 'son of Zebedee')], { size: 18 }), a: 0.3, b: 1.45 },
      { x: 1040, y: 330, m: nameTag(c, tr('Jan', 'John'), { size: 18 }), a: 0.4, b: 1.45 },
      { x: 1180, y: 280, m: nameTag(c, [tr('Zebedeusz', 'Zebedee'), tr('ojciec', 'their father')], { size: 18 }), a: 1.1, b: 2.2 },
    ].map((g, i) => ({ ...g, i, el: hanging(TL, g.m, { x: g.x, y: 0, len: 800 }) }));

    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, -220, 980, 14, 230, C.moss) + rock(c, 1540, 990, 280, 100, C.rock2) + reeds(c, 1760, 970, 10, 200, C.moss));

    const JK = (t) => lerp(250, 700, es(t, 0.0, 0.8, ease.sine));

    return (t, time) => {
      L.update(time);
      const T = time;

      /* v21a: He comes along the shore with Peter and Andrew */
      const jx = JK(t), jmov = Math.abs(JK(t + 0.02) - jx) > 0.1;
      const call = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.2));
      const back = t > 3.8;
      jesus.set({ x: jx, y: SHORE, s: 1.05, flip: back, walk: jmov ? jx * 0.045 : undefined, armF: 14 + call * 76, armB: 8 + call * 40, head: -call * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(jx, SHORE, 1.05);
      voice(hx + 14, hy, call, T, { dir: 1, spread: 2.4 });
      const px = jx - 130, ax = jx - 240;
      peter.set({ x: px, y: SHORE - 6, s: 1.0, flip: back, walk: jmov ? px * 0.05 : undefined, armF: 12, blink: blinkAt(T, 1) });
      andrew.set({ x: ax, y: SHORE + 4, s: 0.98, flip: back, walk: jmov ? ax * 0.05 + 1 : undefined, armF: 12, blink: blinkAt(T, 2) });

      tags.forEach((g) => {
        const k = es(t, g.a, g.a + 0.3, ease.out) * (1 - es(t, g.b, g.b + 0.25, ease.in));
        pose(g.el, { x: g.x, y: lerp(-400, g.y, k), r: Math.sin(T * 0.8 + g.i) * 1.2, o: k > 0.01 ? 1 : 0 });
      });

      /* v21b: mending the nets with their father */
      const look = es(t, 2.15, 2.35);
      const leave = es(t, 3.05, 3.12);
      const mend = (k) => (1 - look) * (Math.sin(T * 5 + k) * 18) * (T ? 1 : 0);
      jamesB.set({ x: BX - 90, y: BY - 22, s: 0.98, o: 1 - leave, armF: 55 + mend(0) - look * 30, armB: 30, head: 10 - look * 16, blink: blinkAt(T, 3), flip: look > 0.5 });
      johnB.set({ x: BX + 10, y: BY - 22, s: 0.96, o: 1 - leave, armF: 55 + mend(2) - look * 30, armB: 26, head: 12 - look * 18, blink: blinkAt(T, 4), flip: look > 0.5 });
      const wave = es(t, 3.4, 3.6);
      zeb.set({ x: BX + 160, y: BY - 22, s: 0.98, flip: true, armF: 50 + mend(4) * 0.6 + bump(t, 3.05, 3.4) * 20, armB: 20 + wave * (110 + Math.sin(T * 5) * 16), head: 8 - wave * 12, blink: blinkAt(T, 5) });
      pose(netA, { x: BX - 40, y: BY - 48, o: 1 - leave });
      pose(netB, { x: BX + 120, y: BY - 44, o: leave });
      needles.forEach((n, i) => pose(n, { x: BX - 36 + i * 96 + mend(i * 2) * 0.4, y: BY - 70 + mend(i * 2) * 0.3, r: 30 + mend(i) * 2, o: (1 - leave) * (1 - look) }));
      pose(post, { x: BX + 290, y: BY + 14 });

      /* v22: they leave the boat and their father and follow Him */
      const outK = es(t, 3.08, 3.6, ease.sine);
      const moving = outK > 0 && outK < 1;
      const jmx = lerp(BX - 70, jx + 120, outK), jnx = lerp(BX + 10, jx + 215, outK);
      james.set({ x: jmx, y: lerp(BY + 6, SHORE - 2, outK), s: 1.0, flip: true, o: leave, walk: moving || jmov ? jmx * 0.05 : undefined, armF: 12, blink: blinkAt(T, 3) });
      john.set({ x: jnx, y: lerp(BY + 8, SHORE + 6, outK), s: 0.98, flip: true, o: leave, walk: moving || jmov ? jnx * 0.05 + 2 : undefined, armF: 12, blink: blinkAt(T, 4) });

      S.cam.x = lerp(-50, 30, es(t, 0.3, 1.5, ease.sine)) - es(t, 3.2, 3.9) * 30;
      S.cam.y = 40;
      S.cam.z = 1.03 + es(t, 1.0, 1.4) * 0.04 - es(t, 3.0, 3.5) * 0.03;
    };
  },
};
