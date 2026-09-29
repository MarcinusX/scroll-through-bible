// Łk 20,9b–10 — the parable flies in: Mark 12's walled vineyard on the slope over the sea. "A man planted a vineyard":
// he walks along the rows and the vines spring up behind him; "let it out to tenants": three farmers come in and he
// gives the key to the first; "and went away for a long time": he goes out at the gate and sails off, the far land
// comes down on its two strings, and an hourglass beside it turns over, and over again. "At the proper time he sent a
// servant to the tenants, that they should give him his share of the fruit": the grapes ripen, the tenants fill their
// baskets; in the far land the owner points, and a servant comes in at the gate holding out an empty basket. "But the
// tenants beat him and sent him away empty": two blows — little paper starbursts — and he runs out of the gate, his
// basket turned upside down, nothing in it.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { vineyardSet, VY, LOOK, tenant, servant, hoe, bigKey, basketCut, burst, moodPuppet, hourglass, bubble, kf, moving, tr, es, ease, bump, seg } from './lib.js';

const G = VY.G;
const STOP = 952;
const TX = [724, 792, 860];

export default {
  id: 'lk20-vineyard',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 9, cont: true, text: '«Pewien człowiek założył winnicę, oddał ją w dzierżawę rolnikom i wyjechał na dłuższy czas.' },
    { v: 10, text: 'W odpowiedniej porze wysłał sługę do rolników, aby mu oddali jego część z plonu winnicy.' },
    { v: 10, cont: true, text: 'Lecz rolnicy obili go i odesłali z niczym.' },
  ],
  cam: { x: [-20, 30], y: [0, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = vineyardSet(S);
    set.wallB.forEach((w) => pose(w.el, { x: w.x, y: w.y }));
    set.tower.forEach((el) => pose(el, { o: 0 }));
    pose(set.gateBack, { x: VY.GATE0, y: VY.WALL_F - 4 });
    const glassL = S.layer({ par: 0.08, sh: 5 });
    const glass = glassL.add(`<g><path d="M0 -1600V-22" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g data-part="g" transform="scale(1.6)">${hourglass(c, 34)}</g></g>`);
    const glassIn = glass.querySelector('[data-part="g"]');

    const pl = S.layer({ par: 0.5, sh: 5 });
    const owner = S.puppet(pl.add(person(c, { ...LOOK.owner, holdF: hoe(c) })));
    const keyEl = pl.add(`<g>${bigKey(c)}</g>`);
    const ten = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...tenant(i), holdF: i === 1 ? hoe(c) : '' }), seed: c.rr(0, 9) }));
    const baskets = [0, 2].map((i) => ({ i, el: pl.add(`<g>${basketCut(c, { full: true })}</g>`) }));
    const sv = moodPuppet(S, pl, c, { ...servant(0) });
    const svBasket = pl.add(`<g>${basketCut(c)}</g>`);
    const bursts = [0, 1].map(() => pl.add(`<g>${burst(c, 22)}</g>`));
    const laugh = pl.add(`<g>${bubble(c, tr('Precz!', 'Away!'), { size: 18, tail: -1 })}</g>`);

    const fr = set.front();
    fr.wallF.forEach((w) => pose(w.el, { x: w.x, y: w.y }));
    pose(fr.gateFront, { x: VY.GATE1, y: VY.WALL_F });
    pose(fr.lintel, { x: VY.GATE0 - 12, y: VY.WALL_F - 170 });
    pose(fr.press, { o: 0 });
    const stocks = [...set.backRow, ...fr.frontRow];
    const allGrapes = [...set.grapesB, ...fr.grapesF];
    const walkKeys = [[0.03, 360], [0.4, 1010]];
    const plantAt = (x) => 0.03 + ((x - 360) / 650) * 0.37;

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunX: 470 + es(t, 0, 3) * 240, sunY: 170 - es(t, 0, 1.5) * 20 });
      /* v9b — plants, lets it out, goes away */
      let ox = kf(t, walkKeys, (u) => u);
      const give = es(t, 0.44, 0.52);
      const leave = es(t, 0.54, 0.68, ease.in);
      if (t > 0.54) ox = lerp(1010, 1440, leave);
      owner.set({
        x: ox, y: G, s: 0.98, flip: false, walk: moving(t, walkKeys) || (leave > 0 && leave < 1) ? ox * 0.05 : undefined,
        armF: 40 + bump(t, 0.03, 0.4) * Math.max(0, Math.sin(t * 90)) * 30 + give * 30, armB: 10, head: -give * 6,
        o: 1 - es(t, 0.66, 0.7), blink: blinkAt(T),
      });
      stocks.forEach((v) => {
        const g = es(t, plantAt(v.x), plantAt(v.x) + 0.08, ease.back);
        pose(v.el, { x: v.x, y: v.y, sx: 0.5 + 0.5 * g, sy: Math.max(0.001, g), o: g > 0.01 ? 1 : 0 });
      });
      const kk = es(t, 0.44, 0.52);
      pose(keyEl, { x: lerp(1054, TX[2] + 40, kk), y: G - 104 - Math.sin(kk * Math.PI) * 30, r: -20 + kk * 30, s: 0.9, o: t > 0.4 && t < 0.6 ? 1 : 0 });
      const sail = seg(t, 0.62, 0.95);
      pose(set.shipEl, { x: lerp(820, 1260, sail), y: 436, s: lerp(0.9, 0.35, sail), o: t > 0.62 ? 1 - seg(t, 0.92, 0.97) : 0 });
      const plateDrop = es(t, 0.55, 0.72, ease.out);
      pose(set.plateEl, { x: VY.ABROAD[0], y: lerp(-800, VY.ABROAD[1], plateDrop), r: T ? Math.sin(T * 0.8) * 1.2 : 0 });
      const send = Math.max(bump(t, 1.2, 1.6), bump(t, 2.1, 2.5) * 0.5);
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: true, armF: 30 + send * 70, head: send * 6, blink: blinkAt(T, 4) });
      set.pSon.set({ x: 0, y: 0, s: 1, o: 0 });
      // the long time: the hourglass turns over, and over
      const gk = es(t, 0.6, 0.74, ease.out);
      pose(glass, { x: VY.ABROAD[0] - 150, y: lerp(-800, 250, gk), r: T ? Math.sin(T * 0.9) * 1.5 : 0 });
      pose(glassIn, { s: 1.6, r: 180 * (es(t, 0.74, 0.86) + es(t, 0.9, 1.02)) });

      /* the tenants */
      ten.forEach((m) => {
        const inK = es(t, 0.3 + m.i * 0.04, 0.46 + m.i * 0.04);
        let x = lerp(1340 + m.i * 60, TX[m.i], inK);
        const atk = bump(t, 1.9, 2.55);
        x += atk * [60, 80, 50][m.i];
        const strike = Math.max(bump(t, 2.05, 2.25), bump(t, 2.22, 2.42)) * (m.i === 1 ? 1 : m.i === 2 ? 0.8 : 0.4);
        const harvest = bump(t, 1.02, 1.3);
        m.p.set({
          x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, flip: inK < 1 || (m.i === 0 && t > 0.6 && t < 1.0), walk: inK > 0 && inK < 1 ? x * 0.05 + m.i : undefined, o: seg(t, 0.28, 0.32),
          armF: 20 + harvest * 70 + strike * 110 + (m.i === 2 ? bump(t, 0.44, 0.56) * 50 : 0), armB: 10 + (m.i !== 1 ? 34 : 0) + strike * 30 + bump(t, 2.5, 2.9) * 60,
          head: -harvest * 8 + bump(t, 2.5, 2.9) * 10, lean: -strike * 6, blink: blinkAt(T, m.seed),
        });
        m.p.mood({ angry: es(t, 1.85, 2.0) });
      });
      baskets.forEach((b) => {
        const m = ten[b.i];
        const inK = es(t, 0.3 + m.i * 0.04, 0.46 + m.i * 0.04);
        const x = lerp(1340 + m.i * 60, TX[m.i], inK) + bump(t, 1.9, 2.55) * [60, 80, 50][m.i];
        const fill = es(t, 1.15, 1.3);
        pose(b.el, { x: x - 22, y: G - 88, s: 0.9, o: fill });
      });

      /* v10a — the grapes ripen; the servant comes with his empty basket */
      allGrapes.forEach((g) => {
        const k = es(t, 1.0 + (g.i % 14) * 0.015, 1.14 + (g.i % 14) * 0.015, ease.back);
        pose(g.el, { x: g.x, y: g.y, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const inK = es(t, 1.3, 1.62);
      const hit = Math.max(bump(t, 2.05, 2.25), bump(t, 2.22, 2.42));
      const away = es(t, 2.42, 2.96);
      let sx = lerp(1440, STOP, inK);
      if (t > 2.42) sx = lerp(STOP, 1420, away);
      const holdOut = es(t, 1.6, 1.75) * (1 - es(t, 2.0, 2.1));
      sv.set({
        x: sx + hit * 12, y: G + 2, s: 1, flip: away <= 0, walk: (inK > 0 && inK < 1) || (away > 0 && away < 1) ? sx * 0.06 : undefined,
        armF: 20 + holdOut * 60 + (away > 0 ? 80 : 0), armB: 10 + hit * 60, head: hit * 12 + (away > 0 ? 8 : 0), lean: -hit * 10 + away * 8,
        o: (inK > 0 ? 1 : 0) * (1 - seg(t, 2.94, 2.98)), blink: blinkAt(T, 3),
      });
      sv.mood({ sad: es(t, 2.0, 2.1) });
      const flip = away <= 0;
      const bx = sx + hit * 12 + (flip ? -1 : 1) * (holdOut * 44 + (away > 0 ? 40 : 18));
      pose(svBasket, { x: bx, y: G - 94 - holdOut * 30 - (away > 0 ? 36 : 0), r: away > 0 ? 180 : 0, s: 0.95, o: (inK > 0 ? 1 : 0) * (1 - seg(t, 2.94, 2.98)) });
      bursts.forEach((b, i) => {
        const k = bump(t, 2.05 + i * 0.17, 2.25 + i * 0.17);
        pose(b, { x: STOP - 14 + i * 26, y: G - 150 + i * 22, s: 0.4 + k * 0.8, r: k * 40, o: k > 0.02 ? k : 0 });
      });
      const lk = es(t, 2.45, 2.55, ease.back) * (1 - es(t, 2.95, 3));
      pose(laugh, { x: TX[1] + 90, y: G - 214, s: lk, o: lk > 0.02 ? 1 : 0 });

      S.cam.z = kf(t, [[0, 1.12], [0.6, 1.12], [0.9, 1.08], [1.3, 1.12]]);
      S.cam.y = 40;
      S.cam.x = kf(t, [[0, -10], [0.6, 0], [0.9, 20], [1.3, 10]]);
    };
  },
};
