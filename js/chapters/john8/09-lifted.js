// J 8,25–30 — "Who are you?" — a blank name-tag with a "?" comes down over Him. "Why do I speak to you at all?" —
// His words fly out as slips of paper and drop at their feet. "What I heard from the One who sent Me I speak to the
// world" — rings of voice come down from the radiance to Him and go out from Him to a paper world. They did not
// understand: a cloud slides between them and the light. "When you lift up the Son of Man, then you will know that
// I AM" — a far plate: a hill under a golden sky and, small and quiet, a cross; the I AM beneath. "As the Father
// taught Me" — a golden page comes down into His hands. "He has not left Me alone" — the radiance rests beside Him.
// Many believed: small lights kindle over the listeners, and over two of the leaders too.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { nightStage, DC, NIGHT, voiceRings, radiance, question, nameTag, wordSlip, globe, iAm, framed, skullHill, crossSil, soulLight, hand, hanging, swing, kf, vis, tr, PI, INK } from './lib.js';

export default {
  id: 'j8-lifted',
  beats: [
    { v: 25, text: 'Powiedzieli do Niego: «Kimże Ty jesteś?»' },
    { v: 25, cont: true, text: 'Odpowiedział im Jezus: «Przede wszystkim po cóż jeszcze do was mówię?' },
    { v: 26 },
    { v: 27 },
    { v: 28, text: 'Rzekł więc do nich Jezus: «Gdy wywyższycie Syna Człowieczego, wtedy poznacie, że JA JESTEM' },
    { v: 28, cont: true, text: 'i że Ja nic od siebie nie czynię, ale że to mówię, czego Mnie Ojciec nauczył.' },
    { v: 29 },
    { v: 30 },
  ],
  cam: { x: [-60, 80], y: [-100, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const rad = lightL.add(`<g><circle r="200" fill="url(#halo-glow)"/>${radiance(c, 54)}</g>`);
    const beam = lightL.add(`<g><path d="M-50 -900L50 -900L90 0L-90 0Z" fill="#fff3cf" opacity=".35"/></g>`);
    const fx = st.fx;
    const tagQ = hanging(fx, `${nameTag(c, '   ', { size: 20, w: 90 })}<g transform="translate(0 42) scale(.9)">${question(c)}</g>`, { x: DC.JX, y: 400, len: 700 });
    const slips = Array.from({ length: 5 }, () => fx.add(wordSlip(c, 34)));
    const ringsDown = voiceRings(fx, c, { n: 3, r: 30, w: 4, both: false, color: shade(C.halo, -0.05) });
    const ringsOut = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    const world = hanging(fx, `<circle r="110" fill="url(#halo-glow)"/>${globe(c, 50)}`, { x: 560, y: 360, len: 700 });
    const cloud = fx.add(`<g>${[[-90, 0, 90, 30], [0, -16, 100, 36], [90, 4, 80, 28]].map(([x, y, a, b]) => `<path d="${c.cut(c.blob(x, y, a, b, 12, 0.18), 0.8, 6)}" fill="${mix(C.stone2, C.indigo, 0.45)}"/>`).join('')}</g>`);
    // the far plate: a hill in golden light, a small cross
    const hill = `<rect width="360" height="220" fill="${mix(C.halo, C.dawn, 0.5)}"/><circle cx="180" cy="120" r="150" fill="url(#halo-glow)"/><g transform="translate(180 150)">${skullHill(c, { w: 300, h: 90, col: mix(C.rock2, C.dune, 0.4) })}</g><g transform="translate(180 152) scale(.4)">${crossSil(c, { h: 240, figure: true, col: INK })}</g>`;
    const plate = fx.add(`<g>${framed(S, hill, { w: 360, h: 220, rim: C.wood3, k: 'far' })}</g>`);
    const am = fx.add(`<g>${iAm(c, tr('JA JESTEM', 'I AM'), { size: 28 })}</g>`);
    const page = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.rect(-30, -38, 60, 76), 0.4, 5), C.halo).x((() => { let d = ''; for (let i = 0; i < 6; i++) d += c.ribbon([[-20, -26 + i * 10], [20 - (i % 2) * 8, -26 + i * 10]], 1.6); return d; })(), C.haloRim).out()}</g>`);
    const lights = [...K.lis, K.lead[4], K.lead[5]].map(() => fx.add(`<g>${soulLight(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* v25a — "Who are you?" */
      const tk = es(t, 0.15, 0.5, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      swing(tagQ, DC.JX, 330 - (1 - tk) * 700, tk > 0.001 ? T : 0, 1.3, 0.8);
      fade(tagQ, tk > 0.001 ? 1 : 0);
      /* v25b — words that fall at their feet */
      slips.forEach((el, i) => {
        const k = seg(t, 1.15 + i * 0.1, 1.6 + i * 0.1);
        const x = lerp(DC.JX + 30, 960 + i * 30, k), y = lerp(DC.FLOOR - 180, DC.FLOOR - 150, k) + (k > 0.7 ? (k - 0.7) / 0.3 * 170 : 0) - Math.sin(Math.min(1, k / 0.7) * PI) * 40;
        vis(el, { x, y, r: k * 200 + i * 30, o: k > 0 ? 1 - es(t, 2.0, 2.2) : 0 });
      });
      /* v26 — heard from Him, spoken to the world */
      const rk = es(t, 2.05, 2.4, ease.out);
      const cover = es(t, 3.1, 3.4) * (1 - es(t, 3.95, 4.2));
      const beside = es(t, 6.05, 6.5);
      const rx = lerp(DC.JX, DC.JX + 170, beside), ry = lerp(110, 250, beside) - (1 - rk) * 400;
      vis(rad, { x: rx, y: ry, s: 1 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: rk });
      vis(beam, { x: DC.JX + 170, y: DC.FLOOR - 10, o: beside * 0.9 });
      ringsDown(DC.JX, lerp(170, 330, 0.5), bump(t, 2.15, 2.6), T, { dir: 1, s0: 0.6, spread: 1.4 });
      const wk = es(t, 2.3, 2.6, ease.out) * (1 - es(t, 3.0, 3.2, ease.in));
      swing(world, 560, 360 - (1 - wk) * 700, wk > 0.001 ? T : 0, 1.1, 0.7);
      fade(world, wk > 0.001 ? 1 : 0);
      ringsOut(DC.JX - 10, DC.FLOOR - 180, bump(t, 2.45, 2.98), T, { dir: -1, s0: 0.7, spread: 2 });
      /* v27 — they did not understand */
      vis(cloud, { x: 1000 + Math.sin(T * 0.4) * 6, y: 250, s: 0.8 + cover * 0.2, o: cover * 0.95 });
      /* v28a — the far plate and the I AM; v28b — the golden page */
      const pk = es(t, 4.05, 4.45, ease.out) * (1 - es(t, 4.95, 5.2, ease.in));
      vis(plate, { x: 1000, y: 150 - (1 - pk) * 700, r: Math.sin(T * 0.7) * 0.8 * pk, o: pk > 0.001 ? 1 : 0 });
      const ak = es(t, 4.45, 4.7, ease.back) * (1 - es(t, 4.95, 5.2));
      vis(am, { x: 1000, y: 420, s: ak, o: ak > 0.01 ? 1 : 0 });
      const pg = es(t, 5.1, 5.7);
      const [hx, hy] = hand(DC.JX, DC.FLOOR + 8, 1.06, false, 60);
      vis(page, { x: lerp(rx, hx + 10, pg), y: lerp(ry + 40, hy - 30, pg), s: 0.7 + pg * 0.3, r: (1 - pg) * 20, o: pg > 0 ? 1 - es(t, 6.0, 6.2) : 0 });
      /* v30 — many believed */
      [...K.lis, K.lead[4], K.lead[5]].forEach((m, i) => {
        const k = es(t, 7.1 + i * 0.07, 7.3 + i * 0.07, ease.back);
        const mv = i < 6 ? es(t, 7.1 + m.i * 0.05, 7.6 + m.i * 0.05) * 30 : -es(t, 7.2, 7.6) * 30;
        const [lx, ly] = [m.x + mv + 2 * m.s * (i >= 6 ? -1 : 1), m.y - 215 * m.s];
        vis(lights[i], { x: lx, y: ly + (T ? Math.sin(T * 2 + i) * 2 : 0), s: k, o: k > 0.01 ? 1 : 0 });
      });

      const talk = Math.max(bump(t, 1.05, 1.95), bump(t, 2.05, 2.95), bump(t, 4.05, 4.95), bump(t, 5.05, 5.95), bump(t, 6.05, 6.95));
      const recv = es(t, 5.3, 5.6) * (1 - es(t, 5.95, 6.1));
      K.set(T, {
        j: { flip: t > 2.4 && t < 3.0, armF: 16 + talk * 24 + recv * 44 - bump(t, 1.1, 1.9) * 6, armB: 10 + bump(t, 4.1, 4.9) * 140 + recv * 40, head: bump(t, 1.2, 1.9) * 8 - bump(t, 2.05, 2.3) * 12 - beside * 6 },
        lisF: (m) => ({ head: -4 - es(t, 7.1, 7.4) * 6, x: m.x + es(t, 7.1 + m.i * 0.05, 7.6 + m.i * 0.05) * 30 }),
        leadF: (m) => {
          const ask = m.i === 0 ? bump(t, 0.1, 0.95) : 0;
          const believe = m.i >= 4 ? es(t, 7.2, 7.6) : 0;
          return { armF: 20 + ask * 70, head: -2 - (m.i === 1 ? bump(t, 3.1, 3.9) * 10 : 0) - believe * 10, angry: (0.5 + cover * 0.3) * (1 - believe), x: m.x - believe * 30 };
        },
      });

      S.cam.x = kf(t, [[0, 20], [1.0, 20], [1.5, 60], [2.0, 20], [2.5, -40], [3.0, 20], [3.5, 60], [4.1, 60], [5, 40], [5.4, 0], [6.3, 40], [7.1, -10]]);
      S.cam.y = kf(t, [[0, -20], [1, -20], [2.1, -60], [3, -40], [4.1, -60], [5.4, -20], [7.1, -10]]);
      S.cam.z = kf(t, [[0, 1.08], [1, 1.1], [2.1, 1.02], [3, 1.06], [4.1, 1.04], [5.4, 1.1], [6.3, 1.06], [7.1, 1.06]]);
    };
  },
};
