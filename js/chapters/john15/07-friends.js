// J 15,12–14 — A new part: the vine is gone from the stage; the eleven stand round Jesus on the terrace. "This is My
// commandment": a paper tablet with a heart on it hangs down. "That you love one another as I have loved you": they
// turn to each other in pairs, hearts pass between them, and threads of light join them all to Him. "Greater love has
// no one than this": a great heart-light glows between His hands. "That someone lay down his life for his friends":
// He gives it away — it parts into eleven small lights that go into their hands; far off, on the hill beyond the
// city, a faint cross of light appears for a moment. "You are My friends": they draw close, and a strip hangs down.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, heartLight, threads, hungWord, hungGold, headOf, sparkle,
  vis, kf, pose, lerp, blinkAt, tr, mix, shade, sheet, C, P, PI, WARMNIGHT,
} from './lib.js';

// who turns to whom in v12b: [a, b] — b turns round to face a
const PAIRS = [['andrew', 'peter'], ['philip', 'nathanael'], ['thomas', 'matthew'], ['jamesA', 'thaddaeus']];

export default {
  id: 'j15-friends',
  beats: [
    { v: 12, text: 'To jest moje przykazanie,' },
    { v: 12, cont: true, text: 'abyście się wzajemnie miłowali, tak jak Ja was umiłowałem.' },
    { v: 13, text: 'Nikt nie ma większej miłości od tej,' },
    { v: 13, cont: true, text: 'gdy ktoś życie swoje oddaje za przyjaciół swoich.' },
    { v: 14 },
  ],
  cam: { x: [-40, 40], y: [-100, 60], z: [0.96, 1.3] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { skyCols: WARMNIGHT, vine: false, before: (S2, set) => {
      // a faint cross of light on the far hill beyond the city (restrained, only for a moment)
      const L = S.layer({ par: 0.09, sh: 0, flat: true });
      return { cross: L.add(`<g><circle r="60" fill="url(#halo-glow)" opacity=".8"/><path d="${c.cut(c.rect(-3, -46, 6, 62), 0.3, 6) + c.cut(c.rect(-18, -32, 36, 5), 0.3, 6)}" fill="${C.halo}"/></g>`) };
    } });
    const { ms, jesus, JX, JY } = tb;
    const byK = Object.fromEntries(ms.map((m) => [m.k, m]));
    const fx = S.layer({ par: P, sh: 4 });
    const thL = S.layer({ par: P, sh: 0, flat: true });
    const th = threads(thL, ms.length + PAIRS.length, { color: C.halo, w: 1.6 });
    const pairHearts = PAIRS.map(() => fx.add(`<g>${heartLight(c, 11)}</g>`));
    const big = fx.add(`<g>${heartLight(c, 30, C.jesusMantle)}<circle r="90" fill="url(#halo-glow)" opacity=".7"/></g>`);
    const lights = ms.map(() => fx.add(`<g><circle r="16" fill="url(#warm-glow)"/>${heartLight(c, 6, C.jesusMantle)}</g>`));
    const glows = ms.map(() => fx.add(`<g><circle r="40" fill="url(#warm-glow)" opacity=".7"/></g>`));
    const hangL = S.layer({ par: 0.12, sh: 5 });
    const tablet = hangL.add(`<g>${(() => {
      const s = sheet();
      s.p(c.cut([[-70, -60], [-50, -84], [0, -92], [50, -84], [70, -60], [70, 70], [-70, 70]], 0.6, 8), C.parchment);
      s.p(c.cut([[-60, -52], [-44, -74], [0, -82], [44, -74], [60, -52], [60, 60], [-60, 60]], 0.4, 8), shade(C.parchment, 0.2));
      return `<path d="M-40 -1600V-86M40 -1600V-86" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<g transform="translate(0 -4)">${heartLight(c, 30, C.jesusMantle)}</g>`;
    })()}</g>`);
    const word = hangL.add(`<g>${hungWord(c, tr('Wy jesteście przyjaciółmi moimi', 'You are my friends'), { size: 26 })}</g>`);
    // a garland of eleven little heart-lights strung across the terrace (v14)
    const GP = c.qbez([380, 258], [800, 360], [1220, 258], 22);
    const garland = hangL.add(`<g><path d="M380 -1600V258M1220 -1600V258" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><path d="${c.line(GP)}" stroke="${C.rope}" stroke-width="1.6" fill="none"/></g>`);
    const gHearts = ms.map((m, i) => { const p = GP[Math.round(((i + 1) / 12) * (GP.length - 1))]; return { el: hangL.add(`<g><path d="M0 -10V2" stroke="${C.rope}" stroke-width="1"/><g transform="translate(0 12)">${heartLight(c, 8, i % 2 ? C.jesusMantle : C.roseRobe)}</g></g>`), x: p[0], y: p[1] + 2, i }; });
    tb.set.front();

    const chest = (m, x = m.x, flip = m.flip) => [x + (flip ? -6 : 6) * m.s, m.y - 104 * m.s];
    return (t, time) => {
      const T = time;
      tb.set.update(T);
      /* v12a — the tablet with a heart */
      const tk = es(t, 0.05, 0.35, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(tablet, { x: 800, y: 250 - (1 - tk) * 700 + (T ? Math.sin(T * 0.9) * 3 : 0), r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: tk > 0.001 ? 1 : 0 });
      /* v12b — turning to one another */
      const turn = es(t, 1.05, 1.15);
      const lk = 0;
      /* v13 — the great heart between His hands, then given away */
      const hb = es(t, 2.05, 2.35, ease.back);
      const give = seg(t, 3.1, 3.55);
      const draw = es(t, 4.05, 4.5);
      jesus.set({ x: JX, y: JY, s: 1.05, armF: bump(t, 0.05, 0.9) * 60 + bump(t, 1.1, 1.95) * 50 + hb * 60 * (1 - es(t, 3.1, 3.3)) + bump(t, 3.1, 3.6) * 40 + draw * 80,
        armB: hb * 50 * (1 - es(t, 3.1, 3.3)) + draw * 110, head: bump(t, 2.1, 2.9) * 8 - bump(t, 3.3, 3.95) * 10, blink: blinkAt(T, 1) });
      vis(big, { x: JX + 38, y: JY - 128 - bump(t, 3.1, 3.4) * 20, s: hb * (1 - es(t, 3.2, 3.45) * 0.8) + (T ? Math.sin(T * 2.2) * 0.03 * hb : 0), o: hb > 0.01 ? 1 - es(t, 3.35, 3.5) : 0 });
      ms.forEach((m, i) => {
        const pair = PAIRS.find((p) => p[1] === m.k);
        const flip = pair ? (turn > 0.5 ? !m.flip : m.flip) : m.flip;
        const partner = PAIRS.find((p) => p[0] === m.k || p[1] === m.k);
        const x = lerp(m.x, 800 + (m.x - 800) * 0.82, draw);
        const [cx, cy] = chest(m, x, flip);
        // His thread to each (v12b)
        th(i, JX + 6, JY - 110, cx, cy, lk * 0.7);
        // His love given: a small light goes into each one's hands (v13b)
        const u = es(t, 3.2 + i * 0.02, 3.55 + i * 0.02);
        const hx = x + (flip ? -30 : 30) * m.s, hy = m.y - 120 * m.s;
        vis(lights[i], { x: lerp(JX + 38, hx, u), y: lerp(JY - 128, hy, u) - Math.sin(u * PI) * 60, s: 0.7 + u * 0.4, o: u > 0 ? 1 - es(t, 4.4, 4.7) * 0.5 : 0 });
        vis(glows[i], { x: hx, y: hy, s: 0.6 + es(t, 3.5, 3.8) * 0.6, o: es(t, 3.5 + i * 0.02, 3.8) * (1 - es(t, 4.6, 5) * 0.4) });
        placeM(m, T, { x, flip, walk: draw > 0 && draw < 1 ? draw * 14 + i : undefined, head: -es(t, 0.1, 0.4) * 12 * (1 - turn) + (partner ? bump(t, 1.2, 1.95) * 6 : -bump(t, 1.2, 1.95) * 6),
          armF: (partner ? bump(t, 1.25, 1.95) * 70 : 0) + es(t, 3.35, 3.6) * 55 * (1 - es(t, 4.1, 4.3) * 0.4) + draw * 20 });
      });
      PAIRS.forEach(([a, b], j) => {
        const A = byK[a], B = byK[b];
        const mx = (A.x + B.x) / 2, my = Math.min(A.y - 150 * A.s, B.y - 150 * B.s) - 10;
        const k = es(t, 1.3 + j * 0.08, 1.55 + j * 0.08, ease.back) * (1 - es(t, 2.0, 2.2));
        vis(pairHearts[j], { x: mx, y: my - bump(t, 1.3, 2.1) * 12, s: k, o: k > 0.01 ? 1 : 0 });
        th(ms.length + j, A.x, A.y - 100 * A.s, B.x, B.y - 100 * B.s, lk * 0.6);
      });
      lampsAll(ms, 0.75 + es(t, 3.5, 3.8) * 0.25);
      /* the faint cross far away (v13b) */
      vis(tb.pre.cross, { x: 540, y: 410, s: 0.8, o: bump(t, 3.15, 4.0) * 0.55 });
      /* v14 — "You are My friends" */
      const wk = es(t, 4.1, 4.4, ease.out);
      vis(word, { x: 800, y: 170 - (1 - wk) * 600 + (T ? Math.sin(T * 0.8) * 3 : 0), o: wk > 0.001 ? 1 : 0 });
      const gk = es(t, 4.02, 4.3, ease.out);
      vis(garland, { x: 0, y: -(1 - gk) * 700, o: gk > 0.001 ? 1 : 0 });
      gHearts.forEach((g) => { const k = es(t, 4.25 + g.i * 0.03, 4.4 + g.i * 0.03, ease.back); vis(g.el, { x: g.x, y: g.y - (1 - gk) * 700, s: k, r: T ? Math.sin(T * 1.5 + g.i) * 6 : 0, o: k > 0.01 ? 1 : 0 }); });
      S.cam.x = kf(t, [[0, 0], [3, 0], [3.3, 20], [3.95, 20], [4.2, 0]]);
      S.cam.y = kf(t, [[0, -50], [1, -30], [2, 20], [3, 10], [3.5, -20], [4, -20], [5, -30]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.06], [2, 1.2], [3, 1.16], [3.4, 1.0], [4, 1.0], [5, 1.08]]);
    };
  },
};
