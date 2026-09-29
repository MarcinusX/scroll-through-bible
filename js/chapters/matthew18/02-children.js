// Mt 18,3–5 — out in the garden behind the house, a low stone wall with a small arched gate: the kingdom of heaven.
// It swings open on golden light. The child walks in without stooping; Peter, crown and all, strides up to it —
// bump — the paper crown flies off and he staggers back. Whoever humbles himself: Peter kneels down beside the child,
// the other crowns flutter to the ground, and a crown of light comes down over the kneeling fisherman. Whoever
// receives such a child receives Me: John kneels and takes the child in his arms, and Jesus, standing over them,
// opens His hands — His own light spreads round the two of them.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, olive, rock, cloud, sun, flowers, cypress } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { DAY, TWELVE, child, kidHead, paperCrown, crownOfLight, labelOnString, burst, heart, kf, headAt, tr, PI } from './lib.js';

const P = 0.45, GY = 704, WT = 584;       // figures' layer, their feet, the wall's top
const GX = 930, GW = 76, GH = 132;         // the gate (centre x, width, height of the opening)

export default {
  id: 'mt18-children',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-20, 110], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 480, y: 160, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 2], lens: [1000, 340, 120], color: C.hillFar }).markup);
    S.layer({ par: 0.16, sh: 2 }).add(waterBand(c, { y: 470, color: C.lake, foamN: 20 }).markup);

    /* the garden beyond the wall, in light */
    const gdn = S.layer({ par: 0.36, sh: 3 });
    gdn.add(sheet().p(c.cut([[-900, 520], [2500, 520], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sage2, C.hillNear, 0.4)).out());
    gdn.add(olive(c, 360, 578, 0.9) + cypress(c, 700, 590, 130, C.moss2) + olive(c, GX + 130, 590, 1.05) + olive(c, 1320, 582, 0.95) + cypress(c, 1180, 590, 120, C.moss2));
    const gl = gdn.add(`<g opacity="0"><circle cx="${GX}" cy="${GY - 90}" r="190" fill="url(#halo-glow)"/><path d="${c.poly([[GX - 30, GY - 140], [GX + 30, GY - 140], [GX + 140, GY - 20], [GX - 140, GY - 20]])}" fill="#fff4cf" opacity=".5"/></g>`);
    gdn.add(flowers(c, { x0: GX - 140, x1: GX + 140, y: GY - 16, n: 18, h: 18 }));

    /* the wall with the little gate */
    const wallL = S.layer({ par: 0.42, sh: 4 });
    const w = sheet();
    const hole = [[GX - GW / 2, GY - 12], [GX - GW / 2, GY - GH + GW / 2], ...c.arc(GX, GY - GH + GW / 2, GW / 2, GW / 2, PI, 2 * PI, 12), [GX + GW / 2, GY - 12]];
    const WC = mix(C.rock, C.sand2, 0.35);
    w.p(c.cut([[-900, WT + 6], [-300, WT], [400, WT + 4], [1200, WT - 2], [2500, WT + 4], [2500, GY - 8], [-900, GY - 8]], 1.2, 14) + c.hole(hole, 0.4, 6), WC);
    let st = '', hi = '';
    for (let y = WT + 14, r = 0; y < GY - 20; y += 24, r++) for (let x = -880 + (r % 2) * 30; x < 2480; x += 60) {
      if (Math.abs(x + 26 - GX) < GW / 2 + 22 && y > GY - GH - 20) continue;
      st += c.cut(c.blob(x + 26, y + 10, 25, 9, 9, 0.18), 0.6, 5);
      if (c.chance(0.35)) hi += c.cut(c.ell(x + 20, y + 6, 12, 3, 8), 0.3, 4);
    }
    w.x(st, shade(WC, -0.12), 'opacity=".55"').x(hi, shade(WC, 0.3), 'opacity=".6"');
    w.p(c.cut([[-900, WT - 4], [2500, WT - 6], [2500, WT + 12], [-900, WT + 12]], 0.8, 16), shade(WC, 0.18));
    let ivy = '';
    for (let i = 0; i < 26; i++) { const x = c.pick([c.rr(GX - 170, GX - 50), c.rr(GX + 50, GX + 190), c.rr(300, 500), c.rr(1180, 1360)]); ivy += c.cut(c.blob(x, WT + c.rr(0, 50), c.rr(8, 14), c.rr(6, 10), 8, 0.3), 0.4, 4); }
    w.p(ivy, C.moss);
    // the stone arch round the opening
    let arch = '';
    for (let i = 0; i < 9; i++) { const a = PI + ((i + 0.5) / 9) * PI; arch += c.cut(c.ell(GX + Math.cos(a) * (GW / 2 + 10), GY - GH + GW / 2 + Math.sin(a) * (GW / 2 + 10), 10, 7, 8, a + PI / 2), 0.3, 4); }
    w.p(arch, C.stone);
    w.p(c.cut([[-900, GY - 12], [2500, GY - 12], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.sage2, 0.35));
    wallL.add(w.out());
    wallL.add(rock(c, 300, GY + 30, 70, 24, C.rock2) + rock(c, 1420, GY + 20, 60, 22));
    // the gate leaf (hinged on the left of the opening)
    const leaf = wallL.add(`<g>${sheet().p(c.cut([[0, 0], [0, -GH + GW / 2], ...c.arc(GW / 2, -GH + GW / 2, GW / 2, GW / 2, PI, 1.5 * PI, 6), [GW / 2, -GH], [GW, -GH + GW / 2 - 4], [GW, 0]], 0.4, 6), C.wood).x(c.ribbon([[6, -GH * 0.3], [GW - 6, -GH * 0.3]], 4) + c.ribbon([[6, -GH * 0.72], [GW - 6, -GH * 0.72]], 4), C.wood2).x(c.poly(c.circ(GW - 12, -GH * 0.5, 3, 8)), C.ink).out()}</g>`);
    const label = hanging(wallL, labelOnString(tr('królestwo niebieskie', 'the kingdom of heaven'), { size: 19 }), { x: GX, y: 0, len: 900 });

    /* people */
    const L = S.layer({ par: P, sh: 5 });
    const LEFT = [TWELVE[1], TWELVE[3], TWELVE[4], TWELVE[5]].map((d, i) => ({ d, i, x: 470 + i * 56, s: 0.84 + i * 0.01, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    const jesus = S.puppet(L.add(person(c, CAST.jesus)));
    const peterSt = S.puppet(L.add(person(c, CAST.peter)));
    const peterKn = S.puppet(L.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const johnSt = S.puppet(L.add(person(c, CAST.john)));
    const johnKn = S.puppet(L.add(person(c, { ...CAST.john, pose: 'kneel' })));
    const kidP = S.puppet(L.add(child(c)));
    const fx = S.layer({ par: P, sh: 4 });
    const crowns = LEFT.map((m) => ({ m, el: fx.add(`<g>${paperCrown(c, 28, [C.sun, C.ochre, C.wheat][m.i % 3])}</g>`) }));
    const pCrown = fx.add(`<g>${paperCrown(c, 32, C.sun)}</g>`);
    const jCrown = fx.add(`<g>${paperCrown(c, 28, C.wheat)}</g>`);
    const bonk = fx.add(`<g opacity="0">${burst(c, 20)}</g>`);
    const light = fx.add(`<g opacity="0">${crownOfLight(c, 30)}</g>`);
    const embrace = fx.add(`<g opacity="0"><ellipse cx="0" cy="-60" rx="150" ry="120" fill="url(#halo-glow)"/></g>`);
    const love = fx.add(`<g opacity="0">${heart(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1250, 140, T, 1, 0.6);
      swing(cl, 480 + Math.sin(T * 0.1) * 20, 160, T, 1.3, 0.6, 1);

      /* v3 — the gate opens; the child walks in; Peter bumps his crown off */
      const open = es(t, 0.05, 0.35);
      pose(leaf, { x: GX - GW / 2, y: GY - 12, sx: 1 - open * 1.12 });
      fade(gl, open);
      pose(label, { x: GX, y: lerp(-900, GY - GH - 150, es(t, 0.1, 0.4, ease.back)), r: Math.sin(T * 0.9) * 1.5 });
      const kw = es(t, 0.15, 0.5);
      const kOut = es(t, 1.2, 1.45);
      const kx = lerp(lerp(800, GX, kw), 880, kOut), ky = lerp(lerp(GY + 2, GY - 12, kw), GY + 4, kOut);
      const kin = kw * (1 - kOut);
      kidP.set({ x: kx, y: ky, s: lerp(0.58, 0.52, kin), flip: t > 2.3, walk: (kw > 0 && kw < 1) || (kOut > 0 && kOut < 1) ? kx * 0.1 : undefined, amt: 0.7, head: -kin * 6 + bump(t, 0.55, 0.95) * 10, armF: 20 + kin * 30 + es(t, 2.35, 2.55) * 60, armB: es(t, 2.35, 2.55) * 60, blink: blinkAt(T, 7) });

      const pw = kf(t, [[0.28, 1090], [0.58, GX + 62], [0.7, GX + 90], [1.05, GX + 96]], ease.out);
      const hit = bump(t, 0.56, 0.9);
      const kneel = es(t, 1.08, 1.15);
      peterSt.set({ x: pw, y: GY, s: 0.92, flip: true, o: 1 - kneel, walk: t > 0.28 && t < 0.58 ? pw * 0.06 : undefined, lean: -hit * 16, armF: 20 + hit * 60, armB: hit * 120, head: -hit * 14, blink: blinkAt(T, 2) });
      peterKn.set({ x: GX + 96, y: GY + 2, s: 0.92, flip: true, o: kneel, head: 10 - es(t, 1.5, 1.8) * 6, armF: 40, armB: 10, blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(pw, GY, 0.92, true);
      const fly = es(t, 0.58, 0.95);
      pose(pCrown, { x: phx + fly * 70, y: lerp(phy - 30, GY - 4, fly) - Math.sin(fly * PI) * 70, r: fly * 200, s: 1, o: 1 - es(t, 1.1, 1.3) });
      pose(bonk, { x: phx - 26, y: phy - 20, s: bump(t, 0.56, 0.8) * 1.4, r: T * 30, o: bump(t, 0.56, 0.8) > 0.05 ? 1 : 0 });

      /* v4 — the humble one is the greatest: the crowns fall, a crown of light comes down */
      LEFT.forEach((m) => {
        const bow = es(t, 1.25 + m.i * 0.05, 1.55 + m.i * 0.05);
        m.p.set({ x: m.x, y: GY + (m.i % 2) * 6, s: m.s, flip: false, head: 4 + bow * 12, armF: 16 + bump(t, 0.6, 1.0) * 30 + bow * 20, armB: bow * 30, blink: blinkAt(T, m.seed) });
        m.hx = m.x + 2 * m.s; m.hy = GY + (m.i % 2) * 6 - 167 * m.s;
      });
      crowns.forEach(({ m, el }) => {
        const f = es(t, 1.25 + m.i * 0.05, 1.6 + m.i * 0.05, ease.in);
        pose(el, { x: m.hx + f * (18 + m.i * 6), y: lerp(m.hy - 30, GY + 6, f), r: f * (m.i % 2 ? 110 : -100), o: 1 - es(t, 1.8, 2.0) });
      });
      const [kx2, ky2] = headAt(GX + 96, GY + 2, 0.92, true, 46);
      const lk = es(t, 1.35, 1.7, ease.out);
      pose(light, { x: kx2, y: lerp(-100, ky2 - 36, lk) + Math.sin(T * 1.4) * 3 * lk, s: 1, o: lk > 0.01 ? 1 : 0 });

      /* v5 — John takes the child in his arms; Jesus stands over them */
      const jw = es(t, 2.0, 2.3);
      const jKn = es(t, 2.3, 2.37);
      const jx = lerp(1180, 820, jw);
      johnSt.set({ x: jx, y: GY + 4, s: 0.9, flip: true, o: es(t, 1.9, 2.0) * (1 - jKn), walk: jw > 0 && jw < 1 ? jx * 0.06 : undefined, blink: blinkAt(T, 3) });
      const hug = es(t, 2.35, 2.6);
      johnKn.set({ x: 820, y: GY + 6, s: 0.9, flip: false, o: jKn, armF: 30 + hug * 50, armB: 20 + hug * 70, head: 6 + hug * 6, blink: blinkAt(T, 3) });
      const [jhx, jhy] = headAt(jx, GY + 4, 0.9, true);
      pose(jCrown, { x: jhx, y: jhy - 28, s: 0.9, o: es(t, 1.9, 2.0) * (1 - es(t, 2.05, 2.2)) });

      const jm = es(t, 1.95, 2.35);
      const bless = es(t, 2.45, 2.7);
      jesus.set({ x: lerp(700, 850, jm), y: lerp(GY - 4, GY - 14, jm), s: 1.0, flip: false, walk: jm > 0 && jm < 1 ? jm * 20 : undefined, armF: 30 + bump(t, 0.1, 0.9) * 50 + es(t, 1.2, 1.4) * 20 * (1 - jm) + bless * 50, armB: 10 + bless * 110, head: 4 + bless * 6, blink: blinkAt(T, 1) });
      pose(embrace, { x: 860, y: GY, s: 0.6 + bless * 0.5, o: bless * 0.85 });
      const lv = es(t, 2.55, 2.8, ease.back);
      pose(love, { x: 852, y: GY - 108 + Math.sin(T * 1.6) * 2, s: lv * 0.8, o: lv > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 40], [0.5, 80], [1.0, 80], [1.9, 70], [2.5, 50]]);
      S.cam.z = kf(t, [[0, 1.02], [0.5, 1.08], [1.2, 1.06], [2.5, 1.08]]);
      S.cam.y = kf(t, [[0, 20], [0.6, 36], [2.5, 30]]);
    };
  },
};
