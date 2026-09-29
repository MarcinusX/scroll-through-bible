// Mt 17,2–8 — the Transfiguration, on the summit above a sea of clouds (Mark 9's summit). He is changed before
// them: His face shines like the sun (a paper sun opens behind His head) and His clothes become white as light;
// Moses and Elijah appear in pillars of light and talk with Him; Peter: "Lord, it is good for us to be here" —
// and three little tents pop up. While he is still speaking a bright cloud comes down over them all, a voice
// rings out of it (only words and rings of light — no figure); the three fall on their faces, trembling; Jesus
// comes down to them, touches them: "Get up, don't be afraid" — and when they look up, there is no one but Jesus.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, cloud } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { L9, JESUS_WHITE, tablets, fireWheel, tent, arcRings, bubble, thought, GLYPH, sparkle, withFace, faceBits, headAt, tr, HIGH, GLORY } from './lib.js';

const PI = Math.PI;
const P = 0.4;           // the summit's parallax
const TOP = 606;         // where Jesus stands
const SIDE = 628;        // Moses & Elijah
const LEDGE = 752;       // the three disciples, nearer to us
const TENTS = [[662, 0.72], [800, 0.78], [938, 0.72]];
const JS = 1.12;

export default {
  id: 'mt17-glory',
  beats: [
    { v: 2, text: 'Tam przemienił się wobec nich:' },
    { v: 2, cont: true, text: 'twarz Jego zajaśniała jak słońce, odzienie zaś stało się białe jak światło.' },
    { v: 3 },
    { v: 4, text: 'Wtedy Piotr rzekł do Jezusa: «Panie, dobrze, że tu jesteśmy;' },
    { v: 4, cont: true, text: 'jeśli chcesz, postawię tu trzy namioty: jeden dla Ciebie, jeden dla Mojżesza i jeden dla Eliasza».' },
    { v: 5, text: 'Gdy on jeszcze mówił, oto obłok świetlany osłonił ich,' },
    { v: 5, cont: true, text: 'a z obłoku odezwał się głos: «To jest mój Syn umiłowany, w którym mam upodobanie, Jego słuchajcie!»' },
    { v: 6 },
    { v: 7 },
    { v: 8 },
  ],
  cam: { x: [-70, 30], y: [-60, 40], z: [0.98, 1.1] },
  build(S) {
    const c = S.c;
    /* ---------- skies: high clear morning → golden glory (crossfaded on the compositor) ---------- */
    sky(S, HIGH, { name: 'day' });
    const gold = sky(S, GLORY, { name: 'gold' }).layer;

    // far below: a sea of clouds with distant peaks poking through
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(band(c, { y: 470, amps: [40, 16, 4], lens: [800, 260, 110], color: mix(C.hillFar, C.lavender, 0.35) }).markup);
    const sea = S.layer({ par: 0.12, sh: 3 });
    const seaFn = c.wave(520, [8, 4], [300, 120]);
    const bumps = [];
    for (let x = -900; x <= 2500; x += 60) bumps.push(...c.arc(x + 30, seaFn(x), 44, 22, PI, 2 * PI, 6));
    sea.add(sheet().p(c.cut([[-900, 1700], ...bumps, [2500, 1700]], 0.8, 10), '#f4efe4').out());

    /* ---------- glory behind Jesus ---------- */
    const glowL = S.layer({ par: P, sh: 1, flat: true });
    const glory = glowL.add(`<g><g opacity=".5">${rays(c, { n: 24, r0: 70, r1: 560, spread: 0.045, color: '#fff3cf' })}</g><circle r="330" fill="url(#halo-glow)"/></g>`);
    const flash = glowL.add(`<g><circle r="260" fill="url(#halo-glow)"/><circle r="150" fill="url(#halo-glow)"/></g>`);

    /* ---------- the summit ---------- */
    const ground = S.layer({ par: P, sh: 4 });
    const g = sheet();
    g.p(c.cut([[-900, 1700], [-900, 700], [200, 670], [420, 640], [560, 628], [700, 616], [900, 614], [1060, 628], [1220, 650], [1400, 680], [2500, 700], [2500, 1700]], 1.4, 12), mix(C.rock, C.hillNear, 0.35));
    g.p(c.cut([[690, 616], [712, 596], [760, 588], [850, 590], [900, 600], [916, 618]], 0.8, 8), C.rock2);
    g.p(c.cut([[-900, 740], [300, 700], [520, 690], [760, 700], [1100, 692], [1400, 710], [2500, 740], [2500, 1700], [-900, 1700]], 1.2, 12), mix(C.rock2, C.hillNear, 0.3));
    ground.add(g.out());
    ground.add(rock(c, 330, 690, 90, 34, C.rock) + rock(c, 1270, 680, 110, 40, C.rock2) + rock(c, 1150, 700, 50, 18));

    /* ---------- Moses and Elijah ---------- */
    const visL = S.layer({ par: P, sh: 4 });
    const pillar = (x) => visL.add(`<g opacity="0"><path d="${c.cut([[x - 60, SIDE + 6], [x - 30, -400], [x + 30, -400], [x + 60, SIDE + 6]], 0.5, 20)}" fill="#fff4d6" opacity=".55"/><ellipse cx="${x}" cy="${SIDE}" rx="90" ry="18" fill="url(#halo-glow)"/></g>`);
    const pilM = pillar(646), pilE = pillar(956);
    const wheel = visL.add(`<g opacity="0">${fireWheel(c, 34)}</g>`);
    const moses = S.puppet(visL.add(person(c, { ...L9.moses, holdF: `<g transform="translate(8 -4)">${tablets(c, { w: 18, h: 30 })}</g>` })));
    const elijah = S.puppet(visL.add(person(c, L9.elijah)));

    /* ---------- Jesus: the sun behind His face, then Jesus himself ---------- */
    const jL = S.layer({ par: P, sh: 5 });
    const [hx, hy] = headAt(800, TOP, JS, false);
    const sunFace = jL.add(`<g opacity="0"><circle r="150" fill="url(#halo-glow)"/>${rays(c, { n: 18, r0: 40, r1: 118, spread: 0.07, color: C.sun })}<path d="${c.cut(c.circ(0, 0, 50, 30), 0.4, 4)}" fill="${C.halo}"/><path d="${c.cut(c.circ(0, 0, 40, 26), 0.3, 4)}" fill="${mix(C.halo, C.star, 0.5)}"/></g>`);
    const jesus = S.puppet(jL.add(person(c, CAST.jesus)));
    const jWhite = S.puppet(jL.add(person(c, JESUS_WHITE)));
    const stars = Array.from({ length: 9 }, (_, i) => ({ i, a: -PI / 2 + (i - 4) * 0.36, r: 130 + (i % 2) * 50, el: jL.add(`<g opacity="0"><circle r="26" fill="url(#halo-glow)"/>${sparkle(c, 16 + (i % 3) * 5)}</g>`) }));

    /* ---------- the tents Peter would build ---------- */
    const tentL = S.layer({ par: 0.5, sh: 4 });
    const tents = TENTS.map(([x, s], i) => ({ x, s, i, el: tentL.add(`<g>${tent(c, { col: [C.wheatRobe, C.linen2, C.sand2][i], stripe: [C.terracotta, C.dustyBlue, C.clay][i] })}</g>`) }));

    /* ---------- the bright cloud comes down over the summit ---------- */
    const shadeL = S.layer({ par: 0, sh: 1, flat: true, rise: 0 });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#6b6a78"/>`);
    const cloudL = S.layer({ par: P + 0.02, sh: 7 });
    const bigCloud = hanging(cloudL, `<g><ellipse cx="0" cy="-40" rx="640" ry="230" fill="url(#halo-glow)"/><g transform="scale(1.35 1.1)">${cloud(c, 820, '#fdf8ea', '#efe3c4')}</g></g>`, { x: 800, y: 300, len: 1600 });
    const cloud2 = hanging(cloudL, cloud(c, 440, '#fbf5e6', '#eadcbd'), { x: 560, y: 640, len: 1600 });
    const cloud3 = hanging(cloudL, cloud(c, 420, '#fbf5e6', '#eadcbd'), { x: 1040, y: 646, len: 1600 });

    /* ---------- Jesus coming down to them (v7) is drawn in front of the cloud ---------- */
    const jNear = S.puppet(S.layer({ par: 0.6, sh: 5 }).add(person(c, CAST.jesus)));

    /* ---------- Peter, James and John ---------- */
    const dL = S.layer({ par: 0.6, sh: 5 });
    const DIS = [
      { k: 'james', o: CAST.james, x: 470, flip: false },
      { k: 'peter', o: CAST.peter, x: 566, flip: false },
      { k: 'john', o: CAST.john, x: 1122, flip: true },
    ].map((d, i) => ({
      ...d, i, seed: c.rr(0, 9),
      st: S.puppet(dL.add(withFace(person(c, d.o), faceBits(c)))),
      kn: S.puppet(dL.add(withFace(person(c, { ...d.o, pose: 'kneel' }), faceBits(c)))),
    }));
    DIS.forEach((d) => { d.sad = [d.st, d.kn].map((p) => p.el.querySelector('[data-part="sad"]')); });
    const peterSays = dL.add(`<g opacity="0">${bubble(c, [tr('Panie, dobrze,', 'Lord, it is good'), tr('że tu jesteśmy!', 'for us to be here!')], { size: 18, tail: 1 })}</g>`);
    const peterTents = dL.add(`<g opacity="0">${bubble(c, tr('Trzy namioty?', 'Three tents?'), { size: 20, tail: 1 })}</g>`);
    const jSays = dL.add(`<g opacity="0">${bubble(c, [tr('Wstańcie,', 'Get up,'), tr('nie lękajcie się!', 'don’t be afraid!')], { size: 20, tail: -1 })}</g>`);
    const touch = dL.add(`<g opacity="0"><circle r="46" fill="url(#halo-glow)"/></g>`);

    /* ---------- the voice out of the cloud ---------- */
    const voiceL = S.layer({ par: 0.3, sh: 5 });
    const rings = arcRings(voiceL, c, { n: 4, r: 70, w: 8, color: C.haloRim, a: PI / 2, span: 0.75 });
    const words = hanging(voiceL, `<g>${bubble(c, [tr('To jest mój Syn umiłowany,', 'This is my beloved Son,'), tr('w którym mam upodobanie,', 'in whom I am well pleased.'), tr('Jego słuchajcie!', 'Listen to him.')], { size: 21, tail: 0 })}</g>`, { x: 800, y: 250, len: 900 });

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(rock(c, 140, 960, 280, 110, C.rock2) + rock(c, 1470, 975, 240, 90, C.rock));

    return (t, time) => {
      const T = time;
      /* how much glory / cloud is there? */
      const shine = es(t, 0.1, 0.8) * (1 - es(t, 8.05, 8.6));
      const visit = es(t, 2.05, 2.6) * (1 - es(t, 5.3, 5.85));
      const cloudIn = es(t, 5.05, 5.7) * (1 - es(t, 8.0, 8.6));
      const voice = es(t, 6.05, 6.3) * (1 - es(t, 6.9, 7.1));
      gold.fade(shine * (1 - cloudIn * 0.35));
      shadeL.fade(cloudIn * 0.12);

      pose(flash, { x: 800, y: TOP - 110, s: 0.6 + bump(t, 0.2, 0.9) * 0.6 + bump(t, 1.05, 1.9) * 0.5, o: Math.max(bump(t, 0.2, 0.9), bump(t, 1.05, 1.9)) * 0.9 });
      pose(glory, { x: 800, y: TOP - 150, s: 0.5 + shine * 0.6 + bump(t, 0.2, 1.1) * 0.15, r: t * 5, o: shine * (1 - cloudIn * 0.3) });

      /* v2b: His face shines like the sun */
      const face = es(t, 1.05, 1.5, ease.back) * (1 - es(t, 8.05, 8.4));
      pose(sunFace, { x: hx, y: hy - 8, s: 0.4 + face * 0.75 + Math.sin(T * 1.4) * 0.02 * face, r: T * 6, o: Math.min(1, face * 1.3) });

      /* Jesus: transfigured (swap to the white cut-out) and back; at v7 he comes down to the three */
      const white = es(t, 0.25, 0.32) * (1 - es(t, 8.05, 8.12));
      const talk = visit * (Math.sin(T * 1.3) * 0.5 + 0.5);
      const down = es(t, 8.05, 8.12);              // swap to the near cut-out, which walks down to them
      const jp = { x: 800, y: TOP, s: JS, armF: 20 + shine * 20 + talk * 18 * (t > 2.3 && t < 5 ? 1 : 0), armB: 12 + shine * 30, head: -2, blink: blinkAt(T, 1) };
      jesus.set({ ...jp, o: (1 - white) * (1 - down) });
      jWhite.set({ ...jp, o: white, flip: t > 2.5 && t < 5.2 && Math.sin(T * 0.5) > 0.3 });
      const walk = es(t, 8.12, 8.6);
      const back = es(t, 9.1, 9.5);
      const nx = lerp(lerp(800, 666, walk), 800, back), ny = lerp(lerp(TOP, LEDGE - 4, walk), 700, back);
      const reach = es(t, 8.55, 8.75) * (1 - es(t, 9.05, 9.2));
      jNear.set({ x: nx, y: ny, s: lerp(JS, 1.08, walk), o: down, flip: t < 9.1, walk: (walk > 0 && walk < 1) || (back > 0 && back < 1) ? nx * 0.05 : undefined, armF: 14 + reach * 64 + es(t, 9.5, 9.8) * 26, armB: 10 + reach * 30 + es(t, 9.5, 9.8) * 30, head: -2 + reach * 10, lean: reach * 8, blink: blinkAt(T, 1) });
      pose(touch, { x: 606, y: LEDGE - 96, s: 0.6 + reach * 0.6, o: reach * 0.9 });
      pose(jSays, { x: 720, y: LEDGE - 262, s: es(t, 8.6, 8.8, ease.back), o: bump(t, 8.55, 9.05) > 0.05 ? 1 : 0 });

      stars.forEach((st) => {
        const on = bump(t, 1.02 + st.i * 0.05, 1.9 + st.i * 0.01) * shine;
        const k = ((T * 0.25 + st.i / 7) % 1);
        pose(st.el, { x: 800 + Math.cos(st.a) * st.r * (0.9 + k * 0.2), y: TOP - 100 + Math.sin(st.a) * st.r * 0.9, s: 0.6 + Math.sin(k * PI) * 0.6, r: T * 20 + st.i * 30, o: on });
      });

      /* v3: Moses (left) and Elijah (right) appear in pillars of light and talk with him */
      const mIn = es(t, 2.05, 2.5), eIn = es(t, 2.2, 2.65);
      const gone = es(t, 5.3, 5.85);
      pose(pilM, { o: bump(t, 2.0, 2.9) });
      pose(pilE, { o: bump(t, 2.15, 3.05) });
      const mo = mIn * (1 - gone), eo = eIn * (1 - gone);
      moses.set({ x: 646, y: SIDE - (1 - mIn) * 30, s: 1.02, o: mo, armF: 30 + Math.sin(T * 1.1) * 8 * mo, armB: 10 + talk * 30 * (Math.sin(T * 1.7) > 0 ? 1 : 0.3), head: -3, blink: blinkAt(T, 3) });
      elijah.set({ x: 956, y: SIDE - (1 - eIn) * 30, s: 1.02, flip: true, o: eo, armF: 20 + talk * 50 * (Math.sin(T * 1.3 + 2) > 0 ? 1 : 0.4), armB: 20, head: -3, blink: blinkAt(T, 5) });
      pose(wheel, { x: 1014, y: SIDE - 30, s: 0.9, r: T * 30, o: bump(t, 2.15, 3.3) * 0.9 * (1 - gone) });

      /* v4b: the tents pop up, and fold away when the cloud comes */
      tents.forEach((tn) => {
        const up = es(t, 4.1 + tn.i * 0.18, 4.4 + tn.i * 0.18, ease.back) * (1 - es(t, 5.4 + tn.i * 0.05, 5.75 + tn.i * 0.05));
        pose(tn.el, { x: tn.x, y: 722, s: tn.s, sy: Math.max(0.001, up), o: up > 0.01 ? 1 : 0 });
      });

      /* v5: the bright cloud comes down over the summit (and lifts at v8); the voice */
      swing(bigCloud, 800, lerp(-1000, 330, cloudIn), T, 0.6, 0.4);
      swing(cloud2, 560 - (1 - cloudIn) * 200, lerp(-1000, 640, cloudIn), T, 0.8, 0.5, 1);
      swing(cloud3, 1040 + (1 - cloudIn) * 200, lerp(-1000, 646, cloudIn), T, 0.8, 0.5, 2);
      rings(800, 262, voice, T, { spread: 1.8, speed: 0.4, s0: 0.8 });
      swing(words, 800, lerp(-1000, 292, es(t, 6.1, 6.45, ease.back)) - es(t, 6.92, 7.2) * 1300, T, 0.8, 0.7, 3);

      /* the three */
      const fall = es(t, 7.05, 7.4) * (1 - es(t, 8.62, 8.95));
      const fear = es(t, 7.1, 7.5) * (1 - es(t, 8.6, 9));
      const lookUp = es(t, 9.05, 9.35);
      const lookAround = bump(t, 9.2, 9.75);
      DIS.forEach((d) => {
        const isP = d.k === 'peter';
        const k0 = isP ? 5.88 : 5.3;
        const kneel = es(t, 0.36, 0.42) * (1 - es(t, 3.05, 3.1)) + es(t, k0, k0 + 0.06) * (1 - es(t, 9.55, 9.62));
        const speak = isP ? es(t, 3.05, 3.3) * (1 - es(t, 5.8, 5.95)) : 0;
        const shield = es(t, 0.35, 0.8) * (1 - es(t, 2.2, 2.7)) * (1 - speak);
        const shake = fear * Math.sin(T * 22 + d.seed) * 0.8;
        const turn = lookAround > 0.5 ? (Math.sin(T * 2.4 + d.seed) > 0 ? !d.flip : d.flip) : d.flip;
        const pointTent = isP ? bump(t, 4.05, 4.95) : 0;
        const touched = d.k !== 'john' ? es(t, 8.6, 8.95) : es(t, 8.75, 9.05);
        d.st.set({ x: d.x, y: LEDGE, s: 1.06, flip: turn, o: 1 - kneel, armF: 20 + speak * 50 + pointTent * 40 + Math.sin(T * 3) * 6 * speak, armB: 10 + speak * 40 + shield * 150, head: -6 - shield * 6, blink: blinkAt(T, d.seed) });
        d.kn.set({ x: d.x + shake, y: LEDGE, s: 1.06, flip: turn, o: kneel, armF: 30 + fall * 70 + shield * 20, armB: 150 * shield + fall * 80 + lookUp * 20, head: -10 - shield * 4 + fall * 22 - lookUp * 6, lean: fall * 44 * (1 - touched * 0.7) + fear * 2, blink: blinkAt(T, d.seed) });
        d.sad.forEach((el) => pose(el, { o: fear }));
      });
      const pX = 566;
      pose(peterSays, { x: pX - 26, y: LEDGE - 236, s: es(t, 3.1, 3.3, ease.back), o: t > 3.05 && t < 3.97 ? 1 : 0 });
      pose(peterTents, { x: pX - 22, y: LEDGE - 236, s: es(t, 4.05, 4.25, ease.back), o: t > 4.02 && t < 5.95 ? 1 - es(t, 5.82, 5.95) : 0 });

      /* camera */
      S.cam.z = 1 + es(t, 0.1, 0.9) * 0.08 - es(t, 1.9, 2.5) * 0.1 + es(t, 6, 6.5) * 0.03 + es(t, 7.9, 8.5) * 0.06 - es(t, 9.05, 9.5) * 0.06;
      S.cam.y = -es(t, 0.1, 0.9) * 40 + es(t, 1.9, 2.5) * 50 - es(t, 5, 5.8) * 30 + es(t, 6.9, 7.4) * 40 + es(t, 7.9, 8.5) * 10 - es(t, 9.05, 9.5) * 30;
      S.cam.x = -es(t, 7.9, 8.5) * 60 * (1 - es(t, 9.05, 9.5));
    };
  },
};
