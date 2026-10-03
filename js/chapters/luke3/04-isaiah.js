// Łk 3,4–6 — Isaiah's scroll comes down and unrolls; below it the whole landscape answers John's cry.
// On a rock at the left John cries out, and across the plain in front of him the land obeys the prophecy one
// line at a time: a way is laid, piece by piece, towards the mountains; the valley in the far ridge fills up to
// the brim; the hill and the great mountain sink into the plain; the winding road is pulled straight; the
// boulders roll off it and its ruts close up, smooth and pale. Then, where the mountain stood, a great light
// rises at the end of the road, and people come from every side to look at it: the salvation of God.
import { C, person, blinkAt, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, sun, cloud, grass } from '../../assets/nature.js';
import { scrollParts } from '../mark1/lib.js';
import {
  JOHN_B, headAt, voiceRings, hang2, standRock, medal, ISAIAH, sparkle, folk, group, lightDisc, rays, MORNING, KINGDOM,
  tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const HY = 560;                          // the far edge of the plain
const JX0 = 512, JY = 700;               // John on his rock
const LX = 1102;                         // where the light rises (the mountain's place)
// the road across the plain: u 0 (front) … 1 (the horizon)
const rw = (u) => 7 + 46 * Math.pow(1 - u, 1.2);
const straightX = (u) => lerp(600, LX - 12, u);
const crookX = (u) => straightX(u) + Math.sin(u * PI * 2.2) * 26 * (1 - u);
const baseY = (u) => lerp(734, HY + 4, Math.pow(u, 0.8));
const crookY = (u) => baseY(u) + Math.sin(u * PI * 3.4 + 0.4) * (40 * (1 - u) + 3);
const ry = baseY;

function roadPiece(c, xf, u0, u1, yf = baseY, j = 0.8) {
  const L = [], R = [];
  for (let i = 0; i <= 16; i++) { const u = lerp(u0, u1, i / 16), x = xf(u), y = yf(u), w = rw(u) / 2; L.push([x, y - w * 0.55]); R.push([x, y + w * 0.55]); }
  return c.cut([...L, ...R.reverse()], j, 8);
}

export default {
  id: 'lk3-isaiah',
  beats: [
    { v: 4, text: 'jak jest napisane w księdze mów proroka Izajasza:' },
    { v: 4, cont: true, text: 'Głos wołającego na pustyni:' },
    { v: 4, cont: true, text: 'Przygotujcie drogę Panu, prostujcie ścieżki dla Niego! Każda dolina niech będzie wypełniona,' },
    { v: 5, text: 'każda góra i pagórek zrównane,' },
    { v: 5, cont: true, text: 'drogi kręte niech się staną prostymi,' },
    { v: 5, cont: true, text: 'a wyboiste drogami gładkimi!' },
    { v: 6 },
  ],
  cam: { x: [-30, 40], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, MORNING);
    const gold = sky(S, KINGDOM, { name: 'gold' }).layer;
    gold.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1300, y: 140, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 560, y: 190, len: 700 });

    /* the light of salvation, behind the mountain (rises on the last line) */
    const lightL = S.layer({ par: 0.06, sh: 1, flat: true });
    const light = lightL.add(`<g><circle r="360" fill="url(#halo-glow)"/>${rays(c, { n: 22, r0: 40, r1: 1200, spread: 0.04, color: '#fff3cf' })}<circle r="70" fill="#fff6dc"/><circle r="52" fill="#fffaf0"/></g>`);

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 520, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.hillFar, 0.5) }).markup);

    /* the relief behind the far edge: the hill, the mountain with its zigzag road, the gorge and its filling */
    const relief = S.layer({ par: 0.15, sh: 4 });
    const ms = sheet();
    const MM = (pts) => pts.map(([x, y]) => [x + 20, y]);
    ms.p(c.cut(MM([[850, 600], [930, 470], [1000, 380], [1050, 318], [1082, 292], [1120, 330], [1180, 400], [1240, 480], [1320, 600]]), 1.2, 9), mix(C.duskViolet, C.rock2, 0.45));
    ms.p(c.cut(MM([[1050, 318], [1082, 292], [1120, 330], [1102, 344], [1086, 330], [1066, 344]]), 0.5, 5), C.cream);
    ms.p(c.ribbon(MM([[905, 562], [1010, 506], [960, 462], [1062, 420], [1016, 380], [1088, 334], [1150, 384], [1112, 424], [1210, 476], [1150, 520], [1280, 566]]), 7, 0.8), mix(C.sand, C.cream, 0.5));
    const mountain = relief.add(`<g>${ms.out()}</g>`);
    const hs = sheet();
    hs.p(c.cut([[830, 600], [870, 520], [920, 476], [960, 482], [1000, 530], [1030, 600]], 1, 8), mix(C.sage, C.hillMid, 0.4));
    hs.p(c.ribbon([[850, 562], [920, 490], [975, 504], [1015, 566]], 6, 0.6), mix(C.sand, C.cream, 0.5));
    const hill = relief.add(`<g>${hs.out()}</g>`);
    const dustEls = [0, 1, 2, 3, 4, 5].map((i) => relief.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 40, 16, 10, 0.2), 0.8, 6), mix(C.sand, C.cream, 0.3)).out()}</g>`));
    const gorgeL = S.layer({ par: 0.15, sh: 2 });
    gorgeL.add(sheet().p(c.cut([[530, 556], [600, 640], [690, 712], [780, 640], [840, 556]], 0.8, 6), mix(C.soilDark, C.duskViolet, 0.35)).p(c.cut([[560, 560], [620, 630], [690, 690], [640, 600]], 0.5, 6), mix(C.soil, C.duskViolet, 0.3)).out());
    const plugL = S.layer({ par: 0.15, sh: 3 });
    const plugS = sheet();
    plugS.p(c.cut([[534, 559], [836, 559], [836, 760], [534, 760]], 0.6, 8), mix(C.wheatGreen, C.sage, 0.35));
    plugS.x(c.ribbon([[538, 562], [832, 562]], 3), C.moss);
    let fl = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(545, 825), y = c.rr(566, 700); fl += c.cut(c.star(x, y, 4 + (y - 560) * 0.02, 2, 5, 0.3), 0.2, 2); }
    plugS.x(fl, C.cream);
    let fl2 = '';
    for (let i = 0; i < 18; i++) { const x = c.rr(545, 825), y = c.rr(566, 700); fl2 += c.cut(c.circ(x, y, 2.4 + (y - 560) * 0.015, 6), 0.2, 2); }
    plugS.x(fl2, C.sun);
    const plug = plugL.add(`<g>${plugS.out()}</g>`);

    /* the plain, its far edge notched by the valley */
    const plain = S.layer({ par: 0.15, sh: 3 });
    const pts = [];
    for (let x = -900; x <= 540; x += 40) pts.push([x, HY + Math.sin(x * 0.01) * 2]);
    pts.push([550, HY], [606, 628], [690, 704], [774, 628], [822, HY]);
    for (let x = 860; x <= 2500; x += 40) pts.push([x, HY + Math.sin(x * 0.01) * 2]);
    pts.push([2500, 1700], [-900, 1700]);
    const ps = sheet();
    ps.p(c.cut(pts, 0.8, 10), mix(C.hillNear, C.sand, 0.45));
    ps.p(c.ridge(c.wave(640, [4, 2], [500, 140]), -900, 2500, 1700, 14, 1), mix(C.hillNear, C.sand, 0.3));
    plain.add(ps.out());
    plain.add(grass(c, { x0: -900, x1: 530, y: HY + 2, n: 22, h: 10, color: C.moss }) + grass(c, { x0: 840, x1: 2500, y: HY + 2, n: 30, h: 10, color: C.moss }));

    /* the road: laid piece by piece (crooked), then pulled straight; boulders and ruts, then smooth */
    const roadL = S.layer({ par: 0.3, sh: 2 });
    const N = 8;
    const crooked = Array.from({ length: N }, (_, i) => roadL.add(`<g>${sheet().p(roadPiece(c, crookX, i / N, (i + 1) / N + 0.006, crookY), mix(C.sand, C.dune, 0.45)).out()}</g>`));
    const straightRough = roadL.add(`<g>${sheet().p(roadPiece(c, straightX, 0, 1), mix(C.sand, C.dune, 0.45)).out()}</g>`);
    const smooth = roadL.add(`<g>${sheet().p(roadPiece(c, straightX, 0, 1, baseY, 0.3), mix(C.sand, C.cream, 0.62)).x(c.ribbon([[straightX(0.02), ry(0.02)], [straightX(1), ry(1)]], 2), C.cream, 'opacity=".7"').out()}</g>`);
    const RUTS = [0.12, 0.3, 0.48, 0.64].map((u, i) => ({ u, i, el: roadL.add(`<g><path d="${c.cut(c.blob(0, 0, 8 + (1 - u) * 16, 2.5 + (1 - u) * 4, 10, 0.25), 0.6, 4)}" fill="${mix(C.soil, C.dune, 0.4)}" opacity=".8"/></g>`) }));
    const ROCKS = [0.06, 0.2, 0.38, 0.54, 0.72].map((u, i) => ({ u, i, w: 14 + (1 - u) * 26, el: roadL.add(`<g>${rock(c, 0, 0, 14 + (1 - u) * 26, 8 + (1 - u) * 14, i % 2 ? C.rock : C.rock2)}</g>`), side: i % 2 ? 1 : -1 }));
    const puffs = [0, 1, 2, 3, 4].map(() => roadL.add(`<g>${sparkle(c, 16)}</g>`));

    /* people from every side, come to see (sprites) */
    const crowdL = S.layer({ par: 0.3, sh: 4 });
    const GROUPS = [[1, 880, 724, 0.66, 3], [-1, 690, 640, 0.48, 3], [1, S.portrait ? 985 : 1040, 660, 0.5, 3], [-1, 880, 604, 0.36, 4], [1, S.portrait ? 1040 : 1210, 612, 0.36, 3], [-1, 1010, 580, 0.26, 4]].map(([side, x, y, s, n], i) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 34 + c.rr(-5, 5), y: c.rr(-4, 4), s: k === n - 1 && i % 2 ? 0.62 : 1, flip: false, o: folk(c) }));
      return { side, x, y, i, sp: crowdL.sprite(`<g transform="scale(${s})">${group(c, mem)}</g>`, x, y) };
    });

    /* John on his rock */
    const JX = S.portrait ? 550 : JX0;   // phone: John and his rock clear of the left edge
    const act = S.layer({ par: 0.3, sh: 5 });
    act.add(`<g transform="translate(${JX} ${JY})">${standRock(c, 190, 110)}</g>`);
    const john = S.puppet(act.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(act, c, { n: 4, color: C.clay, r: 44, w: 6, both: false });

    /* from the flies: Isaiah and his book */
    const fly = S.layer({ par: 0.1, sh: 6 });
    const isaiah = hanging(fly, medal(S, ISAIAH, { r: 54, rim: C.haloRim, back: mix(C.plumRobe, C.cream, 0.6), name: tr('prorok Izajasz', 'Isaiah the prophet'), size: 20 }), { x: 0, y: -1500, len: 700 });
    const sp = scrollParts(c, { w: 330, h: 160, title: tr('Księga Izajasza', 'The Book of Isaiah'), lines: 5 });
    const scrollEl = fly.add(hang2(`<g data-k="i-sheet">${sp.sheet}</g><g data-k="i-rodB">${sp.rod}</g><g>${sp.rod}</g><g data-k="i-mark"><path d="${c.ribbon([[-44, 0], [44, 0]], 6)}" fill="${C.sun}" opacity=".75"/></g>`, 150, 600));
    const sheetEl = S.$('i-sheet'), rodB = S.$('i-rodB'), mark = S.$('i-mark');

    return (t, time) => {
      swing(sunEl, 1300, 140, time, 1, 0.6);
      swing(cl1, 560 + Math.sin(time * 0.1) * 20, 190, time, 1.2, 0.6, 1);

      /* v4a — Isaiah and his book */
      const pk = es(t, 0.05, 0.4, ease.out), pUp = es(t, 1.8, 2.15, ease.in);
      swing(isaiah, S.portrait ? 985 : 1050, lerp(-600, 250, pk) - pUp * 800, time, 1.2, 0.7);
      fade(isaiah, pk > 0.01 && pUp < 1 ? 1 : 0);
      const down = es(t, 0.15, 0.5, ease.out), unroll = es(t, 0.45, 0.75), up = es(t, 1.8, 2.1);
      pose(scrollEl, { x: lerp(760, 820, up), y: lerp(-500, 120, down) - up * 36, s: 1 - up * 0.3, r: Math.sin(time * 0.6) * 0.6 });
      pose(sheetEl, { sy: 0.03 + unroll * 0.97 });
      pose(rodB, { y: unroll * 160 });
      const line = t < 1 ? -1 : Math.min(4, Math.floor(t) - 1);
      const lf = t - Math.floor(t);
      pose(mark, { x: -96 + seg(lf, 0.08, 0.7) * 170, y: 62 + Math.max(0, line) * 16.8 + 2, sx: 0.8, o: line >= 0 && unroll > 0.95 ? 0.85 : 0 });

      /* v4b — the voice crying in the wilderness (and it keeps crying over the land) */
      const cry = es(t, 1.05, 1.3);
      const point = es(t, 2.02, 2.2) * (1 - es(t, 5.9, 6.1));
      const awe = es(t, 6.05, 6.3);
      john.set({ x: JX, y: JY - 4, s: 0.96, armF: 20 + cry * 70 * (1 - point) + point * 88 - awe * 20, armB: 10 + cry * 140 * (1 - point * 0.5) + awe * 40, head: -cry * 12 + point * 4 - awe * 10, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, JY - 4, 0.96);
      voice(hx + 14, hy + 2, cry * (1 - es(t, 5.9, 6.05)) * seg(t, 1.1, 1.25), time, { spread: 4, s0: 0.6, speed: 0.35, dir: 1, off: 4 });

      /* v4c — the way is laid, piece by piece; the valley fills to the brim */
      const straightK = es(t, 4.2, 4.5);
      crooked.forEach((el, i) => {
        const k = es(t, 2.08 + i * 0.05, 2.2 + i * 0.05);
        pose(el, { y: (1 - k) * 12, o: k * (1 - straightK) });
      });
      pose(plug, { y: lerp(160, 0, es(t, 2.42, 2.74, ease.out)) });

      /* v5a — every mountain and hill brought low */
      const sinkH = es(t, 3.05, 3.45, ease.in), sinkM = es(t, 3.12, 3.62, ease.in);
      pose(hill, { y: sinkH * 150 });
      pose(mountain, { y: sinkM * 330, x: Math.sin(t * 60) * 2 * bump(t, 3.1, 3.6) });
      dustEls.forEach((d, i) => {
        const k = bump(t, 3.08 + (i % 3) * 0.08, 3.7 + (i % 3) * 0.06);
        const x = i < 2 ? 870 + i * 120 : 1030 + (i - 2) * 110;
        pose(d, { x, y: HY - 8 - k * 20, s: 0.6 + k * 0.8, o: k * 0.9 });
      });

      /* v5b — the crooked is pulled straight; v5c — the rough ways made smooth */
      fade(straightRough, straightK * (1 - es(t, 5.3, 5.5)));
      const smoothK = es(t, 5.3, 5.55);
      fade(smooth, smoothK);
      ROCKS.forEach((r) => {
        const x = lerp(crookX(r.u), straightX(r.u), straightK);
        const y0 = lerp(crookY(r.u), baseY(r.u), straightK);
        const off = es(t, 5.05 + r.i * 0.05, 5.3 + r.i * 0.05);
        const rx = x + off * (40 + (1 - r.u) * 60), rY = y0 + off * r.side * (40 + (1 - r.u) * 30) - Math.sin(off * PI) * (26 + (1 - r.u) * 30);
        pose(r.el, { x: rx, y: rY, r: off * r.side * 240, o: seg(t, 2.08 + r.u * 0.4, 2.2 + r.u * 0.4) * (1 - seg(t, 5.3, 5.36)) });
      });
      RUTS.forEach((r) => {
        const x = lerp(crookX(r.u), straightX(r.u), straightK);
        pose(r.el, { x: x + 20, y: lerp(crookY(r.u), baseY(r.u), straightK) + 2, sx: 1 - es(t, 5.2 + r.i * 0.05, 5.4 + r.i * 0.05) * 0.9, o: seg(t, 2.1 + r.u * 0.4, 2.2 + r.u * 0.4) * (1 - es(t, 5.3 + r.i * 0.05, 5.45 + r.i * 0.05)) });
      });
      puffs.forEach((p, i) => {
        const u = 0.1 + i * 0.18, k = Math.max(bump(t, 4.2 + i * 0.03, 4.55 + i * 0.03), bump(t, 5.3 + i * 0.03, 5.6 + i * 0.03));
        pose(p, { x: straightX(u), y: ry(u) + (i % 2 ? 1 : -1) * rw(u) * 0.5 - 8, s: k * (0.5 + (1 - u)), r: t * 90, o: k });
      });

      /* v6 — the light rises at the end of the straight road; all people come to see it */
      const see = es(t, 6.05, 6.5, ease.out);
      pose(light, { x: S.portrait ? 1045 : LX, y:   // phone: the light rises clear of the thread
        lerp(700, 470, see), s: 0.5 + see * 0.5, r: t * 4, o: see });
      gold.fade(see * 0.7);
      GROUPS.forEach((g) => {
        const k = es(t, 6.12 + g.i * 0.04, 6.45 + g.i * 0.04);
        g.sp.set({ x: g.x + g.side * (1 - k) * 260 * (g.y > 650 ? 1.4 : 0.7), y: g.y - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 20)) * 3 : 0), o: k > 0.01 ? 1 : 0 });
      });

      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.03 + es(t, 2.0, 2.3) * 0.03 - es(t, 6.0, 6.5) * 0.04;
      S.cam.x = -es(t, 1.0, 1.4) * 20 + es(t, 2.0, 2.3) * 40 * (1 - es(t, 6.0, 6.4) * 0.5);
      S.cam.y = 10 + es(t, 2.0, 2.3) * 30 - es(t, 6.0, 6.5) * 50;
    };
  },
};
