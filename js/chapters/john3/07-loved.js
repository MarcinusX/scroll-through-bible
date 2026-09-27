// J 3,16–17 — The heart of the chapter. A paper globe hangs in the night of the universe. "For God so loved
// the world": from the light above (never a figure) two ribbons of gold come down and draw a heart around
// the world. "That He gave His only Son": Jesus comes down the beam and stands on the globe. "That whoever
// believes in Him should not perish but have eternal life": little hearts kindle all over the world, spreading
// out from Him, and rise into a ring of stars around it. "Not to condemn the world": a dark storm cloud swings
// in — He lifts His hand and it withdraws, its lightning never falls. "But that the world might be saved
// through Him": He opens His arms, a ring of light encircles the globe and the dawn comes up.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix, sky, attr } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { stormCloud, lightning } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { glory, heart, beamGrad, lightBeam, spark, word, tr, PI , hangAt, vpose } from './lib.js';

const GX = 800, GY = 490, GR = 150;
const HK = 13.5;   // heart scale

function heartPts(side, k = HK, n = 40) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * PI * side;   // 0 → ±π : from the top dip down to the bottom point
    pts.push([16 * Math.pow(Math.sin(a), 3) * k, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * k]);
  }
  return pts;
}

export default {
  id: 'j3-loved',
  beats: [
    { v: 16, text: 'Tak bowiem Bóg umiłował świat,' },
    { v: 16, cont: true, text: 'że Syna swego Jednorodzonego dał,' },
    { v: 16, cont: true, text: 'aby każdy, kto w Niego wierzy, nie zginął, ale miał życie wieczne.' },
    { v: 17, text: 'Albowiem Bóg nie posłał swego Syna na świat po to, aby świat potępił,' },
    { v: 17, cont: true, text: 'ale po to, by świat został przez Niego zbawiony.' },
  ],
  cam: { x: [-40, 40], y: [-80, 40], z: [0.95, 1.25] },
  build(S) {
    const c = S.c;
    const NIGHT = ['#141735', '#232a57', '#3a3f72'];
    const DAWN = ['#6f79b0', '#e8b79c', '#f6dcbc'];
    const sk = sky(S, NIGHT);
    const st = S.layer({ par: 0.02, sh: 0, flat: true });
    st.add(`<g>${stars(c, { x0: -900, x1: 2500, y0: -800, y1: 1100, n: 260 })}</g>`);
    // twinkling bigger stars on strings
    const H = S.layer({ par: 0.05, sh: 3 });
    const tw = Array.from({ length: 7 }, (_, i) => {
      const x = [300, 470, 1130, 1290, 380, 1210, 620][i], y = [170, 90, 110, 230, 330, 380, 200][i];
      return { el: hanging(H, `<path d="${c.cut(c.star(0, 0, 9, 3.6, 5), 0.2, 3)}" fill="${C.star}"/>`, { x, y, len: 900 }), x, y, i };
    });

    /* ---------- the light above ---------- */
    const Lt = S.layer({ par: 0.1, sh: 0, flat: true });
    const above = Lt.add(`<g>${glory(c, 360, 26)}<circle r="90" fill="url(#halo-glow)"/></g>`);
    const bid = beamGrad(S, 'beam');
    const beam = Lt.add(`<g>${lightBeam(bid, 60, 150, 400)}</g>`);

    /* ---------- the world ---------- */
    const W = S.layer({ par: 0.3, sh: 6 });
    const ringBack = W.add(`<g><path d="${c.ribbon(c.arc(0, 0, GR + 40, 44, PI, 2 * PI, 40), 7)}" fill="${C.halo}" opacity=".8"/></g>`);
    W.add(`<g transform="translate(${GX} ${GY})">${sheet().p(c.cut(c.circ(0, 0, GR + 6, 60), 0.5, 6), C.haloRim).p(c.cut(c.circ(0, 0, GR, 60), 0.4, 6), mix(C.lake2, C.indigo, 0.35)).out()}</g>`);
    const clipId = S.id('globe');
    S.defs(`<clipPath id="${clipId}"><circle cx="${GX}" cy="${GY}" r="${GR - 1}"/></clipPath>`);
    // continents on a strip that slides under the round window (the world turning)
    const land = sheet();
    const cont = [[-120, -60, 60, 44], [-20, 30, 52, 70], [90, -40, 70, 50], [160, 60, 44, 36], [260, -10, 60, 80], [-230, 50, 50, 60], [340, 90, 40, 30], [30, -110, 44, 22], [220, -100, 50, 24], [-300, -70, 40, 40]];
    let dL = '', dL2 = '';
    [0, 700].forEach((off) => cont.forEach(([x, y, rx, ry], i) => {
      const d = c.cut(c.blob(x + off, y, rx, ry, 12, 0.3), 1, 6);
      if (i % 3) dL += d; else dL2 += d;
    }));
    land.p(dL, mix(C.sage, C.indigo, 0.2)).p(dL2, mix(C.olive, C.indigo, 0.15));
    let towns = '';
    [0, 700].forEach((off) => cont.forEach(([x, y]) => { towns += c.poly(c.rect(x + off - 4, y - 3, 7, 6)); }));
    land.x(towns, mix(C.plaster2, C.indigo, 0.25));
    const landWrap = W.add(`<g clip-path="url(#${clipId})"><g data-k="land">${land.out()}</g></g>`);
    const landEl = S.$('land');
    // night side shading and the shine
    W.add(`<g clip-path="url(#${clipId})"><path d="${c.poly([...c.arc(GX, GY, GR, GR, -PI / 2, PI / 2, 24), ...c.arc(GX + 40, GY, GR * 0.9, GR, PI / 2, -PI / 2, 24)])}" fill="#0e1030" opacity=".32"/><ellipse cx="${GX - 60}" cy="${GY - 70}" rx="46" ry="22" fill="#fff" opacity=".18" transform="rotate(-30 ${GX - 60} ${GY - 70})"/></g>`);
    const dawnWash = W.add(`<g clip-path="url(#${clipId})"><circle cx="${GX}" cy="${GY}" r="${GR}" fill="#ffe7b0"/></g>`);
    const spots = [];
    for (let i = 0; i < 22; i++) {
      const a = c.rr(0, PI * 2), r = Math.sqrt(c.rr(0.05, 0.85)) * GR;
      spots.push({ x: GX + Math.cos(a) * r, y: GY + Math.sin(a) * r * 0.92, d: Math.hypot(Math.cos(a) * r, Math.sin(a) * r + GR) });
    }
    spots.sort((a, b) => a.d - b.d);
    const hearts = spots.map((sp, i) => ({ ...sp, i, el: W.add(`<g>${heart(c, 7, C.jesusMantle)}</g>`) }));
    // the heart of love drawn around the world
    const hL = W.add(`<g><path d="${c.line(heartPts(-1))}" fill="none" stroke="${C.sun}" stroke-width="9" stroke-linecap="round"/></g>`);
    const hR = W.add(`<g><path d="${c.line(heartPts(1))}" fill="none" stroke="${C.sun}" stroke-width="9" stroke-linecap="round"/></g>`);
    const pathL = hL.firstElementChild, pathR = hR.firstElementChild;
    const HP = heartPts(1);
    const HLEN = HP.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - HP[i][0], p[1] - HP[i][1]), 0) + 4;
    [pathL, pathR].forEach((p) => { attr(p, 'stroke-dasharray', `${HLEN.toFixed(0)} ${HLEN.toFixed(0)}`); });
    const heartGlow = W.add(`<g><circle r="330" fill="url(#halo-glow)"/></g>`);
    const ringFront = W.add(`<g><path d="${c.ribbon(c.arc(0, 0, GR + 40, 44, 0, PI, 40), 7)}" fill="${C.halo}"/></g>`);
    // eternal life: little stars rising into a ring around the world
    const risers = Array.from({ length: 14 }, (_, i) => ({ i, a: (i / 14) * PI * 2, el: W.add(`<g>${spark(c, 7)}</g>`) }));

    /* ---------- the Son; the cloud of judgement that does not strike ---------- */
    const P = S.layer({ par: 0.3, sh: 6 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const cloudEl = hanging(P, `<g>${stormCloud(c, 300)}<g class="bolt" transform="translate(-10 20) scale(.5)">${lightning(c, 300)}</g></g>`, { x: 1300, y: 230, len: 800 });
    const bolt = cloudEl.querySelector('.bolt');
    const T1 = S.layer({ par: 0.3, sh: 5 });
    const tagSon = hanging(T1, word(c, tr('Syn Jednorodzony', 'the one and only Son'), { size: 18 }), { x: 1060, y: 270, len: 700 });
    const tagLove = hanging(T1, word(c, tr('umiłował', 'so loved'), { size: 20 }), { x: 560, y: 250, len: 700 });

    return (t, time) => {
      const T = time;
      const dawn = es(t, 4.05, 4.8);
      sk.blend(NIGHT, DAWN, dawn * 0.85);
      tw.forEach((s) => vpose(s.el, { x: s.x, y: s.y, r: (s.i % 3 - 1) * 2, o: (0.7 + 0.3 * (s.i % 2)) * (1 - dawn * 0.7) }));

      /* v16a — the light above loves the world: the heart is drawn */
      const lov = es(t, 0.05, 0.4);
      vpose(above, { x: GX, y: -30, s: 0.5 + lov * 0.3 + dawn * 0.2, r: lov * 8 + dawn * 8, o: 0.3 + lov * 0.45 });
      const draw = es(t, 0.25, 0.85, ease.sine);
      attr(pathL, 'stroke-dashoffset', (HLEN * (1 - draw)).toFixed(1));
      attr(pathR, 'stroke-dashoffset', (HLEN * (1 - draw)).toFixed(1));
      const hb = 1;
      vpose(hL, { x: GX, y: GY - 34, s: hb, o: seg(t, 0.2, 0.25) });
      vpose(hR, { x: GX, y: GY - 34, s: hb, o: seg(t, 0.2, 0.25) });
      vpose(heartGlow, { x: GX, y: GY, s: 0.6 + draw * 0.4, o: draw * 0.55 });
      const lk = es(t, 0.45, 0.75, ease.out);
      hangAt(tagLove, 520, lerp(-300, 230, lk) - es(t, 1.9, 2.1) * 700, T, lk > 0 && t < 2.1 ? 1 : 0, 1.2, 0.8, 1);

      vpose(landEl, { x: GX - 250 - ((t * 60) % 700), y: GY });

      /* v16b — He gave His only Son: Jesus comes down the beam onto the world */
      const bm = es(t, 1.0, 1.25) * (1 - es(t, 2.0, 2.4));
      vpose(beam, { x: GX, y: 20, sx: 0.5 + bm * 0.5, o: bm });
      const come = es(t, 1.1, 1.7, ease.out);
      const open = es(t, 4.05, 4.35);
      const stop = es(t, 3.4, 3.55) * (1 - es(t, 3.95, 4.1));
      jesus.set({ x: GX, y: lerp(60, GY - GR + 4, come), s: 0.8, o: seg(t, 1.05, 1.15), armF: 20 + come * 10 + bump(t, 2.05, 2.8) * 50 + stop * 70 + open * 70, armB: 10 + bump(t, 2.05, 2.8) * 60 + stop * 20 + open * 110, head: -come * 2 + bump(t, 2.1, 2.8) * 8, blink: blinkAt(T, 2) });
      const sk2 = es(t, 1.5, 1.8, ease.out);
      hangAt(tagSon, 1060, lerp(-300, 260, sk2) - es(t, 2.9, 3.1) * 700, T, sk2 > 0 && t < 3.1 ? 1 : 0, 1.2, 0.8, 2);

      /* v16c — whoever believes: hearts light up over the world, then rise as a ring of stars */
      hearts.forEach((h) => {
        const k = es(t, 2.05 + h.i * 0.028, 2.25 + h.i * 0.028, ease.back);
        vpose(h.el, { x: h.x, y: h.y, s: k, o: seg(t, 2.05 + h.i * 0.028, 2.1 + h.i * 0.028) });
      });
      risers.forEach((r) => {
        const k = es(t, 2.55 + r.i * 0.02, 2.95 + r.i * 0.02);
        const a = r.a + k * 0.6;
        const x = GX + Math.cos(a) * (GR + 70) * k, y = GY + Math.sin(a) * (GR + 70) * k * 0.95;
        vpose(r.el, { x, y, s: 0.5 + k * 0.6 + 0 * T, o: k > 0 ? Math.min(1, k * 3) : 0 });
      });

      /* v17a — not to condemn: the storm cloud comes, and is sent back without striking */
      const cin = es(t, 3.05, 3.45), cout = es(t, 3.6, 4.0, ease.in);
      const cx = lerp(1350, 1060, cin) + cout * 500;
      hangAt(cloudEl, cx, 220 - cout * 60, T, cin > 0 && cout < 1 ? 1 - cout * 0.5 : 0, 1.5, 1.2, 3);
      fade(bolt, bump(t, 3.3, 3.6) * 0.5);

      /* v17b — saved through Him: the ring of light and the dawn */
      const ring = es(t, 4.15, 4.55, ease.back);
      vpose(ringBack, { x: GX, y: GY + 20, s: ring, r: -8, o: seg(t, 4.15, 4.2) });
      vpose(ringFront, { x: GX, y: GY + 20, s: ring, r: -8, o: seg(t, 4.15, 4.2) });
      fade(dawnWash, dawn * 0.28);

      S.cam.x = 0;
      S.cam.y = -30 + es(t, 1.8, 2.2) * 30;
      S.cam.z = 1.0 + es(t, 1.8, 2.3) * 0.12 - es(t, 4.0, 4.6) * 0.06;
    };
  },
};
