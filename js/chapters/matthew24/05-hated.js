// Mt 24,9–10 — night on the Mount, a small lamp in the circle, and above them a lit shadow-play screen. "They will
// hand you over to affliction and kill you": a disciple is led in between two guards and made to kneel; the screen
// goes dark for a moment, and when the light comes back a crown of light rests over him. "You will be hated by all
// nations because of my name": three disciples hold a little light — the Name — and crowds come in from both sides,
// every hand pointing at them. "Then many will fall away, betray one another and hate one another": one stumbles,
// one turns and points his brother out to a guard, who leads him off; their backs are to each other, the light dims.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, clamp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, shadowScreen, handLamp, voiceRings, lightCrown, soulLight, shadowGroup, crowdStrip, silh, helmet, spear, addToHead, folk, man, PI } from './lib.js';

const SX = 800, SY = 118, SW = 740, SH = 316;
const GL = SY + SH - 26;            // the ground line of the shadow play
const X0 = SX - SW / 2, X1 = SX + SW / 2;
const SIL = '#3b2a22';
/** a silhouette stepping into the light at the screen's edges */
const edge = (x) => clamp((x - X0 - 10) / 50) * clamp((X1 - 10 - x) / 50);

export default {
  id: 'mt24-hated',
  beats: [
    { v: 9, text: 'Wtedy wydadzą was na udrękę i będą was zabijać,' },
    { v: 9, cont: true, text: 'i będziecie w nienawiści u wszystkich narodów, z powodu mego imienia.' },
    { v: 10 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.42, NIGHTC = mix(C.night, C.duskViolet, 0.3);
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: TK, moonXY: [1250, 110], templeGlow: 0.2 });

    /* the screen (still) */
    const scrL = S.layer({ par: 0.3, sh: 6 });
    scrL.add(`<g transform="translate(${SX} ${SY})">${shadowScreen(c, SW, SH)}</g>`);
    scrL.add(`<g transform="translate(${SX} ${SY})">${sheet().p(c.cut(c.rect(-SW / 2, SH - 26, SW, 26), 0.4, 10), mix('#f7e6c4', C.sand2, 0.35)).out()}</g>`);

    /* the shadow players */
    const shL = S.layer({ par: 0.3, sh: 2 });
    const GUARD = { robe: C.clay, hairStyle: 'short', beard: 'short', belt: C.leather };
    const guardM = (i) => silh(addToHead(person(c, { ...GUARD, holdF: i ? '' : `<g transform="translate(0 0)">${spear(c, 190)}</g>`, holdB: i ? `<g>${spear(c, 190)}</g>` : '' }), helmet(c)), SIL);
    const guards = [0, 1].map((i) => ({ i, p: S.puppet(shL.add(guardM(i))) }));
    const guard3 = S.puppet(shL.add(guardM(0)));
    const DO = { ...CAST.andrew };
    const dStand = S.puppet(shL.add(silh(person(c, DO), SIL)));
    const dKneel = S.puppet(shL.add(silh(person(c, { ...DO, pose: 'kneel' }), SIL)));
    const three = [CAST.john, CAST.james, CAST.thomas].map((o, i) => ({ i, p: S.puppet(shL.add(silh(person(c, o), SIL))), seed: c.rr(0, 9) }));
    const stumble = S.puppet(shL.add(silh(person(c, { ...CAST.james, pose: 'kneel' }), SIL)));
    // the nations: two still crowds that slide in, pointing
    const pointing = (n, face) => shadowGroup(c, crowdStrip(c, n, { w: 200, s: 0.56, rows: 2, face, arms: [70, 100], armB: [0, 40], head: [-4, 4], o: (cc, i) => (i % 3 === 0 ? { ...folk(cc), hairStyle: 'wrap', veil: C.stone } : folk(cc)) }), SIL);
    const mobL = shL.sprite(pointing(8, 1), X0 + 104, GL - 8), mobR = shL.sprite(pointing(8, -1), X1 - 104, GL - 8);
    // the dark that falls over the screen for a moment
    const dimL = S.layer({ par: 0.3, sh: 1, flat: true });
    dimL.add(`<rect x="${X0}" y="${SY}" width="${SW}" height="${SH}" fill="${mix(C.night2, SIL, 0.4)}"/>`);
    /* coloured lights on the screen: the crown, the Name */
    const litL = S.layer({ par: 0.3, sh: 3 });
    const crown = litL.add(`<g transform="translate(0 -1500)">${lightCrown(c, 30)}</g>`);
    const name = litL.add(`<g transform="translate(0 -1500)">${soulLight(c, 10)}</g>`);

    /* the circle and the lamp */
    const P = S.layer({ par: 0.55, sh: 5 });
    const lampEl = P.add(`<g transform="translate(734 712)">${handLamp(c, { glowR: 170 })}</g>`);
    const flame = lampEl.querySelector('.flame');
    const circ = circle(S, P, { tintCol: NIGHTC, tintK: 0.18 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 800, sunO: 0, moon: 110, moonO: 1, glow: 0.2, starsO: 1 });
      pose(flame, { x: 27, y: -12, sy: 1 + (T ? Math.sin(T * 7) * 0.08 : 0), sx: 1 + (T ? Math.sin(T * 5) * 0.05 : 0) });

      /* v9a — led in between two guards; he kneels; the dark; a crown of light */
      const lead = seg(t, 0.0, 0.36);
      const kneel = es(t, 0.37, 0.43);
      const dark = bump(t, 0.44, 0.66);
      const out0 = es(t, 1.0, 1.15);
      const dx = lerp(X0 - 40, 800, ease.out(lead));
      const walking = lead > 0 && lead < 1;
      dStand.set({ x: dx, y: GL, s: 0.62, o: edge(dx) * (1 - kneel), walk: walking ? dx * 0.08 : undefined, head: 6, armF: 20, armB: 10 });
      dKneel.set({ x: 800, y: GL, s: 0.62, o: kneel * (1 - out0), head: 10 - es(t, 0.6, 0.75) * 16, armF: 40 + es(t, 0.6, 0.75) * 60, armB: 30 + es(t, 0.6, 0.75) * 100 });
      const back = es(t, 0.46, 0.64);
      guards.forEach((g) => {
        const gx = lerp(X0 - 120 - g.i * 0, g.i ? 690 : 918, ease.out(lead)) + (g.i ? -1 : 1) * back * 400;
        g.p.set({ x: gx, y: GL, s: 0.64, flip: g.i === 1 && back > 0, o: edge(gx) * (1 - back * 0.9), walk: walking || (back > 0 && back < 1) ? gx * 0.08 : undefined, armF: g.i ? 30 : 60, armB: g.i ? 40 : 20 });
      });
      dimL.fade(dark * 0.85);
      const cr = es(t, 0.56, 0.74, ease.out) * (1 - out0);
      pose(crown, { x: 802, y: lerp(SY - 60, GL - 150, cr), s: 0.9, o: cr > 0.01 ? 1 : 0 });

      /* v9b — three hold the Name; the nations come in from both sides, pointing */
      const three0 = es(t, 1.05, 1.2);
      const split = es(t, 2.05, 2.4);
      const TX = [712, 800, 880];
      three.forEach((m) => {
        let x = TX[m.i], flip = m.i === 2, armF = 50, armB = 0, head = 0, lean = 0, o = three0;
        if (m.i === 0) { x += split * 150; armF = 50 - split * 30; head = 10 * split; lean = 8 * split; }   // handed over, led off
        if (m.i === 1) { o = three0 * (1 - es(t, 2.1, 2.16)); }                                             // stumbles
        if (m.i === 2) { flip = split > 0.3 ? false : true; armF = 50 + split * 45; x += split * 40; }        // turns and points him out
        m.p.set({ x, y: GL, s: 0.62, flip, o: o * edge(x), armF, armB, head, lean, walk: m.i === 0 && split > 0 && split < 1 ? x * 0.08 : undefined, blink: 0 });
      });
      stumble.set({ x: TX[1] - 10, y: GL, s: 0.62, flip: true, o: es(t, 2.1, 2.16), lean: 10, head: 16, armF: 70, armB: 40 });
      const g3 = es(t, 2.1, 2.5);
      const g3x = lerp(X1 + 60, 980, ease.out(es(t, 2.05, 2.3))) + es(t, 2.3, 2.8) * (S.portrait ? 50 : 140);   // phone: he stays in sight
      guard3.set({ x: g3x, y: GL, s: 0.64, flip: es(t, 2.3, 2.35) < 0.5, o: edge(g3x) * (g3 > 0 ? 1 : 0), walk: g3 > 0 && g3 < 1 ? g3x * 0.08 : undefined, armF: 70, armB: 20 });
      const mobIn = es(t, 1.15, 1.55, ease.out) * (1 - es(t, 2.0, 2.3));
      mobL.set({ x: lerp(X0 - 60, X0 + 104, mobIn), y: GL - 8, s: 1, o: mobIn });
      mobR.set({ x: lerp(X1 + 60, X1 - 104, mobIn), y: GL - 8, s: 1, o: mobIn });
      const nk = three0 * (1 - es(t, 2.1, 2.5) * 0.6);
      pose(name, { x: 800 + 20, y: GL - 92 + (T ? Math.sin(T * 1.6) * 2 : 0), s: 0.9 + bump(t, 1.2, 2.0) * 0.4, o: nk });

      /* the four look up at the screen; Jesus grieves, then lifts the Name, then bows */
      const grave = es(t, 0.1, 0.4) * (1 - es(t, 1.0, 1.1));
      const lift = es(t, 1.1, 1.4) * (1 - es(t, 2.0, 2.1));
      const sorrow = es(t, 2.1, 2.5);
      J.set({ x: JX, y: JY, s: circ.s, armF: 25 + grave * 40 + lift * 70 + sorrow * 20, armB: 10 + lift * 60, head: grave * 8 - lift * 10 + sorrow * 10 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(JX - 4, JY - 158, Math.max(grave, lift * 0.6) * 0.8, T, { s0: 0.7 });
      circ.four.forEach((m) => {
        const up = es(t, 0.05, 0.35);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, lean: m.dir * 3, armF: 20 + dark * 30, head: -up * 12 + sorrow * 10, blink: blinkAt(T, m.seed) });
      });

      S.cam.y = -es(t, -0.2, 0.4) * 20;
      S.cam.z = 1 + es(t, -0.2, 0.4) * 0.04;
    };
  },
};
