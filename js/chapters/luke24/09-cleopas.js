// Łk 24,18–19 — Standing on the road. One of them — his name comes down on a tag: Cleopas — answers, pointing back the
// way they came: "Are you the only visitor in Jerusalem who does not know?" (the city in his bubble, and a question).
// "What things?" asks the Stranger. And they tell Him, and a painted flat comes down over the road: Jesus of Nazareth,
// a prophet mighty in deed and word — teaching the people on a hillside, a lame man leaping up with his crutch held
// high, the loaves in their baskets — before God (His light over it all) and all the people.
import { C, CAST, blinkAt, pose, lerp, mix } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import {
  LATE, emmausSet, RD, TRIO, roadTrio, headAt, speech, GLYPH, nameTag, hanging, walledCity, hangK, flat, flatSky, flatHills,
  still, godLight, crowdPerson, tr,
} from './lib.js';

const GY = RD.GY;
const FW = 460, FH = 250;

export default {
  id: 'lk24-cleopas',
  beats: [
    { v: 18 },
    { v: 19, text: 'Zapytał ich: «Cóż takiego?»' },
    { v: 19, cont: true, text: 'Odpowiedzieli Mu: «To, co się stało z Jezusem Nazarejczykiem, który był prorokiem potężnym w czynie i słowie wobec Boga i całego ludu;' },
  ],
  cam: { x: [-40, 40], y: [-20, 40], z: [0.96, 1.1] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: LATE, sunAt: [1250, 210] });
    const R = roadTrio(S, E.act, E.fx);
    const tag = hanging(E.fx, nameTag(c, tr('Kleofas', 'Cleopas'), { size: 17 }), { x: 0, y: -1500, len: 700 });
    const city = `<g transform="translate(-6 22) scale(.34)">${walledCity(c, 0, 0, 1)}</g><g transform="translate(34 -10) scale(.8)">${GLYPH.q(c)}</g>`;
    const cBub = E.fx.add(`<g>${speech(c, city, { w: 110, h: 76, flip: true })}</g>`);
    const qBub = E.fx.add(`<g>${speech(c, `<g transform="scale(1.2)">${GLYPH.q(c)}</g>`, { w: 60, h: 50 })}</g>`);

    /* the flat: a prophet mighty in deed and word, before God and all the people */
    const folk = (x, y, s, flip, extra = {}) => ({ x, y, s, flip, o: { ...crowdPerson(c), ...extra }, armF: c.rr(10, 40), armB: c.rr(0, 20), head: flip ? -4 : 4 });
    const inner = flatSky(S, FW, FH, ['#d8e6df', '#f6e5c2'])
      + flatHills(c, FW, 40, mix(C.hillMid, C.sage2, 0.4), 12)
      + flatHills(c, FW, 88, mix(C.hillNear, C.sand, 0.3), 5)
      + still(c, [
        folk(-190, 104, 0.34, false), folk(-160, 110, 0.36, false), folk(-126, 104, 0.34, false), folk(-96, 112, 0.36, false),
        folk(110, 106, 0.34, true), folk(146, 112, 0.36, true), folk(180, 104, 0.34, true),
        { x: -10, y: 100, s: 0.42, flip: false, o: CAST.jesus, armF: 60, armB: 140, head: -6 },
        { x: 60, y: 108, s: 0.38, flip: true, o: { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope, holdF: `<path d="${c.ribbon([[0, 0], [2, -110]], 5)}" fill="${C.wood3}"/>` }, armF: 170, armB: 150, head: -10 },
      ])
      + `<g transform="translate(0 -${FH / 2 - 30})">${godLight(c, 26)}</g>`;
    const prophet = E.FL.add(flat(S, inner, { w: FW, h: FH }));

    return (t, T) => {
      E.update(T, { sunY: 210 });
      /* v18: Cleopas answers, pointing back to Jerusalem */
      const speak = es(t, 0.1, 0.3) * (1 - es(t, 0.95, 1.1));
      const tell = es(t, 2.05, 2.3);
      const ask = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      R.fr.p.set({ x: TRIO.FR, y: GY - 2, s: TRIO.S, armF: 20 + tell * 60 + Math.sin(t * 7) * 6 * tell, armB: 10 + tell * 40, head: -tell * 10 + (1 - tell) * 8, blink: blinkAt(T, 1) });
      R.cl.p.set({ x: TRIO.CL, y: GY + 4, s: TRIO.S, flip: true, armF: 22 + speak * 90 + tell * 30, armB: 12 + speak * 20 + tell * 90, head: -speak * 8 - tell * 10 + (1 - Math.max(speak, tell)) * 10, blink: blinkAt(T, 4) });
      fade(R.fr.sad, 1 - tell * 0.3);
      fade(R.cl.sad, 1 - tell * 0.3);
      R.stSet({ x: TRIO.ST, y: GY + 2, s: TRIO.S + 0.02, flip: false, armF: 34 + ask * 30, armB: 10 + ask * 50, head: -ask * 4 - tell * 8, blink: blinkAt(T, 6) });
      R.halo(0.26);
      const [chx, chy] = headAt(TRIO.CL, GY + 4, TRIO.S, true);
      hangK(tag, es(t, 0.05, 0.3, ease.back) * (1 - es(t, 1.0, 1.2, ease.in)), chx, chy - 150, T, 0);
      const cb = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(cBub, { x: chx - 16, y: chy - 30, s: cb, o: cb > 0.01 ? 1 : 0 });
      /* v19a: "What things?" */
      const [shx, shy] = headAt(TRIO.ST, GY, TRIO.S, false);
      const qb = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.9, 2.02));
      pose(qBub, { x: shx + 14, y: shy - 34, s: qb, o: qb > 0.01 ? 1 : 0 });
      /* v19b: the flat of the prophet mighty in deed and word */
      const fk = es(t, 2.1, 2.45, ease.out);
      hangK(prophet, fk, 800, 262, T, 1);

      S.cam.x = 0;
      S.cam.y = 24 - fk * 20;
      S.cam.z = (S.portrait ? 0.98 : 1.06) - fk * 0.04;
      void lerp; void bump; void seg;
    };
  },
};
