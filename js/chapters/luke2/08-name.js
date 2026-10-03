// Łk 2,21 — the little house in Bethlehem by day. Across the room a string of eight day-discs lights up, one sun after
// another, until the eighth: the day of the circumcision. An elder has come with the scroll of the Law and blesses the
// Child in Joseph's arms, Mary beside them (the rite itself is not shown). Then the name comes down in gold — Jesus —
// and a round picture opens beside it: the angel before Mary, long before, giving the same name; a thread of light
// runs from that picture to the name.
import { C, person, blinkAt, pose, lerp, sheet, mix, hanging } from '../kit.js';
import { scrollRolled } from '../mark2/lib.js';
import {
  roomSet, ROOM_FLOOR, JOSEPH, MARY, inArms, elder, daysString, hungGold, cameo, angel,
  hangAt, vpose, sparkle, fade, tr, es, ease, bump, seg, PI,
} from './lib.js';

const FL = ROOM_FLOOR;
const CX0 = 1080, CY0 = 300;      // the picture of the Annunciation
const NX0 = 800, NY = 240;        // the name

export default {
  id: 'lk2-name',
  beats: [
    { v: 21, text: 'Gdy nadszedł dzień ósmy i należało obrzezać Dziecię,' },
    { v: 21, cont: true, text: 'nadano Mu imię Jezus, którym Je nazwał anioł, zanim się poczęło w łonie [Matki].' },
  ],
  cam: { x: [-20, 40], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the picture clear of the thread, the name moved left to keep the thread of light between them
    const [CX, CY, NX] = S.portrait ? [990, 320, 660] : [CX0, CY0, NX0];
    const R = roomSet(S, { night: false });
    const P = S.layer({ par: 0.4, sh: 5 });
    const mary = S.puppet(P.add(person(c, { ...MARY, pose: 'sit' })));
    const jos = S.puppet(P.add(person(c, { ...JOSEPH, holdF: inArms(c) })));
    const eld = S.puppet(P.add(elder(c, 1, { holdF: `<g transform="rotate(-70)">${scrollRolled(c, 50)}</g>` })));

    const X = S.layer({ par: 0.3, sh: 5 });
    const days = X.add(`<g>${daysString(c, 8, 66, 19)}</g>`);
    const dayEls = Array.from(days.querySelectorAll('.day')).map((d) => ({ off: d.querySelector('.off'), lit: d.querySelector('.lit') }));
    // the Annunciation, in a round picture: the angel before Mary
    const ann = `<g transform="translate(34 58) scale(-.42 .42)">${angel(c, { robe: C.linen, mantle: C.halo, hair: C.wheat2, holdF: '', holdB: '' }).replace('class="armFr"', 'class="armFr" transform="rotate(-80)"')}</g><g transform="translate(-34 58) scale(.42)">${person(c, { ...MARY, pose: 'kneel', holdF: '', holdB: '' })}</g>`;
    const pic = hanging(X, cameo(c, ann, { r: 74, face: mix(C.parchment, C.skyVeil, 0.4) }), { x: 0, y: 0, len: 700 });
    const name = X.add(hungGold(c, tr('Jezus', 'Jesus'), { size: 40 }));
    const thread = [0, 1, 2, 3, 4, 5, 6].map(() => X.add(`<g>${sparkle(c, 8)}</g>`));

    return (t, time) => {
      const T = time;
      /* v21a — the eighth day: the day-discs light one by one */
      const dk = es(t, 0.0, 0.2, ease.out) * (1 - es(t, 1.05, 1.3, ease.in));
      pose(days, { x: NX0 - 231, y: lerp(-400, 200, dk), o: dk > 0.001 ? 1 : 0 });
      dayEls.forEach((d, i) => {
        const k = es(t, 0.1 + i * 0.07, 0.17 + i * 0.07);
        fade(d.lit, i === 7 ? k : k);
        fade(d.off, 1 - k);
      });
      const bless = es(t, 0.55, 0.8);
      eld.set({ x: 1010, y: FL, s: 0.95, flip: true, armF: 50, armB: 20 + bless * 110, head: 4 - bless * 6, blink: blinkAt(T, 4) });
      const lift = es(t, 1.1, 1.4);
      jos.set({ x: 850, y: FL, s: 0.96, armF: 70 + lift * 20, armB: 30 + lift * 40, head: 8 - lift * 14, blink: blinkAt(T, 2) });
      mary.set({ x: 700, y: FL - 46, s: 0.95, armF: 30 + bump(t, 1.2, 1.9) * 30, armB: 20, head: 6 - lift * 6, blink: blinkAt(T, 1) });

      /* v21b — He is named Jesus, the name the angel gave before He was conceived */
      const nk = es(t, 1.08, 1.4, ease.out);
      pose(name, { x: NX, y: lerp(-500, NY, nk), r: Math.sin(T * 0.9) * 1.2, o: nk > 0.002 ? 1 : 0 });
      const pk = es(t, 1.25, 1.55, ease.out);
      hangAt(pic, CX, lerp(-520, CY, pk), T, pk > 0.001 ? 1 : 0, 1, 0.7, 2);
      thread.forEach((th, i) => {
        const u = (i + 0.5) / 7;
        const k = es(t, 1.5 + i * 0.04, 1.65 + i * 0.04);
        vpose(th, { x: lerp(CX - 70, NX + 90, u), y: lerp(CY - 10, NY + 4, u) - Math.sin(u * PI) * 40, s: k * (0.7 + Math.sin(T * 3 + i) * 0.15), r: T * 40, o: k });
      });

      S.cam.z = 1.03 + es(t, 1.0, 1.5) * 0.04;
      S.cam.y = -10;
      S.cam.x = 10;
    };
  },
};
