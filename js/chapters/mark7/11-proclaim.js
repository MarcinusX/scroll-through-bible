// Mk 7,36–37 — "Tell no one." But the more he tells them, the more the news runs: people hurry off
// to the towns of the Decapolis and paper speech-bubbles hop from hill to hill. In the golden evening
// a banner unrolls — "He has done all things well" — with an ear that hears and a mouth that speaks.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush, grass, reeds } from '../../assets/nature.js';
import { bird, ear, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { headAt, LOOK, bubble, speech, GLYPH, spark, plate, hang2, soundRings, greekTown, flowerWord, profileFace } from './lib.js';

const PI = Math.PI;
const FLOOR = 684;
const JX = 800;

export default {
  id: 'm7-proclaim',
  beats: [
    { v: 36, text: '[Jezus] przykazał im, żeby nikomu nie mówili.' },
    { v: 36, cont: true, text: 'Lecz im bardziej przykazywał, tym gorliwiej to rozgłaszali.' },
    { v: 37, text: 'I pełni zdumienia mówili: «Dobrze uczynił wszystko.' },
    { v: 37, cont: true, text: 'Nawet głuchym słuch przywraca i niemym mowę».' },
  ],
  cam: { x: [-30, 30], y: [-80, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const DAY = ['#cde1e2', '#eee7cf', '#f7ebd4'];
    const EVE = ['#e3b9a6', '#f2cfa7', '#f8e3c2'];
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1180, y: 170, len: 700 });
    const glow = hangL.add(`<g>${rays(c, { n: 14, r0: 60, r1: 800, color: '#fff0c8' })}</g>`);
    const cl1 = hanging(hangL, cloud(c, 170, C.blushVeil, '#e6c7c2'), { x: 470, y: 150, len: 700 });
    const birds = flock(S, hangL, 6, (cc) => bird(cc, { color: C.bird }), { y: 200, speed: 50, scale: 0.45 });

    /* ---------- the lake, and the ten towns on the hills ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 390, amps: [14, 6, 2], lens: [1000, 360, 120], color: C.hillFar }).markup);
    S.layer({ par: 0.12, sh: 1 }).add(waterBand(c, { y: 412, color: C.lake, foamN: 20, bottom: 900 }).markup);
    const hills = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 500, amps: [34, 12, 3], lens: [800, 300, 120], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 20 });
    hills.add(h2.markup);
    const TOWNS = [220, 420, 610, 1000, 1210, 1400].map((x, i) => ({ x, y: h2.fn(x) + 8, sc: 0.55 + (i % 3) * 0.08 }));
    TOWNS.forEach((tw) => hills.add(`<g transform="translate(${tw.x} ${tw.y})">${greekTown(c, tw.sc)}</g>`));
    const shore = S.layer({ par: 0.4, sh: 3 });
    const sfn = c.wave(600, [5, 2], [700, 160]);
    shore.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), C.sand).out());
    shore.add(reeds(c, 330, 604, 10, 70) + palm(c, 1300, 606, 170) + olive(c, 250, 606, 0.8));
    shore.add(grass(c, { x0: -600, x1: 2200, y: 600, fn: sfn, n: 40, h: 12, color: C.olive }));

    /* ---------- people ---------- */
    const crowdL = S.layer({ par: 0.55, sh: 4 });
    const people = crowd(S, crowdL, [
      { y: 640, s: 0.66, n: 14, x0: 380, x1: 1220 },
      { y: 666, s: 0.76, n: 10, x0: 360, x1: 1240 },
    ]).filter((m) => Math.abs(m.x - JX) > 110);
    people.forEach((m, i) => { m.run = i % 3 !== 0; m.to = m.x < JX ? m.x - c.rr(500, 800) : m.x + c.rr(500, 800); m.d = c.rr(0, 0.5); });
    const ppl = S.layer({ par: 0.6, sh: 5 });
    const jesus = S.puppet(ppl.add(person(c, CAST.jesus)));
    const healed = S.puppet(ppl.add(person(c, LOOK.deaf)));

    /* ---------- words ---------- */
    const fx = S.layer({ par: 0.6, sh: 6 });
    const hush = [0, 1].map((i) => fx.add(`<g>${bubble(c, tr('Nikomu ani słowa…', 'Tell no one…'), { size: 20 - i * 3, tail: 1 })}</g>`));
    // news hopping to the towns — more and more of them
    const NEWS = Array.from({ length: 16 }, (_, i) => {
      const tw = TOWNS[i % TOWNS.length];
      return { i, tw, el: fx.add(`<g>${speech(c, i % 2 ? GLYPH.bang(c) : flowerWord(c, i), { w: 40, h: 32, flip: tw.x > JX })}</g>`), t0: 1.2 + (i / 16) * 0.75, from: [JX + (i % 2 ? 90 : -90), 480] };
    });
    const townPops = TOWNS.map((tw, i) => ({ tw, el: fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 34, h: 30 })}</g>`), i }));
    const cheers = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${i % 2 ? spark(c, 10) : speech(c, GLYPH.bang(c), { w: 34, h: 32, flip: i % 4 === 0 })}</g>`), x: lerp(420, 1180, i / 7) + c.rr(-20, 20), y: c.rr(400, 470) }));
    const banner = fx.add(`<g>${hang2(bannerMarkup(c, tr('Dobrze uczynił wszystko', 'He has done all things well')), 250, 400)}</g>`);
    const pf = profileFace(c, 0.45);
    const plates = [
      { m: `<g transform="scale(1.1)">${ear(c, C.skin)}</g>`, x: 450 },
      { m: `<g transform="translate(-10 12)">${pf.face}${pf.lipU}<g transform="translate(0 4)">${pf.lipL}</g></g>`, x: 1150 },
    ].map((p, i) => ({ ...p, i, el: hanging(fx, plate(c, p.m, { r: 60 }), { x: p.x, y: 330, len: 700 }) }));
    const earRing = soundRings(fx, c, { n: 3, r: 30, w: 5, color: shade(C.ochre, 0.2) });
    const mouthWords = Array.from({ length: 3 }, (_, i) => ({ i, el: fx.add(`<g>${speech(c, flowerWord(c, i + 1), { w: 36, h: 30 })}</g>`) }));
    const healedWords = Array.from({ length: 3 }, (_, i) => ({ i, el: fx.add(`<g>${speech(c, flowerWord(c, i + 2), { w: 42, h: 34 })}</g>`) }));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1360, 880, 220, C.sage, C.moss) + bush(c, 160, 880, 220, C.moss, C.sage));

    return (t, time) => {
      const T = time;
      const eve = es(t, 1.8, 3.6);
      sk.blend(DAY, EVE, eve);
      swing(sunEl, 1180, 170 + eve * 90, T, 1, 0.6);
      pose(glow, { x: 1180, y: 170 + eve * 90, r: t * 3, o: eve * 0.45 });
      swing(cl1, 470 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.7, 1);
      birds(T, 1);

      /* v36 — "tell no one" … and the more he says it, the more they tell */
      const order1 = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.1));
      const order2 = es(t, 1.05, 1.25) * (1 - es(t, 1.8, 2.0));
      const praise = es(t, 2.1, 2.4);
      jesus.set({
        x: JX, y: FLOOR + 4, s: 1.04,
        armB: 10 + (order1 + order2) * 140 + praise * 20, armF: 16 + (order1 + order2) * 30 + praise * 30,
        head: -praise * 4, blink: blinkAt(T),
      });
      const [jx, jy] = headAt(JX, FLOOR + 4, 1.04, false);
      pose(hush[0], { x: jx - 70, y: jy - 34, s: es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.95, 1.1)), o: t > 0.08 && t < 1.1 ? 1 : 0 });
      pose(hush[1], { x: jx - 60, y: jy - 30, s: es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.6, 1.75)), o: t > 1.06 && t < 1.75 ? 1 : 0 });
      const talk = Math.max(0, Math.sin(T * 6));
      healed.set({ x: 900, y: FLOOR, s: 0.94, flip: false, armF: 60 + es(t, 1.1, 1.3) * 40 + talk * 10 * es(t, 3, 3.3), armB: bump(t, 2.1, 3.0) * 150 + es(t, 3.0, 3.3) * 60, head: -6 + bump(t, 0.1, 1.0) * 10, blink: blinkAt(T, 2) });
      people.forEach((m) => {
        const go = m.run ? es(t, 1.15 + m.d * 0.5, 1.9 + m.d * 0.4, ease.in) : 0;
        const x = lerp(m.x, m.to, go);
        const cheer = m.run ? 0 : praise;
        m.p.set({
          x, y: m.y, s: m.s, flip: go > 0 ? m.to < m.x : m.x > JX, o: 1 - es(t, 1.85 + m.d * 0.3, 2.05 + m.d * 0.3) * (m.run ? 1 : 0),
          walk: go > 0 && go < 1 ? x * 0.06 : undefined,
          armF: order1 * (m.i % 3 === 1 ? 40 : 0) + go * 80 + cheer * (70 + Math.sin(T * 4 + m.seed) * 8), armB: cheer * 150,
          head: -cheer * 8, blink: blinkAt(T, m.seed),
        });
      });
      NEWS.forEach((n) => {
        const k = es(t, n.t0, n.t0 + 0.45, (x) => x);
        const x = lerp(n.from[0], n.tw.x, k), y = lerp(n.from[1], n.tw.y - 60, k) - Math.sin(k * PI) * 160;
        pose(n.el, { x, y, s: 0.8 + Math.sin(k * PI) * 0.3, o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });
      townPops.forEach((p) => {
        const k = es(t, 1.55 + p.i * 0.08, 1.75 + p.i * 0.08, ease.back) * (1 - es(t, 2.9, 3.1));
        pose(p.el, { x: p.tw.x + 8, y: p.tw.y - 60 - k * 8 + Math.sin(T * 3 + p.i) * 2, s: k * 0.85, o: k > 0.02 ? 1 : 0 });
      });

      /* v37a — astonished beyond measure: "He has done all things well" */
      const bK = es(t, 2.1, 2.5, ease.out);
      pose(banner, { x: JX, y: 230 - (1 - bK) * 1150 + Math.sin(T * 0.8) * 2, r: Math.sin(T * 0.6) * 0.6 });
      cheers.forEach((ch) => {
        const k = es(t, 2.2 + ch.i * 0.05, 2.4 + ch.i * 0.05, ease.back) * (1 - es(t, 3.0, 3.2));
        pose(ch.el, { x: ch.x, y: ch.y - k * 10 + Math.sin(T * 2.4 + ch.i) * 3, s: k, r: Math.sin(T * 2 + ch.i) * 6, o: k > 0.02 ? 1 : 0 });
      });

      /* v37b — even the deaf hear, and the mute speak */
      plates.forEach((p) => {
        const k = es(t, 3.0 + p.i * 0.1, 3.3 + p.i * 0.1, ease.back);
        swing(p.el, p.x, 400 - (1 - k) * 1150, T, 1.4, 0.8, p.i);
      });
      const on = es(t, 3.25, 3.4);
      earRing(450, 400, on, T);
      mouthWords.forEach((w) => {
        const k = ((T * 0.45 + w.i / 3) % 1);
        pose(w.el, { x: 1190 + k * 60, y: 380 - k * 60, s: 0.5 + k * 0.5, o: on * Math.min(1, k * 5) * (1 - k) });
      });
      const [hx, hy] = headAt(900, FLOOR, 0.94, false);
      healedWords.forEach((w) => {
        const k = es(t, 3.3 + w.i * 0.12, 3.5 + w.i * 0.12, ease.back);
        pose(w.el, { x: hx + 40 + w.i * 44, y: hy - 30 - w.i * 36 + Math.sin(T * 2 + w.i) * 3, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.y = -es(t, 1.2, 1.9) * 50 * (1 - es(t, 2.0, 2.5)) - es(t, 2.0, 2.5) * 40;
      S.cam.z = 1 + es(t, 0, 0.8) * 0.04 - es(t, 1.2, 1.9) * 0.04;
    };
  },
};

/** a long paper banner with words, rolled ends; origin: top centre */
function bannerMarkup(c, text) {
  const w = Math.max(420, text.length * 15 + 80), h = 64;
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [w / 2, 0], [w / 2 - 6, h / 2], [w / 2, h], [-w / 2, h], [-w / 2 + 6, h / 2]], 0.8, 8), C.cream);
  s.p(c.cut(c.rect(-w / 2 + 8, 8, w - 16, h - 16), 0.4, 8), C.parchment);
  s.p(c.cut(c.ell(-w / 2 - 6, h / 2, 10, h / 2 + 4, 14), 0.3, 4) + c.cut(c.ell(w / 2 + 6, h / 2, 10, h / 2 + 4, 14), 0.3, 4), C.wood3);
  let st = '';
  [-w / 2 + 24, w / 2 - 24].forEach((x) => { st += c.cut(c.star(x, h / 2, 9, 4, 5, 0), 0.2, 3); });
  s.p(st, C.sun);
  return `${s.out()}<text x="0" y="${h / 2 + 9}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="27" font-style="italic" fill="${C.terracotta}">${text}</text>`;
}
