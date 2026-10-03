// Mk 1,21–22 — into Capernaum: the painted street drop with the synagogue flies up to reveal its interior;
// on the Sabbath Jesus teaches by the reading desk; everyone is astonished — He teaches with authority,
// not like the scribes, whose grey little words droop while His go out in golden rings.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { SCRIBE, headAt, voiceRings, synagogueInterior, synagogueFacade, scrollParts, bubble } from './lib.js';

const PI = Math.PI;
const JX = 800, FEET = 742;

export default {
  id: 'm1-synagogue',
  beats: [
    { v: 21, text: 'Przyszli do Kafarnaum.' },
    { v: 21, cont: true, text: 'Zaraz w szabat wszedł do synagogi i nauczał.' },
    { v: 22, text: 'Zdumiewali się Jego nauką:' },
    { v: 22, cont: true, text: 'uczył ich bowiem jak ten, który ma władzę, a nie jak uczeni w Piśmie.' },
  ],
  cam: { x: [-30, 30], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the benches' people, the disciples and the scribes sit closer to the middle
    // while the street drop hangs in front, the room behind it stays hidden (so it never flashes through during the set change)
    const room = [];
    const mkLayer = S.layer;
    S.layer = (o) => { const Ly = mkLayer(o); room.push(Ly); return Ly; };
    const I = synagogueInterior(S);
    const L = S.layer({ par: I.P, sh: 4 });
    const [BACK, FRONT] = I.benchY;
    const back = I.congregation(L);
    if (PH) back.forEach((m) => { m.x = m.x < 800 ? 497 + (m.x - 250) * 0.36 : 995 + (m.x - 1000) * 0.36; });
    const DIS = [
      { cast: CAST.peter, x: PH ? 547 : 440 }, { cast: CAST.andrew, x: PH ? 593 : 530 }, { cast: CAST.james, x: PH ? 502 : 360 }, { cast: CAST.john, x: PH ? 638 : 610 },
    ].map((d, i) => ({ ...d, p: S.puppet(L.add(person(c, { ...d.cast, pose: 'sit' }))), i }));
    const frontR = crowd(S, L, [{ y: FRONT, s: 0.86, n: 2, x0: 1250, x1: 1420, pose: 'sit' }]);
    // the reading desk with an open scroll
    const desk = sheet().p(c.cut([[-40, 0], [-30, -90], [30, -90], [40, 0]], 0.5, 6), C.wood).p(c.cut([[-54, -86], [54, -100], [50, -88], [-50, -76]], 0.4, 6), C.wood2)
      .p(c.cut([[-44, -96], [44, -106], [42, -96], [-42, -86]], 0.3, 6), C.parchment).x(c.ribbon([[-34, -94], [30, -101]], 1.4), C.ink, 'opacity=".4"').out();
    L.add(`<g transform="translate(900 ${FEET})">${desk}</g>`);
    const glow = L.add(`<circle r="190" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const sp = scrollParts(c, { w: 70, h: 60, lines: 4 });
    const scribes = [{ x: PH ? 1005 : 1085, s: 0.96 }, { x: PH ? 1072 : 1180, s: 0.92 }].map((o, i) => ({ ...o, i, p: S.puppet(L.add(person(c, { ...SCRIBE, robe: i ? C.stone2 : C.plumRobe, holdF: `<g transform="translate(-4 -2) rotate(80) scale(.7)">${sp.sheet}</g>` }))) }));
    const jVoice = voiceRings(L, c, { n: 3, color: C.sun, r: 44, w: 6 });
    const sVoice = scribes.map(() => voiceRings(L, c, { n: 2, color: C.rock2, r: 22, w: 3 }));
    const wows = [...back, ...DIS.map((d) => ({ ...d, y: FRONT, s: 0.86 }))].filter((m, i) => i % 2 === 0).slice(0, 7).map((m, i) => ({ m, el: L.add(`<g opacity="0">${paperLabel('!', { size: 24, w: 30 })}</g>`), i }));
    const dots = scribes.map((sc) => L.add(`<g opacity="0">${bubble('…', { size: 26, w: 60, flip: true })}</g>`));
    I.addColumns();

    /* ---------- the street drop: Capernaum and the synagogue from outside ---------- */
    S.layer = mkLayer;
    const drop = S.layer({ par: 0.3, sh: 8, pad: 1500 });
    drop.add(synagogueFacade(S, { signText: tr('Kafarnaum', 'Capernaum') }));
    const walkers = [CAST.jesus, CAST.peter, CAST.andrew, CAST.james, CAST.john].map((cast, i) => ({ p: S.puppet(drop.add(person(c, cast))), i }));

    return (t, time) => {
      I.flicker(time);
      room.forEach((Ly) => Ly.fade(seg(t, 0.9, 0.97)));

      /* v21a: they arrive in Capernaum and walk to the synagogue */
      walkers.forEach((w) => {
        const k = es(t, 0.02 + w.i * 0.04, 0.72 + w.i * 0.03);
        const inK = es(t, 0.76 + w.i * 0.04, 0.92 + w.i * 0.04);
        const gap = PH ? 57 : 105;   // phone: they walk closer together, all five on screen
        const end = PH ? 740 : 700, from = PH ? -60 - w.i * gap : -60 - w.i * 110;
        const x = lerp(from, end - w.i * gap, k) + inK * (800 - (end - w.i * gap));
        const y = lerp(730 + (w.i % 2) * 10, 640, inK);
        const moving = (k > 0 && k < 1) || (inK > 0 && inK < 1);
        w.p.set({ x, y, s: lerp(1, 0.8, inK), o: 1 - es(t, 0.86 + w.i * 0.04, 0.94 + w.i * 0.04), walk: moving ? x * 0.05 : undefined, armF: w.i === 0 ? bump(t, 0.75, 1.05) * 80 : 10, blink: blinkAt(time, w.i) });
      });
      drop.shift(0, -es(t, 0.98, 1.2, ease.in) * 1450);
      drop.fade(1 - seg(t, 1.16, 1.2));

      /* v21b: He teaches */
      const teach = es(t, 1.2, 1.45);
      const auth = es(t, 3.05, 3.35);
      jesus.set({
        x: JX, y: FEET, s: 1.05,
        armF: 30 + teach * (40 + Math.sin(time * 1.3) * 12) + auth * 30, armB: 10 + teach * 20 + auth * 100,
        head: -teach * 3, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(JX, FEET, 1.05);
      jVoice(hx, hy, teach * (0.55 + auth * 0.45), time, { spread: 2 + auth * 3, speed: 0.4 });
      pose(glow, { x: hx, y: hy + 40, s: 0.8 + auth * 0.7, o: teach * 0.25 + auth * 0.45 });

      /* v22a: astonishment */
      const amaze = es(t, 2.05, 2.35);
      [...back, ...frontR].forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 30 + amaze * 15, armB: amaze * (m.i % 2 ? 120 : 70), head: -amaze * 8 + bump(t, 2.05, 2.6) * -4, lean: -amaze * 5, blink: blinkAt(time, m.seed) }));
      DIS.forEach((d) => d.p.set({ x: d.x, y: FRONT, s: 0.86, flip: false, armF: 30 + amaze * 15, armB: amaze * (d.i % 2 ? 110 : 60), head: -amaze * 8, lean: -amaze * 4, blink: blinkAt(time, d.i + 7) }));
      wows.forEach((w) => {
        const k = es(t, 2.12 + w.i * 0.06, 2.3 + w.i * 0.06, ease.back);
        const [x, y] = headAt(w.m.x, w.m.y, w.m.s, false, 62);
        pose(w.el, { x: x + 18, y: y - 44 + Math.sin(time * 2 + w.i) * 3, s: k, r: Math.sin(time + w.i) * 6, o: k > 0 ? 1 - es(t, 3.0, 3.2) * 0.7 : 0 });
      });

      /* v22b: not like the scribes */
      scribes.forEach((sc, i) => {
        const read = es(t, 1.6, 1.9);
        sc.p.set({ x: sc.x, y: FEET + 2, s: sc.s, flip: true, armF: 70 + read * 10, armB: 20, head: 10 + Math.sin(time * 0.7 + i) * 2, blink: blinkAt(time, i + 11) });
        const [sx, sy] = headAt(sc.x, FEET + 2, sc.s, true);
        sVoice[i](sx - 14, sy + 6, es(t, 3.05, 3.3), time, { spread: 0.5, s0: 0.6, speed: 0.3, dir: -1 });
        const k = es(t, 3.1 + i * 0.1, 3.3 + i * 0.1, ease.back);
        pose(dots[i], { x: sx - 44, y: sy - 64 - k * 10, s: k, o: k > 0 ? 0.9 : 0 });
      });

      S.cam.z = 1.02 + es(t, 1.5, 2.0) * 0.03 + es(t, 3.0, 3.5) * 0.03;
      S.cam.y = 20;
    };
  },
};
