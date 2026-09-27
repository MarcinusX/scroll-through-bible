// J 18,3–6 — up on the ridge the city gate opens and a string of little fires comes out: the detachment and the
// officers, winding down the zigzag path towards the garden, beautiful and ominous. They arrive: dark shadow-play
// figures with lanterns, torches and weapons, Judas at their head in colour. Jesus, knowing all that was coming, steps
// out from His disciples towards them: "Whom are you looking for?" — "Jesus of Nazareth." — "I AM": gold light
// opens behind Him and the words hang above Him. Judas stands among them (a pale light finds him, a dark tag).
// When He says "I AM" the light rolls over them and the whole armed crowd falls backwards like paper cut-outs in a gust.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  nightSet, gardenTrees, BAND, DIS, ARREST, eleven, lamp, makeBand, bandPose, torchLine, iAm, say, nameTag, radiance, rayBurst, hanging, vis, kf, moving, headAt,
  withFace, faceBits, person, pose, fade, lerp, tr, blinkAt, C, JESUS, TW, PI, nt, NIGHT,
} from './lib.js';

const GY = 700, JX = 800;
const JDX = ARREST.JDX;

export default {
  id: 'j18-iam',
  beats: [
    { v: 3, text: 'Judasz, otrzymawszy kohortę oraz strażników od arcykapłanów i faryzeuszów,' },
    { v: 3, cont: true, text: 'przybył tam z latarniami, pochodniami i bronią.' },
    { v: 4, text: 'A Jezus wiedząc o wszystkim, co miało na Niego przyjść, wyszedł naprzeciw' },
    { v: 4, cont: true, text: 'i rzekł do nich: «Kogo szukacie?»' },
    { v: 5, text: 'Odpowiedzieli Mu: «Jezusa z Nazaretu».' },
    { v: 5, cont: true, text: 'Rzekł do nich Jezus: «Ja jestem».' },
    { v: 5, cont: true, text: 'Również i Judasz, który Go wydał, stał między nimi.' },
    { v: 6 },
  ],
  cam: { x: [-140, 60], y: [-120, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { zigzag: true, cityX: 520, moonAt: [1250, 130] });
    const line = torchLine(S, N.torchL, N.zz, 13, 0.045);
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);

    // the light behind Him ("I AM")
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const aura = glowL.add(`<g><circle r="260" fill="url(#halo-glow)"/>${radiance(c, 120)}</g>`);
    const pool = glowL.add(`<g><ellipse cx="0" cy="-110" rx="380" ry="260" fill="url(#warm-glow)" opacity=".55"/></g>`);

    // the band and Judas, the Eleven, Jesus
    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, BAND);
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const jdEl = peopleL.add(withFace(person(c, TW.judas), faceBits(c)));
    const judas = S.puppet(jdEl);
    const jdSad = jdEl.querySelector('[data-part="sad"]');
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: DIS });

    // words and light
    const fx = S.layer({ par: 0.56, sh: 4 });
    const who = fx.add(`<g>${say(c, tr('Kogo szukacie?', 'Who are you looking for?'), { size: 21, side: -1 })}</g>`);
    const ans = fx.add(`<g>${say(c, tr('Jezusa z Nazaretu', 'Jesus of Nazareth'), { size: 20, side: 1, fill: nt(C.stone2, 0.25) })}</g>`);
    const am = hanging(fx, iAm(c, tr('JA JESTEM', 'I AM'), { size: 34 }), { x: JX, y: 250, len: 700 });
    const jTag = hanging(fx, nameTag(c, [tr('Judasz,', 'Judas,'), tr('który Go wydał', 'who betrayed Him')], { size: 15, dark: true }), { x: JDX, y: 330, len: 700 });
    const flashL = S.layer({ par: 0.6, sh: 0, flat: true });
    flashL.add(`<g transform="translate(${JX} 520)">${rayBurst(c, { n: 22, r0: 60, r1: 1100, o: 0.55 })}</g><rect x="-3000" y="-3000" width="8000" height="8000" fill="#fff6dc" opacity=".35"/>`);
    const darkL = S.layer({ par: 0.62, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0e0c20" opacity=".5"/>`);
    const spot = S.layer({ par: 0.62, sh: 0, flat: true });
    spot.add(`<ellipse cx="${JDX}" cy="600" rx="150" ry="230" fill="url(#halo-glow)" opacity=".7"/>`);

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v3 — the torchlight procession down the zigzag, then the band arrives */
      line(es(t, 0.05, 1.6, ease.sine) * 1.55, 1 - es(t, 1.45, 1.7), T);
      const arrive = es(t, 1.05, 1.75, ease.out);
      const fall = (i) => es(t, 7.12 + i * 0.03, 7.45 + i * 0.03, ease.in);
      const flash = bump(t, 7.02, 7.5);
      const rise5 = es(t, 5.05, 5.4);
      band.forEach((m) => {
        const k = es(t, 1.05 + m.i * 0.035, 1.7 + m.i * 0.035, ease.out);
        const x = lerp(m.x - 740, m.x - 40, k);
        const f = fall(m.i);
        bandPose(m, { x: x - f * 26, y: GY + m.y, s: m.s ?? 1, r: -f * (62 + (m.i % 3) * 7), o: k > 0.001 ? 1 : 0, walk: k > 0 && k < 1 ? x * 0.05 : undefined, lean: -bump(t, 5.1, 5.9) * 3, flameK: 1 - f * 0.55 }, T);
      });
      vis(pool, { x: lerp(-200, 470, arrive), y: GY, o: arrive > 0.001 ? 1 - fall(0) * 0.6 : 0 });

      // Judas at their head
      const jk = es(t, 0.95, 1.6, ease.out);
      const jdx = lerp(JDX - 700, JDX, jk);
      const jf = es(t, 7.1, 7.42, ease.in);
      judas.set({ x: jdx - jf * 20, y: GY + 10, s: 1.0, r: -jf * 70, flip: false, o: jk > 0.001 ? 1 : 0, walk: jk > 0 && jk < 1 ? jdx * 0.05 : undefined, armF: 18 + bump(t, 1.6, 2.4) * 30, armB: 8, head: es(t, 6.05, 6.4) * 10 * (1 - jf), blink: blinkAt(T, 2) });
      fade(jdSad, es(t, 6.05, 6.4));

      /* v4 — He knows all, steps out to meet them */
      const step = es(t, 2.1, 2.8, ease.sine);
      const jx = lerp(880, JX + 10, step);
      const speak4 = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.05));
      const speak5 = es(t, 5.05, 5.3) * (1 - es(t, 5.95, 6.1)) + es(t, 7.0, 7.1) * (1 - es(t, 7.6, 7.9));
      J.p.set({ x: jx, y: GY + 6, s: 1.04, flip: true, walk: step > 0 && step < 1 ? jx * 0.05 : undefined, armF: 20 + speak4 * 40 + speak5 * 30, armB: 10 + speak5 * 50, head: -speak5 * 4, blink: blinkAt(T) });
      fade(J.sad, 0);
      const fear = es(t, 1.2, 1.7) * (1 - es(t, 7.4, 7.9) * 0.6);
      D.forEach((m) => {
        const back = es(t, 1.2 + m.i * 0.02, 1.6 + m.i * 0.02) * 16;
        m.p.set({ x: m.x + back, y: m.y, s: m.s, flip: true, armF: m.arm, armB: 8 + fear * 30, head: -fear * 6 + es(t, 7.1, 7.5) * 8, lean: fear * 3, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear * 0.9);
        lamp(m, 0.9, 0, T);
      });

      // "I AM": the light behind Him
      const lit = es(t, 5.1, 5.45) * (1 - es(t, 7.7, 8.0) * 0.5) + es(t, 2.2, 2.8) * 0.25 * (1 - es(t, 5.1, 5.3));
      vis(aura, { x: jx, y: GY - 120, s: 0.4 + lit * 0.62 + flash * 0.3, r: T ? T * 2 : 0, o: Math.min(1, lit) });
      const amK = es(t, 5.1, 5.4, ease.out) * (1 - es(t, 7.7, 7.95, ease.in));
      vis(am, { x: JX, y: 236 - (1 - amK) * 700, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: amK > 0.01 ? 1 : 0 });
      flashL.fade(flash);

      // bubbles
      const [hx, hy] = headAt(jx, GY + 6, 1.04, true);
      const w1 = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(who, { x: hx - 16, y: hy - 22, s: w1, o: w1 > 0.01 ? 1 : 0 });
      const [bx, by] = headAt(BAND[1].x, GY + BAND[1].y, 1, false);
      const a1 = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.9, 5.0));
      vis(ans, { x: bx + 14, y: by - 24, s: a1, o: a1 > 0.01 ? 1 : 0 });

      // Judas among them
      const jt = es(t, 6.1, 6.4, ease.out) * (1 - es(t, 6.9, 7.05, ease.in));
      vis(jTag, { x: JDX + 6, y: 336 - (1 - jt) * 700, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: jt > 0.01 ? 1 : 0 });
      const dim = es(t, 6.05, 6.35) * (1 - es(t, 6.9, 7.05));
      darkL.fade(dim * 0.9 + es(t, 1.2, 1.8) * 0.25 * (1 - dim));
      spot.fade(dim);

      S.cam.x = kf(t, [[0, -120], [1, -120], [1.8, -60], [2.9, -20], [3.9, 0], [4.2, -60], [4.9, -60], [5.2, 0], [5.9, 0], [6.2, -80], [6.9, -80], [7.3, -110]]);
      S.cam.y = kf(t, [[0, -100], [1, -90], [1.8, 20], [2.9, 30], [5.0, 30], [5.3, 0], [5.9, 0], [6.2, 40], [6.9, 40], [7.3, 10]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.14], [1.8, 1.04], [2.9, 1.1], [3.9, 1.14], [4.9, 1.12], [5.3, 1.02], [5.9, 1.02], [6.2, 1.22], [6.9, 1.22], [7.3, 1.0]]);
    };
  },
};
