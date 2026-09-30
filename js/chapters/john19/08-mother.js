// J 19,25–27 — near the cross: it stands tall over the slope, a quiet silhouette with its ring of light. Below it
// stand His mother (her blue veil), her sister Mary of Clopas and Mary Magdalene; their names hang down. Jesus
// sees His mother and the disciple He loved: a soft light falls on the two of them. "Woman, behold your son" —
// a thread of light runs from Him to her and on to John; "Behold your mother" — a small heart glows between
// them. And from that hour the disciple takes her to his own home: his arm around her, they turn to go, and far
// off on the hill the window of a little house kindles.
import { C, person, blinkAt, pose, lerp, attr } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { withFace, faceBits, nameTag, strip, wordPlate, heart, homeLight, crossNearSet, hanging, swing, tr, MOTHER, CLOPAS, MAGDALENE, BELOVED, NEAR, J19, PI } from './lib.js';

const GY = 704;

export default {
  id: 'j19-mother',
  beats: [
    { v: 25, text: 'A obok krzyża Jezusowego stały: Matka Jego' },
    { v: 25, cont: true, text: 'i siostra Matki Jego, Maria, żona Kleofasa, i Maria Magdalena.' },
    { v: 26, text: 'Kiedy więc Jezus ujrzał Matkę i stojącego obok Niej ucznia, którego miłował,' },
    { v: 26, cont: true, text: 'rzekł do Matki: «Niewiasto, oto syn Twój».' },
    { v: 27, text: 'Następnie rzekł do ucznia: «Oto Matka twoja».' },
    { v: 27, cont: true, text: 'I od tej godziny uczeń wziął Ją do siebie.' },
  ],
  cam: { x: [-60, 20], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;   // phone: the two Marys and their names a little nearer the cross
    const N = crossNearSet(S, { pal: J19.gold });
    const home = N.far.add(`<g transform="translate(540 552) scale(0.8)">${homeLight(c, { w: 60, h: 44 })}</g>`);
    const win = home.querySelector('.win'), wglow = home.querySelector('.wglow');
    const [HX, HY] = N.head;
    const glow = N.glowL.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    /* the light that falls on the two of them, and the thread between them */
    const beam = N.glowL.add(`<g><path d="${c.poly([[HX - 14, HY + 20], [HX + 6, HY + 20], [700, GY - 10], [560, GY - 10]])}" fill="#fff3cf" opacity=".28"/><ellipse cx="630" cy="${GY - 6}" rx="120" ry="18" fill="url(#halo-glow)"/></g>`);
    const P = N.P;
    const mk = (o) => { const el = P.add(withFace(person(c, o), faceBits(c))); return { p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), tear: el.querySelector('[data-part="tear"]') }; };
    const john = mk(BELOVED);
    const mary = mk(MOTHER);
    const clop = mk(CLOPAS);
    const magd = mk(MAGDALENE);
    const fx = N.fx;
    const threadD = c.qbez([HX - 8, HY + 26], [720, 380], [686, 520], 14).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
    const thread2D = c.qbez([686, 520], [640, 440], [596, 520], 12).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
    const th = fx.add(`<g><path d="M${threadD}" fill="none" stroke="${C.haloRim}" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></g>`).firstElementChild;
    const th2 = fx.add(`<g><path d="M${thread2D}" fill="none" stroke="${C.haloRim}" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></g>`).firstElementChild;
    const hrt = fx.add(`<g><circle r="40" fill="url(#halo-glow)"/>${heart(c, 16)}</g>`);
    const tagL = S.layer({ par: 0.5, sh: 5 });
    const tags = [
      hanging(tagL, nameTag(c, tr('Matka Jego', 'His mother'), { size: 17 }), { x: 0, y: 0, len: 900 }),
      hanging(tagL, nameTag(c, tr(['Maria,', 'żona Kleofasa'], ['Mary,', 'wife of Clopas']), { size: 15 }), { x: 0, y: 0, len: 900 }),
      hanging(tagL, nameTag(c, tr('Maria Magdalena', 'Mary Magdalene'), { size: 15 }), { x: 0, y: 0, len: 900 }),
      hanging(tagL, nameTag(c, tr(['uczeń, którego', 'miłował'], ['the disciple', 'whom He loved']), { size: 15 }), { x: 0, y: 0, len: 900 }),
    ];
    const plL = S.layer({ par: 0.3, sh: 6 });
    const pl1 = plL.add(`<g>${wordPlate(c, tr('Niewiasto, oto syn Twój', 'Woman, behold, your son!'), { size: 24 })}</g>`);
    const pl2 = plL.add(`<g>${wordPlate(c, tr('Oto Matka twoja', 'Behold, your mother!'), { size: 24 })}</g>`);

    return (t, time) => {
      const T = time;
      N.sk.blend(J19.gold, J19.still, es(t, 0, 6) * 0.3);
      const see = es(t, 2.05, 2.4);
      pose(N.hd, { x: 0, y: N.HDY, r: -see * 8 });
      fade(N.hl, 0.75 + see * 0.25);
      pose(glow, { x: HX, y: HY, s: 1 + see * 0.3, o: 0.5 + see * 0.3 });
      fade(beam, see * (0.9 - es(t, 5.1, 5.6) * 0.5));

      /* the women and the disciple */
      const leave = es(t, 5.3, 5.95);
      const mIn = es(t, -0.2, 0.4);
      const mx = lerp(686, 610, leave), jx0 = lerp(520, 598, es(t, 2.1, 2.5));
      const jx = lerp(lerp(jx0, 726, es(t, 5.05, 5.35)), 656, leave);
      const turnM = es(t, 3.1, 3.2) * (1 - es(t, 5.2, 5.3));
      const turnJ = t > 2.5 && t < 5.25 ? 0 : 1;
      const hug = es(t, 5.25, 5.45);
      const walkOn = leave > 0 && leave < 1;
      john.p.set({ x: jx, y: GY + 2, s: 1, flip: t > 5.2, walk: (t > 2.1 && t < 2.5) || (t > 5.05 && t < 5.95) ? jx * 0.05 : undefined, amt: 0.6, armF: 10 + bump(t, 4.05, 4.9) * 30 + hug * 62, armB: 6, head: -see * 10 + bump(t, 4.05, 4.9) * 6 + hug * 14, blink: blinkAt(T, 3), o: es(t, 1.9, 2.1) });
      mary.p.set({ x: mx, y: GY, s: 1, flip: turnM > 0.5 || t > 5.25, walk: walkOn ? mx * 0.05 : undefined, amt: 0.5, armF: 20 + bump(t, 3.1, 3.9) * 30, armB: 10 + (1 - see) * 20 * mIn, head: -12 + see * 4 + turnM * 10, blink: blinkAt(T, 1), o: mIn });
      fade(mary.sad, 1); fade(mary.tear, mIn * (1 - see));
      const wIn = es(t, 1.05, 1.4);
      clop.p.set({ x: ph ? 885 : 910, y: GY, s: 0.98, flip: true, armF: 30 + Math.sin(0.3) * 4, armB: 10, head: -12, blink: blinkAt(T, 5), o: wIn });
      magd.p.set({ x: ph ? 980 : 1010, y: GY + 4, s: 0.98, flip: true, armF: 70, armB: 60, head: -14, lean: 4, blink: blinkAt(T, 7), o: wIn });
      fade(clop.sad, 1); fade(magd.sad, 1); fade(magd.tear, wIn);

      /* the names */
      const tk = (a, b) => es(t, a, a + 0.3) * (1 - es(t, b, b + 0.2));
      swing(tags[0], 686, 380 - (1 - tk(0.2, 0.95)) * 700, T, 1, 0.9, 1);
      swing(tags[1], ph ? 870 : 900, 380 - (1 - tk(1.1, 1.95)) * 700, T, 1, 0.9, 2);
      swing(tags[2], ph ? 995 : 1030, 400 - (1 - tk(1.25, 1.95)) * 700, T, 1, 0.9, 3);
      swing(tags[3], 560, 390 - (1 - tk(2.2, 2.95)) * 700, T, 1, 0.9, 4);

      /* v26b — "Woman, behold your son": the thread of light */
      attr(th, 'stroke-dashoffset', 1 - es(t, 3.05, 3.5));
      attr(th2, 'stroke-dashoffset', 1 - es(t, 3.4, 3.8));
      fade(th, es(t, 3.0, 3.1) * (1 - es(t, 5.3, 5.6)) * 0.9);
      fade(th2, es(t, 3.35, 3.45) * (1 - es(t, 5.3, 5.6)) * 0.9);
      const p1 = es(t, 3.05, 3.4) * (1 - es(t, 3.95, 4.15));
      pose(pl1, { x: 800, y: lerp(-300, 150, p1), r: Math.sin(T * 0.7) * 0.6, o: p1 > 0.01 ? 1 : 0 });
      /* v27a — "Behold your mother": a heart between them */
      const p2 = es(t, 4.05, 4.4) * (1 - es(t, 4.95, 5.15));
      pose(pl2, { x: 800, y: lerp(-300, 150, p2), r: Math.sin(T * 0.7 + 1) * 0.6, o: p2 > 0.01 ? 1 : 0 });
      const hk = es(t, 4.2, 4.5, ease.back);
      pose(hrt, { x: lerp(642, 610, leave), y: 470 - leave * 20, s: hk * (1 + Math.sin(T * 2) * 0.04), o: hk > 0.02 ? 1 - es(t, 5.7, 5.95) * 0.3 : 0 });

      /* v27b — to his own home: the window far off kindles */
      const lit = es(t, 5.45, 5.85);
      fade(win, lit); fade(wglow, lit * 0.9);

      S.cam.x = -es(t, 2.0, 2.5) * 40 - es(t, 5.2, 5.9) * 20;
      S.cam.y = 10 - es(t, 2.9, 3.4) * 20;
      S.cam.z = 1.02 + es(t, 2.0, 2.5) * 0.05;
    };
  },
};
