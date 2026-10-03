// Łk 19,1–2 — Jericho, the city of palms, in the heat of the oasis: its walls far back on the left, a street of
// flat-roofed houses and the road through the town. Jesus comes in through the town with His disciples and a crowd
// behind Him, passing through. Along the street, at his booth under a striped awning, stands a small man on a stool
// behind the counter — a ruddy mantle, a gold-banded turban — weighing silver: coins in stacks, a strongbox, a clerk
// at his side. A tag drops on its string over him: Zacchaeus, chief of the tax collectors — and the stacks rise, the
// chest spills over: he was very rich.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { jerichoSet, JR, ZACC, ZS, CLERK, TWELVE, still, folk, coinStack, coin, coinScale, ledger, nameTag, sparkle, headAt, hand, kf, moving, tr, es, ease, bump, seg, mix, shade, sheet } from './lib.js';

const GY = JR.GY, BX = 1070, WALK = GY + 24;

export default {
  id: 'lk19-jericho',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
  ],
  cam: { x: [-640, 520], y: [0, 90], z: [1, 1.44] },
  build(S) {
    const J = jerichoSet(S, { booth: BX, sunAt: [1280, 150] });
    const c = S.c;

    /* the booth: Zacchaeus on his stool behind the counter, his clerk; the silver on the counter */
    const bL = S.layer({ par: 0.4, sh: 5 });
    const zac = S.puppet(bL.add(person(c, ZACC)));
    const clerk = S.puppet(bL.add(person(c, { ...CLERK, holdF: `<g transform="translate(0 6) rotate(90)">${ledger(c, 44)}</g>` })));
    const front = J.boothFront(bL);
    void front;
    const TOP = GY - 20 - 96;
    const stacks = [[-92, 5], [-70, 7], [-48, 4], [56, 6], [78, 8], [100, 5]].map(([dx, n], i) => ({ i, dx, el: bL.add(`<g>${coinStack(c, n, 9)}</g>`) }));
    const scale = bL.add(`<g>${coinScale(c)}</g>`);
    const chest = bL.add(`<g>${chestM(c)}</g>`);
    const spill = Array.from({ length: 8 }, (_, i) => ({ i, el: bL.add(`<g>${coin(c, 7)}</g>`), dx: -40 + i * 11 + c.rr(-3, 3), dy: c.rr(-6, 4) }));
    const tag = bL.add(`<g>${nameTag(c, tr(['Zacheusz', 'zwierzchnik celników'], ['Zacchaeus', 'chief tax collector']), { size: 17 })}</g>`);
    const shine = [0, 1, 2].map(() => bL.add(`<g opacity="0">${sparkle(c, 9)}</g>`));

    /* Jesus, four disciples, and the crowd that follows through the town */
    const crowdL = J.crowdL;
    const folkM = still(c, Array.from({ length: 9 }, (_, i) => ({ x: -i * 46 - (i % 2) * 10, y: (i % 3) * 8, s: 0.82 - (i % 3) * 0.03, flip: false, armF: (i % 4) * 10, o: folk(c) })));
    const crowd = crowdL.sprite(folkM, 0, WALK - 22);
    const DIS = [0, 3, 1, 2].map((k, i) => ({ i, p: S.puppet(J.act.add(person(c, TWELVE[k].o))), dx: -70 - i * 54, dy: (i % 2) * 10 - 6 }));
    const jesus = S.puppet(J.act.add(person(c, CAST.jesus)));
    // townsfolk along the street who turn to look
    const side = [[380, GY - 40, 0], [S.portrait ? 740 : 820, GY - 42, 1], [S.portrait ? 1420 : 1330, GY - 40, 2]].map(([x, y, i]) => ({ x, y, i, p: S.puppet(J.crowdL.add(person(c, { ...folk(c, i !== 1), veil: [C.skyVeil, C.blushVeil, C.stone][i], veil2: undefined }))) }));

    return (t, time) => {
      const T = time;
      J.update(T);
      /* v1 — He enters Jericho and passes through the town */
      const JK = [[0, -120], [1.0, -60], [1.9, 520], [2.2, 580], [2.9, 690]];
      const jx = kf(t, JK, (x) => x);
      const walking = t < 2.9;
      jesus.set({ x: jx, y: WALK, s: 1.0, walk: walking ? jx * 0.055 : undefined, armF: 14, head: -es(t, 2.3, 2.6) * 2, blink: blinkAt(T) });
      DIS.forEach((d) => { const x = jx + d.dx; d.p.set({ x, y: WALK + d.dy - 8, s: 0.9, walk: walking ? x * 0.055 + d.i : undefined, blink: blinkAt(T, d.i + 2) }); });
      crowd.set({ x: jx - 300, y: WALK - 30 });
      side.forEach((m) => {
        const look = es(t, 1.0 + m.i * 0.25, 1.3 + m.i * 0.25);
        // phone: the woman in the middle stands clear of the thread while He passes, then steps along as the camera turns to the booth
        const mv = S.portrait && m.i === 1 ? es(t, 1.95, 2.4) : 0;
        const mx = m.x + mv * 110;
        m.p.set({ x: mx, y: m.y, s: 0.78, flip: mv > 0 && mv < 1 ? false : jx < m.x, walk: mv > 0 && mv < 1 ? mx * 0.06 : undefined, armF: look * 30, armB: m.i === 1 ? look * 60 : 0, head: look * 4, blink: blinkAt(T, m.i + 7) });
      });

      /* v2 — Zacchaeus, chief tax collector, very rich */
      const turn = es(t, 2.55, 2.75);
      const weigh = bump(t, 2.05, 2.5);
      zac.set({ x: BX - 20, y: GY - 44, s: ZS, flip: turn > 0.5, armF: 60 + weigh * 20 + turn * 10, armB: 20 + weigh * 40, head: -4 - turn * 6, blink: blinkAt(T, 3) });
      clerk.set({ x: BX + 86, y: GY - 22, s: 0.9, flip: true, armF: 70, armB: 10, head: 8, blink: blinkAt(T, 5) });
      const rich = es(t, 2.2, 2.55, ease.back);
      stacks.forEach((st) => pose(st.el, { x: BX + st.dx, y: TOP, sy: 0.4 + rich * (0.6 + (st.i % 3) * 0.25), s: 1 }));
      pose(scale, { x: BX + 20, y: TOP, r: Math.sin(weigh * PI2) * 4 });
      pose(chest, { x: BX + 160, y: GY + 10, s: 1 });
      spill.forEach((s) => { const k = es(t, 2.25 + s.i * 0.03, 2.45 + s.i * 0.03, ease.back); pose(s.el, { x: BX + 160 + s.dx * 0.9, y: GY - 40 + s.dy - k * 12, o: k > 0.02 ? 1 : 0, s: k }); });
      const drop = es(t, 2.02, 2.3, ease.back);
      pose(tag, { x: BX - 20, y: lerp(-900, 330, drop), r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: drop > 0.01 ? 1 : 0 });
      shine.forEach((e, i) => { const k = bump(t, 2.35 + i * 0.1, 2.9 + i * 0.1); pose(e, { x: BX - 80 + i * 90, y: TOP - 40 - i * 10, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 }); });

      // the camera walks with Him (His place a little left of centre), then turns to the booth
      const follow = Math.max(-620, (jx + 150 - 800) / 0.48);
      S.cam.x = lerp(follow, 420, es(t, 1.95, 2.4));
      S.cam.y = kf(t, [[0, 30], [1.0, 40], [2.2, 90]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.04], [1.9, 1.08], [2.4, 1.44]]);
      if (S.portrait) { S.cam.x = lerp(Math.max(-620, (jx + 40 - 800) / 0.48), 520, es(t, 1.95, 2.4)); S.cam.z = kf(t, [[1.9, 1.0], [2.35, 1.3]]); }
      void hand; void headAt; void moving; void seg; void mix; void shade; void sheet;
    };
  },
};
const PI2 = Math.PI * 2;
/** an open strongbox brimming with silver (origin: bottom centre) */
function chestM(c) {
  const s = sheet();
  s.p(c.cut([[-46, 0], [-46, -44], [46, -44], [46, 0]], 0.4, 6), C.wood2);
  s.p(c.cut([[-46, -44], [-40, -76], [40, -76], [46, -44]], 0.4, 6), shade(C.wood2, -0.2));
  s.p(c.cut(c.blob(0, -48, 40, 10, 12, 0.3), 0.4, 4), mix(C.sun, C.linen, 0.3));
  s.x(c.ribbon([[-46, -22], [46, -22]], 4) + c.ribbon([[-46, -38], [46, -38]], 3), C.ochre, 'opacity=".8"');
  s.p(c.cut(c.rect(-6, -30, 12, 12), 0.2, 3), C.sun);
  return s.out();
}
