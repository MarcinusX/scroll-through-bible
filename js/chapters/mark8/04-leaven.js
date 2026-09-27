// Mk 8,14–16 — in the boat: they forgot the bread, only one loaf. "Beware of the leaven of the
// Pharisees and the leaven of Herod" — two kneading bowls hang down and their dough swells over the rim;
// the disciples huddle and argue about bread.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, town, sun, cloud, reeds } from '../../assets/nature.js';
import { boat, bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { loaf, speech, GLYPH, spark, basket, doughBowl, crown, phylactery, bubbleDot, tag, hand, crewBoat, PI } from './lib.js';

export default {
  id: 'm8-leaven',
  beats: [
    { v: 14 },
    { v: 15 },
    { v: 16 },
  ],
  cam: { x: [-30, 30], y: [-50, 100], z: [0.98, 1.26] },
  build(S) {
    const c = S.c;
    const SKY = ['#c6dcdc', '#ece6d0', '#f5e7cf'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1230, y: 170, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 210), { x: 420, y: 150, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1130, y: 290, len: 700 });

    /* ---------- two kneading bowls: the leaven of the Pharisees and of Herod ---------- */
    const plL = S.layer({ par: 0.08, sh: 7 });
    const plate = (icon, word) => {
      const s = sheet().p(c.cut(c.circ(0, 0, 104, 44), 0.6, 6), C.ochre).p(c.cut(c.circ(0, 0, 96, 44), 0.6, 6), C.cream).out();
      const bub = Array.from({ length: 5 }, (_, i) => `<g class="bub" data-i="${i}">${bubbleDot(c, 4 + (i % 3) * 2)}</g>`).join('');
      return `${s}<g transform="translate(0 44)">${doughBowl(c, { w: 120 })}</g>${bub}<g transform="translate(58 -56)">${icon}</g><g transform="translate(0 104)">${tag(c, word, { size: 17 })}</g>`;
    };
    const plates = [
      { x: S.portrait ? 610 : 520, el: hanging(plL, plate(`<g transform="scale(1.3)">${phylactery(c)}</g>`, tr('faryzeusze', 'Pharisees')), { x: S.portrait ? 610 : 520, y: 290, len: 900 }) },
      { x: S.portrait ? 990 : 1080, el: hanging(plL, plate(crown(c, 40), tr('Herod', 'Herod')), { x: S.portrait ? 990 : 1080, y: 290, len: 900 }) },
    ];
    plates.forEach((p, i) => { p.dough = p.el.querySelector('.dough'); p.bubs = Array.from(p.el.querySelectorAll('.bub')); p.i = i; });

    /* ---------- the lake ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [14, 6, 3], lens: [1100, 380, 140], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.14, sh: 2 });
    const h2 = hillsWith(c, { y: 496, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 18 });
    hills.add(h2.markup + town(c, { x: 1350, y: h2.fn(1350) + 8, n: 5, spread: 220, sc: 0.5 }));
    S.layer({ par: 0.2, sh: 2 }).add(waterBand(c, { y: 520, color: C.lake, foamN: 30 }).markup);
    const w0 = S.layer({ par: 0.3, sh: 3, pad: 160 });
    w0.add(waveStrip(c, { y: 600, len: 150, amp: 8, color: C.lake2 }));

    /* ---------- the boat ---------- */
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const one = `<g class="one" opacity="0" transform="translate(0 2)">${loaf(c, 22)}</g>`;
    const { g: boatG, crew, jesus } = crewBoat(S, boatL, { holdAndrew: one });
    const oneLoaf = boatG.querySelector('.one');
    const emptyB = boatL.add(`<g>${basket(c, { w: 50, h: 34 })}</g>`);
    const bubL = S.layer({ par: 0.5, sh: 4 });
    const glow = bubL.add(`<g>${spark(c, 20)}</g>`);
    const loafUp = bubL.add(`<g>${loaf(c, 24)}</g>`);
    const bubs = [
      { k: 'john', el: bubL.add(`<g>${speech(c, `<g transform="translate(-8 8)">${loaf(c, 12)}</g><path d="M-26 -6L14 22" stroke="${C.terracotta}" stroke-width="4"/>`, { w: 60, h: 46, flip: true })}</g>`) },
      { k: 'peter', el: bubL.add(`<g>${speech(c, GLYPH.q(c), { w: 42, h: 42 })}</g>`) },
      { k: 'james', el: bubL.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40 })}</g>`) },
      { k: 'thomas', el: bubL.add(`<g>${speech(c, GLYPH.q(c), { w: 40, h: 40, flip: true })}</g>`) },
    ];
    const w1 = S.layer({ par: 0.72, sh: 4, pad: 180 });
    w1.add(waveStrip(c, { y: 760, len: 170, amp: 12, color: C.lake2 }));
    const w2 = S.layer({ par: 0.85, sh: 4, pad: 200 });
    w2.add(waveStrip(c, { y: 850, len: 200, amp: 14, color: C.lake3 }));

    const BXc = 800, BYc = 700, BS = 1.36;
    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#cdd6d4', '#efe0c6', '#f3dcc0'], es(t, 0, 3));
      swing(sunEl, 1230, 170 + es(t, 0, 3) * 40, T, 1.1, 0.7);
      swing(cl1, 420 + Math.sin(T * 0.1) * 26, 150, T, 1.4, 0.6, 1);
      swing(cl2, 1130 + Math.sin(T * 0.13 + 2) * 26, 290, T, 1.4, 0.8, 2);
      w0.shift(((T * 14) % 150) - 75); w1.shift(((T * 20) % 170) - 85); w2.shift(100 - ((T * 16) % 200));

      const bob = Math.sin(T * 1.3) * 3, rock_ = Math.sin(T * 1.05) * 1.1;
      pose(boatG, { x: BXc, y: BYc + bob, s: BS, r: rock_ });

      /* v15 — the bowls hang down; the dough swells over the rim */
      const pl = es(t, 1.02, 1.35, ease.back) * (1 - es(t, 2.1, 2.45));
      plates.forEach((p) => {
        swing(p.el, p.x, 290 - (1 - pl) * 700, T, 1.2, 0.8, p.i * 2);
        const rise = es(t, 1.2 + p.i * 0.1, 1.9 + p.i * 0.05);
        pose(p.dough, { x: 0, y: -31, sx: 1 + rise * 0.28 + Math.sin(T * 2.4 + p.i) * 0.015 * rise, sy: 1 + rise * 1.3 + Math.sin(T * 2 + p.i) * 0.05 * rise });
        p.bubs.forEach((b, j) => {
          const k = ((T * 0.5 + j / 5) % 1);
          pose(b, { x: -34 + j * 17, y: 10 - rise * 70 - k * 30, s: 0.5 + k * 0.7, o: rise * Math.sin(k * PI) });
        });
      });

      /* Jesus: quiet at the helm → warning finger raised (v15) → watching them (v16) */
      const warn = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      jesus.set({ x: 0, y: -2, s: 0.9, flip: warn > 0.5 ? false : t > 2.2, armF: 16 + warn * 60, armB: 8 + warn * 150, head: -warn * 6 + es(t, 2.2, 2.5) * 6, blink: blinkAt(T) });

      /* v14 — Andrew searches the basket: empty; only one loaf */
      const search = bump(t, 0.05, 0.6);
      const found = es(t, 0.55, 0.7);
      const pass = es(t, 2.1, 2.9);
      crew.forEach((d) => {
        let armF = 20, armB = 10, head = 0, flip = d.x > 0, lean = 0;
        if (d.k === 'andrew') { armF = 20 + search * 30; armB = 10 + found * 160 * (1 - pass * 0.8); head = search * 20 - found * 16; lean = search * 12; flip = false; }
        const huddle = es(t, 2.05, 2.3);
        const argue = huddle * (Math.sin(T * 4 + d.seed) * 0.5 + 0.5);
        if (d.k !== 'andrew') { armF += argue * 60 + bump(t, 0.6, 0.95) * 20; armB += argue * 30; head = -huddle * 8 + bump(t, 0.6, 1.0) * -8; lean = huddle * (d.x < 0 ? 5 : -5); }
        const look = d.x > 0 ? true : false;
        d.p.set({ x: d.x + huddle * (d.x < 0 ? 6 : -6), y: 2, s: 0.8, flip: d.k === 'andrew' ? flip : look, armF, armB, head, lean, blink: blinkAt(T, d.seed) });
      });
      fade(oneLoaf, 0);
      // the empty basket, tipped over the side
      const tip = es(t, 0.1, 0.4);
      pose(emptyB, { x: BXc - 150 * BS, y: BYc - 58 + bob, r: -tip * 120, s: 0.9, o: 1 - es(t, 2.6, 2.9) });
      const aB = ((10 + found * 160 * (1 - pass * 0.8)) * PI) / 180, ks = 0.8 * BS;
      const hx = BXc + (-54 + (-9 + 57 * Math.sin(aB)) * 0.8) * BS, hy = BYc + (2 + (-138 + 57 * Math.cos(aB)) * 0.8) * BS;
      pose(loafUp, { x: hx + 6, y: hy + bob - 16, o: found, s: 1 });
      pose(glow, { x: hx + 6, y: hy + bob - 26, s: found * (1 - es(t, 1.0, 1.2)) * (1 + Math.sin(T * 5) * 0.1), o: found > 0.02 && t < 1.2 ? 1 : 0 });

      /* v16 — arguing about bread */
      bubs.forEach((b, i) => {
        const d = crew.find((x) => x.k === b.k);
        const k = es(t, 2.15 + i * 0.1, 2.3 + i * 0.1, ease.back);
        pose(b.el, { x: BXc + d.x * BS + (d.x < 0 ? 18 : -18), y: BYc - 236 - (i % 2) * 24 + bob, s: k, r: Math.sin(T * 2 + i) * 4, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.06 + es(t, 0, 0.6) * 0.18 - es(t, 0.95, 1.3) * 0.24 + es(t, 2.0, 2.4) * 0.14;
      S.cam.y = 30 + es(t, 0, 0.6) * 60 - es(t, 0.95, 1.3) * 130 + es(t, 2.0, 2.4) * 100;
    };
  },
};
