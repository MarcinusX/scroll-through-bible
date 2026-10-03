// Łk 5,6–7 — under the translucent water the net hangs from its floats; and from every side silver fish come
// streaming in, a whole shoal pouring into the mesh, till the bag bulges and the surface boils with leaping fish.
// Simon and Andrew haul on it and the boat heels over — and the net begins to tear: strands snap, a few fish slip
// out. Andrew turns and waves both arms to the partners in the other boat far off; James and John wave back and row
// over. Between the two boats they heave the net up: silver heaps rise in both boats, and both boats settle lower and
// lower till the water nearly laps over the gunwales.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, flock } from '../kit.js';
import { bird } from '../../assets/things.js';
import {
  deepSet, DP, CREW_A, sunkNet, heavyNet, snapped, silverFish, splashCrown, oar, withFace, faceBits, headAt, hand, kf, GLYPH, speech,
  PETER_W, JAMES_W, MORNING, es, ease, bump, seg, fade, PI,
} from './lib.js';

const NX = DP.NX, NW = DP.NW, NET_L = NX - NW;          // the net spans NET_L … NX under the surface
const BFAR_L = { x: 40, y: DP.WL - 28, s: 0.6 };       // the partners' boat, far off
const BNEAR_L = { x: DP.BX, y: DP.AY, s: 0.9 };

export default {
  id: 'lk5-catch',
  beats: [
    { v: 6, text: 'Skoro to uczynili, zagarnęli tak wielkie mnóstwo ryb,' },
    { v: 6, cont: true, text: 'że sieci ich zaczynały się rwać.' },
    { v: 7, text: 'Skinęli więc na wspólników w drugiej łodzi, żeby im przyszli z pomocą.' },
    { v: 7, cont: true, text: 'Ci podpłynęli; i napełnili obie łodzie, tak że się prawie zanurzały.' },
  ],
  cam: { x: [-760, 0], y: [60, 200], z: [0.92, 1.2] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: the partners' boat waits and comes alongside nearer, so both boats share the screen
    const BFAR = PH ? { ...BFAR_L, x: 330 } : BFAR_L, BNEAR = PH ? { ...BNEAR_L, x: 420 } : BNEAR_L;
    const D = deepSet(S, {
      skyCols: MORNING, deep: 1, heaps: true,
      crewA: [
        { k: 'andrew', markup: withFace(person(c, CAST.andrew), faceBits(c)), x: CREW_A.andrew, dy: -8, s: 0.94 },
        { k: 'peter', markup: withFace(person(c, PETER_W), faceBits(c)), x: CREW_A.peter, dy: -8, s: 0.96 },
        { k: 'jesus', o: { ...CAST.jesus, pose: 'sit' }, x: CREW_A.jesus, dy: -34, s: 1.0 },
      ],
      crewB: [
        { k: 'john', o: CAST.john, x: -80, dy: -8, s: 0.94 },
        { k: 'james', o: JAMES_W, x: 40, dy: -8, s: 0.96 },
      ],
    });
    const { K, A, B, uwL, fx } = D;

    /* under the water: the net (empty → bursting), the shoal pouring in */
    const netE = uwL.add(`<g>${sunkNet(c, { w: NW, h: 150 })}</g>`);
    const netF = uwL.add(`<g>${heavyNet(c, { w: NW, h: 172, n: 64 })}</g>`);
    const shoal = Array.from({ length: 30 }, (_, i) => {
      const side = i % 3 === 0 ? 0 : i % 3 === 1 ? -1 : 1;
      const from = side < 0 ? [c.rr(-500, -100), c.rr(600, 780)] : side > 0 ? [c.rr(1100, 1500), c.rr(620, 800)] : [c.rr(NET_L, NX), c.rr(820, 900)];
      const to = [c.rr(NET_L + 30, NX - 30), c.rr(DP.WL + 26, DP.WL + 150)];
      return { i, from, to, d: c.rr(0, 0.35), el: uwL.add(`<g>${silverFish(c, i, c.rr(0.8, 1.05))}</g>`), seed: c.rr(0, 6) };
    });
    const escape = Array.from({ length: 5 }, (_, i) => ({ i, at: [c.rr(NET_L + 40, NX - 40), DP.WL + c.rr(110, 150)], dx: c.rr(-1, 1) * 160, el: uwL.add(`<g>${silverFish(c, i + 3, 0.9)}</g>`) }));
    const snaps = [[NET_L + 60, 128], [NET_L + 150, 162], [NX - 50, 120]].map(([x, y], i) => ({ i, x, y: DP.WL + y, el: uwL.add(`<g>${snapped(c)}</g>`) }));

    /* the oars of the partners' boat */
    const oarL = S.layer({ par: 0.5, sh: 3 });
    const oars = [0, 1].map(() => oarL.add(`<g>${oar(c, 150)}</g>`));

    /* at the surface: leaping fish, splashes, the strain */
    const leap = Array.from({ length: 10 }, (_, i) => ({ i, a: c.rr(0, 1), x: c.rr(NET_L + 10, NX - 10), h: c.rr(40, 100), el: fx.add(`<g>${silverFish(c, i, 0.9)}</g>`) }));
    const splashes = [0, 1, 2, 3].map(() => fx.add(`<g>${splashCrown(c, 20, 0)}</g>`));
    const bangs = [0, 1].map(() => fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40 })}</g>`));
    const waveMarks = [0, 1, 2].map(() => fx.add(`<path d="${c.ribbon(c.arc(0, 0, 26, 26, -0.6, 0.6, 8), 4)}" fill="${C.terracotta}"/>`));
    const rimSplash = [0, 1, 2, 3].map(() => fx.add(`<g>${splashCrown(c, 16, 0)}</g>`));
    const gullL = S.layer({ par: 0.3, sh: 4 });
    const gulls = flock(S, gullL, 5, (cc) => bird(cc, { color: C.birdLight, belly: C.cream }), { y: 260, spread: 120, speed: 50, x0: -700, x1: 1500, scale: 0.55 });
    const faces = (k) => A.crew[k].p.el.querySelector('[data-part="sad"]');
    const pSad = faces('peter'), aSad = faces('andrew');

    return (t, time) => {
      const T = time;
      K.idle(T, { sunY: 130 });
      D.water(T, 1, 0.52);
      gulls(T, es(t, 0.4, 0.9));

      /* the boats: A heels toward the net, B comes over; both settle lower as they fill */
      const haul = es(t, 0.5, 1.0) * (1 - es(t, 3.3, 3.6));
      const tear = es(t, 1.05, 1.4);
      const fill = es(t, 3.2, 3.85);
      const sinkY = fill * 44;
      const rockA = Math.sin(T * 1.1) * 0.8 - haul * (3 + tear * 3) + (T ? Math.sin(T * 3) * haul * 0.8 : 0);
      const BA = { x: DP.AX, y: DP.AY + Math.sin(T * 1.2) * 2 + haul * 4 + sinkY, s: 1, r: rockA };
      A.set(BA);
      const come = es(t, 2.55, 3.35, ease.sine);
      const BB = { x: lerp(BFAR.x, BNEAR.x, come), y: lerp(BFAR.y, BNEAR.y, come) + Math.sin(T * 1.3 + 1) * 2 + sinkY, s: lerp(BFAR.s, BNEAR.s, come), r: Math.sin(T * 0.9 + 2) * 0.8 + fill * 2 };
      B.set(BB);
      A.fill(BA, fill);
      B.fill(BB, fill);

      /* v6a — the shoal streams in */
      shoal.forEach((f) => {
        const k = es(t, 0.02 + f.d, 0.62 + f.d, ease.out);
        const x = lerp(f.from[0], f.to[0], k) + (T ? Math.sin(T * 2 + f.seed) * 8 * k : 0);
        const y = lerp(f.from[1], f.to[1], k) + (T ? Math.cos(T * 1.7 + f.seed) * 5 : 0);
        const dir = f.to[0] > f.from[0] ? 1 : -1;
        pose(f.el, { x, y, s: 1, sx: k < 0.95 ? dir : (f.i % 2 ? 1 : -1), r: (f.to[1] - f.from[1]) * 0.05 * dir * (1 - k), o: seg(t, f.d, f.d + 0.06) * (1 - es(t, 0.78, 0.92)) });
      });
      const full = es(t, 0.7, 0.9);
      const up = es(t, 3.25, 3.75);
      pose(netE, { x: NET_L, y: DP.WL + 2, o: 1 - full });
      pose(netF, { x: NET_L, y: DP.WL + 2 - up * 70, sy: 1 - up * 0.5, o: full * (1 - es(t, 3.5, 3.8)) });

      /* v6b — the net tears: strands snap, fish slip out */
      snaps.forEach((sn) => { const k = es(t, 1.1 + sn.i * 0.12, 1.3 + sn.i * 0.12, ease.back); pose(sn.el, { x: sn.x, y: sn.y - up * 70, s: k * 1.2, r: sn.i * 30, o: k > 0.01 ? 1 - es(t, 3.4, 3.7) : 0 }); });
      escape.forEach((f) => {
        const k = es(t, 1.2 + f.i * 0.08, 1.9 + f.i * 0.08, ease.out);
        pose(f.el, { x: f.at[0] + k * f.dx, y: f.at[1] + k * 60, sx: f.dx > 0 ? 1 : -1, r: 20 * (f.dx > 0 ? 1 : -1), o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });

      /* at the surface over the net: the water boils with leaping fish */
      const boil = es(t, 0.45, 0.7) * (1 - es(t, 3.3, 3.6));
      leap.forEach((f) => {
        const k = ((t * 1.3 + f.a + (T ? T * 0.3 : 0)) % 1);
        pose(f.el, { x: f.x + k * 30, y: DP.WL - 4 - Math.sin(k * PI) * f.h, sx: f.i % 2 ? 1 : -1, r: lerp(-50, 50, k) * (f.i % 2 ? 1 : -1), s: 0.9, o: boil * (k < 0.93 ? 1 : 0) });
      });
      splashes.forEach((sp, i) => { const k = ((T * 0.9 + i / 4) % 1); pose(sp, { x: NET_L + 40 + i * 70, y: DP.WL - 2, s: 0.6 + k * 0.6, o: boil * (1 - k) }); });

      /* the crew */
      const signal = es(t, 2.05, 2.25) * (1 - es(t, 3.05, 3.2));
      const wave = T ? Math.sin(T * 7) : 0;
      const heave = bump(t, 3.2, 3.8);
      A.put('andrew', BA, { flip: signal < 0.5 ? true : true, armF: 40 + haul * 40 + signal * (70 + wave * 20) + heave * 60, armB: 30 + haul * 30 + signal * (130 + wave * 20) + heave * 50, lean: haul * (8 - signal * 8) - heave * 8, head: haul * 8 * (1 - signal) - signal * 10, blink: blinkAt(T, 2) });
      A.put('peter', BA, { flip: true, armF: 40 + haul * 45 + heave * 60, armB: 30 + haul * 35 + heave * 50, lean: haul * 12 - heave * 8, head: haul * 12 - heave * 8, blink: blinkAt(T, 3) });
      fade(pSad, tear * (1 - es(t, 3.4, 3.7)) * 0.8);
      fade(aSad, tear * (1 - es(t, 2.0, 2.2)) * 0.8);
      A.put('jesus', BA, { flip: true, armF: 20 + bump(t, 0.1, 0.8) * 20, armB: 12, head: 6 + haul * 4, blink: blinkAt(T) });
      const answer = es(t, 2.3, 2.5) * (1 - es(t, 2.7, 2.9));
      const row = seg(t, 2.55, 3.35);
      const stroke = row > 0 && row < 1 ? Math.sin(row * PI * 6) : 0;
      B.put('james', BB, { flip: false, armF: 40 + answer * 110 + stroke * 20 + heave * 60, armB: 30 + answer * 140 + stroke * 20 + heave * 50, lean: -stroke * 5 + heave * 8, head: -answer * 6, blink: blinkAt(T, 4) });
      B.put('john', BB, { flip: false, armF: 50 + stroke * 30 + heave * 60, armB: 40 + stroke * 20 + heave * 50, lean: -stroke * 6 + heave * 8, head: 4, blink: blinkAt(T, 5) });
      oars.forEach((o, i) => {
        const [x, y] = hand(...B.at(BB, i ? 40 : -80, -8), 0.95 * BB.s, false, 50 + stroke * 30);
        pose(o, { x, y, s: BB.s, sx: -1, r: -150 - stroke * 14, o: row > 0 && row < 1 ? 1 : es(t, 2.5, 2.55) * (1 - es(t, 3.35, 3.4)) });
      });
      // the strain: exclamation marks over the haulers (v6b)
      bangs.forEach((b, i) => {
        const k = es(t, 1.15 + i * 0.12, 1.35 + i * 0.12, ease.back) * (1 - es(t, 1.9, 2.0));
        const [hx, hy] = headAt(...A.at(BA, i ? CREW_A.peter : CREW_A.andrew, -8), 0.95, true);
        pose(b.el || b, { x: hx - 10, y: hy - 40, s: k * 0.9, r: T ? Math.sin(T * 10 + i) * 6 : 0, o: k > 0.01 ? 1 : 0 });
      });
      // the signal: little arcs fly from Andrew's hands toward the far boat
      waveMarks.forEach((m, i) => {
        const k = ((T * 0.8 + i / 3) % 1);
        const [ax, ay] = headAt(...A.at(BA, CREW_A.andrew, -8), 0.95, true);
        pose(m, { x: lerp(ax - 40, BB.x + 80, k), y: ay - 30 - Math.sin(k * PI) * 40, s: 0.8 + k * 0.4, sx: -1, o: signal * (1 - k) });
      });
      // the water laps at the gunwales as they sink
      rimSplash.forEach((sp, i) => {
        const k = ((T * 1.1 + i / 4) % 1);
        const bb = i < 2 ? BA : BB, rig = i < 2 ? A : B;
        const [x, y] = rig.at(bb, (i % 2 ? 1 : -1) * 150, -14);
        pose(sp, { x, y, s: 0.5 + k * 0.5, o: fill * (1 - k) });
      });

      S.cam.x = kf(t, PH ? [[0, -240], [1.0, -260], [2.0, -380], [2.5, -480], [3.0, -470], [3.5, -370], [4, -350]] : [[0, -320], [1.0, -340], [2.0, -420], [2.5, -700], [3.0, -680], [3.5, -500], [4, -470]]);
      S.cam.y = kf(t, [[0, 170], [1.0, 180], [2.0, 150], [3.2, 120], [4, 110]]);
      S.cam.z = kf(t, PH ? [[0, 1.12], [1.0, 1.16], [2.0, 1.04], [2.5, 0.93], [3.0, 0.94], [3.4, 1.0], [4, 1.06]] : [[0, 1.12], [1.0, 1.16], [2.0, 1.1], [3.2, 1.04], [4, 1.06]]);   // phone: a little wider while He signals, both boats and Jesus in
    };
  },
};
