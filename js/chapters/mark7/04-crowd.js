// Mk 7,14–16 — Jesus calls the crowd again: "Hear me, all of you, and understand!"
// A paper doll — "a man" — comes down from the flies: bread, fish and grapes go in at its mouth and
// it stays clean; dark little things come out of its heart and stain it. Then big paper ears:
// "If anyone has ears to hear, let him hear!"
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush, grass, town } from '../../assets/nature.js';
import { bird, fish, ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { hand, headAt, paperDoll, dollHeart, darkThing, DARK_KINDS, loaf, cup, spark, soundRings, hang2 } from './lib.js';

const PI = Math.PI;
const FLOOR = 660;
const JX = 800;
const DOLL = { x: 800, y: 430, h: 240 };  // the doll's feet

export default {
  id: 'm7-crowd',
  beats: [
    { v: 14, text: 'Potem przywołał znowu tłum do siebie i rzekł do niego:' },
    { v: 14, cont: true, text: '«Słuchajcie Mnie, wszyscy, i zrozumiejcie!' },
    { v: 15, text: 'Nic nie wchodzi z zewnątrz w człowieka, co mogłoby uczynić go nieczystym;' },
    { v: 15, cont: true, text: 'lecz co wychodzi z człowieka, to czyni człowieka nieczystym.' },
    { v: 16 },
  ],
  cam: { x: [-30, 30], y: [-110, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const EAR = S.portrait ? 205 : 260;   // phone: the two ears inside the frame, clear of the thread
    const SKY = ['#cfe1de', '#efe6cd', '#f7ebd4'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1220, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 420, y: 130, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 120), { x: 1030, y: 110, len: 700 });
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

    /* ---------- the crowd, Jesus on a stone step ---------- */
    const back = S.layer({ par: 0.52, sh: 4 });
    const rowsBack = crowd(S, back, [
      { y: 616, s: 0.62, n: 14, x0: 400, x1: 1200 },
      { y: 632, s: 0.7, n: 12, x0: 380, x1: 1220 },
    ]).filter((m) => Math.abs(m.x - JX) > 90);
    const stage = S.layer({ par: 0.56, sh: 5 });
    stage.add(sheet().p(c.cut([[JX - 90, FLOOR - 30], [JX + 90, FLOOR - 30], [JX + 96, FLOOR + 6], [JX - 96, FLOOR + 6]], 0.6, 8), C.stone2).x(c.ribbon([[JX - 90, FLOOR - 14], [JX + 90, FLOOR - 13]], 1.4), shade(C.stone2, -0.2), 'opacity=".6"').out());
    const jesus = S.puppet(stage.add(person(c, { ...CAST.jesus })));
    const voice = soundRings(stage, c, { n: 3, r: 26, color: shade(C.ochre, 0.3) });
    const front = S.layer({ par: 0.6, sh: 5 });
    const rowsFront = crowd(S, front, [
      { y: 690, s: 0.84, n: 9, x0: 380, x1: 1220 },
    ]).filter((m) => Math.abs(m.x - JX) > 130);
    const all = [...rowsBack, ...rowsFront];
    all.forEach((m) => { m.from = m.x < JX ? m.x - c.rr(500, 800) : m.x + c.rr(500, 800); m.d = c.rr(0, 0.45); });

    /* ---------- the paper doll and its lesson ---------- */
    const fx = S.layer({ par: 0.56, sh: 6 });
    const doll = paperDoll(c, DOLL.h);
    const dollEl = hanging(fx, `<g transform="translate(0 ${DOLL.h + 20})"><g>${doll.body}</g><g data-g="stain" opacity="0">${doll.stain}</g><g transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})" data-g="heart">${dollHeart(c, 18)}</g><g data-g="dark" opacity="0" transform="translate(${doll.P.heart[0]} ${doll.P.heart[1]})">${sheet().p(c.cut(c.blob(0, 0, 16, 13, 10, 0.2), 0.6, 4), mix(C.night2, C.jesusMantle, 0.35)).out()}</g></g>`, { x: DOLL.x, y: DOLL.y - DOLL.h - 20, len: 600 });
    const stainG = dollEl.querySelector('[data-g="stain"]'), darkHeart = dollEl.querySelector('[data-g="dark"]'), hrt = dollEl.querySelector('[data-g="heart"]');
    const food = [loaf(c, 14), `<g transform="scale(.9)">${fish(c, { color: C.lake3 })}</g>`, grapesSmall(c), cup(c)].map((m, i) => ({ i, el: fx.add(`<g>${m}</g>`), from: [[1180, 300], [1160, 180], [1200, 240], [440, 230]][i] }));
    const okSpark = fx.add(`<g>${spark(c, 14)}</g>`);
    const out = DARK_KINDS.slice(0, 7).map((k, i) => ({ i, el: fx.add(`<g>${darkThing(c, k)}</g>`), a: -PI / 2 + (i - 3) * 0.5, d: c.rr(120, 170) }));
    const ears = [-1, 1].map((side) => ({ side, el: hanging(fx, `<g transform="scale(${side * 1.6} 1.6)">${ear(c, C.skin)}</g>`, { x: DOLL.x + side * 250, y: 250, len: 700 }) }));
    const earRings = soundRings(fx, c, { n: 3, r: 40, w: 6, color: shade(C.ochre, 0.3) });
    const earRings2 = soundRings(fx, c, { n: 3, r: 40, w: 6, color: shade(C.ochre, 0.3) });

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1340, 860, 200, C.sage, C.moss) + bush(c, 160, 870, 220, C.moss, C.sage));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 130, T, 1, 0.6);
      swing(cl1, 420 + Math.sin(T * 0.1) * 20, 130, T, 1.2, 0.7, 1);
      swing(cl2, 1030 + Math.sin(T * 0.12 + 1) * 20, 110, T, 1.2, 0.7, 2);
      birds(T, 1);

      /* v14 — the crowd is called and gathers; "Hear me, all of you!" */
      const call = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const hear = es(t, 1.05, 1.3);
      const teach = es(t, 2.0, 2.2);
      jesus.set({
        x: JX, y: FLOOR - 28, s: 1.02,
        armF: call * (70 + Math.sin(T * 5) * 25) + hear * (1 - teach) * 40 + teach * (40 + Math.sin(T * 1.4) * 10) + bump(t, 4.0, 4.9) * 30,
        armB: call * 30 + hear * (1 - teach) * 140 + teach * 20 + bump(t, 4.0, 4.9) * 120,
        head: -hear * (1 - teach) * 8, blink: blinkAt(T),
      });
      const [hx, hy] = headAt(JX, FLOOR - 28, 1.02, false);
      voice(hx + 14, hy + 4, es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05)) + bump(t, 4.0, 4.9), T);
      all.forEach((m) => {
        const pr = seg(t, 0.1 + m.d, 0.6 + m.d);
        const x = lerp(m.from, m.x, ease.out(pr));
        const cupEar = bump(t, 4.05 + m.d * 0.3, 4.95) * (m.i % 2 ? 1 : 0);
        m.p.set({
          x, y: m.y, s: m.s, flip: m.x > JX, walk: pr > 0 && pr < 1 ? x * 0.05 : undefined,
          armF: hear * (m.i % 4 === 0 ? 20 : 0), armB: cupEar * 165, head: -hear * 6 + cupEar * 10, blink: blinkAt(T, m.seed),
        });
      });

      /* v15a — nothing from outside defiles: food goes in, the heart stays warm */
      const dK = es(t, 1.85, 2.3, ease.out);
      const dy = DOLL.y - DOLL.h - 20 - (1 - dK) * 1150;
      swing(dollEl, DOLL.x, dy, T, 0.8, 0.6);
      const mouth = [DOLL.x + doll.P.mouth[0], dy + DOLL.h + 20 + doll.P.mouth[1]];
      const belly = [DOLL.x + doll.P.stomach[0], dy + DOLL.h + 20 + doll.P.stomach[1]];
      food.forEach((f) => {
        const k = seg(t, 2.2 + f.i * 0.14, 2.6 + f.i * 0.14);
        const inK = seg(t, 2.6 + f.i * 0.14, 2.8 + f.i * 0.14);
        const x = lerp(f.from[0], mouth[0], ease.io(k)), y = lerp(f.from[1], mouth[1], ease.io(k)) - Math.sin(k * PI) * 50;
        const px = inK > 0 ? lerp(mouth[0], belly[0], inK) : x, py = inK > 0 ? lerp(mouth[1], belly[1], inK) : y;
        pose(f.el, { x: px, y: py, s: 0.9 - inK * 0.5, r: (1 - k) * 30, o: k > 0 && inK < 1 ? 1 : 0 });
      });
      const ok = es(t, 2.85, 3.0, ease.back) * (1 - es(t, 3.05, 3.2));
      pose(okSpark, { x: DOLL.x + 70, y: dy + DOLL.h - 150, s: ok * 1.2, o: ok > 0.02 ? 1 : 0 });
      pose(hrt, { x: doll.P.heart[0], y: doll.P.heart[1], s: 1 + Math.sin(T * 3) * 0.04 * (1 - seg(t, 3, 3.3)) });

      /* v15b — what comes out of a man defiles him */
      const darken = es(t, 3.05, 3.3);
      fade(darkHeart, darken);
      out.forEach((o) => {
        const k = es(t, 3.15 + o.i * 0.07, 3.55 + o.i * 0.07, ease.out);
        const back_ = es(t, 3.7 + o.i * 0.02, 3.95);
        const hxp = DOLL.x + doll.P.heart[0], hyp = dy + DOLL.h + 20 + doll.P.heart[1];
        const x = hxp + Math.cos(o.a) * o.d * k * (1 - back_ * 0.7), y = hyp + Math.sin(o.a) * o.d * 0.7 * k * (1 - back_ * 0.6) + back_ * 60;
        pose(o.el, { x, y, s: 0.5 + k * 0.5 - back_ * 0.4, r: Math.sin(T * 2 + o.i) * 8, o: k > 0.01 ? 1 - back_ : 0 });
      });
      fade(stainG, es(t, 3.7, 4.0) * 0.8);

      /* v16 — ears to hear */
      ears.forEach((e, i) => {
        const k = es(t, 4.0 + i * 0.1, 4.35 + i * 0.1, ease.back);
        swing(e.el, DOLL.x + e.side * EAR, 260 - (1 - k) * 1150, T, 1.4, 0.8, i);
      });
      const on = es(t, 4.3, 4.5);
      earRings(DOLL.x - EAR, 300, on, T);
      earRings2(DOLL.x + EAR, 300, on, T);

      S.cam.y = -es(t, 1.8, 2.3) * 100 + es(t, 4.0, 4.4) * 20;
      S.cam.z = 1 + es(t, 0.2, 1.0) * 0.03 + es(t, 1.05, 1.3) * 0.03 - es(t, 1.8, 2.3) * 0.04;
    };
  },
};

function grapesSmall(c) {
  let d = '';
  [[0, 4], [1, 3], [2, 2], [3, 1]].forEach(([row, n]) => { for (let i = 0; i < n; i++) d += c.cut(c.circ((i - (n - 1) / 2) * 8.5, -20 + row * 7.5, 5, 8), 0.2, 3); });
  return sheet().p(d, C.plumRobe).x(c.ribbon([[0, -24], [2, -32]], 1.6), C.moss).out();
}
