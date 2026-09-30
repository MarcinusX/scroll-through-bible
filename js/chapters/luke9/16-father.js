// Łk 9,41–43a — the same plain. "O faithless and perverse generation!": Jesus grieves over them — His brows fall, He
// sighs, and the crowd's heads go down. "How long shall I be with you and bear with you?": an hourglass comes down, its
// sand running. "Bring your son here": He beckons, and the father leads the boy towards Him. While the boy is still
// coming, the demon throws him down: he falls, a small whirl of dark scraps round him, the father starts back. Jesus
// rebukes the unclean spirit — the scraps tear away and are gone — raises the boy, heals him, and gives him back to his
// father, who kneels and takes him in his arms. "And they were all astonished at the majesty of God": the whole crowd
// lifts its hands, and light comes down over the plain from above.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { footSet, FATHER, BOY, TW9, withFace, faceBits, lyingPerson, hourglass, heart, halo, rayBurst, dust, kf, headAt, hand, PI } from './lib.js';

const JX = 760, FY = 724;
const NINE = [{ k: 'thomas', x: 1160 }, { k: 'philip', x: 1230 }, { k: 'matthew', x: 1300 }];

export default {
  id: 'lk9-father',
  beats: [
    { v: 41, text: 'Na to Jezus rzekł: «O plemię niewierne i przewrotne!' },
    { v: 41, cont: true, text: 'Jak długo jeszcze będę u was i będę was znosił?' },
    { v: 41, cont: true, text: 'Przyprowadź tu swego syna!»' },
    { v: 42, text: 'Gdy on jeszcze się zbliżał, zły duch porwał go i zaczął targać.' },
    { v: 42, cont: true, text: 'Jezus rozkazał surowo duchowi nieczystemu, uzdrowił chłopca i oddał go jego ojcu.' },
    { v: 43, text: 'A wszyscy osłupieli ze zdumienia nad wielkością Boga.' },
  ],
  cam: { x: [-20, 40], y: [0, 50], z: [1, 1.16] },
  build(S) {
    const F = footSet(S, { twin: (m, k) => ({ armF: 100 + (k % 2) * 30, armB: 140 + (k % 3) * 10, head: -10 }) });
    const c = S.c;
    // light from above (v43a) — behind everyone, on the sky side
    const heaven = S.layer({ par: 0.05, sh: 1, flat: true });
    heaven.el.parentNode.insertBefore(heaven.el, F.ground.el);
    const rays = heaven.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 20, r1: 900, spread: 0.035, color: '#fff3cf', o: 0.55 })}</g>`);

    const hgL = S.layer({ par: 0.3, sh: 5 });
    const glass = hanging(hgL, `<g transform="scale(1.3)">${hourglass(c, 80)}</g>`, { x: 0, y: -1500, len: 900 });
    const sandTop = hgL.add(`<g opacity="0"><path d="${c.cut([[-14, 0], [14, 0], [2, 20], [-2, 20]], 0.2, 3)}" fill="${C.sand2}"/></g>`);
    const sandBot = hgL.add(`<g opacity="0"><path d="${c.cut([[-16, 0], [16, 0], [10, -12], [-10, -12]], 0.2, 3)}" fill="${C.sand2}"/></g>`);

    /* people */
    const glowL = S.layer({ par: 0.5, sh: 1, flat: true });
    const aura = glowL.add(`<g opacity="0">${halo(160, 1)}</g>`);
    const act = S.layer({ par: 0.5, sh: 5 });
    const THREE = ['john', 'james', 'peter'].map((k, i) => ({ k, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[k]))) }));
    const N = NINE.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const fStand = S.puppet(act.add(withFace(person(c, FATHER), faceBits(c))));
    const fKneel = S.puppet(act.add(withFace(person(c, { ...FATHER, pose: 'kneel' }), faceBits(c))));
    const boy = S.puppet(act.add(person(c, BOY)));
    const boyDown = act.add(`<g opacity="0">${lyingPerson(c, BOY, 0.62)}</g>`);
    const fSad = [fStand, fKneel].map((p) => p.el.querySelector('[data-part="sad"]'));
    const jesus = S.puppet(act.add(withFace(person(c, { ...CAST.jesus }), faceBits(c))));
    const jSad = jesus.el.querySelector('[data-part="sad"]');
    const fx = S.layer({ par: 0.55, sh: 4 });
    const sigh = fx.add(`<g opacity="0">${dust(c, 16, C.cream)}</g>`);
    const SCR = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 7, 4, 7, 0.4), 1, 3)}" fill="#4a3f5a"/></g>`) }));
    const love = fx.add(`<g opacity="0">${heart(c, 13)}</g>`);

    return (t, time) => {
      const T = time;
      F.update(T);
      /* v41a — faithless and perverse generation */
      const grieve = es(t, 0.05, 0.3) * (1 - es(t, 2.0, 2.3));
      pose(jSad, { o: grieve });
      const [jhx, jhy] = headAt(JX, FY, 1.02, false);
      const sg = seg(t, 0.2, 0.8);
      pose(sigh, { x: jhx + 26 + sg * 20, y: jhy + 4 - sg * 16, s: 0.5 + sg * 0.8, o: sg > 0 ? Math.sin(sg * PI) * 0.8 : 0 });
      F.crowd.forEach((m) => {
        const amaze = es(t, 5.05 + (m.i % 6) * 0.03, 5.12 + (m.i % 6) * 0.03);
        m.sp.set({ x: m.x - 40, y: m.y + bump(t, 0.1, 1.9) * 4, o: 1 - amaze });
        m.alt.set({ x: m.x - 40, y: m.y, o: amaze });
      });
      THREE.forEach((d) => d.p.set({ x: 520 + d.i * 70, y: FY + 6 - (d.i % 2) * 10, s: 0.94, armF: 20 + es(t, 5.05, 5.3) * 90, armB: es(t, 5.05, 5.3) * 120, head: bump(t, 0.1, 1.9) * 10 - es(t, 5.05, 5.3) * 10, blink: blinkAt(T, d.seed) }));
      N.forEach((d) => d.p.set({ x: d.x, y: FY + 8 + (d.i % 2) * 8, s: 0.94, flip: true, armF: 20 + es(t, 5.05, 5.3) * 90, armB: es(t, 5.05, 5.3) * 120, head: bump(t, 0.1, 1.9) * 16 - es(t, 5.05, 5.3) * 10, lean: bump(t, 0.1, 1.9) * 6, blink: blinkAt(T, d.seed) }));

      /* v41b — how long? the hourglass */
      const hk = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 1.95, 2.2));
      const hy = lerp(-1500, 300, hk);
      pose(glass, { x: 800, y: hy, r: Math.sin(T * 0.8) * 1.5, oy: 0, o: hk > 0.002 ? 1 : 0 });
      const run = seg(t, 1.2, 2.0);
      pose(sandTop, { x: 800, y: hy - 34, sy: Math.max(0.05, 1 - run), o: hk > 0.9 ? 1 : 0 });
      pose(sandBot, { x: 800, y: hy + 50, sy: Math.max(0.05, run), o: hk > 0.9 ? 1 : 0 });

      /* v41c — bring your son here */
      const beckon = bump(t, 2.05, 2.9);
      const come = es(t, 2.3, 3.1, (u) => u);
      const fallT = 3.1;
      const fall = es(t, fallT, fallT + 0.08);
      const raised = es(t, 4.35, 4.42);
      const given = es(t, 4.5, 4.8);
      const bx = lerp(990, 870, come);
      boy.set({ x: raised > 0 ? lerp(850, 900, given) : bx, y: FY + 10, s: 0.64, flip: given < 0.5, walk: come > 0 && come < 1 ? t * 14 : undefined, armF: 10 + raised * 30, armB: 10, head: 8 - raised * 10, o: 1 - fall + raised, blink: blinkAt(T, 6) });
      const conv = es(t, fallT, fallT + 0.2) * (1 - es(t, 4.1, 4.3));
      pose(boyDown, { x: 836 + Math.sin(T * 26) * 2 * conv, y: FY + 8 - Math.abs(Math.sin(T * 14)) * 3 * conv, o: fall * (1 - raised) });
      const fx0 = lerp(930, 960, come) + es(t, fallT, fallT + 0.2) * 20 * (1 - given);
      const kneel = es(t, 4.6, 4.66);
      fStand.set({ x: fx0, y: FY + 4, s: 1.0, flip: true, walk: come > 0 && come < 1 ? t * 14 + 1 : undefined, armF: 30 + es(t, fallT, fallT + 0.2) * 80 * (1 - given) + given * 60, armB: 40 + es(t, fallT, fallT + 0.2) * 100 * (1 - given), head: -4 + es(t, fallT, fallT + 0.2) * 10 * (1 - given), o: 1 - kneel, blink: blinkAt(T, 3) });
      fKneel.set({ x: 960, y: FY + 4, s: 1.0, flip: true, o: kneel, armF: 80, armB: 60, head: 6, blink: blinkAt(T, 3) });
      fSad.forEach((el) => pose(el, { o: es(t, 0.05, 0.3) * (1 - given) }));

      /* v42 — the spirit throws him down; Jesus rebukes it, heals him, gives him back */
      const rebuke = bump(t, 4.02, 4.5);
      SCR.forEach((s) => {
        const a = (s.i / 6) * PI * 2 + T * 3;
        const whirl = conv;
        const off = seg(t, 4.1 + s.i * 0.02, 4.4 + s.i * 0.02);
        pose(s.el, { x: 846 + Math.cos(a) * 76 + off * (s.i % 2 ? 300 : -300), y: FY - 40 + Math.sin(a) * 26 - off * 300, r: T * 90 + s.i * 40, o: (t > fallT ? es(t, fallT, fallT + 0.15) : 0) * (1 - off) });
      });
      jesus.set({ x: JX, y: FY, s: 1.02, flip: false, armF: 20 + beckon * 60 + rebuke * 80 + es(t, 4.3, 4.45) * 30 * (1 - given), armB: 10 + beckon * 90 + rebuke * 40, head: -2 + bump(t, 3.1, 4.4) * 8, blink: blinkAt(T, 1) });
      pose(aura, { x: JX, y: FY - 150, s: 0.8 + rebuke * 0.4, o: 0.4 + rebuke * 0.5 + es(t, 5.05, 5.3) * 0.4 });
      const lk = es(t, 4.7, 4.9, ease.back) * (1 - es(t, 5.6, 5.8));
      pose(love, { x: 930, y: FY - 170, s: lk, o: lk > 0.01 ? 1 : 0 });

      /* v43a — astonished at the majesty of God */
      pose(rays, { x: 800, y: -200, r: T * 2, o: es(t, 5.05, 5.4) });

      S.cam.x = kf(t, [[0, 10], [2.0, 10], [3.0, 20], [5.0, 20], [5.3, 10]]);
      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.12], [1.1, 1.06], [2.0, 1.06], [3.0, 1.12], [5.0, 1.12], [5.3, 1.02]]);
      S.cam.y = kf(t, [[0, 40], [5.0, 40], [5.3, 20]]);
    };
  },
};
