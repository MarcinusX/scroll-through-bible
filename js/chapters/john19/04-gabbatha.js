// J 19,13–16 — Gabbatha. Pilate brings Jesus out and sits on the judgment seat; along the platform's edge the
// mosaic pavement shows and a little mosaic plate comes down with both its names, Lithostrotos and Gabbatha. A
// card: the Preparation of the Passover (the lamb, the unleavened bread) and the sundial at the sixth hour — the
// hanging sun climbs to noon. "Behold your King!" — "Away with Him! Crucify Him!" — "Shall I crucify your
// King?" — "We have no king but Caesar": the coin of Caesar is lowered over the priests. Pilate rises, hands Him
// over and turns away; the soldiers lead Jesus off along the platform.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, headAt, addToHead, soldier, pilate, curuleSeat, thornWreath, PURPLE, taunt, speech, crown, GLYPH, squareSet, squareCrowd, doorway, mosaicBand, pavementPlate, strip, hourCard, caesarCoin, crossSil, glory, tr, PLAT, J19 } from './lib.js';

const JX = 800, DS = 0.9, SEATX = 1010;

export default {
  id: 'j19-gabbatha',
  beats: [
    { v: 13, text: 'Gdy więc Piłat usłyszał te słowa, wyprowadził Jezusa na zewnątrz' },
    { v: 13, cont: true, text: 'i zasiadł na trybunale, na miejscu zwanym Lithostrotos, po hebrajsku Gabbata.' },
    { v: 14, text: 'Był to dzień Przygotowania Paschy, około godziny szóstej.' },
    { v: 14, cont: true, text: 'I rzekł do Żydów: «Oto król wasz!»' },
    { v: 15, text: 'A oni krzyczeli: «Precz! Precz! Ukrzyżuj Go!»' },
    { v: 15, cont: true, text: 'Piłat rzekł do nich: «Czyż króla waszego mam ukrzyżować?»' },
    { v: 15, cont: true, text: 'Odpowiedzieli arcykapłani: «Poza Cezarem nie mamy króla».' },
    { v: 16, text: 'Wtedy więc wydał Go im, aby Go ukrzyżowano.' },
    { v: 16, cont: true, text: 'Zabrali zatem Jezusa.' },
  ],
  cam: { x: [-40, 80], y: [-60, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;
    const H = squareSet(S, { pal: J19.noon });
    H.cellIn.add(`<g transform="translate(${JX} ${PLAT})">${doorway(c, 104, 170)}</g>`);
    const gl = H.cellIn.add(`<g>${glory(c, 260, 14)}</g>`);
    const mosaic = H.cellIn.add(`<g>${mosaicBand(c, 382, 1218, PLAT - 1, 15)}</g>`);
    const P = H.charL;
    P.add(`<g transform="translate(${SEATX} ${PLAT}) scale(0.9)">${curuleSeat(c)}</g>`);
    const sols = [0, 1].map((i) => S.puppet(P.add(soldier(c, i))));
    const pilSt = S.puppet(P.add(pilate(c)));
    const pilSit = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const wr = thornWreath(c);
    const jes = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE }), wr)));
    const jesQ = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE, eyes: 'closed' }), wr)));
    const K = squareCrowd(S, H.crowdL);
    const fx = H.fxL;
    const plate = fx.add(`<g><path d="M-110 0V-1200M110 0V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.3"/><g transform="translate(0 8)">${pavementPlate(c, { w: 240, h: 108 })}</g><g transform="translate(0 150)">${strip(c, 'Lithostrotos', { size: 21 })}</g><g transform="translate(0 190)">${strip(c, tr('po hebrajsku: Gabbata', 'in Hebrew: Gabbatha'), { size: 17, fill: C.parchment })}</g></g>`);
    const card = fx.add(`<g><path d="M-100 0V-1200M100 0V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.3"/>${hourCard(c)}<g transform="translate(0 160)">${strip(c, tr('Przygotowanie Paschy', 'the Preparation of the Passover'), { size: 17 })}</g></g>`);
    const king = fx.add(`<g>${speech(c, `<g transform="translate(0 16) scale(1.3)">${crown(c)}</g>`, { w: 66, h: 56, flip: true })}</g>`);
    const away = fx.add(`<g>${taunt(c, tr('Precz! Precz! Ukrzyżuj Go!', 'Away with him! Crucify him!'), { size: 19, side: 1 })}</g>`);
    const shall = fx.add(`<g>${speech(c, `<g transform="translate(-26 14) scale(0.95)">${crown(c)}</g><g transform="translate(6 16)">${crossSil(c, { h: 40, figure: false })}</g><g transform="translate(30 0)">${GLYPH.q(c)}</g>`, { w: 100, h: 58, flip: true })}</g>`);
    const noKing = fx.add(`<g>${taunt(c, tr('Poza Cezarem nie mamy króla!', 'We have no king but Caesar!'), { size: 19, side: 1 })}</g>`);
    const coin = fx.add(`<g><path d="M-30 0V-1200M30 0V-1200" stroke="rgba(74,54,34,.5)" stroke-width="1.3"/><g transform="translate(0 64)">${caesarCoin(c, 62)}</g></g>`);

    return (t, time) => {
      const T = time;
      const noon = es(t, 2.05, 2.7);
      H.sk.blend(J19.noon, J19.gold, noon * 0.35 + es(t, 7.0, 8.6) * 0.3);
      pose(H.sunEl, { x: lerp(1230, 800, noon), y: lerp(150, 40, noon) - Math.sin(noon * Math.PI) * 30 });
      pose(H.cl1, { x: 420 + Math.sin(T * 0.08) * 20, y: 150 });
      pose(H.cl2, { x: 1050 + Math.sin(T * 0.07 + 2) * 20, y: 110 });

      /* v13a — out of the doorway, Pilate and Jesus */
      const pK = [[0.05, [JX, PLAT - 6]], [0.6, [SEATX - 60, PLAT]], [1.05, [SEATX - 60, PLAT]], [1.3, [SEATX, PLAT]]];
      const [px, py] = kf(t, pK);
      const pIn = es(t, 0.02, 0.2);
      const seated = es(t, 1.28, 1.35) * (1 - es(t, 7.05, 7.12));
      const standX = px;
      const gestK = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.05)) + es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.05));
      const handOver = es(t, 7.1, 7.35) * (1 - es(t, 7.7, 7.9));
      const turned = es(t, 7.75, 7.8);
      pilSt.set({ x: standX, y: py, s: lerp(0.8, 0.88, pIn), flip: turned < 0.5, o: pIn * (1 - seated), walk: moving(t, pK) ? standX * 0.05 : undefined, armF: 20 + handOver * 70, armB: 10 + handOver * 30, head: turned * 6, blink: blinkAt(T, 2) });
      pilSit.set({ x: SEATX, y: PLAT - 31, s: 0.88, flip: true, o: seated, armF: 20 + gestK * 70, armB: 10 + gestK * 30, head: -gestK * 5 + es(t, 6.05, 6.3) * 6 * (1 - es(t, 6.9, 7.0)), blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(SEATX, PLAT - 31, 0.88, true, 62);

      /* Jesus: out, in the middle, then led away */
      const jIn = es(t, 0.15, 0.35);
      const jK = [[0.2, [JX, PLAT - 8]], [0.7, [JX, PLAT + 2]], [8.1, [JX, PLAT + 2]], [8.9, [ph ? 600 : 340, PLAT + 2]]];
      const [jx, jy] = kf(t, jK);
      const js = lerp(0.8, DS, es(t, 0.2, 0.7));
      const quiet = es(t, 4.05, 4.12) * (1 - es(t, 5.0, 5.1)) + es(t, 6.05, 6.12) * (1 - es(t, 8.0, 8.1));
      const jc = { x: jx, y: jy, s: js, flip: t > 8.05, walk: moving(t, jK) && t > 1 ? jx * 0.05 : undefined, amt: 0.7, armF: 8 + Math.sin(T * 0.7) * 1.2, armB: 4, head: 2 + Math.min(1, quiet) * 5, blink: blinkAt(T) };
      const jo = jIn * (1 - es(t, 8.75, 8.95));
      jes.set({ ...jc, o: jo * (1 - Math.min(1, quiet)) });
      jesQ.set({ ...jc, o: jo * Math.min(1, quiet) });
      const kingK = es(t, 3.05, 3.45) * (1 - es(t, 4.0, 4.4));
      pose(gl, { x: jx, y: PLAT - 100, s: 0.5 + kingK * 0.25, r: T * 1.5, o: jo * (0.06 + kingK * 0.35) });

      /* soldiers flank Him, then take Him (v16) */
      const aK = [[7.2, [640, PLAT]], [7.8, [JX - 100, PLAT]], [8.1, [JX - 100, PLAT]], [8.9, [ph ? 520 : 230, PLAT]]]   // phone: still in view as they lead Him off;
      const bK = [[7.2, [1180, PLAT]], [7.8, [JX + 110, PLAT]], [8.1, [JX + 110, PLAT]], [8.9, [ph ? 690 : 460, PLAT]]];
      const [ax, ay] = kf(t, aK), [bx, by] = kf(t, bK);
      sols[0].set({ x: ax, y: ay, s: 0.84, flip: t > 7.85, walk: moving(t, aK) ? ax * 0.05 : undefined, armF: 34, armB: 8 + es(t, 7.75, 8.0) * 40, blink: blinkAt(T, 4), o: 1 - es(t, 8.75, 8.95) });
      sols[1].set({ x: bx, y: by, s: 0.84, flip: true, walk: moving(t, bK) ? bx * 0.05 : undefined, armF: 34, armB: 8, blink: blinkAt(T, 5), o: 1 - es(t, 8.75, 8.95) });

      /* v13b — the Pavement and its names */
      fade(mosaic, es(t, 1.3, 1.6));
      const pl = es(t, 1.3, 1.65) * (1 - es(t, 1.95, 2.15));
      pose(plate, { x: ph ? 960 : 1050, y: lerp(-420, ph ? 60 : 140, pl), r: Math.sin(T * 0.8) * 0.8, o: pl > 0.01 ? 1 : 0 });
      /* v14a — the Preparation of the Passover, about the sixth hour */
      const cd = es(t, 2.1, 2.45) * (1 - es(t, 2.95, 3.15));
      pose(card, { x: ph ? 960 : 1040, y: lerp(-420, 120, cd), r: Math.sin(T * 0.8 + 1) * 0.8, o: cd > 0.01 ? 1 : 0 });
      /* v14b — "Behold your King!" */
      const kk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(king, { x: phx - 26, y: phy - 18, s: kk, o: kk > 0.02 ? 1 : 0 });

      /* the crowd: v15a "Away with Him!", v15c the priests' answer */
      const cry = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.2));
      const pri = es(t, 6.05, 6.3) * (1 - es(t, 6.9, 7.1));
      K.people.forEach((m) => {
        const up = m.shout ? cry : cry * 0.3;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 20 + up * (60 + (m.seed % 3) * 10), armB: 10 + up * 120, head: -6 - up * 6, blink: blinkAt(T, m.seed) });
      });
      K.pr.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 1, armF: 30 + cry * 60 + pri * 60, armB: 10 + cry * 120 + pri * 130, head: -10 - pri * 8, blink: blinkAt(T, 6 + m.i) }));
      K.of.forEach((m) => m.p.set({ x: m.x, y: m.y, s: 1, flip: true, armF: 30 + cry * 60, armB: 10 + cry * 120, head: -10, blink: blinkAt(T, 8 + m.i) }));
      const aw = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.95, 5.1));
      pose(away, { x: 560, y: 590, s: aw, r: -3, o: aw > 0.02 ? 1 : 0 });
      /* v15b — "Shall I crucify your King?" */
      const sk2 = es(t, 5.1, 5.3, ease.back) * (1 - es(t, 5.9, 6.05));
      pose(shall, { x: phx - 26, y: phy - 18, s: sk2, o: sk2 > 0.02 ? 1 : 0 });
      /* v15c — "We have no king but Caesar": the coin is lowered over the priests */
      const nk = es(t, 6.1, 6.3, ease.back) * (1 - es(t, 6.95, 7.1));
      pose(noKing, { x: ph ? 545 : 380, y: 596, s: nk, r: -2, o: nk > 0.02 ? 1 : 0 });
      const cn = es(t, 6.1, 6.5) * (1 - es(t, 7.3, 7.7));
      pose(coin, { x: ph ? 560 : 470, y: lerp(-500, 400, cn) + Math.sin(T * 0.7) * 3, r: Math.sin(T * 0.6) * 1.4, o: cn > 0.01 ? 1 : 0 });

      S.cam.x = es(t, 1.0, 1.4) * 40 * (1 - es(t, 3.0, 3.3)) - es(t, 8.1, 8.9) * 40;
      S.cam.y = -10 - es(t, 2.9, 3.3) * 30 * (1 - es(t, 3.9, 4.2)) + es(t, 5.9, 6.3) * 30 * (1 - es(t, 7.0, 7.4));
      S.cam.z = 1.03 + es(t, 2.9, 3.3) * 0.08 * (1 - es(t, 3.9, 4.2)) + es(t, 7.0, 7.4) * 0.05;
    };
  },
};
