// Mk 1,43–45 — Jesus sternly sends the healed man off: "Say nothing to anybody — show yourself to the priest"
// (a hanging inset: the Temple, the priest, the offering). But the man runs to the town telling everyone;
// the news jumps from mouth to mouth, the gate is jammed with people, and Jesus goes out to the deserted places —
// where people come to Him from everywhere.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, rock, sun, cloud, flowers, house } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LEPER_HEALED, headAt, voiceRings, bubble, priestPlate, scrub, acacia } from './lib.js';

const PI = Math.PI;
const P = 0.5;
const FEET = 742, JX = 770, MX = 905;
const GATE = 60, DESERT = 1560;

export default {
  id: 'm1-news',
  beats: [
    { v: 43 },
    { v: 44, text: 'mówiąc mu: «Uważaj, nikomu nic nie mów,' },
    { v: 44, cont: true, text: 'ale idź pokaż się kapłanowi i złóż za swe oczyszczenie ofiarę, którą przepisał Mojżesz, na świadectwo dla nich».' },
    { v: 45, text: 'Lecz on po wyjściu zaczął wiele opowiadać i rozgłaszać to, co zaszło,' },
    { v: 45, cont: true, text: 'tak że Jezus nie mógł już jawnie wejść do miasta, lecz przebywał w miejscach pustynnych.' },
    { v: 45, cont: true, text: 'A ludzie zewsząd schodzili się do Niego.' },
  ],
  cam: { x: [(420 - 800) / P, (DESERT - 60 - 800) / P], y: [0, 90], z: [0.94, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, ['#c7dcd7', '#ecebd6', '#f5ead0']);
    const warm = sky(S, ['#e8c9a4', '#f4dcb6', '#f8e7c9'], { name: 'warm' }).layer;
    warm.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1280, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 520, y: 140, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1400, y: 180, len: 700 });

    /* ---------- land: green around the town, desert rocks to the right ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 450, amps: [16, 7, 3], lens: [1000, 330, 120], color: C.hillFar, x0: -1400, x1: 3400 }).markup);
    const hills = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 520, amps: [20, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22, x0: -1400, x1: 1200 });
    hills.add(h2.markup);
    hills.add(band(c, { y: 530, amps: [30, 12, 3], lens: [700, 260, 100], color: C.dune, x0: 1000, x1: 3400 }).markup);
    // a path down the far hills: people come from there too
    const hillPath = [[1900, 470], [1760, 500], [1840, 530], [1700, 560], [1620, 600]];
    hills.add(sheet().p(c.ribbon(hillPath, (u) => 6 + u * 14, 1), C.sand).out());
    const hillWalkers = crowd(S, hills, [{ y: 0, s: 0.3, n: 6, x0: 0, x1: 6 }]).map((m, i) => ({ ...m, i }));

    const G = S.layer({ par: P, sh: 3 });
    const gfn = c.wave(620, [8, 3], [800, 200]);
    G.add(sheet().p(c.ridge(gfn, -1400, 3400, 1700, 12, 1), C.hillNear).out());
    const sand = [];
    for (let x = 1150; x <= 3400; x += 14) sand.push([x, gfn(x) - 1]);
    sand.push([3400, 1700], [760, 1700], [1000, 800], [1100, 700]);
    G.add(sheet().p(c.cut(sand, 1.4, 10), C.sand).out());
    G.add(sheet().p(c.ribbon([[-1400, 770], [300, 758], [800, 760], [1300, 752], [3400, 760]], 70, 2), mix(C.sand, C.cream, 0.3)).out());
    G.add(grass(c, { x0: -1400, x1: 1100, y: 620, fn: gfn, n: 50, h: 16, color: C.moss }) + flowers(c, { x0: 500, x1: 1100, y: 640, n: 12 }) + olive(c, 1000, 660, 0.9));
    G.add(rock(c, DESERT + 120, 700, 160, 70, C.rock2) + rock(c, DESERT - 200, 690, 110, 50, C.rock) + bush(c, DESERT + 300, 704, 50, C.olive) + acacia(c, DESERT + 420, 680, 1.1) + rock(c, DESERT + 20, 762, 120, 44, C.rock));
    // the town with its gate
    const tw = sheet();
    const hs = makeCutter('m1-news-town');
    let houses = '';
    for (let i = 0; i < 9; i++) houses += house(makeCutter('m1-nh' + i), GATE - 380 + i * 90 + hs.rr(-20, 20), 590 - hs.rr(0, 30), hs.rr(60, 90), hs.rr(40, 70), { stairs: false, lit: false });
    tw.raw(houses);
    const W0 = GATE - 420, W1 = GATE + 380, WT = 560;
    const wallPts = [[W0, 700], [W0, WT]];
    for (let x = W0; x < W1 - 14; x += 28) wallPts.push([x, WT], [x, WT - 14], [x + 14, WT - 14], [x + 14, WT]);
    wallPts.push([W1, WT], [W1, 700]);
    tw.p(c.cut(wallPts, 0.4, 8) + c.hole([[GATE - 46, 700], [GATE - 46, 620], ...c.arc(GATE, 620, 46, 46, PI, 2 * PI, 12), [GATE + 46, 700]], 0.3, 5), C.stone);
    tw.p(c.cut(c.rect(GATE - 90, WT - 40, 40, 140), 0.4, 6) + c.cut(c.rect(GATE + 50, WT - 40, 40, 140), 0.4, 6), C.stone2);
    G.add(tw.out());
    G.add(`<path d="${c.poly([[GATE - 46, 700], [GATE - 46, 620], ...c.arc(GATE, 620, 46, 46, PI, 2 * PI, 12), [GATE + 46, 700]])}" fill="${C.soilDark}" opacity=".85"/>`);

    /* ---------- people ---------- */
    const L = S.layer({ par: P, sh: 5 });
    const towns = crowd(S, L, [{ y: 712, s: 0.78, n: 9, x0: GATE - 300, x1: GATE + 330 }, { y: 760, s: 0.9, n: 4, x0: GATE - 200, x1: GATE + 300 }]);
    towns.forEach((m, i) => { m.d = (m.x - GATE + 300) / 700; m.gx = DESERT - 330 + (i % 7) * 42 + (i > 6 ? 20 : 0); m.gy = 748 + (i % 3) * 8; m.bub = L.add(`<g opacity="0">${bubble(i % 3 === 1 ? '?!' : '!', { size: 20, w: 32 })}</g>`); });
    const fromRight = crowd(S, L, [{ y: 752, s: 0.9, n: 6, x0: DESERT + 100, x1: DESERT + 420 }]);
    fromRight.forEach((m, i) => { m.from = m.x + 700; m.d = i * 0.06; });
    const man = S.puppet(L.add(person(c, LEPER_HEALED)));
    const manB = [0, 1, 2].map((i) => L.add(`<g opacity="0">${bubble('!', { size: 22, w: 30 })}</g>`));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    L.add(rock(c, DESERT - 14, FEET - 16, 118, 46, C.rock2));
    const jSit = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const DIS = [CAST.john, CAST.james, CAST.andrew, CAST.peter].map((cast, i) => ({ p: S.puppet(L.add(person(c, cast))), x: 380 + i * 85, i }));
    const jVoice = voiceRings(L, c, { n: 3, color: C.clay, r: 38, w: 5 });
    const hush = L.add(`<g opacity="0">${bubble(tr('Nikomu nic nie mów!', 'Say nothing to anybody!'), { size: 20, fill: C.halo })}</g>`);

    /* ---------- the inset: the priest and the offering ---------- */
    const PL = S.layer({ par: 0.3, sh: 7 });
    const inset = hanging(PL, `<g transform="scale(1.15)">${priestPlate(c)}</g>`, { x: 1020, y: 270, len: 800 });

    return (t, time) => {
      swing(sunEl, 1280, 150, time, 1, 0.6);
      swing(cl1, 520 + Math.sin(time * 0.1) * 20, 140, time, 1.2, 0.6, 1);
      swing(cl2, 1400 + Math.sin(time * 0.12 + 1) * 20, 180, time, 1.2, 0.7, 2);
      warm.fade(es(t, 4.2, 5.4) * 0.8);

      /* v43–44: stern words, then off to the priest */
      const stern = es(t, 0.1, 0.35) * (1 - es(t, 2.9, 3.1));
      const send = bump(t, 0.5, 1.0);
      const toPlate = es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.1));
      const leave = es(t, 4.02, 4.9);
      const jx = t < 4 ? JX : lerp(JX, DESERT, leave);
      const sit = es(t, 4.9, 4.97);
      jesus.set({ x: jx, y: FEET, s: 1.05, flip: false, o: 1 - sit, walk: leave > 0 && leave < 1 ? jx * 0.045 : undefined, armF: 14 + send * 76 + toPlate * 90 - es(t, 1.05, 1.2) * 0 , armB: 10 + stern * 130 * (1 - toPlate), head: stern * 6 - toPlate * 10, blink: blinkAt(time) });
      const welcome = es(t, 5.3, 5.7);
      jSit.set({ x: DESERT, y: FEET - 60, s: 1.0, o: sit, armF: 40 + welcome * 40, armB: 20 + welcome * 60, head: -welcome * 4, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, FEET, 1.05);
      jVoice(hx, hy, Math.max(stern * es(t, 0.1, 0.3), bump(t, 1.0, 2.9)) * (t < 3 ? 1 : 0), time, { dir: 1, spread: 2 });
      const hb = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(hush, { x: hx + 40, y: hy - 110, s: hb, o: hb > 0 ? 1 : 0 });
      const pIn = es(t, 2.05, 2.35, ease.out), pOut = es(t, 2.9, 3.15, ease.in);
      swing(inset, 1020, lerp(-420, 280, pIn) - pOut * 800, time, 1, 0.7);
      fade(inset, pIn > 0 ? 1 : 0);

      /* v45a: but he goes and tells everyone */
      const run = es(t, 3.05, 3.85);
      const mx = lerp(MX, GATE + 150, run);
      const bow = bump(t, 0.4, 1.0) + bump(t, 1.4, 1.9) * 0.6;
      man.set({ x: mx, y: FEET + 6, s: 1.0, flip: run > 0.02, walk: run > 0 && run < 1 ? mx * 0.07 : undefined, amt: 1.4, lean: run > 0 && run < 1 ? -8 : bow * 14, armF: 20 + run * 80 + Math.sin(time * 6) * 20 * run, armB: 10 + run * 120, head: bow * 12 - run * 8, blink: blinkAt(time, 3) });
      manB.forEach((b, i) => { const k = es(t, 3.15 + i * 0.22, 3.3 + i * 0.22, ease.back) * (1 - es(t, 3.9 + i * 0.1, 4.1 + i * 0.1)); const [bx, by] = headAt(lerp(MX, GATE + 150, es(t, 3.15 + i * 0.22, 3.2 + i * 0.22)), FEET, 1.0, true); pose(b, { x: bx - 30, y: by - 60 - i * 6, s: k, o: k > 0 ? 1 : 0 }); });

      /* the town hears it, crowds the gate, then streams out to Him in the desert */
      towns.forEach((m) => {
        const hear = es(t, 3.4 + m.d * 0.5, 3.55 + m.d * 0.5, ease.back) * (1 - es(t, 4.6, 4.8));
        const [bx, by] = headAt(m.x, m.y, m.s);
        pose(m.bub, { x: bx + 20, y: by - 44 + Math.sin(time * 2 + m.i) * 3, s: hear, o: hear > 0 ? 1 : 0 });
        const go = es(t, 5.02 + m.d * 0.3, 5.75 + m.d * 0.2);
        const out = es(t, 3.2 + m.d * 0.3, 3.55 + m.d * 0.3);
        const x0 = lerp(GATE, m.x, out), y0 = lerp(700, m.y, out);
        const x = lerp(x0, m.gx, go), y = lerp(y0, m.gy, go);
        const moving = (go > 0 && go < 1) || (out > 0 && out < 1);
        const talk = es(t, 3.4 + m.d * 0.5, 3.6 + m.d * 0.5) * (1 - es(t, 4.8, 5.0));
        m.p.set({ x, y, s: lerp(m.s, 0.9, go) * lerp(0.85, 1, out), o: seg(t, 3.15 + m.d * 0.3, 3.25 + m.d * 0.3), flip: moving ? (out < 1 ? m.x < GATE : false) : talk > 0.5 ? m.i % 2 === 0 : false, walk: moving ? x * 0.06 : undefined, armF: talk * 60 + (go >= 1 ? 30 : 0), armB: talk * (m.i % 2 ? 100 : 20), head: talk * Math.sin(time * 3 + m.i) * 4, blink: blinkAt(time, m.seed) });
      });
      fromRight.forEach((m) => {
        const k = es(t, 5.05 + m.d, 5.7 + m.d);
        const x = lerp(m.from, m.x, k);
        m.p.set({ x, y: m.y, s: m.s, flip: true, o: seg(t, 5.0 + m.d, 5.1 + m.d), walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: k >= 1 ? 30 : 10, blink: blinkAt(time, m.seed) });
      });
      hillWalkers.forEach((m) => {
        const u = seg(t, 5.05 + m.i * 0.08, 5.75 + m.i * 0.08);
        const n = hillPath.length - 1, f = u * n, k = Math.min(n - 1, Math.floor(f)), r = f - k;
        const x = lerp(hillPath[k][0], hillPath[k + 1][0], r), y = lerp(hillPath[k][1], hillPath[k + 1][1], r);
        m.p.set({ x, y, s: 0.3 + u * 0.12, flip: hillPath[k + 1][0] < hillPath[k][0], o: u > 0 && u < 1 ? 1 : 0, walk: u * 40 });
      });
      DIS.forEach((d) => {
        const k = es(t, 4.05 + d.i * 0.05, 4.95 + d.i * 0.05);
        const x = lerp(d.x, DESERT - 260 + d.i * 55, k);
        const alarm = es(t, 3.3, 3.6) * (1 - es(t, 4.0, 4.3));
        d.p.set({ x, y: FEET + (d.i % 2) * 6, s: 0.96, flip: alarm > 0.5, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 14 + alarm * 40, armB: alarm * (d.i % 2 ? 90 : 0), blink: blinkAt(time, d.i + 1) });
      });

      /* camera: the meeting on the road → the running man and the town → the desert */
      let cx = 820;
      if (t >= 3.0 && t < 4.0) cx = lerp(820, 450, es(t, 3.0, 3.8));
      else if (t >= 4.0) cx = lerp(450, DESERT - 90, es(t, 4.0, 4.95, ease.sine));
      S.cam.x = (cx - 800) / P;
      S.cam.z = 1.1 - es(t, 3.0, 3.6) * 0.08 + es(t, 4.0, 4.9) * 0.04 - es(t, 5.0, 5.8) * 0.12;
      S.cam.y = 60 - es(t, 5.0, 5.8) * 30;
    };
  },
};
