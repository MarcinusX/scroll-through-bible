// Mt 2,21–22 — Joseph gets up and they set out from Egypt: Mary on the donkey, the boy Jesus walking beside Joseph.
// Past the pyramids, over the sand, until the ground turns green: the land of Israel. At a fork in the road a
// traveller brings news — Archelaus reigns in Judea in his father's place — and his hard young face hangs over the
// road south. Joseph is afraid. Evening falls; he sleeps by the signpost, and in a dream the way to Galilee lights up.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { band, palm, olive, cypress, grass, rock, flowers, waterBand } from '../../assets/nature.js';
import { es, ease, bump, attr } from '../../core/anim.js';
import {
  LOOK, DESERT, DUSK, colt, coltRig, donkeyWithMary, childPerson, withBits, staff, pyramid, flatHouse, forkSign, folk,
  herodPuppet, bustMedal, dreamCloud, speech, crown, placeTag, hangAt, vpose, kf, moving, sparkle, tr, PI,
} from './lib.js';

const Y = 712;
const FORK = 1300;
const JK = [[0.0, 330], [1.0, 760], [1.95, 1120], [2.2, 1170]];

export default {
  id: 'mt2-return',
  beats: [
    { v: 21, text: 'On więc wstał, wziął Dziecię i Jego Matkę' },
    { v: 21, cont: true, text: 'i wrócił do ziemi Izraela.' },
    { v: 22, text: 'Lecz gdy posłyszał, że w Judei panuje Archelaos w miejsce ojca swego, Heroda, bał się tam iść.' },
    { v: 22, cont: true, text: 'Otrzymawszy zaś we śnie nakaz, udał się w strony Galilei.' },
  ],
  cam: { x: [-360, 360], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DESERT);
    const dusk = sky(S, DUSK, { name: 'dusk' });

    /* Egypt on the left, the land of Israel on the right */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 470, amps: [16, 6, 2], lens: [900, 340, 120], color: mix(C.hillFar, C.dune, 0.3), x0: -1600, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    const sfn = c.wave(560, [6, 3], [700, 200]);
    mid.add(`<g transform="translate(470 ${sfn(470) + 16})">${pyramid(c, 230, 150, mix(C.dune, C.sand, 0.2))}</g><g transform="translate(300 ${sfn(300) + 16})">${pyramid(c, 150, 90, mix(C.dune, C.sand, 0.45))}</g>`);
    mid.add(sheet().p(c.ridge(sfn, -1500, 1100, 1700, 12, 1), mix(C.sand, C.dune, 0.3)).out());
    const hfn = c.wave(545, [16, 6], [600, 200]);
    mid.add(sheet().p(c.cut([[980, 1700], ...Array.from({ length: 60 }, (_, i) => { const x = 980 + i * 35; return [x, hfn(x) + Math.max(0, 1 - i / 6) * 40]; }), [3000, 1700]], 1, 12), C.hillMid).out());
    let trees = '';
    [1180, 1330, 1500, 1640, 1800].forEach((x, i) => { trees += i % 2 ? cypress(c, x, hfn(x) + 6, 90) : olive(c, x, hfn(x) + 10, 0.55); });
    mid.add(trees);
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(Y - 40, [5, 2], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -1500, 3000, 1700, 12, 1), mix(C.sand, C.sand2, 0.5)).out());
    G.add(sheet().p(c.cut([[560, 1700], [700, 1100], [820, 860], [930, gfn(930)], ...Array.from({ length: 70 }, (_, i) => [960 + i * 30, gfn(960 + i * 30) - 1]), [3000, 1700]], 1, 12), mix(C.sage2, C.hillNear, 0.5)).out());
    G.add(sheet().p(c.ribbon([[-1500, Y + 4], [FORK, Y + 4], [2400, Y + 10]], 34, 2), mix(C.sand, C.cream, 0.35)).p(c.ribbon(c.qbez([FORK, Y + 4], [FORK + 60, Y - 30], [FORK + 20, gfn(FORK + 20) + 6], 10), (u) => 30 - u * 22), mix(C.sand, C.cream, 0.35)).out());
    G.add(flatHouse(c, 60, Y - 26, 220, 150, { wall: mix(C.clay, C.sand2, 0.5), wall2: mix(C.clay, C.sand2, 0.25), roofEdge: C.olive, door: C.soilDark }));
    G.add(palm(c, 330, gfn(330) + 20, 190) + palm(c, 600, gfn(600) + 20, 160) + rock(c, 960, gfn(960) + 30, 70, 34, C.rock2));
    G.add(grass(c, { x0: 900, x1: 2600, y: Y, fn: (x) => gfn(x) + 20, n: 40, h: 12, color: C.moss }) + flowers(c, { x0: 1000, x1: 1700, y: Y, fn: (x) => gfn(x) + 24, n: 14 }));
    G.add(`<g transform="translate(${FORK - 20} ${Y - 20})">${forkSign(c, tr('Galilea', 'Galilee'), tr('Judea', 'Judea'))}</g>`);
    const signGlow = G.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`);

    /* the family and the traveller */
    const P = S.layer({ par: 0.5, sh: 5 });
    const ride = donkeyWithMary(c, {});
    const donkey = coltRig(P.add(colt(c, { over: ride.saddle, rider: ride.rider })));
    const jEl = P.add(withBits(person(c, { ...LOOK.joseph, holdB: staff(c, 190, 30) }), c));
    const joseph = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');
    const jSit = S.puppet(P.add(person(c, { ...LOOK.joseph, pose: 'sit', eyes: 'closed' })));
    const kid = S.puppet(P.add(childPerson(c, { ...LOOK.child })));
    const kidSit = S.puppet(P.add(childPerson(c, { ...LOOK.child, pose: 'sit', eyes: 'closed' })));
    const trav = S.puppet(P.add(person(c, folk(c, true, { robe: C.ochreRobe, mantle: C.clayMantle }))));
    const duskL = S.layer({ par: 0.5, sh: 0, flat: true });
    duskL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.indigo}" opacity=".32"/>`);

    const X = S.layer({ par: 0.3, sh: 5 });
    const tagI = hanging(X, placeTag(c, tr('ziemia Izraela', 'the land of Israel'), 20), { x: 0, y: 0, len: 600 });
    const arch = hanging(X, bustMedal(c, S.id('arch'), herodPuppet(c, {}, LOOK.archelaus), { r: 54, face: mix(C.parchment, C.mauve, 0.3), rim: C.curtain2, label: tr('Archelaos w Judei', 'Archelaus in Judea'), size: 16 }), { x: 0, y: 0, len: 700 });
    const news = X.add(`<g>${speech(c, `<g transform="scale(1.2)">${crown(c)}</g>`, { w: 70, h: 54, flip: true })}</g>`);
    const lake = `<path d="${c.ridge(c.wave(-10, [10, 4], [120, 50]), -160, 160, 80, 8, 0.6)}" fill="${C.hillMid}"/>${waterBand(c, { y: 20, color: C.lake, x0: -160, x1: 160, bottom: 50, foamN: 4 }).markup}<path d="${c.ridge(c.wave(52, [5, 2], [100, 40]), -160, 160, 90, 8, 0.6)}" fill="${C.hillNear}"/><path d="${c.cut([[20, 26], [70, 26], [62, 36], [28, 36]], 0.3, 4)}" fill="${C.wood}"/><path d="${c.cut([[44, 26], [44, -8], [64, 20]], 0.3, 4)}" fill="${C.sail}"/>`;
    const dream = X.add(`<g>${dreamCloud(c, lake, { w: 340, h: 210, dx: 150, dy: -170 })}</g>`);
    const tagG = hanging(X, placeTag(c, tr('w strony Galilei', 'into the region of Galilee'), 18), { x: 0, y: 0, len: 600 });
    const sparks = [0, 1, 2].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      /* v21 — they set out from Egypt and come into the land of Israel */
      const jx = kf(t, JK, ease.sine);
      const walking = moving(t, JK, 0.3);
      const fear = es(t, 2.35, 2.6);
      const sleep = es(t, 3.2, 3.28);
      joseph.set({ x: jx, y: Y + 4, s: 0.92, o: 1 - sleep, walk: walking ? jx * 0.06 : undefined, armF: 30 - fear * 10, armB: 30 + fear * 40, head: -fear * 6, lean: -fear * 6, blink: blinkAt(T, 2) });
      attr(jSad, 'opacity', (fear * (1 - es(t, 3.0, 3.2))).toFixed(2));
      kid.set({ x: jx - 70, y: Y + 10, s: 0.56, o: 1 - sleep, walk: walking ? jx * 0.1 : undefined, armF: 60 + fear * 20, armB: 20, head: -8 - fear * 6, blink: blinkAt(T, 4) });
      jSit.set({ x: FORK - 80, y: Y + 6, s: 0.92, o: sleep, armF: 30, armB: 20, head: 18, lean: -4 });
      kidSit.set({ x: FORK - 140, y: Y + 12, s: 0.52, o: sleep, armF: 30, head: 20 });
      const dx = jx - 230;
      donkey.set({ x: dx, y: Y + 10, s: 0.95, walk: walking ? dx * 0.05 : undefined, nod: walking ? 0 : Math.sin(T * 0.8) * 3 });
      const ik = es(t, 1.3, 1.6, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      hangAt(tagI, 1000, lerp(-500, 280, ik), T, ik > 0.001 ? 1 : 0, 1.2, 0.9, 1);

      /* v22a — news of Archelaus; Joseph is afraid to go on to Judea */
      const tx = kf(t, [[1.9, 1700], [2.25, 1360], [2.9, 1380], [3.1, 1800]], ease.io);
      trav.set({ x: tx, y: Y + 8, s: 0.9, flip: t < 2.9, walk: moving(t, [[1.9, 1700], [2.25, 1360], [2.9, 1380], [3.1, 1800]]) ? tx * 0.06 : undefined, armF: bump(t, 2.2, 2.8) * 80, armB: 10, head: 4, blink: blinkAt(T, 5) });
      const nk = es(t, 2.2, 2.35, ease.back) * (1 - es(t, 2.85, 2.95));
      vpose(news, { x: 1350, y: Y - 196, s: nk, o: nk > 0.01 ? 1 : 0 });
      const ak = es(t, 2.25, 2.55, ease.out) * (1 - es(t, 3.05, 3.2, ease.in));
      hangAt(arch, 1150, lerp(-500, 220, ak), T, ak > 0.001 ? 1 : 0, 1.1, 0.8, 3);

      /* v22b — evening; the warning in a dream; the road to Galilee lights up */
      const eve = es(t, 3.0, 3.3);
      dusk.layer.fade(eve);
      duskL.fade(eve);
      const dk = es(t, 3.25, 3.45, ease.back);
      vpose(dream, { x: FORK - 330, y: Y - 150, s: dk, o: dk > 0.01 ? 1 : 0 });
      const gk = es(t, 3.4, 3.6);
      vpose(signGlow, { x: FORK - 80, y: Y - 153, s: 0.5 + gk * 0.6, o: gk });
      const tg = es(t, 3.45, 3.7, ease.out);
      hangAt(tagG, 1010, lerp(-500, 260, tg), T, tg > 0.001 ? 1 : 0, 1.2, 0.9, 4);
      sparks.forEach((sp, i) => {
        const k = es(t, 3.5 + i * 0.05, 3.7 + i * 0.05), a = T + i * 2.1;
        vpose(sp, { x: FORK - 80 + Math.cos(a) * 70, y: Y - 150 + Math.sin(a) * 40, s: k * 0.7, r: T * 30, o: k });
      });

      S.cam.x = kf(t, [[0, -330], [1.0, -60], [1.95, 280], [2.3, 330]], ease.sine);
      S.cam.y = 30;
      S.cam.z = 1.02 + es(t, 3.0, 3.4) * 0.04;
    };
  },
};
