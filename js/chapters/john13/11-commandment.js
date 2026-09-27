// J 13,34–35 — a new commandment: a new plate comes down, cut in the shape of a heart, "love one another".
// A little heart lights at the breast of each of the eleven (Judas' place is empty). "As I have loved you" —
// threads of light run from His heart to each of theirs; "so you also love one another" — and then from each to
// his neighbour, until a chain of light goes round the table. "By this all will know that you are My disciples":
// the light spills out through the windows onto the city, where little figures on the roofs turn towards it.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, NIGHTFALL, EVE, JX, C, tr, sheet, mix, shade, heart, lightHeart, attr, glowDisc, kf, headAt, vis, pose, fade, lerp, blinkAt, PI, FONT,
} from './lib.js';

/** the heart-shaped plate of the new commandment (origin at the centre) */
function heartPlate(c, r = 92) {
  const pts = (k) => [...c.arc(-r * 0.5 * k, -r * 0.2 * k, r * 0.52 * k, r * 0.52 * k, PI * 0.8, PI * 2, 16), ...c.arc(r * 0.5 * k, -r * 0.2 * k, r * 0.52 * k, r * 0.52 * k, PI, PI * 2.2, 16), [0, r * 0.95 * k]];
  const s = sheet().p(c.cut(pts(1.08), 0.6, 6), C.haloRim).p(c.cut(pts(1), 0.5, 6), mix(C.cream, C.blushVeil, 0.35));
  const t = (y, str, size) => `<text x="0" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${str}</text>`;
  return `<path d="M${-r * 0.5} -1600V${-r * 0.55}M${r * 0.5} -1600V${-r * 0.55}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><circle r="${r * 1.5}" fill="url(#halo-glow)" opacity=".7"/>${s.out()}${t(-26, tr('przykazanie nowe', 'a new commandment'), 13)}${t(2, tr('Miłujcie się', 'Love'), 22)}${t(26, tr('wzajemnie', 'one another'), 22)}`;
}

export default {
  id: 'j13-commandment',
  beats: [
    { v: 34, text: 'Przykazanie nowe daję wam, abyście się wzajemnie miłowali' },
    { v: 34, cont: true, text: 'tak, jak Ja was umiłowałem; żebyście i wy tak się miłowali wzajemnie.' },
    { v: 35 },
  ],
  cam: { x: [-20, 20], y: [-60, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: ['#232957', '#3a3f70', '#5d5b86'] });
    const { R, at, by, SEAT } = T0;
    const J = by.jesus;
    const eleven = at.filter((m) => m.k !== 'jesus' && m.k !== 'judas').sort((a, b) => a.x - b.x);
    /* the city outside: little figures on the roofs, lit windows (between the roofs and the wall) */
    const cityL = S.layer({ par: 0.2, sh: 1 });
    let figs = '', lit = '';
    [[470, 590], [1010, 1130]].forEach(([x0, x1]) => {
      for (let i = 0; i < 4; i++) {
        const x = lerp(x0 + 14, x1 - 14, i / 3) + c.rr(-5, 5), y = 505 + c.rr(-8, 4), s = c.rr(0.9, 1.1);
        figs += c.cut([[x - 4 * s, y], [x - 3 * s, y - 11 * s], [x + 3 * s, y - 11 * s], [x + 4 * s, y]], 0.2, 3) + c.poly(c.circ(x, y - 14 * s, 2.8 * s, 7));
      }
      for (let i = 0; i < 6; i++) lit += c.poly(c.rect(c.rr(x0, x1 - 6), c.rr(475, 510), 4, 5));
    });
    const people = cityL.add(`<g><path d="${lit}" fill="${C.lampFlame}"/><path d="${figs}" fill="${mix(C.night, C.plumRobe, 0.3)}"/></g>`);
    const winGlow = T0.wallFx.add(`<g><ellipse cx="530" cy="440" rx="110" ry="130" fill="url(#halo-glow)"/><ellipse cx="1070" cy="440" rx="110" ry="130" fill="url(#halo-glow)"/></g>`);
    /* hearts and threads */
    const loveL = S.layer({ par: 0.5, sh: 2 });
    const arcs = (n, col, w) => {
      const g = loveL.add(`<g>${Array.from({ length: n }, () => `<path d="M0 0" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0"/>`).join('')}</g>`);
      const ps = Array.from(g.querySelectorAll('path'));
      return (i, x1, y1, x2, y2, lift, k, o) => {
        const p = ps[i];
        if (o <= 0.01 || k <= 0.001) { attr(p, 'opacity', 0); return; }
        const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - lift;
        let d = '';
        for (let j = 0; j <= 16; j++) {
          const u = (j / 16) * k, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), e = u * u;
          d += `${j ? 'L' : 'M'}${(a * x1 + b * cx + e * x2).toFixed(1)} ${(a * y1 + b * cy + e * y2).toFixed(1)}`;
        }
        attr(p, 'd', d); attr(p, 'opacity', o);
      };
    };
    const toJ = arcs(eleven.length, C.haloRim, 2.6);
    const chain = arcs(eleven.length, '#f3cf7a', 2.4);
    const hearts = eleven.map((m) => ({ m, el: loveL.add(`<g>${heart(c, 8, C.jesusMantle)}</g>`) }));
    const jHeart = loveL.add(`<g>${lightHeart(c, 13)}</g>`);
    const hangL = S.layer({ par: 0.5, sh: 4 });
    const plate = hangL.add(`<g>${heartPlate(c)}</g>`);
    const glow = T0.wallFx.add(`<g><ellipse cx="${JX}" cy="${SEAT - 100}" rx="560" ry="220" fill="url(#halo-glow)"/></g>`);

    const chest = (m) => { const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62); return [hx + (m.flip ? -3 : 3), hy + 44 * m.s]; };

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0);
      R.stars.fade(0.9);
      R.sky.blend(['#232957', '#3a3f70', '#5d5b86'], ['#1d2349', '#2b3262', '#4a4876'], es(t, 0, 3));

      /* b0 — the new commandment; hearts light */
      const pk = es(t, 0.05, 0.45, ease.out) * (1 - es(t, 1.9, 2.2, ease.in));
      vis(plate, { x: JX, y: 330 - (1 - pk) * 700, r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: pk > 0.01 ? 1 : 0 });
      hearts.forEach(({ m, el }, i) => {
        const k = es(t, 0.5 + i * 0.04, 0.7 + i * 0.04, ease.back);
        const [cx, cy] = chest(m);
        vis(el, { x: cx, y: cy, s: k * (1 + bump(t, 2.1, 2.9) * 0.3), o: k > 0.01 ? 1 : 0 });
      });
      /* b1 — from His heart to theirs; then one to another */
      const [jcx, jcy] = chest(J);
      const jk = es(t, 1.05, 1.3, ease.back);
      vis(jHeart, { x: jcx, y: jcy, s: jk, o: jk > 0.01 ? 1 : 0 });
      eleven.forEach((m, i) => {
        const d = Math.abs(m.x - JX) / 400;
        const k = es(t, 1.15 + d * 0.3, 1.4 + d * 0.3);
        const [cx, cy] = chest(m);
        toJ(i, jcx, jcy - 6, cx, cy, 60 + Math.abs(m.x - JX) * 0.22, k, 1 - es(t, 2.1, 2.5) * 0.5);
        const n = eleven[i + 1];
        if (n) {
          const kk = es(t, 1.55 + i * 0.03, 1.8 + i * 0.03);
          const [nx, ny] = chest(n);
          chain(i, cx, cy, nx, ny, Math.abs(nx - cx) > 120 ? 50 : 22, kk, kk);
        } else chain(i, 0, 0, 0, 0, 0, 0, 0);
      });
      /* b2 — all will know: the light goes out through the windows */
      const out = es(t, 2.1, 2.6);
      fade(glow, es(t, 1.5, 2.0) * 0.6 + out * 0.4);
      vis(winGlow, { o: out });
      vis(people, { o: 0.2 + out * 0.8 });
      at.forEach((m) => {
        if (m.k === 'judas') { m.p.set({ o: 0 }); return; }
        if (m.k === 'jesus') { T0.sit(m, T, { armF: 30 + bump(t, 0.1, 0.9) * 30 + bump(t, 1.1, 1.9) * 40, armB: 14 + bump(t, 1.1, 1.9) * 80 + bump(t, 2.1, 2.9) * 60, head: -4 }); return; }
        T0.sit(m, T, { head: -es(t, 0.1, 0.5) * 6 * (1 - es(t, 1.4, 1.7)) + es(t, 1.6, 2) * 3 * Math.sin(m.i), lean: es(t, 1.6, 2) * 3 });
      });

      S.cam.x = kf(t, [[0, 0], [3, 0]]);
      S.cam.y = kf(t, [[0, 40], [1.0, 130], [2.0, 120], [2.5, 60], [3, 60]]);
      S.cam.z = kf(t, [[0, 1.15], [1.0, 1.3], [2.0, 1.25], [2.5, 1.1], [3, 1.1]]);
    };
  },
};
