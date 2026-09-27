// J 8,14–18 — "My testimony is true, for I know where I came from and where I am going": the red cross drops off
// the card, and a path of light is drawn from high above down to Him and on up again. "You do not know" — a mist
// hangs over the leaders. "You judge by the flesh" — a pair of scales comes down over them with a mask on the pan;
// "I judge no one" — His hands stay open. "I am not alone" — a radiance of the One who sent Him comes to rest
// beside Him (light, never a figure), and the scales hang level. "The testimony of two is true" — a scroll of the
// Law with two little witnesses; "I … and the Father" — a tag "1" over Him, a tag "2" over the light, and a tick.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { nightStage, DC, NIGHT, voiceRings, radiance, crossX, tick, mask, scalesParts, poseScales, lightPath, drawPath, numberCard, strip, shadowPerson, INK, CAST, hanging, swing, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j8-witness',
  beats: [
    { v: 14, text: 'W odpowiedzi rzekł do nich Jezus: «Nawet jeżeli Ja sam o sobie wydaję świadectwo, świadectwo moje jest prawdziwe, bo wiem skąd przyszedłem i dokąd idę.' },
    { v: 14, cont: true, text: 'Wy zaś nie wiecie, ani skąd przychodzę, ani dokąd idę.' },
    { v: 15 },
    { v: 16 },
    { v: 17 },
    { v: 18 },
  ],
  cam: { x: [-60, 80], y: [-100, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const rings = voiceRings(st.fx, c, { n: 3, r: 38, w: 5, both: false, color: shade(C.halo, -0.05) });
    // the card from before, with its cross
    const card = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-90, 0, 180, 150), 0.6, 8), C.cream).p(c.cut(c.rect(-82, 8, 164, 134), 0.4, 8), C.parchment);
      return `<path d="M-60 -1600V2M60 -1600V2" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<g transform="translate(-6 128) scale(.5)">${shadowPerson(c, { ...CAST.jesus, halo: false }, INK)}</g><path d="${c.ribbon(c.arc(4, 52, 34, 26, -0.6, PI * 1.35, 14), 3)}" fill="${C.terracotta}"/>`;
    })();
    const cardEl = st.fx.add(`<g>${card}</g>`);
    const xEl = st.fx.add(`<g>${crossX(c, 46)}</g>`);
    // whence and whither: a path of light from above, down to Him and up again
    const arcL = S.layer({ par: 0.5, sh: 2 });
    const pathIn = arcL.add(lightPath(c.line(c.cbez([600, -120], [560, 200], [700, 420], [792, 470], 30)), { w: 6 }));
    const pathOut = arcL.add(lightPath(c.line(c.cbez([808, 470], [900, 420], [1040, 200], [1000, -120], 30)), { w: 6 }));
    const tagFrom = st.fx.add(`<g>${strip(c, tr('skąd przyszedłem', 'where I came from'), { size: 17 })}</g>`);
    const tagTo = st.fx.add(`<g>${strip(c, tr('dokąd idę', 'where I am going'), { size: 17 })}</g>`);
    // the mist of not knowing
    const mist = st.fx.add(`<g>${[[-60, 0, 60, 26], [0, -12, 70, 30], [60, 4, 54, 24], [10, 14, 80, 20]].map(([x, y, a, b]) => `<path d="${c.cut(c.blob(x, y, a, b, 12, 0.18), 0.8, 6)}" fill="${mix(C.stone2, C.indigo, 0.35)}" opacity=".85"/>`).join('')}<text x="0" y="12" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="34" font-style="italic" fill="${C.cream}">?</text></g>`);
    // the scales of the flesh
    const SP = scalesParts(c, { arm: 100, drop: 60 });
    const sc = { frame: st.fx.add(`<g>${SP.frame}</g>`), beam: st.fx.add(`<g>${SP.beam}</g>`), panL: st.fx.add(`<g>${SP.pan}<g transform="translate(0 ${SP.drop - 20})">${mask(c, { r: 18, stick: false, col: C.stone })}</g></g>`), panR: st.fx.add(`<g>${SP.pan}</g>`) };
    // the One who sent Him: a radiance
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const rad = lightL.add(`<g><circle r="210" fill="url(#halo-glow)"/>${radiance(c, 62)}</g>`);
    const beam = lightL.add(`<g><path d="M-50 -900L50 -900L90 0L-90 0Z" fill="#fff3cf" opacity=".35"/></g>`);
    // the Law: two witnesses; the tags "1" and "2"; the tick
    const law = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-110, -44, 220, 88), 0.5, 6), C.parchment);
      s.p(c.cut(c.ell(-114, 0, 8, 48, 12), 0.3, 4) + c.cut(c.ell(114, 0, 8, 48, 12), 0.3, 4), C.wood2);
      const w1 = `<g transform="translate(-34 34) scale(.28)">${shadowPerson(c, { robe: C.dustyBlue, hairStyle: 'wrap', beard: 'full' }, INK)}</g>`;
      const w2 = `<g transform="translate(34 34) scale(-.28 .28)">${shadowPerson(c, { robe: C.sageRobe, hairStyle: 'short', beard: 'short' }, INK)}</g>`;
      return `<path d="M-80 -1600V-44M80 -1600V-44" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${w1}${w2}<text x="0" y="-18" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${C.terracotta}">2</text>`;
    })();
    const lawEl = st.fx.add(`<g>${law}</g>`);
    const lawTick = st.fx.add(`<g>${tick(c, 22)}</g>`);
    const one = hanging(st.fx, numberCard(c, '1', { size: 30 }), { x: DC.JX, y: 330, len: 700 });
    const two = hanging(st.fx, numberCard(c, '2', { size: 30 }), { x: DC.JX + 170, y: 250, len: 700 });
    const tk = st.fx.add(`<g>${tick(c, 30)}</g>`);

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* v14a — the cross falls away, the path of light */
      const cardK = 1 - es(t, 0.7, 1.0, ease.in);
      vis(cardEl, { x: 1060, y: 250 - (1 - cardK) * 700, r: Math.sin(T * 0.8) * 1.2 * cardK, o: cardK > 0.001 ? 1 : 0 });
      const xf = es(t, 0.15, 0.55, ease.in);
      vis(xEl, { x: 1060 + xf * 30, y: 330 + xf * 420, s: 1.4, r: -8 + xf * 90, o: 1 - seg(t, 0.5, 0.55) });
      const pin = es(t, 0.3, 0.7), pout = es(t, 0.6, 0.95);
      drawPath(pathIn, pin); drawPath(pathOut, pout);
      arcL.fade(1 - es(t, 2.0, 2.3));
      vis(tagFrom, { x: 640, y: 150, s: 1, r: -5, o: es(t, 0.45, 0.6) * (1 - es(t, 2.0, 2.3)) });
      vis(tagTo, { x: 960, y: 150, s: 1, r: 5, o: es(t, 0.8, 0.95) * (1 - es(t, 2.0, 2.3)) });
      /* v14b — the mist over them */
      const mk = es(t, 1.1, 1.4) * (1 - es(t, 2.0, 2.3));
      vis(mist, { x: 1060 + Math.sin(T * 0.5) * 6, y: 470, s: 0.6 + mk * 0.4, o: mk * 0.95 });
      /* v15 — the scales of the flesh; v16 — level in the light */
      const sk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 3.85, 4.1, ease.in));
      const tilt = 16 * (1 - es(t, 3.2, 3.55));
      poseScales(sc, 1060, 300 - (1 - sk) * 700, tilt + (sk > 0.01 && T ? Math.sin(T * 0.9) * 1.2 : 0), sk > 0.001 ? 1 : 0, 1, 100);
      const rk = es(t, 3.05, 3.45, ease.out);
      vis(rad, { x: DC.JX + 170, y: 250 - (1 - rk) * 500, s: 0.9 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: rk });
      vis(beam, { x: DC.JX + 170, y: DC.FLOOR - 10, o: rk * (1 - es(t, 4.0, 4.3) * 0.5) });
      /* v17 — the two witnesses of the Law */
      const lk = es(t, 4.05, 4.4, ease.out) * (1 - es(t, 4.95, 5.2, ease.in));
      vis(lawEl, { x: 1060, y: 330 - (1 - lk) * 700, r: Math.sin(T * 0.7) * lk, o: lk > 0.001 ? 1 : 0 });
      const lt = es(t, 4.5, 4.65, ease.back) * (1 - es(t, 4.95, 5.2));
      vis(lawTick, { x: 1160, y: 300, s: lt, o: lt > 0.01 ? 1 : 0 });
      /* v18 — "1" over Him, "2" over the light, a tick */
      const k1 = es(t, 5.1, 5.4, ease.out), k2 = es(t, 5.35, 5.65, ease.out);
      swing(one, DC.JX, 300 - (1 - k1) * 700, k1 > 0.001 ? T : 0, 1, 0.8);
      fade(one, k1 > 0.001 ? 1 : 0);
      swing(two, DC.JX + 170, 165 - (1 - k2) * 700, k2 > 0.001 ? T : 0, 1, 0.8, 1);
      fade(two, k2 > 0.001 ? 1 : 0);
      const tt = es(t, 5.65, 5.8, ease.back);
      vis(tk, { x: DC.JX + 90, y: 250, s: tt * 1.3, o: tt > 0.01 ? 1 : 0 });

      const talk = Math.max(bump(t, 0.05, 1.0), bump(t, 2.5, 3.0), bump(t, 3.1, 3.95), bump(t, 4.05, 4.95), bump(t, 5.05, 5.95));
      const open = bump(t, 2.5, 3.0);
      const toLight = es(t, 3.3, 3.6) * (1 - es(t, 4.0, 4.2)) + es(t, 5.35, 5.6);
      K.set(T, {
        j: {
          armF: 16 + talk * 30 - open * 10 + toLight * 20, armB: 10 + bump(t, 0.3, 0.95) * 150 + open * 40 + toLight * 70, head: -bump(t, 0.3, 0.95) * 10 - toLight * 8,
        },
        lisF: (m) => ({ head: -4, armF: 14 + (m.i === 1 ? bump(t, 4.1, 4.9) * 30 : 0) }),
        leadF: (m) => ({
          head: -2 + bump(t, 1.1, 1.9) * (m.i % 2 ? 8 : -8) + bump(t, 2.05, 2.9) * -12, flip: !(bump(t, 1.1, 1.9) > 0.5 && m.i % 2),
          armF: 20 + (m.i === 0 ? bump(t, 2.1, 2.9) * 60 : 0), armB: 10 + (m.i === 1 ? bump(t, 1.2, 1.8) * 40 : 0), angry: 0.5 - bump(t, 1.1, 1.9) * 0.3,
        }),
      });
      rings(DC.JX + 4, DC.FLOOR - 170, talk, T, { dir: 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, 0], [0.9, 0], [1.2, 50], [2.0, 40], [2.4, 50], [3.0, 30], [3.4, 20], [4.1, 40], [5.0, 30], [5.3, 10]]);
      S.cam.y = kf(t, [[0, -60], [0.9, -40], [1.2, 0], [2.0, -20], [3.4, -40], [4.1, -20], [5.1, -40]]);
      S.cam.z = kf(t, [[0, 1.0], [0.9, 1.02], [1.2, 1.12], [2.0, 1.08], [3.4, 1.06], [4.1, 1.1], [5.1, 1.06]]);
    };
  },
};
