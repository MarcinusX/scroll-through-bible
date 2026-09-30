// Łk 17,26–27 — a painted flat flies in: a wide green plain on a warm afternoon; on the rise at the right stands
// Noah's great ark with its ramp, and at the left a wedding feast under a garlanded canopy. "As it was in the days of
// Noah, even so will it be also in the days of the Son of Man": a name board, "Noah", comes down; the old man knocks
// the last pegs into his ark. "They ate, they drank, they married, they were given in marriage, until the day that
// Noah entered into the ship": at the long table they eat and lift their cups, the bridegroom takes his bride's hand;
// and the animals go up the ramp two by two, Noah follows them in, and the door swings shut. "And the flood came, and
// destroyed them all": the sky turns to storm, the rain comes down, and the water rises and rises over the plain and
// the feast until nothing is left of them but waves — only the ark lifts and floats.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, olive, cypress, grass, flowers, waveStrip, palm } from '../../assets/nature.js';
import { rain, stormCloud } from '../../assets/things.js';
import { NOAH, ark, ramp, beast, figure, manO, womanO, strung, flyIn, cup, halo, kf, es, ease, bump, seg, tr, PI, STORM } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const GY = 704;
const ARK = [1010, 606];
const RAMP0 = [870, 706];
const CAN = 470;                  // the wedding canopy
const TAB = [600, 760];           // the long table

function boardText(c, text) {
  const w = 30 + text.length * 14;
  const s = sheet().p(c.cut([[-w / 2, 0], [w / 2, -2], [w / 2 + 3, 46], [-w / 2 - 2, 48]], 0.5, 6), mix(C.wood3, C.sand, 0.3)).p(c.cut([[-w / 2 + 6, 6], [w / 2 - 6, 4], [w / 2 - 4, 40], [-w / 2 + 5, 42]], 0.3, 6), C.parchment);
  return `${s.out()}<text x="0" y="33" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="26" font-style="italic" fill="${C.ink}">${text}</text>`;
}

export default {
  id: 'lk17-noah',
  enter: 'fly',
  beats: [
    { v: 26 },
    { v: 27, text: 'jedli i pili, żenili się i za mąż wychodziły aż do dnia, kiedy Noe wszedł do arki;' },
    { v: 27, cont: true, text: 'nagle przyszedł potop i wygubił wszystkich.' },
  ],
  cam: { x: [-60, 100], y: [-60, 40], z: [0.98, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#cadfd9', '#f0e6c8', '#f7e6c4']);
    const storm = sky(S, STORM, { name: 'storm', rise: 0 });
    storm.layer.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 140, len: 800 });
    const stormL = S.layer({ par: 0.05, sh: 4 });
    const clouds = [[420, 200, 420], [900, 170, 480], [1300, 210, 380]].map(([x, y, w], i) => ({ x, y, i, el: stormL.add(`<g transform="translate(0 -1500)">${strung(stormCloud(c, w), 0, 2400, [-w * 0.3, w * 0.3])}</g>`) }));
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [16, 6, 3], lens: [1000, 360, 130], color: C.hillFar }).markup);
    const mid = S.layer({ par: 0.18, sh: 3 });
    mid.add(hillsWith(c, { y: 530, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 18 }).markup);
    const G = S.layer({ par: 0.34, sh: 3 });
    const gfn = (x) => 620 + Math.sin(x * 0.005) * 6 - Math.max(0, 260 - Math.abs(x - 1100)) * 0.1;
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sand, 0.25)).out() + grass(c, { x0: -800, x1: 2400, y: 624, fn: gfn, n: 34, h: 13, color: C.moss }) + flowers(c, { x0: -600, x1: 800, y: 624, fn: gfn, n: 12, h: 14 }) + olive(c, 180, gfn(180) + 12, 0.9) + palm(c, 1420, gfn(1420) + 8, 190));
    /* the feast: the canopy, the table, the guests (one cut-out, and a second with their cups raised), the couple */
    const act = S.layer({ par: 0.42, sh: 5 });
    const pc = makeCutter('lk17-feast');
    const can = sheet();
    can.p(pc.cut(pc.rect(CAN - 70, GY - 200, 7, 200), 0.3, 6) + pc.cut(pc.rect(CAN + 63, GY - 200, 7, 200), 0.3, 6), C.wood2);
    can.p(pc.cut([[CAN - 90, GY - 196], [CAN - 60, GY - 226], [CAN + 60, GY - 226], [CAN + 90, GY - 196]], 0.6, 8), C.roseRobe);
    let sc = '';
    for (let x = CAN - 86; x < CAN + 86; x += 22) sc += pc.cut(pc.arc(x + 11, GY - 196, 11, 9, 0, PI, 6), 0.2, 3);
    can.p(sc, C.sun);
    act.add(can.out());
    const guestsAt = [[TAB[0] + 10, 0], [TAB[0] + 70, 1], [TAB[0] + 130, 2], [TAB[0] + 190, 3], [TAB[0] + 250, 4]];
    const G1 = guestsAt.map(([x, i]) => ({ x, i, o: { ...(i % 2 ? womanO(pc) : manO(pc)), pose: 'sit' } }));
    const tableM = sheet().p(pc.cut(pc.rect(TAB[0] - 20, GY - 44, TAB[1] - TAB[0] + 60, 10), 0.3, 6), C.wood).p(pc.cut(pc.rect(TAB[0] - 10, GY - 34, 8, 34), 0.2, 4) + pc.cut(pc.rect(TAB[1] + 22, GY - 34, 8, 34), 0.2, 4), C.wood2).out();
    const guests = (raise) => G1.map((g) => figure(pc, { ...g.o, holdF: `<g transform="rotate(${raise ? 110 : 60}) translate(0 16)">${cup(pc)}</g>` }, { x: g.x, y: GY + 18, s: 0.84, flip: g.i === 4, armF: raise ? 110 : 60, armB: 10, head: raise ? -8 : 0 })).join('') + tableM;
    const feastA = act.add(`<g>${guests(false)}</g>`);
    const feastB = act.add(`<g>${guests(true)}</g>`);
    const groom = S.puppet(act.add(person(pc, { robe: C.linen, mantle: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun })));
    const bride = S.puppet(act.add(person(pc, { robe: C.linen2, hairStyle: 'veil', veil: C.cream, veil2: C.roseRobe, hair: C.hair3, skin: C.skin, beard: 'none', belt: C.roseRobe })));
    /* the rain, the rising water, the waves at the front */
    const rainL = S.layer({ par: 0.3, sh: 0, flat: true, pad: 400 });
    rainL.add(rain(c, { x0: -900, x1: 2500, y0: -800, y1: 1400, n: 260, slant: -30, color: '#dfe6f0' }));
    rainL.fade(0);
    const water = S.layer({ par: 0.42, sh: 3, pad: 800 });
    water.add(waveStrip(c, { y: 470, len: 140, amp: 12, color: mix(C.lake2, C.storm, 0.35), bottom: 1800 }));
    /* the ark, the ramp, the animals, Noah */
    const arkL = S.layer({ par: 0.42, sh: 5 });
    const A = ark(c, 360);
    const arkEl = arkL.add(`<g>${A.body}<g class="door" transform="translate(${A.doorAt[0]} ${A.doorAt[1]})">${A.door}</g></g>`);
    const door = arkEl.querySelector('.door');
    const doorTop = [ARK[0] + A.doorAt[0] + 18, ARK[1] + A.doorAt[1]];
    const rampEl = arkL.add(`<g><g transform="translate(${RAMP0[0]} ${RAMP0[1]})">${ramp(c, doorTop[0] - RAMP0[0], RAMP0[1] - doorTop[1])}</g></g>`);
    const PAIRS = [['sheep', C.linen], ['ox', C.clay], ['sheep', C.stone], ['bird', C.bird]];
    const beasts = PAIRS.flatMap(([k, col], p) => [0, 1].map((j) => ({ p, j, el: arkL.add(`<g>${beast(c, k, j ? shade(col, -0.1) : col)}</g>`) })));
    const HAMMER = `<g transform="rotate(120) translate(0 4)">${sheet().p(c.ribbon([[0, -6], [0, 30]], 4), C.wood3).p(c.cut(c.rect(-10, 26, 20, 10), 0.2, 3), C.rock3).out()}</g>`;
    const noah = S.puppet(arkL.add(person(c, { ...NOAH, holdF: HAMMER })));
    const board = hangL.add(`<g transform="translate(0 -1500)">${strung(boardText(c, tr('Noe', 'Noah')), 0, 2400, [-30, 30])}</g>`);
    const front = S.layer({ par: 0.46, sh: 3, pad: 800 });
    front.add(waveStrip(c, { y: 520, len: 110, amp: 10, color: mix(C.lake3, C.storm, 0.4), bottom: 1800 }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1250, 150 + es(t, 2.0, 2.4) * 900, T, 1, 0.6);
      swing(cl, 560 + (T ? Math.sin(T * 0.1) * 20 : 0), 140, T, 1.2, 0.6, 1);

      /* v26 — "Noah": the board; he knocks in the last pegs */
      flyIn(board, es(t, 0.1, 0.35, ease.back) * (1 - es(t, 1.8, 2.0)), 1010, 330, T, 1, 1);
      const inK = es(t, 1.86, 1.93);
      const nx = lerp(doorTop[0] - 70, doorTop[0], inK), ny = lerp(RAMP0[1] - (RAMP0[1] - doorTop[1]) * ((doorTop[0] - 70 - RAMP0[0]) / (doorTop[0] - RAMP0[0])), doorTop[1], inK);
      const hammer = t < 1 ? Math.abs(Math.sin(t * 22)) : 0;
      noah.set({ x: nx, y: ny, s: 0.82, flip: false, armF: 40 + hammer * 70, armB: 10 + bump(t, 1.0, 1.3) * 60, head: 4, lean: 6, o: 1 - es(t, 1.92, 1.95), blink: blinkAt(T, 7) });

      /* v27a — they eat and drink, marry; the animals go in two by two; the door shuts */
      const cups = T ? (Math.sin(t * 9) > 0.3 ? 1 : 0) : 0;
      const raise = t > 0.1 && t < 2.1 ? cups : 0;
      pose(feastA, { o: 1 - raise });
      pose(feastB, { o: raise });
      const wed = es(t, 1.1, 1.4);
      groom.set({ x: CAN + 30, y: GY + 4, s: 0.94, flip: true, armF: 20 + wed * 50, armB: 10, head: 4, blink: blinkAt(T, 3) });
      bride.set({ x: CAN - 34, y: GY + 4, s: 0.9, flip: false, armF: 20 + wed * 50, armB: 10, head: 6 - wed * 4, blink: blinkAt(T, 4) });
      const rise = es(t, 2.2, 2.85);
      beasts.forEach((b) => {
        const a = 1.12 + b.p * 0.1 + b.j * 0.04;
        const k = es(t, a, a + 0.42, (x) => x);
        const x = lerp(RAMP0[0] - 200 + b.j * 30, doorTop[0], k), y = x < RAMP0[0] ? RAMP0[1] : lerp(RAMP0[1], doorTop[1], (x - RAMP0[0]) / (doorTop[0] - RAMP0[0]));
        pose(b.el, { x, y: y - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 30)) * 3 : 0), s: 1.4, o: t > a && k < 0.98 ? 1 : 0 });
      });
      const shut = es(t, 1.94, 2.0);
      pose(door, { x: A.doorAt[0], y: A.doorAt[1], sx: Math.max(0.04, shut), o: 1 });

      /* v27b — the storm, the rain, the water over everything; the ark floats */
      storm.layer.fade(es(t, 1.95, 2.3));
      clouds.forEach((k) => { const q = es(t, 1.95 + k.i * 0.06, 2.25 + k.i * 0.06, ease.out); flyIn(k.el, q, k.x, k.y, T, k.i, 0.5); });
      rainL.fade(es(t, 2.05, 2.3));
      rainL.shift(T ? -((T * 60) % 120) : 0, T ? (T * 240) % 480 : 0);
      const wy = lerp(700, 0, rise);
      water.shift(T ? Math.sin(T * 0.8) * 20 : 0, wy);
      front.shift(T ? -Math.sin(T * 0.7) * 30 : 0, wy + 60);
      const afloat = 600 + wy < ARK[1];
      pose(arkEl, { x: ARK[0], y: Math.min(ARK[1], 600 + wy) + (T && afloat ? Math.sin(T * 1.2) * 4 : 0), r: afloat && T ? Math.sin(T * 0.9) * 2 : 0 });
      pose(rampEl, { o: 1 - es(t, 2.3, 2.45) });

      S.cam.x = kf(t, [[0, 60], [1, 40], [1.6, 60], [2, 30], [3, 30]]);
      S.cam.y = kf(t, [[0, 0], [1, 10], [2, 0], [3, -40]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2, 1.02], [3, 1.0]]);
    };
  },
};
