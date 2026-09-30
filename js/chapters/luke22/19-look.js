// Łk 22,61–62 — the centrepiece. At the rooster's cry everything else in the courtyard goes dark and still — the
// servants, the fire, the guards — and only two are left in the light: up in the hall the Lord turns and looks down
// at Peter, and Peter, by the dying fire, turns and looks up at Him. Nothing is said. Then Peter remembers the word
// (a sepia picture: the table, the Master turned to him, the rooster and three marks). He goes out through the gate
// into the dark street, sinks down against the wall and weeps bitterly — the first grey of dawn behind the roofs.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  courtScene, kf, moving, hand, headAt, withFace, faceBits, memoryOval, rooster, tally, lowTable, person, sheet, hanging, vis, pose, fade, lerp, mix,
  blinkAt, tr, C, CAST, TW, PI,
} from './lib.js';
import { ropeHands } from './lib.js';

const PETER_AT = 70;

export default {
  id: 'lk22-look',
  beats: [
    { v: 61, text: 'A Pan obrócił się i spojrzał na Piotra.' },
    { v: 61, cont: true, text: 'Wspomniał Piotr na słowo Pana, jak mu powiedział: «Dziś, zanim kogut zapieje, trzy razy się Mnie wyprzesz».' },
    { v: 62 },
  ],
  cam: { x: [-1060, 340], y: [-40, 240], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const K = courtScene(S);
    const { YARD, HALL, FIRE, JXH, GATE } = K;
    const PX = FIRE + PETER_AT, PY = YARD + 14;
    // the hush: everything else goes dark
    const hush = S.layer({ par: K.P, sh: 0, flat: true });
    hush.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0d0b1c" opacity=".62"/>`);
    // the two, in front of the hush
    const two = S.layer({ par: K.P, sh: 5 });
    const jEl = two.add(withFace(person(c, { ...CAST.jesus, holdF: ropeHands(c) }), faceBits(c)));
    const J = S.puppet(jEl);
    const jSad = jEl.querySelector('[data-part="sad"]');
    const pEl = two.add(withFace(person(c, { ...TW.peter, pose: 'sit' }), faceBits(c)));
    const P = S.puppet(pEl);
    const pSad = pEl.querySelector('[data-part="sad"]'), pTear = pEl.querySelector('[data-part="tear"]');
    const kEl = two.add(withFace(person(c, { ...TW.peter, pose: 'kneel' }), faceBits(c)));
    const PK = S.puppet(kEl);
    const kSad = kEl.querySelector('[data-part="sad"]'), kTear = kEl.querySelector('[data-part="tear"]');
    const wEl = two.add(withFace(person(c, TW.peter), faceBits(c)));
    const PW = S.puppet(wEl);
    fade(wEl.querySelector('[data-part="sad"]'), 1);
    const fx = S.layer({ par: K.P, sh: 4 });
    // the memory
    const memIn = `<rect x="-150" y="30" width="300" height="80" fill="${mix(C.clay, C.parchment, 0.5)}"/><g transform="translate(-10 60) scale(.44)">${lowTable(c, 300, 44)}</g><g transform="translate(-40 58) scale(.44)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g><g transform="translate(30 58) scale(-.42 .42)">${person(c, { ...TW.peter, pose: 'sit' })}</g><g transform="translate(-104 -8) scale(.4)">${rooster(c)}</g><g transform="translate(88 -30)">${tally(c, 3, C.ink, 26)}</g>`;
    const memory = hanging(fx, memoryOval(S, memIn, { w: 300, h: 200 }), { x: 0, y: -1500, len: 800 });
    const tears = [0, 1, 2, 3].map(() => fx.add(`<g><path d="${c.cut([[0, -5], [3, 1], [0, 4], [-3, 1]], 0.1, 2)}" fill="#bfe0ee"/></g>`));

    return (t, time) => {
      const T = time;
      const still = es(t, 0.02, 0.3);
      K.idle(T * (1 - still), 1 - still * 0.75);
      K.R.dawn.fade(es(t, 2.1, 2.9) * 0.5);
      hush.fade(still * (1 - es(t, 2.0, 2.3) * 0.2));
      pose(K.roEl, { x: K.ROO.x, y: K.ROO.y, s: 0.9 });

      /* the world goes on, frozen, in the dark */
      K.hall(T, { jo: 0, jx: JXH, head: 10 });
      K.ring.forEach((d) => {
        d.sit.set({ x: d.x, y: YARD + d.y + 4, s: d.s, flip: d.f, armF: 64, armB: 40, head: 6, blink: 0 });
        d.stand.set({ x: d.x, y: YARD, o: 0 });
      });
      K.maid.set({ x: 1300, y: YARD, o: 0 });
      K.pSit.set({ x: PX, y: PY, s: 0.9, o: 0 });
      K.pSt.set({ x: PX, y: PY, o: 0 });

      /* v61a — the Lord turned and looked at Peter */
      const turnJ = es(t, 0.1, 0.22);
      const turnP = es(t, 0.4, 0.52);
      J.set({ x: JXH, y: HALL, s: 0.94, flip: turnJ > 0.5, armF: 26, armB: 12, head: 10 + turnJ * 10, blink: 0 });
      fade(jSad, 0.8);
      const out = es(t, 2.02, 2.1);
      P.set({ x: PX, y: PY, s: 0.9, flip: turnP < 0.5, o: 1 - out, armF: 60 - turnP * 20 + es(t, 1.2, 1.5) * 40, armB: 40 + es(t, 1.2, 1.5) * 60, head: 6 - turnP * 26 * (1 - es(t, 1.3, 1.6)) + es(t, 1.3, 1.6) * 24, lean: es(t, 1.3, 1.6) * 10, blink: 0 });
      fade(pSad, turnP);
      fade(pTear, es(t, 0.65, 0.9));

      /* v61b — he remembers */
      const mk = es(t, 1.08, 1.4, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(memory, { x: 620, y: 400 - (1 - mk) * 800, r: T ? Math.sin(T * 0.6) * 1.2 : 0, o: mk > 0.01 ? 1 : 0 });

      /* v62 — out through the gate; he weeps bitterly */
      const wK = [[2.05, [PX, PY - 14]], [2.55, [GATE - 60, YARD + 4]], [2.62, [GATE - 150, YARD + 8]]];
      const [wx, wy] = kf(t, wK, ease.sine);
      const kneel = es(t, 2.6, 2.66);
      PW.set({ x: wx, y: wy, s: 0.9, flip: true, o: out * (1 - kneel), walk: moving(t, wK, 1) ? wx * 0.06 : undefined, armF: 40, armB: 70, head: 24, lean: 6, blink: 0 });
      PK.set({ x: GATE - 160, y: YARD + 10, s: 0.92, flip: true, o: kneel, armF: 70, armB: 60, head: 34, lean: 34 + (T ? Math.sin(T * 2.6) * 2 : 0), bob: T ? Math.abs(Math.sin(T * 2.6)) * -2 : 0, blink: 0 });
      fade(kSad, 1);
      fade(kTear, 1);
      tears.forEach((d, i) => {
        const k = T ? ((T * 0.6 + i / 4) % 1) : [0.2, 0.5, 0.8, 0.35][i];
        const [hx, hy] = headAt(GATE - 160, YARD + 10, 0.92, true, 46);
        vis(d, { x: hx - 40 + (i % 2 ? -6 : 6), y: hy + 20 + k * 60, s: 1.3, o: kneel * (1 - k) });
      });
      // his tears at the fire too, as he looks
      S.cam.x = kf(t, [[-0.3, 60], [0.02, 60], [0.2, 330], [0.34, 330], [0.46, -160], [0.6, -160], [0.74, 70], [1.0, 70], [1.1, -80], [2.0, -80], [2.5, S.portrait ? -960 : -660], [3, S.portrait ? -1000 : -700]]);
      S.cam.y = kf(t, [[-0.3, 140], [0.02, 130], [0.2, -20], [0.34, -20], [0.46, 210], [0.6, 210], [0.74, 110], [1.0, 110], [1.1, 160], [2.0, 160], [2.5, 170], [3, 180]]);
      S.cam.z = kf(t, [[-0.3, 1.2], [0.02, 1.2], [0.2, 1.48], [0.34, 1.48], [0.46, 1.48], [0.6, 1.48], [0.74, 1.26], [1.0, 1.26], [1.1, 1.3], [2.0, 1.3], [2.5, 1.2], [3, 1.22]]);
    };
  },
};
