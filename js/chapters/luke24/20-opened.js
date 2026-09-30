// Łk 24,44–46 — Still in the room at night, Jesus among them: "Everything written about me in the Law of Moses and
// the Prophets and the Psalms must be fulfilled" — three scrolls come down on their strings, the tablets of the Law,
// the prophet Elijah, David's harp, and light up one by one. "Then He opened their minds to understand the Scriptures":
// a little light kindles over the head of each of them, one after another. "Thus it is written, that the Christ should
// suffer and on the third day rise from the dead": a round plate turns over — from the cross on its hill at dusk to
// the sunrise over the empty tomb.
import { C, blinkAt, pose, lerp, mix } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { gatherRoom, MID, headAt, bookScroll, lawTablets, harp, medallion, L9, strip, spark, discFaces, hanging, swing, hangK, STRING, tr, PI } from './lib.js';

export default {
  id: 'lk24-opened',
  beats: [
    { v: 44 },
    { v: 45 },
    { v: 46 },
  ],
  cam: { x: [-40, 60], y: [-20, 60], z: [0.9, 1.2] },
  build(S) {
    const c = S.c;
    const G = gatherRoom(S);
    const fx = S.layer({ par: 0.5, sh: 5 });
    const emb = [
      `<g transform="translate(0 20) scale(.36)">${lawTablets(c)}</g>`,
      `<g transform="translate(0 0)">${medallion(c, L9.elijah, { r: 17 })}</g>`,
      `<g transform="translate(0 22) scale(.46)">${harp(c)}</g>`,
    ];
    const words = [tr('Prawo Mojżesza', 'the law of Moses'), tr('Prorocy', 'the prophets'), tr('Psalmy', 'the psalms')];
    const scrolls = emb.map((e, i) => ({
      i,
      el: fx.add(`<g><path d="M0 -1600V-44" stroke="${STRING}" stroke-width="1.2" fill="none"/><circle r="80" fill="url(#halo-glow)" class="lit" opacity="0"/>${bookScroll(c, e, { w: 118, h: 78 })}<g transform="translate(0 64)">${strip(c, words[i], { size: 15 })}</g></g>`),
    }));
    scrolls.forEach((s) => { s.lit = s.el.querySelector('.lit'); });
    const lamps = G.crew.map(() => fx.add(`<g>${spark(c, 9)}</g>`));
    const faces = discFaces(c, 86);
    const disc = hanging(fx, `<g data-k="l24dF">${faces.front}</g><g data-k="l24dB" opacity="0">${faces.back}</g>`, { x: 0, y: -1500, len: 900 });
    const dF = S.$('l24dF'), dB = S.$('l24dB');

    return (t, T) => {
      G.RR.R.update(T, 1);
      G.RR.door.set(0); G.RR.door.bolt(1);
      pose(G.glow, { x: MID.x, y: MID.y, s: 1, o: 0.8 });
      const speak = es(t, 0.05, 0.3);
      const point = es(t, 2.05, 2.3);
      G.jesus.set({ x: MID.x, y: MID.y, s: MID.s, armF: 24 + speak * 40 + point * 20, armB: 12 + speak * 100 * (1 - point) + point * 140, head: -speak * 4 - point * 8, blink: blinkAt(T) });
      /* v44: the Law, the Prophets, the Psalms */
      scrolls.forEach((s) => {
        const k = es(t, 0.1 + s.i * 0.2, 0.35 + s.i * 0.2, ease.back) * (1 - es(t, 1.95, 2.15, ease.in));
        hangK(s.el, k, 560 + s.i * 240, 300 + (s.i === 1 ? -16 : 0), T, s.i);
        fade(s.lit, es(t, 0.4 + s.i * 0.2, 0.6 + s.i * 0.2) * 0.8);
      });
      /* v45: He opens their minds */
      G.crew.forEach((m, i) => {
        const look = es(t, 0.2, 0.5);
        const glad = es(t, 1.2, 1.6);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > MID.x, armF: 22 + glad * 20, armB: 10 + glad * (i % 3 === 0 ? 90 : 20), head: -look * 10 + glad * 4 - point * 6, blink: blinkAt(T, m.seed) });
        fade(m.sad, 0);
        const d = Math.abs(m.x - MID.x) / 500;
        const k = es(t, 1.08 + d * 0.5, 1.3 + d * 0.5, ease.back);
        const [hx, hy] = headAt(m.x, m.y, m.s, m.x > MID.x);
        pose(lamps[i], { x: hx, y: hy - 44, s: k * (1 + (T ? Math.sin(T * 3 + i) * 0.08 : 0)), o: k > 0.01 ? 1 : 0 });
      });
      /* v46: to suffer, and on the third day to rise */
      const dIn = es(t, 2.05, 2.35, ease.back);
      const flip = es(t, 2.5, 2.75);
      const sx = Math.cos(flip * PI);
      swing(disc, MID.x, lerp(-1000, 300, dIn), T, 1, 0.7);
      pose(disc.querySelector('.obj'), { sx: Math.max(0.03, Math.abs(sx)) });
      fade(dF, sx >= 0 ? 1 : 0);
      fade(dB, sx < 0 ? 1 : 0);

      S.cam.x = 0;
      S.cam.y = 40 - es(t, 0, 0.3) * 20;
      S.cam.z = S.portrait ? 0.92 : 1.02;
      void seg; void bump; void mix;
    };
  },
};
