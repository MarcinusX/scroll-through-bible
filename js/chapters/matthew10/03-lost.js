// Mt 10,5–6 — at a crossroads in the hills Jesus sends out the Twelve (they stand two by two on either side of
// Him) and gives them their charge: words of light go out to each pair. Two roads fork away — the left to a
// pagan city with its idol on a hilltop temple, the right to a Samaritan town under Mount Gerizim: a barrier bar
// drops across each and a red cross over its signpost. The middle road glows: up on the green hills of Israel
// lost sheep appear — one caught in a thorn bush, one on a ledge — and the first pairs set off up the road.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, rock, grass, flowers, sun, cloud, bush, olive, cypress } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { signpost } from '../mark1/lib.js';
import { MT12, DAY, sheep, crossX, goldSlip, bubble, kf, moving, hand, headAt, tr, PI } from './lib.js';

const JX = 800, JY = 716;
const FORK = [800, 636];
/** the Twelve in pairs on either side of Jesus (x, dy) */
const SPOT = [[690, 6], [636, 16], [910, 6], [964, 16], [566, 22], [512, 30], [1034, 22], [1088, 30], [444, 36], [396, 44], [1156, 36], [1204, 44]];

/** a pagan hilltop temple with columns and an idol on a pillar; origin: ground centre */
function paganTemple(c) {
  const s = sheet();
  s.p(c.cut([[-70, 0], [-70, -10], [70, -10], [70, 0]], 0.3, 6), C.stone2);
  let cols = '';
  for (let i = 0; i < 6; i++) cols += c.cut(c.rect(-62 + i * 24, -62, 9, 52), 0.2, 5);
  s.p(cols, C.stone);
  s.p(c.cut([[-74, -62], [74, -62], [74, -70], [0, -96], [-74, -70]], 0.4, 6), C.stone);
  s.p(c.cut([[-60, -72], [0, -90], [60, -72]], 0.3, 5), C.terracotta);
  // the idol on its pillar
  s.p(c.cut(c.rect(90, -58, 12, 58), 0.2, 4), C.stone2);
  s.p(c.cut([[88, -58], [104, -58], [102, -80], [98, -92], [94, -92], [90, -80]], 0.3, 3) + c.cut(c.circ(96, -96, 6, 8), 0.2, 3), C.sun);
  return s.out();
}
/** a Samaritan town on a hill under a flat-topped mountain with a small temple; origin: ground centre */
function samaria(c) {
  const s = sheet();
  s.p(c.cut([[-150, 10], [-90, -70], [-40, -96], [40, -98], [100, -60], [150, 10]], 1, 8), mix(C.hillMid, C.rock, 0.35));
  s.p(c.cut([[-24, -96], [-24, -118], [0, -128], [24, -118], [24, -96]], 0.3, 4), C.stone);
  return s.out() + town(c, { x: 10, y: 8, n: 7, spread: 200, sc: 0.5 });
}

export default {
  id: 'mt10-lost',
  beats: [
    { v: 5, text: 'Tych to Dwunastu wysłał Jezus, dając im następujące wskazania:' },
    { v: 5, cont: true, text: '«Nie idźcie do pogan i nie wstępujcie do żadnego miasta samarytańskiego!' },
    { v: 6 },
  ],
  cam: { x: [-40, 40], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1240, y: 130, len: 800 });
    const cl = hanging(hangL, cloud(c, 190), { x: 560, y: 140, len: 700 });

    /* far hills: the pagan city (left), Samaria (right) */
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 420, amps: [18, 8, 3], lens: [1000, 360, 130], color: C.hillFar });
    far.add(fb.markup);
    const pag = far.add(`<g><g transform="translate(500 ${fb.fn(500) + 8}) scale(.62)">${paganTemple(c)}</g></g>`);
    const sam = far.add(`<g><g transform="translate(1110 ${fb.fn(1110) + 12}) scale(.62)">${samaria(c)}</g></g>`);

    /* the green hills of Israel, where the lost sheep are */
    const mid = S.layer({ par: 0.18, sh: 3 });
    const mh = hillsWith(c, { y: 486, amps: [16, 7, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 20 });
    mid.add(mh.markup);
    mid.add(town(c, { x: 820, y: mh.fn(820) + 6, n: 5, spread: 140, sc: 0.42 }));
    const hi = S.layer({ par: 0.26, sh: 3 });
    const hfn = c.wave(548, [10, 4], [700, 230]);
    hi.add(sheet().p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.hillMid, 0.5)).out());
    hi.add(thornBush(c, 700, hfn(700) + 20, 64, C.thorn) + rock(c, 934, hfn(934) + 8, 96, 44, C.rock2) + olive(c, 380, hfn(380) + 10, 0.5) + cypress(c, 1230, hfn(1230) + 8, 90));
    const SH = [[700, 12, 0.62, false], [934, -34, 0.56, true], [560, 6, 0.6, false], [1050, 2, 0.6, true], [800, -26, 0.5, true], [626, -22, 0.52, false], [860, 10, 0.62, false]];
    const lost = SH.map(([x, dy, s, flip], i) => ({ x, y: hfn(x) + dy, s, flip, i, el: hi.add(`<g>${sheep(c, { wool: i % 3 ? C.linen : C.cream })}</g>`), baa: hi.add(`<g>${bubble(c, tr('bee…', 'baa…'), { size: 15, dir: flip ? 1 : -1, tailLen: 12 })}</g>`), seed: c.rr(0, 9) }));

    /* the crossroads */
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(640, [4, 2], [700, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5)).out());
    // phone: the roads run on down under the caption (widening towards us) instead of ending in a stub at y 900
    const tail = PH ? 1700 : 0;
    const road = (pts, w0, w1, col) => {
      const L = [], R = [];
      pts.forEach(([x, y], i) => { const u = i / (pts.length - 1), w = lerp(w0, w1, u); L.push([x - w, y]); R.unshift([x + w, y]); });
      if (tail) { L.unshift([pts[0][0] - w0 * 2.4, tail]); R.push([pts[0][0] + w0 * 2.4, tail]); }
      return c.cut([...L, ...R], 0.6, 8);
    };
    const RL = [[800, 900], [780, 700], [700, 640], [560, 600], [380, 570], [-100, 560]];
    const RR = [[800, 900], [820, 700], [900, 640], [1040, 600], [1220, 570], [1700, 560]];
    const RM = [[800, 900], [830, 720], [880, 660], [900, 610], [880, 560]];
    G.add(sheet().p(road(RL, 70, 8, C.sand) + road(RR, 70, 8, C.sand) + road(RM, 70, 14, C.sand), C.sand).out());
    const glowRoad = G.add(`<g opacity="0"><path d="${road(RM, 60, 10)}" fill="${C.lampGlow}" opacity=".55"/><circle cx="895" cy="610" r="90" fill="url(#warm-glow)"/></g>`);
    G.add(grass(c, { x0: -600, x1: 2200, y: 640, fn: gfn, n: 40, h: 14, color: C.moss }) + flowers(c, { x0: 400, x1: 1200, y: 700, n: 12, fn: (x) => 700 + Math.abs(x - 800) * 0.05 }));
    // signposts and barrier bars on the two forks
    const signs = [
      { x: 640, y: 628, text: tr('do pogan', 'to the Gentiles'), dir: -1, at: 1.25 },
      { x: 962, y: 628, text: tr('Samaria', 'Samaria'), dir: 1, at: 1.55 },
    ].map((sg) => ({ ...sg, post: G.add(`<g transform="translate(${sg.x} ${sg.y})">${signpost(c, sg.text, { size: 17, dir: sg.dir })}</g>`), bar: G.add(`<g>${sheet().p(c.cut([[-60, -8], [60, -12], [62, 0], [-60, 4]], 0.5, 8), C.wood2).p(c.cut(c.rect(-58, 0, 7, 30), 0.3, 4) + c.cut(c.rect(52, -2, 7, 32), 0.3, 4), C.wood).x(c.ribbon([[-40, -4], [-20, -6]], 6) + c.ribbon([[0, -6], [20, -7]], 6) + c.ribbon([[40, -8], [58, -8]], 6), C.terracotta, 'opacity=".85"').out()}</g>`), cross: G.add(`<g>${crossX(c, 22)}</g>`) }));

    /* Jesus and the Twelve */
    const P = S.layer({ par: 0.5, sh: 5 });
    const TW = MT12.map((m) => {
      const [x0, dy] = SPOT[m.i];
      const x = PH ? JX + (x0 - JX) * 0.84 : x0;   // phone: the outer pairs stay on the screen
      return { ...m, x, y: JY + dy, s: 0.84 + dy * 0.002, left: x < JX, seed: c.rr(0, 9) };
    }).sort((a, b) => a.y - b.y);
    TW.forEach((m) => { m.p = S.puppet(P.add(person(c, m.o))); });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const words = TW.map(() => P.add(`<g>${goldSlip(c, 30)}</g>`));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1240, 130, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 30, 140, T, 1.3, 0.6, 1);

      /* v5a — the charge: words of light go out to each pair */
      const speak = bump(t, 0.1, 0.95);
      /* v5b — not to the Gentiles (left), not into Samaria (right) */
      const left = bump(t, 1.1, 1.5), right = bump(t, 1.45, 1.95);
      /* v6 — the lost sheep of Israel */
      const go = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: left > 0.3, armF: 20 + speak * 40 + (left + right) * 70 + go * 80, armB: 10 + speak * 100 + go * 20, head: -go * 8, blink: blinkAt(T, 1) });
      words.forEach((w, i) => {
        const m = TW[i];
        const k = es(t, 0.2 + (m.pair % 6) * 0.08, 0.55 + (m.pair % 6) * 0.08);
        const [hx, hy] = headAt(m.x, m.y, m.s, !m.left);
        pose(w, { x: lerp(JX, hx, k), y: lerp(JY - 200, hy - 44, k) - Math.sin(k * PI) * 60, r: Math.sin(T * 2 + i) * 8, s: 0.8, o: k > 0.01 ? 1 - es(t, 0.9, 1.1) : 0 });
      });
      signs.forEach((sg, i) => {
        const k = es(t, sg.at, sg.at + 0.25, ease.back);
        pose(sg.bar, { x: sg.x + (i ? 48 : -48), y: sg.y + 6 - (1 - k) * 500, r: (1 - k) * 20, o: k > 0.01 ? 1 : 0 });
        const x2 = es(t, sg.at + 0.15, sg.at + 0.35, ease.back);
        pose(sg.cross, { x: sg.x + sg.dir * 30, y: sg.y - 86, s: x2, o: x2 > 0.01 ? 1 : 0 });
      });
      fade(pag, 1 - es(t, 1.3, 1.6) * 0.55);
      fade(sam, 1 - es(t, 1.6, 1.9) * 0.55);
      fade(glowRoad, go * 0.9);
      lost.forEach((sp) => {
        const k = es(t, 2.1 + sp.i * 0.06, 2.3 + sp.i * 0.06, ease.back);
        const bob = Math.sin(T * 2 + sp.seed) * 1.5;
        pose(sp.el, { x: sp.x, y: sp.y + bob * 0.3, s: sp.s * k, sx: sp.flip ? -1 : 1, o: k > 0.01 ? 1 : 0 });
        const bk = bump(t, 2.2 + sp.i * 0.07, 2.2 + sp.i * 0.07 + 0.55);
        pose(sp.baa, { x: sp.x + (sp.flip ? -18 : 18), y: sp.y - 44 * sp.s * 2 + 10, s: bk * 0.9, o: bk > 0.05 && sp.i % 2 === 0 ? 1 : 0 });
      });

      TW.forEach((m) => {
        const heard = es(t, 0.3 + (m.pair % 6) * 0.08, 0.6 + (m.pair % 6) * 0.08);
        // the first two pairs set off up the middle road
        const walker = m.pair < 2;
        const dep = walker ? seg(t, 2.18 + m.pair * 0.1 + (m.i % 2) * 0.05, 2.86 + m.pair * 0.1) : 0;
        const RP = [[m.x, m.y], [m.left ? 850 : 900, JY - 30], [880, 650], [896, 600]];
        const [x, y] = dep > 0 ? kf(dep, RP.map((p, i) => [i / (RP.length - 1), p])) : [m.x, m.y];
        const s = lerp(m.s, 0.5, ease.io(Math.max(0, (dep - 0.33) / 0.67)));
        const look = bump(t, 1.1, 1.95);
        m.p.set({ x, y, s, flip: dep > 0 ? x > 896 : !m.left, o: 1, walk: dep > 0 && dep < 1 ? t * 30 + m.i : undefined, armF: 14 + heard * 20 * (1 - go), armB: bump(t, 2.05, 2.5) * 30, head: -heard * 4 - look * 6, blink: blinkAt(T, m.seed) });
      });

      S.cam.x = -left * 30 + right * 30;
      S.cam.y = -es(t, 2.0, 2.5) * 50;
      S.cam.z = 1 + es(t, 2.0, 2.5) * 0.04;
    };
  },
};
