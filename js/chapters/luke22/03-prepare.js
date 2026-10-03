// Łk 22,7–9 — morning of the day of Unleavened Bread on the Mount of Olives: across the valley the smoke of the
// Passover offerings rises from the Temple. Jesus calls Peter and John out of the group and sends them — a bubble with
// the lamb and the unleavened bread on a table: "Go and prepare the Passover for us, that we may eat." The two turn
// to Him with their question: where?
import { es, ease, bump, seg } from '../../core/anim.js';
import { band, hillsWith, olive, cypress, rock, sun, cloud, grass } from '../../assets/nature.js';
import {
  TW, CAST, kf, moving, hand, headAt, speech, GLYPH, discPlate, lamb, matzahRound, lowTable, wordTag, walledCity, person, hanging, swing, vis, pose,
  fade, lerp, mix, shade, sheet, sky, blinkAt, tr, C, PI,
} from './lib.js';

const GY = 700, JX = 800;

export default {
  id: 'lk22-prepare',
  beats: [
    { v: 7 },
    { v: 8 },
    { v: 9 },
  ],
  cam: { x: [-80, 60], y: [-40, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const SKY = ['#bcd3d6', '#eee3c8', '#f6e3c4'];
    sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1230, y: 160, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 600, y: 170, len: 600 });

    // Jerusalem across the valley; the Temple's altar smoking
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 470, amps: [14, 6, 2], lens: [900, 330, 120], color: mix(C.hillFar, C.sand, 0.3) });
    far.add(h1.markup);
    const CX = 470;
    far.add(walledCity(c, CX, h1.fn(CX) + 16, 1.7));
    const smokeL = S.layer({ par: 0.1, sh: 0, flat: true });
    const puffs = Array.from({ length: 8 }, (_, i) => ({ i, el: smokeL.add(`<g><path d="${c.cut(c.blob(0, 0, 22, 15, 10, 0.2), 0.6, 4)}" fill="#f4f0e8" opacity=".92"/></g>`) }));
    const mid = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 560, amps: [10, 5, 2], lens: [800, 280, 100], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    mid.add(h2.markup + cypress(c, 1180, h2.fn(1180) + 8, 110) + cypress(c, 1215, h2.fn(1215) + 10, 80));
    const ground = S.layer({ par: 0.36, sh: 3 });
    const gfn = c.wave(GY - 60, [4, 2], [600, 160]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out());
    ground.add(`<path d="${c.ribbon(c.qbez([640, 1700], [560, GY - 20], [330, GY - 64], 20), (u) => 90 - u * 70)}" fill="${C.sand2}"/>`);
    ground.add(grass(c, { x0: -600, x1: 2200, y: GY - 60, fn: gfn, n: 36, h: 12, color: C.olive }) + olive(c, 1360, gfn(1360) + 26, 1.2) + olive(c, 190, gfn(190) + 30, 1.0) + rock(c, 1080, GY - 34, 70, 26, C.rock2));

    // the feast day: the plate of the lamb, the tag
    const plL = S.layer({ par: 0.4, sh: 5 });
    const plate = hanging(plL, discPlate(c, `<g transform="translate(-30 22) scale(.8)">${lamb(c)}</g><g transform="translate(26 4) scale(.62)">${matzahRound(c, 30)}</g>`, { r: 58, rim: C.ochre }), { x: 0, y: -1500, len: 600 });
    const tagEl = hanging(plL, wordTag(c, tr('dzień Przaśników', 'the day of Unleavened Bread'), { size: 19 }), { x: 0, y: -1500, len: 600 });

    // the disciples round Him
    const P = S.layer({ par: 0.55, sh: 5 });
    const DIS = [
      { k: 'thomas', x: 430 }, { k: 'andrew', x: 506 }, { k: 'james', x: 580 },
      { k: 'john', x: 930, go: 1 }, { k: 'peter', x: 1000, go: 0 }, { k: 'matthew', x: 1080 }, { k: 'philip', x: 1150 }, { k: 'judas', x: 1220 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), y: GY + (i % 2) * 8, p: S.puppet(P.add(person(c, TW[d.k]))) }));
    if (S.portrait) DIS.forEach((d) => { d.x = JX + (d.x - JX) * (d.x > JX ? 0.62 : 0.74); });   // phone: the group closer round Him, no half figure at the edge or under the thread
    const jesus = S.puppet(P.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.58, sh: 4 });
    const table = `<g transform="translate(0 20) scale(.7)">${lowTable(c, 80, 20)}</g><g transform="translate(-14 4) scale(.34)">${lamb(c)}</g><g transform="translate(18 2) scale(.3)">${matzahRound(c, 30)}</g>`;
    const goB = fx.add(`<g>${speech(c, table, { w: 96, h: 64 })}</g>`);
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-16 6) scale(.62)">${sheet().p(c.cut([[-24, 18], [-24, -6], [0, -26], [24, -6], [24, 18]], 0.4, 4), C.plaster).p(c.cut(c.rect(-6, 2, 12, 16), 0.2, 3), C.wood2).out()}</g><g transform="translate(18 0)">${GLYPH.q(c)}</g>`, { w: 80, h: 56, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 160 - es(t, -0.5, 3) * 30, T, 1.2, 0.7);
      swing(cl, 600 + Math.sin(T * 0.1) * 30, 170, T, 1.5, 0.6, 1);

      /* v7 — the day on which the Passover lamb must be sacrificed: smoke from the Temple, the plate */
      const [tx, ty] = [CX, h1.fn(CX) + 16 - 44 * 1.7 - 70 * 1.7];
      puffs.forEach((p) => {
        const k = ((T * 0.12 + p.i / puffs.length) % 1);
        const on = es(t, -0.2, 0.5) * (1 - es(t, 2.2, 3) * 0.5);
        vis(p.el, { x: tx + Math.sin(k * 5 + p.i) * 10 + k * 40, y: ty - k * 190, s: 0.6 + k * 1.7, o: on * (1 - k) * 0.9 });
      });
      const pin = es(t, 0.1, 0.5, ease.out) * (1 - es(t, 1.0, 1.3, ease.in));
      const PLX = S.portrait ? 930 : 1010;   // phone: the plate and its tag clear of the thread
      vis(plate, { x: PLX, y: 300 - (1 - pin) * 700, r: T ? Math.sin(T * 0.9) * 2 : 0, o: pin > 0.01 ? 1 : 0 });
      vis(tagEl, { x: PLX, y: 386 - (1 - pin) * 700, r: T ? Math.sin(T * 1.2 + 1) * 3 : 0, o: pin > 0.01 ? 1 : 0 });

      /* v8 — He sends Peter and John */
      const call = es(t, 1.05, 1.3);
      const send = es(t, 1.35, 1.6);
      const ask9 = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: GY + 4, s: 1.04, flip: false, armF: 20 + call * 50 + send * 30 * (1 - ask9 * 0.6), armB: 10 + send * 40 * (1 - ask9), head: -call * 4 + ask9 * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        let x = d.x, walk, flip = d.x > JX, armF = 14, armB = 4, head = 0;
        head -= bump(t, 0, 0.9) * (d.i % 2 ? -8 : 6) * (d.x < JX ? 1 : 0);
        if (d.go !== undefined) {
          const gK = [[1.1, d.x], [1.6, S.portrait ? 860 + d.go * 60 : 900 + d.go * 70]];
          x = kf(t, gK, ease.sine);
          walk = moving(t, gK, 1) ? x * 0.05 : undefined;
          flip = true;
          armF += (d.k === 'peter' ? ask9 * 70 : ask9 * 20);
          armB += (d.k === 'peter' ? ask9 * 40 : 0);
          head += -ask9 * 8 + call * 4;
        }
        d.p.set({ x, y: d.y, s: 0.98, flip, walk, armF, armB, head, blink: blinkAt(T, d.seed) });
      });
      const [jhx, jhy] = headAt(JX, GY + 4, 1.04, false);
      const gb = es(t, 1.45, 1.65, ease.back) * (1 - es(t, 1.95, 2.05));
      vis(goB, { x: jhx + 20, y: jhy - 26, s: gb, o: gb > 0.01 ? 1 : 0 });
      const [ax, ay] = headAt(S.portrait ? 920 : 970, GY, 0.98, true);
      const a = es(t, 2.2, 2.4, ease.back);
      vis(ask, { x: ax - 16, y: ay - 26, s: a, o: a > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -40], [0.8, -40], [1.2, 20], [2.1, 40], [3, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.8, 1.02], [1.2, 1.16], [3, 1.2]]);
      S.cam.y = kf(t, [[-0.5, -20], [0.8, -30], [1.2, 70], [3, 80]]);
    };
  },
};
