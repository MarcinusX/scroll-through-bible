// Mt 24,48–51 — the same house, at night. "But if that evil servant says in his heart, 'My lord is delaying his
// coming'": the steward looks down the empty road, a thought-cloud with the master asleep far away; he shrugs and
// tosses the keys on the chest. "And begins to beat his fellow servants, and to eat and drink with the drunkards": he
// lifts his stick over a servant who cowers, then sprawls at a table among wine jars with two drunkards, cups up. "The
// lord of that servant will come in a day he doesn't expect": suddenly the master is in the gate with his lamp — the
// cup drops. "He will cut him in pieces and appoint his portion with the hypocrites": the house goes dark, and the
// servant's paper figure tears in two; the halves sink into the outer dark among masked figures. "There is where the
// weeping and grinding of teeth will be": in the dark, the masked ones bow and weep, tears falling.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { houseSet, HOUSE, MASTER, SERVANTS, keyProp, lowTable, cup, wineJar, handLamp, cudgel, thought, zzz, dust, mask, addToHead, tearDrop, along, STEWARD, PI } from './lib.js';

const F = HOUSE.FLOOR;
const NIGHTC = mix(C.night, C.indigo, 0.4);
const T5 = (m, k = 0.4) => m.replace(/#[0-9a-fA-F]{6}\b/g, (h) => ([C.lampFlame, C.lampGlow, '#fff4d2'].includes(h.toLowerCase()) ? h : mix(h, NIGHTC, k)));

export default {
  id: 'mt24-wicked',
  parable: true,
  beats: [
    { v: 48 },
    { v: 49 },
    { v: 50 },
    { v: 51, text: 'Każe go ćwiartować i z obłudnikami wyznaczy mu miejsce.' },
    { v: 51, cont: true, text: 'Tam będzie płacz i zgrzytanie zębów.' },
  ],
  cam: { x: [-40, 120], y: [-50, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#1d2349', '#2b3262', '#4a4876']);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 70 }) + `<g transform="translate(1200 140)">${moon(c, 30)}</g>`);
    const H = houseSet(S, { tintCol: NIGHTC, tintK: 0.5 });

    /* the people of the house */
    const P = S.layer({ par: 0.45, sh: 5 });
    const tableEl = P.add(`<g transform="translate(0 -1500)">${T5(lowTable(c, 300, 40) + `<g transform="translate(-100 -40)">${wineJar(c, 44)}</g><g transform="translate(-40 -40)">${cup(c)}</g><g transform="translate(70 -40)">${wineJar(c, 40, C.clay)}</g>`, 0.3)}</g>`);
    const jars = P.add(`<g transform="translate(0 -1500)">${T5(`<g transform="translate(-40 0)">${wineJar(c, 70)}</g><g transform="translate(20 0) rotate(80) translate(0 -20)">${wineJar(c, 60, C.clay)}</g>`, 0.3)}</g>`);
    const drunk = [0, 1].map((i) => ({ i, p: S.puppet(P.add(T5(person(c, { robe: [C.ochreRobe, C.mauve][i], mantle: [C.clay, null][i], hair: C.hair3, hairStyle: ['wrap', 'short'][i], veil: C.stone, beard: 'full', skin: C.skin3, pose: 'sit', holdF: `<g transform="rotate(-80)">${cup(c)}</g>` })))) }));
    const fellow = S.puppet(P.add(T5(person(c, { ...SERVANTS[0], pose: 'kneel' }))));
    const fellowUp = S.puppet(P.add(T5(person(c, { ...SERVANTS[0] }))));
    const others = [1, 2].map((k) => ({ k, p: S.puppet(P.add(T5(person(c, SERVANTS[k])))) }));
    const EVIL = { ...STEWARD, mantle: C.sun, mantleArm: true };
    const standEvil = S.puppet(P.add(T5(person(c, { ...EVIL, holdB: `<g transform="rotate(-20)">${cudgel(c, 110)}</g>` }), 0.25)));
    const sitEvil = S.puppet(P.add(T5(person(c, { ...EVIL, pose: 'sit', holdF: `<g transform="rotate(-80)">${cup(c)}</g>` }), 0.25)));
    const keysEl = P.add(`<g transform="translate(0 -1500)">${keyProp(c, C.ochre)}</g>`);
    const fallCup = P.add(`<g transform="translate(0 -1500)">${cup(c)}</g>`);
    const master = S.puppet(P.add(T5(person(c, { ...MASTER, holdF: `<g transform="translate(-4 4)">${handLamp(c, { glowR: 170 })}</g>` }), 0.25)));
    const mFlame = master.el.querySelector('.flame');
    const think = P.add(`<g transform="translate(0 -1500)">${thought(c, `<g transform="translate(-12 6) scale(.28)">${person(c, { ...MASTER, pose: 'sit', eyes: 'closed' })}</g><g transform="translate(8 -18) scale(.6)">${zzz(c)}</g>`, { w: 90, h: 66 })}</g>`);
    const puff = P.add(`<g transform="translate(0 -1500)">${dust(c, 18, C.cream)}</g>`);

    /* the dark that falls, the torn figure, the outer darkness with the masked ones */
    const darkL = S.layer({ par: 0.45, sh: 1, flat: true });
    darkL.add(`<rect x="-1400" y="-1400" width="4400" height="3400" fill="${mix(C.night2, '#120f1c', 0.5)}"/>`);
    darkL.fade(0);
    const outer = S.layer({ par: 0.45, sh: 4 });
    S.defs(`<clipPath id="mt24-tearL"><path d="M-80 -260L2 -260L-6 -200L6 -150L-4 -100L8 -50L-2 0L6 20L-80 20Z"/></clipPath><clipPath id="mt24-tearR"><path d="M80 -260L2 -260L-6 -200L6 -150L-4 -100L8 -50L-2 0L6 20L80 20Z"/></clipPath>`);
    const evilFlat = T5(person(c, { ...EVIL }), 0.1);
    const edge = `<path d="M-4 -196L6 -150L-4 -100L8 -50L-2 0L6 20" stroke="${C.cream}" stroke-width="4" fill="none"/>`;
    const halfL = outer.add(`<g transform="translate(0 -1500)"><g clip-path="url(#mt24-tearL)">${evilFlat}${edge}</g></g>`);
    const halfR = outer.add(`<g transform="translate(0 -1500)"><g clip-path="url(#mt24-tearR)">${evilFlat}${edge}</g></g>`);
    // phone: the four hypocrites stand inside the screen, the last one not sliced by the thread
    const HYP = (S.portrait ? [[495, false], [580, false], [1005, true], [1085, true]] : [[470, false], [560, false], [1060, true], [1150, true]]).map(([x, flip], i) => ({
      i, x, flip,
      p: S.puppet(outer.add(addToHead(person(c, { robe: mix(C.plumRobe, C.night2, 0.5), mantle: mix(C.indigo, C.night2, 0.4), hairStyle: 'wrap', veil: mix(C.plumRobe, C.night2, 0.5), beard: 'none', skin: C.skin3 }), `<g transform="translate(6 0)">${mask(c, { col: mix(C.sun, C.stone2, 0.4), r: 22, stick: false })}</g>`))),
      tears: [0, 1, 2].map(() => outer.add(`<g transform="translate(0 -1500)">${tearDrop(c, 6, '#dbe8ee')}</g>`)),
    }));
    const lampGlowOuter = outer.add(`<g transform="translate(0 -1500)"><ellipse rx="420" ry="200" fill="url(#halo-glow)" opacity=".35"/></g>`);

    return (t, time) => {
      const T = time;
      pose(H.gateDoor, { x: HOUSE.GATE - 36, y: F + 38, sx: 1 - es(t, 2.05, 2.2) * 0.8 });
      pose(H.ovenEl.querySelector('.glow'), { x: 0, y: 0, o: 0.3 });

      /* v48 — at the gate, the empty road: "my lord is delaying" */
      const drinkOn = es(t, 1.42, 1.5);
      const tossed = es(t, 0.7, 0.85);
      const toBeat = seg(t, 1.0, 1.2);
      const ex = t < 1 ? 1030 : lerp(1030, 690, ease.io(toBeat));
      const raise = es(t, 1.2, 1.3) * (1 - es(t, 1.36, 1.42));
      standEvil.set({ x: ex, y: F + 2, s: 0.96, flip: t > 0.6, o: 1 - drinkOn, walk: toBeat > 0 && toBeat < 1 ? ex * 0.07 : undefined, armB: raise * 160 + 10, armF: 20 + bump(t, 0.6, 0.85) * 70, head: t < 0.6 ? -4 : bump(t, 0.3, 0.6) * 6 - bump(t, 0.6, 0.9) * 8, blink: blinkAt(T, 4) });
      const th = es(t, 0.15, 0.35, ease.back) * (1 - es(t, 0.95, 1.1));
      pose(think, { x: 1036, y: F - 176, s: th, o: th > 0.01 ? 1 : 0 });
      pose(keysEl, { x: lerp(1000, 930, tossed), y: lerp(F - 90, F - 50, tossed) - Math.sin(tossed * PI) * 40, r: tossed * 300, o: es(t, 0.6, 0.65) });

      /* v49 — the fellow servant cowers; then the drinking */
      const cower = es(t, 1.15, 1.25);
      fellowUp.set({ x: 600, y: F, s: 0.92, o: 1 - cower, flip: false, armF: 20, blink: blinkAt(T, 7) });
      fellow.set({ x: 600, y: F, s: 0.92, o: cower, flip: false, armB: 150 * (1 - es(t, 1.6, 1.9) * 0.5), armF: 90, head: 14, lean: -8 });
      pose(puff, { x: 640, y: F - 150, s: bump(t, 1.3, 1.5) * 1.2, o: bump(t, 1.3, 1.5) });
      others.forEach((m, i) => m.p.set({ x: 470 - i * 70, y: F + i * 3, s: 0.9, flip: false, head: 8, armF: 20 + cower * 30, o: 1, blink: blinkAt(T, 8 + i) }));
      pose(tableEl, { x: 820, y: F + 10, o: 1 });
      pose(jars, { x: 950, y: F + 6, o: 1 });
      const lift = T ? Math.max(0, Math.sin(t * 6)) : 0.6;
      const freeze = es(t, 2.12, 2.2);
      drunk.forEach((d) => d.p.set({ x: [760, 900][d.i], y: F, s: 0.86, flip: d.i === 1, lean: (d.i ? -1 : 1) * 10 * (1 - freeze), armF: (60 + lift * 60) * (1 - freeze) + freeze * 30, armB: freeze * 100, head: (d.i ? 8 : -6) * (1 - freeze) - freeze * 8, eyes: 'closed', blink: 0.8 * (1 - freeze) }));
      sitEvil.set({ x: 820, y: F - 4, s: 0.94, flip: false, o: drinkOn * (1 - es(t, 3.05, 3.12)), lean: 12 * (1 - freeze), armF: (40 + lift * 80) * (1 - freeze) + freeze * 20, armB: freeze * 150, head: -freeze * 10 + 8 * (1 - freeze), blink: blinkAt(T, 4) });
      /* v50 — the master in the gate; the cup drops */
      const come = es(t, 2.05, 2.2);
      master.set({ x: 1060, y: F, s: 1, flip: true, o: come, armF: 70, armB: 20 + es(t, 2.2, 2.4) * 100, head: -2, blink: blinkAt(T, 3) });
      pose(mFlame, { x: 27, y: -12, sy: 1 + (T ? Math.sin(T * 7) * 0.1 : 0) });
      const cd = es(t, 2.2, 2.4, ease.in);
      pose(fallCup, { x: 856 + cd * 10, y: lerp(F - 110, F - 4, cd), r: cd * 110, o: freeze * (1 - es(t, 3.0, 3.1)) });

      /* v51a — darkness; the servant torn in two among the hypocrites */
      const dark = es(t, 3.0, 3.3);
      darkL.fade(dark * 0.9);
      const tear = es(t, 3.3, 3.75);
      const sink = es(t, 3.55, 3.95);
      const on = es(t, 3.05, 3.12);
      pose(halfL, { x: 820 - tear * 90, y: F - 4 + sink * 20, s: 1.05, r: -tear * 14, o: on * (1 - es(t, 4.1, 4.3) * 0.7) });
      pose(halfR, { x: 820 + tear * 90, y: F - 4 + sink * 20, s: 1.05, r: tear * 14, o: on * (1 - es(t, 4.1, 4.3) * 0.7) });
      pose(lampGlowOuter, { x: 800, y: 520, o: dark });
      /* v51b — weeping in the dark */
      const weep = es(t, 4.05, 4.3);
      HYP.forEach((h) => {
        const k = es(t, 3.3 + h.i * 0.08, 3.6 + h.i * 0.08);
        h.p.set({ x: h.x, y: F + 6, s: 0.86, flip: h.flip, o: k, head: 10 + weep * 14, armF: 30 + weep * 88, armB: 10 + weep * 20, lean: weep * 8 });
        h.tears.forEach((tr, j) => {
          const ph = T ? (T * 0.7 + j / 3 + h.i * 0.25) % 1 : (j + 0.5) / 3;
          pose(tr, { x: h.x + (h.flip ? -18 : 18) + (j - 1) * 8, y: F - 140 + ph * 90, s: 1, o: weep * (1 - ph * 0.8) });
        });
      });

      // phone: lean further right while the steward muses in the gate (0) and the master stands in it (2)
      S.cam.x = -es(t, 0.95, 1.25) * 30 * (1 - es(t, 1.9, 2.1)) + es(t, 0.0, 0.2) * (S.portrait ? 110 : 30) * (1 - es(t, 0.9, 1.1))
        + (S.portrait ? es(t, 1.95, 2.25) * 100 * (1 - es(t, 2.85, 3.1)) : 0);
      S.cam.z = 1 + es(t, 2.9, 3.3) * 0.04;
      S.cam.y = es(t, 3.9, 4.3) * 20;
    };
  },
};
