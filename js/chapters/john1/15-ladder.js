// J 1,51 — Night falls on the disciples gathered round Jesus. "Amen, amen, I say to you": the two doors of the
// night sky swing open onto gold, and a ladder of light comes down onto the Son of Man — angels on strings
// climbing up and coming down it, as in Jacob's dream. The last picture of the chapter stays lit.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, stars, olive, cypress, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { NIGHT, LOOK, skyDoor, ladder, smallAngel, glowDisc, rayBurst, glory, voiceRings, hungGold, headAt, tint, PI } from './lib.js';

const PY = 770, JX = 800, FOOT = 640, LH = 640;

export default {
  id: 'j1-ladder',
  beats: [
    { v: 51, text: 'Potem powiedział do niego: «Zaprawdę, zaprawdę, powiadam wam:' },
    { v: 51, cont: true, text: 'Ujrzycie niebiosa otwarte' },
    { v: 51, cont: true, text: 'i aniołów Bożych wstępujących i zstępujących na Syna Człowieczego».' },
  ],
  cam: { x: [-20, 20], y: [-120, 20], z: [0.92, 1.08] },
  build(S) {
    const c = S.c;
    const DUSK = ['#6c6a9a', '#c08f99', '#eab795'];
    const sk = sky(S, DUSK);
    const st = S.layer({ par: 0.02, sh: 1, flat: true });
    st.add(stars(c, { x0: -900, x1: 2500, y0: -800, y1: 420, n: 130 }));

    /* ---------- behind the doors of the sky: gold ---------- */
    const OX = 800, OY = 285, RX = 260, RY = 195;
    const gold = S.layer({ par: 0.03, sh: 1, flat: true });
    gold.add(`<g transform="translate(${OX} ${OY})">${glowDisc(560, 'halo-glow', 1)}<path d="${c.cut(c.ell(0, 0, RX, RY, 48), 0.8, 10)}" fill="#f6d68e"/>${rayBurst(c, { n: 26, r0: 40, r1: 190, spread: 0.05, color: '#fff6dc', o: 0.6 })}<path d="${c.poly(c.ell(0, 0, RX * 0.45, RY * 0.45, 30))}" fill="#fff4d2" opacity=".6"/></g>`);
    const doorsL = S.layer({ par: 0.03, sh: 8 });
    // two half-ovals of night paper with stars, hinged at the outer edges of the opening
    const half = (dir) => {
      const pts = c.arc(0, 0, RX, RY, dir > 0 ? PI / 2 : -PI / 2, dir > 0 ? PI * 1.5 : PI / 2, 24).map(([x, y]) => [x + dir * RX, y]);
      const s2 = sheet();
      s2.p(c.cut(pts, 0.8, 10), mix(NIGHT[0], NIGHT[1], 0.6));
      let stz = '';
      for (let i = 0; i < 16; i++) { const a = c.rr(0.15, 0.85), y = c.rr(-RY * 0.8, RY * 0.8), x = dir * RX * (1 - a) * Math.sqrt(Math.max(0, 1 - (y / RY) ** 2)); const r = c.rr(1.5, 4); stz += r > 3.3 ? c.poly(c.star(x, y, r * 1.8, r * 0.5, 4, 0)) : c.poly(c.circ(x, y, r * 0.6, 6)); }
      s2.x(stz, C.star);
      s2.x(c.ribbon(pts, 5), C.haloRim, 'opacity=".9"');
      return s2.out();
    };
    const dL = doorsL.add(`<g>${half(1)}</g>`);
    const dR = doorsL.add(`<g>${half(-1)}</g>`);
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 480, amps: [18, 8, 3], lens: [1000, 360, 130], color: tint(C.hillFar, NIGHT[1], 0.5) }).markup);
    const hills = hillsWith(c, { y: 560, amps: [22, 9, 3], lens: [900, 300, 110], color: tint(C.hillMid, NIGHT[1], 0.5), trees: 22, treeColor: tint(C.sage, NIGHT[1], 0.5), treeH: 24 });
    S.layer({ par: 0.2, sh: 3 }).add(hills.markup);

    /* ---------- the ladder and the angels ---------- */
    const LL = S.layer({ par: 0.3, sh: 1, flat: true });
    const ladGlow = LL.add(`<g>${glowDisc(360, 'halo-glow', 1)}<path d="${c.poly([[-60, -420], [60, -420], [120, 330], [-120, 330]])}" fill="#fff4cf" opacity=".35"/></g>`);
    const LD = S.layer({ par: 0.3, sh: 4 });
    const ladEl = LD.add(`<g>${ladder(c, LH, 110, 50)}</g>`);
    const angels = [0, 1, 2, 3, 4, 5].map((i) => ({ i, up: i % 2 === 0, el: LD.add(smallAngel(c, { robe: [C.linen, '#fbf3e0', C.skyVeil][i % 3], hair: [C.wheat2, C.hair2, C.ochre][i % 3], skin: [C.skin, C.skin2, C.skin3][i % 3] })) }));

    /* ---------- the ground and the disciples round Jesus ---------- */
    const G = S.layer({ par: 0.45, sh: 3 });
    G.add(sheet().p(c.ridge(c.wave(690, [8, 3], [700, 180]), -900, 2500, 1700, 12, 1), tint(C.hillNear, NIGHT[1], 0.45)).out());
    G.add(tint(grass(c, { x0: -900, x1: 2500, y: 690, n: 60, h: 16, color: C.moss }) + olive(c, 200, 700, 0.9) + cypress(c, 1420, 700, 140), NIGHT[1], 0.45));
    const P = S.layer({ par: 0.45, sh: 4 });
    const jGlow = P.add(`<g>${glowDisc(240, 'warm-glow', 1)}</g>`);
    const CIRCLE = [
      { o: CAST.andrew, x: 360, s: 0.98 }, { o: CAST.peter, x: 480, s: 1.0 }, { o: CAST.john, x: 610, s: 0.96 },
      { o: LOOK.bartholomew, x: 990, s: 1.0, flip: true }, { o: LOOK.philip, x: 1120, s: 0.98, flip: true },
    ].map((m, i) => ({ ...m, i, p: S.puppet(P.add(person(c, m.o))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, color: C.haloRim, r: 38, w: 6 });
    const T = S.layer({ par: 0.45, sh: 6 });
    const amen = T.add(hungGold(c, tr('Zaprawdę, zaprawdę', 'Most certainly'), { size: 24 }));
    const som = T.add(hungGold(c, tr('Syn Człowieczy', 'the Son of Man'), { size: 22 }));

    return (t, time) => {
      const night = es(t, 0, 0.9);
      sk.blend(DUSK, NIGHT, night);
      st.fade(night);

      /* v51a: Amen, amen — He speaks to them */
      const speak = es(t, 0.1, 0.35) * (1 - es(t, 0.9, 1.1));
      const ak = es(t, 0.25, 0.55, ease.out) * (1 - es(t, 0.95, 1.15, ease.in));
      pose(amen, { x: JX, y: lerp(-500, 360, ak), r: Math.sin(t * 3.2) * 1.4, o: ak > 0.01 ? 1 : 0 });
      /* v51b: heaven opened */
      const open = es(t, 1.05, 1.6, ease.io);
      const seam = bump(t, 0.9, 1.3);
      pose(dL, { x: OX - RX - seam * 2, y: OY, sx: Math.max(0.05, 1 - open * 0.95) });
      pose(dR, { x: OX + RX + seam * 2, y: OY, sx: Math.max(0.05, 1 - open * 0.95) });
      gold.fade(Math.min(1, open * 3));
      /* v51c: angels ascending and descending on the Son of Man */
      const lad = es(t, 2.03, 2.45, ease.out);
      pose(ladEl, { x: JX, y: FOOT, sy: Math.max(0.001, lad), o: lad > 0.001 ? 1 : 0 });
      pose(ladGlow, { x: JX, y: FOOT - LH * 0.5, s: 0.6 + lad * 0.4, o: lad * 0.8 });
      const on = es(t, 2.3, 2.6);
      angels.forEach((a) => {
        let u = (a.i + 0.5) / 6.3 + (a.up ? 1 : -1) * (seg(t, 2.0, 3.4) * 0.12 - 0.04);
        const y = FOOT - 60 - u * (LH - 80);
        const hw = lerp(55, 25, u);
        const x = JX + (a.up ? -1 : 1) * hw * 0.55;
        const edge = Math.min(1, u * 14, (1 - u) * 14);
        pose(a.el, { x, y, s: lerp(0.9, 0.5, u), r: (a.up ? -1 : 1) * 3, o: on * edge });
      });
      const sk2 = es(t, 2.45, 2.8, ease.out);
      pose(som, { x: 1030, y: lerp(-500, 470, sk2), r: Math.sin(t * 3.2) * 1.2, o: sk2 > 0.01 ? 1 : 0 });

      const look = es(t, 1.1, 1.5);
      const awe = es(t, 2.2, 2.6);
      jesus.set({ x: JX, y: PY, s: 1.05, flip: false, armF: 12 + speak * 60 + look * 30 * (1 - awe) + awe * 40, armB: speak * 30 + look * 120 * (1 - awe) + awe * 150, head: -look * 10, blink: blinkAt(time, 2) });
      const [hx, hy] = headAt(JX, PY, 1.05, false);
      voice(hx + 22, hy + 4, speak, time, { spread: 2.2, s0: 0.6 });
      pose(jGlow, { x: JX, y: PY - 120, s: 0.6 + open * 0.3 + awe * 0.5, o: 0.4 + awe * 0.6 });
      CIRCLE.forEach((m) => m.p.set({ x: m.x, y: PY + (m.i % 2) * 6, s: m.s, flip: !!m.flip, armF: 14 + look * 30 + awe * (m.i % 2 ? 60 : 10), armB: awe * (m.i % 2 ? 20 : 140), head: -look * 14 - awe * 6, blink: blinkAt(time, m.i) }));

      S.cam.y = -90 * es(t, 1.0, 1.6) + 40 * es(t, 2.1, 2.7);
      S.cam.z = 1.02 - 0.08 * es(t, 1.0, 1.6) + 0.02 * es(t, 2.1, 2.7);
    };
  },
};
