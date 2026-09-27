// J 10,1a — the curtains open on the Temple court in the morning, just after the healing of the man born blind:
// he stands beside Jesus, seeing; some of the leaders frown on the right, listeners on the left.
// "Truly, truly, I say to you" — Jesus lifts His hand, His voice rings out, two little gold "Amen" tags swing down,
// and above them a painted flat of a sheepfold starts to come down from the flies: a story is beginning.
import { C, blinkAt, pose, lerp, curtains, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { dayCourt, DC, MORNING, voiceRings, framed, farFold, ewe, nameTag, hanging, kf, vis, tr, PI } from './lib.js';
import { swing } from '../kit.js';

const PW = 380, PH = 190;

export default {
  id: 'j10-amen',
  beats: [
    { cover: true },
    { v: 1, text: 'Zaprawdę, zaprawdę, powiadam wam:' },
  ],
  cam: { x: [-40, 40], y: [-100, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const K = dayCourt(S, { skyCols: MORNING });
    const rings = voiceRings(K.fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    const amen = [0, 1].map((i) => hanging(K.fx, nameTag(c, 'Amen', { size: 20 }), { x: [690, 910][i], y: 300, len: 700 }));
    // the painted flat of the parable, first glimpse
    const inner = `<rect width="${PW}" height="${PH}" fill="${mix(C.dawn, C.skyBlue, 0.3)}"/><path d="M0 ${PH - 70}Q${PW / 2} ${PH - 100} ${PW} ${PH - 76}V${PH}H0Z" fill="${C.hillNear}"/><g transform="translate(${PW / 2} ${PH - 30}) scale(2.2)">${farFold(c, 1)}</g>` +
      [[-40, 0], [0, 6], [40, -2]].map(([dx, dy], i) => `<g transform="translate(${PW / 2 + dx} ${PH - 58 + dy}) scale(.5)">${ewe(c, { wool: [C.linen, C.cream, C.linen][i] })}</g>`).join('');
    const plate = K.fx.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'fold' })}</g>`);
    K.front();
    const tagL = S.layer({ par: 0.2, sh: 4 });
    const tag = hanging(tagL, nameTag(c, tr('świątynia', 'the temple'), { size: 18 }), { x: 1180, y: 250, len: 700 });

    const cur = curtains(S);
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      K.court.sk.set(...MORNING);
      pose(K.court.sunEl, { x: 1240, y: 140, r: Math.sin(T * 0.6) * 1 });
      pose(K.court.cl1, { x: 470 + Math.sin(T * 0.1) * 20, y: 140, r: Math.sin(T * 0.6) * 1.2 });
      /* the place */
      const tk = es(t, 0.45, 0.85, ease.out) * (1 - es(t, 1.2, 1.4, ease.in));
      swing(tag, 1180, 250 - (1 - tk) * 700, tk > 0.001 ? T : 0, 1.2, 0.7);
      fade(tag, tk > 0.001 ? 1 : 0);
      /* v1a — "Truly, truly, I say to you" */
      const speak = es(t, 1.05, 1.3);
      const talk = bump(t, 1.08, 1.95);
      const ak = [0, 1].map((i) => es(t, 1.15 + i * 0.18, 1.45 + i * 0.18, ease.out));
      amen.forEach((el, i) => { swing(el, [690, 910][i], 300 - (1 - ak[i]) * 700, ak[i] > 0.001 ? T : 0, 1.4, 0.9, i * 2); fade(el, ak[i] > 0.001 ? 1 : 0); });
      const pk = es(t, 1.5, 1.95, ease.out);
      vis(plate, { x: 800, y: lerp(-420, 110, pk), o: pk > 0.001 ? 1 : 0 });
      K.set(T, {
        j: { armF: 14 + speak * 36, armB: 8 + speak * 120, head: -4 * speak },
        seerO: { head: -8 * speak, armF: 12 + bump(t, 0.9, 1.9) * 10 },
        lisF: (m) => ({ head: -6 * speak - (m.i % 2) * 2 }),
        leadF: (m) => ({ head: (m.i % 2 ? -4 : 3) * speak, armF: m.i === 1 ? 18 + speak * 30 : 18, angry: 0.3 + (m.i === 2 ? speak * 0.4 : 0) }),
      });
      rings(DC.JX + 8, DC.FLOOR - 170, talk, T, { dir: 1, s0: 0.7, spread: 1.8 });
      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 20], [1, 10], [1.9, -80]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.1], [1.9, 1.04]]);
    };
  },
};
