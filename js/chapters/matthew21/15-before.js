// Mt 21,31–32 — back in the Temple court. "Which of the two did his father's will?" — the two sons hang on round
// plates; the leaders answer, and the one who went glows (a bunch of grapes on his plate). "Tax collectors and
// prostitutes are going into the Kingdom of God before you": the golden gate of the Kingdom comes down and they walk
// in ahead, while the chief priests stand outside. "John came to you in the way of righteousness" — a road of light,
// John walking on it — and the leaders turn their backs; the tax collectors and the women kneel to him, hearts
// glowing. "You saw it, and still did not repent": the leaders glance back over their shoulders, hearts of stone.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, courtFront, priest, elder, withFace, faceBits, TWELVE_O, headAt, bubble, hungPlate, kingdomGate, lightRoad, JOHN_B, TAXMEN, SINNERS, SONS, heart, grapeBunch, glowDisc, sparkle, tr, DAY, FONT } from './lib.js';
import { stoneHeart } from '../mark3/lib.js';

const FLOOR = 676;
const GX0 = 900;                           // the gate of the Kingdom
const A_OBEYS = tr(false, true);           // as in the parable: PL "the second", EN "the first"
const OB = A_OBEYS ? 0 : 1;

export default {
  id: 'mt21-before',
  beats: [
    { v: 31, text: 'Któryż z tych dwóch spełnił wolę ojca?»' },
    { v: 31, cont: true, text: 'Mówią Mu: «Ten drugi».' },
    { v: 31, cont: true, text: 'Wtedy Jezus rzekł do nich: «Zaprawdę, powiadam wam: Celnicy i nierządnice wchodzą przed wami do królestwa niebieskiego.' },
    { v: 32, text: 'Przyszedł bowiem do was Jan drogą sprawiedliwości, a wyście mu nie uwierzyli.' },
    { v: 32, cont: true, text: 'Celnicy zaś i nierządnice uwierzyli mu.' },
    { v: 32, cont: true, text: 'Wy patrzyliście na to, ale nawet później nie opamiętaliście się, żeby mu uwierzyć.' },
  ],
  cam: { x: [-60, 100], y: [-60, 40], z: [0.95, 1.12] },
  build(S) {
    const c = S.c;
    const JX = S.portrait ? 580 : 470;   // keep Jesus on the narrow stage
    // phone: the gate a little left, the leaders closer together and in from the right edge
    const GX = S.portrait ? 860 : GX0;
    const LXS = S.portrait ? [945, 997, 1049, 1101] : null, TURN = S.portrait ? 10 : 40;
    const { sunEl, cl1 } = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 140] });

    /* ---------- the road of righteousness (laid on the paving) and the gate of the Kingdom ---------- */
    const roadL = S.layer({ par: 0.46, sh: 1, flat: true });
    const road = roadL.add(`<g>${lightRoad(c, 150, 30, 300)}</g>`);
    const gateL = S.layer({ par: 0.47, sh: 5 });
    const kg = kingdomGate(c, 150, 210);
    const gateGlow = gateL.add(`<g>${glowDisc(260, 'halo-glow', 1)}</g>`);
    const gate = gateL.add(`<g><g transform="scale(1.45)">${kg.light}${kg.frame}</g><path d="M-120 -305V-2000M120 -305V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/></g>`);

    /* ---------- the leaders ---------- */
    const LD = S.layer({ par: 0.48, sh: 4 });
    const LEADERS = [{ m: priest(c, 0), x: 1070 }, { m: elder(c, 0), x: 1140 }, { m: priest(c, 1), x: 1210 }, { m: elder(c, 1), x: 1280 }]
      .map((d, i) => ({ ...d, x: LXS ? LXS[i] : d.x, i, seed: c.rr(0, 9), y: FLOOR - (i % 2 ? 16 : 2), p: S.puppet(LD.add(withFace(d.m, faceBits(c)))) }));
    LEADERS.forEach((d) => { d.angry = d.p.el.querySelector('[data-part="angry"]'); d.sad = d.p.el.querySelector('[data-part="sad"]'); });

    /* ---------- tax collectors and women, John ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const SIN = [TAXMEN[0], SINNERS[0], TAXMEN[2], SINNERS[3]].map((o, i) => ({ o, i, seed: c.rr(0, 9), st: S.puppet(P.add(person(c, o))), kn: S.puppet(P.add(person(c, { ...o, pose: 'kneel' }))) }));
    const john = S.puppet(P.add(person(c, { ...JOHN_B })));
    const DIS = [0, 2].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, TWELVE_O[k]))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    /* ---------- plates, words, hearts ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const sonPlates = SONS.map((o, i) => fx.add(hungPlate(c, `<g transform="translate(0 36) scale(.36)">${person(c, o)}</g>${i === OB ? `<g transform="translate(28 -10)">${grapeBunch(c, 4.4)}</g>` : ''}<text x="0" y="62" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.ink}">${i ? tr('drugi', 'the second') : tr('pierwszy', 'the first')}</text>`, { r: 58 })));
    const plateGlow = fx.add(`<g>${glowDisc(120, 'warm-glow', 1)}</g>`);
    const which = fx.add(`<g>${bubble(c, [tr('Który spełnił', 'Which of the two'), tr('wolę ojca?', 'did his father’s will?')], { size: 18, tail: -1 })}</g>`);
    const reply = fx.add(`<g>${bubble(c, [tr('Ten drugi.', 'The first.')], { size: 20, tail: 1 })}</g>`);
    const hearts = SIN.map(() => fx.add(`<g>${heart(c, 13)}</g>`));
    const stones = LEADERS.map(() => fx.add(`<g>${stoneHeart(c, 15)}</g>`));
    const shine = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));
    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v31a — "Which of the two did his father's will?" */
      const pk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 1.9, 2.2, ease.in));
      sonPlates.forEach((p, i) => pose(p, { x: 700 + i * 200, y: lerp(-800, 230, pk) + (i ? 12 : 0), r: T ? Math.sin(T * 1.1 + i) * 2 : 0 }));
      const [jhx, jhy] = headAt(JX, FLOOR, 1.04, false);
      const wk = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.9, 1.0));
      pose(which, { x: jhx + (S.portrait ? 40 : -30), y: jhy - 40, s: wk, o: wk > 0.02 ? 1 : 0 });
      /* v31b — they answer; the one who went glows */
      const [lhx, lhy] = headAt(LEADERS[0].x, LEADERS[0].y, 0.9, true);
      const rk = es(t, 1.05, 1.25, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(reply, { x: lhx - 20, y: lhy - 40, s: rk, o: rk > 0.02 ? 1 : 0 });
      const gl = es(t, 1.15, 1.4) * (1 - es(t, 1.9, 2.1));
      pose(plateGlow, { x: 700 + OB * 200, y: 230 + OB * 12, s: 0.8 + gl * 0.5, o: gl });

      /* v31c — the gate of the Kingdom: tax collectors and prostitutes go in ahead of you */
      const gk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.25, ease.in));
      pose(gate, { x: GX, y: lerp(-900, FLOOR + 6, gk), r: T ? Math.sin(T * 0.8) * 0.6 : 0 });
      pose(gateGlow, { x: GX, y: FLOOR - 170, s: 1, o: es(t, 2.3, 2.5) * (1 - es(t, 2.9, 3.1)) });
      /* v32a — John on the road of righteousness */
      const rd = es(t, 3.05, 3.3);
      pose(road, { x: 820, y: FLOOR - 120, sx: 1, sy: Math.max(0.01, rd), o: rd > 0.01 ? 0.9 : 0 });
      const jIn = es(t, 3.1, 3.5, ease.out);
      john.set({ x: 820, y: lerp(FLOOR - 70, FLOOR + 10, jIn), s: lerp(0.7, 1.0, jIn), flip: false, walk: jIn > 0 && jIn < 1 ? t * 30 : undefined, armF: 30 + es(t, 3.5, 3.7) * 50, armB: es(t, 3.5, 3.7) * 110, head: -6, o: seg(t, 3.08, 3.14), blink: blinkAt(T, 7) });
      shine.forEach((sp, i) => { const k = ((T * 0.3 + i / 3) % 1); pose(sp, { x: 800 + (i - 1) * 60, y: FLOOR - 250 - k * 60, s: 0.8, r: T * 40, o: es(t, 3.3, 3.5) * Math.sin(k * 3.14) }); });

      SIN.forEach((m) => {
        // v31c: they come from the left past Jesus and walk in at the gate
        const inK = es(t, 2.2 + m.i * 0.1, 2.75 + m.i * 0.06);
        let x = lerp(-120 - m.i * 70, GX - 10, inK);
        let o = seg(t, 2.15, 2.2) * (1 - seg(t, 2.72 + m.i * 0.06, 2.77 + m.i * 0.06));
        // v32b: they come back in to John, and kneel
        const back = es(t, 4.02 + m.i * 0.05, 4.35 + m.i * 0.05, ease.out);
        const kneel = seg(t, 4.4 + m.i * 0.04, 4.45 + m.i * 0.04);
        let flip = false;
        if (t > 3.9) { const hx = [640, 700, 950, 1010][m.i]; x = lerp(m.i < 2 ? 200 : 1500, hx, back); o = seg(t, 4.0, 4.05); flip = m.i >= 2; }
        const walk = (inK > 0 && inK < 1 && t < 3) || (back > 0 && back < 1);
        m.st.set({ x, y: FLOOR + 14 + (m.i % 2) * 8, s: 0.9, flip, walk: walk ? x * 0.05 + m.i : undefined, armF: 30, armB: t < 3 ? es(t, 2.5, 2.7) * 60 : 0, head: -4, o: o * (1 - kneel), blink: blinkAt(T, m.seed) });
        m.kn.set({ x, y: FLOOR + 14 + (m.i % 2) * 8, s: 0.9, flip, armF: 80, armB: 120, head: -12, o: o * kneel, blink: blinkAt(T, m.seed) });
        const hk = es(t, 4.5 + m.i * 0.05, 4.7 + m.i * 0.05, ease.back);
        pose(hearts[m.i], { x: x + (flip ? -6 : 6), y: FLOOR - 150 + Math.sin(T * 2 + m.i) * 3, s: hk, o: hk > 0.02 && t > 4 ? 1 : 0 });
      });

      /* the leaders: they answer, stand outside, turn their backs on John, glance back but do not repent */
      const turn = es(t, 3.4, 3.55);
      const glance = es(t, 5.05, 5.3);
      LEADERS.forEach((d) => {
        const back = turn > 0.5 && glance < 0.5;
        d.p.set({ x: d.x + turn * TURN, y: d.y, s: 0.9, flip: !back, armF: (d.i === 0 ? bump(t, 1.05, 1.9) * 70 : 0) + turn * 30, armB: turn * 30, head: back ? 10 : -glance * 8 + turn * 6, lean: back ? -4 : 0, blink: blinkAt(T, d.seed) });
        fade(d.angry, es(t, 2.3, 2.5) * (1 - glance) + glance * 0.8);
        const sk = es(t, 5.25 + d.i * 0.05, 5.45 + d.i * 0.05, ease.back);
        pose(stones[d.i], { x: d.x + turn * TURN, y: d.y - 205, s: sk, o: sk > 0.02 ? 1 : 0 });
      });

      jesus.set({ x: JX, y: FLOOR, s: 1.04, armF: 30 + wk * 50 + bump(t, 2.05, 2.9) * 60 + bump(t, 3.05, 3.9) * 50, armB: bump(t, 2.1, 2.9) * 40, head: 2, blink: blinkAt(T) });
      DIS.forEach((d) => d.p.set({ x: JX - 120 - d.i * 60, y: FLOOR - 12 + d.i * 8, s: 0.88, head: -bump(t, 2.1, 2.9) * 6, blink: blinkAt(T, d.seed) }));

      S.cam.x = 20 + es(t, 2.0, 2.4) * 20 + es(t, 3.9, 4.3) * 20 + (S.portrait ? 25 : 0);   // phone: a touch right, so the last leader clears the thread
      S.cam.y = -30 * pk - 20 * gk + 10;
      S.cam.z = 1.04 - es(t, 2.0, 2.4) * 0.04;
    };
  },
};
