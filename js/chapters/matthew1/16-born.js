// Mt 1,25 — inside Joseph's house by lamplight. He keeps apart: his mat by the door, hers under the window, the lamp
// between them, while the moon waxes and wanes in the window, month after month. Then she has given birth to a Son: a
// soft light, the Child in her arms, a star in the window. Joseph comes and kneels beside them, lifts his hand, and
// gives him his name — Jesus, in gold.
import { C, CAST, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import {
  NIGHT, JOSEPH, MARY, lyingPerson, childInArms, glowDisc, rayBurst, hungGold, sparkle, glowStar,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const FY = 700;                   // the floor
const WX = 960, WY = 250;         // the window (centre)

export default {
  id: 'mt1-born',
  beats: [
    { v: 25, text: 'lecz nie zbliżał się do Niej, aż porodziła Syna,' },
    { v: 25, cont: true, text: 'któremu nadał imię Jezus.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, NIGHT);
    const out = S.layer({ par: 0.02, sh: 1, flat: true });
    out.add(stars(c, { x0: 700, x1: 1200, y0: 100, y1: 420, n: 40 }));
    const moonL = S.layer({ par: 0.02, sh: 2 });
    const moonEl = moonL.add(`<g>${moon(c, 36)}</g>`);
    const shadow = moonL.add(`<g><circle r="37" fill="${NIGHT[1]}"/></g>`);
    const starEl = moonL.add(`<g>${glowStar(c, 14)}</g>`);

    /* ---------- the room: back wall with its window, the floor ---------- */
    const room = S.layer({ par: 0.1, sh: 3 });
    const wall = mix(C.plaster2, C.clay, 0.25);
    const rs = sheet();
    rs.p(c.cut([[-1200, -1200], [2800, -1200], [2800, FY + 10], [-1200, FY + 10]], 0.8, 40) + c.hole(c.rect(WX - 90, WY - 80, 180, 160), 0.6, 10), wall);
    rs.p(c.cut([[WX - 100, WY + 80], [WX + 100, WY + 80], [WX + 106, WY + 94], [WX - 106, WY + 94]], 0.4, 6), C.wood2);
    rs.x(c.ribbon([[WX, WY - 80], [WX, WY + 80]], 5) + c.ribbon([[WX - 90, WY], [WX + 90, WY]], 5), C.wood2);
    // a niche with the lamp
    rs.p(c.cut([[760, 460], [760, 400], ...c.arc(800, 400, 40, 36, PI, 2 * PI, 8), [840, 460]], 0.4, 5), shade(wall, -0.25));
    // a doorway on the left
    rs.p(c.cut([[380, FY], [380, 460], ...c.arc(430, 460, 50, 44, PI, 2 * PI, 8), [480, FY]], 0.4, 6), mix(C.night, C.wood2, 0.3));
    room.add(rs.out());
    room.add(sheet().p(c.ridge(c.wave(FY, [2, 1], [500, 140]), -1200, 2800, 1900, 12, 0.6), mix(C.wood3, C.sand2, 0.5)).out());
    const lampL = S.layer({ par: 0.1, sh: 1, flat: true });
    const lampGlow = lampL.add(`<g>${glowDisc(260, 'warm-glow', 1)}</g>`);
    const birthGlow = lampL.add(`<g>${glowDisc(260, 'halo-glow', 1)}${rayBurst(c, { n: 18, r0: 40, r1: 260, spread: 0.03, color: '#fff3cf', o: 0.3 })}</g>`);
    const winLight = lampL.add(`<path d="${c.poly([[WX - 80, WY + 80], [WX + 80, WY + 80], [WX + 10, FY - 60], [WX - 150, FY - 60]])}" fill="#fff3cf" opacity=".09"/>`);
    const lamp = room.add(`<g>${sheet().p(c.cut([[-18, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [29, -9], [20, -2], [10, 1], [-12, 1]], 0.3, 4), C.pot).out()}<path d="M27 -12C22 -18 23 -26 27 -34C31 -26 32 -18 27 -12Z" fill="${C.lampFlame}"/></g>`);

    /* ---------- mats, Joseph, Mary ---------- */
    const P = S.layer({ par: 0.3, sh: 5 });
    P.add(sheet().p(c.cut([[380, FY + 2], [390, FY - 8], [600, FY - 10], [610, FY + 2]], 0.5, 6), C.wheatRobe).p(c.cut([[860, FY + 2], [870, FY - 10], [1110, FY - 12], [1120, FY + 2]], 0.5, 6), C.roseRobe).out());
    const jLie = P.add(`<g>${lyingPerson(c, JOSEPH, 0.7)}</g>`);
    const jSit = S.puppet(P.add(person(c, { ...JOSEPH, pose: 'sit' })));
    const jKneel = S.puppet(P.add(person(c, { ...JOSEPH, pose: 'kneel' })));
    const mSit = S.puppet(P.add(person(c, { ...MARY, pose: 'sit' })));
    const mChild = S.puppet(P.add(person(c, { ...MARY, pose: 'sit', holdF: childInArms(c) })));
    const N = S.layer({ par: 0.3, sh: 6 });
    const name = N.add(hungGold(c, tr('Jezus', 'Jesus'), { size: 38 }));
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => N.add(`<g>${sparkle(c, 9 + (i % 3) * 4)}</g>`));

    return (t, time) => {
      const flick = time ? 1 + Math.sin(time * 6.3) * 0.04 : 1;
      pose(lamp, { x: 790, y: 456 });
      pose(lampGlow, { x: 812, y: 430, s: flick, o: 0.85 });

      /* v25a: the months go by in the window (the moon waxes and wanes), each keeps to their own mat */
      const months = seg(t, 0.05, 0.5);
      const ph = (months * 3) % 1;
      pose(moonEl, { x: WX + 34, y: WY - 30, o: t < 0.55 ? 1 : 1 - es(t, 0.55, 0.65) });
      pose(shadow, { x: WX + 34 + lerp(-80, 80, ph), y: WY - 30, o: t > 0.05 && t < 0.5 ? 1 : t <= 0.05 ? 1 : 0, s: 1 });
      pose(starEl, { x: WX - 30, y: WY - 40, s: 0.6 + es(t, 0.55, 0.75) * 0.6, o: es(t, 0.55, 0.75) });
      const born = es(t, 0.5, 0.66);
      const wake = es(t, 0.55, 0.61);
      pose(jLie, { x: 470, y: FY - 10, o: 1 - wake });
      const kneel = es(t, 1.1, 1.18);
      jSit.set({ x: 500, y: FY - 4, s: 0.95, flip: false, o: wake * (1 - kneel), armF: 30 + born * 30, armB: 10, head: -born * 6, blink: blinkAt(time, 1) });
      const bless = es(t, 1.35, 1.55);
      jKneel.set({ x: 820, y: FY - 2, s: 0.95, flip: false, o: kneel, armF: 50 + bless * 25, armB: 20 + bless * 30, head: 8 - bless * 6, blink: blinkAt(time, 1) });
      mSit.set({ x: 1000, y: FY - 4, s: 0.95, flip: true, o: 1 - born, armF: 20, armB: 10, head: 6, blink: blinkAt(time, 3) });
      mChild.set({ x: 1000, y: FY - 4, s: 0.95, flip: true, o: born, armF: 70, armB: 30, head: 10, blink: blinkAt(time, 3) });
      pose(birthGlow, { x: 960, y: FY - 90, s: 0.4 + born * 0.6 + es(t, 1.4, 1.7) * 0.2, r: t * 3, o: born * 0.9 });
      pose(winLight, { o: es(t, 0.55, 0.75) * 0.14 });
      sk.blend(NIGHT, ['#26306a', '#3c4583', '#6b6c9c'], born);

      /* v25b: he names him Jesus */
      const nk = es(t, 1.35, 1.62, ease.out);
      pose(name, { x: 720, y: lerp(-500, 200, nk), r: Math.sin(t * 3) * 1.2, o: nk > 0.002 ? 1 : 0 });
      sparks.forEach((sp, i) => { const kk = seg(t, 1.5 + i * 0.04, 1.95 + i * 0.04); const a = (i / 6) * PI * 2; pose(sp, { x: 720 + Math.cos(a) * (70 + kk * 70), y: 200 + Math.sin(a) * (30 + kk * 40), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 1.5 + i * 0.04, 1.95 + i * 0.04) }); });

      S.cam.z = 1.04 + es(t, 0.5, 0.9) * 0.04 + es(t, 1.1, 1.5) * 0.04;
      S.cam.x = es(t, 1.1, 1.5) * 20;
      S.cam.y = 10;
    };
  },
};
