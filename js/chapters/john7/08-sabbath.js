// J 7,21–24 — "I did one work, and you all marvel": a sepia plate comes down — the pool of Bethesda (ch. 5), the
// man who lay there thirty-eight years walking away with his mat rolled on his shoulder, a Sabbath tag with candles.
// "Moses gave you circumcision — not from Moses but from the fathers": Moses' portrait, and behind it Abraham under
// the stars. "And on the Sabbath you circumcise": a swaddled baby on a cushion, the Sabbath candles lit, the eighth
// day. A great balance comes down: into one pan the little one, "that the Law of Moses be not broken"; into the other
// the whole man made well — and they are angry. "Do not judge by appearance": the leaders' smiling masks drop, and
// the balance glows gold — "judge with right judgment".
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { rolledMat, candle } from '../mark2/lib.js';
import { LOOK as L12, maskOnStick } from '../mark12/lib.js';
import { baby } from '../john3/lib.js';
import { HEALED, matRoll } from '../john5/lib.js';
import { bubble as bubble5 } from '../mark5/lib.js';
import {
  feastCourt, PH, townMan, townWoman, headAt, hand, voiceRings, strip, nameTag, roundel, bigBalance, SEPIA, GLYPH, thought, spark,
  hangAt, vpose, FEAST, tr, PI,
} from './lib.js';

const JX = 800;
const LX = [1010, 1094, 1176];
const BAL = { x: 800, y: 196, arm: 170 };
const sep = (o) => { const r = {}; for (const [k, v] of Object.entries(o)) r[k] = typeof v === 'string' && v[0] === '#' ? mix(v, '#b9a78c', 0.55) : v; return r; };

export default {
  id: 'j7-sabbath',
  beats: [
    { v: 21, text: 'W odpowiedzi Jezus rzekł do nich:' },
    { v: 21, cont: true, text: '«Dokonałem tylko jednego czynu, a wszyscy jesteście zdziwieni.' },
    { v: 22, text: 'Oto Mojżesz dał wam obrzezanie - ale nie pochodzi ono od Mojżesza, lecz od przodków -' },
    { v: 22, cont: true, text: 'i wy w szabat obrzezujecie człowieka.' },
    { v: 23, text: 'Jeżeli człowiek może przyjmować obrzezanie nawet w szabat, aby nie przekroczono Prawa Mojżeszowego,' },
    { v: 23, cont: true, text: 'to dlaczego złościcie się na Mnie, że w szabat uzdrowiłem całego człowieka?' },
    { v: 24 },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = feastCourt(S, { skyCols: FEAST });
    const F = set.F + 20;

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const crowdL = [[400, 0], [470, 1], [540, 2], [606, 3]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, i % 2 ? townWoman(c) : townMan(c)))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 30, w: 4 });
    const leaders = LX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...PH(c, i) }))) }));
    const masks = LX.map(() => P.add(`<g>${maskOnStick(c)}</g>`));
    const angry = LX.map(() => P.add(`<g>${thought(c, `<g transform="scale(.9)">${GLYPH.storm(c)}</g>`, { w: 52, h: 42 })}</g>`));
    set.front();

    /* plates */
    const X = S.layer({ par: 0.5, sh: 6 });
    // the one work: Bethesda, in sepia
    const pool = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-120, -120, 240, 240), 0, 20), '#efe2c6');
      s.p(c.cut(c.rect(-120, -30, 240, 40), 0.4, 10), '#d9c7a4');
      let cols = '';
      for (let x = -104; x < 120; x += 42) cols += c.cut(c.rect(x, -100, 12, 72), 0.3, 6);
      s.p(cols, '#e3d3b4');
      s.p(c.cut(c.rect(-120, -108, 240, 10), 0.3, 8), '#cdb892');
      s.p(c.cut(c.ell(-30, 40, 110, 22, 20), 0.6, 6), mix('#b9c9c0', '#d9c7a4', 0.3));
      s.x(c.ribbon([[-90, 38], [-40, 36]], 2) + c.ribbon([[0, 46], [40, 44]], 2), '#f3ecdc', 'opacity=".8"');
      const man = `<g transform="translate(46 74) scale(.5)">${person(c, { ...sep(HEALED), holdB: `<g transform="translate(0 -10) rotate(-70)">${matRoll(c, 90)}</g>` })}</g>`;
      return s.out() + man;
    })();
    const poolP = hanging(X, roundel(c, pool, { r: 96, face: '#efe2c6', rim: mix(C.wood3, C.parchment, 0.3), id: S.id('pool') }) + `<g transform="translate(0 112)">${strip(c, tr('jeden czyn — w szabat', 'one work — on the Sabbath'), { size: 16 })}</g>`, { x: 1040, y: 230, len: 600 });
    // Moses — and before him Abraham under the stars: the fathers
    const portrait = (o, label, bg) => {
      const s = sheet();
      s.p(c.cut(c.rect(-58, -72, 116, 144), 0.4, 8), C.ochre);
      s.p(c.cut(c.rect(-50, -64, 100, 128), 0.3, 8), bg);
      return `${s.out()}<g transform="translate(0 54) scale(.5)">${person(c, o)}</g><g transform="translate(0 90)">${strip(c, label, { size: 15 })}</g>`;
    };
    const mosesP = hanging(X, portrait(L12.moses, tr('Mojżesz', 'Moses'), mix(C.parchment, C.dawn, 0.4)), { x: 900, y: 250, len: 600 });
    const abrahamP = hanging(X, `<g transform="scale(1.1)">${portrait(L12.abraham, tr('przodkowie', 'the fathers'), C.night)}</g><g transform="translate(-50 -64) scale(.36)">${stars(c, { x0: 20, x1: 270, y0: 10, y1: 150, n: 30 })}</g>`, { x: 1080, y: 230, len: 600 });
    // the eighth day on the Sabbath: a swaddled baby on a cushion, candles lit
    const babyEl = X.add(`<g>${sheet().p(c.cut(c.blob(0, 8, 46, 12, 12, 0.1), 0.4, 5), C.jesusMantle).out()}<g transform="scale(1.3)">${baby(c)}</g></g>`);
    const cands = [-70, 70].map((dx) => ({ dx, el: X.add(`<g transform="scale(.7)">${candle(c, 40)}</g>`) }));
    const sabT = X.add(`<g>${strip(c, tr('szabat — ósmy dzień', 'the Sabbath — the eighth day'), { size: 16 })}</g>`);
    // the balance
    const B = bigBalance(c, BAL.arm);
    const stand = X.add(`<g><path d="M0 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${B.stand}</g>`);
    const beamEl = X.add(`<g>${B.beam}</g>`);
    const panL = X.add(`<g>${B.pan}</g>`), panR = X.add(`<g>${B.pan}</g>`);
    const babyPan = X.add(`<g transform="scale(.7)">${baby(c)}</g>`);
    const manPan = X.add(`<g><circle cy="-60" r="70" fill="url(#halo-glow)"/><g transform="scale(.44)">${person(c, { ...HEALED, holdB: `<g transform="translate(0 -10) rotate(-70)">${matRoll(c, 90)}</g>` })}</g></g>`);
    const lawT = X.add(`<g>${strip(c, tr('by nie złamać Prawa', 'that the Law be not broken'), { size: 15 })}</g>`);
    const wholeT = X.add(`<g>${strip(c, tr('cały człowiek', 'a whole man'), { size: 15 })}</g>`);
    const goldGlow = X.add(`<g><circle r="210" fill="url(#halo-glow)"/></g>`);
    const judgeT = hanging(X, nameTag(c, tr(['sądźcie', 'sprawiedliwie'], ['judge', 'righteously']), { size: 17 }), { x: 800, y: 330, len: 600 });

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.2 });

      /* Jesus answers */
      const talk = es(t, 0.05, 0.3);
      jesus.set({ x: JX, y: F, s: 1.04, flip: t > 4.9 && t < 6.0, armF: 22 + talk * 24 + bump(t, 1.1, 1.9) * 40 + bump(t, 3.1, 3.9) * 20 + bump(t, 5.2, 5.9) * 30 + bump(t, 6.1, 6.9) * 40, armB: 10 + bump(t, 2.1, 2.9) * 50, head: -2 + bump(t, 1.1, 1.9) * -6, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(JX, F, 1.04, t > 4.9 && t < 6.0);
      voice(hx, hy + 4, talk * bump(t, 0.0, 1.0), T, { spread: 1.6 });

      /* v21b — the one work: Bethesda */
      const pk = es(t, 1.05, 1.35, ease.out), pu = es(t, 1.95, 2.15, ease.in);
      hangAt(poolP, 1040, lerp(-300, 320, pk) - pu * 800, T, pk > 0 && pu < 1 ? 1 : 0, 1.2, 0.8, 1);
      const mar = bump(t, 1.2, 2.0);
      crowdL.forEach((m) => m.p.set({ x: m.x, y: F + 6 + (m.i % 2) * 6, s: 0.95, armF: 16 + mar * (m.i % 2 ? 40 : 20), armB: 10 + mar * 50 * (m.i === 2 ? 1 : 0), head: -mar * 6, lean: -mar * 3, blink: blinkAt(T, m.seed) }));

      /* v22a — Moses, and before him the fathers */
      const mk = es(t, 2.05, 2.3, ease.out), ak = es(t, 2.3, 2.6, ease.out), mu = es(t, 2.95, 3.1, ease.in);
      hangAt(mosesP, 880, lerp(-300, 330, mk) - mu * 800, T, mk > 0 && mu < 1 ? 1 : 0, 1.2, 0.9, 2);
      hangAt(abrahamP, 1080, lerp(-300, 320, ak) - mu * 800, T, ak > 0 && mu < 1 ? 1 : 0, 1.2, 0.9, 3);

      /* v22b — on the Sabbath: the baby, the candles */
      const bk = es(t, 3.05, 3.3, ease.back), bu = es(t, 4.1, 4.3);
      const bx = lerp(620, BAL.x - BAL.arm, bu);
      vpose(babyEl, { x: 620, y: 420, s: bk * (1 - bu), o: bk > 0 && bu < 0.95 ? 1 : 0 });
      cands.forEach((cd) => {
        const on = bk > 0 && bu < 1;
        vpose(cd.el, { x: 620 + cd.dx, y: 440, s: 0.7 * bk, o: on ? 1 - bu : 0 });
      });
      vpose(sabT, { x: 620, y: 480, o: es(t, 3.25, 3.35) * (1 - es(t, 3.95, 4.05)) });

      /* v23 — the balance: the little one, the whole man */
      const dk = es(t, 4.0, 4.35, ease.out);
      const by = lerp(-400, BAL.y, dk);
      const tilt = es(t, 4.4, 4.7) * -6 + es(t, 5.25, 5.6) * 20 - es(t, 6.2, 6.6) * 14;
      const r = (tilt * PI) / 180;
      hangAt(stand, BAL.x, by, T, dk > 0 ? 1 : 0, 0.4, 0.8, 0);
      const pivot = [BAL.x, by + 44];
      vpose(beamEl, { x: pivot[0], y: pivot[1], r: tilt, o: dk > 0 ? 1 : 0 });
      const endL = [pivot[0] - Math.cos(r) * BAL.arm, pivot[1] - Math.sin(r) * BAL.arm];
      const endR = [pivot[0] + Math.cos(r) * BAL.arm, pivot[1] + Math.sin(r) * BAL.arm];
      vpose(panL, { x: endL[0], y: endL[1], o: dk > 0 ? 1 : 0 });
      vpose(panR, { x: endR[0], y: endR[1], o: dk > 0 ? 1 : 0 });
      const inL = es(t, 4.3, 4.45);
      vpose(babyPan, { x: lerp(620, endL[0], inL), y: lerp(420, endL[1] + 80, inL), s: 0.7 + (1 - inL) * 0.6, o: inL > 0 ? 1 : 0 });
      vpose(lawT, { x: endL[0], y: endL[1] + 124, o: dk > 0 ? es(t, 4.45, 4.6) * (1 - es(t, 6.1, 6.2)) : 0 });
      const inR = es(t, 5.15, 5.35, ease.out);
      vpose(manPan, { x: endR[0], y: endR[1] + 86 - (1 - inR) * 300, o: inR > 0 ? 1 : 0 });
      vpose(wholeT, { x: endR[0], y: endR[1] + 124, o: es(t, 5.3, 5.45) * (1 - es(t, 6.1, 6.2)) });

      /* the leaders: angry (v23b), then their masks fall (v24) */
      leaders.forEach((m, i) => {
        const cross = es(t, 5.3, 5.5);
        const hold = es(t, 5.4, 5.6);                  // a smiling mask held up over the angry face
        const fall = es(t, 6.05, 6.4, ease.in);
        const y = F + (m.i % 2) * 6;
        m.p.set({ x: m.x, y, s: 0.98, flip: true, blink: blinkAt(T, m.seed), head: cross * 6 * (1 - fall) + fall * 10, armF: 24 + bump(t, 1.2, 2.0) * 10 + hold * 50 * (1 - fall), armB: 10 + cross * 20 * (1 - fall) });
        const [ahx, ahy] = headAt(m.x, y, 0.98, true);
        const mx = lerp(ahx - 30, ahx - 16, hold), my = lerp(ahy + 110, ahy + 54, hold);
        vpose(masks[i], { x: mx - fall * 16, y: my + fall * (F - my - 2), r: -fall * 84, o: hold > 0 ? 1 : 0 });
        vpose(angry[i], { x: ahx - 6, y: ahy - 30, s: es(t, 5.35 + i * 0.05, 5.55 + i * 0.05, ease.back) * 0.85, o: seg(t, 5.35 + i * 0.05, 5.4 + i * 0.05) * (1 - es(t, 6.0, 6.1)) });
      });

      /* v24 — right judgment: the balance glows gold */
      const gold = es(t, 6.3, 6.6);
      vpose(goldGlow, { x: pivot[0], y: pivot[1] + 40, o: gold * 0.9, s: 0.8 + gold * 0.3 });
      const jk = es(t, 6.35, 6.6, ease.out);
      hangAt(judgeT, 800, lerp(-300, 396, jk), T, jk > 0 ? 1 : 0, 1.2, 0.9, 5);

      S.cam.y = 30 - es(t, 3.9, 4.4) * 40;
      S.cam.z = 1.12 - es(t, 3.9, 4.4) * 0.04;
    };
  },
};
