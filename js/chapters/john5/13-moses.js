// J 5,45–47 — evening; far off, the mountain of the Law under its cloud. "Do not think that I will accuse you
// before the Father" — the great light above (never a figure); Jesus stands with open hands, and the pointing
// finger of an accuser is crossed out. "Your accuser is Moses, on whom you set your hope" — Moses rises beside a
// rock with the tablets; the leaders turn to him full of hope, and he points at them. "If you believed Moses, you
// would believe me" — his scroll unrolls and a golden line runs from it to Jesus; "for he wrote about me" — on
// the scroll: the prophet like Moses, with a small shining face. "But if you do not believe his writings, how will
// you believe my words?" — the leaders turn away; the scroll stays open, and in Jesus' hands the living Word burns.
import { C, person, CAST, blinkAt, lerp, mix, shade, sky, sheet } from '../kit.js';
import { band, cloud, rock, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import { mountain } from '../mark11/lib.js';
import {
  MOSES, sepia, lawTablets, leaderOpts, withFace, faceBits, radiance, rayBurst, wordFlame, verseScroll, medallion, hungPlate, crossX, heart,
  vis, kf, headAt, handAt, hanging, swing, tr, PI,
} from './lib.js';

const F = 700;
const EVE = ['#b9a3c4', '#ecc39f', '#f6dcb6'];
const LATE = ['#6f6a9c', '#d9a08f', '#f2c49a'];

/** a hand with a pointing finger (origin centre, pointing right) */
function pointer(c) {
  const s = sheet();
  s.p(c.cut([[-20, -10], [4, -12], [30, -10], [32, -4], [6, -2], [8, 8], [2, 14], [-18, 14], [-24, 4]], 0.3, 3), C.skin2);
  s.p(c.cut(c.rect(-34, -12, 14, 26), 0.3, 3), C.plumRobe);
  return s.out();
}

export default {
  id: 'j5-moses',
  beats: [
    { v: 45, text: 'Nie mniemajcie jednak, że to Ja was oskarżę przed Ojcem.' },
    { v: 45, cont: true, text: 'Waszym oskarżycielem jest Mojżesz, w którym wy pokładacie nadzieję.' },
    { v: 46, text: 'Gdybyście jednak uwierzyli Mojżeszowi, to byście i Mnie uwierzyli.' },
    { v: 46, cont: true, text: 'O Mnie bowiem on pisał.' },
    { v: 47 },
  ],
  cam: { x: [-80, 60], y: [-100, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;   // phone: Moses, his rock and his scroll stand inside the narrow screen
    const sk = sky(S, EVE);
    const hi = S.layer({ par: 0.05, sh: 3 });
    const burst = hi.add(`<g>${rayBurst(c, { n: 20, r0: 60, r1: 520, spread: 0.045, o: 0.5 })}<circle r="200" fill="url(#halo-glow)"/></g>`);
    const rad = hi.add(`<g>${radiance(c, 56)}</g>`);
    const cl = hanging(hi, cloud(c, 170), { x: 330, y: 250, len: 700 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(`<g transform="translate(260 520)">${mountain(c, 440, 250)}</g>`);
    far.add(`<g transform="translate(260 290)">${cloud(c, 200, mix(C.cream, C.stone2, 0.3), C.stone2)}</g>`);
    far.add(band(c, { y: 500, amps: [18, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.dune, 0.4) }).markup);
    const near = S.layer({ par: 0.3, sh: 3 });
    const g = band(c, { y: F - 30, amps: [8, 3, 1], lens: [900, 300, 110], color: mix(C.sand2, C.hillNear, 0.4) });
    near.add(g.markup + grass(c, { x0: -900, x1: 2500, y: F - 30, n: 40, h: 12, color: C.olive, fn: g.fn }));

    /* Moses rises beside the rock */
    const ML = S.layer({ par: 0.42, sh: 5 });
    const mGlow = ML.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const moses = S.puppet(ML.add(person(c, { ...sepia(MOSES, 0.15), holdB: `<g transform="translate(0 6) rotate(180) scale(.62)">${lawTablets(c, { w: 50, h: 70 })}</g>` })));
    ML.add(rock(c, ph ? 530 : 440, F - 6, 210, 90, mix(C.rock2, C.sand2, 0.3)));

    /* Jesus and the leaders */
    const L = S.layer({ par: 0.5, sh: 6 });
    const LEAD = [0, 1, 2].map((i) => {
      const el = L.add(withFace(person(c, leaderOpts(i)), faceBits(c)));
      return { i, el, p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]'), x: (ph ? [1000, 1075, 1150] : [1060, 1160, 1260])[i], y: F + 8 - (i % 2) * 8, seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const word = L.add(`<g><circle r="70" fill="url(#warm-glow)"/><circle r="40" fill="url(#halo-glow)"/>${wordFlame(c, 60)}</g>`);

    /* flies */
    const X = S.layer({ par: 0.36, sh: 5 });
    const accuse = X.add(hungPlate(c, `<g transform="scale(1.3)">${pointer(c)}</g><g class="x">${crossX(c, 32)}</g>`, { r: 50 }));
    const accX = accuse.querySelector('.x');
    const hope = X.add(`<g><circle r="30" fill="url(#warm-glow)"/>${heart(c, 14, C.sun)}</g>`);
    const V = verseScroll(c, tr(['Proroka jak ja', 'wzbudzi ci Pan'], ['The Lord will raise up', 'a prophet like me']), { w: 330, size: 22, title: tr('MOJŻESZ', 'MOSES') });
    const scrollSheet = X.add(`<g>${V.sheet}<g class="face" opacity="0"><circle cx="128" cy="${V.h * 0.62}" r="34" fill="url(#halo-glow)"/><g transform="translate(128 ${V.h * 0.62})">${medallion(c, CAST.jesus, { r: 16 })}</g></g></g>`);
    const face = scrollSheet.querySelector('.face');
    const rodTop = hanging(X, V.rodTop, { x: 0, y: 0, len: 700 });
    const rodBot = X.add(`<g>${V.rodBottom}</g>`);
    const line = X.add(`<g><path class="ln" d="" pathLength="1" stroke="${C.sun}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none"/></g>`);
    const lnP = line.querySelector('.ln');

    const JX = 780, JY = F + 10, JS = 1.06;
    const MX = ph ? 560 : 470;
    return (t, time) => {
      const T = time;
      const late = es(t, 4.0, 4.9);
      sk.blend(EVE, LATE, late);
      pose(rad, { x: 800, y: 120, r: T * 3 });
      pose(burst, { x: 800, y: 120, r: T * 1.5 });
      fade(burst, 0.5 + bump(t, 0.05, 1.0) * 0.4 - late * 0.2);
      swing(cl, 330 + Math.sin(T * 0.1) * 16, 250, T, 1.2, 0.6);

      /* v45a — not I as accuser */
      const open = bump(t, 0.05, 0.95);
      const toMoses = es(t, 1.1, 1.4) * (1 - es(t, 2.0, 2.3));
      const holdWord = es(t, 4.1, 4.4);
      jesus.set({ x: JX, y: JY, s: JS, flip: toMoses > 0.5, armF: 20 + open * 50 + holdWord * 60, armB: 10 + open * 60 + bump(t, 2.1, 2.9) * 40 + holdWord * 40, head: -open * 4 + holdWord * 10, blink: blinkAt(T, 1) });
      const ak = es(t, 0.1, 0.35, ease.out) * (1 - es(t, 0.9, 1.15, ease.in));
      vis(accuse, { x: 900, y: 240 - (1 - ak) * 460, r: Math.sin(T * 0.8) * 2, o: ak > 0.01 ? 1 : 0 });
      pose(accX, { s: es(t, 0.45, 0.6, ease.back), o: t > 0.45 ? 1 : 0 });

      /* v45b — Moses, your accuser, on whom you hope */
      const rise = es(t, 1.05, 1.45, ease.out);
      const pointAt = bump(t, 1.5, 2.05);
      const toJesus = es(t, 2.1, 2.4) * (1 - es(t, 4.1, 4.4) * 0.4);
      moses.set({ x: MX, y: F - 10 + (1 - rise) * 170, s: 1.08, flip: false, armF: 20 + pointAt * 70 + toJesus * 60, armB: 150 - toJesus * 60, head: -4, blink: blinkAt(T, 3), o: rise > 0.01 ? 1 : 0 });
      vis(mGlow, { x: MX, y: F - 130, s: 0.6 + rise * 0.5, o: rise * 0.8 });
      LEAD.forEach((l) => {
        const hopeK = es(t, 1.2, 1.45) * (1 - es(t, 1.7, 1.95));
        const away = es(t, 4.2 + l.i * 0.08, 4.5 + l.i * 0.08);
        const x = l.x + away * 80;
        l.p.set({ x, y: l.y, s: 1, flip: away < 0.5, walk: away > 0 && away < 1 ? x * 0.08 : undefined, armF: 20 + hopeK * 70 + bump(t, 1.6, 2.1) * -10, armB: 10 + hopeK * 100, head: -hopeK * 10 + bump(t, 1.6, 2.1) * 14 - bump(t, 3.1, 3.9) * 10, lean: pointAt * 5, blink: blinkAt(T, l.seed) });
        attr(l.angry, 'opacity', (0.3 + es(t, 4.1, 4.4) * 0.6).toFixed(2));
        attr(l.sad, 'opacity', (pointAt * 0.8).toFixed(2));
      });
      const [lhx, lhy] = headAt(LEAD[1].x, F, 1, true);
      const hk = bump(t, 1.2, 1.9);
      vis(hope, { x: lerp(lhx, MX + 20, es(t, 1.25, 1.6)), y: lerp(lhy - 40, F - 250, es(t, 1.25, 1.6)), s: 0.6 + hk * 0.6, o: hk });

      /* v46a — his scroll unrolls; a golden line from it to Jesus */
      const sc = es(t, 2.05, 2.3, ease.out);
      const un = es(t, 2.25, 2.6);
      const SX = ph ? 675 : 640, SY = 175 - (1 - sc) * 520;
      pose(rodTop, { x: SX, y: SY, r: Math.sin(T * 0.6) * 0.8 });
      pose(scrollSheet, { x: SX, y: SY, sy: Math.max(0.01, un), o: sc > 0.05 ? 1 : 0 });
      pose(rodBot, { x: SX, y: SY + un * V.h, o: sc > 0.05 ? 1 : 0 });
      const lk = es(t, 2.45, 2.85);
      const [jhx, jhy] = headAt(JX, JY, JS, false);
      attr(lnP, 'd', `M${SX + 170} ${SY + V.h * 0.5}Q${(SX + jhx) / 2 + 80} ${SY + 20} ${jhx + 6} ${jhy - 30}`);
      attr(lnP, 'stroke-dashoffset', (1 - lk).toFixed(3));
      fade(line, lk > 0.01 ? 1 - es(t, 4.0, 4.3) * 0.7 : 0);
      /* v46b — he wrote about me */
      attr(face, 'opacity', es(t, 3.15, 3.4).toFixed(2));

      /* v47 — his writings and my words: the living Word burns */
      const [hx, hy] = handAt(JX, JY, JS, false, 20 + holdWord * 60);
      vis(word, { x: hx + 6, y: hy - 24, s: (0.3 + holdWord * 0.7) * (1 + Math.sin(T * 4) * 0.04), o: holdWord > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, ph ? [[0, 20], [1.0, 0], [1.5, -20], [3.0, -20], [4.0, 0], [4.9, 0]] : [[0, 20], [1.0, 0], [1.5, -60], [2.3, -40], [3.0, -40], [4.0, 0], [4.9, 0]]);
      S.cam.y = kf(t, [[0, -40], [1.0, -20], [2.0, -10], [2.6, -60], [3.4, -60], [4.2, 0], [4.9, 20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.06], [2.0, 1.1], [3.0, 1.06], [4.2, 1.12], [4.9, 1.2]]);
    };
  },
};
