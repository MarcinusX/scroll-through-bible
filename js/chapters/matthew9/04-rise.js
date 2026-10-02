// Mt 9,6–8 — "that you may know that the Son of Man has authority on earth to forgive sins": a shaft of light
// comes down onto Him where He stands. He turns to the man: "Get up, take your bed and go home!" The man sits up,
// stands, rolls up his bed and walks off through the gate with it on his shoulder. The crowd is struck with awe,
// then lifts its hands and glorifies God, and the light spreads over the whole yard.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { courtSet, courtCast, CT, WP, FRIENDS, PARALYTIC, HEALED, matWithMan, pallet, rolledMat, pose3, lightShaft, rayBurst, bubble, glyphTag, spark, kf, moving, tr, DAY, GOLDEN } from './lib.js';

const JX = 790, BEDX = 1000;

export default {
  id: 'mt9-rise',
  beats: [
    { v: 6, text: 'Otóż żebyście wiedzieli, iż Syn Człowieczy ma na ziemi władzę odpuszczania grzechów' },
    { v: 6, cont: true, text: '- rzekł do paralityka: Wstań, weź swoje łoże i idź do domu!»' },
    { v: 7 },
    { v: 8, text: 'A tłumy ogarnął lęk na ten widok,' },
    { v: 8, cont: true, text: 'i wielbiły Boga, który takiej mocy udzielił ludziom.' },
  ],
  cam: { x: [-80, 260], y: [-40, 60], z: [0.98, 1.16] },
  build(S) {
    const set = courtSet(S, { skyCols: DAY, sky2: GOLDEN });
    const c = S.c;
    // the light from heaven sits behind the people
    const lightL = S.layer({ par: WP, sh: 1 });
    const shaft = lightL.add(`<g opacity="0">${lightShaft(c, { w0: 60, w1: 150, h: 1500, o: 0.45 })}</g>`);
    const burst = lightL.add(`<g opacity="0">${rayBurst(c, { n: 26, r0: 60, r1: 900, spread: 0.05, o: 0.55 })}</g>`);
    const cast = courtCast(S, set, { awe: true });
    const { jesus, scribes, dis, crowd } = cast;

    /* the friends, the bed, the man */
    const L = S.layer({ par: WP, sh: 5 });
    const [F2X, F3X] = S.portrait ? [1120, 1170] : [1150, 1210];   // phone: where the friends stand in mt9-bed
    const F = (i, x, y) => ({ x, y, s: 0.9, flip: true, armF: 20, armB: 12, head: -4, o: FRIENDS[i] });
    const frBack = L.add(`<g>${pose3(c, [F(0, 868, CT.FEET - 6), F(1, 1090, CT.FEET - 6)])}</g>`);
    const frBackUp = L.add(`<g>${pose3(c, [{ ...F(0, 868, CT.FEET - 6), armF: 60, armB: 150, head: -10 }, { ...F(1, 1090, CT.FEET - 6), armF: 150, armB: 120, head: -10 }])}</g>`);
    const lying = L.add(`<g>${matWithMan(c)}</g>`);
    const bedOnly = L.add(`<g>${pallet(c, 190)}</g>`);
    const sitting = S.puppet(L.add(person(c, { ...PARALYTIC, pose: 'sit' })));
    const standing = S.puppet(L.add(person(c, { ...HEALED })));
    const carrying = S.puppet(L.add(person(c, { ...HEALED, holdF: `<g transform="translate(-6 -40) rotate(-70)">${rolledMat(c, 96)}</g>` })));
    const frFront = L.add(`<g>${pose3(c, [F(2, F2X, CT.FEET + 6), F(3, F3X, CT.FEET + 6)])}</g>`);
    const frFrontUp = L.add(`<g>${pose3(c, [{ ...F(2, F2X, CT.FEET + 6), armF: 140, armB: 150, head: -10 }, { ...F(3, F3X, CT.FEET + 6), armF: 60, armB: 150, head: -12 }])}</g>`);

    /* words, awe, praise */
    const fx = S.layer({ par: WP, sh: 4 });
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Wstań, weź swoje łoże', 'Get up, take up your mat'), tr('i idź do domu!', 'and go to your house!')], { size: 21, dir: -1 })}</g>`);
    const bangs = [[520, 520], [930, 510], [1400, 520], [640, 560]].map(([x, y], i) => ({ i, x, y, el: fx.add(`<g opacity="0">${glyphTag(c, '!', { size: 24 })}</g>`) }));
    const sparks = Array.from({ length: 10 }, (_, i) => ({ i, x: 420 + i * 110 + c.rr(-30, 30), el: fx.add(`<g>${spark(c, c.rr(8, 12))}</g>`) }));

    return (t, time) => {
      const T = time;
      set.update(T);
      set.sk2.layer.fade(es(t, 4.0, 4.6) * 0.8);

      /* v6a — the Son of Man has authority on earth */
      const auth = es(t, 0.1, 0.5);
      const toMan = es(t, 1.02, 1.12);
      const praise = es(t, 4.05, 4.35);
      pose(shaft, { x: JX, y: CT.FEET + 4, o: auth * (1 - es(t, 1.9, 2.3)) + praise * 0.8 });
      jesus.set({
        x: JX, y: CT.FEET, s: 1.04, flip: toMan < 0.5,
        armF: 20 + auth * 30 * (1 - toMan) + toMan * 70 * (1 - es(t, 2.6, 3.0)) + praise * 20, armB: 10 + auth * 130 * (1 - toMan) + praise * 40,
        head: -auth * 6 * (1 - toMan) + toMan * 4, blink: blinkAt(T),
      });
      const sk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(say, { x: JX + 60, y: CT.FEET - 236, s: sk, o: sk > 0.02 ? 1 : 0 });

      /* v7 — he gets up, rolls up his bed, and goes home */
      const sit = es(t, 2.05, 2.12), stand = es(t, 2.3, 2.37), roll = es(t, 2.4, 2.58), load = es(t, 2.55, 2.62);
      pose(lying, { x: BEDX, y: CT.FEET - 14, o: 1 - sit });
      pose(bedOnly, { x: BEDX + roll * 60, y: CT.FEET - 14, sx: 1 - roll * 0.9, o: sit * (1 - load) });
      sitting.set({ x: BEDX - 50, y: CT.FEET - 10, s: 0.86, flip: true, o: sit * (1 - stand), armF: 30, armB: 60, head: -6, blink: blinkAt(T, 3) });
      standing.set({ x: BEDX - 80 + roll * 20, y: CT.FEET + 2, s: 0.9, flip: roll < 0.2, o: stand * (1 - load), armF: 40 + roll * 40, armB: 30 + roll * 50, lean: roll * 8, blink: blinkAt(T, 3) });
      const MK = [[2.62, BEDX - 60], [3.25, 1330], [3.9, 1560]];
      const mx = kf(t, MK, (u) => u);
      const wave_ = bump(t, 3.3, 3.9);
      carrying.set({ x: mx, y: CT.FEET + 2, s: 0.9, o: load * (1 - es(t, 3.8, 3.95)), walk: moving(t, MK) ? mx * 0.05 : undefined, armF: 70, armB: 20 + wave_ * 130, head: -wave_ * 6, blink: blinkAt(T, 3) });

      /* the friends cheer, then lift their hands with the crowd */
      const cheer = es(t, 2.35, 2.5);
      pose(frBack, { o: 1 - cheer }); pose(frBackUp, { o: cheer });
      pose(frFront, { o: 1 - cheer }); pose(frFrontUp, { o: cheer });

      /* v8a — awe falls on the crowd; v8b — they glorify God */
      const awe = es(t, 3.05, 3.25);
      crowd.forEach((g) => { g.calm.set({ x: g.x + (g.x > 800 ? 14 : -14) * awe, y: g.y - awe * 3, o: 1 - praise }); g.awe.set({ x: g.x, y: g.y - praise * 4, o: praise }); });
      bangs.forEach((b) => {
        const k = es(t, 3.08 + b.i * 0.06, 3.25 + b.i * 0.06, ease.back) * (1 - es(t, 3.9, 4.05));
        pose(b.el, { x: b.x, y: b.y, s: k, r: k > 0.02 && T ? Math.sin(T * 6 + b.i) * 6 : 0, o: k > 0.02 ? 1 : 0 });
      });
      scribes.forEach((s) => s.p.set({ x: s.x, y: s.y, s: 0.9, armF: 30 + awe * 40, armB: 18 + awe * 60 * (s.i % 2), lean: -awe * 6, head: -awe * 8, blink: blinkAt(T, s.seed) }));
      dis.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.86, flip: true, armF: 10 + praise * 140, armB: 10 + praise * 150, head: -praise * 10, blink: blinkAt(T, d.seed) }));
      pose(burst, { x: 800, y: -100, r: T * 1.5, o: praise * 0.9 });
      sparks.forEach((s) => {
        const k = ((T * 0.2 + s.i / 10) % 1);
        pose(s.el, { x: s.x + Math.sin(T + s.i) * 10, y: CT.FEET - 200 - k * 380, r: T * 40, s: 0.8, o: praise * Math.sin(k * Math.PI) });
      });

      /* camera: Jesus and the bed → the man walking off → the whole yard */
      // phone: a little further right, so the friends by the bed stay in view
      S.cam.x = (S.portrait ? 150 : 90) + es(t, 2.55, 3.3) * (S.portrait ? 80 : 120) - es(t, 3.2, 4.2) * (S.portrait ? 230 : 210);
      S.cam.z = 1.1 - es(t, 3.2, 4.2) * 0.1;
      S.cam.y = 30 - es(t, 0.1, 0.5) * 30 * (1 - toMan) - es(t, 3.9, 4.4) * 30;
    };
  },
};
