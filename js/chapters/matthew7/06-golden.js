// Mt 7,12 — a painted flat of the village well in the warm afternoon. A woman draws water and, thinking of how she
// would long for a drink on the road, gives a cup to a tired traveller; a golden loop is drawn round the two of
// them. Refreshed, he gets up and lifts her full jar onto her shoulder. "This is the Law and the Prophets": two
// scrolls come down on their strings, and golden threads run from them into the loop.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, grass, flowers, olive, cypress, bush, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { WARMDAY, womanOf, traveller, handAt, well, hydria, cupJ, bucketRope, thought, goldLoop, goldThread, drawRing, hangScroll, glowDisc, storyFrame, tr, PI } from './lib.js';

const GY = 726;
const WX = 640, BX = 956, KX = 792;     // the woman, the traveller, the well
const LC = [800, 590];                   // the loop's centre

export default {
  id: 'mt7-golden',
  enter: 'fly',
  beats: [
    { v: 12, text: 'Wszystko więc, co byście chcieli, żeby wam ludzie czynili, i wy im czyńcie!' },
    { v: 12, cont: true, text: 'Albowiem na tym polega Prawo i Prorocy.' },
  ],
  cam: { x: [-20, 20], y: [-30, 80], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    sky(S, WARMDAY);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1230, y: 160, len: 700 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, C.peach), { x: 620, y: 140, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.18) }).markup);
    const hills = S.layer({ par: 0.16, sh: 3 });
    hills.add(hillsWith(c, { y: 520, amps: [12, 5, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.sand, 0.25), trees: 16, treeColor: C.sage, treeH: 22, houses: 6, houseColor: C.plaster }).markup);

    const ground = S.layer({ par: 0.36, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(640, [5, 2], [700, 200]), -900, 2500, 1700, 12, 1), mix(C.sand, C.sage3, 0.3)).out());
    ground.add(olive(c, 280, 660, 1.1) + cypress(c, 1350, 650, 150) + olive(c, 1500, 660, 0.9) + grass(c, { x0: -600, x1: 2200, y: 640, n: 40, h: 12, color: C.olive }));

    /* the well, its rope and bucket */
    const wellL = S.layer({ par: 0.44, sh: 4 });
    wellL.add(`<g transform="translate(${KX} ${GY - 20}) scale(1.1)">${well(c)}</g>`);
    const ropeEl = wellL.add(`<path d="${c.ribbon([[0, 0], [0.5, 100]], 2.2)}" fill="${C.rope}"/>`);
    const bucket = wellL.add(`<g>${bucketRope(c)}</g>`);
    wellL.add(`<g transform="translate(${BX + 10} ${GY + 4})">${rock(c, 0, 0, 110, 48, C.rock2)}</g>`);

    /* the loop (behind the two of them) and its glow */
    const loopL = S.layer({ par: 0.46, sh: 2 });
    const glow = loopL.add(`<g>${glowDisc(280, 'halo-glow', 1)}</g>`);
    const loop = loopL.add(`<g>${goldLoop(c, 250, 170, 8, 30)}</g>`);

    /* the woman and the traveller */
    const act = S.layer({ par: 0.5, sh: 5 });
    const WO = womanOf(c, { robe: C.roseRobe, mantle: C.wheatRobe, veil: C.skyVeil });
    const woman = S.puppet(act.add(person(c, WO)));
    const TO = traveller(c, { robe: C.dustyBlue, mantle: C.clayMantle, holdF: '', holdB: '' });
    const tSit = S.puppet(act.add(person(c, { ...TO, pose: 'sit' })));
    const tSt = S.puppet(act.add(person(c, TO)));
    const jar = act.add(`<g>${hydria(c, { col: C.pot })}</g>`);
    const cup = act.add(`<g>${cupJ(c)}</g>`);
    const pour = act.add(`<path d="${c.ribbon([[0, 0], [2, 34]], 4)}" fill="${C.lake}"/>`);

    /* what she thinks: herself, thirsty on the road, given a cup */
    const fly = S.layer({ par: 0.5, sh: 6 });
    const self = `<g transform="translate(-12 22) scale(.26)">${person(c, { ...WO, pose: 'kneel' })}</g><g transform="translate(18 -2) scale(.6) rotate(-20)">${cupJ(c)}</g>`;
    const think = fly.add(`<g>${thought(c, self, { w: 92, h: 72 })}</g>`);

    /* the Law and the Prophets, and their golden threads */
    // phone: the Law and the Prophets hang just above the loop instead of at the far edges
    const SCX = S.portrait ? [598, 990] : [440, 1160];
    const scrolls = [[SCX[0], tr('Prawo', 'The Law')], [SCX[1], tr('Prorocy', 'The Prophets')]].map(([x, t], i) => ({ x, i, el: fly.add(`<g>${hangScroll(c, t, 5, { w: 150, h: 190, size: 24 })}</g>`) }));
    const threads = S.portrait ? [
      fly.add(`<g>${goldThread(c, [[598, 446], [588, 476], [576, 506], [564, 534]], 5)}</g>`),
      fly.add(`<g>${goldThread(c, [[990, 446], [1006, 476], [1022, 506], [1036, 534]], 5)}</g>`),
    ] : [
      fly.add(`<g>${goldThread(c, [[440, 470], [470, 510], [510, 548], [552, 578]], 5)}</g>`),
      fly.add(`<g>${goldThread(c, [[1160, 470], [1130, 510], [1090, 548], [1048, 578]], 5)}</g>`),
    ];

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 100, 990, 240, C.moss, C.sage) + bush(c, 1520, 990, 260, C.sage, C.moss) + flowers(c, { x0: -200, x1: 1800, y: 930, n: 20, h: 26 }));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 160, T, 1, 0.6);
      swing(cl, 620 + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6, 1);

      /* v12a — the bucket comes up, she fills the cup and gives it; he drinks */
      const haul = es(t, 0.06, 0.28);
      const tip = bump(t, 0.28, 0.44);
      const give = es(t, 0.42, 0.6);
      const drink = es(t, 0.62, 0.74) * (1 - es(t, 0.9, 1.0));
      const beamY = GY - 20 - (48 + 108) * 1.1;
      const bY = lerp(GY - 20 - 48 * 1.1 + 40, beamY + 34, haul);
      pose(ropeEl, { x: KX, y: beamY, sy: (bY - beamY) / 100 });
      pose(bucket, { x: KX - tip * 30, y: bY, r: -tip * 50 });
      const wArmF = 30 + haul * 60 * (1 - es(t, 0.3, 0.4)) + es(t, 0.3, 0.42) * 30 + give * 40 * (1 - es(t, 0.64, 0.76));
      // v12b: he lifts her jar onto her shoulder
      const standT = seg(t, 1.04, 1.1);
      const lift = es(t, 1.12, 1.4);
      const carry = es(t, 1.4, 1.62);
      const onShoulder = es(t, 1.6, 1.7);
      woman.set({ x: WX, y: GY, s: 1.08, armF: wArmF - onShoulder * 30, armB: 10 + onShoulder * 150, head: -haul * 4 + give * 4 - onShoulder * 4, blink: blinkAt(T, 2) });
      const [wx, wy] = handAt(WX, GY, 1.08, false, wArmF);
      const [tx0, ty0] = handAt(BX, GY, 1.04, true, 40 + give * 30 + drink * 50, 0, 62);
      pose(cup, { x: give > 0 ? lerp(wx, tx0, give) : wx, y: give > 0 ? lerp(wy, ty0, give) - Math.sin(give * PI) * 20 : wy, r: drink * -40, o: seg(t, 0.26, 0.3) * (1 - es(t, 0.95, 1.0)) });
      pose(pour, { x: KX - 34, y: bY - 6, o: tip > 0.3 ? 1 : 0 });
      const tx = lerp(BX, 820, carry);
      tSit.set({ x: BX, y: GY, s: 1.04, flip: true, armF: 40 + give * 30 + drink * 50, armB: 10 + drink * 20, head: 10 - give * 6 - drink * 16, o: 1 - standT, blink: blinkAt(T, 4) });
      tSt.set({ x: tx, y: GY, s: 1.04, flip: true, walk: carry > 0 && carry < 1 ? tx * 0.05 : undefined, armF: 30 + lift * 100 - onShoulder * 80, armB: 20 + lift * 110 - onShoulder * 90, head: -lift * 6, o: standT, blink: blinkAt(T, 4) });
      // the jar: at the rock → in his hands → on her shoulder
      const [jx, jy] = handAt(tx, GY, 1.04, true, 30 + lift * 100);
      const shoulder = { x: WX - 20 * 1.08, y: GY - 146 * 1.08, s: 1.08 * 0.78, r: -10 };
      const onHands = seg(t, 1.12, 1.16);
      const jarX = onShoulder > 0 ? lerp(jx, shoulder.x, onShoulder) : onHands ? jx : 880;
      const jarY = onShoulder > 0 ? lerp(jy + 40, shoulder.y, onShoulder) : onHands ? jy + 40 : GY - 10;
      pose(jar, { x: jarX, y: jarY, s: onShoulder > 0 ? lerp(1, shoulder.s, onShoulder) : 1, r: onShoulder * shoulder.r });

      const tk = es(t, 0.08, 0.24, ease.back) * (1 - es(t, 0.5, 0.62));
      pose(think, { x: WX + 20, y: GY - 230, s: tk, o: tk > 0.01 ? 1 : 0 });

      /* the golden loop round them both */
      const lk = es(t, 0.5, 0.72);
      drawRing(loop, lk);
      pose(loop, { x: LC[0], y: LC[1], r: time ? Math.sin(T * 0.3) * 2 : 0, o: seg(t, 0.5, 0.52) });
      const gk = lk * 0.5 + es(t, 1.4, 1.7) * 0.5;
      pose(glow, { x: LC[0], y: LC[1], s: 0.8 + gk * 0.3, o: gk });

      /* v12b — the Law and the Prophets */
      scrolls.forEach((sc) => {
        const k = es(t, 1.04 + sc.i * 0.08, 1.3 + sc.i * 0.08, ease.out);
        pose(sc.el, { x: sc.x, y: lerp(-600, 250, k), r: Math.sin(T * 0.8 + sc.i) * 1, o: k > 0.01 ? 1 : 0 });
      });
      threads.forEach((th, i) => drawRing(th, es(t, 1.36 + i * 0.05, 1.62 + i * 0.05)));

      S.cam.z = 1.24 - es(t, 0.95, 1.2) * 0.2;
      S.cam.y = 70 - es(t, 0.95, 1.2) * 60;
    };
  },
};
