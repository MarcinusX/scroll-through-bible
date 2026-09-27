// J 6,41–44 — grey murmuring bubbles pass along the benches: "He said, I am the bread that came down from heaven."
// "Isn't this Jesus, the son of Joseph? We know his father and mother" — a family portrait from Nazareth comes
// down: Joseph with his plane, Mary in her blue veil. "How can He say: I came down from heaven?" "Do not murmur":
// He lifts His hand and the grey bubbles wither. No one can come unless the Father draws him — fine golden threads
// come down from the light and gently draw three people to Him; and He will raise them up on the last day.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, folk, murmur, familyPlate, radiance, threads, dawnDisc, hungWord, speech, GLYPH, heart, labelTag, glowDisc, headAt, hand, kf, tr, PI } from './lib.js';

const JX = 800, FEET = 742;

export default {
  id: 'j6-murmur',
  beats: [
    { v: 41 },
    { v: 42, text: 'I mówili: «Czyż to nie jest Jezus, syn Józefa, którego ojca i matkę my znamy?' },
    { v: 42, cont: true, text: 'Jakżeż może On teraz mówić: "Z nieba zstąpiłem"».' },
    { v: 43 },
    { v: 44, text: 'Nikt nie może przyjść do Mnie, jeżeli go nie pociągnie Ojciec, który Mnie posłał;' },
    { v: 44, cont: true, text: 'Ja zaś wskrzeszę go w dniu ostatecznym.' },
  ],
  cam: { x: [-20, 20], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    const hiL = S.layer({ par: 0.3, sh: 4 });
    const rad = hiL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 52)}</g>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    const thr = threads(L, 3, { color: C.haloRim, w: 2 });
    const DRAWN = [[300, 0], [1220, 1], [1340, 2]].map(([x, i]) => {
      const o = folk(c, i !== 1);
      return { x, i, seed: c.rr(0, 9), si: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))), st: S.puppet(L.add(person(c, o))), kn: S.puppet(L.add(person(c, { ...o, pose: 'kneel' }))) };
    });
    const jGlow = L.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    I.addColumns();

    const fx = S.layer({ par: 0.6, sh: 5 });
    const quote = fx.add(hungWord(c, tr('«Jam jest chleb, który z nieba zstąpił»', '“I am the bread which came down out of heaven”'), { size: 20 }));
    const MUR = [0, 2, 3, 5, 7, 8].map((ci, i) => ({ m: cong[ci], i, el: fx.add(`<g>${murmur(c, { side: cong[ci].x > JX ? -1 : 1 })}</g>`) }));
    const fam = fx.add(`<g>${familyPlate(S)}</g>`);
    const famTag = fx.add(`<g>${labelTag(tr('syn Józefa', 'son of Joseph'), 18)}</g>`);
    const how = fx.add(`<g>${speech(c, `<g transform="translate(-18 -2) scale(.26)">${cloud(c, 120)}</g><path d="${c.ribbon([[4, -14], [4, 8]], 3)}" fill="${C.ink}"/><path d="M-2 4L4 14L10 4Z" fill="${C.ink}"/><g transform="translate(24 0) scale(.7)">${GLYPH.q(c)}</g>`, { w: 88, h: 52, flip: true })}</g>`);
    const last = hanging(fx, dawnDisc(c, 48), { x: 0, y: 0, len: 900 });
    const lastW = fx.add(hungWord(c, tr('dzień ostateczny', 'the last day'), { size: 19 }));
    const hearts = DRAWN.map(() => fx.add(`<g>${heart(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      I.flicker(T);
      /* v41 — they murmur at "I am the bread that came down from heaven" */
      const qk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 0.95, 1.1));
      pose(quote, { x: JX, y: lerp(-500, 190, qk), r: Math.sin(T * 0.9) * 1, o: qk > 0.01 ? 1 : 0 });
      const hush = es(t, 3.2, 3.6);
      MUR.forEach((u) => {
        const a = 0.25 + u.i * 0.09;
        const k = es(t, a, a + 0.2, ease.back) * (1 - hush) * (1 - es(t, 1.0, 1.1) * 0.5 + es(t, 2.05, 2.2) * 0.5);
        const [hx, hy] = headAt(u.m.x, u.m.y, u.m.s, u.m.x > JX, 62);
        const wob = Math.sin(T * 3 + u.i) * 2;
        pose(u.el, { x: hx + (u.m.x > JX ? -8 : 8), y: hy - 18 + wob, s: k * 0.9 * (1 - hush * 0.5), r: hush * 20 * (u.i % 2 ? 1 : -1), o: k > 0.01 ? k : 0 });
      });

      /* v42a — "the son of Joseph; we know his father and mother" */
      const fk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.95, 3.15));
      pose(fam, { x: 1060, y: lerp(-500, 150, fk), r: Math.sin(T * 0.8) * 1.2, o: fk > 0.01 ? 1 : 0 });
      const tk = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(famTag, { x: 1060, y: 420, s: tk, r: -3, o: tk > 0.01 ? 1 : 0 });
      /* v42b — "how can He say: I came down from heaven?" */
      const m0 = cong[6];
      const hk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.05));
      const [px, py] = headAt(m0.x, m0.y, m0.s, true, 62);
      pose(how, { x: px - 10, y: py - 20, s: hk, o: hk > 0.01 ? 1 : 0 });

      cong.forEach((m, i) => {
        const turn = es(t, 0.3, 0.6) * (1 - hush);
        const point = i === 6 ? bump(t, 2.05, 2.95) : 0;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: (i % 2 && turn > 0.5) ? m.x < JX : m.x > JX, armF: 20 + turn * 30 + point * 110, armB: turn * (i % 3 ? 0 : 60), head: turn * (i % 2 ? 8 : -6) - hush * 6, lean: turn * 3, blink: blinkAt(T, m.seed) });
      });

      /* v43 — "Do not murmur among yourselves" */
      const lift = bump(t, 3.05, 3.95);
      /* v44a — no one can come unless the Father draws him */
      const rk = es(t, 4.05, 4.35) * (1 - es(t, 5.6, 5.9) * 0.5);
      pose(rad, { x: JX, y: 170, s: 0.8 + rk * 0.2, r: T * 3, o: rk });
      const draw = es(t, 4.3, 4.95);
      DRAWN.forEach((d) => {
        const up = es(t, 4.2 + d.i * 0.05, 4.28 + d.i * 0.05);
        const tx = JX + [-190, 170, 250][d.i];
        const x = lerp(d.x, tx, draw), y = lerp(690, FEET + 12, draw);
        const kneel = es(t, 5.1 + d.i * 0.05, 5.18 + d.i * 0.05);
        d.si.set({ x: d.x, y: 690, s: 0.9, flip: d.x > JX, o: 1 - up, armF: 20, armB: 10, head: -es(t, 3.2, 3.5) * 6, blink: blinkAt(T, d.seed) });
        d.st.set({ x, y, s: lerp(0.9, 0.98, draw), flip: tx < d.x, walk: draw > 0.02 && draw < 0.98 ? x * 0.06 : undefined, o: up * (1 - kneel), armF: 30 + draw * 20, armB: 20, head: -10, blink: blinkAt(T, d.seed) });
        d.kn.set({ x: tx, y: FEET + 12, s: 0.98, flip: tx > JX, o: kneel, armF: 60, armB: 40, head: -12, blink: blinkAt(T, d.seed) });
        const [hx, hy] = headAt(up > 0.5 ? (kneel > 0.5 ? tx : x) : d.x, up > 0.5 ? (kneel > 0.5 ? FEET + 12 : y) : 690, 0.95, false, kneel > 0.5 ? 46 : up > 0.5 ? 0 : 62);
        thr(d.i, JX + (d.i - 1) * 20, 200, hx, hy + 40, es(t, 4.1 + d.i * 0.05, 4.3 + d.i * 0.05) * 0.9 * (1 - es(t, 5.6, 5.9)));
        const h = es(t, 5.3 + d.i * 0.06, 5.5 + d.i * 0.06, ease.back);
        pose(hearts[d.i], { x: hx, y: hy - 44 + Math.sin(T * 1.4 + d.i) * 3, s: h, o: h > 0.01 ? 1 : 0 });
      });
      /* v44b — I will raise him up on the last day */
      const lk = es(t, 5.1, 5.4, ease.out);
      pose(last, { x: 1070, y: lerp(-500, 230, lk), r: Math.sin(T * 0.8) * 1.4, o: lk > 0.01 ? 1 : 0 });
      pose(lastW, { x: 1070, y: lerp(-500, 330, lk), r: Math.sin(T + 1) * 2, o: lk > 0.01 ? 1 : 0 });
      const warm = es(t, 5.2, 5.6);
      pose(jGlow, { x: JX, y: FEET - 130, s: 0.8 + warm * 0.8, o: 0.25 + warm * 0.6 });

      jesus.set({ x: JX, y: FEET, s: 1.08, armF: 20 + es(t, 0.1, 0.3) * 30 + lift * 40 + es(t, 5.1, 5.4) * 50, armB: 10 + lift * 140 + bump(t, 4.05, 5.0) * 120 + es(t, 5.1, 5.4) * 60, head: -bump(t, 4.05, 5.0) * 10, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.02], [2.0, 1.06], [3.0, 1.04], [4.2, 1.02], [5.2, 1.08]]);
      S.cam.y = kf(t, [[0, 10], [1.0, 0], [2.0, 20], [4.2, 0], [5.2, 20]]);
    };
  },
};
