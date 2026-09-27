// J 10,14–16 — a starry night at the fold. "I know My own and My own know Me": golden threads run from Jesus to
// every sheep, and little beads of light travel both ways along them. "As the Father knows Me and I know the
// Father": a radiance comes down above (the Father only as light) and one thread joins it to Him. "I lay down My
// life for the sheep": He lies down across the gateway of the fold, as shepherds did at night, so nothing can come
// in but over Him. "Other sheep I have, not of this fold": the camera draws back — far off on the hills other folds
// with their own lamps and sheep of other colours. He rises and calls; they lift their heads and come down the
// hills; and all stand together round Him — one flock, one shepherd — inside one ring of light.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet, swing } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { grass, rock, bush } from '../../assets/nature.js';
import {
  pastureSet, foldParts, farFold, ewe, sheepRig, WOOLS, JESUS, staff, voiceRings, radiance, threads, eternityRing, drawRing, nameTag,
  hanging, kf, vis, polyAt, tr, NIGHT, PI,
} from './lib.js';

const CX = 800, GY = 640;
const HOME = [[662, 592, 0], [724, 576, 1], [878, 578, 2], [940, 594, 3], [800, 560, 4], [640, 690, 5], [966, 692, 1], [1040, 664, 0]];
const FAR = [
  { x: 440, y: 486, sc: 0.62, wool: [mix(C.wheat, C.clay, 0.3), mix(C.wheat, C.linen, 0.4), mix(C.wheat2, C.cream, 0.5)] },
  { x: 1170, y: 500, sc: 0.58, wool: [mix(C.hair2, C.stone2, 0.55), mix(C.stone2, C.hair2, 0.3), mix(C.greyHair, C.hair2, 0.3)] },
  { x: 610, y: 436, sc: 0.42, wool: [mix(C.roseRobe, C.linen, 0.5), mix(C.blushVeil, C.cream, 0.3), mix(C.roseRobe, C.cream, 0.6)] },
  { x: 1010, y: 440, sc: 0.4, wool: [mix(C.soilDark, C.hair3, 0.4), mix(C.hair3, C.stone2, 0.4), mix(C.soil, C.hair3, 0.5)] },
];
// where everyone stands in the one flock
const ONE = [[560, 684], [610, 652], [680, 694], [740, 676], [870, 684], [930, 660], [1000, 692], [1060, 668], [520, 652], [1100, 644], [650, 628], [960, 628]];

export default {
  id: 'j10-know',
  beats: [
    { v: 14 },
    { v: 15, text: 'podobnie jak Mnie zna Ojciec, a Ja znam Ojca.' },
    { v: 15, cont: true, text: 'Życie moje oddaję za owce.' },
    { v: 16, text: 'Mam także inne owce, które nie są z tej owczarni.' },
    { v: 16, cont: true, text: 'I te muszę przyprowadzić i będą słuchać głosu mego,' },
    { v: 16, cont: true, text: 'i nastanie jedna owczarnia, jeden pasterz.' },
  ],
  cam: { x: [-60, 60], y: [-120, 60], z: [0.96, 1.3] },
  build(S) {
    const c = S.c;
    const set = pastureSet(S, { skyCols: NIGHT, sunAt: [1300, 900], moonAt: [1180, 140], starsN: 110, groundY: 540, clouds: false, tintCol: C.indigo, tintK: 0.42 });
    const field = S.layer({ par: 0.45, sh: 3 });
    const ffn = c.wave(470, [7, 3], [600, 170]);
    field.add(sheet().p(c.ridge(ffn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.indigo, 0.38)).out());
    field.add(grass(c, { x0: -1200, x1: 2800, y: 470, fn: ffn, n: 60, h: 12, color: mix(C.moss, C.indigo, 0.4) }));
    // the other folds far away on the hills, each with a lamp
    const farL = S.layer({ par: 0.45, sh: 3 });
    const farEls = FAR.map((f) => farL.add(`<g transform="translate(${f.x} ${f.y})">${farFold(c, f.sc * 1.3, { wall: mix(C.rock, C.indigo, 0.35) })}</g>`));
    const lamps = FAR.map((f) => farL.add(`<g><circle r="40" fill="url(#warm-glow)"/><circle r="4" fill="${C.lampFlame}"/></g>`));
    const F = foldParts(c, { cx: CX, gy: GY, w: 470, d: 124, h: 56, gw: 92, wall: mix(mix(C.rock, C.stone2, 0.4), C.indigo, 0.3), wall2: mix(C.rock2, C.indigo, 0.3), floor: mix(mix(C.sand2, C.hillNear, 0.3), C.indigo, 0.35) });
    const fb = S.layer({ par: 0.45, sh: 4 });
    fb.add(F.floor + F.back);
    const ff = S.layer({ par: 0.45, sh: 5 });
    ff.add(F.front);
    ff.add(`<g transform="translate(${F.G.gxL} ${F.G.gateY + 2}) scale(.2 1)">${F.gate}</g>`);
    // the light of the Father above, the threads
    const up = S.layer({ par: 0.3, sh: 0, flat: true });
    const rad = up.add(`<g><circle r="170" fill="url(#halo-glow)"/>${radiance(c, 46)}</g>`);
    const thL = S.layer({ par: 0.45, sh: 0, flat: true });
    const th = threads(thL, HOME.length + 1, { color: C.halo, w: 2.2 });
    const beads = HOME.map(() => thL.add(`<g><circle r="9" fill="url(#warm-glow)"/><circle r="2.6" fill="${C.star}"/></g>`));
    const beadUp = thL.add(`<g><circle r="12" fill="url(#warm-glow)"/><circle r="3.2" fill="${C.star}"/></g>`);
    const ring = thL.add(`<g><ellipse rx="330" ry="120" fill="url(#halo-glow)" opacity=".5"/><g transform="scale(1 .36)">${eternityRing(c, 330, 9, 30, C.halo)}</g></g>`);
    const act = S.layer({ par: 0.45, sh: 5 });
    const own = HOME.map(([x, y, w], i) => ({ i, x, y, r: sheepRig(act.add(ewe(c, { wool: WOOLS[w], patch: i === 3 }))) }));
    const others = [];
    FAR.forEach((f, fi) => f.wool.forEach((wool, j) => others.push({ fi, j, f, r: sheepRig(act.add(ewe(c, { wool }))) })));
    const jStand = S.puppet(act.add(person(c, { ...JESUS, holdF: staff(c, 200, 20) })));
    const jLie = S.puppet(act.add(person(c, { ...JESUS, eyes: 'closed' })));
    const lieGlow = act.add(`<g><ellipse rx="150" ry="46" fill="url(#halo-glow)"/></g>`);
    const fx = S.layer({ par: 0.5, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: true, color: shade(C.halo, -0.05) });
    const tagO = hanging(fx, nameTag(c, tr('inne owce', 'other sheep'), { size: 18 }), { x: 1170, y: 300, len: 700 });
    const tagOne = hanging(fx, nameTag(c, [tr('jedna owczarnia,', 'one flock,'), tr('jeden pasterz', 'one shepherd')], { size: 18 }), { x: 800, y: 200, len: 700 });
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 110, 960, 220, mix(C.moss, C.night2, 0.35), mix(C.moss2, C.night2, 0.35)) + rock(c, 1480, 985, 240, 90, mix(C.rock2, C.indigo, 0.35)));

    const JX = 800, JY = 676;
    return (t, time) => {
      const T = time;
      set.sk.set(...NIGHT);
      set.update(T, { sunO: 0, glow: 0, moonY: 140 });
      /* v14 — I know mine, mine know Me: threads and beads both ways */
      const tk = es(t, 0.15, 0.5) * (1 - es(t, 2.1, 2.3)) + es(t, 5.3, 5.6) * 0;
      const hx = JX + 4, hy = JY - 120;
      /* v15a — the Father's light above, one thread up */
      const rk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.1, 2.4) * 0.6) * (1 - es(t, 3.0, 3.3));
      vis(rad, { x: 800, y: lerp(-200, 110, es(t, 1.05, 1.4, ease.out)), s: 1 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: rk });
      const tu = es(t, 1.2, 1.5) * (1 - es(t, 2.1, 2.3));
      th(HOME.length, JX + 4, JY - 196, 800, lerp(JY - 196, 150, tu), tu * 0.9);
      const bu = tu > 0.5 ? ((T * 0.5) % 1) : 0;
      vis(beadUp, { x: 800, y: lerp(JY - 196, 150, bu < 0.5 ? bu * 2 : 2 - bu * 2), o: tu > 0.5 ? 1 : 0 });
      /* v15b — He lies down across the gate */
      const lie = es(t, 2.2, 2.3) * (1 - es(t, 2.95, 3.05));
      /* v16a — pull back: the other folds; v16b — He calls; v16c — one flock */
      const call = bump(t, 4.05, 4.95);
      const come = es(t, 4.3, 5.4);
      const one = es(t, 5.05, 5.6);
      const standX = JX, standY = JY;
      jStand.set({ x: standX, y: standY, s: 1.04, flip: false, o: 1 - lie, armF: 20 + tk * 16, armB: 10 + bump(t, 0.1, 0.9) * 50 + bump(t, 1.1, 1.9) * 120 + bump(t, 3.2, 3.9) * 90 + call * 130, head: -bump(t, 1.1, 1.9) * 14 - bump(t, 3.1, 3.9) * 6, blink: blinkAt(T, 1) });
      jLie.set({ x: 896, y: 612, s: 0.96, r: -90, o: lie });
      vis(lieGlow, { x: 800, y: 626, s: 1, o: lie * 0.9 });
      rings(JX + 6, JY - 180, Math.max(bump(t, 0.05, 0.95) * 0.7, call), T, { s0: 0.8, spread: call > 0.1 ? 3.4 : 1.6 });
      own.forEach((m, i) => {
        let [x, y] = [m.x, m.y];
        // in the one flock they gather in front
        const g = es(t, 5.05 + i * 0.03, 5.5 + i * 0.03);
        if (g > 0) { const [ox, oy] = ONE[i % ONE.length]; x = lerp(x, ox, g); y = lerp(y, oy, g); }
        const look = es(t, 0.2 + i * 0.05, 0.45 + i * 0.05);
        const sleep = lie * (i % 2 ? 1 : 0.5);
        m.r.set({ x, y, s: y > 640 ? 0.92 : 0.84, flip: x > JX, head: -look * 16 * (1 - sleep) + sleep * 24, hop: g > 0 && g < 1 ? Math.abs(Math.sin(T * 12 + i)) * 3 : 0 });
        m.cx = x; m.cy = y;
        // the thread to each sheep
        const o = tk * 0.75;
        const sx = x + (x > JX ? -24 : 24) * 0.9, sy = y - 40;
        th(i, hx, hy, sx, sy, o);
        const ph = T ? ((T * 0.45 + i * 0.37) % 1) : 0.5;
        const u = ph < 0.5 ? ph * 2 : 2 - ph * 2;
        vis(beads[i], { x: lerp(hx, sx, u), y: lerp(hy, sy, u), o: tk > 0.5 ? 1 : 0 });
      });
      // the far folds' lamps, and their sheep coming down
      const zoomOut = es(t, 3.05, 3.5);
      FAR.forEach((f, fi) => vis(lamps[fi], { x: f.x + 28 * f.sc, y: f.y - 40 * f.sc, s: 0.6 + zoomOut * 0.4, o: zoomOut * (1 - one * 0.7) }));
      farEls.forEach((el) => fade(el, 1 - es(t, 5.3, 5.8)));
      others.forEach((m, k) => {
        const f = m.f;
        const hx0 = f.x + (m.j - 1) * 26 * f.sc, hy0 = f.y - 8 * f.sc;
        const [ox, oy] = ONE[(k + 8) % ONE.length];
        const tx = ox + (k % 3) * 14 - 14, ty = oy + ((k * 7) % 3) * 8;
        const cm = es(t, 4.3 + m.fi * 0.08 + m.j * 0.04, 5.4 + m.fi * 0.05);
        const x = lerp(hx0, tx, cm), y = lerp(hy0, ty, cm);
        const s = lerp(f.sc * 0.62, 0.9, cm);
        const hear = es(t, 4.1, 4.3);
        m.r.set({ x, y, s, flip: tx < hx0, head: -hear * 18 + (1 - hear) * 20 * (m.j % 2), hop: cm > 0 && cm < 1 ? Math.abs(Math.sin(T * 12 + k)) * 3 * s : 0 });
      });
      const ok = es(t, 3.2, 3.5, ease.out) * (1 - es(t, 4.1, 4.3, ease.in));
      swing(tagO, 1100, 300 - (1 - ok) * 700, ok > 0.001 ? T : 0, 1.2, 0.8);
      fade(tagO, ok > 0.001 ? 1 : 0);
      const onek = es(t, 5.3, 5.6, ease.out);
      swing(tagOne, 800, 200 - (1 - onek) * 700, onek > 0.001 ? T : 0, 1.2, 0.8, 1);
      fade(tagOne, onek > 0.001 ? 1 : 0);
      vis(ring, { x: 800, y: 690, o: one > 0.01 ? 1 : 0 });
      drawRing(ring, es(t, 5.2, 5.8));
      S.cam.x = kf(t, [[0, 0], [2, 0], [3, 0]]);
      S.cam.y = kf(t, [[0, 20], [1, -60], [2, 10], [3, 20], [3.5, -40], [5, -10], [6, -20]]);
      S.cam.z = kf(t, [[0, 1.26], [1, 1.12], [2, 1.26], [3, 1.22], [3.5, 0.98], [5, 1.0], [6, 1.06]]);
    };
  },
};
