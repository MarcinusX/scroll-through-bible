// J 4,13–15 — a shadow-play screen comes down over the well. "Everyone who drinks this water will thirst again":
// a shadow drinks from the jar, the little sun crosses the screen, and he wilts and goes back to the jar again.
// "Whoever drinks the water I give will never thirst": a stream of light reaches him and he stands straight while
// the sun goes over; "…it will become in him a spring welling up to eternal life": a spring of light rises in his
// chest and plays up out of him in a fountain, drops of light climbing to the stars at the top of the screen.
// Then the screen goes up: "Sir, give me this water" — she holds out her empty jar to Him.
import { C, pose, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';

import { wellSet, wellCast, G, NOON, shadowPerson, SAM, hydria, cupJ, thought, footprint, vis, hanging, kf, PI } from './lib.js';

const INK = '#3b2a22';
const SCR = { x: 850, y: 110, w: 660, h: 340 };
const GY = 290;                                     // the ground line on the screen (local)

export default {
  id: 'j4-spring',
  beats: [
    { v: 13 },
    { v: 14, text: 'Kto zaś będzie pił wodę, którą Ja mu dam, nie będzie pragnął na wieki,' },
    { v: 14, cont: true, text: 'lecz woda, którą Ja mu dam, stanie się w nim źródłem wody wytryskającej ku życiu wiecznemu».' },
    { v: 15 },
  ],
  cam: { x: [-40, 60], y: [-80, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const W = wellSet(S, { skyCols: NOON, sunAt: [1250, 140] });
    const K = wellCast(S, W);

    /* ---------- the screen ---------- */
    const scrL = S.layer({ par: 0.5, sh: 6 });
    const clip = S.id('scr');
    const pts = [[-SCR.w / 2, 0], [SCR.w / 2, 0], [SCR.w / 2, SCR.h]];
    for (let x = SCR.w / 2; x > -SCR.w / 2; x -= 40) pts.push(...c.arc(x - 20, SCR.h, 20, 10, 0, PI, 4));
    const cloth = c.cut(pts, 0.8, 10);
    let stars = '';
    for (let i = 0; i < 16; i++) stars += c.poly(c.star(c.rr(-SCR.w / 2 + 30, SCR.w / 2 - 30), c.rr(20, 90), c.rr(3, 6), 1.4, 4, 0));
    const ground = c.ridge(c.wave(GY, [4, 2], [200, 60]), -SCR.w / 2 - 20, SCR.w / 2 + 20, SCR.h + 20, 10, 0.8);
    const scr = hanging(scrL, `<defs><clipPath id="${clip}"><path d="${cloth}"/></clipPath></defs><g clip-path="url(#${clip})"><path d="${cloth}" fill="#f3dcae"/><circle data-k="sGlow" cx="0" cy="${SCR.h * 0.5}" r="${SCR.w * 0.55}" fill="url(#warm-glow)" opacity=".7"/><g data-k="stars" opacity="0"><path d="${stars}" fill="${C.star}"/></g><path d="${ground}" fill="${INK}"/><g transform="translate(-200 ${GY})">${hydria(c, { col: INK })}</g></g><path d="${c.ribbon([[-SCR.w / 2 - 10, 2], [SCR.w / 2 + 10, 2]], 10)}" fill="${C.wood2}"/>`, { x: SCR.x, y: SCR.y, len: 800 });
    const sGlow = S.$('sGlow'), starsEl = S.$('stars');
    const shL = S.layer({ par: 0.5, sh: 0, flat: true });
    const sunS = shL.add(`<g><path d="${c.cut(c.star(0, 0, 26, 19, 14, 0), 0.3, 4)}" fill="${INK}"/></g>`);
    const heat = [0, 1, 2].map((i) => shL.add(`<path d="${c.ribbon(c.cbez([0, 0], [8, -14], [-8, -28], [0, -42], 10), 2.4)}" fill="${INK}" opacity="0"/>`));
    const man = S.puppet(shL.add(shadowPerson(c, { ...SAM, holdF: cupJ(c, INK) }, INK)));
    const beam = shL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [120, -60], [220, 20], 20), 60)}" fill="#fff2c8" opacity=".35"/><path d="${c.ribbon(c.qbez([0, 0], [120, -60], [220, 20], 20), 24)}" fill="#dff2f4" opacity=".9"/><path d="${c.ribbon(c.qbez([0, -2], [120, -62], [220, 18], 20), 6)}" fill="#fff"/></g>`);
    const coreGlow = shL.add(`<g><circle r="70" fill="url(#halo-glow)"/><circle r="12" fill="#e9f8fa"/></g>`);
    const arcs = [-1, 1].map((d) => c.ribbon(c.cbez([0, -150], [d * 30, -190], [d * 70, -170], [d * 90, -60], 16), (u) => 14 - u * 11)).join('') + [-1, 1].map((d) => c.ribbon(c.cbez([0, -150], [d * 16, -200], [d * 40, -200], [d * 50, -110], 12), (u) => 9 - u * 7)).join('');
    const jet = shL.add(`<g><circle cy="-120" r="130" fill="url(#halo-glow)"/><path d="${c.ribbon([[0, 0], [3, -50], [-3, -100], [0, -160]], (u) => 22 - u * 10)}" fill="#dff2f4"/><path d="${arcs}" fill="#dff2f4"/><path d="${c.ribbon([[0, -4], [1, -150]], 6)}" fill="#fff"/></g>`);
    const drops = Array.from({ length: 12 }, (_, i) => ({ i, el: shL.add(`<g><circle r="22" fill="url(#halo-glow)"/><path d="${c.cut([[0, -12], [7, 2], [0, 8], [-7, 2]], 0.2, 3)}" fill="#f4fbfc"/></g>`), dx: c.rr(-160, 160), ph: i / 12 }));

    // v15 — her wish: no more trips to the well
    const fx = S.layer({ par: 0.55, sh: 5 });
    const trips = fx.add(`<g>${thought(c, `<g transform="translate(-30 10) scale(.4)">${hydria(c)}</g>${[0, 1, 2, 3].map((i) => `<g transform="translate(${-4 + i * 13} ${14 - i * 9}) rotate(-40) scale(.5)">${footprint(c, i % 2 === 0)}</g>`).join('')}<path d="${c.ribbon([[-40, 22], [44, -26]], 4)}" fill="${C.terracotta}"/>`, { w: 110, h: 80 })}</g>`);

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 1250, sunY: 140, glow: 0.8 });
      const down = es(t, -0.3, 0.2, ease.out) * (1 - es(t, 3.0, 3.35, ease.in));
      const sy = SCR.y - (1 - down) * 800;
      pose(scr, { x: SCR.x, y: sy });
      const on = down > 0.01 ? 1 : 0;
      const O = (x, y) => [SCR.x + x, sy + y];

      /* v13 — drink, thirst, drink again */
      const cyc = seg(t, 0.1, 0.95);                  // two days go by in the beat
      const day = (cyc * 2) % 1;
      const drinking = t < 1 ? Math.max(bump(cyc, 0.0, 0.2), bump(cyc, 0.5, 0.7)) : 0;
      const thirst = t < 1 ? Math.max(bump(cyc, 0.2, 0.5), bump(cyc, 0.7, 1.0)) : 0;
      const given = es(t, 1.05, 1.3);
      const spring = es(t, 2.05, 2.4);
      // the little sun crosses the screen (days)
      const sd = t < 1 ? day : seg(t, 1.3, 2.0);
      const [sx0, sy0] = O(lerp(-SCR.w / 2 + 40, SCR.w / 2 - 40, sd), 150 - Math.sin(sd * PI) * 110);
      vis(sunS, { x: sx0, y: sy0, r: T * 20, o: on * (t < 2.05 ? 1 : 1 - spring) });
      heat.forEach((h, i) => {
        const [hx, hy] = O(-40 + i * 40, GY - 150 - ((T * 20 + i * 12) % 16));
        vis(h, { x: hx, y: hy, o: on * thirst * 0.7 * (1 - given) });
      });
      const [mx, my] = O(-40, GY + 4);
      man.set({
        x: mx, y: my, s: 0.9, flip: true, o: on,
        armF: 30 + drinking * 110 + given * 70 * (1 - spring) + spring * 30, armB: 10 + spring * 140, head: -drinking * 18 + thirst * 16 * (1 - given) - spring * 16, lean: thirst * 10 * (1 - given) - spring * 3,
      });
      fade(sGlow, on * (0.6 + given * 0.3 + spring * 0.1));
      fade(starsEl, spring);
      // v14a — the stream of light from Him reaches the shadow
      const bk = es(t, 1.05, 1.35) * (1 - es(t, 2.9, 3.1));
      const [bx, by] = O(-SCR.w / 2 + 10, GY - 190);
      vis(beam, { x: bx, y: by, sx: bk, s: 1, o: on * bk });
      // v14b — the spring rises within him and plays up out of him
      const [cx, cy] = O(-38, GY - 110);
      vis(coreGlow, { x: cx, y: cy, s: 0.4 + spring * 0.8 + Math.sin(T * 3) * 0.05 * spring, o: on * Math.max(given * 0.5, spring) });
      vis(jet, { x: cx, y: cy + 10, sy: spring * (1 + Math.sin(T * 6) * 0.04), s: 1, o: on * spring > 0.01 ? 1 : 0 });
      drops.forEach((d) => {
        const k = (T * 0.35 + d.ph) % 1;
        vis(d.el, { x: cx + d.dx * k, y: cy - 150 - k * 110, s: 0.6 + (1 - k) * 0.5, o: on * spring * Math.sin(k * PI) });
      });

      /* v15 — she holds out her jar */
      const ask = es(t, 3.1, 3.4);
      K.set({
        T, jF: 22 + bump(t, 0.1, 0.9) * 30 + es(t, 1.05, 1.3) * 40 * (1 - es(t, 2.9, 3.1)), jB: 12 + spring * 20 * (1 - ask), jH: -2,
        wF: 30 + ask * 60, wB: 20 + ask * 70, wH: -4 - ask * 6 + es(t, 0.2, 0.6) * -6 * (1 - ask), wLean: ask * 6, wx: G.wx - ask * 30,
        jarAt: ask > 0.01 ? { x: lerp(K.RIM.x, G.wx - 96, ask), y: lerp(K.RIM.y, 640, ask), s: 0.78, r: -ask * 14 } : undefined,
      });
      const [whx, why] = K.wHead(G.wx - 30);
      const tk = es(t, 3.45, 3.65, ease.back);
      vis(trips, { x: whx + 12, y: why - 16, s: tk, o: tk > 0.01 ? 1 : 0 });

      S.cam.y = kf(t, [[-0.5, 0], [0.2, -40], [2.9, -40], [3.3, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [0.2, 1.04], [2.0, 1.08], [2.9, 1.1], [3.3, 1.2]]);
      S.cam.x = kf(t, [[-0.5, 20], [0.2, 30], [3.3, 30]]);
    };
  },
};
