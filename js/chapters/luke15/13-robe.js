// Łk 15,21–22 — at the gateway of the farmstead in the evening, the house behind. "The son said to him: 'Father, I
// have sinned against heaven and before you…'": the ragged son sinks to his knees before his father, his hand on
// his heart; "'…I am no longer worthy to be called your son'": he bows down to the ground — but the father bends,
// takes his hands and lifts him up before he can say any more. "But the father said to his servants: 'Quickly,
// bring out the best robe and put it on him'": he turns and calls to the house; the door lights up and a servant
// runs out with a white robe trimmed with gold and throws it round the son's shoulders — a sparkle, and the rags are
// gone. "'…and put a ring on his hand and sandals on his feet!'": a second servant brings a gold ring — it glints on
// his finger — and kneels to tie sandals on his bare feet; the son stands up straight in his father's house.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  farmSet, FM, FATHER, YOUNGER_ROBED, SERVANTS, ragsMarkup, barefoot, withFace, faceBits, bestRobe, ring, sandals, say, sparkle, heart, voiceRings, glow,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, EVE,
} from './lib.js';

const GY = FM.GY;
const FX = 900, SX = 790;

export default {
  id: 'lk15-robe',
  parable: true,
  beats: [
    { v: 21, text: 'A syn rzekł do niego: "Ojcze, zgrzeszyłem przeciw Bogu i względem ciebie,' },
    { v: 21, cont: true, text: 'już nie jestem godzien nazywać się twoim synem".' },
    { v: 22, text: 'Lecz ojciec rzekł do swoich sług: "Przynieście szybko najlepszą szatę i ubierzcie go;' },
    { v: 22, cont: true, text: 'dajcie mu też pierścień na rękę i sandały na nogi!' },
  ],
  cam: { x: [-40, 160], y: [0, 50], z: [1, 1.16] },
  build(S) {
    const F = farmSet(S, { skyCols: EVE, sunAt: [1300, 330], tint: 0.06, tintCol: C.dusk });
    const c = F.c;
    const L = F.people;
    const behind = S.layer({ par: FM.P, sh: 0, flat: true });
    L.el.parentNode.insertBefore(behind.el, L.el);
    const warm = behind.add(`<g>${glow(220, 0.7)}</g>`);

    const father = S.puppet(L.add(withFace(person(c, FATHER), faceBits(c))));
    const kneel = S.puppet(L.add(withFace(ragsMarkup(c, { pose: 'kneel' }), faceBits(c))));
    fade(kneel.el.querySelector('[data-part="sad"]'), 1);
    const standR = S.puppet(L.add(ragsMarkup(c)));
    const robedBare = S.puppet(L.add(barefoot(person(c, YOUNGER_ROBED), YOUNGER_ROBED.skin)));
    const robed = S.puppet(L.add(person(c, YOUNGER_ROBED)));
    const robeServ = S.puppet(L.add(person(c, { ...SERVANTS[1], holdF: `<g transform="rotate(-90) translate(-2 -6) scale(.7)">${bestRobe(c)}</g>` })));
    const robeEmpty = S.puppet(L.add(person(c, SERVANTS[1])));
    const flyRobe = L.add(`<g opacity="0">${bestRobe(c)}</g>`);
    const ringServ = S.puppet(L.add(person(c, { ...SERVANTS[2], holdB: `<g transform="translate(-4 4) rotate(20)">${sandals(c)}</g>`, holdF: `<g transform="translate(0 2)">${ring(c, 5)}</g>` })));
    const ringKneel = S.puppet(L.add(person(c, { ...SERVANTS[2], pose: 'kneel' })));
    const ringEl = F.fx.add(`<g opacity="0">${ring(c, 5)}</g>`);
    const sandalEl = F.fx.add(`<g opacity="0">${sandals(c)}</g>`);
    const shine = F.fx.add(`<g opacity="0">${sparkle(c, 22)}</g>`);
    const ringShine = F.fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`);
    const confess = F.fx.add(`<g opacity="0">${say(c, [tr('Ojcze, zgrzeszyłem', 'Father, I have sinned'), tr('przeciw Bogu i wobec ciebie…', 'against heaven and you…')], { size: 18, side: -1 })}</g>`);
    const quick = F.fx.add(`<g opacity="0">${say(c, [tr('Szybko!', 'Quick!'), tr('Najlepszą szatę!', 'The best robe!')], { size: 20, side: -1 })}</g>`);
    const more = F.fx.add(`<g opacity="0">${say(c, [tr('Pierścień', 'A ring'), tr('i sandały!', 'and sandals!')], { size: 20, side: -1 })}</g>`);
    const call = voiceRings(F.fx, c, { n: 3, color: shade(C.ochre, 0.3), r: 30 });

    return (t, time) => {
      const T = time;
      F.update(T, { glowO: 0.7 });
      fade(F.doorLit, es(t, 2.1, 2.2) * 0.9);

      /* v21 — he kneels and confesses; he bows to the ground; his father lifts him */
      const knO = seg(t, 0.0, 0.04) * (1 - seg(t, 1.72, 1.76));
      const bowDown = es(t, 1.05, 1.3);
      const lifted = es(t, 1.5, 1.72);
      kneel.set({ x: SX, y: GY, s: 1.0, o: knO, armF: 60 + bowDown * 20 + lifted * 30, armB: 60 - bowDown * 20, head: 10 + bowDown * 20 - lifted * 20, lean: bowDown * 22 - lifted * 16, blink: blinkAt(T, 1) });
      const ck = es(t, 0.12, 0.26, ease.back) * (1 - es(t, 1.0, 1.1));
      const [khx, khy] = headP(SX, GY, 1.0, false, 'kneel');
      pose(confess, { x: khx - 20, y: khy - 30, s: Math.max(0.001, ck), o: ck > 0.01 ? 1 : 0 });
      const stand = seg(t, 1.72, 1.76) * (1 - seg(t, 2.66, 2.7));
      standR.set({ x: SX, y: GY, s: 1.0, o: stand, armF: 40, armB: 20, head: 8, blink: blinkAt(T, 1) });

      /* the father: bends to him, lifts him; turns to call the servants */
      const bend = es(t, 1.3, 1.5) * (1 - es(t, 1.7, 1.86));
      const calling = bump(t, 2.02, 2.5) + bump(t, 3.02, 3.5);
      father.set({ x: FX, y: GY, s: 1.04, flip: true, armF: 30 + bend * 40 + lifted * (1 - es(t, 1.9, 2.0)) * 20 + es(t, 3.8, 3.95) * 40, armB: 20 + bend * 30 + calling * 110, lean: bend * 16, head: bend * 14 - calling * 6, blink: blinkAt(T) });
      fade(father.el.querySelector('[data-part="sad"]'), 0);
      const [fhx, fhy] = headP(FX, GY, 1.04, true);
      call(fhx - 30, fhy, calling, T, { dir: -1 });
      const qk = es(t, 2.06, 2.2, ease.back) * (1 - es(t, 2.8, 2.9));
      pose(quick, { x: fhx - 20, y: fhy - 32, s: Math.max(0.001, qk), o: qk > 0.01 ? 1 : 0 });
      const mk = es(t, 3.04, 3.16, ease.back) * (1 - es(t, 3.8, 3.9));
      pose(more, { x: fhx - 20, y: fhy - 32, s: Math.max(0.001, mk), o: mk > 0.01 ? 1 : 0 });
      pose(warm, { x: (SX + FX) / 2, y: GY - 120, s: 1, o: 0.5 + es(t, 2.7, 3.0) * 0.4 });

      /* v22a — the best robe: a servant runs out with it and throws it round him */
      const RK = [[2.18, FM.DOOR], [2.5, SX - 90]];
      const rx = kf(t, RK);
      const thrown = seg(t, 2.56, 2.6);
      robeServ.set({ x: rx, y: GY, s: 0.96, o: seg(t, 2.16, 2.2) * (1 - thrown), walk: moving(t, RK) ? rx * 0.08 : undefined, amt: 1.4, armF: 90, armB: 20, lean: moving(t, RK) ? 8 : 0, blink: blinkAt(T, 4) });
      robeEmpty.set({ x: SX - 90, y: GY, s: 0.96, o: thrown, armF: 60 * (1 - es(t, 2.8, 3.0)), armB: 10, head: 4, blink: blinkAt(T, 4) });
      const fk = es(t, 2.56, 2.68);
      const [shx, shy] = headP(SX, GY, 1.0, false);
      pose(flyRobe, { x: lerp(SX - 40, shx - 2, fk), y: lerp(GY - 140, shy + 18, fk), s: lerp(0.7, 1.0, fk), r: lerp(-60, 0, fk), o: fk > 0 && fk < 1 ? 1 : 0 });
      const dressed = seg(t, 2.66, 2.7);
      const tall = es(t, 3.7, 3.9);
      robedBare.set({ x: SX, y: GY, s: 1.0, o: dressed * (1 - seg(t, 3.68, 3.72)), armF: 30 + es(t, 3.3, 3.4) * 40, armB: 10, head: 6 - es(t, 2.8, 3.0) * 8, blink: blinkAt(T, 1) });
      robed.set({ x: SX, y: GY, s: 1.0, o: seg(t, 3.68, 3.72), armF: 30 + tall * 20, armB: 10 + tall * 30, head: -tall * 6, blink: blinkAt(T, 1) });
      pose(shine, { x: shx, y: shy + 80, s: bump(t, 2.64, 2.95), r: T * 30, o: bump(t, 2.64, 2.95) });

      /* v22b — the ring on his hand; sandals on his feet */
      const GK = [[3.0, FM.DOOR], [3.28, SX - 150]];
      const gx = kf(t, GK);
      const kneelS = seg(t, 3.46, 3.5);
      ringServ.set({ x: gx, y: GY, s: 0.94, o: seg(t, 2.98, 3.02) * (1 - kneelS), walk: moving(t, GK) ? gx * 0.08 : undefined, amt: 1.3, armF: 30 + es(t, 3.28, 3.36) * 50, armB: 40, blink: blinkAt(T, 5) });
      ringKneel.set({ x: SX - 70, y: GY, s: 0.94, o: kneelS, armF: 60, armB: 30, head: 16, lean: 10, blink: blinkAt(T, 5) });
      const rk = es(t, 3.3, 3.42);
      const [hx, hy] = handP(SX, GY, 1.0, false, 70);
      const [sx0, sy0] = handP(SX - 150, GY, 0.94, false, 80);
      pose(ringEl, { x: lerp(sx0, hx, rk), y: lerp(sy0, hy, rk), o: rk > 0 && t < 3.44 ? 1 : 0 });
      pose(ringShine, { x: hx + 2, y: hy - 2, s: bump(t, 3.4, 3.7), r: T * 40, o: bump(t, 3.4, 3.7) });
      const sk = es(t, 3.52, 3.68);
      pose(sandalEl, { x: lerp(SX - 90, SX - 2, sk), y: GY - 6, s: 0.9, o: sk > 0 && t < 3.7 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 60], [1.0, 60], [2.0, 20], [2.6, 0], [3.4, 20]]);
      S.cam.y = kf(t, [[0, 40], [1.5, 40], [2.5, 30], [3.6, 40]]);
      S.cam.z = kf(t, [[0, 1.12], [1.5, 1.16], [2.2, 1.06], [3.0, 1.1], [3.8, 1.14]]);
    };
  },
};
