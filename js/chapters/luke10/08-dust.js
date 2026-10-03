// Łk 10,10–12 — the other kind of town, under a grey sky. The two speak in the square, but the people fold their arms,
// turn their backs and go into their houses; one door after another bangs shut. "Go out into its streets and say":
// the two walk out to the gate. "Even the dust of your town that clings to our feet we wipe off against you": there
// they turn and shake the dust off their bare feet and their hems — little clouds of it blow back into the town.
// "Yet know this: the kingdom of God has come near": they point out through the gate, and on the road beyond it the
// light is coming — He Himself — while a shutter creaks open and a face looks out. "It will be more bearable on that
// day for Sodom than for that town": the sky turns the colour of embers, and a great balance comes down over the gate —
// on one pan the smoking ruins of Sodom, on the other this town; and the town's pan sinks.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { squareSet, GATE, ROADIN, along, barefoot, glow, stillGroup, folk, dust, wordSlip, balance, ruinsIcon, cityIcon, strip, STRING, kf, moving, handAt, headAt, tr, GREY, WRATH, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';

const GY = 724;
const SAY = [720, 880];                          // where they speak in the square
const OUT = [GATE.X - 116, GATE.X + 116];        // where they stand, on either side of the gate

export default {
  id: 'lk10-dust',
  beats: [
    { v: 10 },
    { v: 11, text: 'Nawet proch, który z waszego miasta przylgnął nam do nóg, strząsamy wam.' },
    { v: 11, cont: true, text: 'Wszakże to wiedzcie, że bliskie jest królestwo Boże.' },
    { v: 12 },
  ],
  cam: { x: [-40, 40], y: [-120, 40], z: [1, 1.12] },
  build(S) {
    const V = squareSet(S, { skyCols: GREY, sky2: WRATH, GY, tint: 0.3, seed: 'lk10-square2', sunAt: S.portrait ? [820, 140] : [1180, 170] });   // phone: the sun clear of the thread and of the clouds
    const c = S.c;
    const pc = makeCutter('lk10-dust-people');

    /* beyond the gate: the light on the road */
    const far = V.beyond.add(`<g>${glow(160, 1)}</g>`);
    const jesusFar = S.puppet(V.beyond.add(person(c, { ...CAST.jesus })));

    /* the townsfolk: facing the two with folded arms, then backs turned (still sprites) */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const GROUPS = [[270, 712, false, 0], [520, 718, false, 1], [1090, 718, true, 2], [1330, 712, true, 3]].map(([x, y, flip, h]) => {
      const mem = [0, 1].map((k) => ({ x: (k - 0.5) * 50 + pc.rr(-6, 6), y: (k % 2) * 8, s: 0.9, o: folk(pc, null, { robe: mix(folk(pc).robe, C.stone2, 0.35) }) }));
      const facing = crowdL.sprite(stillGroup(pc, mem.map((m) => ({ ...m, flip, armF: 70, armB: 60, head: 6 }))), x, y);
      const away = crowdL.sprite(stillGroup(pc, mem.map((m) => ({ ...m, flip: !flip, armF: 20, armB: 10, head: 4 }))), x, y);
      return { h, x, y, flip, facing, away, door: V.houses[h].door };
    });
    const peek = S.puppet(V.HD.add(person(c, { ...folk(pc, false), robe: mix(C.roseRobe, C.stone2, 0.3) })));

    /* the two */
    const P = S.layer({ par: 0.42, sh: 5 });
    const A = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const B = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));
    const fx = S.layer({ par: 0.44, sh: 4 });
    const words = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(28, 40))), seed: c.rr(0, 6) }));
    const puffs = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${dust(c, 30, mix(C.sand2, C.soil, 0.3))}</g>`) }));
    const bangs = V.houses.map(() => fx.add(`<g>${[0, 1, 2, 3].map((i) => `<path d="${c.ribbon([[0, 0], [22, 0]], 3.4)}" fill="${C.terracotta}" transform="rotate(${-50 + i * 30}) translate(16 0)"/>`).join('')}</g>`));

    /* the balance of that day */
    const BL = S.layer({ par: 0.2, sh: 6, rise: 0 });
    const bal = balance(c, { arm: 170, drop: 110, pan: 120, col: mix(C.ochre, C.wood3, 0.3) });
    const frame = BL.add(`<g><path d="M0 -2000V-80" stroke="${STRING}" stroke-width="1.6"/>${bal.frame}</g>`);
    const beam = BL.add(`<g>${bal.beam}</g>`);
    const sodom = `<g transform="translate(0 72) scale(.62)">${ruinsIcon(makeCutter('lk10-sodom'), 150, 90)}</g><g transform="translate(0 132)">${strip(c, tr('Sodoma', 'Sodom'), { size: 16 })}</g>`;
    const town = `<g transform="translate(0 100) scale(.9)">${cityIcon(makeCutter('lk10-town'), 90, { wall: mix(C.plaster2, C.stone2, 0.5), wall2: mix(C.stone2, C.rock2, 0.4), roof: C.rock3 })}</g><g transform="translate(0 132)">${strip(c, tr('to miasto', 'that city'), { size: 16 })}</g>`;
    const panL = BL.add(`<g>${bal.panL}${sodom}</g>`);
    const panR = BL.add(`<g>${bal.panR}${town}</g>`);
    const embers = Array.from({ length: 8 }, (_, i) => ({ i, el: BL.add(`<path d="${c.cut(c.circ(0, 0, 2.6, 6), 0.2, 2)}" fill="${C.sunDeep}"/>`) }));

    return (t, time) => {
      const T = time;
      const wrath = es(t, 3.0, 3.35);
      V.sk2.layer.fade(wrath);
      V.update(T, { sunO: 1 - wrath });

      /* v10 — they speak; the town turns its back and shuts its doors; they go out to the gate */
      const speak = es(t, 0.02, 0.12) * (1 - es(t, 0.4, 0.5));
      const toGate = [[0.62, 0], [0.98, 1]];
      const g = kf(t, toGate, (x) => x);
      const walking = moving(t, toGate, 0.01);
      const ax = lerp(SAY[0], OUT[0], g), bx = lerp(SAY[1], OUT[1], g), y = lerp(GY, GATE.B + 56, g), s = lerp(0.98, 0.86, g);
      const shakeA = bump(t, 1.12, 1.5), shakeB = bump(t, 1.4, 1.78);
      const point = es(t, 2.08, 2.25);
      A.set({ x: ax, y: y - shakeA * Math.abs(Math.sin(t * 50)) * 8, s, r: shakeA * Math.sin(t * 50) * 5, flip: t < 0.98, walk: walking ? ax * 0.05 : undefined, armF: 14 + speak * 70 + shakeA * 20 + point * 80, armB: 10 + speak * 40 + shakeA * 20, head: shakeA * 16, blink: blinkAt(T, 2) });
      B.set({ x: bx, y: y + 3 - shakeB * Math.abs(Math.sin(t * 50 + 1)) * 8, s: s * 0.97, r: shakeB * Math.sin(t * 50 + 1) * 5, flip: t >= 0.98, walk: walking ? bx * 0.05 + 1 : undefined, armF: 14 + speak * 40 + shakeB * 20 + point * 80, armB: 10 + shakeB * 30, head: shakeB * 16, blink: blinkAt(T, 3) });
      const [hx, hy] = headAt(SAY[0], GY, 0.98, false);
      words.forEach((w) => {
        const k = ((t * 1.6 + w.i / words.length) % 1);
        const on = es(t, 0.02, 0.1) * (1 - es(t, 0.34, 0.42));
        const dir = w.i % 2 ? -1 : 1;
        const x = hx + dir * k * 300, yy = hy - 10 - k * 40 + Math.sin(k * 6 + w.seed) * 10;
        const bounce = es(t, 0.22, 0.4);
        pose(w.el, { x: lerp(x, hx + dir * 40, bounce * k), y: yy, r: Math.sin(w.seed + k * 5) * 14, s: 0.8, o: on * Math.min(1, k * 4) * (1 - k * 0.7) });
      });
      const pk = es(t, 2.4, 2.5) * (1 - es(t, 3.3, 3.4));
      GROUPS.forEach((gr) => {
        const turn = es(t, 0.28 + gr.h * 0.04, 0.32 + gr.h * 0.04);
        const go = es(t, 0.36 + gr.h * 0.05, 0.62 + gr.h * 0.05);
        const dx = gr.door[0] + gr.door[1] / 2 - gr.x;
        gr.facing.set({ x: gr.x, y: gr.y, s: 1, o: 1 - turn });
        gr.away.set({ x: gr.x + dx * go, y: gr.y - go * 22, s: 1 - go * 0.1, o: turn * (1 - seg(t, 0.56 + gr.h * 0.05, 0.62 + gr.h * 0.05)) });
        const shut = es(t, 0.62 + gr.h * 0.05, 0.68 + gr.h * 0.05, ease.in);
        V.houses[gr.h].open(gr.h === 1 ? Math.max(1 - shut, pk * 0.4) : 1 - shut);
        const bk = bump(t, 0.66 + gr.h * 0.05, 0.8 + gr.h * 0.05);
        pose(bangs[gr.h], { x: gr.door[0] + gr.door[1] + 14, y: V.houses[gr.h].base - 100, s: 0.6 + bk * 0.5, o: bk });
      });

      /* v11a — the dust shaken off */
      puffs.forEach((p) => {
        const a = p.i < 4 ? 1.12 + p.i * 0.09 : 1.4 + (p.i - 4) * 0.09;
        const k = seg(t, a, a + 0.36);
        const x0 = p.i < 4 ? OUT[0] : OUT[1];
        pose(p.el, { x: x0 + (p.i % 2 ? 1 : -1) * (20 + k * 90), y: GATE.B + 50 + k * 50 - Math.sin(k * PI) * 30, s: 0.6 + k * 1.4, o: k > 0 && k < 1 ? Math.min(1, (1 - k) * 1.6) : 0 });
      });

      /* v11b — yet the kingdom has come near: the light on the road; a shutter opens */
      const come = es(t, 2.05, 2.9, (x) => x);
      const [jx, jy] = along(ROADIN, 1 - come * 0.7);
      const js = lerp(0.26, 0.4, come);
      jesusFar.set({ x: jx, y: jy, s: js, flip: true, walk: come > 0 && come < 1 ? come * 24 : undefined, armF: 30, armB: 20, blink: blinkAt(T), o: seg(t, 2.04, 2.1) * (1 - es(t, 3.0, 3.2)) });
      pose(far, { x: jx, y: jy - 110 * js, s: js * 1.8, o: seg(t, 2.02, 2.16) * (1 - es(t, 3.0, 3.2) * 0.6) });
      peek.set({ x: V.houses[1].door[0] + 30, y: V.houses[1].base, s: 0.86, flip: false, o: pk > 0.05 ? 1 : 0, armF: 30, head: 6, blink: blinkAt(T, 9) });

      /* v12 — that day: the balance; the town's pan sinks */
      const dk = es(t, 3.05, 3.35, ease.out);
      const tilt = es(t, 3.35, 3.7, ease.back) * 16;
      const by = lerp(-900, 250, dk);
      pose(frame, { x: 800, y: by, o: dk > 0.001 ? 1 : 0 });
      pose(beam, { x: 800, y: by, r: tilt, o: dk > 0.001 ? 1 : 0 });
      const r = (tilt * PI) / 180;
      pose(panL, { x: 800 - Math.cos(r) * 170, y: by - Math.sin(r) * 170, o: dk > 0.001 ? 1 : 0 });
      pose(panR, { x: 800 + Math.cos(r) * 170, y: by + Math.sin(r) * 170, o: dk > 0.001 ? 1 : 0 });
      embers.forEach((e) => { const k = ((T * 0.3 + e.i / 8) % 1); pose(e.el, { x: 800 - Math.cos(r) * 170 + (e.i - 4) * 12, y: by - Math.sin(r) * 170 + 150 - k * 70, o: dk * (1 - k) * 0.9 }); });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 20], [0.9, 20], [1.2, 0], [2.0, 0], [2.3, -20], [3.0, -20], [3.4, -100], [4, -100]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.08], [2.0, 1.08], [2.3, 1.04], [3.0, 1.04], [3.4, 1.0], [4, 1.0]]);
    };
  },
};
