// Łk 12,8–10 — two floors of the theatre: a village square below, and above it a golden floor of cloud where the Son of
// Man stands in light among four angels. Down in the square two men press Philip — "Are you one of His?" — and he lays
// his hand on his heart and points up; above, Jesus turns to the angels and points down to him, and a golden thread
// runs up from Philip to Him. On the other side a man asked the same waves it away: "I do not know Him"; above, Jesus
// turns His face from him, the angels bow their heads, and his half-spun thread fades and drops. "A word against the Son
// of Man will be forgiven": a man shouts a jagged dark word up at Him; He looks at him, the word turns white and flutters
// away, the man bows his head. "But against the Holy Spirit": the dove comes down between the floors in its light; a man
// shakes his fist at it and shouts; the light draws back from him, a shadow closes round him, his dark knot stays, and a
// red cross is laid over it.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { shout, bang, sinKnot, crossX, glow } from '../matthew12/lib.js';
import { rayBurst } from '../john1/lib.js';
import { village, DAY, angel, cloudBand, L3, dove, flapWings, headAt, hand, question, sparkle, heart, manO, kf, halo, PI } from './lib.js';

const F = 716;                        // the square
const UP = 338, JX = 800;             // the floor of cloud
const CF = { x: 600, flip: true }, D = { x: 960, flip: false };
const QS = [{ x: 430, flip: false }, { x: 506, flip: false }, { x: 1040, flip: true }, { x: 1110, flip: true }];
const ANG = [{ x: 590, flip: false }, { x: 672, flip: false }, { x: 928, flip: true }, { x: 1010, flip: true }];

export default {
  id: 'lk12-angels',
  beats: [
    { v: 8 },
    { v: 9 },
    { v: 10, text: 'Każdemu, kto mówi jakieś słowo przeciw Synowi Człowieczemu, będzie przebaczone,' },
    { v: 10, cont: true, text: 'lecz temu, kto bluźni przeciw Duchowi Świętemu, nie będzie przebaczone.' },
  ],
  cam: { x: [-30, 40], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const V = village(S, { skyCols: DAY, sunAt: [1250, -600], seed: 'lk12-square' });
    const c = S.c;

    /* the floor of cloud and its light */
    const heaven = S.layer({ par: 0.2, sh: 4 });
    heaven.add(`<g>${cloudBand(c, { y: UP + 22, col: '#fbf1d8', col2: '#efd9a8', r0: 36, r1: 70 })}</g>`);
    const hl = S.layer({ par: 0.2, sh: 0, flat: true });
    hl.add(`<g transform="translate(${JX} ${UP - 110})">${glow(300, 0.9, 'halo-glow')}${rayBurst(c, { n: 26, r0: 60, r1: 380, spread: 0.04, color: '#fff3cf', o: 0.38 })}</g>`);
    const up = S.layer({ par: 0.2, sh: 5 });
    const angels = ANG.map((a, i) => ({ ...a, i, seed: c.rr(0, 9), p: S.puppet(up.add(angel(c))) }));
    const jesus = S.puppet(up.add(person(c, { ...CAST.jesus })));

    /* the square */
    const low = S.layer({ par: 0.45, sh: 5 });
    const shadeL = S.layer({ par: 0.45, sh: 1, flat: true });
    const dg = S.id('dark');
    S.defs(`<radialGradient id="${dg}"><stop offset="0" stop-color="#2a2338" stop-opacity=".62"/><stop offset=".6" stop-color="#2a2338" stop-opacity=".35"/><stop offset="1" stop-color="#2a2338" stop-opacity="0"/></radialGradient>`);
    const shadow = shadeL.add(`<g opacity="0"><ellipse cy="-110" rx="120" ry="170" fill="url(#${dg})"/></g>`);
    const qs = QS.map((q, i) => ({ ...q, i, seed: c.rr(0, 9), p: S.puppet(low.add(person(c, manO(c, i === 3 ? { robe: mix(C.plumRobe, C.storm, 0.3), hairStyle: 'wrap', veil: C.stone2 } : {})))) }));
    const conf = S.puppet(low.add(person(c, L3.philip)));
    const den = S.puppet(low.add(person(c, manO(c, { robe: C.ochreRobe, mantle: C.stone, hairStyle: 'short', beard: 'short' }))));

    /* threads, words, the dove */
    const fx = S.layer({ par: 0.32, sh: 4 });
    const TH = (col) => `<g opacity="0"><path d="${c.ribbon([[0, 0], [60, -8], [120, 4], [180, -4], [240, 2], [300, 0]], 3)}" fill="${col}"/></g>`;
    const thread = fx.add(TH(C.sun));
    const thread2 = fx.add(TH(mix(C.sun, C.stone2, 0.5)));
    const ask = [0, 1].map(() => fx.add(`<g opacity="0">${question(c)}</g>`));
    const love = fx.add(`<g opacity="0">${heart(c, 11)}</g>`);
    const sp = fx.add(`<g opacity="0">${sparkle(c, 14)}</g>`);
    const bubbleA = fx.add(`<g opacity="0"><g data-part="dark">${shout(c, bang(c, 24), { w: 62, h: 48, fill: mix(C.stone2, C.storm, 0.3) })}</g><g data-part="white" opacity="0">${shout(c, sparkle(c, 12, C.sun), { w: 62, h: 48, fill: C.cream })}</g></g>`);
    const bDark = bubbleA.querySelector('[data-part="dark"]'), bWhite = bubbleA.querySelector('[data-part="white"]');
    const bubbleP = fx.add(`<g opacity="0">${shout(c, bang(c, 26, C.cream), { w: 66, h: 52, fill: '#3b3243', flip: true })}</g>`);
    const knot = fx.add(`<g opacity="0">${sinKnot(c, 17)}</g>`);
    const nope = fx.add(`<g opacity="0">${crossX(c, 20)}</g>`);
    const dvL = S.layer({ par: 0.3, sh: 5 });
    const rays = dvL.add(`<g opacity="0">${glow(150, 1, 'halo-glow')}${rayBurst(c, { n: 18, r0: 40, r1: 240, spread: 0.045, color: '#fff3cf', o: 0.55 })}</g>`);
    const doveEl = dvL.add(dove(c));

    const setThread = (el, x0, y0, x1, y1, k, o) => {
      const L = Math.hypot(x1 - x0, y1 - y0), a = (Math.atan2(y1 - y0, x1 - x0) * 180) / PI;
      pose(el, { x: x0, y: y0, r: a, sx: Math.max(0.001, (k * L) / 300), o });
    };

    return (t, time) => {
      const T = time;
      V.update(t, T);
      /* v8 — "are you one of His?" — "He is my Lord" */
      const press = bump(t, 0.02, 0.5), confess = es(t, 0.3, 0.45), pointUp = es(t, 0.45, 0.6);
      conf.set({ x: CF.x, y: F, s: 0.95, flip: CF.flip, armF: 20 + confess * 70 * (1 - pointUp) + pointUp * 40, armB: 10 + pointUp * 150, head: -pointUp * 14, blink: blinkAt(T, 1) });
      const [chx, chy] = headAt(CF.x, F, 0.95, CF.flip);
      pose(love, { x: CF.x - 6, y: F - 118, s: es(t, 0.32, 0.45, ease.back) * 0.9, o: es(t, 0.3, 0.34) * (1 - es(t, 1.9, 2.0)) });
      /* v9 — the other waves it away */
      const pressD = bump(t, 1.02, 1.5), deny = bump(t, 1.28, 1.95), away = es(t, 1.3, 1.45);
      den.set({ x: D.x, y: F + 4, s: 0.95, flip: away > 0.5, armF: 20 + deny * 80, armB: 10 + deny * 30, head: away > 0.5 ? -4 : 8, lean: -deny * 5, blink: blinkAt(T, 4) });
      const [dhx, dhy] = headAt(D.x, F + 4, 0.95, away > 0.5);
      /* the questioners; one shouts at the Son of Man (v10a), one at the Spirit (v10b) */
      const aShout = bump(t, 2.05, 2.5), bow = es(t, 2.55, 2.8);
      const fist = bump(t, 3.28, 3.75) + bump(t, 3.55, 3.95) * 0.5;
      qs.forEach((q) => {
        const pt = q.i < 2 ? press : pressD;
        let o = { x: q.x, y: F + (q.i % 2) * 8, s: 0.93, flip: q.flip, armF: 16 + pt * 70, armB: 8, head: pt * 4, blink: blinkAt(T, q.seed) };
        if (q.i === 1) o = { ...o, armF: o.armF + aShout * 100 - bow * 10, armB: 8 + aShout * 40, head: -aShout * 18 + bow * 16, lean: bow * 6, blink: bow > 0.5 ? 0.9 : o.blink };
        if (q.i === 3) o = { ...o, flip: t > 3.0 ? false : q.flip, armF: o.armF + fist * 110, armB: 8 + fist * 20, head: -fist * 20, lean: -fist * 4 };
        q.p.set(o);
      });
      ask.forEach((el, i) => {
        const k = i ? bump(t, 1.04, 1.5) : bump(t, 0.04, 0.5);
        pose(el, { x: i ? dhx + 40 : chx - 40, y: (i ? dhy : chy) - 70, s: k * 0.9, r: Math.sin(T + i) * 6, o: k > 0.02 ? 1 : 0 });
      });

      /* above: He owns him before the angels, and disowns the other */
      const turnL = es(t, 0.5, 0.6) * (1 - es(t, 1.35, 1.45));
      const turnAway = es(t, 1.5, 1.62) * (1 - es(t, 1.98, 2.05));
      const lookA = es(t, 2.2, 2.35) * (1 - es(t, 2.9, 3.0));
      jesus.set({ x: JX, y: UP, s: 0.84, flip: turnL > 0.5 || turnAway > 0.5, armF: 16 + turnL * 30 + bump(t, 0.55, 0.95) * 20 + lookA * 40, armB: 10 + turnL * 40, head: 12 * turnL + turnAway * 16 + lookA * 8 - es(t, 3.3, 3.6) * 6, blink: blinkAt(T) });
      const praise = bump(t, 0.7, 1.4), bowA = bump(t, 1.6, 2.1), grieve = es(t, 3.6, 3.85);
      angels.forEach((a) => {
        const left = a.i < 2;
        a.p.set({ x: a.x, y: UP + (a.i % 2) * 4, s: 0.66, flip: a.flip, armF: 20 + (left ? praise : 0) * 110 + grieve * 30, armB: 10 + (left ? praise : 0) * 130, head: (left ? -praise * 10 : bowA * 18) + grieve * 14, blink: blinkAt(T, a.seed) });
      });
      const k1 = es(t, 0.55, 0.85);
      setThread(thread, chx, chy - 28, JX - 10, UP - 20, k1, es(t, 0.55, 0.58) * (1 - es(t, 1.9, 2.02)));
      const k2 = es(t, 1.32, 1.52) * 0.55;
      const drop = es(t, 1.62, 1.95, ease.in);
      setThread(thread2, dhx, dhy - 28 + drop * 60, JX + 10, UP - 20 + drop * 300, k2, es(t, 1.32, 1.35) * (1 - drop));
      pose(sp, { x: JX - 10, y: UP - 30, s: bump(t, 0.8, 1.2), r: T * 40, o: bump(t, 0.8, 1.2) });

      /* v10a — a word against the Son of Man, forgiven */
      const [ahx, ahy] = headAt(qs[1].x, F + 8, 0.93, false);
      const ba = es(t, 2.08, 2.2, ease.back), wh = es(t, 2.45, 2.6), fly = es(t, 2.6, 2.95, ease.in);
      pose(bubbleA, { x: ahx + 20 + fly * 80, y: ahy - 30 - fly * 200, s: ba * (1 - fly * 0.5), r: fly * 40, o: ba > 0.01 ? 1 - fly : 0 });
      pose(bDark, { o: 1 - wh });
      pose(bWhite, { o: wh });

      /* v10b — against the Spirit: the light draws back, the shadow closes in */
      const dv = es(t, 3.02, 3.35);
      const DX = 880, DY = 470;
      const dark = es(t, 3.5, 3.8);
      pose(doveEl, { x: lerp(DX - 380, DX, dv), y: lerp(230, DY, dv), s: 1.05, o: dv > 0.001 ? 1 : 0 });
      flapWings(doveEl, time ? T : 0.3, dv < 1 ? 34 : 18, dv < 1 ? 7 : 2.6);
      pose(rays, { x: DX, y: DY - 10, s: 0.6 + dv * 0.4 - dark * 0.25, r: T * 3, o: dv * (1 - dark * 0.35) });
      const [phx, phy] = headAt(qs[3].x, F + 8, 0.93, false);
      const bp = es(t, 3.3, 3.42, ease.back);
      pose(bubbleP, { x: phx - 10, y: phy - 40, s: bp, r: -10, o: bp > 0.01 ? 1 - es(t, 3.85, 3.95) * 0.3 : 0 });
      pose(shadow, { x: qs[3].x, y: F + 8, sx: 0.9 + dark * 0.2, o: dark });
      pose(knot, { x: phx + 2, y: phy - 44 - es(t, 3.5, 3.8) * 20, s: es(t, 3.45, 3.6, ease.back) * (1 + dark * 0.4), r: Math.sin(T * 0.8) * 5, o: es(t, 3.45, 3.5) });
      const nk = es(t, 3.72, 3.86, ease.back);
      pose(nope, { x: phx + 2, y: phy - 64, s: nk, o: nk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -20], [0.9, -20], [1.2, 30], [1.95, 30], [2.2, -20], [2.95, -20], [3.2, 30]]);
      S.cam.y = kf(t, [[-0.5, -20], [3.0, -20], [3.3, 10]]);
      S.cam.z = 1.02 + bump(t, 2.0, 3.0) * 0.03;
    };
  },
};
