// Mk 12,41–44 — the widow's mite. Jesus sits down opposite the trumpet-shaped offering chests and watches.
// People drop coins in; the rich pour in handfuls that ring and clatter. A poor widow comes slowly and lets
// two tiny copper coins fall. He calls his disciples: a balance comes down — the heap of silver on one pan,
// her two coins on the other — and the beam tips towards her. They gave from their plenty; she gave everything,
// her whole living: her coins glow like two small stars as the evening light turns gold.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, DAY, EVENING, LOOK, rich, townsfolk, trumpetChest, voiceRings, coin, coinStack, lepton, purse, balance, strip, sparkle, sheet, hand, headAt, bubble } from './lib.js';

const CH = [700, 836, 972];            // the chests
const CY = 624;                        // chests stand here
const MOUTH = CY - 130;                // the trumpet mouths
const JX = 526;                        // Jesus sits here
const WX = 880;                        // where the widow stands

export default {
  id: 'm12-treasury',
  beats: [
    { v: 41, text: 'Potem usiadł naprzeciw skarbony i przypatrywał się, jak tłum wrzucał drobne pieniądze do skarbony.' },
    { v: 41, cont: true, text: 'Wielu bogatych wrzucało wiele.' },
    { v: 42 },
    { v: 43, text: 'Wtedy przywołał swoich uczniów i rzekł do nich:' },
    { v: 43, cont: true, text: '«Zaprawdę, powiadam wam: Ta uboga wdowa wrzuciła najwięcej ze wszystkich, którzy kładli do skarbony.' },
    { v: 44, text: 'Wszyscy bowiem wrzucali z tego, co im zbywało;' },
    { v: 44, cont: true, text: 'ona zaś ze swego niedostatku wrzuciła wszystko, co miała, całe swe utrzymanie».' },
  ],
  cam: { x: [-40, 30], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const set = templeCourt(S);
    const F = set.FLOOR;

    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 3, x0: P ? 1020 : 1060, x1: P ? 1090 : 1240, pose: 'sit' }]);   // phone: the sitters clear of the thread

    /* the balance comes down from the flies */
    const balL = S.layer({ par: 0.3, sh: 6 });
    const B = balance(c, { arm: 150, h: 260, drop: 84 });
    const BX = 830, BY = 236;
    const beamEl = balL.add(`<g><path d="M0 -1400V-20" stroke="rgba(74,54,34,.6)" stroke-width="1.4" fill="none"/>${B.beam}</g>`);
    const heap = sheet();
    const heapM = [-34, -14, 6, 26, 42].map((x, i) => `<g transform="translate(${x} ${B.drop}) ">${coinStack(c, 5 + (i % 3) * 2, 9)}</g>`).join('');
    const panL = balL.add(`<g>${B.pan}${heapM}</g>`);
    const glowCoins = `<g data-part="glow" opacity="0"><circle cy="${B.drop - 10}" r="70" fill="url(#warm-glow)"/><circle cy="${B.drop - 10}" r="36" fill="url(#halo-glow)"/></g><g transform="translate(-7 ${B.drop - 5})">${lepton(c, 5)}</g><g transform="translate(7 ${B.drop - 5})">${lepton(c, 5)}</g>`;
    const panR = balL.add(`<g>${B.pan}${glowCoins}</g>`);
    const panRglow = panR.querySelector('[data-part="glow"]');
    const labels = [balL.add(`<g>${strip(c, tr('z tego, co im zbywało', 'out of their abundance'), { size: 15 })}</g>`), balL.add(`<g>${strip(c, tr('wszystko, co miała', 'all that she had'), { size: 15 })}</g>`)];

    /* the offering chests */
    const chL = S.layer({ par: 0.47, sh: 5 });
    CH.forEach((x, i) => chL.add(`<g transform="translate(${x} ${CY}) scale(1.1)">${trumpetChest(c)}</g>`));
    const rings = CH.map(() => [0, 1].map(() => chL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 30, 10, Math.PI * 1.1, Math.PI * 1.9, 10), 3)}" fill="${C.sun}"/></g>`)));
    const bench = chL.add(`<g>${sheet().p(c.cut(c.rect(JX - 60, F - 44, 120, 44), 0.5, 6), mix(C.stone, C.plaster2, 0.4)).p(c.cut(c.rect(JX - 66, F - 50, 132, 10), 0.4, 6), mix(C.stone, C.cream, 0.3)).out()}</g>`);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const passers = [0, 1, 2, 3].map((i) => ({ i, p: S.puppet(pl.add(person(c, townsfolk(c, { man: i % 2 === 0 })))), seed: c.rr(0, 9), ch: [2, 0, 1, 2][i], t0: 0.12 + i * 0.2 }));
    const richP = [0, 1, 2].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...rich(i), holdF: `<g transform="translate(0 -2)">${purse(c)}</g>` }))), seed: c.rr(0, 9), ch: [0, 2, 1][i] }));
    // her glow: behind her
    const widowGlow = pl.add(`<g opacity="0"><circle r="170" fill="url(#warm-glow)"/></g>`);
    const widow = S.puppet(pl.add(person(c, { ...LOOK.widow })));
    const widowPurse = pl.add(`<g>${purse(c, { full: false, col: mix(C.leather, C.stone2, 0.4) })}</g>`);
    const dis = [CAST.peter, CAST.john, CAST.james, CAST.andrew].map((o, i) => ({ i, p: S.puppet(pl.add(person(c, o))), to: [410, 660, 350, 706][i] }));
    const jesusStand = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const voice = voiceRings(pl, c, { n: 3, r: 24, w: 4 });
    const coins = Array.from({ length: 14 }, () => pl.add(`<g>${coin(c, 7)}</g>`));
    const lepta = [0, 1].map(() => pl.add(`<g>${lepton(c, 4.6)}</g>`));
    const mite = pl.add(`<g>${strip(c, tr('dwa pieniążki = jeden grosz', 'two small coins = a quadrans'), { size: 15 })}</g>`);
    const sparks = [0, 1, 2, 3, 4].map(() => pl.add(`<g>${sparkle(c, 9)}</g>`));

    set.front();

    return (t, time) => {
      const T = time;
      const gold = es(t, 5.9, 6.8);
      set.sk.blend(DAY, EVENING, gold * 0.8);
      set.update(t, T, { sunDY: gold * 120 });

      /* v41a — Jesus sits down opposite the chests */
      const walkIn = es(t, 0.0, 0.3), sit = seg(t, 0.32, 0.36);
      const jx = lerp(260, JX, walkIn);
      jesusStand.set({ x: jx, y: F, s: 1.0, walk: walkIn > 0 && walkIn < 1 ? jx * 0.05 : undefined, o: 1 - sit, blink: blinkAt(T) });
      const call = bump(t, 3.02, 3.6), teach = es(t, 4.02, 4.3);
      jesus.set({ x: JX, y: F - 48, s: 1.0, o: sit, blink: blinkAt(T), head: 4 - call * 10, armF: 30 + call * 80 + teach * 50 * (1 - es(t, 6.9, 7)), armB: 16 + call * 60 * 0 + bump(t, 4.3, 5.0) * 40 + bump(t, 6.1, 6.9) * 60 });
      voice(JX + 24, F - 48 - 106, Math.max(bump(t, 3.02, 3.9), teach), T, { dir: 1 });
      pose(bench, {});

      // coins in the air: a small helper — k: 0..1 along the fall from hand to mouth
      let ci = 0;
      const drop = (x0, y0, x1, k, big = true) => {
        if (ci >= coins.length) return;
        const el = coins[ci++];
        if (k <= 0 || k >= 1) { pose(el, { o: 0 }); return; }
        pose(el, { x: lerp(x0, x1, k), y: lerp(y0, MOUTH + 6, k) - Math.sin(k * Math.PI) * 20, r: k * 400, s: big ? 1 : 0.7, o: 1 });
      };
      const ring = (i, a) => rings[i].forEach((el, j) => { const k = seg(t, a + j * 0.05, a + 0.3 + j * 0.05); pose(el, { x: CH[i], y: MOUTH - 4 - k * 18, s: 0.6 + k * 1.2, o: bump(t, a + j * 0.05, a + 0.3 + j * 0.05) }); });

      /* ordinary people pass and drop their small coins */
      passers.forEach((p) => {
        const k = es(t, p.t0, p.t0 + 0.75, (u) => u);
        const cx = CH[p.ch];
        // walk right → left, pause at the chest
        const x = k < 0.4 ? lerp(1440, cx + 44, k / 0.4) : k < 0.6 ? cx + 44 : lerp(cx + 44, 1480, (k - 0.6) / 0.4);
        const give = bump(k, 0.4, 0.6);
        p.p.set({ x, y: F + 10 + (p.i % 2) * 6, s: 0.86, flip: k < 0.6, walk: (k > 0 && k < 0.4) || (k > 0.6 && k < 1) ? x * 0.05 + p.i : undefined, armF: 20 + give * 70, blink: blinkAt(T, p.seed), o: k > 0 && k < 1 ? 1 : 0 });
        const [hx, hy] = hand(cx + 44, F + 10, 0.86, true, 90);
        drop(hx, hy, cx, seg(k, 0.47, 0.56), false);
      });

      /* v41b — the rich pour in much, ringing */
      richP.forEach((r) => {
        const a = 1.05 + r.i * 0.22;
        const k = es(t, a, a + 0.62, (u) => u);
        const cx = CH[r.ch];
        const x = k < 0.35 ? lerp(1480 + r.i * 40, cx + 50, k / 0.35) : k < 0.65 ? cx + 50 : lerp(cx + 50, 1500, (k - 0.65) / 0.35);
        const pour = bump(k, 0.33, 0.67);
        // v44a — they come back into view, purses still fat, strolling off
        const again = es(t, 5.05 + r.i * 0.08, 5.5 + r.i * 0.08), away = es(t, 5.95, 6.4, ease.in);
        const x2 = lerp(lerp(1500 + r.i * 60, (P ? 930 : 1010) + r.i * (P ? 50 : 74), again), 1560 + r.i * 60, away);   // phone: clear of the thread
        const show = again > 0 && away < 1;
        r.p.set({
          x: show ? x2 : x, y: F + 8 + (r.i % 2) * 8, s: 0.96, flip: show ? away <= 0 : k > 0.65 ? false : true,
          walk: (show && ((again > 0 && again < 1) || away > 0)) || (k > 0 && k < 0.35) || (k > 0.65 && k < 1) ? (show ? x2 : x) * 0.05 + r.i : undefined,
          armF: show ? 60 + Math.sin(T * 4) * 4 : 20 + pour * 110, head: pour * -14 + (show ? -8 : 0), lean: show ? -4 : 0,
          blink: blinkAt(T, r.seed), o: (k > 0 && k < 1) || show ? 1 : 0,
        });
        const [hx, hy] = hand(cx + 50, F + 8, 0.96, true, 130);
        for (let j = 0; j < 3; j++) drop(hx, hy + 20, cx, seg(k, 0.4 + j * 0.07, 0.52 + j * 0.07));
        ring(r.ch, a + 0.62 * 0.4);
      });
      while (ci < coins.length) pose(coins[ci++], { o: 0 });

      /* v42 — the widow: slowly, two tiny coins */
      const wIn = es(t, 2.02, 2.5, (u) => u);
      const wx = lerp(1440, WX, ease.out(wIn));
      const give = bump(t, 2.5, 2.9);
      const turnOut = es(t, 6.1, 6.35);
      widow.set({ x: wx, y: F + 6, s: 0.84, flip: true, walk: wIn > 0 && wIn < 1 ? wx * 0.035 : undefined, amt: 0.6, lean: 8 - give * 4, head: 10 - bump(t, 4.2, 5.0) * 8, armF: 20 + give * 60 + turnOut * 70, armB: 10, blink: blinkAt(T, 3), o: wIn > 0 ? 1 : 0 });
      lepta.forEach((el, i) => {
        const k = seg(t, 2.62 + i * 0.1, 2.82 + i * 0.1);
        const [hx, hy] = hand(WX, F + 6, 0.84, true, 75, 8);
        pose(el, { x: lerp(hx, CH[1] + 2 * i, k), y: lerp(hy, MOUTH + 4, k) - Math.sin(k * Math.PI) * 14, o: k > 0 && k < 1 ? 1 : 0, s: 1.3 });
      });
      const mk = es(t, 2.7, 2.85, ease.back) * (1 - es(t, 3.3, 3.45));
      pose(mite, { x: WX - 40, y: F - 200, s: mk, o: mk > 0.02 ? 1 : 0 });
      // her flat little purse, turned out: nothing left
      const [px, py] = hand(WX, F + 6, 0.84, true, 20 + turnOut * 70, 8);
      pose(widowPurse, { x: px, y: py - 4, r: turnOut * 170, s: 0.8, o: wIn >= 1 ? 1 : 0 });
      pose(widowGlow, { x: WX, y: F - 90, o: es(t, 6.2, 6.7) * (0.8 + Math.sin(T * 1.5) * 0.1) });
      sparks.forEach((el, i) => {
        const k = ((T * 0.3 + i / 5) % 1);
        pose(el, { x: WX - 60 + i * 30 + Math.sin(k * 6 + i) * 8, y: F - 60 - k * 170, s: 0.7, o: es(t, 6.3, 6.7) * Math.sin(k * Math.PI) });
      });

      /* v43a — he calls his disciples */
      dis.forEach((d) => {
        const k = es(t, 3.1 + d.i * 0.06, 3.6 + d.i * 0.06);
        const x = lerp(d.to < JX ? -120 - d.i * 40 : -200 - d.i * 40, d.to, k);
        d.p.set({ x, y: F + 14 + (d.i % 2) * 6, s: 0.9, flip: d.to > JX ? true : false, walk: k > 0 && k < 1 ? x * 0.05 + d.i : undefined, head: -bump(t, 4.2, 7) * 8, armF: bump(t, 4.6, 5.0) * 30, blink: blinkAt(T, d.i + 3), o: k > 0 ? 1 : 0 });
      });
      // the disciples on the right look toward him, then to the widow
      if (t > 3.6) dis.forEach((d) => { if (d.to > JX) d.p.set({ x: d.to, y: F + 14 + (d.i % 2) * 6, s: 0.9, flip: t < 4.3 || t > 5.9 ? true : false, head: -4, blink: blinkAt(T, d.i + 3) }); });

      /* v43b — the balance: the heap against her two coins, and it tips to her side */
      const bd = es(t, 4.05, 4.4, ease.out);
      const tip = lerp(-13, 14, es(t, 4.45, 4.85, ease.back));
      const by = lerp(-900, BY, bd);
      const ang = (tip * Math.PI) / 180;
      pose(beamEl, { x: BX, y: by, r: tip });
      pose(panL, { x: BX - Math.cos(ang) * 150, y: by - Math.sin(ang) * 150 });
      pose(panR, { x: BX + Math.cos(ang) * 150, y: by + Math.sin(ang) * 150 });
      fade(panRglow, Math.max(es(t, 4.7, 5.0) * 0.6, es(t, 6.1, 6.6)));
      labels.forEach((el, i) => {
        const k = es(t, 5.05 + i * 1.0, 5.25 + i * 1.0, ease.back);
        const sx = i ? BX + Math.cos(ang) * 150 : BX - Math.cos(ang) * 150, sy = by + (i ? 1 : -1) * Math.sin(ang) * 150 + B.drop + 44;
        pose(el, { x: sx, y: sy, s: k, o: k > 0.02 ? 1 : 0 });
      });
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, head: -3, blink: blinkAt(T, m.seed) }));

      S.cam.z = 1 + es(t, 1.9, 2.6) * 0.04 * (1 - es(t, 3.0, 3.4)) + es(t, 6.0, 6.9) * 0.05;
      S.cam.x = es(t, 1.9, 2.6) * 30 * (1 - es(t, 3.0, 3.4)) + es(t, 6.0, 6.9) * 20;
      S.cam.y = -es(t, 4.0, 4.4) * 16 * (1 - es(t, 6.0, 6.9));
    };
  },
};
