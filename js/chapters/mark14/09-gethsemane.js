// Mk 14,32–34 — through the gate of the olive garden called Gethsemane. "Sit here while I pray": eight of them sit
// by the wall. He takes Peter, James and John further in, and begins to tremble; a cloud slides over the moon.
// "My soul is sorrowful even to death; stay here and keep watch."
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { garden, TW, kf, moving, headAt, withFace, faceBits, wordTag, speech, NIGHT, PI, vis } from './lib.js';

const GY = 700;

export default {
  id: 'm14-gethsemane',
  beats: [
    { v: 32, text: 'A kiedy przyszli do ogrodu zwanego Getsemani,' },
    { v: 32, cont: true, text: 'rzekł Jezus do swoich uczniów: «Usiądźcie tutaj, Ja tymczasem będę się modlił».' },
    { v: 33 },
    { v: 34 },
  ],
  cam: { x: [-140, 420], y: [-40, 200], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;
    const MX = PT ? 1040 : 1150;          // phone: the moon (and the cloud that covers it) clear of the progress thread
    const SX = PT ? 600 : 340;            // phone: the name of the garden inside the screen
    const G = garden(S, { moonAt: [MX, 170], rockX: 1400, wall: true, city: true });
    // a dark cloud that slides over the moon
    const cl = hanging(G.hang, cloud(c, 230, mix(C.storm2, C.indigo, 0.3), mix(C.storm2, C.night, 0.4)), { x: 1500, y: 190, len: 700 });
    // the name of the place, and an olive press stone by the gate
    const signL = S.layer({ par: 0.34, sh: 4 });
    const sign = hanging(signL, wordTag(c, tr('Getsemani', 'Gethsemane'), { size: 20 }), { x: SX, y: 470, len: 400 });
    signL.add(`<g transform="translate(560 ${GY - 40})">${sheet().p(c.cut(c.ell(0, -30, 44, 30, 20), 0.6, 5), mix(C.rock2, C.indigo, 0.3)).p(c.cut(c.ell(0, -30, 10, 7, 10), 0.3, 3), mix(C.rock3, C.indigo, 0.4)).out()}</g>`);
    const darkL = S.layer({ par: 0.4, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#120f24" opacity=".35"/>`);

    const P = S.layer({ par: 0.52, sh: 5 });
    const EIGHT = [
      { k: 'andrew', x: 400 }, { k: 'thomas', x: 455 }, { k: 'matthew', x: 510 }, { k: 'philip', x: 565 },
      { k: 'bartholomew', x: 620 }, { k: 'jamesA', x: 675 }, { k: 'thaddaeus', x: 730 }, { k: 'simonZ', x: 785 },
    ].map((d) => (PT ? { ...d, x: 785 + (d.x - 785) * 0.7 } : d))   // phone: the eight sit closer, the first not cut by the frame
      .map((d, i) => ({ ...d, i, seed: c.rr(0, 9), stand: S.puppet(P.add(person(c, TW[d.k]))), sit: S.puppet(P.add(person(c, { ...TW[d.k], pose: 'sit' }))) }));
    const THREE = [{ k: 'john', x: 940 }, { k: 'james', x: 1000 }, { k: 'peter', x: 1060 }].map((d, i) => ({
      ...d, i, seed: c.rr(0, 9), stand: S.puppet(P.add(person(c, TW[d.k]))), sit: S.puppet(P.add(person(c, { ...TW[d.k], pose: 'sit' }))),
    }));
    const jEl = P.add(withFace(person(c, CAST.jesus), faceBits(c)));
    const jesus = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');
    const fx = S.layer({ par: 0.54, sh: 4 });
    const heavy = fx.add(`<g>${cloud(c, 110, mix(C.storm, C.indigo, 0.3), mix(C.storm2, C.indigo, 0.3))}</g>`);
    const eye = (() => {
      const s = sheet();
      s.p(c.cut([...c.arc(0, 0, 22, 12, PI, 2 * PI, 10), ...c.arc(0, 0, 22, 12, 0, PI, 10)], 0.3, 3), C.cream);
      s.p(c.cut(c.circ(0, 0, 7, 12), 0.2, 2), C.teal);
      s.x(c.poly(c.circ(0, 0, 3.4, 8)), C.ink);
      return s.out();
    })();
    const watch = fx.add(`<g>${speech(c, eye, { w: 70, h: 44, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      swing(G.moon, MX, 170, T, 1, 0.6);
      const cover = es(t, 2.05, 2.8);
      vis(cl, { x: lerp(1520, MX + 10, cover), y: 196, r: Math.sin(T * 0.6) * 1, o: 1 });
      darkL.fade(es(t, 2.1, 2.8));
      vis(sign, { x: SX, y: 470 - (1 - es(t, -0.2, 0.3, ease.out)) * 500, r: Math.sin(T * 1.1) * 3, o: 1 });

      /* everyone comes in through the gate; eight sit by the wall */
      EIGHT.forEach((d) => {
        const u = es(t, 0.05 + d.i * 0.04, 0.7 + d.i * 0.04);
        const x = lerp(-120 - d.i * 50, d.x, u);
        const sit = es(t, 1.35 + d.i * 0.04, 1.42 + d.i * 0.04);
        d.stand.set({ x, y: GY, s: 0.9, flip: false, o: 1 - sit, walk: u > 0 && u < 1 ? x * 0.05 : undefined, armF: 10, blink: blinkAt(T, d.seed) });
        d.sit.set({ x: d.x, y: GY + 4, s: 0.9, flip: d.i % 2 === 1, o: sit, armF: 30, armB: 10, head: 8 + es(t, 2.1, 2.6) * 6, blink: blinkAt(T, d.seed) });
      });
      const jK = [[-0.2, [-60, GY + 2]], [0.75, [860, GY + 2]], [2.05, [860, GY + 2]], [2.7, [1140, GY + 2]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      const turn = es(t, 1.05, 1.12) * (1 - es(t, 1.95, 2.02));
      const tremble = es(t, 2.3, 2.6) * (Math.sin(T * 23) * 1.4 + Math.sin(T * 17) * 1.0);
      const sorrow = es(t, 3.05, 3.3);
      jesus.set({ x: jx + tremble, y: jy, s: 1.04, flip: turn > 0.5 || t > 3.0, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, armF: 14 + turn * 50 + bump(t, 1.95, 2.2) * 30 - sorrow * 4, armB: 6 + turn * 60 + sorrow * 20, head: es(t, 2.3, 2.6) * 10 + sorrow * 12, lean: sorrow * 4, blink: blinkAt(T) });
      fade(jSad, es(t, 2.3, 2.6));
      THREE.forEach((d) => {
        const k1 = [[-0.2, [-160 - d.i * 60, GY]], [0.8, [930 - d.i * 70 + 60, GY]], [2.05, [930 - d.i * 70 + 60, GY]], [2.75, [d.x - 60, GY]]];
        const [x, y] = kf(t, k1, ease.sine);
        const sit = es(t, 3.4 + d.i * 0.06, 3.47 + d.i * 0.06);
        d.stand.set({ x, y, s: 0.92, flip: t > 2.9, o: 1 - sit, walk: moving(t, k1, 1) ? x * 0.05 : undefined, armF: 12 + sorrow * 20, head: sorrow * 10, blink: blinkAt(T, d.seed) });
        d.sit.set({ x: d.x - 60, y: y + 4, s: 0.92, flip: true, o: sit, armF: 30, armB: 12, head: 6, blink: blinkAt(T, d.seed) });
      });
      // a heavy cloud of sorrow over Him; "watch"
      const [hx, hy] = headAt(jx, jy, 1.04, true);
      const hv = es(t, 3.05, 3.4, ease.out);
      vis(heavy, { x: hx, y: hy - 70 - (1 - hv) * 200 + Math.sin(T * 0.8) * 3, s: 0.9, o: hv * 0.95 });
      const w = es(t, 3.5, 3.7, ease.back);
      vis(watch, { x: hx - 20, y: hy - 10, s: w, o: w > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, PT ? [[-0.5, -120], [0.8, -30], [1.9, -10], [2.7, 330], [3.9, 345]] : [[-0.5, -120], [0.8, -60], [1.9, -40], [2.7, 360], [3.9, 380]]);   // phone: a little to the right with the eight, a little back with the three
      S.cam.z = kf(t, [[-0.5, 1.02], [0.8, 1.12], [1.9, 1.16], [2.7, 1.3], [3.9, 1.4]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.8, 90], [1.9, 110], [2.7, 150], [3.9, 170]]);
    };
  },
};
