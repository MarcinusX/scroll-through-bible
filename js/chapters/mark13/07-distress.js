// Mk 13,19–23 — night on the Mount, a small lamp in the circle. A line of days is strung across the dark:
// from the first day of creation, light days — then dark ones, darker than any before. The dark days keep
// coming and the little lights on the hill grow faint; then a hand of light cuts the line short and the
// lights of the chosen shine again. Signposts shout "here!" and "there!"; masked prophets make glittering
// wonders. "Be on your guard!" — and a scroll unrolls with everything he has told them.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix, attr } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { olivesSet, circle, SKIES, JX, JY, tint, dayCard, lightHand, scissorsBig, soulLight, pointer, mask, addToHead, sparkle, voiceRings, handLamp, ashlar, emptyBowl, crownIcon, banner, dove, shoot, flake, globe, hourglass, PI } from './lib.js';

const LX0 = 520, LX1 = 1150, LY = 206, N = 15, CUT = 10;

export default {
  id: 'm13-distress',
  beats: [
    { v: 19 },
    { v: 20, text: 'I gdyby Pan nie skrócił owych dni, nikt by nie ocalał.' },
    { v: 20, cont: true, text: 'Ale skróci te dni z powodu wybranych, których sobie obrał.' },
    { v: 21 },
    { v: 22 },
    { v: 23, text: 'Wy przeto uważajcie!' },
    { v: 23, cont: true, text: 'Wszystko wam przepowiedziałem.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    // phone: the line of days, the signposts, the prophets and the scroll closed up inside the screen;
    // the line flown well out of sight
    const PH = S.portrait;
    const L0 = PH ? 470 : LX0, L1 = PH ? 1060 : LX1;
    const lineY = (x) => LY + Math.sin(((x - L0) / (L1 - L0)) * PI) * 46;
    const GONE = PH ? 900 : 500, SSc = PH ? 0.84 : 1;
    const TK = 0.42, NIGHTC = mix(C.night, C.duskViolet, 0.3);
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: NIGHTC, tintK: TK, moonXY: [1220, 120], templeGlow: 0.25 });

    /* the little lights on the hill: people, the chosen */
    const lightL = S.layer({ par: 0.3, sh: 2 });
    const LIGHTS = Array.from({ length: 13 }, (_, i) => ({ i, x: 400 + i * 66 + c.rr(-14, 14), y: 560 + c.rr(-14, 18), chosen: i % 3 === 1, el: lightL.add(`<g>${soulLight(c, 7)}</g>`) }));

    /* the line of days */
    const lineL = S.layer({ par: 0.24, sh: 5 });
    const ropeD = (x1) => { const pts = []; for (let x = L0 - 60; x <= x1; x += 20) pts.push([x, lineY(x)]); return c.ribbon(pts, 2.2); };
    const rope = lineL.add(`<g><path d="M${L0 - 60} ${lineY(L0 - 60)}L${L0 - 60} -1500M${L1 + 60} ${lineY(L1 + 60)}L${L1 + 60} -1500" stroke="rgba(240,225,200,.35)" stroke-width="1.2"/><path d="${ropeD(L1 + 60)}" fill="${C.rope}"/></g>`);
    const ropeCut = lineL.add(`<g><path d="${ropeD(L0 + ((CUT - 0.5) / (N - 1)) * (L1 - L0))}" fill="${C.rope}"/></g>`);
    const creation = `<g transform="translate(0 20)"><circle r="7" fill="${C.sun}"/><path d="${c.poly(c.star(0, 0, 11, 7, 10, 0))}" fill="${C.sunDeep}" opacity=".6"/></g><g transform="translate(0 34)"><path d="${c.cut(c.ell(0, 0, 12, 4, 10), 0.2, 3)}" fill="${C.moss}"/></g>`;
    const CARDS = Array.from({ length: N }, (_, i) => {
      const dark = i >= 6;
      const x = lerp(L0, L1, i / (N - 1));
      const w = dark ? 40 : 32, h = dark ? 54 : 42;
      let inner = dayCard(c, dark, w, h);
      if (i === 0) inner = dayCard(c, false, 38, 50).replace(/<path d="[^"]*" fill="#e9b25f" opacity=".8"\/>/, '') + creation;
      return { i, x, dark, el: lineL.add(`<g>${inner}</g>`), seed: c.rr(0, 9), fall: c.rr(-1, 1) };
    });
    const dawnCard = lineL.add(`<g><circle cy="24" r="50" fill="url(#warm-glow)"/>${dayCard(c, false, 38, 50)}<path d="${c.poly(c.star(0, 26, 12, 5, 8, 0))}" fill="${C.sun}"/></g>`);
    const hand = lineL.add(`<g>${lightHand(c, 0.8)}</g>`);
    const sc = lineL.add(`<g>${scissorsBig(c, 90)}</g>`);
    const bA = sc.querySelector('.bladeA'), bB = sc.querySelector('.bladeB');

    /* the circle and the lamp */
    const P = S.layer({ par: 0.55, sh: 5 });
    const lampEl = P.add(`<g>${handLamp(c, { glowR: 170 })}</g>`);
    const circ = circle(S, P, { tintCol: NIGHTC, tintK: 0.18 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });

    /* "here!" — "there!"; masked prophets with their glitter */
    const fx = S.layer({ par: 0.4, sh: 5 });
    const posts = [
      { x: PH ? 610 : 470, dir: -1, text: tr('Oto tu!', 'Look, here!') },
      { x: PH ? 980 : 1130, dir: 1, text: tr('Oto tam!', 'Look, there!') },
    ].map((p, i) => ({ ...p, i, el: fx.add(`<g>${pointer(c, p.text, { dir: p.dir, size: 20, col: C.ochre })}</g>`) }));
    const PROPH = [[C.plumRobe, C.sun, 520], [C.indigo, C.halo, 1080], [C.terracotta, C.sun, 620], [C.teal2, C.halo, 980]].map(([robe, gold, x], i) => ({
      i, x: PH ? 800 + (x - 800) * 0.84 : x, p: S.puppet(fx.add(addToHead(person(c, { robe, mantle: gold, hairStyle: 'wrap', veil: robe, veil2: gold, beard: 'none', skin: C.skin2, belt: gold }), `<g transform="translate(6 0)">${mask(c, { col: gold, r: 22, stick: false })}</g>`))),
      bursts: [0, 1, 2].map((k) => fx.add(`<g>${sparkle(c, 16, k % 2 ? C.halo : C.star)}</g>`)),
    }));

    /* the scroll of all that he foretold */
    const scL = S.layer({ par: 0.3, sh: 6 });
    const SW = 620, SH = 120;
    const icons = [
      `<g transform="translate(-14 -14) scale(.3)">${ashlar(c, 90, 50)}</g><g transform="translate(-4 4) rotate(20) scale(.3)">${ashlar(c, 70, 44)}</g>`,
      `<g transform="scale(.8)">${mask(c, { r: 16, stick: false })}</g>`,
      `<g transform="translate(-10 14)">${banner(c, C.terracotta, { h: 34, w: 18 })}</g><g transform="translate(10 14)">${banner(c, C.teal2, { h: 30, w: 16 })}</g>`,
      `<path d="${c.ribbon([[-20, -8], [-8, 2], [0, -6], [10, 6], [20, -2]], 3)}" fill="${C.soilDark}"/><g transform="translate(0 16)">${emptyBowl(c, 30)}</g>`,
      `<g transform="translate(0 12)">${crownIcon(c, 30)}</g>`,
      `<g transform="scale(.42)">${globe(c, 50)}</g>`,
      `<g transform="translate(-10 6) scale(.55)">${dove(c)}</g>`,
      `<path d="${c.cut([[-16, 16], [0, -18], [16, 16]], 0.4, 4)}" fill="${C.rock2}"/>`,
      `<g transform="scale(1.4)">${flake(c, 8)}</g>`,
      `<g transform="scale(.3)">${hourglass(c, 80)}</g>`,
    ];
    const paper = sheet().p(c.cut(c.rect(-SW / 2, 0, SW, SH), 0.5, 10), C.parchment).x(c.ribbon([[-SW / 2 + 14, 12], [SW / 2 - 14, 12]], 1.2) + c.ribbon([[-SW / 2 + 14, SH - 12], [SW / 2 - 14, SH - 12]], 1.2), C.terracotta, 'opacity=".4"').out();
    const rod = sheet().p(c.cut(c.rect(-8, -10, 16, SH + 20), 0.3, 6), C.wood2).p(c.cut(c.ell(0, -14, 7, 6, 10), 0.2, 3) + c.cut(c.ell(0, SH + 14, 7, 6, 10), 0.2, 3), C.wood).out();
    const scrollPaper = scL.add(`<g>${paper}${icons.map((ic, i) => `<g transform="translate(${-SW / 2 + 40 + i * ((SW - 80) / 9)} ${SH / 2})">${ic}</g>`).join('')}</g>`);
    const rodL = scL.add(`<g>${rod}</g>`), rodR = scL.add(`<g>${rod}</g>`);
    const SX = 800, SY = 206;

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 700, sunO: 0, moon: 120, moonO: 1, glow: 0.2, starsO: 1 });

      /* the line of days: creation, light days, then the dark ones (beat 0), more dark ones (beat 1) */
      const ropeOn = es(t, -0.3, 0.1);
      const cutK = es(t, 2.3, 2.4);
      const gone = es(t, 3.0, 3.3);
      pose(rope, { x: 0, y: -(1 - ropeOn) * 400 - gone * GONE, o: cutK > 0.5 ? 0 : 1 });
      pose(ropeCut, { x: 0, y: -(1 - ropeOn) * 400 - gone * GONE, o: cutK > 0.5 ? 1 : 0 });
      CARDS.forEach((cd) => {
        const at = cd.i < 6 ? 0.05 + cd.i * 0.06 : cd.i < 10 ? 0.5 + (cd.i - 6) * 0.1 : 1.1 + (cd.i - 10) * 0.12;
        const k = es(t, at, at + 0.2, ease.back);
        const falls = cd.i >= CUT ? es(t, 2.4 + (cd.i - CUT) * 0.03, 2.9 + (cd.i - CUT) * 0.03, ease.in) : 0;
        const rattle = cd.dark ? Math.sin(T * 3 + cd.seed) * 4 * (1 - falls) : Math.sin(T * 1.2 + cd.seed) * 1.5;
        pose(cd.el, { x: cd.x + falls * cd.fall * 60, y: lineY(cd.x) - 4 - (1 - k) * 60 + falls * 700 - gone * GONE, r: rattle + falls * cd.fall * 200, s: k, o: k > 0.01 ? 1 - (cd.i >= CUT ? es(t, 2.75, 2.95) : 0) : 0 });
      });
      const dw = es(t, 2.55, 2.8, ease.back);
      const dwx = lerp(L0, L1, CUT / (N - 1)) - 22;
      pose(dawnCard, { x: dwx, y: lineY(dwx) - 4 - (1 - dw) * 60 - gone * GONE, s: dw, r: Math.sin(T * 1.2) * 2, o: dw > 0.01 ? 1 : 0 });
      // the hand of light with the scissors (beat 2)
      const hk = es(t, 2.0, 2.3, ease.out) * (1 - es(t, 2.6, 2.9));
      const cx = lerp(L0, L1, (CUT - 0.5) / (N - 1));
      pose(hand, { x: cx + 40, y: lineY(cx) - 80 - (1 - hk) * 400, o: hk > 0.01 ? 1 : 0 });
      pose(sc, { x: cx, y: lineY(cx) - (1 - hk) * 400, r: 90, o: hk > 0.01 ? 1 : 0 });
      const snip = 1 - bump(t, 2.22, 2.42);
      pose(bA, { r: -18 * snip }); pose(bB, { r: 18 * snip });

      /* the little lights: faint while the dark days go on, bright again for the chosen */
      LIGHTS.forEach((l) => {
        const dim = es(t, 1.1 + l.i * 0.04, 1.6 + l.i * 0.04) * (1 - es(t, 2.4, 2.7));
        const glow = l.chosen ? es(t, 2.5, 2.8) : 0;
        pose(l.el, { x: l.x, y: l.y, s: (0.8 + glow * 0.6) * (1 + Math.sin(T * 2 + l.i) * 0.05), o: (1 - dim * 0.8) * (1 - es(t, 5.0, 5.3) * 0.5) });
      });

      /* "here!" — "there!" (beat 3) */
      posts.forEach((p) => {
        const k = es(t, 3.05 + p.i * 0.15, 3.3 + p.i * 0.15, ease.back) * (1 - es(t, 3.85, 4.05));
        pose(p.el, { x: p.x, y: 610 + (1 - k) * 200, r: p.dir * Math.sin(T * 5) * 2 * k, s: 0.9, o: k > 0.01 ? 1 : 0 });
      });
      /* masked prophets with glittering wonders (beat 4) */
      PROPH.forEach((m) => {
        const k = es(t, 4.02 + m.i * 0.08, 4.3 + m.i * 0.08, ease.out) * (1 - es(t, 4.9, 5.15));
        const flip = m.x > 800;
        m.p.set({ x: m.x, y: 600 + (1 - k) * 160, s: 0.62, flip, armB: 150 * k, armF: 60 + Math.sin(T * 3 + m.i) * 20, o: k > 0.01 ? 1 : 0 });
        m.bursts.forEach((b, j) => {
          const ph = T ? (T * 0.9 + j / 3 + m.i * 0.2) % 1 : (j + 0.5) / 3;
          pose(b, { x: m.x + (flip ? -1 : 1) * (30 + j * 18) + Math.sin(j * 2 + m.i) * 20, y: 470 - ph * 60 - j * 12, s: (0.4 + ph) * k, r: T * 60 + j * 30, o: k * (1 - ph) });
        });
      });

      /* the scroll unrolls (beat 6) */
      const un = es(t, 6.05, 6.55);
      const sIn = es(t, 5.95, 6.15);
      const sy = lerp(-300, SY, sIn);
      pose(scrollPaper, { x: SX, y: sy, s: SSc, sx: Math.max(0.001, un), o: sIn > 0.01 ? 1 : 0 });
      pose(rodL, { x: SX - (SW / 2) * un * SSc - 6, y: sy, s: SSc, o: sIn > 0.01 ? 1 : 0 });
      pose(rodR, { x: SX + (SW / 2) * un * SSc + 6, y: sy, s: SSc, o: sIn > 0.01 ? 1 : 0 });

      /* the lamp in the circle */
      pose(lampEl, { x: 734, y: 712, s: 1 });
      pose(lampEl.querySelector('.flame'), { x: 27, y: -12, sy: 1 + Math.sin(T * 7) * 0.08, sx: 1 + Math.sin(T * 5) * 0.05 });

      /* Jesus: points to the line, to the cut; shakes his head at the signposts; warns; shows the scroll */
      const point = es(t, 0.1, 0.4) * (1 - es(t, 1.9, 2.1));
      const lift = es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.1));
      const no = es(t, 3.4, 3.6) * (1 - es(t, 4.9, 5.05));
      const warn = es(t, 5.02, 5.25) * (1 - es(t, 5.9, 6.05));
      const show = es(t, 6.05, 6.35);
      J.set({ x: JX, y: JY, s: circ.s, armF: 25 + point * 80 + lift * 90 + no * 50 + show * 70, armB: 10 + warn * 155 + no * 10, head: -point * 8 - lift * 10 + Math.sin(T * 3) * 5 * no * (t > 3.5 && t < 3.9 ? 1 : 0) + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      voice(JX - 4, JY - 158, Math.max(warn, no * 0.6), T, { s0: 0.7 });

      circ.four.forEach((m) => {
        const look = es(t, 3.1, 3.3) * (1 - es(t, 3.6, 3.8));
        const alert = es(t, 5.05, 5.3);
        const lookSide = (m.i % 2 ? 1 : -1) * look;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: look > 0.5 ? (lookSide > 0 ? false : true) : m.flip, lean: m.dir * (3 - alert * 2), armF: 20 + look * 50 + alert * 10, head: -8 - alert * 6 - es(t, 0.2, 0.6) * 8 * (1 - es(t, 2.8, 3)), blink: blinkAt(T, m.seed) });
      });

      S.cam.y = -es(t, -0.2, 0.4) * 40 * (1 - es(t, 2.9, 3.3)) - es(t, 5.9, 6.4) * 20;
      S.cam.z = 1 + es(t, 5.0, 5.4) * 0.05;
    };
  },
};
