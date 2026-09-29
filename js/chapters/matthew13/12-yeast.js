// Mt 13,33 — the yeast, a small painted flat of a courtyard kitchen: a whitewashed wall with a door and a window,
// the clay oven glowing, three sacks of flour by a long kneading trough. A plate with a lump of leaven comes down for
// "another parable". The woman takes the leaven, tips in the three measures of flour one after another and hides
// the little lump deep in it. Then the sun moves on, and the whole trough swells: the dough rises, bubbles and
// domes up over the rim, all of it leavened, glowing warm.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { BAKER, trough, flourSack, leaven, oven, storeJar, discPlate, storyFrame, bubbleDot, hangAt, kf, moving, PI } from './lib.js';

const TX = 890, TY = 700;                 // the trough's foot
const SACKS = [[470, 704], [530, 712], [410, 716]];

export default {
  id: 'mt13-yeast',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 33, text: 'Powiedział im inną przypowieść:' },
    { v: 33, cont: true, text: '«Królestwo niebieskie podobne jest do zaczynu, który pewna kobieta wzięła i włożyła w trzy miary mąki,' },
    { v: 33, cont: true, text: 'aż się wszystko zakwasiło».' },
  ],
  cam: { x: [-30, 40], y: [0, 110], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    const MORN = ['#d6e3dc', '#f2e6cc', '#f8ead0'], NOONC = ['#e9d2a8', '#f5dfb8', '#f9ead0'];
    sky(S, MORN);
    const noonL = sky(S, NOONC, { name: 'noon' }).layer;
    noonL.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1180, y: 190, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 520, y: 150, len: 800 });

    /* the courtyard wall */
    const wall = S.layer({ par: 0.3, sh: 3 });
    const W = sheet();
    W.p(c.cut([[-900, 330], [2500, 330], [2500, 1700], [-900, 1700]], 0.8, 20), C.plaster);
    let bl = '';
    for (let y = 350; y < 640; y += 40) for (let x = -900 + ((y / 40) % 2 ? 50 : 0); x < 2500; x += 100) bl += c.ribbon([[x, y], [x + 90, y + c.rr(-1, 1)]], 1.2);
    W.x(bl, C.plaster2, 'opacity=".5"');
    W.p(c.cut(c.rect(-900, 318, 3400, 16), 0.4, 20), C.roof);
    W.p(c.cut([[-900, 540], [2500, 536], [2500, 660], [-900, 660]], 0.6, 20), mix(C.plaster2, C.clay, 0.3));
    W.x(c.ribbon([[-900, 540], [2500, 536]], 3), shade(mix(C.plaster2, C.clay, 0.3), -0.15));
    W.p(c.cut([[300, 640], [300, 470], ...c.arc(360, 470, 60, 50, PI, 2 * PI, 10), [420, 640]], 0.4, 6), C.wood2);
    W.p(c.cut(c.rect(1210, 420, 70, 60), 0.3, 5), C.soilDark);
    W.x(c.ribbon([[1210, 450], [1280, 450]], 3) + c.ribbon([[1245, 420], [1245, 480]], 3), C.wood2);
    wall.add(W.out());
    // a vine over the wall
    let vine = '';
    for (let i = 0; i < 14; i++) vine += c.cut(c.blob(560 + i * 34 + c.rr(-8, 8), 336 + c.rr(-8, 14), c.rr(14, 24), c.rr(10, 16), 9, 0.2), 0.6, 5);
    wall.add(sheet().p(vine, C.sage).out() + sheet().p(c.ribbon([[540, 334], [1040, 330]], 3), C.wood2).out());
    const floor = S.layer({ par: 0.42, sh: 3 });
    const fl = sheet().p(c.cut([[-900, 640], [2500, 640], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.stone, C.sand, 0.4));
    let tiles = '';
    for (let y = 660; y < 1000; y += 36) tiles += c.ribbon([[-900, y], [2500, y + c.rr(-2, 2)]], 1.4);
    fl.x(tiles, shade(C.stone2, -0.06), 'opacity=".5"');
    floor.add(fl.out());
    floor.add(`<g transform="translate(1320 660)">${storeJar(c, 70)}</g><g transform="translate(1380 666)">${storeJar(c, 54, C.clay)}</g><g transform="translate(250 668)">${storeJar(c, 62)}</g>`);

    /* the oven, the sacks, the trough */
    const props = S.layer({ par: 0.5, sh: 5 });
    const ovenEl = props.add(`<g transform="translate(1130 690)">${oven(c, 130, 110)}</g>`);
    const sacks = SACKS.map(([x, y], i) => ({ i, x, y, el: props.add(`<g>${flourSack(c, 64, 74, i === 1 ? C.linen : C.linen2)}</g>`) }));
    const Tr = trough(c, 340, 72);
    const flour = props.add(`<g>${sheet().p(c.cut([[-150, 0], ...c.arc(0, 0, 150, 46, PI, 2 * PI, 16), [150, 0]], 0.6, 5), '#fbf8f0').x(c.ribbon(c.arc(-30, -14, 60, 16, PI * 1.1, PI * 1.7, 8), 2), '#e9e1cf').out()}</g>`);
    const dough = props.add(`<g>${Tr.dough}</g>`);
    const box = props.add(`<g>${Tr.box}</g>`);
    const bubbles = Array.from({ length: 12 }, (_, i) => ({ i, el: props.add(`<g>${bubbleDot(c, 5 + (i % 3) * 2)}</g>`), dx: c.rr(-130, 130), dy: c.rr(20, 70), off: c.rr(0, 1) }));
    const glow = props.add(`<circle r="260" fill="url(#warm-glow)" opacity="0"/>`);
    const woman = S.puppet(props.add(person(c, { ...BAKER, holdF: `<g data-k="lump">${leaven(c, 10)}</g>` })));
    const lumpInHand = S.$('lump');
    const lump = props.add(`<g><circle r="30" fill="url(#warm-glow)"/>${leaven(c, 13)}</g>`);
    const streams = sacks.map((s, i) => props.add(`<path d="${c.ribbon(c.qbez([s.x + 44, s.y - 58], [lerp(s.x + 44, TX - 110 + i * 50, 0.6), s.y - 110], [TX - 110 + i * 50, TY - 70], 10), (u) => 9 - u * 3)}" fill="#f8f3e6" opacity="0"/>`));
    const measures = [0, 1, 2].map((i) => props.add(`<g><circle r="18" fill="url(#warm-glow)"/><text x="0" y="8" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="26" font-style="italic" fill="${C.ink}">${i + 1}</text></g>`));

    /* the plate */
    const plate = hanging(props, `<g transform="scale(1.3)">${discPlate(c, `<circle r="26" fill="url(#warm-glow)"/><g transform="scale(1.9)">${leaven(c, 12)}</g>`, { r: 54 })}</g>`, { x: 0, y: 0, len: 900 });
    storyFrame(S);

    const WK = [[0.35, 300], [0.95, 650], [1.2, 650]];

    return (t, time) => {
      const T = time;
      const noon = es(t, 2.0, 2.7);
      noonL.fade(noon);
      swing(sunEl, lerp(1180, 820, noon), lerp(190, 140, noon), T, 1, 0.6);
      swing(cl, 520 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);

      /* v33a — another parable: the leaven plate; the woman comes to the trough */
      const pl = es(t, 0.0, 0.3, ease.back) * (1 - es(t, 0.9, 1.15));
      hangAt(plate, 820, lerp(-400, 300, pl), T, 1.5, 0.8);
      const wx = kf(t, WK);
      const pourI = [1.2, 1.38, 1.56];
      const tilt = pourI.map((a) => bump(t, a, a + 0.2));
      const hide = bump(t, 1.72, 1.96);
      const joy = es(t, 2.55, 2.75);
      woman.set({
        x: wx, y: 708, s: 1.05, walk: moving(t, WK) ? wx * 0.05 : undefined,
        armF: 20 + es(t, 0.9, 1.1) * 40 + Math.max(...tilt) * 30 + hide * 50 + joy * 20, armB: 10 + Math.max(...tilt) * 60 + joy * 140,
        head: -es(t, 0.95, 1.15) * 6 + hide * 12 - joy * 10, lean: hide * 10, blink: blinkAt(T),
      });
      fade(lumpInHand, es(t, 1.0, 1.1) * (1 - seg(t, 1.8, 1.82)));

      /* v33b — three measures of flour, and the leaven hidden in it */
      sacks.forEach((s, i) => {
        pose(s.el, { x: s.x, y: s.y, r: tilt[i] * 40, ox: 0, oy: 0 });
        fade(streams[i], tilt[i] > 0.55 ? (tilt[i] - 0.55) / 0.45 : 0);
        const m = es(t, pourI[i] + 0.05, pourI[i] + 0.16, ease.back) * (1 - es(t, pourI[i] + 0.3, pourI[i] + 0.4));
        pose(measures[i], { x: s.x + 10, y: s.y - 120, s: m, o: m > 0.02 ? 1 : 0 });
      });
      const fillK = es(t, 1.22, 1.78);
      pose(flour, { x: TX, y: TY - 50, sy: Math.max(0.01, fillK), o: fillK > 0.01 ? 1 - es(t, 2.05, 2.2) : 0 });
      const lk = seg(t, 1.8, 1.95);
      const hx = wx + 60, hy = 620;
      pose(lump, { x: lerp(hx, TX + 10, lk), y: lerp(hy, TY - 76, lk) - Math.sin(lk * PI) * 40, s: 1 - es(t, 1.92, 2.0) * 0.8, o: lk > 0 && t < 2.0 ? 1 : 0 });

      /* v33c — until all of it was leavened */
      const rise = es(t, 2.02, 2.6);
      pose(dough, { x: TX, y: TY - 20, sy: 0.3 + rise * 1.3, sx: 1 + rise * 0.06, o: es(t, 2.0, 2.15) });
      pose(box, { x: TX, y: TY });
      bubbles.forEach((b) => {
        const k = ((T * 0.3 + b.off + t * 0.8) % 1);
        pose(b.el, { x: TX + b.dx * 0.9, y: TY - 20 - b.dy * (0.3 + rise * 1.3) * (1 - Math.abs(b.dx) / 300), s: rise * (0.4 + Math.sin(k * PI) * 0.8), o: rise > 0.05 ? Math.sin(k * PI) : 0 });
      });
      pose(glow, { x: TX, y: TY - 110, s: 0.5 + rise * 0.6, o: rise * 0.75 });
      pose(ovenEl, { x: 1130, y: 690 });

      S.cam.x = kf(t, [[0, 0], [0.9, -10], [1.2, 0], [2.0, 10], [2.6, 10]]);
      S.cam.z = kf(t, [[0, 1.02], [0.9, 1.1], [1.2, 1.2], [2.0, 1.2], [2.6, 1.14]]);
      S.cam.y = kf(t, [[0, 20], [0.9, 50], [1.2, 90], [2.0, 90], [2.6, 70]]);
    };
  },
};
