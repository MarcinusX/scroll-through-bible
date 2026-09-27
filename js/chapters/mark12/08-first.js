// Mk 12,28–31 — the greatest commandment. A scribe who has been listening by the porch comes up;
// his question sends a flurry of little law-slips into the air. "Hear, O Israel": one golden star.
// Heart, soul, mind and strength hang in a row and fill with light one by one; then two neighbours
// face each other and a bridge of light joins their hearts. Two plates remain: God and neighbour.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, sadducee, scribe, man, woman, voiceRings, bubble, wordSlip, disc, loveIcon, strip, glowHeart, lightArc, sparkle, sheet } from './lib.js';

const JX = 700, SCX = 960;

export default {
  id: 'm12-first',
  beats: [
    { v: 28, text: 'Zbliżył się także jeden z uczonych w Piśmie, który im się przysłuchiwał, gdy rozprawiali ze sobą.' },
    { v: 28, cont: true, text: 'Widząc, że Jezus dobrze im odpowiedział, zapytał Go: «Które jest pierwsze ze wszystkich przykazań?»' },
    { v: 29 },
    { v: 30 },
    { v: 31, text: 'Drugie jest to: Będziesz miłował swego bliźniego jak siebie samego.' },
    { v: 31, cont: true, text: 'Nie ma innego przykazania większego od tych».' },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 4, x0: 380, x1: 600, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 1080, x1: 1240, pose: 'sit' }]);

    /* the air above: law slips, the one star, the four "all"s, the two plates */
    const air = S.layer({ par: 0.3, sh: 5 });
    const slips = Array.from({ length: 16 }, (_, i) => ({ el: air.add(wordSlip(c, c.rr(26, 36))), i, x: lerp(460, 1140, (i + 0.5) / 16) + c.rr(-20, 20), y: c.rr(150, 330), ph: c.rr(0, 6) }));
    let star = '';
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; star += c.poly([[Math.cos(a - 0.09) * 20, Math.sin(a - 0.09) * 20], [Math.cos(a) * (i % 2 ? 44 : 60), Math.sin(a) * (i % 2 ? 44 : 60)], [Math.cos(a + 0.09) * 20, Math.sin(a + 0.09) * 20]]); }
    const one = hanging(air, `<circle r="130" fill="url(#halo-glow)"/>${disc(c, 64, { fill: mix(C.skyBlue, C.cream, 0.5), rim: C.sun })}<path d="${star}" fill="${C.sun}"/><path d="${c.cut(c.circ(0, 0, 16, 16), 0.3, 3)}" fill="${C.star}"/><g transform="translate(0 86)">${strip(c, tr('Pan jest jeden', 'the Lord is one'), { size: 17 })}</g>`, { x: 800, y: -300, len: 500 });
    const KINDS = ['heart', 'soul', 'mind', 'strength'];
    const NAMES = [tr('sercem', 'heart'), tr('duszą', 'soul'), tr('umysłem', 'mind'), tr('mocą', 'strength')];
    const four = KINDS.map((k, i) => {
      const el = hanging(air, `<g data-part="glow" opacity="0"><circle r="80" fill="url(#warm-glow)"/></g>${disc(c, 40, { fill: C.cream, rim: C.ochre })}<g data-part="dim"><g opacity=".35">${loveIcon(c, k, mix(C.jesusMantle, C.stone2, 0.7))}</g></g><g data-part="lit" opacity="0">${loveIcon(c, k)}</g><g transform="translate(0 60)">${strip(c, NAMES[i], { size: 15 })}</g>`, { x: 0, y: -300, len: 500 });
      return { el, i, x: 566 + i * 156, glow: el.querySelector('[data-part="glow"]'), lit: el.querySelector('[data-part="lit"]'), dim: el.querySelector('[data-part="dim"]') };
    });
    const plateGod = hanging(air, `<circle r="110" fill="url(#halo-glow)"/>${disc(c, 52, { fill: C.cream, rim: C.sun })}${loveIcon(c, 'heart')}<path d="${c.poly([[-10, -34], [0, -52], [10, -34]])}" fill="${C.sun}"/><g transform="translate(0 72)">${strip(c, tr('Bóg', 'God'), { size: 17 })}</g>`, { x: 600, y: -300, len: 500 });
    const twoFig = `<g transform="translate(-16 30) scale(.34)">${person(c, man(c))}</g><g transform="translate(16 30) scale(.34) scale(-1 1)">${person(c, woman(c))}</g>`;
    const plateNb = hanging(air, `<circle r="110" fill="url(#halo-glow)"/>${disc(c, 52, { fill: C.cream, rim: C.sun })}${twoFig}<g transform="translate(0 72)">${strip(c, tr('bliźni', 'neighbour'), { size: 17 })}</g>`, { x: 1000, y: -300, len: 500 });

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 330 - i * 60, i }));
    const sad = [0, 1, 2].map((i) => ({ i, p: S.puppet(pl.add(person(c, sadducee(i)))), seed: c.rr(0, 9) }));
    const nb = [man(c, { robe: C.sageRobe }), woman(c, { robe: C.roseRobe })].map((o, i) => ({ i, p: S.puppet(pl.add(person(c, o))), seed: c.rr(0, 9) }));
    const hearts = [0, 1].map(() => pl.add(`<g>${glowHeart(c, 11)}</g>`));
    const bridge = pl.add(`<g>${lightArc(c, 120, 36)}</g>`);
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const sc = S.puppet(pl.add(person(c, scribe(c, 0))));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const ask = pl.add(`<g>${bubble(c, tr(['Które przykazanie', 'jest pierwsze?'], ['Which commandment', 'is first of all?']), { size: 18, tail: -1 })}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v28 — the Sadducees go; the scribe who was listening comes up and asks */
      sad.forEach((m) => {
        const k = es(t, 0.0 + m.i * 0.05, 0.5 + m.i * 0.05, ease.in);
        const x = lerp(900 + m.i * 72, 1500 + m.i * 60, k);
        m.p.set({ x, y: F + 4 + (m.i % 2) * 8, s: 0.93, walk: k > 0 && k < 1 ? x * 0.05 : undefined, head: 6, blink: blinkAt(T, m.seed), o: k < 1 ? 1 : 0 });
      });
      const come = es(t, 0.35, 0.9);
      const scx = lerp(1170, SCX, come);
      const nod = bump(t, 0.15, 0.4);
      sc.set({ x: scx, y: F + 6, s: 0.95, flip: true, walk: come > 0 && come < 1 ? scx * 0.05 : undefined, blink: blinkAt(T, 3), head: nod * 14 - bump(t, 2.0, 5.0) * 10, armF: 26 + bump(t, 1.1, 1.9) * 40, armB: bump(t, 1.1, 1.9) * 60 });
      const ak = es(t, 1.1, 1.25, ease.back) * (1 - es(t, 1.85, 1.95));
      pose(ask, { x: SCX - 20, y: F - 208, s: ak, o: ak > 0.02 ? 1 : 0 });
      // a flurry of commandments
      const fly = es(t, 1.2, 1.5) * (1 - es(t, 2.05, 2.3));
      slips.forEach((s) => {
        const low = es(t, 5.1, 5.5);
        const y = lerp(s.y, 560 - (s.i % 3) * 8, low) + Math.sin(T * 1.4 + s.ph) * 6 * fly;
        pose(s.el, { x: lerp(SCX - 30, s.x, Math.max(fly, low)), y: lerp(F - 180, y, Math.max(fly, low)), r: Math.sin(T * 1.1 + s.ph) * 20 * fly + (low ? (s.i % 2 ? 8 : -8) : 0), s: 0.8 - low * 0.35, o: Math.max(fly, low * 0.55) });
      });

      /* v29 — "Hear, O Israel" */
      const ok = es(t, 2.1, 2.5, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      pose(one, { x: 800, y: lerp(-800, 250, ok), r: Math.sin(T * 0.8) * 1.5 });
      /* v30 — heart, soul, mind, strength fill with light */
      four.forEach((f) => {
        const d = es(t, 3.02 + f.i * 0.06, 3.3 + f.i * 0.06, ease.out) * (1 - es(t, 4.0, 4.25, ease.in));
        pose(f.el, { x: f.x, y: lerp(-800, 240 + (f.i % 2) * 20, d), r: Math.sin(T * 0.8 + f.i) * 1.5 });
        const lit = es(t, 3.35 + f.i * 0.14, 3.5 + f.i * 0.14);
        fade(f.lit, lit); fade(f.dim, 1 - lit); fade(f.glow, lit);
      });

      /* v31 — two neighbours; a bridge of light between their hearts */
      const nk = es(t, 4.05, 4.4);
      nb.forEach((n) => {
        const x = n.i ? lerp(360, 560, nk) : lerp(250, 450, nk);
        n.p.set({ x, y: F + 14, s: 0.9, flip: n.i === 1, walk: nk > 0 && nk < 1 ? x * 0.05 : undefined, armF: es(t, 4.4, 4.6) * 50, blink: blinkAt(T, n.seed), o: nk > 0 ? 1 : 0 });
        const hk = es(t, 4.45 + n.i * 0.05, 4.6 + n.i * 0.05, ease.back);
        pose(hearts[n.i], { x: x + (n.i ? -6 : 6), y: F + 14 - 120, s: hk * (1 + Math.sin(T * 3 + n.i) * 0.05), o: hk > 0.02 ? 1 : 0 });
      });
      const bk = es(t, 4.6, 4.85);
      pose(bridge, { x: 456, y: F + 14 - 124, sx: Math.max(0.01, bk * (98 / 120)), o: bk > 0.01 ? 1 : 0 });
      const pg = es(t, 5.05, 5.4, ease.out), pn = es(t, 5.15, 5.5, ease.out);
      pose(plateGod, { x: 600, y: lerp(-800, 230, pg), r: Math.sin(T * 0.8) * 1.5 });
      pose(plateNb, { x: 1000, y: lerp(-800, 230, pn), r: Math.sin(T * 0.7 + 1) * 1.5 });

      /* Jesus answers */
      const speak = es(t, 2.02, 2.2);
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), head: -bump(t, 2.0, 6.0) * 8, armF: 30 + speak * 40 + bump(t, 2.1, 2.9) * 60 + bump(t, 4.1, 4.9) * 20, armB: 16 + bump(t, 3.1, 3.9) * 110 + bump(t, 5.1, 5.9) * 100 });
      voice(JX + 26, F - 176, speak, T, { dir: 1 });
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + d.i * 8, s: 0.9, head: -bump(t, 2.0, 6.0) * 12, blink: blinkAt(T, d.i + 3) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -bump(t, 2.0, 6.0) * 14 - 3, armF: bump(t, 2.1, 2.9) * (m.i % 2 ? 40 : 0), blink: blinkAt(T, m.seed) }));

      S.cam.z = 1 + es(t, 2.0, 2.5) * 0.03;
      S.cam.y = -es(t, 2.0, 2.5) * 20;
    };
  },
};
