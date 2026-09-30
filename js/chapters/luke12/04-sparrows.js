// Łk 12,6–7 — a painted market street. Under a striped awning the bird-seller has sparrows on a perch and a price tag:
// five for two assaria. A poor woman counts two small coins into his palm; he hands her a perch with four sparrows —
// and with a shrug hops a fifth onto it, thrown in for nothing. "Not one of them is forgotten before God": a shaft of
// light comes down on her five, and a little gold ring lights over each head, the fifth one's last and brightest.
// "Even the hairs of your head are all counted": we lean in on her small son — tiny numbers pop up all over his curls.
// "Do not be afraid: you are worth more than many sparrows": the seller's whole cage-full flies up and settles on the
// pan of a great balance let down over the street; the boy's paper likeness sits on the other pan — and it goes down.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { awning } from '../mark6/lib.js';
import { cage } from '../mark11/lib.js';
import { village, DAY, sparrow, flapWings, coin, nameTag, balance10, beam, heart, headAt, hand, tr, PI, FONT } from './lib.js';

const GY = 704;
const SX = 500;                       // the stall
const WX = 720, BX = 800;             // the woman, her boy
const PIV = [920, 236];

export default {
  id: 'lk12-sparrows',
  enter: 'fly',
  beats: [
    { v: 6, text: 'Czyż nie sprzedają pięciu wróbli za dwa asy?' },
    { v: 6, cont: true, text: 'A przecież żaden z nich nie jest zapomniany w oczach Bożych.' },
    { v: 7, text: 'U was zaś nawet włosy na głowie wszystkie są policzone.' },
    { v: 7, cont: true, text: 'Nie bójcie się: jesteście ważniejsi niż wiele wróbli.' },
  ],
  cam: { x: [-160, 240], y: [-40, 240], z: [1, 1.9] },
  build(S) {
    const V = village(S, { skyCols: DAY, sunAt: [1250, 140], seed: 'lk12-market' });
    const c = S.c;

    /* the stall */
    const st = S.layer({ par: 0.45, sh: 4 });
    st.add(`<g transform="translate(${SX} ${GY - 10})">${awning(c, 250, 196, C.tealRobe)}</g>`);
    const tb = sheet();
    tb.p(c.cut([[SX - 116, GY - 70], [SX + 116, GY - 70], [SX + 116, GY - 60], [SX - 116, GY - 60]], 0.3, 6), C.wood);
    tb.p(c.cut(c.rect(SX - 106, GY - 60, 8, 60), 0.2, 4) + c.cut(c.rect(SX + 98, GY - 60, 8, 60), 0.2, 4), C.wood2);
    st.add(tb.out() + `<g transform="translate(${SX - 70} ${GY - 70})">${cage(c, 76, 64)}</g>`);
    const caged = [[SX - 90, GY - 84], [SX - 70, GY - 94], [SX - 52, GY - 84], [SX - 78, GY - 110]].map(([x, y], i) => ({ i, x, y, el: st.add(`<g>${sparrow(c)}</g>`) }));
    const price = st.add(`<g><path d="M0 0V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr(['5 wróbli', 'za 2 asy'], ['5 sparrows', 'for 2 assaria']), { size: 15 })}</g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const seller = S.puppet(P.add(person(c, { robe: C.ochreRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather })));
    const woman = S.puppet(P.add(person(c, { robe: mix(C.stone2, C.dustyBlue, 0.3), hairStyle: 'veil', veil: C.stone, veil2: C.stone2, skin: C.skin2, beard: 'none', belt: C.rope })));
    const boy = S.puppet(P.add(person(c, { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.clay })));

    /* coins, the perch with its five, the light */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const coins = [0, 1].map(() => fx.add(`<g opacity="0">${coin(c, 5.5)}</g>`));
    const shaft = fx.add(`<g opacity="0">${beam(c, 30, 120, 1200)}</g>`);
    const perch = fx.add(`<g>${sheet().p(c.ribbon([[-40, 0], [46, 0]], 4), C.wood3).out()}</g>`);
    const FIVE = [-30, -12, 6, 24, 40].map((dx, i) => ({ i, dx, el: fx.add(`<g>${sparrow(c)}</g>`), ring: fx.add(`<g opacity="0"><circle r="24" fill="url(#halo-glow)"/><path d="${c.ribbon(c.arc(0, 0, 12, 4.4, 0, PI * 2, 18), 3)}" fill="${C.sun}"/></g>`) }));
    const NUMS = Array.from({ length: 13 }, (_, i) => {
      const a = PI * (0.9 + (i / 12) * 1.15), r = 22 + (i % 3) * 6;
      const n = [1, 2, 3, 5, 9, 17, 48, 112, 365, 1204, 4830, 21060, 100000][i];
      return { i, a, r, el: fx.add(`<g opacity="0"><text x="0" y="0" text-anchor="middle" font-family="${FONT}" font-size="${11 + Math.min(4, i * 0.4)}" font-style="italic" fill="${C.inkSoft}">${n.toLocaleString('pl-PL')}</text></g>`) };
    });
    const love = fx.add(`<g opacity="0">${heart(c, 9)}</g>`);

    /* the flock and the balance */
    const fl = S.layer({ par: 0.3, sh: 4 });
    const FLOCK = Array.from({ length: 12 }, (_, i) => ({ i, el: fl.add(`<g opacity="0">${sparrow(c)}</g>`), seed: c.rr(0, 9), x0: c.rr(SX - 100, SX - 40), y0: c.rr(GY - 110, GY - 80), dx: (i % 6 - 2.5) * 14, dy: -Math.floor(i / 6) * 12 }));
    const B = balance10(c, { arm: 150, drop: 100, pan: 110, col: C.ochre });
    const flies = S.layer({ par: 0.3, sh: 6 });
    const frame = flies.add(`<g><path d="M0 -80V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${B.frame}</g>`);
    const beamB = flies.add(`<g>${B.beam}</g>`);
    const panL = flies.add(`<g>${B.panL}</g>`);
    const panR = flies.add(`<g>${B.panR}<g transform="translate(0 98) scale(.36)">${person(c, { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.clay })}</g></g>`);

    return (t, time) => {
      const T = time;
      V.update(t, T);
      pose(price, { x: SX + 70, y: GY - 206 + (time ? Math.sin(T) * 2 : 0), r: Math.sin(T * 0.9) * 2, o: 1 - es(t, 2.0, 2.2) });
      caged.forEach((b) => { pose(b.el, { x: b.x, y: b.y, s: 0.7, sx: b.i % 2 ? -1 : 1, o: 1 - seg(t, 3.08, 3.14) }); });

      /* v6a — five sparrows for two assaria (and the fifth for nothing) */
      const pay1 = es(t, 0.1, 0.3), pay2 = es(t, 0.28, 0.46), handOver = es(t, 0.5, 0.72), extra = es(t, 0.74, 0.9);
      seller.set({ x: SX - 10, y: GY - 4, s: 0.92, armF: 30 + Math.max(pay1, pay2) * 40 * (1 - handOver) + handOver * 60 + extra * 10, armB: 10 + bump(t, 0.7, 0.95) * 50, head: bump(t, 0.72, 0.95) * 10, blink: blinkAt(T, 3) });
      const hold = handOver;
      woman.set({ x: WX, y: GY + 4, s: 0.94, flip: true, armF: 30 + bump(t, 0.05, 0.5) * 40 + hold * 30 + es(t, 1.1, 1.4) * 20, armB: 10 + es(t, 2.05, 2.3) * 40, head: 4 - es(t, 1.1, 1.4) * 8 + es(t, 2.05, 2.3) * 12, blink: blinkAt(T, 4) });
      const [whx, why] = hand(WX, GY + 4, 0.94, true, 30 + bump(t, 0.05, 0.5) * 40);
      const [shx, shy] = hand(SX - 10, GY - 4, 0.92, false, 30 + 40);
      coins.forEach((el, i) => {
        const k = i ? pay2 : pay1;
        pose(el, { x: lerp(whx, shx + i * 6, k), y: lerp(why - 4, shy - 6, k) - Math.sin(k * PI) * 30, o: t > 0.06 && t < 0.6 ? 1 : 0 });
      });
      const [hx1, hy1] = hand(WX, GY + 4, 0.94, true, 60 + es(t, 1.1, 1.4) * 20);
      const px = lerp(SX + 70, hx1 - 10, handOver), py = lerp(GY - 110, hy1 - 6, handOver) - Math.sin(handOver * PI) * 30;
      pose(perch, { x: px, y: py, sx: -1, o: t < 3.1 ? 1 : 0 });
      const lit = es(t, 1.15, 1.4);
      FIVE.forEach((b) => {
        const hop = b.i === 4 ? es(t, 0.74, 0.9) : 1;
        const bx = b.i === 4 ? lerp(SX - 30, px - b.dx, hop) : px - b.dx;
        const by = (b.i === 4 ? lerp(GY - 100, py - 8, hop) - Math.sin(hop * PI) * 50 : py - 8);
        const rise = b.i === 4 ? 0 : 0;
        pose(b.el, { x: bx, y: by - rise, s: b.i === 4 ? 0.62 : 0.72, sx: -1, o: t < 3.08 ? (b.i === 4 ? seg(t, 0.72, 0.75) : 1) : 0 });
        if (b.i === 4 && hop > 0 && hop < 1) flapWings(b.el, t * 40, 26, 1);
        const rk = es(t, 1.2 + b.i * 0.08, 1.32 + b.i * 0.08, ease.back);
        pose(b.ring, { x: bx + 2, y: by - 22, s: rk * (b.i === 4 ? 1.35 : 1), o: rk > 0.01 ? 1 - es(t, 2.0, 2.15) : 0 });
      });
      pose(shaft, { x: px, y: py - 1100, o: bump(t, 1.05, 2.0) * 0.8 });

      /* v7a — every hair on his head counted */
      const zoom = es(t, 2.02, 2.3) * (1 - es(t, 2.95, 3.2));
      boy.set({ x: BX, y: GY + 8, s: 0.7, flip: true, armF: 20 + bump(t, 0.6, 1.2) * 30, armB: 6, head: -4 - es(t, 2.3, 2.6) * 6, blink: blinkAt(T, 6) });
      const [bhx, bhy] = headAt(BX, GY + 8, 0.7, true);
      NUMS.forEach((n) => {
        const k = es(t, 2.2 + n.i * 0.035, 2.3 + n.i * 0.035, ease.back);
        pose(n.el, { x: bhx + Math.cos(n.a) * n.r * 0.7 * 1.25, y: bhy + Math.sin(n.a) * n.r * 0.7 * 1.25 - 3, s: k * 0.85, o: k > 0.01 ? 1 - es(t, 2.95, 3.05) : 0 });
      });
      const hk = es(t, 2.62, 2.78, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(love, { x: bhx - 22, y: bhy - 30, s: hk * 0.8, o: hk > 0.01 ? 1 : 0 });

      /* v7b — worth more than many sparrows */
      const dk = es(t, 3.1, 3.4, ease.back);
      const by0 = lerp(-500, PIV[1], dk);
      const settle = es(t, 3.45, 3.8);
      const tilt = es(t, 3.6, 3.95, ease.back) * 13 + (time ? Math.sin(T * 1.2) * 0.5 * dk : 0);
      const a = (tilt * PI) / 180;
      const lx = PIV[0] - Math.cos(a) * 150, ly = by0 - Math.sin(a) * 150, rx = PIV[0] + Math.cos(a) * 150, ry = by0 + Math.sin(a) * 150;
      pose(frame, { x: PIV[0], y: by0, o: dk > 0.002 ? 1 : 0 });
      pose(beamB, { x: PIV[0], y: by0, r: tilt, o: dk > 0.002 ? 1 : 0 });
      pose(panL, { x: lx, y: ly, o: dk > 0.002 ? 1 : 0 });
      pose(panR, { x: rx, y: ry, o: dk > 0.002 ? 1 : 0 });
      FLOCK.forEach((f) => {
        const k = es(t, 3.08 + f.i * 0.025, 3.55 + f.i * 0.025);
        const tx = lx + f.dx * 0.8, ty = ly + 92 + f.dy;
        const x = lerp(f.x0, tx, k), y = lerp(f.y0, ty, k) - Math.sin(k * PI) * 160;
        pose(f.el, { x, y, s: 0.62, sx: tx < f.x0 ? -1 : 1, o: seg(t, 3.06, 3.1) });
        flapWings(f.el, k < 1 ? T * 1.2 + f.seed + t * 20 : 0, k < 1 ? 26 : 3, 8);
      });
      void settle;

      const out = es(t, 3.0, 3.4);
      S.cam.x = lerp(lerp(-150, -80, es(t, 1.0, 1.3)), (bhx - 800) / 0.5, zoom) + out * 120;
      S.cam.y = lerp(90, (bhy + 6 - 470) / 0.5, zoom) - out * 130;
      S.cam.z = lerp(1.16, 1.9, zoom) - out * 0.12;
    };
  },
};
