// Łk 4,31–32 — down to Capernaum by the lake (the same street and synagogue as in Mark 1): Jesus comes down the
// road with the townspeople on the Sabbath and goes in; the street drop flies up to show the room, and He
// teaches by the reading desk. They are astonished — His word has power: golden rings go out from Him and
// fill the room, and every face lights up.
import { C, person, CAST, blinkAt, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, synagogueFacade, headAt, voiceRings, paperLabel, sabbathTag, hangAt, manO, womanO, rayBurst, tr, PI } from './lib.js';

const JX = 800, FEET = 742;

export default {
  id: 'lk4-capernaum',
  beats: [
    { v: 31 },
    { v: 32 },
  ],
  cam: { x: [-30, 30], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const room = [];
    const mkLayer = S.layer;
    S.layer = (o) => { const Ly = mkLayer(o); room.push(Ly); return Ly; };
    const I = synagogueInterior(S);
    const lightL = S.layer({ par: I.P, sh: 0, flat: true });
    const burst = lightL.add(`<g opacity="0">${rayBurst(c, { n: 18, r0: 50, r1: 480, spread: 0.04, o: 0.3 })}</g>`);
    const glow = lightL.add(`<circle r="190" fill="url(#halo-glow)" opacity="0"/>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const back = I.congregation(L);
    const desk = sheet().p(c.cut([[-40, 0], [-30, -90], [30, -90], [40, 0]], 0.5, 6), C.wood).p(c.cut([[-54, -86], [54, -100], [50, -88], [-50, -76]], 0.4, 6), C.wood2)
      .p(c.cut([[-44, -96], [44, -106], [42, -96], [-42, -86]], 0.3, 6), C.parchment).x(c.ribbon([[-34, -94], [30, -101]], 1.4), C.ink, 'opacity=".4"').out();
    L.add(`<g transform="translate(900 ${FEET})">${desk}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const front = [[380, false], [470, false], [560, false], [1060, true], [1150, true], [1240, true]].map(([x, fl], i) => ({ x, fl, i, p: S.puppet(L.add(person(c, { ...(i % 2 ? womanO(c) : manO(c)), pose: 'sit' }))) }));
    const jVoice = voiceRings(L, c, { n: 4, color: C.sun, r: 44, w: 6 });
    const wows = [...back, ...front.map((f) => ({ ...f, y: I.benchY[1], s: 0.86 }))].filter((m, i) => i % 2 === 0).map((m, i) => ({ m, i, el: L.add(`<g opacity="0">${paperLabel('!', { size: 24, w: 30 })}</g>`) }));
    I.addColumns();

    /* the street drop: Capernaum and its synagogue from outside */
    S.layer = mkLayer;
    const drop = S.layer({ par: 0.3, sh: 8, pad: 1500 });
    drop.add(synagogueFacade(S, { signText: tr('Kafarnaum', 'Capernaum') }));
    const walkers = [CAST.jesus, manO(c), womanO(c), manO(c, { hairStyle: 'wrap', veil: C.linen2 })].map((o, i) => ({ p: S.puppet(drop.add(person(c, o))), i }));
    const tags = S.layer({ par: 0.3, sh: 6 });
    const sabbath = tags.add(`<g class="hang" transform="translate(0 -1500)"><path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${sabbathTag(c, tr('Szabat', 'Sabbath'))}</g></g>`);

    return (t, time) => {
      I.flicker(time);
      room.forEach((Ly) => Ly.fade(seg(t, 0.4, 0.46)));

      /* v31: down to Capernaum; in on the Sabbath */
      walkers.forEach((w) => {
        const d = w.i ? 0.03 + w.i * 0.03 : 0;
        const k = es(t, 0.0 + d, 0.3 + d * 0.3);
        const inK = es(t, 0.3 + w.i * 0.02, 0.4 + w.i * 0.02);
        const x0 = w.i ? 1400 + w.i * 90 : -60;
        const x = lerp(x0, w.i ? 900 + w.i * 40 : 700, k) + inK * (800 - lerp(x0, w.i ? 900 + w.i * 40 : 700, k));
        const y = lerp(700 + (w.i % 2) * 14, 736, k) - inK * 90;
        const moving = (k > 0 && k < 1) || (inK > 0 && inK < 1);
        w.p.set({ x, y, s: lerp(1, 0.8, inK), flip: w.i > 0 && inK < 0.5, o: 1 - es(t, 0.37 + w.i * 0.02, 0.43 + w.i * 0.02), walk: moving ? x * 0.05 : undefined, armF: 10, blink: blinkAt(time, w.i) });
      });
      drop.shift(0, -es(t, 0.44, 0.6, ease.in) * 1450);
      drop.fade(1 - seg(t, 0.56, 0.6));
      const sb = es(t, 0.02, 0.2, ease.back) * (1 - es(t, 0.36, 0.48, ease.in));
      hangAt(sabbath, 1000, lerp(-500, 180, sb), time, 1.4, 0.8);

      /* He teaches; v32: astonished — His word with power */
      const teach = es(t, 0.55, 0.72);
      const power = es(t, 1.05, 1.35);
      jesus.set({ x: JX, y: FEET, s: 1.05, armF: 30 + teach * 44 + power * 20, armB: 10 + teach * 20 + power * 110, head: -teach * 3, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, FEET, 1.05);
      jVoice(hx, hy, teach * (0.55 + power * 0.45), time, { spread: 2 + power * 4, speed: 0.4 });
      pose(glow, { x: hx, y: hy + 40, s: 0.8 + power * 0.7, o: teach * 0.25 + power * 0.5 });
      pose(burst, { x: hx, y: hy + 30, s: 0.6 + power * 0.5, r: t * 6, o: power * 0.8 });
      const amaze = es(t, 1.1, 1.35);
      back.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 30 + amaze * 15, armB: amaze * (m.i % 2 ? 120 : 70), head: -amaze * 8, lean: -amaze * 5, blink: blinkAt(time, m.seed) }));
      front.forEach((f) => f.p.set({ x: f.x, y: I.benchY[1], s: 0.86, flip: f.fl, armF: 30 + amaze * 15, armB: amaze * (f.i % 2 ? 110 : 60), head: -amaze * 8, lean: -amaze * 4, blink: blinkAt(time, f.i + 7) }));
      wows.forEach((w) => {
        const k = es(t, 1.15 + w.i * 0.05, 1.3 + w.i * 0.05, ease.back);
        const [x, y] = headAt(w.m.x, w.m.y, w.m.s, false, 62);
        pose(w.el, { x: x + 18, y: y - 44 + Math.sin(time * 2 + w.i) * 3, s: k, r: Math.sin(time + w.i) * 6, o: k > 0 ? 1 : 0 });
      });

      S.cam.z = 1.02 + es(t, 0.6, 1.4) * 0.05;
      S.cam.y = 20;
    };
  },
};
