// J 13,36–38 — Simon Peter leans across: "Lord, where are You going?" A round plate comes down: a path of gold
// footprints climbing to a light, Peter's little figure at its foot — "you cannot follow Me now" — then faint
// footprints of his own appear along the path: "but you will follow later". Peter rises: "Why can't I follow You
// now?" — and, hand on heart, he holds out his heart to Him: "I will lay down my life for You!" Jesus looks at him
// with love and sorrow: "Will you lay down your life for Me?" — the heart in Peter's hand trembles. A last plate:
// a rooster in silhouette against the first pale light, and three marks, one after another; the heart dims,
// Peter's face falls, the lamps burn low. A gentle, sorrowful close.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, EVE, JX, CAST, C, tr, person, withFace, faceBits, speech, GLYPH, hungPlate, mini, stepPath, lightHeart, heart, rooster, sheet, mix, shade,
  kf, hand, headAt, vis, pose, fade, lerp, blinkAt, PI, FONT,
} from './lib.js';

/** the plate of the way (inner, plate coords, r ≈ 80); .later = Peter's own faint footprints */
function wayPlate(c, r = 84) {
  const path = c.ribbon(c.cbez([-r * 0.7, r * 0.55], [-r * 0.1, r * 0.5], [-r * 0.2, -r * 0.1], [r * 0.45, -r * 0.55], 20), (u) => 16 - u * 11);
  const later = stepPath(c, 6, { dx: 16, dy: -14, col: mix(C.cream, C.stone2, 0.3) });
  return `<circle cx="${r * 0.45}" cy="${-r * 0.55}" r="${r * 0.6}" fill="url(#halo-glow)"/><path d="${path}" fill="${mix(C.sand, C.halo, 0.4)}" opacity=".8"/>`
    + `<g transform="translate(${-r * 0.42} ${r * 0.36})">${stepPath(c, 6, { dx: 17, dy: -15, col: C.sun })}</g>`
    + `<g class="later" transform="translate(${-r * 0.5} ${r * 0.44})">${later}</g>`
    + `<g transform="translate(${-r * 0.66} ${r * 0.66})">${mini(c, CAST.peter, { sc: 0.28 })}</g>`;
}

export default {
  id: 'j13-rooster',
  beats: [
    { v: 36, text: 'Rzekł do Niego Szymon Piotr: «Panie, dokąd idziesz?»' },
    { v: 36, cont: true, text: 'Odpowiedział mu Jezus: «Dokąd Ja idę, ty teraz za Mną pójść nie możesz, ale później pójdziesz».' },
    { v: 37, text: 'Powiedział Mu Piotr: «Panie, dlaczego teraz nie mogę pójść za Tobą?' },
    { v: 37, cont: true, text: 'Życie moje oddam za Ciebie».' },
    { v: 38, text: 'Odpowiedział Jezus: «Życie swoje oddasz za Mnie?' },
    { v: 38, cont: true, text: 'Zaprawdę, zaprawdę, powiadam ci: Kogut nie zapieje, aż ty trzy razy się Mnie wyprzesz.' },
  ],
  cam: { x: [-160, 20], y: [40, 240], z: [1, 2.1] },
  build(S) {
    const c = S.c;
    const SKY = ['#1d2349', '#2b3262', '#4a4876'];
    const T0 = tableSet(S, { skyCols: SKY });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus, P = by.peter;
    const PY = SEAT - 8;
    const pUp = S.puppet(T0.midL.add(withFace(person(c, CAST.peter), faceBits(c))));
    const pSad = pUp.el.querySelector('[data-part="sad"]'), pTear = pUp.el.querySelector('[data-part="tear"]');
    const fx = S.layer({ par: 0.5, sh: 3 });
    const ask = fx.add(`<g>${speech(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 52, h: 44 })}</g>`);
    const pHeart = fx.add(`<g>${lightHeart(c, 16)}</g>`);
    const pHeartDim = fx.add(`<g>${heart(c, 16, mix(C.jesusMantle, C.stone2, 0.6))}</g>`);
    const hangL = S.layer({ par: 0.5, sh: 4 });
    const way = hangL.add(`<g>${hungPlate(c, wayPlate(c), { r: 84, face: mix(C.night, C.indigo, 0.35) })}</g>`);
    const laterSteps = Array.from(way.querySelectorAll('.later [data-i]'));
    const dawn = mix(C.dawn, C.duskViolet, 0.45);
    const cock = hangL.add(`<g>${hungPlate(c, `<circle cx="-30" cy="-34" r="16" fill="${C.moon}" opacity=".85"/><g transform="translate(14 46) scale(.82)">${rooster(c, { dark: true })}</g>`, { r: 78, face: dawn, rim: C.stone2 })}</g>`);
    const marks = [0, 1, 2].map((i) => hangL.add(`<g><path d="${c.ribbon([[0, 0], [2, -30]], 5)}" fill="${C.inkSoft}"/></g>`));

    return (t, time) => {
      const T = time;
      const low = es(t, 5.1, 5.8) * 0.45;
      T0.idle(t, T, low);
      R.stars.fade(0.9);

      /* b0 — "where are You going?" */
      const lean0 = es(t, 0.05, 0.3) * (1 - es(t, 2.0, 2.1));
      /* b2 — Peter rises; b3 — his heart held out; b4 — it trembles; b5 — it dims */
      const rise = es(t, 2.05, 2.12);
      const hand2chest = es(t, 2.3, 2.6) * (1 - es(t, 3.05, 3.2));
      const offer = es(t, 3.1, 3.4);
      const tremble = es(t, 4.2, 4.4);
      const fall = es(t, 5.3, 5.8);
      at.forEach((m) => {
        if (m.k === 'judas') { m.p.set({ o: 0 }); return; }
        if (m.k === 'jesus') {
          const say1 = bump(t, 1.05, 1.9), say2 = bump(t, 4.05, 4.9), say3 = bump(t, 5.05, 5.95);
          T0.sit(m, T, { armF: 30 + say1 * 30 + say3 * 20, armB: 14 + say1 * 70 + say2 * 40, head: -rise * 10 + say2 * 6 + say3 * 10 });
          fade(m.sad, es(t, 4.1, 4.4));
          return;
        }
        if (m.k === 'peter') {
          T0.sit(m, T, { o: 1 - rise, armF: 36 + lean0 * 40, armB: 14 + lean0 * 30, lean: lean0 * 10, head: -lean0 * 6 });
          return;
        }
        const d = Math.abs(m.x - P.x);
        T0.sit(m, T, { head: (d < 200 ? -4 : 0) * es(t, 2.1, 2.4) + fall * 6 });
        fade(m.sad, fall * 0.8);
      });
      const shake = T ? Math.sin(T * 14) * 2 * tremble * (1 - fall) : 0;
      const armFP = 30 + hand2chest * 20 + offer * 44 - fall * 30;
      const pose2 = { x: P.x, y: PY, s: 0.9, flip: false, o: rise, armF: armFP, armB: 14 + offer * 60 * (1 - tremble) + hand2chest * 10, head: -8 * offer - hand2chest * 4 + fall * 18, lean: offer * 4 - fall * 3, blink: fall > 0.5 ? 0.8 : blinkAt(T, P.seed) };
      pUp.set(pose2);
      fade(pSad, es(t, 4.3, 4.6));
      fade(pTear, es(t, 5.6, 5.9));
      const [phx, phy] = headAt(P.x, SEAT, P.s, false, 62);
      const qk = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.85, 1.0));
      vis(ask, { x: phx + 12, y: phy - 26, s: qk * 0.9, o: qk > 0.01 ? 1 : 0 });
      // the heart: at his breast, then in his hand
      const [hx, hy] = hand(P.x, PY, 0.9, false, armFP, pose2.lean);
      const chestX = P.x + 10, chestY = PY - 112;
      const hk = es(t, 2.3, 2.5);
      const x = lerp(chestX, hx + 6, offer), y = lerp(chestY, hy - 14, offer) + fall * 10;
      vis(pHeart, { x: x + shake, y, s: (0.6 + offer * 0.5) * (1 - fall * 0.2), o: hk * (1 - fall) });
      vis(pHeartDim, { x: x + shake, y, s: (0.6 + offer * 0.5) * 0.8, o: fall });

      /* b1 — the way: not now — later */
      const wk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      vis(way, { x: 730, y: 420 - (1 - wk) * 700, r: T ? Math.sin(T * 0.7) : 0, o: wk > 0.01 ? 1 : 0 });
      laterSteps.forEach((el, i) => fade(el, es(t, 1.5 + i * 0.06, 1.6 + i * 0.06) * 0.8));

      /* b5 — the rooster, three marks */
      const ck = es(t, 5.05, 5.35, ease.out);
      const cy = 330 - (1 - ck) * 700;
      vis(cock, { x: 760, y: cy, r: T ? Math.sin(T * 0.6) * 0.8 : 0, o: ck > 0.01 ? 1 : 0 });
      marks.forEach((el, i) => {
        const k = es(t, 5.45 + i * 0.13, 5.55 + i * 0.13, ease.back);
        vis(el, { x: 760 - 66 + i * 12, y: cy + 34, s: k * 0.85, r: 8, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -120], [1.0, -110], [2.0, -110], [3.0, -110], [4.0, -90], [5.0, -80], [5.5, -60], [6, -60]]);
      S.cam.y = kf(t, [[0, 220], [1.0, 150], [2.0, 190], [3.0, 190], [4.0, 210], [5.0, 170], [5.5, 120], [6, 110]]);
      S.cam.z = kf(t, [[0, 1.9], [1.0, 1.55], [2.0, 1.8], [3.0, 1.9], [4.0, 2.0], [5.0, 1.6], [5.5, 1.4], [6, 1.4]]);
    };
  },
};
