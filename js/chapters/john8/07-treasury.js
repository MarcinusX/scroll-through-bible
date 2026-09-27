// J 8,19–20 — "Where is your Father?" — the leaders look around; one lifts a little lamp and peers behind the
// lampstand, another up into the dark. "You know neither Me nor My Father" — a thread of light runs from His halo up
// to the radiance above: one light; a mist lies over their eyes. These words He spoke by the treasury — the trumpet
// chests stand beside Him and a pilgrim's coin rings in. Yet no one seized Him: two Temple guards come with hands
// out — an hourglass comes down with its sand still in the top — their hands sink and they step back.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { nightStage, DC, NIGHT, voiceRings, radiance, question, handLamp, trumpetChest, hourglassJ, templeGuard, nameTag, coin12, listener, hand, hanging, swing, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j8-treasury',
  beats: [
    { v: 19, text: 'Na to powiedzieli Mu: «Gdzie jest Twój Ojciec?»' },
    { v: 19, cont: true, text: 'Jezus odpowiedział: «Nie znacie ani Mnie, ani Ojca mego. Gdybyście Mnie poznali, poznalibyście i Ojca mego».' },
    { v: 20, text: 'Słowa te wypowiedział przy skarbcu, kiedy uczył w świątyni.' },
    { v: 20, cont: true, text: 'Mimo to nikt Go nie pojmał, gdyż godzina Jego jeszcze nie nadeszła.' },
  ],
  cam: { x: [-80, 100], y: [-100, 60], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    // the chests of the treasury, beside Him (behind the people)
    const CHX = [706, 896];
    const coin = st.act.add(`<g>${coin12(c, 7)}</g>`);
    CHX.forEach((x) => st.act.add(`<g transform="translate(${x} ${DC.FLOOR + 14}) scale(.85)">${trumpetChest(c, { h: 118, w: 64 })}</g>`));
    const rings = voiceRings(st.fx, c, { n: 3, r: 38, w: 5, both: false, color: shade(C.halo, -0.05) });
    const q = st.fx.add(`<g>${question(c)}</g>`);
    const lamp = st.fx.add(`<g>${handLamp(c, { glowR: 70 })}</g>`);
    // one light: the radiance above, and a thread down to His halo
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const rad = lightL.add(`<g><circle r="200" fill="url(#halo-glow)"/>${radiance(c, 54)}</g>`);
    const thread = lightL.add(`<path d="M0 0L0 1" stroke="${C.halo}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>`);
    const mist = st.fx.add(`<g>${[[-80, 0, 70, 16], [0, -4, 80, 18], [80, 2, 70, 16]].map(([x, y, a, b]) => `<path d="${c.cut(c.blob(x, y, a, b, 12, 0.18), 0.8, 6)}" fill="${mix(C.stone2, C.indigo, 0.4)}" opacity=".85"/>`).join('')}</g>`);
    const tag = hanging(st.fx, nameTag(c, tr('skarbiec', 'the treasury'), { size: 18 }), { x: 706, y: 470, len: 700 });
    // the guards and the hour
    const guards = [0, 1].map((i) => ({ i, p: S.puppet(st.act.add(templeGuard(c, i))) }));
    const hg = hanging(st.fx, hourglassJ(c, 110), { x: 960, y: 250, len: 700 });
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB'), stream = hg.querySelector('.sandS');

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* v19a — "Where is your Father?" */
      const look = bump(t, 0.15, 1.0);
      const qk = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.95, 1.1));
      vis(q, { x: 1040, y: 440, s: qk * 1.4, o: qk > 0.01 ? 1 : 0 });
      /* v19b — one light; the mist over their eyes */
      const rk = es(t, 1.1, 1.45, ease.out) * (1 - es(t, 2.0, 2.3) * 0.7);
      vis(rad, { x: DC.JX, y: 110 - (1 - es(t, 1.1, 1.45, ease.out)) * 400, s: 1, o: rk });
      const th = es(t, 1.35, 1.75);
      const hy = DC.FLOOR + 8 - 180 * 1.06;
      attr(thread, 'd', `M${DC.JX} ${170}L${DC.JX} ${lerp(170, hy - 30, th).toFixed(1)}`);
      attr(thread, 'opacity', th > 0.01 ? (0.85 * (1 - es(t, 2.0, 2.3) * 0.7)).toFixed(2) : 0);
      const mk = es(t, 1.4, 1.7) * (1 - es(t, 2.0, 2.3));
      vis(mist, { x: 1060, y: 520, o: mk * 0.9 });
      /* v20a — by the treasury */
      const tk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      swing(tag, 706, 470 - (1 - tk) * 700, tk > 0.001 ? T : 0, 1.2, 0.8);
      fade(tag, tk > 0.001 ? 1 : 0);
      const cf = seg(t, 2.55, 2.8);
      vis(coin, { x: lerp(650, CHX[0], cf), y: lerp(DC.FLOOR - 150, DC.FLOOR + 14 - 106 * 0.85, cf) - Math.sin(cf * PI) * 40, r: cf * 360, o: cf > 0 && cf < 1 ? 1 : 0 });
      /* v20b — the guards come, and stop; the hour has not come */
      const gIn = es(t, 3.0, 3.35);
      const gStop = es(t, 3.55, 3.8);
      const hk = es(t, 3.25, 3.55, ease.out);
      swing(hg, 960, 260 - (1 - hk) * 700, hk > 0.001 ? T : 0, 1, 0.7);
      fade(hg, hk > 0.001 ? 1 : 0);
      pose(sandT, { y: 0, sy: 0.92 });
      pose(sandB, { y: 55, sy: 0.22 });
      fade(stream, 1);
      guards.forEach((g) => {
        const x = lerp(1320 + g.i * 70, 950 + g.i * 70, gIn) + gStop * 50;
        const reach = es(t, 3.2, 3.45) * (1 - gStop);
        g.p.set({ x, y: DC.FLOOR + 30 - g.i * 10, s: 1.06 - g.i * 0.04, flip: true, walk: (gIn > 0 && gIn < 1) || (gStop > 0 && gStop < 1) ? x * 0.06 : undefined, armF: 20 + reach * 70, armB: 10 + reach * 40, head: gStop * 6, o: es(t, 2.95, 3.05), blink: blinkAt(T, g.i + 4) });
      });

      const talk = Math.max(bump(t, 1.05, 1.95), bump(t, 2.1, 2.95));
      K.set(T, {
        j: { armF: 16 + talk * 30 + bump(t, 1.2, 1.9) * 20, armB: 10 + bump(t, 1.2, 1.9) * 140, head: -bump(t, 1.2, 1.9) * 10, flip: t > 2.05 && t < 2.95 },
        lisF: (m) => ({ head: -4 - bump(t, 1.2, 1.9) * 6, armF: 14 + (m.i === 3 ? bump(t, 2.35, 2.75) * 80 : 0) }),
        leadF: (m) => {
          const i = m.i;
          const h = i === 0 ? 0 : i === 1 ? -look * 22 : i === 2 ? look * 10 : -look * 12;
          const fl = !(look > 0.4 && (i === 2 || i === 4));
          return { head: h, flip: fl, armF: 20 + (i === 0 ? look * 60 : 0) + (gIn > 0 ? es(t, 3.0, 3.3) * 10 : 0), armB: 10 + (i === 3 ? look * 40 : 0), angry: 0.4 };
        },
      });
      const lead0 = K.lead[0];
      const [lx, ly] = hand(lead0.x, lead0.y, lead0.s, true, 20 + look * 60);
      vis(lamp, { x: lx, y: ly, s: 0.9, o: look > 0.05 ? 1 : 0 });
      rings(DC.JX + 4, DC.FLOOR - 170, talk, T, { dir: t > 2.05 && t < 2.95 ? -1 : 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, 60], [1.0, 40], [1.3, 0], [2.0, 0], [2.3, -60], [2.95, -50], [3.3, 60], [4, 60]]);
      S.cam.y = kf(t, [[0, 0], [1.1, -80], [1.9, -60], [2.3, 20], [3.1, 0], [3.4, -20]]);
      S.cam.z = kf(t, [[0, 1.1], [1.1, 1.0], [2.0, 1.02], [2.3, 1.16], [3.0, 1.12], [3.4, 1.08]]);
    };
  },
};
