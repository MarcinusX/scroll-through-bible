// J 4,31–34 — meanwhile the disciples spread out the bread and fish and figs they bought: Peter kneels and holds out
// a loaf — "Rabbi, eat!" "I have food to eat that you do not know about": a covered dish comes down beside Him,
// light leaking from under its lid. They whisper to one another — did someone bring Him something? (in a thought: a
// stranger with a basket) — Andrew peers into their own basket. "My food is to do the will of Him who sent me": the
// lid lifts and a beam of light falls from above on Jesus; a scroll with a sun-seal unrolls in it — the will. "…and
// to accomplish His work": He turns and shows them the people already coming down the road from the town.
import { C, person, CAST, blinkAt, pose, sheet, shade } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { wellSet, wellCast, G, AFTER, DISC, samaritan, loaf, bowl, basket, fishCut, say, speech, thought, GLYPH, vis, kf, headAt, along, hanging, swing, PI } from './lib.js';

const ROAD = [[1700, 632], [1560, 646], [1440, 660], [1330, 672]];

export default {
  id: 'j4-food',
  beats: [
    { v: 31 },
    { v: 32 },
    { v: 33 },
    { v: 34, text: 'Powiedział im Jezus: «Moim pokarmem jest wypełnić wolę Tego, który Mnie posłał,' },
    { v: 34, cont: true, text: 'i wykonać Jego dzieło.' },
  ],
  cam: { x: [-40, 120], y: [-60, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    let beamL;
    const W = wellSet(S, { skyCols: AFTER, sunAt: [980, 170], behind: (S) => { beamL = S.layer({ par: 0.55, sh: 0, flat: true }); return beamL; } });
    const beam = beamL.add(`<g><path d="M-60 -900L60 -900L150 40L-150 40Z" fill="#fff4d0" opacity=".6"/><circle cy="-40" r="170" fill="url(#halo-glow)"/></g>`);
    // townsfolk far up the road (the work)
    const folk = Array.from({ length: 7 }, (_, i) => ({ i, p: S.puppet(W.actL.add(person(c, samaritan(c, i + 70)))), d: i * 0.1 }));
    const K = wellCast(S, W, { bucket: true });
    const L = W.actL;
    // the meal on a cloth
    L.add(sheet().p(c.cut([[860, G.floor + 16], [1110, G.floor + 12], [1140, G.floor + 40], [830, G.floor + 44]], 0.8, 8), C.linen2)
      .x((() => { let d = ''; for (let x = 870; x < 1120; x += 26) d += c.ribbon([[x, G.floor + 16], [x - 8, G.floor + 42]], 1.2); return d; })(), C.terracotta, 'opacity=".4"').out()
      + `<g transform="translate(900 ${G.floor + 30})">${loaf(c, 16)}</g><g transform="translate(950 ${G.floor + 34}) scale(.9)">${fishCut(c)}</g><g transform="translate(1010 ${G.floor + 34})">${bowl(c, { w: 34, food: 'fruit' })}</g><g transform="translate(1070 ${G.floor + 32})">${loaf(c, 14)}</g>`);
    const peter = S.puppet(L.add(person(c, { ...DISC[0], pose: 'kneel', holdF: `<g transform="translate(2 4)">${loaf(c, 14)}</g>` })));
    const others = [1, 2, 3, 4].map((k, i) => ({ i, k, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...DISC[k], holdB: k === 1 ? `<g transform="translate(0 4) scale(.8)">${basket(c, { w: 40, h: 24, full: true })}</g>` : '' }))), x: [1030, 1110, 1190, 1270][i] }));
    const jStand = S.puppet(L.add(person(c, CAST.jesus)));

    const fx = S.layer({ par: 0.55, sh: 5 });
    const eat = fx.add(`<g>${say(c, tr('Rabbi, jedz!', 'Rabbi, eat!'), { size: 22, side: -1 })}</g>`);
    // the covered dish
    const dishLid = (() => {
      const w = 90, pts = [[-w * 0.44, 0], ...c.arc(0, 0, w * 0.44, w * 0.38, PI, 2 * PI, 16), [w * 0.44, 0]];
      return sheet().p(c.cut(pts, 0.5, 5), C.sun).p(c.cut(c.circ(0, -w * 0.4, 6, 10), 0.3, 3), shade(C.sun, -0.2)).x(c.ribbon(c.arc(0, 0, w * 0.3, w * 0.26, PI * 1.2, PI * 1.5, 6), 3), '#fff8e0', 'opacity=".7"').out();
    })();
    const dish = hanging(fx, `<circle cy="-10" r="70" fill="url(#halo-glow)" class="dglow"/>${sheet().p(c.cut(c.ell(0, 2, 56, 8, 20), 0.4, 5), C.sun).out()}<g class="dlid">${dishLid}</g>`, { x: 610, y: 470, len: 600 });
    const dLid = dish.querySelector('.dlid'), dGlow = dish.querySelector('.dglow');
    const qJ = fx.add(`<g>${speech(c, `<g transform="translate(-10 0)">${GLYPH.q(c)}</g><g transform="translate(12 0)">${GLYPH.q(c)}</g>`, { w: 62, h: 44, flip: true })}</g>`);
    const whisper = fx.add(`<g>${thought(c, `<g transform="translate(-20 14) scale(.4)">${person(c, { ...samaritan(c, 3), holdF: `<g transform="translate(0 4)">${basket(c, { w: 40, h: 24, full: true })}</g>` })}</g><g transform="translate(22 -2)">${GLYPH.q(c)}</g>`, { w: 96, h: 80 })}</g>`);
    // the will: a scroll with a sun-seal
    const will = hanging(fx, (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-80, 0, 160, 110), 0.5, 6), C.parchment);
      let ln = '';
      for (let i = 0; i < 5; i++) ln += c.ribbon([[-60, 20 + i * 14], [60 - (i % 2) * 20, 20 + i * 14]], 1.6);
      s.x(ln, C.inkSoft, 'opacity=".45"');
      s.p(c.cut(c.ell(0, 0, 88, 8, 16), 0.3, 4) + c.cut(c.ell(0, 110, 88, 8, 16), 0.3, 4), C.wood2);
      s.p(c.cut(c.star(50, 94, 16, 11, 12, 0), 0.3, 3), C.sunRay).p(c.cut(c.circ(50, 94, 10, 12), 0.3, 3), C.sun);
      return `<circle cy="55" r="140" fill="url(#halo-glow)"/>${s.out()}`;
    })(), { x: 720, y: 160, len: 600 });

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 980, sunY: 170, glow: 0.6 });
      /* v31 — Rabbi, eat */
      const offer = es(t, 0.1, 0.35) * (1 - es(t, 1.05, 1.3));
      peter.set({ x: 830, y: G.floor + 14, s: 1.0, flip: true, armF: 40 + offer * 50, armB: 20, head: -4 + es(t, 2.05, 2.3) * 12 * (1 - es(t, 2.9, 3.1)), lean: offer * 6, blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(830, G.floor + 14, 1.0, true, 46);
      const ek = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.95, 1.05));
      vis(eat, { x: phx - 10, y: phy - 24, s: ek, o: ek > 0.01 ? 1 : 0 });
      /* v32 — the food they do not know */
      const dk = es(t, 1.05, 1.4, ease.out);
      const lid = es(t, 3.05, 3.3);
      swing(dish, 610, 470 - (1 - dk) * 650 - es(t, 3.9, 4.3) * 700, T * dk, 1.2, 0.7);
      fade(dish, dk > 0.001 && t < 4.3 ? 1 : 0);
      fade(dGlow, dk * (0.5 + 0.3 * Math.sin(T * 2)) + lid * 0.5);
      pose(dLid, { y: -lid * 50, r: -lid * 30, x: -lid * 20 });
      const qk = es(t, 1.45, 1.65, ease.back) * (1 - es(t, 1.95, 2.05));
      /* v33 — did someone bring Him something? */
      const talk = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.1));
      others.forEach((o) => {
        const turn = talk * (o.i % 2 ? 1 : 0);
        o.p.set({ x: o.x, y: G.floor - 6 + (o.i % 2) * 6, s: 0.96, flip: turn < 0.5, armF: 16 + (o.i === 0 ? bump(t, 2.3, 2.9) * 70 : 0) + es(t, 4.05, 4.3) * 10, armB: 12, head: -talk * 6 + (o.i === 0 ? bump(t, 2.3, 2.9) * 18 : 0) - es(t, 4.1, 4.4) * 4 * 0, lean: o.i === 0 ? bump(t, 2.3, 2.9) * 10 : 0, blink: blinkAt(T, o.seed) });
      });
      const [ohx, ohy] = headAt(1110, G.floor, 0.96, true);
      vis(qJ, { x: ohx - 10, y: ohy - 24, s: qk, o: qk > 0.01 ? 1 : 0 });
      const wk = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(whisper, { x: 1150, y: ohy - 10, s: wk, o: wk > 0.01 ? 1 : 0 });
      /* v34 — the will of Him who sent me; His work */
      const bk = es(t, 3.1, 3.4);
      vis(beam, { x: G.jx + 10, y: G.floor - 10, s: 1, o: bk * (1 - es(t, 4.6, 4.9) * 0.5) });
      const wl = es(t, 3.2, 3.55, ease.out);
      swing(will, 720, 150 - (1 - wl) * 600, T * wl, 1, 0.7, 2);
      fade(will, wl > 0.001 ? 1 : 0);
      const stand = es(t, 4.05, 4.12);
      const show = es(t, 4.1, 4.4);
      K.set({ T, jo: 1 - stand, wo: 0, jF: 22 + es(t, 0.5, 0.9) * 30 * (1 - es(t, 1.9, 2.1)) + bk * 40, jB: 12 + bk * 50, jH: -2 - bk * 6 });
      jStand.set({ x: G.jx + 10, y: G.floor, s: 1.05, o: stand, armF: 40 + show * 50, armB: 20, head: -show * 4, blink: blinkAt(T) });
      folk.forEach((f) => {
        const u = seg(t, 3.9 + f.d * 0.3, 4.9 + f.d * 0.3);
        const [x, y] = along(ROAD, u);
        f.p.set({ x: x + (f.i % 3) * 20, y: y + (f.i % 2) * 4, s: 0.42 + u * 0.08, flip: true, o: es(t, 3.85, 4.0), walk: u > 0 && u < 1 ? T * 7 + f.i : undefined });
      });

      S.cam.x = kf(t, [[-0.5, 40], [0.5, 30], [1.0, 20], [2.0, 90], [3.0, 20], [4.0, 60], [4.6, 110]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.5, 50], [2.0, 50], [3.0, -20], [4.0, 0], [4.6, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.5, 1.16], [2.0, 1.2], [3.0, 1.04], [4.0, 1.04], [4.6, 1.02]]);
    };
  },
};
