// Mk 11,11 — into the Temple courts: Jesus looks around at everything (a warm glow follows His gaze
// over the money tables, the dove cages, the sanctuary); evening falls, lamps are lit,
// and He goes out to Bethany with the Twelve.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { stars, moon } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, courtFront, changerTable, coinStack, balance, cage, smallDove, bench, lamb, lantern, townsfolk, TWELVE_O, signpost, basketProp, jarProp } from './lib.js';

const PI = Math.PI;
const FLOOR = 676;
const JX = 790;

export default {
  id: 'm11-temple',
  beats: [
    { v: 11, text: 'Tak przybył do Jerozolimy i wszedł do świątyni.' },
    { v: 11, cont: true, text: 'Obejrzał wszystko,' },
    { v: 11, cont: true, text: 'a że pora była już późna, wyszedł razem z Dwunastoma do Betanii.' },
  ],
  cam: { x: [-80, 130], y: [-60, 40], z: [0.95, 1.12] },
  build(S) {
    const c = S.c;
    const DAY = ['#d3e2dc', '#f2e6c8', '#f8ebd3'], DUSK = ['#6f6a9a', '#d99a86', '#f0b88e'];
    const T0 = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 820, sunAt: [1200, 150] });
    const { sk, sunEl, cl1 } = T0;
    // night: stars and the moon over the courts
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 110 }));
    const moonL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(moonL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 34)}`, { x: 1010, y: 140, len: 800 });

    /* ---------- the market in the court ---------- */
    const mk = S.layer({ par: 0.46, sh: 4 });
    const TB = [[1010, FLOOR - 10], [1200, FLOOR - 14]];
    TB.forEach(([x, y], i) => {
      mk.add(`<g transform="translate(${x} ${y})">${changerTable(c, 150)}</g>`);
      mk.add(`<g transform="translate(${x - 40} ${y - 60})">${coinStack(c, 5, 9)}</g><g transform="translate(${x - 12} ${y - 60})">${coinStack(c, 3, 9)}</g><g transform="translate(${x + 34} ${y - 60})">${balance(c)}</g>`);
    });
    mk.add(`<g transform="translate(1390 ${FLOOR - 6})">${bench(c, 150, 36)}</g>`);
    const cages = [[1350, FLOOR - 42], [1426, FLOOR - 42]].map(([x, y]) => mk.add(`<g transform="translate(${x} ${y})">${cage(c, 64, 56)}<g transform="translate(-6 -6) scale(.8)">${smallDove(c)}</g></g>`));
    mk.add(`<g transform="translate(1290 ${FLOOR + 16}) scale(.8)">${lamb(c)}</g><g transform="translate(1480 ${FLOOR + 18}) scale(-.75 .75)">${lamb(c)}</g>`);
    mk.add(`<g transform="translate(1245 ${FLOOR - 4})">${basketProp(c, 50)}</g><g transform="translate(935 ${FLOOR - 10})">${jarProp(c)}</g>`);
    // worshippers at the balustrade of the inner court
    const pray = [[640, 0], [700, 1], [930, 2]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(mk.add(person(c, townsfolk(c)))) }));
    // traders packing up as the day ends
    const traders = [[1100, FLOOR - 4, true], [1320, FLOOR + 2, false], [1250, FLOOR - 2, true]].map(([x, y, flip], i) => ({ x, y, flip, i, seed: c.rr(0, 9), p: S.puppet(mk.add(person(c, townsfolk(c, { man: true })))) }));
    // lamps under the porticoes
    const lampL = S.layer({ par: 0.3, sh: 3 });
    const lamps = [220, 360, 1260, 1420, 1560].map((x, i) => ({ x, el: lampL.add(`<g transform="translate(${x} ${FLOOR - 270})">${lantern(c, { col: C.apricot })}</g>`) }));
    lamps.forEach((l) => { l.glow = l.el.querySelector('.glow'); l.body = l.el; });

    /* ---------- the gaze: a warm glow that travels over what He looks at ---------- */
    const gazeL = S.layer({ par: 0.46, sh: 1, flat: true });
    const gaze = gazeL.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`);
    const sanctGlow = S.layer({ par: 0.16, sh: 1, flat: true }).add(`<g><circle r="260" fill="url(#halo-glow)"/></g>`);

    /* ---------- Jesus and the Twelve ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const twelve = TWELVE_O.map((o, i) => {
      const row = i % 2;
      return { o, i, row, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))), x: 700 - Math.floor(i / 2) * 52 - row * 22, y: FLOOR - 16 - row * 16 + (i % 3) * 3 };
    });
    // the back row drawn first
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* ---------- dusk ---------- */
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2a2656"/>`);
    const signL = S.layer({ par: 0.6, sh: 5 });
    const sign = signL.add(`<g>${signpost(c, tr('do Betanii', 'to Bethany'), { size: 18, dir: -1 })}</g>`);
    courtFront(S);

    return (t, time) => {
      const T = time;
      const dusk = es(t, 2.0, 2.45);
      sk.blend(DAY, DUSK, dusk);
      tint.fade(dusk * 0.28);
      starL.fade(es(t, 2.3, 2.7) * 0.9);
      swing(sunEl, 1200, 150 + dusk * 520, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);
      swing(moonEl, 1010, 140 - (1 - es(t, 2.3, 2.8)) * 700, T, 0.8, 0.5, 1);

      /* he arrives with the Twelve */
      const inK = es(t, 0.0, 0.7, ease.out);
      const out = es(t, 2.45, 2.98, ease.in);
      const jx = lerp(260, JX, inK) - out * 760;
      // looking around: right to the tables, up to the sanctuary, left to the cages
      const lookR = es(t, 1.0, 1.12) * (1 - es(t, 1.95, 2.05));
      const lookUp = es(t, 1.3, 1.4) * (1 - es(t, 1.52, 1.62));
      const lookL = 0;
      const lookFar = es(t, 1.6, 1.72) * (1 - es(t, 1.95, 2.05));
      const flip = out > 0.02 || lookL > 0.5;
      jesus.set({
        x: jx, y: FLOOR, s: 1.02, flip,
        walk: (inK > 0 && inK < 1) || (out > 0 && out < 1) ? jx * 0.05 : undefined,
        head: -lookUp * 22 + lookR * 4, armF: lookR * 40 * (1 - lookUp) + lookL * 40 + bump(t, 2.2, 2.5) * 60, armB: bump(t, 0.7, 1.0) * 20, blink: blinkAt(T),
      });
      twelve.forEach((d) => {
        const x = d.x - (1 - inK) * 560 - out * 820 + (out > 0 ? d.i * 6 : 0);
        const look = lookUp * (d.i % 3 === 0 ? 1 : 0.5);
        d.p.set({ x, y: d.y, s: 0.86 - d.row * 0.04, flip: out > 0.02, walk: (inK > 0 && inK < 1) || (out > 0 && out < 1) ? x * 0.05 + d.i : undefined, head: -look * 16, armF: look * (d.i % 4 === 1 ? 70 : 0), blink: blinkAt(T, d.seed), o: 1 - seg(t, 2.9, 3) });
      });
      // the gaze glow
      const gx = lerp(lerp(JX, 1110, lookR) + lookFar * 280, 820, lookUp);
      const gy = lerp(FLOOR - 70, 360, lookUp);
      pose(gaze, { x: gx, y: gy, s: 1.1 + lookUp * 0.6, o: lookR * 0.9 * (1 - lookUp) });
      pose(sanctGlow, { x: 820, y: 400, s: 0.8 + lookUp * 0.3, o: lookUp * 0.9 });

      pray.forEach((m) => m.p.set({ x: m.x, y: 632, s: 0.62, flip: true, armB: 140, armF: 70, head: -12, blink: blinkAt(T, m.seed), o: 1 - es(t, 2.1, 2.4) }));
      traders.forEach((m) => {
        const pack = es(t, 2.1 + m.i * 0.06, 2.4 + m.i * 0.06);
        const inset = S.portrait ? [-110, 0, -200][m.i] : 0;   // phone: the near traders stand clear of the progress thread (the far one stays off-screen)
        m.p.set({ x: m.x + inset + pack * (m.flip ? 60 : -60), y: m.y, s: 0.9, flip: pack > 0.5 ? !m.flip : m.flip, walk: pack > 0 && pack < 1 ? t * 30 + m.i : undefined, armF: 30 + bump(t, 1.0, 1.6) * 20, head: lookR * (m.i === 0 ? 10 : 0), blink: blinkAt(T, m.seed), o: 1 - es(t, 2.5, 2.8) });
      });
      lamps.forEach((l, i) => {
        const lit = es(t, 2.12 + i * 0.05, 2.25 + i * 0.05);
        fade(l.glow, lit);
        swing(l.el, l.x, FLOOR - 270, T, 1.4, 0.9, i);
      });
      pose(sign, { x: S.portrait ? 590 : 470, y: FLOOR + 30,   // phone: the signpost stands inside the screen
      o: es(t, 2.3, 2.5), s: 1 });

      S.cam.x = -20 + es(t, 0, 0.7) * 20 + lookR * 60 * (1 - lookUp) + lookFar * 60 - es(t, 2.45, 2.98) * 60;
      S.cam.y = 10 - lookUp * 50 + es(t, 2.45, 2.98) * 20;
      S.cam.z = 1.04 - lookUp * 0.06 - es(t, 2.0, 2.4) * 0.04;
    };
  },
};
