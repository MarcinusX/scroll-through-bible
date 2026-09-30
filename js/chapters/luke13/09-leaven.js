// Łk 13,20–21 — the leaven, a flat of a house at first light: a whitewashed room with a small window, a shelf of jars,
// the clay oven already glowing, the long kneading trough on its trestle, three sacks of flour by the wall. "To what
// shall I compare the kingdom of God?" — the crown of the Kingdom comes down again with its question. "It is like
// leaven, which a woman took" — she takes a small lump from a jar on the shelf — "and hid in three measures of flour":
// one, two, three sacks tip their flour into the trough, and she pushes the lump deep down out of sight; "until it was
// all leavened": the whole trough swells and rises over its rim, bubbling, warm and glowing.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import {
  BAKER13, kingdomDisc, question, kneadTrough, flourSack, leaven, oven, storeJar, bubbleDot, numDisc, onString, kf, moving,
  es, ease, bump, seg, PI,
} from './lib.js';

const TX = 880, TY = 690;
const SACKS = [[470, 692], [540, 702], [410, 708]];

export default {
  id: 'lk13-leaven',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 20 },
    { v: 21 },
  ],
  cam: { x: [-20, 30], y: [20, 90], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, ['#e4d4bd', '#f0e0c4', '#f6e8cf']);
    /* the room */
    const wall = S.layer({ par: 0.3, sh: 3 });
    const W = sheet();
    const win = [[1090, 330], [1190, 330], [1190, 430], [1090, 430]];
    W.p(c.cut([[-900, -900], [2500, -900], [2500, 1700], [-900, 1700]], 0.6, 40) + c.hole(win, 0.3, 6), mix(C.plaster, C.parchment, 0.3));
    let bl = '';
    for (let y = 220; y < 640; y += 44) for (let x = -900 + ((y / 44) % 2 ? 60 : 0); x < 2500; x += 120) bl += c.ribbon([[x, y], [x + 104, y + c.rr(-1, 1)]], 1.2);
    W.x(bl, C.plaster2, 'opacity=".45"');
    W.p(c.cut([[-900, 560], [2500, 556], [2500, 650], [-900, 650]], 0.5, 20), mix(C.plaster2, C.clay, 0.25));
    W.p(c.cut(c.rect(1080, 322, 120, 10), 0.3, 5) + c.cut(c.rect(1080, 430, 120, 10), 0.3, 5), C.wood2);
    // the shelf with jars
    W.p(c.cut(c.rect(560, 490, 240, 10), 0.3, 6), C.wood2);
    wall.add(`<g><rect x="1090" y="330" width="100" height="100" fill="${mix(C.dawn, C.skyBlue, 0.4)}"/></g>`);
    wall.add(W.out() + `<g transform="translate(600 490)">${storeJar(c, 54)}</g><g transform="translate(680 490)">${storeJar(c, 44, C.clay)}</g><g transform="translate(760 490)">${storeJar(c, 50)}</g>`);
    const shaft = wall.add(`<g><path d="${c.poly([[1090, 334], [1190, 334], [1100, 700], [930, 700]])}" fill="${C.lampGlow}" opacity=".22"/></g>`);
    const floor = S.layer({ par: 0.42, sh: 3 });
    const fl = sheet().p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.stone, C.sand, 0.4));
    let tiles = '';
    for (let y = 660; y < 1000; y += 36) tiles += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.4);
    fl.x(tiles, shade(C.stone2, -0.06), 'opacity=".5"');
    floor.add(fl.out());
    /* the oven, the sacks, the trough */
    const props = S.layer({ par: 0.5, sh: 5 });
    props.add(`<g transform="translate(1180 680)">${oven(c, 130, 110)}</g>`);
    const sacks = SACKS.map(([x, y], i) => ({ i, x, y, el: props.add(`<g>${flourSack(c, 64, 74, i === 1 ? C.linen : C.linen2)}</g>`) }));
    const Tr = kneadTrough(c, 330, 70);
    const flour = props.add(`<g opacity="0">${sheet().p(c.cut([[-146, 0], ...c.arc(0, 0, 146, 44, PI, 2 * PI, 16), [146, 0]], 0.6, 5), '#fbf8f0').x(c.ribbon(c.arc(-30, -14, 60, 16, PI * 1.1, PI * 1.7, 8), 2), '#e9e1cf').out()}</g>`);
    const glow = props.add(`<g opacity="0"><circle r="230" fill="url(#warm-glow)"/></g>`);
    const dough = props.add(`<g opacity="0">${Tr.dough}</g>`);
    const box = props.add(`<g>${Tr.box}</g>`);
    const bubbles = Array.from({ length: 10 }, (_, i) => ({ i, el: props.add(`<g opacity="0">${bubbleDot(c, 5 + (i % 3) * 2)}</g>`), dx: c.rr(-120, 120), dy: c.rr(20, 60), off: c.rr(0, 1) }));
    const woman = S.puppet(props.add(person(c, { ...BAKER13, holdF: `<g data-k="lump13">${leaven(c, 10)}</g>` })));
    const lumpIn = S.$('lump13');
    const lump = props.add(`<g opacity="0"><circle r="26" fill="url(#warm-glow)"/>${leaven(c, 12)}</g>`);
    const streams = sacks.map((s, i) => props.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([s.x + 44, s.y - 58], [lerp(s.x + 44, TX - 110 + i * 50, 0.6), s.y - 110], [TX - 110 + i * 50, TY - 70], 10), (u) => 9 - u * 3)}" fill="#f8f3e6"/></g>`));
    const nums = [0, 1, 2].map((i) => props.add(`<g opacity="0">${numDisc(c, String(i + 1), { r: 18 })}</g>`));

    /* the Kingdom and its question */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const kd = fx.add(`<g>${onString(`<g transform="translate(0 50)">${kingdomDisc(c, 44)}</g>`)}</g>`);
    const q = fx.add(`<g opacity="0">${question(c)}</g>`);

    const WK = [[0.2, 1500], [0.7, 700], [1.0, 700], [1.08, 660], [1.2, 780], [1.62, 780], [1.74, 680]];

    return (t, time) => {
      const T = time;
      pose(shaft, { o: 0.6 + es(t, 0, 1.8) * 0.4 });

      /* v20 — to what shall I compare the Kingdom? */
      const kk = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      const ky = lerp(-800, 160, kk);
      pose(kd, { x: 820, y: ky + (T ? Math.sin(T * 0.8) * 2 : 0) });
      const qk = es(t, 0.35, 0.5, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(q, { x: 940, y: ky + 100 + (T ? Math.sin(T * 2) * 3 : 0), s: qk * 1.3, o: qk > 0.02 ? 1 : 0 });

      /* v21 — she takes the leaven from the jar, three measures of flour, hides it; all of it rises */
      const wx = kf(t, WK);
      const take = bump(t, 1.0, 1.14);
      const pours = [1.16, 1.26, 1.36];
      const tilt = pours.map((a) => bump(t, a, a + 0.12));
      const hide = bump(t, 1.46, 1.58);
      const joy = es(t, 1.72, 1.85);
      woman.set({ x: wx, y: TY + 10, s: 1.04, flip: wx > 800 && t < 1.1, walk: moving(t, WK) ? wx * 0.05 : undefined, armF: 20 + take * 110 + Math.max(...tilt) * 30 + hide * 60 + joy * 10, armB: 10 + Math.max(...tilt) * 50 + joy * 140, head: -take * 14 + hide * 12 - joy * 10, lean: hide * 10, blink: blinkAt(T) });
      pose(lumpIn, { o: es(t, 1.06, 1.1) * (1 - seg(t, 1.52, 1.54)) });
      sacks.forEach((s, i) => {
        pose(s.el, { x: s.x, y: s.y, r: tilt[i] * 40 });
        pose(streams[i], { o: tilt[i] > 0.5 ? (tilt[i] - 0.5) * 2 : 0 });
        const m = es(t, pours[i] + 0.02, pours[i] + 0.08, ease.back) * (1 - es(t, 1.6, 1.7));
        pose(nums[i], { x: s.x + 6, y: s.y - 118, s: m, o: m > 0.02 ? 1 : 0 });
      });
      const fillK = es(t, 1.18, 1.46);
      pose(flour, { x: TX, y: TY - 50, sy: Math.max(0.01, fillK), o: fillK > 0.01 ? 1 - es(t, 1.6, 1.7) : 0 });
      const lk = seg(t, 1.52, 1.6);
      pose(lump, { x: lerp(wx + 70, TX + 10, lk), y: lerp(TY - 90, TY - 76, lk) - Math.sin(lk * PI) * 30, s: 1 - es(t, 1.58, 1.62) * 0.8, o: lk > 0 && t < 1.63 ? 1 : 0 });
      const rise = es(t, 1.6, 1.8);
      pose(dough, { x: TX, y: TY - 20, sy: 0.3 + rise * 1.3, sx: 1 + rise * 0.06, o: es(t, 1.58, 1.64) });
      pose(box, { x: TX, y: TY });
      bubbles.forEach((b) => {
        const k = (T * 0.3 + b.off + t * 0.8) % 1;
        pose(b.el, { x: TX + b.dx, y: TY - 20 - b.dy * (0.3 + rise * 1.3) * (1 - Math.abs(b.dx) / 300), s: rise * (0.4 + Math.sin(k * PI) * 0.8), o: rise > 0.05 ? Math.sin(k * PI) : 0 });
      });
      pose(glow, { x: TX, y: TY - 110, s: 0.5 + rise * 0.6, o: rise * 0.7 });

      S.cam.x = kf(t, [[0, 0], [1.0, 10], [1.8, 20]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 70], [1.8, 70]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.12], [1.8, 1.14]]);
    };
  },
};
