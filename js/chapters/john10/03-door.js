// J 10,6–10 — back from the parable: the fold stands in the morning sun and the listeners on the left stare at it,
// question marks over their heads. Jesus speaks again and steps into the gap of the gate: "I am the door of the
// sheep" — the gateway fills with light and the I AM comes down. All who came before were thieves: dark shadows lean
// over the walls and call, but the sheep turn their heads away. "I am the door" — He spreads His arms across it;
// a sheep goes in through Him and shines; they go in and out and find pasture. The thief comes to steal, kill and
// destroy — three dark tags drop, a shadow creeps over the meadow, the flowers droop. "I came that they may have
// life, and have it abundantly" — He lifts His arms, light floods out of the gate and the whole meadow blooms.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet, swing } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { grass, rock, bush } from '../../assets/nature.js';
import {
  pastureSet, foldParts, ewe, sheepRig, WOOLS, THIEF, JESUS, sack, flowerClump, voiceRings, nameTag, question, iAm, word, rayBurst,
  shadowPerson, leader, cast, mood, hanging, kf, vis, polyAt, clipped, tr, MORNING, DAY, PI,
} from './lib.js';

const CX = 800, GY = 600;
const IN = [[620, 520], [690, 506], [880, 508], [950, 522], [760, 486]];
const OUTS = [[640, 716], [1010, 724], [1140, 704]];
const CLUMPS = [[470, 780, 1.1], [560, 742, 0.9], [690, 770, 1.2], [860, 752, 1.0], [960, 784, 1.2], [1090, 748, 1.0], [1210, 772, 1.1], [620, 690, 0.8], [1000, 690, 0.8], [1160, 676, 0.8], [400, 700, 0.9], [760, 700, 0.7], [1290, 720, 1.0], [330, 760, 1.0]];

export default {
  id: 'j10-door',
  beats: [
    { v: 6 },
    { v: 7, text: 'Powtórnie więc powiedział do nich Jezus:' },
    { v: 7, cont: true, text: '«Zaprawdę, zaprawdę, powiadam wam: Ja jestem bramą owiec.' },
    { v: 8 },
    { v: 9, text: 'Ja jestem bramą.' },
    { v: 9, cont: true, text: 'Jeżeli ktoś wejdzie przeze Mnie, będzie zbawiony -' },
    { v: 9, cont: true, text: 'wejdzie i wyjdzie, i znajdzie paszę.' },
    { v: 10, text: 'Złodziej przychodzi tylko po to, aby kraść, zabijać i niszczyć.' },
    { v: 10, cont: true, text: 'Ja przyszedłem po to, aby [owce] miały życie i miały je w obfitości.' },
  ],
  cam: { x: [-80, 80], y: [-120, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    // phone: the listeners stand nearer the gate and the thief comes nearer, so nobody is cut off at the screen edge
    const PT = S.portrait;
    const LX = PT ? [75, 70, 85] : [0, 0, 0], THX = PT ? 1100 : 1180, BADX = PT ? 830 : 900, BADD = PT ? 100 : 120;
    const S0 = PT ? [690, 726] : [640, 716], S0B = PT ? [670, 748] : [600, 736], S1 = PT ? [960, 730] : OUTS[1], S2 = PT ? [1080, 696] : OUTS[2];
    const set = pastureSet(S, { skyCols: MORNING, sunAt: [1220, 140], groundY: 500 });
    const field = S.layer({ par: 0.45, sh: 3 });
    const ffn = c.wave(420, [5, 2], [600, 170]);
    field.add(sheet().p(c.ridge(ffn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage, 0.4)).out());
    field.add(grass(c, { x0: -1200, x1: 2800, y: 420, fn: ffn, n: 60, h: 13, color: C.moss }));
    field.add(sheet().p(c.ribbon([[800, 600], [790, 680], [760, 800], [740, 1000]], (u) => 44 + u * 40, 1), mix(C.sand, C.sand2, 0.3)).out());
    const F = foldParts(c, { cx: CX, gy: GY, w: 640, d: 150, gw: 92 });
    const G = F.G;
    // the shadows of those who came before, climbing up behind the back wall (clipped under its line)
    const befL = S.layer({ par: 0.45, sh: 3 });
    const before = [[640, 448, false], [960, 448, true], [800, 420, false]].map(([x, y, fl], i) => {
      const el = befL.add(`<g opacity="0">${clipped(S, 'bef' + i, [-1000, -1000, 3000, y - 8], shadowPerson(c, { ...THIEF, beard: i === 1 ? 'full' : 'short' }, mix('#2a2238', C.storm, 0.25)))}</g>`);
      return { x, y, fl, g: el, p: S.puppet(el.firstElementChild.firstElementChild) };
    });
    const fb = S.layer({ par: 0.45, sh: 4 });
    fb.add(F.floor + F.back);
    // the light of the gateway (behind Jesus, in the gap)
    const doorL = S.layer({ par: 0.45, sh: 0, flat: true });
    const doorGlow = doorL.add(`<g><circle r="170" fill="url(#halo-glow)"/><circle r="80" fill="url(#warm-glow)"/></g>`);
    const doorRays = doorL.add(`<g>${rayBurst(c, { n: 14, r0: 50, r1: 260, spread: 0.045, o: 0.42 })}</g>`);
    // sheep inside
    const inL = S.layer({ par: 0.45, sh: 4 });
    const inside = IN.map((p, i) => ({ i, home: p, r: sheepRig(inL.add(ewe(c, { wool: WOOLS[(i + 2) % 6], patch: i === 3 }))) }));
    const ff = S.layer({ par: 0.45, sh: 5 });
    ff.add(F.front);
    ff.add(`<g transform="translate(${G.gxL} ${G.gateY + 2}) scale(.2 1)">${F.gate}</g>`);
    // the meadow in front: flowers (their own pieces, so they can bloom and droop)
    const meadow = S.layer({ par: 0.5, sh: 3 });
    const clumps = CLUMPS.map(([x, y, s], i) => ({ x, y, s, i, el: meadow.add(`<g>${flowerClump(c, { n: 6 + (i % 3), w: 60 * s, h: 30 * s })}</g>`) }));
    const shadowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const creep = shadowL.add(`<g><path d="${c.cut(c.blob(0, 0, 420, 90, 18, 0.2), 1, 12)}" fill="#1f1a33" opacity=".38"/></g>`);
    // people and the sheep outside
    const act = S.layer({ par: 0.5, sh: 5 });
    const outside = OUTS.map((p, i) => ({ i, home: [S0, S1, S2][i], r: sheepRig(act.add(ewe(c, { wool: WOOLS[i], patch: i === 1 }))) }));
    const lis = cast(S, act, [
      { look: leader(0), x: 440 + LX[0], y: 718, s: 1.02, face: true },
      { look: leader(2), x: 530 + LX[1], y: 726, s: 1.04, face: true },
      { look: leader(4), x: 380 + LX[2], y: 690, s: 0.94, face: true },
    ], 'door');
    const jesus = S.puppet(act.add(person(c, JESUS)));
    const thief = S.puppet(act.add(person(c, { ...THIEF, holdB: sack(c) })));
    const fx = S.layer({ par: 0.55, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: false, color: shade(C.halo, -0.05) });
    const darkRings = [0, 1, 2].map(() => voiceRings(fx, c, { n: 2, r: 26, w: 4, both: true, color: mix('#2a2238', C.storm, 0.4) }));
    const qs = lis.map(() => fx.add(`<g>${question(c)}</g>`));
    const am = fx.add(`<g>${iAm(c, tr('JA JESTEM', 'I AM'), { size: 40 })}<g transform="translate(0 58)">${word(c, tr('bramą owiec', 'the sheep’s door'), { size: 22, fill: C.cream })}</g></g>`);
    const saved = fx.add(`<g><circle r="80" fill="url(#halo-glow)"/><circle r="40" fill="url(#warm-glow)" opacity=".7"/><ellipse cx="-6" cy="-40" rx="16" ry="5" stroke="${C.haloRim}" stroke-width="3" fill="none"/><path d="${c.poly(c.star(22, -46, 12, 4, 4, 0))}" fill="${C.star}"/></g>`);
    const bad = [tr('kraść', 'steal'), tr('zabijać', 'kill'), tr('niszczyć', 'destroy')].map((w, i) => hanging(fx, nameTag(c, w, { size: 18, dark: true }), { x: 900 + i * 110, y: 300, len: 700 }));
    const life = hanging(fx, nameTag(c, tr('życie w obfitości', 'life, abundantly'), { size: 19 }), { x: 800, y: 300, len: 700 });
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 120, 960, 220, mix(C.sage, C.moss, 0.4), C.moss) + rock(c, 1470, 985, 240, 90, C.rock2) + bush(c, 1660, 950, 170, C.moss));

    return (t, time) => {
      const T = time;
      set.sk.blend(MORNING, DAY, es(t, 0, 4));
      set.update(T, { sunY: 140, glow: 0.4 });
      /* v6 — they did not understand */
      const qk = (i) => es(t, 0.25 + i * 0.12, 0.45 + i * 0.12, ease.back) * (1 - es(t, 0.95, 1.1));
      /* v7a — He speaks again and goes to the gate; v7b — I am the door */
      const go = es(t, 1.2, 1.95);
      const jx = lerp(930, 800, go), jy = lerp(700, 606, go);
      const talk = Math.max(bump(t, 1.05, 1.95), bump(t, 2.05, 2.95), bump(t, 4.05, 4.95), bump(t, 8.05, 8.95));
      const door = es(t, 2.3, 2.7);
      const arms = es(t, 4.1, 4.4) * (1 - es(t, 4.95, 5.2));
      const lift = es(t, 8.2, 8.5);
      jesus.set({ x: jx, y: jy, s: 1.0, flip: go < 0.02 ? true : false, walk: go > 0 && go < 1 ? jx * 0.05 : undefined, armF: 14 + talk * 20 + arms * 70 + lift * 60, armB: 10 + bump(t, 2.1, 2.9) * 110 + arms * 80 + lift * 130, head: -lift * 8, blink: blinkAt(T, 1) });
      rings(jx + (go < 0.02 ? -12 : 12), jy - 170, talk, T, { dir: go < 0.02 ? -1 : 1, s0: 0.7, spread: 1.7 });
      const glow = door * (0.7 + bump(t, 4.0, 5.0) * 0.4 + es(t, 8.1, 8.5) * 0.6) * (1 - bump(t, 7.1, 8.1) * 0.6);
      vis(doorGlow, { x: 800, y: 540, s: 0.8 + glow * 0.5 + es(t, 8.1, 8.6) * 1.2, o: Math.min(1, glow) });
      vis(doorRays, { x: 800, y: 530, s: 0.7 + glow * 0.3 + es(t, 8.1, 8.6) * 0.9, o: Math.min(1, glow) * 0.8 });
      const ak = es(t, 2.35, 2.65, ease.back) * (1 - es(t, 3.0, 3.2)) + bump(t, 4.05, 4.95);
      vis(am, { x: 800, y: 250 - (1 - Math.min(1, ak)) * 60, s: Math.min(1, ak), o: ak > 0.01 ? 1 : 0 });
      /* v8 — the ones before: shadows over the wall; the sheep turn away */
      const sh = es(t, 3.1, 3.4) * (1 - es(t, 3.8, 4.0));
      before.forEach((b, i) => {
        b.p.set({ x: b.x, y: b.y + 150 - sh * 110, s: 0.8, flip: b.fl, armF: 50 + sh * 60, lean: sh * 12, head: 8 });
        fade(b.g, sh > 0.01 ? 0.8 : 0);
        darkRings[i](b.x + (b.fl ? -14 : 14), b.y + 150 - sh * 110 - 135, sh, T, { s0: 0.6, spread: 1.4 });
      });
      const away = es(t, 3.3, 3.55) * (1 - es(t, 3.9, 4.1));
      /* v9b — one goes in through Him; v9c — in and out, and pasture */
      const enter = es(t, 5.1, 5.8);
      const outK = es(t, 6.05, 6.7);
      inside.forEach((s) => {
        const i = s.i;
        let [x, y] = s.home;
        let fl = x > 800;
        let moving = false;
        if (i < 2) {
          // two come out to the pasture in v9c
          const P = [[x, y], [800, 540], [800, 610], [[700, 686], [880, 694]][i]];
          [x, y] = polyAt(P, outK);
          fl = outK > 0.5 ? (i === 0) : x > 800;
          moving = outK > 0 && outK < 1;
        }
        const graze = es(t, 6.5, 6.8) * (i < 2 ? 1 : 0.4) * (1 - es(t, 7.2, 7.4)) + es(t, 8.7, 8.95) * 0.6;
        s.r.set({ x, y, s: y > 600 ? 0.94 : 0.84, flip: away > 0.5 ? !fl : fl, head: -bump(t, 2.3, 2.9) * 10 + away * 26 + graze * 34, hop: moving ? Math.abs(Math.sin(T * 12 + i)) * 3 : 0 });
      });
      outside.forEach((s) => {
        const i = s.i;
        let [x, y] = s.home;
        let fl = x > 800, moving = false, sc = 0.94, o = 1;
        if (i === 0) {
          // v9b: in through the door, v9c: out again
          const P = [S0, [760, 660], [800, 612], [808, 560], [884, 540]];
          const u = enter * (1 - outK * 0.0);
          [x, y] = polyAt(P, u);
          const back = es(t, 6.2, 6.9);
          if (back > 0) [x, y] = polyAt([[884, 540], [808, 560], [800, 612], [760, 690], S0B], back);
          fl = back > 0 ? true : x > 880;
          moving = (enter > 0 && enter < 1) || (back > 0 && back < 1);
          sc = y < 600 ? 0.84 : 0.94;
        }
        const fleeT = bump(t, 7.3, 8.1);
        if (i === 2) x += fleeT * (PT ? -50 : 60);
        const graze = es(t, 6.5, 6.8) * (1 - es(t, 7.2, 7.4)) + es(t, 8.7, 8.95);
        s.r.set({ x, y, s: sc, flip: fl, head: away * 26 + graze * 34 - fleeT * 12, hop: moving || (i === 2 && fleeT > 0.1 && fleeT < 0.9) ? Math.abs(Math.sin(T * 12 + i)) * 3 : 0 + bump(t, 8.5, 9) * Math.abs(Math.sin(T * 7 + i)) * 6, o });
      });
      const sk = es(t, 5.45, 5.65) * (1 - es(t, 6.1, 6.3));
      vis(saved, { x: 896, y: 540, s: 0.9 + sk * 0.3, o: sk });
      /* the meadow: pasture found (v9c), threatened (v10a), abundant (v10b) */
      const found = es(t, 6.3, 6.8);
      const droop = es(t, 7.35, 7.8) * (1 - es(t, 8.15, 8.4));
      const bloom = es(t, 8.2, 8.8, ease.back);
      clumps.forEach((m) => {
        const base = m.i < 7 ? found : bloom * es(t, 8.2 + (m.i - 7) * 0.05, 8.5 + (m.i - 7) * 0.05);
        const k = Math.min(1.25, base + (m.i < 7 ? bloom * 0.25 : 0));
        vis(m.el, { x: m.x, y: m.y, s: m.s * k, sy: 1 - droop * 0.55, o: k > 0.01 ? 1 - droop * 0.35 : 0 });
      });
      const cr = es(t, 7.15, 7.7) * (1 - es(t, 8.1, 8.5));
      vis(creep, { x: lerp(1500, 1050, cr), y: 760, s: 1, o: cr });
      /* v10a — the thief */
      const th = es(t, 7.1, 7.5) * (1 - es(t, 8.1, 8.45));
      thief.set({ x: lerp(1360, THX, th), y: 716, s: 1.0, flip: true, walk: th > 0 && th < 1 ? T * 7 : undefined, lean: th * 12, armF: 30 + th * 50, armB: 10, head: 8, o: th > 0.01 ? 1 : 0, blink: blinkAt(T, 7) });
      bad.forEach((el, i) => {
        const k = es(t, 7.2 + i * 0.12, 7.45 + i * 0.12, ease.out) * (1 - es(t, 8.05, 8.25, ease.in));
        swing(el, BADX + i * BADD, 300 - (1 - k) * 700, k > 0.001 ? T : 0, 1.4, 0.8, i);
        fade(el, k > 0.001 ? 1 : 0);
      });
      const lk = es(t, 8.35, 8.65, ease.out);
      swing(life, 800, 190 - (1 - lk) * 700, lk > 0.001 ? T : 0, 1.2, 0.7, 3);
      fade(life, lk > 0.001 ? 1 : 0);
      /* the listeners */
      lis.forEach((m, i) => {
        vis(qs[i], { x: m.x + 20, y: m.y - 240 * m.s, s: qk(i), o: qk(i) > 0.01 ? 1 : 0 });
        m.p.set({ x: m.x, y: m.y, s: m.s, armF: 14 + bump(t, 0.2, 1) * 20 * (i % 2), armB: 8 + (i === 1 ? bump(t, 0.3, 1) * 50 : 0), head: -6 + bump(t, 0.2, 0.9) * (i % 2 ? 10 : -8), blink: blinkAt(T, m.seed) });
        mood(m, { angry: 0.2 + th * 0.4, sad: 0 });
      });

      S.cam.x = PT
        ? kf(t, [[0, -70], [1, -60], [2, -40], [6, -40], [7, -40], [8, -40], [9, -30]])
        : kf(t, [[0, -60], [1, -40], [2, 0], [3, 0], [4, 0], [6, 0], [7, 60], [8, 30], [9, 0]]);
      S.cam.y = kf(t, [[0, 20], [1, 20], [2.2, -60], [3, -20], [5, -20], [6.2, 30], [8.2, 20], [9, -40]]);
      S.cam.z = PT
        ? kf(t, [[0, 1.0], [2, 1.04], [3, 1.0], [5.2, 1.05], [6.5, 1.0], [9, 1.0]])
        : kf(t, [[0, 1.1], [2, 1.18], [3, 1.1], [5.2, 1.22], [6.5, 1.1], [8.2, 1.08], [9, 1.0]]);
    };
  },
};
