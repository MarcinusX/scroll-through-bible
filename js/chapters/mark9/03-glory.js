// Mk 9,2b–8 — the Transfiguration. On the summit, above a sea of clouds, Jesus shines: his clothes
// turn whiter than any fuller could bleach them; Elijah and Moses appear, talking with him; Peter
// offers three tents (they pop up), not knowing what to say; a bright cloud comes down over them and
// a voice rings out of it — and when it lifts, they see no one but Jesus.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, cloud } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LOOK, JESUS_WHITE, tablets, fireWheel, tent, fullerPlate, arcRings, bubble, thought, GLYPH, sparkle, withFace, faceBits, strip } from './lib.js';

const PI = Math.PI;
const P = 0.4;           // the summit's parallax
const TOP = 606;         // where Jesus stands
const SIDE = 628;        // Moses & Elijah
const LEDGE = 752;       // the three disciples, nearer to us
const TENTS = [[600, 0.78], [800, 0.84], [1000, 0.78]];
const TENTS_P = [[685, 0.78], [800, 0.84], [915, 0.78]];   // phone: the three tents clear of the kneeling disciples

export default {
  id: 'm9-glory',
  beats: [
    { v: 2, cont: true, text: 'Tam przemienił się wobec nich.' },
    { v: 3 },
    { v: 4 },
    { v: 5, text: 'Wtedy Piotr rzekł do Jezusa: «Rabbi, dobrze, że tu jesteśmy;' },
    { v: 5, cont: true, text: 'postawimy trzy namioty: jeden dla Ciebie, jeden dla Mojżesza i jeden dla Eliasza».' },
    { v: 6 },
    { v: 7, text: 'I zjawił się obłok, osłaniający ich,' },
    { v: 7, cont: true, text: 'a z obłoku odezwał się głos: «To jest mój Syn umiłowany, Jego słuchajcie!».' },
    { v: 8 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [0.98, 1.1] },
  build(S) {
    const c = S.c;
    /* ---------- skies: high clear morning → golden glory (crossfaded on the compositor) ---------- */
    sky(S, ['#b9d3d8', '#dfe7de', '#f1e8d6'], { name: 'day' });
    const gold = sky(S, ['#e9d9b0', '#f8ebc6', '#fff4da'], { name: 'gold' }).layer;

    // far below: a sea of clouds with distant peaks poking through
    const far = S.layer({ par: 0.06, sh: 2 });
    far.add(band(c, { y: 470, amps: [40, 16, 4], lens: [800, 260, 110], color: mix(C.hillFar, C.lavender, 0.35) }).markup);
    const sea = S.layer({ par: 0.12, sh: 3 });
    const seaFn = c.wave(520, [8, 4], [300, 120]);
    const bumps = [];
    for (let x = -900; x <= 2500; x += 60) bumps.push(...c.arc(x + 30, seaFn(x), 44, 22, PI, 2 * PI, 6));
    sea.add(sheet().p(c.cut([[-900, 1700], ...bumps, [2500, 1700]], 0.8, 10), '#f4efe4').out());

    // the fuller's plate (v3) and, later, the words of the voice hang from the flies
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const FX = S.portrait ? 985 : 1130;   // phone: the fuller's plate inside the screen
    const fuller = hanging(hangL, `<g>${fullerPlate(c, 70)}</g><g transform="translate(0 102)">${strip(c, tr('żaden folusznik…', 'no launderer…'), { size: 17 })}</g>`, { x: FX, y: 240, len: 800 });

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
    const MX = S.portrait ? 645 : 590, EX = S.portrait ? 960 : 1010;   // phone: Moses and Elijah a step closer to him
    const pillar = (x) => visL.add(`<g opacity="0"><path d="${c.cut([[x - 60, SIDE + 6], [x - 30, -400], [x + 30, -400], [x + 60, SIDE + 6]], 0.5, 20)}" fill="#fff4d6" opacity=".55"/><ellipse cx="${x}" cy="${SIDE}" rx="90" ry="18" fill="url(#halo-glow)"/></g>`);
    const pilM = pillar(MX), pilE = pillar(EX);
    const wheel = visL.add(`<g opacity="0">${fireWheel(c, 34)}</g>`);
    const moses = S.puppet(visL.add(person(c, { ...LOOK.moses, holdF: `<g transform="translate(8 -4)">${tablets(c, { w: 18, h: 30 })}</g>` })));
    const elijah = S.puppet(visL.add(person(c, LOOK.elijah)));

    /* ---------- the bright cloud comes down over the summit ---------- */
    const shadeL = S.layer({ par: 0, sh: 1, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#6b6a78"/>`);
    const cloudL = S.layer({ par: P + 0.02, sh: 7 });
    const bigCloud = hanging(cloudL, `<g><ellipse cx="0" cy="-40" rx="620" ry="210" fill="url(#halo-glow)" opacity=".8"/><g transform="scale(1.35 1.1)">${cloud(c, 820, '#faf6ec', '#e9e1d0')}</g></g>`, { x: 800, y: 300, len: 1600 });
    const cloud2 = hanging(cloudL, cloud(c, 440, '#f8f3e7', '#e4dac8'), { x: 560, y: 640, len: 1600 });
    const cloud3 = hanging(cloudL, cloud(c, 420, '#f8f3e7', '#e4dac8'), { x: 1040, y: 646, len: 1600 });

    /* ---------- Jesus ---------- */
    const jL = S.layer({ par: P, sh: 5 });
    const jesus = S.puppet(jL.add(person(c, CAST.jesus)));
    const jWhite = S.puppet(jL.add(person(c, JESUS_WHITE)));
    const stars = Array.from({ length: 9 }, (_, i) => ({ i, a: -PI / 2 + (i - 4) * 0.36, r: 130 + (i % 2) * 50, el: jL.add(`<g opacity="0"><circle r="26" fill="url(#halo-glow)"/>${sparkle(c, 16 + (i % 3) * 5)}</g>`) }));

    /* ---------- the tents Peter would build ---------- */
    const tentL = S.layer({ par: 0.5, sh: 4 });
    const tents = (S.portrait ? TENTS_P : TENTS).map(([x, s], i) => ({ x, s, i, el: tentL.add(`<g>${tent(c, { col: [C.wheatRobe, C.linen2, C.sand2][i], stripe: [C.terracotta, C.dustyBlue, C.clay][i] })}</g>`) }));

    /* ---------- Peter, James and John ---------- */
    const dL = S.layer({ par: 0.6, sh: 5 });
    const PH = S.portrait;   // phone: the three witnesses drawn in from the edges of the screen
    const DIS = [
      { k: 'james', o: CAST.james, x: PH ? 532 : 390, flip: false },
      { k: 'peter', o: CAST.peter, x: PH ? 594 : 488, flip: false },
      { k: 'john', o: CAST.john, x: PH ? 1035 : 1128, flip: true },
    ].map((d, i) => ({
      ...d, i, seed: c.rr(0, 9),
      st: S.puppet(dL.add(withFace(person(c, d.o), faceBits(c)))),
      kn: S.puppet(dL.add(withFace(person(c, { ...d.o, pose: 'kneel' }), faceBits(c)))),
    }));
    DIS.forEach((d) => { d.sad = [d.st, d.kn].map((p) => p.el.querySelector('[data-part="sad"]')); });
    const peterSays = dL.add(`<g opacity="0">${bubble(c, tr('Rabbi!', 'Rabbi!'), { size: 22, tail: -1 })}</g>`);
    const peterQ = dL.add(`<g opacity="0">${thought(c, GLYPH.q(c), { w: 58, h: 46 })}</g>`);

    /* ---------- the voice out of the cloud ---------- */
    const voiceL = S.layer({ par: 0.3, sh: 5 });
    const rings = arcRings(voiceL, c, { n: 4, r: 70, w: 8, color: C.haloRim, a: PI / 2, span: 0.75 });
    const words = hanging(voiceL, `<g>${bubble(c, [tr('To jest mój Syn umiłowany,', 'This is my beloved Son.'), tr('Jego słuchajcie!', 'Listen to him.')], { size: 22, tail: 0 })}</g>`, { x: 800, y: 250, len: 900 });

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(rock(c, 140, 960, 280, 110, C.rock2) + rock(c, 1470, 975, 240, 90, C.rock));

    return (t, time) => {
      const T = time;
      /* how much glory / cloud is there? */
      const shine = es(t, 0.15, 0.8) * (1 - es(t, 8.05, 8.6));
      const visit = es(t, 2.05, 2.6) * (1 - es(t, 6.35, 6.9));
      const cloudIn = es(t, 6.02, 6.7) * (1 - es(t, 8.02, 8.55));
      const voice = es(t, 7.05, 7.3) * (1 - es(t, 7.85, 8.05));
      gold.fade(shine * (1 - cloudIn * 0.5));
      shadeL.fade(cloudIn * 0.18);

      pose(flash, { x: 800, y: TOP - 110, s: 0.6 + bump(t, 0.25, 0.9) * 0.6 + bump(t, 1.05, 1.9) * 0.5, o: Math.max(bump(t, 0.25, 0.9), bump(t, 1.05, 1.9)) * 0.9 });
      pose(glory, { x: 800, y: TOP - 150, s: 0.5 + shine * 0.6 + bump(t, 0.2, 1.1) * 0.15, r: t * 5, o: shine * (1 - cloudIn * 0.35) });
      // v3: the fuller's plate comes down beside him, then flies away
      const fl = es(t, 1.05, 1.4, ease.back) * (1 - es(t, 1.95, 2.3));
      swing(fuller, FX, lerp(-1000, 240, fl), T, 1.2, 0.8, 1);

      /* Jesus: transfigured (swap to the white cut-out) and back */
      const white = es(t, 0.3, 0.37) * (1 - es(t, 8.2, 8.27));
      const talk = visit * (Math.sin(T * 1.3) * 0.5 + 0.5);
      const jp = { x: 800, y: TOP, s: 1.12, armF: 20 + shine * 20 + talk * 18 * (t > 2.3 && t < 5 ? 1 : 0) + es(t, 8.4, 8.9) * 30, armB: 12 + shine * 30, head: -2 + Math.sin(T * 0.6) * 1.5, blink: blinkAt(T, 1) };
      jesus.set({ ...jp, o: 1 - white });
      jWhite.set({ ...jp, o: white, flip: t > 2.5 && t < 6 && Math.sin(T * 0.5) > 0.3 });
      stars.forEach((st) => {
        const on = bump(t, 1.02 + st.i * 0.05, 1.85 + st.i * 0.03) * shine;
        const k = ((T * 0.25 + st.i / 7) % 1);
        pose(st.el, { x: 800 + Math.cos(st.a) * st.r * (0.9 + k * 0.2), y: TOP - 100 + Math.sin(st.a) * st.r * 0.9, s: 0.6 + Math.sin(k * PI) * 0.6, r: T * 20 + st.i * 30, o: on });
      });

      /* Moses (left) and Elijah (right) appear in pillars of light and talk with him */
      const mIn = es(t, 2.05, 2.5), eIn = es(t, 2.2, 2.65);
      const gone = es(t, 6.3, 6.85);
      pose(pilM, { o: bump(t, 2.0, 2.9) });
      pose(pilE, { o: bump(t, 2.15, 3.05) });
      const mo = mIn * (1 - gone), eo = eIn * (1 - gone);
      moses.set({ x: MX, y: SIDE - (1 - mIn) * 30, s: 1.02, o: mo, armF: 30 + Math.sin(T * 1.1) * 8 * mo, armB: 10 + talk * 30 * (Math.sin(T * 1.7) > 0 ? 1 : 0.3), head: -3 + Math.sin(T * 0.8) * 2, blink: blinkAt(T, 3) });
      elijah.set({ x: EX, y: SIDE - (1 - eIn) * 30, s: 1.02, flip: true, o: eo, armF: 20 + talk * 50 * (Math.sin(T * 1.3 + 2) > 0 ? 1 : 0.4), armB: 20, head: -3 + Math.sin(T * 0.9 + 1) * 2, blink: blinkAt(T, 5) });
      pose(wheel, { x: EX + 58, y: SIDE - (S.portrait ? 120 : 30), s: 0.9, r: T * 30, o: bump(t, 2.15, 3.3) * 0.9 * (1 - gone) });

      /* the tents pop up (v5b) and fold away when the cloud comes */
      tents.forEach((tn) => {
        const up = es(t, 4.1 + tn.i * 0.18, 4.4 + tn.i * 0.18, ease.back) * (1 - es(t, 6.4 + tn.i * 0.05, 6.75 + tn.i * 0.05));
        pose(tn.el, { x: tn.x, y: 722, s: tn.s, sy: tn.s * Math.max(0.001, up), o: up > 0.01 ? 1 : 0 });
      });

      /* the cloud comes down over the summit and lifts again */
      swing(bigCloud, 800, lerp(-1000, 330, cloudIn), T, 0.6, 0.4);
      swing(cloud2, 560 - (1 - cloudIn) * 200, lerp(-1000, 640, cloudIn), T, 0.8, 0.5, 1);
      swing(cloud3, 1040 + (1 - cloudIn) * 200, lerp(-1000, 646, cloudIn), T, 0.8, 0.5, 2);
      rings(800, 250, voice, T, { spread: 1.8, speed: 0.4, s0: 0.8 });
      swing(words, 800, lerp(-1000, 214, es(t, 7.1, 7.45, ease.back)) - es(t, 7.9, 8.2) * 1300, T, 0.8, 0.7, 3);

      /* the three */
      const kneel = es(t, 0.42, 0.48) * (1 - es(t, 3.05, 3.1)) + es(t, 5.02, 5.08) * (1 - es(t, 8.55, 8.62));
      const fear = es(t, 5.1, 5.5) * (1 - es(t, 8.4, 8.8));
      const bow = es(t, 7.05, 7.4) * (1 - es(t, 8.1, 8.5));
      const lookAround = es(t, 8.2, 8.5) * (1 - es(t, 8.75, 8.95));
      DIS.forEach((d) => {
        const isP = d.k === 'peter';
        const speak = isP ? es(t, 3.05, 3.3) * (1 - es(t, 4.85, 5.05)) : 0;
        const shield = es(t, 0.4, 0.8) * (1 - es(t, 1.5, 2)) * (1 - speak);
        const shake = fear * Math.sin(T * 22 + d.seed) * 0.8;
        const turn = lookAround > 0.5 ? (Math.sin(T * 2.4 + d.seed) > 0 ? !d.flip : d.flip) : d.flip;
        const pointTent = isP ? bump(t, 4.05, 4.95) : 0;
        const x = d.x;
        d.st.set({ x, y: LEDGE, s: 1.06, flip: turn, o: 1 - kneel, armF: 20 + speak * 50 + pointTent * 40 + Math.sin(T * 3) * 6 * speak, armB: 10 + speak * 40 + shield * 150, head: -6 - shield * 6 + lookAround * 6, blink: blinkAt(T, d.seed) });
        d.kn.set({ x: x + shake, y: LEDGE, s: 1.06, flip: turn, o: kneel, armF: 30 + bow * 60 + shield * 20, armB: 150 * shield + 40 * fear * (1 - bow) + bow * 70, head: -10 - shield * 4 + bow * 16 + lookAround * 10, lean: bow * 22 + fear * 3, blink: blinkAt(T, d.seed) });
        d.sad.forEach((el) => pose(el, { o: fear }));
      });
      const pX = DIS[1].x;
      pose(peterSays, { x: pX + 50, y: LEDGE - 200, s: es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4)), o: t > 3.1 && t < 4 ? 1 : 0 });
      pose(peterQ, { x: pX + 12, y: LEDGE - 140, s: es(t, 5.15, 5.4, ease.back), o: es(t, 5.1, 5.2) * (1 - es(t, 5.85, 6)) });

      /* camera */
      S.cam.z = 1 + es(t, 0.1, 0.9) * 0.08 - es(t, 1.9, 2.5) * 0.1 + es(t, 7, 7.5) * 0.03 + es(t, 8.2, 8.9) * 0.06;
      S.cam.y = -es(t, 0.1, 0.9) * 40 + es(t, 1.9, 2.5) * 50 - es(t, 6, 6.8) * 30 + es(t, 8.2, 8.9) * 10;
    };
  },
};
