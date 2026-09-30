// Łk 22,47–48 — while He is still speaking, torches among the olive trees: a crowd, dark shadow-play cut-outs with
// torches, clubs and swords (as John 18 cut them), and at their head, in colour, Judas, one of the Twelve. He comes up
// to kiss Him — and in a narrow light the moment is held: "Judas, would you betray the Son of Man with a kiss?"
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  nightSet, gardenTrees, elevenL as eleven, lamp, makeBand, bandPose, TW, MOB, ELEVEN, kf, moving, hand, headAt, withFace, faceBits, say, person, vignette, hanging,
  vis, pose, fade, lerp, mix, blinkAt, tr, C, PI,
} from './lib.js';

const GY = 700, JX = 800;

export default {
  id: 'lk22-kiss',
  beats: [
    { v: 47, text: 'Gdy On jeszcze mówił, oto zjawił się tłum.' },
    { v: 47, cont: true, text: 'A jeden z Dwunastu, imieniem Judasz, szedł na ich czele i zbliżył się do Jezusa, aby Go pocałować.' },
    { v: 48 },
  ],
  cam: { x: [-160, 60], y: [-60, 200], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { moonAt: [1250, 130] });
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const pool = glowL.add(`<g><ellipse cx="0" cy="-110" rx="420" ry="270" fill="url(#warm-glow)" opacity=".55"/></g>`);
    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, MOB);
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const jdEl = peopleL.add(withFace(person(c, TW.judas), faceBits(c)));
    const judas = S.puppet(jdEl);
    const jdAngry = jdEl.querySelector('[data-part="angry"]'), jdSad = jdEl.querySelector('[data-part="sad"]');
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: ELEVEN, lamps: true, arm: 20 });
    const spotL = S.layer({ par: 0.54, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: 760, cy: 520, r: 300, col: '#0c0a18', o: 0.72 }));
    spotL.fade(0);
    const fx = S.layer({ par: 0.56, sh: 4 });
    const words = fx.add(`<g>${say(c, [tr('Judaszu, pocałunkiem', 'Judas, do you betray'), tr('wydajesz Syna Człowieczego?', 'the Son of Man with a kiss?')], { size: 19, side: -1, fill: mix(C.cream, C.halo, 0.25) })}</g>`);

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v47a — the crowd */
      const arrive = es(t, 0.05, 0.8, ease.out);
      band.forEach((m) => {
        const k = es(t, 0.05 + m.i * 0.03, 0.75 + m.i * 0.03, ease.out);
        const x = lerp(m.x - 760, m.x - 60, k);
        bandPose(m, { x, y: GY + m.y, s: m.s ?? 1, o: k > 0.001 ? 1 : 0, walk: k > 0 && k < 1 ? x * 0.05 : undefined }, T);
      });
      vis(pool, { x: lerp(-200, 460, arrive), y: GY, o: 1 });

      /* v47b — Judas at their head; he comes to kiss Him */
      const jdK = [[-0.2, [-160, GY + 8]], [0.85, [580, GY + 8]], [1.2, [580, GY + 8]], [1.65, [738, GY + 8]]];
      const [jdx, jdy] = kf(t, jdK, ease.sine);
      const kiss = es(t, 1.6, 1.75);
      judas.set({ x: jdx, y: jdy, s: 1.0, flip: false, walk: moving(t, jdK, 1) ? jdx * 0.05 : undefined, armF: 20 + kiss * 50 * (1 - es(t, 2.3, 2.5)), armB: 8 + kiss * 40, head: kiss * 8 - es(t, 2.3, 2.5) * 4 + es(t, 2.5, 2.8) * 14, lean: kiss * 8 * (1 - es(t, 2.3, 2.5)), blink: blinkAt(T, 2) });
      fade(jdAngry, es(t, 1.0, 1.2) * (1 - es(t, 2.3, 2.5)));
      fade(jdSad, es(t, 2.4, 2.7));
      spotL.fade(es(t, 1.55, 1.8));

      /* v48 — the question */
      const speak = es(t, 2.05, 2.3);
      J.p.set({ x: JX, y: GY + 6, s: 1.04, flip: true, armF: 20 + speak * 40, armB: 10 + speak * 16, head: kiss * 6 - speak * 2, blink: blinkAt(T) });
      fade(J.sad, kiss * 0.6 + speak * 0.4);
      const [jhx, jhy] = headAt(JX, GY + 6, 1.04, true);
      const wk = es(t, 2.12, 2.32, ease.back);
      vis(words, { x: jhx - 4, y: jhy - 30, s: wk, o: wk > 0.01 ? 1 : 0 });

      const fear = es(t, 0.3, 0.8);
      D.forEach((m) => {
        m.p.set({ x: m.x + 20, y: m.y, s: m.s, flip: true, armF: m.arm, armB: 8 + fear * 30, head: -fear * 6, lean: fear * 3, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear * 0.9);
        lamp(m, 1, 0, T);
      });

      S.cam.x = kf(t, [[-0.5, -140], [0.8, -120], [1.2, -80], [1.6, -30], [2.0, -30]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.8, 1.04], [1.2, 1.2], [1.6, 1.5], [2.9, 1.5]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.8, 20], [1.2, 80], [1.6, 170], [2.9, 170]]);
    };
  },
};
