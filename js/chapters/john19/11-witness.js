// J 19,35–37 — dusk. The stream of light and living water still runs down from the cross. In front stands the
// one who saw it, the beloved disciple, a small lamp in his hand: a round plate with an open eye (he saw), a
// written page, and a red seal of truth pressed on it. "…so that you also may believe": little flames drift from
// his lamp towards us and the footlights along the front of the stage kindle one by one. Then the Scriptures:
// "Not a bone of Him shall be broken" — beside the scroll, the Passover lamb, whole; and another: "They will look
// on the One whom they pierced" — the people on the road lift their eyes to the cross.
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { hand, headAt, golgothaSet, setCrosses, clearClouds, glory, oilLamp, waxSeal, strip, verseScroll, lamb, footlights, waterChunks, waterGlowDef, scrollOpen, tr, GOL, BELOVED, J19, PI } from './lib.js';

const RY = 704, JX = 560;

export default {
  id: 'j19-witness',
  beats: [
    { v: 35, text: 'Zaświadczył to ten, który widział, a świadectwo jego jest prawdziwe.' },
    { v: 35, cont: true, text: 'On wie, że mówi prawdę, abyście i wy wierzyli.' },
    { v: 36, text: 'Stało się to bowiem, aby się wypełniło Pismo:' },
    { v: 36, cont: true, text: 'Kość jego nie będzie złamana.' },
    { v: 37, text: 'I znowu na innym miejscu mówi Pismo:' },
    { v: 37, cont: true, text: 'Będą patrzeć na Tego, którego przebili.' },
  ],
  cam: { x: [-60, 40], y: [-30, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;   // phone: the scrolls hang above the crosses, the lamb and the people stand inside the screen
    const G = golgothaSet(S, { pal: J19.eve });
    clearClouds(G);
    const gl = G.hangL.add(`<g>${glory(c, 360, 16)}</g>`);
    const u = GOL.H / 240;
    const HDY = -GOL.H + 52 * u - 2 * u;
    const [SX, SY] = [GOL.x + 10 * u, GOL.top - GOL.H + 52 * u + 40 * u];
    const gid = waterGlowDef(S);
    const stL = S.layer({ par: 0.2, sh: 2 });
    const path = [...c.cbez([SX + 2, SY + 4], [SX + 24, SY + 110], [SX - 30, GOL.top + 50], [SX + 6, GOL.top + 170], 18), ...c.cbez([SX + 6, GOL.top + 170], [SX + 50, 640], [SX - 50, 770], [SX + 30, 980], 18).slice(1)];
    waterChunks(c, path, 14, [5, 34], gid).chunks.forEach((ch) => stL.add(`<g>${ch.markup}</g>`));
    waterChunks(c, path.map(([x, y]) => [x - 10, y]), 14, [3, 16]).chunks.forEach((ch) => stL.add(`<g opacity=".9">${ch.markup.replace(/#9fd6e0/g, '#fff0c2').replace(/#f2fdff/g, '#fffaf0')}</g>`));
    const shine = stL.add(`<g><circle r="160" fill="url(#${gid})"/></g>`);

    /* the people who will look on Him, and the witness */
    const P = S.layer({ par: 0.55, sh: 5 });
    const folk = [0, 1, 2, 3].map((i) => ({ i, x: (ph ? [885, 950, 1015, 1080] : [860, 950, 1060, 1150])[i], p: S.puppet(P.add(person(c, crowdPerson(c)))) }));
    const john = S.puppet(P.add(person(c, BELOVED)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const lampEl = fx.add(`<g>${oilLamp(c)}</g>`);
    const flame = lampEl.querySelector('.flame'), lglow = lampEl.querySelector('.glow');
    const eye = fx.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 40, 30), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 34, 30), 0.5, 5), C.cream).p(c.cut([[-24, 0], [-10, -12], [10, -12], [24, 0], [10, 12], [-10, 12]], 0.3, 4), '#fff').p(c.cut(c.circ(0, 0, 9, 14), 0.2, 3), C.teal2).x(c.poly(c.circ(0, 0, 4, 10)), C.ink).x(c.poly(c.circ(3, -3, 1.6, 6)), '#fff').out()}</g>`);
    const page = fx.add(`<g>${scrollOpen(c, 96, 66)}<g class="seal" transform="translate(34 26)">${waxSeal(c, 16, 'true')}</g><g class="st" transform="translate(0 56)">${strip(c, tr('prawdziwe', 'true'), { size: 15 })}</g></g>`);
    const seal = page.querySelector('.seal'), st = page.querySelector('.st');
    const sparks = [0, 1, 2, 3, 4].map((i) => ({ i, el: fx.add(`<g><circle r="26" fill="url(#warm-glow)"/><path d="M0 0C-6 -5 -5 -14 0 -26C5 -14 6 -5 0 0Z" fill="${C.lampFlame}"/></g>`) }));
    const FL = S.layer({ par: 0.9, sh: 3 });
    const FX = [-80, 120, 320, 470, 1130, 1280, 1480, 1680];
    const foot = FL.add(`<g transform="translate(0 772)">${footlights(c, FX)}</g>`);
    const fls = FX.map((_, i) => ({ f: foot.querySelector(`.f${i} .ff`), g: foot.querySelector(`.f${i} .fg`) }));
    /* the Scriptures */
    const sL = S.layer({ par: 0.3, sh: 6 });
    const V1 = verseScroll(c, [tr('Kość jego nie będzie złamana.', 'A bone of him will not be broken.')], { w: 340, size: 21, title: tr('Pismo', 'Scripture') });
    const V2 = verseScroll(c, [tr('Będą patrzeć na Tego,', 'They will look on him'), tr('którego przebili.', 'whom they pierced.')], { w: 340, size: 21, title: tr('Pismo', 'Scripture') });
    const mk = (V) => sL.add(`<g><path d="M-140 0V-1200M140 0V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.4"/>${V.rodTop}${V.sheet.replace(/(<text[^>]*font-size="21"[^>]*>)/g, '<g class="w" opacity="0">$1').replace(/(<text[^>]*font-size="21"[^>]*>[^<]*<\/text>)<\/g>?/g, '$1</g>')}<g transform="translate(0 ${V.h})">${V.rodBottom}</g></g>`);
    const sc1 = mk(V1), sc2 = mk(V2);
    const w1 = [...sc1.querySelectorAll('.w')], w2 = [...sc2.querySelectorAll('.w')];
    const lambP = sL.add(`<g><path d="M0 -40V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.4"/>${sheet().p(c.cut(c.circ(0, 0, 58, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 52, 36), 0.5, 5), C.cream).out()}<circle r="50" fill="url(#halo-glow)"/><g transform="translate(-6 24) scale(0.95)">${lamb(c)}</g></g>`);

    return (t, time) => {
      const T = time;
      G.sk.blend(J19.eve, J19.night, es(t, 0, 6) * 0.3);
      setCrosses(G, 1, 1, 1);
      pose(G.crossC.querySelector('.hd'), { x: 0, y: HDY, r: 28 });
      fade(G.crossC.querySelector('.hl'), 0.8);
      [G.crossL, G.crossR].forEach((el, i) => { const h = GOL.sides[i][2], u2 = h / 240; pose(el.querySelector('.hd'), { x: 0, y: -h + 50 * u2, r: (i ? 1 : -1) * 26 }); });
      pose(gl, { x: GOL.x, y: GOL.top - 150, s: 0.9, r: T * 0.4, o: 0.4 + es(t, 5.05, 5.5) * 0.2 });
      pose(shine, { x: SX, y: SY + 90, s: 0.55 + Math.sin(T * 1.3) * 0.04, o: 0.45 });

      /* v35a — the one who saw: the eye, the page, the seal of truth */
      const oath = es(t, 0.3, 0.55) * (1 - es(t, 1.9, 2.1));
      john.set({ x: JX, y: RY, s: 1.05, armF: 20 + oath * 75, armB: 40 + bump(t, 1.05, 1.9) * 20, head: -4 + es(t, 5.05, 5.4) * -12, blink: blinkAt(T, 3) });
      const [lx, ly] = hand(JX, RY, 1.05, false, 40 + bump(t, 1.05, 1.9) * 20);
      pose(lampEl, { x: lx - 30, y: ly + 16, s: 0.8 });
      pose(flame, { x: 35, y: -16, sy: 1 + Math.sin(T * 9) * 0.07, o: 1 });
      fade(lglow, 0.9);
      const [hx, hy] = headAt(JX, RY, 1.05, false);
      const ek = es(t, 0.05, 0.3, ease.back) * (1 - es(t, 1.9, 2.1));
      pose(eye, { x: hx - 70, y: hy - 90, s: ek, o: ek > 0.02 ? 1 : 0 });
      const pgk = es(t, 0.35, 0.6, ease.back) * (1 - es(t, 1.9, 2.1));
      pose(page, { x: hx + 90, y: hy - 70, s: pgk, r: -3, o: pgk > 0.02 ? 1 : 0 });
      const sk = es(t, 0.6, 0.8, ease.back);
      pose(seal, { x: 34, y: 26, s: 1.6 - sk * 0.6, o: sk > 0.01 ? 1 : 0 });
      fade(st, es(t, 0.7, 0.85));

      /* v35b — "…that you also may believe": the light comes towards us */
      sparks.forEach((sp) => {
        const k = es(t, 1.1 + sp.i * 0.12, 1.75 + sp.i * 0.12, (x) => x);
        const tx = [300, 520, 800, 1080, 1300][sp.i];
        pose(sp.el, { x: lerp(lx + 5, tx, k), y: lerp(ly - 20, 820, k) - Math.sin(k * PI) * 120, s: 0.6 + k * 1.2, o: k > 0 && k < 1 ? Math.sin(k * PI) : 0 });
      });
      fls.forEach((f, i) => { const k = es(t, 1.35 + i * 0.06, 1.55 + i * 0.06); fade(f.f, k); fade(f.g, k * 0.9); pose(f.f, { x: 0, y: -6, sy: k * (1 + Math.sin(T * 8 + i) * 0.06), sx: k }); });

      /* v36 — "Not a bone of Him shall be broken" — the Passover lamb */
      const s1 = es(t, 2.05, 2.4) * (1 - es(t, 3.9, 4.2));
      pose(sc1, { x: ph ? 825 : 1030, y: lerp(-500, ph ? 50 : 104, s1), r: Math.sin(T * 0.6) * 0.5, o: s1 > 0.01 ? 1 : 0 });
      w1.forEach((w) => fade(w, es(t, 3.05, 3.35)));
      const lk = es(t, 3.2, 3.55) * (1 - es(t, 3.9, 4.2));
      pose(lambP, { x: ph ? 1040 : 1060, y: lerp(-400, 330, lk), r: Math.sin(T * 0.7 + 1) * 1, o: lk > 0.01 ? 1 : 0 });
      /* v37 — "They will look on the One whom they pierced" */
      const s2 = es(t, 4.05, 4.4);
      pose(sc2, { x: ph ? 825 : 1030, y: lerp(-500, ph ? 50 : 104, s2), r: Math.sin(T * 0.6 + 2) * 0.5, o: s2 > 0.01 ? 1 : 0 });
      w2.forEach((w, i) => fade(w, es(t, 5.05 + i * 0.12, 5.3 + i * 0.12)));
      const lookUp = es(t, 5.1, 5.45);
      folk.forEach((m) => m.p.set({ x: m.x, y: RY + (m.i % 2) * 6, s: 0.8, flip: true, armF: 20 + lookUp * (m.i % 2 ? 40 : 10), armB: 10 + lookUp * (m.i === 2 ? 80 : 20), head: -lookUp * 16, blink: blinkAt(T, m.i + 4), o: es(t, 4.1 + m.i * 0.1, 4.4 + m.i * 0.1) }));

      S.cam.x = -es(t, 0, 0.5) * 40 * (1 - es(t, 1.9, 2.3)) + es(t, 2.0, 2.4) * 30;
      S.cam.y = 10 + es(t, 1.05, 1.8) * 30 * (1 - es(t, 1.95, 2.3));
      S.cam.z = 1.03 + es(t, 1.05, 1.8) * 0.06 * (1 - es(t, 1.95, 2.3));
    };
  },
};
