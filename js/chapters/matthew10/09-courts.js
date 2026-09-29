// Mt 10,17–20 — a darker stage. Four of the Twelve come into a pillared hall; from the arches dark figures watch
// and point. A council bench comes down and two are led before it; above, a shadow screen shows the synagogue
// (a rod raised — and a cloth drops over it). Then a dais with a governor and a king: the other two stand before
// them with a small light in their hands, and a knot of foreigners watches the light. Thaddaeus, alone before the
// thrones, is full of worry (a bubble of crossed-out words); an hourglass turns, and at that hour a slip of golden
// words floats down into his hands. The dove comes down over him and golden words go out to the listening rulers.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hallSet, INK, L6, elder, priest, throne, crown, helmet, wreath, addToHead, shadowPerson, silhouette, shadowScreen, thought, question, wordSlip, goldSlip, hourglass, spreadDove, lightShaft, spark, headAt, hand, tr, PI } from './lib.js';

const GY = 690;
const DIS = [
  { k: 'philip', o: L6.philip, x: 610 },
  { k: 'bartholomew', o: L6.bartholomew, x: 540 },
  { k: 'jamesA', o: L6.jamesA, x: 690 },
  { k: 'thaddaeus', o: L6.thaddaeus, x: 470 },
];

/** the council: a bench with five seated elders facing left, a table in front; origin world */
function councilFlat(c) {
  let out = '';
  const s = sheet();
  s.p(c.cut([[930, 656], [930, 600], [1280, 600], [1280, 656]], 0.4, 8), C.wood2);
  s.p(c.cut(c.rect(924, 592, 362, 12), 0.3, 8), C.wood);
  out += s.out();
  const E = [elder(c, 0, { pose: 'sit' }), priest(c, 0, { pose: 'sit' }), elder(c, 1, { pose: 'sit' }), priest(c, 1, { pose: 'sit' }), elder(c, 2, { pose: 'sit' })];
  E.forEach((m, i) => { out += `<g transform="translate(${975 + i * 62} ${600 - (i % 2) * 4}) scale(-0.76 0.76)">${m}</g>`; });
  const tb = sheet();
  tb.p(c.cut([[900, 700], [906, 646], [1240, 646], [1246, 700]], 0.4, 8), mix(C.wood, C.plumRobe, 0.2));
  tb.p(c.cut(c.rect(896, 638, 354, 12), 0.3, 8), C.wood3);
  tb.p(c.cut(c.rect(1040, 624, 60, 16), 0.3, 5), C.parchment);
  return out + tb.out();
}
/** a dais with steps and a hanging behind; origin world */
function dais(c) {
  const s = sheet();
  for (let i = 0; i < 3; i++) s.p(c.cut(c.rect(900 + i * 16, 690 - (i + 1) * 16, 360 - i * 32, 18), 0.4, 8), i % 2 ? C.stone : mix(C.stone2, C.plumRobe, 0.15));
  s.p(c.cut([[920, 642], [920, 380], [1240, 380], [1240, 642]], 0.5, 12), mix(C.plumRobe, C.terracotta, 0.3));
  let fr = '';
  for (let x = 930; x < 1240; x += 22) fr += c.cut([[x, 640], [x + 8, 640], [x + 4, 656]], 0.2, 3);
  s.p(fr, C.sun);
  s.p(c.cut(c.rect(910, 372, 340, 14), 0.3, 8), C.sun);
  return s.out();
}

export default {
  id: 'mt10-courts',
  beats: [
    { v: 17, text: 'Miejcie się na baczności przed ludźmi!' },
    { v: 17, cont: true, text: 'Będą was wydawać sądom i w swych synagogach będą was biczować.' },
    { v: 18 },
    { v: 19, text: 'Kiedy was wydadzą, nie martwcie się o to, jak ani co macie mówić.' },
    { v: 19, cont: true, text: 'W owej bowiem godzinie będzie wam poddane, co macie mówić,' },
    { v: 20 },
  ],
  cam: { x: [-40, 40], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const H = hallSet(S);
    const c = S.c;

    /* watchers in the arches */
    const watchL = S.layer({ par: 0.2, sh: 3 });
    const WATCH = [[390, 0.6], [1170, 0.62], [650, 0.5], [910, 0.52]].map(([x, s], i) => ({ x, s, i, p: S.puppet(watchL.add(shadowPerson(c, crowdPerson(c), mix(INK, C.plumRobe, 0.3)))) }));

    /* flats that come down: the council, the dais and thrones, the shadow screen, the hourglass */
    const flats = S.layer({ par: 0.3, sh: 6 });
    const council = flats.add(`<g>${councilFlat(c)}</g>`);
    const daisEl = flats.add(`<g>${dais(c)}</g>`);
    const thr = [990, 1150].map((x) => flats.add(`<g><g transform="scale(-1 1)">${throne(c)}</g></g>`));
    const GOV = { robe: C.linen, mantle: C.terracotta, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: C.sun, pose: 'sit' };
    const KING = { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.sun, pose: 'sit' };
    const rulers = [
      { p: S.puppet(flats.add(addToHead(person(c, GOV), `<g transform="translate(0 -4)">${wreath(c)}</g>`))), x: 990 },
      { p: S.puppet(flats.add(addToHead(person(c, KING), `<g transform="translate(-1 2)">${crown(c)}</g>`))), x: 1150 },
    ];
    const scrL = S.layer({ par: 0.26, sh: 6 });
    const SW = 280, SH = 170, SCX = 780, SCY = 90;
    const scr = scrL.add(`<g>${shadowScreen(c, SW, SH)}<path d="${c.cut([[-SW / 2, SH], [-SW / 2, 120], [-60, 110], [SW / 2, 116], [SW / 2, SH]], 0.6, 8)}" fill="${INK}"/><path d="${c.cut([[40, SH - 50], [40, 30], [70, 30], [70, SH - 50]], 0.4, 6) + c.cut(c.rect(34, 22, 42, 10), 0.3, 4)}" fill="${INK}"/></g>`);
    const kneel = S.puppet(scrL.add(shadowPerson(c, { ...L6.philip, pose: 'kneel' })));
    const rodMan = S.puppet(scrL.add(person(c, { ...silhouette({ hairStyle: 'wrap', beard: 'full' }, INK), holdF: `<path d="M-2 0L2 0L3 -70L-1 -70Z" fill="${INK}"/>` }).split(`fill="${C.blush}"`).join(`fill="${INK}"`)));
    const cloth = scrL.add(`<g>${sheet().p(c.cut([[-SW / 2 - 8, 0], [SW / 2 + 8, 0], [SW / 2 + 8, SH + 4], [-SW / 2 - 8, SH + 4]], 0.6, 8), shade(C.plumRobe, -0.3)).x(Array.from({ length: 6 }, (_, i) => c.ribbon([[-SW / 2 + 20 + i * 48, 4], [-SW / 2 + 24 + i * 48, SH]], 7)).join(''), shade(C.plumRobe, -0.45), 'opacity=".5"').out()}</g>`);
    const hg = scrL.add(`<g><path d="M0 -50V-2000" stroke="rgba(240,220,190,.4)" stroke-width="1.2"/><circle r="70" fill="url(#warm-glow)" opacity=".6"/>${hourglass(c, 90)}</g>`);
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB');

    /* the nations watching (beat 2) */
    const natL = S.layer({ par: 0.36, sh: 4 });
    const NATIONS = [0, 1, 2, 3, 4].map((i) => {
      const o = crowdPerson(c, { skin: [C.skin4, C.skin, C.skin3, C.skin2, C.skin4][i], hairStyle: ['wrap', 'curly', 'short', 'wrap', 'bald'][i], veil: [C.terracotta, C.ochre, C.stone, C.tealRobe, C.stone][i], robe: [C.ochreRobe, C.tealRobe, C.clayMantle, C.mauve, C.wheatRobe][i], beard: ['full', 'short', 'none', 'full', 'short'][i] });
      return { i, x: 300 + i * 46, p: S.puppet(natL.add(person(c, o))), seed: c.rr(0, 9) };
    });

    /* floor light and the people */
    const spot = H.flo.add(`<g><ellipse rx="260" ry="70" fill="url(#warm-glow)"/></g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const GUARD = { robe: mix(C.terracotta, C.clay, 0.4), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather, holdF: `<path d="M-2 10L2 10L3 -150L-1 -150Z" fill="${C.wood2}"/><path d="M-4 -150L1 -170L6 -150Z" fill="${C.rock2}"/>` };
    const guards = [0, 1].map((i) => ({ i, p: S.puppet(P.add(addToHead(person(c, GUARD), helmet(c)))), seed: c.rr(0, 9) }));
    const dis = DIS.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, d.o))) }));
    const TH = dis[3];

    /* worry, the given words, the dove, the words of light */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const testi = [2, 3].map(() => fx.add(`<g><circle r="30" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, 9, 3.4, 4, 0))}" fill="${C.star}"/></g>`));
    const beamT = fx.add(`<g><path d="${c.ribbon([[0, 0], [300, -40]], (u) => 10 - u * 6)}" fill="${C.lampGlow}" opacity=".35"/></g>`);
    const beamN = fx.add(`<g><path d="${c.ribbon([[0, 0], [-260, -20]], (u) => 10 - u * 6)}" fill="${C.lampGlow}" opacity=".35"/></g>`);
    const scribble = () => { let d = ''; for (let k = 0; k < 3; k++) d += c.ribbon([[-14, -6 + k * 6], [14, -8 + k * 6 + c.rr(-2, 2)]], 1.4); return `<path d="${d}" fill="${C.ink}" opacity=".5"/><path d="${c.ribbon([[-12, -10], [12, 8]], 2)}" fill="${C.terracotta}"/>`; };
    const worry = fx.add(`<g>${thought(c, `<g transform="translate(-14 -4) scale(.6)">${question(c)}</g><g transform="translate(14 2) scale(.9)">${scribble()}</g>`, { w: 96, h: 66 })}</g>`);
    const slips = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${wordSlip(c, 30)}</g>`), a: -PI * (0.2 + i * 0.15) }));
    const given = fx.add(`<g>${goldSlip(c, 56)}</g>`);
    const dv = fx.add(`<g><circle r="90" fill="url(#halo-glow)"/>${spreadDove(c)}</g>`);
    const ray = fx.add(`<g>${lightShaft(c, { w0: 20, w1: 70, h: 1200, o: 0.3 })}</g>`);
    const wordsL = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${goldSlip(c, 34)}</g>`) }));

    return (t, time) => {
      const T = time;
      H.update(T);

      /* watchers (beat 0) */
      WATCH.forEach((w) => {
        const k = es(t, 0.15 + w.i * 0.08, 0.4 + w.i * 0.08) * (1 - es(t, 2.9, 3.2));
        w.p.set({ x: w.x + (w.x < 800 ? -1 : 1) * (1 - k) * 60, y: 620, s: w.s, flip: w.x > 800, o: k, armF: k * 80, head: 4, blink: 0 });
      });

      /* council (beat 1) */
      const cIn = es(t, 1.0, 1.3, ease.out) * (1 - es(t, 2.0, 2.25));
      pose(council, { x: 0, y: -(1 - cIn) * 700, o: cIn > 0.001 ? 1 : 0 });
      const sIn = es(t, 1.3, 1.55, ease.back) * (1 - es(t, 2.0, 2.3));
      const sy = lerp(-400, SCY, sIn), sOn = sIn > 0.001 ? 1 : 0;
      pose(scr, { x: SCX, y: sy, o: sOn });
      kneel.set({ x: SCX - 30, y: sy + SH - 40, s: 0.4, o: sOn, head: 12, lean: 8 });
      const lash = bump(t, 1.38, 1.6);
      rodMan.set({ x: SCX - 90, y: sy + SH - 44, s: 0.42, o: sOn, armF: 40 + lash * 110, armB: 10 });
      const cl = es(t, 1.62, 1.86);
      pose(cloth, { x: SCX, y: sy, sy: Math.max(0.001, cl), o: sOn * (cl > 0.001 ? 1 : 0) });

      /* governors and kings (beats 2–5) */
      const dIn = es(t, 2.1, 2.4, ease.out);
      pose(daisEl, { x: 0, y: -(1 - dIn) * 700, o: dIn > 0.001 ? 1 : 0 });
      thr.forEach((el, i) => pose(el, { x: [990, 1150][i] + 20, y: 642 - (1 - dIn) * 700, o: dIn > 0.001 ? 1 : 0 }));
      const listen = es(t, 2.5, 2.8) * (1 - es(t, 3.0, 3.2)) + es(t, 5.3, 5.6);
      rulers.forEach((r, i) => r.p.set({ x: r.x + 12, y: 594 - (1 - dIn) * 700, s: 0.92, flip: true, o: dIn > 0.001 ? 1 : 0, lean: -listen * (i ? 7 : 4), head: listen * 6 - (1 - listen) * (i ? 4 : 0), armF: 20 + (i === 0 ? bump(t, 3.1, 3.7) * 60 : 0), blink: blinkAt(T, i + 3) }));
      NATIONS.forEach((n) => {
        const k = es(t, 2.3 + n.i * 0.05, 2.55 + n.i * 0.05) * (1 - es(t, 3.0, 3.25));
        n.p.set({ x: n.x - (1 - k) * 200, y: 640 + (n.i % 2) * 8, s: 0.72, o: k, walk: k > 0 && k < 1 ? t * 30 + n.i : undefined, head: -k * 6, armF: bump(t, 2.6, 3.0) * 50, blink: blinkAt(T, n.seed) });
      });

      /* the four: arrive and look about; led; stand before rulers; step back while Thaddaeus is led */
      dis.forEach((d) => {
        const enter = seg(t, -0.4 + d.i * 0.08, 0.35 + d.i * 0.08);
        let x = lerp(-200 - d.i * 70, d.x, ease.out(enter));
        let walking = enter > 0 && enter < 1, flip = false, armF = 14, armB = 0, head = 0, o = 1;
        const wary = es(t, 0.4, 0.55) * (1 - es(t, 1.0, 1.15));
        head = Math.sin(T * 1.6 + d.seed) * 8 * wary;
        if (wary > 0.5 && Math.sin(T * 0.8 + d.seed) > 0.4) flip = true;
        if (d.k === 'philip' || d.k === 'bartholomew') { const f = es(t, 1.05, 1.45) * (1 - es(t, 2.9, 3.3)); x += f * 190; walking = walking || (t > 1.05 && t < 1.45); head += es(t, 1.6, 1.8) * 12 * (1 - es(t, 2.1, 2.3)); o = 1 - es(t, 2.05, 2.3) * 0.4 + es(t, 2.9, 3.1) * 0.4; }
        if (d.k === 'jamesA') { const f = es(t, 2.2, 2.55) * (1 - es(t, 2.95, 3.3)); x += f * 180; walking = walking || (t > 2.2 && t < 2.55); armF += f * 60; }
        if (d.k === 'thaddaeus') {
          const f = es(t, 2.2, 2.55); x += f * 250; walking = walking || (t > 2.2 && t < 2.55); armF += f * 60 * (1 - es(t, 2.95, 3.1));
          const led = es(t, 3.05, 3.5); x = lerp(x, 800, led); walking = walking || (t > 3.05 && t < 3.5);
          const calm = es(t, 3.75, 3.95);
          head += es(t, 3.2, 3.4) * 12 * (1 - calm) - calm * 4;
          armF += es(t, 4.3, 4.6) * 50;
          armB += es(t, 5.2, 5.45) * 70;
        } else {
          const back = es(t, 3.05, 3.45);
          x = lerp(x, 360 + d.i * 70, back); walking = walking || (t > 3.05 && t < 3.45);
          o *= 1 - back * 0.45;
        }
        d.p.set({ x, y: GY + (d.i % 2) * 6, s: 0.94, flip, o, walk: walking ? x * 0.05 : undefined, armF, armB, head, blink: blinkAt(T, d.seed) });
        d.xNow = x;
      });
      guards.forEach((g) => {
        const inn = es(t, 0.95, 1.3) * (1 - es(t, 2.0, 2.3));
        const lead = es(t, 3.05, 3.5);
        const x = g.i === 0 ? lerp(lerp(1400, 900, inn), 690, lead) : lerp(-300, 380, inn);
        const walking = (t > 0.95 && t < 1.3) || (t > 2.0 && t < 2.3) || (g.i === 0 && t > 3.05 && t < 3.5);
        g.p.set({ x, y: GY + 4, s: 0.98, flip: g.i === 0 && lead < 0.5, o: g.i === 1 ? inn : Math.max(inn, lead), walk: walking ? x * 0.05 : undefined, armF: 12, armB: g.i === 0 ? lead * 30 : 0, blink: blinkAt(T, g.seed) });
      });
      pose(spot, { x: lerp(lerp(620, 760, es(t, 1, 2.3)), 800, es(t, 3.05, 3.5)), y: GY + 6, s: 1, o: 0.8 });

      /* testimony (beat 2) */
      testi.forEach((l, i) => {
        const d = dis[2 + i];
        const k = es(t, 2.5, 2.7, ease.back) * (1 - es(t, 2.95, 3.1));
        pose(l, { x: d.xNow + 56, y: GY - 120, s: k * (0.9 + Math.sin(T * 3 + i) * 0.1), o: k > 0.01 ? 1 : 0 });
      });
      const bm = es(t, 2.6, 2.8) * (1 - es(t, 2.95, 3.1));
      pose(beamT, { x: dis[3].xNow + 60, y: GY - 124, sx: bm, o: bm });
      pose(beamN, { x: dis[2].xNow + 40, y: GY - 124, sx: bm, o: bm });

      /* worry → the hour → the given words → the Spirit */
      const [px, py] = headAt(TH.xNow, GY + 6, 0.94, false);
      const wIn = es(t, 3.2, 3.4, ease.back), pop = es(t, 3.78, 3.92);
      pose(worry, { x: px + 6, y: py - 10, s: wIn * (1 + pop * 0.3), o: (1 - pop) * (wIn > 0.01 ? 1 : 0) });
      slips.forEach((sl) => {
        const k = es(t, 3.78, 4.2);
        pose(sl.el, { x: px + 30 + Math.cos(sl.a) * k * 140, y: py - 50 + Math.sin(sl.a) * k * 120 + k * k * 160, r: k * 200 * (sl.i % 2 ? 1 : -1), o: bump(t, 3.78, 4.25) });
      });
      const hk = es(t, 4.0, 4.25, ease.back) * (1 - es(t, 4.9, 5.1));
      const flip = es(t, 4.2, 4.4);
      pose(hg, { x: 640, y: lerp(-300, 250, hk), r: flip * 180, o: hk > 0.01 ? 1 : 0 });
      const run = es(t, 4.35, 4.95);
      pose(sandT, { y: -3, sy: Math.max(0.02, 1 - run) });
      pose(sandB, { y: 45, sy: Math.max(0.02, run) });
      const gv = es(t, 4.4, 4.75);
      const [ghx, ghy] = hand(TH.xNow, GY + 6, 0.94, false, 14 + es(t, 4.3, 4.6) * 50);
      pose(given, { x: lerp(640, ghx + 6, gv), y: lerp(300, ghy - 10, gv), r: Math.sin(T * 1.3) * 3 * (1 - gv), s: 1, o: gv > 0.01 ? 1 - es(t, 5.4, 5.6) * 0.6 : 0 });
      const dvIn = es(t, 5.0, 5.35, ease.out);
      pose(dv, { x: px + 6, y: lerp(-150, py - 86, dvIn) + Math.sin(T * 2) * 4 * dvIn, s: 0.9, o: dvIn > 0.01 ? 1 : 0 });
      pose(ray, { x: px + 6, y: GY + 4, o: dvIn });
      wordsL.forEach((w) => {
        const on = es(t, 5.3, 5.5);
        const k = T ? ((T * 0.35 + w.i / 6) % 1) : (w.i + 0.5) / 6;
        const x = lerp(px + 30, 990, k), y = lerp(py + 10, 520, k) - Math.sin(k * PI) * 60;
        pose(w.el, { x, y, r: -10 + k * 20, s: 0.8 + 0.3 * Math.sin(k * PI), o: on * Math.sin(k * PI) });
      });

      S.cam.z = 1 + es(t, 4.9, 5.4) * 0.05;
      S.cam.x = es(t, 4.9, 5.4) * 20;
      S.cam.y = es(t, 4.9, 5.4) * 10;
    };
  },
};
