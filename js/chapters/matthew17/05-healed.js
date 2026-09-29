// Mt 17,17–18 — "O faithless and perverse generation!" Jesus grieves (a sigh, lowered brows; the nine hang their
// heads). "How long shall I be with you, how long bear with you?" — an hourglass comes down, its sand running.
// "Bring him here to me!" — He beckons, and the father leads the boy to Him. He rebukes the spirit: the dark scraps
// whirl up out of the boy and fly off. And from that hour the boy is well: he stands up straight in the light,
// his father lifts his arms, and the whole crowd raises its hands.
import { C, person, CAST, blinkAt, pose, lerp, swing, hanging, sheet, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { plainStage, L9, bubble, withFace, faceBits, wisp, hourglass, shadowShards, arcRings, dust, spark, tr } from './lib.js';

const JX = 770, FX0 = 900, BX0 = 986;
const PI = Math.PI;

export default {
  id: 'mt17-healed',
  beats: [
    { v: 17, text: 'Na to Jezus odrzekł: «O plemię niewierne i przewrotne!' },
    { v: 17, cont: true, text: 'Jak długo jeszcze mam być z wami; jak długo mam was cierpieć?' },
    { v: 17, cont: true, text: 'Przyprowadźcie Mi go tutaj!»' },
    { v: 18, text: 'Jezus rozkazał mu surowo, i zły duch opuścił go.' },
    { v: 18, cont: true, text: 'Od owej pory chłopiec odzyskał zdrowie.' },
  ],
  cam: { x: [-20, 80], y: [-20, 50], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const ST = plainStage(S);
    const FEET = ST.FEET;

    /* ---------- the hourglass ---------- */
    const plL = S.layer({ par: 0.1, sh: 5 });
    const hg = hanging(plL, `<g transform="scale(1.6)">${hourglass(c, 80, { k: 'hg' })}</g>`, { x: 640, y: 250, len: 900 });
    const hgEl = S.$('hg');
    const sandT = hgEl.querySelector('.sandT'), sandB = hgEl.querySelector('.sandB'), stream = hgEl.querySelector('.stream');

    /* ---------- the main group ---------- */
    const mainL = S.layer({ par: 0.5, sh: 5 });
    const halo = mainL.add(`<g opacity="0"><circle r="170" fill="url(#halo-glow)"/></g>`);
    const THREE = [CAST.john, CAST.james, CAST.peter].map((o, i) => ({ i, o, seed: c.rr(0, 9), x: 650 - i * 66, p: S.puppet(mainL.add(person(c, o))) }));
    const jesus = S.puppet(mainL.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const jSad = jesus.el.querySelector('[data-part="sad"]');
    const boy = S.puppet(mainL.add(person(c, L9.boy)));
    const boyWell = S.puppet(mainL.add(person(c, { ...L9.boy, robe: C.linen, belt: C.ochre })));
    const boyWisp = mainL.add(`<g opacity="0">${wisp(c, 1.1, '#463a52')}</g>`);
    const shards = shadowShards(c, { n: 9, r: 40, color: '#3b3148' }).map((sh) => ({ ...sh, el: mainL.add(`<g opacity="0">${sh.m}</g>`), seed: c.rr(0, 6) }));
    const fStand = S.puppet(mainL.add(withFace(person(c, L9.father), faceBits(c))));
    const fKneel = S.puppet(mainL.add(withFace(person(c, { ...L9.father, pose: 'kneel' }), faceBits(c))));
    const fParts = (p, k) => p.el.querySelector(`[data-part="${k}"]`);
    const sigh = mainL.add(`<g opacity="0">${dust(c, 16, C.cream)}</g>`);
    const cmd = arcRings(mainL, c, { n: 3, r: 34, w: 6, color: C.haloRim, a: 0, span: 0.6 });
    const words = mainL.add(`<g opacity="0">${bubble(c, tr('Przyprowadźcie go tutaj!', 'Bring him here to me!'), { size: 19, tail: -1 })}</g>`);
    const joy = [0, 1, 2, 3, 4].map((i) => mainL.add(`<g opacity="0">${spark(c, 8 + (i % 2) * 3)}</g>`));

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(160, 970, 220, 90, 14, 0.15), 1.4, 8), C.rock2).p(c.cut(c.blob(1480, 980, 200, 80, 14, 0.15), 1.4, 8), C.rock).out());

    return (t, time) => {
      const T = time;
      ST.set.clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.3, 0.6, cl.i));
      const well = es(t, 4.05, 4.4);
      const cheer = es(t, 4.3, 4.45);
      ST.groups.forEach((g) => { g.a.set({ x: g.x, y: g.y, o: 1 - cheer }); g.b.set({ x: g.x, y: g.y, o: cheer }); });
      const bowed = es(t, 0.3, 0.45) * (1 - es(t, 4.3, 4.45));
      ST.nine.a.set({ o: 1 - bowed });
      ST.nine.b.set({ o: bowed });

      /* Jesus */
      const grief = es(t, 0.05, 0.4) * (1 - es(t, 2.0, 2.3));
      const beckon = es(t, 2.05, 2.3) * (1 - es(t, 2.85, 3));
      const rebuke = es(t, 3.05, 3.25) * (1 - es(t, 3.85, 4.05));
      const bless = es(t, 4.2, 4.5);
      jesus.set({
        x: JX, y: FEET, s: 1.1,
        armF: 14 + grief * 36 + bump(t, 1.05, 1.95) * 20 + beckon * (64 + Math.sin(T * 3) * 10) + rebuke * 78 + bless * 50,
        armB: 10 + grief * 50 + bump(t, 1.05, 1.95) * 30 + rebuke * 30 + bless * 40, head: -2 - grief * 8 + rebuke * -2 + bless * 4, blink: blinkAt(T, 1),
      });
      pose(jSad, { o: es(t, 0.05, 0.3) * (1 - es(t, 2.9, 3.1)) });
      pose(sigh, { x: JX + 40 + es(t, 0.2, 0.8) * 30, y: FEET - 186 - es(t, 0.2, 0.8) * 20, s: 0.6 + es(t, 0.2, 0.8) * 0.8, o: bump(t, 0.15, 0.95) });
      pose(words, { x: JX + 150, y: FEET - 236, s: es(t, 2.1, 2.3, ease.back), o: bump(t, 2.05, 2.97) > 0.05 ? 1 : 0 });
      cmd(JX + 70, FEET - 150, rebuke, T, { spread: 2.2, speed: 0.6, s0: 0.8 });
      THREE.forEach((d) => d.p.set({ x: d.x, y: FEET - 16 - d.i * 5, s: 0.96, head: -4 + grief * 6 - bless * 8, armF: 10 + bless * (d.i === 2 ? 100 : 40), armB: bless * (d.i === 1 ? 120 : 0), blink: blinkAt(T, d.seed) }));

      /* the hourglass: how long? */
      const hp = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.95, 2.2));
      swing(hg, 640, lerp(-1000, 250, hp), T, 1.2, 0.8, 1);
      const run = es(t, 1.2, 1.95, (u) => u);
      pose(sandT, { x: 0, y: -3, sy: 1 - run * 0.8 });
      pose(sandB, { x: 0, y: 40, sy: 0.2 + run * 0.8 });
      fade(stream, hp > 0.5 && run < 1 ? 1 : 0);

      /* the father and the boy: brought to Jesus (v17c) */
      const bring = es(t, 2.3, 2.9);
      const fx = lerp(FX0, 920, bring), bx = lerp(BX0, 856, bring);
      const kneel = 1 - es(t, 2.2, 2.27);
      const walkingF = bring > 0 && bring < 1;
      fKneel.set({ x: FX0, y: FEET + 4, s: 1.04, flip: true, o: kneel, armF: 30 + 60, armB: 20 + 60, head: -8, blink: blinkAt(T, 3) });
      fStand.set({ x: fx, y: FEET + 4, s: 1.04, flip: true, o: 1 - kneel, walk: walkingF ? fx * 0.06 : undefined, armF: 30 + bring * 30 * (1 - well) + well * 80, armB: 10 + well * 150, head: -6 + well * -6, blink: blinkAt(T, 3) });
      [fStand, fKneel].forEach((p) => { pose(fParts(p, 'sad'), { o: 1 - well }); pose(fParts(p, 'tear'), { o: 0.6 * (1 - well) }); });
      const shake = rebuke * Math.sin(T * 26) * 1.6;
      const swapWell = es(t, 4.05, 4.12);
      boy.set({ x: bx + shake, y: FEET + 8, s: 0.66, flip: true, o: 1 - swapWell, walk: walkingF ? bx * 0.07 : undefined, head: 8 - rebuke * 4, armF: 6 + rebuke * 20, blink: 0 });
      boyWell.set({ x: bx, y: FEET + 8 - bump(t, 4.1, 4.5) * 10, s: 0.68, flip: true, o: swapWell, head: -6, armF: 30 + es(t, 4.3, 4.6) * 90, armB: es(t, 4.3, 4.6) * 130, blink: blinkAt(T, 4) });
      const out = es(t, 3.3, 3.95);
      pose(boyWisp, { x: bx + 16 + Math.sin(T * 1.3) * 4, y: FEET - 108 + Math.sin(T * 1.7) * 3 - out * 60, s: 0.9 + Math.sin(T * 2) * 0.06, r: Math.sin(T * 1.1) * 10, o: 0.85 * (1 - es(t, 3.1, 3.3)) });
      shards.forEach((sh) => {
        const on = es(t, 3.08, 3.3) * (1 - es(t, 3.8, 4.0));
        const swirl = T * 1.6 + sh.a;
        const fly = out * (300 + sh.seed * 40);
        const r = 30 + Math.sin(T * 3 + sh.seed) * 4;
        pose(sh.el, { x: bx - 4 + Math.cos(swirl) * r * 1.3 + Math.cos(sh.a) * fly, y: FEET - 96 + Math.sin(swirl) * r * 0.7 + Math.sin(sh.a) * fly * 0.6 - out * 160, s: 0.8, r: T * 40 + sh.i * 40, o: on * 0.9 });
      });
      pose(halo, { x: bx, y: FEET - 70, s: 0.6 + well * 0.5, o: well * 0.9 });
      joy.forEach((el, i) => {
        const on = es(t, 4.35 + i * 0.06, 4.55 + i * 0.06, ease.back);
        const a = -PI / 2 + (i - 2) * 0.5;
        pose(el, { x: bx + Math.cos(a) * 90, y: FEET - 90 + Math.sin(a) * 80, s: on, r: T * 20, o: on });
      });

      S.cam.x = 20 + es(t, 2.2, 3) * 20;
      S.cam.z = 1.04 + es(t, 0, 0.5) * 0.05 * (1 - es(t, 0.9, 1.2)) + es(t, 3, 3.4) * 0.06 * (1 - es(t, 4.1, 4.5) * 0.5);
      S.cam.y = 24 + es(t, 3, 3.4) * 16;
    };
  },
};
