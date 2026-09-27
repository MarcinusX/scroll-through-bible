// J 10,27–30 — a winter night on the snowy hills, stars above, snow falling. "My sheep hear My voice and I know
// them" — the sheep lift their heads and their little name tags shine; "they follow Me" — they walk after Him,
// leaving small tracks in the snow. "I give them eternal life" — a small light kindles over each. "They will never
// perish" — a cold dark gust sweeps across, and the lights do not go out. "No one will snatch them out of My hand" —
// a great cupped hand of light holds the flock above; a shadow hand reaches and falls back. "My Father, who gave
// them to Me, is greater than all" — a vast radiance rises behind, larger than the hills. "No one can snatch them out
// of the Father's hand" — the radiance closes round the hand like a greater hand of light; the shadow shrinks away.
// "I and the Father are one" — the two lights draw together into one.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { stars } from '../../assets/nature.js';
import {
  ewe, sheepRig, WOOLS, nameOf, JESUS, voiceRings, lightHand, shadowHand, radiance, eternityRing, drawRing, soulLight, word, snowCap,
  sky, kf, vis, polyAt, tr, WINTER_NIGHT, SNOW, SNOW2, PI,
} from './lib.js';

const F = 690;
const SH = [[560, 700], [630, 716], [700, 704], [940, 706], [1010, 716], [1080, 700]];
const MINI = [[-60, -40], [-24, -46], [12, -44], [48, -40], [-40, -26], [30, -24]];

export default {
  id: 'j10-hand',
  beats: [
    { v: 27, text: 'Moje owce słuchają mego głosu, a Ja znam je.' },
    { v: 27, cont: true, text: 'Idą one za Mną' },
    { v: 28, text: 'i Ja daję im życie wieczne.' },
    { v: 28, cont: true, text: 'Nie zginą one na wieki' },
    { v: 28, cont: true, text: 'i nikt nie wyrwie ich z mojej ręki.' },
    { v: 29, text: 'Ojciec mój, który Mi je dał, jest większy od wszystkich.' },
    { v: 29, cont: true, text: 'I nikt nie może ich wyrwać z ręki mego Ojca.' },
    { v: 30 },
  ],
  cam: { x: [-60, 60], y: [-140, 40], z: [0.96, 1.25] },
  build(S) {
    const c = S.c;
    const sk = sky(S, WINTER_NIGHT);
    const starL = S.layer({ par: 0.02, sh: 0, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 140 }));
    // snowy hills
    const far = S.layer({ par: 0.1, sh: 2 });
    const hf = c.wave(470, [26, 9], [1000, 300]);
    far.add(sheet().p(c.ridge(hf, -1400, 3000, 1800, 14, 1), mix(SNOW2, C.indigo, 0.45)).out());
    const mid = S.layer({ par: 0.25, sh: 3 });
    const hm = c.wave(560, [18, 7], [800, 240]);
    mid.add(sheet().p(c.ridge(hm, -1400, 3000, 1800, 12, 1), mix(SNOW2, C.indigo, 0.3)).out());
    let pines = '';
    for (let i = 0; i < 24; i++) { const x = c.rr(-700, 2300); const y = hm(x) + c.rr(4, 16), h = c.rr(26, 44); pines += c.cut([[x - h * 0.3, y], [x, y - h], [x + h * 0.3, y]], 0.4, 4); }
    mid.add(`<path d="${pines}" fill="${mix(C.moss2, C.night2, 0.55)}"/>`);
    // the greater light (behind everything near)
    const bigL = S.layer({ par: 0.3, sh: 0, flat: true });
    const big = bigL.add(`<g><circle r="560" fill="url(#halo-glow)"/><g opacity=".9">${radiance(c, 250)}</g></g>`);
    const ground = S.layer({ par: 0.45, sh: 4 });
    const gf = c.wave(640, [6, 2], [700, 180]);
    ground.add(sheet().p(c.ridge(gf, -1400, 3000, 1800, 12, 1), mix(SNOW, C.indigo, 0.16)).out());
    let drifts = '';
    for (let i = 0; i < 20; i++) { const x = c.rr(-900, 2500), y = c.rr(660, 900); drifts += c.cut(c.blob(x, y, c.rr(40, 120), c.rr(5, 10), 12, 0.3), 0.6, 8); }
    ground.add(`<path d="${drifts}" fill="${mix(SNOW2, C.indigo, 0.25)}" opacity=".7"/>`);
    // tracks in the snow
    const tracks = [];
    for (let i = 0; i < 16; i++) tracks.push(ground.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 4.5, 2.2, 10), 0.2, 3)}" fill="${mix(SNOW2, C.indigo, 0.45)}"/></g>`));
    // the hand of light (hung above), mini flock in it, the shadow hand
    const handL = S.layer({ par: 0.4, sh: 5 });
    const shadowR = handL.add(`<g>${shadowHand(c, mix('#241d33', C.indigo, 0.2))}</g>`);
    const handEl = handL.add(`<g>${lightHand(c, { w: 330 })}</g>`);
    const mini = MINI.map(([x, y], i) => ({ x, y, el: handL.add(`<g>${ewe(c, { wool: WOOLS[i] })}</g>`) }));
    const oneL = S.layer({ par: 0.4, sh: 0, flat: true });
    const merged = oneL.add(`<g><circle r="260" fill="url(#halo-glow)"/><circle r="120" fill="url(#warm-glow)"/></g>`);
    const ring = oneL.add(`<g>${eternityRing(c, 250, 8, 32, C.halo)}</g>`);
    // the flock and Jesus
    const act = S.layer({ par: 0.5, sh: 5 });
    const flock = SH.map(([x, y], i) => ({ i, x, y, r: sheepRig(act.add(ewe(c, { wool: WOOLS[i], tag: nameOf(i), patch: i === 1 }))) }));
    const lights = SH.map(() => act.add(`<g>${soulLight(c, 7)}</g>`));
    const jesus = S.puppet(act.add(person(c, JESUS)));
    const fx = S.layer({ par: 0.55, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: true, color: shade(C.halo, -0.05) });
    const one = fx.add(`<g>${word(c, tr('jedno', 'one'), { size: 30, fill: '#2a2e5a', ink: C.halo })}</g>`);
    // cold gust and falling snow (sheets slid on the compositor)
    const gust = S.layer({ par: 0.6, sh: 0, flat: true, pad: 1400 });
    let gd = '';
    for (let i = 0; i < 26; i++) { const x = c.rr(-600, 600), y = c.rr(200, 800), w = c.rr(120, 320); gd += c.cut([[x, y], [x + w * 0.5, y - 5], [x + w, y], [x + w * 0.5, y + 4]], 0.4, 12); }
    gust.add(`<rect x="-3000" y="-600" width="6000" height="2400" fill="#1d2146" opacity=".3"/><path d="${gd}" fill="${SNOW2}" opacity=".7"/>`);
    const snowL = S.layer({ par: 0.7, sh: 0, flat: true, pad: 320 });
    let fl = '';
    for (let i = 0; i < 160; i++) fl += c.poly(c.circ(c.rr(-1200, 2800), c.rr(-900, 1600), c.rr(2, 4.5), 6));
    snowL.add(`<path d="${fl}" fill="#fff" opacity=".85"/>`);

    return (t, time) => {
      const T = time;
      sk.set(...WINTER_NIGHT);
      snowL.shift(Math.sin(T * 0.4) * 30, ((T * 40) % 300) - 150);
      /* v27a — they hear His voice; He knows them (their names shine) */
      const talk = Math.max(bump(t, 0.05, 0.95), bump(t, 2.05, 2.9), bump(t, 4.05, 4.9), bump(t, 7.05, 7.95));
      const walk = es(t, 1.08, 1.9);
      const jx = lerp(700, 800, walk);
      /* v28b — the cold gust */
      const gk = es(t, 3.05, 3.9);
      gust.shift(lerp(-1400, 1600, gk), 0);
      gust.fade(bump(t, 3.05, 3.95));
      /* v28c … v30 — the hand, the greater light, one */
      const hk = es(t, 4.1, 4.45, ease.out);
      const HX = 800, HY = 330 - (1 - hk) * 700;
      vis(handEl, { x: HX, y: HY, o: hk > 0.001 ? 1 : 0 });
      mini.forEach((m, i) => vis(m.el, { x: HX - 10 + m.x * 1.1, y: HY + m.y + 40, s: 0.5, sx: i % 2 ? -1 : 1, o: hk > 0.001 ? 1 : 0 }));
      const reach1 = bump(t, 4.35, 4.95), reach2 = bump(t, 6.1, 6.7) * (1 - es(t, 6.4, 6.7));
      const rch = Math.max(reach1, reach2 * 0.8);
      vis(shadowR, { x: lerp(1500, 1130, rch), y: HY + 10, sx: -1, o: rch > 0.01 ? 0.85 * (1 - es(t, 6.35, 6.7)) + (t < 6 ? 0.15 * 0 : 0) : 0 });
      const bg = es(t, 5.1, 5.7, ease.out);
      vis(big, { x: 800, y: 330, s: 0.4 + bg * 0.55 - es(t, 7.1, 7.8) * 0.3, o: bg });
      const close = es(t, 6.05, 6.5);
      vis(ring, { x: HX, y: HY, s: lerp(1.5, 1, close) - es(t, 7.1, 7.7) * 0.3, o: close > 0.01 ? 1 - es(t, 7.4, 7.8) : 0 });
      drawRing(ring, close);
      const mk = es(t, 7.2, 7.7);
      vis(merged, { x: 800, y: 330, s: 0.6 + mk * 0.6, o: mk });
      const ok = es(t, 7.45, 7.7, ease.back);
      vis(one, { x: 800, y: 440, s: ok, o: ok > 0.01 ? 1 : 0 });
      jesus.set({ x: jx, y: F + 6, s: 1.08, flip: false, walk: walk > 0 && walk < 1 ? jx * 0.07 : undefined, armF: 14 + talk * 20 + hk * 30 * (1 - mk) + mk * 20, armB: 10 + bump(t, 0.1, 0.9) * 60 + hk * 110 + mk * 30, head: -hk * 12 - mk * 4, blink: blinkAt(T, 1) });
      rings(jx + 6, F - 178, talk * 0.9, T, { s0: 0.8, spread: 1.8 });
      flock.forEach((m, i) => {
        const hear = es(t, 0.15 + i * 0.05, 0.4 + i * 0.05);
        const fol = es(t, 1.1 + i * 0.04, 1.95);
        // following: those on the left fall in behind Him, those on the right come round
        const tx = [600, 660, 720, 880, 940, 1000][i], ty = [712, 726, 708, 712, 726, 708][i];
        const x = lerp(m.x - 80, tx, fol), y = lerp(m.y, ty, fol);
        const gather = es(t, 4.2, 4.8);
        const gx = lerp(x, x + (800 - x) * 0.25, gather);
        const bent = bump(t, 3.2, 3.9);
        m.r.set({ x: gx, y, s: 0.9, flip: gx > jx, head: -hear * 16 + bent * 20, hop: fol > 0 && fol < 1 ? Math.abs(Math.sin(T * 12 + i)) * 3 : 0, tag: es(t, 0.35 + i * 0.06, 0.55 + i * 0.06) * (1 - es(t, 1.9, 2.1)) });
        const lk = es(t, 2.2 + i * 0.07, 2.45 + i * 0.07);
        vis(lights[i], { x: gx + (gx > jx ? -14 : 14), y: y - 78 + (T ? Math.sin(T * 2 + i) * 3 : 0), s: 0.9 + lk * 0.3 - bent * 0.1, o: lk });
      });
      tracks.forEach((el, k) => {
        const i = k % 6, n = Math.floor(k / 6);
        const fol = es(t, 1.1 + i * 0.04, 1.95);
        const x = lerp(SH[i][0] - 80, [600, 660, 720, 880, 940, 1000][i], Math.min(1, (n + 1) / 3)) - 20;
        const y = lerp(SH[i][1], [712, 726, 708, 712, 726, 708][i], Math.min(1, (n + 1) / 3)) + 2;
        pose(el, { x, y, o: fol > (n + 1) / 3 ? 0.8 : 0 });
      });
      S.cam.x = kf(t, [[0, -40], [1, -30], [2, 0]]);
      S.cam.y = kf(t, [[0, 20], [2, 20], [3, 10], [4, -20], [4.6, -110], [5.6, -130], [7, -110], [8, -60]]);
      S.cam.z = kf(t, [[0, 1.18], [2, 1.12], [3, 1.16], [4, 1.06], [5.6, 0.98], [7, 1.0], [8, 1.06]]);
    };
  },
};
