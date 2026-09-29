// Mt 15,10–11 — Jesus calls the crowd to Him on the square above the lake: groups of people come in from both sides
// and gather round the stone step where He stands. "Hear and understand!" A paper doll — "a man" — comes down from the
// flies: bread, a fish and grapes go in at its mouth, and it stays clean, a little gold star by it. "But what comes out
// of the mouth, this defiles a man": dark jagged words fly out of its mouth, and grey stains spread over the paper.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush, grass, town } from '../../assets/nature.js';
import { bird, fish } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { headAt, paperDoll, dollHeart, darkThing, loaf, cup, spark, soundRings, throng, LAKE, PI } from './lib.js';

const FLOOR = 660;
const JX = 800;
const DOLL = { x: 800, y: 430, h: 240 };   // the doll's feet
const OUT = ['jag', 'mask', 'jag', 'cloud', 'jag', 'knot', 'jag'];

export default {
  id: 'mt15-crowd',
  beats: [
    { v: 10, text: 'Potem przywołał do siebie tłum i rzekł do niego:' },
    { v: 10, cont: true, text: '«Słuchajcie i chciejcie zrozumieć.' },
    { v: 11, text: 'Nie to, co wchodzi do ust, czyni człowieka nieczystym,' },
    { v: 11, cont: true, text: 'ale co z ust wychodzi, to go czyni nieczystym».' },
  ],
  cam: { x: [-30, 30], y: [-110, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfe1de', '#efe6cd', '#f7ebd4']);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1220, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 690, y: 110, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 190, speed: 36, scale: 0.45 });

    /* ---------- a village above the lake ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    S.layer({ par: 0.14, sh: 1 }).add(waterBand(c, { y: 440, color: C.lake, foamN: 14, bottom: 900 }).markup);
    const vill = S.layer({ par: 0.26, sh: 3 });
    const h2 = hillsWith(c, { y: 500, amps: [12, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    vill.add(h2.markup);
    vill.add(town(c, { x: 330, y: h2.fn(330) + 16, n: 6, spread: 340, sc: 0.8 }) + town(c, { x: 1300, y: h2.fn(1300) + 16, n: 6, spread: 320, sc: 0.8 }));
    vill.add(palm(c, 520, h2.fn(520) + 18, 140) + olive(c, 1110, h2.fn(1110) + 16, 0.8));
    const sq = S.layer({ par: 0.45, sh: 3 });
    const sfn = c.wave(600, [4, 2], [700, 180]);
    sq.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.35)).out());
    sq.add(grass(c, { x0: -700, x1: 2300, y: 600, fn: sfn, n: 30, h: 12, color: C.olive }));

    /* ---------- the crowd (still groups that walk in on their tracks), Jesus on a stone step ---------- */
    const backL = S.layer({ par: 0.5, sh: 4 });
    const GB = [[-1, 470, 616, 5], [-1, 610, 622, 3], [1, 990, 622, 3], [1, 1140, 616, 5]].map(([side, x, y, n], i) => ({
      side, x, y, i, from: x + side * 700,
      sp: backL.sprite(throng(makeCutter('mt15-cr-b' + i), n, { s: 0.66, rows: 2, spread: 40, flip: side > 0, arms: 16 }), x, y),
    }));
    const stage = S.layer({ par: 0.56, sh: 5 });
    stage.add(sheet().p(c.cut([[JX - 90, FLOOR - 30], [JX + 90, FLOOR - 30], [JX + 96, FLOOR + 6], [JX - 96, FLOOR + 6]], 0.6, 8), C.stone2).x(c.ribbon([[JX - 90, FLOOR - 14], [JX + 90, FLOOR - 13]], 1.4), shade(C.stone2, -0.2), 'opacity=".6"').out());
    const jesus = S.puppet(stage.add(person(c, { ...CAST.jesus })));
    const voice = soundRings(stage, c, { n: 3, r: 26, color: shade(C.ochre, 0.3) });
    const frontL = S.layer({ par: 0.6, sh: 5 });
    const GF = [[-1, 470, 700, 4], [-1, 620, 712, 2], [1, 980, 712, 2], [1, 1130, 700, 4]].map(([side, x, y, n], i) => ({
      side, x, y, i, from: x + side * 800,
      sp: frontL.sprite(throng(makeCutter('mt15-cr-f' + i), n, { s: 0.84, rows: 1, spread: 56, flip: side > 0, arms: 20 }), x, y),
    }));

    /* ---------- the paper doll and its lesson ---------- */
    const fx = S.layer({ par: 0.56, sh: 6 });
    const doll = paperDoll(c, DOLL.h);
    const dollEl = hanging(fx, `<g transform="translate(0 ${DOLL.h + 20})"><g>${doll.body}</g><g data-g="stain" opacity="0">${doll.stain}</g><g transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${dollHeart(c, 18)}</g></g>`, { x: DOLL.x, y: DOLL.y - DOLL.h - 20, len: 600 });
    const stainG = dollEl.querySelector('[data-g="stain"]');
    const food = [loaf(c, 14), `<g transform="scale(.9)">${fish(c, { color: C.lake3 })}</g>`, grapesSmall(c), cup(c)].map((m, i) => ({ i, el: fx.add(`<g>${m}</g>`), from: [[1180, 300], [1160, 180], [1200, 240], [430, 230]][i] }));
    const okSpark = fx.add(`<g>${spark(c, 14)}</g>`);
    const out = OUT.map((k, i) => ({ i, el: fx.add(`<g>${darkThing(c, k)}</g>`), a: -PI / 2 + (i - 3) * 0.42, d: c.rr(130, 170) }));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1340, 860, 200, C.sage, C.moss) + bush(c, 160, 870, 220, C.moss, C.sage));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 130, T, 1, 0.6);
      swing(cl1, 690 + Math.sin(T * 0.1) * 20, 110, T, 1.2, 0.7, 1);
      birds(T, 1);

      /* v10a — He calls the crowd; they come in from both sides */
      const call = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const hear = es(t, 1.05, 1.3);
      const teach = es(t, 2.0, 2.2);
      jesus.set({
        x: JX, y: FLOOR - 28, s: 1.02,
        armF: call * (70 + Math.sin(t * 30) * 25) + hear * (1 - teach) * 40 + teach * (40 + Math.sin(t * 8) * 10) + bump(t, 3.0, 3.9) * 30,
        armB: call * 30 + hear * (1 - teach) * 120 + teach * 20 + bump(t, 3.0, 3.9) * 100,
        head: -hear * (1 - teach) * 8, blink: blinkAt(T),
      });
      const [hx, hy] = headAt(JX, FLOOR - 28, 1.02, false);
      voice(hx + 14, hy + 4, es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05)), T);
      [...GB, ...GF].forEach((g, k) => {
        const pr = es(t, 0.1 + (k % 4) * 0.08 + (k > 3 ? 0.12 : 0), 0.75 + (k % 4) * 0.05 + (k > 3 ? 0.12 : 0), ease.out);
        g.sp.set({ x: lerp(g.from, g.x, pr), y: g.y - Math.abs(Math.sin(pr * PI * 5)) * 4 * (1 - pr), o: 1 });
      });

      /* v11a — nothing from outside defiles: food goes in, the heart stays warm */
      const dK = es(t, 1.85, 2.3, ease.out);
      const dy = DOLL.y - DOLL.h - 20 - (1 - dK) * 1150;
      swing(dollEl, DOLL.x, dy, T, 0.8, 0.6);
      const base = dy + DOLL.h + 20;
      const mouth = [DOLL.x + doll.P.mouth[0], base + doll.P.mouth[1]];
      const belly = [DOLL.x + doll.P.stomach[0], base + doll.P.stomach[1]];
      food.forEach((f) => {
        const k = seg(t, 2.2 + f.i * 0.14, 2.6 + f.i * 0.14);
        const inK = seg(t, 2.6 + f.i * 0.14, 2.8 + f.i * 0.14);
        const x = lerp(f.from[0], mouth[0], ease.io(k)), y = lerp(f.from[1], mouth[1], ease.io(k)) - Math.sin(k * PI) * 50;
        const px = inK > 0 ? lerp(mouth[0], belly[0], inK) : x, py = inK > 0 ? lerp(mouth[1], belly[1], inK) : y;
        pose(f.el, { x: px, y: py, s: 0.9 - inK * 0.5, r: (1 - k) * 30, o: k > 0 && inK < 1 ? 1 : 0 });
      });
      const ok = es(t, 2.85, 3.0, ease.back) * (1 - es(t, 3.05, 3.2));
      pose(okSpark, { x: DOLL.x + 80, y: base - 190, s: ok * 1.3, o: ok > 0.02 ? 1 : 0 });

      /* v11b — what comes out of the mouth defiles: dark words fly out, the paper stains */
      out.forEach((o) => {
        const k = es(t, 3.1 + o.i * 0.07, 3.45 + o.i * 0.07, ease.out);
        const x = mouth[0] + Math.cos(o.a) * o.d * k, y = mouth[1] + Math.sin(o.a) * o.d * 0.55 * k;
        pose(o.el, { x, y, s: 0.5 + k * 0.6, r: T ? Math.sin(T * 2 + o.i) * 8 : 0, o: k > 0.01 ? 1 : 0 });
      });
      fade(stainG, es(t, 3.3, 3.75) * 0.85);

      S.cam.y = -es(t, 1.8, 2.3) * 100 + es(t, 3.0, 3.4) * 10;
      S.cam.z = 1 + es(t, 0.2, 1.0) * 0.03 + es(t, 1.05, 1.3) * 0.03 - es(t, 1.8, 2.3) * 0.04;
    };
  },
};

function grapesSmall(c) {
  let d = '';
  [[0, 4], [1, 3], [2, 2], [3, 1]].forEach(([row, n]) => { for (let i = 0; i < n; i++) d += c.cut(c.circ((i - (n - 1) / 2) * 8.5, -20 + row * 7.5, 5, 8), 0.2, 3); });
  return sheet().p(d, C.plumRobe).x(c.ribbon([[0, -24], [2, -32]], 1.6), C.moss).out();
}
