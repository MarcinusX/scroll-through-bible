// Mk 14,12–13a — the first day of Unleavened Bread, morning on the Mount of Olives: smoke rises from the Temple
// where the lambs are offered; the disciples ask where to prepare the Passover; He sends two of them to the city.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, rock, sun, cloud, grass, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { walledCity } from '../mark1/lib.js';
import { TW, kf, moving, hand, headAt, speech, GLYPH, discPlate, lamb, matzahRound, wordTag, PI, vis } from './lib.js';

const GY = 700, JX = 800;

export default {
  id: 'm14-where',
  beats: [
    { v: 12, text: 'W pierwszy dzień Przaśników, kiedy ofiarowywano Paschę,' },
    { v: 12, cont: true, text: 'zapytali Jezusa Jego uczniowie: «Gdzie chcesz, abyśmy poszli poczynić przygotowania, żebyś mógł spożyć Paschę?»' },
    { v: 13, text: 'I posłał dwóch spośród swoich uczniów z tym poleceniem:' },
  ],
  cam: { x: [-80, 60], y: [-40, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const SKY = ['#bcd3d6', '#eee3c8', '#f6e3c4'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1220, y: 170, len: 700 });
    const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 180, len: 600 });

    // Jerusalem across the valley, the Temple smoking
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 470, amps: [14, 6, 2], lens: [900, 330, 120], color: mix(C.hillFar, C.sand, 0.3) });
    far.add(h1.markup);
    far.add(walledCity(c, 470, h1.fn(470) + 16, 1.7));
    const smokeL = S.layer({ par: 0.1, sh: 0, flat: true });
    const puffs = Array.from({ length: 7 }, (_, i) => ({ i, el: smokeL.add(`<g><path d="${c.cut(c.blob(0, 0, 22, 15, 10, 0.2), 0.6, 4)}" fill="#f4f0e8" opacity=".9"/></g>`) }));
    const mid = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 560, amps: [10, 5, 2], lens: [800, 280, 100], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    mid.add(h2.markup + cypress(c, 1180, h2.fn(1180) + 8, 110) + cypress(c, 1215, h2.fn(1215) + 10, 80));
    const ground = S.layer({ par: 0.36, sh: 3 });
    const gfn = c.wave(GY - 60, [4, 2], [600, 160]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand).out());
    // the road down towards the city
    ground.add(`<path d="${c.ribbon(c.qbez([640, 1700], [560, GY - 20], [330, GY - 64], 20), (u) => 90 - u * 70)}" fill="${C.sand2}"/>`);
    ground.add(grass(c, { x0: -600, x1: 2200, y: GY - 60, fn: gfn, n: 36, h: 12, color: C.olive }) + olive(c, 1360, gfn(1360) + 26, 1.2) + olive(c, 210, gfn(210) + 30, 1.0) + rock(c, 1060, GY - 34, 70, 26, C.rock2));

    // the feast: a plate with the lamb and the unleavened bread
    const plL = S.layer({ par: 0.4, sh: 5 });
    const plate = hanging(plL, discPlate(c, `<g transform="translate(-30 22) scale(.8)">${lamb(c)}</g><g transform="translate(26 4) scale(.62)">${matzahRound(c, 30)}</g>`, { r: 58, rim: C.ochre }), { x: 1010, y: 300, len: 600 });
    const tagEl = hanging(plL, wordTag(c, tr('Pascha', 'Passover'), { size: 20 }), { x: 1010, y: 380, len: 600 });

    // the disciples around Him
    const P = S.layer({ par: 0.55, sh: 5 });
    const DIS = [
      { k: 'thomas', o: TW.thomas, x: 470 }, { k: 'andrew', o: TW.andrew, x: 548 }, { k: 'john', o: TW.john, x: 640, go: 1 },
      { k: 'peter', o: TW.peter, x: 710, go: 0 }, { k: 'james', o: TW.james, x: 900 }, { k: 'matthew', o: TW.matthew, x: 975 },
      { k: 'philip', o: TW.philip, x: 1050 }, { k: 'judas', o: TW.judas, x: 1125 },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), y: GY + (i % 2) * 8, p: S.puppet(P.add(person(c, d.o))) }));
    const jesus = S.puppet(P.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.58, sh: 4 });
    const ask = fx.add(`<g>${speech(c, `<g transform="translate(-16 6) scale(.62)">${sheet().p(c.cut([[-24, 18], [-24, -6], [0, -26], [24, -6], [24, 18]], 0.4, 4), C.plaster).p(c.cut(c.rect(-6, 2, 12, 16), 0.2, 3), C.wood2).out()}</g><g transform="translate(18 0)">${GLYPH.q(c)}</g>`, { w: 80, h: 56, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#c9dcdb', '#f1e7cf', '#f7e8cc'], es(t, 0, 3));
      swing(sunEl, 1220, 170 - es(t, -0.5, 3) * 30, T, 1.2, 0.7);
      swing(cl, 560 + Math.sin(T * 0.1) * 30, 180, T, 1.5, 0.6, 1);

      // v12a — smoke of the offerings rises from the Temple; the Passover plate
      const [tx, ty] = [470, h1.fn(470) + 16 - 44 * 1.7 - 70 * 1.7];
      puffs.forEach((p) => {
        const k = ((T * 0.12 + p.i / puffs.length) % 1);
        const on = es(t, -0.2, 0.5) * (1 - es(t, 2.5, 3.2) * 0.6);
        vis(p.el, { x: tx + Math.sin(k * 5 + p.i) * 10 + k * 40, y: ty - k * 180, s: 0.6 + k * 1.6, o: on * (1 - k) * 0.9 });
      });
      const pin = es(t, 0.1, 0.5, ease.out) * (1 - es(t, 0.95, 1.25, ease.in));
      vis(plate, { x: 1010, y: 300 - (1 - pin) * 600, r: Math.sin(T * 0.9) * 2, o: pin > 0.01 ? 1 : 0 });
      vis(tagEl, { x: 1010, y: 380 - (1 - pin) * 600, r: Math.sin(T * 1.2 + 1) * 3, o: pin > 0.01 ? 1 : 0 });

      // v12b — they ask
      const asking = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const a = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.9, 2.0));
      // v13a — He sends Peter and John towards the city
      const send = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: GY + 4, s: 1.04, flip: t > 2.02, armF: 20 + send * 70 + bump(t, 1.4, 1.95) * 20, armB: 10 + send * 20, head: -send * 4 + asking * 2, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const toJ = d.x > JX;
        let x = d.x, walk, flip = toJ, armF = 14, armB = 4, head = 0;
        armF += asking * (d.k === 'james' ? 70 : 24);
        armB += asking * (d.k === 'james' ? 30 : 0);
        head -= asking * 6 - bump(t, 0, 0.9) * (d.i % 2 ? -8 : 6);
        if (d.go !== undefined) {
          const gK = [[2.3, d.x], [3.0, d.x - 260 - d.go * 30]];
          x = kf(t, gK, ease.sine);
          walk = moving(t, gK, 1) ? x * 0.05 : undefined;
          flip = t > 2.2 ? true : false;
          head -= send * 6;
          if (t > 2.05 && t < 2.3) { flip = false; armF += 20; }
        }
        d.p.set({ x, y: d.y, s: 0.98, flip, walk, armF, armB, head, blink: blinkAt(T, d.seed) });
      });
      const [ax, ay] = headAt(900, GY, 0.98, true);
      vis(ask, { x: ax - 16, y: ay - 26, s: a, o: a > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -40], [0.8, -40], [1.2, 20], [2.1, 0], [2.9, -60]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.8, 1.02], [1.2, 1.14], [2.1, 1.12], [2.9, 1.08]]);
      S.cam.y = kf(t, [[-0.5, -20], [0.8, -30], [1.2, 60], [2.9, 40]]);
    };
  },
};
