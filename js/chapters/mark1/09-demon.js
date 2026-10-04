// Mk 1,23–28 — in the same synagogue: a man with a jagged dark shadow cries out; "Be quiet, and come out of him!";
// the shadow is torn into shards that fly off, the man kneels, then stands free; people ask one another
// what this is; and the news runs out over a paper map of Galilee, town after town lighting up.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { rays, paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { POSSESSED, headAt, voiceRings, synagogueInterior, shadowShards, bubble, galileeMap, hang2 } from './lib.js';

const PI = Math.PI;
const JX = 800, FEET = 742, MX = 560;

export default {
  id: 'm1-demon',
  beats: [
    { v: 23, text: 'Był właśnie w synagodze człowiek opętany przez ducha nieczystego.' },
    { v: 23, cont: true, text: 'Zaczął on wołać:' },
    { v: 24 },
    { v: 25 },
    { v: 26 },
    { v: 27, text: 'A wszyscy się zdumieli, tak że jeden drugiego pytał:' },
    { v: 27, cont: true, text: '«Co to jest? Nowa jakaś nauka z mocą.' },
    { v: 27, cont: true, text: 'Nawet duchom nieczystym rozkazuje i są Mu posłuszne».' },
    { v: 28 },
  ],
  cam: { x: [-40, 20], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the benches' people sit closer to the middle; a smaller map
    const I = synagogueInterior(S);
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#241c30"/>`);
    tint.fade(0);
    const L = S.layer({ par: I.P, sh: 4 });
    const back = I.congregation(L);
    if (PH) back.forEach((m) => { m.x = m.x < 800 ? 497 + (m.x - 250) * 0.36 : 955 + (m.x - 1000) * 0.24; });
    const DIS = [CAST.peter, CAST.andrew, CAST.james, CAST.john].map((cast, i) => ({ p: S.puppet(L.add(person(c, { ...cast, pose: 'sit' }))), x: PH ? 955 + i * 28 : 1060 + i * 82, i }));
    const desk = sheet().p(c.cut([[-40, 0], [-30, -90], [30, -90], [40, 0]], 0.5, 6), C.wood).p(c.cut([[-54, -86], [54, -100], [50, -88], [-50, -76]], 0.4, 6), C.wood2)
      .p(c.cut([[-44, -96], [44, -106], [42, -96], [-42, -86]], 0.3, 6), C.parchment).out();
    L.add(`<g transform="translate(900 ${FEET})">${desk}</g>`);

    /* the man and his shadow */
    const shards = shadowShards(c, { n: 11, r: 110 }).map((sh) => ({ ...sh, el: L.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.6, 1.2) }));
    const man = S.puppet(L.add(person(c, { ...POSSESSED })));
    const manK = S.puppet(L.add(person(c, { ...POSSESSED, pose: 'kneel' })));
    const manFree = S.puppet(L.add(person(c, { ...POSSESSED, hairStyle: 'short' })));

    /* Jesus */
    const burst = L.add(`<g opacity="0">${rays(c, { n: 16, r0: 40, r1: 380, spread: 0.045, color: '#fff3cf' })}</g>`);
    const glow = L.add(`<circle r="180" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jVoice = voiceRings(L, c, { n: 3, color: C.sun, r: 44, w: 6 });

    /* speech */
    const cry1 = L.add(`<g opacity="0">${bubble('!!', { size: 30, w: 70, jag: true, c, fill: '#4a3f58', ink: C.cream })}</g>`);
    const cry2 = L.add(`<g opacity="0">${bubble(tr('Czego chcesz od nas?', 'What do you want with us?'), { size: 22, jag: true, c, fill: '#4a3f58', ink: C.cream })}</g>`);
    const scream = L.add(`<g opacity="0">${bubble('!!!', { size: 40, w: 110, jag: true, c, fill: '#3a3048', ink: C.cream })}</g>`);
    const silence = L.add(`<g opacity="0">${bubble(tr('Milcz! Wyjdź z niego!', 'Be quiet! Come out!'), { size: 22, fill: C.halo, ink: C.ink, flip: true })}</g>`);
    const asks = back.map((m, i) => ({ m, el: L.add(`<g opacity="0">${paperLabel(i % 3 === 2 ? '!' : '?', { size: 22, w: 28 })}</g>`), i }));
    I.addColumns();

    /* the news runs through Galilee */
    const mapL = S.layer({ par: 0.3, sh: 8, pad: 1400 });
    const map = galileeMap(c);
    const MS = PH ? 0.78 : 0.95, MCX = 800, MCY = 430;
    mapL.add(`<g transform="translate(${MCX} ${MCY}) scale(${MS})">${hang2(map.markup, 300, 800)}</g>`);
    const kaf = map.towns[0];
    const lights = map.towns.map((tw) => ({ tw, d: Math.hypot(tw.x - kaf.x, tw.y - kaf.y), el: mapL.add(`<g opacity="0"><circle r="34" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, -4, 12, 4, 4, 0))}" fill="${C.sunDeep}"/></g>`) }));
    const maxD = Math.max(...lights.map((l) => l.d));
    const waves = [0, 1, 2].map(() => mapL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 60, 60, 0, PI * 2, 36), 2.5)}" fill="${C.sunRay}"/></g>`));

    return (t, time) => {
      I.flicker(time);

      /* ---------- the man with an unclean spirit ---------- */
      const shadowOn = es(t, 0.15, 0.6);
      const cry = es(t, 1.05, 1.3);
      const loom = es(t, 2.05, 2.5) * (1 - es(t, 3.2, 3.6) * 0.6);
      const shake = bump(t, 4.0, 4.5);
      const kneel = es(t, 4.4, 4.46) * (1 - es(t, 6.05, 6.12));
      const free = es(t, 6.05, 6.12);
      const step = es(t, 1.05, 1.4);
      const mx = MX + step * 50;
      const jit = shake * Math.sin(t * 160) * 7;
      man.set({ x: mx + jit, y: FEET, s: 1.02, o: 1 - Math.max(kneel, free), armF: 20 + cry * 100 + loom * 20 - shake * 40, armB: 10 + cry * 150 - shake * 60, head: 8 - cry * 22 + shake * Math.sin(t * 90) * 10, lean: -cry * 8 + loom * 10 + jit * 0.8, blink: blinkAt(time, 4) });
      manK.set({ x: mx, y: FEET, s: 1.02, o: kneel, armF: 40, armB: 20, head: 14 - es(t, 5.0, 5.4) * 14, lean: 10 - es(t, 5.0, 5.4) * 10, blink: blinkAt(time, 4) });
      const joy = es(t, 6.2, 6.5);
      manFree.set({ x: mx, y: FEET, s: 1.02, o: free, armF: 30 + joy * 60, armB: 20 + joy * 110, head: -joy * 6, blink: blinkAt(time, 4) });
      const [mhx, mhy] = headAt(mx, FEET, 1.02);
      const tear = es(t, 4.35, 4.95);
      shards.forEach((sh) => {
        const flick = time ? Math.sin(time * 7 + sh.i * 2.1) * 0.06 : 0;
        const sz = (0.9 + loom * 0.6 - es(t, 3.2, 3.6) * 0.3) * (1 + flick);
        const ex = Math.cos(sh.a) * tear * 260 * sh.drift - tear * 180, ey = Math.sin(sh.a) * tear * 200 * sh.drift - tear * 420;
        pose(sh.el, { x: mx + jit + ex, y: FEET - 110 + ey, s: sz * (1 - tear * 0.5), r: tear * 200 * (sh.i % 2 ? 1 : -1) + Math.sin(time * 3 + sh.i) * 3, o: shadowOn * 0.92 * (1 - seg(t, 4.6, 4.95)) });
      });
      tint.fade(cry * 0.18 + loom * 0.22 - es(t, 4.5, 4.9) * 0.4);
      const c1 = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(cry1, { x: mhx + 40, y: mhy - 90 + Math.sin(time * 9) * 2, s: c1, r: Math.sin(time * 6) * 4, o: c1 > 0 ? 1 : 0 });
      const c2 = es(t, 2.05, 2.22, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(cry2, { x: mhx + 90, y: mhy - 110 + Math.sin(time * 8) * 2, s: c2, r: Math.sin(time * 5) * 2, o: c2 > 0 ? 1 : 0 });
      const sc = es(t, 4.05, 4.2, ease.back) * (1 - es(t, 4.7, 4.9));
      pose(scream, { x: mhx + 20, y: mhy - 100, s: sc * (1 + shake * 0.1 * Math.sin(t * 120)), o: sc > 0 ? 1 : 0 });

      /* ---------- Jesus: "Be quiet, and come out of him!" ---------- */
      const teach = 1 - es(t, 0.8, 1.2);
      const rebuke = es(t, 3.02, 3.25) * (1 - es(t, 5.0, 5.4));
      const jx = JX - rebuke * 30;
      jesus.set({
        x: jx, y: FEET, s: 1.05, flip: t > 0.9,
        armF: 30 + teach * (40 + Math.sin(time * 1.3) * 10) + rebuke * 60 + es(t, 7.0, 7.4) * 20, armB: 10 + rebuke * 140,
        head: -rebuke * 4, blink: blinkAt(time),
      });
      const [jhx, jhy] = headAt(jx, FEET, 1.05, true);
      jVoice(jhx, jhy, Math.max(teach * 0.6, rebuke), time, { spread: 2.2 + rebuke, dir: t > 0.9 ? -1 : 0 });
      const sl = es(t, 3.1, 3.28, ease.back) * (1 - es(t, 3.95, 4.1));
      pose(silence, { x: jhx - 110, y: jhy - 100, s: sl, o: sl > 0 ? 1 : 0 });
      pose(burst, { x: jhx, y: jhy + 30, s: 0.4 + rebuke * 0.7, r: t * 8, o: bump(t, 3.1, 4.9) * 0.3 });
      pose(glow, { x: jhx, y: jhy + 30, s: 0.8 + rebuke * 0.6, o: 0.3 + rebuke * 0.5 });

      /* ---------- the congregation ---------- */
      const recoil = es(t, 0.3, 0.8) * (1 - es(t, 4.9, 5.3));
      const talk = es(t, 5.05, 5.35);
      const praise = es(t, 7.05, 7.4);
      back.forEach((m) => {
        const toJ = m.x > JX;
        const turnTo = talk * (1 - praise) > 0.5 ? m.i % 2 === 0 : toJ;
        const near = m.x < 700;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: turnTo, armF: 30 + talk * (1 - praise) * 40 + praise * 60, armB: recoil * (near ? 90 : 20) + praise * (m.i % 2 ? 80 : 0), lean: near ? -recoil * 8 : 0, head: -recoil * 6 + Math.sin(time * 3 + m.i) * 3 * talk * (1 - praise), blink: blinkAt(time, m.seed) });
      });
      DIS.forEach((d) => d.p.set({ x: d.x, y: I.benchY[1], s: 0.86, flip: true, armF: 30 + praise * 40, armB: recoil * 40 + praise * 40, head: -recoil * 4, blink: blinkAt(time, d.i + 7) }));
      asks.forEach((a) => {
        const k = es(t, 5.15 + a.i * 0.07, 5.3 + a.i * 0.07, ease.back) * (1 - es(t, 7.9, 8.1));
        const [x, y] = headAt(a.m.x, a.m.y, a.m.s, false, 62);
        pose(a.el, { x: x + 16, y: y - 42 + Math.sin(time * 2 + a.i) * 3, s: k, r: Math.sin(time + a.i) * 8, o: k > 0 ? 1 : 0 });
      });

      /* ---------- v28: the report goes out everywhere ---------- */
      const mapIn = es(t, 8.0, 8.35, ease.out);
      mapL.shift(0, -(1 - mapIn) * 1300);
      mapL.fade(seg(t, 7.95, 8.0));
      lights.forEach((l) => {
        const a = 8.3 + (l.d / maxD) * 0.45;
        const k = es(t, a, a + 0.12, ease.back);
        pose(l.el, { x: MCX + l.tw.x * MS, y: MCY + (l.tw.y - 8) * MS, s: k * (1 + Math.sin(time * 3 + l.d) * 0.08), o: k > 0 ? 1 : 0 });
      });
      waves.forEach((w, i) => {
        const k = time ? ((time * 0.35 + i / 3) % 1) : (i + 1) / 3.5;
        pose(w, { x: MCX + kaf.x * MS, y: MCY + (kaf.y - 8) * MS, s: 0.3 + k * 3.2, sy: 0.3 + k * 2.6, o: es(t, 8.3, 8.5) * (1 - k) * 0.5 });
      });

      S.cam.z = 1.02 + loom * 0.05 + es(t, 3.0, 3.3) * 0.03 - es(t, 4.8, 5.2) * 0.06;
      S.cam.x = -loom * 30 * (1 - es(t, 4.8, 5.2));
      S.cam.y = 20;
    };
  },
};
