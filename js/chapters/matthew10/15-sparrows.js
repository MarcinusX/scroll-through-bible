// Mt 10,29–31 — market day. Under a striped awning a bird-seller has cages of sparrows ("two for an assarion"): a
// woman drops a small coin into his palm and he hands her two sparrows. One slips out and falls — and a ray of
// light from above catches it; it floats down gently and hops away unhurt. Then the camera leans in on John: tiny
// numbers pop up all over his hair, every one of them counted. Last, the sparrows fly up in a crowd, and a balance
// comes down: a whole flock on one pan, one small paper man on the other — and he weighs more.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { awning } from '../mark6/lib.js';
import { cage } from '../mark11/lib.js';
import { village, DAY, sparrow, flapWings, coin, nameTag, balance, lightShaft, heart, headAt, hand, tr, PI, FONT } from './lib.js';

const GY = 704;
const JX = 800, NX = 900;          // Jesus, John
const SX0 = 520;                   // the seller's stall

export default {
  id: 'mt10-sparrows',
  beats: [
    { v: 29, text: 'Czyż nie sprzedają dwóch wróbli za asa?' },
    { v: 29, cont: true, text: 'A przecież żaden z nich bez woli Ojca waszego nie spadnie na ziemię.' },
    { v: 30 },
    { v: 31 },
  ],
  cam: { x: [-60, 220], y: [-80, 180], z: [1, 1.8] },
  build(S) {
    const V = village(S, { skyCols: DAY, sunAt: [1250, 140] });
    const c = S.c;
    // phone: the stall a little further in, and the balance hangs over the middle (the little man's pan was off)
    const PH = S.portrait, SX = PH ? 566 : SX0;

    /* the stall */
    const st = S.layer({ par: 0.45, sh: 4 });
    st.add(`<g transform="translate(${SX} ${GY - 10})">${awning(c, 240, 190, C.terracotta)}</g>`);
    const tb = sheet();
    tb.p(c.cut([[SX - 110, GY - 70], [SX + 110, GY - 70], [SX + 110, GY - 60], [SX - 110, GY - 60]], 0.3, 6), C.wood);
    tb.p(c.cut(c.rect(SX - 100, GY - 60, 8, 60), 0.2, 4) + c.cut(c.rect(SX + 92, GY - 60, 8, 60), 0.2, 4), C.wood2);
    st.add(tb.out() + `<g transform="translate(${SX - 60} ${GY - 70})">${cage(c, 70, 60)}</g><g transform="translate(${SX + 20} ${GY - 70})">${cage(c, 64, 54)}</g>`);
    const caged = [[SX - 70, GY - 84], [SX - 48, GY - 90], [SX + 12, GY - 84], [SX + 30, GY - 88]].map(([x, y]) => st.add(`<g transform="translate(${x} ${y}) scale(.7)">${sparrow(c)}</g>`));
    const price = st.add(`<g><path d="M0 0V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr(['2 wróble', 'za 1 asa'], ['2 sparrows', 'for 1 assarion']), { size: 15 })}</g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const seller = S.puppet(P.add(person(c, { robe: C.ochreRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather })));
    const buyer = S.puppet(P.add(person(c, { robe: C.tealRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.1), skin: C.skin2, beard: 'none' })));
    const jGlow = P.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const john = S.puppet(P.add(person(c, CAST.john)));

    /* the coin, the two sparrows, the fall and the light */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const coinEl = fx.add(`<g>${coin(c, 7)}</g>`);
    const two = [0, 1].map(() => fx.add(`<g>${sparrow(c)}</g>`));
    const beam = fx.add(`<g>${lightShaft(c, { w0: 18, w1: 60, h: 1200, o: 0.45 })}</g>`);
    // the counted hairs
    const NUMS = Array.from({ length: 12 }, (_, i) => {
      const a = PI * (0.95 + (i / 11) * 1.05), r = 30 + (i % 3) * 7;
      const n = [1, 2, 3, 7, 12, 40, 108, 356, 1024, 5210, 20417, 100000][i];
      return { i, a, r, el: fx.add(`<g><text x="0" y="0" text-anchor="middle" font-family="${FONT}" font-size="${11 + Math.min(5, i * 0.5)}" font-style="italic" fill="${C.inkSoft}">${n.toLocaleString('pl-PL')}</text></g>`) };
    });
    const warm = fx.add(`<g>${heart(c, 12)}</g>`);

    /* the flock and the balance */
    const fl = S.layer({ par: 0.3, sh: 4 });
    const FLOCK = Array.from({ length: 14 }, (_, i) => ({ i, el: fl.add(`<g>${sparrow(c)}</g>`), seed: c.rr(0, 9), x0: c.rr(420, 640), y0: c.rr(560, 640), x1: c.rr(300, 1300), y1: c.rr(120, 380) }));
    const B = balance(c, { arm: 150, drop: 100, pan: 100, col: C.ochre });
    const PIV = PH ? [880, 220] : [1060, 230];
    const flies = S.layer({ par: 0.25, sh: 6 });
    const frame = flies.add(`<g><path d="M0 -80V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${B.frame}</g>`);
    const beamB = flies.add(`<g>${B.beam}</g>`);
    let birds = '';
    [[-30, -6], [-10, -10], [10, -6], [30, -9], [-20, -20], [0, -22], [20, -18]].forEach(([x, y]) => { birds += `<g transform="translate(${x} ${100 + y}) scale(.55)">${sparrow(c)}</g>`; });
    const panL = flies.add(`<g>${B.panL}${birds}</g>`);
    const panR = flies.add(`<g>${B.panR}<g transform="translate(0 98) scale(.36)">${person(c, { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin })}</g></g>`);

    return (t, time) => {
      const T = time;
      V.update(t, T);
      pose(price, { x: SX + 70, y: GY - 200 + Math.sin(T) * 2, r: Math.sin(T * 0.9) * 2, o: 1 - es(t, 2.0, 2.2) });

      /* v29a — two sparrows for an assarion */
      const pay = es(t, 0.15, 0.4), hand2 = es(t, 0.45, 0.7);
      seller.set({ x: SX - 20, y: GY - 4, s: 0.9, flip: false, armF: 30 + pay * 40 + hand2 * 30, armB: 10, blink: blinkAt(T, 3) });
      const BX = SX + 140;
      buyer.set({ x: BX, y: GY + 4, s: 0.88, flip: true, armF: 20 + bump(t, 0.1, 0.5) * 70 + hand2 * 50, blink: blinkAt(T, 4) });
      const [bhx, bhy] = hand(BX, GY + 4, 0.88, true, 20 + 70 + 50);
      const [shx, shy] = hand(SX - 20, GY - 4, 0.9, false, 30 + pay * 40);
      pose(coinEl, { x: lerp(bhx, shx, pay), y: lerp(bhy, shy, pay) - Math.sin(pay * PI) * 40, o: pay < 1 && t > 0.12 ? 1 : 0 });
      // one stays in her hand, one slips and falls into the light (v29b)
      const fall = es(t, 1.1, 1.75, (x) => x);
      two.forEach((el, i) => {
        const hx = lerp(shx + 20, bhx - 6, hand2), hy = lerp(shy - 12, bhy - 14, hand2);
        if (i === 0 || t < 1.1) { pose(el, { x: hx + i * 16, y: hy - i * 4, s: 0.8, sx: -1, o: hand2 > 0.02 ? 1 - es(t, 2.0, 2.15) : 0 }); if (t > 0.45 && t < 1.1) flapWings(el, 0, 4, 1); return; }
        const x = lerp(hx + 16, hx + 110, fall), y = lerp(hy - 4, GY - 4, ease.io(fall)) + Math.sin(fall * PI * 3) * 6 * (1 - fall);
        pose(el, { x, y, s: 1.15, r: Math.sin(fall * PI * 4) * 12 * (1 - fall), o: 1 - es(t, 2.0, 2.15) });
        flapWings(el, fall < 1 ? T * 0.8 + t * 30 : 0, fall < 1 ? 22 : 4, 6);
      });
      pose(beam, { x: bhx + 90, y: GY, o: bump(t, 1.05, 2.0) * 0.9 });

      /* v30 — every hair counted */
      const zoom = es(t, 2.0, 2.3) * (1 - es(t, 2.95, 3.2));
      const [jhx, jhy] = headAt(NX, GY + 6, 0.92, true);
      NUMS.forEach((n) => {
        const k = es(t, 2.2 + n.i * 0.04, 2.3 + n.i * 0.04, ease.back);
        pose(n.el, { x: jhx + Math.cos(n.a) * n.r * 0.92, y: jhy + Math.sin(n.a) * n.r * 0.92 - 4, s: k * 0.9, o: k > 0.01 ? 1 - es(t, 2.95, 3.05) : 0 });
      });
      john.set({ x: NX, y: GY + 6, s: 0.92, flip: true, armF: 20 + bump(t, 2.2, 2.9) * 30, head: -bump(t, 2.2, 2.9) * 6, blink: blinkAt(T, 2) });
      const hk = es(t, 2.6, 2.75, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(warm, { x: jhx - 40, y: jhy - 50, s: hk, o: hk > 0.01 ? 1 : 0 });
      jesus.set({ x: JX, y: GY + 8, s: 1.04, flip: t < 1.9, armF: 20 + bump(t, 0.05, 0.9) * 50 + bump(t, 1.1, 1.9) * 40 + zoom * 40, armB: 10 + bump(t, 3.1, 3.9) * 120, head: -2, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: GY - 170, o: 0.5 });

      /* v31 — worth more than many sparrows */
      FLOCK.forEach((f) => {
        const k = es(t, 3.0 + f.i * 0.02, 3.5 + f.i * 0.02);
        const x = lerp(f.x0, f.x1, k), y = lerp(f.y0, f.y1, k) - Math.sin(k * PI) * 60;
        pose(f.el, { x, y, s: 0.7, sx: f.x1 < f.x0 ? -1 : 1, o: k > 0.01 && k < 0.999 ? 1 : k >= 0.999 ? 1 : 0 });
        if (k > 0.01) flapWings(f.el, T * 1.2 + f.seed + t * 20, 26, 8);
      });
      const dk = es(t, 3.15, 3.45, ease.back);
      const py = lerp(-500, PIV[1], dk);
      const tilt = es(t, 3.45, 3.75, ease.back) * 14 + Math.sin(T * 1.2) * 0.6 * dk;
      pose(frame, { x: PIV[0], y: py, o: dk > 0.002 ? 1 : 0 });
      pose(beamB, { x: PIV[0], y: py, r: tilt, o: dk > 0.002 ? 1 : 0 });
      const a = (tilt * PI) / 180;
      pose(panL, { x: PIV[0] - Math.cos(a) * 150, y: py - Math.sin(a) * 150, o: dk > 0.002 ? 1 : 0 });
      pose(panR, { x: PIV[0] + Math.cos(a) * 150, y: py + Math.sin(a) * 150, o: dk > 0.002 ? 1 : 0 });

      S.cam.x = lerp(0, (jhx - 800) / 0.5, zoom) + es(t, 3.0, 3.4) * 20;
      S.cam.y = lerp(0, (jhy + 10 - 470) / 0.5, zoom) - es(t, 3.0, 3.4) * 60;
      S.cam.z = 1.04 + zoom * 0.76;
    };
  },
};
