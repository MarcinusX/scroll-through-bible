// J 19,4–8 — the square before the praetorium. Pilate comes out again: "I bring Him out, so that you may know I
// find no guilt in Him" (a little balance with both pans empty). Jesus comes out of the dark doorway in the crown
// of thorns and the purple cloak — and Pilate steps aside: "Behold, the Man!" Everything goes quiet; Jesus stands
// alone in the middle of the platform in a soft light. Then the chief priests and officers cry "Crucify!",
// Pilate pushes it back to them; they raise the scroll of the Law: "He made Himself the Son of God" — the words
// shine in gold — and Pilate, hearing it, draws back, more afraid.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, headAt, addToHead, soldier, pilate, thornWreath, PURPLE, taunt, speech, thought, withFace, faceBits, squareSet, squareCrowd, doorway, noGuilt, lawScroll, glory, wordPlate, crossSil, tr, PLAT, J19, FONT } from './lib.js';

const JX = 800, DS = 0.9;

export default {
  id: 'j19-ecce',
  beats: [
    { v: 4, text: 'A Piłat ponownie wyszedł na zewnątrz i przemówił do nich:' },
    { v: 4, cont: true, text: '«Oto wyprowadzam Go do was na zewnątrz, abyście poznali, że ja nie znajduję w Nim żadnej winy».' },
    { v: 5, text: 'Jezus więc wyszedł na zewnątrz, w koronie cierniowej i płaszczu purpurowym.' },
    { v: 5, cont: true, text: 'Piłat rzekł do nich: «Oto Człowiek».' },
    { v: 6, text: 'Gdy Go ujrzeli arcykapłani i słudzy, zawołali: «Ukrzyżuj! Ukrzyżuj!»' },
    { v: 6, cont: true, text: 'Rzekł do nich Piłat: «Weźcie Go i sami ukrzyżujcie! Ja bowiem nie znajduję w Nim winy».' },
    { v: 7, text: 'Odpowiedzieli mu Żydzi: «My mamy Prawo, a według Prawa powinien On umrzeć,' },
    { v: 7, cont: true, text: 'bo sam siebie uczynił Synem Bożym».' },
    { v: 8 },
  ],
  cam: { x: [-60, 60], y: [-110, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const H = squareSet(S, { pal: J19.noon });
    const door = H.cellIn.add(`<g transform="translate(${JX} ${PLAT})">${doorway(c, 104, 170)}</g>`);
    const gl = H.cellIn.add(`<g>${glory(c, 300, 16)}</g>`);
    const P = H.charL;
    const sols = [0, 1].map((i) => S.puppet(P.add(soldier(c, i + 2))));
    const pilE = P.add(withFace(pilate(c), faceBits(c)));
    const pil = S.puppet(pilE);
    const pSad = pilE.querySelector('[data-part="sad"]');
    const wr = thornWreath(c);
    const jes = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE }), wr)));
    const jesQ = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE, eyes: 'closed' }), wr)));
    const K = squareCrowd(S, H.crowdL);
    const fx = H.fxL;
    const noG = fx.add(`<g>${speech(c, `<g transform="translate(0 4)">${noGuilt(c, 20)}</g>`, { w: 70, h: 56, flip: true })}</g>`);
    const ecce = fx.add(`<g>${wordPlate(c, tr('Oto Człowiek', 'Behold, the man!'), { size: 26 })}</g>`);
    const cry1 = fx.add(`<g>${taunt(c, tr('Ukrzyżuj! Ukrzyżuj!', 'Crucify! Crucify!'), { size: 19, side: 1 })}</g>`);
    const cry2 = fx.add(`<g>${taunt(c, tr('Ukrzyżuj!', 'Crucify!'), { size: 19, side: -1 })}</g>`);
    const take = fx.add(`<g>${speech(c, `<g transform="translate(-16 12)">${crossSil(c, { h: 44, figure: false })}</g><g transform="translate(20 4)">${noGuilt(c, 16)}</g>`, { w: 92, h: 60, flip: true })}</g>`);
    const law = fx.add(`<g>${lawScroll(c, 300, 110, [])}</g>`);
    const son = fx.add(`<g><circle r="90" fill="url(#halo-glow)"/><text x="0" y="8" text-anchor="middle" font-family="${FONT}" font-size="26" font-style="italic" font-weight="600" fill="${shade(C.sun, -0.25)}">${tr('Syn Boży', 'Son of God')}</text></g>`);
    const fear = fx.add(`<g>${thought(c, `<circle r="22" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 14, 6, 10, 0))}" fill="${C.haloRim}"/><path d="${c.poly(c.circ(0, 0, 7, 10))}" fill="${C.halo}"/>`, { w: 62, h: 50 })}</g>`);

    return (t, time) => {
      const T = time;
      const hush = es(t, 3.05, 3.4) * (1 - es(t, 3.95, 4.15));
      H.sk.blend(J19.noon, J19.gold, hush * 0.5 + es(t, 8.0, 8.6) * 0.35);
      H.sunEl && pose(H.sunEl, { x: 1230, y: 150 });

      /* Pilate: out of the doorway, speaking; aside for "Behold"; pushing it back; drawing back afraid */
      const pK = [[0.25, [JX, PLAT - 4]], [0.75, [980, PLAT]], [3.0, [980, PLAT]], [3.3, [1040, PLAT]], [8.05, [1040, PLAT]], [8.6, [1110, PLAT]]];
      const [px, py] = kf(t, pK);
      const pIn = es(t, 0.02, 0.22);
      const speak = es(t, 0.55, 0.85) * (1 - es(t, 1.9, 2.05));
      const point = bump(t, 1.1, 1.95);
      const present = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.1));
      const push = bump(t, 5.08, 5.95);
      const afraid = es(t, 8.05, 8.3);
      const shake = afraid * Math.sin(T * 26) * 1.2 * (1 - es(t, 8.7, 8.95));
      pil.set({ x: px + shake, y: py, s: lerp(0.8, 0.88, pIn), flip: t > 0.55, o: pIn, walk: moving(t, pK) ? px * 0.05 : undefined, armF: 20 + speak * 40 + point * 50 + present * 70 + push * 70 - afraid * 10, armB: 10 + speak * 90 + push * 60 + afraid * 50, head: -speak * 6 - present * 4 + afraid * 8, lean: -afraid * 6, blink: blinkAt(T, 2) });
      fade(pSad, afraid);
      const nk = es(t, 1.12, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      const [phx, phy] = headAt(px, py, 0.88, true);
      pose(noG, { x: phx - 26, y: phy - 20, s: nk, o: nk > 0.02 ? 1 : 0 });

      /* v5a — Jesus comes out, in the crown of thorns and the purple cloak */
      const jIn = es(t, 2.05, 2.35);
      const jy = lerp(PLAT - 8, PLAT + 2, es(t, 2.1, 2.7));
      const js = lerp(0.8, DS, es(t, 2.1, 2.7));
      const quiet = es(t, 4.05, 4.12) * (1 - es(t, 6.9, 7.0));
      const jc = { x: JX, y: jy, s: js, armF: 8 + Math.sin(T * 0.7) * 1.2, armB: 4, head: 2 + quiet * 6, blink: blinkAt(T) };
      jes.set({ ...jc, o: jIn * (1 - quiet) });
      jesQ.set({ ...jc, o: jIn * quiet });
      /* v5b — "Behold, the Man!": the light around Him, and quiet */
      const lightK = es(t, 3.05, 3.5) * (1 - es(t, 4.0, 4.4) * 0.6) + es(t, 7.1, 7.4) * 0.3 * (1 - es(t, 8.1, 8.6));
      pose(gl, { x: JX, y: PLAT - 110, s: 0.55 + lightK * 0.3, r: T * 1.5, o: jIn * (0.08 + lightK * 0.4) });
      const ek = es(t, 3.1, 3.4) * (1 - es(t, 3.95, 4.15));
      pose(ecce, { x: JX, y: lerp(-400, 150, ek), r: Math.sin(T * 0.8) * 0.6, o: ek > 0.01 ? 1 : 0 });

      /* soldiers flank the doorway */
      sols[0].set({ x: 640, y: PLAT, s: 0.84, armF: 34, armB: 8, blink: blinkAt(T, 4) });
      sols[1].set({ x: 1180, y: PLAT, s: 0.84, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 5) });

      /* the crowd: turning, quiet at "Behold", then crying out */
      const cry = es(t, 4.05, 4.3) * (1 - es(t, 5.0, 5.3)) + bump(t, 6.05, 6.9) * 0.4;
      K.people.forEach((m) => {
        const up = m.shout ? cry : cry * 0.3;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 20 + up * (60 + (m.seed % 3) * 10), armB: 10 + up * 120, head: -6 - up * 6 - hush * 6, blink: blinkAt(T, m.seed) });
      });
      const lawUp = es(t, 6.05, 6.4) * (1 - es(t, 8.1, 8.4));
      const pointJ = es(t, 7.05, 7.3) * (1 - es(t, 8.1, 8.4));
      K.pr.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 1, flip: false, armF: 30 + cry * 60 + (m.i === 0 ? lawUp * 60 + pointJ * 40 : 0), armB: 10 + cry * 120 + (m.i === 1 ? lawUp * 120 : 0), head: -10 - cry * 6, blink: blinkAt(T, 6 + m.i) }));
      K.of.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 1, flip: true, armF: 30 + cry * 60, armB: 10 + cry * 120, head: -10 - cry * 6, blink: blinkAt(T, 8 + m.i) }));

      /* v6a — "Crucify! Crucify!" */
      const c1 = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.95, 5.1));
      pose(cry1, { x: 480, y: 580, s: c1, r: -3, o: c1 > 0.02 ? 1 : 0 });
      const c2 = es(t, 4.25, 4.45, ease.back) * (1 - es(t, 4.95, 5.1));
      pose(cry2, { x: 1160, y: 584, s: c2, r: 3, o: c2 > 0.02 ? 1 : 0 });
      /* v6b — "Take Him yourselves" */
      const tk = es(t, 5.1, 5.3, ease.back) * (1 - es(t, 5.9, 6.05));
      pose(take, { x: phx - 26, y: phy - 20, s: tk, o: tk > 0.02 ? 1 : 0 });
      /* v7 — the Law, and "the Son of God" in gold */
      pose(law, { x: 500, y: lerp(760, 520, lawUp), s: 0.5 + lawUp * 0.5, r: -2, o: lawUp > 0.02 ? 1 : 0 });
      const sk2 = es(t, 7.1, 7.4) * (1 - es(t, 8.1, 8.4));
      pose(son, { x: 500, y: 524, s: sk2, o: sk2 > 0.02 ? 1 : 0 });
      /* v8 — Pilate hears it and is more afraid */
      const fk = es(t, 8.15, 8.4, ease.back);
      pose(fear, { x: phx + 6, y: phy - 10, s: fk, o: fk > 0.02 ? 1 : 0 });
      fade(door, 1);

      S.cam.x = hush * 0 + es(t, 5.0, 5.4) * -30 * (1 - es(t, 7.9, 8.2)) + es(t, 7.9, 8.3) * 40;
      S.cam.y = -20 - hush * 80 + es(t, 5.9, 6.3) * 40 * (1 - es(t, 7.9, 8.2));
      S.cam.z = 1.04 + hush * 0.22 + es(t, 7.9, 8.3) * 0.08;
    };
  },
};
