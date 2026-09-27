// J 14,10–11 — "I am in the Father and the Father in Me", on the dark stage as circles of light. A great ring of
// the Father's light draws itself round Jesus, and a small sun kindles in His heart. "The words I say I do not speak
// on My own": word-slips float down from the light above into Him and on from His hand to each disciple. "The Father
// who dwells in Me does His works": the signs appear on the ring, each lit by a ray from His heart. "Believe Me":
// the circles glow brighter and He opens His arms. "Or else believe because of the works": the plates of the signs
// come down from the ring and hang before the disciples, one before each pair of eyes.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { stars } from '../../assets/nature.js';
import {
  TW, DEEP, eternityRing, drawRing, radiance, glowDisc, rayBurst, wordSlip, workPlate, arcThreads, kf, vis, headAt, hand, PI,
} from './lib.js';

const JX = 800, FL = 690, RC = [800, 470], RR = 250;
const ICONS = ['jar', 'boy', 'mat', 'bread', 'eye'];

export default {
  id: 'j14-inme',
  beats: [
    { v: 10, text: 'Czy nie wierzysz, że Ja jestem w Ojcu, a Ojciec we Mnie?' },
    { v: 10, cont: true, text: 'Słów tych, które wam mówię, nie wypowiadam od siebie.' },
    { v: 10, cont: true, text: 'Ojciec, który trwa we Mnie, On sam dokonuje tych dzieł.' },
    { v: 11, text: 'Wierzcie Mi, że Ja jestem w Ojcu, a Ojciec we Mnie.' },
    { v: 11, cont: true, text: 'Jeżeli zaś nie - wierzcie przynajmniej ze względu na same dzieła!' },
  ],
  cam: { x: [-40, 40], y: [-100, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DEEP);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 700, n: 130 }));
    // light above (the source of the words)
    const topL = S.layer({ par: 0.1, sh: 0, flat: true });
    const above = topL.add(`<g>${glowDisc(220, 'halo-glow', 0.9)}<g transform="scale(.3)">${radiance(c, 150)}</g></g>`);
    // the great ring and its soft fill
    const ringL = S.layer({ par: 0.3, sh: 3 });
    const fill = ringL.add(`<g>${glowDisc(RR * 1.25, 'halo-glow', 0.85)}</g>`);
    const ring = ringL.add(`<g>${eternityRing(c, RR, 10, 32, C.haloRim)}</g>`);
    const ring2 = ringL.add(`<g>${eternityRing(c, RR + 18, 3, 32, C.halo)}</g>`);
    // floor
    const ground = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet();
    gs.p(c.cut([[-1400, FL - 6], [3200, FL - 6], [3200, 1800], [-1400, 1800]], 1, 20), mix(C.indigo, C.night2, 0.5));
    ground.add(gs.out() + `<ellipse cx="${JX}" cy="${FL + 4}" rx="240" ry="26" fill="url(#halo-glow)" opacity=".6"/>`);
    // plates of the works
    const bondL = S.layer({ par: 0.3, sh: 0, flat: true });
    const bonds = arcThreads(bondL, 12, { w: 1.6, color: C.halo });
    const rays = arcThreads(S.layer({ par: 0.45, sh: 0, flat: true }), ICONS.length, { w: 3, color: C.halo });
    const plateL = S.layer({ par: 0.46, sh: 5 });
    const plates = ICONS.map((ic, i) => {
      const a = PI * (1.1 + i * 0.2);
      return { i, a, x: RC[0] + Math.cos(a) * RR, y: RC[1] + Math.sin(a) * RR, el: plateL.add(`<g>${workPlate(c, ic, { r: 34 })}</g>`) };
    });
    // Jesus with the small sun in His heart
    const act = S.layer({ par: 0.5, sh: 6 });
    const J = S.puppet(act.add(person(c, CAST.jesus)));
    const inL = S.layer({ par: 0.5, sh: 0, flat: true });
    const sunIn = inL.add(`<g>${glowDisc(70, 'halo-glow', 1)}<g transform="scale(.13)">${radiance(c, 150)}</g></g>`);
    // the words
    const slipL = S.layer({ par: 0.52, sh: 3 });
    const slips = Array.from({ length: 6 }, (_, i) => slipL.add(`<g><circle r="22" fill="url(#halo-glow)"/>${wordSlip(c, 30)}</g>`));
    // the disciples below
    const front = S.layer({ par: 0.6, sh: 6 });
    const D = [['andrew', 430, false], ['john', 520, false], ['philip', 610, false], ['james', 990, true], ['thomas', 1080, true], ['bartholomew', 1170, true]]
      .map(([k, x, flip], i) => ({ k, x, flip, i, seed: c.rr(0, 9), p: S.puppet(front.add(person(c, { ...TW[k], pose: 'sit' }))) }));
    const G = 762;

    return (t, time) => {
      const T = time;
      const HEART = [JX + 3, FL - 128 * 1.1];
      /* v10a — the ring of the Father's light; the sun in His heart */
      const draw = es(t, 0.08, 0.5);
      drawRing(ring, draw); drawRing(ring2, es(t, 0.2, 0.62));
      const pulse = bump(t, 3.05, 3.6) + (T ? Math.sin(T * 1.4) * 0.03 : 0);
      vis(ring, { x: RC[0], y: RC[1], s: 1 + pulse * 0.04 });
      vis(ring2, { x: RC[0], y: RC[1], s: 1 + pulse * 0.06 });
      vis(fill, { x: RC[0], y: RC[1], s: 0.9 + pulse * 0.1, o: es(t, 0.2, 0.6) * (0.6 + pulse * 0.4) });
      const sun = es(t, 0.5, 0.8);
      vis(sunIn, { x: HEART[0], y: HEART[1], s: sun * (1 + pulse * 0.4), o: sun > 0.01 ? 1 : 0 });
      // v11a — golden bonds from the ring to His heart
      const bk = es(t, 3.08, 3.4) * (1 - es(t, 4.05, 4.3));
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * PI * 2 - PI / 2, rx = RC[0] + Math.cos(a) * RR, ry = RC[1] + Math.sin(a) * RR;
        const k = es(t, 3.08 + i * 0.015, 3.3 + i * 0.015);
        bonds(i, rx, ry, lerp(rx, HEART[0], k), lerp(ry, HEART[1], k), 0, bk * 0.7);
      }
      /* v10b — the words come down into Him and go out to them */
      vis(above, { x: JX, y: 150, s: 0.9 + (T ? Math.sin(T) * 0.02 : 0), o: es(t, 1.02, 1.2) * (1 - es(t, 2.1, 2.4)) });
      slips.forEach((el, i) => {
        const dn = es(t, 1.1 + i * 0.04, 1.42 + i * 0.04, ease.inOut);
        const out = es(t, 1.45 + i * 0.05, 1.8 + i * 0.05, ease.inOut);
        const d = D[i];
        const [dx, dy] = headAt(d.x, G, 0.9, d.flip, 62);
        const hx = HEART[0] + 30, hy = HEART[1] + 10;
        let x, y;
        if (out <= 0) { x = lerp(JX + (i - 2.5) * 14, HEART[0], dn); y = lerp(190, HEART[1], dn); }
        else { x = lerp(hx, dx, out); y = lerp(hy, dy - 50, out) - Math.sin(out * PI) * 70; }
        const o = dn > 0.01 ? 1 - es(t, 1.85 + i * 0.05, 2.0 + i * 0.05) : 0;
        vis(el, { x, y, s: 0.9 + out * 0.3, r: Math.sin(t * 6 + i) * 10, o });
      });
      /* v10c — the works appear on the ring, lit from His heart; v11b they come down before the disciples */
      const come = es(t, 4.1, 4.6, ease.inOut);
      plates.forEach((p) => {
        const k = es(t, 2.1 + p.i * 0.09, 2.3 + p.i * 0.09, ease.back);
        const [tx, ty] = [[450, 575], [570, 560], [800, 300], [1030, 560], [1150, 575]][p.i];
        const x = lerp(p.x, tx, come), y = lerp(p.y, ty, come);
        vis(p.el, { x, y, s: k * (0.95 + come * 0.25) * (1 + pulse * 0.05), r: T ? Math.sin(T * 0.8 + p.i) * 3 : 0, o: k > 0.01 ? 1 : 0 });
        const r = es(t, 2.15 + p.i * 0.09, 2.35 + p.i * 0.09) * (1 - come);
        rays(p.i, HEART[0], HEART[1], lerp(HEART[0], x, r), lerp(HEART[1], y, r), 20, r * 0.7);
      });
      /* people */
      const open = es(t, 3.1, 3.4) * (1 - es(t, 4.1, 4.4) * 0.5);
      J.set({ x: JX, y: FL, s: 1.1, armF: 16 + bump(t, 0.1, 0.95) * 30 + bump(t, 1.45, 1.95) * 60 + bump(t, 2.1, 2.9) * 20 + open * 50 + es(t, 4.1, 4.4) * 40, armB: 10 + bump(t, 1.05, 1.45) * 150 + bump(t, 2.1, 2.9) * 30 + open * 120, head: -bump(t, 1.05, 1.45) * 10, blink: blinkAt(T) });
      D.forEach((m) => {
        const lookUp = bump(t, 1.05, 1.5) + es(t, 2.1, 2.4) * (1 - es(t, 4.1, 4.4));
        m.p.set({ x: m.x, y: G, s: 0.9, flip: m.flip, armF: 30 + es(t, 4.4, 4.7) * 40, armB: 12 + es(t, 1.7 + m.i * 0.05, 1.9 + m.i * 0.05) * (1 - es(t, 2.4, 2.8)) * 60, head: -lookUp * 12 - open * 4, lean: open * 3, blink: blinkAt(T, m.seed) });
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -20], [1, -30], [1.5, -60], [2, 0], [3, -20], [4, 0], [5, 40]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.06], [2, 1.02], [3, 1.06], [4, 1.02], [5, 1.08]]);
    };
  },
};
