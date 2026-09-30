// Łk 11,33 — a painted flat: an inn by the road at nightfall, cut open, its doorway on the dark road. The innkeeper
// lights his lamp. "No one lights a lamp and puts it in a cellar or under a basket": two round pictures come down —
// the lamp shut away down in a dark cellar, the lamp smothered under an upturned grain measure — and each is struck
// through. "But on a lampstand, so that those who come in may see the light": he sets it high on the stand beside the
// door; its light pours out through the doorway across the dark road — and travellers coming along the road with their
// donkey see it, turn in and come through the door into the light.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, stars, moon } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { lampstand, bushel, clayLamp, roundel, crossX, manOf, womanOf, glow, rayBurst, headP, handAt, kf, moving, PI, NIGHT } from './lib.js';

const Y = 680;
const R = { x0: 700, x1: 1210, ceil: 380 };
const SX = 770;     // the lampstand, beside the door
const IX = 900;     // the innkeeper

export default {
  id: 'lk11-lamp',
  enter: 'fly',
  beats: [
    { v: 33, text: 'Nikt nie zapala światła i nie stawia go w ukryciu ani pod korcem,' },
    { v: 33, cont: true, text: 'lecz na świeczniku, aby jego blask widzieli ci, którzy wchodzą.' },
  ],
  cam: { x: [-60, 30], y: [-20, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    const skyL = S.layer({ par: 0.04, sh: 2 });
    skyL.add(stars(c, { x0: -600, x1: 2200, y0: -600, y1: 420, n: 100 }));
    const mn = hanging(skyL, moon(c, 30), { x: 0, y: -1500, len: 900 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 500, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillFar, C.night, 0.55) }).markup);
    const G = S.layer({ par: 0.36, sh: 3 });
    G.add(sheet().p(c.cut([[-1100, Y - 20], [2700, Y - 20], [2700, 1900], [-1100, 1900]], 0.6, 16), mix(C.sand2, C.night, 0.45)).p(c.ribbon([[-900, Y + 40], [200, Y + 26], [600, Y + 10], [720, Y + 4]], 60, 2), mix(C.sand, C.night, 0.35)).out());
    /* light spilling out of the door onto the road (behind people, over the ground) */
    const spillL = S.layer({ par: 0.38, sh: 0, flat: true });
    const spill = spillL.add(`<g opacity="0"><path d="${c.poly([[R.x0, Y - 150], [R.x0, Y + 10], [200, Y + 90], [140, Y - 20]])}" fill="#ffe7a8" opacity=".35"/><ellipse cx="${R.x0 - 160}" cy="${Y + 30}" rx="260" ry="50" fill="url(#halo-glow)"/></g>`);
    /* the inn, cut open */
    const H = S.layer({ par: 0.4, sh: 4 });
    const hs = sheet();
    hs.p(c.cut([[R.x0, R.ceil], [R.x1, R.ceil], [R.x1, Y + 4], [R.x0, Y + 4]], 0.6, 10), mix(C.plaster, C.night, 0.35));
    hs.p(c.cut([[R.x0 - 30, R.ceil - 34], [R.x1 + 30, R.ceil - 34], [R.x1 + 30, R.ceil + 4], [R.x0 - 30, R.ceil + 4]], 0.5, 10), mix(C.wood2, C.night, 0.25));
    hs.p(c.cut([[R.x0 - 16, R.ceil - 34], [R.x0 + 14, R.ceil - 34], [R.x0 + 14, 520], [R.x0 - 16, 520]], 0.5, 8) + c.cut([[R.x1 - 14, R.ceil - 34], [R.x1 + 16, R.ceil - 34], [R.x1 + 16, Y + 30], [R.x1 - 14, Y + 30]], 0.5, 8), mix(C.stone, C.night, 0.2));
    hs.p(c.cut([[R.x0 - 20, 510], [R.x0 + 18, 510], [R.x0 + 18, 522], [R.x0 - 20, 522]], 0.3, 6), C.wood2);
    hs.p(c.cut([[R.x0 - 10, Y - 6], [R.x1 + 10, Y - 6], [R.x1 + 14, Y + 30], [R.x0 - 14, Y + 30]], 0.5, 10), mix(C.sand2, C.night, 0.3));
    hs.p(c.cut(c.rect(1000, 470, 160, 8), 0.3, 5), C.wood);
    hs.p(c.cut([[1016, 470], [1010, 446], [1026, 436], [1042, 446], [1036, 470]], 0.3, 4) + c.cut([[1070, 470], [1064, 440], [1084, 430], [1100, 440], [1094, 470]], 0.3, 4), C.pot);
    H.add(hs.out());
    const lit = S.layer({ par: 0.4, sh: 0, flat: true });
    const roomLight = lit.add(`<g opacity="0"><circle r="420" fill="url(#warm-glow)" opacity=".7"/></g>`);
    const P = S.layer({ par: 0.42, sh: 5 });
    P.add(`<g transform="translate(${SX} ${Y})">${lampstand(c, 160)}</g>`);
    const lamp = P.add(`<g>${clayLamp(c)}</g>`);
    const flame = lamp.querySelector('.flame'), lglow = lamp.querySelector('.glow');
    const keeper = S.puppet(P.add(person(c, { robe: C.ochreRobe, mantle: null, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.ochre, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather })));
    /* the travellers and their donkey */
    const TR = [manOf(c, { robe: C.dustyBlue, mantle: C.clayMantle, hairStyle: 'wrap', veil: C.stone, beard: 'full', belt: C.rope }), womanOf(c, { robe: C.roseRobe, veil: C.wheat }), manOf(c, { robe: C.sageRobe, mantle: null, hairStyle: 'short', beard: 'short' })]
      .map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))) }));
    /* the two pictures of what nobody does */
    const hL = S.layer({ par: 0.2, sh: 6, rise: 0 });
    const cellarIn = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.plaster, C.night, 0.3)}"/>` + sheet().p(c.cut([[-90, -20], [90, -20], [90, -6], [-90, -6]], 0.4, 6), C.wood2).out()
      + `<rect x="-90" y="-6" width="180" height="100" fill="${mix(C.soilDark, C.night, 0.5)}"/>` + sheet().p(c.cut([[-40, -6], [-10, 30], [-10, 36], [-46, 0]], 0.3, 4), C.wood).out()
      + `<g transform="translate(20 62) scale(.7)">${clayLamp(c).replace(/r="150"/, 'r="40"')}</g>`;
    const basketIn = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.plaster, C.night, 0.3)}"/>` + sheet().p(c.cut([[-90, 40], [90, 40], [90, 90], [-90, 90]], 0.4, 6), mix(C.sand2, C.night, 0.3)).out()
      + `<g transform="translate(0 40) scale(-1 -1) translate(0 70)">${bushel(c, 90, 70)}</g>` + `<ellipse cx="0" cy="42" rx="44" ry="4" fill="#ffe7a8" opacity=".6"/>`;
    const plates = [cellarIn, basketIn].map((m, i) => ({ i, el: hanging(hL, `${roundel(c, m, { r: 66, id: S.id('pl' + i) })}<g data-k="x${i}" opacity="0">${crossX(c, 40)}</g>`, { x: 0, y: -1500, len: 1400 }) }));
    const xs = [S.$('x0'), S.$('x1')];

    return (t, time) => {
      const T = time;
      pose(mn, { x: 1250, y: 170, r: T ? Math.sin(T * 0.5) : 0 });
      /* he lights the lamp */
      const light = es(t, -0.1, 0.12);
      const toStand = es(t, 1.05, 1.28);
      const [hx, hy] = handAt(IX, Y, 1.0, true, 60);
      const lx = lerp(hx - 30, SX - 34, toStand), ly = lerp(hy + 6, Y - 166, toStand) - Math.sin(toStand * PI) * 40;
      pose(lamp, { x: lx, y: ly });
      pose(flame, { x: 35, y: -16, s: Math.max(0.05, light) * (1 + (T ? Math.sin(T * 9) * 0.06 : 0)), o: light });
      pose(lglow, { o: light * (0.6 + toStand * 0.4) });
      const KX = [[1.0, IX], [1.2, SX + 90]];
      const kx = kf(t, KX);
      keeper.set({ x: kx, y: Y, s: 1.0, flip: true, walk: moving(t, KX) ? kx * 0.06 : undefined, armF: 60 + toStand * 60 * (1 - es(t, 1.3, 1.45)), armB: 10 + es(t, 1.45, 1.6) * 60, head: -toStand * 10, blink: blinkAt(T, 3) });
      pose(roomLight, { x: SX, y: Y - 180, s: 0.6 + es(t, 1.25, 1.5) * 0.6, o: light * 0.35 + es(t, 1.25, 1.5) * 0.65 });
      pose(spill, { o: es(t, 1.3, 1.55) });
      /* v33a — not in a cellar, not under a basket */
      plates.forEach((p) => {
        const a = 0.12 + p.i * 0.18;
        const k = es(t, a, a + 0.25, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
        pose(p.el, { x: S.portrait ? (p.i ? 970 : 690) : p.i ? 1080 : 640, y: lerp(-500, S.portrait ? 200 : 270, k), r: T ? Math.sin(T * 0.8 + p.i) * 1.4 : 0, o: k > 0.004 ? 1 : 0 });
        const xk = es(t, a + 0.3, a + 0.38, ease.back);
        pose(xs[p.i], { s: Math.max(0.01, xk), o: xk > 0.01 ? 0.95 : 0 });
      });
      /* v33b — the travellers see the light and come in */
      TR.forEach((m) => {
        const K = [[1.2 + m.i * 0.05, 160 - m.i * 90], [1.62 + m.i * 0.05, 560 - m.i * 70], [1.9, 640 - m.i * 60 + (m.i === 0 ? 120 : 0)]];
        const x = kf(t, K);
        const see = es(t, 1.45, 1.6);
        m.p.set({ x, y: Y + 18 + (m.i % 2) * 6, s: 0.94, walk: moving(t, K) ? x * 0.06 + m.i : undefined, armF: 14 + see * (m.i === 0 ? 60 : 30), armB: 8, head: -see * 8, blink: blinkAt(T, 5 + m.i) });
      });

      S.cam.x = kf(t, [[-0.5, 0], [1.0, 0], [1.3, -40]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.0, 0], [1.3, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [1.0, 1.04], [1.3, 1.1]]);
    };
  },
};
