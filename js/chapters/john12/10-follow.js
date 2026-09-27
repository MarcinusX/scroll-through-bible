// J 12,26–27 — the court in the late afternoon. "Whoever serves Me, let him follow Me": Jesus walks and His
// footprints glow on the paving; Philip, Andrew and John step into them. "Where I am, there my servant will be": a
// pool of light spreads round Him until it takes them in. "The Father will honour him": the radiance comes near and
// lowers a golden wreath onto the one who serves. Then the light dims and a cloud crosses: "Now My soul is
// troubled" — He stands still, head bowed. "Father, save Me from this hour" — He looks up; the emptied hourglass
// hangs before Him. "But for this very reason I came to this hour" — He steps forward into it, and it kindles gold.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { courtStage, CT, GOLDEN, PHILIP, ANDREW, people, place, radiance, laurel, hangGlass, nameTag, hanging, swing, kf, vis, headAt, voiceRings, glowDisc, tr, PI } from './lib.js';

export default {
  id: 'j12-follow',
  beats: [
    { v: 26, text: 'A kto by chciał Mi służyć, niech idzie za Mną,' },
    { v: 26, cont: true, text: 'a gdzie Ja jestem, tam będzie i mój sługa.' },
    { v: 26, cont: true, text: 'A jeśli ktoś Mi służy, uczci go mój Ojciec.' },
    { v: 27, text: 'Teraz dusza moja doznała lęku i cóż mam powiedzieć?' },
    { v: 27, cont: true, text: 'Ojcze, wybaw Mnie od tej godziny.' },
    { v: 27, cont: true, text: 'Nie, właśnie dlatego przyszedłem na tę godzinę.' },
  ],
  cam: { x: [-40, 80], y: [-80, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const st = courtStage(S, { skyCols: GOLDEN, sunAt: [1200, 220] });
    const F = CT.FLOOR;
    // a cloud that crosses the sun
    const cloudL = S.layer({ par: 0.05, sh: 3 });
    const dark = cloudL.add(`<g>${[[-110, 0, 110, 38], [0, -20, 130, 46], [110, 4, 100, 34]].map(([x, y, a, b]) => `<path d="${c.cut(c.blob(x, y, a, b, 12, 0.18), 0.8, 6)}" fill="${mix(C.storm, C.duskViolet, 0.4)}"/>`).join('')}</g>`);
    const pool = st.glowL.add(`<g><ellipse rx="170" ry="40" fill="url(#halo-glow)"/><ellipse rx="120" ry="24" fill="url(#halo-glow)"/></g>`);
    const steps = Array.from({ length: 8 }, (_, i) => ({ i, x: 1000 - i * 26 + (i % 2) * 4, y: F + 10 + (i % 2 ? 6 : -4), el: st.glowL.add(`<g>${sheet().p(c.cut(c.ell(0, 0, 9, 4, 10, 0), 0.2, 3), C.haloRim).out()}<circle r="14" fill="url(#halo-glow)"/></g>`) }));
    const fol = people(S, st.act, [{ x: 1080, y: F, s: 0.98, flip: true, look: PHILIP }, { x: 1150, y: F - 6, s: 0.96, flip: true, look: ANDREW }, { x: 1220, y: F + 4, s: 0.98, flip: true, look: CAST.john }], 'f');
    const jesus = S.puppet(st.act.add(person(c, CAST.jesus)));
    const fx = st.fx;
    const rad = fx.add(`<g><circle r="170" fill="url(#halo-glow)"/>${radiance(c, 64)}</g>`);
    const wreath = fx.add(`<g><circle r="40" fill="url(#halo-glow)"/>${laurel(c, 22, C.sun)}</g>`);
    const tagS = hanging(fx, nameTag(c, tr('mój sługa', 'my servant'), { size: 15 }), { x: 960, y: 420, len: 700 });
    const hgL = S.layer({ par: 0.34, sh: 5 });
    const hg = hangGlass(hgL, c, 130);
    const hgGlow = hgL.add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);
    const vL = S.layer({ par: 0.52, sh: 2 });
    const rings = voiceRings(vL, c, { n: 3, r: 32, w: 5, color: shade(C.haloRim, 0.1) });
    st.front();

    return (t, time) => {
      const T = time;
      const trouble = es(t, 3.05, 3.4) * (1 - es(t, 5.1, 5.6));
      swing(st.sunEl, 1200, 220 + es(t, 0, 6) * 40, T, 1, 0.7);
      swing(st.cl1, 470, 140, T, 1.2, 0.6, 1);
      pose(dark, { x: lerp(1500, 1180, es(t, 3.0, 3.5)) - es(t, 5.1, 5.8) * 500, y: 230, o: es(t, 3.0, 3.2) * (1 - es(t, 5.5, 5.8)) });
      st.dim.fade(trouble * 0.8);
      /* v26a — He walks; they follow in His steps */
      const w = es(t, 0.1, 0.8);
      const jx = lerp(1000, 800, w);
      const bow = es(t, 3.1, 3.4) * (1 - es(t, 3.95, 4.1));
      const look = es(t, 4.05, 4.3) * (1 - es(t, 5.05, 5.2));
      const resolve = es(t, 5.1, 5.45);
      jesus.set({ x: jx - resolve * 30, y: F + 8, s: 1.04, flip: true, walk: (w > 0 && w < 1) || (resolve > 0 && resolve < 1) ? jx * 0.055 + resolve * 6 : undefined, armF: 16 + bump(t, 1.1, 1.9) * 40 + bow * 20 + look * 60 + resolve * 40, armB: 10 + look * 120 + bump(t, 2.1, 2.8) * 30, head: -2 + bow * 14 - look * 16 - resolve * 4, lean: bow * 4, blink: bow > 0.5 ? 1 : blinkAt(T) });
      steps.forEach((s) => { const k = es(t, 0.15 + s.i * 0.07, 0.3 + s.i * 0.07); vis(s.el, { x: s.x - 200 * 0 , y: s.y, o: k * (1 - trouble * 0.7) }); });
      fol.forEach((m, i) => {
        const k = es(t, 0.35 + i * 0.08, 0.95 + i * 0.05);
        const x = lerp(m.x, 890 + i * 70, k) + es(t, 1.05, 1.4) * -10 * (i === 0 ? 1 : 0);
        place(m, T, { x, walk: k > 0 && k < 1 ? x * 0.06 + i : undefined, armF: 10 + (i === 0 ? bump(t, 2.3, 2.9) * 30 : 0), head: -2 + (i === 0 ? es(t, 2.2, 2.5) * -8 * (1 - es(t, 2.95, 3.1)) : 0) + trouble * 6, blink: blinkAt(T, m.seed) });
        m.cx = x;
      });
      /* v26b — where I am, there My servant */
      const pk = es(t, 1.05, 1.5) * (1 - trouble * 0.8);
      vis(pool, { x: 800 + pk * 70, y: F + 12, sx: 0.5 + pk * 1.3, sy: 0.6 + pk * 0.6, o: pk > 0.01 ? 0.9 : 0 });
      const sk = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      swing(tagS, 890, 400 - (1 - sk) * 700, sk > 0.001 ? T : 0, 1.2, 0.8); fade(tagS, sk > 0.001 ? 1 : 0);
      /* v26c — the Father honours him: the radiance and the wreath */
      const rk = es(t, 2.05, 2.35) * (1 - es(t, 2.95, 3.2));
      vis(rad, { x: 900, y: 220 + (1 - rk) * -200, s: 1 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: rk });
      const wk = es(t, 2.3, 2.7);
      const [shx, shy] = headAt(fol[0].cx ?? 890, F, 0.98, true);
      vis(wreath, { x: lerp(900, shx, wk), y: lerp(270, shy - 20, wk), o: wk > 0.01 ? 1 - es(t, 3.2, 3.4) * 0.7 : 0 });
      /* v27 — the hour */
      const hk = es(t, 4.05, 4.4, ease.out);
      hg.set(760, 250 - (1 - hk) * 600, 0, 0, hk > 0.001 ? T : 0, hk > 0.001 ? 1 : 0);
      const gold = es(t, 5.2, 5.6);
      vis(hgGlow, { x: 760, y: 250, s: 0.5 + gold * 0.8, o: gold });
      const [jhx, jhy] = headAt(jx, F + 8, 1.04, true);
      rings(jhx - 14, jhy + 6, bump(t, 4.1, 4.95) + bump(t, 5.2, 5.95), T, { dir: -1 });

      S.cam.x = kf(t, [[0, 40], [1, 20], [2.1, 30], [3.1, 0], [4, 0], [5, -10], [6, -10]]);
      S.cam.y = kf(t, [[0, 0], [2, -40], [3, 0], [4.1, -40], [5.1, -30]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.08], [2.1, 1.04], [3.1, 1.16], [4, 1.06], [5.1, 1.08], [6, 1.12]]);
    };
  },
};
