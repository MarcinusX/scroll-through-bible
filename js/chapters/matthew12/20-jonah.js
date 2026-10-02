// Mt 12,40 — a painted flat cut through the sea. Jonah drops into the waves; the great fish
// rises, opens its jaw and swallows him, and through a window in its side we see him kneeling in a small warm light.
// Above the water day and night pass, three times — a sun, a moon, a sun… hung one by one on the string of days.
// "So will the Son of Man be three days and three nights in the heart of the earth": the sea fades, and in its place
// a hill is cut open: deep in the earth a rock tomb, its stone rolled shut, and inside only a quiet light. Three more
// days and nights pass over the hill, and on the third morning the light in the tomb grows bright.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, waveStrip, sun, moon, grass, olive, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { SEA, NIGHT, JONAH, greatFish, glow, rayBurst, sparkle, PI } from './lib.js';

const WY = 330;       // the sea surface

export default {
  id: 'mt12-jonah',
  enter: 'fly',
  beats: [
    { v: 40, text: 'Albowiem jak Jonasz był trzy dni i trzy noce we wnętrznościach wielkiej ryby,' },
    { v: 40, cont: true, text: 'tak Syn Człowieczy będzie trzy dni i trzy noce w łonie ziemi.' },
  ],
  cam: { x: [-20, 20], y: [-20, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, SEA);
    const night = sky(S, NIGHT, { name: 'night' });
    night.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: WY - 20, n: 70 }));
    starL.fade(0);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 34), { x: 0, y: 0, len: 900 });
    const moonEl = hanging(hangL, moon(c, 28), { x: 0, y: 0, len: 900 });
    /* the string of days: six little tokens */
    const tokens = [0, 1, 2, 3, 4, 5].map((i) => hangL.add(`<g opacity="0">${i % 2 ? moon(c, 13) : sun(c, 14)}</g>`));

    /* the sea, cut open */
    const seaL = S.layer({ par: 0.2, sh: 3 });
    const deep = S.id('deep');
    S.defs(`<linearGradient id="${deep}" gradientUnits="userSpaceOnUse" x1="0" y1="${WY}" x2="0" y2="900"><stop offset="0" stop-color="${C.lake2}"/><stop offset="1" stop-color="${mix(C.lakeDeep, C.night2, 0.4)}"/></linearGradient>`);
    seaL.add(`<g><rect x="-2000" y="${WY}" width="5600" height="2000" fill="url(#${deep})"/>${waveStrip(c, { y: WY, len: 110, amp: 10, x0: -1600, x1: 3200, bottom: WY + 30, color: C.lake })}</g>`);
    seaL.add(sheet().p(c.ridge(c.wave(820, [20, 8], [500, 160]), -900, 2500, 1700, 12, 1.4), mix(C.sand2, C.lakeDeep, 0.4)).out());
    const jonahFall = seaL.add(`<g>${person(c, JONAH)}</g>`);
    const FSH = S.portrait ? 50 : 0;   // phone: the fish swims 50 further left (its tail was under the thread)
    const fishL = S.layer({ par: 0.3, sh: 5 });
    const fish = fishL.add(`<g>${greatFish(c, { w: 520 })}</g>`);
    const jaw = fish.querySelector('.jaw');
    const win = fishL.add(`<g opacity="0"><ellipse rx="92" ry="56" fill="${mix(C.soilRich, C.plumRobe, 0.4)}"/>${glow(80, 0.9)}<g transform="translate(0 44) scale(.42)">${person(c, { ...JONAH, pose: 'kneel' }).replace('<g class="armFr">', '<g class="armFr" transform="rotate(-150)">').replace('<g class="armBr">', '<g class="armBr" transform="rotate(-150)">')}</g><path d="${c.ribbon(c.arc(0, 0, 92, 56, 0, PI * 2, 30), 6)}" fill="${shade(C.teal2, -0.2)}"/></g>`);
    const bubbles = [0, 1, 2, 3].map(() => fishL.add(`<g opacity="0"><circle r="6" fill="none" stroke="${C.foam}" stroke-width="2"/></g>`));

    /* the hill, cut open */
    const hillL = S.layer({ par: 0.25, sh: 4 });
    const hs = sheet();
    const hfn = (x) => 430 - 170 * Math.exp(-Math.pow((x - 800) / 420, 2)) + Math.sin(x / 60) * 4;
    hs.p(c.ridge(hfn, -900, 2500, 1700, 12, 1), mix(C.soil, C.sand2, 0.35));
    let strata = '';
    for (let k = 0; k < 5; k++) strata += c.ribbon(Array.from({ length: 30 }, (_, i) => { const x = -900 + i * 120; return [x, hfn(x) + 90 + k * 90 + Math.sin(i + k) * 10]; }), 3);
    hs.x(strata, shade(C.soil, -0.15), 'opacity=".5"');
    hs.p(c.cut(c.blob(800, 620, 190, 120, 16, 0.12), 1.2, 8), C.rock2);
    hs.p(c.cut(c.ell(800, 630, 140, 80, 24), 0.8, 8), mix(C.soilRich, C.night2, 0.35));
    hs.p(c.cut([[640, 700], [960, 700], [960, 716], [640, 716]], 0.4, 8), C.rock3);
    hillL.add(hs.out());
    hillL.add(`<g>${sheet().p(c.ribbon(Array.from({ length: 60 }, (_, i) => { const x = -900 + i * 60; return [x, hfn(x) + 10]; }), 30, 1.5), mix(C.hillNear, C.sage2, 0.3)).out()}</g>`);
    hillL.add(grass(c, { x0: -600, x1: 2200, y: 300, fn: hfn, n: 40, h: 14, color: C.moss }) + olive(c, 520, hfn(520) + 6, 0.7) + olive(c, 1140, hfn(1140) + 6, 0.6));
    const tombGlow = hillL.add(`<g opacity="0">${glow(150, 1, 'halo-glow')}</g>`);
    const tombRays = hillL.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 20, r1: 150, spread: 0.06, color: '#fff3cf', o: 0.7 })}</g>`);
    hillL.add(`<g transform="translate(958 640)">${sheet().p(c.cut(c.circ(0, 0, 58, 30), 1, 5), C.rock2).x(c.ribbon(c.arc(0, 0, 50, 50, PI * 1.1, PI * 1.5, 8), 4), shade(C.rock2, 0.3), 'opacity=".6"').out()}</g>`);
    hillL.fade(0);

    return (t, time) => {
      const T = time;
      /* which set: sea (beat 0) or the hill (beat 1) */
      const toHill = es(t, 0.98, 1.2);
      seaL.fade(1 - toHill); fishL.fade(1 - toHill); hillL.fade(toHill);

      /* three days and nights, in each beat */
      const base = t < 1 ? 0.3 : 1.25;
      const u = seg(t, base, base + 0.66);      // 0..1 across 3 days
      const dayPhase = (u * 3) % 1;
      const nightK = u > 0 && u < 1 ? Math.sin(dayPhase * PI) ** 2 : 0;
      night.layer.fade(nightK * 0.9); starL.fade(nightK);
      const skyX = (p) => lerp(1250, 350, p);
      const arcY = (p) => 290 - Math.sin(p * PI) * 90;
      const sp = u > 0 && u < 1 ? dayPhase : -1;
      pose(sunEl, { x: sp < 0 ? 1180 : skyX(sp < 0.5 ? sp + 0.5 : sp - 0.5), y: sp < 0 ? 170 : arcY(sp < 0.5 ? sp + 0.5 : sp - 0.5), oy: 0, o: sp < 0 ? 1 : 1 - nightK });
      pose(moonEl, { x: sp < 0 ? 0 : skyX(sp), y: sp < 0 ? -400 : arcY(sp), oy: 0, o: sp < 0 ? 0 : nightK });
      tokens.forEach((tk, i) => {
        const k = es(t, base + (i + 1) * 0.11, base + (i + 1) * 0.11 + 0.05, ease.back);
        const lastBeatHold = t < 1 ? 1 - es(t, 0.95, 1.05) : 1;
        pose(tk, { x: 710 + i * 36, y: 200, s: k, o: k > 0.01 ? lastBeatHold : 0 });
      });

      /* v40a — Jonah into the sea, into the fish */
      const drop = es(t, -0.3, 0.1, ease.in);
      pose(jonahFall, { x: 640 + drop * 60, y: WY - 30 + drop * 220, r: drop * 160, s: 0.36, o: 1 - es(t, 0.12, 0.2) });
      const rise = es(t, -0.1, 0.15);
      const gulp = bump(t, 0.02, 0.24);
      pose(fish, { x: lerp(1100, 860, rise) - FSH, y: lerp(720, 600, rise), r: -rise * 6 + es(t, 0.25, 0.4) * 6 });
      pose(jaw, { x: -520 * 0.26, y: 520 * 0.36 * 0.02, r: gulp * 24 });
      pose(win, { x: 870 - FSH, y: 598, o: es(t, 0.3, 0.42) });
      bubbles.forEach((b, i) => {
        const k = time ? ((T * 0.35 + i / 4) % 1) : (i + 0.5) / 4;
        pose(b, { x: 680 + i * 16 + Math.sin(k * 6 + i) * 8, y: 560 - k * 200, s: 0.6 + k, o: rise * (1 - k) * 0.8 });
      });

      /* v40b — the heart of the earth; the light on the third morning */
      const third = es(t, 1.85, 1.98);
      pose(tombGlow, { x: 800, y: 640, s: 0.6 + third * 0.6, o: toHill * (0.35 + third * 0.65) });
      pose(tombRays, { x: 800, y: 640, s: 0.5 + third * 0.6, r: T * 5, o: third });

      S.cam.z = 1.04;
      S.cam.y = kf2(t);
    };
  },
};
function kf2(t) { return lerp(10, 20, es(t, 0.9, 1.2)); }
