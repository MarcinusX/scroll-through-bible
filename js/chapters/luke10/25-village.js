// Łk 10,38 — "As they went on their way, He entered a certain village": in the warm afternoon Jesus comes up a village
// lane with Peter, John and Andrew. "And a woman named Martha welcomed Him into her house": a door opens, and Martha —
// in her clay-red dress and linen apron, the keys of the house at her belt — hurries out, bows, and opens her arms and
// her door to Him; the room behind her glows.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { laneSet, doorHouse, martha, nameTag, glow, kf, moving, tr, WARM, STRING, es, ease, bump, seg, PI } from './lib.js';

const GY = 716, BASE = 710;

export default {
  id: 'lk10-village',
  beats: [
    { v: 38, text: 'W dalszej ich podróży przyszedł do jednej wsi.' },
    { v: 38, cont: true, text: 'Tam pewna niewiasta, imieniem Marta, przyjęła Go do swego domu.' },
  ],
  cam: { x: [-60, 60], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const V = laneSet(S, { skyCols: WARM, GY, seed: 'lk10-bethany', sunAt: [1250, 190] });
    const c = S.c;
    const HL = S.layer({ par: 0.45, sh: 4 });
    const D = S.layer({ par: 0.45, sh: 5 });
    const LF = S.layer({ par: 0.45, sh: 4 });
    const H = doorHouse(S, HL, LF, c, { x0: 880, base: BASE, w: 300, h: 300, wall: mix(C.plaster, C.peach, 0.25), dw: 90, dh: 190 });
    HL.add(sheet().p(c.cut(c.blob(1030, BASE - 306, 170, 26, 16, 0.2), 1, 8) + c.cut(c.blob(1160, BASE - 250, 40, 60, 10, 0.2), 1, 6), C.leaf).p(c.cut([[1206, BASE], [1196, BASE - 40], [1212, BASE - 60], [1228, BASE - 40], [1220, BASE]], 0.4, 5), C.pot).out());
    const mar = S.puppet(D.add(martha(c)));
    const tag = D.add(`<g><path d="M0 -2000V6" stroke="${STRING}" stroke-width="1.2"/>${nameTag(c, tr('Marta', 'Martha'), { size: 19 })}</g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    const aura = P.add(`<g>${glow(150, 0.5)}</g>`);
    const TW = [CAST.andrew, CAST.john, CAST.peter].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));

    return (t, time) => {
      const T = time;
      V.update(T, { sunY: 190 });

      /* v38a — up the lane into the village */
      const wK = [[0, -160], [0.7, 800]];
      const jx = kf(t, wK, ease.sine);
      const walking = moving(t, wK);
      const greet = es(t, 1.45, 1.6);
      jesus.set({ x: jx, y: GY, s: 1.04, flip: false, walk: walking ? jx * 0.05 : undefined, armF: 14 + greet * 60, armB: 10 + greet * 30, head: -2, blink: blinkAt(T) });
      pose(aura, { x: jx, y: GY - 120, o: 0.5 });
      TW.forEach((d) => {
        const x = jx - 140 - d.i * 110;
        d.p.set({ x, y: GY + 4 - d.i * 4, s: 0.96, flip: false, walk: walking ? x * 0.05 + d.i : undefined, armF: 14, armB: 10, head: -2, blink: blinkAt(T, d.i + 2) });
      });

      /* v38b — Martha opens her door and welcomes Him in */
      const open = es(t, 1.0, 1.15);
      H.open(open);
      H.lit(es(t, 1.02, 1.2));
      const out = es(t, 1.1, 1.3);
      const bow = bump(t, 1.3, 1.6);
      const welcome = es(t, 1.55, 1.75);
      mar.set({ x: lerp(H.door[0] + 44, 960, out), y: GY - 2, s: 0.98, flip: true, walk: out > 0 && out < 1 ? t * 40 : undefined, armF: 30 + welcome * 50, armB: 20 + welcome * 100, lean: bow * 22, head: bow * 10, o: seg(t, 1.06, 1.1), blink: blinkAt(T, 6) });
      const tk = es(t, 1.2, 1.45, ease.out);
      pose(tag, { x: 1010, y: lerp(-500, 380, tk), r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: tk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -60], [0.7, 0], [1, 20], [2, 30]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1, 1.04], [2, 1.08]]);
    };
  },
};
