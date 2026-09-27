// J 2,3–5 — the wine runs out: the steward tips the last amphora and only two drops fall; the cups on
// the table stand empty. Mary tells her Son; He answers her — and an hour-glass comes down from the
// flies, its sand still waiting in the upper bulb: "my hour has not yet come". She turns to the servants.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { canaSet, canaIdle, LOOK, DISC, SERVANTS, EVENING, AFTERNOON, amphora, amphoraStand, goblet, lowTable, iconBubble, bubble, miniHead, hourglassParts, strip, withFace, faceBits, drops, WINE_A, bowl, loaf, grapes, tr, PI } from './lib.js';

const FLOOR = 680;
const TABLE_Y = 724;

export default {
  id: 'j2-nowine',
  beats: [
    { v: 3, text: 'A kiedy zabrakło wina,' },
    { v: 3, cont: true, text: 'Matka Jezusa mówi do Niego: «Nie mają już wina».' },
    { v: 4, text: 'Jezus Jej odpowiedział: «Czyż to moja lub Twoja sprawa, Niewiasto?' },
    { v: 4, cont: true, text: 'Czyż jeszcze nie nadeszła godzina moja?»' },
    { v: 5 },
  ],
  cam: { x: [-60, 30], y: [0, 110], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const set = canaSet(S, { floorY: FLOOR });

    /* the wine corner: an empty amphora lying down, the last one on its stand */
    const cornerL = S.layer({ par: 0.5, sh: 5 });
    cornerL.add(`<g transform="translate(372 ${FLOOR + 22}) rotate(-84) scale(1.1)">${amphora(c, shade(C.pot, -0.05))}</g>`);
    cornerL.add(`<g transform="translate(420 ${FLOOR + 8}) scale(1.1)">${amphoraStand(c)}</g>`);
    const amph = cornerL.add(`<g>${amphora(c)}</g>`);
    const drip = [0, 1].map((i) => cornerL.add(`<g>${drops(c, WINE_A, 3, 1)}<path d="${c.cut([[0, -6], [3, 0], [0, 3], [-3, 0]], 0.1, 2)}" fill="${WINE_A}"/></g>`));
    const stewardM = withFace(person(c, { ...LOOK.steward, holdF: `<g transform="translate(0 4) rotate(90)">${goblet(c)}</g>` }), faceBits(c));
    const steward = S.puppet(cornerL.add(stewardM));
    const sad = steward.el.querySelector('[data-part="sad"]');
    const servants = SERVANTS.slice(0, 2).map((o, i) => ({ i, seed: c.rr(0, 9), x: [548, 622][i], p: S.puppet(cornerL.add(person(c, o))) }));

    /* the table: the disciples and Jesus sitting at the feast */
    const tabL = S.layer({ par: 0.58, sh: 5 });
    const seated = [
      { o: CAST.john, x: 702 }, { o: CAST.jesus, x: 800, j: true }, { o: CAST.peter, x: 898, f: true }, { o: CAST.andrew, x: 994, f: true }, { o: DISC[3], x: 1090, f: true }, { o: DISC[4], x: 1186, f: true },
    ].map((s, i) => ({ ...s, i, seed: c.rr(0, 9) }));
    // Mary stands behind, then comes to His side
    const mary = S.puppet(tabL.add(person(c, { ...LOOK.mary })));
    seated.forEach((s) => { s.p = S.puppet(tabL.add(person(c, { ...s.o, pose: 'sit' }))); });
    const jesus = seated[1].p;
    tabL.add(`<g transform="translate(950 ${TABLE_Y})">${lowTable(c, 620, 46)}</g>`);
    tabL.add(`<g transform="translate(750 ${TABLE_Y - 46})">${loaf(c, 18)}</g><g transform="translate(1040 ${TABLE_Y - 46})">${bowl(c, { food: 'fruit', color: C.skyVeil })}</g><g transform="translate(1140 ${TABLE_Y - 46})">${grapes(c)}</g>`);
    const cups = [660, 850, 950, 1090, 1230].map((x, i) => ({ x, i, el: tabL.add(`<g>${goblet(c, { fill: mix(WINE_A, C.cream, 0.1), r: 1.4 })}</g>`) }));
    cups.forEach((cp) => { cp.wine = cp.el.querySelector('.wine'); });

    /* words and the hour-glass */
    const talkL = S.layer({ par: 0.64, sh: 6 });
    const empty = sheet().p(c.cut([[-12, -30], [12, -30], [10, -14], [2, -10], [2, -4], [8, 0], [-8, 0], [-2, -4], [-2, -10], [-10, -14]], 0.2, 3), C.sun).out();
    const mBubble = talkL.add(`<g>${iconBubble(c, `<g transform="translate(-26 -14) rotate(180) scale(1.3)">${empty}</g><g transform="translate(28 16) rotate(-80) scale(.42)">${amphora(c)}</g>`, { w: 136, h: 90, side: -1 })}</g>`);
    const qIcon = `<g transform="translate(-30 0)">${miniHead(c, LOOK.mary, 17)}</g><g transform="translate(30 0)">${miniHead(c, CAST.jesus, 17)}</g><text x="0" y="8" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">?</text>`;
    const jBubble = talkL.add(`<g>${iconBubble(c, qIcon, { w: 132, h: 72 })}</g>`);
    const hg = hourglassParts(c, 180);
    const glassEl = hanging(talkL, `<g>${hg.frame}</g><g class="top">${hg.top}</g><g class="bot">${hg.bottom}</g><g class="stream">${hg.stream}</g><g transform="translate(0 ${hg.h / 2 + 30})">${strip(c, tr('moja godzina', 'my hour'), { size: 22 })}</g>`, { x: 800, y: 300, len: 700 });
    const gTop = glassEl.querySelector('.top'), gBot = glassEl.querySelector('.bot'), gStream = glassEl.querySelector('.stream');
    const sBubble = talkL.add(`<g>${bubble(c, tr(['Zróbcie wszystko,', 'cokolwiek wam powie'], ['Whatever he says', 'to you, do it']), { size: 19, tail: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      set.sk.blend(AFTERNOON, EVENING, es(t, 0, 5) * 0.35);
      canaIdle(set, T, { lit: 0.55 + es(t, 0, 5) * 0.2 });

      /* v3a — the last amphora is tipped; two drops; cups stand empty */
      const tip = es(t, 0.1, 0.45) * (1 - es(t, 1.2, 1.5) * 0.9);
      pose(amph, { x: 420, y: FLOOR - 43, s: 1.1, r: tip * 72, ox: 0, oy: -60 });
      const mx0 = 420 + Math.sin(tip * 72 * PI / 180) * 72, my0 = FLOOR - 43 - 66 - Math.cos(tip * 72 * PI / 180) * 72;
      drip.forEach((d, i) => {
        const k = seg(t, 0.42 + i * 0.16, 0.68 + i * 0.16);
        pose(d, { x: mx0 + 6, y: my0 + k * k * 70, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const peer = bump(t, 0.5, 1.4);
      steward.set({ x: 486, y: FLOOR + 12, s: 1.1, flip: true, armF: 60 + tip * 20 - peer * 10, armB: tip * 70 + peer * 40, head: peer * 12, lean: -peer * 4, blink: blinkAt(T, 3) });
      fade(sad, es(t, 0.45, 0.7));
      servants.forEach((s) => {
        const listen = es(t, 4.2, 4.5);
        s.p.set({ x: s.x, y: FLOOR - 4, s: 1.02, flip: listen < 0.5 ? s.i === 0 : false, armF: 20 + bump(t, 0.3, 1.2) * 40 + listen * (s.i ? 30 : 60), armB: 10 + bump(t, 0.3, 1.2) * 60 * s.i, head: listen * 10 - bump(t, 0.3, 1.2) * 6, blink: blinkAt(T, s.seed) });
      });
      cups.forEach((cp) => {
        const over = es(t, 0.35 + cp.i * 0.07, 0.6 + cp.i * 0.07);
        pose(cp.el, { x: cp.x, y: TABLE_Y - 44 - over * 16, r: over * 180, ox: 0, oy: -14 });
        fade(cp.wine, 1 - over);
      });

      /* v3b — Mary comes to her Son */
      const go = es(t, 1.05, 1.5);
      const mx = lerp(640, 736, go);
      const turnBack = es(t, 4.02, 4.2);
      const point = es(t, 4.15, 4.45);
      mary.set({ x: mx, y: FLOOR + 16, s: 1.1, flip: turnBack > 0.5, walk: go > 0.02 && go < 0.98 ? mx * 0.12 : undefined, armF: bump(t, 1.45, 2.1) * 55 + point * 70, armB: bump(t, 1.5, 2.1) * 20 - point * 50, head: bump(t, 1.4, 2.2) * 10 + es(t, 2.1, 2.4) * 6 * (1 - turnBack), lean: bump(t, 1.4, 2.2) * 6, blink: blinkAt(T, 7) });
      const mb = es(t, 1.4, 1.62, ease.back) * (1 - es(t, 2.05, 2.2));
      pose(mBubble, { x: mx - 8, y: FLOOR - 214, s: 0.3 + mb * 0.7, o: mb });

      /* v4 — He turns to her and answers; the hour-glass descends */
      const turn = es(t, 1.9, 2.05);
      seated.forEach((s) => {
        const look = s.j ? 0 : es(t, 1.3, 1.7) * (1 - es(t, 4.1, 4.4));
        s.p.set({
          x: s.x, y: TABLE_Y - 12, s: 1.06, flip: s.j ? turn > 0.5 : s.f ? true : false,
          armF: s.j ? 30 + es(t, 2.05, 2.3) * 45 - es(t, 3.1, 3.3) * 15 : 40 + bump(t, 0.4, 1.1) * 30, armB: s.j ? 20 + es(t, 3.1, 3.4) * 50 : 20,
          head: s.j ? -es(t, 3.1, 3.4) * 8 : look * 6, blink: blinkAt(T, s.seed),
        });
      });
      const jb = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(jBubble, { x: 822, y: TABLE_Y - 158, s: 0.3 + jb * 0.7, o: jb });
      const drop = es(t, 3.0, 3.5, ease.out) * (1 - es(t, 4.05, 4.35));
      pose(glassEl, { x: 790, y: 330 - (1 - drop) * 560, r: Math.sin(T * 0.8) * 1.6 * drop });
      // sand: the upper bulb stays full — only a thin thread of grains begins to fall
      pose(gTop, { s: 1 });
      pose(gBot, { x: 0, y: hg.h / 2 - 12, sy: 0.08 + seg(t, 3.3, 4) * 0.06, sx: 0.4, oy: 0 });
      pose(gStream, { o: es(t, 3.35, 3.5) * (0.5 + Math.sin(T * 6) * 0.2) });

      /* v5 — Mary turns to the servants: "do whatever He tells you" */
      const sb = es(t, 4.2, 4.45, ease.back);
      pose(sBubble, { x: mx - 60, y: FLOOR - 200, s: 0.3 + sb * 0.7, o: sb });

      S.cam.x = -50 + es(t, 1, 1.6) * 60 - es(t, 4, 4.5) * 50;
      S.cam.z = 1.2 + es(t, 1.8, 2.3) * 0.06 - es(t, 2.9, 3.4) * 0.1;
      S.cam.y = 90 - es(t, 2.9, 3.4) * 60 + es(t, 4, 4.4) * 60;
    };
  },
};
