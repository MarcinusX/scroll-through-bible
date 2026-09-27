// J 7,37–39 — the last, great day of the feast. By the altar, hung about with willow branches, a priest pours water
// from a golden pitcher into the silver bowl while a Levite sounds the shofar and the crowd waves the lulav.
// Jesus, sitting among the people, stands up and cries out: "If anyone thirsts, let him come to me and drink!"
// Two thirsty pilgrims come with empty cups. "Rivers of living water shall flow from within him": dry, cracked
// ground rises in the foreground; glowing streams pour from Jesus down into it, and it turns green and flowers;
// then little streams flow from the hearts of those who believe. He spoke of the Spirit: a dove of light over them.
// "The Spirit was not yet given, for Jesus was not yet glorified": a thin veil falls before the dove, and a crown of
// light waits, dim, beside an hourglass.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { sprout } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { cup as clayCup } from '../mark2/lib.js';
import { pourStream } from '../john2/lib.js';
import {
  feastCourt, priest, pilgrim, townMan, townWoman, altar, willow, silverBowl, goldPitcher, shofar, headAt, hand, voiceRings, strip, nameTag,
  dove, flapWings, lightCrown, hourglassRig, heart, waterChunks, waterGlowDef, LIVING, GREAT, hangAt, vpose, tr, PI,
} from './lib.js';

const JX = 800;
const ALT = 1096;
const LEFT_TOP = [[-900, 640], [100, 616], [300, 636], [470, 688], [600, 760], [720, 1000]];
const RIGHT_TOP = [[880, 1000], [1000, 760], [1130, 688], [1300, 636], [1500, 616], [2500, 640]];
const topY = (pts, x) => {
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return lerp(y0, y1, (x - x0) / (x1 - x0)); }
  return pts[pts.length - 1][1];
};

export default {
  id: 'j7-rivers',
  beats: [
    { v: 37, text: 'W ostatnim zaś, najbardziej uroczystym dniu święta,' },
    { v: 37, cont: true, text: 'Jezus stojąc zawołał donośnym głosem:' },
    { v: 37, cont: true, text: '«Jeśli ktoś jest spragniony, a wierzy we Mnie - niech przyjdzie do Mnie i pije!' },
    { v: 38 },
    { v: 39, text: 'A powiedział to o Duchu, którego mieli otrzymać wierzący w Niego;' },
    { v: 39, cont: true, text: 'Duch bowiem jeszcze nie był, ponieważ Jezus nie został jeszcze uwielbiony.' },
  ],
  cam: { x: [-40, 160], y: [-60, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = feastCourt(S, { skyCols: GREAT, lit: 0.3 });
    const F = set.F + 20;
    const gid = waterGlowDef(S);

    /* the altar with willows and the silver bowls */
    const AL = S.layer({ par: 0.47, sh: 4 });
    let wl = '';
    [[ALT - 90, 0.22, 220], [ALT - 60, 0.12, 250], [ALT + 60, -0.12, 240], [ALT + 92, -0.22, 210], [ALT - 20, 0.05, 260], [ALT + 24, -0.04, 256]].forEach(([x, l, h]) => { wl += `<g transform="translate(${x} ${F - 4})">${willow(c, h, l)}</g>`; });
    AL.add(wl);
    AL.add(`<g transform="translate(${ALT} ${F - 2})">${altar(c, 160, 96)}</g>`);
    AL.add(`<g transform="translate(${ALT + 44} ${F - 98})">${silverBowl(c, 30)}</g>`);
    const bowlGlow = AL.add(`<g transform="translate(${ALT - 9} ${F - 110})"><circle r="40" fill="url(#${gid})"/></g>`);
    AL.add(`<g transform="translate(${ALT - 9} ${F - 98})">${silverBowl(c, 36)}</g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const CX = [370, 440, 510, 580];
    const crowd = CX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(pilgrim(c, i + 2, { lulavA: 110 }))) }));
    const PRX = ALT - 120;
    const pr = S.puppet(P.add(priest(c, 2)));
    const pitcher = P.add(`<g>${goldPitcher(c)}</g>`);
    const pour = P.add(`<g>${pourStream(c, LIVING, 56)}</g>`);
    const lev = S.puppet(P.add(person(c, { robe: C.linen, mantle: C.skyVeil, belt: C.ochre, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'short', skin: C.skin3, holdF: `<g transform="rotate(100) translate(-4 -10) rotate(-120)">${shofar(c)}</g>` })));
    const TA = { x0: 610, x1: 660 }, TB = { x0: 990, x1: 948 };
    const thirstA = S.puppet(P.add(person(c, { ...townWoman(c), robe: C.roseRobe, holdF: `<g transform="rotate(70) translate(0 -4)">${clayCup(c)}</g>` })));
    const thirstB = S.puppet(P.add(person(c, { ...townMan(c), robe: C.tealRobe, hair: C.greyHair, beard: 'full', beardColor: C.greyHair, holdF: `<g transform="rotate(70) translate(0 -4)">${clayCup(c)}</g>` })));
    const jSit = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 4, r: 34, w: 6, color: shade(C.ochre, 0.3) });

    /* the streams of living water (in front of the people) */
    const W = S.layer({ par: 0.5, sh: 0, flat: true });
    const srcGlow = W.add(`<g><circle r="80" fill="url(#${gid})"/></g>`);
    const mk = (pts, n, w) => { const r = waterChunks(c, pts, n, w, gid); return { ...r, els: r.chunks.map((ch) => W.add(`<g>${ch.markup}</g>`)) }; };
    const sL = mk([[800, 560], [760, 590], [690, 626], [600, 652], [500, 670], [420, 676], [340, 664]], 10, [14, 26]);
    const sR = mk([[812, 560], [852, 592], [930, 628], [1020, 656], [1110, 676], [1200, 680], [1280, 664]], 10, [14, 26]);
    const bA = mk([[668, 566], [630, 604], [580, 640], [520, 666], [470, 680]], 5, [8, 16]);
    const bB = mk([[942, 566], [980, 604], [1040, 642], [1100, 668], [1150, 682]], 5, [8, 16]);
    const drops = Array.from({ length: 10 }, (_, i) => ({ i, el: W.add(`<g><circle r="6" fill="#f2fdff"/><circle r="14" fill="url(#${gid})"/></g>`) }));
    const heartA = W.add(`<g>${heart(c, 10, C.jesusMantle)}</g>`), heartB = W.add(`<g>${heart(c, 10, C.jesusMantle)}</g>`);

    /* the dry ground that rises and blooms */
    const dryL = S.layer({ par: 0.62, sh: 6, pad: 360 });
    const greenL = S.layer({ par: 0.62, sh: 0, flat: true, pad: 360 });
    const mound = (top) => c.cut([...top, [top[top.length - 1][0], 1800], [top[0][0], 1800]], 1.2, 10);
    const cracks = (x0, x1, pts) => { let d = ''; for (let i = 0; i < 16; i++) { const x = c.rr(x0, x1), y = topY(pts, x) + c.rr(30, 200); let p = [[x, y]]; for (let k = 0; k < 3; k++) p.push([p[k][0] + c.rr(-26, 26), p[k][1] + c.rr(10, 24)]); d += c.ribbon(p, 2.2); } return d; };
    const dry = sheet();
    dry.p(mound(LEFT_TOP) + mound(RIGHT_TOP), mix(C.dune, C.sand2, 0.4));
    dry.x(cracks(-200, 560, LEFT_TOP) + cracks(1040, 1800, RIGHT_TOP), shade(C.dune, -0.3), 'opacity=".55"');
    let stones = '';
    for (let i = 0; i < 12; i++) { const x = c.rr(-200, 1800); if (x > 620 && x < 980) continue; const y = topY(x < 800 ? LEFT_TOP : RIGHT_TOP, x) + c.rr(20, 80); stones += c.cut(c.blob(x, y, c.rr(8, 16), c.rr(5, 9), 8, 0.2), 0.4, 3); }
    dry.p(stones, C.rock2);
    dryL.add(dry.out());
    const green = sheet();
    green.p(mound(LEFT_TOP) + mound(RIGHT_TOP), mix(C.sage, C.leaf, 0.35));
    let gr = '';
    for (let i = 0; i < 70; i++) { const x = c.rr(-400, 2000); if (x > 600 && x < 1000) continue; const pts = x < 800 ? LEFT_TOP : RIGHT_TOP, y = topY(pts, x) + 3; for (let k = 0; k < 4; k++) { const bx = x + k * 3; gr += c.poly([[bx - 1.6, y], [bx + c.rr(-6, 6), y - c.rr(10, 22)], [bx + 1.6, y]]); } }
    green.p(gr, C.moss);
    greenL.add(green.out());
    greenL.fade(0);
    const blooms = [];
    const bloomXs = [80, 170, 250, 330, 400, 470, 540, 1060, 1130, 1210, 1290, 1370, 1450, 1530];
    bloomXs.forEach((x, i) => {
      const pts = x < 800 ? LEFT_TOP : RIGHT_TOP, y = topY(pts, x) + 4;
      const col = [C.jesusMantle, C.lavender, C.cream, C.wheat, C.roseRobe][i % 5];
      const el = greenL.add(`<g transform="translate(${x} ${y})">${sprout(c, { h: 26 + (i % 3) * 8 })}<g transform="translate(0 ${-30 - (i % 3) * 8})">${sheet().p(c.cut(c.star(0, 0, 9, 4, 5, i), 0.2, 3), col).x(c.poly(c.circ(0, 0, 3, 6)), C.sun).out()}</g></g>`);
      blooms.push({ el, x, y, i, d: Math.abs(x - 800) });
    });

    set.front();

    /* words and the Spirit */
    const X = S.layer({ par: 0.5, sh: 6 });
    const dayT = hanging(X, nameTag(c, tr(['ostatni, wielki', 'dzień święta'], ['the last, great', 'day of the feast']), { size: 18 }), { x: 1000, y: 300, len: 600 });
    const cryT = X.add(`<g>${strip(c, tr('Kto spragniony — niech przyjdzie do Mnie i pije!', 'If anyone is thirsty — come to me and drink!'), { size: 18 })}</g>`);
    const riversT = X.add(`<g>${strip(c, tr('strumienie wody żywej', 'rivers of living water'), { size: 20 })}</g>`);
    const doveGlow = X.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    const doveEl = X.add(`<g>${dove(c)}</g>`);
    const spiritT = X.add(`<g>${strip(c, tr('o Duchu', 'about the Spirit'), { size: 18 })}</g>`);
    const veil = X.add(`<g>${sheet().p(c.cut([[-110, 0], [110, 0], [106, 200], [50, 192], [0, 204], [-50, 192], [-108, 200]], 0.8, 8), mix(C.cream, C.skyBlue, 0.3)).out()}</g>`);
    const crownEl = X.add(`<g>${lightCrown(c, 46)}</g>`);
    const hg = hourglassRig(X, c, 80);
    const notYetT = X.add(`<g>${strip(c, tr('jeszcze nie uwielbiony', 'not yet glorified'), { size: 17 })}</g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.35 });

      /* v37a — the water-libation at the altar, the shofar, the waving lulav */
      const pourK = es(t, 0.15, 0.4) * (1 - es(t, 1.2, 1.4));
      const armP = 20 + pourK * 95;
      const away = es(t, 1.3, 1.8, ease.sine);
      pr.set({ x: PRX + away * 150, y: F - away * 34, s: 1 - away * 0.1, flip: away > 0 && away < 1, walk: away > 0 && away < 1 ? away * 12 : undefined, armF: armP, armB: 10, head: -pourK * 6, blink: blinkAt(T, 2) });
      const [phx, phy] = hand(PRX + away * 150, F - away * 34, 1 - away * 0.1, false, armP);
      fade(pitcher, 1 - away);
      const tilt = es(t, 0.3, 0.5) * 70 * (1 - es(t, 1.2, 1.4));
      pose(pitcher, { x: phx, y: phy + 4, r: tilt });
      const flow = es(t, 0.45, 0.55) * (1 - es(t, 1.1, 1.25));
      vpose(pour, { x: ALT - 9, y: F - 150, sy: flow, o: flow > 0.01 ? 1 : 0 });
      fade(bowlGlow, flow);
      const blow = bump(t, 0.2, 1.4);
      lev.set({ x: ALT + 110 + away * 200, y: F + 6, walk: away > 0 && away < 1 ? away * 12 : undefined, s: 0.94, flip: true, armF: 20 + blow * 80, armB: 10 + blow * 40, head: -blow * 6, blink: blinkAt(T, 5) });
      crowd.forEach((m) => {
        const wave = Math.sin(seg(t, 0, 1.4) * PI * 4 + m.i) * 20 * bump(t, 0, 1.4);
        m.p.set({ x: m.x, y: F - 4 + (m.i % 2) * 6, s: 0.92, armF: 110 + wave - es(t, 1.4, 1.6) * 40, armB: 14, head: -bump(t, 1.0, 3.0) * 6, blink: blinkAt(T, m.seed) });
      });
      const dk = es(t, 0.1, 0.35, ease.out), du = es(t, 0.95, 1.1, ease.in);
      hangAt(dayT, 1000, lerp(-300, 330, dk) - du * 700, T, dk > 0 && du < 1 ? 1 : 0, 1.3, 0.9, 1);

      /* v37b — Jesus stands and cries out */
      const stand = es(t, 1.1, 1.18);
      const open = es(t, 1.3, 1.6);
      const give = es(t, 3.05, 3.3);
      jSit.set({ x: JX - 6, y: F + 8, s: 1.04, o: 1 - stand, armF: 20, armB: 10, head: -4, blink: blinkAt(T, 1) });
      jesus.set({ x: JX, y: F, s: 1.06, o: stand, armF: 30 + open * 60 - give * 10, armB: 20 + open * 80 - give * 20, head: -open * 8 + give * 6, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(JX, F, 1.06, false);
      voice(hx, hy + 4, bump(t, 1.2, 2.95) * 1.2, T, { spread: 3.2, speed: 0.6 });

      /* v37c — the thirsty come with empty cups */
      const come = es(t, 2.1, 2.6, ease.sine);
      const drink = es(t, 3.4, 3.7);
      const ax = lerp(TA.x0, TA.x1, come), bx = lerp(TB.x0, TB.x1, come);
      thirstA.set({ x: ax, y: F + 12, s: 0.95, walk: come > 0 && come < 1 ? ax * 0.06 : undefined, armF: 30 + come * 40 + drink * 20, armB: 10, head: -come * 6 + drink * 4, blink: blinkAt(T, 3) });
      thirstB.set({ x: bx, y: F + 14, s: 0.95, flip: true, walk: come > 0 && come < 1 ? bx * 0.06 : undefined, armF: 30 + come * 40 + drink * 20, armB: 10, head: -come * 6 + drink * 4, blink: blinkAt(T, 4) });
      vpose(cryT, { x: 800, y: 330, o: es(t, 2.2, 2.35) * (1 - es(t, 2.95, 3.05)) });

      /* v38 — the dry ground rises; rivers of living water; it blooms */
      const rise = es(t, 2.9, 3.25, ease.out);
      dryL.shift(0, (1 - rise) * 360);
      greenL.shift(0, (1 - rise) * 360);
      const run = seg(t, 3.15, 3.7);
      vpose(srcGlow, { x: 806, y: 560, s: 0.6 + es(t, 3.1, 3.3) * 0.6 + Math.sin(T * 2) * 0.04, o: es(t, 3.1, 3.3) * (1 - es(t, 5.3, 5.8) * 0.5) });
      [sL, sR].forEach((s) => s.els.forEach((el, k) => fade(el, es(run, k / 10, (k + 1) / 10))));
      const bl = es(t, 3.55, 3.85);
      greenL.fade(bl);
      blooms.forEach((b) => {
        const k = es(t, 3.5 + b.d / 3000, 3.72 + b.d / 3000, ease.back);
        if (k > 0) pose(b.el, { x: b.x, y: b.y, s: k, o: 1 }); else fade(b.el, 0);
      });
      const hk = es(t, 3.62, 3.75, ease.back);
      const [ahx, ahy] = headAt(TA.x1, F + 12, 0.95, false), [bhx, bhy] = headAt(TB.x1, F + 14, 0.95, true);
      vpose(heartA, { x: ahx + 4, y: ahy + 58, s: hk, o: seg(t, 3.62, 3.66) });
      vpose(heartB, { x: bhx - 4, y: bhy + 58, s: hk, o: seg(t, 3.62, 3.66) });
      const brun = seg(t, 3.68, 3.95);
      [bA, bB].forEach((s) => s.els.forEach((el, k) => fade(el, es(brun, k / 5, (k + 1) / 5))));
      drops.forEach((d) => {
        const s = d.i % 2 ? sR : sL;
        const u = time ? ((time * 0.35 + d.i / 10) % 1) : d.i / 10;
        const [x, y] = s.at(u);
        vpose(d.el, { x, y: y - 4, o: run >= 1 ? Math.sin(u * PI) * 0.9 : 0 });
      });
      vpose(riversT, { x: 800, y: 420, o: es(t, 3.4, 3.55) * (1 - es(t, 3.95, 4.05)) });

      /* v39a — the Spirit whom believers were to receive */
      const sp = es(t, 4.05, 4.4, ease.out);
      const dy = lerp(-200, 300, sp) + Math.sin(T * 1.2) * 6;
      vpose(doveEl, { x: 800, y: dy, s: 1.2, o: sp > 0 ? 1 - es(t, 5.2, 5.5) * 0.55 : 0 });
      if (sp > 0) flapWings(doveEl, T, 26, 5);
      vpose(doveGlow, { x: 800, y: dy - 10, o: sp * (1 - es(t, 5.2, 5.5) * 0.7) });
      vpose(spiritT, { x: 800, y: 380, o: es(t, 4.3, 4.45) * (1 - es(t, 4.95, 5.05)) });

      /* v39b — not yet given: a veil before the dove; the crown of glory waits, dim */
      const vk = es(t, 5.1, 5.4, ease.out);
      vpose(veil, { x: 800, y: lerp(-300, 214, vk), o: vk > 0 ? 0.72 : 0 });
      const ck = es(t, 5.3, 5.55, ease.out);
      vpose(crownEl, { x: 1040, y: lerp(-200, 300, ck), o: ck > 0 ? 0.5 + Math.sin(T * 1.5) * 0.05 : 0 });
      W.fade(1 - es(t, 5.2, 5.5) * 0.35);
      if (ck > 0) pose(hg.el, { x: 560, y: lerp(-200, 330, ck), r: Math.sin(T * 0.9) * 1.2, o: 1 }); else fade(hg.el, 0);
      hg.set(0.55, 1);
      vpose(notYetT, { x: 1040, y: 370, o: seg(t, 5.5, 5.6) });

      S.cam.x = lerp(150, 0, es(t, 0.9, 1.5)) + 0;
      S.cam.y = 30 + es(t, 2.9, 3.4) * 20 - es(t, 4.0, 4.4) * 50;
      S.cam.z = lerp(1.14, 1.08, es(t, 0.9, 1.5)) - es(t, 2.9, 3.4) * 0.04;
    };
  },
};
