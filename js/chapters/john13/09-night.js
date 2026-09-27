// J 13,28–30 — no one at the table understood: they shrug, clouds of thought over their heads. Because Judas
// kept the money bag (it lies before him), some thought: "buy what we need for the feast" — a bubble of bread,
// grapes and a jar; or that he should give something to the poor — a bubble of a beggar and a coin.
// He took the morsel and went out at once: he rises with the bag, walks behind the others to the door in the side
// wall; the door opens onto pure black; his figure steps out, darkening, and is gone; the door shuts.
// And it was night: the room sinks into darkness — only the light around Jesus remains.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, NIGHTFALL, JX, TW, C, tr, person, shadowPerson, thought, GLYPH, moneybag, denar, loaf, cup, mini, poorOpts, jug, silhouette, darkPool, kf, headAt, vis, pose, fade, lerp,
  blinkAt, PI,
} from './lib.js';

const tall = () => typeof innerWidth !== 'undefined' && innerHeight > innerWidth * 1.05;

export default {
  id: 'j13-night',
  beats: [
    { v: 28 },
    { v: 29, text: 'Ponieważ Judasz miał pieczę nad trzosem, niektórzy sądzili, że Jezus powiedział do niego: «Zakup, czego nam potrzeba na święto»,' },
    { v: 29, cont: true, text: 'albo żeby dał coś ubogim.' },
    { v: 30, text: 'A on po spożyciu kawałka [chleba] zaraz wyszedł.' },
    { v: 30, cont: true, text: 'A była noc.' },
  ],
  // on a phone (portrait) the camera has to travel further right to show the door in the side wall
  get cam() { return { x: [-40, tall() ? 1000 : 460], y: [40, 220], z: [1, 1.6] }; },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTFALL, wing: true });
    const { R, at, by, SEAT, TOP, FLOOR, W } = T0;
    const J = by.jesus, JU = by.judas;
    /* Judas walking out (behind the others), then his dark figure in the doorway */
    const walker = S.puppet(T0.behindL.add(person(c, { ...TW.judas, holdB: `<g transform="rotate(-10)">${moneybag(c)}</g>` })));
    const outFig = S.puppet(W.outL.add(shadowPerson(c, TW.judas, '#2c2a46')));
    /* the money bag before him on the table */
    const fx = S.layer({ par: 0.56, sh: 3 });
    const bag = fx.add(`<g>${moneybag(c)}</g>`);
    /* thoughts */
    const feast = `<g transform="translate(-20 8)">${loaf(c, 11)}</g><g transform="translate(2 10) scale(.8)">${jug(c)}</g><g transform="translate(20 6)"><path d="${c.poly(c.circ(0, -6, 4, 8))}${c.poly(c.circ(-4, -1, 4, 8))}${c.poly(c.circ(4, -1, 4, 8))}${c.poly(c.circ(0, 4, 4, 8))}" fill="${C.plumRobe}"/></g>`;
    const bagIcon = `<g transform="translate(-30 -18) scale(.5)">${moneybag(c)}</g>`;
    const poorIcon = `<g transform="translate(-6 20)">${mini(c, poorOpts(0), { pose: 'kneel', sc: 0.22 })}</g><g transform="translate(16 -6)">${denar(c, 6)}</g>`;
    const th = [
      { k: 'philip', inner: `${bagIcon}${feast}`, a: 1.1, b: 2.05 },
      { k: 'thomas', inner: `${bagIcon}${feast}`, a: 1.25, b: 2.05 },
      { k: 'bartholomew', inner: poorIcon, a: 2.1, b: 2.95 },
      { k: 'andrew', inner: poorIcon, a: 2.25, b: 2.95 },
    ].map((o) => ({ ...o, m: by[o.k], el: fx.add(`<g>${thought(c, o.inner, { w: 86, h: 60 })}</g>`) }));
    const puzzled = ['james', 'peter', 'matthew', 'simonZ'].map((k) => ({ m: by[k], el: fx.add(`<g>${thought(c, `<g transform="scale(.9)">${GLYPH.q(c)}</g>`, { w: 50, h: 42 })}</g>`) }));
    /* the night */
    const nightL = S.layer({ par: 0.56, sh: 0, flat: true });
    nightL.add(darkPool(S, { cx: JX, cy: SEAT - 90, r0: 70, r1: 520, col: '#07081a', name: 'night' }));
    const night2 = S.layer({ par: 0.56, sh: 0, flat: true });
    night2.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0b0c22" opacity=".5"/>`);
    const halo = S.layer({ par: 0.5, sh: 0, flat: true });
    halo.add(`<circle cx="${JX}" cy="${SEAT - 100}" r="130" fill="url(#halo-glow)"/>`);

    return (t, time) => {
      const T = time;
      const nk = es(t, 4.02, 4.45);
      T0.idle(t, T, 0.25 + nk * 0.55);
      R.stars.fade(0.9 - nk * 0.6);
      R.sky.blend(NIGHTFALL, ['#07081a', '#0d0f26', '#14163a'], nk);
      nightL.fade(nk);
      night2.fade(nk);
      halo.fade(nk * 0.9);

      /* b0 — no one understood; b1–b2 — what some thought */
      const shrug = bump(t, 0.1, 0.95);
      at.forEach((m) => {
        if (m.k === 'jesus') { T0.sit(m, T, { head: 8 + nk * 4, armF: 30 }); fade(m.sad, 1); return; }
        if (m.k === 'judas') return;
        const watch = es(t, 3.1, 3.4) * (1 - es(t, 4.4, 4.8) * 0.5);
        T0.sit(m, T, { armF: 36 + shrug * 26, armB: 14 + shrug * 44, head: -shrug * 6 * Math.sin(m.i) - watch * 6, flip: watch > 0.5 && m.x < 1100 ? false : m.flip });
      });
      puzzled.forEach(({ m, el }, i) => {
        const k = es(t, 0.15 + i * 0.08, 0.35 + i * 0.08, ease.back) * (1 - es(t, 0.9, 1.05));
        const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62);
        vis(el, { x: hx, y: hy - 16, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
      });
      th.forEach((o) => {
        const k = es(t, o.a, o.a + 0.22, ease.back) * (1 - es(t, o.b, o.b + 0.12));
        const [hx, hy] = headAt(o.m.x, SEAT, o.m.s, o.m.flip, 62);
        vis(o.el, { x: hx, y: hy - 16, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const bagGlow = bump(t, 1.1, 2.0);
      /* b3 — he rises, takes the bag and goes out */
      const up = es(t, 3.05, 3.12);
      const walkK = seg(t, 3.12, 3.62);
      const DX = W.cx;
      const wx = lerp(JU.x, DX + 10, ease.io(walkK));
      const wy = lerp(SEAT - 8, FLOOR - 2, es(wx, 1150, 1290));
      const inDoor = es(t, 3.6, 3.66);
      JU.p.set({ x: JU.x, y: SEAT + (JU.i % 2) * 3, s: JU.s, flip: true, o: 1 - up, armF: 36, head: 14, blink: blinkAt(T, JU.seed) });
      fade(JU.sad, 0.6);
      vis(bag, { x: JU.x + 34, y: TOP - 30 - bagGlow * 4, s: 0.6 + bagGlow * 0.15, o: 1 - up });
      walker.set({ x: wx, y: wy, s: 0.9, flip: false, o: up * (1 - inDoor), walk: walkK > 0 && walkK < 1 ? wx * 0.05 : undefined, armF: 10, armB: 20, head: 6, blink: 0 });
      const away = seg(t, 3.6, 3.9);
      outFig.set({ x: DX + 10 + away * 20, y: FLOOR - 2 - away * 6, s: 0.9 - away * 0.12, flip: false, o: inDoor * (1 - es(t, 3.72, 3.9)), walk: away > 0 && away < 1 ? away * 8 : undefined, armF: 10, armB: 20 });
      W.set(es(t, 3.4, 3.55) * (1 - es(t, 3.85, 3.98)));

      S.cam.x = S.portrait
        ? kf(t, [[0, 0], [1.0, 0], [2.0, 60], [3.0, 60], [3.3, 420], [3.62, 1000], [4.0, 1000], [4.5, 120], [5, 100]])
        : kf(t, [[0, 0], [1.0, 0], [2.0, 60], [3.0, 60], [3.3, 200], [3.62, 420], [4.0, 420], [4.5, 300], [5, 290]]);
      S.cam.y = kf(t, [[0, 110], [1.0, 130], [2.0, 130], [3.0, 150], [3.62, 170], [4.0, 170], [4.5, 140]]);
      S.cam.z = kf(t, [[0, 1.2], [1.0, 1.25], [2.0, 1.25], [3.0, 1.3], [3.62, 1.55], [4.0, 1.55], [4.5, 1.25], [5, 1.22]]);
    };
  },
};
