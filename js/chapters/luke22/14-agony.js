// Łk 22,43–46 — an angel from heaven appears beside Him (as Mark and John cut the angels: linen, pale gold, wings) and
// strengthens Him, a hand on His shoulder. In His anguish He prays more earnestly, bent low, and His sweat falls like
// great drops of blood to the ground — only dark drops edged with light, no more. He rises and comes back to the
// disciples and finds them asleep for sorrow, lanterns burnt low. "Why are you sleeping?" "Rise and pray, that you
// may not enter into temptation": they stir — and far off, on the path down from the city, torches are moving.
import { es, ease, bump, seg } from '../../core/anim.js';
import { rock, cloud } from '../../assets/nature.js';
import {
  nightSet, gardenTrees, TW, CAST, ANGEL, angel, kf, moving, hand, headAt, withFace, faceBits, agonyDrop, zzz, speech, GLYPH, torchLine, person,
  sheet, hanging, vis, pose, fade, lerp, mix, nt, blinkAt, tr, C, PI, AGONY,
} from './lib.js';

const GY = 700, KX = 900;
const SLEEP = [
  { k: 'peter', x: 600, y: 10 }, { k: 'john', x: 540, y: -14, s: 0.84 }, { k: 'james', x: 480, y: 12 }, { k: 'andrew', x: 420, y: -16, s: 0.84 },
  { k: 'thomas', x: 360, y: 10 }, { k: 'matthew', x: 300, y: -16, s: 0.84 }, { k: 'philip', x: 240, y: 10 },
];

export default {
  id: 'lk22-agony',
  beats: [
    { v: 43 },
    { v: 44 },
    { v: 45 },
    { v: 46, text: 'Rzekł do nich: «Czemu śpicie?' },
    { v: 46, cont: true, text: 'Wstańcie i módlcie się, abyście nie ulegli pokusie».' },
  ],
  cam: { x: [-260, 170], y: [-40, 180], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { moonAt: [1240, 140], cityX: 250, zigzag: true });
    const tl = torchLine(S, N.torchL, N.zz, 12, 0.04);
    // a cloud drifts over the moon in the agony
    const clL = S.layer({ par: 0.05, sh: 3 });
    const cl = clL.add(`<g>${cloud(c, 260, nt(C.stone2, 0.5), nt(C.stone2, 0.6))}</g>`);
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    treesL.add(rock(c, KX + 70, GY + 24, 190, 76, nt(C.rock2, 0.3)));
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const aGlow = glowL.add(`<g><circle r="150" fill="url(#halo-glow)" opacity=".55"/></g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    // the disciples asleep (sitting, eyes shut) and awake (sitting, eyes open)
    const D = SLEEP.map((d, i) => {
      const a = P.add(withFace(person(c, { ...TW[d.k], pose: 'sit', eyes: 'closed' }), faceBits(c)));
      const b = P.add(withFace(person(c, { ...TW[d.k], pose: 'sit' }), faceBits(c)));
      return { ...d, i, x: S.portrait ? 600 - (600 - d.x) * 0.7 : d.x, s: d.s ?? 0.92, y: GY + d.y, pa: S.puppet(a), pb: S.puppet(b), sadA: a.querySelector('[data-part="sad"]'), sadB: b.querySelector('[data-part="sad"]'), seed: c.rr(0, 9) };
    });
    const angelEl = P.add(angel(c, { ...ANGEL }));
    const ang = S.puppet(angelEl);
    const kEl = P.add(withFace(person(c, { ...CAST.jesus, pose: 'kneel' }), faceBits(c)));
    const kneel = S.puppet(kEl);
    const kSad = kEl.querySelector('[data-part="sad"]');
    const sEl = P.add(withFace(person(c, CAST.jesus), faceBits(c)));
    const stand = S.puppet(sEl);
    const sSad = sEl.querySelector('[data-part="sad"]');
    const fx = S.layer({ par: 0.52, sh: 3 });
    const drops = Array.from({ length: 7 }, (_, i) => ({ i, dx: c.rr(-6, 10), el: fx.add(`<g>${agonyDrop(c, 5)}</g>`) }));
    const zs = D.filter((d) => d.i % 2 === 0).map((d) => ({ d, el: fx.add(`<g>${zzz(c, C.cream)}</g>`) }));
    const why = fx.add(`<g>${speech(c, `<g transform="translate(-14 2)">${zzz(c, C.stone2).replace(/fill="[^"]+"/g, `fill="${C.dustyBlue}"`)}</g><g transform="translate(20 0)">${GLYPH.q(c)}</g>`, { w: 84, h: 56, flip: true })}</g>`);
    const hands = sheet().p(c.cut([[-4, 16], [-12, -2], [-10, -20], [-4, -26], [0, -18], [4, -26], [10, -20], [12, -2], [4, 16]], 0.3, 3), C.skin).out();
    const prayB = fx.add(`<g>${speech(c, `<g transform="translate(0 4)">${hands}</g>`, { w: 58, h: 52, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      N.update(T);
      pose(cl, { x: lerp(900, 1180, es(t, 0.6, 1.8)), y: 170, o: es(t, 0.6, 1.2) * (1 - es(t, 2.2, 2.8) * 0.7) });

      /* v43 — the angel strengthens Him */
      const aIn = es(t, 0.05, 0.45, ease.out);
      const aOut = es(t, 1.9, 2.2);
      const touch = es(t, 0.4, 0.65);
      ang.set({ x: KX + (S.portrait ? 92 : 110), y: GY + 4 - (1 - aIn) * 60, s: 1.06, flip: true, o: aIn * (1 - aOut), armF: 30 + touch * 30, armB: 20 + touch * 10, head: 10, blink: blinkAt(T, 4) });
      vis(aGlow, { x: KX + (S.portrait ? 102 : 120), y: GY - 210, s: 1, o: aIn * (1 - aOut) * 0.9 });

      /* v44 — agony; the drops */
      const agony = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      const rise = es(t, 2.05, 2.12);
      kneel.set({ x: KX, y: GY + 6, s: 1.1, flip: false, o: 1 - rise, armF: 50 + agony * 60, armB: 40 + agony * 90, head: 14 + touch * -10 * (1 - agony) + agony * 12, lean: 8 + agony * 20, blink: blinkAt(T, 2) });
      fade(kSad, 0.7 + agony * 0.3);
      const [fx0, fy0] = headAt(KX, GY + 6, 1.1, false, 46);
      drops.forEach((d) => {
        const k = T ? ((T * 0.35 + d.i / drops.length) % 1) : seg(t, 1.1 + d.i * 0.1, 1.6 + d.i * 0.1);
        const on = es(t, 1.15, 1.35) * (1 - es(t, 1.95, 2.05));
        vis(d.el, { x: fx0 + 58 + d.dx + k * 14, y: lerp(fy0 + 10, GY + 4, k), s: 0.8 - k * 0.2, o: on * (k < 0.92 ? 1 : 0) });
      });

      /* v45 — back to the disciples: asleep for sorrow */
      const sK = [[2.05, KX], [2.7, 690]];
      const sx = kf(t, sK, ease.sine);
      const speak = es(t, 3.05, 3.3);
      stand.set({ x: sx, y: GY + 4, s: 1.04, flip: t > 2.1, o: rise, walk: moving(t, sK, 1) ? sx * 0.05 : undefined, armF: 20 + speak * 40 + es(t, 4.05, 4.3) * 30, armB: 10 + es(t, 4.05, 4.3) * 100, head: 8 - speak * 6, blink: blinkAt(T) });
      fade(sSad, 0.8);
      const wake = es(t, 3.2, 3.5);
      const up = es(t, 4.1, 4.4);
      D.forEach((d) => {
        const flip = false;
        const head = 30 + (T ? Math.sin(T * 1.2 + d.seed) * 2 : 0);
        d.pa.set({ x: d.x, y: d.y, s: d.s, flip, o: 1 - wake, armF: 60, armB: 40, head, lean: 16, blink: 0 });
        d.pb.set({ x: d.x, y: d.y - up * 6, s: d.s, flip, o: wake, armF: 40 + up * 30, armB: 20 + up * 20, head: 12 - up * 16 - d.i * 0, lean: 8 - up * 8, blink: blinkAt(T, d.seed) });
        fade(d.sadA, 1);
        fade(d.sadB, 0.8);
      });
      zs.forEach((z) => {
        const [hx, hy] = headAt(z.d.x, z.d.y, z.d.s, false, 62);
        const k = es(t, 2.4, 2.6) * (1 - wake);
        vis(z.el, { x: hx + 18, y: hy - 26 - (T ? ((T * 6 + z.d.i * 3) % 8) : 0), s: 0.9, o: k });
      });
      const [bx, by] = headAt(690, GY + 4, 1.04, true);
      const wb = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(why, { x: bx - 14, y: by - 26, s: wb, o: wb > 0.01 ? 1 : 0 });
      const pb = es(t, 4.1, 4.3, ease.back);
      vis(prayB, { x: bx - 14, y: by - 26, s: pb, o: pb > 0.01 ? 1 : 0 });
      tl(seg(t, 4.2, 5.4), es(t, 4.2, 4.4), T);

      S.cam.x = S.portrait   // phone: the angel's wing clear of the thread; the sleepers He comes back to in view
        ? kf(t, [[-0.4, 135], [1.9, 145], [2.7, -150], [4.0, -150], [4.4, -250]])
        : kf(t, [[-0.4, 120], [1.9, 130], [2.7, -80], [4.0, -80], [4.4, -140]]);
      S.cam.z = kf(t, [[-0.4, 1.2], [0.6, 1.3], [1.2, 1.44], [1.9, 1.44], [2.7, 1.2], [4.0, 1.24], [4.5, 1.08]]);
      S.cam.y = kf(t, [[-0.4, 60], [0.6, 80], [1.2, 120], [1.9, 120], [2.7, 80], [4.5, 20]]);
    };
  },
};
