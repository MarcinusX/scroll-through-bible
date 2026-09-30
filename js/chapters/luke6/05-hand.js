// Łk 6,8–11 — in the synagogue. "He knew their thoughts": the watchers' thought hangs over their bench (the accuser's
// finger) and a thread of light runs to it from Jesus — He sees it; then to the man: "Rise and stand in the middle!"
// He gets up and comes out into the middle, into the light. "Is it lawful on the Sabbath to do good or to do harm, to
// save life or to destroy it?": two cards come down on either side of Him — a heart against a black knot, a burning lamp
// against a snuffed one. He looks round at them all, one by one (the camera goes along the benches with His gaze), and
// says "Stretch out your hand!" — the man stretches it out and it opens, whole as the other, in a burst of light; the
// benches rise in wonder. But the scribes and Pharisees jump up in a fury, storm clouds over their heads, and out by the
// wall their shadows lean together, talking over what they might do to Jesus.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { synagogueInterior, WITHERED, witheredHand, phOpts, scribeOpts, waxTablet, handAt, headAt, kf, moving, thought, bubble, sabbathTag, card, heart, sinKnot, handLamp, sparkle, shadowPerson, wisp, glow, pointHand, GLYPH, tr, PI } from './lib.js';
import { PHX } from './04-synagogue.js';

const FEET = 742;
const JX = 800;
const MX = 610;       // where the man sits
const MS = 640;       // where he stands, in the middle

function lampCard(c, lit) {
  const lamp = `<g transform="translate(0 16) scale(1.3)">${handLamp(c)}</g>`;
  if (lit) return `<circle cy="4" r="34" fill="url(#warm-glow)"/>${lamp}`;
  const smoke = c.ribbon(c.cbez([22, -8], [14, -24], [30, -34], [20, -52], 12), (u) => 3.4 - u * 2.6);
  return `${lamp.replace(/<path[^>]*fill="#f5c35c"[^>]*\/>/g, '').replace(/<circle[^>]*warm-glow[^>]*\/>/g, '')}<path d="${smoke}" fill="${C.rock2}" opacity=".85"/>`;
}

export default {
  id: 'lk6-hand',
  beats: [
    { v: 8, text: 'On wszakże znał ich myśli i rzekł do człowieka, który miał uschłą rękę: «Podnieś się i stań na środku!»' },
    { v: 8, cont: true, text: 'Podniósł się i stanął.' },
    { v: 9 },
    { v: 10, text: 'I spojrzawszy wkoło po wszystkich, rzekł do człowieka: «Wyciągnij rękę!»' },
    { v: 10, cont: true, text: 'Uczynił to i jego ręka stała się znów zdrowa.' },
    { v: 11 },
  ],
  cam: { x: [-60, 60], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    /* the shadows on the wall (behind everything on the floor) */
    const shL = S.layer({ par: 0.22, sh: 1, flat: true });
    const SH = [phOpts(0), scribeOpts(1), phOpts(2)].map((o, i) => ({ i, el: shL.add(`<g opacity="0">${shadowPerson(c, o, '#6a5a52')}</g>`) }));
    const knot = shL.add(`<g opacity="0">${wisp(c, 2.2, '#5a4a4a')}</g>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const [, FRONT] = I.benchY;
    const folk = I.congregation(L);
    const manSit = S.puppet(L.add(person(c, { ...WITHERED, pose: 'sit', holdF: witheredHand(c) })));
    const PH = [phOpts(0), { ...scribeOpts(1), holdF: `<g transform="translate(8 -4) rotate(-20)">${waxTablet(c)}</g>` }, phOpts(2)]
      .map((o, i) => ({ o, i, x: PHX[i], seed: c.rr(0, 9), sit: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))), stand: S.puppet(L.add(person(c, o))) }));

    const act = S.layer({ par: 0.5, sh: 5 });
    const DIS = [{ k: 'peter', x: 400 }, { k: 'john', x: 478 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const manGlow = act.add(`<g opacity="0">${glow(170, 1)}</g>`);
    const manSt = S.puppet(act.add(person(c, { ...WITHERED, holdF: witheredHand(c) })));
    const hW = manSt.el.querySelector('[data-part="wither"]'), hH = manSt.el.querySelector('[data-part="well"]');
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const heal = act.add(`<g opacity="0">${glow(130, 1)}</g>`);
    const healSp = [0, 1, 2, 3, 4].map((i) => act.add(`<g opacity="0">${sparkle(c, 10 + (i % 3) * 4)}</g>`));
    const rise = act.add(`<g opacity="0">${bubble(c, [tr('Podnieś się', 'Rise up,'), tr('i stań na środku!', 'stand in the middle!')], { size: 20, fill: C.halo, tail: 1 })}</g>`);
    const say = act.add(`<g opacity="0">${bubble(c, tr('Wyciągnij rękę!', 'Stretch out your hand!'), { size: 22, fill: C.halo, tail: 1 })}</g>`);

    /* hanging: their thought, the two questions */
    const fx = S.layer({ par: 0.3, sh: 6 });
    const tag = hanging(fx, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 880, y: 170, len: 800 });
    const accuse = fx.add(`<g>${thought(c, `<g transform="translate(-4 2) scale(.72) rotate(180)">${pointHand(c)}</g>`, { w: 96, h: 64 })}</g>`);
    const seeLine = fx.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [1, 0]], 3)}" fill="${C.lampGlow}"/></g>`);
    const pairs = [
      { x: 610, a: card(c, heart(c, 20), tr('dobrze czynić', 'do good'), { w: 118, h: 124 }), b: card(c, `<g transform="scale(1.6)">${sinKnot(c, 14)}</g>`, tr('źle czynić', 'do harm'), { w: 118, h: 124, face: mix(C.parchment, C.stone2, 0.5) }) },
      { x: 1000, a: card(c, lampCard(c, true), tr('ocalić życie', 'save a life'), { w: 118, h: 124 }), b: card(c, lampCard(c, false), tr('zniszczyć', 'destroy it'), { w: 118, h: 124, face: mix(C.parchment, C.stone2, 0.5) }) },
    ].map((p, i) => ({ ...p, i, ea: hanging(fx, p.a, { x: 0, y: -400, len: 900 }), eb: hanging(fx, p.b, { x: 0, y: -400, len: 900 }) }));
    const storms = PH.map(() => fx.add(`<g opacity="0">${thought(c, `<g transform="scale(1.3)">${GLYPH.storm(c)}</g>`, { w: 70, h: 52, fill: mix(C.storm, C.stone2, 0.5) })}</g>`));

    return (t, time) => {
      const T = time;
      I.flicker(T);
      pose(tag, { x: 880, y: 170, r: Math.sin(T * 0.8) * 0.8, oy: 0 });
      const amazed = es(t, 4.4, 4.6) * (1 - es(t, 5.3, 5.6) * 0.6);
      folk.forEach((m, i) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: amazed * (40 + (i % 3) * 20), armB: amazed * (i % 2 ? 120 : 30), head: -amazed * 6, blink: blinkAt(T, m.seed) }));

      /* v8a — He knows their thoughts; "Rise, stand in the middle!" */
      const acK = 1 - es(t, 0.95, 1.12);
      pose(accuse, { x: PHX[1] - 40, y: 500, s: 1.5, o: acK });
      const see = es(t, 0.1, 0.25) * (1 - es(t, 0.9, 1.05));
      const [jhx, jhy] = headAt(JX, FEET, 1.06, false);
      const tx = PHX[1] - 16, ty = 500 - 58 * 1.5;
      pose(seeLine, { x: jhx + 10, y: jhy - 4, sx: Math.hypot(tx - jhx, ty - jhy) * es(t, 0.1, 0.3), sy: 1, r: (Math.atan2(ty - jhy, tx - jhx) * 180) / PI, o: see * 0.9 });
      const rk = es(t, 0.62, 0.8, ease.back) * (1 - es(t, 1.2, 1.3));
      pose(rise, { x: jhx - 40, y: jhy - 44, s: rk, o: rk > 0.01 ? 1 : 0 });

      /* v8b — he gets up and stands in the middle */
      const up = es(t, 1.08, 1.14);
      const mw = es(t, 1.14, 1.5);
      const mx = lerp(MX + 10, MS, mw);
      manSit.set({ x: MX, y: FRONT, s: 0.92, flip: false, o: 1 - up, armF: 34, head: 8, blink: blinkAt(T, 5) });
      const reach = es(t, 3.62, 3.9);
      const well = es(t, 4.1, 4.3);
      const joy = es(t, 4.3, 4.55);
      const tremble = bump(t, 3.5, 4.05) * Math.sin(t * 60) * 3;
      const manArm = 34 * (1 - reach) + reach * 92 + joy * 30 + tremble;
      manSt.set({ x: mx, y: FEET, s: 0.98, flip: false, o: up, walk: mw > 0 && mw < 1 ? mx * 0.06 : undefined, armF: manArm, armB: joy * 130, head: -3 - joy * 8, lean: -joy * 3, blink: blinkAt(T, 5) });
      fade(hW, 1 - well); fade(hH, well);
      pose(manGlow, { x: mx, y: FEET - 110, s: 1.2, o: es(t, 1.2, 1.5) * (1 - es(t, 2.0, 2.3) * 0.5) + bump(t, 4.0, 5.2) * 0.6 });

      /* v9 — the two questions */
      pairs.forEach((p) => {
        const d = es(t, 2.05 + p.i * 0.15, 2.35 + p.i * 0.15, ease.back) * (1 - es(t, 3.0, 3.25));
        const sep = 70;
        pose(p.ea, { x: p.x - sep, y: lerp(-400, 214, d), r: Math.sin(T * 0.9 + p.i) * 1.2, oy: 0, o: d > 0.01 ? 1 : 0 });
        pose(p.eb, { x: p.x + sep, y: lerp(-400, 236, d), r: Math.sin(T * 0.8 + p.i + 1) * 1.2, oy: 0, o: d > 0.01 ? 1 : 0 });
      });

      /* Jesus: to the watchers, to the man, round at them all, to the man */
      const look = kf(t, [[3.0, 0], [3.2, -1], [3.35, -1], [3.5, 1], [3.6, 1]]);
      const toMan = t < 1.5 ? es(t, 0.6, 0.7) : t > 3.55 ? es(t, 3.55, 3.62) : 0;
      const ask = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.0));
      const stretch = es(t, 3.6, 3.85) * (1 - es(t, 4.6, 4.9));
      const sad = es(t, 5.15, 5.4);
      jesus.set({ x: JX, y: FEET, s: 1.06, flip: toMan > 0.5 || (t > 3.0 && t < 3.55 && look < 0) || t > 5.2, armF: 14 + bump(t, 0.62, 1.2) * 50 + ask * 60 + stretch * 76, armB: 8 + ask * 40, head: -2 - stretch * 3 + sad * 6, blink: blinkAt(T, 2) });
      const sk = es(t, 3.62, 3.8, ease.back) * (1 - es(t, 4.1, 4.2));
      const [jhx2, jhy2] = headAt(JX, FEET, 1.06, true);
      pose(say, { x: jhx2 - 30, y: jhy2 - 50, s: sk, o: sk > 0.01 ? 1 : 0 });

      /* v10b — the hand is whole */
      const [hx, hy] = handAt(mx, FEET, 0.98, false, manArm);
      pose(heal, { x: hx, y: hy, o: bump(t, 4.05, 5.1) });
      healSp.forEach((sp, i) => {
        const k = seg(t, 4.1 + i * 0.05, 4.75 + i * 0.05);
        const a = i * 1.3 + 0.4;
        pose(sp, { x: hx + Math.cos(a) * k * 60, y: hy + Math.sin(a) * k * 50 - k * 20, s: Math.sin(k * PI), r: k * 90, o: k > 0 && k < 1 ? 1 : 0 });
      });
      DIS.forEach((d) => d.p.set({ x: d.x, y: FEET + (d.i ? 6 : -2), s: 0.96, flip: false, armF: 8 + joy * 40, armB: 6 + joy * (d.i ? 100 : 20), head: -2 - joy * 6, blink: blinkAt(T, d.seed) }));

      /* v11 — fury; they put their heads together */
      const huddle = es(t, 5.3, 5.7);
      PH.forEach((m) => {
        const frown = es(t, 2.2, 2.5);
        const jump = es(t, 5.02 + m.i * 0.04, 5.08 + m.i * 0.04);
        const x = lerp(m.x - 10, 1150 + (m.i - 1) * 62, huddle);
        const write = m.i === 1 ? 1 - es(t, 0.5, 0.7) : 0;
        m.sit.set({ x: m.x, y: FRONT, s: 0.9, flip: true, o: 1 - jump, armF: 10 + write * 50 + frown * 20, armB: frown * 30, head: frown * 6, blink: Math.max(frown * 0.5, blinkAt(T, m.seed)) });
        const shake = time ? Math.sin(T * 18 + m.i) * 2.5 * (1 - huddle) * jump : 0;
        const faceIn = huddle > 0.5 ? m.i === 0 ? false : true : true;
        m.stand.set({ x: x + shake, y: FEET - 30 - (m.i === 1 ? 6 : 0), s: 0.92, flip: faceIn, o: jump, walk: huddle > 0.02 && huddle < 0.98 ? x * 0.06 : undefined, armF: 40 + (1 - huddle) * 60 + huddle * 10, armB: 30 + (1 - huddle) * 90, head: 6 + huddle * 10, lean: huddle * 8, blink: 0.5 });
        const [shx, shy] = headAt(x, FEET - 30, 0.92, faceIn);
        const st = es(t, 5.05 + m.i * 0.05, 5.2 + m.i * 0.05, ease.back);
        pose(storms[m.i], { x: shx - 10, y: shy - 8 - huddle * 20, s: st, o: st > 0.01 ? 1 : 0 });
      });
      SH.forEach((m) => {
        const k = es(t, 5.3 + m.i * 0.05, 5.5 + m.i * 0.05);
        const x = lerp(1000 + m.i * 110, 1090 + (m.i - 1) * 64, huddle);
        pose(m.el, { x, y: 560, s: 1.1, sx: m.i === 2 ? -1 : 1, o: k * 0.32 });
      });
      pose(knot, { x: 1100, y: 400, s: 0.6 + huddle * 0.5, r: Math.sin(T * 0.9) * 6, o: huddle * 0.6 });

      S.cam.x = kf(t, [[-0.5, 20], [0.4, 30], [0.9, -20], [1.9, -20], [2.2, 0], [3.0, 0], [3.2, -60], [3.35, -60], [3.52, 60], [3.62, -10], [4.9, -10], [5.2, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [1.9, 1.06], [2.2, 1.02], [3.0, 1.02], [3.2, 1.08], [3.52, 1.08], [3.7, 1.12], [4.9, 1.12], [5.2, 1.04]]);
      S.cam.y = kf(t, [[-0.5, 20], [2.2, 10], [3.0, 10], [3.7, 50], [4.9, 50], [5.2, 20]]);
    };
  },
};
