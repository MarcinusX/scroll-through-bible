// Łk 6,38 — a painted flat of the grain market under a striped awning. "Give": a woman gives her loaf to the old
// beggar by the wall. "And it will be given to you — good measure, pressed down, shaken together, running over, poured
// into your lap": at his stall the grain merchant fills his wooden measure from a sack, presses it down with both
// hands, shakes it, heaps it till it runs over the rim — and tips it into the fold of her mantle, which she holds out,
// until it bulges with gold. "For with the measure you measure it will be measured back to you": a stingy man flicks
// three grains to the beggar from a tiny scoop; the merchant takes that same little scoop and measures back to him —
// three grains drop into his cupped hands, while beside him her lap is heaped full.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, house, palm, olive } from '../../assets/nature.js';
import { bushel, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { AFTERNOON, kf, moving, headAt, handAt, loaf, scoop, sparkle, storyFrame, equals, tr, PI } from './lib.js';

const GY = 706;
const WX = 690, MX = 850, SX0 = 1080, BGX0 = 470;
const WOMAN = { robe: C.roseRobe, mantle: C.ochreRobe, hairStyle: 'veil', veil: C.linen2, veil2: C.ochreRobe, beard: 'none', skin: C.skin2, belt: null };
const MERCHANT = { robe: C.linen2, mantle: C.tealRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.terracotta, beard: 'full', skin: C.skin3, belt: C.leather };
const STINGY = { robe: C.plumRobe, mantle: C.stone, hair: C.greyHair, hairStyle: 'short', beard: 'short', beardColor: C.greyHair, skin: C.skin2, belt: C.sun };
const BEGGAR = { robe: mix(C.stone2, C.sand2, 0.4), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope, pose: 'sit' };

function mound(c, w = 34, h = 22) {
  const s = sheet();
  s.p(c.cut([[-w, 2], ...c.arc(0, 2, w, h, PI, 2 * PI, 14), [w, 2]], 0.6, 4), C.wheat);
  let d = '';
  for (let i = 0; i < 14; i++) { const a = c.rr(PI * 1.1, PI * 1.9), r = c.rr(0.2, 0.9); d += seedPath(c, Math.cos(a) * w * r, 2 + Math.sin(a) * h * r, 2.6, c.rr(0, 3)); }
  s.x(d, C.wheat2, 'opacity=".8"');
  return s.out();
}
function grainSack(c, w = 70, h = 80) {
  const s = sheet();
  s.p(c.cut([[-w * 0.36, -h], [w * 0.36, -h], [w * 0.5, -h * 0.4], [w * 0.44, 0], [-w * 0.44, 0], [-w * 0.5, -h * 0.4]], 0.7, 6), C.linen2);
  s.p(c.cut(c.ell(0, -h, w * 0.38, 8, 14), 0.4, 4), C.wheat);
  s.x(c.ribbon([[-w * 0.48, -h * 0.4], [w * 0.48, -h * 0.42]], 5), C.dustyBlue, 'opacity=".8"');
  return s.out();
}
function fold(c, col) {
  // the fold of her mantle, held out in front (origin: its middle top)
  return sheet().p(c.cut([[-34, -4], [34, -4], [30, 8], [16, 24], [0, 28], [-16, 24], [-30, 8]], 0.5, 5), col).p(c.ribbon([[-34, -4], [34, -4]], 4), shade(col, -0.18)).out();
}

export default {
  id: 'lk6-measure',
  enter: 'fly',
  beats: [
    { v: 38, text: 'Dawajcie, a będzie wam dane; miarę dobrą, natłoczoną, utrzęsioną i opływającą wsypią w zanadrza wasze.' },
    { v: 38, cont: true, text: 'Odmierzą wam bowiem taką miarą, jaką wy mierzycie».' },
  ],
  cam: { x: [-40, 40], y: [-10, 60], z: [1, 1.16] },
  build(S) {
    // phone: the beggar sits further along his wall and the stingy man stands nearer the stall, both on screen
    const SX = S.portrait ? 1030 : SX0, BGX = S.portrait ? 532 : BGX0;
    const c = S.c;
    sky(S, AFTERNOON);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1220, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 560, y: 130, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    const mid = S.layer({ par: 0.18, sh: 3 });
    let hs = '';
    [[-200, 160, 130], [0, 140, 110], [180, 150, 140], [1260, 150, 120], [1440, 130, 140]].forEach(([x, w, h]) => { hs += house(c, x, 600, w, h, { stairs: c.chance(0.5) }); });
    mid.add(hillsWith(c, { y: 520, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 18 }).markup + hs + palm(c, 360, 604, 220) + olive(c, 1230, 606, 0.8));
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-1400, 596], [3000, 596], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.4)).out());
    // the wall where the beggar sits
    G.add(sheet().p(c.cut([[280, GY], [280, 560], [560, 556], [560, GY]], 0.6, 8), mix(C.stone2, C.plaster2, 0.4)).out());
    // the stall: an awning on poles, sacks, a counter
    const st = sheet();
    st.p(c.ribbon([[760, GY], [760, 470]], 7) + c.ribbon([[1180, GY], [1180, 470]], 7), C.wood2);
    const aw = [];
    for (let i = 0; i <= 8; i++) aw.push([740 + i * 57, 470 + (i % 2 ? 22 : 12)]);
    st.p(c.cut([[740, 440], [1200, 440], [1200, 470], ...aw.reverse()], 0.5, 6), C.cream);
    let stripes = '';
    for (let i = 0; i < 8; i += 2) stripes += c.cut([[740 + i * 57, 440], [797 + i * 57, 440], [797 + i * 57, 480], [740 + i * 57, 480]], 0.3, 5);
    st.p(stripes, C.terracotta);
    G.add(st.out());
    G.add(sheet().p(c.cut([[900, GY - 104], [1030, GY - 104], [1030, GY - 94], [900, GY - 94]], 0.4, 6), C.wood).p(c.cut(c.rect(908, GY - 94, 8, 94), 0.3, 4) + c.cut(c.rect(1014, GY - 94, 8, 94), 0.3, 4), C.wood2).out());
    G.add(`<g transform="translate(1060 ${GY})">${grainSack(c)}</g><g transform="translate(1110 ${GY})">${grainSack(c, 60, 66)}</g><g transform="translate(1140 ${GY - 4})">${grainSack(c, 56, 90)}</g>`);

    const L = S.layer({ par: 0.4, sh: 5 });
    const beg = S.puppet(L.add(person(c, BEGGAR)));
    const woman = S.puppet(L.add(person(c, WOMAN)));
    const merch = S.puppet(L.add(person(c, MERCHANT)));
    const sting = S.puppet(L.add(person(c, STINGY)));
    const bread = L.add(`<g>${loaf(c, 14)}</g>`);
    const lap = L.add(`<g opacity="0">${fold(c, WOMAN.mantle)}</g>`);
    const lapFill = L.add(`<g opacity="0">${mound(c, 30, 20)}</g>`);
    const meas = L.add(`<g>${bushel(c, 70, 54)}<g data-part="fill" transform="translate(0 -54)">${mound(c, 34, 22)}</g></g>`);
    const measFill = meas.querySelector('[data-part="fill"]');
    const spill = Array.from({ length: 12 }, (_, i) => ({ i, el: L.add(`<path d="${seedPath(c, 0, 0, 3, c.rr(0, 3))}" fill="${C.wheat2}"/>`), dx: c.rr(-36, 36), ph: c.rr(0, 1) }));
    const stream = L.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [6, 30], [8, 60]], (u) => 16 - u * 6)}" fill="${C.wheat}"/></g>`);
    const tiny = L.add(`<g>${scoop(c, 22)}</g>`);
    const three = [0, 1, 2].map(() => L.add(`<path d="${seedPath(c, 0, 0, 3, 0.4)}" fill="${C.wheat2}"/>`));
    const back3 = [0, 1, 2].map(() => L.add(`<path d="${seedPath(c, 0, 0, 3, 0.4)}" fill="${C.wheat2}"/>`));
    const fx = S.layer({ par: 0.3, sh: 6 });
    const tagBig = hanging(fx, `${sheet().p(c.cut(c.circ(0, 0, 42, 26), 0.4, 4), C.cream).out()}<g transform="translate(0 20) scale(.6)">${bushel(c, 70, 54)}<g transform="translate(0 -54)">${mound(c, 36, 26)}</g></g>`, { x: 0, y: -400, len: 900 });
    const tagSmall = hanging(fx, `${sheet().p(c.cut(c.circ(0, 0, 42, 26), 0.4, 4), C.cream).out()}<g transform="translate(0 12)">${scoop(c, 22)}</g>`, { x: 0, y: -400, len: 900 });
    const eqs = [0, 1].map(() => fx.add(`<g opacity="0">${equals(c, 24)}</g>`));
    const joy = fx.add(`<g opacity="0">${sparkle(c, 14)}</g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1220, 150, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 130, T, 1.2, 0.6, 1);

      /* "Give": the loaf to the beggar */
      const give = es(t, -0.1, 0.1) * (1 - es(t, 0.2, 0.26));
      const toMerch = es(t, 0.22, 0.28);
      const holdOut = es(t, 0.62, 0.7);
      woman.set({ x: WX, y: GY, s: 0.98, flip: toMerch < 0.5, armF: 16 + give * 60 + holdOut * 40, armB: 10 + holdOut * 30, head: toMerch > 0.5 ? 6 * holdOut : 8, blink: blinkAt(T, 2) });
      const got = es(t, 0.02, 0.18);
      beg.set({ x: BGX, y: GY, s: 0.94, flip: false, armF: 50 + got * 20, armB: 10 + got * 40, head: 6 - got * 10, blink: blinkAt(T, 5) });
      const [wgx, wgy] = handAt(WX, GY, 0.98, true, 76);
      const [bgx, bgy] = handAt(BGX, GY, 0.94, false, 70, 'sit');
      pose(bread, { x: lerp(wgx, bgx + 4, got), y: lerp(wgy, bgy - 4, got), s: 1 - es(t, 0.3, 0.5) * 0.2, o: 1 - es(t, 0.6, 0.7) });

      /* the measure: filled, pressed down, shaken, running over, poured into her lap */
      const fill = es(t, 0.26, 0.38);
      const press = bump(t, 0.38, 0.5);
      const shake = bump(t, 0.48, 0.6);
      const over = es(t, 0.58, 0.68);
      const pour = es(t, 0.7, 0.82);
      const [lx, ly] = handAt(WX, GY, 0.98, false, 56);
      const mX = lerp(960, lx + 36, pour), mY = lerp(GY - 104, ly - 40, pour);
      const tip = pour * 118;
      const shk = shake * Math.sin(t * 90) * 7;
      merch.set({ x: MX + pour * -30, y: GY, s: 1.0, flip: true, armF: 60 + press * 30 + pour * 20, armB: 40 + press * 20 + pour * 30, head: 8, lean: press * 8 + pour * 6, blink: blinkAt(T, 7) });
      pose(meas, { x: mX + shk, y: mY, r: -tip, o: 1 });
      const rimY = mY - 54;
      pose(measFill, { x: 0, y: -54, sx: 0.6 + fill * 0.4, sy: Math.max(0.02, fill * (0.4 + over * 1.0) * (1 - press * 0.35) * (1 - pour)), o: fill > 0.02 && pour < 0.98 ? 1 : 0 });
      spill.forEach((g) => {
        const k = seg(t, 0.6 + g.ph * 0.12, 0.72 + g.ph * 0.12);
        pose(g.el, { x: mX + g.dx, y: rimY - 20 + k * (GY - rimY + 16) * k, o: k > 0 && k < 1 ? 1 : 0 });
      });
      pose(stream, { x: lx + 26, y: ly - 64, o: bump(t, 0.72, 0.86) });
      pose(lap, { x: lx + 4, y: ly + 4, o: es(t, 0.62, 0.7) });
      const heap = es(t, 0.74, 0.86);
      pose(lapFill, { x: lx + 4, y: ly + 2, sy: heap * 1.2, sx: 0.6 + heap * 0.4, o: heap > 0.02 ? 1 : 0 });
      pose(joy, { x: lx + 4, y: ly - 50, s: bump(t, 0.8, 1.3), r: T * 30, o: bump(t, 0.8, 1.3) });

      /* v38b — the stingy man's tiny scoop, and the same measure back to him */
      const flick = bump(t, 1.08, 1.3);
      const cupped = es(t, 1.45, 1.55);
      sting.set({ x: SX, y: GY, s: 0.98, flip: true, armF: 20 + flick * 60 + cupped * 50, armB: 10 + cupped * 50, head: 4 - cupped * 4, blink: blinkAt(T, 9) });
      const [shx, shy] = handAt(SX, GY, 0.98, true, 20 + flick * 60 + cupped * 50);
      const toM = es(t, 1.32, 1.42), back = es(t, 1.5, 1.62);
      const [mhx, mhy] = handAt(MX, GY, 1.0, true, 70);
      pose(tiny, { x: lerp(lerp(shx, mhx, toM), shx + 10, back), y: lerp(lerp(shy, mhy, toM), shy - 30, back), r: -40 * back, o: t > 0.9 ? 1 : 0 });
      three.forEach((el, i) => {
        const k = seg(t, 1.12 + i * 0.03, 1.32 + i * 0.03);
        pose(el, { x: lerp(shx - 6, bgx + 14, k), y: lerp(shy - 10, bgy - 6, k) - Math.sin(k * PI) * 60, o: k > 0 && k < 1 ? 1 : 0 });
      });
      back3.forEach((el, i) => {
        const k = seg(t, 1.6 + i * 0.03, 1.72 + i * 0.03);
        pose(el, { x: shx + 8 + (i - 1) * 5, y: lerp(shy - 36, shy - 4, k), o: k > 0 ? 1 : 0 });
      });
      const tg = es(t, 1.2, 1.45, ease.back);
      const [whx, why] = headAt(WX, GY, 0.98, false);
      pose(tagBig, { x: WX - 10, y: lerp(-400, why - 130, tg), r: Math.sin(T * 0.9) * 1.5, oy: 0, o: tg > 0.01 ? 1 : 0 });
      const [sthx, sthy] = headAt(SX, GY, 0.98, true);
      pose(tagSmall, { x: SX + 10, y: lerp(-400, sthy - 130, tg), r: Math.sin(T * 0.8 + 1) * 1.5, oy: 0, o: tg > 0.01 ? 1 : 0 });
      eqs.forEach((el, i) => pose(el, { x: i ? SX + 10 : WX - 10, y: (i ? sthy : why) - 64, o: es(t, 1.62, 1.75) }));

      S.cam.x = kf(t, [[-0.5, -40], [0.1, -30], [0.3, 0], [0.9, 0], [1.1, 30], [1.9, 10]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.3, 1.12], [0.9, 1.12], [1.1, 1.04]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.3, 50], [0.9, 50], [1.1, 20]]);
    };
  },
};
