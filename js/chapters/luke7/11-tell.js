// Łk 7,22–23 — Jesus answers John's messengers, pointing to His eye and His ear: "Go and tell John what you have
// seen and heard." Then, one after another, round painted medallions come down on their cords over the meadow — the
// blind see, the lame walk, lepers are made clean, the deaf hear; the dead are raised, and the poor are given the
// good news — and each lights up as it arrives. "Blessed is he who does not stumble because of me": the medallions
// fly down into the messenger's satchel, Jesus raises His hand over the two, and they bow and set off back to John.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  hillsSet, JD, LAME, LEPER_HEALED, YOUTH, BEGGAR, roundel, figure, crutch, eyeGlyph, earGlyph, note, carriedBier, goldSlip, moneybag, folkGroup,
  bubble, sparkle, headAt, hand, voiceRings, kf, moving, tr, PI,
} from './lib.js';

const GY = 742, JX = 800, M1 = 1010, M2 = 1100;
const RX = [546, 648, 750, 852, 954, 1056], RY = [300, 282, 270, 270, 282, 300], R = 46;

export default {
  id: 'lk7-tell',
  beats: [
    { v: 22, text: 'Odpowiedział im więc: «Idźcie i donieście Janowi to, coście widzieli i słyszeli:' },
    { v: 22, cont: true, text: 'niewidomi wzrok odzyskują, chromi chodzą, trędowaci doznają oczyszczenia i głusi słyszą;' },
    { v: 22, cont: true, text: 'umarli zmartwychwstają, ubogim głosi się Ewangelię.' },
    { v: 23 },
  ],
  cam: { x: [-20, 60], y: [-80, 40], z: [1, 1.12] },
  build(S) {
    const H = hillsSet(S, { gy: 700 });
    // phone: the row of medallions closes up and the two messengers stand a little further in, all clear of the thread
    const PH = S.portrait;
    const RXp = PH ? RX.map((x, i) => 545 + i * 95) : RX;
    const MX = PH ? [985, 1065] : [M1, M2];
    const c = S.c;
    const backL = S.layer({ par: 0.5, sh: 4 });
    backL.sprite(folkGroup(makeCutter('lk7-hr-a'), 6, { s: 0.62 }), 300, 680);
    backL.sprite(folkGroup(makeCutter('lk7-hr-b'), 6, { s: 0.62, flip: true }), 1330, 680);
    /* the medallions */
    const ML = S.layer({ par: 0.3, sh: 6 });
    const g = (m, x = 0, y = 0, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${m}</g>`;
    const hill = (col = mix(C.hillNear, C.sand, 0.4)) => sheet().p(c.cut([[-50, 22], [50, 18], [50, 60], [-50, 60]], 0.4, 5), col).out();
    const inner = [
      hill() + g(eyeGlyph(c, 20), 0, -6) + `<path d="${c.ribbon([[-30, -30], [-22, -22]], 2.4) + c.ribbon([[0, -38], [0, -28]], 2.4) + c.ribbon([[30, -30], [22, -22]], 2.4)}" fill="${C.sunDeep}"/>`,
      hill() + figure(c, LAME, { x: -6, y: 36, s: 0.3, armF: 30, armB: 60 }) + g(crutch(c), 26, 20, 0.4),
      hill() + figure(c, LEPER_HEALED, { x: -4, y: 36, s: 0.3, armF: 60, armB: 150, head: -10 }) + g(sparkle(c, 9, C.halo), 22, -22),
      hill() + g(earGlyph(c, 18, C.skin2), -8, -2) + g(note(c, 5, C.teal2), 20, -12) + g(note(c, 4, C.teal2), 30, 6),
      hill() + g(carriedBier(c, 70), 0, 28) + figure(c, { ...YOUTH, robe: C.linen, pose: 'sit' }, { x: -6, y: 26, s: 0.3, flip: true, armF: 60, armB: 120, head: -8 }),
      hill() + figure(c, { ...BEGGAR, pose: 'sit' }, { x: -12, y: 36, s: 0.3, armF: 70, armB: 30, head: -6 }) + g(goldSlip(c, 26), 14, -18),
    ];
    const meds = inner.map((m0, i) => { const m = `<g transform="scale(1.04)">${m0}</g>`; const glow = ML.add(`<circle r="70" fill="url(#warm-glow)" opacity="0"/>`); return { i, glow, el: ML.add(`<g opacity="0">${roundel(makeCutter('lk7-rd' + i), m, { r: R })}</g>`) }; });
    /* the people (with a soft light behind the two messengers for the blessing) */
    const LL = S.layer({ par: 0.5, sh: 0, flat: true });
    const shine = LL.add(`<circle r="130" fill="url(#halo-glow)" opacity="0"/>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = JD.map((o, i) => ({ i, p: S.puppet(P.add(person(c, { ...o, holdB: i === 0 ? `<g transform="rotate(10)">${moneybag(c)}</g>` : '' }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, color: C.sun, r: 34, w: 5 });
    const W = S.layer({ par: 0.52, sh: 3 });
    const go = W.add(`<g opacity="0">${bubble(c, [tr('Idźcie i donieście Janowi', 'Go and tell John'), tr('to, coście widzieli i słyszeli', 'what you have seen and heard')], { size: 20, dir: -1, fill: C.halo })}</g>`);
    const eyeB = W.add(`<g opacity="0">${eyeGlyph(c, 26)}</g>`);
    const earB = W.add(`<g opacity="0">${earGlyph(c, 26, C.skin)}</g>`);
    const bless = W.add(`<g opacity="0">${bubble(c, [tr('Błogosławiony, kto', 'Blessed is he who finds'), tr('we Mnie nie zwątpi', 'no stumbling in me')], { size: 20, dir: -1, fill: C.halo })}</g>`);

    return (t, time) => {
      const T = time;
      H.update(T);
      /* v22a — "Go and tell John what you have seen and heard" */
      const speak = es(t, 0.05, 0.2) * (1 - es(t, 2.9, 3.0));
      const pEye = bump(t, 0.3, 0.6), pEar = bump(t, 0.55, 0.85);
      const blessK = es(t, 3.4, 3.55) * (1 - es(t, 3.9, 4.0));
      jesus.set({ x: JX, y: GY, s: 1.06, armF: 20 + speak * 30 + bump(t, 1.0, 2.9) * 30, armB: 10 + pEye * 140 + pEar * 150 + blessK * 150, head: -4 - bump(t, 1.0, 2.9) * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06);
      voice(hx, hy, speak * 0.9, T, { dir: 1, spread: 2 });
      const gb = es(t, 0.08, 0.2, ease.back) * (1 - es(t, 0.92, 0.98));
      pose(go, { x: hx + 36, y: hy - 40, s: gb, o: gb > 0.02 ? 1 : 0 });
      const eb = es(t, 0.34, 0.46, ease.back) * (1 - es(t, 0.92, 0.98)), rb = es(t, 0.6, 0.72, ease.back) * (1 - es(t, 0.92, 0.98));
      pose(eyeB, { x: hx - 110, y: hy - 70 + (T ? Math.sin(T * 2) * 3 : 0), s: eb, o: eb > 0.02 ? 1 : 0 });
      pose(earB, { x: hx - 40, y: hy - 110 + (T ? Math.sin(T * 2 + 1) * 3 : 0), s: rb, r: -8, o: rb > 0.02 ? 1 : 0 });

      /* v22b–c — the medallions come down one by one and light up; v23 — into the satchel */
      const [bgx, bgy] = hand(MX[0], GY, 1.0, true, 16, 0);
      meds.forEach((m) => {
        const a = m.i < 4 ? 1.04 + m.i * 0.15 : 2.05 + (m.i - 4) * 0.25;
        const k = es(t, a, a + 0.22, ease.out);
        const pack = es(t, 3.08 + m.i * 0.04, 3.34 + m.i * 0.04, ease.in);
        const x = lerp(RXp[m.i], bgx - 6, pack), y = lerp(lerp(-1500, RY[m.i], k), bgy - 40, pack);
        pose(m.el, { x, y, s: 1 - pack * 0.85, r: T ? Math.sin(T * 0.7 + m.i * 1.3) * 1.2 * k : 0, o: k > 0.002 && pack < 0.98 ? 1 : 0 });
        const lit = bump(t, a + 0.15, a + 0.75);
        pose(m.glow, { x: RXp[m.i], y: RY[m.i] + R + 12, s: 0.6 + lit * 0.6, o: lit * 0.9 * (1 - pack) });
      });

      /* the two messengers: listening, watching, then blessed and on their way */
      dis.forEach((d) => {
        const K = [[0, MX[d.i]], [3.62, MX[d.i]], [4.0, MX[d.i] + 380]];
        const x = kf(t, K);
        const look = es(t, 1.0, 1.2) * (1 - es(t, 3.0, 3.1));
        const bow = bump(t, 3.45, 3.65);
        d.p.set({ x, y: GY + d.i * 6, s: 1.0, flip: t < 3.62, walk: moving(t, K) ? x * 0.05 + d.i : undefined, armF: 16 + (d.i === 0 ? bump(t, 3.05, 3.4) * 40 : 0), armB: 10 + look * (d.i ? 40 : 20), head: -look * 22 + bow * 20, lean: bow * 10, blink: blinkAt(T, d.seed) });
      });
      const bb = es(t, 3.42, 3.54, ease.back) * (1 - es(t, 3.94, 4.0));
      pose(bless, { x: hx + 36, y: hy - 40, s: bb, o: bb > 0.02 ? 1 : 0 });
      pose(shine, { x: MX[0] + 45, y: GY - 120, s: 1 + blessK * 0.3, o: blessK * 0.6 });

      S.cam.y = kf(t, [[0, 20], [0.9, 20], [1.2, 0], [3.0, 0], [3.3, 10]]);
      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.08], [1.2, 1.0], [3.0, 1.0], [3.3, 1.08]]);
      S.cam.x = kf(t, [[0, 20], [3.0, 10], [3.6, 40]]);
    };
  },
};
