// Mt 22,37–40 — Jesus answers. Heart, soul and mind hang in a row and fill with light one by one. "This is the
// greatest and first": they rise, and a peg-beam comes down with the first tablet, God and the heart. "The second
// is like it": a second tablet beside it, two neighbours, and below two people meet and a bridge of light joins
// their hearts. "On these two hang all the Law and the Prophets": scroll after scroll comes down on its thread
// and hangs from the two tablets.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, pharisee, scribe, man, woman, moodPuppet, voiceRings, disc, loveIcon, strip, glowHeart, lightArc, tablet, pegBeam, hangScroll, sparkle, FONT, tr } from './lib.js';

const JX = 700, LX = 950;
const BX = 800, BY = 150, PEG = 118;          // the peg-beam and its two pegs

export default {
  id: 'mt22-love',
  beats: [
    { v: 37 },
    { v: 38 },
    { v: 39 },
    { v: 40 },
  ],
  cam: { x: [-30, 30], y: [-50, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 3, x0: 520, x1: 640, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 860, x1: 1000, pose: 'sit' }]);

    /* the air above: three plates; the beam, two tablets, the scrolls */
    const air = S.layer({ par: 0.3, sh: 5 });
    const KINDS = ['heart', 'soul', 'mind'];
    const NAMES = [tr('sercem', 'heart'), tr('duszą', 'soul'), tr('umysłem', 'mind')];
    const three = KINDS.map((k, i) => {
      const el = hanging(air, `<g data-part="glow" opacity="0"><circle r="84" fill="url(#warm-glow)"/></g>${disc(c, 42, { fill: C.cream, rim: C.ochre })}<g data-part="dim"><g opacity=".35">${loveIcon(c, k, mix(C.jesusMantle, C.stone2, 0.7))}</g></g><g data-part="lit" opacity="0">${loveIcon(c, k)}</g><g transform="translate(0 62)">${strip(c, NAMES[i], { size: 16 })}</g>`, { x: 0, y: -300, len: 500 });
      return { el, i, x: 620 + i * 180, glow: el.querySelector('[data-part="glow"]'), lit: el.querySelector('[data-part="lit"]'), dim: el.querySelector('[data-part="dim"]') };
    });
    const beam = air.add(`<g><path d="M-160 -1400V-8M160 -1400V-8" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${pegBeam(c, 400)}</g>`);
    const face = (inner, n) => `${tablet(c, 118, 150)}<text x="0" y="46" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="600" fill="${C.terracotta}">${n}</text>${inner}`;
    const godIcon = `<g transform="translate(0 94)">${loveIcon(c, 'heart')}</g><path d="${c.poly(c.star(0, 60, 9, 4, 5, -Math.PI / 2))}" fill="${C.sun}"/>`;
    const nbIcon = `<g transform="translate(-16 126) scale(.3)">${person(c, man(c))}</g><g transform="translate(16 126) scale(.3) scale(-1 1)">${person(c, woman(c))}</g><path d="${c.ribbon(c.qbez([-8, 82], [0, 70], [8, 82], 8), 2.4)}" fill="${C.sun}"/>`;
    const tabs = [
      { el: air.add(`<g><circle cy="70" r="110" fill="url(#halo-glow)" data-part="glow" opacity="0"/>${face(godIcon, 'I')}<g transform="translate(0 160)">${strip(c, tr('Bóg', 'God'), { size: 16 })}</g></g>`), x: BX - PEG },
      { el: air.add(`<g><circle cy="70" r="110" fill="url(#halo-glow)" data-part="glow" opacity="0"/>${face(nbIcon, 'II')}<g transform="translate(0 160)">${strip(c, tr('bliźni', 'neighbour'), { size: 16 })}</g></g>`), x: BX + PEG },
    ].map((tb, i) => ({ ...tb, i, glow: tb.el.querySelector('[data-part="glow"]') }));
    const cols = [C.parchment, mix(C.parchment, C.sand, 0.4), mix(C.parchment, C.stone, 0.3)];
    const scrolls = Array.from({ length: 12 }, (_, i) => {
      const side = i < 6 ? 0 : 1, k = i % 6;
      const len = 20 + (k % 3) * 18;
      return { i, side, k, len, dx: (k - 2.5) * 30, el: air.add(`<g>${hangScroll(c, len, 36, cols[i % 3])}</g>`) };
    });
    const labels = [tr('Prawo', 'the Law'), tr('Prorocy', 'the Prophets')].map((w, i) => air.add(`<g>${strip(c, w, { size: 17 })}</g>`));

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const nb = [man(c, { robe: C.sageRobe }), woman(c, { robe: C.roseRobe })].map((o, i) => ({ i, p: S.puppet(pl.add(person(c, o))), seed: c.rr(0, 9) }));
    const hearts = [0, 1].map(() => pl.add(`<g>${glowHeart(c, 11)}</g>`));
    const bridge = pl.add(`<g>${lightArc(c, 120, 36)}</g>`);
    const phar = [0, 1, 4].map((k, i) => ({ i, p: moodPuppet(S, pl, c, pharisee(c, k)), x: [1040, 1100, 1160][i], seed: c.rr(0, 9) }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const law = S.puppet(pl.add(person(c, scribe(c, 0))));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v37 — heart, soul, mind */
      three.forEach((f) => {
        const d = es(t, 0.05 + f.i * 0.06, 0.35 + f.i * 0.06, ease.out) * (1 - es(t, 1.05, 1.35, ease.in));
        pose(f.el, { x: f.x, y: lerp(-800, 250 + (f.i % 2) * 18, d), r: Math.sin(T * 0.8 + f.i) * 1.5 });
        const lit = es(t, 0.4 + f.i * 0.14, 0.55 + f.i * 0.14);
        fade(f.lit, lit); fade(f.dim, 1 - lit); fade(f.glow, lit);
      });

      /* v38 — the beam, and the first tablet; v39 — the second */
      const bd = es(t, 1.1, 1.45, ease.out);
      pose(beam, { x: BX, y: lerp(-600, BY, bd), r: Math.sin(T * 0.6) * 0.6 * bd });
      tabs.forEach((tb) => {
        const k = es(t, 1.3 + tb.i * 1.0, 1.65 + tb.i * 1.0, ease.out);
        pose(tb.el, { x: tb.x, y: lerp(-700, BY + 6, k), r: Math.sin(T * 0.7 + tb.i) * 1.2 * k });
        fade(tb.glow, es(t, 1.55 + tb.i * 1.0, 1.8 + tb.i * 1.0) * (tb.i === 0 ? 1 - es(t, 2.2, 2.5) * 0.6 : 1));
      });

      /* v39 — two neighbours; a bridge of light between their hearts */
      const nk = es(t, 2.1, 2.45);
      nb.forEach((n) => {
        const x = n.i ? lerp(300, 548, nk) : lerp(200, 450, nk);
        n.p.set({ x, y: F + 14, s: 0.9, flip: n.i === 1, walk: nk > 0 && nk < 1 ? x * 0.05 : undefined, armF: es(t, 2.45, 2.6) * 50, blink: blinkAt(T, n.seed), o: nk > 0 ? 1 : 0 });
        const hk = es(t, 2.5 + n.i * 0.05, 2.65 + n.i * 0.05, ease.back);
        pose(hearts[n.i], { x: x + (n.i ? -6 : 6), y: F + 14 - 120, s: hk * (1 + Math.sin(T * 3 + n.i) * 0.05), o: hk > 0.02 ? 1 : 0 });
      });
      const bk = es(t, 2.62, 2.85);
      pose(bridge, { x: 456, y: F + 14 - 124, sx: Math.max(0.01, bk * (98 / 120)), o: bk > 0.01 ? 1 : 0 });

      /* v40 — all the Law and the Prophets hang on these two */
      scrolls.forEach((s) => {
        const k = es(t, 3.05 + s.k * 0.06 + s.side * 0.12, 3.35 + s.k * 0.06 + s.side * 0.12, ease.out);
        const tx = tabs[s.side].x + s.dx * 0.9;
        pose(s.el, { x: tx, y: lerp(-500, BY + 156, k), r: Math.sin(T * 0.9 + s.i) * 2 * k, o: k > 0.01 ? 1 : 0 });
      });
      labels.forEach((el, i) => { const k = es(t, 3.45 + i * 0.1, 3.6 + i * 0.1, ease.back); pose(el, { x: tabs[i].x + (i ? 132 : -132), y: BY + 214, s: k, o: k > 0.02 ? 1 : 0 }); });

      /* Jesus answers; the lawyer and the Pharisees listen */
      const speak = 1 - es(t, 3.9, 4.0);
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), head: -bump(t, 0.0, 4.0) * 10, armF: 40 + bump(t, 0.1, 0.9) * 50 + bump(t, 2.1, 2.9) * 20 + bump(t, 3.1, 3.9) * 50, armB: 16 + bump(t, 1.1, 1.9) * 110 });
      voice(JX + 26, F - 176, speak, T, { dir: 1 });
      law.set({ x: LX, y: F + 6, s: 0.95, flip: true, blink: blinkAt(T, 3), head: -bump(t, 0.0, 4.0) * 12 + es(t, 3.4, 3.8) * 8, armF: 26 });
      phar.forEach((p) => {
        p.p.set({ x: p.x, y: F + 2 + (p.i % 2) * 10, s: 0.9, flip: true, head: -bump(t, 0.0, 4.0) * 10, armF: 30, blink: blinkAt(T, p.seed) });
        p.p.mood({ angry: 0.5 * (1 - es(t, 1.0, 2.0)), sad: 0 });
      });
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -bump(t, 0.0, 4.0) * 14 - 3, blink: blinkAt(T, m.seed) }));

      S.cam.y = -10 - es(t, 1.0, 1.5) * 16;
      S.cam.z = 1.02;
    };
  },
};
