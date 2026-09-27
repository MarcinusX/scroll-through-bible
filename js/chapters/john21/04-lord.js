// J 21,7–8 — The disciple whom Jesus loved turns to Peter and points at the shore: "It is the Lord!" — the words
// hang in gold, the mist lifts, the Man on the beach shines. Peter hears it and startles (a heart leaps). He snatches
// up his outer garment — it flies onto him — and throws himself into the sea: a splash, and there he goes, swimming
// hard for the shore, head bobbing. The others bring the boat in, dragging the net full of fish: "about two hundred
// cubits" — a measuring cord stretches over the water, and Peter already stands dripping in the shallows.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  dawnSet, clipAbove, portraitPlate, PETER_BARE, SHORE, SUNRISE, MORNING, PETER, fullNet, flyingMantle, splashCrown, waterPatch, hungGold, rayBurst, heart, GLYPH, strip, labelTag,
  withFace, faceBits, skyKeys, kf, headAt, vis, pose, fade, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const B0 = { x: SHORE.bx, y: SHORE.by, s: SHORE.bs };
const B1 = { x: 1050, y: 640, s: 0.78 };      // the boat come in close
const WET = [830, 742];                       // where Peter stands up in the shallows

export default {
  id: 'j21-lord',
  beats: [
    { v: 7, text: 'Powiedział więc do Piotra ów uczeń, którego Jezus miłował: «To jest Pan!»' },
    { v: 7, cont: true, text: 'Szymon Piotr usłyszawszy, że to jest Pan,' },
    { v: 7, cont: true, text: 'przywdział na siebie wierzchnią szatę - był bowiem prawie nagi -' },
    { v: 7, cont: true, text: 'i rzucił się w morze.' },
    { v: 8 },
  ],
  cam: { x: [0, 240], y: [-20, 90], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const peterM = `<g data-k="peterM">${withFace(person(c, PETER), faceBits(c))}</g>`;
    const D = dawnSet(S, { skyCols: SUNRISE, sunY: 330, boatOpts: { extra: peterM }, burst: true });
    const { K, B, jesus, jGlow, fx, boatL } = D;
    const pM = S.puppet(S.$('peterM').firstElementChild);
    const P = B.crew.find((m) => m.k === 'peter'), J = B.crew.find((m) => m.k === 'john');

    /* behind Jesus: a soft burst of light when He is recognised */
    const burst = D.burst;

    /* the full net at the stern, dragged along */
    const net = boatL.add(`<g>${clipAbove(S, fullNet(c, { w: 250, h: 100, n: 36 }), 40)}<path d="${c.ribbon(Array.from({ length: 14 }, (_, i) => [i * 20, 40 + Math.sin(i * 1.7) * 2]), 3)}" fill="${C.foam}" opacity=".9"/></g>`);
    const rope = boatL.add(`<path d="M0 0H1" stroke="${C.rope}" stroke-width="3" vector-effect="non-scaling-stroke" fill="none"/>`);

    /* Peter: jumping, swimming, standing up wet */
    const swimL = S.layer({ par: 0.55, sh: 4 });
    const jump = S.puppet(swimL.add(person(c, PETER)));
    const swimW = swimL.add(`<g>${clipAbove(S, person(c, PETER), -118, { y0: -600 })}</g>`);
    const swim = S.puppet(swimW.querySelector('.fig'));
    const patch = swimL.add(`<path d="${c.ribbon(Array.from({ length: 9 }, (_, i) => [-56 + i * 14, Math.sin(i * 1.9) * 2.5]), 4)}" fill="${C.foam}"/>`);
    const splash = swimL.add(`<g>${splashCrown(c, 46, 9)}</g>`);
    const drops = Array.from(splash.querySelectorAll('.drop'));
    const wake = [0, 1, 2].map(() => swimL.add(`<path d="${c.ribbon(c.arc(0, 0, 26, 6, PI * 0.1, PI * 0.9, 10), 2.2)}" fill="${C.foam}"/>`));
    const wetP = S.puppet(D.jL.add(withFace(person(c, PETER), faceBits(c))));
    const drips = [0, 1, 2, 3].map(() => D.jL.add(`<path d="${c.cut([[0, -5], [3, 0], [0, 3], [-3, 0]], 0.1, 2)}" fill="#cfe6ea"/>`));
    const cloak = fx.add(`<g>${flyingMantle(c, C.ochre)}</g>`);
    const plateBare = fx.add(portraitPlate(S, PETER_BARE, { r: 70, sc: 1.2, dy: 4, face: mix(C.lake, C.skyBlue, 0.4), glow: false }));
    const plateCoat = fx.add(portraitPlate(S, PETER, { r: 70, sc: 1.2, dy: 4, face: mix(C.lake, C.skyBlue, 0.4), glow: false }));
    const plateMantle = fx.add(`<g>${flyingMantle(c, C.ochre)}</g>`);

    /* words */
    const lord = fx.add(hungGold(c, tr('To jest Pan!', 'It’s the Lord!'), { size: 36 }));
    const pHeart = fx.add(`<g>${heart(c, 14)}</g>`);
    const bang = fx.add(`<g>${GLYPH.bang(c)}</g>`);
    const cordL = S.layer({ par: 0.55, sh: 2 });
    const cord = cordL.add(`<path d="M0 0H1" stroke="${C.cream}" stroke-width="2" stroke-dasharray="7 6" vector-effect="non-scaling-stroke" fill="none"/>`);
    const cubits = cordL.add(`<g>${labelTag(tr('ok. 200 łokci', 'about 200 cubits'), 18)}</g>`);

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, SUNRISE], [5, MORNING]]);
      K.idle(T, { sunY: lerp(330, 270, es(t, 0, 5)) });
      pose(K.sunPath, { x: 1250, y: 440, o: 0.7 });
      if (D.mistL) { D.mistL.fade(0.45 * (1 - es(t, 0.2, 0.7))); D.mistL.shift(60 + es(t, 0.2, 0.8) * 200, 0); }

      /* the boat: heeling with the net, then coming in */
      const come = es(t, 4.05, 4.9);
      const bx = lerp(B0.x, B1.x, come), by = lerp(B0.y, B1.y, come), bs = lerp(B0.s, B1.s, come);
      const leapK = es(t, 3.05, 3.3);
      const rockA = Math.sin(T * 1.1) * 1.2 + 5 + bump(t, 3.05, 3.4) * -6;
      B.set({ x: bx, y: by + Math.sin(T * 1.3) * 2 + 4, s: bs, r: -rockA, flip: true });

      /* crew */
      const say = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.2) * 0.6);
      const hear = es(t, 1.05, 1.2);
      const dress = es(t, 2.2, 2.3);
      const gone = seg(t, 3.08, 3.12);
      B.crew.forEach((m) => {
        if (!m.p) return;
        if (m.k === 'john') {
          m.p.set({ x: m.x, y: 18, s: 0.8, flip: true, armF: 20 + say * 80, armB: 10 + say * 30, head: -say * 6, blink: blinkAt(T, m.seed) });
          fade(m.sad, 0);
          return;
        }
        if (m.k === 'peter') {
          m.p.set({ x: m.x, y: 18, s: 0.8, flip: hear < 0.5, o: 1 - dress, armF: 20 + hear * 40, armB: 14 + hear * 30, head: -hear * 8, blink: blinkAt(T, m.seed) });
          return;
        }
        const haul = 1 - come * 0.4;
        const pullers = m.k === 'thomas' || m.k === 'other1' || m.k === 'other2' || m.k === 'nathanael' || m.k === 'james';
        const look = es(t, 0.3, 0.6);
        m.p.set({ x: m.x, y: 18, s: 0.8, flip: pullers && t < 0.2, armF: 20 + (pullers ? haul * 60 : 0) + look * 10, armB: 10 + (pullers ? haul * 40 : 0), lean: pullers ? -haul * 8 : 0, head: -look * 4 + bump(t, 3.1, 3.6) * 10, blink: blinkAt(T, m.seed) });
        fade(m.sad, 0);
      });
      // Peter in his outer garment, inside the boat, until he leaps
      pM.set({ x: P.x, y: 18, s: 0.8, flip: false, o: dress * (1 - gone), armF: 30 + bump(t, 2.2, 2.7) * 90 + es(t, 2.9, 3.08) * 60, armB: 20 + bump(t, 2.2, 2.7) * 120 + es(t, 2.9, 3.08) * 80, lean: -es(t, 2.9, 3.08) * 14, head: -6, blink: blinkAt(T, 3) });

      /* the gold words; the mist lifts; He shines */
      const gk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      vis(lord, { x: 880, y: lerp(-300, 300, gk), r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: gk > 0.01 ? 1 : 0 });
      const shine = es(t, 0.3, 0.7);
      jesus.set({ x: SHORE.jx, y: SHORE.jy, s: 1.02, flip: false, armF: 14 + es(t, 3.6, 4.0) * 40 + es(t, 4.2, 4.6) * 20, armB: 8 + es(t, 3.6, 4.0) * 60, head: -2, blink: blinkAt(T) });
      pose(jGlow, { x: SHORE.jx, y: SHORE.jy - 120, s: 1 + shine * 0.3, o: 0.35 + shine * 0.45 });
      vis(burst, { x: SHORE.jx, y: SHORE.jy - 120, s: 0.5 + shine * 0.4, r: T * 3, o: shine * 0.5 * (1 - es(t, 4.2, 4.9) * 0.5) });

      /* v7b — Peter hears: a leap of the heart */
      const [phx, phy] = headAt(bx - P.x * bs, by + 18 * bs, bs * 0.8, true);
      const hk = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      vis(bang, { x: phx + 8, y: phy - 34, s: hk, o: hk > 0.01 ? 1 : 0 });
      const hh = es(t, 1.2, 1.9);
      vis(pHeart, { x: phx - 4, y: phy + 40 * bs - hh * 50, s: 0.6 + bump(t, 1.2, 1.9) * 0.5 + (T ? Math.sin(T * 8) * 0.05 : 0), o: bump(t, 1.15, 2.0) });

      /* v7c — the garment flies up onto him */
      const fk = es(t, 2.05, 2.25);
      const px = bx - P.x * bs, py = by + 18 * bs;
      vis(cloak, { x: lerp(px + 80 * bs, px, fk), y: lerp(py - 40 * bs, py - 120 * bs, fk) - Math.sin(fk * PI) * 60, r: lerp(-30, 10, fk) + (T ? Math.sin(T * 6) * 4 : 0), s: bs, o: fk > 0.01 && fk < 0.99 ? 1 : 0 });

      /* the close-up plate: Peter's face on hearing; the garment drops onto his shoulders */
      const plk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 2.85, 3.1, ease.in));
      const ply = lerp(-400, 300, plk), plr = T ? Math.sin(T * 0.8) * 1.5 : 0;
      const coat = es(t, 2.2, 2.45);
      vis(plateBare, { x: 1010, y: ply, r: plr, o: plk > 0.01 ? 1 - seg(t, 2.4, 2.45) : 0 });
      vis(plateCoat, { x: 1010, y: ply, r: plr, o: plk > 0.01 ? seg(t, 2.4, 2.45) : 0 });
      vis(plateMantle, { x: 1010 - 10, y: ply + lerp(-90, 30, coat), s: 1.4, r: lerp(-20, 0, coat), o: coat > 0.01 && coat < 0.99 ? 1 : 0 });

      /* v7d — the leap, the splash, swimming for the shore */
      const lk = es(t, 3.08, 3.3, (u) => u);
      const inWater = seg(t, 3.28, 3.32);
      const jx0 = px, jy0 = py, jx1 = px - 110, jy1 = by + 40;
      jump.set({ x: lerp(jx0, jx1, lk), y: lerp(jy0, jy1, lk) - Math.sin(lk * PI) * 110, s: 0.8 * bs, flip: true, r: -lk * 40, armF: 150, armB: 170, o: gone * (1 - inWater) });
      const sk = es(t, 3.28, 3.7);
      drops.forEach((d, i) => {
        const a = -PI * (0.15 + (i / 8) * 0.7), v = 60 + (i % 3) * 20;
        pose(d, { x: Math.cos(a) * v * sk, y: Math.sin(a) * v * sk + sk * sk * 60, o: 1 - sk });
      });
      vis(splash, { x: jx1, y: jy1, s: 0.9, o: inWater * (1 - es(t, 3.55, 3.8)) });
      // swimming: from the splash to the shallows (by the end of v8)
      const swimK = es(t, 3.35, 4.6, ease.sine);
      const sx = lerp(jx1, WET[0] + 20, swimK), sy = lerp(jy1, WET[1] - 12, swimK) + (T ? Math.sin(T * 5) * 3 : 0);
      const stand = es(t, 4.6, 4.72);
      const stroke = T ? Math.sin(T * 4.5) : 0;
      vis(swimW, { x: sx, y: sy + 118 * 0.9, s: 0.9, o: inWater * (1 - stand) });
      swim.set({ flip: true, armF: 120 + stroke * 50, armB: 120 - stroke * 50, lean: -10, head: -8 });
      vis(patch, { x: sx - 4, y: sy, s: 1, o: inWater * (1 - stand) });
      wake.forEach((w, i) => {
        const k = ((T * 0.9 + i / 3) % 1);
        vis(w, { x: sx + 30 + k * 60, y: sy + 2, s: 0.6 + k, o: inWater * (1 - stand) * (1 - k) });
      });
      wetP.set({ x: WET[0], y: WET[1], s: 0.96, flip: true, armF: 30 + bump(t, 4.7, 5.0) * 40, armB: 60, head: -6, blink: blinkAt(T, 2), o: stand });
      drips.forEach((d, i) => {
        const k = ((T * 1.4 + i / 4) % 1);
        pose(d, { x: WET[0] - 22 + i * 14, y: WET[1] - 130 + k * 120, o: stand * (1 - k) * 0.9 });
      });

      /* v8 — the boat comes in dragging the net; about 200 cubits */
      const nx = bx + 150 * bs, ny = by + 20 * bs;
      vis(net, { x: nx, y: ny - 20, s: bs * 1.1, o: 1 });
      const hx = bx + 120 * bs, hy = by - 80 * bs;
      vis(rope, { x: hx, y: hy, s: 1, sx: Math.hypot(nx - hx, ny - 20 - hy), r: Math.atan2(ny - 20 - hy, nx - hx) * 180 / PI, o: 1 });
      const ck = es(t, 4.1, 4.4);
      const c0 = [bx - 225 * bs, by + 6], c1 = [900, 722];
      vis(cord, { x: c0[0], y: c0[1], sx: Math.hypot(c1[0] - c0[0], c1[1] - c0[1]) * ck, r: Math.atan2(c1[1] - c0[1], c1[0] - c0[0]) * 180 / PI, o: ck > 0.01 ? 1 : 0 });
      const tk = es(t, 4.3, 4.55, ease.back);
      vis(cubits, { x: 930, y: 520, s: tk, r: T ? Math.sin(T * 1.2) * 2 : 0, o: tk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 90], [0.9, 90], [1.2, 220], [2.9, 220], [3.3, 130], [4.1, 70], [5, 60]]);
      S.cam.y = kf(t, [[0, 40], [1.2, -10], [2.9, -10], [3.4, 40], [5, 50]]);
      S.cam.z = kf(t, [[0, 1.08], [0.9, 1.08], [1.2, 1.55], [2.9, 1.55], [3.3, 1.16], [4.1, 1.06], [5, 1.08]]);
    };
  },
};
