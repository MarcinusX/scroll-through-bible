// Łk 9,18–21 — a quiet hillside apart, early in the day, an old olive tree over a flat rock. Jesus kneels there praying
// alone, a soft light behind Him; the disciples sit a little way off on the grass. He rises and asks them: "Who do the
// crowds say that I am?" — His bubble holds a little crowd and a question. "John the Baptizer; others, Elijah; others,
// one of the old prophets risen": the same three portraits that hung in Herod's hall come down on their strings as each
// is said. "But who do you say that I am?" — the portraits go up and He turns to them. Peter gets up, comes forward and
// kneels: "The Christ of God" — a crown of light comes down over Jesus and the words shine in gold. Then He charges
// them strictly to tell no one: His hand goes up, the gold words roll themselves up into a scroll with a red seal, and
// the disciples bow their heads.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { restSet, REST_SIT, TW9, whoPortrait, speech, bubble, GLYPH, folk, stillGroup, lightCrown, goldWord, sealedScroll, halo, rayBurst, MORNING9, kf, headAt, tr, PI } from './lib.js';

const JX = 800, JY = 706;
const SIT = REST_SIT;

export default {
  id: 'lk9-christ',
  beats: [
    { v: 18 },
    { v: 19 },
    { v: 20, text: 'Zapytał ich: «A wy za kogo Mnie uważacie?»' },
    { v: 20, cont: true, text: 'Piotr odpowiedział: «Za Mesjasza Bożego».' },
    { v: 21 },
  ],
  cam: { x: [-30, 30], y: [0, 60], z: [1, 1.14] },
  build(S) {
    const R = restSet(S);
    const c = S.c;
    // phone: the disciples and the portraits drawn in from the edges
    const PH = S.portrait;
    const IN = (x, k = 0.78) => (PH ? 800 + (x - 800) * k : x);

    /* the portraits of what the crowds say, the crown of light, the gold words, the seal */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const POR = [[0, 560, 196], [1, 1040, 196], [2, 800, 150]].map(([i, x, y]) => ({ i, x: IN(x, 0.8), y, el: hanging(flies, whoPortrait(S, i), { x: 0, y: -1500, len: 900 }) }));
    const crownEl = hanging(flies, lightCrown(c, 40), { x: 0, y: -1500, len: 900 });
    const words = hanging(flies, goldWord(c, tr('Mesjasz Boży', 'the Christ of God'), { size: 30 }), { x: 0, y: -1500, len: 900 });
    const seal = hanging(flies, `<g transform="scale(2.1)">${sealedScroll(c, 80)}</g>`, { x: 0, y: -1500, len: 900 });

    /* people */
    const glowL = S.layer({ par: 0.5, sh: 1, flat: true });
    const prayGlow = glowL.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 20, r1: 300, spread: 0.04, o: 0.55 })}${halo(170, 0.9)}</g>`);
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = SIT.map((d, i) => ({ ...d, x: IN(d.x), i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...TW9[d.k], pose: 'sit' }))) })).sort((a, b) => a.y - b.y);
    const P = D.find((d) => d.k === 'peter');
    P.up = S.puppet(act.add(person(c, TW9.peter)));
    P.kn = S.puppet(act.add(person(c, { ...TW9.peter, pose: 'kneel' })));
    const jKneel = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.55, sh: 4 });
    const mem = [-1, 0, 1].map((k) => ({ x: k * 18, y: Math.abs(k) * 2, s: 1, flip: k > 0, o: folk(c), armF: 20 }));
    const askCrowd = fx.add(`<g opacity="0">${speech(c, `<g transform="translate(-18 26) scale(.34)">${stillGroup(c, mem)}</g><g transform="translate(28 -2) scale(1.3)">${GLYPH.q(c)}</g>`, { w: 110, h: 76 })}</g>`);
    const askYou = fx.add(`<g opacity="0">${bubble(c, tr('A wy?', 'But you?'), { size: 24, tail: -1 })}</g>`);
    const peterSays = fx.add(`<g opacity="0">${bubble(c, tr('Mesjasz Boży!', 'The Christ of God!'), { size: 21, tail: 1 })}</g>`);
    const talk = [0, 1, 2].map((i) => fx.add(`<g opacity="0">${speech(c, GLYPH.bang(c), { w: 36, h: 34, flip: i === 1 })}</g>`));

    return (t, time) => {
      const T = time;
      R.update(T);

      /* v18 — praying alone; then He asks */
      const up = es(t, 0.42, 0.49);
      const pray = 1 - es(t, 0.4, 0.55);
      pose(prayGlow, { x: JX, y: JY - 120, s: 0.6 + pray * 0.4, r: T * 3, o: pray * 0.9 + es(t, 3.05, 3.3) * 0.7 });
      jKneel.set({ x: JX, y: JY, s: 1.04, armF: 80, armB: 60, head: -16, o: 1 - up, blink: 0 });
      const ask = bump(t, 0.5, 0.98);
      const askU = bump(t, 2.05, 2.95);
      const toL = t > 2.0;
      const hush = es(t, 4.05, 4.25);
      jesus.set({ x: JX, y: JY + 4, s: 1.04, o: up, flip: toL && t < 3.0, armF: 20 + ask * 60 + askU * 70 + hush * 85, armB: 10 + ask * 40 + hush * 30, head: -2 - hush * 4, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      const ak = es(t, 0.55, 0.7, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(askCrowd, { x: jhx + 26, y: jhy - 16, s: ak, o: ak > 0.01 ? 1 : 0 });
      const yk = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(askYou, { x: jhx - 30, y: jhy - 30, s: yk, o: yk > 0.01 ? 1 : 0 });

      /* v19 — John, Elijah, a prophet */
      POR.forEach((p) => {
        const on = es(t, 1.05 + p.i * 0.25, 1.3 + p.i * 0.25, ease.back);
        const away = es(t, 2.02, 2.3);
        pose(p.el, { x: p.x, y: lerp(-1500, p.y, on) - away * 1300, r: Math.sin(T * 1.1 + p.i) * 1.8, oy: 0, o: on > 0.002 ? 1 : 0 });
      });
      const SPEAK = [D.find((d) => d.k === 'andrew'), D.find((d) => d.k === 'john'), D.find((d) => d.k === 'thomas')];
      talk.forEach((b, i) => {
        const d = SPEAK[i];
        const k = es(t, 1.05 + i * 0.25, 1.18 + i * 0.25, ease.back) * (1 - es(t, 1.3 + i * 0.25, 1.4 + i * 0.25));
        const [hx, hy] = headAt(d.x, d.y, 0.92, d.x > JX, 62);
        pose(b, { x: hx + (d.x > JX ? -10 : 10), y: hy - 22, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* the disciples; Peter rises and kneels before Him (v20b) */
      const pUp = es(t, 3.0, 3.06), pKn = es(t, 3.28, 3.34);
      D.forEach((d) => {
        const speaking = SPEAK.indexOf(d);
        const sp = speaking >= 0 ? bump(t, 1.02 + speaking * 0.25, 1.45 + speaking * 0.25) : 0;
        const bow = es(t, 4.2 + d.i * 0.03, 4.4 + d.i * 0.03);
        const look = es(t, 3.3, 3.5) * (1 - bow);
        const o = d === P ? 1 - pUp : 1;
        d.p.set({ x: d.x, y: d.y, s: 0.92, flip: d.x > JX, o, armF: 20 + sp * 70 + look * 30, armB: sp * 30, head: -6 - look * 8 + bow * 18, lean: bow * 8, blink: blinkAt(T, d.seed) });
      });
      const px = lerp(P.x, 690, es(t, 3.06, 3.28));
      P.up.set({ x: px, y: lerp(P.y, JY + 14, es(t, 3.06, 3.28)), s: 0.94, walk: t > 3.06 && t < 3.28 ? px * 0.08 : undefined, o: pUp * (1 - pKn), armF: 40, blink: blinkAt(T, 4) });
      P.kn.set({ x: 690, y: JY + 14, s: 0.94, o: pKn, armF: 60 + bump(t, 3.3, 3.95) * 40 - es(t, 4.2, 4.4) * 20, armB: 40 + bump(t, 3.3, 3.95) * 60, head: -14 + es(t, 4.2, 4.4) * 26, lean: es(t, 4.2, 4.4) * 12, blink: blinkAt(T, 4) });
      const [phx, phy] = headAt(690, JY + 14, 0.94, false, 46);
      const pk = es(t, 3.3, 3.45, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(peterSays, { x: phx - 10, y: phy - 30, s: pk, o: pk > 0.01 ? 1 : 0 });

      /* the crown of light, the gold words — rolled up under a seal (v21) */
      const ck = es(t, 3.35, 3.65, ease.back) * (1 - es(t, 4.1, 4.4));
      pose(crownEl, { x: JX, y: lerp(-1500, JY - 230, ck), r: Math.sin(T * 0.8) * 2, oy: 0, o: ck > 0.002 ? 1 : 0 });
      const wk = es(t, 3.45, 3.75, ease.back);
      const roll = es(t, 4.1, 4.3);
      pose(words, { x: JX, y: lerp(-1500, 240, wk), sx: Math.max(0.02, 1 - roll), r: Math.sin(T * 0.9) * 1.5, oy: 0, o: wk > 0.002 && roll < 1 ? 1 : 0 });
      const sk = es(t, 4.22, 4.45, ease.back);
      pose(seal, { x: JX, y: 270, s: sk, r: Math.sin(T * 0.9) * 2, oy: 0, o: sk > 0.01 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.1], [0.5, 1.1], [1.0, 1.02], [2.0, 1.02], [2.5, 1.06], [3.0, 1.06], [3.5, 1.1], [4.5, 1.08]]);
      S.cam.y = kf(t, [[0, 50], [0.5, 50], [1.0, 10], [2.0, 10], [2.5, 30], [3.5, 40], [4.5, 30]]);
    };
  },
};
