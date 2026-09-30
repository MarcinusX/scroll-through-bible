// Łk 11,21–22 — the parable of the strong man, a painted flat at dusk. The courtyard of a great house, cut away: behind
// a low wall with a barred gate lie the strong man's goods — sacks of grain, jars of oil, rolls of cloth, a chest of
// silver — and in front of the gate he stands guard in full armour, helmet, breastplate, a round shield and a spear;
// a heavy chain hangs across the gate: "his goods are safe". "But when one stronger than he comes and overcomes him":
// the Stronger One comes up the path in light; the strong man lunges with his spear — a flash — and he is down on his
// knees. "He takes away all his armour in which he trusted, and divides his plunder": helmet, shield, spear and
// breastplate fly off him one by one and fall at the Stronger One's feet; the chain drops, the gate opens, and the
// goods are handed out to the poor who come in — a sack to one, a jar to another, a roll of cloth to a third.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, cloud, grass, rock } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { STRONG, EVENING, helmet, spear, shield, armourPlate, sack, jar, linenRoll, chest, coin, addToHead, addToBody, manOf, womanOf, glow, rayBurst, sparkle, handAt, headP, kf, moving, PI } from './lib.js';

const Y = 704;
const GX = 1010;        // the gate
const SX = 880;         // where the strong man stands guard
const JX = 700;         // where the Stronger One stops

export default {
  id: 'lk11-strong',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 21 },
    { v: 22, text: 'Lecz gdy mocniejszy od niego nadejdzie i pokona go,' },
    { v: 22, cont: true, text: 'zabierze całą broń jego, na której polegał, i łupy jego rozda.' },
  ],
  cam: { x: [-40, 60], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, EVENING);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const cl = hanging(hangL, cloud(c, 190, mix(C.cream, C.dusk, 0.35), mix(C.peach, C.duskViolet, 0.4)), { x: 0, y: -1500, len: 900 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(hillsWith(c, { y: 470, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.35), trees: 10, treeColor: mix(C.sage2, C.duskViolet, 0.3), treeH: 18 }).markup);

    /* the house: back wall of the courtyard, the goods, the low front wall and gate */
    const H = S.layer({ par: 0.32, sh: 4 });
    const st = mix(C.stone, C.duskViolet, 0.25);
    const hs = sheet();
    hs.p(c.cut([[930, Y - 20], [930, 420], [1500, 420], [1500, Y - 20]], 0.8, 12), st);
    let bat = '';
    for (let x = 930; x < 1500; x += 36) bat += c.cut(c.rect(x, 400, 22, 22), 0.3, 4);
    hs.p(bat, st);
    hs.p(c.cut([[1000, 420], [1000, 330], [1110, 330], [1110, 420]], 0.6, 8) + c.cut([[990, 330], [1120, 330], [1055, 290]], 0.5, 8), shade(st, -0.05));
    hs.p(c.cut(c.rect(1040, 360, 30, 40), 0.3, 4), C.soilDark);
    let blocks = '';
    for (let y = 440; y < Y; y += 28) for (let x = 936 + ((y / 28) % 2) * 20; x < 1490; x += 44) blocks += c.ribbon([[x, y], [x + 38, y]], 1.1);
    hs.x(blocks, shade(st, -0.2), 'opacity=".5"');
    H.add(hs.out());
    H.add(sheet().p(c.ridge(c.wave(Y - 22, [4, 2], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.duskViolet, 0.2)).p(c.ribbon([[-300, Y + 40], [300, Y + 20], [700, Y + 14], [980, Y + 14]], 50, 2), mix(C.sand, C.dusk, 0.2)).out() + rock(c, 300, Y, 90, 30, C.rock2) + grass(c, { x0: -600, x1: 900, y: Y - 18, n: 22, h: 12, color: C.moss }));
    /* the goods */
    const G = S.layer({ par: 0.34, sh: 4 });
    const GOODS = [
      [1090, Y - 30, sack(c, 50, 64)], [1150, Y - 30, sack(c, 46, 58, C.wheatRobe)], [1210, Y - 30, `<g transform="scale(1.4)">${jar(c, 40, C.pot)}</g>`],
      [1260, Y - 30, `<g transform="scale(1.3)">${jar(c, 40, C.clay)}</g>`], [1320, Y - 40, linenRoll(c, 70)], [1320, Y - 60, `<g>${linenRoll(c, 64).replace(/fill="#fbf5e8"/g, `fill="${C.terracotta}"`)}</g>`],
    ].map(([x, y, m], i) => ({ i, x, y, el: G.add(`<g><g transform="translate(${x} ${y})">${m}</g></g>`) }));
    const ch = chest(c, { w: 80, h: 44 });
    G.add(`<g transform="translate(1390 ${Y - 30})">${ch.box}<g transform="translate(0 -44)">${ch.lid}</g><g transform="translate(-12 -52)">${coin(c)}</g><g transform="translate(10 -54)">${coin(c)}</g></g>`);
    const wallF = S.layer({ par: 0.36, sh: 5 });
    const ws = sheet();
    ws.p(c.cut([[GX + 50, Y + 6], [GX + 50, Y - 70], [1520, Y - 76], [1520, Y + 6]], 0.6, 10) + c.cut([[930, Y + 6], [930, Y - 76], [GX - 50, Y - 72], [GX - 50, Y + 6]], 0.6, 8), mix(C.stone2, C.duskViolet, 0.2));
    ws.p(c.cut(c.rect(GX - 62, Y - 120, 24, 126), 0.4, 6) + c.cut(c.rect(GX + 38, Y - 120, 24, 126), 0.4, 6), shade(st, -0.12));
    wallF.add(ws.out());
    const gateL = wallF.add(`<g>${sheet().p(c.cut(c.rect(0, -104, 44, 104), 0.4, 6), C.wood2).x(c.ribbon([[4, -80], [40, -80]], 3) + c.ribbon([[4, -30], [40, -30]], 3), C.rock3).out()}</g>`);
    const gateR = wallF.add(`<g><g transform="scale(-1 1)">${sheet().p(c.cut(c.rect(0, -104, 44, 104), 0.4, 6), C.wood2).x(c.ribbon([[4, -80], [40, -80]], 3) + c.ribbon([[4, -30], [40, -30]], 3), C.rock3).out()}</g></g>`);
    let links = '';
    for (let i = 0; i < 9; i++) links += c.ribbon(c.arc(-44 + i * 11, 0 + Math.sin(i / 8 * PI) * 12, 6, 4, 0, PI * 2, 8), 2.2);
    const chain = wallF.add(`<g>${sheet().p(links, C.rock3).p(c.cut(c.rect(-8, 6, 16, 14), 0.3, 3), C.ochre).out()}</g>`);

    /* the light of the Stronger One (behind the people), the people */
    const fxB = S.layer({ par: 0.44, sh: 0, flat: true });
    const aura = fxB.add(`<g opacity="0">${glow(170, 1, 'halo-glow')}</g>`);
    const flash = fxB.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 20, r1: 260, spread: 0.06, color: '#fff3cf', o: 0.7 })}</g>`);
    const act = S.layer({ par: 0.45, sh: 5 });
    const armed = (pose_) => addToHead(addToBody(person(c, { ...STRONG, pose: pose_, holdF: `<g transform="rotate(-40)">${spear(c, 190)}</g>`, holdB: `<g transform="translate(4 6)">${shield(c, 28)}</g>` }), armourPlate(c)), `<g transform="translate(0 -6)">${helmet(c, mix(C.rock3, C.storm2, 0.4))}</g>`);
    const guard = S.puppet(act.add(armed('stand')));
    const down = S.puppet(act.add(armed('kneel')));
    const bare = S.puppet(act.add(person(c, { ...STRONG, pose: 'kneel' })));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const PIECES = [`<g transform="scale(1.1)">${helmet(c, mix(C.rock3, C.storm2, 0.4))}</g>`, shield(c, 30), `<g transform="rotate(-80)">${spear(c, 190)}</g>`, `<g transform="translate(0 115)">${armourPlate(c)}</g>`]
      .map((m, i) => ({ i, el: act.add(`<g opacity="0">${m}</g>`) }));
    const POOR = [manOf(c, { robe: mix(C.stone2, C.rock2, 0.4), mantle: null, hairStyle: 'wild', beard: 'full' }), womanOf(c, { robe: mix(C.roseRobe, C.stone2, 0.4), veil: C.stone }), manOf(c, { robe: mix(C.tealRobe, C.stone2, 0.4), mantle: null, hairStyle: 'short', beard: 'short' })]
      .map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))) }));
    const GIVE = [sack(c, 30, 38), jar(c, 30, C.pot), linenRoll(c, 44)].map((m) => act.add(`<g opacity="0">${m}</g>`));
    const safe = act.add(`<g opacity="0">${sparkle(c, 14)}</g>`);

    const JK = [[0.95, 150], [1.35, JX]];

    return (t, time) => {
      const T = time;
      pose(cl, { x: 560 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 230, r: T ? Math.sin(T * 0.6) * 1.1 : 0 });

      /* v21 — he guards his goods in full armour */
      const lunge = bump(t, 1.35, 1.55);
      const beaten = seg(t, 1.52, 1.56);
      guard.set({ x: SX - lunge * 30, y: Y, s: 1.16, flip: true, o: 1 - beaten, armF: 50 + lunge * 50 + (t < 1 ? bump(t, 0.2, 0.6) * 20 : 0), armB: 60, lean: -lunge * 10, head: -2, blink: blinkAt(T, 4) });
      const strip = es(t, 2.05, 2.5);
      down.set({ x: SX + 10, y: Y, s: 1.16, flip: true, o: beaten * (1 - seg(t, 2.05, 2.08)), armF: 20, armB: 10, head: 16, lean: 10, blink: 0.5 });
      bare.set({ x: SX + 10, y: Y, s: 1.16, flip: true, o: seg(t, 2.05, 2.08), armF: 20, armB: 10, head: 18, lean: 12, blink: 0.5 });
      pose(safe, { x: 1250, y: Y - 110, s: bump(t, 0.3, 0.9), r: T * 30, o: bump(t, 0.3, 0.9) });

      /* v22a — the Stronger One comes; a flash; the strong man goes down */
      const jx = kf(t, JK, (u) => ease.sine(u));
      const give = es(t, 2.55, 2.7);
      jesus.set({ x: jx, y: Y + 4, s: 1.08, walk: moving(t, JK) ? jx * 0.055 : undefined, armF: 14 + es(t, 1.35, 1.5) * 70 - es(t, 1.7, 1.9) * 40 + give * 30, armB: 10 + es(t, 1.4, 1.55) * 60 * (1 - es(t, 1.8, 2.0)), head: -2, blink: blinkAt(T, 2) });
      pose(aura, { x: jx, y: Y - 110, o: es(t, 0.9, 1.2) });
      pose(flash, { x: SX - 90, y: Y - 120, s: 0.4 + bump(t, 1.45, 1.75) * 0.8, r: T * 10, o: bump(t, 1.45, 1.75) });

      /* v22b — his armour is taken off him and falls at the Stronger One's feet */
      const [hx, hy] = headP(SX + 10, Y, 1.16, true, 'kneel');
      const FROM = [[hx, hy - 10], [SX + 40, Y - 110], [SX - 40, Y - 120], [SX + 10, Y - 170]];
      const TO = [[JX + 70, Y + 2], [JX + 110, Y - 12], [JX + 140, Y - 6], [JX + 100, Y - 30]];
      PIECES.forEach((p) => {
        const a = 2.05 + p.i * 0.08;
        const k = es(t, a, a + 0.2);
        const [x0, y0] = FROM[p.i], [x1, y1] = TO[p.i];
        pose(p.el, { x: lerp(x0, x1, k), y: lerp(y0, y1, k) - Math.sin(k * PI) * 80, r: k * (p.i % 2 ? 200 : -160) * (1 - k) + (p.i === 2 ? k * 70 : 0), o: seg(t, a - 0.02, a) });
      });
      /* the chain drops, the gate opens, the goods are handed out */
      const cd = es(t, 2.4, 2.5, ease.in);
      pose(chain, { x: GX, y: Y - 60 + cd * 58, r: cd * 20, o: 1 - es(t, 2.55, 2.6) });
      const open = es(t, 2.45, 2.58);
      pose(gateL, { x: GX - 44, y: Y, sx: 1 - open * 0.8 });
      pose(gateR, { x: GX + 44, y: Y, sx: 1 - open * 0.8 });
      POOR.forEach((m) => {
        const K = [[2.3 + m.i * 0.05, 280 - m.i * 60], [2.62 + m.i * 0.05, 470 + m.i * 64]];
        const x = kf(t, K);
        const got = es(t, 2.7 + m.i * 0.06, 2.8 + m.i * 0.06);
        m.p.set({ x, y: Y + 14 + (m.i % 2) * 8, s: 0.92, o: es(t, 2.2, 2.3), walk: moving(t, K) ? x * 0.06 + m.i : undefined, armF: 30 + got * 50, armB: 10 + got * 40, head: -4, blink: blinkAt(T, 6 + m.i) });
      });
      GIVE.forEach((g, i) => {
        const k = es(t, 2.62 + i * 0.06, 2.78 + i * 0.06);
        const [rx, ry] = handAt(470 + i * 64, Y + 14 + (i % 2) * 8, 0.92, false, 80);
        const [x0, y0] = [[1090, Y - 60], [1210, Y - 60], [1320, Y - 50]][i];
        pose(g, { x: lerp(x0, rx + 8, k), y: lerp(y0, ry - 4, k) - Math.sin(k * PI) * 160, r: k * 360 * (1 - k), o: k > 0 ? 1 : 0 });
        pose(GOODS[[0, 2, 4][i]].el, { x: 0, y: 0, o: k > 0 ? 0 : 1 });
      });

      S.cam.x = kf(t, [[-0.5, 50], [0.9, 50], [1.3, 0], [2.4, 0], [2.7, -30]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [0.9, 1.12], [1.3, 1.08], [2.4, 1.08], [2.7, 1.04]]);
      S.cam.y = kf(t, [[-0.5, 30], [1.3, 40], [2.7, 30]]);
    };
  },
};
