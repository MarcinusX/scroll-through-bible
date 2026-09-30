// Łk 2,10–12 — in the golden light the angel lifts his hand: "Do not be afraid!" The shepherds stop trembling and
// raise their heads. "Good news of great joy for all the people" — all along the far ridge the whole people rises
// into view, little lamps of joy over them. "Today in the city of David a Saviour is born to you, who is Christ the
// Lord" — he points to Bethlehem on its hill; a star-lamp comes down over it, and the three names hang in gold.
// "This will be the sign for you" — a round picture comes down: a baby in bands of cloth, lying in a manger.
import { C, blinkAt, pose, lerp, hanging, sheet, mix, crowdPerson, person } from '../kit.js';
import {
  fieldSet, FY, FIREX, flicker, shepherdCast, setShep, SH_AT, flockGroup, angel, glory, glowDisc, say, hungGold, placeTag, cameo,
  manger, baby, bigStar, heart, hangAt, vpose, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const AX = 1070;

/** the whole people on the far ridge: a long row of small figures, arms raised (one still cut-out) */
function people(c, n = 26) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const o = crowdPerson(c);
    const x = -700 + i * 110 + c.rr(-20, 20), k = 0.34 * c.rr(0.9, 1.1);
    out += `<g transform="translate(${x.toFixed(0)} ${c.rr(-6, 6).toFixed(1)}) scale(${(i % 2 ? -k : k).toFixed(3)} ${k.toFixed(3)})">${person(c, { ...o, holdF: '', holdB: '' }).replace('class="armFr"', 'class="armFr" transform="rotate(-150)"').replace('class="armBr"', 'class="armBr" transform="rotate(-140)"')}</g>`;
  }
  return `<g>${out}</g>`;
}

export default {
  id: 'lk2-joy',
  beats: [
    { v: 10, text: 'Lecz anioł rzekł do nich: «Nie bójcie się!' },
    { v: 10, cont: true, text: 'Oto zwiastuję wam radość wielką, która będzie udziałem całego narodu:' },
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [-40, 60], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const F = fieldSet(S);
    const { P, gloryL } = F;
    F.gsk.layer.fade(0.9);
    F.starL.fade(0.25);

    /* the whole people on the far ridge */
    const ppl = F.crowdL.sprite(people(c), 800, 540);
    const lamps = [0, 1, 2, 3, 4, 5, 6].map((i) => F.crowdL.add(`<g>${sparkle(c, 9)}</g>`));

    const flock = P.add(flockGroup(c, 10, 300, 540, FY - 14, { s: 0.74 }));
    const gl = gloryL.add(`<g>${glory(c, 520, 22)}</g>`);
    const wide = gloryL.add(`<g>${glowDisc(520, 'warm-glow', 0.9)}</g>`);
    const townGlow = gloryL.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const ang = S.puppet(P.add(angel(c, { robe: C.linen, mantle: C.halo, hair: C.wheat2, skin: C.skin })));
    const SH = shepherdCast(S, P);

    const X = S.layer({ par: 0.3, sh: 5 });
    const bub = X.add(`<g>${say(c, tr('Nie bójcie się!', 'Don’t be afraid!'), { size: 26, side: -1 })}</g>`);
    const joy = hanging(X, `<g transform="translate(0 -4)">${heart(c, 22)}</g>`, { x: 0, y: 0, len: 700 });
    const joyW = hanging(X, `<g transform="translate(0 44)">${placeTag(c, tr('radość wielka', 'great joy'), 20)}</g>`, { x: 0, y: 0, len: 700 });
    const star = hanging(X, bigStar(c, 20), { x: 0, y: 0, len: 800 });
    const names = [tr('Zbawiciel', 'a Savior'), tr('Mesjasz', 'Christ'), tr('Pan', 'the Lord')].map((w, i) => ({ i, el: X.add(hungGold(c, w, { size: 30 })) }));
    const sign = hanging(X, cameo(c, `<g transform="translate(0 30) scale(.78)"><g transform="translate(0 0)">${manger(c)}</g><g transform="translate(-14 -36)">${baby(c)}</g></g>`, { r: 88, face: mix(C.parchment, C.halo, 0.35) }) + `<g transform="translate(0 118)">${placeTag(c, tr('znak dla was', 'the sign to you'), 19)}</g>`, { x: 0, y: 0, len: 800 });
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      hangAt(F.moonEl, 1250, 150, T, 0.6, 1, 0.5, 1);
      flicker(F.flames, T, FIREX, FY + 2, 0.65);
      pose(gl, { x: AX, y: FY - 170, s: 1, r: T * 2, o: 0.42 - es(t, 3.0, 3.5) * 0.12 });
      pose(wide, { x: 780, y: FY - 120, o: 0.8 });

      /* v10a — "Do not be afraid!": they stop trembling and look up */
      const calm = es(t, 0.3, 0.7);
      const fearT = (i) => (t < 0.35 && T ? Math.sin(T * 26 + i * 2) * 1.2 * (1 - calm) : 0);
      const speak = bump(t, 0.05, 0.95);
      ang.set({ x: AX, y: FY, s: 1.12, flip: true, armF: 60 + speak * 20 + es(t, 2.05, 2.3) * 50 - es(t, 3.0, 3.3) * 60, armB: 110 - calm * 60, head: -4 - es(t, 2.05, 2.3) * 6, blink: blinkAt(T, 2) });
      const bk = es(t, 0.08, 0.25, ease.back) * (1 - es(t, 0.95, 1.05));
      vpose(bub, { x: AX - 30, y: FY - 250, s: Math.max(0.001, bk), o: bk > 0.01 ? 1 : 0 });
      const up = es(t, 0.4, 0.8);
      const stand = es(t, 1.35, 1.45);
      setShep(SH[0], { kneel: 1 - stand, stand }, { x: SH_AT[0].x - 30 * (1 - up) + fearT(0), y: FY, flip: false, armF: lerp(160, 30, up) + es(t, 1.4, 1.8) * 40, armB: lerp(150, 30, up), armBs: 20, head: lerp(14, -10, up), blink: blinkAt(T, 1) });
      setShep(SH[1], { sit: 1 }, { x: SH_AT[1].x - 10 * (1 - up) + fearT(1), y: FY, flip: false, armF: lerp(100, 40, up) + es(t, 1.3, 1.7) * 60, armB: lerp(150, 20, up) + es(t, 1.3, 1.7) * 90, head: lerp(16, -10, up), lean: lerp(-10, 0, up), blink: blinkAt(T, 3) });
      setShep(SH[2], { kneel: 1 }, { x: SH_AT[2].x + 20 * (1 - up) + fearT(2), y: FY, flip: false, armF: lerp(100, 50, up) + es(t, 3.1, 3.4) * 20, armB: lerp(150, 30, up) + es(t, 1.3, 1.7) * 80, head: lerp(18, -8, up) - es(t, 3.0, 3.3) * 10, blink: blinkAt(T, 5) });
      const peek = es(t, 0.6, 1.0);
      setShep(SH[3], { stand: 1 }, { x: lerp(600, 700, peek), y: FY + 4, flip: false, walk: peek > 0.02 && peek < 0.98 ? t * 30 : undefined, armF: 30 + es(t, 1.3, 1.7) * 110, armB: 20 + es(t, 1.3, 1.7) * 120, head: -8, blink: blinkAt(T, 7) });
      pose(flock, { x: 420 - (1 - calm) * 24, y: 0, sx: 1 - (1 - calm) * 0.08, ox: 420 });

      /* v10b — great joy for all the people: the people rise along the ridge */
      const rise = es(t, 1.1, 1.5, ease.out) * (1 - es(t, 2.0, 2.3));
      ppl.set({ x: 800, y: 540 + (1 - rise) * 90, o: rise > 0.01 ? 1 : 0 });
      lamps.forEach((l, i) => {
        const k = es(t, 1.35 + i * 0.05, 1.55 + i * 0.05) * (1 - es(t, 2.0, 2.2));
        vpose(l, { x: 320 + i * 170, y: F.mfn(320 + i * 170) - 110 + Math.sin(T * 1.3 + i) * 5, s: k * 0.9, r: T * 30, o: k });
      });
      const jk = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      hangAt(joy, 800, lerp(-520, 250, jk), T, jk > 0.001 ? 1 : 0, 1.2, 0.8, 1);
      hangAt(joyW, 800, lerp(-520, 250, jk), T, jk > 0.001 ? 1 : 0, 1.2, 0.8, 1);

      /* v11 — today in the city of David: a Saviour, Christ the Lord */
      const sk = es(t, 2.1, 2.45, ease.out);
      hangAt(star, F.townX, lerp(-520, F.townY - 90, sk), T, sk > 0.001 ? 1 : 0, 1, 0.7, 2);
      pose(townGlow, { x: F.townX, y: F.townY - 30, s: 0.6 + sk * 0.6, o: sk });
      names.forEach((n) => {
        const k = es(t, 2.3 + n.i * 0.12, 2.55 + n.i * 0.12, ease.out) * (1 - es(t, 3.0, 3.25, ease.in));
        pose(n.el, { x: 600 + n.i * 190, y: lerp(-500, 250 + (n.i % 2) * 30, k), r: Math.sin(T * 0.9 + n.i) * 1.4, o: k > 0.001 ? 1 : 0 });
      });

      /* v12 — the sign: a baby in bands of cloth, lying in a manger */
      const sg = es(t, 3.05, 3.4, ease.out);
      hangAt(sign, 780, lerp(-560, 260, sg), T, sg > 0.001 ? 1 : 0, 1, 0.7, 3);
      sparks.forEach((sp, i) => {
        const a = T * 0.7 + i * 1.3, k = es(t, 3.3 + i * 0.05, 3.5 + i * 0.05);
        vpose(sp, { x: 780 + Math.cos(a) * 130, y: 250 + Math.sin(a) * 110, s: k * 0.8, r: T * 30, o: k });
      });

      S.cam.x = kfCam(t);
      S.cam.y = 10 - es(t, 2.0, 2.4) * 20;
      S.cam.z = 1.04 - es(t, 1.0, 1.4) * 0.04 + es(t, 3.0, 3.4) * 0.03;
    };
  },
};
const kfCam = (t) => lerp(10, 40, es(t, 2.0, 2.4)) - es(t, 3.0, 3.4) * 30;
