// J 5,19–20 — a carpenter's workshop, like the one in Nazareth. Through the arched window pours the Father's
// light (never a figure) onto the left end of the long bench. "Truly, truly": Jesus turns to the leaders in the
// doorway. The Son can do nothing of Himself, but what He sees the Father doing — in the light a golden spark
// draws a dove on the plank, and Jesus watches. Whatever He does, the Son does likewise — stroke for stroke He
// cuts the very same dove in wood. The Father loves the Son (a heart floats down the beam) and shows Him all He
// does: little plates of creation come down the light. Greater works He will show Him — a man standing up with
// his mat, an open tomb shining — and the leaders at the door stare in wonder.
import { C, person, CAST, blinkAt, lerp, mix, shade, sheet } from '../kit.js';
import { bird, fish } from '../../assets/things.js';
import { olive } from '../../assets/nature.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import {
  workshopSet, workbench, DOVE, leaderOpts, withFace, faceBits, heart, hungPlate, spark, voiceRings, beamGrad, lightBeam, matRoll, HEALED, tombIcon,
  bang, vis, kf, headAt, handAt, tr, PI,
} from './lib.js';

const F = 700;
const BY = F - 72;               // the bench top
const LD = { x: 640, y: BY - 58 }, RD = { x: 900, y: BY - 58 };
const DS = 1.5;

export default {
  id: 'j5-son',
  beats: [
    { v: 19, text: 'W odpowiedzi na to Jezus im mówił: «Zaprawdę, zaprawdę, powiadam wam:' },
    { v: 19, cont: true, text: 'Syn nie mógłby niczego czynić sam od siebie, gdyby nie widział Ojca czyniącego.' },
    { v: 19, cont: true, text: 'Albowiem to samo, co On czyni, podobnie i Syn czyni.' },
    { v: 20, text: 'Ojciec bowiem miłuje Syna i ukazuje Mu to wszystko, co On sam czyni,' },
    { v: 20, cont: true, text: 'i jeszcze większe dzieła ukaże Mu, abyście się dziwili.' },
  ],
  cam: { x: [-60, 230], y: [-80, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const W = workshopSet(S, { floor: F });
    const bid = beamGrad(S, 'beam');

    /* the beam of light from the window onto the bench */
    const beamL = S.layer({ par: 0.34, sh: 0, flat: true });
    const beam = beamL.add(`<g>${lightBeam(bid, 140, 300, 240)}</g>`);

    /* the leaders in the doorway */
    const L = S.layer({ par: 0.45, sh: 5 });
    const LEAD = [0, 1].map((i) => {
      const el = L.add(withFace(person(c, leaderOpts(i + 1)), faceBits(c)));
      return { i, el, p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), seed: c.rr(0, 9) };
    });
    const bangs = [0, 1].map(() => L.add(`<g>${bang(c, C.terracotta, 1)}</g>`));

    /* Jesus behind the bench */
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(L, c, { n: 3, color: C.halo, r: 30, w: 5 });

    /* the bench and the two doves: one drawn in light, one cut in wood */
    const B = S.layer({ par: 0.45, sh: 6 });
    B.add(`<g transform="translate(790 ${F})">${workbench(c, 560)}</g>`);
    const benchGlow = B.add(`<g><ellipse rx="150" ry="60" fill="url(#halo-glow)"/></g>`);
    const dPath = c.poly(DOVE);
    const lightDove = B.add(`<g><path d="${dPath}" fill="${C.halo}" class="fill" opacity="0"/><path class="ln" d="${dPath}" pathLength="1" stroke="${C.sun}" stroke-width="4" stroke-linejoin="round" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none"/></g>`);
    const woodDove = B.add(`<g><path d="${c.cut(DOVE, 0.6, 5)}" class="fill" fill="${C.wood3}" opacity="0"/><path class="ln" d="${dPath}" pathLength="1" stroke="${C.wood2}" stroke-width="3.4" stroke-linejoin="round" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none"/></g>`);
    const LDl = lightDove.querySelector('.ln'), LDf = lightDove.querySelector('.fill');
    const WDl = woodDove.querySelector('.ln'), WDf = woodDove.querySelector('.fill');
    const lp = LDl;
    const sparkL = B.add(`<g>${spark(c, 12)}</g>`);
    const chip = B.add(`<g><path d="${c.ribbon(c.arc(0, 0, 5, 4, 0, PI * 1.6, 8), 2)}" fill="${C.wood3}"/></g>`);
    const chisel = B.add(`<g>${sheet().p(c.cut([[-3, 0], [3, 0], [3, 34], [-3, 34]], 0.2, 3), C.wood2).p(c.cut([[-2.4, 34], [2.4, 34], [1.6, 48], [-1.6, 48]], 0.2, 3), C.rock3).out()}</g>`);

    /* the works shown in the light */
    const X = S.layer({ par: 0.36, sh: 5 });
    const loveH = X.add(`<g><circle r="40" fill="url(#warm-glow)"/>${heart(c, 18)}</g>`);
    const icons = [
      `<path d="${c.cut(c.star(0, 0, 26, 18, 12, 0), 0.3, 3)}" fill="${C.sunDeep}"/><path d="${c.cut(c.circ(0, 0, 17, 16), 0.3, 3)}" fill="${C.sun}"/>`,
      `<g transform="translate(0 28) scale(.34)">${olive(c, 0, 0, 1)}</g>`,
      `<g transform="scale(1.4)">${bird(c)}</g>`,
      `<g transform="scale(1.3)">${fish(c)}</g>`,
    ];
    const works = icons.map((ic, i) => ({ i, el: X.add(hungPlate(c, ic, { r: 38 })) }));
    const greater = [
      `<g transform="translate(-6 54) scale(.42)">${person(c, HEALED)}</g><g transform="translate(-12 -8) rotate(28) scale(.34)">${matRoll(c, 110)}</g>`,
      `<g transform="translate(0 14) scale(1.5)">${tombIcon(c, { open: true })}</g>`,
    ].map((ic, i) => ({ i, el: X.add(hungPlate(c, ic, { r: 62, rim: C.sun })) }));

    const LX = S.portrait ? [1135, 1195] : [1250, 1330];   // phone: the men at the door stand within reach of the camera
    return (t, time) => {
      const T = time;
      const lit = es(t, 0.1, 0.6);
      fade(W.winLight, 0.5 + lit * 0.5);
      pose(W.winLight, { x: 600, y: 300, s: 0.9 + lit * 0.1 + Math.sin(T * 0.8) * 0.01 });
      beamL.fade(0.3 + lit * 0.7);
      pose(beam, { x: 600, y: 400, r: -4 });

      /* v19a — "Truly, truly, I tell you" — to the men at the door */
      const toDoor = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1)) + es(t, 4.1, 4.3) * 0.6;
      const watch = es(t, 1.1, 1.3) * (1 - es(t, 3.0, 3.2));
      const work = seg(t, 2.1, 2.85);
      const cut = t > 2.1 && t < 2.9 ? 1 : 0;
      const love = es(t, 3.1, 3.4) * (1 - es(t, 4.05, 4.2));
      jesus.set({ x: 990, y: F - 8, s: 1.02, flip: toDoor < 0.5, armF: 20 + bump(t, 0.1, 0.95) * 50 + cut * (70 + Math.sin(work * PI * 8) * 8) + love * 40, armB: 10 + love * 50, head: watch * 10 + cut * 16 - love * 6, lean: cut * -6, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(990, F - 8, 1.02, false);
      voice(jhx + 22, jhy + 8, bump(t, 0.1, 0.95), T, { dir: 1 });
      // phone: while the camera is on the bench they wait outside the door, then step in again
      const back = S.portrait ? (es(t, 0.95, 1.25) * (1 - es(t, 3.95, 4.3))) * 170 : 0;
      LEAD.forEach((l) => {
        const marvel = es(t, 4.35, 4.6);
        l.p.set({ x: LX[l.i] + back, walk: back > 0 && back < 170 ? back * 0.09 : undefined, y: F + 4 - l.i * 6, s: 0.98, flip: true, armF: 20 + marvel * 60, armB: 10 + marvel * (l.i ? 130 : 90), head: -marvel * 10, lean: marvel * 4, blink: blinkAt(T, l.seed) });
        attr(l.angry, 'opacity', (0.7 * (1 - marvel)).toFixed(2));
      });
      bangs.forEach((b, i) => {
        const k = es(t, 4.45 + i * 0.08, 4.65 + i * 0.08, ease.back);
        const [hx, hy] = headAt(LX[i] + back, F + 4 - i * 6, 0.98, true);
        vis(b, { x: hx - 6, y: hy - 50, s: k, r: i ? 10 : -10, o: k > 0.01 ? 1 : 0 });
      });

      /* v19b — in the light the Father draws; v19c — the Son does likewise */
      const draw = es(t, 1.15, 1.85, (x) => x);
      attr(LDl, 'stroke-dashoffset', (1 - draw).toFixed(3));
      attr(LDf, 'opacity', (es(t, 1.8, 2.0) * 0.55).toFixed(2));
      pose(lightDove, { x: LD.x, y: LD.y, s: DS });
      vis(benchGlow, { x: LD.x, y: BY - 30, o: 0.4 + lit * 0.6 });
      const redo = es(t, 2.1, 2.8, (x) => x);
      attr(WDl, 'stroke-dashoffset', (1 - redo).toFixed(3));
      attr(WDf, 'opacity', es(t, 2.75, 2.9).toFixed(2));
      pose(woodDove, { x: RD.x, y: RD.y, s: DS });
      // the spark traces the light dove (both times: first alone, then in step with the Son)
      const kS = t < 2.0 ? draw : redo;
      const onS = (t > 1.15 && t < 1.9) || (t > 2.1 && t < 2.85) ? 1 : 0;
      const Lt = lp.getTotalLength ? lp.getTotalLength() : 0;
      const pt = Lt ? lp.getPointAtLength(Lt * Math.min(0.999, kS)) : { x: 0, y: 0 };
      vis(sparkL, { x: LD.x + pt.x * DS, y: LD.y + pt.y * DS, s: 0.8 + Math.sin(T * 8) * 0.1, o: onS });
      vis(chisel, { x: RD.x + pt.x * DS + 2, y: RD.y + pt.y * DS - 46, r: -12, o: t > 2.1 && t < 2.85 ? 1 : 0 });
      vis(chip, { x: RD.x + pt.x * DS + 10, y: RD.y + pt.y * DS + 6 + ((T * 30) % 12), o: t > 2.1 && t < 2.85 ? 0.9 : 0 });

      /* v20a — the Father loves the Son and shows Him all He does */
      const hk = es(t, 3.05, 3.5, ease.io);
      vis(loveH, { x: lerp(600, jhx + 30, hk), y: lerp(330, jhy + 70, hk), s: 0.6 + bump(t, 3.05, 3.9) * 0.5, o: bump(t, 3.0, 4.0) });
      works.forEach((w) => {
        const k = es(t, 3.2 + w.i * 0.14, 3.45 + w.i * 0.14, ease.back) * (1 - es(t, 4.0, 4.25));
        vis(w.el, { x: 720 + w.i * 110, y: 190 + (w.i % 2) * 40 - (1 - k) * 440, r: Math.sin(T * 0.8 + w.i) * 2, o: k > 0.01 ? 1 : 0 });
      });
      /* v20b — greater works than these, that you may marvel */
      greater.forEach((g) => {
        const k = es(t, 4.1 + g.i * 0.18, 4.4 + g.i * 0.18, ease.back);
        vis(g.el, { x: 760 + g.i * 190, y: 220 - (1 - k) * 480, r: Math.sin(T * 0.7 + g.i) * 1.5, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, S.portrait
        ? [[0, 228], [0.9, 228], [1.3, -10], [2.0, 10], [3.0, 10], [4.0, 40], [4.8, 230]]   // phone: pans to the listeners at the door
        : [[0, 60], [0.9, 50], [1.2, -10], [2.0, 10], [3.0, 10], [4.0, 20], [4.8, 50]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [2.0, 30], [3.0, -20], [4.8, -30]]);
      S.cam.z = kf(t, S.portrait ? [[0, 1.04], [1.0, 1.16], [2.0, 1.18], [3.0, 1.08], [4.8, 1.02]] : [[0, 1.1], [1.0, 1.16], [2.0, 1.18], [3.0, 1.08], [4.8, 1.06]]);
    };
  },
};
