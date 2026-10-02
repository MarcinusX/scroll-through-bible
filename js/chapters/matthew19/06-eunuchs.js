// Mt 19,11–12 — the light turns golden; the disciples sit round Him on the ground. "Not all can receive this word,
// only those to whom it is given": small lights come down onto some of them. Then three painted flats come down one
// by one: a cradle under a star (so from their mother's womb), a king's door with its keeper (made so by men), and
// one who kneels with a lamp before the gate of the Kingdom, a lily beside him (for the kingdom of heaven).
// "Let the one who can receive it, receive it!" — He opens His hands; the third flat shines.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix, hanging, swing } from '../kit.js';
import { olive, bush, rock } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, TWELVE, panel, cradle, palaceDoor, KEEPER, keys, lily, kingdomGate, glowLamp, spark, headAt, throng, tr } from './lib.js';

const GY = 672;
const JX = 800;
const GOLDEN = ['#d8c8b4', '#f1d4a4', '#f7e2b8'];
const PX_WIDE = [592, 810, 1028];
const PX_TALL = [588, 798, 1008];   // phone: the third flat clear of the thread

export default {
  id: 'mt19-eunuchs',
  beats: [
    { v: 11 },
    { v: 12, text: 'Bo są niezdatni do małżeństwa, którzy z łona matki takimi się urodzili;' },
    { v: 12, cont: true, text: 'i są niezdatni do małżeństwa, których ludzie takimi uczynili;' },
    { v: 12, cont: true, text: 'a są i tacy bezżenni, którzy dla królestwa niebieskiego sami zostali bezżenni.' },
    { v: 12, cont: true, text: 'Kto może pojąć, niech pojmuje!»' },
  ],
  cam: { x: [-40, 40], y: [-40, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const PX = S.portrait ? PX_TALL : PX_WIDE;
    const R = roadSet(S, { skyCols: GOLDEN, jer: 0.13, jerX: 1210, roadX: 800, trees: 16, sunAt: [1260, 250], clouds: [[420, 150, 170], [1120, 120, 120]] });
    const side = S.layer({ par: 0.3, sh: 3 });
    side.add(olive(c, 300, 604, 1.1) + olive(c, 1400, 606, 0.95) + bush(c, 1300, 610, 70, C.sage, C.moss));

    /* the three painted flats */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const glow3 = hangL.add(`<g opacity="0">${rays(c, { n: 16, r0: 60, r1: 320, spread: 0.06, color: '#fff3cf' })}<circle r="170" fill="url(#halo-glow)"/></g>`);
    const keeper = `<g transform="translate(-58 0) scale(.46)">${person(c, { ...KEEPER, holdF: keys(c) })}</g>`;
    const kneeler = `<g transform="translate(-26 0) scale(.5)">${person(c, { robe: C.sageRobe, mantle: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, pose: 'kneel', holdF: `<g transform="rotate(70)">${glowLamp(c, 0.9)}</g>` }).replace('<g class="armFr">', '<g class="armFr" transform="rotate(-70)">')}</g>`;
    const FLATS = [
      { inner: `<g transform="scale(.92)">${cradle(c)}</g>`, face: mix(C.dawn, C.skyVeil, 0.4), ground: mix(C.wood3, C.sand, 0.5), word: tr('z łona matki', 'from the womb') },
      { inner: `<g transform="translate(26 0) scale(.72)">${palaceDoor(c)}</g>${keeper}`, face: mix(C.parchment, C.lavender, 0.3), ground: mix(C.stone2, C.sand, 0.4), word: tr('przez ludzi', 'by men') },
      { inner: `<g transform="translate(44 0) scale(.78)">${kingdomGate(c, 46, 110)}</g><g transform="translate(-72 0) scale(.72)">${lily(c)}</g>${kneeler}`, face: mix(C.skyBlue, C.halo, 0.35), ground: mix(C.hillNear, C.sage2, 0.4), word: tr('dla królestwa', 'for the Kingdom') },
    ].map((f, i) => ({ ...f, i, el: hanging(hangL, panel(c, f.inner, { w: 206, h: 196, face: f.face, ground: f.ground, word: f.word }), { x: PX[i], y: 120, len: 900 }) }));

    /* listeners behind, and the disciples sitting round Him */
    const back = S.layer({ par: 0.42, sh: 3 });
    back.sprite(throng(c, 6, { s: 0.48, spread: 32, rows: 1, face: 0, arms: [0, 20] }), S.portrait ? 1330 : 1200, 614);   // phone: just off the edge, not one sliced listener under the thread
    const pL = S.layer({ par: 0.5, sh: 5 });
    const SEAT = [
      { d: TWELVE[3], x: 540, y: GY - 6, f: false }, { d: TWELVE[2], x: 630, y: GY + 16, f: false }, { d: TWELVE[0], x: 690, y: GY + 44, f: false },
      { d: TWELVE[1], x: 920, y: GY + 40, f: true }, { d: TWELVE[7], x: 990, y: GY + 12, f: true }, { d: TWELVE[6], x: 1070, y: GY - 8, f: true },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), s: 0.84, p: S.puppet(pL.add(person(c, { ...m.d.o, pose: 'sit' }))) }));
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 5 });
    const GIFT = [1, 4];
    const gifts = SEAT.map(() => fx.add(`<g opacity="0">${spark(c, 12)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 190, 990, 220, C.sage, C.moss) + rock(c, 1410, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 30 });

      /* Jesus teaching */
      const speak = es(t, 0.02, 0.25);
      const open = es(t, 4.02, 4.3);
      const toFlat = (k) => bump(t, k + 0.05, k + 0.95);
      jesus.set({
        x: JX, y: GY, s: 1.02, flip: false,
        armF: 20 + speak * 40 * (1 - open) + (toFlat(1) + toFlat(2) + toFlat(3)) * 40 + open * 50, armB: speak * 30 * (1 - open) + (toFlat(1) * 1.2 + toFlat(2) * 1.4 + toFlat(3) * 1.2) * 60 + open * 110,
        head: -4 - (toFlat(1) + toFlat(2) + toFlat(3)) * 5 + Math.sin(T * 0.6) * 1.2, blink: blinkAt(T),
      });
      SEAT.forEach((m) => {
        const look = es(t, 1.0, 1.3);
        const recv = GIFT.includes(m.i) ? bump(t, 0.4, 1.0) + es(t, 4.2, 4.5) : es(t, 4.3 + m.i * 0.04, 4.55 + m.i * 0.04) * 0.7;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.f, armF: 26 + recv * 50, armB: recv * 40, head: -6 - look * 8 + recv * -4, blink: blinkAt(T, m.seed) });
        const [hx, hy] = headAt(m.x, m.y, m.s, m.f, 'sit');
        const g = GIFT.includes(m.i) ? es(t, 0.3, 0.7) : es(t, 4.25 + m.i * 0.05, 4.6 + m.i * 0.05);
        pose(gifts[m.i], { x: hx, y: lerp(hy - 260, hy - 36, g), s: 0.6 + g * 0.5, r: T * 30, o: g > 0.01 ? 1 : 0 });
      });

      /* the three flats, one per beat */
      FLATS.forEach((f) => {
        const k = es(t, 1.0 + f.i - 0.05, 1.3 + f.i, ease.back);
        swing(f.el, PX[f.i], 160 - (1 - k) * 1100, T, 1.1, 0.7, f.i);
      });
      const shine = es(t, 3.2, 3.6) * 0.5 + open * 0.5;
      pose(glow3, { x: PX[2], y: 258, s: 0.7 + shine * 0.4, r: t * 8, o: shine });

      S.cam.z = 1 + es(t, 0.8, 1.2) * 0.02 + es(t, 3.9, 4.4) * 0.03;
      S.cam.y = -es(t, 0.8, 1.2) * 26;
      S.cam.x = -es(t, 0.8, 1.2) * 25 * (1 - es(t, 1.8, 2.2)) + es(t, 2.8, 3.2) * 30 * (1 - es(t, 3.9, 4.3));
    };
  },
};
