// Łk 4,36–37 — amazement: all through the synagogue people turn to one another, talking. "What is this word?":
// a gold slip of the Word hangs over Him and fingers point up at it. "With authority and power He commands the
// unclean spirits, and they come out!": the last dark shreds cowering in the corners are driven out through the
// high windows. And the report goes out everywhere: the map of Galilee comes down and gold slips fly from
// Capernaum to every town round the lake, and each one lights up.
import { C, person, CAST, blinkAt, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { synagogueInterior, POSSESSED, headAt, voiceRings, shadowShards, speech, GLYPH, paperLabel, goldSlip, rayBurst, galileeMap, hang2, manO, womanO, tr, PI } from './lib.js';

const JX = 820, FEET = 742;

export default {
  id: 'lk4-word',
  beats: [
    { v: 36, text: 'Wprawiło to wszystkich w zdumienie i mówili między sobą:' },
    { v: 36, cont: true, text: '«Cóż to za słowo?' },
    { v: 36, cont: true, text: 'Z władzą i mocą rozkazuje nawet duchom nieczystym, i wychodzą».' },
    { v: 37 },
  ],
  cam: { x: [-30, 30], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    const lightL = S.layer({ par: I.P, sh: 0, flat: true });
    const burst = lightL.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 40, r1: 380, spread: 0.045, o: 0.35 })}</g>`);
    const glow = lightL.add(`<circle r="170" fill="url(#halo-glow)" opacity=".4"/>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const back = I.congregation(L);
    const front = [[1060, true], [1150, true], [1240, true], [1330, true]].map(([x, fl], i) => ({ x, fl, i, p: S.puppet(L.add(person(c, { ...(i % 2 ? womanO(c) : manO(c)), pose: 'sit' }))) }));
    const desk = sheet().p(c.cut([[-40, 0], [-30, -90], [30, -90], [40, 0]], 0.5, 6), C.wood).p(c.cut([[-54, -86], [54, -100], [50, -88], [-50, -76]], 0.4, 6), C.wood2)
      .p(c.cut([[-44, -96], [44, -106], [42, -96], [-42, -86]], 0.3, 6), C.parchment).out();
    L.add(`<g transform="translate(930 ${FEET})">${desk}</g>`);
    const healed = S.puppet(L.add(person(c, { ...POSSESSED, hairStyle: 'short', pose: 'kneel' })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jVoice = voiceRings(L, c, { n: 3, color: C.sun, r: 44, w: 6 });
    const fx = S.layer({ par: I.P + 0.02, sh: 4 });
    const talk = back.map((m, i) => ({ m, i, el: fx.add(`<g opacity="0">${speech(c, i % 3 === 1 ? GLYPH.q(c) : GLYPH.bang(c), { w: 40, h: 36, flip: i % 2 === 1 })}</g>`) }));
    const ws = sheet().p(c.cut([[-116, -30], [116, -34], [120, 30], [-120, 34]], 0.6, 8), C.sunDeep).p(c.cut([[-108, -23], [108, -26], [111, 23], [-111, 26]], 0.5, 8), C.halo);
    let wl = '';
    for (let row = 0; row < 2; row++) { let x = -94; while (x < 90) { const l = c.rr(10, 26); wl += c.ribbon([[x, -7 + row * 14], [Math.min(x + l, 92), -7 + row * 14]], 2.6); x += l + 7; } }
    ws.x(wl, C.sunRay, 'opacity=".8"');
    const word = fx.add(`<g opacity="0"><circle r="170" fill="url(#halo-glow)"/>${ws.out()}</g>`);
    const qs = [0, 1, 2].map((i) => fx.add(`<g opacity="0">${paperLabel('?', { size: 26, w: 32 })}</g>`));
    const shreds = shadowShards(c, { n: 7, r: 46, color: '#2a2238' }).map((sh, i) => ({ ...sh, el: fx.add(`<g opacity="0">${sh.m}</g>`), x0: [420, 480, 1150, 1230, 540, 1100, 380][i], y0: [470, 520, 470, 520, 430, 420, 400][i], win: [420, 420, 1180, 1180, 800, 800, 420][i] }));
    I.addColumns();

    /* the report: the map of Galilee */
    const mapL = S.layer({ par: 0.3, sh: 8, pad: 1400 });
    const map = galileeMap(c);
    const [MS, MCX, MCY] = S.portrait ? [0.46, 870, 235] : [0.52, 975, 250];   // phone: the map hangs a little smaller, inside the screen
    mapL.add(`<g transform="translate(${MCX} ${MCY}) scale(${MS})">${hang2(map.markup, 300, 1400)}</g>`);
    const kaf = map.towns[0];
    const others = map.towns.slice(1);
    const birds = others.map((tw, i) => ({ tw, i, el: mapL.add(`<g opacity="0">${goldSlip(c, 30)}</g>`), lit: mapL.add(`<g opacity="0"><circle r="34" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, -4, 12, 4, 4, 0))}" fill="${C.sunDeep}"/></g>`) }));
    const home = mapL.add(`<g opacity="0"><circle r="44" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, -4, 16, 5, 4, 0))}" fill="${C.sunRay}"/></g>`);

    return (t, time) => {
      I.flicker(time);
      const speak = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: FEET, s: 1.05, flip: true, armF: 20 + speak * 50, armB: 10 + speak * 120, head: -speak * 4, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(JX, FEET, 1.05, true);
      pose(glow, { x: jhx, y: jhy + 30 });
      pose(burst, { x: jhx, y: jhy + 30, s: 0.5 + speak * 0.5, r: t * 8, o: speak * (1 - es(t, 2.9, 3.1)) });
      jVoice(jhx, jhy, speak * (1 - es(t, 2.9, 3.1)), time, { spread: 3, dir: -1 });
      healed.set({ x: 660, y: FEET, s: 1.02, armF: 80, armB: 110, head: -8, blink: blinkAt(time, 4) });

      /* v36a: they talk among themselves */
      const chat = es(t, 0.1, 0.35);
      back.forEach((m, i) => {
        const pair = chat > 0.5 && t < 1.0 ? i % 2 === 1 : m.x > JX;
        const up = es(t, 1.1, 1.3) * (1 - es(t, 2.0, 2.2)) * (i % 2);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: pair, armF: 30 + chat * 20 + up * 90 + es(t, 2.2, 2.5) * 30 * (i % 3 === 0 ? 1 : 0), armB: chat * (i % 3 === 0 ? 80 : 20), head: (i % 2 ? 4 : -4) * chat * (1 - es(t, 1.0, 1.2)) - up * 10, blink: blinkAt(time, m.seed) });
      });
      front.forEach((f) => f.p.set({ x: f.x, y: I.benchY[1], s: 0.86, flip: f.fl, armF: 30 + chat * 30, armB: chat * (f.i % 2 ? 90 : 0), blink: blinkAt(time, f.i + 7) }));
      talk.forEach((a) => {
        const k = es(t, 0.15 + a.i * 0.05, 0.3 + a.i * 0.05, ease.back) * (1 - es(t, 0.95, 1.05));
        const [x, y] = headAt(a.m.x, a.m.y, a.m.s, false, 62);
        pose(a.el, { x: x + (a.i % 2 ? -16 : 16), y: y - 20, s: k * 0.8, o: k > 0.02 ? 1 : 0 });
      });

      /* v36b: "what is this word?" */
      const wk = es(t, 1.05, 1.35, ease.back);
      pose(word, { x: 800, y: lerp(-200, 400, wk) + Math.sin(time * 1.1) * 4, r: Math.sin(time * 0.9) * 4, s: 0.95 + es(t, 2.0, 2.3) * 0.05, o: wk > 0.01 ? 1 - es(t, 2.95, 3.1) : 0 });
      qs.forEach((q, i) => { const k = es(t, 1.3 + i * 0.1, 1.45 + i * 0.1, ease.back) * (1 - es(t, 1.95, 2.1)); pose(q, { x: 670 + i * 130, y: 330 - (i % 2) * 30 + Math.sin(time * 2 + i) * 3, s: k, r: Math.sin(time + i) * 8, o: k > 0 ? 1 : 0 }); });

      /* v36c: He commands the unclean spirits — and they go out */
      shreds.forEach((sh, i) => {
        const go = es(t, 2.2 + i * 0.05, 2.7 + i * 0.05, ease.in);
        const tremble = (1 - go) * (time ? Math.sin(time * 20 + i) * 2 : 0);
        pose(sh.el, { x: lerp(sh.x0, sh.win, go) + tremble, y: lerp(sh.y0, 200, go), s: 1 - go * 0.5, r: go * 200 + tremble * 3, o: seg(t, 0.0, 0.2) * 0.9 * (1 - seg(go, 0.85, 1)) });
      });

      /* v37: the report goes out everywhere */
      const mIn = es(t, 3.0, 3.3, ease.out);
      mapL.shift(0, -(1 - mIn) * 1300);
      mapL.fade(seg(t, 2.95, 3.0));
      pose(home, { x: MCX + kaf.x * MS, y: MCY + (kaf.y - 8) * MS, s: 0.75 + Math.sin(time * 3) * 0.04, o: es(t, 3.25, 3.35) });
      birds.forEach((b) => {
        const a = 3.3 + b.i * 0.05, k = seg(t, a, a + 0.3);
        const x0 = MCX + kaf.x * MS, y0 = MCY + (kaf.y - 8) * MS, x1 = MCX + b.tw.x * MS, y1 = MCY + (b.tw.y - 8) * MS;
        pose(b.el, { x: lerp(x0, x1, ease.out(k)), y: lerp(y0, y1, k) - Math.sin(k * PI) * 34, s: 0.7, r: Math.sin(k * 8 + b.i) * 20, o: k > 0 && k < 1 ? 1 : 0 });
        const l = es(t, a + 0.28, a + 0.38, ease.back);
        pose(b.lit, { x: x1, y: y1, s: 0.7 * l * (1 + Math.sin(time * 3 + b.i) * 0.08), o: l > 0 ? 1 : 0 });
      });

      S.cam.z = 1.03 + es(t, 1.0, 1.3) * -0.02 + es(t, 2.0, 2.3) * 0.03;
      S.cam.y = 20;
    };
  },
};
