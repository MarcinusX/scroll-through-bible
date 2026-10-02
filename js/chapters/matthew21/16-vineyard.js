// Mt 21,33–36 — "Hear another parable": Mark 12's vineyard flies in. A householder walks the bare field and plants it,
// walls it, digs a winepress, builds a tower, leases it to farmers and sails to a far land (a plate on strings). At
// harvest time he sends his servants for the fruit; the farmers seize them — one is beaten and runs, one is killed,
// one is stoned — told with paper-theatre restraint: a starburst for a blow, a white cloth lowered over the fallen.
// He sends more servants, more than the first; they fare the same.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vineyardSet, VY, L12 as LOOK, tenant, servant, hoe, bigKey, basketCut, burst, bubble, kf, moving, stoneBlock, moodPuppet, drapeCloth, tr } from './lib.js';

const G = VY.G;
const STOP0 = 952;                    // where the servants stop, facing the tenants
const TX0 = [724, 792, 860];          // the tenants' places

export default {
  id: 'mt21-vineyard',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 33, text: 'Posłuchajcie innej przypowieści!' },
    { v: 33, cont: true, text: 'Był pewien gospodarz, który założył winnicę.' },
    { v: 33, cont: true, text: 'Otoczył ją murem, wykopał w niej tłocznię, zbudował wieżę,' },
    { v: 33, cont: true, text: 'w końcu oddał ją w dzierżawę rolnikom i wyjechał.' },
    { v: 34 },
    { v: 35, text: 'Ale rolnicy chwycili jego sługi i jednego obili,' },
    { v: 35, cont: true, text: 'drugiego zabili, trzeciego zaś ukamienowali.' },
    { v: 36 },
  ],
  cam: { x: [-20, 20], y: [0, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    // phone: the servants' fates, the far land and the tower kept inside the frame
    const P = S.portrait;
    const STOP = P ? 902 : STOP0, TX = P ? TX0.map((x) => x - 30) : TX0;
    const ABROAD = P ? [975, 250] : VY.ABROAD, TOWER = P ? 545 : VY.TOWER;
    const set = vineyardSet(S);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const owner = S.puppet(pl.add(person(c, { ...LOOK.owner, holdF: hoe(c) })));
    const keyEl = pl.add(`<g>${bigKey(c)}</g>`);
    const ten = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...tenant(i), holdF: hoe(c) }), seed: c.rr(0, 9) }));
    const mkServant = (i, s = 1) => ({ i, p: moodPuppet(S, pl, c, { ...servant(i), holdB: `<g transform="translate(-4 -14)">${basketCut(c)}</g>` }), seed: c.rr(0, 9), s });
    const sv = [0, 1, 2].map((i) => mkServant(i));
    const many = [3, 4, 5, 6, 7].map((i) => mkServant(i, 0.86));
    const stones = [0, 1, 2].map(() => pl.add(`<g>${stoneBlock(c, 14, 11, c.pick([C.rock2, C.rock, C.stone2]))}</g>`));
    const cloths = [0, 1].map(() => pl.add(`<g>${drapeCloth(c, 118, 100)}</g>`));
    const bursts = [0, 1, 2, 3, 4, 5].map(() => pl.add(`<g>${burst(c, 20)}</g>`));
    const laugh = [0, 1].map((i) => pl.add(`<g>${bubble(c, tr('Ha, ha!', 'Ha, ha!'), { size: 17, tail: i ? 1 : -1 })}</g>`));
    const hearEl = pl.add(`<g>${bubble(c, [tr('Posłuchajcie!', 'Hear!')], { size: 20, tail: 0 })}</g>`);

    const fr = set.front();

    // the owner walks in, then along the field while the vines come up behind him
    const walkKeys = [[0.2, 150], [0.8, 360], [1.05, 360], [1.85, 1010], [2.05, 1010], [2.2, 650]];
    const plantAt = (x) => 1.05 + ((x - 360) / 650) * 0.8;
    const stocks = [...set.backRow, ...fr.frontRow];
    const allGrapes = [...set.grapesB, ...fr.grapesF];

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunX: P ? 560 + es(t, 0, 8) * 200 : 470 + es(t, 0, 8) * 260,   // phone: the sun starts inside the left edge
        sunY: 170 - es(t, 0, 4) * 20 + es(t, 4, 8) * 10 });

      /* v33a — "Hear another parable" */
      const hk = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.8, 0.95));
      pose(hearEl, { x: 800, y: 330, s: hk, o: hk > 0.02 ? 1 : 0 });

      /* v33b — the owner walks along and the vines spring up */
      let ox = kf(t, walkKeys, (u) => u);
      const give = es(t, 3.3, 3.5);
      const leave = es(t, 3.55, 3.95, ease.in);
      if (t > 3.5) ox = lerp(650, 1420, leave);
      const building = bump(t, 2.2, 3.0);
      owner.set({
        x: ox, y: G, s: 0.98, flip: (t > 2.0 && t < 2.22) || (t > 2.52 && t < 2.98),
        walk: moving(t, walkKeys) || (leave > 0 && leave < 1) ? ox * 0.05 : undefined,
        armF: 40 + bump(t, 1.1, 1.9) * Math.max(0, Math.sin(t * 40)) * 30 + building * 60 + give * 30 + bump(t, 0.85, 1.0) * 30,
        armB: 10 + bump(t, 2.1, 2.3) * 60 + bump(t, 2.35, 2.55) * 60 + bump(t, 2.6, 2.9) * 80,
        head: -bump(t, 2.55, 2.95) * 16, o: seg(t, 0.15, 0.2) * (1 - es(t, 3.85, 3.95)), blink: blinkAt(T),
      });
      stocks.forEach((v) => {
        const g = es(t, plantAt(v.x), plantAt(v.x) + 0.16, ease.back);
        pose(v.el, { x: v.x, y: v.y, sx: 0.5 + 0.5 * g, sy: Math.max(0.001, g), o: g > 0.01 ? 1 : 0 });
      });

      /* v33c — the wall rises, the press is dug, the tower goes up course by course */
      set.wallB.forEach((w, i) => { const k = es(t, 2.05 + i * 0.04, 2.2 + i * 0.04); pose(w.el, { x: w.x, y: w.y, sy: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });
      fr.wallF.forEach((w, i) => { const k = es(t, 2.08 + i * 0.04, 2.23 + i * 0.04); pose(w.el, { x: w.x, y: w.y, sy: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });
      const gk = es(t, 2.2, 2.35, ease.back);
      pose(set.gateBack, { x: VY.GATE0, y: VY.WALL_F - 4, sy: Math.max(0.001, gk), o: gk > 0.01 ? 1 : 0 });
      pose(fr.gateFront, { x: VY.GATE1, y: VY.WALL_F, sy: Math.max(0.001, gk), o: gk > 0.01 ? 1 : 0 });
      const lk = es(t, 2.32, 2.42);
      pose(fr.lintel, { x: VY.GATE0 - 12, y: VY.WALL_F - 170 - (1 - lk) * 40, o: lk });
      const pk = es(t, 2.35, 2.55, ease.back);
      pose(fr.press, { x: VY.PRESS, y: 720 + (1 - pk) * 30, s: 1.25, sx: 1.25 * (0.4 + 0.6 * pk), o: pk > 0.01 ? 1 : 0 });
      set.tower.forEach((el, i) => { const k = es(t, 2.55 + i * 0.09, 2.66 + i * 0.09, ease.out); pose(el, { x: TOWER, y: 606 - (1 - k) * 70, o: k }); });

      /* v33d — the farmers come in and take the key; the owner sails away to a far land */
      ten.forEach((m) => {
        const inK = es(t, 3.0 + m.i * 0.05, 3.35 + m.i * 0.05);
        let x = lerp(1360 + m.i * 60, TX[m.i], inK);
        const atk = Math.max(bump(t, 5.0, 5.9), es(t, 6.0, 6.15) * (1 - es(t, 6.85, 6.98)), es(t, 7.25, 7.4) * (1 - es(t, 7.9, 7.99)));
        x += atk * (m.i === 2 ? 26 : m.i === 1 ? 50 : 56);
        const swingSt = Math.max(bump(t, 5.2, 5.45), bump(t, 5.95, 6.15), bump(t, 6.28, 6.5) * (m.i === 1 ? 1 : 0), ...[0, 1, 2, 3, 4].map((k) => bump(t, 7.3 + k * 0.12, 7.44 + k * 0.12)));
        const jeer = bump(t, 5.5, 5.95);
        m.p.set({
          x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, flip: inK < 1,
          walk: inK > 0 && inK < 1 ? x * 0.05 + m.i : undefined, o: seg(t, 2.98, 3.02),
          armF: 20 + swingSt * 110 + bump(t, 3.35, 3.6) * (m.i === 0 ? 50 : 0), armB: 10 + jeer * 70 + swingSt * 30,
          head: jeer * (m.i === 1 ? -14 : 10) - bump(t, 3.3, 3.6) * 6, lean: jeer * -6, blink: blinkAt(T, m.seed),
        });
        m.p.mood({ angry: es(t, 4.9, 5.05) });
      });
      const kk = es(t, 3.3, 3.5);
      pose(keyEl, { x: lerp(ox + 44, TX[0] - 36, kk), y: G - 104 - Math.sin(kk * Math.PI) * 30, r: -20 + kk * 30, s: 0.9, o: t > 3.2 && t < 3.62 ? 1 : 0 });
      const sail = seg(t, 3.8, 4.6);
      pose(set.shipEl, { x: lerp(820, 1260, sail), y: 436, s: lerp(0.9, 0.35, sail), o: t > 3.8 ? 1 - seg(t, 4.45, 4.6) : 0 });
      const plateDrop = es(t, 3.75, 4.15, ease.out);
      pose(set.plateEl, { x: ABROAD[0], y: lerp(-800, ABROAD[1], plateDrop), r: Math.sin(T * 0.8) * 1.2 });
      const send = Math.max(bump(t, 4.2, 4.7), bump(t, 6.95, 7.4));
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: true, armF: 30 + send * 70, head: send * 6, blink: blinkAt(T, 4) });
      set.pSon.set({ x: 0, y: 0, s: 1, o: 0 });

      /* v34 — the season of fruit: the grapes ripen; he sends his servants */
      allGrapes.forEach((g) => {
        const k = es(t, 4.0 + (g.i % 14) * 0.02, 4.2 + (g.i % 14) * 0.02, ease.back);
        pose(g.el, { x: g.x, y: g.y, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* the servants: in through the gate … and their fates */
      const serv = (m, tin, tout, fate, stop, dur = 0.45, outDur = 0.45) => {
        const x0 = 1420, s = m.s;
        const inK = es(t, tin, tin + dur);
        let x = lerp(x0, stop, inK), flip = true, walk = inK > 0 && inK < 1 ? x * 0.05 : undefined, lean = 0, armF = 20, armB = 0, head = 0, o = inK > 0 ? 1 : 0, y = G + 2;
        const hit = bump(t, tout - 0.3, tout);
        lean = -hit * 12;
        if (fate === 'killed') {
          const fall = es(t, tout, tout + 0.12, ease.in);
          y = G + 2 + fall * 30; o *= 1 - fall; lean = -fall * 10; armF = 20 + fall * 50;
        } else {
          const away = es(t, tout, tout + outDur, ease.in);
          x = lerp(stop, x0, away) + hit * 14; flip = !(away > 0);
          walk = away > 0 && away < 1 ? x * 0.06 : walk;
          armF = 20 + hit * 60; armB = away > 0 ? 150 : 0; head = away > 0 ? 10 : 0;
          o *= 1 - seg(t, tout + outDur - 0.05, tout + outDur);
        }
        m.p.set({ x, y, s, flip, walk, lean, armF, armB, head, o, blink: blinkAt(T, m.seed) });
        m.p.mood({ sad: es(t, tout - 0.3, tout - 0.2) });
        return { x, y, flip };
      };
      serv(sv[0], 4.35, 5.5, 'beaten', STOP);
      serv(sv[1], 4.5, 6.12, 'killed', STOP + 70);
      serv(sv[2], 4.65, 6.58, 'killed', STOP + 140);
      // v36 — the many others: some beaten and chased out, some killed
      const fates = ['beaten', 'killed', 'beaten', 'killed', 'beaten'];
      const manyT = many.map((m, k) => 7.35 + k * 0.12);
      many.forEach((m, k) => serv(m, 7.02 + k * 0.05, manyT[k] + 0.1, fates[k], STOP - 20 + k * 36, 0.28, 0.3));
      // white cloths lowered over the fallen
      [[6.22, STOP + 64], [6.66, STOP + 134]].forEach(([at, x], i) => {
        const k = es(t, at, at + 0.2, ease.out);
        pose(cloths[i], { x, y: lerp(G - 420, G + 4, k), o: k > 0.001 ? (1 - es(t, 7.0, 7.1)) : 0 });
      });
      // the stones thrown at the third
      stones.forEach((st, i) => {
        const th = seg(t, 6.28 + i * 0.07, 6.46 + i * 0.07);
        const land = es(t, 6.48 + i * 0.07, 6.6 + i * 0.07, ease.in);
        pose(st, { x: lerp(TX[1] + 60, STOP + 120 + i * 20, th) + land * (i - 1) * 30, y: lerp(G - 150, G - 160 + i * 20, th) - Math.sin(th * Math.PI) * 60 + land * (G + 6 - (G - 160 + i * 20)), r: th * 300 + land * 40, o: th > 0 ? 1 - es(t, 7.0, 7.1) : 0 });
      });

      // blows — little starbursts, nothing more
      const hits = [[5.2, 5.5, STOP - 10, G - 150], [5.3, 5.55, STOP + 16, G - 120], [6.0, 6.2, STOP + 60, G - 140], [6.4, 6.6, STOP + 140, G - 150], ...[0, 2].map((k) => [manyT[k] - 0.1, manyT[k] + 0.1, STOP - 20 + k * 36, G - 124])];
      bursts.forEach((b, i) => {
        const [a, z, x, y] = hits[i];
        const k = bump(t, a, z);
        pose(b, { x, y, s: 0.4 + k * 0.8, r: k * 40, o: k > 0.02 ? k : 0 });
      });
      laugh.forEach((b, i) => {
        const k = es(t, 5.5 + i * 0.08, 5.65 + i * 0.08, ease.back) * (1 - es(t, 5.95, 6.02));
        pose(b, { x: TX[i * 2] + (i ? 40 : 30), y: G - 206, s: k, r: Math.sin(T * 3 + i) * 4, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.12 + es(t, 1, 2) * 0.03 + es(t, 4.2, 4.8) * 0.02;
      S.cam.y = 40;
      S.cam.x = -10 + es(t, 4.2, 4.8) * 20;
    };
  },
};
