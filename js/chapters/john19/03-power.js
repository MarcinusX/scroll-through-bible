// J 19,9–12 — inside the praetorium again. Pilate asks "Where are You from?" — and Jesus is silent: only a
// soft shaft of light comes down on Him from above. "Don't You know I have power to release You and power to
// crucify You?" — a great balance hangs over Pilate's raised hand: an opened fetter on one pan, a small cross on
// the other. "You would have no power over Me unless it had been given you from above": the balance's string is
// lit — it hangs from above, not from Pilate's hand, and his shadow on the floor shrinks. The greater sin: a
// dark stone sinks the far pan. Pilate takes a key to set Him free — but from outside the cry comes, and a huge
// coin of Caesar is lowered on the fly-lines; Pilate lets the key fall and turns to face the coin.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, headAt, addToHead, pilate, thornWreath, PURPLE, speech, taunt, GLYPH, withFace, faceBits, hallSet, lampSet, bigBalance, fetter, crossSil, keyGlyph, lightShaft, guiltStone, medallion, caesarCoin, voiceRings, HP, LOOK, tr, J19, PI } from './lib.js';

const GY = 690, JX = 780, JS = 1.02;
const BX = 1010, BY = 150, ARM = 130;   // the balance's hook

export default {
  id: 'j19-power',
  beats: [
    { v: 9, text: 'Wszedł znów do pretorium i zapytał Jezusa: «Skąd Ty jesteś?»' },
    { v: 9, cont: true, text: 'Jezus jednak nie dał mu odpowiedzi.' },
    { v: 10, text: 'Rzekł więc Piłat do Niego: «Nie chcesz mówić ze mną?' },
    { v: 10, cont: true, text: 'Czy nie wiesz, że mam władzę uwolnić Ciebie i mam władzą Ciebie ukrzyżować?»' },
    { v: 11, text: 'Jezus odpowiedział: «Nie miałbyś żadnej władzy nade Mną, gdyby ci jej nie dano z góry.' },
    { v: 11, cont: true, text: 'Dlatego większy grzech ma ten, który Mnie wydał tobie».' },
    { v: 12, text: 'Odtąd Piłat usiłował Go uwolnić.' },
    { v: 12, cont: true, text: 'Żydzi jednak zawołali: «Jeżeli Go uwolnisz, nie jesteś przyjacielem Cezara.' },
    { v: 12, cont: true, text: 'Każdy, kto się czyni królem, sprzeciwia się Cezarowi».' },
  ],
  cam: { x: [-40, 80], y: [-60, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;
    const bx = ph ? 940 : BX;   // phone: the whole balance and the coin inside the screen
    const H = hallSet(S);
    const props = H.props;
    const shaft = props.add(`<g>${lightShaft(c, { w0: 70, w1: 250, h: 760 })}</g>`);
    const pShadow = props.add(`<g><ellipse cx="0" cy="0" rx="70" ry="11" fill="${C.ink}" opacity=".22"/></g>`);
    const P = H.charL;
    const pilE = P.add(withFace(pilate(c), faceBits(c)));
    const pil = S.puppet(pilE);
    const pSad = pilE.querySelector('[data-part="sad"]');
    const wr = thornWreath(c);
    const jes = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE }), wr)));
    const jesQ = S.puppet(P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE, eyes: 'closed' }), wr)));
    const fx = H.fxL;
    const whence = fx.add(`<g>${speech(c, `<g transform="translate(-14 0) scale(1.1)">${GLYPH.q(c)}</g><path d="${c.poly(c.star(16, -8, 9, 3.6, 4, 0))}" fill="${C.haloRim}"/><path d="${c.poly(c.star(22, 10, 5, 2, 4, 0.4))}" fill="${C.haloRim}"/>`, { w: 80, h: 56, flip: true })}</g>`);
    const again = fx.add(`<g>${speech(c, `<g transform="scale(1.1)">${GLYPH.q(c)}</g><g transform="translate(22 0)">${GLYPH.q(c)}</g>`, { w: 84, h: 52, flip: true })}</g>`);
    const keyEl = fx.add(`<g>${keyGlyph(c)}</g>`);

    /* the balance of power, on the fly-lines */
    const balL = S.layer({ par: 0.5, sh: 5 });
    const B = bigBalance(c, ARM);
    const hook = balL.add(`<g><path d="M0 0V-1400" stroke="rgba(74,54,34,.55)" stroke-width="1.4"/><g class="lit" opacity="0"><path d="${c.ribbon([[0, 0], [0, -1400]], 3)}" fill="${C.haloRim}"/><circle r="40" fill="url(#halo-glow)"/></g>${B.stand}</g>`);
    const lit = hook.querySelector('.lit');
    const beam = balL.add(`<g>${B.beam}</g>`);
    const panL = balL.add(`<g>${B.pan}<g class="a" transform="translate(0 84)">${fetter(c, 13)}<g transform="translate(22 -2) rotate(30)">${fetter(c, 11)}</g></g><g class="b" opacity="0" transform="translate(0 88)">${guiltStone(c, 30, true)}<g transform="translate(0 -26)">${medallion(c, HP, { r: 13 })}</g></g></g>`);
    const panR = balL.add(`<g>${B.pan}<g class="a" transform="translate(0 88)">${crossSil(c, { h: 46, figure: false, col: C.wood2 })}</g><g class="b" opacity="0" transform="translate(0 88)">${guiltStone(c, 14)}</g></g>`);
    const pa = [panL, panR].map((p) => [p.querySelector('.a'), p.querySelector('.b')]);
    /* Caesar's coin and the cries from outside */
    const coinL = S.layer({ par: 0.4, sh: 6 });
    const coin = coinL.add(`<g><path d="M-40 0V-1400M40 0V-1400" stroke="rgba(74,54,34,.5)" stroke-width="1.3"/><g transform="translate(0 110)">${caesarCoin(c, 100)}</g></g>`);
    const cryA = coinL.add(`<g>${taunt(c, tr(['Jeżeli Go uwolnisz,', 'nie jesteś przyjacielem Cezara!'], ['If you release him,', 'you aren’t Caesar’s friend!']), { size: 18, side: -1 })}</g>`);
    const cryB = coinL.add(`<g>${taunt(c, tr(['Kto się czyni królem,', 'sprzeciwia się Cezarowi!'], ['Whoever makes himself a king', 'speaks against Caesar!']), { size: 18, side: -1 })}</g>`);
    const rings = voiceRings(coinL, c, { n: 3, color: '#8f8c96', r: 26, w: 4, both: false });

    return (t, time) => {
      const T = time;
      H.sk.blend(J19.court, J19.gold, es(t, 3.9, 4.6) * 0.5 * (1 - es(t, 6.8, 7.4)));
      pose(H.orb, { x: 690, y: 400 });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.lamps.forEach((l) => lampSet(l, 0, T));

      /* v9 — into the praetorium: "Where are You from?" */
      const pK = [[-0.3, [380, GY]], [0.55, [1000, GY + 2]], [6.05, [1000, GY + 2]], [6.5, [920, GY + 2]], [7.1, [920, GY + 2]], [7.5, [1010, GY + 2]]];
      const jK = [[-0.3, [220, GY]], [0.6, [JX, GY]]];
      const [px, py] = kf(t, pK), [jx, jy] = kf(t, jK);
      const ask = es(t, 0.5, 0.7) * (1 - es(t, 1.2, 1.4)) + bump(t, 2.05, 2.9);
      const claim = es(t, 3.05, 3.3) * (1 - es(t, 4.1, 4.4));
      const offer = es(t, 6.3, 6.6) * (1 - es(t, 7.1, 7.3));
      const halt = bump(t, 7.1, 7.6);
      const turnAway = es(t, 8.1, 8.2);
      const pFlip = t < 6.55 ? t > 0.5 : t < 7.3 ? true : turnAway < 0.5;
      pil.set({ x: px, y: py, s: 1.02, flip: pFlip, walk: moving(t, pK) ? px * 0.05 : undefined, armF: 20 + ask * 50 + claim * 78 + offer * 70 + halt * 30, armB: 10 + claim * 40 + ask * 20 + halt * 60 - es(t, 4.1, 4.5) * 0, head: -claim * 10 + es(t, 4.1, 4.5) * 8 * (1 - es(t, 6.0, 6.3)) - turnAway * 6, lean: es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1)) * -6, blink: blinkAt(T, 2) });
      fade(pSad, es(t, 4.2, 4.5) * (1 - es(t, 6.0, 6.3)) + es(t, 7.2, 7.4));
      const wk = es(t, 0.55, 0.78, ease.back) * (1 - es(t, 1.25, 1.45));
      const [phx, phy] = headAt(px, py, 1.02, true);
      pose(whence, { x: phx - 24, y: phy - 20, s: wk, o: wk > 0.02 ? 1 : 0 });
      const ak = es(t, 2.08, 2.3, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(again, { x: phx - 24, y: phy - 20, s: ak, o: ak > 0.02 ? 1 : 0 });
      // Pilate's shadow on the floor: long while he boasts, small once power is shown to come from above
      pose(pShadow, { x: px + 30, y: py + 2, sx: 1 + claim * 0.8 - es(t, 4.2, 4.6) * 0.55 * (1 - es(t, 6.0, 6.4)), sy: 1 });

      /* Jesus: silent in the light from above */
      const silent = es(t, 1.05, 1.15) * (1 - es(t, 3.95, 4.05)) + es(t, 5.95, 6.05) * (1 - es(t, 6.4, 6.5)) + es(t, 7.05, 7.12);
      const jc = { x: jx, y: jy, s: JS, walk: moving(t, jK) ? jx * 0.05 : undefined, armF: 8 + Math.sin(T * 0.7) * 1.2, armB: 4, head: 2 + Math.min(1, silent) * 5 - es(t, 4.05, 4.3) * (1 - es(t, 5.9, 6.1)) * 4, blink: blinkAt(T) };
      jes.set({ ...jc, o: 1 - Math.min(1, silent) });
      jesQ.set({ ...jc, o: Math.min(1, silent) });
      const sk = es(t, 1.1, 1.5) * (1 - es(t, 2.05, 2.4) * 0.5) + es(t, 4.05, 4.4) * 0.6;
      pose(shaft, { x: jx, y: GY + 4, sx: 0.8 + sk * 0.25, o: Math.min(1, sk) * (1 - es(t, 7.1, 7.6) * 0.6) });

      /* v10b — the balance: release · crucify */
      const bIn = es(t, 3.05, 3.4) * (1 - es(t, 6.05, 6.4));
      const hy = BY - (1 - bIn) * 700;
      pose(hook, { x: bx, y: hy });
      fade(lit, es(t, 4.1, 4.5) * (1 - es(t, 6.0, 6.3)));
      const tilt = Math.sin(Math.max(0, t - 3.3) * 6) * 8 * bump(t, 3.3, 4.0) + es(t, 5.1, 5.5) * 16;
      const r = (tilt * PI) / 180;
      const py0 = hy + 44;
      pose(beam, { x: bx, y: py0, r: tilt });
      pose(panL, { x: bx - Math.cos(r) * ARM, y: py0 - Math.sin(r) * ARM });
      pose(panR, { x: bx + Math.cos(r) * ARM, y: py0 + Math.sin(r) * ARM });
      const swap = es(t, 5.05, 5.25);
      pa.forEach(([a, b]) => { fade(a, 1 - swap); fade(b, swap); });

      /* v12a — Pilate tries to set Him free: a key */
      const [kx, ky] = hand(px, py, 1.02, pFlip, 20 + offer * 70 + halt * 30);
      const drop = es(t, 7.3, 7.7, ease.in);
      pose(keyEl, { x: kx + drop * 20, y: ky + drop * (GY - 4 - ky), r: drop * 110, s: 1.1, o: es(t, 6.2, 6.3) * (1 - es(t, 8.6, 8.9)) });

      /* v12b–c — the cry from outside; Caesar's coin comes down */
      const cn = es(t, 7.1, 7.6);
      pose(coin, { x: ph ? 990 : 1160, y: lerp(-700, 130, cn) + Math.sin(T * 0.7) * 3 * cn, r: Math.sin(T * 0.6) * 1.2 * cn, s: 1 + es(t, 8.05, 8.6) * 0.12 });
      const ca = es(t, 7.1, 7.35, ease.back) * (1 - es(t, 7.9, 8.05));
      pose(cryA, { x: ph ? 1085 : 1110, y: 450, s: ca, r: 2, o: ca > 0.02 ? 1 : 0 });
      const cb = es(t, 8.1, 8.35, ease.back) * (1 - es(t, 8.9, 9.1));
      pose(cryB, { x: ph ? 1085 : 1110, y: 450, s: cb, r: 2, o: cb > 0.02 ? 1 : 0 });
      rings(ph ? 1150 : 1290, 560, bump(t, 7.05, 7.9) + bump(t, 8.05, 8.9), T, { dir: -1, spread: 2 });

      S.cam.x = es(t, 3.0, 3.4) * 50 * (1 - es(t, 6.0, 6.4)) + es(t, 7.0, 7.5) * 70;
      S.cam.y = -20 + es(t, 3.0, 3.4) * -30 * (1 - es(t, 6.0, 6.4));
      S.cam.z = 1.04 + es(t, 1.05, 1.5) * 0.06 * (1 - es(t, 3.0, 3.3)) + es(t, 8.0, 8.8) * 0.05;
    };
  },
};
