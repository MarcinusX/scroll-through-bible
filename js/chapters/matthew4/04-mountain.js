// Mt 4,8–10 — the whirl of shadow sets them down on the summit of a very high mountain, above a sea of clouds.
// The kingdoms of the world come down on their strings as gold-rimmed painted plates — Egypt, Babylon, Rome,
// the East, the ships of the sea, the cities of Greece — glittering. "All this I will give you": the tempter
// holds out a golden crown; "if you fall down and worship me": a pale kneeling shape appears at his feet
// and his shadow swells. "Away, Satan!": light bursts from Jesus, the tempter is thrown back, the crown falls
// grey and the kingdoms are pulled away into the flies. "Worship the Lord your God": light comes down from
// above and Jesus kneels in it, while the scroll of the Law hangs over Him.
import { C, person, CAST, blinkAt, pose, lerp, swing } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { peakSet, KINGDOMS, kingdomPlate, TEMPTER, tempterAura, whirl, crown, hand, headAt, rayBurst, lightShaft, addScroll, setScroll, sparkle, tr, PI } from './lib.js';
import { shadowPerson } from '../mark3/lib.js';

const TOP = 700;
const JX = 870;
const TX = 640;
const PLATES = [[260, 340], [470, 262], [690, 206], [910, 206], [1130, 262], [1340, 340]];
// phone: the six kingdoms hang in two rows of three in the tall sky, inside the screen
const PLATES_P = [[605, 220], [605, 20], [800, -10], [995, 20], [995, 220], [800, 190]];

export default {
  id: 'mt4-mountain',
  beats: [
    { v: 8, text: 'Jeszcze raz wziął Go diabeł na bardzo wysoką górę,' },
    { v: 8, cont: true, text: 'pokazał Mu wszystkie królestwa świata oraz ich przepych' },
    { v: 9, text: 'i rzekł do Niego: «Dam Ci to wszystko,' },
    { v: 9, cont: true, text: 'jeśli upadniesz i oddasz mi pokłon».' },
    { v: 10, text: 'Na to odrzekł mu Jezus: «Idź precz, szatanie!' },
    { v: 10, cont: true, text: 'Jest bowiem napisane: Panu, Bogu swemu, będziesz oddawał pokłon i Jemu samemu służyć będziesz».' },
  ],
  cam: { x: [-30, 30], y: [-20, 60], z: [1, 1.1] },
  build(S) {
    const P = peakSet(S, { top: TOP });
    const c = P.c;

    /* ---------- the light from above (behind Him) ---------- */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const shaft = lightL.add(`<g opacity="0">${lightShaft(c, { w0: 60, w1: 170 })}</g>`);

    /* ---------- people on the summit ---------- */
    const PL = S.layer({ par: 0.5, sh: 5, pad: 320 });
    const aura = PL.add(`<g opacity="0">${tempterAura(c, 136)}</g>`);
    const bowShape = PL.add(`<g opacity="0">${shadowPerson(c, { pose: 'kneel', hairStyle: 'long', mantle: true }, '#8d86a0')}</g>`);
    const tempter = S.puppet(PL.add(person(c, { ...TEMPTER })));
    const jStand = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const jKneel = S.puppet(PL.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const burst = PL.add(`<g opacity="0">${rayBurst(c, { n: 20, r0: 50, r1: 520, spread: 0.05, o: 0.75 })}<circle r="160" fill="url(#halo-glow)"/></g>`);
    const crownG = PL.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/>${crown(c, 64)}</g>`);
    const crownX = PL.add(`<g opacity="0">${crown(c, 64, C.rock2)}</g>`);
    const glints = [0, 1, 2].map(() => PL.add(`<g opacity="0">${sparkle(c, 10)}</g>`));
    const sw = PL.add(`<g>${whirl(c, 1)}</g>`);

    /* ---------- the kingdoms, on strings ---------- */
    const fly = S.layer({ par: 0.1, sh: 6 });
    const plates = (S.portrait ? PLATES_P : PLATES).map(([x, y], i) => ({ x, y, i, el: fly.add(`<g class="hang"><path d="M0 -1800V-78" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/><g class="obj">${S.portrait ? `<g transform="scale(.88)">${kingdomPlate(c, KINGDOMS[i])}</g>` : kingdomPlate(c, KINGDOMS[i])}</g></g>`) }));
    const scroll = addScroll(fly, c, [tr('Napisane jest:', 'It is written:'), tr('«Panu, Bogu swemu, będziesz oddawał pokłon', '“You shall worship the Lord your God,'), tr('i Jemu samemu służyć będziesz»', 'and you shall serve him only.”')], { w: 520, h: 150, size: 24 });

    return (t, time) => {
      P.update(t, time);
      swing(P.sunEl, 1230, 180, time, 1, 0.6);

      /* v8a: up onto the very high mountain */
      const rise = es(t, 0.0, 0.8, ease.out);
      P.G.shift(0, (1 - rise) * 320);
      P.wisp.shift(t * 12, (1 - rise) * 380);
      PL.shift(0, (1 - rise) * 320);
      P.seaL.shift(-t * 24, -(1 - rise) * 60);
      const arrive = es(t, 0.45, 0.85);
      pose(sw, { x: 760, y: 560, s: 3.4 - arrive * 2.6, r: t * 300, o: 0.9 * seg(t, 0.2, 0.35) * (1 - es(t, 0.75, 1.0)) });

      /* v8b: the kingdoms come down, glittering */
      plates.forEach((p) => {
        const d = Math.abs(p.i - 2.5);
        const k = es(t, 1.05 + d * 0.12, 1.45 + d * 0.12, ease.out);
        const up = es(t, 4.15 + p.i * 0.04, 4.55 + p.i * 0.04, ease.in);
        const vis = k > 0.001 && up < 0.999;
        pose(p.el, { x: p.x, y: lerp(-420, p.y, k) - up * 700, r: Math.sin(time * 0.8 + p.i) * 1.6 + bump(t, 2.1, 2.9) * Math.sin(time * 3 + p.i) * 3, o: vis ? 1 : 0 });
      });

      /* the tempter: sweeps his arm over them, holds out the crown, demands worship, is thrown back */
      const sweep = bump(t, 1.2, 2.0);
      const offer = es(t, 2.05, 2.35) * (1 - es(t, 2.9, 3.1));
      const demand = es(t, 3.05, 3.3) * (1 - es(t, 4.0, 4.15));
      const thrown = es(t, 4.05, 4.4, ease.out);
      const cower = es(t, 5.0, 5.4);
      const tx = TX - thrown * (S.portrait ? 110 : 170);
      const ts = 1.06 * (1 - thrown * 0.2);
      tempter.set({ x: tx, y: TOP + thrown * 6, s: ts, flip: false, o: arrive, armF: 14 + offer * 70 + demand * 34 - thrown * 10, armB: 10 + sweep * 140 + demand * 20, head: demand * 12 + thrown * 14 + cower * 10, lean: -thrown * 14 + demand * 8 + cower * 8, blink: blinkAt(time, 5) });
      pose(aura, { x: tx - 6, y: TOP + 10, s: ts * (1 + demand * 0.45 - thrown * 0.35) * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4 + thrown * 20, o: arrive * 0.9 * (1 - thrown * 0.35) });
      pose(bowShape, { x: TX + 116, y: TOP + 2, s: 0.95, sx: -0.95, o: es(t, 3.2, 3.5) * (1 - es(t, 4.05, 4.2)) * 0.7 });
      // the crown in his hand; after "Away!" it falls, grey
      const [hx, hy] = hand(tx, TOP, ts, false, 14 + offer * 70 + demand * 34 - thrown * 10, -thrown * 14 + demand * 8);
      const cOn = es(t, 2.0, 2.15);
      const fall = seg(t, 4.08, 4.5);
      const lure = es(t, 2.95, 3.3);
      const lx = lerp(hx, 756, lure), ly = lerp(hy - 20, 430 + Math.sin(time * 1.3) * 6, lure);
      const cx = fall > 0 ? lerp(lx, TX + 70, fall) : lx, cy = fall > 0 ? lerp(ly, TOP - 6, fall * fall) : ly;
      const grey = es(t, 4.1, 4.3);
      pose(crownG, { x: cx, y: cy, s: 1 + lure * 0.3 * (1 - fall), r: fall * 70, o: cOn * (1 - grey) });
      pose(crownX, { x: cx, y: cy, r: fall * 70, o: cOn * grey * (1 - es(t, 5.3, 5.6)) });
      glints.forEach((g, i) => { const k = bump(t, 2.15 + i * 0.12, 2.6 + i * 0.12); pose(g, { x: hx + (i - 1) * 30, y: hy - 50 - (i % 2) * 20, s: k * 1.3, r: time * 60, o: k }); });

      /* Jesus */
      const refuse = es(t, 4.02, 4.2) * (1 - es(t, 4.8, 5.0));
      const kneel = es(t, 5.12, 5.2);
      jStand.set({ x: JX, y: TOP, s: 1.06, flip: true, o: arrive * (1 - kneel), armF: 14 + refuse * 80 + bump(t, 2.3, 2.9) * 10, armB: 8 + refuse * 40, lean: -refuse * 5, head: -refuse * 4, blink: blinkAt(time) });
      jKneel.set({ x: JX + 20, y: TOP, s: 1.06, flip: false, o: kneel, armF: 60, armB: 110, head: -14, blink: blinkAt(time, 2) });
      const [jhx, jhy] = headAt(JX, TOP, 1.06, true);
      const b = bump(t, 4.02, 4.7);
      pose(burst, { x: jhx, y: jhy + 30, s: 0.4 + b * 0.9, r: t * 10, o: b });

      /* v10b: light from above; the scroll */
      const sh = es(t, 5.05, 5.4);
      pose(shaft, { x: JX + 20, y: TOP + 6, o: sh * (0.9 + Math.sin(time * 1.3) * 0.08) });
      const down = es(t, 5.05, 5.35, ease.out);
      setScroll(scroll, 800, lerp(-420, 104, down) + Math.sin(time * 0.8) * 2, es(t, 5.25, 5.55), down, Math.sin(time * 0.6) * 0.5);

      S.cam.z = 1.02 + es(t, 1.0, 1.5) * -0.02 + es(t, 2.0, 2.5) * 0.05 - es(t, 4.0, 4.4) * 0.03;
      S.cam.x = lerp(0, -20, es(t, 2.0, 2.5)) * (1 - es(t, 4.0, 4.5));
      S.cam.y = 30 - es(t, 1.0, 1.5) * 30 + es(t, 2.0, 2.5) * 30;
    };
  },
};
