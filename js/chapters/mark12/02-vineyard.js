// Mk 12,1b–5 — the parable flies in: a man plants a vineyard, walls it, digs a winepress, builds a tower,
// leases it to tenants and sails abroad. From the far land (a plate on strings) he sends servant after
// servant; the tenants send them away empty, wound one, kill another — told with paper-theatre restraint:
// a starburst for a blow, a white cloth laid over the fallen.
import { C, person, blinkAt, pose, lerp, clamp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { vineyardSet, VY, LOOK, tenant, servant, hoe, bigKey, basketCut, clothCover, burst, bubble, kf, moving, stoneBlock, headBandage, moodPuppet, drapeCloth } from './lib.js';

const G = VY.G;
const STOP = 952;                     // where the servants stop, facing the tenants
const TX = [724, 792, 860];            // the tenants' places

export default {
  id: 'm12-vineyard',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 1, cont: true, text: '«Pewien człowiek założył winnicę.' },
    { v: 1, cont: true, text: 'Otoczył ją murem, wykopał tłocznię i zbudował wieżę.' },
    { v: 1, cont: true, text: 'W końcu oddał ją w dzierżawę rolnikom i wyjechał.' },
    { v: 2 },
    { v: 3 },
    { v: 4, text: 'Wtedy posłał do nich drugiego sługę;' },
    { v: 4, cont: true, text: 'lecz i tego zranili w głowę i znieważyli.' },
    { v: 5, text: 'Posłał jeszcze jednego, tego zabili.' },
    { v: 5, cont: true, text: 'I posłał wielu innych, z których jednych obili, drugich pozabijali.' },
  ],
  cam: { x: [-20, 20], y: [0, 40], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const set = vineyardSet(S);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const owner = S.puppet(pl.add(person(c, { ...LOOK.owner, holdF: hoe(c) })));
    const keyEl = pl.add(`<g>${bigKey(c)}</g>`);
    const ten = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...tenant(i), holdF: hoe(c) }), seed: c.rr(0, 9) }));
    const mkServant = (i, s = 1) => ({ i, p: moodPuppet(S, pl, c, { ...servant(i), holdB: i < 3 ? `<g transform="translate(-4 -14)">${basketCut(c)}</g>` : '' }), seed: c.rr(0, 9), s });
    const sv = [0, 1, 2].map((i) => mkServant(i));
    const svKneel = S.puppet(pl.add(person(c, { ...servant(2), pose: 'kneel' })));
    const many = [3, 4, 5, 6, 7].map((i) => mkServant(i, 0.86));
    const stone = pl.add(`<g>${stoneBlock(c, 14, 11, C.rock2)}</g>`);
    const bandage = pl.add(`<g>${headBandage(c)}</g>`);
    const cloth0 = pl.add(`<g>${drapeCloth(c, 118, 100)}</g>`);
    const bursts = [0, 1, 2, 3, 4, 5].map(() => pl.add(`<g>${burst(c, 20)}</g>`));
    const laugh = [0, 1].map((i) => pl.add(`<g>${bubble(c, tr('Ha, ha!', 'Ha, ha!'), { size: 17, tail: i ? 1 : -1 })}</g>`));

    const fr = set.front();

    // the owner's walk while planting (the vines come up behind him)
    const walkKeys = [[0.05, 360], [0.85, 1010], [1.05, 1010], [1.2, 650]];
    const plantAt = (x) => 0.05 + ((x - 360) / 650) * 0.8;
    const stocks = [...set.backRow, ...fr.frontRow];
    const allGrapes = [...set.grapesB, ...fr.grapesF];

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunX: 470 + es(t, 0, 9) * 260, sunY: 170 - es(t, 0, 4) * 20 + es(t, 4, 9) * 10 });

      /* v1a — the owner walks along and the vines spring up */
      let ox = kf(t, walkKeys, (u) => u);
      const give = es(t, 2.3, 2.5);
      const leave = es(t, 2.55, 2.95, ease.in);
      if (t > 2.5) ox = lerp(650, 1420, leave);
      const building = bump(t, 1.2, 2.0);
      owner.set({
        x: ox, y: G, s: 0.98, flip: (t > 1.0 && t < 1.22) || (t > 1.52 && t < 1.98),
        walk: moving(t, walkKeys) || (leave > 0 && leave < 1) ? ox * 0.05 : undefined,
        armF: 40 + bump(t, 0.1, 0.9) * Math.max(0, Math.sin(t * 40)) * 30 + building * 60 + give * 30,
        armB: 10 + bump(t, 1.1, 1.3) * 60 + bump(t, 1.35, 1.55) * 60 + bump(t, 1.6, 1.9) * 80,
        head: -bump(t, 1.55, 1.95) * 16, o: 1 - es(t, 2.85, 2.95), blink: blinkAt(T),
      });
      stocks.forEach((v) => {
        const g = es(t, plantAt(v.x), plantAt(v.x) + 0.16, ease.back);
        pose(v.el, { x: v.x, y: v.y, sx: 0.5 + 0.5 * g, sy: Math.max(0.001, g), o: g > 0.01 ? 1 : 0 });
      });

      /* v1b — the wall rises, the press is dug, the tower goes up course by course */
      set.wallB.forEach((w, i) => { const k = es(t, 1.05 + i * 0.04, 1.2 + i * 0.04); pose(w.el, { x: w.x, y: w.y, sy: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });
      fr.wallF.forEach((w, i) => { const k = es(t, 1.08 + i * 0.04, 1.23 + i * 0.04); pose(w.el, { x: w.x, y: w.y, sy: Math.max(0.001, k), o: k > 0.01 ? 1 : 0 }); });
      const gk = es(t, 1.2, 1.35, ease.back);
      pose(set.gateBack, { x: VY.GATE0, y: VY.WALL_F - 4, sy: Math.max(0.001, gk), o: gk > 0.01 ? 1 : 0 });
      pose(fr.gateFront, { x: VY.GATE1, y: VY.WALL_F, sy: Math.max(0.001, gk), o: gk > 0.01 ? 1 : 0 });
      const lk = es(t, 1.32, 1.42);
      pose(fr.lintel, { x: VY.GATE0 - 12, y: VY.WALL_F - 170 - (1 - lk) * 40, o: lk });
      const pk = es(t, 1.35, 1.55, ease.back);
      pose(fr.press, { x: VY.PRESS, y: 720 + (1 - pk) * 30, s: 1.25, sx: 1.25 * (0.4 + 0.6 * pk), o: pk > 0.01 ? 1 : 0 });
      set.tower.forEach((el, i) => { const k = es(t, 1.55 + i * 0.09, 1.66 + i * 0.09, ease.out); pose(el, { x: VY.TOWER, y: 606 - (1 - k) * 70, o: k }); });

      /* v1c — the tenants come in, take the key; the owner sails away to a far land */
      ten.forEach((m) => {
        const inK = es(t, 2.0 + m.i * 0.05, 2.35 + m.i * 0.05);
        let x = lerp(1360 + m.i * 60, TX[m.i], inK);
        // v3/v4/v5: step up to the servants and back
        const atk = Math.max(bump(t, 4.0, 5.0), bump(t, 6.0, 6.9), es(t, 7.35, 7.5) * (1 - es(t, 8.9, 9.2)));
        x += atk * (m.i === 2 ? 26 : m.i === 1 ? 50 : 56);
        const swingSt = Math.max(bump(t, 4.2, 4.5), bump(t, 7.5, 7.7), ...[0, 1, 2, 3, 4].map((k) => bump(t, 8.12 + k * 0.16, 8.3 + k * 0.16)));
        const jeer = bump(t, 6.3, 6.9);
        m.p.set({
          x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, flip: inK < 1 ? true : false,
          walk: inK > 0 && inK < 1 ? x * 0.05 + m.i : undefined, o: seg(t, 1.98, 2.02),
          armF: 20 + swingSt * 110 + bump(t, 2.35, 2.6) * (m.i === 0 ? 50 : 0), armB: 10 + jeer * 70 + swingSt * 30,
          head: jeer * (m.i === 1 ? -14 : 10) - bump(t, 2.3, 2.6) * 6, lean: jeer * -6, blink: blinkAt(T, m.seed),
        });
        m.p.mood({ angry: Math.max(es(t, 3.9, 4.05), 0) * (1 - es(t, 9.3, 9.4)) });
      });
      // the key: from the owner's hand to the first tenant
      const kk = es(t, 2.3, 2.5);
      pose(keyEl, { x: lerp(ox + 44, TX[0] - 36, kk), y: G - 104 - Math.sin(kk * Math.PI) * 30, r: -20 + kk * 30, s: 0.9, o: t > 2.2 && t < 2.62 ? 1 : 0 });

      // the ship and the land far away
      const sail = seg(t, 2.8, 3.8);
      pose(set.shipEl, { x: lerp(820, 1260, sail), y: 436, s: lerp(0.9, 0.35, sail), o: t > 2.8 ? 1 - seg(t, 3.6, 3.8) : 0 });
      const plateDrop = es(t, 2.75, 3.15, ease.out);
      pose(set.plateEl, { x: VY.ABROAD[0], y: lerp(-800, VY.ABROAD[1], plateDrop), r: Math.sin(T * 0.8) * 1.2 });
      // in the far land the owner points each time he sends someone
      const send = Math.max(bump(t, 3.2, 3.7), bump(t, 5.05, 5.5), bump(t, 7.0, 7.4), bump(t, 8.0, 8.9));
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: true, armF: 30 + send * 70, head: send * 6, blink: blinkAt(T, 4) });
      set.pSon.set({ x: 0, y: 0, s: 1, o: 0 });

      /* v2 — harvest time: the grapes ripen */
      allGrapes.forEach((g) => {
        const k = es(t, 3.0 + (g.i % 14) * 0.025, 3.22 + (g.i % 14) * 0.025, ease.back);
        pose(g.el, { x: g.x, y: g.y, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* the servants: in through the gate, and out again */
      const serv = (m, tin, tout, fate, dur = 0.45, outDur = 0.45) => {
        // fate: 'beaten' (runs off), 'wounded' (walks off holding his head), 'killed' (falls)
        const x0 = 1420, s = m.s;
        const inK = es(t, tin, tin + dur);
        let x = lerp(x0, STOP, inK), flip = true, walk = inK > 0 && inK < 1 ? x * 0.05 : undefined, lean = 0, r = 0, armF = 20, armB = 0, head = 0, o = inK > 0 ? 1 : 0, y = G + 2;
        const hit = bump(t, tout - 0.3, tout);
        lean = -hit * 12;
        if (fate === 'killed') {
          // he sinks down; the first one kneels, and a white cloth is lowered over him
          const fall = es(t, tout, tout + 0.12, ease.in);
          if (m === sv[2]) o *= 1 - seg(t, tout + 0.1, tout + 0.13);
          else { y = G + 2 + fall * 30; o *= 1 - fall; }
          lean = -fall * 10; armF = 20 + fall * 50;
        } else {
          const away = es(t, tout, tout + outDur, ease.in);
          x = lerp(STOP, x0, away) + hit * 14; flip = away > 0 ? false : true;
          walk = away > 0 && away < 1 ? x * 0.06 : walk;
          if (fate === 'wounded') { armB = away > 0 ? 150 : hit * 100; head = away > 0 ? 10 : 0; }
          else { armF = 20 + hit * 60; armB = away > 0 ? 0 : 0; }
          o *= 1 - seg(t, tout + outDur - 0.05, tout + outDur);
        }
        m.p.set({ x, y, s, flip, walk, lean, r, armF, armB, head, o, blink: blinkAt(T, m.seed) });
        m.p.mood({ sad: es(t, tout - 0.3, tout - 0.2) });
        return { x, y, flip };
      };
      serv(sv[0], 3.35, 4.55, 'beaten');
      const s1 = serv(sv[1], 5.15, 6.5, 'wounded');
      serv(sv[2], 7.02, 7.55, 'killed');
      // the many others: some beaten and chased out, some killed
      const fates = ['beaten', 'killed', 'beaten', 'killed', 'beaten'];
      const manyT = many.map((m, k) => 8.1 + k * 0.14);
      many.forEach((m, k) => serv(m, manyT[k] - 0.22, manyT[k] + 0.1, fates[k], 0.22, 0.3));
      // the cloth laid over the third servant
      const kn = seg(t, 7.65, 7.68);
      svKneel.set({ x: STOP, y: G + 2, s: 1, flip: true, head: 16, armF: 40, armB: 20, o: kn * (1 - seg(t, 7.95, 7.98)) });
      const c0 = es(t, 7.7, 7.95, ease.out);
      pose(cloth0, { x: STOP - 6, y: lerp(G - 420, G + 4, c0), o: c0 > 0.001 ? 1 : 0 });

      // blows — little starbursts, nothing more
      const hits = [[4.2, 4.5, STOP - 10, G - 150], [4.3, 4.55, STOP + 16, G - 120], [7.35, 7.6, STOP - 6, G - 140], ...[0, 2, 4].map((k) => [manyT[k] - 0.1, manyT[k] + 0.1, STOP + 4, G - 124])];
      bursts.forEach((b, i) => {
        const [a, z, x, y] = hits[i];
        const k = bump(t, a, z);
        pose(b, { x, y, s: 0.4 + k * 0.8, r: k * 40, o: k > 0.02 ? k : 0 });
      });
      // v4b — a stone thrown at the second servant's head, a bandage, jeering
      const th = seg(t, 6.05, 6.3);
      pose(stone, { x: lerp(TX[1] + 60, s1.x - 4, th), y: lerp(G - 150, G - 178, th) - Math.sin(th * Math.PI) * 50, r: th * 300, o: t > 6.05 && t < 6.32 ? 1 : 0 });
      const bd = es(t, 6.32, 6.42);
      pose(bandage, { x: s1.x + (s1.flip ? -2 : 2), y: G + 2 - 167, sx: s1.flip ? -1 : 1, r: (s1.flip ? -1 : 1) * (t > 6.5 ? 10 : 0), o: bd * (1 - seg(t, 6.9, 6.95)) });
      laugh.forEach((b, i) => {
        const k = es(t, 6.35 + i * 0.08, 6.5 + i * 0.08, ease.back) * (1 - es(t, 6.85, 6.95));
        pose(b, { x: TX[i * 2] + (i ? 40 : 30), y: G - 206, s: k, r: Math.sin(T * 3 + i) * 4, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.12 + es(t, 0, 1) * 0.03 + es(t, 3.2, 3.8) * 0.02;
      S.cam.y = 40;
      S.cam.x = -10 + es(t, 3.2, 3.8) * 20;
    };
  },
};

