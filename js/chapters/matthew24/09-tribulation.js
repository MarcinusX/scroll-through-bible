// Mt 24,21–22 — night on the Mount, a small lamp in the circle. A line of days is strung across the dark, and it runs
// on and on past them: from the first day of creation (a sun, a green shoot), light days — then dark ones, darker and
// bigger than any before, more and more of them. "If those days had not been shortened, no one would be saved": the
// little lights of people on the hillside grow faint one by one. "But for the sake of the chosen, those days will be
// shortened": a hand of light comes down with scissors and cuts the line; the dark days fall away, a dawn-card hangs
// at the cut, and the lights of the chosen shine out again.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, tint, dayCard, lightHand, scissorsBig, soulLight, handLamp, voiceRings, PI } from './lib.js';

const LX0 = 380, STEP = 70, N = 22, CUT = 15;
const cx = (i) => LX0 + i * STEP;
const lineY = (x) => 236 + Math.sin(((x - LX0) / (STEP * (N - 1))) * PI * 3) * 22;
const SHIFT = (t) => (t < 1 ? lerp(300, 0, es(t, 0, 1, (u) => u)) : lerp(0, -620, es(t, 1, 1.9, ease.out)));

export default {
  id: 'mt24-tribulation',
  beats: [
    { v: 21 },
    { v: 22, text: 'Gdyby ów czas nie został skrócony, nikt by nie ocalał.' },
    { v: 22, cont: true, text: 'Lecz z powodu wybranych ów czas zostanie skrócony.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.44, NIGHTC = mix(C.night, C.duskViolet, 0.3);
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: TK, moonXY: [1240, 110], templeGlow: 0.2 });

    /* the little lights on the hill: people, the chosen */
    const lightL = S.layer({ par: 0.3, sh: 2 });
    const LIGHTS = Array.from({ length: 14 }, (_, i) => ({ i, x: 380 + i * 64 + c.rr(-14, 14), y: 560 + c.rr(-14, 18), chosen: i % 3 === 1, el: lightL.add(`<g transform="translate(0 -1500)">${soulLight(c, 7)}</g>`) }));

    /* the line of days (a sheet that slides past) */
    const lineL = S.layer({ par: 0.24, sh: 5, pad: 900 });
    const ropeD = (x0, x1) => { const pts = []; for (let x = x0; x <= x1; x += 20) pts.push([x, lineY(x)]); return c.ribbon(pts, 2.2); };
    const cutX = cx(CUT) - STEP / 2;
    const rope = lineL.add(`<g transform="translate(0 -1500)"><path d="${ropeD(LX0 - 400, cx(N - 1) + 600)}" fill="${C.rope}"/></g>`);
    const ropeCut = lineL.add(`<g transform="translate(0 -1500)"><path d="${ropeD(LX0 - 400, cutX)}" fill="${C.rope}"/></g>`);
    const creation = `<g transform="translate(0 20)"><circle r="7" fill="${C.sun}"/><path d="${c.poly(c.star(0, 0, 11, 7, 10, 0))}" fill="${C.sunDeep}" opacity=".6"/></g><g transform="translate(0 36)"><path d="${c.cut([[-2, 0], [-1, -10], [1, -10], [2, 0]], 0.2, 3)}" fill="${C.moss}"/><path d="${c.cut([[0, -8], [-9, -13], [-12, -8], [-5, -6]], 0.2, 3) + c.cut([[0, -9], [9, -14], [12, -9], [5, -7]], 0.2, 3)}" fill="${C.leaf}"/></g>`;
    const CARDS = Array.from({ length: N }, (_, i) => {
      const dark = i >= 6;
      const grow = dark ? Math.min(1, (i - 6) / 9) : 0;
      const w = dark ? 36 + grow * 16 : 32, h = dark ? 48 + grow * 22 : 42;
      let inner = tint(dayCard(c, dark, w, h), C.ink, dark ? grow * 0.35 : 0);
      if (i === 0) inner = dayCard(c, false, 38, 50).replace(/<path d="[^"]*" fill="#e9b25f" opacity=".8"\/>/, '') + creation;
      return { i, x: cx(i), dark, el: lineL.add(`<g transform="translate(0 -1500)">${inner}</g>`), seed: c.rr(0, 9), fall: c.rr(-1, 1) };
    });
    const dawnCard = lineL.add(`<g transform="translate(0 -1500)"><circle cy="24" r="60" fill="url(#warm-glow)"/>${dayCard(c, false, 40, 54)}<path d="${c.poly(c.star(0, 28, 13, 5, 8, 0))}" fill="${C.sun}"/></g>`);
    const hand = lineL.add(`<g transform="translate(0 -1500)">${lightHand(c, 0.8)}</g>`);
    const sc = lineL.add(`<g transform="translate(0 -1500)">${scissorsBig(c, 90)}</g>`);
    const bA = sc.querySelector('.bladeA'), bB = sc.querySelector('.bladeB');

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
      pose(flame, { x: 27, y: -12, sy: 1 + (T ? Math.sin(T * 7) * 0.08 : 0) });

      /* the line slides by: creation, the light days, the dark ones (beats 0–1) */
      const sh = SHIFT(t);
      lineL.shift(sh, 0);
      const cutK = es(t, 2.28, 2.36);
      pose(rope, { x: 0, y: 0, o: cutK > 0.5 ? 0 : 1 });
      pose(ropeCut, { x: 0, y: 0, o: cutK > 0.5 ? 1 : 0 });
      CARDS.forEach((cd) => {
        const falls = cd.i >= CUT ? es(t, 2.36 + (cd.i - CUT) * 0.03, 2.8 + (cd.i - CUT) * 0.03, ease.in) : 0;
        const rattle = cd.dark ? (T ? Math.sin(T * 3 + cd.seed) * 4 : 0) * (1 - falls) : (T ? Math.sin(T * 1.2 + cd.seed) * 1.5 : 0);
        pose(cd.el, { x: cd.x + falls * cd.fall * 60, y: lineY(cd.x) - 4 + falls * 700, r: rattle + falls * cd.fall * 200, o: 1 - (cd.i >= CUT ? es(t, 2.7, 2.92) : 0) });
      });
      const dw = es(t, 2.5, 2.75, ease.back);
      const dwx = cutX - 26;
      pose(dawnCard, { x: dwx, y: lineY(dwx) - 4 - (1 - dw) * 60, s: dw, r: T ? Math.sin(T * 1.2) * 2 : 0, o: dw > 0.01 ? 1 : 0 });
      /* the hand of light with the scissors (beat 2) */
      // phone: the hand is gone by the pause, not caught mid-way under the tag
      const hk = es(t, 2.02, 2.25, ease.out) * (1 - (S.portrait ? es(t, 2.45, 2.66) : es(t, 2.55, 2.85)));
      pose(hand, { x: cutX + 40, y: lineY(cutX) - 80 - (1 - hk) * 420, o: hk > 0.01 ? 1 : 0 });
      pose(sc, { x: cutX, y: lineY(cutX) - (1 - hk) * 420, r: 90, o: hk > 0.01 ? 1 : 0 });
      const snip = 1 - bump(t, 2.2, 2.38);
      pose(bA, { r: -18 * snip }); pose(bB, { r: 18 * snip });

      /* the little lights: faint as the dark days go on, bright again for the chosen */
      LIGHTS.forEach((l) => {
        const dim = es(t, 1.05 + l.i * 0.05, 1.55 + l.i * 0.05) * (1 - es(t, 2.4, 2.7) * (l.chosen ? 1 : 0.3));
        const glow = l.chosen ? es(t, 2.45, 2.75) : 0;
        pose(l.el, { x: l.x, y: l.y, s: (0.8 + glow * 0.7) * (1 + (T ? Math.sin(T * 2 + l.i) * 0.05 : 0)), o: 1 - dim * 0.85 });
      });

      /* Jesus: follows the line (0), grieves (1), lifts His hand to the cut (2) */
      const follow = es(t, 0.1, 0.4) * (1 - es(t, 0.95, 1.1));
      const grief = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.05));
      const lift = es(t, 2.05, 2.35);
      J.set({ x: JX, y: JY, s: circ.s, armF: 25 + follow * 80 + lift * 70 + grief * 10, armB: 10 + lift * 90, head: -follow * 10 + grief * 10 - lift * 12 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(JX - 4, JY - 158, Math.max(follow, grief * 0.7, lift * 0.7), T, { s0: 0.7 });
      circ.four.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, lean: m.dir * 3, armF: 20 + lift * 30, head: -12 + grief * 14 - lift * 4, blink: blinkAt(T, m.seed) }));

      S.cam.y = -es(t, -0.2, 0.4) * 40;
      S.cam.z = 1 + es(t, 2.0, 2.4) * 0.04;
    };
  },
};
