// J 4,16–18 — handled gently. "Go, call your husband, and come back": a dotted way runs up to the town and back.
// "I have no husband": the way fades, and beside her there is only an empty, dashed outline. "You said well…":
// His open hand, a small warm light over her. "You have had five husbands, and the one you have now is not your
// husband": five thin paper rings rise softly from beside her and hang in the air, and a sixth that does not close;
// His gaze stays kind (a warm glow between them). "This you have said truly": the rings drift away like petals,
// the empty outline goes, and a small light settles at her heart as she lifts her head.
import { C, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { wellSet, wellCast, G, NOON, AFTER, hoop, brokenHoop, ghost, spark, soulLight, vis, kf, PI } from './lib.js';

export default {
  id: 'j4-husband',
  beats: [
    { v: 16 },
    { v: 17, text: 'A kobieta odrzekła Mu na to: «Nie mam męża».' },
    { v: 17, cont: true, text: 'Rzekł do niej Jezus: «Dobrze powiedziałaś: Nie mam męża.' },
    { v: 18, text: 'Miałaś bowiem pięciu mężów, a ten, którego masz teraz, nie jest twoim mężem.' },
    { v: 18, cont: true, text: 'To powiedziałaś zgodnie z prawdą».' },
  ],
  cam: { x: [-40, 120], y: [-40, 100], z: [1, 1.35] },
  build(S) {
    const c = S.c;
    const W = wellSet(S, { skyCols: NOON, sunAt: [830, 150], behind: (S) => S.layer({ par: 0.55, sh: 0, flat: true }) });
    const warm = W.behind.add(`<g><circle r="260" fill="url(#warm-glow)"/></g>`);
    const K = wellCast(S, W);
    const fx = S.layer({ par: 0.55, sh: 4 });
    // the way to the town and back
    const loop = c.cbez([G.wx + 40, 694], [1180, 700], [1260, 640], [1330, 600], 14).concat(c.cbez([1330, 600], [1290, 590], [1160, 640], [G.wx + 60, 680], 12));
    const dots = loop.map((p, i) => ({ i, el: fx.add(`<path d="${c.cut(c.ell(0, 0, 5, 3, 8), 0.2, 2)}" fill="${C.terracotta}"/>`), p }));
    const empty = fx.add(`<g>${ghost(c)}</g>`);
    const kind = fx.add(`<g>${spark(c, 12)}</g>`);
    const rings = [0, 1, 2, 3, 4].map((i) => ({ i, el: fx.add(`<g><circle r="40" fill="url(#halo-glow)" opacity=".5"/>${hoop(c, 22, [C.sun, C.haloRim, C.ochre, C.wheat, C.apricot][i])}</g>`), x: (S.portrait ? 1000 : 1060) + (i - 2) * (S.portrait ? 50 : 58) + c.rr(-8, 8), y: 330 + Math.abs(i - 2) * 26 + c.rr(-6, 6) }));
    const six = fx.add(`<g>${brokenHoop(c, 24, C.stone2)}</g>`);
    const petals = rings.map((r, i) => ({ i, el: fx.add(`<path d="${c.cut(c.ell(0, 0, 7, 4, 10), 0.3, 3)}" fill="${[C.blushVeil, C.halo, C.cream, C.roseRobe, C.wheat][i]}"/>`) }));
    const heartL = fx.add(`<g>${soulLight(c, 11)}</g>`);

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 830, sunY: 150, glow: 0.8 });
      W.sk.blend(NOON, AFTER, es(t, 3, 5) * 0.4);
      const go = es(t, 0.1, 0.35) * (1 - es(t, 0.9, 1.05));
      const low = es(t, 1.05, 1.3) * (1 - es(t, 4.1, 4.4));
      const well = es(t, 2.05, 2.3);
      const five = es(t, 3.05, 3.3);
      const truth = es(t, 4.05, 4.4);
      K.set({
        T, jF: 22 + go * 70 + well * 40 * (1 - es(t, 3.9, 4.1)) + truth * 20, jB: 12 + well * 20, jH: -3 - low * 2,
        wF: 26 + bump(t, 1.05, 1.9) * 40 + truth * 50, wB: 16 + low * 10, wH: go * -6 + low * 14 - truth * 6, wLean: low * 4 - truth * 3,
        wx: G.wx + low * 8 - truth * 12,
      });
      fade(K.w.el.querySelector('[data-part="sad"]'), low * 0.6 * (1 - well));
      // v16 — the way there and back
      dots.forEach((d) => {
        const k = es(t, 0.2 + d.i * 0.022, 0.24 + d.i * 0.022);
        vis(d.el, { x: d.p[0], y: d.p[1], s: 1, o: k * (1 - es(t, 1.05, 1.4)) });
      });
      // v17a — no husband: an empty outline beside her
      const ek = es(t, 1.2, 1.5) * (1 - es(t, 3.4, 3.8));
      vis(empty, { x: G.wx + 80, y: G.floor + 2, s: 1.02, o: ek });
      // v17b — "you said well": a warm light over her
      const sk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.05));
      const [whx, why] = K.wHead(G.wx);
      vis(kind, { x: whx + 4, y: why - 60 + Math.sin(T * 2) * 3, s: sk * 2.2, r: T * 20, o: sk > 0.01 ? 1 : 0 });
      vis(warm, { x: (G.jx + G.wx) / 2, y: 560, s: 0.6 + well * 0.5, o: Math.max(well * 0.55, truth * 0.8) });
      // v18a — five rings rise gently, and a sixth that does not close
      rings.forEach((r) => {
        const k = es(t, 3.05 + r.i * 0.1, 3.35 + r.i * 0.1, ease.out);
        const away = es(t, 4.05 + r.i * 0.05, 4.5 + r.i * 0.05);
        vis(r.el, { x: lerp(G.wx + 10, r.x, k) + away * 40, y: lerp(560, r.y, k) + Math.sin(T * 1.3 + r.i) * 4 - away * 120, s: 0.3 + k * 0.7, r: Math.sin(T + r.i) * 8, o: k > 0.01 ? (1 - away) * (0.9 - r.i * 0.06) : 0 });
        const p = petals[r.i];
        const pk = seg(t, 4.2 + r.i * 0.05, 4.9 + r.i * 0.05);
        vis(p.el, { x: r.x + 40 + pk * 90 + Math.sin(pk * 8 + r.i) * 14, y: r.y - 120 + pk * 60, r: pk * 300, o: pk > 0 && pk < 1 ? Math.sin(pk * PI) : 0 });
      });
      const sx = es(t, 3.6, 3.8);
      vis(six, { x: G.wx + 82, y: 440 + Math.sin(T * 1.5) * 3, s: sx, r: T * 6, o: sx > 0.01 ? (1 - truth) * 0.9 : 0 });
      // v18b — truth: a small light settles at her heart
      const hk = es(t, 4.3, 4.6);
      vis(heartL, { x: lerp(whx + 4, G.wx - 8, hk), y: lerp(why - 60, G.floor - 118, hk), s: 0.6 + hk * 0.6, o: hk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 30], [0.2, 90], [0.9, 90], [1.3, 60], [2.2, 30], [3.1, 70], [4.1, 50]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.2, 20], [1.3, 50], [2.2, 60], [3.1, -10], [4.1, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.2, 1.04], [1.3, 1.22], [2.2, 1.26], [3.1, 1.08], [4.1, 1.16]]);
    };
  },
};
