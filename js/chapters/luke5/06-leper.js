// Łk 5,12–14 — a street in one of the towns. Jesus comes in under the arch with the four; from the far end a man
// full of leprosy comes ringing his bell, grey-rose blotches all over him, and the people by the well draw back. He
// sees Jesus and falls on his face: "Lord, if you will, you can make me clean." Jesus stretches out His hand and
// touches him (the disciples start back): "I will; be clean" — and at once the blotches peel off him like flakes of
// grey paper and blow away; he kneels up, clean. Jesus lifts a finger — tell no one (a speech bubble taped shut) —
// and points to the road out under the arch: "go, show yourself to the priest": a round plate comes down with the
// priest at the Temple receiving the two birds of the offering, and the tablets of Moses beside it.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  streetSet, ST, LEPER_FULL, LEPER_HEALED, bell, addToBody, addToHead, bubble, speech, wordSlip, tapeX, sparkle, voiceRings,
  priestPlate, lawTablets, hangAt, headAt, hand, kf, moving, heartGlow, DAY, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const FEET = 742, JX = 700, KX = 846;
const PSPOTS = [[4, -126], [-10, -110], [14, -104], [-16, -74], [10, -80], [-2, -56], [18, -52], [-20, -30], [6, -24], [22, -12], [-8, -14], [12, -140], [-6, -136], [24, -30]];
const HSPOTS = [[6, -6], [-6, 4], [12, 8], [-2, -12]];

/** a point given in a puppet's body coordinates (lean in degrees), in world coordinates */
function bodyPt(x, y, s, flip, lean, px, py) {
  const l = (lean * PI) / 180;
  const rx = px * Math.cos(l) - py * Math.sin(l), ry = px * Math.sin(l) + py * Math.cos(l);
  return [x + (flip ? -1 : 1) * rx * s, y + ry * s];
}
const spot = (c, i) => `<path d="${c.cut(c.blob(0, 0, c.rr(3.5, 6.5), c.rr(3, 5.5), 8, 0.3), 0.4, 3)}" fill="${i % 2 ? '#a88f8c' : '#8f8a8e'}"/>`;

export default {
  id: 'lk5-leper',
  beats: [
    { v: 12, text: 'Gdy przebywał w jednym z miast, zjawił się człowiek cały pokryty trądem.' },
    { v: 12, cont: true, text: 'Gdy ujrzał Jezusa, upadł na twarz i prosił Go: «Panie, jeśli chcesz, możesz mnie oczyścić».' },
    { v: 13, text: 'Jezus wyciągnął rękę i dotknął go, mówiąc: «Chcę, bądź oczyszczony».' },
    { v: 13, cont: true, text: 'I natychmiast trąd z niego ustąpił.' },
    { v: 14, text: 'A On mu przykazał, żeby nikomu nie mówił:' },
    { v: 14, cont: true, text: '«Ale idź, pokaż się kapłanowi i złóż ofiarę za swe oczyszczenie, jak przepisał Mojżesz, na świadectwo dla nich».' },
  ],
  cam: { x: [-80, 120], y: [0, 100], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const K = streetSet(S, { skyCols: DAY });

    /* the people of the street */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const folkAt = [
      { x: 1250, o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair3, skin: C.skin2, belt: null, holdB: `<g transform="translate(0 -4)">${sheet().p(c.cut([[-12, 0], [-16, -18], [-8, -28], [8, -28], [16, -18], [12, 0]], 0.4, 4), C.pot).out()}</g>` }, flip: true },
      { x: PH ? 990 : 1110, o: { robe: C.ochreRobe, hairStyle: 'short', beard: 'full', hair: C.hair, skin: C.skin3, belt: C.leather }, flip: true },
      { x: 470, o: { robe: C.sageRobe, mantle: C.stone, hairStyle: 'wrap', veil: C.linen2, beard: 'short', hair: C.hair2, skin: C.skin4 }, flip: false },
    ].map((f, i) => ({ ...f, i, p: S.puppet(PL.add(person(c, f.o))), seed: c.rr(0, 9) }));
    const DIS = [CAST.john, CAST.james, CAST.andrew, CAST.peter].map((o, i) => ({ i, o, p: S.puppet(PL.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(PL.add(person(c, CAST.jesus)));
    const voice = voiceRings(PL, c, { n: 3, color: C.sun, r: 38, w: 6, both: false });

    /* the man: walking with his bell, then on his face — spotted all over; then clean */
    const bodySpots = PSPOTS.map(([x, y], i) => `<g transform="translate(${x} ${y})">${spot(c, i)}</g>`).join('');
    const headSpots = HSPOTS.map(([x, y], i) => `<g transform="translate(${x} ${y})">${spot(c, i + 1)}</g>`).join('');
    const kneelSpots = PSPOTS.map(([x, y], i) => `<g transform="translate(${x} ${y < -40 ? y + 46 : y})">${spot(c, i)}</g>`).join('');
    const walker = S.puppet(PL.add(addToHead(addToBody(person(c, { ...LEPER_FULL, holdF: `<g data-k="bell">${bell(c)}</g>` }), bodySpots), headSpots)));
    const bellEl = S.$('bell');
    const down = S.puppet(PL.add(addToHead(addToBody(person(c, { ...LEPER_FULL, pose: 'kneel' }), kneelSpots), headSpots)));
    const clean = S.puppet(PL.add(person(c, { ...LEPER_HEALED, pose: 'kneel' })));
    const standUp = S.puppet(PL.add(person(c, LEPER_HEALED)));
    const flakes = [...PSPOTS.map(([x, y]) => [x, y < -40 ? y + 46 : y]), ...HSPOTS.map(([x, y]) => [x + 2, y - 121])].map(([x, y], i) => ({ i, x, y, el: PL.add(`<g>${spot(c, i)}</g>`), dx: c.rr(0.4, 1.2), spin: c.rr(200, 520) }));
    const sparks = [0, 1, 2, 3, 4].map((i) => PL.add(`<g>${sparkle(c, 12 + (i % 3) * 5)}</g>`));
    const heart = PL.add(`<g>${heartGlow(c, 14)}</g>`);

    /* words */
    const FX = S.layer({ par: 0.5, sh: 5 });
    const plea = FX.add(`<g>${bubble(c, [tr('Panie, jeśli chcesz,', 'Lord, if you want to,'), tr('możesz mnie oczyścić', 'you can make me clean')], { size: 19, tail: -1 })}</g>`);
    const will = FX.add(`<g>${bubble(c, tr('Chcę, bądź oczyszczony', 'I want to. Be made clean.'), { size: 21, fill: C.halo, tail: 1 })}</g>`);
    const hush = FX.add(`<g>${speech(c, `<g transform="translate(-16 -6)">${wordSlip(c, 26)}</g><g transform="translate(10 8)">${wordSlip(c, 30)}</g><g transform="translate(0 2) rotate(35)">${tapeX(c, 60)}</g><g transform="translate(0 2) rotate(-35)">${tapeX(c, 60)}</g>`, { w: 84, h: 56 })}</g>`);

    /* the priest and the offering Moses commanded (a plate on a string), the tablets beside it */
    const HL = S.layer({ par: 0.35, sh: 6 });
    const plate = HL.add(`<g><path d="M0 -1600V-128" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><g transform="scale(.9)">${priestPlate(c)}</g></g>`);
    const tabs = HL.add(`<g><path d="M0 -1600V-90" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><g transform="translate(0 6) scale(.62)">${lawTablets(c)}</g></g>`);
    const road = FX.add(`<g><path d="${c.ribbon([[0, 0], [70, -8]], 4)}" fill="${C.terracotta}" opacity=".85"/><path d="${c.poly([[66, -18], [90, -10], [68, 4]])}" fill="${C.terracotta}" opacity=".85"/></g>`);

    return (t, time) => {
      const T = time;
      K.idle(T);

      /* v12a — Jesus with the four; the man full of leprosy comes ringing his bell, people draw back */
      const jIn = es(t, 0.0, 0.5, ease.out);
      const come = es(t, 0.2, 0.95);
      const lx = lerp(1480, KX + 20, come);
      const fall = es(t, 1.12, 1.2);
      const walking = come > 0 && come < 1;
      walker.set({ x: lx, y: FEET, s: 1.0, flip: true, o: 1 - fall, walk: walking ? lx * 0.04 : undefined, amt: 0.7, armF: 50, armB: 10, head: 10 - bump(t, 1.0, 1.15) * 16, lean: 6, blink: blinkAt(T, 3) });
      pose(bellEl, { r: T ? Math.sin(T * 11) * (walking ? 24 : 8) : 0 });
      folkAt.forEach((f) => {
        const near = f.x > 900 ? es(t, 0.35 + (1300 - f.x) * 0.001, 0.7 + (1300 - f.x) * 0.001) : es(t, 0.5, 0.9);
        f.p.set({ x: f.x + (f.x > 900 ? 60 : -30) * near, y: FEET - 30 + f.i * 6, s: 0.84, flip: f.x > 900 ? !(near > 0.5) : false, armF: 14 + near * 60, armB: near * 90, lean: -near * 8, head: -near * 6, blink: blinkAt(T, f.seed) });
      });

      /* v12b — he falls on his face and begs */
      const prone = es(t, 1.18, 1.4);
      const healed = es(t, 3.08, 3.14);
      const kneelUp = es(t, 3.6, 3.9);
      const rise = es(t, 5.3, 5.36);
      down.set({ x: KX, y: FEET, s: 1.0, flip: true, o: fall * (1 - healed), armF: 40 + prone * 60, armB: 30 + prone * 70, lean: prone * 46, head: prone * 24, blink: blinkAt(T, 3) });
      const pk = es(t, 1.35, 1.55, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(plea, { x: KX + 40, y: FEET - 150, s: pk, o: pk > 0.01 ? 1 : 0 });

      /* v13a — He stretches out His hand and touches him */
      const step = es(t, 2.02, 2.3);
      const reach = es(t, 2.15, 2.45) * (1 - es(t, 3.7, 4.0));
      const jx = lerp(lerp(560, JX, jIn), KX - 120, step);
      const hushK = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.05));
      const point = es(t, 5.05, 5.3);
      jesus.set({ x: jx, y: FEET, s: 1.05, walk: (jIn > 0 && jIn < 1) || (step > 0 && step < 1) ? jx * 0.05 : undefined, armF: 14 + reach * 64 + point * 70, armB: 10 + hushK * 130 + point * 10, lean: reach * 10, head: reach * 12 - point * 4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(jx, FEET, 1.05, false);
      voice(jhx + 16, jhy, es(t, 2.2, 2.4) * (1 - es(t, 2.9, 3.05)) + hushK + point * (1 - es(t, 5.8, 5.95)), T, { dir: 1, spread: 2 });
      const wk = es(t, 2.3, 2.5, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(will, { x: jhx + 10, y: jhy - 60, s: wk, o: wk > 0.01 ? 1 : 0 });
      const hk = es(t, 1.9, 2.3) * (1 - es(t, 2.9, 3.2));
      pose(heart, { x: jx + 8, y: FEET - 118, s: 0.6 + hk * 0.6, o: hk });
      DIS.forEach((d) => {
        const start = es(t, 2.35, 2.6) * (1 - es(t, 3.4, 3.8));
        const x = PH ? lerp(lerp(370, 450, jIn), 490, step) + d.i * 56 - start * 20 : lerp(lerp(300, 380, jIn), 420, step) + d.i * 62 - start * 20;   // phone: the four inside the screen
        d.p.set({ x, y: FEET - 12 + (d.i % 2) * 6, s: 0.94, walk: (jIn > 0 && jIn < 1) || (step > 0 && step < 1) ? x * 0.05 + d.i : undefined, armF: 14 + start * 50 + es(t, 3.2, 3.5) * 20, armB: start * (d.i % 2 ? 90 : 30) + es(t, 3.2, 3.5) * (d.i % 2 ? 120 : 40), lean: -start * 8, head: -es(t, 3.2, 3.5) * 6, blink: blinkAt(T, d.seed) });
      });

      /* v13b — the leprosy leaves him: flakes of grey paper peel off and blow away */
      flakes.forEach((f) => {
        const k = seg(t, 3.1 + f.i * 0.012, 3.85 + f.i * 0.012);
        const [x0, y0] = bodyPt(KX, FEET, 1.0, true, 46, f.x, f.y);
        const x = x0 + k * (90 + f.dx * 140) + Math.sin(k * 9 + f.i) * 14 * k, y = y0 - Math.sin(k * PI) * 90 + k * k * 60;
        pose(f.el, { x, y, sx: Math.cos((k * f.spin) / 30), r: k * f.spin, s: 1 + k * 0.5, o: k > 0 && k < 1 ? 1 - k * k : 0 });
      });
      clean.set({ x: KX, y: FEET, s: 1.0, flip: true, o: healed * (1 - rise), armF: 40 + (1 - kneelUp) * 60, armB: 30 + (1 - kneelUp) * 70 + es(t, 3.3, 3.6) * 40 * (1 - kneelUp), lean: 46 * (1 - kneelUp), head: 24 * (1 - kneelUp) - kneelUp * 8, blink: blinkAt(T, 3) });
      sparks.forEach((sp, i) => { const k = bump(t, 3.12 + i * 0.06, 3.85 + i * 0.06); pose(sp, { x: KX - 30 + i * 26, y: FEET - 50 - (i % 3) * 44, s: k, r: T * 50 + i * 20, o: k }); });

      /* v14a — tell no one */
      const hb = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.85, 4.95));
      pose(hush, { x: jhx + 20, y: jhy - 30, s: hb, o: hb > 0.01 ? 1 : 0 });

      /* v14b — go, show yourself to the priest; the plate of the Temple and the tablets of Moses */
      const go = es(t, 5.4, 5.95);
      const sx = lerp(KX, 1080, go);
      standUp.set({ x: sx, y: FEET, s: 1.0, flip: go > 0.02 && go < 0.98 ? false : true, o: rise, walk: go > 0.02 && go < 0.98 ? sx * 0.05 : undefined, armF: 20 + (1 - go) * 20, armB: 20, head: -4, blink: blinkAt(T, 3) });
      const pl = es(t, 5.05, 5.4, ease.out);
      hangAt(plate, 900, lerp(-500, 330, pl), T, pl > 0.01 ? 1 : 0, 1.2, 0.8);
      const tb = es(t, 5.3, 5.6, ease.out);
      hangAt(tabs, 1080, lerp(-500, 320, tb), T, tb > 0.01 ? 1 : 0, 1.2, 0.8, 1);
      const rk = es(t, 5.15, 5.4);
      pose(road, { x: 960, y: FEET - 40, s: rk, o: rk * (1 - es(t, 5.85, 6)) });

      S.cam.x = kf(t, [[0, 80], [1.0, 80], [1.3, 60], [2.2, 40], [3.2, 40], [4.0, 20], [5.0, 40], [6, 70]]);
      S.cam.y = kf(t, [[0, 40], [1.2, 60], [2.2, 70], [3.3, 70], [4.2, 50], [5.1, 20], [6, 10]]);
      S.cam.z = kf(t, [[0, 1.04], [1.2, 1.12], [2.2, 1.18], [3.3, 1.16], [4.2, 1.12], [5.1, 1.02], [6, 1.02]]);
    };
  },
};
