// J 20,14–15 — The garden in the gold of the morning, full of closed buds; the gardener's beds, a watering jar,
// a hoe leaning on the rock. Mary turns from the tomb and sees Jesus standing — but a pale veil of tears hangs
// between them, and she does not know Him. He asks: "Woman, why are you weeping? Whom are you looking for?" She
// thinks He is the gardener (a thought-cloud: a little man with a hoe) and pleads with Him: "Sir, if you have
// carried Him away, tell me where…" — and turns back, weeping, towards the empty tomb.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, flock } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, GJ, GM, easterGarden, DOOR, STONE, GOLD, headAt, voiceRings, bubble, thought, question, tearVeil, gardenerMini, withFace, faceBits, glory, sparkle, tr, sky } from './lib.js';

export default {
  id: 'j20-gardener',
  beats: [
    { v: 14, text: 'Gdy to powiedziała, odwróciła się i ujrzała stojącego Jezusa,' },
    { v: 14, cont: true, text: 'ale nie wiedziała, że to Jezus.' },
    { v: 15, text: 'Rzekł do niej Jezus: «Niewiasto, czemu płaczesz?' },
    { v: 15, cont: true, text: 'Kogo szukasz?»' },
    { v: 15, cont: true, text: 'Ona zaś sądząc, że to jest ogrodnik, powiedziała do Niego:' },
    { v: 15, cont: true, text: '«Panie, jeśli ty Go przeniosłeś, powiedz mi, gdzie Go położyłeś, a ja Go wezmę».' },
  ],
  cam: { x: [120, 260], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep }), { x: 1230, y: 170, len: 900 });
    const cl = hanging(hangL, cloud(c, 160), { x: 560, y: 150, len: 700 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 200, speed: 40, scale: 0.5 });

    const E = easterGarden(S);
    const G = E.G, L = G.walkL;
    const gl = L.add(`<g opacity="0">${glory(c, 170, 18)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const mEl = L.add(withFace(person(c, { ...MAGD }), faceBits(c)));
    const mary = S.puppet(mEl);
    const sad = mEl.querySelector('[data-part="sad"]'), tear = mEl.querySelector('[data-part="tear"]');
    const rings = voiceRings(L, c, { n: 3, color: C.halo, r: 30, w: 4, both: false });

    // the veil of tears between them
    const vL = S.layer({ par: 0.53, sh: 3 });
    const V = tearVeil(c, 200, 320);
    const veil = vL.add(`<g><path d="M-60 -1600V-160M60 -1600V-160" stroke="rgba(74,54,34,.45)" stroke-width="1.2" fill="none"/>${V.l}${V.r}</g>`);

    const fx = S.layer({ par: 0.56, sh: 5 });
    const q = fx.add(`<g>${question(c)}</g>`);
    const b1 = fx.add(`<g>${bubble(c, tr(['Niewiasto,', 'czemu płaczesz?'], ['Woman, why', 'are you weeping?']), { size: 19, tail: -1 })}</g>`);
    const b2 = fx.add(`<g>${bubble(c, tr('Kogo szukasz?', 'Who are you looking for?'), { size: 20, tail: -1 })}</g>`);
    const th = fx.add(`<g>${thought(c, `<g transform="translate(0 30) scale(.36)">${gardenerMini(c)}</g>`, { w: 110, h: 100 })}</g>`);
    const plea = fx.add(`<g>${bubble(c, tr(['Panie, powiedz mi,', 'gdzie Go położyłeś…'], ['Sir, tell me where', 'you have laid him…']), { size: 18, tail: 1 })}</g>`);
    const glint = fx.add(`<g>${sparkle(c, 12)}</g>`);

    return (t, T) => {
      swing(sunEl, 1230, 170, T, 0.8, 0.5);
      swing(cl, 560 + (T ? Math.sin(T * 0.1) * 30 : 0), 150, T, 1.2, 0.6, 1);
      birds(T, 1);
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y, o: 0 });
      E.bloom(0);

      /* v14a: she turns and sees Jesus standing */
      const come = es(t, 0.1, 0.55);
      pose(gl, { x: GJ.x, y: GJ.y - 110, s: 0.5 + come * 0.5, r: t * 5, o: come * 0.55 * (1 - es(t, 1.0, 1.4) * 0.6) });
      const speak = bump(t, 2.02, 2.95) + bump(t, 3.02, 3.95);
      jesus.set({ x: GJ.x, y: GJ.y, s: 1.08, o: es(t, 0.15, 0.5), armF: 16 + speak * 34 + es(t, 5.1, 5.4) * 20, armB: 10 + speak * 30, head: 4, blink: blinkAt(T) });
      const turn = seg(t, 0.2, 0.28);
      const away = seg(t, 5.7, 5.78);
      const plead = es(t, 5.05, 5.3) * (1 - es(t, 5.65, 5.8));
      const faceL = turn > 0.5 && away < 0.5;
      mary.set({ x: GM.x, y: GM.y, s: 1.02, flip: faceL, armF: faceL ? 22 + plead * 60 : 18, armB: faceL ? 14 + plead * 70 + bump(t, 1.1, 1.9) * 40 : 140, head: faceL ? -2 - plead * 6 : 12, lean: plead * 6 - (faceL ? 0 : 2), blink: blinkAt(T, 3) });
      fade(sad, 1); fade(tear, 1 - (faceL ? 0.5 : 0));

      /* v14b: a veil hangs between them — she does not know Him */
      const vk = es(t, 1.05, 1.4, ease.out);
      pose(veil, { x: GJ.x + 16, y: lerp(-500, 560, vk), o: vk > 0.001 ? 1 : 0 });
      const [mhx, mhy] = headAt(GM.x, GM.y, 1.02, faceL);
      const qk = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 1.9, 2.02));
      pose(q, { x: mhx + 8, y: mhy - 62, s: qk, o: qk > 0.01 ? 1 : 0 });

      /* v15a–b: "Woman, why are you weeping? Whom are you looking for?" */
      const [jhx, jhy] = headAt(GJ.x, GJ.y, 1.08, false);
      rings(jhx + 22, jhy, speak * 0.8, T, { dir: 1, spread: 1.6 });
      const k1 = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.92, 3.02));
      pose(b1, { x: jhx + 90, y: jhy - 34, s: k1, o: k1 > 0.01 ? 1 : 0 });
      const k2 = es(t, 3.05, 3.25, ease.back) * (1 - es(t, 3.92, 4.02));
      pose(b2, { x: jhx + 100, y: jhy - 34, s: k2, o: k2 > 0.01 ? 1 : 0 });

      /* v15c: she thinks He is the gardener */
      const tk = es(t, 4.05, 4.3, ease.back) * (1 - es(t, 4.92, 5.02));
      pose(th, { x: mhx + 6, y: mhy - 20, s: tk, o: tk > 0.01 ? 1 : 0 });
      const gk = bump(t, 4.3, 4.9);
      pose(glint, { x: 1100, y: 590, s: gk * 1.2, r: T * 40, o: gk });

      /* v15d: "Sir, if you have carried Him away…" — then she turns back to the tomb */
      const pk = es(t, 5.05, 5.25, ease.back) * (1 - es(t, 5.62, 5.72));
      pose(plea, { x: mhx - 44, y: mhy - 34, s: pk, o: pk > 0.01 ? 1 : 0 });

      S.cam.x = 190 + es(t, 4, 4.4) * 50 * (1 - es(t, 5.6, 6));
      S.cam.y = 24;
      S.cam.z = 1.04 + es(t, 1.9, 2.3) * 0.04;
    };
  },
};
