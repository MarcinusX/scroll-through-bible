// Mk 2,27–28 — back in the field at the golden hour: the Sabbath comes down as a gift for people
// (they sit and rest), the heavy load is lifted off the bent man, and the Sabbath's two candles
// come to rest above Jesus: the Son of Man is lord even of the Sabbath.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, headAt, scribe, wheatField, sabbathTag, plateDisc, candle, spark } from './lib.js';

const PI = Math.PI;
const PATH = 690;

/** a small picture card: a man bent under a heavy stone that bears the Sabbath candles */
function burdenCard(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-80, -80, 160, 150), 0.6, 8), C.cream);
  s.p(c.cut(c.rect(-72, -72, 144, 134), 0.4, 8), C.parchment);
  s.p(c.cut([[-72, 40], [72, 38], [72, 62], [-72, 62]], 0.5, 6), mix(C.sand2, C.dune, 0.4));
  return s.out();
}
function stone(c) {
  const s = sheet().p(c.cut(c.blob(0, -22, 52, 26, 12, 0.12).map(([x, y]) => [x, Math.min(y, 0)]), 1, 6), C.rock2);
  const cand = (x) => `<g transform="translate(${x} -40) scale(.4)">${candle(c, 40)}</g>`;
  return s.out() + cand(-16) + cand(16);
}

export default {
  id: 'm2-lord',
  beats: [
    { v: 27, text: 'I dodał: «To szabat został ustanowiony dla człowieka,' },
    { v: 27, cont: true, text: 'a nie człowiek dla szabatu.' },
    { v: 28 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [0.98, 1.12] },
  build(S) {
    const c = S.c;
    const GOLD = ['#e9c9a8', '#f4d7a8', '#f7e3bf'];
    const DUSK = ['#b8a3c0', '#eab58f', '#f6d6a6'];
    const sk = sky(S, GOLD);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunGlow = hangL.add(`<circle r="220" fill="url(#warm-glow)" opacity=".6"/>`);
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0b36a', inner: '#f6c98c' }), { x: 1170, y: 250, len: 900 });
    const cl1 = hanging(hangL, cloud(c, 190, C.cream, C.peach), { x: 420, y: 170, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 260, speed: 40, scale: 0.5 });

    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 440, amps: [18, 8, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.dusk, 0.25), trees: 12, treeColor: mix(C.sage2, C.dusk, 0.2), treeH: 20 }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const h2 = band(c, { y: 505, amps: [14, 6, 2], lens: [900, 300, 120], color: mix(C.hillMid, C.wheat, 0.4) });
    hills.add(h2.markup + olive(c, 260, h2.fn(260) + 8, 0.7) + olive(c, 1380, h2.fn(1380) + 8, 0.8));
    const backF = S.layer({ par: 0.6, sh: 3 });
    backF.add(sheet().p(c.cut([[-900, 590], [2500, 590], [2500, 1700], [-900, 1700]], 1, 30), mix(C.wheat2, C.dune, 0.4)).out());
    backF.add(wheatField(c, { x0: -900, x1: 2500, y: 600, h: 70, n: 220, color: shade(C.wheat2, -0.05), ear: C.wheat2 }));
    backF.add(wheatField(c, { x0: -900, x1: 2500, y: 640, h: 96, n: 200, color: C.wheat2, ear: C.wheat }));
    backF.add(sheet().p(c.cut([[-900, 668], [2500, 668], [2500, 720], [-900, 720]], 1.2, 12), C.sand).out());

    /* the gift of rest, the lifted burden, the light behind Jesus */
    const glowL = S.layer({ par: 0.6, sh: 1, flat: true });
    const gift = glowL.add(`<path d="M720 250L880 250L1120 700L480 700Z" fill="#fff1c4" opacity="0"/>`);
    const burst = glowL.add(`<g opacity="0">${rays(c, { n: 20, r0: 60, r1: 400, spread: 0.045, color: '#fff3cf' })}<circle r="240" fill="url(#halo-glow)"/></g>`);

    /* people */
    const act = S.layer({ par: 0.6, sh: 5 });
    const PH = [1196, 1276].map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(act.add(scribe(c, i + 1))) }));
    const DIS = [
      { k: 'james', x: 540 }, { k: 'andrew', x: 624 }, { k: 'peter', x: 970 }, { k: 'john', x: 1054 },
    ].map((d, i) => ({ ...d, i, flip: d.x > 800, seed: c.rr(0, 9), st: S.puppet(act.add(person(c, { ...CAST[d.k] }))), sit: S.puppet(act.add(person(c, { ...CAST[d.k], pose: 'sit' }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    /* wheat in front */
    const frontF = S.layer({ par: 0.7, sh: 5 });
    frontF.add(wheatField(c, { x0: -900, x1: 2500, y: 790, h: 120, n: 200, color: C.wheat2, ear: C.wheat, back: mix(C.wheat2, C.dune, 0.3) }));

    /* hanging things: the Sabbath with its candles, the card of the burdened man */
    const fly = S.layer({ par: 0.64, sh: 5 });
    const tag = hanging(fly, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 800, y: 200, len: 800 });
    const tagFl = Array.from(tag.querySelectorAll('.flame'));
    const tagGl = Array.from(tag.querySelectorAll('.glow'));
    const card = hanging(fly, `${burdenCard(c)}<g data-g="stone">${stone(c)}</g><g data-g="bent">${person(c, { robe: C.stone, hair: C.hair, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin2 })}</g>`, { x: 560, y: 330, len: 700 });
    const cStone = card.querySelector('[data-g="stone"]');
    const cMan = S.puppet(card.querySelector('[data-g="bent"]').firstElementChild);
    const sparks = [0, 1, 2, 3, 4, 5].map((i) => fly.add(`<g>${spark(c, c.rr(8, 12))}</g>`));

    return (t, time) => {
      const T = time;
      sk.blend(GOLD, DUSK, es(t, 0.5, 3.2, ease.sine));
      const sy = 250 + es(t, -0.5, 3.4) * 90;
      swing(sunEl, 1170, sy, T, 0.9, 0.5);
      pose(sunGlow, { x: 1170, y: sy, s: 1 + es(t, 2, 3) * 0.3 });
      swing(cl1, 420 + Math.sin(T * 0.1) * 20, 170, T, 1.1, 0.6, 1);
      birds(T, 1);

      /* v27a — the Sabbath comes down as a gift: they sit down to rest and eat */
      const lordK = es(t, 2.04, 2.45, ease.out);
      const tagDown = es(t, 0.05, 0.45, ease.out);
      const tx = lerp(800, 800, lordK), ty = lerp(lerp(-160, 250, tagDown), 318, lordK);
      pose(tag, { x: tx, y: ty, s: 1 + lordK * 0.25, r: Math.sin(T * 0.9) * 2 * (1 - lordK * 0.7) });
      tagFl.forEach((f, i) => pose(f, { y: -60, sx: 1 + Math.sin(T * 7 + i) * 0.1, sy: 1 + Math.sin(T * 5 + i) * 0.1 + lordK * 0.2 }));
      tagGl.forEach((g) => fade(g, 0.6 + lordK * 0.4));
      fade(gift, bump(t, 0.3, 1.6) * 0.3);
      const sitK = es(t, 0.45, 0.52);
      DIS.forEach((d, i) => {
        const cheer = es(t, 2.2 + i * 0.05, 2.5 + i * 0.05);
        d.st.set({ x: d.x, y: PATH + (i % 2 ? 4 : -4), s: 0.95, flip: d.flip, o: 1 - sitK, armF: 20, head: -4, blink: blinkAt(T, d.seed) });
        d.sit.set({ x: d.x + (d.flip ? -10 : 10), y: PATH + 10, s: 0.95, flip: d.flip, o: sitK, armF: 40 + bump(t, 0.6 + i * 0.08, 1.2 + i * 0.08) * 40 + cheer * 90, armB: 20 + cheer * (i % 2 ? 60 : 140), head: -cheer * 10 + bump(t, 0.6, 1.4) * -6, blink: blinkAt(T, d.seed) });
      });

      /* v27b — the card: the heavy load is lifted off the man */
      const cIn = es(t, 0.95, 1.25, ease.back) * (1 - es(t, 2.0, 2.3));
      pose(card, { x: 560, y: lerp(-220, 330, cIn), r: Math.sin(T * 0.8) * 2, o: cIn > 0.01 ? 1 : 0 });
      const lift = es(t, 1.3, 1.65);
      pose(cStone, { x: lerp(22, 10, lift), y: lerp(-10, -150, lift), r: 20 * (1 - lift) - lift * 12, s: 0.85, o: 1 - es(t, 1.6, 1.8) });
      cMan.set({ x: -6, y: 52, s: 0.46, lean: 22 * (1 - lift), head: 10 * (1 - lift) - lift * 8, armF: 100 * (1 - lift) + lift * 30, armB: 160 * (1 - lift) + lift * 150 });

      /* v28 — the Son of Man, lord of the Sabbath */
      jesus.set({ x: 800, y: PATH, s: 1.08, flip: false, armF: 20 + bump(t, 0.1, 0.9) * 40 + bump(t, 1.1, 1.9) * 30 + lordK * 40, armB: 10 + lordK * 130, head: -lordK * 6, blink: blinkAt(T) });
      pose(burst, { x: 800, y: 480, s: 0.4 + lordK * 0.6, r: T * 3, o: lordK * 0.45 });
      PH.forEach((m) => {
        const back = es(t, 2.2, 2.6);
        m.p.set({ x: m.x + back * 40, y: PATH + 4, s: 0.98, flip: true, armF: bump(t, 0.9, 1.9) * 40 + back * 50, armB: back * 30, head: -back * 10 + bump(t, 1.2, 1.9) * 8, lean: -back * 8, blink: blinkAt(T, m.seed) });
      });
      sparks.forEach((sp, i) => {
        const k = es(t, 2.3 + i * 0.05, 2.55 + i * 0.05, ease.back);
        const a = (i / 6) * PI * 2 + T * 0.3;
        pose(sp, { x: 800 + Math.cos(a) * 150, y: 380 + Math.sin(a) * 70, s: k * 0.9, r: T * 40, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 0], [0.9, 0], [1.2, -24], [1.9, -24], [2.2, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.8, 1.06], [1.9, 1.06], [2.6, 1.0]]);
      S.cam.y = kf(t, [[-0.5, 10], [0.8, 20], [1.9, -10], [2.6, -30]]);
    };
  },
};
