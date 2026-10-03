// Łk 13,15–17 — "You hypocrites! Does not each of you on the Sabbath untie his ox or his donkey from the manger and
// lead it away to water?" A painted flat comes down in the synagogue: a stable yard, an ox and a donkey tied at the
// manger; a man slips the rope off the post and leads them across to the trough, and they drink. "And this woman, a
// daughter of Abraham, whom Satan has bound for eighteen long years — ought she not to be loosed from this bond on the
// Sabbath?": the flat goes up; Abraham's medallion comes down over her with a golden thread to her; the dark cords
// that lay at her feet rise, loosen and melt away, and the tag of her eighteen years is crossed out. "His adversaries
// were put to shame": the ruler and the Pharisees hide their faces and draw back; and all the people rejoice, their
// arms raised on every bench.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  synSet, BENT, RULER, pharisee, flat, flatSky, flatHills, ox, colt, manger, waterTrough, fig13, ropeSeg, ropeTo, medal, L12, cordBit, wordTag, crossOut,
  onString, sparkle, withFace, faceBits, face, headAt, handF, kf, es, ease, bump, seg, tr, PI, STRING,
} from './lib.js';

const FEET = 742, JX = 810, WX = 660, RX = 1010;
const FX = 800, FY = 330, FW = 440, FH = 240, K = 1.08;
const X = (dx) => FX + dx * K;
const FARMER = { robe: C.clayMantle, hairStyle: 'wrap', veil: C.linen2, beard: 'full', hair: C.hair3, skin: C.skin3, belt: C.rope };

export default {
  id: 'lk13-loosed',
  beats: [
    { v: 15 },
    { v: 16 },
    { v: 17 },
  ],
  cam: { x: [-20, 40], y: [110, 140], z: [1.05, 1.16] },
  build(S) {
    const Y = synSet(S, { up: true });
    const c = S.c;
    const I = Y.I;

    /* the flat: a stable yard */
    const FLl = S.layer({ par: 0.36, sh: 6 });
    const B = S.layer({ par: 0.36, sh: 5 });
    const yard = sheet();
    yard.p(c.cut([[-FW / 2, 60], [FW / 2, 58], [FW / 2, FH / 2], [-FW / 2, FH / 2]], 0.6, 10), mix(C.sand, C.hillNear, 0.3));
    yard.p(c.cut([[-FW / 2, -40], [-60, -52], [-60, 70], [-FW / 2, 70]], 0.5, 8), mix(C.wood3, C.sand2, 0.4));
    yard.p(c.cut([[-FW / 2 - 4, -46], [-50, -60], [-44, -50], [-FW / 2, -34]], 0.4, 6), C.roof);
    yard.p(c.cut(c.rect(-150, 70 - 110, 8, 112), 0.3, 5), C.wood2);
    const inner = flatSky(S, FW, FH, ['#d9e2d6', '#f5e8cc']) + flatHills(c, FW, 20, mix(C.hillMid, C.sand, 0.2), 8) + yard.out()
      + `<g transform="translate(-110 96) scale(.62)">${manger(c)}</g><g transform="translate(140 104) scale(1.1)">${waterTrough(c, 110)}</g>`;
    const flatEl = FLl.add(flat(S, inner, { w: FW, h: FH }));
    const oxEl = B.add(`<g><g transform="scale(.6)">${ox(c)}</g></g>`);
    const donEl = B.add(`<g><g transform="scale(.4)">${colt(c)}</g></g>`);
    const man = B.add(`<g>${fig13(c, FARMER, { s: 0.44, armF: 60, armB: 20 })}</g>`);
    const ropeA = B.add(`<g>${ropeSeg(c, 3)}</g>`);
    const ropeB = B.add(`<g>${ropeSeg(c, 3)}</g>`);

    /* the people */
    const act = S.layer({ par: 0.5, sh: 5 });
    const PH = [0, 1].map((i) => ({ i, a: S.puppet(act.add(person(c, pharisee(c, i + 1)))), b: S.puppet(act.add(person(c, pharisee(c, i + 1)))) }));
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const glow = glowL.add(`<g opacity="0"><ellipse rx="120" ry="170" fill="url(#halo-glow)"/></g>`);
    const act2 = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(act2.add(person(c, { ...CAST.jesus })));
    const woman = S.puppet(act2.add(person(c, { ...BENT })));
    const rulerEl = act2.add(withFace(person(c, { ...RULER }), faceBits(c)));
    const ruler = S.puppet(rulerEl);
    const cords = [0, 1, 2].map((i) => act2.add(`<g>${cordBit(c, 46 + i * 8)}</g>`));

    /* Abraham's medallion, the golden thread; the eighteen years crossed out; joy */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const thread = fx.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [0, 1]], 3)}" fill="${C.haloRim}"/></g>`);
    const abra = fx.add(`<g>${onString(`<g transform="translate(0 64)">${medal(S, L12.abraham, { r: 54, name: tr('Abraham', 'Abraham') })}</g>`, 1600)}</g>`);
    const dTag = fx.add(`<g opacity="0">${wordTag(c, tr('córka Abrahama', 'a daughter of Abraham'), { size: 20, fill: C.halo })}</g>`);
    const tag18 = fx.add(`<g>${onString(`<g transform="translate(0 20)">${wordTag(c, tr('18 lat', '18 years'), { size: 24, fill: mix(C.stone, C.cream, 0.5) })}</g>`, 1600)}</g>`);
    const x18 = fx.add(`<g opacity="0">${crossOut(c, 26)}</g>`);
    const sparks = Array.from({ length: 8 }, (_, i) => fx.add(`<g opacity="0">${sparkle(c, 10 + (i % 3) * 4)}</g>`));

    // phone: "a daughter of Abraham" and "18 years" come inside the left edge of the screen
    const P = S.portrait, T18X = P ? 560 : 520;
    return (t, time) => {
      const T = time;
      I.flicker(T);
      Y.set(es(t, 2.3, 2.6));

      /* v15 — Jesus answers: the ox and the donkey untied and led to water */
      const point = es(t, 0.05, 0.2) * (1 - es(t, 0.9, 1.1));
      const turnL = es(t, 1.05, 1.15);
      jesus.set({ x: JX, y: FEET, s: 1.06, flip: turnL > 0.5 && t < 2.1, armF: 20 + point * 70 + es(t, 1.2, 1.4) * 50 * (1 - es(t, 2.05, 2.2)), armB: 10 + point * 40 + es(t, 2.2, 2.4) * 30, head: -point * 6, blink: blinkAt(T) });
      const kA = es(t, 0.02, 0.22, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      const fy = lerp(-1500, FY, kA), on = kA > 0.002 ? 1 : 0;
      const FYY = (dy) => fy + dy * K;
      pose(flatEl, { x: FX, y: fy, s: K, o: on });
      const lead = es(t, 0.42, 0.7);
      const untie = es(t, 0.3, 0.4);
      const oxX = lerp(-70, 50, lead), donX = lerp(-170, -40, es(t, 0.48, 0.74));
      const drink = es(t, 0.7, 0.8);
      pose(oxEl, { x: X(oxX), y: FYY(104), s: K, r: drink * 4, o: on });
      pose(donEl, { x: X(donX), y: FYY(100), s: K, r: es(t, 0.74, 0.84) * 4, o: on });
      const mx = lerp(-150, 118, lead) + untie * 14 * (1 - lead);
      pose(man, { x: X(mx + 10), y: FYY(104), s: K, o: on });
      // rope: tied from the post to the ox's neck; then from the man's hand to the neck
      const post = [X(-150), FYY(40)], neckO = [X(oxX + 34), FYY(58)];
      ropeTo(ropeA, post[0], post[1], neckO[0], neckO[1], on * (1 - untie));
      const hand = [X(mx + 30), FYY(44)];
      ropeTo(ropeB, hand[0], hand[1], neckO[0], neckO[1], on * untie);

      /* v16 — a daughter of Abraham, loosed from her bond */
      const ak = es(t, 1.15, 1.4, ease.out) * (1 - es(t, 2.9, 3.0) * 0);
      const ay = lerp(-800, 230, ak);
      pose(abra, { x: WX, y: ay + (T ? Math.sin(T * 0.7) * 2 : 0), r: T ? Math.sin(T * 0.6) * 1 : 0 });
      const th = es(t, 1.38, 1.55);
      const [whx, why] = headAt(WX, FEET, 1.04);
      const top = ay + 64 + 54 + 36;
      pose(thread, { x: whx, y: top, sx: 1, sy: Math.max(0.01, (why - 26 - top) * th), o: th > 0.01 ? 0.9 : 0 });
      const dk = es(t, 1.5, 1.65, ease.back);
      pose(dTag, { x: P ? WX - 100 : WX - 150, y: FEET - 250, s: dk * (P ? 0.86 : 1), o: dk > 0.02 ? 1 : 0 });
      const t18 = es(t, 1.2, 1.4, ease.out) * (1 - es(t, 2.1, 2.3, ease.in));
      pose(tag18, { x: T18X, y: lerp(-800, 380, t18) });
      const xk = es(t, 1.62, 1.76, ease.back);
      pose(x18, { x: T18X, y: lerp(-800, 380, t18) + 38, s: xk, o: xk > 0.02 && t18 > 0.01 ? 1 : 0 });
      cords.forEach((cd, i) => {
        const k = es(t, 1.4 + i * 0.05, 1.8 + i * 0.05);
        pose(cd, { x: WX - 40 + i * 36 + k * (i - 1) * 30, y: FEET - 4 - k * 120 - i * 2, r: (i % 2 ? 80 : -70) * (1 - k), s: 1 - k * 0.7, o: 1 - es(t, 1.6 + i * 0.05, 1.85 + i * 0.05) });
      });
      woman.set({ x: WX, y: FEET, s: 1.04, flip: false, armF: 56 + es(t, 2.3, 2.5) * 20, armB: 44 + es(t, 2.3, 2.5) * 110, head: -4 - es(t, 1.4, 1.6) * 8, blink: blinkAt(T, 2) });
      pose(glow, { x: WX + 10, y: FEET - 110, s: 0.7 + es(t, 1.4, 1.7) * 0.4, o: es(t, 1.4, 1.7) * 0.85 });

      /* v17 — His adversaries ashamed; all the people rejoice */
      const shame = es(t, 2.08, 2.14);
      const back = es(t, 2.1, 2.5);
      ruler.set({ x: RX + back * 40, y: FEET, s: 1.04, flip: true, armF: 20 + bump(t, 0.1, 0.9) * 30 + shame * 130, armB: 10 + shame * 20, head: shame * 18, lean: shame * 6, blink: blinkAt(T, 4) });
      face(rulerEl, 'angry', 1 - shame);
      PH.forEach((p) => {
        const x = 1120 + p.i * 70 + back * 50, y = FEET - 20 - p.i * 10;
        p.a.set({ x, y, s: 0.98, flip: true, armF: 20, armB: 10, head: -4 + p.i * 4, o: 1 - shame, blink: blinkAt(T, 6 + p.i) });
        p.b.set({ x, y, s: 0.98, flip: true, armF: 150, armB: 20, head: 20, lean: 5, o: shame });
      });
      sparks.forEach((sp, i) => { const k = bump(t, 2.3 + i * 0.03, 2.98); const a = (i / 8) * PI * 2; pose(sp, { x: 740 + Math.cos(a) * 170, y: 520 + Math.sin(a) * 80, s: k, r: (T || t * 3) * 60, o: k }); });

      S.cam.x = 20;
      S.cam.y = 130;
      S.cam.z = 1.1;
      void handF; void kf; void seg; void shade; void STRING;
    };
  },
};
