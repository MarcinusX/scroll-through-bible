// J 8,31–36 — "If you remain in My word" — an open scroll hangs in light over those who believed and they come
// closer. "The truth will make you free" — in a round window a small figure's chains fall away in sparks. "We are
// Abraham's offspring and have never been slaves" — a sepia portrait of Abraham by his tent is held up; "?". "Amen,
// amen" — His hand rises. On a lit shadow-screen: a figure bound by dark cords, pulled down (the slave of sin); a
// house — the servant goes out of the door, which closes, while the son stays in the lit doorway; then the cords
// snap, the figure stands up free, and a dove flies out of the screen.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { nightStage, DC, NIGHT, voiceRings, scrollOpen, chain, plateR, framed, ABRAHAM, tentMamre, sepia, question, shadowPerson, bonds, houseFront, spark, hanging, swing, kf, vis, tr, PI, INK } from './lib.js';
import { dove, flapWings } from '../mark1/lib.js';

const SCR = { x: 800, y: 120, w: 440, h: 270 };   // the shadow screen (top centre)

export default {
  id: 'j8-free',
  beats: [
    { v: 31 },
    { v: 32 },
    { v: 33, text: 'Odpowiedzieli Mu: «Jesteśmy potomstwem Abrahama i nigdy nie byliśmy poddani w niczyją niewolę.' },
    { v: 33, cont: true, text: 'Jakżeż Ty możesz mówić: "Wolni będziecie?"»' },
    { v: 34, text: 'Odpowiedział im Jezus: «Zaprawdę, zaprawdę, powiadam wam:' },
    { v: 34, cont: true, text: 'Każdy, kto popełnia grzech, jest niewolnikiem grzechu.' },
    { v: 35 },
    { v: 36 },
  ],
  cam: { x: [-60, 80], y: [-120, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const fx = st.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    const scroll = hanging(fx, `<circle r="120" fill="url(#halo-glow)"/><g transform="scale(1.6)">${scrollOpen(c, 90, 60)}</g>`, { x: 560, y: 300, len: 700 });
    // the round window: a small figure, chains that fall
    const win = fx.add(`<g>${plateR(S, `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.halo, C.parchment, 0.4)}"/>`, { r: 80, rim: C.wood3, bg: C.parchment, k: 'win' })}</g>`);
    const fig = S.puppet(fx.add(person(c, { robe: C.stone2, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2 })));
    const chains = [0, 1, 2].map((i) => fx.add(`<g>${chain(c, 6, 6, C.rock3)}</g>`));
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${spark(c, 9)}</g>`));
    // Abraham's portrait (sepia)
    const abr = `<rect width="260" height="190" fill="${mix(C.parchment, C.dune, 0.3)}"/><g transform="translate(170 170)">${tentMamre(c, 150, 110)}</g><g transform="translate(80 178) scale(.62)">${person(c, sepia(ABRAHAM, 0.45))}</g>`;
    const portrait = fx.add(`<g>${framed(S, abr, { w: 260, h: 190, rim: C.wood3, k: 'abr' })}</g>`);
    const q = fx.add(`<g>${question(c)}</g>`);
    // the shadow screen
    const scrL = S.layer({ par: 0.58, sh: 6 });
    const screen = scrL.add(`<g>${framed(S, `<rect width="${SCR.w}" height="${SCR.h}" fill="#f7e6c4"/><circle cx="${SCR.w / 2}" cy="${SCR.h * 0.6}" r="${SCR.w * 0.55}" fill="url(#warm-glow)" opacity=".7"/><path d="M0 ${SCR.h - 26}H${SCR.w}V${SCR.h}H0Z" fill="${mix(INK, '#f7e6c4', 0.6)}"/>`, { w: SCR.w, h: SCR.h, rim: C.wood2, bg: '#f7e6c4', k: 'scr' })}</g>`);
    const GY = SCR.y + SCR.h - 26;
    const bound = S.puppet(scrL.add(shadowPerson(c, { hairStyle: 'short', beard: 'short' }, INK)));
    const cords = scrL.add(`<g>${bonds(c, '#15101f')}</g>`);
    const hf = houseFront(c, { w: 190, h: 150, wall: mix(INK, '#f7e6c4', 0.62), roof: mix(INK, '#f7e6c4', 0.35), dw: 50, dh: 90 });
    const house = scrL.add(`<g>${hf.wall}</g>`);
    const leaf = scrL.add(`<g>${hf.leaf}</g>`);
    const servant = S.puppet(scrL.add(shadowPerson(c, { hairStyle: 'wrap', beard: 'short' }, INK)));
    const son = S.puppet(scrL.add(shadowPerson(c, { hairStyle: 'long', beard: 'none' }, mix(INK, C.ochre, 0.25))));
    const dv = scrL.add(dove(c, { color: INK, shadow: shade(INK, 0.2) }));

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* v31 — remain in My word */
      const sk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      swing(scroll, 560, 330 - (1 - sk) * 700, sk > 0.001 ? T : 0, 1, 0.7);
      fade(scroll, sk > 0.001 ? 1 : 0);
      const near = es(t, 0.3, 0.9);
      /* v32 — free: the window and the chains */
      const wk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      const WX = 800, WY = 250 - (1 - wk) * 700;
      vis(win, { x: WX, y: WY, o: wk > 0.001 ? 1 : 0 });
      const free = es(t, 1.45, 1.75);
      fig.set({ x: WX, y: WY + 62, s: 0.55, armB: free * 150, armF: 20 + free * 60, head: -free * 8 + (1 - free) * 14, lean: (1 - free) * 6, o: wk > 0.001 ? 1 : 0, blink: blinkAt(T, 3) });
      chains.forEach((ch, i) => {
        const f = es(t, 1.45 + i * 0.05, 1.8 + i * 0.05, ease.in);
        vis(ch, { x: WX - 22 + i * 4, y: WY + 10 + i * 18 + f * 120, r: -10 + i * 8 + f * 60, o: wk > 0.001 ? 1 - f : 0 });
      });
      sparks.forEach((sp, i) => {
        const k = seg(t, 1.45 + i * 0.04, 1.85 + i * 0.04);
        const a = -PI / 2 + (i - 2) * 0.6;
        vis(sp, { x: WX + Math.cos(a) * k * 90, y: WY + 20 + Math.sin(a) * k * 90, s: 1 - k * 0.5, o: k > 0 && k < 1 ? (1 - k) * wk : 0 });
      });
      /* v33 — Abraham's children; "how can you say 'free'?" */
      const ak = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 3.9, 4.15, ease.in));
      vis(portrait, { x: 1060, y: 190 - (1 - ak) * 700, r: Math.sin(T * 0.7) * 0.8 * ak, o: ak > 0.001 ? 1 : 0 });
      const qk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(q, { x: 1000, y: 470, s: qk * 1.4, o: qk > 0.01 ? 1 : 0 });
      /* v34–36 — the shadow screen */
      const sc = es(t, 4.4, 4.8, ease.out);
      vis(screen, { x: SCR.x, y: SCR.y - (1 - sc) * 700, o: sc > 0.001 ? 1 : 0 });
      const onScr = sc > 0.001 ? 1 : 0;
      const dy = -(1 - sc) * 700;
      const aHouse = es(t, 6.0, 6.15) * (1 - es(t, 6.9, 7.05));
      const aBound = 1 - aHouse;
      const snap = es(t, 7.2, 7.45);
      const bx = SCR.x - 40;
      bound.set({ x: bx, y: GY + dy, s: 0.8, o: onScr * aBound, armF: 10 + snap * 70, armB: 5 + snap * 150, head: (1 - snap) * 18 - snap * 10, lean: (1 - snap) * 14 * es(t, 5.1, 5.5), blink: 0 });
      const cordDrop = es(t, 7.25, 7.6, ease.in);
      vis(cords, { x: bx, y: GY + dy + cordDrop * 60, s: 0.8, o: onScr * aBound * es(t, 5.05, 5.35) * (1 - cordDrop) });
      pose(house, { x: SCR.x - 20, y: GY + dy, o: onScr * aHouse });
      const shut = es(t, 6.6, 6.8) * 0;
      pose(leaf, { x: SCR.x - 20 - hf.dw / 2, y: GY + dy, sx: 1 - shut * 0 - (1 - shut) * 0.85, o: onScr * aHouse });
      const out = es(t, 6.15, 6.6);
      const sx = lerp(SCR.x - 10, SCR.x + 200, out);
      servant.set({ x: sx, y: GY + dy, s: 0.55, o: onScr * aHouse * (1 - es(t, 6.6, 6.75)), walk: out > 0 && out < 1 ? sx * 0.08 : undefined, blink: 0 });
      son.set({ x: SCR.x - 90, y: GY + dy, s: 0.55, o: onScr * aHouse, flip: false, armB: 20 + es(t, 6.6, 6.8) * 40, blink: 0 });
      const fly = es(t, 7.4, 7.95);
      vis(dv, { x: bx + 30 + fly * 170, y: GY - 130 + dy - fly * 70, s: 0.8, o: fly > 0 && fly < 0.98 ? 1 : 0 });
      if (fly > 0 && fly < 1) flapWings(dv, T || t * 30);

      const talk = Math.max(bump(t, 0.05, 1.95), bump(t, 4.3, 5.95), bump(t, 6.05, 7.95));
      const amen = bump(t, 4.05, 4.95);
      K.set(T, {
        j: { flip: t < 1.95, armF: 16 + talk * 26, armB: 10 + amen * 150 + snap * 40, head: -amen * 10 },
        lisF: (m) => ({ x: m.x + near * 40 * (m.i < 4 ? 1 : 0.6), walk: near > 0 && near < 1 ? m.x * 0.06 + near * 20 : undefined, head: -4 - (1 - es(t, 2, 2.2)) * sk * 6 }),
        leadF: (m) => ({ head: -ak * 10 * (m.i < 3 ? 1 : 0.5), armF: 20 + (m.i === 0 ? ak * 80 * (1 - es(t, 3.0, 3.2)) : 0) + (m.i === 1 ? bump(t, 3.05, 3.9) * 70 : 0), angry: 0.4 + bump(t, 2.1, 3.9) * 0.3 }),
      });
      rings(DC.JX + (t < 1.95 ? -6 : 6), DC.FLOOR - 172, talk, T, { dir: t < 1.95 ? -1 : 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, -40], [1.0, -30], [1.3, 0], [2.0, 0], [2.3, 60], [3.9, 60], [4.3, 0]]);
      S.cam.y = kf(t, [[0, -20], [1.2, -60], [2.0, -40], [2.3, -60], [4.3, -40], [4.8, -110]]);
      S.cam.z = kf(t, [[0, 1.08], [1.2, 1.04], [2.3, 1.04], [4.3, 1.04], [4.8, 1.1]]);
    };
  },
};
