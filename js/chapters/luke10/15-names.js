// Łk 10,20 — the same knoll under the stars. "Yet do not rejoice in this, that the spirits are subject to you": the
// little pictures of the fleeing spirits float up once more over the disciples' heads — and Jesus, smiling, lowers His
// hand, and they fade away like smoke. "But rejoice that your names are written in heaven": high among the stars a
// great golden scroll unrolls from one side of the sky to the other, and line by line names are written on it, each
// with a little star; the seventy-two look up and lift their hands.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { countrySet, KN, glow, folk, stillGroup, barefoot, figure, wisp, thought, heavenScroll, goldName, sparkle, kf, EVENING, NIGHT, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';

const JX = KN.X, JY = 688;
let SX = 440, SY = 262, SW = 720;         // the scroll: left roller at (SX, SY), sheet SW wide

export default {
  id: 'lk10-names',
  beats: [
    { v: 20, text: 'Jednak nie z tego się cieszcie, że duchy się wam poddają,' },
    { v: 20, cont: true, text: 'lecz cieszcie się, że wasze imiona zapisane są w niebie».' },
  ],
  cam: { x: [-30, 30], y: [-120, 40], z: [1, 1.1] },
  build(S) {
    // phone: a narrower scroll, inside the screen and clear of the thread
    const PT = S.portrait;
    [SX, SW] = PT ? [480, 620] : [440, 720];
    const K = countrySet(S, { skyCols: EVENING, sky2: NIGHT, sunAt: [1260, 900] });
    const c = S.c;
    const pc = makeCutter('lk10-names-people');
    K.sk2.layer.fade(1); K.starL.fade(1); K.dim.fade(0.9);
    K.trails.forEach((el) => pose(el, { o: 0.6 }));

    /* the scroll in the sky, and the names */
    const SL = S.layer({ par: 0.04, sh: 5, rise: 0 });
    const sGlow = SL.add(`<g>${glow(420, 0.8)}</g>`);
    const scroll = heavenScroll(c, SW, 170);
    const sheetEl = SL.add(`<g>${scroll.sheet}</g>`);
    const rollL = SL.add(`<g>${scroll.roller}</g>`);
    const rollR = SL.add(`<g>${scroll.roller}</g>`);
    const NAMES = Array.from({ length: 12 }, (_, i) => ({ i, col: i % 3, row: Math.floor(i / 3), el: SL.add(`<g>${goldName(makeCutter('lk10-name' + i), makeCutter('lk10-nw' + i).rr(120, 180))}</g>`) }));

    /* Jesus and the seventy-two */
    const P = S.layer({ par: 0.45, sh: 5 });
    const jGlow = P.add(`<g>${glow(170, 0.7)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const GR = [[420, 730, 0.8], [520, 736, 0.82], [1080, 736, 0.82], [1180, 730, 0.8], [380, 790, 0.88], [1220, 790, 0.88]].map(([x0, y, s], i) => {
      const x = PT ? 800 + (x0 - 800) * 0.8 : x0;
      const left = x > 800;
      const m = [{ x: -30, y: -4, s, flip: left, o: folk(pc, true) }, { x: 30, y: 2, s: s * 0.97, flip: left, o: folk(pc, true) }];
      return {
        i, x, y,
        calm: crowdL.sprite(stillGroup(pc, m.map((q) => ({ ...q, armF: 24, armB: 10, head: -4 }))), x, y),
        up: crowdL.sprite(stillGroup(pc, m.map((q, k) => ({ ...q, armF: 60 + k * 20, armB: 150, head: -22 }))), x, y),
      };
    });
    const A = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const B = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));
    const fx = S.layer({ par: 0.46, sh: 5 });
    const pic = (seed) => {
      const q = makeCutter(seed);
      return `<g transform="translate(-18 40)">${figure(q, folk(q, true), { x: 0, y: 0, s: 0.4, armF: 60, armB: 150, head: -14 })}</g><g transform="translate(44 -26) rotate(60) scale(.8)">${wisp(q, 1.5, '#3e3448')}</g>`;
    };
    const BUB = (PT ? [[585, 470], [800, 400], [1012, 470]] : [[530, 470], [800, 400], [1070, 470]]).map(([x, y], i) => ({ i, x, y, el: fx.add(`<g>${thought(c, pic('lk10-pic' + i), { w: 140, h: 116 })}</g>`) }));
    const tw = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 12)}</g>`) }));

    return (t, time) => {
      const T = time;
      K.update(T, { sunO: 0 });
      K.lampsOn([1, 1, 1, 1, 1, 1], T);

      /* v20a — the pictures of the spirits fade like smoke */
      BUB.forEach((b) => {
        const k = es(t, 0.02 + b.i * 0.06, 0.16 + b.i * 0.06, ease.back);
        const away = es(t, 0.5 + b.i * 0.06, 0.95 + b.i * 0.04);
        pose(b.el, { x: b.x, y: b.y - away * 60, s: k * (1 - away * 0.3), o: k > 0.01 ? 1 - away : 0 });
      });
      const lower = es(t, 0.35, 0.55) * (1 - es(t, 1.0, 1.15));
      const lookUp = es(t, 1.05, 1.3);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: t < 1.0, armF: 20 + lower * 60 + lookUp * 50, armB: 10 + lookUp * 140, head: -lookUp * 24, blink: blinkAt(T) });
      pose(jGlow, { x: JX, y: JY - 120, o: 0.7 });
      A.set({ x: 640, y: 744, s: 0.98, flip: false, armF: 60 * (1 - lower) * (1 - lookUp) + 30 + lookUp * 60, armB: 90 * (1 - lower) * (1 - lookUp) + 10 + lookUp * 140, head: -8 - lookUp * 16, blink: blinkAt(T, 2) });
      B.set({ x: 712, y: 750, s: 0.95, flip: false, armF: 70 * (1 - lower) * (1 - lookUp) + 30 + lookUp * 70, armB: 100 * (1 - lower) * (1 - lookUp) + 10 + lookUp * 130, head: -8 - lookUp * 16, blink: blinkAt(T, 3) });

      /* v20b — the scroll unrolls in the sky; the names are written */
      const un = es(t, 1.02, 1.4);
      pose(sGlow, { x: SX + SW / 2, y: SY, s: 0.4 + un * 0.6, o: un });
      pose(sheetEl, { x: SX, y: SY, sx: Math.max(0.01, un), o: un > 0.005 ? 1 : 0 });
      pose(rollL, { x: SX, y: SY, o: es(t, 0.95, 1.05) });
      pose(rollR, { x: SX + SW * un, y: SY, o: es(t, 0.95, 1.05) });
      NAMES.forEach((n) => {
        const k = es(t, 1.4 + n.i * 0.035, 1.46 + n.i * 0.035);
        pose(n.el, { x: SX + 40 + n.col * (PT ? 192 : 225), y: SY - 50 + n.row * 34, sx: Math.max(0.01, k), o: k > 0.01 ? 1 : 0 });
      });
      tw.forEach((s_, i) => { const k = bump(t, 1.45 + i * 0.07, 1.8 + i * 0.07); pose(s_.el, { x: SX + 60 + i * (PT ? 100 : 120), y: SY - 110 + (i % 2) * 220, s: k, r: T * 40, o: k }); });
      GR.forEach((g) => {
        const up = es(t, 1.35 + g.i * 0.03, 1.4 + g.i * 0.03);
        g.calm.set({ x: g.x, y: g.y, s: 1, o: 1 - up });
        g.up.set({ x: g.x, y: g.y, s: 1, o: up });
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 20], [0.9, 20], [1.3, -90], [2, -90]]);
      S.cam.z = kf(t, [[0, 1.06], [0.9, 1.06], [1.3, 1.0], [2, 1.0]]);
    };
  },
};
