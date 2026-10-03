// Łk 5,1–3 — the lake of Gennesaret in the morning. Jesus stands at the water's edge and the crowd presses in on Him
// from the beach to hear the word of God (slips of His words fly out over their heads). He sees two boats standing at
// the shore; the fishermen have climbed out and are rinsing their nets — Simon and Andrew at the water's edge, James
// and John over the side of the second boat. He climbs into Simon's boat, Simon wades out and pushes it off a little;
// then He sits down in the boat and teaches the crowd, now sitting all along the beach.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock, reeds, grass } from '../../assets/nature.js';
import {
  lakeSet, frontWaves, boatRig, netDrape, wordSlip, group, folk, nameTag, sparkle, voiceRings, headAt, hand, kf, moving,
  PETER_W, JAMES_W, MORNING, es, ease, bump, seg, tr, PI,
} from './lib.js';
import { waveStrip } from '../../assets/nature.js';

const P = 0.5;
const WL = (x) => 652 + Math.max(0, x - 690) * 0.24;       // the waterline: beach below it, the lake above
const JX = 670, JY = 668;                                   // Jesus on the beach
const B1A_L = { x: 1080, y: 702, s: 1 }, B1B_L = { x: 1060, y: 676, s: 0.94 };
const B2_L = { x: 1330, y: 638, s: 0.8, r: 0 };
const PX = 846, AX = 990;                                   // Simon and Andrew at the water's edge

export default {
  id: 'lk5-shore',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'zobaczył dwie łodzie, stojące przy brzegu;' },
    { v: 2, cont: true, text: 'rybacy zaś wyszli z nich i płukali sieci.' },
    { v: 3, text: 'Wszedłszy do jednej łodzi, która należała do Szymona, poprosił go, żeby nieco odbił od brzegu.' },
    { v: 3, cont: true, text: 'Potem usiadł i z łodzi nauczał tłumy.' },
  ],
  cam: { x: [-60, 300], y: [0, 70], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: both boats come in from the right edge (the second one further out, behind Simon's) so that the two boats,
    // Simon pushing off and Andrew all stay on the screen
    const B1A = PH ? { x: 980, y: 702, s: 1 } : B1A_L, B1B = PH ? { x: 960, y: 676, s: 0.94 } : B1B_L;
    const B2 = PH ? { x: 1100, y: 614, s: 0.74, r: 0 } : B2_L;
    const AX2 = PH ? 1090 : 1190;                             // where Andrew wades to
    const K = lakeSet(S, { skyCols: MORNING, sunAt: [1250, 150], lakeY: 420 });

    /* the second boat (James and John, sitting, rinsing a net over the side) */
    const b2L = S.layer({ par: P, sh: 4 });
    const netOver = `<g transform="translate(-40 -52)">${netDrape(c, 120, 46, C.rope)}</g>`;
    const R2 = boatRig(S, b2L, { w: 360, col: C.wood3, stripe: C.dustyBlue, crew: [{ k: 'james', o: { ...JAMES_W, pose: 'sit' }, x: 30, dy: 4 }, { k: 'john', o: { ...CAST.john, pose: 'sit' }, x: -60, dy: 4 }], extra: netOver });
    const w2 = frontWaves(S, { y: PH ? B2.y + 4 : 642, par: P, sh: 2, color: mix(C.lake, C.skyBlue, 0.12), amp: 6, len: 180, pad: 200 });

    /* Simon's boat: Jesus standing / sitting in it, Simon climbing in */
    const b1L = S.layer({ par: P, sh: 4 });
    const R1 = boatRig(S, b1L, {
      w: 380, col: C.wood, stripe: C.terracotta,
      crew: [
        { k: 'jStand', o: CAST.jesus, x: -110, dy: -6, s: 0.94 },
        { k: 'jSit', o: { ...CAST.jesus, pose: 'sit' }, x: -118, dy: -34, s: 1.0 },
        { k: 'peter', o: PETER_W, x: 70, dy: -8, s: 0.94 },
      ],
      extra: `<g transform="translate(90 -58)">${netDrape(c, 110, 30, C.rope)}</g>`,
    });
    const w1 = frontWaves(S, { y: 694, par: P, sh: 2, color: mix(C.lake, C.lake2, 0.25), amp: 8, len: 200, pad: 200 });

    /* the beach */
    const beachL = S.layer({ par: P, sh: 3 });
    const b = sheet().p(c.ridge(WL, -1400, 3000, 1700, 12, 1), mix(C.sand, C.stone, 0.22));
    let peb = '';
    for (let i = 0; i < 90; i++) { const x = c.rr(-900, 2400); peb += c.cut(c.blob(x, WL(x) + c.rr(16, 300), c.rr(4, 9), c.rr(2.5, 5), 7, 0.2), 0.2, 3); }
    b.x(peb, C.stone2, 'opacity=".7"');
    beachL.add(b.out());
    beachL.add(`<path d="${c.ribbon(Array.from({ length: 60 }, (_, i) => { const x = -1400 + i * 76; return [x, WL(x) + 2]; }), 4)}" fill="${C.foam}" opacity=".85"/>`);
    // a drying net on poles, baskets, an upturned hull on the left of the beach
    const poles = sheet().p(c.ribbon([[-60, 0], [-60, -120]], 5) + c.ribbon([[70, 0], [70, -120]], 5), C.wood2).out();
    beachL.add(`<g transform="translate(250 700)">${poles}<g transform="translate(5 -118)">${netDrape(c, 140, 70, C.rope)}</g></g>`);
    beachL.add(rock(c, 90, 760, 90, 30, C.rock2) + reeds(c, -20, 740, 9, 90, C.moss) + grass(c, { x0: -900, x1: 560, y: 0, fn: (x) => WL(x) + 110, n: 18, h: 12, color: C.olive }));
    beachL.add(`<g transform="translate(470 690)">${sheet().p(c.cut([[-18, 0], [-22, -26], [22, -26], [18, 0]], 0.4, 4), C.basket).x(c.ribbon([[-20, -14], [20, -14]], 2), shade(C.basket, -0.25)).out()}</g>`);

    /* the crowd: standing and pressing in (v1), then sitting along the beach (v3b) — sprites, never repainted */
    const crowdL = S.layer({ par: P, sh: 4 });
    const standRows = [
      { y: 676, s: 0.74, n: 8, x0: 60, x1: 590 },
      { y: 712, s: 0.8, n: 7, x0: 20, x1: 560 },
      { y: 752, s: 0.86, n: 6, x0: -40, x1: 520 },
    ];
    const standers = standRows.map((r, ri) => {
      const mem = Array.from({ length: r.n }, (_, i) => ({ x: lerp(r.x0, r.x1, (i + c.rr(0.2, 0.8)) / r.n), y: r.y + c.rr(-5, 5), s: r.s * c.rr(0.94, 1.05), flip: false, o: { ...folk(c), pose: 'stand' } }));
      return { ri, sp: crowdL.sprite(group(c, mem), 0, 0) };
    });
    const sitRows = [
      { y: 716, s: 0.78, n: 7, x0: 360, x1: 820 },
      { y: 752, s: 0.84, n: 7, x0: 320, x1: 880 },
      { y: 790, s: 0.9, n: 6, x0: 300, x1: 920 },
    ];
    const sitters = sitRows.map((r, ri) => {
      const mem = Array.from({ length: r.n }, (_, i) => ({ x: lerp(r.x0, r.x1, (i + c.rr(0.2, 0.8)) / r.n), y: r.y + c.rr(-4, 4), s: r.s * c.rr(0.94, 1.05), flip: false, o: { ...folk(c), pose: 'sit' } }));
      return { ri, sp: crowdL.sprite(group(c, mem), 0, 0) };
    });

    /* Jesus on the beach, Simon and Andrew with the net at the water's edge */
    const PL = S.layer({ par: P, sh: 5 });
    const jesus = S.puppet(PL.add(person(c, CAST.jesus)));
    const peter = S.puppet(PL.add(person(c, PETER_W)));
    const net = PL.add(`<g>${netDrape(c, 124, 60, mix(C.rope, C.linen, 0.1))}</g>`);
    const andrew = S.puppet(PL.add(person(c, CAST.andrew)));
    const drips = [0, 1, 2, 3].map(() => PL.add(`<path d="${c.cut([[0, -5], [3, 0], [0, 3], [-3, 0]], 0.1, 2)}" fill="#cfe6ea"/>`));
    const splashes = [0, 1].map(() => PL.add(`<g>${[-1, 1].map((sd) => `<path d="${c.cut([[0, 0], [sd * 14, -22], [sd * 22, -18], [sd * 8, 2]], 0.4, 4)}" fill="${C.foam}"/>`).join('')}</g>`));
    const words = Array.from({ length: 9 }, (_, i) => ({ i, el: PL.add(wordSlip(c, c.rr(26, 36))), to: [lerp(40, 620, i / 8) + c.rr(-20, 20), c.rr(500, 580)], seed: c.rr(0, 6) }));
    const words2 = Array.from({ length: 9 }, (_, i) => ({ i, el: PL.add(wordSlip(c, c.rr(26, 36))), to: [lerp(330, 900, i / 8) + c.rr(-20, 20), c.rr(560, 640)], seed: c.rr(0, 6) }));
    const voice = voiceRings(PL, c, { n: 3, color: C.clay, r: 34, w: 5, both: false });

    /* name tag over Simon's boat */
    const TL = S.layer({ par: 0.4, sh: 6 });
    const tag = TL.add(`<g>${nameTag(c, tr('łódź Szymona', 'Simon’s boat'), { size: 18 })}<path d="M0 -1600V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/></g>`);
    const glints = [0, 1].map(() => TL.add(`<g>${sparkle(c, 12)}</g>`));

    /* foreground */
    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, -260, 990, 14, 240, C.moss) + rock(c, 250, 1000, 240, 90, C.rock2) + reeds(c, 1700, 990, 12, 220, C.moss) + rock(c, 2000, 1010, 260, 100, C.rock));

    return (t, time) => {
      const T = time;
      K.idle(T, { sunY: lerp(170, 140, es(t, 0, 6)) });
      w1.shift(Math.sin(T * 0.5) * 30 * P, -es(t, 4.2, 4.95) * 22);
      w2.shift(Math.sin(T * 0.4 + 1) * 24 * P, 0);

      /* v1 — the crowd presses in; Jesus is pushed back to the water's edge; His words fly out */
      const press = es(t, 1.0, 1.7, ease.out);
      const sitK = es(t, 5.02, 5.3);
      standers.forEach((m) => m.sp.set({ x: lerp(-260 - m.ri * 60, 0, press) + es(t, 1.6, 2.0) * 20 * (m.ri + 1), y: 0, s: 1, o: 1 - sitK }));
      sitters.forEach((m) => m.sp.set({ x: 0, y: 0, s: 1, o: sitK }));
      const back = es(t, 1.4, 1.8) * 34;
      const teach1 = es(t, 1.15, 1.4) * (1 - es(t, 1.9, 2.15));
      const look = es(t, 2.05, 2.3);

      /* v3a — He walks to Simon's boat and steps in; Simon pushes it off */
      const walkKeys = [[4.02, JX + back], [4.3, B1A.x - 150]];
      const jx = kf(t, walkKeys, ease.sine);
      const inBoat = es(t, 4.3, 4.36);
      const walking = moving(t, walkKeys);
      jesus.set({ x: jx, y: Math.max(JY, WL(jx) + 14), s: 1.0, flip: false, o: 1 - inBoat, walk: walking ? jx * 0.05 : undefined, armF: 12 + teach1 * 60 + bump(t, 2.1, 2.9) * 30, armB: 8 + teach1 * 30, head: -teach1 * 4 + look * 6 * (1 - inBoat), blink: blinkAt(T) });
      const [hx, hy] = headAt(jx, JY, 1.0, false);
      words.forEach((w) => {
        const k = ((T * 0.22 + w.i / words.length) % 1);
        const on = es(t, 1.1, 1.35) * (1 - es(t, 1.9, 2.1));
        const x = lerp(hx - 20, w.to[0], k), y = lerp(hy, w.to[1], k) - Math.sin(k * PI) * 60;
        pose(w.el, { x, y, r: Math.sin(T * 2 + w.seed) * 12 - 8, s: 0.5 + k * 0.5, o: on * Math.min(1, k * 5) * (1 - k * 0.6) });
      });

      /* the boats */
      const push = es(t, 4.45, 4.95, ease.sine);
      const B1 = { x: lerp(B1A.x, B1B.x, push), y: lerp(B1A.y, B1B.y, push) + Math.sin(T * 1.3) * 2, s: lerp(B1A.s, B1B.s, push), r: Math.sin(T * 0.9) * 0.6 };
      R1.set(B1);
      const b2 = { ...B2, y: B2.y + Math.sin(T * 1.2 + 1) * 1.6, r: Math.sin(T * 0.8 + 2) * 0.5 };
      R2.set(b2);
      const sitIn = es(t, 5.02, 5.1);
      const teach2 = es(t, 5.15, 5.4);
      R1.put('jStand', B1, { o: inBoat * (1 - sitIn), armF: 20 + bump(t, 4.4, 4.9) * 40, armB: 10, head: 4, blink: blinkAt(T) });
      R1.put('jSit', B1, { o: sitIn, flip: true, armF: 20 + teach2 * (50 + (T ? Math.sin(T * 1.4) * 16 : 0)), armB: 10 + teach2 * 40, head: -teach2 * 4, blink: blinkAt(T) });
      // Simon: at the water's edge with Andrew (the net), then he wades to the boat and pushes it, then climbs in
      const pIn = es(t, 4.9, 4.96);
      R1.put('peter', B1, { o: pIn, flip: true, armF: 30 + teach2 * 0, armB: 20, head: 6, blink: blinkAt(T, 2) });
      const pKeys = [[4.28, [PX, WL(PX) + 12]], [4.45, [B1A.x + 160, 722]], [4.95, [B1B.x + 150, 704]]];
      const [px, py] = kf(t, pKeys);
      const pushing = t > 4.45 && t < 4.95;
      const pMove = moving(t, pKeys.map(([k, [x]]) => [k, x]));
      peter.set({ x: px, y: py, s: 1.0, flip: t > 4.4, o: 1 - pIn, walk: pMove ? px * 0.05 : undefined, armF: pushing ? 80 : 40 + bump(t, 1.2, 2.0) * 10, armB: pushing ? 70 : 30, lean: pushing ? -14 : 0, blink: blinkAt(T, 2) });
      // rinsing: the net dips into the water and comes up dripping (v2b)
      const rinse = seg(t, 3.02, 3.95);
      const dip = rinse > 0 && rinse < 1 ? Math.max(0, Math.sin(rinse * PI * 4)) : 0;
      const hold = 1 - es(t, 4.2, 4.3);
      const [ph1x, ph1y] = hand(PX, WL(PX) + 12, 1.0, false, 40 + dip * 30 - (1 - hold) * 30);
      const axx = lerp(AX, AX2, es(t, 4.3, 4.9));
      const [ah1x, ah1y] = hand(axx, WL(axx) + 14, 0.98, true, 40 + dip * 30);
      const nx = t < 4.2 ? (ph1x + ah1x) / 2 : lerp((ph1x + ah1x) / 2, ah1x - 30, es(t, 4.2, 4.35));
      pose(net, { x: nx, y: Math.min(ph1y, ah1y) + dip * 22 - 4, s: 1, r: dip * 4, o: 1 });
      const ax = lerp(AX, AX2, es(t, 4.3, 4.9)); const aMov = t > 4.3 && t < 4.9;
      andrew.set({ x: ax, y: WL(ax) + 14, walk: aMov ? ax * 0.05 : undefined, s: 0.98, flip: !aMov, armF: 40 + dip * 30, armB: 26 + bump(t, 4.2, 4.6) * 20, head: 10 * (1 - es(t, 4.2, 4.4)), blink: blinkAt(T, 3) });
      drips.forEach((d, i) => { const k = ((T * 1.4 + i * 0.25) % 1); pose(d, { x: nx - 30 + i * 20, y: Math.min(ph1y, ah1y) + 44 + k * 30, o: (1 - k) * bump(t, 3.0, 4.2) }); });
      splashes.forEach((sp, i) => { const k = seg(t, 3.02, 3.95) * 4 % 1; pose(sp, { x: nx + (i ? 30 : -30), y: WL(nx) + 6, s: dip * 1.1, o: dip > 0.05 ? dip : 0 }); });

      // James and John on the second boat, rinsing their net over the side
      const dip2 = rinse > 0 && rinse < 1 ? Math.max(0, Math.sin(rinse * PI * 4 + 1.5)) : 0;
      R2.put('james', b2, { flip: true, armF: 50 + dip2 * 30, armB: 30, head: 12, blink: blinkAt(T, 4) });
      R2.put('john', b2, { flip: true, armF: 44 + dip2 * 26, armB: 24, head: 10, blink: blinkAt(T, 5) });
      if (R2.extraEl) { const [ex, ey] = R2.at(b2, 0, dip2 * 16); pose(R2.extraEl, { x: ex, y: ey, s: b2.s, r: b2.r }); }

      /* v3b — words from the boat to the seated crowd */
      const [jhx, jhy] = R1.at(B1, -122, -34 - (167 - 62));
      words2.forEach((w) => {
        const k = ((T * 0.2 + w.i / words2.length) % 1);
        const on = es(t, 5.25, 5.5);
        const x = lerp(jhx - 20, w.to[0], k), y = lerp(jhy, w.to[1], k) - Math.sin(k * PI) * 60;
        pose(w.el, { x, y, r: Math.sin(T * 2 + w.seed) * 12 - 8, s: 0.5 + k * 0.5, o: on * Math.min(1, k * 5) * (1 - k * 0.6) });
      });
      voice(jhx - 18, jhy, teach2, T, { dir: -1, spread: 2.2 });

      /* v2a — the name tag comes down over Simon's boat */
      const tk = es(t, 2.1, 2.45, ease.out) * (1 - es(t, 3.9, 4.15, ease.in));
      pose(tag, { x: B1A.x + 20, y: lerp(-420, 420, tk), r: Math.sin(T * 0.8) * 1.4, o: tk > 0.01 ? 1 : 0 });
      glints.forEach((g, i) => { const k = bump(t, 2.2 + i * 0.25, 2.7 + i * 0.25); pose(g, { x: [B1A.x - 80, B2.x + 60][i], y: [B1A.y - 70, B2.y - 60][i], s: k, r: T * 40, o: k }); });

      S.cam.x = kf(t, PH ? [[0, -60], [1.0, -40], [1.9, -40], [2.3, 240], [3.9, 230], [4.3, 200], [5.0, 190], [6, 190]] : [[0, -60], [1.0, -40], [1.9, -40], [2.3, 220], [3.9, 200], [4.3, 180], [5.0, 170], [6, 180]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 40], [2.3, 30], [5.0, 50], [6, 50]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.08], [1.9, 1.1], [2.3, 1.04], [3.9, 1.08], [5.0, 1.08], [6, 1.1]]);
    };
  },
};
