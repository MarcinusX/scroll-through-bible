// J 10,34–36 — the same portico at dusk, stones still in their hands. "Is it not written in your Law" — a great
// scroll comes down from the flies and unrolls; "I said, you are gods" — the words of Psalm 82 appear on it. "If it
// calls them gods to whom the word of God came" — small figures of the judges appear on the scroll, a thread of
// light coming down to each. "And the Scripture cannot be broken" — a golden border runs all round the scroll and
// a seal is set on it. "Do you say of Him whom the Father consecrated and sent into the world, 'You blaspheme'" —
// the scroll rolls up; a beam falls on Jesus from above, a path of light runs down to a little globe of the world;
// a dark bubble: "You blaspheme!". "Because I said, 'I am the Son of God'" — His hand on His heart, a golden card.
import { C, person, blinkAt, pose, lerp, shade, mix, sheet } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import {
  winterPortico, JESUS, leader, cast, mood, voiceRings, verseScroll, stone, bubble, globe, word, beamGrad, lightBeam, sealedScroll, hand,
  kf, vis, tr, WINTER_DUSK, WINTER_NIGHT, FONT, PI,
} from './lib.js';

const F = 704;
const LEAD = [[560, 704, 1.02, false, 0], [636, 670, 0.92, true, 1], [482, 724, 1.04, false, 2], [1040, 704, 1.02, false, 3], [964, 670, 0.92, true, 4], [1118, 726, 1.04, false, 5]];
const SW = 440;

export default {
  id: 'j10-gods',
  beats: [
    { v: 34, text: 'Odpowiedział im Jezus: «Czyż nie napisano w waszym Prawie:' },
    { v: 34, cont: true, text: 'Ja rzekłem: Bogami jesteście?' },
    { v: 35, text: 'Jeżeli [Pismo] nazywa bogami tych, do których skierowano słowo Boże -' },
    { v: 35, cont: true, text: 'a Pisma nie można odrzucić -' },
    { v: 36, text: 'to jakżeż wy o Tym, którego Ojciec poświęcił i posłał na świat, mówicie: "Bluźnisz",' },
    { v: 36, cont: true, text: 'dlatego że powiedziałem: "Jestem Synem Bożym?"' },
  ],
  cam: { x: [-60, 60], y: [-160, 40], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const W = winterPortico(S, { skyCols: WINTER_DUSK, FLOOR: F, veil: 0.12 });
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.54, sh: 6 });
    const leads = LEAD.map(([x, y, s, b, li], i) => ({ ...cast(S, b ? back : act, [{ look: leader(li), x, y, s, face: true }], 'gd' + i)[0], i, bk: b }));
    const stones = leads.map(() => act.add(`<g>${stone(c, 13, mix(C.rock2, C.rock3, 0.3))}</g>`));
    // the beam from above and the sent-into-the-world path
    const bid = beamGrad(S, 'gods-beam');
    const beamL = S.layer({ par: 0.5, sh: 0, flat: true });
    const beam = beamL.add(`<g>${lightBeam(bid, 50, 200, 560)}</g>`);
    const jesus = S.puppet(act.add(person(c, JESUS)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: true, color: shade(C.halo, -0.05) });
    // the scroll: sheet, rods, words, judges, border, seal
    const vs = verseScroll(c, [tr('Ja rzekłem:', 'I said,'), tr('Bogami jesteście', 'you are gods')], { w: SW, size: 34, title: tr('PSALM 82', 'PSALM 82') });
    const SH = vs.h + 70;
    const clip = S.id('gods-clip');
    S.defs(`<clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect x="${-SW / 2 - 30}" y="0" width="${SW + 60}" height="${SH}"/></clipPath>`);
    const judges = [-120, 0, 120].map((x) => `<g transform="translate(${x} ${vs.h + 56}) scale(.34)">${person(c, { robe: C.stone2, mantle: C.dustyBlue, hairStyle: 'wrap', veil: C.linen, beard: 'full', hair: C.greyHair, skin: C.skin2 })}</g>`);
    const sheetM = verseScroll(c, [tr('Ja rzekłem:', 'I said,'), tr('Bogami jesteście', 'you are gods')], { w: SW, size: 34, title: tr('PSALM 82', 'PSALM 82') });
    const paper = sheet().p(c.cut([[-SW / 2 + 6, 0], [SW / 2 - 6, 0], [SW / 2 - 8, SH], [-SW / 2 + 8, SH]], 0.5, 8), C.parchment).out();
    const scrollEl = fx.add(`<g><g class="unroll" clip-path="url(#${clip})">${paper}<g class="txt" opacity="0">${sheetM.sheet.replace(/^[\s\S]*?(<text)/, '$1')}</g><g class="jd" opacity="0">${judges.join('')}<path d="${[-120, 0, 120].map((x) => `M${x} ${vs.h - 34}V${vs.h - 8}`).join('')}" stroke="${C.sun}" stroke-width="3" opacity=".9"/></g><rect class="brd" x="${-SW / 2 + 14}" y="10" width="${SW - 28}" height="${SH - 20}" rx="6" pathLength="1" stroke="${C.sun}" stroke-width="5" fill="none" stroke-dasharray="1 1" stroke-dashoffset="1"/></g><g class="rodT">${vs.rodTop}</g><g class="rodB">${vs.rodBottom}</g><g class="seal" opacity="0" transform="translate(${SW / 2 - 40} ${SH - 30})"><circle r="22" fill="${C.terracotta}"/><path d="${c.poly(c.star(0, 0, 13, 6, 8, 0))}" fill="${C.sun}"/></g></g>`);
    const unroll = scrollEl.querySelector('.unroll'), rodB = scrollEl.querySelector('.rodB'), txt = scrollEl.querySelector('.txt'), jd = scrollEl.querySelector('.jd'), brd = scrollEl.querySelector('.brd'), seal = scrollEl.querySelector('.seal');
    const world = fx.add(`<g><circle r="80" fill="url(#halo-glow)"/>${globe(c, 44)}</g>`);
    const path = fx.add(`<path d="M800 120Q1000 260 1120 470" pathLength="1" stroke="${C.halo}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none"/>`);
    const blas = fx.add(`<g>${bubble(c, tr('Bluźnisz!', 'You blaspheme!'), { size: 22, tail: -1, fill: mix(C.stone2, C.storm, 0.25), ink: C.cream })}</g>`);
    const son = fx.add(`<g><circle r="110" fill="url(#halo-glow)"/>${word(c, tr('Jestem Synem Bożym', 'I am the Son of God'), { size: 24, fill: '#2a2e5a', ink: C.halo })}</g>`);
    const snowF = W.snowFront();

    return (t, time) => {
      const T = time;
      W.sk.blend(WINTER_DUSK, WINTER_NIGHT, es(t, 0, 6) * 0.45);
      W.update(T, { lit: 1, snow: 1 });
      snowF.update(T, 0.8);
      /* v34 — the scroll comes down and unrolls; the words */
      const dn = es(t, 0.15, 0.5, ease.out);
      const un = es(t, 0.5, 0.9);
      const up = es(t, 4.05, 4.4, ease.in);
      const SY = 150 - (1 - dn) * 700 - up * 700;
      vis(scrollEl, { x: 800, y: SY, o: dn > 0.001 && up < 0.99 ? 1 : 0 });
      pose(unroll, { sy: Math.max(0.02, un) });
      pose(rodB, { y: SH * un });
      fade(txt, es(t, 1.1, 1.5));
      fade(jd, es(t, 2.1, 2.5));
      attr(brd, 'stroke-dashoffset', 1 - es(t, 3.1, 3.6));
      const sk = es(t, 3.5, 3.65, ease.back);
      fade(seal, sk > 0.01 ? 1 : 0);
      pose(seal, { x: SW / 2 - 40, y: SH - 30, s: sk });
      /* v36a — consecrated and sent into the world; "You blaspheme" */
      const bk = es(t, 4.1, 4.5) * (1 - es(t, 5.6, 5.9) * 0.4);
      vis(beam, { x: 800, y: 130, o: bk });
      attr(path, 'stroke-dashoffset', 1 - es(t, 4.3, 4.7));
      attr(path, 'opacity', 1 - es(t, 5.3, 5.6));
      const wk = es(t, 4.45, 4.7, ease.back) * (1 - es(t, 5.3, 5.5));
      vis(world, { x: 1120, y: 470, s: wk, o: wk > 0.01 ? 1 : 0 });
      const bl = es(t, 4.7, 4.85, ease.back) * (1 - es(t, 5.3, 5.45));
      vis(blas, { x: 560, y: 440, s: bl * 1.35, o: bl > 0.01 ? 1 : 0 });
      /* v36b — "I am the Son of God" */
      const so = es(t, 5.15, 5.45, ease.back);
      vis(son, { x: 800, y: 380, s: so, o: so > 0.01 ? 1 : 0 });
      const talk = Math.max(bump(t, 0.05, 0.95), bump(t, 1.05, 1.9), bump(t, 2.05, 2.9), bump(t, 3.05, 3.9), bump(t, 4.05, 4.95), bump(t, 5.05, 5.95));
      const heartH = es(t, 5.1, 5.35);
      jesus.set({ x: 800, y: F + 4, s: 1.06, flip: false, armF: 14 + talk * 16 + heartH * 30 + bump(t, 0.1, 0.9) * 40, armB: 8 + bump(t, 0.2, 1.0) * 120 + bump(t, 4.1, 4.9) * 60, head: -bump(t, 0.2, 1.8) * 12 - bump(t, 4.1, 4.9) * 10 + heartH * 6, blink: blinkAt(T, 1) });
      rings(806, F - 176, talk * 0.7, T, { s0: 0.8, spread: 1.8 });
      leads.forEach((m) => {
        const i = m.i;
        const faceL = m.x > 800;
        const look = es(t, 0.3, 0.7) * (1 - es(t, 4.0, 4.3));
        const shout = i === 2 ? bump(t, 4.6, 5.4) : 0;
        const aF = 20 + (1 - look * 0.4) * 90 + shout * 20;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: faceL, armF: aF, armB: 10 + shout * 110, head: -look * 16 + shout * -6, blink: blinkAt(T, m.seed) });
        mood(m, { angry: 0.45 + shout * 0.5 - look * 0.2 });
        const [hx, hy] = hand(m.x, m.y, m.s, faceL, aF);
        vis(stones[i], { x: hx, y: hy + 6, s: m.s });
      });
      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -40], [0.5, -120], [3.6, -120], [4.1, -60], [5, -40], [6, -30]]);
      S.cam.z = kf(t, [[0, 1.06], [0.6, 1.04], [3.6, 1.04], [4.2, 1.08], [5.2, 1.14], [6, 1.14]]);
    };
  },
};
