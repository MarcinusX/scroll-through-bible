// Mk 13,30–32 — a bright afternoon: the whole painted world — sky cloth, sun, hills, the city — with
// Jesus, the four and people of this generation, young and old, round him. Then heaven and earth pass
// away: the sky cloth rolls up like a scroll, the ground rows sink, and the bare dark stage is left —
// with Jesus and a glowing scroll of his words. Last, the day and the hour: sealed, high up in the
// Father's light; the angels on their strings do not know it, nor the Son — only the Father.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, olive, cypress, grass, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { FOUR, jerusalem, hourglass, angel, question, voiceRings, woman, man, PI } from './lib.js';

const GY = 690;

/** the words: a parchment scroll full of lines of light, on two rods; origin: top centre */
function wordsScroll(c, w = 440, h = 116) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 10), mix(C.parchment, C.halo, 0.35));
  let ln = '';
  for (let r = 0; r < 5; r++) {
    let x = -w / 2 + 26;
    const y = 20 + r * 19, end = w / 2 - 26 - (r === 4 ? 140 : c.rr(0, 30));
    while (x < end) { const l = Math.min(end - x, c.rr(14, 46)); ln += c.ribbon([[x, y + c.rr(-0.6, 0.6)], [x + l, y + c.rr(-0.6, 0.6)]], 3); x += l + c.rr(6, 10); }
  }
  s.x(ln, C.sunDeep, 'opacity=".75"');
  return `<circle cy="${h / 2}" r="${w * 0.7}" fill="url(#halo-glow)"/>` + s.out();
}
function rod(c, h = 116) {
  return sheet().p(c.cut(c.rect(-8, -10, 16, h + 20), 0.3, 6), C.wood2).p(c.cut(c.ell(0, -14, 7, 6, 10), 0.2, 3) + c.cut(c.ell(0, h + 14, 7, 6, 10), 0.2, 3), C.sun).out();
}
/** the sealed day: a sun-dial disc with cords and a big wax seal; origin centre */
function sealedDay(c, r = 46) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 6, 36), 0.4, 5), C.ochre).p(c.cut(c.circ(0, 0, r, 36), 0.4, 5), C.parchment);
  let marks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; marks += c.ribbon([[Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78], [Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92]], 2); }
  s.x(marks, C.inkSoft, 'opacity=".6"');
  s.p(c.ribbon([[-r - 8, -6], [r + 8, 8]], 6) + c.ribbon([[-8, -r - 8], [6, r + 8]], 6), C.terracotta);
  s.p(c.cut(c.blob(0, 0, 20, 19, 12, 0.14), 0.8, 4), shade(C.terracotta, -0.1)).p(c.cut(c.circ(0, 0, 13, 16), 0.3, 3), shade(C.terracotta, -0.25));
  s.x(c.poly(c.star(0, 0, 8, 3.5, 6, 0)), shade(C.terracotta, 0.3));
  return s.out();
}

export default {
  id: 'm13-words',
  beats: [
    { v: 30 },
    { v: 31, text: 'Niebo i ziemia przeminą,' },
    { v: 31, cont: true, text: 'ale słowa moje nie przeminą.' },
    { v: 32 },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const DAY = ['#bcd8d8', '#eaeccd', '#f7ecd0'];
    const STAGE = ['#1f1a1c', '#2a2226', '#3a2e2c'];
    const sk = sky(S, DAY);

    /* backstage: ropes and a batten (revealed when the world is gone) */
    const backL = S.layer({ par: 0.02, sh: 2 });
    let ropes = '';
    for (let x = -600; x < 2200; x += 90) ropes += `<path d="M${x} -900V${c.rr(380, 700).toFixed(0)}" stroke="rgba(210,190,160,.28)" stroke-width="1.4"/>`;
    backL.add(ropes + sheet().p(c.cut(c.rect(-1400, 60, 4400, 16), 0.3, 20), C.wood2).out());
    const fatherL = S.layer({ par: 0.03, sh: 1, flat: true });
    fatherL.add(`<g transform="translate(800 40)"><circle r="340" fill="url(#halo-glow)"/><path d="${c.poly([[-40, -60], [40, -60], [260, 700], [-260, 700]])}" fill="#fff3cf" opacity=".22"/></g>`);

    /* the sky cloth with its roller, the sun and clouds on strings (they fly out) */
    const clothL = S.layer({ par: 0.04, sh: 4 });
    const cloth = sheet();
    cloth.p(c.cut([[-1400, -1400], [3000, -1400], [3000, 520], [-1400, 520]], 0.3, 30), mix(DAY[0], DAY[1], 0.4));
    let painted = '';
    [[300, 250], [700, 170], [1150, 280], [1500, 160], [-100, 200]].forEach(([x, y]) => { painted += c.cut(c.blob(x, y, c.rr(90, 140), c.rr(20, 30), 12, 0.2), 0.6, 6); });
    cloth.x(painted, C.cream, 'opacity=".55"');
    clothL.add(cloth.out());
    clothL.add(sheet().p(c.cut(c.rect(-1400, 506, 4400, 26), 0.3, 20), C.wood2).p(c.cut(c.rect(-1400, 510, 4400, 8), 0.2, 20), C.wood3).out());
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1180, y: 170, len: 700 });
    const cls = [[560, 150, 180], [900, 110, 140]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 700 }) }));

    /* the earth: ground rows that sink away */
    const farL = S.layer({ par: 0.1, sh: 3 });
    const h1 = band(c, { y: 440, amps: [14, 6, 3], lens: [1000, 360, 130], color: C.hillFar, x0: -1400, x1: 3000 });
    farL.add(h1.markup + `<g transform="translate(640 446)">${jerusalem(c, 0.42, { tglow: false })}</g>`);
    const midL = S.layer({ par: 0.22, sh: 3 });
    midL.add(hillsWith(c, { y: 540, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 24, treeColor: C.sage, treeH: 22, x0: -1400, x1: 3000 }).markup + town(c, { x: 1240, y: 548, n: 6, spread: 240, sc: 0.55 }));
    const nearL = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(640, [5, 2], [700, 170]);
    nearL.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), C.hillNear).out() + grass(c, { x0: -800, x1: 2400, y: 640, fn: gfn, n: 40, h: 13, color: C.olive }) + flowers(c, { x0: 300, x1: 1300, y: 660, n: 24, fn: (x) => gfn(x) + 20 }) + olive(c, 230, 660, 1) + olive(c, 1400, 664, 0.9) + cypress(c, 1290, 650, 150));
    const stageFloor = S.layer({ par: 0.4, sh: 2 });
    stageFloor.add(sheet().p(c.cut([[-1400, 640], [3000, 640], [3000, 1800], [-1400, 1800]], 0.4, 20), mix(C.wood2, C.soilDark, 0.4)).x([0, 1, 2, 3, 4, 5].map((i) => c.ribbon([[-1400, 660 + i * i * 12], [3000, 660 + i * i * 12]], 1.4)).join(''), C.soilDark, 'opacity=".6"').out());

    /* this generation, the four, Jesus */
    const P = S.layer({ par: 0.5, sh: 5 });
    const GEN = [
      { o: { ...man(c), hair: C.greyHair, beard: 'full', beardColor: C.greyHair }, x: 420, s: 0.9 },
      { o: woman(c), x: 480, s: 0.88 },
      { o: crowdPerson(c, { hairStyle: 'short', beard: 'none' }), x: 530, s: 0.62 },
      { o: woman(c, { hair: C.greyHair }), x: 1070, s: 0.88 },
      { o: man(c), x: 1130, s: 0.92 },
      { o: crowdPerson(c, { hairStyle: 'curly', beard: 'none' }), x: 1180, s: 0.6 },
    ].map((g, i) => ({ ...g, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, g.o))) }));
    const pos = [600, 670, 930, 1000];
    const four = FOUR.map((f, i) => ({ ...f, i, x: pos[i], flip: pos[i] > 800, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, f.o))) }));
    const J = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 26, w: 4 });

    /* the hourglass of this generation; the scroll of his words; the sealed day; the angels */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const hg = fx.add(`<g><path d="M0 -1500V-50" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${hourglass(c, 100)}</g>`);
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB');
    const SW = 440, SH = 116;
    const scrollEl = fx.add(`<g>${wordsScroll(c, SW, SH)}</g>`);
    const rodL = fx.add(`<g>${rod(c, SH)}</g>`), rodR = fx.add(`<g>${rod(c, SH)}</g>`);
    const day = fx.add(`<g><path d="M0 -1500V-52" stroke="rgba(240,220,190,.5)" stroke-width="1.2"/><circle r="120" fill="url(#halo-glow)"/>${sealedDay(c)}</g>`);
    const angels = [[470, 380, false], [1130, 360, true]].map(([x, y, flip], i) => ({ x, y, flip, i, p: S.puppet(fx.add(angel(c))), q: fx.add(`<g>${question(c)}</g>`) }));
    const sonQ = fx.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      /* heaven and earth pass away (beat 1) */
      const roll = es(t, 1.05, 1.7, ease.in);
      const sink = [es(t, 1.2, 1.75, ease.in), es(t, 1.3, 1.85, ease.in), es(t, 1.4, 1.95, ease.in)];
      sk.blend(DAY, STAGE, es(t, 1.2, 1.9));
      clothL.shift(0, -roll * 1500);
      [farL, midL, nearL].forEach((L, i) => { L.shift(0, sink[i] * 900); });
      stageFloor.shift(0, (1 - es(t, 1.5, 1.95)) * 700);
      pose(sunEl, { x: 1180, y: 170 - roll * 700, r: Math.sin(T * 0.7) });
      cls.forEach((cl) => pose(cl.el, { x: cl.x, y: cl.y - es(t, 1.0, 1.5, ease.in) * 700, r: Math.sin(T * 0.6 + cl.i) * 1.3 }));
      fatherL.fade(es(t, 3.05, 3.45));

      /* this generation: stands round him (beat 0), fades with the world (beat 1) */
      GEN.forEach((g) => {
        const k = es(t, -0.3 + g.i * 0.05, 0.3 + g.i * 0.05);
        const gone = es(t, 1.3 + g.i * 0.04, 1.7 + g.i * 0.04);
        g.p.set({ x: g.x, y: GY + (g.i % 2) * 5 + gone * 60, s: g.s, flip: g.x > 800, o: k * (1 - gone), head: -4, blink: blinkAt(T, g.seed) });
      });
      const dim = es(t, 1.3, 1.8);
      four.forEach((m) => m.p.set({ x: m.x, y: GY + (m.i % 2) * 4, s: 0.94, flip: m.flip, o: 1 - dim * 0.35, head: -6 - es(t, 2.1, 2.4) * 6 - es(t, 3.1, 3.4) * 8, armF: m.k === 'john' ? es(t, 2.2, 2.5) * 40 : 0, blink: blinkAt(T, m.seed) }));

      /* Jesus: "Truly I tell you" (0), still standing when all is gone (1), holds out his words (2), looks up (3) */
      const solemn = bump(t, 0.05, 0.95), give = es(t, 2.05, 2.4) * (1 - es(t, 3.0, 3.2)), up = es(t, 3.1, 3.4);
      J.set({ x: 800, y: GY, s: 1.05, armB: 10 + solemn * 150 + up * 60, armF: 20 + give * 70 + up * 40, head: -up * 14 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(806, GY - 176, solemn + give * 0.6, T, { s0: 0.7 });

      /* the hourglass of this generation (beat 0) */
      const hk = es(t, 0.1, 0.45, ease.back) * (1 - es(t, 0.95, 1.2));
      pose(hg, { x: 800, y: lerp(-300, 250, hk) + Math.sin(T * 0.9) * 2, r: Math.sin(T * 0.8) * 1.4, o: hk > 0.01 ? 1 : 0 });
      const sd = seg(t, 0.1, 1.1);
      pose(sandT, { x: 0, y: -3, sy: 1 - sd * 0.4 });
      pose(sandB, { x: 0, y: 50, sy: 0.3 + sd * 0.4 });

      /* the words: a scroll of light unrolls (beat 2) and stays */
      const sIn = es(t, 1.95, 2.15), un = es(t, 2.05, 2.55);
      const sx = 800, sy = lerp(-250, 236, sIn) + es(t, 3.0, 3.4) * 44, ss = 1;
      pose(scrollEl, { x: sx, y: sy, s: ss, sx: Math.max(0.001, un), o: sIn > 0.01 ? 1 : 0 });
      pose(rodL, { x: sx - (SW / 2 * un + 6) * ss, y: sy, s: ss, o: sIn > 0.01 ? 1 : 0 });
      pose(rodR, { x: sx + (SW / 2 * un + 6) * ss, y: sy, s: ss, o: sIn > 0.01 ? 1 : 0 });

      /* the day and the hour: sealed, high in the Father's light (beat 3) */
      const dk = es(t, 3.05, 3.4, ease.back);
      pose(day, { x: 800, y: lerp(-200, 152, dk) + Math.sin(T * 0.8) * 3, r: Math.sin(T * 0.6) * 3, o: dk > 0.01 ? 1 : 0 });
      angels.forEach((a) => {
        const k = es(t, 3.15 + a.i * 0.08, 3.45 + a.i * 0.08, ease.out);
        a.p.set({ x: a.x, y: lerp(-200, a.y, k) + Math.sin(T * 1.4 + a.i) * 5, s: 0.62, flip: a.flip, o: k > 0.01 ? 1 : 0, armF: 60 + bump(t, 3.4, 3.9) * 30, armB: 40 + bump(t, 3.4, 3.9) * 50, head: -10, lean: 6 });
        const q = es(t, 3.4 + a.i * 0.06, 3.6 + a.i * 0.06, ease.back);
        pose(a.q, { x: a.x + (a.flip ? -24 : 24), y: lerp(-200, a.y, k) - 140, s: q * 0.9, r: Math.sin(T * 1.5 + a.i) * 6, o: q > 0.01 ? 1 : 0 });
      });
      const sq = es(t, 3.5, 3.7, ease.back);
      pose(sonQ, { x: 836, y: GY - 232, s: sq * 0.9, r: Math.sin(T * 1.4) * 5, o: sq > 0.01 ? 1 : 0 });

      S.cam.z = 1 + es(t, 1.8, 2.4) * 0.05 - es(t, 3.0, 3.4) * 0.05;
      S.cam.y = es(t, 1.8, 2.4) * 10 - es(t, 3.0, 3.4) * 30;
    };
  },
};
