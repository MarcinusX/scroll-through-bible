// Łk 4,5–8 — the whirl of shadow sets them down high above a sea of clouds, and "in a moment of time" there is
// a flash and all the kingdoms of the world hang round them at once, gold-rimmed painted plates: Egypt, Babylon,
// Rome, the East, the ships of the sea, the cities of Greece. "All this has been handed over to me": gold strings
// run down from every plate into the tempter's fist, and he holds the whole bunch out — "I give it to whom I
// will". "If you bow down before me": a pale kneeling shape at his feet, his shadow swells. Jesus answers with
// the Law: the scroll comes down, the strings snap, the kingdoms are pulled up into the flies, and in the light
// from above He kneels to the Lord his God.
import { C, person, CAST, blinkAt, pose, lerp, swing } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { peakSet, KINGDOMS, kingdomPlate, TEMPTER, tempterAura, whirl, hand, headAt, rayBurst, lightShaft, addScroll, setScroll, sparkle, shadowPerson, tr, PI } from './lib.js';

const TOP = 700;
const JX = 900;
const TX = 640;
const PLATES = [[330, 330], [500, 248], [690, 200], [910, 200], [1100, 248], [1270, 330]];
const L0 = 100;

/** the tempter's back hand (the arm behind), from the same geometry as hand() */
const backHand = (x, y, s, flip, a, lean = 0) => { const [hx, hy] = hand(x, y, s, flip, a, lean); return [hx - (flip ? -16 : 16) * s, hy]; };

export default {
  id: 'lk4-kingdoms',
  beats: [
    { v: 5 },
    { v: 6 },
    { v: 7 },
    { v: 8 },
  ],
  cam: { x: [-30, 30], y: [-20, 60], z: [1, 1.1] },
  build(S) {
    const P = peakSet(S, { top: TOP });
    const c = P.c;

    /* the light from above (behind Him) */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true, pad: 320 });
    const shaft = lightL.add(`<g opacity="0">${lightShaft(c, { w0: 60, w1: 170 })}</g>`);

    /* the kingdoms, all at once, and the strings the tempter holds them by */
    const fly = S.layer({ par: 0.5, sh: 6 });
    const plates = PLATES.map(([x, y], i) => ({ x, y, i, el: fly.add(`<g class="hang" transform="translate(0 -1500)"><path d="M0 -1800V-78" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/><g class="obj">${kingdomPlate(c, KINGDOMS[i])}</g></g>`) }));
    const flash = S.layer({ par: 0, sh: 0, flat: true });
    flash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#fffaf0"/>`);
    flash.fade(0);

    /* people on the summit */
    const PL = S.layer({ par: 0.5, sh: 5, pad: 320 });
    const strings = PLATES.map((_, i) => PL.add(`<g opacity="0"><path d="${c.ribbon([[0, 0], [L0, 0]], 2.4)}" fill="${C.haloRim}"/></g>`));
    const aura = PL.add(`<g opacity="0">${tempterAura(c, 136)}</g>`);
    const bowShape = PL.add(`<g opacity="0">${shadowPerson(c, { pose: 'kneel', hairStyle: 'long', mantle: true }, '#8d86a0')}</g>`);
    const tempter = S.puppet(PL.add(person(c, { ...TEMPTER })));
    const fist = PL.add(`<g opacity="0"><circle r="30" fill="url(#warm-glow)"/><circle r="7" fill="${C.sun}"/></g>`);
    const jStand = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const jKneel = S.puppet(PL.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const burst = PL.add(`<g opacity="0">${rayBurst(c, { n: 20, r0: 50, r1: 520, spread: 0.05, o: 0.75 })}</g>`);
    const glints = PLATES.map(() => PL.add(`<g opacity="0">${sparkle(c, 10)}</g>`));
    const sw = PL.add(`<g>${whirl(c, 1)}</g>`);

    const scL = S.layer({ par: 0.1, sh: 6 });
    const scroll = addScroll(scL, c, [tr('Napisane jest:', 'It is written:'), tr('«Panu, Bogu swemu, będziesz oddawał pokłon', '“You shall worship the Lord your God,'), tr('i Jemu samemu służyć będziesz»', 'and you shall serve him only.”')], { w: 540, h: 150, size: 24 });

    return (t, time) => {
      P.update(t, time);
      swing(P.sunEl, 1230, 180, time, 1, 0.6);

      /* v5a: led up — the summit rises out of the clouds and the whirl sets them down */
      const rise = es(t, 0.0, 0.42, ease.out);
      P.G.shift(0, (1 - rise) * 320);
      P.wisp.shift(t * 12, (1 - rise) * 380);
      PL.shift(0, (1 - rise) * 320);
      lightL.shift(0, (1 - rise) * 320);
      P.seaL.shift(-t * 24, -(1 - rise) * 60);
      const arrive = es(t, 0.25, 0.5);
      pose(sw, { x: 770, y: 560, s: 3.4 - arrive * 2.6, r: t * 300, o: 0.9 * seg(t, 0.1, 0.22) * (1 - es(t, 0.45, 0.6)) });

      /* v5b: in one moment — a flash, and every kingdom is there */
      flash.fade(bump(t, 0.52, 0.78) * 0.7);
      const up = (i) => es(t, 3.15 + i * 0.03, 3.45 + i * 0.03, ease.in);
      plates.forEach((p) => {
        const k = es(t, 0.56, 0.64, ease.out);
        const u = up(p.i);
        const shine = es(t, 1.2, 1.5) * (1 - es(t, 3.05, 3.2));
        pose(p.el, { x: p.x, y: lerp(-420, p.y, k) - u * 760, r: Math.sin(time * 0.8 + p.i) * 1.4 + bump(t, 0.6, 0.9) * Math.sin(t * 60 + p.i) * 4 + shine * Math.sin(time * 3 + p.i) * 1.5, o: k > 0.001 && u < 0.999 ? 1 : 0 });
        const g = bump(t, 1.25 + p.i * 0.08, 1.75 + p.i * 0.08) + bump(t, 0.62, 0.95) * 0.8;
        pose(glints[p.i], { x: p.x + 40 * Math.cos(p.i * 2.1), y: p.y - 50 + 20 * Math.sin(p.i * 1.7), s: g * 1.2, r: time * 60, o: Math.min(1, g) });
      });

      /* the tempter: gathers the strings in his fist (v6), holds them out and demands worship (v7), is thrown back (v8) */
      const gather = es(t, 1.08, 1.4);
      const offer = es(t, 2.05, 2.35);
      const thrown = es(t, 3.05, 3.4, ease.out);
      const cower = es(t, 3.5, 3.9);
      const tx = TX - thrown * 150;
      const ts = 1.06 * (1 - thrown * 0.18);
      const aB = 10 + gather * 140 - offer * 60 - thrown * 50;
      const aF = 14 + bump(t, 1.3, 2.0) * 50 + offer * 60 * (1 - thrown);
      tempter.set({ x: tx, y: TOP + thrown * 6, s: ts, o: arrive, armF: aF, armB: aB, head: offer * 8 + thrown * 14 + cower * 10, lean: offer * 8 - thrown * 14 + cower * 8, blink: blinkAt(time, 5) });
      pose(aura, { x: tx - 6, y: TOP + 10, s: ts * (1 + offer * 0.45 * (1 - thrown) - thrown * 0.35) * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4 + thrown * 20, o: arrive * 0.9 * (1 - thrown * 0.35) });
      pose(bowShape, { x: TX + 118, y: TOP + 2, s: 0.95, sx: -0.95, o: es(t, 2.2, 2.5) * (1 - es(t, 3.05, 3.2)) * 0.7 });
      const [fx, fy] = backHand(tx, TOP, ts, false, aB, offer * 8 - thrown * 14);
      const hold = gather * (1 - es(t, 3.05, 3.12));
      pose(fist, { x: fx, y: fy, s: 1 + Math.sin(time * 3) * 0.06, o: hold });
      PLATES.forEach(([px, py], i) => {
        const x0 = px, y0 = py + 82;
        const k = es(t, 1.1 + i * 0.05, 1.3 + i * 0.05);
        const snap = seg(t, 3.05, 3.2);
        const ex = lerp(x0, fx, k), ey = lerp(y0, fy, k);
        const len = Math.hypot(ex - x0, ey - y0), ang = (Math.atan2(ey - y0, ex - x0) * 180) / PI;
        pose(strings[i], { x: x0, y: y0 - up(i) * 760, r: ang, sx: Math.max(0.01, len / L0) * (1 - snap * 0.6), o: k > 0.01 ? 0.85 * (1 - snap) : 0 });
      });

      /* Jesus */
      const refuse = es(t, 3.02, 3.2) * (1 - es(t, 3.5, 3.6));
      const kneel = es(t, 3.55, 3.62);
      jStand.set({ x: JX, y: TOP, s: 1.06, flip: true, o: arrive * (1 - kneel), armF: 14 + refuse * 80 + bump(t, 1.4, 1.9) * 8, armB: 8 + refuse * 40, lean: -refuse * 5, head: -refuse * 4 + bump(t, 0.6, 1.0) * -6, blink: blinkAt(time) });
      jKneel.set({ x: JX + 10, y: TOP, s: 1.06, flip: false, o: kneel, armF: 60, armB: 110, head: -14, blink: blinkAt(time, 2) });
      const [jhx, jhy] = headAt(JX, TOP, 1.06, true);
      const b = bump(t, 3.02, 3.6);
      pose(burst, { x: jhx, y: jhy + 30, s: 0.4 + b * 0.9, r: t * 10, o: b });

      /* v8: the Law comes down; the light */
      const sh = es(t, 3.35, 3.7);
      pose(shaft, { x: JX + 10, y: TOP + 6, o: sh * (0.9 + Math.sin(time * 1.3) * 0.08) });
      const down = es(t, 3.05, 3.35, ease.out);
      setScroll(scroll, 800, lerp(-420, 104, down) + Math.sin(time * 0.8) * 2, es(t, 3.25, 3.55), down, Math.sin(time * 0.6) * 0.5);

      S.cam.z = 1.02 + es(t, 1.0, 1.5) * 0.03 + es(t, 2.0, 2.5) * 0.03 - es(t, 3.0, 3.4) * 0.05;
      S.cam.x = lerp(0, -20, es(t, 2.0, 2.5)) * (1 - es(t, 3.0, 3.5));
      S.cam.y = 20 + es(t, 2.0, 2.5) * 20 - es(t, 3.0, 3.4) * 10;
    };
  },
};
