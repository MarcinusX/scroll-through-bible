// Mt 7,21–23 — "that day": a golden sky and the great gate of the kingdom, with Jesus standing before it. Three
// richly dressed men stride up calling "Lord, Lord!", but the gate stays shut. Light pours down from heaven, and a
// woman with a jug and a loaf and a man with a bundle of clothes — who did the Father's will — come, the doors open
// and they step into the light. The three hold up their works: a prophecy scroll, a little demon chased off, a burst
// of wonders — "in your name!". "I never knew you": Jesus lifts his hand, the doors close, their trophies fall grey.
// "Depart from me": they turn and walk away into the gathering dusk.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud, grass } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { THATDAY, womanOf, manOf, boaster, handAt, headAt, kingdomGate, gateDoor, say, smallScroll, spirit, sparkle, rayBurst, glowDisc, heapBasket, breadLoaf, hydria, bigBundle, tr, kf, PI } from './lib.js';

const JX = 800, GY = 738;
const GW = 240, GH = 330;                // the gate's opening

export default {
  id: 'mt7-lord',
  beats: [
    { v: 21, text: 'Nie każdy, który Mi mówi: "Panie, Panie!", wejdzie do królestwa niebieskiego,' },
    { v: 21, cont: true, text: 'lecz ten, kto spełnia wolę mojego Ojca, który jest w niebie.' },
    { v: 22 },
    { v: 23, text: 'Wtedy oświadczę im: "Nigdy was nie znałem.' },
    { v: 23, cont: true, text: 'Odejdźcie ode Mnie wy, którzy dopuszczacie się nieprawości!"' },
  ],
  cam: { x: [-80, 20], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, THATDAY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const cls = [[420, 170, 220], [1180, 150, 200], [800, 90, 160]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w, '#fbf1dc', '#efdcb8'), { x, y, len: 800 }) }));
    // the rays of heaven over the gate
    const raysL = S.layer({ par: 0.08, sh: 1, flat: true, rise: 0 });
    raysL.add(`<g transform="translate(800 -60)">${rayBurst(c, { n: 24, r0: 30, r1: 1200, spread: 0.035, color: '#fff6d8', o: 0.8 })}</g><circle cx="800" cy="120" r="420" fill="url(#halo-glow)"/>`);
    // dusk gathering on the left (v23b)
    const did = S.id('dusk');
    S.defs(`<linearGradient id="${did}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2c2748" stop-opacity=".95"/><stop offset=".55" stop-color="#3f3658" stop-opacity=".78"/><stop offset=".78" stop-color="#5a4d6e" stop-opacity=".4"/><stop offset="1" stop-color="#6a5a7a" stop-opacity="0"/></linearGradient>`);

    /* the golden plain and the steps up to the gate */
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(610, [6, 3], [800, 240]), -900, 2500, 1700, 12, 1), mix(C.wheat, C.cream, 0.45)).out());
    ground.add(grass(c, { x0: -600, x1: 2200, y: 612, n: 30, h: 10, color: mix(C.olive, C.wheat, 0.4) }));
    const near = S.layer({ par: 0.4, sh: 3 });
    const st = sheet();
    st.p(c.ridge(c.wave(GY - 10, [2, 1], [600, 180]), -900, 2500, 1700, 12, 1), mix(C.sand, C.cream, 0.5));
    st.p(c.cut([[JX - 230, GY - 8], [JX + 230, GY - 8], [JX + 250, GY + 8], [JX - 250, GY + 8]], 0.4, 8), mix(C.stone, C.cream, 0.35));
    st.p(c.cut([[JX - 260, GY + 8], [JX + 260, GY + 8], [JX + 280, GY + 26], [JX - 280, GY + 26]], 0.4, 8), mix(C.stone2, C.cream, 0.3));
    near.add(st.out());

    /* the gate: light inside, two doors, the golden frame */
    const G = S.layer({ par: 0.44, sh: 5 });
    const KG = kingdomGate(c, GW, GH);
    const light = G.add(`<g transform="translate(${JX} ${GY - 8})"><circle cy="${-GH * 0.5}" r="${GH * 0.9}" fill="url(#halo-glow)"/>${KG.light}</g>`);
    const doorL = G.add(`<g>${gateDoor(c, GW / 2, GH - 50)}</g>`);
    const doorR = G.add(`<g>${gateDoor(c, GW / 2, GH - 50)}</g>`);
    const doers = S.layer({ par: 0.44, sh: 4 });
    const WO = womanOf(c, { robe: C.sageRobe, mantle: C.wheatRobe, veil: C.linen2 });
    const MO = manOf(c, { robe: C.stone2, mantle: null, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin4, belt: C.rope });
    const dW = S.puppet(doers.add(person(c, { ...WO, holdF: `<g transform="translate(0 18)">${heapBasket(c, 34, { fill: false })}<g transform="translate(0 -18)">${breadLoaf(c, 12)}</g></g>`, holdB: `<g transform="translate(-2 10) scale(.6)">${hydria(c)}</g>` })));
    const dM = S.puppet(doers.add(person(c, { ...MO, holdF: `<g transform="translate(-4 -6) scale(.7)">${bigBundle(c, C.dustyBlue)}</g>` })));
    const G2 = S.layer({ par: 0.44, sh: 5 });
    G2.add(`<g transform="translate(${JX} ${GY - 8})">${KG.frame}</g>`);

    /* Jesus and the three who boast */
    const act = S.layer({ par: 0.5, sh: 5 });
    const BO = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, boaster(i)))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const toks = [act.add(`<g>${smallScroll(c)}</g>`), act.add(`<g>${spirit(c, 1.2, '#3a3148')}</g>`), act.add(`<g><circle r="40" fill="url(#halo-glow)"/>${sparkle(c, 16, C.star)}<g transform="translate(-20 14) scale(.6)">${sparkle(c, 16, C.halo)}</g></g>`)];

    const fx = S.layer({ par: 0.55, sh: 6 });
    const cries = BO.map((b) => fx.add(`<g>${say(c, tr('Panie, Panie!', 'Lord, Lord!'), { size: 17, side: 1 })}</g>`));
    const inName = fx.add(`<g>${say(c, tr('w Twoje imię!', 'in your name!'), { size: 18, side: 1 })}</g>`);
    const duskL = S.layer({ par: 0.5, sh: 1, flat: true, rise: 0 });
    duskL.add(`<rect x="-900" y="-2000" width="1950" height="4000" fill="url(#${did})"/>`);

    return (t, time) => {
      const T = time;
      cls.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1, 0.6, cl.i));
      const heaven = es(t, 1.05, 1.35) * (1 - es(t, 3.05, 3.4) * 0.5);
      raysL.fade(0.25 + heaven * 0.75);

      /* the doors: open for the doers (v21b), shut again (v23a) */
      const open = es(t, 1.3, 1.5) * (1 - es(t, 3.12, 3.34));
      pose(doorL, { x: JX - GW / 2, y: GY - 8, sx: 1 - open * 0.86 });
      pose(doorR, { x: JX + GW / 2, y: GY - 8, sx: -(1 - open * 0.86) });
      pose(light, { x: 0, y: 0, o: 0.3 + open * 0.7 });

      /* v21b — the doers come and go in */
      const come = es(t, 1.04, 1.36);
      const inK = es(t, 1.4, 1.7);
      const gone = es(t, 3.02, 3.14);
      const wx = lerp(lerp(1240, 1010, come), JX + 96, inK), mx = lerp(lerp(1380, 1130, come), JX + 58, inK);
      const walkD = (come > 0 && come < 1) || (inK > 0 && inK < 1);
      dW.set({ x: wx, y: lerp(GY + 20, GY - 10, inK), s: lerp(1.08, 0.96, inK), flip: true, walk: walkD ? wx * 0.06 : undefined, armF: 40, armB: 30, o: seg(t, 1.02, 1.06) * (1 - gone), blink: blinkAt(T, 4) });
      dM.set({ x: mx, y: lerp(GY + 24, GY - 10, inK), s: lerp(1.08, 0.96, inK), flip: true, walk: walkD ? mx * 0.06 : undefined, armF: 50, armB: 20, o: seg(t, 1.02, 1.06) * (1 - gone), blink: blinkAt(T, 6) });

      /* the boasters: come calling (v21a), hold up their works (v22), are sent away (v23) */
      const arrive = es(t, 0.02, 0.3);
      const away = es(t, 4.06, 5.0, (u) => u);
      const raise = es(t, 2.05, 2.28) * (1 - es(t, 3.3, 3.5));
      const call = es(t, 0.25, 0.4) * (1 - es(t, 1.0, 1.12)) + es(t, 2.05, 2.2) * (1 - es(t, 3.0, 3.1));
      BO.forEach((b) => {
        const home = S.portrait ? 494 + b.i * 86 : 450 + b.i * 92;     // phone: the first one is not sliced by the edge
        const x = lerp(home - 360, home, arrive) - away * (150 + b.i * 20);
        const y = GY + 6 + (b.i % 2) * 10 - away * 80;
        const s = 1.06 - away * 0.36;
        const walking = (arrive > 0 && arrive < 1) || away > 0;
        b.p.set({ x, y, s, flip: away > 0, walk: walking ? x * 0.06 : undefined, armF: 30 + call * 60 * (1 - raise) + raise * 70, armB: 10 + raise * 150 + call * 30, head: -call * 8 - raise * 6 + es(t, 3.3, 3.6) * 12, lean: es(t, 3.3, 3.6) * 4, blink: blinkAt(T, b.seed) });
        const [hx, hy] = headAt(x, y, s, away > 0);
        const ck = es(t, 0.3 + b.i * 0.05, 0.42 + b.i * 0.05, ease.back) * (1 - es(t, 0.95, 1.05));
        pose(cries[b.i], { x: hx + 10, y: hy - 18 - (b.i % 2) * 44, s: ck, o: ck > 0.01 ? 1 : 0 });
        // their trophies, in the raised back hand
        const [tx, ty] = handAt(x, y, s, away > 0, 10 + raise * 150, 0, 0, true);
        const fallK = es(t, 3.3, 3.6, ease.in);
        const tk = es(t, 2.1 + b.i * 0.06, 2.3 + b.i * 0.06, ease.back);
        const fleeing = b.i === 1 ? es(t, 2.3, 2.7) : 0;
        pose(toks[b.i], {
          x: tx + fleeing * 70 + (b.i === 1 ? Math.sin(T * 4) * 3 : 0), y: lerp(ty - 10, GY - 10, fallK) - fleeing * 60,
          s: tk * 1.45 * (b.i === 2 ? 1 + Math.sin(T * 3) * 0.08 : 1), r: fallK * 60 + (b.i === 2 ? T * 30 : 0), o: tk * (1 - fallK * 0.6) * (1 - es(t, 3.9, 4.1)),
        });
      });
      const nk = es(t, 2.2, 2.36, ease.back) * (1 - es(t, 2.95, 3.05));
      const [nx, ny] = headAt(S.portrait ? 580 : 542, GY + 16, 1.06, false);
      pose(inName, { x: nx + 26, y: ny - 34, s: nk, o: nk > 0.01 ? 1 : 0 });

      /* Jesus: welcomes the doers, turns to the boasters and lifts his hand */
      const welcome = es(t, 1.3, 1.5) * (1 - es(t, 2.0, 2.15));
      const refuse = es(t, 3.05, 3.2) * (1 - es(t, 4.9, 5.0) * 0.3);
      const send = es(t, 4.05, 4.25);
      const step = es(t, 1.3, 1.5) * (1 - es(t, 2.9, 3.1));
      jesus.set({ x: JX - step * 50, y: GY - 2, s: 1.14, flip: t > 2.02, armF: 20 + welcome * 60 + refuse * 80 - send * 10, armB: 10 + welcome * 60 + refuse * 20 + send * 40, head: refuse * 4, blink: blinkAt(T, 1) });

      /* v23b — dusk on their side */
      duskL.fade(es(t, 4.05, 4.45));

      S.cam.x = kf(t, [[0, -40], [0.9, -40], [1.2, 10], [1.9, 10], [2.1, -40], [3.9, -30], [4.3, -70]]);
      S.cam.z = kf(t, [[0, 1.08], [4.0, 1.08], [4.4, 1.02]]);
      S.cam.y = 30;
    };
  },
};
