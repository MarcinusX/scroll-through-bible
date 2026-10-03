// Mk 11,23–25 — "whoever says to this mountain, 'Be lifted up and thrown into the sea'…": strings drop
// from the flies, the paper mountain rises, swings over and falls into the sea with a great splash.
// Prayer: lights come down on strings into the disciples' open hands. Forgiveness: a knot between two
// of them comes undone, and from heaven the dark scraps of their own faults float away as sparks.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waveStrip, sun, cloud, olive, cypress, grass, rock, flowers, bush } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { mountain, bubble, heart, headAt, hand, sparkle, spark, ropeHalf, knotBall, TWELVE_O, voiceRings } from './lib.js';
import { scrap } from '../mark2/lib.js';

const PI = Math.PI;
const GROUND = 648;
const MX0 = 880, MY = 528;       // the mountain's foot
const SEA0 = [1150, 566];        // where it lands
const JX0 = 560;

export default {
  id: 'm11-mountain',
  beats: [
    { v: 23, text: 'Zaprawdę, powiadam wam: Kto powie tej górze: "Podnieś się i rzuć się w morze",' },
    { v: 23, cont: true, text: 'a nie wątpi w duszy, lecz wierzy, że spełni się to, co mówi, tak mu się stanie.' },
    { v: 24, text: 'Dlatego powiadam wam: Wszystko, o co w modlitwie prosicie, stanie się wam,' },
    { v: 24, cont: true, text: 'tylko wierzcie, że otrzymacie.' },
    { v: 25, text: 'A kiedy stajecie do modlitwy, przebaczcie, jeśli macie co przeciw komu,' },
    { v: 25, cont: true, text: 'aby także Ojciec wasz, który jest w niebie, przebaczył wam wykroczenia wasze».' },
  ],
  cam: { x: [-60, 160], y: [-80, 40], z: [0.94, 1.14] },
  build(S) {
    const c = S.c;
    // phone: the shore, the mountain and the sea come 120 further in, and the people stand closer together
    const P = S.portrait, D = P ? -120 : 0;
    const MX = MX0 + D, SEA = [SEA0[0] + D, SEA0[1]], JX = P ? 650 : JX0, KX = P ? 801 : 756;
    const SKY = ['#cfe0de', '#f0e6cb', '#f8ebd3'];
    const sk = sky(S, SKY);
    const heav = S.layer({ par: 0.02, sh: 1, flat: true });
    const burst = heav.add(`<g>${rays(c, { n: 22, r0: 40, r1: 1300, spread: 0.05, color: '#fff3cf' })}<circle r="240" fill="url(#halo-glow)"/></g>`);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 380, y: 140, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 820, y: 110, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1260, y: 170, len: 700 });

    /* ---------- far hills of Moab and the sea ---------- */
    S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 470, amps: [16, 8, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.duskViolet, 0.25), x0: -1400, x1: 3200 }).markup);
    const seaL = S.layer({ par: 0.12, sh: 2 });
    seaL.add(`<g transform="translate(${D} 0)">${sheet().p(c.cut([[960, 552], [1060, 542], [3200, 536], [3200, 900], [960, 900]], 1, 16), C.lake).out()}</g>`);
    /* ---------- the mountain on strings (its roots hidden in the hill until it rises) ---------- */
    const mtL = S.layer({ par: 0.14, sh: 5 });
    const strings = mtL.add(`<g opacity="0"><path d="M-120 -2400V-240M120 -2400V-236" stroke="rgba(74,54,34,.6)" stroke-width="1.6" fill="none"/></g>`);
    const mt = mtL.add(`<g>${mountain(c, 420, 300)}</g>`);
    const hillL = S.layer({ par: 0.14, sh: 3 });
    const hp = [[-1400, 548], [-600, 540], [200, 546], [800, 540], [1000, 548], [1080, 566], [1000, 900], [-1400, 900]];
    hillL.add(`<g transform="translate(${D} 0)">${sheet().p(c.cut(hp, 1.2, 12), C.hillMid).out()}</g>`);
    // the front of the sea: waves that cover the falling mountain
    const seaFront = S.layer({ par: 0.2, sh: 3, pad: 160 });
    seaFront.add(`<g transform="translate(${D} 0)">${waveStrip(c, { y: 576, len: 110, amp: 7, color: C.lake2, x0: 1010, x1: 3200, bottom: 900 })}</g>`);
    const splashL = S.layer({ par: 0.2, sh: 3 });
    const drops = Array.from({ length: 16 }, (_, i) => ({ i, el: splashL.add(`<path d="${c.cut([[0, -9], [5, 2], [0, 7], [-5, 2]], 0.2, 3)}" fill="${i % 3 ? C.foam : C.lake}"/>`), a: PI + (i + 0.5) / 16 * PI, v: c.rr(90, 200) }));
    const rings = [0, 1, 2].map((i) => splashL.add(`<path d="${c.ribbon(c.arc(0, 0, 60, 12, 0, PI * 2, 24), 3)}" fill="${C.foam}"/>`));

    /* ---------- the slope where they sit ---------- */
    const slope = S.layer({ par: 0.45, sh: 4 });
    const gfn = c.wave(604, [6, 3], [800, 200]);
    slope.add(sheet().p(c.ridge(gfn, -1400, 3200, 1800, 12, 1), C.hillNear).out());
    slope.add(olive(c, 170, gfn(170) + 10, 1.0) + olive(c, 1420, gfn(1420) + 10, 0.9) + cypress(c, 280, gfn(280) + 8, 140));
    slope.add(grass(c, { x0: -800, x1: 2400, y: 610, fn: (x) => gfn(x) + 10, n: 40, h: 14, color: C.olive }) + flowers(c, { x0: -300, x1: 1900, y: 614, fn: (x) => gfn(x) + 14, n: 24 }) + rock(c, 1180, 640, 70, 26, C.rock));

    /* ---------- people ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const PRAY = [
      { o: CAST.peter, x: P ? 470 : 330, y: GROUND - 6 }, { o: CAST.john, x: P ? 555 : 430, y: GROUND - 2 },
      { o: CAST.james, x: P ? 945 : 960, y: GROUND - 4 }, { o: CAST.matthew, x: P ? 1025 : 1060, y: GROUND - 8 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), pS: S.puppet(L.add(person(c, d.o))), pK: S.puppet(L.add(person(c, { ...d.o, pose: 'kneel' }))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    // two who have something against each other: Andrew and Thomas, a rope knotted between them
    const PAIR = [{ o: CAST.andrew, x: KX - 56, flip: true }, { o: CAST.thomas, x: KX + 56, flip: false }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const ropeL = fx.add(`<g>${ropeHalf(c, 60, -1)}</g>`), ropeR = fx.add(`<g>${ropeHalf(c, 60, 1)}</g>`);
    const knot = fx.add(`<g>${knotBall(c, 14)}</g>`);
    const shout = fx.add(`<g>${bubble(c, [tr('Podnieś się', 'Be taken up'), tr('i rzuć się w morze!', 'and cast into the sea!')], { size: 18, tail: 1 })}</g>`);
    const faithHeart = fx.add(`<g>${heart(c, 16)}</g>`);
    const voice = voiceRings(fx, c, { n: 3, r: 30, w: 5, both: false, color: shade(C.terracotta, 0.3) });
    // gifts of light lowered on strings into open hands
    const gifts = PRAY.map((d, i) => ({ i, el: fx.add(`<g><path d="M0 -1600V-14" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/>${spark(c, 12)}</g>`) }));
    // dark scraps of faults float away and become sparks
    const faults = [...PRAY.map((d) => d), ...PAIR].map((d, i) => ({ i, d, el: fx.add(`<g>${scrap(c, 12)}</g>`), sp: fx.add(`<g>${sparkle(c, 10)}</g>`) }));
    const embraceGlow = fx.add(`<g><circle r="90" fill="url(#warm-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      const heaven = es(t, 5.05, 5.4);
      sk.blend(SKY, ['#e6eee2', '#fbf0d2', '#fcf2dc'], heaven);
      pose(burst, { x: 680, y: -60, s: 0.4 + heaven * 0.7, r: t * 5, o: heaven * 0.5 });
      swing(sunEl, 380, 140, T, 1, 0.6);
      swing(cl1, 820 + Math.sin(T * 0.1) * 26, 110, T, 1.3, 0.6, 1);
      swing(cl2, 1260 + Math.sin(T * 0.12) * 26, 170, T, 1.3, 0.7, 2);

      /* v23a — "whoever says to this mountain…": John speaks, the strings come down */
      const speak = es(t, 0.3, 0.5) * (1 - es(t, 1.0, 1.2));
      const stringsOn = es(t, 0.4, 0.8) * (1 - es(t, 1.62, 1.7));
      const quiver = bump(t, 0.5, 1.1) * Math.sin(t * 70) * 1.2;
      /* v23b — it rises, swings over the shore and drops into the sea */
      const rise = es(t, 1.05, 1.35);
      const over = es(t, 1.3, 1.52);
      const drop = es(t, 1.5, 1.66, ease.in);
      const sink = es(t, 1.62, 1.95);
      const mx = lerp(MX, SEA[0], over), my = MY - rise * 150 * (1 - drop) + drop * 60 + sink * 330 - bump(t, 1.3, 1.52) * 40;
      pose(mt, { x: mx, y: my, r: quiver + over * 8 * (1 - drop) - drop * 4, o: 1 - seg(t, 2.1, 2.15) });
      pose(strings, { x: mx, y: my, o: stringsOn });
      drops.forEach((d) => {
        const k = seg(t, 1.62, 2.05);
        const x = SEA[0] + Math.cos(d.a) * d.v * k * 1.4, y = SEA[1] + 10 + Math.sin(d.a) * d.v * 1.6 * Math.sin(k * PI * 0.9);
        pose(d.el, { x, y, s: 1.4, r: d.a * 57, o: k > 0 && k < 1 ? 1 - k * 0.3 : 0 });
      });
      rings.forEach((r, i) => { const k = seg(t, 1.65 + i * 0.12, 2.3 + i * 0.12); pose(r, { x: SEA[0], y: SEA[1] + 14, s: 0.5 + k * 2.2, sy: 1, o: k > 0 && k < 1 ? (1 - k) * 0.9 : 0 }); });
      seaFront.shift(((T * 14) % 110) - 55, 0);

      /* Jesus teaches through it all; the believer (John) speaks to the mountain */
      const prayK = es(t, 2.05, 2.12) * (1 - es(t, 4.05, 4.12));
      const receive = es(t, 3.1, 3.5);
      jesus.set({ x: JX, y: GROUND - 12, s: 1.02, flip: t > 3.9, armF: 40 + bump(t, 0.05, 1.8) * 50 + prayK * 50 + es(t, 4.2, 4.5) * 30, armB: prayK * 110 + heaven * 60, head: -heaven * 12 - prayK * 8, blink: blinkAt(T) });
      PRAY.forEach((d) => {
        const kneel = d.i < 4 ? prayK : 0;
        const isJohn = d.i === 1;
        const believe = isJohn ? es(t, 1.05, 1.3) : 0;
        const arms = es(t, 2.2, 2.5);
        d.pS.set({ x: d.x, y: d.y, s: 0.92, flip: d.x > 800, o: 1 - kneel, armF: isJohn ? speak * 90 + believe * 30 : bump(t, 1.5, 2.0) * 60, armB: isJohn ? speak * 30 : 0, head: -bump(t, 1.2, 1.8) * 10 - heaven * 10, blink: blinkAt(T, d.seed) });
        d.pK.set({ x: d.x, y: d.y, s: 0.92, flip: d.x > 800, o: kneel, armB: arms * 140, armF: arms * 80 + receive * 10, head: -arms * 14, blink: blinkAt(T, d.seed) });
      });
      const J = PRAY[1];
      const [jhx, jhy] = headAt(J.x, J.y, 0.92, false);
      const sh = es(t, 0.35, 0.55, ease.back) * (1 - es(t, 1.05, 1.2));
      pose(shout, { x: jhx + 40, y: jhy - 30, s: sh, o: sh > 0.02 ? 1 : 0 });
      voice(jhx + 22, jhy + 4, speak, T, { dir: 1 });
      const fh = es(t, 1.08, 1.3, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(faithHeart, { x: J.x + 8, y: J.y - 120, s: fh * 1.2, o: fh > 0.02 ? 1 : 0 });

      /* v24 — whatever you ask in prayer: lights come down into their hands */
      gifts.forEach((g) => {
        const d = PRAY[g.i];
        const [hx, hy] = hand(d.x, d.y + 46 * 0.92, 0.92, d.x > 800, 80);
        const k = es(t, 2.3 + g.i * 0.08, 3.4 + g.i * 0.05, ease.out);
        const up = es(t, 3.5, 3.9);
        pose(g.el, { x: hx, y: lerp(-100, hy - 16, k) - up * 0, s: 1, o: seg(t, 2.25, 2.35) * (1 - es(t, 4.0, 4.2)) });
      });

      /* v25 — forgive: the knot between Andrew and Thomas comes undone; they embrace */
      const inPair = es(t, 3.95, 4.3);
      const untie = es(t, 4.5, 4.85);
      const hug = es(t, 4.8, 5.1);
      PAIR.forEach((p) => {
        const dir = p.i ? 1 : -1;
        const x = p.x + dir * (1 - inPair) * 360 - dir * hug * 26;
        const facing = untie > 0.4 ? !p.flip : p.flip;
        p.p.set({ x, y: GROUND - 2, s: 0.92, flip: facing, o: seg(t, 3.9, 3.98), walk: (inPair > 0 && inPair < 1) || (hug > 0 && hug < 1) ? x * 0.05 + p.i : undefined, armF: inPair * 30 * (1 - untie) + hug * 70, armB: hug * 60, head: (1 - untie) * -6 + hug * 6, lean: hug * 6 * (p.i ? -1 : 1), blink: blinkAt(T, p.seed) });
      });
      const kx = KX, ky = GROUND - 104;
      const loose = untie;
      pose(knot, { x: kx, y: ky, s: 1 - loose, r: loose * 90, o: seg(t, 3.9, 4.0) * (1 - loose) });
      pose(ropeL, { x: kx - loose * 10, y: ky + loose * 30, r: -loose * 50, o: seg(t, 3.9, 4.0) * (1 - es(t, 4.8, 5.0)) });
      pose(ropeR, { x: kx + loose * 10, y: ky + loose * 30, r: loose * 50, o: seg(t, 3.9, 4.0) * (1 - es(t, 4.8, 5.0)) });
      pose(embraceGlow, { x: KX, y: GROUND - 100, s: 1, o: hug * 0.8 * (1 - heaven * 0.3) });

      /* v25b — the Father in heaven forgives: dark scraps float away and turn to light */
      faults.forEach((f) => {
        const d = f.d;
        const bx = d.x || KX, by = (d.y || GROUND) - 130;
        const k = es(t, 5.1 + f.i * 0.05, 5.8, ease.in);
        const x = bx + Math.sin(f.i * 2 + k * 3) * 30, y = by - k * 360;
        pose(f.el, { x, y, r: k * 200, s: 1 - k * 0.3, o: seg(t, 5.0, 5.08) * (1 - es(t, 5.45 + f.i * 0.03, 5.6 + f.i * 0.03)) });
        pose(f.sp, { x, y, r: T * 40, s: 1, o: es(t, 5.45 + f.i * 0.03, 5.6 + f.i * 0.03) * (1 - k * 0.3) });
      });

      S.cam.x = -20 + es(t, 0.3, 1.0) * 170 - es(t, 1.9, 2.3) * 150 + es(t, 3.9, 4.3) * 60;
      if (S.portrait) S.cam.x = -60 + es(t, 1.2, 1.6) * 170 * (1 - es(t, 1.95, 2.3)); // narrow stage: keep Jesus in view, follow the mountain only while it flies
      S.cam.y = -es(t, 0.3, 1.0) * 40 + es(t, 1.9, 2.3) * 40 - heaven * 40;
      S.cam.z = 1.0 - es(t, 0.3, 1.0) * 0.04 + es(t, 1.9, 2.3) * 0.08 - heaven * 0.06;
    };
  },
};
