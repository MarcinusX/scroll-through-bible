// Łk 20,18–19 — "Everyone who falls on that stone will be broken to pieces; and on whom it falls, it will crush him":
// a painted panel with the great stone lying on the ground; a clay jar tumbles onto it and flies apart in sherds; then
// the stone is lifted and drops onto a clay jug, which is ground to dust. "At that very hour the scribes and the chief
// priests sought to lay hands on Him, but they feared the people": the three step towards Him with their hands out —
// and the people press in round Him from both sides, arms up; the three stop, glance round and draw their hands back.
// "For they perceived that He had told this parable against them": an oval mirror comes down in front of them, and in
// the glass are the three wicked tenants of the vineyard; they lean back from it.
import { C, blinkAt, pose, lerp, sheet, mix, shade } from '../kit.js';
import { courtSet, CQ, panel, panelSky, panelGround, stoneBlock, clayJar, sherd, dustPuff, mirror, figure, TENANT, bang, popAt, dropIn, kf, tr, es, ease, bump, seg, PI } from './lib.js';

const PW = 360, PH = 200, PX = 800, PY = 300;
const GY = 66;           // panel ground (panel coords)
const SX0 = -70, SX1 = 80;

export default {
  id: 'lk20-stone',
  beats: [
    { v: 18 },
    { v: 19, text: 'W tej samej godzinie uczeni w Piśmie i arcykapłani chcieli koniecznie dostać Go w swoje ręce, lecz bali się ludu.' },
    { v: 19, cont: true, text: 'Zrozumieli bowiem, że przeciwko nim skierował tę przypowieść.' },
  ],
  cam: { x: [-20, 60], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const Q = courtSet(S);
    const c = Q.c;
    let m = panelSky(S, PW, PH, ['#d8dcd2', '#f3e2c2']);
    m += sheet().p(c.cut([[-PW / 2 - 10, 20], [-40, 4], [90, 14], [PW / 2 + 10, 0], [PW / 2 + 10, 60], [-PW / 2 - 10, 60]], 0.8, 10), mix(C.hillMid, C.sand, 0.3)).out();
    m += panelGround(c, PW, GY, mix(C.sand, C.dune, 0.3), 2);
    const pan = Q.flyL.add(panel(S, m, { w: PW, h: PH, word: tr('ten kamień', 'that stone') }));
    const jar = Q.flyL.add(`<g>${clayJar(c, 50, 0)}</g>`);
    const sherds = [0, 1, 2, 3, 4].map((i) => ({ i, el: Q.flyL.add(`<g>${sherd(c, 7 + (i % 3) * 2)}</g>`) }));
    const jug = Q.flyL.add(`<g>${clayJar(c, 46, 1, mix(C.pot, C.clay, 0.5))}</g>`);
    const rope = Q.flyL.add(`<path d="M0 -1600V-20" stroke="rgba(74,54,34,.6)" stroke-width="1.6" fill="none"/>`);
    const stone = Q.flyL.add(`<g>${stoneBlock(c, 84, 50, mix(C.rock2, C.stone2, 0.4))}</g>`);
    const puffs = [0, 1, 2, 3].map((i) => ({ i, el: Q.flyL.add(`<g>${dustPuff(c, 18 + i * 4, mix(C.pot, C.sand2, 0.5))}</g>`) }));
    const tenants = [0, 1, 2].map((i) => figure(c, TENANT[i], { x: (i - 1) * 56, y: 118, s: 0.62, flip: i === 2, armF: 20, head: i === 1 ? -6 : 4 })).join('');
    const mir = Q.flyL.add(`<g>${mirror(c, S.id('mir'), `<rect x="-120" y="-90" width="240" height="180" fill="${mix(C.hillMid, C.sand, 0.4)}"/>${tenants}`)}</g>`);
    const bangs = [0, 1].map(() => Q.W.add(`<g opacity="0">${bang(c, 34)}</g>`));

    return (t, time) => {
      const T = time;
      /* v18 — broken on the stone; crushed under it */
      const pk = dropIn(pan, t, 0.0, 1.1, PX, PY, { d: 0.12 });
      const py = lerp(-1500, PY, pk);
      const on = pk > 0.98 ? 1 : 0;
      const fall = es(t, 0.14, 0.28, ease.in);
      const smash = seg(t, 0.28, 0.3);
      pose(jar, { x: PX + SX0, y: py + lerp(-110, GY - 50, fall), r: fall * 30, o: on * (1 - smash) });
      sherds.forEach((s) => {
        const u = seg(t, 0.29, 0.5);
        const a = PI * (1.1 + s.i * 0.2);
        pose(s.el, { x: PX + SX0 + Math.cos(a) * u * (50 + s.i * 8), y: py + GY - 50 - Math.sin(a) * u * 40 * (1 - u) * 3 + u * (s.i % 2 ? 44 : 38), r: u * (200 + s.i * 40), o: on * (smash > 0 ? 1 : 0) });
      });
      const lift = es(t, 0.42, 0.56), over = es(t, 0.56, 0.66), drop = es(t, 0.66, 0.72, ease.in);
      const sx = lerp(SX0, SX1, over), sy = lerp(GY - 25, -40, lift) + drop * (GY - 25 + 40) - (drop > 0 ? 0 : 0);
      pose(stone, { x: PX + sx, y: py + (drop > 0 ? lerp(-40, GY - 25, drop) : sy), r: over * 8 - drop * 8, o: on });
      pose(rope, { x: PX + sx, y: py + (drop > 0 ? lerp(-40, GY - 25, drop) : sy) - 25, o: on * (lift > 0 && drop < 0.05 ? 1 : 0) });
      const crush = seg(t, 0.71, 0.73);
      pose(jug, { x: PX + SX1, y: py + GY, o: on * (1 - crush) });
      puffs.forEach((p) => {
        const u = seg(t, 0.72, 1.0);
        pose(p.el, { x: PX + SX1 + (p.i - 1.5) * (34 + u * 40), y: py + GY - 12 - u * (10 + p.i * 6), s: 0.6 + u * 0.8, o: on * (crush > 0 ? 1 - u * 0.6 : 0) });
      });

      /* v19a — they reach for Him; the people press in; they hold back */
      const reach = es(t, 1.08, 1.3) * (1 - es(t, 1.55, 1.8) * 0.6);
      const press = es(t, 1.28, 1.5);
      const hold = es(t, 1.5, 1.68);
      /* v19b — the mirror */
      const mk = dropIn(mir, t, 2.05, undefined, S.portrait ? 1000 : 1070, 330, { T, d: 0.28 });
      const recoil = es(t, 2.3, 2.45);
      Q.pose(t, T,
        { armF: 16 + (1 - press) * 30, armB: 8, head: reach * 4, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x + press * 40, head: -4, armF: 10 + press * 30, blink: blinkAt(T, d.seed) }),
        (m) => ({
          x: m.x - reach * [70, 50, 40][m.i] + recoil * 16, flip: !(hold > 0.4 && recoil < 0.5), walk: reach > 0.02 && reach < 0.98 ? m.x * 0.05 + t * 20 : undefined,
          armF: 8 + reach * 80 * (1 - hold) + hold * 40 + recoil * 20, armB: 4 + reach * 50 * (1 - hold) + hold * 70 + recoil * 20, head: -hold * 8 * (1 - recoil) + recoil * 12, lean: recoil * 8, blink: blinkAt(T, m.seed),
        }));
      Q.amaze(press * (1 - es(t, 2.2, 2.5) * 0.7));
      Q.CROWD.forEach((g, i) => { const dx = (i ? -1 : 1) * press * 60; g.calm.set({ x: g.x + dx, o: g.calm.o }); g.wow.set({ x: g.x + dx, o: g.wow.o }); });
      bangs.forEach((el, i) => popAt(el, t, 2.32 + i * 0.06, undefined, S.portrait ? 940 + i * 130 : 1000 + i * 150, 460, { d: 0.08 }));
      void mk;

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.3, 20], [2.0, 30], [2.3, 50]]);
      S.cam.y = kf(t, [[0, -40], [1.0, -40], [1.3, 0], [2.0, 0], [2.3, -20]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.04], [1.3, 1.06], [2.3, 1.08]]);
      void shade; void CQ; void bump;
    };
  },
};
