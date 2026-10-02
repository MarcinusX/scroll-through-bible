// Mt 2,13 — night in the house in Bethlehem. Joseph sleeps on his mat; Mary dozes against the wall with the Child
// asleep in her lap. In a pool of light an angel of the Lord stands by Joseph's head. In his dream: the road to
// Egypt with its palms and pyramids; an hourglass — stay until I tell you; then Herod's dark shape with a torch,
// searching the streets for the Child.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import {
  LOOK, FLOOR, roomSet, sleeper, childPerson, angel, dreamCloud, pyramid, hourglass, colt, silhouette, crown, addToHead,
  placeTag, hangAt, vpose, flicker, sparkle, torch, INK, tr, PI,
} from './lib.js';
import { palm } from '../../assets/nature.js';

const JX0 = 600;            // Joseph's mat
const JXP = 720;            // phone: room for the angel by his head
const AX0 = 440, AXP = 580; // the angel
const MX = 930;             // Mary and the Child

export default {
  id: 'mt2-angel',
  beats: [
    { v: 13, text: 'Gdy oni odjechali, oto anioł Pański ukazał się Józefowi we śnie i rzekł:' },
    { v: 13, cont: true, text: '«Wstań, weź Dziecię i Jego Matkę i uchodź do Egiptu;' },
    { v: 13, cont: true, text: 'pozostań tam, aż ci powiem;' },
    { v: 13, cont: true, text: 'bo Herod będzie szukał Dziecięcia, aby Je zgładzić».' },
  ],
  cam: { x: [-40, 60], y: [0, 80], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const JX = S.portrait ? JXP : JX0, AX = S.portrait ? AXP : AX0;
    const room = roomSet(S, { night: true, bench: false, doorX: 1210 });

    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const glow = glowL.add(`<g><circle r="330" fill="url(#halo-glow)"/></g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    P.add(sheet().p(c.cut(c.blob(MX + 6, FLOOR + 4, 80, 13, 12, 0.1), 0.4, 5), mix(C.jesusMantle, C.clay, 0.3)).out());
    const mary = S.puppet(P.add(person(c, { ...LOOK.mary, pose: 'sit', eyes: 'closed' })));
    const child = S.puppet(P.add(childPerson(c, { ...LOOK.child, pose: 'sit', eyes: 'closed' })));
    const joseph = P.add(`<g>${sleeper(c, LOOK.joseph, { w: 220, s: 0.8 })}</g>`);
    const A = S.layer({ par: 0.45, sh: 6 });
    const ang = S.puppet(A.add(angel(c, { hair: C.wheat2, skin: C.skin })));

    /* the dream: the road to Egypt, the hourglass, Herod searching */
    const X = S.layer({ par: 0.4, sh: 5 });
    const egypt = `<g data-k="egy"><path d="${c.ridge(c.wave(40, [3, 1], [120, 50]), -150, 150, 70, 8, 0.5)}" fill="${C.sand2}"/><g transform="translate(40 42)">${pyramid(c, 120, 80, C.dune)}</g><g transform="translate(96 44)">${pyramid(c, 70, 46, mix(C.dune, C.sand, 0.4))}</g>${palm(c, -110, 46, 90)}<g transform="translate(-40 48) scale(.32) scale(-1 1)">${colt(c)}</g><g transform="translate(-4 48) scale(.3) scale(-1 1)">${person(c, LOOK.joseph)}</g></g>`;
    const sil = silhouette(LOOK.herod, INK);
    const herodSil = addToHead(person(c, { ...sil, holdF: `<g transform="rotate(-20)">${torch(c, 50)}</g>` }), crown(c, INK)).split(`fill="${C.blush}"`).join(`fill="${INK}"`);
    const search = `<g data-k="hrd" opacity="0"><path d="${c.ridge(c.wave(40, [3, 1], [120, 50]), -150, 150, 70, 8, 0.5)}" fill="${mix(C.storm2, C.plumRobe, 0.3)}"/>${[-120, -70, 60, 100].map((x) => `<path d="${c.cut(c.rect(x, 0, 36, 42), 0.3, 4)}" fill="${mix(C.storm, C.plumRobe, 0.3)}"/>`).join('')}<g transform="translate(-10 48) scale(.5)">${herodSil}</g></g>`;
    const dream = X.add(`<g>${dreamCloud(c, egypt + search, { w: 360, h: 230, dx: 170, dy: -170 })}</g>`);
    const egy = S.$('egy'), hrd = S.$('hrd');
    const glass = X.add(`<g>${hourglass(c, 70)}</g>`);
    const tagE = hanging(X, placeTag(c, tr('do Egiptu', 'into Egypt'), 19), { x: 0, y: 0, len: 600 });
    const tagW = hanging(X, placeTag(c, tr('aż ci powiem', 'until I tell you'), 17), { x: 0, y: 0, len: 600 });
    const sparks = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      flicker(room.lamp, T, 1 - es(t, 0.1, 0.5) * 0.6);
      pose(joseph, { x: JX, y: FLOOR + 6 });
      mary.set({ x: MX, y: FLOOR + 4, s: 1.1, armF: 46, armB: 30, head: 18, blink: 0 });
      child.set({ x: MX + 40, y: FLOOR - 32, s: 0.5, armF: 30, armB: 20, head: 20, lean: 8, blink: 0 });

      /* v13a — the angel of the Lord appears in the dream */
      const ak = es(t, 0.2, 0.7);
      vpose(glow, { x: AX + 30, y: 470, s: 0.4 + ak * 0.6, o: ak * 0.9 });
      const speak = bump(t, 1.0, 1.9) + bump(t, 2.0, 2.9) + bump(t, 3.0, 3.9);
      const point = es(t, 1.1, 1.35) * (1 - es(t, 1.9, 2.1));
      const warn = es(t, 3.1, 3.4);
      ang.set({ x: AX, y: FLOOR - 20 - ak * 20 + Math.sin(T * 1.3) * 3, s: 1.02, o: ak, armF: 30 + point * 100 + speak * 20 + warn * 50, armB: 20 + es(t, 2.1, 2.3) * (1 - es(t, 2.9, 3.1)) * 140 + warn * 60, head: 6 - point * 8, blink: blinkAt(T, 3) });
      sparks.forEach((sp, i) => {
        const k = es(t, 0.4 + i * 0.05, 0.7 + i * 0.05), a = T * 0.6 + i * 1.6;
        vpose(sp, { x: AX + Math.cos(a) * 110, y: 460 + Math.sin(a) * 140, s: k * 0.8, r: T * 30, o: k });
      });

      /* v13b–d — the dream: flee into Egypt; stay until I tell you; Herod will seek the Child */
      const dk = es(t, 1.05, 1.3, ease.back);
      vpose(dream, { x: 640, y: FLOOR - 70, s: dk, o: dk > 0.01 ? 1 : 0 });
      const dark = es(t, 3.05, 3.25);
      fade(egy, 1 - dark);
      fade(hrd, dark);
      const ek = es(t, 1.25, 1.5, ease.out) * (1 - es(t, 3.0, 3.15, ease.in));
      hangAt(tagE, 820, lerp(-500, 220, ek), T, ek > 0.001 ? 1 : 0, 1.2, 0.9, 2);
      const gk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 3.0, 3.1));
      vpose(glass, { x: 1030, y: 420, s: gk, r: es(t, 2.3, 2.9) * 180, o: gk > 0.01 ? 1 : 0 });
      const wk = es(t, 2.15, 2.4, ease.out) * (1 - es(t, 3.0, 3.15, ease.in));
      hangAt(tagW, 1030, lerp(-500, 320, wk), T, wk > 0.001 ? 1 : 0, 1.2, 0.9, 3);

      S.cam.x = lerp(-20, 20, es(t, 0.9, 1.3));
      S.cam.y = 40;
      S.cam.z = 1.06 + es(t, 0.9, 1.3) * 0.04;
    };
  },
};
