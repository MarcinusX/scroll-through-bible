// Mt 12,34–37 — the square in the afternoon light. "Brood of vipers! How can you speak good when you are evil?": the
// Pharisees' sweet words float up as flowery bubbles — but the sun throws their shadows on the town wall, and the
// shadows are vipers, forked tongues flickering. "Out of the abundance of the heart the mouth speaks": in a woman at
// the front a warm heart swells and glows, and golden words rise out of her mouth. "The good man brings good things out
// of his good treasure": a man opens a chest and bread, a lamp and flowers rise out of it in light; "the evil man,
// evil things": another opens a dark chest and thorns, stones and smoke come out. "Every careless word…": slips of
// words fly up from every mouth into a great open book that hangs in golden light — the day of judgment. "By your
// words you will be justified, and by your words condemned": scales come down under the book; bright words sink one
// pan (a tick), dark words the other (a cross).
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { squareSet, SQ, WARM, manOf, womanOf, headAt, handAt, kf, viper, heart, chest, loaf, openBook, speech, shout, bang, puff, sinKnot, scalesParts, poseScales, tick, crossX, tagText, glow, sparkle, tr, PI } from './lib.js';
import { thornBush } from '../../assets/things.js';

const F = SQ.FEET;

/** a flowery bubble inner: a small flower */
function flower(c, col = C.roseRobe) {
  return sheet().p(c.cut(c.star(0, 0, 11, 6, 5, 0), 0.2, 3), col).x(c.poly(c.circ(0, 0, 3.5, 8)), C.sun).out();
}

export default {
  id: 'mt12-words',
  beats: [
    { v: 34, text: 'Plemię żmijowe! Jakże wy możecie mówić dobrze, skoro źli jesteście?' },
    { v: 34, cont: true, text: 'Przecież z obfitości serca usta mówią.' },
    { v: 35, text: 'Dobry człowiek z dobrego skarbca wydobywa dobre rzeczy,' },
    { v: 35, cont: true, text: 'zły człowiek ze złego skarbca wydobywa złe rzeczy.' },
    { v: 36 },
    { v: 37 },
  ],
  cam: { x: [-80, 80], y: [-60, 50], z: [1, 1.14] },
  build(S) {
    const Q = squareSet(S, { skyCols: WARM, dis: ['john'], ph: 3 });
    const c = Q.c;
    /* viper shadows on the town wall (a flat layer just behind the square) */
    const shL = S.layer({ par: 0.2, sh: 1, flat: true });
    const vipers = [1010, 1100, 1190].map((x, i) => shL.add(`<g opacity="0"><g transform="scale(-1.7 1.7)">${viper(c, { len: 170, col: '#4b3f4c', belly: '#4b3f4c' })}</g></g>`));
    const act = Q.act;
    const WO = womanOf(c, { robe: C.roseRobe, veil: C.skyVeil, skin: C.skin2 });
    const woman = S.puppet(act.add(person(c, WO)));
    const goodM = S.puppet(act.add(person(c, manOf(c, { robe: C.sageRobe, mantle: C.wheatRobe, beard: 'full', belt: C.leather }))));
    const badM = S.puppet(act.add(person(c, manOf(c, { robe: mix(C.storm2, C.plumRobe, 0.4), mantle: null, beard: 'short', belt: C.rock3, hairStyle: 'short' }))));
    const gC = chest(c, { w: 84, h: 46 }), bC = chest(c, { w: 84, h: 46, dark: true });
    const gBox = act.add(`<g>${gC.box}</g>`), gLid = act.add(`<g>${gC.lid}</g>`);
    const bBox = act.add(`<g>${bC.box}</g>`), bLid = act.add(`<g>${bC.lid}</g>`);
    const P = S.portrait;
    const GCX = P ? 600 : 580, BCX = P ? 1000 : 1030, CY = F + 22;   // phone: both chests and their men inside the screen
    const MD = P ? 100 : 120;
    const goods = [loaf(c, 16), `<g transform="scale(.8)">${sheet().p(c.cut([[-20, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [28, -9], [20, -2], [10, 1], [-14, 1]], 0.4, 5), C.pot).out()}<path d="M26 -12C22 -16 23 -22 26 -30C29 -22 30 -16 26 -12Z" fill="${C.lampFlame}"/></g>`, flower(c, C.roseRobe), flower(c, C.lavender)]
      .map((m) => act.add(`<g opacity="0">${glow(40, 0.8)}${m}</g>`));
    const bads = [`<g transform="scale(.5)">${thornBush(c, 0, 20, 70)}</g>`, `<path d="${c.cut(c.blob(0, 0, 14, 10, 8, 0.3), 0.8, 4)}" fill="${C.rock3}"/>`, puff(c, 20, '#6b6076'), sinKnot(c, 12)]
      .map((m) => act.add(`<g opacity="0">${m}</g>`));
    const heartEl = act.add(`<g opacity="0">${glow(60, 1)}${heart(c, 18)}</g>`);

    /* words */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const sweet = [0, 1].map((i) => fx.add(`<g opacity="0">${speech(c, flower(c, i ? C.lavender : C.roseRobe), { w: 50, h: 42, flip: true })}<g data-part="tongue" opacity="0" transform="translate(-44 -18)"><path d="${c.ribbon([[0, 0], [-16, 2], [-22, -3]], 2) + c.ribbon([[-16, 2], [-22, 6]], 2)}" fill="${C.terracotta}"/></g></g>`));
    const golden = [0, 1, 2, 3].map(() => fx.add(`<g opacity="0">${sheet().p(c.cut([[-16, -6], [16, -7], [17, 6], [-16, 7]], 0.4, 5), C.halo).x(c.ribbon([[-11, -1], [11, -2]], 1.2), C.ochre).out()}</g>`));
    const slips = Array.from({ length: 10 }, (_, i) => ({ i, dark: i % 3 === 2, el: fx.add(`<g opacity="0">${sheet().p(c.cut([[-15, -6], [15, -7], [16, 6], [-15, 7]], 0.4, 5), i % 3 === 2 ? mix(C.storm2, C.stone2, 0.3) : C.cream).x(c.ribbon([[-10, -1], [10, -2]], 1.2), i % 3 === 2 ? C.cream : C.ink).out()}</g>`) }));
    const hangL = S.layer({ par: 0.15, sh: 6 });
    const bookM = openBook(c, 260, 150).replace('class="glow" opacity="0"', 'class="glow" opacity="1"').replace('class="linesL" opacity="0"', 'class="linesL"').replace('class="linesR" opacity="0"', 'class="linesR"');
    const book = hanging(hangL, `${bookM}<g transform="translate(0 34)">${tagText(c, tr('dzień sądu', 'the day of judgment'), { size: 19 })}</g>`, { x: SQ.JX, y: -400, len: 900 });
    const sc = scalesParts(c, { arm: 110, drop: 60, col: C.sun });
    const scl = { frame: hangL.add(`<g>${sc.frame}</g>`), beam: hangL.add(`<g>${sc.beam}</g>`), panL: hangL.add(`<g>${sc.pan}<g transform="translate(0 50)">${tick(c, 16)}</g></g>`), panR: hangL.add(`<g>${sc.pan}<g transform="translate(0 50)">${crossX(c, 14)}</g></g>`) };

    return (t, time) => {
      const T = time;
      const book_ = es(t, 4.05, 4.4, ease.back);
      const SPEAK = [[540, F + 18, false], [660, F + 20, false], [1000, F + 6, true], [1090, F + 4, true], [1150, F + 8, true], [1040, F + 30, true], [600, F + 30, false], [450, F, false], [980, F + 20, true], [700, F + 10, false]];
      Q.pose(t, T,
        { armF: 16 + bump(t, 0.05, 0.7) * 50 + es(t, 4.05, 4.4) * (1 - es(t, 5.6, 5.9)) * 60, armB: 8 + bump(t, 0.05, 0.7) * 30 + es(t, 4.05, 4.4) * 40, head: -2 - es(t, 4.1, 4.4) * 8 * (1 - es(t, 5.6, 5.9)), blink: blinkAt(T, 2) },
        (d) => ({ x: 440, y: F - 26, s: 0.86, blink: blinkAt(T, d.seed) }),
        (m) => ({ armF: 10 + bump(t, 0.02 + m.i * 0.08, 0.5 + m.i * 0.08) * 50, armB: 6, head: 4 - bump(t, 0.02 + m.i * 0.08, 0.5 + m.i * 0.08) * 6, blink: blinkAt(T, m.seed) }));

      /* v34a — sweet words; viper shadows */
      sweet.forEach((sw, i) => {
        const k = es(t, 0.05 + i * 0.1, 0.2 + i * 0.1, ease.back) * (1 - es(t, 0.95, 1.1));
        const [hx, hy] = headAt(SQ.PX[i], F + (i % 2 ? -4 : 4), 0.96, true);
        pose(sw, { x: hx - 12, y: hy - 18, s: k, o: k > 0.01 ? 1 : 0 });
        pose(sw.querySelector('[data-part="tongue"]'), { x: -44, y: -18, sx: 0.4 + Math.abs(Math.sin(T * 6 + i)) * 0.6 * es(t, 0.4, 0.5), o: es(t, 0.4, 0.5) });
      });
      vipers.forEach((v, i) => pose(v, { x: [1010, 1100, 1190][i] + 60, y: 470 + i * 12, r: -18 + Math.sin(T * 1.2 + i) * 3, o: es(t, 0.3 + i * 0.06, 0.55 + i * 0.06) * 0.75 * (1 - es(t, 1.0, 1.2)) }));

      /* v34b — out of the abundance of the heart */
      const hk = es(t, 1.05, 1.35);
      woman.set({ x: 640, y: F + 20, s: 0.95, flip: false, o: 1 - es(t, 1.9, 2.0), armF: 20 + hk * 30, armB: 10 + hk * 50, head: -hk * 8, blink: blinkAt(T, 4) });
      pose(heartEl, { x: 646, y: F + 20 - 112, s: 0.5 + hk * 0.7, o: hk * (1 - es(t, 1.9, 2.0)) });
      const [wx, wy] = headAt(640, F + 20, 0.95, false);
      golden.forEach((g, i) => {
        const k = seg(t, 1.3 + i * 0.1, 1.85 + i * 0.1);
        pose(g, { x: wx + 20 + k * 90 + i * 8, y: wy + 8 - k * 170 - i * 10, r: Math.sin(k * 5 + i) * 18, o: k > 0 && k < 1 ? 1 - k * 0.4 : 0 });
      });

      /* v35 — the good treasure and the evil treasure */
      const gIn = es(t, 1.95, 2.05), bIn = es(t, 2.95, 3.05);
      const gOpen = es(t, 2.15, 2.35), bOpen = es(t, 3.15, 3.35);
      const goneC = 1 - es(t, 3.95, 4.05);
      goodM.set({ x: GCX - MD, y: F + 20, s: 0.95, flip: false, o: gIn * goneC, armF: 40 + gOpen * 60, armB: 20 + es(t, 2.5, 2.7) * 90, head: 6 - es(t, 2.5, 2.7) * 12, blink: blinkAt(T, 5) });
      badM.set({ x: BCX + MD, y: F + 20, s: 0.95, flip: true, o: bIn * goneC, armF: 40 + bOpen * 60, armB: 20, head: 8, blink: blinkAt(T, 6) });
      pose(gBox, { x: GCX, y: CY, s: 1.3, o: gIn * goneC });
      pose(gLid, { x: GCX - 57, y: CY - 60, s: 1.3, r: -gOpen * 64, ox: -44, oy: 0, o: gIn * goneC });
      pose(bBox, { x: BCX, y: CY, s: 1.3, o: bIn * goneC });
      pose(bLid, { x: BCX + 57, y: CY - 60, s: 1.3, r: bOpen * 64, ox: 44, oy: 0, o: bIn * goneC });
      goods.forEach((g, i) => {
        const k = es(t, 2.3 + i * 0.07, 2.6 + i * 0.07, ease.out);
        pose(g, { x: GCX + (i - 1.5) * 52 * k, y: CY - 70 - k * (110 + (i % 2) * 40), s: 0.6 + k * 0.9, o: k * goneC });
      });
      bads.forEach((b, i) => {
        const k = es(t, 3.3 + i * 0.07, 3.6 + i * 0.07, ease.out);
        pose(b, { x: BCX + (i - 1.5) * 52 * k, y: CY - 70 - k * (110 + (i % 2) * 40), s: 0.6 + k * 0.9, r: i === 3 ? T * 20 : 0, o: k * goneC });
      });

      /* v36 — every word goes up into the book; v37 — the scales */
      pose(book, { x: SQ.JX, y: lerp(-400, 250, book_), r: Math.sin(T * 0.7) * 0.6, oy: 0, o: book_ > 0.01 ? 1 : 0 });
      const sd = es(t, 5.05, 5.35, ease.back);
      const tilt = es(t, 5.35, 5.7, ease.back) * 12;
      poseScales(scl, SQ.JX, lerp(-300, 330, sd), tilt * Math.sin(T * 0.6) * 0.0 + Math.sin(T * 0.8) * 1.2 + (seg(t, 5.35, 5.5) > 0 ? Math.sin(seg(t, 5.35, 5.9) * PI * 2) * 8 : 0), sd > 0.01 ? 1 : 0, 1, 110);
      slips.forEach((s_) => {
        const [x0, y0, fl] = SPEAK[s_.i];
        const [hx, hy] = headAt(x0, y0, 0.96, fl);
        const k = seg(t, 4.2 + s_.i * 0.05, 4.7 + s_.i * 0.05);
        const bx = SQ.JX + (s_.i - 4.5) * 12, by = 200;
        const toPan = seg(t, 5.4 + (s_.i % 5) * 0.04, 5.65 + (s_.i % 5) * 0.04);
        const px = SQ.JX + (s_.dark ? 110 : -110), py = 400;
        const x = lerp(lerp(hx, bx, k), px + (s_.i % 3) * 6 - 6, toPan), y = lerp(lerp(hy - 20, by, k) - Math.sin(k * PI) * 60, py - (s_.i % 4) * 5, toPan);
        pose(s_.el, { x, y, r: (1 - k) * Math.sin(s_.i) * 30, s: 0.9, o: k > 0 && (k < 1 || toPan > 0) ? 1 : 0 });
      });

      const CW = P ? 70 : 30;   // phone: the camera goes further to each treasure
      S.cam.x = kf(t, [[-0.5, 30], [0.9, 30], [1.1, -30], [1.9, -30], [2.1, -CW], [2.9, -CW], [3.1, CW], [3.9, CW], [4.1, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.9, 1.1], [1.1, 1.12], [3.9, 1.12], [4.1, 1.02]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.9, 20], [1.1, 40], [3.9, 40], [4.1, -40]]);
    };
  },
};
