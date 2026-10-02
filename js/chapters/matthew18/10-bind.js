// Mt 18,18–19 — two floors of the theatre: on the ground, a terrace above the lake where Jesus teaches the
// disciples; overhead, heaven's floor of cloud with the Father's light (only light, never a figure). Peter ties the
// two ends of a cord in a knot — and up in heaven a golden cord ties itself into a knot of light. Andrew unties a
// knot in his cord — and above, the golden knot comes loose and its ends float free. If two of you agree: John and
// James kneel side by side, their hands joined; two small lights rise from them, meet and go up as one into the
// Father's light, and a golden gift comes down into their hands.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, cloud, olive, rock, grass } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { DAY, fatherLight, lightKnot, spark, kf, hand, PI } from './lib.js';

const P = 0.45, GY = 704;
const PX = 600, AX = 1010;            // Peter (ties), Andrew (unties)
const HY = 300;                        // the golden cords in heaven

/** one half of a cord, from the knot (0,0) out to the side, ending in a little tassel */
function cordHalf(c, side, col, len = 64, w = 5) {
  const pts = c.qbez([0, 0], [side * len * 0.5, -6], [side * len, 4], 12);
  const s = sheet().p(c.ribbon(pts, w), col);
  s.p(c.cut([[side * len, 0], [side * (len + 10), 10], [side * (len + 2), 14], [side * (len - 6), 8]], 0.2, 3), shade(col, -0.15));
  return s.out();
}
function knotBlob(c, col, r = 7) { return sheet().p(c.cut(c.blob(0, 0, r, r * 0.8, 9, 0.2), 0.3, 3), shade(col, -0.18)).x(c.ribbon(c.arc(0, 0, r * 0.6, r * 0.5, 0.4, 2.6, 6), 1.4), shade(col, 0.2)).out(); }

export default {
  id: 'mt18-bind',
  beats: [
    { v: 18, text: 'Zaprawdę, powiadam wam: Wszystko, co zwiążecie na ziemi, będzie związane w niebie,' },
    { v: 18, cont: true, text: 'a co rozwiążecie na ziemi, będzie rozwiązane w niebie.' },
    { v: 19 },
  ],
  cam: { x: [-60, 60], y: [-30, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfdcd9', '#efe6cf', '#f6e7cc']);
    const glow = sky(S, ['#f3e2b4', '#f6ead0', '#f6e7cc'], { name: 'glow' }).layer;
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 480, amps: [14, 6, 2], lens: [1000, 340, 120], color: C.hillFar }).markup);
    S.layer({ par: 0.16, sh: 2 }).add(waterBand(c, { y: 512, color: C.lake, foamN: 18 }).markup);
    const G = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(600, [5, 2], [700, 160]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sage2, 0.4)).out() + olive(c, 260, 606, 0.9) + olive(c, 1380, 610, 0.85) + rock(c, 1180, 640, 60, 20));
    G.add(grass(c, { x0: -600, x1: 2200, y: 600, fn: gfn, n: 30, h: 12, color: C.olive }));

    /* heaven: a bank of cloud across the top, the light in the middle, golden cords */
    const hv = S.layer({ par: 0.12, sh: 3, rise: 0 });
    const light = hv.add(`<g>${fatherLight(c, 44)}</g>`);
    let bank = '';
    [[330, 336, 260], [560, 350, 240], [800, 344, 300], [1040, 350, 240], [1270, 336, 260], [120, 322, 220], [1480, 322, 220]].forEach(([x, y, w]) => { bank += `<g transform="translate(${x} ${y})">${cloud(c, w)}</g>`; });
    hv.add(`<g>${bank}</g>`);
    const gold = mix(C.sun, C.haloRim, 0.3);
    const HX = [PX, S.portrait ? 975 : AX];   // phone: heaven's loosened cord stays clear of the edge and the thread
    const hL = HX.map((x) => ({ x, l: hv.add(`<g>${cordHalf(c, -1, gold)}</g>`), r: hv.add(`<g>${cordHalf(c, 1, gold)}</g>`), knot: hv.add(`<g opacity="0"><g transform="scale(.7)">${lightKnot(c, 22)}</g></g>`) }));
    const thread = S.layer({ par: 0.3, sh: 1, flat: true });
    const lines = HX.map((x) => thread.add(`<g opacity="0"><path d="${c.ribbon([[x, HY + 26], [x, 540]], 2)}" fill="${C.haloRim}" opacity=".6"/></g>`));

    /* the disciples and Jesus */
    const L = S.layer({ par: P, sh: 5 });
    // phone: the two listeners stand inside the screen
    const others = [[S.portrait ? 528 : 470, CAST.thomas, false], [S.portrait ? 1064 : 1130, CAST.matthew, true]].map(([x, o, flip], i) => ({ x, flip, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))) }));
    const jesus = S.puppet(L.add(person(c, CAST.jesus)));
    const peter = S.puppet(L.add(person(c, CAST.peter)));
    const andrew = S.puppet(L.add(person(c, CAST.andrew)));
    const johnK = S.puppet(L.add(person(c, { ...CAST.john, pose: 'kneel' })));
    const jamesK = S.puppet(L.add(person(c, { ...CAST.james, pose: 'kneel' })));
    const eL = [PX, AX].map(() => ({ l: L.add(`<g>${cordHalf(c, -1, C.rope, 56, 6)}</g>`), r: L.add(`<g>${cordHalf(c, 1, C.rope, 56, 6)}</g>`), knot: L.add(`<g opacity="0">${knotBlob(c, C.rope, 11)}</g>`) }));

    /* the prayer lights and the gift */
    const fx = S.layer({ par: P, sh: 3 });
    const prayers = [0, 1].map(() => fx.add(`<g opacity="0"><circle r="26" fill="url(#halo-glow)"/>${spark(c, 9)}</g>`));
    const gift = fx.add(`<g opacity="0"><circle r="40" fill="url(#halo-glow)"/>${spark(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      glow.fade(es(t, 2.2, 2.6) * 0.7);
      pose(light, { x: 800, y: 196, r: T * 3, s: 1 + es(t, 2.3, 2.6) * 0.25 });

      /* v18a — Peter ties; heaven ties. v18b — Andrew unties; heaven unties */
      const tie = es(t, 0.2, 0.5), untie = es(t, 1.2, 1.5);
      const k = [tie, 1 - untie];
      const hk = [es(t, 0.4, 0.7), 1 - es(t, 1.4, 1.7)];
      const [px, py] = hand(PX, GY, 0.92, false, 80);
      const [ax, ay] = hand(AX, GY, 0.92, true, 80);
      [[px + 6, py - 4], [ax - 6, ay - 4]].forEach(([x, y], i) => {
        const e = eL[i], kk = k[i];
        pose(e.l, { x: x - (1 - kk) * 30, y, r: (1 - kk) * 24 });
        pose(e.r, { x: x + (1 - kk) * 30, y, r: -(1 - kk) * 24 });
        pose(e.knot, { x, y, s: kk, o: kk > 0.02 ? 1 : 0 });
        const h = hL[i], hh = hk[i];
        const float = i === 1 ? es(t, 1.5, 1.9) : 0;
        const fw = S.portrait ? 12 : 30;
        pose(h.l, { x: h.x - (1 - hh) * 36 - float * fw, y: HY - float * 20, r: (1 - hh) * 26 + float * 20 });
        pose(h.r, { x: h.x + (1 - hh) * 36 + float * fw, y: HY - float * 14, r: -(1 - hh) * 26 - float * 20 });
        pose(h.knot, { x: h.x, y: HY, s: hh, o: hh > 0.02 ? 1 : 0 });
        fade(lines[i], i === 0 ? bump(t, 0.3, 0.95) : bump(t, 1.3, 1.95));
      });
      peter.set({ x: PX, y: GY, s: 0.92, flip: false, armF: 80 + bump(t, 0.2, 0.5) * 8, armB: 70 + bump(t, 0.2, 0.5) * 14, head: 10 - es(t, 0.55, 0.8) * 22, blink: blinkAt(T, 2) });
      andrew.set({ x: AX, y: GY, s: 0.92, flip: true, armF: 80 + bump(t, 1.2, 1.5) * 8, armB: 70 + bump(t, 1.2, 1.5) * 14, head: 10 - es(t, 1.55, 1.8) * 22, blink: blinkAt(T, 4) });
      others.forEach((o) => o.p.set({ x: o.x, y: GY - 10, s: 0.88, flip: o.flip, head: -es(t, 0.6, 0.9) * 14, blink: blinkAt(T, o.seed) }));

      /* v19 — two who agree, and the gift from above */
      const kn = es(t, 2.0, 2.15);
      johnK.set({ x: 764, y: GY + 12, s: 0.9, flip: false, o: kn, armF: 70, armB: 60, head: -6 - es(t, 2.2, 2.5) * 10, blink: blinkAt(T, 3) });
      jamesK.set({ x: 842, y: GY + 12, s: 0.9, flip: true, o: kn, armF: 70, armB: 60, head: -6 - es(t, 2.2, 2.5) * 10, blink: blinkAt(T, 5) });
      const [jx, jy] = hand(764, GY + 12, 0.9, false, 70, 0, 46);
      prayers.forEach((p, i) => {
        const u = es(t, 2.15, 2.6);
        const x0 = i ? 842 - (jx - 764) : jx;
        pose(p, { x: lerp(x0, 800, Math.min(1, u * 1.6)), y: lerp(jy - 10, 210, u), s: 1 + u * 0.4, o: bump(t, 2.12, 2.7) });
      });
      const g = es(t, 2.6, 2.85, ease.out);
      pose(gift, { x: 803, y: lerp(220, jy - 6, g), s: 0.8 + Math.sin(T * 3) * 0.05, r: T * 20, o: g > 0.01 ? 1 : 0 });
      jesus.set({ x: 800, y: GY - 16, s: 1.0, armF: 30 + bump(t, 0.05, 0.9) * 40 + bump(t, 1.05, 1.9) * 40, armB: 10 + es(t, 2.05, 2.3) * 120, head: -es(t, 2.1, 2.4) * 10, o: 1, blink: blinkAt(T, 1) });

      S.cam.y = kf(t, [[0, 10], [0.5, 0], [1.0, 0], [1.5, 0], [2.0, 10], [2.6, 0]]);
      S.cam.x = S.portrait ? kf(t, [[0, -20], [1.0, -20], [1.4, 20], [2.0, 0]]) : kf(t, [[0, -50], [1.0, -50], [1.4, 50], [2.0, 0]]);   // phone: a shorter pan keeps both ends in view
      S.cam.z = kf(t, [[0, 1.06], [1.9, 1.06], [2.2, 1.02]]);
    };
  },
};
