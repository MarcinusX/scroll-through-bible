// J 4,19–22 — "Sir, I see that you are a prophet." Two painted hills come down on strings: on the left Mount
// Gerizim with the ruins of the Samaritan temple and the fathers praying on its top; on the right Jerusalem with the
// Temple and its pilgrims. "The hour is coming" — an hourglass; "neither on this mountain nor in Jerusalem" — both
// hills go up into the flies and a broad light falls on everyone. "You worship what you do not know" — a mist over
// her; "we worship what we know" — an open scroll over Him; "salvation is from the Jews" — a star of light rises
// from the scroll and comes to rest over Jesus.
import { C, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { wellSet, wellCast, G, NOON, jerusalem, shadowPerson, samaritan, hang2, hourglassJ, nameTag, glory, vis, kf, hanging, swing, PI } from './lib.js';

const INK = '#4a3a33';
const GZ0 = { x: 530, y: 306 }, JR0 = { x: 1190, y: 420 };

export default {
  id: 'j4-mountain',
  beats: [
    { v: 19 },
    { v: 20, text: 'Ojcowie nasi oddawali cześć Bogu na tej górze,' },
    { v: 20, cont: true, text: 'a wy mówicie, że w Jerozolimie jest miejsce, gdzie należy czcić Boga».' },
    { v: 21, text: 'Odpowiedział jej Jezus: «Wierz Mi, kobieto, że nadchodzi godzina,' },
    { v: 21, cont: true, text: 'kiedy ani na tej górze, ani w Jerozolimie nie będziecie czcili Ojca.' },
    { v: 22, text: 'Wy czcicie to, czego nie znacie, my czcimy to, co znamy,' },
    { v: 22, cont: true, text: 'ponieważ zbawienie bierze początek od Żydów.' },
  ],
  cam: { x: [-60, 80], y: [-80, 80], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    // phone: both hills, their people and their name tags inside the frame; the hourglass between the two at the well
    const PH = S.portrait;
    const JR = PH ? { x: 975, y: 330 } : JR0;
    const HG = PH ? { x: 850, y: 420 } : { x: 850, y: 290 };
    let flatL;
    const W = wellSet(S, { skyCols: NOON, sunAt: [830, 140], behind: (S) => { flatL = S.layer({ par: 0.5, sh: 5 }); return S.layer({ par: 0.55, sh: 0, flat: true }); } });
    const GZ = { x: W.gerX + 10, y: GZ0.y };
    const K = wellCast(S, W);

    /* ---------- the two painted hills ---------- */
    const wor = (i) => shadowPerson(c, { ...samaritan(c, i + 20), holdF: '', holdB: '' }, INK);
    // on the real Gerizim behind the well: the altar fire and the fathers praying on its top
    const gEl = W.farL.add(`<g><circle r="60" fill="url(#warm-glow)"/><path d="M-9 0C-14 -8 -11 -20 0 -30C11 -20 14 -8 9 0Z" fill="${C.lampFlame}"/></g>`);
    const gWor = [-62, -40, 50, 72].map((dx, i) => { const p = S.puppet(W.farL.add(wor(i))); return { p, dx, i }; });
    const jFlat = `<g transform="translate(0 0)">${jerusalem(c, 0.22, { tglow: true })}</g>`;
    const jEl = flatL.add(`<g>${hang2(jFlat, 150, 500)}</g>`);
    const jWor = [-150, -120, -92, 110].map((dx, i) => ({ p: S.puppet(flatL.add(wor(i + 4))), dx, i }));
    const tagG = W.farL.add(`<g>${nameTag(c, tr('góra Garizim', 'Mount Gerizim'), { size: 16 })}</g>`);
    const tagJ = flatL.add(`<g>${nameTag(c, tr('Jerozolima', 'Jerusalem'), { size: 16 })}</g>`);

    /* ---------- the hour, the light, the mist, the scroll and the star ---------- */
    const fx = S.layer({ par: 0.55, sh: 5 });
    const prophet = hanging(fx, nameTag(c, tr('prorok', 'a prophet'), { size: 22 }), { x: G.jx, y: 330, len: 500 });
    const hg = hanging(fx, hourglassJ(c, 100), { x: 850, y: 300, len: 500 });
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB'), sandS = hg.querySelector('.sandS');
    const light = W.behind.add(`<g>${glory(c, 520, 26)}</g>`);
    const mist = fx.add(`<g>${[[-40, 0, 46, 26], [10, -12, 54, 30], [50, 4, 40, 24], [0, 14, 60, 20]].map(([x, y, a, b]) => `<path d="${c.cut(c.blob(x, y, a, b, 12, 0.18), 0.8, 6)}" fill="${mix(C.stone, C.lavender, 0.35)}" opacity=".85"/>`).join('')}<text x="4" y="10" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" font-style="italic" fill="${shade(C.lavender, -0.35)}">?</text></g>`);
    const scroll = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-70, -34, 140, 68), 0.5, 6), C.parchment);
      let ln = '';
      for (let i = 0; i < 5; i++) ln += c.ribbon([[-56, -20 + i * 11], [56 - (i % 2) * 14, -20 + i * 11]], 1.6);
      s.x(ln, C.inkSoft, 'opacity=".5"');
      s.p(c.cut(c.ell(-74, 0, 7, 40, 12), 0.3, 4) + c.cut(c.ell(74, 0, 7, 40, 12), 0.3, 4), C.wood2);
      return `<circle r="110" fill="url(#halo-glow)"/>${s.out()}`;
    })();
    const scrollEl = hanging(fx, scroll, { x: G.jx - 10, y: 360, len: 500 });
    const star = fx.add(`<g><circle r="46" fill="url(#halo-glow)"/><circle r="60" fill="url(#warm-glow)"/><path d="${c.cut(c.star(0, 0, 32, 13, 5, -PI / 2), 0.3, 3)}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 8, 10))}" fill="${C.star}"/></g>`);

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 830, sunY: 140, glow: 0.8 });
      const bothUp = es(t, 4.05, 4.5, ease.in);
      /* v19 — "a prophet" */
      const pk = es(t, 0.15, 0.5, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      swing(prophet, G.jx, 330 - (1 - pk) * 600, pk > 0.001 ? T : 0, 1.2, 0.8, 1);
      fade(prophet, pk > 0.001 ? 1 : 0);
      /* v20 — the two hills */
      const gk = es(t, 1.0, 1.4, ease.out) * (1 - bothUp);
      const jk = es(t, 2.0, 2.4, ease.out) * (1 - bothUp);
      const gy = GZ.y, jy = JR.y - (1 - jk) * 700;
      vis(gEl, { x: GZ.x + 4, y: GZ.y - 8, s: 0.6 + gk * 0.4 + Math.sin(T * 5) * 0.03 * gk, o: gk });
      vis(jEl, { x: JR.x, y: jy, o: jk > 0.01 ? 1 : 0 });
      const pray = (i) => 0.5 + 0.5 * Math.sin(T * 1.2 + i);
      gWor.forEach((w) => w.p.set({ x: GZ.x + w.dx, y: GZ.y + 2, s: 0.13, flip: w.dx > 0, o: gk * es(t, 1.3, 1.5), armB: 150, armF: 70 + pray(w.i) * 20 * es(t, 1.4, 1.6) }));
      jWor.forEach((w) => w.p.set({ x: JR.x + w.dx * 0.8, y: jy - 8, s: 0.12, flip: w.dx > 0, o: jk > 0.01 ? es(t, 2.3, 2.5) : 0, armB: 150, armF: 70 + pray(w.i) * 20 * es(t, 2.4, 2.6) }));
      vis(tagG, { x: PH ? GZ.x : GZ.x + 170, y: PH ? GZ.y - 96 : GZ.y - 30, r: -5, o: gk * es(t, 1.3, 1.45) });
      vis(tagJ, { x: PH ? JR.x + 60 : JR.x + 140, y: PH ? jy - 124 : jy - 110, r: 5, o: jk > 0.01 ? es(t, 2.3, 2.45) : 0 });
      /* v21a — the hour is coming */
      const hk = es(t, 3.0, 3.35, ease.out) * (1 - es(t, 5.0, 5.35, ease.in));
      swing(hg, HG.x, HG.y - (1 - hk) * (PH ? 900 : 600), T * hk, 1, 0.7);
      fade(hg, hk > 0.001 ? 1 : 0);
      const sand = seg(t, 3.2, 5.0);
      pose(sandT, { sy: 1 - sand * 0.8, oy: 0, y: 0 });
      pose(sandB, { y: 50, sy: 0.2 + sand * 0.8 });
      fade(sandS, sand > 0 && sand < 1 ? 1 : 0);
      /* v21b — neither here nor there: light over all */
      const lk = es(t, 4.2, 4.6) * (1 - es(t, 5.0, 5.3) * 0.6);
      vis(light, { x: 850, y: 120, s: 0.8 + lk * 0.4, r: T * 2, o: lk * 0.8 });
      /* v22 — mist over her, the scroll over Him; the star from the scroll to Him */
      const mk = es(t, 5.1, 5.4) * (1 - es(t, 6.2, 6.5));
      const [whx, why] = K.wHead();
      vis(mist, { x: whx + 10 + Math.sin(T * 0.6) * 6, y: why - 110, s: 0.6 + mk * 0.4, o: mk * 0.9 });
      const sk = es(t, 5.3, 5.6, ease.out) * (1 - es(t, 6.6, 6.9));
      swing(scrollEl, G.jx - 10, 360 - (1 - sk) * 600, T * sk, 1, 0.7, 2);
      fade(scrollEl, sk > 0.001 ? 1 : 0);
      const rise = es(t, 6.05, 6.6);
      const [jhx, jhy] = K.head();
      const stx = lerp(G.jx - 10, jhx, rise), sty = lerp(390, jhy - 70, rise) - Math.sin(rise * PI) * 90;
      vis(star, { x: stx, y: sty + Math.sin(T * 2) * 3 * rise, s: es(t, 6.05, 6.25, ease.back) * (1 + Math.sin(T * 3) * 0.05), r: T * 10, o: t > 6.05 ? 1 : 0 });

      const her = es(t, 0.05, 0.3);
      K.set({
        T, jF: 22 + es(t, 3.05, 3.3) * 40 * (1 - es(t, 4.9, 5.1)) + bump(t, 4.1, 4.9) * 60 + es(t, 5.1, 5.4) * 30 * (1 - es(t, 5.9, 6.05)), jB: 12 + bump(t, 4.1, 4.9) * 60 + es(t, 6.2, 6.5) * 20,
        jH: -4 * es(t, 3.05, 3.3) - rise * 6,
        wF: 26 + her * 30 * (1 - es(t, 0.9, 1.0)) + bump(t, 1.05, 1.95) * 70 + bump(t, 2.05, 2.95) * 30, wB: 16 + bump(t, 1.05, 1.95) * 20 + bump(t, 2.05, 2.95) * 90, wH: -6 * her + bump(t, 2.05, 2.95) * -10 - lk * 8,
        wFlip: !(t > 2.1 && t < 2.9),
      });

      S.cam.x = kf(t, [[-0.5, 10], [0.5, 0], [1.1, -40], [1.9, -40], [2.3, 60], [2.9, 60], [3.3, 20], [5.1, 20]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 40], [1.1, -50], [2.9, -50], [3.3, -20], [4.5, -40], [5.2, 10], [6.2, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [0.5, 1.2], [1.1, 1.08], [2.9, 1.08], [3.3, 1.06], [4.5, 1.02], [5.2, 1.14], [6.2, 1.12]]);
    };
  },
};
