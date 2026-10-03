// Łk 12,54–57 — the plain again, the crowds all round Jesus on the rise. "When you see a cloud rising from the west,
// immediately you say, 'A shower is coming'": over the hills on the left (the sea side) a dark cloud climbs; the people
// turn and point, a bubble with rain in it; "and so it happens": the rain comes down over the plain. "When a south wind
// blows, you say, 'There will be scorching heat'": curls of hot wind and sand blow in from the right, a bubble with a
// blazing sun; "and it happens": the sky goes white-gold, the sun swells, and the people shade their eyes and fan
// themselves. "Hypocrites! You know how to interpret the appearance of the earth and the sky, but how is it that you
// don't interpret this time?": all of them stand gazing up at two weather plates hung over the plain — rain, heat —
// while round Jesus, whom they do not look at, the signs of this time light up: the crutch thrown down, the eyes opened,
// the bread for thousands. "Why don't you judge for yourselves what is right?": a small empty balance comes down in
// front of the crowd, waiting — and one man turns round and looks at Him.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { stormCloud, rain } from '../../assets/things.js';
import { sun } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { windCurl } from '../matthew7/lib.js';
import { crutch } from '../mark3/lib.js';
import { eyeIcon } from '../john6/lib.js';
import { behindOf, plainSet, RISE, DAY, speech, iconTag, balance10, loaf, headAt, voiceRings, manO, halo, warm, PI } from './lib.js';
import { sky } from '../kit.js';

const JX = 800;

export default {
  id: 'lk12-signs',
  beats: [
    { v: 54, text: 'Mówił także do tłumów: «Gdy ujrzycie chmurę podnoszącą się na zachodzie, zaraz mówicie: "Deszcze idzie".' },
    { v: 54, cont: true, text: 'I tak bywa.' },
    { v: 55, text: 'A gdy wiatr wieje z południa, powiadacie: "Będzie upał".' },
    { v: 55, cont: true, text: 'I bywa.' },
    { v: 56 },
    { v: 57 },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [0.98, 1.12] },
  build(S) {
    // phone: the crowd's bubbles, the hot sun, the two plates and the balance all hang further in from the edges
    const PO = S.portrait;
    const P = plainSet(S, { skyCols: DAY, twins: true, near: true });
    const c = S.c;
    const grey = behindOf(sky(S, ['#7d8698', '#aeb3b8', '#d2cdc4'], { name: 'grey', rise: 0 }).layer, P.hangL);
    const hot = behindOf(sky(S, ['#efdcae', '#f6e5bd', '#f9ecd0'], { name: 'hot', rise: 0 }).layer, P.hangL);
    grey.fade(0); hot.fade(0);
    const cloudL = behindOf(S.layer({ par: 0.05, sh: 4 }), P.hangL);
    const cloudEl = cloudL.add(`<g>${stormCloud(c, 420)}</g>`);
    const bigSun = cloudL.add(`<g opacity="0"><circle r="200" fill="url(#warm-glow)"/>${sun(c, 70)}</g>`);
    const rainL = S.layer({ par: 0.3, sh: 0, flat: true, pad: 120 });
    rainL.add(rain(c, { x0: -800, x1: 2400, y0: -200, y1: 900, n: 420, slant: -30 }));
    rainL.fade(0);
    const windL = S.layer({ par: 0.35, sh: 0, flat: true });
    const winds = [0, 1, 2, 3].map((i) => windL.add(`<g opacity="0">${windCurl(c, 200)}</g>`));
    const shimmer = windL.add(`<g opacity="0">${[0, 1, 2, 3, 4].map((i) => `<path d="${c.ribbon(Array.from({ length: 12 }, (_, j) => [300 + i * 220 + Math.sin(j) * 8, 560 - j * 10]), 2)}" fill="#fff4d2" opacity=".6"/>`).join('')}</g>`);
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    /* bubbles of the crowd */
    const rainIcon = `<g transform="translate(0 -4) scale(.16)">${stormCloud(c, 200)}</g><path d="${c.ribbon([[-8, 6], [-11, 14]], 1.6) + c.ribbon([[0, 6], [-3, 14]], 1.6) + c.ribbon([[8, 6], [5, 14]], 1.6)}" fill="${C.lake3}"/>`;
    const sunIcon = `<g transform="scale(.28)">${sun(c, 40)}</g>`;
    const bubR = [0, 1].map((i) => P.fx.add(`<g opacity="0">${speech(c, rainIcon, { w: 62, h: 46, flip: i === 1 })}</g>`));
    const bubS = [0, 1].map((i) => P.fx.add(`<g opacity="0">${speech(c, sunIcon, { w: 62, h: 46, flip: i === 1 })}</g>`));
    /* the weather plates, the signs of this time, the balance */
    const plates = [rainIcon, sunIcon].map((ic, i) => ({ i, el: P.hangL.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-56" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g transform="scale(1.1)">${iconTag(c, `<g transform="scale(2)">${ic}</g>`, '', { r: 46 })}</g></g>`) }));
    const signL = behindOf(S.layer({ par: 0.4, sh: 5 }), P.act);
    const SIGNS = [`<g transform="rotate(-30) scale(.36) translate(0 60)">${crutch(c)}</g>`, `<g transform="scale(1.3)">${eyeIcon(c, true, 16)}</g>`, `<g transform="translate(-10 10)">${loaf(c, 14)}</g><g transform="translate(12 12)">${loaf(c, 12)}</g>`];
    const signs = SIGNS.map((ic, i) => ({ i, a: -PI / 2 + (i - 1) * 0.85, el: signL.add(`<g opacity="0">${warm(60, 0.9)}${iconTag(c, ic, '', { r: 30 })}</g>`) }));
    const B = balance10(c, { arm: 90, drop: 70, pan: 64, col: C.ochre });
    const bal = P.fx.add(`<g transform="translate(0 -1500)"><path d="M0 -80V-2400" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${B.frame}${B.beam}<g transform="translate(-90 0)">${B.panL}</g><g transform="translate(90 0)">${B.panR}</g></g>`);
    const turner = S.puppet(P.act.add(person(c, manO(c, { robe: C.tealRobe, mantle: C.wheatRobe }))));

    return (t, time) => {
      const T = time;
      P.update(T, { sunY: 150 + (es(t, 0.3, 0.8) * (1 - es(t, 2.0, 2.3)) + es(t, 3.0, 3.2) * (1 - es(t, 4.0, 4.3))) * 900 });
      /* v54 — a cloud from the west: "a shower is coming" — and so it happens */
      const ck = es(t, 0.1, 0.7) * (1 - es(t, 1.9, 2.2));
      pose(cloudEl, { x: PO ? lerp(300, 620, ck) : lerp(240, 560, ck), y: lerp(520, 350, ck), s: 0.55 + ck * 0.25, o: ck > 0.01 ? 1 : 0 });
      grey.fade(es(t, 0.4, 0.9) * (1 - es(t, 1.9, 2.2)));
      const rn = es(t, 1.05, 1.3) * (1 - es(t, 1.85, 2.05));
      rainL.fade(rn * 0.9);
      rainL.shift(time ? -((T * 60) % 120) * 0.5 : 0, time ? (T * 240) % 240 : 0);
      const pointW = es(t, 0.35, 0.5) * (1 - es(t, 0.95, 1.05)) + es(t, 2.3, 2.45) * (1 - es(t, 2.95, 3.05));
      const shade_ = es(t, 3.2, 3.4) * (1 - es(t, 3.95, 4.05));
      const gaze = es(t, 4.1, 4.3);
      P.crowd.forEach((g) => {
        const up = Math.max(pointW, shade_, gaze);
        g.sp.set({ x: g.x, y: g.y, s: 1, o: 1 - up });
        g.alt.set({ x: g.x, y: g.y, s: 1, o: up });
      });
      const BUBS = PO ? [[500, 560], [1065, 560]] : [[440, 560], [1160, 560]];
      bubR.forEach((b, i) => { const k = es(t, 0.45 + i * 0.08, 0.6 + i * 0.08, ease.back) * (1 - es(t, 1.0, 1.1)); pose(b, { x: BUBS[i][0], y: BUBS[i][1] - 40, s: k, o: k > 0.01 ? 1 : 0 }); });
      /* v55 — a south wind: "scorching heat" — and it happens */
      winds.forEach((w, i) => {
        const k = time ? ((T * 0.35 + i / 4) % 1) : (i + 0.5) / 4;
        const on = es(t, 2.05, 2.25) * (1 - es(t, 3.9, 4.05));
        pose(w, { x: lerp(1500, 200, k), y: 460 + i * 60, sx: -1, o: on * Math.sin(k * PI) });
      });
      bubS.forEach((b, i) => { const k = es(t, 2.4 + i * 0.08, 2.55 + i * 0.08, ease.back) * (1 - es(t, 3.0, 3.1)); pose(b, { x: BUBS[i][0], y: BUBS[i][1] - 40, s: k, o: k > 0.01 ? 1 : 0 }); });
      const heat = es(t, 3.05, 3.35) * (1 - es(t, 3.95, 4.2));
      hot.fade(heat);
      pose(bigSun, { x: PO ? 960 : 1060, y: 190, s: 0.8 + heat * 0.5 + (time ? Math.sin(T * 2) * 0.02 : 0), r: T * 3, o: heat });
      fade(shimmer, heat * 0.8);
      pose(shimmer, { x: 0, y: time ? Math.sin(T * 3) * 3 : 0, o: heat * 0.8 });
      /* v56 — they read the sky, not this time */
      plates.forEach((p) => {
        const k = es(t, 4.05 + p.i * 0.1, 4.3 + p.i * 0.1, ease.out) * (1 - es(t, 5.05, 5.3, ease.in));
        pose(p.el, { x: p.i ? (PO ? 1010 : 1050) : (PO ? 595 : 560), y: lerp(-1500, 250, k), r: time ? Math.sin(T * 0.8 + p.i) * 1.5 : 0, oy: 0 });
      });
      const [jhx, jhy] = headAt(JX, RISE, P.J.s, false);
      signs.forEach((s) => {
        const k = es(t, 4.3 + s.i * 0.1, 4.5 + s.i * 0.1, ease.back);
        pose(s.el, { x: jhx + Math.cos(s.a) * 120, y: jhy - 30 + Math.sin(s.a) * 110, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const speak = bump(t, 0.05, 0.6) + bump(t, 2.05, 2.5) + es(t, 4.05, 4.3) * (1 - es(t, 5.8, 6.0));
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, armF: 16 + Math.min(1, speak) * 50, armB: 8 + es(t, 4.1, 4.3) * 60 + es(t, 5.1, 5.3) * 40, head: -4, blink: blinkAt(T) });
      voice(jhx, jhy, Math.min(1, speak), T, { spread: 2 });
      P.near.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.94, flip: d.flip, armF: 14, armB: 6, head: -2 - gaze * 4, blink: blinkAt(T, d.seed) }));
      /* v57 — judge for yourselves */
      const bk = es(t, 5.05, 5.35, ease.out);
      pose(bal, { x: PO ? 955 : 1000, y: lerp(-1500, 390, bk), r: time ? Math.sin(T * 0.8) * 1.2 : 0, oy: 0 });
      const turn = es(t, 5.3, 5.45);
      turner.set({ x: PO ? 995 : 1030, y: 716, s: 0.96, flip: turn > 0.5, o: seg(t, 5.18, 5.22), armF: 20 + (1 - turn) * 100, armB: 10 + turn * 40, head: -10 * (1 - turn) + turn * 6, blink: blinkAt(T, 9) });

      S.cam.x = -es(t, 0.1, 0.5) * 30 * (1 - es(t, 1.9, 2.2)) + es(t, 2.05, 2.4) * 30 * (1 - es(t, 4.0, 4.3));
      S.cam.y = -es(t, 0.1, 0.5) * 30 * (1 - es(t, 4.8, 5.0)) + es(t, 5.0, 5.3) * 20;
      S.cam.z = 1.0 + es(t, 4.0, 4.3) * 0.04;
    };
  },
};
