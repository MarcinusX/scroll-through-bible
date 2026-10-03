// Łk 11,27–28 — the village square, the crowd pressing round as He speaks. A woman in the crowd pushes forward and
// lifts her voice to Him: "Blessed is the womb that bore you, and the breasts that nursed you!" — and a round picture
// comes down over her: His mother with the Child in her arms. "Blessed rather are those who hear the word of God and
// keep it!": golden slips of His word fly out over the square; the woman, the disciples and the people in front catch
// them and hold them to their hearts, where they glow — and in the round picture Mary, too, holds the word to her
// heart, as she kept all these things.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { villageSet, VQ, CRIER, MARY, childInArms, roundel, figure, goldSlip, say, glow, headAt, hand, kf, moving, tr, FONT, PI } from './lib.js';

const F = VQ.FEET;
const WX = 1010;        // where the woman comes out of the crowd

export default {
  id: 'lk11-womb',
  beats: [
    { v: 27 },
    { v: 28 },
  ],
  cam: { x: [-20, 60], y: [-60, 50], z: [1, 1.12] },
  build(S) {
    const Q = villageSet(S, { dis: ['peter', 'john'], ph: 0, crowdSeeds: ['lk11-wL', 'lk11-wR'] });
    const c = Q.c;
    const woman = S.puppet(Q.act.add(person(c, CRIER)));
    const cry = Q.W.add(`<g opacity="0">${say(c, [tr('Błogosławione łono,', 'Blessed is the womb'), tr('które Cię nosiło!', 'that bore you!')], { size: 18, side: -1 })}</g>`);
    /* the round picture of His mother with the Child */
    const id = S.id('mary');
    const inner = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.skyVeil, C.cream, 0.4)}"/><circle cx="0" cy="-30" r="70" fill="url(#warm-glow)" opacity=".6"/>`
      + sheet().p(c.cut([[-90, 50], [90, 46], [90, 90], [-90, 90]], 0.4, 6), mix(C.sand, C.stone, 0.4)).out()
      + figure(c, { ...MARY, holdF: childInArms(c) }, { x: -6, y: 86, s: 0.66, armF: 64, armB: 40, head: 8 });
    const plate = hanging(Q.flyL, `${roundel(c, inner, { r: 74, id })}<g transform="translate(0 96)">${sheet().p(c.cut([[-70, -13], [70, -14], [71, 13], [-70, 14]], 0.4, 6), C.cream).out()}<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${tr('Maryja', 'Mary')}</text></g>`, { x: 0, y: -1500, len: 1200 });
    const kept = Q.flyL.add(`<g opacity="0">${goldSlip(c, 22)}</g>`);
    /* the word going out, and caught by those who hear */
    const HEAR = [[VQ.DX[0] - 60, F - 26 - 118], [VQ.DX[1] - 60, F - 20 - 118], [WX - 30, F - 118], [440, 520], [540, 530], [1100, 520], [1190, 526]];
    const slips = HEAR.map(([x, y], i) => ({ i, x, y, el: Q.W.add(`<g opacity="0">${goldSlip(c, 30)}</g>`) }));
    const hearts = HEAR.map(() => Q.rayFx.add(`<g opacity="0">${glow(50, 1, 'halo-glow')}</g>`));

    return (t, time) => {
      const T = time;
      /* v27 — the woman cries out; the picture of His mother comes down */
      const WK = [[-0.3, 1200], [0.2, WX]];
      const wx = kf(t, WK);
      const lift = es(t, 0.2, 0.35);
      const hear = es(t, 1.35, 1.5);
      woman.set({ x: wx, y: F + 12, s: 0.96, flip: true, walk: moving(t, WK) ? wx * 0.06 : undefined, armF: 30 + lift * 60 * (1 - hear) + hear * 30, armB: 10 + lift * 100 * (1 - hear) + hear * 50, head: -8 * lift, blink: blinkAt(T, 3) });
      const ck = es(t, 0.25, 0.38, ease.back) * (1 - es(t, 0.95, 1.05));
      const [hx, hy] = headAt(WX, F + 12, 0.96, true);
      pose(cry, { x: hx - 16, y: hy - 18, s: ck, o: ck > 0.01 ? 1 : 0 });
      const pk = es(t, 0.3, 0.6, ease.out);
      pose(plate, { x: S.portrait ? 915 : 1000, y: lerp(-600, 270, pk), r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: pk > 0.004 ? 1 : 0 });
      const kk = es(t, 1.55, 1.7, ease.back);
      pose(kept, { x: (S.portrait ? 915 : 1000) + 12, y: 270 - 8, s: kk, o: kk > 0.01 ? 1 : 0 });

      /* v28 — the word goes out; those who hear keep it */
      const speak = es(t, 1.0, 1.15);
      Q.pose(t, T,
        { flip: t < 1.0 && t > 0.3, armF: 16 + speak * 60, armB: 8 + speak * 50, head: -4, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x - 80, y: F - 26 + d.i * 6, s: 0.9, armF: 10 + es(t, 1.45 + d.i * 0.05, 1.6 + d.i * 0.05) * 50, armB: 6, head: -4, blink: blinkAt(T, d.seed) }));
      Q.amaze(es(t, 0.3, 0.5) * 0.6 * (1 - es(t, 1.0, 1.2)));
      const [jx, jy] = headAt(VQ.JX, F - 14, 1.04);
      slips.forEach((s) => {
        const a = 1.05 + s.i * 0.04;
        const k = es(t, a, a + 0.35);
        pose(s.el, { x: lerp(jx + 10, s.x, k), y: lerp(jy + 10, s.y, k) - Math.sin(k * PI) * 90, r: (1 - k) * 60 + (T ? Math.sin(T * 1.5 + s.i) * 4 : 0), s: 0.7 + k * 0.3, o: k > 0 ? 1 : 0 });
        pose(hearts[s.i], { x: s.x, y: s.y + 6, o: es(t, a + 0.3, a + 0.45) });
      });

      S.cam.x = kf(t, [[-0.5, 40], [0.9, 40], [1.1, 10]]);
      S.cam.y = kf(t, [[-0.5, 10], [0.4, -30], [1.1, -10]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.4, 1.04], [1.1, 1.04]]);
    };
  },
};
