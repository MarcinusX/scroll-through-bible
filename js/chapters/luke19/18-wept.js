// Łk 19,41–42 — at the turn of the road where the whole city comes into view, late in the day: Jerusalem fills the
// far side of the valley, the Temple gleaming. Jesus has got down beside the colt; He stands looking at it, and weeps
// over it — His brows draw together and a tear runs down His cheek. "If only you, even you, had known on this day the
// things that make for peace!": over the city a white dove with an olive twig circles in a soft light. "But now they
// are hidden from your eyes": a grey veil of gauze comes down across the city and the dove is lost behind it.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { olivetSet, OV, TWELVE, still, colt, coltRig, saddleCloaks, withFace, faceBits, face, dove, flapWings, oliveBranch, headAt, hand, kf, tr, es, ease, bump, seg, PI, LAMENT, LAMENT2, mix, shade, sheet } from './lib.js';

const GY = OV.GY, JX = 560;
const CITY = [1030, 520], CS = 0.7;

export default {
  id: 'lk19-wept',
  beats: [
    { v: 41 },
    { v: 42, text: 'i rzekł: «O gdybyś i ty poznało w ten dzień to, co służy pokojowi!' },
    { v: 42, cont: true, text: 'Ale teraz zostało to zakryte przed twoimi oczami.' },
  ],
  cam: { x: [-200, 120], y: [-60, 70], z: [1, 1.34] },
  build(S) {
    let peace = null, veil = null;
    const O = olivetSet(S, {
      skyCols: LAMENT, sky2: LAMENT2, cityX: CITY[0], cityY: CITY[1], cityS: CS, sunAt: [1320, 230], slopeY: 600, seed: 'lk19-olivet-d', grove2: false,
      atCity: (S2, c2) => {
        const pL = S2.layer({ par: 0.1, sh: 4 });
        peace = { glow: pL.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`), dove: pL.add(dove(c2)), twig: pL.add(`<g>${oliveBranch(c2, 40)}</g>`) };
        // the veil hangs over the city alone (its own soft-edged gauze, behind the valley and everyone in front)
        veil = S2.layer({ par: 0.1, sh: 0, flat: true, blur: 3, pad: 60 });
        // a band of mist across the horizon with a billowing top: it hides the city, not the hillside in front
        const vy0 = CITY[1] - 300, vy1 = CITY[1] + 40;
        const top = [];
        for (let x = -1400; x <= 3000; x += 70) top.push([x, vy0 + Math.sin(x / 90) * 18 + Math.sin(x / 37) * 8]);
        veil.add(`<path d="${c2.poly([...top, [3000, vy1], [-1400, vy1]])}" fill="${mix(C.stone, C.duskViolet, 0.35)}" opacity=".86"/>`);
        veil.fade(0);
        return pL;
      },
    });
    const c = S.c;
    const A = O.act;
    const dis = A.sprite(still(c, [0, 2, 3, 1].map((k, i) => ({ x: -i * 56, y: (i % 2) * 8, s: 0.9, head: 4 + i, armF: 20, o: TWELVE[k].o }))), 340, GY + 4);
    const cR = coltRig(A.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]) })));
    const jEl = A.add(withFace(person(c, CAST.jesus), faceBits(c)));
    const jesus = S.puppet(jEl);
    O.front();

    const JXP = S.portrait ? 640 : JX;   // phone: Jesus and the colt in from the left edge, the colt whole
    return (t, time) => {
      const T = time;
      O.update(T, { glow: 0.55 - es(t, 2.0, 2.5) * 0.3, sunY: 230 + es(t, 0, 3) * 50 });
      O.sk2.fade(es(t, 0.2, 2.8));
      dis.set({ x: 340, y: GY + 4 });
      cR.set({ x: JXP - (S.portrait ? 130 : 170), y: GY + 2, s: 0.96, nod: 10 + (T ? Math.sin(T * 0.7) * 2 : 0), ear: T ? Math.sin(T * 1.2) * 5 : 0, tail: T ? Math.sin(T * 1.6) * 6 : 0 });
      /* v41 — seeing the city, He wept over it */
      const see = es(t, -0.3, 0.3);
      const weep = es(t, 0.3, 0.6);
      const reach = es(t, 1.05, 1.3) * (1 - es(t, 2.05, 2.3) * 0.6);
      jesus.set({ x: JXP, y: GY, s: 1.08, flip: false, armF: 14 + reach * 70 + weep * 10 * (1 - reach), armB: 10 + weep * 30 * (1 - reach) + reach * 40, head: 4 + weep * 8 - reach * 6, blink: blinkAt(T) * (1 - weep * 0.5) });
      face(jEl, 'sad', weep);
      face(jEl, 'tear', es(t, 0.45, 0.7));
      /* v42a — the things that make for peace: the dove with the olive twig over the city */
      const dk = es(t, 1.05, 1.3);
      const ang = (T ? T * 0.6 : 0) + t * 1.2;
      const dx = CITY[0] + Math.cos(ang) * 150, dy = CITY[1] - 250 + Math.sin(ang) * 36;
      pose(peace.glow, { x: CITY[0], y: CITY[1] - 240, s: 0.8 + dk * 0.3, o: dk * 0.9 });
      pose(peace.dove, { x: dx, y: dy, s: 0.9, sx: Math.sin(ang) > 0 ? -1 : 1, o: dk });
      flapWings(peace.dove, T || t * 3, 30, 8);
      pose(peace.twig, { x: dx + (Math.sin(ang) > 0 ? -28 : 28), y: dy - 8, r: -90 * (Math.sin(ang) > 0 ? -1 : 1), s: 0.8, o: dk });
      /* v42b — but now they are hidden from your eyes: a veil over the city */
      const v = es(t, 2.05, 2.5);
      veil.fade(v);
      veil.shift(0, lerp(-420, 0, v));

      S.cam.x = kf(t, [[-0.5, 40], [0.5, -170], [1.1, 20], [2.1, 40]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 60], [1.1, 0], [2.1, 10]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.5, 1.34], [1.1, 1.06], [2.1, 1.08]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -60], [0.5, -200], [1.1, -60], [2.1, -120]]); S.cam.z = 1.0; }
      void hand; void headAt; void shade; void sheet; void seg; void bump; void PI; void tr;
    };
  },
};
