// Mt 12,12–14 — back in the synagogue. "How much more valuable is a man than a sheep!": Jesus calls the man up, and a
// pair of scales comes down — the little paper sheep on one pan, the man on the other, and the man's side sinks.
// "It is lawful to do good on the Sabbath": the question mark over the Pharisees turns round into a heart. "Stretch
// out your hand!" — He reaches towards him; the man stretches out his shrivelled hand, and it opens, whole as the
// other, in a burst of light, and the benches rise in wonder. The Pharisees get up and stride out, and on the wall
// behind them their shadows lean together and plot how to destroy Him.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { synagogueInterior, WITHERED, witheredHand, phOpts, scribeOpts, handAt, headAt, kf, moving, question, heart, bubble, sabbathTag, scalesParts, poseScales, ewe, sparkle, shadowPerson, wisp, glow, tr, PI } from './lib.js';

const FEET = 742;
const JX = 800;
const MX = 610;       // where the man sits
const MS = 648;       // where he stands, called to the middle

export default {
  id: 'mt12-hand',
  beats: [
    { v: 12, text: 'O ileż ważniejszy jest człowiek niż owca!' },
    { v: 12, cont: true, text: 'Tak więc wolno jest w szabat dobrze czynić».' },
    { v: 13, text: 'Wtedy rzekł do owego człowieka: «Wyciągnij rękę!»' },
    { v: 13, cont: true, text: 'Wyciągnął, i stała się znów tak zdrowa jak druga.' },
    { v: 14 },
  ],
  cam: { x: [-40, 40], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const I = synagogueInterior(S);
    /* the shadows on the wall (behind everything on the floor) */
    const shL = S.layer({ par: 0.22, sh: 1, flat: true });
    const SH = [phOpts(0), scribeOpts(1), phOpts(2)].map((o, i) => ({ i, el: shL.add(`<g opacity="0">${shadowPerson(c, o, '#6a5a52')}</g>`) }));
    const knot = shL.add(`<g opacity="0">${wisp(c, 2.2, '#5a4a4a')}</g>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const [, FRONT] = I.benchY;
    const folk = I.congregation(L);
    const manSit = S.puppet(L.add(person(c, { ...WITHERED, pose: 'sit', holdF: witheredHand(c) })));
    const PH = [{ x: P ? 990 : 1040, o: phOpts(0) }, { x: P ? 1036 : 1120, o: scribeOpts(1) }, { x: P ? 1082 : 1200, o: phOpts(2) }]
      .map((m, i) => ({ ...m, i, seed: c.rr(0, 9), sit: S.puppet(L.add(person(c, { ...m.o, pose: 'sit' }))), stand: S.puppet(L.add(person(c, m.o))) }));

    /* Jesus, the man standing, two disciples */
    const act = S.layer({ par: 0.5, sh: 5 });
    const DIS = [{ k: 'peter', x: 400 }, { k: 'john', x: 478 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const manGlow = act.add(`<g opacity="0">${glow(170, 1)}</g>`);
    const manSt = S.puppet(act.add(person(c, { ...WITHERED, holdF: witheredHand(c) })));
    const parts = (p) => ({ w: p.el.querySelector('[data-part="wither"]'), h: p.el.querySelector('[data-part="well"]') });
    const hSt = parts(manSt);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const thread = act.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [1, 0]], 4)}" fill="${C.lampGlow}"/></g>`);
    const heal = act.add(`<g opacity="0">${glow(130, 1)}${[0, 1, 2, 3, 4].map((i) => `<g data-part="sp">${sparkle(c, 10 + (i % 3) * 4)}</g>`).join('')}</g>`);
    const healSp = Array.from(heal.querySelectorAll('[data-part="sp"]'));
    const say = act.add(`<g opacity="0">${bubble(c, tr('Wyciągnij rękę!', 'Stretch out your hand!'), { size: 22, fill: C.halo, tail: 1 })}</g>`);

    /* hanging: the Sabbath, the question that becomes a heart, the scales */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const tag = hanging(fx, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 900, y: 140, len: 800 });
    const qh = hanging(fx, `<g data-k="qa"><g transform="scale(1.7)">${question(c)}</g></g><g data-k="qb" opacity="0">${sheet().p(c.cut(c.circ(0, 0, 44, 30), 0.5, 5), C.cream).out()}${heart(c, 28)}<text x="0" y="36" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="14" font-style="italic" fill="${C.ink}">${tr('dobrze czynić', 'do good')}</text></g>`, { x: P ? 1050 : 1150, y: 250, len: 800 });
    const qa = S.$('qa'), qb = S.$('qb');
    const sc = scalesParts(c, { arm: 110, drop: 70 });
    const mini = person(c, { ...WITHERED });
    const scl = {
      frame: fx.add(`<g>${sc.frame}</g>`), beam: fx.add(`<g>${sc.beam}</g>`),
      panL: fx.add(`<g>${sc.pan}<g transform="translate(-2 70) scale(.62)">${ewe(c, { wool: C.linen })}</g></g>`),
      panR: fx.add(`<g>${sc.pan}<g transform="translate(0 70) scale(.36)">${mini}</g></g>`),
    };

    return (t, time) => {
      const T = time;
      I.flicker(T);
      const amazed = es(t, 3.4, 3.6) * (1 - es(t, 4.6, 4.9) * 0.5);
      folk.forEach((m, i) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: amazed * (40 + (i % 3) * 20), armB: amazed * (i % 2 ? 120 : 30), head: -amazed * 6, blink: blinkAt(T, m.seed) }));

      /* v12a — He calls the man up; the scales */
      const rise = es(t, 0.15, 0.2);
      const mw = es(t, 0.2, 0.55);
      const mx = lerp(MX + 10, MS, mw);
      manSit.set({ x: MX, y: FRONT, s: 0.92, flip: false, o: 1 - rise, armF: 30, head: 8, blink: blinkAt(T, 5) });
      const reach = es(t, 3.02, 3.3) * (1 - es(t, 4.2, 4.6) * 0.5);
      const well = es(t, 3.25, 3.45);
      const joy = es(t, 3.45, 3.7);
      const tremble = bump(t, 2.3, 3.0) * Math.sin(t * 60) * 3;
      const manArm = 34 * (1 - reach) + reach * 92 + joy * 30 + tremble;
      manSt.set({ x: mx, y: FEET, s: 0.98, flip: false, o: rise, walk: mw > 0 && mw < 1 ? mx * 0.06 : undefined, armF: manArm, armB: joy * 130, head: -3 - bump(t, 2.2, 3.0) * 4 - joy * 8, lean: -joy * 3, blink: blinkAt(T, 5) });
      fade(hSt.w, 1 - well); fade(hSt.h, well);
      pose(manGlow, { x: mx, y: FEET - 110, o: bump(t, 0.1, 0.9) * 0.6 + bump(t, 3.1, 4.3) * 0.9 });

      const sd = es(t, 0.2, 0.5, ease.back) * (1 - es(t, 1.05, 1.3));
      const tilt = es(t, 0.45, 0.7, ease.back) * 16;
      poseScales(scl, 820, lerp(-300, 230, sd), tilt + Math.sin(T * 0.9) * 0.8, sd > 0.01 ? 1 : 0, 1.3, 110);

      /* v12b — the question turns into a heart */
      const flipK = seg(t, 1.2, 1.45);
      pose(qh, { x: P ? 1050 : 1150, y: 250, sx: Math.max(0.04, Math.abs(Math.cos(flipK * PI))), r: Math.sin(T * 1.1) * 1.2, oy: 0 });
      fade(qa, flipK < 0.5 ? 1 : 0); fade(qb, flipK < 0.5 ? 0 : 1);
      pose(tag, { x: 900, y: 140, r: Math.sin(T * 0.8) * 0.8, oy: 0 });

      /* Jesus: to the Pharisees, then to the man */
      const toMan = t < 0.95 ? es(t, 0.05, 0.12) : es(t, 1.95, 2.05);
      const toPh = t >= 0.95 && t < 2 ? 1 : 0;
      const stretch = es(t, 2.1, 2.4) * (1 - es(t, 3.6, 3.9));
      const beckon = bump(t, 0.05, 0.55);
      const sad = es(t, 4.2, 4.5);
      jesus.set({ x: JX, y: FEET, s: 1.06, flip: toPh ? false : toMan > 0.5 || t >= 4.1, armF: 14 + beckon * 60 + toPh * 30 * es(t, 1.0, 1.2) + stretch * 76, armB: 8 + toPh * 40 * es(t, 1.05, 1.25), head: -2 - stretch * 3 + sad * 6, blink: blinkAt(T, 2) });
      const sk = es(t, 2.12, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      const [jhx, jhy] = headAt(JX, FEET, 1.06, true);
      pose(say, { x: jhx - 30, y: jhy - 50, s: sk, o: sk > 0.01 ? 1 : 0 });
      const [hx, hy] = handAt(mx, FEET, 0.98, false, manArm);
      const [jax, jay] = handAt(JX, FEET, 1.06, true, 14 + stretch * 76);
      const th = es(t, 2.4, 2.7) * (1 - es(t, 3.3, 3.5));
      pose(thread, { x: hx, y: hy, sx: Math.hypot(jax - hx, jay - hy) * th, sy: 1, r: (Math.atan2(jay - hy, jax - hx) * 180) / PI, o: th > 0.01 ? 0.85 : 0 });
      pose(heal, { x: hx, y: hy, o: bump(t, 3.2, 4.3) });
      healSp.forEach((sp, i) => {
        const k = seg(t, 3.25 + i * 0.05, 3.95 + i * 0.05);
        const a = i * 1.3 + 0.4;
        pose(sp, { x: Math.cos(a) * k * 60, y: Math.sin(a) * k * 50 - k * 20, s: Math.sin(k * PI), r: k * 90 });
      });
      DIS.forEach((d) => d.p.set({ x: d.x, y: FEET + (d.i ? 6 : -2), s: 0.96, flip: false, armF: 8 + joy * 40, armB: 6 + joy * (d.i ? 100 : 20), head: -2 - joy * 6, blink: blinkAt(T, d.seed) }));

      /* v14 — the Pharisees go out; their shadows plot on the wall */
      PH.forEach((m) => {
        const frown = es(t, 1.3, 1.5);
        const up = es(t, 4.05 + m.i * 0.04, 4.1 + m.i * 0.04);
        const go = es(t, 4.1 + m.i * 0.05, 4.55 + m.i * 0.05);
        const x = lerp(m.x, 1560 + m.i * 60, ease.in(go));
        m.sit.set({ x: m.x, y: FRONT, s: 0.9, flip: true, o: 1 - up, armF: 10 + frown * 30, armB: frown * 30, head: frown * 6, blink: Math.max(frown * 0.5, blinkAt(T, m.seed)) });
        m.stand.set({ x, y: FEET - 30, s: 0.92, flip: false, o: up, walk: go > 0 && go < 1 ? x * 0.06 : undefined, head: 4, blink: 0.5 });
      });
      const huddle = es(t, 4.35, 4.7);
      SH.forEach((m) => {
        const k = es(t, 4.2 + m.i * 0.05, 4.45 + m.i * 0.05);
        const x = P ? lerp(900 + m.i * 100, 990 + (m.i - 1) * 60, huddle) : lerp(1000 + m.i * 110, 1090 + (m.i - 1) * 64, huddle);   // phone: the plot happens inside the screen
        pose(m.el, { x, y: 560, s: 1.1, sx: m.i === 2 ? -1 : 1, o: k * 0.32 });
      });
      pose(knot, { x: P ? 1000 : 1100, y: 400, s: 0.6 + huddle * 0.5, r: Math.sin(T * 0.9) * 6, o: huddle * 0.6 });

      S.cam.x = kf(t, [[-0.5, 0], [0.4, -20], [1.0, 20], [1.9, 20], [2.2, -30], [3.9, -30], [4.2, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.4, 1.06], [1.9, 1.06], [2.2, 1.12], [3.9, 1.12], [4.2, 1.04]]);
      S.cam.y = kf(t, [[-0.5, 20], [2.2, 50], [3.9, 50], [4.2, 20]]);
    };
  },
};
