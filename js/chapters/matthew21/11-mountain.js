// Mt 21,21–22 — beside the withered fig tree, on the slope above the sea: "If you have faith and do not doubt…" — a
// heart of faith lights over the disciples, the dark little cloud of doubt blows away; not only the fig tree —
// "say to this mountain, 'Be lifted up and thrown into the sea'": strings drop from the flies, the paper mountain
// rises, swings over the shore and falls into the sea with a great splash. "Whatever you ask in prayer, believing,
// you will receive": they kneel, and lights come down on strings into their open hands.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waveStrip, sun, cloud, olive, cypress, grass, rock, flowers } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountain, figTree, bubble, heart, headAt, hand, spark, voiceRings, tr, DAY, HIGH, PI } from './lib.js';

const GROUND = 648;
const MX = 880, MY = 528;       // the mountain's foot
const SEA = [1150, 566];        // where it lands
const JX = 600;

/** a small grey cloud of doubt (origin centre) */
function doubtCloud(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(-14, 0, 16, 12, PI, 2 * PI, 6), ...c.arc(8, -4, 18, 15, PI, 2 * PI, 6), [26, 8], [-30, 8]], 0.4, 4), mix(C.storm, C.stone2, 0.4));
  return s.out();
}

export default {
  id: 'mt21-mountain',
  beats: [
    { v: 21, text: 'Jezus im odpowiedział: «Zaprawdę, powiadam wam: jeśli będziecie mieć wiarę, a nie zwątpicie, to nie tylko z figowym drzewem to uczynicie,' },
    { v: 21, cont: true, text: 'ale nawet jeśli powiecie tej górze: "Podnieś się i rzuć się w morze!", stanie się.' },
    { v: 22 },
  ],
  cam: { x: [-60, 210], y: [-80, 40], z: [0.94, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const highL = sky(S, HIGH, { name: 'high', rise: 0 }).layer;
    const heav = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    const burst = heav.add(`<g>${rays(c, { n: 22, r0: 40, r1: 1300, spread: 0.05, color: '#fff3cf' })}<circle r="240" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 380, y: 140, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 820, y: 110, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1260, y: 170, len: 700 });

    /* ---------- far hills and the sea ---------- */
    S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 470, amps: [16, 8, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.duskViolet, 0.25), x0: -1400, x1: 3200 }).markup);
    const seaL = S.layer({ par: 0.12, sh: 2 });
    seaL.add(sheet().p(c.cut([[960, 552], [1060, 542], [3200, 536], [3200, 900], [960, 900]], 1, 16), C.lake).out());
    /* ---------- the mountain on strings (its roots hidden in the hill until it rises) ---------- */
    const mtL = S.layer({ par: 0.14, sh: 5 });
    const strings = mtL.add(`<g opacity="0"><path d="M-120 -2400V-240M120 -2400V-236" stroke="rgba(74,54,34,.6)" stroke-width="1.6" fill="none"/></g>`);
    const mt = mtL.add(`<g>${mountain(c, 420, 300)}</g>`);
    const hillL = S.layer({ par: 0.14, sh: 3 });
    hillL.add(sheet().p(c.cut([[-1400, 548], [-600, 540], [200, 546], [800, 540], [1000, 548], [1080, 566], [1000, 900], [-1400, 900]], 1.2, 12), C.hillMid).out());
    const seaFront = S.layer({ par: 0.2, sh: 3, pad: 160 });
    seaFront.add(`<g>${waveStrip(c, { y: 576, len: 110, amp: 7, color: C.lake2, x0: 1010, x1: 3200, bottom: 900 })}</g>`);
    const splashL = S.layer({ par: 0.2, sh: 3 });
    const drops = Array.from({ length: 16 }, (_, i) => ({ i, el: splashL.add(`<path d="${c.cut([[0, -9], [5, 2], [0, 7], [-5, 2]], 0.2, 3)}" fill="${i % 3 ? C.foam : C.lake}"/>`), a: PI + (i + 0.5) / 16 * PI, v: c.rr(90, 200) }));
    const rings = [0, 1, 2].map(() => splashL.add(`<path d="${c.ribbon(c.arc(0, 0, 60, 12, 0, PI * 2, 24), 3)}" fill="${C.foam}"/>`));

    /* ---------- the slope with the withered fig tree ---------- */
    const slope = S.layer({ par: 0.45, sh: 4 });
    const gfn = c.wave(604, [6, 3], [800, 200]);
    slope.add(sheet().p(c.ridge(gfn, -1400, 3200, 1800, 12, 1), C.hillNear).out());
    const ft = figTree(c, 0.8);
    slope.add(`<g transform="translate(250 ${gfn(250) + 14})">${ft.trunk.replace(/fill="#[0-9a-f]{6}"/, `fill="${mix(C.stone2, C.rock3, 0.4)}"`)}${ft.withered}</g>`);
    slope.add(olive(c, 1420, gfn(1420) + 10, 0.9) + cypress(c, 90, gfn(90) + 8, 140));
    slope.add(grass(c, { x0: -800, x1: 2400, y: 610, fn: (x) => gfn(x) + 10, n: 40, h: 14, color: C.olive }) + flowers(c, { x0: -300, x1: 1900, y: 614, fn: (x) => gfn(x) + 14, n: 24 }) + rock(c, 1180, 640, 70, 26, C.rock));

    /* ---------- people ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const PRAY = [
      { o: CAST.peter, x: 380, y: GROUND - 6 }, { o: CAST.john, x: 470, y: GROUND - 2 },
      { o: CAST.james, x: 730, y: GROUND - 4 }, { o: CAST.andrew, x: 820, y: GROUND - 8 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), pS: S.puppet(L.add(person(c, d.o))), pK: S.puppet(L.add(person(c, { ...d.o, pose: 'kneel' }))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const shout = fx.add(`<g>${bubble(c, [tr('Podnieś się', 'Be taken up'), tr('i rzuć się w morze!', 'and cast into the sea!')], { size: 18, tail: 1 })}</g>`);
    const hearts = PRAY.map(() => fx.add(`<g>${heart(c, 14)}</g>`));
    const doubt = fx.add(`<g>${doubtCloud(c)}</g>`);
    const figGlow = fx.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`);
    const voice = voiceRings(fx, c, { n: 3, r: 30, w: 5, both: false, color: shade(C.terracotta, 0.3) });
    const voiceJ = voiceRings(fx, c, { n: 3, r: 30, w: 5, both: false, color: shade(C.ochre, 0.25) });
    const gifts = PRAY.map((d, i) => ({ i, el: fx.add(`<g><path d="M0 -1600V-14" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/>${spark(c, 12)}</g>`) }));

    return (t, time) => {
      const T = time;
      const heaven = es(t, 2.1, 2.5);
      highL.fade(heaven * 0.9);
      pose(burst, { x: 600, y: -60, s: 0.4 + heaven * 0.7, r: t * 5, o: heaven * 0.5 });
      swing(sunEl, 380, 140, T, 1, 0.6);
      swing(cl1, 820 + Math.sin(T * 0.1) * 26, 110, T, 1.3, 0.6, 1);
      swing(cl2, 1260 + Math.sin(T * 0.12) * 26, 170, T, 1.3, 0.7, 2);

      /* v21a — faith without doubt: hearts light up, the doubt blows away; the fig tree is the sign */
      const teach = es(t, 0.05, 0.25) * (1 - es(t, 0.95, 1.1));
      const faith = es(t, 0.3, 0.55);
      const [jhx, jhy] = headAt(JX, GROUND - 12, 1.02, false);
      pose(figGlow, { x: 250, y: gfn(250) - 150, s: 1, o: bump(t, 0.6, 1.0) * 0.9 });
      const dk = es(t, 0.2, 0.35, ease.back) * (1 - es(t, 0.45, 0.6));
      pose(doubt, { x: 520 - es(t, 0.45, 0.7) * 240, y: 380 - es(t, 0.45, 0.7) * 120, s: dk * 1.2 + 0.001, r: -es(t, 0.45, 0.7) * 30, o: dk > 0.02 ? dk : 0 });
      hearts.forEach((h, i) => {
        const d = PRAY[i];
        const k = es(t, 0.45 + i * 0.05, 0.6 + i * 0.05, ease.back) * (1 - es(t, 1.9, 2.05));
        pose(h, { x: d.x + (d.x > 800 ? -4 : 4), y: d.y - 214 + Math.sin(T * 2 + i) * 3, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* v21b — "say to this mountain…": John speaks, the strings come down, it rises and falls into the sea */
      const speak = es(t, 1.03, 1.15) * (1 - es(t, 1.6, 1.75));
      const stringsOn = es(t, 1.12, 1.3) * (1 - es(t, 1.8, 1.85));
      const quiver = bump(t, 1.15, 1.4) * Math.sin(t * 90) * 1.2;
      const rise = es(t, 1.3, 1.48);
      const over = es(t, 1.46, 1.6);
      const drop = es(t, 1.58, 1.7, ease.in);
      const sink = es(t, 1.68, 1.92);
      const mx = lerp(MX, SEA[0], over), my = MY - rise * 150 * (1 - drop) + drop * 60 + sink * 330 - bump(t, 1.46, 1.6) * 40;
      pose(mt, { x: mx, y: my, r: quiver + over * 8 * (1 - drop) - drop * 4, o: 1 - seg(t, 1.97, 2.0) });
      pose(strings, { x: mx, y: my, o: stringsOn });
      drops.forEach((d) => {
        const k = seg(t, 1.68, 1.98);
        const x = SEA[0] + Math.cos(d.a) * d.v * k * 1.4, y = SEA[1] + 10 + Math.sin(d.a) * d.v * 1.6 * Math.sin(k * PI * 0.9);
        pose(d.el, { x, y, s: 1.4, r: d.a * 57, o: k > 0 && k < 1 ? 1 - k * 0.3 : 0 });
      });
      rings.forEach((r, i) => { const k = seg(t, 1.7 + i * 0.08, 2.1 + i * 0.08); pose(r, { x: SEA[0], y: SEA[1] + 14, s: 0.5 + k * 2.2, o: k > 0 && k < 1 ? (1 - k) * 0.9 : 0 }); });
      seaFront.shift(((T * 14) % 110) - 55, 0);

      /* v22 — whatever you ask in prayer, believing: they kneel, lights come down into their hands */
      const prayK = es(t, 2.05, 2.12);
      const receive = es(t, 2.5, 2.8);
      jesus.set({ x: JX, y: GROUND - 12, s: 1.02, armF: 40 + teach * 50 + bump(t, 1.0, 1.9) * 40 + prayK * 40, armB: prayK * 110 + heaven * 30, head: -heaven * 12 - bump(t, 1.2, 1.9) * 6, blink: blinkAt(T) });
      PRAY.forEach((d) => {
        const isJohn = d.i === 1;
        const arms = es(t, 2.15, 2.4);
        d.pS.set({ x: d.x, y: d.y, s: 0.92, flip: d.x > JX, o: 1 - prayK, armF: isJohn ? speak * 90 + faith * 20 : bump(t, 1.5, 1.95) * 60, armB: isJohn ? speak * 30 : faith * 20, head: -bump(t, 1.3, 1.9) * 10, blink: blinkAt(T, d.seed) });
        d.pK.set({ x: d.x, y: d.y, s: 0.92, flip: d.x > JX, o: prayK, armB: arms * 140, armF: arms * 80 + receive * 10, head: -arms * 14, blink: blinkAt(T, d.seed) });
      });
      const J = PRAY[1];
      const [ohx, ohy] = headAt(J.x, J.y, 0.92, false);
      const sh = es(t, 1.05, 1.2, ease.back) * (1 - es(t, 1.6, 1.72));
      pose(shout, { x: ohx + 40, y: ohy - 30, s: sh, o: sh > 0.02 ? 1 : 0 });
      voice(ohx + 22, ohy + 4, speak, T, { dir: 1 });
      voiceJ(jhx + 22, jhy + 4, teach, T, { dir: 1 });
      gifts.forEach((g) => {
        const d = PRAY[g.i];
        const [hx, hy] = hand(d.x, d.y + 46 * 0.92, 0.92, d.x > JX, 80);
        const k = es(t, 2.25 + g.i * 0.06, 2.7 + g.i * 0.04, ease.out);
        pose(g.el, { x: hx, y: lerp(-100, hy - 16, k), s: 1, o: seg(t, 2.2, 2.28) });
      });

      S.cam.x = -20 + es(t, 1.0, 1.4) * 170 - es(t, 1.9, 2.2) * 150;
      if (S.portrait) S.cam.x = -60 + es(t, 1.3, 1.5) * 260 * (1 - es(t, 1.9, 2.2));
      S.cam.y = -es(t, 1.0, 1.4) * 40 + es(t, 1.9, 2.2) * 40 - heaven * 40;
      S.cam.z = 1.0 - es(t, 1.0, 1.4) * 0.04 + es(t, 1.9, 2.2) * 0.08 - heaven * 0.06;
    };
  },
};
