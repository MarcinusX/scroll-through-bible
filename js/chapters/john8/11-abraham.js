// J 8,37–41 — "You are Abraham's offspring" — a sepia portrait of Abraham hangs over the leaders, a thread of
// descent running down to them; "yet you seek to kill Me" — stones come into two of their hands, and His words
// bounce off them. "What I have seen with My Father" — the radiance over Him; "what you heard from your father" — a
// shadow gathers over them. "Our father is Abraham!" — they point up at the portrait. "Then do Abraham's works" —
// the portrait opens into a larger plate: Abraham at his tent by Mamre, bowing to three strangers and offering them
// bread. "Abraham did not do this" — the bread beside the stones. "You do your father's works" — the shadow deepens;
// "We have one Father — God!" they cry, hands raised.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { nightStage, DC, NIGHT, voiceRings, radiance, framed, ABRAHAM, tentMamre, sepia, wordSlip, stone, bubble, hand, kf, vis, tr, PI, INK } from './lib.js';
import { loaf } from '../mark2/lib.js';

export default {
  id: 'j8-abraham',
  beats: [
    { v: 37 },
    { v: 38 },
    { v: 39, text: 'W odpowiedzi rzekli do Niego: «Ojcem naszym jest Abraham».' },
    { v: 39, cont: true, text: 'Rzekł do nich Jezus: «Gdybyście byli dziećmi Abrahama, to byście pełnili czyny Abrahama.' },
    { v: 40 },
    { v: 41, text: 'Wy pełnicie czyny ojca waszego».' },
    { v: 41, cont: true, text: 'Rzekli do Niego: «Myśmy się nie urodzili z nierządu, jednego mamy Ojca - Boga».' },
  ],
  cam: { x: [-40, 120], y: [-120, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const fx = st.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    const SEP = mix(C.parchment, C.dune, 0.3);
    // the small portrait and the big plate of Mamre
    const small = `<rect width="200" height="150" fill="${SEP}"/><g transform="translate(140 138)">${tentMamre(c, 110, 84)}</g><g transform="translate(62 142) scale(.5)">${person(c, sepia(ABRAHAM, 0.45))}</g>`;
    const portrait = fx.add(`<g>${framed(S, small, { w: 200, h: 150, rim: C.wood3, k: 'por' })}</g>`);
    const threadL = fx.add(`<path d="M0 0L0 1" stroke="${mix(C.wood3, C.parchment, 0.3)}" stroke-width="2.4" stroke-dasharray="6 5" fill="none" opacity="0"/>`);
    const BW = 420, BH = 250;
    const big = fx.add(`<g>${framed(S, `<rect width="${BW}" height="${BH}" fill="${SEP}"/><circle cx="330" cy="60" r="36" fill="${mix(C.sun, SEP, 0.5)}"/><path d="M0 ${BH - 30}Q${BW / 2} ${BH - 46} ${BW} ${BH - 30}V${BH}H0Z" fill="${mix(C.sand2, SEP, 0.4)}"/><g transform="translate(90 ${BH - 30})">${tentMamre(c, 150, 116)}</g>`, { w: BW, h: BH, rim: C.wood3, k: 'mamre' })}</g>`);
    const abr = S.puppet(fx.add(person(c, { ...sepia(ABRAHAM, 0.4), holdF: `<g transform="translate(0 6)">${loaf(c, 12, mix(C.wheat2, SEP, 0.3))}</g>` })));
    const guests = [0, 1, 2].map((i) => S.puppet(fx.add(person(c, sepia({ robe: [C.linen, C.linen2, C.stone][i], hairStyle: 'wrap', veil: C.linen, beard: ['full', 'short', 'none'][i], skin: C.skin2, hair: C.hair2 }, 0.45)))));
    // light over Him, shadow over them
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const rad = lightL.add(`<g><circle r="190" fill="url(#halo-glow)"/>${radiance(c, 48)}</g>`);
    const shadowL = S.layer({ par: 0.56, sh: 0, flat: true });
    const shid = S.id('shade');
    S.defs(`<radialGradient id="${shid}"><stop offset="0" stop-color="#120f28" stop-opacity=".75"/><stop offset=".6" stop-color="#120f28" stop-opacity=".4"/><stop offset="1" stop-color="#120f28" stop-opacity="0"/></radialGradient>`);
    const shadow = shadowL.add(`<g><ellipse rx="300" ry="190" fill="url(#${shid})"/></g>`);
    // stones and slips
    const stones = [0, 1].map(() => fx.add(`<g>${stone(c, 14, mix(C.rock2, C.rock3, 0.35))}</g>`));
    const slips = Array.from({ length: 4 }, () => fx.add(wordSlip(c, 32)));
    const fx2 = S.layer({ par: 0.6, sh: 5 });
    const cry = fx2.add(`<g>${bubble(c, tr('jednego mamy Ojca – Boga!', 'one Father — God!'), { size: 19, tail: -1 })}</g>`);
    const cry0 = fx2.add(`<g>${bubble(c, tr('Ojcem naszym jest Abraham!', 'Our father is Abraham!'), { size: 19, tail: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* the portrait (v37, v39a) and its thread of descent */
      const pk = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 3.0, 3.2));
      const PX = S.portrait ? 1010 : 1060, PY = 150;      // phone: the portrait and the plate whole on a narrow screen
      vis(portrait, { x: PX, y: PY - (1 - pk) * 700, r: Math.sin(T * 0.7) * 0.8 * pk, o: pk > 0.001 ? 1 : 0 });
      const th = es(t, 0.3, 0.6) * (1 - es(t, 1.0, 1.2)) + es(t, 2.1, 2.4) * (1 - es(t, 2.9, 3.05));
      attr(threadL, 'd', `M${PX} ${PY + 162}L${PX} ${lerp(PY + 162, 480, th).toFixed(1)}`);
      attr(threadL, 'opacity', th > 0.01 && pk > 0.5 ? 0.8 : 0);
      /* stones come into two hands; His words bounce off */
      const stK = Math.max(es(t, 0.55, 0.75) * (1 - es(t, 1.0, 1.2)), es(t, 4.1, 4.35) * (1 - es(t, 5.0, 5.2)));
      slips.forEach((el, i) => {
        const k = seg(t, 0.55 + i * 0.08, 0.9 + i * 0.08);
        const x = k < 0.6 ? lerp(DC.JX + 30, 940, k / 0.6) : lerp(940, 900 - i * 20, (k - 0.6) / 0.4);
        const y = k < 0.6 ? lerp(DC.FLOOR - 180, DC.FLOOR - 170, k / 0.6) : lerp(DC.FLOOR - 170, DC.FLOOR - 10, (k - 0.6) / 0.4);
        vis(el, { x, y, r: k * 160, o: k > 0 && k < 1 ? 1 : 0 });
      });
      /* v38 — light over Him, shadow over them; v41a — deeper */
      const rk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 2.0, 2.2) * 0.6);
      vis(rad, { x: DC.JX, y: 150 - (1 - es(t, 1.1, 1.4, ease.out)) * 400, o: rk });
      const sh = Math.max(es(t, 1.35, 1.7) * (1 - es(t, 2.0, 2.2) * 0.6), es(t, 5.05, 5.4) * (1 - es(t, 6.3, 6.6) * 0.4));
      vis(shadow, { x: 1060, y: 540, s: 0.8 + sh * 0.3, o: sh });
      /* v39b–40 — Mamre */
      const bk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 4.9, 5.15, ease.in));
      const BX = S.portrait ? 900 : 990, BY = 110 - (1 - bk) * 700;
      vis(big, { x: BX, y: BY, o: bk > 0.001 ? 1 : 0 });
      const bow = bump(t, 3.45, 4.05);
      const offer = es(t, 4.05, 4.4);
      abr.set({ x: BX - BW / 2 + 190, y: BY + BH - 34, s: 0.5, o: bk > 0.001 ? 1 : 0, armF: 20 + bow * 30 + offer * 60, armB: 10 + bow * 20, lean: bow * 22, head: bow * 16, blink: 0 });
      guests.forEach((g, i) => g.set({ x: BX - BW / 2 + 290 + i * 38, y: BY + BH - 36 + (i % 2) * 4, s: 0.46, flip: true, o: bk > 0.001 ? 1 : 0, armF: 16 + (i === 0 ? offer * 30 : 0), blink: 0 }));

      const talk = Math.max(bump(t, 0.05, 1.95), bump(t, 3.05, 5.95));
      K.set(T, {
        j: { armF: 16 + talk * 26, armB: 10 + bump(t, 1.1, 1.9) * 140, head: -bump(t, 1.1, 1.9) * 10 },
        lisF: () => ({ head: -4 }),
        leadF: (m) => {
          const proud = bump(t, 2.05, 2.95);
          const cryUp = es(t, 6.1, 6.4);
          return { armF: 20 + (m.i === 0 ? proud * 110 : 0) + (m.i === 1 || m.i === 2 ? stK * 30 : 0), armB: 10 + cryUp * (m.i < 4 ? 140 : 90), head: -proud * 14 - cryUp * 14, angry: 0.4 + sh * 0.4 + cryUp * 0.2 };
        },
      });
      [1, 2].forEach((li, i) => {
        const m = K.lead[li];
        const [hx, hy] = hand(m.x, m.y, m.s, true, 20 + stK * 30);
        vis(stones[i], { x: hx, y: hy + 4, s: m.s, o: stK });
      });
      const ck0 = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(cry0, { x: 980, y: 470, s: ck0, o: ck0 > 0.01 ? 1 : 0 });
      const ck = es(t, 6.2, 6.4, ease.back);
      vis(cry, { x: 1000, y: 460, s: ck, o: ck > 0.01 ? 1 : 0 });
      rings(DC.JX + 6, DC.FLOOR - 172, talk, T, { dir: 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, 40], [1.0, 40], [1.3, 0], [2.0, 30], [2.3, 70], [3.0, 70], [3.4, 60], [5, 60], [5.3, 40], [6.2, 60]]);
      S.cam.y = kf(t, [[0, -60], [1.0, -40], [1.3, -80], [2.0, -40], [3.0, -60], [3.4, -100], [4.9, -90], [5.3, -20], [6.2, -20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.3, 1.02], [2.3, 1.08], [3.4, 1.12], [4.9, 1.1], [5.3, 1.06], [6.2, 1.1]]);
    };
  },
};
