// Mt 26,47–50 — while He is still speaking, torches among the olive trees: Judas, one of the Twelve, in colour, and
// behind him a great crowd with swords and clubs — dark shadow-play cut-outs (as John 18 cut them) — sent by the chief
// priests and elders (their seal on a plate). The sign: a kiss, whispered to the band. "Hail, Rabbi!" — and the kiss,
// one held moment in a narrow light. "Friend, why are you here?" — a warm word. Then they come, lay hands on Him and
// take Him: two dark figures step in on either side.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  nightSet, gardenTrees, eleven, makeBand, bandPose, hanging, vis, kf, moving, hand, headAt, withFace, faceBits, person, pose, fade, lerp, mix, tr,
  blinkAt, C, TW, CAST, PI, nt, say, speech, discPlate, seal, kissIcon, shadowPerson, guardOpts, cord, vignette, BAND_INK, MOB, ELEVEN,
} from './lib.js';

const GY = 700, JX = 800;
export default {
  id: 'mt26-kiss',
  beats: [
    { v: 47 },
    { v: 48 },
    { v: 49 },
    { v: 50, text: 'A Jezus rzekł do niego: «Przyjacielu, po coś przyszedł?»' },
    { v: 50, cont: true, text: 'Wtedy podeszli, rzucili się na Jezusa i pochwycili Go.' },
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
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: ELEVEN, lamps: false, arm: 16 });
    const cordEl = peopleL.add(`<g>${cord(c)}</g>`);
    const front = S.layer({ par: 0.52, sh: 5 });
    const grab = [0, 1].map((i) => ({ i, p: S.puppet(front.add(shadowPerson(c, guardOpts(c), BAND_INK))) }));

    const spotL = S.layer({ par: 0.54, sh: 0, flat: true });
    spotL.add(vignette(S, { cx: 745, cy: 520, r: 300, col: '#0c0a18', o: 0.75 }));
    spotL.fade(0);
    const fx = S.layer({ par: 0.56, sh: 4 });
    const authority = hanging(fx, discPlate(c, seal(c, 26), { r: 34, rim: C.stone2, fill: C.parchment }), { x: 0, y: -1500, len: 600 });
    const sign = fx.add(`<g>${speech(c, `<circle r="20" fill="url(#halo-glow)"/>${kissIcon(c)}`, { w: 64, h: 46, flip: false })}</g>`);
    const hail = fx.add(`<g>${say(c, tr('Witaj, Rabbi!', 'Hail, Rabbi!'), { size: 21, side: 1 })}</g>`);
    const friend = fx.add(`<g>${say(c, [tr('Przyjacielu,', 'Friend,'), tr('po coś przyszedł?', 'why are you here?')], { size: 19, side: -1, fill: mix(C.cream, C.halo, 0.3) })}</g>`);

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v47 — Judas, and the great crowd with swords and clubs */
      const arrive = es(t, 0.05, 0.8, ease.out);
      const surge = es(t, 4.05, 4.4);
      band.forEach((m) => {
        const k = es(t, 0.05 + m.i * 0.03, 0.75 + m.i * 0.03, ease.out);
        const x = lerp(m.x - 760, m.x - 60, k) + surge * (m.i < 4 ? 40 : 20);
        bandPose(m, { x, y: GY + m.y, s: m.s ?? 1, o: k > 0.001 ? 1 : 0, walk: k > 0 && k < 1 ? x * 0.05 : undefined, lean: surge * 4 }, T);
      });
      vis(pool, { x: lerp(-200, 460, arrive) + surge * 120, y: GY, o: 1 });
      const aIn = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      vis(authority, { x: 380, y: 300 - (1 - aIn) * 700, r: Math.sin(T) * 3, o: aIn > 0.01 ? 1 : 0 });

      // Judas: at their head; turns to give them the sign; walks up to Him, kisses Him; steps back
      const jdK = [[-0.2, [-120, GY + 8]], [0.8, [600, GY + 8]], [2.05, [600, GY + 8]], [2.5, [736, GY + 8]], [3.9, [736, GY + 8]], [4.4, [560, GY + 8]]];
      const [jdx, jdy] = kf(t, jdK, ease.sine);
      const toBand = es(t, 1.05, 1.15) * (1 - es(t, 1.9, 2.0));
      const kiss = es(t, 2.45, 2.62) * (1 - es(t, 3.05, 3.2));
      judas.set({ x: jdx, y: jdy, s: 1.0, flip: toBand > 0.5 || t > 4.0, walk: moving(t, jdK, 1) ? jdx * 0.05 : undefined, armF: 20 + toBand * 40 + kiss * 40, armB: 8 + bump(t, 2.1, 2.5) * 60 + kiss * 30, head: kiss * 10 - toBand * 4 + es(t, 3.1, 3.4) * 12, lean: kiss * 8, blink: blinkAt(T, 2) });
      fade(jdAngry, toBand * 0.6);
      fade(jdSad, es(t, 3.2, 3.5));
      const [jhx, jhy] = headAt(jdx, jdy, 1.0, toBand > 0.5);
      const sg = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.85, 1.95));
      vis(sign, { x: jhx - 8, y: jhy - 24, s: sg, o: sg > 0.01 ? 1 : 0 });
      const hk = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(hail, { x: jhx - 6, y: jhy - 30, s: hk, o: hk > 0.01 ? 1 : 0 });
      spotL.fade(es(t, 2.4, 2.6) * (1 - es(t, 3.9, 4.1)));

      /* Jesus: still; "Friend"; bound */
      const bound = es(t, 4.35, 4.6);
      const speak = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.05));
      J.p.set({ x: JX, y: GY + 6, s: 1.04, flip: true, armF: 20 + speak * 40 * (1 - bound) + bound * 6, armB: 10 + speak * 30 + bound * 14, head: kiss * 6 + bound * 8 - speak * 4, blink: blinkAt(T) });
      fade(J.sad, kiss * 0.8 + speak * 0.6 + bound);
      const [fhx, fhy] = headAt(JX, GY + 6, 1.04, true);
      const fk = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(friend, { x: fhx - 6, y: fhy - 34, s: fk, o: fk > 0.01 ? 1 : 0 });
      const [chx, chy] = hand(JX, GY + 6, 1.04, true, 26);
      vis(cordEl, { x: chx, y: chy, s: bound * 1.1, sx: -1, o: bound > 0.01 ? 1 : 0 });

      /* v50b — they seize Him */
      grab.forEach((g) => {
        const k = es(t, 4.05 + g.i * 0.08, 4.4 + g.i * 0.08, ease.out);
        const x = g.i === 0 ? lerp(420, 720, k) : lerp(300, 690, k);
        g.p.set({ x, y: GY + 16 + g.i * 6, s: 1.0, flip: false, o: k > 0.01 ? 1 : 0, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 20 + k * 60, armB: k * 40, lean: k * 6 });
      });

      /* the Eleven: afraid */
      const fear = es(t, 0.3, 0.8);
      D.forEach((m) => {
        m.p.set({ x: m.x + 20, y: m.y, s: m.s, flip: true, armF: m.arm + surge * 20, armB: 8 + fear * 30 + surge * 50, head: -fear * 6, lean: fear * 3, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear * 0.9);
      });

      S.cam.x = kf(t, [[-0.5, -140], [0.8, -120], [1.0, -110], [2.0, -110], [2.4, -40], [3.0, -40], [3.2, -20], [4.0, -20], [4.4, -40]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.8, 1.04], [1.0, 1.2], [2.0, 1.2], [2.4, 1.5], [3.0, 1.5], [3.2, 1.36], [4.0, 1.36], [4.4, 1.14]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.8, 20], [1.0, 80], [2.0, 80], [2.4, 170], [3.0, 170], [3.2, 130], [4.0, 130], [4.4, 60]]);
    };
  },
};
