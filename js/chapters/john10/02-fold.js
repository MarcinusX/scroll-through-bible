// J 10,1b–5 — the parable flies in: a round stone sheepfold at dawn, thorn brush along its walls, the moon going
// down. A hooded thief climbs up the back wall another way (a dark tag: thief and robber) and sinks away. The
// shepherd comes along the path to the gate; the old gatekeeper with his lantern opens it; the sheep lift their
// heads at his voice; he calls them one by one by name (little name tags appear on their necks) and they come out
// through the gate. When all are out he goes ahead and they follow him along the path, for they know his voice.
// A stranger calls from behind — the sheep scatter away from him and huddle round their shepherd.
import { C, person, blinkAt, pose, lerp, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import {
  pastureSet, foldParts, ewe, sheepRig, WOOLS, nameOf, SHEPHERD, KEEPER, THIEF, STRANGER, staff, lanternHeld, sack,
  voiceRings, nameTag, bubble, speech, GLYPH, heart2, bang, hanging, kf, vis, polyAt, polyLen, clipped, tr, DAWN, MORNING, PI,
} from './lib.js';
import { swing } from '../kit.js';
import { grass, rock, bush } from '../../assets/nature.js';
import { sheet } from '../kit.js';

const CX = 780, GY = 650;
const INSIDE = [[640, 546], [712, 556], [770, 538], [836, 552], [900, 544], [958, 556]];
const OUT = [[788, 596], [790, 668], [716, 696], [600, 708], [470, 714], [300, 716]];

export default {
  id: 'j10-fold',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 1, cont: true, text: 'Kto nie wchodzi do owczarni przez bramę, ale wdziera się inną drogą, ten jest złodziejem i rozbójnikiem.' },
    { v: 2 },
    { v: 3, text: 'Temu otwiera odźwierny,' },
    { v: 3, cont: true, text: 'a owce słuchają jego głosu;' },
    { v: 3, cont: true, text: 'woła on swoje owce po imieniu i wyprowadza je.' },
    { v: 4, text: 'A kiedy wszystkie wyprowadzi, staje na ich czele,' },
    { v: 4, cont: true, text: 'a owce postępują za nim, ponieważ głos jego znają.' },
    { v: 5 },
  ],
  cam: { x: [-180, 120], y: [-60, 60], z: [1, 1.32] },
  build(S) {
    const c = S.c;
    const set = pastureSet(S, { skyCols: DAWN, sunAt: [1260, 420], sunR: 44, moonAt: [430, 130], groundY: 560 });
    // the field the fold stands in
    const field = S.layer({ par: 0.45, sh: 3 });
    const ffn = c.wave(470, [5, 2], [600, 170]);
    field.add(sheet().p(c.ridge(ffn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage, 0.4)).out());
    field.add(grass(c, { x0: -1200, x1: 2800, y: 470, fn: ffn, n: 60, h: 13, color: C.moss }));
    const path = sheet().p(c.ribbon([[1600, 724], [1180, 718], [900, 704], [790, 688], [716, 698], [600, 710], [420, 718], [0, 726]], (u) => 30 + Math.sin(u * PI) * 16, 1), mix(C.sand, C.sand2, 0.4));
    path.p(c.ribbon([[790, 690], [786, 640]], 40, 1), mix(C.sand, C.sand2, 0.4));
    field.add(path.out());
    field.add(rock(c, 1240, 690, 70, 26, C.rock2) + bush(c, 360, 690, 80, C.sage, C.moss));
    // the thief (behind the back wall, clipped under the wall line)
    const thiefL = S.layer({ par: 0.45, sh: 5 });
    const thEl = thiefL.add(clipped(S, 'thief', [-1000, -1000, 3000, 506], person(c, { ...THIEF, holdB: sack(c) })));
    const thief = S.puppet(thEl.firstElementChild);
    const F = foldParts(c, { cx: CX, gy: GY });
    const G = F.G;
    const fb = S.layer({ par: 0.45, sh: 4 });
    fb.add(F.floor + F.back);
    const ff = S.layer({ par: 0.45, sh: 5 });
    ff.add(F.front);
    const gate = ff.add(`<g>${F.gate}</g>`);
    // actors: sheep, shepherd, gatekeeper, stranger
    const act = S.layer({ par: 0.45, sh: 5 });
    const sheep = INSIDE.map((p, i) => ({ i, home: p, r: sheepRig(act.add(ewe(c, { wool: WOOLS[i], tag: nameOf(i), patch: i === 1 }))) }));
    const keeper = S.puppet(act.add(person(c, { ...KEEPER, holdF: lanternHeld(c, 30) })));
    const shep = S.puppet(act.add(person(c, { ...SHEPHERD, holdF: staff(c, 190, 22) })));
    const stranger = S.puppet(act.add(person(c, STRANGER)));
    const fx = S.layer({ par: 0.5, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 32, w: 4.5, both: false, color: shade(C.ochre, 0.3) });
    const rings2 = voiceRings(fx, c, { n: 3, r: 30, w: 4, both: false, color: mix(C.storm, C.stone2, 0.3) });
    const tagT = hanging(fx, nameTag(c, tr('złodziej i rozbójnik', 'thief and robber'), { size: 17, dark: true }), { x: 620, y: 300, len: 700 });
    const tagS = hanging(fx, nameTag(c, tr('pasterz owiec', 'the shepherd'), { size: 17 }), { x: 1000, y: 330, len: 700 });
    const names = [0, 1, 2, 3, 4, 5].map((i) => fx.add(`<g>${bubble(c, nameOf(i), { size: 18, tail: -1 })}</g>`));
    const hearts = [0, 1, 2].map(() => fx.add(`<g>${heart2(c, 10)}</g>`));
    const strangerB = fx.add(`<g>${speech(c, `<path d="${c.ribbon([[-14, -6], [-6, 4], [2, -6], [10, 4], [16, -4]], 3)}" fill="${C.storm2}"/>`, { w: 58, h: 40, flip: true })}</g>`);
    const bangs = [0, 1, 2].map(() => fx.add(`<g>${bang(c, 12, C.terracotta)}</g>`));
    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 110, 960, 220, mix(C.sage, C.moss, 0.4), C.moss) + rock(c, 1470, 985, 240, 90, C.rock2) + bush(c, 1660, 950, 170, C.moss));

    // each sheep walks: home → just inside the gate → out along the path (OUT); the queue follows the shepherd
    const PATHS = sheep.map((s) => [s.home, [lerp(s.home[0], 788, 0.6), 578], ...OUT]);
    const LH = PATHS.map((P) => polyLen(P.slice(0, 3)));
    const TOT = PATHS.map((P) => polyLen(P));
    const OUTLEN = polyLen(OUT);
    const STX = S.portrait ? 1040 : 1130; // phone: the stranger stands nearer, so he and the shepherd are both in view

    return (t, time) => {
      const T = time;
      /* the dawn */
      const day = es(t, 0.6, 3.4);
      set.sk.blend(DAWN, MORNING, day);
      set.update(T, { sunY: lerp(420, 170, es(t, 0.4, 3.6, ease.out)), sunX: lerp(1260, 1210, day), glow: 0.7 - day * 0.3, moonY: lerp(130, 480, es(t, 0.3, 2.6, ease.in)), moonO: 1 - es(t, 1.8, 2.6) });

      /* v1b — the thief climbs up another way */
      const climb = es(t, 0.08, 0.5) * (1 - es(t, 0.9, 1.15));
      thief.set({ x: 660, y: lerp(720, 552, climb), s: 0.92, lean: climb * 20, armF: 30 + climb * 90, armB: 10 + climb * 40, head: 10 * climb, o: climb > 0.01 ? 1 : 0, blink: blinkAt(T, 5) });
      const tk = es(t, 0.35, 0.65, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      swing(tagT, 700, 300 - (1 - tk) * 700, tk > 0.001 ? T : 0, 1.4, 0.8);
      fade(tagT, tk > 0.001 ? 1 : 0);

      /* the shepherd: v2 to the gate, v3a into the gateway, v3c out to the path, v4 ahead along it */
      const come = es(t, 1.05, 1.75);
      const into = es(t, 2.75, 3.1);
      const outS = es(t, 3.98, 4.3);
      const dS = 90 + es(t, 5.05, 5.9) * 280 + es(t, 6.05, 6.9) * 40;
      let sx, sy, walking;
      if (t < 2.75) { sx = lerp(1340, 846, come); sy = lerp(716, 702, come); walking = come > 0 && come < 1; }
      else if (t < 3.98) { sx = lerp(846, 792, into); sy = lerp(702, 662, into); walking = into > 0 && into < 1; }
      else {
        const [px, py] = polyAt(OUT, dS / OUTLEN);
        sx = lerp(792, px, outS); sy = lerp(662, py, outS);
        walking = (outS > 0 && outS < 1) || (t > 5.05 && t < 5.9) || (t > 6.05 && t < 6.9);
      }
      const callL = bump(t, 3.15, 3.95), callN = bump(t, 4.05, 4.95);
      const lookBack = bump(t, 6.1, 6.95), turnS = es(t, 7.3, 7.5);
      shep.set({ x: sx, y: sy, s: 1.0, flip: !(lookBack > 0.4 || turnS > 0.5), walk: walking ? sx * 0.07 : undefined, armF: 22, armB: 10 + Math.max(callL, callN, lookBack * 0.9, bump(t, 7.4, 8) * 0.7) * 110, head: -Math.max(callL, callN) * 6, blink: blinkAt(T, 2) });
      const stk = es(t, 1.45, 1.75, ease.out) * (1 - es(t, 2.1, 2.3, ease.in));
      swing(tagS, 900, 330 - (1 - stk) * 700, stk > 0.001 ? T : 0, 1.2, 0.8, 1);
      fade(tagS, stk > 0.001 ? 1 : 0);
      const facingR = lookBack > 0.4 || turnS > 0.5;
      rings(sx + (facingR ? 16 : -16), sy - 172, Math.max(callL, lookBack, bump(t, 7.45, 7.98)), T, { dir: facingR ? 1 : -1, s0: 0.7, spread: 1.6 });

      /* v3a — the gatekeeper opens */
      const open = es(t, 2.2, 2.7);
      pose(gate, { x: G.gxL, y: G.gateY + 2, sx: Math.cos(open * 1.32) });
      keeper.set({ x: 896, y: 688, s: 0.94, flip: true, armF: 30 + bump(t, 2.05, 2.8) * 40, armB: 8 + bump(t, 1.6, 2.1) * 60, head: bump(t, 1.6, 2.1) * 8, lean: bump(t, 2.1, 2.8) * 10, blink: blinkAt(T, 4) });

      /* v3c — each called by name */
      names.forEach((el, i) => {
        const a = 4.08 + i * 0.13, k = es(t, a, a + 0.08, ease.back) * (1 - es(t, a + 0.2, a + 0.28));
        vis(el, { x: sx - 30, y: sy - 214, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v5 — the stranger */
      const sc = es(t, 7.02, 7.3);
      const back = es(t, 7.75, 7.98);
      stranger.set({ x: lerp(1330, STX, sc) + back * 30, y: 718, s: 1.0, flip: true, walk: sc > 0 && sc < 1 ? T * 8 : undefined, armF: 20 + bump(t, 7.1, 7.8) * 70, armB: 8 + back * 40, head: back * 10, o: sc > 0.001 ? 1 : 0, blink: blinkAt(T, 6) });
      const sb = es(t, 7.15, 7.3, ease.back) * (1 - es(t, 7.7, 7.85));
      vis(strangerB, { x: STX - 50, y: 520, s: sb, o: sb > 0.01 ? 1 : 0 });
      rings2(STX - 22, 550, bump(t, 7.12, 7.7), T, { dir: -1, s0: 0.6, spread: 1.5 });
      const look = bump(t, 7.08, 7.45);
      const flee = es(t, 7.38, 7.8, ease.out);

      sheep.forEach((s) => {
        const i = s.i;
        const hear = es(t, 3.2 + i * 0.05, 3.45 + i * 0.05);
        const called = es(t, 4.1 + i * 0.13, 4.24 + i * 0.13);
        const target = dS - 66 - i * 52;
        const pos = Math.max(0, LH[i] + target) * called;
        let [x, y, dir] = polyAt(PATHS[i], pos / TOT[i]);
        const moving = called > 0 && pos > 1 && ((t > 4.1 && t < 5.2) || (t > 5.05 && t < 5.9) || (t > 6.05 && t < 6.9));
        const hx = [-34, 16, 64, 108, 40, 90][i], hy = [-36, -42, -34, -16, -10, 2][i];
        const fx2 = lerp(x, sx + hx, flee), fy2 = lerp(y, sy + hy, flee);
        const hop = moving || (flee > 0 && flee < 1) ? Math.abs(Math.sin(T * 12 + i)) * 3 : 0;
        const faceR = look > 0.3 && flee < 0.3 ? true : flee >= 0.3 ? fx2 < sx : pos < 1 ? x < 788 : dir > 0;
        const inside = pos < LH[i] - 20;
        s.r.set({ x: fx2, y: fy2, s: inside ? 0.86 : 0.9, flip: !faceR, head: -hear * 16 * (inside ? 1 : 0.3) - bump(t, 6.1, 6.9) * 16 - look * 10, hop, tag: es(t, 4.1 + i * 0.13, 4.2 + i * 0.13) });
        s.x = fx2; s.y = fy2;
      });

      /* v4b — they know his voice */
      hearts.forEach((el, i) => {
        const k = bump(t, 6.2 + i * 0.12, 6.85 + i * 0.12);
        const m = sheep[i * 2];
        vis(el, { x: m.x + 20, y: m.y - 70 - k * 26, s: 0.9 + k * 0.3, o: k });
      });
      bangs.forEach((el, i) => {
        const k = es(t, 7.12 + i * 0.05, 7.24 + i * 0.05, ease.back) * (1 - es(t, 7.45, 7.6));
        const m = sheep[[5, 3, 1][i]];
        vis(el, { x: m.x + 26, y: m.y - 78, s: k * 1.2, o: k > 0.01 ? 1 : 0 });
      });

      // phone: the camera follows the shepherd down the path and draws back, so he is not cut off at the edge
      S.cam.x = S.portrait
        ? kf(t, [[0, -50], [0.9, -40], [1.8, 30], [2.8, 20], [3.6, 0], [5, -40], [6, -150], [7, -170], [7.4, -110], [8, -100]])
        : kf(t, [[0, -50], [0.9, -40], [1.8, 30], [2.8, 20], [3.6, 0], [5, -10], [6, -40], [7, -50], [7.4, 0], [8, -20]]);
      S.cam.y = kf(t, [[0, -30], [1, 0], [3, 20], [5, 40], [7, 40]]);
      S.cam.z = S.portrait
        ? kf(t, [[0, 1.3], [1.2, 1.18], [3, 1.3], [5, 1.16], [6, 1.05], [7.4, 1.0], [8, 1.0]])
        : kf(t, [[0, 1.3], [1.2, 1.18], [3, 1.3], [5, 1.22], [6.5, 1.18], [8, 1.16]]);
    };
  },
};
