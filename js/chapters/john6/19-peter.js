// J 6,68–71 — the empty road at sunset; the Twelve stay. Simon Peter steps forward: "Lord, to whom shall we go?"
// — the signpost has nowhere to point but back to Him. "You have the words of eternal life": the paper slips of His
// words shine inside a ring without end. "We have believed and come to know that You are the Holy One of God":
// the Twelve kneel and small hearts kindle over them. "Did I not choose you, the Twelve?" — twelve little lights
// hang in a crown over them — "yet one of you is a devil": the last one goes grey, a soft shadow at the far end.
// He spoke of Judas, son of Simon Iscariot (a dark tag), who, one of the Twelve, was to hand Him over.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, DUSK, NIGHT, GOLDEN, TWELVE, LOOK, nameTag, hungGold, wordSlip, soulLight, eternityRing, drawRing, heart, speech, GLYPH, glowDisc, headAt, hand, kf, tr, PI, FONT } from './lib.js';

const JX = 820, JY = 772;

export default {
  id: 'j6-peter',
  beats: [
    { v: 68, text: 'Odpowiedział Mu Szymon Piotr: «Panie, do kogóż pójdziemy?' },
    { v: 68, cont: true, text: 'Ty masz słowa życia wiecznego.' },
    { v: 69 },
    { v: 70, text: 'Na to rzekł do nich Jezus: «Czyż nie wybrałem was dwunastu?' },
    { v: 70, cont: true, text: 'A jeden z was jest diabłem».' },
    { v: 71, text: 'Mówił zaś o Judaszu, synu Szymona Iskarioty.' },
    { v: 71, cont: true, text: 'Ten bowiem - jeden z Dwunastu - miał Go wydać.' },
  ],
  cam: { x: [-20, 100], y: [-30, 50], z: [0.88, 1.12] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { skyCols: DUSK, sunAt: [300, 460] });
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#3a2a4a"/>`);

    // phone: the Twelve stand closer together, so Judas at the far end, his shadow and his name are on the screen
    const PH = S.portrait;
    const L = S.layer({ par: 0.5, sh: 5 });
    // the signpost at the road with no other way to point
    const post = L.add(`<g transform="translate(${PH ? 250 : 455} 770)">${sheet().p(c.ribbon([[0, 0], [0, -150]], 7), C.wood2).out()}<g class="arm">${sheet().p(c.cut([[-4, -150], [70, -150], [84, -138], [70, -126], [-4, -126]], 0.4, 5), C.wood3).out()}</g></g>`);
    const arm = post.querySelector('.arm');
    // the Twelve (Peter steps forward), a soft shadow at the far end over Judas
    const SP = PH ? [[690, 756], [945, 750], [990, 758], [622, 764], [1035, 752], [556, 760], [1080, 758], [912, 786], [957, 790], [1002, 792], [1047, 786], [1135, 772]] : [[690, 756], [980, 750], [1040, 758], [620, 764], [1100, 752], [560, 760], [1160, 758], [940, 786], [1000, 790], [1060, 792], [1130, 786], [1250, 772]];
    const shId = S.id('shade');
    S.defs(`<radialGradient id="${shId}"><stop offset="0" stop-color="#1e1830" stop-opacity=".6"/><stop offset="1" stop-color="#1e1830" stop-opacity="0"/></radialGradient>`);
    const shadow = L.add(`<g><ellipse rx="90" ry="140" cy="-100" fill="url(#${shId})"/></g>`);
    const TW = TWELVE.map((m, i) => ({ ...m, i, x: SP[i][0], y: SP[i][1], seed: c.rr(0, 9), st: S.puppet(L.add(person(c, m.o))), kn: S.puppet(L.add(person(c, { ...m.o, pose: 'kneel' }))) }));
    const jGlow = L.add(`<g>${glowDisc(170, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.56, sh: 5 });
    const q = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 46, h: 42 })}</g>`);
    const slips = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${wordSlip(c, 32)}</g>`), l: fx.add(`<g>${soulLight(c, 8)}</g>`) }));
    const ring = fx.add(`<g>${eternityRing(c, 110, 4, 28)}</g>`);
    const words = fx.add(hungGold(c, tr('słowa życia wiecznego', 'the words of eternal life'), { size: 28 }));
    const holy = fx.add(hungGold(c, tr('Święty Boga', 'the Son of the living God'), { size: 30 }));
    const hearts = TW.map(() => fx.add(`<g>${heart(c, 9)}</g>`));
    const lamps = TW.map((m, i) => fx.add(`<g><g class="lit">${soulLight(c, 8)}</g><path class="dim" opacity="0" d="${c.cut([[0, -11], [6, -2], [5, 6], [-5, 6], [-6, -2]], 0.2, 3)}" fill="${C.storm2}"/></g>`));
    const n12 = fx.add(`<g><path d="${c.cut(c.rect(-30, -18, 60, 34), 0.5, 5)}" fill="${C.cream}"/><text x="0" y="8" text-anchor="middle" font-family="${FONT}" font-size="24" font-style="italic" fill="${C.ink}">12</text></g>`);
    const jTag = hanging(fx, nameTag(c, tr(['Judasz, syn', 'Szymona Iskarioty'], ['Judas, son of', 'Simon Iscariot']), { size: 16, dark: true }), { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      const night = es(t, 3.9, 6.5);
      R.sk.blend(DUSK, NIGHT, night * 0.7);
      tint.fade(0.06 + night * 0.2);
      R.update(T, { sunX: 300, sunY: 460 + es(t, 0, 3) * 140 });

      /* v68a — "Lord, to whom shall we go?" */
      const P = TW[0];
      const step = es(t, 0.05, 0.35);
      const px = P.x + step * 30;
      const [phx, phy] = headAt(px, P.y, 0.98, false);
      const qk = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(q, { x: phx + 14, y: phy - 20, s: qk, o: qk > 0.01 ? 1 : 0 });
      // the signpost arm swings round: there is no other way — back to Him
      pose(arm, { r: bump(t, 0.3, 0.95) * -30 + es(t, 0.8, 1.0) * 0, ox: 0, oy: -138, x: 0, y: -138 + 138 * 0 });

      /* v68b — "You have the words of eternal life" */
      const [jhx, jhy] = headAt(JX, JY, 1.08, false);
      slips.forEach((s) => {
        const k = es(t, 1.05 + s.i * 0.05, 1.4 + s.i * 0.05);
        const lit = es(t, 1.4 + s.i * 0.04, 1.6 + s.i * 0.04);
        const a = s.i / 5 * PI * 2 + T * 0.3;
        const x = jhx + Math.cos(a) * 100 * k, y = jhy - 20 + Math.sin(a) * 60 * k;
        pose(s.el, { x, y, r: Math.sin(a) * 10, o: seg(t, 1.05, 1.1) * (1 - lit) * (1 - es(t, 1.95, 2.1)) });
        pose(s.l, { x, y, s: 0.6 + lit * 0.5, o: lit * (1 - es(t, 1.95, 2.1)) });
      });
      drawRing(ring, es(t, 1.4, 1.8));
      pose(ring, { x: jhx, y: jhy - 20, sy: 0.6, r: 0, o: seg(t, 1.4, 1.45) * (1 - es(t, 1.95, 2.1)) });
      const wk = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.95, 2.1));
      pose(words, { x: JX, y: lerp(-500, 190, wk), r: Math.sin(T * 0.8), o: wk > 0.01 ? 1 : 0 });

      /* v69 — "we have believed and know that You are the Holy One of God" */
      const hk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.1));
      pose(holy, { x: JX, y: lerp(-500, 190, hk), r: Math.sin(T * 0.8), o: hk > 0.01 ? 1 : 0 });
      /* v70a — twelve chosen; v70b — one of you is a devil */
      const chose = es(t, 3.05, 3.4);
      const dark = es(t, 4.15, 4.5);
      TW.forEach((m) => {
        const kneel = es(t, 2.1 + m.i * 0.03, 2.18 + m.i * 0.03) * (1 - es(t, 3.0, 3.08));
        const isJ = m.i === 11;
        const x = m.i === 0 ? px : m.x;
        const dismay = es(t, 4.2, 4.5) * (isJ ? 0 : 1);
        const o = { x, y: m.y, s: 0.98, flip: x > JX, blink: blinkAt(T, m.seed) };
        m.st.set({ ...o, o: 1 - kneel, armF: m.i === 0 ? 30 + step * 60 + bump(t, 1.0, 1.9) * 30 : 20 + chose * 10 + dismay * 40, armB: m.i === 0 ? step * 80 : dismay * (m.i % 2 ? 60 : 0), head: -chose * 6 + dismay * (m.i % 2 ? 8 : -8) + (isJ ? es(t, 5.1, 5.4) * 14 : 0), blink: blinkAt(T, m.seed) });
        m.kn.set({ ...o, o: kneel, armF: 60 + (m.i % 2) * 30, armB: 40, head: -10 });
        const [hx, hy] = headAt(x, m.y, 0.98, x > JX, kneel > 0.5 ? 46 : 0);
        const h = es(t, 2.3 + m.i * 0.04, 2.5 + m.i * 0.04, ease.back) * (1 - es(t, 2.95, 3.05));
        pose(hearts[m.i], { x: hx, y: hy - 40, s: h, o: h > 0.01 ? 1 : 0 });
        const lk = es(t, 3.1 + m.i * 0.03, 3.3 + m.i * 0.03, ease.back) * (1 - es(t, 6.0, 6.3) * (isJ ? 1 : 0.3));
        pose(lamps[m.i], { x: hx, y: hy - 42 + Math.sin(T * 1.4 + m.i) * 2, s: lk, o: lk > 0.01 ? 1 : 0 });
        if (isJ) {
          pose(lamps[m.i].querySelector('.lit'), { o: 1 - dark });
          pose(lamps[m.i].querySelector('.dim'), { o: dark });
        }
      });
      const k12 = es(t, 3.2, 3.45, ease.back) * (1 - es(t, 3.95, 4.1));
      pose(n12, { x: PH ? 990 : 1000, y: 560, s: k12, o: k12 > 0.01 ? 1 : 0 });
      const J = TW[11];
      pose(shadow, { x: J.x, y: J.y, o: dark * (0.7 + es(t, 6.05, 6.4) * 0.3) });

      /* v71a — Judas, son of Simon Iscariot */
      const tk = es(t, 5.05, 5.4, ease.out);
      pose(jTag, { x: J.x - (PH ? 62 : 10), y: lerp(-500, 470, tk), r: Math.sin(T * 0.9) * 2, o: tk > 0.01 ? 1 : 0 });

      const bless = es(t, 3.05, 3.35) * (1 - es(t, 4.1, 4.3));
      jesus.set({ x: JX, y: JY, s: 1.08, flip: false, armF: 20 + bump(t, 0.2, 1.0) * 20 + bump(t, 2.1, 2.95) * 50 + bless * 70, armB: 10 + bless * 110 + bump(t, 2.1, 2.95) * 40, head: es(t, 4.1, 4.4) * 8 * (1 - es(t, 6.2, 6.6) * 0.5), blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: JY - 130, s: 0.8 + bump(t, 1.1, 2.9) * 0.5, o: 0.3 + bump(t, 1.1, 2.9) * 0.5 });

      S.cam.x = kf(t, [[0, -10], [1.0, 0], [3.0, 10], [5.0, 30], [6.5, 20]]) + (PH ? 70 : 0);
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.06], [2.1, 1.04], [3.1, 1.02], [5.1, 1.08], [6.5, 1.04]]) * (PH ? 0.88 : 1);
      S.cam.y = kf(t, [[0, 40], [1.0, 20], [2.1, 30], [3.1, 20], [5.1, 40], [6.5, 30]]);
    };
  },
};
