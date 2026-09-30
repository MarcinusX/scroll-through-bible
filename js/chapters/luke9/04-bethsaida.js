// Łk 9,10–11 — by the lake. The apostles come back from the villages, from both sides, and tell Him everything they
// have done: their bubbles are full of it (a crutch thrown away, a spirit crossed out, a heart, a light). He takes them
// with Him and goes apart: they walk along the shore, the hills sliding past, until the little town of Bethsaida comes
// into view on the slope and its name hangs over it. But the crowds find out and follow — they come streaming over the
// meadow from the left. He welcomes them with open arms, speaks to them of the Kingdom of God (a crown of light comes
// down, and His words fly out to them), and heals those who need it: a woman rises from her mat, a lame man throws his
// crutch into the air.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { bethSet, BETH, bethCrowd, TW9, speech, spirit, crossX, crutch, heart, sparkle, mat, lyingPerson, labelTag, lightCrown, wordSlip, halo, folk, kf, hand, headAt, tr, PI } from './lib.js';

const JX = 790;
const SHIFT = 320;             // how far the scenery slides while they walk (v10b)

export default {
  id: 'lk9-bethsaida',
  beats: [
    { v: 10, text: 'Gdy Apostołowie wrócili, opowiedzieli Mu wszystko, co zdziałali.' },
    { v: 10, cont: true, text: 'Wtedy wziął ich z sobą i udał się osobno w okolicę miasta, zwanego Betsaidą.' },
    { v: 11, text: 'Lecz tłumy dowiedziały się o tym i poszły za Nim.' },
    { v: 11, cont: true, text: 'On je przyjął i mówił im o królestwie Bożym, a tych, którzy leczenia potrzebowali, uzdrawiał.' },
  ],
  cam: { x: [-40, 40], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const B = bethSet(S, { pads: [SHIFT * 0.35 + 20, SHIFT * 0.6 + 20, SHIFT + 20], townAt: BETH.TX + SHIFT * 0.35 });
    const c = S.c;
    const gy = (x) => B.gfn(x) + 18;
    const nameTag = hanging(B.mid, `<g transform="scale(1.2)">${labelTag(tr('Betsaida', 'Bethsaida'), 20)}</g>`, { x: 0, y: -1500, len: 900 });

    /* the crowds that follow: still groups streaming in from the left */
    const CR = bethCrowd(B);

    /* the sick who are healed */
    const act = S.layer({ par: 0.5, sh: 5 });
    const matEl = act.add(`<g>${mat(c, 150)}</g>`);
    const lying = act.add(`<g>${lyingPerson(c, folk(c, false, { robe: C.roseRobe }), 0.7)}</g>`);
    const risen = S.puppet(act.add(person(c, folk(c, false, { robe: C.roseRobe }))));
    const lame = S.puppet(act.add(person(c, { ...folk(c, true, { robe: C.ochreRobe }), holdF: `<g transform="translate(0 -6)">${crutch(c)}</g>` })));
    const lameFree = S.puppet(act.add(person(c, folk(c, true, { robe: C.ochreRobe }))));
    const flying = act.add(`<g>${crutch(c)}</g>`);

    /* the apostles and Jesus */
    const AP = [
      { k: 'andrew', a: 540, b: 1150 }, { k: 'peter', a: 630, b: 900 }, { k: 'philip', a: 460, b: 1085 },
      { k: 'james', a: 960, b: 965 }, { k: 'john', a: 1040, b: 1030 }, { k: 'matthew', a: 1130, b: 1215 },
    ].map((d, i) => ({ ...d, i, from: d.a < JX ? -300 - i * 40 : 1900 + i * 40, dy: (i % 2) * 10, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const glowL = S.layer({ par: 0.5, sh: 1, flat: true });
    const aura = glowL.add(`<g opacity="0">${halo(160, 0.9)}</g>`);
    const J = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(J.add(person(c, { ...CAST.jesus })));

    /* bubbles, the Kingdom, words, sparks */
    const fx = S.layer({ par: 0.55, sh: 4 });
    const ICONS = [
      `<g transform="translate(0 -12) rotate(25) scale(.26)">${crutch(c)}</g>`,
      `<g transform="scale(.8)">${spirit(c, 1, '#43384d')}</g><g transform="scale(.6)">${crossX(c, 22)}</g>`,
      `${heart(c, 11)}`,
      `${sparkle(c, 12)}`,
    ];
    const BUB = [1, 3, 0, 4].map((ai, i) => ({ ai, i, el: fx.add(`<g opacity="0">${speech(c, ICONS[i], { w: 56, h: 46, flip: AP[ai].a > JX })}</g>`) }));
    const kingdom = hanging(fx, `<g>${lightCrown(c, 44)}</g><g transform="translate(0 78)">${labelTag(tr('królestwo Boże', 'God’s Kingdom'), 18)}</g>`, { x: 0, y: -1500, len: 900 });
    const words = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${wordSlip(c, 22)}</g>`) }));
    const sparks = [0, 1].map(() => fx.add(`<g opacity="0">${sparkle(c, 14)}</g>`));

    return (t, time) => {
      const T = time;
      B.update(T);
      /* v10b — the scenery slides by as they walk */
      const wk = es(t, 1.05, 1.85, (u) => u);
      const walking = t > 1.05 && t < 1.85;
      const phase = t * 16;
      B.mid.shift(-SHIFT * 0.35 * wk, 0);
      B.slopeL.shift(-SHIFT * 0.6 * wk, 0);
      B.G.shift(-SHIFT * wk, 0);
      const tn = es(t, 1.6, 1.85, ease.back) * (1 - es(t, 2.4, 2.7));
      pose(nameTag, { x: BETH.TX + SHIFT * 0.35 - 70, y: lerp(-1500, 250, tn), r: Math.sin(T * 0.9) * 2, oy: 0, o: tn > 0.002 ? 1 : 0 });

      /* Jesus */
      const welcome = es(t, 3.02, 3.25);
      const speak = bump(t, 3.2, 3.9);
      const faceL = t > 2.3;
      jesus.set({ x: JX, y: gy(JX), s: 1.02, flip: faceL, walk: walking ? phase : undefined, armF: 20 + bump(t, 0.3, 0.95) * 30 + welcome * 60 + speak * 20, armB: 10 + welcome * 100, head: -2, blink: blinkAt(T, 1) });
      pose(aura, { x: JX, y: gy(JX) - 140, o: 0.4 + welcome * 0.5 });

      /* the apostles: back from the villages (v10a), then with Him (v10b), then aside */
      AP.forEach((d) => {
        const inK = es(t, 0.0 + d.i * 0.03, 0.35 + d.i * 0.03, ease.out);
        let x = lerp(d.from, d.a, inK);
        const across = es(t, 1.1, 1.8);
        if (t > 1.05) x = lerp(d.a, d.b, across);
        const w = (inK > 0 && inK < 1) || walking;
        const tell = BUB.find((b) => b.ai === d.i);
        const talk = tell ? bump(t, 0.35 + tell.i * 0.08, 0.95) : 0;
        d.p.set({ x, y: gy(x) + d.dy, s: 0.94, flip: t < 1.05 ? d.a > JX : t > 2.3, walk: w ? (walking ? phase + d.i : x * 0.07) : undefined, armF: 20 + talk * 70, armB: talk * 30, head: -talk * 4, blink: blinkAt(T, d.seed) });
        d.x_ = x;
      });
      BUB.forEach((b) => {
        const d = AP[b.ai];
        const k = es(t, 0.38 + b.i * 0.08, 0.5 + b.i * 0.08, ease.back) * (1 - es(t, 0.95, 1.05));
        const [hx, hy] = headAt(d.x_, gy(d.x_) + d.dy, 0.94, d.a > JX);
        pose(b.el, { x: hx + (d.a > JX ? -14 : 14), y: hy - 26, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v11a — the crowds follow */
      CR.forEach((m) => {
        const k = es(t, 2.02 + (m.i % 5) * 0.06 + m.row * 0.05, 2.62 + (m.i % 5) * 0.06 + m.row * 0.05, ease.out);
        const x = lerp(m.x > 1000 ? m.x + 700 : m.x - 900 - m.row * 100, m.x, k);
        m.sp.set({ x, y: m.y - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 30)) * 4 : 0), s: 1, o: t > 1.95 ? 1 : 0 });
      });

      /* v11b — He welcomes them, speaks of the Kingdom, heals */
      const kk = es(t, 3.1, 3.35, ease.back);
      pose(kingdom, { x: 640, y: lerp(-1500, 236, kk), r: Math.sin(T * 0.8) * 2, oy: 0, o: kk > 0.002 ? 1 : 0 });
      words.forEach((w) => {
        const q = T ? (T * 0.45 + w.i / 6) % 1 : (w.i + 0.5) / 6;
        pose(w.el, { x: lerp(JX - 40, 260 + w.i * 60, q), y: lerp(gy(JX) - 170, 520 + (w.i % 3) * 20, q) - Math.sin(q * PI) * 40, s: 0.7, r: Math.sin(T * 2 + w.i) * 10, o: speak * Math.sin(q * PI) });
      });
      // the woman on her mat, the lame man, at the front on the left
      const sick = es(t, 2.4, 2.7);
      const rise = es(t, 3.4, 3.46);
      pose(matEl, { x: 560, y: gy(560) + 4, o: sick });
      pose(lying, { x: 560 - 60, y: gy(560) - 6, o: sick * (1 - rise) });
      risen.set({ x: 560, y: gy(560) + 6, s: 0.86, flip: false, armF: 60 + es(t, 3.46, 3.7) * 60, armB: 30 + es(t, 3.46, 3.7) * 110, head: -8, o: rise, blink: blinkAt(T, 4) });
      const LX = kf(t, [[2.3, 180], [2.8, 440]]);
      const free = es(t, 3.55, 3.6);
      lame.set({ x: LX, y: gy(LX) + 12, s: 0.9, walk: t > 2.3 && t < 2.8 ? LX * 0.04 : undefined, amt: 0.4, lean: 6, armF: 20, o: (t > 2.28 ? 1 : 0) * (1 - free), blink: blinkAt(T, 5) });
      lameFree.set({ x: 440, y: gy(440) + 12, s: 0.9, armF: 130 * es(t, 3.6, 3.75), armB: 150 * es(t, 3.6, 3.75), head: -10, o: free, blink: blinkAt(T, 5) });
      const fl = seg(t, 3.58, 3.98);
      pose(flying, { x: 470 + fl * 90, y: gy(440) - 100 - Math.sin(fl * PI) * 180, r: fl * 400, s: 0.9, o: fl > 0 && fl < 1 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = bump(t, 3.42 + i * 0.12, 3.95);
        pose(sp, { x: i ? 440 : 560, y: gy(500) - 190, s: k, r: T * 40, o: k });
      });

      S.cam.x = kf(t, [[0, 0], [2.0, 0], [2.6, -30], [3.0, -30], [3.4, -10]]);
      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.1], [1.5, 1.07], [2.0, 1.07], [2.6, 1.04], [3.4, 1.08]]);
      S.cam.y = kf(t, [[0, 50], [1.0, 50], [2.0, 40], [2.6, 30], [3.4, 45]]);
    };
  },
};
