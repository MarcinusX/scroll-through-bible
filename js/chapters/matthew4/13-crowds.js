// Mt 4,25 — the whole land in one wide picture: green Galilee on the left, the lake with a Greek city of the
// Decapolis on its far shore to the right, Jerusalem on its hill far away, the dry hills of Judea, the Jordan and
// the land beyond it. Jesus walks along the road in front, and crowds stream after Him from every side — each one
// named by a sign on a string: from Galilee and the Decapolis, then from Jerusalem, Judea and beyond the Jordan,
// until a great multitude follows Him.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, olive, cypress, grass, flowers, sun, cloud, town, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hungWord, pose3, folk4, walledCity, tr, DAY, PI } from './lib.js';

const P = 0.5;
const ROAD = 776;

export default {
  id: 'mt4-crowds',
  beats: [
    { v: 25, text: 'I szły za Nim liczne tłumy z Galilei i z Dekapolu,' },
    { v: 25, cont: true, text: 'z Jerozolimy, z Judei i z Zajordania.' },
  ],
  cam: { x: [-30, 30], y: [0, 60], z: [0.94, 1.06] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1250, y: 150, len: 800 });
    const cls = [[460, 150, 200], [1000, 110, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));

    /* ---------- the land: far hills, Jerusalem, Judea, the Jordan and beyond, the lake, Galilee ---------- */
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(band(c, { y: 420, amps: [16, 7, 3], lens: [1100, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.18) }).markup);
    const back = S.layer({ par: 0.12, sh: 2 });
    const jud = hillsWith(c, { y: 470, amps: [22, 9, 3], lens: [700, 260, 100], color: mix(C.dune, C.sand2, 0.5), x0: -900, x1: 1100 });
    back.add(jud.markup);
    const bw = c.wave(474, [18, 8], [800, 280]);
    back.add(sheet().p(c.ridge((x) => bw(x) + Math.max(0, 1080 - x) ** 1.2 * 1.2, 700, 2600, 1700, 12, 1), mix(C.mauve, C.hillMid, 0.55)).out());
    back.add(`<g>${walledCity(c, 330, jud.fn(330) + 24, 0.62)}</g>`);
    back.add(sheet().p(c.ribbon(c.cbez([1060, 470], [1040, 520], [1120, 560], [1080, 640], 20), (u) => 5 + u * 10), C.lake2).out());
    const mid = S.layer({ par: 0.22, sh: 3 });
    mid.add(waterBand(c, { y: 560, color: C.lake, foamN: 14, x0: 1080, x1: 2800, bottom: 700 }).markup);
    // a Greek city of the Decapolis on the far shore
    const dec = sheet();
    dec.p(c.cut(c.rect(1250, 510, 170, 50), 0.4, 6), C.plaster);
    let cols = '';
    for (let i = 0; i < 7; i++) cols += c.cut(c.rect(1262 + i * 22, 470, 8, 42), 0.2, 4);
    dec.p(cols, C.linen).p(c.cut([[1252, 470], [1335, 440], [1418, 470]], 0.3, 5), C.stone).p(c.cut(c.rect(1250, 466, 170, 8), 0.2, 5), C.stone2);
    mid.add(dec.out() + town(c, { x: 1480, y: 560, n: 4, spread: 120, sc: 0.45 }));
    const gw = c.wave(600, [16, 7], [800, 280]);
    const gfn2 = (x) => gw(x) + Math.max(0, x - 1000) ** 1.2 * 1.1;
    mid.add(sheet().p(c.ridge(gfn2, -900, 1400, 1700, 12, 1), C.hillMid).out() + town(c, { x: 150, y: gfn2(150) + 14, n: 6, spread: 200, sc: 0.5 }) + olive(c, 520, gfn2(520) + 16, 0.6) + cypress(c, 700, gfn2(700) + 10, 90));
    const G = S.layer({ par: P, sh: 3 });
    const gfn = c.wave(690, [6, 3], [700, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.hillNear).p(c.ribbon([[-900, ROAD + 4], [800, ROAD], [2500, ROAD + 6]], 56, 2), mix(C.sand, C.cream, 0.35)).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: 690, fn: gfn, n: 70, h: 14, color: C.moss }) + olive(c, 180, gfn(180) + 30, 1.1) + cypress(c, 1420, gfn(1420) + 20, 150) + flowers(c, { x0: 300, x1: 1300, y: 720, fn: (x) => gfn(x) + 30, n: 20 }));

    /* ---------- the crowds (sprites) ---------- */
    const pc = makeCutter('mt4-crowds');
    const mob = (n, s, flip, spread = 44) => pose3(pc, Array.from({ length: n }, (_, i) => ({ x: (i % Math.ceil(n / 2)) * spread + (i >= Math.ceil(n / 2) ? spread / 2 : 0) + pc.rr(-8, 8), y: (i >= Math.ceil(n / 2) ? 22 : 0) + pc.rr(-4, 4), s: s * pc.rr(0.92, 1.05), flip, head: pc.rr(-6, 4), armF: pc.rr(0, 30), o: folk4(pc, null) })));
    const farL = S.layer({ par: 0.16, sh: 3 });
    const nearL = S.layer({ par: P, sh: 4 });
    const CROWDS = [
      // [layer, markup, from [x,y], to [x,y], beat window, sign text, sign x]
      { L: nearL, m: mob(10, 0.74, false, 52), from: [-700, 738], to: [250, 738], w: [0.05, 0.85], sign: tr('z Galilei', 'from Galilee'), sx: 450, sy: 340 },
      { L: nearL, m: mob(10, 0.74, true, 52), from: [1800, 742], to: [1060, 742], w: [0.2, 0.95], sign: tr('z Dekapolu', 'from the Decapolis'), sx: 1150, sy: 340 },
      { L: farL, m: mob(8, 0.5, false, 30), from: [260, 520], to: [520, 600], w: [1.05, 1.7], sign: tr('z Jerozolimy', 'from Jerusalem'), sx: 580, sy: 225 },
      { L: farL, m: mob(8, 0.52, true, 30), from: [880, 470], to: [760, 610], w: [1.15, 1.8], sign: tr('z Judei', 'from Judea'), sx: 760, sy: 170 },
      { L: farL, m: mob(8, 0.52, true, 30), from: [1300, 520], to: [1000, 612], w: [1.25, 1.9], sign: tr('z Zajordania', 'from beyond the Jordan'), sx: 1040, sy: 230 },
    ].map((cr, i) => ({ ...cr, i, sp: cr.L.sprite(cr.m, cr.to[0], cr.to[1]), el: null }));
    const signL = S.layer({ par: 0.1, sh: 6 });
    CROWDS.forEach((cr) => { cr.el = signL.add(hungWord(c, cr.sign, { size: 22 })); });

    /* ---------- Jesus and the four in front ---------- */
    const JL = S.layer({ par: P, sh: 5 });
    const FOUR = [CAST.peter, CAST.andrew, CAST.james, CAST.john].map((o, i) => ({ i, p: S.puppet(JL.add(person(c, o))) }));
    const jesus = S.puppet(JL.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      swing(sunEl, 1250, 150, time, 1, 0.6);
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(time * 0.1 + cl.i) * 20, cl.y, time, 1.2, 0.6, cl.i));

      /* He walks on; the four behind Him */
      const go = es(t, 0.0, 2.0, (u) => u);
      const jx = lerp(720, 900, go);
      jesus.set({ x: jx, y: ROAD, s: 1.05, walk: jx * 0.045, amt: 0.8, armF: 14 + bump(t, 1.2, 1.9) * 20, head: -2, blink: blinkAt(time) });
      FOUR.forEach((f) => { const x = jx - 110 - f.i * 80; f.p.set({ x, y: ROAD + (f.i % 2 ? 8 : -4), s: 0.98, walk: x * 0.05 + f.i, amt: 0.8, armF: 12, blink: blinkAt(time, f.i + 1) }); });

      /* the crowds come, each from its own land, and follow */
      CROWDS.forEach((cr) => {
        const k = es(t, cr.w[0], cr.w[1], ease.out);
        const x = lerp(cr.from[0], cr.to[0], k) + go * 40, y = lerp(cr.from[1], cr.to[1], k);
        const moving = k > 0 && k < 1;
        cr.sp.set({ x, y: y - (moving ? Math.abs(Math.sin(x * 0.03)) * 3 : 0), o: k > 0 ? 1 : 0 });
        const sk = es(t, cr.w[0] + 0.05, cr.w[0] + 0.35, ease.out);
        pose(cr.el, { x: cr.sx, y: lerp(-420, cr.sy, sk), r: Math.sin(time * 0.8 + cr.i) * 1.4, o: sk > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1.03 - es(t, 1.0, 1.9) * 0.08;
      S.cam.x = lerp(-20, 20, go);
      S.cam.y = 40;
    };
  },
};
