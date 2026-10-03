// Łk 4,33–35 — in the same synagogue a man stands up, a jagged dark shadow spreading round him, and cries out at
// the top of his voice. "What have we to do with you, Jesus of Nazareth?" — the shadow looms towards Him. "Have you
// come to destroy us?" — it cringes and trembles. "I know who you are: the Holy One of God" — it points, and the
// light round Jesus grows. "Be silent, and come out of him!": the shadow flings the man down in the middle of the
// floor and tears away in shards out through the high windows — and he gets up unharmed, in a soft light.
import { C, person, CAST, blinkAt, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { synagogueInterior, POSSESSED, headAt, voiceRings, shadowShards, bubble, rayBurst, manO, womanO, tr, PI } from './lib.js';

const JX = 820, FEET = 742, MX0 = 560;

export default {
  id: 'lk4-demon',
  beats: [
    { v: 33, text: 'A był w synagodze człowiek, który miał w sobie ducha nieczystego.' },
    { v: 33, cont: true, text: 'Zaczął on krzyczeć wniebogłosy;' },
    { v: 34, text: '«Och, czego chcesz od nas, Jezusie Nazarejczyku?' },
    { v: 34, cont: true, text: 'Przyszedłeś nas zgubić?' },
    { v: 34, cont: true, text: 'Wiem, kto jesteś: Święty Boży».' },
    { v: 35, text: 'Lecz Jezus rozkazał mu surowo: «Milcz i wyjdź z niego!»' },
    { v: 35, cont: true, text: 'Wtedy zły duch rzucił go na środek i wyszedł z niego nie wyrządzając mu żadnej szkody.' },
  ],
  cam: { x: [-50, 30], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const MX = S.portrait ? 615 : MX0;   // phone: the man and his shadow stand inside the left edge
    const I = synagogueInterior(S);
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#241c30"/>`);
    tint.fade(0);
    const lightL = S.layer({ par: I.P, sh: 0, flat: true });
    const burst = lightL.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 40, r1: 380, spread: 0.045, o: 0.6 })}</g>`);
    const glow = lightL.add(`<circle r="190" fill="url(#halo-glow)" opacity="0"/>`);
    const peace = lightL.add(`<circle r="130" fill="url(#halo-glow)" opacity="0"/>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const back = I.congregation(L);
    const front = [[1060, true], [1150, true], [1240, true], [1330, true]].map(([x, fl], i) => ({ x, fl, i, p: S.puppet(L.add(person(c, { ...(i % 2 ? womanO(c) : manO(c)), pose: 'sit' }))) }));
    const desk = sheet().p(c.cut([[-40, 0], [-30, -90], [30, -90], [40, 0]], 0.5, 6), C.wood).p(c.cut([[-54, -86], [54, -100], [50, -88], [-50, -76]], 0.4, 6), C.wood2)
      .p(c.cut([[-44, -96], [44, -106], [42, -96], [-42, -86]], 0.3, 6), C.parchment).out();
    L.add(`<g transform="translate(930 ${FEET})">${desk}</g>`);

    /* the man and his shadow */
    const shards = shadowShards(c, { n: 11, r: 110 }).map((sh) => ({ ...sh, el: L.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.6, 1.2) }));
    const man = S.puppet(L.add(person(c, { ...POSSESSED })));
    const lying = S.puppet(L.add(person(c, { ...POSSESSED, eyes: 'closed' })));
    const sitting = S.puppet(L.add(person(c, { ...POSSESSED, hairStyle: 'short', pose: 'kneel' })));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jVoice = voiceRings(L, c, { n: 3, color: C.sun, r: 44, w: 6 });

    /* speech */
    const dark = { jag: true, c, fill: '#4a3f58', ink: C.cream };
    const cry = L.add(`<g opacity="0">${bubble('!!!', { size: 40, w: 110, ...dark, fill: '#3a3048' })}</g>`);
    const q1 = L.add(`<g opacity="0">${bubble(tr('Czego chcesz od nas?', 'What have we to do with you?'), { size: 22, ...dark })}</g>`);
    const q2 = L.add(`<g opacity="0">${bubble(tr('Zgubić nas?', 'To destroy us?'), { size: 22, ...dark })}</g>`);
    const q3 = L.add(`<g opacity="0">${bubble(tr('Święty Boży!', 'The Holy One of God!'), { size: 22, ...dark })}</g>`);
    const silence = L.add(`<g opacity="0">${bubble(tr('Milcz! Wyjdź z niego!', 'Be silent! Come out of him!'), { size: 22, fill: C.halo, ink: C.ink, flip: true })}</g>`);
    I.addColumns();

    return (t, time) => {
      I.flicker(time);
      const on = es(t, 0.1, 0.6);
      const loud = es(t, 1.05, 1.3);
      const loom = es(t, 2.05, 2.4) * (1 - es(t, 3.05, 3.3));
      const cringe = es(t, 3.05, 3.3) * (1 - es(t, 4.05, 4.2));
      const point = es(t, 4.05, 4.3) * (1 - es(t, 5.1, 5.3));
      const rebuke = es(t, 5.05, 5.3) * (1 - es(t, 6.5, 6.8));
      const thrown = es(t, 6.08, 6.14);
      const risen = es(t, 6.5, 6.57);
      const tear = es(t, 6.12, 6.6);
      const shake = bump(t, 5.4, 6.1);
      const jit = shake * Math.sin(t * 160) * 6;
      const mx = MX + loom * 40 - cringe * 30;

      man.set({ x: mx + jit, y: FEET, s: 1.02, o: seg(t, 0.02, 0.12) * (1 - thrown), armF: 20 + loud * 90 + loom * 30 - cringe * 60 + point * 70, armB: 10 + loud * 140 - cringe * 100 + point * 20, head: 8 - loud * 20 + cringe * 24 + shake * Math.sin(t * 90) * 8, lean: -loud * 8 + loom * 12 + cringe * 10 + jit * 0.6, blink: blinkAt(time, 4) });
      lying.set({ x: 700, y: 694, s: 1.02, r: -90, o: thrown * (1 - risen), armF: 10, head: 0 });
      sitting.set({ x: 660, y: FEET, s: 1.02, o: risen, armF: 50 + es(t, 6.6, 6.8) * 40, armB: 30 + es(t, 6.6, 6.8) * 80, head: -es(t, 6.6, 6.8) * 8, blink: blinkAt(time, 4) });
      pose(peace, { x: 670, y: FEET - 130, s: 1, o: es(t, 6.55, 6.8) * 0.8 });
      shards.forEach((sh) => {
        const flick = time ? Math.sin(time * 7 + sh.i * 2.1) * 0.06 : 0;
        const sz = (0.85 + loom * 0.6 + loud * 0.15 - cringe * 0.35 + point * 0.1) * (1 + flick);
        const cx = thrown > 0.5 ? 640 : mx + jit, cy = thrown > 0.5 ? 640 : FEET - 110;
        const ex = Math.cos(sh.a) * tear * 260 * sh.drift - tear * 240, ey = Math.sin(sh.a) * tear * 160 * sh.drift - tear * 560;
        const tremble = cringe * Math.sin(time * 30 + sh.i) * 4;
        pose(sh.el, { x: cx + ex + tremble, y: cy + ey, s: sz * (1 - tear * 0.5), r: tear * 220 * (sh.i % 2 ? 1 : -1) + Math.sin(time * 3 + sh.i) * 3, o: on * 0.92 * (1 - seg(t, 6.4, 6.62)) });
      });
      tint.fade(on * 0.08 + loud * 0.14 + loom * 0.1 - es(t, 6.2, 6.6) * 0.32);
      const [mhx, mhy] = headAt(mx, FEET, 1.02);
      const bub = (el, a, b, dx, dy) => { const k = es(t, a, a + 0.15, ease.back) * (1 - es(t, b, b + 0.1)); pose(el, { x: mhx + dx, y: mhy + dy + Math.sin(time * 8) * 2, s: k, r: Math.sin(time * 5) * 3, o: k > 0 ? 1 : 0 }); };
      bub(cry, 1.1, 1.92, 30, -100);
      bub(q1, 2.08, 2.92, 110, -120);
      bub(q2, 3.08, 3.92, 90, -110);
      bub(q3, 4.08, 4.95, 110, -120);

      /* Jesus: teaching, then the rebuke */
      const teach = 1 - es(t, 0.6, 1.0);
      jesus.set({ x: JX - rebuke * 30, y: FEET, s: 1.05, flip: t > 0.8, armF: 30 + teach * 44 + rebuke * 60, armB: 10 + rebuke * 140, head: -rebuke * 4, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(JX - rebuke * 30, FEET, 1.05, true);
      jVoice(jhx, jhy, Math.max(teach * 0.6, rebuke), time, { spread: 2.2 + rebuke, dir: t > 0.8 ? -1 : 0 });
      const sl = es(t, 5.1, 5.28, ease.back) * (1 - es(t, 5.95, 6.1));
      pose(silence, { x: jhx - 120, y: jhy - 104, s: sl, o: sl > 0 ? 1 : 0 });
      const holy = es(t, 4.1, 4.4);
      pose(glow, { x: jhx, y: jhy + 30, s: 0.8 + holy * 0.5 + rebuke * 0.3, o: 0.3 + holy * 0.4 + rebuke * 0.2 });
      pose(burst, { x: jhx, y: jhy + 30, s: 0.4 + rebuke * 0.7, r: t * 8, o: rebuke * 0.8 });

      /* the congregation */
      const recoil = es(t, 1.05, 1.4) * (1 - es(t, 6.5, 6.9));
      const relief = es(t, 6.6, 6.9);
      back.forEach((m) => {
        const near = m.x < 700;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 30 + relief * 30, armB: recoil * (near ? 100 : 30) + relief * (m.i % 2 ? 90 : 0), lean: near ? -recoil * 8 : 0, head: -recoil * 6, blink: blinkAt(time, m.seed) });
      });
      front.forEach((f) => f.p.set({ x: f.x, y: I.benchY[1], s: 0.86, flip: f.fl, armF: 30 + relief * 30, armB: recoil * 60, head: -recoil * 6, blink: blinkAt(time, f.i + 7) }));

      S.cam.z = 1.02 + loom * 0.05 + es(t, 5.0, 5.3) * 0.03 - es(t, 6.2, 6.6) * 0.05;
      S.cam.x = -loom * 30 - es(t, 6.0, 6.3) * 20;
      S.cam.y = 20;
    };
  },
};
