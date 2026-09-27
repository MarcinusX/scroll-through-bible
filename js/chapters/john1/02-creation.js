// J 1,3–5 — All things came to be through Him: the Word hangs high in the dark, and on golden threads
// it lifts the sheets of the world one by one, like a pop-up book — sky, hills, water, trees, beasts, people.
// Life stirs; its light reaches the two people; night falls, the darkness reaches for the flame and cannot close.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix, flock } from '../kit.js';
import { band, hillsWith, waterBand, palm, olive, cypress, bush, reeds, rock, grass, flowers, sun } from '../../assets/nature.js';
import { bird, fish } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { VOID, wordFlame, glowDisc, rayBurst, threads, darkSheet, soulLight, hand, PI } from './lib.js';
import { ibex, hare } from '../mark1/lib.js';

const WX = 800, WY = 200;           // the Word, high above the world

export default {
  id: 'j1-creation',
  beats: [
    { v: 3, text: 'Wszystko przez Nie się stało,' },
    { v: 3, cont: true, text: 'a bez Niego nic się nie stało, co się stało.' },
    { v: 4, text: 'W Nim było życie,' },
    { v: 4, cont: true, text: 'a życie było światłością ludzi,' },
    { v: 5, text: 'a światłość w ciemności świeci' },
    { v: 5, cont: true, text: 'i ciemność jej nie ogarnęła.' },
  ],
  cam: { x: [0, 0], y: [-20, 20], z: [1, 1.04] },
  build(S) {
    const c = S.c;
    const DAWNSKY = ['#b9cfd6', '#e9e3cf', '#f6e6c9'];
    const sk = sky(S, VOID);
    // the created sky, faded in over the void
    const sk2 = sky(S, DAWNSKY, { name: 'made' });
    sk2.layer.fade(0);

    /* ---------- the sheets of the world (each rises from below like a pop-up page) ---------- */
    const farL = S.layer({ par: 0, sh: 2, pad: 40 });
    const far = band(c, { y: 455, amps: [20, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.25) });
    farL.add(far.markup);
    const midL = S.layer({ par: 0, sh: 3 });
    const mid = hillsWith(c, { y: 520, amps: [24, 9, 3], lens: [900, 300, 110], color: C.hillMid, trees: 0 });
    midL.add(mid.markup);
    const waterL = S.layer({ par: 0, sh: 3 });
    waterL.add(waterBand(c, { y: 598, color: C.lake, foamN: 24 }).markup);
    const groundL = S.layer({ par: 0, sh: 4 });
    const gfn = c.wave(690, [8, 3], [700, 180]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.hillNear).out());
    groundL.add(grass(c, { x0: -900, x1: 2500, y: 690, fn: gfn, n: 70, h: 16, color: C.moss }) + rock(c, 1240, 700, 60, 22, C.rock2) + reeds(c, 330, 690, 8, 60) + reeds(c, 1320, 692, 9, 70));
    const SHEETS = [
      { L: sk2.layer, fade: true, a: 0.04 },
      { L: farL, y: 455, a: 0.16 },
      { L: midL, y: 520, a: 0.32 },
      { L: waterL, y: 598, a: 0.48 },
      { L: groundL, y: 690, a: 0.62 },
    ];

    /* ---------- things that pop up (origin at their base) ---------- */
    const P = S.layer({ par: 0, sh: 4 });
    const pops = [];
    const add = (markup, x, y, a, s = 1) => { const el = P.add(`<g>${markup}</g>`); pops.push({ el, x, y, a, s }); return el; };
    add(olive(c, 0, 0, 0.9), 520, mid.fn(520) + 8, 1.05);
    add(cypress(c, 0, 0, 150), 640, mid.fn(640) + 6, 1.1);
    add(palm(c, 0, 0, 200), 1080, mid.fn(1080) + 6, 1.15);
    add(olive(c, 0, 0, 0.7), 1210, mid.fn(1210) + 8, 1.2);
    add(cypress(c, 0, 0, 110), 430, mid.fn(430) + 6, 1.18);
    add(bush(c, 0, 0, 70, C.sage, C.moss), 980, gfn(980) + 4, 1.25);
    add(flowers(c, { x0: -120, x1: 120, y: 0, n: 16, h: 24 }), 620, gfn(620) + 2, 1.3);
    add(flowers(c, { x0: -110, x1: 110, y: 0, n: 14, h: 22 }), 1010, gfn(1010) + 2, 1.34);
    const ibexEl = add(ibex(c), 1150, mid.fn(1150) + 30, 1.4, 0.55);
    const hareEl = add(hare(c), 470, gfn(470) + 20, 1.46, 0.9);
    const perched = [0, 1, 2].map((i) => add(bird(c, { color: [C.bird, C.clay, C.dustyBlue][i] }), 1060 + i * 26, mid.fn(1080) - 160 + i * 6, 1.5 + i * 0.03, 0.6));
    const fishes = [0, 1].map((i) => ({ el: add(fish(c, { color: i ? C.lake3 : C.teal2 }), 520 + i * 560, 640, 1.52 + i * 0.04, 0.8), x: 520 + i * 560, i }));

    /* ---------- the two people ---------- */
    const PE = S.layer({ par: 0, sh: 5 });
    const MAN = { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather };
    const WOMAN = { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair, skin: C.skin2 };
    const man = S.puppet(PE.add(person(c, MAN)));
    const woman = S.puppet(PE.add(person(c, WOMAN)));
    const MX = 690, WX2 = 905, PY = 748;

    /* ---------- darkness ---------- */
    const nightL = S.layer({ par: 0, sh: 1, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0e1029"/>`);
    nightL.fade(0);
    const darkL = S.layer({ par: 0, sh: 8 });
    const dL = darkL.add(`<g>${darkSheet(c, -1)}</g>`);
    const dR = darkL.add(`<g>${darkSheet(c, 1)}</g>`);

    /* ---------- the light: lights in the people's hands, the beam, the Word ---------- */
    const lightL = S.layer({ par: 0, sh: 1, flat: true });
    const beam = lightL.add(`<path d="${c.poly([[WX - 18, WY + 20], [WX + 18, WY + 20], [WX + 190, 760], [WX - 190, 760]])}" fill="#fff1c4" opacity=".4"/>`);
    const pulse = [0, 1, 2].map(() => lightL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 60, 60, 0, PI * 2, 40), 5)}" fill="#fff1c4"/></g>`));
    const thr = threads(lightL, 26, { color: C.sun, w: 2.2 });
    const wGlow = lightL.add(`<g>${glowDisc(320, 'warm-glow', 1)}</g>`);
    const wRays = lightL.add(`<g>${rayBurst(c, { n: 18, r0: 30, r1: 520, spread: 0.03, color: '#ffe7a8', o: 0.34 })}</g>`);
    const handLights = [0, 1].map(() => lightL.add(`<g>${soulLight(c, 12)}</g>`));
    const push = lightL.add(`<g><ellipse rx="260" ry="520" fill="url(#halo-glow)"/></g>`);
    const flameL = S.layer({ par: 0, sh: 5 });
    const flameEl = flameL.add(`<g>${wordFlame(c, 104)}</g>`);

    // the birds that fly off when life stirs
    // the flock travels by sliding its whole sheet (compositor); each bird only flaps in place
    const flyL = S.layer({ par: 0, sh: 3 });
    const flyers = [0, 1, 2, 3, 4].map((i) => {
      const el = flyL.add(bird(c, { color: C.bird }));
      const b = { el, wF: el.querySelector('.wingF'), wB: el.querySelector('.wingB'), x: 1000 + i * 70 + c.rr(-20, 20), y: 300 + c.rr(-50, 40), s: 0.55 * c.rr(0.75, 1.1), ph: c.rr(0, 6) };
      pose(el, { x: b.x, y: b.y, s: b.s });
      return b;
    });

    return (t, time) => {
      const flick = time ? Math.sin(time * 7.3) * 0.03 + Math.sin(time * 11.1) * 0.02 : 0;

      /* v3a: the sheets of the world, lifted on golden threads */
      SHEETS.forEach((sh, i) => {
        const k = es(t, sh.a, sh.a + 0.3, ease.out);
        if (sh.fade) sh.L.fade(k * (1 - es(t, 4.05, 4.5) * 0.85));
        else { sh.L.shift(0, (1 - k) * 700); sh.L.fade(k > 0.001 ? 1 : 0); }
        if (!sh.fade) {
          const o = bump(t, sh.a - 0.02, sh.a + 0.42) * 0.9 + es(t, sh.a + 0.3, sh.a + 0.45) * 0.0;
          const yy = sh.y + (1 - k) * 700;
          thr(i * 2, WX - 8, WY - 20, 480, yy - 8, o);
          thr(i * 2 + 1, WX + 8, WY - 20, 1120, yy - 8, o);
        }
      });
      sk.blend(VOID, ['#070818', '#0c0e24', '#14173a'], es(t, 4.05, 4.5));

      /* v3b: nothing came to be without Him — every tree, beast and person pops up on its thread */
      pops.forEach((p, i) => {
        const k = es(t, p.a, p.a + 0.22, ease.back);
        const on = seg(t, p.a - 0.01, p.a);
        if (p.el === hareEl) return;
        if (fishes.some((f) => f.el === p.el)) return;
        pose(p.el, { x: p.x, y: p.y, s: p.s, sy: p.s * Math.max(0.001, k), o: on });
        if (i < 14) thr(10 + i, WX, WY - 10, p.x, p.y - 60 * p.s * k, bump(t, p.a - 0.02, p.a + 0.55) * 0.8);
      });
      const pk = es(t, 1.6, 1.85, ease.back);
      /* v4a: life — the hare hops, the fish leap, the birds fly up */
      const life = es(t, 2.05, 2.3);
      const lifeIdle = life * (1 - es(t, 3.9, 4.1)); // the hare settles down when night falls
      const hop = lifeIdle * Math.max(0, Math.sin((time || 0) * 3.2)) * 18 + bump(t, 2.1, 2.4) * 20;
      const hk = es(t, 1.46, 1.68, ease.back);
      pose(hareEl, { x: 470 + life * 60 + Math.sin((time || 0) * 0.4) * 30 * lifeIdle, y: gfn(470) + 20 - hop, s: 0.9, sy: 0.9 * Math.max(0.001, hk), o: seg(t, 1.45, 1.46) });
      fishes.forEach((f) => {
        if (t > 4.3 || t < 2.0) { pose(f.el, { x: f.x, y: 640, o: 0 }); return; }
        const on = seg(t, 1.5, 1.52);
        const cyc = time ? ((time * 0.45 + f.i * 0.5) % 1) : 0.3 + f.i * 0.3;
        const jump = life * Math.max(0, Math.sin(cyc * PI * 2));
        pose(f.el, { x: f.x + cyc * 60, y: 640 - jump * 70, r: -40 + cyc * 80, s: 0.8, o: on * (life > 0 && jump > 0.02 ? 1 : 0) * (1 - es(t, 4.05, 4.3)) });
      });
      perched.forEach((b, i) => fade(b, 1 - es(t, 2.08 + i * 0.04, 2.14 + i * 0.04)));
      const flyK = es(t, 2.1, 2.3) * (1 - es(t, 4.1, 4.4));
      flyL.fade(flyK);
      if (flyK > 0.001) {
        flyL.shift(-((time * 60) % 1500) + 250 - seg(t, 2.1, 4.1) * 300, 0);
        flyers.forEach((b) => { const f = time ? Math.sin(time * 9 + b.ph) * 26 : 10; pose(b.wF, { x: -2, y: -5, r: f }); pose(b.wB, { x: -2, y: -6, r: f * 0.8 }); });
      }
      pose(ibexEl, { x: 1150 - life * 30, y: mid.fn(1150) + 30, s: 0.55, sx: -0.55, sy: 0.55 * Math.max(0.001, es(t, 1.4, 1.62, ease.back)), o: seg(t, 1.39, 1.4) });
      pulse.forEach((p, i) => {
        const k = seg(t, 2.05 + i * 0.12, 2.75 + i * 0.12);
        pose(p, { x: WX, y: WY - 50, s: 0.6 + k * 8, o: (1 - k) * 0.6 * (k > 0 ? 1 : 0) });
      });

      /* the two people rise last */
      const up = es(t, 1.62, 1.9, ease.back);
      const lit = es(t, 3.1, 3.45);
      const look = es(t, 3.05, 3.3);
      man.set({ x: MX, y: PY, s: 0.95 * Math.max(0.001, up), o: seg(t, 1.61, 1.62), armF: 10 + lit * 70, armB: bump(t, 2.2, 2.9) * 60 + lit * 20, head: -look * 18 + bump(t, 1.9, 2.3) * 6, blink: blinkAt(time) });
      woman.set({ x: WX2, y: PY + 4, s: 0.93 * Math.max(0.001, up), flip: true, o: seg(t, 1.61, 1.62), armF: 10 + lit * 70, armB: lit * 30, head: -look * 18, blink: blinkAt(time, 2) });
      thr(24, WX, WY - 10, MX, PY - 180 * up, bump(t, 1.58, 2.1) * 0.8);
      thr(25, WX, WY - 10, WX2, PY - 180 * up, bump(t, 1.58, 2.1) * 0.8);

      /* v4b: the life was the light of men — a beam, and a light kindles in their hands */
      pose(beam, { o: lit * 0.45 * (1 - es(t, 4.05, 4.4) * 0.4) });
      [[MX, false], [WX2, true]].forEach(([x, fl], i) => {
        const [hx, hy] = hand(x, PY, 0.95, fl, 10 + lit * 70);
        pose(handLights[i], { x: hx + (fl ? -6 : 6), y: hy - 14, s: lit, o: lit });
      });

      /* v5a: darkness falls, the light shines on */
      const night = es(t, 4.05, 4.5);
      nightL.fade(night * 0.72);
      const bright = 1 + night * 0.2 + es(t, 5.5, 5.8) * 0.15;
      pose(flameEl, { x: WX, y: WY + 52, s: bright, sx: bright * (1 + flick), o: 1 });
      pose(wGlow, { x: WX, y: WY, s: bright * (1 + bump(t, 2.05, 2.5) * 0.3), o: 1 });
      pose(wRays, { x: WX, y: WY, s: 0.8 + night * 0.3 + es(t, 5.5, 5.8) * 0.3, r: t * 4, o: 0.8 - night * 0.35 });

      /* v5b: the darkness reaches in from both sides — and cannot close over it */
      const reach = es(t, 5.02, 5.42, ease.out);
      const back = es(t, 5.5, 5.85);
      const strain = Math.sin(t * 40) * 6 * bump(t, 5.2, 5.5);
      const gap = lerp(900, 250, reach) + back * 90 + strain;
      pose(dL, { x: WX - gap, y: 470, o: reach > 0.001 ? 1 : 0 });
      pose(dR, { x: WX + gap, y: 470, o: reach > 0.001 ? 1 : 0 });
      pose(push, { x: WX, y: 430, sx: 0.6 + gap / 400, sy: 1, o: reach * (0.55 + bump(t, 5.4, 5.9) * 0.45) });
    };
  },
};
