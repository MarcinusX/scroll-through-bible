// J 8,12–13 — the Court of the Women at night, at the Feast of Tabernacles: four great golden lampstands stand
// unlit. Jesus speaks again: "I am the light of the world" — the lampstands blaze up one after another, a paper
// world comes down above Him and is lit. "Whoever follows Me will not walk in darkness" — the darkness closes in,
// but a pool of light goes with Him, and those who follow Him carry the light of life. The Pharisees object: a
// card shows a single witness pointing to himself — "not true" — a red cross is stamped on it.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { nightStage, DC, NIGHT, EVE, voiceRings, globe, soulLight, iAm, darkPool, crossX, hanging, swing, kf, vis, tr, PI, INK, shadowPerson, CAST } from './lib.js';

export default {
  id: 'j8-light',
  beats: [
    { v: 12, text: 'A oto znów przemówił do nich Jezus tymi słowami:' },
    { v: 12, cont: true, text: '«Ja jestem światłością świata.' },
    { v: 12, cont: true, text: 'Kto idzie za Mną, nie będzie chodził w ciemności, lecz będzie miał światło życia».' },
    { v: 13, text: 'Rzekli do Niego faryzeusze: «Ty sam o sobie wydajesz świadectwo.' },
    { v: 13, cont: true, text: 'Świadectwo Twoje nie jest prawdziwe».' },
  ],
  cam: { x: [-80, 80], y: [-80, 60], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: EVE });
    const K = st.cast;
    const rings = voiceRings(st.fx, c, { n: 3, r: 38, w: 5, both: true, color: shade(C.halo, -0.05) });
    const world = hanging(st.fx, `<circle r="130" fill="url(#halo-glow)" class="wglow"/>${globe(c, 64)}`, { x: DC.JX, y: 230, len: 700 });
    const wGlow = world.querySelector('.wglow');
    const am = hanging(st.fx, iAm(c, tr('JA JESTEM', 'I AM'), { size: 34 }), { x: DC.JX, y: 110, len: 700 });
    // the dark that closes in, with a clear pool that goes with Him (a flat sheet slid on the compositor)
    const darkL = S.layer({ par: 0.56, sh: 0, flat: true, pad: 300 });
    darkL.add(darkPool(S, { cx: 700, cy: 600, r0: 170, r1: 560, col: '#0f1030', name: 'follow' }));
    // the lights of life, carried by those who follow
    const fx2 = S.layer({ par: 0.6, sh: 4 });
    const lights = K.lis.slice(0, 4).map(() => fx2.add(`<g>${soulLight(c, 11)}</g>`));
    // the witness card: one figure pointing at himself; a red cross stamped over it
    const cardInner = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-90, 0, 180, 150), 0.6, 8), C.cream).p(c.cut(c.rect(-82, 8, 164, 134), 0.4, 8), C.parchment);
      const fig = `<g transform="translate(-6 128) scale(.5)">${shadowPerson(c, { ...CAST.jesus, halo: false }, INK)}</g>`;
      const loop = `<path d="${c.ribbon(c.arc(4, 52, 34, 26, -0.6, PI * 1.35, 14), 3)}" fill="${C.terracotta}"/><path d="${c.poly([[-28, 70], [-16, 58], [-34, 56]])}" fill="${C.terracotta}"/>`;
      const one = `<text x="54" y="48" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">1</text>`;
      return `<path d="M-60 -1600V2M60 -1600V2" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${fig}${loop}${one}`;
    })();
    const card = st.fx.add(`<g>${cardInner}</g>`);
    const stamp = st.fx.add(`<g>${crossX(c, 46)}</g>`);
    const CX = S.portrait ? 1035 : 1060;      // phone: the card clear of the progress thread

    return (t, time) => {
      const T = time;
      /* the lamps: dark at first, blazing on "I am the light of the world" */
      const lit = seg(t, 1.1, 1.75);
      st.set.update(t, T, { lit, stagger: 0.12, moonY: 150, glowO: 0.35 + lit * 0.45, gate: 0.2 + lit * 0.5 });
      st.set.sk.blend(EVE, NIGHT, es(t, 0, 1.2));

      /* v12a — He speaks again */
      const speak = es(t, 0.3, 0.6);
      const walk = es(t, 2.1, 2.9);
      const jx = DC.JX + walk * 40;
      const toPh = es(t, 3.1, 3.4);
      K.set(T, {
        j: {
          x: jx, walk: walk > 0 && walk < 1 ? jx * 0.06 : undefined, flip: t > 0.25 && t < 2.02,
          armF: 16 + speak * 40 * (1 - es(t, 1.0, 1.2)) + bump(t, 1.1, 1.9) * 40 + toPh * 20, armB: 10 + bump(t, 1.1, 1.95) * 140 + es(t, 4.1, 4.5) * 20, head: -bump(t, 1.1, 1.9) * 10,
        },
        lisF: (m) => {
          if (m.i > 3) return { head: -6 * lit };
          const k = es(t, 2.1 + m.i * 0.05, 2.9 + m.i * 0.05);
          const x = m.x + k * 70;
          return { x, walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: 14 + es(t, 2.3, 2.6) * 50, head: -4 - lit * 4 };
        },
        leadF: (m) => {
          const step = m.i === 0 ? es(t, 3.05, 3.35) * 14 : 0;      // he steps up to Him, not over Him
          const point = m.i === 0 ? bump(t, 3.1, 3.95) : m.i === 1 ? bump(t, 4.1, 4.9) : 0;
          return { x: m.x - step, walk: step > 0 && step < 14 ? m.x * 0.06 : undefined, armF: 20 + point * 70, armB: 10 + (m.i === 2 ? es(t, 3.3, 3.6) * 30 : 0), head: -2 - lit * 3, angry: 0.3 + es(t, 3.0, 3.3) * 0.7 };
        },
      });
      const [hx, hy] = [jx + 2, DC.FLOOR + 8 - 170 * 1.06];
      rings(hx, hy, Math.max(bump(t, 0.35, 1.0), bump(t, 1.1, 1.9) * 1.2, bump(t, 2.05, 2.95)), T, { spread: 2.2 });

      /* v12b — the world, lit; the I AM */
      const wk = es(t, 1.15, 1.55, ease.out) * (1 - es(t, 2.1, 2.4, ease.in));
      swing(world, DC.JX, 250 - (1 - wk) * 700, wk > 0.001 ? T : 0, 1.1, 0.7);
      fade(world, wk > 0.001 ? 1 : 0);
      fade(wGlow, es(t, 1.35, 1.7));
      const ak = es(t, 1.25, 1.6, ease.out) * (1 - es(t, 2.1, 2.4, ease.in));
      swing(am, DC.JX, 120 - (1 - ak) * 700, ak > 0.001 ? T : 0, 0.8, 0.6, 1);
      fade(am, ak > 0.001 ? 1 : 0);

      /* v12c — darkness around, light with Him */
      const dk = es(t, 2.05, 2.4) * (1 - es(t, 2.95, 3.3));
      darkL.fade(dk);
      darkL.shift(walk * 60, 0);
      K.lis.slice(0, 4).forEach((m, i) => {
        const k = es(t, 2.1 + m.i * 0.05, 2.9 + m.i * 0.05);
        const x = m.x + k * 70;
        const lk = es(t, 2.3 + i * 0.1, 2.5 + i * 0.1, ease.back) * (1 - es(t, 3.4, 3.6));
        vis(lights[i], { x: x + 22 * m.s, y: m.y - 150 * m.s + Math.sin(T * 2 + i) * 2, s: lk, o: lk > 0.01 ? 1 : 0 });
      });

      /* v13 — "You testify about yourself" — the card; "not true" — the stamp */
      const ck = es(t, 3.2, 3.55, ease.out) * (1 - es(t, 4.8, 5.0, ease.in));
      vis(card, { x: CX, y: 250 - (1 - ck) * 700, r: Math.sin(T * 0.8) * 1.2 * ck, o: ck > 0.001 ? 1 : 0 });
      const sk = es(t, 4.2, 4.35, ease.back);
      vis(stamp, { x: CX, y: 330 - (1 - ck) * 700, s: sk * 1.4, r: -8, o: sk > 0.01 ? ck : 0 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.3, 0], [2.1, -30], [2.9, 20], [3.2, 60], [5, 60]]);
      S.cam.y = kf(t, [[0, 0], [1.1, -50], [1.9, -60], [2.3, 20], [3.2, -10], [5, -10]]);
      S.cam.z = kf(t, [[0, 1.08], [1.1, 1.0], [1.9, 1.02], [2.3, 1.14], [3.2, 1.08], [5, 1.12]]);
    };
  },
};
